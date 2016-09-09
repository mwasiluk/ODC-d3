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
        scale: "linear"
    };
    y={// Y axis config
        label: 'Y', // axis label,
        key: 1,
        value: (d, key) => d[key], // y value accessor
        orient: "left",
        scale: "linear"
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
        var data = this.plot.data;
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
        y.map = d => y.scale(y.value(d));
        y.axis = d3.svg.axis().scale(y.scale).orient(conf.orient);

        if(this.config.guides){
            y.axis.tickSize(-plot.width);
        }


        var data = this.plot.data;
        plot.y.scale.domain([d3.min(data, plot.y.value)-1, d3.max(data, plot.y.value)+1]);
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
        var dotClass = self.prefixClass('dot');
        self.dotsContainerClass = self.prefixClass('dots-container');

        var dotsContainer = self.svgG.selectOrAppend("g." + self.dotsContainerClass);

        var dots = dotsContainer.selectAll('.' + dotClass)
            .data(data);

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
                var group = self.config.groups ?  self.config.groups.value(d, self.config.groups.key) : null;
                if (group || group === 0) {
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

        if (plot.color) {
            dots.style("fill", plot.color)
        }

        dots.exit().remove();
    }
}
