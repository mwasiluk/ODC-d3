// Chart lifecycle, configuration, $-accessors, events, attach mode, resize.
const {test, expect} = require('./fixtures');
const fixtures = require('./chart-fixtures');

const scatter = fixtures.find(f => f.name === 'scatterplot');

test('constructor accepts a selector or a DOM node and runs setConfig -> setData -> init -> postInit', async ({odc}) => {
    const r = await odc.run((ODCD3, h, f) => {
        const calls = [];
        class Probe extends ODCD3.ScatterPlot {
            setConfig(c) { calls.push('setConfig'); return super.setConfig(c); }
            setData(d) { calls.push('setData'); return super.setData(d); }
            init() { calls.push('init'); return super.init(); }
            postInit() { calls.push('postInit'); return super.postInit(); }
        }
        new Probe('#c1', f.data, f.config);
        new ODCD3.ScatterPlot(document.getElementById('c2'), f.data, f.config);
        return {calls, svgs: [h.count('svg', 'c1'), h.count('svg', 'c2')]};
    }, scatter);
    expect(r).toEqual({calls: ['setConfig', 'setData', 'init', 'postInit'], svgs: [1, 1]});
});

test('first init() replaces an existing svg in the container', async ({odc}) => {
    const r = await odc.run((ODCD3, h, f) => {
        document.getElementById('c1').innerHTML = '<svg id="old"></svg><p>keep</p>';
        new ODCD3.ScatterPlot('#c1', f.data, f.config);
        return {svgs: h.count('svg'), old: h.count('#old'), p: h.count('p')};
    }, scatter);
    expect(r).toEqual({svgs: 1, old: 0, p: 1});
});

test('setConfig(plain object) merges it over the chart defaults and does not redraw', async ({odc}) => {
    const r = await odc.run((ODCD3, h, f) => {
        const chart = new ODCD3.ScatterPlot('#c1', f.data, f.config);
        const before = h.serialize();
        const ret = chart.setConfig({x: {key: 'x'}, y: {key: 'y'}, title: 'New'});
        return {
            chainable: ret === chart,
            keepsDefaults: [chart.config.dotRadius, chart.config.x.scale, chart.config.margin.left, chart.config.svgClass],
            title: chart.config.title,
            notRedrawn: h.serialize() === before
        };
    }, scatter);
    expect(r).toEqual({chainable: true, keepsDefaults: [2, 'linear', 50, 'odc-scatterplot'], title: 'New', notRedrawn: true});
});

// Every setConfig() in the class chain wraps the config again, so the stored
// object is an instance of the most basic Config class that overrides setConfig
// (current behaviour). update() return values pinned as well.
const CONFIG_CLASS_AND_UPDATE_RETURN = {
    'scatterplot': ['ChartWithColorGroupsConfig', false],
    'scatterplot-matrix': ['ChartWithColorGroupsConfig', false],
    'regression': ['ChartWithColorGroupsConfig', false],
    'correlation-matrix': ['CorrelationMatrixConfig', false],
    'heatmap': ['HeatmapConfig', false],
    'heatmap-timeseries': ['HeatmapConfig', false],
    'histogram': ['ChartWithColorGroupsConfig', true],
    'bar-chart': ['ChartWithColorGroupsConfig', true],
    'box-plot-base': ['BoxPlotBaseConfig', true],
    'box-plot': ['BoxPlotBaseConfig', true],
    'diverging-stacked-bar-chart': ['DivergingStackedBarChartConfig', true],
    'line-chart': ['ChartWithColorGroupsConfig', false]
};

test('stored config class and update() return value per chart (current behaviour)', async ({odc}) => {
    const r = await odc.run((ODCD3, h, fixtures) => {
        const out = {};
        for (const f of fixtures) {
            h.reset();
            const chart = new ODCD3[f.cls]('#c1', f.data, f.config);
            out[f.name] = [chart.config.constructor.name, chart.update(f.data) === chart];
        }
        return out;
    }, fixtures);
    expect(r).toEqual(CONFIG_CLASS_AND_UPDATE_RETURN);
});

