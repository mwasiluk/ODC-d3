import {Chart, ChartConfig} from "./chart";
import {Utils} from './utils'
import {StatisticsUtils} from './statistics-utils'
import {Legend} from './legend'
import {ScatterPlot} from './scatterplot'

export class CorrelationMatrixConfig extends ChartConfig {

    svgClass = 'odc-correlation-matrix';
    guides = false; //show axis guides
    tooltip = true; //show tooltip on dot hover
    legend = true;
    highlightLabels = true;
    variables = {
        labels: undefined,
        keys: [], //optional array of variable keys
        value: (d, variableKey) => d[variableKey], // variable value accessor
        scale: "ordinal"
    };
    correlation = {
        scale: "linear",
        domain: [-1, -0.75, -0.5, 0, 0.5, 0.75, 1],
        range: ["darkblue", "blue", "lightskyblue", "white", "orangered", "crimson", "darkred"],
        value: (xValues, yValues) => StatisticsUtils.sampleCorrelation(xValues, yValues)

    };
    cell = {
        shape: "ellipse", //possible values: rect, circle, ellipse
        size: undefined,
        sizeMin: 5,
        sizeMax: 80,
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

export class CorrelationMatrix extends Chart {
    constructor(placeholderSelector, data, config) {
        super(placeholderSelector, data, new CorrelationMatrixConfig(config));
    }

    setConfig(config) {
        return super.setConfig(new CorrelationMatrixConfig(config));

    }

    initPlot() {
        var self = this;
        var margin = this.config.margin;
        var conf = this.config;
        this.plot = {
            x: {},
            correlation: {
                matrix: undefined,
                cells: undefined,
                color: {},
                shape: {}
            }


        };
        this.setupVariables();
        var width = conf.width;
        var placeholderNode = this.getBaseContainerNode();
        this.plot.placeholderNode = placeholderNode;

        var parentWidth = placeholderNode.getBoundingClientRect().width;
        if (width) {

            if (!this.plot.cellSize) {
                this.plot.cellSize = Math.max(conf.cell.sizeMin, Math.min(conf.cell.sizeMax, (width - margin.left - margin.right) / this.plot.variables.length));
            }

        } else {
            this.plot.cellSize = this.config.cell.size;

            if (!this.plot.cellSize) {
                this.plot.cellSize = Math.max(conf.cell.sizeMin, Math.min(conf.cell.sizeMax, parentWidth / this.plot.variables.length));
            }

            width = this.plot.cellSize * this.plot.variables.length + margin.left + margin.right;

        }

        var height = width;
        if (!height) {
            height = placeholderNode.getBoundingClientRect().height;
        }

        this.plot.width = width - margin.left - margin.right;
        this.plot.height = this.plot.width;

        this.setupVariablesScales();
        this.setupCorrelationScales();
        this.setupCorrelationMatrix();


        return this;
    }

    setupVariablesScales() {

        var plot = this.plot;
        var x = plot.x;
        var conf = this.config.variables;

        /* *
         * value accessor - returns the value to encode for a given data object.
         * scale - maps value to a visual display encoding, such as a pixel position.
         * map function - maps from data value to display value
         * axis - sets up axis
         **/
        x.value = conf.value;
        x.scale = d3.scale[conf.scale]().rangeBands([plot.width, 0]);
        x.map = d => x.scale(x.value(d));

    };

    setupCorrelationScales() {
        var plot = this.plot;
        var corrConf = this.config.correlation;

        plot.correlation.color.scale = d3.scale[corrConf.scale]().domain(corrConf.domain).range(corrConf.range);
        var shape = plot.correlation.shape = {};

        var cellConf = this.config.cell;
        shape.type = cellConf.shape;

        var shapeSize = plot.cellSize - cellConf.padding * 2;
        if (shape.type == 'circle') {
            var radiusMax = shapeSize / 2;
            shape.radiusScale = d3.scale.linear().domain([0, 1]).range([2, radiusMax]);
            shape.radius = c=> shape.radiusScale(Math.abs(c.value));
        } else if (shape.type == 'ellipse') {
            var radiusMax = shapeSize / 2;
            shape.radiusScale = d3.scale.linear().domain([0, 1]).range([radiusMax, 2]);
            shape.radiusX = c=> shape.radiusScale(Math.abs(c.value));
            shape.radiusY = radiusMax;

            shape.rotateVal = v => {
                if (v == 0) return "0";
                if (v < 0) return "-45";
                return "45"
            }
        } else if (shape.type == 'rect') {
            shape.size = shapeSize;
        }

    }


    setupVariables() {

        var variablesConf = this.config.variables;

        var data = this.data;
        var plot = this.plot;
        plot.domainByVariable = {};
        plot.variables = variablesConf.keys;
        if (!plot.variables || !plot.variables.length) {
            plot.variables = Utils.inferVariables(data, this.config.groups.key, this.config.includeInPlot);
        }

        plot.labels = [];
        plot.labelByVariable = {};
        plot.variables.forEach((variableKey, index) => {
            plot.domainByVariable[variableKey] = d3.extent(data, function (d) {
                return variablesConf.value(d, variableKey)
            });
            var label = variableKey;
            if (variablesConf.labels && variablesConf.labels.length > index) {

                label = variablesConf.labels[index];
            }
            plot.labels.push(label);
            plot.labelByVariable[variableKey] = label;
        });

        console.log(plot.labelByVariable);

    };


    setupCorrelationMatrix() {
        var self = this;
        var data = this.data;
        var matrix = this.plot.correlation.matrix = [];
        var matrixCells = this.plot.correlation.matrix.cells = [];
        var plot = this.plot;

        var variableToValues = {};
        plot.variables.forEach((v, i) => {

            variableToValues[v] = data.map(d=>plot.x.value(d, v));
        });

        plot.variables.forEach((v1, i) => {
            var row = [];
            matrix.push(row);

            plot.variables.forEach((v2, j) => {
                var corr = 1;
                if (v1 != v2) {
                    corr = self.config.correlation.value(variableToValues[v1], variableToValues[v2]);
                }
                var cell = {
                    rowVar: v1,
                    colVar: v2,
                    row: i,
                    col: j,
                    value: corr
                };
                row.push(cell);

                matrixCells.push(cell);
            });

        });
    }


    update(newData) {
        super.update(newData);
        // this.update
        this.updateCells();
        this.updateVariableLabels();

        if (this.config.legend) {
            this.updateLegend();
        }
    };

    updateVariableLabels() {
        var self = this;
        var plot = self.plot;
        var labelClass = self.config.cssClassPrefix + "label";
        var labelXClass = labelClass + " " + labelClass + "-x";
        var labelYClass = labelClass + " " + labelClass + "-y";
        plot.labelClass = labelClass;


        var labelsX = self.svgG.selectAll(labelXClass)
            .data(plot.variables);

        labelsX.enter().append("text");


        labelsX
            .attr("x", (d, i) => i * plot.cellSize + plot.cellSize / 2)
            .attr("y", plot.height)
            .attr("dx", -2)
            .attr("transform", (d, i) => "rotate(-90, " + (i * plot.cellSize + plot.cellSize / 2  ) + ", " + plot.height + ")")
            .attr("text-anchor", "end")
            .attr("class", (d, i) => labelXClass + " " + labelXClass + "-" + i)
            // .attr("dominant-baseline", "hanging")
            .text(v=>v);

        labelsX.exit().remove();

        //////

        var labelsY = self.svgG.selectAll(labelYClass)
            .data(plot.variables);

        labelsY.enter().append("text");


        labelsY
            .attr("x", 0)
            .attr("y", (d, i) => i * plot.cellSize + plot.cellSize / 2)
            .attr("dx", -2)
            .attr("text-anchor", "end")
            .attr("class", (d, i) => labelYClass + " " + labelYClass + "-" + i)
            // .attr("dominant-baseline", "hanging")
            .text(v=>v);

        labelsX.exit().remove();


    }

    updateCells() {

        var self = this;
        var plot = self.plot;
        var cellClass = self.config.cssClassPrefix + "cell";
        var cellShape = plot.correlation.shape.type;


        var data = this.data;

        var cells = self.svgG.selectAll(cellClass)
            .data(plot.correlation.matrix.cells);


        cells.enter().append("g")
            .attr("class", cellClass);
        cells.attr("transform", c=> "translate(" + (plot.cellSize * c.col + plot.cellSize / 2) + "," + (plot.cellSize * c.row + plot.cellSize / 2) + ")");
        var shapes = cells.append(cellShape);

        if (plot.correlation.shape.type == 'circle') {

            shapes
                .attr("r", plot.correlation.shape.radius)
                .attr("cx", 0)
                .attr("cy", 0);
        }

        if (plot.correlation.shape.type == 'ellipse') {
            // cells.attr("transform", c=> "translate(300,150) rotate("+plot.correlation.shape.rotateVal(c.value)+")");
            shapes
                .attr("rx", plot.correlation.shape.radiusX)
                .attr("ry", plot.correlation.shape.radiusY)
                .attr("cx", 0)
                .attr("cy", 0)

                .attr("transform", c=> "rotate(" + plot.correlation.shape.rotateVal(c.value) + ")");
        }


        if (plot.correlation.shape.type == 'rect') {
            shapes
                .attr("width", plot.correlation.shape.size)
                .attr("height", plot.correlation.shape.size)
                .attr("x", -plot.cellSize / 2)
                .attr("y", -plot.cellSize / 2);
        }

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

        shapes.style("fill", c=> plot.correlation.color.scale(c.value));

        cells.exit().remove();
    }


    updateLegend() {

        var plot = this.plot;
        var legendX = this.plot.width + 10;
        var legendY = 0;
        var barWidth = 10;
        var barHeight = this.plot.height - 2;
        var scale = plot.correlation.color.scale;

        plot.legend = new Legend(this.svg, this.svgG, scale, legendX, legendY).linearGradientBar(barWidth, barHeight);


    }

    attachScatterPlot(containerSelector, config) {
        var self = this;

        config = config || {};


        var scatterPlotConfig = {
            height: self.plot.height+self.config.margin.top+ self.config.margin.bottom,
            width: self.plot.height+self.config.margin.top+ self.config.margin.bottom,
            groups:{
                key: self.config.groups.key,
                label: self.config.groups.label
            },
            guides: true
        };



        scatterPlotConfig = Utils.deepExtend(scatterPlotConfig, config);
        console.log(scatterPlotConfig);

        this.on("cell-selected", c=>{



            scatterPlotConfig.x={
                key: c.rowVar,
                label: self.plot.labelByVariable[c.rowVar]
            };
            scatterPlotConfig.y={
                key: c.colVar,
                label: self.plot.labelByVariable[c.colVar]
            };

            self.scatterPlot = new ScatterPlot(containerSelector, self.data, scatterPlotConfig);
            this.attach("ScatterPlot", self.scatterPlot);
        });


    }
}
