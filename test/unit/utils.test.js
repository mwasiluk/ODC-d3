const test = require('node:test');
const assert = require('node:assert/strict');
const {variants} = require('../helpers/bundles');

const SCALES = ['linear', 'pow', 'sqrt', 'log', 'symlog', 'identity', 'radial', 'time', 'utc',
    'sequential', 'diverging', 'quantize', 'quantile', 'threshold', 'ordinal', 'band', 'point'];

// cross-realm safe copy (the global variant runs in a vm context)
const plain = v => JSON.parse(JSON.stringify(v));

for (const [variant, load] of Object.entries(variants)) {
    const U = () => load().ODCD3.Utils;

    test(variant + ': deepExtend merges objects in place, replaces arrays, functions and undefined', () => {
        const Utils = U();
        const fn = () => 1;
        const out = {a: {b: 1, c: [1, 2], keep: true}, f: () => 0, u: 1};
        const res = Utils.deepExtend(out, {a: {c: [3], d: 2}, f: fn, u: undefined}, null, {e: 5});
        assert.equal(res, out);
        assert.deepEqual(plain(out.a), {b: 1, c: [3], keep: true, d: 2});
        assert.equal(out.f, fn);
        assert.ok('u' in out && out.u === undefined);
        assert.equal(out.e, 5);
        // an object replaces an array target...
        assert.deepEqual(plain(Utils.deepExtend({a: [1]}, {a: {x: 1}})), {a: {x: 1}});
        // ...but an array is merged into an object target by index (current behaviour)
        assert.deepEqual(plain(Utils.deepExtend({a: {x: 1}}, {a: [1]})), {a: {0: 1, x: 1}});
        // null target with an array source creates an array
        assert.ok(Array.isArray(Utils.deepExtend(null, [1, 2])));
        assert.deepEqual(plain(Utils.deepExtend(null, [1, 2])), [1, 2]);
    });

    test(variant + ': mergeDeep does not mutate its inputs', () => {
        const Utils = U();
        const target = {a: {b: 1}, l: [1]};
        const res = Utils.mergeDeep(target, {a: {c: 2}, n: {x: 1}, l: [2]});
        assert.deepEqual(plain(res), {a: {b: 1, c: 2}, l: [2], n: {x: 1}});
        assert.deepEqual(plain(target), {a: {b: 1}, l: [1]});
    });

    test(variant + ': nest, cross, inferVariables', () => {
        const Utils = U();
        assert.deepEqual(plain(Utils.nest([{k: 'a', v: 1}, {k: 'b', v: 2}, {k: 'a', v: 3}], d => d.k)), [
            {key: 'a', values: [{k: 'a', v: 1}, {k: 'a', v: 3}]},
            {key: 'b', values: [{k: 'b', v: 2}]}
        ]);
        assert.deepEqual(plain(Utils.cross(['a', 'b'], [1, 2])), [
            {x: 'a', i: 0, y: 1, j: 0}, {x: 'a', i: 0, y: 2, j: 1},
            {x: 'b', i: 1, y: 1, j: 0}, {x: 'b', i: 1, y: 2, j: 1}
        ]);
        assert.deepEqual(plain(Utils.inferVariables([{a: 1, b: 2, g: 'x'}], 'g')), ['a', 'b']);
        assert.deepEqual(plain(Utils.inferVariables([{a: 1, b: 2, g: 'x'}], 'g', true)), ['a', 'b', 'g']);
        if (variant === 'standalone') {
            // `instanceof Array` does not work across vm realms, so only checked here
            assert.deepEqual(plain(Utils.inferVariables([[1, 2, 3]], 2)), [0, 1]);
        }
        assert.deepEqual(plain(Utils.inferVariables(null)), []);
        assert.deepEqual(plain(Utils.inferVariables([])), []);
    });

    test(variant + ': type predicates (return values pinned, some are not booleans)', () => {
        const Utils = U();
        assert.equal(Utils.isNumber(1), true);
        assert.equal(Utils.isNumber(NaN), false);
        assert.equal(Utils.isNumber('1'), false);
        assert.equal(Utils.isString('a'), true);
        assert.equal(Utils.isDate(new Date(0)), true);
        assert.equal(Utils.isFunction(() => 1), true);
        assert.equal(Utils.isArray([]), true);
        assert.equal(Utils.isObject(null), false);
        assert.equal(Utils.isObject([]), true);
        assert.equal(Utils.isObjectNotArray({}), true);
        assert.equal(Utils.isObjectNotArray([]), false);
        assert.equal(Utils.isObjectNotArray(null), null);
        assert.equal(Utils.isObjectNotArray(0), 0);
        assert.equal(Utils.capitalizeFirstLetter('linear'), 'Linear');
        assert.equal(Utils.SQRT_2, 1.41421356237);
    });

    test(variant + ': guid format', () => {
        const Utils = U();
        assert.match(Utils.guid(), /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
        assert.notEqual(Utils.guid(), Utils.guid());
    });

    test(variant + ': createScale resolves d3.scale<Name> and rejects unknown names', () => {
        const Utils = U();
        const supported = SCALES.filter(name => {
            try {
                return typeof Utils.createScale(name) === 'function';
            } catch (e) {
                return false;
            }
        });
        assert.deepEqual(supported, SCALES);
        assert.deepEqual(plain(Utils.createScale('linear').domain()), [0, 1]);
        assert.throws(() => Utils.createScale('nope'), e => e === 'ODC-D3 - scale not supported: nope (scaleNope)');
    });

    test(variant + ': createAxis resolves d3.axis<Orient> and rejects unknown orients', () => {
        const Utils = U();
        const scale = Utils.createScale('linear');
        for (const orient of ['top', 'right', 'bottom', 'left']) {
            const axis = Utils.createAxis(orient, scale);
            assert.equal(typeof axis, 'function', orient);
            assert.equal(axis.scale(), scale);
        }
        assert.throws(() => Utils.createAxis('diagonal', scale), e => e === 'ODC-D3 - axis orient not supported: diagonal');
    });
}
