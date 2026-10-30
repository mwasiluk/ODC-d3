# ODC-d3 contract tests

Tests that pin the behaviour of `v2.0.0` (see [`BASELINE.md`](BASELINE.md))
before build, runtime-dependency and statistics changes. They test the
**bundles** (`dist/`), not `src/` directly, so every check also covers what
users load.

## Running locally

Linux or macOS, Node 22 (CI uses 22.22.0, the baseline version), from the
repository root:

```bash
npm ci
npm run test:setup                    # d3 7.9.0 for the global bundle (test/vendor)
npx playwright install --with-deps chromium
npm test                              # unit + browser tests on dist/ (see the note below)
npm run test:build                    # isolated build, dist comparison, tests on the fresh dist
```

The committed `dist/` is the `v2.0.0` build and predates the fixes in `src/`
(`feat/dependency-and-runtime-modernization`): on it `npm test` fails the
regression tests of the fixed defects (§8.4, 8.6, 8.7, 8.12–8.18) and the
`simple-statistics` 8 checks. Test the sources with `npm run test:build`, or
build in an isolated copy and pass `ODC_DIST=<copy>/dist`. CI runs the tests
on a fresh build only.

`npx playwright install --with-deps` needs root for the system packages; use
`npx playwright install chromium` if they are already present. Where
Chromium is provided by the environment (e.g. `PLAYWRIGHT_BROWSERS_PATH`),
skip that step.

Partial runs:

```bash
npm run test:unit                              # node:test, no browser
npm run test:browser                           # Playwright, both variants
npx playwright test --project=standalone       # one bundle variant
npx playwright test test/browser/charts.spec.js -g heatmap
ODC_DIST=/path/to/other/dist npm test          # test another dist directory
node scripts/check-build.js --keep --skip-error-cases --skip-dev-scripts  # keep the temp copy for inspection
```

Every command exits non-zero on failure. `npm run test:build` takes about
2 minutes (`npm ci` + `npm run build` + full test run + 4 compile error
cases + watch/serve).

## Layout

| Path | What |
|---|---|
| `test/unit/*.test.js` | `node:test`. Each test runs for both variants in Node: `standalone` via `require`, `global` via a `vm` context with d3 7.9.0 evaluated first. |
| `test/browser/regressions.spec.js` | Regular tests for fixed defects (BASELINE §8 numbers in the titles). |
| `test/browser/*.spec.js` | Playwright + Chromium. Projects `global` (d3 7.9.0 + `dist/odc-d3.js`) and `standalone` (`dist/standalone/odc-d3.js`, no `window.d3`). |
| `test/browser/fixtures.js` | Harness page served with `page.route` from disk (no web server); any other request (CDN) fails the test. Page errors and `console.error` fail the test unless declared. Fake clock (`page.clock`); `settle()` runs transitions to their end. |
| `test/browser/chart-fixtures.js` | Deterministic data and config for all 12 chart classes. |
| `test/browser/page-helpers.js` | In-page helpers: normalized SVG serializer (sorted attributes, numbers rounded to 3 decimals, random guids replaced by `GUID_1`, `GUID_2`, … in order of appearance so id/reference relations are kept), reference and duplicate-id checks, counters, bound-data readers. Self-tested in `harness.spec.js`. |
| `test/browser/__snapshots__/` | One SVG snapshot per chart, **shared by both projects** (the variants must render identically). |
| `test/helpers/` | Paths (`ODC_DIST`), bundle loaders, `expectStillBroken`. |
| `test/vendor/` | Separate package with its own lockfile: `d3@7.9.0` for the global variant, `@fontsource/dejavu-sans@5.3.0` (OFL-1.1) as the fixed font of the text-metrics tests. |
| `scripts/check-build.js` | Build check in an isolated copy. |
| `scripts/bundle-inventory.json` | Approved `install/path@version` set per bundle, checked by `check-build.js` step 5. |
| `rollup.config.mjs`, `src/odc-d3.scss`, `scripts/{clean,watch,serve}.js` | The build itself (`npm run build`, `watch`, `serve`); checked by `check-build.js`. |
| `scripts/lockfile-tree.js` | Prints the resolved package tree of a lockfile (v1 or v3) for diffs. |
| `.github/workflows/ci.yml` | Linux (ubuntu-24.04), Node 22.22.0, Chromium: `npm run test:build` (the full run). Windows (windows-2025), Node 22.22.0, 24.21.0 and the latest 24: build smoke (see "Limitations"). |

