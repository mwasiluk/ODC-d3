// Playwright fixtures: open a harness page with the bundle variant of the
// current project. Files are served with page.route from disk (no web server,
// no CDN). Page errors are collected and fail the test unless declared.
const fs = require('fs');
const path = require('path');
const base = require('@playwright/test');
const paths = require('../helpers/paths');

const ORIGIN = 'http://odc.test';

// Font for the text-metrics tests: same file on every machine, served locally.
const TEST_FONT = 'ODC Test Sans';
const TEST_FONT_FILE = path.join(paths.root, 'test', 'vendor', 'node_modules', '@fontsource', 'dejavu-sans', 'files',
    'dejavu-sans-latin-400-normal.woff2');

function harnessHtml(variant, withoutD3, testFont) {
    let scripts = variant === 'global'
        ? ['/vendor/d3.min.js', '/dist/odc-d3.js']
        : ['/dist/standalone/odc-d3.js'];
    if (withoutD3) {
        scripts = scripts.filter(s => s !== '/vendor/d3.min.js');
    }
    return '<!doctype html><html><head><meta charset="utf-8">'
        + '<link rel="stylesheet" href="/dist/odc-d3.css">'
        // Text metrics differ between machines (installed fonts). Legend cell spacing
        // (getBBox in odc-d3-svg-legend) and label ellipsis (getComputedTextLength)
        // depend on them, so the harness fixes a small font size that keeps all
        // fixture labels below those thresholds.
        + '<style>body{margin:0;font-family:sans-serif;font-size:12px} .box{width:600px;height:400px}'
        + (testFont
            // text-metrics mode: library font sizes untouched, only a fixed font family
            ? ' @font-face{font-family:"' + TEST_FONT + '";src:url(/vendor/test-font.woff2) format("woff2")}'
            + ' .box svg, .box svg *, .odc-tooltip{font-family:"' + TEST_FONT + '" !important}'
            : ' .box svg text{font-family:sans-serif !important;font-size:10px !important}')
        + '</style>'
        + '</head><body>'
        + '<div id="c1" class="box"></div><div id="c2" class="box"></div>'
        + scripts.concat(['/harness/page-helpers.js']).map(s => '<script src="' + s + '"></script>').join('')
        + '</body></html>';
}

function fileFor(url) {
    const p = new URL(url).pathname;
    if (p === '/vendor/d3.min.js') {
        return paths.d3;
    }
    if (p === '/vendor/test-font.woff2') {
        return TEST_FONT_FILE;
    }
    if (p === '/harness/page-helpers.js') {
        return path.join(__dirname, 'page-helpers.js');
    }
    if (p.startsWith('/dist/')) {
        return path.join(paths.dist, p.slice('/dist/'.length));
    }
    return null;
}

const types = {'.js': 'application/javascript', '.css': 'text/css', '.map': 'application/json', '.woff2': 'font/woff2'};

exports.test = base.test.extend({
    variant: ['standalone', {option: true}],

    pageErrors: async ({page}, use) => {
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        page.on('console', m => {
            if (m.type() === 'error') {
                errors.push('console.error: ' + m.text());
            }
        });
        errors.expected = [];
        await use(errors);
        const unexpected = errors.filter(e => !errors.expected.some(re => re.test(e)));
        base.expect(unexpected, 'unexpected page errors').toEqual([]);
    },

    odc: async ({page, variant, pageErrors}, use) => {
        await page.route(ORIGIN + '/**', route => {
            const url = route.request().url();
            const u = new URL(url);
            if (u.pathname === '/harness.html') {
                return route.fulfill({contentType: 'text/html',
                    body: harnessHtml(variant, u.searchParams.has('nod3'), u.searchParams.has('font'))});
            }
            const file = fileFor(url);
            if (!file || !fs.existsSync(file)) {
                return route.fulfill({status: 404, body: 'not found: ' + url});
            }
            return route.fulfill({path: file, contentType: types[path.extname(file)]});
        });
        // anything else (e.g. a CDN) must not be requested
        await page.route(url => !url.href.startsWith(ORIGIN), route => {
            pageErrors.push('unexpected external request: ' + route.request().url());
            return route.abort();
        });
        // fake clock: transitions are advanced explicitly with settle()
        await page.clock.install({time: 0});
        await page.goto(ORIGIN + '/harness.html');
        await use({
            variant,
            page,
            // reload the harness without the global d3 (global variant only)
            openWithoutD3: () => page.goto(ORIGIN + '/harness.html?nod3'),
            // reload without the 10px text override, with a fixed font file
            openWithTestFont: async () => {
                await page.goto(ORIGIN + '/harness.html?font');
                const loaded = await page.evaluate(f => document.fonts.load('11px "' + f + '"')
                    .then(faces => faces.length > 0 && document.fonts.check('11px "' + f + '"')), TEST_FONT);
                base.expect(loaded, 'test font loaded').toBe(true);
            },
            // run all pending transitions/timers to their end state
            settle: () => page.clock.runFor(10000),
            // run fn(ODCD3, helpers) in the page; helpers are defined in harnessHelpers()
            run: (fn, arg) => page.evaluate(([src, a]) => {
                // eslint-disable-next-line no-new-func
                const f = new Function('return (' + src + ')')();
                return f(window.ODCD3, window.__odc, a);
            }, [fn.toString(), arg])
        });
    }
});

exports.expect = base.expect;
