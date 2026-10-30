#!/usr/bin/env node
// Static server for the examples: serves the repository root, so the pages
// under examples/ find ../../dist/. Build dist/ first (npm run build, or keep
// npm run watch running). The examples load D3 from https://d3js.org.
//
// Usage: npm run serve [-- --port 8089]   (or PORT=8089; HOST, default 127.0.0.1)
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

const root = path.resolve(__dirname, '..');
const TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.map': 'application/json; charset=utf-8',
    '.csv': 'text/csv; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.ico': 'image/x-icon'
};
const portArg = process.argv.indexOf('--port');
const port = Number(portArg > 0 ? process.argv[portArg + 1] : process.env.PORT || 8089);
const host = process.env.HOST || '127.0.0.1';

function send(res, status, body, headers) {
    res.writeHead(status, Object.assign({'Content-Type': 'text/plain; charset=utf-8'}, headers));
    res.end(body);
}

const server = http.createServer((req, res) => {
    let rel;
    try {
        rel = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch (e) {
        return send(res, 400, 'Bad request');
    }
    let file = path.join(root, rel);
    if (file !== root && !file.startsWith(root + path.sep)) {
        return send(res, 403, 'Forbidden');
    }
    fs.stat(file, (statErr, stat) => {
        if (!statErr && stat.isDirectory()) {
            if (!rel.endsWith('/')) {
                // relative links in the examples need the trailing slash
                return send(res, 301, '', {Location: rel + '/'});
            }
            file = path.join(file, 'index.html');
        }
        fs.readFile(file, (readErr, data) => {
            if (readErr) {
                return send(res, 404, 'Not found: ' + rel);
            }
            send(res, 200, data, {'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache'});
        });
    });
});

server.listen(port, host, () => {
    console.log('Serving ' + root);
    console.log('Examples: http://' + (host.includes(':') ? '[' + host + ']' : host) + ':' + server.address().port + '/examples/');
});
