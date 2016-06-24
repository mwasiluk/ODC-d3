function D3ScatterPlotMatrix(placeholderSelector, data, config) {
    this.utils = new ChartsD3Utils();
    this.placeholderSelector = placeholderSelector;
    this.svg = null;
    this.defaultConfig = {
        width: undefined, //svg width (default: computed using cell size and margins)
        size: 200, //scatter plot cell size
        padding: 20, //scatter plot cell padding
        brush: true,
        guides: true, //show axis guides
        tooltip: true, //show tooltip on dot hover
        ticks: undefined, //ticks number, (default: computed using cell size)
        margin: {
            left: 30,
            right: 30,
            top: 30,
            bottom: 30
        },
        x: {// X axis config
            orient: "bottom",
            scale: "linear"
        },
        y: {// Y axis config
            orient: "left",
            scale: "linear"
        },
        dot: {
            radius: 2,
            color: null, // string or function returning color's value for color scale
            d3ColorCategory: 'category10'
        },
        variables: {
            labels: [], //optional array of variable labels (for the diagonal of the plot).
            keys: [], //optional array of variable keys
            value: function (d, variableKey) {// variable value accessor
                return d[variableKey];
            }
        },
        groups:{
            key: undefined, //object property name or array index with grouping variable
            includeInPlot: false //include group as variable in plot, boolean (default: false)
        }

    };


    this.setConfig(config||{});


    if (data) {
        this.setData(data);
    }

    this.init();
}

D3ScatterPlotMatrix.prototype.setData = function (data) {
    this.data = data;


    return this;
};

D3ScatterPlotMatrix.prototype.setConfig = function (config) {
    this.config = this.utils.deepExtend({}, this.defaultConfig, config);
    return this;
};
D3ScatterPlotMatrix.prototype.initPlot = function () {


    var self = this;
    var margin = this.config.margin;
    var conf = this.config;
    this.plot = {
        x: {},
        y: {},
        dot: {
            color: null//color scale mapping function
        }
    };

    this.setupVariables();

    this.plot.size = conf.size;


    var width = conf.width;
    var placeholderNode = d3.select(this.placeholderSelector).node();

    if (!width) {
        var maxWidth = margin.left + margin.right + this.plot.variables.length*this.plot.size;
        width = Math.min(placeholderNode.getBoundingClientRect().width, maxWidth);

    }
    var height = width;
    if (!height) {
        height = placeholderNode.getBoundingClientRect().height;
    }

    this.plot.width = width - margin.left - margin.right;
    this.plot.height = height - margin.top - margin.bottom;




    if(conf.ticks===undefined){
        conf.ticks = this.plot.size / 40;
    }

    this.setupX();
    this.setupY();

    if (conf.dot.d3ColorCategory) {
        this.plot.dot.colorCategory = d3.scale[conf.dot.d3ColorCategory]();
    }
    var colorValue = conf.dot.color;
    if (colorValue) {
        this.plot.dot.colorValue = colorValue;

        if (typeof colorValue === 'string' || colorValue instanceof String) {
            this.plot.dot.color = colorValue;
        } else if (this.plot.dot.colorCategory) {
            this.plot.dot.color = function (d) {
                return self.plot.dot.colorCategory(self.plot.dot.colorValue(d));
            }
        }


    }else if(conf.groups.key){
        this.plot.dot.color = function (d) {
            return self.plot.dot.colorCategory(d[conf.groups.key]);
        }
    }



    return this;

};

D3ScatterPlotMatrix.prototype.setupVariables = function () {
    var variablesConf = this.config.variables;

    var data = this.data;
    var plot = this.plot;
    plot.domainByVariable = {};
    plot.variables = variablesConf.keys;
    if(!plot.variables || !plot.variables.length){
        plot.variables = this.utils.inferVariables(data, this.config.groups.key, this.config.includeInPlot);
    }

    plot.labels = [];
    plot.labelByVariable = {};
    plot.variables.forEach(function(variableKey, index) {
        plot.domainByVariable[variableKey] = d3.extent(data, function(d) { return variablesConf.value(d, variableKey) });
        var label = variableKey;
        if(variablesConf.labels && variablesConf.labels.length>index){

            label = variablesConf.labels[index];
        }
        plot.labels.push(label);
        plot.labelByVariable[variableKey] = label;
    });

    console.log(plot.labelByVariable);

    plot.subplots = [];
};

