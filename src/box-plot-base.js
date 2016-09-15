import {Chart, ChartConfig} from "./chart";
import {Utils} from './utils'

export class BoxPlotBaseConfig extends ChartConfig{

    svgClass = this.cssClassPrefix + 'box-plot';
    showLegend = true;
    showTooltip = true;
    x = {// X axis config
        title: '', // axis label
        value: s => s.key, // x value accessor
        guides: false, //show axis guides
        scale: "ordinal"

    };
    y = {// Y axis config
        title: '',
        value: d => d, // y value accessor
        scale: "linear",
        orient: 'left',
        domainMargin: 0.1,
        guides: true //show axis guides
    };
    Q1 = d => d.values.Q1;
    Q2 = d => d.values.Q2;
    Q3 = d => d.values.Q3;
    Wl = d => d.values.whiskerLow;
    Wh = d => d.values.whiskerHigh;
    outliers= d=> d.values.outliers;
    outlierValue = (d,i)=> d;
    outlierLabel = (d,i)=> d;
    minBoxWidth = 35;
    maxBoxWidth = 100;

    transition = true;
    color =  undefined;// string or function returning color's value for color scale
    d3ColorCategory= 'category10';

    constructor(custom){
        super();
        if(custom){
            Utils.deepExtend(this, custom);
        }

    }
}

export class BoxPlotBase extends Chart{
    constructor(placeholderSelector, data, config) {
        super(placeholderSelector, data, new BoxPlotBaseConfig(config));
    }

    setConfig(config){
        return super.setConfig(new BoxPlotBaseConfig(config));
    }

    initPlot(){
        super.initPlot();
        super.computePlotSize();
        this.plot.x = {};
        this.plot.y = {};

        this.plot.data = this.getDataToPlot();
        this.setupY();
        this.setupX();

        this.setupColor();

    }

    getDataToPlot() {
        return this.data;
    }

    setupX() {

        var plot = this.plot;
        var x = plot.x;
        var conf = this.config.x;

        x.value = conf.value;
        x.scale = d3.scale.ordinal().rangeRoundBands([0, plot.width], .08);
        x.map = d => x.scale(x.value(d));

        x.axis = d3.svg.axis().scale(x.scale).orient(conf.orient);
        if(conf.guides){
            x.axis.tickSize(-plot.height);
        }

        var data = this.plot.data;
        var domain;
        if (!data || !data.length) {
            domain = [];
        } else {
            domain = data.map(x.value);
        }

        plot.x.scale.domain(domain);

    };

    setupY() {

        var plot = this.plot;
        var y = plot.y;
        var conf = this.config.y;
        y.value = d => conf.value.call(this.config, d);
        y.scale = d3.scale[conf.scale]().range([plot.height, 0]);
        y.map = d => y.scale(y.value(d));

        y.axis = d3.svg.axis().scale(y.scale).orient(conf.orient);
        if (conf.ticks) {
            y.axis.ticks(conf.ticks);
        }
        if(conf.guides){
            y.axis.tickSize(-plot.width);
        }
        this.setupYDomain();
    };

    setupYDomain() {
        var plot = this.plot;
        var data = this.plot.data;
        var c = this.config;

        var values = [], yMin, yMax;
        data.forEach(function (d, i) {
            let q1 = c.Q1(d), 
                q3 = c.Q3(d), 
                wl = c.Wl(d), 
                wh = c.Wh(d),
                outliers = c.outliers(d);
            
            if (outliers) {
                outliers.forEach(function (o, i) {
                    values.push(c.outlierValue(o, i));
                });
            }
            if (wl) { values.push(wl) }
            if (q1) { values.push(q1) }
            if (q3) { values.push(q3) }
            if (wh) { values.push(wh) }
        });
        yMin = d3.min(values);
        yMax = d3.max(values);
        var margin = (yMax-yMin)* this.config.y.domainMargin;
        yMin-=margin;
        yMax+=margin;
        var domain = [ yMin, yMax ] ;

        plot.y.scale.domain(domain);
    }

