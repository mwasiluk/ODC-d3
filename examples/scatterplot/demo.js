var conf = {
    // width: 500,
    // height: 500,
    guides: true,
    dot:{
        // color: function(d) { return d[0]*d[1] }
    },
    x:{
        // scale: "log"
    },
    groups:{
        label: "group"
    }

};
// conf = new  ODCD3.ScatterPlotConfig();
// conf.guides = true;

var data = [
    [1,2, 1],
    [2,3, 2],
    [3,4, 1],
    [6,4, 3],
    [11,3, 1],
    [1,3.5, 4],
    [7,4, 1],
    [5,4, 2]

];
var plot = new ODCD3.ScatterPlot("#scatterplot", data, conf);

