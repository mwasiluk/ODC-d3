// Text without the 10px override used by the snapshot tests: library font
// sizes as shipped, a fixed font file (DejaVu Sans from test/vendor) and real
// SVG measurements (getBBox, getComputedTextLength, getSubStringLength).
const {test, expect} = require('./fixtures');

test.beforeEach(async ({odc}) => {
    await odc.openWithTestFont();
});

test('default text sizes and the fixed test font are applied', async ({odc}) => {
    const r = await odc.run((ODCD3, h) => {
        new ODCD3.ScatterPlot('#c1', [{x: 1, y: 1, g: 'a'}, {x: 2, y: 3, g: 'b'}],
            {x: {key: 'x', title: 'X'}, y: {key: 'y', title: 'Y'}, groups: {key: 'g'}, title: 'Title', subtitle: 'Sub'});
        const style = sel => getComputedStyle(document.querySelector('#c1 ' + sel));
        const sels = ['svg', 'text.odc-plot-title', 'text.odc-plot-subtitle', 'g.odc-axis-x g.tick text',
            'g.odc-axis-x text.odc-label', 'g.odc-legend text.label'];
        return {
            sizes: Object.fromEntries(sels.map(s => [s, style(s).fontSize])),
            families: [...new Set(sels.map(s => style(s).fontFamily))]
        };
    });
    expect(r).toEqual({
        sizes: {
            'svg': '11px',                       // .odc-scatterplot { font-size: 11px }
            'text.odc-plot-title': '20px',       // config.titleSize, inline style
            'text.odc-plot-subtitle': '14px',    // config.subtitleSize
            'g.odc-axis-x g.tick text': '10px',  // d3-axis font-size="10"
            'g.odc-axis-x text.odc-label': '10px',
            'g.odc-legend text.label': '11px'
        },
        families: ['"ODC Test Sans"']
    });
});

test('title and subtitle are centred on the svg using their measured width', async ({odc}) => {
    const r = await odc.run(ODCD3 => {
        new ODCD3.ScatterPlot('#c1', [{x: 1, y: 1}], {x: {key: 'x'}, y: {key: 'y'}, title: 'Iris data set', subtitle: 'Sub'});
        const svg = document.querySelector('#c1 svg').getBoundingClientRect();
        const box = el => el.getBoundingClientRect();
        const t = box(document.querySelector('#c1 text.odc-plot-title'));
        return {centre: (t.left + t.right) / 2 - (svg.left + svg.width / 2), width: t.width,
            length: document.querySelector('#c1 text.odc-plot-title').getComputedTextLength()};
    });
    expect(Math.abs(r.centre)).toBeLessThan(0.5);
    expect(r.length).toBeCloseTo(118.44, 1);
});

// Heatmap labels longer than the available width are shortened by
// Utils.placeTextWithEllipsis: the longest prefix p with
// getSubStringLength(0, p) + 9 <= maxWidth, followed by "...".
const LONG_A = 'categories of the second kind';
const LONG_B = 'an extremely long column label for testing';
const heatmapData = [LONG_A, LONG_B, 'b'].map((v, i) => ({x: v, y: v, z: i + 1}));

function readLabels(odc) {
    return odc.run((ODCD3, h, data) => {
        const chart = new ODCD3.Heatmap('#c1', data, {x: {key: 'x'}, y: {key: 'y'}, z: {key: 'z'}});
        const widths = {x: chart.computeXAxisLabelsWidth({x: 0, y: 0}), y: chart.computeYAxisLabelsWidth()};
        const out = {widths, labels: []};
        for (const axis of ['x', 'y']) {
            const values = h.data('text.odc-label-' + axis).map(d => d.val);
            document.querySelectorAll('#c1 text.odc-label-' + axis).forEach((t, i) => {
                const probe = t.cloneNode();
                probe.textContent = values[i];
                t.parentNode.appendChild(probe);
                const shown = t.textContent;
                const p = shown.endsWith('...') ? shown.length - 3 : values[i].length;
                out.labels.push({
                    axis, full: values[i], shown,
                    length: t.getComputedTextLength(),
                    prefix: p ? t.getSubStringLength(0, p) : 0,
                    dots: shown.length > p ? t.getSubStringLength(p, shown.length - p) : 0,
                    fits: probe.getSubStringLength(0, p) + 9 <= widths[axis],
                    maximal: p === values[i].length || probe.getSubStringLength(0, p + 1) + 9 > widths[axis]
                });
                probe.remove();
            });
        }
        return out;
    }, heatmapData);
}