test('setConfig().init() applies the new config', async ({odc}) => {
    const r = await odc.run((ODCD3, h, f) => {
        const chart = new ODCD3.ScatterPlot('#c1', f.data, f.config);
        chart.setConfig(Object.assign({}, f.config, {title: 'New', subtitle: undefined, dotRadius: 5})).init();
        return {
            title: document.querySelector('#c1 text.odc-plot-title').textContent,
            subtitles: h.count('text.odc-plot-subtitle'),
            radius: document.querySelector('#c1 circle.odc-dot').getAttribute('r')
        };
    }, scatter);
    await odc.settle();
    expect(r.title).toBe('New');
    expect(r.subtitles).toBe(0);
    expect(await odc.run(() => document.querySelector('#c1 circle.odc-dot').getAttribute('r'))).toBe('5');
});

test('update(data) stores the data; marks follow after init() (current behaviour)', async ({odc}) => {
    await odc.run((ODCD3, h, f) => {
        window.chart = new ODCD3.ScatterPlot('#c1', f.data, f.config);
        window.chart.update(f.data.slice(0, 3));
    }, scatter);
    await odc.settle();
    // grouped data is computed in initPlot(), so update() alone redraws the old points
    expect(await odc.run(() => window.chart.data.length)).toBe(3);
    expect(await odc.run((O, h) => h.count('circle.odc-dot'))).toBe(12);
    await odc.run(() => window.chart.init());
    await odc.settle();
    expect(await odc.run((O, h) => h.count('circle.odc-dot'))).toBe(3);
});

test('$-accessors on a chart instance', async ({odc}) => {
    const r = await odc.run((ODCD3, h, f) => {
        const chart = new ODCD3.ScatterPlot('#c1', f.data, f.config);
        const out = {title: chart.$title(), xKey: chart.$x.$key(), radius: chart.$dotRadius()};
        out.chain = chart.$title('Via accessor') === chart && chart.$x.$title('XX') === chart;
        chart.init();
        out.renderedTitle = document.querySelector('#c1 text.odc-plot-title').textContent;
        out.config = [chart.config.title, chart.config.x.title];
        // setConfig rebuilds accessors for the new config object
        chart.setConfig({x: {key: 'y'}, y: {key: 'x'}});
        out.afterSetConfig = [chart.$x.$key(), chart.$title()];
        return out;
    }, scatter);
    expect(r).toEqual({
        title: 'T', xKey: 'x', radius: 2, chain: true, renderedTitle: 'Via accessor',
        config: ['Via accessor', 'XX'], afterSetConfig: ['y', undefined]
    });
});

test('events: on / once / off / trigger', async ({odc}) => {
    const r = await odc.run((ODCD3, h, f) => {
        const chart = new ODCD3.ScatterPlot('#c1', f.data, f.config);
        const log = [];
        const ctx = {name: 'ctx'};
        const a = function (x, y) { log.push(['a', x, y, this === chart]); };
        const b = function (x) { log.push(['b', x, this.name]); };
        chart.on('e', a).on('e', b, ctx).once('e', x => log.push(['once', x]));
        chart.trigger('e', 1, 2);
        chart.trigger('e', 3);
        chart.off('e', a);
        chart.trigger('e', 4);
        chart.off('e', null, ctx);
        chart.trigger('e', 5);
        chart.on('f', () => log.push(['f'])).on('g', () => log.push(['g']));
        chart.off('f');
        chart.trigger('f');
        chart.trigger('g');
        chart.off();
        chart.trigger('g');
        chart.trigger('unknown');
        return log;
    }, scatter);
    expect(r).toEqual([
        ['a', 1, 2, true], ['b', 1, 'ctx'], ['once', 1],
        ['a', 3, undefined, true], ['b', 3, 'ctx'],
        ['b', 4, 'ctx'],
        ['g']
    ]);
});

for (const name of ['heatmap', 'correlation-matrix']) {
    test(name + ': click on a cell triggers "cell-selected" with the cell datum', async ({odc}) => {
        const f = fixtures.find(x => x.name === name);
        await odc.run((ODCD3, h, f) => {
            window.selected = [];
            const chart = new ODCD3[f.cls]('#c1', f.data, f.config);
            chart.on('cell-selected', c => window.selected.push(c));
        }, f);
        await odc.page.locator('#c1 g.odc-cell').nth(1).click({force: true});
        const sel = await odc.run(() => window.selected.map(c => [c.rowVar.val || c.rowVar, c.colVar.val || c.colVar, c.value]));
        expect(sel).toEqual(name === 'heatmap' ? [['u', 'b', 2]] : [['p', 'q', 0.9460139136164906]]);
    });
}

