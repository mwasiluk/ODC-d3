var confFlowers = {
    // width: 500,
    // height: 500,
    guides: true,
    dot:{
        // color: function(d) { return d[0]*d[1] }
    },
    y:{
        title: 'sepal width',
        key: 'sepal width'
        // value: function(d){return d['petal width']}
    },
    groups:{
        key: 'species'
    },
    tukey: true
    // series: true

};

var plot;
var conf = {
    // series: true
};


data = exampleData2();
plot = new ODCD3.BoxPlot("#plot", data, conf);


var plot2;
d3.csv("../data/flowers.csv").then(function(data) {
    // data = d3.nest().key(function(d){return d.species}).entries(data);
    console.log(data);
    plot2 = new ODCD3.BoxPlot("#plot2", data, confFlowers);

});

function exampleData() {
    return  [
        {
            key: "Sample 1",
            values: {
                Q1: 300,
                Q2: 350,
                Q3: 400,
                whiskerLow: 225,
                whiskerHigh: 425,
                outliers: [175]
            }
        },
        {
            key: "Sample 2",
            values: {
                Q1: 50,
                Q2: 100,
                Q3: 125,
                whiskerLow: 25,
                whiskerHigh: 175,
                outliers: [0, 250]
            }
        },
        {
            key: "Sample 3",
            values: {
                Q1: 160,
                Q2: 210,
                Q3: 260,
                whiskerLow: 105,
                whiskerHigh: 330,
                outliers: [40, 90, 400]
            }
        }


    ];
}

function exampleData2() {
    return d3.range(1000).map(d3.randomIrwinHall(20));
}
function exampleData3() {
    return [{
        key: 'Random bates',
        values: d3.range(1000).map(d3.randomBates(10))
    }]
}


$("#plot2-y-key").change(function(){

    confFlowers.y.title = confFlowers.y.key =  $(this).val();
    plot2.setConfig(confFlowers).init();
});

$("#transition").change(function(){
    console.log('transition '+this.checked);
    conf.transition = confFlowers.transition = this.checked;
    plot.setConfig(conf).init();
    plot2.setConfig(confFlowers).init();
});

$("#plot2-tukey").change(function(){

    confFlowers.tukey =this.checked;
    plot2.setConfig(confFlowers).init();
});