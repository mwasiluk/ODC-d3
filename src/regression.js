import {Chart, ChartConfig} from "./chart";
import {ScatterPlot, ScatterPlotConfig} from "./scatterplot";
import {Utils} from './utils'
import {StatisticsUtils} from './statistics-utils'

export class RegressionConfig extends ScatterPlotConfig{

    mainRegression = true;
    groupRegression = true;
    confidence={
        level: 0.95,
        criticalValue: (degreesOfFreedom, criticalProbability) => StatisticsUtils.tValue(degreesOfFreedom, criticalProbability),
        marginOfError: undefined //custom  margin Of Error function (x, points)
    };

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
            var regression = this.initRegression(this.data, false);
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

        // points.sort((a,b) => a[0]-b[0]);

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

        var defaultColor = "black";
        if(Utils.isFunction(color)){
            if(values.length && groupVal!==false){
                color = color(values[0]);
            }else{
                color = defaultColor;
            }
        }else if(!color && groupVal===false){
            color = defaultColor;
        }


        var confidence = this.computeConfidence(points, extentX,  linearRegression,linearRegressionLine);
        return {
            group: groupVal || false,
            line: line,
            linePoints: linePoints,
            color: color,
            confidence: confidence
        };
    }

    computeConfidence(points, extentX, linearRegression,linearRegressionLine){
        var self = this;
        var slope = linearRegression.m;
        var n = points.length;
        var degreesOfFreedom = Math.max(0, n-2);

        var alpha = 1 - self.config.confidence.level;
        var criticalProbability  = 1 - alpha/2;
        var criticalValue = self.config.confidence.criticalValue(degreesOfFreedom,criticalProbability);

        var xValues = points.map(d=>d[0]);
        var meanX = StatisticsUtils.mean(xValues);
        var xMySum=0;
        var xSum=0;
        var xPowSum=0;
        var ySum=0;
        var yPowSum=0;
        points.forEach(p=>{
            var x = p[0];
            var y = p[1];

            xMySum += x*y;
            xSum+=x;
            ySum+=y;
            xPowSum+= x*x;
            yPowSum+= y*y;
        });
        var a = linearRegression.m;
        var b = linearRegression.b;

        var Sa2 = n/(n+2) * ((yPowSum-a*xMySum-b*ySum)/(n*xPowSum-(xSum*xSum))); //Wariancja współczynnika kierunkowego regresji liniowej a
        var Sy2 = (yPowSum - a*xMySum-b*ySum)/(n*(n-2)); //Sa2 //Mean y value variance

        var errorFn = x=> Math.sqrt(Sy2 + Math.pow(x-meanX,2)*Sa2); //pierwiastek kwadratowy z wariancji dowolnego punktu prostej
        var marginOfError =  x=> criticalValue* errorFn(x);


        // console.log('n', n, 'degreesOfFreedom', degreesOfFreedom, 'criticalProbability',criticalProbability);
        // var confidenceDown = x => linearRegressionLine(x) -  marginOfError(x);
        // var confidenceUp = x => linearRegressionLine(x) +  marginOfError(x);


        var computeConfidenceAreaPoint = x=>{
            var linearRegression = linearRegressionLine(x);
            var moe = marginOfError(x);
            var confDown = linearRegression - moe;
            var confUp = linearRegression + moe;
            return {
                x: x,
                y0: confDown,
                y1: confUp
            }

        };

        var centerX = (extentX[1]+extentX[0])/2;

        // var confidenceAreaPoints = [extentX[0], centerX,  extentX[1]].map(computeConfidenceAreaPoint);
        var confidenceAreaPoints = [extentX[0], centerX,  extentX[1]].map(computeConfidenceAreaPoint);

        var fitInPlot = y => y;

        var confidenceArea =  d3.svg.area()
        .interpolate("monotone")
            .x(d => self.plot.x.scale(d.x))
            .y0(d => fitInPlot(self.plot.y.scale(d.y0)))
            .y1(d => fitInPlot(self.plot.y.scale(d.y1)));

        return {
            area:confidenceArea,
            points:confidenceAreaPoints
        };
    }

    update(newData){
        super.update(newData);
        this.updateRegressionLines();
    };

    updateRegressionLines() {
        var self = this;
        var regressionContainerClass = this.prefixClass("regression-container");
        var regressionContainerSelector = "g."+regressionContainerClass;

        var clipPathId = self.prefixClass("clip");

        var regressionContainer = self.svgG.selectOrInsert(regressionContainerSelector, "."+self.dotsContainerClass);
        var regressionContainerClip = regressionContainer.selectOrAppend("clipPath")
            .attr("id", clipPathId);


        regressionContainerClip.selectOrAppend('rect')
            .attr('width', self.plot.width)
            .attr('height', self.plot.height)
            .attr('x', 0)
            .attr('y', 0);

        regressionContainer.attr("clip-path", function(d,i) { return "url(#"+clipPathId+")"; });

        var regressionClass = this.prefixClass("regression");
        var confidenceAreaClass = self.prefixClass("confidence");
        var regressionSelector = "g."+regressionClass;
        var regression = regressionContainer.selectAll(regressionSelector)
            .data(self.plot.regressions);

        var line = regression.enter()
            .insertSelector(regressionSelector)
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


        var area = regression.enter()
            .appendSelector(regressionSelector)
            .append("path")
            .attr("class", confidenceAreaClass)
            .attr("shape-rendering", "optimizeQuality");


        area
            .attr("d", r => r.confidence.area(r.confidence.points))
            .style("fill", r => r.color)
            .style("opacity", "0.4");


    }

}

