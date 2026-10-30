#!/usr/bin/env node
// Build check in an isolated copy (docs/modernization/TESTING.md).
//
//  1. copy the tracked files of the working tree to a temp dir, `npm ci` there
//  2. `npm run build`: exit code 0, no errors or warnings in the log
//  3. all 8 dist artifacts exist and are not empty
//  4. no file outside dist/ was changed, added or removed
//  5. against the committed dist at HEAD: same CSS rules in the same order;
//     JS bundles are not compared byte by byte (behaviour is tested in 6),
//     but no bundled package@version may be new; sizes are reported
//  6. unit + browser tests against the fresh dist (ODC_DIST)
//  7. compile errors: a JS or SCSS error injected into its own fresh copy
//     must fail the npm script with the tool's exit code and a diagnostic
//     naming the injected line, without touching files outside dist/
//  8. dev scripts: `npm run serve` serves an example and dist/,
//     `npm run watch` rebuilds JS and CSS after a change and stops cleanly
//
// Usage: node scripts/check-build.js [--keep] [--skip-tests] [--skip-error-cases] [--skip-dev-scripts]
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const zlib = require('zlib');
const crypto = require('crypto');
const {spawn, spawnSync, execFileSync} = require('child_process');

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
// Rollup errors ([!]) and warnings ((!)), Sass/Babel errors
const LOG_PROBLEMS = /^\[!\]|^\(!\)|\b(SyntaxError|TypeError|ReferenceError|RollupError)\b|^Error:|^Warning:|^DEPRECATION WARNING/m;

