import {tdistr} from "./statistics-distributions"

var su = module.exports.StatisticsUtils ={};
su.sampleCorrelation = require('simple-statistics/src/sample_correlation');
su.linearRegression = require('simple-statistics/src/linear_regression');
su.linearRegressionLine = require('simple-statistics/src/linear_regression_line');
su.errorFunction = require('simple-statistics/src/error_function');
su.standardDeviation = require('simple-statistics/src/standard_deviation');
su.sampleStandardDeviation = require('simple-statistics/src/sample_standard_deviation');
su.variance = require('simple-statistics/src/variance');
su.mean = require('simple-statistics/src/mean');
su.zScore = require('simple-statistics/src/z_score');
su.standardError= arr => Math.sqrt(su.variance(arr)/(arr.length-1));
su.quantile = require('simple-statistics/src/quantile');

su.tValue= (degreesOfFreedom, criticalProbability) => { //as in http://stattrek.com/online-calculator/t-distribution.aspx
    return tdistr(degreesOfFreedom, criticalProbability);
};