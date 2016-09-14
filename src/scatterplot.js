import {ChartWithColorGroups, ChartWithColorGroupsConfig} from "./chart-with-color-groups";
import {Utils} from './utils'
import {Legend} from "./legend";

export class ScatterPlotConfig extends ChartWithColorGroupsConfig{

    svgClass= this.cssClassPrefix+'scatterplot';
    guides= false; //show axis guides
    showTooltip= true; //show tooltip on dot hover

    x={// X axis config
        label: 'X', // axis label
        key: 0,
        value: (d, key) => d[key], // x value accessor
        orient: "bottom",
        scale: "linear",
        domainMargin: 0.05
    };
    y={// Y axis config
        label: 'Y', // axis label,
        key: 1,
        value: (d, key) => d[key], // y value accessor
        orient: "left",
        scale: "linear",
        domainMargin: 0.05
    };
    groups={
        key: 2
    };
    dotRadius = 2;
    transition= true;

    constructor(custom){
        super();



        if(custom){
            Utils.deepExtend(this, custom);
        }

    }
}

export class ScatterPlot extends ChartWithColorGroups{
    constructor(placeholderSelector, data, config) {
        super(placeholderSelector, data, new ScatterPlotConfig(config));
    }

    setConfig(config){
        return super.setConfig(new ScatterPlotConfig(config));
    }

    initPlot(){
        super.initPlot();
        var self=this;

        var conf = this.config;

        this.plot.x={};
        this.plot.y={};

        this.computePlotSize();
        this.setupX();
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
        var data = this.plot.groupedData;


        var domain = [parseFloat(d3.min(data, s=>d3.min(s.values, plot.x.value))), parseFloat(d3.max(data, s=>d3.max(s.values, plot.x.value)))];
        var margin = (domain[1]-domain[0])* conf.domainMargin;
        domain[0]-=margin;
        domain[1]+=margin;
        plot.x.scale.domain(domain);
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
        y.map = d => y.scale(y.value(d));
        y.axis = d3.svg.axis().scale(y.scale).orient(conf.orient);

        if(this.config.guides){
            y.axis.tickSize(-plot.width);
        }


        var data = this.plot.groupedData;

        var domain = [parseFloat(d3.min(data, s=>d3.min(s.values, plot.y.value))), parseFloat(d3.max(data, s=>d3.max(s.values, plot.y.value)))];
        var margin = (domain[1]-domain[0])* conf.domainMargin;
        domain[0]-=margin;
        domain[1]+=margin;
        plot.y.scale.domain(domain);
        // plot.y.scale.domain([d3.min(data, plot.y.value)-1, d3.max(data, plot.y.value)+1]);
    };

    drawAxisX(){
        var self = this;
        var plot = self.plot;
        var axisConf = this.config.x;
        var axis = self.svgG.selectOrAppend("g."+self.prefixClass('axis-x')+"."+self.prefixClass('axis')+(self.config.guides ? '' : '.'+self.prefixClass('no-guides')))
            .attr("transform", "translate(0," + plot.height + ")");
        
        var axisT = axis;
        if (self.transitionEnabled()) {
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
        if (self.transitionEnabled()) {
            axisT = axis.transition().ease("sin-in-out");
        }

        axisT.call(plot.y.axis);

        axis.selectOrAppend("text."+self.prefixClass('label'))
            .attr("transform", "translate("+ -plot.margin.left +","+(plot.height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(axisConf.label);
    };

    update(newData){
        super.update(newData);
        this.drawAxisX();
        this.drawAxisY();

        this.updateDots();
    };

    updateDots() {
        var self = this;
        var plot = self.plot;
        var data = plot.data;
        var layerClass = self.prefixClass('layer');
        var dotClass = self.prefixClass('dot');
        self.dotsContainerClass = self.prefixClass('dots-container');

        var dotsContainer = self.svgG.selectOrAppend("g." + self.dotsContainerClass);

        var layer = dotsContainer.selectAll("g."+layerClass).data(plot.groupedData);

        layer.enter().appendSelector("g."+layerClass);

        var dots = layer.selectAll('.' + dotClass)
            .data(d=>d.values);

        dots.enter().append("circle")
            .attr("class", dotClass);

        var dotsT = dots;
        if (self.transitionEnabled()) {
            dotsT = dots.transition();
        }

        dotsT.attr("r", self.config.dotRadius)
            .attr("cx", plot.x.map)
            .attr("cy", plot.y.map);

        if (plot.tooltip) {
            dots.on("mouseover", d => {
                plot.tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                var html = "(" + plot.x.value(d) + ", " + plot.y.value(d) + ")";
                var group = self.config.groups ?  self.config.groups.value.call(self.config,d) : null;
                if (group || group === 0) {
                    group = plot.groupToLabel[group];
                    html += "<br/>";
                    var label = self.config.groups.label;
                    if (label) {
                        html += label + ": ";
                    }
                    html += group
                }
                plot.tooltip.html(html)
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
                .on("mouseout", d => {
                    plot.tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
        }

        if (plot.seriesColor) {
            layer.style("fill", plot.seriesColor)
        }else if(plot.color){
            dots.style("fill", plot.color)
        }

        dots.exit().remove();
        layer.exit().remove();
    }
}
