import {Chart, ChartConfig} from "./chart";
import {Heatmap, HeatmapConfig} from "./heatmap";
import {Utils} from './utils'
import {StatisticsUtils} from './statistics-utils'


export class HeatmapTimeSeriesConfig extends HeatmapConfig{

    
    constructor(custom){
        super();

        if(custom){
            Utils.deepExtend(this, custom);
        }

    }
}

export class HeatmapTimeSeries extends Heatmap{
    constructor(placeholderSelector, data, config) {
        super(placeholderSelector, data, new HeatmapTimeSeriesConfig(config));
    }

    setConfig(config){
        return super.setConfig(new HeatmapTimeSeriesConfig(config));
    }

    initPlot(){
        super.initPlot();
    }

    update(newData){
        super.update(newData);

    };
}

