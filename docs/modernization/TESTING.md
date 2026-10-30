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
npm test                              # unit + browser tests on the committed dist/
npm run test:build                    # isolated build, dist comparison, tests on the fresh dist
```

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
node scripts/check-build.js --keep --skip-error-cases  # keep the temp copy for inspection
```

Every command exits non-zero on failure. `npm run test:build` takes about
2.5–3 minutes (`npm ci` + `gulp` + full test run + 7 compile error cases).

## Layout

| Path | What |
|---|---|
| `test/unit/*.test.js` | `node:test`. Each test runs for both variants in Node: `standalone` via `require`, `global` via a `vm` context with d3 7.9.0 evaluated first. |
| `test/browser/*.spec.js` | Playwright + Chromium. Projects `global` (d3 7.9.0 + `dist/odc-d3.js`) and `standalone` (`dist/standalone/odc-d3.js`, no `window.d3`). |
| `test/browser/fixtures.js` | Harness page served with `page.route` from disk (no web server); any other request (CDN) fails the test. Page errors and `console.error` fail the test unless declared. Fake clock (`page.clock`); `settle()` runs transitions to their end. |
| `test/browser/chart-fixtures.js` | Deterministic data and config for all 12 chart classes. |
| `test/browser/page-helpers.js` | In-page helpers: normalized SVG serializer (sorted attributes, numbers rounded to 3 decimals, random guids replaced by `GUID_1`, `GUID_2`, … in order of appearance so id/reference relations are kept), reference and duplicate-id checks, counters, bound-data readers. Self-tested in `harness.spec.js`. |
| `test/browser/__snapshots__/` | One SVG snapshot per chart, **shared by both projects** (the variants must render identically). |
| `test/helpers/` | Paths (`ODC_DIST`), bundle loaders, `expectStillBroken`. |
| `test/vendor/` | Separate package with its own lockfile: `d3@7.9.0` for the global variant, `@fontsource/dejavu-sans@5.3.0` (OFL-1.1) as the fixed font of the text-metrics tests. |
| `scripts/check-build.js` | Build check in an isolated copy. |
| `scripts/lockfile-tree.js` | Prints the resolved package tree of a lockfile (v1 or v3) for diffs. |
| `.github/workflows/ci.yml` | Linux (ubuntu-24.04), Node 22.22.0, Chromium. |

## Coverage

Both bundle variants run the same tests unless noted.

| Area | Where | Notes |
|---|---|---|
| Exports | `unit/exports`, `browser/exports` | Exactly the 27 names, types, class hierarchy, `StatisticsUtils` keys. Global: page d3 is 7.9.0, extensions installed on `d3.selection.prototype` and `enter.prototype`; without d3 the bundle throws `d3 is not defined`. Standalone: loads in plain Node, no `window.d3`. |
| `StatisticsUtils` | `unit/statistics` | Golden values of BASELINE §7.6 with exact equality, `tValue` including the current failures. |
| `Utils` | `unit/utils` | `deepExtend` (incl. array-into-object merge), `mergeDeep`, `nest`, `cross`, `inferVariables`, type predicates, `guid`, `createScale` (17 scale names), `createAxis`. |
| Config | `unit/config` | `ChartConfig` defaults, `svgClass` of all 12 configs, deep-merge semantics, subclass defaults, `$`-accessors, `prefixClass`. |
| CSS | `unit/css` | Required selectors in `odc-d3.css` and `.min.css`, same selector set in both, tooltip rule. |
| Rendering, 12 classes | `browser/charts` | Synchronous render into one `svg` with the chart class; explicit mark counts; settled SVG snapshot; every `url(#id)` / `href="#id"` points to an element in the same svg; second `init()` keeps one svg and the same output; `destroy()` empties the container; two independent instances with unique ids on the page. |
| Text metrics | `browser/text-metrics` | Without the 10px override, with a fixed font file: default font sizes, title centring and measured width, Heatmap ellipsis (fits, longest possible prefix, pinned results, full text in the tooltip), legend layout from measured label heights, wrapping of long legend labels, legend position. |
| Computations | `browser/computations` | Correlation cells = `sampleCorrelation`; regression lines = `linearRegression` per group and overall, confidence points pinned; box-plot quartiles/whiskers (plain and Tukey); histogram bins; diverging bar segments. Reference values computed in Node on the standalone bundle. |
| Lifecycle, config, events | `browser/lifecycle` | Constructor order, selector or node container, replacing an old svg, `setConfig` (merge, no redraw), `setConfig().init()`, `update(data)`, stored config class and `update()` return per chart, `$`-accessors on instances, `on/once/off/trigger`, `cell-selected` on Heatmap and CorrelationMatrix, `attachScatterPlot`, resize listener (4 size cases + `destroy()`), resize without transitions, shared tooltip div, BarChart tooltip. |
| D3 extensions | `browser/extensions` | `selectOrAppend`/`selectOrInsert` idempotent, `appendSelector`/`insertSelector` always create, selector parsing, enter selections, where they are installed. |
| Build | `scripts/check-build.js` | See below. |

Test counts at the time of writing: unit 58 (5 files), browser 262 = 131 per
project (4 skipped by design: variant-specific tests).

### Build check (`npm run test:build`)

1. Copies the tracked files of the working tree to a temp dir and runs `npm ci` there.
2. Runs `gulp`. Fails on a non-zero exit code **and** on error markers in the
   log (`SyntaxError`, `PluginError`, `onError`, `Error:` …). The build exits
   non-zero on compile errors since §8.1 was fixed; the marker check stays as
   a second guard.
