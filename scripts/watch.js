#!/usr/bin/env node
// Rebuilds dist/ on source changes: Rollup watch for both bundles and Sass
// watch for both CSS files. Ctrl+C stops all three; if one watcher exits,
// the others are stopped too. Compile errors are printed and watching goes on.
//
// Usage: npm run watch
'use strict';

const path = require('path');
const {spawn} = require('child_process');

const root = path.resolve(__dirname, '..');
const rollup = require.resolve('rollup/dist/bin/rollup');
const sass = require.resolve('sass/sass.js');
const watchers = [
    [rollup, '-c', '--watch'],
    [sass, '--watch', '--no-source-map', '--no-error-css', 'src/odc-d3.scss', 'dist/odc-d3.css'],
    [sass, '--watch', '--no-source-map', '--no-error-css', '--style=compressed', 'src/odc-d3.scss', 'dist/odc-d3.min.css']
];

let stopping = false;
const children = watchers.map(args => spawn(process.execPath, args, {cwd: root, stdio: 'inherit'}));

function stop(code) {
    if (stopping) {
        return;
    }
    stopping = true;
    process.exitCode = code;
    children.filter(c => c.exitCode === null && c.signalCode === null).forEach(c => c.kill());
}

children.forEach(c => c.on('exit', code => stop(code || 0)));
['SIGINT', 'SIGTERM'].forEach(signal => process.on(signal, () => stop(0)));
