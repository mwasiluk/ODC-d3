import {Chart, ChartConfig} from "./chart";
import {Utils} from './utils'
import {StatisticsUtils} from './statistics-utils'
import {Legend} from './legend'

export class HeatmapConfig extends ChartConfig {

    svgClass = 'odc-heatmap';
    tooltip = true; //show tooltip on dot hover
    legend = true;
    highlightLabels = true;
    x={// X axis config
        title: '', // axis title
        key: 0,
        value: (d) => d[this.x.key], // x value accessor
        rotateLabels: true
    };
    y={// Y axis config
        title: '', // axis title,
        rotateLabels: true,
        key: 1,
        value: (d) => d[this.y.key] // y value accessor
    };
    z = {
        key: 3,
        label: 'Z', // axis label,
        value: (d) =>  d[this.z.key]

    };
    color = {
        scale: "linear",
        range: ["darkblue", "white", "darkred"]
    };
    cell = {
        width: undefined,
        height: undefined,
        sizeMin: 15,
        sizeMax: 250,
        padding: 1
    };
    margin = {
        left: 60,
        right: 50,
        top: 30,
        bottom: 60
    };

    constructor(custom) {
        super();
        if (custom) {
            Utils.deepExtend(this, custom);
        }
    }
}

export class Heatmap extends Chart {
    constructor(placeholderSelector, data, config) {
        super(placeholderSelector, data, new HeatmapConfig(config));
    }

    setConfig(config) {
        return super.setConfig(new HeatmapConfig(config));

    }

    initPlot() {
        super.initPlot();
        var self = this;
        var margin = this.config.margin;
        var conf = this.config;

        this.plot.x={};
        this.plot.y={};
        this.plot.z={
            matrix: undefined,
            cells: undefined,
            color: {},
            shape: {}
        };


        this.setupValues();
        this.computePlotSize();
        this.setupZScale();



        return this;
    }

    setupValues(){
        var self = this;
        var config = self.config;
        var x = self.plot.x;
        var y = self.plot.y;
        var z = self.plot.z;


        x.value = d => config.x.value.call(config, d);
        y.value = d => config.y.value.call(config, d);
        z.value = d => config.z.value.call(config, d);

        x.uniqueValues = [];
        y.uniqueValues = [];

        var valueMap = {};



        this.data.forEach(d=>{

            var xVal = x.value(d);
            var yVal = y.value(d);
            var zVal = parseFloat(z.value(d));



            if(x.uniqueValues.indexOf(xVal)===-1){
                x.uniqueValues.push(xVal);

                valueMap[xVal] = {};
            }

            if(y.uniqueValues.indexOf(yVal)===-1){
                y.uniqueValues.push(yVal);
            }
            valueMap[xVal][yVal]=zVal;

        });






        // this.setupValueMatrix();

        var matrix = this.plot.z.matrix = [];
        var matrixCells = this.plot.z.cells = [];
        var plot = this.plot;

        var minZ = undefined;
        var maxZ = undefined;
        y.uniqueValues.forEach((v1, i) => {
            var row = [];
            matrix.push(row);

            x.uniqueValues.forEach((v2, j) => {
                var zVal = valueMap[v2][v1] || 0;
                if(minZ === undefined || zVal<minZ){
                    minZ = zVal;
                }
                if(maxZ === undefined || zVal>maxZ){
                    maxZ = zVal;
                }

                var cell = {
                    rowVar: v1,
                    colVar: v2,
                    row: i,
                    col: j,
                    value: zVal
                };
                row.push(cell);

                matrixCells.push(cell);
            });

        });
        z.domain = [minZ, 0, maxZ].sort(function(a, b){return a-b});
        console.log(matrix,x.uniqueValues , y.uniqueValues );
    }


