import {Chart, ChartConfig} from "./chart";
import {Utils} from './utils'

export class ScatterPlotConfig extends ChartConfig{

    svgClass= 'mw-d3-scatterplot';
    guides= false; //show axis guides
    tooltip= true; //show tooltip on dot hover
    x={// X axis config
        label: 'X', // axis label
        key: 0,
        value: function(d, key) { return d[key] }, // x value accessor
        orient: "bottom",
        scale: "linear"
    };
    y={// Y axis config
        label: 'Y', // axis label,
        key: 1,
        value: function(d, key) { return d[key] }, // y value accessor
        orient: "left",
        scale: "linear"
    };
    groups={
        key: 2,
        value: function(d, key) { return d[key] }, // grouping value accessor,
        label: ""
    };

    constructor(custom){
        super();
        var config = this;
        this.dot={
            radius: 2,
            color: function(d) { return config.groups.value(d, config.groups.key) }, // string or function returning color's value for color scale
            d3ColorCategory: 'category10'
        };

        if(custom){
            Utils.deepExtend(this, custom);
        }

    }
}

export class ScatterPlot extends Chart{
    constructor(placeholderSelector, data, config) {
        super(placeholderSelector, data, new ScatterPlotConfig(config));
    }

    setConfig(config){
        return super.setConfig(new ScatterPlotConfig(config));
    }

    initPlot(){
        var self=this;
        var margin = this.config.margin;
        var conf = this.config;
        this.plot={
            x: {},
            y: {},
            dot: {
                color: null//color scale mapping function
            }
        };

        var width = conf.width;
        var placeholderNode = this.getBaseContainerNode();

        if(!width){
            width =placeholderNode.getBoundingClientRect().width;
        }
        var height = conf.height;
        if(!height){
            height =placeholderNode.getBoundingClientRect().height;
        }

        this.plot.width = width - margin.left - margin.right;
        this.plot.height = height - margin.top - margin.bottom;

        this.setupX();
        this.setupY();

        if(conf.dot.d3ColorCategory){
            this.plot.dot.colorCategory = d3.scale[conf.dot.d3ColorCategory]();
        }
        var colorValue = conf.dot.color;
        if(colorValue){
            this.plot.dot.colorValue = colorValue;

            if (typeof colorValue === 'string' || colorValue instanceof String){
                this.plot.dot.color = colorValue;
            }else if(this.plot.dot.colorCategory){
                this.plot.dot.color = function(d){
                    return self.plot.dot.colorCategory(self.plot.dot.colorValue(d));
                }
            }


        }else{


        }

        return this;
    }

    setupX(){

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
        x.scale = d3.scale[conf.scale]().range([0, plot.width]);
        x.map = function(d) { return x.scale(x.value(d));};
        x.axis = d3.svg.axis().scale(x.scale).orient(conf.orient);
        var data = this.data;
        plot.x.scale.domain([d3.min(data, plot.x.value)-1, d3.max(data, plot.x.value)+1]);
        if(this.config.guides) {
            x.axis.tickSize(-plot.height);
        }

    };

    setupY (){

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
        y.scale = d3.scale[conf.scale]().range([plot.height, 0]);
        y.map = function(d) { return y.scale(y.value(d));};
        y.axis = d3.svg.axis().scale(y.scale).orient(conf.orient);

        if(this.config.guides){
            y.axis.tickSize(-plot.width);
        }


        var data = this.data;
        plot.y.scale.domain([d3.min(data, plot.y.value)-1, d3.max(data, plot.y.value)+1]);
    };

    draw(){
        this.drawAxisX();
        this.drawAxisY();
        this.update();
    };

    drawAxisX(){

        
        var self = this;
        var plot = self.plot;
        var axisConf = this.config.x;
        self.svgG.selectOrAppend("g.mw-axis-x.mw-axis"+(self.config.guides ? '' : '.mw-no-guides'))
            .attr("transform", "translate(0," + plot.height + ")")
            .call(plot.x.axis)
            .selectOrAppend("text.mw-label")
            .attr("transform", "translate("+ (plot.width/2) +","+ (self.config.margin.bottom) +")")  // text is drawn off the screen top left, move down and out and rotate
            .attr("dy", "-1em")
            .style("text-anchor", "middle")
            .text(axisConf.label);
    };

    drawAxisY(){
        var self = this;
        var plot = self.plot;
        var axisConf = this.config.y;
        self.svgG.selectOrAppend("g.mw-axis-y.mw-axis"+(self.config.guides ? '' : '.mw-no-guides'))
            .call(plot.y.axis)
            .selectOrAppend("text.mw-label")
            .attr("transform", "translate("+ -self.config.margin.left +","+(plot.height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(axisConf.label);
    };

    update(newData){
        // D3ChartBase.prototype.update.call(this, newData);
        var self = this;
        var plot = self.plot;
        var data = this.data;
        var dots = self.svgG.selectAll(".mw-dot")
            .data(data);

        dots.enter().append("circle")
            .attr("class", "mw-dot");


        dots.attr("r", self.config.dot.radius)
            .attr("cx", plot.x.map)
            .attr("cy", plot.y.map);

        if(plot.tooltip){
            dots.on("mouseover", function(d) {
                plot.tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                var html = "(" + plot.x.value(d) + ", " +plot.y.value(d) + ")";
                var group = self.config.groups.value(d, self.config.groups.key);
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

        if(plot.dot.color){
            dots.style("fill", plot.dot.color)
        }

        dots.exit().remove();

    };
}
