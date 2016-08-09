import {Chart, ChartConfig} from "./chart";
import {ScatterPlotConfig} from "./scatterplot";
import {Utils} from './utils'
import {Legend} from "./legend";

export class ScatterPlotMatrixConfig extends ScatterPlotConfig{

    svgClass= this.cssClassPrefix+'scatterplot-matrix';
    size= 200; //scatter plot cell size
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
        value: (d, key) => d[key], // grouping value accessor,
        label: ""
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

export class ScatterPlotMatrix extends Chart {
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


        this.plot.showLegend = conf.showLegend;
        if(this.plot.showLegend){
            margin.right = conf.margin.right + conf.legend.width+conf.legend.margin*2;
        }

        this.setupVariables();

        this.plot.size = conf.size;


        var width = conf.width;
        var boundingClientRect = this.getBaseContainerNode().getBoundingClientRect();
        if (!width) {
            var maxWidth = margin.left + margin.right + this.plot.variables.length*this.plot.size;
            width = Math.min(boundingClientRect.width, maxWidth);

        }
        var height = width;
        if (!height) {
            height = boundingClientRect.height;
        }

        this.plot.width = width - margin.left - margin.right;
        this.plot.height = height - margin.top - margin.bottom;




        if(conf.ticks===undefined){
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
                this.plot.dot.color = d => self.plot.dot.colorCategory(self.plot.dot.colorValue(d));
            }


        }



