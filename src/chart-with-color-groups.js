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
        value: function(d) { return d[this.groups.key]}  , // grouping value accessor,
        label: ""
    };
    series = false;
    color =  undefined;// string or function returning color's value for color scale
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
       
        this.plot.showLegend = conf.showLegend;
        if(this.plot.showLegend){
            this.plot.margin.right = conf.margin.right + conf.legend.width+conf.legend.margin*2;
        }
        this.setupGroups();
        this.plot.data = this.getDataToPlot();
        this.groupData();
        return this;
    }

    isGroupingEnabled(){
        return this.config.series || !!(this.config.groups && this.config.groups.value);
    }

    setupGroups() {
        var self=this;
        var conf = this.config;

        this.plot.groupingEnabled = this.isGroupingEnabled();
        if(this.plot.groupingEnabled){
            if(this.config.series){
                this.plot.groupValue = s => s.key;
            }else{
                this.plot.groupValue = d => conf.groups.value.call(conf, d);
            }

        }else{
            this.plot.groupValue = d => null;
        }

        if(conf.d3ColorCategory){
            this.plot.colorCategory = d3.scale[conf.d3ColorCategory]();
        }
        var colorValue = conf.color;
        if (colorValue && typeof colorValue === 'string' || colorValue instanceof String){
            this.plot.color = colorValue;
            this.plot.seriesColor = this.plot.color;
        }else if(this.plot.colorCategory){
            self.plot.colorValue=colorValue;
            if(this.plot.groupingEnabled){

                var domain = Object.getOwnPropertyNames(d3.map(this.data, d => this.plot.groupValue(d))['_']);

                self.plot.colorCategory.domain(domain);
            }

            this.plot.seriesColor = s =>  self.plot.colorCategory(s.key);
            this.plot.color = d =>  self.plot.colorCategory(this.plot.groupValue(d));
            
        }
    }

    groupData(){
        var self=this;
        var data = this.plot.data;
        if(!this.plot.groupingEnabled ){
            this.plot.groupedData =  [{
                key: null,
                label: '',
                values: data
            }];
            this.plot.dataLength = data.length;
        }else{

            if(this.config.series){
                this.plot.groupedData =  data.map(s=>{
                    return{
                        key: s.key,
                        label: s.label,
                        values: s.values
                    }
                });
            }else{
                this.plot.groupedData = d3.nest().key(this.plot.groupValue).entries(data);
            }

            console.log(this.plot.groupingEnabled,this.plot.groupedData);

            this.plot.dataLength = d3.sum(this.plot.groupedData, s=>s.values.length);
        }


    }

    getDataToPlot(){
        if(!this.plot.groupingEnabled || !this.enabledGroups){
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

        this.updateLegendCellStatuses();
    }

    onLegendCellClick(cellValue){
        this.updateEnabledGroups(cellValue);
        this.init();
    }
    updateLegendCellStatuses() {
        var self = this;
        this.plot.legend.container.selectAll("g.cell").each(function(cell){
            var isDisabled = self.enabledGroups && self.enabledGroups.indexOf(cell)<0;
            d3.select(this).classed("odc-disabled", isDisabled);
        });
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
