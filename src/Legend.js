import {Utils} from "./utils";
import {color, size, symbol} from "../bower_components/d3-legend/no-extend";

/*var d3 = require('../bower_components/d3');
*/
// var legend = require('../bower_components/d3-legend/no-extend');
//
// module.exports.legend = legend;

export class Legend {

    cssClassPrefix="odc-";
    legendClass=this.cssClassPrefix+"legend";
    container;
    scale;
    color= color;
    size = size;
    symbol= symbol;
    guid;

    labelFormat = undefined;

    constructor(svg, legendParent, scale, legendX, legendY, labelFormat){
        this.scale=scale;
        this.svg = svg;
        this.guid = Utils.guid();
        this.container =  Utils.selectOrAppend(legendParent, "g."+this.legendClass, "g")
            .attr("transform", "translate("+legendX+","+legendY+")")
            .classed(this.legendClass, true);

        this.labelFormat = labelFormat;
    }



    linearGradientBar(barWidth, barHeight, title){
        var gradientId = this.cssClassPrefix+"linear-gradient"+"-"+this.guid;
        var scale= this.scale;
        var self = this;

        this.linearGradient = Utils.linearGradient(this.svg, gradientId, this.scale.range(), 0, 100, 0, 0);

        this.container.append("rect")
            .attr("width", barWidth)
            .attr("height", barHeight)
            .attr("x", 0)
            .attr("y", 0)
            .style("fill", "url(#"+gradientId+")");


        var ticks = this.container.selectAll("text")
            .data( scale.domain() );
        var ticksNumber =scale.domain().length-1;
        ticks.enter().append("text");

        ticks.attr("x", barWidth)
            .attr("y",  (d, i) =>  barHeight -(i*barHeight/ticksNumber))
            .attr("dx", 3)
            // .attr("dy", 1)
            .attr("alignment-baseline", "middle")
            .text(d=> self.labelFormat ? self.labelFormat(d) : d);
        ticks.attr("dominant-baseline", "middle")
        if(this.rotateLabels){
            ticks
                .attr("transform", (d, i) => "rotate(-45, " + barWidth + ", " + (barHeight -(i*barHeight/ticksNumber)) + ")")
                .attr("text-anchor", "start")
                .attr("dx", 5)
                .attr("dy", 5);

        }else{

        }

        ticks.exit().remove();

        return this;
    }

    setRotateLabels(rotateLabels) {
        this.rotateLabels = rotateLabels;
        return this;
    }
}