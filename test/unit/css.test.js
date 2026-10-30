const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const paths = require('../helpers/paths');

// Selectors that charts and users rely on (BASELINE.md §7.4). Empty SCSS rules
// (.odc-dot, .odc-bar, .odc-axis-y) are dropped by Sass and are not part of the CSS.
const SELECTORS = [
    '.odc-tooltip', '.odc-selectable', '.odc-legend', '.odc-axis', '.odc-cell',
    '.odc-scatterplot', '.odc-scatterplot-matrix', '.odc-correlation-matrix', '.odc-heatmap',
    '.odc-histogram', '.odc-bar-chart', '.odc-box-plot', '.odc-diverging-stacked-bar-chart',
    '.odc-line-chart', '.odc-frame', '.odc-group', '.odc-highlight', '.odc-label', '.odc-middle-line',
    '.odc-boxplot-tick', '.legendCells', '.cell', '.title', '.extent'
];

function selectorsOf(css) {
    const found = new Set();
    css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/([^{}]+)\{/g, (m, sel) => {
        for (const part of sel.split(/[\s,>+~]+/)) {
            for (const cls of part.match(/\.[A-Za-z0-9_-]+/g) || []) {
                found.add(cls);
            }
        }
        return m;
    });
    return found;
}

for (const file of [paths.css, paths.minCss]) {
    test(require('path').relative(paths.dist, file) + ' contains all required selectors', () => {
        const css = fs.readFileSync(file, 'utf8');
        assert.ok(css.length > 0);
        const found = selectorsOf(css);
        const missing = SELECTORS.filter(s => !found.has(s));
        assert.deepEqual(missing, []);
    });
}

test('empty SCSS rules are not emitted (current behaviour)', () => {
    const found = selectorsOf(fs.readFileSync(paths.css, 'utf8'));
    for (const s of ['.odc-dot', '.odc-bar', '.odc-axis-y']) {
        assert.equal(found.has(s), false, s);
    }
});

test('min.css has the same class selectors as css', () => {
    assert.deepEqual([...selectorsOf(fs.readFileSync(paths.minCss, 'utf8'))].sort(),
        [...selectorsOf(fs.readFileSync(paths.css, 'utf8'))].sort());
});

test('tooltip rule: absolutely positioned and not intercepting pointer events', () => {
    const css = fs.readFileSync(paths.css, 'utf8');
    const rule = css.match(/\.odc-tooltip\s*\{([^}]*)\}/);
    assert.ok(rule, '.odc-tooltip rule');
    assert.match(rule[1], /position:\s*absolute/);
    assert.match(rule[1], /pointer-events:\s*none/);
});
