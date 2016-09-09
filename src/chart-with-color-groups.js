import {Chart, ChartConfig} from "./chart";
import {Utils} from './utils'
import {Legend} from "./legend";

export class ChartWithColorGroupsConfig extends ChartConfig{

    showLegend=true;
    legend={
        width: 80,
        margin: 10,
        shapeWidth: 20
    };
    groups={
        key: 2,
        value: (d) => d[this.groups.key]  , // grouping value accessor,
        label: ""
    };
    color =  function(d) {return this.groups ? this.groups.value(d, this.groups.key) : ''};// string or function returning color's value for color scale
    d3ColorCategory= 'category10';

    constructor(custom){
        super();
        if(custom){
            Utils.deepExtend(this, custom);
        }

    }
}

export class ChartWithColorGroups extends Chart{
    constructor(placeholderSelector, data, config) {
        super(placeholderSelector, data, new ChartWithColorGroupsConfig(config));
    }

    setConfig(config){
        return super.setConfig(new ChartWithColorGroupsConfig(config));
    }

    initPlot(){
        super.initPlot();
        var self=this;

        var conf = this.config;
        console.log(conf);
        this.plot.showLegend = conf.showLegend;
        if(this.plot.showLegend){
            this.plot.margin.right = conf.margin.right + conf.legend.width+conf.legend.margin*2;
        }
        this.setupGroups();
        this.plot.data = this.getDataToPlot();
        return this;
    }

    isGroupingEnabled(){
        return this.config.groups && this.config.groups.value;
    }

    setupGroups() {
        var self=this;
        var conf = this.config;

        this.plot.groupingEnabled = this.isGroupingEnabled();
        if(this.plot.groupingEnabled){
            this.plot.groupValue = d => conf.groups.value.call(conf, d);
        }else{
            this.plot.groupValue = d => null;
        }

        if(conf.d3ColorCategory){
            this.plot.colorCategory = d3.scale[conf.d3ColorCategory]();
        }
        var colorValue = conf.color;
        if (colorValue && typeof colorValue === 'string' || colorValue instanceof String){
            this.plot.color = colorValue;
        }else if(this.plot.colorCategory){
            self.plot.colorValue=colorValue;
            if(this.plot.groupingEnabled){

                var domain = Object.getOwnPropertyNames(d3.map(this.data, d => this.plot.groupValue(d))['_']);
                self.plot.colorCategory.domain(domain);
            }
            this.plot.color = d =>  self.plot.colorCategory(self.plot.colorValue.call(conf,d));
        }
    }

    getDataToPlot(){
        if(!this.enabledGroups){
            return this.data;
        }
        return this.data.filter(d => this.enabledGroups.indexOf(this.plot.groupValue(d))>-1);
    }



    update(newData){
        super.update(newData);
        this.updateLegend();

        return this;
    };

    updateLegend() {

        var self =this;
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

        plot.legendColor = plot.legend.color()
            .shapeWidth(this.config.legend.shapeWidth)
            .orient('vertical')
            .scale(scale);


        plot.legendColor.on('cellclick', c=> self.onLegendCellClick(c));
        
        plot.legend.container
            .call(plot.legendColor);
    }

    onLegendCellClick(cellValue){
        this.updateEnabledGroups(cellValue);

        var isDisabled = this.enabledGroups.indexOf(cellValue)<0;
        this.plot.legend.container.selectAll("g.cell").each(function(cell){
            if(cell == cellValue){
                d3.select(this).classed("odc-disabled", isDisabled);
            }
        });

        this.init();
    }

    updateEnabledGroups(cellValue) {
        if (!this.enabledGroups) {
            this.enabledGroups = this.plot.colorCategory.domain().slice();
        }
        var index = this.enabledGroups.indexOf(cellValue);

        if (index < 0) {
            this.enabledGroups.push(cellValue);
        } else {
            this.enabledGroups.splice(index, 1);
        }
    }

    setData(data){
        super.setData(data);
        this.enabledGroups = null;
        return this;
    }
}
