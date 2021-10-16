import {BoxPlotBase, BoxPlotBaseConfig} from "./box-plot-base";
import {Utils} from './utils'
import {StatisticsUtils} from './statistics-utils'
import * as d3 from './d3'

export class BoxPlotConfig extends BoxPlotBaseConfig {

    svgClass = this.cssClassPrefix + 'box-plot';
    showLegend = true;
    showTooltip = true;
    y = {// Y axis config
        key: undefined,
        value: function (d) {
            return this.y.key === undefined ? d : d[this.y.key]
        }, // y value accessor
        scale: "linear",
        orient: 'left',
        domainMargin: 0.1,
        guides: true //show axis guides
    };
    series = false;
    groups = {
        key: undefined,
        value: function (d) {
            return this.groups.key === undefined ? '' : d[this.groups.key]
        }, // grouping value accessor,
        label: "",
        displayValue: undefined // optional function returning display value (series label) for given group value, or object/array mapping value to display value
    };
    tukey = false;

    constructor(custom) {
        super();
        if (custom) {
            Utils.deepExtend(this, custom);
        }
    }
}

export class BoxPlot extends BoxPlotBase {
    constructor(placeholderSelector, data, config) {
        super(placeholderSelector, data, new BoxPlotConfig(config));
    }

    setConfig(config) {
        return super.setConfig(new BoxPlotConfig(config));
    }

    getDataToPlot() {
        var self = this;
        var conf = self.config;
        self.plot.groupingEnabled = this.isGroupingEnabled();

        var data = this.data;
        if (!self.plot.groupingEnabled) {
            self.plot.groupedData = [{
                key: '',
                values: data
            }];
            self.plot.dataLength = data.length;
        } else {
            if (self.config.series) {
                self.plot.groupedData = data.map(s => {
                    return {
                        key: s.label || s.key || '',
                        values: s.values
                    }
                });
            } else {
                self.plot.groupValue = d => conf.groups.value.call(conf, d);
                self.plot.groupedData = Utils.nest(data, this.plot.groupValue)

                var getDisplayValue = k => k;
                if (self.config.groups.displayValue) {
                    if (Utils.isFunction(self.config.groups.displayValue)) {
                        getDisplayValue = k => self.config.groups.displayValue(k) || k;
                    } else if (Utils.isObject(self.config.groups.displayValue)) {
                        getDisplayValue = k => self.config.groups.displayValue[k] || k;
                    }
                }
                self.plot.groupedData.forEach(g => {
                    g.key = getDisplayValue(g.key);
                });
            }

            self.plot.dataLength = d3.sum(this.plot.groupedData, s => s.values.length);
        }


        self.plot.groupedData.forEach(s => {
            if (!Array.isArray(s.values)) {
                return;
            }

            var values = s.values.map(d => parseFloat(self.config.y.value.call(self.config, d)));
            s.values.Q1 = StatisticsUtils.quantile(values, 0.25);
            s.values.Q2 = StatisticsUtils.quantile(values, 0.5);
            s.values.Q3 = StatisticsUtils.quantile(values, 0.75);
            var IQR = s.values.Q3 - s.values.Q1;

            if (!self.config.tukey) {
                s.values.whiskerLow = d3.min(values);
                s.values.whiskerHigh = d3.max(values);
            } else {
                s.values.whiskerLow = s.values.Q1 - 1.5 * IQR;
                s.values.whiskerHigh = s.values.Q3 + 1.5 * IQR;
                s.values.outliers = values.filter(d => d < s.values.whiskerLow || d > s.values.whiskerHigh);
            }
        });

        return self.plot.groupedData;
    }

    isGroupingEnabled() {
        return this.config.series || !!(this.config.groups && this.config.groups.value);
    }
}
