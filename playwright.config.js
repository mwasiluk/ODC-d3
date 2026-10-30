// Browser contract tests. Both bundle variants run the same specs:
//   global     - d3 7.9.0 (test/vendor) + dist/odc-d3.js
//   standalone - dist/standalone/odc-d3.js, no global d3
// ODC_DIST overrides the dist directory (see test/helpers/paths.js).
const {defineConfig} = require('@playwright/test');

module.exports = defineConfig({
    testDir: 'test/browser',
    testMatch: '**/*.spec.js',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: 0,
    reporter: process.env.CI ? [['list'], ['github']] : 'list',
    // one snapshot per test for both variants: they must render identically
    snapshotPathTemplate: '{testDir}/__snapshots__/{testFileName}/{arg}{ext}',
    use: {
        browserName: 'chromium',
        viewport: {width: 1000, height: 800},
        deviceScaleFactor: 1,
        locale: 'en-US',
        timezoneId: 'UTC',
        // Chromium on Linux takes font hinting from the system configuration;
        // hinted advances are rounded to whole pixels and differ between
        // machines. Unhinted metrics are the same everywhere for the same font file.
        launchOptions: {args: ['--font-render-hinting=none']}
    },
    projects: [
        {name: 'global', use: {variant: 'global'}},
        {name: 'standalone', use: {variant: 'standalone'}}
    ]
});
