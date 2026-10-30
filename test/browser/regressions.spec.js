// Regression tests for fixed defects (BASELINE §8 numbers). Each was a
// "[current behaviour]" + "[known bug, expected]" pair in known-bugs.spec.js.
const {test, expect} = require('./fixtures');
const fixtures = require('./chart-fixtures');

const by = Object.fromEntries(fixtures.map(f => [f.name, f]));

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

// §8.12: x.fillMissing uses d3['time' + Interval].offset; the standalone D3
// shim did not re-export d3-time (TypeError reading 'offset')
test('HeatmapTimeSeries x.fillMissing fills the missing days (§8.12)', async ({odc}) => {
    const data = [{t: '2000-01-01', y: 'u', z: 1}, {t: '2000-01-04', y: 'u', z: 2}];
    expect(await tryRender(odc, 'HeatmapTimeSeries', data, {x: {key: 't', fillMissing: true}, y: {key: 'y'}, z: {key: 'z'}}))
        .toEqual({ok: true});
    expect(await odc.run((O, h) => Array.from(document.querySelectorAll('#c1 text.odc-label-x'), t => t.textContent).sort()))
        .toEqual(['2000-01-01', '2000-01-02', '2000-01-03', '2000-01-04']);
});

// §8.13: Legend.linearGradientBar appended a new <linearGradient> on every init()
for (const name of ['heatmap', 'heatmap-timeseries', 'correlation-matrix']) {
    test(name + ': repeated init() keeps one <linearGradient>, referenced by the legend (§8.13)', async ({odc}) => {
        const r = await odc.run((ODCD3, h, f) => {
            const chart = new ODCD3[f.cls]('#c1', f.data, f.config);
            const ids = [document.querySelector('#c1 linearGradient').id];
            chart.init();
            chart.redraw();
            const gradients = document.querySelectorAll('#c1 linearGradient');
            ids.push(gradients[0].id);
            return {count: gradients.length, sameId: ids[0] === ids[1], stops: gradients[0].querySelectorAll('stop').length,
                fill: document.querySelector('#c1 g.odc-legend rect').style.fill.includes(ids[1])};
        }, by[name]);
        expect(r).toMatchObject({count: 1, sameId: true, fill: true});
        expect(r.stops).toBeGreaterThan(1);
    });
}

// §8.14: the charts called showTooltip(html) instead of showTooltip(event, html);
// the tooltip became visible (opacity 0.9) but empty and unpositioned.
// One case per call site (BarChart passed the event already, see lifecycle.spec.js).
// mouseover is dispatched on the element itself: other marks overlap some of
// them (median line over the box, brush overlay over the matrix dots).
for (const [name, selector, html] of [
    ['scatterplot', 'circle.odc-dot', '(1, 2)<br>a'],
    ['line-chart', 'circle.odc-dot', null],
    ['histogram', 'g.odc-bar rect', null],
    ['scatterplot-matrix', 'g.odc-layer circle', null],
    ['heatmap', 'g.odc-cell', null],
    ['correlation-matrix', 'g.odc-cell', null],
    ['box-plot-base', 'rect.odc-box', 'Q3: 40<br>Q2: 35<br>Q1: 30'],
    ['box-plot-base', 'line.odc-boxplot-tick.odc-boxplot-item-low', '22'],
    ['box-plot-base', 'circle.odc-outlier', '17']
]) {
    test(name + ' tooltip shows content at the pointer: ' + selector + ' (§8.14)', async ({odc}) => {
        const f = by[name];
        const t = await odc.run((ODCD3, h, [f, selector]) => {
            new ODCD3[f.cls]('#c1', f.data, Object.assign({}, f.config, {showTooltip: true}));
            const target = document.querySelector('#c1 ' + selector);
            target.dispatchEvent(new MouseEvent('mouseover', {bubbles: true, clientX: 120, clientY: 80}));
            const el = document.querySelector('div.odc-tooltip');
            return {html: el.innerHTML, left: el.style.left, top: el.style.top};
        }, [f, selector]);
        await odc.settle();
        const opacity = await odc.run(() => document.querySelector('div.odc-tooltip').style.opacity);
        // showTooltip places the tooltip at (pageX + 5, pageY - 28)
        expect({left: t.left, top: t.top, opacity}).toEqual({left: '125px', top: '52px', opacity: '0.9'});
        if (html === null) {
            expect(t.html).not.toBe('');
        } else {
            expect(t.html).toBe(html);
        }
    });
}
