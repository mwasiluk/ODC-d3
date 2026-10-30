// Known defects (docs/modernization/BASELINE.md §8) are tested twice:
// 1. a regular test pins the CURRENT behaviour, so any other change is a regression;
// 2. knownBug() asserts the EXPECTED (correct) behaviour and passes only while
//    that assertion still fails. Once the bug is fixed it fails with
//    "known bug appears fixed", so the fix PR must turn it into a regular test.
const assert = require('assert');

async function expectStillBroken(reference, fn) {
    try {
        await fn();
    } catch (e) {
        return e;
    }
    assert.fail('known bug appears fixed (' + reference + '): convert this test into a regular one');
}

module.exports = {expectStillBroken};