    computePlotSize() {

        var plot = this.plot;
        var conf = this.config;
        var margin = plot.margin;
        var availableWidth = Utils.availableWidth(this.config.width, this.getBaseContainer(), this.plot.margin);
        var availableHeight = Utils.availableHeight(this.config.height, this.getBaseContainer(), this.plot.margin);
        var width = availableWidth;
        var height = availableHeight;
        if (this.config.width) {

            if (!this.config.cell.width) {
                this.plot.cellWidth = Math.max(conf.cell.sizeMin, Math.min(conf.cell.sizeMax, (availableWidth - margin.left - margin.right) / this.plot.x.uniqueValues.length));
            }


        } else {
            this.plot.cellWidth = this.config.cell.width;

            if (!this.plot.cellWidth) {
                this.plot.cellWidth = Math.max(conf.cell.sizeMin, Math.min(conf.cell.sizeMax, (availableWidth- margin.left - margin.right) / this.plot.x.uniqueValues.length));
            }



        }
        width = this.plot.cellWidth * this.plot.x.uniqueValues.length + margin.left + margin.right;

        if(this.config.height){
            if (!this.config.cell.height) {
                this.plot.cellHeight = Math.max(conf.cell.sizeMin, Math.min(conf.cell.sizeMax, (availableHeight - margin.top - margin.bottom) / this.plot.y.uniqueValues.length));
            }
        }else {
            this.plot.cellHeight = this.config.cell.height;

            if (!this.plot.cellHeight) {
                this.plot.cellHeight = Math.max(conf.cell.sizeMin, Math.min(conf.cell.sizeMax, (availableHeight- margin.top - margin.bottom) / this.plot.y.uniqueValues.length));
            }

        }

        height = this.plot.cellHeight * this.plot.y.uniqueValues.length + margin.top + margin.bottom;


        this.plot.width = width - margin.left - margin.right;
        this.plot.height =height -margin.top - margin.bottom;
    }


    setupZScale() {

        var self = this;
        var config = self.config;
        var z = self.plot.z;

        var plot = this.plot;
//.domain(corrConf.domain)

        var range = config.color.range.slice();
        if(z.domain[0]===0){
            z.domain.shift();
            range.shift();
        }else if(z.domain[2]===0){
            z.domain.pop();
            range.pop();
        }

        plot.z.color.scale = d3.scale[config.color.scale]().domain(z.domain).range(range);
        var shape = plot.z.shape = {};

        var cellConf = this.config.cell;
        shape.type = "rect";

        plot.z.shape.width = plot.cellWidth - cellConf.padding * 2;
        plot.z.shape.height = plot.cellHeight - cellConf.padding * 2;
    }




    update(newData) {
        super.update(newData);
        // this.update
        this.updateCells();
        this.updateVariableLabels();

        if (this.config.legend) {
            this.updateLegend();
        }

        this.updateAxisTitles();
    };

    updateAxisTitles(){
        var self = this;
        var plot = self.plot;
        self.svgG.selectOrAppend("g."+self.prefixClass('axis-x'))
            .attr("transform", "translate(0," + plot.height + ")")
            .selectOrAppend("text."+self.prefixClass('label'))
            .attr("transform", "translate("+ (plot.width/2) +","+ (plot.margin.bottom) +")")  
            .attr("dy", "-1em")
            .style("text-anchor", "middle")
            .text(self.config.x.title);

        self.svgG.selectOrAppend("g."+self.prefixClass('axis-y'))
            .selectOrAppend("text."+self.prefixClass('label'))
            .attr("transform", "translate("+ -plot.margin.left +","+(plot.height/2)+")rotate(-90)")
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(self.config.y.title);
    }


