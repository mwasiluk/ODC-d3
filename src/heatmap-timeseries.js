import {Heatmap, HeatmapConfig} from "./heatmap";
import {Utils} from './utils'
import * as d3 from './d3'

export class HeatmapTimeSeriesConfig extends HeatmapConfig {
    x = {
        fillMissing: false, // fill missing values using interval and intervalStep
        interval: undefined, //used in filling missing ticks
        intervalStep: 1,
        format: undefined, //input data d3 time format
        displayFormat: undefined,//d3 time format for display
        intervalToFormats: [ //used to guess interval and format
            {
                name: 'year',
                formats: ["%Y"]
            },
            {
                name: 'month',
                formats: ["%Y-%m"]
            },
            {
                name: 'day',
                formats: ["%Y-%m-%d"]
            },
            {
                name: 'hour',
                formats: ['%H', '%Y-%m-%d %H']
            },
            {
                name: 'minute',
                formats: ['%H:%M', '%Y-%m-%d %H:%M']
            },
            {
                name: 'second',
                formats: ['%H:%M:%S', '%Y-%m-%d %H:%M:%S']
            }
        ],

        sortComparator: function sortComparator(a, b) {
            return Utils.isString(a) ? a.localeCompare(b) : a - b;
        },
        formatter: undefined
    };
    z = {
        fillMissing: true // fiill missing values with nearest previous value
    };

    legend = {
        formatter: function (v) {
            var suffix = "";
            if (v / 1000000 >= 1) {
                suffix = " M";
                v = Number(v / 1000000).toFixed(3);
            }
            var nf = Intl.NumberFormat();
            return nf.format(v) + suffix;
        }
    };

    constructor(custom) {
        super();

        if (custom) {
            Utils.deepExtend(this, custom);
        }
    }
}

export class HeatmapTimeSeries extends Heatmap {
    constructor(placeholderSelector, data, config) {
        super(placeholderSelector, data, new HeatmapTimeSeriesConfig(config));
    }

    setConfig(config) {
        return super.setConfig(new HeatmapTimeSeriesConfig(config));
    }


    setupValuesBeforeGroupsSort() {

        this.plot.x.timeFormat = this.config.x.format;
        if (this.config.x.displayFormat && !this.plot.x.timeFormat) {
            this.guessTimeFormat();
        }


        super.setupValuesBeforeGroupsSort();
        if (!this.config.x.fillMissing) {
            return;
        }

        var self = this;

        this.initTimeFormatAndInterval();

        this.plot.x.intervalStep = this.config.x.intervalStep || 1;

        this.plot.x.timeParser = this.getTimeParser();


        this.plot.x.uniqueValues.sort(this.config.x.sortComparator);

        var prev = null;

        this.plot.x.uniqueValues.forEach((x, i) => {
            var current = this.parseTime(x);
            if (prev === null) {
                prev = current;
                return;
            }

            var next = self.nextTimeTickValue(prev);
            var missing = [];
            var iteration = 0;
            while (self.compareTimeValues(next, current) <= 0) {
                iteration++;
                if (iteration > 100) {
                    break;
                }
                var d = {};
                var timeString = self.formatTime(next);
                d[this.config.x.key] = timeString;

                self.updateGroups(d, timeString, self.plot.x.groups, self.config.x.groups);
                missing.push(next);
                next = self.nextTimeTickValue(next);
            }
            prev = current;
        });

    }

    parseTime(x) {
        var parser = this.getTimeParser();
        return parser(x);
    }

    formatTime(date) {
        var formatter = this.getTimeFormatter();
        return formatter(date);
    }

    formatValueX(value) { //used only for display
        if (this.config.x.formatter) return this.config.x.formatter.call(this.config, value);

        if (this.config.x.displayFormat) {
            var date = this.parseTime(value);
            return d3.timeFormat(this.config.x.displayFormat)(date);
        }

        if (!this.plot.x.timeFormat) return value;

        if (Utils.isDate(value)) {
            return this.formatTime(value);
        }

        return value;
    }

    compareTimeValues(a, b) {
        return a - b;
    }

    timeValuesEqual(a, b) {
        var parser = this.plot.x.timeParser;
        return parser(a) === parser(b);
    }

    nextTimeTickValue(t) {
        var interval = 'time' + Utils.capitalizeFirstLetter(this.plot.x.interval);

        return d3[interval].offset(t, this.plot.x.intervalStep);
    }

    initPlot() {
        super.initPlot();

        if (this.config.z.fillMissing) {
            this.plot.matrix.forEach((row, rowIndex) => {
                var prevRowValue = undefined;
                row.forEach((cell, colIndex) => {
                    if (cell.value === undefined && prevRowValue !== undefined) {
                        cell.value = prevRowValue;
                        cell.missing = true;
                    }
                    prevRowValue = cell.value;
                });
            });
        }


    }

    update(newData) {
        super.update(newData);

    };


    initTimeFormatAndInterval() {

        this.plot.x.interval = this.config.x.interval;

        if (!this.plot.x.timeFormat) {
            this.guessTimeFormat();
        }

        if (!this.plot.x.interval && this.plot.x.timeFormat) {
            this.guessInterval();
        }
    }

    guessTimeFormat() {
        var self = this;
        for (let i = 0; i < self.config.x.intervalToFormats.length; i++) {
            let intervalFormat = self.config.x.intervalToFormats[i];
            var format = null;
            var formatMatch = intervalFormat.formats.some(f => {
                format = f;
                var parser = d3.timeParse(f);
                return self.plot.x.uniqueValues.every(x => {
                    return parser(x) !== null
                });
            });
            if (formatMatch) {
                self.plot.x.timeFormat = format;
                // console.log('Guessed timeFormat', format);
                if (!self.plot.x.interval) {
                    self.plot.x.interval = intervalFormat.name;
                    // console.log('Guessed interval', self.plot.x.interval);
                }
                return;
            }
        }
    }

    guessInterval() {
        var self = this;
        for (let i = 0; i < self.config.x.intervalToFormats.length; i++) {
            let intervalFormat = self.config.x.intervalToFormats[i];

            if (intervalFormat.formats.indexOf(self.plot.x.timeFormat) >= 0) {
                self.plot.x.interval = intervalFormat.name;
                // console.log('Guessed interval', self.plot.x.interval);
                return;
            }

        }

    }

    getTimeFormatter() {
        if (!this.plot.x.timeFormatter) {
            this.plot.x.timeFormatter = d3.timeFormat(this.plot.x.timeFormat);
        }
        return this.plot.x.timeFormatter;
    }

    getTimeParser() {
        if (!this.plot.x.timeParser) {
            this.plot.x.timeParser = d3.timeParse(this.plot.x.timeFormat);
        }
        return this.plot.x.timeParser;
    }
}