## Coverage

Both bundle variants run the same tests unless noted.

| Area | Where | Notes |
|---|---|---|
| Exports | `unit/exports`, `browser/exports` | Exactly the 27 names, types, class hierarchy, `StatisticsUtils` keys. Global: page d3 is 7.9.0, extensions installed on `d3.selection.prototype` and `enter.prototype`; without d3 the bundle throws `d3 is not defined`. Standalone: loads in plain Node, no `window.d3`. |
| `StatisticsUtils` | `unit/statistics` | Golden values of BASELINE §7.6 with exact equality where `simple-statistics` 8 gives the same result; independent reference values (scipy `t.isf`, mpmath `erf`, numpy `quantile(method='averaged_inverted_cdf')`, exact rational regression) for `tValue` with df ≤ 3, `errorFunction`, `quantile` on small samples and edge cases, `linearRegression` with large x offsets. |
| `Utils` | `unit/utils` | `deepExtend` (incl. array-into-object merge), `mergeDeep`, `nest`, `cross`, `inferVariables`, type predicates, `guid`, `createScale` (17 scale names), `createAxis`. |
| Config | `unit/config` | `ChartConfig` defaults, `svgClass` of all 12 configs, deep-merge semantics, subclass defaults, `$`-accessors, `prefixClass`. |
| CSS | `unit/css` | Required selectors in `odc-d3.css` and `.min.css`, same selector set in both, tooltip rule. |
| Artifacts | `unit/bundles`, `unit/exports` | All 4 JS files parse as ES5 (acorn); plain bundles carry an inline source map, `*.min.js` reference their `.map` (version 3, relative sources incl. `src/*`, `sourcesContent`); no `console.*` in `*.min.js`. The export object is a plain extensible object with a non-enumerable `__esModule: true`, as with Babel/browserify (bundlers use it for default-import interop). |
| Package metadata | `unit/package` | `main: src/index.js`, no `exports`/`module`/`browser`/`type`; the `browserify.transform` field unchanged (consumer contract, see BASELINE §7.1). |
| Rendering, 12 classes | `browser/charts` | Synchronous render into one `svg` with the chart class; explicit mark counts; settled SVG snapshot; every `url(#id)` / `href="#id"` points to an element in the same svg; second `init()` keeps one svg and the same output; `destroy()` empties the container; two independent instances with unique ids on the page. |
| Text metrics | `browser/text-metrics` | Without the 10px override, with a fixed font file: default font sizes, title centring and measured width, Heatmap ellipsis (fits, longest possible prefix, pinned results, full text in the tooltip), legend layout from measured label heights, wrapping of long legend labels, legend position. |
| Computations | `browser/computations` | Correlation cells = `sampleCorrelation`; regression lines = `linearRegression` per group and overall, confidence points pinned; box-plot quartiles/whiskers (plain and Tukey); histogram bins; diverging bar segments. Reference values computed in Node on the standalone bundle. |
| Lifecycle, config, events | `browser/lifecycle` | Constructor order, selector or node container, replacing an old svg, `setConfig` (merge, no redraw), `setConfig().init()`, `update(data)`, stored config class and `update()` return per chart, `$`-accessors on instances, `on/once/off/trigger`, `cell-selected` on Heatmap and CorrelationMatrix, `attachScatterPlot`, resize listener (4 width/height combinations, resize follows the automatic dimension, register/remove after `setConfig().init()`, `destroy()`), resize without transitions, shared tooltip div, BarChart tooltip. |
| Fixed defects | `browser/regressions`, `browser/computations`, `browser/text-metrics`, `browser/lifecycle`, `unit/statistics`, `unit/config` | Tooltip content and position at every call site, one legend gradient after `init()`/`redraw()`, clipPath id per Regression, `HeatmapTimeSeries` `fillMissing` in both bundles, Regression bands for a group of 5 points, ellipsis fits with the measured width of `"..."`, resize listener. The browser tests were checked to fail on the `v2.0.0` `dist/`. |
| D3 extensions | `browser/extensions` | `selectOrAppend`/`selectOrInsert` idempotent, `appendSelector`/`insertSelector` always create, selector parsing, enter selections, where they are installed. |
| Build | `scripts/check-build.js` | See below. |