    updateVariableLabels() {
        var self = this;
        var plot = self.plot;
        var labelClass = self.prefixClass("label");
        var labelXClass = labelClass + "-x";
        var labelYClass = labelClass + "-y";
        plot.labelClass = labelClass;


        var labelsX = self.svgG.selectAll("text."+labelXClass)
            .data(plot.x.uniqueValues, (d, i)=>i);

        labelsX.enter().append("text").attr("class", (d, i) => labelClass + " " +labelXClass+" "+ labelXClass + "-" + i);


        labelsX
            .attr("x", (d, i) => i * plot.cellWidth + plot.cellWidth / 2)
            .attr("y", plot.height)
            .attr("dy", 15)

            .attr("text-anchor", "middle")

            // .attr("dominant-baseline", "hanging")

            .text(d=>d);

        if(self.config.x.rotateLabels){
            labelsX.attr("transform", (d, i) => "rotate(-45, " + (i * plot.cellWidth + plot.cellWidth / 2  ) + ", " + plot.height + ")")
                .attr("dx", -2)
                .attr("dy", 5)
                .attr("text-anchor", "end");
            // .attr("dx", -7);
        }


        labelsX.exit().remove();

        //////

        var labelsY = self.svgG.selectAll("text."+labelYClass)
            .data(plot.y.uniqueValues);

        labelsY.enter().append("text");


        labelsY
            .attr("x", 0)
            .attr("y", (d, i) => i * plot.cellHeight + plot.cellHeight / 2)
            .attr("dx", -2)
            .attr("text-anchor", "end")
            .attr("class", (d, i) => labelClass + " " + labelYClass +" " + labelYClass + "-" + i)
            // .attr("dominant-baseline", "hanging")
            .text(d=>d);

        if(self.config.y.rotateLabels){
            labelsY.attr("transform", (d, i) => "rotate(-45, " + (0  ) + ", " + (i * plot.cellHeight + plot.cellHeight / 2) + ")")
                // .attr("dx", -7);
        }

        labelsY.exit().remove();


    }

    updateCells() {

        var self = this;
        var plot = self.plot;
        var cellClass = self.prefixClass("cell");
        var cellShape = plot.z.shape.type;

        var cells = self.svgG.selectAll("g."+cellClass)
            .data(plot.z.cells);

        var cellEnterG = cells.enter().append("g")
            .classed(cellClass, true);
        cells.attr("transform", c=> "translate(" + (plot.cellWidth * c.col + plot.cellWidth / 2) + "," + (plot.cellHeight * c.row + plot.cellHeight / 2) + ")");

        cells.classed(self.config.cssClassPrefix + "selectable", !!self.scatterPlot);

        var selector = "*:not(.cell-shape-"+cellShape+")";
       
        var wrongShapes = cells.selectAll(selector);
        wrongShapes.remove();
        
        var shapes = cells.selectOrAppend(cellShape+".cell-shape-"+cellShape);


        shapes
            .attr("width", plot.z.shape.width)
            .attr("height", plot.z.shape.height)
            .attr("x", -plot.cellWidth / 2)
            .attr("y", -plot.cellHeight / 2);

        shapes.style("fill", c=> plot.z.color.scale(c.value));

        var mouseoverCallbacks = [];
        var mouseoutCallbacks = [];

        if (plot.tooltip) {

            mouseoverCallbacks.push(c=> {
                plot.tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                var html = c.value;
                plot.tooltip.html(html)
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            });

            mouseoutCallbacks.push(c=> {
                plot.tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });


        }

        if (self.config.highlightLabels) {
            var highlightClass = self.config.cssClassPrefix + "highlight";
            var xLabelClass = c=>plot.labelClass + "-x-" + c.col;
            var yLabelClass = c=>plot.labelClass + "-y-" + c.row;


            mouseoverCallbacks.push(c=> {

                self.svgG.selectAll("text." + xLabelClass(c)).classed(highlightClass, true);
                self.svgG.selectAll("text." + yLabelClass(c)).classed(highlightClass, true);
            });
            mouseoutCallbacks.push(c=> {
                self.svgG.selectAll("text." + xLabelClass(c)).classed(highlightClass, false);
                self.svgG.selectAll("text." + yLabelClass(c)).classed(highlightClass, false);
            });
        }


        cells.on("mouseover", c => {
            mouseoverCallbacks.forEach(callback=>callback(c));
        })
            .on("mouseout", c => {
                mouseoutCallbacks.forEach(callback=>callback(c));
            });

        cells.on("click", c=>{
           self.trigger("cell-selected", c);
        });



        cells.exit().remove();
    }

    updateLegend() {

        var plot = this.plot;
        var legendX = this.plot.width + 10;
        var legendY = 0;
        var barWidth = 10;
        var barHeight = this.plot.height - 2;
        var scale = plot.z.color.scale;

        plot.legend = new Legend(this.svg, this.svgG, scale, legendX, legendY).linearGradientBar(barWidth, barHeight);


    }
}
