import {tdistr} from "./statistics-distributions"
import {
    sampleCorrelation,
    linearRegression,
    linearRegressionLine,
    errorFunction,
    standardDeviation,
    sampleStandardDeviation,
    variance,
    mean,
    zScore
} from 'simple-statistics'

export var StatisticsUtils = {};
var su = StatisticsUtils;
su.sampleCorrelation = sampleCorrelation;
su.linearRegression = linearRegression;
su.linearRegressionLine = linearRegressionLine;
su.errorFunction = errorFunction;
su.standardDeviation = standardDeviation;
su.sampleStandardDeviation = sampleStandardDeviation;
su.variance = variance;
su.mean = mean;
su.zScore = zScore;
su.standardError= arr => Math.sqrt(su.variance(arr)/(arr.length-1));
su.quantile = quantile;

su.tValue= (degreesOfFreedom, criticalProbability) => { //as in http://stattrek.com/online-calculator/t-distribution.aspx
    return tdistr(degreesOfFreedom, criticalProbability);
};

// Quantile definition of simple-statistics 4.1.1 (ISC, Tom MacWright), kept so
// that BoxPlot quartiles do not change: simple-statistics >= 7.8.9 interpolates
// linearly (R type 7). p is a number or an array of numbers in [0, 1].
function quantile(x, p) {
    var sorted = x.slice().sort((a, b) => a - b);
    if (Array.isArray(p)) {
        return p.map(q => quantileSorted(sorted, q));
    }
    return quantileSorted(sorted, p);
}

function quantileSorted(x, p) {
    var idx = x.length * p;
    if (x.length === 0) {
        throw new Error('quantile requires at least one data point.');
    } else if (p < 0 || p > 1) {
        throw new Error('quantiles must be between 0 and 1');
    } else if (p === 1) {
        return x[x.length - 1];
    } else if (p === 0) {
        return x[0];
    } else if (idx % 1 !== 0) {
        return x[Math.ceil(idx) - 1];
    } else if (x.length % 2 === 0) {
        return (x[idx - 1] + x[idx]) / 2;
    } else {
        return x[idx];
    }
}
