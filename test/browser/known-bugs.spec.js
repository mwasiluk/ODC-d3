// Known defects, each tested twice (see test/helpers/known-bug.js):
//  - "[current behaviour]" pins what happens today; any change is a regression;
//  - "[known bug, expected]" asserts the correct behaviour with test.fail():
//    it must keep failing; when the bug is fixed Playwright reports
//    "expected to fail, but passed" and the fix PR turns it into a regular test.
const {test, expect} = require('./fixtures');
const fixtures = require('./chart-fixtures');

const by = Object.fromEntries(fixtures.map(f => [f.name, f]));

// BASELINE §8.4: tValue throws for df <= 3, so Regression bands fail for groups of <= 5 points
const smallGroup = [{x: 1, y: 2, g: 'a'}, {x: 2, y: 3, g: 'a'}, {x: 3, y: 5, g: 'a'}, {x: 4, y: 4, g: 'a'}, {x: 5, y: 6, g: 'a'}];
const regressionConfig = {x: {key: 'x'}, y: {key: 'y'}, groups: {key: 'g'}};

function tryRender(odc, cls, data, config) {
    return odc.run((ODCD3, h, [cls, data, config]) => {
        try {
            new ODCD3[cls]('#c1', data, config);
            return {ok: true};
        } catch (e) {
            return {ok: false, name: e.name, message: e.message};
        }
    }, [cls, data, config]);
}

test('[current behaviour, §8.4] Regression with a 5-point group throws ReferenceError', async ({odc}) => {
    expect(await tryRender(odc, 'Regression', smallGroup, regressionConfig))
        .toEqual({ok: false, name: 'ReferenceError', message: 'i is not defined'});
});

test('[known bug §8.4, expected] Regression with a 5-point group renders confidence bands', async ({odc}) => {
    test.fail(true, 'BASELINE §8.4: statistics-distributions max()/min() use undeclared i');
    expect(await tryRender(odc, 'Regression', smallGroup, regressionConfig)).toEqual({ok: true});
    expect(await odc.run((O, h) => h.count('path.odc-confidence'))).toBeGreaterThan(0);
});

// BASELINE §8.12 (found by these tests): HeatmapTimeSeries x.fillMissing uses
// d3['time' + Interval].offset; the standalone D3 shim does not export d3-time.
const tsData = [{t: '2000-01-01', y: 'u', z: 1}, {t: '2000-01-04', y: 'u', z: 2}];
const tsConfig = {x: {key: 't', fillMissing: true}, y: {key: 'y'}, z: {key: 'z'}};

test('[current behaviour, §8.12] HeatmapTimeSeries x.fillMissing', async ({odc, variant}) => {
    const r = await tryRender(odc, 'HeatmapTimeSeries', tsData, tsConfig);
    if (variant === 'global') {
        expect(r).toEqual({ok: true});
        // 2000-01-01 .. 2000-01-04 filled day by day
        expect(await odc.run((O, h) => h.count('text.odc-label-x'))).toBe(4);
    } else {
        expect(r).toEqual({ok: false, name: 'TypeError', message: "Cannot read properties of undefined (reading 'offset')"});
    }
});

test('[known bug §8.12, expected] HeatmapTimeSeries x.fillMissing works in the standalone bundle', async ({odc, variant}) => {
    test.skip(variant !== 'standalone', 'works in the global variant');
    test.fail(true, 'BASELINE §8.12: src/d3.js does not re-export d3-time');
    expect(await tryRender(odc, 'HeatmapTimeSeries', tsData, tsConfig)).toEqual({ok: true});
    expect(await odc.run((O, h) => h.count('text.odc-label-x'))).toBe(4);
});

// BASELINE §8.13 (found by these tests): Legend.linearGradientBar creates a new
// gradient id on every init() and never removes the previous <linearGradient>.
for (const name of ['heatmap', 'heatmap-timeseries', 'correlation-matrix']) {
    test('[current behaviour, §8.13] ' + name + ': each init() adds a <linearGradient>', async ({odc}) => {
        const counts = await odc.run((ODCD3, h, f) => {
            const chart = new ODCD3[f.cls]('#c1', f.data, f.config);
            const out = [h.count('linearGradient')];
            chart.init();
            out.push(h.count('linearGradient'));
            chart.init();
            out.push(h.count('linearGradient'));
            // the legend bar references the newest gradient
            const fill = document.querySelector('#c1 g.odc-legend rect').style.fill;
            const last = document.querySelectorAll('#c1 linearGradient');
            out.push(fill.includes(last[last.length - 1].id));
            return out;
        }, by[name]);
        expect(counts).toEqual([1, 2, 3, true]);
    });

    test('[known bug §8.13, expected] ' + name + ': repeated init() keeps one <linearGradient>', async ({odc}) => {
        test.fail(true, 'BASELINE §8.13: legend gradients accumulate');
        const n = await odc.run((ODCD3, h, f) => {
            const chart = new ODCD3[f.cls]('#c1', f.data, f.config);
            chart.init();
            chart.init();
            return h.count('linearGradient');
        }, by[name]);
        expect(n).toBe(1);
    });
}

// BASELINE §8.14 (found by these tests): charts call showTooltip(html) but the
// signature is showTooltip(event, html); the tooltip becomes visible but empty
// and unpositioned. BarChart passes the event and works (see lifecycle.spec.js).
async function hoverFirst(odc, f, selector) {
    await odc.run((ODCD3, h, f) => { new ODCD3[f.cls]('#c1', f.data, Object.assign({}, f.config, {showTooltip: true})); }, f);
    await odc.page.locator('#c1 ' + selector).first().hover({force: true});
    await odc.settle();
    return odc.run(() => {
        const el = document.querySelector('div.odc-tooltip');
        return {html: el.innerHTML, opacity: el.style.opacity, left: el.style.left};
    });
}

for (const [name, selector] of [['scatterplot', 'circle.odc-dot'], ['line-chart', 'circle.odc-dot']]) {
    test('[current behaviour, §8.14] ' + name + ' tooltip is shown empty', async ({odc}) => {
        expect(await hoverFirst(odc, by[name], selector)).toEqual({html: '', opacity: '0.9', left: ''});
    });

    test('[known bug §8.14, expected] ' + name + ' tooltip shows the point', async ({odc}) => {
        test.fail(true, 'BASELINE §8.14: showTooltip(html) called without the event');
        const t = await hoverFirst(odc, by[name], selector);
        expect(t.html).not.toBe('');
        expect(t.left).toMatch(/px$/);
    });
}