Test counts at the time of writing: unit 76 (7 files), browser 266 = 133 per
project (3 skipped by design: variant-specific tests).

### Build check (`npm run test:build`)

1. Copies the tracked files of the working tree to a temp dir and runs `npm ci` there.
2. Deletes the copied `dist/` and runs `npm run build`. Fails on a non-zero
   exit code and on errors or warnings in the log (Rollup `[!]`/`(!)`,
   `Error:`, `SyntaxError` …). Rollup warnings about import cycles inside the
   `d3-*` packages are filtered in `rollup.config.mjs`.
3. All 8 artifacts exist and are not empty.
4. No file outside `dist/` changed, appeared or disappeared (the build never
   writes `src/`).
5. Against the committed `dist/` at `HEAD`:
   - `odc-d3.css` equal except blank lines; both CSS files contain the same
     rules in the same order (whitespace and the minifier spelling
     `bold`/`700` ignored);
   - JS is **not** compared byte by byte (the committed files come from the
     Browserify build). Instead, the set of bundled packages (install path
     below `node_modules/` and version, from the `.min.js.map` sources and
     the lockfile) must equal the approved list in
     `scripts/bundle-inventory.json`. A dependency update, a lockfile change
     or a hoisting move that adds, removes or moves a package fails the
     step; it prints the fresh inventory, which is copied into the file
     after review (the diff of that file shows the approved change);
   - sizes of all 8 files, raw and gzip, are printed.
6. Runs `test:unit` and `test:browser` with `ODC_DIST` pointing at the fresh
   build; behaviour, exports, extensions, rendering and computations are
   checked there.
7. Compile error cases. Each case gets its own fresh copy of the tracked files
   (committed `dist/`, `node_modules` symlinked from step 1), so one case
   cannot affect the next. Each case requires:
   - the exit code of the failing tool, passed on by npm (Rollup 1, Dart
     Sass 65); a spawn failure or a missing command (127) fails the case;
   - the npm scripts that must have run (`> rollup -c`, `> sass …`) and, for
     `build`, that `build:js` did not start after a CSS error;
   - a diagnostic for the injected error: file, line number of the injected
     line and the code frame (`src/utils.js (L:C)` / `Expected expression …
     src/styles/shared.scss L:C`);
   - all files outside `dist/` unchanged after the injected file is put back;
   - the listed state of each `dist/` file (below).

   | Case | Command | Injected | Exit | `dist/` afterwards |
   |---|---|---|---|---|
   | `js-error-build-js` | `npm run build:js` | JS syntax error in `src/utils.js` | 1 | everything kept |
   | `scss-error-build-css` | `npm run build:css` | SCSS error in `src/styles/shared.scss` | 65 | `odc-d3.css` missing (Sass deletes the file it failed to write), `.min.css` and JS kept |
   | `js-error-build` | `npm run build` | JS | 1 | CSS written, all 6 JS files missing (`clean` ran) |
   | `scss-error-build` | `npm run build` | SCSS | 65 | everything missing, `build:js` not started |

   "kept" means content and mtime unchanged (mtimes are reset before the run,
   so rewriting identical content counts as written). The table records
   observed behaviour; the build does not publish `dist/` atomically.
