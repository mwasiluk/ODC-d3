function D3ScatterPlot(placeholderSelector, data, config){
    this.utils = new ChartsD3Utils();
    this.placeholderSelector = placeholderSelector;
    this.svg=null;
    this.defaultConfig = {
        width: 0,
        height: 0,
        margin:{
            left: 50,
            right: 30,
            top: 30,
            bottom: 50
        },
        x:{// X axis config
            label: 'X', // axis label
            value: function(d) { return d[0] }, // x value accessor
            orient: "bottom",
            scale: "linear"
        },
        y:{// Y axis config
            label: 'Y', // axis label
            value: function(d) { return d[1] }, // y value accessor
            orient: "left",
            scale: "linear"
        },
        dot:{
            radius: 2,
            color: 'black', // string or function returning color's value for color scale
            d3ColorCategory: 'category10'
        }
    };

    if(data){
        this.setData(data);
    }

    if(config){
        this.setConfig(config);
    }

    this.init();

}

D3ScatterPlot.prototype.setData = function (data){
    this.data = data;
    return this;
};

D3ScatterPlot.prototype.setConfig = function (config){
    this.config = this.utils.deepExtend({}, this.defaultConfig, config);
    return this;
};
D3ScatterPlot.prototype.initPlot = function (){
    var self=this;
    var margin = this.config.margin;
    var conf = this.config;
    this.plot={
        x: {},
        y: {},
        dot: {
            color: null//color scale mapping function
        }
    };

    var width = conf.width;
    var placeholderNode = d3.select(this.placeholderSelector).node();

    if(!width){
        width =placeholderNode.getBoundingClientRect().width;
    }
    var height = conf.height;
    if(!height){
        height =placeholderNode.getBoundingClientRect().height;
    }

    this.plot.width = width - margin.left - margin.right;
    this.plot.height = height - margin.top - margin.bottom;

    this.setupX();
    this.setupY();

    if(conf.dot.d3ColorCategory){
        this.plot.dot.colorCategory = d3.scale[conf.dot.d3ColorCategory]();
    }
    var colorValue = conf.dot.color;
    if(colorValue){
        this.plot.dot.colorValue = colorValue;

        if (typeof colorValue === 'string' || colorValue instanceof String){
            this.plot.dot.color = colorValue;
        }else if(this.plot.dot.colorCategory){
            this.plot.dot.color = function(d){
                return self.plot.dot.colorCategory(self.plot.dot.colorValue(d));
            }
        }


    }

    return this;
};

D3ScatterPlot.prototype.setupX = function (){

    var plot = this.plot;
    var x = plot.x;
    var conf = this.config.x;

    /*
     * value accessor - returns the value to encode for a given data object.
     * scale - maps value to a visual display encoding, such as a pixel position.
     * map function - maps from data value to display value
     * axis - sets up axis
     */
    x.value = conf.value;
    x.scale = d3.scale[conf.scale]().range([0, plot.width]);
    x.map = function(d) { return x.scale(x.value(d));};
    x.axis = d3.svg.axis().scale(x.scale).orient(conf.orient);
    var data = this.data;
    plot.x.scale.domain([d3.min(data, plot.x.value)-1, d3.max(data, plot.x.value)+1]);


};

D3ScatterPlot.prototype.setupY = function (){

    var plot = this.plot;
    var y = plot.y;
    var conf = this.config.y;

    /*
     * value accessor - returns the value to encode for a given data object.
     * scale - maps value to a visual display encoding, such as a pixel position.
     * map function - maps from data value to display value
     * axis - sets up axis
     */
    y.value = conf.value;
    y.scale = d3.scale[conf.scale]().range([plot.height, 0]);
    y.map = function(d) { return y.scale(y.value(d));};
    y.axis = d3.svg.axis().scale(y.scale).orient(conf.orient);


    var data = this.data;
    plot.y.scale.domain([d3.min(data, plot.y.value)-1, d3.max(data, plot.y.value)+1]);
};

D3ScatterPlot.prototype.draw = function (){
    this.drawAxisX();
    this.drawAxisY();
    this.update();
};
D3ScatterPlot.prototype.drawAxisX = function (){
    var self = this;
    var plot = self.plot;
    var axisConf = this.config.x;
    self.svgG.append("g")
        .attr("class", "mw-axis mw-axis-x")
        .attr("transform", "translate(0," + plot.height + ")")
        .call(plot.x.axis)
        .append("text")
        .attr("class", "mw-label")
        .attr("transform", "translate("+ (plot.width/2) +","+ (self.config.margin.bottom) +")")  // text is drawn off the screen top left, move down and out and rotate
        .attr("dy", "-1em")
        .style("text-anchor", "middle")
        .text(axisConf.label);
};

D3ScatterPlot.prototype.drawAxisY = function (){
    var self = this;
    var plot = self.plot;
    var axisConf = this.config.y;
    self.svgG.append("g")
        .attr("class", "mw-axis mw-axis-y")
        .call(plot.y.axis)
        .append("text")
        .attr("class", "mw-label")
        .attr("transform", "translate("+ -self.config.margin.left +","+(plot.height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(axisConf.label);
};


D3ScatterPlot.prototype.update = function (){
    var self = this;
    var plot = self.plot;
    var data = this.data;
    var dots = self.svgG.selectAll(".mw-dot")
        .data(data);

    dots.enter().append("circle")
        .attr("class", "mw-dot");


    dots.attr("r", self.config.dot.radius)
        .attr("cx", plot.x.map)
        .attr("cy", plot.y.map);

    if(plot.dot.color){
        dots.style("fill", plot.dot.color)
    }
    dots.exit().remove();

};

D3ScatterPlot.prototype.initSvg = function (){
    var self = this;
    var config = this.config;
    
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
        .attr("class", "mw-d3-scatterplot");
    self.svgG = self.svg.append("g")
        .attr("transform", "translate(" + config.margin.left + "," + config.margin.top + ")");

    if(!config.width || config.height ){
        d3.select(window)
            .on("resize", function() {
                //TODO add responsiveness if width/height not specified
            });
    }

};

D3ScatterPlot.prototype.init = function (){
    var self = this;
    self.initPlot();
    self.initSvg();
    self.draw();

};

