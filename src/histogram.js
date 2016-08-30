import {Chart, ChartConfig} from "./chart";
import {Utils} from './utils'
import {Legend} from "./legend";

export class HistogramConfig extends ChartConfig{

    svgClass= this.cssClassPrefix+'histogram';
    showLegend=false;
    showTooltip =true;
    legend={//TODO
        width: 80,
        margin: 10
    };
    x={// X axis config
        label: '', // axis label
        key: 0,
        value: (d, key) => Utils.isNumber(d) ? d : d[key], // x value accessor
        scale: "linear",
        ticks: undefined,
    };
    y={// Y axis config
        label: '', // axis label,
        orient: "left",
        scale: "linear"
    };
    groups={ //TODO stack grouping
        key: 2,
        value: (d, key) => d[key] , // grouping value accessor,
        label: ""
    };
    transition= true;

    constructor(custom){
        super();
        var config = this;

        if(custom){
            Utils.deepExtend(this, custom);
        }

    }
}

export class Histogram extends Chart{
    constructor(placeholderSelector, data, config) {
        super(placeholderSelector, data, new HistogramConfig(config));
    }

    setConfig(config){
        return super.setConfig(new HistogramConfig(config));
    }

    initPlot(){
        super.initPlot();
        var self=this;

        var conf = this.config;

        this.plot.x={};
        this.plot.y={};
        this.plot.bar={
            color: null//color scale mapping function
        };


        this.plot.showLegend = conf.showLegend;
        if(this.plot.showLegend){
            this.plot.margin.right = conf.margin.right + conf.legend.width+conf.legend.margin*2;
        }


        this.computePlotSize();


        this.setupX();
        this.setupHistogram();
        this.setupY();


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
        x.map = d => x.scale(x.value(d));

        x.axis = d3.svg.axis().scale(x.scale).orient(conf.orient);
        if(conf.ticks){
            x.axis.ticks(conf.ticks);
        }
        var data = this.data;
        plot.x.scale.domain([d3.min(data, plot.x.value), d3.max(data, plot.x.value)]);



    };

    setupY (){

        var plot = this.plot;
        var y = plot.y;
        var conf = this.config.y;
        y.scale = d3.scale[conf.scale]().range([plot.height, 0]);

        y.axis = d3.svg.axis().scale(y.scale).orient(conf.orient);

        var data = this.data;
        plot.y.scale.domain([0, d3.max(plot.histogramBins, d=>d.y)]);
    };

    setupHistogram() {
        var plot = this.plot;
        var x = plot.x;
        var y = plot.y;
        var ticks = this.config.x.ticks ? x.scale.ticks(this.config.x.ticks) : x.scale.ticks();

        plot.histogram = d3.layout.histogram()
            .value(x.value)
            .bins(ticks);
        plot.histogramBins = plot.histogram(this.data);


    }

    drawAxisX(){
        var self = this;
        var plot = self.plot;
        var axisConf = this.config.x;
        var axis = self.svgG.selectOrAppend("g."+self.prefixClass('axis-x')+"."+self.prefixClass('axis')+(self.config.guides ? '' : '.'+self.prefixClass('no-guides')))
            .attr("transform", "translate(0," + plot.height + ")");

        var axisT = axis;
        if (self.config.transition) {
            axisT = axis.transition().ease("sin-in-out");
        }

        axisT.call(plot.x.axis);

        axis.selectOrAppend("text."+self.prefixClass('label'))
            .attr("transform", "translate("+ (plot.width/2) +","+ (plot.margin.bottom) +")")  // text is drawn off the screen top left, move down and out and rotate
            .attr("dy", "-1em")
            .style("text-anchor", "middle")
            .text(axisConf.label);
    };

    drawAxisY(){
        var self = this;
        var plot = self.plot;
        var axisConf = this.config.y;
        var axis = self.svgG.selectOrAppend("g."+self.prefixClass('axis-y')+"."+self.prefixClass('axis')+(self.config.guides ? '' : '.'+self.prefixClass('no-guides')));

        var axisT = axis;
        if (self.config.transition) {
            axisT = axis.transition().ease("sin-in-out");
        }

        axisT.call(plot.y.axis);

        axis.selectOrAppend("text."+self.prefixClass('label'))
            .attr("transform", "translate("+ -plot.margin.left +","+(plot.height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(axisConf.label);
    };


    drawHistogram() {
        var self = this;
        var plot = self.plot;

        console.log(plot.histogramBins, plot.height);
        var barClass = this.prefixClass("bar");
        var bar = self.svgG.selectAll("."+barClass)
            .data(plot.histogramBins);

        bar.enter().append("g")
            .attr("class", barClass)
            .append("rect")
            .attr("x", 1);

        bar.attr("transform", function(d) { return "translate(" + plot.x.scale(d.x) + "," + (plot.y.scale(d.y)) + ")"; });
        var barRect = bar.select("rect");

        var barRectT = barRect;
        if (self.config.transition) {
            barRectT = barRect.transition();
        }

        barRectT
            .attr("width",  plot.x.scale(plot.histogramBins[0].dx) - plot.x.scale(0)- 1)
            .attr("height", d =>   plot.height - plot.y.scale(d.y));

        if (plot.tooltip) {
            bar.on("mouseover", d => {
                plot.tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                plot.tooltip.html(d.y)
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            }).on("mouseout", d => {
                plot.tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
        }

        bar.exit().remove();
    }

    update(newData){
        super.update(newData);
        this.drawAxisX();
        this.drawAxisY();

        this.drawHistogram();
        
        this.updateLegend();
    };


    updateLegend() {

    }



}
