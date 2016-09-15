(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ODCD3 = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = {
  color: require('./src/color'),
  size: require('./src/size'),
  symbol: require('./src/symbol')
};

},{"./src/color":2,"./src/size":4,"./src/symbol":5}],2:[function(require,module,exports){
"use strict";

var helper = require('./legend');

module.exports = function () {

  var scale = d3.scale.linear(),
      shape = "rect",
      shapeWidth = 15,
      shapeHeight = 15,
      shapeRadius = 10,
      shapePadding = 2,
      cells = [5],
      labels = [],
      classPrefix = "",
      useClass = false,
      title = "",
      labelFormat = d3.format(".01f"),
      labelOffset = 10,
      labelAlign = "middle",
      labelDelimiter = "to",
      orient = "vertical",
      ascending = false,
      path,
      legendDispatcher = d3.dispatch("cellover", "cellout", "cellclick");

  function legend(svg) {

    var type = helper.d3_calcType(scale, ascending, cells, labels, labelFormat, labelDelimiter),
        legendG = svg.selectAll('g').data([scale]);

    legendG.enter().append('g').attr('class', classPrefix + 'legendCells');

    var cell = legendG.selectAll("." + classPrefix + "cell").data(type.data),
        cellEnter = cell.enter().append("g", ".cell").attr("class", classPrefix + "cell").style("opacity", 1e-6),
        shapeEnter = cellEnter.append(shape).attr("class", classPrefix + "swatch"),
        shapes = cell.select("g." + classPrefix + "cell " + shape);

    //add event handlers
    helper.d3_addEvents(cellEnter, legendDispatcher);

    cell.exit().transition().style("opacity", 0).remove();

    helper.d3_drawShapes(shape, shapes, shapeHeight, shapeWidth, shapeRadius, path);

    helper.d3_addText(legendG, cellEnter, type.labels, classPrefix);

    // sets placement
    var text = cell.select("text"),
        shapeSize = shapes[0].map(function (d) {
      return d.getBBox();
    });

    //sets scale
    //everything is fill except for line which is stroke,
    if (!useClass) {
      if (shape == "line") {
        shapes.style("stroke", type.feature);
      } else {
        shapes.style("fill", type.feature);
      }
    } else {
      shapes.attr("class", function (d) {
        return classPrefix + "swatch " + type.feature(d);
      });
    }

    var cellTrans,
        textTrans,
        textAlign = labelAlign == "start" ? 0 : labelAlign == "middle" ? 0.5 : 1;

    //positions cells and text
    if (orient === "vertical") {
      cellTrans = function cellTrans(d, i) {
        return "translate(0, " + i * (shapeSize[i].height + shapePadding) + ")";
      };
      textTrans = function textTrans(d, i) {
        return "translate(" + (shapeSize[i].width + shapeSize[i].x + labelOffset) + "," + (shapeSize[i].y + shapeSize[i].height / 2 + 5) + ")";
      };
    } else if (orient === "horizontal") {
      cellTrans = function cellTrans(d, i) {
        return "translate(" + i * (shapeSize[i].width + shapePadding) + ",0)";
      };
      textTrans = function textTrans(d, i) {
        return "translate(" + (shapeSize[i].width * textAlign + shapeSize[i].x) + "," + (shapeSize[i].height + shapeSize[i].y + labelOffset + 8) + ")";
      };
    }

    helper.d3_placement(orient, cell, cellTrans, text, textTrans, labelAlign);
    helper.d3_title(svg, legendG, title, classPrefix);

    cell.transition().style("opacity", 1);
  }

  legend.scale = function (_) {
    if (!arguments.length) return scale;
    scale = _;
    return legend;
  };

  legend.cells = function (_) {
    if (!arguments.length) return cells;
    if (_.length > 1 || _ >= 2) {
      cells = _;
    }
    return legend;
  };

  legend.shape = function (_, d) {
    if (!arguments.length) return shape;
    if (_ == "rect" || _ == "circle" || _ == "line" || _ == "path" && typeof d === 'string') {
      shape = _;
      path = d;
    }
    return legend;
  };

  legend.shapeWidth = function (_) {
    if (!arguments.length) return shapeWidth;
    shapeWidth = +_;
    return legend;
  };

  legend.shapeHeight = function (_) {
    if (!arguments.length) return shapeHeight;
    shapeHeight = +_;
    return legend;
  };

  legend.shapeRadius = function (_) {
    if (!arguments.length) return shapeRadius;
    shapeRadius = +_;
    return legend;
  };

  legend.shapePadding = function (_) {
    if (!arguments.length) return shapePadding;
    shapePadding = +_;
    return legend;
  };

  legend.labels = function (_) {
    if (!arguments.length) return labels;
    labels = _;
    return legend;
  };

  legend.labelAlign = function (_) {
    if (!arguments.length) return labelAlign;
    if (_ == "start" || _ == "end" || _ == "middle") {
      labelAlign = _;
    }
    return legend;
  };

  legend.labelFormat = function (_) {
    if (!arguments.length) return labelFormat;
    labelFormat = _;
    return legend;
  };

  legend.labelOffset = function (_) {
    if (!arguments.length) return labelOffset;
    labelOffset = +_;
    return legend;
  };

  legend.labelDelimiter = function (_) {
    if (!arguments.length) return labelDelimiter;
    labelDelimiter = _;
    return legend;
  };

  legend.useClass = function (_) {
    if (!arguments.length) return useClass;
    if (_ === true || _ === false) {
      useClass = _;
    }
    return legend;
  };

  legend.orient = function (_) {
    if (!arguments.length) return orient;
    _ = _.toLowerCase();
    if (_ == "horizontal" || _ == "vertical") {
      orient = _;
    }
    return legend;
  };

  legend.ascending = function (_) {
    if (!arguments.length) return ascending;
    ascending = !!_;
    return legend;
  };

  legend.classPrefix = function (_) {
    if (!arguments.length) return classPrefix;
    classPrefix = _;
    return legend;
  };

  legend.title = function (_) {
    if (!arguments.length) return title;
    title = _;
    return legend;
  };

  d3.rebind(legend, legendDispatcher, "on");

  return legend;
};

},{"./legend":3}],3:[function(require,module,exports){
"use strict";

module.exports = {

  d3_identity: function d3_identity(d) {
    return d;
  },

  d3_mergeLabels: function d3_mergeLabels(gen, labels) {

    if (labels.length === 0) return gen;

    gen = gen ? gen : [];

    var i = labels.length;
    for (; i < gen.length; i++) {
      labels.push(gen[i]);
    }
    return labels;
  },

  d3_linearLegend: function d3_linearLegend(scale, cells, labelFormat) {
    var data = [];

    if (cells.length > 1) {
      data = cells;
    } else {
      var domain = scale.domain(),
          increment = (domain[domain.length - 1] - domain[0]) / (cells - 1),
          i = 0;

      for (; i < cells; i++) {
        data.push(domain[0] + i * increment);
      }
    }

    var labels = data.map(labelFormat);

    return { data: data,
      labels: labels,
      feature: function feature(d) {
        return scale(d);
      } };
  },

  d3_quantLegend: function d3_quantLegend(scale, labelFormat, labelDelimiter) {
    var labels = scale.range().map(function (d) {
      var invert = scale.invertExtent(d),
          a = labelFormat(invert[0]),
          b = labelFormat(invert[1]);

      // if (( (a) && (a.isNan()) && b){
      //   console.log("in initial statement")
      return labelFormat(invert[0]) + " " + labelDelimiter + " " + labelFormat(invert[1]);
      // } else if (a || b) {
      //   console.log('in else statement')
      //   return (a) ? a : b;
      // }
    });

    return { data: scale.range(),
      labels: labels,
      feature: this.d3_identity
    };
  },

  d3_ordinalLegend: function d3_ordinalLegend(scale) {
    return { data: scale.domain(),
      labels: scale.domain(),
      feature: function feature(d) {
        return scale(d);
      } };
  },

  d3_drawShapes: function d3_drawShapes(shape, shapes, shapeHeight, shapeWidth, shapeRadius, path) {
    if (shape === "rect") {
      shapes.attr("height", shapeHeight).attr("width", shapeWidth);
    } else if (shape === "circle") {
      shapes.attr("r", shapeRadius); //.attr("cx", shapeRadius).attr("cy", shapeRadius);
    } else if (shape === "line") {
      shapes.attr("x1", 0).attr("x2", shapeWidth).attr("y1", 0).attr("y2", 0);
    } else if (shape === "path") {
      shapes.attr("d", path);
    }
  },

  d3_addText: function d3_addText(svg, enter, labels, classPrefix) {
    enter.append("text").attr("class", classPrefix + "label");
    svg.selectAll("g." + classPrefix + "cell text").data(labels).text(this.d3_identity);
  },

  d3_calcType: function d3_calcType(scale, ascending, cells, labels, labelFormat, labelDelimiter) {
    var type = scale.ticks ? this.d3_linearLegend(scale, cells, labelFormat) : scale.invertExtent ? this.d3_quantLegend(scale, labelFormat, labelDelimiter) : this.d3_ordinalLegend(scale);

    type.labels = this.d3_mergeLabels(type.labels, labels);

    if (ascending) {
      type.labels = this.d3_reverse(type.labels);
      type.data = this.d3_reverse(type.data);
    }

    return type;
  },

  d3_reverse: function d3_reverse(arr) {
    var mirror = [];
    for (var i = 0, l = arr.length; i < l; i++) {
      mirror[i] = arr[l - i - 1];
    }
    return mirror;
  },

  d3_placement: function d3_placement(orient, cell, cellTrans, text, textTrans, labelAlign) {
    cell.attr("transform", cellTrans);
    text.attr("transform", textTrans);
    if (orient === "horizontal") {
      text.style("text-anchor", labelAlign);
    }
  },

  d3_addEvents: function d3_addEvents(cells, dispatcher) {
    var _ = this;

    cells.on("mouseover.legend", function (d) {
      _.d3_cellOver(dispatcher, d, this);
    }).on("mouseout.legend", function (d) {
      _.d3_cellOut(dispatcher, d, this);
    }).on("click.legend", function (d) {
      _.d3_cellClick(dispatcher, d, this);
    });
  },

  d3_cellOver: function d3_cellOver(cellDispatcher, d, obj) {
    cellDispatcher.cellover.call(obj, d);
  },

  d3_cellOut: function d3_cellOut(cellDispatcher, d, obj) {
    cellDispatcher.cellout.call(obj, d);
  },

  d3_cellClick: function d3_cellClick(cellDispatcher, d, obj) {
    cellDispatcher.cellclick.call(obj, d);
  },

  d3_title: function d3_title(svg, cellsSvg, title, classPrefix) {
    if (title !== "") {

      var titleText = svg.selectAll('text.' + classPrefix + 'legendTitle');

      titleText.data([title]).enter().append('text').attr('class', classPrefix + 'legendTitle');

      svg.selectAll('text.' + classPrefix + 'legendTitle').text(title);

      var yOffset = svg.select('.' + classPrefix + 'legendTitle').map(function (d) {
        return d[0].getBBox().height;
      })[0],
          xOffset = -cellsSvg.map(function (d) {
        return d[0].getBBox().x;
      })[0];

      cellsSvg.attr('transform', 'translate(' + xOffset + ',' + (yOffset + 10) + ')');
    }
  }
};

},{}],4:[function(require,module,exports){
"use strict";

var helper = require('./legend');

module.exports = function () {

  var scale = d3.scale.linear(),
      shape = "rect",
      shapeWidth = 15,
      shapePadding = 2,
      cells = [5],
      labels = [],
      useStroke = false,
      classPrefix = "",
      title = "",
      labelFormat = d3.format(".01f"),
      labelOffset = 10,
      labelAlign = "middle",
      labelDelimiter = "to",
      orient = "vertical",
      ascending = false,
      path,
      legendDispatcher = d3.dispatch("cellover", "cellout", "cellclick");

  function legend(svg) {

    var type = helper.d3_calcType(scale, ascending, cells, labels, labelFormat, labelDelimiter),
        legendG = svg.selectAll('g').data([scale]);

    legendG.enter().append('g').attr('class', classPrefix + 'legendCells');

    var cell = legendG.selectAll("." + classPrefix + "cell").data(type.data),
        cellEnter = cell.enter().append("g", ".cell").attr("class", classPrefix + "cell").style("opacity", 1e-6),
        shapeEnter = cellEnter.append(shape).attr("class", classPrefix + "swatch"),
        shapes = cell.select("g." + classPrefix + "cell " + shape);

    //add event handlers
    helper.d3_addEvents(cellEnter, legendDispatcher);

    cell.exit().transition().style("opacity", 0).remove();

    //creates shape
    if (shape === "line") {
      helper.d3_drawShapes(shape, shapes, 0, shapeWidth);
      shapes.attr("stroke-width", type.feature);
    } else {
      helper.d3_drawShapes(shape, shapes, type.feature, type.feature, type.feature, path);
    }

    helper.d3_addText(legendG, cellEnter, type.labels, classPrefix);

    //sets placement
    var text = cell.select("text"),
        shapeSize = shapes[0].map(function (d, i) {
      var bbox = d.getBBox();
      var stroke = scale(type.data[i]);

      if (shape === "line" && orient === "horizontal") {
        bbox.height = bbox.height + stroke;
      } else if (shape === "line" && orient === "vertical") {
        bbox.width = bbox.width;
      }

      return bbox;
    });

    var maxH = d3.max(shapeSize, function (d) {
      return d.height + d.y;
    }),
        maxW = d3.max(shapeSize, function (d) {
      return d.width + d.x;
    });

    var cellTrans,
        textTrans,
        textAlign = labelAlign == "start" ? 0 : labelAlign == "middle" ? 0.5 : 1;

    //positions cells and text
    if (orient === "vertical") {

      cellTrans = function cellTrans(d, i) {
        var height = d3.sum(shapeSize.slice(0, i + 1), function (d) {
          return d.height;
        });
        return "translate(0, " + (height + i * shapePadding) + ")";
      };

      textTrans = function textTrans(d, i) {
        return "translate(" + (maxW + labelOffset) + "," + (shapeSize[i].y + shapeSize[i].height / 2 + 5) + ")";
      };
    } else if (orient === "horizontal") {
      cellTrans = function cellTrans(d, i) {
        var width = d3.sum(shapeSize.slice(0, i + 1), function (d) {
          return d.width;
        });
        return "translate(" + (width + i * shapePadding) + ",0)";
      };

      textTrans = function textTrans(d, i) {
        return "translate(" + (shapeSize[i].width * textAlign + shapeSize[i].x) + "," + (maxH + labelOffset) + ")";
      };
    }

    helper.d3_placement(orient, cell, cellTrans, text, textTrans, labelAlign);
    helper.d3_title(svg, legendG, title, classPrefix);

    cell.transition().style("opacity", 1);
  }

  legend.scale = function (_) {
    if (!arguments.length) return scale;
    scale = _;
    return legend;
  };

  legend.cells = function (_) {
    if (!arguments.length) return cells;
    if (_.length > 1 || _ >= 2) {
      cells = _;
    }
    return legend;
  };

  legend.shape = function (_, d) {
    if (!arguments.length) return shape;
    if (_ == "rect" || _ == "circle" || _ == "line") {
      shape = _;
      path = d;
    }
    return legend;
  };

  legend.shapeWidth = function (_) {
    if (!arguments.length) return shapeWidth;
    shapeWidth = +_;
    return legend;
  };

  legend.shapePadding = function (_) {
    if (!arguments.length) return shapePadding;
    shapePadding = +_;
    return legend;
  };

  legend.labels = function (_) {
    if (!arguments.length) return labels;
    labels = _;
    return legend;
  };

  legend.labelAlign = function (_) {
    if (!arguments.length) return labelAlign;
    if (_ == "start" || _ == "end" || _ == "middle") {
      labelAlign = _;
    }
    return legend;
  };

  legend.labelFormat = function (_) {
    if (!arguments.length) return labelFormat;
    labelFormat = _;
    return legend;
  };

  legend.labelOffset = function (_) {
    if (!arguments.length) return labelOffset;
    labelOffset = +_;
    return legend;
  };

  legend.labelDelimiter = function (_) {
    if (!arguments.length) return labelDelimiter;
    labelDelimiter = _;
    return legend;
  };

  legend.orient = function (_) {
    if (!arguments.length) return orient;
    _ = _.toLowerCase();
    if (_ == "horizontal" || _ == "vertical") {
      orient = _;
    }
    return legend;
  };

  legend.ascending = function (_) {
    if (!arguments.length) return ascending;
    ascending = !!_;
    return legend;
  };

  legend.classPrefix = function (_) {
    if (!arguments.length) return classPrefix;
    classPrefix = _;
    return legend;
  };

  legend.title = function (_) {
    if (!arguments.length) return title;
    title = _;
    return legend;
  };

  d3.rebind(legend, legendDispatcher, "on");

  return legend;
};

},{"./legend":3}],5:[function(require,module,exports){
"use strict";

var helper = require('./legend');

module.exports = function () {

  var scale = d3.scale.linear(),
      shape = "path",
      shapeWidth = 15,
      shapeHeight = 15,
      shapeRadius = 10,
      shapePadding = 5,
      cells = [5],
      labels = [],
      classPrefix = "",
      useClass = false,
      title = "",
      labelFormat = d3.format(".01f"),
      labelAlign = "middle",
      labelOffset = 10,
      labelDelimiter = "to",
      orient = "vertical",
      ascending = false,
      legendDispatcher = d3.dispatch("cellover", "cellout", "cellclick");

  function legend(svg) {

    var type = helper.d3_calcType(scale, ascending, cells, labels, labelFormat, labelDelimiter),
        legendG = svg.selectAll('g').data([scale]);

    legendG.enter().append('g').attr('class', classPrefix + 'legendCells');

    var cell = legendG.selectAll("." + classPrefix + "cell").data(type.data),
        cellEnter = cell.enter().append("g", ".cell").attr("class", classPrefix + "cell").style("opacity", 1e-6),
        shapeEnter = cellEnter.append(shape).attr("class", classPrefix + "swatch"),
        shapes = cell.select("g." + classPrefix + "cell " + shape);

    //add event handlers
    helper.d3_addEvents(cellEnter, legendDispatcher);

    //remove old shapes
    cell.exit().transition().style("opacity", 0).remove();

    helper.d3_drawShapes(shape, shapes, shapeHeight, shapeWidth, shapeRadius, type.feature);
    helper.d3_addText(legendG, cellEnter, type.labels, classPrefix);

    // sets placement
    var text = cell.select("text"),
        shapeSize = shapes[0].map(function (d) {
      return d.getBBox();
    });

    var maxH = d3.max(shapeSize, function (d) {
      return d.height;
    }),
        maxW = d3.max(shapeSize, function (d) {
      return d.width;
    });

    var cellTrans,
        textTrans,
        textAlign = labelAlign == "start" ? 0 : labelAlign == "middle" ? 0.5 : 1;

    //positions cells and text
    if (orient === "vertical") {
      cellTrans = function cellTrans(d, i) {
        return "translate(0, " + i * (maxH + shapePadding) + ")";
      };
      textTrans = function textTrans(d, i) {
        return "translate(" + (maxW + labelOffset) + "," + (shapeSize[i].y + shapeSize[i].height / 2 + 5) + ")";
      };
    } else if (orient === "horizontal") {
      cellTrans = function cellTrans(d, i) {
        return "translate(" + i * (maxW + shapePadding) + ",0)";
      };
      textTrans = function textTrans(d, i) {
        return "translate(" + (shapeSize[i].width * textAlign + shapeSize[i].x) + "," + (maxH + labelOffset) + ")";
      };
    }

    helper.d3_placement(orient, cell, cellTrans, text, textTrans, labelAlign);
    helper.d3_title(svg, legendG, title, classPrefix);
    cell.transition().style("opacity", 1);
  }

  legend.scale = function (_) {
    if (!arguments.length) return scale;
    scale = _;
    return legend;
  };

  legend.cells = function (_) {
    if (!arguments.length) return cells;
    if (_.length > 1 || _ >= 2) {
      cells = _;
    }
    return legend;
  };

  legend.shapePadding = function (_) {
    if (!arguments.length) return shapePadding;
    shapePadding = +_;
    return legend;
  };

  legend.labels = function (_) {
    if (!arguments.length) return labels;
    labels = _;
    return legend;
  };

  legend.labelAlign = function (_) {
    if (!arguments.length) return labelAlign;
    if (_ == "start" || _ == "end" || _ == "middle") {
      labelAlign = _;
    }
    return legend;
  };

  legend.labelFormat = function (_) {
    if (!arguments.length) return labelFormat;
    labelFormat = _;
    return legend;
  };

  legend.labelOffset = function (_) {
    if (!arguments.length) return labelOffset;
    labelOffset = +_;
    return legend;
  };

  legend.labelDelimiter = function (_) {
    if (!arguments.length) return labelDelimiter;
    labelDelimiter = _;
    return legend;
  };

  legend.orient = function (_) {
    if (!arguments.length) return orient;
    _ = _.toLowerCase();
    if (_ == "horizontal" || _ == "vertical") {
      orient = _;
    }
    return legend;
  };

  legend.ascending = function (_) {
    if (!arguments.length) return ascending;
    ascending = !!_;
    return legend;
  };

  legend.classPrefix = function (_) {
    if (!arguments.length) return classPrefix;
    classPrefix = _;
    return legend;
  };

  legend.title = function (_) {
    if (!arguments.length) return title;
    title = _;
    return legend;
  };

  d3.rebind(legend, legendDispatcher, "on");

  return legend;
};

},{"./legend":3}],6:[function(require,module,exports){
'use strict';
/* @flow */

/**
 * **[Gaussian error function](http://en.wikipedia.org/wiki/Error_function)**
 *
 * The `errorFunction(x/(sd * Math.sqrt(2)))` is the probability that a value in a
 * normal distribution with standard deviation sd is within x of the mean.
 *
 * This function returns a numerical approximation to the exact value.
 *
 * @param {number} x input
 * @return {number} error estimation
 * @example
 * errorFunction(1); //= 0.8427
 */

function errorFunction(x /*: number */) /*: number */{
    var t = 1 / (1 + 0.5 * Math.abs(x));
    var tau = t * Math.exp(-Math.pow(x, 2) - 1.26551223 + 1.00002368 * t + 0.37409196 * Math.pow(t, 2) + 0.09678418 * Math.pow(t, 3) - 0.18628806 * Math.pow(t, 4) + 0.27886807 * Math.pow(t, 5) - 1.13520398 * Math.pow(t, 6) + 1.48851587 * Math.pow(t, 7) - 0.82215223 * Math.pow(t, 8) + 0.17087277 * Math.pow(t, 9));
    if (x >= 0) {
        return 1 - tau;
    } else {
        return tau - 1;
    }
}

module.exports = errorFunction;

},{}],7:[function(require,module,exports){
'use strict';
/* @flow */

/**
 * [Simple linear regression](http://en.wikipedia.org/wiki/Simple_linear_regression)
 * is a simple way to find a fitted line
 * between a set of coordinates. This algorithm finds the slope and y-intercept of a regression line
 * using the least sum of squares.
 *
 * @param {Array<Array<number>>} data an array of two-element of arrays,
 * like `[[0, 1], [2, 3]]`
 * @returns {Object} object containing slope and intersect of regression line
 * @example
 * linearRegression([[0, 0], [1, 1]]); // { m: 1, b: 0 }
 */

function linearRegression(data /*: Array<Array<number>> */) /*: { m: number, b: number } */{

    var m, b;

    // Store data length in a local variable to reduce
    // repeated object property lookups
    var dataLength = data.length;

    //if there's only one point, arbitrarily choose a slope of 0
    //and a y-intercept of whatever the y of the initial point is
    if (dataLength === 1) {
        m = 0;
        b = data[0][1];
    } else {
        // Initialize our sums and scope the `m` and `b`
        // variables that define the line.
        var sumX = 0,
            sumY = 0,
            sumXX = 0,
            sumXY = 0;

        // Use local variables to grab point values
        // with minimal object property lookups
        var point, x, y;

        // Gather the sum of all x values, the sum of all
        // y values, and the sum of x^2 and (x*y) for each
        // value.
        //
        // In math notation, these would be SS_x, SS_y, SS_xx, and SS_xy
        for (var i = 0; i < dataLength; i++) {
            point = data[i];
            x = point[0];
            y = point[1];

            sumX += x;
            sumY += y;

            sumXX += x * x;
            sumXY += x * y;
        }

        // `m` is the slope of the regression line
        m = (dataLength * sumXY - sumX * sumY) / (dataLength * sumXX - sumX * sumX);

        // `b` is the y-intercept of the line.
        b = sumY / dataLength - m * sumX / dataLength;
    }

    // Return both values as an object.
    return {
        m: m,
        b: b
    };
}

module.exports = linearRegression;

},{}],8:[function(require,module,exports){
'use strict';
/* @flow */

/**
 * Given the output of `linearRegression`: an object
 * with `m` and `b` values indicating slope and intercept,
 * respectively, generate a line function that translates
 * x values into y values.
 *
 * @param {Object} mb object with `m` and `b` members, representing
 * slope and intersect of desired line
 * @returns {Function} method that computes y-value at any given
 * x-value on the line.
 * @example
 * var l = linearRegressionLine(linearRegression([[0, 0], [1, 1]]));
 * l(0) //= 0
 * l(2) //= 2
 */

function linearRegressionLine(mb /*: { b: number, m: number }*/) /*: Function */{
    // Return a function that computes a `y` value for each
    // x value it is given, based on the values of `b` and `a`
    // that we just computed.
    return function (x) {
        return mb.b + mb.m * x;
    };
}

module.exports = linearRegressionLine;

},{}],9:[function(require,module,exports){
'use strict';
/* @flow */

var sum = require('./sum');

/**
 * The mean, _also known as average_,
 * is the sum of all values over the number of values.
 * This is a [measure of central tendency](https://en.wikipedia.org/wiki/Central_tendency):
 * a method of finding a typical or central value of a set of numbers.
 *
 * This runs on `O(n)`, linear time in respect to the array
 *
 * @param {Array<number>} x input values
 * @returns {number} mean
 * @example
 * console.log(mean([0, 10])); // 5
 */
function mean(x /*: Array<number> */) /*:number*/{
    // The mean of no numbers is null
    if (x.length === 0) {
        return NaN;
    }

    return sum(x) / x.length;
}

module.exports = mean;

},{"./sum":18}],10:[function(require,module,exports){
'use strict';
/* @flow */

var quantileSorted = require('./quantile_sorted');
var quickselect = require('./quickselect');

/**
 * The [quantile](https://en.wikipedia.org/wiki/Quantile):
 * this is a population quantile, since we assume to know the entire
 * dataset in this library. This is an implementation of the
 * [Quantiles of a Population](http://en.wikipedia.org/wiki/Quantile#Quantiles_of_a_population)
 * algorithm from wikipedia.
 *
 * Sample is a one-dimensional array of numbers,
 * and p is either a decimal number from 0 to 1 or an array of decimal
 * numbers from 0 to 1.
 * In terms of a k/q quantile, p = k/q - it's just dealing with fractions or dealing
 * with decimal values.
 * When p is an array, the result of the function is also an array containing the appropriate
 * quantiles in input order
 *
 * @param {Array<number>} sample a sample from the population
 * @param {number} p the desired quantile, as a number between 0 and 1
 * @returns {number} quantile
 * @example
 * var data = [3, 6, 7, 8, 8, 9, 10, 13, 15, 16, 20];
 * quantile(data, 1); //= max(data);
 * quantile(data, 0); //= min(data);
 * quantile(data, 0.5); //= 9
 */
function quantile(sample /*: Array<number> */, p /*: Array<number> | number */) {
    var copy = sample.slice();

    if (Array.isArray(p)) {
        // rearrange elements so that each element corresponding to a requested
        // quantile is on a place it would be if the array was fully sorted
        multiQuantileSelect(copy, p);
        // Initialize the result array
        var results = [];
        // For each requested quantile
        for (var i = 0; i < p.length; i++) {
            results[i] = quantileSorted(copy, p[i]);
        }
        return results;
    } else {
        var idx = quantileIndex(copy.length, p);
        quantileSelect(copy, idx, 0, copy.length - 1);
        return quantileSorted(copy, p);
    }
}

function quantileSelect(arr, k, left, right) {
    if (k % 1 === 0) {
        quickselect(arr, k, left, right);
    } else {
        k = Math.floor(k);
        quickselect(arr, k, left, right);
        quickselect(arr, k + 1, k + 1, right);
    }
}

function multiQuantileSelect(arr, p) {
    var indices = [0];
    for (var i = 0; i < p.length; i++) {
        indices.push(quantileIndex(arr.length, p[i]));
    }
    indices.push(arr.length - 1);
    indices.sort(compare);

    var stack = [0, indices.length - 1];

    while (stack.length) {
        var r = Math.ceil(stack.pop());
        var l = Math.floor(stack.pop());
        if (r - l <= 1) continue;

        var m = Math.floor((l + r) / 2);
        quantileSelect(arr, indices[m], indices[l], indices[r]);

        stack.push(l, m, m, r);
    }
}

function compare(a, b) {
    return a - b;
}

function quantileIndex(len /*: number */, p /*: number */) /*:number*/{
    var idx = len * p;
    if (p === 1) {
        // If p is 1, directly return the last index
        return len - 1;
    } else if (p === 0) {
        // If p is 0, directly return the first index
        return 0;
    } else if (idx % 1 !== 0) {
        // If index is not integer, return the next index in array
        return Math.ceil(idx) - 1;
    } else if (len % 2 === 0) {
        // If the list has even-length, we'll return the middle of two indices
        // around quantile to indicate that we need an average value of the two
        return idx - 0.5;
    } else {
        // Finally, in the simple case of an integer index
        // with an odd-length list, return the index
        return idx;
    }
}

module.exports = quantile;

},{"./quantile_sorted":11,"./quickselect":12}],11:[function(require,module,exports){
'use strict';
/* @flow */

/**
 * This is the internal implementation of quantiles: when you know
 * that the order is sorted, you don't need to re-sort it, and the computations
 * are faster.
 *
 * @param {Array<number>} sample input data
 * @param {number} p desired quantile: a number between 0 to 1, inclusive
 * @returns {number} quantile value
 * @example
 * var data = [3, 6, 7, 8, 8, 9, 10, 13, 15, 16, 20];
 * quantileSorted(data, 1); //= max(data);
 * quantileSorted(data, 0); //= min(data);
 * quantileSorted(data, 0.5); //= 9
 */

function quantileSorted(sample /*: Array<number> */, p /*: number */) /*:number*/{
    var idx = sample.length * p;
    if (p < 0 || p > 1) {
        return NaN;
    } else if (p === 1) {
        // If p is 1, directly return the last element
        return sample[sample.length - 1];
    } else if (p === 0) {
        // If p is 0, directly return the first element
        return sample[0];
    } else if (idx % 1 !== 0) {
        // If p is not integer, return the next element in array
        return sample[Math.ceil(idx) - 1];
    } else if (sample.length % 2 === 0) {
        // If the list has even-length, we'll take the average of this number
        // and the next value, if there is one
        return (sample[idx - 1] + sample[idx]) / 2;
    } else {
        // Finally, in the simple case of an integer value
        // with an odd-length list, return the sample value at the index.
        return sample[idx];
    }
}

module.exports = quantileSorted;

},{}],12:[function(require,module,exports){
'use strict';
/* @flow */

module.exports = quickselect;

/**
 * Rearrange items in `arr` so that all items in `[left, k]` range are the smallest.
 * The `k`-th element will have the `(k - left + 1)`-th smallest value in `[left, right]`.
 *
 * Implements Floyd-Rivest selection algorithm https://en.wikipedia.org/wiki/Floyd-Rivest_algorithm
 *
 * @private
 * @param {Array<number>} arr input array
 * @param {number} k pivot index
 * @param {number} left left index
 * @param {number} right right index
 * @returns {undefined}
 * @example
 * var arr = [65, 28, 59, 33, 21, 56, 22, 95, 50, 12, 90, 53, 28, 77, 39];
 * quickselect(arr, 8);
 * // [39, 28, 28, 33, 21, 12, 22, 50, 53, 56, 59, 65, 90, 77, 95]
 */
function quickselect(arr /*: Array<number> */, k /*: number */, left /*: number */, right /*: number */) {
    left = left || 0;
    right = right || arr.length - 1;

    while (right > left) {
        // 600 and 0.5 are arbitrary constants chosen in the original paper to minimize execution time
        if (right - left > 600) {
            var n = right - left + 1;
            var m = k - left + 1;
            var z = Math.log(n);
            var s = 0.5 * Math.exp(2 * z / 3);
            var sd = 0.5 * Math.sqrt(z * s * (n - s) / n);
            if (m - n / 2 < 0) sd *= -1;
            var newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
            var newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
            quickselect(arr, k, newLeft, newRight);
        }

        var t = arr[k];
        var i = left;
        var j = right;

        swap(arr, left, k);
        if (arr[right] > t) swap(arr, left, right);

        while (i < j) {
            swap(arr, i, j);
            i++;
            j--;
            while (arr[i] < t) {
                i++;
            }while (arr[j] > t) {
                j--;
            }
        }

        if (arr[left] === t) swap(arr, left, j);else {
            j++;
            swap(arr, j, right);
        }

        if (j <= k) left = j + 1;
        if (k <= j) right = j - 1;
    }
}

function swap(arr, i, j) {
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

},{}],13:[function(require,module,exports){
'use strict';
/* @flow */

var sampleCovariance = require('./sample_covariance');
var sampleStandardDeviation = require('./sample_standard_deviation');

/**
 * The [correlation](http://en.wikipedia.org/wiki/Correlation_and_dependence) is
 * a measure of how correlated two datasets are, between -1 and 1
 *
 * @param {Array<number>} x first input
 * @param {Array<number>} y second input
 * @returns {number} sample correlation
 * @example
 * var a = [1, 2, 3, 4, 5, 6];
 * var b = [2, 2, 3, 4, 5, 60];
 * sampleCorrelation(a, b); //= 0.691
 */
function sampleCorrelation(x /*: Array<number> */, y /*: Array<number> */) /*:number*/{
    var cov = sampleCovariance(x, y),
        xstd = sampleStandardDeviation(x),
        ystd = sampleStandardDeviation(y);

    return cov / xstd / ystd;
}

module.exports = sampleCorrelation;

},{"./sample_covariance":14,"./sample_standard_deviation":15}],14:[function(require,module,exports){
'use strict';
/* @flow */

var mean = require('./mean');

/**
 * [Sample covariance](https://en.wikipedia.org/wiki/Sample_mean_and_sampleCovariance) of two datasets:
 * how much do the two datasets move together?
 * x and y are two datasets, represented as arrays of numbers.
 *
 * @param {Array<number>} x first input
 * @param {Array<number>} y second input
 * @returns {number} sample covariance
 * @example
 * var x = [1, 2, 3, 4, 5, 6];
 * var y = [6, 5, 4, 3, 2, 1];
 * sampleCovariance(x, y); //= -3.5
 */
function sampleCovariance(x /*:Array<number>*/, y /*:Array<number>*/) /*:number*/{

    // The two datasets must have the same length which must be more than 1
    if (x.length <= 1 || x.length !== y.length) {
        return NaN;
    }

    // determine the mean of each dataset so that we can judge each
    // value of the dataset fairly as the difference from the mean. this
    // way, if one dataset is [1, 2, 3] and [2, 3, 4], their covariance
    // does not suffer because of the difference in absolute values
    var xmean = mean(x),
        ymean = mean(y),
        sum = 0;

    // for each pair of values, the covariance increases when their
    // difference from the mean is associated - if both are well above
    // or if both are well below
    // the mean, the covariance increases significantly.
    for (var i = 0; i < x.length; i++) {
        sum += (x[i] - xmean) * (y[i] - ymean);
    }

    // this is Bessels' Correction: an adjustment made to sample statistics
    // that allows for the reduced degree of freedom entailed in calculating
    // values from samples rather than complete populations.
    var besselsCorrection = x.length - 1;

    // the covariance is weighted by the length of the datasets.
    return sum / besselsCorrection;
}

module.exports = sampleCovariance;

},{"./mean":9}],15:[function(require,module,exports){
'use strict';
/* @flow */

var sampleVariance = require('./sample_variance');

/**
 * The [standard deviation](http://en.wikipedia.org/wiki/Standard_deviation)
 * is the square root of the variance.
 *
 * @param {Array<number>} x input array
 * @returns {number} sample standard deviation
 * @example
 * ss.sampleStandardDeviation([2, 4, 4, 4, 5, 5, 7, 9]);
 * //= 2.138
 */
function sampleStandardDeviation(x /*:Array<number>*/) /*:number*/{
  // The standard deviation of no numbers is null
  var sampleVarianceX = sampleVariance(x);
  if (isNaN(sampleVarianceX)) {
    return NaN;
  }
  return Math.sqrt(sampleVarianceX);
}

module.exports = sampleStandardDeviation;

},{"./sample_variance":16}],16:[function(require,module,exports){
'use strict';
/* @flow */

var sumNthPowerDeviations = require('./sum_nth_power_deviations');

/*
 * The [sample variance](https://en.wikipedia.org/wiki/Variance#Sample_variance)
 * is the sum of squared deviations from the mean. The sample variance
 * is distinguished from the variance by the usage of [Bessel's Correction](https://en.wikipedia.org/wiki/Bessel's_correction):
 * instead of dividing the sum of squared deviations by the length of the input,
 * it is divided by the length minus one. This corrects the bias in estimating
 * a value from a set that you don't know if full.
 *
 * References:
 * * [Wolfram MathWorld on Sample Variance](http://mathworld.wolfram.com/SampleVariance.html)
 *
 * @param {Array<number>} x input array
 * @return {number} sample variance
 * @example
 * sampleVariance([1, 2, 3, 4, 5]); //= 2.5
 */
function sampleVariance(x /*: Array<number> */) /*:number*/{
    // The variance of no numbers is null
    if (x.length <= 1) {
        return NaN;
    }

    var sumSquaredDeviationsValue = sumNthPowerDeviations(x, 2);

    // this is Bessels' Correction: an adjustment made to sample statistics
    // that allows for the reduced degree of freedom entailed in calculating
    // values from samples rather than complete populations.
    var besselsCorrection = x.length - 1;

    // Find the mean value of that list
    return sumSquaredDeviationsValue / besselsCorrection;
}

module.exports = sampleVariance;

},{"./sum_nth_power_deviations":19}],17:[function(require,module,exports){
'use strict';
/* @flow */

var variance = require('./variance');

/**
 * The [standard deviation](http://en.wikipedia.org/wiki/Standard_deviation)
 * is the square root of the variance. It's useful for measuring the amount
 * of variation or dispersion in a set of values.
 *
 * Standard deviation is only appropriate for full-population knowledge: for
 * samples of a population, {@link sampleStandardDeviation} is
 * more appropriate.
 *
 * @param {Array<number>} x input
 * @returns {number} standard deviation
 * @example
 * var scores = [2, 4, 4, 4, 5, 5, 7, 9];
 * variance(scores); //= 4
 * standardDeviation(scores); //= 2
 */
function standardDeviation(x /*: Array<number> */) /*:number*/{
  // The standard deviation of no numbers is null
  var v = variance(x);
  if (isNaN(v)) {
    return 0;
  }
  return Math.sqrt(v);
}

module.exports = standardDeviation;

},{"./variance":20}],18:[function(require,module,exports){
'use strict';
/* @flow */

/**
 * Our default sum is the [Kahan summation algorithm](https://en.wikipedia.org/wiki/Kahan_summation_algorithm) is
 * a method for computing the sum of a list of numbers while correcting
 * for floating-point errors. Traditionally, sums are calculated as many
 * successive additions, each one with its own floating-point roundoff. These
 * losses in precision add up as the number of numbers increases. This alternative
 * algorithm is more accurate than the simple way of calculating sums by simple
 * addition.
 *
 * This runs on `O(n)`, linear time in respect to the array
 *
 * @param {Array<number>} x input
 * @return {number} sum of all input numbers
 * @example
 * console.log(sum([1, 2, 3])); // 6
 */

function sum(x /*: Array<number> */) /*: number */{

    // like the traditional sum algorithm, we keep a running
    // count of the current sum.
    var sum = 0;

    // but we also keep three extra variables as bookkeeping:
    // most importantly, an error correction value. This will be a very
    // small number that is the opposite of the floating point precision loss.
    var errorCompensation = 0;

    // this will be each number in the list corrected with the compensation value.
    var correctedCurrentValue;

    // and this will be the next sum
    var nextSum;

    for (var i = 0; i < x.length; i++) {
        // first correct the value that we're going to add to the sum
        correctedCurrentValue = x[i] - errorCompensation;

        // compute the next sum. sum is likely a much larger number
        // than correctedCurrentValue, so we'll lose precision here,
        // and measure how much precision is lost in the next step
        nextSum = sum + correctedCurrentValue;

        // we intentionally didn't assign sum immediately, but stored
        // it for now so we can figure out this: is (sum + nextValue) - nextValue
        // not equal to 0? ideally it would be, but in practice it won't:
        // it will be some very small number. that's what we record
        // as errorCompensation.
        errorCompensation = nextSum - sum - correctedCurrentValue;

        // now that we've computed how much we'll correct for in the next
        // loop, start treating the nextSum as the current sum.
        sum = nextSum;
    }

    return sum;
}

module.exports = sum;

},{}],19:[function(require,module,exports){
'use strict';
/* @flow */

var mean = require('./mean');

/**
 * The sum of deviations to the Nth power.
 * When n=2 it's the sum of squared deviations.
 * When n=3 it's the sum of cubed deviations.
 *
 * @param {Array<number>} x
 * @param {number} n power
 * @returns {number} sum of nth power deviations
 * @example
 * var input = [1, 2, 3];
 * // since the variance of a set is the mean squared
 * // deviations, we can calculate that with sumNthPowerDeviations:
 * var variance = sumNthPowerDeviations(input) / input.length;
 */
function sumNthPowerDeviations(x /*: Array<number> */, n /*: number */) /*:number*/{
    var meanValue = mean(x),
        sum = 0;

    for (var i = 0; i < x.length; i++) {
        sum += Math.pow(x[i] - meanValue, n);
    }

    return sum;
}

module.exports = sumNthPowerDeviations;

},{"./mean":9}],20:[function(require,module,exports){
'use strict';
/* @flow */

var sumNthPowerDeviations = require('./sum_nth_power_deviations');

/**
 * The [variance](http://en.wikipedia.org/wiki/Variance)
 * is the sum of squared deviations from the mean.
 *
 * This is an implementation of variance, not sample variance:
 * see the `sampleVariance` method if you want a sample measure.
 *
 * @param {Array<number>} x a population
 * @returns {number} variance: a value greater than or equal to zero.
 * zero indicates that all values are identical.
 * @example
 * ss.variance([1, 2, 3, 4, 5, 6]); //= 2.917
 */
function variance(x /*: Array<number> */) /*:number*/{
    // The variance of no numbers is null
    if (x.length === 0) {
        return NaN;
    }

    // Find the mean of squared deviations between the
    // mean value and each value.
    return sumNthPowerDeviations(x, 2) / x.length;
}

module.exports = variance;

},{"./sum_nth_power_deviations":19}],21:[function(require,module,exports){
'use strict';
/* @flow */

/**
 * The [Z-Score, or Standard Score](http://en.wikipedia.org/wiki/Standard_score).
 *
 * The standard score is the number of standard deviations an observation
 * or datum is above or below the mean. Thus, a positive standard score
 * represents a datum above the mean, while a negative standard score
 * represents a datum below the mean. It is a dimensionless quantity
 * obtained by subtracting the population mean from an individual raw
 * score and then dividing the difference by the population standard
 * deviation.
 *
 * The z-score is only defined if one knows the population parameters;
 * if one only has a sample set, then the analogous computation with
 * sample mean and sample standard deviation yields the
 * Student's t-statistic.
 *
 * @param {number} x
 * @param {number} mean
 * @param {number} standardDeviation
 * @return {number} z score
 * @example
 * ss.zScore(78, 80, 5); //= -0.4
 */

function zScore(x /*:number*/, mean /*:number*/, standardDeviation /*:number*/) /*:number*/{
  return (x - mean) / standardDeviation;
}

module.exports = zScore;

},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BarChart = exports.BarChartConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chartWithColorGroups = require("./chart-with-color-groups");

var _utils = require("./utils");

var _legend = require("./legend");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BarChartConfig = exports.BarChartConfig = function (_ChartWithColorGroups) {
    _inherits(BarChartConfig, _ChartWithColorGroups);

    function BarChartConfig(custom) {
        _classCallCheck(this, BarChartConfig);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BarChartConfig).call(this));

        _this.svgClass = _this.cssClassPrefix + 'bar-chart';
        _this.showLegend = true;
        _this.showTooltip = true;
        _this.x = { // X axis config
            label: '', // axis label
            key: 0,
            value: function value(d, key) {
                return _utils.Utils.isNumber(d) ? d : d[key];
            }, // x value accessor
            scale: "ordinal",
            ticks: undefined
        };
        _this.y = { // Y axis config
            key: 1,
            value: function value(d, key) {
                return _utils.Utils.isNumber(d) ? d : d[key];
            }, // x value accessor
            label: '', // axis label,
            orient: "left",
            scale: "linear"
        };
        _this.transition = true;

        var config = _this;

        if (custom) {
            _utils.Utils.deepExtend(_this, custom);
        }

        return _this;
    }

    return BarChartConfig;
}(_chartWithColorGroups.ChartWithColorGroupsConfig);

var BarChart = exports.BarChart = function (_ChartWithColorGroups2) {
    _inherits(BarChart, _ChartWithColorGroups2);

    function BarChart(placeholderSelector, data, config) {
        _classCallCheck(this, BarChart);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(BarChart).call(this, placeholderSelector, data, new BarChartConfig(config)));
    }

    _createClass(BarChart, [{
        key: "setConfig",
        value: function setConfig(config) {
            return _get(Object.getPrototypeOf(BarChart.prototype), "setConfig", this).call(this, new BarChartConfig(config));
        }
    }, {
        key: "initPlot",
        value: function initPlot() {
            _get(Object.getPrototypeOf(BarChart.prototype), "initPlot", this).call(this);
            var self = this;

            var conf = this.config;

            this.plot.x = {};
            this.plot.y = {};

            this.computePlotSize();
            this.setupY();
            this.setupX();
            this.setupGroupStacks();
            this.setupYDomain();

            return this;
        }
    }, {
        key: "setupX",
        value: function setupX() {

            var plot = this.plot;
            var x = plot.x;
            var conf = this.config.x;

            /* *
             * value accessor - returns the value to encode for a given data object.
             * scale - maps value to a visual display encoding, such as a pixel position.
             * map function - maps from data value to display value
             * axis - sets up axis
             **/
            x.value = function (d) {
                return conf.value(d, conf.key);
            };
            x.scale = d3.scale.ordinal().rangeRoundBands([0, plot.width], .08);
            x.map = function (d) {
                return x.scale(x.value(d));
            };

            x.axis = d3.svg.axis().scale(x.scale).orient(conf.orient);

            var data = this.plot.data;
            var domain;
            if (!data || !data.length) {
                domain = [];
            } else if (!this.config.series) {
                domain = d3.map(data, x.value).keys();
            } else {
                domain = d3.map(data[0].values, x.value).keys();
            }

            plot.x.scale.domain(domain);
        }
    }, {
        key: "setupY",
        value: function setupY() {

            var plot = this.plot;
            var y = plot.y;
            var conf = this.config.y;
            y.value = function (d) {
                return conf.value(d, conf.key);
            };
            y.scale = d3.scale[conf.scale]().range([plot.height, 0]);
            y.map = function (d) {
                return y.scale(y.value(d));
            };

            y.axis = d3.svg.axis().scale(y.scale).orient(conf.orient);
            if (conf.ticks) {
                y.axis.ticks(conf.ticks);
            }
        }
    }, {
        key: "setupYDomain",
        value: function setupYDomain() {
            var plot = this.plot;
            var data = this.plot.data;
            var domain;
            var yStackMax = d3.max(plot.layers, function (layer) {
                return d3.max(layer.points, function (d) {
                    return d.y0 + d.y;
                });
            });

            // var min = d3.min(data, s=>d3.min(s.values, plot.y.value));
            var max = yStackMax;
            domain = [0, max];

            plot.y.scale.domain(domain);
            console.log(' plot.y.scale.domain', plot.y.scale.domain());
        }
    }, {
        key: "setupGroupStacks",
        value: function setupGroupStacks() {
            var self = this;
            this.groupData();

            this.plot.stack = d3.layout.stack().values(function (d) {
                return d.points;
            });
            this.plot.groupedData.forEach(function (s) {
                s.points = s.values.map(function (v) {
                    return self.mapToPoint(v);
                });
            });
            this.plot.layers = this.plot.stack(this.plot.groupedData);
        }
    }, {
        key: "mapToPoint",
        value: function mapToPoint(value) {
            var plot = this.plot;
            return {
                x: plot.x.value(value),
                y: parseFloat(plot.y.value(value))
            };
        }
    }, {
        key: "drawAxisX",
        value: function drawAxisX() {
            var self = this;
            var plot = self.plot;
            var axisConf = this.config.x;
            var axis = self.svgG.selectOrAppend("g." + self.prefixClass('axis-x') + "." + self.prefixClass('axis') + (self.config.guides ? '' : '.' + self.prefixClass('no-guides'))).attr("transform", "translate(0," + plot.height + ")");

            var axisT = axis;
            if (self.config.transition) {
                axisT = axis.transition().ease("sin-in-out");
            }

            axisT.call(plot.x.axis);

            axis.selectOrAppend("text." + self.prefixClass('label')).attr("transform", "translate(" + plot.width / 2 + "," + plot.margin.bottom + ")") // text is drawn off the screen top left, move down and out and rotate
            .attr("dy", "-1em").style("text-anchor", "middle").text(axisConf.label);
        }
    }, {
        key: "drawAxisY",
        value: function drawAxisY() {
            var self = this;
            var plot = self.plot;
            var axisConf = this.config.y;
            var axis = self.svgG.selectOrAppend("g." + self.prefixClass('axis-y') + "." + self.prefixClass('axis') + (self.config.guides ? '' : '.' + self.prefixClass('no-guides')));

            var axisT = axis;
            if (self.config.transition) {
                axisT = axis.transition().ease("sin-in-out");
            }

            axisT.call(plot.y.axis);

            axis.selectOrAppend("text." + self.prefixClass('label')).attr("transform", "translate(" + -plot.margin.left + "," + plot.height / 2 + ")rotate(-90)") // text is drawn off the screen top left, move down and out and rotate
            .attr("dy", "1em").style("text-anchor", "middle").text(axisConf.label);
        }
    }, {
        key: "drawBars",
        value: function drawBars() {
            var self = this;
            var plot = self.plot;

            console.log('layers', plot.layers);

            var layerClass = this.prefixClass("layer");

            var barClass = this.prefixClass("bar");
            var layer = self.svgG.selectAll("." + layerClass).data(plot.layers);

            layer.enter().append("g").attr("class", layerClass);

            var bar = layer.selectAll("." + barClass).data(function (d) {
                return d.points;
            });

            bar.enter().append("g").attr("class", barClass).append("rect").attr("x", 1);

            var barRect = bar.select("rect");

            var barRectT = barRect;
            var barT = bar;
            var layerT = layer;
            if (this.transitionEnabled()) {
                barRectT = barRect.transition();
                barT = bar.transition();
                layerT = layer.transition();
            }

            var yDomain = plot.y.scale.domain();
            barT.attr("transform", function (d) {
                return "translate(" + plot.x.scale(d.x) + "," + plot.y.scale(d.y0 + d.y) + ")";
            });

            barRectT.attr("width", plot.x.scale.rangeBand()).attr("height", function (d) {
                return plot.y.scale(d.y0) - plot.y.scale(d.y0 + d.y - yDomain[0]);
            });

            if (this.plot.seriesColor) {
                layerT.attr("fill", this.plot.seriesColor);
            }

            if (plot.tooltip) {
                bar.on("mouseover", function (d) {
                    self.showTooltip(d.y);
                }).on("mouseout", function (d) {
                    self.hideTooltip();
                });
            }
            layer.exit().remove();
            bar.exit().remove();
        }
    }, {
        key: "update",
        value: function update(newData) {
            _get(Object.getPrototypeOf(BarChart.prototype), "update", this).call(this, newData);
            this.drawAxisX();
            this.drawAxisY();
            this.drawBars();
            return this;
        }
    }]);

    return BarChart;
}(_chartWithColorGroups.ChartWithColorGroups);

},{"./chart-with-color-groups":25,"./legend":33,"./utils":39}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BoxPlotBase = exports.BoxPlotBaseConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chart = require('./chart');

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BoxPlotBaseConfig = exports.BoxPlotBaseConfig = function (_ChartConfig) {
    _inherits(BoxPlotBaseConfig, _ChartConfig);

    function BoxPlotBaseConfig(custom) {
        _classCallCheck(this, BoxPlotBaseConfig);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BoxPlotBaseConfig).call(this));

        _this.svgClass = _this.cssClassPrefix + 'box-plot';
        _this.showLegend = true;
        _this.showTooltip = true;
        _this.x = { // X axis config
            title: '', // axis label
            value: function value(s) {
                return s.key;
            }, // x value accessor
            guides: false, //show axis guides
            scale: "ordinal"

        };
        _this.y = { // Y axis config
            title: '',
            value: function value(d) {
                return d;
            }, // y value accessor
            scale: "linear",
            orient: 'left',
            domainMargin: 0.1,
            guides: true //show axis guides
        };

        _this.Q1 = function (d) {
            return d.values.Q1;
        };

        _this.Q2 = function (d) {
            return d.values.Q2;
        };

        _this.Q3 = function (d) {
            return d.values.Q3;
        };

        _this.Wl = function (d) {
            return d.values.whiskerLow;
        };

        _this.Wh = function (d) {
            return d.values.whiskerHigh;
        };

        _this.outliers = function (d) {
            return d.values.outliers;
        };

        _this.outlierValue = function (d, i) {
            return d;
        };

        _this.outlierLabel = function (d, i) {
            return d;
        };

        _this.minBoxWidth = 35;
        _this.maxBoxWidth = 100;
        _this.transition = true;
        _this.color = undefined;
        _this.d3ColorCategory = 'category10';

        if (custom) {
            _utils.Utils.deepExtend(_this, custom);
        }

        return _this;
    } // string or function returning color's value for color scale


    return BoxPlotBaseConfig;
}(_chart.ChartConfig);

var BoxPlotBase = exports.BoxPlotBase = function (_Chart) {
    _inherits(BoxPlotBase, _Chart);

    function BoxPlotBase(placeholderSelector, data, config) {
        _classCallCheck(this, BoxPlotBase);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(BoxPlotBase).call(this, placeholderSelector, data, new BoxPlotBaseConfig(config)));
    }

    _createClass(BoxPlotBase, [{
        key: 'setConfig',
        value: function setConfig(config) {
            return _get(Object.getPrototypeOf(BoxPlotBase.prototype), 'setConfig', this).call(this, new BoxPlotBaseConfig(config));
        }
    }, {
        key: 'initPlot',
        value: function initPlot() {
            _get(Object.getPrototypeOf(BoxPlotBase.prototype), 'initPlot', this).call(this);
            _get(Object.getPrototypeOf(BoxPlotBase.prototype), 'computePlotSize', this).call(this);
            this.plot.x = {};
            this.plot.y = {};

            this.plot.data = this.getDataToPlot();
            this.setupY();
            this.setupX();

            this.setupColor();
        }
    }, {
        key: 'getDataToPlot',
        value: function getDataToPlot() {
            return this.data;
        }
    }, {
        key: 'setupX',
        value: function setupX() {

            var plot = this.plot;
            var x = plot.x;
            var conf = this.config.x;

            x.value = conf.value;
            x.scale = d3.scale.ordinal().rangeRoundBands([0, plot.width], .08);
            x.map = function (d) {
                return x.scale(x.value(d));
            };

            x.axis = d3.svg.axis().scale(x.scale).orient(conf.orient);
            if (conf.guides) {
                x.axis.tickSize(-plot.height);
            }

            var data = this.plot.data;
            var domain;
            if (!data || !data.length) {
                domain = [];
            } else {
                domain = data.map(x.value);
            }

            plot.x.scale.domain(domain);
        }
    }, {
        key: 'setupY',
        value: function setupY() {
            var _this3 = this;

            var plot = this.plot;
            var y = plot.y;
            var conf = this.config.y;
            y.value = function (d) {
                return conf.value.call(_this3.config, d);
            };
            y.scale = d3.scale[conf.scale]().range([plot.height, 0]);
            y.map = function (d) {
                return y.scale(y.value(d));
            };

            y.axis = d3.svg.axis().scale(y.scale).orient(conf.orient);
            if (conf.ticks) {
                y.axis.ticks(conf.ticks);
            }
            if (conf.guides) {
                y.axis.tickSize(-plot.width);
            }
            this.setupYDomain();
        }
    }, {
        key: 'setupYDomain',
        value: function setupYDomain() {
            var plot = this.plot;
            var data = this.plot.data;
            var c = this.config;

            var values = [],
                yMin,
                yMax;
            data.forEach(function (d, i) {
                var q1 = c.Q1(d),
                    q3 = c.Q3(d),
                    wl = c.Wl(d),
                    wh = c.Wh(d),
                    outliers = c.outliers(d);

                if (outliers) {
                    outliers.forEach(function (o, i) {
                        values.push(c.outlierValue(o, i));
                    });
                }
                if (wl) {
                    values.push(wl);
                }
                if (q1) {
                    values.push(q1);
                }
                if (q3) {
                    values.push(q3);
                }
                if (wh) {
                    values.push(wh);
                }
            });
            yMin = d3.min(values);
            yMax = d3.max(values);
            var margin = (yMax - yMin) * this.config.y.domainMargin;
            yMin -= margin;
            yMax += margin;
            var domain = [yMin, yMax];

            plot.y.scale.domain(domain);
        }
    }, {
        key: 'drawAxisX',
        value: function drawAxisX() {
            var self = this;
            var plot = self.plot;
            var axisConf = this.config.x;
            var axis = self.svgG.selectOrAppend("g." + self.prefixClass('axis-x') + "." + self.prefixClass('axis') + (axisConf.guides ? '' : '.' + self.prefixClass('no-guides'))).attr("transform", "translate(0," + plot.height + ")");

            var axisT = axis;
            if (self.config.transition) {
                axisT = axis.transition().ease("sin-in-out");
            }

            axisT.call(plot.x.axis);

            axis.selectOrAppend("text." + self.prefixClass('label')).attr("transform", "translate(" + plot.width / 2 + "," + plot.margin.bottom + ")") // text is drawn off the screen top left, move down and out and rotate
            .attr("dy", "-1em").style("text-anchor", "middle").text(axisConf.label);
        }
    }, {
        key: 'drawAxisY',
        value: function drawAxisY() {
            var self = this;
            var plot = self.plot;
            var axisConf = this.config.y;
            var axis = self.svgG.selectOrAppend("g." + self.prefixClass('axis-y') + "." + self.prefixClass('axis') + (axisConf.guides ? '' : '.' + self.prefixClass('no-guides')));

            var axisT = axis;
            if (self.config.transition) {
                axisT = axis.transition().ease("sin-in-out");
            }

            axisT.call(plot.y.axis);

            axis.selectOrAppend("text." + self.prefixClass('label')).attr("transform", "translate(" + -plot.margin.left + "," + plot.height / 2 + ")rotate(-90)") // text is drawn off the screen top left, move down and out and rotate
            .attr("dy", "1em").style("text-anchor", "middle").text(axisConf.title);
        }
    }, {
        key: 'drawBoxPlots',
        value: function drawBoxPlots() {
            var self = this,
                plot = self.plot,
                config = self.config,
                boxplotClass = self.prefixClass("boxplot-item");

            var boxplots = self.svgG.selectAll('.' + boxplotClass).data(plot.data);
            var boxplotEnter = boxplots.enter().append('g').attr('class', boxplotClass).style('stroke-opacity', 1e-6).style('fill-opacity', 1e-6);

            var duration = 1000;
            var boxplotsT = boxplots;
            if (self.transitionEnabled()) {
                boxplotsT = boxplots.transition();
                boxplotsT.delay(function (d, i) {
                    return i * duration / plot.data.length;
                });
            }

            boxplotsT.style('fill', plot.color).style('stroke-opacity', 1).style('fill-opacity', 0.75).attr('transform', function (d, i) {
                return 'translate(' + (plot.x.map(d, i) + plot.x.scale.rangeBand() * 0.05) + ', 0)';
            });
            boxplots.exit().remove();

            var boxWidth = !config.maxBoxWidth ? plot.x.scale.rangeBand() * 0.9 : Math.min(config.maxBoxWidth, Math.max(config.minBoxWidth, plot.x.scale.rangeBand() * 0.9));
            var boxLeft = plot.x.scale.rangeBand() * 0.45 - boxWidth / 2;
            var boxRight = plot.x.scale.rangeBand() * 0.45 + boxWidth / 2;

            var boxClass = self.prefixClass("box");

            boxplotEnter.append('rect').attr('class', boxClass)
            // tooltip events
            .on('mouseover', function (d, i) {
                d3.select(this).classed('hover', true);
                var html = 'Q3: ' + config.Q3(d, i) + '<br/>Q2: ' + config.Q2(d, i) + '<br/>Q1: ' + config.Q1(d, i);
                self.showTooltip(html);
            }).on('mouseout', function (d, i) {
                d3.select(this).classed('hover', false);
                self.hideTooltip();
            });

            var boxRects = boxplots.select('rect.' + boxClass);

            var boxRectsT = boxRects;
            if (self.config.transition) {
                boxRectsT = boxRects.transition();
            }

            boxRectsT.attr('y', function (d, i) {
                return plot.y.scale(config.Q3(d));
            }).attr('width', boxWidth).attr('x', boxLeft).attr('height', function (d, i) {
                return Math.abs(plot.y.scale(config.Q3(d)) - plot.y.scale(config.Q1(d))) || 1;
            }).style('stroke', plot.color);

            // median line
            var medianClass = self.prefixClass('median');
            boxplotEnter.append('line').attr('class', medianClass);

            boxplots.select('line.' + medianClass).attr('x1', boxLeft).attr('y1', function (d, i) {
                return plot.y.scale(config.Q2(d));
            }).attr('x2', boxRight).attr('y2', function (d, i) {
                return plot.y.scale(config.Q2(d));
            });

            //whiskers

            var whiskerClass = self.prefixClass("whisker"),
                tickClass = self.prefixClass("boxplot-tick");

            var whiskers = [{ key: 'low', value: config.Wl }, { key: 'high', value: config.Wh }];

            boxplotEnter.each(function (d, i) {
                var box = d3.select(this);

                whiskers.forEach(function (f) {
                    if (f.value(d)) {
                        box.append('line').style('stroke', plot.color(d, i)).attr('class', whiskerClass + ' ' + boxplotClass + '-' + f.key);
                        box.append('line').style('stroke', plot.color(d, i)).attr('class', tickClass + ' ' + boxplotClass + '-' + f.key);
                    }
                });
            });

            whiskers.forEach(function (f) {
                var endpoint = f.key === 'low' ? config.Q1 : config.Q3;

                boxplots.select('.' + whiskerClass + '.' + boxplotClass + '-' + f.key).attr('x1', plot.x.scale.rangeBand() * 0.45).attr('y1', function (d, i) {
                    return plot.y.scale(f.value(d));
                }).attr('x2', plot.x.scale.rangeBand() * 0.45).attr('y2', function (d, i) {
                    return plot.y.scale(endpoint(d));
                });
                boxplots.select('.' + tickClass + '.' + boxplotClass + '-' + f.key).attr('x1', boxLeft).attr('y1', function (d, i) {
                    return plot.y.scale(f.value(d));
                }).attr('x2', boxRight).attr('y2', function (d, i) {
                    return plot.y.scale(f.value(d));
                });

                boxplotEnter.selectAll('.' + boxplotClass + '-' + f.key).on('mouseover', function (d, i, j) {
                    d3.select(this).classed('hover', true);
                    self.showTooltip(f.value(d));
                }).on('mouseout', function (d, i, j) {
                    d3.select(this).classed('hover', false);
                    self.hideTooltip();
                });
            });

            // outliers
            var outlierClass = self.prefixClass("outlier");
            var outliers = boxplots.selectAll('.' + outlierClass).data(function (d, i) {
                return config.outliers(d, i) || [];
            });

            var outlierEnterCircle = outliers.enter().append('circle').attr('class', outlierClass).style('z-index', 9000);

            outlierEnterCircle.on('mouseover', function (d, i, j) {
                d3.select(this).classed('hover', true);
                self.showTooltip(config.outlierLabel(d, i));
            }).on('mouseout', function (d, i, j) {
                d3.select(this).classed('hover', false);
                self.hideTooltip();
            });

            var outliersT = outliers;
            if (self.config.transition) {
                outliersT = outliers.transition();
            }
            outliersT.attr('cx', plot.x.scale.rangeBand() * 0.45).attr('cy', function (d, i) {
                return plot.y.scale(config.outlierValue(d, i));
            }).attr('r', '3');
            outliers.exit().remove();
        }
    }, {
        key: 'update',
        value: function update(newData) {
            _get(Object.getPrototypeOf(BoxPlotBase.prototype), 'update', this).call(this, newData);
            this.drawAxisX();
            this.drawAxisY();
            this.drawBoxPlots();
            return this;
        }
    }, {
        key: 'setupColor',
        value: function setupColor() {
            var _this4 = this;

            var self = this;
            var conf = this.config;

            if (conf.d3ColorCategory) {
                this.plot.colorCategory = d3.scale[conf.d3ColorCategory]();
            }
            var colorValue = conf.color;
            if (colorValue && typeof colorValue === 'string' || colorValue instanceof String) {
                this.plot.color = colorValue;
            } else if (this.plot.colorCategory) {
                self.plot.colorValue = colorValue;
                this.plot.color = function (d) {
                    return self.plot.colorCategory(_this4.plot.x.value(d));
                };
            }
        }
    }]);

    return BoxPlotBase;
}(_chart.Chart);

},{"./chart":26,"./utils":39}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BoxPlot = exports.BoxPlotConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _boxPlotBase = require('./box-plot-base');

var _utils = require('./utils');

var _statisticsUtils = require('./statistics-utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BoxPlotConfig = exports.BoxPlotConfig = function (_BoxPlotBaseConfig) {
    _inherits(BoxPlotConfig, _BoxPlotBaseConfig);

    function BoxPlotConfig(custom) {
        _classCallCheck(this, BoxPlotConfig);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BoxPlotConfig).call(this));

        _this.svgClass = _this.cssClassPrefix + 'box-plot';
        _this.showLegend = true;
        _this.showTooltip = true;
        _this.y = { // Y axis config
            title: '',
            key: undefined,
            value: function value(d) {
                return this.y.key === undefined ? d : d[this.y.key];
            }, // y value accessor
            scale: "linear",
            orient: 'left',
            domainMargin: 0.1,
            guides: true //show axis guides
        };
        _this.series = false;
        _this.groups = {
            key: undefined,
            value: function value(d) {
                return this.groups.key === undefined ? '' : d[this.groups.key];
            }, // grouping value accessor,
            label: "",
            displayValue: undefined // optional function returning display value (series label) for given group value, or object/array mapping value to display value
        };

        if (custom) {
            _utils.Utils.deepExtend(_this, custom);
        }
        return _this;
    }

    return BoxPlotConfig;
}(_boxPlotBase.BoxPlotBaseConfig);

var BoxPlot = exports.BoxPlot = function (_BoxPlotBase) {
    _inherits(BoxPlot, _BoxPlotBase);

    function BoxPlot(placeholderSelector, data, config) {
        _classCallCheck(this, BoxPlot);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(BoxPlot).call(this, placeholderSelector, data, new BoxPlotConfig(config)));
    }

    _createClass(BoxPlot, [{
        key: 'setConfig',
        value: function setConfig(config) {
            return _get(Object.getPrototypeOf(BoxPlot.prototype), 'setConfig', this).call(this, new BoxPlotConfig(config));
        }
    }, {
        key: 'getDataToPlot',
        value: function getDataToPlot() {
            var self = this;
            var conf = self.config;
            self.plot.groupingEnabled = this.isGroupingEnabled();

            var data = this.data;
            if (!self.plot.groupingEnabled) {
                self.plot.groupedData = [{
                    key: '',
                    values: data
                }];
                self.plot.dataLength = data.length;
            } else {
                if (self.config.series) {
                    self.plot.groupedData = data.map(function (s) {
                        return {
                            key: s.label || s.key || '',
                            values: s.values
                        };
                    });
                } else {
                    self.plot.groupValue = function (d) {
                        return conf.groups.value.call(conf, d);
                    };
                    self.plot.groupedData = d3.nest().key(this.plot.groupValue).entries(data);

                    var getDisplayValue = function getDisplayValue(k) {
                        return k;
                    };
                    if (self.config.groups.displayValue) {
                        if (_utils.Utils.isFunction(self.config.groups.displayValue)) {
                            getDisplayValue = function getDisplayValue(k) {
                                return self.config.groups.displayValue(k) || k;
                            };
                        } else if (_utils.Utils.isObject(self.config.groups.displayValue)) {
                            getDisplayValue = function getDisplayValue(k) {
                                return self.config.groups.displayValue[k] || k;
                            };
                        }
                    }
                    self.plot.groupedData.forEach(function (g) {
                        g.key = getDisplayValue(g.key);
                    });
                }

                self.plot.dataLength = d3.sum(this.plot.groupedData, function (s) {
                    return s.values.length;
                });
            }

            self.plot.groupedData.forEach(function (s) {
                if (!Array.isArray(s.values)) {
                    return;
                }

                var values = s.values.map(function (d) {
                    return parseFloat(self.config.y.value.call(self.config, d));
                });
                s.values.Q1 = _statisticsUtils.StatisticsUtils.quantile(values, 0.25);
                s.values.Q2 = _statisticsUtils.StatisticsUtils.quantile(values, 0.5);
                s.values.Q3 = _statisticsUtils.StatisticsUtils.quantile(values, 0.75);
                s.values.whiskerLow = d3.min(values);
                s.values.whiskerHigh = d3.max(values);
            });

            return self.plot.groupedData;
        }
    }, {
        key: 'isGroupingEnabled',
        value: function isGroupingEnabled() {
            return this.config.series || !!(this.config.groups && this.config.groups.value);
        }
    }]);

    return BoxPlot;
}(_boxPlotBase.BoxPlotBase);

},{"./box-plot-base":23,"./statistics-utils":38,"./utils":39}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ChartWithColorGroups = exports.ChartWithColorGroupsConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chart = require("./chart");

var _utils = require("./utils");

var _legend = require("./legend");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ChartWithColorGroupsConfig = exports.ChartWithColorGroupsConfig = function (_ChartConfig) {
    _inherits(ChartWithColorGroupsConfig, _ChartConfig);

    function ChartWithColorGroupsConfig(custom) {
        _classCallCheck(this, ChartWithColorGroupsConfig);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ChartWithColorGroupsConfig).call(this));

        _this.showLegend = true;
        _this.legend = {
            width: 80,
            margin: 10,
            shapeWidth: 20
        };
        _this.groups = {
            key: 2,
            value: function value(d) {
                return d[this.groups.key];
            }, // grouping value accessor,
            label: "",
            displayValue: undefined // optional function returning display value (series label) for given group value, or object/array mapping value to display value
        };
        _this.series = false;
        _this.color = undefined;
        _this.d3ColorCategory = 'category10';

        if (custom) {
            _utils.Utils.deepExtend(_this, custom);
        }

        return _this;
    } // string or function returning color's value for color scale


    return ChartWithColorGroupsConfig;
}(_chart.ChartConfig);

var ChartWithColorGroups = exports.ChartWithColorGroups = function (_Chart) {
    _inherits(ChartWithColorGroups, _Chart);

    function ChartWithColorGroups(placeholderSelector, data, config) {
        _classCallCheck(this, ChartWithColorGroups);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ChartWithColorGroups).call(this, placeholderSelector, data, new ChartWithColorGroupsConfig(config)));
    }

    _createClass(ChartWithColorGroups, [{
        key: "setConfig",
        value: function setConfig(config) {
            return _get(Object.getPrototypeOf(ChartWithColorGroups.prototype), "setConfig", this).call(this, new ChartWithColorGroupsConfig(config));
        }
    }, {
        key: "initPlot",
        value: function initPlot() {
            _get(Object.getPrototypeOf(ChartWithColorGroups.prototype), "initPlot", this).call(this);
            var self = this;

            var conf = this.config;

            this.plot.showLegend = conf.showLegend;
            if (this.plot.showLegend) {
                this.plot.margin.right = conf.margin.right + conf.legend.width + conf.legend.margin * 2;
            }
            this.setupGroups();
            this.plot.data = this.getDataToPlot();
            this.groupData();
            return this;
        }
    }, {
        key: "isGroupingEnabled",
        value: function isGroupingEnabled() {
            return this.config.series || !!(this.config.groups && this.config.groups.value);
        }
    }, {
        key: "computeGroupColorDomain",
        value: function computeGroupColorDomain() {
            var _this3 = this;

            return Object.getOwnPropertyNames(d3.map(this.data, function (d) {
                return _this3.plot.groupValue(d);
            })['_']);
        }
    }, {
        key: "setupGroups",
        value: function setupGroups() {
            var _this4 = this;

            var self = this;
            var conf = this.config;

            this.plot.groupingEnabled = this.isGroupingEnabled();
            var domain = [];
            if (this.plot.groupingEnabled) {
                self.plot.groupToLabel = {};
                if (this.config.series) {
                    this.plot.groupValue = function (s) {
                        return s.key;
                    };
                    domain = this.computeGroupColorDomain();

                    this.data.forEach(function (s) {
                        self.plot.groupToLabel[s.key] = s.label || s.key;
                    });
                } else {
                    this.plot.groupValue = function (d) {
                        return conf.groups.value.call(conf, d);
                    };
                    domain = this.computeGroupColorDomain();
                    var getLabel = function getLabel(k) {
                        return k;
                    };
                    if (self.config.groups.displayValue) {
                        if (_utils.Utils.isFunction(self.config.groups.displayValue)) {
                            getLabel = function getLabel(k) {
                                return self.config.groups.displayValue(k) || k;
                            };
                        } else if (_utils.Utils.isObject(self.config.groups.displayValue)) {
                            getLabel = function getLabel(k) {
                                return self.config.groups.displayValue[k] || k;
                            };
                        }
                    }
                    domain.forEach(function (k) {
                        self.plot.groupToLabel[k] = getLabel(k);
                    });
                }
            } else {
                this.plot.groupValue = function (d) {
                    return null;
                };
            }

            if (conf.d3ColorCategory) {
                this.plot.colorCategory = d3.scale[conf.d3ColorCategory]();
            }
            var colorValue = conf.color;
            if (colorValue && typeof colorValue === 'string' || colorValue instanceof String) {
                this.plot.color = colorValue;
                this.plot.seriesColor = this.plot.color;
            } else if (this.plot.colorCategory) {
                self.plot.colorValue = colorValue;
                self.plot.colorCategory.domain(domain);

                this.plot.seriesColor = function (s) {
                    return self.plot.colorCategory(s.key);
                };
                this.plot.color = function (d) {
                    return self.plot.colorCategory(_this4.plot.groupValue(d));
                };
            } else {
                this.plot.color = this.plot.seriesColor = function (s) {
                    return 'black';
                };
            }
        }
    }, {
        key: "groupData",
        value: function groupData() {
            var self = this;
            var data = this.plot.data;
            if (!self.plot.groupingEnabled) {
                self.plot.groupedData = [{
                    key: null,
                    label: '',
                    values: data
                }];
                self.plot.dataLength = data.length;
            } else {

                if (self.config.series) {
                    self.plot.groupedData = data.map(function (s) {
                        return {
                            key: s.key,
                            label: s.label,
                            values: s.values
                        };
                    });
                } else {
                    self.plot.groupedData = d3.nest().key(this.plot.groupValue).entries(data);
                    self.plot.groupedData.forEach(function (g) {
                        g.label = self.plot.groupToLabel[g.key];
                    });
                }

                self.plot.dataLength = d3.sum(this.plot.groupedData, function (s) {
                    return s.values.length;
                });
            }

            // this.plot.seriesColor
        }
    }, {
        key: "getDataToPlot",
        value: function getDataToPlot() {
            var _this5 = this;

            if (!this.plot.groupingEnabled || !this.enabledGroups) {
                return this.data;
            }
            return this.data.filter(function (d) {
                return _this5.enabledGroups.indexOf(_this5.plot.groupValue(d)) > -1;
            });
        }
    }, {
        key: "update",
        value: function update(newData) {
            _get(Object.getPrototypeOf(ChartWithColorGroups.prototype), "update", this).call(this, newData);
            this.updateLegend();

            return this;
        }
    }, {
        key: "updateLegend",
        value: function updateLegend() {

            var self = this;
            var plot = this.plot;

            var scale = plot.colorCategory;

            if (!scale.domain() || scale.domain().length < 2) {
                plot.showLegend = false;
            }

            if (!plot.showLegend) {
                if (plot.legend && plot.legend.container) {
                    plot.legend.container.remove();
                }
                return;
            }

            var legendX = this.plot.width + this.config.legend.margin;
            var legendY = this.config.legend.margin;

            plot.legend = new _legend.Legend(this.svg, this.svgG, scale, legendX, legendY);

            plot.legendColor = plot.legend.color().shapeWidth(this.config.legend.shapeWidth).orient('vertical').scale(scale).labels(scale.domain().map(function (v) {
                return plot.groupToLabel[v];
            }));

            plot.legendColor.on('cellclick', function (c) {
                return self.onLegendCellClick(c);
            });

            plot.legend.container.call(plot.legendColor);

            this.updateLegendCellStatuses();
        }
    }, {
        key: "onLegendCellClick",
        value: function onLegendCellClick(cellValue) {
            this.updateEnabledGroups(cellValue);
            this.init();
        }
    }, {
        key: "updateLegendCellStatuses",
        value: function updateLegendCellStatuses() {
            var self = this;
            this.plot.legend.container.selectAll("g.cell").each(function (cell) {
                var isDisabled = self.enabledGroups && self.enabledGroups.indexOf(cell) < 0;
                d3.select(this).classed("odc-disabled", isDisabled);
            });
        }
    }, {
        key: "updateEnabledGroups",
        value: function updateEnabledGroups(cellValue) {
            if (!this.enabledGroups) {
                this.enabledGroups = this.plot.colorCategory.domain().slice();
            }
            var index = this.enabledGroups.indexOf(cellValue);

            if (index < 0) {
                this.enabledGroups.push(cellValue);
            } else {
                this.enabledGroups.splice(index, 1);
            }

            if (!this.enabledGroups.length) {
                this.enabledGroups = this.plot.colorCategory.domain().slice();
            }
        }
    }, {
        key: "setData",
        value: function setData(data) {
            _get(Object.getPrototypeOf(ChartWithColorGroups.prototype), "setData", this).call(this, data);
            this.enabledGroups = null;
            return this;
        }
    }]);

    return ChartWithColorGroups;
}(_chart.Chart);

},{"./chart":26,"./legend":33,"./utils":39}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Chart = exports.ChartConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChartConfig = exports.ChartConfig = function ChartConfig(custom) {
    _classCallCheck(this, ChartConfig);

    this.cssClassPrefix = "odc-";
    this.svgClass = this.cssClassPrefix + 'mw-d3-chart';
    this.width = undefined;
    this.height = undefined;
    this.margin = {
        left: 50,
        right: 30,
        top: 30,
        bottom: 50
    };
    this.showTooltip = false;
    this.transition = true;

    if (custom) {
        _utils.Utils.deepExtend(this, custom);
    }
};

var Chart = exports.Chart = function () {
    function Chart(base, data, config) {
        _classCallCheck(this, Chart);

        this.utils = _utils.Utils;
        this.plot = {
            margin: {}
        };
        this._attached = {};
        this._layers = {};
        this._events = {};
        this._isInitialized = false;

        this._id = _utils.Utils.guid();
        this._isAttached = base instanceof Chart;

        this.baseContainer = base;

        this.setConfig(config);

        if (data) {
            this.setData(data);
        }

        this.init();
        this.postInit();
    }

    _createClass(Chart, [{
        key: 'setConfig',
        value: function setConfig(config) {
            if (!config) {
                this.config = new ChartConfig();
            } else {
                this.config = config;
            }

            return this;
        }
    }, {
        key: 'setData',
        value: function setData(data) {
            this.data = data;
            return this;
        }
    }, {
        key: 'init',
        value: function init() {
            var self = this;

            self.initPlot();
            self.initSvg();

            if (!this._isInitialized) {
                self.initTooltip();
            }
            self.draw();
            this._isInitialized = true;
            return this;
        }
    }, {
        key: 'postInit',
        value: function postInit() {}
    }, {
        key: 'initSvg',
        value: function initSvg() {
            var self = this;
            var config = this.config;

            var margin = self.plot.margin;
            var width = self.plot.width + margin.left + margin.right;
            var height = self.plot.height + margin.top + margin.bottom;
            var aspect = width / height;
            if (!self._isAttached) {
                if (!this._isInitialized) {
                    d3.select(self.baseContainer).select("svg").remove();
                }
                self.svg = d3.select(self.baseContainer).selectOrAppend("svg");

                self.svg.attr("width", width).attr("height", height).attr("viewBox", "0 0 " + " " + width + " " + height).attr("preserveAspectRatio", "xMidYMid meet").attr("class", config.svgClass);
                self.svgG = self.svg.selectOrAppend("g.main-group");
            } else {
                console.log(self.baseContainer);
                self.svg = self.baseContainer.svg;
                self.svgG = self.svg.selectOrAppend("g.main-group." + config.svgClass);
            }

            self.svgG.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            if (!config.width || config.height) {
                d3.select(window).on("resize." + self._id, function () {
                    console.log("resize", self);
                    var transition = self.config.transition;
                    self.config.transition = false;
                    self.init();
                    self.config.transition = transition;
                });
            }
        }
    }, {
        key: 'initTooltip',
        value: function initTooltip() {
            var self = this;
            if (self.config.showTooltip) {
                if (!self._isAttached) {
                    self.plot.tooltip = d3.select("body").selectOrAppend('div.' + self.config.cssClassPrefix + 'tooltip').style("opacity", 0);
                } else {
                    self.plot.tooltip = self.baseContainer.plot.tooltip;
                }
            } else {
                self.plot.tooltip = null;
            }
        }
    }, {
        key: 'initPlot',
        value: function initPlot() {
            var margin = this.config.margin;
            this.plot = this.plot || {};
            this.plot.margin = {
                top: margin.top,
                bottom: margin.bottom,
                left: margin.left,
                right: margin.right
            };
        }
    }, {
        key: 'update',
        value: function update(data) {
            if (data) {
                this.setData(data);
            }
            var layerName, attachmentData;
            for (var attachmentName in this._attached) {

                attachmentData = data;

                this._attached[attachmentName].update(attachmentData);
            }
            return this;
        }
    }, {
        key: 'draw',
        value: function draw(data) {
            this.update(data);

            return this;
        }

        //Borrowed from d3.chart
        /**
         * Register or retrieve an "attachment" Chart. The "attachment" chart's `draw`
         * method will be invoked whenever the containing chart's `draw` method is
         * invoked.
         *
         * @externalExample chart-attach
         *
         * @param {String} attachmentName Name of the attachment
         * @param {Chart} [chart] Chart to register as a mix in of this chart. When
         *        unspecified, this method will return the attachment previously
         *        registered with the specified `attachmentName` (if any).
         *
         * @returns {Chart} Reference to this chart (chainable).
         */

    }, {
        key: 'attach',
        value: function attach(attachmentName, chart) {
            if (arguments.length === 1) {
                return this._attached[attachmentName];
            }

            this._attached[attachmentName] = chart;
            return chart;
        }
    }, {
        key: 'on',


        //Borrowed from d3.chart
        /**
         * Subscribe a callback function to an event triggered on the chart. See {@link
            * Chart#once} to subscribe a callback function to an event for one occurence.
         *
         * @externalExample {runnable} chart-on
         *
         * @param {String} name Name of the event
         * @param {ChartEventHandler} callback Function to be invoked when the event
         *        occurs
         * @param {Object} [context] Value to set as `this` when invoking the
         *        `callback`. Defaults to the chart instance.
         *
         * @returns {Chart} A reference to this chart (chainable).
         */
        value: function on(name, callback, context) {
            var events = this._events[name] || (this._events[name] = []);
            events.push({
                callback: callback,
                context: context || this,
                _chart: this
            });
            return this;
        }

        //Borrowed from d3.chart
        /**
         *
         * Subscribe a callback function to an event triggered on the chart. This
         * function will be invoked at the next occurance of the event and immediately
         * unsubscribed. See {@link Chart#on} to subscribe a callback function to an
         * event indefinitely.
         *
         * @externalExample {runnable} chart-once
         *
         * @param {String} name Name of the event
         * @param {ChartEventHandler} callback Function to be invoked when the event
         *        occurs
         * @param {Object} [context] Value to set as `this` when invoking the
         *        `callback`. Defaults to the chart instance
         *
         * @returns {Chart} A reference to this chart (chainable)
         */

    }, {
        key: 'once',
        value: function once(name, callback, context) {
            var self = this;
            var once = function once() {
                self.off(name, once);
                callback.apply(this, arguments);
            };
            return this.on(name, once, context);
        }

        //Borrowed from d3.chart
        /**
         * Unsubscribe one or more callback functions from an event triggered on the
         * chart. When no arguments are specified, *all* handlers will be unsubscribed.
         * When only a `name` is specified, all handlers subscribed to that event will
         * be unsubscribed. When a `name` and `callback` are specified, only that
         * function will be unsubscribed from that event. When a `name` and `context`
         * are specified (but `callback` is omitted), all events bound to the given
         * event with the given context will be unsubscribed.
         *
         * @externalExample {runnable} chart-off
         *
         * @param {String} [name] Name of the event to be unsubscribed
         * @param {ChartEventHandler} [callback] Function to be unsubscribed
         * @param {Object} [context] Contexts to be unsubscribe
         *
         * @returns {Chart} A reference to this chart (chainable).
         */

    }, {
        key: 'off',
        value: function off(name, callback, context) {
            var names, n, events, event, i, j;

            // remove all events
            if (arguments.length === 0) {
                for (name in this._events) {
                    this._events[name].length = 0;
                }
                return this;
            }

            // remove all events for a specific name
            if (arguments.length === 1) {
                events = this._events[name];
                if (events) {
                    events.length = 0;
                }
                return this;
            }

            // remove all events that match whatever combination of name, context
            // and callback.
            names = name ? [name] : Object.keys(this._events);
            for (i = 0; i < names.length; i++) {
                n = names[i];
                events = this._events[n];
                j = events.length;
                while (j--) {
                    event = events[j];
                    if (callback && callback === event.callback || context && context === event.context) {
                        events.splice(j, 1);
                    }
                }
            }

            return this;
        }
    }, {
        key: 'trigger',


        //Borrowed from d3.chart
        /**
         * Publish an event on this chart with the given `name`.
         *
         * @externalExample {runnable} chart-trigger
         *
         * @param {String} name Name of the event to publish
         * @param {...*} arguments Values with which to invoke the registered
         *        callbacks.
         *
         * @returns {Chart} A reference to this chart (chainable).
         */
        value: function trigger(name) {
            var args = Array.prototype.slice.call(arguments, 1);
            var events = this._events[name];
            var i, ev;

            if (events !== undefined) {
                for (i = 0; i < events.length; i++) {
                    ev = events[i];
                    ev.callback.apply(ev.context, args);
                }
            }

            return this;
        }
    }, {
        key: 'getBaseContainer',
        value: function getBaseContainer() {
            if (this._isAttached) {
                return this.baseContainer.svg;
            }
            return d3.select(this.baseContainer);
        }
    }, {
        key: 'getBaseContainerNode',
        value: function getBaseContainerNode() {

            return this.getBaseContainer().node();
        }
    }, {
        key: 'prefixClass',
        value: function prefixClass(clazz, addDot) {
            return addDot ? '.' : '' + this.config.cssClassPrefix + clazz;
        }
    }, {
        key: 'computePlotSize',
        value: function computePlotSize() {
            this.plot.width = _utils.Utils.availableWidth(this.config.width, this.getBaseContainer(), this.plot.margin);
            this.plot.height = _utils.Utils.availableHeight(this.config.height, this.getBaseContainer(), this.plot.margin);
        }
    }, {
        key: 'transitionEnabled',
        value: function transitionEnabled() {
            return this._isInitialized && this.config.transition;
        }
    }, {
        key: 'showTooltip',
        value: function showTooltip(html) {
            if (!this.plot.tooltip) {
                return;
            }
            this.plot.tooltip.transition().duration(200).style("opacity", .9);
            this.plot.tooltip.html(html).style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");
        }
    }, {
        key: 'hideTooltip',
        value: function hideTooltip() {
            if (!this.plot.tooltip) {
                return;
            }
            this.plot.tooltip.transition().duration(500).style("opacity", 0);
        }
    }]);

    return Chart;
}();

},{"./utils":39}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CorrelationMatrix = exports.CorrelationMatrixConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chart = require('./chart');

var _utils = require('./utils');

var _statisticsUtils = require('./statistics-utils');

var _legend = require('./legend');

var _scatterplot = require('./scatterplot');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CorrelationMatrixConfig = exports.CorrelationMatrixConfig = function (_ChartConfig) {
    _inherits(CorrelationMatrixConfig, _ChartConfig);

    //show tooltip on dot hover

    function CorrelationMatrixConfig(custom) {
        _classCallCheck(this, CorrelationMatrixConfig);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CorrelationMatrixConfig).call(this));

        _this.svgClass = _this.cssClassPrefix + 'correlation-matrix';
        _this.guides = false;
        _this.showTooltip = true;
        _this.showLegend = true;
        _this.highlightLabels = true;
        _this.rotateLabelsX = true;
        _this.rotateLabelsY = true;
        _this.variables = {
            labels: undefined,
            keys: [], //optional array of variable keys
            value: function value(d, variableKey) {
                return d[variableKey];
            }, // variable value accessor
            scale: "ordinal"
        };
        _this.correlation = {
            scale: "linear",
            domain: [-1, -0.75, -0.5, 0, 0.5, 0.75, 1],
            range: ["darkblue", "blue", "lightskyblue", "white", "orangered", "crimson", "darkred"],
            value: function value(xValues, yValues) {
                return _statisticsUtils.StatisticsUtils.sampleCorrelation(xValues, yValues);
            }

        };
        _this.cell = {
            shape: "ellipse", //possible values: rect, circle, ellipse
            size: undefined,
            sizeMin: 15,
            sizeMax: 250,
            padding: 1
        };
        _this.margin = {
            left: 60,
            right: 50,
            top: 30,
            bottom: 60
        };

        if (custom) {
            _utils.Utils.deepExtend(_this, custom);
        }
        return _this;
    } //show axis guides


    return CorrelationMatrixConfig;
}(_chart.ChartConfig);

var CorrelationMatrix = exports.CorrelationMatrix = function (_Chart) {
    _inherits(CorrelationMatrix, _Chart);

    function CorrelationMatrix(placeholderSelector, data, config) {
        _classCallCheck(this, CorrelationMatrix);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CorrelationMatrix).call(this, placeholderSelector, data, new CorrelationMatrixConfig(config)));
    }

    _createClass(CorrelationMatrix, [{
        key: 'setConfig',
        value: function setConfig(config) {
            return _get(Object.getPrototypeOf(CorrelationMatrix.prototype), 'setConfig', this).call(this, new CorrelationMatrixConfig(config));
        }
    }, {
        key: 'initPlot',
        value: function initPlot() {
            _get(Object.getPrototypeOf(CorrelationMatrix.prototype), 'initPlot', this).call(this);
            var self = this;
            var margin = this.config.margin;
            var conf = this.config;

            this.plot.x = {};
            this.plot.correlation = {
                matrix: undefined,
                cells: undefined,
                color: {},
                shape: {}
            };

            this.setupVariables();
            var width = conf.width;
            var placeholderNode = this.getBaseContainerNode();
            this.plot.placeholderNode = placeholderNode;

            var parentWidth = placeholderNode.getBoundingClientRect().width;
            if (width) {

                if (!this.plot.cellSize) {
                    this.plot.cellSize = Math.max(conf.cell.sizeMin, Math.min(conf.cell.sizeMax, (width - margin.left - margin.right) / this.plot.variables.length));
                }
            } else {
                this.plot.cellSize = this.config.cell.size;

                if (!this.plot.cellSize) {
                    this.plot.cellSize = Math.max(conf.cell.sizeMin, Math.min(conf.cell.sizeMax, (parentWidth - margin.left - margin.right) / this.plot.variables.length));
                }

                width = this.plot.cellSize * this.plot.variables.length + margin.left + margin.right;
            }

            var height = width;
            if (!height) {
                height = placeholderNode.getBoundingClientRect().height;
            }

            this.plot.width = width - margin.left - margin.right;
            this.plot.height = this.plot.width;

            this.setupVariablesScales();
            this.setupCorrelationScales();
            this.setupCorrelationMatrix();

            return this;
        }
    }, {
        key: 'setupVariablesScales',
        value: function setupVariablesScales() {

            var plot = this.plot;
            var x = plot.x;
            var conf = this.config.variables;

            /* *
             * value accessor - returns the value to encode for a given data object.
             * scale - maps value to a visual display encoding, such as a pixel position.
             * map function - maps from data value to display value
             * axis - sets up axis
             **/
            x.value = conf.value;
            x.scale = d3.scale[conf.scale]().rangeBands([plot.width, 0]);
            x.map = function (d) {
                return x.scale(x.value(d));
            };
        }
    }, {
        key: 'setupCorrelationScales',
        value: function setupCorrelationScales() {
            var plot = this.plot;
            var corrConf = this.config.correlation;

            plot.correlation.color.scale = d3.scale[corrConf.scale]().domain(corrConf.domain).range(corrConf.range);
            var shape = plot.correlation.shape = {};

            var cellConf = this.config.cell;
            shape.type = cellConf.shape;

            var shapeSize = plot.cellSize - cellConf.padding * 2;
            if (shape.type == 'circle') {
                var radiusMax = shapeSize / 2;
                shape.radiusScale = d3.scale.linear().domain([0, 1]).range([2, radiusMax]);
                shape.radius = function (c) {
                    return shape.radiusScale(Math.abs(c.value));
                };
            } else if (shape.type == 'ellipse') {
                var radiusMax = shapeSize / 2;
                shape.radiusScale = d3.scale.linear().domain([0, 1]).range([radiusMax, 2]);
                shape.radiusX = function (c) {
                    return shape.radiusScale(Math.abs(c.value));
                };
                shape.radiusY = radiusMax;

                shape.rotateVal = function (v) {
                    if (v == 0) return "0";
                    if (v < 0) return "-45";
                    return "45";
                };
            } else if (shape.type == 'rect') {
                shape.size = shapeSize;
            }
        }
    }, {
        key: 'setupVariables',
        value: function setupVariables() {

            var variablesConf = this.config.variables;

            var data = this.data;
            var plot = this.plot;
            plot.domainByVariable = {};
            plot.variables = variablesConf.keys;
            if (!plot.variables || !plot.variables.length) {
                plot.variables = _utils.Utils.inferVariables(data, this.config.groups.key, this.config.includeInPlot);
            }

            plot.labels = [];
            plot.labelByVariable = {};
            plot.variables.forEach(function (variableKey, index) {
                plot.domainByVariable[variableKey] = d3.extent(data, function (d) {
                    return variablesConf.value(d, variableKey);
                });
                var label = variableKey;
                if (variablesConf.labels && variablesConf.labels.length > index) {

                    label = variablesConf.labels[index];
                }
                plot.labels.push(label);
                plot.labelByVariable[variableKey] = label;
            });

            console.log(plot.labelByVariable);
        }
    }, {
        key: 'setupCorrelationMatrix',
        value: function setupCorrelationMatrix() {
            var self = this;
            var data = this.data;
            var matrix = this.plot.correlation.matrix = [];
            var matrixCells = this.plot.correlation.matrix.cells = [];
            var plot = this.plot;

            var variableToValues = {};
            plot.variables.forEach(function (v, i) {

                variableToValues[v] = data.map(function (d) {
                    return plot.x.value(d, v);
                });
            });

            plot.variables.forEach(function (v1, i) {
                var row = [];
                matrix.push(row);

                plot.variables.forEach(function (v2, j) {
                    var corr = 1;
                    if (v1 != v2) {
                        corr = self.config.correlation.value(variableToValues[v1], variableToValues[v2]);
                    }
                    var cell = {
                        rowVar: v1,
                        colVar: v2,
                        row: i,
                        col: j,
                        value: corr
                    };
                    row.push(cell);

                    matrixCells.push(cell);
                });
            });
        }
    }, {
        key: 'update',
        value: function update(newData) {
            _get(Object.getPrototypeOf(CorrelationMatrix.prototype), 'update', this).call(this, newData);
            // this.update
            this.updateCells();
            this.updateVariableLabels();

            if (this.config.showLegend) {
                this.updateLegend();
            }
        }
    }, {
        key: 'updateVariableLabels',
        value: function updateVariableLabels() {
            this.plot.labelClass = this.prefixClass("label");
            this.updateAxisX();
            this.updateAxisY();
        }
    }, {
        key: 'updateAxisX',
        value: function updateAxisX() {
            var self = this;
            var plot = self.plot;
            var labelClass = plot.labelClass;
            var labelXClass = labelClass + "-x";

            var labels = self.svgG.selectAll("text." + labelXClass).data(plot.variables, function (d, i) {
                return i;
            });

            labels.enter().append("text").attr("class", function (d, i) {
                return labelClass + " " + labelXClass + " " + labelXClass + "-" + i;
            });

            labels.attr("x", function (d, i) {
                return i * plot.cellSize + plot.cellSize / 2;
            }).attr("y", plot.height).attr("dx", -2).attr("dy", 5).attr("text-anchor", "end")

            // .attr("dominant-baseline", "hanging")
            .text(function (v) {
                return plot.labelByVariable[v];
            });

            if (this.config.rotateLabelsX) {
                labels.attr("transform", function (d, i) {
                    return "rotate(-45, " + (i * plot.cellSize + plot.cellSize / 2) + ", " + plot.height + ")";
                });
            }

            var maxWidth = self.computeXAxisLabelsWidth();
            labels.each(function (label) {
                _utils.Utils.placeTextWithEllipsisAndTooltip(d3.select(this), label, maxWidth, self.config.showTooltip ? self.plot.tooltip : false);
            });

            labels.exit().remove();
        }
    }, {
        key: 'updateAxisY',
        value: function updateAxisY() {
            var self = this;
            var plot = self.plot;
            var labelClass = plot.labelClass;
            var labelYClass = plot.labelClass + "-y";
            var labels = self.svgG.selectAll("text." + labelYClass).data(plot.variables);

            labels.enter().append("text");

            labels.attr("x", 0).attr("y", function (d, i) {
                return i * plot.cellSize + plot.cellSize / 2;
            }).attr("dx", -2).attr("text-anchor", "end").attr("class", function (d, i) {
                return labelClass + " " + labelYClass + " " + labelYClass + "-" + i;
            })
            // .attr("dominant-baseline", "hanging")
            .text(function (v) {
                return plot.labelByVariable[v];
            });

            if (this.config.rotateLabelsY) {
                labels.attr("transform", function (d, i) {
                    return "rotate(-45, " + 0 + ", " + (i * plot.cellSize + plot.cellSize / 2) + ")";
                }).attr("text-anchor", "end");
            }

            var maxWidth = self.computeYAxisLabelsWidth();
            labels.each(function (label) {
                _utils.Utils.placeTextWithEllipsisAndTooltip(d3.select(this), label, maxWidth, self.config.showTooltip ? self.plot.tooltip : false);
            });

            labels.exit().remove();
        }
    }, {
        key: 'computeYAxisLabelsWidth',
        value: function computeYAxisLabelsWidth() {
            var maxWidth = this.plot.margin.left;
            if (!this.config.rotateLabelsY) {
                return maxWidth;
            }

            maxWidth *= _utils.Utils.SQRT_2;
            var fontSize = 11; //todo check actual font size
            maxWidth -= fontSize / 2;

            return maxWidth;
        }
    }, {
        key: 'computeXAxisLabelsWidth',
        value: function computeXAxisLabelsWidth(offset) {
            if (!this.config.rotateLabelsX) {
                return this.plot.cellSize - 2;
            }
            var size = this.plot.margin.bottom;
            size *= _utils.Utils.SQRT_2;
            var fontSize = 11; //todo check actual font size
            size -= fontSize / 2;
            return size;
        }
    }, {
        key: 'updateCells',
        value: function updateCells() {

            var self = this;
            var plot = self.plot;
            var cellClass = self.prefixClass("cell");
            var cellShape = plot.correlation.shape.type;

            var cells = self.svgG.selectAll("g." + cellClass).data(plot.correlation.matrix.cells);

            var cellEnterG = cells.enter().append("g").classed(cellClass, true);
            cells.attr("transform", function (c) {
                return "translate(" + (plot.cellSize * c.col + plot.cellSize / 2) + "," + (plot.cellSize * c.row + plot.cellSize / 2) + ")";
            });

            cells.classed(self.config.cssClassPrefix + "selectable", !!self.scatterPlot);

            var selector = "*:not(.cell-shape-" + cellShape + ")";

            var wrongShapes = cells.selectAll(selector);
            wrongShapes.remove();

            var shapes = cells.selectOrAppend(cellShape + ".cell-shape-" + cellShape);

            if (plot.correlation.shape.type == 'circle') {

                shapes.attr("r", plot.correlation.shape.radius).attr("cx", 0).attr("cy", 0);
            }

            if (plot.correlation.shape.type == 'ellipse') {
                // cells.attr("transform", c=> "translate(300,150) rotate("+plot.correlation.shape.rotateVal(c.value)+")");
                shapes.attr("rx", plot.correlation.shape.radiusX).attr("ry", plot.correlation.shape.radiusY).attr("cx", 0).attr("cy", 0).attr("transform", function (c) {
                    return "rotate(" + plot.correlation.shape.rotateVal(c.value) + ")";
                });
            }

            if (plot.correlation.shape.type == 'rect') {
                shapes.attr("width", plot.correlation.shape.size).attr("height", plot.correlation.shape.size).attr("x", -plot.cellSize / 2).attr("y", -plot.cellSize / 2);
            }
            shapes.style("fill", function (c) {
                return plot.correlation.color.scale(c.value);
            });

            var mouseoverCallbacks = [];
            var mouseoutCallbacks = [];

            if (plot.tooltip) {

                mouseoverCallbacks.push(function (c) {
                    var html = c.value;
                    self.showTooltip(html);
                });

                mouseoutCallbacks.push(function (c) {
                    self.hideTooltip();
                });
            }

            if (self.config.highlightLabels) {
                var highlightClass = self.config.cssClassPrefix + "highlight";
                var xLabelClass = function xLabelClass(c) {
                    return plot.labelClass + "-x-" + c.col;
                };
                var yLabelClass = function yLabelClass(c) {
                    return plot.labelClass + "-y-" + c.row;
                };

                mouseoverCallbacks.push(function (c) {

                    self.svgG.selectAll("text." + xLabelClass(c)).classed(highlightClass, true);
                    self.svgG.selectAll("text." + yLabelClass(c)).classed(highlightClass, true);
                });
                mouseoutCallbacks.push(function (c) {
                    self.svgG.selectAll("text." + xLabelClass(c)).classed(highlightClass, false);
                    self.svgG.selectAll("text." + yLabelClass(c)).classed(highlightClass, false);
                });
            }

            cells.on("mouseover", function (c) {
                mouseoverCallbacks.forEach(function (callback) {
                    return callback(c);
                });
            }).on("mouseout", function (c) {
                mouseoutCallbacks.forEach(function (callback) {
                    return callback(c);
                });
            });

            cells.on("click", function (c) {
                self.trigger("cell-selected", c);
            });

            cells.exit().remove();
        }
    }, {
        key: 'updateLegend',
        value: function updateLegend() {

            var plot = this.plot;
            var legendX = this.plot.width + 10;
            var legendY = 0;
            var barWidth = 10;
            var barHeight = this.plot.height - 2;
            var scale = plot.correlation.color.scale;

            plot.legend = new _legend.Legend(this.svg, this.svgG, scale, legendX, legendY).linearGradientBar(barWidth, barHeight);
        }
    }, {
        key: 'attachScatterPlot',
        value: function attachScatterPlot(containerSelector, config) {
            var _this3 = this;

            var self = this;

            config = config || {};

            var scatterPlotConfig = {
                height: self.plot.height + self.config.margin.top + self.config.margin.bottom,
                width: self.plot.height + self.config.margin.top + self.config.margin.bottom,
                groups: {
                    key: self.config.groups.key,
                    label: self.config.groups.label
                },
                guides: true,
                showLegend: false
            };

            self.scatterPlot = true;

            scatterPlotConfig = _utils.Utils.deepExtend(scatterPlotConfig, config);
            this.update();

            this.on("cell-selected", function (c) {

                scatterPlotConfig.x = {
                    key: c.rowVar,
                    label: self.plot.labelByVariable[c.rowVar]
                };
                scatterPlotConfig.y = {
                    key: c.colVar,
                    label: self.plot.labelByVariable[c.colVar]
                };
                if (self.scatterPlot && self.scatterPlot !== true) {
                    self.scatterPlot.setConfig(scatterPlotConfig).init();
                } else {
                    self.scatterPlot = new _scatterplot.ScatterPlot(containerSelector, self.data, scatterPlotConfig);
                    _this3.attach("ScatterPlot", self.scatterPlot);
                }
            });
        }
    }]);

    return CorrelationMatrix;
}(_chart.Chart);

},{"./chart":26,"./legend":33,"./scatterplot":36,"./statistics-utils":38,"./utils":39}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.D3Extensions = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var D3Extensions = exports.D3Extensions = function () {
    function D3Extensions() {
        _classCallCheck(this, D3Extensions);
    }

    _createClass(D3Extensions, null, [{
        key: 'extend',
        value: function extend() {

            d3.selection.enter.prototype.insertSelector = d3.selection.prototype.insertSelector = function (selector, before) {
                return _utils.Utils.insertSelector(this, selector, before);
            };

            d3.selection.enter.prototype.appendSelector = d3.selection.prototype.appendSelector = function (selector) {
                return _utils.Utils.appendSelector(this, selector);
            };

            d3.selection.enter.prototype.selectOrAppend = d3.selection.prototype.selectOrAppend = function (selector) {
                return _utils.Utils.selectOrAppend(this, selector);
            };

            d3.selection.enter.prototype.selectOrInsert = d3.selection.prototype.selectOrInsert = function (selector, before) {
                return _utils.Utils.selectOrInsert(this, selector, before);
            };
        }
    }]);

    return D3Extensions;
}();

},{"./utils":39}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HeatmapTimeSeries = exports.HeatmapTimeSeriesConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chart = require("./chart");

var _heatmap = require("./heatmap");

var _utils = require("./utils");

var _statisticsUtils = require("./statistics-utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HeatmapTimeSeriesConfig = exports.HeatmapTimeSeriesConfig = function (_HeatmapConfig) {
    _inherits(HeatmapTimeSeriesConfig, _HeatmapConfig);

    function HeatmapTimeSeriesConfig(custom) {
        _classCallCheck(this, HeatmapTimeSeriesConfig);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HeatmapTimeSeriesConfig).call(this));

        _this.x = {
            fillMissing: false, // fill missing values using interval and intervalStep
            interval: undefined, //used in filling missing ticks
            intervalStep: 1,
            format: undefined, //input data d3 time format
            displayFormat: undefined, //d3 time format for display
            intervalToFormats: [//used to guess interval and format
            {
                name: 'year',
                formats: ["%Y"]
            }, {
                name: 'month',
                formats: ["%Y-%m"]
            }, {
                name: 'day',
                formats: ["%Y-%m-%d"]
            }, {
                name: 'hour',
                formats: ['%H', '%Y-%m-%d %H']
            }, {
                name: 'minute',
                formats: ['%H:%M', '%Y-%m-%d %H:%M']
            }, {
                name: 'second',
                formats: ['%H:%M:%S', '%Y-%m-%d %H:%M:%S']
            }],

            sortComparator: function sortComparator(a, b) {
                return _utils.Utils.isString(a) ? a.localeCompare(b) : a - b;
            },
            formatter: undefined
        };
        _this.z = {
            fillMissing: true // fiill missing values with nearest previous value
        };
        _this.legend = {
            formatter: function formatter(v) {
                var suffix = "";
                if (v / 1000000 >= 1) {
                    suffix = " M";
                    v = Number(v / 1000000).toFixed(3);
                }
                var nf = Intl.NumberFormat();
                return nf.format(v) + suffix;
            }
        };


        if (custom) {
            _utils.Utils.deepExtend(_this, custom);
        }
        return _this;
    }

    return HeatmapTimeSeriesConfig;
}(_heatmap.HeatmapConfig);

var HeatmapTimeSeries = exports.HeatmapTimeSeries = function (_Heatmap) {
    _inherits(HeatmapTimeSeries, _Heatmap);

    function HeatmapTimeSeries(placeholderSelector, data, config) {
        _classCallCheck(this, HeatmapTimeSeries);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(HeatmapTimeSeries).call(this, placeholderSelector, data, new HeatmapTimeSeriesConfig(config)));
    }

    _createClass(HeatmapTimeSeries, [{
        key: "setConfig",
        value: function setConfig(config) {
            return _get(Object.getPrototypeOf(HeatmapTimeSeries.prototype), "setConfig", this).call(this, new HeatmapTimeSeriesConfig(config));
        }
    }, {
        key: "setupValuesBeforeGroupsSort",
        value: function setupValuesBeforeGroupsSort() {
            var _this3 = this;

            this.plot.x.timeFormat = this.config.x.format;
            if (this.config.x.displayFormat && !this.plot.x.timeFormat) {
                this.guessTimeFormat();
            }

            _get(Object.getPrototypeOf(HeatmapTimeSeries.prototype), "setupValuesBeforeGroupsSort", this).call(this);
            if (!this.config.x.fillMissing) {
                return;
            }

            var self = this;

            this.initTimeFormatAndInterval();

            this.plot.x.intervalStep = this.config.x.intervalStep || 1;

            this.plot.x.timeParser = this.getTimeParser();

            this.plot.x.uniqueValues.sort(this.config.x.sortComparator);

            var prev = null;

            this.plot.x.uniqueValues.forEach(function (x, i) {
                var current = _this3.parseTime(x);
                if (prev === null) {
                    prev = current;
                    return;
                }

                var next = self.nextTimeTickValue(prev);
                var missing = [];
                var iteration = 0;
                while (self.compareTimeValues(next, current) <= 0) {
                    iteration++;
                    if (iteration > 100) {
                        break;
                    }
                    var d = {};
                    var timeString = self.formatTime(next);
                    d[_this3.config.x.key] = timeString;

                    self.updateGroups(d, timeString, self.plot.x.groups, self.config.x.groups);
                    missing.push(next);
                    next = self.nextTimeTickValue(next);
                }
                prev = current;
            });
        }
    }, {
        key: "parseTime",
        value: function parseTime(x) {
            var parser = this.getTimeParser();
            return parser.parse(x);
        }
    }, {
        key: "formatTime",
        value: function formatTime(date) {
            var parser = this.getTimeParser();
            return parser(date);
        }
    }, {
        key: "formatValueX",
        value: function formatValueX(value) {
            //used only for display
            if (this.config.x.formatter) return this.config.x.formatter.call(this.config, value);

            if (this.config.x.displayFormat) {
                var date = this.parseTime(value);
                return d3.time.format(this.config.x.displayFormat)(date);
            }

            if (!this.plot.x.timeFormat) return value;

            if (_utils.Utils.isDate(value)) {
                return this.formatTime(value);
            }

            return value;
        }
    }, {
        key: "compareTimeValues",
        value: function compareTimeValues(a, b) {
            return a - b;
        }
    }, {
        key: "timeValuesEqual",
        value: function timeValuesEqual(a, b) {
            var parser = this.plot.x.timeParser;
            return parser(a) === parser(b);
        }
    }, {
        key: "nextTimeTickValue",
        value: function nextTimeTickValue(t) {
            var interval = this.plot.x.interval;
            return d3.time[interval].offset(t, this.plot.x.intervalStep);
        }
    }, {
        key: "initPlot",
        value: function initPlot() {
            _get(Object.getPrototypeOf(HeatmapTimeSeries.prototype), "initPlot", this).call(this);

            if (this.config.z.fillMissing) {
                this.plot.matrix.forEach(function (row, rowIndex) {
                    var prevRowValue = undefined;
                    row.forEach(function (cell, colIndex) {
                        if (cell.value === undefined && prevRowValue !== undefined) {
                            cell.value = prevRowValue;
                            cell.missing = true;
                        }
                        prevRowValue = cell.value;
                    });
                });
            }
        }
    }, {
        key: "update",
        value: function update(newData) {
            _get(Object.getPrototypeOf(HeatmapTimeSeries.prototype), "update", this).call(this, newData);
        }
    }, {
        key: "initTimeFormatAndInterval",
        value: function initTimeFormatAndInterval() {

            this.plot.x.interval = this.config.x.interval;

            if (!this.plot.x.timeFormat) {
                this.guessTimeFormat();
            }

            if (!this.plot.x.interval && this.plot.x.timeFormat) {
                this.guessInterval();
            }
        }
    }, {
        key: "guessTimeFormat",
        value: function guessTimeFormat() {
            var self = this;
            for (var i = 0; i < self.config.x.intervalToFormats.length; i++) {
                var intervalFormat = self.config.x.intervalToFormats[i];
                var format = null;
                var formatMatch = intervalFormat.formats.some(function (f) {
                    format = f;
                    var parser = d3.time.format(f);
                    return self.plot.x.uniqueValues.every(function (x) {
                        return parser.parse(x) !== null;
                    });
                });
                if (formatMatch) {
                    self.plot.x.timeFormat = format;
                    console.log('Guessed timeFormat', format);
                    if (!self.plot.x.interval) {
                        self.plot.x.interval = intervalFormat.name;
                        console.log('Guessed interval', self.plot.x.interval);
                    }
                    return;
                }
            }
        }
    }, {
        key: "guessInterval",
        value: function guessInterval() {
            var self = this;
            for (var i = 0; i < self.config.x.intervalToFormats.length; i++) {
                var intervalFormat = self.config.x.intervalToFormats[i];

                if (intervalFormat.formats.indexOf(self.plot.x.timeFormat) >= 0) {
                    self.plot.x.interval = intervalFormat.name;
                    console.log('Guessed interval', self.plot.x.interval);
                    return;
                }
            }
        }
    }, {
        key: "getTimeParser",
        value: function getTimeParser() {
            if (!this.plot.x.timeParser) {
                this.plot.x.timeParser = d3.time.format(this.plot.x.timeFormat);
            }
            return this.plot.x.timeParser;
        }
    }]);

    return HeatmapTimeSeries;
}(_heatmap.Heatmap);

},{"./chart":26,"./heatmap":30,"./statistics-utils":38,"./utils":39}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Heatmap = exports.HeatmapConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chart = require('./chart');

var _utils = require('./utils');

var _legend = require('./legend');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HeatmapConfig = exports.HeatmapConfig = function (_ChartConfig) {
    _inherits(HeatmapConfig, _ChartConfig);

    //show tooltip on dot hover

    function HeatmapConfig(custom) {
        _classCallCheck(this, HeatmapConfig);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HeatmapConfig).call(this));

        _this.svgClass = 'odc-heatmap';
        _this.showTooltip = true;
        _this.tooltip = {
            noDataText: "N/A"
        };
        _this.showLegend = true;
        _this.legend = {
            width: 30,
            rotateLabels: false,
            decimalPlaces: undefined,
            formatter: function formatter(v) {
                return _this.legend.decimalPlaces === undefined ? v : Number(v).toFixed(_this.legend.decimalPlaces);
            }
        };
        _this.highlightLabels = true;
        _this.x = { // X axis config
            title: '', // axis title
            key: 0,
            value: function value(d) {
                return d[_this.x.key];
            }, // x value accessor
            rotateLabels: true,
            sortLabels: false,
            sortComparator: function sortComparator(a, b) {
                return _utils.Utils.isNumber(a) ? a - b : a.localeCompare(b);
            },
            groups: {
                keys: [],
                labels: [],
                value: function value(d, key) {
                    return d[key];
                },
                overlap: {
                    top: 20,
                    bottom: 20
                }
            },
            formatter: undefined // value formatter function

        };
        _this.y = { // Y axis config
            title: '', // axis title,
            rotateLabels: true,
            key: 1,
            value: function value(d) {
                return d[_this.y.key];
            }, // y value accessor
            sortLabels: false,
            sortComparator: function sortComparator(a, b) {
                return _utils.Utils.isNumber(b) ? b - a : b.localeCompare(a);
            },
            groups: {
                keys: [],
                labels: [],
                value: function value(d, key) {
                    return d[key];
                },
                overlap: {
                    left: 20,
                    right: 20
                }
            },
            formatter: undefined // value formatter function
        };
        _this.z = {
            key: 2,
            value: function value(d) {
                return d[_this.z.key];
            },
            notAvailableValue: function notAvailableValue(v) {
                return v === null || v === undefined;
            },

            decimalPlaces: undefined,
            formatter: function formatter(v) {
                return _this.z.decimalPlaces === undefined ? v : Number(v).toFixed(_this.z.decimalPlaces);
            } // value formatter function

        };
        _this.color = {
            noDataColor: "white",
            scale: "linear",
            reverseScale: false,
            range: ["darkblue", "lightskyblue", "orange", "crimson", "darkred"]
        };
        _this.cell = {
            width: undefined,
            height: undefined,
            sizeMin: 15,
            sizeMax: 250,
            padding: 0
        };
        _this.margin = {
            left: 60,
            right: 50,
            top: 30,
            bottom: 80
        };

        if (custom) {
            _utils.Utils.deepExtend(_this, custom);
        }
        return _this;
    }

    return HeatmapConfig;
}(_chart.ChartConfig);

//TODO refactor


var Heatmap = exports.Heatmap = function (_Chart) {
    _inherits(Heatmap, _Chart);

    function Heatmap(placeholderSelector, data, config) {
        _classCallCheck(this, Heatmap);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Heatmap).call(this, placeholderSelector, data, new HeatmapConfig(config)));
    }

    _createClass(Heatmap, [{
        key: 'setConfig',
        value: function setConfig(config) {
            return _get(Object.getPrototypeOf(Heatmap.prototype), 'setConfig', this).call(this, new HeatmapConfig(config));
        }
    }, {
        key: 'initPlot',
        value: function initPlot() {
            _get(Object.getPrototypeOf(Heatmap.prototype), 'initPlot', this).call(this);
            var self = this;
            var margin = this.config.margin;
            var conf = this.config;

            this.plot.x = {};
            this.plot.y = {};
            this.plot.z = {
                matrixes: undefined,
                cells: undefined,
                color: {},
                shape: {}
            };

            this.setupValues();
            this.buildCells();

            var titleRectWidth = 6;
            this.plot.x.overlap = {
                top: 0,
                bottom: 0
            };
            if (this.plot.groupByX) {
                var depth = self.config.x.groups.keys.length;
                var allTitlesWidth = depth * titleRectWidth;

                this.plot.x.overlap.bottom = self.config.x.groups.overlap.bottom;
                this.plot.x.overlap.top = self.config.x.groups.overlap.top + allTitlesWidth;
                this.plot.margin.top = conf.margin.right + conf.x.groups.overlap.top;
                this.plot.margin.bottom = conf.margin.bottom + conf.x.groups.overlap.bottom;
            }

            this.plot.y.overlap = {
                left: 0,
                right: 0
            };

            if (this.plot.groupByY) {
                var _depth = self.config.y.groups.keys.length;
                var _allTitlesWidth = _depth * titleRectWidth;
                this.plot.y.overlap.right = self.config.y.groups.overlap.left + _allTitlesWidth;
                this.plot.y.overlap.left = self.config.y.groups.overlap.left;
                this.plot.margin.left = conf.margin.left + this.plot.y.overlap.left;
                this.plot.margin.right = conf.margin.right + this.plot.y.overlap.right;
            }
            this.plot.showLegend = conf.showLegend;
            if (this.plot.showLegend) {
                this.plot.margin.right += conf.legend.width;
            }
            this.computePlotSize();
            this.setupZScale();

            return this;
        }
    }, {
        key: 'setupValues',
        value: function setupValues() {
            var _this3 = this;

            var self = this;
            var config = self.config;
            var x = self.plot.x;
            var y = self.plot.y;
            var z = self.plot.z;

            x.value = function (d) {
                return config.x.value.call(config, d);
            };
            y.value = function (d) {
                return config.y.value.call(config, d);
            };
            z.value = function (d) {
                return config.z.value.call(config, d);
            };

            x.uniqueValues = [];
            y.uniqueValues = [];

            self.plot.groupByY = !!config.y.groups.keys.length;
            self.plot.groupByX = !!config.x.groups.keys.length;

            y.groups = {
                key: undefined,
                label: '',
                values: [],
                children: null,
                level: 0,
                index: 0,
                lastIndex: 0
            };
            x.groups = {
                key: undefined,
                label: '',
                values: [],
                children: null,
                level: 0,
                index: 0,
                lastIndex: 0
            };

            var valueMap = {};
            var minZ = undefined;
            var maxZ = undefined;
            this.data.forEach(function (d) {

                var xVal = x.value(d);
                var yVal = y.value(d);
                var zValRaw = z.value(d);
                var zVal = config.z.notAvailableValue(zValRaw) ? undefined : parseFloat(zValRaw);

                if (x.uniqueValues.indexOf(xVal) === -1) {
                    x.uniqueValues.push(xVal);
                }

                if (y.uniqueValues.indexOf(yVal) === -1) {
                    y.uniqueValues.push(yVal);
                }

                var groupY = y.groups;
                if (self.plot.groupByY) {
                    groupY = _this3.updateGroups(d, yVal, y.groups, config.y.groups);
                }
                var groupX = x.groups;
                if (self.plot.groupByX) {

                    groupX = _this3.updateGroups(d, xVal, x.groups, config.x.groups);
                }

                if (!valueMap[groupY.index]) {
                    valueMap[groupY.index] = {};
                }

                if (!valueMap[groupY.index][groupX.index]) {
                    valueMap[groupY.index][groupX.index] = {};
                }
                if (!valueMap[groupY.index][groupX.index][yVal]) {
                    valueMap[groupY.index][groupX.index][yVal] = {};
                }
                valueMap[groupY.index][groupX.index][yVal][xVal] = zVal;

                if (minZ === undefined || zVal < minZ) {
                    minZ = zVal;
                }
                if (maxZ === undefined || zVal > maxZ) {
                    maxZ = zVal;
                }
            });
            self.plot.valueMap = valueMap;

            if (!self.plot.groupByX) {
                x.groups.values = x.uniqueValues;
            }

            if (!self.plot.groupByY) {
                y.groups.values = y.uniqueValues;
            }

            this.setupValuesBeforeGroupsSort();

            x.gaps = [];
            x.totalValuesCount = 0;
            x.allValuesList = [];
            this.sortGroups(x, x.groups, config.x);

            y.gaps = [];
            y.totalValuesCount = 0;
            y.allValuesList = [];
            this.sortGroups(y, y.groups, config.y);

            z.min = minZ;
            z.max = maxZ;
        }
    }, {
        key: 'setupValuesBeforeGroupsSort',
        value: function setupValuesBeforeGroupsSort() {}
    }, {
        key: 'buildCells',
        value: function buildCells() {
            var self = this;
            var x = self.plot.x;
            var y = self.plot.y;
            var z = self.plot.z;
            var valueMap = self.plot.valueMap;

            var matrixCells = self.plot.cells = [];
            var matrix = self.plot.matrix = [];

            y.allValuesList.forEach(function (v1, i) {
                var row = [];
                matrix.push(row);

                x.allValuesList.forEach(function (v2, j) {
                    var zVal = undefined;
                    try {
                        zVal = valueMap[v1.group.index][v2.group.index][v1.val][v2.val];
                    } catch (e) {}

                    var cell = {
                        rowVar: v1,
                        colVar: v2,
                        row: i,
                        col: j,
                        value: zVal
                    };
                    row.push(cell);

                    matrixCells.push(cell);
                });
            });
        }
    }, {
        key: 'updateGroups',
        value: function updateGroups(d, axisVal, rootGroup, axisGroupsConfig) {

            var config = this.config;
            var currentGroup = rootGroup;
            axisGroupsConfig.keys.forEach(function (groupKey, groupKeyIndex) {
                currentGroup.key = groupKey;

                if (!currentGroup.children) {
                    currentGroup.children = {};
                }

                var groupingValue = axisGroupsConfig.value.call(config, d, groupKey);

                if (!currentGroup.children.hasOwnProperty(groupingValue)) {
                    rootGroup.lastIndex++;
                    currentGroup.children[groupingValue] = {
                        values: [],
                        children: null,
                        groupingValue: groupingValue,
                        level: currentGroup.level + 1,
                        index: rootGroup.lastIndex,
                        key: groupKey
                    };
                }

                currentGroup = currentGroup.children[groupingValue];
            });

            if (currentGroup.values.indexOf(axisVal) === -1) {
                currentGroup.values.push(axisVal);
            }

            return currentGroup;
        }
    }, {
        key: 'sortGroups',
        value: function sortGroups(axis, group, axisConfig, gaps) {
            if (axisConfig.groups.labels && axisConfig.groups.labels.length > group.level) {
                group.label = axisConfig.groups.labels[group.level];
            } else {
                group.label = group.key;
            }

            if (!gaps) {
                gaps = [0];
            }
            if (gaps.length <= group.level) {
                gaps.push(0);
            }

            group.allValuesCount = group.allValuesCount || 0;
            group.allValuesBeforeCount = group.allValuesBeforeCount || 0;

            group.gaps = gaps.slice();
            group.gapsBefore = gaps.slice();

            group.gapsSize = Heatmap.computeGapsSize(group.gaps);
            group.gapsBeforeSize = group.gapsSize;
            if (group.values) {
                if (axisConfig.sortLabels) {
                    group.values.sort(axisConfig.sortComparator);
                }
                group.values.forEach(function (v) {
                    return axis.allValuesList.push({ val: v, group: group });
                });
                group.allValuesBeforeCount = axis.totalValuesCount;
                axis.totalValuesCount += group.values.length;
                group.allValuesCount += group.values.length;
            }

            group.childrenList = [];
            if (group.children) {
                var childrenCount = 0;

                for (var childProp in group.children) {
                    if (group.children.hasOwnProperty(childProp)) {
                        var child = group.children[childProp];
                        group.childrenList.push(child);
                        childrenCount++;

                        this.sortGroups(axis, child, axisConfig, gaps);
                        group.allValuesCount += child.allValuesCount;
                        gaps[group.level] += 1;
                    }
                }

                if (gaps && childrenCount > 1) {
                    gaps[group.level] -= 1;
                }

                group.gapsInside = [];
                gaps.forEach(function (d, i) {
                    group.gapsInside.push(d - (group.gapsBefore[i] || 0));
                });
                group.gapsInsideSize = Heatmap.computeGapsSize(group.gapsInside);

                if (axis.gaps.length < gaps.length) {
                    axis.gaps = gaps;
                }
            }
        }
    }, {
        key: 'computeYAxisLabelsWidth',
        value: function computeYAxisLabelsWidth(offset) {
            var maxWidth = this.plot.margin.left;
            if (this.config.y.title) {
                maxWidth -= 15;
            }
            if (offset && offset.x) {
                maxWidth += offset.x;
            }

            if (this.config.y.rotateLabels) {
                maxWidth *= _utils.Utils.SQRT_2;
                var fontSize = 11; //todo check actual font size
                maxWidth -= fontSize / 2;
            }

            return maxWidth;
        }
    }, {
        key: 'computeXAxisLabelsWidth',
        value: function computeXAxisLabelsWidth(offset) {
            if (!this.config.x.rotateLabels) {
                return this.plot.cellWidth - 2;
            }
            var size = this.plot.margin.bottom;
            if (this.config.x.title) {
                size -= 15;
            }
            if (offset && offset.y) {
                size -= offset.y;
            }

            size *= _utils.Utils.SQRT_2;

            var fontSize = 11; //todo check actual font size
            size -= fontSize / 2;

            return size;
        }
    }, {
        key: 'computePlotSize',
        value: function computePlotSize() {

            var plot = this.plot;
            var conf = this.config;
            var margin = plot.margin;
            var availableWidth = _utils.Utils.availableWidth(this.config.width, this.getBaseContainer(), this.plot.margin);
            var availableHeight = _utils.Utils.availableHeight(this.config.height, this.getBaseContainer(), this.plot.margin);
            var width = availableWidth;
            var height = availableHeight;

            var xGapsSize = Heatmap.computeGapsSize(plot.x.gaps);

            var computedCellWidth = Math.max(conf.cell.sizeMin, Math.min(conf.cell.sizeMax, (availableWidth - xGapsSize) / this.plot.x.totalValuesCount));
            if (this.config.width) {

                if (!this.config.cell.width) {
                    this.plot.cellWidth = computedCellWidth;
                }
            } else {
                this.plot.cellWidth = this.config.cell.width;

                if (!this.plot.cellWidth) {
                    this.plot.cellWidth = computedCellWidth;
                }
            }
            width = this.plot.cellWidth * this.plot.x.totalValuesCount + margin.left + margin.right + xGapsSize;

            var yGapsSize = Heatmap.computeGapsSize(plot.y.gaps);
            var computedCellHeight = Math.max(conf.cell.sizeMin, Math.min(conf.cell.sizeMax, (availableHeight - yGapsSize) / this.plot.y.totalValuesCount));
            if (this.config.height) {
                if (!this.config.cell.height) {
                    this.plot.cellHeight = computedCellHeight;
                }
            } else {
                this.plot.cellHeight = this.config.cell.height;

                if (!this.plot.cellHeight) {
                    this.plot.cellHeight = computedCellHeight;
                }
            }

            height = this.plot.cellHeight * this.plot.y.totalValuesCount + margin.top + margin.bottom + yGapsSize;

            this.plot.width = width - margin.left - margin.right;
            this.plot.height = height - margin.top - margin.bottom;
        }
    }, {
        key: 'setupZScale',
        value: function setupZScale() {

            var self = this;
            var config = self.config;
            var z = self.plot.z;
            var range = config.color.range;
            var extent = z.max - z.min;
            var scale;
            z.domain = [];
            if (config.color.scale == "pow") {
                var exponent = 10;
                range.forEach(function (c, i) {
                    var v = z.max - extent / Math.pow(10, i);
                    z.domain.push(v);
                });
                scale = d3.scale.pow().exponent(exponent);
            } else if (config.color.scale == "log") {

                range.forEach(function (c, i) {
                    var v = z.min + extent / Math.pow(10, i);
                    z.domain.unshift(v);
                });

                scale = d3.scale.log();
            } else {
                range.forEach(function (c, i) {
                    var v = z.min + extent * (i / (range.length - 1));
                    z.domain.push(v);
                });
                scale = d3.scale[config.color.scale]();
            }

            z.domain[0] = z.min; //removing unnecessary floating points
            z.domain[z.domain.length - 1] = z.max; //removing unnecessary floating points
            console.log(z.domain);

            if (config.color.reverseScale) {
                z.domain.reverse();
            }

            var plot = this.plot;

            console.log(range);
            plot.z.color.scale = scale.domain(z.domain).range(range);
            var shape = plot.z.shape = {};

            var cellConf = this.config.cell;
            shape.type = "rect";

            plot.z.shape.width = plot.cellWidth - cellConf.padding * 2;
            plot.z.shape.height = plot.cellHeight - cellConf.padding * 2;
        }
    }, {
        key: 'update',
        value: function update(newData) {
            _get(Object.getPrototypeOf(Heatmap.prototype), 'update', this).call(this, newData);
            if (this.plot.groupByY) {
                this.drawGroupsY(this.plot.y.groups, this.svgG);
            }
            if (this.plot.groupByX) {
                this.drawGroupsX(this.plot.x.groups, this.svgG);
            }

            this.updateCells();

            // this.updateVariableLabels();

            this.updateAxisX();
            this.updateAxisY();

            if (this.config.showLegend) {
                this.updateLegend();
            }

            this.updateAxisTitles();
        }
    }, {
        key: 'updateAxisTitles',
        value: function updateAxisTitles() {
            var self = this;
            var plot = self.plot;
        }
    }, {
        key: 'updateAxisX',
        value: function updateAxisX() {
            var self = this;
            var plot = self.plot;
            var labelClass = self.prefixClass("label");
            var labelXClass = labelClass + "-x";
            var labelYClass = labelClass + "-y";
            plot.labelClass = labelClass;

            var offsetX = {
                x: 0,
                y: 0
            };
            var gapSize = Heatmap.computeGapSize(0);
            if (plot.groupByX) {
                var overlap = self.config.x.groups.overlap;

                offsetX.x = gapSize / 2;
                offsetX.y = overlap.bottom + gapSize / 2 + 6;
            } else if (plot.groupByY) {
                offsetX.y = gapSize;
            }

            var labels = self.svgG.selectAll("text." + labelXClass).data(plot.x.allValuesList, function (d, i) {
                return i;
            });

            labels.enter().append("text").attr("class", function (d, i) {
                return labelClass + " " + labelXClass + " " + labelXClass + "-" + i;
            });

            labels.attr("x", function (d, i) {
                return i * plot.cellWidth + plot.cellWidth / 2 + d.group.gapsSize + offsetX.x;
            }).attr("y", plot.height + offsetX.y).attr("dy", 10).attr("text-anchor", "middle").text(function (d) {
                return self.formatValueX(d.val);
            });

            var maxWidth = self.computeXAxisLabelsWidth(offsetX);

            labels.each(function (label) {
                var elem = d3.select(this),
                    text = self.formatValueX(label.val);
                _utils.Utils.placeTextWithEllipsisAndTooltip(elem, text, maxWidth, self.config.showTooltip ? self.plot.tooltip : false);
            });

            if (self.config.x.rotateLabels) {
                labels.attr("transform", function (d, i) {
                    return "rotate(-45, " + (i * plot.cellWidth + plot.cellWidth / 2 + d.group.gapsSize + offsetX.x) + ", " + (plot.height + offsetX.y) + ")";
                }).attr("dx", -2).attr("dy", 8).attr("text-anchor", "end");
            }

            labels.exit().remove();

            self.svgG.selectOrAppend("g." + self.prefixClass('axis-x')).attr("transform", "translate(" + plot.width / 2 + "," + (plot.height + plot.margin.bottom) + ")").selectOrAppend("text." + self.prefixClass('label')).attr("dy", "-0.5em").style("text-anchor", "middle").text(self.config.x.title);
        }
    }, {
        key: 'updateAxisY',
        value: function updateAxisY() {
            var self = this;
            var plot = self.plot;
            var labelClass = self.prefixClass("label");
            var labelYClass = labelClass + "-y";
            plot.labelClass = labelClass;

            var labels = self.svgG.selectAll("text." + labelYClass).data(plot.y.allValuesList);

            labels.enter().append("text");

            var offsetY = {
                x: 0,
                y: 0
            };
            if (plot.groupByY) {
                var overlap = self.config.y.groups.overlap;
                var gapSize = Heatmap.computeGapSize(0);
                offsetY.x = -overlap.left;

                offsetY.y = gapSize / 2;
            }
            labels.attr("x", offsetY.x).attr("y", function (d, i) {
                return i * plot.cellHeight + plot.cellHeight / 2 + d.group.gapsSize + offsetY.y;
            }).attr("dx", -2).attr("text-anchor", "end").attr("class", function (d, i) {
                return labelClass + " " + labelYClass + " " + labelYClass + "-" + i;
            }).text(function (d) {
                var formatted = self.formatValueY(d.val);
                return formatted;
            });

            var maxWidth = self.computeYAxisLabelsWidth(offsetY);

            labels.each(function (label) {
                var elem = d3.select(this),
                    text = self.formatValueY(label.val);
                _utils.Utils.placeTextWithEllipsisAndTooltip(elem, text, maxWidth, self.config.showTooltip ? self.plot.tooltip : false);
            });

            if (self.config.y.rotateLabels) {
                labels.attr("transform", function (d, i) {
                    return "rotate(-45, " + offsetY.x + ", " + (d.group.gapsSize + (i * plot.cellHeight + plot.cellHeight / 2) + offsetY.y) + ")";
                }).attr("text-anchor", "end");
                // .attr("dx", -7);
            } else {
                labels.attr("dominant-baseline", "middle");
            }

            labels.exit().remove();

            self.svgG.selectOrAppend("g." + self.prefixClass('axis-y')).selectOrAppend("text." + self.prefixClass('label')).attr("transform", "translate(" + -plot.margin.left + "," + plot.height / 2 + ")rotate(-90)").attr("dy", "1em").style("text-anchor", "middle").text(self.config.y.title);
        }
    }, {
        key: 'drawGroupsY',
        value: function drawGroupsY(parentGroup, container, availableWidth) {

            var self = this;
            var plot = self.plot;

            var groupClass = self.prefixClass("group");
            var groupYClass = groupClass + "-y";
            var groups = container.selectAll("g." + groupClass + "." + groupYClass).data(parentGroup.childrenList);

            var valuesBeforeCount = 0;
            var gapsBeforeSize = 0;

            var groupsEnterG = groups.enter().append("g");
            groupsEnterG.classed(groupClass, true).classed(groupYClass, true).append("rect").classed("group-rect", true);

            var titleGroupEnter = groupsEnterG.appendSelector("g.title");
            titleGroupEnter.append("rect");
            titleGroupEnter.append("text");

            var gapSize = Heatmap.computeGapSize(parentGroup.level);
            var padding = gapSize / 4;

            var titleRectWidth = Heatmap.groupTitleRectHeight;
            var depth = self.config.y.groups.keys.length - parentGroup.level;
            var overlap = {
                left: 0,
                right: 0
            };

            if (!availableWidth) {
                overlap.right = plot.y.overlap.left;
                overlap.left = plot.y.overlap.left;
                availableWidth = plot.width + gapSize + overlap.left + overlap.right;
            }

            groups.attr("transform", function (d, i) {
                var translate = "translate(" + (padding - overlap.left) + "," + (plot.cellHeight * valuesBeforeCount + i * gapSize + gapsBeforeSize + padding) + ")";
                gapsBeforeSize += d.gapsInsideSize || 0;
                valuesBeforeCount += d.allValuesCount || 0;
                return translate;
            });

            var groupWidth = availableWidth - padding * 2;

            var titleGroups = groups.selectAll("g.title").attr("transform", function (d, i) {
                return "translate(" + (groupWidth - titleRectWidth) + ", 0)";
            });

            var tileRects = titleGroups.selectAll("rect").attr("width", titleRectWidth).attr("height", function (d) {
                return (d.gapsInsideSize || 0) + plot.cellHeight * d.allValuesCount + padding * 2;
            }).attr("x", 0).attr("y", 0)
            // .attr("fill", "lightgrey")
            .attr("stroke-width", 0);

            this.setGroupMouseCallbacks(parentGroup, tileRects);

            groups.selectAll("rect.group-rect").attr("class", function (d) {
                return "group-rect group-rect-" + d.index;
            }).attr("width", groupWidth).attr("height", function (d) {
                return (d.gapsInsideSize || 0) + plot.cellHeight * d.allValuesCount + padding * 2;
            }).attr("x", 0).attr("y", 0).attr("fill", "white").attr("fill-opacity", 0).attr("stroke-width", 0.5).attr("stroke", "black");

            groups.each(function (group) {

                self.drawGroupsY.call(self, group, d3.select(this), groupWidth - titleRectWidth);
            });
        }
    }, {
        key: 'drawGroupsX',
        value: function drawGroupsX(parentGroup, container, availableHeight) {

            var self = this;
            var plot = self.plot;

            var groupClass = self.prefixClass("group");
            var groupXClass = groupClass + "-x";
            var groups = container.selectAll("g." + groupClass + "." + groupXClass).data(parentGroup.childrenList);

            var valuesBeforeCount = 0;
            var gapsBeforeSize = 0;

            var groupsEnterG = groups.enter().append("g");
            groupsEnterG.classed(groupClass, true).classed(groupXClass, true).append("rect").classed("group-rect", true);

            var titleGroupEnter = groupsEnterG.appendSelector("g.title");
            titleGroupEnter.append("rect");
            titleGroupEnter.append("text");

            var gapSize = Heatmap.computeGapSize(parentGroup.level);
            var padding = gapSize / 4;
            var titleRectHeight = Heatmap.groupTitleRectHeight;

            var depth = self.config.x.groups.keys.length - parentGroup.level;

            var overlap = {
                top: 0,
                bottom: 0
            };

            if (!availableHeight) {
                overlap.bottom = plot.x.overlap.bottom;
                overlap.top = plot.x.overlap.top;
                availableHeight = plot.height + gapSize + overlap.top + overlap.bottom;
            } else {
                overlap.top = -titleRectHeight;
            }
            // console.log('parentGroup',parentGroup, 'gapSize', gapSize, plot.x.overlap);

            groups.attr("transform", function (d, i) {
                var translate = "translate(" + (plot.cellWidth * valuesBeforeCount + i * gapSize + gapsBeforeSize + padding) + ", " + (padding - overlap.top) + ")";
                gapsBeforeSize += d.gapsInsideSize || 0;
                valuesBeforeCount += d.allValuesCount || 0;
                return translate;
            });

            var groupHeight = availableHeight - padding * 2;

            var titleGroups = groups.selectAll("g.title").attr("transform", function (d, i) {
                return "translate(0, " + 0 + ")";
            });

            var tileRects = titleGroups.selectAll("rect").attr("height", titleRectHeight).attr("width", function (d) {
                return (d.gapsInsideSize || 0) + plot.cellWidth * d.allValuesCount + padding * 2;
            }).attr("x", 0).attr("y", 0)
            // .attr("fill", "lightgrey")
            .attr("stroke-width", 0);

            this.setGroupMouseCallbacks(parentGroup, tileRects);

            groups.selectAll("rect.group-rect").attr("class", function (d) {
                return "group-rect group-rect-" + d.index;
            }).attr("height", groupHeight).attr("width", function (d) {
                return (d.gapsInsideSize || 0) + plot.cellWidth * d.allValuesCount + padding * 2;
            }).attr("x", 0).attr("y", 0).attr("fill", "white").attr("fill-opacity", 0).attr("stroke-width", 0.5).attr("stroke", "black");

            groups.each(function (group) {
                self.drawGroupsX.call(self, group, d3.select(this), groupHeight - titleRectHeight);
            });

            groups.exit().remove();
        }
    }, {
        key: 'setGroupMouseCallbacks',
        value: function setGroupMouseCallbacks(parentGroup, tileRects) {
            var plot = this.plot;
            var self = this;
            var mouseoverCallbacks = [];
            mouseoverCallbacks.push(function (d) {
                d3.select(this).classed('highlighted', true);
                d3.select(this.parentNode.parentNode).selectAll("rect.group-rect-" + d.index).classed('highlighted', true);
            });

            var mouseoutCallbacks = [];
            mouseoutCallbacks.push(function (d) {
                d3.select(this).classed('highlighted', false);
                d3.select(this.parentNode.parentNode).selectAll("rect.group-rect-" + d.index).classed('highlighted', false);
            });
            if (plot.tooltip) {

                mouseoverCallbacks.push(function (d) {
                    var html = parentGroup.label + ": " + d.groupingValue;
                    self.showTooltip(html);
                });

                mouseoutCallbacks.push(function (d) {
                    self.hideTooltip();
                });
            }
            tileRects.on("mouseover", function (d) {
                var self = this;
                mouseoverCallbacks.forEach(function (callback) {
                    callback.call(self, d);
                });
            });
            tileRects.on("mouseout", function (d) {
                var self = this;
                mouseoutCallbacks.forEach(function (callback) {
                    callback.call(self, d);
                });
            });
        }
    }, {
        key: 'updateCells',
        value: function updateCells() {

            var self = this;
            var plot = self.plot;
            var cellContainerClass = self.prefixClass("cells");
            var gapSize = Heatmap.computeGapSize(0);
            var paddingX = plot.x.groups.childrenList.length ? gapSize / 2 : 0;
            var paddingY = plot.y.groups.childrenList.length ? gapSize / 2 : 0;
            var cellContainer = self.svgG.selectOrAppend("g." + cellContainerClass);
            cellContainer.attr("transform", "translate(" + paddingX + ", " + paddingY + ")");

            var cellClass = self.prefixClass("cell");
            var cellShape = plot.z.shape.type;

            var cells = cellContainer.selectAll("g." + cellClass).data(self.plot.cells);

            var cellEnterG = cells.enter().append("g").classed(cellClass, true);
            cells.attr("transform", function (c) {
                return "translate(" + (plot.cellWidth * c.col + plot.cellWidth / 2 + c.colVar.group.gapsSize) + "," + (plot.cellHeight * c.row + plot.cellHeight / 2 + c.rowVar.group.gapsSize) + ")";
            });

            var shapes = cells.selectOrAppend(cellShape + ".cell-shape-" + cellShape);

            shapes.attr("width", plot.z.shape.width).attr("height", plot.z.shape.height).attr("x", -plot.cellWidth / 2).attr("y", -plot.cellHeight / 2);

            shapes.style("fill", function (c) {
                return c.value === undefined ? self.config.color.noDataColor : plot.z.color.scale(c.value);
            });
            shapes.attr("fill-opacity", function (d) {
                return d.value === undefined ? 0 : 1;
            });

            var mouseoverCallbacks = [];
            var mouseoutCallbacks = [];

            if (plot.tooltip) {

                mouseoverCallbacks.push(function (c) {
                    var html = c.value === undefined ? self.config.tooltip.noDataText : self.formatValueZ(c.value);
                    self.showTooltip(html);
                });

                mouseoutCallbacks.push(function (c) {
                    self.hideTooltip();
                });
            }

            if (self.config.highlightLabels) {
                var highlightClass = self.config.cssClassPrefix + "highlight";
                var xLabelClass = function xLabelClass(c) {
                    return plot.labelClass + "-x-" + c.col;
                };
                var yLabelClass = function yLabelClass(c) {
                    return plot.labelClass + "-y-" + c.row;
                };

                mouseoverCallbacks.push(function (c) {

                    self.svgG.selectAll("text." + xLabelClass(c)).classed(highlightClass, true);
                    self.svgG.selectAll("text." + yLabelClass(c)).classed(highlightClass, true);
                });
                mouseoutCallbacks.push(function (c) {
                    self.svgG.selectAll("text." + xLabelClass(c)).classed(highlightClass, false);
                    self.svgG.selectAll("text." + yLabelClass(c)).classed(highlightClass, false);
                });
            }

            cells.on("mouseover", function (c) {
                mouseoverCallbacks.forEach(function (callback) {
                    return callback(c);
                });
            }).on("mouseout", function (c) {
                mouseoutCallbacks.forEach(function (callback) {
                    return callback(c);
                });
            });

            cells.on("click", function (c) {
                self.trigger("cell-selected", c);
            });

            cells.exit().remove();
        }
    }, {
        key: 'formatValueX',
        value: function formatValueX(value) {
            if (!this.config.x.formatter) return value;

            return this.config.x.formatter.call(this.config, value);
        }
    }, {
        key: 'formatValueY',
        value: function formatValueY(value) {
            if (!this.config.y.formatter) return value;

            return this.config.y.formatter.call(this.config, value);
        }
    }, {
        key: 'formatValueZ',
        value: function formatValueZ(value) {
            if (!this.config.z.formatter) return value;

            return this.config.z.formatter.call(this.config, value);
        }
    }, {
        key: 'formatLegendValue',
        value: function formatLegendValue(value) {
            if (!this.config.legend.formatter) return value;

            return this.config.legend.formatter.call(this.config, value);
        }
    }, {
        key: 'updateLegend',
        value: function updateLegend() {
            var self = this;
            var plot = this.plot;
            var legendX = this.plot.width + 10;
            var gapSize = Heatmap.computeGapSize(0);
            if (this.plot.groupByY) {
                legendX += gapSize / 2 + plot.y.overlap.right;
            } else if (this.plot.groupByX) {
                legendX += gapSize;
            }
            var legendY = 0;
            if (this.plot.groupByX || this.plot.groupByY) {
                legendY += gapSize / 2;
            }

            var barWidth = 10;
            var barHeight = this.plot.height - 2;
            var scale = plot.z.color.scale;

            plot.legend = new _legend.Legend(this.svg, this.svgG, scale, legendX, legendY, function (v) {
                return self.formatLegendValue(v);
            }).setRotateLabels(self.config.legend.rotateLabels).linearGradientBar(barWidth, barHeight);
        }
    }], [{
        key: 'computeGapSize',
        value: function computeGapSize(gapLevel) {
            return Heatmap.maxGroupGapSize / (gapLevel + 1);
        }
    }, {
        key: 'computeGapsSize',
        value: function computeGapsSize(gaps) {
            var gapsSize = 0;
            gaps.forEach(function (gapsNumber, gapsLevel) {
                return gapsSize += gapsNumber * Heatmap.computeGapSize(gapsLevel);
            });
            return gapsSize;
        }
    }]);

    return Heatmap;
}(_chart.Chart);

Heatmap.maxGroupGapSize = 24;
Heatmap.groupTitleRectHeight = 6;

},{"./chart":26,"./legend":33,"./utils":39}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Histogram = exports.HistogramConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chartWithColorGroups = require('./chart-with-color-groups');

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HistogramConfig = exports.HistogramConfig = function (_ChartWithColorGroups) {
    _inherits(HistogramConfig, _ChartWithColorGroups);

    function HistogramConfig(custom) {
        _classCallCheck(this, HistogramConfig);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HistogramConfig).call(this));

        _this.svgClass = _this.cssClassPrefix + 'histogram';
        _this.showLegend = true;
        _this.showTooltip = true;
        _this.x = { // X axis config
            label: '', // axis label
            key: 0,
            value: function value(d, key) {
                return _utils.Utils.isNumber(d) ? d : parseFloat(d[key]);
            }, // x value accessor
            scale: "linear",
            ticks: undefined
        };
        _this.y = { // Y axis config
            label: '', // axis label,
            orient: "left",
            scale: "linear"
        };
        _this.frequency = true;
        _this.groups = {
            key: 1
        };
        _this.transition = true;


        if (custom) {
            _utils.Utils.deepExtend(_this, custom);
        }

        return _this;
    }

    return HistogramConfig;
}(_chartWithColorGroups.ChartWithColorGroupsConfig);

var Histogram = exports.Histogram = function (_ChartWithColorGroups2) {
    _inherits(Histogram, _ChartWithColorGroups2);

    function Histogram(placeholderSelector, data, config) {
        _classCallCheck(this, Histogram);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Histogram).call(this, placeholderSelector, data, new HistogramConfig(config)));
    }

    _createClass(Histogram, [{
        key: 'setConfig',
        value: function setConfig(config) {
            return _get(Object.getPrototypeOf(Histogram.prototype), 'setConfig', this).call(this, new HistogramConfig(config));
        }
    }, {
        key: 'initPlot',
        value: function initPlot() {
            _get(Object.getPrototypeOf(Histogram.prototype), 'initPlot', this).call(this);
            var self = this;

            var conf = this.config;

            this.plot.x = {};
            this.plot.y = {};
            this.plot.bar = {
                color: null //color scale mapping function
            };

            this.computePlotSize();

            this.setupX();
            this.setupHistogram();
            this.setupGroupStacks();
            this.setupY();
            return this;
        }
    }, {
        key: 'setupX',
        value: function setupX() {

            var plot = this.plot;
            var x = plot.x;
            var conf = this.config.x;

            /* *
             * value accessor - returns the value to encode for a given data object.
             * scale - maps value to a visual display encoding, such as a pixel position.
             * map function - maps from data value to display value
             * axis - sets up axis
             **/
            x.value = function (d) {
                return conf.value(d, conf.key);
            };
            x.scale = d3.scale[conf.scale]().range([0, plot.width]);
            x.map = function (d) {
                return x.scale(x.value(d));
            };

            x.axis = d3.svg.axis().scale(x.scale).orient(conf.orient);
            if (conf.ticks) {
                x.axis.ticks(conf.ticks);
            }
            var data = this.plot.groupedData;
            plot.x.scale.domain([d3.min(data, function (s) {
                return d3.min(s.values, plot.x.value);
            }), d3.max(data, function (s) {
                return d3.max(s.values, plot.x.value);
            })]);
        }
    }, {
        key: 'setupY',
        value: function setupY() {

            var plot = this.plot;
            var y = plot.y;
            var conf = this.config.y;
            y.scale = d3.scale[conf.scale]().range([plot.height, 0]);

            y.axis = d3.svg.axis().scale(y.scale).orient(conf.orient);
            var data = this.plot.data;
            var yStackMax = d3.max(plot.stackedHistograms, function (layer) {
                return d3.max(layer.histogramBins, function (d) {
                    return d.y0 + d.y;
                });
            });
            plot.y.scale.domain([0, yStackMax]);
        }
    }, {
        key: 'setupHistogram',
        value: function setupHistogram() {
            var plot = this.plot;
            var x = plot.x;
            var y = plot.y;
            var ticks = this.config.x.ticks ? x.scale.ticks(this.config.x.ticks) : x.scale.ticks();

            plot.histogram = d3.layout.histogram().frequency(this.config.frequency).value(x.value).bins(ticks);
        }
    }, {
        key: 'setupGroupStacks',
        value: function setupGroupStacks() {
            var _this3 = this;

            var self = this;
            console.log(this.plot.groupedData);
            this.plot.stack = d3.layout.stack().values(function (d) {
                return d.histogramBins;
            });
            this.plot.groupedData.forEach(function (d) {
                d.histogramBins = _this3.plot.histogram.frequency(_this3.config.frequency || _this3.plot.groupingEnabled)(d.values);
                console.log(d.histogramBins);
                if (!_this3.config.frequency && _this3.plot.groupingEnabled) {
                    d.histogramBins.forEach(function (b) {
                        b.dy = b.dy / _this3.plot.dataLength;
                        b.y = b.y / _this3.plot.dataLength;
                    });
                }
            });
            this.plot.stackedHistograms = this.plot.stack(this.plot.groupedData);
        }
    }, {
        key: 'drawAxisX',
        value: function drawAxisX() {
            var self = this;
            var plot = self.plot;
            var axisConf = this.config.x;
            var axis = self.svgG.selectOrAppend("g." + self.prefixClass('axis-x') + "." + self.prefixClass('axis') + (self.config.guides ? '' : '.' + self.prefixClass('no-guides'))).attr("transform", "translate(0," + plot.height + ")");

            var axisT = axis;
            if (self.config.transition) {
                axisT = axis.transition().ease("sin-in-out");
            }

            axisT.call(plot.x.axis);

            axis.selectOrAppend("text." + self.prefixClass('label')).attr("transform", "translate(" + plot.width / 2 + "," + plot.margin.bottom + ")") // text is drawn off the screen top left, move down and out and rotate
            .attr("dy", "-1em").style("text-anchor", "middle").text(axisConf.label);
        }
    }, {
        key: 'drawAxisY',
        value: function drawAxisY() {
            var self = this;
            var plot = self.plot;
            var axisConf = this.config.y;
            var axis = self.svgG.selectOrAppend("g." + self.prefixClass('axis-y') + "." + self.prefixClass('axis') + (self.config.guides ? '' : '.' + self.prefixClass('no-guides')));

            var axisT = axis;
            if (self.config.transition) {
                axisT = axis.transition().ease("sin-in-out");
            }

            axisT.call(plot.y.axis);

            axis.selectOrAppend("text." + self.prefixClass('label')).attr("transform", "translate(" + -plot.margin.left + "," + plot.height / 2 + ")rotate(-90)") // text is drawn off the screen top left, move down and out and rotate
            .attr("dy", "1em").style("text-anchor", "middle").text(axisConf.label);
        }
    }, {
        key: 'drawHistogram',
        value: function drawHistogram() {
            var self = this;
            var plot = self.plot;

            var layerClass = this.prefixClass("layer");

            var barClass = this.prefixClass("bar");
            var layer = self.svgG.selectAll("." + layerClass).data(plot.stackedHistograms);

            layer.enter().append("g").attr("class", layerClass);

            var bar = layer.selectAll("." + barClass).data(function (d) {
                return d.histogramBins;
            });

            bar.enter().append("g").attr("class", barClass).append("rect").attr("x", 1);

            var barRect = bar.select("rect");

            var barRectT = barRect;
            var barT = bar;
            var layerT = layer;
            if (this.transitionEnabled()) {
                barRectT = barRect.transition();
                barT = bar.transition();
                layerT = layer.transition();
            }

            barT.attr("transform", function (d) {
                return "translate(" + plot.x.scale(d.x) + "," + plot.y.scale(d.y0 + d.y) + ")";
            });

            var dx = plot.stackedHistograms.length ? plot.stackedHistograms[0].histogramBins.length ? plot.x.scale(plot.stackedHistograms[0].histogramBins[0].dx) : 0 : 0;
            barRectT.attr("width", dx - plot.x.scale(0) - 1).attr("height", function (d) {
                return plot.height - plot.y.scale(d.y);
            });

            if (this.plot.color) {
                layerT.attr("fill", this.plot.seriesColor);
            }

            if (plot.tooltip) {
                bar.on("mouseover", function (d) {
                    self.showTooltip(d.y);
                }).on("mouseout", function (d) {
                    self.hideTooltip();
                });
            }
            layer.exit().remove();
            bar.exit().remove();
        }
    }, {
        key: 'update',
        value: function update(newData) {
            _get(Object.getPrototypeOf(Histogram.prototype), 'update', this).call(this, newData);
            this.drawAxisX();
            this.drawAxisY();

            this.drawHistogram();
            return this;
        }
    }]);

    return Histogram;
}(_chartWithColorGroups.ChartWithColorGroups);

},{"./chart-with-color-groups":25,"./utils":39}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Legend = exports.StatisticsUtils = exports.BoxPlotConfig = exports.BoxPlot = exports.BoxPlotBaseConfig = exports.BoxPlotBase = exports.BarChartConfig = exports.BarChart = exports.HistogramConfig = exports.Histogram = exports.HeatmapTimeSeriesConfig = exports.HeatmapTimeSeries = exports.HeatmapConfig = exports.Heatmap = exports.RegressionConfig = exports.Regression = exports.CorrelationMatrixConfig = exports.CorrelationMatrix = exports.ScatterPlotMatrixConfig = exports.ScatterPlotMatrix = exports.ScatterPlotConfig = exports.ScatterPlot = undefined;

var _scatterplot = require("./scatterplot");

Object.defineProperty(exports, "ScatterPlot", {
  enumerable: true,
  get: function get() {
    return _scatterplot.ScatterPlot;
  }
});
Object.defineProperty(exports, "ScatterPlotConfig", {
  enumerable: true,
  get: function get() {
    return _scatterplot.ScatterPlotConfig;
  }
});

var _scatterplotMatrix = require("./scatterplot-matrix");

Object.defineProperty(exports, "ScatterPlotMatrix", {
  enumerable: true,
  get: function get() {
    return _scatterplotMatrix.ScatterPlotMatrix;
  }
});
Object.defineProperty(exports, "ScatterPlotMatrixConfig", {
  enumerable: true,
  get: function get() {
    return _scatterplotMatrix.ScatterPlotMatrixConfig;
  }
});

var _correlationMatrix = require("./correlation-matrix");

Object.defineProperty(exports, "CorrelationMatrix", {
  enumerable: true,
  get: function get() {
    return _correlationMatrix.CorrelationMatrix;
  }
});
Object.defineProperty(exports, "CorrelationMatrixConfig", {
  enumerable: true,
  get: function get() {
    return _correlationMatrix.CorrelationMatrixConfig;
  }
});

var _regression = require("./regression");

Object.defineProperty(exports, "Regression", {
  enumerable: true,
  get: function get() {
    return _regression.Regression;
  }
});
Object.defineProperty(exports, "RegressionConfig", {
  enumerable: true,
  get: function get() {
    return _regression.RegressionConfig;
  }
});

var _heatmap = require("./heatmap");

Object.defineProperty(exports, "Heatmap", {
  enumerable: true,
  get: function get() {
    return _heatmap.Heatmap;
  }
});
Object.defineProperty(exports, "HeatmapConfig", {
  enumerable: true,
  get: function get() {
    return _heatmap.HeatmapConfig;
  }
});

var _heatmapTimeseries = require("./heatmap-timeseries");

Object.defineProperty(exports, "HeatmapTimeSeries", {
  enumerable: true,
  get: function get() {
    return _heatmapTimeseries.HeatmapTimeSeries;
  }
});
Object.defineProperty(exports, "HeatmapTimeSeriesConfig", {
  enumerable: true,
  get: function get() {
    return _heatmapTimeseries.HeatmapTimeSeriesConfig;
  }
});

var _histogram = require("./histogram");

Object.defineProperty(exports, "Histogram", {
  enumerable: true,
  get: function get() {
    return _histogram.Histogram;
  }
});
Object.defineProperty(exports, "HistogramConfig", {
  enumerable: true,
  get: function get() {
    return _histogram.HistogramConfig;
  }
});

var _barChart = require("./bar-chart");

Object.defineProperty(exports, "BarChart", {
  enumerable: true,
  get: function get() {
    return _barChart.BarChart;
  }
});
Object.defineProperty(exports, "BarChartConfig", {
  enumerable: true,
  get: function get() {
    return _barChart.BarChartConfig;
  }
});

var _boxPlotBase = require("./box-plot-base");

Object.defineProperty(exports, "BoxPlotBase", {
  enumerable: true,
  get: function get() {
    return _boxPlotBase.BoxPlotBase;
  }
});
Object.defineProperty(exports, "BoxPlotBaseConfig", {
  enumerable: true,
  get: function get() {
    return _boxPlotBase.BoxPlotBaseConfig;
  }
});

var _boxPlot = require("./box-plot");

Object.defineProperty(exports, "BoxPlot", {
  enumerable: true,
  get: function get() {
    return _boxPlot.BoxPlot;
  }
});
Object.defineProperty(exports, "BoxPlotConfig", {
  enumerable: true,
  get: function get() {
    return _boxPlot.BoxPlotConfig;
  }
});

var _statisticsUtils = require("./statistics-utils");

Object.defineProperty(exports, "StatisticsUtils", {
  enumerable: true,
  get: function get() {
    return _statisticsUtils.StatisticsUtils;
  }
});

var _legend = require("./legend");

Object.defineProperty(exports, "Legend", {
  enumerable: true,
  get: function get() {
    return _legend.Legend;
  }
});

var _d3Extensions = require("./d3-extensions");

_d3Extensions.D3Extensions.extend();

},{"./bar-chart":22,"./box-plot":24,"./box-plot-base":23,"./correlation-matrix":27,"./d3-extensions":28,"./heatmap":30,"./heatmap-timeseries":29,"./histogram":31,"./legend":33,"./regression":34,"./scatterplot":36,"./scatterplot-matrix":35,"./statistics-utils":38}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Legend = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require("./utils");

var _noExtend = require("../bower_components/d3-legend/no-extend");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*var d3 = require('../bower_components/d3');
*/
// var legend = require('../bower_components/d3-legend/no-extend');
//
// module.exports.legend = legend;

var Legend = exports.Legend = function () {
    function Legend(svg, legendParent, scale, legendX, legendY, labelFormat) {
        _classCallCheck(this, Legend);

        this.cssClassPrefix = "odc-";
        this.legendClass = this.cssClassPrefix + "legend";
        this.color = _noExtend.color;
        this.size = _noExtend.size;
        this.symbol = _noExtend.symbol;
        this.labelFormat = undefined;

        this.scale = scale;
        this.svg = svg;
        this.guid = _utils.Utils.guid();
        this.container = _utils.Utils.selectOrAppend(legendParent, "g." + this.legendClass, "g").attr("transform", "translate(" + legendX + "," + legendY + ")").classed(this.legendClass, true);

        this.labelFormat = labelFormat;
    }

    _createClass(Legend, [{
        key: "linearGradientBar",
        value: function linearGradientBar(barWidth, barHeight, title) {
            var gradientId = this.cssClassPrefix + "linear-gradient" + "-" + this.guid;
            var scale = this.scale;
            var self = this;

            this.linearGradient = _utils.Utils.linearGradient(this.svg, gradientId, this.scale.range(), 0, 100, 0, 0);

            this.container.append("rect").attr("width", barWidth).attr("height", barHeight).attr("x", 0).attr("y", 0).style("fill", "url(#" + gradientId + ")");

            var ticks = this.container.selectAll("text").data(scale.domain());
            var ticksNumber = scale.domain().length - 1;
            ticks.enter().append("text");

            ticks.attr("x", barWidth).attr("y", function (d, i) {
                return barHeight - i * barHeight / ticksNumber;
            }).attr("dx", 3)
            // .attr("dy", 1)
            .attr("alignment-baseline", "middle").text(function (d) {
                return self.labelFormat ? self.labelFormat(d) : d;
            });
            ticks.attr("dominant-baseline", "middle");
            if (this.rotateLabels) {
                ticks.attr("transform", function (d, i) {
                    return "rotate(-45, " + barWidth + ", " + (barHeight - i * barHeight / ticksNumber) + ")";
                }).attr("text-anchor", "start").attr("dx", 5).attr("dy", 5);
            } else {}

            ticks.exit().remove();

            return this;
        }
    }, {
        key: "setRotateLabels",
        value: function setRotateLabels(rotateLabels) {
            this.rotateLabels = rotateLabels;
            return this;
        }
    }]);

    return Legend;
}();

},{"../bower_components/d3-legend/no-extend":1,"./utils":39}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Regression = exports.RegressionConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chart = require("./chart");

var _scatterplot = require("./scatterplot");

var _utils = require("./utils");

var _statisticsUtils = require("./statistics-utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RegressionConfig = exports.RegressionConfig = function (_ScatterPlotConfig) {
    _inherits(RegressionConfig, _ScatterPlotConfig);

    function RegressionConfig(custom) {
        _classCallCheck(this, RegressionConfig);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RegressionConfig).call(this));

        _this.mainRegression = true;
        _this.groupRegression = true;
        _this.confidence = {
            level: 0.95,
            criticalValue: function criticalValue(degreesOfFreedom, criticalProbability) {
                return _statisticsUtils.StatisticsUtils.tValue(degreesOfFreedom, criticalProbability);
            },
            marginOfError: undefined //custom  margin Of Error function (x, points)
        };


        if (custom) {
            _utils.Utils.deepExtend(_this, custom);
        }

        return _this;
    }

    return RegressionConfig;
}(_scatterplot.ScatterPlotConfig);

var Regression = exports.Regression = function (_ScatterPlot) {
    _inherits(Regression, _ScatterPlot);

    function Regression(placeholderSelector, data, config) {
        _classCallCheck(this, Regression);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Regression).call(this, placeholderSelector, data, new RegressionConfig(config)));
    }

    _createClass(Regression, [{
        key: "setConfig",
        value: function setConfig(config) {
            return _get(Object.getPrototypeOf(Regression.prototype), "setConfig", this).call(this, new RegressionConfig(config));
        }
    }, {
        key: "initPlot",
        value: function initPlot() {
            _get(Object.getPrototypeOf(Regression.prototype), "initPlot", this).call(this);
            this.initRegressionLines();
        }
    }, {
        key: "initRegressionLines",
        value: function initRegressionLines() {

            var self = this;
            var groupsAvailable = self.plot.groupingEnabled;

            self.plot.regressions = [];

            if (groupsAvailable && self.config.mainRegression) {
                var regression = this.initRegression(this.plot.data, false);
                self.plot.regressions.push(regression);
            }

            if (self.config.groupRegression) {
                this.initGroupRegression();
            }
        }
    }, {
        key: "initGroupRegression",
        value: function initGroupRegression() {
            var _this3 = this;

            var self = this;

            self.plot.groupedData.forEach(function (group) {
                var regression = _this3.initRegression(group.values, group.key);
                self.plot.regressions.push(regression);
            });
        }
    }, {
        key: "initRegression",
        value: function initRegression(values, groupVal) {
            var self = this;

            var points = values.map(function (d) {
                return [parseFloat(self.plot.x.value(d)), parseFloat(self.plot.y.value(d))];
            });

            // points.sort((a,b) => a[0]-b[0]);

            var linearRegression = _statisticsUtils.StatisticsUtils.linearRegression(points);
            var linearRegressionLine = _statisticsUtils.StatisticsUtils.linearRegressionLine(linearRegression);

            var extentX = d3.extent(points, function (d) {
                return d[0];
            });

            var linePoints = [{
                x: extentX[0],
                y: linearRegressionLine(extentX[0])
            }, {
                x: extentX[1],
                y: linearRegressionLine(extentX[1])
            }];

            var line = d3.svg.line().interpolate("basis").x(function (d) {
                return self.plot.x.scale(d.x);
            }).y(function (d) {
                return self.plot.y.scale(d.y);
            });

            var color = self.plot.color;

            var defaultColor = "black";
            if (_utils.Utils.isFunction(color)) {
                if (values.length && groupVal !== false) {
                    if (self.config.series) {
                        color = self.plot.colorCategory(groupVal);
                    } else {
                        color = color(values[0]);
                    }
                } else {
                    color = defaultColor;
                }
            } else if (!color && groupVal === false) {
                color = defaultColor;
            }

            var confidence = this.computeConfidence(points, extentX, linearRegression, linearRegressionLine);
            return {
                group: groupVal || false,
                line: line,
                linePoints: linePoints,
                color: color,
                confidence: confidence
            };
        }
    }, {
        key: "computeConfidence",
        value: function computeConfidence(points, extentX, linearRegression, linearRegressionLine) {
            var self = this;
            var slope = linearRegression.m;
            var n = points.length;
            var degreesOfFreedom = Math.max(0, n - 2);

            var alpha = 1 - self.config.confidence.level;
            var criticalProbability = 1 - alpha / 2;
            var criticalValue = self.config.confidence.criticalValue(degreesOfFreedom, criticalProbability);

            var xValues = points.map(function (d) {
                return d[0];
            });
            var meanX = _statisticsUtils.StatisticsUtils.mean(xValues);
            var xMySum = 0;
            var xSum = 0;
            var xPowSum = 0;
            var ySum = 0;
            var yPowSum = 0;
            points.forEach(function (p) {
                var x = p[0];
                var y = p[1];

                xMySum += x * y;
                xSum += x;
                ySum += y;
                xPowSum += x * x;
                yPowSum += y * y;
            });
            var a = linearRegression.m;
            var b = linearRegression.b;

            var Sa2 = n / (n + 2) * ((yPowSum - a * xMySum - b * ySum) / (n * xPowSum - xSum * xSum)); //Wariancja współczynnika kierunkowego regresji liniowej a
            var Sy2 = (yPowSum - a * xMySum - b * ySum) / (n * (n - 2)); //Sa2 //Mean y value variance

            var errorFn = function errorFn(x) {
                return Math.sqrt(Sy2 + Math.pow(x - meanX, 2) * Sa2);
            }; //pierwiastek kwadratowy z wariancji dowolnego punktu prostej
            var marginOfError = function marginOfError(x) {
                return criticalValue * errorFn(x);
            };

            // console.log('n', n, 'degreesOfFreedom', degreesOfFreedom, 'criticalProbability',criticalProbability);
            // var confidenceDown = x => linearRegressionLine(x) -  marginOfError(x);
            // var confidenceUp = x => linearRegressionLine(x) +  marginOfError(x);

            var computeConfidenceAreaPoint = function computeConfidenceAreaPoint(x) {
                var linearRegression = linearRegressionLine(x);
                var moe = marginOfError(x);
                var confDown = linearRegression - moe;
                var confUp = linearRegression + moe;
                return {
                    x: x,
                    y0: confDown,
                    y1: confUp
                };
            };

            var centerX = (extentX[1] + extentX[0]) / 2;

            // var confidenceAreaPoints = [extentX[0], centerX,  extentX[1]].map(computeConfidenceAreaPoint);
            var confidenceAreaPoints = [extentX[0], centerX, extentX[1]].map(computeConfidenceAreaPoint);

            var fitInPlot = function fitInPlot(y) {
                return y;
            };

            var confidenceArea = d3.svg.area().interpolate("monotone").x(function (d) {
                return self.plot.x.scale(d.x);
            }).y0(function (d) {
                return fitInPlot(self.plot.y.scale(d.y0));
            }).y1(function (d) {
                return fitInPlot(self.plot.y.scale(d.y1));
            });

            return {
                area: confidenceArea,
                points: confidenceAreaPoints
            };
        }
    }, {
        key: "update",
        value: function update(newData) {
            _get(Object.getPrototypeOf(Regression.prototype), "update", this).call(this, newData);
            this.updateRegressionLines();
        }
    }, {
        key: "updateRegressionLines",
        value: function updateRegressionLines() {
            var self = this;
            var regressionContainerClass = this.prefixClass("regression-container");
            var regressionContainerSelector = "g." + regressionContainerClass;

            var clipPathId = self.prefixClass("clip");

            var regressionContainer = self.svgG.selectOrInsert(regressionContainerSelector, "." + self.dotsContainerClass);
            var regressionContainerClip = regressionContainer.selectOrAppend("clipPath").attr("id", clipPathId);

            regressionContainerClip.selectOrAppend('rect').attr('width', self.plot.width).attr('height', self.plot.height).attr('x', 0).attr('y', 0);

            regressionContainer.attr("clip-path", function (d, i) {
                return "url(#" + clipPathId + ")";
            });

            var regressionClass = this.prefixClass("regression");
            var confidenceAreaClass = self.prefixClass("confidence");
            var regressionSelector = "g." + regressionClass;
            var regression = regressionContainer.selectAll(regressionSelector).data(self.plot.regressions, function (d, i) {
                return d.group;
            });

            var regressionEnterG = regression.enter().insertSelector(regressionSelector);
            var lineClass = self.prefixClass("line");
            regressionEnterG.append("path").attr("class", lineClass).attr("shape-rendering", "optimizeQuality");
            // .append("line")
            // .attr("class", "line")
            // .attr("shape-rendering", "optimizeQuality");

            var line = regression.select("path." + lineClass).style("stroke", function (r) {
                return r.color;
            });
            // .attr("x1", r=> self.plot.x.scale(r.linePoints[0].x))
            // .attr("y1", r=> self.plot.y.scale(r.linePoints[0].y))
            // .attr("x2", r=> self.plot.x.scale(r.linePoints[1].x))
            // .attr("y2", r=> self.plot.y.scale(r.linePoints[1].y))

            var lineT = line;
            if (self.transitionEnabled()) {
                lineT = line.transition();
            }

            lineT.attr("d", function (r) {
                return r.line(r.linePoints);
            });

            regressionEnterG.append("path").attr("class", confidenceAreaClass).attr("shape-rendering", "optimizeQuality").style("opacity", "0.4");

            var area = regression.select("path." + confidenceAreaClass);

            var areaT = area;
            if (self.transitionEnabled()) {
                areaT = area.transition();
            }
            areaT.attr("d", function (r) {
                return r.confidence.area(r.confidence.points);
            });
            areaT.style("fill", function (r) {
                return r.color;
            });
            regression.exit().remove();
        }
    }]);

    return Regression;
}(_scatterplot.ScatterPlot);

},{"./chart":26,"./scatterplot":36,"./statistics-utils":38,"./utils":39}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ScatterPlotMatrix = exports.ScatterPlotMatrixConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chartWithColorGroups = require("./chart-with-color-groups");

var _scatterplot = require("./scatterplot");

var _utils = require("./utils");

var _legend = require("./legend");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScatterPlotMatrixConfig = exports.ScatterPlotMatrixConfig = function (_ScatterPlotConfig) {
    _inherits(ScatterPlotMatrixConfig, _ScatterPlotConfig);

    //ticks number, (default: computed using cell size)
    //show axis guides
    //scatter plot cell padding

    function ScatterPlotMatrixConfig(custom) {
        _classCallCheck(this, ScatterPlotMatrixConfig);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ScatterPlotMatrixConfig).call(this));

        _this.svgClass = _this.cssClassPrefix + 'scatterplot-matrix';
        _this.size = undefined;
        _this.minCellSize = 50;
        _this.maxCellSize = 1000;
        _this.padding = 20;
        _this.brush = true;
        _this.guides = true;
        _this.showTooltip = true;
        _this.ticks = undefined;
        _this.x = { // X axis config
            orient: "bottom",
            scale: "linear"
        };
        _this.y = { // Y axis config
            orient: "left",
            scale: "linear"
        };
        _this.groups = {
            key: undefined, //object property name or array index with grouping variable
            includeInPlot: false };
        _this.variables = {
            labels: [], //optional array of variable labels (for the diagonal of the plot).
            keys: [], //optional array of variable keys
            value: function value(d, variableKey) {
                return d[variableKey];
            } // variable value accessor
        };

        _utils.Utils.deepExtend(_this, custom);
        return _this;
    } //show tooltip on dot hover
    //scatter plot cell size


    return ScatterPlotMatrixConfig;
}(_scatterplot.ScatterPlotConfig);

var ScatterPlotMatrix = exports.ScatterPlotMatrix = function (_ChartWithColorGroups) {
    _inherits(ScatterPlotMatrix, _ChartWithColorGroups);

    function ScatterPlotMatrix(placeholderSelector, data, config) {
        _classCallCheck(this, ScatterPlotMatrix);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ScatterPlotMatrix).call(this, placeholderSelector, data, new ScatterPlotMatrixConfig(config)));
    }

    _createClass(ScatterPlotMatrix, [{
        key: "setConfig",
        value: function setConfig(config) {
            return _get(Object.getPrototypeOf(ScatterPlotMatrix.prototype), "setConfig", this).call(this, new ScatterPlotMatrixConfig(config));
        }
    }, {
        key: "initPlot",
        value: function initPlot() {
            _get(Object.getPrototypeOf(ScatterPlotMatrix.prototype), "initPlot", this).call(this);

            var self = this;
            var margin = this.plot.margin;
            var conf = this.config;
            this.plot.x = {};
            this.plot.y = {};
            this.plot.dot = {
                color: null //color scale mapping function
            };

            this.setupVariables();

            this.plot.size = conf.size;

            var width = conf.width;
            var availableWidth = _utils.Utils.availableWidth(this.config.width, this.getBaseContainer(), margin);
            var availableHeight = _utils.Utils.availableHeight(this.config.height, this.getBaseContainer(), margin);
            if (!width) {
                if (!this.plot.size) {
                    this.plot.size = Math.min(conf.maxCellSize, Math.max(conf.minCellSize, availableWidth / this.plot.variables.length));
                }
                width = margin.left + margin.right + this.plot.variables.length * this.plot.size;
            }
            if (!this.plot.size) {
                this.plot.size = (width - (margin.left + margin.right)) / this.plot.variables.length;
            }

            var height = width;
            if (!height) {
                height = availableHeight;
            }

            this.plot.width = width - margin.left - margin.right;
            this.plot.height = height - margin.top - margin.bottom;

            this.plot.ticks = conf.ticks;

            if (this.plot.ticks === undefined) {
                this.plot.ticks = this.plot.size / 40;
            }

            this.setupX();
            this.setupY();

            return this;
        }
    }, {
        key: "setupVariables",
        value: function setupVariables() {
            var variablesConf = this.config.variables;

            var data = this.plot.groupedData;
            var plot = this.plot;
            plot.domainByVariable = {};
            plot.variables = variablesConf.keys;
            if (!plot.variables || !plot.variables.length) {

                plot.variables = data.length ? _utils.Utils.inferVariables(data[0].values, this.config.groups.key, this.config.includeInPlot) : [];
            }

            plot.labels = [];
            plot.labelByVariable = {};
            plot.variables.forEach(function (variableKey, index) {
                var min = d3.min(data, function (s) {
                    return d3.min(s.values, function (d) {
                        return variablesConf.value(d, variableKey);
                    });
                });
                var max = d3.max(data, function (s) {
                    return d3.max(s.values, function (d) {
                        return variablesConf.value(d, variableKey);
                    });
                });
                plot.domainByVariable[variableKey] = [min, max];
                var label = variableKey;
                if (variablesConf.labels && variablesConf.labels.length > index) {

                    label = variablesConf.labels[index];
                }
                plot.labels.push(label);
                plot.labelByVariable[variableKey] = label;
            });

            plot.subplots = [];
        }
    }, {
        key: "setupX",
        value: function setupX() {

            var plot = this.plot;
            var x = plot.x;
            var conf = this.config;

            x.value = conf.variables.value;
            x.scale = d3.scale[conf.x.scale]().range([conf.padding / 2, plot.size - conf.padding / 2]);
            x.map = function (d, variable) {
                return x.scale(x.value(d, variable));
            };
            x.axis = d3.svg.axis().scale(x.scale).orient(conf.x.orient).ticks(plot.ticks);
            x.axis.tickSize(plot.size * plot.variables.length);
        }
    }, {
        key: "setupY",
        value: function setupY() {

            var plot = this.plot;
            var y = plot.y;
            var conf = this.config;

            y.value = conf.variables.value;
            y.scale = d3.scale[conf.y.scale]().range([plot.size - conf.padding / 2, conf.padding / 2]);
            y.map = function (d, variable) {
                return y.scale(y.value(d, variable));
            };
            y.axis = d3.svg.axis().scale(y.scale).orient(conf.y.orient).ticks(plot.ticks);
            y.axis.tickSize(-plot.size * plot.variables.length);
        }
    }, {
        key: "update",
        value: function update(newData) {
            _get(Object.getPrototypeOf(ScatterPlotMatrix.prototype), "update", this).call(this, newData);

            var self = this;
            var n = self.plot.variables.length;
            var conf = this.config;

            var axisClass = self.prefixClass("axis");
            var axisXClass = axisClass + "-x";
            var axisYClass = axisClass + "-y";

            var xAxisSelector = "g." + axisXClass + "." + axisClass;
            var yAxisSelector = "g." + axisYClass + "." + axisClass;

            var noGuidesClass = self.prefixClass("no-guides");
            var xAxis = self.svgG.selectAll(xAxisSelector).data(self.plot.variables);

            xAxis.enter().appendSelector(xAxisSelector).classed(noGuidesClass, !conf.guides);

            xAxis.attr("transform", function (d, i) {
                return "translate(" + (n - i - 1) * self.plot.size + ",0)";
            }).each(function (d) {
                self.plot.x.scale.domain(self.plot.domainByVariable[d]);
                var axis = d3.select(this);
                if (self.transitionEnabled()) {
                    axis = axis.transition();
                }
                axis.call(self.plot.x.axis);
            });

            xAxis.exit().remove();

            var yAxis = self.svgG.selectAll(yAxisSelector).data(self.plot.variables);
            yAxis.enter().appendSelector(yAxisSelector);
            yAxis.classed(noGuidesClass, !conf.guides).attr("transform", function (d, i) {
                return "translate(0," + i * self.plot.size + ")";
            });
            yAxis.each(function (d) {
                self.plot.y.scale.domain(self.plot.domainByVariable[d]);
                var axis = d3.select(this);
                if (self.transitionEnabled()) {
                    axis = axis.transition();
                }
                axis.call(self.plot.y.axis);
            });

            yAxis.exit().remove();

            var cellClass = self.prefixClass("cell");
            var cell = self.svgG.selectAll("." + cellClass).data(self.utils.cross(self.plot.variables, self.plot.variables));

            cell.enter().appendSelector("g." + cellClass).filter(function (d) {
                return d.i === d.j;
            }).append("text");

            cell.attr("transform", function (d) {
                return "translate(" + (n - d.i - 1) * self.plot.size + "," + d.j * self.plot.size + ")";
            });

            if (conf.brush) {
                this.drawBrush(cell);
            }

            cell.each(plotSubplot);

            //Labels
            cell.select("text").attr("x", conf.padding).attr("y", conf.padding).attr("dy", ".71em").text(function (d) {
                return self.plot.labelByVariable[d.x];
            });

            cell.exit().remove();

            function plotSubplot(p) {
                var plot = self.plot;
                plot.subplots.push(p);
                var cell = d3.select(this);

                plot.x.scale.domain(plot.domainByVariable[p.x]);
                plot.y.scale.domain(plot.domainByVariable[p.y]);

                var frameClass = self.prefixClass("frame");
                cell.selectOrAppend("rect." + frameClass).attr("class", frameClass).attr("x", conf.padding / 2).attr("y", conf.padding / 2).attr("width", plot.size - conf.padding).attr("height", plot.size - conf.padding);

                p.update = function () {

                    var subplot = this;
                    var layerClass = self.prefixClass('layer');

                    var layer = cell.selectAll("g." + layerClass).data(self.plot.groupedData);

                    layer.enter().appendSelector("g." + layerClass);

                    var dots = layer.selectAll("circle").data(function (d) {
                        return d.values;
                    });

                    dots.enter().append("circle");

                    var dotsT = dots;
                    if (self.transitionEnabled()) {
                        dotsT = dots.transition();
                    }

                    dotsT.attr("cx", function (d) {
                        return plot.x.map(d, subplot.x);
                    }).attr("cy", function (d) {
                        return plot.y.map(d, subplot.y);
                    }).attr("r", self.config.dotRadius);

                    if (plot.seriesColor) {
                        layer.style("fill", plot.seriesColor);
                    } else if (plot.color) {
                        dots.style("fill", plot.color);
                    }

                    if (plot.tooltip) {
                        dots.on("mouseover", function (d) {

                            var html = "(" + plot.x.value(d, subplot.x) + ", " + plot.y.value(d, subplot.y) + ")";
                            var group = self.config.groups ? self.config.groups.value.call(self.config, d) : null;
                            if (group || group === 0) {
                                group = plot.groupToLabel[group];
                                html += "<br/>";
                                var label = self.config.groups.label;
                                if (label) {
                                    html += label + ": ";
                                }
                                html += group;
                            }
                            self.showTooltip(html);
                        }).on("mouseout", function (d) {
                            self.hideTooltip();
                        });
                    }

                    dots.exit().remove();
                    layer.exit().remove();
                };
                p.update();
            }
        }
    }, {
        key: "drawBrush",
        value: function drawBrush(cell) {
            var self = this;
            var brush = d3.svg.brush().x(self.plot.x.scale).y(self.plot.y.scale).on("brushstart", brushstart).on("brush", brushmove).on("brushend", brushend);

            self.plot.brush = brush;

            cell.selectOrAppend("g.brush-container").call(brush);
            self.clearBrush();

            // Clear the previously-active brush, if any.
            function brushstart(p) {
                if (self.plot.brushCell !== this) {
                    self.clearBrush();
                    self.plot.x.scale.domain(self.plot.domainByVariable[p.x]);
                    self.plot.y.scale.domain(self.plot.domainByVariable[p.y]);
                    self.plot.brushCell = this;
                }
            }

            // Highlight the selected circles.
            function brushmove(p) {
                var e = brush.extent();
                self.svgG.selectAll("circle").classed("hidden", function (d) {
                    return e[0][0] > d[p.x] || d[p.x] > e[1][0] || e[0][1] > d[p.y] || d[p.y] > e[1][1];
                });
            }
            // If the brush is empty, select all circles.
            function brushend() {
                if (brush.empty()) self.svgG.selectAll(".hidden").classed("hidden", false);
            }
        }
    }, {
        key: "clearBrush",
        value: function clearBrush() {
            var self = this;
            if (!self.plot.brushCell) {
                return;
            }
            d3.select(self.plot.brushCell).call(self.plot.brush.clear());
            self.svgG.selectAll(".hidden").classed("hidden", false);
            self.plot.brushCell = null;
        }
    }]);

    return ScatterPlotMatrix;
}(_chartWithColorGroups.ChartWithColorGroups);

},{"./chart-with-color-groups":25,"./legend":33,"./scatterplot":36,"./utils":39}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ScatterPlot = exports.ScatterPlotConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chartWithColorGroups = require("./chart-with-color-groups");

var _utils = require("./utils");

var _legend = require("./legend");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScatterPlotConfig = exports.ScatterPlotConfig = function (_ChartWithColorGroups) {
    _inherits(ScatterPlotConfig, _ChartWithColorGroups);

    //show axis guides

    function ScatterPlotConfig(custom) {
        _classCallCheck(this, ScatterPlotConfig);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ScatterPlotConfig).call(this));

        _this.svgClass = _this.cssClassPrefix + 'scatterplot';
        _this.guides = false;
        _this.showTooltip = true;
        _this.x = { // X axis config
            label: '', // axis label
            key: 0,
            value: function value(d, key) {
                return d[key];
            }, // x value accessor
            orient: "bottom",
            scale: "linear",
            domainMargin: 0.05
        };
        _this.y = { // Y axis config
            label: '', // axis label,
            key: 1,
            value: function value(d, key) {
                return d[key];
            }, // y value accessor
            orient: "left",
            scale: "linear",
            domainMargin: 0.05
        };
        _this.groups = {
            key: 2
        };
        _this.dotRadius = 2;
        _this.transition = true;


        if (custom) {
            _utils.Utils.deepExtend(_this, custom);
        }

        return _this;
    } //show tooltip on dot hover

    return ScatterPlotConfig;
}(_chartWithColorGroups.ChartWithColorGroupsConfig);

var ScatterPlot = exports.ScatterPlot = function (_ChartWithColorGroups2) {
    _inherits(ScatterPlot, _ChartWithColorGroups2);

    function ScatterPlot(placeholderSelector, data, config) {
        _classCallCheck(this, ScatterPlot);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ScatterPlot).call(this, placeholderSelector, data, new ScatterPlotConfig(config)));
    }

    _createClass(ScatterPlot, [{
        key: "setConfig",
        value: function setConfig(config) {
            return _get(Object.getPrototypeOf(ScatterPlot.prototype), "setConfig", this).call(this, new ScatterPlotConfig(config));
        }
    }, {
        key: "initPlot",
        value: function initPlot() {
            _get(Object.getPrototypeOf(ScatterPlot.prototype), "initPlot", this).call(this);
            var self = this;

            var conf = this.config;

            this.plot.x = {};
            this.plot.y = {};

            this.computePlotSize();
            this.setupX();
            this.setupY();

            return this;
        }
    }, {
        key: "setupX",
        value: function setupX() {

            var plot = this.plot;
            var x = plot.x;
            var conf = this.config.x;

            /* *
             * value accessor - returns the value to encode for a given data object.
             * scale - maps value to a visual display encoding, such as a pixel position.
             * map function - maps from data value to display value
             * axis - sets up axis
             **/
            x.value = function (d) {
                return conf.value(d, conf.key);
            };
            x.scale = d3.scale[conf.scale]().range([0, plot.width]);
            x.map = function (d) {
                return x.scale(x.value(d));
            };
            x.axis = d3.svg.axis().scale(x.scale).orient(conf.orient);
            var data = this.plot.groupedData;

            var domain = [parseFloat(d3.min(data, function (s) {
                return d3.min(s.values, plot.x.value);
            })), parseFloat(d3.max(data, function (s) {
                return d3.max(s.values, plot.x.value);
            }))];
            var margin = (domain[1] - domain[0]) * conf.domainMargin;
            domain[0] -= margin;
            domain[1] += margin;
            plot.x.scale.domain(domain);
            if (this.config.guides) {
                x.axis.tickSize(-plot.height);
            }
        }
    }, {
        key: "setupY",
        value: function setupY() {

            var plot = this.plot;
            var y = plot.y;
            var conf = this.config.y;

            /*
             * value accessor - returns the value to encode for a given data object.
             * scale - maps value to a visual display encoding, such as a pixel position.
             * map function - maps from data value to display value
             * axis - sets up axis
             */
            y.value = function (d) {
                return conf.value(d, conf.key);
            };
            y.scale = d3.scale[conf.scale]().range([plot.height, 0]);
            y.map = function (d) {
                return y.scale(y.value(d));
            };
            y.axis = d3.svg.axis().scale(y.scale).orient(conf.orient);

            if (this.config.guides) {
                y.axis.tickSize(-plot.width);
            }

            var data = this.plot.groupedData;

            var domain = [parseFloat(d3.min(data, function (s) {
                return d3.min(s.values, plot.y.value);
            })), parseFloat(d3.max(data, function (s) {
                return d3.max(s.values, plot.y.value);
            }))];
            var margin = (domain[1] - domain[0]) * conf.domainMargin;
            domain[0] -= margin;
            domain[1] += margin;
            plot.y.scale.domain(domain);
            // plot.y.scale.domain([d3.min(data, plot.y.value)-1, d3.max(data, plot.y.value)+1]);
        }
    }, {
        key: "drawAxisX",
        value: function drawAxisX() {
            var self = this;
            var plot = self.plot;
            var axisConf = this.config.x;
            var axis = self.svgG.selectOrAppend("g." + self.prefixClass('axis-x') + "." + self.prefixClass('axis') + (self.config.guides ? '' : '.' + self.prefixClass('no-guides'))).attr("transform", "translate(0," + plot.height + ")");

            var axisT = axis;
            if (self.transitionEnabled()) {
                axisT = axis.transition().ease("sin-in-out");
            }

            axisT.call(plot.x.axis);

            axis.selectOrAppend("text." + self.prefixClass('label')).attr("transform", "translate(" + plot.width / 2 + "," + plot.margin.bottom + ")") // text is drawn off the screen top left, move down and out and rotate
            .attr("dy", "-1em").style("text-anchor", "middle").text(axisConf.label);
        }
    }, {
        key: "drawAxisY",
        value: function drawAxisY() {
            var self = this;
            var plot = self.plot;
            var axisConf = this.config.y;
            var axis = self.svgG.selectOrAppend("g." + self.prefixClass('axis-y') + "." + self.prefixClass('axis') + (self.config.guides ? '' : '.' + self.prefixClass('no-guides')));

            var axisT = axis;
            if (self.transitionEnabled()) {
                axisT = axis.transition().ease("sin-in-out");
            }

            axisT.call(plot.y.axis);

            axis.selectOrAppend("text." + self.prefixClass('label')).attr("transform", "translate(" + -plot.margin.left + "," + plot.height / 2 + ")rotate(-90)") // text is drawn off the screen top left, move down and out and rotate
            .attr("dy", "1em").style("text-anchor", "middle").text(axisConf.label);
        }
    }, {
        key: "update",
        value: function update(newData) {
            _get(Object.getPrototypeOf(ScatterPlot.prototype), "update", this).call(this, newData);
            this.drawAxisX();
            this.drawAxisY();

            this.updateDots();
        }
    }, {
        key: "updateDots",
        value: function updateDots() {
            var self = this;
            var plot = self.plot;
            var data = plot.data;
            var layerClass = self.prefixClass('layer');
            var dotClass = self.prefixClass('dot');
            self.dotsContainerClass = self.prefixClass('dots-container');

            var dotsContainer = self.svgG.selectOrAppend("g." + self.dotsContainerClass);

            var layer = dotsContainer.selectAll("g." + layerClass).data(plot.groupedData);

            layer.enter().appendSelector("g." + layerClass);

            var dots = layer.selectAll('.' + dotClass).data(function (d) {
                return d.values;
            });

            dots.enter().append("circle").attr("class", dotClass);

            var dotsT = dots;
            if (self.transitionEnabled()) {
                dotsT = dots.transition();
            }

            dotsT.attr("r", self.config.dotRadius).attr("cx", plot.x.map).attr("cy", plot.y.map);

            if (plot.tooltip) {
                dots.on("mouseover", function (d) {
                    var html = "(" + plot.x.value(d) + ", " + plot.y.value(d) + ")";
                    var group = self.config.groups ? self.config.groups.value.call(self.config, d) : null;
                    if (group || group === 0) {
                        group = plot.groupToLabel[group];
                        html += "<br/>";
                        var label = self.config.groups.label;
                        if (label) {
                            html += label + ": ";
                        }
                        html += group;
                    }
                    self.showTooltip(html);
                }).on("mouseout", function (d) {
                    self.hideTooltip();
                });
            }

            if (plot.seriesColor) {
                layer.style("fill", plot.seriesColor);
            } else if (plot.color) {
                dots.style("fill", plot.color);
            }

            dots.exit().remove();
            layer.exit().remove();
        }
    }]);

    return ScatterPlot;
}(_chartWithColorGroups.ChartWithColorGroups);

},{"./chart-with-color-groups":25,"./legend":33,"./utils":39}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.tdistr = tdistr;
/*
 * https://gist.github.com/benrasmusen/1261977
 * NAME
 * 
 * statistics-distributions.js - JavaScript library for calculating
 *   critical values and upper probabilities of common statistical
 *   distributions
 * 
 * SYNOPSIS
 * 
 * 
 *   // Chi-squared-crit (2 degrees of freedom, 95th percentile = 0.05 level
 *   chisqrdistr(2, .05)
 *   
 *   // u-crit (95th percentile = 0.05 level)
 *   udistr(.05);
 *   
 *   // t-crit (1 degree of freedom, 99.5th percentile = 0.005 level) 
 *   tdistr(1,.005);
 *   
 *   // F-crit (1 degree of freedom in numerator, 3 degrees of freedom 
 *   //         in denominator, 99th percentile = 0.01 level)
 *   fdistr(1,3,.01);
 *   
 *   // upper probability of the u distribution (u = -0.85): Q(u) = 1-G(u)
 *   uprob(-0.85);
 *   
 *   // upper probability of the chi-square distribution
 *   // (3 degrees of freedom, chi-squared = 6.25): Q = 1-G
 *   chisqrprob(3,6.25);
 *   
 *   // upper probability of the t distribution
 *   // (3 degrees of freedom, t = 6.251): Q = 1-G
 *   tprob(3,6.251);
 *   
 *   // upper probability of the F distribution
 *   // (3 degrees of freedom in numerator, 5 degrees of freedom in
 *   //  denominator, F = 6.25): Q = 1-G
 *   fprob(3,5,.625);
 * 
 * 
 *  DESCRIPTION
 * 
 * This library calculates percentage points (5 significant digits) of the u
 * (standard normal) distribution, the student's t distribution, the
 * chi-square distribution and the F distribution. It can also calculate the
 * upper probability (5 significant digits) of the u (standard normal), the
 * chi-square, the t and the F distribution.
 * 
 * These critical values are needed to perform statistical tests, like the u
 * test, the t test, the F test and the chi-squared test, and to calculate
 * confidence intervals.
 * 
 * If you are interested in more precise algorithms you could look at:
 *   StatLib: http://lib.stat.cmu.edu/apstat/ ; 
 *   Applied Statistics Algorithms by Griffiths, P. and Hill, I.D.
 *   , Ellis Horwood: Chichester (1985)
 * 
 * BUGS 
 * 
 * This port was produced from the Perl module Statistics::Distributions
 * that has had no bug reports in several years.  If you find a bug then
 * please double-check that JavaScript does not thing the numbers you are
 * passing in are strings.  (You can subtract 0 from them as you pass them
 * in so that "5" is properly understood to be 5.)  If you have passed in a
 * number then please contact the author
 * 
 * AUTHOR
 * 
 * Ben Tilly <btilly@gmail.com>
 * 
 * Originl Perl version by Michael Kospach <mike.perl@gmx.at>
 * 
 * Nice formating, simplification and bug repair by Matthias Trautner Kromann
 * <mtk@id.cbs.dk>
 * 
 * COPYRIGHT 
 * 
 * Copyright 2008 Ben Tilly.
 * 
 * This library is free software; you can redistribute it and/or modify it
 * under the same terms as Perl itself.  This means under either the Perl
 * Artistic License or the GPL v1 or later.
 */

var SIGNIFICANT = 5; // number of significant digits to be returned

function chisqrdistr($n, $p) {
	if ($n <= 0 || Math.abs($n) - Math.abs(integer($n)) != 0) {
		throw "Invalid n: $n\n"; /* degree of freedom */
	}
	if ($p <= 0 || $p > 1) {
		throw "Invalid p: $p\n";
	}
	return precision_string(_subchisqr($n - 0, $p - 0));
}

function udistr($p) {
	if ($p > 1 || $p <= 0) {
		throw "Invalid p: $p\n";
	}
	return precision_string(_subu($p - 0));
}

function tdistr($n, $p) {
	if ($n <= 0 || Math.abs($n) - Math.abs(integer($n)) != 0) {
		throw "Invalid n: $n\n";
	}
	if ($p <= 0 || $p >= 1) {
		throw "Invalid p: $p\n";
	}
	return precision_string(_subt($n - 0, $p - 0));
}

function fdistr($n, $m, $p) {
	if ($n <= 0 || Math.abs($n) - Math.abs(integer($n)) != 0) {
		throw "Invalid n: $n\n"; /* first degree of freedom */
	}
	if ($m <= 0 || Math.abs($m) - Math.abs(integer($m)) != 0) {
		throw "Invalid m: $m\n"; /* second degree of freedom */
	}
	if ($p <= 0 || $p > 1) {
		throw "Invalid p: $p\n";
	}
	return precision_string(_subf($n - 0, $m - 0, $p - 0));
}

function uprob($x) {
	return precision_string(_subuprob($x - 0));
}

function chisqrprob($n, $x) {
	if ($n <= 0 || Math.abs($n) - Math.abs(integer($n)) != 0) {
		throw "Invalid n: $n\n"; /* degree of freedom */
	}
	return precision_string(_subchisqrprob($n - 0, $x - 0));
}

function tprob($n, $x) {
	if ($n <= 0 || Math.abs($n) - Math.abs(integer($n)) != 0) {
		throw "Invalid n: $n\n"; /* degree of freedom */
	}
	return precision_string(_subtprob($n - 0, $x - 0));
}

function fprob($n, $m, $x) {
	if ($n <= 0 || Math.abs($n) - Math.abs(integer($n)) != 0) {
		throw "Invalid n: $n\n"; /* first degree of freedom */
	}
	if ($m <= 0 || Math.abs($m) - Math.abs(integer($m)) != 0) {
		throw "Invalid m: $m\n"; /* second degree of freedom */
	}
	return precision_string(_subfprob($n - 0, $m - 0, $x - 0));
}

function _subfprob($n, $m, $x) {
	var $p;

	if ($x <= 0) {
		$p = 1;
	} else if ($m % 2 == 0) {
		var $z = $m / ($m + $n * $x);
		var $a = 1;
		for (var $i = $m - 2; $i >= 2; $i -= 2) {
			$a = 1 + ($n + $i - 2) / $i * $z * $a;
		}
		$p = 1 - Math.pow(1 - $z, $n / 2 * $a);
	} else if ($n % 2 == 0) {
		var $z = $n * $x / ($m + $n * $x);
		var $a = 1;
		for (var $i = $n - 2; $i >= 2; $i -= 2) {
			$a = 1 + ($m + $i - 2) / $i * $z * $a;
		}
		$p = Math.pow(1 - $z, $m / 2) * $a;
	} else {
		var $y = Math.atan2(Math.sqrt($n * $x / $m), 1);
		var $z = Math.pow(Math.sin($y), 2);
		var $a = $n == 1 ? 0 : 1;
		for (var $i = $n - 2; $i >= 3; $i -= 2) {
			$a = 1 + ($m + $i - 2) / $i * $z * $a;
		}
		var $b = Math.PI;
		for (var $i = 2; $i <= $m - 1; $i += 2) {
			$b *= ($i - 1) / $i;
		}
		var $p1 = 2 / $b * Math.sin($y) * Math.pow(Math.cos($y), $m) * $a;

		$z = Math.pow(Math.cos($y), 2);
		$a = $m == 1 ? 0 : 1;
		for (var $i = $m - 2; $i >= 3; $i -= 2) {
			$a = 1 + ($i - 1) / $i * $z * $a;
		}
		$p = max(0, $p1 + 1 - 2 * $y / Math.PI - 2 / Math.PI * Math.sin($y) * Math.cos($y) * $a);
	}
	return $p;
}

function _subchisqrprob($n, $x) {
	var $p;

	if ($x <= 0) {
		$p = 1;
	} else if ($n > 100) {
		$p = _subuprob((Math.pow($x / $n, 1 / 3) - (1 - 2 / 9 / $n)) / Math.sqrt(2 / 9 / $n));
	} else if ($x > 400) {
		$p = 0;
	} else {
		var $a;
		var $i;
		var $i1;
		if ($n % 2 != 0) {
			$p = 2 * _subuprob(Math.sqrt($x));
			$a = Math.sqrt(2 / Math.PI) * Math.exp(-$x / 2) / Math.sqrt($x);
			$i1 = 1;
		} else {
			$p = $a = Math.exp(-$x / 2);
			$i1 = 2;
		}

		for ($i = $i1; $i <= $n - 2; $i += 2) {
			$a *= $x / $i;
			$p += $a;
		}
	}
	return $p;
}

function _subu($p) {
	var $y = -Math.log(4 * $p * (1 - $p));
	var $x = Math.sqrt($y * (1.570796288 + $y * (.03706987906 + $y * (-.8364353589E-3 + $y * (-.2250947176E-3 + $y * (.6841218299E-5 + $y * (0.5824238515E-5 + $y * (-.104527497E-5 + $y * (.8360937017E-7 + $y * (-.3231081277E-8 + $y * (.3657763036E-10 + $y * .6936233982E-12)))))))))));
	if ($p > .5) $x = -$x;
	return $x;
}

function _subuprob($x) {
	var $p = 0; /* if ($absx > 100) */
	var $absx = Math.abs($x);

	if ($absx < 1.9) {
		$p = Math.pow(1 + $absx * (.049867347 + $absx * (.0211410061 + $absx * (.0032776263 + $absx * (.0000380036 + $absx * (.0000488906 + $absx * .000005383))))), -16) / 2;
	} else if ($absx <= 100) {
		for (var $i = 18; $i >= 1; $i--) {
			$p = $i / ($absx + $p);
		}
		$p = Math.exp(-.5 * $absx * $absx) / Math.sqrt(2 * Math.PI) / ($absx + $p);
	}

	if ($x < 0) $p = 1 - $p;
	return $p;
}

function _subt($n, $p) {

	if ($p >= 1 || $p <= 0) {
		throw "Invalid p: $p\n";
	}

	if ($p == 0.5) {
		return 0;
	} else if ($p < 0.5) {
		return -_subt($n, 1 - $p);
	}

	var $u = _subu($p);
	var $u2 = Math.pow($u, 2);

	var $a = ($u2 + 1) / 4;
	var $b = ((5 * $u2 + 16) * $u2 + 3) / 96;
	var $c = (((3 * $u2 + 19) * $u2 + 17) * $u2 - 15) / 384;
	var $d = ((((79 * $u2 + 776) * $u2 + 1482) * $u2 - 1920) * $u2 - 945) / 92160;
	var $e = (((((27 * $u2 + 339) * $u2 + 930) * $u2 - 1782) * $u2 - 765) * $u2 + 17955) / 368640;

	var $x = $u * (1 + ($a + ($b + ($c + ($d + $e / $n) / $n) / $n) / $n) / $n);

	if ($n <= Math.pow(log10($p), 2) + 3) {
		var $round;
		do {
			var $p1 = _subtprob($n, $x);
			var $n1 = $n + 1;
			var $delta = ($p1 - $p) / Math.exp(($n1 * Math.log($n1 / ($n + $x * $x)) + Math.log($n / $n1 / 2 / Math.PI) - 1 + (1 / $n1 - 1 / $n) / 6) / 2);
			$x += $delta;
			$round = round_to_precision($delta, Math.abs(integer(log10(Math.abs($x)) - 4)));
		} while ($x && $round != 0);
	}
	return $x;
}

function _subtprob($n, $x) {

	var $a;
	var $b;
	var $w = Math.atan2($x / Math.sqrt($n), 1);
	var $z = Math.pow(Math.cos($w), 2);
	var $y = 1;

	for (var $i = $n - 2; $i >= 2; $i -= 2) {
		$y = 1 + ($i - 1) / $i * $z * $y;
	}

	if ($n % 2 == 0) {
		$a = Math.sin($w) / 2;
		$b = .5;
	} else {
		$a = $n == 1 ? 0 : Math.sin($w) * Math.cos($w) / Math.PI;
		$b = .5 + $w / Math.PI;
	}
	return max(0, 1 - $b - $a * $y);
}

function _subf($n, $m, $p) {
	var $x;

	if ($p >= 1 || $p <= 0) {
		throw "Invalid p: $p\n";
	}

	if ($p == 1) {
		$x = 0;
	} else if ($m == 1) {
		$x = 1 / Math.pow(_subt($n, 0.5 - $p / 2), 2);
	} else if ($n == 1) {
		$x = Math.pow(_subt($m, $p / 2), 2);
	} else if ($m == 2) {
		var $u = _subchisqr($m, 1 - $p);
		var $a = $m - 2;
		$x = 1 / ($u / $m * (1 + (($u - $a) / 2 + (((4 * $u - 11 * $a) * $u + $a * (7 * $m - 10)) / 24 + (((2 * $u - 10 * $a) * $u + $a * (17 * $m - 26)) * $u - $a * $a * (9 * $m - 6)) / 48 / $n) / $n) / $n));
	} else if ($n > $m) {
		$x = 1 / _subf2($m, $n, 1 - $p);
	} else {
		$x = _subf2($n, $m, $p);
	}
	return $x;
}

function _subf2($n, $m, $p) {
	var $u = _subchisqr($n, $p);
	var $n2 = $n - 2;
	var $x = $u / $n * (1 + (($u - $n2) / 2 + (((4 * $u - 11 * $n2) * $u + $n2 * (7 * $n - 10)) / 24 + (((2 * $u - 10 * $n2) * $u + $n2 * (17 * $n - 26)) * $u - $n2 * $n2 * (9 * $n - 6)) / 48 / $m) / $m) / $m);
	var $delta;
	do {
		var $z = Math.exp((($n + $m) * Math.log(($n + $m) / ($n * $x + $m)) + ($n - 2) * Math.log($x) + Math.log($n * $m / ($n + $m)) - Math.log(4 * Math.PI) - (1 / $n + 1 / $m - 1 / ($n + $m)) / 6) / 2);
		$delta = (_subfprob($n, $m, $x) - $p) / $z;
		$x += $delta;
	} while (Math.abs($delta) > 3e-4);
	return $x;
}

function _subchisqr($n, $p) {
	var $x;

	if ($p > 1 || $p <= 0) {
		throw "Invalid p: $p\n";
	} else if ($p == 1) {
		$x = 0;
	} else if ($n == 1) {
		$x = Math.pow(_subu($p / 2), 2);
	} else if ($n == 2) {
		$x = -2 * Math.log($p);
	} else {
		var $u = _subu($p);
		var $u2 = $u * $u;

		$x = max(0, $n + Math.sqrt(2 * $n) * $u + 2 / 3 * ($u2 - 1) + $u * ($u2 - 7) / 9 / Math.sqrt(2 * $n) - 2 / 405 / $n * ($u2 * (3 * $u2 + 7) - 16));

		if ($n <= 100) {
			var $x0;
			var $p1;
			var $z;
			do {
				$x0 = $x;
				if ($x < 0) {
					$p1 = 1;
				} else if ($n > 100) {
					$p1 = _subuprob((Math.pow($x / $n, 1 / 3) - (1 - 2 / 9 / $n)) / Math.sqrt(2 / 9 / $n));
				} else if ($x > 400) {
					$p1 = 0;
				} else {
					var $i0;
					var $a;
					if ($n % 2 != 0) {
						$p1 = 2 * _subuprob(Math.sqrt($x));
						$a = Math.sqrt(2 / Math.PI) * Math.exp(-$x / 2) / Math.sqrt($x);
						$i0 = 1;
					} else {
						$p1 = $a = Math.exp(-$x / 2);
						$i0 = 2;
					}

					for (var $i = $i0; $i <= $n - 2; $i += 2) {
						$a *= $x / $i;
						$p1 += $a;
					}
				}
				$z = Math.exp((($n - 1) * Math.log($x / $n) - Math.log(4 * Math.PI * $x) + $n - $x - 1 / $n / 6) / 2);
				$x += ($p1 - $p) / $z;
				$x = round_to_precision($x, 5);
			} while ($n < 31 && Math.abs($x0 - $x) > 1e-4);
		}
	}
	return $x;
}

function log10($n) {
	return Math.log($n) / Math.log(10);
}

function max() {
	var $max = arguments[0];
	for (var $i = 0; i < arguments.length; i++) {
		if ($max < arguments[$i]) $max = arguments[$i];
	}
	return $max;
}

function min() {
	var $min = arguments[0];
	for (var $i = 0; i < arguments.length; i++) {
		if ($min > arguments[$i]) $min = arguments[$i];
	}
	return $min;
}

function precision($x) {
	return Math.abs(integer(log10(Math.abs($x)) - SIGNIFICANT));
}

function precision_string($x) {
	if ($x) {
		return round_to_precision($x, precision($x));
	} else {
		return "0";
	}
}

function round_to_precision($x, $p) {
	$x = $x * Math.pow(10, $p);
	$x = Math.round($x);
	return $x / Math.pow(10, $p);
}

function integer($i) {
	if ($i > 0) return Math.floor($i);else return Math.ceil($i);
}

},{}],38:[function(require,module,exports){
'use strict';

var _statisticsDistributions = require('./statistics-distributions');

var su = module.exports.StatisticsUtils = {};
su.sampleCorrelation = require('../bower_components/simple-statistics/src/sample_correlation');
su.linearRegression = require('../bower_components/simple-statistics/src/linear_regression');
su.linearRegressionLine = require('../bower_components/simple-statistics/src/linear_regression_line');
su.errorFunction = require('../bower_components/simple-statistics/src/error_function');
su.standardDeviation = require('../bower_components/simple-statistics/src/standard_deviation');
su.sampleStandardDeviation = require('../bower_components/simple-statistics/src/sample_standard_deviation');
su.variance = require('../bower_components/simple-statistics/src/variance');
su.mean = require('../bower_components/simple-statistics/src/mean');
su.zScore = require('../bower_components/simple-statistics/src/z_score');
su.standardError = function (arr) {
    return Math.sqrt(su.variance(arr) / (arr.length - 1));
};
su.quantile = require('../bower_components/simple-statistics/src/quantile');

su.tValue = function (degreesOfFreedom, criticalProbability) {
    //as in http://stattrek.com/online-calculator/t-distribution.aspx
    return (0, _statisticsDistributions.tdistr)(degreesOfFreedom, criticalProbability);
};

},{"../bower_components/simple-statistics/src/error_function":6,"../bower_components/simple-statistics/src/linear_regression":7,"../bower_components/simple-statistics/src/linear_regression_line":8,"../bower_components/simple-statistics/src/mean":9,"../bower_components/simple-statistics/src/quantile":10,"../bower_components/simple-statistics/src/sample_correlation":13,"../bower_components/simple-statistics/src/sample_standard_deviation":15,"../bower_components/simple-statistics/src/standard_deviation":17,"../bower_components/simple-statistics/src/variance":20,"../bower_components/simple-statistics/src/z_score":21,"./statistics-distributions":37}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = exports.Utils = function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    _createClass(Utils, null, [{
        key: 'deepExtend',

        // usage example deepExtend({}, objA, objB); => should work similar to $.extend(true, {}, objA, objB);
        value: function deepExtend(out) {

            var utils = this;
            var emptyOut = {};

            if (!out && arguments.length > 1 && Array.isArray(arguments[1])) {
                out = [];
            }
            out = out || {};

            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                if (!source) continue;

                for (var key in source) {
                    if (!source.hasOwnProperty(key)) {
                        continue;
                    }
                    var isArray = Array.isArray(out[key]);
                    var isObject = utils.isObject(out[key]);
                    var srcObj = utils.isObject(source[key]);

                    if (isObject && !isArray && srcObj) {
                        utils.deepExtend(out[key], source[key]);
                    } else {
                        out[key] = source[key];
                    }
                }
            }

            return out;
        }
    }, {
        key: 'mergeDeep',
        value: function mergeDeep(target, source) {
            var output = Object.assign({}, target);
            if (Utils.isObjectNotArray(target) && Utils.isObjectNotArray(source)) {
                Object.keys(source).forEach(function (key) {
                    if (Utils.isObjectNotArray(source[key])) {
                        if (!(key in target)) Object.assign(output, _defineProperty({}, key, source[key]));else output[key] = Utils.mergeDeep(target[key], source[key]);
                    } else {
                        Object.assign(output, _defineProperty({}, key, source[key]));
                    }
                });
            }
            return output;
        }
    }, {
        key: 'cross',
        value: function cross(a, b) {
            var c = [],
                n = a.length,
                m = b.length,
                i,
                j;
            for (i = -1; ++i < n;) {
                for (j = -1; ++j < m;) {
                    c.push({ x: a[i], i: i, y: b[j], j: j });
                }
            }return c;
        }
    }, {
        key: 'inferVariables',
        value: function inferVariables(data, groupKey, includeGroup) {
            var res = [];
            if (!data) {
                return res;
            }

            if (data.length) {
                var d = data[0];
                if (d instanceof Array) {
                    res = d.map(function (v, i) {
                        return i;
                    });
                } else if ((typeof d === 'undefined' ? 'undefined' : _typeof(d)) === 'object') {

                    for (var prop in d) {
                        if (!d.hasOwnProperty(prop)) continue;

                        res.push(prop);
                    }
                }
            }
            if (groupKey !== null && groupKey !== undefined && !includeGroup) {
                var index = res.indexOf(groupKey);
                if (index > -1) {
                    res.splice(index, 1);
                }
            }
            return res;
        }
    }, {
        key: 'isObjectNotArray',
        value: function isObjectNotArray(item) {
            return item && (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && !Array.isArray(item) && item !== null;
        }
    }, {
        key: 'isObject',
        value: function isObject(a) {
            return a !== null && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object';
        }
    }, {
        key: 'isNumber',
        value: function isNumber(a) {
            return !isNaN(a) && typeof a === 'number';
        }
    }, {
        key: 'isFunction',
        value: function isFunction(a) {
            return typeof a === 'function';
        }
    }, {
        key: 'isDate',
        value: function isDate(a) {
            return Object.prototype.toString.call(a) === '[object Date]';
        }
    }, {
        key: 'isString',
        value: function isString(a) {
            return typeof a === 'string' || a instanceof String;
        }
    }, {
        key: 'insertOrAppendSelector',
        value: function insertOrAppendSelector(parent, selector, operation, before) {
            var selectorParts = selector.split(/([\.\#])/);
            var element = parent[operation](selectorParts.shift(), before); //":first-child"
            while (selectorParts.length > 1) {
                var selectorModifier = selectorParts.shift();
                var selectorItem = selectorParts.shift();
                if (selectorModifier === ".") {
                    element = element.classed(selectorItem, true);
                } else if (selectorModifier === "#") {
                    element = element.attr('id', selectorItem);
                }
            }
            return element;
        }
    }, {
        key: 'insertSelector',
        value: function insertSelector(parent, selector, before) {
            return Utils.insertOrAppendSelector(parent, selector, "insert", before);
        }
    }, {
        key: 'appendSelector',
        value: function appendSelector(parent, selector) {
            return Utils.insertOrAppendSelector(parent, selector, "append");
        }
    }, {
        key: 'selectOrAppend',
        value: function selectOrAppend(parent, selector, element) {
            var selection = parent.select(selector);
            if (selection.empty()) {
                if (element) {
                    return parent.append(element);
                }
                return Utils.appendSelector(parent, selector);
            }
            return selection;
        }
    }, {
        key: 'selectOrInsert',
        value: function selectOrInsert(parent, selector, before) {
            var selection = parent.select(selector);
            if (selection.empty()) {
                return Utils.insertSelector(parent, selector, before);
            }
            return selection;
        }
    }, {
        key: 'linearGradient',
        value: function linearGradient(svg, gradientId, range, x1, y1, x2, y2) {
            var defs = Utils.selectOrAppend(svg, "defs");
            var linearGradient = defs.append("linearGradient").attr("id", gradientId);

            linearGradient.attr("x1", x1 + "%").attr("y1", y1 + "%").attr("x2", x2 + "%").attr("y2", y2 + "%");

            //Append multiple color stops by using D3's data/enter step
            var stops = linearGradient.selectAll("stop").data(range);

            stops.enter().append("stop");

            stops.attr("offset", function (d, i) {
                return i / (range.length - 1);
            }).attr("stop-color", function (d) {
                return d;
            });

            stops.exit().remove();
        }
    }, {
        key: 'guid',
        value: function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }

            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }

        //places textString in textObj, adds an ellipsis if text can't fit in width

    }, {
        key: 'placeTextWithEllipsis',
        value: function placeTextWithEllipsis(textD3Obj, textString, width) {
            var textObj = textD3Obj.node();
            textObj.textContent = textString;

            var margin = 0;
            var ellipsisLength = 9;
            //ellipsis is needed
            if (textObj.getComputedTextLength() > width + margin) {
                for (var x = textString.length - 3; x > 0; x -= 1) {
                    if (textObj.getSubStringLength(0, x) + ellipsisLength <= width + margin) {
                        textObj.textContent = textString.substring(0, x) + "...";
                        return true;
                    }
                }
                textObj.textContent = "..."; //can't place at all
                return true;
            }
            return false;
        }
    }, {
        key: 'placeTextWithEllipsisAndTooltip',
        value: function placeTextWithEllipsisAndTooltip(textD3Obj, textString, width, tooltip) {
            var ellipsisPlaced = Utils.placeTextWithEllipsis(textD3Obj, textString, width);
            if (ellipsisPlaced && tooltip) {
                textD3Obj.on("mouseover", function (d) {
                    tooltip.transition().duration(200).style("opacity", .9);
                    tooltip.html(textString).style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");
                });

                textD3Obj.on("mouseout", function (d) {
                    tooltip.transition().duration(500).style("opacity", 0);
                });
            }
        }
    }, {
        key: 'getFontSize',
        value: function getFontSize(element) {
            return window.getComputedStyle(element, null).getPropertyValue("font-size");
        }
    }]);

    return Utils;
}();

Utils.SQRT_2 = 1.41421356237;

Utils.sanitizeHeight = function (height, container) {
    return height || parseInt(container.style('height'), 10) || 400;
};

Utils.sanitizeWidth = function (width, container) {
    return width || parseInt(container.style('width'), 10) || 960;
};

Utils.availableHeight = function (height, container, margin) {
    return Math.max(0, Utils.sanitizeHeight(height, container) - margin.top - margin.bottom);
};

Utils.availableWidth = function (width, container, margin) {
    return Math.max(0, Utils.sanitizeWidth(width, container) - margin.left - margin.right);
};

},{}]},{},[32])(32)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJib3dlcl9jb21wb25lbnRzXFxkMy1sZWdlbmRcXG5vLWV4dGVuZC5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxjb2xvci5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxsZWdlbmQuanMiLCJib3dlcl9jb21wb25lbnRzXFxkMy1sZWdlbmRcXHNyY1xcc2l6ZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxzeW1ib2wuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxlcnJvcl9mdW5jdGlvbi5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXGxpbmVhcl9yZWdyZXNzaW9uLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcbGluZWFyX3JlZ3Jlc3Npb25fbGluZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXG1lYW4uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxxdWFudGlsZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXHF1YW50aWxlX3NvcnRlZC5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXHF1aWNrc2VsZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc2FtcGxlX2NvcnJlbGF0aW9uLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc2FtcGxlX2NvdmFyaWFuY2UuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfc3RhbmRhcmRfZGV2aWF0aW9uLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc2FtcGxlX3ZhcmlhbmNlLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc3RhbmRhcmRfZGV2aWF0aW9uLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc3VtLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc3VtX250aF9wb3dlcl9kZXZpYXRpb25zLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcdmFyaWFuY2UuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFx6X3Njb3JlLmpzIiwic3JjXFxiYXItY2hhcnQuanMiLCJzcmNcXGJveC1wbG90LWJhc2UuanMiLCJzcmNcXGJveC1wbG90LmpzIiwic3JjXFxjaGFydC13aXRoLWNvbG9yLWdyb3Vwcy5qcyIsInNyY1xcY2hhcnQuanMiLCJzcmNcXGNvcnJlbGF0aW9uLW1hdHJpeC5qcyIsInNyY1xcZDMtZXh0ZW5zaW9ucy5qcyIsInNyY1xcaGVhdG1hcC10aW1lc2VyaWVzLmpzIiwic3JjXFxoZWF0bWFwLmpzIiwic3JjXFxoaXN0b2dyYW0uanMiLCJzcmNcXGluZGV4LmpzIiwic3JjXFxsZWdlbmQuanMiLCJzcmNcXHJlZ3Jlc3Npb24uanMiLCJzcmNcXHNjYXR0ZXJwbG90LW1hdHJpeC5qcyIsInNyY1xcc2NhdHRlcnBsb3QuanMiLCJzcmNcXHN0YXRpc3RpY3MtZGlzdHJpYnV0aW9ucy5qcyIsInNyY1xcc3RhdGlzdGljcy11dGlscy5qcyIsInNyY1xcdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQjtBQUNmLFNBQU8sUUFBUSxhQUFSLENBRFE7QUFFZixRQUFNLFFBQVEsWUFBUixDQUZT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QXZDLENBQXdELFdBQXhELENBQVA7QUFDSDs7Ozs7O0FBNVBRLEssQ0FDRixNLEdBQVMsYTs7QUFEUCxLLENBcUxGLGMsR0FBaUIsVUFBVSxNQUFWLEVBQWtCLFNBQWxCLEVBQTZCO0FBQ2pELFdBQVEsVUFBVSxTQUFTLFVBQVUsS0FBVixDQUFnQixRQUFoQixDQUFULEVBQW9DLEVBQXBDLENBQVYsSUFBcUQsR0FBN0Q7QUFDSCxDOztBQXZMUSxLLENBeUxGLGEsR0FBZ0IsVUFBVSxLQUFWLEVBQWlCLFNBQWpCLEVBQTRCO0FBQy9DLFdBQVEsU0FBUyxTQUFTLFVBQVUsS0FBVixDQUFnQixPQUFoQixDQUFULEVBQW1DLEVBQW5DLENBQVQsSUFBbUQsR0FBM0Q7QUFDSCxDOztBQTNMUSxLLENBNkxGLGUsR0FBa0IsVUFBVSxNQUFWLEVBQWtCLFNBQWxCLEVBQTZCLE1BQTdCLEVBQXFDO0FBQzFELFdBQU8sS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLE1BQU0sY0FBTixDQUFxQixNQUFyQixFQUE2QixTQUE3QixJQUEwQyxPQUFPLEdBQWpELEdBQXVELE9BQU8sTUFBMUUsQ0FBUDtBQUNILEM7O0FBL0xRLEssQ0FpTUYsYyxHQUFpQixVQUFVLEtBQVYsRUFBaUIsU0FBakIsRUFBNEIsTUFBNUIsRUFBb0M7QUFDeEQsV0FBTyxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksTUFBTSxhQUFOLENBQW9CLEtBQXBCLEVBQTJCLFNBQTNCLElBQXdDLE9BQU8sSUFBL0MsR0FBc0QsT0FBTyxLQUF6RSxDQUFQO0FBQ0gsQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICBjb2xvcjogcmVxdWlyZSgnLi9zcmMvY29sb3InKSxcclxuICBzaXplOiByZXF1aXJlKCcuL3NyYy9zaXplJyksXHJcbiAgc3ltYm9sOiByZXF1aXJlKCcuL3NyYy9zeW1ib2wnKVxyXG59O1xyXG4iLCJ2YXIgaGVscGVyID0gcmVxdWlyZSgnLi9sZWdlbmQnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgdmFyIHNjYWxlID0gZDMuc2NhbGUubGluZWFyKCksXHJcbiAgICBzaGFwZSA9IFwicmVjdFwiLFxyXG4gICAgc2hhcGVXaWR0aCA9IDE1LFxyXG4gICAgc2hhcGVIZWlnaHQgPSAxNSxcclxuICAgIHNoYXBlUmFkaXVzID0gMTAsXHJcbiAgICBzaGFwZVBhZGRpbmcgPSAyLFxyXG4gICAgY2VsbHMgPSBbNV0sXHJcbiAgICBsYWJlbHMgPSBbXSxcclxuICAgIGNsYXNzUHJlZml4ID0gXCJcIixcclxuICAgIHVzZUNsYXNzID0gZmFsc2UsXHJcbiAgICB0aXRsZSA9IFwiXCIsXHJcbiAgICBsYWJlbEZvcm1hdCA9IGQzLmZvcm1hdChcIi4wMWZcIiksXHJcbiAgICBsYWJlbE9mZnNldCA9IDEwLFxyXG4gICAgbGFiZWxBbGlnbiA9IFwibWlkZGxlXCIsXHJcbiAgICBsYWJlbERlbGltaXRlciA9IFwidG9cIixcclxuICAgIG9yaWVudCA9IFwidmVydGljYWxcIixcclxuICAgIGFzY2VuZGluZyA9IGZhbHNlLFxyXG4gICAgcGF0aCxcclxuICAgIGxlZ2VuZERpc3BhdGNoZXIgPSBkMy5kaXNwYXRjaChcImNlbGxvdmVyXCIsIFwiY2VsbG91dFwiLCBcImNlbGxjbGlja1wiKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsZWdlbmQoc3ZnKXtcclxuXHJcbiAgICAgIHZhciB0eXBlID0gaGVscGVyLmQzX2NhbGNUeXBlKHNjYWxlLCBhc2NlbmRpbmcsIGNlbGxzLCBsYWJlbHMsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlciksXHJcbiAgICAgICAgbGVnZW5kRyA9IHN2Zy5zZWxlY3RBbGwoJ2cnKS5kYXRhKFtzY2FsZV0pO1xyXG5cclxuICAgICAgbGVnZW5kRy5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgY2xhc3NQcmVmaXggKyAnbGVnZW5kQ2VsbHMnKTtcclxuXHJcblxyXG4gICAgICB2YXIgY2VsbCA9IGxlZ2VuZEcuc2VsZWN0QWxsKFwiLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGxcIikuZGF0YSh0eXBlLmRhdGEpLFxyXG4gICAgICAgIGNlbGxFbnRlciA9IGNlbGwuZW50ZXIoKS5hcHBlbmQoXCJnXCIsIFwiLmNlbGxcIikuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJjZWxsXCIpLnN0eWxlKFwib3BhY2l0eVwiLCAxZS02KSxcclxuICAgICAgICBzaGFwZUVudGVyID0gY2VsbEVudGVyLmFwcGVuZChzaGFwZSkuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJzd2F0Y2hcIiksXHJcbiAgICAgICAgc2hhcGVzID0gY2VsbC5zZWxlY3QoXCJnLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGwgXCIgKyBzaGFwZSk7XHJcblxyXG4gICAgICAvL2FkZCBldmVudCBoYW5kbGVyc1xyXG4gICAgICBoZWxwZXIuZDNfYWRkRXZlbnRzKGNlbGxFbnRlciwgbGVnZW5kRGlzcGF0Y2hlcik7XHJcblxyXG4gICAgICBjZWxsLmV4aXQoKS50cmFuc2l0aW9uKCkuc3R5bGUoXCJvcGFjaXR5XCIsIDApLnJlbW92ZSgpO1xyXG5cclxuICAgICAgaGVscGVyLmQzX2RyYXdTaGFwZXMoc2hhcGUsIHNoYXBlcywgc2hhcGVIZWlnaHQsIHNoYXBlV2lkdGgsIHNoYXBlUmFkaXVzLCBwYXRoKTtcclxuXHJcbiAgICAgIGhlbHBlci5kM19hZGRUZXh0KGxlZ2VuZEcsIGNlbGxFbnRlciwgdHlwZS5sYWJlbHMsIGNsYXNzUHJlZml4KVxyXG5cclxuICAgICAgLy8gc2V0cyBwbGFjZW1lbnRcclxuICAgICAgdmFyIHRleHQgPSBjZWxsLnNlbGVjdChcInRleHRcIiksXHJcbiAgICAgICAgc2hhcGVTaXplID0gc2hhcGVzWzBdLm1hcCggZnVuY3Rpb24oZCl7IHJldHVybiBkLmdldEJCb3goKTsgfSk7XHJcblxyXG4gICAgICAvL3NldHMgc2NhbGVcclxuICAgICAgLy9ldmVyeXRoaW5nIGlzIGZpbGwgZXhjZXB0IGZvciBsaW5lIHdoaWNoIGlzIHN0cm9rZSxcclxuICAgICAgaWYgKCF1c2VDbGFzcyl7XHJcbiAgICAgICAgaWYgKHNoYXBlID09IFwibGluZVwiKXtcclxuICAgICAgICAgIHNoYXBlcy5zdHlsZShcInN0cm9rZVwiLCB0eXBlLmZlYXR1cmUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzaGFwZXMuc3R5bGUoXCJmaWxsXCIsIHR5cGUuZmVhdHVyZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNoYXBlcy5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCl7IHJldHVybiBjbGFzc1ByZWZpeCArIFwic3dhdGNoIFwiICsgdHlwZS5mZWF0dXJlKGQpOyB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGNlbGxUcmFucyxcclxuICAgICAgdGV4dFRyYW5zLFxyXG4gICAgICB0ZXh0QWxpZ24gPSAobGFiZWxBbGlnbiA9PSBcInN0YXJ0XCIpID8gMCA6IChsYWJlbEFsaWduID09IFwibWlkZGxlXCIpID8gMC41IDogMTtcclxuXHJcbiAgICAgIC8vcG9zaXRpb25zIGNlbGxzIGFuZCB0ZXh0XHJcbiAgICAgIGlmIChvcmllbnQgPT09IFwidmVydGljYWxcIil7XHJcbiAgICAgICAgY2VsbFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZSgwLCBcIiArIChpICogKHNoYXBlU2l6ZVtpXS5oZWlnaHQgKyBzaGFwZVBhZGRpbmcpKSArIFwiKVwiOyB9O1xyXG4gICAgICAgIHRleHRUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAoc2hhcGVTaXplW2ldLndpZHRoICsgc2hhcGVTaXplW2ldLnggK1xyXG4gICAgICAgICAgbGFiZWxPZmZzZXQpICsgXCIsXCIgKyAoc2hhcGVTaXplW2ldLnkgKyBzaGFwZVNpemVbaV0uaGVpZ2h0LzIgKyA1KSArIFwiKVwiOyB9O1xyXG5cclxuICAgICAgfSBlbHNlIGlmIChvcmllbnQgPT09IFwiaG9yaXpvbnRhbFwiKXtcclxuICAgICAgICBjZWxsVHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKGkgKiAoc2hhcGVTaXplW2ldLndpZHRoICsgc2hhcGVQYWRkaW5nKSkgKyBcIiwwKVwiOyB9XHJcbiAgICAgICAgdGV4dFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIChzaGFwZVNpemVbaV0ud2lkdGgqdGV4dEFsaWduICArIHNoYXBlU2l6ZVtpXS54KSArXHJcbiAgICAgICAgICBcIixcIiArIChzaGFwZVNpemVbaV0uaGVpZ2h0ICsgc2hhcGVTaXplW2ldLnkgKyBsYWJlbE9mZnNldCArIDgpICsgXCIpXCI7IH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGhlbHBlci5kM19wbGFjZW1lbnQob3JpZW50LCBjZWxsLCBjZWxsVHJhbnMsIHRleHQsIHRleHRUcmFucywgbGFiZWxBbGlnbik7XHJcbiAgICAgIGhlbHBlci5kM190aXRsZShzdmcsIGxlZ2VuZEcsIHRpdGxlLCBjbGFzc1ByZWZpeCk7XHJcblxyXG4gICAgICBjZWxsLnRyYW5zaXRpb24oKS5zdHlsZShcIm9wYWNpdHlcIiwgMSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gIGxlZ2VuZC5zY2FsZSA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNjYWxlO1xyXG4gICAgc2NhbGUgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuY2VsbHMgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBjZWxscztcclxuICAgIGlmIChfLmxlbmd0aCA+IDEgfHwgXyA+PSAyICl7XHJcbiAgICAgIGNlbGxzID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlID0gZnVuY3Rpb24oXywgZCkge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGU7XHJcbiAgICBpZiAoXyA9PSBcInJlY3RcIiB8fCBfID09IFwiY2lyY2xlXCIgfHwgXyA9PSBcImxpbmVcIiB8fCAoXyA9PSBcInBhdGhcIiAmJiAodHlwZW9mIGQgPT09ICdzdHJpbmcnKSkgKXtcclxuICAgICAgc2hhcGUgPSBfO1xyXG4gICAgICBwYXRoID0gZDtcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlV2lkdGggPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZVdpZHRoO1xyXG4gICAgc2hhcGVXaWR0aCA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuc2hhcGVIZWlnaHQgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZUhlaWdodDtcclxuICAgIHNoYXBlSGVpZ2h0ID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5zaGFwZVJhZGl1cyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlUmFkaXVzO1xyXG4gICAgc2hhcGVSYWRpdXMgPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlUGFkZGluZyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlUGFkZGluZztcclxuICAgIHNoYXBlUGFkZGluZyA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxzID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxzO1xyXG4gICAgbGFiZWxzID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsQWxpZ24gPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbEFsaWduO1xyXG4gICAgaWYgKF8gPT0gXCJzdGFydFwiIHx8IF8gPT0gXCJlbmRcIiB8fCBfID09IFwibWlkZGxlXCIpIHtcclxuICAgICAgbGFiZWxBbGlnbiA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbEZvcm1hdCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsRm9ybWF0O1xyXG4gICAgbGFiZWxGb3JtYXQgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxPZmZzZXQgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbE9mZnNldDtcclxuICAgIGxhYmVsT2Zmc2V0ID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbERlbGltaXRlciA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsRGVsaW1pdGVyO1xyXG4gICAgbGFiZWxEZWxpbWl0ZXIgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQudXNlQ2xhc3MgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB1c2VDbGFzcztcclxuICAgIGlmIChfID09PSB0cnVlIHx8IF8gPT09IGZhbHNlKXtcclxuICAgICAgdXNlQ2xhc3MgPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQub3JpZW50ID0gZnVuY3Rpb24oXyl7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBvcmllbnQ7XHJcbiAgICBfID0gXy50b0xvd2VyQ2FzZSgpO1xyXG4gICAgaWYgKF8gPT0gXCJob3Jpem9udGFsXCIgfHwgXyA9PSBcInZlcnRpY2FsXCIpIHtcclxuICAgICAgb3JpZW50ID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmFzY2VuZGluZyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGFzY2VuZGluZztcclxuICAgIGFzY2VuZGluZyA9ICEhXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmNsYXNzUHJlZml4ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY2xhc3NQcmVmaXg7XHJcbiAgICBjbGFzc1ByZWZpeCA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC50aXRsZSA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHRpdGxlO1xyXG4gICAgdGl0bGUgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBkMy5yZWJpbmQobGVnZW5kLCBsZWdlbmREaXNwYXRjaGVyLCBcIm9uXCIpO1xyXG5cclxuICByZXR1cm4gbGVnZW5kO1xyXG5cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gIGQzX2lkZW50aXR5OiBmdW5jdGlvbiAoZCkge1xyXG4gICAgcmV0dXJuIGQ7XHJcbiAgfSxcclxuXHJcbiAgZDNfbWVyZ2VMYWJlbHM6IGZ1bmN0aW9uIChnZW4sIGxhYmVscykge1xyXG5cclxuICAgICAgaWYobGFiZWxzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGdlbjtcclxuXHJcbiAgICAgIGdlbiA9IChnZW4pID8gZ2VuIDogW107XHJcblxyXG4gICAgICB2YXIgaSA9IGxhYmVscy5sZW5ndGg7XHJcbiAgICAgIGZvciAoOyBpIDwgZ2VuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGFiZWxzLnB1c2goZ2VuW2ldKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbGFiZWxzO1xyXG4gICAgfSxcclxuXHJcbiAgZDNfbGluZWFyTGVnZW5kOiBmdW5jdGlvbiAoc2NhbGUsIGNlbGxzLCBsYWJlbEZvcm1hdCkge1xyXG4gICAgdmFyIGRhdGEgPSBbXTtcclxuXHJcbiAgICBpZiAoY2VsbHMubGVuZ3RoID4gMSl7XHJcbiAgICAgIGRhdGEgPSBjZWxscztcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgZG9tYWluID0gc2NhbGUuZG9tYWluKCksXHJcbiAgICAgIGluY3JlbWVudCA9IChkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdIC0gZG9tYWluWzBdKS8oY2VsbHMgLSAxKSxcclxuICAgICAgaSA9IDA7XHJcblxyXG4gICAgICBmb3IgKDsgaSA8IGNlbGxzOyBpKyspe1xyXG4gICAgICAgIGRhdGEucHVzaChkb21haW5bMF0gKyBpKmluY3JlbWVudCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgbGFiZWxzID0gZGF0YS5tYXAobGFiZWxGb3JtYXQpO1xyXG5cclxuICAgIHJldHVybiB7ZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgbGFiZWxzOiBsYWJlbHMsXHJcbiAgICAgICAgICAgIGZlYXR1cmU6IGZ1bmN0aW9uKGQpeyByZXR1cm4gc2NhbGUoZCk7IH19O1xyXG4gIH0sXHJcblxyXG4gIGQzX3F1YW50TGVnZW5kOiBmdW5jdGlvbiAoc2NhbGUsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlcikge1xyXG4gICAgdmFyIGxhYmVscyA9IHNjYWxlLnJhbmdlKCkubWFwKGZ1bmN0aW9uKGQpe1xyXG4gICAgICB2YXIgaW52ZXJ0ID0gc2NhbGUuaW52ZXJ0RXh0ZW50KGQpLFxyXG4gICAgICBhID0gbGFiZWxGb3JtYXQoaW52ZXJ0WzBdKSxcclxuICAgICAgYiA9IGxhYmVsRm9ybWF0KGludmVydFsxXSk7XHJcblxyXG4gICAgICAvLyBpZiAoKCAoYSkgJiYgKGEuaXNOYW4oKSkgJiYgYil7XHJcbiAgICAgIC8vICAgY29uc29sZS5sb2coXCJpbiBpbml0aWFsIHN0YXRlbWVudFwiKVxyXG4gICAgICAgIHJldHVybiBsYWJlbEZvcm1hdChpbnZlcnRbMF0pICsgXCIgXCIgKyBsYWJlbERlbGltaXRlciArIFwiIFwiICsgbGFiZWxGb3JtYXQoaW52ZXJ0WzFdKTtcclxuICAgICAgLy8gfSBlbHNlIGlmIChhIHx8IGIpIHtcclxuICAgICAgLy8gICBjb25zb2xlLmxvZygnaW4gZWxzZSBzdGF0ZW1lbnQnKVxyXG4gICAgICAvLyAgIHJldHVybiAoYSkgPyBhIDogYjtcclxuICAgICAgLy8gfVxyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7ZGF0YTogc2NhbGUucmFuZ2UoKSxcclxuICAgICAgICAgICAgbGFiZWxzOiBsYWJlbHMsXHJcbiAgICAgICAgICAgIGZlYXR1cmU6IHRoaXMuZDNfaWRlbnRpdHlcclxuICAgICAgICAgIH07XHJcbiAgfSxcclxuXHJcbiAgZDNfb3JkaW5hbExlZ2VuZDogZnVuY3Rpb24gKHNjYWxlKSB7XHJcbiAgICByZXR1cm4ge2RhdGE6IHNjYWxlLmRvbWFpbigpLFxyXG4gICAgICAgICAgICBsYWJlbHM6IHNjYWxlLmRvbWFpbigpLFxyXG4gICAgICAgICAgICBmZWF0dXJlOiBmdW5jdGlvbihkKXsgcmV0dXJuIHNjYWxlKGQpOyB9fTtcclxuICB9LFxyXG5cclxuICBkM19kcmF3U2hhcGVzOiBmdW5jdGlvbiAoc2hhcGUsIHNoYXBlcywgc2hhcGVIZWlnaHQsIHNoYXBlV2lkdGgsIHNoYXBlUmFkaXVzLCBwYXRoKSB7XHJcbiAgICBpZiAoc2hhcGUgPT09IFwicmVjdFwiKXtcclxuICAgICAgICBzaGFwZXMuYXR0cihcImhlaWdodFwiLCBzaGFwZUhlaWdodCkuYXR0cihcIndpZHRoXCIsIHNoYXBlV2lkdGgpO1xyXG5cclxuICAgIH0gZWxzZSBpZiAoc2hhcGUgPT09IFwiY2lyY2xlXCIpIHtcclxuICAgICAgICBzaGFwZXMuYXR0cihcInJcIiwgc2hhcGVSYWRpdXMpLy8uYXR0cihcImN4XCIsIHNoYXBlUmFkaXVzKS5hdHRyKFwiY3lcIiwgc2hhcGVSYWRpdXMpO1xyXG5cclxuICAgIH0gZWxzZSBpZiAoc2hhcGUgPT09IFwibGluZVwiKSB7XHJcbiAgICAgICAgc2hhcGVzLmF0dHIoXCJ4MVwiLCAwKS5hdHRyKFwieDJcIiwgc2hhcGVXaWR0aCkuYXR0cihcInkxXCIsIDApLmF0dHIoXCJ5MlwiLCAwKTtcclxuXHJcbiAgICB9IGVsc2UgaWYgKHNoYXBlID09PSBcInBhdGhcIikge1xyXG4gICAgICBzaGFwZXMuYXR0cihcImRcIiwgcGF0aCk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZDNfYWRkVGV4dDogZnVuY3Rpb24gKHN2ZywgZW50ZXIsIGxhYmVscywgY2xhc3NQcmVmaXgpe1xyXG4gICAgZW50ZXIuYXBwZW5kKFwidGV4dFwiKS5hdHRyKFwiY2xhc3NcIiwgY2xhc3NQcmVmaXggKyBcImxhYmVsXCIpO1xyXG4gICAgc3ZnLnNlbGVjdEFsbChcImcuXCIgKyBjbGFzc1ByZWZpeCArIFwiY2VsbCB0ZXh0XCIpLmRhdGEobGFiZWxzKS50ZXh0KHRoaXMuZDNfaWRlbnRpdHkpO1xyXG4gIH0sXHJcblxyXG4gIGQzX2NhbGNUeXBlOiBmdW5jdGlvbiAoc2NhbGUsIGFzY2VuZGluZywgY2VsbHMsIGxhYmVscywgbGFiZWxGb3JtYXQsIGxhYmVsRGVsaW1pdGVyKXtcclxuICAgIHZhciB0eXBlID0gc2NhbGUudGlja3MgP1xyXG4gICAgICAgICAgICB0aGlzLmQzX2xpbmVhckxlZ2VuZChzY2FsZSwgY2VsbHMsIGxhYmVsRm9ybWF0KSA6IHNjYWxlLmludmVydEV4dGVudCA/XHJcbiAgICAgICAgICAgIHRoaXMuZDNfcXVhbnRMZWdlbmQoc2NhbGUsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlcikgOiB0aGlzLmQzX29yZGluYWxMZWdlbmQoc2NhbGUpO1xyXG5cclxuICAgIHR5cGUubGFiZWxzID0gdGhpcy5kM19tZXJnZUxhYmVscyh0eXBlLmxhYmVscywgbGFiZWxzKTtcclxuXHJcbiAgICBpZiAoYXNjZW5kaW5nKSB7XHJcbiAgICAgIHR5cGUubGFiZWxzID0gdGhpcy5kM19yZXZlcnNlKHR5cGUubGFiZWxzKTtcclxuICAgICAgdHlwZS5kYXRhID0gdGhpcy5kM19yZXZlcnNlKHR5cGUuZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHR5cGU7XHJcbiAgfSxcclxuXHJcbiAgZDNfcmV2ZXJzZTogZnVuY3Rpb24oYXJyKSB7XHJcbiAgICB2YXIgbWlycm9yID0gW107XHJcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGFyci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgbWlycm9yW2ldID0gYXJyW2wtaS0xXTtcclxuICAgIH1cclxuICAgIHJldHVybiBtaXJyb3I7XHJcbiAgfSxcclxuXHJcbiAgZDNfcGxhY2VtZW50OiBmdW5jdGlvbiAob3JpZW50LCBjZWxsLCBjZWxsVHJhbnMsIHRleHQsIHRleHRUcmFucywgbGFiZWxBbGlnbikge1xyXG4gICAgY2VsbC5hdHRyKFwidHJhbnNmb3JtXCIsIGNlbGxUcmFucyk7XHJcbiAgICB0ZXh0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgdGV4dFRyYW5zKTtcclxuICAgIGlmIChvcmllbnQgPT09IFwiaG9yaXpvbnRhbFwiKXtcclxuICAgICAgdGV4dC5zdHlsZShcInRleHQtYW5jaG9yXCIsIGxhYmVsQWxpZ24pO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGQzX2FkZEV2ZW50czogZnVuY3Rpb24oY2VsbHMsIGRpc3BhdGNoZXIpe1xyXG4gICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgY2VsbHMub24oXCJtb3VzZW92ZXIubGVnZW5kXCIsIGZ1bmN0aW9uIChkKSB7IF8uZDNfY2VsbE92ZXIoZGlzcGF0Y2hlciwgZCwgdGhpcyk7IH0pXHJcbiAgICAgICAgICAub24oXCJtb3VzZW91dC5sZWdlbmRcIiwgZnVuY3Rpb24gKGQpIHsgXy5kM19jZWxsT3V0KGRpc3BhdGNoZXIsIGQsIHRoaXMpOyB9KVxyXG4gICAgICAgICAgLm9uKFwiY2xpY2subGVnZW5kXCIsIGZ1bmN0aW9uIChkKSB7IF8uZDNfY2VsbENsaWNrKGRpc3BhdGNoZXIsIGQsIHRoaXMpOyB9KTtcclxuICB9LFxyXG5cclxuICBkM19jZWxsT3ZlcjogZnVuY3Rpb24oY2VsbERpc3BhdGNoZXIsIGQsIG9iail7XHJcbiAgICBjZWxsRGlzcGF0Y2hlci5jZWxsb3Zlci5jYWxsKG9iaiwgZCk7XHJcbiAgfSxcclxuXHJcbiAgZDNfY2VsbE91dDogZnVuY3Rpb24oY2VsbERpc3BhdGNoZXIsIGQsIG9iail7XHJcbiAgICBjZWxsRGlzcGF0Y2hlci5jZWxsb3V0LmNhbGwob2JqLCBkKTtcclxuICB9LFxyXG5cclxuICBkM19jZWxsQ2xpY2s6IGZ1bmN0aW9uKGNlbGxEaXNwYXRjaGVyLCBkLCBvYmope1xyXG4gICAgY2VsbERpc3BhdGNoZXIuY2VsbGNsaWNrLmNhbGwob2JqLCBkKTtcclxuICB9LFxyXG5cclxuICBkM190aXRsZTogZnVuY3Rpb24oc3ZnLCBjZWxsc1N2ZywgdGl0bGUsIGNsYXNzUHJlZml4KXtcclxuICAgIGlmICh0aXRsZSAhPT0gXCJcIil7XHJcblxyXG4gICAgICB2YXIgdGl0bGVUZXh0ID0gc3ZnLnNlbGVjdEFsbCgndGV4dC4nICsgY2xhc3NQcmVmaXggKyAnbGVnZW5kVGl0bGUnKTtcclxuXHJcbiAgICAgIHRpdGxlVGV4dC5kYXRhKFt0aXRsZV0pXHJcbiAgICAgICAgLmVudGVyKClcclxuICAgICAgICAuYXBwZW5kKCd0ZXh0JylcclxuICAgICAgICAuYXR0cignY2xhc3MnLCBjbGFzc1ByZWZpeCArICdsZWdlbmRUaXRsZScpO1xyXG5cclxuICAgICAgICBzdmcuc2VsZWN0QWxsKCd0ZXh0LicgKyBjbGFzc1ByZWZpeCArICdsZWdlbmRUaXRsZScpXHJcbiAgICAgICAgICAgIC50ZXh0KHRpdGxlKVxyXG5cclxuICAgICAgdmFyIHlPZmZzZXQgPSBzdmcuc2VsZWN0KCcuJyArIGNsYXNzUHJlZml4ICsgJ2xlZ2VuZFRpdGxlJylcclxuICAgICAgICAgIC5tYXAoZnVuY3Rpb24oZCkgeyByZXR1cm4gZFswXS5nZXRCQm94KCkuaGVpZ2h0fSlbMF0sXHJcbiAgICAgIHhPZmZzZXQgPSAtY2VsbHNTdmcubWFwKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRbMF0uZ2V0QkJveCgpLnh9KVswXTtcclxuXHJcbiAgICAgIGNlbGxzU3ZnLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIHhPZmZzZXQgKyAnLCcgKyAoeU9mZnNldCArIDEwKSArICcpJyk7XHJcblxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJ2YXIgaGVscGVyID0gcmVxdWlyZSgnLi9sZWdlbmQnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gIGZ1bmN0aW9uKCl7XHJcblxyXG4gIHZhciBzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLFxyXG4gICAgc2hhcGUgPSBcInJlY3RcIixcclxuICAgIHNoYXBlV2lkdGggPSAxNSxcclxuICAgIHNoYXBlUGFkZGluZyA9IDIsXHJcbiAgICBjZWxscyA9IFs1XSxcclxuICAgIGxhYmVscyA9IFtdLFxyXG4gICAgdXNlU3Ryb2tlID0gZmFsc2UsXHJcbiAgICBjbGFzc1ByZWZpeCA9IFwiXCIsXHJcbiAgICB0aXRsZSA9IFwiXCIsXHJcbiAgICBsYWJlbEZvcm1hdCA9IGQzLmZvcm1hdChcIi4wMWZcIiksXHJcbiAgICBsYWJlbE9mZnNldCA9IDEwLFxyXG4gICAgbGFiZWxBbGlnbiA9IFwibWlkZGxlXCIsXHJcbiAgICBsYWJlbERlbGltaXRlciA9IFwidG9cIixcclxuICAgIG9yaWVudCA9IFwidmVydGljYWxcIixcclxuICAgIGFzY2VuZGluZyA9IGZhbHNlLFxyXG4gICAgcGF0aCxcclxuICAgIGxlZ2VuZERpc3BhdGNoZXIgPSBkMy5kaXNwYXRjaChcImNlbGxvdmVyXCIsIFwiY2VsbG91dFwiLCBcImNlbGxjbGlja1wiKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsZWdlbmQoc3ZnKXtcclxuXHJcbiAgICAgIHZhciB0eXBlID0gaGVscGVyLmQzX2NhbGNUeXBlKHNjYWxlLCBhc2NlbmRpbmcsIGNlbGxzLCBsYWJlbHMsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlciksXHJcbiAgICAgICAgbGVnZW5kRyA9IHN2Zy5zZWxlY3RBbGwoJ2cnKS5kYXRhKFtzY2FsZV0pO1xyXG5cclxuICAgICAgbGVnZW5kRy5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgY2xhc3NQcmVmaXggKyAnbGVnZW5kQ2VsbHMnKTtcclxuXHJcblxyXG4gICAgICB2YXIgY2VsbCA9IGxlZ2VuZEcuc2VsZWN0QWxsKFwiLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGxcIikuZGF0YSh0eXBlLmRhdGEpLFxyXG4gICAgICAgIGNlbGxFbnRlciA9IGNlbGwuZW50ZXIoKS5hcHBlbmQoXCJnXCIsIFwiLmNlbGxcIikuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJjZWxsXCIpLnN0eWxlKFwib3BhY2l0eVwiLCAxZS02KSxcclxuICAgICAgICBzaGFwZUVudGVyID0gY2VsbEVudGVyLmFwcGVuZChzaGFwZSkuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJzd2F0Y2hcIiksXHJcbiAgICAgICAgc2hhcGVzID0gY2VsbC5zZWxlY3QoXCJnLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGwgXCIgKyBzaGFwZSk7XHJcblxyXG4gICAgICAvL2FkZCBldmVudCBoYW5kbGVyc1xyXG4gICAgICBoZWxwZXIuZDNfYWRkRXZlbnRzKGNlbGxFbnRlciwgbGVnZW5kRGlzcGF0Y2hlcik7XHJcblxyXG4gICAgICBjZWxsLmV4aXQoKS50cmFuc2l0aW9uKCkuc3R5bGUoXCJvcGFjaXR5XCIsIDApLnJlbW92ZSgpO1xyXG5cclxuICAgICAgLy9jcmVhdGVzIHNoYXBlXHJcbiAgICAgIGlmIChzaGFwZSA9PT0gXCJsaW5lXCIpe1xyXG4gICAgICAgIGhlbHBlci5kM19kcmF3U2hhcGVzKHNoYXBlLCBzaGFwZXMsIDAsIHNoYXBlV2lkdGgpO1xyXG4gICAgICAgIHNoYXBlcy5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIHR5cGUuZmVhdHVyZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaGVscGVyLmQzX2RyYXdTaGFwZXMoc2hhcGUsIHNoYXBlcywgdHlwZS5mZWF0dXJlLCB0eXBlLmZlYXR1cmUsIHR5cGUuZmVhdHVyZSwgcGF0aCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGhlbHBlci5kM19hZGRUZXh0KGxlZ2VuZEcsIGNlbGxFbnRlciwgdHlwZS5sYWJlbHMsIGNsYXNzUHJlZml4KVxyXG5cclxuICAgICAgLy9zZXRzIHBsYWNlbWVudFxyXG4gICAgICB2YXIgdGV4dCA9IGNlbGwuc2VsZWN0KFwidGV4dFwiKSxcclxuICAgICAgICBzaGFwZVNpemUgPSBzaGFwZXNbMF0ubWFwKFxyXG4gICAgICAgICAgZnVuY3Rpb24oZCwgaSl7XHJcbiAgICAgICAgICAgIHZhciBiYm94ID0gZC5nZXRCQm94KClcclxuICAgICAgICAgICAgdmFyIHN0cm9rZSA9IHNjYWxlKHR5cGUuZGF0YVtpXSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2hhcGUgPT09IFwibGluZVwiICYmIG9yaWVudCA9PT0gXCJob3Jpem9udGFsXCIpIHtcclxuICAgICAgICAgICAgICBiYm94LmhlaWdodCA9IGJib3guaGVpZ2h0ICsgc3Ryb2tlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNoYXBlID09PSBcImxpbmVcIiAmJiBvcmllbnQgPT09IFwidmVydGljYWxcIil7XHJcbiAgICAgICAgICAgICAgYmJveC53aWR0aCA9IGJib3gud2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBiYm94O1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgdmFyIG1heEggPSBkMy5tYXgoc2hhcGVTaXplLCBmdW5jdGlvbihkKXsgcmV0dXJuIGQuaGVpZ2h0ICsgZC55OyB9KSxcclxuICAgICAgbWF4VyA9IGQzLm1heChzaGFwZVNpemUsIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC53aWR0aCArIGQueDsgfSk7XHJcblxyXG4gICAgICB2YXIgY2VsbFRyYW5zLFxyXG4gICAgICB0ZXh0VHJhbnMsXHJcbiAgICAgIHRleHRBbGlnbiA9IChsYWJlbEFsaWduID09IFwic3RhcnRcIikgPyAwIDogKGxhYmVsQWxpZ24gPT0gXCJtaWRkbGVcIikgPyAwLjUgOiAxO1xyXG5cclxuICAgICAgLy9wb3NpdGlvbnMgY2VsbHMgYW5kIHRleHRcclxuICAgICAgaWYgKG9yaWVudCA9PT0gXCJ2ZXJ0aWNhbFwiKXtcclxuXHJcbiAgICAgICAgY2VsbFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSBkMy5zdW0oc2hhcGVTaXplLnNsaWNlKDAsIGkgKyAxICksIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC5oZWlnaHQ7IH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoMCwgXCIgKyAoaGVpZ2h0ICsgaSpzaGFwZVBhZGRpbmcpICsgXCIpXCI7IH07XHJcblxyXG4gICAgICAgIHRleHRUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAobWF4VyArIGxhYmVsT2Zmc2V0KSArIFwiLFwiICtcclxuICAgICAgICAgIChzaGFwZVNpemVbaV0ueSArIHNoYXBlU2l6ZVtpXS5oZWlnaHQvMiArIDUpICsgXCIpXCI7IH07XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKG9yaWVudCA9PT0gXCJob3Jpem9udGFsXCIpe1xyXG4gICAgICAgIGNlbGxUcmFucyA9IGZ1bmN0aW9uKGQsaSkge1xyXG4gICAgICAgICAgICB2YXIgd2lkdGggPSBkMy5zdW0oc2hhcGVTaXplLnNsaWNlKDAsIGkgKyAxICksIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC53aWR0aDsgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArICh3aWR0aCArIGkqc2hhcGVQYWRkaW5nKSArIFwiLDApXCI7IH07XHJcblxyXG4gICAgICAgIHRleHRUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAoc2hhcGVTaXplW2ldLndpZHRoKnRleHRBbGlnbiAgKyBzaGFwZVNpemVbaV0ueCkgKyBcIixcIiArXHJcbiAgICAgICAgICAgICAgKG1heEggKyBsYWJlbE9mZnNldCApICsgXCIpXCI7IH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGhlbHBlci5kM19wbGFjZW1lbnQob3JpZW50LCBjZWxsLCBjZWxsVHJhbnMsIHRleHQsIHRleHRUcmFucywgbGFiZWxBbGlnbik7XHJcbiAgICAgIGhlbHBlci5kM190aXRsZShzdmcsIGxlZ2VuZEcsIHRpdGxlLCBjbGFzc1ByZWZpeCk7XHJcblxyXG4gICAgICBjZWxsLnRyYW5zaXRpb24oKS5zdHlsZShcIm9wYWNpdHlcIiwgMSk7XHJcblxyXG4gICAgfVxyXG5cclxuICBsZWdlbmQuc2NhbGUgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzY2FsZTtcclxuICAgIHNjYWxlID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmNlbGxzID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY2VsbHM7XHJcbiAgICBpZiAoXy5sZW5ndGggPiAxIHx8IF8gPj0gMiApe1xyXG4gICAgICBjZWxscyA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG5cclxuICBsZWdlbmQuc2hhcGUgPSBmdW5jdGlvbihfLCBkKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZTtcclxuICAgIGlmIChfID09IFwicmVjdFwiIHx8IF8gPT0gXCJjaXJjbGVcIiB8fCBfID09IFwibGluZVwiICl7XHJcbiAgICAgIHNoYXBlID0gXztcclxuICAgICAgcGF0aCA9IGQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5zaGFwZVdpZHRoID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGVXaWR0aDtcclxuICAgIHNoYXBlV2lkdGggPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlUGFkZGluZyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlUGFkZGluZztcclxuICAgIHNoYXBlUGFkZGluZyA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxzID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxzO1xyXG4gICAgbGFiZWxzID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsQWxpZ24gPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbEFsaWduO1xyXG4gICAgaWYgKF8gPT0gXCJzdGFydFwiIHx8IF8gPT0gXCJlbmRcIiB8fCBfID09IFwibWlkZGxlXCIpIHtcclxuICAgICAgbGFiZWxBbGlnbiA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbEZvcm1hdCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsRm9ybWF0O1xyXG4gICAgbGFiZWxGb3JtYXQgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxPZmZzZXQgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbE9mZnNldDtcclxuICAgIGxhYmVsT2Zmc2V0ID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbERlbGltaXRlciA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsRGVsaW1pdGVyO1xyXG4gICAgbGFiZWxEZWxpbWl0ZXIgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQub3JpZW50ID0gZnVuY3Rpb24oXyl7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBvcmllbnQ7XHJcbiAgICBfID0gXy50b0xvd2VyQ2FzZSgpO1xyXG4gICAgaWYgKF8gPT0gXCJob3Jpem9udGFsXCIgfHwgXyA9PSBcInZlcnRpY2FsXCIpIHtcclxuICAgICAgb3JpZW50ID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmFzY2VuZGluZyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGFzY2VuZGluZztcclxuICAgIGFzY2VuZGluZyA9ICEhXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmNsYXNzUHJlZml4ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY2xhc3NQcmVmaXg7XHJcbiAgICBjbGFzc1ByZWZpeCA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC50aXRsZSA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHRpdGxlO1xyXG4gICAgdGl0bGUgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBkMy5yZWJpbmQobGVnZW5kLCBsZWdlbmREaXNwYXRjaGVyLCBcIm9uXCIpO1xyXG5cclxuICByZXR1cm4gbGVnZW5kO1xyXG5cclxufTtcclxuIiwidmFyIGhlbHBlciA9IHJlcXVpcmUoJy4vbGVnZW5kJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XHJcblxyXG4gIHZhciBzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLFxyXG4gICAgc2hhcGUgPSBcInBhdGhcIixcclxuICAgIHNoYXBlV2lkdGggPSAxNSxcclxuICAgIHNoYXBlSGVpZ2h0ID0gMTUsXHJcbiAgICBzaGFwZVJhZGl1cyA9IDEwLFxyXG4gICAgc2hhcGVQYWRkaW5nID0gNSxcclxuICAgIGNlbGxzID0gWzVdLFxyXG4gICAgbGFiZWxzID0gW10sXHJcbiAgICBjbGFzc1ByZWZpeCA9IFwiXCIsXHJcbiAgICB1c2VDbGFzcyA9IGZhbHNlLFxyXG4gICAgdGl0bGUgPSBcIlwiLFxyXG4gICAgbGFiZWxGb3JtYXQgPSBkMy5mb3JtYXQoXCIuMDFmXCIpLFxyXG4gICAgbGFiZWxBbGlnbiA9IFwibWlkZGxlXCIsXHJcbiAgICBsYWJlbE9mZnNldCA9IDEwLFxyXG4gICAgbGFiZWxEZWxpbWl0ZXIgPSBcInRvXCIsXHJcbiAgICBvcmllbnQgPSBcInZlcnRpY2FsXCIsXHJcbiAgICBhc2NlbmRpbmcgPSBmYWxzZSxcclxuICAgIGxlZ2VuZERpc3BhdGNoZXIgPSBkMy5kaXNwYXRjaChcImNlbGxvdmVyXCIsIFwiY2VsbG91dFwiLCBcImNlbGxjbGlja1wiKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsZWdlbmQoc3ZnKXtcclxuXHJcbiAgICAgIHZhciB0eXBlID0gaGVscGVyLmQzX2NhbGNUeXBlKHNjYWxlLCBhc2NlbmRpbmcsIGNlbGxzLCBsYWJlbHMsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlciksXHJcbiAgICAgICAgbGVnZW5kRyA9IHN2Zy5zZWxlY3RBbGwoJ2cnKS5kYXRhKFtzY2FsZV0pO1xyXG5cclxuICAgICAgbGVnZW5kRy5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgY2xhc3NQcmVmaXggKyAnbGVnZW5kQ2VsbHMnKTtcclxuXHJcbiAgICAgIHZhciBjZWxsID0gbGVnZW5kRy5zZWxlY3RBbGwoXCIuXCIgKyBjbGFzc1ByZWZpeCArIFwiY2VsbFwiKS5kYXRhKHR5cGUuZGF0YSksXHJcbiAgICAgICAgY2VsbEVudGVyID0gY2VsbC5lbnRlcigpLmFwcGVuZChcImdcIiwgXCIuY2VsbFwiKS5hdHRyKFwiY2xhc3NcIiwgY2xhc3NQcmVmaXggKyBcImNlbGxcIikuc3R5bGUoXCJvcGFjaXR5XCIsIDFlLTYpLFxyXG4gICAgICAgIHNoYXBlRW50ZXIgPSBjZWxsRW50ZXIuYXBwZW5kKHNoYXBlKS5hdHRyKFwiY2xhc3NcIiwgY2xhc3NQcmVmaXggKyBcInN3YXRjaFwiKSxcclxuICAgICAgICBzaGFwZXMgPSBjZWxsLnNlbGVjdChcImcuXCIgKyBjbGFzc1ByZWZpeCArIFwiY2VsbCBcIiArIHNoYXBlKTtcclxuXHJcbiAgICAgIC8vYWRkIGV2ZW50IGhhbmRsZXJzXHJcbiAgICAgIGhlbHBlci5kM19hZGRFdmVudHMoY2VsbEVudGVyLCBsZWdlbmREaXNwYXRjaGVyKTtcclxuXHJcbiAgICAgIC8vcmVtb3ZlIG9sZCBzaGFwZXNcclxuICAgICAgY2VsbC5leGl0KCkudHJhbnNpdGlvbigpLnN0eWxlKFwib3BhY2l0eVwiLCAwKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgIGhlbHBlci5kM19kcmF3U2hhcGVzKHNoYXBlLCBzaGFwZXMsIHNoYXBlSGVpZ2h0LCBzaGFwZVdpZHRoLCBzaGFwZVJhZGl1cywgdHlwZS5mZWF0dXJlKTtcclxuICAgICAgaGVscGVyLmQzX2FkZFRleHQobGVnZW5kRywgY2VsbEVudGVyLCB0eXBlLmxhYmVscywgY2xhc3NQcmVmaXgpXHJcblxyXG4gICAgICAvLyBzZXRzIHBsYWNlbWVudFxyXG4gICAgICB2YXIgdGV4dCA9IGNlbGwuc2VsZWN0KFwidGV4dFwiKSxcclxuICAgICAgICBzaGFwZVNpemUgPSBzaGFwZXNbMF0ubWFwKCBmdW5jdGlvbihkKXsgcmV0dXJuIGQuZ2V0QkJveCgpOyB9KTtcclxuXHJcbiAgICAgIHZhciBtYXhIID0gZDMubWF4KHNoYXBlU2l6ZSwgZnVuY3Rpb24oZCl7IHJldHVybiBkLmhlaWdodDsgfSksXHJcbiAgICAgIG1heFcgPSBkMy5tYXgoc2hhcGVTaXplLCBmdW5jdGlvbihkKXsgcmV0dXJuIGQud2lkdGg7IH0pO1xyXG5cclxuICAgICAgdmFyIGNlbGxUcmFucyxcclxuICAgICAgdGV4dFRyYW5zLFxyXG4gICAgICB0ZXh0QWxpZ24gPSAobGFiZWxBbGlnbiA9PSBcInN0YXJ0XCIpID8gMCA6IChsYWJlbEFsaWduID09IFwibWlkZGxlXCIpID8gMC41IDogMTtcclxuXHJcbiAgICAgIC8vcG9zaXRpb25zIGNlbGxzIGFuZCB0ZXh0XHJcbiAgICAgIGlmIChvcmllbnQgPT09IFwidmVydGljYWxcIil7XHJcbiAgICAgICAgY2VsbFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZSgwLCBcIiArIChpICogKG1heEggKyBzaGFwZVBhZGRpbmcpKSArIFwiKVwiOyB9O1xyXG4gICAgICAgIHRleHRUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAobWF4VyArIGxhYmVsT2Zmc2V0KSArIFwiLFwiICtcclxuICAgICAgICAgICAgICAoc2hhcGVTaXplW2ldLnkgKyBzaGFwZVNpemVbaV0uaGVpZ2h0LzIgKyA1KSArIFwiKVwiOyB9O1xyXG5cclxuICAgICAgfSBlbHNlIGlmIChvcmllbnQgPT09IFwiaG9yaXpvbnRhbFwiKXtcclxuICAgICAgICBjZWxsVHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKGkgKiAobWF4VyArIHNoYXBlUGFkZGluZykpICsgXCIsMClcIjsgfTtcclxuICAgICAgICB0ZXh0VHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKHNoYXBlU2l6ZVtpXS53aWR0aCp0ZXh0QWxpZ24gICsgc2hhcGVTaXplW2ldLngpICsgXCIsXCIgK1xyXG4gICAgICAgICAgICAgIChtYXhIICsgbGFiZWxPZmZzZXQgKSArIFwiKVwiOyB9O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBoZWxwZXIuZDNfcGxhY2VtZW50KG9yaWVudCwgY2VsbCwgY2VsbFRyYW5zLCB0ZXh0LCB0ZXh0VHJhbnMsIGxhYmVsQWxpZ24pO1xyXG4gICAgICBoZWxwZXIuZDNfdGl0bGUoc3ZnLCBsZWdlbmRHLCB0aXRsZSwgY2xhc3NQcmVmaXgpO1xyXG4gICAgICBjZWxsLnRyYW5zaXRpb24oKS5zdHlsZShcIm9wYWNpdHlcIiwgMSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgbGVnZW5kLnNjYWxlID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2NhbGU7XHJcbiAgICBzY2FsZSA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5jZWxscyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGNlbGxzO1xyXG4gICAgaWYgKF8ubGVuZ3RoID4gMSB8fCBfID49IDIgKXtcclxuICAgICAgY2VsbHMgPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuc2hhcGVQYWRkaW5nID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGVQYWRkaW5nO1xyXG4gICAgc2hhcGVQYWRkaW5nID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbHMgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbHM7XHJcbiAgICBsYWJlbHMgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxBbGlnbiA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsQWxpZ247XHJcbiAgICBpZiAoXyA9PSBcInN0YXJ0XCIgfHwgXyA9PSBcImVuZFwiIHx8IF8gPT0gXCJtaWRkbGVcIikge1xyXG4gICAgICBsYWJlbEFsaWduID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsRm9ybWF0ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxGb3JtYXQ7XHJcbiAgICBsYWJlbEZvcm1hdCA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbE9mZnNldCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsT2Zmc2V0O1xyXG4gICAgbGFiZWxPZmZzZXQgPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsRGVsaW1pdGVyID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxEZWxpbWl0ZXI7XHJcbiAgICBsYWJlbERlbGltaXRlciA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5vcmllbnQgPSBmdW5jdGlvbihfKXtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIG9yaWVudDtcclxuICAgIF8gPSBfLnRvTG93ZXJDYXNlKCk7XHJcbiAgICBpZiAoXyA9PSBcImhvcml6b250YWxcIiB8fCBfID09IFwidmVydGljYWxcIikge1xyXG4gICAgICBvcmllbnQgPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuYXNjZW5kaW5nID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gYXNjZW5kaW5nO1xyXG4gICAgYXNjZW5kaW5nID0gISFfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuY2xhc3NQcmVmaXggPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBjbGFzc1ByZWZpeDtcclxuICAgIGNsYXNzUHJlZml4ID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnRpdGxlID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdGl0bGU7XHJcbiAgICB0aXRsZSA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGQzLnJlYmluZChsZWdlbmQsIGxlZ2VuZERpc3BhdGNoZXIsIFwib25cIik7XHJcblxyXG4gIHJldHVybiBsZWdlbmQ7XHJcblxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG4vKipcclxuICogKipbR2F1c3NpYW4gZXJyb3IgZnVuY3Rpb25dKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRXJyb3JfZnVuY3Rpb24pKipcclxuICpcclxuICogVGhlIGBlcnJvckZ1bmN0aW9uKHgvKHNkICogTWF0aC5zcXJ0KDIpKSlgIGlzIHRoZSBwcm9iYWJpbGl0eSB0aGF0IGEgdmFsdWUgaW4gYVxyXG4gKiBub3JtYWwgZGlzdHJpYnV0aW9uIHdpdGggc3RhbmRhcmQgZGV2aWF0aW9uIHNkIGlzIHdpdGhpbiB4IG9mIHRoZSBtZWFuLlxyXG4gKlxyXG4gKiBUaGlzIGZ1bmN0aW9uIHJldHVybnMgYSBudW1lcmljYWwgYXBwcm94aW1hdGlvbiB0byB0aGUgZXhhY3QgdmFsdWUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4IGlucHV0XHJcbiAqIEByZXR1cm4ge251bWJlcn0gZXJyb3IgZXN0aW1hdGlvblxyXG4gKiBAZXhhbXBsZVxyXG4gKiBlcnJvckZ1bmN0aW9uKDEpOyAvLz0gMC44NDI3XHJcbiAqL1xyXG5mdW5jdGlvbiBlcnJvckZ1bmN0aW9uKHgvKjogbnVtYmVyICovKS8qOiBudW1iZXIgKi8ge1xyXG4gICAgdmFyIHQgPSAxIC8gKDEgKyAwLjUgKiBNYXRoLmFicyh4KSk7XHJcbiAgICB2YXIgdGF1ID0gdCAqIE1hdGguZXhwKC1NYXRoLnBvdyh4LCAyKSAtXHJcbiAgICAgICAgMS4yNjU1MTIyMyArXHJcbiAgICAgICAgMS4wMDAwMjM2OCAqIHQgK1xyXG4gICAgICAgIDAuMzc0MDkxOTYgKiBNYXRoLnBvdyh0LCAyKSArXHJcbiAgICAgICAgMC4wOTY3ODQxOCAqIE1hdGgucG93KHQsIDMpIC1cclxuICAgICAgICAwLjE4NjI4ODA2ICogTWF0aC5wb3codCwgNCkgK1xyXG4gICAgICAgIDAuMjc4ODY4MDcgKiBNYXRoLnBvdyh0LCA1KSAtXHJcbiAgICAgICAgMS4xMzUyMDM5OCAqIE1hdGgucG93KHQsIDYpICtcclxuICAgICAgICAxLjQ4ODUxNTg3ICogTWF0aC5wb3codCwgNykgLVxyXG4gICAgICAgIDAuODIyMTUyMjMgKiBNYXRoLnBvdyh0LCA4KSArXHJcbiAgICAgICAgMC4xNzA4NzI3NyAqIE1hdGgucG93KHQsIDkpKTtcclxuICAgIGlmICh4ID49IDApIHtcclxuICAgICAgICByZXR1cm4gMSAtIHRhdTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRhdSAtIDE7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZXJyb3JGdW5jdGlvbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxuLyoqXHJcbiAqIFtTaW1wbGUgbGluZWFyIHJlZ3Jlc3Npb25dKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvU2ltcGxlX2xpbmVhcl9yZWdyZXNzaW9uKVxyXG4gKiBpcyBhIHNpbXBsZSB3YXkgdG8gZmluZCBhIGZpdHRlZCBsaW5lXHJcbiAqIGJldHdlZW4gYSBzZXQgb2YgY29vcmRpbmF0ZXMuIFRoaXMgYWxnb3JpdGhtIGZpbmRzIHRoZSBzbG9wZSBhbmQgeS1pbnRlcmNlcHQgb2YgYSByZWdyZXNzaW9uIGxpbmVcclxuICogdXNpbmcgdGhlIGxlYXN0IHN1bSBvZiBzcXVhcmVzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PEFycmF5PG51bWJlcj4+fSBkYXRhIGFuIGFycmF5IG9mIHR3by1lbGVtZW50IG9mIGFycmF5cyxcclxuICogbGlrZSBgW1swLCAxXSwgWzIsIDNdXWBcclxuICogQHJldHVybnMge09iamVjdH0gb2JqZWN0IGNvbnRhaW5pbmcgc2xvcGUgYW5kIGludGVyc2VjdCBvZiByZWdyZXNzaW9uIGxpbmVcclxuICogQGV4YW1wbGVcclxuICogbGluZWFyUmVncmVzc2lvbihbWzAsIDBdLCBbMSwgMV1dKTsgLy8geyBtOiAxLCBiOiAwIH1cclxuICovXHJcbmZ1bmN0aW9uIGxpbmVhclJlZ3Jlc3Npb24oZGF0YS8qOiBBcnJheTxBcnJheTxudW1iZXI+PiAqLykvKjogeyBtOiBudW1iZXIsIGI6IG51bWJlciB9ICovIHtcclxuXHJcbiAgICB2YXIgbSwgYjtcclxuXHJcbiAgICAvLyBTdG9yZSBkYXRhIGxlbmd0aCBpbiBhIGxvY2FsIHZhcmlhYmxlIHRvIHJlZHVjZVxyXG4gICAgLy8gcmVwZWF0ZWQgb2JqZWN0IHByb3BlcnR5IGxvb2t1cHNcclxuICAgIHZhciBkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGg7XHJcblxyXG4gICAgLy9pZiB0aGVyZSdzIG9ubHkgb25lIHBvaW50LCBhcmJpdHJhcmlseSBjaG9vc2UgYSBzbG9wZSBvZiAwXHJcbiAgICAvL2FuZCBhIHktaW50ZXJjZXB0IG9mIHdoYXRldmVyIHRoZSB5IG9mIHRoZSBpbml0aWFsIHBvaW50IGlzXHJcbiAgICBpZiAoZGF0YUxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIG0gPSAwO1xyXG4gICAgICAgIGIgPSBkYXRhWzBdWzFdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBJbml0aWFsaXplIG91ciBzdW1zIGFuZCBzY29wZSB0aGUgYG1gIGFuZCBgYmBcclxuICAgICAgICAvLyB2YXJpYWJsZXMgdGhhdCBkZWZpbmUgdGhlIGxpbmUuXHJcbiAgICAgICAgdmFyIHN1bVggPSAwLCBzdW1ZID0gMCxcclxuICAgICAgICAgICAgc3VtWFggPSAwLCBzdW1YWSA9IDA7XHJcblxyXG4gICAgICAgIC8vIFVzZSBsb2NhbCB2YXJpYWJsZXMgdG8gZ3JhYiBwb2ludCB2YWx1ZXNcclxuICAgICAgICAvLyB3aXRoIG1pbmltYWwgb2JqZWN0IHByb3BlcnR5IGxvb2t1cHNcclxuICAgICAgICB2YXIgcG9pbnQsIHgsIHk7XHJcblxyXG4gICAgICAgIC8vIEdhdGhlciB0aGUgc3VtIG9mIGFsbCB4IHZhbHVlcywgdGhlIHN1bSBvZiBhbGxcclxuICAgICAgICAvLyB5IHZhbHVlcywgYW5kIHRoZSBzdW0gb2YgeF4yIGFuZCAoeCp5KSBmb3IgZWFjaFxyXG4gICAgICAgIC8vIHZhbHVlLlxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gSW4gbWF0aCBub3RhdGlvbiwgdGhlc2Ugd291bGQgYmUgU1NfeCwgU1NfeSwgU1NfeHgsIGFuZCBTU194eVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YUxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHBvaW50ID0gZGF0YVtpXTtcclxuICAgICAgICAgICAgeCA9IHBvaW50WzBdO1xyXG4gICAgICAgICAgICB5ID0gcG9pbnRbMV07XHJcblxyXG4gICAgICAgICAgICBzdW1YICs9IHg7XHJcbiAgICAgICAgICAgIHN1bVkgKz0geTtcclxuXHJcbiAgICAgICAgICAgIHN1bVhYICs9IHggKiB4O1xyXG4gICAgICAgICAgICBzdW1YWSArPSB4ICogeTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGBtYCBpcyB0aGUgc2xvcGUgb2YgdGhlIHJlZ3Jlc3Npb24gbGluZVxyXG4gICAgICAgIG0gPSAoKGRhdGFMZW5ndGggKiBzdW1YWSkgLSAoc3VtWCAqIHN1bVkpKSAvXHJcbiAgICAgICAgICAgICgoZGF0YUxlbmd0aCAqIHN1bVhYKSAtIChzdW1YICogc3VtWCkpO1xyXG5cclxuICAgICAgICAvLyBgYmAgaXMgdGhlIHktaW50ZXJjZXB0IG9mIHRoZSBsaW5lLlxyXG4gICAgICAgIGIgPSAoc3VtWSAvIGRhdGFMZW5ndGgpIC0gKChtICogc3VtWCkgLyBkYXRhTGVuZ3RoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZXR1cm4gYm90aCB2YWx1ZXMgYXMgYW4gb2JqZWN0LlxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBtOiBtLFxyXG4gICAgICAgIGI6IGJcclxuICAgIH07XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxpbmVhclJlZ3Jlc3Npb247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbi8qKlxyXG4gKiBHaXZlbiB0aGUgb3V0cHV0IG9mIGBsaW5lYXJSZWdyZXNzaW9uYDogYW4gb2JqZWN0XHJcbiAqIHdpdGggYG1gIGFuZCBgYmAgdmFsdWVzIGluZGljYXRpbmcgc2xvcGUgYW5kIGludGVyY2VwdCxcclxuICogcmVzcGVjdGl2ZWx5LCBnZW5lcmF0ZSBhIGxpbmUgZnVuY3Rpb24gdGhhdCB0cmFuc2xhdGVzXHJcbiAqIHggdmFsdWVzIGludG8geSB2YWx1ZXMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYiBvYmplY3Qgd2l0aCBgbWAgYW5kIGBiYCBtZW1iZXJzLCByZXByZXNlbnRpbmdcclxuICogc2xvcGUgYW5kIGludGVyc2VjdCBvZiBkZXNpcmVkIGxpbmVcclxuICogQHJldHVybnMge0Z1bmN0aW9ufSBtZXRob2QgdGhhdCBjb21wdXRlcyB5LXZhbHVlIGF0IGFueSBnaXZlblxyXG4gKiB4LXZhbHVlIG9uIHRoZSBsaW5lLlxyXG4gKiBAZXhhbXBsZVxyXG4gKiB2YXIgbCA9IGxpbmVhclJlZ3Jlc3Npb25MaW5lKGxpbmVhclJlZ3Jlc3Npb24oW1swLCAwXSwgWzEsIDFdXSkpO1xyXG4gKiBsKDApIC8vPSAwXHJcbiAqIGwoMikgLy89IDJcclxuICovXHJcbmZ1bmN0aW9uIGxpbmVhclJlZ3Jlc3Npb25MaW5lKG1iLyo6IHsgYjogbnVtYmVyLCBtOiBudW1iZXIgfSovKS8qOiBGdW5jdGlvbiAqLyB7XHJcbiAgICAvLyBSZXR1cm4gYSBmdW5jdGlvbiB0aGF0IGNvbXB1dGVzIGEgYHlgIHZhbHVlIGZvciBlYWNoXHJcbiAgICAvLyB4IHZhbHVlIGl0IGlzIGdpdmVuLCBiYXNlZCBvbiB0aGUgdmFsdWVzIG9mIGBiYCBhbmQgYGFgXHJcbiAgICAvLyB0aGF0IHdlIGp1c3QgY29tcHV0ZWQuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24oeCkge1xyXG4gICAgICAgIHJldHVybiBtYi5iICsgKG1iLm0gKiB4KTtcclxuICAgIH07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGluZWFyUmVncmVzc2lvbkxpbmU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBzdW0gPSByZXF1aXJlKCcuL3N1bScpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBtZWFuLCBfYWxzbyBrbm93biBhcyBhdmVyYWdlXyxcclxuICogaXMgdGhlIHN1bSBvZiBhbGwgdmFsdWVzIG92ZXIgdGhlIG51bWJlciBvZiB2YWx1ZXMuXHJcbiAqIFRoaXMgaXMgYSBbbWVhc3VyZSBvZiBjZW50cmFsIHRlbmRlbmN5XShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9DZW50cmFsX3RlbmRlbmN5KTpcclxuICogYSBtZXRob2Qgb2YgZmluZGluZyBhIHR5cGljYWwgb3IgY2VudHJhbCB2YWx1ZSBvZiBhIHNldCBvZiBudW1iZXJzLlxyXG4gKlxyXG4gKiBUaGlzIHJ1bnMgb24gYE8obilgLCBsaW5lYXIgdGltZSBpbiByZXNwZWN0IHRvIHRoZSBhcnJheVxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggaW5wdXQgdmFsdWVzXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IG1lYW5cclxuICogQGV4YW1wbGVcclxuICogY29uc29sZS5sb2cobWVhbihbMCwgMTBdKSk7IC8vIDVcclxuICovXHJcbmZ1bmN0aW9uIG1lYW4oeCAvKjogQXJyYXk8bnVtYmVyPiAqLykvKjpudW1iZXIqLyB7XHJcbiAgICAvLyBUaGUgbWVhbiBvZiBubyBudW1iZXJzIGlzIG51bGxcclxuICAgIGlmICh4Lmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gTmFOOyB9XHJcblxyXG4gICAgcmV0dXJuIHN1bSh4KSAvIHgubGVuZ3RoO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1lYW47XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBxdWFudGlsZVNvcnRlZCA9IHJlcXVpcmUoJy4vcXVhbnRpbGVfc29ydGVkJyk7XHJcbnZhciBxdWlja3NlbGVjdCA9IHJlcXVpcmUoJy4vcXVpY2tzZWxlY3QnKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgW3F1YW50aWxlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9RdWFudGlsZSk6XHJcbiAqIHRoaXMgaXMgYSBwb3B1bGF0aW9uIHF1YW50aWxlLCBzaW5jZSB3ZSBhc3N1bWUgdG8ga25vdyB0aGUgZW50aXJlXHJcbiAqIGRhdGFzZXQgaW4gdGhpcyBsaWJyYXJ5LiBUaGlzIGlzIGFuIGltcGxlbWVudGF0aW9uIG9mIHRoZVxyXG4gKiBbUXVhbnRpbGVzIG9mIGEgUG9wdWxhdGlvbl0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9RdWFudGlsZSNRdWFudGlsZXNfb2ZfYV9wb3B1bGF0aW9uKVxyXG4gKiBhbGdvcml0aG0gZnJvbSB3aWtpcGVkaWEuXHJcbiAqXHJcbiAqIFNhbXBsZSBpcyBhIG9uZS1kaW1lbnNpb25hbCBhcnJheSBvZiBudW1iZXJzLFxyXG4gKiBhbmQgcCBpcyBlaXRoZXIgYSBkZWNpbWFsIG51bWJlciBmcm9tIDAgdG8gMSBvciBhbiBhcnJheSBvZiBkZWNpbWFsXHJcbiAqIG51bWJlcnMgZnJvbSAwIHRvIDEuXHJcbiAqIEluIHRlcm1zIG9mIGEgay9xIHF1YW50aWxlLCBwID0gay9xIC0gaXQncyBqdXN0IGRlYWxpbmcgd2l0aCBmcmFjdGlvbnMgb3IgZGVhbGluZ1xyXG4gKiB3aXRoIGRlY2ltYWwgdmFsdWVzLlxyXG4gKiBXaGVuIHAgaXMgYW4gYXJyYXksIHRoZSByZXN1bHQgb2YgdGhlIGZ1bmN0aW9uIGlzIGFsc28gYW4gYXJyYXkgY29udGFpbmluZyB0aGUgYXBwcm9wcmlhdGVcclxuICogcXVhbnRpbGVzIGluIGlucHV0IG9yZGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0gc2FtcGxlIGEgc2FtcGxlIGZyb20gdGhlIHBvcHVsYXRpb25cclxuICogQHBhcmFtIHtudW1iZXJ9IHAgdGhlIGRlc2lyZWQgcXVhbnRpbGUsIGFzIGEgbnVtYmVyIGJldHdlZW4gMCBhbmQgMVxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBxdWFudGlsZVxyXG4gKiBAZXhhbXBsZVxyXG4gKiB2YXIgZGF0YSA9IFszLCA2LCA3LCA4LCA4LCA5LCAxMCwgMTMsIDE1LCAxNiwgMjBdO1xyXG4gKiBxdWFudGlsZShkYXRhLCAxKTsgLy89IG1heChkYXRhKTtcclxuICogcXVhbnRpbGUoZGF0YSwgMCk7IC8vPSBtaW4oZGF0YSk7XHJcbiAqIHF1YW50aWxlKGRhdGEsIDAuNSk7IC8vPSA5XHJcbiAqL1xyXG5mdW5jdGlvbiBxdWFudGlsZShzYW1wbGUgLyo6IEFycmF5PG51bWJlcj4gKi8sIHAgLyo6IEFycmF5PG51bWJlcj4gfCBudW1iZXIgKi8pIHtcclxuICAgIHZhciBjb3B5ID0gc2FtcGxlLnNsaWNlKCk7XHJcblxyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkocCkpIHtcclxuICAgICAgICAvLyByZWFycmFuZ2UgZWxlbWVudHMgc28gdGhhdCBlYWNoIGVsZW1lbnQgY29ycmVzcG9uZGluZyB0byBhIHJlcXVlc3RlZFxyXG4gICAgICAgIC8vIHF1YW50aWxlIGlzIG9uIGEgcGxhY2UgaXQgd291bGQgYmUgaWYgdGhlIGFycmF5IHdhcyBmdWxseSBzb3J0ZWRcclxuICAgICAgICBtdWx0aVF1YW50aWxlU2VsZWN0KGNvcHksIHApO1xyXG4gICAgICAgIC8vIEluaXRpYWxpemUgdGhlIHJlc3VsdCBhcnJheVxyXG4gICAgICAgIHZhciByZXN1bHRzID0gW107XHJcbiAgICAgICAgLy8gRm9yIGVhY2ggcmVxdWVzdGVkIHF1YW50aWxlXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdHNbaV0gPSBxdWFudGlsZVNvcnRlZChjb3B5LCBwW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBpZHggPSBxdWFudGlsZUluZGV4KGNvcHkubGVuZ3RoLCBwKTtcclxuICAgICAgICBxdWFudGlsZVNlbGVjdChjb3B5LCBpZHgsIDAsIGNvcHkubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgcmV0dXJuIHF1YW50aWxlU29ydGVkKGNvcHksIHApO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBxdWFudGlsZVNlbGVjdChhcnIsIGssIGxlZnQsIHJpZ2h0KSB7XHJcbiAgICBpZiAoayAlIDEgPT09IDApIHtcclxuICAgICAgICBxdWlja3NlbGVjdChhcnIsIGssIGxlZnQsIHJpZ2h0KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgayA9IE1hdGguZmxvb3Ioayk7XHJcbiAgICAgICAgcXVpY2tzZWxlY3QoYXJyLCBrLCBsZWZ0LCByaWdodCk7XHJcbiAgICAgICAgcXVpY2tzZWxlY3QoYXJyLCBrICsgMSwgayArIDEsIHJpZ2h0KTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbXVsdGlRdWFudGlsZVNlbGVjdChhcnIsIHApIHtcclxuICAgIHZhciBpbmRpY2VzID0gWzBdO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaW5kaWNlcy5wdXNoKHF1YW50aWxlSW5kZXgoYXJyLmxlbmd0aCwgcFtpXSkpO1xyXG4gICAgfVxyXG4gICAgaW5kaWNlcy5wdXNoKGFyci5sZW5ndGggLSAxKTtcclxuICAgIGluZGljZXMuc29ydChjb21wYXJlKTtcclxuXHJcbiAgICB2YXIgc3RhY2sgPSBbMCwgaW5kaWNlcy5sZW5ndGggLSAxXTtcclxuXHJcbiAgICB3aGlsZSAoc3RhY2subGVuZ3RoKSB7XHJcbiAgICAgICAgdmFyIHIgPSBNYXRoLmNlaWwoc3RhY2sucG9wKCkpO1xyXG4gICAgICAgIHZhciBsID0gTWF0aC5mbG9vcihzdGFjay5wb3AoKSk7XHJcbiAgICAgICAgaWYgKHIgLSBsIDw9IDEpIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICB2YXIgbSA9IE1hdGguZmxvb3IoKGwgKyByKSAvIDIpO1xyXG4gICAgICAgIHF1YW50aWxlU2VsZWN0KGFyciwgaW5kaWNlc1ttXSwgaW5kaWNlc1tsXSwgaW5kaWNlc1tyXSk7XHJcblxyXG4gICAgICAgIHN0YWNrLnB1c2gobCwgbSwgbSwgcik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbXBhcmUoYSwgYikge1xyXG4gICAgcmV0dXJuIGEgLSBiO1xyXG59XHJcblxyXG5mdW5jdGlvbiBxdWFudGlsZUluZGV4KGxlbiAvKjogbnVtYmVyICovLCBwIC8qOiBudW1iZXIgKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgdmFyIGlkeCA9IGxlbiAqIHA7XHJcbiAgICBpZiAocCA9PT0gMSkge1xyXG4gICAgICAgIC8vIElmIHAgaXMgMSwgZGlyZWN0bHkgcmV0dXJuIHRoZSBsYXN0IGluZGV4XHJcbiAgICAgICAgcmV0dXJuIGxlbiAtIDE7XHJcbiAgICB9IGVsc2UgaWYgKHAgPT09IDApIHtcclxuICAgICAgICAvLyBJZiBwIGlzIDAsIGRpcmVjdGx5IHJldHVybiB0aGUgZmlyc3QgaW5kZXhcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH0gZWxzZSBpZiAoaWR4ICUgMSAhPT0gMCkge1xyXG4gICAgICAgIC8vIElmIGluZGV4IGlzIG5vdCBpbnRlZ2VyLCByZXR1cm4gdGhlIG5leHQgaW5kZXggaW4gYXJyYXlcclxuICAgICAgICByZXR1cm4gTWF0aC5jZWlsKGlkeCkgLSAxO1xyXG4gICAgfSBlbHNlIGlmIChsZW4gJSAyID09PSAwKSB7XHJcbiAgICAgICAgLy8gSWYgdGhlIGxpc3QgaGFzIGV2ZW4tbGVuZ3RoLCB3ZSdsbCByZXR1cm4gdGhlIG1pZGRsZSBvZiB0d28gaW5kaWNlc1xyXG4gICAgICAgIC8vIGFyb3VuZCBxdWFudGlsZSB0byBpbmRpY2F0ZSB0aGF0IHdlIG5lZWQgYW4gYXZlcmFnZSB2YWx1ZSBvZiB0aGUgdHdvXHJcbiAgICAgICAgcmV0dXJuIGlkeCAtIDAuNTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gRmluYWxseSwgaW4gdGhlIHNpbXBsZSBjYXNlIG9mIGFuIGludGVnZXIgaW5kZXhcclxuICAgICAgICAvLyB3aXRoIGFuIG9kZC1sZW5ndGggbGlzdCwgcmV0dXJuIHRoZSBpbmRleFxyXG4gICAgICAgIHJldHVybiBpZHg7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcXVhbnRpbGU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbi8qKlxyXG4gKiBUaGlzIGlzIHRoZSBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBvZiBxdWFudGlsZXM6IHdoZW4geW91IGtub3dcclxuICogdGhhdCB0aGUgb3JkZXIgaXMgc29ydGVkLCB5b3UgZG9uJ3QgbmVlZCB0byByZS1zb3J0IGl0LCBhbmQgdGhlIGNvbXB1dGF0aW9uc1xyXG4gKiBhcmUgZmFzdGVyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHNhbXBsZSBpbnB1dCBkYXRhXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBwIGRlc2lyZWQgcXVhbnRpbGU6IGEgbnVtYmVyIGJldHdlZW4gMCB0byAxLCBpbmNsdXNpdmVcclxuICogQHJldHVybnMge251bWJlcn0gcXVhbnRpbGUgdmFsdWVcclxuICogQGV4YW1wbGVcclxuICogdmFyIGRhdGEgPSBbMywgNiwgNywgOCwgOCwgOSwgMTAsIDEzLCAxNSwgMTYsIDIwXTtcclxuICogcXVhbnRpbGVTb3J0ZWQoZGF0YSwgMSk7IC8vPSBtYXgoZGF0YSk7XHJcbiAqIHF1YW50aWxlU29ydGVkKGRhdGEsIDApOyAvLz0gbWluKGRhdGEpO1xyXG4gKiBxdWFudGlsZVNvcnRlZChkYXRhLCAwLjUpOyAvLz0gOVxyXG4gKi9cclxuZnVuY3Rpb24gcXVhbnRpbGVTb3J0ZWQoc2FtcGxlIC8qOiBBcnJheTxudW1iZXI+ICovLCBwIC8qOiBudW1iZXIgKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgdmFyIGlkeCA9IHNhbXBsZS5sZW5ndGggKiBwO1xyXG4gICAgaWYgKHAgPCAwIHx8IHAgPiAxKSB7XHJcbiAgICAgICAgcmV0dXJuIE5hTjtcclxuICAgIH0gZWxzZSBpZiAocCA9PT0gMSkge1xyXG4gICAgICAgIC8vIElmIHAgaXMgMSwgZGlyZWN0bHkgcmV0dXJuIHRoZSBsYXN0IGVsZW1lbnRcclxuICAgICAgICByZXR1cm4gc2FtcGxlW3NhbXBsZS5sZW5ndGggLSAxXTtcclxuICAgIH0gZWxzZSBpZiAocCA9PT0gMCkge1xyXG4gICAgICAgIC8vIElmIHAgaXMgMCwgZGlyZWN0bHkgcmV0dXJuIHRoZSBmaXJzdCBlbGVtZW50XHJcbiAgICAgICAgcmV0dXJuIHNhbXBsZVswXTtcclxuICAgIH0gZWxzZSBpZiAoaWR4ICUgMSAhPT0gMCkge1xyXG4gICAgICAgIC8vIElmIHAgaXMgbm90IGludGVnZXIsIHJldHVybiB0aGUgbmV4dCBlbGVtZW50IGluIGFycmF5XHJcbiAgICAgICAgcmV0dXJuIHNhbXBsZVtNYXRoLmNlaWwoaWR4KSAtIDFdO1xyXG4gICAgfSBlbHNlIGlmIChzYW1wbGUubGVuZ3RoICUgMiA9PT0gMCkge1xyXG4gICAgICAgIC8vIElmIHRoZSBsaXN0IGhhcyBldmVuLWxlbmd0aCwgd2UnbGwgdGFrZSB0aGUgYXZlcmFnZSBvZiB0aGlzIG51bWJlclxyXG4gICAgICAgIC8vIGFuZCB0aGUgbmV4dCB2YWx1ZSwgaWYgdGhlcmUgaXMgb25lXHJcbiAgICAgICAgcmV0dXJuIChzYW1wbGVbaWR4IC0gMV0gKyBzYW1wbGVbaWR4XSkgLyAyO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBGaW5hbGx5LCBpbiB0aGUgc2ltcGxlIGNhc2Ugb2YgYW4gaW50ZWdlciB2YWx1ZVxyXG4gICAgICAgIC8vIHdpdGggYW4gb2RkLWxlbmd0aCBsaXN0LCByZXR1cm4gdGhlIHNhbXBsZSB2YWx1ZSBhdCB0aGUgaW5kZXguXHJcbiAgICAgICAgcmV0dXJuIHNhbXBsZVtpZHhdO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHF1YW50aWxlU29ydGVkO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHF1aWNrc2VsZWN0O1xyXG5cclxuLyoqXHJcbiAqIFJlYXJyYW5nZSBpdGVtcyBpbiBgYXJyYCBzbyB0aGF0IGFsbCBpdGVtcyBpbiBgW2xlZnQsIGtdYCByYW5nZSBhcmUgdGhlIHNtYWxsZXN0LlxyXG4gKiBUaGUgYGtgLXRoIGVsZW1lbnQgd2lsbCBoYXZlIHRoZSBgKGsgLSBsZWZ0ICsgMSlgLXRoIHNtYWxsZXN0IHZhbHVlIGluIGBbbGVmdCwgcmlnaHRdYC5cclxuICpcclxuICogSW1wbGVtZW50cyBGbG95ZC1SaXZlc3Qgc2VsZWN0aW9uIGFsZ29yaXRobSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9GbG95ZC1SaXZlc3RfYWxnb3JpdGhtXHJcbiAqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0gYXJyIGlucHV0IGFycmF5XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBrIHBpdm90IGluZGV4XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBsZWZ0IGxlZnQgaW5kZXhcclxuICogQHBhcmFtIHtudW1iZXJ9IHJpZ2h0IHJpZ2h0IGluZGV4XHJcbiAqIEByZXR1cm5zIHt1bmRlZmluZWR9XHJcbiAqIEBleGFtcGxlXHJcbiAqIHZhciBhcnIgPSBbNjUsIDI4LCA1OSwgMzMsIDIxLCA1NiwgMjIsIDk1LCA1MCwgMTIsIDkwLCA1MywgMjgsIDc3LCAzOV07XHJcbiAqIHF1aWNrc2VsZWN0KGFyciwgOCk7XHJcbiAqIC8vIFszOSwgMjgsIDI4LCAzMywgMjEsIDEyLCAyMiwgNTAsIDUzLCA1NiwgNTksIDY1LCA5MCwgNzcsIDk1XVxyXG4gKi9cclxuZnVuY3Rpb24gcXVpY2tzZWxlY3QoYXJyIC8qOiBBcnJheTxudW1iZXI+ICovLCBrIC8qOiBudW1iZXIgKi8sIGxlZnQgLyo6IG51bWJlciAqLywgcmlnaHQgLyo6IG51bWJlciAqLykge1xyXG4gICAgbGVmdCA9IGxlZnQgfHwgMDtcclxuICAgIHJpZ2h0ID0gcmlnaHQgfHwgKGFyci5sZW5ndGggLSAxKTtcclxuXHJcbiAgICB3aGlsZSAocmlnaHQgPiBsZWZ0KSB7XHJcbiAgICAgICAgLy8gNjAwIGFuZCAwLjUgYXJlIGFyYml0cmFyeSBjb25zdGFudHMgY2hvc2VuIGluIHRoZSBvcmlnaW5hbCBwYXBlciB0byBtaW5pbWl6ZSBleGVjdXRpb24gdGltZVxyXG4gICAgICAgIGlmIChyaWdodCAtIGxlZnQgPiA2MDApIHtcclxuICAgICAgICAgICAgdmFyIG4gPSByaWdodCAtIGxlZnQgKyAxO1xyXG4gICAgICAgICAgICB2YXIgbSA9IGsgLSBsZWZ0ICsgMTtcclxuICAgICAgICAgICAgdmFyIHogPSBNYXRoLmxvZyhuKTtcclxuICAgICAgICAgICAgdmFyIHMgPSAwLjUgKiBNYXRoLmV4cCgyICogeiAvIDMpO1xyXG4gICAgICAgICAgICB2YXIgc2QgPSAwLjUgKiBNYXRoLnNxcnQoeiAqIHMgKiAobiAtIHMpIC8gbik7XHJcbiAgICAgICAgICAgIGlmIChtIC0gbiAvIDIgPCAwKSBzZCAqPSAtMTtcclxuICAgICAgICAgICAgdmFyIG5ld0xlZnQgPSBNYXRoLm1heChsZWZ0LCBNYXRoLmZsb29yKGsgLSBtICogcyAvIG4gKyBzZCkpO1xyXG4gICAgICAgICAgICB2YXIgbmV3UmlnaHQgPSBNYXRoLm1pbihyaWdodCwgTWF0aC5mbG9vcihrICsgKG4gLSBtKSAqIHMgLyBuICsgc2QpKTtcclxuICAgICAgICAgICAgcXVpY2tzZWxlY3QoYXJyLCBrLCBuZXdMZWZ0LCBuZXdSaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdCA9IGFycltrXTtcclxuICAgICAgICB2YXIgaSA9IGxlZnQ7XHJcbiAgICAgICAgdmFyIGogPSByaWdodDtcclxuXHJcbiAgICAgICAgc3dhcChhcnIsIGxlZnQsIGspO1xyXG4gICAgICAgIGlmIChhcnJbcmlnaHRdID4gdCkgc3dhcChhcnIsIGxlZnQsIHJpZ2h0KTtcclxuXHJcbiAgICAgICAgd2hpbGUgKGkgPCBqKSB7XHJcbiAgICAgICAgICAgIHN3YXAoYXJyLCBpLCBqKTtcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICBqLS07XHJcbiAgICAgICAgICAgIHdoaWxlIChhcnJbaV0gPCB0KSBpKys7XHJcbiAgICAgICAgICAgIHdoaWxlIChhcnJbal0gPiB0KSBqLS07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYXJyW2xlZnRdID09PSB0KSBzd2FwKGFyciwgbGVmdCwgaik7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGorKztcclxuICAgICAgICAgICAgc3dhcChhcnIsIGosIHJpZ2h0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChqIDw9IGspIGxlZnQgPSBqICsgMTtcclxuICAgICAgICBpZiAoayA8PSBqKSByaWdodCA9IGogLSAxO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzd2FwKGFyciwgaSwgaikge1xyXG4gICAgdmFyIHRtcCA9IGFycltpXTtcclxuICAgIGFycltpXSA9IGFycltqXTtcclxuICAgIGFycltqXSA9IHRtcDtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgc2FtcGxlQ292YXJpYW5jZSA9IHJlcXVpcmUoJy4vc2FtcGxlX2NvdmFyaWFuY2UnKTtcclxudmFyIHNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uID0gcmVxdWlyZSgnLi9zYW1wbGVfc3RhbmRhcmRfZGV2aWF0aW9uJyk7XHJcblxyXG4vKipcclxuICogVGhlIFtjb3JyZWxhdGlvbl0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Db3JyZWxhdGlvbl9hbmRfZGVwZW5kZW5jZSkgaXNcclxuICogYSBtZWFzdXJlIG9mIGhvdyBjb3JyZWxhdGVkIHR3byBkYXRhc2V0cyBhcmUsIGJldHdlZW4gLTEgYW5kIDFcclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGZpcnN0IGlucHV0XHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geSBzZWNvbmQgaW5wdXRcclxuICogQHJldHVybnMge251bWJlcn0gc2FtcGxlIGNvcnJlbGF0aW9uXHJcbiAqIEBleGFtcGxlXHJcbiAqIHZhciBhID0gWzEsIDIsIDMsIDQsIDUsIDZdO1xyXG4gKiB2YXIgYiA9IFsyLCAyLCAzLCA0LCA1LCA2MF07XHJcbiAqIHNhbXBsZUNvcnJlbGF0aW9uKGEsIGIpOyAvLz0gMC42OTFcclxuICovXHJcbmZ1bmN0aW9uIHNhbXBsZUNvcnJlbGF0aW9uKHgvKjogQXJyYXk8bnVtYmVyPiAqLywgeS8qOiBBcnJheTxudW1iZXI+ICovKS8qOm51bWJlciovIHtcclxuICAgIHZhciBjb3YgPSBzYW1wbGVDb3ZhcmlhbmNlKHgsIHkpLFxyXG4gICAgICAgIHhzdGQgPSBzYW1wbGVTdGFuZGFyZERldmlhdGlvbih4KSxcclxuICAgICAgICB5c3RkID0gc2FtcGxlU3RhbmRhcmREZXZpYXRpb24oeSk7XHJcblxyXG4gICAgcmV0dXJuIGNvdiAvIHhzdGQgLyB5c3RkO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNhbXBsZUNvcnJlbGF0aW9uO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgbWVhbiA9IHJlcXVpcmUoJy4vbWVhbicpO1xyXG5cclxuLyoqXHJcbiAqIFtTYW1wbGUgY292YXJpYW5jZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvU2FtcGxlX21lYW5fYW5kX3NhbXBsZUNvdmFyaWFuY2UpIG9mIHR3byBkYXRhc2V0czpcclxuICogaG93IG11Y2ggZG8gdGhlIHR3byBkYXRhc2V0cyBtb3ZlIHRvZ2V0aGVyP1xyXG4gKiB4IGFuZCB5IGFyZSB0d28gZGF0YXNldHMsIHJlcHJlc2VudGVkIGFzIGFycmF5cyBvZiBudW1iZXJzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggZmlyc3QgaW5wdXRcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB5IHNlY29uZCBpbnB1dFxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBzYW1wbGUgY292YXJpYW5jZVxyXG4gKiBAZXhhbXBsZVxyXG4gKiB2YXIgeCA9IFsxLCAyLCAzLCA0LCA1LCA2XTtcclxuICogdmFyIHkgPSBbNiwgNSwgNCwgMywgMiwgMV07XHJcbiAqIHNhbXBsZUNvdmFyaWFuY2UoeCwgeSk7IC8vPSAtMy41XHJcbiAqL1xyXG5mdW5jdGlvbiBzYW1wbGVDb3ZhcmlhbmNlKHggLyo6QXJyYXk8bnVtYmVyPiovLCB5IC8qOkFycmF5PG51bWJlcj4qLykvKjpudW1iZXIqLyB7XHJcblxyXG4gICAgLy8gVGhlIHR3byBkYXRhc2V0cyBtdXN0IGhhdmUgdGhlIHNhbWUgbGVuZ3RoIHdoaWNoIG11c3QgYmUgbW9yZSB0aGFuIDFcclxuICAgIGlmICh4Lmxlbmd0aCA8PSAxIHx8IHgubGVuZ3RoICE9PSB5Lmxlbmd0aCkge1xyXG4gICAgICAgIHJldHVybiBOYU47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZGV0ZXJtaW5lIHRoZSBtZWFuIG9mIGVhY2ggZGF0YXNldCBzbyB0aGF0IHdlIGNhbiBqdWRnZSBlYWNoXHJcbiAgICAvLyB2YWx1ZSBvZiB0aGUgZGF0YXNldCBmYWlybHkgYXMgdGhlIGRpZmZlcmVuY2UgZnJvbSB0aGUgbWVhbi4gdGhpc1xyXG4gICAgLy8gd2F5LCBpZiBvbmUgZGF0YXNldCBpcyBbMSwgMiwgM10gYW5kIFsyLCAzLCA0XSwgdGhlaXIgY292YXJpYW5jZVxyXG4gICAgLy8gZG9lcyBub3Qgc3VmZmVyIGJlY2F1c2Ugb2YgdGhlIGRpZmZlcmVuY2UgaW4gYWJzb2x1dGUgdmFsdWVzXHJcbiAgICB2YXIgeG1lYW4gPSBtZWFuKHgpLFxyXG4gICAgICAgIHltZWFuID0gbWVhbih5KSxcclxuICAgICAgICBzdW0gPSAwO1xyXG5cclxuICAgIC8vIGZvciBlYWNoIHBhaXIgb2YgdmFsdWVzLCB0aGUgY292YXJpYW5jZSBpbmNyZWFzZXMgd2hlbiB0aGVpclxyXG4gICAgLy8gZGlmZmVyZW5jZSBmcm9tIHRoZSBtZWFuIGlzIGFzc29jaWF0ZWQgLSBpZiBib3RoIGFyZSB3ZWxsIGFib3ZlXHJcbiAgICAvLyBvciBpZiBib3RoIGFyZSB3ZWxsIGJlbG93XHJcbiAgICAvLyB0aGUgbWVhbiwgdGhlIGNvdmFyaWFuY2UgaW5jcmVhc2VzIHNpZ25pZmljYW50bHkuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBzdW0gKz0gKHhbaV0gLSB4bWVhbikgKiAoeVtpXSAtIHltZWFuKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB0aGlzIGlzIEJlc3NlbHMnIENvcnJlY3Rpb246IGFuIGFkanVzdG1lbnQgbWFkZSB0byBzYW1wbGUgc3RhdGlzdGljc1xyXG4gICAgLy8gdGhhdCBhbGxvd3MgZm9yIHRoZSByZWR1Y2VkIGRlZ3JlZSBvZiBmcmVlZG9tIGVudGFpbGVkIGluIGNhbGN1bGF0aW5nXHJcbiAgICAvLyB2YWx1ZXMgZnJvbSBzYW1wbGVzIHJhdGhlciB0aGFuIGNvbXBsZXRlIHBvcHVsYXRpb25zLlxyXG4gICAgdmFyIGJlc3NlbHNDb3JyZWN0aW9uID0geC5sZW5ndGggLSAxO1xyXG5cclxuICAgIC8vIHRoZSBjb3ZhcmlhbmNlIGlzIHdlaWdodGVkIGJ5IHRoZSBsZW5ndGggb2YgdGhlIGRhdGFzZXRzLlxyXG4gICAgcmV0dXJuIHN1bSAvIGJlc3NlbHNDb3JyZWN0aW9uO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNhbXBsZUNvdmFyaWFuY2U7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBzYW1wbGVWYXJpYW5jZSA9IHJlcXVpcmUoJy4vc2FtcGxlX3ZhcmlhbmNlJyk7XHJcblxyXG4vKipcclxuICogVGhlIFtzdGFuZGFyZCBkZXZpYXRpb25dKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvU3RhbmRhcmRfZGV2aWF0aW9uKVxyXG4gKiBpcyB0aGUgc3F1YXJlIHJvb3Qgb2YgdGhlIHZhcmlhbmNlLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggaW5wdXQgYXJyYXlcclxuICogQHJldHVybnMge251bWJlcn0gc2FtcGxlIHN0YW5kYXJkIGRldmlhdGlvblxyXG4gKiBAZXhhbXBsZVxyXG4gKiBzcy5zYW1wbGVTdGFuZGFyZERldmlhdGlvbihbMiwgNCwgNCwgNCwgNSwgNSwgNywgOV0pO1xyXG4gKiAvLz0gMi4xMzhcclxuICovXHJcbmZ1bmN0aW9uIHNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uKHgvKjpBcnJheTxudW1iZXI+Ki8pLyo6bnVtYmVyKi8ge1xyXG4gICAgLy8gVGhlIHN0YW5kYXJkIGRldmlhdGlvbiBvZiBubyBudW1iZXJzIGlzIG51bGxcclxuICAgIHZhciBzYW1wbGVWYXJpYW5jZVggPSBzYW1wbGVWYXJpYW5jZSh4KTtcclxuICAgIGlmIChpc05hTihzYW1wbGVWYXJpYW5jZVgpKSB7IHJldHVybiBOYU47IH1cclxuICAgIHJldHVybiBNYXRoLnNxcnQoc2FtcGxlVmFyaWFuY2VYKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYW1wbGVTdGFuZGFyZERldmlhdGlvbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIHN1bU50aFBvd2VyRGV2aWF0aW9ucyA9IHJlcXVpcmUoJy4vc3VtX250aF9wb3dlcl9kZXZpYXRpb25zJyk7XHJcblxyXG4vKlxyXG4gKiBUaGUgW3NhbXBsZSB2YXJpYW5jZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVmFyaWFuY2UjU2FtcGxlX3ZhcmlhbmNlKVxyXG4gKiBpcyB0aGUgc3VtIG9mIHNxdWFyZWQgZGV2aWF0aW9ucyBmcm9tIHRoZSBtZWFuLiBUaGUgc2FtcGxlIHZhcmlhbmNlXHJcbiAqIGlzIGRpc3Rpbmd1aXNoZWQgZnJvbSB0aGUgdmFyaWFuY2UgYnkgdGhlIHVzYWdlIG9mIFtCZXNzZWwncyBDb3JyZWN0aW9uXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9CZXNzZWwnc19jb3JyZWN0aW9uKTpcclxuICogaW5zdGVhZCBvZiBkaXZpZGluZyB0aGUgc3VtIG9mIHNxdWFyZWQgZGV2aWF0aW9ucyBieSB0aGUgbGVuZ3RoIG9mIHRoZSBpbnB1dCxcclxuICogaXQgaXMgZGl2aWRlZCBieSB0aGUgbGVuZ3RoIG1pbnVzIG9uZS4gVGhpcyBjb3JyZWN0cyB0aGUgYmlhcyBpbiBlc3RpbWF0aW5nXHJcbiAqIGEgdmFsdWUgZnJvbSBhIHNldCB0aGF0IHlvdSBkb24ndCBrbm93IGlmIGZ1bGwuXHJcbiAqXHJcbiAqIFJlZmVyZW5jZXM6XHJcbiAqICogW1dvbGZyYW0gTWF0aFdvcmxkIG9uIFNhbXBsZSBWYXJpYW5jZV0oaHR0cDovL21hdGh3b3JsZC53b2xmcmFtLmNvbS9TYW1wbGVWYXJpYW5jZS5odG1sKVxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggaW5wdXQgYXJyYXlcclxuICogQHJldHVybiB7bnVtYmVyfSBzYW1wbGUgdmFyaWFuY2VcclxuICogQGV4YW1wbGVcclxuICogc2FtcGxlVmFyaWFuY2UoWzEsIDIsIDMsIDQsIDVdKTsgLy89IDIuNVxyXG4gKi9cclxuZnVuY3Rpb24gc2FtcGxlVmFyaWFuY2UoeCAvKjogQXJyYXk8bnVtYmVyPiAqLykvKjpudW1iZXIqLyB7XHJcbiAgICAvLyBUaGUgdmFyaWFuY2Ugb2Ygbm8gbnVtYmVycyBpcyBudWxsXHJcbiAgICBpZiAoeC5sZW5ndGggPD0gMSkgeyByZXR1cm4gTmFOOyB9XHJcblxyXG4gICAgdmFyIHN1bVNxdWFyZWREZXZpYXRpb25zVmFsdWUgPSBzdW1OdGhQb3dlckRldmlhdGlvbnMoeCwgMik7XHJcblxyXG4gICAgLy8gdGhpcyBpcyBCZXNzZWxzJyBDb3JyZWN0aW9uOiBhbiBhZGp1c3RtZW50IG1hZGUgdG8gc2FtcGxlIHN0YXRpc3RpY3NcclxuICAgIC8vIHRoYXQgYWxsb3dzIGZvciB0aGUgcmVkdWNlZCBkZWdyZWUgb2YgZnJlZWRvbSBlbnRhaWxlZCBpbiBjYWxjdWxhdGluZ1xyXG4gICAgLy8gdmFsdWVzIGZyb20gc2FtcGxlcyByYXRoZXIgdGhhbiBjb21wbGV0ZSBwb3B1bGF0aW9ucy5cclxuICAgIHZhciBiZXNzZWxzQ29ycmVjdGlvbiA9IHgubGVuZ3RoIC0gMTtcclxuXHJcbiAgICAvLyBGaW5kIHRoZSBtZWFuIHZhbHVlIG9mIHRoYXQgbGlzdFxyXG4gICAgcmV0dXJuIHN1bVNxdWFyZWREZXZpYXRpb25zVmFsdWUgLyBiZXNzZWxzQ29ycmVjdGlvbjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYW1wbGVWYXJpYW5jZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIHZhcmlhbmNlID0gcmVxdWlyZSgnLi92YXJpYW5jZScpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBbc3RhbmRhcmQgZGV2aWF0aW9uXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1N0YW5kYXJkX2RldmlhdGlvbilcclxuICogaXMgdGhlIHNxdWFyZSByb290IG9mIHRoZSB2YXJpYW5jZS4gSXQncyB1c2VmdWwgZm9yIG1lYXN1cmluZyB0aGUgYW1vdW50XHJcbiAqIG9mIHZhcmlhdGlvbiBvciBkaXNwZXJzaW9uIGluIGEgc2V0IG9mIHZhbHVlcy5cclxuICpcclxuICogU3RhbmRhcmQgZGV2aWF0aW9uIGlzIG9ubHkgYXBwcm9wcmlhdGUgZm9yIGZ1bGwtcG9wdWxhdGlvbiBrbm93bGVkZ2U6IGZvclxyXG4gKiBzYW1wbGVzIG9mIGEgcG9wdWxhdGlvbiwge0BsaW5rIHNhbXBsZVN0YW5kYXJkRGV2aWF0aW9ufSBpc1xyXG4gKiBtb3JlIGFwcHJvcHJpYXRlLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggaW5wdXRcclxuICogQHJldHVybnMge251bWJlcn0gc3RhbmRhcmQgZGV2aWF0aW9uXHJcbiAqIEBleGFtcGxlXHJcbiAqIHZhciBzY29yZXMgPSBbMiwgNCwgNCwgNCwgNSwgNSwgNywgOV07XHJcbiAqIHZhcmlhbmNlKHNjb3Jlcyk7IC8vPSA0XHJcbiAqIHN0YW5kYXJkRGV2aWF0aW9uKHNjb3Jlcyk7IC8vPSAyXHJcbiAqL1xyXG5mdW5jdGlvbiBzdGFuZGFyZERldmlhdGlvbih4IC8qOiBBcnJheTxudW1iZXI+ICovKS8qOm51bWJlciovIHtcclxuICAgIC8vIFRoZSBzdGFuZGFyZCBkZXZpYXRpb24gb2Ygbm8gbnVtYmVycyBpcyBudWxsXHJcbiAgICB2YXIgdiA9IHZhcmlhbmNlKHgpO1xyXG4gICAgaWYgKGlzTmFOKHYpKSB7IHJldHVybiAwOyB9XHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHYpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHN0YW5kYXJkRGV2aWF0aW9uO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG4vKipcclxuICogT3VyIGRlZmF1bHQgc3VtIGlzIHRoZSBbS2FoYW4gc3VtbWF0aW9uIGFsZ29yaXRobV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvS2FoYW5fc3VtbWF0aW9uX2FsZ29yaXRobSkgaXNcclxuICogYSBtZXRob2QgZm9yIGNvbXB1dGluZyB0aGUgc3VtIG9mIGEgbGlzdCBvZiBudW1iZXJzIHdoaWxlIGNvcnJlY3RpbmdcclxuICogZm9yIGZsb2F0aW5nLXBvaW50IGVycm9ycy4gVHJhZGl0aW9uYWxseSwgc3VtcyBhcmUgY2FsY3VsYXRlZCBhcyBtYW55XHJcbiAqIHN1Y2Nlc3NpdmUgYWRkaXRpb25zLCBlYWNoIG9uZSB3aXRoIGl0cyBvd24gZmxvYXRpbmctcG9pbnQgcm91bmRvZmYuIFRoZXNlXHJcbiAqIGxvc3NlcyBpbiBwcmVjaXNpb24gYWRkIHVwIGFzIHRoZSBudW1iZXIgb2YgbnVtYmVycyBpbmNyZWFzZXMuIFRoaXMgYWx0ZXJuYXRpdmVcclxuICogYWxnb3JpdGhtIGlzIG1vcmUgYWNjdXJhdGUgdGhhbiB0aGUgc2ltcGxlIHdheSBvZiBjYWxjdWxhdGluZyBzdW1zIGJ5IHNpbXBsZVxyXG4gKiBhZGRpdGlvbi5cclxuICpcclxuICogVGhpcyBydW5zIG9uIGBPKG4pYCwgbGluZWFyIHRpbWUgaW4gcmVzcGVjdCB0byB0aGUgYXJyYXlcclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGlucHV0XHJcbiAqIEByZXR1cm4ge251bWJlcn0gc3VtIG9mIGFsbCBpbnB1dCBudW1iZXJzXHJcbiAqIEBleGFtcGxlXHJcbiAqIGNvbnNvbGUubG9nKHN1bShbMSwgMiwgM10pKTsgLy8gNlxyXG4gKi9cclxuZnVuY3Rpb24gc3VtKHgvKjogQXJyYXk8bnVtYmVyPiAqLykvKjogbnVtYmVyICovIHtcclxuXHJcbiAgICAvLyBsaWtlIHRoZSB0cmFkaXRpb25hbCBzdW0gYWxnb3JpdGhtLCB3ZSBrZWVwIGEgcnVubmluZ1xyXG4gICAgLy8gY291bnQgb2YgdGhlIGN1cnJlbnQgc3VtLlxyXG4gICAgdmFyIHN1bSA9IDA7XHJcblxyXG4gICAgLy8gYnV0IHdlIGFsc28ga2VlcCB0aHJlZSBleHRyYSB2YXJpYWJsZXMgYXMgYm9va2tlZXBpbmc6XHJcbiAgICAvLyBtb3N0IGltcG9ydGFudGx5LCBhbiBlcnJvciBjb3JyZWN0aW9uIHZhbHVlLiBUaGlzIHdpbGwgYmUgYSB2ZXJ5XHJcbiAgICAvLyBzbWFsbCBudW1iZXIgdGhhdCBpcyB0aGUgb3Bwb3NpdGUgb2YgdGhlIGZsb2F0aW5nIHBvaW50IHByZWNpc2lvbiBsb3NzLlxyXG4gICAgdmFyIGVycm9yQ29tcGVuc2F0aW9uID0gMDtcclxuXHJcbiAgICAvLyB0aGlzIHdpbGwgYmUgZWFjaCBudW1iZXIgaW4gdGhlIGxpc3QgY29ycmVjdGVkIHdpdGggdGhlIGNvbXBlbnNhdGlvbiB2YWx1ZS5cclxuICAgIHZhciBjb3JyZWN0ZWRDdXJyZW50VmFsdWU7XHJcblxyXG4gICAgLy8gYW5kIHRoaXMgd2lsbCBiZSB0aGUgbmV4dCBzdW1cclxuICAgIHZhciBuZXh0U3VtO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIC8vIGZpcnN0IGNvcnJlY3QgdGhlIHZhbHVlIHRoYXQgd2UncmUgZ29pbmcgdG8gYWRkIHRvIHRoZSBzdW1cclxuICAgICAgICBjb3JyZWN0ZWRDdXJyZW50VmFsdWUgPSB4W2ldIC0gZXJyb3JDb21wZW5zYXRpb247XHJcblxyXG4gICAgICAgIC8vIGNvbXB1dGUgdGhlIG5leHQgc3VtLiBzdW0gaXMgbGlrZWx5IGEgbXVjaCBsYXJnZXIgbnVtYmVyXHJcbiAgICAgICAgLy8gdGhhbiBjb3JyZWN0ZWRDdXJyZW50VmFsdWUsIHNvIHdlJ2xsIGxvc2UgcHJlY2lzaW9uIGhlcmUsXHJcbiAgICAgICAgLy8gYW5kIG1lYXN1cmUgaG93IG11Y2ggcHJlY2lzaW9uIGlzIGxvc3QgaW4gdGhlIG5leHQgc3RlcFxyXG4gICAgICAgIG5leHRTdW0gPSBzdW0gKyBjb3JyZWN0ZWRDdXJyZW50VmFsdWU7XHJcblxyXG4gICAgICAgIC8vIHdlIGludGVudGlvbmFsbHkgZGlkbid0IGFzc2lnbiBzdW0gaW1tZWRpYXRlbHksIGJ1dCBzdG9yZWRcclxuICAgICAgICAvLyBpdCBmb3Igbm93IHNvIHdlIGNhbiBmaWd1cmUgb3V0IHRoaXM6IGlzIChzdW0gKyBuZXh0VmFsdWUpIC0gbmV4dFZhbHVlXHJcbiAgICAgICAgLy8gbm90IGVxdWFsIHRvIDA/IGlkZWFsbHkgaXQgd291bGQgYmUsIGJ1dCBpbiBwcmFjdGljZSBpdCB3b24ndDpcclxuICAgICAgICAvLyBpdCB3aWxsIGJlIHNvbWUgdmVyeSBzbWFsbCBudW1iZXIuIHRoYXQncyB3aGF0IHdlIHJlY29yZFxyXG4gICAgICAgIC8vIGFzIGVycm9yQ29tcGVuc2F0aW9uLlxyXG4gICAgICAgIGVycm9yQ29tcGVuc2F0aW9uID0gbmV4dFN1bSAtIHN1bSAtIGNvcnJlY3RlZEN1cnJlbnRWYWx1ZTtcclxuXHJcbiAgICAgICAgLy8gbm93IHRoYXQgd2UndmUgY29tcHV0ZWQgaG93IG11Y2ggd2UnbGwgY29ycmVjdCBmb3IgaW4gdGhlIG5leHRcclxuICAgICAgICAvLyBsb29wLCBzdGFydCB0cmVhdGluZyB0aGUgbmV4dFN1bSBhcyB0aGUgY3VycmVudCBzdW0uXHJcbiAgICAgICAgc3VtID0gbmV4dFN1bTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc3VtO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHN1bTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIG1lYW4gPSByZXF1aXJlKCcuL21lYW4nKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgc3VtIG9mIGRldmlhdGlvbnMgdG8gdGhlIE50aCBwb3dlci5cclxuICogV2hlbiBuPTIgaXQncyB0aGUgc3VtIG9mIHNxdWFyZWQgZGV2aWF0aW9ucy5cclxuICogV2hlbiBuPTMgaXQncyB0aGUgc3VtIG9mIGN1YmVkIGRldmlhdGlvbnMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbiBwb3dlclxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBzdW0gb2YgbnRoIHBvd2VyIGRldmlhdGlvbnNcclxuICogQGV4YW1wbGVcclxuICogdmFyIGlucHV0ID0gWzEsIDIsIDNdO1xyXG4gKiAvLyBzaW5jZSB0aGUgdmFyaWFuY2Ugb2YgYSBzZXQgaXMgdGhlIG1lYW4gc3F1YXJlZFxyXG4gKiAvLyBkZXZpYXRpb25zLCB3ZSBjYW4gY2FsY3VsYXRlIHRoYXQgd2l0aCBzdW1OdGhQb3dlckRldmlhdGlvbnM6XHJcbiAqIHZhciB2YXJpYW5jZSA9IHN1bU50aFBvd2VyRGV2aWF0aW9ucyhpbnB1dCkgLyBpbnB1dC5sZW5ndGg7XHJcbiAqL1xyXG5mdW5jdGlvbiBzdW1OdGhQb3dlckRldmlhdGlvbnMoeC8qOiBBcnJheTxudW1iZXI+ICovLCBuLyo6IG51bWJlciAqLykvKjpudW1iZXIqLyB7XHJcbiAgICB2YXIgbWVhblZhbHVlID0gbWVhbih4KSxcclxuICAgICAgICBzdW0gPSAwO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHN1bSArPSBNYXRoLnBvdyh4W2ldIC0gbWVhblZhbHVlLCBuKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc3VtO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHN1bU50aFBvd2VyRGV2aWF0aW9ucztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIHN1bU50aFBvd2VyRGV2aWF0aW9ucyA9IHJlcXVpcmUoJy4vc3VtX250aF9wb3dlcl9kZXZpYXRpb25zJyk7XHJcblxyXG4vKipcclxuICogVGhlIFt2YXJpYW5jZV0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9WYXJpYW5jZSlcclxuICogaXMgdGhlIHN1bSBvZiBzcXVhcmVkIGRldmlhdGlvbnMgZnJvbSB0aGUgbWVhbi5cclxuICpcclxuICogVGhpcyBpcyBhbiBpbXBsZW1lbnRhdGlvbiBvZiB2YXJpYW5jZSwgbm90IHNhbXBsZSB2YXJpYW5jZTpcclxuICogc2VlIHRoZSBgc2FtcGxlVmFyaWFuY2VgIG1ldGhvZCBpZiB5b3Ugd2FudCBhIHNhbXBsZSBtZWFzdXJlLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggYSBwb3B1bGF0aW9uXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHZhcmlhbmNlOiBhIHZhbHVlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB6ZXJvLlxyXG4gKiB6ZXJvIGluZGljYXRlcyB0aGF0IGFsbCB2YWx1ZXMgYXJlIGlkZW50aWNhbC5cclxuICogQGV4YW1wbGVcclxuICogc3MudmFyaWFuY2UoWzEsIDIsIDMsIDQsIDUsIDZdKTsgLy89IDIuOTE3XHJcbiAqL1xyXG5mdW5jdGlvbiB2YXJpYW5jZSh4Lyo6IEFycmF5PG51bWJlcj4gKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgLy8gVGhlIHZhcmlhbmNlIG9mIG5vIG51bWJlcnMgaXMgbnVsbFxyXG4gICAgaWYgKHgubGVuZ3RoID09PSAwKSB7IHJldHVybiBOYU47IH1cclxuXHJcbiAgICAvLyBGaW5kIHRoZSBtZWFuIG9mIHNxdWFyZWQgZGV2aWF0aW9ucyBiZXR3ZWVuIHRoZVxyXG4gICAgLy8gbWVhbiB2YWx1ZSBhbmQgZWFjaCB2YWx1ZS5cclxuICAgIHJldHVybiBzdW1OdGhQb3dlckRldmlhdGlvbnMoeCwgMikgLyB4Lmxlbmd0aDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB2YXJpYW5jZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxuLyoqXHJcbiAqIFRoZSBbWi1TY29yZSwgb3IgU3RhbmRhcmQgU2NvcmVdKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvU3RhbmRhcmRfc2NvcmUpLlxyXG4gKlxyXG4gKiBUaGUgc3RhbmRhcmQgc2NvcmUgaXMgdGhlIG51bWJlciBvZiBzdGFuZGFyZCBkZXZpYXRpb25zIGFuIG9ic2VydmF0aW9uXHJcbiAqIG9yIGRhdHVtIGlzIGFib3ZlIG9yIGJlbG93IHRoZSBtZWFuLiBUaHVzLCBhIHBvc2l0aXZlIHN0YW5kYXJkIHNjb3JlXHJcbiAqIHJlcHJlc2VudHMgYSBkYXR1bSBhYm92ZSB0aGUgbWVhbiwgd2hpbGUgYSBuZWdhdGl2ZSBzdGFuZGFyZCBzY29yZVxyXG4gKiByZXByZXNlbnRzIGEgZGF0dW0gYmVsb3cgdGhlIG1lYW4uIEl0IGlzIGEgZGltZW5zaW9ubGVzcyBxdWFudGl0eVxyXG4gKiBvYnRhaW5lZCBieSBzdWJ0cmFjdGluZyB0aGUgcG9wdWxhdGlvbiBtZWFuIGZyb20gYW4gaW5kaXZpZHVhbCByYXdcclxuICogc2NvcmUgYW5kIHRoZW4gZGl2aWRpbmcgdGhlIGRpZmZlcmVuY2UgYnkgdGhlIHBvcHVsYXRpb24gc3RhbmRhcmRcclxuICogZGV2aWF0aW9uLlxyXG4gKlxyXG4gKiBUaGUgei1zY29yZSBpcyBvbmx5IGRlZmluZWQgaWYgb25lIGtub3dzIHRoZSBwb3B1bGF0aW9uIHBhcmFtZXRlcnM7XHJcbiAqIGlmIG9uZSBvbmx5IGhhcyBhIHNhbXBsZSBzZXQsIHRoZW4gdGhlIGFuYWxvZ291cyBjb21wdXRhdGlvbiB3aXRoXHJcbiAqIHNhbXBsZSBtZWFuIGFuZCBzYW1wbGUgc3RhbmRhcmQgZGV2aWF0aW9uIHlpZWxkcyB0aGVcclxuICogU3R1ZGVudCdzIHQtc3RhdGlzdGljLlxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0geFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWVhblxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhbmRhcmREZXZpYXRpb25cclxuICogQHJldHVybiB7bnVtYmVyfSB6IHNjb3JlXHJcbiAqIEBleGFtcGxlXHJcbiAqIHNzLnpTY29yZSg3OCwgODAsIDUpOyAvLz0gLTAuNFxyXG4gKi9cclxuZnVuY3Rpb24gelNjb3JlKHgvKjpudW1iZXIqLywgbWVhbi8qOm51bWJlciovLCBzdGFuZGFyZERldmlhdGlvbi8qOm51bWJlciovKS8qOm51bWJlciovIHtcclxuICAgIHJldHVybiAoeCAtIG1lYW4pIC8gc3RhbmRhcmREZXZpYXRpb247XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gelNjb3JlO1xyXG4iLCJpbXBvcnQge0NoYXJ0V2l0aENvbG9yR3JvdXBzLCBDaGFydFdpdGhDb2xvckdyb3Vwc0NvbmZpZ30gZnJvbSBcIi4vY2hhcnQtd2l0aC1jb2xvci1ncm91cHNcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IHtMZWdlbmR9IGZyb20gXCIuL2xlZ2VuZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJhckNoYXJ0Q29uZmlnIGV4dGVuZHMgQ2hhcnRXaXRoQ29sb3JHcm91cHNDb25maWcge1xyXG5cclxuICAgIHN2Z0NsYXNzID0gdGhpcy5jc3NDbGFzc1ByZWZpeCArICdiYXItY2hhcnQnO1xyXG4gICAgc2hvd0xlZ2VuZCA9IHRydWU7XHJcbiAgICBzaG93VG9vbHRpcCA9IHRydWU7XHJcbiAgICB4ID0gey8vIFggYXhpcyBjb25maWdcclxuICAgICAgICBsYWJlbDogJycsIC8vIGF4aXMgbGFiZWxcclxuICAgICAgICBrZXk6IDAsXHJcbiAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IFV0aWxzLmlzTnVtYmVyKGQpID8gZCA6IGRba2V5XSwgLy8geCB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgIHNjYWxlOiBcIm9yZGluYWxcIixcclxuICAgICAgICB0aWNrczogdW5kZWZpbmVkLFxyXG4gICAgfTtcclxuICAgIHkgPSB7Ly8gWSBheGlzIGNvbmZpZ1xyXG4gICAgICAgIGtleTogMSxcclxuICAgICAgICB2YWx1ZTogKGQsIGtleSkgPT4gVXRpbHMuaXNOdW1iZXIoZCkgPyBkIDogZFtrZXldLCAvLyB4IHZhbHVlIGFjY2Vzc29yXHJcbiAgICAgICAgbGFiZWw6ICcnLCAvLyBheGlzIGxhYmVsLFxyXG4gICAgICAgIG9yaWVudDogXCJsZWZ0XCIsXHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCJcclxuICAgIH07XHJcbiAgICB0cmFuc2l0aW9uID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHZhciBjb25maWcgPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoY3VzdG9tKSB7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQmFyQ2hhcnQgZXh0ZW5kcyBDaGFydFdpdGhDb2xvckdyb3VwcyB7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBzdXBlcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBuZXcgQmFyQ2hhcnRDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZykge1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IEJhckNoYXJ0Q29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueCA9IHt9O1xyXG4gICAgICAgIHRoaXMucGxvdC55ID0ge307XHJcblxyXG4gICAgICAgIHRoaXMuY29tcHV0ZVBsb3RTaXplKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFkoKTtcclxuICAgICAgICB0aGlzLnNldHVwWCgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBHcm91cFN0YWNrcygpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBZRG9tYWluKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBzZXR1cFgoKSB7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB4ID0gcGxvdC54O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWcueDtcclxuXHJcbiAgICAgICAgLyogKlxyXG4gICAgICAgICAqIHZhbHVlIGFjY2Vzc29yIC0gcmV0dXJucyB0aGUgdmFsdWUgdG8gZW5jb2RlIGZvciBhIGdpdmVuIGRhdGEgb2JqZWN0LlxyXG4gICAgICAgICAqIHNjYWxlIC0gbWFwcyB2YWx1ZSB0byBhIHZpc3VhbCBkaXNwbGF5IGVuY29kaW5nLCBzdWNoIGFzIGEgcGl4ZWwgcG9zaXRpb24uXHJcbiAgICAgICAgICogbWFwIGZ1bmN0aW9uIC0gbWFwcyBmcm9tIGRhdGEgdmFsdWUgdG8gZGlzcGxheSB2YWx1ZVxyXG4gICAgICAgICAqIGF4aXMgLSBzZXRzIHVwIGF4aXNcclxuICAgICAgICAgKiovXHJcbiAgICAgICAgeC52YWx1ZSA9IGQgPT4gY29uZi52YWx1ZShkLCBjb25mLmtleSk7XHJcbiAgICAgICAgeC5zY2FsZSA9IGQzLnNjYWxlLm9yZGluYWwoKS5yYW5nZVJvdW5kQmFuZHMoWzAsIHBsb3Qud2lkdGhdLCAuMDgpO1xyXG4gICAgICAgIHgubWFwID0gZCA9PiB4LnNjYWxlKHgudmFsdWUoZCkpO1xyXG5cclxuICAgICAgICB4LmF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHguc2NhbGUpLm9yaWVudChjb25mLm9yaWVudCk7XHJcblxyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5wbG90LmRhdGE7XHJcbiAgICAgICAgdmFyIGRvbWFpbjtcclxuICAgICAgICBpZiAoIWRhdGEgfHwgIWRhdGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGRvbWFpbiA9IFtdO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuY29uZmlnLnNlcmllcykge1xyXG4gICAgICAgICAgICBkb21haW4gPSBkMy5tYXAoZGF0YSwgeC52YWx1ZSkua2V5cygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRvbWFpbiA9IGQzLm1hcChkYXRhWzBdLnZhbHVlcywgeC52YWx1ZSkua2V5cygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcGxvdC54LnNjYWxlLmRvbWFpbihkb21haW4pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBZKCkge1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeSA9IHBsb3QueTtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnLnk7XHJcbiAgICAgICAgeS52YWx1ZSA9IGQgPT4gY29uZi52YWx1ZShkLCBjb25mLmtleSk7XHJcbiAgICAgICAgeS5zY2FsZSA9IGQzLnNjYWxlW2NvbmYuc2NhbGVdKCkucmFuZ2UoW3Bsb3QuaGVpZ2h0LCAwXSk7XHJcbiAgICAgICAgeS5tYXAgPSBkID0+IHkuc2NhbGUoeS52YWx1ZShkKSk7XHJcblxyXG4gICAgICAgIHkuYXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeS5zY2FsZSkub3JpZW50KGNvbmYub3JpZW50KTtcclxuICAgICAgICBpZiAoY29uZi50aWNrcykge1xyXG4gICAgICAgICAgICB5LmF4aXMudGlja3MoY29uZi50aWNrcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cFlEb21haW4oKSB7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLnBsb3QuZGF0YTtcclxuICAgICAgICB2YXIgZG9tYWluO1xyXG4gICAgICAgIHZhciB5U3RhY2tNYXggPSBkMy5tYXgocGxvdC5sYXllcnMsIGxheWVyID0+IGQzLm1heChsYXllci5wb2ludHMsIGQgPT4gZC55MCArIGQueSkpO1xyXG5cclxuXHJcbiAgICAgICAgLy8gdmFyIG1pbiA9IGQzLm1pbihkYXRhLCBzPT5kMy5taW4ocy52YWx1ZXMsIHBsb3QueS52YWx1ZSkpO1xyXG4gICAgICAgIHZhciBtYXggPSB5U3RhY2tNYXg7XHJcbiAgICAgICAgZG9tYWluID0gWzAsIG1heF07XHJcblxyXG4gICAgICAgIHBsb3QueS5zY2FsZS5kb21haW4oZG9tYWluKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnIHBsb3QueS5zY2FsZS5kb21haW4nLCBwbG90Lnkuc2NhbGUuZG9tYWluKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwR3JvdXBTdGFja3MoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuZ3JvdXBEYXRhKCk7XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC5zdGFjayA9IGQzLmxheW91dC5zdGFjaygpLnZhbHVlcyhkPT5kLnBvaW50cyk7XHJcbiAgICAgICAgdGhpcy5wbG90Lmdyb3VwZWREYXRhLmZvckVhY2gocz0+IHtcclxuICAgICAgICAgICAgcy5wb2ludHMgPSBzLnZhbHVlcy5tYXAodj0+c2VsZi5tYXBUb1BvaW50KHYpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnBsb3QubGF5ZXJzID0gdGhpcy5wbG90LnN0YWNrKHRoaXMucGxvdC5ncm91cGVkRGF0YSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIG1hcFRvUG9pbnQodmFsdWUpIHtcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB4OiBwbG90LngudmFsdWUodmFsdWUpLFxyXG4gICAgICAgICAgICB5OiBwYXJzZUZsb2F0KHBsb3QueS52YWx1ZSh2YWx1ZSkpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBkcmF3QXhpc1goKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBheGlzQ29uZiA9IHRoaXMuY29uZmlnLng7XHJcbiAgICAgICAgdmFyIGF4aXMgPSBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiICsgc2VsZi5wcmVmaXhDbGFzcygnYXhpcy14JykgKyBcIi5cIiArIHNlbGYucHJlZml4Q2xhc3MoJ2F4aXMnKSArIChzZWxmLmNvbmZpZy5ndWlkZXMgPyAnJyA6ICcuJyArIHNlbGYucHJlZml4Q2xhc3MoJ25vLWd1aWRlcycpKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIHBsb3QuaGVpZ2h0ICsgXCIpXCIpO1xyXG5cclxuICAgICAgICB2YXIgYXhpc1QgPSBheGlzO1xyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy50cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGF4aXNUID0gYXhpcy50cmFuc2l0aW9uKCkuZWFzZShcInNpbi1pbi1vdXRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBheGlzVC5jYWxsKHBsb3QueC5heGlzKTtcclxuXHJcbiAgICAgICAgYXhpcy5zZWxlY3RPckFwcGVuZChcInRleHQuXCIgKyBzZWxmLnByZWZpeENsYXNzKCdsYWJlbCcpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChwbG90LndpZHRoIC8gMikgKyBcIixcIiArIChwbG90Lm1hcmdpbi5ib3R0b20pICsgXCIpXCIpICAvLyB0ZXh0IGlzIGRyYXduIG9mZiB0aGUgc2NyZWVuIHRvcCBsZWZ0LCBtb3ZlIGRvd24gYW5kIG91dCBhbmQgcm90YXRlXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCItMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGF4aXNDb25mLmxhYmVsKTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhd0F4aXNZKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgYXhpc0NvbmYgPSB0aGlzLmNvbmZpZy55O1xyXG4gICAgICAgIHZhciBheGlzID0gc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIiArIHNlbGYucHJlZml4Q2xhc3MoJ2F4aXMteScpICsgXCIuXCIgKyBzZWxmLnByZWZpeENsYXNzKCdheGlzJykgKyAoc2VsZi5jb25maWcuZ3VpZGVzID8gJycgOiAnLicgKyBzZWxmLnByZWZpeENsYXNzKCduby1ndWlkZXMnKSkpO1xyXG5cclxuICAgICAgICB2YXIgYXhpc1QgPSBheGlzO1xyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy50cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGF4aXNUID0gYXhpcy50cmFuc2l0aW9uKCkuZWFzZShcInNpbi1pbi1vdXRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBheGlzVC5jYWxsKHBsb3QueS5heGlzKTtcclxuXHJcbiAgICAgICAgYXhpcy5zZWxlY3RPckFwcGVuZChcInRleHQuXCIgKyBzZWxmLnByZWZpeENsYXNzKCdsYWJlbCcpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIC1wbG90Lm1hcmdpbi5sZWZ0ICsgXCIsXCIgKyAocGxvdC5oZWlnaHQgLyAyKSArIFwiKXJvdGF0ZSgtOTApXCIpICAvLyB0ZXh0IGlzIGRyYXduIG9mZiB0aGUgc2NyZWVuIHRvcCBsZWZ0LCBtb3ZlIGRvd24gYW5kIG91dCBhbmQgcm90YXRlXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCIxZW1cIilcclxuICAgICAgICAgICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoYXhpc0NvbmYubGFiZWwpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgZHJhd0JhcnMoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygnbGF5ZXJzJywgcGxvdC5sYXllcnMpO1xyXG5cclxuICAgICAgICB2YXIgbGF5ZXJDbGFzcyA9IHRoaXMucHJlZml4Q2xhc3MoXCJsYXllclwiKTtcclxuXHJcbiAgICAgICAgdmFyIGJhckNsYXNzID0gdGhpcy5wcmVmaXhDbGFzcyhcImJhclwiKTtcclxuICAgICAgICB2YXIgbGF5ZXIgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwiLlwiICsgbGF5ZXJDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGxvdC5sYXllcnMpO1xyXG5cclxuICAgICAgICBsYXllci5lbnRlcigpLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBsYXllckNsYXNzKTtcclxuXHJcbiAgICAgICAgdmFyIGJhciA9IGxheWVyLnNlbGVjdEFsbChcIi5cIiArIGJhckNsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShkID0+IGQucG9pbnRzKTtcclxuXHJcbiAgICAgICAgYmFyLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGJhckNsYXNzKVxyXG4gICAgICAgICAgICAuYXBwZW5kKFwicmVjdFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgMSk7XHJcblxyXG5cclxuICAgICAgICB2YXIgYmFyUmVjdCA9IGJhci5zZWxlY3QoXCJyZWN0XCIpO1xyXG5cclxuICAgICAgICB2YXIgYmFyUmVjdFQgPSBiYXJSZWN0O1xyXG4gICAgICAgIHZhciBiYXJUID0gYmFyO1xyXG4gICAgICAgIHZhciBsYXllclQgPSBsYXllcjtcclxuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgICAgIGJhclJlY3RUID0gYmFyUmVjdC50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgICAgIGJhclQgPSBiYXIudHJhbnNpdGlvbigpO1xyXG4gICAgICAgICAgICBsYXllclQgPSBsYXllci50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgeURvbWFpbiA9IHBsb3QueS5zY2FsZS5kb21haW4oKTtcclxuICAgICAgICBiYXJULmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgcGxvdC54LnNjYWxlKGQueCkgKyBcIixcIiArIChwbG90Lnkuc2NhbGUoZC55MCArIGQueSkpICsgXCIpXCI7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGJhclJlY3RUXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgcGxvdC54LnNjYWxlLnJhbmdlQmFuZCgpKVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBkID0+IHBsb3QueS5zY2FsZShkLnkwKSAtIHBsb3QueS5zY2FsZShkLnkwICsgZC55IC0geURvbWFpblswXSkpO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKHRoaXMucGxvdC5zZXJpZXNDb2xvcikge1xyXG4gICAgICAgICAgICBsYXllclRcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCB0aGlzLnBsb3Quc2VyaWVzQ29sb3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBsb3QudG9vbHRpcCkge1xyXG4gICAgICAgICAgICBiYXIub24oXCJtb3VzZW92ZXJcIiwgZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNob3dUb29sdGlwKGQueSk7XHJcbiAgICAgICAgICAgIH0pLm9uKFwibW91c2VvdXRcIiwgZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmhpZGVUb29sdGlwKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsYXllci5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICAgICAgYmFyLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUobmV3RGF0YSkge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuICAgICAgICB0aGlzLmRyYXdBeGlzWCgpO1xyXG4gICAgICAgIHRoaXMuZHJhd0F4aXNZKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3QmFycygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHtDaGFydCwgQ2hhcnRDb25maWd9IGZyb20gXCIuL2NoYXJ0XCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcblxyXG5leHBvcnQgY2xhc3MgQm94UGxvdEJhc2VDb25maWcgZXh0ZW5kcyBDaGFydENvbmZpZ3tcclxuXHJcbiAgICBzdmdDbGFzcyA9IHRoaXMuY3NzQ2xhc3NQcmVmaXggKyAnYm94LXBsb3QnO1xyXG4gICAgc2hvd0xlZ2VuZCA9IHRydWU7XHJcbiAgICBzaG93VG9vbHRpcCA9IHRydWU7XHJcbiAgICB4ID0gey8vIFggYXhpcyBjb25maWdcclxuICAgICAgICB0aXRsZTogJycsIC8vIGF4aXMgbGFiZWxcclxuICAgICAgICB2YWx1ZTogcyA9PiBzLmtleSwgLy8geCB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgIGd1aWRlczogZmFsc2UsIC8vc2hvdyBheGlzIGd1aWRlc1xyXG4gICAgICAgIHNjYWxlOiBcIm9yZGluYWxcIlxyXG5cclxuICAgIH07XHJcbiAgICB5ID0gey8vIFkgYXhpcyBjb25maWdcclxuICAgICAgICB0aXRsZTogJycsXHJcbiAgICAgICAgdmFsdWU6IGQgPT4gZCwgLy8geSB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiLFxyXG4gICAgICAgIG9yaWVudDogJ2xlZnQnLFxyXG4gICAgICAgIGRvbWFpbk1hcmdpbjogMC4xLFxyXG4gICAgICAgIGd1aWRlczogdHJ1ZSAvL3Nob3cgYXhpcyBndWlkZXNcclxuICAgIH07XHJcbiAgICBRMSA9IGQgPT4gZC52YWx1ZXMuUTE7XHJcbiAgICBRMiA9IGQgPT4gZC52YWx1ZXMuUTI7XHJcbiAgICBRMyA9IGQgPT4gZC52YWx1ZXMuUTM7XHJcbiAgICBXbCA9IGQgPT4gZC52YWx1ZXMud2hpc2tlckxvdztcclxuICAgIFdoID0gZCA9PiBkLnZhbHVlcy53aGlza2VySGlnaDtcclxuICAgIG91dGxpZXJzPSBkPT4gZC52YWx1ZXMub3V0bGllcnM7XHJcbiAgICBvdXRsaWVyVmFsdWUgPSAoZCxpKT0+IGQ7XHJcbiAgICBvdXRsaWVyTGFiZWwgPSAoZCxpKT0+IGQ7XHJcbiAgICBtaW5Cb3hXaWR0aCA9IDM1O1xyXG4gICAgbWF4Qm94V2lkdGggPSAxMDA7XHJcblxyXG4gICAgdHJhbnNpdGlvbiA9IHRydWU7XHJcbiAgICBjb2xvciA9ICB1bmRlZmluZWQ7Ly8gc3RyaW5nIG9yIGZ1bmN0aW9uIHJldHVybmluZyBjb2xvcidzIHZhbHVlIGZvciBjb2xvciBzY2FsZVxyXG4gICAgZDNDb2xvckNhdGVnb3J5PSAnY2F0ZWdvcnkxMCc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIGlmKGN1c3RvbSl7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQm94UGxvdEJhc2UgZXh0ZW5kcyBDaGFydHtcclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIG5ldyBCb3hQbG90QmFzZUNvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKXtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBCb3hQbG90QmFzZUNvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpe1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcbiAgICAgICAgc3VwZXIuY29tcHV0ZVBsb3RTaXplKCk7XHJcbiAgICAgICAgdGhpcy5wbG90LnggPSB7fTtcclxuICAgICAgICB0aGlzLnBsb3QueSA9IHt9O1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QuZGF0YSA9IHRoaXMuZ2V0RGF0YVRvUGxvdCgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBZKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFgoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cENvbG9yKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGdldERhdGFUb1Bsb3QoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cFgoKSB7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB4ID0gcGxvdC54O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWcueDtcclxuXHJcbiAgICAgICAgeC52YWx1ZSA9IGNvbmYudmFsdWU7XHJcbiAgICAgICAgeC5zY2FsZSA9IGQzLnNjYWxlLm9yZGluYWwoKS5yYW5nZVJvdW5kQmFuZHMoWzAsIHBsb3Qud2lkdGhdLCAuMDgpO1xyXG4gICAgICAgIHgubWFwID0gZCA9PiB4LnNjYWxlKHgudmFsdWUoZCkpO1xyXG5cclxuICAgICAgICB4LmF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHguc2NhbGUpLm9yaWVudChjb25mLm9yaWVudCk7XHJcbiAgICAgICAgaWYoY29uZi5ndWlkZXMpe1xyXG4gICAgICAgICAgICB4LmF4aXMudGlja1NpemUoLXBsb3QuaGVpZ2h0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5wbG90LmRhdGE7XHJcbiAgICAgICAgdmFyIGRvbWFpbjtcclxuICAgICAgICBpZiAoIWRhdGEgfHwgIWRhdGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGRvbWFpbiA9IFtdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRvbWFpbiA9IGRhdGEubWFwKHgudmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcGxvdC54LnNjYWxlLmRvbWFpbihkb21haW4pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBZKCkge1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeSA9IHBsb3QueTtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnLnk7XHJcbiAgICAgICAgeS52YWx1ZSA9IGQgPT4gY29uZi52YWx1ZS5jYWxsKHRoaXMuY29uZmlnLCBkKTtcclxuICAgICAgICB5LnNjYWxlID0gZDMuc2NhbGVbY29uZi5zY2FsZV0oKS5yYW5nZShbcGxvdC5oZWlnaHQsIDBdKTtcclxuICAgICAgICB5Lm1hcCA9IGQgPT4geS5zY2FsZSh5LnZhbHVlKGQpKTtcclxuXHJcbiAgICAgICAgeS5heGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh5LnNjYWxlKS5vcmllbnQoY29uZi5vcmllbnQpO1xyXG4gICAgICAgIGlmIChjb25mLnRpY2tzKSB7XHJcbiAgICAgICAgICAgIHkuYXhpcy50aWNrcyhjb25mLnRpY2tzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoY29uZi5ndWlkZXMpe1xyXG4gICAgICAgICAgICB5LmF4aXMudGlja1NpemUoLXBsb3Qud2lkdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldHVwWURvbWFpbigpO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cFlEb21haW4oKSB7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLnBsb3QuZGF0YTtcclxuICAgICAgICB2YXIgYyA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB2YXIgdmFsdWVzID0gW10sIHlNaW4sIHlNYXg7XHJcbiAgICAgICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uIChkLCBpKSB7XHJcbiAgICAgICAgICAgIGxldCBxMSA9IGMuUTEoZCksIFxyXG4gICAgICAgICAgICAgICAgcTMgPSBjLlEzKGQpLCBcclxuICAgICAgICAgICAgICAgIHdsID0gYy5XbChkKSwgXHJcbiAgICAgICAgICAgICAgICB3aCA9IGMuV2goZCksXHJcbiAgICAgICAgICAgICAgICBvdXRsaWVycyA9IGMub3V0bGllcnMoZCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAob3V0bGllcnMpIHtcclxuICAgICAgICAgICAgICAgIG91dGxpZXJzLmZvckVhY2goZnVuY3Rpb24gKG8sIGkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaChjLm91dGxpZXJWYWx1ZShvLCBpKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAod2wpIHsgdmFsdWVzLnB1c2god2wpIH1cclxuICAgICAgICAgICAgaWYgKHExKSB7IHZhbHVlcy5wdXNoKHExKSB9XHJcbiAgICAgICAgICAgIGlmIChxMykgeyB2YWx1ZXMucHVzaChxMykgfVxyXG4gICAgICAgICAgICBpZiAod2gpIHsgdmFsdWVzLnB1c2god2gpIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB5TWluID0gZDMubWluKHZhbHVlcyk7XHJcbiAgICAgICAgeU1heCA9IGQzLm1heCh2YWx1ZXMpO1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSAoeU1heC15TWluKSogdGhpcy5jb25maWcueS5kb21haW5NYXJnaW47XHJcbiAgICAgICAgeU1pbi09bWFyZ2luO1xyXG4gICAgICAgIHlNYXgrPW1hcmdpbjtcclxuICAgICAgICB2YXIgZG9tYWluID0gWyB5TWluLCB5TWF4IF0gO1xyXG5cclxuICAgICAgICBwbG90Lnkuc2NhbGUuZG9tYWluKGRvbWFpbik7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhd0F4aXNYKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgYXhpc0NvbmYgPSB0aGlzLmNvbmZpZy54O1xyXG4gICAgICAgIHZhciBheGlzID0gc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIiArIHNlbGYucHJlZml4Q2xhc3MoJ2F4aXMteCcpICsgXCIuXCIgKyBzZWxmLnByZWZpeENsYXNzKCdheGlzJykgKyAoYXhpc0NvbmYuZ3VpZGVzID8gJycgOiAnLicgKyBzZWxmLnByZWZpeENsYXNzKCduby1ndWlkZXMnKSkpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyBwbG90LmhlaWdodCArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgdmFyIGF4aXNUID0gYXhpcztcclxuICAgICAgICBpZiAoc2VsZi5jb25maWcudHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICBheGlzVCA9IGF4aXMudHJhbnNpdGlvbigpLmVhc2UoXCJzaW4taW4tb3V0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXhpc1QuY2FsbChwbG90LnguYXhpcyk7XHJcblxyXG4gICAgICAgIGF4aXMuc2VsZWN0T3JBcHBlbmQoXCJ0ZXh0LlwiK3NlbGYucHJlZml4Q2xhc3MoJ2xhYmVsJykpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyAocGxvdC53aWR0aC8yKSArXCIsXCIrIChwbG90Lm1hcmdpbi5ib3R0b20pICtcIilcIikgIC8vIHRleHQgaXMgZHJhd24gb2ZmIHRoZSBzY3JlZW4gdG9wIGxlZnQsIG1vdmUgZG93biBhbmQgb3V0IGFuZCByb3RhdGVcclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCBcIi0xZW1cIilcclxuICAgICAgICAgICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoYXhpc0NvbmYubGFiZWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICBkcmF3QXhpc1koKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBheGlzQ29uZiA9IHRoaXMuY29uZmlnLnk7XHJcbiAgICAgICAgdmFyIGF4aXMgPSBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiICsgc2VsZi5wcmVmaXhDbGFzcygnYXhpcy15JykgKyBcIi5cIiArIHNlbGYucHJlZml4Q2xhc3MoJ2F4aXMnKSArIChheGlzQ29uZi5ndWlkZXMgPyAnJyA6ICcuJyArIHNlbGYucHJlZml4Q2xhc3MoJ25vLWd1aWRlcycpKSk7XHJcblxyXG4gICAgICAgIHZhciBheGlzVCA9IGF4aXM7XHJcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLnRyYW5zaXRpb24pIHtcclxuICAgICAgICAgICAgYXhpc1QgPSBheGlzLnRyYW5zaXRpb24oKS5lYXNlKFwic2luLWluLW91dFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGF4aXNULmNhbGwocGxvdC55LmF4aXMpO1xyXG5cclxuICAgICAgICBheGlzLnNlbGVjdE9yQXBwZW5kKFwidGV4dC5cIiArIHNlbGYucHJlZml4Q2xhc3MoJ2xhYmVsJykpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgLXBsb3QubWFyZ2luLmxlZnQgKyBcIixcIiArIChwbG90LmhlaWdodCAvIDIpICsgXCIpcm90YXRlKC05MClcIikgIC8vIHRleHQgaXMgZHJhd24gb2ZmIHRoZSBzY3JlZW4gdG9wIGxlZnQsIG1vdmUgZG93biBhbmQgb3V0IGFuZCByb3RhdGVcclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCBcIjFlbVwiKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAudGV4dChheGlzQ29uZi50aXRsZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRyYXdCb3hQbG90cygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgICAgIHBsb3QgPSBzZWxmLnBsb3QsXHJcbiAgICAgICAgICAgIGNvbmZpZyA9IHNlbGYuY29uZmlnLFxyXG4gICAgICAgICAgICBib3hwbG90Q2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwiYm94cGxvdC1pdGVtXCIpXHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGJveHBsb3RzID0gc2VsZi5zdmdHLnNlbGVjdEFsbCgnLicrYm94cGxvdENsYXNzKS5kYXRhKHBsb3QuZGF0YSk7XHJcbiAgICAgICAgdmFyIGJveHBsb3RFbnRlciA9IGJveHBsb3RzLmVudGVyKClcclxuICAgICAgICAgICAgLmFwcGVuZCgnZycpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsIGJveHBsb3RDbGFzcylcclxuICAgICAgICAgICAgLnN0eWxlKCdzdHJva2Utb3BhY2l0eScsIDFlLTYpXHJcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbC1vcGFjaXR5JywgMWUtNik7XHJcblxyXG4gICAgICAgIHZhciBkdXJhdGlvbiA9IDEwMDA7XHJcbiAgICAgICAgdmFyIGJveHBsb3RzVCA9IGJveHBsb3RzO1xyXG4gICAgICAgIGlmIChzZWxmLnRyYW5zaXRpb25FbmFibGVkKCkpIHtcclxuICAgICAgICAgICAgYm94cGxvdHNUID0gYm94cGxvdHMudHJhbnNpdGlvbigpO1xyXG4gICAgICAgICAgICBib3hwbG90c1QuZGVsYXkoZnVuY3Rpb24oZCxpKSB7IHJldHVybiBpICogZHVyYXRpb24gLyBwbG90LmRhdGEubGVuZ3RoIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBib3hwbG90c1RcclxuICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgcGxvdC5jb2xvcilcclxuICAgICAgICAgICAgLnN0eWxlKCdzdHJva2Utb3BhY2l0eScsIDEpXHJcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbC1vcGFjaXR5JywgMC43NSlcclxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkLGkpID0+J3RyYW5zbGF0ZSgnICsgKHBsb3QueC5tYXAoZCxpKSArIHBsb3QueC5zY2FsZS5yYW5nZUJhbmQoKSAqIDAuMDUpICsgJywgMCknKVxyXG4gICAgICAgIGJveHBsb3RzLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcblxyXG4gICAgICAgIHZhciBib3hXaWR0aCA9ICFjb25maWcubWF4Qm94V2lkdGggPyBwbG90Lnguc2NhbGUucmFuZ2VCYW5kKCkgKiAwLjkgOiBNYXRoLm1pbihjb25maWcubWF4Qm94V2lkdGgsIE1hdGgubWF4KGNvbmZpZy5taW5Cb3hXaWR0aCwgcGxvdC54LnNjYWxlLnJhbmdlQmFuZCgpICogMC45KSk7XHJcbiAgICAgICAgdmFyIGJveExlZnQgID0gcGxvdC54LnNjYWxlLnJhbmdlQmFuZCgpICogMC40NSAtIGJveFdpZHRoLzI7XHJcbiAgICAgICAgdmFyIGJveFJpZ2h0ID0gcGxvdC54LnNjYWxlLnJhbmdlQmFuZCgpICogMC40NSArIGJveFdpZHRoLzI7XHJcblxyXG4gICAgICAgIHZhciBib3hDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJib3hcIik7XHJcblxyXG4gICAgICAgIGJveHBsb3RFbnRlci5hcHBlbmQoJ3JlY3QnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCBib3hDbGFzcylcclxuICAgICAgICAgICAgLy8gdG9vbHRpcCBldmVudHNcclxuICAgICAgICAgICAgLm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbihkLGkpIHtcclxuICAgICAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKCdob3ZlcicsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGh0bWwgPSAnUTM6ICcrY29uZmlnLlEzKGQsaSkrJzxici8+UTI6ICcrY29uZmlnLlEyKGQsaSkrJzxici8+UTE6ICcrY29uZmlnLlExKGQsaSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNob3dUb29sdGlwKGh0bWwpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbignbW91c2VvdXQnLCBmdW5jdGlvbihkLGkpIHtcclxuICAgICAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKCdob3ZlcicsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuaGlkZVRvb2x0aXAoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciBib3hSZWN0cyA9IGJveHBsb3RzLnNlbGVjdCgncmVjdC4nK2JveENsYXNzKTtcclxuXHJcbiAgICAgICAgdmFyIGJveFJlY3RzVCA9IGJveFJlY3RzO1xyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy50cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGJveFJlY3RzVCA9IGJveFJlY3RzLnRyYW5zaXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJveFJlY3RzVC5hdHRyKCd5JywgKGQsaSkgPT4gcGxvdC55LnNjYWxlKGNvbmZpZy5RMyhkKSkpXHJcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIGJveFdpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cigneCcsIGJveExlZnQgKVxyXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQsaSkgPT4gTWF0aC5hYnMocGxvdC55LnNjYWxlKGNvbmZpZy5RMyhkKSkgLSBwbG90Lnkuc2NhbGUoY29uZmlnLlExKGQpKSkgfHwgMSlcclxuICAgICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCBwbG90LmNvbG9yKTtcclxuXHJcbiAgICAgICAgLy8gbWVkaWFuIGxpbmVcclxuICAgICAgICB2YXIgbWVkaWFuQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKCdtZWRpYW4nKTtcclxuICAgICAgICBib3hwbG90RW50ZXIuYXBwZW5kKCdsaW5lJykuYXR0cignY2xhc3MnLCBtZWRpYW5DbGFzcyk7XHJcblxyXG4gICAgICAgIGJveHBsb3RzLnNlbGVjdCgnbGluZS4nK21lZGlhbkNsYXNzKVxyXG4gICAgICAgICAgICAuYXR0cigneDEnLCBib3hMZWZ0KVxyXG4gICAgICAgICAgICAuYXR0cigneTEnLCAoZCxpKSA9PiBwbG90Lnkuc2NhbGUoY29uZmlnLlEyKGQpKSlcclxuICAgICAgICAgICAgLmF0dHIoJ3gyJywgYm94UmlnaHQpXHJcbiAgICAgICAgICAgIC5hdHRyKCd5MicsIChkLGkpID0+IHBsb3QueS5zY2FsZShjb25maWcuUTIoZCkpKTtcclxuXHJcblxyXG4gICAgICAgIC8vd2hpc2tlcnNcclxuXHJcbiAgICAgICAgdmFyIHdoaXNrZXJDbGFzcz0gc2VsZi5wcmVmaXhDbGFzcyhcIndoaXNrZXJcIiksXHJcbiAgICAgICAgICAgIHRpY2tDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJib3hwbG90LXRpY2tcIik7XHJcblxyXG4gICAgICAgIHZhciB3aGlza2VycyA9IFt7a2V5OiAnbG93JywgdmFsdWU6IGNvbmZpZy5XbH0sIHtrZXk6ICdoaWdoJywgdmFsdWU6IGNvbmZpZy5XaH1dO1xyXG5cclxuICAgICAgICBib3hwbG90RW50ZXIuZWFjaChmdW5jdGlvbihkLGkpIHtcclxuICAgICAgICAgICAgdmFyIGJveCA9IGQzLnNlbGVjdCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIHdoaXNrZXJzLmZvckVhY2goZj0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChmLnZhbHVlKGQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYm94LmFwcGVuZCgnbGluZScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgcGxvdC5jb2xvcihkLGkpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCB3aGlza2VyQ2xhc3MrJyAnICsgYm94cGxvdENsYXNzKyctJytmLmtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYm94LmFwcGVuZCgnbGluZScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgcGxvdC5jb2xvcihkLGkpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCB0aWNrQ2xhc3MrJyAnICsgYm94cGxvdENsYXNzKyctJytmLmtleSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB3aGlza2Vycy5mb3JFYWNoKGYgPT4ge1xyXG4gICAgICAgICAgICB2YXIgZW5kcG9pbnQgPSAoZi5rZXkgPT09ICdsb3cnKSA/IGNvbmZpZy5RMSA6IGNvbmZpZy5RMztcclxuXHJcbiAgICAgICAgICAgIGJveHBsb3RzLnNlbGVjdCgnLicrd2hpc2tlckNsYXNzKycuJytib3hwbG90Q2xhc3MrJy0nK2Yua2V5KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3gxJywgcGxvdC54LnNjYWxlLnJhbmdlQmFuZCgpICogMC40NSApXHJcbiAgICAgICAgICAgICAgICAuYXR0cigneTEnLCAoZCxpKSA9PiBwbG90Lnkuc2NhbGUoZi52YWx1ZShkKSkpXHJcbiAgICAgICAgICAgICAgICAuYXR0cigneDInLCBwbG90Lnguc2NhbGUucmFuZ2VCYW5kKCkgKiAwLjQ1IClcclxuICAgICAgICAgICAgICAgIC5hdHRyKCd5MicsIChkLGkpID0+IHBsb3QueS5zY2FsZShlbmRwb2ludChkKSkpO1xyXG4gICAgICAgICAgICBib3hwbG90cy5zZWxlY3QoJy4nK3RpY2tDbGFzcysnLicrYm94cGxvdENsYXNzKyctJytmLmtleSlcclxuICAgICAgICAgICAgICAgIC5hdHRyKCd4MScsIGJveExlZnQgKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3kxJywgKGQsaSkgPT4gcGxvdC55LnNjYWxlKGYudmFsdWUoZCkpKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3gyJywgYm94UmlnaHQgKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3kyJywgKGQsaSkgPT4gcGxvdC55LnNjYWxlKGYudmFsdWUoZCkpKTtcclxuXHJcbiAgICAgICAgICAgIGJveHBsb3RFbnRlci5zZWxlY3RBbGwoJy4nK2JveHBsb3RDbGFzcysnLScrZi5rZXkpXHJcbiAgICAgICAgICAgICAgICAub24oJ21vdXNlb3ZlcicsIGZ1bmN0aW9uKGQsaSxqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoJ2hvdmVyJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zaG93VG9vbHRpcChmLnZhbHVlKGQpKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5vbignbW91c2VvdXQnLCBmdW5jdGlvbihkLGksaikge1xyXG4gICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKCdob3ZlcicsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmhpZGVUb29sdGlwKCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgLy8gb3V0bGllcnNcclxuICAgICAgICB2YXIgb3V0bGllckNsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcIm91dGxpZXJcIik7XHJcbiAgICAgICAgdmFyIG91dGxpZXJzID0gYm94cGxvdHMuc2VsZWN0QWxsKCcuJytvdXRsaWVyQ2xhc3MpLmRhdGEoKGQsaSkgPT4gY29uZmlnLm91dGxpZXJzKGQsaSkgfHwgW10pO1xyXG5cclxuICAgICAgICB2YXIgb3V0bGllckVudGVyQ2lyY2xlID0gb3V0bGllcnMuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsIG91dGxpZXJDbGFzcylcclxuICAgICAgICAgICAgLnN0eWxlKCd6LWluZGV4JywgOTAwMCk7XHJcblxyXG4gICAgICAgIG91dGxpZXJFbnRlckNpcmNsZVxyXG4gICAgICAgICAgICAub24oJ21vdXNlb3ZlcicsIGZ1bmN0aW9uIChkLCBpLCBqKSB7XHJcbiAgICAgICAgICAgICAgICBkMy5zZWxlY3QodGhpcykuY2xhc3NlZCgnaG92ZXInLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2hvd1Rvb2x0aXAoY29uZmlnLm91dGxpZXJMYWJlbChkLGkpKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oJ21vdXNlb3V0JywgZnVuY3Rpb24gKGQsIGksIGopIHtcclxuICAgICAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKCdob3ZlcicsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuaGlkZVRvb2x0aXAoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciBvdXRsaWVyc1QgPSBvdXRsaWVycztcclxuICAgICAgICBpZiAoc2VsZi5jb25maWcudHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICBvdXRsaWVyc1QgPSBvdXRsaWVycy50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG91dGxpZXJzVFxyXG4gICAgICAgICAgICAuYXR0cignY3gnLCBwbG90Lnguc2NhbGUucmFuZ2VCYW5kKCkgKiAwLjQ1KVxyXG4gICAgICAgICAgICAuYXR0cignY3knLCAoZCxpKSA9PiBwbG90Lnkuc2NhbGUoY29uZmlnLm91dGxpZXJWYWx1ZShkLGkpKSlcclxuICAgICAgICAgICAgLmF0dHIoJ3InLCAnMycpO1xyXG4gICAgICAgIG91dGxpZXJzLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShuZXdEYXRhKXtcclxuICAgICAgICBzdXBlci51cGRhdGUobmV3RGF0YSk7XHJcbiAgICAgICAgdGhpcy5kcmF3QXhpc1goKTtcclxuICAgICAgICB0aGlzLmRyYXdBeGlzWSgpO1xyXG4gICAgICAgIHRoaXMuZHJhd0JveFBsb3RzKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwQ29sb3IoKSB7XHJcbiAgICAgICAgdmFyIHNlbGY9dGhpcztcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICBpZihjb25mLmQzQ29sb3JDYXRlZ29yeSl7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5jb2xvckNhdGVnb3J5ID0gZDMuc2NhbGVbY29uZi5kM0NvbG9yQ2F0ZWdvcnldKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjb2xvclZhbHVlID0gY29uZi5jb2xvcjtcclxuICAgICAgICBpZiAoY29sb3JWYWx1ZSAmJiB0eXBlb2YgY29sb3JWYWx1ZSA9PT0gJ3N0cmluZycgfHwgY29sb3JWYWx1ZSBpbnN0YW5jZW9mIFN0cmluZyl7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5jb2xvciA9IGNvbG9yVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYodGhpcy5wbG90LmNvbG9yQ2F0ZWdvcnkpe1xyXG4gICAgICAgICAgICBzZWxmLnBsb3QuY29sb3JWYWx1ZT1jb2xvclZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuY29sb3IgPSBkID0+ICBzZWxmLnBsb3QuY29sb3JDYXRlZ29yeSh0aGlzLnBsb3QueC52YWx1ZShkKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Qm94UGxvdEJhc2UsIEJveFBsb3RCYXNlQ29uZmlnfSBmcm9tIFwiLi9ib3gtcGxvdC1iYXNlXCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7U3RhdGlzdGljc1V0aWxzfSBmcm9tICcuL3N0YXRpc3RpY3MtdXRpbHMnXHJcblxyXG5leHBvcnQgY2xhc3MgQm94UGxvdENvbmZpZyBleHRlbmRzIEJveFBsb3RCYXNlQ29uZmlne1xyXG5cclxuICAgIHN2Z0NsYXNzID0gdGhpcy5jc3NDbGFzc1ByZWZpeCArICdib3gtcGxvdCc7XHJcbiAgICBzaG93TGVnZW5kID0gdHJ1ZTtcclxuICAgIHNob3dUb29sdGlwID0gdHJ1ZTtcclxuICAgIHkgPSB7Ly8gWSBheGlzIGNvbmZpZ1xyXG4gICAgICAgIHRpdGxlOiAnJyxcclxuICAgICAgICBrZXk6IHVuZGVmaW5lZCxcclxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oZCkgeyByZXR1cm4gdGhpcy55LmtleT09PXVuZGVmaW5lZCA/IGQgOiBkW3RoaXMueS5rZXldfSAsIC8vIHkgdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIixcclxuICAgICAgICBvcmllbnQ6ICdsZWZ0JyxcclxuICAgICAgICBkb21haW5NYXJnaW46IDAuMSxcclxuICAgICAgICBndWlkZXM6IHRydWUgLy9zaG93IGF4aXMgZ3VpZGVzXHJcbiAgICB9O1xyXG4gICAgc2VyaWVzID0gZmFsc2U7XHJcbiAgICBncm91cHM9e1xyXG4gICAgICAgIGtleTogdW5kZWZpbmVkLFxyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihkKSB7IHJldHVybiB0aGlzLmdyb3Vwcy5rZXk9PT11bmRlZmluZWQgPyAnJyA6IGRbdGhpcy5ncm91cHMua2V5XX0gICwgLy8gZ3JvdXBpbmcgdmFsdWUgYWNjZXNzb3IsXHJcbiAgICAgICAgbGFiZWw6IFwiXCIsXHJcbiAgICAgICAgZGlzcGxheVZhbHVlOiB1bmRlZmluZWQgLy8gb3B0aW9uYWwgZnVuY3Rpb24gcmV0dXJuaW5nIGRpc3BsYXkgdmFsdWUgKHNlcmllcyBsYWJlbCkgZm9yIGdpdmVuIGdyb3VwIHZhbHVlLCBvciBvYmplY3QvYXJyYXkgbWFwcGluZyB2YWx1ZSB0byBkaXNwbGF5IHZhbHVlXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgaWYoY3VzdG9tKXtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEJveFBsb3QgZXh0ZW5kcyBCb3hQbG90QmFzZXtcclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIG5ldyBCb3hQbG90Q29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpe1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IEJveFBsb3RDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGF0YVRvUGxvdCgpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgY29uZiA9IHNlbGYuY29uZmlnO1xyXG4gICAgICAgIHNlbGYucGxvdC5ncm91cGluZ0VuYWJsZWQgPSB0aGlzLmlzR3JvdXBpbmdFbmFibGVkKCk7XHJcblxyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIGlmKCFzZWxmLnBsb3QuZ3JvdXBpbmdFbmFibGVkICl7XHJcbiAgICAgICAgICAgIHNlbGYucGxvdC5ncm91cGVkRGF0YSA9ICBbe1xyXG4gICAgICAgICAgICAgICAga2V5OiAnJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlczogZGF0YVxyXG4gICAgICAgICAgICB9XTtcclxuICAgICAgICAgICAgc2VsZi5wbG90LmRhdGFMZW5ndGggPSBkYXRhLmxlbmd0aDtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgaWYoc2VsZi5jb25maWcuc2VyaWVzKXtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC5ncm91cGVkRGF0YSA9ICBkYXRhLm1hcChzPT57XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJue1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IHMubGFiZWwgfHwgcy5rZXkgfHwgJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogcy52YWx1ZXNcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QuZ3JvdXBWYWx1ZSA9IGQgPT4gY29uZi5ncm91cHMudmFsdWUuY2FsbChjb25mLCBkKTtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC5ncm91cGVkRGF0YSA9IGQzLm5lc3QoKS5rZXkodGhpcy5wbG90Lmdyb3VwVmFsdWUpLmVudHJpZXMoZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGdldERpc3BsYXlWYWx1ZT0gayA9PiBrO1xyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5jb25maWcuZ3JvdXBzLmRpc3BsYXlWYWx1ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoVXRpbHMuaXNGdW5jdGlvbihzZWxmLmNvbmZpZy5ncm91cHMuZGlzcGxheVZhbHVlKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldERpc3BsYXlWYWx1ZSA9IGs9PnNlbGYuY29uZmlnLmdyb3Vwcy5kaXNwbGF5VmFsdWUoaykgfHwgaztcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZihVdGlscy5pc09iamVjdChzZWxmLmNvbmZpZy5ncm91cHMuZGlzcGxheVZhbHVlKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldERpc3BsYXlWYWx1ZSA9IGsgPT4gc2VsZi5jb25maWcuZ3JvdXBzLmRpc3BsYXlWYWx1ZVtrXSB8fCBrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC5ncm91cGVkRGF0YS5mb3JFYWNoKGcgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGcua2V5ID0gZ2V0RGlzcGxheVZhbHVlKGcua2V5KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLnBsb3QuZGF0YUxlbmd0aCA9IGQzLnN1bSh0aGlzLnBsb3QuZ3JvdXBlZERhdGEsIHM9PnMudmFsdWVzLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgc2VsZi5wbG90Lmdyb3VwZWREYXRhLmZvckVhY2gocz0+e1xyXG4gICAgICAgICAgICBpZighQXJyYXkuaXNBcnJheShzLnZhbHVlcykpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgdmFsdWVzID0gcy52YWx1ZXMubWFwKGQ9PnBhcnNlRmxvYXQoc2VsZi5jb25maWcueS52YWx1ZS5jYWxsKHNlbGYuY29uZmlnLCBkKSkpO1xyXG4gICAgICAgICAgICBzLnZhbHVlcy5RMSA9IFN0YXRpc3RpY3NVdGlscy5xdWFudGlsZSh2YWx1ZXMsIDAuMjUpO1xyXG4gICAgICAgICAgICBzLnZhbHVlcy5RMiA9IFN0YXRpc3RpY3NVdGlscy5xdWFudGlsZSh2YWx1ZXMsIDAuNSk7XHJcbiAgICAgICAgICAgIHMudmFsdWVzLlEzID0gU3RhdGlzdGljc1V0aWxzLnF1YW50aWxlKHZhbHVlcywgMC43NSk7XHJcbiAgICAgICAgICAgIHMudmFsdWVzLndoaXNrZXJMb3cgPSBkMy5taW4odmFsdWVzKTtcclxuICAgICAgICAgICAgcy52YWx1ZXMud2hpc2tlckhpZ2ggPSBkMy5tYXgodmFsdWVzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNlbGYucGxvdC5ncm91cGVkRGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBpc0dyb3VwaW5nRW5hYmxlZCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5zZXJpZXMgfHwgISEodGhpcy5jb25maWcuZ3JvdXBzICYmIHRoaXMuY29uZmlnLmdyb3Vwcy52YWx1ZSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDaGFydCwgQ2hhcnRDb25maWd9IGZyb20gXCIuL2NoYXJ0XCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7TGVnZW5kfSBmcm9tIFwiLi9sZWdlbmRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDaGFydFdpdGhDb2xvckdyb3Vwc0NvbmZpZyBleHRlbmRzIENoYXJ0Q29uZmlne1xyXG5cclxuICAgIHNob3dMZWdlbmQ9dHJ1ZTtcclxuICAgIGxlZ2VuZD17XHJcbiAgICAgICAgd2lkdGg6IDgwLFxyXG4gICAgICAgIG1hcmdpbjogMTAsXHJcbiAgICAgICAgc2hhcGVXaWR0aDogMjBcclxuICAgIH07XHJcbiAgICBncm91cHM9e1xyXG4gICAgICAgIGtleTogMixcclxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oZCkgeyByZXR1cm4gZFt0aGlzLmdyb3Vwcy5rZXldfSAgLCAvLyBncm91cGluZyB2YWx1ZSBhY2Nlc3NvcixcclxuICAgICAgICBsYWJlbDogXCJcIixcclxuICAgICAgICBkaXNwbGF5VmFsdWU6IHVuZGVmaW5lZCAvLyBvcHRpb25hbCBmdW5jdGlvbiByZXR1cm5pbmcgZGlzcGxheSB2YWx1ZSAoc2VyaWVzIGxhYmVsKSBmb3IgZ2l2ZW4gZ3JvdXAgdmFsdWUsIG9yIG9iamVjdC9hcnJheSBtYXBwaW5nIHZhbHVlIHRvIGRpc3BsYXkgdmFsdWVcclxuICAgIH07XHJcbiAgICBzZXJpZXMgPSBmYWxzZTtcclxuICAgIGNvbG9yID0gIHVuZGVmaW5lZDsvLyBzdHJpbmcgb3IgZnVuY3Rpb24gcmV0dXJuaW5nIGNvbG9yJ3MgdmFsdWUgZm9yIGNvbG9yIHNjYWxlXHJcbiAgICBkM0NvbG9yQ2F0ZWdvcnk9ICdjYXRlZ29yeTEwJztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgaWYoY3VzdG9tKXtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDaGFydFdpdGhDb2xvckdyb3VwcyBleHRlbmRzIENoYXJ0e1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IENoYXJ0V2l0aENvbG9yR3JvdXBzQ29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpe1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IENoYXJ0V2l0aENvbG9yR3JvdXBzQ29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCl7XHJcbiAgICAgICAgc3VwZXIuaW5pdFBsb3QoKTtcclxuICAgICAgICB2YXIgc2VsZj10aGlzO1xyXG5cclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG4gICAgICAgXHJcbiAgICAgICAgdGhpcy5wbG90LnNob3dMZWdlbmQgPSBjb25mLnNob3dMZWdlbmQ7XHJcbiAgICAgICAgaWYodGhpcy5wbG90LnNob3dMZWdlbmQpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWFyZ2luLnJpZ2h0ID0gY29uZi5tYXJnaW4ucmlnaHQgKyBjb25mLmxlZ2VuZC53aWR0aCtjb25mLmxlZ2VuZC5tYXJnaW4qMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXR1cEdyb3VwcygpO1xyXG4gICAgICAgIHRoaXMucGxvdC5kYXRhID0gdGhpcy5nZXREYXRhVG9QbG90KCk7XHJcbiAgICAgICAgdGhpcy5ncm91cERhdGEoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBpc0dyb3VwaW5nRW5hYmxlZCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5zZXJpZXMgfHwgISEodGhpcy5jb25maWcuZ3JvdXBzICYmIHRoaXMuY29uZmlnLmdyb3Vwcy52YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcHV0ZUdyb3VwQ29sb3JEb21haW4oKXtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoZDMubWFwKHRoaXMuZGF0YSwgZCA9PiB0aGlzLnBsb3QuZ3JvdXBWYWx1ZShkKSlbJ18nXSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXBHcm91cHMoKSB7XHJcbiAgICAgICAgdmFyIHNlbGY9dGhpcztcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QuZ3JvdXBpbmdFbmFibGVkID0gdGhpcy5pc0dyb3VwaW5nRW5hYmxlZCgpO1xyXG4gICAgICAgIHZhciBkb21haW4gPSBbXTtcclxuICAgICAgICBpZih0aGlzLnBsb3QuZ3JvdXBpbmdFbmFibGVkKXtcclxuICAgICAgICAgICAgc2VsZi5wbG90Lmdyb3VwVG9MYWJlbCA9IHt9O1xyXG4gICAgICAgICAgICBpZih0aGlzLmNvbmZpZy5zZXJpZXMpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90Lmdyb3VwVmFsdWUgPSBzID0+IHMua2V5O1xyXG4gICAgICAgICAgICAgICAgZG9tYWluID0gdGhpcy5jb21wdXRlR3JvdXBDb2xvckRvbWFpbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5mb3JFYWNoKHM9PntcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnBsb3QuZ3JvdXBUb0xhYmVsW3Mua2V5XSA9IHMubGFiZWx8fHMua2V5O1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuZ3JvdXBWYWx1ZSA9IGQgPT4gY29uZi5ncm91cHMudmFsdWUuY2FsbChjb25mLCBkKTtcclxuICAgICAgICAgICAgICAgIGRvbWFpbiA9IHRoaXMuY29tcHV0ZUdyb3VwQ29sb3JEb21haW4oKTtcclxuICAgICAgICAgICAgICAgIHZhciBnZXRMYWJlbD0gayA9PiBrO1xyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5jb25maWcuZ3JvdXBzLmRpc3BsYXlWYWx1ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoVXRpbHMuaXNGdW5jdGlvbihzZWxmLmNvbmZpZy5ncm91cHMuZGlzcGxheVZhbHVlKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldExhYmVsID0gaz0+c2VsZi5jb25maWcuZ3JvdXBzLmRpc3BsYXlWYWx1ZShrKSB8fCBrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKFV0aWxzLmlzT2JqZWN0KHNlbGYuY29uZmlnLmdyb3Vwcy5kaXNwbGF5VmFsdWUpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TGFiZWwgPSBrID0+IHNlbGYuY29uZmlnLmdyb3Vwcy5kaXNwbGF5VmFsdWVba10gfHwgaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkb21haW4uZm9yRWFjaChrPT57XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wbG90Lmdyb3VwVG9MYWJlbFtrXSA9IGdldExhYmVsKGspO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lmdyb3VwVmFsdWUgPSBkID0+IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihjb25mLmQzQ29sb3JDYXRlZ29yeSl7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5jb2xvckNhdGVnb3J5ID0gZDMuc2NhbGVbY29uZi5kM0NvbG9yQ2F0ZWdvcnldKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjb2xvclZhbHVlID0gY29uZi5jb2xvcjtcclxuICAgICAgICBpZiAoY29sb3JWYWx1ZSAmJiB0eXBlb2YgY29sb3JWYWx1ZSA9PT0gJ3N0cmluZycgfHwgY29sb3JWYWx1ZSBpbnN0YW5jZW9mIFN0cmluZyl7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5jb2xvciA9IGNvbG9yVmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5zZXJpZXNDb2xvciA9IHRoaXMucGxvdC5jb2xvcjtcclxuICAgICAgICB9ZWxzZSBpZih0aGlzLnBsb3QuY29sb3JDYXRlZ29yeSl7XHJcbiAgICAgICAgICAgIHNlbGYucGxvdC5jb2xvclZhbHVlPWNvbG9yVmFsdWU7XHJcbiAgICAgICAgICAgIHNlbGYucGxvdC5jb2xvckNhdGVnb3J5LmRvbWFpbihkb21haW4pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wbG90LnNlcmllc0NvbG9yID0gcyA9PiAgc2VsZi5wbG90LmNvbG9yQ2F0ZWdvcnkocy5rZXkpO1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuY29sb3IgPSBkID0+ICBzZWxmLnBsb3QuY29sb3JDYXRlZ29yeSh0aGlzLnBsb3QuZ3JvdXBWYWx1ZShkKSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuY29sb3IgPSB0aGlzLnBsb3Quc2VyaWVzQ29sb3IgPSBzPT4gJ2JsYWNrJ1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ3JvdXBEYXRhKCl7XHJcbiAgICAgICAgdmFyIHNlbGY9dGhpcztcclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMucGxvdC5kYXRhO1xyXG4gICAgICAgIGlmKCFzZWxmLnBsb3QuZ3JvdXBpbmdFbmFibGVkICl7XHJcbiAgICAgICAgICAgIHNlbGYucGxvdC5ncm91cGVkRGF0YSA9ICBbe1xyXG4gICAgICAgICAgICAgICAga2V5OiBudWxsLFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICcnLFxyXG4gICAgICAgICAgICAgICAgdmFsdWVzOiBkYXRhXHJcbiAgICAgICAgICAgIH1dO1xyXG4gICAgICAgICAgICBzZWxmLnBsb3QuZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoO1xyXG4gICAgICAgIH1lbHNle1xyXG5cclxuICAgICAgICAgICAgaWYoc2VsZi5jb25maWcuc2VyaWVzKXtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC5ncm91cGVkRGF0YSA9ICBkYXRhLm1hcChzPT57XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJue1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IHMua2V5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogcy5sYWJlbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBzLnZhbHVlc1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC5ncm91cGVkRGF0YSA9IGQzLm5lc3QoKS5rZXkodGhpcy5wbG90Lmdyb3VwVmFsdWUpLmVudHJpZXMoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QuZ3JvdXBlZERhdGEuZm9yRWFjaChnID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBnLmxhYmVsID0gc2VsZi5wbG90Lmdyb3VwVG9MYWJlbFtnLmtleV07XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5wbG90LmRhdGFMZW5ndGggPSBkMy5zdW0odGhpcy5wbG90Lmdyb3VwZWREYXRhLCBzPT5zLnZhbHVlcy5sZW5ndGgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdGhpcy5wbG90LnNlcmllc0NvbG9yXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGdldERhdGFUb1Bsb3QoKXtcclxuICAgICAgICBpZighdGhpcy5wbG90Lmdyb3VwaW5nRW5hYmxlZCB8fCAhdGhpcy5lbmFibGVkR3JvdXBzKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5maWx0ZXIoZCA9PiB0aGlzLmVuYWJsZWRHcm91cHMuaW5kZXhPZih0aGlzLnBsb3QuZ3JvdXBWYWx1ZShkKSk+LTEpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgdXBkYXRlKG5ld0RhdGEpe1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUxlZ2VuZCgpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlTGVnZW5kKCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9dGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuXHJcbiAgICAgICAgdmFyIHNjYWxlID0gcGxvdC5jb2xvckNhdGVnb3J5O1xyXG5cclxuXHJcblxyXG4gICAgICAgIGlmKCFzY2FsZS5kb21haW4oKSB8fCBzY2FsZS5kb21haW4oKS5sZW5ndGg8Mil7XHJcbiAgICAgICAgICAgIHBsb3Quc2hvd0xlZ2VuZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIXBsb3Quc2hvd0xlZ2VuZCl7XHJcbiAgICAgICAgICAgIGlmKHBsb3QubGVnZW5kICYmIHBsb3QubGVnZW5kLmNvbnRhaW5lcil7XHJcbiAgICAgICAgICAgICAgICBwbG90LmxlZ2VuZC5jb250YWluZXIucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHZhciBsZWdlbmRYID0gdGhpcy5wbG90LndpZHRoICsgdGhpcy5jb25maWcubGVnZW5kLm1hcmdpbjtcclxuICAgICAgICB2YXIgbGVnZW5kWSA9IHRoaXMuY29uZmlnLmxlZ2VuZC5tYXJnaW47XHJcblxyXG4gICAgICAgIHBsb3QubGVnZW5kID0gbmV3IExlZ2VuZCh0aGlzLnN2ZywgdGhpcy5zdmdHLCBzY2FsZSwgbGVnZW5kWCwgbGVnZW5kWSk7XHJcblxyXG4gICAgICAgIHBsb3QubGVnZW5kQ29sb3IgPSBwbG90LmxlZ2VuZC5jb2xvcigpXHJcbiAgICAgICAgICAgIC5zaGFwZVdpZHRoKHRoaXMuY29uZmlnLmxlZ2VuZC5zaGFwZVdpZHRoKVxyXG4gICAgICAgICAgICAub3JpZW50KCd2ZXJ0aWNhbCcpXHJcbiAgICAgICAgICAgIC5zY2FsZShzY2FsZSlcclxuICAgICAgICAgICAgLmxhYmVscyhzY2FsZS5kb21haW4oKS5tYXAodj0+cGxvdC5ncm91cFRvTGFiZWxbdl0pKTtcclxuXHJcblxyXG4gICAgICAgIHBsb3QubGVnZW5kQ29sb3Iub24oJ2NlbGxjbGljaycsIGM9PiBzZWxmLm9uTGVnZW5kQ2VsbENsaWNrKGMpKTtcclxuICAgICAgICBcclxuICAgICAgICBwbG90LmxlZ2VuZC5jb250YWluZXJcclxuICAgICAgICAgICAgLmNhbGwocGxvdC5sZWdlbmRDb2xvcik7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlTGVnZW5kQ2VsbFN0YXR1c2VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25MZWdlbmRDZWxsQ2xpY2soY2VsbFZhbHVlKXtcclxuICAgICAgICB0aGlzLnVwZGF0ZUVuYWJsZWRHcm91cHMoY2VsbFZhbHVlKTtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxuICAgIHVwZGF0ZUxlZ2VuZENlbGxTdGF0dXNlcygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5wbG90LmxlZ2VuZC5jb250YWluZXIuc2VsZWN0QWxsKFwiZy5jZWxsXCIpLmVhY2goZnVuY3Rpb24oY2VsbCl7XHJcbiAgICAgICAgICAgIHZhciBpc0Rpc2FibGVkID0gc2VsZi5lbmFibGVkR3JvdXBzICYmIHNlbGYuZW5hYmxlZEdyb3Vwcy5pbmRleE9mKGNlbGwpPDA7XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKFwib2RjLWRpc2FibGVkXCIsIGlzRGlzYWJsZWQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUVuYWJsZWRHcm91cHMoY2VsbFZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWRHcm91cHMpIHtcclxuICAgICAgICAgICAgdGhpcy5lbmFibGVkR3JvdXBzID0gdGhpcy5wbG90LmNvbG9yQ2F0ZWdvcnkuZG9tYWluKCkuc2xpY2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5lbmFibGVkR3JvdXBzLmluZGV4T2YoY2VsbFZhbHVlKTtcclxuXHJcbiAgICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZWRHcm91cHMucHVzaChjZWxsVmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZEdyb3Vwcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWRHcm91cHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZEdyb3VwcyA9IHRoaXMucGxvdC5jb2xvckNhdGVnb3J5LmRvbWFpbigpLnNsaWNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRhKGRhdGEpe1xyXG4gICAgICAgIHN1cGVyLnNldERhdGEoZGF0YSk7XHJcbiAgICAgICAgdGhpcy5lbmFibGVkR3JvdXBzID0gbnVsbDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBDaGFydENvbmZpZyB7XHJcbiAgICBjc3NDbGFzc1ByZWZpeCA9IFwib2RjLVwiO1xyXG4gICAgc3ZnQ2xhc3MgPSB0aGlzLmNzc0NsYXNzUHJlZml4ICsgJ213LWQzLWNoYXJ0JztcclxuICAgIHdpZHRoID0gdW5kZWZpbmVkO1xyXG4gICAgaGVpZ2h0ID0gdW5kZWZpbmVkO1xyXG4gICAgbWFyZ2luID0ge1xyXG4gICAgICAgIGxlZnQ6IDUwLFxyXG4gICAgICAgIHJpZ2h0OiAzMCxcclxuICAgICAgICB0b3A6IDMwLFxyXG4gICAgICAgIGJvdHRvbTogNTBcclxuICAgIH07XHJcbiAgICBzaG93VG9vbHRpcCA9IGZhbHNlO1xyXG4gICAgdHJhbnNpdGlvbiA9IHRydWU7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKSB7XHJcbiAgICAgICAgaWYgKGN1c3RvbSkge1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDaGFydCB7XHJcbiAgICB1dGlscyA9IFV0aWxzO1xyXG4gICAgYmFzZUNvbnRhaW5lcjtcclxuICAgIHN2ZztcclxuICAgIGNvbmZpZztcclxuICAgIHBsb3QgPSB7XHJcbiAgICAgICAgbWFyZ2luOiB7fVxyXG4gICAgfTtcclxuICAgIF9hdHRhY2hlZCA9IHt9O1xyXG4gICAgX2xheWVycyA9IHt9O1xyXG4gICAgX2V2ZW50cyA9IHt9O1xyXG4gICAgX2lzQXR0YWNoZWQ7XHJcbiAgICBfaXNJbml0aWFsaXplZD1mYWxzZTtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoYmFzZSwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgdGhpcy5faWQgPSBVdGlscy5ndWlkKCk7XHJcbiAgICAgICAgdGhpcy5faXNBdHRhY2hlZCA9IGJhc2UgaW5zdGFuY2VvZiBDaGFydDtcclxuXHJcbiAgICAgICAgdGhpcy5iYXNlQ29udGFpbmVyID0gYmFzZTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRDb25maWcoY29uZmlnKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXREYXRhKGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICAgICAgdGhpcy5wb3N0SW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpIHtcclxuICAgICAgICBpZiAoIWNvbmZpZykge1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IG5ldyBDaGFydENvbmZpZygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGF0YShkYXRhKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcblxyXG4gICAgICAgIHNlbGYuaW5pdFBsb3QoKTtcclxuICAgICAgICBzZWxmLmluaXRTdmcoKTtcclxuXHJcbiAgICAgICAgaWYoIXRoaXMuX2lzSW5pdGlhbGl6ZWQpe1xyXG4gICAgICAgICAgICBzZWxmLmluaXRUb29sdGlwKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNlbGYuZHJhdygpO1xyXG4gICAgICAgIHRoaXMuX2lzSW5pdGlhbGl6ZWQ9dHJ1ZTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwb3N0SW5pdCgpe1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBpbml0U3ZnKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgY29uZmlnID0gdGhpcy5jb25maWc7XHJcblxyXG4gICAgICAgIHZhciBtYXJnaW4gPSBzZWxmLnBsb3QubWFyZ2luO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IHNlbGYucGxvdC53aWR0aCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0O1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBzZWxmLnBsb3QuaGVpZ2h0ICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b207XHJcbiAgICAgICAgdmFyIGFzcGVjdCA9IHdpZHRoIC8gaGVpZ2h0O1xyXG4gICAgICAgIGlmKCFzZWxmLl9pc0F0dGFjaGVkKXtcclxuICAgICAgICAgICAgaWYoIXRoaXMuX2lzSW5pdGlhbGl6ZWQpe1xyXG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KHNlbGYuYmFzZUNvbnRhaW5lcikuc2VsZWN0KFwic3ZnXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNlbGYuc3ZnID0gZDMuc2VsZWN0KHNlbGYuYmFzZUNvbnRhaW5lcikuc2VsZWN0T3JBcHBlbmQoXCJzdmdcIik7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnN2Z1xyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidmlld0JveFwiLCBcIjAgMCBcIiArIFwiIFwiICsgd2lkdGggKyBcIiBcIiArIGhlaWdodClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwicHJlc2VydmVBc3BlY3RSYXRpb1wiLCBcInhNaWRZTWlkIG1lZXRcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgY29uZmlnLnN2Z0NsYXNzKTtcclxuICAgICAgICAgICAgc2VsZi5zdmdHID0gc2VsZi5zdmcuc2VsZWN0T3JBcHBlbmQoXCJnLm1haW4tZ3JvdXBcIik7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuYmFzZUNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIHNlbGYuc3ZnID0gc2VsZi5iYXNlQ29udGFpbmVyLnN2ZztcclxuICAgICAgICAgICAgc2VsZi5zdmdHID0gc2VsZi5zdmcuc2VsZWN0T3JBcHBlbmQoXCJnLm1haW4tZ3JvdXAuXCIrY29uZmlnLnN2Z0NsYXNzKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VsZi5zdmdHLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyBtYXJnaW4ubGVmdCArIFwiLFwiICsgbWFyZ2luLnRvcCArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgaWYgKCFjb25maWcud2lkdGggfHwgY29uZmlnLmhlaWdodCkge1xyXG4gICAgICAgICAgICBkMy5zZWxlY3Qod2luZG93KVxyXG4gICAgICAgICAgICAgICAgLm9uKFwicmVzaXplLlwiK3NlbGYuX2lkLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZXNpemVcIiwgc2VsZik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRyYW5zaXRpb24gPSBzZWxmLmNvbmZpZy50cmFuc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29uZmlnLnRyYW5zaXRpb249ZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pbml0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25maWcudHJhbnNpdGlvbiA9IHRyYW5zaXRpb247XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFRvb2x0aXAoKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLnNob3dUb29sdGlwKSB7XHJcbiAgICAgICAgICAgIGlmKCFzZWxmLl9pc0F0dGFjaGVkICl7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QudG9vbHRpcCA9IGQzLnNlbGVjdChcImJvZHlcIikuc2VsZWN0T3JBcHBlbmQoJ2Rpdi4nK3NlbGYuY29uZmlnLmNzc0NsYXNzUHJlZml4Kyd0b29sdGlwJylcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC50b29sdGlwPSBzZWxmLmJhc2VDb250YWluZXIucGxvdC50b29sdGlwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBzZWxmLnBsb3QudG9vbHRpcCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCkge1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSB0aGlzLmNvbmZpZy5tYXJnaW47XHJcbiAgICAgICAgdGhpcy5wbG90ID0gdGhpcy5wbG90IHx8IHt9O1xyXG4gICAgICAgIHRoaXMucGxvdC5tYXJnaW4gPSB7XHJcbiAgICAgICAgICAgIHRvcDogbWFyZ2luLnRvcCxcclxuICAgICAgICAgICAgYm90dG9tOiBtYXJnaW4uYm90dG9tLFxyXG4gICAgICAgICAgICBsZWZ0OiBtYXJnaW4ubGVmdCxcclxuICAgICAgICAgICAgcmlnaHQ6IG1hcmdpbi5yaWdodFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRhdGEpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsYXllck5hbWUsIGF0dGFjaG1lbnREYXRhO1xyXG4gICAgICAgIGZvciAodmFyIGF0dGFjaG1lbnROYW1lIGluIHRoaXMuX2F0dGFjaGVkKSB7XHJcblxyXG4gICAgICAgICAgICBhdHRhY2htZW50RGF0YSA9IGRhdGE7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9hdHRhY2hlZFthdHRhY2htZW50TmFtZV0udXBkYXRlKGF0dGFjaG1lbnREYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhdyhkYXRhKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoZGF0YSk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy9Cb3Jyb3dlZCBmcm9tIGQzLmNoYXJ0XHJcbiAgICAvKipcclxuICAgICAqIFJlZ2lzdGVyIG9yIHJldHJpZXZlIGFuIFwiYXR0YWNobWVudFwiIENoYXJ0LiBUaGUgXCJhdHRhY2htZW50XCIgY2hhcnQncyBgZHJhd2BcclxuICAgICAqIG1ldGhvZCB3aWxsIGJlIGludm9rZWQgd2hlbmV2ZXIgdGhlIGNvbnRhaW5pbmcgY2hhcnQncyBgZHJhd2AgbWV0aG9kIGlzXHJcbiAgICAgKiBpbnZva2VkLlxyXG4gICAgICpcclxuICAgICAqIEBleHRlcm5hbEV4YW1wbGUgY2hhcnQtYXR0YWNoXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF0dGFjaG1lbnROYW1lIE5hbWUgb2YgdGhlIGF0dGFjaG1lbnRcclxuICAgICAqIEBwYXJhbSB7Q2hhcnR9IFtjaGFydF0gQ2hhcnQgdG8gcmVnaXN0ZXIgYXMgYSBtaXggaW4gb2YgdGhpcyBjaGFydC4gV2hlblxyXG4gICAgICogICAgICAgIHVuc3BlY2lmaWVkLCB0aGlzIG1ldGhvZCB3aWxsIHJldHVybiB0aGUgYXR0YWNobWVudCBwcmV2aW91c2x5XHJcbiAgICAgKiAgICAgICAgcmVnaXN0ZXJlZCB3aXRoIHRoZSBzcGVjaWZpZWQgYGF0dGFjaG1lbnROYW1lYCAoaWYgYW55KS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Q2hhcnR9IFJlZmVyZW5jZSB0byB0aGlzIGNoYXJ0IChjaGFpbmFibGUpLlxyXG4gICAgICovXHJcbiAgICBhdHRhY2goYXR0YWNobWVudE5hbWUsIGNoYXJ0KSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2F0dGFjaGVkW2F0dGFjaG1lbnROYW1lXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2F0dGFjaGVkW2F0dGFjaG1lbnROYW1lXSA9IGNoYXJ0O1xyXG4gICAgICAgIHJldHVybiBjaGFydDtcclxuICAgIH07XHJcblxyXG4gICAgXHJcblxyXG4gICAgLy9Cb3Jyb3dlZCBmcm9tIGQzLmNoYXJ0XHJcbiAgICAvKipcclxuICAgICAqIFN1YnNjcmliZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGFuIGV2ZW50IHRyaWdnZXJlZCBvbiB0aGUgY2hhcnQuIFNlZSB7QGxpbmtcclxuICAgICAgICAqIENoYXJ0I29uY2V9IHRvIHN1YnNjcmliZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGFuIGV2ZW50IGZvciBvbmUgb2NjdXJlbmNlLlxyXG4gICAgICpcclxuICAgICAqIEBleHRlcm5hbEV4YW1wbGUge3J1bm5hYmxlfSBjaGFydC1vblxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGV2ZW50XHJcbiAgICAgKiBAcGFyYW0ge0NoYXJ0RXZlbnRIYW5kbGVyfSBjYWxsYmFjayBGdW5jdGlvbiB0byBiZSBpbnZva2VkIHdoZW4gdGhlIGV2ZW50XHJcbiAgICAgKiAgICAgICAgb2NjdXJzXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbnRleHRdIFZhbHVlIHRvIHNldCBhcyBgdGhpc2Agd2hlbiBpbnZva2luZyB0aGVcclxuICAgICAqICAgICAgICBgY2FsbGJhY2tgLiBEZWZhdWx0cyB0byB0aGUgY2hhcnQgaW5zdGFuY2UuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0NoYXJ0fSBBIHJlZmVyZW5jZSB0byB0aGlzIGNoYXJ0IChjaGFpbmFibGUpLlxyXG4gICAgICovXHJcbiAgICBvbihuYW1lLCBjYWxsYmFjaywgY29udGV4dCkge1xyXG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLl9ldmVudHNbbmFtZV0gfHwgKHRoaXMuX2V2ZW50c1tuYW1lXSA9IFtdKTtcclxuICAgICAgICBldmVudHMucHVzaCh7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcclxuICAgICAgICAgICAgY29udGV4dDogY29udGV4dCB8fCB0aGlzLFxyXG4gICAgICAgICAgICBfY2hhcnQ6IHRoaXNcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvL0JvcnJvd2VkIGZyb20gZDMuY2hhcnRcclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIFN1YnNjcmliZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGFuIGV2ZW50IHRyaWdnZXJlZCBvbiB0aGUgY2hhcnQuIFRoaXNcclxuICAgICAqIGZ1bmN0aW9uIHdpbGwgYmUgaW52b2tlZCBhdCB0aGUgbmV4dCBvY2N1cmFuY2Ugb2YgdGhlIGV2ZW50IGFuZCBpbW1lZGlhdGVseVxyXG4gICAgICogdW5zdWJzY3JpYmVkLiBTZWUge0BsaW5rIENoYXJ0I29ufSB0byBzdWJzY3JpYmUgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBhblxyXG4gICAgICogZXZlbnQgaW5kZWZpbml0ZWx5LlxyXG4gICAgICpcclxuICAgICAqIEBleHRlcm5hbEV4YW1wbGUge3J1bm5hYmxlfSBjaGFydC1vbmNlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgZXZlbnRcclxuICAgICAqIEBwYXJhbSB7Q2hhcnRFdmVudEhhbmRsZXJ9IGNhbGxiYWNrIEZ1bmN0aW9uIHRvIGJlIGludm9rZWQgd2hlbiB0aGUgZXZlbnRcclxuICAgICAqICAgICAgICBvY2N1cnNcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF0gVmFsdWUgdG8gc2V0IGFzIGB0aGlzYCB3aGVuIGludm9raW5nIHRoZVxyXG4gICAgICogICAgICAgIGBjYWxsYmFja2AuIERlZmF1bHRzIHRvIHRoZSBjaGFydCBpbnN0YW5jZVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtDaGFydH0gQSByZWZlcmVuY2UgdG8gdGhpcyBjaGFydCAoY2hhaW5hYmxlKVxyXG4gICAgICovXHJcbiAgICBvbmNlKG5hbWUsIGNhbGxiYWNrLCBjb250ZXh0KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBvbmNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZWxmLm9mZihuYW1lLCBvbmNlKTtcclxuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uKG5hbWUsIG9uY2UsIGNvbnRleHQpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvL0JvcnJvd2VkIGZyb20gZDMuY2hhcnRcclxuICAgIC8qKlxyXG4gICAgICogVW5zdWJzY3JpYmUgb25lIG9yIG1vcmUgY2FsbGJhY2sgZnVuY3Rpb25zIGZyb20gYW4gZXZlbnQgdHJpZ2dlcmVkIG9uIHRoZVxyXG4gICAgICogY2hhcnQuIFdoZW4gbm8gYXJndW1lbnRzIGFyZSBzcGVjaWZpZWQsICphbGwqIGhhbmRsZXJzIHdpbGwgYmUgdW5zdWJzY3JpYmVkLlxyXG4gICAgICogV2hlbiBvbmx5IGEgYG5hbWVgIGlzIHNwZWNpZmllZCwgYWxsIGhhbmRsZXJzIHN1YnNjcmliZWQgdG8gdGhhdCBldmVudCB3aWxsXHJcbiAgICAgKiBiZSB1bnN1YnNjcmliZWQuIFdoZW4gYSBgbmFtZWAgYW5kIGBjYWxsYmFja2AgYXJlIHNwZWNpZmllZCwgb25seSB0aGF0XHJcbiAgICAgKiBmdW5jdGlvbiB3aWxsIGJlIHVuc3Vic2NyaWJlZCBmcm9tIHRoYXQgZXZlbnQuIFdoZW4gYSBgbmFtZWAgYW5kIGBjb250ZXh0YFxyXG4gICAgICogYXJlIHNwZWNpZmllZCAoYnV0IGBjYWxsYmFja2AgaXMgb21pdHRlZCksIGFsbCBldmVudHMgYm91bmQgdG8gdGhlIGdpdmVuXHJcbiAgICAgKiBldmVudCB3aXRoIHRoZSBnaXZlbiBjb250ZXh0IHdpbGwgYmUgdW5zdWJzY3JpYmVkLlxyXG4gICAgICpcclxuICAgICAqIEBleHRlcm5hbEV4YW1wbGUge3J1bm5hYmxlfSBjaGFydC1vZmZcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW25hbWVdIE5hbWUgb2YgdGhlIGV2ZW50IHRvIGJlIHVuc3Vic2NyaWJlZFxyXG4gICAgICogQHBhcmFtIHtDaGFydEV2ZW50SGFuZGxlcn0gW2NhbGxiYWNrXSBGdW5jdGlvbiB0byBiZSB1bnN1YnNjcmliZWRcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF0gQ29udGV4dHMgdG8gYmUgdW5zdWJzY3JpYmVcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Q2hhcnR9IEEgcmVmZXJlbmNlIHRvIHRoaXMgY2hhcnQgKGNoYWluYWJsZSkuXHJcbiAgICAgKi9cclxuXHJcbiAgICBvZmYobmFtZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgbmFtZXMsIG4sIGV2ZW50cywgZXZlbnQsIGksIGo7XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSBhbGwgZXZlbnRzXHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgZm9yIChuYW1lIGluIHRoaXMuX2V2ZW50cykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW25hbWVdLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyByZW1vdmUgYWxsIGV2ZW50cyBmb3IgYSBzcGVjaWZpYyBuYW1lXHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgZXZlbnRzID0gdGhpcy5fZXZlbnRzW25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoZXZlbnRzKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudHMubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggd2hhdGV2ZXIgY29tYmluYXRpb24gb2YgbmFtZSwgY29udGV4dFxyXG4gICAgICAgIC8vIGFuZCBjYWxsYmFjay5cclxuICAgICAgICBuYW1lcyA9IG5hbWUgPyBbbmFtZV0gOiBPYmplY3Qua2V5cyh0aGlzLl9ldmVudHMpO1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBuID0gbmFtZXNbaV07XHJcbiAgICAgICAgICAgIGV2ZW50cyA9IHRoaXMuX2V2ZW50c1tuXTtcclxuICAgICAgICAgICAgaiA9IGV2ZW50cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIHdoaWxlIChqLS0pIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50ID0gZXZlbnRzW2pdO1xyXG4gICAgICAgICAgICAgICAgaWYgKChjYWxsYmFjayAmJiBjYWxsYmFjayA9PT0gZXZlbnQuY2FsbGJhY2spIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgKGNvbnRleHQgJiYgY29udGV4dCA9PT0gZXZlbnQuY29udGV4dCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudHMuc3BsaWNlKGosIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLy9Cb3Jyb3dlZCBmcm9tIGQzLmNoYXJ0XHJcbiAgICAvKipcclxuICAgICAqIFB1Ymxpc2ggYW4gZXZlbnQgb24gdGhpcyBjaGFydCB3aXRoIHRoZSBnaXZlbiBgbmFtZWAuXHJcbiAgICAgKlxyXG4gICAgICogQGV4dGVybmFsRXhhbXBsZSB7cnVubmFibGV9IGNoYXJ0LXRyaWdnZXJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBldmVudCB0byBwdWJsaXNoXHJcbiAgICAgKiBAcGFyYW0gey4uLip9IGFyZ3VtZW50cyBWYWx1ZXMgd2l0aCB3aGljaCB0byBpbnZva2UgdGhlIHJlZ2lzdGVyZWRcclxuICAgICAqICAgICAgICBjYWxsYmFja3MuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0NoYXJ0fSBBIHJlZmVyZW5jZSB0byB0aGlzIGNoYXJ0IChjaGFpbmFibGUpLlxyXG4gICAgICovXHJcbiAgICB0cmlnZ2VyKG5hbWUpIHtcclxuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XHJcbiAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50c1tuYW1lXTtcclxuICAgICAgICB2YXIgaSwgZXY7XHJcblxyXG4gICAgICAgIGlmIChldmVudHMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZXZlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBldiA9IGV2ZW50c1tpXTtcclxuICAgICAgICAgICAgICAgIGV2LmNhbGxiYWNrLmFwcGx5KGV2LmNvbnRleHQsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBnZXRCYXNlQ29udGFpbmVyKCl7XHJcbiAgICAgICAgaWYodGhpcy5faXNBdHRhY2hlZCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJhc2VDb250YWluZXIuc3ZnO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZDMuc2VsZWN0KHRoaXMuYmFzZUNvbnRhaW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QmFzZUNvbnRhaW5lck5vZGUoKXtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QmFzZUNvbnRhaW5lcigpLm5vZGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcmVmaXhDbGFzcyhjbGF6eiwgYWRkRG90KXtcclxuICAgICAgICByZXR1cm4gYWRkRG90PyAnLic6ICcnK3RoaXMuY29uZmlnLmNzc0NsYXNzUHJlZml4K2NsYXp6O1xyXG4gICAgfVxyXG4gICAgY29tcHV0ZVBsb3RTaXplKCkge1xyXG4gICAgICAgIHRoaXMucGxvdC53aWR0aCA9IFV0aWxzLmF2YWlsYWJsZVdpZHRoKHRoaXMuY29uZmlnLndpZHRoLCB0aGlzLmdldEJhc2VDb250YWluZXIoKSwgdGhpcy5wbG90Lm1hcmdpbik7XHJcbiAgICAgICAgdGhpcy5wbG90LmhlaWdodCA9IFV0aWxzLmF2YWlsYWJsZUhlaWdodCh0aGlzLmNvbmZpZy5oZWlnaHQsIHRoaXMuZ2V0QmFzZUNvbnRhaW5lcigpLCB0aGlzLnBsb3QubWFyZ2luKTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2l0aW9uRW5hYmxlZCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc0luaXRpYWxpemVkICYmIHRoaXMuY29uZmlnLnRyYW5zaXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1Rvb2x0aXAoaHRtbCl7XHJcbiAgICAgICAgaWYoIXRoaXMucGxvdC50b29sdGlwKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgLmR1cmF0aW9uKDIwMClcclxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAuOSk7XHJcbiAgICAgICAgdGhpcy5wbG90LnRvb2x0aXAuaHRtbChodG1sKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBoaWRlVG9vbHRpcCgpe1xyXG4gICAgICAgIGlmKCF0aGlzLnBsb3QudG9vbHRpcCl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXHJcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDaGFydCwgQ2hhcnRDb25maWd9IGZyb20gXCIuL2NoYXJ0XCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7U3RhdGlzdGljc1V0aWxzfSBmcm9tICcuL3N0YXRpc3RpY3MtdXRpbHMnXHJcbmltcG9ydCB7TGVnZW5kfSBmcm9tICcuL2xlZ2VuZCdcclxuaW1wb3J0IHtTY2F0dGVyUGxvdH0gZnJvbSAnLi9zY2F0dGVycGxvdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBDb3JyZWxhdGlvbk1hdHJpeENvbmZpZyBleHRlbmRzIENoYXJ0Q29uZmlnIHtcclxuXHJcbiAgICBzdmdDbGFzcyA9IHRoaXMuY3NzQ2xhc3NQcmVmaXgrJ2NvcnJlbGF0aW9uLW1hdHJpeCc7XHJcbiAgICBndWlkZXMgPSBmYWxzZTsgLy9zaG93IGF4aXMgZ3VpZGVzXHJcbiAgICBzaG93VG9vbHRpcCA9IHRydWU7IC8vc2hvdyB0b29sdGlwIG9uIGRvdCBob3ZlclxyXG4gICAgc2hvd0xlZ2VuZCA9IHRydWU7XHJcbiAgICBoaWdobGlnaHRMYWJlbHMgPSB0cnVlO1xyXG4gICAgcm90YXRlTGFiZWxzWCA9IHRydWU7XHJcbiAgICByb3RhdGVMYWJlbHNZID0gdHJ1ZTtcclxuICAgIHZhcmlhYmxlcyA9IHtcclxuICAgICAgICBsYWJlbHM6IHVuZGVmaW5lZCxcclxuICAgICAgICBrZXlzOiBbXSwgLy9vcHRpb25hbCBhcnJheSBvZiB2YXJpYWJsZSBrZXlzXHJcbiAgICAgICAgdmFsdWU6IChkLCB2YXJpYWJsZUtleSkgPT4gZFt2YXJpYWJsZUtleV0sIC8vIHZhcmlhYmxlIHZhbHVlIGFjY2Vzc29yXHJcbiAgICAgICAgc2NhbGU6IFwib3JkaW5hbFwiXHJcbiAgICB9O1xyXG4gICAgY29ycmVsYXRpb24gPSB7XHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCIsXHJcbiAgICAgICAgZG9tYWluOiBbLTEsIC0wLjc1LCAtMC41LCAwLCAwLjUsIDAuNzUsIDFdLFxyXG4gICAgICAgIHJhbmdlOiBbXCJkYXJrYmx1ZVwiLCBcImJsdWVcIiwgXCJsaWdodHNreWJsdWVcIiwgXCJ3aGl0ZVwiLCBcIm9yYW5nZXJlZFwiLCBcImNyaW1zb25cIiwgXCJkYXJrcmVkXCJdLFxyXG4gICAgICAgIHZhbHVlOiAoeFZhbHVlcywgeVZhbHVlcykgPT4gU3RhdGlzdGljc1V0aWxzLnNhbXBsZUNvcnJlbGF0aW9uKHhWYWx1ZXMsIHlWYWx1ZXMpXHJcblxyXG4gICAgfTtcclxuICAgIGNlbGwgPSB7XHJcbiAgICAgICAgc2hhcGU6IFwiZWxsaXBzZVwiLCAvL3Bvc3NpYmxlIHZhbHVlczogcmVjdCwgY2lyY2xlLCBlbGxpcHNlXHJcbiAgICAgICAgc2l6ZTogdW5kZWZpbmVkLFxyXG4gICAgICAgIHNpemVNaW46IDE1LFxyXG4gICAgICAgIHNpemVNYXg6IDI1MCxcclxuICAgICAgICBwYWRkaW5nOiAxXHJcbiAgICB9O1xyXG4gICAgbWFyZ2luID0ge1xyXG4gICAgICAgIGxlZnQ6IDYwLFxyXG4gICAgICAgIHJpZ2h0OiA1MCxcclxuICAgICAgICB0b3A6IDMwLFxyXG4gICAgICAgIGJvdHRvbTogNjBcclxuICAgIH07XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBpZiAoY3VzdG9tKSB7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb3JyZWxhdGlvbk1hdHJpeCBleHRlbmRzIENoYXJ0IHtcclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIG5ldyBDb3JyZWxhdGlvbk1hdHJpeENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgQ29ycmVsYXRpb25NYXRyaXhDb25maWcoY29uZmlnKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSB0aGlzLmNvbmZpZy5tYXJnaW47XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnggPSB7fTtcclxuICAgICAgICB0aGlzLnBsb3QuY29ycmVsYXRpb24gPSB7XHJcbiAgICAgICAgICAgIG1hdHJpeDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBjZWxsczogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBjb2xvcjoge30sXHJcbiAgICAgICAgICAgIHNoYXBlOiB7fVxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICB0aGlzLnNldHVwVmFyaWFibGVzKCk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gY29uZi53aWR0aDtcclxuICAgICAgICB2YXIgcGxhY2Vob2xkZXJOb2RlID0gdGhpcy5nZXRCYXNlQ29udGFpbmVyTm9kZSgpO1xyXG4gICAgICAgIHRoaXMucGxvdC5wbGFjZWhvbGRlck5vZGUgPSBwbGFjZWhvbGRlck5vZGU7XHJcblxyXG4gICAgICAgIHZhciBwYXJlbnRXaWR0aCA9IHBsYWNlaG9sZGVyTm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcclxuICAgICAgICBpZiAod2lkdGgpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wbG90LmNlbGxTaXplKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuY2VsbFNpemUgPSBNYXRoLm1heChjb25mLmNlbGwuc2l6ZU1pbiwgTWF0aC5taW4oY29uZi5jZWxsLnNpemVNYXgsICh3aWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0KSAvIHRoaXMucGxvdC52YXJpYWJsZXMubGVuZ3RoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxTaXplID0gdGhpcy5jb25maWcuY2VsbC5zaXplO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLnBsb3QuY2VsbFNpemUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsU2l6ZSA9IE1hdGgubWF4KGNvbmYuY2VsbC5zaXplTWluLCBNYXRoLm1pbihjb25mLmNlbGwuc2l6ZU1heCwgKHBhcmVudFdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQpIC8gdGhpcy5wbG90LnZhcmlhYmxlcy5sZW5ndGgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgd2lkdGggPSB0aGlzLnBsb3QuY2VsbFNpemUgKiB0aGlzLnBsb3QudmFyaWFibGVzLmxlbmd0aCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0O1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBoZWlnaHQgPSB3aWR0aDtcclxuICAgICAgICBpZiAoIWhlaWdodCkge1xyXG4gICAgICAgICAgICBoZWlnaHQgPSBwbGFjZWhvbGRlck5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wbG90LndpZHRoID0gd2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodDtcclxuICAgICAgICB0aGlzLnBsb3QuaGVpZ2h0ID0gdGhpcy5wbG90LndpZHRoO1xyXG5cclxuICAgICAgICB0aGlzLnNldHVwVmFyaWFibGVzU2NhbGVzKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cENvcnJlbGF0aW9uU2NhbGVzKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cENvcnJlbGF0aW9uTWF0cml4KCk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cFZhcmlhYmxlc1NjYWxlcygpIHtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHggPSBwbG90Lng7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZy52YXJpYWJsZXM7XHJcblxyXG4gICAgICAgIC8qICpcclxuICAgICAgICAgKiB2YWx1ZSBhY2Nlc3NvciAtIHJldHVybnMgdGhlIHZhbHVlIHRvIGVuY29kZSBmb3IgYSBnaXZlbiBkYXRhIG9iamVjdC5cclxuICAgICAgICAgKiBzY2FsZSAtIG1hcHMgdmFsdWUgdG8gYSB2aXN1YWwgZGlzcGxheSBlbmNvZGluZywgc3VjaCBhcyBhIHBpeGVsIHBvc2l0aW9uLlxyXG4gICAgICAgICAqIG1hcCBmdW5jdGlvbiAtIG1hcHMgZnJvbSBkYXRhIHZhbHVlIHRvIGRpc3BsYXkgdmFsdWVcclxuICAgICAgICAgKiBheGlzIC0gc2V0cyB1cCBheGlzXHJcbiAgICAgICAgICoqL1xyXG4gICAgICAgIHgudmFsdWUgPSBjb25mLnZhbHVlO1xyXG4gICAgICAgIHguc2NhbGUgPSBkMy5zY2FsZVtjb25mLnNjYWxlXSgpLnJhbmdlQmFuZHMoW3Bsb3Qud2lkdGgsIDBdKTtcclxuICAgICAgICB4Lm1hcCA9IGQgPT4geC5zY2FsZSh4LnZhbHVlKGQpKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwQ29ycmVsYXRpb25TY2FsZXMoKSB7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIGNvcnJDb25mID0gdGhpcy5jb25maWcuY29ycmVsYXRpb247XHJcblxyXG4gICAgICAgIHBsb3QuY29ycmVsYXRpb24uY29sb3Iuc2NhbGUgPSBkMy5zY2FsZVtjb3JyQ29uZi5zY2FsZV0oKS5kb21haW4oY29yckNvbmYuZG9tYWluKS5yYW5nZShjb3JyQ29uZi5yYW5nZSk7XHJcbiAgICAgICAgdmFyIHNoYXBlID0gcGxvdC5jb3JyZWxhdGlvbi5zaGFwZSA9IHt9O1xyXG5cclxuICAgICAgICB2YXIgY2VsbENvbmYgPSB0aGlzLmNvbmZpZy5jZWxsO1xyXG4gICAgICAgIHNoYXBlLnR5cGUgPSBjZWxsQ29uZi5zaGFwZTtcclxuXHJcbiAgICAgICAgdmFyIHNoYXBlU2l6ZSA9IHBsb3QuY2VsbFNpemUgLSBjZWxsQ29uZi5wYWRkaW5nICogMjtcclxuICAgICAgICBpZiAoc2hhcGUudHlwZSA9PSAnY2lyY2xlJykge1xyXG4gICAgICAgICAgICB2YXIgcmFkaXVzTWF4ID0gc2hhcGVTaXplIC8gMjtcclxuICAgICAgICAgICAgc2hhcGUucmFkaXVzU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzAsIDFdKS5yYW5nZShbMiwgcmFkaXVzTWF4XSk7XHJcbiAgICAgICAgICAgIHNoYXBlLnJhZGl1cyA9IGM9PiBzaGFwZS5yYWRpdXNTY2FsZShNYXRoLmFicyhjLnZhbHVlKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzaGFwZS50eXBlID09ICdlbGxpcHNlJykge1xyXG4gICAgICAgICAgICB2YXIgcmFkaXVzTWF4ID0gc2hhcGVTaXplIC8gMjtcclxuICAgICAgICAgICAgc2hhcGUucmFkaXVzU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzAsIDFdKS5yYW5nZShbcmFkaXVzTWF4LCAyXSk7XHJcbiAgICAgICAgICAgIHNoYXBlLnJhZGl1c1ggPSBjPT4gc2hhcGUucmFkaXVzU2NhbGUoTWF0aC5hYnMoYy52YWx1ZSkpO1xyXG4gICAgICAgICAgICBzaGFwZS5yYWRpdXNZID0gcmFkaXVzTWF4O1xyXG5cclxuICAgICAgICAgICAgc2hhcGUucm90YXRlVmFsID0gdiA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodiA9PSAwKSByZXR1cm4gXCIwXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAodiA8IDApIHJldHVybiBcIi00NVwiO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiNDVcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChzaGFwZS50eXBlID09ICdyZWN0Jykge1xyXG4gICAgICAgICAgICBzaGFwZS5zaXplID0gc2hhcGVTaXplO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNldHVwVmFyaWFibGVzKCkge1xyXG5cclxuICAgICAgICB2YXIgdmFyaWFibGVzQ29uZiA9IHRoaXMuY29uZmlnLnZhcmlhYmxlcztcclxuXHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgcGxvdC5kb21haW5CeVZhcmlhYmxlID0ge307XHJcbiAgICAgICAgcGxvdC52YXJpYWJsZXMgPSB2YXJpYWJsZXNDb25mLmtleXM7XHJcbiAgICAgICAgaWYgKCFwbG90LnZhcmlhYmxlcyB8fCAhcGxvdC52YXJpYWJsZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHBsb3QudmFyaWFibGVzID0gVXRpbHMuaW5mZXJWYXJpYWJsZXMoZGF0YSwgdGhpcy5jb25maWcuZ3JvdXBzLmtleSwgdGhpcy5jb25maWcuaW5jbHVkZUluUGxvdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwbG90LmxhYmVscyA9IFtdO1xyXG4gICAgICAgIHBsb3QubGFiZWxCeVZhcmlhYmxlID0ge307XHJcbiAgICAgICAgcGxvdC52YXJpYWJsZXMuZm9yRWFjaCgodmFyaWFibGVLZXksIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHBsb3QuZG9tYWluQnlWYXJpYWJsZVt2YXJpYWJsZUtleV0gPSBkMy5leHRlbnQoZGF0YSwgKGQpID0+IHZhcmlhYmxlc0NvbmYudmFsdWUoZCwgdmFyaWFibGVLZXkpKTtcclxuICAgICAgICAgICAgdmFyIGxhYmVsID0gdmFyaWFibGVLZXk7XHJcbiAgICAgICAgICAgIGlmICh2YXJpYWJsZXNDb25mLmxhYmVscyAmJiB2YXJpYWJsZXNDb25mLmxhYmVscy5sZW5ndGggPiBpbmRleCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxhYmVsID0gdmFyaWFibGVzQ29uZi5sYWJlbHNbaW5kZXhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBsb3QubGFiZWxzLnB1c2gobGFiZWwpO1xyXG4gICAgICAgICAgICBwbG90LmxhYmVsQnlWYXJpYWJsZVt2YXJpYWJsZUtleV0gPSBsYWJlbDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2cocGxvdC5sYWJlbEJ5VmFyaWFibGUpO1xyXG5cclxuICAgIH07XHJcblxyXG5cclxuICAgIHNldHVwQ29ycmVsYXRpb25NYXRyaXgoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIHZhciBtYXRyaXggPSB0aGlzLnBsb3QuY29ycmVsYXRpb24ubWF0cml4ID0gW107XHJcbiAgICAgICAgdmFyIG1hdHJpeENlbGxzID0gdGhpcy5wbG90LmNvcnJlbGF0aW9uLm1hdHJpeC5jZWxscyA9IFtdO1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG5cclxuICAgICAgICB2YXIgdmFyaWFibGVUb1ZhbHVlcyA9IHt9O1xyXG4gICAgICAgIHBsb3QudmFyaWFibGVzLmZvckVhY2goKHYsIGkpID0+IHtcclxuXHJcbiAgICAgICAgICAgIHZhcmlhYmxlVG9WYWx1ZXNbdl0gPSBkYXRhLm1hcChkPT5wbG90LngudmFsdWUoZCwgdikpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBwbG90LnZhcmlhYmxlcy5mb3JFYWNoKCh2MSwgaSkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgcm93ID0gW107XHJcbiAgICAgICAgICAgIG1hdHJpeC5wdXNoKHJvdyk7XHJcblxyXG4gICAgICAgICAgICBwbG90LnZhcmlhYmxlcy5mb3JFYWNoKCh2MiwgaikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvcnIgPSAxO1xyXG4gICAgICAgICAgICAgICAgaWYgKHYxICE9IHYyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29yciA9IHNlbGYuY29uZmlnLmNvcnJlbGF0aW9uLnZhbHVlKHZhcmlhYmxlVG9WYWx1ZXNbdjFdLCB2YXJpYWJsZVRvVmFsdWVzW3YyXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgY2VsbCA9IHtcclxuICAgICAgICAgICAgICAgICAgICByb3dWYXI6IHYxLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbFZhcjogdjIsXHJcbiAgICAgICAgICAgICAgICAgICAgcm93OiBpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbDogaixcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogY29yclxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJvdy5wdXNoKGNlbGwpO1xyXG5cclxuICAgICAgICAgICAgICAgIG1hdHJpeENlbGxzLnB1c2goY2VsbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgdXBkYXRlKG5ld0RhdGEpIHtcclxuICAgICAgICBzdXBlci51cGRhdGUobmV3RGF0YSk7XHJcbiAgICAgICAgLy8gdGhpcy51cGRhdGVcclxuICAgICAgICB0aGlzLnVwZGF0ZUNlbGxzKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWYXJpYWJsZUxhYmVscygpO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnNob3dMZWdlbmQpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVMZWdlbmQoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHVwZGF0ZVZhcmlhYmxlTGFiZWxzKCkge1xyXG4gICAgICAgIHRoaXMucGxvdC5sYWJlbENsYXNzID0gdGhpcy5wcmVmaXhDbGFzcyhcImxhYmVsXCIpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQXhpc1goKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUF4aXNZKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlQXhpc1goKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBsYWJlbENsYXNzID0gcGxvdC5sYWJlbENsYXNzO1xyXG4gICAgICAgIHZhciBsYWJlbFhDbGFzcyA9IGxhYmVsQ2xhc3MgKyBcIi14XCI7XHJcblxyXG4gICAgICAgIHZhciBsYWJlbHMgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIGxhYmVsWENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShwbG90LnZhcmlhYmxlcywgKGQsIGkpPT5pKTtcclxuXHJcbiAgICAgICAgbGFiZWxzLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKS5hdHRyKFwiY2xhc3NcIiwgKGQsIGkpID0+IGxhYmVsQ2xhc3MgKyBcIiBcIiArIGxhYmVsWENsYXNzICsgXCIgXCIgKyBsYWJlbFhDbGFzcyArIFwiLVwiICsgaSk7XHJcblxyXG4gICAgICAgIGxhYmVsc1xyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgKGQsIGkpID0+IGkgKiBwbG90LmNlbGxTaXplICsgcGxvdC5jZWxsU2l6ZSAvIDIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCBwbG90LmhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoXCJkeFwiLCAtMilcclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCA1KVxyXG4gICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpXHJcblxyXG4gICAgICAgICAgICAvLyAuYXR0cihcImRvbWluYW50LWJhc2VsaW5lXCIsIFwiaGFuZ2luZ1wiKVxyXG4gICAgICAgICAgICAudGV4dCh2PT5wbG90LmxhYmVsQnlWYXJpYWJsZVt2XSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5yb3RhdGVMYWJlbHNYKSB7XHJcbiAgICAgICAgICAgIGxhYmVscy5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInJvdGF0ZSgtNDUsIFwiICsgKGkgKiBwbG90LmNlbGxTaXplICsgcGxvdC5jZWxsU2l6ZSAvIDIgICkgKyBcIiwgXCIgKyBwbG90LmhlaWdodCArIFwiKVwiKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG1heFdpZHRoID0gc2VsZi5jb21wdXRlWEF4aXNMYWJlbHNXaWR0aCgpO1xyXG4gICAgICAgIGxhYmVscy5lYWNoKGZ1bmN0aW9uIChsYWJlbCkge1xyXG4gICAgICAgICAgICBVdGlscy5wbGFjZVRleHRXaXRoRWxsaXBzaXNBbmRUb29sdGlwKGQzLnNlbGVjdCh0aGlzKSwgbGFiZWwsIG1heFdpZHRoLCBzZWxmLmNvbmZpZy5zaG93VG9vbHRpcCA/IHNlbGYucGxvdC50b29sdGlwIDogZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsYWJlbHMuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUF4aXNZKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgbGFiZWxDbGFzcyA9IHBsb3QubGFiZWxDbGFzcztcclxuICAgICAgICB2YXIgbGFiZWxZQ2xhc3MgPSBwbG90LmxhYmVsQ2xhc3MgKyBcIi15XCI7XHJcbiAgICAgICAgdmFyIGxhYmVscyA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgbGFiZWxZQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBsb3QudmFyaWFibGVzKTtcclxuXHJcbiAgICAgICAgbGFiZWxzLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKTtcclxuXHJcbiAgICAgICAgbGFiZWxzXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgKGQsIGkpID0+IGkgKiBwbG90LmNlbGxTaXplICsgcGxvdC5jZWxsU2l6ZSAvIDIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHhcIiwgLTIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCAoZCwgaSkgPT4gbGFiZWxDbGFzcyArIFwiIFwiICsgbGFiZWxZQ2xhc3MgKyBcIiBcIiArIGxhYmVsWUNsYXNzICsgXCItXCIgKyBpKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcImRvbWluYW50LWJhc2VsaW5lXCIsIFwiaGFuZ2luZ1wiKVxyXG4gICAgICAgICAgICAudGV4dCh2PT5wbG90LmxhYmVsQnlWYXJpYWJsZVt2XSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5yb3RhdGVMYWJlbHNZKSB7XHJcbiAgICAgICAgICAgIGxhYmVsc1xyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwicm90YXRlKC00NSwgXCIgKyAwICsgXCIsIFwiICsgKGkgKiBwbG90LmNlbGxTaXplICsgcGxvdC5jZWxsU2l6ZSAvIDIpICsgXCIpXCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG1heFdpZHRoID0gc2VsZi5jb21wdXRlWUF4aXNMYWJlbHNXaWR0aCgpO1xyXG4gICAgICAgIGxhYmVscy5lYWNoKGZ1bmN0aW9uIChsYWJlbCkge1xyXG4gICAgICAgICAgICBVdGlscy5wbGFjZVRleHRXaXRoRWxsaXBzaXNBbmRUb29sdGlwKGQzLnNlbGVjdCh0aGlzKSwgbGFiZWwsIG1heFdpZHRoLCBzZWxmLmNvbmZpZy5zaG93VG9vbHRpcCA/IHNlbGYucGxvdC50b29sdGlwIDogZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsYWJlbHMuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXB1dGVZQXhpc0xhYmVsc1dpZHRoKCkge1xyXG4gICAgICAgIHZhciBtYXhXaWR0aCA9IHRoaXMucGxvdC5tYXJnaW4ubGVmdDtcclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLnJvdGF0ZUxhYmVsc1kpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1heFdpZHRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWF4V2lkdGggKj0gVXRpbHMuU1FSVF8yO1xyXG4gICAgICAgIHZhciBmb250U2l6ZSA9IDExOyAvL3RvZG8gY2hlY2sgYWN0dWFsIGZvbnQgc2l6ZVxyXG4gICAgICAgIG1heFdpZHRoIC09IGZvbnRTaXplIC8gMjtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1heFdpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXB1dGVYQXhpc0xhYmVsc1dpZHRoKG9mZnNldCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcucm90YXRlTGFiZWxzWCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wbG90LmNlbGxTaXplIC0gMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHNpemUgPSB0aGlzLnBsb3QubWFyZ2luLmJvdHRvbTtcclxuICAgICAgICBzaXplICo9IFV0aWxzLlNRUlRfMjtcclxuICAgICAgICB2YXIgZm9udFNpemUgPSAxMTsgLy90b2RvIGNoZWNrIGFjdHVhbCBmb250IHNpemVcclxuICAgICAgICBzaXplIC09IGZvbnRTaXplIC8gMjtcclxuICAgICAgICByZXR1cm4gc2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVDZWxscygpIHtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBjZWxsQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwiY2VsbFwiKTtcclxuICAgICAgICB2YXIgY2VsbFNoYXBlID0gcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS50eXBlO1xyXG5cclxuICAgICAgICB2YXIgY2VsbHMgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwiZy5cIiArIGNlbGxDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGxvdC5jb3JyZWxhdGlvbi5tYXRyaXguY2VsbHMpO1xyXG5cclxuICAgICAgICB2YXIgY2VsbEVudGVyRyA9IGNlbGxzLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuY2xhc3NlZChjZWxsQ2xhc3MsIHRydWUpO1xyXG4gICAgICAgIGNlbGxzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYz0+IFwidHJhbnNsYXRlKFwiICsgKHBsb3QuY2VsbFNpemUgKiBjLmNvbCArIHBsb3QuY2VsbFNpemUgLyAyKSArIFwiLFwiICsgKHBsb3QuY2VsbFNpemUgKiBjLnJvdyArIHBsb3QuY2VsbFNpemUgLyAyKSArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgY2VsbHMuY2xhc3NlZChzZWxmLmNvbmZpZy5jc3NDbGFzc1ByZWZpeCArIFwic2VsZWN0YWJsZVwiLCAhIXNlbGYuc2NhdHRlclBsb3QpO1xyXG5cclxuICAgICAgICB2YXIgc2VsZWN0b3IgPSBcIio6bm90KC5jZWxsLXNoYXBlLVwiICsgY2VsbFNoYXBlICsgXCIpXCI7XHJcblxyXG4gICAgICAgIHZhciB3cm9uZ1NoYXBlcyA9IGNlbGxzLnNlbGVjdEFsbChzZWxlY3Rvcik7XHJcbiAgICAgICAgd3JvbmdTaGFwZXMucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIHZhciBzaGFwZXMgPSBjZWxscy5zZWxlY3RPckFwcGVuZChjZWxsU2hhcGUgKyBcIi5jZWxsLXNoYXBlLVwiICsgY2VsbFNoYXBlKTtcclxuXHJcbiAgICAgICAgaWYgKHBsb3QuY29ycmVsYXRpb24uc2hhcGUudHlwZSA9PSAnY2lyY2xlJykge1xyXG5cclxuICAgICAgICAgICAgc2hhcGVzXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInJcIiwgcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5yYWRpdXMpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImN4XCIsIDApXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImN5XCIsIDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBsb3QuY29ycmVsYXRpb24uc2hhcGUudHlwZSA9PSAnZWxsaXBzZScpIHtcclxuICAgICAgICAgICAgLy8gY2VsbHMuYXR0cihcInRyYW5zZm9ybVwiLCBjPT4gXCJ0cmFuc2xhdGUoMzAwLDE1MCkgcm90YXRlKFwiK3Bsb3QuY29ycmVsYXRpb24uc2hhcGUucm90YXRlVmFsKGMudmFsdWUpK1wiKVwiKTtcclxuICAgICAgICAgICAgc2hhcGVzXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInJ4XCIsIHBsb3QuY29ycmVsYXRpb24uc2hhcGUucmFkaXVzWClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwicnlcIiwgcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5yYWRpdXNZKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCAwKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCAwKVxyXG5cclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGM9PiBcInJvdGF0ZShcIiArIHBsb3QuY29ycmVsYXRpb24uc2hhcGUucm90YXRlVmFsKGMudmFsdWUpICsgXCIpXCIpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGlmIChwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnR5cGUgPT0gJ3JlY3QnKSB7XHJcbiAgICAgICAgICAgIHNoYXBlc1xyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnNpemUpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnNpemUpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInhcIiwgLXBsb3QuY2VsbFNpemUgLyAyKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIC1wbG90LmNlbGxTaXplIC8gMik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNoYXBlcy5zdHlsZShcImZpbGxcIiwgYz0+IHBsb3QuY29ycmVsYXRpb24uY29sb3Iuc2NhbGUoYy52YWx1ZSkpO1xyXG5cclxuICAgICAgICB2YXIgbW91c2VvdmVyQ2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgdmFyIG1vdXNlb3V0Q2FsbGJhY2tzID0gW107XHJcblxyXG4gICAgICAgIGlmIChwbG90LnRvb2x0aXApIHtcclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3ZlckNhbGxiYWNrcy5wdXNoKGM9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IGMudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNob3dUb29sdGlwKGh0bWwpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLnB1c2goYz0+IHtcclxuICAgICAgICAgICAgICAgIHNlbGYuaGlkZVRvb2x0aXAoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy5oaWdobGlnaHRMYWJlbHMpIHtcclxuICAgICAgICAgICAgdmFyIGhpZ2hsaWdodENsYXNzID0gc2VsZi5jb25maWcuY3NzQ2xhc3NQcmVmaXggKyBcImhpZ2hsaWdodFwiO1xyXG4gICAgICAgICAgICB2YXIgeExhYmVsQ2xhc3MgPSBjPT5wbG90LmxhYmVsQ2xhc3MgKyBcIi14LVwiICsgYy5jb2w7XHJcbiAgICAgICAgICAgIHZhciB5TGFiZWxDbGFzcyA9IGM9PnBsb3QubGFiZWxDbGFzcyArIFwiLXktXCIgKyBjLnJvdztcclxuXHJcblxyXG4gICAgICAgICAgICBtb3VzZW92ZXJDYWxsYmFja3MucHVzaChjPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgeExhYmVsQ2xhc3MoYykpLmNsYXNzZWQoaGlnaGxpZ2h0Q2xhc3MsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB5TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBtb3VzZW91dENhbGxiYWNrcy5wdXNoKGM9PiB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHhMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHlMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGNlbGxzLm9uKFwibW91c2VvdmVyXCIsIGMgPT4ge1xyXG4gICAgICAgICAgICBtb3VzZW92ZXJDYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjaz0+Y2FsbGJhY2soYykpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGMgPT4ge1xyXG4gICAgICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjaz0+Y2FsbGJhY2soYykpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY2VsbHMub24oXCJjbGlja1wiLCBjPT4ge1xyXG4gICAgICAgICAgICBzZWxmLnRyaWdnZXIoXCJjZWxsLXNlbGVjdGVkXCIsIGMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgY2VsbHMuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB1cGRhdGVMZWdlbmQoKSB7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciBsZWdlbmRYID0gdGhpcy5wbG90LndpZHRoICsgMTA7XHJcbiAgICAgICAgdmFyIGxlZ2VuZFkgPSAwO1xyXG4gICAgICAgIHZhciBiYXJXaWR0aCA9IDEwO1xyXG4gICAgICAgIHZhciBiYXJIZWlnaHQgPSB0aGlzLnBsb3QuaGVpZ2h0IC0gMjtcclxuICAgICAgICB2YXIgc2NhbGUgPSBwbG90LmNvcnJlbGF0aW9uLmNvbG9yLnNjYWxlO1xyXG5cclxuICAgICAgICBwbG90LmxlZ2VuZCA9IG5ldyBMZWdlbmQodGhpcy5zdmcsIHRoaXMuc3ZnRywgc2NhbGUsIGxlZ2VuZFgsIGxlZ2VuZFkpLmxpbmVhckdyYWRpZW50QmFyKGJhcldpZHRoLCBiYXJIZWlnaHQpO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXR0YWNoU2NhdHRlclBsb3QoY29udGFpbmVyU2VsZWN0b3IsIGNvbmZpZykge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cclxuXHJcbiAgICAgICAgdmFyIHNjYXR0ZXJQbG90Q29uZmlnID0ge1xyXG4gICAgICAgICAgICBoZWlnaHQ6IHNlbGYucGxvdC5oZWlnaHQgKyBzZWxmLmNvbmZpZy5tYXJnaW4udG9wICsgc2VsZi5jb25maWcubWFyZ2luLmJvdHRvbSxcclxuICAgICAgICAgICAgd2lkdGg6IHNlbGYucGxvdC5oZWlnaHQgKyBzZWxmLmNvbmZpZy5tYXJnaW4udG9wICsgc2VsZi5jb25maWcubWFyZ2luLmJvdHRvbSxcclxuICAgICAgICAgICAgZ3JvdXBzOiB7XHJcbiAgICAgICAgICAgICAgICBrZXk6IHNlbGYuY29uZmlnLmdyb3Vwcy5rZXksXHJcbiAgICAgICAgICAgICAgICBsYWJlbDogc2VsZi5jb25maWcuZ3JvdXBzLmxhYmVsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGd1aWRlczogdHJ1ZSxcclxuICAgICAgICAgICAgc2hvd0xlZ2VuZDogZmFsc2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNjYXR0ZXJQbG90ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgc2NhdHRlclBsb3RDb25maWcgPSBVdGlscy5kZWVwRXh0ZW5kKHNjYXR0ZXJQbG90Q29uZmlnLCBjb25maWcpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMub24oXCJjZWxsLXNlbGVjdGVkXCIsIGM9PiB7XHJcblxyXG5cclxuICAgICAgICAgICAgc2NhdHRlclBsb3RDb25maWcueCA9IHtcclxuICAgICAgICAgICAgICAgIGtleTogYy5yb3dWYXIsXHJcbiAgICAgICAgICAgICAgICBsYWJlbDogc2VsZi5wbG90LmxhYmVsQnlWYXJpYWJsZVtjLnJvd1Zhcl1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgc2NhdHRlclBsb3RDb25maWcueSA9IHtcclxuICAgICAgICAgICAgICAgIGtleTogYy5jb2xWYXIsXHJcbiAgICAgICAgICAgICAgICBsYWJlbDogc2VsZi5wbG90LmxhYmVsQnlWYXJpYWJsZVtjLmNvbFZhcl1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKHNlbGYuc2NhdHRlclBsb3QgJiYgc2VsZi5zY2F0dGVyUGxvdCAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zY2F0dGVyUGxvdC5zZXRDb25maWcoc2NhdHRlclBsb3RDb25maWcpLmluaXQoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2NhdHRlclBsb3QgPSBuZXcgU2NhdHRlclBsb3QoY29udGFpbmVyU2VsZWN0b3IsIHNlbGYuZGF0YSwgc2NhdHRlclBsb3RDb25maWcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdHRhY2goXCJTY2F0dGVyUGxvdFwiLCBzZWxmLnNjYXR0ZXJQbG90KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBEM0V4dGVuc2lvbnN7XHJcblxyXG4gICAgc3RhdGljIGV4dGVuZCgpe1xyXG5cclxuICAgICAgICBkMy5zZWxlY3Rpb24uZW50ZXIucHJvdG90eXBlLmluc2VydFNlbGVjdG9yID1cclxuICAgICAgICAgICAgZDMuc2VsZWN0aW9uLnByb3RvdHlwZS5pbnNlcnRTZWxlY3RvciA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBiZWZvcmUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBVdGlscy5pbnNlcnRTZWxlY3Rvcih0aGlzLCBzZWxlY3RvciwgYmVmb3JlKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIGQzLnNlbGVjdGlvbi5lbnRlci5wcm90b3R5cGUuYXBwZW5kU2VsZWN0b3IgPVxyXG4gICAgICAgICAgICBkMy5zZWxlY3Rpb24ucHJvdG90eXBlLmFwcGVuZFNlbGVjdG9yID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBVdGlscy5hcHBlbmRTZWxlY3Rvcih0aGlzLCBzZWxlY3Rvcik7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIGQzLnNlbGVjdGlvbi5lbnRlci5wcm90b3R5cGUuc2VsZWN0T3JBcHBlbmQgPVxyXG4gICAgICAgICAgICBkMy5zZWxlY3Rpb24ucHJvdG90eXBlLnNlbGVjdE9yQXBwZW5kID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBVdGlscy5zZWxlY3RPckFwcGVuZCh0aGlzLCBzZWxlY3Rvcik7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIGQzLnNlbGVjdGlvbi5lbnRlci5wcm90b3R5cGUuc2VsZWN0T3JJbnNlcnQgPVxyXG4gICAgICAgICAgICBkMy5zZWxlY3Rpb24ucHJvdG90eXBlLnNlbGVjdE9ySW5zZXJ0ID0gZnVuY3Rpb24oc2VsZWN0b3IsIGJlZm9yZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFV0aWxzLnNlbGVjdE9ySW5zZXJ0KHRoaXMsIHNlbGVjdG9yLCBiZWZvcmUpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuXHJcblxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q2hhcnQsIENoYXJ0Q29uZmlnfSBmcm9tIFwiLi9jaGFydFwiO1xyXG5pbXBvcnQge0hlYXRtYXAsIEhlYXRtYXBDb25maWd9IGZyb20gXCIuL2hlYXRtYXBcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IHtTdGF0aXN0aWNzVXRpbHN9IGZyb20gJy4vc3RhdGlzdGljcy11dGlscydcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgSGVhdG1hcFRpbWVTZXJpZXNDb25maWcgZXh0ZW5kcyBIZWF0bWFwQ29uZmlnIHtcclxuICAgIHggPSB7XHJcbiAgICAgICAgZmlsbE1pc3Npbmc6IGZhbHNlLCAvLyBmaWxsIG1pc3NpbmcgdmFsdWVzIHVzaW5nIGludGVydmFsIGFuZCBpbnRlcnZhbFN0ZXBcclxuICAgICAgICBpbnRlcnZhbDogdW5kZWZpbmVkLCAvL3VzZWQgaW4gZmlsbGluZyBtaXNzaW5nIHRpY2tzXHJcbiAgICAgICAgaW50ZXJ2YWxTdGVwOiAxLFxyXG4gICAgICAgIGZvcm1hdDogdW5kZWZpbmVkLCAvL2lucHV0IGRhdGEgZDMgdGltZSBmb3JtYXRcclxuICAgICAgICBkaXNwbGF5Rm9ybWF0OiB1bmRlZmluZWQsLy9kMyB0aW1lIGZvcm1hdCBmb3IgZGlzcGxheVxyXG4gICAgICAgIGludGVydmFsVG9Gb3JtYXRzOiBbIC8vdXNlZCB0byBndWVzcyBpbnRlcnZhbCBhbmQgZm9ybWF0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICd5ZWFyJyxcclxuICAgICAgICAgICAgICAgIGZvcm1hdHM6IFtcIiVZXCJdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdtb250aCcsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXRzOiBbXCIlWS0lbVwiXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnZGF5JyxcclxuICAgICAgICAgICAgICAgIGZvcm1hdHM6IFtcIiVZLSVtLSVkXCJdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdob3VyJyxcclxuICAgICAgICAgICAgICAgIGZvcm1hdHM6IFsnJUgnLCAnJVktJW0tJWQgJUgnXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnbWludXRlJyxcclxuICAgICAgICAgICAgICAgIGZvcm1hdHM6IFsnJUg6JU0nLCAnJVktJW0tJWQgJUg6JU0nXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnc2Vjb25kJyxcclxuICAgICAgICAgICAgICAgIGZvcm1hdHM6IFsnJUg6JU06JVMnLCAnJVktJW0tJWQgJUg6JU06JVMnXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXSxcclxuXHJcbiAgICAgICAgc29ydENvbXBhcmF0b3I6IGZ1bmN0aW9uIHNvcnRDb21wYXJhdG9yKGEsIGIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFV0aWxzLmlzU3RyaW5nKGEpID8gIGEubG9jYWxlQ29tcGFyZShiKSA6ICBhIC0gYjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZvcm1hdHRlcjogdW5kZWZpbmVkXHJcbiAgICB9O1xyXG4gICAgeiA9IHtcclxuICAgICAgICBmaWxsTWlzc2luZzogdHJ1ZSAvLyBmaWlsbCBtaXNzaW5nIHZhbHVlcyB3aXRoIG5lYXJlc3QgcHJldmlvdXMgdmFsdWVcclxuICAgIH07XHJcblxyXG4gICAgbGVnZW5kID0ge1xyXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdmFyIHN1ZmZpeCA9IFwiXCI7XHJcbiAgICAgICAgICAgIGlmICh2IC8gMTAwMDAwMCA+PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBzdWZmaXggPSBcIiBNXCI7XHJcbiAgICAgICAgICAgICAgICB2ID0gTnVtYmVyKHYgLyAxMDAwMDAwKS50b0ZpeGVkKDMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBuZiA9IEludGwuTnVtYmVyRm9ybWF0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBuZi5mb3JtYXQodikgKyBzdWZmaXg7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICBpZiAoY3VzdG9tKSB7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBIZWF0bWFwVGltZVNlcmllcyBleHRlbmRzIEhlYXRtYXAge1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IEhlYXRtYXBUaW1lU2VyaWVzQ29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBIZWF0bWFwVGltZVNlcmllc0NvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgc2V0dXBWYWx1ZXNCZWZvcmVHcm91cHNTb3J0KCkge1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueC50aW1lRm9ybWF0ID0gdGhpcy5jb25maWcueC5mb3JtYXQ7XHJcbiAgICAgICAgaWYodGhpcy5jb25maWcueC5kaXNwbGF5Rm9ybWF0ICYmICF0aGlzLnBsb3QueC50aW1lRm9ybWF0KXtcclxuICAgICAgICAgICAgdGhpcy5ndWVzc1RpbWVGb3JtYXQoKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBzdXBlci5zZXR1cFZhbHVlc0JlZm9yZUdyb3Vwc1NvcnQoKTtcclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLnguZmlsbE1pc3NpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRUaW1lRm9ybWF0QW5kSW50ZXJ2YWwoKTtcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnguaW50ZXJ2YWxTdGVwID0gdGhpcy5jb25maWcueC5pbnRlcnZhbFN0ZXAgfHwgMTtcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LngudGltZVBhcnNlciA9IHRoaXMuZ2V0VGltZVBhcnNlcigpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHRoaXMucGxvdC54LnVuaXF1ZVZhbHVlcy5zb3J0KHRoaXMuY29uZmlnLnguc29ydENvbXBhcmF0b3IpO1xyXG5cclxuICAgICAgICB2YXIgcHJldiA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC54LnVuaXF1ZVZhbHVlcy5mb3JFYWNoKCh4LCBpKT0+IHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLnBhcnNlVGltZSh4KTtcclxuICAgICAgICAgICAgaWYgKHByZXYgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHByZXYgPSBjdXJyZW50O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgbmV4dCA9IHNlbGYubmV4dFRpbWVUaWNrVmFsdWUocHJldik7XHJcbiAgICAgICAgICAgIHZhciBtaXNzaW5nID0gW107XHJcbiAgICAgICAgICAgIHZhciBpdGVyYXRpb24gPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoc2VsZi5jb21wYXJlVGltZVZhbHVlcyhuZXh0LCBjdXJyZW50KTw9MCkge1xyXG4gICAgICAgICAgICAgICAgaXRlcmF0aW9uKys7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlcmF0aW9uID4gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgdmFyIHRpbWVTdHJpbmcgPSBzZWxmLmZvcm1hdFRpbWUobmV4dCk7XHJcbiAgICAgICAgICAgICAgICBkW3RoaXMuY29uZmlnLngua2V5XSA9IHRpbWVTdHJpbmc7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi51cGRhdGVHcm91cHMoZCwgdGltZVN0cmluZywgc2VsZi5wbG90LnguZ3JvdXBzLCBzZWxmLmNvbmZpZy54Lmdyb3Vwcyk7XHJcbiAgICAgICAgICAgICAgICBtaXNzaW5nLnB1c2gobmV4dCk7XHJcbiAgICAgICAgICAgICAgICBuZXh0ID0gc2VsZi5uZXh0VGltZVRpY2tWYWx1ZShuZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcmV2ID0gY3VycmVudDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VUaW1lKHgpIHtcclxuICAgICAgICB2YXIgcGFyc2VyID0gdGhpcy5nZXRUaW1lUGFyc2VyKCk7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZSh4KTtcclxuICAgIH1cclxuXHJcbiAgICBmb3JtYXRUaW1lKGRhdGUpe1xyXG4gICAgICAgIHZhciBwYXJzZXIgPSB0aGlzLmdldFRpbWVQYXJzZXIoKTtcclxuICAgICAgICByZXR1cm4gcGFyc2VyKGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcm1hdFZhbHVlWCh2YWx1ZSkgeyAvL3VzZWQgb25seSBmb3IgZGlzcGxheVxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy54LmZvcm1hdHRlcikgcmV0dXJuIHRoaXMuY29uZmlnLnguZm9ybWF0dGVyLmNhbGwodGhpcy5jb25maWcsIHZhbHVlKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5jb25maWcueC5kaXNwbGF5Rm9ybWF0KXtcclxuICAgICAgICAgICAgdmFyIGRhdGUgPSB0aGlzLnBhcnNlVGltZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkMy50aW1lLmZvcm1hdCh0aGlzLmNvbmZpZy54LmRpc3BsYXlGb3JtYXQpKGRhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIXRoaXMucGxvdC54LnRpbWVGb3JtYXQpIHJldHVybiB2YWx1ZTtcclxuXHJcbiAgICAgICAgaWYoVXRpbHMuaXNEYXRlKHZhbHVlKSl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZvcm1hdFRpbWUodmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBhcmVUaW1lVmFsdWVzKGEsIGIpe1xyXG4gICAgICAgIHJldHVybiBhLWI7XHJcbiAgICB9XHJcblxyXG4gICAgdGltZVZhbHVlc0VxdWFsKGEsIGIpIHtcclxuICAgICAgICB2YXIgcGFyc2VyID0gdGhpcy5wbG90LngudGltZVBhcnNlcjtcclxuICAgICAgICByZXR1cm4gcGFyc2VyKGEpID09PSBwYXJzZXIoYik7XHJcbiAgICB9XHJcblxyXG4gICAgbmV4dFRpbWVUaWNrVmFsdWUodCkge1xyXG4gICAgICAgIHZhciBpbnRlcnZhbCA9IHRoaXMucGxvdC54LmludGVydmFsO1xyXG4gICAgICAgIHJldHVybiBkMy50aW1lW2ludGVydmFsXS5vZmZzZXQodCwgdGhpcy5wbG90LnguaW50ZXJ2YWxTdGVwKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0UGxvdCgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcuei5maWxsTWlzc2luZykge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWF0cml4LmZvckVhY2goKHJvdywgcm93SW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBwcmV2Um93VmFsdWUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICByb3cuZm9yRWFjaCgoY2VsbCwgY29sSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbC52YWx1ZSA9PT0gdW5kZWZpbmVkICYmIHByZXZSb3dWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwudmFsdWUgPSBwcmV2Um93VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwubWlzc2luZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHByZXZSb3dWYWx1ZSA9IGNlbGwudmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKG5ld0RhdGEpIHtcclxuICAgICAgICBzdXBlci51cGRhdGUobmV3RGF0YSk7XHJcblxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgaW5pdFRpbWVGb3JtYXRBbmRJbnRlcnZhbCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnguaW50ZXJ2YWwgPSB0aGlzLmNvbmZpZy54LmludGVydmFsO1xyXG5cclxuICAgICAgICBpZighdGhpcy5wbG90LngudGltZUZvcm1hdCl7XHJcbiAgICAgICAgICAgIHRoaXMuZ3Vlc3NUaW1lRm9ybWF0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZighdGhpcy5wbG90LnguaW50ZXJ2YWwgJiYgdGhpcy5wbG90LngudGltZUZvcm1hdCl7XHJcbiAgICAgICAgICAgIHRoaXMuZ3Vlc3NJbnRlcnZhbCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBndWVzc1RpbWVGb3JtYXQoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpIDwgc2VsZi5jb25maWcueC5pbnRlcnZhbFRvRm9ybWF0cy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGxldCBpbnRlcnZhbEZvcm1hdCA9IHNlbGYuY29uZmlnLnguaW50ZXJ2YWxUb0Zvcm1hdHNbaV07XHJcbiAgICAgICAgICAgIHZhciBmb3JtYXQgPSBudWxsO1xyXG4gICAgICAgICAgICB2YXIgZm9ybWF0TWF0Y2ggPSBpbnRlcnZhbEZvcm1hdC5mb3JtYXRzLnNvbWUoZj0+e1xyXG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gZjtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJzZXIgPSBkMy50aW1lLmZvcm1hdChmKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnBsb3QueC51bmlxdWVWYWx1ZXMuZXZlcnkoeD0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZXIucGFyc2UoeCkgIT09IG51bGxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYoZm9ybWF0TWF0Y2gpe1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wbG90LngudGltZUZvcm1hdCA9IGZvcm1hdDtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHdWVzc2VkIHRpbWVGb3JtYXQnLCBmb3JtYXQpO1xyXG4gICAgICAgICAgICAgICAgaWYoIXNlbGYucGxvdC54LmludGVydmFsKXtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnBsb3QueC5pbnRlcnZhbCA9IGludGVydmFsRm9ybWF0Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0d1ZXNzZWQgaW50ZXJ2YWwnLCBzZWxmLnBsb3QueC5pbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ3Vlc3NJbnRlcnZhbCgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGkgPCBzZWxmLmNvbmZpZy54LmludGVydmFsVG9Gb3JtYXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBpbnRlcnZhbEZvcm1hdCA9IHNlbGYuY29uZmlnLnguaW50ZXJ2YWxUb0Zvcm1hdHNbaV07XHJcblxyXG4gICAgICAgICAgICBpZihpbnRlcnZhbEZvcm1hdC5mb3JtYXRzLmluZGV4T2Yoc2VsZi5wbG90LngudGltZUZvcm1hdCkgPj0gMCl7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QueC5pbnRlcnZhbCA9IGludGVydmFsRm9ybWF0Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnR3Vlc3NlZCBpbnRlcnZhbCcsIHNlbGYucGxvdC54LmludGVydmFsKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXRUaW1lUGFyc2VyKCkge1xyXG4gICAgICAgIGlmKCF0aGlzLnBsb3QueC50aW1lUGFyc2VyKXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LngudGltZVBhcnNlciA9IGQzLnRpbWUuZm9ybWF0KHRoaXMucGxvdC54LnRpbWVGb3JtYXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5wbG90LngudGltZVBhcnNlcjtcclxuICAgIH1cclxufVxyXG5cclxuIiwiaW1wb3J0IHtDaGFydCwgQ2hhcnRDb25maWd9IGZyb20gXCIuL2NoYXJ0XCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7TGVnZW5kfSBmcm9tICcuL2xlZ2VuZCdcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgSGVhdG1hcENvbmZpZyBleHRlbmRzIENoYXJ0Q29uZmlnIHtcclxuXHJcbiAgICBzdmdDbGFzcyA9ICdvZGMtaGVhdG1hcCc7XHJcbiAgICBzaG93VG9vbHRpcCA9IHRydWU7IC8vc2hvdyB0b29sdGlwIG9uIGRvdCBob3ZlclxyXG4gICAgdG9vbHRpcCA9IHtcclxuICAgICAgICBub0RhdGFUZXh0OiBcIk4vQVwiXHJcbiAgICB9O1xyXG4gICAgc2hvd0xlZ2VuZCA9IHRydWU7XHJcbiAgICBsZWdlbmQgPSB7XHJcbiAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgIHJvdGF0ZUxhYmVsczogZmFsc2UsXHJcbiAgICAgICAgZGVjaW1hbFBsYWNlczogdW5kZWZpbmVkLFxyXG4gICAgICAgIGZvcm1hdHRlcjogdiA9PiB0aGlzLmxlZ2VuZC5kZWNpbWFsUGxhY2VzID09PSB1bmRlZmluZWQgPyB2IDogTnVtYmVyKHYpLnRvRml4ZWQodGhpcy5sZWdlbmQuZGVjaW1hbFBsYWNlcylcclxuICAgIH1cclxuICAgIGhpZ2hsaWdodExhYmVscyA9IHRydWU7XHJcbiAgICB4ID0gey8vIFggYXhpcyBjb25maWdcclxuICAgICAgICB0aXRsZTogJycsIC8vIGF4aXMgdGl0bGVcclxuICAgICAgICBrZXk6IDAsXHJcbiAgICAgICAgdmFsdWU6IChkKSA9PiBkW3RoaXMueC5rZXldLCAvLyB4IHZhbHVlIGFjY2Vzc29yXHJcbiAgICAgICAgcm90YXRlTGFiZWxzOiB0cnVlLFxyXG4gICAgICAgIHNvcnRMYWJlbHM6IGZhbHNlLFxyXG4gICAgICAgIHNvcnRDb21wYXJhdG9yOiAoYSwgYik9PiBVdGlscy5pc051bWJlcihhKSA/IGEgLSBiIDogYS5sb2NhbGVDb21wYXJlKGIpLFxyXG4gICAgICAgIGdyb3Vwczoge1xyXG4gICAgICAgICAgICBrZXlzOiBbXSxcclxuICAgICAgICAgICAgbGFiZWxzOiBbXSxcclxuICAgICAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IGRba2V5XSxcclxuICAgICAgICAgICAgb3ZlcmxhcDoge1xyXG4gICAgICAgICAgICAgICAgdG9wOiAyMCxcclxuICAgICAgICAgICAgICAgIGJvdHRvbTogMjBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9ybWF0dGVyOiB1bmRlZmluZWQgLy8gdmFsdWUgZm9ybWF0dGVyIGZ1bmN0aW9uXHJcblxyXG4gICAgfTtcclxuICAgIHkgPSB7Ly8gWSBheGlzIGNvbmZpZ1xyXG4gICAgICAgIHRpdGxlOiAnJywgLy8gYXhpcyB0aXRsZSxcclxuICAgICAgICByb3RhdGVMYWJlbHM6IHRydWUsXHJcbiAgICAgICAga2V5OiAxLFxyXG4gICAgICAgIHZhbHVlOiAoZCkgPT4gZFt0aGlzLnkua2V5XSwgLy8geSB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgIHNvcnRMYWJlbHM6IGZhbHNlLFxyXG4gICAgICAgIHNvcnRDb21wYXJhdG9yOiAoYSwgYik9PiBVdGlscy5pc051bWJlcihiKSA/IGIgLSBhIDogYi5sb2NhbGVDb21wYXJlKGEpLFxyXG4gICAgICAgIGdyb3Vwczoge1xyXG4gICAgICAgICAgICBrZXlzOiBbXSxcclxuICAgICAgICAgICAgbGFiZWxzOiBbXSxcclxuICAgICAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IGRba2V5XSxcclxuICAgICAgICAgICAgb3ZlcmxhcDoge1xyXG4gICAgICAgICAgICAgICAgbGVmdDogMjAsXHJcbiAgICAgICAgICAgICAgICByaWdodDogMjBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9ybWF0dGVyOiB1bmRlZmluZWQvLyB2YWx1ZSBmb3JtYXR0ZXIgZnVuY3Rpb25cclxuICAgIH07XHJcbiAgICB6ID0ge1xyXG4gICAgICAgIGtleTogMixcclxuICAgICAgICB2YWx1ZTogKGQpID0+IGRbdGhpcy56LmtleV0sXHJcbiAgICAgICAgbm90QXZhaWxhYmxlVmFsdWU6ICh2KSA9PiB2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCxcclxuXHJcbiAgICAgICAgZGVjaW1hbFBsYWNlczogdW5kZWZpbmVkLFxyXG4gICAgICAgIGZvcm1hdHRlcjogdiA9PiB0aGlzLnouZGVjaW1hbFBsYWNlcyA9PT0gdW5kZWZpbmVkID8gdiA6IE51bWJlcih2KS50b0ZpeGVkKHRoaXMuei5kZWNpbWFsUGxhY2VzKS8vIHZhbHVlIGZvcm1hdHRlciBmdW5jdGlvblxyXG5cclxuICAgIH07XHJcbiAgICBjb2xvciA9IHtcclxuICAgICAgICBub0RhdGFDb2xvcjogXCJ3aGl0ZVwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiLFxyXG4gICAgICAgIHJldmVyc2VTY2FsZTogZmFsc2UsXHJcbiAgICAgICAgcmFuZ2U6IFtcImRhcmtibHVlXCIsIFwibGlnaHRza3libHVlXCIsIFwib3JhbmdlXCIsIFwiY3JpbXNvblwiLCBcImRhcmtyZWRcIl1cclxuICAgIH07XHJcbiAgICBjZWxsID0ge1xyXG4gICAgICAgIHdpZHRoOiB1bmRlZmluZWQsXHJcbiAgICAgICAgaGVpZ2h0OiB1bmRlZmluZWQsXHJcbiAgICAgICAgc2l6ZU1pbjogMTUsXHJcbiAgICAgICAgc2l6ZU1heDogMjUwLFxyXG4gICAgICAgIHBhZGRpbmc6IDBcclxuICAgIH07XHJcbiAgICBtYXJnaW4gPSB7XHJcbiAgICAgICAgbGVmdDogNjAsXHJcbiAgICAgICAgcmlnaHQ6IDUwLFxyXG4gICAgICAgIHRvcDogMzAsXHJcbiAgICAgICAgYm90dG9tOiA4MFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIGlmIChjdXN0b20pIHtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLy9UT0RPIHJlZmFjdG9yXHJcbmV4cG9ydCBjbGFzcyBIZWF0bWFwIGV4dGVuZHMgQ2hhcnQge1xyXG5cclxuICAgIHN0YXRpYyBtYXhHcm91cEdhcFNpemUgPSAyNDtcclxuICAgIHN0YXRpYyBncm91cFRpdGxlUmVjdEhlaWdodCA9IDY7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IEhlYXRtYXBDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZykge1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IEhlYXRtYXBDb25maWcoY29uZmlnKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSB0aGlzLmNvbmZpZy5tYXJnaW47XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnggPSB7fTtcclxuICAgICAgICB0aGlzLnBsb3QueSA9IHt9O1xyXG4gICAgICAgIHRoaXMucGxvdC56ID0ge1xyXG4gICAgICAgICAgICBtYXRyaXhlczogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBjZWxsczogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBjb2xvcjoge30sXHJcbiAgICAgICAgICAgIHNoYXBlOiB7fVxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICB0aGlzLnNldHVwVmFsdWVzKCk7XHJcbiAgICAgICAgdGhpcy5idWlsZENlbGxzKCk7XHJcblxyXG4gICAgICAgIHZhciB0aXRsZVJlY3RXaWR0aCA9IDY7XHJcbiAgICAgICAgdGhpcy5wbG90Lngub3ZlcmxhcCA9IHtcclxuICAgICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgICAgICBib3R0b206IDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICh0aGlzLnBsb3QuZ3JvdXBCeVgpIHtcclxuICAgICAgICAgICAgbGV0IGRlcHRoID0gc2VsZi5jb25maWcueC5ncm91cHMua2V5cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGxldCBhbGxUaXRsZXNXaWR0aCA9IGRlcHRoICogKHRpdGxlUmVjdFdpZHRoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucGxvdC54Lm92ZXJsYXAuYm90dG9tID0gc2VsZi5jb25maWcueC5ncm91cHMub3ZlcmxhcC5ib3R0b207XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC54Lm92ZXJsYXAudG9wID0gc2VsZi5jb25maWcueC5ncm91cHMub3ZlcmxhcC50b3AgKyBhbGxUaXRsZXNXaWR0aDtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lm1hcmdpbi50b3AgPSBjb25mLm1hcmdpbi5yaWdodCArIGNvbmYueC5ncm91cHMub3ZlcmxhcC50b3A7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5tYXJnaW4uYm90dG9tID0gY29uZi5tYXJnaW4uYm90dG9tICsgY29uZi54Lmdyb3Vwcy5vdmVybGFwLmJvdHRvbTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLnBsb3QueS5vdmVybGFwID0ge1xyXG4gICAgICAgICAgICBsZWZ0OiAwLFxyXG4gICAgICAgICAgICByaWdodDogMFxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICBpZiAodGhpcy5wbG90Lmdyb3VwQnlZKSB7XHJcbiAgICAgICAgICAgIGxldCBkZXB0aCA9IHNlbGYuY29uZmlnLnkuZ3JvdXBzLmtleXMubGVuZ3RoO1xyXG4gICAgICAgICAgICBsZXQgYWxsVGl0bGVzV2lkdGggPSBkZXB0aCAqICh0aXRsZVJlY3RXaWR0aCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC55Lm92ZXJsYXAucmlnaHQgPSBzZWxmLmNvbmZpZy55Lmdyb3Vwcy5vdmVybGFwLmxlZnQgKyBhbGxUaXRsZXNXaWR0aDtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lnkub3ZlcmxhcC5sZWZ0ID0gc2VsZi5jb25maWcueS5ncm91cHMub3ZlcmxhcC5sZWZ0O1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWFyZ2luLmxlZnQgPSBjb25mLm1hcmdpbi5sZWZ0ICsgdGhpcy5wbG90Lnkub3ZlcmxhcC5sZWZ0O1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWFyZ2luLnJpZ2h0ID0gY29uZi5tYXJnaW4ucmlnaHQgKyB0aGlzLnBsb3QueS5vdmVybGFwLnJpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBsb3Quc2hvd0xlZ2VuZCA9IGNvbmYuc2hvd0xlZ2VuZDtcclxuICAgICAgICBpZiAodGhpcy5wbG90LnNob3dMZWdlbmQpIHtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lm1hcmdpbi5yaWdodCArPSBjb25mLmxlZ2VuZC53aWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb21wdXRlUGxvdFNpemUoKTtcclxuICAgICAgICB0aGlzLnNldHVwWlNjYWxlKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwVmFsdWVzKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgY29uZmlnID0gc2VsZi5jb25maWc7XHJcbiAgICAgICAgdmFyIHggPSBzZWxmLnBsb3QueDtcclxuICAgICAgICB2YXIgeSA9IHNlbGYucGxvdC55O1xyXG4gICAgICAgIHZhciB6ID0gc2VsZi5wbG90Lno7XHJcblxyXG5cclxuICAgICAgICB4LnZhbHVlID0gZCA9PiBjb25maWcueC52YWx1ZS5jYWxsKGNvbmZpZywgZCk7XHJcbiAgICAgICAgeS52YWx1ZSA9IGQgPT4gY29uZmlnLnkudmFsdWUuY2FsbChjb25maWcsIGQpO1xyXG4gICAgICAgIHoudmFsdWUgPSBkID0+IGNvbmZpZy56LnZhbHVlLmNhbGwoY29uZmlnLCBkKTtcclxuXHJcbiAgICAgICAgeC51bmlxdWVWYWx1ZXMgPSBbXTtcclxuICAgICAgICB5LnVuaXF1ZVZhbHVlcyA9IFtdO1xyXG5cclxuXHJcbiAgICAgICAgc2VsZi5wbG90Lmdyb3VwQnlZID0gISFjb25maWcueS5ncm91cHMua2V5cy5sZW5ndGg7XHJcbiAgICAgICAgc2VsZi5wbG90Lmdyb3VwQnlYID0gISFjb25maWcueC5ncm91cHMua2V5cy5sZW5ndGg7XHJcblxyXG4gICAgICAgIHkuZ3JvdXBzID0ge1xyXG4gICAgICAgICAgICBrZXk6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgbGFiZWw6ICcnLFxyXG4gICAgICAgICAgICB2YWx1ZXM6IFtdLFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogbnVsbCxcclxuICAgICAgICAgICAgbGV2ZWw6IDAsXHJcbiAgICAgICAgICAgIGluZGV4OiAwLFxyXG4gICAgICAgICAgICBsYXN0SW5kZXg6IDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIHguZ3JvdXBzID0ge1xyXG4gICAgICAgICAgICBrZXk6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgbGFiZWw6ICcnLFxyXG4gICAgICAgICAgICB2YWx1ZXM6IFtdLFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogbnVsbCxcclxuICAgICAgICAgICAgbGV2ZWw6IDAsXHJcbiAgICAgICAgICAgIGluZGV4OiAwLFxyXG4gICAgICAgICAgICBsYXN0SW5kZXg6IDBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgdmFsdWVNYXAgPSB7fTtcclxuICAgICAgICB2YXIgbWluWiA9IHVuZGVmaW5lZDtcclxuICAgICAgICB2YXIgbWF4WiA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmRhdGEuZm9yRWFjaChkPT4ge1xyXG5cclxuICAgICAgICAgICAgdmFyIHhWYWwgPSB4LnZhbHVlKGQpO1xyXG4gICAgICAgICAgICB2YXIgeVZhbCA9IHkudmFsdWUoZCk7XHJcbiAgICAgICAgICAgIHZhciB6VmFsUmF3ID0gei52YWx1ZShkKTtcclxuICAgICAgICAgICAgdmFyIHpWYWwgPSBjb25maWcuei5ub3RBdmFpbGFibGVWYWx1ZSh6VmFsUmF3KSA/IHVuZGVmaW5lZCA6IHBhcnNlRmxvYXQoelZhbFJhdyk7XHJcblxyXG5cclxuICAgICAgICAgICAgaWYgKHgudW5pcXVlVmFsdWVzLmluZGV4T2YoeFZhbCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB4LnVuaXF1ZVZhbHVlcy5wdXNoKHhWYWwpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoeS51bmlxdWVWYWx1ZXMuaW5kZXhPZih5VmFsKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHkudW5pcXVlVmFsdWVzLnB1c2goeVZhbCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBncm91cFkgPSB5Lmdyb3VwcztcclxuICAgICAgICAgICAgaWYgKHNlbGYucGxvdC5ncm91cEJ5WSkge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXBZID0gdGhpcy51cGRhdGVHcm91cHMoZCwgeVZhbCwgeS5ncm91cHMsIGNvbmZpZy55Lmdyb3Vwcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGdyb3VwWCA9IHguZ3JvdXBzO1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5wbG90Lmdyb3VwQnlYKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZ3JvdXBYID0gdGhpcy51cGRhdGVHcm91cHMoZCwgeFZhbCwgeC5ncm91cHMsIGNvbmZpZy54Lmdyb3Vwcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghdmFsdWVNYXBbZ3JvdXBZLmluZGV4XSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWVNYXBbZ3JvdXBZLmluZGV4XSA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXZhbHVlTWFwW2dyb3VwWS5pbmRleF1bZ3JvdXBYLmluZGV4XSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWVNYXBbZ3JvdXBZLmluZGV4XVtncm91cFguaW5kZXhdID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF2YWx1ZU1hcFtncm91cFkuaW5kZXhdW2dyb3VwWC5pbmRleF1beVZhbF0pIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlTWFwW2dyb3VwWS5pbmRleF1bZ3JvdXBYLmluZGV4XVt5VmFsXSA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhbHVlTWFwW2dyb3VwWS5pbmRleF1bZ3JvdXBYLmluZGV4XVt5VmFsXVt4VmFsXSA9IHpWYWw7XHJcblxyXG5cclxuICAgICAgICAgICAgaWYgKG1pblogPT09IHVuZGVmaW5lZCB8fCB6VmFsIDwgbWluWikge1xyXG4gICAgICAgICAgICAgICAgbWluWiA9IHpWYWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG1heFogPT09IHVuZGVmaW5lZCB8fCB6VmFsID4gbWF4Wikge1xyXG4gICAgICAgICAgICAgICAgbWF4WiA9IHpWYWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBzZWxmLnBsb3QudmFsdWVNYXAgPSB2YWx1ZU1hcDtcclxuXHJcblxyXG4gICAgICAgIGlmICghc2VsZi5wbG90Lmdyb3VwQnlYKSB7XHJcbiAgICAgICAgICAgIHguZ3JvdXBzLnZhbHVlcyA9IHgudW5pcXVlVmFsdWVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFzZWxmLnBsb3QuZ3JvdXBCeVkpIHtcclxuICAgICAgICAgICAgeS5ncm91cHMudmFsdWVzID0geS51bmlxdWVWYWx1ZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldHVwVmFsdWVzQmVmb3JlR3JvdXBzU29ydCgpO1xyXG5cclxuICAgICAgICB4LmdhcHMgPSBbXTtcclxuICAgICAgICB4LnRvdGFsVmFsdWVzQ291bnQgPSAwO1xyXG4gICAgICAgIHguYWxsVmFsdWVzTGlzdCA9IFtdO1xyXG4gICAgICAgIHRoaXMuc29ydEdyb3Vwcyh4LCB4Lmdyb3VwcywgY29uZmlnLngpO1xyXG5cclxuICAgICAgICB5LmdhcHMgPSBbXTtcclxuICAgICAgICB5LnRvdGFsVmFsdWVzQ291bnQgPSAwO1xyXG4gICAgICAgIHkuYWxsVmFsdWVzTGlzdCA9IFtdO1xyXG4gICAgICAgIHRoaXMuc29ydEdyb3Vwcyh5LCB5Lmdyb3VwcywgY29uZmlnLnkpO1xyXG5cclxuICAgICAgICB6Lm1pbiA9IG1pblo7XHJcbiAgICAgICAgei5tYXggPSBtYXhaO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBzZXR1cFZhbHVlc0JlZm9yZUdyb3Vwc1NvcnQoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgYnVpbGRDZWxscygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHggPSBzZWxmLnBsb3QueDtcclxuICAgICAgICB2YXIgeSA9IHNlbGYucGxvdC55O1xyXG4gICAgICAgIHZhciB6ID0gc2VsZi5wbG90Lno7XHJcbiAgICAgICAgdmFyIHZhbHVlTWFwID0gc2VsZi5wbG90LnZhbHVlTWFwO1xyXG5cclxuICAgICAgICB2YXIgbWF0cml4Q2VsbHMgPSBzZWxmLnBsb3QuY2VsbHMgPSBbXTtcclxuICAgICAgICB2YXIgbWF0cml4ID0gc2VsZi5wbG90Lm1hdHJpeCA9IFtdO1xyXG5cclxuICAgICAgICB5LmFsbFZhbHVlc0xpc3QuZm9yRWFjaCgodjEsIGkpPT4ge1xyXG4gICAgICAgICAgICB2YXIgcm93ID0gW107XHJcbiAgICAgICAgICAgIG1hdHJpeC5wdXNoKHJvdyk7XHJcblxyXG4gICAgICAgICAgICB4LmFsbFZhbHVlc0xpc3QuZm9yRWFjaCgodjIsIGopID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB6VmFsID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB6VmFsID0gdmFsdWVNYXBbdjEuZ3JvdXAuaW5kZXhdW3YyLmdyb3VwLmluZGV4XVt2MS52YWxdW3YyLnZhbF1cclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY2VsbCA9IHtcclxuICAgICAgICAgICAgICAgICAgICByb3dWYXI6IHYxLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbFZhcjogdjIsXHJcbiAgICAgICAgICAgICAgICAgICAgcm93OiBpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbDogaixcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogelZhbFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJvdy5wdXNoKGNlbGwpO1xyXG5cclxuICAgICAgICAgICAgICAgIG1hdHJpeENlbGxzLnB1c2goY2VsbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVHcm91cHMoZCwgYXhpc1ZhbCwgcm9vdEdyb3VwLCBheGlzR3JvdXBzQ29uZmlnKSB7XHJcblxyXG4gICAgICAgIHZhciBjb25maWcgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICB2YXIgY3VycmVudEdyb3VwID0gcm9vdEdyb3VwO1xyXG4gICAgICAgIGF4aXNHcm91cHNDb25maWcua2V5cy5mb3JFYWNoKChncm91cEtleSwgZ3JvdXBLZXlJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBjdXJyZW50R3JvdXAua2V5ID0gZ3JvdXBLZXk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWN1cnJlbnRHcm91cC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLmNoaWxkcmVuID0ge307XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBncm91cGluZ1ZhbHVlID0gYXhpc0dyb3Vwc0NvbmZpZy52YWx1ZS5jYWxsKGNvbmZpZywgZCwgZ3JvdXBLZXkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFjdXJyZW50R3JvdXAuY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoZ3JvdXBpbmdWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHJvb3RHcm91cC5sYXN0SW5kZXgrKztcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC5jaGlsZHJlbltncm91cGluZ1ZhbHVlXSA9IHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwaW5nVmFsdWU6IGdyb3VwaW5nVmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbGV2ZWw6IGN1cnJlbnRHcm91cC5sZXZlbCArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IHJvb3RHcm91cC5sYXN0SW5kZXgsXHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiBncm91cEtleVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjdXJyZW50R3JvdXAgPSBjdXJyZW50R3JvdXAuY2hpbGRyZW5bZ3JvdXBpbmdWYWx1ZV07XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChjdXJyZW50R3JvdXAudmFsdWVzLmluZGV4T2YoYXhpc1ZhbCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRHcm91cC52YWx1ZXMucHVzaChheGlzVmFsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjdXJyZW50R3JvdXA7XHJcbiAgICB9XHJcblxyXG4gICAgc29ydEdyb3VwcyhheGlzLCBncm91cCwgYXhpc0NvbmZpZywgZ2Fwcykge1xyXG4gICAgICAgIGlmIChheGlzQ29uZmlnLmdyb3Vwcy5sYWJlbHMgJiYgYXhpc0NvbmZpZy5ncm91cHMubGFiZWxzLmxlbmd0aCA+IGdyb3VwLmxldmVsKSB7XHJcbiAgICAgICAgICAgIGdyb3VwLmxhYmVsID0gYXhpc0NvbmZpZy5ncm91cHMubGFiZWxzW2dyb3VwLmxldmVsXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBncm91cC5sYWJlbCA9IGdyb3VwLmtleTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZ2Fwcykge1xyXG4gICAgICAgICAgICBnYXBzID0gWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZ2Fwcy5sZW5ndGggPD0gZ3JvdXAubGV2ZWwpIHtcclxuICAgICAgICAgICAgZ2Fwcy5wdXNoKDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ3JvdXAuYWxsVmFsdWVzQ291bnQgPSBncm91cC5hbGxWYWx1ZXNDb3VudCB8fCAwO1xyXG4gICAgICAgIGdyb3VwLmFsbFZhbHVlc0JlZm9yZUNvdW50ID0gZ3JvdXAuYWxsVmFsdWVzQmVmb3JlQ291bnQgfHwgMDtcclxuXHJcbiAgICAgICAgZ3JvdXAuZ2FwcyA9IGdhcHMuc2xpY2UoKTtcclxuICAgICAgICBncm91cC5nYXBzQmVmb3JlID0gZ2Fwcy5zbGljZSgpO1xyXG5cclxuXHJcbiAgICAgICAgZ3JvdXAuZ2Fwc1NpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBzU2l6ZShncm91cC5nYXBzKTtcclxuICAgICAgICBncm91cC5nYXBzQmVmb3JlU2l6ZSA9IGdyb3VwLmdhcHNTaXplO1xyXG4gICAgICAgIGlmIChncm91cC52YWx1ZXMpIHtcclxuICAgICAgICAgICAgaWYgKGF4aXNDb25maWcuc29ydExhYmVscykge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXAudmFsdWVzLnNvcnQoYXhpc0NvbmZpZy5zb3J0Q29tcGFyYXRvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ3JvdXAudmFsdWVzLmZvckVhY2godj0+YXhpcy5hbGxWYWx1ZXNMaXN0LnB1c2goe3ZhbDogdiwgZ3JvdXA6IGdyb3VwfSkpO1xyXG4gICAgICAgICAgICBncm91cC5hbGxWYWx1ZXNCZWZvcmVDb3VudCA9IGF4aXMudG90YWxWYWx1ZXNDb3VudDtcclxuICAgICAgICAgICAgYXhpcy50b3RhbFZhbHVlc0NvdW50ICs9IGdyb3VwLnZhbHVlcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGdyb3VwLmFsbFZhbHVlc0NvdW50ICs9IGdyb3VwLnZhbHVlcy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBncm91cC5jaGlsZHJlbkxpc3QgPSBbXTtcclxuICAgICAgICBpZiAoZ3JvdXAuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgdmFyIGNoaWxkcmVuQ291bnQgPSAwO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgY2hpbGRQcm9wIGluIGdyb3VwLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXAuY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoY2hpbGRQcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IGdyb3VwLmNoaWxkcmVuW2NoaWxkUHJvcF07XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAuY2hpbGRyZW5MaXN0LnB1c2goY2hpbGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuQ291bnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3J0R3JvdXBzKGF4aXMsIGNoaWxkLCBheGlzQ29uZmlnLCBnYXBzKTtcclxuICAgICAgICAgICAgICAgICAgICBncm91cC5hbGxWYWx1ZXNDb3VudCArPSBjaGlsZC5hbGxWYWx1ZXNDb3VudDtcclxuICAgICAgICAgICAgICAgICAgICBnYXBzW2dyb3VwLmxldmVsXSArPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZ2FwcyAmJiBjaGlsZHJlbkNvdW50ID4gMSkge1xyXG4gICAgICAgICAgICAgICAgZ2Fwc1tncm91cC5sZXZlbF0gLT0gMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZ3JvdXAuZ2Fwc0luc2lkZSA9IFtdO1xyXG4gICAgICAgICAgICBnYXBzLmZvckVhY2goKGQsIGkpPT4ge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXAuZ2Fwc0luc2lkZS5wdXNoKGQgLSAoZ3JvdXAuZ2Fwc0JlZm9yZVtpXSB8fCAwKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBncm91cC5nYXBzSW5zaWRlU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcHNTaXplKGdyb3VwLmdhcHNJbnNpZGUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGF4aXMuZ2Fwcy5sZW5ndGggPCBnYXBzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgYXhpcy5nYXBzID0gZ2FwcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgY29tcHV0ZVlBeGlzTGFiZWxzV2lkdGgob2Zmc2V0KSB7XHJcbiAgICAgICAgdmFyIG1heFdpZHRoID0gdGhpcy5wbG90Lm1hcmdpbi5sZWZ0O1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy55LnRpdGxlKSB7XHJcbiAgICAgICAgICAgIG1heFdpZHRoIC09IDE1O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2Zmc2V0ICYmIG9mZnNldC54KSB7XHJcbiAgICAgICAgICAgIG1heFdpZHRoICs9IG9mZnNldC54O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnkucm90YXRlTGFiZWxzKSB7XHJcbiAgICAgICAgICAgIG1heFdpZHRoICo9IFV0aWxzLlNRUlRfMjtcclxuICAgICAgICAgICAgdmFyIGZvbnRTaXplID0gMTE7IC8vdG9kbyBjaGVjayBhY3R1YWwgZm9udCBzaXplXHJcbiAgICAgICAgICAgIG1heFdpZHRoIC09Zm9udFNpemUvMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBtYXhXaWR0aDtcclxuICAgIH1cclxuXHJcbiAgICBjb21wdXRlWEF4aXNMYWJlbHNXaWR0aChvZmZzZXQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLngucm90YXRlTGFiZWxzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBsb3QuY2VsbFdpZHRoIC0gMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHNpemUgPSB0aGlzLnBsb3QubWFyZ2luLmJvdHRvbTtcclxuICAgICAgICBpZiAodGhpcy5jb25maWcueC50aXRsZSkge1xyXG4gICAgICAgICAgICBzaXplIC09IDE1O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2Zmc2V0ICYmIG9mZnNldC55KSB7XHJcbiAgICAgICAgICAgIHNpemUgLT0gb2Zmc2V0Lnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzaXplICo9IFV0aWxzLlNRUlRfMjtcclxuXHJcbiAgICAgICAgdmFyIGZvbnRTaXplID0gMTE7IC8vdG9kbyBjaGVjayBhY3R1YWwgZm9udCBzaXplXHJcbiAgICAgICAgc2l6ZSAtPWZvbnRTaXplLzI7XHJcblxyXG4gICAgICAgIHJldHVybiBzaXplO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjb21wdXRlR2FwU2l6ZShnYXBMZXZlbCkge1xyXG4gICAgICAgIHJldHVybiBIZWF0bWFwLm1heEdyb3VwR2FwU2l6ZSAvIChnYXBMZXZlbCArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjb21wdXRlR2Fwc1NpemUoZ2Fwcykge1xyXG4gICAgICAgIHZhciBnYXBzU2l6ZSA9IDA7XHJcbiAgICAgICAgZ2Fwcy5mb3JFYWNoKChnYXBzTnVtYmVyLCBnYXBzTGV2ZWwpPT4gZ2Fwc1NpemUgKz0gZ2Fwc051bWJlciAqIEhlYXRtYXAuY29tcHV0ZUdhcFNpemUoZ2Fwc0xldmVsKSk7XHJcbiAgICAgICAgcmV0dXJuIGdhcHNTaXplO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXB1dGVQbG90U2l6ZSgpIHtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICB2YXIgbWFyZ2luID0gcGxvdC5tYXJnaW47XHJcbiAgICAgICAgdmFyIGF2YWlsYWJsZVdpZHRoID0gVXRpbHMuYXZhaWxhYmxlV2lkdGgodGhpcy5jb25maWcud2lkdGgsIHRoaXMuZ2V0QmFzZUNvbnRhaW5lcigpLCB0aGlzLnBsb3QubWFyZ2luKTtcclxuICAgICAgICB2YXIgYXZhaWxhYmxlSGVpZ2h0ID0gVXRpbHMuYXZhaWxhYmxlSGVpZ2h0KHRoaXMuY29uZmlnLmhlaWdodCwgdGhpcy5nZXRCYXNlQ29udGFpbmVyKCksIHRoaXMucGxvdC5tYXJnaW4pO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IGF2YWlsYWJsZVdpZHRoO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBhdmFpbGFibGVIZWlnaHQ7XHJcblxyXG4gICAgICAgIHZhciB4R2Fwc1NpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBzU2l6ZShwbG90LnguZ2Fwcyk7XHJcblxyXG5cclxuICAgICAgICB2YXIgY29tcHV0ZWRDZWxsV2lkdGggPSBNYXRoLm1heChjb25mLmNlbGwuc2l6ZU1pbiwgTWF0aC5taW4oY29uZi5jZWxsLnNpemVNYXgsIChhdmFpbGFibGVXaWR0aCAtIHhHYXBzU2l6ZSkgLyB0aGlzLnBsb3QueC50b3RhbFZhbHVlc0NvdW50KSk7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLndpZHRoKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY29uZmlnLmNlbGwud2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsV2lkdGggPSBjb21wdXRlZENlbGxXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuY2VsbFdpZHRoID0gdGhpcy5jb25maWcuY2VsbC53aWR0aDtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wbG90LmNlbGxXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxXaWR0aCA9IGNvbXB1dGVkQ2VsbFdpZHRoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICB3aWR0aCA9IHRoaXMucGxvdC5jZWxsV2lkdGggKiB0aGlzLnBsb3QueC50b3RhbFZhbHVlc0NvdW50ICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQgKyB4R2Fwc1NpemU7XHJcblxyXG4gICAgICAgIHZhciB5R2Fwc1NpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBzU2l6ZShwbG90LnkuZ2Fwcyk7XHJcbiAgICAgICAgdmFyIGNvbXB1dGVkQ2VsbEhlaWdodCA9IE1hdGgubWF4KGNvbmYuY2VsbC5zaXplTWluLCBNYXRoLm1pbihjb25mLmNlbGwuc2l6ZU1heCwgKGF2YWlsYWJsZUhlaWdodCAtIHlHYXBzU2l6ZSkgLyB0aGlzLnBsb3QueS50b3RhbFZhbHVlc0NvdW50KSk7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmhlaWdodCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY29uZmlnLmNlbGwuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuY2VsbEhlaWdodCA9IGNvbXB1dGVkQ2VsbEhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsSGVpZ2h0ID0gdGhpcy5jb25maWcuY2VsbC5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMucGxvdC5jZWxsSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuY2VsbEhlaWdodCA9IGNvbXB1dGVkQ2VsbEhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGhlaWdodCA9IHRoaXMucGxvdC5jZWxsSGVpZ2h0ICogdGhpcy5wbG90LnkudG90YWxWYWx1ZXNDb3VudCArIG1hcmdpbi50b3AgKyBtYXJnaW4uYm90dG9tICsgeUdhcHNTaXplO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5wbG90LndpZHRoID0gd2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodDtcclxuICAgICAgICB0aGlzLnBsb3QuaGVpZ2h0ID0gaGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNldHVwWlNjYWxlKCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGNvbmZpZyA9IHNlbGYuY29uZmlnO1xyXG4gICAgICAgIHZhciB6ID0gc2VsZi5wbG90Lno7XHJcbiAgICAgICAgdmFyIHJhbmdlID0gY29uZmlnLmNvbG9yLnJhbmdlO1xyXG4gICAgICAgIHZhciBleHRlbnQgPSB6Lm1heCAtIHoubWluO1xyXG4gICAgICAgIHZhciBzY2FsZTtcclxuICAgICAgICB6LmRvbWFpbiA9IFtdO1xyXG4gICAgICAgIGlmIChjb25maWcuY29sb3Iuc2NhbGUgPT0gXCJwb3dcIikge1xyXG4gICAgICAgICAgICB2YXIgZXhwb25lbnQgPSAxMDtcclxuICAgICAgICAgICAgcmFuZ2UuZm9yRWFjaCgoYywgaSk9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdiA9IHoubWF4IC0gKGV4dGVudCAvIE1hdGgucG93KDEwLCBpKSk7XHJcbiAgICAgICAgICAgICAgICB6LmRvbWFpbi5wdXNoKHYpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzY2FsZSA9IGQzLnNjYWxlLnBvdygpLmV4cG9uZW50KGV4cG9uZW50KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbmZpZy5jb2xvci5zY2FsZSA9PSBcImxvZ1wiKSB7XHJcblxyXG4gICAgICAgICAgICByYW5nZS5mb3JFYWNoKChjLCBpKT0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB2ID0gei5taW4gKyAoZXh0ZW50IC8gTWF0aC5wb3coMTAsIGkpKTtcclxuICAgICAgICAgICAgICAgIHouZG9tYWluLnVuc2hpZnQodilcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc2NhbGUgPSBkMy5zY2FsZS5sb2coKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJhbmdlLmZvckVhY2goKGMsIGkpPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHYgPSB6Lm1pbiArIChleHRlbnQgKiAoaSAvIChyYW5nZS5sZW5ndGggLSAxKSkpO1xyXG4gICAgICAgICAgICAgICAgei5kb21haW4ucHVzaCh2KVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc2NhbGUgPSBkMy5zY2FsZVtjb25maWcuY29sb3Iuc2NhbGVdKCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgei5kb21haW5bMF0gPSB6Lm1pbjsgLy9yZW1vdmluZyB1bm5lY2Vzc2FyeSBmbG9hdGluZyBwb2ludHNcclxuICAgICAgICB6LmRvbWFpblt6LmRvbWFpbi5sZW5ndGggLSAxXSA9IHoubWF4OyAvL3JlbW92aW5nIHVubmVjZXNzYXJ5IGZsb2F0aW5nIHBvaW50c1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHouZG9tYWluKTtcclxuXHJcbiAgICAgICAgaWYgKGNvbmZpZy5jb2xvci5yZXZlcnNlU2NhbGUpIHtcclxuICAgICAgICAgICAgei5kb21haW4ucmV2ZXJzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHJhbmdlKTtcclxuICAgICAgICBwbG90LnouY29sb3Iuc2NhbGUgPSBzY2FsZS5kb21haW4oei5kb21haW4pLnJhbmdlKHJhbmdlKTtcclxuICAgICAgICB2YXIgc2hhcGUgPSBwbG90Lnouc2hhcGUgPSB7fTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxDb25mID0gdGhpcy5jb25maWcuY2VsbDtcclxuICAgICAgICBzaGFwZS50eXBlID0gXCJyZWN0XCI7XHJcblxyXG4gICAgICAgIHBsb3Quei5zaGFwZS53aWR0aCA9IHBsb3QuY2VsbFdpZHRoIC0gY2VsbENvbmYucGFkZGluZyAqIDI7XHJcbiAgICAgICAgcGxvdC56LnNoYXBlLmhlaWdodCA9IHBsb3QuY2VsbEhlaWdodCAtIGNlbGxDb25mLnBhZGRpbmcgKiAyO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB1cGRhdGUobmV3RGF0YSkge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuICAgICAgICBpZiAodGhpcy5wbG90Lmdyb3VwQnlZKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0dyb3Vwc1kodGhpcy5wbG90LnkuZ3JvdXBzLCB0aGlzLnN2Z0cpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5wbG90Lmdyb3VwQnlYKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0dyb3Vwc1godGhpcy5wbG90LnguZ3JvdXBzLCB0aGlzLnN2Z0cpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVDZWxscygpO1xyXG5cclxuICAgICAgICAvLyB0aGlzLnVwZGF0ZVZhcmlhYmxlTGFiZWxzKCk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlQXhpc1goKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUF4aXNZKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5zaG93TGVnZW5kKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGVnZW5kKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUF4aXNUaXRsZXMoKTtcclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlQXhpc1RpdGxlcygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcblxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgdXBkYXRlQXhpc1goKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBsYWJlbENsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImxhYmVsXCIpO1xyXG4gICAgICAgIHZhciBsYWJlbFhDbGFzcyA9IGxhYmVsQ2xhc3MgKyBcIi14XCI7XHJcbiAgICAgICAgdmFyIGxhYmVsWUNsYXNzID0gbGFiZWxDbGFzcyArIFwiLXlcIjtcclxuICAgICAgICBwbG90LmxhYmVsQ2xhc3MgPSBsYWJlbENsYXNzO1xyXG5cclxuICAgICAgICB2YXIgb2Zmc2V0WCA9IHtcclxuICAgICAgICAgICAgeDogMCxcclxuICAgICAgICAgICAgeTogMFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGV0IGdhcFNpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBTaXplKDApO1xyXG4gICAgICAgIGlmIChwbG90Lmdyb3VwQnlYKSB7XHJcbiAgICAgICAgICAgIGxldCBvdmVybGFwID0gc2VsZi5jb25maWcueC5ncm91cHMub3ZlcmxhcDtcclxuXHJcbiAgICAgICAgICAgIG9mZnNldFgueCA9IGdhcFNpemUgLyAyO1xyXG4gICAgICAgICAgICBvZmZzZXRYLnkgPSBvdmVybGFwLmJvdHRvbSArIGdhcFNpemUgLyAyICsgNjtcclxuICAgICAgICB9IGVsc2UgaWYgKHBsb3QuZ3JvdXBCeVkpIHtcclxuICAgICAgICAgICAgb2Zmc2V0WC55ID0gZ2FwU2l6ZTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB2YXIgbGFiZWxzID0gc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyBsYWJlbFhDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGxvdC54LmFsbFZhbHVlc0xpc3QsIChkLCBpKT0+aSk7XHJcblxyXG4gICAgICAgIGxhYmVscy5lbnRlcigpLmFwcGVuZChcInRleHRcIikuYXR0cihcImNsYXNzXCIsIChkLCBpKSA9PiBsYWJlbENsYXNzICsgXCIgXCIgKyBsYWJlbFhDbGFzcyArIFwiIFwiICsgbGFiZWxYQ2xhc3MgKyBcIi1cIiArIGkpO1xyXG5cclxuICAgICAgICBsYWJlbHNcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIChkLCBpKSA9PiAoaSAqIHBsb3QuY2VsbFdpZHRoICsgcGxvdC5jZWxsV2lkdGggLyAyKSArIChkLmdyb3VwLmdhcHNTaXplKSArIG9mZnNldFgueClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIHBsb3QuaGVpZ2h0ICsgb2Zmc2V0WC55KVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIDEwKVxyXG5cclxuICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAudGV4dChkPT5zZWxmLmZvcm1hdFZhbHVlWChkLnZhbCkpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHZhciBtYXhXaWR0aCA9IHNlbGYuY29tcHV0ZVhBeGlzTGFiZWxzV2lkdGgob2Zmc2V0WCk7XHJcblxyXG4gICAgICAgIGxhYmVscy5lYWNoKGZ1bmN0aW9uIChsYWJlbCkge1xyXG4gICAgICAgICAgICB2YXIgZWxlbSA9IGQzLnNlbGVjdCh0aGlzKSxcclxuICAgICAgICAgICAgICAgIHRleHQgPSBzZWxmLmZvcm1hdFZhbHVlWChsYWJlbC52YWwpO1xyXG4gICAgICAgICAgICBVdGlscy5wbGFjZVRleHRXaXRoRWxsaXBzaXNBbmRUb29sdGlwKGVsZW0sIHRleHQsIG1heFdpZHRoLCBzZWxmLmNvbmZpZy5zaG93VG9vbHRpcCA/IHNlbGYucGxvdC50b29sdGlwIDogZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoc2VsZi5jb25maWcueC5yb3RhdGVMYWJlbHMpIHtcclxuICAgICAgICAgICAgbGFiZWxzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwicm90YXRlKC00NSwgXCIgKyAoKGkgKiBwbG90LmNlbGxXaWR0aCArIHBsb3QuY2VsbFdpZHRoIC8gMikgKyBkLmdyb3VwLmdhcHNTaXplICsgb2Zmc2V0WC54ICkgKyBcIiwgXCIgKyAoIHBsb3QuaGVpZ2h0ICsgb2Zmc2V0WC55KSArIFwiKVwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJkeFwiLCAtMilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgOClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgbGFiZWxzLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcblxyXG4gICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RPckFwcGVuZChcImcuXCIgKyBzZWxmLnByZWZpeENsYXNzKCdheGlzLXgnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAocGxvdC53aWR0aCAvIDIpICsgXCIsXCIgKyAocGxvdC5oZWlnaHQgKyBwbG90Lm1hcmdpbi5ib3R0b20pICsgXCIpXCIpXHJcbiAgICAgICAgICAgIC5zZWxlY3RPckFwcGVuZChcInRleHQuXCIgKyBzZWxmLnByZWZpeENsYXNzKCdsYWJlbCcpKVxyXG5cclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCBcIi0wLjVlbVwiKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAudGV4dChzZWxmLmNvbmZpZy54LnRpdGxlKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVBeGlzWSgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGxhYmVsQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwibGFiZWxcIik7XHJcbiAgICAgICAgdmFyIGxhYmVsWUNsYXNzID0gbGFiZWxDbGFzcyArIFwiLXlcIjtcclxuICAgICAgICBwbG90LmxhYmVsQ2xhc3MgPSBsYWJlbENsYXNzO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGxhYmVscyA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgbGFiZWxZQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBsb3QueS5hbGxWYWx1ZXNMaXN0KTtcclxuXHJcbiAgICAgICAgbGFiZWxzLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKTtcclxuXHJcbiAgICAgICAgdmFyIG9mZnNldFkgPSB7XHJcbiAgICAgICAgICAgIHg6IDAsXHJcbiAgICAgICAgICAgIHk6IDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmIChwbG90Lmdyb3VwQnlZKSB7XHJcbiAgICAgICAgICAgIGxldCBvdmVybGFwID0gc2VsZi5jb25maWcueS5ncm91cHMub3ZlcmxhcDtcclxuICAgICAgICAgICAgbGV0IGdhcFNpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBTaXplKDApO1xyXG4gICAgICAgICAgICBvZmZzZXRZLnggPSAtb3ZlcmxhcC5sZWZ0O1xyXG5cclxuICAgICAgICAgICAgb2Zmc2V0WS55ID0gZ2FwU2l6ZSAvIDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxhYmVsc1xyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgb2Zmc2V0WS54KVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgKGQsIGkpID0+IChpICogcGxvdC5jZWxsSGVpZ2h0ICsgcGxvdC5jZWxsSGVpZ2h0IC8gMikgKyBkLmdyb3VwLmdhcHNTaXplICsgb2Zmc2V0WS55KVxyXG4gICAgICAgICAgICAuYXR0cihcImR4XCIsIC0yKVxyXG4gICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgKGQsIGkpID0+IGxhYmVsQ2xhc3MgKyBcIiBcIiArIGxhYmVsWUNsYXNzICsgXCIgXCIgKyBsYWJlbFlDbGFzcyArIFwiLVwiICsgaSlcclxuXHJcbiAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZm9ybWF0dGVkID0gc2VsZi5mb3JtYXRWYWx1ZVkoZC52YWwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdHRlZFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIG1heFdpZHRoID0gc2VsZi5jb21wdXRlWUF4aXNMYWJlbHNXaWR0aChvZmZzZXRZKTtcclxuXHJcbiAgICAgICAgbGFiZWxzLmVhY2goZnVuY3Rpb24gKGxhYmVsKSB7XHJcbiAgICAgICAgICAgIHZhciBlbGVtID0gZDMuc2VsZWN0KHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgdGV4dCA9IHNlbGYuZm9ybWF0VmFsdWVZKGxhYmVsLnZhbCk7XHJcbiAgICAgICAgICAgIFV0aWxzLnBsYWNlVGV4dFdpdGhFbGxpcHNpc0FuZFRvb2x0aXAoZWxlbSwgdGV4dCwgbWF4V2lkdGgsIHNlbGYuY29uZmlnLnNob3dUb29sdGlwID8gc2VsZi5wbG90LnRvb2x0aXAgOiBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy55LnJvdGF0ZUxhYmVscykge1xyXG4gICAgICAgICAgICBsYWJlbHNcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInJvdGF0ZSgtNDUsIFwiICsgKG9mZnNldFkueCAgKSArIFwiLCBcIiArIChkLmdyb3VwLmdhcHNTaXplICsgKGkgKiBwbG90LmNlbGxIZWlnaHQgKyBwbG90LmNlbGxIZWlnaHQgLyAyKSArIG9mZnNldFkueSkgKyBcIilcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIik7XHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiZHhcIiwgLTcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxhYmVscy5hdHRyKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBsYWJlbHMuZXhpdCgpLnJlbW92ZSgpO1xyXG5cclxuXHJcbiAgICAgICAgc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIiArIHNlbGYucHJlZml4Q2xhc3MoJ2F4aXMteScpKVxyXG4gICAgICAgICAgICAuc2VsZWN0T3JBcHBlbmQoXCJ0ZXh0LlwiICsgc2VsZi5wcmVmaXhDbGFzcygnbGFiZWwnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAtcGxvdC5tYXJnaW4ubGVmdCArIFwiLFwiICsgKHBsb3QuaGVpZ2h0IC8gMikgKyBcIilyb3RhdGUoLTkwKVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KHNlbGYuY29uZmlnLnkudGl0bGUpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgZHJhd0dyb3Vwc1kocGFyZW50R3JvdXAsIGNvbnRhaW5lciwgYXZhaWxhYmxlV2lkdGgpIHtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG5cclxuICAgICAgICB2YXIgZ3JvdXBDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJncm91cFwiKTtcclxuICAgICAgICB2YXIgZ3JvdXBZQ2xhc3MgPSBncm91cENsYXNzICsgXCIteVwiO1xyXG4gICAgICAgIHZhciBncm91cHMgPSBjb250YWluZXIuc2VsZWN0QWxsKFwiZy5cIiArIGdyb3VwQ2xhc3MgKyBcIi5cIiArIGdyb3VwWUNsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShwYXJlbnRHcm91cC5jaGlsZHJlbkxpc3QpO1xyXG5cclxuICAgICAgICB2YXIgdmFsdWVzQmVmb3JlQ291bnQgPSAwO1xyXG4gICAgICAgIHZhciBnYXBzQmVmb3JlU2l6ZSA9IDA7XHJcblxyXG4gICAgICAgIHZhciBncm91cHNFbnRlckcgPSBncm91cHMuZW50ZXIoKS5hcHBlbmQoXCJnXCIpO1xyXG4gICAgICAgIGdyb3Vwc0VudGVyR1xyXG4gICAgICAgICAgICAuY2xhc3NlZChncm91cENsYXNzLCB0cnVlKVxyXG4gICAgICAgICAgICAuY2xhc3NlZChncm91cFlDbGFzcywgdHJ1ZSlcclxuICAgICAgICAgICAgLmFwcGVuZChcInJlY3RcIikuY2xhc3NlZChcImdyb3VwLXJlY3RcIiwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIHZhciB0aXRsZUdyb3VwRW50ZXIgPSBncm91cHNFbnRlckcuYXBwZW5kU2VsZWN0b3IoXCJnLnRpdGxlXCIpO1xyXG4gICAgICAgIHRpdGxlR3JvdXBFbnRlci5hcHBlbmQoXCJyZWN0XCIpO1xyXG4gICAgICAgIHRpdGxlR3JvdXBFbnRlci5hcHBlbmQoXCJ0ZXh0XCIpO1xyXG5cclxuICAgICAgICB2YXIgZ2FwU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcFNpemUocGFyZW50R3JvdXAubGV2ZWwpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gZ2FwU2l6ZSAvIDQ7XHJcblxyXG4gICAgICAgIHZhciB0aXRsZVJlY3RXaWR0aCA9IEhlYXRtYXAuZ3JvdXBUaXRsZVJlY3RIZWlnaHQ7XHJcbiAgICAgICAgdmFyIGRlcHRoID0gc2VsZi5jb25maWcueS5ncm91cHMua2V5cy5sZW5ndGggLSBwYXJlbnRHcm91cC5sZXZlbDtcclxuICAgICAgICB2YXIgb3ZlcmxhcCA9IHtcclxuICAgICAgICAgICAgbGVmdDogMCxcclxuICAgICAgICAgICAgcmlnaHQ6IDBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoIWF2YWlsYWJsZVdpZHRoKSB7XHJcbiAgICAgICAgICAgIG92ZXJsYXAucmlnaHQgPSBwbG90Lnkub3ZlcmxhcC5sZWZ0O1xyXG4gICAgICAgICAgICBvdmVybGFwLmxlZnQgPSBwbG90Lnkub3ZlcmxhcC5sZWZ0O1xyXG4gICAgICAgICAgICBhdmFpbGFibGVXaWR0aCA9IHBsb3Qud2lkdGggKyBnYXBTaXplICsgb3ZlcmxhcC5sZWZ0ICsgb3ZlcmxhcC5yaWdodDtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBncm91cHNcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB0cmFuc2xhdGUgPSBcInRyYW5zbGF0ZShcIiArIChwYWRkaW5nIC0gb3ZlcmxhcC5sZWZ0KSArIFwiLFwiICsgKChwbG90LmNlbGxIZWlnaHQgKiB2YWx1ZXNCZWZvcmVDb3VudCkgKyBpICogZ2FwU2l6ZSArIGdhcHNCZWZvcmVTaXplICsgcGFkZGluZykgKyBcIilcIjtcclxuICAgICAgICAgICAgICAgIGdhcHNCZWZvcmVTaXplICs9IChkLmdhcHNJbnNpZGVTaXplIHx8IDApO1xyXG4gICAgICAgICAgICAgICAgdmFsdWVzQmVmb3JlQ291bnQgKz0gZC5hbGxWYWx1ZXNDb3VudCB8fCAwO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYW5zbGF0ZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHZhciBncm91cFdpZHRoID0gYXZhaWxhYmxlV2lkdGggLSBwYWRkaW5nICogMjtcclxuXHJcbiAgICAgICAgdmFyIHRpdGxlR3JvdXBzID0gZ3JvdXBzLnNlbGVjdEFsbChcImcudGl0bGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwidHJhbnNsYXRlKFwiICsgKGdyb3VwV2lkdGggLSB0aXRsZVJlY3RXaWR0aCkgKyBcIiwgMClcIik7XHJcblxyXG4gICAgICAgIHZhciB0aWxlUmVjdHMgPSB0aXRsZUdyb3Vwcy5zZWxlY3RBbGwoXCJyZWN0XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgdGl0bGVSZWN0V2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGQ9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCkgKyBwbG90LmNlbGxIZWlnaHQgKiBkLmFsbFZhbHVlc0NvdW50ICsgcGFkZGluZyAqIDJcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAwKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcImZpbGxcIiwgXCJsaWdodGdyZXlcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0R3JvdXBNb3VzZUNhbGxiYWNrcyhwYXJlbnRHcm91cCwgdGlsZVJlY3RzKTtcclxuXHJcblxyXG4gICAgICAgIGdyb3Vwcy5zZWxlY3RBbGwoXCJyZWN0Lmdyb3VwLXJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBkPT4gXCJncm91cC1yZWN0IGdyb3VwLXJlY3QtXCIgKyBkLmluZGV4KVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGdyb3VwV2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGQ9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCkgKyBwbG90LmNlbGxIZWlnaHQgKiBkLmFsbFZhbHVlc0NvdW50ICsgcGFkZGluZyAqIDJcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgXCJ3aGl0ZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImZpbGwtb3BhY2l0eVwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCAwLjUpXHJcbiAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlXCIsIFwiYmxhY2tcIilcclxuXHJcblxyXG4gICAgICAgIGdyb3Vwcy5lYWNoKGZ1bmN0aW9uIChncm91cCkge1xyXG5cclxuICAgICAgICAgICAgc2VsZi5kcmF3R3JvdXBzWS5jYWxsKHNlbGYsIGdyb3VwLCBkMy5zZWxlY3QodGhpcyksIGdyb3VwV2lkdGggLSB0aXRsZVJlY3RXaWR0aCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGRyYXdHcm91cHNYKHBhcmVudEdyb3VwLCBjb250YWluZXIsIGF2YWlsYWJsZUhlaWdodCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcblxyXG4gICAgICAgIHZhciBncm91cENsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImdyb3VwXCIpO1xyXG4gICAgICAgIHZhciBncm91cFhDbGFzcyA9IGdyb3VwQ2xhc3MgKyBcIi14XCI7XHJcbiAgICAgICAgdmFyIGdyb3VwcyA9IGNvbnRhaW5lci5zZWxlY3RBbGwoXCJnLlwiICsgZ3JvdXBDbGFzcyArIFwiLlwiICsgZ3JvdXBYQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBhcmVudEdyb3VwLmNoaWxkcmVuTGlzdCk7XHJcblxyXG4gICAgICAgIHZhciB2YWx1ZXNCZWZvcmVDb3VudCA9IDA7XHJcbiAgICAgICAgdmFyIGdhcHNCZWZvcmVTaXplID0gMDtcclxuXHJcbiAgICAgICAgdmFyIGdyb3Vwc0VudGVyRyA9IGdyb3Vwcy5lbnRlcigpLmFwcGVuZChcImdcIik7XHJcbiAgICAgICAgZ3JvdXBzRW50ZXJHXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKGdyb3VwQ2xhc3MsIHRydWUpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKGdyb3VwWENsYXNzLCB0cnVlKVxyXG4gICAgICAgICAgICAuYXBwZW5kKFwicmVjdFwiKS5jbGFzc2VkKFwiZ3JvdXAtcmVjdFwiLCB0cnVlKTtcclxuXHJcbiAgICAgICAgdmFyIHRpdGxlR3JvdXBFbnRlciA9IGdyb3Vwc0VudGVyRy5hcHBlbmRTZWxlY3RvcihcImcudGl0bGVcIik7XHJcbiAgICAgICAgdGl0bGVHcm91cEVudGVyLmFwcGVuZChcInJlY3RcIik7XHJcbiAgICAgICAgdGl0bGVHcm91cEVudGVyLmFwcGVuZChcInRleHRcIik7XHJcblxyXG4gICAgICAgIHZhciBnYXBTaXplID0gSGVhdG1hcC5jb21wdXRlR2FwU2l6ZShwYXJlbnRHcm91cC5sZXZlbCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBnYXBTaXplIC8gNDtcclxuICAgICAgICB2YXIgdGl0bGVSZWN0SGVpZ2h0ID0gSGVhdG1hcC5ncm91cFRpdGxlUmVjdEhlaWdodDtcclxuXHJcbiAgICAgICAgdmFyIGRlcHRoID0gc2VsZi5jb25maWcueC5ncm91cHMua2V5cy5sZW5ndGggLSBwYXJlbnRHcm91cC5sZXZlbDtcclxuXHJcbiAgICAgICAgdmFyIG92ZXJsYXAgPSB7XHJcbiAgICAgICAgICAgIHRvcDogMCxcclxuICAgICAgICAgICAgYm90dG9tOiAwXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKCFhdmFpbGFibGVIZWlnaHQpIHtcclxuICAgICAgICAgICAgb3ZlcmxhcC5ib3R0b20gPSBwbG90Lngub3ZlcmxhcC5ib3R0b207XHJcbiAgICAgICAgICAgIG92ZXJsYXAudG9wID0gcGxvdC54Lm92ZXJsYXAudG9wO1xyXG4gICAgICAgICAgICBhdmFpbGFibGVIZWlnaHQgPSBwbG90LmhlaWdodCArIGdhcFNpemUgKyBvdmVybGFwLnRvcCArIG92ZXJsYXAuYm90dG9tO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvdmVybGFwLnRvcCA9IC10aXRsZVJlY3RIZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdwYXJlbnRHcm91cCcscGFyZW50R3JvdXAsICdnYXBTaXplJywgZ2FwU2l6ZSwgcGxvdC54Lm92ZXJsYXApO1xyXG5cclxuICAgICAgICBncm91cHNcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB0cmFuc2xhdGUgPSBcInRyYW5zbGF0ZShcIiArICgocGxvdC5jZWxsV2lkdGggKiB2YWx1ZXNCZWZvcmVDb3VudCkgKyBpICogZ2FwU2l6ZSArIGdhcHNCZWZvcmVTaXplICsgcGFkZGluZykgKyBcIiwgXCIgKyAocGFkZGluZyAtIG92ZXJsYXAudG9wKSArIFwiKVwiO1xyXG4gICAgICAgICAgICAgICAgZ2Fwc0JlZm9yZVNpemUgKz0gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCk7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZXNCZWZvcmVDb3VudCArPSBkLmFsbFZhbHVlc0NvdW50IHx8IDA7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhbnNsYXRlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgZ3JvdXBIZWlnaHQgPSBhdmFpbGFibGVIZWlnaHQgLSBwYWRkaW5nICogMjtcclxuXHJcbiAgICAgICAgdmFyIHRpdGxlR3JvdXBzID0gZ3JvdXBzLnNlbGVjdEFsbChcImcudGl0bGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwidHJhbnNsYXRlKDAsIFwiICsgKDApICsgXCIpXCIpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIHRpbGVSZWN0cyA9IHRpdGxlR3JvdXBzLnNlbGVjdEFsbChcInJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgdGl0bGVSZWN0SGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGQ9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCkgKyBwbG90LmNlbGxXaWR0aCAqIGQuYWxsVmFsdWVzQ291bnQgKyBwYWRkaW5nICogMlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIDApXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiZmlsbFwiLCBcImxpZ2h0Z3JleVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRHcm91cE1vdXNlQ2FsbGJhY2tzKHBhcmVudEdyb3VwLCB0aWxlUmVjdHMpO1xyXG5cclxuXHJcbiAgICAgICAgZ3JvdXBzLnNlbGVjdEFsbChcInJlY3QuZ3JvdXAtcmVjdFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGQ9PiBcImdyb3VwLXJlY3QgZ3JvdXAtcmVjdC1cIiArIGQuaW5kZXgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGdyb3VwSGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGQ9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCkgKyBwbG90LmNlbGxXaWR0aCAqIGQuYWxsVmFsdWVzQ291bnQgKyBwYWRkaW5nICogMlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCBcIndoaXRlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZmlsbC1vcGFjaXR5XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDAuNSlcclxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2VcIiwgXCJibGFja1wiKTtcclxuXHJcbiAgICAgICAgZ3JvdXBzLmVhY2goZnVuY3Rpb24gKGdyb3VwKSB7XHJcbiAgICAgICAgICAgIHNlbGYuZHJhd0dyb3Vwc1guY2FsbChzZWxmLCBncm91cCwgZDMuc2VsZWN0KHRoaXMpLCBncm91cEhlaWdodCAtIHRpdGxlUmVjdEhlaWdodCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGdyb3Vwcy5leGl0KCkucmVtb3ZlKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNldEdyb3VwTW91c2VDYWxsYmFja3MocGFyZW50R3JvdXAsIHRpbGVSZWN0cykge1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgbW91c2VvdmVyQ2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoJ2hpZ2hsaWdodGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzLnBhcmVudE5vZGUucGFyZW50Tm9kZSkuc2VsZWN0QWxsKFwicmVjdC5ncm91cC1yZWN0LVwiICsgZC5pbmRleCkuY2xhc3NlZCgnaGlnaGxpZ2h0ZWQnLCB0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIG1vdXNlb3V0Q2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgbW91c2VvdXRDYWxsYmFja3MucHVzaChmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICBkMy5zZWxlY3QodGhpcykuY2xhc3NlZCgnaGlnaGxpZ2h0ZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzLnBhcmVudE5vZGUucGFyZW50Tm9kZSkuc2VsZWN0QWxsKFwicmVjdC5ncm91cC1yZWN0LVwiICsgZC5pbmRleCkuY2xhc3NlZCgnaGlnaGxpZ2h0ZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHBsb3QudG9vbHRpcCkge1xyXG5cclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goZD0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBodG1sID0gcGFyZW50R3JvdXAubGFiZWwgKyBcIjogXCIgKyBkLmdyb3VwaW5nVmFsdWU7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNob3dUb29sdGlwKGh0bWwpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLnB1c2goZD0+IHtcclxuICAgICAgICAgICAgICAgIHNlbGYuaGlkZVRvb2x0aXAoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgdGlsZVJlY3RzLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKHNlbGYsIGQpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRpbGVSZWN0cy5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoc2VsZiwgZClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlQ2VsbHMoKSB7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgY2VsbENvbnRhaW5lckNsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImNlbGxzXCIpO1xyXG4gICAgICAgIHZhciBnYXBTaXplID0gSGVhdG1hcC5jb21wdXRlR2FwU2l6ZSgwKTtcclxuICAgICAgICB2YXIgcGFkZGluZ1ggPSBwbG90LnguZ3JvdXBzLmNoaWxkcmVuTGlzdC5sZW5ndGggPyBnYXBTaXplIC8gMiA6IDA7XHJcbiAgICAgICAgdmFyIHBhZGRpbmdZID0gcGxvdC55Lmdyb3Vwcy5jaGlsZHJlbkxpc3QubGVuZ3RoID8gZ2FwU2l6ZSAvIDIgOiAwO1xyXG4gICAgICAgIHZhciBjZWxsQ29udGFpbmVyID0gc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIiArIGNlbGxDb250YWluZXJDbGFzcyk7XHJcbiAgICAgICAgY2VsbENvbnRhaW5lci5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgcGFkZGluZ1ggKyBcIiwgXCIgKyBwYWRkaW5nWSArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJjZWxsXCIpO1xyXG4gICAgICAgIHZhciBjZWxsU2hhcGUgPSBwbG90Lnouc2hhcGUudHlwZTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxzID0gY2VsbENvbnRhaW5lci5zZWxlY3RBbGwoXCJnLlwiICsgY2VsbENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShzZWxmLnBsb3QuY2VsbHMpO1xyXG5cclxuICAgICAgICB2YXIgY2VsbEVudGVyRyA9IGNlbGxzLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuY2xhc3NlZChjZWxsQ2xhc3MsIHRydWUpO1xyXG4gICAgICAgIGNlbGxzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYz0+IFwidHJhbnNsYXRlKFwiICsgKChwbG90LmNlbGxXaWR0aCAqIGMuY29sICsgcGxvdC5jZWxsV2lkdGggLyAyKSArIGMuY29sVmFyLmdyb3VwLmdhcHNTaXplKSArIFwiLFwiICsgKChwbG90LmNlbGxIZWlnaHQgKiBjLnJvdyArIHBsb3QuY2VsbEhlaWdodCAvIDIpICsgYy5yb3dWYXIuZ3JvdXAuZ2Fwc1NpemUpICsgXCIpXCIpO1xyXG5cclxuICAgICAgICB2YXIgc2hhcGVzID0gY2VsbHMuc2VsZWN0T3JBcHBlbmQoY2VsbFNoYXBlICsgXCIuY2VsbC1zaGFwZS1cIiArIGNlbGxTaGFwZSk7XHJcblxyXG4gICAgICAgIHNoYXBlc1xyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHBsb3Quei5zaGFwZS53aWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgcGxvdC56LnNoYXBlLmhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIC1wbG90LmNlbGxXaWR0aCAvIDIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAtcGxvdC5jZWxsSGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICAgIHNoYXBlcy5zdHlsZShcImZpbGxcIiwgYz0+IGMudmFsdWUgPT09IHVuZGVmaW5lZCA/IHNlbGYuY29uZmlnLmNvbG9yLm5vRGF0YUNvbG9yIDogcGxvdC56LmNvbG9yLnNjYWxlKGMudmFsdWUpKTtcclxuICAgICAgICBzaGFwZXMuYXR0cihcImZpbGwtb3BhY2l0eVwiLCBkPT4gZC52YWx1ZSA9PT0gdW5kZWZpbmVkID8gMCA6IDEpO1xyXG5cclxuICAgICAgICB2YXIgbW91c2VvdmVyQ2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgdmFyIG1vdXNlb3V0Q2FsbGJhY2tzID0gW107XHJcblxyXG4gICAgICAgIGlmIChwbG90LnRvb2x0aXApIHtcclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3ZlckNhbGxiYWNrcy5wdXNoKGM9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IGMudmFsdWUgPT09IHVuZGVmaW5lZCA/IHNlbGYuY29uZmlnLnRvb2x0aXAubm9EYXRhVGV4dCA6IHNlbGYuZm9ybWF0VmFsdWVaKGMudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zaG93VG9vbHRpcChodG1sKTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MucHVzaChjPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5oaWRlVG9vbHRpcCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy5oaWdobGlnaHRMYWJlbHMpIHtcclxuICAgICAgICAgICAgdmFyIGhpZ2hsaWdodENsYXNzID0gc2VsZi5jb25maWcuY3NzQ2xhc3NQcmVmaXggKyBcImhpZ2hsaWdodFwiO1xyXG4gICAgICAgICAgICB2YXIgeExhYmVsQ2xhc3MgPSBjPT5wbG90LmxhYmVsQ2xhc3MgKyBcIi14LVwiICsgYy5jb2w7XHJcbiAgICAgICAgICAgIHZhciB5TGFiZWxDbGFzcyA9IGM9PnBsb3QubGFiZWxDbGFzcyArIFwiLXktXCIgKyBjLnJvdztcclxuXHJcblxyXG4gICAgICAgICAgICBtb3VzZW92ZXJDYWxsYmFja3MucHVzaChjPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgeExhYmVsQ2xhc3MoYykpLmNsYXNzZWQoaGlnaGxpZ2h0Q2xhc3MsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB5TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBtb3VzZW91dENhbGxiYWNrcy5wdXNoKGM9PiB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHhMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHlMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGNlbGxzLm9uKFwibW91c2VvdmVyXCIsIGMgPT4ge1xyXG4gICAgICAgICAgICBtb3VzZW92ZXJDYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjaz0+Y2FsbGJhY2soYykpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGMgPT4ge1xyXG4gICAgICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjaz0+Y2FsbGJhY2soYykpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY2VsbHMub24oXCJjbGlja1wiLCBjPT4ge1xyXG4gICAgICAgICAgICBzZWxmLnRyaWdnZXIoXCJjZWxsLXNlbGVjdGVkXCIsIGMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgY2VsbHMuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcm1hdFZhbHVlWCh2YWx1ZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcueC5mb3JtYXR0ZXIpIHJldHVybiB2YWx1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnguZm9ybWF0dGVyLmNhbGwodGhpcy5jb25maWcsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3JtYXRWYWx1ZVkodmFsdWUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLnkuZm9ybWF0dGVyKSByZXR1cm4gdmFsdWU7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy55LmZvcm1hdHRlci5jYWxsKHRoaXMuY29uZmlnLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9ybWF0VmFsdWVaKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy56LmZvcm1hdHRlcikgcmV0dXJuIHZhbHVlO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuei5mb3JtYXR0ZXIuY2FsbCh0aGlzLmNvbmZpZywgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcm1hdExlZ2VuZFZhbHVlKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5sZWdlbmQuZm9ybWF0dGVyKSByZXR1cm4gdmFsdWU7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5sZWdlbmQuZm9ybWF0dGVyLmNhbGwodGhpcy5jb25maWcsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVMZWdlbmQoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciBsZWdlbmRYID0gdGhpcy5wbG90LndpZHRoICsgMTA7XHJcbiAgICAgICAgdmFyIGdhcFNpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBTaXplKDApO1xyXG4gICAgICAgIGlmICh0aGlzLnBsb3QuZ3JvdXBCeVkpIHtcclxuICAgICAgICAgICAgbGVnZW5kWCArPSBnYXBTaXplIC8gMiArIHBsb3QueS5vdmVybGFwLnJpZ2h0O1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wbG90Lmdyb3VwQnlYKSB7XHJcbiAgICAgICAgICAgIGxlZ2VuZFggKz0gZ2FwU2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGxlZ2VuZFkgPSAwO1xyXG4gICAgICAgIGlmICh0aGlzLnBsb3QuZ3JvdXBCeVggfHwgdGhpcy5wbG90Lmdyb3VwQnlZKSB7XHJcbiAgICAgICAgICAgIGxlZ2VuZFkgKz0gZ2FwU2l6ZSAvIDI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgYmFyV2lkdGggPSAxMDtcclxuICAgICAgICB2YXIgYmFySGVpZ2h0ID0gdGhpcy5wbG90LmhlaWdodCAtIDI7XHJcbiAgICAgICAgdmFyIHNjYWxlID0gcGxvdC56LmNvbG9yLnNjYWxlO1xyXG5cclxuICAgICAgICBwbG90LmxlZ2VuZCA9IG5ldyBMZWdlbmQodGhpcy5zdmcsIHRoaXMuc3ZnRywgc2NhbGUsIGxlZ2VuZFgsIGxlZ2VuZFksIHYgPT4gc2VsZi5mb3JtYXRMZWdlbmRWYWx1ZSh2KSkuc2V0Um90YXRlTGFiZWxzKHNlbGYuY29uZmlnLmxlZ2VuZC5yb3RhdGVMYWJlbHMpLmxpbmVhckdyYWRpZW50QmFyKGJhcldpZHRoLCBiYXJIZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuIiwiaW1wb3J0IHtDaGFydFdpdGhDb2xvckdyb3VwcywgQ2hhcnRXaXRoQ29sb3JHcm91cHNDb25maWd9IGZyb20gXCIuL2NoYXJ0LXdpdGgtY29sb3ItZ3JvdXBzXCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcblxyXG5leHBvcnQgY2xhc3MgSGlzdG9ncmFtQ29uZmlnIGV4dGVuZHMgQ2hhcnRXaXRoQ29sb3JHcm91cHNDb25maWd7XHJcblxyXG4gICAgc3ZnQ2xhc3M9IHRoaXMuY3NzQ2xhc3NQcmVmaXgrJ2hpc3RvZ3JhbSc7XHJcbiAgICBzaG93TGVnZW5kPXRydWU7XHJcbiAgICBzaG93VG9vbHRpcCA9dHJ1ZTtcclxuICAgIHg9ey8vIFggYXhpcyBjb25maWdcclxuICAgICAgICBsYWJlbDogJycsIC8vIGF4aXMgbGFiZWxcclxuICAgICAgICBrZXk6IDAsXHJcbiAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IFV0aWxzLmlzTnVtYmVyKGQpID8gZCA6IHBhcnNlRmxvYXQoZFtrZXldKSwgLy8geCB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiLFxyXG4gICAgICAgIHRpY2tzOiB1bmRlZmluZWQsXHJcbiAgICB9O1xyXG4gICAgeT17Ly8gWSBheGlzIGNvbmZpZ1xyXG4gICAgICAgIGxhYmVsOiAnJywgLy8gYXhpcyBsYWJlbCxcclxuICAgICAgICBvcmllbnQ6IFwibGVmdFwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiXHJcbiAgICB9O1xyXG4gICAgZnJlcXVlbmN5PXRydWU7XHJcbiAgICBncm91cHM9e1xyXG4gICAgICAgIGtleTogMVxyXG4gICAgfTtcclxuICAgIHRyYW5zaXRpb249IHRydWU7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKXtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICBpZihjdXN0b20pe1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEhpc3RvZ3JhbSBleHRlbmRzIENoYXJ0V2l0aENvbG9yR3JvdXBze1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IEhpc3RvZ3JhbUNvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKXtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBIaXN0b2dyYW1Db25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKXtcclxuICAgICAgICBzdXBlci5pbml0UGxvdCgpO1xyXG4gICAgICAgIHZhciBzZWxmPXRoaXM7XHJcblxyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC54PXt9O1xyXG4gICAgICAgIHRoaXMucGxvdC55PXt9O1xyXG4gICAgICAgIHRoaXMucGxvdC5iYXI9e1xyXG4gICAgICAgICAgICBjb2xvcjogbnVsbC8vY29sb3Igc2NhbGUgbWFwcGluZyBmdW5jdGlvblxyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jb21wdXRlUGxvdFNpemUoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnNldHVwWCgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBIaXN0b2dyYW0oKTtcclxuICAgICAgICB0aGlzLnNldHVwR3JvdXBTdGFja3MoKTtcclxuICAgICAgICB0aGlzLnNldHVwWSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwWCgpe1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeCA9IHBsb3QueDtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnLng7XHJcblxyXG4gICAgICAgIC8qICpcclxuICAgICAgICAgKiB2YWx1ZSBhY2Nlc3NvciAtIHJldHVybnMgdGhlIHZhbHVlIHRvIGVuY29kZSBmb3IgYSBnaXZlbiBkYXRhIG9iamVjdC5cclxuICAgICAgICAgKiBzY2FsZSAtIG1hcHMgdmFsdWUgdG8gYSB2aXN1YWwgZGlzcGxheSBlbmNvZGluZywgc3VjaCBhcyBhIHBpeGVsIHBvc2l0aW9uLlxyXG4gICAgICAgICAqIG1hcCBmdW5jdGlvbiAtIG1hcHMgZnJvbSBkYXRhIHZhbHVlIHRvIGRpc3BsYXkgdmFsdWVcclxuICAgICAgICAgKiBheGlzIC0gc2V0cyB1cCBheGlzXHJcbiAgICAgICAgICoqL1xyXG4gICAgICAgIHgudmFsdWUgPSBkID0+IGNvbmYudmFsdWUoZCwgY29uZi5rZXkpO1xyXG4gICAgICAgIHguc2NhbGUgPSBkMy5zY2FsZVtjb25mLnNjYWxlXSgpLnJhbmdlKFswLCBwbG90LndpZHRoXSk7XHJcbiAgICAgICAgeC5tYXAgPSBkID0+IHguc2NhbGUoeC52YWx1ZShkKSk7XHJcblxyXG4gICAgICAgIHguYXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeC5zY2FsZSkub3JpZW50KGNvbmYub3JpZW50KTtcclxuICAgICAgICBpZihjb25mLnRpY2tzKXtcclxuICAgICAgICAgICAgeC5heGlzLnRpY2tzKGNvbmYudGlja3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMucGxvdC5ncm91cGVkRGF0YTtcclxuICAgICAgICBwbG90Lnguc2NhbGUuZG9tYWluKFtkMy5taW4oZGF0YSwgcz0+ZDMubWluKHMudmFsdWVzLCBwbG90LngudmFsdWUpKSwgZDMubWF4KGRhdGEsIHM9PmQzLm1heChzLnZhbHVlcywgcGxvdC54LnZhbHVlKSldKTtcclxuICAgICAgICBcclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBZICgpe1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeSA9IHBsb3QueTtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnLnk7XHJcbiAgICAgICAgeS5zY2FsZSA9IGQzLnNjYWxlW2NvbmYuc2NhbGVdKCkucmFuZ2UoW3Bsb3QuaGVpZ2h0LCAwXSk7XHJcblxyXG4gICAgICAgIHkuYXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeS5zY2FsZSkub3JpZW50KGNvbmYub3JpZW50KTtcclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMucGxvdC5kYXRhO1xyXG4gICAgICAgIHZhciB5U3RhY2tNYXggPSBkMy5tYXgocGxvdC5zdGFja2VkSGlzdG9ncmFtcywgbGF5ZXIgPT4gZDMubWF4KGxheWVyLmhpc3RvZ3JhbUJpbnMsIGQgPT4gZC55MCArIGQueSkpO1xyXG4gICAgICAgIHBsb3QueS5zY2FsZS5kb21haW4oWzAsIHlTdGFja01heF0pO1xyXG5cclxuICAgIH07XHJcblxyXG5cclxuICAgIHNldHVwSGlzdG9ncmFtKCkge1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB4ID0gcGxvdC54O1xyXG4gICAgICAgIHZhciB5ID0gcGxvdC55O1xyXG4gICAgICAgIHZhciB0aWNrcyA9IHRoaXMuY29uZmlnLngudGlja3MgPyB4LnNjYWxlLnRpY2tzKHRoaXMuY29uZmlnLngudGlja3MpIDogeC5zY2FsZS50aWNrcygpO1xyXG5cclxuICAgICAgICBwbG90Lmhpc3RvZ3JhbSA9IGQzLmxheW91dC5oaXN0b2dyYW0oKS5mcmVxdWVuY3kodGhpcy5jb25maWcuZnJlcXVlbmN5KVxyXG4gICAgICAgICAgICAudmFsdWUoeC52YWx1ZSlcclxuICAgICAgICAgICAgLmJpbnModGlja3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwR3JvdXBTdGFja3MoKSB7XHJcbiAgICAgICAgdmFyIHNlbGY9dGhpcztcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnBsb3QuZ3JvdXBlZERhdGEpO1xyXG4gICAgICAgIHRoaXMucGxvdC5zdGFjayA9IGQzLmxheW91dC5zdGFjaygpLnZhbHVlcyhkPT5kLmhpc3RvZ3JhbUJpbnMpO1xyXG4gICAgICAgIHRoaXMucGxvdC5ncm91cGVkRGF0YS5mb3JFYWNoKGQ9PntcclxuICAgICAgICAgICAgZC5oaXN0b2dyYW1CaW5zID0gdGhpcy5wbG90Lmhpc3RvZ3JhbS5mcmVxdWVuY3kodGhpcy5jb25maWcuZnJlcXVlbmN5IHx8IHRoaXMucGxvdC5ncm91cGluZ0VuYWJsZWQpKGQudmFsdWVzKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZC5oaXN0b2dyYW1CaW5zKTtcclxuICAgICAgICAgICAgaWYoIXRoaXMuY29uZmlnLmZyZXF1ZW5jeSAmJiB0aGlzLnBsb3QuZ3JvdXBpbmdFbmFibGVkKXtcclxuICAgICAgICAgICAgICAgIGQuaGlzdG9ncmFtQmlucy5mb3JFYWNoKGIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGIuZHkgPSBiLmR5L3RoaXMucGxvdC5kYXRhTGVuZ3RoXHJcbiAgICAgICAgICAgICAgICAgICAgYi55ID0gYi55L3RoaXMucGxvdC5kYXRhTGVuZ3RoXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucGxvdC5zdGFja2VkSGlzdG9ncmFtcyA9IHRoaXMucGxvdC5zdGFjayh0aGlzLnBsb3QuZ3JvdXBlZERhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXdBeGlzWCgpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgYXhpc0NvbmYgPSB0aGlzLmNvbmZpZy54O1xyXG4gICAgICAgIHZhciBheGlzID0gc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIitzZWxmLnByZWZpeENsYXNzKCdheGlzLXgnKStcIi5cIitzZWxmLnByZWZpeENsYXNzKCdheGlzJykrKHNlbGYuY29uZmlnLmd1aWRlcyA/ICcnIDogJy4nK3NlbGYucHJlZml4Q2xhc3MoJ25vLWd1aWRlcycpKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIHBsb3QuaGVpZ2h0ICsgXCIpXCIpO1xyXG5cclxuICAgICAgICB2YXIgYXhpc1QgPSBheGlzO1xyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy50cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGF4aXNUID0gYXhpcy50cmFuc2l0aW9uKCkuZWFzZShcInNpbi1pbi1vdXRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBheGlzVC5jYWxsKHBsb3QueC5heGlzKTtcclxuXHJcbiAgICAgICAgYXhpcy5zZWxlY3RPckFwcGVuZChcInRleHQuXCIrc2VsZi5wcmVmaXhDbGFzcygnbGFiZWwnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrIChwbG90LndpZHRoLzIpICtcIixcIisgKHBsb3QubWFyZ2luLmJvdHRvbSkgK1wiKVwiKSAgLy8gdGV4dCBpcyBkcmF3biBvZmYgdGhlIHNjcmVlbiB0b3AgbGVmdCwgbW92ZSBkb3duIGFuZCBvdXQgYW5kIHJvdGF0ZVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiLTFlbVwiKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAudGV4dChheGlzQ29uZi5sYWJlbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRyYXdBeGlzWSgpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgYXhpc0NvbmYgPSB0aGlzLmNvbmZpZy55O1xyXG4gICAgICAgIHZhciBheGlzID0gc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIitzZWxmLnByZWZpeENsYXNzKCdheGlzLXknKStcIi5cIitzZWxmLnByZWZpeENsYXNzKCdheGlzJykrKHNlbGYuY29uZmlnLmd1aWRlcyA/ICcnIDogJy4nK3NlbGYucHJlZml4Q2xhc3MoJ25vLWd1aWRlcycpKSk7XHJcblxyXG4gICAgICAgIHZhciBheGlzVCA9IGF4aXM7XHJcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLnRyYW5zaXRpb24pIHtcclxuICAgICAgICAgICAgYXhpc1QgPSBheGlzLnRyYW5zaXRpb24oKS5lYXNlKFwic2luLWluLW91dFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGF4aXNULmNhbGwocGxvdC55LmF4aXMpO1xyXG5cclxuICAgICAgICBheGlzLnNlbGVjdE9yQXBwZW5kKFwidGV4dC5cIitzZWxmLnByZWZpeENsYXNzKCdsYWJlbCcpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisgLXBsb3QubWFyZ2luLmxlZnQgK1wiLFwiKyhwbG90LmhlaWdodC8yKStcIilyb3RhdGUoLTkwKVwiKSAgLy8gdGV4dCBpcyBkcmF3biBvZmYgdGhlIHNjcmVlbiB0b3AgbGVmdCwgbW92ZSBkb3duIGFuZCBvdXQgYW5kIHJvdGF0ZVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGF4aXNDb25mLmxhYmVsKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIGRyYXdIaXN0b2dyYW0oKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBsYXllckNsYXNzID0gdGhpcy5wcmVmaXhDbGFzcyhcImxheWVyXCIpO1xyXG5cclxuICAgICAgICB2YXIgYmFyQ2xhc3MgPSB0aGlzLnByZWZpeENsYXNzKFwiYmFyXCIpO1xyXG4gICAgICAgIHZhciBsYXllciA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCIuXCIrbGF5ZXJDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGxvdC5zdGFja2VkSGlzdG9ncmFtcyk7XHJcblxyXG4gICAgICAgIGxheWVyLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGxheWVyQ2xhc3MpO1xyXG5cclxuICAgICAgICB2YXIgYmFyID0gbGF5ZXIuc2VsZWN0QWxsKFwiLlwiK2JhckNsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShkID0+IGQuaGlzdG9ncmFtQmlucyk7XHJcblxyXG4gICAgICAgIGJhci5lbnRlcigpLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBiYXJDbGFzcylcclxuICAgICAgICAgICAgLmFwcGVuZChcInJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDEpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGJhclJlY3QgPSBiYXIuc2VsZWN0KFwicmVjdFwiKTtcclxuXHJcbiAgICAgICAgdmFyIGJhclJlY3RUID0gYmFyUmVjdDtcclxuICAgICAgICB2YXIgYmFyVCA9IGJhcjtcclxuICAgICAgICB2YXIgbGF5ZXJUID0gbGF5ZXI7XHJcbiAgICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbkVuYWJsZWQoKSkge1xyXG4gICAgICAgICAgICBiYXJSZWN0VCA9IGJhclJlY3QudHJhbnNpdGlvbigpO1xyXG4gICAgICAgICAgICBiYXJUID0gYmFyLnRyYW5zaXRpb24oKTtcclxuICAgICAgICAgICAgbGF5ZXJUPSBsYXllci50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBiYXJULmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBwbG90Lnguc2NhbGUoZC54KSArIFwiLFwiICsgKHBsb3QueS5zY2FsZShkLnkwICtkLnkpKSArIFwiKVwiOyB9KTtcclxuXHJcbiAgICAgICAgdmFyIGR4ID0gcGxvdC5zdGFja2VkSGlzdG9ncmFtcy5sZW5ndGggPyAocGxvdC5zdGFja2VkSGlzdG9ncmFtc1swXS5oaXN0b2dyYW1CaW5zLmxlbmd0aCA/ICBwbG90Lnguc2NhbGUocGxvdC5zdGFja2VkSGlzdG9ncmFtc1swXS5oaXN0b2dyYW1CaW5zWzBdLmR4KSA6IDApIDogMDtcclxuICAgICAgICBiYXJSZWN0VFxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsICBkeCAtIHBsb3QueC5zY2FsZSgwKS0gMSlcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZCA9PiAgIHBsb3QuaGVpZ2h0IC0gcGxvdC55LnNjYWxlKGQueSkpO1xyXG5cclxuICAgICAgICBpZih0aGlzLnBsb3QuY29sb3Ipe1xyXG4gICAgICAgICAgICBsYXllclRcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCB0aGlzLnBsb3Quc2VyaWVzQ29sb3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBsb3QudG9vbHRpcCkge1xyXG4gICAgICAgICAgICBiYXIub24oXCJtb3VzZW92ZXJcIiwgZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNob3dUb29sdGlwKGQueSk7XHJcbiAgICAgICAgICAgIH0pLm9uKFwibW91c2VvdXRcIiwgZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmhpZGVUb29sdGlwKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsYXllci5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICAgICAgYmFyLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUobmV3RGF0YSl7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKG5ld0RhdGEpO1xyXG4gICAgICAgIHRoaXMuZHJhd0F4aXNYKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3QXhpc1koKTtcclxuXHJcbiAgICAgICAgdGhpcy5kcmF3SGlzdG9ncmFtKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG59XHJcbiIsImltcG9ydCB7RDNFeHRlbnNpb25zfSBmcm9tICcuL2QzLWV4dGVuc2lvbnMnXHJcbkQzRXh0ZW5zaW9ucy5leHRlbmQoKTtcclxuXHJcbmV4cG9ydCB7U2NhdHRlclBsb3QsIFNjYXR0ZXJQbG90Q29uZmlnfSBmcm9tIFwiLi9zY2F0dGVycGxvdFwiO1xyXG5leHBvcnQge1NjYXR0ZXJQbG90TWF0cml4LCBTY2F0dGVyUGxvdE1hdHJpeENvbmZpZ30gZnJvbSBcIi4vc2NhdHRlcnBsb3QtbWF0cml4XCI7XHJcbmV4cG9ydCB7Q29ycmVsYXRpb25NYXRyaXgsIENvcnJlbGF0aW9uTWF0cml4Q29uZmlnfSBmcm9tICcuL2NvcnJlbGF0aW9uLW1hdHJpeCdcclxuZXhwb3J0IHtSZWdyZXNzaW9uLCBSZWdyZXNzaW9uQ29uZmlnfSBmcm9tICcuL3JlZ3Jlc3Npb24nXHJcbmV4cG9ydCB7SGVhdG1hcCwgSGVhdG1hcENvbmZpZ30gZnJvbSAnLi9oZWF0bWFwJ1xyXG5leHBvcnQge0hlYXRtYXBUaW1lU2VyaWVzLCBIZWF0bWFwVGltZVNlcmllc0NvbmZpZ30gZnJvbSAnLi9oZWF0bWFwLXRpbWVzZXJpZXMnXHJcbmV4cG9ydCB7SGlzdG9ncmFtLCBIaXN0b2dyYW1Db25maWd9IGZyb20gJy4vaGlzdG9ncmFtJ1xyXG5leHBvcnQge0JhckNoYXJ0LCBCYXJDaGFydENvbmZpZ30gZnJvbSAnLi9iYXItY2hhcnQnXHJcbmV4cG9ydCB7Qm94UGxvdEJhc2UsIEJveFBsb3RCYXNlQ29uZmlnfSBmcm9tICcuL2JveC1wbG90LWJhc2UnXHJcbmV4cG9ydCB7Qm94UGxvdCwgQm94UGxvdENvbmZpZ30gZnJvbSAnLi9ib3gtcGxvdCdcclxuZXhwb3J0IHtTdGF0aXN0aWNzVXRpbHN9IGZyb20gJy4vc3RhdGlzdGljcy11dGlscydcclxuZXhwb3J0IHtMZWdlbmR9IGZyb20gJy4vbGVnZW5kJ1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiIsImltcG9ydCB7VXRpbHN9IGZyb20gXCIuL3V0aWxzXCI7XHJcbmltcG9ydCB7Y29sb3IsIHNpemUsIHN5bWJvbH0gZnJvbSBcIi4uL2Jvd2VyX2NvbXBvbmVudHMvZDMtbGVnZW5kL25vLWV4dGVuZFwiO1xyXG5cclxuLyp2YXIgZDMgPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL2QzJyk7XHJcbiovXHJcbi8vIHZhciBsZWdlbmQgPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL2QzLWxlZ2VuZC9uby1leHRlbmQnKTtcclxuLy9cclxuLy8gbW9kdWxlLmV4cG9ydHMubGVnZW5kID0gbGVnZW5kO1xyXG5cclxuZXhwb3J0IGNsYXNzIExlZ2VuZCB7XHJcblxyXG4gICAgY3NzQ2xhc3NQcmVmaXg9XCJvZGMtXCI7XHJcbiAgICBsZWdlbmRDbGFzcz10aGlzLmNzc0NsYXNzUHJlZml4K1wibGVnZW5kXCI7XHJcbiAgICBjb250YWluZXI7XHJcbiAgICBzY2FsZTtcclxuICAgIGNvbG9yPSBjb2xvcjtcclxuICAgIHNpemUgPSBzaXplO1xyXG4gICAgc3ltYm9sPSBzeW1ib2w7XHJcbiAgICBndWlkO1xyXG5cclxuICAgIGxhYmVsRm9ybWF0ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHN2ZywgbGVnZW5kUGFyZW50LCBzY2FsZSwgbGVnZW5kWCwgbGVnZW5kWSwgbGFiZWxGb3JtYXQpe1xyXG4gICAgICAgIHRoaXMuc2NhbGU9c2NhbGU7XHJcbiAgICAgICAgdGhpcy5zdmcgPSBzdmc7XHJcbiAgICAgICAgdGhpcy5ndWlkID0gVXRpbHMuZ3VpZCgpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gIFV0aWxzLnNlbGVjdE9yQXBwZW5kKGxlZ2VuZFBhcmVudCwgXCJnLlwiK3RoaXMubGVnZW5kQ2xhc3MsIFwiZ1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIitsZWdlbmRYK1wiLFwiK2xlZ2VuZFkrXCIpXCIpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKHRoaXMubGVnZW5kQ2xhc3MsIHRydWUpO1xyXG5cclxuICAgICAgICB0aGlzLmxhYmVsRm9ybWF0ID0gbGFiZWxGb3JtYXQ7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBsaW5lYXJHcmFkaWVudEJhcihiYXJXaWR0aCwgYmFySGVpZ2h0LCB0aXRsZSl7XHJcbiAgICAgICAgdmFyIGdyYWRpZW50SWQgPSB0aGlzLmNzc0NsYXNzUHJlZml4K1wibGluZWFyLWdyYWRpZW50XCIrXCItXCIrdGhpcy5ndWlkO1xyXG4gICAgICAgIHZhciBzY2FsZT0gdGhpcy5zY2FsZTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMubGluZWFyR3JhZGllbnQgPSBVdGlscy5saW5lYXJHcmFkaWVudCh0aGlzLnN2ZywgZ3JhZGllbnRJZCwgdGhpcy5zY2FsZS5yYW5nZSgpLCAwLCAxMDAsIDAsIDApO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmQoXCJyZWN0XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgYmFyV2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGJhckhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAwKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwidXJsKCNcIitncmFkaWVudElkK1wiKVwiKTtcclxuXHJcblxyXG4gICAgICAgIHZhciB0aWNrcyA9IHRoaXMuY29udGFpbmVyLnNlbGVjdEFsbChcInRleHRcIilcclxuICAgICAgICAgICAgLmRhdGEoIHNjYWxlLmRvbWFpbigpICk7XHJcbiAgICAgICAgdmFyIHRpY2tzTnVtYmVyID1zY2FsZS5kb21haW4oKS5sZW5ndGgtMTtcclxuICAgICAgICB0aWNrcy5lbnRlcigpLmFwcGVuZChcInRleHRcIik7XHJcblxyXG4gICAgICAgIHRpY2tzLmF0dHIoXCJ4XCIsIGJhcldpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgIChkLCBpKSA9PiAgYmFySGVpZ2h0IC0oaSpiYXJIZWlnaHQvdGlja3NOdW1iZXIpKVxyXG4gICAgICAgICAgICAuYXR0cihcImR4XCIsIDMpXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiZHlcIiwgMSlcclxuICAgICAgICAgICAgLmF0dHIoXCJhbGlnbm1lbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoZD0+IHNlbGYubGFiZWxGb3JtYXQgPyBzZWxmLmxhYmVsRm9ybWF0KGQpIDogZCk7XHJcbiAgICAgICAgdGlja3MuYXR0cihcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgaWYodGhpcy5yb3RhdGVMYWJlbHMpe1xyXG4gICAgICAgICAgICB0aWNrc1xyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwicm90YXRlKC00NSwgXCIgKyBiYXJXaWR0aCArIFwiLCBcIiArIChiYXJIZWlnaHQgLShpKmJhckhlaWdodC90aWNrc051bWJlcikpICsgXCIpXCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwic3RhcnRcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZHhcIiwgNSlcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgNSk7XHJcblxyXG4gICAgICAgIH1lbHNle1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRpY2tzLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Um90YXRlTGFiZWxzKHJvdGF0ZUxhYmVscykge1xyXG4gICAgICAgIHRoaXMucm90YXRlTGFiZWxzID0gcm90YXRlTGFiZWxzO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG59IiwiaW1wb3J0IHtDaGFydCwgQ2hhcnRDb25maWd9IGZyb20gXCIuL2NoYXJ0XCI7XHJcbmltcG9ydCB7U2NhdHRlclBsb3QsIFNjYXR0ZXJQbG90Q29uZmlnfSBmcm9tIFwiLi9zY2F0dGVycGxvdFwiO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5pbXBvcnQge1N0YXRpc3RpY3NVdGlsc30gZnJvbSAnLi9zdGF0aXN0aWNzLXV0aWxzJ1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBSZWdyZXNzaW9uQ29uZmlnIGV4dGVuZHMgU2NhdHRlclBsb3RDb25maWd7XHJcblxyXG4gICAgbWFpblJlZ3Jlc3Npb24gPSB0cnVlO1xyXG4gICAgZ3JvdXBSZWdyZXNzaW9uID0gdHJ1ZTtcclxuICAgIGNvbmZpZGVuY2U9e1xyXG4gICAgICAgIGxldmVsOiAwLjk1LFxyXG4gICAgICAgIGNyaXRpY2FsVmFsdWU6IChkZWdyZWVzT2ZGcmVlZG9tLCBjcml0aWNhbFByb2JhYmlsaXR5KSA9PiBTdGF0aXN0aWNzVXRpbHMudFZhbHVlKGRlZ3JlZXNPZkZyZWVkb20sIGNyaXRpY2FsUHJvYmFiaWxpdHkpLFxyXG4gICAgICAgIG1hcmdpbk9mRXJyb3I6IHVuZGVmaW5lZCAvL2N1c3RvbSAgbWFyZ2luIE9mIEVycm9yIGZ1bmN0aW9uICh4LCBwb2ludHMpXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgaWYoY3VzdG9tKXtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBSZWdyZXNzaW9uIGV4dGVuZHMgU2NhdHRlclBsb3R7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBzdXBlcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBuZXcgUmVncmVzc2lvbkNvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKXtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBSZWdyZXNzaW9uQ29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCl7XHJcbiAgICAgICAgc3VwZXIuaW5pdFBsb3QoKTtcclxuICAgICAgICB0aGlzLmluaXRSZWdyZXNzaW9uTGluZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0UmVncmVzc2lvbkxpbmVzKCl7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgZ3JvdXBzQXZhaWxhYmxlID0gc2VsZi5wbG90Lmdyb3VwaW5nRW5hYmxlZDtcclxuXHJcbiAgICAgICAgc2VsZi5wbG90LnJlZ3Jlc3Npb25zPSBbXTtcclxuXHJcblxyXG4gICAgICAgIGlmKGdyb3Vwc0F2YWlsYWJsZSAmJiBzZWxmLmNvbmZpZy5tYWluUmVncmVzc2lvbil7XHJcbiAgICAgICAgICAgIHZhciByZWdyZXNzaW9uID0gdGhpcy5pbml0UmVncmVzc2lvbih0aGlzLnBsb3QuZGF0YSwgZmFsc2UpO1xyXG4gICAgICAgICAgICBzZWxmLnBsb3QucmVncmVzc2lvbnMucHVzaChyZWdyZXNzaW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHNlbGYuY29uZmlnLmdyb3VwUmVncmVzc2lvbil7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdEdyb3VwUmVncmVzc2lvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdEdyb3VwUmVncmVzc2lvbigpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYucGxvdC5ncm91cGVkRGF0YS5mb3JFYWNoKGdyb3VwPT57XHJcbiAgICAgICAgICAgIHZhciByZWdyZXNzaW9uID0gdGhpcy5pbml0UmVncmVzc2lvbihncm91cC52YWx1ZXMsIGdyb3VwLmtleSk7XHJcbiAgICAgICAgICAgIHNlbGYucGxvdC5yZWdyZXNzaW9ucy5wdXNoKHJlZ3Jlc3Npb24pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRSZWdyZXNzaW9uKHZhbHVlcywgZ3JvdXBWYWwpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIHBvaW50cyA9IHZhbHVlcy5tYXAoZD0+e1xyXG4gICAgICAgICAgICByZXR1cm4gW3BhcnNlRmxvYXQoc2VsZi5wbG90LngudmFsdWUoZCkpLCBwYXJzZUZsb2F0KHNlbGYucGxvdC55LnZhbHVlKGQpKV07XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHBvaW50cy5zb3J0KChhLGIpID0+IGFbMF0tYlswXSk7XHJcblxyXG4gICAgICAgIHZhciBsaW5lYXJSZWdyZXNzaW9uID0gIFN0YXRpc3RpY3NVdGlscy5saW5lYXJSZWdyZXNzaW9uKHBvaW50cyk7XHJcbiAgICAgICAgdmFyIGxpbmVhclJlZ3Jlc3Npb25MaW5lID0gU3RhdGlzdGljc1V0aWxzLmxpbmVhclJlZ3Jlc3Npb25MaW5lKGxpbmVhclJlZ3Jlc3Npb24pO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGV4dGVudFggPSBkMy5leHRlbnQocG9pbnRzLCBkPT5kWzBdKTtcclxuXHJcblxyXG4gICAgICAgIHZhciBsaW5lUG9pbnRzID0gW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB4OiBleHRlbnRYWzBdLFxyXG4gICAgICAgICAgICAgICAgeTogbGluZWFyUmVncmVzc2lvbkxpbmUoZXh0ZW50WFswXSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeDogZXh0ZW50WFsxXSxcclxuICAgICAgICAgICAgICAgIHk6IGxpbmVhclJlZ3Jlc3Npb25MaW5lKGV4dGVudFhbMV0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICB2YXIgbGluZSA9IGQzLnN2Zy5saW5lKClcclxuICAgICAgICAgICAgLmludGVycG9sYXRlKFwiYmFzaXNcIilcclxuICAgICAgICAgICAgLngoZCA9PiBzZWxmLnBsb3QueC5zY2FsZShkLngpKVxyXG4gICAgICAgICAgICAueShkID0+IHNlbGYucGxvdC55LnNjYWxlKGQueSkpO1xyXG5cclxuICAgICAgICB2YXIgY29sb3IgPSBzZWxmLnBsb3QuY29sb3I7XHJcblxyXG4gICAgICAgIHZhciBkZWZhdWx0Q29sb3IgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgaWYoVXRpbHMuaXNGdW5jdGlvbihjb2xvcikpe1xyXG4gICAgICAgICAgICBpZih2YWx1ZXMubGVuZ3RoICYmIGdyb3VwVmFsIT09ZmFsc2Upe1xyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5jb25maWcuc2VyaWVzKXtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvciA9c2VsZi5wbG90LmNvbG9yQ2F0ZWdvcnkoZ3JvdXBWYWwpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3IgPSBjb2xvcih2YWx1ZXNbMF0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBjb2xvciA9IGRlZmF1bHRDb2xvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1lbHNlIGlmKCFjb2xvciAmJiBncm91cFZhbD09PWZhbHNlKXtcclxuICAgICAgICAgICAgY29sb3IgPSBkZWZhdWx0Q29sb3I7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdmFyIGNvbmZpZGVuY2UgPSB0aGlzLmNvbXB1dGVDb25maWRlbmNlKHBvaW50cywgZXh0ZW50WCwgIGxpbmVhclJlZ3Jlc3Npb24sbGluZWFyUmVncmVzc2lvbkxpbmUpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGdyb3VwOiBncm91cFZhbCB8fCBmYWxzZSxcclxuICAgICAgICAgICAgbGluZTogbGluZSxcclxuICAgICAgICAgICAgbGluZVBvaW50czogbGluZVBvaW50cyxcclxuICAgICAgICAgICAgY29sb3I6IGNvbG9yLFxyXG4gICAgICAgICAgICBjb25maWRlbmNlOiBjb25maWRlbmNlXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wdXRlQ29uZmlkZW5jZShwb2ludHMsIGV4dGVudFgsIGxpbmVhclJlZ3Jlc3Npb24sbGluZWFyUmVncmVzc2lvbkxpbmUpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgc2xvcGUgPSBsaW5lYXJSZWdyZXNzaW9uLm07XHJcbiAgICAgICAgdmFyIG4gPSBwb2ludHMubGVuZ3RoO1xyXG4gICAgICAgIHZhciBkZWdyZWVzT2ZGcmVlZG9tID0gTWF0aC5tYXgoMCwgbi0yKTtcclxuXHJcbiAgICAgICAgdmFyIGFscGhhID0gMSAtIHNlbGYuY29uZmlnLmNvbmZpZGVuY2UubGV2ZWw7XHJcbiAgICAgICAgdmFyIGNyaXRpY2FsUHJvYmFiaWxpdHkgID0gMSAtIGFscGhhLzI7XHJcbiAgICAgICAgdmFyIGNyaXRpY2FsVmFsdWUgPSBzZWxmLmNvbmZpZy5jb25maWRlbmNlLmNyaXRpY2FsVmFsdWUoZGVncmVlc09mRnJlZWRvbSxjcml0aWNhbFByb2JhYmlsaXR5KTtcclxuXHJcbiAgICAgICAgdmFyIHhWYWx1ZXMgPSBwb2ludHMubWFwKGQ9PmRbMF0pO1xyXG4gICAgICAgIHZhciBtZWFuWCA9IFN0YXRpc3RpY3NVdGlscy5tZWFuKHhWYWx1ZXMpO1xyXG4gICAgICAgIHZhciB4TXlTdW09MDtcclxuICAgICAgICB2YXIgeFN1bT0wO1xyXG4gICAgICAgIHZhciB4UG93U3VtPTA7XHJcbiAgICAgICAgdmFyIHlTdW09MDtcclxuICAgICAgICB2YXIgeVBvd1N1bT0wO1xyXG4gICAgICAgIHBvaW50cy5mb3JFYWNoKHA9PntcclxuICAgICAgICAgICAgdmFyIHggPSBwWzBdO1xyXG4gICAgICAgICAgICB2YXIgeSA9IHBbMV07XHJcblxyXG4gICAgICAgICAgICB4TXlTdW0gKz0geCp5O1xyXG4gICAgICAgICAgICB4U3VtKz14O1xyXG4gICAgICAgICAgICB5U3VtKz15O1xyXG4gICAgICAgICAgICB4UG93U3VtKz0geCp4O1xyXG4gICAgICAgICAgICB5UG93U3VtKz0geSp5O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBhID0gbGluZWFyUmVncmVzc2lvbi5tO1xyXG4gICAgICAgIHZhciBiID0gbGluZWFyUmVncmVzc2lvbi5iO1xyXG5cclxuICAgICAgICB2YXIgU2EyID0gbi8obisyKSAqICgoeVBvd1N1bS1hKnhNeVN1bS1iKnlTdW0pLyhuKnhQb3dTdW0tKHhTdW0qeFN1bSkpKTsgLy9XYXJpYW5jamEgd3Nww7PFgmN6eW5uaWthIGtpZXJ1bmtvd2VnbyByZWdyZXNqaSBsaW5pb3dlaiBhXHJcbiAgICAgICAgdmFyIFN5MiA9ICh5UG93U3VtIC0gYSp4TXlTdW0tYip5U3VtKS8obioobi0yKSk7IC8vU2EyIC8vTWVhbiB5IHZhbHVlIHZhcmlhbmNlXHJcblxyXG4gICAgICAgIHZhciBlcnJvckZuID0geD0+IE1hdGguc3FydChTeTIgKyBNYXRoLnBvdyh4LW1lYW5YLDIpKlNhMik7IC8vcGllcndpYXN0ZWsga3dhZHJhdG93eSB6IHdhcmlhbmNqaSBkb3dvbG5lZ28gcHVua3R1IHByb3N0ZWpcclxuICAgICAgICB2YXIgbWFyZ2luT2ZFcnJvciA9ICB4PT4gY3JpdGljYWxWYWx1ZSogZXJyb3JGbih4KTtcclxuXHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCduJywgbiwgJ2RlZ3JlZXNPZkZyZWVkb20nLCBkZWdyZWVzT2ZGcmVlZG9tLCAnY3JpdGljYWxQcm9iYWJpbGl0eScsY3JpdGljYWxQcm9iYWJpbGl0eSk7XHJcbiAgICAgICAgLy8gdmFyIGNvbmZpZGVuY2VEb3duID0geCA9PiBsaW5lYXJSZWdyZXNzaW9uTGluZSh4KSAtICBtYXJnaW5PZkVycm9yKHgpO1xyXG4gICAgICAgIC8vIHZhciBjb25maWRlbmNlVXAgPSB4ID0+IGxpbmVhclJlZ3Jlc3Npb25MaW5lKHgpICsgIG1hcmdpbk9mRXJyb3IoeCk7XHJcblxyXG5cclxuICAgICAgICB2YXIgY29tcHV0ZUNvbmZpZGVuY2VBcmVhUG9pbnQgPSB4PT57XHJcbiAgICAgICAgICAgIHZhciBsaW5lYXJSZWdyZXNzaW9uID0gbGluZWFyUmVncmVzc2lvbkxpbmUoeCk7XHJcbiAgICAgICAgICAgIHZhciBtb2UgPSBtYXJnaW5PZkVycm9yKHgpO1xyXG4gICAgICAgICAgICB2YXIgY29uZkRvd24gPSBsaW5lYXJSZWdyZXNzaW9uIC0gbW9lO1xyXG4gICAgICAgICAgICB2YXIgY29uZlVwID0gbGluZWFyUmVncmVzc2lvbiArIG1vZTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHg6IHgsXHJcbiAgICAgICAgICAgICAgICB5MDogY29uZkRvd24sXHJcbiAgICAgICAgICAgICAgICB5MTogY29uZlVwXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGNlbnRlclggPSAoZXh0ZW50WFsxXStleHRlbnRYWzBdKS8yO1xyXG5cclxuICAgICAgICAvLyB2YXIgY29uZmlkZW5jZUFyZWFQb2ludHMgPSBbZXh0ZW50WFswXSwgY2VudGVyWCwgIGV4dGVudFhbMV1dLm1hcChjb21wdXRlQ29uZmlkZW5jZUFyZWFQb2ludCk7XHJcbiAgICAgICAgdmFyIGNvbmZpZGVuY2VBcmVhUG9pbnRzID0gW2V4dGVudFhbMF0sIGNlbnRlclgsICBleHRlbnRYWzFdXS5tYXAoY29tcHV0ZUNvbmZpZGVuY2VBcmVhUG9pbnQpO1xyXG5cclxuICAgICAgICB2YXIgZml0SW5QbG90ID0geSA9PiB5O1xyXG5cclxuICAgICAgICB2YXIgY29uZmlkZW5jZUFyZWEgPSAgZDMuc3ZnLmFyZWEoKVxyXG4gICAgICAgIC5pbnRlcnBvbGF0ZShcIm1vbm90b25lXCIpXHJcbiAgICAgICAgICAgIC54KGQgPT4gc2VsZi5wbG90Lnguc2NhbGUoZC54KSlcclxuICAgICAgICAgICAgLnkwKGQgPT4gZml0SW5QbG90KHNlbGYucGxvdC55LnNjYWxlKGQueTApKSlcclxuICAgICAgICAgICAgLnkxKGQgPT4gZml0SW5QbG90KHNlbGYucGxvdC55LnNjYWxlKGQueTEpKSk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGFyZWE6Y29uZmlkZW5jZUFyZWEsXHJcbiAgICAgICAgICAgIHBvaW50czpjb25maWRlbmNlQXJlYVBvaW50c1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKG5ld0RhdGEpe1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJlZ3Jlc3Npb25MaW5lcygpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlUmVncmVzc2lvbkxpbmVzKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcmVncmVzc2lvbkNvbnRhaW5lckNsYXNzID0gdGhpcy5wcmVmaXhDbGFzcyhcInJlZ3Jlc3Npb24tY29udGFpbmVyXCIpO1xyXG4gICAgICAgIHZhciByZWdyZXNzaW9uQ29udGFpbmVyU2VsZWN0b3IgPSBcImcuXCIrcmVncmVzc2lvbkNvbnRhaW5lckNsYXNzO1xyXG5cclxuICAgICAgICB2YXIgY2xpcFBhdGhJZCA9IHNlbGYucHJlZml4Q2xhc3MoXCJjbGlwXCIpO1xyXG5cclxuICAgICAgICB2YXIgcmVncmVzc2lvbkNvbnRhaW5lciA9IHNlbGYuc3ZnRy5zZWxlY3RPckluc2VydChyZWdyZXNzaW9uQ29udGFpbmVyU2VsZWN0b3IsIFwiLlwiK3NlbGYuZG90c0NvbnRhaW5lckNsYXNzKTtcclxuICAgICAgICB2YXIgcmVncmVzc2lvbkNvbnRhaW5lckNsaXAgPSByZWdyZXNzaW9uQ29udGFpbmVyLnNlbGVjdE9yQXBwZW5kKFwiY2xpcFBhdGhcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBjbGlwUGF0aElkKTtcclxuXHJcblxyXG4gICAgICAgIHJlZ3Jlc3Npb25Db250YWluZXJDbGlwLnNlbGVjdE9yQXBwZW5kKCdyZWN0JylcclxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgc2VsZi5wbG90LndpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0Jywgc2VsZi5wbG90LmhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAwKVxyXG4gICAgICAgICAgICAuYXR0cigneScsIDApO1xyXG5cclxuICAgICAgICByZWdyZXNzaW9uQ29udGFpbmVyLmF0dHIoXCJjbGlwLXBhdGhcIiwgKGQsaSkgPT4gXCJ1cmwoI1wiK2NsaXBQYXRoSWQrXCIpXCIpO1xyXG5cclxuICAgICAgICB2YXIgcmVncmVzc2lvbkNsYXNzID0gdGhpcy5wcmVmaXhDbGFzcyhcInJlZ3Jlc3Npb25cIik7XHJcbiAgICAgICAgdmFyIGNvbmZpZGVuY2VBcmVhQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwiY29uZmlkZW5jZVwiKTtcclxuICAgICAgICB2YXIgcmVncmVzc2lvblNlbGVjdG9yID0gXCJnLlwiK3JlZ3Jlc3Npb25DbGFzcztcclxuICAgICAgICB2YXIgcmVncmVzc2lvbiA9IHJlZ3Jlc3Npb25Db250YWluZXIuc2VsZWN0QWxsKHJlZ3Jlc3Npb25TZWxlY3RvcilcclxuICAgICAgICAgICAgLmRhdGEoc2VsZi5wbG90LnJlZ3Jlc3Npb25zLCAoZCxpKT0+IGQuZ3JvdXApO1xyXG5cclxuICAgICAgICB2YXIgcmVncmVzc2lvbkVudGVyRyA9IHJlZ3Jlc3Npb24uZW50ZXIoKS5pbnNlcnRTZWxlY3RvcihyZWdyZXNzaW9uU2VsZWN0b3IpO1xyXG4gICAgICAgIHZhciBsaW5lQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwibGluZVwiKTtcclxuICAgICAgICByZWdyZXNzaW9uRW50ZXJHXHJcblxyXG4gICAgICAgICAgICAuYXBwZW5kKFwicGF0aFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGxpbmVDbGFzcylcclxuICAgICAgICAgICAgLmF0dHIoXCJzaGFwZS1yZW5kZXJpbmdcIiwgXCJvcHRpbWl6ZVF1YWxpdHlcIik7XHJcbiAgICAgICAgICAgIC8vIC5hcHBlbmQoXCJsaW5lXCIpXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiY2xhc3NcIiwgXCJsaW5lXCIpXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwic2hhcGUtcmVuZGVyaW5nXCIsIFwib3B0aW1pemVRdWFsaXR5XCIpO1xyXG5cclxuICAgICAgICB2YXIgbGluZSA9IHJlZ3Jlc3Npb24uc2VsZWN0KFwicGF0aC5cIitsaW5lQ2xhc3MpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCByID0+IHIuY29sb3IpO1xyXG4gICAgICAgIC8vIC5hdHRyKFwieDFcIiwgcj0+IHNlbGYucGxvdC54LnNjYWxlKHIubGluZVBvaW50c1swXS54KSlcclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJ5MVwiLCByPT4gc2VsZi5wbG90Lnkuc2NhbGUoci5saW5lUG9pbnRzWzBdLnkpKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcIngyXCIsIHI9PiBzZWxmLnBsb3QueC5zY2FsZShyLmxpbmVQb2ludHNbMV0ueCkpXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwieTJcIiwgcj0+IHNlbGYucGxvdC55LnNjYWxlKHIubGluZVBvaW50c1sxXS55KSlcclxuXHJcblxyXG4gICAgICAgIHZhciBsaW5lVCA9IGxpbmU7XHJcbiAgICAgICAgaWYgKHNlbGYudHJhbnNpdGlvbkVuYWJsZWQoKSkge1xyXG4gICAgICAgICAgICBsaW5lVCA9IGxpbmUudHJhbnNpdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGluZVQuYXR0cihcImRcIiwgciA9PiByLmxpbmUoci5saW5lUG9pbnRzKSlcclxuXHJcblxyXG4gICAgICAgIHJlZ3Jlc3Npb25FbnRlckdcclxuICAgICAgICAgICAgLmFwcGVuZChcInBhdGhcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBjb25maWRlbmNlQXJlYUNsYXNzKVxyXG4gICAgICAgICAgICAuYXR0cihcInNoYXBlLXJlbmRlcmluZ1wiLCBcIm9wdGltaXplUXVhbGl0eVwiKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIFwiMC40XCIpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHZhciBhcmVhID0gcmVncmVzc2lvbi5zZWxlY3QoXCJwYXRoLlwiK2NvbmZpZGVuY2VBcmVhQ2xhc3MpO1xyXG5cclxuICAgICAgICB2YXIgYXJlYVQgPSBhcmVhO1xyXG4gICAgICAgIGlmIChzZWxmLnRyYW5zaXRpb25FbmFibGVkKCkpIHtcclxuICAgICAgICAgICAgYXJlYVQgPSBhcmVhLnRyYW5zaXRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYXJlYVQuYXR0cihcImRcIiwgciA9PiByLmNvbmZpZGVuY2UuYXJlYShyLmNvbmZpZGVuY2UucG9pbnRzKSk7XHJcbiAgICAgICAgYXJlYVQuc3R5bGUoXCJmaWxsXCIsIHIgPT4gci5jb2xvcilcclxuICAgICAgICByZWdyZXNzaW9uLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn1cclxuXHJcbiIsImltcG9ydCB7Q2hhcnRXaXRoQ29sb3JHcm91cHN9IGZyb20gXCIuL2NoYXJ0LXdpdGgtY29sb3ItZ3JvdXBzXCI7XHJcbmltcG9ydCB7U2NhdHRlclBsb3RDb25maWd9IGZyb20gXCIuL3NjYXR0ZXJwbG90XCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7TGVnZW5kfSBmcm9tIFwiLi9sZWdlbmRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTY2F0dGVyUGxvdE1hdHJpeENvbmZpZyBleHRlbmRzIFNjYXR0ZXJQbG90Q29uZmlne1xyXG5cclxuICAgIHN2Z0NsYXNzPSB0aGlzLmNzc0NsYXNzUHJlZml4KydzY2F0dGVycGxvdC1tYXRyaXgnO1xyXG4gICAgc2l6ZT0gdW5kZWZpbmVkOyAvL3NjYXR0ZXIgcGxvdCBjZWxsIHNpemVcclxuICAgIG1pbkNlbGxTaXplID0gNTA7XHJcbiAgICBtYXhDZWxsU2l6ZSA9IDEwMDA7XHJcbiAgICBwYWRkaW5nPSAyMDsgLy9zY2F0dGVyIHBsb3QgY2VsbCBwYWRkaW5nXHJcbiAgICBicnVzaD0gdHJ1ZTtcclxuICAgIGd1aWRlcz0gdHJ1ZTsgLy9zaG93IGF4aXMgZ3VpZGVzXHJcbiAgICBzaG93VG9vbHRpcD0gdHJ1ZTsgLy9zaG93IHRvb2x0aXAgb24gZG90IGhvdmVyXHJcbiAgICB0aWNrcz0gdW5kZWZpbmVkOyAvL3RpY2tzIG51bWJlciwgKGRlZmF1bHQ6IGNvbXB1dGVkIHVzaW5nIGNlbGwgc2l6ZSlcclxuICAgIHg9ey8vIFggYXhpcyBjb25maWdcclxuICAgICAgICBvcmllbnQ6IFwiYm90dG9tXCIsXHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCJcclxuICAgIH07XHJcbiAgICB5PXsvLyBZIGF4aXMgY29uZmlnXHJcbiAgICAgICAgb3JpZW50OiBcImxlZnRcIixcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIlxyXG4gICAgfTtcclxuICAgIGdyb3Vwcz17XHJcbiAgICAgICAga2V5OiB1bmRlZmluZWQsIC8vb2JqZWN0IHByb3BlcnR5IG5hbWUgb3IgYXJyYXkgaW5kZXggd2l0aCBncm91cGluZyB2YXJpYWJsZVxyXG4gICAgICAgIGluY2x1ZGVJblBsb3Q6IGZhbHNlLCAvL2luY2x1ZGUgZ3JvdXAgYXMgdmFyaWFibGUgaW4gcGxvdCwgYm9vbGVhbiAoZGVmYXVsdDogZmFsc2UpXHJcbiAgICB9O1xyXG4gICAgdmFyaWFibGVzPSB7XHJcbiAgICAgICAgbGFiZWxzOiBbXSwgLy9vcHRpb25hbCBhcnJheSBvZiB2YXJpYWJsZSBsYWJlbHMgKGZvciB0aGUgZGlhZ29uYWwgb2YgdGhlIHBsb3QpLlxyXG4gICAgICAgIGtleXM6IFtdLCAvL29wdGlvbmFsIGFycmF5IG9mIHZhcmlhYmxlIGtleXNcclxuICAgICAgICB2YWx1ZTogKGQsIHZhcmlhYmxlS2V5KSA9PiBkW3ZhcmlhYmxlS2V5XSAvLyB2YXJpYWJsZSB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTY2F0dGVyUGxvdE1hdHJpeCBleHRlbmRzIENoYXJ0V2l0aENvbG9yR3JvdXBzIHtcclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIG5ldyBTY2F0dGVyUGxvdE1hdHJpeENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgU2NhdHRlclBsb3RNYXRyaXhDb25maWcoY29uZmlnKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgbWFyZ2luID0gdGhpcy5wbG90Lm1hcmdpbjtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG4gICAgICAgIHRoaXMucGxvdC54PXt9O1xyXG4gICAgICAgIHRoaXMucGxvdC55PXt9O1xyXG4gICAgICAgIHRoaXMucGxvdC5kb3Q9e1xyXG4gICAgICAgICAgICBjb2xvcjogbnVsbC8vY29sb3Igc2NhbGUgbWFwcGluZyBmdW5jdGlvblxyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zZXR1cFZhcmlhYmxlcygpO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3Quc2l6ZSA9IGNvbmYuc2l6ZTtcclxuXHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IGNvbmYud2lkdGg7XHJcbiAgICAgICAgdmFyIGF2YWlsYWJsZVdpZHRoID0gVXRpbHMuYXZhaWxhYmxlV2lkdGgodGhpcy5jb25maWcud2lkdGgsIHRoaXMuZ2V0QmFzZUNvbnRhaW5lcigpLCBtYXJnaW4pO1xyXG4gICAgICAgIHZhciBhdmFpbGFibGVIZWlnaHQgPSBVdGlscy5hdmFpbGFibGVIZWlnaHQodGhpcy5jb25maWcuaGVpZ2h0LCB0aGlzLmdldEJhc2VDb250YWluZXIoKSwgbWFyZ2luKTtcclxuICAgICAgICBpZiAoIXdpZHRoKSB7XHJcbiAgICAgICAgICAgIGlmKCF0aGlzLnBsb3Quc2l6ZSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3Quc2l6ZSA9ICBNYXRoLm1pbihjb25mLm1heENlbGxTaXplLCBNYXRoLm1heChjb25mLm1pbkNlbGxTaXplLCBhdmFpbGFibGVXaWR0aC90aGlzLnBsb3QudmFyaWFibGVzLmxlbmd0aCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdpZHRoID0gbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQgKyB0aGlzLnBsb3QudmFyaWFibGVzLmxlbmd0aCp0aGlzLnBsb3Quc2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIXRoaXMucGxvdC5zaXplKXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LnNpemUgPSAod2lkdGggLSAobWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQpKSAvIHRoaXMucGxvdC52YXJpYWJsZXMubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGhlaWdodCA9IHdpZHRoO1xyXG4gICAgICAgIGlmICghaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGhlaWdodCA9IGF2YWlsYWJsZUhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC53aWR0aCA9IHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XHJcbiAgICAgICAgdGhpcy5wbG90LmhlaWdodCA9IGhlaWdodCAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnRpY2tzID0gY29uZi50aWNrcztcclxuXHJcbiAgICAgICAgaWYodGhpcy5wbG90LnRpY2tzPT09dW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LnRpY2tzID0gdGhpcy5wbG90LnNpemUgLyA0MDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBYKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFkoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cFZhcmlhYmxlcygpIHtcclxuICAgICAgICB2YXIgdmFyaWFibGVzQ29uZiA9IHRoaXMuY29uZmlnLnZhcmlhYmxlcztcclxuXHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLnBsb3QuZ3JvdXBlZERhdGE7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgcGxvdC5kb21haW5CeVZhcmlhYmxlID0ge307XHJcbiAgICAgICAgcGxvdC52YXJpYWJsZXMgPSB2YXJpYWJsZXNDb25mLmtleXM7XHJcbiAgICAgICAgaWYoIXBsb3QudmFyaWFibGVzIHx8ICFwbG90LnZhcmlhYmxlcy5sZW5ndGgpe1xyXG5cclxuICAgICAgICAgICAgcGxvdC52YXJpYWJsZXMgPSBkYXRhLmxlbmd0aCA/IFV0aWxzLmluZmVyVmFyaWFibGVzKGRhdGFbMF0udmFsdWVzLCB0aGlzLmNvbmZpZy5ncm91cHMua2V5LCB0aGlzLmNvbmZpZy5pbmNsdWRlSW5QbG90KSA6IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcGxvdC5sYWJlbHMgPSBbXTtcclxuICAgICAgICBwbG90LmxhYmVsQnlWYXJpYWJsZSA9IHt9O1xyXG4gICAgICAgIHBsb3QudmFyaWFibGVzLmZvckVhY2goKHZhcmlhYmxlS2V5LCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgbWluID0gZDMubWluKGRhdGEsIHM9PmQzLm1pbihzLnZhbHVlcywgZD0+dmFyaWFibGVzQ29uZi52YWx1ZShkLCB2YXJpYWJsZUtleSkpKTtcclxuICAgICAgICAgICAgdmFyIG1heCA9IGQzLm1heChkYXRhLCBzPT5kMy5tYXgocy52YWx1ZXMsIGQ9PnZhcmlhYmxlc0NvbmYudmFsdWUoZCwgdmFyaWFibGVLZXkpKSk7XHJcbiAgICAgICAgICAgIHBsb3QuZG9tYWluQnlWYXJpYWJsZVt2YXJpYWJsZUtleV0gPSBbbWluLG1heF07XHJcbiAgICAgICAgICAgIHZhciBsYWJlbCA9IHZhcmlhYmxlS2V5O1xyXG4gICAgICAgICAgICBpZih2YXJpYWJsZXNDb25mLmxhYmVscyAmJiB2YXJpYWJsZXNDb25mLmxhYmVscy5sZW5ndGg+aW5kZXgpe1xyXG5cclxuICAgICAgICAgICAgICAgIGxhYmVsID0gdmFyaWFibGVzQ29uZi5sYWJlbHNbaW5kZXhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBsb3QubGFiZWxzLnB1c2gobGFiZWwpO1xyXG4gICAgICAgICAgICBwbG90LmxhYmVsQnlWYXJpYWJsZVt2YXJpYWJsZUtleV0gPSBsYWJlbDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcGxvdC5zdWJwbG90cyA9IFtdO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cFgoKSB7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB4ID0gcGxvdC54O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcblxyXG4gICAgICAgIHgudmFsdWUgPSBjb25mLnZhcmlhYmxlcy52YWx1ZTtcclxuICAgICAgICB4LnNjYWxlID0gZDMuc2NhbGVbY29uZi54LnNjYWxlXSgpLnJhbmdlKFtjb25mLnBhZGRpbmcgLyAyLCBwbG90LnNpemUgLSBjb25mLnBhZGRpbmcgLyAyXSk7XHJcbiAgICAgICAgeC5tYXAgPSAoZCwgdmFyaWFibGUpID0+IHguc2NhbGUoeC52YWx1ZShkLCB2YXJpYWJsZSkpO1xyXG4gICAgICAgIHguYXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeC5zY2FsZSkub3JpZW50KGNvbmYueC5vcmllbnQpLnRpY2tzKHBsb3QudGlja3MpO1xyXG4gICAgICAgIHguYXhpcy50aWNrU2l6ZShwbG90LnNpemUgKiBwbG90LnZhcmlhYmxlcy5sZW5ndGgpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBZKCkge1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeSA9IHBsb3QueTtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB5LnZhbHVlID0gY29uZi52YXJpYWJsZXMudmFsdWU7XHJcbiAgICAgICAgeS5zY2FsZSA9IGQzLnNjYWxlW2NvbmYueS5zY2FsZV0oKS5yYW5nZShbIHBsb3Quc2l6ZSAtIGNvbmYucGFkZGluZyAvIDIsIGNvbmYucGFkZGluZyAvIDJdKTtcclxuICAgICAgICB5Lm1hcCA9IChkLCB2YXJpYWJsZSkgPT4geS5zY2FsZSh5LnZhbHVlKGQsIHZhcmlhYmxlKSk7XHJcbiAgICAgICAgeS5heGlzPSBkMy5zdmcuYXhpcygpLnNjYWxlKHkuc2NhbGUpLm9yaWVudChjb25mLnkub3JpZW50KS50aWNrcyhwbG90LnRpY2tzKTtcclxuICAgICAgICB5LmF4aXMudGlja1NpemUoLXBsb3Quc2l6ZSAqIHBsb3QudmFyaWFibGVzLmxlbmd0aCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHVwZGF0ZSggbmV3RGF0YSkge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPXRoaXM7XHJcbiAgICAgICAgdmFyIG4gPSBzZWxmLnBsb3QudmFyaWFibGVzLmxlbmd0aDtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB2YXIgYXhpc0NsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImF4aXNcIik7XHJcbiAgICAgICAgdmFyIGF4aXNYQ2xhc3MgPSBheGlzQ2xhc3MrXCIteFwiO1xyXG4gICAgICAgIHZhciBheGlzWUNsYXNzID0gYXhpc0NsYXNzK1wiLXlcIjtcclxuXHJcbiAgICAgICAgdmFyIHhBeGlzU2VsZWN0b3IgPSBcImcuXCIrYXhpc1hDbGFzcytcIi5cIitheGlzQ2xhc3M7XHJcbiAgICAgICAgdmFyIHlBeGlzU2VsZWN0b3IgPSBcImcuXCIrYXhpc1lDbGFzcytcIi5cIitheGlzQ2xhc3M7XHJcblxyXG4gICAgICAgIHZhciBub0d1aWRlc0NsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcIm5vLWd1aWRlc1wiKTtcclxuICAgICAgICB2YXIgeEF4aXMgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKHhBeGlzU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5kYXRhKHNlbGYucGxvdC52YXJpYWJsZXMpO1xyXG5cclxuICAgICAgICB4QXhpcy5lbnRlcigpLmFwcGVuZFNlbGVjdG9yKHhBeGlzU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKG5vR3VpZGVzQ2xhc3MsICFjb25mLmd1aWRlcyk7XHJcblxyXG4gICAgICAgIHhBeGlzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwidHJhbnNsYXRlKFwiICsgKG4gLSBpIC0gMSkgKiBzZWxmLnBsb3Quc2l6ZSArIFwiLDApXCIpXHJcbiAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uKGQpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC54LnNjYWxlLmRvbWFpbihzZWxmLnBsb3QuZG9tYWluQnlWYXJpYWJsZVtkXSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXhpcyA9IGQzLnNlbGVjdCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLnRyYW5zaXRpb25FbmFibGVkKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBheGlzID0gYXhpcy50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBheGlzLmNhbGwoc2VsZi5wbG90LnguYXhpcyk7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgeEF4aXMuZXhpdCgpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICB2YXIgeUF4aXMgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKHlBeGlzU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5kYXRhKHNlbGYucGxvdC52YXJpYWJsZXMpO1xyXG4gICAgICAgIHlBeGlzLmVudGVyKCkuYXBwZW5kU2VsZWN0b3IoeUF4aXNTZWxlY3Rvcik7XHJcbiAgICAgICAgeUF4aXMuY2xhc3NlZChub0d1aWRlc0NsYXNzLCAhY29uZi5ndWlkZXMpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInRyYW5zbGF0ZSgwLFwiICsgaSAqIHNlbGYucGxvdC5zaXplICsgXCIpXCIpO1xyXG4gICAgICAgIHlBeGlzLmVhY2goZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICBzZWxmLnBsb3QueS5zY2FsZS5kb21haW4oc2VsZi5wbG90LmRvbWFpbkJ5VmFyaWFibGVbZF0pO1xyXG4gICAgICAgICAgICB2YXIgYXhpcyA9IGQzLnNlbGVjdCh0aGlzKTtcclxuICAgICAgICAgICAgaWYgKHNlbGYudHJhbnNpdGlvbkVuYWJsZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgYXhpcyA9IGF4aXMudHJhbnNpdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGF4aXMuY2FsbChzZWxmLnBsb3QueS5heGlzKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHlBeGlzLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxDbGFzcyA9ICBzZWxmLnByZWZpeENsYXNzKFwiY2VsbFwiKTtcclxuICAgICAgICB2YXIgY2VsbCA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCIuXCIrY2VsbENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShzZWxmLnV0aWxzLmNyb3NzKHNlbGYucGxvdC52YXJpYWJsZXMsIHNlbGYucGxvdC52YXJpYWJsZXMpKTtcclxuXHJcbiAgICAgICAgY2VsbC5lbnRlcigpLmFwcGVuZFNlbGVjdG9yKFwiZy5cIitjZWxsQ2xhc3MpLmZpbHRlcihkID0+IGQuaSA9PT0gZC5qKVxyXG4gICAgICAgICAgICAuYXBwZW5kKFwidGV4dFwiKTtcclxuXHJcbiAgICAgICAgY2VsbC5hdHRyKFwidHJhbnNmb3JtXCIsIGQgPT4gXCJ0cmFuc2xhdGUoXCIgKyAobiAtIGQuaSAtIDEpICogc2VsZi5wbG90LnNpemUgKyBcIixcIiArIGQuaiAqIHNlbGYucGxvdC5zaXplICsgXCIpXCIpO1xyXG5cclxuICAgICAgICBpZihjb25mLmJydXNoKXtcclxuICAgICAgICAgICAgdGhpcy5kcmF3QnJ1c2goY2VsbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjZWxsLmVhY2gocGxvdFN1YnBsb3QpO1xyXG5cclxuICAgICAgICAvL0xhYmVsc1xyXG4gICAgICAgIGNlbGwuc2VsZWN0KFwidGV4dFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgY29uZi5wYWRkaW5nKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgY29uZi5wYWRkaW5nKVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiLjcxZW1cIilcclxuICAgICAgICAgICAgLnRleHQoIGQgPT4gc2VsZi5wbG90LmxhYmVsQnlWYXJpYWJsZVtkLnhdKTtcclxuXHJcbiAgICAgICAgY2VsbC5leGl0KCkucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBsb3RTdWJwbG90KHApIHtcclxuICAgICAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgICAgIHBsb3Quc3VicGxvdHMucHVzaChwKTtcclxuICAgICAgICAgICAgdmFyIGNlbGwgPSBkMy5zZWxlY3QodGhpcyk7XHJcblxyXG4gICAgICAgICAgICBwbG90Lnguc2NhbGUuZG9tYWluKHBsb3QuZG9tYWluQnlWYXJpYWJsZVtwLnhdKTtcclxuICAgICAgICAgICAgcGxvdC55LnNjYWxlLmRvbWFpbihwbG90LmRvbWFpbkJ5VmFyaWFibGVbcC55XSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZnJhbWVDbGFzcyA9ICBzZWxmLnByZWZpeENsYXNzKFwiZnJhbWVcIik7XHJcbiAgICAgICAgICAgIGNlbGwuc2VsZWN0T3JBcHBlbmQoXCJyZWN0LlwiK2ZyYW1lQ2xhc3MpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGZyYW1lQ2xhc3MpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInhcIiwgY29uZi5wYWRkaW5nIC8gMilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieVwiLCBjb25mLnBhZGRpbmcgLyAyKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBwbG90LnNpemUgLSBjb25mLnBhZGRpbmcpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBwbG90LnNpemUgLSBjb25mLnBhZGRpbmcpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcC51cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc3VicGxvdCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGF5ZXJDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoJ2xheWVyJyk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBsYXllciA9IGNlbGwuc2VsZWN0QWxsKFwiZy5cIitsYXllckNsYXNzKS5kYXRhKHNlbGYucGxvdC5ncm91cGVkRGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGF5ZXIuZW50ZXIoKS5hcHBlbmRTZWxlY3RvcihcImcuXCIrbGF5ZXJDbGFzcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGRvdHMgPSBsYXllci5zZWxlY3RBbGwoXCJjaXJjbGVcIilcclxuICAgICAgICAgICAgICAgICAgICAuZGF0YShkPT5kLnZhbHVlcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgZG90cy5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZG90c1QgPSBkb3RzO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYudHJhbnNpdGlvbkVuYWJsZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvdHNUID0gZG90cy50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZG90c1QuYXR0cihcImN4XCIsIChkKSA9PiBwbG90LngubWFwKGQsIHN1YnBsb3QueCkpXHJcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCAoZCkgPT4gcGxvdC55Lm1hcChkLCBzdWJwbG90LnkpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiclwiLCBzZWxmLmNvbmZpZy5kb3RSYWRpdXMpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocGxvdC5zZXJpZXNDb2xvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGxheWVyLnN0eWxlKFwiZmlsbFwiLCBwbG90LnNlcmllc0NvbG9yKVxyXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYocGxvdC5jb2xvcil7XHJcbiAgICAgICAgICAgICAgICAgICAgZG90cy5zdHlsZShcImZpbGxcIiwgcGxvdC5jb2xvcilcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHBsb3QudG9vbHRpcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvdHMub24oXCJtb3VzZW92ZXJcIiwgKGQpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodG1sID0gXCIoXCIgKyBwbG90LngudmFsdWUoZCwgc3VicGxvdC54KSArIFwiLCBcIiArIHBsb3QueS52YWx1ZShkLCBzdWJwbG90LnkpICsgXCIpXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBncm91cCA9IHNlbGYuY29uZmlnLmdyb3VwcyA/IHNlbGYuY29uZmlnLmdyb3Vwcy52YWx1ZS5jYWxsKHNlbGYuY29uZmlnLCBkKSA6IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChncm91cCB8fCBncm91cCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXAgPSBwbG90Lmdyb3VwVG9MYWJlbFtncm91cF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sICs9IFwiPGJyLz5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYWJlbCA9IHNlbGYuY29uZmlnLmdyb3Vwcy5sYWJlbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsYWJlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gbGFiZWwgKyBcIjogXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sICs9IGdyb3VwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zaG93VG9vbHRpcChodG1sKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCAoZCk9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhpZGVUb29sdGlwKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGRvdHMuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgbGF5ZXIuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBwLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGRyYXdCcnVzaChjZWxsKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBicnVzaCA9IGQzLnN2Zy5icnVzaCgpXHJcbiAgICAgICAgICAgIC54KHNlbGYucGxvdC54LnNjYWxlKVxyXG4gICAgICAgICAgICAueShzZWxmLnBsb3QueS5zY2FsZSlcclxuICAgICAgICAgICAgLm9uKFwiYnJ1c2hzdGFydFwiLCBicnVzaHN0YXJ0KVxyXG4gICAgICAgICAgICAub24oXCJicnVzaFwiLCBicnVzaG1vdmUpXHJcbiAgICAgICAgICAgIC5vbihcImJydXNoZW5kXCIsIGJydXNoZW5kKTtcclxuXHJcbiAgICAgICAgc2VsZi5wbG90LmJydXNoID0gYnJ1c2g7XHJcblxyXG4gICAgICAgIGNlbGwuc2VsZWN0T3JBcHBlbmQoXCJnLmJydXNoLWNvbnRhaW5lclwiKS5jYWxsKGJydXNoKTtcclxuICAgICAgICBzZWxmLmNsZWFyQnJ1c2goKTtcclxuXHJcbiAgICAgICAgLy8gQ2xlYXIgdGhlIHByZXZpb3VzbHktYWN0aXZlIGJydXNoLCBpZiBhbnkuXHJcbiAgICAgICAgZnVuY3Rpb24gYnJ1c2hzdGFydChwKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnBsb3QuYnJ1c2hDZWxsICE9PSB0aGlzKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmNsZWFyQnJ1c2goKTtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC54LnNjYWxlLmRvbWFpbihzZWxmLnBsb3QuZG9tYWluQnlWYXJpYWJsZVtwLnhdKTtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC55LnNjYWxlLmRvbWFpbihzZWxmLnBsb3QuZG9tYWluQnlWYXJpYWJsZVtwLnldKTtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC5icnVzaENlbGwgPSB0aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBIaWdobGlnaHQgdGhlIHNlbGVjdGVkIGNpcmNsZXMuXHJcbiAgICAgICAgZnVuY3Rpb24gYnJ1c2htb3ZlKHApIHtcclxuICAgICAgICAgICAgdmFyIGUgPSBicnVzaC5leHRlbnQoKTtcclxuICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcImNpcmNsZVwiKS5jbGFzc2VkKFwiaGlkZGVuXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZVswXVswXSA+IGRbcC54XSB8fCBkW3AueF0gPiBlWzFdWzBdXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgZVswXVsxXSA+IGRbcC55XSB8fCBkW3AueV0gPiBlWzFdWzFdO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gSWYgdGhlIGJydXNoIGlzIGVtcHR5LCBzZWxlY3QgYWxsIGNpcmNsZXMuXHJcbiAgICAgICAgZnVuY3Rpb24gYnJ1c2hlbmQoKSB7XHJcbiAgICAgICAgICAgIGlmIChicnVzaC5lbXB0eSgpKSBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwiLmhpZGRlblwiKS5jbGFzc2VkKFwiaGlkZGVuXCIsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNsZWFyQnJ1c2goKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgaWYoIXNlbGYucGxvdC5icnVzaENlbGwpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGQzLnNlbGVjdChzZWxmLnBsb3QuYnJ1c2hDZWxsKS5jYWxsKHNlbGYucGxvdC5icnVzaC5jbGVhcigpKTtcclxuICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwiLmhpZGRlblwiKS5jbGFzc2VkKFwiaGlkZGVuXCIsIGZhbHNlKTtcclxuICAgICAgICBzZWxmLnBsb3QuYnJ1c2hDZWxsPW51bGw7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge0NoYXJ0V2l0aENvbG9yR3JvdXBzLCBDaGFydFdpdGhDb2xvckdyb3Vwc0NvbmZpZ30gZnJvbSBcIi4vY2hhcnQtd2l0aC1jb2xvci1ncm91cHNcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IHtMZWdlbmR9IGZyb20gXCIuL2xlZ2VuZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNjYXR0ZXJQbG90Q29uZmlnIGV4dGVuZHMgQ2hhcnRXaXRoQ29sb3JHcm91cHNDb25maWd7XHJcblxyXG4gICAgc3ZnQ2xhc3M9IHRoaXMuY3NzQ2xhc3NQcmVmaXgrJ3NjYXR0ZXJwbG90JztcclxuICAgIGd1aWRlcz0gZmFsc2U7IC8vc2hvdyBheGlzIGd1aWRlc1xyXG4gICAgc2hvd1Rvb2x0aXA9IHRydWU7IC8vc2hvdyB0b29sdGlwIG9uIGRvdCBob3ZlclxyXG5cclxuICAgIHg9ey8vIFggYXhpcyBjb25maWdcclxuICAgICAgICBsYWJlbDogJycsIC8vIGF4aXMgbGFiZWxcclxuICAgICAgICBrZXk6IDAsXHJcbiAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IGRba2V5XSwgLy8geCB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgIG9yaWVudDogXCJib3R0b21cIixcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIixcclxuICAgICAgICBkb21haW5NYXJnaW46IDAuMDVcclxuICAgIH07XHJcbiAgICB5PXsvLyBZIGF4aXMgY29uZmlnXHJcbiAgICAgICAgbGFiZWw6ICcnLCAvLyBheGlzIGxhYmVsLFxyXG4gICAgICAgIGtleTogMSxcclxuICAgICAgICB2YWx1ZTogKGQsIGtleSkgPT4gZFtrZXldLCAvLyB5IHZhbHVlIGFjY2Vzc29yXHJcbiAgICAgICAgb3JpZW50OiBcImxlZnRcIixcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIixcclxuICAgICAgICBkb21haW5NYXJnaW46IDAuMDVcclxuICAgIH07XHJcbiAgICBncm91cHM9e1xyXG4gICAgICAgIGtleTogMlxyXG4gICAgfTtcclxuICAgIGRvdFJhZGl1cyA9IDI7XHJcbiAgICB0cmFuc2l0aW9uPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcblxyXG5cclxuICAgICAgICBpZihjdXN0b20pe1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNjYXR0ZXJQbG90IGV4dGVuZHMgQ2hhcnRXaXRoQ29sb3JHcm91cHN7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBzdXBlcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBuZXcgU2NhdHRlclBsb3RDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZyl7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgU2NhdHRlclBsb3RDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKXtcclxuICAgICAgICBzdXBlci5pbml0UGxvdCgpO1xyXG4gICAgICAgIHZhciBzZWxmPXRoaXM7XHJcblxyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC54PXt9O1xyXG4gICAgICAgIHRoaXMucGxvdC55PXt9O1xyXG5cclxuICAgICAgICB0aGlzLmNvbXB1dGVQbG90U2l6ZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBYKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFkoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXBYKCl7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB4ID0gcGxvdC54O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWcueDtcclxuXHJcbiAgICAgICAgLyogKlxyXG4gICAgICAgICAqIHZhbHVlIGFjY2Vzc29yIC0gcmV0dXJucyB0aGUgdmFsdWUgdG8gZW5jb2RlIGZvciBhIGdpdmVuIGRhdGEgb2JqZWN0LlxyXG4gICAgICAgICAqIHNjYWxlIC0gbWFwcyB2YWx1ZSB0byBhIHZpc3VhbCBkaXNwbGF5IGVuY29kaW5nLCBzdWNoIGFzIGEgcGl4ZWwgcG9zaXRpb24uXHJcbiAgICAgICAgICogbWFwIGZ1bmN0aW9uIC0gbWFwcyBmcm9tIGRhdGEgdmFsdWUgdG8gZGlzcGxheSB2YWx1ZVxyXG4gICAgICAgICAqIGF4aXMgLSBzZXRzIHVwIGF4aXNcclxuICAgICAgICAgKiovXHJcbiAgICAgICAgeC52YWx1ZSA9IGQgPT4gY29uZi52YWx1ZShkLCBjb25mLmtleSk7XHJcbiAgICAgICAgeC5zY2FsZSA9IGQzLnNjYWxlW2NvbmYuc2NhbGVdKCkucmFuZ2UoWzAsIHBsb3Qud2lkdGhdKTtcclxuICAgICAgICB4Lm1hcCA9IGQgPT4geC5zY2FsZSh4LnZhbHVlKGQpKTtcclxuICAgICAgICB4LmF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHguc2NhbGUpLm9yaWVudChjb25mLm9yaWVudCk7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLnBsb3QuZ3JvdXBlZERhdGE7XHJcblxyXG5cclxuICAgICAgICB2YXIgZG9tYWluID0gW3BhcnNlRmxvYXQoZDMubWluKGRhdGEsIHM9PmQzLm1pbihzLnZhbHVlcywgcGxvdC54LnZhbHVlKSkpLCBwYXJzZUZsb2F0KGQzLm1heChkYXRhLCBzPT5kMy5tYXgocy52YWx1ZXMsIHBsb3QueC52YWx1ZSkpKV07XHJcbiAgICAgICAgdmFyIG1hcmdpbiA9IChkb21haW5bMV0tZG9tYWluWzBdKSogY29uZi5kb21haW5NYXJnaW47XHJcbiAgICAgICAgZG9tYWluWzBdLT1tYXJnaW47XHJcbiAgICAgICAgZG9tYWluWzFdKz1tYXJnaW47XHJcbiAgICAgICAgcGxvdC54LnNjYWxlLmRvbWFpbihkb21haW4pO1xyXG4gICAgICAgIGlmKHRoaXMuY29uZmlnLmd1aWRlcykge1xyXG4gICAgICAgICAgICB4LmF4aXMudGlja1NpemUoLXBsb3QuaGVpZ2h0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cFkgKCl7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB5ID0gcGxvdC55O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWcueTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB2YWx1ZSBhY2Nlc3NvciAtIHJldHVybnMgdGhlIHZhbHVlIHRvIGVuY29kZSBmb3IgYSBnaXZlbiBkYXRhIG9iamVjdC5cclxuICAgICAgICAgKiBzY2FsZSAtIG1hcHMgdmFsdWUgdG8gYSB2aXN1YWwgZGlzcGxheSBlbmNvZGluZywgc3VjaCBhcyBhIHBpeGVsIHBvc2l0aW9uLlxyXG4gICAgICAgICAqIG1hcCBmdW5jdGlvbiAtIG1hcHMgZnJvbSBkYXRhIHZhbHVlIHRvIGRpc3BsYXkgdmFsdWVcclxuICAgICAgICAgKiBheGlzIC0gc2V0cyB1cCBheGlzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgeS52YWx1ZSA9IGQgPT4gY29uZi52YWx1ZShkLCBjb25mLmtleSk7XHJcbiAgICAgICAgeS5zY2FsZSA9IGQzLnNjYWxlW2NvbmYuc2NhbGVdKCkucmFuZ2UoW3Bsb3QuaGVpZ2h0LCAwXSk7XHJcbiAgICAgICAgeS5tYXAgPSBkID0+IHkuc2NhbGUoeS52YWx1ZShkKSk7XHJcbiAgICAgICAgeS5heGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh5LnNjYWxlKS5vcmllbnQoY29uZi5vcmllbnQpO1xyXG5cclxuICAgICAgICBpZih0aGlzLmNvbmZpZy5ndWlkZXMpe1xyXG4gICAgICAgICAgICB5LmF4aXMudGlja1NpemUoLXBsb3Qud2lkdGgpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5wbG90Lmdyb3VwZWREYXRhO1xyXG5cclxuICAgICAgICB2YXIgZG9tYWluID0gW3BhcnNlRmxvYXQoZDMubWluKGRhdGEsIHM9PmQzLm1pbihzLnZhbHVlcywgcGxvdC55LnZhbHVlKSkpLCBwYXJzZUZsb2F0KGQzLm1heChkYXRhLCBzPT5kMy5tYXgocy52YWx1ZXMsIHBsb3QueS52YWx1ZSkpKV07XHJcbiAgICAgICAgdmFyIG1hcmdpbiA9IChkb21haW5bMV0tZG9tYWluWzBdKSogY29uZi5kb21haW5NYXJnaW47XHJcbiAgICAgICAgZG9tYWluWzBdLT1tYXJnaW47XHJcbiAgICAgICAgZG9tYWluWzFdKz1tYXJnaW47XHJcbiAgICAgICAgcGxvdC55LnNjYWxlLmRvbWFpbihkb21haW4pO1xyXG4gICAgICAgIC8vIHBsb3QueS5zY2FsZS5kb21haW4oW2QzLm1pbihkYXRhLCBwbG90LnkudmFsdWUpLTEsIGQzLm1heChkYXRhLCBwbG90LnkudmFsdWUpKzFdKTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhd0F4aXNYKCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBheGlzQ29uZiA9IHRoaXMuY29uZmlnLng7XHJcbiAgICAgICAgdmFyIGF4aXMgPSBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMteCcpK1wiLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMnKSsoc2VsZi5jb25maWcuZ3VpZGVzID8gJycgOiAnLicrc2VsZi5wcmVmaXhDbGFzcygnbm8tZ3VpZGVzJykpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgcGxvdC5oZWlnaHQgKyBcIilcIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGF4aXNUID0gYXhpcztcclxuICAgICAgICBpZiAoc2VsZi50cmFuc2l0aW9uRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgICAgIGF4aXNUID0gYXhpcy50cmFuc2l0aW9uKCkuZWFzZShcInNpbi1pbi1vdXRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBheGlzVC5jYWxsKHBsb3QueC5heGlzKTtcclxuICAgICAgICBcclxuICAgICAgICBheGlzLnNlbGVjdE9yQXBwZW5kKFwidGV4dC5cIitzZWxmLnByZWZpeENsYXNzKCdsYWJlbCcpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisgKHBsb3Qud2lkdGgvMikgK1wiLFwiKyAocGxvdC5tYXJnaW4uYm90dG9tKSArXCIpXCIpICAvLyB0ZXh0IGlzIGRyYXduIG9mZiB0aGUgc2NyZWVuIHRvcCBsZWZ0LCBtb3ZlIGRvd24gYW5kIG91dCBhbmQgcm90YXRlXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCItMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGF4aXNDb25mLmxhYmVsKTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhd0F4aXNZKCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBheGlzQ29uZiA9IHRoaXMuY29uZmlnLnk7XHJcbiAgICAgICAgdmFyIGF4aXMgPSBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMteScpK1wiLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMnKSsoc2VsZi5jb25maWcuZ3VpZGVzID8gJycgOiAnLicrc2VsZi5wcmVmaXhDbGFzcygnbm8tZ3VpZGVzJykpKTtcclxuXHJcbiAgICAgICAgdmFyIGF4aXNUID0gYXhpcztcclxuICAgICAgICBpZiAoc2VsZi50cmFuc2l0aW9uRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgICAgIGF4aXNUID0gYXhpcy50cmFuc2l0aW9uKCkuZWFzZShcInNpbi1pbi1vdXRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBheGlzVC5jYWxsKHBsb3QueS5heGlzKTtcclxuXHJcbiAgICAgICAgYXhpcy5zZWxlY3RPckFwcGVuZChcInRleHQuXCIrc2VsZi5wcmVmaXhDbGFzcygnbGFiZWwnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrIC1wbG90Lm1hcmdpbi5sZWZ0ICtcIixcIisocGxvdC5oZWlnaHQvMikrXCIpcm90YXRlKC05MClcIikgIC8vIHRleHQgaXMgZHJhd24gb2ZmIHRoZSBzY3JlZW4gdG9wIGxlZnQsIG1vdmUgZG93biBhbmQgb3V0IGFuZCByb3RhdGVcclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCBcIjFlbVwiKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAudGV4dChheGlzQ29uZi5sYWJlbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHVwZGF0ZShuZXdEYXRhKXtcclxuICAgICAgICBzdXBlci51cGRhdGUobmV3RGF0YSk7XHJcbiAgICAgICAgdGhpcy5kcmF3QXhpc1goKTtcclxuICAgICAgICB0aGlzLmRyYXdBeGlzWSgpO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZURvdHMoKTtcclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlRG90cygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGRhdGEgPSBwbG90LmRhdGE7XHJcbiAgICAgICAgdmFyIGxheWVyQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKCdsYXllcicpO1xyXG4gICAgICAgIHZhciBkb3RDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoJ2RvdCcpO1xyXG4gICAgICAgIHNlbGYuZG90c0NvbnRhaW5lckNsYXNzID0gc2VsZi5wcmVmaXhDbGFzcygnZG90cy1jb250YWluZXInKTtcclxuXHJcbiAgICAgICAgdmFyIGRvdHNDb250YWluZXIgPSBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiICsgc2VsZi5kb3RzQ29udGFpbmVyQ2xhc3MpO1xyXG5cclxuICAgICAgICB2YXIgbGF5ZXIgPSBkb3RzQ29udGFpbmVyLnNlbGVjdEFsbChcImcuXCIrbGF5ZXJDbGFzcykuZGF0YShwbG90Lmdyb3VwZWREYXRhKTtcclxuXHJcbiAgICAgICAgbGF5ZXIuZW50ZXIoKS5hcHBlbmRTZWxlY3RvcihcImcuXCIrbGF5ZXJDbGFzcyk7XHJcblxyXG4gICAgICAgIHZhciBkb3RzID0gbGF5ZXIuc2VsZWN0QWxsKCcuJyArIGRvdENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShkPT5kLnZhbHVlcyk7XHJcblxyXG4gICAgICAgIGRvdHMuZW50ZXIoKS5hcHBlbmQoXCJjaXJjbGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBkb3RDbGFzcyk7XHJcblxyXG4gICAgICAgIHZhciBkb3RzVCA9IGRvdHM7XHJcbiAgICAgICAgaWYgKHNlbGYudHJhbnNpdGlvbkVuYWJsZWQoKSkge1xyXG4gICAgICAgICAgICBkb3RzVCA9IGRvdHMudHJhbnNpdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG90c1QuYXR0cihcInJcIiwgc2VsZi5jb25maWcuZG90UmFkaXVzKVxyXG4gICAgICAgICAgICAuYXR0cihcImN4XCIsIHBsb3QueC5tYXApXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY3lcIiwgcGxvdC55Lm1hcCk7XHJcblxyXG4gICAgICAgIGlmIChwbG90LnRvb2x0aXApIHtcclxuICAgICAgICAgICAgZG90cy5vbihcIm1vdXNlb3ZlclwiLCBkID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBodG1sID0gXCIoXCIgKyBwbG90LngudmFsdWUoZCkgKyBcIiwgXCIgKyBwbG90LnkudmFsdWUoZCkgKyBcIilcIjtcclxuICAgICAgICAgICAgICAgIHZhciBncm91cCA9IHNlbGYuY29uZmlnLmdyb3VwcyA/ICBzZWxmLmNvbmZpZy5ncm91cHMudmFsdWUuY2FsbChzZWxmLmNvbmZpZyxkKSA6IG51bGw7XHJcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXAgfHwgZ3JvdXAgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBncm91cCA9IHBsb3QuZ3JvdXBUb0xhYmVsW2dyb3VwXTtcclxuICAgICAgICAgICAgICAgICAgICBodG1sICs9IFwiPGJyLz5cIjtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSBzZWxmLmNvbmZpZy5ncm91cHMubGFiZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhYmVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gbGFiZWwgKyBcIjogXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gZ3JvdXBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHNlbGYuc2hvd1Rvb2x0aXAoaHRtbCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCBkID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmhpZGVUb29sdGlwKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwbG90LnNlcmllc0NvbG9yKSB7XHJcbiAgICAgICAgICAgIGxheWVyLnN0eWxlKFwiZmlsbFwiLCBwbG90LnNlcmllc0NvbG9yKVxyXG4gICAgICAgIH1lbHNlIGlmKHBsb3QuY29sb3Ipe1xyXG4gICAgICAgICAgICBkb3RzLnN0eWxlKFwiZmlsbFwiLCBwbG90LmNvbG9yKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG90cy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICAgICAgbGF5ZXIuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG59XHJcbiIsIi8qXG4gKiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9iZW5yYXNtdXNlbi8xMjYxOTc3XG4gKiBOQU1FXG4gKiBcbiAqIHN0YXRpc3RpY3MtZGlzdHJpYnV0aW9ucy5qcyAtIEphdmFTY3JpcHQgbGlicmFyeSBmb3IgY2FsY3VsYXRpbmdcbiAqICAgY3JpdGljYWwgdmFsdWVzIGFuZCB1cHBlciBwcm9iYWJpbGl0aWVzIG9mIGNvbW1vbiBzdGF0aXN0aWNhbFxuICogICBkaXN0cmlidXRpb25zXG4gKiBcbiAqIFNZTk9QU0lTXG4gKiBcbiAqIFxuICogICAvLyBDaGktc3F1YXJlZC1jcml0ICgyIGRlZ3JlZXMgb2YgZnJlZWRvbSwgOTV0aCBwZXJjZW50aWxlID0gMC4wNSBsZXZlbFxuICogICBjaGlzcXJkaXN0cigyLCAuMDUpXG4gKiAgIFxuICogICAvLyB1LWNyaXQgKDk1dGggcGVyY2VudGlsZSA9IDAuMDUgbGV2ZWwpXG4gKiAgIHVkaXN0ciguMDUpO1xuICogICBcbiAqICAgLy8gdC1jcml0ICgxIGRlZ3JlZSBvZiBmcmVlZG9tLCA5OS41dGggcGVyY2VudGlsZSA9IDAuMDA1IGxldmVsKSBcbiAqICAgdGRpc3RyKDEsLjAwNSk7XG4gKiAgIFxuICogICAvLyBGLWNyaXQgKDEgZGVncmVlIG9mIGZyZWVkb20gaW4gbnVtZXJhdG9yLCAzIGRlZ3JlZXMgb2YgZnJlZWRvbSBcbiAqICAgLy8gICAgICAgICBpbiBkZW5vbWluYXRvciwgOTl0aCBwZXJjZW50aWxlID0gMC4wMSBsZXZlbClcbiAqICAgZmRpc3RyKDEsMywuMDEpO1xuICogICBcbiAqICAgLy8gdXBwZXIgcHJvYmFiaWxpdHkgb2YgdGhlIHUgZGlzdHJpYnV0aW9uICh1ID0gLTAuODUpOiBRKHUpID0gMS1HKHUpXG4gKiAgIHVwcm9iKC0wLjg1KTtcbiAqICAgXG4gKiAgIC8vIHVwcGVyIHByb2JhYmlsaXR5IG9mIHRoZSBjaGktc3F1YXJlIGRpc3RyaWJ1dGlvblxuICogICAvLyAoMyBkZWdyZWVzIG9mIGZyZWVkb20sIGNoaS1zcXVhcmVkID0gNi4yNSk6IFEgPSAxLUdcbiAqICAgY2hpc3FycHJvYigzLDYuMjUpO1xuICogICBcbiAqICAgLy8gdXBwZXIgcHJvYmFiaWxpdHkgb2YgdGhlIHQgZGlzdHJpYnV0aW9uXG4gKiAgIC8vICgzIGRlZ3JlZXMgb2YgZnJlZWRvbSwgdCA9IDYuMjUxKTogUSA9IDEtR1xuICogICB0cHJvYigzLDYuMjUxKTtcbiAqICAgXG4gKiAgIC8vIHVwcGVyIHByb2JhYmlsaXR5IG9mIHRoZSBGIGRpc3RyaWJ1dGlvblxuICogICAvLyAoMyBkZWdyZWVzIG9mIGZyZWVkb20gaW4gbnVtZXJhdG9yLCA1IGRlZ3JlZXMgb2YgZnJlZWRvbSBpblxuICogICAvLyAgZGVub21pbmF0b3IsIEYgPSA2LjI1KTogUSA9IDEtR1xuICogICBmcHJvYigzLDUsLjYyNSk7XG4gKiBcbiAqIFxuICogIERFU0NSSVBUSU9OXG4gKiBcbiAqIFRoaXMgbGlicmFyeSBjYWxjdWxhdGVzIHBlcmNlbnRhZ2UgcG9pbnRzICg1IHNpZ25pZmljYW50IGRpZ2l0cykgb2YgdGhlIHVcbiAqIChzdGFuZGFyZCBub3JtYWwpIGRpc3RyaWJ1dGlvbiwgdGhlIHN0dWRlbnQncyB0IGRpc3RyaWJ1dGlvbiwgdGhlXG4gKiBjaGktc3F1YXJlIGRpc3RyaWJ1dGlvbiBhbmQgdGhlIEYgZGlzdHJpYnV0aW9uLiBJdCBjYW4gYWxzbyBjYWxjdWxhdGUgdGhlXG4gKiB1cHBlciBwcm9iYWJpbGl0eSAoNSBzaWduaWZpY2FudCBkaWdpdHMpIG9mIHRoZSB1IChzdGFuZGFyZCBub3JtYWwpLCB0aGVcbiAqIGNoaS1zcXVhcmUsIHRoZSB0IGFuZCB0aGUgRiBkaXN0cmlidXRpb24uXG4gKiBcbiAqIFRoZXNlIGNyaXRpY2FsIHZhbHVlcyBhcmUgbmVlZGVkIHRvIHBlcmZvcm0gc3RhdGlzdGljYWwgdGVzdHMsIGxpa2UgdGhlIHVcbiAqIHRlc3QsIHRoZSB0IHRlc3QsIHRoZSBGIHRlc3QgYW5kIHRoZSBjaGktc3F1YXJlZCB0ZXN0LCBhbmQgdG8gY2FsY3VsYXRlXG4gKiBjb25maWRlbmNlIGludGVydmFscy5cbiAqIFxuICogSWYgeW91IGFyZSBpbnRlcmVzdGVkIGluIG1vcmUgcHJlY2lzZSBhbGdvcml0aG1zIHlvdSBjb3VsZCBsb29rIGF0OlxuICogICBTdGF0TGliOiBodHRwOi8vbGliLnN0YXQuY211LmVkdS9hcHN0YXQvIDsgXG4gKiAgIEFwcGxpZWQgU3RhdGlzdGljcyBBbGdvcml0aG1zIGJ5IEdyaWZmaXRocywgUC4gYW5kIEhpbGwsIEkuRC5cbiAqICAgLCBFbGxpcyBIb3J3b29kOiBDaGljaGVzdGVyICgxOTg1KVxuICogXG4gKiBCVUdTIFxuICogXG4gKiBUaGlzIHBvcnQgd2FzIHByb2R1Y2VkIGZyb20gdGhlIFBlcmwgbW9kdWxlIFN0YXRpc3RpY3M6OkRpc3RyaWJ1dGlvbnNcbiAqIHRoYXQgaGFzIGhhZCBubyBidWcgcmVwb3J0cyBpbiBzZXZlcmFsIHllYXJzLiAgSWYgeW91IGZpbmQgYSBidWcgdGhlblxuICogcGxlYXNlIGRvdWJsZS1jaGVjayB0aGF0IEphdmFTY3JpcHQgZG9lcyBub3QgdGhpbmcgdGhlIG51bWJlcnMgeW91IGFyZVxuICogcGFzc2luZyBpbiBhcmUgc3RyaW5ncy4gIChZb3UgY2FuIHN1YnRyYWN0IDAgZnJvbSB0aGVtIGFzIHlvdSBwYXNzIHRoZW1cbiAqIGluIHNvIHRoYXQgXCI1XCIgaXMgcHJvcGVybHkgdW5kZXJzdG9vZCB0byBiZSA1LikgIElmIHlvdSBoYXZlIHBhc3NlZCBpbiBhXG4gKiBudW1iZXIgdGhlbiBwbGVhc2UgY29udGFjdCB0aGUgYXV0aG9yXG4gKiBcbiAqIEFVVEhPUlxuICogXG4gKiBCZW4gVGlsbHkgPGJ0aWxseUBnbWFpbC5jb20+XG4gKiBcbiAqIE9yaWdpbmwgUGVybCB2ZXJzaW9uIGJ5IE1pY2hhZWwgS29zcGFjaCA8bWlrZS5wZXJsQGdteC5hdD5cbiAqIFxuICogTmljZSBmb3JtYXRpbmcsIHNpbXBsaWZpY2F0aW9uIGFuZCBidWcgcmVwYWlyIGJ5IE1hdHRoaWFzIFRyYXV0bmVyIEtyb21hbm5cbiAqIDxtdGtAaWQuY2JzLmRrPlxuICogXG4gKiBDT1BZUklHSFQgXG4gKiBcbiAqIENvcHlyaWdodCAyMDA4IEJlbiBUaWxseS5cbiAqIFxuICogVGhpcyBsaWJyYXJ5IGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXRcbiAqIHVuZGVyIHRoZSBzYW1lIHRlcm1zIGFzIFBlcmwgaXRzZWxmLiAgVGhpcyBtZWFucyB1bmRlciBlaXRoZXIgdGhlIFBlcmxcbiAqIEFydGlzdGljIExpY2Vuc2Ugb3IgdGhlIEdQTCB2MSBvciBsYXRlci5cbiAqL1xuXG52YXIgU0lHTklGSUNBTlQgPSA1OyAvLyBudW1iZXIgb2Ygc2lnbmlmaWNhbnQgZGlnaXRzIHRvIGJlIHJldHVybmVkXG5cbmZ1bmN0aW9uIGNoaXNxcmRpc3RyICgkbiwgJHApIHtcblx0aWYgKCRuIDw9IDAgfHwgTWF0aC5hYnMoJG4pIC0gTWF0aC5hYnMoaW50ZWdlcigkbikpICE9IDApIHtcblx0XHR0aHJvdyhcIkludmFsaWQgbjogJG5cXG5cIik7IC8qIGRlZ3JlZSBvZiBmcmVlZG9tICovXG5cdH1cblx0aWYgKCRwIDw9IDAgfHwgJHAgPiAxKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIHA6ICRwXFxuXCIpOyBcblx0fVxuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3ViY2hpc3FyKCRuLTAsICRwLTApKTtcbn1cblxuZnVuY3Rpb24gdWRpc3RyICgkcCkge1xuXHRpZiAoJHAgPiAxIHx8ICRwIDw9IDApIHtcblx0XHR0aHJvdyhcIkludmFsaWQgcDogJHBcXG5cIik7XG5cdH1cblx0cmV0dXJuIHByZWNpc2lvbl9zdHJpbmcoX3N1YnUoJHAtMCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGRpc3RyICgkbiwgJHApIHtcblx0aWYgKCRuIDw9IDAgfHwgTWF0aC5hYnMoJG4pIC0gTWF0aC5hYnMoaW50ZWdlcigkbikpICE9IDApIHtcblx0XHR0aHJvdyhcIkludmFsaWQgbjogJG5cXG5cIik7XG5cdH1cblx0aWYgKCRwIDw9IDAgfHwgJHAgPj0gMSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBwOiAkcFxcblwiKTtcblx0fVxuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3VidCgkbi0wLCAkcC0wKSk7XG59XG5cbmZ1bmN0aW9uIGZkaXN0ciAoJG4sICRtLCAkcCkge1xuXHRpZiAoKCRuPD0wKSB8fCAoKE1hdGguYWJzKCRuKS0oTWF0aC5hYnMoaW50ZWdlcigkbikpKSkhPTApKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG46ICRuXFxuXCIpOyAvKiBmaXJzdCBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9XG5cdGlmICgoJG08PTApIHx8ICgoTWF0aC5hYnMoJG0pLShNYXRoLmFicyhpbnRlZ2VyKCRtKSkpKSE9MCkpIHtcblx0XHR0aHJvdyhcIkludmFsaWQgbTogJG1cXG5cIik7IC8qIHNlY29uZCBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9XG5cdGlmICgoJHA8PTApIHx8ICgkcD4xKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBwOiAkcFxcblwiKTtcblx0fVxuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3ViZigkbi0wLCAkbS0wLCAkcC0wKSk7XG59XG5cbmZ1bmN0aW9uIHVwcm9iICgkeCkge1xuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3VidXByb2IoJHgtMCkpO1xufVxuXG5mdW5jdGlvbiBjaGlzcXJwcm9iICgkbiwkeCkge1xuXHRpZiAoKCRuIDw9IDApIHx8ICgoTWF0aC5hYnMoJG4pIC0gKE1hdGguYWJzKGludGVnZXIoJG4pKSkpICE9IDApKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG46ICRuXFxuXCIpOyAvKiBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9XG5cdHJldHVybiBwcmVjaXNpb25fc3RyaW5nKF9zdWJjaGlzcXJwcm9iKCRuLTAsICR4LTApKTtcbn1cblxuZnVuY3Rpb24gdHByb2IgKCRuLCAkeCkge1xuXHRpZiAoKCRuIDw9IDApIHx8ICgoTWF0aC5hYnMoJG4pIC0gTWF0aC5hYnMoaW50ZWdlcigkbikpKSAhPTApKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG46ICRuXFxuXCIpOyAvKiBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9XG5cdHJldHVybiBwcmVjaXNpb25fc3RyaW5nKF9zdWJ0cHJvYigkbi0wLCAkeC0wKSk7XG59XG5cbmZ1bmN0aW9uIGZwcm9iICgkbiwgJG0sICR4KSB7XG5cdGlmICgoJG48PTApIHx8ICgoTWF0aC5hYnMoJG4pLShNYXRoLmFicyhpbnRlZ2VyKCRuKSkpKSE9MCkpIHtcblx0XHR0aHJvdyhcIkludmFsaWQgbjogJG5cXG5cIik7IC8qIGZpcnN0IGRlZ3JlZSBvZiBmcmVlZG9tICovXG5cdH1cblx0aWYgKCgkbTw9MCkgfHwgKChNYXRoLmFicygkbSktKE1hdGguYWJzKGludGVnZXIoJG0pKSkpIT0wKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBtOiAkbVxcblwiKTsgLyogc2Vjb25kIGRlZ3JlZSBvZiBmcmVlZG9tICovXG5cdH0gXG5cdHJldHVybiBwcmVjaXNpb25fc3RyaW5nKF9zdWJmcHJvYigkbi0wLCAkbS0wLCAkeC0wKSk7XG59XG5cblxuZnVuY3Rpb24gX3N1YmZwcm9iICgkbiwgJG0sICR4KSB7XG5cdHZhciAkcDtcblxuXHRpZiAoJHg8PTApIHtcblx0XHQkcD0xO1xuXHR9IGVsc2UgaWYgKCRtICUgMiA9PSAwKSB7XG5cdFx0dmFyICR6ID0gJG0gLyAoJG0gKyAkbiAqICR4KTtcblx0XHR2YXIgJGEgPSAxO1xuXHRcdGZvciAodmFyICRpID0gJG0gLSAyOyAkaSA+PSAyOyAkaSAtPSAyKSB7XG5cdFx0XHQkYSA9IDEgKyAoJG4gKyAkaSAtIDIpIC8gJGkgKiAkeiAqICRhO1xuXHRcdH1cblx0XHQkcCA9IDEgLSBNYXRoLnBvdygoMSAtICR6KSwgKCRuIC8gMikgKiAkYSk7XG5cdH0gZWxzZSBpZiAoJG4gJSAyID09IDApIHtcblx0XHR2YXIgJHogPSAkbiAqICR4IC8gKCRtICsgJG4gKiAkeCk7XG5cdFx0dmFyICRhID0gMTtcblx0XHRmb3IgKHZhciAkaSA9ICRuIC0gMjsgJGkgPj0gMjsgJGkgLT0gMikge1xuXHRcdFx0JGEgPSAxICsgKCRtICsgJGkgLSAyKSAvICRpICogJHogKiAkYTtcblx0XHR9XG5cdFx0JHAgPSBNYXRoLnBvdygoMSAtICR6KSwgKCRtIC8gMikpICogJGE7XG5cdH0gZWxzZSB7XG5cdFx0dmFyICR5ID0gTWF0aC5hdGFuMihNYXRoLnNxcnQoJG4gKiAkeCAvICRtKSwgMSk7XG5cdFx0dmFyICR6ID0gTWF0aC5wb3coTWF0aC5zaW4oJHkpLCAyKTtcblx0XHR2YXIgJGEgPSAoJG4gPT0gMSkgPyAwIDogMTtcblx0XHRmb3IgKHZhciAkaSA9ICRuIC0gMjsgJGkgPj0gMzsgJGkgLT0gMikge1xuXHRcdFx0JGEgPSAxICsgKCRtICsgJGkgLSAyKSAvICRpICogJHogKiAkYTtcblx0XHR9IFxuXHRcdHZhciAkYiA9IE1hdGguUEk7XG5cdFx0Zm9yICh2YXIgJGkgPSAyOyAkaSA8PSAkbSAtIDE7ICRpICs9IDIpIHtcblx0XHRcdCRiICo9ICgkaSAtIDEpIC8gJGk7XG5cdFx0fVxuXHRcdHZhciAkcDEgPSAyIC8gJGIgKiBNYXRoLnNpbigkeSkgKiBNYXRoLnBvdyhNYXRoLmNvcygkeSksICRtKSAqICRhO1xuXG5cdFx0JHogPSBNYXRoLnBvdyhNYXRoLmNvcygkeSksIDIpO1xuXHRcdCRhID0gKCRtID09IDEpID8gMCA6IDE7XG5cdFx0Zm9yICh2YXIgJGkgPSAkbS0yOyAkaSA+PSAzOyAkaSAtPSAyKSB7XG5cdFx0XHQkYSA9IDEgKyAoJGkgLSAxKSAvICRpICogJHogKiAkYTtcblx0XHR9XG5cdFx0JHAgPSBtYXgoMCwgJHAxICsgMSAtIDIgKiAkeSAvIE1hdGguUElcblx0XHRcdC0gMiAvIE1hdGguUEkgKiBNYXRoLnNpbigkeSkgKiBNYXRoLmNvcygkeSkgKiAkYSk7XG5cdH1cblx0cmV0dXJuICRwO1xufVxuXG5cbmZ1bmN0aW9uIF9zdWJjaGlzcXJwcm9iICgkbiwkeCkge1xuXHR2YXIgJHA7XG5cblx0aWYgKCR4IDw9IDApIHtcblx0XHQkcCA9IDE7XG5cdH0gZWxzZSBpZiAoJG4gPiAxMDApIHtcblx0XHQkcCA9IF9zdWJ1cHJvYigoTWF0aC5wb3coKCR4IC8gJG4pLCAxLzMpXG5cdFx0XHRcdC0gKDEgLSAyLzkvJG4pKSAvIE1hdGguc3FydCgyLzkvJG4pKTtcblx0fSBlbHNlIGlmICgkeCA+IDQwMCkge1xuXHRcdCRwID0gMDtcblx0fSBlbHNlIHsgICBcblx0XHR2YXIgJGE7XG4gICAgICAgICAgICAgICAgdmFyICRpO1xuICAgICAgICAgICAgICAgIHZhciAkaTE7XG5cdFx0aWYgKCgkbiAlIDIpICE9IDApIHtcblx0XHRcdCRwID0gMiAqIF9zdWJ1cHJvYihNYXRoLnNxcnQoJHgpKTtcblx0XHRcdCRhID0gTWF0aC5zcXJ0KDIvTWF0aC5QSSkgKiBNYXRoLmV4cCgtJHgvMikgLyBNYXRoLnNxcnQoJHgpO1xuXHRcdFx0JGkxID0gMTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHAgPSAkYSA9IE1hdGguZXhwKC0keC8yKTtcblx0XHRcdCRpMSA9IDI7XG5cdFx0fVxuXG5cdFx0Zm9yICgkaSA9ICRpMTsgJGkgPD0gKCRuLTIpOyAkaSArPSAyKSB7XG5cdFx0XHQkYSAqPSAkeCAvICRpO1xuXHRcdFx0JHAgKz0gJGE7XG5cdFx0fVxuXHR9XG5cdHJldHVybiAkcDtcbn1cblxuZnVuY3Rpb24gX3N1YnUgKCRwKSB7XG5cdHZhciAkeSA9IC1NYXRoLmxvZyg0ICogJHAgKiAoMSAtICRwKSk7XG5cdHZhciAkeCA9IE1hdGguc3FydChcblx0XHQkeSAqICgxLjU3MDc5NjI4OFxuXHRcdCAgKyAkeSAqICguMDM3MDY5ODc5MDZcblx0XHQgIFx0KyAkeSAqICgtLjgzNjQzNTM1ODlFLTNcblx0XHRcdCAgKyAkeSAqKC0uMjI1MDk0NzE3NkUtM1xuXHRcdFx0ICBcdCsgJHkgKiAoLjY4NDEyMTgyOTlFLTVcblx0XHRcdFx0ICArICR5ICogKDAuNTgyNDIzODUxNUUtNVxuXHRcdFx0XHRcdCsgJHkgKiAoLS4xMDQ1Mjc0OTdFLTVcblx0XHRcdFx0XHQgICsgJHkgKiAoLjgzNjA5MzcwMTdFLTdcblx0XHRcdFx0XHRcdCsgJHkgKiAoLS4zMjMxMDgxMjc3RS04XG5cdFx0XHRcdFx0XHQgICsgJHkgKiAoLjM2NTc3NjMwMzZFLTEwXG5cdFx0XHRcdFx0XHRcdCsgJHkgKi42OTM2MjMzOTgyRS0xMikpKSkpKSkpKSkpO1xuXHRpZiAoJHA+LjUpXG4gICAgICAgICAgICAgICAgJHggPSAtJHg7XG5cdHJldHVybiAkeDtcbn1cblxuZnVuY3Rpb24gX3N1YnVwcm9iICgkeCkge1xuXHR2YXIgJHAgPSAwOyAvKiBpZiAoJGFic3ggPiAxMDApICovXG5cdHZhciAkYWJzeCA9IE1hdGguYWJzKCR4KTtcblxuXHRpZiAoJGFic3ggPCAxLjkpIHtcblx0XHQkcCA9IE1hdGgucG93KCgxICtcblx0XHRcdCRhYnN4ICogKC4wNDk4NjczNDdcblx0XHRcdCAgKyAkYWJzeCAqICguMDIxMTQxMDA2MVxuXHRcdFx0ICBcdCsgJGFic3ggKiAoLjAwMzI3NzYyNjNcblx0XHRcdFx0ICArICRhYnN4ICogKC4wMDAwMzgwMDM2XG5cdFx0XHRcdFx0KyAkYWJzeCAqICguMDAwMDQ4ODkwNlxuXHRcdFx0XHRcdCAgKyAkYWJzeCAqIC4wMDAwMDUzODMpKSkpKSksIC0xNikvMjtcblx0fSBlbHNlIGlmICgkYWJzeCA8PSAxMDApIHtcblx0XHRmb3IgKHZhciAkaSA9IDE4OyAkaSA+PSAxOyAkaS0tKSB7XG5cdFx0XHQkcCA9ICRpIC8gKCRhYnN4ICsgJHApO1xuXHRcdH1cblx0XHQkcCA9IE1hdGguZXhwKC0uNSAqICRhYnN4ICogJGFic3gpIFxuXHRcdFx0LyBNYXRoLnNxcnQoMiAqIE1hdGguUEkpIC8gKCRhYnN4ICsgJHApO1xuXHR9XG5cblx0aWYgKCR4PDApXG4gICAgICAgIFx0JHAgPSAxIC0gJHA7XG5cdHJldHVybiAkcDtcbn1cblxuICAgXG5mdW5jdGlvbiBfc3VidCAoJG4sICRwKSB7XG5cblx0aWYgKCRwID49IDEgfHwgJHAgPD0gMCkge1xuXHRcdHRocm93KFwiSW52YWxpZCBwOiAkcFxcblwiKTtcblx0fVxuXG5cdGlmICgkcCA9PSAwLjUpIHtcblx0XHRyZXR1cm4gMDtcblx0fSBlbHNlIGlmICgkcCA8IDAuNSkge1xuXHRcdHJldHVybiAtIF9zdWJ0KCRuLCAxIC0gJHApO1xuXHR9XG5cblx0dmFyICR1ID0gX3N1YnUoJHApO1xuXHR2YXIgJHUyID0gTWF0aC5wb3coJHUsIDIpO1xuXG5cdHZhciAkYSA9ICgkdTIgKyAxKSAvIDQ7XG5cdHZhciAkYiA9ICgoNSAqICR1MiArIDE2KSAqICR1MiArIDMpIC8gOTY7XG5cdHZhciAkYyA9ICgoKDMgKiAkdTIgKyAxOSkgKiAkdTIgKyAxNykgKiAkdTIgLSAxNSkgLyAzODQ7XG5cdHZhciAkZCA9ICgoKCg3OSAqICR1MiArIDc3NikgKiAkdTIgKyAxNDgyKSAqICR1MiAtIDE5MjApICogJHUyIC0gOTQ1KSBcblx0XHRcdFx0LyA5MjE2MDtcblx0dmFyICRlID0gKCgoKCgyNyAqICR1MiArIDMzOSkgKiAkdTIgKyA5MzApICogJHUyIC0gMTc4MikgKiAkdTIgLSA3NjUpICogJHUyXG5cdFx0XHQrIDE3OTU1KSAvIDM2ODY0MDtcblxuXHR2YXIgJHggPSAkdSAqICgxICsgKCRhICsgKCRiICsgKCRjICsgKCRkICsgJGUgLyAkbikgLyAkbikgLyAkbikgLyAkbikgLyAkbik7XG5cblx0aWYgKCRuIDw9IE1hdGgucG93KGxvZzEwKCRwKSwgMikgKyAzKSB7XG5cdFx0dmFyICRyb3VuZDtcblx0XHRkbyB7IFxuXHRcdFx0dmFyICRwMSA9IF9zdWJ0cHJvYigkbiwgJHgpO1xuXHRcdFx0dmFyICRuMSA9ICRuICsgMTtcblx0XHRcdHZhciAkZGVsdGEgPSAoJHAxIC0gJHApIFxuXHRcdFx0XHQvIE1hdGguZXhwKCgkbjEgKiBNYXRoLmxvZygkbjEgLyAoJG4gKyAkeCAqICR4KSkgXG5cdFx0XHRcdFx0KyBNYXRoLmxvZygkbi8kbjEvMi9NYXRoLlBJKSAtIDEgXG5cdFx0XHRcdFx0KyAoMS8kbjEgLSAxLyRuKSAvIDYpIC8gMik7XG5cdFx0XHQkeCArPSAkZGVsdGE7XG5cdFx0XHQkcm91bmQgPSByb3VuZF90b19wcmVjaXNpb24oJGRlbHRhLCBNYXRoLmFicyhpbnRlZ2VyKGxvZzEwKE1hdGguYWJzKCR4KSktNCkpKTtcblx0XHR9IHdoaWxlICgoJHgpICYmICgkcm91bmQgIT0gMCkpO1xuXHR9XG5cdHJldHVybiAkeDtcbn1cblxuZnVuY3Rpb24gX3N1YnRwcm9iICgkbiwgJHgpIHtcblxuXHR2YXIgJGE7XG4gICAgICAgIHZhciAkYjtcblx0dmFyICR3ID0gTWF0aC5hdGFuMigkeCAvIE1hdGguc3FydCgkbiksIDEpO1xuXHR2YXIgJHogPSBNYXRoLnBvdyhNYXRoLmNvcygkdyksIDIpO1xuXHR2YXIgJHkgPSAxO1xuXG5cdGZvciAodmFyICRpID0gJG4tMjsgJGkgPj0gMjsgJGkgLT0gMikge1xuXHRcdCR5ID0gMSArICgkaS0xKSAvICRpICogJHogKiAkeTtcblx0fSBcblxuXHRpZiAoJG4gJSAyID09IDApIHtcblx0XHQkYSA9IE1hdGguc2luKCR3KS8yO1xuXHRcdCRiID0gLjU7XG5cdH0gZWxzZSB7XG5cdFx0JGEgPSAoJG4gPT0gMSkgPyAwIDogTWF0aC5zaW4oJHcpKk1hdGguY29zKCR3KS9NYXRoLlBJO1xuXHRcdCRiPSAuNSArICR3L01hdGguUEk7XG5cdH1cblx0cmV0dXJuIG1heCgwLCAxIC0gJGIgLSAkYSAqICR5KTtcbn1cblxuZnVuY3Rpb24gX3N1YmYgKCRuLCAkbSwgJHApIHtcblx0dmFyICR4O1xuXG5cdGlmICgkcCA+PSAxIHx8ICRwIDw9IDApIHtcblx0XHR0aHJvdyhcIkludmFsaWQgcDogJHBcXG5cIik7XG5cdH1cblxuXHRpZiAoJHAgPT0gMSkge1xuXHRcdCR4ID0gMDtcblx0fSBlbHNlIGlmICgkbSA9PSAxKSB7XG5cdFx0JHggPSAxIC8gTWF0aC5wb3coX3N1YnQoJG4sIDAuNSAtICRwIC8gMiksIDIpO1xuXHR9IGVsc2UgaWYgKCRuID09IDEpIHtcblx0XHQkeCA9IE1hdGgucG93KF9zdWJ0KCRtLCAkcC8yKSwgMik7XG5cdH0gZWxzZSBpZiAoJG0gPT0gMikge1xuXHRcdHZhciAkdSA9IF9zdWJjaGlzcXIoJG0sIDEgLSAkcCk7XG5cdFx0dmFyICRhID0gJG0gLSAyO1xuXHRcdCR4ID0gMSAvICgkdSAvICRtICogKDEgK1xuXHRcdFx0KCgkdSAtICRhKSAvIDIgK1xuXHRcdFx0XHQoKCg0ICogJHUgLSAxMSAqICRhKSAqICR1ICsgJGEgKiAoNyAqICRtIC0gMTApKSAvIDI0ICtcblx0XHRcdFx0XHQoKCgyICogJHUgLSAxMCAqICRhKSAqICR1ICsgJGEgKiAoMTcgKiAkbSAtIDI2KSkgKiAkdVxuXHRcdFx0XHRcdFx0LSAkYSAqICRhICogKDkgKiAkbSAtIDYpXG5cdFx0XHRcdFx0KS80OC8kblxuXHRcdFx0XHQpLyRuXG5cdFx0XHQpLyRuKSk7XG5cdH0gZWxzZSBpZiAoJG4gPiAkbSkge1xuXHRcdCR4ID0gMSAvIF9zdWJmMigkbSwgJG4sIDEgLSAkcClcblx0fSBlbHNlIHtcblx0XHQkeCA9IF9zdWJmMigkbiwgJG0sICRwKVxuXHR9XG5cdHJldHVybiAkeDtcbn1cblxuZnVuY3Rpb24gX3N1YmYyICgkbiwgJG0sICRwKSB7XG5cdHZhciAkdSA9IF9zdWJjaGlzcXIoJG4sICRwKTtcblx0dmFyICRuMiA9ICRuIC0gMjtcblx0dmFyICR4ID0gJHUgLyAkbiAqIFxuXHRcdCgxICsgXG5cdFx0XHQoKCR1IC0gJG4yKSAvIDIgKyBcblx0XHRcdFx0KCgoNCAqICR1IC0gMTEgKiAkbjIpICogJHUgKyAkbjIgKiAoNyAqICRuIC0gMTApKSAvIDI0ICsgXG5cdFx0XHRcdFx0KCgoMiAqICR1IC0gMTAgKiAkbjIpICogJHUgKyAkbjIgKiAoMTcgKiAkbiAtIDI2KSkgKiAkdSBcblx0XHRcdFx0XHRcdC0gJG4yICogJG4yICogKDkgKiAkbiAtIDYpKSAvIDQ4IC8gJG0pIC8gJG0pIC8gJG0pO1xuXHR2YXIgJGRlbHRhO1xuXHRkbyB7XG5cdFx0dmFyICR6ID0gTWF0aC5leHAoXG5cdFx0XHQoKCRuKyRtKSAqIE1hdGgubG9nKCgkbiskbSkgLyAoJG4gKiAkeCArICRtKSkgXG5cdFx0XHRcdCsgKCRuIC0gMikgKiBNYXRoLmxvZygkeClcblx0XHRcdFx0KyBNYXRoLmxvZygkbiAqICRtIC8gKCRuKyRtKSlcblx0XHRcdFx0LSBNYXRoLmxvZyg0ICogTWF0aC5QSSlcblx0XHRcdFx0LSAoMS8kbiAgKyAxLyRtIC0gMS8oJG4rJG0pKS82XG5cdFx0XHQpLzIpO1xuXHRcdCRkZWx0YSA9IChfc3ViZnByb2IoJG4sICRtLCAkeCkgLSAkcCkgLyAkejtcblx0XHQkeCArPSAkZGVsdGE7XG5cdH0gd2hpbGUgKE1hdGguYWJzKCRkZWx0YSk+M2UtNCk7XG5cdHJldHVybiAkeDtcbn1cblxuZnVuY3Rpb24gX3N1YmNoaXNxciAoJG4sICRwKSB7XG5cdHZhciAkeDtcblxuXHRpZiAoKCRwID4gMSkgfHwgKCRwIDw9IDApKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIHA6ICRwXFxuXCIpO1xuXHR9IGVsc2UgaWYgKCRwID09IDEpe1xuXHRcdCR4ID0gMDtcblx0fSBlbHNlIGlmICgkbiA9PSAxKSB7XG5cdFx0JHggPSBNYXRoLnBvdyhfc3VidSgkcCAvIDIpLCAyKTtcblx0fSBlbHNlIGlmICgkbiA9PSAyKSB7XG5cdFx0JHggPSAtMiAqIE1hdGgubG9nKCRwKTtcblx0fSBlbHNlIHtcblx0XHR2YXIgJHUgPSBfc3VidSgkcCk7XG5cdFx0dmFyICR1MiA9ICR1ICogJHU7XG5cblx0XHQkeCA9IG1heCgwLCAkbiArIE1hdGguc3FydCgyICogJG4pICogJHUgXG5cdFx0XHQrIDIvMyAqICgkdTIgLSAxKVxuXHRcdFx0KyAkdSAqICgkdTIgLSA3KSAvIDkgLyBNYXRoLnNxcnQoMiAqICRuKVxuXHRcdFx0LSAyLzQwNSAvICRuICogKCR1MiAqICgzICokdTIgKyA3KSAtIDE2KSk7XG5cblx0XHRpZiAoJG4gPD0gMTAwKSB7XG5cdFx0XHR2YXIgJHgwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRwMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkejtcblx0XHRcdGRvIHtcblx0XHRcdFx0JHgwID0gJHg7XG5cdFx0XHRcdGlmICgkeCA8IDApIHtcblx0XHRcdFx0XHQkcDEgPSAxO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCRuPjEwMCkge1xuXHRcdFx0XHRcdCRwMSA9IF9zdWJ1cHJvYigoTWF0aC5wb3coKCR4IC8gJG4pLCAoMS8zKSkgLSAoMSAtIDIvOS8kbikpXG5cdFx0XHRcdFx0XHQvIE1hdGguc3FydCgyLzkvJG4pKTtcblx0XHRcdFx0fSBlbHNlIGlmICgkeD40MDApIHtcblx0XHRcdFx0XHQkcDEgPSAwO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhciAkaTBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgJGE7XG5cdFx0XHRcdFx0aWYgKCgkbiAlIDIpICE9IDApIHtcblx0XHRcdFx0XHRcdCRwMSA9IDIgKiBfc3VidXByb2IoTWF0aC5zcXJ0KCR4KSk7XG5cdFx0XHRcdFx0XHQkYSA9IE1hdGguc3FydCgyL01hdGguUEkpICogTWF0aC5leHAoLSR4LzIpIC8gTWF0aC5zcXJ0KCR4KTtcblx0XHRcdFx0XHRcdCRpMCA9IDE7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRwMSA9ICRhID0gTWF0aC5leHAoLSR4LzIpO1xuXHRcdFx0XHRcdFx0JGkwID0gMjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRmb3IgKHZhciAkaSA9ICRpMDsgJGkgPD0gJG4tMjsgJGkgKz0gMikge1xuXHRcdFx0XHRcdFx0JGEgKj0gJHggLyAkaTtcblx0XHRcdFx0XHRcdCRwMSArPSAkYTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0JHogPSBNYXRoLmV4cCgoKCRuLTEpICogTWF0aC5sb2coJHgvJG4pIC0gTWF0aC5sb2coNCpNYXRoLlBJKiR4KSBcblx0XHRcdFx0XHQrICRuIC0gJHggLSAxLyRuLzYpIC8gMik7XG5cdFx0XHRcdCR4ICs9ICgkcDEgLSAkcCkgLyAkejtcblx0XHRcdFx0JHggPSByb3VuZF90b19wcmVjaXNpb24oJHgsIDUpO1xuXHRcdFx0fSB3aGlsZSAoKCRuIDwgMzEpICYmIChNYXRoLmFicygkeDAgLSAkeCkgPiAxZS00KSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiAkeDtcbn1cblxuZnVuY3Rpb24gbG9nMTAgKCRuKSB7XG5cdHJldHVybiBNYXRoLmxvZygkbikgLyBNYXRoLmxvZygxMCk7XG59XG4gXG5mdW5jdGlvbiBtYXggKCkge1xuXHR2YXIgJG1heCA9IGFyZ3VtZW50c1swXTtcblx0Zm9yICh2YXIgJGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRtYXggPCBhcmd1bWVudHNbJGldKVxuICAgICAgICAgICAgICAgICAgICAgICAgJG1heCA9IGFyZ3VtZW50c1skaV07XG5cdH1cdFxuXHRyZXR1cm4gJG1heDtcbn1cblxuZnVuY3Rpb24gbWluICgpIHtcblx0dmFyICRtaW4gPSBhcmd1bWVudHNbMF07XG5cdGZvciAodmFyICRpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICgkbWluID4gYXJndW1lbnRzWyRpXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICRtaW4gPSBhcmd1bWVudHNbJGldO1xuXHR9XG5cdHJldHVybiAkbWluO1xufVxuXG5mdW5jdGlvbiBwcmVjaXNpb24gKCR4KSB7XG5cdHJldHVybiBNYXRoLmFicyhpbnRlZ2VyKGxvZzEwKE1hdGguYWJzKCR4KSkgLSBTSUdOSUZJQ0FOVCkpO1xufVxuXG5mdW5jdGlvbiBwcmVjaXNpb25fc3RyaW5nICgkeCkge1xuXHRpZiAoJHgpIHtcblx0XHRyZXR1cm4gcm91bmRfdG9fcHJlY2lzaW9uKCR4LCBwcmVjaXNpb24oJHgpKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gXCIwXCI7XG5cdH1cbn1cblxuZnVuY3Rpb24gcm91bmRfdG9fcHJlY2lzaW9uICgkeCwgJHApIHtcbiAgICAgICAgJHggPSAkeCAqIE1hdGgucG93KDEwLCAkcCk7XG4gICAgICAgICR4ID0gTWF0aC5yb3VuZCgkeCk7XG4gICAgICAgIHJldHVybiAkeCAvIE1hdGgucG93KDEwLCAkcCk7XG59XG5cbmZ1bmN0aW9uIGludGVnZXIgKCRpKSB7XG4gICAgICAgIGlmICgkaSA+IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoJGkpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbCgkaSk7XG59IiwiaW1wb3J0IHt0ZGlzdHJ9IGZyb20gXCIuL3N0YXRpc3RpY3MtZGlzdHJpYnV0aW9uc1wiXHJcblxyXG52YXIgc3UgPSBtb2R1bGUuZXhwb3J0cy5TdGF0aXN0aWNzVXRpbHMgPXt9O1xyXG5zdS5zYW1wbGVDb3JyZWxhdGlvbiA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL3NhbXBsZV9jb3JyZWxhdGlvbicpO1xyXG5zdS5saW5lYXJSZWdyZXNzaW9uID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvbGluZWFyX3JlZ3Jlc3Npb24nKTtcclxuc3UubGluZWFyUmVncmVzc2lvbkxpbmUgPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy9saW5lYXJfcmVncmVzc2lvbl9saW5lJyk7XHJcbnN1LmVycm9yRnVuY3Rpb24gPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy9lcnJvcl9mdW5jdGlvbicpO1xyXG5zdS5zdGFuZGFyZERldmlhdGlvbiA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL3N0YW5kYXJkX2RldmlhdGlvbicpO1xyXG5zdS5zYW1wbGVTdGFuZGFyZERldmlhdGlvbiA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL3NhbXBsZV9zdGFuZGFyZF9kZXZpYXRpb24nKTtcclxuc3UudmFyaWFuY2UgPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy92YXJpYW5jZScpO1xyXG5zdS5tZWFuID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvbWVhbicpO1xyXG5zdS56U2NvcmUgPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy96X3Njb3JlJyk7XHJcbnN1LnN0YW5kYXJkRXJyb3I9IGFyciA9PiBNYXRoLnNxcnQoc3UudmFyaWFuY2UoYXJyKS8oYXJyLmxlbmd0aC0xKSk7XHJcbnN1LnF1YW50aWxlID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvcXVhbnRpbGUnKTtcclxuXHJcbnN1LnRWYWx1ZT0gKGRlZ3JlZXNPZkZyZWVkb20sIGNyaXRpY2FsUHJvYmFiaWxpdHkpID0+IHsgLy9hcyBpbiBodHRwOi8vc3RhdHRyZWsuY29tL29ubGluZS1jYWxjdWxhdG9yL3QtZGlzdHJpYnV0aW9uLmFzcHhcclxuICAgIHJldHVybiB0ZGlzdHIoZGVncmVlc09mRnJlZWRvbSwgY3JpdGljYWxQcm9iYWJpbGl0eSk7XHJcbn07IiwiZXhwb3J0IGNsYXNzIFV0aWxzIHtcclxuICAgIHN0YXRpYyBTUVJUXzIgPSAxLjQxNDIxMzU2MjM3O1xyXG4gICAgLy8gdXNhZ2UgZXhhbXBsZSBkZWVwRXh0ZW5kKHt9LCBvYmpBLCBvYmpCKTsgPT4gc2hvdWxkIHdvcmsgc2ltaWxhciB0byAkLmV4dGVuZCh0cnVlLCB7fSwgb2JqQSwgb2JqQik7XHJcbiAgICBzdGF0aWMgZGVlcEV4dGVuZChvdXQpIHtcclxuXHJcbiAgICAgICAgdmFyIHV0aWxzID0gdGhpcztcclxuICAgICAgICB2YXIgZW1wdHlPdXQgPSB7fTtcclxuXHJcblxyXG4gICAgICAgIGlmICghb3V0ICYmIGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIEFycmF5LmlzQXJyYXkoYXJndW1lbnRzWzFdKSkge1xyXG4gICAgICAgICAgICBvdXQgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb3V0ID0gb3V0IHx8IHt9O1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBpZiAoIXNvdXJjZSlcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5KG91dFtrZXldKTtcclxuICAgICAgICAgICAgICAgIHZhciBpc09iamVjdCA9IHV0aWxzLmlzT2JqZWN0KG91dFtrZXldKTtcclxuICAgICAgICAgICAgICAgIHZhciBzcmNPYmogPSB1dGlscy5pc09iamVjdChzb3VyY2Vba2V5XSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlzT2JqZWN0ICYmICFpc0FycmF5ICYmIHNyY09iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWxzLmRlZXBFeHRlbmQob3V0W2tleV0sIHNvdXJjZVtrZXldKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0W2tleV0gPSBzb3VyY2Vba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIG1lcmdlRGVlcCh0YXJnZXQsIHNvdXJjZSkge1xyXG4gICAgICAgIGxldCBvdXRwdXQgPSBPYmplY3QuYXNzaWduKHt9LCB0YXJnZXQpO1xyXG4gICAgICAgIGlmIChVdGlscy5pc09iamVjdE5vdEFycmF5KHRhcmdldCkgJiYgVXRpbHMuaXNPYmplY3ROb3RBcnJheShzb3VyY2UpKSB7XHJcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKFV0aWxzLmlzT2JqZWN0Tm90QXJyYXkoc291cmNlW2tleV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoa2V5IGluIHRhcmdldCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ob3V0cHV0LCB7W2tleV06IHNvdXJjZVtrZXldfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRba2V5XSA9IFV0aWxzLm1lcmdlRGVlcCh0YXJnZXRba2V5XSwgc291cmNlW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKG91dHB1dCwge1trZXldOiBzb3VyY2Vba2V5XX0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY3Jvc3MoYSwgYikge1xyXG4gICAgICAgIHZhciBjID0gW10sIG4gPSBhLmxlbmd0aCwgbSA9IGIubGVuZ3RoLCBpLCBqO1xyXG4gICAgICAgIGZvciAoaSA9IC0xOyArK2kgPCBuOykgZm9yIChqID0gLTE7ICsraiA8IG07KSBjLnB1c2goe3g6IGFbaV0sIGk6IGksIHk6IGJbal0sIGo6IGp9KTtcclxuICAgICAgICByZXR1cm4gYztcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGluZmVyVmFyaWFibGVzKGRhdGEsIGdyb3VwS2V5LCBpbmNsdWRlR3JvdXApIHtcclxuICAgICAgICB2YXIgcmVzID0gW107XHJcbiAgICAgICAgaWYoIWRhdGEpe1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHZhciBkID0gZGF0YVswXTtcclxuICAgICAgICAgICAgaWYgKGQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgcmVzID0gZC5tYXAoZnVuY3Rpb24gKHYsIGkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkID09PSAnb2JqZWN0Jykge1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZC5oYXNPd25Qcm9wZXJ0eShwcm9wKSkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKHByb3ApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChncm91cEtleSAhPT0gbnVsbCAmJiBncm91cEtleSAhPT0gdW5kZWZpbmVkICYmICFpbmNsdWRlR3JvdXApIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gcmVzLmluZGV4T2YoZ3JvdXBLZXkpO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgcmVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgaXNPYmplY3ROb3RBcnJheShpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIChpdGVtICYmIHR5cGVvZiBpdGVtID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShpdGVtKSAmJiBpdGVtICE9PSBudWxsKTtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGlzT2JqZWN0KGEpIHtcclxuICAgICAgICByZXR1cm4gYSAhPT0gbnVsbCAmJiB0eXBlb2YgYSA9PT0gJ29iamVjdCc7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBpc051bWJlcihhKSB7XHJcbiAgICAgICAgcmV0dXJuICFpc05hTihhKSAmJiB0eXBlb2YgYSA9PT0gJ251bWJlcic7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBpc0Z1bmN0aW9uKGEpIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGEgPT09ICdmdW5jdGlvbic7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBpc0RhdGUoYSl7XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhKSA9PT0gJ1tvYmplY3QgRGF0ZV0nXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGlzU3RyaW5nKGEpe1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgYSA9PT0gJ3N0cmluZycgfHwgYSBpbnN0YW5jZW9mIFN0cmluZ1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpbnNlcnRPckFwcGVuZFNlbGVjdG9yKHBhcmVudCwgc2VsZWN0b3IsIG9wZXJhdGlvbiwgYmVmb3JlKSB7XHJcbiAgICAgICAgdmFyIHNlbGVjdG9yUGFydHMgPSBzZWxlY3Rvci5zcGxpdCgvKFtcXC5cXCNdKS8pO1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gcGFyZW50W29wZXJhdGlvbl0oc2VsZWN0b3JQYXJ0cy5zaGlmdCgpLCBiZWZvcmUpOy8vXCI6Zmlyc3QtY2hpbGRcIlxyXG4gICAgICAgIHdoaWxlIChzZWxlY3RvclBhcnRzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGVjdG9yTW9kaWZpZXIgPSBzZWxlY3RvclBhcnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxlY3Rvckl0ZW0gPSBzZWxlY3RvclBhcnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3Rvck1vZGlmaWVyID09PSBcIi5cIikge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQuY2xhc3NlZChzZWxlY3Rvckl0ZW0sIHRydWUpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNlbGVjdG9yTW9kaWZpZXIgPT09IFwiI1wiKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5hdHRyKCdpZCcsIHNlbGVjdG9ySXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGluc2VydFNlbGVjdG9yKHBhcmVudCwgc2VsZWN0b3IsIGJlZm9yZSkge1xyXG4gICAgICAgIHJldHVybiBVdGlscy5pbnNlcnRPckFwcGVuZFNlbGVjdG9yKHBhcmVudCwgc2VsZWN0b3IsIFwiaW5zZXJ0XCIsIGJlZm9yZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFwcGVuZFNlbGVjdG9yKHBhcmVudCwgc2VsZWN0b3IpIHtcclxuICAgICAgICByZXR1cm4gVXRpbHMuaW5zZXJ0T3JBcHBlbmRTZWxlY3RvcihwYXJlbnQsIHNlbGVjdG9yLCBcImFwcGVuZFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2VsZWN0T3JBcHBlbmQocGFyZW50LCBzZWxlY3RvciwgZWxlbWVudCkge1xyXG4gICAgICAgIHZhciBzZWxlY3Rpb24gPSBwYXJlbnQuc2VsZWN0KHNlbGVjdG9yKTtcclxuICAgICAgICBpZiAoc2VsZWN0aW9uLmVtcHR5KCkpIHtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJlbnQuYXBwZW5kKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBVdGlscy5hcHBlbmRTZWxlY3RvcihwYXJlbnQsIHNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzZWxlY3Rpb247XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBzZWxlY3RPckluc2VydChwYXJlbnQsIHNlbGVjdG9yLCBiZWZvcmUpIHtcclxuICAgICAgICB2YXIgc2VsZWN0aW9uID0gcGFyZW50LnNlbGVjdChzZWxlY3Rvcik7XHJcbiAgICAgICAgaWYgKHNlbGVjdGlvbi5lbXB0eSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBVdGlscy5pbnNlcnRTZWxlY3RvcihwYXJlbnQsIHNlbGVjdG9yLCBiZWZvcmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2VsZWN0aW9uO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgbGluZWFyR3JhZGllbnQoc3ZnLCBncmFkaWVudElkLCByYW5nZSwgeDEsIHkxLCB4MiwgeTIpIHtcclxuICAgICAgICB2YXIgZGVmcyA9IFV0aWxzLnNlbGVjdE9yQXBwZW5kKHN2ZywgXCJkZWZzXCIpO1xyXG4gICAgICAgIHZhciBsaW5lYXJHcmFkaWVudCA9IGRlZnMuYXBwZW5kKFwibGluZWFyR3JhZGllbnRcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBncmFkaWVudElkKTtcclxuXHJcbiAgICAgICAgbGluZWFyR3JhZGllbnRcclxuICAgICAgICAgICAgLmF0dHIoXCJ4MVwiLCB4MSArIFwiJVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInkxXCIsIHkxICsgXCIlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieDJcIiwgeDIgKyBcIiVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ5MlwiLCB5MiArIFwiJVwiKTtcclxuXHJcbiAgICAgICAgLy9BcHBlbmQgbXVsdGlwbGUgY29sb3Igc3RvcHMgYnkgdXNpbmcgRDMncyBkYXRhL2VudGVyIHN0ZXBcclxuICAgICAgICB2YXIgc3RvcHMgPSBsaW5lYXJHcmFkaWVudC5zZWxlY3RBbGwoXCJzdG9wXCIpXHJcbiAgICAgICAgICAgIC5kYXRhKHJhbmdlKTtcclxuXHJcbiAgICAgICAgc3RvcHMuZW50ZXIoKS5hcHBlbmQoXCJzdG9wXCIpO1xyXG5cclxuICAgICAgICBzdG9wcy5hdHRyKFwib2Zmc2V0XCIsIChkLCBpKSA9PiBpIC8gKHJhbmdlLmxlbmd0aCAtIDEpKVxyXG4gICAgICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgZCA9PiBkKTtcclxuXHJcbiAgICAgICAgc3RvcHMuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzYW5pdGl6ZUhlaWdodCA9IGZ1bmN0aW9uIChoZWlnaHQsIGNvbnRhaW5lcikge1xyXG4gICAgICAgIHJldHVybiAoaGVpZ2h0IHx8IHBhcnNlSW50KGNvbnRhaW5lci5zdHlsZSgnaGVpZ2h0JyksIDEwKSB8fCA0MDApO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgc2FuaXRpemVXaWR0aCA9IGZ1bmN0aW9uICh3aWR0aCwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgcmV0dXJuICh3aWR0aCB8fCBwYXJzZUludChjb250YWluZXIuc3R5bGUoJ3dpZHRoJyksIDEwKSB8fCA5NjApO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgYXZhaWxhYmxlSGVpZ2h0ID0gZnVuY3Rpb24gKGhlaWdodCwgY29udGFpbmVyLCBtYXJnaW4pIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5tYXgoMCwgVXRpbHMuc2FuaXRpemVIZWlnaHQoaGVpZ2h0LCBjb250YWluZXIpIC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b20pO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgYXZhaWxhYmxlV2lkdGggPSBmdW5jdGlvbiAod2lkdGgsIGNvbnRhaW5lciwgbWFyZ2luKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KDAsIFV0aWxzLnNhbml0aXplV2lkdGgod2lkdGgsIGNvbnRhaW5lcikgLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBndWlkKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIHM0KCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDAwMClcclxuICAgICAgICAgICAgICAgIC50b1N0cmluZygxNilcclxuICAgICAgICAgICAgICAgIC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gczQoKSArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArXHJcbiAgICAgICAgICAgIHM0KCkgKyAnLScgKyBzNCgpICsgczQoKSArIHM0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9wbGFjZXMgdGV4dFN0cmluZyBpbiB0ZXh0T2JqLCBhZGRzIGFuIGVsbGlwc2lzIGlmIHRleHQgY2FuJ3QgZml0IGluIHdpZHRoXHJcbiAgICBzdGF0aWMgcGxhY2VUZXh0V2l0aEVsbGlwc2lzKHRleHREM09iaiwgdGV4dFN0cmluZywgd2lkdGgpe1xyXG4gICAgICAgIHZhciB0ZXh0T2JqID0gdGV4dEQzT2JqLm5vZGUoKTtcclxuICAgICAgICB0ZXh0T2JqLnRleHRDb250ZW50PXRleHRTdHJpbmc7XHJcblxyXG4gICAgICAgIHZhciBtYXJnaW4gPSAwO1xyXG4gICAgICAgIHZhciBlbGxpcHNpc0xlbmd0aCA9IDk7XHJcbiAgICAgICAgLy9lbGxpcHNpcyBpcyBuZWVkZWRcclxuICAgICAgICBpZiAodGV4dE9iai5nZXRDb21wdXRlZFRleHRMZW5ndGgoKT53aWR0aCttYXJnaW4pe1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4PXRleHRTdHJpbmcubGVuZ3RoLTM7eD4wO3gtPTEpe1xyXG4gICAgICAgICAgICAgICAgaWYgKHRleHRPYmouZ2V0U3ViU3RyaW5nTGVuZ3RoKDAseCkrZWxsaXBzaXNMZW5ndGg8PXdpZHRoK21hcmdpbil7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dE9iai50ZXh0Q29udGVudD10ZXh0U3RyaW5nLnN1YnN0cmluZygwLHgpK1wiLi4uXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGV4dE9iai50ZXh0Q29udGVudD1cIi4uLlwiOyAvL2Nhbid0IHBsYWNlIGF0IGFsbFxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBwbGFjZVRleHRXaXRoRWxsaXBzaXNBbmRUb29sdGlwKHRleHREM09iaiwgdGV4dFN0cmluZywgd2lkdGgsIHRvb2x0aXApe1xyXG4gICAgICAgIHZhciBlbGxpcHNpc1BsYWNlZCA9IFV0aWxzLnBsYWNlVGV4dFdpdGhFbGxpcHNpcyh0ZXh0RDNPYmosIHRleHRTdHJpbmcsIHdpZHRoKTtcclxuICAgICAgICBpZihlbGxpcHNpc1BsYWNlZCAmJiB0b29sdGlwKXtcclxuICAgICAgICAgICAgdGV4dEQzT2JqLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICB0b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAuOSk7XHJcbiAgICAgICAgICAgICAgICB0b29sdGlwLmh0bWwodGV4dFN0cmluZylcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRleHREM09iai5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICB0b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0Rm9udFNpemUoZWxlbWVudCl7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoXCJmb250LXNpemVcIik7XHJcbiAgICB9XHJcbn1cclxuIl19
