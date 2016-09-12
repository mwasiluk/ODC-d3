import {ChartWithColorGroups} from "./chart-with-color-groups";
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

        return this;

    };

    setupVariables() {
        var variablesConf = this.config.variables;

        var data = this.plot.groupedData;
        var plot = this.plot;
        plot.domainByVariable = {};
        plot.variables = variablesConf.keys;
        if(!plot.variables || !plot.variables.length){

            plot.variables = Utils.inferVariables(data[0].values, this.config.groups.key, this.config.includeInPlot);
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
            .data(self.utils.cross(self.plot.variables, self.plot.variables));

        cell.enter().appendSelector("g."+cellClass).filter(d => d.i === d.j)
            .append("text");

        cell.attr("transform", d => "translate(" + (n - d.i - 1) * self.plot.size + "," + d.j * self.plot.size + ")");

        if(conf.brush){
            this.drawBrush(cell);
        }

        cell.each(plotSubplot);

        //Labels
        cell.select("text")
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
            cell.selectOrAppend("rect."+frameClass)
                .attr("class", frameClass)
                .attr("x", conf.padding / 2)
                .attr("y", conf.padding / 2)
                .attr("width", conf.size - conf.padding)
                .attr("height", conf.size - conf.padding);


            p.update = function() {

                var subplot = this;
                var layerClass = self.prefixClass('layer');


                var layer = cell.selectAll("g."+layerClass).data(self.plot.groupedData);

                layer.enter().appendSelector("g."+layerClass);

                var dots = layer.selectAll("circle")
                    .data(d=>d.values);

                dots.enter().append("circle");

                var dotsT = dots;
                if (self.transitionEnabled()) {
                    dotsT = dots.transition();
                }

                dotsT.attr("cx", (d) => plot.x.map(d, subplot.x))
                    .attr("cy", (d) => plot.y.map(d, subplot.y))
                    .attr("r", self.config.dotRadius);


                if (plot.seriesColor) {
                    layer.style("fill", plot.seriesColor)
                }else if(plot.color){
                    dots.style("fill", plot.color)
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

                        var group = self.config.groups ?  self.config.groups.value.call(self.config,d) : null;
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
                layer.exit().remove();
            };
            p.update();

        }
    };

    drawBrush(cell) {
        var self = this;
        var brush = d3.svg.brush()
            .x(self.plot.x.scale)
            .y(self.plot.y.scale)
            .on("brushstart", brushstart)
            .on("brush", brushmove)
            .on("brushend", brushend);

        self.plot.brush = brush;

        cell.selectOrAppend("g.brush-container").call(brush);
        self.clearBrush();

        // Clear the previously-active brush, if any.
        function brushstart(p) {
            if (self.plot.brushCell !== this) {
                self.clearBrush();
                self.plot.x.scale.domain(self.plot.domainByVariable[p.x]);
                self.plot.y.scale.domain(self.plot.domainByVariable[p.y]);
                self.plot.brushCell = this;
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

    clearBrush(){
        var self = this;
        if(!self.plot.brushCell){
            return;
        }
        d3.select(self.plot.brushCell).call(self.plot.brush.clear());
        self.svgG.selectAll(".hidden").classed("hidden", false);
        self.plot.brushCell=null;
    }
}