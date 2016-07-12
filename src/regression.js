import {Chart, ChartConfig} from "./chart";
import {ScatterPlot, ScatterPlotConfig} from "./scatterplot";
import {Utils} from './utils'
import {StatisticsUtils} from './statistics-utils'

export class RegressionConfig extends ScatterPlotConfig{

    mainRegression = true;
    groupRegression = true;

    constructor(custom){
        super();

        if(custom){
            Utils.deepExtend(this, custom);
        }

    }
}

export class Regression extends ScatterPlot{
    constructor(placeholderSelector, data, config) {
        super(placeholderSelector, data, new RegressionConfig(config));
    }

    setConfig(config){
        return super.setConfig(new RegressionConfig(config));
    }

    initPlot(){
        super.initPlot();
        this.initRegressionLines();
    }

    initRegressionLines(){

        var self = this;
        var groupsAvailable = self.config.groups && self.config.groups.value;

        self.plot.regressions= [];


        if(groupsAvailable && self.config.mainRegression){
            var regression = this.initRegression(this.data);
            self.plot.regressions.push(regression);
        }

        if(self.config.groupRegression){
            this.initGroupRegression();
        }

    }

    initGroupRegression() {
        var self = this;
        var dataByGroup = {};
        self.data.forEach (d=>{
            var groupVal = self.config.groups.value(d, self.config.groups.key);

            if(!groupVal && groupVal!==0){
                return;
            }

            if(!dataByGroup[groupVal]){
                dataByGroup[groupVal] = [];
            }
            dataByGroup[groupVal].push(d);
        });

        for(var key in dataByGroup){
            if (!dataByGroup.hasOwnProperty(key)) {
                continue;
            }

            var regression = this.initRegression(dataByGroup[key], key);
            self.plot.regressions.push(regression);
        }
    }

    initRegression(values, groupVal){
        var self = this;

        var points = values.map(d=>{
            return [parseFloat(self.plot.x.value(d)), parseFloat(self.plot.y.value(d))];
        });

        var linearRegression =  StatisticsUtils.linearRegression(points);
        var linearRegressionLine = StatisticsUtils.linearRegressionLine(linearRegression);

        var extentX = d3.extent(points, d=>d[0]);


        var linePoints = [
            {
                x: extentX[0],
                y: linearRegressionLine(extentX[0])
            },
            {
                x: extentX[1],
                y: linearRegressionLine(extentX[1])
            }
        ];

        var line = d3.svg.line()
            .interpolate("basis")
            .x(d => self.plot.x.scale(d.x))
            .y(d => self.plot.y.scale(d.y));


        var color = self.plot.dot.color;
        if(Utils.isFunction(color)){
            if(values.length){
                color = color(values[0]);
            }else{
                color = "black";
            }

        }
        
        return {
            group: groupVal || false,
            line: line,
            linePoints: linePoints,
            color: color
        };
    }



    update(newData){
        super.update(newData);

        this.updateRegressionLines();
    };

    updateRegressionLines() {
        var self = this;
        var regressionClass = this.prefixClass("regression");
        var regressionSelector = "g."+regressionClass;
        var regression = self.svgG.selectAll(regressionSelector)
            .data(self.plot.regressions);

        var line = regression.enter()
            .appendSelector(regressionSelector)
            .append("path")
            .attr("class", self.prefixClass("line"))
            .attr("shape-rendering", "optimizeQuality");
            // .append("line")
            // .attr("class", "line")
            // .attr("shape-rendering", "optimizeQuality");

        line
            // .attr("x1", r=> self.plot.x.scale(r.linePoints[0].x))
            // .attr("y1", r=> self.plot.y.scale(r.linePoints[0].y))
            // .attr("x2", r=> self.plot.x.scale(r.linePoints[1].x))
            // .attr("y2", r=> self.plot.y.scale(r.linePoints[1].y))
            .attr("d", function(r) { return r.line(r.linePoints); })
            .style("stroke", function(r) { return r.color; });

    }


}

