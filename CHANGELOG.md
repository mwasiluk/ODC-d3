# Changelog

## Unreleased

Changes since `v2.0.0` for the next release. The version number is not
changed yet, and the committed `dist/` is still the `v2.0.0` build: it gets
these changes only when it is rebuilt for the release.

### Behaviour changes (bug fixes)

- **Tooltips show their content.** ScatterPlot, LineChart, Histogram,
  ScatterPlotMatrix, Heatmap, CorrelationMatrix and BoxPlot/BoxPlotBase (box,
  whisker ticks, outliers) showed an empty, unpositioned tooltip; they now
  show the text at the pointer, like BarChart did already.
- **Regression confidence bands for small groups.** `StatisticsUtils.tValue`
  threw `ReferenceError: i is not defined` for 1–3 degrees of freedom, so a
  Regression with a group of 3–5 points failed to render. Values for df ≤ 3
  match the t distribution to 5 significant digits. The sign convention is
  unchanged (`tValue(df, 0.975)` is negative, see below).
- `StatisticsUtils.tValue(df, 0.5)` returns the number `0` instead of the
  string `'0'`.
- **Standalone bundle:** `HeatmapTimeSeries` with `x.fillMissing: true` threw
  `Cannot read properties of undefined (reading 'offset')`; the D3 shim now
  also re-exports `d3-time` (`timeDay`, `timeMonth`, …).
- Heatmap, HeatmapTimeSeries and CorrelationMatrix no longer add a
  `<linearGradient>` to the svg on every `init()`/`redraw()`; the legend
  reuses its gradient.
- Regression uses a clipPath id per chart (`odc-clip-<chart id>` instead of
  `odc-clip`), so two Regression charts on one page are clipped correctly.
  Custom CSS or code that selected `#odc-clip` must use
  `[id^="odc-clip-"]`.
- `chart.prefixClass(name, true)` returns `'.' + prefix + name` instead of
  `'.'`.
- **Window resize:** a chart re-renders on resize when its `width` or its
  `height` is not set (taken from the container). Before, a chart with both
  set re-rendered and a chart with only `width` set did not.
  `setConfig(...).init()` with both set removes the listener.
- Shortened labels (Heatmap, CorrelationMatrix) use the measured width of
  `"..."` instead of 9px, so they no longer overflow the available width; a
  label near the limit can be one character shorter.

### Computation results

- `StatisticsUtils` uses `simple-statistics` 8.0.0 (was 4.1.1) through its
  public API. `mean`, `variance`, `standardDeviation`,
  `sampleStandardDeviation`, `sampleCorrelation` and `zScore` return the same
  values. `linearRegression` differs in the last bits and no longer loses
  precision for large x values (e.g. x around 1e8 gave slope 0.5 instead of
  0.8, around 1e9 `Infinity`). `errorFunction` uses the same approximation
  evaluated differently (results move by about 1e-16).
- `StatisticsUtils.quantile` keeps the `v2.0.0` definition, so BoxPlot
  quartiles are unchanged (simple-statistics ≥ 7.8.9 interpolates instead).
  With an array of p it returns one quantile per p; 4.1.1 returned `NaN` for
  some of them.
- Unchanged and still open: `Regression` calls `tValue(df, 0.975)`, which is
  negative, so its margin of error is negative and the band's upper and
  lower edges are swapped (`y0 > y1`). The drawn area is the same.

### Dependencies

- D3 modules updated within v7 to the versions of `d3@7.9.0` (e.g.
  `d3-array` 3.2.4, `d3-format` 3.1.2, `d3-shape` 3.2.0); the standalone
  bundle no longer contains the D3 v4-era `d3-color@1`, `d3-interpolate@1`,
  `d3-time-format@2` and `d3-timer@1` (fixes the `d3-color` ReDoS advisory).
  `d3-time`, `d3-time-format` and `d3-transition` are now declared
  dependencies.
- `@babel/runtime` 7.29.10 (fixes GHSA-968p-4wvh-cqc8), `simple-statistics`
  8.0.0. `odc-d3-svg-legend` stays 3.0.0; it pins `d3-array` 3.1.1 and
  `d3-format` 3.0.1 exactly, so npm installs its own copies of these two.
- For consumers that bundle `odc-d3/src/*`: `src/statistics-utils.js` is a
  plain ES module now (same named export `StatisticsUtils`); the
  `browserify.transform` field and `main` are unchanged.
