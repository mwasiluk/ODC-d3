var confFlowers = {
    // width: 500,
    // height: 500,


    x:{
        key: 'species',
        // label: "species"
    },
    y:{
        /* key: 'petal width',
         label: 'petal width'*/
        key: 'species'
        // title: "species"
    },
    z:{
        key: 'petal length'
    }
};

var confFlowers2 = {

    x:{
        key: 'species',
        title: 'species',
        sortLabels: true
    },
    y:{
        key: 'petal width',
        title: 'petal width',
        sortLabels: true,
        rotateLabels: false
    },
    z:{
        key: 'petal length'
    },

    color : {
        scale: "linear"
    }



};

var confFlowers3 = {
    width: 600,
    height: 200,
    y:{
        key: 'species',
        title: 'species',
        sortLabels: true,
        rotateLabels: true

    },
    x:{
        key: 'petal width',
        title: 'petal width',
        sortLabels: true,
        rotateLabels: false
    },
    z:{
        key: 'petal length'
    },

    color : {
        scale: "log",
        range: ["green", "orange", "darkred"]
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

d3.csv("../data/flowers.csv", function(error, data) {
    console.log(data);
    plot = new ODCD3.Heatmap("#plot", data, conf);

    var plot2 =new ODCD3.Heatmap("#plot2", data, confFlowers2);
    var plot3 =new ODCD3.Heatmap("#plot3", data, confFlowers3);

});