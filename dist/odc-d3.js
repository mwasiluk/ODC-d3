(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ODCD3 = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
/* @flow */

var sum = require('./sum');

/**
 * The mean, _also known as average_,
 * is the sum of all values over the number of values.
 * This is a [measure of central tendency](https://en.wikipedia.org/wiki/Central_tendency):
 * a method of finding a typical or central value of a set of numbers.
 *
 * This runs on `O(n)`, linear time in respect to the array
 *
 * @param {Array<number>} x input values
 * @returns {number} mean
 * @example
 * console.log(mean([0, 10])); // 5
 */
function mean(x /*: Array<number> */) /*:number*/{
    // The mean of no numbers is null
    if (x.length === 0) {
        return NaN;
    }

    return sum(x) / x.length;
}

module.exports = mean;

},{"./sum":6}],2:[function(require,module,exports){
'use strict';
/* @flow */

var sampleCovariance = require('./sample_covariance');
var sampleStandardDeviation = require('./sample_standard_deviation');

/**
 * The [correlation](http://en.wikipedia.org/wiki/Correlation_and_dependence) is
 * a measure of how correlated two datasets are, between -1 and 1
 *
 * @param {Array<number>} x first input
 * @param {Array<number>} y second input
 * @returns {number} sample correlation
 * @example
 * var a = [1, 2, 3, 4, 5, 6];
 * var b = [2, 2, 3, 4, 5, 60];
 * sampleCorrelation(a, b); //= 0.691
 */
function sampleCorrelation(x /*: Array<number> */, y /*: Array<number> */) /*:number*/{
    var cov = sampleCovariance(x, y),
        xstd = sampleStandardDeviation(x),
        ystd = sampleStandardDeviation(y);

    return cov / xstd / ystd;
}

module.exports = sampleCorrelation;

},{"./sample_covariance":3,"./sample_standard_deviation":4}],3:[function(require,module,exports){
'use strict';
/* @flow */

var mean = require('./mean');

/**
 * [Sample covariance](https://en.wikipedia.org/wiki/Sample_mean_and_sampleCovariance) of two datasets:
 * how much do the two datasets move together?
 * x and y are two datasets, represented as arrays of numbers.
 *
 * @param {Array<number>} x first input
 * @param {Array<number>} y second input
 * @returns {number} sample covariance
 * @example
 * var x = [1, 2, 3, 4, 5, 6];
 * var y = [6, 5, 4, 3, 2, 1];
 * sampleCovariance(x, y); //= -3.5
 */
function sampleCovariance(x /*:Array<number>*/, y /*:Array<number>*/) /*:number*/{

    // The two datasets must have the same length which must be more than 1
    if (x.length <= 1 || x.length !== y.length) {
        return NaN;
    }

    // determine the mean of each dataset so that we can judge each
    // value of the dataset fairly as the difference from the mean. this
    // way, if one dataset is [1, 2, 3] and [2, 3, 4], their covariance
    // does not suffer because of the difference in absolute values
    var xmean = mean(x),
        ymean = mean(y),
        sum = 0;

    // for each pair of values, the covariance increases when their
    // difference from the mean is associated - if both are well above
    // or if both are well below
    // the mean, the covariance increases significantly.
    for (var i = 0; i < x.length; i++) {
        sum += (x[i] - xmean) * (y[i] - ymean);
    }

    // this is Bessels' Correction: an adjustment made to sample statistics
    // that allows for the reduced degree of freedom entailed in calculating
    // values from samples rather than complete populations.
    var besselsCorrection = x.length - 1;

    // the covariance is weighted by the length of the datasets.
    return sum / besselsCorrection;
}

module.exports = sampleCovariance;

},{"./mean":1}],4:[function(require,module,exports){
'use strict';
/* @flow */

var sampleVariance = require('./sample_variance');

/**
 * The [standard deviation](http://en.wikipedia.org/wiki/Standard_deviation)
 * is the square root of the variance.
 *
 * @param {Array<number>} x input array
 * @returns {number} sample standard deviation
 * @example
 * ss.sampleStandardDeviation([2, 4, 4, 4, 5, 5, 7, 9]);
 * //= 2.138
 */
function sampleStandardDeviation(x /*:Array<number>*/) /*:number*/{
  // The standard deviation of no numbers is null
  var sampleVarianceX = sampleVariance(x);
  if (isNaN(sampleVarianceX)) {
    return NaN;
  }
  return Math.sqrt(sampleVarianceX);
}

module.exports = sampleStandardDeviation;

},{"./sample_variance":5}],5:[function(require,module,exports){
'use strict';
/* @flow */

var sumNthPowerDeviations = require('./sum_nth_power_deviations');

/*
 * The [sample variance](https://en.wikipedia.org/wiki/Variance#Sample_variance)
 * is the sum of squared deviations from the mean. The sample variance
 * is distinguished from the variance by the usage of [Bessel's Correction](https://en.wikipedia.org/wiki/Bessel's_correction):
 * instead of dividing the sum of squared deviations by the length of the input,
 * it is divided by the length minus one. This corrects the bias in estimating
 * a value from a set that you don't know if full.
 *
 * References:
 * * [Wolfram MathWorld on Sample Variance](http://mathworld.wolfram.com/SampleVariance.html)
 *
 * @param {Array<number>} x input array
 * @return {number} sample variance
 * @example
 * sampleVariance([1, 2, 3, 4, 5]); //= 2.5
 */
function sampleVariance(x /*: Array<number> */) /*:number*/{
    // The variance of no numbers is null
    if (x.length <= 1) {
        return NaN;
    }

    var sumSquaredDeviationsValue = sumNthPowerDeviations(x, 2);

    // this is Bessels' Correction: an adjustment made to sample statistics
    // that allows for the reduced degree of freedom entailed in calculating
    // values from samples rather than complete populations.
    var besselsCorrection = x.length - 1;

    // Find the mean value of that list
    return sumSquaredDeviationsValue / besselsCorrection;
}

module.exports = sampleVariance;

},{"./sum_nth_power_deviations":7}],6:[function(require,module,exports){
'use strict';
/* @flow */

/**
 * Our default sum is the [Kahan summation algorithm](https://en.wikipedia.org/wiki/Kahan_summation_algorithm) is
 * a method for computing the sum of a list of numbers while correcting
 * for floating-point errors. Traditionally, sums are calculated as many
 * successive additions, each one with its own floating-point roundoff. These
 * losses in precision add up as the number of numbers increases. This alternative
 * algorithm is more accurate than the simple way of calculating sums by simple
 * addition.
 *
 * This runs on `O(n)`, linear time in respect to the array
 *
 * @param {Array<number>} x input
 * @return {number} sum of all input numbers
 * @example
 * console.log(sum([1, 2, 3])); // 6
 */

function sum(x /*: Array<number> */) /*: number */{

    // like the traditional sum algorithm, we keep a running
    // count of the current sum.
    var sum = 0;

    // but we also keep three extra variables as bookkeeping:
    // most importantly, an error correction value. This will be a very
    // small number that is the opposite of the floating point precision loss.
    var errorCompensation = 0;

    // this will be each number in the list corrected with the compensation value.
    var correctedCurrentValue;

    // and this will be the next sum
    var nextSum;

    for (var i = 0; i < x.length; i++) {
        // first correct the value that we're going to add to the sum
        correctedCurrentValue = x[i] - errorCompensation;

        // compute the next sum. sum is likely a much larger number
        // than correctedCurrentValue, so we'll lose precision here,
        // and measure how much precision is lost in the next step
        nextSum = sum + correctedCurrentValue;

        // we intentionally didn't assign sum immediately, but stored
        // it for now so we can figure out this: is (sum + nextValue) - nextValue
        // not equal to 0? ideally it would be, but in practice it won't:
        // it will be some very small number. that's what we record
        // as errorCompensation.
        errorCompensation = nextSum - sum - correctedCurrentValue;

        // now that we've computed how much we'll correct for in the next
        // loop, start treating the nextSum as the current sum.
        sum = nextSum;
    }

    return sum;
}

module.exports = sum;

},{}],7:[function(require,module,exports){
'use strict';
/* @flow */

var mean = require('./mean');

/**
 * The sum of deviations to the Nth power.
 * When n=2 it's the sum of squared deviations.
 * When n=3 it's the sum of cubed deviations.
 *
 * @param {Array<number>} x
 * @param {number} n power
 * @returns {number} sum of nth power deviations
 * @example
 * var input = [1, 2, 3];
 * // since the variance of a set is the mean squared
 * // deviations, we can calculate that with sumNthPowerDeviations:
 * var variance = sumNthPowerDeviations(input) / input.length;
 */
function sumNthPowerDeviations(x /*: Array<number> */, n /*: number */) /*:number*/{
    var meanValue = mean(x),
        sum = 0;

    for (var i = 0; i < x.length; i++) {
        sum += Math.pow(x[i] - meanValue, n);
    }

    return sum;
}

module.exports = sumNthPowerDeviations;

},{"./mean":1}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Chart = exports.ChartConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChartConfig = exports.ChartConfig = function ChartConfig(custom) {
    _classCallCheck(this, ChartConfig);

    this.cssClassPrefix = "odc-";
    this.svgClass = this.cssClassPrefix + 'mw-d3-chart';
    this.width = undefined;
    this.height = undefined;
    this.margin = {
        left: 50,
        right: 30,
        top: 30,
        bottom: 50
    };
    this.tooltip = false;

    if (custom) {
        _utils.Utils.deepExtend(this, custom);
    }
};

var Chart = exports.Chart = function () {
    function Chart(placeholderSelector, data, config) {
        _classCallCheck(this, Chart);

        this.utils = _utils.Utils;
        this.placeholderSelector = placeholderSelector;
        this.svg = null;
        this.config = undefined;
        this.plot = {
            margin: {}
        };

        this.setConfig(config);

        if (data) {
            this.setData(data);
        }

        this.init();
    }

    _createClass(Chart, [{
        key: 'setConfig',
        value: function setConfig(config) {
            if (!config) {
                this.config = new ChartConfig();
            } else {
                this.config = config;
            }

            return this;
        }
    }, {
        key: 'setData',
        value: function setData(data) {
            this.data = data;
            return this;
        }
    }, {
        key: 'init',
        value: function init() {
            var self = this;
            self.initPlot();
            self.initSvg();
            self.draw();
            return this;
        }
    }, {
        key: 'initSvg',
        value: function initSvg() {
            var self = this;
            var config = this.config;
            console.log(config.svgClass);

            var width = self.plot.width + config.margin.left + config.margin.right;
            var height = self.plot.height + config.margin.top + config.margin.bottom;
            var aspect = width / height;

            self.svg = d3.select(self.placeholderSelector).select("svg");
            if (!self.svg.empty()) {
                self.svg.remove();
            }
            self.svg = d3.select(self.placeholderSelector).append("svg");

            self.svg.attr("width", width).attr("height", height).attr("viewBox", "0 0 " + " " + width + " " + height).attr("preserveAspectRatio", "xMidYMid meet").attr("class", config.svgClass);
            self.svgG = self.svg.append("g").attr("transform", "translate(" + config.margin.left + "," + config.margin.top + ")");

            if (config.tooltip) {
                self.plot.tooltip = this.utils.selectOrAppend(d3.select(self.placeholderSelector), 'div.mw-tooltip', 'div').attr("class", "mw-tooltip").style("opacity", 0);
            }

            if (!config.width || config.height) {
                d3.select(window).on("resize", function () {
                    //TODO add responsiveness if width/height not specified
                });
            }
        }
    }, {
        key: 'initPlot',
        value: function initPlot() {}
    }, {
        key: 'update',
        value: function update(data) {
            if (data) {
                this.setData(data);
            }
            console.log('base uppdate');
            return this;
        }
    }, {
        key: 'draw',
        value: function draw() {
            this.update();
            return this;
        }
    }]);

    return Chart;
}();

},{"./utils":15}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CorrelationMatrix = exports.CorrelationMatrixConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chart = require('./chart');

var _utils = require('./utils');

var _statisticsUtils = require('./statistics-utils');

var _legend = require('./legend');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CorrelationMatrixConfig = exports.CorrelationMatrixConfig = function (_ChartConfig) {
    _inherits(CorrelationMatrixConfig, _ChartConfig);

    //show tooltip on dot hover

    function CorrelationMatrixConfig(custom) {
        _classCallCheck(this, CorrelationMatrixConfig);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CorrelationMatrixConfig).call(this));

        _this.svgClass = 'odc-correlation-matrix';
        _this.guides = false;
        _this.tooltip = true;
        _this.legend = true;
        _this.highlightLabels = true;
        _this.variables = {
            labels: undefined,
            keys: [], //optional array of variable keys
            value: function value(d, variableKey) {
                return d[variableKey];
            }, // variable value accessor
            scale: "ordinal"
        };
        _this.correlation = {
            scale: "linear",
            domain: [-1, -0.75, -0.5, 0, 0.5, 0.75, 1],
            range: ["darkblue", "blue", "lightskyblue", "white", "orangered", "crimson", "darkred"],
            value: function value(xValues, yValues) {
                return _statisticsUtils.StatisticsUtils.sampleCorrelation(xValues, yValues);
            }

        };
        _this.cell = {
            shape: "ellipse", //possible values: rect, circle, ellipse
            size: undefined,
            sizeMin: 5,
            sizeMax: 80,
            padding: 1
        };
        _this.margin = {
            left: 60,
            right: 50,
            top: 30,
            bottom: 60
        };

        if (custom) {
            _utils.Utils.deepExtend(_this, custom);
        }
        return _this;
    } //show axis guides


    return CorrelationMatrixConfig;
}(_chart.ChartConfig);

var CorrelationMatrix = exports.CorrelationMatrix = function (_Chart) {
    _inherits(CorrelationMatrix, _Chart);

    function CorrelationMatrix(placeholderSelector, data, config) {
        _classCallCheck(this, CorrelationMatrix);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CorrelationMatrix).call(this, placeholderSelector, data, new CorrelationMatrixConfig(config)));
    }

    _createClass(CorrelationMatrix, [{
        key: 'setConfig',
        value: function setConfig(config) {
            return _get(Object.getPrototypeOf(CorrelationMatrix.prototype), 'setConfig', this).call(this, new CorrelationMatrixConfig(config));
        }
    }, {
        key: 'initPlot',
        value: function initPlot() {
            var self = this;
            var margin = this.config.margin;
            var conf = this.config;
            this.plot = {
                x: {},
                correlation: {
                    matrix: undefined,
                    cells: undefined,
                    color: {},
                    shape: {}
                }

            };
            this.setupVariables();
            var width = conf.width;
            var placeholderNode = d3.select(this.placeholderSelector).node();
            this.plot.placeholderNode = placeholderNode;

            var parentWidth = placeholderNode.getBoundingClientRect().width;
            if (width) {

                if (!this.plot.cellSize) {
                    this.plot.cellSize = Math.max(conf.cell.sizeMin, Math.min(conf.cell.sizeMax, (width - margin.left - margin.right) / this.plot.variables.length));
                }
            } else {
                this.plot.cellSize = this.config.cell.size;

                if (!this.plot.cellSize) {
                    this.plot.cellSize = Math.max(conf.cell.sizeMin, Math.min(conf.cell.sizeMax, parentWidth / this.plot.variables.length));
                }

                width = this.plot.cellSize * this.plot.variables.length + margin.left + margin.right;
            }

            var height = width;
            if (!height) {
                height = placeholderNode.getBoundingClientRect().height;
            }

            this.plot.width = width - margin.left - margin.right;
            this.plot.height = this.plot.width;

            this.setupVariablesScales();
            this.setupCorrelationScales();
            this.setupCorrelationMatrix();

            return this;
        }
    }, {
        key: 'setupVariablesScales',
        value: function setupVariablesScales() {

            var plot = this.plot;
            var x = plot.x;
            var conf = this.config.variables;

            /* *
             * value accessor - returns the value to encode for a given data object.
             * scale - maps value to a visual display encoding, such as a pixel position.
             * map function - maps from data value to display value
             * axis - sets up axis
             **/
            x.value = conf.value;
            x.scale = d3.scale[conf.scale]().rangeBands([plot.width, 0]);
            x.map = function (d) {
                return x.scale(x.value(d));
            };
        }
    }, {
        key: 'setupCorrelationScales',
        value: function setupCorrelationScales() {
            var plot = this.plot;
            var corrConf = this.config.correlation;

            plot.correlation.color.scale = d3.scale[corrConf.scale]().domain(corrConf.domain).range(corrConf.range);
            var shape = plot.correlation.shape = {};

            var cellConf = this.config.cell;
            shape.type = cellConf.shape;

            var shapeSize = plot.cellSize - cellConf.padding * 2;
            if (shape.type == 'circle') {
                var radiusMax = shapeSize / 2;
                shape.radiusScale = d3.scale.linear().domain([0, 1]).range([2, radiusMax]);
                shape.radius = function (c) {
                    return shape.radiusScale(Math.abs(c.value));
                };
            } else if (shape.type == 'ellipse') {
                var radiusMax = shapeSize / 2;
                shape.radiusScale = d3.scale.linear().domain([0, 1]).range([radiusMax, 2]);
                shape.radiusX = function (c) {
                    return shape.radiusScale(Math.abs(c.value));
                };
                shape.radiusY = radiusMax;

                shape.rotateVal = function (v) {
                    if (v == 0) return "0";
                    if (v < 0) return "-45";
                    return "45";
                };
            } else if (shape.type == 'rect') {
                shape.size = shapeSize;
            }
        }
    }, {
        key: 'setupVariables',
        value: function setupVariables() {

            var variablesConf = this.config.variables;

            var data = this.data;
            var plot = this.plot;
            plot.domainByVariable = {};
            plot.variables = variablesConf.keys;
            if (!plot.variables || !plot.variables.length) {
                plot.variables = _utils.Utils.inferVariables(data, this.config.groups.key, this.config.includeInPlot);
            }

            plot.labels = [];
            plot.labelByVariable = {};
            plot.variables.forEach(function (variableKey, index) {
                plot.domainByVariable[variableKey] = d3.extent(data, function (d) {
                    return variablesConf.value(d, variableKey);
                });
                var label = variableKey;
                if (variablesConf.labels && variablesConf.labels.length > index) {

                    label = variablesConf.labels[index];
                }
                plot.labels.push(label);
                plot.labelByVariable[variableKey] = label;
            });

            console.log(plot.labelByVariable);
        }
    }, {
        key: 'setupCorrelationMatrix',
        value: function setupCorrelationMatrix() {
            var self = this;
            var data = this.data;
            var matrix = this.plot.correlation.matrix = [];
            var matrixCells = this.plot.correlation.matrix.cells = [];
            var plot = this.plot;

            var variableToValues = {};
            plot.variables.forEach(function (v, i) {

                variableToValues[v] = data.map(function (d) {
                    return plot.x.value(d, v);
                });
            });

            plot.variables.forEach(function (v1, i) {
                var row = [];
                matrix.push(row);

                plot.variables.forEach(function (v2, j) {
                    var corr = 1;
                    if (v1 != v2) {
                        corr = self.config.correlation.value(variableToValues[v1], variableToValues[v2]);
                    }
                    var cell = {
                        rowVar: v1,
                        colVar: v2,
                        row: i,
                        col: j,
                        value: corr
                    };
                    row.push(cell);

                    matrixCells.push(cell);
                });
            });
        }
    }, {
        key: 'update',
        value: function update(newData) {
            _get(Object.getPrototypeOf(CorrelationMatrix.prototype), 'update', this).call(this, newData);
            // this.update
            this.updateCells();
            this.updateVariableLabels();

            if (this.config.legend) {
                this.updateLegend();
            }
        }
    }, {
        key: 'updateVariableLabels',
        value: function updateVariableLabels() {
            var self = this;
            var plot = self.plot;
            var labelClass = self.config.cssClassPrefix + "label";
            var labelXClass = labelClass + " " + labelClass + "-x";
            var labelYClass = labelClass + " " + labelClass + "-y";
            plot.labelClass = labelClass;

            var labelsX = self.svgG.selectAll(labelXClass).data(plot.variables);

            labelsX.enter().append("text");

            labelsX.attr("x", function (d, i) {
                return i * plot.cellSize + plot.cellSize / 2;
            }).attr("y", plot.height).attr("dx", -2).attr("transform", function (d, i) {
                return "rotate(-90, " + (i * plot.cellSize + plot.cellSize / 2) + ", " + plot.height + ")";
            }).attr("text-anchor", "end").attr("class", function (d, i) {
                return labelXClass + " " + labelXClass + "-" + i;
            })
            // .attr("dominant-baseline", "hanging")
            .text(function (v) {
                return v;
            });

            labelsX.exit().remove();

            //////

            var labelsY = self.svgG.selectAll(labelYClass).data(plot.variables);

            labelsY.enter().append("text");

            labelsY.attr("x", 0).attr("y", function (d, i) {
                return i * plot.cellSize + plot.cellSize / 2;
            }).attr("dx", -2).attr("text-anchor", "end").attr("class", function (d, i) {
                return labelYClass + " " + labelYClass + "-" + i;
            })
            // .attr("dominant-baseline", "hanging")
            .text(function (v) {
                return v;
            });

            labelsX.exit().remove();
        }
    }, {
        key: 'updateCells',
        value: function updateCells() {

            var self = this;
            var plot = self.plot;
            var cellClass = self.config.cssClassPrefix + "cell";
            var cellShape = plot.correlation.shape.type;

            var data = this.data;

            var cells = self.svgG.selectAll(cellClass).data(plot.correlation.matrix.cells);

            cells.enter().append("g").attr("class", cellClass);
            cells.attr("transform", function (c) {
                return "translate(" + (plot.cellSize * c.col + plot.cellSize / 2) + "," + (plot.cellSize * c.row + plot.cellSize / 2) + ")";
            });
            var shapes = cells.append(cellShape);

            if (plot.correlation.shape.type == 'circle') {

                shapes.attr("r", plot.correlation.shape.radius).attr("cx", 0).attr("cy", 0);
            }

            if (plot.correlation.shape.type == 'ellipse') {
                // cells.attr("transform", c=> "translate(300,150) rotate("+plot.correlation.shape.rotateVal(c.value)+")");
                shapes.attr("rx", plot.correlation.shape.radiusX).attr("ry", plot.correlation.shape.radiusY).attr("cx", 0).attr("cy", 0).attr("transform", function (c) {
                    return "rotate(" + plot.correlation.shape.rotateVal(c.value) + ")";
                });
            }

            if (plot.correlation.shape.type == 'rect') {
                shapes.attr("width", plot.correlation.shape.size).attr("height", plot.correlation.shape.size).attr("x", -plot.cellSize / 2).attr("y", -plot.cellSize / 2);
            }

            var mouseoverCallbacks = [];
            var mouseoutCallbacks = [];

            if (plot.tooltip) {

                mouseoverCallbacks.push(function (c) {
                    plot.tooltip.transition().duration(200).style("opacity", .9);
                    var html = c.value;
                    plot.tooltip.html(html).style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");
                });

                mouseoutCallbacks.push(function (c) {
                    plot.tooltip.transition().duration(500).style("opacity", 0);
                });
            }

            if (self.config.highlightLabels) {
                var highlightClass = self.config.cssClassPrefix + "highlight";
                var xLabelClass = function xLabelClass(c) {
                    return plot.labelClass + "-x-" + c.col;
                };
                var yLabelClass = function yLabelClass(c) {
                    return plot.labelClass + "-y-" + c.row;
                };

                mouseoverCallbacks.push(function (c) {

                    self.svgG.selectAll("text." + xLabelClass(c)).classed(highlightClass, true);
                    self.svgG.selectAll("text." + yLabelClass(c)).classed(highlightClass, true);
                });
                mouseoutCallbacks.push(function (c) {
                    self.svgG.selectAll("text." + xLabelClass(c)).classed(highlightClass, false);
                    self.svgG.selectAll("text." + yLabelClass(c)).classed(highlightClass, false);
                });
            }

            cells.on("mouseover", function (c) {
                mouseoverCallbacks.forEach(function (callback) {
                    return callback(c);
                });
            }).on("mouseout", function (c) {
                mouseoutCallbacks.forEach(function (callback) {
                    return callback(c);
                });
            });

            shapes.style("fill", function (c) {
                return plot.correlation.color.scale(c.value);
            });

            cells.exit().remove();
        }
    }, {
        key: 'updateLegend',
        value: function updateLegend() {

            var plot = this.plot;
            var legendX = this.plot.width + 10;
            var legendY = 0;
            var barWidth = 10;
            var barHeight = this.plot.height - 2;
            var scale = plot.correlation.color.scale;

            plot.legend = new _legend.Legend(this.svg, this.svgG, scale, legendX, legendY).linearGradientBar(barWidth, barHeight);
        }
    }]);

    return CorrelationMatrix;
}(_chart.Chart);

},{"./chart":8,"./legend":11,"./statistics-utils":14,"./utils":15}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _scatterplot = require("./scatterplot");

