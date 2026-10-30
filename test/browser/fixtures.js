// Playwright fixtures: open a harness page with the bundle variant of the
// current project. Files are served with page.route from disk (no web server,
// no CDN). Page errors are collected and fail the test unless declared.
const fs = require('fs');
const path = require('path');
const base = require('@playwright/test');
const paths = require('../helpers/paths');

const ORIGIN = 'http://odc.test';

function harnessHtml(variant, withoutD3) {
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
        + ' .box svg text{font-family:sans-serif !important;font-size:10px !important}</style>'
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
    if (p === '/harness/page-helpers.js') {
        return path.join(__dirname, 'page-helpers.js');
    }
    if (p.startsWith('/dist/')) {
        return path.join(paths.dist, p.slice('/dist/'.length));
    }
    return null;
}

const types = {'.js': 'application/javascript', '.css': 'text/css', '.map': 'application/json'};

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
                return route.fulfill({contentType: 'text/html', body: harnessHtml(variant, u.searchParams.has('nod3'))});
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
