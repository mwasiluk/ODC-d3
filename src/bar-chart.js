import {Chart, ChartConfig} from "./chart";
import {Utils} from './utils'
import {Legend} from "./legend";

export class BarChartConfig extends ChartConfig{

    svgClass= this.cssClassPrefix+'bar-chart';
    showLegend=true;
    showTooltip =true;
    legend={
        width: 80,
        margin: 10,
        shapeWidth: 20
    };
    x={// X axis config
        label: '', // axis label
        key: 0,
        value: (d, key) => Utils.isNumber(d) ? d : d[key], // x value accessor
        scale: "ordinal",
        ticks: undefined,
    };
    y={// Y axis config
        key: 1,
        value: (d, key) => Utils.isNumber(d) ? d : d[key], // x value accessor
        label: '', // axis label,
        orient: "left",
        scale: "linear"
    };
    groups={
        key: 1,
        value: (d) => d[this.groups.key] , // grouping value accessor,
        label: ""
    };
    color = undefined // string or function returning color's value for color scale
    d3ColorCategory= 'category10';
    transition= true;

    constructor(custom){
        super();
        var config = this;

        if(custom){
            Utils.deepExtend(this, custom);
        }

    }
}

export class BarChart extends Chart{
    constructor(placeholderSelector, data, config) {
        super(placeholderSelector, data, new BarChartConfig(config));
    }

    setConfig(config){
        return super.setConfig(new BarChartConfig(config));
    }

    initPlot(){
        super.initPlot();
        var self=this;

        var conf = this.config;

        this.plot.x={};
        this.plot.y={};

        this.plot.showLegend = conf.showLegend;
        if(this.plot.showLegend){
            this.plot.margin.right = conf.margin.right + conf.legend.width+conf.legend.margin*2;
        }


        this.computePlotSize();
        this.setupY();
        this.setupX();
        this.setupGroupStacks();


        this.setupYDomain();


        if(conf.d3ColorCategory){
            this.plot.colorCategory = d3.scale[conf.d3ColorCategory]();
        }
        var colorValue = conf.color;
        if (colorValue && typeof colorValue === 'string' || colorValue instanceof String){
            this.plot.color = colorValue;
        }else if(this.plot.colorCategory){
            this.plot.color = d =>  self.plot.colorCategory(d.key);
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
        x.scale = d3.scale.ordinal().rangeRoundBands([0, plot.width], .08);
        x.map = d => x.scale(x.value(d));

        x.axis = d3.svg.axis().scale(x.scale).orient(conf.orient);

        var data = this.data;
        var domain;
        if(!this.config.series){
            domain = d3.map(data, x.value).keys();
        }else{
            domain = d3.map(data[0].values, x.value).keys();
        }

        plot.x.scale.domain(domain);
        console.log(' plot.x.scale.domain', plot.x.scale.domain());
        
    };

    setupY (){

        var plot = this.plot;
        var y = plot.y;
        var conf = this.config.y;
        y.value = d => conf.value(d, conf.key);
        y.scale = d3.scale[conf.scale]().range([plot.height, 0]);
        y.map = d => y.scale(y.value(d));

        y.axis = d3.svg.axis().scale(y.scale).orient(conf.orient);
        if(conf.ticks){
            y.axis.ticks(conf.ticks);
        }
    };

    setupYDomain() {
        var plot = this.plot;
        var data = this.data;
        var domain;
        var yStackMax = d3.max(plot.layers, layer => d3.max(layer.values, d => d.y0 + d.y));
        if(!this.config.series){
            domain = [d3.min(data, plot.y.value), d3.max(data, plot.y.value)];
        }else{

            // var min = d3.min(data, s=>d3.min(s.values, plot.y.value));
            var max = yStackMax;
            domain = [0, max];
        }
        plot.y.scale.domain(domain);
        console.log(' plot.y.scale.domain', plot.y.scale.domain());
    }
    groupData(){
        var self=this;
        this.plot.groupingEnabled = this.config.series;
        var data = this.data;
        if(!this.plot.groupingEnabled ){
            this.plot.groupedData =  [{
                key: 'root',
                values: self.mapToPoints(data)
            }];
        }else{

            this.plot.groupedData =  data.map(s=>{
                return{
                    key: s.key,
                    values: self.mapToPoints(s.values)
                }
            });

        }
    }
    setupGroupStacks() {
        var self=this;
        this.groupData();

        this.plot.stack = d3.layout.stack().values(d=>d.values);
        this.plot.layers = this.plot.stack(this.plot.groupedData);

    }

    mapToPoints(values){
        var plot = this.plot;
        return values.map(v=>{
            return {
                x: plot.x.value(v),
                y: plot.y.value(v),
            }
        })
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


    drawBars() {
        var self = this;
        var plot = self.plot;

        console.log(plot.layers);

        var layerClass = this.prefixClass("layer");

        var barClass = this.prefixClass("bar");
        var layer = self.svgG.selectAll("."+layerClass)
            .data(plot.layers);

        layer.enter().append("g")
            .attr("class", layerClass);

        var bar = layer.selectAll("."+barClass)
            .data(d => d.values);

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

        var yDomain = plot.y.scale.domain();
        barT.attr("transform", function(d) { return "translate(" + plot.x.scale(d.x) + "," + (plot.y.scale(d.y0+d.y )) + ")"; });

        barRectT
            .attr("width",  plot.x.scale.rangeBand())
            .attr("height", d =>   plot.y.scale(d.y0 ) - plot.y.scale(d.y0 + d.y - yDomain[0]));


        if(this.plot.color){
            layerT
                .attr("fill", this.plot.color);
        }

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
        layer.exit().remove();
        bar.exit().remove();
    }

    update(newData){
        super.update(newData);
        this.drawAxisX();
        this.drawAxisY();

        this.drawBars();

        this.updateLegend();
    };


    updateLegend() {
        var plot = this.plot;

        var scale = plot.colorCategory;
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