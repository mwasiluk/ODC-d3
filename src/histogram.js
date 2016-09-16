import {ChartWithColorGroups, ChartWithColorGroupsConfig} from "./chart-with-color-groups";
import {Utils} from './utils'

export class HistogramConfig extends ChartWithColorGroupsConfig{

    svgClass= this.cssClassPrefix+'histogram';
    showLegend=true;
    showTooltip =true;
    x={// X axis config
        label: '', // axis label
        key: 0,
        value: (d, key) => Utils.isNumber(d) ? d : parseFloat(d[key]), // x value accessor
        scale: "linear",
        ticks: undefined,
    };
    y={// Y axis config
        label: '', // axis label,
        orient: "left",
        scale: "linear"
    };
    frequency=true;
    groups={
        key: 1
    };
    transition= true;

    constructor(custom){
        super();

        if(custom){
            Utils.deepExtend(this, custom);
        }

    }
}

export class Histogram extends ChartWithColorGroups{
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
        
        this.computePlotSize();
        
        this.setupX();
        this.setupHistogram();
        this.setupGroupStacks();
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
        var data = this.plot.groupedData;
        plot.x.scale.domain([d3.min(data, s=>d3.min(s.values, plot.x.value)), d3.max(data, s=>d3.max(s.values, plot.x.value))]);
        
    };

    setupY (){

        var plot = this.plot;
        var y = plot.y;
        var conf = this.config.y;
        y.scale = d3.scale[conf.scale]().range([plot.height, 0]);

        y.axis = d3.svg.axis().scale(y.scale).orient(conf.orient);
        var data = this.plot.data;
        var yStackMax = d3.max(plot.stackedHistograms, layer => d3.max(layer.histogramBins, d => d.y0 + d.y));
        plot.y.scale.domain([0, yStackMax]);

    };


    setupHistogram() {
        var plot = this.plot;
        var x = plot.x;
        var y = plot.y;
        var ticks = this.config.x.ticks ? x.scale.ticks(this.config.x.ticks) : x.scale.ticks();

        plot.histogram = d3.layout.histogram().frequency(this.config.frequency)
            .value(x.value)
            .bins(ticks);
    }

    setupGroupStacks() {
        var self=this;
        console.log(this.plot.groupedData);
        this.plot.stack = d3.layout.stack().values(d=>d.histogramBins);
        this.plot.groupedData.forEach(d=>{
            d.histogramBins = this.plot.histogram.frequency(this.config.frequency || this.plot.groupingEnabled)(d.values);
            console.log(d.histogramBins);
            if(!this.config.frequency && this.plot.groupingEnabled){
                d.histogramBins.forEach(b => {
                    b.dy = b.dy/this.plot.dataLength
                    b.y = b.y/this.plot.dataLength
                });
            }
        });
        this.plot.stackedHistograms = this.plot.stack(this.plot.groupedData);
    }

    drawAxisX(){
        var self = this;
        var plot = self.plot;
        var axisConf = this.config.x;
        var axis = self.svgG.selectOrAppend("g."+self.prefixClass('axis-x')+"."+self.prefixClass('axis')+(self.config.guides ? '' : '.'+self.prefixClass('no-guides')))
            .attr("transform", "translate(0," + plot.height + ")");

        var axisT = axis;
        if (self.config.transition) {
            axisT = axis.transition().ease(d3.easeSinInOut);
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
            axisT = axis.transition().ease(d3.easeSinInOut);
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
        
        var layerClass = this.prefixClass("layer");

        var barClass = this.prefixClass("bar");
        var layer = self.svgG.selectAll("."+layerClass)
            .data(plot.stackedHistograms);

        layer.enter().append("g")
            .attr("class", layerClass);

        var bar = layer.selectAll("."+barClass)
            .data(d => d.histogramBins);

        bar.enter().append("g")
            .attr("class", barClass)
            .append("rect")
            .attr("x", 1);


        var barRect = bar.select("rect");

        var barRectT = barRect;
        var barT = bar;
        var layerT = layer;
        if (this.transitionEnabled()) {
            barRectT = barRect.transition();
            barT = bar.transition();
            layerT= layer.transition();
        }

        barT.attr("transform", function(d) { return "translate(" + plot.x.scale(d.x) + "," + (plot.y.scale(d.y0 +d.y)) + ")"; });

        var dx = plot.stackedHistograms.length ? (plot.stackedHistograms[0].histogramBins.length ?  plot.x.scale(plot.stackedHistograms[0].histogramBins[0].dx) : 0) : 0;
        barRectT
            .attr("width",  dx - plot.x.scale(0)- 1)
            .attr("height", d =>   plot.height - plot.y.scale(d.y));

        if(this.plot.color){
            layerT
                .attr("fill", this.plot.seriesColor);
        }

        if (plot.tooltip) {
            bar.on("mouseover", d => {
                self.showTooltip(d.y);
            }).on("mouseout", d => {
                self.hideTooltip();
            });
        }
        layer.exit().remove();
        bar.exit().remove();
    }

    update(newData){
        super.update(newData);
        this.drawAxisX();
        this.drawAxisY();

        this.drawHistogram();
        return this;
    };
}
