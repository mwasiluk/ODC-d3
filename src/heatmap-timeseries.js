import {Chart, ChartConfig} from "./chart";
import {Heatmap, HeatmapConfig} from "./heatmap";
import {Utils} from './utils'
import {StatisticsUtils} from './statistics-utils'


export class HeatmapTimeSeriesConfig extends HeatmapConfig {
    x = {
        fillMissing: false // fiill missing values with nearest previous value
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
        super.setupValuesBeforeGroupsSort();
        if (!this.config.x.fillMissing) {
            return;
        }
        var self = this;

        this.plot.x.uniqueValues.sort(this.config.x.sortComparator);

        var prev = null;

        this.plot.x.uniqueValues.forEach((x, i)=> {
            var current = this.getTimeValue(x);
            if (prev === null) {
                prev = current;
                return;
            }

            var next = self.nextTimeTickValue(prev);
            var missing = [];
            var iteration = 0;
            while (!self.timeValuesEqual(current, next)) {
                iteration++;
                if (iteration > 100) {
                    break;
                }
                var d = {};
                d[this.config.x.key] = next;

                self.updateGroups(d, next, self.plot.x.groups, self.config.x.groups);
                missing.push(next);
                next = self.nextTimeTickValue(next);
            }
            prev = current;
        });

    }

    getTimeValue(x) {
        return Number(x);
    }

    timeValuesEqual(a, b) {
        return a == b;
    }

    nextTimeTickValue(t) {
        return t + 1;
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


}

