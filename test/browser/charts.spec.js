// Rendering contract for all 12 chart classes, in both bundle variants.
// Snapshots are shared by both projects: the variants must render identically.
const {test, expect} = require('./fixtures');
const fixtures = require('./chart-fixtures');

// Expected mark counts per fixture (selector -> count), derived from the data.
const MARKS = {
    'scatterplot': {'circle.odc-dot': 12, 'g.odc-layer': 2, 'g.odc-legend g.cell': 2, 'text.odc-plot-title': 1, 'text.odc-plot-subtitle': 1},
    'scatterplot-matrix': {'g.odc-cell': 9, 'g.odc-cell circle': 54, 'g.brush-container': 9, 'g.odc-legend g.cell': 2},
    'regression': {'circle.odc-dot': 12, 'g.odc-regression': 3, 'path.odc-line': 3, 'path.odc-confidence': 3},
    'correlation-matrix': {'g.odc-cell': 9, 'ellipse.cell-shape-ellipse': 9, 'text.odc-label-x': 3, 'text.odc-label-y': 3, 'linearGradient': 1},
    'heatmap': {'g.odc-cell': 6, 'rect.cell-shape-rect': 6, 'text.odc-label-x': 3, 'text.odc-label-y': 2, 'linearGradient': 1},
    'heatmap-timeseries': {'g.odc-cell': 6, 'rect.cell-shape-rect': 6, 'text.odc-label-x': 3, 'text.odc-label-y': 2, 'linearGradient': 1},
    'histogram': {'g.odc-bar': 7, 'g.odc-bar rect': 7},
    'bar-chart': {'g.odc-layer': 2, 'g.odc-bar': 8, 'g.odc-legend g.cell': 2},
    'box-plot-base': {'g.odc-boxplot-item': 2, 'rect.odc-box': 2, 'line.odc-median': 2, 'line.odc-whisker': 4, 'circle.odc-outlier': 3},
    'box-plot': {'g.odc-boxplot-item': 2, 'rect.odc-box': 2, 'line.odc-median': 2, 'line.odc-whisker': 4, 'circle.odc-outlier': 0},
    'diverging-stacked-bar-chart': {'g.odc-row': 3, 'g.odc-bar': 6, 'line.odc-middle-line': 1, 'g.odc-legend g.cell': 2},
    'line-chart': {'path.odc-line': 2, 'circle.odc-dot': 8, 'g.odc-legend g.cell': 2}
};

// Charts whose legend appends a new <linearGradient> on every init() (see known-bugs.spec.js)
const GRADIENT_LEAK = ['correlation-matrix', 'heatmap', 'heatmap-timeseries'];

// Fixed ids that are duplicated when the chart is rendered twice on one page
// (current behaviour, BASELINE §8.17, see known-bugs.spec.js)
const FIXED_IDS = {'regression': ['odc-clip']};

function render(odc, f, container) {
    return odc.run((ODCD3, h, [f, id]) => {
        window.charts = window.charts || {};
        window.charts[id] = new ODCD3[f.cls]('#' + id, f.data, f.config);
        return true;
    }, [f, container || 'c1']);
}

test('every chart class has a fixture', () => {
    expect(Object.keys(MARKS).sort()).toEqual(fixtures.map(f => f.name).sort());
    expect(new Set(fixtures.map(f => f.cls)).size).toBe(12);
});

for (const f of fixtures) {
    test.describe(f.name, () => {
        test('renders synchronously into one svg with the chart class', async ({odc}) => {
            await render(odc, f);
            // no settle(): the constructor renders synchronously
            const r = await odc.run((O, h) => ({
                svgs: h.count('svg'),
                cls: document.querySelector('#c1 svg').getAttribute('class'),
                mainGroups: h.count('svg > g.main-group')
            }));
            expect(r).toEqual({svgs: 1, cls: f.svgClass, mainGroups: 1});
        });

        test('mark counts and settled SVG snapshot', async ({odc}) => {
            await render(odc, f);
            await odc.settle();
            const counts = await odc.run((O, h, sels) => Object.fromEntries(sels.map(s => [s, h.count(s)])), Object.keys(MARKS[f.name]));
            expect(counts).toEqual(MARKS[f.name]);
            expect(await odc.run((O, h) => h.serialize())).toMatchSnapshot(f.name + '.txt');
        });

        test('every url(#id) / href="#id" points to an element in the same svg', async ({odc}) => {
            await render(odc, f);
            await odc.settle();
            const refs = await odc.run((O, h) => h.references());
            for (const r of refs) {
                expect(r, r.from + ' -> #' + r.id).toMatchObject({exists: true, inSameSvg: true});
            }
            expect(await odc.run((O, h) => h.duplicateIds())).toEqual([]);
        });

        test('second init() keeps one svg and re-renders the same output', async ({odc}) => {
            await render(odc, f);
            await odc.settle();
            const first = await odc.run((O, h) => h.serialize());
            await odc.run(() => window.charts.c1.init());
            await odc.settle();
            const second = await odc.run((O, h) => h.serialize());
            expect(await odc.run((O, h) => h.count('svg'))).toBe(1);
            if (GRADIENT_LEAK.includes(f.name)) {
                // current behaviour: identical except one more gradient definition
                const strip = s => s.replace(/\n\s*lineargradient[^\n]*(\n\s+stop[^\n]*)*/g, '');
                expect(strip(second)).toBe(strip(first));
                expect(await odc.run((O, h) => h.count('linearGradient'))).toBe(2);
            } else {
                expect(second).toBe(first);
            }
        });

        test('destroy() empties the container', async ({odc}) => {
            await render(odc, f);
            await odc.settle();
            await odc.run(() => window.charts.c1.destroy());
            expect(await odc.run(() => document.getElementById('c1').childNodes.length)).toBe(0);
        });

        test('two instances on one page are independent', async ({odc}) => {
            await render(odc, f, 'c1');
            await render(odc, f, 'c2');
            await odc.settle();
            const [a, b] = await odc.run((O, h) => [h.serialize('c1'), h.serialize('c2')]);
            expect(b).toBe(a);
            // ids are unique on the page and references stay inside each chart
            expect(await odc.run((O, h) => h.duplicateIds())).toEqual(FIXED_IDS[f.name] || []);
            for (const id of ['c1', 'c2']) {
                const refs = await odc.run((O, h, id) => h.references(id), id);
                for (const r of refs.filter(r => !(FIXED_IDS[f.name] || []).includes(r.id))) {
                    expect(r, id + ': ' + r.from + ' -> #' + r.id).toMatchObject({exists: true, inSameSvg: true});
                }
            }
            await odc.run(() => window.charts.c1.destroy());
            expect(await odc.run((O, h) => [h.count('svg', 'c1'), h.count('svg', 'c2')])).toEqual([0, 1]);
        });
    });
}
