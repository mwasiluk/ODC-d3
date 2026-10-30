// Deterministic fixtures for all 12 chart classes. Small hand-written data
// (no Math.random), short labels (no font-dependent ellipsis), JSON-only
// configs so they can be passed into the page.

const points = [
    {x: 1, y: 2, g: 'a'}, {x: 2, y: 4, g: 'a'}, {x: 3, y: 3, g: 'a'},
    {x: 4, y: 7, g: 'a'}, {x: 5, y: 6, g: 'a'}, {x: 6, y: 8, g: 'a'},
    {x: 2, y: 1, g: 'b'}, {x: 3, y: 2, g: 'b'}, {x: 5, y: 2, g: 'b'},
    {x: 6, y: 4, g: 'b'}, {x: 8, y: 5, g: 'b'}, {x: 9, y: 4, g: 'b'}
];

const variables = [
    {p: 1, q: 2, r: 9, g: 'a'}, {p: 2, q: 3, r: 7, g: 'a'}, {p: 3, q: 5, r: 8, g: 'a'},
    {p: 4, q: 4, r: 4, g: 'b'}, {p: 5, q: 7, r: 3, g: 'b'}, {p: 6, q: 8, r: 1, g: 'b'}
];

module.exports = [
    {
        name: 'scatterplot',
        cls: 'ScatterPlot',
        svgClass: 'odc-scatterplot',
        data: points,
        config: {x: {key: 'x', title: 'X'}, y: {key: 'y', title: 'Y'}, groups: {key: 'g'}, title: 'T', subtitle: 'S'}
    },
    {
        name: 'scatterplot-matrix',
        cls: 'ScatterPlotMatrix',
        svgClass: 'odc-scatterplot-matrix',
        data: variables,
        config: {groups: {key: 'g'}}
    },
    {
        name: 'regression',
        cls: 'Regression',
        svgClass: 'odc-scatterplot',
        data: points,
        config: {x: {key: 'x'}, y: {key: 'y'}, groups: {key: 'g'}, mainRegression: true, groupRegression: true}
    },
    {
        name: 'correlation-matrix',
        cls: 'CorrelationMatrix',
        svgClass: 'odc-correlation-matrix',
        data: variables,
        config: {variables: {keys: ['p', 'q', 'r']}}
    },
    {
        name: 'heatmap',
        cls: 'Heatmap',
        svgClass: 'odc-heatmap',
        data: [
            {x: 'a', y: 'u', z: 1}, {x: 'b', y: 'u', z: 2}, {x: 'c', y: 'u', z: 3},
            {x: 'a', y: 'v', z: 4}, {x: 'b', y: 'v', z: 6}, {x: 'c', y: 'v', z: 5}
        ],
        config: {x: {key: 'x'}, y: {key: 'y'}, z: {key: 'z'}}
    },
    {
        name: 'heatmap-timeseries',
        cls: 'HeatmapTimeSeries',
        svgClass: 'odc-heatmap',
        data: [
            // yearly data: short labels (daily filling is covered in known-bugs.spec.js)
            {t: '2000', y: 'u', z: 1}, {t: '2001', y: 'u', z: 3}, {t: '2003', y: 'u', z: 2},
            {t: '2000', y: 'v', z: 5}, {t: '2001', y: 'v', z: 4}, {t: '2003', y: 'v', z: 6}
        ],
        config: {x: {key: 't', fillMissing: false}, y: {key: 'y'}, z: {key: 'z', fillMissing: false}}
    },
    {
        name: 'histogram',
        cls: 'Histogram',
        svgClass: 'odc-histogram',
        data: [1, 2, 2, 3, 3, 3, 4, 4, 5, 7],
        config: {x: {ticks: 6}}
    },
    {
        name: 'bar-chart',
        cls: 'BarChart',
        svgClass: 'odc-bar-chart',
        data: [{key: 's1', values: [[0, 1], [1, 3], [2, 2], [3, 5]]}, {key: 's2', values: [[0, 2], [1, 1], [2, 4], [3, 3]]}],
        config: {series: true}
    },
    {
        name: 'box-plot-base',
        cls: 'BoxPlotBase',
        svgClass: 'odc-box-plot',
        data: [
            {key: 's1', values: {Q1: 30, Q2: 35, Q3: 40, whiskerLow: 22, whiskerHigh: 42, outliers: [17]}},
            {key: 's2', values: {Q1: 5, Q2: 10, Q3: 12, whiskerLow: 2, whiskerHigh: 17, outliers: [0, 25]}}
        ],
        config: {}
    },
    {
        name: 'box-plot',
        cls: 'BoxPlot',
        svgClass: 'odc-box-plot',
        data: [
            {v: 1, g: 'a'}, {v: 2, g: 'a'}, {v: 2, g: 'a'}, {v: 3, g: 'a'}, {v: 4, g: 'a'}, {v: 12, g: 'a'},
            {v: 5, g: 'b'}, {v: 6, g: 'b'}, {v: 7, g: 'b'}, {v: 7, g: 'b'}, {v: 8, g: 'b'}, {v: 9, g: 'b'}
        ],
        config: {y: {key: 'v'}, groups: {key: 'g'}}
    },
    {
        name: 'diverging-stacked-bar-chart',
        cls: 'DivergingStackedBarChart',
        svgClass: 'odc-diverging-stacked-bar-chart',
        data: [
            {key: 's1', values: [100, 200], categories: [0, 1]},
            {key: 's2', values: [20, 300], categories: [1, 0]},
            {key: 's3', values: [30, 45]}
        ],
        config: {categoryNames: ['Low', 'High'], middleValue: 100, showBarValues: true}
    },
    {
        name: 'line-chart',
        cls: 'LineChart',
        svgClass: 'odc-line-chart',
        data: [{key: 's1', values: [[0, 1], [1, 3], [2, 2], [3, 5]]}, {key: 's2', values: [[0, 2], [1, 1], [2, 4], [3, 3]]}],
        config: {series: true}
    }
];
