
confFlowers = new ODCD3.HeatmapConfig();
confFlowers.legend.decimalPlaces=3;
confFlowers.x.key='species';
confFlowers.y.key='petal width';
confFlowers.y.sortLabels=true;
confFlowers.y.title= 'petal width';
confFlowers.y.rotateLabels=false;
confFlowers.z.key='petal length';
confFlowers.cell.sizeMax=35;

var confFlowers2 = {
    width: 600,
    // height: 200,
    y:{
        key: 'sepal width',
        title: 'sepal width',

        sortLabels: true,
        rotateLabels: false,

        groups:{
            keys: ['species',  'sepal width'],
            value: function(d,k){return k=='sepal width'? (d[k] < 3 ? ' < 3' : ' >= 3') : d[k]}
        }
    },
    x :{
        key: 'petal width',
        title: 'petal width',
        sortLabels: true,
        rotateLabels: true,

        /*groups:{
         keys: ['petal width'],
         labels: ['petal width'],
         value: (d,k) => {
         var val = parseFloat(d[k]);
         if(!val || val < 1.5){
         return  'petal width < 1.5'
         }

         return 'petal width >= 1.5'
         }
         }*/
    },
    z:{
        key: 'petal length'
    },

    color : {
        // scale: "log",
        // range: ["green", "orange", "darkred"]
    },
    legend:{
        decimalPlaces: 3
    }



};

var confFlowers3 = {
    width: 600,
    // height: 200,
    x:{
        key: 'sepal width',
        title: 'sepal width',

        sortLabels: true,
        rotateLabels: true,

        groups:{
            keys: ['species',  'sepal width'],
            labels: ['Species', 'Sepal width'],
            value: function(d,k){ return k=='sepal width'? (d[k] < 3 ? ' < 3' : ' >= 3') : d[k]}
        }
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
        scale: "log",
        range: ["green", "orange", "darkred"]
    }

};

var confFlowers4 = {
    width: 600,
    // height: 200,
    x:{
        key: 'sepal width',
        title: 'sepal width',

        sortLabels: true,
        rotateLabels: true,

        groups:{
            keys: ['species',  'sepal width'],
            labels: ['Species', 'Sepal width'],
            value: function(d,k){ return k=='sepal width'? (d[k] < 3 ? ' < 3' : ' >= 3') : d[k]}
        }
    },
    y:{
        key: 'petal width',
        title: 'petal width',
        sortLabels: true,
        rotateLabels: false,

        groups:{
            keys: ['petal width'],
            labels: ['petal width'],
            value: function(d,k)  {
                var val = parseFloat(d[k]);
                if(!val || val < 1.5){
                    return  ' < 1.5'
                }

                return ' >= 1.5'
            }
        }
    },
    z:{
        key: 'petal length'
    },

    color : {
        // scale: "log",
        range: ["green", "orange", "darkred"]
    },




};
// sepal length,sepal width,petal length,petal width,species

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



var configEurostat = {
    y:{
        key: 'geo',
        title: 'geo',

        sortLabels: true,
        rotateLabels: true,

        groups: {
            keys: ['agrarea']
        }
        // groups:{
        //     keys: ['sex'],
        //     labels: ['sex'],
        // }
    },
    x:{
        key: 'time',
        title: 'Time',
        sortLabels: true,
        rotateLabels: true,
        groups:{
            keys: ['time'],
            labels: ['test'],
            value: function(d,k) { return parseInt(d[k])<2010}
        }
    },
    z:{
        key: 'value',
        title: 'Population on 1 January',
        scale: "linear"
    }
}





var plot;
var conf = confFlowers;
var plot2;
var plot3;
var plot4;
d3.csv("../data/flowers.csv", function(error, data) {
    console.log(data);
    plot = new ODCD3.Heatmap("#plot", data, conf);

    plot2 =new ODCD3.Heatmap("#plot2", data, confFlowers2);
    plot3 =new ODCD3.Heatmap("#plot3", data, confFlowers3);
    plot4 =new ODCD3.Heatmap("#plot4", data, confFlowers4);
});

d3.json("../data/eurostat.json", function(error, data) {
    console.log(data); // this is your data
    // plot4 =new ODCD3.Heatmap("#plot4", data, configEurostat);

});