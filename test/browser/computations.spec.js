// Computation results exposed through bound data (__data__), cross-checked
// against StatisticsUtils evaluated in Node on the standalone bundle.
const {test, expect} = require('./fixtures');
const fixtures = require('./chart-fixtures');
const {loadStandalone} = require('../helpers/bundles');

const by = Object.fromEntries(fixtures.map(f => [f.name, f]));
const su = loadStandalone().StatisticsUtils;

function renderAndRead(odc, f, selector, read, config) {
    return odc.run((ODCD3, h, [f, selector, readSrc, config]) => {
        new ODCD3[f.cls]('#c1', f.data, config || f.config);
        const read = new Function('return (' + readSrc + ')')();
        return h.data(selector).map(read);
    }, [f, selector, read.toString(), config]);
}

test('CorrelationMatrix: cell values are sample correlations', async ({odc}) => {
    const f = by['correlation-matrix'];
    const cells = await renderAndRead(odc, f, 'g.odc-cell', d => [d.rowVar, d.colVar, d.value]);
    const col = k => f.data.map(d => d[k]);
    expect(cells.length).toBe(9);
    for (const [r, c, v] of cells) {
        expect(v, r + '/' + c).toBe(r === c ? 1 : su.sampleCorrelation(col(r), col(c)));
    }
    expect(cells.filter(([r, c]) => r === 'p' && c !== 'p').map(x => x[2]))
        .toEqual([0.9460139136164906, -0.9529470646935789]);
});

test('Regression: lines follow linearRegression per group and overall', async ({odc}) => {
    const f = by['regression'];
    const groups = await renderAndRead(odc, f, 'g.odc-regression', d => ({
        group: d.group, linePoints: d.linePoints, confidence: d.confidence.points
    }));
    expect(groups.map(g => g.group)).toEqual([false, 'a', 'b']);
    const pts = g => f.data.filter(d => g === false || d.g === g).map(d => [d.x, d.y]);
    for (const g of groups) {
        const line = su.linearRegressionLine(su.linearRegression(pts(g.group)));
        for (const p of g.linePoints) {
            expect(p.y, g.group + ' at ' + p.x).toBeCloseTo(line(p.x), 12);
        }
        // band end points are at the extent of x, middle point at its centre
        expect(g.confidence.map(p => p.x)).toEqual([g.linePoints[0].x, (g.linePoints[0].x + g.linePoints[1].x) / 2, g.linePoints[1].x]);
    }
    // current behaviour (BASELINE §8.5): negative critical value -> y0 (up) > y1 (down)
    for (const g of groups) {
        for (const p of g.confidence) {
            expect(p.y0).toBeGreaterThan(p.y1);
        }
    }
    expect(groups[1].confidence).toEqual([
        {x: 1, y0: 3.9925430332207474, y1: 0.2931712524935379},
        {x: 3.5, y0: 6.285177171499267, y1: 3.714822828500733},
        {x: 6, y0: 9.706828747506462, y1: 6.007456966779252}
    ]);
});

// df = n - 2 <= 3 threw ReferenceError in tValue before (BASELINE §8.4)
test('Regression: a group of 5 points gets a confidence band (df = 3)', async ({odc}) => {
    const r = await odc.run((ODCD3) => {
        const data = [{x: 1, y: 2, g: 'a'}, {x: 2, y: 3, g: 'a'}, {x: 3, y: 5, g: 'a'}, {x: 4, y: 4, g: 'a'}, {x: 5, y: 6, g: 'a'}];
        const calls = [];
        new ODCD3.Regression('#c1', data, {x: {key: 'x'}, y: {key: 'y'}, groups: {key: 'g'}, confidence: {
            criticalValue: (df, p) => { const t = ODCD3.StatisticsUtils.tValue(df, p); calls.push([df, p, t]); return t; }
        }});
        const bands = Array.from(document.querySelectorAll('#c1 g.odc-regression')).map(g => g.__data__.confidence.points);
        return {calls, bands: document.querySelectorAll('#c1 path.odc-confidence').length,
            finite: bands.every(b => b.length === 3 && b.every(p => Number.isFinite(p.y0) && Number.isFinite(p.y1)))};
    });
    // one call for the group, one for the overall regression (same points)
    expect(r).toEqual({calls: [[3, 0.975, -3.1824], [3, 0.975, -3.1824]], bands: 2, finite: true});
});

test('BoxPlot: quartiles via quantile, whiskers at min/max', async ({odc}) => {
    const f = by['box-plot'];
    const read = d => ({key: d.key, Q1: d.values.Q1, Q2: d.values.Q2, Q3: d.values.Q3,
        whiskerLow: d.values.whiskerLow, whiskerHigh: d.values.whiskerHigh, outliers: d.values.outliers});
    const items = await renderAndRead(odc, f, 'g.odc-boxplot-item', read);
    for (const it of items) {
        const v = f.data.filter(d => d.g === it.key).map(d => d.v);
        expect(it).toEqual({key: it.key, Q1: su.quantile(v, 0.25), Q2: su.quantile(v, 0.5), Q3: su.quantile(v, 0.75),
            whiskerLow: Math.min(...v), whiskerHigh: Math.max(...v)});
    }
    expect(items.map(i => [i.Q1, i.Q2, i.Q3])).toEqual([[2, 2.5, 4], [6, 7, 8]]);
});

test('BoxPlot with tukey: whiskers at Q1/Q3 -/+ 1.5 IQR, outliers outside', async ({odc}) => {
    const f = by['box-plot'];
    const read = d => ({key: d.key, whiskerLow: d.values.whiskerLow, whiskerHigh: d.values.whiskerHigh, outliers: d.values.outliers});
    const items = await renderAndRead(odc, f, 'g.odc-boxplot-item', read, {...f.config, tukey: true});
    // whiskers are not clipped to the data range (current behaviour)
    expect(items).toEqual([
        {key: 'a', whiskerLow: -1, whiskerHigh: 7, outliers: [12]},
        {key: 'b', whiskerLow: 3, whiskerHigh: 11, outliers: []}
    ]);
    expect(await odc.run((O, h) => h.count('circle.odc-outlier'))).toBe(1);
});

test('Histogram: bins', async ({odc}) => {
    const f = by['histogram'];
    const bins = await renderAndRead(odc, f, 'g.odc-bar', d => ({x0: d.x0, x1: d.x1, values: Array.from(d)}));
    expect(bins).toEqual([
        {x0: 1, x1: 2, values: [1]}, {x0: 2, x1: 3, values: [2, 2]}, {x0: 3, x1: 4, values: [3, 3, 3]},
        {x0: 4, x1: 5, values: [4, 4]}, {x0: 5, x1: 6, values: [5]}, {x0: 6, x1: 7, values: []},
        {x0: 7, x1: 7, values: [7]}
    ]);
});

test('DivergingStackedBarChart: segments around middleValue', async ({odc}) => {
    const f = by['diverging-stacked-bar-chart'];
    const bars = await renderAndRead(odc, f, 'g.odc-bar', d => [d.name, d.x0, d.x1, d.originalValue]);
    expect(bars).toEqual([
        ['Low', 0, 100, 100], ['High', 100, 300, 200],
        ['High', 80, 100, 20], ['Low', 100, 400, 300],
        ['Low', 70, 100, 30], ['High', 100, 145, 45]
    ]);
});
