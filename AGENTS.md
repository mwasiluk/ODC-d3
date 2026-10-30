# AGENTS.md – ODC-d3

Instructions for coding agents (and humans) working on this repository.
The verified project state, contracts and known defects are in
[`docs/modernization/BASELINE.md`](docs/modernization/BASELINE.md). Read it
before changing build, dependencies or public API.

## Project

ODC-D3 (Open Data Charts for D3): a browser charting library on top of D3 v7.
Version `2.0.0`. Published to npm as `odc-d3`; `dist/` bundles are committed
and used directly via `<script>` tags. Examples live in `examples/` and are
published on the `gh-pages` branch.

```
src/index.js                 public entry (named exports, applies D3 prototype extensions)
src/chart.js                 Chart / ChartConfig base class (lifecycle, events, $-accessors)
src/chart-with-color-groups.js, src/<chart>.js   chart classes, each with a XxxConfig
src/d3.js                    D3 shim: re-exports the d3-* packages (standalone bundle, npm consumers)
src/d3_import.js             same content as src/d3.js
src/d3_global.js             `module.exports = d3`; the global bundle resolves src/d3.js to it at build time
src/d3-extensions.js         selectOrAppend / selectOrInsert / appendSelector / insertSelector
src/statistics-utils.js      wraps simple-statistics/src/* (deep CJS requires) + tValue
src/statistics-distributions.js  t-distribution (ported code, $-prefixed variables)
src/legend.js                wraps odc-d3-svg-legend
src/styles/*.scss            one Sass module per chart, all @use'd by src/odc-d3.scss
src/odc-d3.scss              CSS entry -> dist/odc-d3(.min).css (Dart Sass CLI)
rollup.config.mjs            JS build of both bundles (Rollup + Babel)
dist/odc-d3(.min).js         UMD `ODCD3`, needs global d3 v7 loaded first
dist/standalone/odc-d3(.min).js  UMD `ODCD3`, D3 bundled
examples/<chart>/            demo pages loading d3 from https://d3js.org/d3.v7.min.js
docs/modernization/          modernization program docs and evidence
test/unit/, test/browser/    contract tests (node:test, Playwright), see docs/modernization/TESTING.md
test/vendor/                 test-only d3 7.9.0 and a font file, separate lockfile (keeps root runtime tree unchanged)
scripts/check-build.js       build check in an isolated copy
scripts/clean.js, watch.js, serve.js   used by the npm scripts below
```

## Commands

```bash
npm ci                 # install from package-lock.json (lockfile v3)
npm run test:setup     # test/vendor (d3 for the global-bundle tests)
npx playwright install --with-deps chromium
npm run build          # clean dist/, then CSS (Dart Sass) and both bundles (Rollup), ~20 s
npm run build:css      # dist/odc-d3.css and .min.css only
npm run build:js       # the 6 JS files only
npm run watch          # rebuild CSS and JS on changes, Ctrl+C stops
npm run serve          # examples at http://127.0.0.1:8089/examples/ (needs a built dist/)
npm test               # unit (node:test) + browser (Playwright) tests on dist/
npm run test:build     # isolated build + artifact checks + tests on the fresh dist + error cases + watch/serve
```

Details, coverage and limitations: `docs/modernization/TESTING.md`.

Tests:

- Known defects have a `[current behaviour]` test and an expected-failure
  `[known bug, expected]` test. A fix must flip both (TESTING.md "Known bugs");
  never delete or skip a failing test to get green.
- Update SVG snapshots (`--update-snapshots`) only for an intended rendering
  change and explain the diff in the PR.
- Do not add test libraries to the root `package.json` if they pull `d3-*`
  packages: they change the hoisted runtime tree. Use `test/vendor`. Check
  lockfile changes with `scripts/lockfile-tree.js`.

Browser smoke harness (evidence, not a test suite yet):

```bash
D3_FILE=/path/to/d3@7.9.0/dist/d3.min.js node docs/modernization/evidence/smoke.js
```

