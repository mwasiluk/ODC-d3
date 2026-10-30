// Regression tests for fixed defects (BASELINE §8 numbers). Each was a
// "[current behaviour]" + "[known bug, expected]" pair in known-bugs.spec.js.
const {test, expect} = require('./fixtures');
const fixtures = require('./chart-fixtures');

const by = Object.fromEntries(fixtures.map(f => [f.name, f]));

function tryRender(odc, cls, data, config) {
    return odc.run((ODCD3, h, [cls, data, config]) => {
        try {
            new ODCD3[cls]('#c1', data, config);
            return {ok: true};
        } catch (e) {
            return {ok: false, name: e.name, message: e.message};
        }
    }, [cls, data, config]);
}

// §8.12: x.fillMissing uses d3['time' + Interval].offset; the standalone D3
// shim did not re-export d3-time (TypeError reading 'offset')
test('HeatmapTimeSeries x.fillMissing fills the missing days (§8.12)', async ({odc}) => {
    const data = [{t: '2000-01-01', y: 'u', z: 1}, {t: '2000-01-04', y: 'u', z: 2}];
    expect(await tryRender(odc, 'HeatmapTimeSeries', data, {x: {key: 't', fillMissing: true}, y: {key: 'y'}, z: {key: 'z'}}))
        .toEqual({ok: true});
    expect(await odc.run((O, h) => Array.from(document.querySelectorAll('#c1 text.odc-label-x'), t => t.textContent).sort()))
        .toEqual(['2000-01-01', '2000-01-02', '2000-01-03', '2000-01-04']);
});
