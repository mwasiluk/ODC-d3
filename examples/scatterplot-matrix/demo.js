
var labels = ['a', 'b', 'c', 'd'];
var config = {
    size: 200,
    guides: true,
    brush: true,
    tooltip: true,
    variables: {
        // keys: ['petal length', 'petal width'],
        // labels: ['a', 'b', 'c', 'd', 'e']
    },
    groups:{
        key: 'species'
    },
    x:{
    }

};
var data2 = [
    [1, 2, 3, 4, 5],
    [3, 4, 5, 2, 4],
    [5, 2, 0, 1, 7],
    [6, 8, 3, 7, 5],
    [1, 7, 3, 2, 1]
];
var data3 = [
    [4, 2, 3, 4, 5],
    [3, 4, 5, 2, 4],
    [5, 2, 2, 1, 7],
    [6, 1, 3, 2, 5],
    [1, 3, 3, 7, 1]
];
// data = [
//     [1, 2, 3],
//     [3, 4, 5],
//     [5, 2, 0],
//     [6, 8, 3],
//     [1, 7, 3]
// ];



var plot;
/*plot = new D3ScatterPlotMatrix("#scatterplot", data, conf);
plot.init();*/
d3.csv("flowers.csv", function(error, data) {
    console.log(data);
    plot = new D3ScatterPlotMatrix("#scatterplot", data, config);

});
