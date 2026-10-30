#!/usr/bin/env node
// Build check in an isolated copy (docs/modernization/TESTING.md).
//
//  1. copy the tracked files of the working tree to a temp dir, `npm ci` there
//  2. run `gulp` (default task) and fail on a non-zero exit code or on error
//     markers in the log (the build exits 0 on compile errors, BASELINE §4.2)
//  3. all 8 dist artifacts exist and are not empty
//  4. no file outside dist/ was changed, added or removed (src/d3.js swap)
//  5. dist equals the committed dist at HEAD, except line endings inside
//     source map sourcesContent (BASELINE §4.3)
//  6. unit + browser tests against the fresh dist (ODC_DIST)
//  7. known-bug cases of BASELINE §8.1: compile errors still exit 0
//
// Usage: node scripts/check-build.js [--keep] [--skip-tests] [--skip-known-bugs]
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const {spawnSync, execFileSync} = require('child_process');

const root = path.resolve(__dirname, '..');
const args = new Set(process.argv.slice(2));
const ARTIFACTS = [
    'dist/odc-d3.css',
    'dist/odc-d3.min.css',
    'dist/odc-d3.js',
    'dist/odc-d3.min.js',
    'dist/odc-d3.min.js.map',
    'dist/standalone/odc-d3.js',
    'dist/standalone/odc-d3.min.js',
    'dist/standalone/odc-d3.min.js.map'
];
const ERROR_MARKERS = /\b(SyntaxError|PluginError|TypeError|ReferenceError|onError)\b|\bError:/;
const INLINE_MAP = '//# sourceMappingURL=data:application/json;charset=utf-8;base64,';

const failures = [];
const fail = msg => {
    failures.push(msg);
    console.error('FAIL ' + msg);
};
const ok = msg => console.log('ok   ' + msg);

function run(cmd, cmdArgs, opts) {
    const started = Date.now();
    const r = spawnSync(cmd, cmdArgs, Object.assign({encoding: 'utf8', maxBuffer: 1 << 28}, opts));
    const log = (r.stdout || '') + (r.stderr || '');
    if (opts && opts.log) {
        fs.writeFileSync(opts.log, log);
    }
    return {status: r.error ? -1 : r.status, log, seconds: Math.round((Date.now() - started) / 100) / 10, error: r.error};
}

function walk(dir, base, skip, out) {
    for (const name of fs.readdirSync(dir)) {
        const abs = path.join(dir, name);
        const rel = path.relative(base, abs).split(path.sep).join('/');
        if (skip.some(s => rel === s || rel.startsWith(s + '/'))) {
            continue;
        }
        if (fs.statSync(abs).isDirectory()) {
            walk(abs, base, skip, out);
        } else {
            out[rel] = crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');
        }
    }
    return out;
}

function sourceFiles(dir) {
    return walk(dir, dir, ['node_modules', 'dist', 'test/vendor/node_modules'], {});
}

function splitInlineMap(buf) {
    const s = buf.toString('utf8');
    const i = s.lastIndexOf(INLINE_MAP);
    if (i < 0) {
        throw new Error('no inline source map');
    }
    return {code: s.slice(0, i), map: JSON.parse(Buffer.from(s.slice(i + INLINE_MAP.length), 'base64').toString('utf8'))};
}

// Returns null when equal (allowing EOL-only differences in sourcesContent), else a reason.
function compareMaps(a, b) {
    const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])].sort();
    for (const k of keys) {
        if (k === 'sourcesContent') {
            continue;
        }
        if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) {
            return 'source map field "' + k + '" differs';
        }
    }
    const sa = a.sourcesContent || [], sb = b.sourcesContent || [];
    if (sa.length !== sb.length) {
        return 'sourcesContent length ' + sa.length + ' vs ' + sb.length;
    }
    let eolOnly = 0;
    for (let i = 0; i < sa.length; i++) {
        if (sa[i] === sb[i]) {
            continue;
        }
        if (typeof sa[i] === 'string' && typeof sb[i] === 'string'
            && sa[i].replace(/\r\n/g, '\n') === sb[i].replace(/\r\n/g, '\n')) {
            eolOnly++;
            continue;
        }
        return 'sourcesContent of ' + a.sources[i] + ' differs beyond line endings';
    }
    return {eolOnly};
}

function compareWithHead(work) {
    for (const rel of ARTIFACTS) {
        const ref = execFileSync('git', ['show', 'HEAD:' + rel], {cwd: root, maxBuffer: 1 << 28});
        const cur = fs.readFileSync(path.join(work, rel));
        if (ref.equals(cur)) {
            ok(rel + ' byte-identical to HEAD');
            continue;
        }
        let res;
        if (rel.endsWith('.map')) {
            res = compareMaps(JSON.parse(ref.toString('utf8')), JSON.parse(cur.toString('utf8')));
        } else if (rel === 'dist/odc-d3.js' || rel === 'dist/standalone/odc-d3.js') {
            const a = splitInlineMap(ref), b = splitInlineMap(cur);
            res = a.code === b.code ? compareMaps(a.map, b.map) : 'generated code differs';
        } else {
            res = 'content differs';
        }
        if (typeof res === 'string') {
            fail(rel + ': ' + res);
        } else {
            ok(rel + ' equal to HEAD except line endings in ' + res.eolOnly + ' sourcesContent entries');
        }
    }
}

function checkArtifacts(work) {
    const missing = ARTIFACTS.filter(rel => {
        const p = path.join(work, rel);
        return !fs.existsSync(p) || fs.statSync(p).size === 0;
    });
    if (missing.length) {
        fail('missing or empty artifacts: ' + missing.join(', '));
    } else {
        ok('all ' + ARTIFACTS.length + ' artifacts exist and are not empty');
    }
}

