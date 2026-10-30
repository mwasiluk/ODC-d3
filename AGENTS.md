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
src/d3.js                    D3 shim; build swaps it (see "Build"), tracked file
src/d3_import.js             standalone variant: re-exports bundled d3-* packages
src/d3_global.js             global variant: module.exports = d3
src/d3-extensions.js         selectOrAppend / selectOrInsert / appendSelector / insertSelector
src/statistics-utils.js      wraps simple-statistics/src/* (deep CJS requires) + tValue
src/statistics-distributions.js  t-distribution (ported code, $-prefixed variables)
src/legend.js                wraps odc-d3-svg-legend
src/styles/*.scss            concatenated into dist/odc-d3(.min).css
dist/odc-d3(.min).js         UMD `ODCD3`, needs global d3 v7 loaded first
dist/standalone/odc-d3(.min).js  UMD `ODCD3`, D3 bundled
examples/<chart>/            demo pages loading d3 from https://d3js.org/d3.v7.min.js
docs/modernization/          modernization program docs and evidence
test/unit/, test/browser/    contract tests (node:test, Playwright), see docs/modernization/TESTING.md
test/vendor/                 test-only d3 7.9.0, separate lockfile (keeps root runtime tree unchanged)
scripts/check-build.js       build check in an isolated copy
```

## Commands

```bash
npm ci                 # install from package-lock.json (lockfile v3, .npmrc legacy-peer-deps)
npm run test:setup     # test/vendor (d3 for the global-bundle tests)
npx playwright install --with-deps chromium
npm test               # unit (node:test) + browser (Playwright) tests on dist/
npm run test:build     # isolated gulp build + dist comparison + tests on the fresh dist
npx gulp               # default: clean dist, build css + global bundle, then standalone bundle (~40 s)
npx gulp build-css     # css only
npx gulp build-js      # global bundle only (swaps src/d3.js)
npx gulp build-js-standalone
```

Details, coverage and limitations: `docs/modernization/TESTING.md`.
`gulp watch`, `gulp serve`, `gulp default-watch` and `gulp build-js2` are
broken at baseline. Do not report any of them as passing.

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

- `gulp build-js` overwrites the tracked `src/d3.js` with `src/d3_global.js` and
  restores it from `src/d3_import.js` afterwards. If the build is interrupted,
  `src/d3.js` stays modified; never commit the global variant.
- **Build in an isolated copy by default** (`git archive HEAD | tar -x -C <tmp>`,
  or a separate worktree). Only build in the working checkout if it is
  required, and then record its state first (`git status --short`,
  `git stash list`, checksums of `src/d3.js` and `dist/`).
- Never run `git checkout --`, `git restore`, `git clean` or `git stash` on
  files you did not change in the current task. Revert build output only if
  you have verified it was produced by your own build (state before matched
  `HEAD`). If `src/d3.js` or `dist/` were already modified before the build,
  stop and ask instead of reverting.
- **The exit code is 0 even when JS or SCSS compilation fails**, and
  `gulp` deletes `dist/` first. Always check the log for `SyntaxError` /
  `onError` and check that all 8 `dist/` files exist and are non-empty.
- A rebuild on Linux differs from the committed `dist/` only in source-map
  `sourcesContent` line endings. Treat any other diff in `dist/` as a real change.

## Rules

- **Do not commit `dist/`** unless the task is explicitly a release/dist
  update. Do not stage build output; revert it only under the conditions in
  "Build caveats".
- **Do not update dependencies or `package-lock.json`** unless the task says
  so. Never run `npm install <pkg>` / `npm update` / `npm audit fix` casually;
  they rewrite the v1 lockfile.
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
