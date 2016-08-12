import {Chart, ChartConfig} from "./chart";
import {Utils} from './utils'
import {StatisticsUtils} from './statistics-utils'
import {Legend} from './legend'

export class HeatmapConfig extends ChartConfig {

    svgClass = 'odc-heatmap';
    showTooltip = true; //show tooltip on dot hover
    tooltip = {
         noDataText: "N/A"
    };
    showLegend = true;
    highlightLabels = true;
    x={// X axis config
        title: '', // axis title
        key: 0,
        value: (d) => d[this.x.key], // x value accessor
        rotateLabels: true,
        sortLabels: false,
        sortComparator: (a, b)=> Utils.isNumber(a) ? a-b : a.localeCompare(b),
        groups: {
            keys: [],
            labels: [],
            value: (d, key) => d[key],

        }
        
    };
    y={// Y axis config
        title: '', // axis title,
        rotateLabels: true,
        key: 1,
        value: (d) => d[this.y.key], // y value accessor
        sortLabels: false,
        sortComparator: (a, b)=> Utils.isNumber(b) ? b-a : b.localeCompare(a),
        groups: {
            keys: [],
            labels: [],
            value: (d, key) => d[key]
        }
    };
    z = {
        key: 3,
        label: 'Z', // axis label,
        value: (d) =>  d[this.z.key],
        notAvailableValue: (v) =>  v === null || v===undefined

    };
    color = {
        noDataColor: "white",
        scale: "linear",
        range: ["darkblue", "lightskyblue", "orange", "crimson", "darkred"]
    };
    cell = {
        width: undefined,
        height: undefined,
        sizeMin: 15,
        sizeMax: 250,
        padding: 0
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
            matrixes: undefined,
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



        self.plot.groupByY = !!config.y.groups.keys.length;
        self.plot.groupByX = !!config.x.groups.keys.length;

        y.groups = {
            key: undefined,
            label: '',
            values: [],
            children: null,
            level:0,
            index: 0,
            lastIndex: 0
        };
        x.groups = {
            key: undefined,
            label: '',
            values: [],
            children: null,
            level:0,
            index: 0,
            lastIndex: 0
        };

        var valueMap = {};
        var minZ = undefined;
        var maxZ = undefined;
        this.data.forEach(d=>{

            var xVal = x.value(d);
            var yVal = y.value(d);
            var zValRaw = z.value(d);
            var zVal = config.z.notAvailableValue(zValRaw) ? undefined : parseFloat(zValRaw);



            if(x.uniqueValues.indexOf(xVal)===-1){
                x.uniqueValues.push(xVal);
            }

            if(y.uniqueValues.indexOf(yVal)===-1){
                y.uniqueValues.push(yVal);
            }

            var groupY = y.groups;
            if(self.plot.groupByY){
                groupY = this.updateGroups(d, yVal, y.groups, config.y.groups);
            }
            var groupX = x.groups;
            if(self.plot.groupByX){

                groupX = this.updateGroups(d, xVal, x.groups, config.x.groups);
            }

            if(!valueMap[groupY.index]){
                valueMap[groupY.index]={};
            }

            if(!valueMap[groupY.index][groupX.index]){
                valueMap[groupY.index][groupX.index] = {};
            }
            if(!valueMap[groupY.index][groupX.index][yVal]){
                valueMap[groupY.index][groupX.index][yVal]={};
            }
            valueMap[groupY.index][groupX.index][yVal][xVal]=zVal;


            if(minZ === undefined || zVal<minZ){
                minZ = zVal;
            }
            if(maxZ === undefined || zVal>maxZ){
                maxZ = zVal;
            }
        });
        self.plot.valueMap = valueMap;


        if(!self.plot.groupByX) {
            x.groups.values = x.uniqueValues;
        }

        if(!self.plot.groupByY) {
            y.groups.values = y.uniqueValues;
        }

        x.gaps=[];
        x.totalValuesCount=0;
        x.allValuesList=[];
        this.sortGroups(x, x.groups, config.x);


        y.gaps=[];
        y.totalValuesCount=0;
        y.allValuesList=[];
        this.sortGroups(y, y.groups, config.y);

        z.min = minZ;
        z.max = maxZ;

        this.buildCells();

    }
    buildCells(){
        var self = this;
        var config = self.config;
        var x = self.plot.x;
        var y = self.plot.y;
        var z = self.plot.z;
        var valueMap = self.plot.valueMap;

        var matrixCells = self.plot.cells =[];
        var matrix = self.plot.matrix = [];

        y.allValuesList.forEach((v1, i)=> {
            var row = [];
            matrix.push(row);

            x.allValuesList.forEach((v2, j) => {
                var zVal =valueMap[v1.group.index][v2.group.index][v1.val][v2.val];
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

    }

    updateGroups(d,axisVal, rootGroup, axisGroupsConfig){

        var config = this.config;
        var currentGroup = rootGroup;
        axisGroupsConfig.keys.forEach((groupKey, groupKeyIndex) => {
            currentGroup.key = groupKey;
            if(axisGroupsConfig.labels && axisGroupsConfig.labels.length>groupKeyIndex){
                currentGroup.label = axisGroupsConfig.labels[groupKeyIndex];
            }
            if(!currentGroup.children){
                currentGroup.children = {};
            }

            var groupingValue = axisGroupsConfig.value.call(config, d, groupKey);

            if(!currentGroup.children.hasOwnProperty(groupingValue)){
                rootGroup.lastIndex++;
                currentGroup.children[groupingValue] = {
                    values: [],
                    children: null,
                    level: currentGroup.level + 1,
                    index: rootGroup.lastIndex
                }
            }

            currentGroup = currentGroup.children[groupingValue];
        });

        if(currentGroup.values.indexOf(axisVal)===-1){
            currentGroup.values.push(axisVal);
        }

        return currentGroup;
    }

    sortGroups(axis, group, axisConfig, gaps){
        if(!gaps){
            gaps = [0];
        }
        if(gaps.length<=group.level){
            gaps.push(0);
        }
        group.gaps = gaps.slice();
        group.gapsSize = Heatmap.computeGapsSize(group.gaps);
        if(group.values){
            if(axisConfig.sortLabels){
                group.values.sort(axisConfig.sortComparator);
            }
            group.values.forEach(v=>axis.allValuesList.push({val:v, group: group}));
            axis.totalValuesCount += group.values.length;
        }

        group.childrenList = [];
        if(group.children){
            var childrenCount=0;

            for(var childProp in group.children){
                if(group.children.hasOwnProperty(childProp)){
                    var child = group.children[childProp];
                    group.childrenList.push(child);
                    childrenCount++;

                    this.sortGroups(axis, child, axisConfig, gaps)
                    gaps[group.level]+=1;
                }
            }

            if(gaps && childrenCount>1){
                gaps[group.level]-=1;
            }

            if(axis.gaps.length < gaps.length){
                axis.gaps = gaps;
            }

        }

    }

    static computeGapSize(gapLevel){
        return 20/(gapLevel + 1);
    }

    static computeGapsSize(gaps){
        var gapsSize = 0;
        gaps.forEach((gapsNumber, gapsLevel)=> gapsSize += gapsNumber * Heatmap.computeGapSize(gapsLevel));
        return gapsSize;
    }

    computePlotSize() {

        var plot = this.plot;
        var conf = this.config;
        var margin = plot.margin;
        var availableWidth = Utils.availableWidth(this.config.width, this.getBaseContainer(), this.plot.margin);
        var availableHeight = Utils.availableHeight(this.config.height, this.getBaseContainer(), this.plot.margin);
        var width = availableWidth;
        var height = availableHeight;



        var xGapsSize = Heatmap.computeGapsSize(plot.x.gaps);
        var computedCellWidth = Math.max(conf.cell.sizeMin, Math.min(conf.cell.sizeMax, (availableWidth-xGapsSize) / this.plot.x.totalValuesCount));
        if (this.config.width) {

            if (!this.config.cell.width) {
                this.plot.cellWidth = computedCellWidth;
            }

        } else {
            this.plot.cellWidth = this.config.cell.width;

            if (!this.plot.cellWidth) {
                this.plot.cellWidth = computedCellWidth;
            }

        }
        width = this.plot.cellWidth * this.plot.x.totalValuesCount + margin.left + margin.right+xGapsSize;

        var yGapsSize = Heatmap.computeGapsSize(plot.y.gaps);
        var computedCellHeight = Math.max(conf.cell.sizeMin, Math.min(conf.cell.sizeMax, (availableHeight-yGapsSize) / this.plot.y.totalValuesCount));
        if(this.config.height){
            if (!this.config.cell.height) {
                this.plot.cellHeight = computedCellHeight;
            }
        }else {
            this.plot.cellHeight = this.config.cell.height;

            if (!this.plot.cellHeight) {
                this.plot.cellHeight = computedCellHeight;
            }

        }

        height = this.plot.cellHeight * this.plot.y.totalValuesCount + margin.top + margin.bottom + yGapsSize;


        this.plot.width = width - margin.left - margin.right;
        this.plot.height =height -margin.top - margin.bottom;
    }


    setupZScale() {

        var self = this;
        var config = self.config;
        var z = self.plot.z;
        var range = config.color.range;
        var extent = z.max - z.min;
        if(config.color.scale=="log"){
            z.domain = [];
            range.forEach((c, i)=>{
                var v = z.min + (extent/Math.pow(10, i));
                z.domain.unshift(v)
            });
        }else{
            z.domain = [];
            range.forEach((c, i)=>{
                var v = z.min + (extent * (i/(range.length-1)));
                z.domain.push(v)
            });
        }
        z.domain[0]=z.min; //removing unnecessary floating points
        z.domain[z.domain.length-1]=z.max; //removing unnecessary floating points
        console.log(z.domain);

        var plot = this.plot;

        console.log(range);
        plot.z.color.scale = d3.scale[config.color.scale]().domain(z.domain).range(range);
        var shape = plot.z.shape = {};

        var cellConf = this.config.cell;
        shape.type = "rect";

        plot.z.shape.width = plot.cellWidth - cellConf.padding * 2;
        plot.z.shape.height = plot.cellHeight - cellConf.padding * 2;
    }


    update(newData) {
        super.update(newData);
        this.updateCells();
        this.updateVariableLabels();

        if (this.config.showLegend) {
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
            .data(plot.x.allValuesList, (d, i)=>i);

        labelsX.enter().append("text").attr("class", (d, i) => labelClass + " " +labelXClass+" "+ labelXClass + "-" + i);


        labelsX
            .attr("x", (d, i) => (i * plot.cellWidth + plot.cellWidth / 2) +(d.group.gapsSize))
            .attr("y", plot.height)
            .attr("dy", 15)

            .attr("text-anchor", "middle")
            .text(d=>d.val);

        if(self.config.x.rotateLabels){
            labelsX.attr("transform", (d, i) => "rotate(-45, " + ((i * plot.cellWidth + plot.cellWidth / 2) +d.group.gapsSize  ) + ", " + plot.height + ")")
                .attr("dx", -2)
                .attr("dy", 5)
                .attr("text-anchor", "end");
        }


        labelsX.exit().remove();


        var labelsY = self.svgG.selectAll("text."+labelYClass)
            .data(plot.y.allValuesList);

        labelsY.enter().append("text");


        labelsY
            .attr("x", 0)
            .attr("y", (d, i) => (i * plot.cellHeight + plot.cellHeight / 2) + d.group.gapsSize)
            .attr("dx", -2)
            .attr("text-anchor", "end")
            .attr("class", (d, i) => labelClass + " " + labelYClass +" " + labelYClass + "-" + i)

            .text(d=>d.val);

        if(self.config.y.rotateLabels){
            labelsY
                .attr("transform", (d, i) => "rotate(-45, " + (0  ) + ", " + (d.group.gapsSize+(i * plot.cellHeight + plot.cellHeight / 2)) + ")")
                .attr("text-anchor", "end");
                // .attr("dx", -7);
        }else{
            labelsY.attr("dominant-baseline", "middle")
        }

        labelsY.exit().remove();


    }

    updateCells() {

        var self = this;
        var plot = self.plot;
        var cellClass = self.prefixClass("cell");
        var cellShape = plot.z.shape.type;
        
        

        var cells = self.svgG.selectAll("g."+cellClass)
            .data(self.plot.cells);

        var cellEnterG = cells.enter().append("g")
            .classed(cellClass, true);
        cells.attr("transform", c=> "translate(" + ((plot.cellWidth * c.col + plot.cellWidth / 2)+c.colVar.group.gapsSize) + "," + ((plot.cellHeight * c.row + plot.cellHeight / 2)+c.rowVar.group.gapsSize) + ")");

        var shapes = cells.selectOrAppend(cellShape+".cell-shape-"+cellShape);

        shapes
            .attr("width", plot.z.shape.width)
            .attr("height", plot.z.shape.height)
            .attr("x", -plot.cellWidth / 2)
            .attr("y", -plot.cellHeight / 2);

        shapes.style("fill", c=> c.value === undefined ? self.config.color.noDataColor : plot.z.color.scale(c.value));

        var mouseoverCallbacks = [];
        var mouseoutCallbacks = [];

        if (plot.tooltip) {

            mouseoverCallbacks.push(c=> {
                plot.tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                var html = c.value === undefined ? self.config.tooltip.noDataText : c.value;

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
