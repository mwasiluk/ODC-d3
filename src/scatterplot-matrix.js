import {ChartWithColorGroups} from "./chart-with-color-groups";
import {ScatterPlotConfig} from "./scatterplot";
import {Utils} from './utils'
import {Legend} from "./legend";

export class ScatterPlotMatrixConfig extends ScatterPlotConfig{

    svgClass= this.cssClassPrefix+'scatterplot-matrix';
    size= undefined; //scatter plot cell size
    minCellSize = 50;
    maxCellSize = 1000;
    padding= 20; //scatter plot cell padding
    brush= true;
    guides= true; //show axis guides
    showTooltip= true; //show tooltip on dot hover
    ticks= undefined; //ticks number, (default: computed using cell size)
    x={// X axis config
        orient: "bottom",
        scale: "linear"
    };
    y={// Y axis config
        orient: "left",
        scale: "linear"
    };
    groups={
        key: undefined, //object property name or array index with grouping variable
        includeInPlot: false, //include group as variable in plot, boolean (default: false)
    };
    variables= {
        labels: [], //optional array of variable labels (for the diagonal of the plot).
        keys: [], //optional array of variable keys
        value: (d, variableKey) => d[variableKey] // variable value accessor
    };

    constructor(custom){
        super();
        Utils.deepExtend(this, custom);
    }


}

export class ScatterPlotMatrix extends ChartWithColorGroups {
    constructor(placeholderSelector, data, config) {
        super(placeholderSelector, data, new ScatterPlotMatrixConfig(config));
    }

    setConfig(config) {
        return super.setConfig(new ScatterPlotMatrixConfig(config));

    }

    initPlot() {
        super.initPlot();

        var self = this;
        var margin = this.plot.margin;
        var conf = this.config;
        this.plot.x={};
        this.plot.y={};
        this.plot.dot={
            color: null//color scale mapping function
        };
        
        this.setupVariables();

        this.plot.size = conf.size;


        var width = conf.width;
        var availableWidth = Utils.availableWidth(this.config.width, this.getBaseContainer(), margin);
        var availableHeight = Utils.availableHeight(this.config.height, this.getBaseContainer(), margin);
        if (!width) {
            if(!this.plot.size){
                this.plot.size =  Math.min(conf.maxCellSize, Math.max(conf.minCellSize, availableWidth/this.plot.variables.length));
            }
            width = margin.left + margin.right + this.plot.variables.length*this.plot.size;
        }
        if(!this.plot.size){
            this.plot.size = (width - (margin.left + margin.right)) / this.plot.variables.length;
        }

        var height = width;
        if (!height) {
            height = availableHeight;
        }

        this.plot.width = width - margin.left - margin.right;
        this.plot.height = height - margin.top - margin.bottom;


        this.plot.ticks = conf.ticks;

        if(this.plot.ticks===undefined){
            this.plot.ticks = this.plot.size / 40;
        }

        this.setupX();
        this.setupY();

        return this;

    };

    setupVariables() {
        var variablesConf = this.config.variables;

        var data = this.plot.groupedData;
        var plot = this.plot;
        plot.domainByVariable = {};
        plot.variables = variablesConf.keys;
        if(!plot.variables || !plot.variables.length){

            plot.variables = data.length ? Utils.inferVariables(data[0].values, this.config.groups.key, this.config.includeInPlot) : [];
        }

        plot.labels = [];
        plot.labelByVariable = {};
        plot.variables.forEach((variableKey, index) => {
            var min = d3.min(data, s=>d3.min(s.values, d=>variablesConf.value(d, variableKey)));
            var max = d3.max(data, s=>d3.max(s.values, d=>variablesConf.value(d, variableKey)));
            plot.domainByVariable[variableKey] = [min,max];
            var label = variableKey;
            if(variablesConf.labels && variablesConf.labels.length>index){

                label = variablesConf.labels[index];
            }
            plot.labels.push(label);
            plot.labelByVariable[variableKey] = label;
        });

        plot.subplots = [];
    };

    setupX() {

        var plot = this.plot;
        var x = plot.x;
        var conf = this.config;

        
        x.value = conf.variables.value;
        x.scale = Utils.createScale(conf.x.scale).range([conf.padding / 2, plot.size - conf.padding / 2]);
        x.map = (d, variable) => x.scale(x.value(d, variable));

        x.axis = Utils.createAxis(conf.x.orient, x.scale).ticks(plot.ticks);
        x.axis.tickSize(plot.size * plot.variables.length);

    };

    setupY() {

        var plot = this.plot;
        var y = plot.y;
        var conf = this.config;

        y.value = conf.variables.value;
        y.scale = Utils.createScale(conf.y.scale).range([ plot.size - conf.padding / 2, conf.padding / 2]);

        y.map = (d, variable) => y.scale(y.value(d, variable));
        y.axis = Utils.createAxis(conf.y.orient, y.scale).ticks(plot.ticks);
        y.axis.tickSize(-plot.size * plot.variables.length);
    };

