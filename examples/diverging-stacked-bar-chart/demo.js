var confFlowers = {
    // width: 500,
    // height: 500,

    guides: true,
    categoryNames: ["Low", "High"]

    // series: true

};

var plot;
var conf = {
    categoryNames: ["Low", "High"],
    colorRange: ["#4f81bd", "#9bbb59"],
    middleValue: 100
};

data = exampleData();
plot = new ODCD3.DivergingStackedBarChart("#plot", data, conf);


function exampleData() {
    return  [
        {
            key: "Sample 1",
            values: [
                100, 200
            ],
            categories: [0, 1]
        },
        {
            key: "Sample 2",
            values: [
                20, 300
            ],
            categories: [1, 0]
        },
        {
            key: "Sample 3",
            values: [30, 45]
        }


    ];
}