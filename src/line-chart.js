import {ChartWithColorGroups, ChartWithColorGroupsConfig} from "./chart-with-color-groups";
import {Utils} from './utils'
import * as d3 from './d3'

export class LineChartConfig extends ChartWithColorGroupsConfig {

    svgClass = this.cssClassPrefix + 'line-chart';
    guides = false; //show axis guides
    showTooltip = true; //show tooltip on dot hover

    x = {// X axis config
        title: '', // axis label
        key: 0,
        value: (d, key) => d[key], // x value accessor
        orient: "bottom",
        scale: "linear",
        domainMargin: 0.05
    };
    y = {// Y axis config
        title: '', // axis label,
        key: 1,
        value: (d, key) => d[key], // y value accessor
        orient: "left",
        scale: "linear",
        domainMargin: 0.05
    };
    groups = {
        key: 2
    };

    dotRadius = 2;
    dotId = (event, d) => undefined;
    transition = true;
    onDotHover = (event, d) => {};
    onDotHoverOut = (event, d) => {};
    lineId = (event, d) => undefined;
    transition = true;
    onLineHover = (event, d) => {};
    onLineHoverOut = (event, d) => {};

    constructor(custom) {
        super();


        if (custom) {
            Utils.deepExtend(this, custom);
        }

    }
}

export class LineChart extends ChartWithColorGroups {
    constructor(placeholderSelector, data, config) {
        super(placeholderSelector, data, new LineChartConfig(config));
    }

    setConfig(config) {
        return super.setConfig(new LineChartConfig(config));
    }

    initPlot() {
        super.initPlot();
        var self = this;

        var conf = this.config;

        this.plot.x = {};
        this.plot.y = {};

        this.computePlotSize();
        this.setupX();
        this.setupY();

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

        x.scale = Utils.createScale(conf.scale).range([0, plot.width]);
        x.map = d => x.scale(x.value(d));

        x.axis = Utils.createAxis(conf.orient, x.scale);

        var data = this.plot.groupedData;

        var domain = [parseFloat(d3.min(data, s => d3.min(s.values, plot.x.value))), parseFloat(d3.max(data, s => d3.max(s.values, plot.x.value)))];
        var extent = (domain[1] - domain[0]) || 1;
        var margin = (extent) * conf.domainMargin;
        domain[0] -= margin;
        domain[1] += margin;
        plot.x.scale.domain(domain);
        if (this.config.guides) {
            x.axis.tickSize(-plot.height);
        }

    };

    setupY() {

        var plot = this.plot;
        var y = plot.y;
        var conf = this.config.y;

        /*
         * value accessor - returns the value to encode for a given data object.
         * scale - maps value to a visual display encoding, such as a pixel position.
         * map function - maps from data value to display value
         * axis - sets up axis
         */
        y.value = d => conf.value(d, conf.key);

        y.scale = Utils.createScale(conf.scale).range([plot.height, 0]);

        y.map = d => y.scale(y.value(d));

        y.axis = Utils.createAxis(conf.orient, y.scale);

        if (this.config.guides) {
            y.axis.tickSize(-plot.width);
        }


        var data = this.plot.groupedData;

        var domain = [parseFloat(d3.min(data, s => d3.min(s.values, plot.y.value))), parseFloat(d3.max(data, s => d3.max(s.values, plot.y.value)))];
        var extent = (domain[1] - domain[0]) || 1;
        var margin = (extent) * conf.domainMargin;

        domain[0] -= margin;
        domain[1] += margin;
        plot.y.scale.domain(domain);
        // plot.y.scale.domain([d3.min(data, plot.y.value)-1, d3.max(data, plot.y.value)+1]);
    };

