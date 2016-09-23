


var configEurostat = {
    y:{
        key: 'geo',
        title: 'Country',
        sortLabels: true,
        rotateLabels: true,
        groups:{
            keys: ['geo'],
            labels:['Name'],
            value: function(d,k) { return d[k]<='Poland' ? '<=Poland' : '>Poland' }
        }
    },
    x:{
        key: 'time',
        title: 'Year',
        sortLabels: true,
        fillMissing: false,
        // rotateLabels: false
    },
    z:{
        decimalPlaces: 2,
        key: 'value',
        fillMissing: false,
        formatter: function(v){ return Intl.NumberFormat().format(v) }
    },
    color:{
        scale: "linear",
        // reverseScale: false,
        // range: ["darkblue", "orange", "darkred"]
    },
    cell:{
        sizeMax: 20
    },
    legend:{
        width: 35,
        rotateLabels: true,
    }
};


var plot;
var plot2;
var plot3;
var plot4;
var conf2, conf3, conf4, configEurostat2;

d3.json("../data/eurostat3.json", function(error, data) {

    var filtered  = data.filter(function (d, i){
        return d.time % 4 == 0 && d.geo > 'H' && d.geo.length<25 && d.sex == 'Total' && d.age == "Total";
    });

    // console.log(filtered);

    plot =new ODCD3.HeatmapTimeSeries("#plot", filtered, configEurostat);

    conf2 = _.cloneDeep(configEurostat);
    // conf2.color.scale = "log";
    conf2.x.fillMissing = true;
    // plot2 =new ODCD3.HeatmapTimeSeries("#plot2", filtered, conf2);

    conf3 = _.cloneDeep(configEurostat);
    conf3.z.fillMissing = true;
    conf3.x.fillMissing = true;
    // conf2.x.displayFormat='%a - %d';
    // conf3.color.range = ["darkblue", "orange", "darkred"]
    configEurostat2 = conf3;
    plot3 =new ODCD3.HeatmapTimeSeries("#plot2", filtered, conf3);

    conf4 = _.cloneDeep(conf3);
    conf4.color.scale = "log";
    conf4.color.reverseScale = false;
    // conf4.color.range = ["darkblue", "yellow", "darkred"];
    conf4.x.groups={
        keys: ['time'],
        value: function(d,k) { return parseInt(d[k])<1990 ? '<1990' : '>=1990'}
    }
    // plot4 =new ODCD3.HeatmapTimeSeries("#plot2", filtered, conf4);

});
var config,config2,simpleData;
d3.csv("../data/test.csv", function(error, data) {
    console.log(data);
    simpleData = data;
    config = {
        x:{
            key: 'time',
            sortLabels: true,
            fillMissing: false,
            // displayFormat: '%d'
            // rotateLabels: false
        },
        y:{
            key: 'a',
            sortLabels: true,
        },
        z:{
            key: 'b',
            fillMissing: false
        },
        cell:{
            sizeMax: 30
        },
    };
    config2 = _.cloneDeep(config);
    config2.x.fillMissing=true;
    config2.x.displayFormat='%a - %d';
    config2.z.fillMissing=true;

    plot3 = new ODCD3.HeatmapTimeSeries("#plot3", data, config);
    plot4 = new ODCD3.HeatmapTimeSeries("#plot4", data, config2);

});