import {ChartWithColorGroups, ChartWithColorGroupsConfig} from "./chart-with-color-groups";
import {Utils} from './utils'
import {Legend} from "./legend";

export class BarChartConfig extends ChartWithColorGroupsConfig {

    svgClass = this.cssClassPrefix + 'bar-chart';
    showLegend = true;
    showTooltip = true;
    x = {// X axis config
        title: '', // axis label
        key: 0,
        value: (d, key) => Utils.isNumber(d) ? d : d[key], // x value accessor
        scale: "ordinal",
        orient: "bottom",
        ticks: undefined,
    };
    y = {// Y axis config
        key: 1,
        value: (d, key) => Utils.isNumber(d) ? d : d[key], // x value accessor
        title: '', // axis label,
        orient: "left",
        scale: "linear"
    };
    transition = true;

    constructor(custom) {
        super();
        var config = this;

        if (custom) {
            Utils.deepExtend(this, custom);
        }

    }
}

export class BarChart extends ChartWithColorGroups {
    constructor(placeholderSelector, data, config) {
        super(placeholderSelector, data, new BarChartConfig(config));
    }

    setConfig(config) {
        return super.setConfig(new BarChartConfig(config));
    }

    initPlot() {
        super.initPlot();
        var self = this;

        var conf = this.config;

        this.plot.x = {};
        this.plot.y = {};

        this.computePlotSize();
        this.setupY();
        this.setupX();
        this.setupGroupStacks();
        this.setupYDomain();

        return this;
    }


    setupX() {

        var plot = this.plot;
        var x = plot.x;
        var conf = this.config.x;

        /* *
         * value accessor - returns the value to encode for a given data object.
         * scale - maps value to a visual display encoding, such as a pixel position.
         * map function - maps from data value to display value
         * axis - sets up axis
         **/
        x.value = d => conf.value(d, conf.key);
        x.scale = d3.scaleBand().range([0, plot.width]).paddingInner(.08);
        x.map = d => x.scale(x.value(d));

        x.axis = Utils.createAxis(conf.orient, x.scale);
        if (conf.ticks) {
            x.axis.ticks(conf.ticks);
        }
        var data = this.plot.data;
        var domain;
        if (!data || !data.length) {
            domain = [];
        } else if (!this.config.series) {
            domain = d3.map(data, x.value).keys();
        } else {
            domain = d3.map(data[0].values, x.value).keys();
        }

        plot.x.scale.domain(domain);

    };

    setupY() {

        var plot = this.plot;
        var y = plot.y;
        var conf = this.config.y;
        y.value = d => conf.value(d, conf.key);
        y.scale = Utils.createScale(conf.scale).range([plot.height, 0]);
        y.map = d => y.scale(y.value(d));

        y.axis = Utils.createAxis(conf.orient, y.scale);

    };

    setupYDomain() {
        var plot = this.plot;
        var data = this.plot.data;
        var domain;
        var yStackMax = d3.max(plot.layers, layer => d3.max(layer.points, d => d.y0 + d.y));


        // var min = d3.min(data, s=>d3.min(s.values, plot.y.value));
        var max = yStackMax;
        domain = [0, max];

        plot.y.scale.domain(domain);
        console.log(' plot.y.scale.domain', plot.y.scale.domain());
    }

    setupGroupStacks() {
        var self = this;
        this.groupData();

        var y0s = [];
        this.plot.groupedData.forEach(s=> {
            s.points = s.values.map(v=>self.mapToPoint(v));
            s.points.forEach((p, i)=> {
                var prevY0 = y0s[i];
                if(!prevY0) prevY0 = 0;
                p.y0 = prevY0;
                y0s[i] = p.y+prevY0;
            });

        });
        this.plot.layers = this.plot.groupedData;

    }

    mapToPoint(value) {
        var plot = this.plot;
        return {
            x: plot.x.value(value),
            y: parseFloat(plot.y.value(value))
        }
    }


    drawAxisX() {
        var self = this;
        var plot = self.plot;
        var axisConf = this.config.x;
        var axis = self.svgG.selectOrAppend("g." + self.prefixClass('axis-x') + "." + self.prefixClass('axis') + (self.config.guides ? '' : '.' + self.prefixClass('no-guides')))
            .attr("transform", "translate(0," + plot.height + ")");

        var axisT = axis;
        if (self.config.transition) {
            axisT = axis.transition().ease(d3.easeSinInOut);
        }

        axisT.call(plot.x.axis);

        axis.selectOrAppend("text." + self.prefixClass('label'))
            .attr("transform", "translate(" + (plot.width / 2) + "," + (plot.margin.bottom) + ")")  // text is drawn off the screen top left, move down and out and rotate
            .attr("dy", "-1em")
            .style("text-anchor", "middle")
            .text(axisConf.title);
    };

    drawAxisY() {
        var self = this;
        var plot = self.plot;
        var axisConf = this.config.y;
        var axis = self.svgG.selectOrAppend("g." + self.prefixClass('axis-y') + "." + self.prefixClass('axis') + (self.config.guides ? '' : '.' + self.prefixClass('no-guides')));

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
        var self = this;
        var plot = self.plot;

        console.log('layers', plot.layers);

        var layerClass = this.prefixClass("layer");

        var barClass = this.prefixClass("bar");
        var layer = self.svgG.selectAll("." + layerClass)
            .data(plot.layers);

        var layerMerge = layer.enter().append("g")
            .attr("class", layerClass).merge(layer);

        var bar = layerMerge.selectAll("." + barClass)
            .data(d => d.points);

        var barEnter = bar.enter().append("g")
            .attr("class", barClass);
        var barRectEnter = barEnter.append("rect")
            .attr("x", 1);
        var barMerge = barEnter.merge(bar);

        var barRect = barMerge.select("rect");

        var barRectT = barRect;
        var barT = barMerge;
        var layerT = layerMerge;
        if (this.transitionEnabled()) {
            barRectT = barRect.transition();
            barT = barMerge.transition();
            layerT = layerMerge.transition();
        }

        barEnter.attr("transform", function (d) {
            return "translate(" + plot.x.scale(d.x) + "," + (plot.y.scale(d.y0)) + ")";
        });
        var yDomain = plot.y.scale.domain();
        barT.attr("transform", function (d) {
            return "translate(" + plot.x.scale(d.x) + "," + (plot.y.scale(d.y0 + d.y)) + ")";
        });
        barRectEnter
            .attr("width", plot.x.scale.bandwidth())
            .attr("height", 0);
        barRectT
            .attr("width", plot.x.scale.bandwidth())
            .attr("height", d => plot.y.scale(d.y0) - plot.y.scale(d.y0 + d.y - yDomain[0]));


        if (this.plot.seriesColor) {
            layerT
                .attr("fill", this.plot.seriesColor);
        }

        if (plot.tooltip) {
            barMerge.on("mouseover", d => {
                self.showTooltip(d.y);
            }).on("mouseout", d => {
                self.hideTooltip();
            });
        }
        layer.exit().remove();
        bar.exit().remove();
    }

    update(newData) {
        super.update(newData);
        this.drawAxisX();
        this.drawAxisY();
        this.drawBars();
        return this;
    };

}