Object.defineProperty(exports, "ScatterPlot", {
  enumerable: true,
  get: function get() {
    return _scatterplot.ScatterPlot;
  }
});
Object.defineProperty(exports, "ScatterPlotConfig", {
  enumerable: true,
  get: function get() {
    return _scatterplot.ScatterPlotConfig;
  }
});

var _scatterplotMatrix = require("./scatterplot-matrix");

Object.defineProperty(exports, "ScatterPlotMatrix", {
  enumerable: true,
  get: function get() {
    return _scatterplotMatrix.ScatterPlotMatrix;
  }
});
Object.defineProperty(exports, "ScatterPlotMatrixConfig", {
  enumerable: true,
  get: function get() {
    return _scatterplotMatrix.ScatterPlotMatrixConfig;
  }
});

var _correlationMatrix = require("./correlation-matrix");

Object.defineProperty(exports, "CorrelationMatrix", {
  enumerable: true,
  get: function get() {
    return _correlationMatrix.CorrelationMatrix;
  }
});
Object.defineProperty(exports, "CorrelationMatrixConfig", {
  enumerable: true,
  get: function get() {
    return _correlationMatrix.CorrelationMatrixConfig;
  }
});

var _statisticsUtils = require("./statistics-utils");

Object.defineProperty(exports, "StatisticsUtils", {
  enumerable: true,
  get: function get() {
    return _statisticsUtils.StatisticsUtils;
  }
});

},{"./correlation-matrix":9,"./scatterplot":13,"./scatterplot-matrix":12,"./statistics-utils":14}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Legend = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Legend = exports.Legend = function () {
    function Legend(svg, legendParent, scale, legendX, legendY) {
        _classCallCheck(this, Legend);

        this.cssClassPrefix = "odc-";
        this.legendClass = this.cssClassPrefix + "legend";

        this.scale = scale;
        this.svg = svg;

        this.container = _utils.Utils.selectOrAppend(legendParent, "g." + this.legendClass, "g").attr("transform", "translate(" + legendX + "," + legendY + ")").classed(this.legendClass, true);
    }

    _createClass(Legend, [{
        key: "linearGradientBar",
        value: function linearGradientBar(barWidth, barHeight) {
            var gradientId = this.cssClassPrefix + "linear-gradient";
            var scale = this.scale;

            this.linearGradient = _utils.Utils.linearGradient(this.svg, gradientId, this.scale.range(), 0, 100, 0, 0);

            this.container.append("rect").attr("width", barWidth).attr("height", barHeight).attr("x", 0).attr("y", 0).style("fill", "url(#" + gradientId + ")");

            var ticks = this.container.selectAll("text").data(scale.domain());
            var ticksNumber = scale.domain().length - 1;
            ticks.enter().append("text").attr("x", barWidth).attr("y", function (d, i) {
                console.log(barHeight - i * barHeight / ticksNumber);return barHeight - i * barHeight / ticksNumber;
            }).attr("dx", 3)
            // .attr("dy", 1)
            .attr("alignment-baseline", "middle").text(function (d) {
                return d;
            });

            ticks.exit().remove();

            return this;
        }
    }]);

    return Legend;
}();

},{"./utils":15}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ScatterPlotMatrix = exports.ScatterPlotMatrixConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chart = require("./chart");

var _scatterplot = require("./scatterplot");

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScatterPlotMatrixConfig = exports.ScatterPlotMatrixConfig = function (_ScatterPlotConfig) {
    _inherits(ScatterPlotMatrixConfig, _ScatterPlotConfig);

    //ticks number, (default: computed using cell size)
    //show axis guides
    //scatter plot cell padding

    function ScatterPlotMatrixConfig(custom) {
        _classCallCheck(this, ScatterPlotMatrixConfig);

        // this.svgClass = 'mw-d3-scatterplot-matrix';

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ScatterPlotMatrixConfig).call(this));

        _this.svgClass = 'mw-d3-scatterplot-matrix';
        _this.size = 200;
        _this.padding = 20;
        _this.brush = true;
        _this.guides = true;
        _this.tooltip = true;
        _this.ticks = undefined;
        _this.x = { // X axis config
            orient: "bottom",
            scale: "linear"
        };
        _this.y = { // Y axis config
            orient: "left",
            scale: "linear"
        };
        _this.groups = {
            key: undefined, //object property name or array index with grouping variable
            includeInPlot: false, //include group as variable in plot, boolean (default: false)
            value: function value(d, key) {
                return d[key];
            }, // grouping value accessor,
            label: ""
        };
        _this.variables = {
            labels: [], //optional array of variable labels (for the diagonal of the plot).
            keys: [], //optional array of variable keys
            value: function value(d, variableKey) {
                // variable value accessor
                return d[variableKey];
            }
        };
        console.log(custom);
        _utils.Utils.deepExtend(_this, custom);
        return _this;
    } //show tooltip on dot hover
    //scatter plot cell size


    return ScatterPlotMatrixConfig;
}(_scatterplot.ScatterPlotConfig);

var ScatterPlotMatrix = exports.ScatterPlotMatrix = function (_Chart) {
    _inherits(ScatterPlotMatrix, _Chart);

    function ScatterPlotMatrix(placeholderSelector, data, config) {
        _classCallCheck(this, ScatterPlotMatrix);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ScatterPlotMatrix).call(this, placeholderSelector, data, new ScatterPlotMatrixConfig(config)));
    }

    _createClass(ScatterPlotMatrix, [{
        key: "setConfig",
        value: function setConfig(config) {
            return _get(Object.getPrototypeOf(ScatterPlotMatrix.prototype), "setConfig", this).call(this, new ScatterPlotMatrixConfig(config));
        }
    }, {
        key: "initPlot",
        value: function initPlot() {

            var self = this;
            var margin = this.config.margin;
            var conf = this.config;
            this.plot = {
                x: {},
                y: {},
                dot: {
                    color: null //color scale mapping function
                }
            };

            this.setupVariables();

            this.plot.size = conf.size;

            var width = conf.width;
            var placeholderNode = d3.select(this.placeholderSelector).node();

            if (!width) {
                var maxWidth = margin.left + margin.right + this.plot.variables.length * this.plot.size;
                width = Math.min(placeholderNode.getBoundingClientRect().width, maxWidth);
            }
            var height = width;
            if (!height) {
                height = placeholderNode.getBoundingClientRect().height;
            }

            this.plot.width = width - margin.left - margin.right;
            this.plot.height = height - margin.top - margin.bottom;

            if (conf.ticks === undefined) {
                conf.ticks = this.plot.size / 40;
            }

            this.setupX();
            this.setupY();

            if (conf.dot.d3ColorCategory) {
                this.plot.dot.colorCategory = d3.scale[conf.dot.d3ColorCategory]();
            }
            var colorValue = conf.dot.color;
            if (colorValue) {
                this.plot.dot.colorValue = colorValue;

                if (typeof colorValue === 'string' || colorValue instanceof String) {
                    this.plot.dot.color = colorValue;
                } else if (this.plot.dot.colorCategory) {
                    this.plot.dot.color = function (d) {
                        return self.plot.dot.colorCategory(self.plot.dot.colorValue(d));
                    };
                }
            }

            return this;
        }
    }, {
        key: "setupVariables",
        value: function setupVariables() {
            var variablesConf = this.config.variables;

            var data = this.data;
            var plot = this.plot;
            plot.domainByVariable = {};
            plot.variables = variablesConf.keys;
            if (!plot.variables || !plot.variables.length) {
                plot.variables = _utils.Utils.inferVariables(data, this.config.groups.key, this.config.includeInPlot);
            }

            plot.labels = [];
            plot.labelByVariable = {};
            plot.variables.forEach(function (variableKey, index) {
                plot.domainByVariable[variableKey] = d3.extent(data, function (d) {
                    return variablesConf.value(d, variableKey);
                });
                var label = variableKey;
                if (variablesConf.labels && variablesConf.labels.length > index) {

                    label = variablesConf.labels[index];
                }
                plot.labels.push(label);
                plot.labelByVariable[variableKey] = label;
            });

            console.log(plot.labelByVariable);

            plot.subplots = [];
        }
    }, {
        key: "setupX",
        value: function setupX() {

            var plot = this.plot;
            var x = plot.x;
            var conf = this.config;

            x.value = conf.variables.value;
            x.scale = d3.scale[conf.x.scale]().range([conf.padding / 2, plot.size - conf.padding / 2]);
            x.map = function (d, variable) {
                return x.scale(x.value(d, variable));
            };
            x.axis = d3.svg.axis().scale(x.scale).orient(conf.x.orient).ticks(conf.ticks);
            x.axis.tickSize(plot.size * plot.variables.length);
        }
    }, {
        key: "setupY",
        value: function setupY() {

            var plot = this.plot;
            var y = plot.y;
            var conf = this.config;

            y.value = conf.variables.value;
            y.scale = d3.scale[conf.y.scale]().range([plot.size - conf.padding / 2, conf.padding / 2]);
            y.map = function (d, variable) {
                return y.scale(y.value(d, variable));
            };
            y.axis = d3.svg.axis().scale(y.scale).orient(conf.y.orient).ticks(conf.ticks);
            y.axis.tickSize(-plot.size * plot.variables.length);
        }
    }, {
        key: "draw",
        value: function draw() {
            var self = this;
            var n = self.plot.variables.length;
            var conf = this.config;
            self.svgG.selectAll(".mw-axis-x.mw-axis").data(self.plot.variables).enter().append("g").attr("class", "mw-axis-x mw-axis" + (conf.guides ? '' : ' mw-no-guides')).attr("transform", function (d, i) {
                return "translate(" + (n - i - 1) * self.plot.size + ",0)";
            }).each(function (d) {
                self.plot.x.scale.domain(self.plot.domainByVariable[d]);d3.select(this).call(self.plot.x.axis);
            });

            self.svgG.selectAll(".mw-axis-y.mw-axis").data(self.plot.variables).enter().append("g").attr("class", "mw-axis-y mw-axis" + (conf.guides ? '' : ' mw-no-guides')).attr("transform", function (d, i) {
                return "translate(0," + i * self.plot.size + ")";
            }).each(function (d) {
                self.plot.y.scale.domain(self.plot.domainByVariable[d]);d3.select(this).call(self.plot.y.axis);
            });

            if (conf.tooltip) {
                self.plot.tooltip = this.utils.selectOrAppend(d3.select(self.placeholderSelector), 'div.mw-tooltip', 'div').attr("class", "mw-tooltip").style("opacity", 0);
            }

            var cell = self.svgG.selectAll(".mw-cell").data(self.utils.cross(self.plot.variables, self.plot.variables)).enter().append("g").attr("class", "mw-cell").attr("transform", function (d) {
                return "translate(" + (n - d.i - 1) * self.plot.size + "," + d.j * self.plot.size + ")";
            });

            if (conf.brush) {
                this.drawBrush(cell);
            }

            cell.each(plotSubplot);

            //Labels
            cell.filter(function (d) {
                return d.i === d.j;
            }).append("text").attr("x", conf.padding).attr("y", conf.padding).attr("dy", ".71em").text(function (d) {
                return self.plot.labelByVariable[d.x];
            });

            function plotSubplot(p) {
                var plot = self.plot;
                plot.subplots.push(p);
                var cell = d3.select(this);

                plot.x.scale.domain(plot.domainByVariable[p.x]);
                plot.y.scale.domain(plot.domainByVariable[p.y]);

                cell.append("rect").attr("class", "mw-frame").attr("x", conf.padding / 2).attr("y", conf.padding / 2).attr("width", conf.size - conf.padding).attr("height", conf.size - conf.padding);

                p.update = function () {
                    var subplot = this;
                    var dots = cell.selectAll("circle").data(self.data);

                    dots.enter().append("circle");

                    dots.attr("cx", function (d) {
                        return plot.x.map(d, subplot.x);
                    }).attr("cy", function (d) {
                        return plot.y.map(d, subplot.y);
                    }).attr("r", self.config.dot.radius);

                    if (plot.dot.color) {
                        dots.style("fill", plot.dot.color);
                    }

                    if (plot.tooltip) {
                        dots.on("mouseover", function (d) {
                            plot.tooltip.transition().duration(200).style("opacity", .9);
                            var html = "(" + plot.x.value(d, subplot.x) + ", " + plot.y.value(d, subplot.y) + ")";
                            plot.tooltip.html(html).style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");

                            var group = self.config.groups.value(d);
                            if (group || group === 0) {
                                html += "<br/>";
                                var label = self.config.groups.label;
                                if (label) {
                                    html += label + ": ";
                                }
                                html += group;
                            }
                            plot.tooltip.html(html).style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");
                        }).on("mouseout", function (d) {
                            plot.tooltip.transition().duration(500).style("opacity", 0);
                        });
                    }

                    dots.exit().remove();
                };

                p.update();
            }
        }
    }, {
        key: "update",
        value: function update() {
            this.plot.subplots.forEach(function (p) {
                p.update();
            });
        }
    }, {
        key: "drawBrush",
        value: function drawBrush(cell) {
            var self = this;
            var brush = d3.svg.brush().x(self.plot.x.scale).y(self.plot.y.scale).on("brushstart", brushstart).on("brush", brushmove).on("brushend", brushend);

            cell.append("g").call(brush);

            var brushCell;

            // Clear the previously-active brush, if any.
            function brushstart(p) {
                if (brushCell !== this) {
                    d3.select(brushCell).call(brush.clear());
                    self.plot.x.scale.domain(self.plot.domainByVariable[p.x]);
                    self.plot.y.scale.domain(self.plot.domainByVariable[p.y]);
                    brushCell = this;
                }
            }

            // Highlight the selected circles.
            function brushmove(p) {
                var e = brush.extent();
                self.svgG.selectAll("circle").classed("hidden", function (d) {
                    return e[0][0] > d[p.x] || d[p.x] > e[1][0] || e[0][1] > d[p.y] || d[p.y] > e[1][1];
                });
            }
            // If the brush is empty, select all circles.
            function brushend() {
                if (brush.empty()) self.svgG.selectAll(".hidden").classed("hidden", false);
            }
        }
    }]);

    return ScatterPlotMatrix;
}(_chart.Chart);

},{"./chart":8,"./scatterplot":13,"./utils":15}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ScatterPlot = exports.ScatterPlotConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chart = require('./chart');

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScatterPlotConfig = exports.ScatterPlotConfig = function (_ChartConfig) {
    _inherits(ScatterPlotConfig, _ChartConfig);

    //show axis guides

    function ScatterPlotConfig(custom) {
        _classCallCheck(this, ScatterPlotConfig);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ScatterPlotConfig).call(this));

        _this.svgClass = 'mw-d3-scatterplot';
        _this.guides = false;
        _this.tooltip = true;
        _this.x = { // X axis config
            label: 'X', // axis label
            key: 0,
            value: function value(d, key) {
                return d[key];
            }, // x value accessor
            orient: "bottom",
            scale: "linear"
        };
        _this.y = { // Y axis config
            label: 'Y', // axis label,
            key: 1,
            value: function value(d, key) {
                return d[key];
            }, // y value accessor
            orient: "left",
            scale: "linear"
        };
        _this.groups = {
            key: 2,
            value: function value(d, key) {
                return d[key];
            }, // grouping value accessor,
            label: ""
        };

        var config = _this;
        _this.dot = {
            radius: 2,
            color: function color(d) {
                return config.groups.value(d, config.groups.key);
            }, // string or function returning color's value for color scale
            d3ColorCategory: 'category10'
        };

        if (custom) {
            _utils.Utils.deepExtend(_this, custom);
        }

        return _this;
    } //show tooltip on dot hover


    return ScatterPlotConfig;
}(_chart.ChartConfig);