8. Dev scripts, in another fresh copy:
   - `scripts/serve.js --port 0`: `/examples/scatterplot/` and
     `/dist/odc-d3.js` are served with the right content type, a directory URL
     without slash is redirected, a path outside the repository is refused;
   - `scripts/watch.js` with `dist/` deleted: builds all 8 files, rebuilds
     both CSS files and both bundles after a change of `src/styles/shared.scss`
     and `src/utils.js`, exits 0 on SIGTERM and leaves no watcher process
     behind (it runs in its own process group, checked on Linux/macOS;
     exited children of Sass may stay as zombies for a moment, so the
     check waits up to 5 s);
   - no file outside `dist/` changed afterwards (the edits are reverted).

It was checked that the steps fail when they should, see the PR of
`feat/modern-build` (negative controls).

## Known bugs

Rules (BASELINE §8 numbers):

- A **`[current behaviour, §N]`** test pins what happens today. It is a
  normal test; any change of that behaviour fails it.
- A **`[known bug §N, expected]`** test asserts the correct behaviour and is
  marked as an expected failure: Playwright `test.fail()`, `node:test` via
  `expectStillBroken()`. It passes only while the correct assertion fails.
  When the bug is fixed it fails ("expected to fail, but passed" / "known
  bug appears fixed"), and the fix PR turns it into a regular test and
  removes the current-behaviour twin.
- Because the current behaviour is pinned separately, an expected-failure
  test cannot hide a new regression.
- No `continue-on-error`, no skipped failures in CI.

Open defects (no expected-failure test, see BASELINE §8):

| § | Defect | Current behaviour test |
|---|---|---|
| 8.5 | negative critical value, swapped band edges | `unit/statistics`, `browser/computations` (decision pending, changes results) |

`test/helpers/known-bug.js` (`expectStillBroken`) stays for the next known
defect; `known-bugs.spec.js` was removed when its last pair was fixed.

Fixed defects (regular regression tests now):

| § | Defect | Tests |
|---|---|---|
| 8.1 | build exited 0 on compile errors | `check-build.js` step 7 (4 cases) |
| 8.2 | interrupted build left `src/d3.js` modified | no longer possible: the Rollup build never writes `src/`; `check-build.js` steps 4, 7, 8 |
| 8.3 | `watch`, `serve`, `default-watch`, `build-js2` broken | replaced by `npm run watch` / `npm run serve`; `check-build.js` step 8 |
| 8.4 | `tValue` threw for df ≤ 3; Regression with ≤ 5 points per group | `unit/statistics` (scipy reference values), `browser/computations` |
| 8.6 | `prefixClass(name, true)` returned `'.'` | `unit/config` |
| 8.7 | resize listener condition `!width \|\| height` | `browser/lifecycle` (4 combinations, container resize, `setConfig().init()`) |
| 8.12 | standalone `HeatmapTimeSeries` `fillMissing` threw | `browser/regressions` (both variants) |
| 8.13 | legend gradients accumulated on `init()` | `browser/regressions`, `browser/charts` (second `init()` identical) |
| 8.14 | empty tooltips (`showTooltip(html)`) | `browser/regressions` (every call site) |
| 8.15 | `tValue(df, 0.5)` returned `'0'` | `unit/statistics` |
| 8.16 | `quantile(values, [p…])` NaN (simple-statistics 4.1.1) | `unit/statistics` (local quantile with the 4.1.1 definition) |
| 8.17 | fixed `odc-clip` id duplicated by two Regression charts | `browser/regressions`, `browser/charts` (no duplicate ids) |
| 8.18 | ellipsis budgeted as 9px | `browser/text-metrics` |

## Snapshots

`test/browser/__snapshots__/charts.spec.js/*.txt` are normalized text dumps of
the settled SVG, not images. Update only when a change of rendering is
intended, and explain the diff in the PR:

```bash
npx playwright test test/browser/charts.spec.js --update-snapshots
```

Determinism measures: fixed viewport and container size, `locale en-US`,
`timezoneId UTC`, fake clock, no random data, short labels. Text metrics
depend on installed fonts (legend cell spacing via `getBBox` in
`odc-d3-svg-legend`, label ellipsis via `getComputedTextLength`), so the
snapshot harness forces SVG text to `10px sans-serif`. With that, the
snapshots were verified to be identical with `sans-serif`, `serif` and
`monospace`.

That override hides the default text sizes and the ellipsis, so
`text-metrics.spec.js` runs **without** it: library font sizes as shipped,
only the font family replaced by a font file served from `test/vendor`
(loaded and checked with `document.fonts` before rendering). Chromium is
started with `--font-render-hinting=none`: on the CI runner the system font
configuration rounded text advances to whole pixels (title 117px instead of
118.44px), which made metrics machine-dependent. Its assertions
are relations between real measurements (fits / longest prefix / spacing =
measured heights) plus a few pinned results. The pinned ellipsis labels
were chosen at least 1.3px away from the truncation threshold.

## Dependency and lockfile changes

Steps, each in its own commit(s):

1. **Lockfile format only** – v1 → v3 with npm 10.9.4:
   `npm install --package-lock-only --ignore-scripts --no-audit --no-fund`.
   All 1108 install paths and versions are identical
   (`scripts/lockfile-tree.js`); the only diff is `integrity` added for 66
   packages bundled inside the optional `fsevents@1.2.9`. A new `.npmrc` sets
   `legacy-peer-deps=true`: without it `npm ci` rejects the v3 lockfile with
   `Missing: typescript@7.0.2 from lock file`, because npm ≥ 7 wants the peer
   dependency of the unused `tsify`, which the npm 6 lockfile never had.
2. **Test dependencies** – `@playwright/test@1.63.0` (exact, dev): adds
   `@playwright/test`, `playwright`, `playwright-core`; no existing entry
   changed. `d3@7.9.0` is **not** a root devDependency: adding it there was
   measured to hoist runtime packages (`d3-interpolate` 1.3.2 → 3.0.1,
   `d3-time-format` 2.1.3 → 4.1.0, `d3-timer` 1.0.9 → 3.0.1) and would change
   the bundles. It lives in `test/vendor` with its own lockfile (38 packages).

3. **Build toolchain** (`feat/modern-build`): Gulp, Browserify and their
   plugins removed (`browserify`, `babelify`, `tsify`, `browser-sync`, `del`,
   `gulp*`, `vinyl-*`, `merge-stream`, `chalk`, `conditionalify`); added
   `rollup`, `@rollup/plugin-{babel,commonjs,node-resolve,terser}`,
   `@babel/plugin-transform-modules-commonjs` (already in the tree via
   `@babel/preset-env`, same version) and `acorn` (ES5 check, already in the
   tree via `terser`). Kept: `@babel/core`, `@babel/preset-env`,
   `@babel/plugin-transform-runtime`, `babel-plugin-transform-class-properties`
   (same versions, also named by the `browserify.transform` field) and `sass`
   1.42.1. The 27 runtime entries of the lockfile (`scripts/lockfile-tree.js`,
   `prod`) are identical. `@rollup/plugin-babel` needs a newer
   `@babel/helper-module-imports`, so Babel's internal packages (`parser`,
   `generator`, `traverse`, `types`, …) are deduplicated at 7.29.x. Without
   `tsify` (whose `typescript` peer was the reason) `.npmrc` with
   `legacy-peer-deps` is gone: the lockfile is generated with standard peer
   handling and `npm ci` works without the flag. 1041 → 260 installed packages.

