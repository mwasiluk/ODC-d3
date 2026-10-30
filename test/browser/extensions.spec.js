// D3 selection prototype extensions (BASELINE.md §7.5). In the global variant
// they are installed on the page's d3; in the standalone variant only on the
// bundled d3-selection, reached here through a chart's selection.
const {test, expect} = require('./fixtures');

function withSelection(odc, fn) {
    return odc.run((ODCD3, h, src) => {
        const chart = new ODCD3.ScatterPlot('#c1', [{x: 1, y: 1}], {x: {key: 'x'}, y: {key: 'y'}});
        const root = chart.svg.append('g').attr('id', 'root');
        const f = new Function('return (' + src + ')')();
        return f(root, document.getElementById('root'));
    }, fn.toString());
}

test('selectOrAppend creates once, then returns the existing element', async ({odc}) => {
    const r = await withSelection(odc, (root, node) => {
        const a = root.selectOrAppend('g.a.b#c');
        const b = root.selectOrAppend('g.a.b#c');
        return {same: a.node() === b.node(), count: node.children.length,
            tag: a.node().tagName, cls: a.attr('class'), id: a.attr('id')};
    });
    expect(r).toEqual({same: true, count: 1, tag: 'g', cls: 'a b', id: 'c'});
});

test('selectOrInsert creates once before the given element', async ({odc}) => {
    const r = await withSelection(odc, (root, node) => {
        root.append('rect');
        const a = root.selectOrInsert('g.x', ':first-child');
        const b = root.selectOrInsert('g.x', ':first-child');
        return {same: a.node() === b.node(), order: Array.from(node.children).map(n => n.tagName)};
    });
    expect(r).toEqual({same: true, order: ['g', 'rect']});
});

test('appendSelector and insertSelector always create a new element', async ({odc}) => {
    const r = await withSelection(odc, (root, node) => {
        root.append('rect');
        root.appendSelector('g.a#i1');
        root.appendSelector('g.a#i1');
        root.insertSelector('circle.b', ':first-child');
        root.insertSelector('circle.b', ':first-child');
        return Array.from(node.children).map(n => n.tagName + '.' + (n.getAttribute('class') || '') + '#' + (n.id || ''));
    });
    expect(r).toEqual(['circle.b#', 'circle.b#', 'rect.#', 'g.a#i1', 'g.a#i1']);
});

test('selector parsing: tag, several classes and id in any order', async ({odc}) => {
    const r = await withSelection(odc, root => {
        const e = root.appendSelector('text#t.one.two');
        return [e.node().tagName, e.attr('id'), e.attr('class')];
    });
    expect(r).toEqual(['text', 't', 'one two']);
});

test('extensions are available on enter selections', async ({odc}) => {
    const r = await withSelection(odc, (root, node) => {
        const enter = root.selectAll('circle').data([1, 2]).enter();
        const types = ['selectOrAppend', 'selectOrInsert', 'appendSelector', 'insertSelector'].map(n => typeof enter[n]);
        enter.appendSelector('circle.k');
        return {types, created: node.querySelectorAll('circle.k').length};
    });
    expect(r).toEqual({types: ['function', 'function', 'function', 'function'], created: 2});
});

test('global variant: installed on the page d3; standalone: no global d3', async ({odc, variant}) => {
    const r = await odc.run(() => ({
        hasD3: typeof window.d3 !== 'undefined',
        installed: typeof window.d3 !== 'undefined'
            ? ['selectOrAppend', 'selectOrInsert', 'appendSelector', 'insertSelector'].map(n => typeof window.d3.selection.prototype[n])
            : null
    }));
    if (variant === 'global') {
        expect(r).toEqual({hasD3: true, installed: ['function', 'function', 'function', 'function']});
    } else {
        expect(r).toEqual({hasD3: false, installed: null});
    }
});
