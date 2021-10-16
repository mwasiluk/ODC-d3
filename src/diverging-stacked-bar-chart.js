import {Chart, ChartConfig} from "./chart";
import {Utils} from './utils'
import {Legend} from "./legend";
import * as d3 from './d3'

export class DivergingStackedBarChartConfig extends ChartConfig {

    svgClass = this.cssClassPrefix + 'diverging-stacked-bar-chart';
    showTooltip = true;
    showLegend = true;
    forceLegend = false;
    legend = {
        width: 80,
        margin: 10,
        shapeWidth: 20
    };
    x = {// X axis config
        title: '', // axis label
        value: d => d.values, // x value accessor
        guides: true, //show axis guides
        orient: 'top',
        scale: "linear",
        domainMargin: 0.02,
    };
    y = {// Y axis config
        title: '',
        value: d => d.key, // y value accessor
        scale: "ordinal",
        orient: 'left',
        guides: true //show axis guides
    };

    transition = true;
    color = undefined;// string or function returning color's value for color scale
    d3ColorCategory = 'category10';
    showBarValues = true;


    colorRange = undefined;

    categoryNames = undefined;
    middleValue = 0;

    constructor(custom) {
        super();
        if (custom) {
            Utils.deepExtend(this, custom);
        }
    }
}

export class DivergingStackedBarChart extends Chart {
    constructor(placeholderSelector, data, config) {
        super(placeholderSelector, data, new DivergingStackedBarChartConfig(config));
    }

    setConfig(config) {
        return super.setConfig(new DivergingStackedBarChartConfig(config));
    }

    initPlot() {
        super.initPlot();
        this.plot.showLegend = this.config.showLegend;
        if (this.plot.showLegend) {
            this.plot.margin.right = this.config.margin.right + this.config.legend.width + this.config.legend.margin * 2;

        }
        super.computePlotSize();
        this.plot.x = {};
        this.plot.y = {};

        this.plot.data = this.getDataToPlot();

        this.setupY();
        this.setupX();

        this.setupColor();

    }

    getDataToPlot() {
        return this.data;
    }

    setupX() {

        var plot = this.plot;
        var x = plot.x;
        var conf = this.config.x;

        x.value = d => conf.value.call(this.config, d);
        x.scale = Utils.createScale(conf.scale).rangeRound([0, plot.width]);
        x.map = d => x.scale(x.value(d));

        x.axis = Utils.createAxis(conf.orient, x.scale);
        if (conf.guides) {
            x.axis.tickSize(-plot.height);
        }

        var data = this.plot.data;


        plot.categoryNames = this.config.categoryNames;

        plot.neutralIndex = Math.floor(plot.categoryNames.length / 2);

        plot.rows = data.map(d => {
            let originalValues = x.value(d);
            let x0 = this.config.middleValue - d3.sum(originalValues.map((v, i) => i < plot.neutralIndex ? v : 0));
            if (plot.categoryNames.length & 1)
                x0 += -1 * originalValues[plot.neutralIndex] / 2;

            let values = originalValues.map((v, i) => i < plot.neutralIndex ? this.config.middleValue - v : this.config.middleValue + v);
            let total = d3.sum(originalValues);
            let categories = plot.categoryNames;
            if (d.categories) {
                categories = d.categories.map((catIndex, i) => plot.categoryNames[catIndex])
            }

            return {
                datum: d,
                originalValues: originalValues,
                values: values,
                categories: [],
                min: x0,
                max: x0 + total,
                total: total,
                boxes: values.map((v, i) => {
                    return {
                        name: categories[i],
                        x0: x0,
                        x1: x0 += originalValues[i],
                        originalValue: originalValues[i]
                    }
                })
            }
        });

        var domain;
        if (!data || !data.length) {
            domain = [];
        } else {
            domain = d3.extent([].concat(...plot.rows.map(b => [b.min, b.max])));
            let margin = ((domain[1] - domain[0]) * conf.domainMargin) || conf.domainMargin * domain[0];

            domain[0] -= margin;
            domain[1] += margin;
        }

        plot.x.scale.domain(domain);

    };


    setupY() {

        var plot = this.plot;
        var y = plot.y;
        var conf = this.config.y;
        y.value = d => conf.value.call(this.config, d);
        y.scale = d3.scaleBand().range([0, plot.height]).padding(.3);
        y.map = d => y.scale(y.value(d));

        y.axis = Utils.createAxis(conf.orient, y.scale);
        if (conf.ticks) {
            y.axis.ticks(conf.ticks);
        }
        if (conf.guides) {
            y.axis.tickSize(-plot.width);
        }
        this.setupYDomain();
    };

    setupYDomain() {
        var plot = this.plot;
        var data = this.plot.data;
        var c = this.config;

        var domain = data.map(plot.y.value);

        plot.y.scale.domain(domain);
    }

