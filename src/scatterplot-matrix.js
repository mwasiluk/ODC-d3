import {Chart, ChartConfig} from "./chart";
import {ScatterPlotConfig} from "./scatterplot";
import {Utils} from './utils'

export class ScatterPlotMatrixConfig extends ScatterPlotConfig{

    svgClass= 'mw-d3-scatterplot-matrix';
    size= 200; //scatter plot cell size
    padding= 20; //scatter plot cell padding
    brush= true;
    guides= true; //show axis guides
    tooltip= true; //show tooltip on dot hover
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
        value: function(d, key) { return d[key] }, // grouping value accessor,
        label: ""
    };
    variables= {
        labels: [], //optional array of variable labels (for the diagonal of the plot).
        keys: [], //optional array of variable keys
        value: function (d, variableKey) {// variable value accessor
            return d[variableKey];
        }
    };

    constructor(custom){
        super();

        // this.svgClass = 'mw-d3-scatterplot-matrix';
        console.log(custom);
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


        var self = this;
        var margin = this.config.margin;
        var conf = this.config;
        this.plot = {
            x: {},
            y: {},
            dot: {
                color: null//color scale mapping function
            }
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

        if (conf.dot.d3ColorCategory) {
            this.plot.dot.colorCategory = d3.scale[conf.dot.d3ColorCategory]();
        }
        var colorValue = conf.dot.color;
        if (colorValue) {
            this.plot.dot.colorValue = colorValue;

            if (typeof colorValue === 'string' || colorValue instanceof String) {
                this.plot.dot.color = colorValue;
            } else if (this.plot.dot.colorCategory) {
                this.plot.dot.color = function (d) {
                    return self.plot.dot.colorCategory(self.plot.dot.colorValue(d));
                }
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
        plot.variables.forEach(function(variableKey, index) {
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
        x.map = function (d, variable) {
            return x.scale(x.value(d, variable));
        };
        x.axis = d3.svg.axis().scale(x.scale).orient(conf.x.orient).ticks(conf.ticks);
        x.axis.tickSize(plot.size * plot.variables.length);

    };

    setupY() {

        var plot = this.plot;
        var y = plot.y;
        var conf = this.config;

        y.value = conf.variables.value;
        y.scale = d3.scale[conf.y.scale]().range([ plot.size - conf.padding / 2, conf.padding / 2]);
        y.map = function (d, variable) {
            return y.scale(y.value(d, variable));
        };
        y.axis= d3.svg.axis().scale(y.scale).orient(conf.y.orient).ticks(conf.ticks);
        y.axis.tickSize(-plot.size * plot.variables.length);
    };

    draw() {
        var self =this;
        var n = self.plot.variables.length;
        var conf = this.config;
        self.svgG.selectAll(".mw-axis-x.mw-axis")
            .data(self.plot.variables)
            .enter().append("g")
            .attr("class", "mw-axis-x mw-axis"+(conf.guides ? '' : ' mw-no-guides'))
            .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * self.plot.size + ",0)"; })
            .each(function(d) { self.plot.x.scale.domain(self.plot.domainByVariable[d]); d3.select(this).call(self.plot.x.axis); });

        self.svgG.selectAll(".mw-axis-y.mw-axis")
            .data(self.plot.variables)
            .enter().append("g")
            .attr("class", "mw-axis-y mw-axis"+(conf.guides ? '' : ' mw-no-guides'))
            .attr("transform", function(d, i) { return "translate(0," + i * self.plot.size + ")"; })
            .each(function(d) { self.plot.y.scale.domain(self.plot.domainByVariable[d]); d3.select(this).call(self.plot.y.axis); });

        var cell = self.svgG.selectAll(".mw-cell")
            .data(self.utils.cross(self.plot.variables, self.plot.variables))
            .enter().append("g")
            .attr("class", "mw-cell")
            .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * self.plot.size + "," + d.j * self.plot.size + ")"; });

        if(conf.brush){
            this.drawBrush(cell);
        }

        cell.each(plotSubplot);



        //Labels
        cell.filter(function(d) { return d.i === d.j; }).append("text")
            .attr("x", conf.padding)
            .attr("y", conf.padding)
            .attr("dy", ".71em")
            .text(function(d) { return self.plot.labelByVariable[d.x]; });




        function plotSubplot(p) {
            var plot = self.plot;
            plot.subplots.push(p);
            var cell = d3.select(this);

            plot.x.scale.domain(plot.domainByVariable[p.x]);
            plot.y.scale.domain(plot.domainByVariable[p.y]);

            cell.append("rect")
                .attr("class", "mw-frame")
                .attr("x", conf.padding / 2)
                .attr("y", conf.padding / 2)
                .attr("width", conf.size - conf.padding)
                .attr("height", conf.size - conf.padding);


            p.update = function(){
                var subplot = this;
                var dots = cell.selectAll("circle")
                    .data(self.data);

                dots.enter().append("circle");

                dots.attr("cx", function(d){return plot.x.map(d, subplot.x)})
                    .attr("cy", function(d){return plot.y.map(d, subplot.y)})
                    .attr("r", self.config.dot.radius);

                if (plot.dot.color) {
                    dots.style("fill", plot.dot.color)
                }

                if(plot.tooltip){
                    dots.on("mouseover", function(d) {
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
                        .on("mouseout", function(d) {
                            plot.tooltip.transition()
                                .duration(500)
                                .style("opacity", 0);
                        });
                }

                dots.exit().remove();
            };

            p.update();
        }


    };

    update() {
        this.plot.subplots.forEach(function(p){p.update()});
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
}