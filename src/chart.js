import {Utils} from './utils'

export class ChartConfig{
    cssClassPrefix = "odc-";
    svgClass = 'mw-d3-chart';
    width = undefined;
    height =  undefined;
    margin ={
        left: 50,
        right: 30,
        top: 30,
        bottom: 50
    };
    tooltip = false;
    constructor(custom){
        if(custom){
            Utils.deepExtend(this, custom);
        }
    }


}

export class Chart{
    constructor(placeholderSelector, data, config) {

        this.utils = Utils;
        this.placeholderSelector = placeholderSelector;
        this.svg=null;
        this.config = undefined;
        this.plot={
            margin:{}
        };


        this.setConfig(config);

        if(data){
            this.setData(data);
        }

        this.init();
    }

    setConfig(config){
        if(!config){
            this.config = new ChartConfig();
        }else{
            this.config = config;
        }

        return this;
    }

    setData(data){
        this.data = data;
        return this;
    }

    init(){
        var self = this;
        self.initPlot();
        self.initSvg();
        self.draw();
    }

    initSvg(){
        var self = this;
        var config = this.config;
        console.log(config.svgClass);

        var width = self.plot.width+ config.margin.left + config.margin.right;
        var height =  self.plot.height+ config.margin.top + config.margin.bottom;
        var aspect = width / height;

        self.svg = d3.select(self.placeholderSelector).select("svg");
        if(!self.svg.empty()){
            self.svg.remove();

        }
        self.svg = d3.select(self.placeholderSelector).append("svg");

        self.svg
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", "0 0 "+" "+width+" "+height)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("class", config.svgClass);
        self.svgG = self.svg.append("g")
            .attr("transform", "translate(" + config.margin.left + "," + config.margin.top + ")");

        if(config.tooltip){
            self.plot.tooltip = this.utils.selectOrAppend(d3.select(self.placeholderSelector), 'div.mw-tooltip', 'div')
                .attr("class", "mw-tooltip")
                .style("opacity", 0);
        }

        if(!config.width || config.height ){
            d3.select(window)
                .on("resize", function() {
                    //TODO add responsiveness if width/height not specified
                });
        }
    }

    initPlot(){

    }

    update(data){
        if(data){
            this.setData(data);
        }
        console.log('base uppdate')

    }

    draw(){
        this.update();
    }
}
