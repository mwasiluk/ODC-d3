var conf = {
    // width: 500,
    // height: 500,
    dot:{
        // color: 'red'
    },
    x:{
        // scale: "log"
    }
};
var data = [
    [1,2],
    [2,3],
    [3,4],
    [6,4],
    [11,3],
    [1,3.5],
    [7,4],
    [5,4]

];
var plot = new D3ScatterPlot("#scatterplot", data, conf);

