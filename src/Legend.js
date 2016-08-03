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


    constructor(svg, legendParent, scale, legendX, legendY){
        this.scale=scale;
        this.svg = svg;

        this.container =  Utils.selectOrAppend(legendParent, "g."+this.legendClass, "g")
            .attr("transform", "translate("+legendX+","+legendY+")")
            .classed(this.legendClass, true);

    }

    linearGradientBar(barWidth, barHeight){
        var gradientId = this.cssClassPrefix+"linear-gradient";
        var scale= this.scale;

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
        ticks.enter().append("text")
            .attr("x", barWidth)
            .attr("y",  (d, i) =>  barHeight -(i*barHeight/ticksNumber))
            .attr("dx", 3)
            // .attr("dy", 1)
            .attr("alignment-baseline", "middle")
            .text(d=>d);

        ticks.exit().remove();

        return this;
    }

}