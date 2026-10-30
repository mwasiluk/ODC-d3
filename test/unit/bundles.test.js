const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const acorn = require('acorn');
const paths = require('../helpers/paths');

// The JS artifacts of BASELINE.md §7.3: plain bundle with an inline source
// map, minified bundle with an external .map next to it.
const BUNDLES = [
    {plain: paths.globalBundle, min: path.join(paths.dist, 'odc-d3.min.js')},
    {plain: paths.standaloneBundle, min: path.join(paths.dist, 'standalone', 'odc-d3.min.js')}
];
const INLINE_MAP = '//# sourceMappingURL=data:application/json;charset=utf-8;base64,';

function checkMap(map, file) {
    assert.equal(map.version, 3);
    if (file) {
        assert.equal(map.file, file);
    }
    assert.ok(map.mappings.length > 0, 'mappings');
    assert.equal(map.sourcesContent.length, map.sources.length);
    assert.ok(map.sourcesContent.every(s => typeof s === 'string'), 'sourcesContent');
    for (const src of ['src/index.js', 'src/chart.js', 'src/statistics-utils.js']) {
        assert.ok(map.sources.some(s => s.endsWith(src)), src + ' in sources');
    }
    assert.ok(map.sources.every(s => !path.isAbsolute(s)), 'relative source paths');
}

for (const b of BUNDLES) {
    const name = f => path.relative(paths.dist, f).split(path.sep).join('/');

    // v2.0.0 ships ES5 syntax (all modules, node_modules included, compiled by Babel)
    for (const file of [b.plain, b.min]) {
        test(name(file) + ' parses as ES5', () => {
            acorn.parse(fs.readFileSync(file, 'utf8'), {ecmaVersion: 5});
        });
    }

    test(name(b.plain) + ' has an inline source map', () => {
        const code = fs.readFileSync(b.plain, 'utf8');
        const i = code.lastIndexOf(INLINE_MAP);
        assert.ok(i > 0, 'inline sourceMappingURL');
        checkMap(JSON.parse(Buffer.from(code.slice(i + INLINE_MAP.length).trim(), 'base64').toString('utf8')));
    });

    test(name(b.min) + ' references ' + name(b.min) + '.map', () => {
        const code = fs.readFileSync(b.min, 'utf8');
        assert.match(code, /\n\/\/# sourceMappingURL=odc-d3\.min\.js\.map\s*$/);
        checkMap(JSON.parse(fs.readFileSync(b.min + '.map', 'utf8')), 'odc-d3.min.js');
    });

    // gulp-strip-debug before, terser drop_console now
    test(name(b.min) + ' contains no console calls', () => {
        assert.doesNotMatch(fs.readFileSync(b.min, 'utf8'), /\bconsole\.(log|warn|error|info|debug)\(/);
    });
}
