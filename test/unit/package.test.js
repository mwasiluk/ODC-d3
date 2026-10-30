const test = require('node:test');
const assert = require('node:assert/strict');
const pkg = require('../../package.json');

// npm consumers import the untranspiled sources (BASELINE.md §7.1), e.g.
// SilverDecisions bundles `odc-d3/src/scatterplot` with browserify; its own
// babelify ignores node_modules/odc-d3, so these files are compiled only by
// the transform declared here. The library build does not use this field.
test('main points at the ES sources, no exports map', () => {
    assert.equal(pkg.main, 'src/index.js');
    for (const field of ['exports', 'module', 'browser', 'type']) {
        assert.equal(pkg[field], undefined, field);
    }
});

test('browserify.transform still compiles odc-d3 sources for browserify consumers', () => {
    assert.deepEqual(pkg.browserify, {
        transform: [
            ['babelify', {
                global: true,
                ignore: ['/\\/node_modules\\/(?!d3-.+\\/)/'],
                presets: ['@babel/preset-env'],
                plugins: [
                    'transform-class-properties',
                    ['@babel/plugin-transform-runtime', {regenerator: true}]
                ]
            }]
        ]
    });
    // the helpers injected by transform-runtime come from a runtime dependency
    assert.ok(pkg.dependencies['@babel/runtime']);
});
