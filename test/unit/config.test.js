const test = require('node:test');
const assert = require('node:assert/strict');
const {variants} = require('../helpers/bundles');

const plain = v => JSON.parse(JSON.stringify(v));

// svgClass per config class (BASELINE.md §7.4)
const SVG_CLASSES = {
    ScatterPlotConfig: 'odc-scatterplot',
    ScatterPlotMatrixConfig: 'odc-scatterplot-matrix',
    RegressionConfig: 'odc-scatterplot',
    CorrelationMatrixConfig: 'odc-correlation-matrix',
    HeatmapConfig: 'odc-heatmap',
    HeatmapTimeSeriesConfig: 'odc-heatmap',
    HistogramConfig: 'odc-histogram',
    BarChartConfig: 'odc-bar-chart',
    BoxPlotBaseConfig: 'odc-box-plot',
    BoxPlotConfig: 'odc-box-plot',
    DivergingStackedBarChartConfig: 'odc-diverging-stacked-bar-chart',
    LineChartConfig: 'odc-line-chart'
};

// Chart.prototype methods that do not need a DOM, bound to a fake chart
function fakeChart(O, config) {
    const Chart = Object.getPrototypeOf(O.BoxPlotBase);
    const fake = Object.create(Chart.prototype);
    fake.config = config;
    return fake;
}

for (const [variant, load] of Object.entries(variants)) {
    test(variant + ': ChartConfig defaults', () => {
        const {ODCD3: O} = load();
        const ChartConfig = Object.getPrototypeOf(O.BoxPlotBaseConfig);
        const c = new ChartConfig();
        assert.deepEqual(plain(c), {
            cssClassPrefix: 'odc-',
            svgClass: 'odc-mw-d3-chart',
            margin: {left: 50, right: 30, top: 30, bottom: 50},
            showTooltip: false,
            transition: true,
            titleSize: 20,
            titleMargin: {left: 0, right: 0, top: 15, bottom: 20},
            subtitleSize: 14,
            subtitleMargin: {left: 0, right: 0, top: 10, bottom: 20}
        });
        assert.ok('width' in c && c.width === undefined);
        assert.ok('title' in c && c.title === undefined);
    });

    test(variant + ': svgClass of every chart config', () => {
        const {ODCD3: O} = load();
        for (const [name, cls] of Object.entries(SVG_CLASSES)) {
            assert.equal(new O[name]().svgClass, cls, name);
            // svgClass is computed before the custom config is merged
            assert.equal(new O[name]({cssClassPrefix: 'x-'}).svgClass, cls, name + ' with custom prefix');
        }
    });

    test(variant + ': custom config is deep-merged over class defaults', () => {
        const {ODCD3: O} = load();
        const dotId = () => 'id';
        const c = new O.ScatterPlotConfig({margin: {left: 10}, x: {key: 'k'}, dotId: dotId, groups: {key: 'g'}});
        assert.deepEqual(plain(c.margin), {left: 10, right: 30, top: 30, bottom: 50});
        assert.equal(c.x.key, 'k');
        assert.equal(c.x.scale, 'linear');
        assert.equal(c.x.orient, 'bottom');
        assert.equal(typeof c.x.value, 'function');
        assert.equal(c.dotId, dotId);
        assert.deepEqual(plain(c.groups), {key: 'g'});
        assert.equal(c.showLegend, true);
        assert.equal(c.showTooltip, true);
        assert.equal(c.dotRadius, 2);

        const h = new O.HeatmapConfig({color: {range: ['red', 'blue']}});
        assert.deepEqual(plain(h.color.range), ['red', 'blue']);
        assert.equal(h.color.scale, 'linear');

        // a Config instance can be wrapped again (what Chart.setConfig does)
        const again = new O.ScatterPlotConfig(c);
        assert.equal(again.x.key, 'k');
        assert.equal(again.margin.left, 10);
    });

    test(variant + ': subclass defaults', () => {
        const {ODCD3: O} = load();
        const r = new O.RegressionConfig();
        assert.equal(r.mainRegression, true);
        assert.equal(r.groupRegression, true);
        assert.equal(r.confidence.level, 0.95);
        assert.equal(typeof r.confidence.criticalValue, 'function');
        assert.equal(r.confidence.criticalValue(10, 0.05), r.confidence.criticalValue(10, 0.05));
        const t = new O.HeatmapTimeSeriesConfig();
        assert.equal(t.x.fillMissing, false);
        assert.equal(t.z.fillMissing, true);
        assert.deepEqual(plain(t.x.intervalToFormats.map(i => i.name)), ['year', 'month', 'day', 'hour', 'minute', 'second']);
        assert.equal(new O.BoxPlotConfig().tukey, false);
        assert.equal('ChartWithColorGroupsConfig' in O, false);
    });

    test(variant + ': $-accessors get/set config values and return the chart', () => {
        const {ODCD3: O} = load();
        const config = {width: 1, x: {key: 'a'}, list: [1]};
        const chart = fakeChart(O, config);
        chart.initConfigAccessors();
        assert.equal(chart.$width(), 1);
        assert.equal(chart.$width(5), chart);
        assert.equal(config.width, 5);
        assert.equal(typeof chart.$x, 'function');
        assert.equal(chart.$x.$key(), 'a');
        assert.equal(chart.$x.$key('b'), chart);
        assert.equal(config.x.key, 'b');
        // arrays get an accessor but no nested accessors
        assert.equal(chart.$list.$0, undefined);
        // clean re-init removes accessors for keys no longer present
        chart.config = {other: 1};
        chart.removePropertyAccessors(chart, chart, config, '$');
        chart.initConfigAccessors();
        assert.equal(chart.$width, undefined);
        assert.equal(chart.$other(), 1);
    });

    test(variant + ': prefixClass without dot', () => {
        const {ODCD3: O} = load();
        const chart = fakeChart(O, {cssClassPrefix: 'odc-'});
        assert.equal(chart.prefixClass('plot-title'), 'odc-plot-title');
        assert.equal(chart.prefixClass('plot-title', false), 'odc-plot-title');
    });

    // returned just '.' before (BASELINE §8.6)
    test(variant + ': prefixClass(name, true) returns ".odc-name"', () => {
        const {ODCD3: O} = load();
        assert.equal(fakeChart(O, {cssClassPrefix: 'odc-'}).prefixClass('plot-title', true), '.odc-plot-title');
        assert.equal(fakeChart(O, {cssClassPrefix: 'x-'}).prefixClass('dot', true), '.x-dot');
    });
}
