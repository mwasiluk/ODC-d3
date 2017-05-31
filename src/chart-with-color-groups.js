import {Chart, ChartConfig} from "./chart";
import {Utils} from './utils'
import {Legend} from "./legend";
import * as d3 from './d3'

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
        label: "",
        displayValue: undefined // optional function returning display value (series label) for given group value, or object/array mapping value to display value
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
        this.setupGroups();
        this.plot.data = this.getDataToPlot();
        this.groupData();

        if(this.plot.showLegend){
            var scale = this.plot.colorCategory;
            if(!scale.domain() || scale.domain().length<2){
                this.plot.showLegend = false;
            }else{
                this.plot.margin.right = conf.margin.right + conf.legend.width+conf.legend.margin*2;
            }
        }
        return this;
    }

    isGroupingEnabled(){
        return this.config.series || !!(this.config.groups && this.config.groups.value);
    }

    computeGroupColorDomain(){
        var map = d3.set(this.data, d => this.plot.groupValue(d));
        return Object.getOwnPropertyNames(map).map(d=>map[d]);
    }

    setupGroups() {
        var self=this;
        var conf = this.config;

        this.plot.groupingEnabled = this.isGroupingEnabled();
        var domain = [];
        if(this.plot.groupingEnabled){
            self.plot.groupToLabel = {};
            if(this.config.series){
                this.plot.groupValue = s => s.key;
                domain = this.computeGroupColorDomain();

                this.data.forEach(s=>{
                    self.plot.groupToLabel[s.key] = s.label||s.key;
                })
            }else{
                this.plot.groupValue = d => conf.groups.value.call(conf, d);
                domain = this.computeGroupColorDomain();
                var getLabel= k => k;
                if(self.config.groups.displayValue){
                    if(Utils.isFunction(self.config.groups.displayValue)){
                        getLabel = k=>self.config.groups.displayValue(k) || k;
                    }else if(Utils.isObject(self.config.groups.displayValue)){
                        getLabel = k => self.config.groups.displayValue[k] || k;
                    }
                }
                domain.forEach(k=>{
                    self.plot.groupToLabel[k] = getLabel(k);
                })
            }

        }else{
            this.plot.groupValue = d => null;
        }
        this.plot.groupColorDomain = domain;
        if(conf.d3ColorCategory){
            var colorSchemeCategory = 'scheme'+Utils.capitalizeFirstLetter(conf.d3ColorCategory);
            this.plot.colorCategory = d3.scaleOrdinal(d3[colorSchemeCategory]);
        }
        var colorValue = conf.color;

        if (colorValue){
            if(typeof colorValue === 'string' || colorValue instanceof String){
                this.plot.color = colorValue;
                this.plot.seriesColor = this.plot.color;
            }else{
                this.plot.color = colorValue;
                this.plot.seriesColor = this.plot.color;
                var range = domain.map(v=>this.plot.seriesColor({key: v}));
                this.plot.colorCategory = d3.scaleOrdinal(range);
                this.plot.colorCategory.domain(domain);

            }

        }else if(this.plot.colorCategory){
            self.plot.colorValue=colorValue;
            self.plot.colorCategory.domain(domain);

            this.plot.seriesColor = s =>  self.plot.colorCategory(s.key);
            this.plot.color = d =>  self.plot.colorCategory(this.plot.groupValue(d));
            
        }else{
            this.plot.color = this.plot.seriesColor = s=> 'black'
        }

    }

    groupData(){
        var self=this;
        var data = this.plot.data;
        if(!self.plot.groupingEnabled ){
            self.plot.groupedData =  [{
                key: null,
                label: '',
                values: data
            }];
            self.plot.dataLength = data.length;
        }else{

            if(self.config.series){
                self.plot.groupedData =  data.map(s=>{
                    return{
                        key: s.key,
                        label: s.label,
                        values: s.values
                    }
                });
            }else{
                self.plot.groupedData = d3.nest().key(this.plot.groupValue).entries(data);
                self.plot.groupedData.forEach(g => {
                    g.label = self.plot.groupToLabel[g.key];
                });
            }

            self.plot.dataLength = d3.sum(this.plot.groupedData, s=>s.values.length);
        }

        // this.plot.seriesColor

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
            .scale(scale)
            .labelWrap(this.config.legend.width)
            .labels(scale.domain().map(v=>plot.groupToLabel[v]));


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

        if (!this.enabledGroups.length) {
            this.enabledGroups = this.plot.colorCategory.domain().slice();
        }

    }

    setData(data){
        super.setData(data);
        this.enabledGroups = null;
        return this;
    }
}