    drawAxisX() {
        var self = this;
        var plot = self.plot;
        var axisConf = this.config.x;
        var axis = self.svgG.selectOrAppend("g." + self.prefixClass('axis-x') + "." + self.prefixClass('axis') + (self.config.guides ? '' : '.' + self.prefixClass('no-guides')))
            .attr("transform", "translate(0," + plot.height + ")");

        var axisT = axis;
        if (self.transitionEnabled()) {
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
        if (self.transitionEnabled()) {
            axisT = axis.transition().ease(d3.easeSinInOut);
        }

        axisT.call(plot.y.axis);

        axis.selectOrAppend("text." + self.prefixClass('label'))
            .attr("transform", "translate(" + -plot.margin.left + "," + (plot.height / 2) + ")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(axisConf.title);
    };

    update(newData) {
        super.update(newData);
        this.drawAxisX();
        this.drawAxisY();
        this.updateLines();
    };

    updateLines() {
        var self = this;
        var plot = self.plot;
        var data = plot.data;
        var layerClass = self.prefixClass('layer');
        var lineClass = this.lineClass = self.prefixClass('line');
        self.linesContainerClass = self.prefixClass('lines-container');

        var linesContainer = self.svgG.selectOrAppend("g." + self.linesContainerClass);

        var layer = linesContainer.selectAll("g." + layerClass).data(plot.groupedData);

        var layerEnter = layer.enter().appendSelector("g." + layerClass);
        var linePathEnter = layerEnter.append("path")
            .attr("class", lineClass);

        var layerMerge = layerEnter.merge(layer);

        var linePath = layerMerge.select('.' + lineClass)
            .datum(d => d.values);

        var linePathMerge = linePathEnter.merge(linePath);

        var linePathT = linePathMerge;
        if (self.transitionEnabled()) {
            linePathT = linePathMerge.transition();
        }

        var line = d3.line()
            .x(plot.x.map)
            .y(plot.y.map);

        linePathT
            .attr("fill", "none")
            // .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("id", this.config.lineId)
            .attr("d", line);


        //TODO add tooltip

        linePathMerge.on("mouseover.onLineHover", this.config.onLineHover);
        linePathMerge.on("mouseout.onLineHoverOut", this.config.onLineHoverOut);

        if (plot.seriesColor) {
            layerMerge.style("stroke", plot.seriesColor)
        } else if (plot.color) {
            linePathMerge.style("stroke", plot.color)
        }

        linePath.exit().remove();
        var dotClass = this.dotClass = self.prefixClass('dot');

        var dots = layerMerge.selectAll('.' + dotClass)
            .data(d => d.values);

        var dotsEnter = dots.enter().append("circle")
            .attr("class", dotClass);

        var dotsMerge = dotsEnter.merge(dots);

        var dotsT = dotsMerge;
        if (self.transitionEnabled()) {
            dotsT = dotsMerge.transition();
        }

        dotsT.attr("r", self.config.dotRadius)
            .attr("cx", plot.x.map)
            .attr("cy", plot.y.map)
            .attr("id", this.config.dotId);

        if (plot.tooltip) {
            dotsMerge.on("mouseover", (event, d) => {
                var html = "(" + plot.x.value(d) + ", " + plot.y.value(d) + ")";
                var group = self.config.groups ? self.config.groups.value.call(self.config, d) : null;
                if (group || group === 0) {
                    group = plot.groupToLabel[group];
                    html += "<br/>";
                    var label = self.config.groups.label;
                    if (label) {
                        html += label + ": ";
                    }
                    html += group
                }
                self.showTooltip(html);
            })
                .on("mouseout", () => {
                    self.hideTooltip();
                });
        }

        dotsMerge.on("mouseover.onDotHover", this.config.onDotHover);
        dotsMerge.on("mouseout.onDotHoverOut", this.config.onDotHoverOut);

        if (plot.seriesColor) {
            layerMerge.style("fill", plot.seriesColor)
        } else if (plot.color) {
            dotsMerge.style("fill", plot.color)
        }

        dots.exit().remove();


        layer.exit().remove();
    }
}
