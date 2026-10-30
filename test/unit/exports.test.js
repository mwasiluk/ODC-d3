const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const vm = require('vm');
const paths = require('../helpers/paths');
const {variants} = require('../helpers/bundles');

// BASELINE.md §7.1: named exports of src/index.js, identical in both bundles
const EXPORTS = [
    'BarChart', 'BarChartConfig', 'BoxPlot', 'BoxPlotBase', 'BoxPlotBaseConfig', 'BoxPlotConfig',
    'CorrelationMatrix', 'CorrelationMatrixConfig', 'DivergingStackedBarChart', 'DivergingStackedBarChartConfig',
    'Heatmap', 'HeatmapConfig', 'HeatmapTimeSeries', 'HeatmapTimeSeriesConfig', 'Histogram', 'HistogramConfig',
    'Legend', 'LineChart', 'LineChartConfig', 'Regression', 'RegressionConfig', 'ScatterPlot', 'ScatterPlotConfig',
    'ScatterPlotMatrix', 'ScatterPlotMatrixConfig', 'StatisticsUtils', 'Utils'
];

const STATISTICS = [
    'errorFunction', 'linearRegression', 'linearRegressionLine', 'mean', 'quantile', 'sampleCorrelation',
    'sampleStandardDeviation', 'standardDeviation', 'standardError', 'tValue', 'variance', 'zScore'
];

const EXTENSIONS = ['insertSelector', 'appendSelector', 'selectOrAppend', 'selectOrInsert'];

for (const [variant, load] of Object.entries(variants)) {
    test(variant + ': exports exactly the 27 public names', () => {
        const {ODCD3} = load();
        assert.deepEqual(Object.keys(ODCD3).sort(), EXPORTS);
    });

    test(variant + ': chart and config exports are classes, StatisticsUtils is a function map', () => {
        const {ODCD3} = load();
        for (const name of EXPORTS.filter(n => n !== 'StatisticsUtils')) {
            assert.equal(typeof ODCD3[name], 'function', name);
        }
        assert.deepEqual(Object.keys(ODCD3.StatisticsUtils).sort(), STATISTICS);
    });

    test(variant + ': class hierarchy', () => {
        const {ODCD3: O} = load();
        const Chart = Object.getPrototypeOf(O.BoxPlotBase);
        const ChartConfig = Object.getPrototypeOf(O.BoxPlotBaseConfig);
        assert.equal(Chart.name, 'Chart');
        assert.equal(ChartConfig.name, 'ChartConfig');
        const ColorGroups = Object.getPrototypeOf(O.ScatterPlot);
        assert.equal(ColorGroups.name, 'ChartWithColorGroups');
        for (const c of [O.ScatterPlot, O.ScatterPlotMatrix, O.Histogram, O.BarChart, O.LineChart]) {
            assert.ok(c.prototype instanceof ColorGroups, c.name);
        }
        assert.ok(O.Regression.prototype instanceof O.ScatterPlot);
        assert.ok(O.HeatmapTimeSeries.prototype instanceof O.Heatmap);
        assert.ok(O.BoxPlot.prototype instanceof O.BoxPlotBase);
        for (const c of [O.CorrelationMatrix, O.Heatmap, O.DivergingStackedBarChart, O.BoxPlotBase]) {
            assert.equal(Object.getPrototypeOf(c), Chart, c.name);
        }
        assert.ok(new O.RegressionConfig() instanceof O.ScatterPlotConfig);
        assert.ok(new O.ScatterPlotMatrixConfig() instanceof O.ScatterPlotConfig);
        assert.ok(new O.HeatmapTimeSeriesConfig() instanceof O.HeatmapConfig);
        assert.ok(new O.BoxPlotConfig() instanceof O.BoxPlotBaseConfig);
    });
}

test('standalone: UMD bundle loads in plain Node without a global d3', () => {
    assert.equal(typeof globalThis.d3, 'undefined');
    const {ODCD3} = variants.standalone();
    assert.ok(ODCD3.ScatterPlot);
});

test('global: D3 prototype extensions are installed on the global d3.selection', () => {
    const {d3} = variants.global();
    assert.equal(d3.version, '7.9.0');
    for (const name of EXTENSIONS) {
        assert.equal(typeof d3.selection.prototype[name], 'function', name);
        // also assigned to the selection.enter function's prototype (BASELINE.md §7.5)
        assert.equal(typeof d3.selection.prototype.enter.prototype[name], 'function', 'enter.prototype.' + name);
    }
});

test('global: bundle without a global d3 throws "d3 is not defined"', () => {
    const context = vm.createContext({});
    context.globalThis = context;
    assert.throws(
        () => vm.runInContext(fs.readFileSync(paths.globalBundle, 'utf8'), context),
        e => e.name === 'ReferenceError' && /d3 is not defined/.test(e.message)
    );
    assert.equal(context.ODCD3, undefined);
});