4. **Dependency update** (`feat/dependency-and-runtime-modernization`),
   versions before → after:

   | Package | Before | After | Notes |
   |---|---|---|---|
   | `@babel/core`, `preset-env`, `plugin-transform-runtime` (dev) | 7.15.8 | 7.29.7 | last Babel 7; Babel 8 deferred (below) |
   | `sass` (dev) | 1.42.1 | 1.106.1 | `exports` field: `watch.js` resolves the CLI from the package entry |
   | `lodash` (dev, via the Babel 6 class-properties plugin) | 4.17.15 | 4.18.1 | in-range update, fixes the lodash advisories |
   | `@babel/plugin-transform-modules-commonjs` (dev) | 7.15.4 | removed | `statistics-utils.js` is an ES module now |
   | `@babel/runtime` | 7.15.4 | 7.29.10 | GHSA-968p-4wvh-cqc8 |
   | `simple-statistics` | 4.1.1 | 8.0.0 | public API instead of `src/*`; `quantile` kept locally |
   | `d3-array`, `d3-format`, `d3-hierarchy`, `d3-scale-chromatic`, `d3-shape` | 3.1.1, 3.0.1, 3.0.1, 3.0.0, 3.0.1 | 3.2.4, 3.1.2, 3.1.2, 3.1.0, 3.2.0 | versions of `d3@7.9.0` |
   | `d3-time`, `d3-time-format`, `d3-transition` | transitive | 3.1.0, 4.1.0, 3.0.1 | declared: imported by `src/d3.js` |
   | transitive `d3-color`, `d3-interpolate`, `d3-timer`, `d3-path` | 1.2.3, 1.3.2, 1.0.9, 3.0.1 | 3.1.0, 3.0.1, 3.0.1, 3.1.0 | `d3-color` ReDoS advisory |
   | `odc-d3-svg-legend` | 3.0.0 | 3.0.0 | only release; pins `d3-array` 3.1.1 and `d3-format` 3.0.1 exactly, so these two are nested copies now |

   Deferred on purpose: Babel 8 (`preset-env` without `targets` no longer
   compiles to ES5, `@babel/runtime` 8 no longer has `@babel/runtime/regenerator`,
   `helpers/regeneratorRuntime`, `helpers/objectSpread` and other paths that
   Babel 7 `transform-runtime` in Browserify consumers imports through the
   unchanged `browserify.transform` field (one `@babel/runtime` dependency
   serves both), and the Babel 6
   `transform-class-properties` plugin named by that field is not a Babel 8
   plugin); Playwright 1.64 (test only, no needed fix, changes the browser
   build of the snapshots); Rollup and its plugins (current minor already);
   `odc-d3-svg-legend` (needs a new release of `mwasiluk/d3-legend` with
   `^3` ranges instead of exact pins). The 27 runtime entries of the lockfile
   changed only as listed; 284 → 271 lockfile entries. `npm audit`:
   production 2 → 0, development 18 → 6 (`babel-traverse` chain of the
   Babel 6 class-properties plugin, critical, only reachable when compiling
   untrusted code; `deepmerge` via `@rollup/plugin-node-resolve`, low, no
   fixed version in range).