test('Heatmap: long axis labels are shortened with an ellipsis to the available width', async ({odc}) => {
    const r = await readLabels(odc);
    expect(r.widths.x).toBeCloseTo(107.637, 3);
    expect(r.widths.y).toBeCloseTo(79.353, 3);
    for (const l of r.labels) {
        expect(l.fits, l.axis + ' ' + l.shown).toBe(true);
        expect(l.maximal, l.axis + ' ' + l.shown).toBe(true);
        expect(l.prefix + l.dots, l.axis + ' ' + l.shown).toBeCloseTo(l.length, 1);
        if (l.shown.endsWith('...')) {
            expect(l.full.startsWith(l.shown.slice(0, -3))).toBe(true);
            // "..." is budgeted as 9px; the label overflows maxWidth by at most
            // the difference to its real width (current behaviour)
            expect(l.length).toBeLessThanOrEqual(r.widths[l.axis] + Math.max(0, l.dots - 9) + 1e-6);
        }
    }
    // real width of "..." at 11px in the test font
    expect(r.labels.find(l => l.shown.endsWith('...')).dots).toBeCloseTo(10.47, 1);
    // labels keep the data order (sortLabels is off by default)
    expect(r.labels.map(l => [l.axis, l.shown])).toEqual([
        ['x', 'categories of the ...'], ['x', 'an extremely lon...'], ['x', 'b'],
        ['y', 'categories o...'], ['y', 'an extremel...'], ['y', 'b']
    ]);
});

test('Heatmap: hovering a shortened label shows the full text in the tooltip', async ({odc}) => {
    await readLabels(odc);
    await odc.page.locator('#c1 text.odc-label-y', {hasText: '...'}).first().hover({force: true});
    await odc.settle();
    const t = await odc.run(() => {
        const el = document.querySelector('div.odc-tooltip');
        return {html: el.innerHTML, opacity: el.style.opacity};
    });
    expect(t).toEqual({html: LONG_A, opacity: '0.9'});
});

test('legend: cell spacing follows the measured label height, long labels wrap', async ({odc}) => {
    const r = await odc.run((ODCD3) => {
        const chart = new ODCD3.ScatterPlot('#c1',
            [{x: 1, y: 1, g: 'a'}, {x: 2, y: 3, g: 'a group label that is much longer than the legend'}, {x: 3, y: 2, g: 'b'}],
            {x: {key: 'x'}, y: {key: 'y'}, groups: {key: 'g'}});
        const svg = document.querySelector('#c1 svg').getBoundingClientRect();
        const legend = document.querySelector('#c1 g.odc-legend');
        const cells = Array.from(legend.querySelectorAll('g.cell')).map(c => ({
            y: parseFloat(c.getAttribute('transform').split(',')[1]),
            textHeight: c.querySelector('text').getBBox().height,
            shapeHeight: c.querySelector('rect').getBBox().height,
            shapeWidth: c.querySelector('rect').getBBox().width,
            textX: parseFloat(c.querySelector('text').getAttribute('transform').replace('translate(', '')),
            lines: c.querySelectorAll('tspan').length,
            right: c.querySelector('text').getBoundingClientRect().right
        }));
        return {cells, legend: legend.getAttribute('transform'), plotWidth: chart.plot.width,
            margin: chart.config.legend.margin, svgRight: svg.right};
    });
    // vertical layout of odc-d3-svg-legend: y_i = sum(max(text, shape) heights before i) + 2 * i
    let y = 0;
    r.cells.forEach((c, i) => {
        expect(c.y, 'cell ' + i).toBeCloseTo(y, 3);
        y += Math.max(c.textHeight, c.shapeHeight) + 2;
        // label placed after the swatch with labelOffset 10
        expect(c.textX).toBe(c.shapeWidth + 10);
        expect(c.right, 'cell ' + i + ' inside svg').toBeLessThanOrEqual(r.svgRight);
    });
    expect(r.cells.map(c => c.lines)).toEqual([1, 4, 1]);
    expect(r.cells[1].textHeight).toBeGreaterThan(r.cells[1].shapeHeight);
    expect(r.cells[0].textHeight).toBeLessThan(r.cells[0].shapeHeight);
    // legend sits right of the plot area
    expect(r.legend).toBe('translate(' + (r.plotWidth + r.margin) + ',10)');
});