D3ScatterPlotMatrix.prototype.setupX = function () {

    var plot = this.plot;
    var x = plot.x;
    var conf = this.config;

    x.value = conf.variables.value;
    x.scale = d3.scale[conf.x.scale]().range([conf.padding / 2, plot.size - conf.padding / 2]);
    x.map = function (d, variable) {
        return x.scale(x.value(d, variable));
    };
    x.axis = d3.svg.axis().scale(x.scale).orient(conf.x.orient).ticks(conf.ticks);
    x.axis.tickSize(plot.size * plot.variables.length);

};

D3ScatterPlotMatrix.prototype.setupY = function () {

    var plot = this.plot;
    var y = plot.y;
    var conf = this.config;

    y.value = conf.variables.value;
    y.scale = d3.scale[conf.y.scale]().range([ plot.size - conf.padding / 2, conf.padding / 2]);
    y.map = function (d, variable) {
        return y.scale(y.value(d, variable));
    };
    y.axis= d3.svg.axis().scale(y.scale).orient(conf.y.orient).ticks(conf.ticks);
    y.axis.tickSize(-plot.size * plot.variables.length);
};


D3ScatterPlotMatrix.prototype.drawPlot = function () {
    var self =this;
    var n = self.plot.variables.length;
    var conf = this.config;
    self.svgG.selectAll(".mw-axis-x.mw-axis")
        .data(self.plot.variables)
        .enter().append("g")
        .attr("class", "mw-axis-x mw-axis"+(conf.guides ? '' : ' mw-no-guides'))
        .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * self.plot.size + ",0)"; })
        .each(function(d) { self.plot.x.scale.domain(self.plot.domainByVariable[d]); d3.select(this).call(self.plot.x.axis); });

    self.svgG.selectAll(".mw-axis-y.mw-axis")
        .data(self.plot.variables)
        .enter().append("g")
        .attr("class", "mw-axis-y mw-axis"+(conf.guides ? '' : ' mw-no-guides'))
        .attr("transform", function(d, i) { return "translate(0," + i * self.plot.size + ")"; })
        .each(function(d) { self.plot.y.scale.domain(self.plot.domainByVariable[d]); d3.select(this).call(self.plot.y.axis); });


    if(conf.tooltip){
        self.plot.tooltip = this.utils.selectOrAppend(d3.select(self.placeholderSelector), 'div.mw-tooltip', 'div')
            .attr("class", "mw-tooltip")
            .style("opacity", 0);
    }

    var cell = self.svgG.selectAll(".mw-cell")
        .data(self.utils.cross(self.plot.variables, self.plot.variables))
        .enter().append("g")
        .attr("class", "mw-cell")
        .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * self.plot.size + "," + d.j * self.plot.size + ")"; });

    if(conf.brush){
        this.drawBrush(cell);
    }

    cell.each(plotSubplot);



    //Labels
    cell.filter(function(d) { return d.i === d.j; }).append("text")
        .attr("x", conf.padding)
        .attr("y", conf.padding)
        .attr("dy", ".71em")
        .text(function(d) { return self.plot.labelByVariable[d.x]; });




    function plotSubplot(p) {
        var plot = self.plot;
        plot.subplots.push(p);
        var cell = d3.select(this);

        plot.x.scale.domain(plot.domainByVariable[p.x]);
        plot.y.scale.domain(plot.domainByVariable[p.y]);

        cell.append("rect")
            .attr("class", "mw-frame")
            .attr("x", conf.padding / 2)
            .attr("y", conf.padding / 2)
            .attr("width", conf.size - conf.padding)
            .attr("height", conf.size - conf.padding);


        p.update = function(){
            var subplot = this;
            var dots = cell.selectAll("circle")
                .data(self.data);

            dots.enter().append("circle");

            dots.attr("cx", function(d){return plot.x.map(d, subplot.x)})
                .attr("cy", function(d){return plot.y.map(d, subplot.y)})
                .attr("r", self.config.dot.radius);

            if (plot.dot.color) {
                dots.style("fill", plot.dot.color)
            }

            if(plot.tooltip){
                dots.on("mouseover", function(d) {
                    plot.tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    plot.tooltip.html("(" + plot.x.value(d, subplot.x)
                        + ", " +plot.y.value(d, subplot.y) + ")")
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                    .on("mouseout", function(d) {
                        plot.tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
            }

            dots.exit().remove();
        };

        p.update();
    }


};

D3ScatterPlotMatrix.prototype.update = function () {
    this.plot.subplots.forEach(function(p){p.update()});
};


D3ScatterPlotMatrix.prototype.initSvg = function () {

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
        .attr("class", "mw-d3-scatterplot-matrix");

    self.svgG = self.svg.append("g")
        .attr("class", "mw-container")
        .attr("transform", "translate(" + config.margin.left + "," + config.margin.top + ")");


    if(!config.width || config.height ){
        d3.select(window)
            .on("resize", function() {
                //TODO add responsiveness if width/height not specified
            });
    }
};

D3ScatterPlotMatrix.prototype.init = function () {
    var self = this;
    self.initPlot();
    self.initSvg();
    self.drawPlot();
};

D3ScatterPlotMatrix.prototype.drawBrush = function (cell) {
    var self = this;
    var brush = d3.svg.brush()
        .x(self.plot.x.scale)
        .y(self.plot.y.scale)
            .on("brushstart", brushstart)
            .on("brush", brushmove)
            .on("brushend", brushend);

    cell.append("g").call(brush);


    var brushCell;

    // Clear the previously-active brush, if any.
    function brushstart(p) {
        if (brushCell !== this) {
            d3.select(brushCell).call(brush.clear());
            self.plot.x.scale.domain(self.plot.domainByVariable[p.x]);
            self.plot.y.scale.domain(self.plot.domainByVariable[p.y]);
            brushCell = this;
        }
    }

    // Highlight the selected circles.
    function brushmove(p) {
        var e = brush.extent();
        self.svgG.selectAll("circle").classed("hidden", function (d) {
            return e[0][0] > d[p.x] || d[p.x] > e[1][0]
                || e[0][1] > d[p.y] || d[p.y] > e[1][1];
        });
    }
    // If the brush is empty, select all circles.
    function brushend() {
        if (brush.empty()) self.svgG.selectAll(".hidden").classed("hidden", false);
    }
};


function D3ScatterPlot(placeholderSelector, data, config){
    this.utils = new ChartsD3Utils();
    this.placeholderSelector = placeholderSelector;
    this.svg=null;
    this.defaultConfig = {
        width: 0,
        height: 0,
        guides: false, //show axis guides
        tooltip: true, //show tooltip on dot hover
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
    if(this.config.guides) {
        x.axis.tickSize(-plot.height);
    }

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

    if(this.config.guides){
        y.axis.tickSize(-plot.width);
    }


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
        .attr("class", "mw-axis-x mw-axis"+(self.config.guides ? '' : ' mw-no-guides'))
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
        .attr("class", "mw-axis mw-axis-y"+(self.config.guides ? '' : ' mw-no-guides'))
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

    if(plot.tooltip){
        dots.on("mouseover", function(d) {
            plot.tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            plot.tooltip.html("(" + plot.x.value(d)
                + ", " +plot.y.value(d) + ")")
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
            .on("mouseout", function(d) {
                plot.tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    }

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

};

D3ScatterPlot.prototype.init = function (){
    var self = this;
    self.initPlot();
    self.initSvg();
    self.draw();

};


function ChartsD3Utils() {
}

// usage example deepExtend({}, objA, objB); => should work similar to $.extend(true, {}, objA, objB);
ChartsD3Utils.prototype.deepExtend = function (out) { 

    var utils = this;
    var emptyOut = {};


    if (!out && arguments.length > 1 && Array.isArray(arguments[1])) {
        out = [];
    }
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        if (!source)
            continue;

        for (var key in source) {
            if (!source.hasOwnProperty(key)) {
                continue;
            }
            var isArray = Array.isArray(out[key]);
            var isObject = utils.isObject(out[key]);
            var srcObj = utils.isObject(source[key]);

            if (isObject && !isArray && srcObj) {
                utils.deepExtend(out[key], source[key]);
            } else {
                out[key] = source[key];
            }
        }
    }

    return out;
};

ChartsD3Utils.prototype.cross = function (a, b) {
    var c = [], n = a.length, m = b.length, i, j;
    for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
    return c;
};

ChartsD3Utils.prototype.inferVariables = function (data, groupKey, includeGroup) {
    var res = [];
    if (data.length) {
        var d = data[0];
        if (d instanceof Array) {
            res=  d.map(function (v, i) {
                return i;
            });
        }else if (typeof d === 'object'){

            for (var prop in d) {
                if(!d.hasOwnProperty(prop)) continue;

                res.push(prop);
            }
        }
    }
    if(!includeGroup){
        var index = res.indexOf(groupKey);
        if (index > -1) {
            res.splice(index, 1);
        }
    }
    return res
};


ChartsD3Utils.prototype.isObject = function(a) {
    return a !== null && typeof a === 'object';
};
ChartsD3Utils.prototype.isNumber = function(a) {
    return !isNaN(a) && typeof a === 'number';
};
ChartsD3Utils.prototype.isFunction = function(a) {
    return typeof a === 'function';
};

ChartsD3Utils.prototype.selectOrAppend = function (parent, selector, element) {
    var selection = parent.select(selector);
    if(selection.empty()){
        return parent.append(element || selector);
    }
    return selection;
};