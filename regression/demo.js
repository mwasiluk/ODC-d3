var confFlowers = {
    width: 800,
    height: 500,
    guides: true,

    x:{
        key: 'petal length',
        label: 'petal length'
    },
    y:{
        key: 'petal width',
        label: 'petal width'
    },
    groups:{
        key: 'species',
        label: "species"
    },
    mainRegression: false,
    groupRegression: true,
    confidence:{
        level: 0.95
    },
    showLegend:true


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
var plot2;

var data;
d3.csv("../data/flowers.csv", function(error, d) {
    data = d;
    console.log(data);

    plot = new ODCD3.Regression("#plot", data, confFlowers);



});

$("#confidence-level").on("change", function(event){
    if(!data){
        return ;
    }
    var val = $(this).val();
    confFlowers.confidence.level = val/1000;
    $("#confidence-level-display").text(confFlowers.confidence.level);
    plot.setConfig(confFlowers).init();
});