3. All 8 artifacts exist and are not empty.
4. No file outside `dist/` changed, appeared or disappeared (catches the
   `src/d3.js` swap).
5. Compares each artifact with `HEAD`: CSS and `*.min.js` byte-identical;
   for `odc-d3.js` and the `.map` files the generated code and every source
   map field must be equal, and `sourcesContent` may differ **only** in CRLF
   vs LF. Anything else fails.
6. Runs `test:unit` and `test:browser` with `ODC_DIST` pointing at the fresh build.
7. Compile error cases (BASELINE §8.1, fixed). Each case gets its own fresh
   copy of the tracked files (committed `dist/`, `node_modules` symlinked from
   step 1), so one case cannot affect the next; the copy of step 1 and the
   working checkout are not touched. Each case requires:
   - exit code exactly 1 (a spawn failure, a missing command or a crash
     with another code fails the case), `Using gulpfile` and `Starting '<task>'`
     in the log;
   - a diagnostic for every injected error: file, line number of the injected
     line and the code frame (`SyntaxError: …src/utils.js: Unexpected token
     (L:C)` / `Error in plugin "gulp-sass" … Expected expression … shared.scss L:C`);
   - `'<task>' errored after` for the failing tasks, no `Finished` for the
     requested task, dependent tasks not started;
   - all files outside `dist/` unchanged after the injected file is put back
     (`src/d3.js` restored);
   - the listed state of each `dist/` file (below).

   | Case | Command | Injected | `dist/` afterwards |
   |---|---|---|---|
   | `js-error-build-js` | `gulp build-js` | JS syntax error in `src/utils.js` | everything kept (old global bundle stays) |
   | `js-error-build-js-standalone` | `gulp build-js-standalone` | same | everything kept (old standalone bundle stays) |
   | `scss-error-build-css` | `gulp build-css` | SCSS error in `src/styles/shared.scss` | everything kept (old CSS stays) |
   | `js-and-scss-error-build` | `gulp build` | both | everything kept; both errors reported |
   | `js-error-default` | `gulp` | JS | CSS written, all 6 JS files missing (`clean` ran), `build-js-standalone` not started |
   | `scss-error-default` | `gulp` | SCSS | global bundle written (`build-js` runs to the end), CSS and standalone missing, `build-js-standalone` not started |
   | `cli-parallel-error-while-d3-swapped` | `gulp build-js odc-fail-while-swapped` | a task appended to the copy's `gulpfile.js` that fails once `src/d3.js` holds the global variant | gulp-cli exits during `build-js`; the exit hook restores `src/d3.js` |

   "kept" means content and mtime unchanged (mtimes are reset before the run,
   so rewriting identical content counts as written). The table records
   observed behaviour; the build does not publish `dist/` atomically, so a
   failed command can leave stale files from an older build next to new ones.

It was checked that a one-line change in `src/legend.js` makes step 5 fail.

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

| § | Defect | Current behaviour test | Expected test |
|---|---|---|---|
| 8.4 | `tValue` throws for df ≤ 3; Regression with ≤ 5 points per group | `unit/statistics`, `browser/known-bugs` | both |
| 8.5 | negative critical value, swapped bands | `unit/statistics`, `browser/computations` | – (decision pending, changes results) |
| 8.6 | `prefixClass(name, true)` returns `'.'` | `unit/config` | `unit/config` |
| 8.7 | resize listener condition | `browser/lifecycle` | – (intended behaviour not decided) |
| 8.12 | standalone `HeatmapTimeSeries` `fillMissing` throws | `browser/known-bugs` | standalone only |
| 8.13 | legend gradients accumulate on `init()` | `browser/known-bugs`, `browser/charts` | `browser/known-bugs` |
| 8.14 | empty tooltips (`showTooltip(html)`) | `browser/known-bugs` (ScatterPlot, LineChart) | `browser/known-bugs` |
| 8.15 | `tValue(df, 0.5)` returns `'0'` | `unit/statistics` | – |
| 8.16 | `quantile(sorted, [p…])` NaN (third-party) | `unit/statistics` | – |
| 8.17 | fixed `odc-clip` id duplicated by two Regression charts | `browser/known-bugs`, `browser/charts` | `browser/known-bugs` |

Fixed defects (regular regression tests now):

| § | Defect | Tests |
|---|---|---|
| 8.1 | build exited 0 on compile errors | `check-build.js` step 7 (7 cases) |

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

Two separate commits:

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

`npm run test:build` confirms that a build from the new lockfile reproduces
the committed bundles (§4.3 rules).

## Limitations

- Chromium only; no Firefox/WebKit, no pixel comparison.
- Node 22 only in CI (baseline line); other Node versions not tested yet.
- `src/` is not tested directly (it is not loadable without a bundler,
  BASELINE §7.1); deep imports `odc-d3/src/*` are covered only through the bundles.
- Interaction coverage is partial: hover/click on dots, bars, cells and
  shortened labels; brush selection in ScatterPlotMatrix and tooltip
  contents (§8.14) are not covered beyond the known-bug tests.
- Text metrics are measured with one font (DejaVu Sans). The real font a
  user gets depends on their system; that is not tested.
- Interrupted build (§8.2), `watch`/`serve`/`build-js2` (§8.3) and the
  examples (§8.8) are not tested.
- Snapshot values are characterization data: they pin the current output,
  including the known defects; they are not a statement that the output is correct.
