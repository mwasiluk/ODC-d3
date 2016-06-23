function D3ScatterPlotMatrix(placeholderSelector, data, config) {
    this.utils = new ChartsD3Utils();
    this.placeholderSelector = placeholderSelector;
    this.svg = null;
    this.defaultConfig = {
        width: 0,
        size: 200, //cell size
        padding: 20, //cell padding
        brush: true,
        guides: true,
        tooltip: true,
        ticks: null,
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
        traits: {
            labels: [], //optional array of trait labels
            keys: [], //optional array of trait keys
            categoryKey: null,
            includeCategoryInPlot: false,
            value: function (d, traitKey) {// trait value accessor
                return d[traitKey];
            }
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

    this.setupTraits();

    this.plot.size = conf.size;


    var width = conf.width;
    var placeholderNode = d3.select(this.placeholderSelector).node();

    if (!width) {
        var maxWidth = margin.left + margin.right + this.plot.traits.length*this.plot.size;
        width = Math.min(placeholderNode.getBoundingClientRect().width, maxWidth);

    }
    var height = width;
    if (!height) {
        height = placeholderNode.getBoundingClientRect().height;
    }

    this.plot.width = width - margin.left - margin.right;
    this.plot.height = height - margin.top - margin.bottom;




    if(conf.ticks===null){
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


    }else if(conf.traits.categoryKey){
        this.plot.dot.color = function (d) {
            return self.plot.dot.colorCategory(d[conf.traits.categoryKey]);
        }
    }



    return this;

};

D3ScatterPlotMatrix.prototype.setupTraits = function () {
    var traitsConf = this.config.traits;

    var data = this.data;
    var plot = this.plot;
    plot.domainByTrait = {};
    plot.traits = traitsConf.keys;
    if(!plot.traits || !plot.traits.length){
        plot.traits = this.utils.inferTraits(data, traitsConf.categoryKey, traitsConf.includeCategoryInPlot);
    }

    plot.labels = [];
    plot.labelByTrait = {};
    plot.traits.forEach(function(traitKey, index) {
        plot.domainByTrait[traitKey] = d3.extent(data, function(d) { return traitsConf.value(d, traitKey) });
        var label = traitKey;
        if(traitsConf.labels && traitsConf.labels.length>index){

            label = traitsConf.labels[index];
        }
        plot.labels.push(label);
        plot.labelByTrait[traitKey] = label;
    });

    console.log(plot.labelByTrait);

    plot.subplots = [];
};

D3ScatterPlotMatrix.prototype.setupX = function () {

    var plot = this.plot;
    var x = plot.x;
    var conf = this.config;

    x.value = conf.traits.value;
    x.scale = d3.scale[conf.x.scale]().range([conf.padding / 2, plot.size - conf.padding / 2]);
    x.map = function (d, trait) {
        return x.scale(x.value(d, trait));
    };
    x.axis = d3.svg.axis().scale(x.scale).orient(conf.x.orient).ticks(conf.ticks);
    x.axis.tickSize(plot.size * plot.traits.length);

};

D3ScatterPlotMatrix.prototype.setupY = function () {

    var plot = this.plot;
    var y = plot.y;
    var conf = this.config;

    y.value = conf.traits.value;
    y.scale = d3.scale[conf.y.scale]().range([ plot.size - conf.padding / 2, conf.padding / 2]);
    y.map = function (d, trait) {
        return y.scale(y.value(d, trait));
    };
    y.axis= d3.svg.axis().scale(y.scale).orient(conf.y.orient).ticks(conf.ticks);
    y.axis.tickSize(-plot.size * plot.traits.length);
};


D3ScatterPlotMatrix.prototype.drawPlot = function () {
    var self =this;
    var n = self.plot.traits.length;
    var conf = this.config;
    self.svgG.selectAll(".mw-axis-x.mw-axis")
        .data(self.plot.traits)
        .enter().append("g")
        .attr("class", "mw-axis-x mw-axis"+(conf.guides ? '' : ' mw-no-guides'))
        .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * self.plot.size + ",0)"; })
        .each(function(d) { self.plot.x.scale.domain(self.plot.domainByTrait[d]); d3.select(this).call(self.plot.x.axis); });

    self.svgG.selectAll(".mw-axis-y.mw-axis")
        .data(self.plot.traits)
        .enter().append("g")
        .attr("class", "mw-axis-y mw-axis"+(conf.guides ? '' : ' mw-no-guides'))
        .attr("transform", function(d, i) { return "translate(0," + i * self.plot.size + ")"; })
        .each(function(d) { self.plot.y.scale.domain(self.plot.domainByTrait[d]); d3.select(this).call(self.plot.y.axis); });


    if(conf.tooltip){
        self.plot.tooltip = this.utils.selectOrAppend(d3.select(self.placeholderSelector), 'div.mw-tooltip', 'div')
            .attr("class", "mw-tooltip")
            .style("opacity", 0);
    }

    var cell = self.svgG.selectAll(".mw-cell")
        .data(self.utils.cross(self.plot.traits, self.plot.traits))
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
        .text(function(d) { return self.plot.labelByTrait[d.x]; });




    function plotSubplot(p) {
        var plot = self.plot;
        plot.subplots.push(p);
        var cell = d3.select(this);

        plot.x.scale.domain(plot.domainByTrait[p.x]);
        plot.y.scale.domain(plot.domainByTrait[p.y]);

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
            self.plot.x.scale.domain(self.plot.domainByTrait[p.x]);
            self.plot.y.scale.domain(self.plot.domainByTrait[p.y]);
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

