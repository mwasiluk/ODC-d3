// Known defects, each tested twice (see test/helpers/known-bug.js):
//  - "[current behaviour]" pins what happens today; any change is a regression;
//  - "[known bug, expected]" asserts the correct behaviour with test.fail():
//    it must keep failing; when the bug is fixed Playwright reports
//    "expected to fail, but passed" and the fix PR turns it into a regular test.
const {test, expect} = require('./fixtures');
const fixtures = require('./chart-fixtures');

const by = Object.fromEntries(fixtures.map(f => [f.name, f]));

const regressionConfig = {x: {key: 'x'}, y: {key: 'y'}, groups: {key: 'g'}};

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

// BASELINE §8.17 (found by these tests): Regression uses the fixed clipPath id
// "odc-clip". With two Regression charts on a page the id is duplicated and
// the second chart's clip-path resolves to the first chart's clipPath.
function twoRegressions(odc) {
    return odc.run((ODCD3, h, cfg) => {
        const data = [];
        for (let i = 0; i < 8; i++) {
            data.push({x: i, y: (i * 7) % 5, g: 'a'});
        }
        new ODCD3.Regression('#c1', data, cfg);
        new ODCD3.Regression('#c2', data, cfg);
        return {duplicates: h.duplicateIds(), c2: h.references('c2')};
    }, regressionConfig);
}

test('[current behaviour, §8.17] two Regression charts share the clipPath id', async ({odc}) => {
    const r = await twoRegressions(odc);
    expect(r.duplicates).toEqual(['odc-clip']);
    expect(r.c2).toEqual([{from: 'g@clip-path', id: 'odc-clip', exists: true, inSameSvg: false}]);
});

test('[known bug §8.17, expected] two Regression charts use their own clipPath', async ({odc}) => {
    test.fail(true, 'BASELINE §8.17: fixed id "odc-clip"');
    const r = await twoRegressions(odc);
    expect(r.duplicates).toEqual([]);
    expect(r.c2.every(x => x.inSameSvg)).toBe(true);
});
