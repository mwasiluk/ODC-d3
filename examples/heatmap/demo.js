var confFlowers = {
    // width: 500,
    // height: 500,
    z:{
        key: 'petal length',
    },
    y:{
       /* key: 'petal width',
        label: 'petal width'*/
        key: 'species',
        // title: "species"
    },
    x:{
        key: 'species',
        // label: "species"
    }
};

var confFlowers2 = {
    z:{
        key: 'petal length'
    },
    y:{
         key: 'petal width',
        title: 'petal width',
        rotateLabels: false
    },
    x:{
        key: 'species',
        title: 'species',
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

});