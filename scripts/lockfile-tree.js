#!/usr/bin/env node
// Prints "<install path> <version> <integrity> <dev|prod>[ opt]" for every package
// of a v1 or v2/v3 package-lock.json, sorted. Used to show that a lockfile
// change does not alter resolutions:
//   git show <rev>:package-lock.json > /tmp/old.json
//   diff <(node scripts/lockfile-tree.js /tmp/old.json) <(node scripts/lockfile-tree.js package-lock.json)
'use strict';
const path = require('path');

const lock = require(path.resolve(process.argv[2] || 'package-lock.json'));
const out = [];
const line = (p, v) => [p, v.version, v.integrity || '', v.dev ? 'dev' : 'prod'].join(' ') + (v.optional ? ' opt' : '');

if (lock.packages) {
    for (const [p, v] of Object.entries(lock.packages)) {
        if (p !== '') {
            out.push(line(p, v));
        }
    }
} else {
    (function walk(deps, prefix) {
        for (const [name, v] of Object.entries(deps || {})) {
            const p = prefix + 'node_modules/' + name;
            out.push(line(p, v));
            walk(v.dependencies, p + '/');
        }
    })(lock.dependencies, '');
}
console.log(out.sort().join('\n'));
