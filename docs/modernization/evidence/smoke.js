// Baseline smoke harness (evidence for docs/modernization/BASELINE.md).
// Not wired into npm scripts on purpose: the next PR turns it into real tests.
//
// Usage (from the repository root, after `npm ci` and with Playwright available):
//   D3_FILE=/path/to/d3@7.9.0/dist/d3.min.js node docs/modernization/evidence/smoke.js
//
// The examples load D3 from https://d3js.org/d3.v7.min.js. If D3_FILE is set,
// that request is answered with the local file (useful when the CDN is blocked).
const http = require('http');
const fs = require('fs');
const path = require('path');
const {chromium} = require('playwright');

const root = path.resolve(__dirname, '../../..');
const types = {'.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
    '.json': 'application/json', '.csv': 'text/csv', '.map': 'application/json'};

const pages = [
    'docs/modernization/evidence/fixtures/standalone.html',
    'docs/modernization/evidence/fixtures/global.html',
    'docs/modernization/evidence/fixtures/global-no-d3.html',
    ...fs.readdirSync(path.join(root, 'examples'))
        .filter(d => fs.existsSync(path.join(root, 'examples', d, 'index.html')))
        .map(d => 'examples/' + d + '/index.html')
];

const server = http.createServer((req, res) => {
    const file = path.join(root, decodeURIComponent(req.url.split('?')[0]));
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        res.writeHead(404);
        return res.end();
    }
    res.writeHead(200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream'});
    fs.createReadStream(file).pipe(res);
});

server.listen(0, '127.0.0.1', async () => {
    const port = server.address().port;
    const browser = await chromium.launch();
    const out = [];
    for (const p of pages) {
        const page = await browser.newPage();
        const errors = [], failed = [];
        page.on('pageerror', e => errors.push('pageerror: ' + e.message.split('\n')[0]));
        page.on('console', m => m.type() === 'error' && errors.push('console: ' + m.text().split('\n')[0]));
        page.on('response', r => r.status() >= 400 && failed.push(r.status() + ' ' + r.url().replace(/^http:\/\/127\.0\.0\.1:\d+/, '')));
        if (process.env.D3_FILE) {
            await page.route('https://d3js.org/d3.v7.min.js',
                r => r.fulfill({path: process.env.D3_FILE, contentType: 'application/javascript'}));
        }
        await page.goto('http://127.0.0.1:' + port + '/' + p, {waitUntil: 'networkidle'});
        await page.waitForTimeout(1500);
        const info = await page.evaluate(() => ({
            svgs: document.querySelectorAll('svg').length,
            svgElements: document.querySelectorAll('svg *').length,
            result: window.result
        }));
        out.push({page: p, ...info, errors: [...new Set(errors)], failedRequests: [...new Set(failed)]});
        await page.close();
    }
    await browser.close();
    server.close();
    console.log(JSON.stringify(out, null, 1));
});
