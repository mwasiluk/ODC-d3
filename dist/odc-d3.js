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
    function Chart(base, data, config) {
        _classCallCheck(this, Chart);

        this.utils = _utils.Utils;
        this.plot = {
            margin: {}
        };
        this._attached = {};
        this._layers = {};
        this._events = {};
        this._isInitialized = false;


        this._isAttached = base instanceof Chart;

        this.baseContainer = base;

        this.setConfig(config);

        if (data) {
            this.setData(data);
        }

        this.init();
        this.postInit();
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

            self.initTooltip();
            self.draw();
            this._isInitialized = true;
            return this;
        }
    }, {
        key: 'postInit',
        value: function postInit() {}
    }, {
        key: 'initSvg',
        value: function initSvg() {
            var self = this;
            var config = this.config;
            console.log(config.svgClass);

            var width = self.plot.width + config.margin.left + config.margin.right;
            var height = self.plot.height + config.margin.top + config.margin.bottom;
            var aspect = width / height;
            if (!self._isAttached) {
                if (!this._isInitialized) {
                    d3.select(self.baseContainer).select("svg").remove();
                }
                self.svg = d3.select(self.baseContainer).selectOrAppend("svg");

                self.svg.attr("width", width).attr("height", height).attr("viewBox", "0 0 " + " " + width + " " + height).attr("preserveAspectRatio", "xMidYMid meet").attr("class", config.svgClass);
                self.svgG = self.svg.selectOrAppend("g.main-group");
            } else {
                console.log(self.baseContainer);
                self.svg = self.baseContainer.svg;
                self.svgG = self.svg.selectOrAppend("g.main-group." + config.svgClass);
            }

            self.svgG.attr("transform", "translate(" + config.margin.left + "," + config.margin.top + ")");

            if (!config.width || config.height) {
                d3.select(window).on("resize", function () {
                    //TODO add responsiveness if width/height not specified
                });
            }
        }
    }, {
        key: 'initTooltip',
        value: function initTooltip() {
            var self = this;
            if (self.config.tooltip) {
                if (!self._isAttached) {
                    self.plot.tooltip = d3.select(self.baseContainer).selectOrAppend('div.' + self.config.cssClassPrefix + 'tooltip').style("opacity", 0);
                } else {
                    self.plot.tooltip = self.baseContainer.plot.tooltip;
                }
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
            var layerName, attachmentData;
            for (var attachmentName in this._attached) {

                attachmentData = data;

                this._attached[attachmentName].update(attachmentData);
            }
            console.log('base uppdate');
            return this;
        }
    }, {
        key: 'draw',
        value: function draw(data) {
            this.update(data);

            return this;
        }

        //Borrowed from d3.chart
        /**
         * Register or retrieve an "attachment" Chart. The "attachment" chart's `draw`
         * method will be invoked whenever the containing chart's `draw` method is
         * invoked.
         *
         * @externalExample chart-attach
         *
         * @param {String} attachmentName Name of the attachment
         * @param {Chart} [chart] Chart to register as a mix in of this chart. When
         *        unspecified, this method will return the attachment previously
         *        registered with the specified `attachmentName` (if any).
         *
         * @returns {Chart} Reference to this chart (chainable).
         */

    }, {
        key: 'attach',
        value: function attach(attachmentName, chart) {
            if (arguments.length === 1) {
                return this._attached[attachmentName];
            }

            this._attached[attachmentName] = chart;
            return chart;
        }
    }, {
        key: 'on',


        //Borrowed from d3.chart
        /**
         * Subscribe a callback function to an event triggered on the chart. See {@link
            * Chart#once} to subscribe a callback function to an event for one occurence.
         *
         * @externalExample {runnable} chart-on
         *
         * @param {String} name Name of the event
         * @param {ChartEventHandler} callback Function to be invoked when the event
         *        occurs
         * @param {Object} [context] Value to set as `this` when invoking the
         *        `callback`. Defaults to the chart instance.
         *
         * @returns {Chart} A reference to this chart (chainable).
         */
        value: function on(name, callback, context) {
            var events = this._events[name] || (this._events[name] = []);
            events.push({
                callback: callback,
                context: context || this,
                _chart: this
            });
            return this;
        }

        //Borrowed from d3.chart
        /**
         *
         * Subscribe a callback function to an event triggered on the chart. This
         * function will be invoked at the next occurance of the event and immediately
         * unsubscribed. See {@link Chart#on} to subscribe a callback function to an
         * event indefinitely.
         *
         * @externalExample {runnable} chart-once
         *
         * @param {String} name Name of the event
         * @param {ChartEventHandler} callback Function to be invoked when the event
         *        occurs
         * @param {Object} [context] Value to set as `this` when invoking the
         *        `callback`. Defaults to the chart instance
         *
         * @returns {Chart} A reference to this chart (chainable)
         */

    }, {
        key: 'once',
        value: function once(name, callback, context) {
            var self = this;
            var once = function once() {
                self.off(name, once);
                callback.apply(this, arguments);
            };
            return this.on(name, once, context);
        }

        //Borrowed from d3.chart
        /**
         * Unsubscribe one or more callback functions from an event triggered on the
         * chart. When no arguments are specified, *all* handlers will be unsubscribed.
         * When only a `name` is specified, all handlers subscribed to that event will
         * be unsubscribed. When a `name` and `callback` are specified, only that
         * function will be unsubscribed from that event. When a `name` and `context`
         * are specified (but `callback` is omitted), all events bound to the given
         * event with the given context will be unsubscribed.
         *
         * @externalExample {runnable} chart-off
         *
         * @param {String} [name] Name of the event to be unsubscribed
         * @param {ChartEventHandler} [callback] Function to be unsubscribed
         * @param {Object} [context] Contexts to be unsubscribe
         *
         * @returns {Chart} A reference to this chart (chainable).
         */

    }, {
        key: 'off',
        value: function off(name, callback, context) {
            var names, n, events, event, i, j;

            // remove all events
            if (arguments.length === 0) {
                for (name in this._events) {
                    this._events[name].length = 0;
                }
                return this;
            }

            // remove all events for a specific name
            if (arguments.length === 1) {
                events = this._events[name];
                if (events) {
                    events.length = 0;
                }
                return this;
            }

            // remove all events that match whatever combination of name, context
            // and callback.
            names = name ? [name] : Object.keys(this._events);
            for (i = 0; i < names.length; i++) {
                n = names[i];
                events = this._events[n];
                j = events.length;
                while (j--) {
                    event = events[j];
                    if (callback && callback === event.callback || context && context === event.context) {
                        events.splice(j, 1);
                    }
                }
            }

            return this;
        }
    }, {
        key: 'trigger',


        //Borrowed from d3.chart
        /**
         * Publish an event on this chart with the given `name`.
         *
         * @externalExample {runnable} chart-trigger
         *
         * @param {String} name Name of the event to publish
         * @param {...*} arguments Values with which to invoke the registered
         *        callbacks.
         *
         * @returns {Chart} A reference to this chart (chainable).
         */
        value: function trigger(name) {
            var args = Array.prototype.slice.call(arguments, 1);
            var events = this._events[name];
            var i, ev;

            if (events !== undefined) {
                for (i = 0; i < events.length; i++) {
                    ev = events[i];
                    ev.callback.apply(ev.context, args);
                }
            }

            return this;
        }
    }, {
        key: 'getBaseContainerNode',
        value: function getBaseContainerNode() {
            if (this._isAttached) {
                return this.baseContainer.svg.node();
            }
            return d3.select(this.baseContainer).node();
        }
    }, {
        key: 'prefixClass',
        value: function prefixClass(clazz, addDot) {
            return addDot ? '.' : '' + this.config.cssClassPrefix + clazz;
        }
    }]);

    return Chart;
}();

},{"./utils":16}],9:[function(require,module,exports){
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

var _scatterplot = require('./scatterplot');

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
            var placeholderNode = this.getBaseContainerNode();
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
            var labelClass = self.prefixClass("label");
            var labelXClass = labelClass + "-x";
            var labelYClass = labelClass + "-y";
            plot.labelClass = labelClass;

            var labelsX = self.svgG.selectAll("text." + labelXClass).data(plot.variables, function (d, i) {
                return i;
            });

            labelsX.enter().append("text").attr("class", function (d, i) {
                return labelClass + " " + labelXClass + " " + labelXClass + "-" + i;
            });

            labelsX.attr("x", function (d, i) {
                return i * plot.cellSize + plot.cellSize / 2;
            }).attr("y", plot.height).attr("dx", -2).attr("transform", function (d, i) {
                return "rotate(-90, " + (i * plot.cellSize + plot.cellSize / 2) + ", " + plot.height + ")";
            }).attr("text-anchor", "end")

            // .attr("dominant-baseline", "hanging")
            .text(function (v) {
                return plot.labelByVariable[v];
            });

            labelsX.exit().remove();

            //////

            var labelsY = self.svgG.selectAll("text." + labelYClass).data(plot.variables);

            labelsY.enter().append("text");

            labelsY.attr("x", 0).attr("y", function (d, i) {
                return i * plot.cellSize + plot.cellSize / 2;
            }).attr("dx", -2).attr("text-anchor", "end").attr("class", function (d, i) {
                return labelClass + " " + labelYClass + " " + labelYClass + "-" + i;
            })
            // .attr("dominant-baseline", "hanging")
            .text(function (v) {
                return plot.labelByVariable[v];
            });

            labelsY.exit().remove();
        }
    }, {
        key: 'updateCells',
        value: function updateCells() {

            var self = this;
            var plot = self.plot;
            var cellClass = self.prefixClass("cell");
            var cellShape = plot.correlation.shape.type;

            var cells = self.svgG.selectAll("g." + cellClass).data(plot.correlation.matrix.cells);

            console.log('cells.enter()', cells.enter());

            var cellEnterG = cells.enter().append("g").classed(cellClass, true);
            cells.attr("transform", function (c) {
                return "translate(" + (plot.cellSize * c.col + plot.cellSize / 2) + "," + (plot.cellSize * c.row + plot.cellSize / 2) + ")";
            });

            cells.classed(self.config.cssClassPrefix + "selectable", !!self.scatterPlot);

            var selector = "*:not(.cell-shape-" + cellShape + ")";

            var wrongShapes = cells.selectAll(selector);
            wrongShapes.remove();

            var shapes = cells.selectOrAppend(cellShape + ".cell-shape-" + cellShape);

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
            shapes.style("fill", function (c) {
                return plot.correlation.color.scale(c.value);
            });

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

            cells.on("click", function (c) {
                self.trigger("cell-selected", c);
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
    }, {
        key: 'attachScatterPlot',
        value: function attachScatterPlot(containerSelector, config) {
            var _this3 = this;

            var self = this;

            config = config || {};

            var scatterPlotConfig = {
                height: self.plot.height + self.config.margin.top + self.config.margin.bottom,
                width: self.plot.height + self.config.margin.top + self.config.margin.bottom,
                groups: {
                    key: self.config.groups.key,
                    label: self.config.groups.label
                },
                guides: true
            };

            self.scatterPlot = true;

            scatterPlotConfig = _utils.Utils.deepExtend(scatterPlotConfig, config);
            this.update();

            this.on("cell-selected", function (c) {

                scatterPlotConfig.x = {
                    key: c.rowVar,
                    label: self.plot.labelByVariable[c.rowVar]
                };
                scatterPlotConfig.y = {
                    key: c.colVar,
                    label: self.plot.labelByVariable[c.colVar]
                };
                if (self.scatterPlot && self.scatterPlot !== true) {
                    self.scatterPlot.setConfig(scatterPlotConfig).init();
                } else {
                    self.scatterPlot = new _scatterplot.ScatterPlot(containerSelector, self.data, scatterPlotConfig);
                    _this3.attach("ScatterPlot", self.scatterPlot);
                }
            });
        }
    }]);

    return CorrelationMatrix;
}(_chart.Chart);

},{"./chart":8,"./legend":12,"./scatterplot":14,"./statistics-utils":15,"./utils":16}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.D3Extensions = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var D3Extensions = exports.D3Extensions = function () {
    function D3Extensions() {
        _classCallCheck(this, D3Extensions);
    }

    _createClass(D3Extensions, null, [{
        key: 'extend',
        value: function extend() {

            d3.selection.enter.prototype.appendSelector = d3.selection.prototype.appendSelector = function (selector) {
                return _utils.Utils.appendSelector(this, selector);
            };

            d3.selection.enter.prototype.selectOrAppend = d3.selection.prototype.selectOrAppend = function (selector) {
                return _utils.Utils.selectOrAppend(this, selector);
            };
        }
    }]);

    return D3Extensions;
}();

},{"./utils":16}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StatisticsUtils = exports.CorrelationMatrixConfig = exports.CorrelationMatrix = exports.ScatterPlotMatrixConfig = exports.ScatterPlotMatrix = exports.ScatterPlotConfig = exports.ScatterPlot = undefined;

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

var _d3Extensions = require("./d3-extensions");

