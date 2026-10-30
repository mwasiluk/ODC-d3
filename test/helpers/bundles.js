// Loads both bundle variants in plain Node without a DOM.
// standalone: UMD via require. global: needs a global d3, so d3 and the
// bundle are evaluated in a fresh vm context (window-less UMD branch -> ODCD3 global).
const fs = require('fs');
const vm = require('vm');
const paths = require('./paths');

function loadStandalone() {
    delete require.cache[require.resolve(paths.standaloneBundle)];
    return require(paths.standaloneBundle);
}

function loadGlobal() {
    if (!fs.existsSync(paths.d3)) {
        throw new Error('Missing ' + paths.d3 + ' - run: npm ci --prefix test/vendor');
    }
    const context = vm.createContext({console, setTimeout, clearTimeout, Intl});
    context.globalThis = context;
    context.self = context;
    vm.runInContext(fs.readFileSync(paths.d3, 'utf8'), context, {filename: paths.d3});
    vm.runInContext(fs.readFileSync(paths.globalBundle, 'utf8'), context, {filename: paths.globalBundle});
    return {ODCD3: context.ODCD3, d3: context.d3};
}

const variants = {
    standalone: () => ({ODCD3: loadStandalone(), d3: null}),
    global: loadGlobal
};

module.exports = {variants, loadStandalone, loadGlobal};