    update( newData) {
        super.update(newData);

        var self =this;
        var n = self.plot.variables.length;
        var conf = this.config;

        var axisClass = self.prefixClass("axis");
        var axisXClass = axisClass+"-x";
        var axisYClass = axisClass+"-y";

        var xAxisSelector = "g."+axisXClass+"."+axisClass;
        var yAxisSelector = "g."+axisYClass+"."+axisClass;

        var noGuidesClass = self.prefixClass("no-guides");
        var xAxis = self.svgG.selectAll(xAxisSelector)
            .data(self.plot.variables);

        var xAxisMerge = xAxis.enter().appendSelector(xAxisSelector)
            .classed(noGuidesClass, !conf.guides).merge(xAxis);


        xAxisMerge.attr("transform", (d, i) => "translate(" + (n - i - 1) * self.plot.size + ",0)")
            .each(function(d) {
                self.plot.x.scale.domain(self.plot.domainByVariable[d]);
                var axis = d3.select(this);
                if (self.transitionEnabled()) {
                    axis = axis.transition();
                }
                axis.call(self.plot.x.axis);

            });

        xAxis.exit().remove();

        var yAxis = self.svgG.selectAll(yAxisSelector)
            .data(self.plot.variables);
        var yAxisMerge = yAxis.enter().appendSelector(yAxisSelector).merge(yAxis);
        yAxisMerge.classed(noGuidesClass, !conf.guides)
            .attr("transform", (d, i) => "translate(0," + i * self.plot.size + ")");
        yAxisMerge.each(function(d) {
            self.plot.y.scale.domain(self.plot.domainByVariable[d]);
            var axis = d3.select(this);
            if (self.transitionEnabled()) {
                axis = axis.transition();
            }
            axis.call(self.plot.y.axis);

        });

        yAxis.exit().remove();

        var cellClass =  self.prefixClass("cell");
        var cell = self.svgG.selectAll("."+cellClass)
            .data(self.utils.cross(self.plot.variables, self.plot.variables));

        var cellEnter =  cell.enter().appendSelector("g."+cellClass);
        cellEnter.filter(d => d.i === d.j).append("text");

        var cellMerge = cellEnter.merge(cell);
        cellMerge.attr("transform", d => "translate(" + (n - d.i - 1) * self.plot.size + "," + d.j * self.plot.size + ")");

        if(conf.brush){
            this.drawBrush(cellMerge);
        }


        cellMerge.each(plotSubplot);

        //Labels
        cellMerge.select("text")
            .attr("x", conf.padding)
            .attr("y", conf.padding)
            .attr("dy", ".71em")
            .text( d => self.plot.labelByVariable[d.x]);

        cell.exit().remove();

        function plotSubplot(p) {
            var plot = self.plot;
            plot.subplots.push(p);
            var cell = d3.select(this);

            plot.x.scale.domain(plot.domainByVariable[p.x]);
            plot.y.scale.domain(plot.domainByVariable[p.y]);

            var frameClass =  self.prefixClass("frame");
            cell.selectOrAppend("rect."+frameClass)
                .attr("class", frameClass)
                .attr("x", conf.padding / 2)
                .attr("y", conf.padding / 2)
                .attr("width", plot.size - conf.padding)
                .attr("height", plot.size - conf.padding);
            
            p.update = function() {

                var subplot = this;
                var layerClass = self.prefixClass('layer');


                var layer = cell.selectAll("g."+layerClass).data(self.plot.groupedData);

                var layerMerge = layer.enter().appendSelector("g."+layerClass).merge(layer);

                var dots = layerMerge.selectAll("circle")
                    .data(d=>d.values);

                var dotsMerge = dots.enter().append("circle").merge(dots);

                var dotsT = dotsMerge;
                if (self.transitionEnabled()) {
                    dotsT = dotsMerge.transition();
                }

                dotsT.attr("cx", (d) => plot.x.map(d, subplot.x))
                    .attr("cy", (d) => plot.y.map(d, subplot.y))
                    .attr("r", self.config.dotRadius);


                if (plot.seriesColor) {
                    layerMerge.style("fill", plot.seriesColor)
                }else if(plot.color){
                    dotsMerge.style("fill", plot.color)
                }


                if (plot.tooltip) {
                    dotsMerge.on("mouseover", (d) => {

                        var html = "(" + plot.x.value(d, subplot.x) + ", " + plot.y.value(d, subplot.y) + ")";
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
                        .on("mouseout", (d)=> {
                            self.hideTooltip();
                        });
                }

                dots.exit().remove();
                layer.exit().remove();
            };
            p.update();

        }
    };

    drawBrush(cell) {
        var self = this;
        var hiddenClass = self.plot.hiddenClass =  self.prefixClass("hidden");
        var brush = d3.brush()
            // .x(self.plot.x.scale)
            // .y(self.plot.y.scale)
            .on("start", brushstart)
            .on("brush", brushmove)
            .on("end", brushend);

        brush.extent([[0, 0], [self.plot.size, self.plot.size]]);
        cell.selectOrAppend("g.brush-container").call(brush);

        self.clearBrush();

        // Clear the previously-active brush, if any.
        function brushstart(p) {
            if (self.plot.brushCell !== this) {
                self.clearBrush();
                self.plot.x.scale.domain(self.plot.domainByVariable[p.x]);
                self.plot.y.scale.domain(self.plot.domainByVariable[p.y]);
                self.plot.brushCell = this;
                self.plot.brush = brush;
            }
        }

        // Highlight the selected circles.
        function brushmove(p) {
            var s = d3.event.selection;
            if(!s)return;
            var e = s.map(_=> [self.plot.x.scale.invert(_[0]), self.plot.y.scale.invert(_[1])]);
            // console.log(e);

            self.svgG.selectAll("circle").classed(hiddenClass, function (d) {
                var x = parseFloat(d[p.x]),
                    y = parseFloat(d[p.y]);

                return e[0][0] > x || x > e[1][0]
                    || e[1][1] > y || y > e[0][1];
            });
        }
        // If the brush is empty, select all circles.
        function brushend() {
            if (!d3.event.selection) self.svgG.selectAll("."+hiddenClass).classed(hiddenClass, false);
        }
    };

    clearBrush(){
        var self = this;
        if(!self.plot.brushCell){
            return;
        }
        
        self.plot.brush.move(d3.select(self.plot.brushCell), null);
        self.svgG.selectAll("."+self.plot.hiddenClass).classed(self.plot.hiddenClass, false);
        self.plot.brushCell=null;

    }
}