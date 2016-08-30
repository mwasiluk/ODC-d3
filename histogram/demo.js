var confFlowers = {
    x:{
        key: 'petal length',
        label: 'petal length'
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
var plot, plot2;
var conf = confFlowers;


function generateRandomData() {
    return d3.range(1000).map(d3.random.irwinHall(20));
}
var values = generateRandomData();
var irwinHallConfig = {
    x:{
        ticks: 14
    }
};
plot = new ODCD3.Histogram("#plot", values, irwinHallConfig);

d3.csv("../data/flowers.csv", function(error, data) {
    console.log(data);
    plot2 = new ODCD3.Histogram("#plot2", data, conf);

});

$("#generateNewButton").click(function(){
    values = generateRandomData();
    plot.setData(values).init();
});