function checkSourcesUnchanged(before, work, label) {
    const after = sourceFiles(work);
    const changed = [...new Set([...Object.keys(before), ...Object.keys(after)])]
        .filter(f => before[f] !== after[f]).sort();
    if (changed.length) {
        fail(label + ' changed files outside dist/: ' + changed.join(', '));
    } else {
        ok(label + ' left all ' + Object.keys(before).length + ' files outside dist/ unchanged');
    }
}

function gulp(work, logs, name, task) {
    const r = run('npx', ['--no-install', 'gulp'].concat(task ? [task] : []), {cwd: work, log: path.join(logs, name + '.log')});
    console.log('     gulp ' + (task || '(default)') + ': exit ' + r.status + ' in ' + r.seconds + ' s, log ' + path.join(logs, name + '.log'));
    return r;
}

// BASELINE §8.1: compile errors do not fail the build. Each case pins the
// current behaviour; when the exit code becomes non-zero the bug is fixed and
// this script must be updated (it fails loudly instead of silently passing).
function knownBugCases(work, logs) {
    const cases = [
        {
            name: 'js-syntax-error-build-js',
            file: 'src/utils.js', append: '\nexport const broken = ;\n', task: 'build-js',
            current: r => /SyntaxError/.test(r.log)
        },
        {
            name: 'scss-error-build-css',
            file: 'src/styles/shared.scss', append: '\n.broken { color: ; \n', task: 'build-css',
            current: r => /onError PluginError/.test(r.log)
                && !fs.readFileSync(path.join(work, 'dist/odc-d3.css'), 'utf8').includes('.odc-tooltip')
        },
        {
            name: 'js-syntax-error-default',
            file: 'src/utils.js', append: '\nexport const broken = ;\n', task: null,
            current: r => /SyntaxError/.test(r.log)
                && !fs.existsSync(path.join(work, 'dist/odc-d3.js'))
                && !fs.existsSync(path.join(work, 'dist/standalone/odc-d3.js'))
        }
    ];
    for (const c of cases) {
        const file = path.join(work, c.file);
        const original = fs.readFileSync(file);
        const before = sourceFiles(work);
        fs.appendFileSync(file, c.append);
        const r = gulp(work, logs, 'known-bug-' + c.name, c.task);
        fs.writeFileSync(file, original);
        if (r.status !== 0) {
            fail('[known bug §8.1] ' + c.name + ': build now exits ' + r.status
                + ' - the bug looks fixed, update scripts/check-build.js and BASELINE.md');
        } else if (!c.current(r)) {
            fail('[known bug §8.1] ' + c.name + ': exit 0 but the pinned current behaviour changed, see log');
        } else {
            ok('[known bug §8.1] ' + c.name + ': still exits 0 despite the compile error (current behaviour)');
        }
        // the swap of src/d3.js must still be undone after a failed compile
        checkSourcesUnchanged(before, work, c.name);
    }
}

function main() {
    const work = fs.mkdtempSync(path.join(os.tmpdir(), 'odc-build-'));
    const logs = work + '-logs';
    fs.mkdirSync(logs);
    console.log('isolated copy: ' + work);

    const tracked = execFileSync('git', ['ls-files', '-z'], {cwd: root, encoding: 'utf8'}).split('\0').filter(Boolean);
    for (const rel of tracked) {
        const src = path.join(root, rel);
        if (!fs.existsSync(src)) {
            continue; // deleted in the working tree
        }
        fs.mkdirSync(path.dirname(path.join(work, rel)), {recursive: true});
        fs.copyFileSync(src, path.join(work, rel));
    }
    ok('copied ' + tracked.length + ' tracked files');

    const ci = run('npm', ['ci', '--no-audit', '--no-fund'], {cwd: work, log: path.join(logs, 'npm-ci.log')});
    if (ci.status !== 0) {
        fail('npm ci exited ' + ci.status + ' (log: ' + path.join(logs, 'npm-ci.log') + ')');
        return finish(work, logs);
    }
    ok('npm ci in ' + ci.seconds + ' s');

    const before = sourceFiles(work);
    const build = gulp(work, logs, 'gulp-default', null);
    if (build.status !== 0) {
        fail('gulp exited ' + build.status);
    }
    const marker = build.log.split('\n').find(l => ERROR_MARKERS.test(l));
    if (marker) {
        fail('error marker in build log: ' + marker.trim());
    } else {
        ok('no error markers in build log');
    }
    checkArtifacts(work);
    checkSourcesUnchanged(before, work, 'gulp');
    compareWithHead(work);

    if (!args.has('--skip-tests')) {
        const env = Object.assign({}, process.env, {ODC_DIST: path.join(work, 'dist')});
        for (const script of ['test:unit', 'test:browser']) {
            const r = run('npm', ['run', script], {cwd: root, env, log: path.join(logs, script.replace(':', '-') + '.log')});
            const summary = r.log.split('\n').filter(l => /^# (pass|fail)|\d+ (passed|failed|skipped)/.test(l.trim())).map(l => l.trim()).join(', ');
            if (r.status !== 0) {
                fail('npm run ' + script + ' on fresh dist exited ' + r.status + ' (' + summary + ')');
            } else {
                ok('npm run ' + script + ' on fresh dist (' + summary + ')');
            }
        }
    }

    if (!args.has('--skip-known-bugs')) {
        knownBugCases(work, logs);
    }
    return finish(work, logs);
}

function finish(work, logs) {
    if (!args.has('--keep')) {
        fs.rmSync(work, {recursive: true, force: true});
    }
    console.log(failures.length ? '\n' + failures.length + ' check(s) failed' : '\nall build checks passed');
    console.log('logs: ' + logs);
    process.exitCode = failures.length ? 1 : 0;
}

main();