        return this;

    };

    setupVariables() {
        var variablesConf = this.config.variables;

        var data = this.data;
        var plot = this.plot;
        plot.domainByVariable = {};
        plot.variables = variablesConf.keys;
        if(!plot.variables || !plot.variables.length){
            plot.variables = Utils.inferVariables(data, this.config.groups.key, this.config.includeInPlot);
        }

        plot.labels = [];
        plot.labelByVariable = {};
        plot.variables.forEach((variableKey, index) => {
            plot.domainByVariable[variableKey] = d3.extent(data, function(d) { return variablesConf.value(d, variableKey) });
            var label = variableKey;
            if(variablesConf.labels && variablesConf.labels.length>index){

                label = variablesConf.labels[index];
            }
            plot.labels.push(label);
            plot.labelByVariable[variableKey] = label;
        });

        console.log(plot.labelByVariable);

        plot.subplots = [];
    };

    setupX() {

        var plot = this.plot;
        var x = plot.x;
        var conf = this.config;

        x.value = conf.variables.value;
        x.scale = d3.scale[conf.x.scale]().range([conf.padding / 2, plot.size - conf.padding / 2]);
        x.map = (d, variable) => x.scale(x.value(d, variable));
        x.axis = d3.svg.axis().scale(x.scale).orient(conf.x.orient).ticks(conf.ticks);
        x.axis.tickSize(plot.size * plot.variables.length);

    };

    setupY() {

        var plot = this.plot;
        var y = plot.y;
        var conf = this.config;

        y.value = conf.variables.value;
        y.scale = d3.scale[conf.y.scale]().range([ plot.size - conf.padding / 2, conf.padding / 2]);
        y.map = (d, variable) => y.scale(y.value(d, variable));
        y.axis= d3.svg.axis().scale(y.scale).orient(conf.y.orient).ticks(conf.ticks);
        y.axis.tickSize(-plot.size * plot.variables.length);
    };

    draw() {
        var self =this;
        var n = self.plot.variables.length;
        var conf = this.config;

        var axisClass = self.prefixClass("axis");
        var axisXClass = axisClass+"-x";
        var axisYClass = axisClass+"-y";

        var xAxisSelector = "g."+axisXClass+"."+axisClass;
        var yAxisSelector = "g."+axisYClass+"."+axisClass;

        var noGuidesClass = self.prefixClass("no-guides");
        self.svgG.selectAll(xAxisSelector)
            .data(self.plot.variables)
            .enter().appendSelector(xAxisSelector)
            .classed(noGuidesClass, !conf.guides)
            .attr("transform", (d, i) => "translate(" + (n - i - 1) * self.plot.size + ",0)")
            .each(function(d) { self.plot.x.scale.domain(self.plot.domainByVariable[d]); d3.select(this).call(self.plot.x.axis); });

        self.svgG.selectAll(yAxisSelector)
            .data(self.plot.variables)
            .enter().appendSelector(yAxisSelector)
            .classed(noGuidesClass, !conf.guides)
            .attr("transform", (d, i) => "translate(0," + i * self.plot.size + ")")
            .each(function(d) { self.plot.y.scale.domain(self.plot.domainByVariable[d]); d3.select(this).call(self.plot.y.axis); });

        var cellClass =  self.prefixClass("cell");
        var cell = self.svgG.selectAll("."+cellClass)
            .data(self.utils.cross(self.plot.variables, self.plot.variables))
            .enter().appendSelector("g."+cellClass)
            .attr("transform", d => "translate(" + (n - d.i - 1) * self.plot.size + "," + d.j * self.plot.size + ")");

        if(conf.brush){
            this.drawBrush(cell);
        }

        cell.each(plotSubplot);



        //Labels
        cell.filter(d => d.i === d.j)
            .append("text")
            .attr("x", conf.padding)
            .attr("y", conf.padding)
            .attr("dy", ".71em")
            .text( d => self.plot.labelByVariable[d.x]);




        function plotSubplot(p) {
            var plot = self.plot;
            plot.subplots.push(p);
            var cell = d3.select(this);

            plot.x.scale.domain(plot.domainByVariable[p.x]);
            plot.y.scale.domain(plot.domainByVariable[p.y]);

            var frameClass =  self.prefixClass("frame");
            cell.append("rect")
                .attr("class", frameClass)
                .attr("x", conf.padding / 2)
                .attr("y", conf.padding / 2)
                .attr("width", conf.size - conf.padding)
                .attr("height", conf.size - conf.padding);


            p.update = function() {
                var subplot = this;
                var dots = cell.selectAll("circle")
                    .data(self.data);

                dots.enter().append("circle");

                dots.attr("cx", (d) => plot.x.map(d, subplot.x))
                    .attr("cy", (d) => plot.y.map(d, subplot.y))
                    .attr("r", self.config.dot.radius);

                if (plot.dot.color) {
                    dots.style("fill", plot.dot.color)
                }

                if(plot.tooltip){
                    dots.on("mouseover", (d) => {
                        plot.tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        var html = "(" + plot.x.value(d, subplot.x) + ", " +plot.y.value(d, subplot.y) + ")";
                        plot.tooltip.html(html)
                            .style("left", (d3.event.pageX + 5) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");

                        var group = self.config.groups.value(d);
                        if(group || group===0 ){
                            html+="<br/>";
                            var label = self.config.groups.label;
                            if(label){
                                html+=label+": ";
                            }
                            html+=group
                        }
                        plot.tooltip.html(html)
                            .style("left", (d3.event.pageX + 5) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                    })
                        .on("mouseout", (d)=> {
                            plot.tooltip.transition()
                                .duration(500)
                                .style("opacity", 0);
                        });
                }

                dots.exit().remove();
            };
            p.update();

        }


        this.updateLegend();
    };

    update(data) {

        super.update(data);
        this.plot.subplots.forEach(p => p.update());
        this.updateLegend();
    };

    drawBrush(cell) {
        var self = this;
        var brush = d3.svg.brush()
            .x(self.plot.x.scale)
            .y(self.plot.y.scale)
            .on("brushstart", brushstart)
            .on("brush", brushmove)
            .on("brushend", brushend);

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
                return e[0][0] > d[p.x] || d[p.x] > e[1][0]
                    || e[0][1] > d[p.y] || d[p.y] > e[1][1];
            });
        }
        // If the brush is empty, select all circles.
        function brushend() {
            if (brush.empty()) self.svgG.selectAll(".hidden").classed("hidden", false);
        }
    };

    updateLegend() {

        console.log('updateLegend');
        var plot = this.plot;

        var scale = plot.dot.colorCategory;
        if(!scale.domain() || scale.domain().length<2){
            plot.showLegend = false;
        }

        if(!plot.showLegend){
            if(plot.legend && plot.legend.container){
                plot.legend.container.remove();
            }
            return;
        }


        var legendX = this.plot.width + this.config.legend.margin;
        var legendY = this.config.legend.margin;

        plot.legend = new Legend(this.svg, this.svgG, scale, legendX, legendY);

        var legendLinear = plot.legend.color()
            .shapeWidth(this.config.legend.shapeWidth)
            .orient('vertical')
            .scale(scale);

        plot.legend.container
            .call(legendLinear);
    }
}