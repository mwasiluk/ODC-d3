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
    this.svgClass = 'mw-d3-chart';
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
        }
    }, {
        key: 'draw',
        value: function draw() {
            this.update();
        }
    }]);

    return Chart;
}();

},{"./utils":14}],9:[function(require,module,exports){
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CorrelationMatrixConfig = exports.CorrelationMatrixConfig = function (_ChartConfig) {
    _inherits(CorrelationMatrixConfig, _ChartConfig);

    //show axis guides

    function CorrelationMatrixConfig(custom) {
        _classCallCheck(this, CorrelationMatrixConfig);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CorrelationMatrixConfig).call(this));

        _this.svgClass = 'odc-correlation-matrix';
        _this.guides = false;
        _this.tooltip = true;
        _this.variables = {
            scale: "ordinal",
            labels: undefined,
            keys: [], //optional array of variable keys
            value: function value(d, variableKey) {
                return d[variableKey];
            }, // variable value accessor
            label: function label(d, key) {
                return key;
            }
        };
        _this.correlation = {
            scale: "linear",
            domain: [-1, 0, 1],
            range: ["darkslateblue", "white", "crimson"],
            value: function value(xValues, yValues) {
                return _statisticsUtils.StatisticsUtils.sampleCorrelation(xValues, yValues);
            }

        };
        _this.cell = {
            shape: "circle",
            size: undefined,
            sizeMin: 5,
            sizeMax: 80,
            padding: 2
        };

        if (custom) {
            _utils.Utils.deepExtend(_this, custom);
        }
        return _this;
    } //show tooltip on dot hover


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

            var parentWidth = placeholderNode.getBoundingClientRect().width;
            if (width) {} else {
                this.plot.cellSize = this.config.cell.size;

                if (!this.plot.cellSize) {
                    this.plot.cellSize = Math.max(conf.cell.sizeMax, Math.min(conf.cell.sizeMax, parentWidth / this.plot.variables.length));
                }

                width = this.plot.cellSize * this.plot.variables.length + margin.left + margin.right;
            }

            if (!width) {

                width = Math.min(parentWidth, maxWidth);
            }
            if (!this.plot.cellSize) {}
            var height = width;
            if (!height) {
                height = placeholderNode.getBoundingClientRect().height;
            }

            this.plot.width = width - margin.left - margin.right;
            this.plot.height = height - margin.top - margin.bottom;

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
        key: 'draw',
        value: function draw() {
            this.update();
        }
    }, {
        key: 'update',
        value: function update(newData) {
            _get(Object.getPrototypeOf(CorrelationMatrix.prototype), 'update', this).call(this, newData);
            this.updateCells();
            // this.updateAxes();
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

            cells.enter().append(cellShape).attr("class", cellClass);

            if (plot.correlation.shape.type == 'circle') {
                cells.attr("r", plot.correlation.shape.radius).attr("cx", function (c) {
                    return plot.cellSize * c.col + plot.cellSize / 2;
                }).attr("cy", function (c) {
                    return plot.cellSize * c.row + plot.cellSize / 2;
                });
            }

            if (plot.tooltip) {
                cells.on("mouseover", function (c) {
                    plot.tooltip.transition().duration(200).style("opacity", .9);
                    var html = c.value;
                    plot.tooltip.html(html).style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");
                }).on("mouseout", function (d) {
                    plot.tooltip.transition().duration(500).style("opacity", 0);
                });
            }

            cells.style("fill", function (c) {
                return plot.correlation.color.scale(c.value);
            });

            cells.exit().remove();
        }
    }]);

    return CorrelationMatrix;
}(_chart.Chart);

},{"./chart":8,"./statistics-utils":13,"./utils":14}],10:[function(require,module,exports){
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

},{"./correlation-matrix":9,"./scatterplot":12,"./scatterplot-matrix":11,"./statistics-utils":13}],11:[function(require,module,exports){
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

},{"./chart":8,"./scatterplot":12,"./utils":14}],12:[function(require,module,exports){
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

},{"./chart":8,"./utils":14}],13:[function(require,module,exports){
'use strict';

var su = module.exports.StatisticsUtils = {};
su.sampleCorrelation = require('../bower_components/simple-statistics/src/sample_correlation');

},{"../bower_components/simple-statistics/src/sample_correlation":2}],14:[function(require,module,exports){
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
    }]);

    return Utils;
}();

},{}]},{},[10])(10)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxtZWFuLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc2FtcGxlX2NvcnJlbGF0aW9uLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc2FtcGxlX2NvdmFyaWFuY2UuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfc3RhbmRhcmRfZGV2aWF0aW9uLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc2FtcGxlX3ZhcmlhbmNlLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc3VtLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc3VtX250aF9wb3dlcl9kZXZpYXRpb25zLmpzIiwic3JjXFxjaGFydC5qcyIsInNyY1xcY29ycmVsYXRpb24tbWF0cml4LmpzIiwic3JjXFxpbmRleC5qcyIsInNyY1xcc2NhdHRlcnBsb3QtbWF0cml4LmpzIiwic3JjXFxzY2F0dGVycGxvdC5qcyIsInNyY1xcc3RhdGlzdGljcy11dGlscy5qcyIsInNyY1xcdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7O0FBR0EsSUFBSSxNQUFNLFFBQVEsT0FBUixDQUFWOzs7Ozs7Ozs7Ozs7Ozs7QUFlQSxTQUFTLElBQVQsQ0FBYyxDLHFCQUFkLEUsV0FBaUQ7O0FBRTdDLFFBQUksRUFBRSxNQUFGLEtBQWEsQ0FBakIsRUFBb0I7QUFBRSxlQUFPLEdBQVA7QUFBYTs7QUFFbkMsV0FBTyxJQUFJLENBQUosSUFBUyxFQUFFLE1BQWxCO0FBQ0g7O0FBRUQsT0FBTyxPQUFQLEdBQWlC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O0FBQ0g7OzttQ0FFaUIsQyxFQUFHO0FBQ2pCLG1CQUFPLE9BQU8sQ0FBUCxLQUFhLFVBQXBCO0FBQ0g7Ozt1Q0FFcUIsTSxFQUFRLFEsRUFBVSxPLEVBQVM7QUFDN0MsZ0JBQUksWUFBWSxPQUFPLE1BQVAsQ0FBYyxRQUFkLENBQWhCO0FBQ0EsZ0JBQUcsVUFBVSxLQUFWLEVBQUgsRUFBcUI7QUFDakIsdUJBQU8sT0FBTyxNQUFQLENBQWMsV0FBVyxRQUF6QixDQUFQO0FBQ0g7QUFDRCxtQkFBTyxTQUFQO0FBQ0giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIHN1bSA9IHJlcXVpcmUoJy4vc3VtJyk7XHJcblxyXG4vKipcclxuICogVGhlIG1lYW4sIF9hbHNvIGtub3duIGFzIGF2ZXJhZ2VfLFxyXG4gKiBpcyB0aGUgc3VtIG9mIGFsbCB2YWx1ZXMgb3ZlciB0aGUgbnVtYmVyIG9mIHZhbHVlcy5cclxuICogVGhpcyBpcyBhIFttZWFzdXJlIG9mIGNlbnRyYWwgdGVuZGVuY3ldKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0NlbnRyYWxfdGVuZGVuY3kpOlxyXG4gKiBhIG1ldGhvZCBvZiBmaW5kaW5nIGEgdHlwaWNhbCBvciBjZW50cmFsIHZhbHVlIG9mIGEgc2V0IG9mIG51bWJlcnMuXHJcbiAqXHJcbiAqIFRoaXMgcnVucyBvbiBgTyhuKWAsIGxpbmVhciB0aW1lIGluIHJlc3BlY3QgdG8gdGhlIGFycmF5XHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBpbnB1dCB2YWx1ZXNcclxuICogQHJldHVybnMge251bWJlcn0gbWVhblxyXG4gKiBAZXhhbXBsZVxyXG4gKiBjb25zb2xlLmxvZyhtZWFuKFswLCAxMF0pKTsgLy8gNVxyXG4gKi9cclxuZnVuY3Rpb24gbWVhbih4IC8qOiBBcnJheTxudW1iZXI+ICovKS8qOm51bWJlciovIHtcclxuICAgIC8vIFRoZSBtZWFuIG9mIG5vIG51bWJlcnMgaXMgbnVsbFxyXG4gICAgaWYgKHgubGVuZ3RoID09PSAwKSB7IHJldHVybiBOYU47IH1cclxuXHJcbiAgICByZXR1cm4gc3VtKHgpIC8geC5sZW5ndGg7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWVhbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIHNhbXBsZUNvdmFyaWFuY2UgPSByZXF1aXJlKCcuL3NhbXBsZV9jb3ZhcmlhbmNlJyk7XHJcbnZhciBzYW1wbGVTdGFuZGFyZERldmlhdGlvbiA9IHJlcXVpcmUoJy4vc2FtcGxlX3N0YW5kYXJkX2RldmlhdGlvbicpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBbY29ycmVsYXRpb25dKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ29ycmVsYXRpb25fYW5kX2RlcGVuZGVuY2UpIGlzXHJcbiAqIGEgbWVhc3VyZSBvZiBob3cgY29ycmVsYXRlZCB0d28gZGF0YXNldHMgYXJlLCBiZXR3ZWVuIC0xIGFuZCAxXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBmaXJzdCBpbnB1dFxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHkgc2Vjb25kIGlucHV0XHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHNhbXBsZSBjb3JyZWxhdGlvblxyXG4gKiBAZXhhbXBsZVxyXG4gKiB2YXIgYSA9IFsxLCAyLCAzLCA0LCA1LCA2XTtcclxuICogdmFyIGIgPSBbMiwgMiwgMywgNCwgNSwgNjBdO1xyXG4gKiBzYW1wbGVDb3JyZWxhdGlvbihhLCBiKTsgLy89IDAuNjkxXHJcbiAqL1xyXG5mdW5jdGlvbiBzYW1wbGVDb3JyZWxhdGlvbih4Lyo6IEFycmF5PG51bWJlcj4gKi8sIHkvKjogQXJyYXk8bnVtYmVyPiAqLykvKjpudW1iZXIqLyB7XHJcbiAgICB2YXIgY292ID0gc2FtcGxlQ292YXJpYW5jZSh4LCB5KSxcclxuICAgICAgICB4c3RkID0gc2FtcGxlU3RhbmRhcmREZXZpYXRpb24oeCksXHJcbiAgICAgICAgeXN0ZCA9IHNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uKHkpO1xyXG5cclxuICAgIHJldHVybiBjb3YgLyB4c3RkIC8geXN0ZDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYW1wbGVDb3JyZWxhdGlvbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIG1lYW4gPSByZXF1aXJlKCcuL21lYW4nKTtcclxuXHJcbi8qKlxyXG4gKiBbU2FtcGxlIGNvdmFyaWFuY2VdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1NhbXBsZV9tZWFuX2FuZF9zYW1wbGVDb3ZhcmlhbmNlKSBvZiB0d28gZGF0YXNldHM6XHJcbiAqIGhvdyBtdWNoIGRvIHRoZSB0d28gZGF0YXNldHMgbW92ZSB0b2dldGhlcj9cclxuICogeCBhbmQgeSBhcmUgdHdvIGRhdGFzZXRzLCByZXByZXNlbnRlZCBhcyBhcnJheXMgb2YgbnVtYmVycy5cclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGZpcnN0IGlucHV0XHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geSBzZWNvbmQgaW5wdXRcclxuICogQHJldHVybnMge251bWJlcn0gc2FtcGxlIGNvdmFyaWFuY2VcclxuICogQGV4YW1wbGVcclxuICogdmFyIHggPSBbMSwgMiwgMywgNCwgNSwgNl07XHJcbiAqIHZhciB5ID0gWzYsIDUsIDQsIDMsIDIsIDFdO1xyXG4gKiBzYW1wbGVDb3ZhcmlhbmNlKHgsIHkpOyAvLz0gLTMuNVxyXG4gKi9cclxuZnVuY3Rpb24gc2FtcGxlQ292YXJpYW5jZSh4IC8qOkFycmF5PG51bWJlcj4qLywgeSAvKjpBcnJheTxudW1iZXI+Ki8pLyo6bnVtYmVyKi8ge1xyXG5cclxuICAgIC8vIFRoZSB0d28gZGF0YXNldHMgbXVzdCBoYXZlIHRoZSBzYW1lIGxlbmd0aCB3aGljaCBtdXN0IGJlIG1vcmUgdGhhbiAxXHJcbiAgICBpZiAoeC5sZW5ndGggPD0gMSB8fCB4Lmxlbmd0aCAhPT0geS5sZW5ndGgpIHtcclxuICAgICAgICByZXR1cm4gTmFOO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGRldGVybWluZSB0aGUgbWVhbiBvZiBlYWNoIGRhdGFzZXQgc28gdGhhdCB3ZSBjYW4ganVkZ2UgZWFjaFxyXG4gICAgLy8gdmFsdWUgb2YgdGhlIGRhdGFzZXQgZmFpcmx5IGFzIHRoZSBkaWZmZXJlbmNlIGZyb20gdGhlIG1lYW4uIHRoaXNcclxuICAgIC8vIHdheSwgaWYgb25lIGRhdGFzZXQgaXMgWzEsIDIsIDNdIGFuZCBbMiwgMywgNF0sIHRoZWlyIGNvdmFyaWFuY2VcclxuICAgIC8vIGRvZXMgbm90IHN1ZmZlciBiZWNhdXNlIG9mIHRoZSBkaWZmZXJlbmNlIGluIGFic29sdXRlIHZhbHVlc1xyXG4gICAgdmFyIHhtZWFuID0gbWVhbih4KSxcclxuICAgICAgICB5bWVhbiA9IG1lYW4oeSksXHJcbiAgICAgICAgc3VtID0gMDtcclxuXHJcbiAgICAvLyBmb3IgZWFjaCBwYWlyIG9mIHZhbHVlcywgdGhlIGNvdmFyaWFuY2UgaW5jcmVhc2VzIHdoZW4gdGhlaXJcclxuICAgIC8vIGRpZmZlcmVuY2UgZnJvbSB0aGUgbWVhbiBpcyBhc3NvY2lhdGVkIC0gaWYgYm90aCBhcmUgd2VsbCBhYm92ZVxyXG4gICAgLy8gb3IgaWYgYm90aCBhcmUgd2VsbCBiZWxvd1xyXG4gICAgLy8gdGhlIG1lYW4sIHRoZSBjb3ZhcmlhbmNlIGluY3JlYXNlcyBzaWduaWZpY2FudGx5LlxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgc3VtICs9ICh4W2ldIC0geG1lYW4pICogKHlbaV0gLSB5bWVhbik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdGhpcyBpcyBCZXNzZWxzJyBDb3JyZWN0aW9uOiBhbiBhZGp1c3RtZW50IG1hZGUgdG8gc2FtcGxlIHN0YXRpc3RpY3NcclxuICAgIC8vIHRoYXQgYWxsb3dzIGZvciB0aGUgcmVkdWNlZCBkZWdyZWUgb2YgZnJlZWRvbSBlbnRhaWxlZCBpbiBjYWxjdWxhdGluZ1xyXG4gICAgLy8gdmFsdWVzIGZyb20gc2FtcGxlcyByYXRoZXIgdGhhbiBjb21wbGV0ZSBwb3B1bGF0aW9ucy5cclxuICAgIHZhciBiZXNzZWxzQ29ycmVjdGlvbiA9IHgubGVuZ3RoIC0gMTtcclxuXHJcbiAgICAvLyB0aGUgY292YXJpYW5jZSBpcyB3ZWlnaHRlZCBieSB0aGUgbGVuZ3RoIG9mIHRoZSBkYXRhc2V0cy5cclxuICAgIHJldHVybiBzdW0gLyBiZXNzZWxzQ29ycmVjdGlvbjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYW1wbGVDb3ZhcmlhbmNlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgc2FtcGxlVmFyaWFuY2UgPSByZXF1aXJlKCcuL3NhbXBsZV92YXJpYW5jZScpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBbc3RhbmRhcmQgZGV2aWF0aW9uXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1N0YW5kYXJkX2RldmlhdGlvbilcclxuICogaXMgdGhlIHNxdWFyZSByb290IG9mIHRoZSB2YXJpYW5jZS5cclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGlucHV0IGFycmF5XHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHNhbXBsZSBzdGFuZGFyZCBkZXZpYXRpb25cclxuICogQGV4YW1wbGVcclxuICogc3Muc2FtcGxlU3RhbmRhcmREZXZpYXRpb24oWzIsIDQsIDQsIDQsIDUsIDUsIDcsIDldKTtcclxuICogLy89IDIuMTM4XHJcbiAqL1xyXG5mdW5jdGlvbiBzYW1wbGVTdGFuZGFyZERldmlhdGlvbih4Lyo6QXJyYXk8bnVtYmVyPiovKS8qOm51bWJlciovIHtcclxuICAgIC8vIFRoZSBzdGFuZGFyZCBkZXZpYXRpb24gb2Ygbm8gbnVtYmVycyBpcyBudWxsXHJcbiAgICB2YXIgc2FtcGxlVmFyaWFuY2VYID0gc2FtcGxlVmFyaWFuY2UoeCk7XHJcbiAgICBpZiAoaXNOYU4oc2FtcGxlVmFyaWFuY2VYKSkgeyByZXR1cm4gTmFOOyB9XHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHNhbXBsZVZhcmlhbmNlWCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2FtcGxlU3RhbmRhcmREZXZpYXRpb247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBzdW1OdGhQb3dlckRldmlhdGlvbnMgPSByZXF1aXJlKCcuL3N1bV9udGhfcG93ZXJfZGV2aWF0aW9ucycpO1xyXG5cclxuLypcclxuICogVGhlIFtzYW1wbGUgdmFyaWFuY2VdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1ZhcmlhbmNlI1NhbXBsZV92YXJpYW5jZSlcclxuICogaXMgdGhlIHN1bSBvZiBzcXVhcmVkIGRldmlhdGlvbnMgZnJvbSB0aGUgbWVhbi4gVGhlIHNhbXBsZSB2YXJpYW5jZVxyXG4gKiBpcyBkaXN0aW5ndWlzaGVkIGZyb20gdGhlIHZhcmlhbmNlIGJ5IHRoZSB1c2FnZSBvZiBbQmVzc2VsJ3MgQ29ycmVjdGlvbl0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQmVzc2VsJ3NfY29ycmVjdGlvbik6XHJcbiAqIGluc3RlYWQgb2YgZGl2aWRpbmcgdGhlIHN1bSBvZiBzcXVhcmVkIGRldmlhdGlvbnMgYnkgdGhlIGxlbmd0aCBvZiB0aGUgaW5wdXQsXHJcbiAqIGl0IGlzIGRpdmlkZWQgYnkgdGhlIGxlbmd0aCBtaW51cyBvbmUuIFRoaXMgY29ycmVjdHMgdGhlIGJpYXMgaW4gZXN0aW1hdGluZ1xyXG4gKiBhIHZhbHVlIGZyb20gYSBzZXQgdGhhdCB5b3UgZG9uJ3Qga25vdyBpZiBmdWxsLlxyXG4gKlxyXG4gKiBSZWZlcmVuY2VzOlxyXG4gKiAqIFtXb2xmcmFtIE1hdGhXb3JsZCBvbiBTYW1wbGUgVmFyaWFuY2VdKGh0dHA6Ly9tYXRod29ybGQud29sZnJhbS5jb20vU2FtcGxlVmFyaWFuY2UuaHRtbClcclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGlucHV0IGFycmF5XHJcbiAqIEByZXR1cm4ge251bWJlcn0gc2FtcGxlIHZhcmlhbmNlXHJcbiAqIEBleGFtcGxlXHJcbiAqIHNhbXBsZVZhcmlhbmNlKFsxLCAyLCAzLCA0LCA1XSk7IC8vPSAyLjVcclxuICovXHJcbmZ1bmN0aW9uIHNhbXBsZVZhcmlhbmNlKHggLyo6IEFycmF5PG51bWJlcj4gKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgLy8gVGhlIHZhcmlhbmNlIG9mIG5vIG51bWJlcnMgaXMgbnVsbFxyXG4gICAgaWYgKHgubGVuZ3RoIDw9IDEpIHsgcmV0dXJuIE5hTjsgfVxyXG5cclxuICAgIHZhciBzdW1TcXVhcmVkRGV2aWF0aW9uc1ZhbHVlID0gc3VtTnRoUG93ZXJEZXZpYXRpb25zKHgsIDIpO1xyXG5cclxuICAgIC8vIHRoaXMgaXMgQmVzc2VscycgQ29ycmVjdGlvbjogYW4gYWRqdXN0bWVudCBtYWRlIHRvIHNhbXBsZSBzdGF0aXN0aWNzXHJcbiAgICAvLyB0aGF0IGFsbG93cyBmb3IgdGhlIHJlZHVjZWQgZGVncmVlIG9mIGZyZWVkb20gZW50YWlsZWQgaW4gY2FsY3VsYXRpbmdcclxuICAgIC8vIHZhbHVlcyBmcm9tIHNhbXBsZXMgcmF0aGVyIHRoYW4gY29tcGxldGUgcG9wdWxhdGlvbnMuXHJcbiAgICB2YXIgYmVzc2Vsc0NvcnJlY3Rpb24gPSB4Lmxlbmd0aCAtIDE7XHJcblxyXG4gICAgLy8gRmluZCB0aGUgbWVhbiB2YWx1ZSBvZiB0aGF0IGxpc3RcclxuICAgIHJldHVybiBzdW1TcXVhcmVkRGV2aWF0aW9uc1ZhbHVlIC8gYmVzc2Vsc0NvcnJlY3Rpb247XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2FtcGxlVmFyaWFuY2U7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbi8qKlxyXG4gKiBPdXIgZGVmYXVsdCBzdW0gaXMgdGhlIFtLYWhhbiBzdW1tYXRpb24gYWxnb3JpdGhtXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9LYWhhbl9zdW1tYXRpb25fYWxnb3JpdGhtKSBpc1xyXG4gKiBhIG1ldGhvZCBmb3IgY29tcHV0aW5nIHRoZSBzdW0gb2YgYSBsaXN0IG9mIG51bWJlcnMgd2hpbGUgY29ycmVjdGluZ1xyXG4gKiBmb3IgZmxvYXRpbmctcG9pbnQgZXJyb3JzLiBUcmFkaXRpb25hbGx5LCBzdW1zIGFyZSBjYWxjdWxhdGVkIGFzIG1hbnlcclxuICogc3VjY2Vzc2l2ZSBhZGRpdGlvbnMsIGVhY2ggb25lIHdpdGggaXRzIG93biBmbG9hdGluZy1wb2ludCByb3VuZG9mZi4gVGhlc2VcclxuICogbG9zc2VzIGluIHByZWNpc2lvbiBhZGQgdXAgYXMgdGhlIG51bWJlciBvZiBudW1iZXJzIGluY3JlYXNlcy4gVGhpcyBhbHRlcm5hdGl2ZVxyXG4gKiBhbGdvcml0aG0gaXMgbW9yZSBhY2N1cmF0ZSB0aGFuIHRoZSBzaW1wbGUgd2F5IG9mIGNhbGN1bGF0aW5nIHN1bXMgYnkgc2ltcGxlXHJcbiAqIGFkZGl0aW9uLlxyXG4gKlxyXG4gKiBUaGlzIHJ1bnMgb24gYE8obilgLCBsaW5lYXIgdGltZSBpbiByZXNwZWN0IHRvIHRoZSBhcnJheVxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggaW5wdXRcclxuICogQHJldHVybiB7bnVtYmVyfSBzdW0gb2YgYWxsIGlucHV0IG51bWJlcnNcclxuICogQGV4YW1wbGVcclxuICogY29uc29sZS5sb2coc3VtKFsxLCAyLCAzXSkpOyAvLyA2XHJcbiAqL1xyXG5mdW5jdGlvbiBzdW0oeC8qOiBBcnJheTxudW1iZXI+ICovKS8qOiBudW1iZXIgKi8ge1xyXG5cclxuICAgIC8vIGxpa2UgdGhlIHRyYWRpdGlvbmFsIHN1bSBhbGdvcml0aG0sIHdlIGtlZXAgYSBydW5uaW5nXHJcbiAgICAvLyBjb3VudCBvZiB0aGUgY3VycmVudCBzdW0uXHJcbiAgICB2YXIgc3VtID0gMDtcclxuXHJcbiAgICAvLyBidXQgd2UgYWxzbyBrZWVwIHRocmVlIGV4dHJhIHZhcmlhYmxlcyBhcyBib29ra2VlcGluZzpcclxuICAgIC8vIG1vc3QgaW1wb3J0YW50bHksIGFuIGVycm9yIGNvcnJlY3Rpb24gdmFsdWUuIFRoaXMgd2lsbCBiZSBhIHZlcnlcclxuICAgIC8vIHNtYWxsIG51bWJlciB0aGF0IGlzIHRoZSBvcHBvc2l0ZSBvZiB0aGUgZmxvYXRpbmcgcG9pbnQgcHJlY2lzaW9uIGxvc3MuXHJcbiAgICB2YXIgZXJyb3JDb21wZW5zYXRpb24gPSAwO1xyXG5cclxuICAgIC8vIHRoaXMgd2lsbCBiZSBlYWNoIG51bWJlciBpbiB0aGUgbGlzdCBjb3JyZWN0ZWQgd2l0aCB0aGUgY29tcGVuc2F0aW9uIHZhbHVlLlxyXG4gICAgdmFyIGNvcnJlY3RlZEN1cnJlbnRWYWx1ZTtcclxuXHJcbiAgICAvLyBhbmQgdGhpcyB3aWxsIGJlIHRoZSBuZXh0IHN1bVxyXG4gICAgdmFyIG5leHRTdW07XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgLy8gZmlyc3QgY29ycmVjdCB0aGUgdmFsdWUgdGhhdCB3ZSdyZSBnb2luZyB0byBhZGQgdG8gdGhlIHN1bVxyXG4gICAgICAgIGNvcnJlY3RlZEN1cnJlbnRWYWx1ZSA9IHhbaV0gLSBlcnJvckNvbXBlbnNhdGlvbjtcclxuXHJcbiAgICAgICAgLy8gY29tcHV0ZSB0aGUgbmV4dCBzdW0uIHN1bSBpcyBsaWtlbHkgYSBtdWNoIGxhcmdlciBudW1iZXJcclxuICAgICAgICAvLyB0aGFuIGNvcnJlY3RlZEN1cnJlbnRWYWx1ZSwgc28gd2UnbGwgbG9zZSBwcmVjaXNpb24gaGVyZSxcclxuICAgICAgICAvLyBhbmQgbWVhc3VyZSBob3cgbXVjaCBwcmVjaXNpb24gaXMgbG9zdCBpbiB0aGUgbmV4dCBzdGVwXHJcbiAgICAgICAgbmV4dFN1bSA9IHN1bSArIGNvcnJlY3RlZEN1cnJlbnRWYWx1ZTtcclxuXHJcbiAgICAgICAgLy8gd2UgaW50ZW50aW9uYWxseSBkaWRuJ3QgYXNzaWduIHN1bSBpbW1lZGlhdGVseSwgYnV0IHN0b3JlZFxyXG4gICAgICAgIC8vIGl0IGZvciBub3cgc28gd2UgY2FuIGZpZ3VyZSBvdXQgdGhpczogaXMgKHN1bSArIG5leHRWYWx1ZSkgLSBuZXh0VmFsdWVcclxuICAgICAgICAvLyBub3QgZXF1YWwgdG8gMD8gaWRlYWxseSBpdCB3b3VsZCBiZSwgYnV0IGluIHByYWN0aWNlIGl0IHdvbid0OlxyXG4gICAgICAgIC8vIGl0IHdpbGwgYmUgc29tZSB2ZXJ5IHNtYWxsIG51bWJlci4gdGhhdCdzIHdoYXQgd2UgcmVjb3JkXHJcbiAgICAgICAgLy8gYXMgZXJyb3JDb21wZW5zYXRpb24uXHJcbiAgICAgICAgZXJyb3JDb21wZW5zYXRpb24gPSBuZXh0U3VtIC0gc3VtIC0gY29ycmVjdGVkQ3VycmVudFZhbHVlO1xyXG5cclxuICAgICAgICAvLyBub3cgdGhhdCB3ZSd2ZSBjb21wdXRlZCBob3cgbXVjaCB3ZSdsbCBjb3JyZWN0IGZvciBpbiB0aGUgbmV4dFxyXG4gICAgICAgIC8vIGxvb3AsIHN0YXJ0IHRyZWF0aW5nIHRoZSBuZXh0U3VtIGFzIHRoZSBjdXJyZW50IHN1bS5cclxuICAgICAgICBzdW0gPSBuZXh0U3VtO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdW07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc3VtO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgbWVhbiA9IHJlcXVpcmUoJy4vbWVhbicpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBzdW0gb2YgZGV2aWF0aW9ucyB0byB0aGUgTnRoIHBvd2VyLlxyXG4gKiBXaGVuIG49MiBpdCdzIHRoZSBzdW0gb2Ygc3F1YXJlZCBkZXZpYXRpb25zLlxyXG4gKiBXaGVuIG49MyBpdCdzIHRoZSBzdW0gb2YgY3ViZWQgZGV2aWF0aW9ucy5cclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBuIHBvd2VyXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHN1bSBvZiBudGggcG93ZXIgZGV2aWF0aW9uc1xyXG4gKiBAZXhhbXBsZVxyXG4gKiB2YXIgaW5wdXQgPSBbMSwgMiwgM107XHJcbiAqIC8vIHNpbmNlIHRoZSB2YXJpYW5jZSBvZiBhIHNldCBpcyB0aGUgbWVhbiBzcXVhcmVkXHJcbiAqIC8vIGRldmlhdGlvbnMsIHdlIGNhbiBjYWxjdWxhdGUgdGhhdCB3aXRoIHN1bU50aFBvd2VyRGV2aWF0aW9uczpcclxuICogdmFyIHZhcmlhbmNlID0gc3VtTnRoUG93ZXJEZXZpYXRpb25zKGlucHV0KSAvIGlucHV0Lmxlbmd0aDtcclxuICovXHJcbmZ1bmN0aW9uIHN1bU50aFBvd2VyRGV2aWF0aW9ucyh4Lyo6IEFycmF5PG51bWJlcj4gKi8sIG4vKjogbnVtYmVyICovKS8qOm51bWJlciovIHtcclxuICAgIHZhciBtZWFuVmFsdWUgPSBtZWFuKHgpLFxyXG4gICAgICAgIHN1bSA9IDA7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgc3VtICs9IE1hdGgucG93KHhbaV0gLSBtZWFuVmFsdWUsIG4pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdW07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc3VtTnRoUG93ZXJEZXZpYXRpb25zO1xyXG4iLCJpbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJ0Q29uZmlne1xyXG4gICAgY3NzQ2xhc3NQcmVmaXggPSBcIm9kYy1cIjtcclxuICAgIHN2Z0NsYXNzID0gJ213LWQzLWNoYXJ0JztcclxuICAgIHdpZHRoID0gdW5kZWZpbmVkO1xyXG4gICAgaGVpZ2h0ID0gIHVuZGVmaW5lZDtcclxuICAgIG1hcmdpbiA9e1xyXG4gICAgICAgIGxlZnQ6IDUwLFxyXG4gICAgICAgIHJpZ2h0OiAzMCxcclxuICAgICAgICB0b3A6IDMwLFxyXG4gICAgICAgIGJvdHRvbTogNTBcclxuICAgIH07XHJcbiAgICB0b29sdGlwID0gZmFsc2U7XHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIGlmKGN1c3RvbSl7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJ0e1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcblxyXG4gICAgICAgIHRoaXMudXRpbHMgPSBVdGlscztcclxuICAgICAgICB0aGlzLnBsYWNlaG9sZGVyU2VsZWN0b3IgPSBwbGFjZWhvbGRlclNlbGVjdG9yO1xyXG4gICAgICAgIHRoaXMuc3ZnPW51bGw7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5wbG90PXtcclxuICAgICAgICAgICAgbWFyZ2luOnt9XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2V0Q29uZmlnKGNvbmZpZyk7XHJcblxyXG4gICAgICAgIGlmKGRhdGEpe1xyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKXtcclxuICAgICAgICBpZighY29uZmlnKXtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBuZXcgQ2hhcnRDb25maWcoKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRhKGRhdGEpe1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmluaXRQbG90KCk7XHJcbiAgICAgICAgc2VsZi5pbml0U3ZnKCk7XHJcbiAgICAgICAgc2VsZi5kcmF3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFN2Zygpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgY29uZmlnID0gdGhpcy5jb25maWc7XHJcbiAgICAgICAgY29uc29sZS5sb2coY29uZmlnLnN2Z0NsYXNzKTtcclxuXHJcbiAgICAgICAgdmFyIHdpZHRoID0gc2VsZi5wbG90LndpZHRoKyBjb25maWcubWFyZ2luLmxlZnQgKyBjb25maWcubWFyZ2luLnJpZ2h0O1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSAgc2VsZi5wbG90LmhlaWdodCsgY29uZmlnLm1hcmdpbi50b3AgKyBjb25maWcubWFyZ2luLmJvdHRvbTtcclxuICAgICAgICB2YXIgYXNwZWN0ID0gd2lkdGggLyBoZWlnaHQ7XHJcblxyXG4gICAgICAgIHNlbGYuc3ZnID0gZDMuc2VsZWN0KHNlbGYucGxhY2Vob2xkZXJTZWxlY3Rvcikuc2VsZWN0KFwic3ZnXCIpO1xyXG4gICAgICAgIGlmKCFzZWxmLnN2Zy5lbXB0eSgpKXtcclxuICAgICAgICAgICAgc2VsZi5zdmcucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBzZWxmLnN2ZyA9IGQzLnNlbGVjdChzZWxmLnBsYWNlaG9sZGVyU2VsZWN0b3IpLmFwcGVuZChcInN2Z1wiKTtcclxuXHJcbiAgICAgICAgc2VsZi5zdmdcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcInZpZXdCb3hcIiwgXCIwIDAgXCIrXCIgXCIrd2lkdGgrXCIgXCIraGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcInByZXNlcnZlQXNwZWN0UmF0aW9cIiwgXCJ4TWlkWU1pZCBtZWV0XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgY29uZmlnLnN2Z0NsYXNzKTtcclxuICAgICAgICBzZWxmLnN2Z0cgPSBzZWxmLnN2Zy5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgY29uZmlnLm1hcmdpbi5sZWZ0ICsgXCIsXCIgKyBjb25maWcubWFyZ2luLnRvcCArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgaWYoY29uZmlnLnRvb2x0aXApe1xyXG4gICAgICAgICAgICBzZWxmLnBsb3QudG9vbHRpcCA9IHRoaXMudXRpbHMuc2VsZWN0T3JBcHBlbmQoZDMuc2VsZWN0KHNlbGYucGxhY2Vob2xkZXJTZWxlY3RvciksICdkaXYubXctdG9vbHRpcCcsICdkaXYnKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm13LXRvb2x0aXBcIilcclxuICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZighY29uZmlnLndpZHRoIHx8IGNvbmZpZy5oZWlnaHQgKXtcclxuICAgICAgICAgICAgZDMuc2VsZWN0KHdpbmRvdylcclxuICAgICAgICAgICAgICAgIC5vbihcInJlc2l6ZVwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL1RPRE8gYWRkIHJlc3BvbnNpdmVuZXNzIGlmIHdpZHRoL2hlaWdodCBub3Qgc3BlY2lmaWVkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKXtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRhdGEpe1xyXG4gICAgICAgIGlmKGRhdGEpe1xyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdiYXNlIHVwcGRhdGUnKVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBkcmF3KCl7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NoYXJ0LCBDaGFydENvbmZpZ30gZnJvbSBcIi4vY2hhcnRcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IHtTdGF0aXN0aWNzVXRpbHN9IGZyb20gJy4vc3RhdGlzdGljcy11dGlscydcclxuXHJcbmV4cG9ydCBjbGFzcyBDb3JyZWxhdGlvbk1hdHJpeENvbmZpZyBleHRlbmRzIENoYXJ0Q29uZmlne1xyXG5cclxuICAgIHN2Z0NsYXNzPSAnb2RjLWNvcnJlbGF0aW9uLW1hdHJpeCc7XHJcbiAgICBndWlkZXM9IGZhbHNlOyAvL3Nob3cgYXhpcyBndWlkZXNcclxuICAgIHRvb2x0aXA9IHRydWU7IC8vc2hvdyB0b29sdGlwIG9uIGRvdCBob3ZlclxyXG4gICAgdmFyaWFibGVzPXtcclxuICAgICAgICBzY2FsZTogXCJvcmRpbmFsXCIsXHJcbiAgICAgICAgbGFiZWxzOiB1bmRlZmluZWQsXHJcbiAgICAgICAga2V5czogW10sIC8vb3B0aW9uYWwgYXJyYXkgb2YgdmFyaWFibGUga2V5c1xyXG4gICAgICAgIHZhbHVlOiAoZCwgdmFyaWFibGVLZXkpID0+IGRbdmFyaWFibGVLZXldICwgLy8gdmFyaWFibGUgdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICBsYWJlbDogIChkLCBrZXkpID0+IGtleVxyXG4gICAgfTtcclxuICAgIGNvcnJlbGF0aW9uPXtcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIixcclxuICAgICAgICBkb21haW46IFstMSwgMCwgMV0sXHJcbiAgICAgICAgcmFuZ2U6IFtcImRhcmtzbGF0ZWJsdWVcIiwgXCJ3aGl0ZVwiLCBcImNyaW1zb25cIl0sXHJcbiAgICAgICAgdmFsdWU6ICh4VmFsdWVzLCB5VmFsdWVzKSA9PiBTdGF0aXN0aWNzVXRpbHMuc2FtcGxlQ29ycmVsYXRpb24oeFZhbHVlcywgeVZhbHVlcyksXHJcblxyXG4gICAgfTtcclxuICAgIGNlbGw9e1xyXG4gICAgICAgIHNoYXBlOiBcImNpcmNsZVwiLFxyXG4gICAgICAgIHNpemU6IHVuZGVmaW5lZCxcclxuICAgICAgICBzaXplTWluOiA1LFxyXG4gICAgICAgIHNpemVNYXg6IDgwLFxyXG4gICAgICAgIHBhZGRpbmc6IDJcclxuICAgIH07XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBpZihjdXN0b20pe1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ29ycmVsYXRpb25NYXRyaXggZXh0ZW5kcyBDaGFydHtcclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIG5ldyBDb3JyZWxhdGlvbk1hdHJpeENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKXtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBDb3JyZWxhdGlvbk1hdHJpeENvbmZpZyhjb25maWcpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKXtcclxuICAgICAgICB2YXIgc2VsZj10aGlzO1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSB0aGlzLmNvbmZpZy5tYXJnaW47XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICB0aGlzLnBsb3Q9e1xyXG4gICAgICAgICAgICB4OiB7fSxcclxuICAgICAgICAgICAgY29ycmVsYXRpb246e1xyXG4gICAgICAgICAgICAgICAgbWF0cml4OiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBjZWxsczogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgY29sb3I6IHt9LFxyXG4gICAgICAgICAgICAgICAgc2hhcGU6e31cclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnNldHVwVmFyaWFibGVzKCk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gY29uZi53aWR0aDtcclxuICAgICAgICB2YXIgcGxhY2Vob2xkZXJOb2RlID0gZDMuc2VsZWN0KHRoaXMucGxhY2Vob2xkZXJTZWxlY3Rvcikubm9kZSgpO1xyXG5cclxuICAgICAgICB2YXIgcGFyZW50V2lkdGggPSBwbGFjZWhvbGRlck5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XHJcbiAgICAgICAgaWYod2lkdGgpe1xyXG5cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxTaXplID0gdGhpcy5jb25maWcuY2VsbC5zaXplO1xyXG5cclxuICAgICAgICAgICAgaWYoIXRoaXMucGxvdC5jZWxsU2l6ZSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuY2VsbFNpemUgPSBNYXRoLm1heChjb25mLmNlbGwuc2l6ZU1heCxNYXRoLm1pbihjb25mLmNlbGwuc2l6ZU1heCwgcGFyZW50V2lkdGgvdGhpcy5wbG90LnZhcmlhYmxlcy5sZW5ndGgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgd2lkdGggPSB0aGlzLnBsb3QuY2VsbFNpemUqdGhpcy5wbG90LnZhcmlhYmxlcy5sZW5ndGggKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodDtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZighd2lkdGgpe1xyXG5cclxuXHJcbiAgICAgICAgICAgIHdpZHRoID0gTWF0aC5taW4ocGFyZW50V2lkdGgsIG1heFdpZHRoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIXRoaXMucGxvdC5jZWxsU2l6ZSl7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaGVpZ2h0ID0gd2lkdGg7XHJcbiAgICAgICAgaWYoIWhlaWdodCl7XHJcbiAgICAgICAgICAgIGhlaWdodCA9cGxhY2Vob2xkZXJOb2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC53aWR0aCA9IHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XHJcbiAgICAgICAgdGhpcy5wbG90LmhlaWdodCA9IGhlaWdodCAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cFZhcmlhYmxlc1NjYWxlcygpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBDb3JyZWxhdGlvblNjYWxlcygpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBDb3JyZWxhdGlvbk1hdHJpeCgpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXBWYXJpYWJsZXNTY2FsZXMoKXtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHggPSBwbG90Lng7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZy52YXJpYWJsZXM7XHJcblxyXG4gICAgICAgIC8qICpcclxuICAgICAgICAgKiB2YWx1ZSBhY2Nlc3NvciAtIHJldHVybnMgdGhlIHZhbHVlIHRvIGVuY29kZSBmb3IgYSBnaXZlbiBkYXRhIG9iamVjdC5cclxuICAgICAgICAgKiBzY2FsZSAtIG1hcHMgdmFsdWUgdG8gYSB2aXN1YWwgZGlzcGxheSBlbmNvZGluZywgc3VjaCBhcyBhIHBpeGVsIHBvc2l0aW9uLlxyXG4gICAgICAgICAqIG1hcCBmdW5jdGlvbiAtIG1hcHMgZnJvbSBkYXRhIHZhbHVlIHRvIGRpc3BsYXkgdmFsdWVcclxuICAgICAgICAgKiBheGlzIC0gc2V0cyB1cCBheGlzXHJcbiAgICAgICAgICoqL1xyXG4gICAgICAgIHgudmFsdWUgPSBjb25mLnZhbHVlO1xyXG4gICAgICAgIHguc2NhbGUgPSBkMy5zY2FsZVtjb25mLnNjYWxlXSgpLnJhbmdlQmFuZHMoW3Bsb3Qud2lkdGgsIDBdKTtcclxuICAgICAgICB4Lm1hcCA9IGQgPT4geC5zY2FsZSh4LnZhbHVlKGQpKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwQ29ycmVsYXRpb25TY2FsZXMoKXtcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgY29yckNvbmYgPSB0aGlzLmNvbmZpZy5jb3JyZWxhdGlvbjtcclxuXHJcbiAgICAgICAgcGxvdC5jb3JyZWxhdGlvbi5jb2xvci5zY2FsZSA9IGQzLnNjYWxlW2NvcnJDb25mLnNjYWxlXSgpLmRvbWFpbihjb3JyQ29uZi5kb21haW4pLnJhbmdlKGNvcnJDb25mLnJhbmdlKTtcclxuICAgICAgICB2YXIgc2hhcGUgPSBwbG90LmNvcnJlbGF0aW9uLnNoYXBlID17fTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxDb25mID0gdGhpcy5jb25maWcuY2VsbDtcclxuICAgICAgICBzaGFwZS50eXBlID0gY2VsbENvbmYuc2hhcGU7XHJcblxyXG4gICAgICAgIHZhciBzaGFwZVNpemUgPSBwbG90LmNlbGxTaXplIC0gY2VsbENvbmYucGFkZGluZyoyO1xyXG4gICAgICAgIGlmKHNoYXBlLnR5cGUgPT0gJ2NpcmNsZScpe1xyXG4gICAgICAgICAgICB2YXIgcmFkaXVzTWF4ID0gc2hhcGVTaXplLzI7XHJcbiAgICAgICAgICAgIHNoYXBlLnJhZGl1c1NjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFswLCAxXSkucmFuZ2UoWzIsIHJhZGl1c01heF0pO1xyXG4gICAgICAgICAgICBzaGFwZS5yYWRpdXMgPSBjPT4gc2hhcGUucmFkaXVzU2NhbGUoTWF0aC5hYnMoYy52YWx1ZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcblxyXG4gICAgc2V0dXBWYXJpYWJsZXMoKXtcclxuXHJcbiAgICAgICAgdmFyIHZhcmlhYmxlc0NvbmYgPSB0aGlzLmNvbmZpZy52YXJpYWJsZXM7XHJcblxyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHBsb3QuZG9tYWluQnlWYXJpYWJsZSA9IHt9O1xyXG4gICAgICAgIHBsb3QudmFyaWFibGVzID0gdmFyaWFibGVzQ29uZi5rZXlzO1xyXG4gICAgICAgIGlmKCFwbG90LnZhcmlhYmxlcyB8fCAhcGxvdC52YXJpYWJsZXMubGVuZ3RoKXtcclxuICAgICAgICAgICAgcGxvdC52YXJpYWJsZXMgPSBVdGlscy5pbmZlclZhcmlhYmxlcyhkYXRhLCB0aGlzLmNvbmZpZy5ncm91cHMua2V5LCB0aGlzLmNvbmZpZy5pbmNsdWRlSW5QbG90KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBsb3QubGFiZWxzID0gW107XHJcbiAgICAgICAgcGxvdC5sYWJlbEJ5VmFyaWFibGUgPSB7fTtcclxuICAgICAgICBwbG90LnZhcmlhYmxlcy5mb3JFYWNoKCh2YXJpYWJsZUtleSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgcGxvdC5kb21haW5CeVZhcmlhYmxlW3ZhcmlhYmxlS2V5XSA9IGQzLmV4dGVudChkYXRhLCBmdW5jdGlvbihkKSB7IHJldHVybiB2YXJpYWJsZXNDb25mLnZhbHVlKGQsIHZhcmlhYmxlS2V5KSB9KTtcclxuICAgICAgICAgICAgdmFyIGxhYmVsID0gdmFyaWFibGVLZXk7XHJcbiAgICAgICAgICAgIGlmKHZhcmlhYmxlc0NvbmYubGFiZWxzICYmIHZhcmlhYmxlc0NvbmYubGFiZWxzLmxlbmd0aD5pbmRleCl7XHJcblxyXG4gICAgICAgICAgICAgICAgbGFiZWwgPSB2YXJpYWJsZXNDb25mLmxhYmVsc1tpbmRleF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGxvdC5sYWJlbHMucHVzaChsYWJlbCk7XHJcbiAgICAgICAgICAgIHBsb3QubGFiZWxCeVZhcmlhYmxlW3ZhcmlhYmxlS2V5XSA9IGxhYmVsO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhwbG90LmxhYmVsQnlWYXJpYWJsZSk7XHJcblxyXG4gICAgfTtcclxuXHJcblxyXG5cclxuICAgIHNldHVwQ29ycmVsYXRpb25NYXRyaXgoKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgdmFyIG1hdHJpeCA9IHRoaXMucGxvdC5jb3JyZWxhdGlvbi5tYXRyaXggPSBbXTtcclxuICAgICAgICB2YXIgbWF0cml4Q2VsbHMgPSB0aGlzLnBsb3QuY29ycmVsYXRpb24ubWF0cml4LmNlbGxzID0gW107XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcblxyXG4gICAgICAgIHZhciB2YXJpYWJsZVRvVmFsdWVzPSB7fTtcclxuICAgICAgICBwbG90LnZhcmlhYmxlcy5mb3JFYWNoKCh2LCBpKSA9PiB7XHJcblxyXG4gICAgICAgICAgICB2YXJpYWJsZVRvVmFsdWVzW3ZdID0gZGF0YS5tYXAoZD0+cGxvdC54LnZhbHVlKGQsdikpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBwbG90LnZhcmlhYmxlcy5mb3JFYWNoKCh2MSwgaSkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgcm93ID0gW107XHJcbiAgICAgICAgICAgIG1hdHJpeC5wdXNoKHJvdyk7XHJcblxyXG4gICAgICAgICAgICBwbG90LnZhcmlhYmxlcy5mb3JFYWNoKCh2MiwgaikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvcnIgPSAxO1xyXG4gICAgICAgICAgICAgICAgaWYodjEhPXYyKXtcclxuICAgICAgICAgICAgICAgICAgICBjb3JyID0gc2VsZi5jb25maWcuY29ycmVsYXRpb24udmFsdWUodmFyaWFibGVUb1ZhbHVlc1t2MV0sIHZhcmlhYmxlVG9WYWx1ZXNbdjJdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBjZWxsID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvd1ZhcjogdjEsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sVmFyOiB2MixcclxuICAgICAgICAgICAgICAgICAgICByb3c6IGksXHJcbiAgICAgICAgICAgICAgICAgICAgY29sOiBqLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjb3JyXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcm93LnB1c2goY2VsbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbWF0cml4Q2VsbHMucHVzaChjZWxsKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBkcmF3KCl7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlKG5ld0RhdGEpe1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUNlbGxzKCk7XHJcbiAgICAgICAgLy8gdGhpcy51cGRhdGVBeGVzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHVwZGF0ZUNlbGxzKCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGNlbGxDbGFzcyA9IHNlbGYuY29uZmlnLmNzc0NsYXNzUHJlZml4K1wiY2VsbFwiO1xyXG4gICAgICAgIHZhciBjZWxsU2hhcGUgPSBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnR5cGU7XHJcblxyXG5cclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxzID0gc2VsZi5zdmdHLnNlbGVjdEFsbChjZWxsQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBsb3QuY29ycmVsYXRpb24ubWF0cml4LmNlbGxzKTtcclxuXHJcblxyXG4gICAgICAgIGNlbGxzLmVudGVyKCkuYXBwZW5kKGNlbGxTaGFwZSlcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBjZWxsQ2xhc3MpO1xyXG5cclxuICAgICAgICBpZihwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnR5cGU9PSdjaXJjbGUnKXtcclxuICAgICAgICAgICAgY2VsbHMuYXR0cihcInJcIiwgcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5yYWRpdXMpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImN4XCIsIGMgPT4gcGxvdC5jZWxsU2l6ZSAqIGMuY29sICsgcGxvdC5jZWxsU2l6ZS8yKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCBjID0+IHBsb3QuY2VsbFNpemUgKiBjLnJvdyArIHBsb3QuY2VsbFNpemUvMik7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgaWYocGxvdC50b29sdGlwKXtcclxuICAgICAgICAgICAgY2VsbHMub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oYykge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAuOSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IGMudmFsdWUgO1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLmh0bWwoaHRtbClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2VsbHMuc3R5bGUoXCJmaWxsXCIsIGM9PiBwbG90LmNvcnJlbGF0aW9uLmNvbG9yLnNjYWxlKGMudmFsdWUpKTtcclxuXHJcbiAgICAgICAgY2VsbHMuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuIiwiZXhwb3J0IHtTY2F0dGVyUGxvdCwgU2NhdHRlclBsb3RDb25maWd9IGZyb20gXCIuL3NjYXR0ZXJwbG90XCI7XHJcbmV4cG9ydCB7U2NhdHRlclBsb3RNYXRyaXgsIFNjYXR0ZXJQbG90TWF0cml4Q29uZmlnfSBmcm9tIFwiLi9zY2F0dGVycGxvdC1tYXRyaXhcIjtcclxuZXhwb3J0IHtDb3JyZWxhdGlvbk1hdHJpeCwgQ29ycmVsYXRpb25NYXRyaXhDb25maWd9IGZyb20gJy4vY29ycmVsYXRpb24tbWF0cml4J1xyXG5leHBvcnQge1N0YXRpc3RpY3NVdGlsc30gZnJvbSAnLi9zdGF0aXN0aWNzLXV0aWxzJ1xyXG4vLyBleHBvcnQge3NhbXBsZUNvcnJlbGF0aW9ufSBmcm9tICcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy9zYW1wbGVfY29ycmVsYXRpb24nXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiIsImltcG9ydCB7Q2hhcnQsIENoYXJ0Q29uZmlnfSBmcm9tIFwiLi9jaGFydFwiO1xyXG5pbXBvcnQge1NjYXR0ZXJQbG90Q29uZmlnfSBmcm9tIFwiLi9zY2F0dGVycGxvdFwiO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFNjYXR0ZXJQbG90TWF0cml4Q29uZmlnIGV4dGVuZHMgU2NhdHRlclBsb3RDb25maWd7XHJcblxyXG4gICAgc3ZnQ2xhc3M9ICdtdy1kMy1zY2F0dGVycGxvdC1tYXRyaXgnO1xyXG4gICAgc2l6ZT0gMjAwOyAvL3NjYXR0ZXIgcGxvdCBjZWxsIHNpemVcclxuICAgIHBhZGRpbmc9IDIwOyAvL3NjYXR0ZXIgcGxvdCBjZWxsIHBhZGRpbmdcclxuICAgIGJydXNoPSB0cnVlO1xyXG4gICAgZ3VpZGVzPSB0cnVlOyAvL3Nob3cgYXhpcyBndWlkZXNcclxuICAgIHRvb2x0aXA9IHRydWU7IC8vc2hvdyB0b29sdGlwIG9uIGRvdCBob3ZlclxyXG4gICAgdGlja3M9IHVuZGVmaW5lZDsgLy90aWNrcyBudW1iZXIsIChkZWZhdWx0OiBjb21wdXRlZCB1c2luZyBjZWxsIHNpemUpXHJcbiAgICB4PXsvLyBYIGF4aXMgY29uZmlnXHJcbiAgICAgICAgb3JpZW50OiBcImJvdHRvbVwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiXHJcbiAgICB9O1xyXG4gICAgeT17Ly8gWSBheGlzIGNvbmZpZ1xyXG4gICAgICAgIG9yaWVudDogXCJsZWZ0XCIsXHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCJcclxuICAgIH07XHJcbiAgICBncm91cHM9e1xyXG4gICAgICAgIGtleTogdW5kZWZpbmVkLCAvL29iamVjdCBwcm9wZXJ0eSBuYW1lIG9yIGFycmF5IGluZGV4IHdpdGggZ3JvdXBpbmcgdmFyaWFibGVcclxuICAgICAgICBpbmNsdWRlSW5QbG90OiBmYWxzZSwgLy9pbmNsdWRlIGdyb3VwIGFzIHZhcmlhYmxlIGluIHBsb3QsIGJvb2xlYW4gKGRlZmF1bHQ6IGZhbHNlKVxyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihkLCBrZXkpIHsgcmV0dXJuIGRba2V5XSB9LCAvLyBncm91cGluZyB2YWx1ZSBhY2Nlc3NvcixcclxuICAgICAgICBsYWJlbDogXCJcIlxyXG4gICAgfTtcclxuICAgIHZhcmlhYmxlcz0ge1xyXG4gICAgICAgIGxhYmVsczogW10sIC8vb3B0aW9uYWwgYXJyYXkgb2YgdmFyaWFibGUgbGFiZWxzIChmb3IgdGhlIGRpYWdvbmFsIG9mIHRoZSBwbG90KS5cclxuICAgICAgICBrZXlzOiBbXSwgLy9vcHRpb25hbCBhcnJheSBvZiB2YXJpYWJsZSBrZXlzXHJcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIChkLCB2YXJpYWJsZUtleSkgey8vIHZhcmlhYmxlIHZhbHVlIGFjY2Vzc29yXHJcbiAgICAgICAgICAgIHJldHVybiBkW3ZhcmlhYmxlS2V5XTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgLy8gdGhpcy5zdmdDbGFzcyA9ICdtdy1kMy1zY2F0dGVycGxvdC1tYXRyaXgnO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGN1c3RvbSk7XHJcbiAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTY2F0dGVyUGxvdE1hdHJpeCBleHRlbmRzIENoYXJ0IHtcclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIG5ldyBTY2F0dGVyUGxvdE1hdHJpeENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgU2NhdHRlclBsb3RNYXRyaXhDb25maWcoY29uZmlnKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCkge1xyXG5cclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSB0aGlzLmNvbmZpZy5tYXJnaW47XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICB0aGlzLnBsb3QgPSB7XHJcbiAgICAgICAgICAgIHg6IHt9LFxyXG4gICAgICAgICAgICB5OiB7fSxcclxuICAgICAgICAgICAgZG90OiB7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogbnVsbC8vY29sb3Igc2NhbGUgbWFwcGluZyBmdW5jdGlvblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cFZhcmlhYmxlcygpO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3Quc2l6ZSA9IGNvbmYuc2l6ZTtcclxuXHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IGNvbmYud2lkdGg7XHJcbiAgICAgICAgdmFyIHBsYWNlaG9sZGVyTm9kZSA9IGQzLnNlbGVjdCh0aGlzLnBsYWNlaG9sZGVyU2VsZWN0b3IpLm5vZGUoKTtcclxuXHJcbiAgICAgICAgaWYgKCF3aWR0aCkge1xyXG4gICAgICAgICAgICB2YXIgbWF4V2lkdGggPSBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodCArIHRoaXMucGxvdC52YXJpYWJsZXMubGVuZ3RoKnRoaXMucGxvdC5zaXplO1xyXG4gICAgICAgICAgICB3aWR0aCA9IE1hdGgubWluKHBsYWNlaG9sZGVyTm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCwgbWF4V2lkdGgpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IHdpZHRoO1xyXG4gICAgICAgIGlmICghaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGhlaWdodCA9IHBsYWNlaG9sZGVyTm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnBsb3Qud2lkdGggPSB3aWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0O1xyXG4gICAgICAgIHRoaXMucGxvdC5oZWlnaHQgPSBoZWlnaHQgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAgaWYoY29uZi50aWNrcz09PXVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIGNvbmYudGlja3MgPSB0aGlzLnBsb3Quc2l6ZSAvIDQwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cFgoKTtcclxuICAgICAgICB0aGlzLnNldHVwWSgpO1xyXG5cclxuICAgICAgICBpZiAoY29uZi5kb3QuZDNDb2xvckNhdGVnb3J5KSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5kb3QuY29sb3JDYXRlZ29yeSA9IGQzLnNjYWxlW2NvbmYuZG90LmQzQ29sb3JDYXRlZ29yeV0oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNvbG9yVmFsdWUgPSBjb25mLmRvdC5jb2xvcjtcclxuICAgICAgICBpZiAoY29sb3JWYWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yVmFsdWUgPSBjb2xvclZhbHVlO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb2xvclZhbHVlID09PSAnc3RyaW5nJyB8fCBjb2xvclZhbHVlIGluc3RhbmNlb2YgU3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yID0gY29sb3JWYWx1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnBsb3QuZG90LmNvbG9yQ2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5kb3QuY29sb3IgPSBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnBsb3QuZG90LmNvbG9yQ2F0ZWdvcnkoc2VsZi5wbG90LmRvdC5jb2xvclZhbHVlKGQpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBWYXJpYWJsZXMoKSB7XHJcbiAgICAgICAgdmFyIHZhcmlhYmxlc0NvbmYgPSB0aGlzLmNvbmZpZy52YXJpYWJsZXM7XHJcblxyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHBsb3QuZG9tYWluQnlWYXJpYWJsZSA9IHt9O1xyXG4gICAgICAgIHBsb3QudmFyaWFibGVzID0gdmFyaWFibGVzQ29uZi5rZXlzO1xyXG4gICAgICAgIGlmKCFwbG90LnZhcmlhYmxlcyB8fCAhcGxvdC52YXJpYWJsZXMubGVuZ3RoKXtcclxuICAgICAgICAgICAgcGxvdC52YXJpYWJsZXMgPSBVdGlscy5pbmZlclZhcmlhYmxlcyhkYXRhLCB0aGlzLmNvbmZpZy5ncm91cHMua2V5LCB0aGlzLmNvbmZpZy5pbmNsdWRlSW5QbG90KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBsb3QubGFiZWxzID0gW107XHJcbiAgICAgICAgcGxvdC5sYWJlbEJ5VmFyaWFibGUgPSB7fTtcclxuICAgICAgICBwbG90LnZhcmlhYmxlcy5mb3JFYWNoKGZ1bmN0aW9uKHZhcmlhYmxlS2V5LCBpbmRleCkge1xyXG4gICAgICAgICAgICBwbG90LmRvbWFpbkJ5VmFyaWFibGVbdmFyaWFibGVLZXldID0gZDMuZXh0ZW50KGRhdGEsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHZhcmlhYmxlc0NvbmYudmFsdWUoZCwgdmFyaWFibGVLZXkpIH0pO1xyXG4gICAgICAgICAgICB2YXIgbGFiZWwgPSB2YXJpYWJsZUtleTtcclxuICAgICAgICAgICAgaWYodmFyaWFibGVzQ29uZi5sYWJlbHMgJiYgdmFyaWFibGVzQ29uZi5sYWJlbHMubGVuZ3RoPmluZGV4KXtcclxuXHJcbiAgICAgICAgICAgICAgICBsYWJlbCA9IHZhcmlhYmxlc0NvbmYubGFiZWxzW2luZGV4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwbG90LmxhYmVscy5wdXNoKGxhYmVsKTtcclxuICAgICAgICAgICAgcGxvdC5sYWJlbEJ5VmFyaWFibGVbdmFyaWFibGVLZXldID0gbGFiZWw7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHBsb3QubGFiZWxCeVZhcmlhYmxlKTtcclxuXHJcbiAgICAgICAgcGxvdC5zdWJwbG90cyA9IFtdO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cFgoKSB7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB4ID0gcGxvdC54O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcblxyXG4gICAgICAgIHgudmFsdWUgPSBjb25mLnZhcmlhYmxlcy52YWx1ZTtcclxuICAgICAgICB4LnNjYWxlID0gZDMuc2NhbGVbY29uZi54LnNjYWxlXSgpLnJhbmdlKFtjb25mLnBhZGRpbmcgLyAyLCBwbG90LnNpemUgLSBjb25mLnBhZGRpbmcgLyAyXSk7XHJcbiAgICAgICAgeC5tYXAgPSBmdW5jdGlvbiAoZCwgdmFyaWFibGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHguc2NhbGUoeC52YWx1ZShkLCB2YXJpYWJsZSkpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgeC5heGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh4LnNjYWxlKS5vcmllbnQoY29uZi54Lm9yaWVudCkudGlja3MoY29uZi50aWNrcyk7XHJcbiAgICAgICAgeC5heGlzLnRpY2tTaXplKHBsb3Quc2l6ZSAqIHBsb3QudmFyaWFibGVzLmxlbmd0aCk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cFkoKSB7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB5ID0gcGxvdC55O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcblxyXG4gICAgICAgIHkudmFsdWUgPSBjb25mLnZhcmlhYmxlcy52YWx1ZTtcclxuICAgICAgICB5LnNjYWxlID0gZDMuc2NhbGVbY29uZi55LnNjYWxlXSgpLnJhbmdlKFsgcGxvdC5zaXplIC0gY29uZi5wYWRkaW5nIC8gMiwgY29uZi5wYWRkaW5nIC8gMl0pO1xyXG4gICAgICAgIHkubWFwID0gZnVuY3Rpb24gKGQsIHZhcmlhYmxlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB5LnNjYWxlKHkudmFsdWUoZCwgdmFyaWFibGUpKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHkuYXhpcz0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh5LnNjYWxlKS5vcmllbnQoY29uZi55Lm9yaWVudCkudGlja3MoY29uZi50aWNrcyk7XHJcbiAgICAgICAgeS5heGlzLnRpY2tTaXplKC1wbG90LnNpemUgKiBwbG90LnZhcmlhYmxlcy5sZW5ndGgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBkcmF3KCkge1xyXG4gICAgICAgIHZhciBzZWxmID10aGlzO1xyXG4gICAgICAgIHZhciBuID0gc2VsZi5wbG90LnZhcmlhYmxlcy5sZW5ndGg7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwiLm13LWF4aXMteC5tdy1heGlzXCIpXHJcbiAgICAgICAgICAgIC5kYXRhKHNlbGYucGxvdC52YXJpYWJsZXMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm13LWF4aXMteCBtdy1heGlzXCIrKGNvbmYuZ3VpZGVzID8gJycgOiAnIG13LW5vLWd1aWRlcycpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIChuIC0gaSAtIDEpICogc2VsZi5wbG90LnNpemUgKyBcIiwwKVwiOyB9KVxyXG4gICAgICAgICAgICAuZWFjaChmdW5jdGlvbihkKSB7IHNlbGYucGxvdC54LnNjYWxlLmRvbWFpbihzZWxmLnBsb3QuZG9tYWluQnlWYXJpYWJsZVtkXSk7IGQzLnNlbGVjdCh0aGlzKS5jYWxsKHNlbGYucGxvdC54LmF4aXMpOyB9KTtcclxuXHJcbiAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcIi5tdy1heGlzLXkubXctYXhpc1wiKVxyXG4gICAgICAgICAgICAuZGF0YShzZWxmLnBsb3QudmFyaWFibGVzKVxyXG4gICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJtdy1heGlzLXkgbXctYXhpc1wiKyhjb25mLmd1aWRlcyA/ICcnIDogJyBtdy1uby1ndWlkZXMnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoMCxcIiArIGkgKiBzZWxmLnBsb3Quc2l6ZSArIFwiKVwiOyB9KVxyXG4gICAgICAgICAgICAuZWFjaChmdW5jdGlvbihkKSB7IHNlbGYucGxvdC55LnNjYWxlLmRvbWFpbihzZWxmLnBsb3QuZG9tYWluQnlWYXJpYWJsZVtkXSk7IGQzLnNlbGVjdCh0aGlzKS5jYWxsKHNlbGYucGxvdC55LmF4aXMpOyB9KTtcclxuXHJcblxyXG4gICAgICAgIGlmKGNvbmYudG9vbHRpcCl7XHJcbiAgICAgICAgICAgIHNlbGYucGxvdC50b29sdGlwID0gdGhpcy51dGlscy5zZWxlY3RPckFwcGVuZChkMy5zZWxlY3Qoc2VsZi5wbGFjZWhvbGRlclNlbGVjdG9yKSwgJ2Rpdi5tdy10b29sdGlwJywgJ2RpdicpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibXctdG9vbHRpcFwiKVxyXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBjZWxsID0gc2VsZi5zdmdHLnNlbGVjdEFsbChcIi5tdy1jZWxsXCIpXHJcbiAgICAgICAgICAgIC5kYXRhKHNlbGYudXRpbHMuY3Jvc3Moc2VsZi5wbG90LnZhcmlhYmxlcywgc2VsZi5wbG90LnZhcmlhYmxlcykpXHJcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm13LWNlbGxcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAobiAtIGQuaSAtIDEpICogc2VsZi5wbG90LnNpemUgKyBcIixcIiArIGQuaiAqIHNlbGYucGxvdC5zaXplICsgXCIpXCI7IH0pO1xyXG5cclxuICAgICAgICBpZihjb25mLmJydXNoKXtcclxuICAgICAgICAgICAgdGhpcy5kcmF3QnJ1c2goY2VsbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjZWxsLmVhY2gocGxvdFN1YnBsb3QpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIC8vTGFiZWxzXHJcbiAgICAgICAgY2VsbC5maWx0ZXIoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pID09PSBkLmo7IH0pLmFwcGVuZChcInRleHRcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIGNvbmYucGFkZGluZylcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIGNvbmYucGFkZGluZylcclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCBcIi43MWVtXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHNlbGYucGxvdC5sYWJlbEJ5VmFyaWFibGVbZC54XTsgfSk7XHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBsb3RTdWJwbG90KHApIHtcclxuICAgICAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgICAgIHBsb3Quc3VicGxvdHMucHVzaChwKTtcclxuICAgICAgICAgICAgdmFyIGNlbGwgPSBkMy5zZWxlY3QodGhpcyk7XHJcblxyXG4gICAgICAgICAgICBwbG90Lnguc2NhbGUuZG9tYWluKHBsb3QuZG9tYWluQnlWYXJpYWJsZVtwLnhdKTtcclxuICAgICAgICAgICAgcGxvdC55LnNjYWxlLmRvbWFpbihwbG90LmRvbWFpbkJ5VmFyaWFibGVbcC55XSk7XHJcblxyXG4gICAgICAgICAgICBjZWxsLmFwcGVuZChcInJlY3RcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJtdy1mcmFtZVwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIGNvbmYucGFkZGluZyAvIDIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInlcIiwgY29uZi5wYWRkaW5nIC8gMilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgY29uZi5zaXplIC0gY29uZi5wYWRkaW5nKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgY29uZi5zaXplIC0gY29uZi5wYWRkaW5nKTtcclxuXHJcblxyXG4gICAgICAgICAgICBwLnVwZGF0ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3VicGxvdCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZG90cyA9IGNlbGwuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmRhdGEoc2VsZi5kYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICBkb3RzLmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGRvdHMuYXR0cihcImN4XCIsIGZ1bmN0aW9uKGQpe3JldHVybiBwbG90LngubWFwKGQsIHN1YnBsb3QueCl9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiY3lcIiwgZnVuY3Rpb24oZCl7cmV0dXJuIHBsb3QueS5tYXAoZCwgc3VicGxvdC55KX0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJyXCIsIHNlbGYuY29uZmlnLmRvdC5yYWRpdXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwbG90LmRvdC5jb2xvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvdHMuc3R5bGUoXCJmaWxsXCIsIHBsb3QuZG90LmNvbG9yKVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmKHBsb3QudG9vbHRpcCl7XHJcbiAgICAgICAgICAgICAgICAgICAgZG90cy5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbihkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIC45KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGh0bWwgPSBcIihcIiArIHBsb3QueC52YWx1ZShkLCBzdWJwbG90LngpICsgXCIsIFwiICtwbG90LnkudmFsdWUoZCwgc3VicGxvdC55KSArIFwiKVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAuaHRtbChodG1sKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZDMuZXZlbnQucGFnZVggKyA1KSArIFwicHhcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdyb3VwID0gc2VsZi5jb25maWcuZ3JvdXBzLnZhbHVlKGQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihncm91cCB8fCBncm91cD09PTAgKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwrPVwiPGJyLz5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYWJlbCA9IHNlbGYuY29uZmlnLmdyb3Vwcy5sYWJlbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGxhYmVsKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sKz1sYWJlbCtcIjogXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sKz1ncm91cFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC5odG1sKGh0bWwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkMy5ldmVudC5wYWdlWSAtIDI4KSArIFwicHhcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZG90cy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBwLnVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfTtcclxuXHJcbiAgICB1cGRhdGUoKSB7XHJcbiAgICAgICAgdGhpcy5wbG90LnN1YnBsb3RzLmZvckVhY2goZnVuY3Rpb24ocCl7cC51cGRhdGUoKX0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBkcmF3QnJ1c2goY2VsbCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgYnJ1c2ggPSBkMy5zdmcuYnJ1c2goKVxyXG4gICAgICAgICAgICAueChzZWxmLnBsb3QueC5zY2FsZSlcclxuICAgICAgICAgICAgLnkoc2VsZi5wbG90Lnkuc2NhbGUpXHJcbiAgICAgICAgICAgIC5vbihcImJydXNoc3RhcnRcIiwgYnJ1c2hzdGFydClcclxuICAgICAgICAgICAgLm9uKFwiYnJ1c2hcIiwgYnJ1c2htb3ZlKVxyXG4gICAgICAgICAgICAub24oXCJicnVzaGVuZFwiLCBicnVzaGVuZCk7XHJcblxyXG4gICAgICAgIGNlbGwuYXBwZW5kKFwiZ1wiKS5jYWxsKGJydXNoKTtcclxuXHJcblxyXG4gICAgICAgIHZhciBicnVzaENlbGw7XHJcblxyXG4gICAgICAgIC8vIENsZWFyIHRoZSBwcmV2aW91c2x5LWFjdGl2ZSBicnVzaCwgaWYgYW55LlxyXG4gICAgICAgIGZ1bmN0aW9uIGJydXNoc3RhcnQocCkge1xyXG4gICAgICAgICAgICBpZiAoYnJ1c2hDZWxsICE9PSB0aGlzKSB7XHJcbiAgICAgICAgICAgICAgICBkMy5zZWxlY3QoYnJ1c2hDZWxsKS5jYWxsKGJydXNoLmNsZWFyKCkpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wbG90Lnguc2NhbGUuZG9tYWluKHNlbGYucGxvdC5kb21haW5CeVZhcmlhYmxlW3AueF0pO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wbG90Lnkuc2NhbGUuZG9tYWluKHNlbGYucGxvdC5kb21haW5CeVZhcmlhYmxlW3AueV0pO1xyXG4gICAgICAgICAgICAgICAgYnJ1c2hDZWxsID0gdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSGlnaGxpZ2h0IHRoZSBzZWxlY3RlZCBjaXJjbGVzLlxyXG4gICAgICAgIGZ1bmN0aW9uIGJydXNobW92ZShwKSB7XHJcbiAgICAgICAgICAgIHZhciBlID0gYnJ1c2guZXh0ZW50KCk7XHJcbiAgICAgICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJjaXJjbGVcIikuY2xhc3NlZChcImhpZGRlblwiLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVbMF1bMF0gPiBkW3AueF0gfHwgZFtwLnhdID4gZVsxXVswXVxyXG4gICAgICAgICAgICAgICAgICAgIHx8IGVbMF1bMV0gPiBkW3AueV0gfHwgZFtwLnldID4gZVsxXVsxXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIElmIHRoZSBicnVzaCBpcyBlbXB0eSwgc2VsZWN0IGFsbCBjaXJjbGVzLlxyXG4gICAgICAgIGZ1bmN0aW9uIGJydXNoZW5kKCkge1xyXG4gICAgICAgICAgICBpZiAoYnJ1c2guZW1wdHkoKSkgc2VsZi5zdmdHLnNlbGVjdEFsbChcIi5oaWRkZW5cIikuY2xhc3NlZChcImhpZGRlblwiLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSIsImltcG9ydCB7Q2hhcnQsIENoYXJ0Q29uZmlnfSBmcm9tIFwiLi9jaGFydFwiO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFNjYXR0ZXJQbG90Q29uZmlnIGV4dGVuZHMgQ2hhcnRDb25maWd7XHJcblxyXG4gICAgc3ZnQ2xhc3M9ICdtdy1kMy1zY2F0dGVycGxvdCc7XHJcbiAgICBndWlkZXM9IGZhbHNlOyAvL3Nob3cgYXhpcyBndWlkZXNcclxuICAgIHRvb2x0aXA9IHRydWU7IC8vc2hvdyB0b29sdGlwIG9uIGRvdCBob3ZlclxyXG4gICAgeD17Ly8gWCBheGlzIGNvbmZpZ1xyXG4gICAgICAgIGxhYmVsOiAnWCcsIC8vIGF4aXMgbGFiZWxcclxuICAgICAgICBrZXk6IDAsXHJcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGQsIGtleSkgeyByZXR1cm4gZFtrZXldIH0sIC8vIHggdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICBvcmllbnQ6IFwiYm90dG9tXCIsXHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCJcclxuICAgIH07XHJcbiAgICB5PXsvLyBZIGF4aXMgY29uZmlnXHJcbiAgICAgICAgbGFiZWw6ICdZJywgLy8gYXhpcyBsYWJlbCxcclxuICAgICAgICBrZXk6IDEsXHJcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGQsIGtleSkgeyByZXR1cm4gZFtrZXldIH0sIC8vIHkgdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICBvcmllbnQ6IFwibGVmdFwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiXHJcbiAgICB9O1xyXG4gICAgZ3JvdXBzPXtcclxuICAgICAgICBrZXk6IDIsXHJcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGQsIGtleSkgeyByZXR1cm4gZFtrZXldIH0sIC8vIGdyb3VwaW5nIHZhbHVlIGFjY2Vzc29yLFxyXG4gICAgICAgIGxhYmVsOiBcIlwiXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB2YXIgY29uZmlnID0gdGhpcztcclxuICAgICAgICB0aGlzLmRvdD17XHJcbiAgICAgICAgICAgIHJhZGl1czogMixcclxuICAgICAgICAgICAgY29sb3I6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGNvbmZpZy5ncm91cHMudmFsdWUoZCwgY29uZmlnLmdyb3Vwcy5rZXkpIH0sIC8vIHN0cmluZyBvciBmdW5jdGlvbiByZXR1cm5pbmcgY29sb3IncyB2YWx1ZSBmb3IgY29sb3Igc2NhbGVcclxuICAgICAgICAgICAgZDNDb2xvckNhdGVnb3J5OiAnY2F0ZWdvcnkxMCdcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZihjdXN0b20pe1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNjYXR0ZXJQbG90IGV4dGVuZHMgQ2hhcnR7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBzdXBlcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBuZXcgU2NhdHRlclBsb3RDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZyl7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgU2NhdHRlclBsb3RDb25maWcoY29uZmlnKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCl7XHJcbiAgICAgICAgdmFyIHNlbGY9dGhpcztcclxuICAgICAgICB2YXIgbWFyZ2luID0gdGhpcy5jb25maWcubWFyZ2luO1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcbiAgICAgICAgdGhpcy5wbG90PXtcclxuICAgICAgICAgICAgeDoge30sXHJcbiAgICAgICAgICAgIHk6IHt9LFxyXG4gICAgICAgICAgICBkb3Q6IHtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiBudWxsLy9jb2xvciBzY2FsZSBtYXBwaW5nIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBjb25mLndpZHRoO1xyXG4gICAgICAgIHZhciBwbGFjZWhvbGRlck5vZGUgPSBkMy5zZWxlY3QodGhpcy5wbGFjZWhvbGRlclNlbGVjdG9yKS5ub2RlKCk7XHJcblxyXG4gICAgICAgIGlmKCF3aWR0aCl7XHJcbiAgICAgICAgICAgIHdpZHRoID1wbGFjZWhvbGRlck5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBoZWlnaHQgPSBjb25mLmhlaWdodDtcclxuICAgICAgICBpZighaGVpZ2h0KXtcclxuICAgICAgICAgICAgaGVpZ2h0ID1wbGFjZWhvbGRlck5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wbG90LndpZHRoID0gd2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodDtcclxuICAgICAgICB0aGlzLnBsb3QuaGVpZ2h0ID0gaGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBYKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFkoKTtcclxuXHJcbiAgICAgICAgaWYoY29uZi5kb3QuZDNDb2xvckNhdGVnb3J5KXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmRvdC5jb2xvckNhdGVnb3J5ID0gZDMuc2NhbGVbY29uZi5kb3QuZDNDb2xvckNhdGVnb3J5XSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY29sb3JWYWx1ZSA9IGNvbmYuZG90LmNvbG9yO1xyXG4gICAgICAgIGlmKGNvbG9yVmFsdWUpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yVmFsdWUgPSBjb2xvclZhbHVlO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb2xvclZhbHVlID09PSAnc3RyaW5nJyB8fCBjb2xvclZhbHVlIGluc3RhbmNlb2YgU3RyaW5nKXtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5kb3QuY29sb3IgPSBjb2xvclZhbHVlO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZih0aGlzLnBsb3QuZG90LmNvbG9yQ2F0ZWdvcnkpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmRvdC5jb2xvciA9IGZ1bmN0aW9uKGQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnBsb3QuZG90LmNvbG9yQ2F0ZWdvcnkoc2VsZi5wbG90LmRvdC5jb2xvclZhbHVlKGQpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfWVsc2V7XHJcblxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwWCgpe1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeCA9IHBsb3QueDtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnLng7XHJcblxyXG4gICAgICAgIC8qICpcclxuICAgICAgICAgKiB2YWx1ZSBhY2Nlc3NvciAtIHJldHVybnMgdGhlIHZhbHVlIHRvIGVuY29kZSBmb3IgYSBnaXZlbiBkYXRhIG9iamVjdC5cclxuICAgICAgICAgKiBzY2FsZSAtIG1hcHMgdmFsdWUgdG8gYSB2aXN1YWwgZGlzcGxheSBlbmNvZGluZywgc3VjaCBhcyBhIHBpeGVsIHBvc2l0aW9uLlxyXG4gICAgICAgICAqIG1hcCBmdW5jdGlvbiAtIG1hcHMgZnJvbSBkYXRhIHZhbHVlIHRvIGRpc3BsYXkgdmFsdWVcclxuICAgICAgICAgKiBheGlzIC0gc2V0cyB1cCBheGlzXHJcbiAgICAgICAgICoqL1xyXG4gICAgICAgIHgudmFsdWUgPSBkID0+IGNvbmYudmFsdWUoZCwgY29uZi5rZXkpO1xyXG4gICAgICAgIHguc2NhbGUgPSBkMy5zY2FsZVtjb25mLnNjYWxlXSgpLnJhbmdlKFswLCBwbG90LndpZHRoXSk7XHJcbiAgICAgICAgeC5tYXAgPSBmdW5jdGlvbihkKSB7IHJldHVybiB4LnNjYWxlKHgudmFsdWUoZCkpO307XHJcbiAgICAgICAgeC5heGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh4LnNjYWxlKS5vcmllbnQoY29uZi5vcmllbnQpO1xyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIHBsb3QueC5zY2FsZS5kb21haW4oW2QzLm1pbihkYXRhLCBwbG90LngudmFsdWUpLTEsIGQzLm1heChkYXRhLCBwbG90LngudmFsdWUpKzFdKTtcclxuICAgICAgICBpZih0aGlzLmNvbmZpZy5ndWlkZXMpIHtcclxuICAgICAgICAgICAgeC5heGlzLnRpY2tTaXplKC1wbG90LmhlaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBZICgpe1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeSA9IHBsb3QueTtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnLnk7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdmFsdWUgYWNjZXNzb3IgLSByZXR1cm5zIHRoZSB2YWx1ZSB0byBlbmNvZGUgZm9yIGEgZ2l2ZW4gZGF0YSBvYmplY3QuXHJcbiAgICAgICAgICogc2NhbGUgLSBtYXBzIHZhbHVlIHRvIGEgdmlzdWFsIGRpc3BsYXkgZW5jb2RpbmcsIHN1Y2ggYXMgYSBwaXhlbCBwb3NpdGlvbi5cclxuICAgICAgICAgKiBtYXAgZnVuY3Rpb24gLSBtYXBzIGZyb20gZGF0YSB2YWx1ZSB0byBkaXNwbGF5IHZhbHVlXHJcbiAgICAgICAgICogYXhpcyAtIHNldHMgdXAgYXhpc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHkudmFsdWUgPSBkID0+IGNvbmYudmFsdWUoZCwgY29uZi5rZXkpO1xyXG4gICAgICAgIHkuc2NhbGUgPSBkMy5zY2FsZVtjb25mLnNjYWxlXSgpLnJhbmdlKFtwbG90LmhlaWdodCwgMF0pO1xyXG4gICAgICAgIHkubWFwID0gZnVuY3Rpb24oZCkgeyByZXR1cm4geS5zY2FsZSh5LnZhbHVlKGQpKTt9O1xyXG4gICAgICAgIHkuYXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeS5zY2FsZSkub3JpZW50KGNvbmYub3JpZW50KTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5jb25maWcuZ3VpZGVzKXtcclxuICAgICAgICAgICAgeS5heGlzLnRpY2tTaXplKC1wbG90LndpZHRoKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgICAgICBwbG90Lnkuc2NhbGUuZG9tYWluKFtkMy5taW4oZGF0YSwgcGxvdC55LnZhbHVlKS0xLCBkMy5tYXgoZGF0YSwgcGxvdC55LnZhbHVlKSsxXSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRyYXcoKXtcclxuICAgICAgICB0aGlzLmRyYXdBeGlzWCgpO1xyXG4gICAgICAgIHRoaXMuZHJhd0F4aXNZKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhd0F4aXNYKCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBheGlzQ29uZiA9IHRoaXMuY29uZmlnLng7XHJcbiAgICAgICAgc2VsZi5zdmdHLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm13LWF4aXMteCBtdy1heGlzXCIrKHNlbGYuY29uZmlnLmd1aWRlcyA/ICcnIDogJyBtdy1uby1ndWlkZXMnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIHBsb3QuaGVpZ2h0ICsgXCIpXCIpXHJcbiAgICAgICAgICAgIC5jYWxsKHBsb3QueC5heGlzKVxyXG4gICAgICAgICAgICAuYXBwZW5kKFwidGV4dFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibXctbGFiZWxcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrIChwbG90LndpZHRoLzIpICtcIixcIisgKHNlbGYuY29uZmlnLm1hcmdpbi5ib3R0b20pICtcIilcIikgIC8vIHRleHQgaXMgZHJhd24gb2ZmIHRoZSBzY3JlZW4gdG9wIGxlZnQsIG1vdmUgZG93biBhbmQgb3V0IGFuZCByb3RhdGVcclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCBcIi0xZW1cIilcclxuICAgICAgICAgICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoYXhpc0NvbmYubGFiZWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICBkcmF3QXhpc1koKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGF4aXNDb25mID0gdGhpcy5jb25maWcueTtcclxuICAgICAgICBzZWxmLnN2Z0cuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibXctYXhpcyBtdy1heGlzLXlcIisoc2VsZi5jb25maWcuZ3VpZGVzID8gJycgOiAnIG13LW5vLWd1aWRlcycpKVxyXG4gICAgICAgICAgICAuY2FsbChwbG90LnkuYXhpcylcclxuICAgICAgICAgICAgLmFwcGVuZChcInRleHRcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm13LWxhYmVsXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyAtc2VsZi5jb25maWcubWFyZ2luLmxlZnQgK1wiLFwiKyhwbG90LmhlaWdodC8yKStcIilyb3RhdGUoLTkwKVwiKSAgLy8gdGV4dCBpcyBkcmF3biBvZmYgdGhlIHNjcmVlbiB0b3AgbGVmdCwgbW92ZSBkb3duIGFuZCBvdXQgYW5kIHJvdGF0ZVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGF4aXNDb25mLmxhYmVsKTtcclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlKG5ld0RhdGEpe1xyXG4gICAgICAgIC8vIEQzQ2hhcnRCYXNlLnByb3RvdHlwZS51cGRhdGUuY2FsbCh0aGlzLCBuZXdEYXRhKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgdmFyIGRvdHMgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwiLm13LWRvdFwiKVxyXG4gICAgICAgICAgICAuZGF0YShkYXRhKTtcclxuXHJcbiAgICAgICAgZG90cy5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibXctZG90XCIpO1xyXG5cclxuXHJcbiAgICAgICAgZG90cy5hdHRyKFwiclwiLCBzZWxmLmNvbmZpZy5kb3QucmFkaXVzKVxyXG4gICAgICAgICAgICAuYXR0cihcImN4XCIsIHBsb3QueC5tYXApXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY3lcIiwgcGxvdC55Lm1hcCk7XHJcblxyXG4gICAgICAgIGlmKHBsb3QudG9vbHRpcCl7XHJcbiAgICAgICAgICAgIGRvdHMub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAuOSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IFwiKFwiICsgcGxvdC54LnZhbHVlKGQpICsgXCIsIFwiICtwbG90LnkudmFsdWUoZCkgKyBcIilcIjtcclxuICAgICAgICAgICAgICAgIHZhciBncm91cCA9IHNlbGYuY29uZmlnLmdyb3Vwcy52YWx1ZShkLCBzZWxmLmNvbmZpZy5ncm91cHMua2V5KTtcclxuICAgICAgICAgICAgICAgIGlmKGdyb3VwIHx8IGdyb3VwPT09MCApe1xyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwrPVwiPGJyLz5cIjtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSBzZWxmLmNvbmZpZy5ncm91cHMubGFiZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYobGFiZWwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sKz1sYWJlbCtcIjogXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwrPWdyb3VwXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAuaHRtbChodG1sKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkMy5ldmVudC5wYWdlWSAtIDI4KSArIFwicHhcIik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbihkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihwbG90LmRvdC5jb2xvcil7XHJcbiAgICAgICAgICAgIGRvdHMuc3R5bGUoXCJmaWxsXCIsIHBsb3QuZG90LmNvbG9yKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG90cy5leGl0KCkucmVtb3ZlKCk7XHJcblxyXG4gICAgfTtcclxufVxyXG4iLCJ2YXIgc3UgPSBtb2R1bGUuZXhwb3J0cy5TdGF0aXN0aWNzVXRpbHMgPXt9O1xyXG5zdS5zYW1wbGVDb3JyZWxhdGlvbiA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL3NhbXBsZV9jb3JyZWxhdGlvbicpOyIsImV4cG9ydCBjbGFzcyBVdGlscyB7XHJcbiAgICAvLyB1c2FnZSBleGFtcGxlIGRlZXBFeHRlbmQoe30sIG9iakEsIG9iakIpOyA9PiBzaG91bGQgd29yayBzaW1pbGFyIHRvICQuZXh0ZW5kKHRydWUsIHt9LCBvYmpBLCBvYmpCKTtcclxuICAgIHN0YXRpYyBkZWVwRXh0ZW5kKG91dCkge1xyXG5cclxuICAgICAgICB2YXIgdXRpbHMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBlbXB0eU91dCA9IHt9O1xyXG5cclxuXHJcbiAgICAgICAgaWYgKCFvdXQgJiYgYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgQXJyYXkuaXNBcnJheShhcmd1bWVudHNbMV0pKSB7XHJcbiAgICAgICAgICAgIG91dCA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvdXQgPSBvdXQgfHwge307XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGlmICghc291cmNlKVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkob3V0W2tleV0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlzT2JqZWN0ID0gdXRpbHMuaXNPYmplY3Qob3V0W2tleV0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNyY09iaiA9IHV0aWxzLmlzT2JqZWN0KHNvdXJjZVtrZXldKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNPYmplY3QgJiYgIWlzQXJyYXkgJiYgc3JjT2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMuZGVlcEV4dGVuZChvdXRba2V5XSwgc291cmNlW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRba2V5XSA9IHNvdXJjZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgbWVyZ2VEZWVwKHRhcmdldCwgc291cmNlKSB7XHJcbiAgICAgICAgbGV0IG91dHB1dCA9IE9iamVjdC5hc3NpZ24oe30sIHRhcmdldCk7XHJcbiAgICAgICAgaWYgKFV0aWxzLmlzT2JqZWN0Tm90QXJyYXkodGFyZ2V0KSAmJiBVdGlscy5pc09iamVjdE5vdEFycmF5KHNvdXJjZSkpIHtcclxuICAgICAgICAgICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoVXRpbHMuaXNPYmplY3ROb3RBcnJheShzb3VyY2Vba2V5XSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIShrZXkgaW4gdGFyZ2V0KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihvdXRwdXQsIHsgW2tleV06IHNvdXJjZVtrZXldIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0W2tleV0gPSBVdGlscy5tZXJnZURlZXAodGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihvdXRwdXQsIHsgW2tleV06IHNvdXJjZVtrZXldIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY3Jvc3MoYSwgYikge1xyXG4gICAgICAgIHZhciBjID0gW10sIG4gPSBhLmxlbmd0aCwgbSA9IGIubGVuZ3RoLCBpLCBqO1xyXG4gICAgICAgIGZvciAoaSA9IC0xOyArK2kgPCBuOykgZm9yIChqID0gLTE7ICsraiA8IG07KSBjLnB1c2goe3g6IGFbaV0sIGk6IGksIHk6IGJbal0sIGo6IGp9KTtcclxuICAgICAgICByZXR1cm4gYztcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGluZmVyVmFyaWFibGVzKGRhdGEsIGdyb3VwS2V5LCBpbmNsdWRlR3JvdXApIHtcclxuICAgICAgICB2YXIgcmVzID0gW107XHJcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHZhciBkID0gZGF0YVswXTtcclxuICAgICAgICAgICAgaWYgKGQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgcmVzPSAgZC5tYXAoZnVuY3Rpb24gKHYsIGkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZiAodHlwZW9mIGQgPT09ICdvYmplY3QnKXtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIGQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZighZC5oYXNPd25Qcm9wZXJ0eShwcm9wKSkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKHByb3ApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCFpbmNsdWRlR3JvdXApe1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSByZXMuaW5kZXhPZihncm91cEtleSk7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICByZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzXHJcbiAgICB9O1xyXG4gICAgc3RhdGljIGlzT2JqZWN0Tm90QXJyYXkoaXRlbSkge1xyXG4gICAgICAgIHJldHVybiAoaXRlbSAmJiB0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkoaXRlbSkgJiYgaXRlbSAhPT0gbnVsbCk7XHJcbiAgICB9O1xyXG4gICAgc3RhdGljIGlzT2JqZWN0KGEpIHtcclxuICAgICAgICByZXR1cm4gYSAhPT0gbnVsbCAmJiB0eXBlb2YgYSA9PT0gJ29iamVjdCc7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBpc051bWJlcihhKSB7XHJcbiAgICAgICAgcmV0dXJuICFpc05hTihhKSAmJiB0eXBlb2YgYSA9PT0gJ251bWJlcic7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBpc0Z1bmN0aW9uKGEpIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGEgPT09ICdmdW5jdGlvbic7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBzZWxlY3RPckFwcGVuZChwYXJlbnQsIHNlbGVjdG9yLCBlbGVtZW50KSB7XHJcbiAgICAgICAgdmFyIHNlbGVjdGlvbiA9IHBhcmVudC5zZWxlY3Qoc2VsZWN0b3IpO1xyXG4gICAgICAgIGlmKHNlbGVjdGlvbi5lbXB0eSgpKXtcclxuICAgICAgICAgICAgcmV0dXJuIHBhcmVudC5hcHBlbmQoZWxlbWVudCB8fCBzZWxlY3Rvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzZWxlY3Rpb247XHJcbiAgICB9O1xyXG59XHJcbiJdfQ==
