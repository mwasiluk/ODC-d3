var confFlowers = {
    // width: 500,
    // height: 500,
    guides: true,
    dot:{
        // color: function(d) { return d[0]*d[1] }
    },
    x:{
        label: 'petal length'
    },
    y:{
        label: 'petal width'
    },
    groups:{
        key: 'species',
        label: "species",
        displayValue: {'setosa': 'Setosa'}
    }
    // series: true

};

var plot;
var conf = {

};

data = exampleData();
plot = new ODCD3.BoxPlotBase("#plot", data, conf);


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