## Build caveats (read before running the build)

- The build writes only `dist/`; it never modifies `src/`. (The old Gulp
  build copied `src/d3_global.js` over the tracked `src/d3.js`; Rollup now
  resolves the import instead, see `rollup.config.mjs`.)
- `dist/` is tracked, so a build in the working checkout rewrites committed
  files. **Build in an isolated copy by default** (`git archive HEAD | tar -x
  -C <tmp>`, a separate worktree, or `npm run test:build`). If you must build
  in the checkout, record the state of `dist/` first.
- Never run `git checkout --`, `git restore`, `git clean` or `git stash` on
  files you did not change in the current task. Revert build output only if
  you have verified it was produced by your own build (state before matched
  `HEAD`). If `dist/` was already modified before the build, stop and ask
  instead of reverting.
- A JS (Rollup/Babel) or SCSS (Dart Sass) error fails the npm script with the
  tool's exit code (Rollup 1, Sass 65) and a diagnostic (file, line, code
  frame); `npm run build` stops at the first failing step. `dist/` is **not**
  replaced atomically: `build` deletes `dist/` first, a failed `build:css`
  deletes `odc-d3.css` and keeps the old `.min.css`, a failed `build:js`
  writes nothing for the failing bundle. Do not use `dist/` after a failed
  build; after a successful one `npm run test:build` checks all 8 files.
- The committed `dist/` is still the `v2.0.0` Browserify build. A Rollup
  build is not byte-identical (different module wrapper and order, smaller
  files); behaviour is covered by the tests, and `npm run test:build` compares
  the CSS rules and the set of bundled packages with the committed files.
- `main` (`src/index.js`) and the `browserify.transform` field in
  `package.json` are for consumers that bundle the sources (SilverDecisions
  browserifies `odc-d3/src/*`); the library build does not read them. Do not
  change or remove the transform: it decides how those consumers compile
  `odc-d3/src` (e.g. class fields as assignments). `rollup.config.mjs` uses
  the same Babel options.

## Rules

- **Do not commit `dist/`** unless the task is explicitly a release/dist
  update. Do not stage build output; revert it only under the conditions in
  "Build caveats".
- **Do not update dependencies or `package-lock.json`** unless the task says
  so. Never run `npm install <pkg>` / `npm update` / `npm audit fix` casually;
  they change the lockfile. Runtime `dependencies` end up in the bundles:
  compare `node scripts/lockfile-tree.js` output before and after.
- **Do not publish to npm, push to `gh-pages`, or change the default branch.**
- **Keep the public contracts** listed in `BASELINE.md` §7: the 27 named
  exports, deep import paths (`odc-d3/src/*`, `odc-d3/dist/*`), global
  `ODCD3`, the two bundle flavours, `odc-` CSS classes, Config classes and
  deep-merge semantics, chart lifecycle methods, `$`-accessors, D3 prototype
  extensions, `StatisticsUtils` results.
- **Do not change computation results** (statistics, scales, layouts) as a side
  effect. If a fix changes output (e.g. the known `tValue` defect), make it a
  separate, explicitly described change with a test showing before/after.
- **Do not reformat sources.** Keep existing style: 4-space indentation,
  ES2015 classes with class-field defaults, `var`/`self = this` where the
  surrounding code uses it, double or single quotes as in the file. Keep diffs
  minimal and focused.
- New behaviour or bug fixes need tests once the test suite exists
  (see `BASELINE.md` §10).
- Do not present checks you did not run as passing. In PR descriptions list
  the commands you ran and their results.

## Branches and PRs

- Modernization work: branch from and open PRs against `modernize/odc-d3`
  (created from tag `v2.0.0`, commit `a937bce`). One topic per PR.
- `master` is the 1.x / D3 v4 line; `d3v3`, `d3v4` are legacy lines; `d3v7`
  equals `v2.0.0`.