test('CorrelationMatrix.attachScatterPlot renders an attached ScatterPlot on cell click', async ({odc}) => {
    const f = fixtures.find(x => x.name === 'correlation-matrix');
    await odc.run((ODCD3, h, f) => {
        window.cm = new ODCD3.CorrelationMatrix('#c1', f.data, Object.assign({}, f.config, {groups: {key: 'g'}}));
        window.cm.attachScatterPlot('#c2');
    }, f);
    expect(await odc.run((O, h) => h.count('svg', 'c2'))).toBe(0);
    await odc.page.locator('#c1 g.odc-cell').nth(1).click({force: true});
    await odc.settle();
    const r = await odc.run((ODCD3, h) => ({
        svg: document.querySelector('#c2 svg').getAttribute('class'),
        dots: h.count('circle.odc-dot', 'c2'),
        attached: window.cm.attach('ScatterPlot') instanceof ODCD3.ScatterPlot,
        keys: [window.cm.scatterPlot.config.x.key, window.cm.scatterPlot.config.y.key]
    }));
    expect(r).toEqual({svg: 'odc-scatterplot', dots: 6, attached: true, keys: ['p', 'q']});
});

// Resize listener registration: condition `!config.width || config.height`
// (BASELINE §8.7, suspected typo; pinned as current behaviour, intended
// behaviour not decided yet, so there is no expected-failure test for it).
for (const [label, size, expected] of [
    ['no width/height', {}, 1],
    ['width and height', {width: 500, height: 300}, 1],
    ['height only', {height: 300}, 1],
    ['width only', {width: 500}, 0]
]) {
    test('window resize re-runs init() - ' + label + ' (current behaviour)', async ({odc}) => {
        const calls = await odc.run((ODCD3, h, [f, size]) => {
            const chart = new ODCD3.ScatterPlot('#c1', f.data, Object.assign({}, f.config, size));
            let n = 0;
            const init = chart.init.bind(chart);
            chart.init = () => { n++; return init(); };
            window.dispatchEvent(new Event('resize'));
            const beforeDestroy = n;
            chart.destroy();
            window.dispatchEvent(new Event('resize'));
            return [beforeDestroy, n];
        }, [scatter, size]);
        // destroy() removes the listener
        expect(calls).toEqual([expected, expected]);
    });
}

test('resize re-render runs without transitions and restores config.transition', async ({odc}) => {
    const r = await odc.run((ODCD3, h, f) => {
        const chart = new ODCD3.ScatterPlot('#c1', f.data, f.config);
        let seen;
        const init = chart.init.bind(chart);
        chart.init = () => { seen = chart.config.transition; return init(); };
        window.dispatchEvent(new Event('resize'));
        return [seen, chart.config.transition];
    }, scatter);
    expect(r).toEqual([false, true]);
});

test('tooltip div is shared: one div.odc-tooltip in body for several charts', async ({odc}) => {
    const n = await odc.run((ODCD3, h, f) => {
        new ODCD3.ScatterPlot('#c1', f.data, f.config);
        new ODCD3.ScatterPlot('#c2', f.data, f.config);
        return document.querySelectorAll('body > div.odc-tooltip').length;
    }, scatter);
    expect(n).toBe(1);
});

test('BarChart tooltip shows the value at the pointer', async ({odc}) => {
    const f = fixtures.find(x => x.name === 'bar-chart');
    await odc.run((ODCD3, h, f) => { new ODCD3.BarChart('#c1', f.data, Object.assign({}, f.config, {showTooltip: true})); }, f);
    await odc.page.locator('#c1 g.odc-bar rect').first().hover({force: true});
    await odc.settle();
    const t = await odc.run(() => {
        const el = document.querySelector('div.odc-tooltip');
        return {html: el.innerHTML, opacity: el.style.opacity, positioned: /px$/.test(el.style.left)};
    });
    expect(t).toEqual({html: '1', opacity: '0.9', positioned: true});
});