    drawAxisX() {
        var self = this;
        var plot = self.plot;
        var axisConf = this.config.x;
        var axis = self.svgG.selectOrAppend("g." + self.prefixClass('axis-x') + "." + self.prefixClass('axis') + (axisConf.guides ? '' : '.' + self.prefixClass('no-guides')))
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

    drawAxisY() {
        var self = this;
        var plot = self.plot;
        var axisConf = this.config.y;
        var axis = self.svgG.selectOrAppend("g." + self.prefixClass('axis-y') + "." + self.prefixClass('axis') + (axisConf.guides ? '' : '.' + self.prefixClass('no-guides')));

        var axisT = axis;
        if (self.config.transition) {
            axisT = axis.transition().ease("sin-in-out");
        }

        axisT.call(plot.y.axis);

        axis.selectOrAppend("text." + self.prefixClass('label'))
            .attr("transform", "translate(" + -plot.margin.left + "," + (plot.height / 2) + ")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(axisConf.title);
    };

    drawBoxPlots() {
        var self = this,
            plot = self.plot,
            config = self.config,
            boxplotClass = self.prefixClass("boxplot-item")
        
        var boxplots = self.svgG.selectAll('.'+boxplotClass).data(plot.data);
        var boxplotEnter = boxplots.enter()
            .append('g')
            .attr('class', boxplotClass)
            .style('stroke-opacity', 1e-6)
            .style('fill-opacity', 1e-6);

        var duration = 1000;
        var boxplotsT = boxplots;
        if (self.transitionEnabled()) {
            boxplotsT = boxplots.transition();
            boxplotsT.delay(function(d,i) { return i * duration / plot.data.length })
        }

        boxplotsT
            .style('fill', plot.color)
            .style('stroke-opacity', 1)
            .style('fill-opacity', 0.75)
            .attr('transform', (d,i) =>'translate(' + (plot.x.map(d,i) + plot.x.scale.rangeBand() * 0.05) + ', 0)')
        boxplots.exit().remove();


        var boxWidth = !config.maxBoxWidth ? plot.x.scale.rangeBand() * 0.9 : Math.min(config.maxBoxWidth, Math.max(config.minBoxWidth, plot.x.scale.rangeBand() * 0.9));
        var boxLeft  = plot.x.scale.rangeBand() * 0.45 - boxWidth/2;
        var boxRight = plot.x.scale.rangeBand() * 0.45 + boxWidth/2;

        var boxClass = self.prefixClass("box");

        boxplotEnter.append('rect')
            .attr('class', boxClass)
            // tooltip events
            .on('mouseover', function(d,i) {
                d3.select(this).classed('hover', true);
                var html = 'Q3: '+config.Q3(d,i)+'<br/>Q2: '+config.Q2(d,i)+'<br/>Q1: '+config.Q1(d,i);
                self.showTooltip(html)
            })
            .on('mouseout', function(d,i) {
                d3.select(this).classed('hover', false);
                self.hideTooltip();
            });

        var boxRects = boxplots.select('rect.'+boxClass);

        var boxRectsT = boxRects;
        if (self.config.transition) {
            boxRectsT = boxRects.transition();
        }

        boxRectsT.attr('y', (d,i) => plot.y.scale(config.Q3(d)))
            .attr('width', boxWidth)
            .attr('x', boxLeft )
            .attr('height', (d,i) => Math.abs(plot.y.scale(config.Q3(d)) - plot.y.scale(config.Q1(d))) || 1)
            .style('stroke', plot.color);

        // median line
        var medianClass = self.prefixClass('median');
        boxplotEnter.append('line').attr('class', medianClass);

        boxplots.select('line.'+medianClass)
            .attr('x1', boxLeft)
            .attr('y1', (d,i) => plot.y.scale(config.Q2(d)))
            .attr('x2', boxRight)
            .attr('y2', (d,i) => plot.y.scale(config.Q2(d)));


        //whiskers

        var whiskerClass= self.prefixClass("whisker"),
            tickClass = self.prefixClass("boxplot-tick");

        var whiskers = [{key: 'low', value: config.Wl}, {key: 'high', value: config.Wh}];

        boxplotEnter.each(function(d,i) {
            var box = d3.select(this);

            whiskers.forEach(f=> {
                if (f.value(d)) {
                    box.append('line')
                        .style('stroke', plot.color(d,i))
                        .attr('class', whiskerClass+' ' + boxplotClass+'-'+f.key);
                    box.append('line')
                        .style('stroke', plot.color(d,i))
                        .attr('class', tickClass+' ' + boxplotClass+'-'+f.key);
                }
            });
        });

        whiskers.forEach(f => {
            var endpoint = (f.key === 'low') ? config.Q1 : config.Q3;

            boxplots.select('.'+whiskerClass+'.'+boxplotClass+'-'+f.key)
                .attr('x1', plot.x.scale.rangeBand() * 0.45 )
                .attr('y1', (d,i) => plot.y.scale(f.value(d)))
                .attr('x2', plot.x.scale.rangeBand() * 0.45 )
                .attr('y2', (d,i) => plot.y.scale(endpoint(d)));
            boxplots.select('.'+tickClass+'.'+boxplotClass+'-'+f.key)
                .attr('x1', boxLeft )
                .attr('y1', (d,i) => plot.y.scale(f.value(d)))
                .attr('x2', boxRight )
                .attr('y2', (d,i) => plot.y.scale(f.value(d)));

            boxplotEnter.selectAll('.'+boxplotClass+'-'+f.key)
                .on('mouseover', function(d,i,j) {
                    d3.select(this).classed('hover', true);
                    self.showTooltip(f.value(d))
                })
                .on('mouseout', function(d,i,j) {
                    d3.select(this).classed('hover', false);
                    self.hideTooltip();
                })
        });


        // outliers
        var outlierClass = self.prefixClass("outlier");
        var outliers = boxplots.selectAll('.'+outlierClass).data((d,i) => config.outliers(d,i) || []);

        var outlierEnterCircle = outliers.enter().append('circle')
            .attr('class', outlierClass)
            .style('z-index', 9000);

        outlierEnterCircle
            .on('mouseover', function (d, i, j) {
                d3.select(this).classed('hover', true);
                self.showTooltip(config.outlierLabel(d,i))
            })
            .on('mouseout', function (d, i, j) {
                d3.select(this).classed('hover', false);
                self.hideTooltip();
            });

        var outliersT = outliers;
        if (self.config.transition) {
            outliersT = outliers.transition();
        }
        outliersT
            .attr('cx', plot.x.scale.rangeBand() * 0.45)
            .attr('cy', (d,i) => plot.y.scale(config.outlierValue(d,i)))
            .attr('r', '3');
        outliers.exit().remove();


    }

    update(newData){
        super.update(newData);
        this.drawAxisX();
        this.drawAxisY();
        this.drawBoxPlots();
        return this;
    };

    setupColor() {
        var self=this;
        var conf = this.config;

        if(conf.d3ColorCategory){
            this.plot.colorCategory = d3.scale[conf.d3ColorCategory]();
        }
        var colorValue = conf.color;
        if (colorValue && typeof colorValue === 'string' || colorValue instanceof String){
            this.plot.color = colorValue;
        }else if(this.plot.colorCategory){
            self.plot.colorValue=colorValue;
            this.plot.color = d =>  self.plot.colorCategory(this.plot.x.value(d));
        }
    }
}