Before step 3, `npm run test:build` confirmed that a build from the new
lockfile reproduces the committed bundles (§4.3 rules); since step 3 it
checks behaviour instead (see "Build check").

## Limitations

- Chromium only; no Firefox/WebKit, no pixel comparison.
- Full tests on Linux with Node 22 only (baseline line). Windows (Node
  22.22.0, 24.21.0 and the latest 24) runs a build smoke: `npm ci`, `npm run build` with a
  5-minute timeout (Sass 1.42 hung there), unit tests on the fresh dist, no
  changes outside `dist/`, and `check-build.js` without browser tests and
  dev scripts (on Windows `watch.js` cannot get SIGTERM, so its clean stop
  is checked on Linux only).
- `src/` is not tested directly (it is not loadable without a bundler,
  BASELINE §7.1); deep imports `odc-d3/src/*` are covered only through the bundles.
- Interaction coverage is partial: hover/click on dots, bars, cells and
  shortened labels, tooltip content per call site; brush selection in
  ScatterPlotMatrix is not covered.
- Text metrics are measured with one font (DejaVu Sans). The real font a
  user gets depends on their system; that is not tested.
- The examples (§8.8) are not tested beyond the page fetch in step 8; the
  smoke harness (`docs/modernization/evidence/smoke.js`) renders them.
- Snapshot values are characterization data: they pin the current output,
  including the known defects; they are not a statement that the output is correct.
