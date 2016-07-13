import {tdistr} from "./statistics-distributions"

var su = module.exports.StatisticsUtils ={};
su.sampleCorrelation = require('../bower_components/simple-statistics/src/sample_correlation');
su.linearRegression = require('../bower_components/simple-statistics/src/linear_regression');
su.linearRegressionLine = require('../bower_components/simple-statistics/src/linear_regression_line');
su.errorFunction = require('../bower_components/simple-statistics/src/error_function');
su.standardDeviation = require('../bower_components/simple-statistics/src/standard_deviation');
su.sampleStandardDeviation = require('../bower_components/simple-statistics/src/sample_standard_deviation');
su.variance = require('../bower_components/simple-statistics/src/variance');
su.mean = require('../bower_components/simple-statistics/src/mean');
su.zScore = require('../bower_components/simple-statistics/src/z_score');
su.standardError= arr => Math.sqrt(su.variance(arr)/(arr.length-1));


su.tValue= (degreesOfFreedom, criticalProbability) => { //as in http://stattrek.com/online-calculator/t-distribution.aspx
    return tdistr(degreesOfFreedom, criticalProbability);
};