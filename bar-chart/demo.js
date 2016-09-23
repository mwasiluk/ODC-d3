var plot, plot2;
var data;
var seriesData;
function generateRandomData() {
    data  = exampleData(1);
    seriesData  = exampleData(3);
}
generateRandomData();

var config = {
    series: false
};
plot = new ODCD3.BarChart("#plot", data, config);

console.log(seriesData);
var config2 = {
    series: true
};
plot2 = new ODCD3.BarChart("#plot2", seriesData, config2);

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


$("#generateNewButton").click(function(){
    generateRandomData();
    plot.setData(data).init();
    plot2.setData(seriesData).init();
});