const failures = [];
const fail = msg => {
    failures.push(msg);
    console.error('FAIL ' + msg);
};
const ok = msg => console.log('ok   ' + msg);
const plain = log => log.replace(/\u001b\[[\d;]*m/g, '');

function run(cmd, cmdArgs, opts) {
    const started = Date.now();
    const r = spawnSync(cmd, cmdArgs, Object.assign({encoding: 'utf8', maxBuffer: 1 << 28}, opts));
    const log = (r.stdout || '') + (r.stderr || '');
    if (opts && opts.log) {
        fs.writeFileSync(opts.log, log);
    }
    return {status: r.error ? -1 : r.status, log: plain(log), seconds: Math.round((Date.now() - started) / 100) / 10, error: r.error};
}

function npmRun(work, logs, name, script) {
    const r = run('npm', ['run', script], {cwd: work, log: path.join(logs, name + '.log')});
    console.log('     npm run ' + script + ': exit ' + r.status + ' in ' + r.seconds + ' s, log ' + path.join(logs, name + '.log'));
    return r;
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

const atHead = rel => execFileSync('git', ['show', 'HEAD:' + rel], {cwd: root, maxBuffer: 1 << 28});

// Rules as "selector{decl;decl}" with insignificant whitespace removed. The
// minifiers spell some values differently (clean-css: 700, Sass: bold).
function cssRules(css) {
    return css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ')
        .replace(/\s*([{}:;,>+~!])\s*/g, '$1').replace(/;}/g, '}')
        .replace(/font-weight:bold\b/g, 'font-weight:700')
        .split('}').filter(Boolean);
}

function compareCss(work) {
    for (const rel of ['dist/odc-d3.css', 'dist/odc-d3.min.css']) {
        const ref = atHead(rel).toString('utf8'), cur = fs.readFileSync(path.join(work, rel), 'utf8');
        if (rel === 'dist/odc-d3.css' && ref.replace(/\n+/g, '\n').trim() !== cur.replace(/\n+/g, '\n').trim()) {
            fail(rel + ' differs from HEAD beyond blank lines');
            continue;
        }
        const a = cssRules(ref), b = cssRules(cur);
        const i = a.findIndex((r, j) => r !== b[j]);
        if (i >= 0 || a.length !== b.length) {
            fail(rel + ': rule ' + (i >= 0 ? i + 1 : Math.min(a.length, b.length) + 1) + ' differs from HEAD: '
                + JSON.stringify(a[i]) + ' vs ' + JSON.stringify(b[i]));
        } else {
            ok(rel + ': same ' + a.length + ' rules in the same order as HEAD');
        }
    }
}

// "name@version" of every package with code in a bundle, from its source map
// and the lockfile the bundle was built from
function inventory(map, mapDir, lock) {
    const out = new Set();
    for (const s of map.sources) {
        const p = path.posix.normalize(path.posix.join(mapDir, s));
        const i = p.lastIndexOf('node_modules/');
        if (i < 0) {
            continue;
        }
        const parts = p.slice(i + 'node_modules/'.length).split('/');
        const installPath = p.slice(0, i) + 'node_modules/' + parts.slice(0, parts[0].startsWith('@') ? 2 : 1).join('/');
        const entry = lock.packages[installPath];
        // browser-pack: browserify's prelude, not a package of the library
        if (!/node_modules\/browser-pack$/.test(installPath)) {
            out.add(installPath.replace(/.*node_modules\//, '') + '@' + (entry ? entry.version : '?'));
        }
    }
    return out;
}

function compareJs(work) {
    const headLock = JSON.parse(atHead('package-lock.json'));
    const lock = JSON.parse(fs.readFileSync(path.join(work, 'package-lock.json'), 'utf8'));
    for (const rel of ['dist/odc-d3.min.js.map', 'dist/standalone/odc-d3.min.js.map']) {
        const mapDir = path.posix.dirname(rel);
        // committed maps (browserify) list sources relative to the repository root
        const refMap = JSON.parse(atHead(rel));
        const ref = inventory(refMap, refMap.sources.some(s => s.startsWith('../')) ? mapDir : '.', headLock);
        const cur = inventory(JSON.parse(fs.readFileSync(path.join(work, rel), 'utf8')), mapDir, lock);
        const added = [...cur].filter(p => !ref.has(p)), removed = [...ref].filter(p => !cur.has(p));
        if (added.length || cur.has('?')) {
            fail(rel.replace('.min.js.map', '') + ' bundles packages that HEAD does not: ' + added.join(', '));
        } else {
            ok(rel.replace('.min.js.map', '') + ' bundles ' + cur.size + ' packages, none new'
                + (removed.length ? ' (no code left from: ' + removed.join(', ') + ')' : ' (same set as HEAD)'));
        }
    }
    const kb = n => (n / 1024).toFixed(1).padStart(8) + ' KiB';
    console.log('     size: file, HEAD, fresh (gzip HEAD, gzip fresh)');
    for (const rel of ARTIFACTS) {
        const a = atHead(rel), b = fs.readFileSync(path.join(work, rel));
        console.log('     ' + rel.padEnd(36) + kb(a.length) + kb(b.length)
            + ' (' + kb(zlib.gzipSync(a).length).trim() + ', ' + kb(zlib.gzipSync(b).length).trim() + ')');
    }
}

function copyTracked(dest) {
    const tracked = execFileSync('git', ['ls-files', '-z'], {cwd: root, encoding: 'utf8'}).split('\0').filter(Boolean);
    for (const rel of tracked) {
        const src = path.join(root, rel);
        if (!fs.existsSync(src)) {
            continue; // deleted in the working tree
        }
        fs.mkdirSync(path.dirname(path.join(dest, rel)), {recursive: true});
        fs.copyFileSync(src, path.join(dest, rel));
    }
    return tracked.length;
}

const OLD_MTIME = new Date('2000-01-01T00:00:00Z');

// sha256 + mtime of each artifact; null when missing or empty
function artifactState(dir) {
    const out = {};
    for (const rel of ARTIFACTS) {
        const p = path.join(dir, rel);
        out[rel] = fs.existsSync(p) && fs.statSync(p).size > 0
            ? crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex') + ' ' + fs.statSync(p).mtimeMs : null;
    }
    return out;
}

// diagnostic(log, line): the log reports the injected error with its file,
// the line number of the injected line and the code frame
const JS_ERROR = {file: 'src/utils.js', marker: 'odcInjectedJsError', append: '\nexport const odcInjectedJsError = ;\n',
    diagnostic: (log, line) => new RegExp('\\[!\\] .*Error: .*src[\\\\/]utils\\.js[\\s\\S]*?src/utils\\.js \\(' + line + ':\\d+\\)'
        + '[\\s\\S]*?' + line + ': export const odcInjectedJsError = ;').test(log)};
const SCSS_ERROR = {file: 'src/styles/shared.scss', marker: 'odc-injected-scss-error', append: '\n.odc-injected-scss-error { color: ; }\n',
    diagnostic: (log, line) => new RegExp('Error: Expected expression\\.'
        + '[\\s\\S]*?' + line + ' │ \\.odc-injected-scss-error \\{ color: ; \\}'
        + '[\\s\\S]*?src/styles/shared\\.scss ' + line + ':\\d+').test(log)};
const CSS = ['dist/odc-d3.css', 'dist/odc-d3.min.css'];
const JS = ARTIFACTS.filter(rel => !CSS.includes(rel));
const RUNS_ROLLUP = '> rollup -c', RUNS_SASS = '> sass ';

// `exit`: exit code of the failing tool (Rollup 1, Dart Sass 65), passed on by
// npm. `dist`: what is left in dist/ afterwards (the copy starts with the
// committed dist): 'kept' = untouched (content and mtime), 'missing',
// 'written'. Observed behaviour, dist/ is not replaced atomically.
const ERROR_CASES = [
    {name: 'js-error-build-js', script: 'build:js', inject: [JS_ERROR], exit: 1,
        ran: [RUNS_ROLLUP], dist: {kept: ARTIFACTS}},
    // Dart Sass deletes the output file it failed to write; the second
    // (compressed) run does not start
    {name: 'scss-error-build-css', script: 'build:css', inject: [SCSS_ERROR], exit: 65,
        ran: [RUNS_SASS], dist: {missing: ['dist/odc-d3.css'], kept: ['dist/odc-d3.min.css'].concat(JS)}},
    // build = clean, build:css, build:js
    {name: 'js-error-build', script: 'build', inject: [JS_ERROR], exit: 1,
        ran: [RUNS_SASS, RUNS_ROLLUP], dist: {written: CSS, missing: JS}},
    {name: 'scss-error-build', script: 'build', inject: [SCSS_ERROR], exit: 65,
        ran: [RUNS_SASS], notRun: [RUNS_ROLLUP], dist: {missing: ARTIFACTS}}
];

function errorCases(base, nodeModules, logs) {
    for (const c of ERROR_CASES) {
        // fresh copy per case: a failure cannot leak into the next case
        const work = base + '-' + c.name;
        copyTracked(work);
        fs.symlinkSync(nodeModules, path.join(work, 'node_modules'), 'dir');
        const before = sourceFiles(work);
        // old mtime: a rewrite with identical content still counts as 'written'
        ARTIFACTS.forEach(rel => fs.utimesSync(path.join(work, rel), OLD_MTIME, OLD_MTIME));
        const distBefore = artifactState(work);
        const originals = c.inject.map(e => fs.readFileSync(path.join(work, e.file)));
        c.inject.forEach(e => fs.appendFileSync(path.join(work, e.file), e.append));
        const lines = c.inject.map(e => fs.readFileSync(path.join(work, e.file), 'utf8').split('\n')
            .findIndex(l => l.includes(e.marker)) + 1);
        const r = npmRun(work, logs, 'error-' + c.name, c.script);
        c.inject.forEach((e, i) => fs.writeFileSync(path.join(work, e.file), originals[i]));

        const problems = [];
        if (r.status !== c.exit) {
            problems.push('exit ' + r.status + ', expected ' + c.exit + (r.error ? ' (' + r.error.message + ')' : ''));
        }
        c.inject.forEach((e, i) => {
            if (!e.diagnostic(r.log, lines[i])) {
                problems.push('no diagnostic for the error injected into ' + e.file + ':' + lines[i]);
            }
        });
        c.ran.filter(s => !r.log.includes(s)).forEach(s => problems.push("'" + s.trim() + "' did not run"));
        (c.notRun || []).filter(s => r.log.includes(s)).forEach(s => problems.push("'" + s.trim() + "' ran after the failure"));

        const distAfter = artifactState(work);
        const state = rel => distAfter[rel] === null ? 'missing'
            : distAfter[rel] === distBefore[rel] ? 'kept' : 'written';
        for (const expect of ['kept', 'missing', 'written']) {
            (c.dist[expect] || []).filter(rel => state(rel) !== expect)
                .forEach(rel => problems.push(rel + ' ' + state(rel) + ', expected ' + expect));
        }
        const described = ARTIFACTS.map(rel => rel.replace('dist/', '') + ' ' + state(rel)).join(', ');

        if (problems.length) {
            fail(c.name + ': ' + problems.join('; '));
        } else {
            ok(c.name + ': exit ' + r.status + ' with diagnostic; dist: ' + described);
        }
        checkSourcesUnchanged(before, work, c.name);
        if (!args.has('--keep')) {
            fs.rmSync(work, {recursive: true, force: true});
        }
    }
}

// --- dev scripts (step 8) ---

// own process group (not on Windows), so leftover watcher processes can be
// detected and killed
const GROUPS = process.platform !== 'win32';

function start(work, logFile, script, scriptArgs) {
    const child = spawn(process.execPath, [path.join(work, 'scripts', script)].concat(scriptArgs), {cwd: work, detached: GROUPS});
    child.output = '';
    const collect = d => {
        child.output += d;
        fs.appendFileSync(logFile, d);
    };
    child.stdout.on('data', collect);
    child.stderr.on('data', collect);
    child.exited = new Promise(resolve => child.on('exit', (code, signal) => resolve({code, signal})));
    return child;
}

async function waitFor(what, predicate, seconds) {
    const end = Date.now() + seconds * 1000;
    while (Date.now() < end) {
        if (await predicate()) {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    fail('timeout (' + seconds + ' s) waiting for ' + what);
    return false;
}

function get(port, urlPath) {
    return new Promise(resolve => {
        http.get({host: '127.0.0.1', port, path: urlPath}, res => {
            let body = '';
            res.on('data', d => body += d);
            res.on('end', () => resolve({status: res.statusCode, type: res.headers['content-type'] || '', location: res.headers.location, body}));
        }).on('error', e => resolve({status: -1, body: e.message}));
    });
}

async function checkServe(work, logs) {
    const child = start(work, path.join(logs, 'serve.log'), 'serve.js', ['--port', '0']);
    let port;
    if (await waitFor('serve.js to listen', () => (port = (child.output.match(/127\.0\.0\.1:(\d+)\/examples\//) || [])[1]), 20)) {
        const page = await get(port, '/examples/scatterplot/');
        const bundle = await get(port, '/dist/odc-d3.js');
        const redirect = await get(port, '/examples/scatterplot');
        const outside = await get(port, '/%2e%2e/%2e%2e/etc/passwd');
        const problems = [];
        if (page.status !== 200 || !/text\/html/.test(page.type) || !page.body.includes('../../dist/odc-d3.js')) {
            problems.push('example page: ' + page.status + ' ' + page.type);
        }
        if (bundle.status !== 200 || !/javascript/.test(bundle.type)
            || bundle.body !== fs.readFileSync(path.join(work, 'dist/odc-d3.js'), 'utf8')) {
            problems.push('dist/odc-d3.js: ' + bundle.status + ' ' + bundle.type);
        }
        if (redirect.status !== 301 || redirect.location !== '/examples/scatterplot/') {
            problems.push('no redirect to the directory URL: ' + redirect.status);
        }
        if (outside.status !== 403 && outside.status !== 404) {
            problems.push('path outside the repository: ' + outside.status);
        }
        if (problems.length) {
            fail('npm run serve: ' + problems.join('; '));
        } else {
            ok('npm run serve: example page, dist bundle, directory redirect; nothing outside the repository');
        }
    }
    child.kill();
    await child.exited;
}

function groupAlive(pid) {
    try {
        process.kill(-pid, 0);
        return true;
    } catch (e) {
        return false;
    }
}

async function checkWatch(work, logs) {
    const css = path.join(work, 'dist/odc-d3.css'), minCss = path.join(work, 'dist/odc-d3.min.css');
    const js = path.join(work, 'dist/odc-d3.js'), standalone = path.join(work, 'dist/standalone/odc-d3.js');
    const read = f => fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '';
    const scss = path.join(work, 'src/styles/shared.scss'), utils = path.join(work, 'src/utils.js');
    const originals = [scss, utils].map(f => fs.readFileSync(f));
    fs.rmSync(path.join(work, 'dist'), {recursive: true, force: true});

    const child = start(work, path.join(logs, 'watch.log'), 'watch.js', []);
    const built = () => /created dist\/standalone\/odc-d3\.js/.test(plain(child.output))
        && (plain(child.output).match(/Compiled src[\\/]odc-d3\.scss/g) || []).length >= 2;
    if (await waitFor('the initial watch build', built, 120)) {
        ok('npm run watch: initial build of ' + ARTIFACTS.filter(rel => fs.existsSync(path.join(work, rel))).length + ' artifacts');
        fs.appendFileSync(scss, '\n.odc-watch-check { color: red; }\n');
        fs.appendFileSync(utils, "\nconsole.log('odc-watch-check');\n");
        if (await waitFor('watch to rebuild after a change', () => read(css).includes('.odc-watch-check')
            && read(minCss).includes('.odc-watch-check') && read(js).includes('odc-watch-check')
            && read(standalone).includes('odc-watch-check'), 120)) {
            ok('npm run watch: rebuilt both CSS files and both bundles after a change');
        }
    }
    child.kill('SIGTERM');
    const exit = await Promise.race([child.exited, new Promise(resolve => setTimeout(() => resolve(null), 20000))]);
    if (!exit) {
        fail('npm run watch did not stop within 20 s after SIGTERM');
        GROUPS ? process.kill(-child.pid, 'SIGKILL') : child.kill('SIGKILL');
    } else if (exit.code !== 0) {
        fail('npm run watch exited ' + JSON.stringify(exit) + ' after SIGTERM');
    } else {
        ok('npm run watch: stopped with exit 0 after SIGTERM');
    }
    if (GROUPS && groupAlive(child.pid)) {
        fail('watcher processes still running after npm run watch exited');
        process.kill(-child.pid, 'SIGKILL');
    }
    [scss, utils].forEach((f, i) => fs.writeFileSync(f, originals[i]));
}

async function devScripts(base, nodeModules, logs) {
    const work = base + '-dev-scripts';
    copyTracked(work);
    fs.symlinkSync(nodeModules, path.join(work, 'node_modules'), 'dir');
    const before = sourceFiles(work);
    await checkServe(work, logs);
    await checkWatch(work, logs);
    checkSourcesUnchanged(before, work, 'dev scripts');
    if (!args.has('--keep')) {
        fs.rmSync(work, {recursive: true, force: true});
    }
}

async function main() {
    const work = fs.mkdtempSync(path.join(os.tmpdir(), 'odc-build-'));
    const logs = work + '-logs';
    fs.mkdirSync(logs);
    console.log('isolated copy: ' + work);

    ok('copied ' + copyTracked(work) + ' tracked files');

    const ci = run('npm', ['ci', '--no-audit', '--no-fund'], {cwd: work, log: path.join(logs, 'npm-ci.log')});
    if (ci.status !== 0) {
        fail('npm ci exited ' + ci.status + ' (log: ' + path.join(logs, 'npm-ci.log') + ')');
        return finish(work, logs);
    }
    ok('npm ci in ' + ci.seconds + ' s');

    // the artifacts must come from this build, not from the committed dist/
    fs.rmSync(path.join(work, 'dist'), {recursive: true, force: true});
    const before = sourceFiles(work);
    const build = npmRun(work, logs, 'build', 'build');
    if (build.status !== 0) {
        fail('npm run build exited ' + build.status);
    }
    const problem = build.log.split('\n').find(l => LOG_PROBLEMS.test(l));
    if (problem) {
        fail('error or warning in build log: ' + problem.trim());
    } else {
        ok('no errors or warnings in build log');
    }
    checkArtifacts(work);
    checkSourcesUnchanged(before, work, 'npm run build');
    compareCss(work);
    compareJs(work);

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

    if (!args.has('--skip-error-cases')) {
        errorCases(work, path.join(work, 'node_modules'), logs);
    }
    if (!args.has('--skip-dev-scripts')) {
        await devScripts(work, path.join(work, 'node_modules'), logs);
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

main().catch(e => {
    console.error(e);
    process.exitCode = 1;
});
