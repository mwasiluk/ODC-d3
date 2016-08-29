import {Chart, ChartConfig} from "./chart";
import {Heatmap, HeatmapConfig} from "./heatmap";
import {Utils} from './utils'
import {StatisticsUtils} from './statistics-utils'


export class HeatmapTimeSeriesConfig extends HeatmapConfig {
    x = {
        fillMissing: false, // fiill missing values with nearest previous value
        interval: undefined, //used in filling missing ticks
        intervalStep: 1,
        format: undefined, //custom d3 time format
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
            return Utils.isString(a) ?  a.localeCompare(b) :  a - b;
        }
    };
    z = {
        fillMissing: true // fiill missing values with nearest previous value
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


        this.initTimeFormatAndInterval();

        this.plot.x.intervalStep = this.config.x.intervalStep || 1;

        this.plot.x.timeParser = d3.time.format(this.plot.x.timeFormat);

        super.setupValuesBeforeGroupsSort();
        if (!this.config.x.fillMissing) {
            return;
        }
        var self = this;

        this.plot.x.uniqueValues.sort(this.config.x.sortComparator);

        var prev = null;

        this.plot.x.uniqueValues.forEach((x, i)=> {
            var current = this.parseTime(x);
            if (prev === null) {
                prev = current;
                return;
            }

            var next = self.nextTimeTickValue(prev);
            var missing = [];
            var iteration = 0;
            while (self.compareTimeValues(next, current)<=0) {
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
        var parser = this.plot.x.timeParser;
        return parser.parse(x);
    }

    formatTime(date){
        var parser = this.plot.x.timeParser;
        return parser(date);
    }

    compareTimeValues(a, b){
        return a-b;
    }

    timeValuesEqual(a, b) {
        var parser = this.plot.x.timeParser;
        return parser(a) === parser(b);
    }

    nextTimeTickValue(t) {
        var interval = this.plot.x.interval;
        return d3.time[interval].offset(t, this.plot.x.intervalStep);
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
        this.plot.x.timeFormat = this.config.x.format;
        this.plot.x.interval = this.config.x.interval;

        if(!this.plot.x.timeFormat){
            this.guessTimeFormat();
        }

        if(!this.plot.x.interval && this.plot.x.timeFormat){
            this.guessInterval();
        }
    }

    guessTimeFormat() {
        var self = this;
        for(let i=0; i < self.config.x.intervalToFormats.length; i++){
            let intervalFormat = self.config.x.intervalToFormats[i];
            var format = null;
            var formatMatch = intervalFormat.formats.some(f=>{
                format = f;
                var parser = d3.time.format(f);
                return self.plot.x.uniqueValues.every(x=>{
                    return parser.parse(x) !== null
                });
            });
            if(formatMatch){
                self.plot.x.timeFormat = format;
                console.log('Guessed timeFormat', format);
                if(!self.plot.x.interval){
                    self.plot.x.interval = intervalFormat.name;
                    console.log('Guessed interval', self.plot.x.interval);
                }
                return;
            }
        }
    }

    guessInterval() {
        var self = this;
        for(let i=0; i < self.config.x.intervalToFormats.length; i++) {
            let intervalFormat = self.config.x.intervalToFormats[i];

            if(intervalFormat.formats.indexOf(self.plot.x.timeFormat) >= 0){
                self.plot.x.interval = intervalFormat.name;
                console.log('Guessed interval', self.plot.x.interval);
                return;
            }

        }

    }
}

