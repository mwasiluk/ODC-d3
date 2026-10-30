#!/usr/bin/env node
// Build check in an isolated copy (docs/modernization/TESTING.md).
//
//  1. copy the tracked files of the working tree to a temp dir, `npm ci` there
//  2. run `gulp` (default task) and fail on a non-zero exit code or on error
//     markers in the log
//  3. all 8 dist artifacts exist and are not empty
//  4. no file outside dist/ was changed, added or removed (src/d3.js swap)
//  5. dist equals the committed dist at HEAD, except line endings inside
//     source map sourcesContent (BASELINE §4.3)
//  6. unit + browser tests against the fresh dist (ODC_DIST)
//  7. compile error cases (BASELINE §8.1, fixed): each injects a JS or SCSS
//     error into its own fresh copy and requires exit code 1, a diagnostic
//     naming the injected error, skipped dependent tasks and restored sources
//
// Usage: node scripts/check-build.js [--keep] [--skip-tests] [--skip-error-cases]
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

function gulp(work, logs, name, tasks) {
    const r = run('npx', ['--no-install', 'gulp'].concat(tasks), {cwd: work, log: path.join(logs, name + '.log')});
    console.log('     gulp ' + (tasks.join(' ') || '(default)') + ': exit ' + r.status + ' in ' + r.seconds + ' s, log ' + path.join(logs, name + '.log'));
    return r;
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

// diagnostic(log, line): the (ANSI-stripped) log reports the injected error
// with its file and the line number of the injected line
const JS_ERROR = {file: 'src/utils.js', marker: 'odcInjectedJsError', append: '\nexport const odcInjectedJsError = ;\n',
    diagnostic: (log, line) => new RegExp('SyntaxError: \\S*src[\\\\/]utils\\.js: Unexpected token \\(' + line + ':\\d+\\)'
        + '[\\s\\S]*?> ' + line + ' \\| export const odcInjectedJsError = ;').test(log)};
const SCSS_ERROR = {file: 'src/styles/shared.scss', marker: 'odc-injected-scss-error', append: '\n.odc-injected-scss-error { color: ; }\n',
    diagnostic: (log, line) => new RegExp('Error in plugin "gulp-sass"[\\s\\S]*?Error: Expected expression\\.'
        + '[\\s\\S]*?' + line + ' \u2502 \\.odc-injected-scss-error \\{ color: ; \\}'
        + '[\\s\\S]*?src/styles/shared\\.scss ' + line + ':\\d+').test(log)};
// a task that fails as soon as src/d3.js holds the global variant, so its
// diagnostic proves the swap happened before gulp-cli exited
const FAIL_WHILE_SWAPPED = {file: 'gulpfile.js', marker: 'odc-fail-while-swapped', append: [
    '',
    "gulp.task('odc-fail-while-swapped', function (done) {",
    "    var fs = require('fs');",
    '    var timer = setInterval(function () {',
    "        if (fs.readFileSync('src/d3.js', 'utf8') === fs.readFileSync('src/d3_global.js', 'utf8')) {",
    '            clearInterval(timer);',
    "            done(new Error('odc injected failure while src/d3.js is swapped'));",
    '        }',
    '    }, 10);',
    '});',
    ''].join('\n'),
    diagnostic: log => /'odc-fail-while-swapped' errored after[\s\S]*?Error: odc injected failure while src\/d3\.js is swapped/.test(log)};
const CSS = ['dist/odc-d3.css', 'dist/odc-d3.min.css'];
const GLOBAL_JS = ['dist/odc-d3.js', 'dist/odc-d3.min.js', 'dist/odc-d3.min.js.map'];
const STANDALONE_JS = ['dist/standalone/odc-d3.js', 'dist/standalone/odc-d3.min.js', 'dist/standalone/odc-d3.min.js.map'];

// BASELINE §8.1 (fixed): a compile error must fail the gulp command. `dist`
// describes what is left in dist/ afterwards (the copy starts with the
// committed dist): 'kept' = previous file untouched (content and mtime),
// 'missing', 'written' = produced by a task that did not depend on the failed
// one. This is the observed behaviour, not an atomicity guarantee.
const ERROR_CASES = [
    {name: 'js-error-build-js', tasks: ['build-js'], inject: [JS_ERROR],
        errored: ['build-js'], notStarted: [],
        dist: {kept: CSS.concat(GLOBAL_JS, STANDALONE_JS)}},
    {name: 'js-error-build-js-standalone', tasks: ['build-js-standalone'], inject: [JS_ERROR],
        errored: ['build-js-standalone'], notStarted: [],
        dist: {kept: CSS.concat(GLOBAL_JS, STANDALONE_JS)}},
    {name: 'scss-error-build-css', tasks: ['build-css'], inject: [SCSS_ERROR],
        errored: ['build-css'], notStarted: [],
        dist: {kept: CSS.concat(GLOBAL_JS, STANDALONE_JS)}},
    // build: build-js runs to the end although build-css failed (settled parallel)
    {name: 'js-and-scss-error-build', tasks: ['build'], inject: [JS_ERROR, SCSS_ERROR],
        errored: ['build-css', 'build-js', 'build'], notStarted: [],
        dist: {kept: CSS.concat(GLOBAL_JS, STANDALONE_JS)}},
    {name: 'js-error-default', tasks: [], inject: [JS_ERROR],
        errored: ['build-js', 'build', 'build-clean', 'default'], finished: ['clean', 'build-css'],
        notStarted: ['build-js-standalone'],
        dist: {written: CSS, missing: GLOBAL_JS.concat(STANDALONE_JS)}},
    {name: 'scss-error-default', tasks: [], inject: [SCSS_ERROR],
        errored: ['build-css', 'build', 'build-clean', 'default'], finished: ['clean', 'build-js'],
        notStarted: ['build-js-standalone'],
        dist: {written: GLOBAL_JS, missing: CSS.concat(STANDALONE_JS)}},
    // two tasks on the command line: gulp-cli runs them with gulp.parallel and
    // calls process.exit(1) on the first error while build-js is still running
    // with src/d3.js swapped; the exit hook in gulpfile.js restores it
    {name: 'cli-parallel-error-while-d3-swapped', tasks: ['build-js', 'odc-fail-while-swapped'],
        inject: [FAIL_WHILE_SWAPPED], errored: ['odc-fail-while-swapped'],
        notStarted: [], notFinished: ['build-js'],
        dist: {kept: CSS.concat(STANDALONE_JS)}}
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
        const r = gulp(work, logs, 'error-' + c.name, c.tasks);
        c.inject.forEach((e, i) => fs.writeFileSync(path.join(work, e.file), originals[i]));

        const problems = [];
        if (r.status !== 1) {
            problems.push('exit ' + r.status + ', expected 1' + (r.error ? ' (' + r.error.message + ')' : ''));
        }
        const plain = r.log.replace(/\u001b\[\d+m/g, '');
        if (!/Using gulpfile /.test(plain)) {
            problems.push('gulpfile not loaded');
        }
        c.inject.forEach((e, i) => {
            if (!e.diagnostic(plain, lines[i])) {
                problems.push('no diagnostic for the error injected into ' + e.file + ':' + lines[i]);
            }
        });
        const started = c.tasks.length ? c.tasks : ['default'];
        started.filter(t => !plain.includes("Starting '" + t + "'"))
            .forEach(t => problems.push("task '" + t + "' not started"));
        c.errored.filter(t => !plain.includes("'" + t + "' errored after"))
            .forEach(t => problems.push("no \"'" + t + "' errored\" in log"));
        (c.finished || []).filter(t => !plain.includes("Finished '" + t + "'"))
            .forEach(t => problems.push("task '" + t + "' did not finish"));
        c.notStarted.filter(t => plain.includes("Starting '" + t + "'"))
            .forEach(t => problems.push("dependent task '" + t + "' started after the failure"));
        (c.notFinished || []).filter(t => plain.includes("Finished '" + t + "'"))
            .forEach(t => problems.push("task '" + t + "' finished, expected gulp-cli to exit first"));
        const finishedOk = started.filter(t => plain.includes("Finished '" + t + "'"));
        if (finishedOk.length) {
            problems.push('reported as finished: ' + finishedOk.join(', '));
        }

        const distAfter = artifactState(work);
        const state = rel => distAfter[rel] === null ? 'missing'
            : distAfter[rel] === distBefore[rel] ? 'kept' : 'written';
        for (const expect of ['kept', 'missing', 'written']) {
            (c.dist[expect] || []).filter(rel => state(rel) !== expect)
                .forEach(rel => problems.push(rel + ' ' + state(rel) + ', expected ' + expect));
        }
        const described = ARTIFACTS.map(rel => rel.replace('dist/', '') + ' ' + state(rel)).join(', ');

        if (problems.length) {
            fail('[§8.1] ' + c.name + ': ' + problems.join('; '));
        } else {
            ok('[§8.1] ' + c.name + ': exit 1 with diagnostic; dist: ' + described);
        }
        // src/d3.js must be restored after the failed compile
        checkSourcesUnchanged(before, work, c.name);
        if (!args.has('--keep')) {
            fs.rmSync(work, {recursive: true, force: true});
        }
    }
}

function main() {
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

    const before = sourceFiles(work);
    const build = gulp(work, logs, 'gulp-default', []);
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

    if (!args.has('--skip-error-cases')) {
        errorCases(work, path.join(work, 'node_modules'), logs);
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
