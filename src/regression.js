import {Chart, ChartConfig} from "./chart";
import {ScatterPlot, ScatterPlotConfig} from "./scatterplot";
import {Utils} from './utils'

export class RegressionConfig extends ScatterPlotConfig{

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
    }



    draw(){
        super.draw();
    };



    update(newData){
        super.update(newData);

    };
}

