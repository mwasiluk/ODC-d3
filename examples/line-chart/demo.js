var confFlowers = {
    // width: 500,
    // height: 500,
    guides: true,
    dot:{
        // color: function(d) { return d[0]*d[1] }
    },
    x:{
        key: 'petal length',
        title: 'petal length'
    },
    y:{
        key: 'petal width',
        title: 'petal width'
    },
    groups:{
        key: 'species',
        label: "species",
        displayValue: {'setosa': 'Setosa'}
    },
    title: "Anderson's Iris data set",
    subtitle: "en.wikipedia.org/wiki/Iris_flower_data_set"
    // series: true

};
// conf = new  ODCD3.ScatterPlotConfig();
// conf.guides = true;

var confSeries={
    series: true
};

var dataArray = [
    [1,2, 1],
    [2,3, 2],
    [3,4, 1],
    [6,4, 3],
    [11,3, 1],
    [1,3.5, 4],
    [7,4, 1],
    [5,4, 2]

];
var plot;
var conf = confSeries;
var seriesData  = exampleData(3);
console.log(seriesData)
d3.csv("../data/flowers.csv").then(function(data) {
    console.log(data);

    // data = d3.nest().key(function(d){return d.species}).entries(data);
    plot = new ODCD3.LineChart("#plot", seriesData, conf);

});



function exampleData(g) {
    var layers =  stream_layers(g,10+Math.random()*10,.1);
    if(g==1) return layers[0];
    return layers.map(function(data, i) {
        return {
            key: 'Serie ' + (i+1),
            values: data
        };
    });
}


/* Inspired by Lee Byron's test data generator. */
function stream_layers(n, m, o) {
    if (arguments.length < 3) o = 0;
    function bump(a) {
        var x = 1 / (.1 + Math.random()),
            y = 2 * Math.random() - .5,
            z = 10 / (.1 + Math.random());
        for (var i = 0; i < m; i++) {
            var w = (i / m - y) * z;
            a[i] += x * Math.exp(-w * w);
        }
    }
    return d3.range(n).map(function() {
        var a = [], i;
        for (i = 0; i < m; i++) a[i] = o + o * Math.random();
        for (i = 0; i < 5; i++) bump(a);
        return a.map(stream_index);
    });
}


function stream_index(d, i) {
    return [i, Math.max(0, d)];
}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