var ScatterPlot = exports.ScatterPlot = function (_Chart) {
    _inherits(ScatterPlot, _Chart);

    function ScatterPlot(placeholderSelector, data, config) {
        _classCallCheck(this, ScatterPlot);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ScatterPlot).call(this, placeholderSelector, data, new ScatterPlotConfig(config)));
    }

    _createClass(ScatterPlot, [{
        key: 'setConfig',
        value: function setConfig(config) {
            return _get(Object.getPrototypeOf(ScatterPlot.prototype), 'setConfig', this).call(this, new ScatterPlotConfig(config));
        }
    }, {
        key: 'initPlot',
        value: function initPlot() {
            var self = this;
            var margin = this.config.margin;
            var conf = this.config;
            this.plot = {
                x: {},
                y: {},
                dot: {
                    color: null //color scale mapping function
                }
            };

            var width = conf.width;
            var placeholderNode = d3.select(this.placeholderSelector).node();

            if (!width) {
                width = placeholderNode.getBoundingClientRect().width;
            }
            var height = conf.height;
            if (!height) {
                height = placeholderNode.getBoundingClientRect().height;
            }

            this.plot.width = width - margin.left - margin.right;
            this.plot.height = height - margin.top - margin.bottom;

            this.setupX();
            this.setupY();

            if (conf.dot.d3ColorCategory) {
                this.plot.dot.colorCategory = d3.scale[conf.dot.d3ColorCategory]();
            }
            var colorValue = conf.dot.color;
            if (colorValue) {
                this.plot.dot.colorValue = colorValue;

                if (typeof colorValue === 'string' || colorValue instanceof String) {
                    this.plot.dot.color = colorValue;
                } else if (this.plot.dot.colorCategory) {
                    this.plot.dot.color = function (d) {
                        return self.plot.dot.colorCategory(self.plot.dot.colorValue(d));
                    };
                }
            } else {}

            return this;
        }
    }, {
        key: 'setupX',
        value: function setupX() {

            var plot = this.plot;
            var x = plot.x;
            var conf = this.config.x;

            /* *
             * value accessor - returns the value to encode for a given data object.
             * scale - maps value to a visual display encoding, such as a pixel position.
             * map function - maps from data value to display value
             * axis - sets up axis
             **/
            x.value = function (d) {
                return conf.value(d, conf.key);
            };
            x.scale = d3.scale[conf.scale]().range([0, plot.width]);
            x.map = function (d) {
                return x.scale(x.value(d));
            };
            x.axis = d3.svg.axis().scale(x.scale).orient(conf.orient);
            var data = this.data;
            plot.x.scale.domain([d3.min(data, plot.x.value) - 1, d3.max(data, plot.x.value) + 1]);
            if (this.config.guides) {
                x.axis.tickSize(-plot.height);
            }
        }
    }, {
        key: 'setupY',
        value: function setupY() {

            var plot = this.plot;
            var y = plot.y;
            var conf = this.config.y;

            /*
             * value accessor - returns the value to encode for a given data object.
             * scale - maps value to a visual display encoding, such as a pixel position.
             * map function - maps from data value to display value
             * axis - sets up axis
             */
            y.value = function (d) {
                return conf.value(d, conf.key);
            };
            y.scale = d3.scale[conf.scale]().range([plot.height, 0]);
            y.map = function (d) {
                return y.scale(y.value(d));
            };
            y.axis = d3.svg.axis().scale(y.scale).orient(conf.orient);

            if (this.config.guides) {
                y.axis.tickSize(-plot.width);
            }

            var data = this.data;
            plot.y.scale.domain([d3.min(data, plot.y.value) - 1, d3.max(data, plot.y.value) + 1]);
        }
    }, {
        key: 'draw',
        value: function draw() {
            this.drawAxisX();
            this.drawAxisY();
            this.update();
        }
    }, {
        key: 'drawAxisX',
        value: function drawAxisX() {
            var self = this;
            var plot = self.plot;
            var axisConf = this.config.x;
            self.svgG.append("g").attr("class", "mw-axis-x mw-axis" + (self.config.guides ? '' : ' mw-no-guides')).attr("transform", "translate(0," + plot.height + ")").call(plot.x.axis).append("text").attr("class", "mw-label").attr("transform", "translate(" + plot.width / 2 + "," + self.config.margin.bottom + ")") // text is drawn off the screen top left, move down and out and rotate
            .attr("dy", "-1em").style("text-anchor", "middle").text(axisConf.label);
        }
    }, {
        key: 'drawAxisY',
        value: function drawAxisY() {
            var self = this;
            var plot = self.plot;
            var axisConf = this.config.y;
            self.svgG.append("g").attr("class", "mw-axis mw-axis-y" + (self.config.guides ? '' : ' mw-no-guides')).call(plot.y.axis).append("text").attr("class", "mw-label").attr("transform", "translate(" + -self.config.margin.left + "," + plot.height / 2 + ")rotate(-90)") // text is drawn off the screen top left, move down and out and rotate
            .attr("dy", "1em").style("text-anchor", "middle").text(axisConf.label);
        }
    }, {
        key: 'update',
        value: function update(newData) {
            // D3ChartBase.prototype.update.call(this, newData);
            var self = this;
            var plot = self.plot;
            var data = this.data;
            var dots = self.svgG.selectAll(".mw-dot").data(data);

            dots.enter().append("circle").attr("class", "mw-dot");

            dots.attr("r", self.config.dot.radius).attr("cx", plot.x.map).attr("cy", plot.y.map);

            if (plot.tooltip) {
                dots.on("mouseover", function (d) {
                    plot.tooltip.transition().duration(200).style("opacity", .9);
                    var html = "(" + plot.x.value(d) + ", " + plot.y.value(d) + ")";
                    var group = self.config.groups.value(d, self.config.groups.key);
                    if (group || group === 0) {
                        html += "<br/>";
                        var label = self.config.groups.label;
                        if (label) {
                            html += label + ": ";
                        }
                        html += group;
                    }
                    plot.tooltip.html(html).style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");
                }).on("mouseout", function (d) {
                    plot.tooltip.transition().duration(500).style("opacity", 0);
                });
            }

            if (plot.dot.color) {
                dots.style("fill", plot.dot.color);
            }

            dots.exit().remove();
        }
    }]);

    return ScatterPlot;
}(_chart.Chart);

},{"./chart":8,"./utils":15}],14:[function(require,module,exports){
'use strict';

var su = module.exports.StatisticsUtils = {};
su.sampleCorrelation = require('../bower_components/simple-statistics/src/sample_correlation');

},{"../bower_components/simple-statistics/src/sample_correlation":2}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = exports.Utils = function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    _createClass(Utils, null, [{
        key: 'deepExtend',

        // usage example deepExtend({}, objA, objB); => should work similar to $.extend(true, {}, objA, objB);
        value: function deepExtend(out) {

            var utils = this;
            var emptyOut = {};

            if (!out && arguments.length > 1 && Array.isArray(arguments[1])) {
                out = [];
            }
            out = out || {};

            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                if (!source) continue;

                for (var key in source) {
                    if (!source.hasOwnProperty(key)) {
                        continue;
                    }
                    var isArray = Array.isArray(out[key]);
                    var isObject = utils.isObject(out[key]);
                    var srcObj = utils.isObject(source[key]);

                    if (isObject && !isArray && srcObj) {
                        utils.deepExtend(out[key], source[key]);
                    } else {
                        out[key] = source[key];
                    }
                }
            }

            return out;
        }
    }, {
        key: 'mergeDeep',
        value: function mergeDeep(target, source) {
            var output = Object.assign({}, target);
            if (Utils.isObjectNotArray(target) && Utils.isObjectNotArray(source)) {
                Object.keys(source).forEach(function (key) {
                    if (Utils.isObjectNotArray(source[key])) {
                        if (!(key in target)) Object.assign(output, _defineProperty({}, key, source[key]));else output[key] = Utils.mergeDeep(target[key], source[key]);
                    } else {
                        Object.assign(output, _defineProperty({}, key, source[key]));
                    }
                });
            }
            return output;
        }
    }, {
        key: 'cross',
        value: function cross(a, b) {
            var c = [],
                n = a.length,
                m = b.length,
                i,
                j;
            for (i = -1; ++i < n;) {
                for (j = -1; ++j < m;) {
                    c.push({ x: a[i], i: i, y: b[j], j: j });
                }
            }return c;
        }
    }, {
        key: 'inferVariables',
        value: function inferVariables(data, groupKey, includeGroup) {
            var res = [];
            if (data.length) {
                var d = data[0];
                if (d instanceof Array) {
                    res = d.map(function (v, i) {
                        return i;
                    });
                } else if ((typeof d === 'undefined' ? 'undefined' : _typeof(d)) === 'object') {

                    for (var prop in d) {
                        if (!d.hasOwnProperty(prop)) continue;

                        res.push(prop);
                    }
                }
            }
            if (!includeGroup) {
                var index = res.indexOf(groupKey);
                if (index > -1) {
                    res.splice(index, 1);
                }
            }
            return res;
        }
    }, {
        key: 'isObjectNotArray',
        value: function isObjectNotArray(item) {
            return item && (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && !Array.isArray(item) && item !== null;
        }
    }, {
        key: 'isObject',
        value: function isObject(a) {
            return a !== null && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object';
        }
    }, {
        key: 'isNumber',
        value: function isNumber(a) {
            return !isNaN(a) && typeof a === 'number';
        }
    }, {
        key: 'isFunction',
        value: function isFunction(a) {
            return typeof a === 'function';
        }
    }, {
        key: 'selectOrAppend',
        value: function selectOrAppend(parent, selector, element) {
            var selection = parent.select(selector);
            if (selection.empty()) {
                return parent.append(element || selector);
            }
            return selection;
        }
    }, {
        key: 'linearGradient',
        value: function linearGradient(svg, gradientId, range, x1, y1, x2, y2) {
            var defs = Utils.selectOrAppend(svg, "defs");
            var linearGradient = defs.append("linearGradient").attr("id", gradientId);

            linearGradient.attr("x1", x1 + "%").attr("y1", y1 + "%").attr("x2", x2 + "%").attr("y2", y2 + "%");

            //Append multiple color stops by using D3's data/enter step
            var stops = linearGradient.selectAll("stop").data(range);

            stops.enter().append("stop");

            stops.attr("offset", function (d, i) {
                return i / (range.length - 1);
            }).attr("stop-color", function (d) {
                return d;
            });

            stops.exit().remove();
        }
    }]);

    return Utils;
}();

},{}]},{},[10])(10)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxtZWFuLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc2FtcGxlX2NvcnJlbGF0aW9uLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc2FtcGxlX2NvdmFyaWFuY2UuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfc3RhbmRhcmRfZGV2aWF0aW9uLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc2FtcGxlX3ZhcmlhbmNlLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc3VtLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc3VtX250aF9wb3dlcl9kZXZpYXRpb25zLmpzIiwic3JjXFxjaGFydC5qcyIsInNyY1xcY29ycmVsYXRpb24tbWF0cml4LmpzIiwic3JjXFxpbmRleC5qcyIsInNyY1xcbGVnZW5kLmpzIiwic3JjXFxzY2F0dGVycGxvdC1tYXRyaXguanMiLCJzcmNcXHNjYXR0ZXJwbG90LmpzIiwic3JjXFxzdGF0aXN0aWNzLXV0aWxzLmpzIiwic3JjXFx1dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOzs7QUFHQSxJQUFJLE1BQU0sUUFBUSxPQUFSLENBQVY7Ozs7Ozs7Ozs7Ozs7OztBQWVBLFNBQVMsSUFBVCxDQUFjLEMscUJBQWQsRSxXQUFpRDs7QUFFN0MsUUFBSSxFQUFFLE1BQUYsS0FBYSxDQUFqQixFQUFvQjtBQUFFLGVBQU8sR0FBUDtBQUFhOztBQUVuQyxXQUFPLElBQUksQ0FBSixJQUFTLEVBQUUsTUFBbEI7QUFDSDs7QUFF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QUNBLGdCQUFJLGlCQUFpQixLQUFLLE1BQUwsQ0FBWSxnQkFBWixFQUNoQixJQURnQixDQUNYLElBRFcsRUFDTCxVQURLLENBQXJCOztBQUdBLDJCQUNLLElBREwsQ0FDVSxJQURWLEVBQ2dCLEtBQUcsR0FEbkIsRUFFSyxJQUZMLENBRVUsSUFGVixFQUVnQixLQUFHLEdBRm5CLEVBR0ssSUFITCxDQUdVLElBSFYsRUFHZ0IsS0FBRyxHQUhuQixFQUlLLElBSkwsQ0FJVSxJQUpWLEVBSWdCLEtBQUcsR0FKbkI7OztBQU9BLGdCQUFJLFFBQVEsZUFBZSxTQUFmLENBQXlCLE1BQXpCLEVBQ1AsSUFETyxDQUNELEtBREMsQ0FBWjs7QUFHQSxrQkFBTSxLQUFOLEdBQWMsTUFBZCxDQUFxQixNQUFyQjs7QUFFQSxrQkFBTSxJQUFOLENBQVcsUUFBWCxFQUFxQixVQUFDLENBQUQsRUFBRyxDQUFIO0FBQUEsdUJBQVMsS0FBRyxNQUFNLE1BQU4sR0FBYSxDQUFoQixDQUFUO0FBQUEsYUFBckIsRUFDSyxJQURMLENBQ1UsWUFEVixFQUN3QjtBQUFBLHVCQUFLLENBQUw7QUFBQSxhQUR4Qjs7QUFHQSxrQkFBTSxJQUFOLEdBQWEsTUFBYjtBQUNIIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBzdW0gPSByZXF1aXJlKCcuL3N1bScpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBtZWFuLCBfYWxzbyBrbm93biBhcyBhdmVyYWdlXyxcclxuICogaXMgdGhlIHN1bSBvZiBhbGwgdmFsdWVzIG92ZXIgdGhlIG51bWJlciBvZiB2YWx1ZXMuXHJcbiAqIFRoaXMgaXMgYSBbbWVhc3VyZSBvZiBjZW50cmFsIHRlbmRlbmN5XShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9DZW50cmFsX3RlbmRlbmN5KTpcclxuICogYSBtZXRob2Qgb2YgZmluZGluZyBhIHR5cGljYWwgb3IgY2VudHJhbCB2YWx1ZSBvZiBhIHNldCBvZiBudW1iZXJzLlxyXG4gKlxyXG4gKiBUaGlzIHJ1bnMgb24gYE8obilgLCBsaW5lYXIgdGltZSBpbiByZXNwZWN0IHRvIHRoZSBhcnJheVxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggaW5wdXQgdmFsdWVzXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IG1lYW5cclxuICogQGV4YW1wbGVcclxuICogY29uc29sZS5sb2cobWVhbihbMCwgMTBdKSk7IC8vIDVcclxuICovXHJcbmZ1bmN0aW9uIG1lYW4oeCAvKjogQXJyYXk8bnVtYmVyPiAqLykvKjpudW1iZXIqLyB7XHJcbiAgICAvLyBUaGUgbWVhbiBvZiBubyBudW1iZXJzIGlzIG51bGxcclxuICAgIGlmICh4Lmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gTmFOOyB9XHJcblxyXG4gICAgcmV0dXJuIHN1bSh4KSAvIHgubGVuZ3RoO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1lYW47XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBzYW1wbGVDb3ZhcmlhbmNlID0gcmVxdWlyZSgnLi9zYW1wbGVfY292YXJpYW5jZScpO1xyXG52YXIgc2FtcGxlU3RhbmRhcmREZXZpYXRpb24gPSByZXF1aXJlKCcuL3NhbXBsZV9zdGFuZGFyZF9kZXZpYXRpb24nKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgW2NvcnJlbGF0aW9uXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0NvcnJlbGF0aW9uX2FuZF9kZXBlbmRlbmNlKSBpc1xyXG4gKiBhIG1lYXN1cmUgb2YgaG93IGNvcnJlbGF0ZWQgdHdvIGRhdGFzZXRzIGFyZSwgYmV0d2VlbiAtMSBhbmQgMVxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggZmlyc3QgaW5wdXRcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB5IHNlY29uZCBpbnB1dFxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBzYW1wbGUgY29ycmVsYXRpb25cclxuICogQGV4YW1wbGVcclxuICogdmFyIGEgPSBbMSwgMiwgMywgNCwgNSwgNl07XHJcbiAqIHZhciBiID0gWzIsIDIsIDMsIDQsIDUsIDYwXTtcclxuICogc2FtcGxlQ29ycmVsYXRpb24oYSwgYik7IC8vPSAwLjY5MVxyXG4gKi9cclxuZnVuY3Rpb24gc2FtcGxlQ29ycmVsYXRpb24oeC8qOiBBcnJheTxudW1iZXI+ICovLCB5Lyo6IEFycmF5PG51bWJlcj4gKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgdmFyIGNvdiA9IHNhbXBsZUNvdmFyaWFuY2UoeCwgeSksXHJcbiAgICAgICAgeHN0ZCA9IHNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uKHgpLFxyXG4gICAgICAgIHlzdGQgPSBzYW1wbGVTdGFuZGFyZERldmlhdGlvbih5KTtcclxuXHJcbiAgICByZXR1cm4gY292IC8geHN0ZCAvIHlzdGQ7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2FtcGxlQ29ycmVsYXRpb247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBtZWFuID0gcmVxdWlyZSgnLi9tZWFuJyk7XHJcblxyXG4vKipcclxuICogW1NhbXBsZSBjb3ZhcmlhbmNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TYW1wbGVfbWVhbl9hbmRfc2FtcGxlQ292YXJpYW5jZSkgb2YgdHdvIGRhdGFzZXRzOlxyXG4gKiBob3cgbXVjaCBkbyB0aGUgdHdvIGRhdGFzZXRzIG1vdmUgdG9nZXRoZXI/XHJcbiAqIHggYW5kIHkgYXJlIHR3byBkYXRhc2V0cywgcmVwcmVzZW50ZWQgYXMgYXJyYXlzIG9mIG51bWJlcnMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBmaXJzdCBpbnB1dFxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHkgc2Vjb25kIGlucHV0XHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHNhbXBsZSBjb3ZhcmlhbmNlXHJcbiAqIEBleGFtcGxlXHJcbiAqIHZhciB4ID0gWzEsIDIsIDMsIDQsIDUsIDZdO1xyXG4gKiB2YXIgeSA9IFs2LCA1LCA0LCAzLCAyLCAxXTtcclxuICogc2FtcGxlQ292YXJpYW5jZSh4LCB5KTsgLy89IC0zLjVcclxuICovXHJcbmZ1bmN0aW9uIHNhbXBsZUNvdmFyaWFuY2UoeCAvKjpBcnJheTxudW1iZXI+Ki8sIHkgLyo6QXJyYXk8bnVtYmVyPiovKS8qOm51bWJlciovIHtcclxuXHJcbiAgICAvLyBUaGUgdHdvIGRhdGFzZXRzIG11c3QgaGF2ZSB0aGUgc2FtZSBsZW5ndGggd2hpY2ggbXVzdCBiZSBtb3JlIHRoYW4gMVxyXG4gICAgaWYgKHgubGVuZ3RoIDw9IDEgfHwgeC5sZW5ndGggIT09IHkubGVuZ3RoKSB7XHJcbiAgICAgICAgcmV0dXJuIE5hTjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBkZXRlcm1pbmUgdGhlIG1lYW4gb2YgZWFjaCBkYXRhc2V0IHNvIHRoYXQgd2UgY2FuIGp1ZGdlIGVhY2hcclxuICAgIC8vIHZhbHVlIG9mIHRoZSBkYXRhc2V0IGZhaXJseSBhcyB0aGUgZGlmZmVyZW5jZSBmcm9tIHRoZSBtZWFuLiB0aGlzXHJcbiAgICAvLyB3YXksIGlmIG9uZSBkYXRhc2V0IGlzIFsxLCAyLCAzXSBhbmQgWzIsIDMsIDRdLCB0aGVpciBjb3ZhcmlhbmNlXHJcbiAgICAvLyBkb2VzIG5vdCBzdWZmZXIgYmVjYXVzZSBvZiB0aGUgZGlmZmVyZW5jZSBpbiBhYnNvbHV0ZSB2YWx1ZXNcclxuICAgIHZhciB4bWVhbiA9IG1lYW4oeCksXHJcbiAgICAgICAgeW1lYW4gPSBtZWFuKHkpLFxyXG4gICAgICAgIHN1bSA9IDA7XHJcblxyXG4gICAgLy8gZm9yIGVhY2ggcGFpciBvZiB2YWx1ZXMsIHRoZSBjb3ZhcmlhbmNlIGluY3JlYXNlcyB3aGVuIHRoZWlyXHJcbiAgICAvLyBkaWZmZXJlbmNlIGZyb20gdGhlIG1lYW4gaXMgYXNzb2NpYXRlZCAtIGlmIGJvdGggYXJlIHdlbGwgYWJvdmVcclxuICAgIC8vIG9yIGlmIGJvdGggYXJlIHdlbGwgYmVsb3dcclxuICAgIC8vIHRoZSBtZWFuLCB0aGUgY292YXJpYW5jZSBpbmNyZWFzZXMgc2lnbmlmaWNhbnRseS5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHN1bSArPSAoeFtpXSAtIHhtZWFuKSAqICh5W2ldIC0geW1lYW4pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRoaXMgaXMgQmVzc2VscycgQ29ycmVjdGlvbjogYW4gYWRqdXN0bWVudCBtYWRlIHRvIHNhbXBsZSBzdGF0aXN0aWNzXHJcbiAgICAvLyB0aGF0IGFsbG93cyBmb3IgdGhlIHJlZHVjZWQgZGVncmVlIG9mIGZyZWVkb20gZW50YWlsZWQgaW4gY2FsY3VsYXRpbmdcclxuICAgIC8vIHZhbHVlcyBmcm9tIHNhbXBsZXMgcmF0aGVyIHRoYW4gY29tcGxldGUgcG9wdWxhdGlvbnMuXHJcbiAgICB2YXIgYmVzc2Vsc0NvcnJlY3Rpb24gPSB4Lmxlbmd0aCAtIDE7XHJcblxyXG4gICAgLy8gdGhlIGNvdmFyaWFuY2UgaXMgd2VpZ2h0ZWQgYnkgdGhlIGxlbmd0aCBvZiB0aGUgZGF0YXNldHMuXHJcbiAgICByZXR1cm4gc3VtIC8gYmVzc2Vsc0NvcnJlY3Rpb247XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2FtcGxlQ292YXJpYW5jZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIHNhbXBsZVZhcmlhbmNlID0gcmVxdWlyZSgnLi9zYW1wbGVfdmFyaWFuY2UnKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgW3N0YW5kYXJkIGRldmlhdGlvbl0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TdGFuZGFyZF9kZXZpYXRpb24pXHJcbiAqIGlzIHRoZSBzcXVhcmUgcm9vdCBvZiB0aGUgdmFyaWFuY2UuXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBpbnB1dCBhcnJheVxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBzYW1wbGUgc3RhbmRhcmQgZGV2aWF0aW9uXHJcbiAqIEBleGFtcGxlXHJcbiAqIHNzLnNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uKFsyLCA0LCA0LCA0LCA1LCA1LCA3LCA5XSk7XHJcbiAqIC8vPSAyLjEzOFxyXG4gKi9cclxuZnVuY3Rpb24gc2FtcGxlU3RhbmRhcmREZXZpYXRpb24oeC8qOkFycmF5PG51bWJlcj4qLykvKjpudW1iZXIqLyB7XHJcbiAgICAvLyBUaGUgc3RhbmRhcmQgZGV2aWF0aW9uIG9mIG5vIG51bWJlcnMgaXMgbnVsbFxyXG4gICAgdmFyIHNhbXBsZVZhcmlhbmNlWCA9IHNhbXBsZVZhcmlhbmNlKHgpO1xyXG4gICAgaWYgKGlzTmFOKHNhbXBsZVZhcmlhbmNlWCkpIHsgcmV0dXJuIE5hTjsgfVxyXG4gICAgcmV0dXJuIE1hdGguc3FydChzYW1wbGVWYXJpYW5jZVgpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgc3VtTnRoUG93ZXJEZXZpYXRpb25zID0gcmVxdWlyZSgnLi9zdW1fbnRoX3Bvd2VyX2RldmlhdGlvbnMnKTtcclxuXHJcbi8qXHJcbiAqIFRoZSBbc2FtcGxlIHZhcmlhbmNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9WYXJpYW5jZSNTYW1wbGVfdmFyaWFuY2UpXHJcbiAqIGlzIHRoZSBzdW0gb2Ygc3F1YXJlZCBkZXZpYXRpb25zIGZyb20gdGhlIG1lYW4uIFRoZSBzYW1wbGUgdmFyaWFuY2VcclxuICogaXMgZGlzdGluZ3Vpc2hlZCBmcm9tIHRoZSB2YXJpYW5jZSBieSB0aGUgdXNhZ2Ugb2YgW0Jlc3NlbCdzIENvcnJlY3Rpb25dKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Jlc3NlbCdzX2NvcnJlY3Rpb24pOlxyXG4gKiBpbnN0ZWFkIG9mIGRpdmlkaW5nIHRoZSBzdW0gb2Ygc3F1YXJlZCBkZXZpYXRpb25zIGJ5IHRoZSBsZW5ndGggb2YgdGhlIGlucHV0LFxyXG4gKiBpdCBpcyBkaXZpZGVkIGJ5IHRoZSBsZW5ndGggbWludXMgb25lLiBUaGlzIGNvcnJlY3RzIHRoZSBiaWFzIGluIGVzdGltYXRpbmdcclxuICogYSB2YWx1ZSBmcm9tIGEgc2V0IHRoYXQgeW91IGRvbid0IGtub3cgaWYgZnVsbC5cclxuICpcclxuICogUmVmZXJlbmNlczpcclxuICogKiBbV29sZnJhbSBNYXRoV29ybGQgb24gU2FtcGxlIFZhcmlhbmNlXShodHRwOi8vbWF0aHdvcmxkLndvbGZyYW0uY29tL1NhbXBsZVZhcmlhbmNlLmh0bWwpXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBpbnB1dCBhcnJheVxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IHNhbXBsZSB2YXJpYW5jZVxyXG4gKiBAZXhhbXBsZVxyXG4gKiBzYW1wbGVWYXJpYW5jZShbMSwgMiwgMywgNCwgNV0pOyAvLz0gMi41XHJcbiAqL1xyXG5mdW5jdGlvbiBzYW1wbGVWYXJpYW5jZSh4IC8qOiBBcnJheTxudW1iZXI+ICovKS8qOm51bWJlciovIHtcclxuICAgIC8vIFRoZSB2YXJpYW5jZSBvZiBubyBudW1iZXJzIGlzIG51bGxcclxuICAgIGlmICh4Lmxlbmd0aCA8PSAxKSB7IHJldHVybiBOYU47IH1cclxuXHJcbiAgICB2YXIgc3VtU3F1YXJlZERldmlhdGlvbnNWYWx1ZSA9IHN1bU50aFBvd2VyRGV2aWF0aW9ucyh4LCAyKTtcclxuXHJcbiAgICAvLyB0aGlzIGlzIEJlc3NlbHMnIENvcnJlY3Rpb246IGFuIGFkanVzdG1lbnQgbWFkZSB0byBzYW1wbGUgc3RhdGlzdGljc1xyXG4gICAgLy8gdGhhdCBhbGxvd3MgZm9yIHRoZSByZWR1Y2VkIGRlZ3JlZSBvZiBmcmVlZG9tIGVudGFpbGVkIGluIGNhbGN1bGF0aW5nXHJcbiAgICAvLyB2YWx1ZXMgZnJvbSBzYW1wbGVzIHJhdGhlciB0aGFuIGNvbXBsZXRlIHBvcHVsYXRpb25zLlxyXG4gICAgdmFyIGJlc3NlbHNDb3JyZWN0aW9uID0geC5sZW5ndGggLSAxO1xyXG5cclxuICAgIC8vIEZpbmQgdGhlIG1lYW4gdmFsdWUgb2YgdGhhdCBsaXN0XHJcbiAgICByZXR1cm4gc3VtU3F1YXJlZERldmlhdGlvbnNWYWx1ZSAvIGJlc3NlbHNDb3JyZWN0aW9uO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNhbXBsZVZhcmlhbmNlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG4vKipcclxuICogT3VyIGRlZmF1bHQgc3VtIGlzIHRoZSBbS2FoYW4gc3VtbWF0aW9uIGFsZ29yaXRobV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvS2FoYW5fc3VtbWF0aW9uX2FsZ29yaXRobSkgaXNcclxuICogYSBtZXRob2QgZm9yIGNvbXB1dGluZyB0aGUgc3VtIG9mIGEgbGlzdCBvZiBudW1iZXJzIHdoaWxlIGNvcnJlY3RpbmdcclxuICogZm9yIGZsb2F0aW5nLXBvaW50IGVycm9ycy4gVHJhZGl0aW9uYWxseSwgc3VtcyBhcmUgY2FsY3VsYXRlZCBhcyBtYW55XHJcbiAqIHN1Y2Nlc3NpdmUgYWRkaXRpb25zLCBlYWNoIG9uZSB3aXRoIGl0cyBvd24gZmxvYXRpbmctcG9pbnQgcm91bmRvZmYuIFRoZXNlXHJcbiAqIGxvc3NlcyBpbiBwcmVjaXNpb24gYWRkIHVwIGFzIHRoZSBudW1iZXIgb2YgbnVtYmVycyBpbmNyZWFzZXMuIFRoaXMgYWx0ZXJuYXRpdmVcclxuICogYWxnb3JpdGhtIGlzIG1vcmUgYWNjdXJhdGUgdGhhbiB0aGUgc2ltcGxlIHdheSBvZiBjYWxjdWxhdGluZyBzdW1zIGJ5IHNpbXBsZVxyXG4gKiBhZGRpdGlvbi5cclxuICpcclxuICogVGhpcyBydW5zIG9uIGBPKG4pYCwgbGluZWFyIHRpbWUgaW4gcmVzcGVjdCB0byB0aGUgYXJyYXlcclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGlucHV0XHJcbiAqIEByZXR1cm4ge251bWJlcn0gc3VtIG9mIGFsbCBpbnB1dCBudW1iZXJzXHJcbiAqIEBleGFtcGxlXHJcbiAqIGNvbnNvbGUubG9nKHN1bShbMSwgMiwgM10pKTsgLy8gNlxyXG4gKi9cclxuZnVuY3Rpb24gc3VtKHgvKjogQXJyYXk8bnVtYmVyPiAqLykvKjogbnVtYmVyICovIHtcclxuXHJcbiAgICAvLyBsaWtlIHRoZSB0cmFkaXRpb25hbCBzdW0gYWxnb3JpdGhtLCB3ZSBrZWVwIGEgcnVubmluZ1xyXG4gICAgLy8gY291bnQgb2YgdGhlIGN1cnJlbnQgc3VtLlxyXG4gICAgdmFyIHN1bSA9IDA7XHJcblxyXG4gICAgLy8gYnV0IHdlIGFsc28ga2VlcCB0aHJlZSBleHRyYSB2YXJpYWJsZXMgYXMgYm9va2tlZXBpbmc6XHJcbiAgICAvLyBtb3N0IGltcG9ydGFudGx5LCBhbiBlcnJvciBjb3JyZWN0aW9uIHZhbHVlLiBUaGlzIHdpbGwgYmUgYSB2ZXJ5XHJcbiAgICAvLyBzbWFsbCBudW1iZXIgdGhhdCBpcyB0aGUgb3Bwb3NpdGUgb2YgdGhlIGZsb2F0aW5nIHBvaW50IHByZWNpc2lvbiBsb3NzLlxyXG4gICAgdmFyIGVycm9yQ29tcGVuc2F0aW9uID0gMDtcclxuXHJcbiAgICAvLyB0aGlzIHdpbGwgYmUgZWFjaCBudW1iZXIgaW4gdGhlIGxpc3QgY29ycmVjdGVkIHdpdGggdGhlIGNvbXBlbnNhdGlvbiB2YWx1ZS5cclxuICAgIHZhciBjb3JyZWN0ZWRDdXJyZW50VmFsdWU7XHJcblxyXG4gICAgLy8gYW5kIHRoaXMgd2lsbCBiZSB0aGUgbmV4dCBzdW1cclxuICAgIHZhciBuZXh0U3VtO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIC8vIGZpcnN0IGNvcnJlY3QgdGhlIHZhbHVlIHRoYXQgd2UncmUgZ29pbmcgdG8gYWRkIHRvIHRoZSBzdW1cclxuICAgICAgICBjb3JyZWN0ZWRDdXJyZW50VmFsdWUgPSB4W2ldIC0gZXJyb3JDb21wZW5zYXRpb247XHJcblxyXG4gICAgICAgIC8vIGNvbXB1dGUgdGhlIG5leHQgc3VtLiBzdW0gaXMgbGlrZWx5IGEgbXVjaCBsYXJnZXIgbnVtYmVyXHJcbiAgICAgICAgLy8gdGhhbiBjb3JyZWN0ZWRDdXJyZW50VmFsdWUsIHNvIHdlJ2xsIGxvc2UgcHJlY2lzaW9uIGhlcmUsXHJcbiAgICAgICAgLy8gYW5kIG1lYXN1cmUgaG93IG11Y2ggcHJlY2lzaW9uIGlzIGxvc3QgaW4gdGhlIG5leHQgc3RlcFxyXG4gICAgICAgIG5leHRTdW0gPSBzdW0gKyBjb3JyZWN0ZWRDdXJyZW50VmFsdWU7XHJcblxyXG4gICAgICAgIC8vIHdlIGludGVudGlvbmFsbHkgZGlkbid0IGFzc2lnbiBzdW0gaW1tZWRpYXRlbHksIGJ1dCBzdG9yZWRcclxuICAgICAgICAvLyBpdCBmb3Igbm93IHNvIHdlIGNhbiBmaWd1cmUgb3V0IHRoaXM6IGlzIChzdW0gKyBuZXh0VmFsdWUpIC0gbmV4dFZhbHVlXHJcbiAgICAgICAgLy8gbm90IGVxdWFsIHRvIDA/IGlkZWFsbHkgaXQgd291bGQgYmUsIGJ1dCBpbiBwcmFjdGljZSBpdCB3b24ndDpcclxuICAgICAgICAvLyBpdCB3aWxsIGJlIHNvbWUgdmVyeSBzbWFsbCBudW1iZXIuIHRoYXQncyB3aGF0IHdlIHJlY29yZFxyXG4gICAgICAgIC8vIGFzIGVycm9yQ29tcGVuc2F0aW9uLlxyXG4gICAgICAgIGVycm9yQ29tcGVuc2F0aW9uID0gbmV4dFN1bSAtIHN1bSAtIGNvcnJlY3RlZEN1cnJlbnRWYWx1ZTtcclxuXHJcbiAgICAgICAgLy8gbm93IHRoYXQgd2UndmUgY29tcHV0ZWQgaG93IG11Y2ggd2UnbGwgY29ycmVjdCBmb3IgaW4gdGhlIG5leHRcclxuICAgICAgICAvLyBsb29wLCBzdGFydCB0cmVhdGluZyB0aGUgbmV4dFN1bSBhcyB0aGUgY3VycmVudCBzdW0uXHJcbiAgICAgICAgc3VtID0gbmV4dFN1bTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc3VtO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHN1bTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIG1lYW4gPSByZXF1aXJlKCcuL21lYW4nKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgc3VtIG9mIGRldmlhdGlvbnMgdG8gdGhlIE50aCBwb3dlci5cclxuICogV2hlbiBuPTIgaXQncyB0aGUgc3VtIG9mIHNxdWFyZWQgZGV2aWF0aW9ucy5cclxuICogV2hlbiBuPTMgaXQncyB0aGUgc3VtIG9mIGN1YmVkIGRldmlhdGlvbnMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbiBwb3dlclxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBzdW0gb2YgbnRoIHBvd2VyIGRldmlhdGlvbnNcclxuICogQGV4YW1wbGVcclxuICogdmFyIGlucHV0ID0gWzEsIDIsIDNdO1xyXG4gKiAvLyBzaW5jZSB0aGUgdmFyaWFuY2Ugb2YgYSBzZXQgaXMgdGhlIG1lYW4gc3F1YXJlZFxyXG4gKiAvLyBkZXZpYXRpb25zLCB3ZSBjYW4gY2FsY3VsYXRlIHRoYXQgd2l0aCBzdW1OdGhQb3dlckRldmlhdGlvbnM6XHJcbiAqIHZhciB2YXJpYW5jZSA9IHN1bU50aFBvd2VyRGV2aWF0aW9ucyhpbnB1dCkgLyBpbnB1dC5sZW5ndGg7XHJcbiAqL1xyXG5mdW5jdGlvbiBzdW1OdGhQb3dlckRldmlhdGlvbnMoeC8qOiBBcnJheTxudW1iZXI+ICovLCBuLyo6IG51bWJlciAqLykvKjpudW1iZXIqLyB7XHJcbiAgICB2YXIgbWVhblZhbHVlID0gbWVhbih4KSxcclxuICAgICAgICBzdW0gPSAwO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHN1bSArPSBNYXRoLnBvdyh4W2ldIC0gbWVhblZhbHVlLCBuKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc3VtO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHN1bU50aFBvd2VyRGV2aWF0aW9ucztcclxuIiwiaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuXHJcbmV4cG9ydCBjbGFzcyBDaGFydENvbmZpZ3tcclxuICAgIGNzc0NsYXNzUHJlZml4ID0gXCJvZGMtXCI7XHJcbiAgICBzdmdDbGFzcyA9IHRoaXMuY3NzQ2xhc3NQcmVmaXgrJ213LWQzLWNoYXJ0JztcclxuICAgIHdpZHRoID0gdW5kZWZpbmVkO1xyXG4gICAgaGVpZ2h0ID0gIHVuZGVmaW5lZDtcclxuICAgIG1hcmdpbiA9e1xyXG4gICAgICAgIGxlZnQ6IDUwLFxyXG4gICAgICAgIHJpZ2h0OiAzMCxcclxuICAgICAgICB0b3A6IDMwLFxyXG4gICAgICAgIGJvdHRvbTogNTBcclxuICAgIH07XHJcbiAgICB0b29sdGlwID0gZmFsc2U7XHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIGlmKGN1c3RvbSl7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJ0e1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcblxyXG4gICAgICAgIHRoaXMudXRpbHMgPSBVdGlscztcclxuICAgICAgICB0aGlzLnBsYWNlaG9sZGVyU2VsZWN0b3IgPSBwbGFjZWhvbGRlclNlbGVjdG9yO1xyXG4gICAgICAgIHRoaXMuc3ZnPW51bGw7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5wbG90PXtcclxuICAgICAgICAgICAgbWFyZ2luOnt9XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2V0Q29uZmlnKGNvbmZpZyk7XHJcblxyXG4gICAgICAgIGlmKGRhdGEpe1xyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKXtcclxuICAgICAgICBpZighY29uZmlnKXtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBuZXcgQ2hhcnRDb25maWcoKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRhKGRhdGEpe1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmluaXRQbG90KCk7XHJcbiAgICAgICAgc2VsZi5pbml0U3ZnKCk7XHJcbiAgICAgICAgc2VsZi5kcmF3KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFN2Zygpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgY29uZmlnID0gdGhpcy5jb25maWc7XHJcbiAgICAgICAgY29uc29sZS5sb2coY29uZmlnLnN2Z0NsYXNzKTtcclxuXHJcbiAgICAgICAgdmFyIHdpZHRoID0gc2VsZi5wbG90LndpZHRoKyBjb25maWcubWFyZ2luLmxlZnQgKyBjb25maWcubWFyZ2luLnJpZ2h0O1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSAgc2VsZi5wbG90LmhlaWdodCsgY29uZmlnLm1hcmdpbi50b3AgKyBjb25maWcubWFyZ2luLmJvdHRvbTtcclxuICAgICAgICB2YXIgYXNwZWN0ID0gd2lkdGggLyBoZWlnaHQ7XHJcblxyXG4gICAgICAgIHNlbGYuc3ZnID0gZDMuc2VsZWN0KHNlbGYucGxhY2Vob2xkZXJTZWxlY3Rvcikuc2VsZWN0KFwic3ZnXCIpO1xyXG4gICAgICAgIGlmKCFzZWxmLnN2Zy5lbXB0eSgpKXtcclxuICAgICAgICAgICAgc2VsZi5zdmcucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBzZWxmLnN2ZyA9IGQzLnNlbGVjdChzZWxmLnBsYWNlaG9sZGVyU2VsZWN0b3IpLmFwcGVuZChcInN2Z1wiKTtcclxuXHJcbiAgICAgICAgc2VsZi5zdmdcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcInZpZXdCb3hcIiwgXCIwIDAgXCIrXCIgXCIrd2lkdGgrXCIgXCIraGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcInByZXNlcnZlQXNwZWN0UmF0aW9cIiwgXCJ4TWlkWU1pZCBtZWV0XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgY29uZmlnLnN2Z0NsYXNzKTtcclxuICAgICAgICBzZWxmLnN2Z0cgPSBzZWxmLnN2Zy5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgY29uZmlnLm1hcmdpbi5sZWZ0ICsgXCIsXCIgKyBjb25maWcubWFyZ2luLnRvcCArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgaWYoY29uZmlnLnRvb2x0aXApe1xyXG4gICAgICAgICAgICBzZWxmLnBsb3QudG9vbHRpcCA9IHRoaXMudXRpbHMuc2VsZWN0T3JBcHBlbmQoZDMuc2VsZWN0KHNlbGYucGxhY2Vob2xkZXJTZWxlY3RvciksICdkaXYubXctdG9vbHRpcCcsICdkaXYnKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm13LXRvb2x0aXBcIilcclxuICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZighY29uZmlnLndpZHRoIHx8IGNvbmZpZy5oZWlnaHQgKXtcclxuICAgICAgICAgICAgZDMuc2VsZWN0KHdpbmRvdylcclxuICAgICAgICAgICAgICAgIC5vbihcInJlc2l6ZVwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL1RPRE8gYWRkIHJlc3BvbnNpdmVuZXNzIGlmIHdpZHRoL2hlaWdodCBub3Qgc3BlY2lmaWVkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKXtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRhdGEpe1xyXG4gICAgICAgIGlmKGRhdGEpe1xyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdiYXNlIHVwcGRhdGUnKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBkcmF3KCl7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NoYXJ0LCBDaGFydENvbmZpZ30gZnJvbSBcIi4vY2hhcnRcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IHtTdGF0aXN0aWNzVXRpbHN9IGZyb20gJy4vc3RhdGlzdGljcy11dGlscydcclxuaW1wb3J0IHtMZWdlbmR9IGZyb20gJy4vbGVnZW5kJ1xyXG5cclxuZXhwb3J0IGNsYXNzIENvcnJlbGF0aW9uTWF0cml4Q29uZmlnIGV4dGVuZHMgQ2hhcnRDb25maWd7XHJcblxyXG4gICAgc3ZnQ2xhc3M9ICdvZGMtY29ycmVsYXRpb24tbWF0cml4JztcclxuICAgIGd1aWRlcz0gZmFsc2U7IC8vc2hvdyBheGlzIGd1aWRlc1xyXG4gICAgdG9vbHRpcD0gdHJ1ZTsgLy9zaG93IHRvb2x0aXAgb24gZG90IGhvdmVyXHJcbiAgICBsZWdlbmQ9dHJ1ZTtcclxuICAgIGhpZ2hsaWdodExhYmVscz10cnVlO1xyXG4gICAgdmFyaWFibGVzPXtcclxuICAgICAgICBsYWJlbHM6IHVuZGVmaW5lZCxcclxuICAgICAgICBrZXlzOiBbXSwgLy9vcHRpb25hbCBhcnJheSBvZiB2YXJpYWJsZSBrZXlzXHJcbiAgICAgICAgdmFsdWU6IChkLCB2YXJpYWJsZUtleSkgPT4gZFt2YXJpYWJsZUtleV0gLCAvLyB2YXJpYWJsZSB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgIHNjYWxlOiBcIm9yZGluYWxcIlxyXG4gICAgfTtcclxuICAgIGNvcnJlbGF0aW9uPXtcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIixcclxuICAgICAgICBkb21haW46IFstMSwgLTAuNzUsIC0wLjUsIDAsIDAuNSwgMC43NSwgMV0sXHJcbiAgICAgICAgcmFuZ2U6IFtcImRhcmtibHVlXCIsIFwiYmx1ZVwiLCBcImxpZ2h0c2t5Ymx1ZVwiLCBcIndoaXRlXCIsICBcIm9yYW5nZXJlZFwiLCBcImNyaW1zb25cIiwgXCJkYXJrcmVkXCJdLFxyXG4gICAgICAgIHZhbHVlOiAoeFZhbHVlcywgeVZhbHVlcykgPT4gU3RhdGlzdGljc1V0aWxzLnNhbXBsZUNvcnJlbGF0aW9uKHhWYWx1ZXMsIHlWYWx1ZXMpXHJcblxyXG4gICAgfTtcclxuICAgIGNlbGw9e1xyXG4gICAgICAgIHNoYXBlOiBcImVsbGlwc2VcIiwgLy9wb3NzaWJsZSB2YWx1ZXM6IHJlY3QsIGNpcmNsZSwgZWxsaXBzZVxyXG4gICAgICAgIHNpemU6IHVuZGVmaW5lZCxcclxuICAgICAgICBzaXplTWluOiA1LFxyXG4gICAgICAgIHNpemVNYXg6IDgwLFxyXG4gICAgICAgIHBhZGRpbmc6IDFcclxuICAgIH07XHJcbiAgICBtYXJnaW4gPXtcclxuICAgICAgICBsZWZ0OiA2MCxcclxuICAgICAgICByaWdodDogNTAsXHJcbiAgICAgICAgdG9wOiAzMCxcclxuICAgICAgICBib3R0b206IDYwXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBpZihjdXN0b20pe1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ29ycmVsYXRpb25NYXRyaXggZXh0ZW5kcyBDaGFydHtcclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIG5ldyBDb3JyZWxhdGlvbk1hdHJpeENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKXtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBDb3JyZWxhdGlvbk1hdHJpeENvbmZpZyhjb25maWcpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKXtcclxuICAgICAgICB2YXIgc2VsZj10aGlzO1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSB0aGlzLmNvbmZpZy5tYXJnaW47XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICB0aGlzLnBsb3Q9e1xyXG4gICAgICAgICAgICB4OiB7fSxcclxuICAgICAgICAgICAgY29ycmVsYXRpb246e1xyXG4gICAgICAgICAgICAgICAgbWF0cml4OiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBjZWxsczogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgY29sb3I6IHt9LFxyXG4gICAgICAgICAgICAgICAgc2hhcGU6e31cclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnNldHVwVmFyaWFibGVzKCk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gY29uZi53aWR0aDtcclxuICAgICAgICB2YXIgcGxhY2Vob2xkZXJOb2RlID0gZDMuc2VsZWN0KHRoaXMucGxhY2Vob2xkZXJTZWxlY3Rvcikubm9kZSgpO1xyXG4gICAgICAgIHRoaXMucGxvdC5wbGFjZWhvbGRlck5vZGU9cGxhY2Vob2xkZXJOb2RlO1xyXG5cclxuICAgICAgICB2YXIgcGFyZW50V2lkdGggPSBwbGFjZWhvbGRlck5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XHJcbiAgICAgICAgaWYod2lkdGgpe1xyXG5cclxuICAgICAgICAgICAgaWYoIXRoaXMucGxvdC5jZWxsU2l6ZSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuY2VsbFNpemUgPSBNYXRoLm1heChjb25mLmNlbGwuc2l6ZU1pbixNYXRoLm1pbihjb25mLmNlbGwuc2l6ZU1heCwgKHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQpL3RoaXMucGxvdC52YXJpYWJsZXMubGVuZ3RoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsU2l6ZSA9IHRoaXMuY29uZmlnLmNlbGwuc2l6ZTtcclxuXHJcbiAgICAgICAgICAgIGlmKCF0aGlzLnBsb3QuY2VsbFNpemUpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxTaXplID0gTWF0aC5tYXgoY29uZi5jZWxsLnNpemVNaW4sTWF0aC5taW4oY29uZi5jZWxsLnNpemVNYXgsIHBhcmVudFdpZHRoL3RoaXMucGxvdC52YXJpYWJsZXMubGVuZ3RoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHdpZHRoID0gdGhpcy5wbG90LmNlbGxTaXplKnRoaXMucGxvdC52YXJpYWJsZXMubGVuZ3RoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQ7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gd2lkdGg7XHJcbiAgICAgICAgaWYoIWhlaWdodCl7XHJcbiAgICAgICAgICAgIGhlaWdodCA9cGxhY2Vob2xkZXJOb2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC53aWR0aCA9IHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XHJcbiAgICAgICAgdGhpcy5wbG90LmhlaWdodCA9IHRoaXMucGxvdC53aWR0aDtcclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBWYXJpYWJsZXNTY2FsZXMoKTtcclxuICAgICAgICB0aGlzLnNldHVwQ29ycmVsYXRpb25TY2FsZXMoKTtcclxuICAgICAgICB0aGlzLnNldHVwQ29ycmVsYXRpb25NYXRyaXgoKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwVmFyaWFibGVzU2NhbGVzKCl7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB4ID0gcGxvdC54O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWcudmFyaWFibGVzO1xyXG5cclxuICAgICAgICAvKiAqXHJcbiAgICAgICAgICogdmFsdWUgYWNjZXNzb3IgLSByZXR1cm5zIHRoZSB2YWx1ZSB0byBlbmNvZGUgZm9yIGEgZ2l2ZW4gZGF0YSBvYmplY3QuXHJcbiAgICAgICAgICogc2NhbGUgLSBtYXBzIHZhbHVlIHRvIGEgdmlzdWFsIGRpc3BsYXkgZW5jb2RpbmcsIHN1Y2ggYXMgYSBwaXhlbCBwb3NpdGlvbi5cclxuICAgICAgICAgKiBtYXAgZnVuY3Rpb24gLSBtYXBzIGZyb20gZGF0YSB2YWx1ZSB0byBkaXNwbGF5IHZhbHVlXHJcbiAgICAgICAgICogYXhpcyAtIHNldHMgdXAgYXhpc1xyXG4gICAgICAgICAqKi9cclxuICAgICAgICB4LnZhbHVlID0gY29uZi52YWx1ZTtcclxuICAgICAgICB4LnNjYWxlID0gZDMuc2NhbGVbY29uZi5zY2FsZV0oKS5yYW5nZUJhbmRzKFtwbG90LndpZHRoLCAwXSk7XHJcbiAgICAgICAgeC5tYXAgPSBkID0+IHguc2NhbGUoeC52YWx1ZShkKSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cENvcnJlbGF0aW9uU2NhbGVzKCl7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIGNvcnJDb25mID0gdGhpcy5jb25maWcuY29ycmVsYXRpb247XHJcblxyXG4gICAgICAgIHBsb3QuY29ycmVsYXRpb24uY29sb3Iuc2NhbGUgPSBkMy5zY2FsZVtjb3JyQ29uZi5zY2FsZV0oKS5kb21haW4oY29yckNvbmYuZG9tYWluKS5yYW5nZShjb3JyQ29uZi5yYW5nZSk7XHJcbiAgICAgICAgdmFyIHNoYXBlID0gcGxvdC5jb3JyZWxhdGlvbi5zaGFwZSA9e307XHJcblxyXG4gICAgICAgIHZhciBjZWxsQ29uZiA9IHRoaXMuY29uZmlnLmNlbGw7XHJcbiAgICAgICAgc2hhcGUudHlwZSA9IGNlbGxDb25mLnNoYXBlO1xyXG5cclxuICAgICAgICB2YXIgc2hhcGVTaXplID0gcGxvdC5jZWxsU2l6ZSAtIGNlbGxDb25mLnBhZGRpbmcqMjtcclxuICAgICAgICBpZihzaGFwZS50eXBlID09ICdjaXJjbGUnKXtcclxuICAgICAgICAgICAgdmFyIHJhZGl1c01heCA9IHNoYXBlU2l6ZS8yO1xyXG4gICAgICAgICAgICBzaGFwZS5yYWRpdXNTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgMV0pLnJhbmdlKFsyLCByYWRpdXNNYXhdKTtcclxuICAgICAgICAgICAgc2hhcGUucmFkaXVzID0gYz0+IHNoYXBlLnJhZGl1c1NjYWxlKE1hdGguYWJzKGMudmFsdWUpKTtcclxuICAgICAgICB9ZWxzZSBpZihzaGFwZS50eXBlID09ICdlbGxpcHNlJyl7XHJcbiAgICAgICAgICAgIHZhciByYWRpdXNNYXggPSBzaGFwZVNpemUvMjtcclxuICAgICAgICAgICAgc2hhcGUucmFkaXVzU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzAsIDFdKS5yYW5nZShbcmFkaXVzTWF4LCAyXSk7XHJcbiAgICAgICAgICAgIHNoYXBlLnJhZGl1c1ggPSBjPT4gc2hhcGUucmFkaXVzU2NhbGUoTWF0aC5hYnMoYy52YWx1ZSkpO1xyXG4gICAgICAgICAgICBzaGFwZS5yYWRpdXNZID0gcmFkaXVzTWF4O1xyXG5cclxuICAgICAgICAgICAgc2hhcGUucm90YXRlVmFsID0gdiA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZih2PT0wKSByZXR1cm4gXCIwXCI7XHJcbiAgICAgICAgICAgICAgICBpZih2PDApIHJldHVybiBcIi00NVwiO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiNDVcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfWVsc2UgaWYoc2hhcGUudHlwZSA9PSAncmVjdCcpe1xyXG4gICAgICAgICAgICBzaGFwZS5zaXplID0gc2hhcGVTaXplO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcblxyXG4gICAgc2V0dXBWYXJpYWJsZXMoKXtcclxuXHJcbiAgICAgICAgdmFyIHZhcmlhYmxlc0NvbmYgPSB0aGlzLmNvbmZpZy52YXJpYWJsZXM7XHJcblxyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHBsb3QuZG9tYWluQnlWYXJpYWJsZSA9IHt9O1xyXG4gICAgICAgIHBsb3QudmFyaWFibGVzID0gdmFyaWFibGVzQ29uZi5rZXlzO1xyXG4gICAgICAgIGlmKCFwbG90LnZhcmlhYmxlcyB8fCAhcGxvdC52YXJpYWJsZXMubGVuZ3RoKXtcclxuICAgICAgICAgICAgcGxvdC52YXJpYWJsZXMgPSBVdGlscy5pbmZlclZhcmlhYmxlcyhkYXRhLCB0aGlzLmNvbmZpZy5ncm91cHMua2V5LCB0aGlzLmNvbmZpZy5pbmNsdWRlSW5QbG90KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBsb3QubGFiZWxzID0gW107XHJcbiAgICAgICAgcGxvdC5sYWJlbEJ5VmFyaWFibGUgPSB7fTtcclxuICAgICAgICBwbG90LnZhcmlhYmxlcy5mb3JFYWNoKCh2YXJpYWJsZUtleSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgcGxvdC5kb21haW5CeVZhcmlhYmxlW3ZhcmlhYmxlS2V5XSA9IGQzLmV4dGVudChkYXRhLCBmdW5jdGlvbihkKSB7IHJldHVybiB2YXJpYWJsZXNDb25mLnZhbHVlKGQsIHZhcmlhYmxlS2V5KSB9KTtcclxuICAgICAgICAgICAgdmFyIGxhYmVsID0gdmFyaWFibGVLZXk7XHJcbiAgICAgICAgICAgIGlmKHZhcmlhYmxlc0NvbmYubGFiZWxzICYmIHZhcmlhYmxlc0NvbmYubGFiZWxzLmxlbmd0aD5pbmRleCl7XHJcblxyXG4gICAgICAgICAgICAgICAgbGFiZWwgPSB2YXJpYWJsZXNDb25mLmxhYmVsc1tpbmRleF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGxvdC5sYWJlbHMucHVzaChsYWJlbCk7XHJcbiAgICAgICAgICAgIHBsb3QubGFiZWxCeVZhcmlhYmxlW3ZhcmlhYmxlS2V5XSA9IGxhYmVsO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhwbG90LmxhYmVsQnlWYXJpYWJsZSk7XHJcblxyXG4gICAgfTtcclxuXHJcblxyXG5cclxuICAgIHNldHVwQ29ycmVsYXRpb25NYXRyaXgoKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgdmFyIG1hdHJpeCA9IHRoaXMucGxvdC5jb3JyZWxhdGlvbi5tYXRyaXggPSBbXTtcclxuICAgICAgICB2YXIgbWF0cml4Q2VsbHMgPSB0aGlzLnBsb3QuY29ycmVsYXRpb24ubWF0cml4LmNlbGxzID0gW107XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcblxyXG4gICAgICAgIHZhciB2YXJpYWJsZVRvVmFsdWVzPSB7fTtcclxuICAgICAgICBwbG90LnZhcmlhYmxlcy5mb3JFYWNoKCh2LCBpKSA9PiB7XHJcblxyXG4gICAgICAgICAgICB2YXJpYWJsZVRvVmFsdWVzW3ZdID0gZGF0YS5tYXAoZD0+cGxvdC54LnZhbHVlKGQsdikpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBwbG90LnZhcmlhYmxlcy5mb3JFYWNoKCh2MSwgaSkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgcm93ID0gW107XHJcbiAgICAgICAgICAgIG1hdHJpeC5wdXNoKHJvdyk7XHJcblxyXG4gICAgICAgICAgICBwbG90LnZhcmlhYmxlcy5mb3JFYWNoKCh2MiwgaikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvcnIgPSAxO1xyXG4gICAgICAgICAgICAgICAgaWYodjEhPXYyKXtcclxuICAgICAgICAgICAgICAgICAgICBjb3JyID0gc2VsZi5jb25maWcuY29ycmVsYXRpb24udmFsdWUodmFyaWFibGVUb1ZhbHVlc1t2MV0sIHZhcmlhYmxlVG9WYWx1ZXNbdjJdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBjZWxsID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvd1ZhcjogdjEsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sVmFyOiB2MixcclxuICAgICAgICAgICAgICAgICAgICByb3c6IGksXHJcbiAgICAgICAgICAgICAgICAgICAgY29sOiBqLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjb3JyXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcm93LnB1c2goY2VsbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbWF0cml4Q2VsbHMucHVzaChjZWxsKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB1cGRhdGUobmV3RGF0YSl7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKG5ld0RhdGEpO1xyXG4gICAgICAgIC8vIHRoaXMudXBkYXRlXHJcbiAgICAgICAgdGhpcy51cGRhdGVDZWxscygpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmFyaWFibGVMYWJlbHMoKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5jb25maWcubGVnZW5kKXtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVMZWdlbmQoKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHVwZGF0ZVZhcmlhYmxlTGFiZWxzKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgbGFiZWxDbGFzcyA9IHNlbGYuY29uZmlnLmNzc0NsYXNzUHJlZml4K1wibGFiZWxcIjtcclxuICAgICAgICB2YXIgbGFiZWxYQ2xhc3MgPSBsYWJlbENsYXNzK1wiIFwiK2xhYmVsQ2xhc3MrXCIteFwiO1xyXG4gICAgICAgIHZhciBsYWJlbFlDbGFzcyA9IGxhYmVsQ2xhc3MrXCIgXCIrbGFiZWxDbGFzcytcIi15XCI7XHJcbiAgICAgICAgcGxvdC5sYWJlbENsYXNzID0gbGFiZWxDbGFzcztcclxuXHJcblxyXG4gICAgICAgIHZhciBsYWJlbHNYID0gc2VsZi5zdmdHLnNlbGVjdEFsbChsYWJlbFhDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGxvdC52YXJpYWJsZXMpO1xyXG5cclxuICAgICAgICBsYWJlbHNYLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKTtcclxuXHJcblxyXG4gICAgICAgIGxhYmVsc1hcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIChkLCBpKSA9PiAgaSpwbG90LmNlbGxTaXplICtwbG90LmNlbGxTaXplLzIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAgcGxvdC5oZWlnaHQpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHhcIiwgLTIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInJvdGF0ZSgtOTAsIFwiKyhpKnBsb3QuY2VsbFNpemUrcGxvdC5jZWxsU2l6ZS8yICApK1wiLCBcIitwbG90LmhlaWdodCtcIilcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIChkLGkpID0+IGxhYmVsWENsYXNzK1wiIFwiK2xhYmVsWENsYXNzK1wiLVwiK2kpXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJoYW5naW5nXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KHY9PnYpO1xyXG5cclxuICAgICAgICBsYWJlbHNYLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgLy8vLy8vXHJcblxyXG4gICAgICAgIHZhciBsYWJlbHNZID0gc2VsZi5zdmdHLnNlbGVjdEFsbChsYWJlbFlDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGxvdC52YXJpYWJsZXMpO1xyXG5cclxuICAgICAgICBsYWJlbHNZLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKTtcclxuXHJcblxyXG4gICAgICAgIGxhYmVsc1lcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAgKGQsIGkpID0+ICBpKnBsb3QuY2VsbFNpemUgK3Bsb3QuY2VsbFNpemUvMilcclxuICAgICAgICAgICAgLmF0dHIoXCJkeFwiLCAtMilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIChkLGkpID0+IGxhYmVsWUNsYXNzK1wiIFwiK2xhYmVsWUNsYXNzK1wiLVwiK2kpXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJoYW5naW5nXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KHY9PnYpO1xyXG5cclxuICAgICAgICBsYWJlbHNYLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUNlbGxzKCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGNlbGxDbGFzcyA9IHNlbGYuY29uZmlnLmNzc0NsYXNzUHJlZml4K1wiY2VsbFwiO1xyXG4gICAgICAgIHZhciBjZWxsU2hhcGUgPSBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnR5cGU7XHJcblxyXG5cclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxzID0gc2VsZi5zdmdHLnNlbGVjdEFsbChjZWxsQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBsb3QuY29ycmVsYXRpb24ubWF0cml4LmNlbGxzKTtcclxuXHJcblxyXG4gICAgICAgIGNlbGxzLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGNlbGxDbGFzcyk7XHJcbiAgICAgICAgY2VsbHMuYXR0cihcInRyYW5zZm9ybVwiLCBjPT4gXCJ0cmFuc2xhdGUoXCIrKHBsb3QuY2VsbFNpemUgKiBjLmNvbCArIHBsb3QuY2VsbFNpemUvMikrXCIsXCIrKHBsb3QuY2VsbFNpemUgKiBjLnJvdyArIHBsb3QuY2VsbFNpemUvMikrXCIpXCIpO1xyXG4gICAgICAgIHZhciBzaGFwZXMgPSBjZWxscy5hcHBlbmQoY2VsbFNoYXBlKTtcclxuICAgICAgICBcclxuICAgICAgICBpZihwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnR5cGU9PSdjaXJjbGUnKXtcclxuXHJcbiAgICAgICAgICAgIHNoYXBlc1xyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJyXCIsIHBsb3QuY29ycmVsYXRpb24uc2hhcGUucmFkaXVzKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjeFwiLDApXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImN5XCIsIDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYocGxvdC5jb3JyZWxhdGlvbi5zaGFwZS50eXBlPT0nZWxsaXBzZScpe1xyXG4gICAgICAgICAgICAvLyBjZWxscy5hdHRyKFwidHJhbnNmb3JtXCIsIGM9PiBcInRyYW5zbGF0ZSgzMDAsMTUwKSByb3RhdGUoXCIrcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5yb3RhdGVWYWwoYy52YWx1ZSkrXCIpXCIpO1xyXG4gICAgICAgICAgICBzaGFwZXNcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwicnhcIiwgcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5yYWRpdXNYKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJyeVwiLCBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnJhZGl1c1kpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImN4XCIsIDApXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImN5XCIsIDApXHJcblxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYz0+IFwicm90YXRlKFwiK3Bsb3QuY29ycmVsYXRpb24uc2hhcGUucm90YXRlVmFsKGMudmFsdWUpK1wiKVwiKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBpZihwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnR5cGU9PSdyZWN0Jyl7XHJcbiAgICAgICAgICAgIHNoYXBlc1xyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnNpemUpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnNpemUpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInhcIiwgLXBsb3QuY2VsbFNpemUvMilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieVwiLCAtcGxvdC5jZWxsU2l6ZS8yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBtb3VzZW92ZXJDYWxsYmFja3MgPSBbXTtcclxuICAgICAgICB2YXIgbW91c2VvdXRDYWxsYmFja3MgPSBbXTtcclxuXHJcbiAgICAgICAgaWYocGxvdC50b29sdGlwKXtcclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3ZlckNhbGxiYWNrcy5wdXNoKGM9PntcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGh0bWwgPSBjLnZhbHVlIDtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC5odG1sKGh0bWwpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZDMuZXZlbnQucGFnZVggKyA1KSArIFwicHhcIilcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBtb3VzZW91dENhbGxiYWNrcy5wdXNoKGM9PntcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoc2VsZi5jb25maWcuaGlnaGxpZ2h0TGFiZWxzKXtcclxuICAgICAgICAgICAgdmFyIGhpZ2hsaWdodENsYXNzID0gc2VsZi5jb25maWcuY3NzQ2xhc3NQcmVmaXgrXCJoaWdobGlnaHRcIjtcclxuICAgICAgICAgICAgdmFyIHhMYWJlbENsYXNzID0gYz0+cGxvdC5sYWJlbENsYXNzK1wiLXgtXCIrYy5jb2w7XHJcbiAgICAgICAgICAgIHZhciB5TGFiZWxDbGFzcyA9IGM9PnBsb3QubGFiZWxDbGFzcytcIi15LVwiK2Mucm93O1xyXG5cclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3ZlckNhbGxiYWNrcy5wdXNoKGM9PntcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIit4TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIit5TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBtb3VzZW91dENhbGxiYWNrcy5wdXNoKGM9PntcclxuICAgICAgICAgICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiK3hMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIit5TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBjZWxscy5vbihcIm1vdXNlb3ZlclwiLCBjID0+IHtcclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2s9PmNhbGxiYWNrKGMpKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICAub24oXCJtb3VzZW91dFwiLCBjID0+IHtcclxuICAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2s9PmNhbGxiYWNrKGMpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc2hhcGVzLnN0eWxlKFwiZmlsbFwiLCBjPT4gcGxvdC5jb3JyZWxhdGlvbi5jb2xvci5zY2FsZShjLnZhbHVlKSk7XHJcblxyXG4gICAgICAgIGNlbGxzLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgdXBkYXRlTGVnZW5kKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciBsZWdlbmRYID0gdGhpcy5wbG90LndpZHRoKzEwO1xyXG4gICAgICAgIHZhciBsZWdlbmRZID0gMDtcclxuICAgICAgICB2YXIgYmFyV2lkdGggPSAxMDtcclxuICAgICAgICB2YXIgYmFySGVpZ2h0ID0gdGhpcy5wbG90LmhlaWdodC0yO1xyXG4gICAgICAgIHZhciBzY2FsZSA9IHBsb3QuY29ycmVsYXRpb24uY29sb3Iuc2NhbGU7XHJcblxyXG4gICAgICAgIHBsb3QubGVnZW5kID0gbmV3IExlZ2VuZCh0aGlzLnN2ZywgdGhpcy5zdmdHLCBzY2FsZSwgbGVnZW5kWCwgbGVnZW5kWSkubGluZWFyR3JhZGllbnRCYXIoYmFyV2lkdGgsIGJhckhlaWdodCk7XHJcblxyXG5cclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQge1NjYXR0ZXJQbG90LCBTY2F0dGVyUGxvdENvbmZpZ30gZnJvbSBcIi4vc2NhdHRlcnBsb3RcIjtcclxuZXhwb3J0IHtTY2F0dGVyUGxvdE1hdHJpeCwgU2NhdHRlclBsb3RNYXRyaXhDb25maWd9IGZyb20gXCIuL3NjYXR0ZXJwbG90LW1hdHJpeFwiO1xyXG5leHBvcnQge0NvcnJlbGF0aW9uTWF0cml4LCBDb3JyZWxhdGlvbk1hdHJpeENvbmZpZ30gZnJvbSAnLi9jb3JyZWxhdGlvbi1tYXRyaXgnXHJcbmV4cG9ydCB7U3RhdGlzdGljc1V0aWxzfSBmcm9tICcuL3N0YXRpc3RpY3MtdXRpbHMnXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiIsImltcG9ydCB7VXRpbHN9IGZyb20gXCIuL3V0aWxzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTGVnZW5kIHtcclxuXHJcbiAgICBjc3NDbGFzc1ByZWZpeD1cIm9kYy1cIjtcclxuICAgIGxlZ2VuZENsYXNzPXRoaXMuY3NzQ2xhc3NQcmVmaXgrXCJsZWdlbmRcIjtcclxuICAgIGNvbnRhaW5lcjtcclxuICAgIHNjYWxlO1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzdmcsIGxlZ2VuZFBhcmVudCwgc2NhbGUsIGxlZ2VuZFgsIGxlZ2VuZFkpe1xyXG4gICAgICAgIHRoaXMuc2NhbGU9c2NhbGU7XHJcbiAgICAgICAgdGhpcy5zdmcgPSBzdmc7XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gIFV0aWxzLnNlbGVjdE9yQXBwZW5kKGxlZ2VuZFBhcmVudCwgXCJnLlwiK3RoaXMubGVnZW5kQ2xhc3MsIFwiZ1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIitsZWdlbmRYK1wiLFwiK2xlZ2VuZFkrXCIpXCIpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKHRoaXMubGVnZW5kQ2xhc3MsIHRydWUpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBsaW5lYXJHcmFkaWVudEJhcihiYXJXaWR0aCwgYmFySGVpZ2h0KXtcclxuICAgICAgICB2YXIgZ3JhZGllbnRJZCA9IHRoaXMuY3NzQ2xhc3NQcmVmaXgrXCJsaW5lYXItZ3JhZGllbnRcIjtcclxuICAgICAgICB2YXIgc2NhbGU9IHRoaXMuc2NhbGU7XHJcblxyXG4gICAgICAgIHRoaXMubGluZWFyR3JhZGllbnQgPSBVdGlscy5saW5lYXJHcmFkaWVudCh0aGlzLnN2ZywgZ3JhZGllbnRJZCwgdGhpcy5zY2FsZS5yYW5nZSgpLCAwLCAxMDAsIDAsIDApO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmQoXCJyZWN0XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgYmFyV2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGJhckhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAwKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwidXJsKCNcIitncmFkaWVudElkK1wiKVwiKTtcclxuXHJcblxyXG4gICAgICAgIHZhciB0aWNrcyA9IHRoaXMuY29udGFpbmVyLnNlbGVjdEFsbChcInRleHRcIilcclxuICAgICAgICAgICAgLmRhdGEoIHNjYWxlLmRvbWFpbigpICk7XHJcbiAgICAgICAgdmFyIHRpY2tzTnVtYmVyID1zY2FsZS5kb21haW4oKS5sZW5ndGgtMTtcclxuICAgICAgICB0aWNrcy5lbnRlcigpLmFwcGVuZChcInRleHRcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIGJhcldpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgIChkLCBpKSA9PiAgeyBjb25zb2xlLmxvZyhiYXJIZWlnaHQgLShpKmJhckhlaWdodC90aWNrc051bWJlcikpOyAgcmV0dXJuIGJhckhlaWdodCAtKGkqYmFySGVpZ2h0L3RpY2tzTnVtYmVyKX0pXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHhcIiwgMylcclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJkeVwiLCAxKVxyXG4gICAgICAgICAgICAuYXR0cihcImFsaWdubWVudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAudGV4dChkPT5kKTtcclxuXHJcbiAgICAgICAgdGlja3MuZXhpdCgpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQge0NoYXJ0LCBDaGFydENvbmZpZ30gZnJvbSBcIi4vY2hhcnRcIjtcclxuaW1wb3J0IHtTY2F0dGVyUGxvdENvbmZpZ30gZnJvbSBcIi4vc2NhdHRlcnBsb3RcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuXHJcbmV4cG9ydCBjbGFzcyBTY2F0dGVyUGxvdE1hdHJpeENvbmZpZyBleHRlbmRzIFNjYXR0ZXJQbG90Q29uZmlne1xyXG5cclxuICAgIHN2Z0NsYXNzPSAnbXctZDMtc2NhdHRlcnBsb3QtbWF0cml4JztcclxuICAgIHNpemU9IDIwMDsgLy9zY2F0dGVyIHBsb3QgY2VsbCBzaXplXHJcbiAgICBwYWRkaW5nPSAyMDsgLy9zY2F0dGVyIHBsb3QgY2VsbCBwYWRkaW5nXHJcbiAgICBicnVzaD0gdHJ1ZTtcclxuICAgIGd1aWRlcz0gdHJ1ZTsgLy9zaG93IGF4aXMgZ3VpZGVzXHJcbiAgICB0b29sdGlwPSB0cnVlOyAvL3Nob3cgdG9vbHRpcCBvbiBkb3QgaG92ZXJcclxuICAgIHRpY2tzPSB1bmRlZmluZWQ7IC8vdGlja3MgbnVtYmVyLCAoZGVmYXVsdDogY29tcHV0ZWQgdXNpbmcgY2VsbCBzaXplKVxyXG4gICAgeD17Ly8gWCBheGlzIGNvbmZpZ1xyXG4gICAgICAgIG9yaWVudDogXCJib3R0b21cIixcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIlxyXG4gICAgfTtcclxuICAgIHk9ey8vIFkgYXhpcyBjb25maWdcclxuICAgICAgICBvcmllbnQ6IFwibGVmdFwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiXHJcbiAgICB9O1xyXG4gICAgZ3JvdXBzPXtcclxuICAgICAgICBrZXk6IHVuZGVmaW5lZCwgLy9vYmplY3QgcHJvcGVydHkgbmFtZSBvciBhcnJheSBpbmRleCB3aXRoIGdyb3VwaW5nIHZhcmlhYmxlXHJcbiAgICAgICAgaW5jbHVkZUluUGxvdDogZmFsc2UsIC8vaW5jbHVkZSBncm91cCBhcyB2YXJpYWJsZSBpbiBwbG90LCBib29sZWFuIChkZWZhdWx0OiBmYWxzZSlcclxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oZCwga2V5KSB7IHJldHVybiBkW2tleV0gfSwgLy8gZ3JvdXBpbmcgdmFsdWUgYWNjZXNzb3IsXHJcbiAgICAgICAgbGFiZWw6IFwiXCJcclxuICAgIH07XHJcbiAgICB2YXJpYWJsZXM9IHtcclxuICAgICAgICBsYWJlbHM6IFtdLCAvL29wdGlvbmFsIGFycmF5IG9mIHZhcmlhYmxlIGxhYmVscyAoZm9yIHRoZSBkaWFnb25hbCBvZiB0aGUgcGxvdCkuXHJcbiAgICAgICAga2V5czogW10sIC8vb3B0aW9uYWwgYXJyYXkgb2YgdmFyaWFibGUga2V5c1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoZCwgdmFyaWFibGVLZXkpIHsvLyB2YXJpYWJsZSB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgICAgICByZXR1cm4gZFt2YXJpYWJsZUtleV07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIC8vIHRoaXMuc3ZnQ2xhc3MgPSAnbXctZDMtc2NhdHRlcnBsb3QtbWF0cml4JztcclxuICAgICAgICBjb25zb2xlLmxvZyhjdXN0b20pO1xyXG4gICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgIH1cclxuXHJcblxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2NhdHRlclBsb3RNYXRyaXggZXh0ZW5kcyBDaGFydCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBzdXBlcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBuZXcgU2NhdHRlclBsb3RNYXRyaXhDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZykge1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IFNjYXR0ZXJQbG90TWF0cml4Q29uZmlnKGNvbmZpZykpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpIHtcclxuXHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgbWFyZ2luID0gdGhpcy5jb25maWcubWFyZ2luO1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcbiAgICAgICAgdGhpcy5wbG90ID0ge1xyXG4gICAgICAgICAgICB4OiB7fSxcclxuICAgICAgICAgICAgeToge30sXHJcbiAgICAgICAgICAgIGRvdDoge1xyXG4gICAgICAgICAgICAgICAgY29sb3I6IG51bGwvL2NvbG9yIHNjYWxlIG1hcHBpbmcgZnVuY3Rpb25cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBWYXJpYWJsZXMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnNpemUgPSBjb25mLnNpemU7XHJcblxyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBjb25mLndpZHRoO1xyXG4gICAgICAgIHZhciBwbGFjZWhvbGRlck5vZGUgPSBkMy5zZWxlY3QodGhpcy5wbGFjZWhvbGRlclNlbGVjdG9yKS5ub2RlKCk7XHJcblxyXG4gICAgICAgIGlmICghd2lkdGgpIHtcclxuICAgICAgICAgICAgdmFyIG1heFdpZHRoID0gbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQgKyB0aGlzLnBsb3QudmFyaWFibGVzLmxlbmd0aCp0aGlzLnBsb3Quc2l6ZTtcclxuICAgICAgICAgICAgd2lkdGggPSBNYXRoLm1pbihwbGFjZWhvbGRlck5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGgsIG1heFdpZHRoKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBoZWlnaHQgPSB3aWR0aDtcclxuICAgICAgICBpZiAoIWhlaWdodCkge1xyXG4gICAgICAgICAgICBoZWlnaHQgPSBwbGFjZWhvbGRlck5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wbG90LndpZHRoID0gd2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodDtcclxuICAgICAgICB0aGlzLnBsb3QuaGVpZ2h0ID0gaGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgIGlmKGNvbmYudGlja3M9PT11bmRlZmluZWQpe1xyXG4gICAgICAgICAgICBjb25mLnRpY2tzID0gdGhpcy5wbG90LnNpemUgLyA0MDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBYKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFkoKTtcclxuXHJcbiAgICAgICAgaWYgKGNvbmYuZG90LmQzQ29sb3JDYXRlZ29yeSkge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yQ2F0ZWdvcnkgPSBkMy5zY2FsZVtjb25mLmRvdC5kM0NvbG9yQ2F0ZWdvcnldKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjb2xvclZhbHVlID0gY29uZi5kb3QuY29sb3I7XHJcbiAgICAgICAgaWYgKGNvbG9yVmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmRvdC5jb2xvclZhbHVlID0gY29sb3JWYWx1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29sb3JWYWx1ZSA9PT0gJ3N0cmluZycgfHwgY29sb3JWYWx1ZSBpbnN0YW5jZW9mIFN0cmluZykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmRvdC5jb2xvciA9IGNvbG9yVmFsdWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wbG90LmRvdC5jb2xvckNhdGVnb3J5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yID0gZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5wbG90LmRvdC5jb2xvckNhdGVnb3J5KHNlbGYucGxvdC5kb3QuY29sb3JWYWx1ZShkKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwVmFyaWFibGVzKCkge1xyXG4gICAgICAgIHZhciB2YXJpYWJsZXNDb25mID0gdGhpcy5jb25maWcudmFyaWFibGVzO1xyXG5cclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICBwbG90LmRvbWFpbkJ5VmFyaWFibGUgPSB7fTtcclxuICAgICAgICBwbG90LnZhcmlhYmxlcyA9IHZhcmlhYmxlc0NvbmYua2V5cztcclxuICAgICAgICBpZighcGxvdC52YXJpYWJsZXMgfHwgIXBsb3QudmFyaWFibGVzLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIHBsb3QudmFyaWFibGVzID0gVXRpbHMuaW5mZXJWYXJpYWJsZXMoZGF0YSwgdGhpcy5jb25maWcuZ3JvdXBzLmtleSwgdGhpcy5jb25maWcuaW5jbHVkZUluUGxvdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwbG90LmxhYmVscyA9IFtdO1xyXG4gICAgICAgIHBsb3QubGFiZWxCeVZhcmlhYmxlID0ge307XHJcbiAgICAgICAgcGxvdC52YXJpYWJsZXMuZm9yRWFjaChmdW5jdGlvbih2YXJpYWJsZUtleSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgcGxvdC5kb21haW5CeVZhcmlhYmxlW3ZhcmlhYmxlS2V5XSA9IGQzLmV4dGVudChkYXRhLCBmdW5jdGlvbihkKSB7IHJldHVybiB2YXJpYWJsZXNDb25mLnZhbHVlKGQsIHZhcmlhYmxlS2V5KSB9KTtcclxuICAgICAgICAgICAgdmFyIGxhYmVsID0gdmFyaWFibGVLZXk7XHJcbiAgICAgICAgICAgIGlmKHZhcmlhYmxlc0NvbmYubGFiZWxzICYmIHZhcmlhYmxlc0NvbmYubGFiZWxzLmxlbmd0aD5pbmRleCl7XHJcblxyXG4gICAgICAgICAgICAgICAgbGFiZWwgPSB2YXJpYWJsZXNDb25mLmxhYmVsc1tpbmRleF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGxvdC5sYWJlbHMucHVzaChsYWJlbCk7XHJcbiAgICAgICAgICAgIHBsb3QubGFiZWxCeVZhcmlhYmxlW3ZhcmlhYmxlS2V5XSA9IGxhYmVsO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhwbG90LmxhYmVsQnlWYXJpYWJsZSk7XHJcblxyXG4gICAgICAgIHBsb3Quc3VicGxvdHMgPSBbXTtcclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBYKCkge1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeCA9IHBsb3QueDtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB4LnZhbHVlID0gY29uZi52YXJpYWJsZXMudmFsdWU7XHJcbiAgICAgICAgeC5zY2FsZSA9IGQzLnNjYWxlW2NvbmYueC5zY2FsZV0oKS5yYW5nZShbY29uZi5wYWRkaW5nIC8gMiwgcGxvdC5zaXplIC0gY29uZi5wYWRkaW5nIC8gMl0pO1xyXG4gICAgICAgIHgubWFwID0gZnVuY3Rpb24gKGQsIHZhcmlhYmxlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB4LnNjYWxlKHgudmFsdWUoZCwgdmFyaWFibGUpKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHguYXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeC5zY2FsZSkub3JpZW50KGNvbmYueC5vcmllbnQpLnRpY2tzKGNvbmYudGlja3MpO1xyXG4gICAgICAgIHguYXhpcy50aWNrU2l6ZShwbG90LnNpemUgKiBwbG90LnZhcmlhYmxlcy5sZW5ndGgpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBZKCkge1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeSA9IHBsb3QueTtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB5LnZhbHVlID0gY29uZi52YXJpYWJsZXMudmFsdWU7XHJcbiAgICAgICAgeS5zY2FsZSA9IGQzLnNjYWxlW2NvbmYueS5zY2FsZV0oKS5yYW5nZShbIHBsb3Quc2l6ZSAtIGNvbmYucGFkZGluZyAvIDIsIGNvbmYucGFkZGluZyAvIDJdKTtcclxuICAgICAgICB5Lm1hcCA9IGZ1bmN0aW9uIChkLCB2YXJpYWJsZSkge1xyXG4gICAgICAgICAgICByZXR1cm4geS5zY2FsZSh5LnZhbHVlKGQsIHZhcmlhYmxlKSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB5LmF4aXM9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeS5zY2FsZSkub3JpZW50KGNvbmYueS5vcmllbnQpLnRpY2tzKGNvbmYudGlja3MpO1xyXG4gICAgICAgIHkuYXhpcy50aWNrU2l6ZSgtcGxvdC5zaXplICogcGxvdC52YXJpYWJsZXMubGVuZ3RoKTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhdygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9dGhpcztcclxuICAgICAgICB2YXIgbiA9IHNlbGYucGxvdC52YXJpYWJsZXMubGVuZ3RoO1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcbiAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcIi5tdy1heGlzLXgubXctYXhpc1wiKVxyXG4gICAgICAgICAgICAuZGF0YShzZWxmLnBsb3QudmFyaWFibGVzKVxyXG4gICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJtdy1heGlzLXggbXctYXhpc1wiKyhjb25mLmd1aWRlcyA/ICcnIDogJyBtdy1uby1ndWlkZXMnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAobiAtIGkgLSAxKSAqIHNlbGYucGxvdC5zaXplICsgXCIsMClcIjsgfSlcclxuICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24oZCkgeyBzZWxmLnBsb3QueC5zY2FsZS5kb21haW4oc2VsZi5wbG90LmRvbWFpbkJ5VmFyaWFibGVbZF0pOyBkMy5zZWxlY3QodGhpcykuY2FsbChzZWxmLnBsb3QueC5heGlzKTsgfSk7XHJcblxyXG4gICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCIubXctYXhpcy15Lm13LWF4aXNcIilcclxuICAgICAgICAgICAgLmRhdGEoc2VsZi5wbG90LnZhcmlhYmxlcylcclxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibXctYXhpcy15IG13LWF4aXNcIisoY29uZi5ndWlkZXMgPyAnJyA6ICcgbXctbm8tZ3VpZGVzJykpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKDAsXCIgKyBpICogc2VsZi5wbG90LnNpemUgKyBcIilcIjsgfSlcclxuICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24oZCkgeyBzZWxmLnBsb3QueS5zY2FsZS5kb21haW4oc2VsZi5wbG90LmRvbWFpbkJ5VmFyaWFibGVbZF0pOyBkMy5zZWxlY3QodGhpcykuY2FsbChzZWxmLnBsb3QueS5heGlzKTsgfSk7XHJcblxyXG5cclxuICAgICAgICBpZihjb25mLnRvb2x0aXApe1xyXG4gICAgICAgICAgICBzZWxmLnBsb3QudG9vbHRpcCA9IHRoaXMudXRpbHMuc2VsZWN0T3JBcHBlbmQoZDMuc2VsZWN0KHNlbGYucGxhY2Vob2xkZXJTZWxlY3RvciksICdkaXYubXctdG9vbHRpcCcsICdkaXYnKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm13LXRvb2x0aXBcIilcclxuICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgY2VsbCA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCIubXctY2VsbFwiKVxyXG4gICAgICAgICAgICAuZGF0YShzZWxmLnV0aWxzLmNyb3NzKHNlbGYucGxvdC52YXJpYWJsZXMsIHNlbGYucGxvdC52YXJpYWJsZXMpKVxyXG4gICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJtdy1jZWxsXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKG4gLSBkLmkgLSAxKSAqIHNlbGYucGxvdC5zaXplICsgXCIsXCIgKyBkLmogKiBzZWxmLnBsb3Quc2l6ZSArIFwiKVwiOyB9KTtcclxuXHJcbiAgICAgICAgaWYoY29uZi5icnVzaCl7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0JydXNoKGNlbGwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2VsbC5lYWNoKHBsb3RTdWJwbG90KTtcclxuXHJcblxyXG5cclxuICAgICAgICAvL0xhYmVsc1xyXG4gICAgICAgIGNlbGwuZmlsdGVyKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaSA9PT0gZC5qOyB9KS5hcHBlbmQoXCJ0ZXh0XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCBjb25mLnBhZGRpbmcpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCBjb25mLnBhZGRpbmcpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCIuNzFlbVwiKVxyXG4gICAgICAgICAgICAudGV4dChmdW5jdGlvbihkKSB7IHJldHVybiBzZWxmLnBsb3QubGFiZWxCeVZhcmlhYmxlW2QueF07IH0pO1xyXG5cclxuXHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwbG90U3VicGxvdChwKSB7XHJcbiAgICAgICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgICAgICBwbG90LnN1YnBsb3RzLnB1c2gocCk7XHJcbiAgICAgICAgICAgIHZhciBjZWxsID0gZDMuc2VsZWN0KHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgcGxvdC54LnNjYWxlLmRvbWFpbihwbG90LmRvbWFpbkJ5VmFyaWFibGVbcC54XSk7XHJcbiAgICAgICAgICAgIHBsb3QueS5zY2FsZS5kb21haW4ocGxvdC5kb21haW5CeVZhcmlhYmxlW3AueV0pO1xyXG5cclxuICAgICAgICAgICAgY2VsbC5hcHBlbmQoXCJyZWN0XCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibXctZnJhbWVcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieFwiLCBjb25mLnBhZGRpbmcgLyAyKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIGNvbmYucGFkZGluZyAvIDIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGNvbmYuc2l6ZSAtIGNvbmYucGFkZGluZylcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGNvbmYuc2l6ZSAtIGNvbmYucGFkZGluZyk7XHJcblxyXG5cclxuICAgICAgICAgICAgcC51cGRhdGUgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgdmFyIHN1YnBsb3QgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRvdHMgPSBjZWxsLnNlbGVjdEFsbChcImNpcmNsZVwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kYXRhKHNlbGYuZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZG90cy5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBkb3RzLmF0dHIoXCJjeFwiLCBmdW5jdGlvbihkKXtyZXR1cm4gcGxvdC54Lm1hcChkLCBzdWJwbG90LngpfSlcclxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcImN5XCIsIGZ1bmN0aW9uKGQpe3JldHVybiBwbG90LnkubWFwKGQsIHN1YnBsb3QueSl9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiclwiLCBzZWxmLmNvbmZpZy5kb3QucmFkaXVzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocGxvdC5kb3QuY29sb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb3RzLnN0eWxlKFwiZmlsbFwiLCBwbG90LmRvdC5jb2xvcilcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZihwbG90LnRvb2x0aXApe1xyXG4gICAgICAgICAgICAgICAgICAgIGRvdHMub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAuOSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodG1sID0gXCIoXCIgKyBwbG90LngudmFsdWUoZCwgc3VicGxvdC54KSArIFwiLCBcIiArcGxvdC55LnZhbHVlKGQsIHN1YnBsb3QueSkgKyBcIilcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLmh0bWwoaHRtbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBncm91cCA9IHNlbGYuY29uZmlnLmdyb3Vwcy52YWx1ZShkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZ3JvdXAgfHwgZ3JvdXA9PT0wICl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sKz1cIjxici8+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSBzZWxmLmNvbmZpZy5ncm91cHMubGFiZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihsYWJlbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCs9bGFiZWwrXCI6IFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCs9Z3JvdXBcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAuaHRtbChodG1sKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZDMuZXZlbnQucGFnZVggKyA1KSArIFwicHhcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uKGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGRvdHMuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcC51cGRhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIHRoaXMucGxvdC5zdWJwbG90cy5mb3JFYWNoKGZ1bmN0aW9uKHApe3AudXBkYXRlKCl9KTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhd0JydXNoKGNlbGwpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGJydXNoID0gZDMuc3ZnLmJydXNoKClcclxuICAgICAgICAgICAgLngoc2VsZi5wbG90Lnguc2NhbGUpXHJcbiAgICAgICAgICAgIC55KHNlbGYucGxvdC55LnNjYWxlKVxyXG4gICAgICAgICAgICAub24oXCJicnVzaHN0YXJ0XCIsIGJydXNoc3RhcnQpXHJcbiAgICAgICAgICAgIC5vbihcImJydXNoXCIsIGJydXNobW92ZSlcclxuICAgICAgICAgICAgLm9uKFwiYnJ1c2hlbmRcIiwgYnJ1c2hlbmQpO1xyXG5cclxuICAgICAgICBjZWxsLmFwcGVuZChcImdcIikuY2FsbChicnVzaCk7XHJcblxyXG5cclxuICAgICAgICB2YXIgYnJ1c2hDZWxsO1xyXG5cclxuICAgICAgICAvLyBDbGVhciB0aGUgcHJldmlvdXNseS1hY3RpdmUgYnJ1c2gsIGlmIGFueS5cclxuICAgICAgICBmdW5jdGlvbiBicnVzaHN0YXJ0KHApIHtcclxuICAgICAgICAgICAgaWYgKGJydXNoQ2VsbCAhPT0gdGhpcykge1xyXG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KGJydXNoQ2VsbCkuY2FsbChicnVzaC5jbGVhcigpKTtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC54LnNjYWxlLmRvbWFpbihzZWxmLnBsb3QuZG9tYWluQnlWYXJpYWJsZVtwLnhdKTtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC55LnNjYWxlLmRvbWFpbihzZWxmLnBsb3QuZG9tYWluQnlWYXJpYWJsZVtwLnldKTtcclxuICAgICAgICAgICAgICAgIGJydXNoQ2VsbCA9IHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEhpZ2hsaWdodCB0aGUgc2VsZWN0ZWQgY2lyY2xlcy5cclxuICAgICAgICBmdW5jdGlvbiBicnVzaG1vdmUocCkge1xyXG4gICAgICAgICAgICB2YXIgZSA9IGJydXNoLmV4dGVudCgpO1xyXG4gICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwiY2lyY2xlXCIpLmNsYXNzZWQoXCJoaWRkZW5cIiwgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlWzBdWzBdID4gZFtwLnhdIHx8IGRbcC54XSA+IGVbMV1bMF1cclxuICAgICAgICAgICAgICAgICAgICB8fCBlWzBdWzFdID4gZFtwLnldIHx8IGRbcC55XSA+IGVbMV1bMV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBJZiB0aGUgYnJ1c2ggaXMgZW1wdHksIHNlbGVjdCBhbGwgY2lyY2xlcy5cclxuICAgICAgICBmdW5jdGlvbiBicnVzaGVuZCgpIHtcclxuICAgICAgICAgICAgaWYgKGJydXNoLmVtcHR5KCkpIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCIuaGlkZGVuXCIpLmNsYXNzZWQoXCJoaWRkZW5cIiwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0iLCJpbXBvcnQge0NoYXJ0LCBDaGFydENvbmZpZ30gZnJvbSBcIi4vY2hhcnRcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuXHJcbmV4cG9ydCBjbGFzcyBTY2F0dGVyUGxvdENvbmZpZyBleHRlbmRzIENoYXJ0Q29uZmlne1xyXG5cclxuICAgIHN2Z0NsYXNzPSAnbXctZDMtc2NhdHRlcnBsb3QnO1xyXG4gICAgZ3VpZGVzPSBmYWxzZTsgLy9zaG93IGF4aXMgZ3VpZGVzXHJcbiAgICB0b29sdGlwPSB0cnVlOyAvL3Nob3cgdG9vbHRpcCBvbiBkb3QgaG92ZXJcclxuICAgIHg9ey8vIFggYXhpcyBjb25maWdcclxuICAgICAgICBsYWJlbDogJ1gnLCAvLyBheGlzIGxhYmVsXHJcbiAgICAgICAga2V5OiAwLFxyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihkLCBrZXkpIHsgcmV0dXJuIGRba2V5XSB9LCAvLyB4IHZhbHVlIGFjY2Vzc29yXHJcbiAgICAgICAgb3JpZW50OiBcImJvdHRvbVwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiXHJcbiAgICB9O1xyXG4gICAgeT17Ly8gWSBheGlzIGNvbmZpZ1xyXG4gICAgICAgIGxhYmVsOiAnWScsIC8vIGF4aXMgbGFiZWwsXHJcbiAgICAgICAga2V5OiAxLFxyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihkLCBrZXkpIHsgcmV0dXJuIGRba2V5XSB9LCAvLyB5IHZhbHVlIGFjY2Vzc29yXHJcbiAgICAgICAgb3JpZW50OiBcImxlZnRcIixcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIlxyXG4gICAgfTtcclxuICAgIGdyb3Vwcz17XHJcbiAgICAgICAga2V5OiAyLFxyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihkLCBrZXkpIHsgcmV0dXJuIGRba2V5XSB9LCAvLyBncm91cGluZyB2YWx1ZSBhY2Nlc3NvcixcclxuICAgICAgICBsYWJlbDogXCJcIlxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdmFyIGNvbmZpZyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5kb3Q9e1xyXG4gICAgICAgICAgICByYWRpdXM6IDIsXHJcbiAgICAgICAgICAgIGNvbG9yOiBmdW5jdGlvbihkKSB7IHJldHVybiBjb25maWcuZ3JvdXBzLnZhbHVlKGQsIGNvbmZpZy5ncm91cHMua2V5KSB9LCAvLyBzdHJpbmcgb3IgZnVuY3Rpb24gcmV0dXJuaW5nIGNvbG9yJ3MgdmFsdWUgZm9yIGNvbG9yIHNjYWxlXHJcbiAgICAgICAgICAgIGQzQ29sb3JDYXRlZ29yeTogJ2NhdGVnb3J5MTAnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYoY3VzdG9tKXtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTY2F0dGVyUGxvdCBleHRlbmRzIENoYXJ0e1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IFNjYXR0ZXJQbG90Q29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpe1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IFNjYXR0ZXJQbG90Q29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCl7XHJcbiAgICAgICAgdmFyIHNlbGY9dGhpcztcclxuICAgICAgICB2YXIgbWFyZ2luID0gdGhpcy5jb25maWcubWFyZ2luO1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcbiAgICAgICAgdGhpcy5wbG90PXtcclxuICAgICAgICAgICAgeDoge30sXHJcbiAgICAgICAgICAgIHk6IHt9LFxyXG4gICAgICAgICAgICBkb3Q6IHtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiBudWxsLy9jb2xvciBzY2FsZSBtYXBwaW5nIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBjb25mLndpZHRoO1xyXG4gICAgICAgIHZhciBwbGFjZWhvbGRlck5vZGUgPSBkMy5zZWxlY3QodGhpcy5wbGFjZWhvbGRlclNlbGVjdG9yKS5ub2RlKCk7XHJcblxyXG4gICAgICAgIGlmKCF3aWR0aCl7XHJcbiAgICAgICAgICAgIHdpZHRoID1wbGFjZWhvbGRlck5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBoZWlnaHQgPSBjb25mLmhlaWdodDtcclxuICAgICAgICBpZighaGVpZ2h0KXtcclxuICAgICAgICAgICAgaGVpZ2h0ID1wbGFjZWhvbGRlck5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wbG90LndpZHRoID0gd2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodDtcclxuICAgICAgICB0aGlzLnBsb3QuaGVpZ2h0ID0gaGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBYKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFkoKTtcclxuXHJcbiAgICAgICAgaWYoY29uZi5kb3QuZDNDb2xvckNhdGVnb3J5KXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmRvdC5jb2xvckNhdGVnb3J5ID0gZDMuc2NhbGVbY29uZi5kb3QuZDNDb2xvckNhdGVnb3J5XSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY29sb3JWYWx1ZSA9IGNvbmYuZG90LmNvbG9yO1xyXG4gICAgICAgIGlmKGNvbG9yVmFsdWUpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yVmFsdWUgPSBjb2xvclZhbHVlO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb2xvclZhbHVlID09PSAnc3RyaW5nJyB8fCBjb2xvclZhbHVlIGluc3RhbmNlb2YgU3RyaW5nKXtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5kb3QuY29sb3IgPSBjb2xvclZhbHVlO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZih0aGlzLnBsb3QuZG90LmNvbG9yQ2F0ZWdvcnkpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmRvdC5jb2xvciA9IGZ1bmN0aW9uKGQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnBsb3QuZG90LmNvbG9yQ2F0ZWdvcnkoc2VsZi5wbG90LmRvdC5jb2xvclZhbHVlKGQpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfWVsc2V7XHJcblxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwWCgpe1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeCA9IHBsb3QueDtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnLng7XHJcblxyXG4gICAgICAgIC8qICpcclxuICAgICAgICAgKiB2YWx1ZSBhY2Nlc3NvciAtIHJldHVybnMgdGhlIHZhbHVlIHRvIGVuY29kZSBmb3IgYSBnaXZlbiBkYXRhIG9iamVjdC5cclxuICAgICAgICAgKiBzY2FsZSAtIG1hcHMgdmFsdWUgdG8gYSB2aXN1YWwgZGlzcGxheSBlbmNvZGluZywgc3VjaCBhcyBhIHBpeGVsIHBvc2l0aW9uLlxyXG4gICAgICAgICAqIG1hcCBmdW5jdGlvbiAtIG1hcHMgZnJvbSBkYXRhIHZhbHVlIHRvIGRpc3BsYXkgdmFsdWVcclxuICAgICAgICAgKiBheGlzIC0gc2V0cyB1cCBheGlzXHJcbiAgICAgICAgICoqL1xyXG4gICAgICAgIHgudmFsdWUgPSBkID0+IGNvbmYudmFsdWUoZCwgY29uZi5rZXkpO1xyXG4gICAgICAgIHguc2NhbGUgPSBkMy5zY2FsZVtjb25mLnNjYWxlXSgpLnJhbmdlKFswLCBwbG90LndpZHRoXSk7XHJcbiAgICAgICAgeC5tYXAgPSBmdW5jdGlvbihkKSB7IHJldHVybiB4LnNjYWxlKHgudmFsdWUoZCkpO307XHJcbiAgICAgICAgeC5heGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh4LnNjYWxlKS5vcmllbnQoY29uZi5vcmllbnQpO1xyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIHBsb3QueC5zY2FsZS5kb21haW4oW2QzLm1pbihkYXRhLCBwbG90LngudmFsdWUpLTEsIGQzLm1heChkYXRhLCBwbG90LngudmFsdWUpKzFdKTtcclxuICAgICAgICBpZih0aGlzLmNvbmZpZy5ndWlkZXMpIHtcclxuICAgICAgICAgICAgeC5heGlzLnRpY2tTaXplKC1wbG90LmhlaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBZICgpe1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeSA9IHBsb3QueTtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnLnk7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdmFsdWUgYWNjZXNzb3IgLSByZXR1cm5zIHRoZSB2YWx1ZSB0byBlbmNvZGUgZm9yIGEgZ2l2ZW4gZGF0YSBvYmplY3QuXHJcbiAgICAgICAgICogc2NhbGUgLSBtYXBzIHZhbHVlIHRvIGEgdmlzdWFsIGRpc3BsYXkgZW5jb2RpbmcsIHN1Y2ggYXMgYSBwaXhlbCBwb3NpdGlvbi5cclxuICAgICAgICAgKiBtYXAgZnVuY3Rpb24gLSBtYXBzIGZyb20gZGF0YSB2YWx1ZSB0byBkaXNwbGF5IHZhbHVlXHJcbiAgICAgICAgICogYXhpcyAtIHNldHMgdXAgYXhpc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHkudmFsdWUgPSBkID0+IGNvbmYudmFsdWUoZCwgY29uZi5rZXkpO1xyXG4gICAgICAgIHkuc2NhbGUgPSBkMy5zY2FsZVtjb25mLnNjYWxlXSgpLnJhbmdlKFtwbG90LmhlaWdodCwgMF0pO1xyXG4gICAgICAgIHkubWFwID0gZnVuY3Rpb24oZCkgeyByZXR1cm4geS5zY2FsZSh5LnZhbHVlKGQpKTt9O1xyXG4gICAgICAgIHkuYXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeS5zY2FsZSkub3JpZW50KGNvbmYub3JpZW50KTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5jb25maWcuZ3VpZGVzKXtcclxuICAgICAgICAgICAgeS5heGlzLnRpY2tTaXplKC1wbG90LndpZHRoKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgICAgICBwbG90Lnkuc2NhbGUuZG9tYWluKFtkMy5taW4oZGF0YSwgcGxvdC55LnZhbHVlKS0xLCBkMy5tYXgoZGF0YSwgcGxvdC55LnZhbHVlKSsxXSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRyYXcoKXtcclxuICAgICAgICB0aGlzLmRyYXdBeGlzWCgpO1xyXG4gICAgICAgIHRoaXMuZHJhd0F4aXNZKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhd0F4aXNYKCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBheGlzQ29uZiA9IHRoaXMuY29uZmlnLng7XHJcbiAgICAgICAgc2VsZi5zdmdHLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm13LWF4aXMteCBtdy1heGlzXCIrKHNlbGYuY29uZmlnLmd1aWRlcyA/ICcnIDogJyBtdy1uby1ndWlkZXMnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIHBsb3QuaGVpZ2h0ICsgXCIpXCIpXHJcbiAgICAgICAgICAgIC5jYWxsKHBsb3QueC5heGlzKVxyXG4gICAgICAgICAgICAuYXBwZW5kKFwidGV4dFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibXctbGFiZWxcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrIChwbG90LndpZHRoLzIpICtcIixcIisgKHNlbGYuY29uZmlnLm1hcmdpbi5ib3R0b20pICtcIilcIikgIC8vIHRleHQgaXMgZHJhd24gb2ZmIHRoZSBzY3JlZW4gdG9wIGxlZnQsIG1vdmUgZG93biBhbmQgb3V0IGFuZCByb3RhdGVcclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCBcIi0xZW1cIilcclxuICAgICAgICAgICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoYXhpc0NvbmYubGFiZWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICBkcmF3QXhpc1koKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGF4aXNDb25mID0gdGhpcy5jb25maWcueTtcclxuICAgICAgICBzZWxmLnN2Z0cuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibXctYXhpcyBtdy1heGlzLXlcIisoc2VsZi5jb25maWcuZ3VpZGVzID8gJycgOiAnIG13LW5vLWd1aWRlcycpKVxyXG4gICAgICAgICAgICAuY2FsbChwbG90LnkuYXhpcylcclxuICAgICAgICAgICAgLmFwcGVuZChcInRleHRcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm13LWxhYmVsXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyAtc2VsZi5jb25maWcubWFyZ2luLmxlZnQgK1wiLFwiKyhwbG90LmhlaWdodC8yKStcIilyb3RhdGUoLTkwKVwiKSAgLy8gdGV4dCBpcyBkcmF3biBvZmYgdGhlIHNjcmVlbiB0b3AgbGVmdCwgbW92ZSBkb3duIGFuZCBvdXQgYW5kIHJvdGF0ZVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGF4aXNDb25mLmxhYmVsKTtcclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlKG5ld0RhdGEpe1xyXG4gICAgICAgIC8vIEQzQ2hhcnRCYXNlLnByb3RvdHlwZS51cGRhdGUuY2FsbCh0aGlzLCBuZXdEYXRhKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgdmFyIGRvdHMgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwiLm13LWRvdFwiKVxyXG4gICAgICAgICAgICAuZGF0YShkYXRhKTtcclxuXHJcbiAgICAgICAgZG90cy5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibXctZG90XCIpO1xyXG5cclxuXHJcbiAgICAgICAgZG90cy5hdHRyKFwiclwiLCBzZWxmLmNvbmZpZy5kb3QucmFkaXVzKVxyXG4gICAgICAgICAgICAuYXR0cihcImN4XCIsIHBsb3QueC5tYXApXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY3lcIiwgcGxvdC55Lm1hcCk7XHJcblxyXG4gICAgICAgIGlmKHBsb3QudG9vbHRpcCl7XHJcbiAgICAgICAgICAgIGRvdHMub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAuOSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IFwiKFwiICsgcGxvdC54LnZhbHVlKGQpICsgXCIsIFwiICtwbG90LnkudmFsdWUoZCkgKyBcIilcIjtcclxuICAgICAgICAgICAgICAgIHZhciBncm91cCA9IHNlbGYuY29uZmlnLmdyb3Vwcy52YWx1ZShkLCBzZWxmLmNvbmZpZy5ncm91cHMua2V5KTtcclxuICAgICAgICAgICAgICAgIGlmKGdyb3VwIHx8IGdyb3VwPT09MCApe1xyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwrPVwiPGJyLz5cIjtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSBzZWxmLmNvbmZpZy5ncm91cHMubGFiZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYobGFiZWwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sKz1sYWJlbCtcIjogXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwrPWdyb3VwXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAuaHRtbChodG1sKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkMy5ldmVudC5wYWdlWSAtIDI4KSArIFwicHhcIik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbihkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihwbG90LmRvdC5jb2xvcil7XHJcbiAgICAgICAgICAgIGRvdHMuc3R5bGUoXCJmaWxsXCIsIHBsb3QuZG90LmNvbG9yKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG90cy5leGl0KCkucmVtb3ZlKCk7XHJcblxyXG4gICAgfTtcclxufVxyXG4iLCJ2YXIgc3UgPSBtb2R1bGUuZXhwb3J0cy5TdGF0aXN0aWNzVXRpbHMgPXt9O1xyXG5zdS5zYW1wbGVDb3JyZWxhdGlvbiA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL3NhbXBsZV9jb3JyZWxhdGlvbicpOyIsImV4cG9ydCBjbGFzcyBVdGlscyB7XHJcbiAgICAvLyB1c2FnZSBleGFtcGxlIGRlZXBFeHRlbmQoe30sIG9iakEsIG9iakIpOyA9PiBzaG91bGQgd29yayBzaW1pbGFyIHRvICQuZXh0ZW5kKHRydWUsIHt9LCBvYmpBLCBvYmpCKTtcclxuICAgIHN0YXRpYyBkZWVwRXh0ZW5kKG91dCkge1xyXG5cclxuICAgICAgICB2YXIgdXRpbHMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBlbXB0eU91dCA9IHt9O1xyXG5cclxuXHJcbiAgICAgICAgaWYgKCFvdXQgJiYgYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgQXJyYXkuaXNBcnJheShhcmd1bWVudHNbMV0pKSB7XHJcbiAgICAgICAgICAgIG91dCA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvdXQgPSBvdXQgfHwge307XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGlmICghc291cmNlKVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkob3V0W2tleV0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlzT2JqZWN0ID0gdXRpbHMuaXNPYmplY3Qob3V0W2tleV0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNyY09iaiA9IHV0aWxzLmlzT2JqZWN0KHNvdXJjZVtrZXldKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNPYmplY3QgJiYgIWlzQXJyYXkgJiYgc3JjT2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMuZGVlcEV4dGVuZChvdXRba2V5XSwgc291cmNlW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRba2V5XSA9IHNvdXJjZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgbWVyZ2VEZWVwKHRhcmdldCwgc291cmNlKSB7XHJcbiAgICAgICAgbGV0IG91dHB1dCA9IE9iamVjdC5hc3NpZ24oe30sIHRhcmdldCk7XHJcbiAgICAgICAgaWYgKFV0aWxzLmlzT2JqZWN0Tm90QXJyYXkodGFyZ2V0KSAmJiBVdGlscy5pc09iamVjdE5vdEFycmF5KHNvdXJjZSkpIHtcclxuICAgICAgICAgICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoVXRpbHMuaXNPYmplY3ROb3RBcnJheShzb3VyY2Vba2V5XSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIShrZXkgaW4gdGFyZ2V0KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihvdXRwdXQsIHsgW2tleV06IHNvdXJjZVtrZXldIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0W2tleV0gPSBVdGlscy5tZXJnZURlZXAodGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihvdXRwdXQsIHsgW2tleV06IHNvdXJjZVtrZXldIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY3Jvc3MoYSwgYikge1xyXG4gICAgICAgIHZhciBjID0gW10sIG4gPSBhLmxlbmd0aCwgbSA9IGIubGVuZ3RoLCBpLCBqO1xyXG4gICAgICAgIGZvciAoaSA9IC0xOyArK2kgPCBuOykgZm9yIChqID0gLTE7ICsraiA8IG07KSBjLnB1c2goe3g6IGFbaV0sIGk6IGksIHk6IGJbal0sIGo6IGp9KTtcclxuICAgICAgICByZXR1cm4gYztcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGluZmVyVmFyaWFibGVzKGRhdGEsIGdyb3VwS2V5LCBpbmNsdWRlR3JvdXApIHtcclxuICAgICAgICB2YXIgcmVzID0gW107XHJcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHZhciBkID0gZGF0YVswXTtcclxuICAgICAgICAgICAgaWYgKGQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgcmVzPSAgZC5tYXAoZnVuY3Rpb24gKHYsIGkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZiAodHlwZW9mIGQgPT09ICdvYmplY3QnKXtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIGQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZighZC5oYXNPd25Qcm9wZXJ0eShwcm9wKSkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKHByb3ApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCFpbmNsdWRlR3JvdXApe1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSByZXMuaW5kZXhPZihncm91cEtleSk7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICByZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzXHJcbiAgICB9O1xyXG4gICAgc3RhdGljIGlzT2JqZWN0Tm90QXJyYXkoaXRlbSkge1xyXG4gICAgICAgIHJldHVybiAoaXRlbSAmJiB0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkoaXRlbSkgJiYgaXRlbSAhPT0gbnVsbCk7XHJcbiAgICB9O1xyXG4gICAgc3RhdGljIGlzT2JqZWN0KGEpIHtcclxuICAgICAgICByZXR1cm4gYSAhPT0gbnVsbCAmJiB0eXBlb2YgYSA9PT0gJ29iamVjdCc7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBpc051bWJlcihhKSB7XHJcbiAgICAgICAgcmV0dXJuICFpc05hTihhKSAmJiB0eXBlb2YgYSA9PT0gJ251bWJlcic7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBpc0Z1bmN0aW9uKGEpIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGEgPT09ICdmdW5jdGlvbic7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBzZWxlY3RPckFwcGVuZChwYXJlbnQsIHNlbGVjdG9yLCBlbGVtZW50KSB7XHJcbiAgICAgICAgdmFyIHNlbGVjdGlvbiA9IHBhcmVudC5zZWxlY3Qoc2VsZWN0b3IpO1xyXG4gICAgICAgIGlmKHNlbGVjdGlvbi5lbXB0eSgpKXtcclxuICAgICAgICAgICAgcmV0dXJuIHBhcmVudC5hcHBlbmQoZWxlbWVudCB8fCBzZWxlY3Rvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzZWxlY3Rpb247XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBzdGF0aWMgbGluZWFyR3JhZGllbnQoc3ZnLCBncmFkaWVudElkLCByYW5nZSwgeDEsIHkxLCB4MiwgeTIpe1xyXG4gICAgICAgIHZhciBkZWZzID0gVXRpbHMuc2VsZWN0T3JBcHBlbmQoc3ZnLCBcImRlZnNcIik7XHJcbiAgICAgICAgdmFyIGxpbmVhckdyYWRpZW50ID0gZGVmcy5hcHBlbmQoXCJsaW5lYXJHcmFkaWVudFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIGdyYWRpZW50SWQpO1xyXG5cclxuICAgICAgICBsaW5lYXJHcmFkaWVudFxyXG4gICAgICAgICAgICAuYXR0cihcIngxXCIsIHgxK1wiJVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInkxXCIsIHkxK1wiJVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcIngyXCIsIHgyK1wiJVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInkyXCIsIHkyK1wiJVwiKTtcclxuXHJcbiAgICAgICAgLy9BcHBlbmQgbXVsdGlwbGUgY29sb3Igc3RvcHMgYnkgdXNpbmcgRDMncyBkYXRhL2VudGVyIHN0ZXBcclxuICAgICAgICB2YXIgc3RvcHMgPSBsaW5lYXJHcmFkaWVudC5zZWxlY3RBbGwoXCJzdG9wXCIpXHJcbiAgICAgICAgICAgIC5kYXRhKCByYW5nZSApO1xyXG5cclxuICAgICAgICBzdG9wcy5lbnRlcigpLmFwcGVuZChcInN0b3BcIik7XHJcblxyXG4gICAgICAgIHN0b3BzLmF0dHIoXCJvZmZzZXRcIiwgKGQsaSkgPT4gaS8ocmFuZ2UubGVuZ3RoLTEpIClcclxuICAgICAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIGQgPT4gZCApO1xyXG5cclxuICAgICAgICBzdG9wcy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcbn1cclxuIl19
