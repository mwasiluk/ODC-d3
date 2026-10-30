// Shared paths for unit and browser tests.
// ODC_DIST selects the bundle directory under test (default: committed dist/),
// so the same suite runs against committed artifacts and against a fresh build.
const path = require('path');

const root = path.resolve(__dirname, '../..');
const dist = path.resolve(process.env.ODC_DIST || path.join(root, 'dist'));

module.exports = {
    root,
    dist,
    globalBundle: path.join(dist, 'odc-d3.js'),
    standaloneBundle: path.join(dist, 'standalone', 'odc-d3.js'),
    css: path.join(dist, 'odc-d3.css'),
    minCss: path.join(dist, 'odc-d3.min.css'),
    d3: path.join(root, 'test', 'vendor', 'node_modules', 'd3', 'dist', 'd3.min.js')
};