_d3Extensions.D3Extensions.extend();

},{"./correlation-matrix":9,"./d3-extensions":10,"./scatterplot":14,"./scatterplot-matrix":13,"./statistics-utils":15}],12:[function(require,module,exports){
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
                return barHeight - i * barHeight / ticksNumber;
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

},{"./utils":16}],13:[function(require,module,exports){
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

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ScatterPlotMatrixConfig).call(this));

        _this.svgClass = _this.cssClassPrefix + 'scatterplot-matrix';
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
            var boundingClientRect = this.getBaseContainerNode().getBoundingClientRect();
            if (!width) {
                var maxWidth = margin.left + margin.right + this.plot.variables.length * this.plot.size;
                width = Math.min(boundingClientRect.width, maxWidth);
            }
            var height = width;
            if (!height) {
                height = boundingClientRect.height;
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

            var axisClass = self.prefixClass("axis");
            var axisXClass = axisClass + "-x";
            var axisYClass = axisClass + "-y";

            var xAxisSelector = "g." + axisXClass + "." + axisClass;
            var yAxisSelector = "g." + axisYClass + "." + axisClass;

            var noGuidesClass = self.prefixClass("no-guides");
            self.svgG.selectAll(xAxisSelector).data(self.plot.variables).enter().appendSelector(xAxisSelector).classed(noGuidesClass, !conf.guides).attr("transform", function (d, i) {
                return "translate(" + (n - i - 1) * self.plot.size + ",0)";
            }).each(function (d) {
                self.plot.x.scale.domain(self.plot.domainByVariable[d]);d3.select(this).call(self.plot.x.axis);
            });

            self.svgG.selectAll(yAxisSelector).data(self.plot.variables).enter().appendSelector(yAxisSelector).classed(noGuidesClass, !conf.guides).attr("transform", function (d, i) {
                return "translate(0," + i * self.plot.size + ")";
            }).each(function (d) {
                self.plot.y.scale.domain(self.plot.domainByVariable[d]);d3.select(this).call(self.plot.y.axis);
            });

            var cellClass = self.prefixClass("cell");
            var cell = self.svgG.selectAll("." + cellClass).data(self.utils.cross(self.plot.variables, self.plot.variables)).enter().appendSelector("g." + cellClass).attr("transform", function (d) {
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

                var frameClass = self.prefixClass("frame");
                cell.append("rect").attr("class", frameClass).attr("x", conf.padding / 2).attr("y", conf.padding / 2).attr("width", conf.size - conf.padding).attr("height", conf.size - conf.padding);

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

},{"./chart":8,"./scatterplot":14,"./utils":16}],14:[function(require,module,exports){
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

        _this.svgClass = _this.cssClassPrefix + 'scatterplot';
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
            var placeholderNode = this.getBaseContainerNode();

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
            self.svgG.selectOrAppend("g." + self.prefixClass('axis-x') + "." + self.prefixClass('axis') + (self.config.guides ? '' : '.' + self.prefixClass('no-guides'))).attr("transform", "translate(0," + plot.height + ")").call(plot.x.axis).selectOrAppend("text." + self.prefixClass('label')).attr("transform", "translate(" + plot.width / 2 + "," + self.config.margin.bottom + ")") // text is drawn off the screen top left, move down and out and rotate
            .attr("dy", "-1em").style("text-anchor", "middle").text(axisConf.label);
        }
    }, {
        key: 'drawAxisY',
        value: function drawAxisY() {
            var self = this;
            var plot = self.plot;
            var axisConf = this.config.y;
            self.svgG.selectOrAppend("g." + self.prefixClass('axis-y') + "." + self.prefixClass('axis') + (self.config.guides ? '' : '.' + self.prefixClass('no-guides'))).call(plot.y.axis).selectOrAppend("text." + self.prefixClass('label')).attr("transform", "translate(" + -self.config.margin.left + "," + plot.height / 2 + ")rotate(-90)") // text is drawn off the screen top left, move down and out and rotate
            .attr("dy", "1em").style("text-anchor", "middle").text(axisConf.label);
        }
    }, {
        key: 'update',
        value: function update(newData) {
            // D3ChartBase.prototype.update.call(this, newData);
            var self = this;
            var plot = self.plot;
            var data = this.data;
            var dotClass = self.prefixClass('dot');
            var dots = self.svgG.selectAll('.' + dotClass).data(data);

            dots.enter().append("circle").attr("class", dotClass);

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

},{"./chart":8,"./utils":16}],15:[function(require,module,exports){
'use strict';

var su = module.exports.StatisticsUtils = {};
su.sampleCorrelation = require('../bower_components/simple-statistics/src/sample_correlation');

},{"../bower_components/simple-statistics/src/sample_correlation":2}],16:[function(require,module,exports){
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
        key: 'appendSelector',
        value: function appendSelector(parent, selector) {
            var selectorParts = selector.split(/([\.\#])/);
            var element = parent.append(selectorParts.shift());
            while (selectorParts.length > 1) {
                var selectorModifier = selectorParts.shift();
                var selectorItem = selectorParts.shift();
                if (selectorModifier === ".") {
                    element = element.classed(selectorItem, true);
                } else if (selectorModifier === "#") {
                    element = element.attr('id', selectorItem);
                }
            }
            return element;
        }
    }, {
        key: 'selectOrAppend',
        value: function selectOrAppend(parent, selector, element) {
            var selection = parent.select(selector);
            if (selection.empty()) {
                if (element) {
                    return parent.append(element);
                }
                return Utils.appendSelector(parent, selector);
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

},{}]},{},[11])(11)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxtZWFuLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc2FtcGxlX2NvcnJlbGF0aW9uLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc2FtcGxlX2NvdmFyaWFuY2UuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfc3RhbmRhcmRfZGV2aWF0aW9uLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc2FtcGxlX3ZhcmlhbmNlLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc3VtLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc3VtX250aF9wb3dlcl9kZXZpYXRpb25zLmpzIiwic3JjXFxjaGFydC5qcyIsInNyY1xcY29ycmVsYXRpb24tbWF0cml4LmpzIiwic3JjXFxkMy1leHRlbnNpb25zLmpzIiwic3JjXFxpbmRleC5qcyIsInNyY1xcbGVnZW5kLmpzIiwic3JjXFxzY2F0dGVycGxvdC1tYXRyaXguanMiLCJzcmNcXHNjYXR0ZXJwbG90LmpzIiwic3JjXFxzdGF0aXN0aWNzLXV0aWxzLmpzIiwic3JjXFx1dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOzs7QUFHQSxJQUFJLE1BQU0sUUFBUSxPQUFSLENBQVY7Ozs7Ozs7Ozs7Ozs7OztBQWVBLFNBQVMsSUFBVCxDQUFjLEMscUJBQWQsRSxXQUFpRDs7QUFFN0MsUUFBSSxFQUFFLE1BQUYsS0FBYSxDQUFqQixFQUFvQjtBQUFFLGVBQU8sR0FBUDtBQUFhOztBQUVuQyxXQUFPLElBQUksQ0FBSixJ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QUNnQixLQUFHLEdBRG5CLEVBRUssSUFGTCxDQUVVLElBRlYsRUFFZ0IsS0FBRyxHQUZuQixFQUdLLElBSEwsQ0FHVSxJQUhWLEVBR2dCLEtBQUcsR0FIbkIsRUFJSyxJQUpMLENBSVUsSUFKVixFQUlnQixLQUFHLEdBSm5COzs7QUFPQSxnQkFBSSxRQUFRLGVBQWUsU0FBZixDQUF5QixNQUF6QixFQUNQLElBRE8sQ0FDRCxLQURDLENBQVo7O0FBR0Esa0JBQU0sS0FBTixHQUFjLE1BQWQsQ0FBcUIsTUFBckI7O0FBRUEsa0JBQU0sSUFBTixDQUFXLFFBQVgsRUFBcUIsVUFBQyxDQUFELEVBQUcsQ0FBSDtBQUFBLHVCQUFTLEtBQUcsTUFBTSxNQUFOLEdBQWEsQ0FBaEIsQ0FBVDtBQUFBLGFBQXJCLEVBQ0ssSUFETCxDQUNVLFlBRFYsRUFDd0I7QUFBQSx1QkFBSyxDQUFMO0FBQUEsYUFEeEI7O0FBR0Esa0JBQU0sSUFBTixHQUFhLE1BQWI7QUFDSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgc3VtID0gcmVxdWlyZSgnLi9zdW0nKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgbWVhbiwgX2Fsc28ga25vd24gYXMgYXZlcmFnZV8sXHJcbiAqIGlzIHRoZSBzdW0gb2YgYWxsIHZhbHVlcyBvdmVyIHRoZSBudW1iZXIgb2YgdmFsdWVzLlxyXG4gKiBUaGlzIGlzIGEgW21lYXN1cmUgb2YgY2VudHJhbCB0ZW5kZW5jeV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ2VudHJhbF90ZW5kZW5jeSk6XHJcbiAqIGEgbWV0aG9kIG9mIGZpbmRpbmcgYSB0eXBpY2FsIG9yIGNlbnRyYWwgdmFsdWUgb2YgYSBzZXQgb2YgbnVtYmVycy5cclxuICpcclxuICogVGhpcyBydW5zIG9uIGBPKG4pYCwgbGluZWFyIHRpbWUgaW4gcmVzcGVjdCB0byB0aGUgYXJyYXlcclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGlucHV0IHZhbHVlc1xyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBtZWFuXHJcbiAqIEBleGFtcGxlXHJcbiAqIGNvbnNvbGUubG9nKG1lYW4oWzAsIDEwXSkpOyAvLyA1XHJcbiAqL1xyXG5mdW5jdGlvbiBtZWFuKHggLyo6IEFycmF5PG51bWJlcj4gKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgLy8gVGhlIG1lYW4gb2Ygbm8gbnVtYmVycyBpcyBudWxsXHJcbiAgICBpZiAoeC5sZW5ndGggPT09IDApIHsgcmV0dXJuIE5hTjsgfVxyXG5cclxuICAgIHJldHVybiBzdW0oeCkgLyB4Lmxlbmd0aDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtZWFuO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgc2FtcGxlQ292YXJpYW5jZSA9IHJlcXVpcmUoJy4vc2FtcGxlX2NvdmFyaWFuY2UnKTtcclxudmFyIHNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uID0gcmVxdWlyZSgnLi9zYW1wbGVfc3RhbmRhcmRfZGV2aWF0aW9uJyk7XHJcblxyXG4vKipcclxuICogVGhlIFtjb3JyZWxhdGlvbl0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Db3JyZWxhdGlvbl9hbmRfZGVwZW5kZW5jZSkgaXNcclxuICogYSBtZWFzdXJlIG9mIGhvdyBjb3JyZWxhdGVkIHR3byBkYXRhc2V0cyBhcmUsIGJldHdlZW4gLTEgYW5kIDFcclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGZpcnN0IGlucHV0XHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geSBzZWNvbmQgaW5wdXRcclxuICogQHJldHVybnMge251bWJlcn0gc2FtcGxlIGNvcnJlbGF0aW9uXHJcbiAqIEBleGFtcGxlXHJcbiAqIHZhciBhID0gWzEsIDIsIDMsIDQsIDUsIDZdO1xyXG4gKiB2YXIgYiA9IFsyLCAyLCAzLCA0LCA1LCA2MF07XHJcbiAqIHNhbXBsZUNvcnJlbGF0aW9uKGEsIGIpOyAvLz0gMC42OTFcclxuICovXHJcbmZ1bmN0aW9uIHNhbXBsZUNvcnJlbGF0aW9uKHgvKjogQXJyYXk8bnVtYmVyPiAqLywgeS8qOiBBcnJheTxudW1iZXI+ICovKS8qOm51bWJlciovIHtcclxuICAgIHZhciBjb3YgPSBzYW1wbGVDb3ZhcmlhbmNlKHgsIHkpLFxyXG4gICAgICAgIHhzdGQgPSBzYW1wbGVTdGFuZGFyZERldmlhdGlvbih4KSxcclxuICAgICAgICB5c3RkID0gc2FtcGxlU3RhbmRhcmREZXZpYXRpb24oeSk7XHJcblxyXG4gICAgcmV0dXJuIGNvdiAvIHhzdGQgLyB5c3RkO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNhbXBsZUNvcnJlbGF0aW9uO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgbWVhbiA9IHJlcXVpcmUoJy4vbWVhbicpO1xyXG5cclxuLyoqXHJcbiAqIFtTYW1wbGUgY292YXJpYW5jZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvU2FtcGxlX21lYW5fYW5kX3NhbXBsZUNvdmFyaWFuY2UpIG9mIHR3byBkYXRhc2V0czpcclxuICogaG93IG11Y2ggZG8gdGhlIHR3byBkYXRhc2V0cyBtb3ZlIHRvZ2V0aGVyP1xyXG4gKiB4IGFuZCB5IGFyZSB0d28gZGF0YXNldHMsIHJlcHJlc2VudGVkIGFzIGFycmF5cyBvZiBudW1iZXJzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggZmlyc3QgaW5wdXRcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB5IHNlY29uZCBpbnB1dFxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBzYW1wbGUgY292YXJpYW5jZVxyXG4gKiBAZXhhbXBsZVxyXG4gKiB2YXIgeCA9IFsxLCAyLCAzLCA0LCA1LCA2XTtcclxuICogdmFyIHkgPSBbNiwgNSwgNCwgMywgMiwgMV07XHJcbiAqIHNhbXBsZUNvdmFyaWFuY2UoeCwgeSk7IC8vPSAtMy41XHJcbiAqL1xyXG5mdW5jdGlvbiBzYW1wbGVDb3ZhcmlhbmNlKHggLyo6QXJyYXk8bnVtYmVyPiovLCB5IC8qOkFycmF5PG51bWJlcj4qLykvKjpudW1iZXIqLyB7XHJcblxyXG4gICAgLy8gVGhlIHR3byBkYXRhc2V0cyBtdXN0IGhhdmUgdGhlIHNhbWUgbGVuZ3RoIHdoaWNoIG11c3QgYmUgbW9yZSB0aGFuIDFcclxuICAgIGlmICh4Lmxlbmd0aCA8PSAxIHx8IHgubGVuZ3RoICE9PSB5Lmxlbmd0aCkge1xyXG4gICAgICAgIHJldHVybiBOYU47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZGV0ZXJtaW5lIHRoZSBtZWFuIG9mIGVhY2ggZGF0YXNldCBzbyB0aGF0IHdlIGNhbiBqdWRnZSBlYWNoXHJcbiAgICAvLyB2YWx1ZSBvZiB0aGUgZGF0YXNldCBmYWlybHkgYXMgdGhlIGRpZmZlcmVuY2UgZnJvbSB0aGUgbWVhbi4gdGhpc1xyXG4gICAgLy8gd2F5LCBpZiBvbmUgZGF0YXNldCBpcyBbMSwgMiwgM10gYW5kIFsyLCAzLCA0XSwgdGhlaXIgY292YXJpYW5jZVxyXG4gICAgLy8gZG9lcyBub3Qgc3VmZmVyIGJlY2F1c2Ugb2YgdGhlIGRpZmZlcmVuY2UgaW4gYWJzb2x1dGUgdmFsdWVzXHJcbiAgICB2YXIgeG1lYW4gPSBtZWFuKHgpLFxyXG4gICAgICAgIHltZWFuID0gbWVhbih5KSxcclxuICAgICAgICBzdW0gPSAwO1xyXG5cclxuICAgIC8vIGZvciBlYWNoIHBhaXIgb2YgdmFsdWVzLCB0aGUgY292YXJpYW5jZSBpbmNyZWFzZXMgd2hlbiB0aGVpclxyXG4gICAgLy8gZGlmZmVyZW5jZSBmcm9tIHRoZSBtZWFuIGlzIGFzc29jaWF0ZWQgLSBpZiBib3RoIGFyZSB3ZWxsIGFib3ZlXHJcbiAgICAvLyBvciBpZiBib3RoIGFyZSB3ZWxsIGJlbG93XHJcbiAgICAvLyB0aGUgbWVhbiwgdGhlIGNvdmFyaWFuY2UgaW5jcmVhc2VzIHNpZ25pZmljYW50bHkuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBzdW0gKz0gKHhbaV0gLSB4bWVhbikgKiAoeVtpXSAtIHltZWFuKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB0aGlzIGlzIEJlc3NlbHMnIENvcnJlY3Rpb246IGFuIGFkanVzdG1lbnQgbWFkZSB0byBzYW1wbGUgc3RhdGlzdGljc1xyXG4gICAgLy8gdGhhdCBhbGxvd3MgZm9yIHRoZSByZWR1Y2VkIGRlZ3JlZSBvZiBmcmVlZG9tIGVudGFpbGVkIGluIGNhbGN1bGF0aW5nXHJcbiAgICAvLyB2YWx1ZXMgZnJvbSBzYW1wbGVzIHJhdGhlciB0aGFuIGNvbXBsZXRlIHBvcHVsYXRpb25zLlxyXG4gICAgdmFyIGJlc3NlbHNDb3JyZWN0aW9uID0geC5sZW5ndGggLSAxO1xyXG5cclxuICAgIC8vIHRoZSBjb3ZhcmlhbmNlIGlzIHdlaWdodGVkIGJ5IHRoZSBsZW5ndGggb2YgdGhlIGRhdGFzZXRzLlxyXG4gICAgcmV0dXJuIHN1bSAvIGJlc3NlbHNDb3JyZWN0aW9uO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNhbXBsZUNvdmFyaWFuY2U7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBzYW1wbGVWYXJpYW5jZSA9IHJlcXVpcmUoJy4vc2FtcGxlX3ZhcmlhbmNlJyk7XHJcblxyXG4vKipcclxuICogVGhlIFtzdGFuZGFyZCBkZXZpYXRpb25dKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvU3RhbmRhcmRfZGV2aWF0aW9uKVxyXG4gKiBpcyB0aGUgc3F1YXJlIHJvb3Qgb2YgdGhlIHZhcmlhbmNlLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggaW5wdXQgYXJyYXlcclxuICogQHJldHVybnMge251bWJlcn0gc2FtcGxlIHN0YW5kYXJkIGRldmlhdGlvblxyXG4gKiBAZXhhbXBsZVxyXG4gKiBzcy5zYW1wbGVTdGFuZGFyZERldmlhdGlvbihbMiwgNCwgNCwgNCwgNSwgNSwgNywgOV0pO1xyXG4gKiAvLz0gMi4xMzhcclxuICovXHJcbmZ1bmN0aW9uIHNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uKHgvKjpBcnJheTxudW1iZXI+Ki8pLyo6bnVtYmVyKi8ge1xyXG4gICAgLy8gVGhlIHN0YW5kYXJkIGRldmlhdGlvbiBvZiBubyBudW1iZXJzIGlzIG51bGxcclxuICAgIHZhciBzYW1wbGVWYXJpYW5jZVggPSBzYW1wbGVWYXJpYW5jZSh4KTtcclxuICAgIGlmIChpc05hTihzYW1wbGVWYXJpYW5jZVgpKSB7IHJldHVybiBOYU47IH1cclxuICAgIHJldHVybiBNYXRoLnNxcnQoc2FtcGxlVmFyaWFuY2VYKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYW1wbGVTdGFuZGFyZERldmlhdGlvbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIHN1bU50aFBvd2VyRGV2aWF0aW9ucyA9IHJlcXVpcmUoJy4vc3VtX250aF9wb3dlcl9kZXZpYXRpb25zJyk7XHJcblxyXG4vKlxyXG4gKiBUaGUgW3NhbXBsZSB2YXJpYW5jZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVmFyaWFuY2UjU2FtcGxlX3ZhcmlhbmNlKVxyXG4gKiBpcyB0aGUgc3VtIG9mIHNxdWFyZWQgZGV2aWF0aW9ucyBmcm9tIHRoZSBtZWFuLiBUaGUgc2FtcGxlIHZhcmlhbmNlXHJcbiAqIGlzIGRpc3Rpbmd1aXNoZWQgZnJvbSB0aGUgdmFyaWFuY2UgYnkgdGhlIHVzYWdlIG9mIFtCZXNzZWwncyBDb3JyZWN0aW9uXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9CZXNzZWwnc19jb3JyZWN0aW9uKTpcclxuICogaW5zdGVhZCBvZiBkaXZpZGluZyB0aGUgc3VtIG9mIHNxdWFyZWQgZGV2aWF0aW9ucyBieSB0aGUgbGVuZ3RoIG9mIHRoZSBpbnB1dCxcclxuICogaXQgaXMgZGl2aWRlZCBieSB0aGUgbGVuZ3RoIG1pbnVzIG9uZS4gVGhpcyBjb3JyZWN0cyB0aGUgYmlhcyBpbiBlc3RpbWF0aW5nXHJcbiAqIGEgdmFsdWUgZnJvbSBhIHNldCB0aGF0IHlvdSBkb24ndCBrbm93IGlmIGZ1bGwuXHJcbiAqXHJcbiAqIFJlZmVyZW5jZXM6XHJcbiAqICogW1dvbGZyYW0gTWF0aFdvcmxkIG9uIFNhbXBsZSBWYXJpYW5jZV0oaHR0cDovL21hdGh3b3JsZC53b2xmcmFtLmNvbS9TYW1wbGVWYXJpYW5jZS5odG1sKVxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggaW5wdXQgYXJyYXlcclxuICogQHJldHVybiB7bnVtYmVyfSBzYW1wbGUgdmFyaWFuY2VcclxuICogQGV4YW1wbGVcclxuICogc2FtcGxlVmFyaWFuY2UoWzEsIDIsIDMsIDQsIDVdKTsgLy89IDIuNVxyXG4gKi9cclxuZnVuY3Rpb24gc2FtcGxlVmFyaWFuY2UoeCAvKjogQXJyYXk8bnVtYmVyPiAqLykvKjpudW1iZXIqLyB7XHJcbiAgICAvLyBUaGUgdmFyaWFuY2Ugb2Ygbm8gbnVtYmVycyBpcyBudWxsXHJcbiAgICBpZiAoeC5sZW5ndGggPD0gMSkgeyByZXR1cm4gTmFOOyB9XHJcblxyXG4gICAgdmFyIHN1bVNxdWFyZWREZXZpYXRpb25zVmFsdWUgPSBzdW1OdGhQb3dlckRldmlhdGlvbnMoeCwgMik7XHJcblxyXG4gICAgLy8gdGhpcyBpcyBCZXNzZWxzJyBDb3JyZWN0aW9uOiBhbiBhZGp1c3RtZW50IG1hZGUgdG8gc2FtcGxlIHN0YXRpc3RpY3NcclxuICAgIC8vIHRoYXQgYWxsb3dzIGZvciB0aGUgcmVkdWNlZCBkZWdyZWUgb2YgZnJlZWRvbSBlbnRhaWxlZCBpbiBjYWxjdWxhdGluZ1xyXG4gICAgLy8gdmFsdWVzIGZyb20gc2FtcGxlcyByYXRoZXIgdGhhbiBjb21wbGV0ZSBwb3B1bGF0aW9ucy5cclxuICAgIHZhciBiZXNzZWxzQ29ycmVjdGlvbiA9IHgubGVuZ3RoIC0gMTtcclxuXHJcbiAgICAvLyBGaW5kIHRoZSBtZWFuIHZhbHVlIG9mIHRoYXQgbGlzdFxyXG4gICAgcmV0dXJuIHN1bVNxdWFyZWREZXZpYXRpb25zVmFsdWUgLyBiZXNzZWxzQ29ycmVjdGlvbjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYW1wbGVWYXJpYW5jZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxuLyoqXHJcbiAqIE91ciBkZWZhdWx0IHN1bSBpcyB0aGUgW0thaGFuIHN1bW1hdGlvbiBhbGdvcml0aG1dKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0thaGFuX3N1bW1hdGlvbl9hbGdvcml0aG0pIGlzXHJcbiAqIGEgbWV0aG9kIGZvciBjb21wdXRpbmcgdGhlIHN1bSBvZiBhIGxpc3Qgb2YgbnVtYmVycyB3aGlsZSBjb3JyZWN0aW5nXHJcbiAqIGZvciBmbG9hdGluZy1wb2ludCBlcnJvcnMuIFRyYWRpdGlvbmFsbHksIHN1bXMgYXJlIGNhbGN1bGF0ZWQgYXMgbWFueVxyXG4gKiBzdWNjZXNzaXZlIGFkZGl0aW9ucywgZWFjaCBvbmUgd2l0aCBpdHMgb3duIGZsb2F0aW5nLXBvaW50IHJvdW5kb2ZmLiBUaGVzZVxyXG4gKiBsb3NzZXMgaW4gcHJlY2lzaW9uIGFkZCB1cCBhcyB0aGUgbnVtYmVyIG9mIG51bWJlcnMgaW5jcmVhc2VzLiBUaGlzIGFsdGVybmF0aXZlXHJcbiAqIGFsZ29yaXRobSBpcyBtb3JlIGFjY3VyYXRlIHRoYW4gdGhlIHNpbXBsZSB3YXkgb2YgY2FsY3VsYXRpbmcgc3VtcyBieSBzaW1wbGVcclxuICogYWRkaXRpb24uXHJcbiAqXHJcbiAqIFRoaXMgcnVucyBvbiBgTyhuKWAsIGxpbmVhciB0aW1lIGluIHJlc3BlY3QgdG8gdGhlIGFycmF5XHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBpbnB1dFxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IHN1bSBvZiBhbGwgaW5wdXQgbnVtYmVyc1xyXG4gKiBAZXhhbXBsZVxyXG4gKiBjb25zb2xlLmxvZyhzdW0oWzEsIDIsIDNdKSk7IC8vIDZcclxuICovXHJcbmZ1bmN0aW9uIHN1bSh4Lyo6IEFycmF5PG51bWJlcj4gKi8pLyo6IG51bWJlciAqLyB7XHJcblxyXG4gICAgLy8gbGlrZSB0aGUgdHJhZGl0aW9uYWwgc3VtIGFsZ29yaXRobSwgd2Uga2VlcCBhIHJ1bm5pbmdcclxuICAgIC8vIGNvdW50IG9mIHRoZSBjdXJyZW50IHN1bS5cclxuICAgIHZhciBzdW0gPSAwO1xyXG5cclxuICAgIC8vIGJ1dCB3ZSBhbHNvIGtlZXAgdGhyZWUgZXh0cmEgdmFyaWFibGVzIGFzIGJvb2trZWVwaW5nOlxyXG4gICAgLy8gbW9zdCBpbXBvcnRhbnRseSwgYW4gZXJyb3IgY29ycmVjdGlvbiB2YWx1ZS4gVGhpcyB3aWxsIGJlIGEgdmVyeVxyXG4gICAgLy8gc21hbGwgbnVtYmVyIHRoYXQgaXMgdGhlIG9wcG9zaXRlIG9mIHRoZSBmbG9hdGluZyBwb2ludCBwcmVjaXNpb24gbG9zcy5cclxuICAgIHZhciBlcnJvckNvbXBlbnNhdGlvbiA9IDA7XHJcblxyXG4gICAgLy8gdGhpcyB3aWxsIGJlIGVhY2ggbnVtYmVyIGluIHRoZSBsaXN0IGNvcnJlY3RlZCB3aXRoIHRoZSBjb21wZW5zYXRpb24gdmFsdWUuXHJcbiAgICB2YXIgY29ycmVjdGVkQ3VycmVudFZhbHVlO1xyXG5cclxuICAgIC8vIGFuZCB0aGlzIHdpbGwgYmUgdGhlIG5leHQgc3VtXHJcbiAgICB2YXIgbmV4dFN1bTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAvLyBmaXJzdCBjb3JyZWN0IHRoZSB2YWx1ZSB0aGF0IHdlJ3JlIGdvaW5nIHRvIGFkZCB0byB0aGUgc3VtXHJcbiAgICAgICAgY29ycmVjdGVkQ3VycmVudFZhbHVlID0geFtpXSAtIGVycm9yQ29tcGVuc2F0aW9uO1xyXG5cclxuICAgICAgICAvLyBjb21wdXRlIHRoZSBuZXh0IHN1bS4gc3VtIGlzIGxpa2VseSBhIG11Y2ggbGFyZ2VyIG51bWJlclxyXG4gICAgICAgIC8vIHRoYW4gY29ycmVjdGVkQ3VycmVudFZhbHVlLCBzbyB3ZSdsbCBsb3NlIHByZWNpc2lvbiBoZXJlLFxyXG4gICAgICAgIC8vIGFuZCBtZWFzdXJlIGhvdyBtdWNoIHByZWNpc2lvbiBpcyBsb3N0IGluIHRoZSBuZXh0IHN0ZXBcclxuICAgICAgICBuZXh0U3VtID0gc3VtICsgY29ycmVjdGVkQ3VycmVudFZhbHVlO1xyXG5cclxuICAgICAgICAvLyB3ZSBpbnRlbnRpb25hbGx5IGRpZG4ndCBhc3NpZ24gc3VtIGltbWVkaWF0ZWx5LCBidXQgc3RvcmVkXHJcbiAgICAgICAgLy8gaXQgZm9yIG5vdyBzbyB3ZSBjYW4gZmlndXJlIG91dCB0aGlzOiBpcyAoc3VtICsgbmV4dFZhbHVlKSAtIG5leHRWYWx1ZVxyXG4gICAgICAgIC8vIG5vdCBlcXVhbCB0byAwPyBpZGVhbGx5IGl0IHdvdWxkIGJlLCBidXQgaW4gcHJhY3RpY2UgaXQgd29uJ3Q6XHJcbiAgICAgICAgLy8gaXQgd2lsbCBiZSBzb21lIHZlcnkgc21hbGwgbnVtYmVyLiB0aGF0J3Mgd2hhdCB3ZSByZWNvcmRcclxuICAgICAgICAvLyBhcyBlcnJvckNvbXBlbnNhdGlvbi5cclxuICAgICAgICBlcnJvckNvbXBlbnNhdGlvbiA9IG5leHRTdW0gLSBzdW0gLSBjb3JyZWN0ZWRDdXJyZW50VmFsdWU7XHJcblxyXG4gICAgICAgIC8vIG5vdyB0aGF0IHdlJ3ZlIGNvbXB1dGVkIGhvdyBtdWNoIHdlJ2xsIGNvcnJlY3QgZm9yIGluIHRoZSBuZXh0XHJcbiAgICAgICAgLy8gbG9vcCwgc3RhcnQgdHJlYXRpbmcgdGhlIG5leHRTdW0gYXMgdGhlIGN1cnJlbnQgc3VtLlxyXG4gICAgICAgIHN1bSA9IG5leHRTdW07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHN1bTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzdW07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBtZWFuID0gcmVxdWlyZSgnLi9tZWFuJyk7XHJcblxyXG4vKipcclxuICogVGhlIHN1bSBvZiBkZXZpYXRpb25zIHRvIHRoZSBOdGggcG93ZXIuXHJcbiAqIFdoZW4gbj0yIGl0J3MgdGhlIHN1bSBvZiBzcXVhcmVkIGRldmlhdGlvbnMuXHJcbiAqIFdoZW4gbj0zIGl0J3MgdGhlIHN1bSBvZiBjdWJlZCBkZXZpYXRpb25zLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHhcclxuICogQHBhcmFtIHtudW1iZXJ9IG4gcG93ZXJcclxuICogQHJldHVybnMge251bWJlcn0gc3VtIG9mIG50aCBwb3dlciBkZXZpYXRpb25zXHJcbiAqIEBleGFtcGxlXHJcbiAqIHZhciBpbnB1dCA9IFsxLCAyLCAzXTtcclxuICogLy8gc2luY2UgdGhlIHZhcmlhbmNlIG9mIGEgc2V0IGlzIHRoZSBtZWFuIHNxdWFyZWRcclxuICogLy8gZGV2aWF0aW9ucywgd2UgY2FuIGNhbGN1bGF0ZSB0aGF0IHdpdGggc3VtTnRoUG93ZXJEZXZpYXRpb25zOlxyXG4gKiB2YXIgdmFyaWFuY2UgPSBzdW1OdGhQb3dlckRldmlhdGlvbnMoaW5wdXQpIC8gaW5wdXQubGVuZ3RoO1xyXG4gKi9cclxuZnVuY3Rpb24gc3VtTnRoUG93ZXJEZXZpYXRpb25zKHgvKjogQXJyYXk8bnVtYmVyPiAqLywgbi8qOiBudW1iZXIgKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgdmFyIG1lYW5WYWx1ZSA9IG1lYW4oeCksXHJcbiAgICAgICAgc3VtID0gMDtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBzdW0gKz0gTWF0aC5wb3coeFtpXSAtIG1lYW5WYWx1ZSwgbik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHN1bTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzdW1OdGhQb3dlckRldmlhdGlvbnM7XHJcbiIsImltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJ0Q29uZmlnIHtcclxuICAgIGNzc0NsYXNzUHJlZml4ID0gXCJvZGMtXCI7XHJcbiAgICBzdmdDbGFzcyA9IHRoaXMuY3NzQ2xhc3NQcmVmaXggKyAnbXctZDMtY2hhcnQnO1xyXG4gICAgd2lkdGggPSB1bmRlZmluZWQ7XHJcbiAgICBoZWlnaHQgPSB1bmRlZmluZWQ7XHJcbiAgICBtYXJnaW4gPSB7XHJcbiAgICAgICAgbGVmdDogNTAsXHJcbiAgICAgICAgcmlnaHQ6IDMwLFxyXG4gICAgICAgIHRvcDogMzAsXHJcbiAgICAgICAgYm90dG9tOiA1MFxyXG4gICAgfTtcclxuICAgIHRvb2x0aXAgPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pIHtcclxuICAgICAgICBpZiAoY3VzdG9tKSB7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJ0IHtcclxuICAgIHV0aWxzID0gVXRpbHM7XHJcbiAgICBiYXNlQ29udGFpbmVyO1xyXG4gICAgc3ZnO1xyXG4gICAgY29uZmlnO1xyXG4gICAgcGxvdCA9IHtcclxuICAgICAgICBtYXJnaW46IHt9XHJcbiAgICB9O1xyXG4gICAgX2F0dGFjaGVkID0ge307XHJcbiAgICBfbGF5ZXJzID0ge307XHJcbiAgICBfZXZlbnRzID0ge307XHJcbiAgICBfaXNBdHRhY2hlZDtcclxuICAgIF9pc0luaXRpYWxpemVkPWZhbHNlO1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihiYXNlLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9pc0F0dGFjaGVkID0gYmFzZSBpbnN0YW5jZW9mIENoYXJ0O1xyXG5cclxuICAgICAgICB0aGlzLmJhc2VDb250YWluZXIgPSBiYXNlO1xyXG5cclxuICAgICAgICB0aGlzLnNldENvbmZpZyhjb25maWcpO1xyXG5cclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgICB0aGlzLnBvc3RJbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZykge1xyXG4gICAgICAgIGlmICghY29uZmlnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gbmV3IENoYXJ0Q29uZmlnKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRhKGRhdGEpIHtcclxuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHJcbiAgICAgICAgc2VsZi5pbml0UGxvdCgpO1xyXG4gICAgICAgIHNlbGYuaW5pdFN2ZygpO1xyXG5cclxuICAgICAgICBzZWxmLmluaXRUb29sdGlwKCk7XHJcbiAgICAgICAgc2VsZi5kcmF3KCk7XHJcbiAgICAgICAgdGhpcy5faXNJbml0aWFsaXplZD10cnVlO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHBvc3RJbml0KCl7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXRTdmcoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBjb25maWcgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICBjb25zb2xlLmxvZyhjb25maWcuc3ZnQ2xhc3MpO1xyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBzZWxmLnBsb3Qud2lkdGggKyBjb25maWcubWFyZ2luLmxlZnQgKyBjb25maWcubWFyZ2luLnJpZ2h0O1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBzZWxmLnBsb3QuaGVpZ2h0ICsgY29uZmlnLm1hcmdpbi50b3AgKyBjb25maWcubWFyZ2luLmJvdHRvbTtcclxuICAgICAgICB2YXIgYXNwZWN0ID0gd2lkdGggLyBoZWlnaHQ7XHJcbiAgICAgICAgaWYoIXNlbGYuX2lzQXR0YWNoZWQpe1xyXG4gICAgICAgICAgICBpZighdGhpcy5faXNJbml0aWFsaXplZCl7XHJcbiAgICAgICAgICAgICAgICBkMy5zZWxlY3Qoc2VsZi5iYXNlQ29udGFpbmVyKS5zZWxlY3QoXCJzdmdcIikucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2VsZi5zdmcgPSBkMy5zZWxlY3Qoc2VsZi5iYXNlQ29udGFpbmVyKS5zZWxlY3RPckFwcGVuZChcInN2Z1wiKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuc3ZnXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ2aWV3Qm94XCIsIFwiMCAwIFwiICsgXCIgXCIgKyB3aWR0aCArIFwiIFwiICsgaGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJwcmVzZXJ2ZUFzcGVjdFJhdGlvXCIsIFwieE1pZFlNaWQgbWVldFwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBjb25maWcuc3ZnQ2xhc3MpO1xyXG4gICAgICAgICAgICBzZWxmLnN2Z0cgPSBzZWxmLnN2Zy5zZWxlY3RPckFwcGVuZChcImcubWFpbi1ncm91cFwiKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5iYXNlQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgc2VsZi5zdmcgPSBzZWxmLmJhc2VDb250YWluZXIuc3ZnO1xyXG4gICAgICAgICAgICBzZWxmLnN2Z0cgPSBzZWxmLnN2Zy5zZWxlY3RPckFwcGVuZChcImcubWFpbi1ncm91cC5cIitjb25maWcuc3ZnQ2xhc3MpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWxmLnN2Z0cuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIGNvbmZpZy5tYXJnaW4ubGVmdCArIFwiLFwiICsgY29uZmlnLm1hcmdpbi50b3AgKyBcIilcIik7XHJcblxyXG4gICAgICAgIGlmICghY29uZmlnLndpZHRoIHx8IGNvbmZpZy5oZWlnaHQpIHtcclxuICAgICAgICAgICAgZDMuc2VsZWN0KHdpbmRvdylcclxuICAgICAgICAgICAgICAgIC5vbihcInJlc2l6ZVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9UT0RPIGFkZCByZXNwb25zaXZlbmVzcyBpZiB3aWR0aC9oZWlnaHQgbm90IHNwZWNpZmllZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXRUb29sdGlwKCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy50b29sdGlwKSB7XHJcbiAgICAgICAgICAgIGlmKCFzZWxmLl9pc0F0dGFjaGVkICl7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QudG9vbHRpcCA9IGQzLnNlbGVjdChzZWxmLmJhc2VDb250YWluZXIpLnNlbGVjdE9yQXBwZW5kKCdkaXYuJytzZWxmLmNvbmZpZy5jc3NDbGFzc1ByZWZpeCsndG9vbHRpcCcpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QudG9vbHRpcD0gc2VsZi5iYXNlQ29udGFpbmVyLnBsb3QudG9vbHRpcDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkYXRhKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXREYXRhKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbGF5ZXJOYW1lLCBhdHRhY2htZW50RGF0YTtcclxuICAgICAgICBmb3IgKHZhciBhdHRhY2htZW50TmFtZSBpbiB0aGlzLl9hdHRhY2hlZCkge1xyXG5cclxuICAgICAgICAgICAgYXR0YWNobWVudERhdGEgPSBkYXRhO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fYXR0YWNoZWRbYXR0YWNobWVudE5hbWVdLnVwZGF0ZShhdHRhY2htZW50RGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdiYXNlIHVwcGRhdGUnKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBkcmF3KGRhdGEpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZShkYXRhKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvL0JvcnJvd2VkIGZyb20gZDMuY2hhcnRcclxuICAgIC8qKlxyXG4gICAgICogUmVnaXN0ZXIgb3IgcmV0cmlldmUgYW4gXCJhdHRhY2htZW50XCIgQ2hhcnQuIFRoZSBcImF0dGFjaG1lbnRcIiBjaGFydCdzIGBkcmF3YFxyXG4gICAgICogbWV0aG9kIHdpbGwgYmUgaW52b2tlZCB3aGVuZXZlciB0aGUgY29udGFpbmluZyBjaGFydCdzIGBkcmF3YCBtZXRob2QgaXNcclxuICAgICAqIGludm9rZWQuXHJcbiAgICAgKlxyXG4gICAgICogQGV4dGVybmFsRXhhbXBsZSBjaGFydC1hdHRhY2hcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXR0YWNobWVudE5hbWUgTmFtZSBvZiB0aGUgYXR0YWNobWVudFxyXG4gICAgICogQHBhcmFtIHtDaGFydH0gW2NoYXJ0XSBDaGFydCB0byByZWdpc3RlciBhcyBhIG1peCBpbiBvZiB0aGlzIGNoYXJ0LiBXaGVuXHJcbiAgICAgKiAgICAgICAgdW5zcGVjaWZpZWQsIHRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIHRoZSBhdHRhY2htZW50IHByZXZpb3VzbHlcclxuICAgICAqICAgICAgICByZWdpc3RlcmVkIHdpdGggdGhlIHNwZWNpZmllZCBgYXR0YWNobWVudE5hbWVgIChpZiBhbnkpLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtDaGFydH0gUmVmZXJlbmNlIHRvIHRoaXMgY2hhcnQgKGNoYWluYWJsZSkuXHJcbiAgICAgKi9cclxuICAgIGF0dGFjaChhdHRhY2htZW50TmFtZSwgY2hhcnQpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXR0YWNoZWRbYXR0YWNobWVudE5hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fYXR0YWNoZWRbYXR0YWNobWVudE5hbWVdID0gY2hhcnQ7XHJcbiAgICAgICAgcmV0dXJuIGNoYXJ0O1xyXG4gICAgfTtcclxuXHJcbiAgICBcclxuXHJcbiAgICAvL0JvcnJvd2VkIGZyb20gZDMuY2hhcnRcclxuICAgIC8qKlxyXG4gICAgICogU3Vic2NyaWJlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYW4gZXZlbnQgdHJpZ2dlcmVkIG9uIHRoZSBjaGFydC4gU2VlIHtAbGlua1xyXG4gICAgICAgICogQ2hhcnQjb25jZX0gdG8gc3Vic2NyaWJlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYW4gZXZlbnQgZm9yIG9uZSBvY2N1cmVuY2UuXHJcbiAgICAgKlxyXG4gICAgICogQGV4dGVybmFsRXhhbXBsZSB7cnVubmFibGV9IGNoYXJ0LW9uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgZXZlbnRcclxuICAgICAqIEBwYXJhbSB7Q2hhcnRFdmVudEhhbmRsZXJ9IGNhbGxiYWNrIEZ1bmN0aW9uIHRvIGJlIGludm9rZWQgd2hlbiB0aGUgZXZlbnRcclxuICAgICAqICAgICAgICBvY2N1cnNcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF0gVmFsdWUgdG8gc2V0IGFzIGB0aGlzYCB3aGVuIGludm9raW5nIHRoZVxyXG4gICAgICogICAgICAgIGBjYWxsYmFja2AuIERlZmF1bHRzIHRvIHRoZSBjaGFydCBpbnN0YW5jZS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Q2hhcnR9IEEgcmVmZXJlbmNlIHRvIHRoaXMgY2hhcnQgKGNoYWluYWJsZSkuXHJcbiAgICAgKi9cclxuICAgIG9uKG5hbWUsIGNhbGxiYWNrLCBjb250ZXh0KSB7XHJcbiAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50c1tuYW1lXSB8fCAodGhpcy5fZXZlbnRzW25hbWVdID0gW10pO1xyXG4gICAgICAgIGV2ZW50cy5wdXNoKHtcclxuICAgICAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxyXG4gICAgICAgICAgICBjb250ZXh0OiBjb250ZXh0IHx8IHRoaXMsXHJcbiAgICAgICAgICAgIF9jaGFydDogdGhpc1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vQm9ycm93ZWQgZnJvbSBkMy5jaGFydFxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogU3Vic2NyaWJlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYW4gZXZlbnQgdHJpZ2dlcmVkIG9uIHRoZSBjaGFydC4gVGhpc1xyXG4gICAgICogZnVuY3Rpb24gd2lsbCBiZSBpbnZva2VkIGF0IHRoZSBuZXh0IG9jY3VyYW5jZSBvZiB0aGUgZXZlbnQgYW5kIGltbWVkaWF0ZWx5XHJcbiAgICAgKiB1bnN1YnNjcmliZWQuIFNlZSB7QGxpbmsgQ2hhcnQjb259IHRvIHN1YnNjcmliZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGFuXHJcbiAgICAgKiBldmVudCBpbmRlZmluaXRlbHkuXHJcbiAgICAgKlxyXG4gICAgICogQGV4dGVybmFsRXhhbXBsZSB7cnVubmFibGV9IGNoYXJ0LW9uY2VcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBldmVudFxyXG4gICAgICogQHBhcmFtIHtDaGFydEV2ZW50SGFuZGxlcn0gY2FsbGJhY2sgRnVuY3Rpb24gdG8gYmUgaW52b2tlZCB3aGVuIHRoZSBldmVudFxyXG4gICAgICogICAgICAgIG9jY3Vyc1xyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0XSBWYWx1ZSB0byBzZXQgYXMgYHRoaXNgIHdoZW4gaW52b2tpbmcgdGhlXHJcbiAgICAgKiAgICAgICAgYGNhbGxiYWNrYC4gRGVmYXVsdHMgdG8gdGhlIGNoYXJ0IGluc3RhbmNlXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0NoYXJ0fSBBIHJlZmVyZW5jZSB0byB0aGlzIGNoYXJ0IChjaGFpbmFibGUpXHJcbiAgICAgKi9cclxuICAgIG9uY2UobmFtZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG9uY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYub2ZmKG5hbWUsIG9uY2UpO1xyXG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub24obmFtZSwgb25jZSwgY29udGV4dCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vQm9ycm93ZWQgZnJvbSBkMy5jaGFydFxyXG4gICAgLyoqXHJcbiAgICAgKiBVbnN1YnNjcmliZSBvbmUgb3IgbW9yZSBjYWxsYmFjayBmdW5jdGlvbnMgZnJvbSBhbiBldmVudCB0cmlnZ2VyZWQgb24gdGhlXHJcbiAgICAgKiBjaGFydC4gV2hlbiBubyBhcmd1bWVudHMgYXJlIHNwZWNpZmllZCwgKmFsbCogaGFuZGxlcnMgd2lsbCBiZSB1bnN1YnNjcmliZWQuXHJcbiAgICAgKiBXaGVuIG9ubHkgYSBgbmFtZWAgaXMgc3BlY2lmaWVkLCBhbGwgaGFuZGxlcnMgc3Vic2NyaWJlZCB0byB0aGF0IGV2ZW50IHdpbGxcclxuICAgICAqIGJlIHVuc3Vic2NyaWJlZC4gV2hlbiBhIGBuYW1lYCBhbmQgYGNhbGxiYWNrYCBhcmUgc3BlY2lmaWVkLCBvbmx5IHRoYXRcclxuICAgICAqIGZ1bmN0aW9uIHdpbGwgYmUgdW5zdWJzY3JpYmVkIGZyb20gdGhhdCBldmVudC4gV2hlbiBhIGBuYW1lYCBhbmQgYGNvbnRleHRgXHJcbiAgICAgKiBhcmUgc3BlY2lmaWVkIChidXQgYGNhbGxiYWNrYCBpcyBvbWl0dGVkKSwgYWxsIGV2ZW50cyBib3VuZCB0byB0aGUgZ2l2ZW5cclxuICAgICAqIGV2ZW50IHdpdGggdGhlIGdpdmVuIGNvbnRleHQgd2lsbCBiZSB1bnN1YnNjcmliZWQuXHJcbiAgICAgKlxyXG4gICAgICogQGV4dGVybmFsRXhhbXBsZSB7cnVubmFibGV9IGNoYXJ0LW9mZlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbbmFtZV0gTmFtZSBvZiB0aGUgZXZlbnQgdG8gYmUgdW5zdWJzY3JpYmVkXHJcbiAgICAgKiBAcGFyYW0ge0NoYXJ0RXZlbnRIYW5kbGVyfSBbY2FsbGJhY2tdIEZ1bmN0aW9uIHRvIGJlIHVuc3Vic2NyaWJlZFxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0XSBDb250ZXh0cyB0byBiZSB1bnN1YnNjcmliZVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtDaGFydH0gQSByZWZlcmVuY2UgdG8gdGhpcyBjaGFydCAoY2hhaW5hYmxlKS5cclxuICAgICAqL1xyXG5cclxuICAgIG9mZihuYW1lLCBjYWxsYmFjaywgY29udGV4dCkge1xyXG4gICAgICAgIHZhciBuYW1lcywgbiwgZXZlbnRzLCBldmVudCwgaSwgajtcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIGFsbCBldmVudHNcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBmb3IgKG5hbWUgaW4gdGhpcy5fZXZlbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbbmFtZV0ubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSBhbGwgZXZlbnRzIGZvciBhIHNwZWNpZmljIG5hbWVcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICBldmVudHMgPSB0aGlzLl9ldmVudHNbbmFtZV07XHJcbiAgICAgICAgICAgIGlmIChldmVudHMpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50cy5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIGFsbCBldmVudHMgdGhhdCBtYXRjaCB3aGF0ZXZlciBjb21iaW5hdGlvbiBvZiBuYW1lLCBjb250ZXh0XHJcbiAgICAgICAgLy8gYW5kIGNhbGxiYWNrLlxyXG4gICAgICAgIG5hbWVzID0gbmFtZSA/IFtuYW1lXSA6IE9iamVjdC5rZXlzKHRoaXMuX2V2ZW50cyk7XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIG4gPSBuYW1lc1tpXTtcclxuICAgICAgICAgICAgZXZlbnRzID0gdGhpcy5fZXZlbnRzW25dO1xyXG4gICAgICAgICAgICBqID0gZXZlbnRzLmxlbmd0aDtcclxuICAgICAgICAgICAgd2hpbGUgKGotLSkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQgPSBldmVudHNbal07XHJcbiAgICAgICAgICAgICAgICBpZiAoKGNhbGxiYWNrICYmIGNhbGxiYWNrID09PSBldmVudC5jYWxsYmFjaykgfHxcclxuICAgICAgICAgICAgICAgICAgICAoY29udGV4dCAmJiBjb250ZXh0ID09PSBldmVudC5jb250ZXh0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy5zcGxpY2UoaiwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvL0JvcnJvd2VkIGZyb20gZDMuY2hhcnRcclxuICAgIC8qKlxyXG4gICAgICogUHVibGlzaCBhbiBldmVudCBvbiB0aGlzIGNoYXJ0IHdpdGggdGhlIGdpdmVuIGBuYW1lYC5cclxuICAgICAqXHJcbiAgICAgKiBAZXh0ZXJuYWxFeGFtcGxlIHtydW5uYWJsZX0gY2hhcnQtdHJpZ2dlclxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGV2ZW50IHRvIHB1Ymxpc2hcclxuICAgICAqIEBwYXJhbSB7Li4uKn0gYXJndW1lbnRzIFZhbHVlcyB3aXRoIHdoaWNoIHRvIGludm9rZSB0aGUgcmVnaXN0ZXJlZFxyXG4gICAgICogICAgICAgIGNhbGxiYWNrcy5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Q2hhcnR9IEEgcmVmZXJlbmNlIHRvIHRoaXMgY2hhcnQgKGNoYWluYWJsZSkuXHJcbiAgICAgKi9cclxuICAgIHRyaWdnZXIobmFtZSkge1xyXG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcclxuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy5fZXZlbnRzW25hbWVdO1xyXG4gICAgICAgIHZhciBpLCBldjtcclxuXHJcbiAgICAgICAgaWYgKGV2ZW50cyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGV2ID0gZXZlbnRzW2ldO1xyXG4gICAgICAgICAgICAgICAgZXYuY2FsbGJhY2suYXBwbHkoZXYuY29udGV4dCwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICBnZXRCYXNlQ29udGFpbmVyTm9kZSgpe1xyXG4gICAgICAgIGlmKHRoaXMuX2lzQXR0YWNoZWQpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5iYXNlQ29udGFpbmVyLnN2Zy5ub2RlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkMy5zZWxlY3QodGhpcy5iYXNlQ29udGFpbmVyKS5ub2RlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJlZml4Q2xhc3MoY2xhenosIGFkZERvdCl7XHJcbiAgICAgICAgcmV0dXJuIGFkZERvdD8gJy4nOiAnJyt0aGlzLmNvbmZpZy5jc3NDbGFzc1ByZWZpeCtjbGF6ejtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NoYXJ0LCBDaGFydENvbmZpZ30gZnJvbSBcIi4vY2hhcnRcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IHtTdGF0aXN0aWNzVXRpbHN9IGZyb20gJy4vc3RhdGlzdGljcy11dGlscydcclxuaW1wb3J0IHtMZWdlbmR9IGZyb20gJy4vbGVnZW5kJ1xyXG5pbXBvcnQge1NjYXR0ZXJQbG90fSBmcm9tICcuL3NjYXR0ZXJwbG90J1xyXG5cclxuZXhwb3J0IGNsYXNzIENvcnJlbGF0aW9uTWF0cml4Q29uZmlnIGV4dGVuZHMgQ2hhcnRDb25maWcge1xyXG5cclxuICAgIHN2Z0NsYXNzID0gJ29kYy1jb3JyZWxhdGlvbi1tYXRyaXgnO1xyXG4gICAgZ3VpZGVzID0gZmFsc2U7IC8vc2hvdyBheGlzIGd1aWRlc1xyXG4gICAgdG9vbHRpcCA9IHRydWU7IC8vc2hvdyB0b29sdGlwIG9uIGRvdCBob3ZlclxyXG4gICAgbGVnZW5kID0gdHJ1ZTtcclxuICAgIGhpZ2hsaWdodExhYmVscyA9IHRydWU7XHJcbiAgICB2YXJpYWJsZXMgPSB7XHJcbiAgICAgICAgbGFiZWxzOiB1bmRlZmluZWQsXHJcbiAgICAgICAga2V5czogW10sIC8vb3B0aW9uYWwgYXJyYXkgb2YgdmFyaWFibGUga2V5c1xyXG4gICAgICAgIHZhbHVlOiAoZCwgdmFyaWFibGVLZXkpID0+IGRbdmFyaWFibGVLZXldLCAvLyB2YXJpYWJsZSB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgIHNjYWxlOiBcIm9yZGluYWxcIlxyXG4gICAgfTtcclxuICAgIGNvcnJlbGF0aW9uID0ge1xyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiLFxyXG4gICAgICAgIGRvbWFpbjogWy0xLCAtMC43NSwgLTAuNSwgMCwgMC41LCAwLjc1LCAxXSxcclxuICAgICAgICByYW5nZTogW1wiZGFya2JsdWVcIiwgXCJibHVlXCIsIFwibGlnaHRza3libHVlXCIsIFwid2hpdGVcIiwgXCJvcmFuZ2VyZWRcIiwgXCJjcmltc29uXCIsIFwiZGFya3JlZFwiXSxcclxuICAgICAgICB2YWx1ZTogKHhWYWx1ZXMsIHlWYWx1ZXMpID0+IFN0YXRpc3RpY3NVdGlscy5zYW1wbGVDb3JyZWxhdGlvbih4VmFsdWVzLCB5VmFsdWVzKVxyXG5cclxuICAgIH07XHJcbiAgICBjZWxsID0ge1xyXG4gICAgICAgIHNoYXBlOiBcImVsbGlwc2VcIiwgLy9wb3NzaWJsZSB2YWx1ZXM6IHJlY3QsIGNpcmNsZSwgZWxsaXBzZVxyXG4gICAgICAgIHNpemU6IHVuZGVmaW5lZCxcclxuICAgICAgICBzaXplTWluOiA1LFxyXG4gICAgICAgIHNpemVNYXg6IDgwLFxyXG4gICAgICAgIHBhZGRpbmc6IDFcclxuICAgIH07XHJcbiAgICBtYXJnaW4gPSB7XHJcbiAgICAgICAgbGVmdDogNjAsXHJcbiAgICAgICAgcmlnaHQ6IDUwLFxyXG4gICAgICAgIHRvcDogMzAsXHJcbiAgICAgICAgYm90dG9tOiA2MFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIGlmIChjdXN0b20pIHtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENvcnJlbGF0aW9uTWF0cml4IGV4dGVuZHMgQ2hhcnQge1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IENvcnJlbGF0aW9uTWF0cml4Q29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBDb3JyZWxhdGlvbk1hdHJpeENvbmZpZyhjb25maWcpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSB0aGlzLmNvbmZpZy5tYXJnaW47XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICB0aGlzLnBsb3QgPSB7XHJcbiAgICAgICAgICAgIHg6IHt9LFxyXG4gICAgICAgICAgICBjb3JyZWxhdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgbWF0cml4OiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBjZWxsczogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgY29sb3I6IHt9LFxyXG4gICAgICAgICAgICAgICAgc2hhcGU6IHt9XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5zZXR1cFZhcmlhYmxlcygpO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IGNvbmYud2lkdGg7XHJcbiAgICAgICAgdmFyIHBsYWNlaG9sZGVyTm9kZSA9IHRoaXMuZ2V0QmFzZUNvbnRhaW5lck5vZGUoKTtcclxuICAgICAgICB0aGlzLnBsb3QucGxhY2Vob2xkZXJOb2RlID0gcGxhY2Vob2xkZXJOb2RlO1xyXG5cclxuICAgICAgICB2YXIgcGFyZW50V2lkdGggPSBwbGFjZWhvbGRlck5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XHJcbiAgICAgICAgaWYgKHdpZHRoKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMucGxvdC5jZWxsU2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxTaXplID0gTWF0aC5tYXgoY29uZi5jZWxsLnNpemVNaW4sIE1hdGgubWluKGNvbmYuY2VsbC5zaXplTWF4LCAod2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodCkgLyB0aGlzLnBsb3QudmFyaWFibGVzLmxlbmd0aCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsU2l6ZSA9IHRoaXMuY29uZmlnLmNlbGwuc2l6ZTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wbG90LmNlbGxTaXplKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuY2VsbFNpemUgPSBNYXRoLm1heChjb25mLmNlbGwuc2l6ZU1pbiwgTWF0aC5taW4oY29uZi5jZWxsLnNpemVNYXgsIHBhcmVudFdpZHRoIC8gdGhpcy5wbG90LnZhcmlhYmxlcy5sZW5ndGgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgd2lkdGggPSB0aGlzLnBsb3QuY2VsbFNpemUgKiB0aGlzLnBsb3QudmFyaWFibGVzLmxlbmd0aCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0O1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBoZWlnaHQgPSB3aWR0aDtcclxuICAgICAgICBpZiAoIWhlaWdodCkge1xyXG4gICAgICAgICAgICBoZWlnaHQgPSBwbGFjZWhvbGRlck5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wbG90LndpZHRoID0gd2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodDtcclxuICAgICAgICB0aGlzLnBsb3QuaGVpZ2h0ID0gdGhpcy5wbG90LndpZHRoO1xyXG5cclxuICAgICAgICB0aGlzLnNldHVwVmFyaWFibGVzU2NhbGVzKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cENvcnJlbGF0aW9uU2NhbGVzKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cENvcnJlbGF0aW9uTWF0cml4KCk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cFZhcmlhYmxlc1NjYWxlcygpIHtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHggPSBwbG90Lng7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZy52YXJpYWJsZXM7XHJcblxyXG4gICAgICAgIC8qICpcclxuICAgICAgICAgKiB2YWx1ZSBhY2Nlc3NvciAtIHJldHVybnMgdGhlIHZhbHVlIHRvIGVuY29kZSBmb3IgYSBnaXZlbiBkYXRhIG9iamVjdC5cclxuICAgICAgICAgKiBzY2FsZSAtIG1hcHMgdmFsdWUgdG8gYSB2aXN1YWwgZGlzcGxheSBlbmNvZGluZywgc3VjaCBhcyBhIHBpeGVsIHBvc2l0aW9uLlxyXG4gICAgICAgICAqIG1hcCBmdW5jdGlvbiAtIG1hcHMgZnJvbSBkYXRhIHZhbHVlIHRvIGRpc3BsYXkgdmFsdWVcclxuICAgICAgICAgKiBheGlzIC0gc2V0cyB1cCBheGlzXHJcbiAgICAgICAgICoqL1xyXG4gICAgICAgIHgudmFsdWUgPSBjb25mLnZhbHVlO1xyXG4gICAgICAgIHguc2NhbGUgPSBkMy5zY2FsZVtjb25mLnNjYWxlXSgpLnJhbmdlQmFuZHMoW3Bsb3Qud2lkdGgsIDBdKTtcclxuICAgICAgICB4Lm1hcCA9IGQgPT4geC5zY2FsZSh4LnZhbHVlKGQpKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwQ29ycmVsYXRpb25TY2FsZXMoKSB7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIGNvcnJDb25mID0gdGhpcy5jb25maWcuY29ycmVsYXRpb247XHJcblxyXG4gICAgICAgIHBsb3QuY29ycmVsYXRpb24uY29sb3Iuc2NhbGUgPSBkMy5zY2FsZVtjb3JyQ29uZi5zY2FsZV0oKS5kb21haW4oY29yckNvbmYuZG9tYWluKS5yYW5nZShjb3JyQ29uZi5yYW5nZSk7XHJcbiAgICAgICAgdmFyIHNoYXBlID0gcGxvdC5jb3JyZWxhdGlvbi5zaGFwZSA9IHt9O1xyXG5cclxuICAgICAgICB2YXIgY2VsbENvbmYgPSB0aGlzLmNvbmZpZy5jZWxsO1xyXG4gICAgICAgIHNoYXBlLnR5cGUgPSBjZWxsQ29uZi5zaGFwZTtcclxuXHJcbiAgICAgICAgdmFyIHNoYXBlU2l6ZSA9IHBsb3QuY2VsbFNpemUgLSBjZWxsQ29uZi5wYWRkaW5nICogMjtcclxuICAgICAgICBpZiAoc2hhcGUudHlwZSA9PSAnY2lyY2xlJykge1xyXG4gICAgICAgICAgICB2YXIgcmFkaXVzTWF4ID0gc2hhcGVTaXplIC8gMjtcclxuICAgICAgICAgICAgc2hhcGUucmFkaXVzU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzAsIDFdKS5yYW5nZShbMiwgcmFkaXVzTWF4XSk7XHJcbiAgICAgICAgICAgIHNoYXBlLnJhZGl1cyA9IGM9PiBzaGFwZS5yYWRpdXNTY2FsZShNYXRoLmFicyhjLnZhbHVlKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzaGFwZS50eXBlID09ICdlbGxpcHNlJykge1xyXG4gICAgICAgICAgICB2YXIgcmFkaXVzTWF4ID0gc2hhcGVTaXplIC8gMjtcclxuICAgICAgICAgICAgc2hhcGUucmFkaXVzU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzAsIDFdKS5yYW5nZShbcmFkaXVzTWF4LCAyXSk7XHJcbiAgICAgICAgICAgIHNoYXBlLnJhZGl1c1ggPSBjPT4gc2hhcGUucmFkaXVzU2NhbGUoTWF0aC5hYnMoYy52YWx1ZSkpO1xyXG4gICAgICAgICAgICBzaGFwZS5yYWRpdXNZID0gcmFkaXVzTWF4O1xyXG5cclxuICAgICAgICAgICAgc2hhcGUucm90YXRlVmFsID0gdiA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodiA9PSAwKSByZXR1cm4gXCIwXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAodiA8IDApIHJldHVybiBcIi00NVwiO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiNDVcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChzaGFwZS50eXBlID09ICdyZWN0Jykge1xyXG4gICAgICAgICAgICBzaGFwZS5zaXplID0gc2hhcGVTaXplO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNldHVwVmFyaWFibGVzKCkge1xyXG5cclxuICAgICAgICB2YXIgdmFyaWFibGVzQ29uZiA9IHRoaXMuY29uZmlnLnZhcmlhYmxlcztcclxuXHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgcGxvdC5kb21haW5CeVZhcmlhYmxlID0ge307XHJcbiAgICAgICAgcGxvdC52YXJpYWJsZXMgPSB2YXJpYWJsZXNDb25mLmtleXM7XHJcbiAgICAgICAgaWYgKCFwbG90LnZhcmlhYmxlcyB8fCAhcGxvdC52YXJpYWJsZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHBsb3QudmFyaWFibGVzID0gVXRpbHMuaW5mZXJWYXJpYWJsZXMoZGF0YSwgdGhpcy5jb25maWcuZ3JvdXBzLmtleSwgdGhpcy5jb25maWcuaW5jbHVkZUluUGxvdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwbG90LmxhYmVscyA9IFtdO1xyXG4gICAgICAgIHBsb3QubGFiZWxCeVZhcmlhYmxlID0ge307XHJcbiAgICAgICAgcGxvdC52YXJpYWJsZXMuZm9yRWFjaCgodmFyaWFibGVLZXksIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHBsb3QuZG9tYWluQnlWYXJpYWJsZVt2YXJpYWJsZUtleV0gPSBkMy5leHRlbnQoZGF0YSwgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YXJpYWJsZXNDb25mLnZhbHVlKGQsIHZhcmlhYmxlS2V5KVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdmFyIGxhYmVsID0gdmFyaWFibGVLZXk7XHJcbiAgICAgICAgICAgIGlmICh2YXJpYWJsZXNDb25mLmxhYmVscyAmJiB2YXJpYWJsZXNDb25mLmxhYmVscy5sZW5ndGggPiBpbmRleCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxhYmVsID0gdmFyaWFibGVzQ29uZi5sYWJlbHNbaW5kZXhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBsb3QubGFiZWxzLnB1c2gobGFiZWwpO1xyXG4gICAgICAgICAgICBwbG90LmxhYmVsQnlWYXJpYWJsZVt2YXJpYWJsZUtleV0gPSBsYWJlbDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2cocGxvdC5sYWJlbEJ5VmFyaWFibGUpO1xyXG5cclxuICAgIH07XHJcblxyXG5cclxuICAgIHNldHVwQ29ycmVsYXRpb25NYXRyaXgoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIHZhciBtYXRyaXggPSB0aGlzLnBsb3QuY29ycmVsYXRpb24ubWF0cml4ID0gW107XHJcbiAgICAgICAgdmFyIG1hdHJpeENlbGxzID0gdGhpcy5wbG90LmNvcnJlbGF0aW9uLm1hdHJpeC5jZWxscyA9IFtdO1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG5cclxuICAgICAgICB2YXIgdmFyaWFibGVUb1ZhbHVlcyA9IHt9O1xyXG4gICAgICAgIHBsb3QudmFyaWFibGVzLmZvckVhY2goKHYsIGkpID0+IHtcclxuXHJcbiAgICAgICAgICAgIHZhcmlhYmxlVG9WYWx1ZXNbdl0gPSBkYXRhLm1hcChkPT5wbG90LngudmFsdWUoZCwgdikpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBwbG90LnZhcmlhYmxlcy5mb3JFYWNoKCh2MSwgaSkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgcm93ID0gW107XHJcbiAgICAgICAgICAgIG1hdHJpeC5wdXNoKHJvdyk7XHJcblxyXG4gICAgICAgICAgICBwbG90LnZhcmlhYmxlcy5mb3JFYWNoKCh2MiwgaikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvcnIgPSAxO1xyXG4gICAgICAgICAgICAgICAgaWYgKHYxICE9IHYyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29yciA9IHNlbGYuY29uZmlnLmNvcnJlbGF0aW9uLnZhbHVlKHZhcmlhYmxlVG9WYWx1ZXNbdjFdLCB2YXJpYWJsZVRvVmFsdWVzW3YyXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgY2VsbCA9IHtcclxuICAgICAgICAgICAgICAgICAgICByb3dWYXI6IHYxLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbFZhcjogdjIsXHJcbiAgICAgICAgICAgICAgICAgICAgcm93OiBpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbDogaixcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogY29yclxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJvdy5wdXNoKGNlbGwpO1xyXG5cclxuICAgICAgICAgICAgICAgIG1hdHJpeENlbGxzLnB1c2goY2VsbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgdXBkYXRlKG5ld0RhdGEpIHtcclxuICAgICAgICBzdXBlci51cGRhdGUobmV3RGF0YSk7XHJcbiAgICAgICAgLy8gdGhpcy51cGRhdGVcclxuICAgICAgICB0aGlzLnVwZGF0ZUNlbGxzKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWYXJpYWJsZUxhYmVscygpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcubGVnZW5kKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGVnZW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB1cGRhdGVWYXJpYWJsZUxhYmVscygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGxhYmVsQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwibGFiZWxcIik7XHJcbiAgICAgICAgdmFyIGxhYmVsWENsYXNzID0gbGFiZWxDbGFzcyArIFwiLXhcIjtcclxuICAgICAgICB2YXIgbGFiZWxZQ2xhc3MgPSBsYWJlbENsYXNzICsgXCIteVwiO1xyXG4gICAgICAgIHBsb3QubGFiZWxDbGFzcyA9IGxhYmVsQ2xhc3M7XHJcblxyXG5cclxuICAgICAgICB2YXIgbGFiZWxzWCA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiK2xhYmVsWENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShwbG90LnZhcmlhYmxlcywgKGQsIGkpPT5pKTtcclxuXHJcbiAgICAgICAgbGFiZWxzWC5lbnRlcigpLmFwcGVuZChcInRleHRcIikuYXR0cihcImNsYXNzXCIsIChkLCBpKSA9PiBsYWJlbENsYXNzICsgXCIgXCIgK2xhYmVsWENsYXNzK1wiIFwiKyBsYWJlbFhDbGFzcyArIFwiLVwiICsgaSk7XHJcblxyXG5cclxuICAgICAgICBsYWJlbHNYXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAoZCwgaSkgPT4gaSAqIHBsb3QuY2VsbFNpemUgKyBwbG90LmNlbGxTaXplIC8gMilcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIHBsb3QuaGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcImR4XCIsIC0yKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCAoZCwgaSkgPT4gXCJyb3RhdGUoLTkwLCBcIiArIChpICogcGxvdC5jZWxsU2l6ZSArIHBsb3QuY2VsbFNpemUgLyAyICApICsgXCIsIFwiICsgcGxvdC5oZWlnaHQgKyBcIilcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKVxyXG5cclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcImhhbmdpbmdcIilcclxuICAgICAgICAgICAgLnRleHQodj0+cGxvdC5sYWJlbEJ5VmFyaWFibGVbdl0pO1xyXG5cclxuICAgICAgICBsYWJlbHNYLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgLy8vLy8vXHJcblxyXG4gICAgICAgIHZhciBsYWJlbHNZID0gc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIrbGFiZWxZQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBsb3QudmFyaWFibGVzKTtcclxuXHJcbiAgICAgICAgbGFiZWxzWS5lbnRlcigpLmFwcGVuZChcInRleHRcIik7XHJcblxyXG5cclxuICAgICAgICBsYWJlbHNZXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgKGQsIGkpID0+IGkgKiBwbG90LmNlbGxTaXplICsgcGxvdC5jZWxsU2l6ZSAvIDIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHhcIiwgLTIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCAoZCwgaSkgPT4gbGFiZWxDbGFzcyArIFwiIFwiICsgbGFiZWxZQ2xhc3MgK1wiIFwiICsgbGFiZWxZQ2xhc3MgKyBcIi1cIiArIGkpXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJoYW5naW5nXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KHY9PnBsb3QubGFiZWxCeVZhcmlhYmxlW3ZdKTtcclxuXHJcbiAgICAgICAgbGFiZWxzWS5leGl0KCkucmVtb3ZlKCk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVDZWxscygpIHtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBjZWxsQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwiY2VsbFwiKTtcclxuICAgICAgICB2YXIgY2VsbFNoYXBlID0gcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS50eXBlO1xyXG5cclxuICAgICAgICB2YXIgY2VsbHMgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwiZy5cIitjZWxsQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBsb3QuY29ycmVsYXRpb24ubWF0cml4LmNlbGxzKTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NlbGxzLmVudGVyKCknLGNlbGxzLmVudGVyKCkpO1xyXG5cclxuICAgICAgICB2YXIgY2VsbEVudGVyRyA9IGNlbGxzLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuY2xhc3NlZChjZWxsQ2xhc3MsIHRydWUpO1xyXG4gICAgICAgIGNlbGxzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYz0+IFwidHJhbnNsYXRlKFwiICsgKHBsb3QuY2VsbFNpemUgKiBjLmNvbCArIHBsb3QuY2VsbFNpemUgLyAyKSArIFwiLFwiICsgKHBsb3QuY2VsbFNpemUgKiBjLnJvdyArIHBsb3QuY2VsbFNpemUgLyAyKSArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgY2VsbHMuY2xhc3NlZChzZWxmLmNvbmZpZy5jc3NDbGFzc1ByZWZpeCArIFwic2VsZWN0YWJsZVwiLCAhIXNlbGYuc2NhdHRlclBsb3QpO1xyXG5cclxuICAgICAgICB2YXIgc2VsZWN0b3IgPSBcIio6bm90KC5jZWxsLXNoYXBlLVwiK2NlbGxTaGFwZStcIilcIjtcclxuICAgICAgIFxyXG4gICAgICAgIHZhciB3cm9uZ1NoYXBlcyA9IGNlbGxzLnNlbGVjdEFsbChzZWxlY3Rvcik7XHJcbiAgICAgICAgd3JvbmdTaGFwZXMucmVtb3ZlKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHNoYXBlcyA9IGNlbGxzLnNlbGVjdE9yQXBwZW5kKGNlbGxTaGFwZStcIi5jZWxsLXNoYXBlLVwiK2NlbGxTaGFwZSk7XHJcblxyXG4gICAgICAgIGlmIChwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnR5cGUgPT0gJ2NpcmNsZScpIHtcclxuXHJcbiAgICAgICAgICAgIHNoYXBlc1xyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJyXCIsIHBsb3QuY29ycmVsYXRpb24uc2hhcGUucmFkaXVzKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCAwKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnR5cGUgPT0gJ2VsbGlwc2UnKSB7XHJcbiAgICAgICAgICAgIC8vIGNlbGxzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYz0+IFwidHJhbnNsYXRlKDMwMCwxNTApIHJvdGF0ZShcIitwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnJvdGF0ZVZhbChjLnZhbHVlKStcIilcIik7XHJcbiAgICAgICAgICAgIHNoYXBlc1xyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJyeFwiLCBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnJhZGl1c1gpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInJ5XCIsIHBsb3QuY29ycmVsYXRpb24uc2hhcGUucmFkaXVzWSlcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY3hcIiwgMClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY3lcIiwgMClcclxuXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBjPT4gXCJyb3RhdGUoXCIgKyBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnJvdGF0ZVZhbChjLnZhbHVlKSArIFwiKVwiKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBpZiAocGxvdC5jb3JyZWxhdGlvbi5zaGFwZS50eXBlID09ICdyZWN0Jykge1xyXG4gICAgICAgICAgICBzaGFwZXNcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5zaXplKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5zaXplKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIC1wbG90LmNlbGxTaXplIC8gMilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieVwiLCAtcGxvdC5jZWxsU2l6ZSAvIDIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzaGFwZXMuc3R5bGUoXCJmaWxsXCIsIGM9PiBwbG90LmNvcnJlbGF0aW9uLmNvbG9yLnNjYWxlKGMudmFsdWUpKTtcclxuXHJcbiAgICAgICAgdmFyIG1vdXNlb3ZlckNhbGxiYWNrcyA9IFtdO1xyXG4gICAgICAgIHZhciBtb3VzZW91dENhbGxiYWNrcyA9IFtdO1xyXG5cclxuICAgICAgICBpZiAocGxvdC50b29sdGlwKSB7XHJcblxyXG4gICAgICAgICAgICBtb3VzZW92ZXJDYWxsYmFja3MucHVzaChjPT4ge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAuOSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IGMudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAuaHRtbChodG1sKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkMy5ldmVudC5wYWdlWSAtIDI4KSArIFwicHhcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MucHVzaChjPT4ge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy5oaWdobGlnaHRMYWJlbHMpIHtcclxuICAgICAgICAgICAgdmFyIGhpZ2hsaWdodENsYXNzID0gc2VsZi5jb25maWcuY3NzQ2xhc3NQcmVmaXggKyBcImhpZ2hsaWdodFwiO1xyXG4gICAgICAgICAgICB2YXIgeExhYmVsQ2xhc3MgPSBjPT5wbG90LmxhYmVsQ2xhc3MgKyBcIi14LVwiICsgYy5jb2w7XHJcbiAgICAgICAgICAgIHZhciB5TGFiZWxDbGFzcyA9IGM9PnBsb3QubGFiZWxDbGFzcyArIFwiLXktXCIgKyBjLnJvdztcclxuXHJcblxyXG4gICAgICAgICAgICBtb3VzZW92ZXJDYWxsYmFja3MucHVzaChjPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgeExhYmVsQ2xhc3MoYykpLmNsYXNzZWQoaGlnaGxpZ2h0Q2xhc3MsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB5TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBtb3VzZW91dENhbGxiYWNrcy5wdXNoKGM9PiB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHhMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHlMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGNlbGxzLm9uKFwibW91c2VvdmVyXCIsIGMgPT4ge1xyXG4gICAgICAgICAgICBtb3VzZW92ZXJDYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjaz0+Y2FsbGJhY2soYykpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGMgPT4ge1xyXG4gICAgICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjaz0+Y2FsbGJhY2soYykpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY2VsbHMub24oXCJjbGlja1wiLCBjPT57XHJcbiAgICAgICAgICAgc2VsZi50cmlnZ2VyKFwiY2VsbC1zZWxlY3RlZFwiLCBjKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG5cclxuICAgICAgICBjZWxscy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHVwZGF0ZUxlZ2VuZCgpIHtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIGxlZ2VuZFggPSB0aGlzLnBsb3Qud2lkdGggKyAxMDtcclxuICAgICAgICB2YXIgbGVnZW5kWSA9IDA7XHJcbiAgICAgICAgdmFyIGJhcldpZHRoID0gMTA7XHJcbiAgICAgICAgdmFyIGJhckhlaWdodCA9IHRoaXMucGxvdC5oZWlnaHQgLSAyO1xyXG4gICAgICAgIHZhciBzY2FsZSA9IHBsb3QuY29ycmVsYXRpb24uY29sb3Iuc2NhbGU7XHJcblxyXG4gICAgICAgIHBsb3QubGVnZW5kID0gbmV3IExlZ2VuZCh0aGlzLnN2ZywgdGhpcy5zdmdHLCBzY2FsZSwgbGVnZW5kWCwgbGVnZW5kWSkubGluZWFyR3JhZGllbnRCYXIoYmFyV2lkdGgsIGJhckhlaWdodCk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBhdHRhY2hTY2F0dGVyUGxvdChjb250YWluZXJTZWxlY3RvciwgY29uZmlnKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBjb25maWcgPSBjb25maWcgfHwge307XHJcblxyXG5cclxuICAgICAgICB2YXIgc2NhdHRlclBsb3RDb25maWcgPSB7XHJcbiAgICAgICAgICAgIGhlaWdodDogc2VsZi5wbG90LmhlaWdodCtzZWxmLmNvbmZpZy5tYXJnaW4udG9wKyBzZWxmLmNvbmZpZy5tYXJnaW4uYm90dG9tLFxyXG4gICAgICAgICAgICB3aWR0aDogc2VsZi5wbG90LmhlaWdodCtzZWxmLmNvbmZpZy5tYXJnaW4udG9wKyBzZWxmLmNvbmZpZy5tYXJnaW4uYm90dG9tLFxyXG4gICAgICAgICAgICBncm91cHM6e1xyXG4gICAgICAgICAgICAgICAga2V5OiBzZWxmLmNvbmZpZy5ncm91cHMua2V5LFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6IHNlbGYuY29uZmlnLmdyb3Vwcy5sYWJlbFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBndWlkZXM6IHRydWVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNjYXR0ZXJQbG90PXRydWU7XHJcblxyXG4gICAgICAgIHNjYXR0ZXJQbG90Q29uZmlnID0gVXRpbHMuZGVlcEV4dGVuZChzY2F0dGVyUGxvdENvbmZpZywgY29uZmlnKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm9uKFwiY2VsbC1zZWxlY3RlZFwiLCBjPT57XHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgIHNjYXR0ZXJQbG90Q29uZmlnLng9e1xyXG4gICAgICAgICAgICAgICAga2V5OiBjLnJvd1ZhcixcclxuICAgICAgICAgICAgICAgIGxhYmVsOiBzZWxmLnBsb3QubGFiZWxCeVZhcmlhYmxlW2Mucm93VmFyXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBzY2F0dGVyUGxvdENvbmZpZy55PXtcclxuICAgICAgICAgICAgICAgIGtleTogYy5jb2xWYXIsXHJcbiAgICAgICAgICAgICAgICBsYWJlbDogc2VsZi5wbG90LmxhYmVsQnlWYXJpYWJsZVtjLmNvbFZhcl1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYoc2VsZi5zY2F0dGVyUGxvdCAmJiBzZWxmLnNjYXR0ZXJQbG90ICE9PXRydWUpe1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zY2F0dGVyUGxvdC5zZXRDb25maWcoc2NhdHRlclBsb3RDb25maWcpLmluaXQoKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNjYXR0ZXJQbG90ID0gbmV3IFNjYXR0ZXJQbG90KGNvbnRhaW5lclNlbGVjdG9yLCBzZWxmLmRhdGEsIHNjYXR0ZXJQbG90Q29uZmlnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXR0YWNoKFwiU2NhdHRlclBsb3RcIiwgc2VsZi5zY2F0dGVyUGxvdCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgRDNFeHRlbnNpb25ze1xyXG5cclxuICAgIHN0YXRpYyBleHRlbmQoKXtcclxuXHJcbiAgICAgICAgZDMuc2VsZWN0aW9uLmVudGVyLnByb3RvdHlwZS5hcHBlbmRTZWxlY3RvciA9XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdGlvbi5wcm90b3R5cGUuYXBwZW5kU2VsZWN0b3IgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFV0aWxzLmFwcGVuZFNlbGVjdG9yKHRoaXMsIHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZDMuc2VsZWN0aW9uLmVudGVyLnByb3RvdHlwZS5zZWxlY3RPckFwcGVuZCA9XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdGlvbi5wcm90b3R5cGUuc2VsZWN0T3JBcHBlbmQgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFV0aWxzLnNlbGVjdE9yQXBwZW5kKHRoaXMsIHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0QzRXh0ZW5zaW9uc30gZnJvbSAnLi9kMy1leHRlbnNpb25zJ1xyXG5EM0V4dGVuc2lvbnMuZXh0ZW5kKCk7XHJcblxyXG5leHBvcnQge1NjYXR0ZXJQbG90LCBTY2F0dGVyUGxvdENvbmZpZ30gZnJvbSBcIi4vc2NhdHRlcnBsb3RcIjtcclxuZXhwb3J0IHtTY2F0dGVyUGxvdE1hdHJpeCwgU2NhdHRlclBsb3RNYXRyaXhDb25maWd9IGZyb20gXCIuL3NjYXR0ZXJwbG90LW1hdHJpeFwiO1xyXG5leHBvcnQge0NvcnJlbGF0aW9uTWF0cml4LCBDb3JyZWxhdGlvbk1hdHJpeENvbmZpZ30gZnJvbSAnLi9jb3JyZWxhdGlvbi1tYXRyaXgnXHJcbmV4cG9ydCB7U3RhdGlzdGljc1V0aWxzfSBmcm9tICcuL3N0YXRpc3RpY3MtdXRpbHMnXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiIsImltcG9ydCB7VXRpbHN9IGZyb20gXCIuL3V0aWxzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTGVnZW5kIHtcclxuXHJcbiAgICBjc3NDbGFzc1ByZWZpeD1cIm9kYy1cIjtcclxuICAgIGxlZ2VuZENsYXNzPXRoaXMuY3NzQ2xhc3NQcmVmaXgrXCJsZWdlbmRcIjtcclxuICAgIGNvbnRhaW5lcjtcclxuICAgIHNjYWxlO1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzdmcsIGxlZ2VuZFBhcmVudCwgc2NhbGUsIGxlZ2VuZFgsIGxlZ2VuZFkpe1xyXG4gICAgICAgIHRoaXMuc2NhbGU9c2NhbGU7XHJcbiAgICAgICAgdGhpcy5zdmcgPSBzdmc7XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gIFV0aWxzLnNlbGVjdE9yQXBwZW5kKGxlZ2VuZFBhcmVudCwgXCJnLlwiK3RoaXMubGVnZW5kQ2xhc3MsIFwiZ1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIitsZWdlbmRYK1wiLFwiK2xlZ2VuZFkrXCIpXCIpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKHRoaXMubGVnZW5kQ2xhc3MsIHRydWUpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBsaW5lYXJHcmFkaWVudEJhcihiYXJXaWR0aCwgYmFySGVpZ2h0KXtcclxuICAgICAgICB2YXIgZ3JhZGllbnRJZCA9IHRoaXMuY3NzQ2xhc3NQcmVmaXgrXCJsaW5lYXItZ3JhZGllbnRcIjtcclxuICAgICAgICB2YXIgc2NhbGU9IHRoaXMuc2NhbGU7XHJcblxyXG4gICAgICAgIHRoaXMubGluZWFyR3JhZGllbnQgPSBVdGlscy5saW5lYXJHcmFkaWVudCh0aGlzLnN2ZywgZ3JhZGllbnRJZCwgdGhpcy5zY2FsZS5yYW5nZSgpLCAwLCAxMDAsIDAsIDApO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmQoXCJyZWN0XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgYmFyV2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGJhckhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAwKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwidXJsKCNcIitncmFkaWVudElkK1wiKVwiKTtcclxuXHJcblxyXG4gICAgICAgIHZhciB0aWNrcyA9IHRoaXMuY29udGFpbmVyLnNlbGVjdEFsbChcInRleHRcIilcclxuICAgICAgICAgICAgLmRhdGEoIHNjYWxlLmRvbWFpbigpICk7XHJcbiAgICAgICAgdmFyIHRpY2tzTnVtYmVyID1zY2FsZS5kb21haW4oKS5sZW5ndGgtMTtcclxuICAgICAgICB0aWNrcy5lbnRlcigpLmFwcGVuZChcInRleHRcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIGJhcldpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgIChkLCBpKSA9PiAgYmFySGVpZ2h0IC0oaSpiYXJIZWlnaHQvdGlja3NOdW1iZXIpKVxyXG4gICAgICAgICAgICAuYXR0cihcImR4XCIsIDMpXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiZHlcIiwgMSlcclxuICAgICAgICAgICAgLmF0dHIoXCJhbGlnbm1lbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoZD0+ZCk7XHJcblxyXG4gICAgICAgIHRpY2tzLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHtDaGFydCwgQ2hhcnRDb25maWd9IGZyb20gXCIuL2NoYXJ0XCI7XHJcbmltcG9ydCB7U2NhdHRlclBsb3RDb25maWd9IGZyb20gXCIuL3NjYXR0ZXJwbG90XCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcblxyXG5leHBvcnQgY2xhc3MgU2NhdHRlclBsb3RNYXRyaXhDb25maWcgZXh0ZW5kcyBTY2F0dGVyUGxvdENvbmZpZ3tcclxuXHJcbiAgICBzdmdDbGFzcz0gdGhpcy5jc3NDbGFzc1ByZWZpeCsnc2NhdHRlcnBsb3QtbWF0cml4JztcclxuICAgIHNpemU9IDIwMDsgLy9zY2F0dGVyIHBsb3QgY2VsbCBzaXplXHJcbiAgICBwYWRkaW5nPSAyMDsgLy9zY2F0dGVyIHBsb3QgY2VsbCBwYWRkaW5nXHJcbiAgICBicnVzaD0gdHJ1ZTtcclxuICAgIGd1aWRlcz0gdHJ1ZTsgLy9zaG93IGF4aXMgZ3VpZGVzXHJcbiAgICB0b29sdGlwPSB0cnVlOyAvL3Nob3cgdG9vbHRpcCBvbiBkb3QgaG92ZXJcclxuICAgIHRpY2tzPSB1bmRlZmluZWQ7IC8vdGlja3MgbnVtYmVyLCAoZGVmYXVsdDogY29tcHV0ZWQgdXNpbmcgY2VsbCBzaXplKVxyXG4gICAgeD17Ly8gWCBheGlzIGNvbmZpZ1xyXG4gICAgICAgIG9yaWVudDogXCJib3R0b21cIixcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIlxyXG4gICAgfTtcclxuICAgIHk9ey8vIFkgYXhpcyBjb25maWdcclxuICAgICAgICBvcmllbnQ6IFwibGVmdFwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiXHJcbiAgICB9O1xyXG4gICAgZ3JvdXBzPXtcclxuICAgICAgICBrZXk6IHVuZGVmaW5lZCwgLy9vYmplY3QgcHJvcGVydHkgbmFtZSBvciBhcnJheSBpbmRleCB3aXRoIGdyb3VwaW5nIHZhcmlhYmxlXHJcbiAgICAgICAgaW5jbHVkZUluUGxvdDogZmFsc2UsIC8vaW5jbHVkZSBncm91cCBhcyB2YXJpYWJsZSBpbiBwbG90LCBib29sZWFuIChkZWZhdWx0OiBmYWxzZSlcclxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oZCwga2V5KSB7IHJldHVybiBkW2tleV0gfSwgLy8gZ3JvdXBpbmcgdmFsdWUgYWNjZXNzb3IsXHJcbiAgICAgICAgbGFiZWw6IFwiXCJcclxuICAgIH07XHJcbiAgICB2YXJpYWJsZXM9IHtcclxuICAgICAgICBsYWJlbHM6IFtdLCAvL29wdGlvbmFsIGFycmF5IG9mIHZhcmlhYmxlIGxhYmVscyAoZm9yIHRoZSBkaWFnb25hbCBvZiB0aGUgcGxvdCkuXHJcbiAgICAgICAga2V5czogW10sIC8vb3B0aW9uYWwgYXJyYXkgb2YgdmFyaWFibGUga2V5c1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoZCwgdmFyaWFibGVLZXkpIHsvLyB2YXJpYWJsZSB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgICAgICByZXR1cm4gZFt2YXJpYWJsZUtleV07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTY2F0dGVyUGxvdE1hdHJpeCBleHRlbmRzIENoYXJ0IHtcclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIG5ldyBTY2F0dGVyUGxvdE1hdHJpeENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgU2NhdHRlclBsb3RNYXRyaXhDb25maWcoY29uZmlnKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCkge1xyXG5cclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSB0aGlzLmNvbmZpZy5tYXJnaW47XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICB0aGlzLnBsb3QgPSB7XHJcbiAgICAgICAgICAgIHg6IHt9LFxyXG4gICAgICAgICAgICB5OiB7fSxcclxuICAgICAgICAgICAgZG90OiB7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogbnVsbC8vY29sb3Igc2NhbGUgbWFwcGluZyBmdW5jdGlvblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cFZhcmlhYmxlcygpO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3Quc2l6ZSA9IGNvbmYuc2l6ZTtcclxuXHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IGNvbmYud2lkdGg7XHJcbiAgICAgICAgdmFyIGJvdW5kaW5nQ2xpZW50UmVjdCA9IHRoaXMuZ2V0QmFzZUNvbnRhaW5lck5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBpZiAoIXdpZHRoKSB7XHJcbiAgICAgICAgICAgIHZhciBtYXhXaWR0aCA9IG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0ICsgdGhpcy5wbG90LnZhcmlhYmxlcy5sZW5ndGgqdGhpcy5wbG90LnNpemU7XHJcbiAgICAgICAgICAgIHdpZHRoID0gTWF0aC5taW4oYm91bmRpbmdDbGllbnRSZWN0LndpZHRoLCBtYXhXaWR0aCk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaGVpZ2h0ID0gd2lkdGg7XHJcbiAgICAgICAgaWYgKCFoZWlnaHQpIHtcclxuICAgICAgICAgICAgaGVpZ2h0ID0gYm91bmRpbmdDbGllbnRSZWN0LmhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC53aWR0aCA9IHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XHJcbiAgICAgICAgdGhpcy5wbG90LmhlaWdodCA9IGhlaWdodCAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tO1xyXG5cclxuXHJcblxyXG5cclxuICAgICAgICBpZihjb25mLnRpY2tzPT09dW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgY29uZi50aWNrcyA9IHRoaXMucGxvdC5zaXplIC8gNDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldHVwWCgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBZKCk7XHJcblxyXG4gICAgICAgIGlmIChjb25mLmRvdC5kM0NvbG9yQ2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmRvdC5jb2xvckNhdGVnb3J5ID0gZDMuc2NhbGVbY29uZi5kb3QuZDNDb2xvckNhdGVnb3J5XSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY29sb3JWYWx1ZSA9IGNvbmYuZG90LmNvbG9yO1xyXG4gICAgICAgIGlmIChjb2xvclZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5kb3QuY29sb3JWYWx1ZSA9IGNvbG9yVmFsdWU7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbG9yVmFsdWUgPT09ICdzdHJpbmcnIHx8IGNvbG9yVmFsdWUgaW5zdGFuY2VvZiBTdHJpbmcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5kb3QuY29sb3IgPSBjb2xvclZhbHVlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucGxvdC5kb3QuY29sb3JDYXRlZ29yeSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmRvdC5jb2xvciA9IGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYucGxvdC5kb3QuY29sb3JDYXRlZ29yeShzZWxmLnBsb3QuZG90LmNvbG9yVmFsdWUoZCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cFZhcmlhYmxlcygpIHtcclxuICAgICAgICB2YXIgdmFyaWFibGVzQ29uZiA9IHRoaXMuY29uZmlnLnZhcmlhYmxlcztcclxuXHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgcGxvdC5kb21haW5CeVZhcmlhYmxlID0ge307XHJcbiAgICAgICAgcGxvdC52YXJpYWJsZXMgPSB2YXJpYWJsZXNDb25mLmtleXM7XHJcbiAgICAgICAgaWYoIXBsb3QudmFyaWFibGVzIHx8ICFwbG90LnZhcmlhYmxlcy5sZW5ndGgpe1xyXG4gICAgICAgICAgICBwbG90LnZhcmlhYmxlcyA9IFV0aWxzLmluZmVyVmFyaWFibGVzKGRhdGEsIHRoaXMuY29uZmlnLmdyb3Vwcy5rZXksIHRoaXMuY29uZmlnLmluY2x1ZGVJblBsb3QpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcGxvdC5sYWJlbHMgPSBbXTtcclxuICAgICAgICBwbG90LmxhYmVsQnlWYXJpYWJsZSA9IHt9O1xyXG4gICAgICAgIHBsb3QudmFyaWFibGVzLmZvckVhY2goZnVuY3Rpb24odmFyaWFibGVLZXksIGluZGV4KSB7XHJcbiAgICAgICAgICAgIHBsb3QuZG9tYWluQnlWYXJpYWJsZVt2YXJpYWJsZUtleV0gPSBkMy5leHRlbnQoZGF0YSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gdmFyaWFibGVzQ29uZi52YWx1ZShkLCB2YXJpYWJsZUtleSkgfSk7XHJcbiAgICAgICAgICAgIHZhciBsYWJlbCA9IHZhcmlhYmxlS2V5O1xyXG4gICAgICAgICAgICBpZih2YXJpYWJsZXNDb25mLmxhYmVscyAmJiB2YXJpYWJsZXNDb25mLmxhYmVscy5sZW5ndGg+aW5kZXgpe1xyXG5cclxuICAgICAgICAgICAgICAgIGxhYmVsID0gdmFyaWFibGVzQ29uZi5sYWJlbHNbaW5kZXhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBsb3QubGFiZWxzLnB1c2gobGFiZWwpO1xyXG4gICAgICAgICAgICBwbG90LmxhYmVsQnlWYXJpYWJsZVt2YXJpYWJsZUtleV0gPSBsYWJlbDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2cocGxvdC5sYWJlbEJ5VmFyaWFibGUpO1xyXG5cclxuICAgICAgICBwbG90LnN1YnBsb3RzID0gW107XHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwWCgpIHtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHggPSBwbG90Lng7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgeC52YWx1ZSA9IGNvbmYudmFyaWFibGVzLnZhbHVlO1xyXG4gICAgICAgIHguc2NhbGUgPSBkMy5zY2FsZVtjb25mLnguc2NhbGVdKCkucmFuZ2UoW2NvbmYucGFkZGluZyAvIDIsIHBsb3Quc2l6ZSAtIGNvbmYucGFkZGluZyAvIDJdKTtcclxuICAgICAgICB4Lm1hcCA9IGZ1bmN0aW9uIChkLCB2YXJpYWJsZSkge1xyXG4gICAgICAgICAgICByZXR1cm4geC5zY2FsZSh4LnZhbHVlKGQsIHZhcmlhYmxlKSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB4LmF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHguc2NhbGUpLm9yaWVudChjb25mLngub3JpZW50KS50aWNrcyhjb25mLnRpY2tzKTtcclxuICAgICAgICB4LmF4aXMudGlja1NpemUocGxvdC5zaXplICogcGxvdC52YXJpYWJsZXMubGVuZ3RoKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwWSgpIHtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHkgPSBwbG90Lnk7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgeS52YWx1ZSA9IGNvbmYudmFyaWFibGVzLnZhbHVlO1xyXG4gICAgICAgIHkuc2NhbGUgPSBkMy5zY2FsZVtjb25mLnkuc2NhbGVdKCkucmFuZ2UoWyBwbG90LnNpemUgLSBjb25mLnBhZGRpbmcgLyAyLCBjb25mLnBhZGRpbmcgLyAyXSk7XHJcbiAgICAgICAgeS5tYXAgPSBmdW5jdGlvbiAoZCwgdmFyaWFibGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHkuc2NhbGUoeS52YWx1ZShkLCB2YXJpYWJsZSkpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgeS5heGlzPSBkMy5zdmcuYXhpcygpLnNjYWxlKHkuc2NhbGUpLm9yaWVudChjb25mLnkub3JpZW50KS50aWNrcyhjb25mLnRpY2tzKTtcclxuICAgICAgICB5LmF4aXMudGlja1NpemUoLXBsb3Quc2l6ZSAqIHBsb3QudmFyaWFibGVzLmxlbmd0aCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRyYXcoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPXRoaXM7XHJcbiAgICAgICAgdmFyIG4gPSBzZWxmLnBsb3QudmFyaWFibGVzLmxlbmd0aDtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB2YXIgYXhpc0NsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImF4aXNcIik7XHJcbiAgICAgICAgdmFyIGF4aXNYQ2xhc3MgPSBheGlzQ2xhc3MrXCIteFwiO1xyXG4gICAgICAgIHZhciBheGlzWUNsYXNzID0gYXhpc0NsYXNzK1wiLXlcIjtcclxuXHJcbiAgICAgICAgdmFyIHhBeGlzU2VsZWN0b3IgPSBcImcuXCIrYXhpc1hDbGFzcytcIi5cIitheGlzQ2xhc3M7XHJcbiAgICAgICAgdmFyIHlBeGlzU2VsZWN0b3IgPSBcImcuXCIrYXhpc1lDbGFzcytcIi5cIitheGlzQ2xhc3M7XHJcblxyXG4gICAgICAgIHZhciBub0d1aWRlc0NsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcIm5vLWd1aWRlc1wiKTtcclxuICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKHhBeGlzU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5kYXRhKHNlbGYucGxvdC52YXJpYWJsZXMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZFNlbGVjdG9yKHhBeGlzU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKG5vR3VpZGVzQ2xhc3MsICFjb25mLmd1aWRlcylcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAobiAtIGkgLSAxKSAqIHNlbGYucGxvdC5zaXplICsgXCIsMClcIjsgfSlcclxuICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24oZCkgeyBzZWxmLnBsb3QueC5zY2FsZS5kb21haW4oc2VsZi5wbG90LmRvbWFpbkJ5VmFyaWFibGVbZF0pOyBkMy5zZWxlY3QodGhpcykuY2FsbChzZWxmLnBsb3QueC5heGlzKTsgfSk7XHJcblxyXG4gICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoeUF4aXNTZWxlY3RvcilcclxuICAgICAgICAgICAgLmRhdGEoc2VsZi5wbG90LnZhcmlhYmxlcylcclxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kU2VsZWN0b3IoeUF4aXNTZWxlY3RvcilcclxuICAgICAgICAgICAgLmNsYXNzZWQobm9HdWlkZXNDbGFzcywgIWNvbmYuZ3VpZGVzKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBcInRyYW5zbGF0ZSgwLFwiICsgaSAqIHNlbGYucGxvdC5zaXplICsgXCIpXCI7IH0pXHJcbiAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uKGQpIHsgc2VsZi5wbG90Lnkuc2NhbGUuZG9tYWluKHNlbGYucGxvdC5kb21haW5CeVZhcmlhYmxlW2RdKTsgZDMuc2VsZWN0KHRoaXMpLmNhbGwoc2VsZi5wbG90LnkuYXhpcyk7IH0pO1xyXG5cclxuICAgICAgICB2YXIgY2VsbENsYXNzID0gIHNlbGYucHJlZml4Q2xhc3MoXCJjZWxsXCIpO1xyXG4gICAgICAgIHZhciBjZWxsID0gc2VsZi5zdmdHLnNlbGVjdEFsbChcIi5cIitjZWxsQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHNlbGYudXRpbHMuY3Jvc3Moc2VsZi5wbG90LnZhcmlhYmxlcywgc2VsZi5wbG90LnZhcmlhYmxlcykpXHJcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZFNlbGVjdG9yKFwiZy5cIitjZWxsQ2xhc3MpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKG4gLSBkLmkgLSAxKSAqIHNlbGYucGxvdC5zaXplICsgXCIsXCIgKyBkLmogKiBzZWxmLnBsb3Quc2l6ZSArIFwiKVwiOyB9KTtcclxuXHJcbiAgICAgICAgaWYoY29uZi5icnVzaCl7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0JydXNoKGNlbGwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2VsbC5lYWNoKHBsb3RTdWJwbG90KTtcclxuXHJcblxyXG5cclxuICAgICAgICAvL0xhYmVsc1xyXG4gICAgICAgIGNlbGwuZmlsdGVyKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaSA9PT0gZC5qOyB9KS5hcHBlbmQoXCJ0ZXh0XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCBjb25mLnBhZGRpbmcpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCBjb25mLnBhZGRpbmcpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCIuNzFlbVwiKVxyXG4gICAgICAgICAgICAudGV4dChmdW5jdGlvbihkKSB7IHJldHVybiBzZWxmLnBsb3QubGFiZWxCeVZhcmlhYmxlW2QueF07IH0pO1xyXG5cclxuXHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwbG90U3VicGxvdChwKSB7XHJcbiAgICAgICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgICAgICBwbG90LnN1YnBsb3RzLnB1c2gocCk7XHJcbiAgICAgICAgICAgIHZhciBjZWxsID0gZDMuc2VsZWN0KHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgcGxvdC54LnNjYWxlLmRvbWFpbihwbG90LmRvbWFpbkJ5VmFyaWFibGVbcC54XSk7XHJcbiAgICAgICAgICAgIHBsb3QueS5zY2FsZS5kb21haW4ocGxvdC5kb21haW5CeVZhcmlhYmxlW3AueV0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIGZyYW1lQ2xhc3MgPSAgc2VsZi5wcmVmaXhDbGFzcyhcImZyYW1lXCIpO1xyXG4gICAgICAgICAgICBjZWxsLmFwcGVuZChcInJlY3RcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgZnJhbWVDbGFzcylcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieFwiLCBjb25mLnBhZGRpbmcgLyAyKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIGNvbmYucGFkZGluZyAvIDIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGNvbmYuc2l6ZSAtIGNvbmYucGFkZGluZylcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGNvbmYuc2l6ZSAtIGNvbmYucGFkZGluZyk7XHJcblxyXG5cclxuICAgICAgICAgICAgcC51cGRhdGUgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgdmFyIHN1YnBsb3QgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRvdHMgPSBjZWxsLnNlbGVjdEFsbChcImNpcmNsZVwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kYXRhKHNlbGYuZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZG90cy5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBkb3RzLmF0dHIoXCJjeFwiLCBmdW5jdGlvbihkKXtyZXR1cm4gcGxvdC54Lm1hcChkLCBzdWJwbG90LngpfSlcclxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcImN5XCIsIGZ1bmN0aW9uKGQpe3JldHVybiBwbG90LnkubWFwKGQsIHN1YnBsb3QueSl9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiclwiLCBzZWxmLmNvbmZpZy5kb3QucmFkaXVzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocGxvdC5kb3QuY29sb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb3RzLnN0eWxlKFwiZmlsbFwiLCBwbG90LmRvdC5jb2xvcilcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZihwbG90LnRvb2x0aXApe1xyXG4gICAgICAgICAgICAgICAgICAgIGRvdHMub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAuOSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodG1sID0gXCIoXCIgKyBwbG90LngudmFsdWUoZCwgc3VicGxvdC54KSArIFwiLCBcIiArcGxvdC55LnZhbHVlKGQsIHN1YnBsb3QueSkgKyBcIilcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLmh0bWwoaHRtbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBncm91cCA9IHNlbGYuY29uZmlnLmdyb3Vwcy52YWx1ZShkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZ3JvdXAgfHwgZ3JvdXA9PT0wICl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sKz1cIjxici8+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSBzZWxmLmNvbmZpZy5ncm91cHMubGFiZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihsYWJlbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCs9bGFiZWwrXCI6IFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCs9Z3JvdXBcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAuaHRtbChodG1sKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZDMuZXZlbnQucGFnZVggKyA1KSArIFwicHhcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uKGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGRvdHMuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcC51cGRhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIHRoaXMucGxvdC5zdWJwbG90cy5mb3JFYWNoKGZ1bmN0aW9uKHApe3AudXBkYXRlKCl9KTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhd0JydXNoKGNlbGwpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGJydXNoID0gZDMuc3ZnLmJydXNoKClcclxuICAgICAgICAgICAgLngoc2VsZi5wbG90Lnguc2NhbGUpXHJcbiAgICAgICAgICAgIC55KHNlbGYucGxvdC55LnNjYWxlKVxyXG4gICAgICAgICAgICAub24oXCJicnVzaHN0YXJ0XCIsIGJydXNoc3RhcnQpXHJcbiAgICAgICAgICAgIC5vbihcImJydXNoXCIsIGJydXNobW92ZSlcclxuICAgICAgICAgICAgLm9uKFwiYnJ1c2hlbmRcIiwgYnJ1c2hlbmQpO1xyXG5cclxuICAgICAgICBjZWxsLmFwcGVuZChcImdcIikuY2FsbChicnVzaCk7XHJcblxyXG5cclxuICAgICAgICB2YXIgYnJ1c2hDZWxsO1xyXG5cclxuICAgICAgICAvLyBDbGVhciB0aGUgcHJldmlvdXNseS1hY3RpdmUgYnJ1c2gsIGlmIGFueS5cclxuICAgICAgICBmdW5jdGlvbiBicnVzaHN0YXJ0KHApIHtcclxuICAgICAgICAgICAgaWYgKGJydXNoQ2VsbCAhPT0gdGhpcykge1xyXG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KGJydXNoQ2VsbCkuY2FsbChicnVzaC5jbGVhcigpKTtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC54LnNjYWxlLmRvbWFpbihzZWxmLnBsb3QuZG9tYWluQnlWYXJpYWJsZVtwLnhdKTtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC55LnNjYWxlLmRvbWFpbihzZWxmLnBsb3QuZG9tYWluQnlWYXJpYWJsZVtwLnldKTtcclxuICAgICAgICAgICAgICAgIGJydXNoQ2VsbCA9IHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEhpZ2hsaWdodCB0aGUgc2VsZWN0ZWQgY2lyY2xlcy5cclxuICAgICAgICBmdW5jdGlvbiBicnVzaG1vdmUocCkge1xyXG4gICAgICAgICAgICB2YXIgZSA9IGJydXNoLmV4dGVudCgpO1xyXG4gICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwiY2lyY2xlXCIpLmNsYXNzZWQoXCJoaWRkZW5cIiwgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlWzBdWzBdID4gZFtwLnhdIHx8IGRbcC54XSA+IGVbMV1bMF1cclxuICAgICAgICAgICAgICAgICAgICB8fCBlWzBdWzFdID4gZFtwLnldIHx8IGRbcC55XSA+IGVbMV1bMV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBJZiB0aGUgYnJ1c2ggaXMgZW1wdHksIHNlbGVjdCBhbGwgY2lyY2xlcy5cclxuICAgICAgICBmdW5jdGlvbiBicnVzaGVuZCgpIHtcclxuICAgICAgICAgICAgaWYgKGJydXNoLmVtcHR5KCkpIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCIuaGlkZGVuXCIpLmNsYXNzZWQoXCJoaWRkZW5cIiwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0iLCJpbXBvcnQge0NoYXJ0LCBDaGFydENvbmZpZ30gZnJvbSBcIi4vY2hhcnRcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuXHJcbmV4cG9ydCBjbGFzcyBTY2F0dGVyUGxvdENvbmZpZyBleHRlbmRzIENoYXJ0Q29uZmlne1xyXG5cclxuICAgIHN2Z0NsYXNzPSB0aGlzLmNzc0NsYXNzUHJlZml4KydzY2F0dGVycGxvdCc7XHJcbiAgICBndWlkZXM9IGZhbHNlOyAvL3Nob3cgYXhpcyBndWlkZXNcclxuICAgIHRvb2x0aXA9IHRydWU7IC8vc2hvdyB0b29sdGlwIG9uIGRvdCBob3ZlclxyXG4gICAgeD17Ly8gWCBheGlzIGNvbmZpZ1xyXG4gICAgICAgIGxhYmVsOiAnWCcsIC8vIGF4aXMgbGFiZWxcclxuICAgICAgICBrZXk6IDAsXHJcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGQsIGtleSkgeyByZXR1cm4gZFtrZXldIH0sIC8vIHggdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICBvcmllbnQ6IFwiYm90dG9tXCIsXHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCJcclxuICAgIH07XHJcbiAgICB5PXsvLyBZIGF4aXMgY29uZmlnXHJcbiAgICAgICAgbGFiZWw6ICdZJywgLy8gYXhpcyBsYWJlbCxcclxuICAgICAgICBrZXk6IDEsXHJcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGQsIGtleSkgeyByZXR1cm4gZFtrZXldIH0sIC8vIHkgdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICBvcmllbnQ6IFwibGVmdFwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiXHJcbiAgICB9O1xyXG4gICAgZ3JvdXBzPXtcclxuICAgICAgICBrZXk6IDIsXHJcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGQsIGtleSkgeyByZXR1cm4gZFtrZXldIH0sIC8vIGdyb3VwaW5nIHZhbHVlIGFjY2Vzc29yLFxyXG4gICAgICAgIGxhYmVsOiBcIlwiXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB2YXIgY29uZmlnID0gdGhpcztcclxuICAgICAgICB0aGlzLmRvdD17XHJcbiAgICAgICAgICAgIHJhZGl1czogMixcclxuICAgICAgICAgICAgY29sb3I6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGNvbmZpZy5ncm91cHMudmFsdWUoZCwgY29uZmlnLmdyb3Vwcy5rZXkpIH0sIC8vIHN0cmluZyBvciBmdW5jdGlvbiByZXR1cm5pbmcgY29sb3IncyB2YWx1ZSBmb3IgY29sb3Igc2NhbGVcclxuICAgICAgICAgICAgZDNDb2xvckNhdGVnb3J5OiAnY2F0ZWdvcnkxMCdcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZihjdXN0b20pe1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNjYXR0ZXJQbG90IGV4dGVuZHMgQ2hhcnR7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBzdXBlcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBuZXcgU2NhdHRlclBsb3RDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZyl7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgU2NhdHRlclBsb3RDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKXtcclxuICAgICAgICB2YXIgc2VsZj10aGlzO1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSB0aGlzLmNvbmZpZy5tYXJnaW47XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICB0aGlzLnBsb3Q9e1xyXG4gICAgICAgICAgICB4OiB7fSxcclxuICAgICAgICAgICAgeToge30sXHJcbiAgICAgICAgICAgIGRvdDoge1xyXG4gICAgICAgICAgICAgICAgY29sb3I6IG51bGwvL2NvbG9yIHNjYWxlIG1hcHBpbmcgZnVuY3Rpb25cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IGNvbmYud2lkdGg7XHJcbiAgICAgICAgdmFyIHBsYWNlaG9sZGVyTm9kZSA9IHRoaXMuZ2V0QmFzZUNvbnRhaW5lck5vZGUoKTtcclxuXHJcbiAgICAgICAgaWYoIXdpZHRoKXtcclxuICAgICAgICAgICAgd2lkdGggPXBsYWNlaG9sZGVyTm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IGNvbmYuaGVpZ2h0O1xyXG4gICAgICAgIGlmKCFoZWlnaHQpe1xyXG4gICAgICAgICAgICBoZWlnaHQgPXBsYWNlaG9sZGVyTm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnBsb3Qud2lkdGggPSB3aWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0O1xyXG4gICAgICAgIHRoaXMucGxvdC5oZWlnaHQgPSBoZWlnaHQgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cFgoKTtcclxuICAgICAgICB0aGlzLnNldHVwWSgpO1xyXG5cclxuICAgICAgICBpZihjb25mLmRvdC5kM0NvbG9yQ2F0ZWdvcnkpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yQ2F0ZWdvcnkgPSBkMy5zY2FsZVtjb25mLmRvdC5kM0NvbG9yQ2F0ZWdvcnldKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjb2xvclZhbHVlID0gY29uZi5kb3QuY29sb3I7XHJcbiAgICAgICAgaWYoY29sb3JWYWx1ZSl7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5kb3QuY29sb3JWYWx1ZSA9IGNvbG9yVmFsdWU7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbG9yVmFsdWUgPT09ICdzdHJpbmcnIHx8IGNvbG9yVmFsdWUgaW5zdGFuY2VvZiBTdHJpbmcpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmRvdC5jb2xvciA9IGNvbG9yVmFsdWU7XHJcbiAgICAgICAgICAgIH1lbHNlIGlmKHRoaXMucGxvdC5kb3QuY29sb3JDYXRlZ29yeSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yID0gZnVuY3Rpb24oZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYucGxvdC5kb3QuY29sb3JDYXRlZ29yeShzZWxmLnBsb3QuZG90LmNvbG9yVmFsdWUoZCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB9ZWxzZXtcclxuXHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXBYKCl7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB4ID0gcGxvdC54O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWcueDtcclxuXHJcbiAgICAgICAgLyogKlxyXG4gICAgICAgICAqIHZhbHVlIGFjY2Vzc29yIC0gcmV0dXJucyB0aGUgdmFsdWUgdG8gZW5jb2RlIGZvciBhIGdpdmVuIGRhdGEgb2JqZWN0LlxyXG4gICAgICAgICAqIHNjYWxlIC0gbWFwcyB2YWx1ZSB0byBhIHZpc3VhbCBkaXNwbGF5IGVuY29kaW5nLCBzdWNoIGFzIGEgcGl4ZWwgcG9zaXRpb24uXHJcbiAgICAgICAgICogbWFwIGZ1bmN0aW9uIC0gbWFwcyBmcm9tIGRhdGEgdmFsdWUgdG8gZGlzcGxheSB2YWx1ZVxyXG4gICAgICAgICAqIGF4aXMgLSBzZXRzIHVwIGF4aXNcclxuICAgICAgICAgKiovXHJcbiAgICAgICAgeC52YWx1ZSA9IGQgPT4gY29uZi52YWx1ZShkLCBjb25mLmtleSk7XHJcbiAgICAgICAgeC5zY2FsZSA9IGQzLnNjYWxlW2NvbmYuc2NhbGVdKCkucmFuZ2UoWzAsIHBsb3Qud2lkdGhdKTtcclxuICAgICAgICB4Lm1hcCA9IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHguc2NhbGUoeC52YWx1ZShkKSk7fTtcclxuICAgICAgICB4LmF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHguc2NhbGUpLm9yaWVudChjb25mLm9yaWVudCk7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgcGxvdC54LnNjYWxlLmRvbWFpbihbZDMubWluKGRhdGEsIHBsb3QueC52YWx1ZSktMSwgZDMubWF4KGRhdGEsIHBsb3QueC52YWx1ZSkrMV0pO1xyXG4gICAgICAgIGlmKHRoaXMuY29uZmlnLmd1aWRlcykge1xyXG4gICAgICAgICAgICB4LmF4aXMudGlja1NpemUoLXBsb3QuaGVpZ2h0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cFkgKCl7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB5ID0gcGxvdC55O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWcueTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB2YWx1ZSBhY2Nlc3NvciAtIHJldHVybnMgdGhlIHZhbHVlIHRvIGVuY29kZSBmb3IgYSBnaXZlbiBkYXRhIG9iamVjdC5cclxuICAgICAgICAgKiBzY2FsZSAtIG1hcHMgdmFsdWUgdG8gYSB2aXN1YWwgZGlzcGxheSBlbmNvZGluZywgc3VjaCBhcyBhIHBpeGVsIHBvc2l0aW9uLlxyXG4gICAgICAgICAqIG1hcCBmdW5jdGlvbiAtIG1hcHMgZnJvbSBkYXRhIHZhbHVlIHRvIGRpc3BsYXkgdmFsdWVcclxuICAgICAgICAgKiBheGlzIC0gc2V0cyB1cCBheGlzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgeS52YWx1ZSA9IGQgPT4gY29uZi52YWx1ZShkLCBjb25mLmtleSk7XHJcbiAgICAgICAgeS5zY2FsZSA9IGQzLnNjYWxlW2NvbmYuc2NhbGVdKCkucmFuZ2UoW3Bsb3QuaGVpZ2h0LCAwXSk7XHJcbiAgICAgICAgeS5tYXAgPSBmdW5jdGlvbihkKSB7IHJldHVybiB5LnNjYWxlKHkudmFsdWUoZCkpO307XHJcbiAgICAgICAgeS5heGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh5LnNjYWxlKS5vcmllbnQoY29uZi5vcmllbnQpO1xyXG5cclxuICAgICAgICBpZih0aGlzLmNvbmZpZy5ndWlkZXMpe1xyXG4gICAgICAgICAgICB5LmF4aXMudGlja1NpemUoLXBsb3Qud2lkdGgpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIHBsb3QueS5zY2FsZS5kb21haW4oW2QzLm1pbihkYXRhLCBwbG90LnkudmFsdWUpLTEsIGQzLm1heChkYXRhLCBwbG90LnkudmFsdWUpKzFdKTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhdygpe1xyXG4gICAgICAgIHRoaXMuZHJhd0F4aXNYKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3QXhpc1koKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBkcmF3QXhpc1goKXtcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBheGlzQ29uZiA9IHRoaXMuY29uZmlnLng7XHJcbiAgICAgICAgc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIitzZWxmLnByZWZpeENsYXNzKCdheGlzLXgnKStcIi5cIitzZWxmLnByZWZpeENsYXNzKCdheGlzJykrKHNlbGYuY29uZmlnLmd1aWRlcyA/ICcnIDogJy4nK3NlbGYucHJlZml4Q2xhc3MoJ25vLWd1aWRlcycpKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIHBsb3QuaGVpZ2h0ICsgXCIpXCIpXHJcbiAgICAgICAgICAgIC5jYWxsKHBsb3QueC5heGlzKVxyXG4gICAgICAgICAgICAuc2VsZWN0T3JBcHBlbmQoXCJ0ZXh0LlwiK3NlbGYucHJlZml4Q2xhc3MoJ2xhYmVsJykpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyAocGxvdC53aWR0aC8yKSArXCIsXCIrIChzZWxmLmNvbmZpZy5tYXJnaW4uYm90dG9tKSArXCIpXCIpICAvLyB0ZXh0IGlzIGRyYXduIG9mZiB0aGUgc2NyZWVuIHRvcCBsZWZ0LCBtb3ZlIGRvd24gYW5kIG91dCBhbmQgcm90YXRlXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCItMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGF4aXNDb25mLmxhYmVsKTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhd0F4aXNZKCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBheGlzQ29uZiA9IHRoaXMuY29uZmlnLnk7XHJcbiAgICAgICAgc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIitzZWxmLnByZWZpeENsYXNzKCdheGlzLXknKStcIi5cIitzZWxmLnByZWZpeENsYXNzKCdheGlzJykrKHNlbGYuY29uZmlnLmd1aWRlcyA/ICcnIDogJy4nK3NlbGYucHJlZml4Q2xhc3MoJ25vLWd1aWRlcycpKSlcclxuICAgICAgICAgICAgLmNhbGwocGxvdC55LmF4aXMpXHJcbiAgICAgICAgICAgIC5zZWxlY3RPckFwcGVuZChcInRleHQuXCIrc2VsZi5wcmVmaXhDbGFzcygnbGFiZWwnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrIC1zZWxmLmNvbmZpZy5tYXJnaW4ubGVmdCArXCIsXCIrKHBsb3QuaGVpZ2h0LzIpK1wiKXJvdGF0ZSgtOTApXCIpICAvLyB0ZXh0IGlzIGRyYXduIG9mZiB0aGUgc2NyZWVuIHRvcCBsZWZ0LCBtb3ZlIGRvd24gYW5kIG91dCBhbmQgcm90YXRlXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCIxZW1cIilcclxuICAgICAgICAgICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoYXhpc0NvbmYubGFiZWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICB1cGRhdGUobmV3RGF0YSl7XHJcbiAgICAgICAgLy8gRDNDaGFydEJhc2UucHJvdG90eXBlLnVwZGF0ZS5jYWxsKHRoaXMsIG5ld0RhdGEpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgICAgICB2YXIgZG90Q2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKCdkb3QnKTtcclxuICAgICAgICB2YXIgZG90cyA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoJy4nK2RvdENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShkYXRhKTtcclxuXHJcbiAgICAgICAgZG90cy5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGRvdENsYXNzKTtcclxuXHJcblxyXG4gICAgICAgIGRvdHMuYXR0cihcInJcIiwgc2VsZi5jb25maWcuZG90LnJhZGl1cylcclxuICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCBwbG90LngubWFwKVxyXG4gICAgICAgICAgICAuYXR0cihcImN5XCIsIHBsb3QueS5tYXApO1xyXG5cclxuICAgICAgICBpZihwbG90LnRvb2x0aXApe1xyXG4gICAgICAgICAgICBkb3RzLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uKGQpIHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGh0bWwgPSBcIihcIiArIHBsb3QueC52YWx1ZShkKSArIFwiLCBcIiArcGxvdC55LnZhbHVlKGQpICsgXCIpXCI7XHJcbiAgICAgICAgICAgICAgICB2YXIgZ3JvdXAgPSBzZWxmLmNvbmZpZy5ncm91cHMudmFsdWUoZCwgc2VsZi5jb25maWcuZ3JvdXBzLmtleSk7XHJcbiAgICAgICAgICAgICAgICBpZihncm91cCB8fCBncm91cD09PTAgKXtcclxuICAgICAgICAgICAgICAgICAgICBodG1sKz1cIjxici8+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhYmVsID0gc2VsZi5jb25maWcuZ3JvdXBzLmxhYmVsO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGxhYmVsKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCs9bGFiZWwrXCI6IFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBodG1sKz1ncm91cFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLmh0bWwoaHRtbClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYocGxvdC5kb3QuY29sb3Ipe1xyXG4gICAgICAgICAgICBkb3RzLnN0eWxlKFwiZmlsbFwiLCBwbG90LmRvdC5jb2xvcilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRvdHMuZXhpdCgpLnJlbW92ZSgpO1xyXG5cclxuICAgIH07XHJcbn1cclxuIiwidmFyIHN1ID0gbW9kdWxlLmV4cG9ydHMuU3RhdGlzdGljc1V0aWxzID17fTtcclxuc3Uuc2FtcGxlQ29ycmVsYXRpb24gPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy9zYW1wbGVfY29ycmVsYXRpb24nKTsiLCJleHBvcnQgY2xhc3MgVXRpbHMge1xyXG4gICAgLy8gdXNhZ2UgZXhhbXBsZSBkZWVwRXh0ZW5kKHt9LCBvYmpBLCBvYmpCKTsgPT4gc2hvdWxkIHdvcmsgc2ltaWxhciB0byAkLmV4dGVuZCh0cnVlLCB7fSwgb2JqQSwgb2JqQik7XHJcbiAgICBzdGF0aWMgZGVlcEV4dGVuZChvdXQpIHtcclxuXHJcbiAgICAgICAgdmFyIHV0aWxzID0gdGhpcztcclxuICAgICAgICB2YXIgZW1wdHlPdXQgPSB7fTtcclxuXHJcblxyXG4gICAgICAgIGlmICghb3V0ICYmIGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIEFycmF5LmlzQXJyYXkoYXJndW1lbnRzWzFdKSkge1xyXG4gICAgICAgICAgICBvdXQgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb3V0ID0gb3V0IHx8IHt9O1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBpZiAoIXNvdXJjZSlcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5KG91dFtrZXldKTtcclxuICAgICAgICAgICAgICAgIHZhciBpc09iamVjdCA9IHV0aWxzLmlzT2JqZWN0KG91dFtrZXldKTtcclxuICAgICAgICAgICAgICAgIHZhciBzcmNPYmogPSB1dGlscy5pc09iamVjdChzb3VyY2Vba2V5XSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlzT2JqZWN0ICYmICFpc0FycmF5ICYmIHNyY09iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWxzLmRlZXBFeHRlbmQob3V0W2tleV0sIHNvdXJjZVtrZXldKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0W2tleV0gPSBzb3VyY2Vba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIG1lcmdlRGVlcCh0YXJnZXQsIHNvdXJjZSkge1xyXG4gICAgICAgIGxldCBvdXRwdXQgPSBPYmplY3QuYXNzaWduKHt9LCB0YXJnZXQpO1xyXG4gICAgICAgIGlmIChVdGlscy5pc09iamVjdE5vdEFycmF5KHRhcmdldCkgJiYgVXRpbHMuaXNPYmplY3ROb3RBcnJheShzb3VyY2UpKSB7XHJcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKFV0aWxzLmlzT2JqZWN0Tm90QXJyYXkoc291cmNlW2tleV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoa2V5IGluIHRhcmdldCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ob3V0cHV0LCB7IFtrZXldOiBzb3VyY2Vba2V5XSB9KTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFtrZXldID0gVXRpbHMubWVyZ2VEZWVwKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ob3V0cHV0LCB7IFtrZXldOiBzb3VyY2Vba2V5XSB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNyb3NzKGEsIGIpIHtcclxuICAgICAgICB2YXIgYyA9IFtdLCBuID0gYS5sZW5ndGgsIG0gPSBiLmxlbmd0aCwgaSwgajtcclxuICAgICAgICBmb3IgKGkgPSAtMTsgKytpIDwgbjspIGZvciAoaiA9IC0xOyArK2ogPCBtOykgYy5wdXNoKHt4OiBhW2ldLCBpOiBpLCB5OiBiW2pdLCBqOiBqfSk7XHJcbiAgICAgICAgcmV0dXJuIGM7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBpbmZlclZhcmlhYmxlcyhkYXRhLCBncm91cEtleSwgaW5jbHVkZUdyb3VwKSB7XHJcbiAgICAgICAgdmFyIHJlcyA9IFtdO1xyXG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB2YXIgZCA9IGRhdGFbMF07XHJcbiAgICAgICAgICAgIGlmIChkIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIHJlcz0gIGQubWFwKGZ1bmN0aW9uICh2LCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfWVsc2UgaWYgKHR5cGVvZiBkID09PSAnb2JqZWN0Jyl7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIWQuaGFzT3duUHJvcGVydHkocHJvcCkpIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXMucHVzaChwcm9wKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZighaW5jbHVkZUdyb3VwKXtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gcmVzLmluZGV4T2YoZ3JvdXBLZXkpO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgcmVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc1xyXG4gICAgfTtcclxuICAgIHN0YXRpYyBpc09iamVjdE5vdEFycmF5KGl0ZW0pIHtcclxuICAgICAgICByZXR1cm4gKGl0ZW0gJiYgdHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KGl0ZW0pICYmIGl0ZW0gIT09IG51bGwpO1xyXG4gICAgfTtcclxuICAgIHN0YXRpYyBpc09iamVjdChhKSB7XHJcbiAgICAgICAgcmV0dXJuIGEgIT09IG51bGwgJiYgdHlwZW9mIGEgPT09ICdvYmplY3QnO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgaXNOdW1iZXIoYSkge1xyXG4gICAgICAgIHJldHVybiAhaXNOYU4oYSkgJiYgdHlwZW9mIGEgPT09ICdudW1iZXInO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgaXNGdW5jdGlvbihhKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBhID09PSAnZnVuY3Rpb24nO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgYXBwZW5kU2VsZWN0b3IocGFyZW50LCBzZWxlY3Rvcikge1xyXG4gICAgICAgIHZhciBzZWxlY3RvclBhcnRzID0gc2VsZWN0b3Iuc3BsaXQoLyhbXFwuXFwjXSkvKTtcclxuICAgICAgICB2YXIgZWxlbWVudCA9IHBhcmVudC5hcHBlbmQoc2VsZWN0b3JQYXJ0cy5zaGlmdCgpKTtcclxuICAgICAgICB3aGlsZSAoc2VsZWN0b3JQYXJ0cy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxlY3Rvck1vZGlmaWVyID0gc2VsZWN0b3JQYXJ0cy5zaGlmdCgpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZWN0b3JJdGVtID0gc2VsZWN0b3JQYXJ0cy5zaGlmdCgpO1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0b3JNb2RpZmllciA9PT0gXCIuXCIpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LmNsYXNzZWQoc2VsZWN0b3JJdGVtLCB0cnVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxlY3Rvck1vZGlmaWVyID09PSBcIiNcIikge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQuYXR0cignaWQnLCBzZWxlY3Rvckl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzZWxlY3RPckFwcGVuZChwYXJlbnQsIHNlbGVjdG9yLCBlbGVtZW50KSB7XHJcbiAgICAgICAgdmFyIHNlbGVjdGlvbiA9IHBhcmVudC5zZWxlY3Qoc2VsZWN0b3IpO1xyXG4gICAgICAgIGlmKHNlbGVjdGlvbi5lbXB0eSgpKXtcclxuICAgICAgICAgICAgaWYoZWxlbWVudCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50LmFwcGVuZChlbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gVXRpbHMuYXBwZW5kU2VsZWN0b3IocGFyZW50LCBzZWxlY3Rvcik7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2VsZWN0aW9uO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgbGluZWFyR3JhZGllbnQoc3ZnLCBncmFkaWVudElkLCByYW5nZSwgeDEsIHkxLCB4MiwgeTIpe1xyXG4gICAgICAgIHZhciBkZWZzID0gVXRpbHMuc2VsZWN0T3JBcHBlbmQoc3ZnLCBcImRlZnNcIik7XHJcbiAgICAgICAgdmFyIGxpbmVhckdyYWRpZW50ID0gZGVmcy5hcHBlbmQoXCJsaW5lYXJHcmFkaWVudFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIGdyYWRpZW50SWQpO1xyXG5cclxuICAgICAgICBsaW5lYXJHcmFkaWVudFxyXG4gICAgICAgICAgICAuYXR0cihcIngxXCIsIHgxK1wiJVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInkxXCIsIHkxK1wiJVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcIngyXCIsIHgyK1wiJVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInkyXCIsIHkyK1wiJVwiKTtcclxuXHJcbiAgICAgICAgLy9BcHBlbmQgbXVsdGlwbGUgY29sb3Igc3RvcHMgYnkgdXNpbmcgRDMncyBkYXRhL2VudGVyIHN0ZXBcclxuICAgICAgICB2YXIgc3RvcHMgPSBsaW5lYXJHcmFkaWVudC5zZWxlY3RBbGwoXCJzdG9wXCIpXHJcbiAgICAgICAgICAgIC5kYXRhKCByYW5nZSApO1xyXG5cclxuICAgICAgICBzdG9wcy5lbnRlcigpLmFwcGVuZChcInN0b3BcIik7XHJcblxyXG4gICAgICAgIHN0b3BzLmF0dHIoXCJvZmZzZXRcIiwgKGQsaSkgPT4gaS8ocmFuZ2UubGVuZ3RoLTEpIClcclxuICAgICAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIGQgPT4gZCApO1xyXG5cclxuICAgICAgICBzdG9wcy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcbn1cclxuIl19
