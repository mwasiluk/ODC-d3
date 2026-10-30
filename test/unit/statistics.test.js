const test = require('node:test');
const assert = require('node:assert/strict');
const {variants} = require('../helpers/bundles');
const {expectStillBroken} = require('../helpers/known-bug');

// Golden values from BASELINE.md §7.6 (measured on the v2.0.0 bundles).
// Exact equality on purpose: any change of computation results must be visible.
const sample = [2, 4, 4, 4, 5, 5, 7, 9];

for (const [variant, load] of Object.entries(variants)) {
    const su = () => load().ODCD3.StatisticsUtils;

    test(variant + ': regression and correlation', () => {
        const s = su();
        assert.deepEqual({...s.linearRegression([[1, 2], [2, 3], [3, 5], [4, 4]])}, {m: 0.8, b: 1.5});
        assert.equal(s.linearRegressionLine({m: 2, b: 1})(3), 7);
        assert.equal(s.sampleCorrelation([1, 2, 3, 4], [2, 3, 5, 4]), 0.7999999999999999);
    });

    test(variant + ': descriptive statistics', () => {
        const s = su();
        assert.equal(s.mean(sample), 5);
        assert.equal(s.variance(sample), 4);
        assert.equal(s.standardDeviation(sample), 2);
        assert.equal(s.sampleStandardDeviation(sample), 2.138089935299395);
        // local helper: sqrt(population variance / (n - 1))
        assert.equal(s.standardError(sample), 0.7559289460184544);
        assert.equal(s.quantile([3, 1, 2, 4, 5], 0.5), 3);
        assert.equal(s.quantile([1, 2, 3, 4, 5, 6, 7, 8], 0.25), 2.5);
        assert.equal(s.quantile([1, 2, 3, 4, 5, 6, 7, 8], 0.75), 6.5);
        assert.equal(s.zScore(5, 3, 2), 1);
    });

    // errorFunction is the Numerical Recipes erfc approximation (fractional
    // error < 1.2e-7). simple-statistics 8 evaluates the same polynomial with
    // Horner's scheme, which moves results by about one ulp (v2.0.0:
    // errorFunction(1) = 0.8427007877600067). Reference values: mpmath erf.
    test(variant + ': errorFunction against reference values', () => {
        const s = su();
        for (const [x, erf] of [[-2, -0.9953222650189527], [-0.5, -0.5204998778130465], [0.3, 0.3286267594591274],
            [1, 0.8427007929497149], [2.5, 0.999593047982555]]) {
            assert.ok(Math.abs(s.errorFunction(x) - erf) < 1.2e-7, 'erf(' + x + ')');
        }
        assert.ok(Math.abs(s.errorFunction(1) - 0.8427007877600067) <= 2 * Number.EPSILON);
    });

    // StatisticsUtils.quantile keeps the definition of simple-statistics 4.1.1
    // (simple-statistics >= 7.8.9 interpolates). For p = 0.25, 0.5, 0.75 (BoxPlot)
    // it is the "averaged inverted CDF" quantile; reference values: numpy.quantile(
    // values, p, method='averaged_inverted_cdf').
    test(variant + ': quantile for p = 0.25, 0.5, 0.75 against reference values', () => {
        const s = su();
        for (const [values, expected] of [
            [[7], [7, 7, 7]], [[3, 1], [1, 2, 3]], [[5, 1, 3], [1, 3, 5]], [[4, 1, 3, 2], [1.5, 2.5, 3.5]],
            [[2, 9, 4, 1, 7], [2, 4, 7]], [[6, 5, 4, 3, 2, 1], [2, 3.5, 5]], [[1, 2, 2, 3, 10, 11, 12], [2, 3, 11]],
            [[1, 2, 3, 4, 5, 6, 7, 8], [2.5, 4.5, 6.5]], [[-3.5, -1, 0, 2.25, -7], [-3.5, -1, 0]]
        ]) {
            const copy = values.slice();
            assert.deepEqual([0.25, 0.5, 0.75].map(p => s.quantile(values, p)), expected, JSON.stringify(values));
            assert.deepEqual(values, copy, 'input not modified');
        }
        assert.equal(s.quantile([3, 1, 2], 0), 1);
        assert.equal(s.quantile([3, 1, 2], 1), 3);
        assert.throws(() => s.quantile([], 0.5), /at least one data point/);
        assert.throws(() => s.quantile([1, 2], 1.5), /between 0 and 1/);
    });

    // An array of p gives the quantile for each p. simple-statistics 4.1.1
    // returned [NaN, 5, NaN] for the first call (BASELINE §8.16).
    test(variant + ': quantile with an array of p', () => {
        const s = su();
        assert.deepEqual(s.quantile([1, 2, 3, 4, 5, 6, 7, 8], [0.25, 0.5, 0.75]), [2.5, 4.5, 6.5]);
        assert.deepEqual(s.quantile([8, 1, 7, 2], [0.5, 0.25]), [4.5, 1.5]);
    });

    test(variant + ': tValue for df >= 4', () => {
        const s = su();
        assert.equal(s.tValue(10, 0.05), 1.8125);
        assert.equal(s.tValue(30, 0.01), 2.4573);
        assert.equal(s.tValue(5, 0.025), 2.5705);
        assert.equal(s.tValue(100, 0.05), 1.6602);
        // p = 0.5 returns the string '0' instead of a number (current behaviour)
        assert.equal(s.tValue(10, 0.5), '0');
    });

    // Regression calls tValue(n - 2, 1 - alpha / 2). The value is negative, so the
    // margin of error is negative too (BASELINE.md §8.5). Current behaviour, pinned.
    test(variant + ': tValue(df, 0.975) is negative (current behaviour, §8.5)', () => {
        const s = su();
        assert.deepEqual([4, 5, 8, 10, 48].map(df => s.tValue(df, 0.975)),
            [-2.7763, -2.5705, -2.306, -2.2281, -2.0106]);
    });

    test(variant + ': [current behaviour, BASELINE §8.4] tValue throws for df <= 3', () => {
        const s = su();
        for (const df of [1, 2, 3]) {
            for (const p of [0.975, 0.25, 0.1, 0.05, 0.025, 0.01, 0.005, 0.001]) {
                assert.throws(() => s.tValue(df, p), {name: 'ReferenceError', message: 'i is not defined'}, df + '/' + p);
            }
            // p = 0.5 does not reach the broken max()/min() helpers; note: returns a string
            assert.equal(s.tValue(df, 0.5), '0');
        }
    });

    test(variant + ': [known bug §8.4, expected] tValue returns a finite number for df <= 3', async () => {
        const s = su();
        await expectStillBroken('BASELINE §8.4', () => {
            for (const df of [1, 2, 3]) {
                assert.ok(Number.isFinite(s.tValue(df, 0.05)));
            }
        });
    });
}
