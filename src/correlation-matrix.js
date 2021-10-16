import {Chart, ChartConfig} from "./chart";
import {Utils} from './utils'
import {StatisticsUtils} from './statistics-utils'
import {Legend} from './legend'
import {ScatterPlot} from './scatterplot'
import * as d3 from './d3'

export class CorrelationMatrixConfig extends ChartConfig {

    svgClass = this.cssClassPrefix + 'correlation-matrix';
    guides = false; //show axis guides
    showTooltip = true; //show tooltip on dot hover
    showLegend = true;
    highlightLabels = true;
    rotateLabelsX = true;
    rotateLabelsY = true;
    variables = {
        labels: undefined,
        keys: [], //optional array of variable keys
        value: (d, variableKey) => parseFloat(d[variableKey]), // variable value accessor
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
    groups = {
        key: null,
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
        super.initPlot();
        var self = this;
        var margin = this.config.margin;
        var conf = this.config;

        this.plot.x = {};
        this.plot.correlation = {
            matrix: undefined,
            cells: undefined,
            color: {},
            shape: {}
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
                this.plot.cellSize = Math.max(conf.cell.sizeMin, Math.min(conf.cell.sizeMax, (parentWidth - margin.left - margin.right) / this.plot.variables.length));
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
        x.scale = d3.scaleBand().range([plot.width, 0]);
        x.map = d => x.scale(x.value(d));

    };

    setupCorrelationScales() {
        var plot = this.plot;
        var corrConf = this.config.correlation;

        plot.correlation.color.scale = Utils.createScale(corrConf.scale).domain(corrConf.domain).range(corrConf.range);
        var shape = plot.correlation.shape = {};

        var cellConf = this.config.cell;
        shape.type = cellConf.shape;

        var shapeSize = plot.cellSize - cellConf.padding * 2;
        if (shape.type == 'circle') {
            var radiusMax = shapeSize / 2;
            shape.radiusScale = d3.scaleLinear().domain([0, 1]).range([2, radiusMax]);
            shape.radius = c => shape.radiusScale(Math.abs(c.value));
        } else if (shape.type == 'ellipse') {
            var radiusMax = shapeSize / 2;
            shape.radiusScale = d3.scaleLinear().domain([0, 1]).range([radiusMax, 2]);
            shape.radiusX = c => shape.radiusScale(Math.abs(c.value));
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
            plot.domainByVariable[variableKey] = d3.extent(data, (d) => variablesConf.value(d, variableKey));
            var label = variableKey;
            if (variablesConf.labels && variablesConf.labels.length > index) {

                label = variablesConf.labels[index];
            }
            plot.labels.push(label);
            plot.labelByVariable[variableKey] = label;
        });

        // console.log(plot.labelByVariable);

    };


    setupCorrelationMatrix() {
        var self = this;
        var data = this.data;
        var matrix = this.plot.correlation.matrix = [];
        var matrixCells = this.plot.correlation.matrix.cells = [];
        var plot = this.plot;

        var variableToValues = {};
        plot.variables.forEach((v, i) => {

            variableToValues[v] = data.map(d => plot.x.value(d, v));
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


        if (this.config.showLegend) {
            this.updateLegend();
        }
    };

    updateVariableLabels() {
        this.plot.labelClass = this.prefixClass("label");
        this.updateAxisX();
        this.updateAxisY();
    }

    updateAxisX() {
        var self = this;
        var plot = self.plot;
        var labelClass = plot.labelClass;
        var labelXClass = labelClass + "-x";

        var labels = self.svgG.selectAll("text." + labelXClass)
            .data(plot.variables, (d, i) => i);

        var labelsMerge = labels.enter().append("text").attr("class", (d, i) => labelClass + " " + labelXClass + " " + labelXClass + "-" + i).merge(labels);

        labelsMerge
            .attr("x", (d, i) => i * plot.cellSize + plot.cellSize / 2)
            .attr("y", plot.height)
            .attr("dx", -2)
            .attr("dy", 5)
            .attr("text-anchor", "end")

            // .attr("dominant-baseline", "hanging")
            .text(v => plot.labelByVariable[v]);

        if (this.config.rotateLabelsX) {
            labelsMerge.attr("transform", (d, i) => "rotate(-45, " + (i * plot.cellSize + plot.cellSize / 2) + ", " + plot.height + ")")
        }

        var maxWidth = self.computeXAxisLabelsWidth();
        labelsMerge.each(function (label) {
            Utils.placeTextWithEllipsisAndTooltip(d3.select(this), label, maxWidth, self.config.showTooltip ? self.plot.tooltip : false);
        });

        labels.exit().remove();
    }

    updateAxisY() {
        var self = this;
        var plot = self.plot;
        var labelClass = plot.labelClass;
        var labelYClass = plot.labelClass + "-y";
        var labels = self.svgG.selectAll("text." + labelYClass)
            .data(plot.variables);

        var labelsMerge = labels.enter().append("text").merge(labels);

        labelsMerge
            .attr("x", 0)
            .attr("y", (d, i) => i * plot.cellSize + plot.cellSize / 2)
            .attr("dx", -2)
            .attr("text-anchor", "end")
            .attr("class", (d, i) => labelClass + " " + labelYClass + " " + labelYClass + "-" + i)
            // .attr("dominant-baseline", "hanging")
            .text(v => plot.labelByVariable[v]);

        if (this.config.rotateLabelsY) {
            labelsMerge
                .attr("transform", (d, i) => "rotate(-45, " + 0 + ", " + (i * plot.cellSize + plot.cellSize / 2) + ")")
                .attr("text-anchor", "end");
        }

        var maxWidth = self.computeYAxisLabelsWidth();
        labelsMerge.each(function (label) {
            Utils.placeTextWithEllipsisAndTooltip(d3.select(this), label, maxWidth, self.config.showTooltip ? self.plot.tooltip : false);
        });

        labels.exit().remove();
    }

    computeYAxisLabelsWidth() {
        var maxWidth = this.plot.margin.left;
        if (!this.config.rotateLabelsY) {
            return maxWidth;
        }

        maxWidth *= Utils.SQRT_2;
        var fontSize = 11; //todo check actual font size
        maxWidth -= fontSize / 2;

        return maxWidth;
    }

    computeXAxisLabelsWidth(offset) {
        if (!this.config.rotateLabelsX) {
            return this.plot.cellSize - 2;
        }
        var size = this.plot.margin.bottom;
        size *= Utils.SQRT_2;
        var fontSize = 11; //todo check actual font size
        size -= fontSize / 2;
        return size;
    }

    updateCells() {

        var self = this;
        var plot = self.plot;
        var cellClass = self.prefixClass("cell");
        var cellShape = plot.correlation.shape.type;

        var cells = self.svgG.selectAll("g." + cellClass)
            .data(plot.correlation.matrix.cells);

        var cellsEnter = cells.enter().append("g")
            .classed(cellClass, true);
        var cellsMerge = cellsEnter.merge(cells);
        cellsMerge.attr("transform", c => "translate(" + (plot.cellSize * c.col + plot.cellSize / 2) + "," + (plot.cellSize * c.row + plot.cellSize / 2) + ")");

        cellsMerge.classed(self.config.cssClassPrefix + "selectable", !!self.scatterPlot);

        var selector = "*:not(.cell-shape-" + cellShape + ")";

        var wrongShapes = cells.selectAll(selector);
        wrongShapes.remove();

        var shapes = cellsMerge.selectOrAppend(cellShape + ".cell-shape-" + cellShape);

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

                .attr("transform", c => "rotate(" + plot.correlation.shape.rotateVal(c.value) + ")");
        }


        if (plot.correlation.shape.type == 'rect') {
            shapes
                .attr("width", plot.correlation.shape.size)
                .attr("height", plot.correlation.shape.size)
                .attr("x", -plot.cellSize / 2)
                .attr("y", -plot.cellSize / 2);
        }
        shapes.style("fill", c => plot.correlation.color.scale(c.value));

        var mouseoverCallbacks = [];
        var mouseoutCallbacks = [];

        if (plot.tooltip) {

            mouseoverCallbacks.push(c => {
                var html = c.value;
                self.showTooltip(html);
            });

            mouseoutCallbacks.push(c => {
                self.hideTooltip();
            });


        }

        if (self.config.highlightLabels) {
            var highlightClass = self.config.cssClassPrefix + "highlight";
            var xLabelClass = c => plot.labelClass + "-x-" + c.col;
            var yLabelClass = c => plot.labelClass + "-y-" + c.row;


            mouseoverCallbacks.push(c => {

                self.svgG.selectAll("text." + xLabelClass(c)).classed(highlightClass, true);
                self.svgG.selectAll("text." + yLabelClass(c)).classed(highlightClass, true);
            });
            mouseoutCallbacks.push(c => {
                self.svgG.selectAll("text." + xLabelClass(c)).classed(highlightClass, false);
                self.svgG.selectAll("text." + yLabelClass(c)).classed(highlightClass, false);
            });
        }


        cellsMerge.on("mouseover", (e, c) => {
            mouseoverCallbacks.forEach(callback => callback(c));
        })
            .on("mouseout", (e, c) => {
                mouseoutCallbacks.forEach(callback => callback(c));
            });

        cellsMerge.on("click", (e, c) => {
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
        var scale = plot.correlation.color.scale;

        plot.legend = new Legend(this.svg, this.svgG, scale, legendX, legendY).linearGradientBar(barWidth, barHeight);

    }

    attachScatterPlot(containerSelector, config) {
        var self = this;

        config = config || {};


        var scatterPlotConfig = {
            height: self.plot.height + self.config.margin.top + self.config.margin.bottom,
            width: self.plot.height + self.config.margin.top + self.config.margin.bottom,
            groups: {
                key: self.config.groups.key,
                label: self.config.groups.label
            },
            guides: true,
            showLegend: false
        };

        self.scatterPlot = true;

        scatterPlotConfig = Utils.deepExtend(scatterPlotConfig, config);
        this.update();

        this.on("cell-selected", (c) => {


            scatterPlotConfig.x = {
                key: c.rowVar,
                label: self.plot.labelByVariable[c.rowVar]
            };
            scatterPlotConfig.y = {
                key: c.colVar,
                label: self.plot.labelByVariable[c.colVar]
            };
            if (self.scatterPlot && self.scatterPlot !== true) {
                self.scatterPlot.setConfig(scatterPlotConfig).init();
            } else {
                self.scatterPlot = new ScatterPlot(containerSelector, self.data, scatterPlotConfig);
                this.attach("ScatterPlot", self.scatterPlot);
            }


        });


    }
}
