const {test, expect} = require('./fixtures');

const EXPORTS = [
    'BarChart', 'BarChartConfig', 'BoxPlot', 'BoxPlotBase', 'BoxPlotBaseConfig', 'BoxPlotConfig',
    'CorrelationMatrix', 'CorrelationMatrixConfig', 'DivergingStackedBarChart', 'DivergingStackedBarChartConfig',
    'Heatmap', 'HeatmapConfig', 'HeatmapTimeSeries', 'HeatmapTimeSeriesConfig', 'Histogram', 'HistogramConfig',
    'Legend', 'LineChart', 'LineChartConfig', 'Regression', 'RegressionConfig', 'ScatterPlot', 'ScatterPlotConfig',
    'ScatterPlotMatrix', 'ScatterPlotMatrixConfig', 'StatisticsUtils', 'Utils'
];

test('window.ODCD3 exposes the 27 public names', async ({odc}) => {
    expect(await odc.run(ODCD3 => Object.keys(ODCD3).sort())).toEqual(EXPORTS);
});

test('global variant uses the page d3 7.9.0', async ({odc, variant}) => {
    test.skip(variant !== 'global', 'global variant only');
    expect(await odc.run(() => window.d3.version)).toBe('7.9.0');
});

test('global variant without d3 fails to load', async ({odc, variant, pageErrors}) => {
    test.skip(variant !== 'global', 'global variant only');
    pageErrors.expected.push(/d3 is not defined/);
    await odc.openWithoutD3();
    expect(await odc.page.evaluate(() => typeof window.ODCD3)).toBe('undefined');
    expect([...pageErrors]).toEqual(['d3 is not defined']);
});

test('standalone variant does not define a global d3', async ({odc, variant}) => {
    test.skip(variant !== 'standalone', 'standalone variant only');
    expect(await odc.run(() => typeof window.d3)).toBe('undefined');
});