    drawAxisX() {
        var self = this;
        var plot = self.plot;
        var axisConf = this.config.x;
        var axis = self.svgG.selectOrAppend("g." + self.prefixClass('axis-x') + "." + self.prefixClass('axis') + (axisConf.guides ? '' : '.' + self.prefixClass('no-guides')))

        if (axisConf.orient === 'bottom') {
            axis.attr("transform", "translate(0," + plot.height + ")");
        }


        var axisT = axis;
        if (self.config.transition) {
            axisT = axis.transition().ease(d3.easeSinInOut);
        }

        axisT.call(plot.x.axis);

        var titleY = axisConf.orient === 'bottom' ? plot.margin.bottom : 0;
        var titleDY = axisConf.orient === 'bottom' ? "-1em" : "-1.5em";

        axis.selectOrAppend("text." + self.prefixClass('label'))
            .attr("transform", "translate(" + (plot.width / 2) + "," + (titleY) + ")")  // text is drawn off the screen top left, move down and out and rotate
            .attr("dy", titleDY)
            .style("text-anchor", "middle")
            .text(axisConf.title);
    };

    drawAxisY() {
        var self = this;
        var plot = self.plot;
        var axisConf = this.config.y;
        var axis = self.svgG.selectOrAppend("g." + self.prefixClass('axis-y') + "." + self.prefixClass('axis') + (axisConf.guides ? '' : '.' + self.prefixClass('no-guides')));


        var axisT = axis;
        if (self.config.transition) {
            axisT = axis.transition().ease(d3.easeSinInOut);
        }

        axisT.call(plot.y.axis);

        axis.selectOrAppend("text." + self.prefixClass('label'))
            .attr("transform", "translate(" + -plot.margin.left + "," + (plot.height / 2) + ")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(axisConf.title);
    };

    drawBars() {
        let self = this,
            plot = self.plot,
            config = self.config;

        let rowClass = self.prefixClass("row");
        let rows = self.svgG.selectAll("." + rowClass)
            .data(plot.rows);

        let rowEnter = rows.enter().appendSelector("g." + rowClass);

        let rowMerge = rowEnter.merge(rows)
            .attr("transform", d => "translate(0," + plot.y.map(d.datum) + ")");

        rows.exit().remove();


        let barClass = self.prefixClass("bar");

        let bars = rowMerge.selectAll("g." + barClass)
            .data(function (d) {
                return d.boxes;
            });
        bars.exit().remove();

        let barsEnter = bars.enter()
            .append("g")
            .attr("class", barClass);

        barsEnter.append("rect");
        if (config.showBarValues) {
            barsEnter.append("text");
        }


        let barsM = barsEnter.merge(bars);

        barsM.select("rect").attr("height", plot.y.scale.bandwidth())
            .attr("x", d => plot.x.scale(d.x0))
            .attr("width", d => plot.x.scale(d.x1) - plot.x.scale(d.x0))
            .style("fill", (d, i) => plot.color(d.name, i));


        let textM = barsM.select("text");
        if (config.showBarValues) {
            textM.attr("x", d => plot.x.scale(d.x0))
                .attr("y", plot.y.scale.bandwidth() / 2)
                .attr("dy", "0.5em")
                .attr("dx", d => (plot.x.scale(d.x1) - plot.x.scale(d.x0)) / 2)
                .style("text-anchor", "middle")
                .text(d => d.originalValue !== 0 && (d.x1 - d.x0) > 0.04 ? d.originalValue : "");
        } else {
            textM.remove();
        }


        self.svgG.selectOrAppend("line." + self.prefixClass("middle-line"))
            .attr("x1", plot.x.scale(self.config.middleValue))
            .attr("y1", 0)
            .attr("x2", plot.x.scale(self.config.middleValue))
            .attr("y2", plot.height);

    }

    update(newData) {
        super.update(newData);
        this.drawAxisX();
        this.drawAxisY();
        this.drawBars();
        this.updateLegend();
        return this;
    };


    setupColor() {
        var self = this;
        var conf = this.config;

        if (conf.d3ColorCategory) {
            var colorSchemeCategory = 'scheme' + Utils.capitalizeFirstLetter(conf.d3ColorCategory);
            this.plot.colorCategory = d3.scaleOrdinal(d3[colorSchemeCategory]);
        }

        var colorValue = conf.color;
        if (colorValue && typeof colorValue === 'string' || colorValue instanceof String) {
            this.plot.color = colorValue;
        } else if (conf.colorRange) {
            this.plot.color = Utils.createScale("ordinal").domain(this.plot.categoryNames).range(conf.colorRange);
        } else if (this.plot.colorCategory) {
            self.plot.colorValue = colorValue;
            this.plot.color = this.plot.colorCategory
        }
    }

    updateLegend() {

        var self = this;
        var plot = this.plot;

        var scale = plot.color;

        if (!scale.domain() || !this.config.forceLegend && scale.domain().length < 2) {
            plot.showLegend = false;
        }

        if (!plot.showLegend) {
            if (plot.legend && plot.legend.container) {
                plot.legend.container.remove();
            }
            return;
        }


        var legendX = this.plot.width + this.config.legend.margin;
        var legendY = this.config.legend.margin;

        plot.legend = new Legend(this.svg, this.svgG, scale, legendX, legendY);

        plot.legendColor = plot.legend.color()
            .shapeWidth(this.config.legend.shapeWidth)
            .orient('vertical')
            .scale(scale)
            .labelWrap(this.config.legend.width)
        // .labels(scale.domain().map(v=>plot.groupToLabel[v]));

        plot.legend.container
            .call(plot.legendColor);
    }
}
