// Self-tests of the in-page helpers used by the other specs.
const {test, expect} = require('./fixtures');

const A = '0123abcd-0000-1111-2222-333344445555';
const B = '9999ffff-0000-1111-2222-333344445555';

function svgWith(odc, gradientId, fillId) {
    return odc.run((O, h, [g, f]) => {
        document.getElementById('c1').innerHTML = '<svg><defs><linearGradient id="grad-' + g + '"></linearGradient></defs>'
            + '<rect style="fill: url(&quot;#grad-' + f + '&quot;)"></rect></svg>';
        return {text: h.serialize(), refs: h.references()};
    }, [gradientId, fillId]);
}

test('serializer keeps the relation between ids and references', async ({odc}) => {
    const ok = await svgWith(odc, A, A);
    const broken = await svgWith(odc, A, B);
    expect(ok.text).not.toBe(broken.text);
    expect(ok.text).toContain('id="grad-GUID_1"');
    expect(ok.text).toContain('url("#grad-GUID_1")');
    expect(broken.text).toContain('url("#grad-GUID_2")');
    // different random guids with the same structure serialize identically
    expect((await svgWith(odc, B, B)).text).toBe(ok.text);
});

test('references() reports dangling and foreign references', async ({odc}) => {
    expect((await svgWith(odc, A, A)).refs).toEqual([{from: 'rect@style', id: 'grad-' + A, exists: true, inSameSvg: true}]);
    expect((await svgWith(odc, A, B)).refs).toEqual([{from: 'rect@style', id: 'grad-' + B, exists: false, inSameSvg: false}]);
    const foreign = await odc.run((O, h) => {
        document.getElementById('c2').innerHTML = '<svg><clipPath id="clip"></clipPath></svg>';
        document.getElementById('c1').innerHTML = '<svg><g clip-path="url(#clip)"></g><use href="#clip"></use></svg>';
        return h.references();
    });
    expect(foreign).toEqual([
        {from: 'g@clip-path', id: 'clip', exists: true, inSameSvg: false},
        {from: 'use@href', id: 'clip', exists: true, inSameSvg: false}
    ]);
});

test('duplicateIds() lists ids used more than once', async ({odc}) => {
    const dup = await odc.run((O, h) => {
        document.getElementById('c1').innerHTML = '<svg><g id="x"></g><g id="y"></g></svg>';
        document.getElementById('c2').innerHTML = '<svg><g id="x"></g></svg>';
        return h.duplicateIds();
    });
    expect(dup).toEqual(['x']);
});
