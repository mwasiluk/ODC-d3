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
    /*groups:{
        key: 'species',
        label: "species"
    },*/
    series:true,
    mainRegression: false,
    groupRegression: true,
    confidence:{
        level: 0.95
    }


};


var confArray={

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
var conf = confFlowers;

d3.csv("../data/flowers.csv").then(function(data) {
    console.log(data);
    // data = d3.nest().key(function(d){return d.species}).entries(data);
    data = nest(data, function(d){return d.species});
    plot = new ODCD3.Regression("#plot", data, conf);
    setTimeout(function(){
        conf.confidence.level = 0.9999;
        // plot = new ODCD3.Regression("#plot", data, conf);
        plot.setConfig(conf).init();
    }, 1000);
});

function nest(entries, key) {
    return Array.from(d3.group(entries, key)).map(function (d) {
        return {key: d[0], values: d[1]}
    })
}