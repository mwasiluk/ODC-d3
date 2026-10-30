// JavaScript build (`npm run build:js`, docs/modernization/BASELINE.md §7.2, §7.3).
// Two UMD bundles exposing the global ODCD3, each as a plain file with an
// inline source map and as a minified file with an external .map:
//   dist/odc-d3(.min).js             uses the page's global d3 (v7)
//   dist/standalone/odc-d3(.min).js  bundles the d3-* modules re-exported by src/d3.js
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {transformAsync} from '@babel/core';
import {babel} from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const root = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(root, 'src') + path.sep;
const D3_SHIM = path.join(SRC, 'd3.js');
const D3_GLOBAL = path.join(SRC, 'd3_global.js');
const ENTRY = '\0odc-d3-umd-entry';

// The UMD wrapper assigns `ODCD3 = factory()` / `module.exports = factory()`,
// so a bundle that fails to load (global bundle without d3) defines nothing.
// The exported object has the shape of the previous Babel/browserify one:
// __esModule (bundler interop) and an enumerable getter per export of src/index.js.
function umdEntry() {
    return {
        name: 'odc-umd-entry',
        resolveId(source, importer, options) {
            return options.isEntry && source === 'src/index.js' ? ENTRY : null;
        },
        load(id) {
            if (id !== ENTRY) {
                return null;
            }
            return [
                'import * as api from ' + JSON.stringify(path.join(SRC, 'index.js')) + ';',
                'var ODCD3 = {};',
                "Object.defineProperty(ODCD3, '__esModule', {value: true});",
                'Object.keys(api).forEach(function (name) {',
                '    Object.defineProperty(ODCD3, name, {enumerable: true, get: function () { return api[name]; }});',
                '});',
                'export default ODCD3;'
            ].join('\n');
        }
    };
}

// Global bundle: src/d3.js resolves to src/d3_global.js (`module.exports = d3`),
// so the page's d3 is read when the bundle loads. src/ is never modified.
function globalD3() {
    return {
        name: 'odc-global-d3',
        async resolveId(source, importer, options) {
            const resolved = await this.resolve(source, importer, Object.assign({}, options, {skipSelf: true}));
            return resolved && resolved.id === D3_SHIM ? D3_GLOBAL : null;
        }
    };
}

// src/statistics-utils.js mixes ES `import` with `module.exports`/`require`,
// which @rollup/plugin-commonjs does not support. Its imports are turned into
// require() calls first (as babelify did), so it is plain CommonJS.
function mixedModules() {
    return {
        name: 'odc-mixed-modules',
        async transform(code, id) {
            if (!id.startsWith(SRC) || !/\bmodule\.exports\b/.test(code) || !/^import\s/m.test(code)) {
                return null;
            }
            const result = await transformAsync(code, {filename: id, babelrc: false, configFile: false,
                sourceMaps: true, plugins: ['@babel/plugin-transform-modules-commonjs']});
            return {code: result.code, map: result.map};
        }
    };
}

// The Babel options of the `browserify.transform` field in package.json (kept
// for consumers that bundle src/). Like the previous babelify build, every
// module is compiled to ES5, node_modules included; @babel/runtime and
// regenerator-runtime are already ES5 and must not import their own helpers.
const babelPlugin = babel({
    babelHelpers: 'runtime',
    babelrc: false,
    configFile: false,
    exclude: /[\\/]node_modules[\\/](@babel[\\/]runtime|regenerator-runtime)[\\/]/,
    presets: ['@babel/preset-env'],
    plugins: [
        'transform-class-properties',
        ['@babel/plugin-transform-runtime', {regenerator: true}]
    ]
});

function onwarn(warning, warn) {
    // cycles inside the d3-* packages are harmless and not ours to fix
    if (warning.code === 'CIRCULAR_DEPENDENCY' && warning.ids.every(id => id.includes('node_modules'))) {
        return;
    }
    warn(warning);
}

function bundle(dir, plugins) {
    const output = {format: 'umd', name: 'ODCD3', exports: 'default'};
    return {
        input: 'src/index.js',
        onwarn,
        plugins: plugins.concat([
            umdEntry(),
            nodeResolve(),
            mixedModules(),
            commonjs({transformMixedEsModules: true}),
            babelPlugin
        ]),
        output: [
            Object.assign({file: dir + '/odc-d3.js', sourcemap: 'inline'}, output),
            Object.assign({file: dir + '/odc-d3.min.js', sourcemap: true,
                // like gulp-strip-debug before: no console.* / debugger in the minified file
                plugins: [terser({compress: {drop_console: true, drop_debugger: true}})]}, output)
        ]
    };
}

export default [
    bundle('dist', [globalD3()]),
    bundle('dist/standalone', [])
];
