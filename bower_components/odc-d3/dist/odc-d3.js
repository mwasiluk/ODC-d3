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

},{"./sum":15}],10:[function(require,module,exports){
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

},{"./sample_covariance":11,"./sample_standard_deviation":12}],11:[function(require,module,exports){
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

},{"./mean":9}],12:[function(require,module,exports){
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

},{"./sample_variance":13}],13:[function(require,module,exports){
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

},{"./sum_nth_power_deviations":16}],14:[function(require,module,exports){
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

},{"./variance":17}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{"./mean":9}],17:[function(require,module,exports){
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

},{"./sum_nth_power_deviations":16}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BarChart = exports.BarChartConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chart = require("./chart");

var _utils = require("./utils");

var _legend = require("./legend");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BarChartConfig = exports.BarChartConfig = function (_ChartConfig) {
    _inherits(BarChartConfig, _ChartConfig);

    // string or function returning color's value for color scale

    function BarChartConfig(custom) {
        _classCallCheck(this, BarChartConfig);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BarChartConfig).call(this));

        _this.svgClass = _this.cssClassPrefix + 'bar-chart';
        _this.showLegend = true;
        _this.showTooltip = true;
        _this.legend = {
            width: 80,
            margin: 10,
            shapeWidth: 20
        };
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
        _this.groups = {
            key: 1,
            value: function value(d) {
                return d[_this.groups.key];
            }, // grouping value accessor,
            label: ""
        };
        _this.color = undefined;
        _this.d3ColorCategory = 'category10';
        _this.transition = true;

        var config = _this;

        if (custom) {
            _utils.Utils.deepExtend(_this, custom);
        }

        return _this;
    }

    return BarChartConfig;
}(_chart.ChartConfig);

var BarChart = exports.BarChart = function (_Chart) {
    _inherits(BarChart, _Chart);

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

            this.plot.showLegend = conf.showLegend;
            if (this.plot.showLegend) {
                this.plot.margin.right = conf.margin.right + conf.legend.width + conf.legend.margin * 2;
            }

            this.computePlotSize();
            this.setupY();
            this.setupX();
            this.setupGroupStacks();

            this.setupYDomain();

            if (conf.d3ColorCategory) {
                this.plot.colorCategory = d3.scale[conf.d3ColorCategory]();
            }
            var colorValue = conf.color;
            if (colorValue && typeof colorValue === 'string' || colorValue instanceof String) {
                this.plot.color = colorValue;
            } else if (this.plot.colorCategory) {
                this.plot.color = function (d) {
                    return self.plot.colorCategory(d.key);
                };
            }

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

            var data = this.data;
            var domain;
            if (!this.config.series) {
                domain = d3.map(data, x.value).keys();
            } else {
                domain = d3.map(data[0].values, x.value).keys();
            }

            plot.x.scale.domain(domain);
            console.log(' plot.x.scale.domain', plot.x.scale.domain());
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
            var data = this.data;
            var domain;
            var yStackMax = d3.max(plot.layers, function (layer) {
                return d3.max(layer.values, function (d) {
                    return d.y0 + d.y;
                });
            });
            if (!this.config.series) {
                domain = [d3.min(data, plot.y.value), d3.max(data, plot.y.value)];
            } else {

                // var min = d3.min(data, s=>d3.min(s.values, plot.y.value));
                var max = yStackMax;
                domain = [0, max];
            }
            plot.y.scale.domain(domain);
            console.log(' plot.y.scale.domain', plot.y.scale.domain());
        }
    }, {
        key: "groupData",
        value: function groupData() {
            var self = this;
            this.plot.groupingEnabled = this.config.series;
            var data = this.data;
            if (!this.plot.groupingEnabled) {
                this.plot.groupedData = [{
                    key: 'root',
                    values: self.mapToPoints(data)
                }];
            } else {

                this.plot.groupedData = data.map(function (s) {
                    return {
                        key: s.key,
                        values: self.mapToPoints(s.values)
                    };
                });
            }
        }
    }, {
        key: "setupGroupStacks",
        value: function setupGroupStacks() {
            var self = this;
            this.groupData();

            this.plot.stack = d3.layout.stack().values(function (d) {
                return d.values;
            });
            this.plot.layers = this.plot.stack(this.plot.groupedData);
        }
    }, {
        key: "mapToPoints",
        value: function mapToPoints(values) {
            var plot = this.plot;
            return values.map(function (v) {
                return {
                    x: plot.x.value(v),
                    y: plot.y.value(v)
                };
            });
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

            console.log(plot.layers);

            var layerClass = this.prefixClass("layer");

            var barClass = this.prefixClass("bar");
            var layer = self.svgG.selectAll("." + layerClass).data(plot.layers);

            layer.enter().append("g").attr("class", layerClass);

            var bar = layer.selectAll("." + barClass).data(function (d) {
                return d.values;
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

            if (this.plot.color) {
                layerT.attr("fill", this.plot.color);
            }

            if (plot.tooltip) {
                bar.on("mouseover", function (d) {
                    plot.tooltip.transition().duration(200).style("opacity", .9);
                    plot.tooltip.html(d.y).style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");
                }).on("mouseout", function (d) {
                    plot.tooltip.transition().duration(500).style("opacity", 0);
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

            this.updateLegend();
        }
    }, {
        key: "updateLegend",
        value: function updateLegend() {
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

            var legendLinear = plot.legend.color().shapeWidth(this.config.legend.shapeWidth).orient('vertical').scale(scale);

            plot.legend.container.call(legendLinear);
        }
    }]);

    return BarChart;
}(_chart.Chart);

},{"./chart":20,"./legend":27,"./utils":33}],20:[function(require,module,exports){
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

            self.initTooltip();
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
            console.log(config.svgClass);

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
                d3.select(window).on("resize", function () {
                    //TODO add responsiveness if width/height not specified
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
    }]);

    return Chart;
}();

},{"./utils":33}],21:[function(require,module,exports){
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
                    plot.tooltip.transition().duration(200).style("opacity", .9);
                    var html = c.value;
                    plot.tooltip.html(html).style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");
                });

                mouseoutCallbacks.push(function (c) {
                    plot.tooltip.transition().duration(500).style("opacity", 0);
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

},{"./chart":20,"./legend":27,"./scatterplot":30,"./statistics-utils":32,"./utils":33}],22:[function(require,module,exports){
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

},{"./utils":33}],23:[function(require,module,exports){
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

},{"./chart":20,"./heatmap":24,"./statistics-utils":32,"./utils":33}],24:[function(require,module,exports){
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
                    plot.tooltip.transition().duration(200).style("opacity", .9);
                    var html = parentGroup.label + ": " + d.groupingValue;

                    plot.tooltip.html(html).style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");
                });

                mouseoutCallbacks.push(function (d) {
                    plot.tooltip.transition().duration(500).style("opacity", 0);
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
                    plot.tooltip.transition().duration(200).style("opacity", .9);
                    var html = c.value === undefined ? self.config.tooltip.noDataText : self.formatValueZ(c.value);

                    plot.tooltip.html(html).style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");
                });

                mouseoutCallbacks.push(function (c) {
                    plot.tooltip.transition().duration(500).style("opacity", 0);
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

},{"./chart":20,"./legend":27,"./utils":33}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Histogram = exports.HistogramConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chart = require("./chart");

var _utils = require("./utils");

var _legend = require("./legend");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HistogramConfig = exports.HistogramConfig = function (_ChartConfig) {
    _inherits(HistogramConfig, _ChartConfig);

    // string or function returning color's value for color scale

    function HistogramConfig(custom) {
        _classCallCheck(this, HistogramConfig);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HistogramConfig).call(this));

        _this.svgClass = _this.cssClassPrefix + 'histogram';
        _this.showLegend = true;
        _this.showTooltip = true;
        _this.legend = {
            width: 80,
            margin: 10,
            shapeWidth: 20
        };
        _this.x = { // X axis config
            label: '', // axis label
            key: 0,
            value: function value(d, key) {
                return _utils.Utils.isNumber(d) ? d : d[key];
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
            key: 1,
            value: function value(d) {
                return d[_this.groups.key];
            }, // grouping value accessor,
            label: ""
        };
        _this.color = undefined;
        _this.d3ColorCategory = 'category10';
        _this.transition = true;

        var config = _this;

        if (custom) {
            _utils.Utils.deepExtend(_this, custom);
        }

        return _this;
    }

    return HistogramConfig;
}(_chart.ChartConfig);

var Histogram = exports.Histogram = function (_Chart) {
    _inherits(Histogram, _Chart);

    function Histogram(placeholderSelector, data, config) {
        _classCallCheck(this, Histogram);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Histogram).call(this, placeholderSelector, data, new HistogramConfig(config)));
    }

    _createClass(Histogram, [{
        key: "setConfig",
        value: function setConfig(config) {
            return _get(Object.getPrototypeOf(Histogram.prototype), "setConfig", this).call(this, new HistogramConfig(config));
        }
    }, {
        key: "initPlot",
        value: function initPlot() {
            _get(Object.getPrototypeOf(Histogram.prototype), "initPlot", this).call(this);
            var self = this;

            var conf = this.config;

            this.plot.x = {};
            this.plot.y = {};
            this.plot.bar = {
                color: null //color scale mapping function
            };

            this.plot.showLegend = conf.showLegend;
            if (this.plot.showLegend) {
                this.plot.margin.right = conf.margin.right + conf.legend.width + conf.legend.margin * 2;
            }

            this.computePlotSize();

            this.setupX();
            this.setupHistogram();
            this.setupGroupStacks();
            this.setupY();

            if (conf.d3ColorCategory) {
                this.plot.colorCategory = d3.scale[conf.d3ColorCategory]();
            }
            var colorValue = conf.color;
            if (colorValue && typeof colorValue === 'string' || colorValue instanceof String) {
                this.plot.color = colorValue;
            } else if (this.plot.colorCategory) {
                this.plot.color = function (d) {
                    return self.plot.colorCategory(d.key);
                };
            }

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
            if (conf.ticks) {
                x.axis.ticks(conf.ticks);
            }
            var data = this.data;
            plot.x.scale.domain([d3.min(data, plot.x.value), d3.max(data, plot.x.value)]);
        }
    }, {
        key: "setupY",
        value: function setupY() {

            var plot = this.plot;
            var y = plot.y;
            var conf = this.config.y;
            y.scale = d3.scale[conf.scale]().range([plot.height, 0]);

            y.axis = d3.svg.axis().scale(y.scale).orient(conf.orient);

            var data = this.data;
            plot.y.scale.domain([0, d3.max(plot.histogramBins, function (d) {
                return d.y;
            })]);
        }
    }, {
        key: "setupHistogram",
        value: function setupHistogram() {
            var plot = this.plot;
            var x = plot.x;
            var y = plot.y;
            var ticks = this.config.x.ticks ? x.scale.ticks(this.config.x.ticks) : x.scale.ticks();

            plot.histogram = d3.layout.histogram().frequency(this.config.frequency).value(x.value).bins(ticks);
            plot.histogramBins = plot.histogram(this.data);
        }
    }, {
        key: "setupGroupStacks",
        value: function setupGroupStacks() {
            var _this3 = this;

            var self = this;
            this.plot.groupingEnabled = this.config.groups && this.config.groups.value;

            this.plot.stack = d3.layout.stack().values(function (d) {
                return d.histogramBins;
            });
            this.plot.groupedData = d3.nest().key(function (d) {
                return _this3.plot.groupingEnabled ? _this3.config.groups.value.call(_this3.config, d) : 'root';
            }).entries(this.data);
            this.plot.groupedData.forEach(function (d) {
                d.histogramBins = _this3.plot.histogram.frequency(_this3.config.frequency || _this3.plot.groupingEnabled)(d.values);
                if (!_this3.config.frequency && _this3.plot.groupingEnabled) {
                    d.histogramBins.forEach(function (b) {
                        b.dy = b.dy / _this3.data.length;
                        b.y = b.y / _this3.data.length;
                    });
                }
            });
            this.plot.stackedHistograms = this.plot.stack(this.plot.groupedData);
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
        key: "drawHistogram",
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

            barRectT.attr("width", plot.x.scale(plot.histogramBins[0].dx) - plot.x.scale(0) - 1).attr("height", function (d) {
                return plot.height - plot.y.scale(d.y);
            });

            if (this.plot.color) {
                layerT.attr("fill", this.plot.color);
            }

            if (plot.tooltip) {
                bar.on("mouseover", function (d) {
                    plot.tooltip.transition().duration(200).style("opacity", .9);
                    plot.tooltip.html(d.y).style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");
                }).on("mouseout", function (d) {
                    plot.tooltip.transition().duration(500).style("opacity", 0);
                });
            }
            layer.exit().remove();
            bar.exit().remove();
        }
    }, {
        key: "update",
        value: function update(newData) {
            _get(Object.getPrototypeOf(Histogram.prototype), "update", this).call(this, newData);
            this.drawAxisX();
            this.drawAxisY();

            this.drawHistogram();

            this.updateLegend();
        }
    }, {
        key: "updateLegend",
        value: function updateLegend() {
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

            var legendLinear = plot.legend.color().shapeWidth(this.config.legend.shapeWidth).orient('vertical').scale(scale);

            plot.legend.container.call(legendLinear);
        }
    }]);

    return Histogram;
}(_chart.Chart);

},{"./chart":20,"./legend":27,"./utils":33}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Legend = exports.StatisticsUtils = exports.BarChartConfig = exports.BarChart = exports.HistogramConfig = exports.Histogram = exports.HeatmapTimeSeriesConfig = exports.HeatmapTimeSeries = exports.HeatmapConfig = exports.Heatmap = exports.RegressionConfig = exports.Regression = exports.CorrelationMatrixConfig = exports.CorrelationMatrix = exports.ScatterPlotMatrixConfig = exports.ScatterPlotMatrix = exports.ScatterPlotConfig = exports.ScatterPlot = undefined;

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

},{"./bar-chart":19,"./correlation-matrix":21,"./d3-extensions":22,"./heatmap":24,"./heatmap-timeseries":23,"./histogram":25,"./legend":27,"./regression":28,"./scatterplot":30,"./scatterplot-matrix":29,"./statistics-utils":32}],27:[function(require,module,exports){
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

},{"../bower_components/d3-legend/no-extend":1,"./utils":33}],28:[function(require,module,exports){
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
            var groupsAvailable = self.config.groups && self.config.groups.value;

            self.plot.regressions = [];

            if (groupsAvailable && self.config.mainRegression) {
                var regression = this.initRegression(this.data, false);
                self.plot.regressions.push(regression);
            }

            if (self.config.groupRegression) {
                this.initGroupRegression();
            }
        }
    }, {
        key: "initGroupRegression",
        value: function initGroupRegression() {
            var self = this;
            var dataByGroup = {};
            self.data.forEach(function (d) {
                var groupVal = self.config.groups.value(d, self.config.groups.key);

                if (!groupVal && groupVal !== 0) {
                    return;
                }

                if (!dataByGroup[groupVal]) {
                    dataByGroup[groupVal] = [];
                }
                dataByGroup[groupVal].push(d);
            });

            for (var key in dataByGroup) {
                if (!dataByGroup.hasOwnProperty(key)) {
                    continue;
                }

                var regression = this.initRegression(dataByGroup[key], key);
                self.plot.regressions.push(regression);
            }
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

            var color = self.plot.dot.color;

            var defaultColor = "black";
            if (_utils.Utils.isFunction(color)) {
                if (values.length && groupVal !== false) {
                    color = color(values[0]);
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
            var regression = regressionContainer.selectAll(regressionSelector).data(self.plot.regressions);

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

            regressionEnterG.append("path").attr("class", confidenceAreaClass).attr("shape-rendering", "optimizeQuality").style("fill", function (r) {
                return r.color;
            }).style("opacity", "0.4");

            var area = regression.select("path." + confidenceAreaClass);

            var areaT = area;
            if (self.transitionEnabled()) {
                areaT = area.transition();
            }
            areaT.attr("d", function (r) {
                return r.confidence.area(r.confidence.points);
            });

            regression.exit().remove();
        }
    }]);

    return Regression;
}(_scatterplot.ScatterPlot);

},{"./chart":20,"./scatterplot":30,"./statistics-utils":32,"./utils":33}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ScatterPlotMatrix = exports.ScatterPlotMatrixConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chart = require("./chart");

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
        _this.size = 200;
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
            includeInPlot: false, //include group as variable in plot, boolean (default: false)
            value: function value(d, key) {
                return d[key];
            }, // grouping value accessor,
            label: ""
        };
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

var ScatterPlotMatrix = exports.ScatterPlotMatrix = function (_Chart) {
    _inherits(ScatterPlotMatrix, _Chart);

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

            this.plot.showLegend = conf.showLegend;
            if (this.plot.showLegend) {
                margin.right = conf.margin.right + conf.legend.width + conf.legend.margin * 2;
            }

            this.setupVariables();

            this.plot.size = conf.size;

            var width = conf.width;
            var boundingClientRect = this.getBaseContainerNode().getBoundingClientRect();
            if (!width) {
                var maxWidth = margin.left + margin.right + this.plot.variables.length * this.plot.size;
                width = Math.min(boundingClientRect.width, maxWidth);
            }
            var height = width;
            if (!height) {
                height = boundingClientRect.height;
            }

            this.plot.width = width - margin.left - margin.right;
            this.plot.height = height - margin.top - margin.bottom;

            if (conf.ticks === undefined) {
                conf.ticks = this.plot.size / 40;
            }

            this.setupX();
            this.setupY();

            if (conf.dot.d3ColorCategory) {
                this.plot.dot.colorCategory = d3.scale[conf.dot.d3ColorCategory]();
            }
            var colorValue = conf.dot.color;
            if (colorValue) {
                this.plot.dot.colorValue = colorValue;

                if (typeof colorValue === 'string' || colorValue instanceof String) {
                    this.plot.dot.color = colorValue;
                } else if (this.plot.dot.colorCategory) {
                    this.plot.dot.color = function (d) {
                        return self.plot.dot.colorCategory(self.plot.dot.colorValue(d));
                    };
                }
            }

            return this;
        }
    }, {
        key: "setupVariables",
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
            x.axis = d3.svg.axis().scale(x.scale).orient(conf.x.orient).ticks(conf.ticks);
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
            y.axis = d3.svg.axis().scale(y.scale).orient(conf.y.orient).ticks(conf.ticks);
            y.axis.tickSize(-plot.size * plot.variables.length);
        }
    }, {
        key: "draw",
        value: function draw() {
            var self = this;
            var n = self.plot.variables.length;
            var conf = this.config;

            var axisClass = self.prefixClass("axis");
            var axisXClass = axisClass + "-x";
            var axisYClass = axisClass + "-y";

            var xAxisSelector = "g." + axisXClass + "." + axisClass;
            var yAxisSelector = "g." + axisYClass + "." + axisClass;

            var noGuidesClass = self.prefixClass("no-guides");
            self.svgG.selectAll(xAxisSelector).data(self.plot.variables).enter().appendSelector(xAxisSelector).classed(noGuidesClass, !conf.guides).attr("transform", function (d, i) {
                return "translate(" + (n - i - 1) * self.plot.size + ",0)";
            }).each(function (d) {
                self.plot.x.scale.domain(self.plot.domainByVariable[d]);d3.select(this).call(self.plot.x.axis);
            });

            self.svgG.selectAll(yAxisSelector).data(self.plot.variables).enter().appendSelector(yAxisSelector).classed(noGuidesClass, !conf.guides).attr("transform", function (d, i) {
                return "translate(0," + i * self.plot.size + ")";
            }).each(function (d) {
                self.plot.y.scale.domain(self.plot.domainByVariable[d]);d3.select(this).call(self.plot.y.axis);
            });

            var cellClass = self.prefixClass("cell");
            var cell = self.svgG.selectAll("." + cellClass).data(self.utils.cross(self.plot.variables, self.plot.variables)).enter().appendSelector("g." + cellClass).attr("transform", function (d) {
                return "translate(" + (n - d.i - 1) * self.plot.size + "," + d.j * self.plot.size + ")";
            });

            if (conf.brush) {
                this.drawBrush(cell);
            }

            cell.each(plotSubplot);

            //Labels
            cell.filter(function (d) {
                return d.i === d.j;
            }).append("text").attr("x", conf.padding).attr("y", conf.padding).attr("dy", ".71em").text(function (d) {
                return self.plot.labelByVariable[d.x];
            });

            function plotSubplot(p) {
                var plot = self.plot;
                plot.subplots.push(p);
                var cell = d3.select(this);

                plot.x.scale.domain(plot.domainByVariable[p.x]);
                plot.y.scale.domain(plot.domainByVariable[p.y]);

                var frameClass = self.prefixClass("frame");
                cell.append("rect").attr("class", frameClass).attr("x", conf.padding / 2).attr("y", conf.padding / 2).attr("width", conf.size - conf.padding).attr("height", conf.size - conf.padding);

                p.update = function () {
                    var subplot = this;
                    var dots = cell.selectAll("circle").data(self.data);

                    dots.enter().append("circle");

                    dots.attr("cx", function (d) {
                        return plot.x.map(d, subplot.x);
                    }).attr("cy", function (d) {
                        return plot.y.map(d, subplot.y);
                    }).attr("r", self.config.dot.radius);

                    if (plot.dot.color) {
                        dots.style("fill", plot.dot.color);
                    }

                    if (plot.tooltip) {
                        dots.on("mouseover", function (d) {
                            plot.tooltip.transition().duration(200).style("opacity", .9);
                            var html = "(" + plot.x.value(d, subplot.x) + ", " + plot.y.value(d, subplot.y) + ")";
                            plot.tooltip.html(html).style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");

                            var group = self.config.groups.value(d);
                            if (group || group === 0) {
                                html += "<br/>";
                                var label = self.config.groups.label;
                                if (label) {
                                    html += label + ": ";
                                }
                                html += group;
                            }
                            plot.tooltip.html(html).style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");
                        }).on("mouseout", function (d) {
                            plot.tooltip.transition().duration(500).style("opacity", 0);
                        });
                    }

                    dots.exit().remove();
                };
                p.update();
            }

            this.updateLegend();
        }
    }, {
        key: "update",
        value: function update(data) {

            _get(Object.getPrototypeOf(ScatterPlotMatrix.prototype), "update", this).call(this, data);
            this.plot.subplots.forEach(function (p) {
                return p.update();
            });
            this.updateLegend();
        }
    }, {
        key: "drawBrush",
        value: function drawBrush(cell) {
            var self = this;
            var brush = d3.svg.brush().x(self.plot.x.scale).y(self.plot.y.scale).on("brushstart", brushstart).on("brush", brushmove).on("brushend", brushend);

            cell.append("g").call(brush);

            var brushCell;

            // Clear the previously-active brush, if any.
            function brushstart(p) {
                if (brushCell !== this) {
                    d3.select(brushCell).call(brush.clear());
                    self.plot.x.scale.domain(self.plot.domainByVariable[p.x]);
                    self.plot.y.scale.domain(self.plot.domainByVariable[p.y]);
                    brushCell = this;
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
        key: "updateLegend",
        value: function updateLegend() {

            console.log('updateLegend');
            var plot = this.plot;

            var scale = plot.dot.colorCategory;
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

            var legendLinear = plot.legend.color().shapeWidth(this.config.legend.shapeWidth).orient('vertical').scale(scale);

            plot.legend.container.call(legendLinear);
        }
    }]);

    return ScatterPlotMatrix;
}(_chart.Chart);

},{"./chart":20,"./legend":27,"./scatterplot":30,"./utils":33}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ScatterPlot = exports.ScatterPlotConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _chart = require("./chart");

var _utils = require("./utils");

var _legend = require("./legend");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScatterPlotConfig = exports.ScatterPlotConfig = function (_ChartConfig) {
    _inherits(ScatterPlotConfig, _ChartConfig);

    //show tooltip on dot hover

    function ScatterPlotConfig(custom) {
        _classCallCheck(this, ScatterPlotConfig);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ScatterPlotConfig).call(this));

        _this.svgClass = _this.cssClassPrefix + 'scatterplot';
        _this.guides = false;
        _this.showTooltip = true;
        _this.showLegend = true;
        _this.legend = {
            width: 80,
            margin: 10,
            shapeWidth: 20
        };
        _this.x = { // X axis config
            label: 'X', // axis label
            key: 0,
            value: function value(d, key) {
                return d[key];
            }, // x value accessor
            orient: "bottom",
            scale: "linear"
        };
        _this.y = { // Y axis config
            label: 'Y', // axis label,
            key: 1,
            value: function value(d, key) {
                return d[key];
            }, // y value accessor
            orient: "left",
            scale: "linear"
        };
        _this.groups = {
            key: 2,
            value: function value(d, key) {
                return d[key];
            }, // grouping value accessor,
            label: ""
        };
        _this.transition = true;

        var config = _this;
        _this.dot = {
            radius: 2,
            color: function color(d) {
                return config.groups.value(d, config.groups.key);
            }, // string or function returning color's value for color scale
            d3ColorCategory: 'category10'
        };

        if (custom) {
            _utils.Utils.deepExtend(_this, custom);
        }

        return _this;
    } //show axis guides


    return ScatterPlotConfig;
}(_chart.ChartConfig);

var ScatterPlot = exports.ScatterPlot = function (_Chart) {
    _inherits(ScatterPlot, _Chart);

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
            this.plot.dot = {
                color: null //color scale mapping function
            };

            this.plot.showLegend = conf.showLegend;
            if (this.plot.showLegend) {
                this.plot.margin.right = conf.margin.right + conf.legend.width + conf.legend.margin * 2;
            }

            this.computePlotSize();

            this.setupX();
            this.setupY();

            if (conf.dot.d3ColorCategory) {
                this.plot.dot.colorCategory = d3.scale[conf.dot.d3ColorCategory]();
            }
            var colorValue = conf.dot.color;
            if (colorValue) {
                this.plot.dot.colorValue = colorValue;

                if (typeof colorValue === 'string' || colorValue instanceof String) {
                    this.plot.dot.color = colorValue;
                } else if (this.plot.dot.colorCategory) {
                    this.plot.dot.color = function (d) {
                        return self.plot.dot.colorCategory(self.plot.dot.colorValue(d));
                    };
                }
            } else {}

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
            var data = this.data;
            plot.x.scale.domain([d3.min(data, plot.x.value) - 1, d3.max(data, plot.x.value) + 1]);
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

            var data = this.data;
            plot.y.scale.domain([d3.min(data, plot.y.value) - 1, d3.max(data, plot.y.value) + 1]);
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

            this.updateLegend();
        }
    }, {
        key: "updateDots",
        value: function updateDots() {
            var self = this;
            var plot = self.plot;
            var data = this.data;
            var dotClass = self.prefixClass('dot');
            self.dotsContainerClass = self.prefixClass('dots-container');

            var dotsContainer = self.svgG.selectOrAppend("g." + self.dotsContainerClass);

            var dots = dotsContainer.selectAll('.' + dotClass).data(data);

            dots.enter().append("circle").attr("class", dotClass);

            var dotsT = dots;
            if (self.transitionEnabled()) {
                dotsT = dots.transition();
            }

            dotsT.attr("r", self.config.dot.radius).attr("cx", plot.x.map).attr("cy", plot.y.map);

            if (plot.tooltip) {
                dots.on("mouseover", function (d) {
                    plot.tooltip.transition().duration(200).style("opacity", .9);
                    var html = "(" + plot.x.value(d) + ", " + plot.y.value(d) + ")";
                    var group = self.config.groups.value(d, self.config.groups.key);
                    if (group || group === 0) {
                        html += "<br/>";
                        var label = self.config.groups.label;
                        if (label) {
                            html += label + ": ";
                        }
                        html += group;
                    }
                    plot.tooltip.html(html).style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");
                }).on("mouseout", function (d) {
                    plot.tooltip.transition().duration(500).style("opacity", 0);
                });
            }

            if (plot.dot.color) {
                dots.style("fill", plot.dot.color);
            }

            dots.exit().remove();
        }
    }, {
        key: "updateLegend",
        value: function updateLegend() {

            var plot = this.plot;

            var scale = plot.dot.colorCategory;
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

            var legendLinear = plot.legend.color().shapeWidth(this.config.legend.shapeWidth).orient('vertical').scale(scale);

            plot.legend.container.call(legendLinear);
        }
    }]);

    return ScatterPlot;
}(_chart.Chart);

},{"./chart":20,"./legend":27,"./utils":33}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
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

su.tValue = function (degreesOfFreedom, criticalProbability) {
    //as in http://stattrek.com/online-calculator/t-distribution.aspx
    return (0, _statisticsDistributions.tdistr)(degreesOfFreedom, criticalProbability);
};

},{"../bower_components/simple-statistics/src/error_function":6,"../bower_components/simple-statistics/src/linear_regression":7,"../bower_components/simple-statistics/src/linear_regression_line":8,"../bower_components/simple-statistics/src/mean":9,"../bower_components/simple-statistics/src/sample_correlation":10,"../bower_components/simple-statistics/src/sample_standard_deviation":12,"../bower_components/simple-statistics/src/standard_deviation":14,"../bower_components/simple-statistics/src/variance":17,"../bower_components/simple-statistics/src/z_score":18,"./statistics-distributions":31}],33:[function(require,module,exports){
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
            if (!includeGroup) {
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

},{}]},{},[26])(26)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJib3dlcl9jb21wb25lbnRzXFxkMy1sZWdlbmRcXG5vLWV4dGVuZC5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxjb2xvci5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxsZWdlbmQuanMiLCJib3dlcl9jb21wb25lbnRzXFxkMy1sZWdlbmRcXHNyY1xcc2l6ZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxzeW1ib2wuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxlcnJvcl9mdW5jdGlvbi5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXGxpbmVhcl9yZWdyZXNzaW9uLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcbGluZWFyX3JlZ3Jlc3Npb25fbGluZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXG1lYW4uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfY29ycmVsYXRpb24uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfY292YXJpYW5jZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXHNhbXBsZV9zdGFuZGFyZF9kZXZpYXRpb24uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfdmFyaWFuY2UuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzdGFuZGFyZF9kZXZpYXRpb24uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzdW0uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzdW1fbnRoX3Bvd2VyX2RldmlhdGlvbnMuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFx2YXJpYW5jZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXHpfc2NvcmUuanMiLCJzcmNcXGJhci1jaGFydC5qcyIsInNyY1xcY2hhcnQuanMiLCJzcmNcXGNvcnJlbGF0aW9uLW1hdHJpeC5qcyIsInNyY1xcZDMtZXh0ZW5zaW9ucy5qcyIsInNyY1xcaGVhdG1hcC10aW1lc2VyaWVzLmpzIiwic3JjXFxoZWF0bWFwLmpzIiwic3JjXFxoaXN0b2dyYW0uanMiLCJzcmNcXGluZGV4LmpzIiwic3JjXFxsZWdlbmQuanMiLCJzcmNcXHJlZ3Jlc3Npb24uanMiLCJzcmNcXHNjYXR0ZXJwbG90LW1hdHJpeC5qcyIsInNyY1xcc2NhdHRlcnBsb3QuanMiLCJzcmNcXHN0YXRpc3RpY3MtZGlzdHJpYnV0aW9ucy5qcyIsInNyY1xcc3RhdGlzdGljcy11dGlscy5qcyIsInNyY1xcdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQjtBQUNmLFNBQU8sUUFBUSxhQUFSLENBRFE7QUFFZixRQUFNLFFBQVEsWUFBUixDQUZTO0FBR2YsVUFBUSxRQUFRLGNBQVI7QUFITyxDQUFqQjs7Ozs7QUNBQSxJQUFJLFNBQVMsUUFBUSxVQUFSLENBQWI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFlBQVU7O0FBRXpCLE1BQUksUUFBUSxHQUFHLEtBQUgsQ0FBUyxNQUFULEVBQVo7QUFBQSxNQUNFLFFBQVEsTUFEVjtBQUFBLE1BRUUsYUFBYSxFQUZmO0FBQUEsTUFHRSxjQUFjLEVBSGhCO0FBQUEsTUFJRSxjQUFjLEVBSmhCO0FBQUEsTUFLRSxlQUFlLENBTGpCO0FBQUEsTUFNRSxRQUFRLENBQUMsQ0FBRCxDQU5WO0FBQUEsTUFPRSxTQUFTLEVBUFg7QUFBQSxNQVFFLGNBQWMsRUFSaEI7QUFBQSxNQVNFLFdBQVcsS0FUYjtBQUFBLE1BVUUsUUFBUSxFQVZWO0FBQUEsTUFXRSxjQUFjLEdBQUcsTUFBSCxDQUFVLE1BQVYsQ0FYaEI7QUFBQSxNQVlFLGNBQWMsRUFaaEI7QUFBQSxNQWFFLGFBQWEsUUFiZjtBQUFBLE1BY0UsaUJBQWlCLElBZG5CO0FBQUEsTUFlRSxTQUFTLFVBZlg7QUFBQSxNQWdCRSxZQUFZLEtBaEJkO0FBQUEsTUFpQkUsSUFqQkY7QUFBQSxNQWtCRSxtQkFBbUIsR0FBRyxRQUFILENBQVksVUFBWixFQUF3QixTQUF4QixFQUFtQyxXQUFuQyxDQWxCckI7O0FBb0JFLFdBQVMsTUFBVCxDQUFnQixHQUFoQixFQUFvQjs7QUFFbEIsUUFBSSxPQUFPLE9BQU8sV0FBUCxDQUFtQixLQUFuQixFQUEwQixTQUExQixFQUFxQyxLQUFyQyxFQUE0QyxNQUE1QyxFQUFvRCxXQUFwRCxFQUFpRSxjQUFqRSxDQUFYO0FBQUEsUUFDRSxVQUFVLElBQUksU0FBSixDQUFjLEdBQWQsRUFBbUIsSUFBbkIsQ0FBd0IsQ0FBQyxLQUFELENBQXhCLENBRFo7O0FBR0EsWUFBUSxLQUFSLEdBQWdCLE1BQWhCLENBQXVCLEdBQXZCLEVBQTRCLElBQTVCLENBQWlDLE9BQWpDLEVBQTBDLGNBQWMsYUFBeEQ7O0FBR0EsUUFBSSxPQUFPLFFBQVEsU0FBUixDQUFrQixNQUFNLFdBQU4sR0FBb0IsTUFBdEMsRUFBOEMsSUFBOUMsQ0FBbUQsS0FBSyxJQUF4RCxDQUFYO0FBQUEsUUFDRSxZQUFZLEtBQUssS0FBTCxHQUFhLE1BQWIsQ0FBb0IsR0FBcEIsRUFBeUIsT0FBekIsRUFBa0MsSUFBbEMsQ0FBdUMsT0FBdkMsRUFBZ0QsY0FBYyxNQUE5RCxFQUFzRSxLQUF0RSxDQUE0RSxTQUE1RSxFQUF1RixJQUF2RixDQURkO0FBQUEsUUFFRSxhQUFhLFVBQVUsTUFBVixDQUFpQixLQUFqQixFQUF3QixJQUF4QixDQUE2QixPQUE3QixFQUFzQyxjQUFjLFFBQXBELENBRmY7QUFBQSxRQUdFLFNBQVMsS0FBSyxNQUFMLENBQVksT0FBTyxXQUFQLEdBQXFCLE9BQXJCLEdBQStCLEtBQTNDLENBSFg7OztBQU1BLFdBQU8sWUFBUCxDQUFvQixTQUFwQixFQUErQixnQkFBL0I7O0FBRUEsU0FBSyxJQUFMLEdBQVksVUFBWixHQUF5QixLQUF6QixDQUErQixTQUEvQixFQUEwQyxDQUExQyxFQUE2QyxNQUE3Qzs7QUFFQSxXQUFPLGFBQVAsQ0FBcUIsS0FBckIsRUFBNEIsTUFBNUIsRUFBb0MsV0FBcEMsRUFBaUQsVUFBakQsRUFBNkQsV0FBN0QsRUFBMEUsSUFBMUU7O0FBRUEsV0FBTyxVQUFQLENBQWtCLE9BQWxCLEVBQTJCLFNBQTNCLEVBQXNDLEtBQUssTUFBM0MsRUFBbUQsV0FBbkQ7OztBQUdBLFFBQUksT0FBTyxLQUFLLE1BQUwsQ0FBWSxNQUFaLENBQVg7QUFBQSxRQUNFLFlBQVksT0FBTyxDQUFQLEVBQVUsR0FBVixDQUFlLFVBQVMsQ0FBVCxFQUFXO0FBQUUsYUFBTyxFQUFFLE9BQUYsRUFBUDtBQUFxQixLQUFqRCxDQURkOzs7O0FBS0EsUUFBSSxDQUFDLFFBQUwsRUFBYztBQUNaLFVBQUksU0FBUyxNQUFiLEVBQW9CO0FBQ2xCLGVBQU8sS0FBUCxDQUFhLFFBQWIsRUFBdUIsS0FBSyxPQUE1QjtBQUNELE9BRkQsTUFFTztBQUNMLGVBQU8sS0FBUCxDQUFhLE1BQWIsRUFBcUIsS0FBSyxPQUExQjtBQUNEO0FBQ0YsS0FORCxNQU1PO0FBQ0wsYUFBTyxJQUFQLENBQVksT0FBWixFQUFxQixVQUFTLENBQVQsRUFBVztBQUFFLGVBQU8sY0FBYyxTQUFkLEdBQTBCLEtBQUssT0FBTCxDQUFhLENBQWIsQ0FBakM7QUFBbUQsT0FBckY7QUFDRDs7QUFFRCxRQUFJLFNBQUo7QUFBQSxRQUNBLFNBREE7QUFBQSxRQUVBLFlBQWEsY0FBYyxPQUFmLEdBQTBCLENBQTFCLEdBQStCLGNBQWMsUUFBZixHQUEyQixHQUEzQixHQUFpQyxDQUYzRTs7O0FBS0EsUUFBSSxXQUFXLFVBQWYsRUFBMEI7QUFDeEIsa0JBQVksbUJBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYztBQUFFLGVBQU8sa0JBQW1CLEtBQUssVUFBVSxDQUFWLEVBQWEsTUFBYixHQUFzQixZQUEzQixDQUFuQixHQUErRCxHQUF0RTtBQUE0RSxPQUF4RztBQUNBLGtCQUFZLG1CQUFTLENBQVQsRUFBVyxDQUFYLEVBQWM7QUFBRSxlQUFPLGdCQUFnQixVQUFVLENBQVYsRUFBYSxLQUFiLEdBQXFCLFVBQVUsQ0FBVixFQUFhLENBQWxDLEdBQ2pELFdBRGlDLElBQ2xCLEdBRGtCLElBQ1gsVUFBVSxDQUFWLEVBQWEsQ0FBYixHQUFpQixVQUFVLENBQVYsRUFBYSxNQUFiLEdBQW9CLENBQXJDLEdBQXlDLENBRDlCLElBQ21DLEdBRDFDO0FBQ2dELE9BRDVFO0FBR0QsS0FMRCxNQUtPLElBQUksV0FBVyxZQUFmLEVBQTRCO0FBQ2pDLGtCQUFZLG1CQUFTLENBQVQsRUFBVyxDQUFYLEVBQWM7QUFBRSxlQUFPLGVBQWdCLEtBQUssVUFBVSxDQUFWLEVBQWEsS0FBYixHQUFxQixZQUExQixDQUFoQixHQUEyRCxLQUFsRTtBQUEwRSxPQUF0RztBQUNBLGtCQUFZLG1CQUFTLENBQVQsRUFBVyxDQUFYLEVBQWM7QUFBRSxlQUFPLGdCQUFnQixVQUFVLENBQVYsRUFBYSxLQUFiLEdBQW1CLFNBQW5CLEdBQWdDLFVBQVUsQ0FBVixFQUFhLENBQTdELElBQ2pDLEdBRGlDLElBQzFCLFVBQVUsQ0FBVixFQUFhLE1BQWIsR0FBc0IsVUFBVSxDQUFWLEVBQWEsQ0FBbkMsR0FBdUMsV0FBdkMsR0FBcUQsQ0FEM0IsSUFDZ0MsR0FEdkM7QUFDNkMsT0FEekU7QUFFRDs7QUFFRCxXQUFPLFlBQVAsQ0FBb0IsTUFBcEIsRUFBNEIsSUFBNUIsRUFBa0MsU0FBbEMsRUFBNkMsSUFBN0MsRUFBbUQsU0FBbkQsRUFBOEQsVUFBOUQ7QUFDQSxXQUFPLFFBQVAsQ0FBZ0IsR0FBaEIsRUFBcUIsT0FBckIsRUFBOEIsS0FBOUIsRUFBcUMsV0FBckM7O0FBRUEsU0FBSyxVQUFMLEdBQWtCLEtBQWxCLENBQXdCLFNBQXhCLEVBQW1DLENBQW5DO0FBRUQ7O0FBSUgsU0FBTyxLQUFQLEdBQWUsVUFBUyxDQUFULEVBQVk7QUFDekIsUUFBSSxDQUFDLFVBQVUsTUFBZixFQUF1QixPQUFPLEtBQVA7QUFDdkIsWUFBUSxDQUFSO0FBQ0EsV0FBTyxNQUFQO0FBQ0QsR0FKRDs7QUFNQSxTQUFPLEtBQVAsR0FBZSxVQUFTLENBQVQsRUFBWTtBQUN6QixRQUFJLENBQUMsVUFBVSxNQUFmLEVBQXVCLE9BQU8sS0FBUDtBQUN2QixRQUFJLEVBQUUsTUFBRixHQUFXLENBQVgsSUFBZ0IsS0FBSyxDQUF6QixFQUE0QjtBQUMxQixjQUFRLENBQVI7QUFDRDtBQUNELFdBQU8sTUFBUDtBQUNELEdBTkQ7O0FBUUEsU0FBTyxLQUFQLEdBQWUsVUFBUyxDQUFULEVBQVksQ0FBWixFQUFlO0FBQzVCLFFBQUksQ0FBQyxVQUFVLE1BQWYsRUFBdUIsT0FBTyxLQUFQO0FBQ3ZCLFFBQUksS0FBSyxNQUFMLElBQWUsS0FBSyxRQUFwQixJQUFnQyxLQUFLLE1BQXJDLElBQWdELEtBQUssTUFBTCxJQUFnQixPQUFPLENBQVAsS0FBYSxRQUFqRixFQUE2RjtBQUMzRixjQUFRLENBQVI7QUFDQSxhQUFPLENBQVA7QUFDRDtBQUNELFdBQU8sTUFBUDtBQUNELEdBUEQ7O0FBU0EsU0FBTyxVQUFQLEdBQW9CLFVBQVMsQ0FBVCxFQUFZO0FBQzlCLFFBQUksQ0FBQyxVQUFVLE1BQWYsRUFBdUIsT0FBTyxVQUFQO0FBQ3ZCLGlCQUFhLENBQUMsQ0FBZDtBQUNBLFdBQU8sTUFBUDtBQUNELEdBSkQ7O0FBTUEsU0FBTyxXQUFQLEdBQXFCLFVBQVMsQ0FBVCxFQUFZO0FBQy9CLFFBQUksQ0FBQyxVQUFVLE1BQWYsRUFBdUIsT0FBTyxXQUFQO0FBQ3ZCLGtCQUFjLENBQUMsQ0FBZjtBQUNBLFdBQU8sTUFBUDtBQUNELEdBSkQ7O0FBTUEsU0FBTyxXQUFQLEdBQXFCLFVBQVMsQ0FBVCxFQUFZO0FBQy9CLFFBQUksQ0FBQyxVQUFVLE1BQWYsRUFBdUIsT0FBTyxXQUFQO0FBQ3ZCLGtCQUFjLENBQUMsQ0FBZjtBQUNBLFdBQU8sTUFBUDtBQUNELEdBSkQ7O0FBTUEsU0FBTyxZQUFQLEdBQXNCLFVBQVMsQ0FBVCxFQUFZO0FBQ2hDLFFBQUksQ0FBQyxVQUFVLE1BQWYsRUFBdUIsT0FBTyxZQUFQO0FBQ3ZCLG1CQUFlLENBQUMsQ0FBaEI7QUFDQSxXQUFPLE1BQVA7QUFDRCxHQUpEOztBQU1BLFNBQU8sTUFBUCxHQUFnQixVQUFTLENBQVQsRUFBWTtBQUMxQixRQUFJLENBQUMsVUFBVSxNQUFmLEVBQXVCLE9BQU8sTUFBUDtBQUN2QixhQUFTLENBQVQ7QUFDQSxXQUFPLE1BQVA7QUFDRCxHQUpEOztBQU1BLFNBQU8sVUFBUCxHQUFvQixVQUFTLENBQVQsRUFBWTtBQUM5QixRQUFJLENBQUMsVUFBVSxNQUFmLEVBQXVCLE9BQU8sVUFBUDtBQUN2QixRQUFJLEtBQUssT0FBTCxJQUFnQixLQUFLLEtBQXJCLElBQThCLEtBQUssUUFBdkMsRUFBaUQ7QUFDL0MsbUJBQWEsQ0FBYjtBQUNEO0FBQ0QsV0FBTyxNQUFQO0FBQ0QsR0FORDs7QUFRQSxTQUFPLFdBQVAsR0FBcUIsVUFBUyxDQUFULEVBQVk7QUFDL0IsUUFBSSxDQUFDLFVBQVUsTUFBZixFQUF1QixPQUFPLFdBQVA7QUFDdkIsa0JBQWMsQ0FBZDtBQUNBLFdBQU8sTUFBUDtBQUNELEdBSkQ7O0FBTUEsU0FBTyxXQUFQLEdBQXFCLFVBQVMsQ0FBVCxFQUFZO0FBQy9CLFFBQUksQ0FBQyxVQUFVLE1BQWYsRUFBdUIsT0FBTyxXQUFQO0FBQ3ZCLGtCQUFjLENBQUMsQ0FBZjtBQUNBLFdBQU8sTUFBUDtBQUNELEdBSkQ7O0FBTUEsU0FBTyxjQUFQLEdBQXdCLFVBQVMsQ0FBVCxFQUFZO0FBQ2xDLFFBQUksQ0FBQyxVQUFVLE1BQWYsRUFBdUIsT0FBTyxjQUFQO0FBQ3ZCLHFCQUFpQixDQUFqQjtBQUNBLFdBQU8sTUFBUDtBQUNELEdBSkQ7O0FBTUEsU0FBTyxRQUFQLEdBQWtCLFVBQVMsQ0FBVCxFQUFZO0FBQzVCLFFBQUksQ0FBQyxVQUFVLE1BQWYsRUFBdUIsT0FBTyxRQUFQO0FBQ3ZCLFFBQUksTUFBTSxJQUFOLElBQWMsTUFBTSxLQUF4QixFQUE4QjtBQUM1QixpQkFBVyxDQUFYO0FBQ0Q7QUFDRCxXQUFPLE1BQVA7QUFDRCxHQU5EOztBQVFBLFNBQU8sTUFBUCxHQUFnQixVQUFTLENBQVQsRUFBVztBQUN6QixRQUFJLENBQUMsVUFBVSxNQUFmLEVBQXVCLE9BQU8sTUFBUDtBQUN2QixRQUFJLEVBQUUsV0FBRixFQUFKO0FBQ0EsUUFBSSxLQUFLLFlBQUwsSUFBcUIsS0FBSyxVQUE5QixFQUEwQztBQUN4QyxlQUFTLENBQVQ7QUFDRDtBQUNELFdBQU8sTUFBUDtBQUNELEdBUEQ7O0FBU0EsU0FBTyxTQUFQLEdBQW1CLFVBQVMsQ0FBVCxFQUFZO0FBQzdCLFFBQUksQ0FBQyxVQUFVLE1BQWYsRUFBdUIsT0FBTyxTQUFQO0FBQ3ZCLGdCQUFZLENBQUMsQ0FBQyxDQUFkO0FBQ0EsV0FBTyxNQUFQO0FBQ0QsR0FKRDs7QUFNQSxTQUFPLFdBQVAsR0FBcUIsVUFBUyxDQUFULEVBQVk7QUFDL0IsUUFBSSxDQUFDLFVBQVUsTUFBZixFQUF1QixPQUFPLFdBQVA7QUFDdkIsa0JBQWMsQ0FBZDtBQUNBLFdBQU8sTUFBUDtBQUNELEdBSkQ7O0FBTUEsU0FBTyxLQUFQLEdBQWUsVUFBUyxDQUFULEVBQVk7QUFDekIsUUFBSSxDQUFDLFVBQVUsTUFBZixFQUF1QixPQUFPLEtBQVA7QUFDdkIsWUFBUSxDQUFSO0FBQ0EsV0FBTyxNQUFQO0FBQ0QsR0FKRDs7QUFNQSxLQUFHLE1BQUgsQ0FBVSxNQUFWLEVBQWtCLGdCQUFsQixFQUFvQyxJQUFwQzs7QUFFQSxTQUFPLE1BQVA7QUFFRCxDQTNNRDs7Ozs7QUNGQSxPQUFPLE9BQVAsR0FBaUI7O0FBRWYsZUFBYSxxQkFBVSxDQUFWLEVBQWE7QUFDeEIsV0FBTyxDQUFQO0FBQ0QsR0FKYzs7QUFNZixrQkFBZ0Isd0JBQVUsR0FBVixFQUFlLE1BQWYsRUFBdUI7O0FBRW5DLFFBQUcsT0FBTyxNQUFQLEtBQWtCLENBQXJCLEVBQXdCLE9BQU8sR0FBUDs7QUFFeEIsVUFBTyxHQUFELEdBQVEsR0FBUixHQUFjLEVBQXBCOztBQUVBLFFBQUksSUFBSSxPQUFPLE1BQWY7QUFDQSxXQUFPLElBQUksSUFBSSxNQUFmLEVBQXVCLEdBQXZCLEVBQTRCO0FBQzFCLGFBQU8sSUFBUCxDQUFZLElBQUksQ0FBSixDQUFaO0FBQ0Q7QUFDRCxXQUFPLE1BQVA7QUFDRCxHQWpCWTs7QUFtQmYsbUJBQWlCLHlCQUFVLEtBQVYsRUFBaUIsS0FBakIsRUFBd0IsV0FBeEIsRUFBcUM7QUFDcEQsUUFBSSxPQUFPLEVBQVg7O0FBRUEsUUFBSSxNQUFNLE1BQU4sR0FBZSxDQUFuQixFQUFxQjtBQUNuQixhQUFPLEtBQVA7QUFFRCxLQUhELE1BR087QUFDTCxVQUFJLFNBQVMsTUFBTSxNQUFOLEVBQWI7QUFBQSxVQUNBLFlBQVksQ0FBQyxPQUFPLE9BQU8sTUFBUCxHQUFnQixDQUF2QixJQUE0QixPQUFPLENBQVAsQ0FBN0IsS0FBeUMsUUFBUSxDQUFqRCxDQURaO0FBQUEsVUFFQSxJQUFJLENBRko7O0FBSUEsYUFBTyxJQUFJLEtBQVgsRUFBa0IsR0FBbEIsRUFBc0I7QUFDcEIsYUFBSyxJQUFMLENBQVUsT0FBTyxDQUFQLElBQVksSUFBRSxTQUF4QjtBQUNEO0FBQ0Y7O0FBRUQsUUFBSSxTQUFTLEtBQUssR0FBTCxDQUFTLFdBQVQsQ0FBYjs7QUFFQSxXQUFPLEVBQUMsTUFBTSxJQUFQO0FBQ0MsY0FBUSxNQURUO0FBRUMsZUFBUyxpQkFBUyxDQUFULEVBQVc7QUFBRSxlQUFPLE1BQU0sQ0FBTixDQUFQO0FBQWtCLE9BRnpDLEVBQVA7QUFHRCxHQXhDYzs7QUEwQ2Ysa0JBQWdCLHdCQUFVLEtBQVYsRUFBaUIsV0FBakIsRUFBOEIsY0FBOUIsRUFBOEM7QUFDNUQsUUFBSSxTQUFTLE1BQU0sS0FBTixHQUFjLEdBQWQsQ0FBa0IsVUFBUyxDQUFULEVBQVc7QUFDeEMsVUFBSSxTQUFTLE1BQU0sWUFBTixDQUFtQixDQUFuQixDQUFiO0FBQUEsVUFDQSxJQUFJLFlBQVksT0FBTyxDQUFQLENBQVosQ0FESjtBQUFBLFVBRUEsSUFBSSxZQUFZLE9BQU8sQ0FBUCxDQUFaLENBRko7Ozs7QUFNRSxhQUFPLFlBQVksT0FBTyxDQUFQLENBQVosSUFBeUIsR0FBekIsR0FBK0IsY0FBL0IsR0FBZ0QsR0FBaEQsR0FBc0QsWUFBWSxPQUFPLENBQVAsQ0FBWixDQUE3RDs7Ozs7QUFNSCxLQWJZLENBQWI7O0FBZUEsV0FBTyxFQUFDLE1BQU0sTUFBTSxLQUFOLEVBQVA7QUFDQyxjQUFRLE1BRFQ7QUFFQyxlQUFTLEtBQUs7QUFGZixLQUFQO0FBSUQsR0E5RGM7O0FBZ0VmLG9CQUFrQiwwQkFBVSxLQUFWLEVBQWlCO0FBQ2pDLFdBQU8sRUFBQyxNQUFNLE1BQU0sTUFBTixFQUFQO0FBQ0MsY0FBUSxNQUFNLE1BQU4sRUFEVDtBQUVDLGVBQVMsaUJBQVMsQ0FBVCxFQUFXO0FBQUUsZUFBTyxNQUFNLENBQU4sQ0FBUDtBQUFrQixPQUZ6QyxFQUFQO0FBR0QsR0FwRWM7O0FBc0VmLGlCQUFlLHVCQUFVLEtBQVYsRUFBaUIsTUFBakIsRUFBeUIsV0FBekIsRUFBc0MsVUFBdEMsRUFBa0QsV0FBbEQsRUFBK0QsSUFBL0QsRUFBcUU7QUFDbEYsUUFBSSxVQUFVLE1BQWQsRUFBcUI7QUFDakIsYUFBTyxJQUFQLENBQVksUUFBWixFQUFzQixXQUF0QixFQUFtQyxJQUFuQyxDQUF3QyxPQUF4QyxFQUFpRCxVQUFqRDtBQUVILEtBSEQsTUFHTyxJQUFJLFVBQVUsUUFBZCxFQUF3QjtBQUMzQixhQUFPLElBQVAsQ0FBWSxHQUFaLEVBQWlCLFdBQWpCLEU7QUFFSCxLQUhNLE1BR0EsSUFBSSxVQUFVLE1BQWQsRUFBc0I7QUFDekIsYUFBTyxJQUFQLENBQVksSUFBWixFQUFrQixDQUFsQixFQUFxQixJQUFyQixDQUEwQixJQUExQixFQUFnQyxVQUFoQyxFQUE0QyxJQUE1QyxDQUFpRCxJQUFqRCxFQUF1RCxDQUF2RCxFQUEwRCxJQUExRCxDQUErRCxJQUEvRCxFQUFxRSxDQUFyRTtBQUVILEtBSE0sTUFHQSxJQUFJLFVBQVUsTUFBZCxFQUFzQjtBQUMzQixhQUFPLElBQVAsQ0FBWSxHQUFaLEVBQWlCLElBQWpCO0FBQ0Q7QUFDRixHQW5GYzs7QUFxRmYsY0FBWSxvQkFBVSxHQUFWLEVBQWUsS0FBZixFQUFzQixNQUF0QixFQUE4QixXQUE5QixFQUEwQztBQUNwRCxVQUFNLE1BQU4sQ0FBYSxNQUFiLEVBQXFCLElBQXJCLENBQTBCLE9BQTFCLEVBQW1DLGNBQWMsT0FBakQ7QUFDQSxRQUFJLFNBQUosQ0FBYyxPQUFPLFdBQVAsR0FBcUIsV0FBbkMsRUFBZ0QsSUFBaEQsQ0FBcUQsTUFBckQsRUFBNkQsSUFBN0QsQ0FBa0UsS0FBSyxXQUF2RTtBQUNELEdBeEZjOztBQTBGZixlQUFhLHFCQUFVLEtBQVYsRUFBaUIsU0FBakIsRUFBNEIsS0FBNUIsRUFBbUMsTUFBbkMsRUFBMkMsV0FBM0MsRUFBd0QsY0FBeEQsRUFBdUU7QUFDbEYsUUFBSSxPQUFPLE1BQU0sS0FBTixHQUNILEtBQUssZUFBTCxDQUFxQixLQUFyQixFQUE0QixLQUE1QixFQUFtQyxXQUFuQyxDQURHLEdBQytDLE1BQU0sWUFBTixHQUNsRCxLQUFLLGNBQUwsQ0FBb0IsS0FBcEIsRUFBMkIsV0FBM0IsRUFBd0MsY0FBeEMsQ0FEa0QsR0FDUSxLQUFLLGdCQUFMLENBQXNCLEtBQXRCLENBRmxFOztBQUlBLFNBQUssTUFBTCxHQUFjLEtBQUssY0FBTCxDQUFvQixLQUFLLE1BQXpCLEVBQWlDLE1BQWpDLENBQWQ7O0FBRUEsUUFBSSxTQUFKLEVBQWU7QUFDYixXQUFLLE1BQUwsR0FBYyxLQUFLLFVBQUwsQ0FBZ0IsS0FBSyxNQUFyQixDQUFkO0FBQ0EsV0FBSyxJQUFMLEdBQVksS0FBSyxVQUFMLENBQWdCLEtBQUssSUFBckIsQ0FBWjtBQUNEOztBQUVELFdBQU8sSUFBUDtBQUNELEdBdkdjOztBQXlHZixjQUFZLG9CQUFTLEdBQVQsRUFBYztBQUN4QixRQUFJLFNBQVMsRUFBYjtBQUNBLFNBQUssSUFBSSxJQUFJLENBQVIsRUFBVyxJQUFJLElBQUksTUFBeEIsRUFBZ0MsSUFBSSxDQUFwQyxFQUF1QyxHQUF2QyxFQUE0QztBQUMxQyxhQUFPLENBQVAsSUFBWSxJQUFJLElBQUUsQ0FBRixHQUFJLENBQVIsQ0FBWjtBQUNEO0FBQ0QsV0FBTyxNQUFQO0FBQ0QsR0EvR2M7O0FBaUhmLGdCQUFjLHNCQUFVLE1BQVYsRUFBa0IsSUFBbEIsRUFBd0IsU0FBeEIsRUFBbUMsSUFBbkMsRUFBeUMsU0FBekMsRUFBb0QsVUFBcEQsRUFBZ0U7QUFDNUUsU0FBSyxJQUFMLENBQVUsV0FBVixFQUF1QixTQUF2QjtBQUNBLFNBQUssSUFBTCxDQUFVLFdBQVYsRUFBdUIsU0FBdkI7QUFDQSxRQUFJLFdBQVcsWUFBZixFQUE0QjtBQUMxQixXQUFLLEtBQUwsQ0FBVyxhQUFYLEVBQTBCLFVBQTFCO0FBQ0Q7QUFDRixHQXZIYzs7QUF5SGYsZ0JBQWMsc0JBQVMsS0FBVCxFQUFnQixVQUFoQixFQUEyQjtBQUN2QyxRQUFJLElBQUksSUFBUjs7QUFFRSxVQUFNLEVBQU4sQ0FBUyxrQkFBVCxFQUE2QixVQUFVLENBQVYsRUFBYTtBQUFFLFFBQUUsV0FBRixDQUFjLFVBQWQsRUFBMEIsQ0FBMUIsRUFBNkIsSUFBN0I7QUFBcUMsS0FBakYsRUFDSyxFQURMLENBQ1EsaUJBRFIsRUFDMkIsVUFBVSxDQUFWLEVBQWE7QUFBRSxRQUFFLFVBQUYsQ0FBYSxVQUFiLEVBQXlCLENBQXpCLEVBQTRCLElBQTVCO0FBQW9DLEtBRDlFLEVBRUssRUFGTCxDQUVRLGNBRlIsRUFFd0IsVUFBVSxDQUFWLEVBQWE7QUFBRSxRQUFFLFlBQUYsQ0FBZSxVQUFmLEVBQTJCLENBQTNCLEVBQThCLElBQTlCO0FBQXNDLEtBRjdFO0FBR0gsR0EvSGM7O0FBaUlmLGVBQWEscUJBQVMsY0FBVCxFQUF5QixDQUF6QixFQUE0QixHQUE1QixFQUFnQztBQUMzQyxtQkFBZSxRQUFmLENBQXdCLElBQXhCLENBQTZCLEdBQTdCLEVBQWtDLENBQWxDO0FBQ0QsR0FuSWM7O0FBcUlmLGNBQVksb0JBQVMsY0FBVCxFQUF5QixDQUF6QixFQUE0QixHQUE1QixFQUFnQztBQUMxQyxtQkFBZSxPQUFmLENBQXVCLElBQXZCLENBQTRCLEdBQTVCLEVBQWlDLENBQWpDO0FBQ0QsR0F2SWM7O0FBeUlmLGdCQUFjLHNCQUFTLGNBQVQsRUFBeUIsQ0FBekIsRUFBNEIsR0FBNUIsRUFBZ0M7QUFDNUMsbUJBQWUsU0FBZixDQUF5QixJQUF6QixDQUE4QixHQUE5QixFQUFtQyxDQUFuQztBQUNELEdBM0ljOztBQTZJZixZQUFVLGtCQUFTLEdBQVQsRUFBYyxRQUFkLEVBQXdCLEtBQXhCLEVBQStCLFdBQS9CLEVBQTJDO0FBQ25ELFFBQUksVUFBVSxFQUFkLEVBQWlCOztBQUVmLFVBQUksWUFBWSxJQUFJLFNBQUosQ0FBYyxVQUFVLFdBQVYsR0FBd0IsYUFBdEMsQ0FBaEI7O0FBRUEsZ0JBQVUsSUFBVixDQUFlLENBQUMsS0FBRCxDQUFmLEVBQ0csS0FESCxHQUVHLE1BRkgsQ0FFVSxNQUZWLEVBR0csSUFISCxDQUdRLE9BSFIsRUFHaUIsY0FBYyxhQUgvQjs7QUFLRSxVQUFJLFNBQUosQ0FBYyxVQUFVLFdBQVYsR0FBd0IsYUFBdEMsRUFDSyxJQURMLENBQ1UsS0FEVjs7QUFHRixVQUFJLFVBQVUsSUFBSSxNQUFKLENBQVcsTUFBTSxXQUFOLEdBQW9CLGFBQS9CLEVBQ1QsR0FEUyxDQUNMLFVBQVMsQ0FBVCxFQUFZO0FBQUUsZUFBTyxFQUFFLENBQUYsRUFBSyxPQUFMLEdBQWUsTUFBdEI7QUFBNkIsT0FEdEMsRUFDd0MsQ0FEeEMsQ0FBZDtBQUFBLFVBRUEsVUFBVSxDQUFDLFNBQVMsR0FBVCxDQUFhLFVBQVMsQ0FBVCxFQUFZO0FBQUUsZUFBTyxFQUFFLENBQUYsRUFBSyxPQUFMLEdBQWUsQ0FBdEI7QUFBd0IsT0FBbkQsRUFBcUQsQ0FBckQsQ0FGWDs7QUFJQSxlQUFTLElBQVQsQ0FBYyxXQUFkLEVBQTJCLGVBQWUsT0FBZixHQUF5QixHQUF6QixJQUFnQyxVQUFVLEVBQTFDLElBQWdELEdBQTNFO0FBRUQ7QUFDRjtBQWpLYyxDQUFqQjs7Ozs7QUNBQSxJQUFJLFNBQVMsUUFBUSxVQUFSLENBQWI7O0FBRUEsT0FBTyxPQUFQLEdBQWtCLFlBQVU7O0FBRTFCLE1BQUksUUFBUSxHQUFHLEtBQUgsQ0FBUyxNQUFULEVBQVo7QUFBQSxNQUNFLFFBQVEsTUFEVjtBQUFBLE1BRUUsYUFBYSxFQUZmO0FBQUEsTUFHRSxlQUFlLENBSGpCO0FBQUEsTUFJRSxRQUFRLENBQUMsQ0FBRCxDQUpWO0FBQUEsTUFLRSxTQUFTLEVBTFg7QUFBQSxNQU1FLFlBQVksS0FOZDtBQUFBLE1BT0UsY0FBYyxFQVBoQjtBQUFBLE1BUUUsUUFBUSxFQVJWO0FBQUEsTUFTRSxjQUFjLEdBQUcsTUFBSCxDQUFVLE1BQVYsQ0FUaEI7QUFBQSxNQVVFLGNBQWMsRUFWaEI7QUFBQSxNQVdFLGFBQWEsUUFYZjtBQUFBLE1BWUUsaUJBQWlCLElBWm5CO0FBQUEsTUFhRSxTQUFTLFVBYlg7QUFBQSxNQWNFLFlBQVksS0FkZDtBQUFBLE1BZUUsSUFmRjtBQUFBLE1BZ0JFLG1CQUFtQixHQUFHLFFBQUgsQ0FBWSxVQUFaLEVBQXdCLFNBQXhCLEVBQW1DLFdBQW5DLENBaEJyQjs7QUFrQkUsV0FBUyxNQUFULENBQWdCLEdBQWhCLEVBQW9COztBQUVsQixRQUFJLE9BQU8sT0FBTyxXQUFQLENBQW1CLEtBQW5CLEVBQTBCLFNBQTFCLEVBQXFDLEtBQXJDLEVBQTRDLE1BQTVDLEVBQW9ELFdBQXBELEVBQWlFLGNBQWpFLENBQVg7QUFBQSxRQUNFLFVBQVUsSUFBSSxTQUFKLENBQWMsR0FBZCxFQUFtQixJQUFuQixDQUF3QixDQUFDLEtBQUQsQ0FBeEIsQ0FEWjs7QUFHQSxZQUFRLEtBQVIsR0FBZ0IsTUFBaEIsQ0FBdUIsR0FBdkIsRUFBNEIsSUFBNUIsQ0FBaUMsT0FBakMsRUFBMEMsY0FBYyxhQUF4RDs7QUFHQSxRQUFJLE9BQU8sUUFBUSxTQUFSLENBQWtCLE1BQU0sV0FBTixHQUFvQixNQUF0QyxFQUE4QyxJQUE5QyxDQUFtRCxLQUFLLElBQXhELENBQVg7QUFBQSxRQUNFLFlBQVksS0FBSyxLQUFMLEdBQWEsTUFBYixDQUFvQixHQUFwQixFQUF5QixPQUF6QixFQUFrQyxJQUFsQyxDQUF1QyxPQUF2QyxFQUFnRCxjQUFjLE1BQTlELEVBQXNFLEtBQXRFLENBQTRFLFNBQTVFLEVBQXVGLElBQXZGLENBRGQ7QUFBQSxRQUVFLGFBQWEsVUFBVSxNQUFWLENBQWlCLEtBQWpCLEVBQXdCLElBQXhCLENBQTZCLE9BQTdCLEVBQXNDLGNBQWMsUUFBcEQsQ0FGZjtBQUFBLFFBR0UsU0FBUyxLQUFLLE1BQUwsQ0FBWSxPQUFPLFdBQVAsR0FBcUIsT0FBckIsR0FBK0IsS0FBM0MsQ0FIWDs7O0FBTUEsV0FBTyxZQUFQLENBQW9CLFNBQXBCLEVBQStCLGdCQUEvQjs7QUFFQSxTQUFLLElBQUwsR0FBWSxVQUFaLEdBQXlCLEtBQXpCLENBQStCLFNBQS9CLEVBQTBDLENBQTFDLEVBQTZDLE1BQTdDOzs7QUFHQSxRQUFJLFVBQVUsTUFBZCxFQUFxQjtBQUNuQixhQUFPLGFBQVAsQ0FBcUIsS0FBckIsRUFBNEIsTUFBNUIsRUFBb0MsQ0FBcEMsRUFBdUMsVUFBdkM7QUFDQSxhQUFPLElBQVAsQ0FBWSxjQUFaLEVBQTRCLEtBQUssT0FBakM7QUFDRCxLQUhELE1BR087QUFDTCxhQUFPLGFBQVAsQ0FBcUIsS0FBckIsRUFBNEIsTUFBNUIsRUFBb0MsS0FBSyxPQUF6QyxFQUFrRCxLQUFLLE9BQXZELEVBQWdFLEtBQUssT0FBckUsRUFBOEUsSUFBOUU7QUFDRDs7QUFFRCxXQUFPLFVBQVAsQ0FBa0IsT0FBbEIsRUFBMkIsU0FBM0IsRUFBc0MsS0FBSyxNQUEzQyxFQUFtRCxXQUFuRDs7O0FBR0EsUUFBSSxPQUFPLEtBQUssTUFBTCxDQUFZLE1BQVosQ0FBWDtBQUFBLFFBQ0UsWUFBWSxPQUFPLENBQVAsRUFBVSxHQUFWLENBQ1YsVUFBUyxDQUFULEVBQVksQ0FBWixFQUFjO0FBQ1osVUFBSSxPQUFPLEVBQUUsT0FBRixFQUFYO0FBQ0EsVUFBSSxTQUFTLE1BQU0sS0FBSyxJQUFMLENBQVUsQ0FBVixDQUFOLENBQWI7O0FBRUEsVUFBSSxVQUFVLE1BQVYsSUFBb0IsV0FBVyxZQUFuQyxFQUFpRDtBQUMvQyxhQUFLLE1BQUwsR0FBYyxLQUFLLE1BQUwsR0FBYyxNQUE1QjtBQUNELE9BRkQsTUFFTyxJQUFJLFVBQVUsTUFBVixJQUFvQixXQUFXLFVBQW5DLEVBQThDO0FBQ25ELGFBQUssS0FBTCxHQUFhLEtBQUssS0FBbEI7QUFDRDs7QUFFRCxhQUFPLElBQVA7QUFDSCxLQVpXLENBRGQ7O0FBZUEsUUFBSSxPQUFPLEdBQUcsR0FBSCxDQUFPLFNBQVAsRUFBa0IsVUFBUyxDQUFULEVBQVc7QUFBRSxhQUFPLEVBQUUsTUFBRixHQUFXLEVBQUUsQ0FBcEI7QUFBd0IsS0FBdkQsQ0FBWDtBQUFBLFFBQ0EsT0FBTyxHQUFHLEdBQUgsQ0FBTyxTQUFQLEVBQWtCLFVBQVMsQ0FBVCxFQUFXO0FBQUUsYUFBTyxFQUFFLEtBQUYsR0FBVSxFQUFFLENBQW5CO0FBQXVCLEtBQXRELENBRFA7O0FBR0EsUUFBSSxTQUFKO0FBQUEsUUFDQSxTQURBO0FBQUEsUUFFQSxZQUFhLGNBQWMsT0FBZixHQUEwQixDQUExQixHQUErQixjQUFjLFFBQWYsR0FBMkIsR0FBM0IsR0FBaUMsQ0FGM0U7OztBQUtBLFFBQUksV0FBVyxVQUFmLEVBQTBCOztBQUV4QixrQkFBWSxtQkFBUyxDQUFULEVBQVcsQ0FBWCxFQUFjO0FBQ3RCLFlBQUksU0FBUyxHQUFHLEdBQUgsQ0FBTyxVQUFVLEtBQVYsQ0FBZ0IsQ0FBaEIsRUFBbUIsSUFBSSxDQUF2QixDQUFQLEVBQW1DLFVBQVMsQ0FBVCxFQUFXO0FBQUUsaUJBQU8sRUFBRSxNQUFUO0FBQWtCLFNBQWxFLENBQWI7QUFDQSxlQUFPLG1CQUFtQixTQUFTLElBQUUsWUFBOUIsSUFBOEMsR0FBckQ7QUFBMkQsT0FGL0Q7O0FBSUEsa0JBQVksbUJBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYztBQUFFLGVBQU8sZ0JBQWdCLE9BQU8sV0FBdkIsSUFBc0MsR0FBdEMsSUFDaEMsVUFBVSxDQUFWLEVBQWEsQ0FBYixHQUFpQixVQUFVLENBQVYsRUFBYSxNQUFiLEdBQW9CLENBQXJDLEdBQXlDLENBRFQsSUFDYyxHQURyQjtBQUMyQixPQUR2RDtBQUdELEtBVEQsTUFTTyxJQUFJLFdBQVcsWUFBZixFQUE0QjtBQUNqQyxrQkFBWSxtQkFBUyxDQUFULEVBQVcsQ0FBWCxFQUFjO0FBQ3RCLFlBQUksUUFBUSxHQUFHLEdBQUgsQ0FBTyxVQUFVLEtBQVYsQ0FBZ0IsQ0FBaEIsRUFBbUIsSUFBSSxDQUF2QixDQUFQLEVBQW1DLFVBQVMsQ0FBVCxFQUFXO0FBQUUsaUJBQU8sRUFBRSxLQUFUO0FBQWlCLFNBQWpFLENBQVo7QUFDQSxlQUFPLGdCQUFnQixRQUFRLElBQUUsWUFBMUIsSUFBMEMsS0FBakQ7QUFBeUQsT0FGN0Q7O0FBSUEsa0JBQVksbUJBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYztBQUFFLGVBQU8sZ0JBQWdCLFVBQVUsQ0FBVixFQUFhLEtBQWIsR0FBbUIsU0FBbkIsR0FBZ0MsVUFBVSxDQUFWLEVBQWEsQ0FBN0QsSUFBa0UsR0FBbEUsSUFDNUIsT0FBTyxXQURxQixJQUNMLEdBREY7QUFDUSxPQURwQztBQUVEOztBQUVELFdBQU8sWUFBUCxDQUFvQixNQUFwQixFQUE0QixJQUE1QixFQUFrQyxTQUFsQyxFQUE2QyxJQUE3QyxFQUFtRCxTQUFuRCxFQUE4RCxVQUE5RDtBQUNBLFdBQU8sUUFBUCxDQUFnQixHQUFoQixFQUFxQixPQUFyQixFQUE4QixLQUE5QixFQUFxQyxXQUFyQzs7QUFFQSxTQUFLLFVBQUwsR0FBa0IsS0FBbEIsQ0FBd0IsU0FBeEIsRUFBbUMsQ0FBbkM7QUFFRDs7QUFFSCxTQUFPLEtBQVAsR0FBZSxVQUFTLENBQVQsRUFBWTtBQUN6QixRQUFJLENBQUMsVUFBVSxNQUFmLEVBQXVCLE9BQU8sS0FBUDtBQUN2QixZQUFRLENBQVI7QUFDQSxXQUFPLE1BQVA7QUFDRCxHQUpEOztBQU1BLFNBQU8sS0FBUCxHQUFlLFVBQVMsQ0FBVCxFQUFZO0FBQ3pCLFFBQUksQ0FBQyxVQUFVLE1BQWYsRUFBdUIsT0FBTyxLQUFQO0FBQ3ZCLFFBQUksRUFBRSxNQUFGLEdBQVcsQ0FBWCxJQUFnQixLQUFLLENBQXpCLEVBQTRCO0FBQzFCLGNBQVEsQ0FBUjtBQUNEO0FBQ0QsV0FBTyxNQUFQO0FBQ0QsR0FORDs7QUFTQSxTQUFPLEtBQVAsR0FBZSxVQUFTLENBQVQsRUFBWSxDQUFaLEVBQWU7QUFDNUIsUUFBSSxDQUFDLFVBQVUsTUFBZixFQUF1QixPQUFPLEtBQVA7QUFDdkIsUUFBSSxLQUFLLE1BQUwsSUFBZSxLQUFLLFFBQXBCLElBQWdDLEtBQUssTUFBekMsRUFBaUQ7QUFDL0MsY0FBUSxDQUFSO0FBQ0EsYUFBTyxDQUFQO0FBQ0Q7QUFDRCxXQUFPLE1BQVA7QUFDRCxHQVBEOztBQVNBLFNBQU8sVUFBUCxHQUFvQixVQUFTLENBQVQsRUFBWTtBQUM5QixRQUFJLENBQUMsVUFBVSxNQUFmLEVBQXVCLE9BQU8sVUFBUDtBQUN2QixpQkFBYSxDQUFDLENBQWQ7QUFDQSxXQUFPLE1BQVA7QUFDRCxHQUpEOztBQU1BLFNBQU8sWUFBUCxHQUFzQixVQUFTLENBQVQsRUFBWTtBQUNoQyxRQUFJLENBQUMsVUFBVSxNQUFmLEVBQXVCLE9BQU8sWUFBUDtBQUN2QixtQkFBZSxDQUFDLENBQWhCO0FBQ0EsV0FBTyxNQUFQO0FBQ0QsR0FKRDs7QUFNQSxTQUFPLE1BQVAsR0FBZ0IsVUFBUyxDQUFULEVBQVk7QUFDMUIsUUFBSSxDQUFDLFVBQVUsTUFBZixFQUF1QixPQUFPLE1BQVA7QUFDdkIsYUFBUyxDQUFUO0FBQ0EsV0FBTyxNQUFQO0FBQ0QsR0FKRDs7QUFNQSxTQUFPLFVBQVAsR0FBb0IsVUFBUyxDQUFULEVBQVk7QUFDOUIsUUFBSSxDQUFDLFVBQVUsTUFBZixFQUF1QixPQUFPLFVBQVA7QUFDdkIsUUFBSSxLQUFLLE9BQUwsSUFBZ0IsS0FBSyxLQUFyQixJQUE4QixLQUFLLFFBQXZDLEVBQWlEO0FBQy9DLG1CQUFhLENBQWI7QUFDRDtBQUNELFdBQU8sTUFBUDtBQUNELEdBTkQ7O0FBUUEsU0FBTyxXQUFQLEdBQXFCLFVBQVMsQ0FBVCxFQUFZO0FBQy9CLFFBQUksQ0FBQyxVQUFVLE1BQWYsRUFBdUIsT0FBTyxXQUFQO0FBQ3ZCLGtCQUFjLENBQWQ7QUFDQSxXQUFPLE1BQVA7QUFDRCxHQUpEOztBQU1BLFNBQU8sV0FBUCxHQUFxQixVQUFTLENBQVQsRUFBWTtBQUMvQixRQUFJLENBQUMsVUFBVSxNQUFmLEVBQXVCLE9BQU8sV0FBUDtBQUN2QixrQkFBYyxDQUFDLENBQWY7QUFDQSxXQUFPLE1BQVA7QUFDRCxHQUpEOztBQU1BLFNBQU8sY0FBUCxHQUF3QixVQUFTLENBQVQsRUFBWTtBQUNsQyxRQUFJLENBQUMsVUFBVSxNQUFmLEVBQXVCLE9BQU8sY0FBUDtBQUN2QixxQkFBaUIsQ0FBakI7QUFDQSxXQUFPLE1BQVA7QUFDRCxHQUpEOztBQU1BLFNBQU8sTUFBUCxHQUFnQixVQUFTLENBQVQsRUFBVztBQUN6QixRQUFJLENBQUMsVUFBVSxNQUFmLEVBQXVCLE9BQU8sTUFBUDtBQUN2QixRQUFJLEVBQUUsV0FBRixFQUFKO0FBQ0EsUUFBSSxLQUFLLFlBQUwsSUFBcUIsS0FBSyxVQUE5QixFQUEwQztBQUN4QyxlQUFTLENBQVQ7QUFDRDtBQUNELFdBQU8sTUFBUDtBQUNELEdBUEQ7O0FBU0EsU0FBTyxTQUFQLEdBQW1CLFVBQVMsQ0FBVCxFQUFZO0FBQzdCLFFBQUksQ0FBQyxVQUFVLE1BQWYsRUFBdUIsT0FBTyxTQUFQO0FBQ3ZCLGdCQUFZLENBQUMsQ0FBQyxDQUFkO0FBQ0EsV0FBTyxNQUFQO0FBQ0QsR0FKRDs7QUFNQSxTQUFPLFdBQVAsR0FBcUIsVUFBUyxDQUFULEVBQVk7QUFDL0IsUUFBSSxDQUFDLFVBQVUsTUFBZixFQUF1QixPQUFPLFdBQVA7QUFDdkIsa0JBQWMsQ0FBZDtBQUNBLFdBQU8sTUFBUDtBQUNELEdBSkQ7O0FBTUEsU0FBTyxLQUFQLEdBQWUsVUFBUyxDQUFULEVBQVk7QUFDekIsUUFBSSxDQUFDLFVBQVUsTUFBZixFQUF1QixPQUFPLEtBQVA7QUFDdkIsWUFBUSxDQUFSO0FBQ0EsV0FBTyxNQUFQO0FBQ0QsR0FKRDs7QUFNQSxLQUFHLE1BQUgsQ0FBVSxNQUFWLEVBQWtCLGdCQUFsQixFQUFvQyxJQUFwQzs7QUFFQSxTQUFPLE1BQVA7QUFFRCxDQXBNRDs7Ozs7QUNGQSxJQUFJLFNBQVMsUUFBUSxVQUFSLENBQWI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFlBQVU7O0FBRXpCLE1BQUksUUFBUSxHQUFHLEtBQUgsQ0FBUyxNQUFULEVBQVo7QUFBQSxNQUNFLFFBQVEsTUFEVjtBQUFBLE1BRUUsYUFBYSxFQUZmO0FBQUEsTUFHRSxjQUFjLEVBSGhCO0FBQUEsTUFJRSxjQUFjLEVBSmhCO0FBQUEsTUFLRSxlQUFlLENBTGpCO0FBQUEsTUFNRSxRQUFRLENBQUMsQ0FBRCxDQU5WO0FBQUEsTUFPRSxTQUFTLEVBUFg7QUFBQSxNQVFFLGNBQWMsRUFSaEI7QUFBQSxNQVNFLFdBQVcsS0FUYjtBQUFBLE1BVUUsUUFBUSxFQVZWO0FBQUEsTUFXRSxjQUFjLEdBQUcsTUFBSCxDQUFVLE1BQVYsQ0FYaEI7QUFBQSxNQVlFLGFBQWEsUUFaZjtBQUFBLE1BYUUsY0FBYyxFQWJoQjtBQUFBLE1BY0UsaUJBQWlCLElBZG5CO0FBQUEsTUFlRSxTQUFTLFVBZlg7QUFBQSxNQWdCRSxZQUFZLEtBaEJkO0FBQUEsTUFpQkUsbUJBQW1CLEdBQUcsUUFBSCxDQUFZLFVBQVosRUFBd0IsU0FBeEIsRUFBbUMsV0FBbkMsQ0FqQnJCOztBQW1CRSxXQUFTLE1BQVQsQ0FBZ0IsR0FBaEIsRUFBb0I7O0FBRWxCLFFBQUksT0FBTyxPQUFPLFdBQVAsQ0FBbUIsS0FBbkIsRUFBMEIsU0FBMUIsRUFBcUMsS0FBckMsRUFBNEMsTUFBNUMsRUFBb0QsV0FBcEQsRUFBaUUsY0FBakUsQ0FBWDtBQUFBLFFBQ0UsVUFBVSxJQUFJLFNBQUosQ0FBYyxHQUFkLEVBQW1CLElBQW5CLENBQXdCLENBQUMsS0FBRCxDQUF4QixDQURaOztBQUdBLFlBQVEsS0FBUixHQUFnQixNQUFoQixDQUF1QixHQUF2QixFQUE0QixJQUE1QixDQUFpQyxPQUFqQyxFQUEwQyxjQUFjLGFBQXhEOztBQUVBLFFBQUksT0FBTyxRQUFRLFNBQVIsQ0FBa0IsTUFBTSxXQUFOLEdBQW9CLE1BQXRDLEVBQThDLElBQTlDLENBQW1ELEtBQUssSUFBeEQsQ0FBWDtBQUFBLFFBQ0UsWUFBWSxLQUFLLEtBQUwsR0FBYSxNQUFiLENBQW9CLEdBQXBCLEVBQXlCLE9BQXpCLEVBQWtDLElBQWxDLENBQXVDLE9BQXZDLEVBQWdELGNBQWMsTUFBOUQsRUFBc0UsS0FBdEUsQ0FBNEUsU0FBNUUsRUFBdUYsSUFBdkYsQ0FEZDtBQUFBLFFBRUUsYUFBYSxVQUFVLE1BQVYsQ0FBaUIsS0FBakIsRUFBd0IsSUFBeEIsQ0FBNkIsT0FBN0IsRUFBc0MsY0FBYyxRQUFwRCxDQUZmO0FBQUEsUUFHRSxTQUFTLEtBQUssTUFBTCxDQUFZLE9BQU8sV0FBUCxHQUFxQixPQUFyQixHQUErQixLQUEzQyxDQUhYOzs7QUFNQSxXQUFPLFlBQVAsQ0FBb0IsU0FBcEIsRUFBK0IsZ0JBQS9COzs7QUFHQSxTQUFLLElBQUwsR0FBWSxVQUFaLEdBQXlCLEtBQXpCLENBQStCLFNBQS9CLEVBQTBDLENBQTFDLEVBQTZDLE1BQTdDOztBQUVBLFdBQU8sYUFBUCxDQUFxQixLQUFyQixFQUE0QixNQUE1QixFQUFvQyxXQUFwQyxFQUFpRCxVQUFqRCxFQUE2RCxXQUE3RCxFQUEwRSxLQUFLLE9BQS9FO0FBQ0EsV0FBTyxVQUFQLENBQWtCLE9BQWxCLEVBQTJCLFNBQTNCLEVBQXNDLEtBQUssTUFBM0MsRUFBbUQsV0FBbkQ7OztBQUdBLFFBQUksT0FBTyxLQUFLLE1BQUwsQ0FBWSxNQUFaLENBQVg7QUFBQSxRQUNFLFlBQVksT0FBTyxDQUFQLEVBQVUsR0FBVixDQUFlLFVBQVMsQ0FBVCxFQUFXO0FBQUUsYUFBTyxFQUFFLE9BQUYsRUFBUDtBQUFxQixLQUFqRCxDQURkOztBQUdBLFFBQUksT0FBTyxHQUFHLEdBQUgsQ0FBTyxTQUFQLEVBQWtCLFVBQVMsQ0FBVCxFQUFXO0FBQUUsYUFBTyxFQUFFLE1BQVQ7QUFBa0IsS0FBakQsQ0FBWDtBQUFBLFFBQ0EsT0FBTyxHQUFHLEdBQUgsQ0FBTyxTQUFQLEVBQWtCLFVBQVMsQ0FBVCxFQUFXO0FBQUUsYUFBTyxFQUFFLEtBQVQ7QUFBaUIsS0FBaEQsQ0FEUDs7QUFHQSxRQUFJLFNBQUo7QUFBQSxRQUNBLFNBREE7QUFBQSxRQUVBLFlBQWEsY0FBYyxPQUFmLEdBQTBCLENBQTFCLEdBQStCLGNBQWMsUUFBZixHQUEyQixHQUEzQixHQUFpQyxDQUYzRTs7O0FBS0EsUUFBSSxXQUFXLFVBQWYsRUFBMEI7QUFDeEIsa0JBQVksbUJBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYztBQUFFLGVBQU8sa0JBQW1CLEtBQUssT0FBTyxZQUFaLENBQW5CLEdBQWdELEdBQXZEO0FBQTZELE9BQXpGO0FBQ0Esa0JBQVksbUJBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYztBQUFFLGVBQU8sZ0JBQWdCLE9BQU8sV0FBdkIsSUFBc0MsR0FBdEMsSUFDNUIsVUFBVSxDQUFWLEVBQWEsQ0FBYixHQUFpQixVQUFVLENBQVYsRUFBYSxNQUFiLEdBQW9CLENBQXJDLEdBQXlDLENBRGIsSUFDa0IsR0FEekI7QUFDK0IsT0FEM0Q7QUFHRCxLQUxELE1BS08sSUFBSSxXQUFXLFlBQWYsRUFBNEI7QUFDakMsa0JBQVksbUJBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYztBQUFFLGVBQU8sZUFBZ0IsS0FBSyxPQUFPLFlBQVosQ0FBaEIsR0FBNkMsS0FBcEQ7QUFBNEQsT0FBeEY7QUFDQSxrQkFBWSxtQkFBUyxDQUFULEVBQVcsQ0FBWCxFQUFjO0FBQUUsZUFBTyxnQkFBZ0IsVUFBVSxDQUFWLEVBQWEsS0FBYixHQUFtQixTQUFuQixHQUFnQyxVQUFVLENBQVYsRUFBYSxDQUE3RCxJQUFrRSxHQUFsRSxJQUM1QixPQUFPLFdBRHFCLElBQ0wsR0FERjtBQUNRLE9BRHBDO0FBRUQ7O0FBRUQsV0FBTyxZQUFQLENBQW9CLE1BQXBCLEVBQTRCLElBQTVCLEVBQWtDLFNBQWxDLEVBQTZDLElBQTdDLEVBQW1ELFNBQW5ELEVBQThELFVBQTlEO0FBQ0EsV0FBTyxRQUFQLENBQWdCLEdBQWhCLEVBQXFCLE9BQXJCLEVBQThCLEtBQTlCLEVBQXFDLFdBQXJDO0FBQ0EsU0FBSyxVQUFMLEdBQWtCLEtBQWxCLENBQXdCLFNBQXhCLEVBQW1DLENBQW5DO0FBRUQ7O0FBR0gsU0FBTyxLQUFQLEdBQWUsVUFBUyxDQUFULEVBQVk7QUFDekIsUUFBSSxDQUFDLFVBQVUsTUFBZixFQUF1QixPQUFPLEtBQVA7QUFDdkIsWUFBUSxDQUFSO0FBQ0EsV0FBTyxNQUFQO0FBQ0QsR0FKRDs7QUFNQSxTQUFPLEtBQVAsR0FBZSxVQUFTLENBQVQsRUFBWTtBQUN6QixRQUFJLENBQUMsVUFBVSxNQUFmLEVBQXVCLE9BQU8sS0FBUDtBQUN2QixRQUFJLEVBQUUsTUFBRixHQUFXLENBQVgsSUFBZ0IsS0FBSyxDQUF6QixFQUE0QjtBQUMxQixjQUFRLENBQVI7QUFDRDtBQUNELFdBQU8sTUFBUDtBQUNELEdBTkQ7O0FBUUEsU0FBTyxZQUFQLEdBQXNCLFVBQVMsQ0FBVCxFQUFZO0FBQ2hDLFFBQUksQ0FBQyxVQUFVLE1BQWYsRUFBdUIsT0FBTyxZQUFQO0FBQ3ZCLG1CQUFlLENBQUMsQ0FBaEI7QUFDQSxXQUFPLE1BQVA7QUFDRCxHQUpEOztBQU1BLFNBQU8sTUFBUCxHQUFnQixVQUFTLENBQVQsRUFBWTtBQUMxQixRQUFJLENBQUMsVUFBVSxNQUFmLEVBQXVCLE9BQU8sTUFBUDtBQUN2QixhQUFTLENBQVQ7QUFDQSxXQUFPLE1BQVA7QUFDRCxHQUpEOztBQU1BLFNBQU8sVUFBUCxHQUFvQixVQUFTLENBQVQsRUFBWTtBQUM5QixRQUFJLENBQUMsVUFBVSxNQUFmLEVBQXVCLE9BQU8sVUFBUDtBQUN2QixRQUFJLEtBQUssT0FBTCxJQUFnQixLQUFLLEtBQXJCLElBQThCLEtBQUssUUFBdkMsRUFBaUQ7QUFDL0MsbUJBQWEsQ0FBYjtBQUNEO0FBQ0QsV0FBTyxNQUFQO0FBQ0QsR0FORDs7QUFRQSxTQUFPLFdBQVAsR0FBcUIsVUFBUyxDQUFULEVBQVk7QUFDL0IsUUFBSSxDQUFDLFVBQVUsTUFBZixFQUF1QixPQUFPLFdBQVA7QUFDdkIsa0JBQWMsQ0FBZDtBQUNBLFdBQU8sTUFBUDtBQUNELEdBSkQ7O0FBTUEsU0FBTyxXQUFQLEdBQXFCLFVBQVMsQ0FBVCxFQUFZO0FBQy9CLFFBQUksQ0FBQyxVQUFVLE1BQWYsRUFBdUIsT0FBTyxXQUFQO0FBQ3ZCLGtCQUFjLENBQUMsQ0FBZjtBQUNBLFdBQU8sTUFBUDtBQUNELEdBSkQ7O0FBTUEsU0FBTyxjQUFQLEdBQXdCLFVBQVMsQ0FBVCxFQUFZO0FBQ2xDLFFBQUksQ0FBQyxVQUFVLE1BQWYsRUFBdUIsT0FBTyxjQUFQO0FBQ3ZCLHFCQUFpQixDQUFqQjtBQUNBLFdBQU8sTUFBUDtBQUNELEdBSkQ7O0FBTUEsU0FBTyxNQUFQLEdBQWdCLFVBQVMsQ0FBVCxFQUFXO0FBQ3pCLFFBQUksQ0FBQyxVQUFVLE1BQWYsRUFBdUIsT0FBTyxNQUFQO0FBQ3ZCLFFBQUksRUFBRSxXQUFGLEVBQUo7QUFDQSxRQUFJLEtBQUssWUFBTCxJQUFxQixLQUFLLFVBQTlCLEVBQTBDO0FBQ3hDLGVBQVMsQ0FBVDtBQUNEO0FBQ0QsV0FBTyxNQUFQO0FBQ0QsR0FQRDs7QUFTQSxTQUFPLFNBQVAsR0FBbUIsVUFBUyxDQUFULEVBQVk7QUFDN0IsUUFBSSxDQUFDLFVBQVUsTUFBZixFQUF1QixPQUFPLFNBQVA7QUFDdkIsZ0JBQVksQ0FBQyxDQUFDLENBQWQ7QUFDQSxXQUFPLE1BQVA7QUFDRCxHQUpEOztBQU1BLFNBQU8sV0FBUCxHQUFxQixVQUFTLENBQVQsRUFBWTtBQUMvQixRQUFJLENBQUMsVUFBVSxNQUFmLEVBQXVCLE9BQU8sV0FBUDtBQUN2QixrQkFBYyxDQUFkO0FBQ0EsV0FBTyxNQUFQO0FBQ0QsR0FKRDs7QUFNQSxTQUFPLEtBQVAsR0FBZSxVQUFTLENBQVQsRUFBWTtBQUN6QixRQUFJLENBQUMsVUFBVSxNQUFmLEVBQXVCLE9BQU8sS0FBUDtBQUN2QixZQUFRLENBQVI7QUFDQSxXQUFPLE1BQVA7QUFDRCxHQUpEOztBQU1BLEtBQUcsTUFBSCxDQUFVLE1BQVYsRUFBa0IsZ0JBQWxCLEVBQW9DLElBQXBDOztBQUVBLFNBQU8sTUFBUDtBQUVELENBM0pEOzs7QUNGQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkEsU0FBUyxhQUFULENBQXVCLEMsY0FBdkIsRSxhQUFvRDtBQUNoRCxRQUFJLElBQUksS0FBSyxJQUFJLE1BQU0sS0FBSyxHQUFMLENBQVMsQ0FBVCxDQUFmLENBQVI7QUFDQSxRQUFJLE1BQU0sSUFBSSxLQUFLLEdBQUwsQ0FBUyxDQUFDLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFaLENBQUQsR0FDbkIsVUFEbUIsR0FFbkIsYUFBYSxDQUZNLEdBR25CLGFBQWEsS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQVosQ0FITSxHQUluQixhQUFhLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFaLENBSk0sR0FLbkIsYUFBYSxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksQ0FBWixDQUxNLEdBTW5CLGFBQWEsS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQVosQ0FOTSxHQU9uQixhQUFhLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFaLENBUE0sR0FRbkIsYUFBYSxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksQ0FBWixDQVJNLEdBU25CLGFBQWEsS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQVosQ0FUTSxHQVVuQixhQUFhLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFaLENBVkgsQ0FBZDtBQVdBLFFBQUksS0FBSyxDQUFULEVBQVk7QUFDUixlQUFPLElBQUksR0FBWDtBQUNILEtBRkQsTUFFTztBQUNILGVBQU8sTUFBTSxDQUFiO0FBQ0g7QUFDSjs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsYUFBakI7OztBQ3BDQTs7Ozs7Ozs7Ozs7Ozs7OztBQWVBLFNBQVMsZ0JBQVQsQ0FBMEIsSSw0QkFBMUIsRSwrQkFBMEY7O0FBRXRGLFFBQUksQ0FBSixFQUFPLENBQVA7Ozs7QUFJQSxRQUFJLGFBQWEsS0FBSyxNQUF0Qjs7OztBQUlBLFFBQUksZUFBZSxDQUFuQixFQUFzQjtBQUNsQixZQUFJLENBQUo7QUFDQSxZQUFJLEtBQUssQ0FBTCxFQUFRLENBQVIsQ0FBSjtBQUNILEtBSEQsTUFHTzs7O0FBR0gsWUFBSSxPQUFPLENBQVg7QUFBQSxZQUFjLE9BQU8sQ0FBckI7QUFBQSxZQUNJLFFBQVEsQ0FEWjtBQUFBLFlBQ2UsUUFBUSxDQUR2Qjs7OztBQUtBLFlBQUksS0FBSixFQUFXLENBQVgsRUFBYyxDQUFkOzs7Ozs7O0FBT0EsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFVBQXBCLEVBQWdDLEdBQWhDLEVBQXFDO0FBQ2pDLG9CQUFRLEtBQUssQ0FBTCxDQUFSO0FBQ0EsZ0JBQUksTUFBTSxDQUFOLENBQUo7QUFDQSxnQkFBSSxNQUFNLENBQU4sQ0FBSjs7QUFFQSxvQkFBUSxDQUFSO0FBQ0Esb0JBQVEsQ0FBUjs7QUFFQSxxQkFBUyxJQUFJLENBQWI7QUFDQSxxQkFBUyxJQUFJLENBQWI7QUFDSDs7O0FBR0QsWUFBSSxDQUFFLGFBQWEsS0FBZCxHQUF3QixPQUFPLElBQWhDLEtBQ0UsYUFBYSxLQUFkLEdBQXdCLE9BQU8sSUFEaEMsQ0FBSjs7O0FBSUEsWUFBSyxPQUFPLFVBQVIsR0FBd0IsSUFBSSxJQUFMLEdBQWEsVUFBeEM7QUFDSDs7O0FBR0QsV0FBTztBQUNILFdBQUcsQ0FEQTtBQUVILFdBQUc7QUFGQSxLQUFQO0FBSUg7O0FBR0QsT0FBTyxPQUFQLEdBQWlCLGdCQUFqQjs7O0FDdkVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JBLFNBQVMsb0JBQVQsQ0FBOEIsRSwrQkFBOUIsRSxlQUErRTs7OztBQUkzRSxXQUFPLFVBQVMsQ0FBVCxFQUFZO0FBQ2YsZUFBTyxHQUFHLENBQUgsR0FBUSxHQUFHLENBQUgsR0FBTyxDQUF0QjtBQUNILEtBRkQ7QUFHSDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsb0JBQWpCOzs7QUMzQkE7OztBQUdBLElBQUksTUFBTSxRQUFRLE9BQVIsQ0FBVjs7Ozs7Ozs7Ozs7Ozs7O0FBZUEsU0FBUyxJQUFULENBQWMsQyxxQkFBZCxFLFdBQWlEOztBQUU3QyxRQUFJLEVBQUUsTUFBRixLQUFhLENBQWpCLEVBQW9CO0FBQUUsZUFBTyxHQUFQO0FBQWE7O0FBRW5DLFdBQU8sSUFBSSxDQUFKLElBQVMsRUFBRSxNQUFsQjtBQUNIOztBQUVELE9BQU8sT0FBUCxHQUFpQixJQUFqQjs7O0FDekJBOzs7QUFHQSxJQUFJLG1CQUFtQixRQUFRLHFCQUFSLENBQXZCO0FBQ0EsSUFBSSwwQkFBMEIsUUFBUSw2QkFBUixDQUE5Qjs7Ozs7Ozs7Ozs7Ozs7QUFjQSxTQUFTLGlCQUFULENBQTJCLEMscUJBQTNCLEVBQWtELEMscUJBQWxELEUsV0FBb0Y7QUFDaEYsUUFBSSxNQUFNLGlCQUFpQixDQUFqQixFQUFvQixDQUFwQixDQUFWO0FBQUEsUUFDSSxPQUFPLHdCQUF3QixDQUF4QixDQURYO0FBQUEsUUFFSSxPQUFPLHdCQUF3QixDQUF4QixDQUZYOztBQUlBLFdBQU8sTUFBTSxJQUFOLEdBQWEsSUFBcEI7QUFDSDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsaUJBQWpCOzs7QUMxQkE7OztBQUdBLElBQUksT0FBTyxRQUFRLFFBQVIsQ0FBWDs7Ozs7Ozs7Ozs7Ozs7O0FBZUEsU0FBUyxnQkFBVCxDQUEwQixDLG1CQUExQixFQUFnRCxDLG1CQUFoRCxFLFdBQWlGOzs7QUFHN0UsUUFBSSxFQUFFLE1BQUYsSUFBWSxDQUFaLElBQWlCLEVBQUUsTUFBRixLQUFhLEVBQUUsTUFBcEMsRUFBNEM7QUFDeEMsZUFBTyxHQUFQO0FBQ0g7Ozs7OztBQU1ELFFBQUksUUFBUSxLQUFLLENBQUwsQ0FBWjtBQUFBLFFBQ0ksUUFBUSxLQUFLLENBQUwsQ0FEWjtBQUFBLFFBRUksTUFBTSxDQUZWOzs7Ozs7QUFRQSxTQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksRUFBRSxNQUF0QixFQUE4QixHQUE5QixFQUFtQztBQUMvQixlQUFPLENBQUMsRUFBRSxDQUFGLElBQU8sS0FBUixLQUFrQixFQUFFLENBQUYsSUFBTyxLQUF6QixDQUFQO0FBQ0g7Ozs7O0FBS0QsUUFBSSxvQkFBb0IsRUFBRSxNQUFGLEdBQVcsQ0FBbkM7OztBQUdBLFdBQU8sTUFBTSxpQkFBYjtBQUNIOztBQUVELE9BQU8sT0FBUCxHQUFpQixnQkFBakI7OztBQ2xEQTs7O0FBR0EsSUFBSSxpQkFBaUIsUUFBUSxtQkFBUixDQUFyQjs7Ozs7Ozs7Ozs7O0FBWUEsU0FBUyx1QkFBVCxDQUFpQyxDLG1CQUFqQyxFLFdBQWlFOztBQUU3RCxNQUFJLGtCQUFrQixlQUFlLENBQWYsQ0FBdEI7QUFDQSxNQUFJLE1BQU0sZUFBTixDQUFKLEVBQTRCO0FBQUUsV0FBTyxHQUFQO0FBQWE7QUFDM0MsU0FBTyxLQUFLLElBQUwsQ0FBVSxlQUFWLENBQVA7QUFDSDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsdUJBQWpCOzs7QUN0QkE7OztBQUdBLElBQUksd0JBQXdCLFFBQVEsNEJBQVIsQ0FBNUI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCQSxTQUFTLGNBQVQsQ0FBd0IsQyxxQkFBeEIsRSxXQUEyRDs7QUFFdkQsUUFBSSxFQUFFLE1BQUYsSUFBWSxDQUFoQixFQUFtQjtBQUFFLGVBQU8sR0FBUDtBQUFhOztBQUVsQyxRQUFJLDRCQUE0QixzQkFBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsQ0FBaEM7Ozs7O0FBS0EsUUFBSSxvQkFBb0IsRUFBRSxNQUFGLEdBQVcsQ0FBbkM7OztBQUdBLFdBQU8sNEJBQTRCLGlCQUFuQztBQUNIOztBQUVELE9BQU8sT0FBUCxHQUFpQixjQUFqQjs7O0FDcENBOzs7QUFHQSxJQUFJLFdBQVcsUUFBUSxZQUFSLENBQWY7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCQSxTQUFTLGlCQUFULENBQTJCLEMscUJBQTNCLEUsV0FBOEQ7O0FBRTFELE1BQUksSUFBSSxTQUFTLENBQVQsQ0FBUjtBQUNBLE1BQUksTUFBTSxDQUFOLENBQUosRUFBYztBQUFFLFdBQU8sQ0FBUDtBQUFXO0FBQzNCLFNBQU8sS0FBSyxJQUFMLENBQVUsQ0FBVixDQUFQO0FBQ0g7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLGlCQUFqQjs7O0FDNUJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQSxTQUFTLEdBQVQsQ0FBYSxDLHFCQUFiLEUsYUFBaUQ7Ozs7QUFJN0MsUUFBSSxNQUFNLENBQVY7Ozs7O0FBS0EsUUFBSSxvQkFBb0IsQ0FBeEI7OztBQUdBLFFBQUkscUJBQUo7OztBQUdBLFFBQUksT0FBSjs7QUFFQSxTQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksRUFBRSxNQUF0QixFQUE4QixHQUE5QixFQUFtQzs7QUFFL0IsZ0NBQXdCLEVBQUUsQ0FBRixJQUFPLGlCQUEvQjs7Ozs7QUFLQSxrQkFBVSxNQUFNLHFCQUFoQjs7Ozs7OztBQU9BLDRCQUFvQixVQUFVLEdBQVYsR0FBZ0IscUJBQXBDOzs7O0FBSUEsY0FBTSxPQUFOO0FBQ0g7O0FBRUQsV0FBTyxHQUFQO0FBQ0g7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLEdBQWpCOzs7QUM1REE7OztBQUdBLElBQUksT0FBTyxRQUFRLFFBQVIsQ0FBWDs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQSxTQUFTLHFCQUFULENBQStCLEMscUJBQS9CLEVBQXNELEMsY0FBdEQsRSxXQUFpRjtBQUM3RSxRQUFJLFlBQVksS0FBSyxDQUFMLENBQWhCO0FBQUEsUUFDSSxNQUFNLENBRFY7O0FBR0EsU0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEVBQUUsTUFBdEIsRUFBOEIsR0FBOUIsRUFBbUM7QUFDL0IsZUFBTyxLQUFLLEdBQUwsQ0FBUyxFQUFFLENBQUYsSUFBTyxTQUFoQixFQUEyQixDQUEzQixDQUFQO0FBQ0g7O0FBRUQsV0FBTyxHQUFQO0FBQ0g7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLHFCQUFqQjs7O0FDOUJBOzs7QUFHQSxJQUFJLHdCQUF3QixRQUFRLDRCQUFSLENBQTVCOzs7Ozs7Ozs7Ozs7Ozs7QUFlQSxTQUFTLFFBQVQsQ0FBa0IsQyxxQkFBbEIsRSxXQUFvRDs7QUFFaEQsUUFBSSxFQUFFLE1BQUYsS0FBYSxDQUFqQixFQUFvQjtBQUFFLGVBQU8sR0FBUDtBQUFhOzs7O0FBSW5DLFdBQU8sc0JBQXNCLENBQXRCLEVBQXlCLENBQXpCLElBQThCLEVBQUUsTUFBdkM7QUFDSDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsUUFBakI7OztBQzNCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLFNBQVMsTUFBVCxDQUFnQixDLFlBQWhCLEVBQThCLEksWUFBOUIsRUFBK0MsaUIsWUFBL0MsRSxXQUF3RjtBQUNwRixTQUFPLENBQUMsSUFBSSxJQUFMLElBQWEsaUJBQXBCO0FBQ0g7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLE1BQWpCOzs7Ozs7Ozs7Ozs7OztBQzlCQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7SUFFYSxjLFdBQUEsYzs7Ozs7QUFpQ1QsNEJBQVksTUFBWixFQUFtQjtBQUFBOztBQUFBOztBQUFBLGNBL0JuQixRQStCbUIsR0EvQlQsTUFBSyxjQUFMLEdBQW9CLFdBK0JYO0FBQUEsY0E5Qm5CLFVBOEJtQixHQTlCUixJQThCUTtBQUFBLGNBN0JuQixXQTZCbUIsR0E3Qk4sSUE2Qk07QUFBQSxjQTVCbkIsTUE0Qm1CLEdBNUJaO0FBQ0gsbUJBQU8sRUFESjtBQUVILG9CQUFRLEVBRkw7QUFHSCx3QkFBWTtBQUhULFNBNEJZO0FBQUEsY0F2Qm5CLENBdUJtQixHQXZCakIsRTtBQUNFLG1CQUFPLEVBRFQsRTtBQUVFLGlCQUFLLENBRlA7QUFHRSxtQkFBTyxlQUFDLENBQUQsRUFBSSxHQUFKO0FBQUEsdUJBQVksYUFBTSxRQUFOLENBQWUsQ0FBZixJQUFvQixDQUFwQixHQUF3QixFQUFFLEdBQUYsQ0FBcEM7QUFBQSxhQUhULEU7QUFJRSxtQkFBTyxTQUpUO0FBS0UsbUJBQU87QUFMVCxTQXVCaUI7QUFBQSxjQWhCbkIsQ0FnQm1CLEdBaEJqQixFO0FBQ0UsaUJBQUssQ0FEUDtBQUVFLG1CQUFPLGVBQUMsQ0FBRCxFQUFJLEdBQUo7QUFBQSx1QkFBWSxhQUFNLFFBQU4sQ0FBZSxDQUFmLElBQW9CLENBQXBCLEdBQXdCLEVBQUUsR0FBRixDQUFwQztBQUFBLGFBRlQsRTtBQUdFLG1CQUFPLEVBSFQsRTtBQUlFLG9CQUFRLE1BSlY7QUFLRSxtQkFBTztBQUxULFNBZ0JpQjtBQUFBLGNBVG5CLE1BU21CLEdBVFo7QUFDSCxpQkFBSyxDQURGO0FBRUgsbUJBQU8sZUFBQyxDQUFEO0FBQUEsdUJBQU8sRUFBRSxNQUFLLE1BQUwsQ0FBWSxHQUFkLENBQVA7QUFBQSxhQUZKLEU7QUFHSCxtQkFBTztBQUhKLFNBU1k7QUFBQSxjQUpuQixLQUltQixHQUpYLFNBSVc7QUFBQSxjQUhuQixlQUdtQixHQUhGLFlBR0U7QUFBQSxjQUZuQixVQUVtQixHQUZQLElBRU87O0FBRWYsWUFBSSxjQUFKOztBQUVBLFlBQUcsTUFBSCxFQUFVO0FBQ04seUJBQU0sVUFBTixRQUF1QixNQUF2QjtBQUNIOztBQU5jO0FBUWxCOzs7OztJQUdRLFEsV0FBQSxROzs7QUFDVCxzQkFBWSxtQkFBWixFQUFpQyxJQUFqQyxFQUF1QyxNQUF2QyxFQUErQztBQUFBOztBQUFBLDJGQUNyQyxtQkFEcUMsRUFDaEIsSUFEZ0IsRUFDVixJQUFJLGNBQUosQ0FBbUIsTUFBbkIsQ0FEVTtBQUU5Qzs7OztrQ0FFUyxNLEVBQU87QUFDYixpR0FBdUIsSUFBSSxjQUFKLENBQW1CLE1BQW5CLENBQXZCO0FBQ0g7OzttQ0FFUztBQUNOO0FBQ0EsZ0JBQUksT0FBSyxJQUFUOztBQUVBLGdCQUFJLE9BQU8sS0FBSyxNQUFoQjs7QUFFQSxpQkFBSyxJQUFMLENBQVUsQ0FBVixHQUFZLEVBQVo7QUFDQSxpQkFBSyxJQUFMLENBQVUsQ0FBVixHQUFZLEVBQVo7O0FBRUEsaUJBQUssSUFBTCxDQUFVLFVBQVYsR0FBdUIsS0FBSyxVQUE1QjtBQUNBLGdCQUFHLEtBQUssSUFBTCxDQUFVLFVBQWIsRUFBd0I7QUFDcEIscUJBQUssSUFBTCxDQUFVLE1BQVYsQ0FBaUIsS0FBakIsR0FBeUIsS0FBSyxNQUFMLENBQVksS0FBWixHQUFvQixLQUFLLE1BQUwsQ0FBWSxLQUFoQyxHQUFzQyxLQUFLLE1BQUwsQ0FBWSxNQUFaLEdBQW1CLENBQWxGO0FBQ0g7O0FBR0QsaUJBQUssZUFBTDtBQUNBLGlCQUFLLE1BQUw7QUFDQSxpQkFBSyxNQUFMO0FBQ0EsaUJBQUssZ0JBQUw7O0FBR0EsaUJBQUssWUFBTDs7QUFHQSxnQkFBRyxLQUFLLGVBQVIsRUFBd0I7QUFDcEIscUJBQUssSUFBTCxDQUFVLGFBQVYsR0FBMEIsR0FBRyxLQUFILENBQVMsS0FBSyxlQUFkLEdBQTFCO0FBQ0g7QUFDRCxnQkFBSSxhQUFhLEtBQUssS0FBdEI7QUFDQSxnQkFBSSxjQUFjLE9BQU8sVUFBUCxLQUFzQixRQUFwQyxJQUFnRCxzQkFBc0IsTUFBMUUsRUFBaUY7QUFDN0UscUJBQUssSUFBTCxDQUFVLEtBQVYsR0FBa0IsVUFBbEI7QUFDSCxhQUZELE1BRU0sSUFBRyxLQUFLLElBQUwsQ0FBVSxhQUFiLEVBQTJCO0FBQzdCLHFCQUFLLElBQUwsQ0FBVSxLQUFWLEdBQWtCO0FBQUEsMkJBQU0sS0FBSyxJQUFMLENBQVUsYUFBVixDQUF3QixFQUFFLEdBQTFCLENBQU47QUFBQSxpQkFBbEI7QUFDSDs7QUFFRCxtQkFBTyxJQUFQO0FBQ0g7OztpQ0FJTzs7QUFFSixnQkFBSSxPQUFPLEtBQUssSUFBaEI7QUFDQSxnQkFBSSxJQUFJLEtBQUssQ0FBYjtBQUNBLGdCQUFJLE9BQU8sS0FBSyxNQUFMLENBQVksQ0FBdkI7Ozs7Ozs7O0FBUUEsY0FBRSxLQUFGLEdBQVU7QUFBQSx1QkFBSyxLQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsS0FBSyxHQUFuQixDQUFMO0FBQUEsYUFBVjtBQUNBLGNBQUUsS0FBRixHQUFVLEdBQUcsS0FBSCxDQUFTLE9BQVQsR0FBbUIsZUFBbkIsQ0FBbUMsQ0FBQyxDQUFELEVBQUksS0FBSyxLQUFULENBQW5DLEVBQW9ELEdBQXBELENBQVY7QUFDQSxjQUFFLEdBQUYsR0FBUTtBQUFBLHVCQUFLLEVBQUUsS0FBRixDQUFRLEVBQUUsS0FBRixDQUFRLENBQVIsQ0FBUixDQUFMO0FBQUEsYUFBUjs7QUFFQSxjQUFFLElBQUYsR0FBUyxHQUFHLEdBQUgsQ0FBTyxJQUFQLEdBQWMsS0FBZCxDQUFvQixFQUFFLEtBQXRCLEVBQTZCLE1BQTdCLENBQW9DLEtBQUssTUFBekMsQ0FBVDs7QUFFQSxnQkFBSSxPQUFPLEtBQUssSUFBaEI7QUFDQSxnQkFBSSxNQUFKO0FBQ0EsZ0JBQUcsQ0FBQyxLQUFLLE1BQUwsQ0FBWSxNQUFoQixFQUF1QjtBQUNuQix5QkFBUyxHQUFHLEdBQUgsQ0FBTyxJQUFQLEVBQWEsRUFBRSxLQUFmLEVBQXNCLElBQXRCLEVBQVQ7QUFDSCxhQUZELE1BRUs7QUFDRCx5QkFBUyxHQUFHLEdBQUgsQ0FBTyxLQUFLLENBQUwsRUFBUSxNQUFmLEVBQXVCLEVBQUUsS0FBekIsRUFBZ0MsSUFBaEMsRUFBVDtBQUNIOztBQUVELGlCQUFLLENBQUwsQ0FBTyxLQUFQLENBQWEsTUFBYixDQUFvQixNQUFwQjtBQUNBLG9CQUFRLEdBQVIsQ0FBWSxzQkFBWixFQUFvQyxLQUFLLENBQUwsQ0FBTyxLQUFQLENBQWEsTUFBYixFQUFwQztBQUVIOzs7aUNBRVE7O0FBRUwsZ0JBQUksT0FBTyxLQUFLLElBQWhCO0FBQ0EsZ0JBQUksSUFBSSxLQUFLLENBQWI7QUFDQSxnQkFBSSxPQUFPLEtBQUssTUFBTCxDQUFZLENBQXZCO0FBQ0EsY0FBRSxLQUFGLEdBQVU7QUFBQSx1QkFBSyxLQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsS0FBSyxHQUFuQixDQUFMO0FBQUEsYUFBVjtBQUNBLGNBQUUsS0FBRixHQUFVLEdBQUcsS0FBSCxDQUFTLEtBQUssS0FBZCxJQUF1QixLQUF2QixDQUE2QixDQUFDLEtBQUssTUFBTixFQUFjLENBQWQsQ0FBN0IsQ0FBVjtBQUNBLGNBQUUsR0FBRixHQUFRO0FBQUEsdUJBQUssRUFBRSxLQUFGLENBQVEsRUFBRSxLQUFGLENBQVEsQ0FBUixDQUFSLENBQUw7QUFBQSxhQUFSOztBQUVBLGNBQUUsSUFBRixHQUFTLEdBQUcsR0FBSCxDQUFPLElBQVAsR0FBYyxLQUFkLENBQW9CLEVBQUUsS0FBdEIsRUFBNkIsTUFBN0IsQ0FBb0MsS0FBSyxNQUF6QyxDQUFUO0FBQ0EsZ0JBQUcsS0FBSyxLQUFSLEVBQWM7QUFDVixrQkFBRSxJQUFGLENBQU8sS0FBUCxDQUFhLEtBQUssS0FBbEI7QUFDSDtBQUNKOzs7dUNBRWM7QUFDWCxnQkFBSSxPQUFPLEtBQUssSUFBaEI7QUFDQSxnQkFBSSxPQUFPLEtBQUssSUFBaEI7QUFDQSxnQkFBSSxNQUFKO0FBQ0EsZ0JBQUksWUFBWSxHQUFHLEdBQUgsQ0FBTyxLQUFLLE1BQVosRUFBb0I7QUFBQSx1QkFBUyxHQUFHLEdBQUgsQ0FBTyxNQUFNLE1BQWIsRUFBcUI7QUFBQSwyQkFBSyxFQUFFLEVBQUYsR0FBTyxFQUFFLENBQWQ7QUFBQSxpQkFBckIsQ0FBVDtBQUFBLGFBQXBCLENBQWhCO0FBQ0EsZ0JBQUcsQ0FBQyxLQUFLLE1BQUwsQ0FBWSxNQUFoQixFQUF1QjtBQUNuQix5QkFBUyxDQUFDLEdBQUcsR0FBSCxDQUFPLElBQVAsRUFBYSxLQUFLLENBQUwsQ0FBTyxLQUFwQixDQUFELEVBQTZCLEdBQUcsR0FBSCxDQUFPLElBQVAsRUFBYSxLQUFLLENBQUwsQ0FBTyxLQUFwQixDQUE3QixDQUFUO0FBQ0gsYUFGRCxNQUVLOzs7QUFHRCxvQkFBSSxNQUFNLFNBQVY7QUFDQSx5QkFBUyxDQUFDLENBQUQsRUFBSSxHQUFKLENBQVQ7QUFDSDtBQUNELGlCQUFLLENBQUwsQ0FBTyxLQUFQLENBQWEsTUFBYixDQUFvQixNQUFwQjtBQUNBLG9CQUFRLEdBQVIsQ0FBWSxzQkFBWixFQUFvQyxLQUFLLENBQUwsQ0FBTyxLQUFQLENBQWEsTUFBYixFQUFwQztBQUNIOzs7b0NBQ1U7QUFDUCxnQkFBSSxPQUFLLElBQVQ7QUFDQSxpQkFBSyxJQUFMLENBQVUsZUFBVixHQUE0QixLQUFLLE1BQUwsQ0FBWSxNQUF4QztBQUNBLGdCQUFJLE9BQU8sS0FBSyxJQUFoQjtBQUNBLGdCQUFHLENBQUMsS0FBSyxJQUFMLENBQVUsZUFBZCxFQUErQjtBQUMzQixxQkFBSyxJQUFMLENBQVUsV0FBVixHQUF5QixDQUFDO0FBQ3RCLHlCQUFLLE1BRGlCO0FBRXRCLDRCQUFRLEtBQUssV0FBTCxDQUFpQixJQUFqQjtBQUZjLGlCQUFELENBQXpCO0FBSUgsYUFMRCxNQUtLOztBQUVELHFCQUFLLElBQUwsQ0FBVSxXQUFWLEdBQXlCLEtBQUssR0FBTCxDQUFTLGFBQUc7QUFDakMsMkJBQU07QUFDRiw2QkFBSyxFQUFFLEdBREw7QUFFRixnQ0FBUSxLQUFLLFdBQUwsQ0FBaUIsRUFBRSxNQUFuQjtBQUZOLHFCQUFOO0FBSUgsaUJBTHdCLENBQXpCO0FBT0g7QUFDSjs7OzJDQUNrQjtBQUNmLGdCQUFJLE9BQUssSUFBVDtBQUNBLGlCQUFLLFNBQUw7O0FBRUEsaUJBQUssSUFBTCxDQUFVLEtBQVYsR0FBa0IsR0FBRyxNQUFILENBQVUsS0FBVixHQUFrQixNQUFsQixDQUF5QjtBQUFBLHVCQUFHLEVBQUUsTUFBTDtBQUFBLGFBQXpCLENBQWxCO0FBQ0EsaUJBQUssSUFBTCxDQUFVLE1BQVYsR0FBbUIsS0FBSyxJQUFMLENBQVUsS0FBVixDQUFnQixLQUFLLElBQUwsQ0FBVSxXQUExQixDQUFuQjtBQUVIOzs7b0NBRVcsTSxFQUFPO0FBQ2YsZ0JBQUksT0FBTyxLQUFLLElBQWhCO0FBQ0EsbUJBQU8sT0FBTyxHQUFQLENBQVcsYUFBRztBQUNqQix1QkFBTztBQUNILHVCQUFHLEtBQUssQ0FBTCxDQUFPLEtBQVAsQ0FBYSxDQUFiLENBREE7QUFFSCx1QkFBRyxLQUFLLENBQUwsQ0FBTyxLQUFQLENBQWEsQ0FBYjtBQUZBLGlCQUFQO0FBSUgsYUFMTSxDQUFQO0FBTUg7OztvQ0FFVTtBQUNQLGdCQUFJLE9BQU8sSUFBWDtBQUNBLGdCQUFJLE9BQU8sS0FBSyxJQUFoQjtBQUNBLGdCQUFJLFdBQVcsS0FBSyxNQUFMLENBQVksQ0FBM0I7QUFDQSxnQkFBSSxPQUFPLEtBQUssSUFBTCxDQUFVLGNBQVYsQ0FBeUIsT0FBSyxLQUFLLFdBQUwsQ0FBaUIsUUFBakIsQ0FBTCxHQUFnQyxHQUFoQyxHQUFvQyxLQUFLLFdBQUwsQ0FBaUIsTUFBakIsQ0FBcEMsSUFBOEQsS0FBSyxNQUFMLENBQVksTUFBWixHQUFxQixFQUFyQixHQUEwQixNQUFJLEtBQUssV0FBTCxDQUFpQixXQUFqQixDQUE1RixDQUF6QixFQUNOLElBRE0sQ0FDRCxXQURDLEVBQ1ksaUJBQWlCLEtBQUssTUFBdEIsR0FBK0IsR0FEM0MsQ0FBWDs7QUFHQSxnQkFBSSxRQUFRLElBQVo7QUFDQSxnQkFBSSxLQUFLLE1BQUwsQ0FBWSxVQUFoQixFQUE0QjtBQUN4Qix3QkFBUSxLQUFLLFVBQUwsR0FBa0IsSUFBbEIsQ0FBdUIsWUFBdkIsQ0FBUjtBQUNIOztBQUVELGtCQUFNLElBQU4sQ0FBVyxLQUFLLENBQUwsQ0FBTyxJQUFsQjs7QUFFQSxpQkFBSyxjQUFMLENBQW9CLFVBQVEsS0FBSyxXQUFMLENBQWlCLE9BQWpCLENBQTVCLEVBQ0ssSUFETCxDQUNVLFdBRFYsRUFDdUIsZUFBZSxLQUFLLEtBQUwsR0FBVyxDQUExQixHQUE4QixHQUE5QixHQUFvQyxLQUFLLE1BQUwsQ0FBWSxNQUFoRCxHQUF5RCxHQURoRixDO0FBQUEsYUFFSyxJQUZMLENBRVUsSUFGVixFQUVnQixNQUZoQixFQUdLLEtBSEwsQ0FHVyxhQUhYLEVBRzBCLFFBSDFCLEVBSUssSUFKTCxDQUlVLFNBQVMsS0FKbkI7QUFLSDs7O29DQUVVO0FBQ1AsZ0JBQUksT0FBTyxJQUFYO0FBQ0EsZ0JBQUksT0FBTyxLQUFLLElBQWhCO0FBQ0EsZ0JBQUksV0FBVyxLQUFLLE1BQUwsQ0FBWSxDQUEzQjtBQUNBLGdCQUFJLE9BQU8sS0FBSyxJQUFMLENBQVUsY0FBVixDQUF5QixPQUFLLEtBQUssV0FBTCxDQUFpQixRQUFqQixDQUFMLEdBQWdDLEdBQWhDLEdBQW9DLEtBQUssV0FBTCxDQUFpQixNQUFqQixDQUFwQyxJQUE4RCxLQUFLLE1BQUwsQ0FBWSxNQUFaLEdBQXFCLEVBQXJCLEdBQTBCLE1BQUksS0FBSyxXQUFMLENBQWlCLFdBQWpCLENBQTVGLENBQXpCLENBQVg7O0FBRUEsZ0JBQUksUUFBUSxJQUFaO0FBQ0EsZ0JBQUksS0FBSyxNQUFMLENBQVksVUFBaEIsRUFBNEI7QUFDeEIsd0JBQVEsS0FBSyxVQUFMLEdBQWtCLElBQWxCLENBQXVCLFlBQXZCLENBQVI7QUFDSDs7QUFFRCxrQkFBTSxJQUFOLENBQVcsS0FBSyxDQUFMLENBQU8sSUFBbEI7O0FBRUEsaUJBQUssY0FBTCxDQUFvQixVQUFRLEtBQUssV0FBTCxDQUFpQixPQUFqQixDQUE1QixFQUNLLElBREwsQ0FDVSxXQURWLEVBQ3VCLGVBQWMsQ0FBQyxLQUFLLE1BQUwsQ0FBWSxJQUEzQixHQUFpQyxHQUFqQyxHQUFzQyxLQUFLLE1BQUwsR0FBWSxDQUFsRCxHQUFxRCxjQUQ1RSxDO0FBQUEsYUFFSyxJQUZMLENBRVUsSUFGVixFQUVnQixLQUZoQixFQUdLLEtBSEwsQ0FHVyxhQUhYLEVBRzBCLFFBSDFCLEVBSUssSUFKTCxDQUlVLFNBQVMsS0FKbkI7QUFLSDs7O21DQUdVO0FBQ1AsZ0JBQUksT0FBTyxJQUFYO0FBQ0EsZ0JBQUksT0FBTyxLQUFLLElBQWhCOztBQUVBLG9CQUFRLEdBQVIsQ0FBWSxLQUFLLE1BQWpCOztBQUVBLGdCQUFJLGFBQWEsS0FBSyxXQUFMLENBQWlCLE9BQWpCLENBQWpCOztBQUVBLGdCQUFJLFdBQVcsS0FBSyxXQUFMLENBQWlCLEtBQWpCLENBQWY7QUFDQSxnQkFBSSxRQUFRLEtBQUssSUFBTCxDQUFVLFNBQVYsQ0FBb0IsTUFBSSxVQUF4QixFQUNQLElBRE8sQ0FDRixLQUFLLE1BREgsQ0FBWjs7QUFHQSxrQkFBTSxLQUFOLEdBQWMsTUFBZCxDQUFxQixHQUFyQixFQUNLLElBREwsQ0FDVSxPQURWLEVBQ21CLFVBRG5COztBQUdBLGdCQUFJLE1BQU0sTUFBTSxTQUFOLENBQWdCLE1BQUksUUFBcEIsRUFDTCxJQURLLENBQ0E7QUFBQSx1QkFBSyxFQUFFLE1BQVA7QUFBQSxhQURBLENBQVY7O0FBR0EsZ0JBQUksS0FBSixHQUFZLE1BQVosQ0FBbUIsR0FBbkIsRUFDSyxJQURMLENBQ1UsT0FEVixFQUNtQixRQURuQixFQUVLLE1BRkwsQ0FFWSxNQUZaLEVBR0ssSUFITCxDQUdVLEdBSFYsRUFHZSxDQUhmOztBQU1BLGdCQUFJLFVBQVUsSUFBSSxNQUFKLENBQVcsTUFBWCxDQUFkOztBQUVBLGdCQUFJLFdBQVcsT0FBZjtBQUNBLGdCQUFJLE9BQU8sR0FBWDtBQUNBLGdCQUFJLFNBQVMsS0FBYjtBQUNBLGdCQUFJLEtBQUssaUJBQUwsRUFBSixFQUE4QjtBQUMxQiwyQkFBVyxRQUFRLFVBQVIsRUFBWDtBQUNBLHVCQUFPLElBQUksVUFBSixFQUFQO0FBQ0EseUJBQVEsTUFBTSxVQUFOLEVBQVI7QUFDSDs7QUFFRCxnQkFBSSxVQUFVLEtBQUssQ0FBTCxDQUFPLEtBQVAsQ0FBYSxNQUFiLEVBQWQ7QUFDQSxpQkFBSyxJQUFMLENBQVUsV0FBVixFQUF1QixVQUFTLENBQVQsRUFBWTtBQUFFLHVCQUFPLGVBQWUsS0FBSyxDQUFMLENBQU8sS0FBUCxDQUFhLEVBQUUsQ0FBZixDQUFmLEdBQW1DLEdBQW5DLEdBQTBDLEtBQUssQ0FBTCxDQUFPLEtBQVAsQ0FBYSxFQUFFLEVBQUYsR0FBSyxFQUFFLENBQXBCLENBQTFDLEdBQXFFLEdBQTVFO0FBQWtGLGFBQXZIOztBQUVBLHFCQUNLLElBREwsQ0FDVSxPQURWLEVBQ29CLEtBQUssQ0FBTCxDQUFPLEtBQVAsQ0FBYSxTQUFiLEVBRHBCLEVBRUssSUFGTCxDQUVVLFFBRlYsRUFFb0I7QUFBQSx1QkFBTyxLQUFLLENBQUwsQ0FBTyxLQUFQLENBQWEsRUFBRSxFQUFmLElBQXNCLEtBQUssQ0FBTCxDQUFPLEtBQVAsQ0FBYSxFQUFFLEVBQUYsR0FBTyxFQUFFLENBQVQsR0FBYSxRQUFRLENBQVIsQ0FBMUIsQ0FBN0I7QUFBQSxhQUZwQjs7QUFLQSxnQkFBRyxLQUFLLElBQUwsQ0FBVSxLQUFiLEVBQW1CO0FBQ2YsdUJBQ0ssSUFETCxDQUNVLE1BRFYsRUFDa0IsS0FBSyxJQUFMLENBQVUsS0FENUI7QUFFSDs7QUFFRCxnQkFBSSxLQUFLLE9BQVQsRUFBa0I7QUFDZCxvQkFBSSxFQUFKLENBQU8sV0FBUCxFQUFvQixhQUFLO0FBQ3JCLHlCQUFLLE9BQUwsQ0FBYSxVQUFiLEdBQ0ssUUFETCxDQUNjLEdBRGQsRUFFSyxLQUZMLENBRVcsU0FGWCxFQUVzQixFQUZ0QjtBQUdBLHlCQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLEVBQUUsQ0FBcEIsRUFDSyxLQURMLENBQ1csTUFEWCxFQUNvQixHQUFHLEtBQUgsQ0FBUyxLQUFULEdBQWlCLENBQWxCLEdBQXVCLElBRDFDLEVBRUssS0FGTCxDQUVXLEtBRlgsRUFFbUIsR0FBRyxLQUFILENBQVMsS0FBVCxHQUFpQixFQUFsQixHQUF3QixJQUYxQztBQUdILGlCQVBELEVBT0csRUFQSCxDQU9NLFVBUE4sRUFPa0IsYUFBSztBQUNuQix5QkFBSyxPQUFMLENBQWEsVUFBYixHQUNLLFFBREwsQ0FDYyxHQURkLEVBRUssS0FGTCxDQUVXLFNBRlgsRUFFc0IsQ0FGdEI7QUFHSCxpQkFYRDtBQVlIO0FBQ0Qsa0JBQU0sSUFBTixHQUFhLE1BQWI7QUFDQSxnQkFBSSxJQUFKLEdBQVcsTUFBWDtBQUNIOzs7K0JBRU0sTyxFQUFRO0FBQ1gsdUZBQWEsT0FBYjtBQUNBLGlCQUFLLFNBQUw7QUFDQSxpQkFBSyxTQUFMOztBQUVBLGlCQUFLLFFBQUw7O0FBRUEsaUJBQUssWUFBTDtBQUNIOzs7dUNBR2M7QUFDWCxnQkFBSSxPQUFPLEtBQUssSUFBaEI7O0FBRUEsZ0JBQUksUUFBUSxLQUFLLGFBQWpCO0FBQ0EsZ0JBQUcsQ0FBQyxNQUFNLE1BQU4sRUFBRCxJQUFtQixNQUFNLE1BQU4sR0FBZSxNQUFmLEdBQXNCLENBQTVDLEVBQThDO0FBQzFDLHFCQUFLLFVBQUwsR0FBa0IsS0FBbEI7QUFDSDs7QUFFRCxnQkFBRyxDQUFDLEtBQUssVUFBVCxFQUFvQjtBQUNoQixvQkFBRyxLQUFLLE1BQUwsSUFBZSxLQUFLLE1BQUwsQ0FBWSxTQUE5QixFQUF3QztBQUNwQyx5QkFBSyxNQUFMLENBQVksU0FBWixDQUFzQixNQUF0QjtBQUNIO0FBQ0Q7QUFDSDs7QUFHRCxnQkFBSSxVQUFVLEtBQUssSUFBTCxDQUFVLEtBQVYsR0FBa0IsS0FBSyxNQUFMLENBQVksTUFBWixDQUFtQixNQUFuRDtBQUNBLGdCQUFJLFVBQVUsS0FBSyxNQUFMLENBQVksTUFBWixDQUFtQixNQUFqQzs7QUFFQSxpQkFBSyxNQUFMLEdBQWMsbUJBQVcsS0FBSyxHQUFoQixFQUFxQixLQUFLLElBQTFCLEVBQWdDLEtBQWhDLEVBQXVDLE9BQXZDLEVBQWdELE9BQWhELENBQWQ7O0FBRUEsZ0JBQUksZUFBZSxLQUFLLE1BQUwsQ0FBWSxLQUFaLEdBQ2QsVUFEYyxDQUNILEtBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsVUFEaEIsRUFFZCxNQUZjLENBRVAsVUFGTyxFQUdkLEtBSGMsQ0FHUixLQUhRLENBQW5COztBQUtBLGlCQUFLLE1BQUwsQ0FBWSxTQUFaLENBQ0ssSUFETCxDQUNVLFlBRFY7QUFFSDs7Ozs7Ozs7Ozs7Ozs7OztBQ3hWTDs7OztJQUdhLFcsV0FBQSxXLEdBY1QscUJBQVksTUFBWixFQUFvQjtBQUFBOztBQUFBLFNBYnBCLGNBYW9CLEdBYkgsTUFhRztBQUFBLFNBWnBCLFFBWW9CLEdBWlQsS0FBSyxjQUFMLEdBQXNCLGFBWWI7QUFBQSxTQVhwQixLQVdvQixHQVhaLFNBV1k7QUFBQSxTQVZwQixNQVVvQixHQVZYLFNBVVc7QUFBQSxTQVRwQixNQVNvQixHQVRYO0FBQ0wsY0FBTSxFQUREO0FBRUwsZUFBTyxFQUZGO0FBR0wsYUFBSyxFQUhBO0FBSUwsZ0JBQVE7QUFKSCxLQVNXO0FBQUEsU0FIcEIsV0FHb0IsR0FITixLQUdNO0FBQUEsU0FGcEIsVUFFb0IsR0FGUCxJQUVPOztBQUNoQixRQUFJLE1BQUosRUFBWTtBQUNSLHFCQUFNLFVBQU4sQ0FBaUIsSUFBakIsRUFBdUIsTUFBdkI7QUFDSDtBQUNKLEM7O0lBS1EsSyxXQUFBLEs7QUFlVCxtQkFBWSxJQUFaLEVBQWtCLElBQWxCLEVBQXdCLE1BQXhCLEVBQWdDO0FBQUE7O0FBQUEsYUFkaEMsS0FjZ0M7QUFBQSxhQVZoQyxJQVVnQyxHQVZ6QjtBQUNILG9CQUFRO0FBREwsU0FVeUI7QUFBQSxhQVBoQyxTQU9nQyxHQVBwQixFQU9vQjtBQUFBLGFBTmhDLE9BTWdDLEdBTnRCLEVBTXNCO0FBQUEsYUFMaEMsT0FLZ0MsR0FMdEIsRUFLc0I7QUFBQSxhQUhoQyxjQUdnQyxHQUhqQixLQUdpQjs7O0FBRTVCLGFBQUssV0FBTCxHQUFtQixnQkFBZ0IsS0FBbkM7O0FBRUEsYUFBSyxhQUFMLEdBQXFCLElBQXJCOztBQUVBLGFBQUssU0FBTCxDQUFlLE1BQWY7O0FBRUEsWUFBSSxJQUFKLEVBQVU7QUFDTixpQkFBSyxPQUFMLENBQWEsSUFBYjtBQUNIOztBQUVELGFBQUssSUFBTDtBQUNBLGFBQUssUUFBTDtBQUNIOzs7O2tDQUVTLE0sRUFBUTtBQUNkLGdCQUFJLENBQUMsTUFBTCxFQUFhO0FBQ1QscUJBQUssTUFBTCxHQUFjLElBQUksV0FBSixFQUFkO0FBQ0gsYUFGRCxNQUVPO0FBQ0gscUJBQUssTUFBTCxHQUFjLE1BQWQ7QUFDSDs7QUFFRCxtQkFBTyxJQUFQO0FBQ0g7OztnQ0FFTyxJLEVBQU07QUFDVixpQkFBSyxJQUFMLEdBQVksSUFBWjtBQUNBLG1CQUFPLElBQVA7QUFDSDs7OytCQUVNO0FBQ0gsZ0JBQUksT0FBTyxJQUFYOztBQUdBLGlCQUFLLFFBQUw7QUFDQSxpQkFBSyxPQUFMOztBQUVBLGlCQUFLLFdBQUw7QUFDQSxpQkFBSyxJQUFMO0FBQ0EsaUJBQUssY0FBTCxHQUFvQixJQUFwQjtBQUNBLG1CQUFPLElBQVA7QUFDSDs7O21DQUVTLENBRVQ7OztrQ0FFUztBQUNOLGdCQUFJLE9BQU8sSUFBWDtBQUNBLGdCQUFJLFNBQVMsS0FBSyxNQUFsQjtBQUNBLG9CQUFRLEdBQVIsQ0FBWSxPQUFPLFFBQW5COztBQUVBLGdCQUFJLFNBQVMsS0FBSyxJQUFMLENBQVUsTUFBdkI7QUFDQSxnQkFBSSxRQUFRLEtBQUssSUFBTCxDQUFVLEtBQVYsR0FBa0IsT0FBTyxJQUF6QixHQUFnQyxPQUFPLEtBQW5EO0FBQ0EsZ0JBQUksU0FBUyxLQUFLLElBQUwsQ0FBVSxNQUFWLEdBQW1CLE9BQU8sR0FBMUIsR0FBZ0MsT0FBTyxNQUFwRDtBQUNBLGdCQUFJLFNBQVMsUUFBUSxNQUFyQjtBQUNBLGdCQUFHLENBQUMsS0FBSyxXQUFULEVBQXFCO0FBQ2pCLG9CQUFHLENBQUMsS0FBSyxjQUFULEVBQXdCO0FBQ3BCLHVCQUFHLE1BQUgsQ0FBVSxLQUFLLGFBQWYsRUFBOEIsTUFBOUIsQ0FBcUMsS0FBckMsRUFBNEMsTUFBNUM7QUFDSDtBQUNELHFCQUFLLEdBQUwsR0FBVyxHQUFHLE1BQUgsQ0FBVSxLQUFLLGFBQWYsRUFBOEIsY0FBOUIsQ0FBNkMsS0FBN0MsQ0FBWDs7QUFFQSxxQkFBSyxHQUFMLENBQ0ssSUFETCxDQUNVLE9BRFYsRUFDbUIsS0FEbkIsRUFFSyxJQUZMLENBRVUsUUFGVixFQUVvQixNQUZwQixFQUdLLElBSEwsQ0FHVSxTQUhWLEVBR3FCLFNBQVMsR0FBVCxHQUFlLEtBQWYsR0FBdUIsR0FBdkIsR0FBNkIsTUFIbEQsRUFJSyxJQUpMLENBSVUscUJBSlYsRUFJaUMsZUFKakMsRUFLSyxJQUxMLENBS1UsT0FMVixFQUttQixPQUFPLFFBTDFCO0FBTUEscUJBQUssSUFBTCxHQUFZLEtBQUssR0FBTCxDQUFTLGNBQVQsQ0FBd0IsY0FBeEIsQ0FBWjtBQUNILGFBYkQsTUFhSztBQUNELHdCQUFRLEdBQVIsQ0FBWSxLQUFLLGFBQWpCO0FBQ0EscUJBQUssR0FBTCxHQUFXLEtBQUssYUFBTCxDQUFtQixHQUE5QjtBQUNBLHFCQUFLLElBQUwsR0FBWSxLQUFLLEdBQUwsQ0FBUyxjQUFULENBQXdCLGtCQUFnQixPQUFPLFFBQS9DLENBQVo7QUFDSDs7QUFFRCxpQkFBSyxJQUFMLENBQVUsSUFBVixDQUFlLFdBQWYsRUFBNEIsZUFBZSxPQUFPLElBQXRCLEdBQTZCLEdBQTdCLEdBQW1DLE9BQU8sR0FBMUMsR0FBZ0QsR0FBNUU7O0FBRUEsZ0JBQUksQ0FBQyxPQUFPLEtBQVIsSUFBaUIsT0FBTyxNQUE1QixFQUFvQztBQUNoQyxtQkFBRyxNQUFILENBQVUsTUFBVixFQUNLLEVBREwsQ0FDUSxRQURSLEVBQ2tCLFlBQVk7O0FBRXpCLGlCQUhMO0FBSUg7QUFDSjs7O3NDQUVZO0FBQ1QsZ0JBQUksT0FBTyxJQUFYO0FBQ0EsZ0JBQUksS0FBSyxNQUFMLENBQVksV0FBaEIsRUFBNkI7QUFDekIsb0JBQUcsQ0FBQyxLQUFLLFdBQVQsRUFBc0I7QUFDbEIseUJBQUssSUFBTCxDQUFVLE9BQVYsR0FBb0IsR0FBRyxNQUFILENBQVUsTUFBVixFQUFrQixjQUFsQixDQUFpQyxTQUFPLEtBQUssTUFBTCxDQUFZLGNBQW5CLEdBQWtDLFNBQW5FLEVBQ2YsS0FEZSxDQUNULFNBRFMsRUFDRSxDQURGLENBQXBCO0FBRUgsaUJBSEQsTUFHSztBQUNELHlCQUFLLElBQUwsQ0FBVSxPQUFWLEdBQW1CLEtBQUssYUFBTCxDQUFtQixJQUFuQixDQUF3QixPQUEzQztBQUNIO0FBRUo7QUFDSjs7O21DQUVVO0FBQ1AsZ0JBQUksU0FBUyxLQUFLLE1BQUwsQ0FBWSxNQUF6QjtBQUNBLGlCQUFLLElBQUwsR0FBWSxLQUFLLElBQUwsSUFBYSxFQUF6QjtBQUNBLGlCQUFLLElBQUwsQ0FBVSxNQUFWLEdBQW1CO0FBQ2YscUJBQUssT0FBTyxHQURHO0FBRWYsd0JBQVEsT0FBTyxNQUZBO0FBR2Ysc0JBQU0sT0FBTyxJQUhFO0FBSWYsdUJBQU8sT0FBTztBQUpDLGFBQW5CO0FBTUg7OzsrQkFFTSxJLEVBQU07QUFDVCxnQkFBSSxJQUFKLEVBQVU7QUFDTixxQkFBSyxPQUFMLENBQWEsSUFBYjtBQUNIO0FBQ0QsZ0JBQUksU0FBSixFQUFlLGNBQWY7QUFDQSxpQkFBSyxJQUFJLGNBQVQsSUFBMkIsS0FBSyxTQUFoQyxFQUEyQzs7QUFFdkMsaUNBQWlCLElBQWpCOztBQUVBLHFCQUFLLFNBQUwsQ0FBZSxjQUFmLEVBQStCLE1BQS9CLENBQXNDLGNBQXRDO0FBQ0g7QUFDRCxtQkFBTyxJQUFQO0FBQ0g7Ozs2QkFFSSxJLEVBQU07QUFDUCxpQkFBSyxNQUFMLENBQVksSUFBWjs7QUFHQSxtQkFBTyxJQUFQO0FBQ0g7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OytCQWtCTSxjLEVBQWdCLEssRUFBTztBQUMxQixnQkFBSSxVQUFVLE1BQVYsS0FBcUIsQ0FBekIsRUFBNEI7QUFDeEIsdUJBQU8sS0FBSyxTQUFMLENBQWUsY0FBZixDQUFQO0FBQ0g7O0FBRUQsaUJBQUssU0FBTCxDQUFlLGNBQWYsSUFBaUMsS0FBakM7QUFDQSxtQkFBTyxLQUFQO0FBQ0g7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzJCQW1CRSxJLEVBQU0sUSxFQUFVLE8sRUFBUztBQUN4QixnQkFBSSxTQUFTLEtBQUssT0FBTCxDQUFhLElBQWIsTUFBdUIsS0FBSyxPQUFMLENBQWEsSUFBYixJQUFxQixFQUE1QyxDQUFiO0FBQ0EsbUJBQU8sSUFBUCxDQUFZO0FBQ1IsMEJBQVUsUUFERjtBQUVSLHlCQUFTLFdBQVcsSUFGWjtBQUdSLHdCQUFRO0FBSEEsYUFBWjtBQUtBLG1CQUFPLElBQVA7QUFDSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NkJBb0JJLEksRUFBTSxRLEVBQVUsTyxFQUFTO0FBQzFCLGdCQUFJLE9BQU8sSUFBWDtBQUNBLGdCQUFJLE9BQU8sU0FBUCxJQUFPLEdBQVk7QUFDbkIscUJBQUssR0FBTCxDQUFTLElBQVQsRUFBZSxJQUFmO0FBQ0EseUJBQVMsS0FBVCxDQUFlLElBQWYsRUFBcUIsU0FBckI7QUFDSCxhQUhEO0FBSUEsbUJBQU8sS0FBSyxFQUFMLENBQVEsSUFBUixFQUFjLElBQWQsRUFBb0IsT0FBcEIsQ0FBUDtBQUNIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0QkFzQkcsSSxFQUFNLFEsRUFBVSxPLEVBQVM7QUFDekIsZ0JBQUksS0FBSixFQUFXLENBQVgsRUFBYyxNQUFkLEVBQXNCLEtBQXRCLEVBQTZCLENBQTdCLEVBQWdDLENBQWhDOzs7QUFHQSxnQkFBSSxVQUFVLE1BQVYsS0FBcUIsQ0FBekIsRUFBNEI7QUFDeEIscUJBQUssSUFBTCxJQUFhLEtBQUssT0FBbEIsRUFBMkI7QUFDdkIseUJBQUssT0FBTCxDQUFhLElBQWIsRUFBbUIsTUFBbkIsR0FBNEIsQ0FBNUI7QUFDSDtBQUNELHVCQUFPLElBQVA7QUFDSDs7O0FBR0QsZ0JBQUksVUFBVSxNQUFWLEtBQXFCLENBQXpCLEVBQTRCO0FBQ3hCLHlCQUFTLEtBQUssT0FBTCxDQUFhLElBQWIsQ0FBVDtBQUNBLG9CQUFJLE1BQUosRUFBWTtBQUNSLDJCQUFPLE1BQVAsR0FBZ0IsQ0FBaEI7QUFDSDtBQUNELHVCQUFPLElBQVA7QUFDSDs7OztBQUlELG9CQUFRLE9BQU8sQ0FBQyxJQUFELENBQVAsR0FBZ0IsT0FBTyxJQUFQLENBQVksS0FBSyxPQUFqQixDQUF4QjtBQUNBLGlCQUFLLElBQUksQ0FBVCxFQUFZLElBQUksTUFBTSxNQUF0QixFQUE4QixHQUE5QixFQUFtQztBQUMvQixvQkFBSSxNQUFNLENBQU4sQ0FBSjtBQUNBLHlCQUFTLEtBQUssT0FBTCxDQUFhLENBQWIsQ0FBVDtBQUNBLG9CQUFJLE9BQU8sTUFBWDtBQUNBLHVCQUFPLEdBQVAsRUFBWTtBQUNSLDRCQUFRLE9BQU8sQ0FBUCxDQUFSO0FBQ0Esd0JBQUssWUFBWSxhQUFhLE1BQU0sUUFBaEMsSUFDQyxXQUFXLFlBQVksTUFBTSxPQURsQyxFQUM0QztBQUN4QywrQkFBTyxNQUFQLENBQWMsQ0FBZCxFQUFpQixDQUFqQjtBQUNIO0FBQ0o7QUFDSjs7QUFFRCxtQkFBTyxJQUFQO0FBQ0g7Ozs7Ozs7Ozs7Ozs7Ozs7O2dDQWNPLEksRUFBTTtBQUNWLGdCQUFJLE9BQU8sTUFBTSxTQUFOLENBQWdCLEtBQWhCLENBQXNCLElBQXRCLENBQTJCLFNBQTNCLEVBQXNDLENBQXRDLENBQVg7QUFDQSxnQkFBSSxTQUFTLEtBQUssT0FBTCxDQUFhLElBQWIsQ0FBYjtBQUNBLGdCQUFJLENBQUosRUFBTyxFQUFQOztBQUVBLGdCQUFJLFdBQVcsU0FBZixFQUEwQjtBQUN0QixxQkFBSyxJQUFJLENBQVQsRUFBWSxJQUFJLE9BQU8sTUFBdkIsRUFBK0IsR0FBL0IsRUFBb0M7QUFDaEMseUJBQUssT0FBTyxDQUFQLENBQUw7QUFDQSx1QkFBRyxRQUFILENBQVksS0FBWixDQUFrQixHQUFHLE9BQXJCLEVBQThCLElBQTlCO0FBQ0g7QUFDSjs7QUFFRCxtQkFBTyxJQUFQO0FBQ0g7OzsyQ0FDaUI7QUFDZCxnQkFBRyxLQUFLLFdBQVIsRUFBb0I7QUFDaEIsdUJBQU8sS0FBSyxhQUFMLENBQW1CLEdBQTFCO0FBQ0g7QUFDRCxtQkFBTyxHQUFHLE1BQUgsQ0FBVSxLQUFLLGFBQWYsQ0FBUDtBQUNIOzs7K0NBRXFCOztBQUVsQixtQkFBTyxLQUFLLGdCQUFMLEdBQXdCLElBQXhCLEVBQVA7QUFDSDs7O29DQUVXLEssRUFBTyxNLEVBQU87QUFDdEIsbUJBQU8sU0FBUSxHQUFSLEdBQWEsS0FBRyxLQUFLLE1BQUwsQ0FBWSxjQUFmLEdBQThCLEtBQWxEO0FBQ0g7OzswQ0FDaUI7QUFDZCxpQkFBSyxJQUFMLENBQVUsS0FBVixHQUFrQixhQUFNLGNBQU4sQ0FBcUIsS0FBSyxNQUFMLENBQVksS0FBakMsRUFBd0MsS0FBSyxnQkFBTCxFQUF4QyxFQUFpRSxLQUFLLElBQUwsQ0FBVSxNQUEzRSxDQUFsQjtBQUNBLGlCQUFLLElBQUwsQ0FBVSxNQUFWLEdBQW1CLGFBQU0sZUFBTixDQUFzQixLQUFLLE1BQUwsQ0FBWSxNQUFsQyxFQUEwQyxLQUFLLGdCQUFMLEVBQTFDLEVBQW1FLEtBQUssSUFBTCxDQUFVLE1BQTdFLENBQW5CO0FBQ0g7Ozs0Q0FFa0I7QUFDZixtQkFBTyxLQUFLLGNBQUwsSUFBdUIsS0FBSyxNQUFMLENBQVksVUFBMUM7QUFDSDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdFdMOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7OztJQUVhLHVCLFdBQUEsdUI7Ozs7O0FBb0NULHFDQUFZLE1BQVosRUFBb0I7QUFBQTs7QUFBQTs7QUFBQSxjQWxDcEIsUUFrQ29CLEdBbENULE1BQUssY0FBTCxHQUFvQixvQkFrQ1g7QUFBQSxjQWpDcEIsTUFpQ29CLEdBakNYLEtBaUNXO0FBQUEsY0FoQ3BCLFdBZ0NvQixHQWhDTixJQWdDTTtBQUFBLGNBL0JwQixVQStCb0IsR0EvQlAsSUErQk87QUFBQSxjQTlCcEIsZUE4Qm9CLEdBOUJGLElBOEJFO0FBQUEsY0E3QnBCLGFBNkJvQixHQTdCSixJQTZCSTtBQUFBLGNBNUJwQixhQTRCb0IsR0E1QkosSUE0Qkk7QUFBQSxjQTNCcEIsU0EyQm9CLEdBM0JSO0FBQ1Isb0JBQVEsU0FEQTtBQUVSLGtCQUFNLEVBRkUsRTtBQUdSLG1CQUFPLGVBQUMsQ0FBRCxFQUFJLFdBQUo7QUFBQSx1QkFBb0IsRUFBRSxXQUFGLENBQXBCO0FBQUEsYUFIQyxFO0FBSVIsbUJBQU87QUFKQyxTQTJCUTtBQUFBLGNBckJwQixXQXFCb0IsR0FyQk47QUFDVixtQkFBTyxRQURHO0FBRVYsb0JBQVEsQ0FBQyxDQUFDLENBQUYsRUFBSyxDQUFDLElBQU4sRUFBWSxDQUFDLEdBQWIsRUFBa0IsQ0FBbEIsRUFBcUIsR0FBckIsRUFBMEIsSUFBMUIsRUFBZ0MsQ0FBaEMsQ0FGRTtBQUdWLG1CQUFPLENBQUMsVUFBRCxFQUFhLE1BQWIsRUFBcUIsY0FBckIsRUFBcUMsT0FBckMsRUFBOEMsV0FBOUMsRUFBMkQsU0FBM0QsRUFBc0UsU0FBdEUsQ0FIRztBQUlWLG1CQUFPLGVBQUMsT0FBRCxFQUFVLE9BQVY7QUFBQSx1QkFBc0IsaUNBQWdCLGlCQUFoQixDQUFrQyxPQUFsQyxFQUEyQyxPQUEzQyxDQUF0QjtBQUFBOztBQUpHLFNBcUJNO0FBQUEsY0FkcEIsSUFjb0IsR0FkYjtBQUNILG1CQUFPLFNBREosRTtBQUVILGtCQUFNLFNBRkg7QUFHSCxxQkFBUyxFQUhOO0FBSUgscUJBQVMsR0FKTjtBQUtILHFCQUFTO0FBTE4sU0FjYTtBQUFBLGNBUHBCLE1BT29CLEdBUFg7QUFDTCxrQkFBTSxFQUREO0FBRUwsbUJBQU8sRUFGRjtBQUdMLGlCQUFLLEVBSEE7QUFJTCxvQkFBUTtBQUpILFNBT1c7O0FBRWhCLFlBQUksTUFBSixFQUFZO0FBQ1IseUJBQU0sVUFBTixRQUF1QixNQUF2QjtBQUNIO0FBSmU7QUFLbkIsSzs7Ozs7O0lBR1EsaUIsV0FBQSxpQjs7O0FBQ1QsK0JBQVksbUJBQVosRUFBaUMsSUFBakMsRUFBdUMsTUFBdkMsRUFBK0M7QUFBQTs7QUFBQSxvR0FDckMsbUJBRHFDLEVBQ2hCLElBRGdCLEVBQ1YsSUFBSSx1QkFBSixDQUE0QixNQUE1QixDQURVO0FBRTlDOzs7O2tDQUVTLE0sRUFBUTtBQUNkLDBHQUF1QixJQUFJLHVCQUFKLENBQTRCLE1BQTVCLENBQXZCO0FBRUg7OzttQ0FFVTtBQUNQO0FBQ0EsZ0JBQUksT0FBTyxJQUFYO0FBQ0EsZ0JBQUksU0FBUyxLQUFLLE1BQUwsQ0FBWSxNQUF6QjtBQUNBLGdCQUFJLE9BQU8sS0FBSyxNQUFoQjs7QUFFQSxpQkFBSyxJQUFMLENBQVUsQ0FBVixHQUFjLEVBQWQ7QUFDQSxpQkFBSyxJQUFMLENBQVUsV0FBVixHQUF3QjtBQUNwQix3QkFBUSxTQURZO0FBRXBCLHVCQUFPLFNBRmE7QUFHcEIsdUJBQU8sRUFIYTtBQUlwQix1QkFBTztBQUphLGFBQXhCOztBQVFBLGlCQUFLLGNBQUw7QUFDQSxnQkFBSSxRQUFRLEtBQUssS0FBakI7QUFDQSxnQkFBSSxrQkFBa0IsS0FBSyxvQkFBTCxFQUF0QjtBQUNBLGlCQUFLLElBQUwsQ0FBVSxlQUFWLEdBQTRCLGVBQTVCOztBQUVBLGdCQUFJLGNBQWMsZ0JBQWdCLHFCQUFoQixHQUF3QyxLQUExRDtBQUNBLGdCQUFJLEtBQUosRUFBVzs7QUFFUCxvQkFBSSxDQUFDLEtBQUssSUFBTCxDQUFVLFFBQWYsRUFBeUI7QUFDckIseUJBQUssSUFBTCxDQUFVLFFBQVYsR0FBcUIsS0FBSyxHQUFMLENBQVMsS0FBSyxJQUFMLENBQVUsT0FBbkIsRUFBNEIsS0FBSyxHQUFMLENBQVMsS0FBSyxJQUFMLENBQVUsT0FBbkIsRUFBNEIsQ0FBQyxRQUFRLE9BQU8sSUFBZixHQUFzQixPQUFPLEtBQTlCLElBQXVDLEtBQUssSUFBTCxDQUFVLFNBQVYsQ0FBb0IsTUFBdkYsQ0FBNUIsQ0FBckI7QUFDSDtBQUVKLGFBTkQsTUFNTztBQUNILHFCQUFLLElBQUwsQ0FBVSxRQUFWLEdBQXFCLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsSUFBdEM7O0FBRUEsb0JBQUksQ0FBQyxLQUFLLElBQUwsQ0FBVSxRQUFmLEVBQXlCO0FBQ3JCLHlCQUFLLElBQUwsQ0FBVSxRQUFWLEdBQXFCLEtBQUssR0FBTCxDQUFTLEtBQUssSUFBTCxDQUFVLE9BQW5CLEVBQTRCLEtBQUssR0FBTCxDQUFTLEtBQUssSUFBTCxDQUFVLE9BQW5CLEVBQTRCLENBQUMsY0FBYyxPQUFPLElBQXJCLEdBQTRCLE9BQU8sS0FBcEMsSUFBNkMsS0FBSyxJQUFMLENBQVUsU0FBVixDQUFvQixNQUE3RixDQUE1QixDQUFyQjtBQUNIOztBQUVELHdCQUFRLEtBQUssSUFBTCxDQUFVLFFBQVYsR0FBcUIsS0FBSyxJQUFMLENBQVUsU0FBVixDQUFvQixNQUF6QyxHQUFrRCxPQUFPLElBQXpELEdBQWdFLE9BQU8sS0FBL0U7QUFFSDs7QUFFRCxnQkFBSSxTQUFTLEtBQWI7QUFDQSxnQkFBSSxDQUFDLE1BQUwsRUFBYTtBQUNULHlCQUFTLGdCQUFnQixxQkFBaEIsR0FBd0MsTUFBakQ7QUFDSDs7QUFFRCxpQkFBSyxJQUFMLENBQVUsS0FBVixHQUFrQixRQUFRLE9BQU8sSUFBZixHQUFzQixPQUFPLEtBQS9DO0FBQ0EsaUJBQUssSUFBTCxDQUFVLE1BQVYsR0FBbUIsS0FBSyxJQUFMLENBQVUsS0FBN0I7O0FBRUEsaUJBQUssb0JBQUw7QUFDQSxpQkFBSyxzQkFBTDtBQUNBLGlCQUFLLHNCQUFMOztBQUdBLG1CQUFPLElBQVA7QUFDSDs7OytDQUVzQjs7QUFFbkIsZ0JBQUksT0FBTyxLQUFLLElBQWhCO0FBQ0EsZ0JBQUksSUFBSSxLQUFLLENBQWI7QUFDQSxnQkFBSSxPQUFPLEtBQUssTUFBTCxDQUFZLFNBQXZCOzs7Ozs7OztBQVFBLGNBQUUsS0FBRixHQUFVLEtBQUssS0FBZjtBQUNBLGNBQUUsS0FBRixHQUFVLEdBQUcsS0FBSCxDQUFTLEtBQUssS0FBZCxJQUF1QixVQUF2QixDQUFrQyxDQUFDLEtBQUssS0FBTixFQUFhLENBQWIsQ0FBbEMsQ0FBVjtBQUNBLGNBQUUsR0FBRixHQUFRO0FBQUEsdUJBQUssRUFBRSxLQUFGLENBQVEsRUFBRSxLQUFGLENBQVEsQ0FBUixDQUFSLENBQUw7QUFBQSxhQUFSO0FBRUg7OztpREFFd0I7QUFDckIsZ0JBQUksT0FBTyxLQUFLLElBQWhCO0FBQ0EsZ0JBQUksV0FBVyxLQUFLLE1BQUwsQ0FBWSxXQUEzQjs7QUFFQSxpQkFBSyxXQUFMLENBQWlCLEtBQWpCLENBQXVCLEtBQXZCLEdBQStCLEdBQUcsS0FBSCxDQUFTLFNBQVMsS0FBbEIsSUFBMkIsTUFBM0IsQ0FBa0MsU0FBUyxNQUEzQyxFQUFtRCxLQUFuRCxDQUF5RCxTQUFTLEtBQWxFLENBQS9CO0FBQ0EsZ0JBQUksUUFBUSxLQUFLLFdBQUwsQ0FBaUIsS0FBakIsR0FBeUIsRUFBckM7O0FBRUEsZ0JBQUksV0FBVyxLQUFLLE1BQUwsQ0FBWSxJQUEzQjtBQUNBLGtCQUFNLElBQU4sR0FBYSxTQUFTLEtBQXRCOztBQUVBLGdCQUFJLFlBQVksS0FBSyxRQUFMLEdBQWdCLFNBQVMsT0FBVCxHQUFtQixDQUFuRDtBQUNBLGdCQUFJLE1BQU0sSUFBTixJQUFjLFFBQWxCLEVBQTRCO0FBQ3hCLG9CQUFJLFlBQVksWUFBWSxDQUE1QjtBQUNBLHNCQUFNLFdBQU4sR0FBb0IsR0FBRyxLQUFILENBQVMsTUFBVCxHQUFrQixNQUFsQixDQUF5QixDQUFDLENBQUQsRUFBSSxDQUFKLENBQXpCLEVBQWlDLEtBQWpDLENBQXVDLENBQUMsQ0FBRCxFQUFJLFNBQUosQ0FBdkMsQ0FBcEI7QUFDQSxzQkFBTSxNQUFOLEdBQWU7QUFBQSwyQkFBSSxNQUFNLFdBQU4sQ0FBa0IsS0FBSyxHQUFMLENBQVMsRUFBRSxLQUFYLENBQWxCLENBQUo7QUFBQSxpQkFBZjtBQUNILGFBSkQsTUFJTyxJQUFJLE1BQU0sSUFBTixJQUFjLFNBQWxCLEVBQTZCO0FBQ2hDLG9CQUFJLFlBQVksWUFBWSxDQUE1QjtBQUNBLHNCQUFNLFdBQU4sR0FBb0IsR0FBRyxLQUFILENBQVMsTUFBVCxHQUFrQixNQUFsQixDQUF5QixDQUFDLENBQUQsRUFBSSxDQUFKLENBQXpCLEVBQWlDLEtBQWpDLENBQXVDLENBQUMsU0FBRCxFQUFZLENBQVosQ0FBdkMsQ0FBcEI7QUFDQSxzQkFBTSxPQUFOLEdBQWdCO0FBQUEsMkJBQUksTUFBTSxXQUFOLENBQWtCLEtBQUssR0FBTCxDQUFTLEVBQUUsS0FBWCxDQUFsQixDQUFKO0FBQUEsaUJBQWhCO0FBQ0Esc0JBQU0sT0FBTixHQUFnQixTQUFoQjs7QUFFQSxzQkFBTSxTQUFOLEdBQWtCLGFBQUs7QUFDbkIsd0JBQUksS0FBSyxDQUFULEVBQVksT0FBTyxHQUFQO0FBQ1osd0JBQUksSUFBSSxDQUFSLEVBQVcsT0FBTyxLQUFQO0FBQ1gsMkJBQU8sSUFBUDtBQUNILGlCQUpEO0FBS0gsYUFYTSxNQVdBLElBQUksTUFBTSxJQUFOLElBQWMsTUFBbEIsRUFBMEI7QUFDN0Isc0JBQU0sSUFBTixHQUFhLFNBQWI7QUFDSDtBQUVKOzs7eUNBR2dCOztBQUViLGdCQUFJLGdCQUFnQixLQUFLLE1BQUwsQ0FBWSxTQUFoQzs7QUFFQSxnQkFBSSxPQUFPLEtBQUssSUFBaEI7QUFDQSxnQkFBSSxPQUFPLEtBQUssSUFBaEI7QUFDQSxpQkFBSyxnQkFBTCxHQUF3QixFQUF4QjtBQUNBLGlCQUFLLFNBQUwsR0FBaUIsY0FBYyxJQUEvQjtBQUNBLGdCQUFJLENBQUMsS0FBSyxTQUFOLElBQW1CLENBQUMsS0FBSyxTQUFMLENBQWUsTUFBdkMsRUFBK0M7QUFDM0MscUJBQUssU0FBTCxHQUFpQixhQUFNLGNBQU4sQ0FBcUIsSUFBckIsRUFBMkIsS0FBSyxNQUFMLENBQVksTUFBWixDQUFtQixHQUE5QyxFQUFtRCxLQUFLLE1BQUwsQ0FBWSxhQUEvRCxDQUFqQjtBQUNIOztBQUVELGlCQUFLLE1BQUwsR0FBYyxFQUFkO0FBQ0EsaUJBQUssZUFBTCxHQUF1QixFQUF2QjtBQUNBLGlCQUFLLFNBQUwsQ0FBZSxPQUFmLENBQXVCLFVBQUMsV0FBRCxFQUFjLEtBQWQsRUFBd0I7QUFDM0MscUJBQUssZ0JBQUwsQ0FBc0IsV0FBdEIsSUFBcUMsR0FBRyxNQUFILENBQVUsSUFBVixFQUFnQixVQUFDLENBQUQ7QUFBQSwyQkFBTyxjQUFjLEtBQWQsQ0FBb0IsQ0FBcEIsRUFBdUIsV0FBdkIsQ0FBUDtBQUFBLGlCQUFoQixDQUFyQztBQUNBLG9CQUFJLFFBQVEsV0FBWjtBQUNBLG9CQUFJLGNBQWMsTUFBZCxJQUF3QixjQUFjLE1BQWQsQ0FBcUIsTUFBckIsR0FBOEIsS0FBMUQsRUFBaUU7O0FBRTdELDRCQUFRLGNBQWMsTUFBZCxDQUFxQixLQUFyQixDQUFSO0FBQ0g7QUFDRCxxQkFBSyxNQUFMLENBQVksSUFBWixDQUFpQixLQUFqQjtBQUNBLHFCQUFLLGVBQUwsQ0FBcUIsV0FBckIsSUFBb0MsS0FBcEM7QUFDSCxhQVREOztBQVdBLG9CQUFRLEdBQVIsQ0FBWSxLQUFLLGVBQWpCO0FBRUg7OztpREFHd0I7QUFDckIsZ0JBQUksT0FBTyxJQUFYO0FBQ0EsZ0JBQUksT0FBTyxLQUFLLElBQWhCO0FBQ0EsZ0JBQUksU0FBUyxLQUFLLElBQUwsQ0FBVSxXQUFWLENBQXNCLE1BQXRCLEdBQStCLEVBQTVDO0FBQ0EsZ0JBQUksY0FBYyxLQUFLLElBQUwsQ0FBVSxXQUFWLENBQXNCLE1BQXRCLENBQTZCLEtBQTdCLEdBQXFDLEVBQXZEO0FBQ0EsZ0JBQUksT0FBTyxLQUFLLElBQWhCOztBQUVBLGdCQUFJLG1CQUFtQixFQUF2QjtBQUNBLGlCQUFLLFNBQUwsQ0FBZSxPQUFmLENBQXVCLFVBQUMsQ0FBRCxFQUFJLENBQUosRUFBVTs7QUFFN0IsaUNBQWlCLENBQWpCLElBQXNCLEtBQUssR0FBTCxDQUFTO0FBQUEsMkJBQUcsS0FBSyxDQUFMLENBQU8sS0FBUCxDQUFhLENBQWIsRUFBZ0IsQ0FBaEIsQ0FBSDtBQUFBLGlCQUFULENBQXRCO0FBQ0gsYUFIRDs7QUFLQSxpQkFBSyxTQUFMLENBQWUsT0FBZixDQUF1QixVQUFDLEVBQUQsRUFBSyxDQUFMLEVBQVc7QUFDOUIsb0JBQUksTUFBTSxFQUFWO0FBQ0EsdUJBQU8sSUFBUCxDQUFZLEdBQVo7O0FBRUEscUJBQUssU0FBTCxDQUFlLE9BQWYsQ0FBdUIsVUFBQyxFQUFELEVBQUssQ0FBTCxFQUFXO0FBQzlCLHdCQUFJLE9BQU8sQ0FBWDtBQUNBLHdCQUFJLE1BQU0sRUFBVixFQUFjO0FBQ1YsK0JBQU8sS0FBSyxNQUFMLENBQVksV0FBWixDQUF3QixLQUF4QixDQUE4QixpQkFBaUIsRUFBakIsQ0FBOUIsRUFBb0QsaUJBQWlCLEVBQWpCLENBQXBELENBQVA7QUFDSDtBQUNELHdCQUFJLE9BQU87QUFDUCxnQ0FBUSxFQUREO0FBRVAsZ0NBQVEsRUFGRDtBQUdQLDZCQUFLLENBSEU7QUFJUCw2QkFBSyxDQUpFO0FBS1AsK0JBQU87QUFMQSxxQkFBWDtBQU9BLHdCQUFJLElBQUosQ0FBUyxJQUFUOztBQUVBLGdDQUFZLElBQVosQ0FBaUIsSUFBakI7QUFDSCxpQkFmRDtBQWlCSCxhQXJCRDtBQXNCSDs7OytCQUdNLE8sRUFBUztBQUNaLGdHQUFhLE9BQWI7O0FBRUEsaUJBQUssV0FBTDtBQUNBLGlCQUFLLG9CQUFMOztBQUdBLGdCQUFJLEtBQUssTUFBTCxDQUFZLFVBQWhCLEVBQTRCO0FBQ3hCLHFCQUFLLFlBQUw7QUFDSDtBQUNKOzs7K0NBRXNCO0FBQ25CLGlCQUFLLElBQUwsQ0FBVSxVQUFWLEdBQXVCLEtBQUssV0FBTCxDQUFpQixPQUFqQixDQUF2QjtBQUNBLGlCQUFLLFdBQUw7QUFDQSxpQkFBSyxXQUFMO0FBQ0g7OztzQ0FFYTtBQUNWLGdCQUFJLE9BQU8sSUFBWDtBQUNBLGdCQUFJLE9BQU8sS0FBSyxJQUFoQjtBQUNBLGdCQUFJLGFBQWEsS0FBSyxVQUF0QjtBQUNBLGdCQUFJLGNBQWMsYUFBYSxJQUEvQjs7QUFFQSxnQkFBSSxTQUFTLEtBQUssSUFBTCxDQUFVLFNBQVYsQ0FBb0IsVUFBVSxXQUE5QixFQUNSLElBRFEsQ0FDSCxLQUFLLFNBREYsRUFDYSxVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsdUJBQVEsQ0FBUjtBQUFBLGFBRGIsQ0FBYjs7QUFHQSxtQkFBTyxLQUFQLEdBQWUsTUFBZixDQUFzQixNQUF0QixFQUE4QixJQUE5QixDQUFtQyxPQUFuQyxFQUE0QyxVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsdUJBQVUsYUFBYSxHQUFiLEdBQW1CLFdBQW5CLEdBQWlDLEdBQWpDLEdBQXVDLFdBQXZDLEdBQXFELEdBQXJELEdBQTJELENBQXJFO0FBQUEsYUFBNUM7O0FBRUEsbUJBQ0ssSUFETCxDQUNVLEdBRFYsRUFDZSxVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsdUJBQVUsSUFBSSxLQUFLLFFBQVQsR0FBb0IsS0FBSyxRQUFMLEdBQWdCLENBQTlDO0FBQUEsYUFEZixFQUVLLElBRkwsQ0FFVSxHQUZWLEVBRWUsS0FBSyxNQUZwQixFQUdLLElBSEwsQ0FHVSxJQUhWLEVBR2dCLENBQUMsQ0FIakIsRUFJSyxJQUpMLENBSVUsSUFKVixFQUlnQixDQUpoQixFQUtLLElBTEwsQ0FLVSxhQUxWLEVBS3lCLEtBTHpCOzs7QUFBQSxhQVFLLElBUkwsQ0FRVTtBQUFBLHVCQUFHLEtBQUssZUFBTCxDQUFxQixDQUFyQixDQUFIO0FBQUEsYUFSVjs7QUFVQSxnQkFBSSxLQUFLLE1BQUwsQ0FBWSxhQUFoQixFQUErQjtBQUMzQix1QkFBTyxJQUFQLENBQVksV0FBWixFQUF5QixVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsMkJBQVUsa0JBQWtCLElBQUksS0FBSyxRQUFULEdBQW9CLEtBQUssUUFBTCxHQUFnQixDQUF0RCxJQUE2RCxJQUE3RCxHQUFvRSxLQUFLLE1BQXpFLEdBQWtGLEdBQTVGO0FBQUEsaUJBQXpCO0FBQ0g7O0FBRUQsZ0JBQUksV0FBVyxLQUFLLHVCQUFMLEVBQWY7QUFDQSxtQkFBTyxJQUFQLENBQVksVUFBVSxLQUFWLEVBQWlCO0FBQ3pCLDZCQUFNLCtCQUFOLENBQXNDLEdBQUcsTUFBSCxDQUFVLElBQVYsQ0FBdEMsRUFBdUQsS0FBdkQsRUFBOEQsUUFBOUQsRUFBd0UsS0FBSyxNQUFMLENBQVksV0FBWixHQUEwQixLQUFLLElBQUwsQ0FBVSxPQUFwQyxHQUE4QyxLQUF0SDtBQUNILGFBRkQ7O0FBSUEsbUJBQU8sSUFBUCxHQUFjLE1BQWQ7QUFDSDs7O3NDQUVhO0FBQ1YsZ0JBQUksT0FBTyxJQUFYO0FBQ0EsZ0JBQUksT0FBTyxLQUFLLElBQWhCO0FBQ0EsZ0JBQUksYUFBYSxLQUFLLFVBQXRCO0FBQ0EsZ0JBQUksY0FBYyxLQUFLLFVBQUwsR0FBa0IsSUFBcEM7QUFDQSxnQkFBSSxTQUFTLEtBQUssSUFBTCxDQUFVLFNBQVYsQ0FBb0IsVUFBVSxXQUE5QixFQUNSLElBRFEsQ0FDSCxLQUFLLFNBREYsQ0FBYjs7QUFHQSxtQkFBTyxLQUFQLEdBQWUsTUFBZixDQUFzQixNQUF0Qjs7QUFFQSxtQkFDSyxJQURMLENBQ1UsR0FEVixFQUNlLENBRGYsRUFFSyxJQUZMLENBRVUsR0FGVixFQUVlLFVBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSx1QkFBVSxJQUFJLEtBQUssUUFBVCxHQUFvQixLQUFLLFFBQUwsR0FBZ0IsQ0FBOUM7QUFBQSxhQUZmLEVBR0ssSUFITCxDQUdVLElBSFYsRUFHZ0IsQ0FBQyxDQUhqQixFQUlLLElBSkwsQ0FJVSxhQUpWLEVBSXlCLEtBSnpCLEVBS0ssSUFMTCxDQUtVLE9BTFYsRUFLbUIsVUFBQyxDQUFELEVBQUksQ0FBSjtBQUFBLHVCQUFVLGFBQWEsR0FBYixHQUFtQixXQUFuQixHQUFpQyxHQUFqQyxHQUF1QyxXQUF2QyxHQUFxRCxHQUFyRCxHQUEyRCxDQUFyRTtBQUFBLGFBTG5COztBQUFBLGFBT0ssSUFQTCxDQU9VO0FBQUEsdUJBQUcsS0FBSyxlQUFMLENBQXFCLENBQXJCLENBQUg7QUFBQSxhQVBWOztBQVNBLGdCQUFJLEtBQUssTUFBTCxDQUFZLGFBQWhCLEVBQStCO0FBQzNCLHVCQUNLLElBREwsQ0FDVSxXQURWLEVBQ3VCLFVBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSwyQkFBVSxpQkFBaUIsQ0FBakIsR0FBcUIsSUFBckIsSUFBNkIsSUFBSSxLQUFLLFFBQVQsR0FBb0IsS0FBSyxRQUFMLEdBQWdCLENBQWpFLElBQXNFLEdBQWhGO0FBQUEsaUJBRHZCLEVBRUssSUFGTCxDQUVVLGFBRlYsRUFFeUIsS0FGekI7QUFHSDs7QUFFRCxnQkFBSSxXQUFXLEtBQUssdUJBQUwsRUFBZjtBQUNBLG1CQUFPLElBQVAsQ0FBWSxVQUFVLEtBQVYsRUFBaUI7QUFDekIsNkJBQU0sK0JBQU4sQ0FBc0MsR0FBRyxNQUFILENBQVUsSUFBVixDQUF0QyxFQUF1RCxLQUF2RCxFQUE4RCxRQUE5RCxFQUF3RSxLQUFLLE1BQUwsQ0FBWSxXQUFaLEdBQTBCLEtBQUssSUFBTCxDQUFVLE9BQXBDLEdBQThDLEtBQXRIO0FBQ0gsYUFGRDs7QUFJQSxtQkFBTyxJQUFQLEdBQWMsTUFBZDtBQUNIOzs7a0RBRXlCO0FBQ3RCLGdCQUFJLFdBQVcsS0FBSyxJQUFMLENBQVUsTUFBVixDQUFpQixJQUFoQztBQUNBLGdCQUFJLENBQUMsS0FBSyxNQUFMLENBQVksYUFBakIsRUFBZ0M7QUFDNUIsdUJBQU8sUUFBUDtBQUNIOztBQUVELHdCQUFZLGFBQU0sTUFBbEI7QUFDQSxnQkFBSSxXQUFXLEVBQWYsQztBQUNBLHdCQUFZLFdBQVcsQ0FBdkI7O0FBRUEsbUJBQU8sUUFBUDtBQUNIOzs7Z0RBRXVCLE0sRUFBUTtBQUM1QixnQkFBSSxDQUFDLEtBQUssTUFBTCxDQUFZLGFBQWpCLEVBQWdDO0FBQzVCLHVCQUFPLEtBQUssSUFBTCxDQUFVLFFBQVYsR0FBcUIsQ0FBNUI7QUFDSDtBQUNELGdCQUFJLE9BQU8sS0FBSyxJQUFMLENBQVUsTUFBVixDQUFpQixNQUE1QjtBQUNBLG9CQUFRLGFBQU0sTUFBZDtBQUNBLGdCQUFJLFdBQVcsRUFBZixDO0FBQ0Esb0JBQVEsV0FBVyxDQUFuQjtBQUNBLG1CQUFPLElBQVA7QUFDSDs7O3NDQUVhOztBQUVWLGdCQUFJLE9BQU8sSUFBWDtBQUNBLGdCQUFJLE9BQU8sS0FBSyxJQUFoQjtBQUNBLGdCQUFJLFlBQVksS0FBSyxXQUFMLENBQWlCLE1BQWpCLENBQWhCO0FBQ0EsZ0JBQUksWUFBWSxLQUFLLFdBQUwsQ0FBaUIsS0FBakIsQ0FBdUIsSUFBdkM7O0FBRUEsZ0JBQUksUUFBUSxLQUFLLElBQUwsQ0FBVSxTQUFWLENBQW9CLE9BQU8sU0FBM0IsRUFDUCxJQURPLENBQ0YsS0FBSyxXQUFMLENBQWlCLE1BQWpCLENBQXdCLEtBRHRCLENBQVo7O0FBR0EsZ0JBQUksYUFBYSxNQUFNLEtBQU4sR0FBYyxNQUFkLENBQXFCLEdBQXJCLEVBQ1osT0FEWSxDQUNKLFNBREksRUFDTyxJQURQLENBQWpCO0FBRUEsa0JBQU0sSUFBTixDQUFXLFdBQVgsRUFBd0I7QUFBQSx1QkFBSSxnQkFBZ0IsS0FBSyxRQUFMLEdBQWdCLEVBQUUsR0FBbEIsR0FBd0IsS0FBSyxRQUFMLEdBQWdCLENBQXhELElBQTZELEdBQTdELElBQW9FLEtBQUssUUFBTCxHQUFnQixFQUFFLEdBQWxCLEdBQXdCLEtBQUssUUFBTCxHQUFnQixDQUE1RyxJQUFpSCxHQUFySDtBQUFBLGFBQXhCOztBQUVBLGtCQUFNLE9BQU4sQ0FBYyxLQUFLLE1BQUwsQ0FBWSxjQUFaLEdBQTZCLFlBQTNDLEVBQXlELENBQUMsQ0FBQyxLQUFLLFdBQWhFOztBQUVBLGdCQUFJLFdBQVcsdUJBQXVCLFNBQXZCLEdBQW1DLEdBQWxEOztBQUVBLGdCQUFJLGNBQWMsTUFBTSxTQUFOLENBQWdCLFFBQWhCLENBQWxCO0FBQ0Esd0JBQVksTUFBWjs7QUFFQSxnQkFBSSxTQUFTLE1BQU0sY0FBTixDQUFxQixZQUFZLGNBQVosR0FBNkIsU0FBbEQsQ0FBYjs7QUFFQSxnQkFBSSxLQUFLLFdBQUwsQ0FBaUIsS0FBakIsQ0FBdUIsSUFBdkIsSUFBK0IsUUFBbkMsRUFBNkM7O0FBRXpDLHVCQUNLLElBREwsQ0FDVSxHQURWLEVBQ2UsS0FBSyxXQUFMLENBQWlCLEtBQWpCLENBQXVCLE1BRHRDLEVBRUssSUFGTCxDQUVVLElBRlYsRUFFZ0IsQ0FGaEIsRUFHSyxJQUhMLENBR1UsSUFIVixFQUdnQixDQUhoQjtBQUlIOztBQUVELGdCQUFJLEtBQUssV0FBTCxDQUFpQixLQUFqQixDQUF1QixJQUF2QixJQUErQixTQUFuQyxFQUE4Qzs7QUFFMUMsdUJBQ0ssSUFETCxDQUNVLElBRFYsRUFDZ0IsS0FBSyxXQUFMLENBQWlCLEtBQWpCLENBQXVCLE9BRHZDLEVBRUssSUFGTCxDQUVVLElBRlYsRUFFZ0IsS0FBSyxXQUFMLENBQWlCLEtBQWpCLENBQXVCLE9BRnZDLEVBR0ssSUFITCxDQUdVLElBSFYsRUFHZ0IsQ0FIaEIsRUFJSyxJQUpMLENBSVUsSUFKVixFQUlnQixDQUpoQixFQU1LLElBTkwsQ0FNVSxXQU5WLEVBTXVCO0FBQUEsMkJBQUksWUFBWSxLQUFLLFdBQUwsQ0FBaUIsS0FBakIsQ0FBdUIsU0FBdkIsQ0FBaUMsRUFBRSxLQUFuQyxDQUFaLEdBQXdELEdBQTVEO0FBQUEsaUJBTnZCO0FBT0g7O0FBR0QsZ0JBQUksS0FBSyxXQUFMLENBQWlCLEtBQWpCLENBQXVCLElBQXZCLElBQStCLE1BQW5DLEVBQTJDO0FBQ3ZDLHVCQUNLLElBREwsQ0FDVSxPQURWLEVBQ21CLEtBQUssV0FBTCxDQUFpQixLQUFqQixDQUF1QixJQUQxQyxFQUVLLElBRkwsQ0FFVSxRQUZWLEVBRW9CLEtBQUssV0FBTCxDQUFpQixLQUFqQixDQUF1QixJQUYzQyxFQUdLLElBSEwsQ0FHVSxHQUhWLEVBR2UsQ0FBQyxLQUFLLFFBQU4sR0FBaUIsQ0FIaEMsRUFJSyxJQUpMLENBSVUsR0FKVixFQUllLENBQUMsS0FBSyxRQUFOLEdBQWlCLENBSmhDO0FBS0g7QUFDRCxtQkFBTyxLQUFQLENBQWEsTUFBYixFQUFxQjtBQUFBLHVCQUFJLEtBQUssV0FBTCxDQUFpQixLQUFqQixDQUF1QixLQUF2QixDQUE2QixFQUFFLEtBQS9CLENBQUo7QUFBQSxhQUFyQjs7QUFFQSxnQkFBSSxxQkFBcUIsRUFBekI7QUFDQSxnQkFBSSxvQkFBb0IsRUFBeEI7O0FBRUEsZ0JBQUksS0FBSyxPQUFULEVBQWtCOztBQUVkLG1DQUFtQixJQUFuQixDQUF3QixhQUFJO0FBQ3hCLHlCQUFLLE9BQUwsQ0FBYSxVQUFiLEdBQ0ssUUFETCxDQUNjLEdBRGQsRUFFSyxLQUZMLENBRVcsU0FGWCxFQUVzQixFQUZ0QjtBQUdBLHdCQUFJLE9BQU8sRUFBRSxLQUFiO0FBQ0EseUJBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsSUFBbEIsRUFDSyxLQURMLENBQ1csTUFEWCxFQUNvQixHQUFHLEtBQUgsQ0FBUyxLQUFULEdBQWlCLENBQWxCLEdBQXVCLElBRDFDLEVBRUssS0FGTCxDQUVXLEtBRlgsRUFFbUIsR0FBRyxLQUFILENBQVMsS0FBVCxHQUFpQixFQUFsQixHQUF3QixJQUYxQztBQUdILGlCQVJEOztBQVVBLGtDQUFrQixJQUFsQixDQUF1QixhQUFJO0FBQ3ZCLHlCQUFLLE9BQUwsQ0FBYSxVQUFiLEdBQ0ssUUFETCxDQUNjLEdBRGQsRUFFSyxLQUZMLENBRVcsU0FGWCxFQUVzQixDQUZ0QjtBQUdILGlCQUpEO0FBT0g7O0FBRUQsZ0JBQUksS0FBSyxNQUFMLENBQVksZUFBaEIsRUFBaUM7QUFDN0Isb0JBQUksaUJBQWlCLEtBQUssTUFBTCxDQUFZLGNBQVosR0FBNkIsV0FBbEQ7QUFDQSxvQkFBSSxjQUFjLFNBQWQsV0FBYztBQUFBLDJCQUFHLEtBQUssVUFBTCxHQUFrQixLQUFsQixHQUEwQixFQUFFLEdBQS9CO0FBQUEsaUJBQWxCO0FBQ0Esb0JBQUksY0FBYyxTQUFkLFdBQWM7QUFBQSwyQkFBRyxLQUFLLFVBQUwsR0FBa0IsS0FBbEIsR0FBMEIsRUFBRSxHQUEvQjtBQUFBLGlCQUFsQjs7QUFHQSxtQ0FBbUIsSUFBbkIsQ0FBd0IsYUFBSTs7QUFFeEIseUJBQUssSUFBTCxDQUFVLFNBQVYsQ0FBb0IsVUFBVSxZQUFZLENBQVosQ0FBOUIsRUFBOEMsT0FBOUMsQ0FBc0QsY0FBdEQsRUFBc0UsSUFBdEU7QUFDQSx5QkFBSyxJQUFMLENBQVUsU0FBVixDQUFvQixVQUFVLFlBQVksQ0FBWixDQUE5QixFQUE4QyxPQUE5QyxDQUFzRCxjQUF0RCxFQUFzRSxJQUF0RTtBQUNILGlCQUpEO0FBS0Esa0NBQWtCLElBQWxCLENBQXVCLGFBQUk7QUFDdkIseUJBQUssSUFBTCxDQUFVLFNBQVYsQ0FBb0IsVUFBVSxZQUFZLENBQVosQ0FBOUIsRUFBOEMsT0FBOUMsQ0FBc0QsY0FBdEQsRUFBc0UsS0FBdEU7QUFDQSx5QkFBSyxJQUFMLENBQVUsU0FBVixDQUFvQixVQUFVLFlBQVksQ0FBWixDQUE5QixFQUE4QyxPQUE5QyxDQUFzRCxjQUF0RCxFQUFzRSxLQUF0RTtBQUNILGlCQUhEO0FBSUg7O0FBR0Qsa0JBQU0sRUFBTixDQUFTLFdBQVQsRUFBc0IsYUFBSztBQUN2QixtQ0FBbUIsT0FBbkIsQ0FBMkI7QUFBQSwyQkFBVSxTQUFTLENBQVQsQ0FBVjtBQUFBLGlCQUEzQjtBQUNILGFBRkQsRUFHSyxFQUhMLENBR1EsVUFIUixFQUdvQixhQUFLO0FBQ2pCLGtDQUFrQixPQUFsQixDQUEwQjtBQUFBLDJCQUFVLFNBQVMsQ0FBVCxDQUFWO0FBQUEsaUJBQTFCO0FBQ0gsYUFMTDs7QUFPQSxrQkFBTSxFQUFOLENBQVMsT0FBVCxFQUFrQixhQUFJO0FBQ2xCLHFCQUFLLE9BQUwsQ0FBYSxlQUFiLEVBQThCLENBQTlCO0FBQ0gsYUFGRDs7QUFLQSxrQkFBTSxJQUFOLEdBQWEsTUFBYjtBQUNIOzs7dUNBR2M7O0FBRVgsZ0JBQUksT0FBTyxLQUFLLElBQWhCO0FBQ0EsZ0JBQUksVUFBVSxLQUFLLElBQUwsQ0FBVSxLQUFWLEdBQWtCLEVBQWhDO0FBQ0EsZ0JBQUksVUFBVSxDQUFkO0FBQ0EsZ0JBQUksV0FBVyxFQUFmO0FBQ0EsZ0JBQUksWUFBWSxLQUFLLElBQUwsQ0FBVSxNQUFWLEdBQW1CLENBQW5DO0FBQ0EsZ0JBQUksUUFBUSxLQUFLLFdBQUwsQ0FBaUIsS0FBakIsQ0FBdUIsS0FBbkM7O0FBRUEsaUJBQUssTUFBTCxHQUFjLG1CQUFXLEtBQUssR0FBaEIsRUFBcUIsS0FBSyxJQUExQixFQUFnQyxLQUFoQyxFQUF1QyxPQUF2QyxFQUFnRCxPQUFoRCxFQUF5RCxpQkFBekQsQ0FBMkUsUUFBM0UsRUFBcUYsU0FBckYsQ0FBZDtBQUdIOzs7MENBRWlCLGlCLEVBQW1CLE0sRUFBUTtBQUFBOztBQUN6QyxnQkFBSSxPQUFPLElBQVg7O0FBRUEscUJBQVMsVUFBVSxFQUFuQjs7QUFHQSxnQkFBSSxvQkFBb0I7QUFDcEIsd0JBQVEsS0FBSyxJQUFMLENBQVUsTUFBVixHQUFtQixLQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLEdBQXRDLEdBQTRDLEtBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsTUFEbkQ7QUFFcEIsdUJBQU8sS0FBSyxJQUFMLENBQVUsTUFBVixHQUFtQixLQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLEdBQXRDLEdBQTRDLEtBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsTUFGbEQ7QUFHcEIsd0JBQVE7QUFDSix5QkFBSyxLQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLEdBRHBCO0FBRUosMkJBQU8sS0FBSyxNQUFMLENBQVksTUFBWixDQUFtQjtBQUZ0QixpQkFIWTtBQU9wQix3QkFBUSxJQVBZO0FBUXBCLDRCQUFZO0FBUlEsYUFBeEI7O0FBV0EsaUJBQUssV0FBTCxHQUFtQixJQUFuQjs7QUFFQSxnQ0FBb0IsYUFBTSxVQUFOLENBQWlCLGlCQUFqQixFQUFvQyxNQUFwQyxDQUFwQjtBQUNBLGlCQUFLLE1BQUw7O0FBRUEsaUJBQUssRUFBTCxDQUFRLGVBQVIsRUFBeUIsYUFBSTs7QUFHekIsa0NBQWtCLENBQWxCLEdBQXNCO0FBQ2xCLHlCQUFLLEVBQUUsTUFEVztBQUVsQiwyQkFBTyxLQUFLLElBQUwsQ0FBVSxlQUFWLENBQTBCLEVBQUUsTUFBNUI7QUFGVyxpQkFBdEI7QUFJQSxrQ0FBa0IsQ0FBbEIsR0FBc0I7QUFDbEIseUJBQUssRUFBRSxNQURXO0FBRWxCLDJCQUFPLEtBQUssSUFBTCxDQUFVLGVBQVYsQ0FBMEIsRUFBRSxNQUE1QjtBQUZXLGlCQUF0QjtBQUlBLG9CQUFJLEtBQUssV0FBTCxJQUFvQixLQUFLLFdBQUwsS0FBcUIsSUFBN0MsRUFBbUQ7QUFDL0MseUJBQUssV0FBTCxDQUFpQixTQUFqQixDQUEyQixpQkFBM0IsRUFBOEMsSUFBOUM7QUFDSCxpQkFGRCxNQUVPO0FBQ0gseUJBQUssV0FBTCxHQUFtQiw2QkFBZ0IsaUJBQWhCLEVBQW1DLEtBQUssSUFBeEMsRUFBOEMsaUJBQTlDLENBQW5CO0FBQ0EsMkJBQUssTUFBTCxDQUFZLGFBQVosRUFBMkIsS0FBSyxXQUFoQztBQUNIO0FBR0osYUFuQkQ7QUFzQkg7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3Zkw7Ozs7SUFHYSxZLFdBQUEsWTs7Ozs7OztpQ0FFTTs7QUFFWCxlQUFHLFNBQUgsQ0FBYSxLQUFiLENBQW1CLFNBQW5CLENBQTZCLGNBQTdCLEdBQ0ksR0FBRyxTQUFILENBQWEsU0FBYixDQUF1QixjQUF2QixHQUF3QyxVQUFTLFFBQVQsRUFBbUIsTUFBbkIsRUFBMkI7QUFDL0QsdUJBQU8sYUFBTSxjQUFOLENBQXFCLElBQXJCLEVBQTJCLFFBQTNCLEVBQXFDLE1BQXJDLENBQVA7QUFDSCxhQUhMOztBQU1BLGVBQUcsU0FBSCxDQUFhLEtBQWIsQ0FBbUIsU0FBbkIsQ0FBNkIsY0FBN0IsR0FDSSxHQUFHLFNBQUgsQ0FBYSxTQUFiLENBQXVCLGNBQXZCLEdBQXdDLFVBQVMsUUFBVCxFQUFtQjtBQUN2RCx1QkFBTyxhQUFNLGNBQU4sQ0FBcUIsSUFBckIsRUFBMkIsUUFBM0IsQ0FBUDtBQUNILGFBSEw7O0FBS0EsZUFBRyxTQUFILENBQWEsS0FBYixDQUFtQixTQUFuQixDQUE2QixjQUE3QixHQUNJLEdBQUcsU0FBSCxDQUFhLFNBQWIsQ0FBdUIsY0FBdkIsR0FBd0MsVUFBUyxRQUFULEVBQW1CO0FBQ3ZELHVCQUFPLGFBQU0sY0FBTixDQUFxQixJQUFyQixFQUEyQixRQUEzQixDQUFQO0FBQ0gsYUFITDs7QUFLQSxlQUFHLFNBQUgsQ0FBYSxLQUFiLENBQW1CLFNBQW5CLENBQTZCLGNBQTdCLEdBQ0ksR0FBRyxTQUFILENBQWEsU0FBYixDQUF1QixjQUF2QixHQUF3QyxVQUFTLFFBQVQsRUFBbUIsTUFBbkIsRUFBMkI7QUFDL0QsdUJBQU8sYUFBTSxjQUFOLENBQXFCLElBQXJCLEVBQTJCLFFBQTNCLEVBQXFDLE1BQXJDLENBQVA7QUFDSCxhQUhMO0FBT0g7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlCTDs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7SUFHYSx1QixXQUFBLHVCOzs7QUF1RFQscUNBQVksTUFBWixFQUFvQjtBQUFBOztBQUFBOztBQUFBLGNBdERwQixDQXNEb0IsR0F0RGhCO0FBQ0EseUJBQWEsS0FEYixFO0FBRUEsc0JBQVUsU0FGVixFO0FBR0EsMEJBQWMsQ0FIZDtBQUlBLG9CQUFRLFNBSlIsRTtBQUtBLDJCQUFlLFNBTGYsRTtBQU1BLCtCQUFtQixDO0FBQ2Y7QUFDSSxzQkFBTSxNQURWO0FBRUkseUJBQVMsQ0FBQyxJQUFEO0FBRmIsYUFEZSxFQUtmO0FBQ0ksc0JBQU0sT0FEVjtBQUVJLHlCQUFTLENBQUMsT0FBRDtBQUZiLGFBTGUsRUFTZjtBQUNJLHNCQUFNLEtBRFY7QUFFSSx5QkFBUyxDQUFDLFVBQUQ7QUFGYixhQVRlLEVBYWY7QUFDSSxzQkFBTSxNQURWO0FBRUkseUJBQVMsQ0FBQyxJQUFELEVBQU8sYUFBUDtBQUZiLGFBYmUsRUFpQmY7QUFDSSxzQkFBTSxRQURWO0FBRUkseUJBQVMsQ0FBQyxPQUFELEVBQVUsZ0JBQVY7QUFGYixhQWpCZSxFQXFCZjtBQUNJLHNCQUFNLFFBRFY7QUFFSSx5QkFBUyxDQUFDLFVBQUQsRUFBYSxtQkFBYjtBQUZiLGFBckJlLENBTm5COztBQWlDQSw0QkFBZ0IsU0FBUyxjQUFULENBQXdCLENBQXhCLEVBQTJCLENBQTNCLEVBQThCO0FBQzFDLHVCQUFPLGFBQU0sUUFBTixDQUFlLENBQWYsSUFBcUIsRUFBRSxhQUFGLENBQWdCLENBQWhCLENBQXJCLEdBQTJDLElBQUksQ0FBdEQ7QUFDSCxhQW5DRDtBQW9DQSx1QkFBVztBQXBDWCxTQXNEZ0I7QUFBQSxjQWhCcEIsQ0FnQm9CLEdBaEJoQjtBQUNBLHlCQUFhLEk7QUFEYixTQWdCZ0I7QUFBQSxjQVpwQixNQVlvQixHQVpYO0FBQ0wsdUJBQVcsbUJBQVUsQ0FBVixFQUFhO0FBQ3BCLG9CQUFJLFNBQVMsRUFBYjtBQUNBLG9CQUFJLElBQUksT0FBSixJQUFlLENBQW5CLEVBQXNCO0FBQ2xCLDZCQUFTLElBQVQ7QUFDQSx3QkFBSSxPQUFPLElBQUksT0FBWCxFQUFvQixPQUFwQixDQUE0QixDQUE1QixDQUFKO0FBQ0g7QUFDRCxvQkFBSSxLQUFLLEtBQUssWUFBTCxFQUFUO0FBQ0EsdUJBQU8sR0FBRyxNQUFILENBQVUsQ0FBVixJQUFlLE1BQXRCO0FBQ0g7QUFUSSxTQVlXOzs7QUFHaEIsWUFBSSxNQUFKLEVBQVk7QUFDUix5QkFBTSxVQUFOLFFBQXVCLE1BQXZCO0FBQ0g7O0FBTGU7QUFPbkI7Ozs7O0lBR1EsaUIsV0FBQSxpQjs7O0FBQ1QsK0JBQVksbUJBQVosRUFBaUMsSUFBakMsRUFBdUMsTUFBdkMsRUFBK0M7QUFBQTs7QUFBQSxvR0FDckMsbUJBRHFDLEVBQ2hCLElBRGdCLEVBQ1YsSUFBSSx1QkFBSixDQUE0QixNQUE1QixDQURVO0FBRTlDOzs7O2tDQUVTLE0sRUFBUTtBQUNkLDBHQUF1QixJQUFJLHVCQUFKLENBQTRCLE1BQTVCLENBQXZCO0FBQ0g7OztzREFHNkI7QUFBQTs7QUFFMUIsaUJBQUssSUFBTCxDQUFVLENBQVYsQ0FBWSxVQUFaLEdBQXlCLEtBQUssTUFBTCxDQUFZLENBQVosQ0FBYyxNQUF2QztBQUNBLGdCQUFHLEtBQUssTUFBTCxDQUFZLENBQVosQ0FBYyxhQUFkLElBQStCLENBQUMsS0FBSyxJQUFMLENBQVUsQ0FBVixDQUFZLFVBQS9DLEVBQTBEO0FBQ3RELHFCQUFLLGVBQUw7QUFDSDs7QUFHRDtBQUNBLGdCQUFJLENBQUMsS0FBSyxNQUFMLENBQVksQ0FBWixDQUFjLFdBQW5CLEVBQWdDO0FBQzVCO0FBQ0g7O0FBRUQsZ0JBQUksT0FBTyxJQUFYOztBQUVBLGlCQUFLLHlCQUFMOztBQUVBLGlCQUFLLElBQUwsQ0FBVSxDQUFWLENBQVksWUFBWixHQUEyQixLQUFLLE1BQUwsQ0FBWSxDQUFaLENBQWMsWUFBZCxJQUE4QixDQUF6RDs7QUFFQSxpQkFBSyxJQUFMLENBQVUsQ0FBVixDQUFZLFVBQVosR0FBeUIsS0FBSyxhQUFMLEVBQXpCOztBQUlBLGlCQUFLLElBQUwsQ0FBVSxDQUFWLENBQVksWUFBWixDQUF5QixJQUF6QixDQUE4QixLQUFLLE1BQUwsQ0FBWSxDQUFaLENBQWMsY0FBNUM7O0FBRUEsZ0JBQUksT0FBTyxJQUFYOztBQUVBLGlCQUFLLElBQUwsQ0FBVSxDQUFWLENBQVksWUFBWixDQUF5QixPQUF6QixDQUFpQyxVQUFDLENBQUQsRUFBSSxDQUFKLEVBQVM7QUFDdEMsb0JBQUksVUFBVSxPQUFLLFNBQUwsQ0FBZSxDQUFmLENBQWQ7QUFDQSxvQkFBSSxTQUFTLElBQWIsRUFBbUI7QUFDZiwyQkFBTyxPQUFQO0FBQ0E7QUFDSDs7QUFFRCxvQkFBSSxPQUFPLEtBQUssaUJBQUwsQ0FBdUIsSUFBdkIsQ0FBWDtBQUNBLG9CQUFJLFVBQVUsRUFBZDtBQUNBLG9CQUFJLFlBQVksQ0FBaEI7QUFDQSx1QkFBTyxLQUFLLGlCQUFMLENBQXVCLElBQXZCLEVBQTZCLE9BQTdCLEtBQXVDLENBQTlDLEVBQWlEO0FBQzdDO0FBQ0Esd0JBQUksWUFBWSxHQUFoQixFQUFxQjtBQUNqQjtBQUNIO0FBQ0Qsd0JBQUksSUFBSSxFQUFSO0FBQ0Esd0JBQUksYUFBYSxLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBakI7QUFDQSxzQkFBRSxPQUFLLE1BQUwsQ0FBWSxDQUFaLENBQWMsR0FBaEIsSUFBdUIsVUFBdkI7O0FBRUEseUJBQUssWUFBTCxDQUFrQixDQUFsQixFQUFxQixVQUFyQixFQUFpQyxLQUFLLElBQUwsQ0FBVSxDQUFWLENBQVksTUFBN0MsRUFBcUQsS0FBSyxNQUFMLENBQVksQ0FBWixDQUFjLE1BQW5FO0FBQ0EsNEJBQVEsSUFBUixDQUFhLElBQWI7QUFDQSwyQkFBTyxLQUFLLGlCQUFMLENBQXVCLElBQXZCLENBQVA7QUFDSDtBQUNELHVCQUFPLE9BQVA7QUFDSCxhQXhCRDtBQTBCSDs7O2tDQUVTLEMsRUFBRztBQUNULGdCQUFJLFNBQVMsS0FBSyxhQUFMLEVBQWI7QUFDQSxtQkFBTyxPQUFPLEtBQVAsQ0FBYSxDQUFiLENBQVA7QUFDSDs7O21DQUVVLEksRUFBSztBQUNaLGdCQUFJLFNBQVMsS0FBSyxhQUFMLEVBQWI7QUFDQSxtQkFBTyxPQUFPLElBQVAsQ0FBUDtBQUNIOzs7cUNBRVksSyxFQUFPOztBQUNoQixnQkFBSSxLQUFLLE1BQUwsQ0FBWSxDQUFaLENBQWMsU0FBbEIsRUFBNkIsT0FBTyxLQUFLLE1BQUwsQ0FBWSxDQUFaLENBQWMsU0FBZCxDQUF3QixJQUF4QixDQUE2QixLQUFLLE1BQWxDLEVBQTBDLEtBQTFDLENBQVA7O0FBRTdCLGdCQUFHLEtBQUssTUFBTCxDQUFZLENBQVosQ0FBYyxhQUFqQixFQUErQjtBQUMzQixvQkFBSSxPQUFPLEtBQUssU0FBTCxDQUFlLEtBQWYsQ0FBWDtBQUNBLHVCQUFPLEdBQUcsSUFBSCxDQUFRLE1BQVIsQ0FBZSxLQUFLLE1BQUwsQ0FBWSxDQUFaLENBQWMsYUFBN0IsRUFBNEMsSUFBNUMsQ0FBUDtBQUNIOztBQUVELGdCQUFHLENBQUMsS0FBSyxJQUFMLENBQVUsQ0FBVixDQUFZLFVBQWhCLEVBQTRCLE9BQU8sS0FBUDs7QUFFNUIsZ0JBQUcsYUFBTSxNQUFOLENBQWEsS0FBYixDQUFILEVBQXVCO0FBQ25CLHVCQUFPLEtBQUssVUFBTCxDQUFnQixLQUFoQixDQUFQO0FBQ0g7O0FBRUQsbUJBQU8sS0FBUDtBQUNIOzs7MENBRWlCLEMsRUFBRyxDLEVBQUU7QUFDbkIsbUJBQU8sSUFBRSxDQUFUO0FBQ0g7Ozt3Q0FFZSxDLEVBQUcsQyxFQUFHO0FBQ2xCLGdCQUFJLFNBQVMsS0FBSyxJQUFMLENBQVUsQ0FBVixDQUFZLFVBQXpCO0FBQ0EsbUJBQU8sT0FBTyxDQUFQLE1BQWMsT0FBTyxDQUFQLENBQXJCO0FBQ0g7OzswQ0FFaUIsQyxFQUFHO0FBQ2pCLGdCQUFJLFdBQVcsS0FBSyxJQUFMLENBQVUsQ0FBVixDQUFZLFFBQTNCO0FBQ0EsbUJBQU8sR0FBRyxJQUFILENBQVEsUUFBUixFQUFrQixNQUFsQixDQUF5QixDQUF6QixFQUE0QixLQUFLLElBQUwsQ0FBVSxDQUFWLENBQVksWUFBeEMsQ0FBUDtBQUNIOzs7bUNBRVU7QUFDUDs7QUFFQSxnQkFBSSxLQUFLLE1BQUwsQ0FBWSxDQUFaLENBQWMsV0FBbEIsRUFBK0I7QUFDM0IscUJBQUssSUFBTCxDQUFVLE1BQVYsQ0FBaUIsT0FBakIsQ0FBeUIsVUFBQyxHQUFELEVBQU0sUUFBTixFQUFtQjtBQUN4Qyx3QkFBSSxlQUFlLFNBQW5CO0FBQ0Esd0JBQUksT0FBSixDQUFZLFVBQUMsSUFBRCxFQUFPLFFBQVAsRUFBb0I7QUFDNUIsNEJBQUksS0FBSyxLQUFMLEtBQWUsU0FBZixJQUE0QixpQkFBaUIsU0FBakQsRUFBNEQ7QUFDeEQsaUNBQUssS0FBTCxHQUFhLFlBQWI7QUFDQSxpQ0FBSyxPQUFMLEdBQWUsSUFBZjtBQUNIO0FBQ0QsdUNBQWUsS0FBSyxLQUFwQjtBQUNILHFCQU5EO0FBT0gsaUJBVEQ7QUFVSDtBQUdKOzs7K0JBRU0sTyxFQUFTO0FBQ1osZ0dBQWEsT0FBYjtBQUVIOzs7b0RBRzJCOztBQUV4QixpQkFBSyxJQUFMLENBQVUsQ0FBVixDQUFZLFFBQVosR0FBdUIsS0FBSyxNQUFMLENBQVksQ0FBWixDQUFjLFFBQXJDOztBQUVBLGdCQUFHLENBQUMsS0FBSyxJQUFMLENBQVUsQ0FBVixDQUFZLFVBQWhCLEVBQTJCO0FBQ3ZCLHFCQUFLLGVBQUw7QUFDSDs7QUFFRCxnQkFBRyxDQUFDLEtBQUssSUFBTCxDQUFVLENBQVYsQ0FBWSxRQUFiLElBQXlCLEtBQUssSUFBTCxDQUFVLENBQVYsQ0FBWSxVQUF4QyxFQUFtRDtBQUMvQyxxQkFBSyxhQUFMO0FBQ0g7QUFDSjs7OzBDQUVpQjtBQUNkLGdCQUFJLE9BQU8sSUFBWDtBQUNBLGlCQUFJLElBQUksSUFBRSxDQUFWLEVBQWEsSUFBSSxLQUFLLE1BQUwsQ0FBWSxDQUFaLENBQWMsaUJBQWQsQ0FBZ0MsTUFBakQsRUFBeUQsR0FBekQsRUFBNkQ7QUFDekQsb0JBQUksaUJBQWlCLEtBQUssTUFBTCxDQUFZLENBQVosQ0FBYyxpQkFBZCxDQUFnQyxDQUFoQyxDQUFyQjtBQUNBLG9CQUFJLFNBQVMsSUFBYjtBQUNBLG9CQUFJLGNBQWMsZUFBZSxPQUFmLENBQXVCLElBQXZCLENBQTRCLGFBQUc7QUFDN0MsNkJBQVMsQ0FBVDtBQUNBLHdCQUFJLFNBQVMsR0FBRyxJQUFILENBQVEsTUFBUixDQUFlLENBQWYsQ0FBYjtBQUNBLDJCQUFPLEtBQUssSUFBTCxDQUFVLENBQVYsQ0FBWSxZQUFaLENBQXlCLEtBQXpCLENBQStCLGFBQUc7QUFDckMsK0JBQU8sT0FBTyxLQUFQLENBQWEsQ0FBYixNQUFvQixJQUEzQjtBQUNILHFCQUZNLENBQVA7QUFHSCxpQkFOaUIsQ0FBbEI7QUFPQSxvQkFBRyxXQUFILEVBQWU7QUFDWCx5QkFBSyxJQUFMLENBQVUsQ0FBVixDQUFZLFVBQVosR0FBeUIsTUFBekI7QUFDQSw0QkFBUSxHQUFSLENBQVksb0JBQVosRUFBa0MsTUFBbEM7QUFDQSx3QkFBRyxDQUFDLEtBQUssSUFBTCxDQUFVLENBQVYsQ0FBWSxRQUFoQixFQUF5QjtBQUNyQiw2QkFBSyxJQUFMLENBQVUsQ0FBVixDQUFZLFFBQVosR0FBdUIsZUFBZSxJQUF0QztBQUNBLGdDQUFRLEdBQVIsQ0FBWSxrQkFBWixFQUFnQyxLQUFLLElBQUwsQ0FBVSxDQUFWLENBQVksUUFBNUM7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNKOzs7d0NBRWU7QUFDWixnQkFBSSxPQUFPLElBQVg7QUFDQSxpQkFBSSxJQUFJLElBQUUsQ0FBVixFQUFhLElBQUksS0FBSyxNQUFMLENBQVksQ0FBWixDQUFjLGlCQUFkLENBQWdDLE1BQWpELEVBQXlELEdBQXpELEVBQThEO0FBQzFELG9CQUFJLGlCQUFpQixLQUFLLE1BQUwsQ0FBWSxDQUFaLENBQWMsaUJBQWQsQ0FBZ0MsQ0FBaEMsQ0FBckI7O0FBRUEsb0JBQUcsZUFBZSxPQUFmLENBQXVCLE9BQXZCLENBQStCLEtBQUssSUFBTCxDQUFVLENBQVYsQ0FBWSxVQUEzQyxLQUEwRCxDQUE3RCxFQUErRDtBQUMzRCx5QkFBSyxJQUFMLENBQVUsQ0FBVixDQUFZLFFBQVosR0FBdUIsZUFBZSxJQUF0QztBQUNBLDRCQUFRLEdBQVIsQ0FBWSxrQkFBWixFQUFnQyxLQUFLLElBQUwsQ0FBVSxDQUFWLENBQVksUUFBNUM7QUFDQTtBQUNIO0FBRUo7QUFFSjs7O3dDQUdlO0FBQ1osZ0JBQUcsQ0FBQyxLQUFLLElBQUwsQ0FBVSxDQUFWLENBQVksVUFBaEIsRUFBMkI7QUFDdkIscUJBQUssSUFBTCxDQUFVLENBQVYsQ0FBWSxVQUFaLEdBQXlCLEdBQUcsSUFBSCxDQUFRLE1BQVIsQ0FBZSxLQUFLLElBQUwsQ0FBVSxDQUFWLENBQVksVUFBM0IsQ0FBekI7QUFDSDtBQUNELG1CQUFPLEtBQUssSUFBTCxDQUFVLENBQVYsQ0FBWSxVQUFuQjtBQUNIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwUUw7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0lBR2EsYSxXQUFBLGE7Ozs7O0FBaUZULDJCQUFZLE1BQVosRUFBb0I7QUFBQTs7QUFBQTs7QUFBQSxjQS9FcEIsUUErRW9CLEdBL0VULGFBK0VTO0FBQUEsY0E5RXBCLFdBOEVvQixHQTlFTixJQThFTTtBQUFBLGNBN0VwQixPQTZFb0IsR0E3RVY7QUFDTix3QkFBWTtBQUROLFNBNkVVO0FBQUEsY0ExRXBCLFVBMEVvQixHQTFFUCxJQTBFTztBQUFBLGNBekVwQixNQXlFb0IsR0F6RVg7QUFDTCxtQkFBTyxFQURGO0FBRUwsMEJBQWMsS0FGVDtBQUdMLDJCQUFlLFNBSFY7QUFJTCx1QkFBVztBQUFBLHVCQUFLLE1BQUssTUFBTCxDQUFZLGFBQVosS0FBOEIsU0FBOUIsR0FBMEMsQ0FBMUMsR0FBOEMsT0FBTyxDQUFQLEVBQVUsT0FBVixDQUFrQixNQUFLLE1BQUwsQ0FBWSxhQUE5QixDQUFuRDtBQUFBO0FBSk4sU0F5RVc7QUFBQSxjQW5FcEIsZUFtRW9CLEdBbkVGLElBbUVFO0FBQUEsY0FsRXBCLENBa0VvQixHQWxFaEIsRTtBQUNBLG1CQUFPLEVBRFAsRTtBQUVBLGlCQUFLLENBRkw7QUFHQSxtQkFBTyxlQUFDLENBQUQ7QUFBQSx1QkFBTyxFQUFFLE1BQUssQ0FBTCxDQUFPLEdBQVQsQ0FBUDtBQUFBLGFBSFAsRTtBQUlBLDBCQUFjLElBSmQ7QUFLQSx3QkFBWSxLQUxaO0FBTUEsNEJBQWdCLHdCQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsdUJBQVMsYUFBTSxRQUFOLENBQWUsQ0FBZixJQUFvQixJQUFJLENBQXhCLEdBQTRCLEVBQUUsYUFBRixDQUFnQixDQUFoQixDQUFyQztBQUFBLGFBTmhCO0FBT0Esb0JBQVE7QUFDSixzQkFBTSxFQURGO0FBRUosd0JBQVEsRUFGSjtBQUdKLHVCQUFPLGVBQUMsQ0FBRCxFQUFJLEdBQUo7QUFBQSwyQkFBWSxFQUFFLEdBQUYsQ0FBWjtBQUFBLGlCQUhIO0FBSUoseUJBQVM7QUFDTCx5QkFBSyxFQURBO0FBRUwsNEJBQVE7QUFGSDtBQUpMLGFBUFI7QUFnQkEsdUJBQVcsUzs7QUFoQlgsU0FrRWdCO0FBQUEsY0EvQ3BCLENBK0NvQixHQS9DaEIsRTtBQUNBLG1CQUFPLEVBRFAsRTtBQUVBLDBCQUFjLElBRmQ7QUFHQSxpQkFBSyxDQUhMO0FBSUEsbUJBQU8sZUFBQyxDQUFEO0FBQUEsdUJBQU8sRUFBRSxNQUFLLENBQUwsQ0FBTyxHQUFULENBQVA7QUFBQSxhQUpQLEU7QUFLQSx3QkFBWSxLQUxaO0FBTUEsNEJBQWdCLHdCQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsdUJBQVMsYUFBTSxRQUFOLENBQWUsQ0FBZixJQUFvQixJQUFJLENBQXhCLEdBQTRCLEVBQUUsYUFBRixDQUFnQixDQUFoQixDQUFyQztBQUFBLGFBTmhCO0FBT0Esb0JBQVE7QUFDSixzQkFBTSxFQURGO0FBRUosd0JBQVEsRUFGSjtBQUdKLHVCQUFPLGVBQUMsQ0FBRCxFQUFJLEdBQUo7QUFBQSwyQkFBWSxFQUFFLEdBQUYsQ0FBWjtBQUFBLGlCQUhIO0FBSUoseUJBQVM7QUFDTCwwQkFBTSxFQUREO0FBRUwsMkJBQU87QUFGRjtBQUpMLGFBUFI7QUFnQkEsdUJBQVcsUztBQWhCWCxTQStDZ0I7QUFBQSxjQTdCcEIsQ0E2Qm9CLEdBN0JoQjtBQUNBLGlCQUFLLENBREw7QUFFQSxtQkFBTyxlQUFDLENBQUQ7QUFBQSx1QkFBTyxFQUFFLE1BQUssQ0FBTCxDQUFPLEdBQVQsQ0FBUDtBQUFBLGFBRlA7QUFHQSwrQkFBbUIsMkJBQUMsQ0FBRDtBQUFBLHVCQUFPLE1BQU0sSUFBTixJQUFjLE1BQU0sU0FBM0I7QUFBQSxhQUhuQjs7QUFLQSwyQkFBZSxTQUxmO0FBTUEsdUJBQVc7QUFBQSx1QkFBSyxNQUFLLENBQUwsQ0FBTyxhQUFQLEtBQXlCLFNBQXpCLEdBQXFDLENBQXJDLEdBQXlDLE9BQU8sQ0FBUCxFQUFVLE9BQVYsQ0FBa0IsTUFBSyxDQUFMLENBQU8sYUFBekIsQ0FBOUM7QUFBQSxhOztBQU5YLFNBNkJnQjtBQUFBLGNBcEJwQixLQW9Cb0IsR0FwQlo7QUFDSix5QkFBYSxPQURUO0FBRUosbUJBQU8sUUFGSDtBQUdKLDBCQUFjLEtBSFY7QUFJSixtQkFBTyxDQUFDLFVBQUQsRUFBYSxjQUFiLEVBQTZCLFFBQTdCLEVBQXVDLFNBQXZDLEVBQWtELFNBQWxEO0FBSkgsU0FvQlk7QUFBQSxjQWRwQixJQWNvQixHQWRiO0FBQ0gsbUJBQU8sU0FESjtBQUVILG9CQUFRLFNBRkw7QUFHSCxxQkFBUyxFQUhOO0FBSUgscUJBQVMsR0FKTjtBQUtILHFCQUFTO0FBTE4sU0FjYTtBQUFBLGNBUHBCLE1BT29CLEdBUFg7QUFDTCxrQkFBTSxFQUREO0FBRUwsbUJBQU8sRUFGRjtBQUdMLGlCQUFLLEVBSEE7QUFJTCxvQkFBUTtBQUpILFNBT1c7O0FBRWhCLFlBQUksTUFBSixFQUFZO0FBQ1IseUJBQU0sVUFBTixRQUF1QixNQUF2QjtBQUNIO0FBSmU7QUFLbkI7Ozs7Ozs7O0lBSVEsTyxXQUFBLE87OztBQUtULHFCQUFZLG1CQUFaLEVBQWlDLElBQWpDLEVBQXVDLE1BQXZDLEVBQStDO0FBQUE7O0FBQUEsMEZBQ3JDLG1CQURxQyxFQUNoQixJQURnQixFQUNWLElBQUksYUFBSixDQUFrQixNQUFsQixDQURVO0FBRTlDOzs7O2tDQUVTLE0sRUFBUTtBQUNkLGdHQUF1QixJQUFJLGFBQUosQ0FBa0IsTUFBbEIsQ0FBdkI7QUFFSDs7O21DQUVVO0FBQ1A7QUFDQSxnQkFBSSxPQUFPLElBQVg7QUFDQSxnQkFBSSxTQUFTLEtBQUssTUFBTCxDQUFZLE1BQXpCO0FBQ0EsZ0JBQUksT0FBTyxLQUFLLE1BQWhCOztBQUVBLGlCQUFLLElBQUwsQ0FBVSxDQUFWLEdBQWMsRUFBZDtBQUNBLGlCQUFLLElBQUwsQ0FBVSxDQUFWLEdBQWMsRUFBZDtBQUNBLGlCQUFLLElBQUwsQ0FBVSxDQUFWLEdBQWM7QUFDViwwQkFBVSxTQURBO0FBRVYsdUJBQU8sU0FGRztBQUdWLHVCQUFPLEVBSEc7QUFJVix1QkFBTztBQUpHLGFBQWQ7O0FBUUEsaUJBQUssV0FBTDtBQUNBLGlCQUFLLFVBQUw7O0FBRUEsZ0JBQUksaUJBQWlCLENBQXJCO0FBQ0EsaUJBQUssSUFBTCxDQUFVLENBQVYsQ0FBWSxPQUFaLEdBQXNCO0FBQ2xCLHFCQUFLLENBRGE7QUFFbEIsd0JBQVE7QUFGVSxhQUF0QjtBQUlBLGdCQUFJLEtBQUssSUFBTCxDQUFVLFFBQWQsRUFBd0I7QUFDcEIsb0JBQUksUUFBUSxLQUFLLE1BQUwsQ0FBWSxDQUFaLENBQWMsTUFBZCxDQUFxQixJQUFyQixDQUEwQixNQUF0QztBQUNBLG9CQUFJLGlCQUFpQixRQUFTLGNBQTlCOztBQUVBLHFCQUFLLElBQUwsQ0FBVSxDQUFWLENBQVksT0FBWixDQUFvQixNQUFwQixHQUE2QixLQUFLLE1BQUwsQ0FBWSxDQUFaLENBQWMsTUFBZCxDQUFxQixPQUFyQixDQUE2QixNQUExRDtBQUNBLHFCQUFLLElBQUwsQ0FBVSxDQUFWLENBQVksT0FBWixDQUFvQixHQUFwQixHQUEwQixLQUFLLE1BQUwsQ0FBWSxDQUFaLENBQWMsTUFBZCxDQUFxQixPQUFyQixDQUE2QixHQUE3QixHQUFtQyxjQUE3RDtBQUNBLHFCQUFLLElBQUwsQ0FBVSxNQUFWLENBQWlCLEdBQWpCLEdBQXVCLEtBQUssTUFBTCxDQUFZLEtBQVosR0FBb0IsS0FBSyxDQUFMLENBQU8sTUFBUCxDQUFjLE9BQWQsQ0FBc0IsR0FBakU7QUFDQSxxQkFBSyxJQUFMLENBQVUsTUFBVixDQUFpQixNQUFqQixHQUEwQixLQUFLLE1BQUwsQ0FBWSxNQUFaLEdBQXFCLEtBQUssQ0FBTCxDQUFPLE1BQVAsQ0FBYyxPQUFkLENBQXNCLE1BQXJFO0FBQ0g7O0FBR0QsaUJBQUssSUFBTCxDQUFVLENBQVYsQ0FBWSxPQUFaLEdBQXNCO0FBQ2xCLHNCQUFNLENBRFk7QUFFbEIsdUJBQU87QUFGVyxhQUF0Qjs7QUFNQSxnQkFBSSxLQUFLLElBQUwsQ0FBVSxRQUFkLEVBQXdCO0FBQ3BCLG9CQUFJLFNBQVEsS0FBSyxNQUFMLENBQVksQ0FBWixDQUFjLE1BQWQsQ0FBcUIsSUFBckIsQ0FBMEIsTUFBdEM7QUFDQSxvQkFBSSxrQkFBaUIsU0FBUyxjQUE5QjtBQUNBLHFCQUFLLElBQUwsQ0FBVSxDQUFWLENBQVksT0FBWixDQUFvQixLQUFwQixHQUE0QixLQUFLLE1BQUwsQ0FBWSxDQUFaLENBQWMsTUFBZCxDQUFxQixPQUFyQixDQUE2QixJQUE3QixHQUFvQyxlQUFoRTtBQUNBLHFCQUFLLElBQUwsQ0FBVSxDQUFWLENBQVksT0FBWixDQUFvQixJQUFwQixHQUEyQixLQUFLLE1BQUwsQ0FBWSxDQUFaLENBQWMsTUFBZCxDQUFxQixPQUFyQixDQUE2QixJQUF4RDtBQUNBLHFCQUFLLElBQUwsQ0FBVSxNQUFWLENBQWlCLElBQWpCLEdBQXdCLEtBQUssTUFBTCxDQUFZLElBQVosR0FBbUIsS0FBSyxJQUFMLENBQVUsQ0FBVixDQUFZLE9BQVosQ0FBb0IsSUFBL0Q7QUFDQSxxQkFBSyxJQUFMLENBQVUsTUFBVixDQUFpQixLQUFqQixHQUF5QixLQUFLLE1BQUwsQ0FBWSxLQUFaLEdBQW9CLEtBQUssSUFBTCxDQUFVLENBQVYsQ0FBWSxPQUFaLENBQW9CLEtBQWpFO0FBQ0g7QUFDRCxpQkFBSyxJQUFMLENBQVUsVUFBVixHQUF1QixLQUFLLFVBQTVCO0FBQ0EsZ0JBQUksS0FBSyxJQUFMLENBQVUsVUFBZCxFQUEwQjtBQUN0QixxQkFBSyxJQUFMLENBQVUsTUFBVixDQUFpQixLQUFqQixJQUEwQixLQUFLLE1BQUwsQ0FBWSxLQUF0QztBQUNIO0FBQ0QsaUJBQUssZUFBTDtBQUNBLGlCQUFLLFdBQUw7O0FBRUEsbUJBQU8sSUFBUDtBQUNIOzs7c0NBRWE7QUFBQTs7QUFDVixnQkFBSSxPQUFPLElBQVg7QUFDQSxnQkFBSSxTQUFTLEtBQUssTUFBbEI7QUFDQSxnQkFBSSxJQUFJLEtBQUssSUFBTCxDQUFVLENBQWxCO0FBQ0EsZ0JBQUksSUFBSSxLQUFLLElBQUwsQ0FBVSxDQUFsQjtBQUNBLGdCQUFJLElBQUksS0FBSyxJQUFMLENBQVUsQ0FBbEI7O0FBR0EsY0FBRSxLQUFGLEdBQVU7QUFBQSx1QkFBSyxPQUFPLENBQVAsQ0FBUyxLQUFULENBQWUsSUFBZixDQUFvQixNQUFwQixFQUE0QixDQUE1QixDQUFMO0FBQUEsYUFBVjtBQUNBLGNBQUUsS0FBRixHQUFVO0FBQUEsdUJBQUssT0FBTyxDQUFQLENBQVMsS0FBVCxDQUFlLElBQWYsQ0FBb0IsTUFBcEIsRUFBNEIsQ0FBNUIsQ0FBTDtBQUFBLGFBQVY7QUFDQSxjQUFFLEtBQUYsR0FBVTtBQUFBLHVCQUFLLE9BQU8sQ0FBUCxDQUFTLEtBQVQsQ0FBZSxJQUFmLENBQW9CLE1BQXBCLEVBQTRCLENBQTVCLENBQUw7QUFBQSxhQUFWOztBQUVBLGNBQUUsWUFBRixHQUFpQixFQUFqQjtBQUNBLGNBQUUsWUFBRixHQUFpQixFQUFqQjs7QUFHQSxpQkFBSyxJQUFMLENBQVUsUUFBVixHQUFxQixDQUFDLENBQUMsT0FBTyxDQUFQLENBQVMsTUFBVCxDQUFnQixJQUFoQixDQUFxQixNQUE1QztBQUNBLGlCQUFLLElBQUwsQ0FBVSxRQUFWLEdBQXFCLENBQUMsQ0FBQyxPQUFPLENBQVAsQ0FBUyxNQUFULENBQWdCLElBQWhCLENBQXFCLE1BQTVDOztBQUVBLGNBQUUsTUFBRixHQUFXO0FBQ1AscUJBQUssU0FERTtBQUVQLHVCQUFPLEVBRkE7QUFHUCx3QkFBUSxFQUhEO0FBSVAsMEJBQVUsSUFKSDtBQUtQLHVCQUFPLENBTEE7QUFNUCx1QkFBTyxDQU5BO0FBT1AsMkJBQVc7QUFQSixhQUFYO0FBU0EsY0FBRSxNQUFGLEdBQVc7QUFDUCxxQkFBSyxTQURFO0FBRVAsdUJBQU8sRUFGQTtBQUdQLHdCQUFRLEVBSEQ7QUFJUCwwQkFBVSxJQUpIO0FBS1AsdUJBQU8sQ0FMQTtBQU1QLHVCQUFPLENBTkE7QUFPUCwyQkFBVztBQVBKLGFBQVg7O0FBVUEsZ0JBQUksV0FBVyxFQUFmO0FBQ0EsZ0JBQUksT0FBTyxTQUFYO0FBQ0EsZ0JBQUksT0FBTyxTQUFYO0FBQ0EsaUJBQUssSUFBTCxDQUFVLE9BQVYsQ0FBa0IsYUFBSTs7QUFFbEIsb0JBQUksT0FBTyxFQUFFLEtBQUYsQ0FBUSxDQUFSLENBQVg7QUFDQSxvQkFBSSxPQUFPLEVBQUUsS0FBRixDQUFRLENBQVIsQ0FBWDtBQUNBLG9CQUFJLFVBQVUsRUFBRSxLQUFGLENBQVEsQ0FBUixDQUFkO0FBQ0Esb0JBQUksT0FBTyxPQUFPLENBQVAsQ0FBUyxpQkFBVCxDQUEyQixPQUEzQixJQUFzQyxTQUF0QyxHQUFrRCxXQUFXLE9BQVgsQ0FBN0Q7O0FBR0Esb0JBQUksRUFBRSxZQUFGLENBQWUsT0FBZixDQUF1QixJQUF2QixNQUFpQyxDQUFDLENBQXRDLEVBQXlDO0FBQ3JDLHNCQUFFLFlBQUYsQ0FBZSxJQUFmLENBQW9CLElBQXBCO0FBQ0g7O0FBRUQsb0JBQUksRUFBRSxZQUFGLENBQWUsT0FBZixDQUF1QixJQUF2QixNQUFpQyxDQUFDLENBQXRDLEVBQXlDO0FBQ3JDLHNCQUFFLFlBQUYsQ0FBZSxJQUFmLENBQW9CLElBQXBCO0FBQ0g7O0FBRUQsb0JBQUksU0FBUyxFQUFFLE1BQWY7QUFDQSxvQkFBSSxLQUFLLElBQUwsQ0FBVSxRQUFkLEVBQXdCO0FBQ3BCLDZCQUFTLE9BQUssWUFBTCxDQUFrQixDQUFsQixFQUFxQixJQUFyQixFQUEyQixFQUFFLE1BQTdCLEVBQXFDLE9BQU8sQ0FBUCxDQUFTLE1BQTlDLENBQVQ7QUFDSDtBQUNELG9CQUFJLFNBQVMsRUFBRSxNQUFmO0FBQ0Esb0JBQUksS0FBSyxJQUFMLENBQVUsUUFBZCxFQUF3Qjs7QUFFcEIsNkJBQVMsT0FBSyxZQUFMLENBQWtCLENBQWxCLEVBQXFCLElBQXJCLEVBQTJCLEVBQUUsTUFBN0IsRUFBcUMsT0FBTyxDQUFQLENBQVMsTUFBOUMsQ0FBVDtBQUNIOztBQUVELG9CQUFJLENBQUMsU0FBUyxPQUFPLEtBQWhCLENBQUwsRUFBNkI7QUFDekIsNkJBQVMsT0FBTyxLQUFoQixJQUF5QixFQUF6QjtBQUNIOztBQUVELG9CQUFJLENBQUMsU0FBUyxPQUFPLEtBQWhCLEVBQXVCLE9BQU8sS0FBOUIsQ0FBTCxFQUEyQztBQUN2Qyw2QkFBUyxPQUFPLEtBQWhCLEVBQXVCLE9BQU8sS0FBOUIsSUFBdUMsRUFBdkM7QUFDSDtBQUNELG9CQUFJLENBQUMsU0FBUyxPQUFPLEtBQWhCLEVBQXVCLE9BQU8sS0FBOUIsRUFBcUMsSUFBckMsQ0FBTCxFQUFpRDtBQUM3Qyw2QkFBUyxPQUFPLEtBQWhCLEVBQXVCLE9BQU8sS0FBOUIsRUFBcUMsSUFBckMsSUFBNkMsRUFBN0M7QUFDSDtBQUNELHlCQUFTLE9BQU8sS0FBaEIsRUFBdUIsT0FBTyxLQUE5QixFQUFxQyxJQUFyQyxFQUEyQyxJQUEzQyxJQUFtRCxJQUFuRDs7QUFHQSxvQkFBSSxTQUFTLFNBQVQsSUFBc0IsT0FBTyxJQUFqQyxFQUF1QztBQUNuQywyQkFBTyxJQUFQO0FBQ0g7QUFDRCxvQkFBSSxTQUFTLFNBQVQsSUFBc0IsT0FBTyxJQUFqQyxFQUF1QztBQUNuQywyQkFBTyxJQUFQO0FBQ0g7QUFDSixhQTdDRDtBQThDQSxpQkFBSyxJQUFMLENBQVUsUUFBVixHQUFxQixRQUFyQjs7QUFHQSxnQkFBSSxDQUFDLEtBQUssSUFBTCxDQUFVLFFBQWYsRUFBeUI7QUFDckIsa0JBQUUsTUFBRixDQUFTLE1BQVQsR0FBa0IsRUFBRSxZQUFwQjtBQUNIOztBQUVELGdCQUFJLENBQUMsS0FBSyxJQUFMLENBQVUsUUFBZixFQUF5QjtBQUNyQixrQkFBRSxNQUFGLENBQVMsTUFBVCxHQUFrQixFQUFFLFlBQXBCO0FBQ0g7O0FBRUQsaUJBQUssMkJBQUw7O0FBRUEsY0FBRSxJQUFGLEdBQVMsRUFBVDtBQUNBLGNBQUUsZ0JBQUYsR0FBcUIsQ0FBckI7QUFDQSxjQUFFLGFBQUYsR0FBa0IsRUFBbEI7QUFDQSxpQkFBSyxVQUFMLENBQWdCLENBQWhCLEVBQW1CLEVBQUUsTUFBckIsRUFBNkIsT0FBTyxDQUFwQzs7QUFFQSxjQUFFLElBQUYsR0FBUyxFQUFUO0FBQ0EsY0FBRSxnQkFBRixHQUFxQixDQUFyQjtBQUNBLGNBQUUsYUFBRixHQUFrQixFQUFsQjtBQUNBLGlCQUFLLFVBQUwsQ0FBZ0IsQ0FBaEIsRUFBbUIsRUFBRSxNQUFyQixFQUE2QixPQUFPLENBQXBDOztBQUVBLGNBQUUsR0FBRixHQUFRLElBQVI7QUFDQSxjQUFFLEdBQUYsR0FBUSxJQUFSO0FBRUg7OztzREFFNkIsQ0FDN0I7OztxQ0FFWTtBQUNULGdCQUFJLE9BQU8sSUFBWDtBQUNBLGdCQUFJLElBQUksS0FBSyxJQUFMLENBQVUsQ0FBbEI7QUFDQSxnQkFBSSxJQUFJLEtBQUssSUFBTCxDQUFVLENBQWxCO0FBQ0EsZ0JBQUksSUFBSSxLQUFLLElBQUwsQ0FBVSxDQUFsQjtBQUNBLGdCQUFJLFdBQVcsS0FBSyxJQUFMLENBQVUsUUFBekI7O0FBRUEsZ0JBQUksY0FBYyxLQUFLLElBQUwsQ0FBVSxLQUFWLEdBQWtCLEVBQXBDO0FBQ0EsZ0JBQUksU0FBUyxLQUFLLElBQUwsQ0FBVSxNQUFWLEdBQW1CLEVBQWhDOztBQUVBLGNBQUUsYUFBRixDQUFnQixPQUFoQixDQUF3QixVQUFDLEVBQUQsRUFBSyxDQUFMLEVBQVU7QUFDOUIsb0JBQUksTUFBTSxFQUFWO0FBQ0EsdUJBQU8sSUFBUCxDQUFZLEdBQVo7O0FBRUEsa0JBQUUsYUFBRixDQUFnQixPQUFoQixDQUF3QixVQUFDLEVBQUQsRUFBSyxDQUFMLEVBQVc7QUFDL0Isd0JBQUksT0FBTyxTQUFYO0FBQ0Esd0JBQUk7QUFDQSwrQkFBTyxTQUFTLEdBQUcsS0FBSCxDQUFTLEtBQWxCLEVBQXlCLEdBQUcsS0FBSCxDQUFTLEtBQWxDLEVBQXlDLEdBQUcsR0FBNUMsRUFBaUQsR0FBRyxHQUFwRCxDQUFQO0FBQ0gscUJBRkQsQ0FFRSxPQUFPLENBQVAsRUFBVSxDQUNYOztBQUVELHdCQUFJLE9BQU87QUFDUCxnQ0FBUSxFQUREO0FBRVAsZ0NBQVEsRUFGRDtBQUdQLDZCQUFLLENBSEU7QUFJUCw2QkFBSyxDQUpFO0FBS1AsK0JBQU87QUFMQSxxQkFBWDtBQU9BLHdCQUFJLElBQUosQ0FBUyxJQUFUOztBQUVBLGdDQUFZLElBQVosQ0FBaUIsSUFBakI7QUFDSCxpQkFqQkQ7QUFrQkgsYUF0QkQ7QUF3Qkg7OztxQ0FFWSxDLEVBQUcsTyxFQUFTLFMsRUFBVyxnQixFQUFrQjs7QUFFbEQsZ0JBQUksU0FBUyxLQUFLLE1BQWxCO0FBQ0EsZ0JBQUksZUFBZSxTQUFuQjtBQUNBLDZCQUFpQixJQUFqQixDQUFzQixPQUF0QixDQUE4QixVQUFDLFFBQUQsRUFBVyxhQUFYLEVBQTZCO0FBQ3ZELDZCQUFhLEdBQWIsR0FBbUIsUUFBbkI7O0FBRUEsb0JBQUksQ0FBQyxhQUFhLFFBQWxCLEVBQTRCO0FBQ3hCLGlDQUFhLFFBQWIsR0FBd0IsRUFBeEI7QUFDSDs7QUFFRCxvQkFBSSxnQkFBZ0IsaUJBQWlCLEtBQWpCLENBQXVCLElBQXZCLENBQTRCLE1BQTVCLEVBQW9DLENBQXBDLEVBQXVDLFFBQXZDLENBQXBCOztBQUVBLG9CQUFJLENBQUMsYUFBYSxRQUFiLENBQXNCLGNBQXRCLENBQXFDLGFBQXJDLENBQUwsRUFBMEQ7QUFDdEQsOEJBQVUsU0FBVjtBQUNBLGlDQUFhLFFBQWIsQ0FBc0IsYUFBdEIsSUFBdUM7QUFDbkMsZ0NBQVEsRUFEMkI7QUFFbkMsa0NBQVUsSUFGeUI7QUFHbkMsdUNBQWUsYUFIb0I7QUFJbkMsK0JBQU8sYUFBYSxLQUFiLEdBQXFCLENBSk87QUFLbkMsK0JBQU8sVUFBVSxTQUxrQjtBQU1uQyw2QkFBSztBQU44QixxQkFBdkM7QUFRSDs7QUFFRCwrQkFBZSxhQUFhLFFBQWIsQ0FBc0IsYUFBdEIsQ0FBZjtBQUNILGFBdEJEOztBQXdCQSxnQkFBSSxhQUFhLE1BQWIsQ0FBb0IsT0FBcEIsQ0FBNEIsT0FBNUIsTUFBeUMsQ0FBQyxDQUE5QyxFQUFpRDtBQUM3Qyw2QkFBYSxNQUFiLENBQW9CLElBQXBCLENBQXlCLE9BQXpCO0FBQ0g7O0FBRUQsbUJBQU8sWUFBUDtBQUNIOzs7bUNBRVUsSSxFQUFNLEssRUFBTyxVLEVBQVksSSxFQUFNO0FBQ3RDLGdCQUFJLFdBQVcsTUFBWCxDQUFrQixNQUFsQixJQUE0QixXQUFXLE1BQVgsQ0FBa0IsTUFBbEIsQ0FBeUIsTUFBekIsR0FBa0MsTUFBTSxLQUF4RSxFQUErRTtBQUMzRSxzQkFBTSxLQUFOLEdBQWMsV0FBVyxNQUFYLENBQWtCLE1BQWxCLENBQXlCLE1BQU0sS0FBL0IsQ0FBZDtBQUNILGFBRkQsTUFFTztBQUNILHNCQUFNLEtBQU4sR0FBYyxNQUFNLEdBQXBCO0FBQ0g7O0FBRUQsZ0JBQUksQ0FBQyxJQUFMLEVBQVc7QUFDUCx1QkFBTyxDQUFDLENBQUQsQ0FBUDtBQUNIO0FBQ0QsZ0JBQUksS0FBSyxNQUFMLElBQWUsTUFBTSxLQUF6QixFQUFnQztBQUM1QixxQkFBSyxJQUFMLENBQVUsQ0FBVjtBQUNIOztBQUVELGtCQUFNLGNBQU4sR0FBdUIsTUFBTSxjQUFOLElBQXdCLENBQS9DO0FBQ0Esa0JBQU0sb0JBQU4sR0FBNkIsTUFBTSxvQkFBTixJQUE4QixDQUEzRDs7QUFFQSxrQkFBTSxJQUFOLEdBQWEsS0FBSyxLQUFMLEVBQWI7QUFDQSxrQkFBTSxVQUFOLEdBQW1CLEtBQUssS0FBTCxFQUFuQjs7QUFHQSxrQkFBTSxRQUFOLEdBQWlCLFFBQVEsZUFBUixDQUF3QixNQUFNLElBQTlCLENBQWpCO0FBQ0Esa0JBQU0sY0FBTixHQUF1QixNQUFNLFFBQTdCO0FBQ0EsZ0JBQUksTUFBTSxNQUFWLEVBQWtCO0FBQ2Qsb0JBQUksV0FBVyxVQUFmLEVBQTJCO0FBQ3ZCLDBCQUFNLE1BQU4sQ0FBYSxJQUFiLENBQWtCLFdBQVcsY0FBN0I7QUFDSDtBQUNELHNCQUFNLE1BQU4sQ0FBYSxPQUFiLENBQXFCO0FBQUEsMkJBQUcsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLEVBQUMsS0FBSyxDQUFOLEVBQVMsT0FBTyxLQUFoQixFQUF4QixDQUFIO0FBQUEsaUJBQXJCO0FBQ0Esc0JBQU0sb0JBQU4sR0FBNkIsS0FBSyxnQkFBbEM7QUFDQSxxQkFBSyxnQkFBTCxJQUF5QixNQUFNLE1BQU4sQ0FBYSxNQUF0QztBQUNBLHNCQUFNLGNBQU4sSUFBd0IsTUFBTSxNQUFOLENBQWEsTUFBckM7QUFDSDs7QUFFRCxrQkFBTSxZQUFOLEdBQXFCLEVBQXJCO0FBQ0EsZ0JBQUksTUFBTSxRQUFWLEVBQW9CO0FBQ2hCLG9CQUFJLGdCQUFnQixDQUFwQjs7QUFFQSxxQkFBSyxJQUFJLFNBQVQsSUFBc0IsTUFBTSxRQUE1QixFQUFzQztBQUNsQyx3QkFBSSxNQUFNLFFBQU4sQ0FBZSxjQUFmLENBQThCLFNBQTlCLENBQUosRUFBOEM7QUFDMUMsNEJBQUksUUFBUSxNQUFNLFFBQU4sQ0FBZSxTQUFmLENBQVo7QUFDQSw4QkFBTSxZQUFOLENBQW1CLElBQW5CLENBQXdCLEtBQXhCO0FBQ0E7O0FBRUEsNkJBQUssVUFBTCxDQUFnQixJQUFoQixFQUFzQixLQUF0QixFQUE2QixVQUE3QixFQUF5QyxJQUF6QztBQUNBLDhCQUFNLGNBQU4sSUFBd0IsTUFBTSxjQUE5QjtBQUNBLDZCQUFLLE1BQU0sS0FBWCxLQUFxQixDQUFyQjtBQUNIO0FBQ0o7O0FBRUQsb0JBQUksUUFBUSxnQkFBZ0IsQ0FBNUIsRUFBK0I7QUFDM0IseUJBQUssTUFBTSxLQUFYLEtBQXFCLENBQXJCO0FBQ0g7O0FBRUQsc0JBQU0sVUFBTixHQUFtQixFQUFuQjtBQUNBLHFCQUFLLE9BQUwsQ0FBYSxVQUFDLENBQUQsRUFBSSxDQUFKLEVBQVM7QUFDbEIsMEJBQU0sVUFBTixDQUFpQixJQUFqQixDQUFzQixLQUFLLE1BQU0sVUFBTixDQUFpQixDQUFqQixLQUF1QixDQUE1QixDQUF0QjtBQUNILGlCQUZEO0FBR0Esc0JBQU0sY0FBTixHQUF1QixRQUFRLGVBQVIsQ0FBd0IsTUFBTSxVQUE5QixDQUF2Qjs7QUFFQSxvQkFBSSxLQUFLLElBQUwsQ0FBVSxNQUFWLEdBQW1CLEtBQUssTUFBNUIsRUFBb0M7QUFDaEMseUJBQUssSUFBTCxHQUFZLElBQVo7QUFDSDtBQUNKO0FBRUo7OztnREFFdUIsTSxFQUFRO0FBQzVCLGdCQUFJLFdBQVcsS0FBSyxJQUFMLENBQVUsTUFBVixDQUFpQixJQUFoQztBQUNBLGdCQUFJLEtBQUssTUFBTCxDQUFZLENBQVosQ0FBYyxLQUFsQixFQUF5QjtBQUNyQiw0QkFBWSxFQUFaO0FBQ0g7QUFDRCxnQkFBSSxVQUFVLE9BQU8sQ0FBckIsRUFBd0I7QUFDcEIsNEJBQVksT0FBTyxDQUFuQjtBQUNIOztBQUVELGdCQUFJLEtBQUssTUFBTCxDQUFZLENBQVosQ0FBYyxZQUFsQixFQUFnQztBQUM1Qiw0QkFBWSxhQUFNLE1BQWxCO0FBQ0Esb0JBQUksV0FBVyxFQUFmLEM7QUFDQSw0QkFBVyxXQUFTLENBQXBCO0FBQ0g7O0FBRUQsbUJBQU8sUUFBUDtBQUNIOzs7Z0RBRXVCLE0sRUFBUTtBQUM1QixnQkFBSSxDQUFDLEtBQUssTUFBTCxDQUFZLENBQVosQ0FBYyxZQUFuQixFQUFpQztBQUM3Qix1QkFBTyxLQUFLLElBQUwsQ0FBVSxTQUFWLEdBQXNCLENBQTdCO0FBQ0g7QUFDRCxnQkFBSSxPQUFPLEtBQUssSUFBTCxDQUFVLE1BQVYsQ0FBaUIsTUFBNUI7QUFDQSxnQkFBSSxLQUFLLE1BQUwsQ0FBWSxDQUFaLENBQWMsS0FBbEIsRUFBeUI7QUFDckIsd0JBQVEsRUFBUjtBQUNIO0FBQ0QsZ0JBQUksVUFBVSxPQUFPLENBQXJCLEVBQXdCO0FBQ3BCLHdCQUFRLE9BQU8sQ0FBZjtBQUNIOztBQUVELG9CQUFRLGFBQU0sTUFBZDs7QUFFQSxnQkFBSSxXQUFXLEVBQWYsQztBQUNBLG9CQUFPLFdBQVMsQ0FBaEI7O0FBRUEsbUJBQU8sSUFBUDtBQUNIOzs7MENBWWlCOztBQUVkLGdCQUFJLE9BQU8sS0FBSyxJQUFoQjtBQUNBLGdCQUFJLE9BQU8sS0FBSyxNQUFoQjtBQUNBLGdCQUFJLFNBQVMsS0FBSyxNQUFsQjtBQUNBLGdCQUFJLGlCQUFpQixhQUFNLGNBQU4sQ0FBcUIsS0FBSyxNQUFMLENBQVksS0FBakMsRUFBd0MsS0FBSyxnQkFBTCxFQUF4QyxFQUFpRSxLQUFLLElBQUwsQ0FBVSxNQUEzRSxDQUFyQjtBQUNBLGdCQUFJLGtCQUFrQixhQUFNLGVBQU4sQ0FBc0IsS0FBSyxNQUFMLENBQVksTUFBbEMsRUFBMEMsS0FBSyxnQkFBTCxFQUExQyxFQUFtRSxLQUFLLElBQUwsQ0FBVSxNQUE3RSxDQUF0QjtBQUNBLGdCQUFJLFFBQVEsY0FBWjtBQUNBLGdCQUFJLFNBQVMsZUFBYjs7QUFFQSxnQkFBSSxZQUFZLFFBQVEsZUFBUixDQUF3QixLQUFLLENBQUwsQ0FBTyxJQUEvQixDQUFoQjs7QUFHQSxnQkFBSSxvQkFBb0IsS0FBSyxHQUFMLENBQVMsS0FBSyxJQUFMLENBQVUsT0FBbkIsRUFBNEIsS0FBSyxHQUFMLENBQVMsS0FBSyxJQUFMLENBQVUsT0FBbkIsRUFBNEIsQ0FBQyxpQkFBaUIsU0FBbEIsSUFBK0IsS0FBSyxJQUFMLENBQVUsQ0FBVixDQUFZLGdCQUF2RSxDQUE1QixDQUF4QjtBQUNBLGdCQUFJLEtBQUssTUFBTCxDQUFZLEtBQWhCLEVBQXVCOztBQUVuQixvQkFBSSxDQUFDLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsS0FBdEIsRUFBNkI7QUFDekIseUJBQUssSUFBTCxDQUFVLFNBQVYsR0FBc0IsaUJBQXRCO0FBQ0g7QUFFSixhQU5ELE1BTU87QUFDSCxxQkFBSyxJQUFMLENBQVUsU0FBVixHQUFzQixLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLEtBQXZDOztBQUVBLG9CQUFJLENBQUMsS0FBSyxJQUFMLENBQVUsU0FBZixFQUEwQjtBQUN0Qix5QkFBSyxJQUFMLENBQVUsU0FBVixHQUFzQixpQkFBdEI7QUFDSDtBQUVKO0FBQ0Qsb0JBQVEsS0FBSyxJQUFMLENBQVUsU0FBVixHQUFzQixLQUFLLElBQUwsQ0FBVSxDQUFWLENBQVksZ0JBQWxDLEdBQXFELE9BQU8sSUFBNUQsR0FBbUUsT0FBTyxLQUExRSxHQUFrRixTQUExRjs7QUFFQSxnQkFBSSxZQUFZLFFBQVEsZUFBUixDQUF3QixLQUFLLENBQUwsQ0FBTyxJQUEvQixDQUFoQjtBQUNBLGdCQUFJLHFCQUFxQixLQUFLLEdBQUwsQ0FBUyxLQUFLLElBQUwsQ0FBVSxPQUFuQixFQUE0QixLQUFLLEdBQUwsQ0FBUyxLQUFLLElBQUwsQ0FBVSxPQUFuQixFQUE0QixDQUFDLGtCQUFrQixTQUFuQixJQUFnQyxLQUFLLElBQUwsQ0FBVSxDQUFWLENBQVksZ0JBQXhFLENBQTVCLENBQXpCO0FBQ0EsZ0JBQUksS0FBSyxNQUFMLENBQVksTUFBaEIsRUFBd0I7QUFDcEIsb0JBQUksQ0FBQyxLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLE1BQXRCLEVBQThCO0FBQzFCLHlCQUFLLElBQUwsQ0FBVSxVQUFWLEdBQXVCLGtCQUF2QjtBQUNIO0FBQ0osYUFKRCxNQUlPO0FBQ0gscUJBQUssSUFBTCxDQUFVLFVBQVYsR0FBdUIsS0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixNQUF4Qzs7QUFFQSxvQkFBSSxDQUFDLEtBQUssSUFBTCxDQUFVLFVBQWYsRUFBMkI7QUFDdkIseUJBQUssSUFBTCxDQUFVLFVBQVYsR0FBdUIsa0JBQXZCO0FBQ0g7QUFFSjs7QUFFRCxxQkFBUyxLQUFLLElBQUwsQ0FBVSxVQUFWLEdBQXVCLEtBQUssSUFBTCxDQUFVLENBQVYsQ0FBWSxnQkFBbkMsR0FBc0QsT0FBTyxHQUE3RCxHQUFtRSxPQUFPLE1BQTFFLEdBQW1GLFNBQTVGOztBQUdBLGlCQUFLLElBQUwsQ0FBVSxLQUFWLEdBQWtCLFFBQVEsT0FBTyxJQUFmLEdBQXNCLE9BQU8sS0FBL0M7QUFDQSxpQkFBSyxJQUFMLENBQVUsTUFBVixHQUFtQixTQUFTLE9BQU8sR0FBaEIsR0FBc0IsT0FBTyxNQUFoRDtBQUNIOzs7c0NBR2E7O0FBRVYsZ0JBQUksT0FBTyxJQUFYO0FBQ0EsZ0JBQUksU0FBUyxLQUFLLE1BQWxCO0FBQ0EsZ0JBQUksSUFBSSxLQUFLLElBQUwsQ0FBVSxDQUFsQjtBQUNBLGdCQUFJLFFBQVEsT0FBTyxLQUFQLENBQWEsS0FBekI7QUFDQSxnQkFBSSxTQUFTLEVBQUUsR0FBRixHQUFRLEVBQUUsR0FBdkI7QUFDQSxnQkFBSSxLQUFKO0FBQ0EsY0FBRSxNQUFGLEdBQVcsRUFBWDtBQUNBLGdCQUFJLE9BQU8sS0FBUCxDQUFhLEtBQWIsSUFBc0IsS0FBMUIsRUFBaUM7QUFDN0Isb0JBQUksV0FBVyxFQUFmO0FBQ0Esc0JBQU0sT0FBTixDQUFjLFVBQUMsQ0FBRCxFQUFJLENBQUosRUFBUztBQUNuQix3QkFBSSxJQUFJLEVBQUUsR0FBRixHQUFTLFNBQVMsS0FBSyxHQUFMLENBQVMsRUFBVCxFQUFhLENBQWIsQ0FBMUI7QUFDQSxzQkFBRSxNQUFGLENBQVMsSUFBVCxDQUFjLENBQWQ7QUFDSCxpQkFIRDtBQUlBLHdCQUFRLEdBQUcsS0FBSCxDQUFTLEdBQVQsR0FBZSxRQUFmLENBQXdCLFFBQXhCLENBQVI7QUFDSCxhQVBELE1BT08sSUFBSSxPQUFPLEtBQVAsQ0FBYSxLQUFiLElBQXNCLEtBQTFCLEVBQWlDOztBQUVwQyxzQkFBTSxPQUFOLENBQWMsVUFBQyxDQUFELEVBQUksQ0FBSixFQUFTO0FBQ25CLHdCQUFJLElBQUksRUFBRSxHQUFGLEdBQVMsU0FBUyxLQUFLLEdBQUwsQ0FBUyxFQUFULEVBQWEsQ0FBYixDQUExQjtBQUNBLHNCQUFFLE1BQUYsQ0FBUyxPQUFULENBQWlCLENBQWpCO0FBRUgsaUJBSkQ7O0FBTUEsd0JBQVEsR0FBRyxLQUFILENBQVMsR0FBVCxFQUFSO0FBQ0gsYUFUTSxNQVNBO0FBQ0gsc0JBQU0sT0FBTixDQUFjLFVBQUMsQ0FBRCxFQUFJLENBQUosRUFBUztBQUNuQix3QkFBSSxJQUFJLEVBQUUsR0FBRixHQUFTLFVBQVUsS0FBSyxNQUFNLE1BQU4sR0FBZSxDQUFwQixDQUFWLENBQWpCO0FBQ0Esc0JBQUUsTUFBRixDQUFTLElBQVQsQ0FBYyxDQUFkO0FBQ0gsaUJBSEQ7QUFJQSx3QkFBUSxHQUFHLEtBQUgsQ0FBUyxPQUFPLEtBQVAsQ0FBYSxLQUF0QixHQUFSO0FBQ0g7O0FBR0QsY0FBRSxNQUFGLENBQVMsQ0FBVCxJQUFjLEVBQUUsR0FBaEIsQztBQUNBLGNBQUUsTUFBRixDQUFTLEVBQUUsTUFBRixDQUFTLE1BQVQsR0FBa0IsQ0FBM0IsSUFBZ0MsRUFBRSxHQUFsQyxDO0FBQ0Esb0JBQVEsR0FBUixDQUFZLEVBQUUsTUFBZDs7QUFFQSxnQkFBSSxPQUFPLEtBQVAsQ0FBYSxZQUFqQixFQUErQjtBQUMzQixrQkFBRSxNQUFGLENBQVMsT0FBVDtBQUNIOztBQUVELGdCQUFJLE9BQU8sS0FBSyxJQUFoQjs7QUFFQSxvQkFBUSxHQUFSLENBQVksS0FBWjtBQUNBLGlCQUFLLENBQUwsQ0FBTyxLQUFQLENBQWEsS0FBYixHQUFxQixNQUFNLE1BQU4sQ0FBYSxFQUFFLE1BQWYsRUFBdUIsS0FBdkIsQ0FBNkIsS0FBN0IsQ0FBckI7QUFDQSxnQkFBSSxRQUFRLEtBQUssQ0FBTCxDQUFPLEtBQVAsR0FBZSxFQUEzQjs7QUFFQSxnQkFBSSxXQUFXLEtBQUssTUFBTCxDQUFZLElBQTNCO0FBQ0Esa0JBQU0sSUFBTixHQUFhLE1BQWI7O0FBRUEsaUJBQUssQ0FBTCxDQUFPLEtBQVAsQ0FBYSxLQUFiLEdBQXFCLEtBQUssU0FBTCxHQUFpQixTQUFTLE9BQVQsR0FBbUIsQ0FBekQ7QUFDQSxpQkFBSyxDQUFMLENBQU8sS0FBUCxDQUFhLE1BQWIsR0FBc0IsS0FBSyxVQUFMLEdBQWtCLFNBQVMsT0FBVCxHQUFtQixDQUEzRDtBQUNIOzs7K0JBR00sTyxFQUFTO0FBQ1osc0ZBQWEsT0FBYjtBQUNBLGdCQUFJLEtBQUssSUFBTCxDQUFVLFFBQWQsRUFBd0I7QUFDcEIscUJBQUssV0FBTCxDQUFpQixLQUFLLElBQUwsQ0FBVSxDQUFWLENBQVksTUFBN0IsRUFBcUMsS0FBSyxJQUExQztBQUNIO0FBQ0QsZ0JBQUksS0FBSyxJQUFMLENBQVUsUUFBZCxFQUF3QjtBQUNwQixxQkFBSyxXQUFMLENBQWlCLEtBQUssSUFBTCxDQUFVLENBQVYsQ0FBWSxNQUE3QixFQUFxQyxLQUFLLElBQTFDO0FBQ0g7O0FBRUQsaUJBQUssV0FBTDs7OztBQUlBLGlCQUFLLFdBQUw7QUFDQSxpQkFBSyxXQUFMOztBQUVBLGdCQUFJLEtBQUssTUFBTCxDQUFZLFVBQWhCLEVBQTRCO0FBQ3hCLHFCQUFLLFlBQUw7QUFDSDs7QUFFRCxpQkFBSyxnQkFBTDtBQUNIOzs7MkNBRWtCO0FBQ2YsZ0JBQUksT0FBTyxJQUFYO0FBQ0EsZ0JBQUksT0FBTyxLQUFLLElBQWhCO0FBR0g7OztzQ0FHYTtBQUNWLGdCQUFJLE9BQU8sSUFBWDtBQUNBLGdCQUFJLE9BQU8sS0FBSyxJQUFoQjtBQUNBLGdCQUFJLGFBQWEsS0FBSyxXQUFMLENBQWlCLE9BQWpCLENBQWpCO0FBQ0EsZ0JBQUksY0FBYyxhQUFhLElBQS9CO0FBQ0EsZ0JBQUksY0FBYyxhQUFhLElBQS9CO0FBQ0EsaUJBQUssVUFBTCxHQUFrQixVQUFsQjs7QUFFQSxnQkFBSSxVQUFVO0FBQ1YsbUJBQUcsQ0FETztBQUVWLG1CQUFHO0FBRk8sYUFBZDtBQUlBLGdCQUFJLFVBQVUsUUFBUSxjQUFSLENBQXVCLENBQXZCLENBQWQ7QUFDQSxnQkFBSSxLQUFLLFFBQVQsRUFBbUI7QUFDZixvQkFBSSxVQUFVLEtBQUssTUFBTCxDQUFZLENBQVosQ0FBYyxNQUFkLENBQXFCLE9BQW5DOztBQUVBLHdCQUFRLENBQVIsR0FBWSxVQUFVLENBQXRCO0FBQ0Esd0JBQVEsQ0FBUixHQUFZLFFBQVEsTUFBUixHQUFpQixVQUFVLENBQTNCLEdBQStCLENBQTNDO0FBQ0gsYUFMRCxNQUtPLElBQUksS0FBSyxRQUFULEVBQW1CO0FBQ3RCLHdCQUFRLENBQVIsR0FBWSxPQUFaO0FBQ0g7O0FBR0QsZ0JBQUksU0FBUyxLQUFLLElBQUwsQ0FBVSxTQUFWLENBQW9CLFVBQVUsV0FBOUIsRUFDUixJQURRLENBQ0gsS0FBSyxDQUFMLENBQU8sYUFESixFQUNtQixVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsdUJBQVEsQ0FBUjtBQUFBLGFBRG5CLENBQWI7O0FBR0EsbUJBQU8sS0FBUCxHQUFlLE1BQWYsQ0FBc0IsTUFBdEIsRUFBOEIsSUFBOUIsQ0FBbUMsT0FBbkMsRUFBNEMsVUFBQyxDQUFELEVBQUksQ0FBSjtBQUFBLHVCQUFVLGFBQWEsR0FBYixHQUFtQixXQUFuQixHQUFpQyxHQUFqQyxHQUF1QyxXQUF2QyxHQUFxRCxHQUFyRCxHQUEyRCxDQUFyRTtBQUFBLGFBQTVDOztBQUVBLG1CQUNLLElBREwsQ0FDVSxHQURWLEVBQ2UsVUFBQyxDQUFELEVBQUksQ0FBSjtBQUFBLHVCQUFXLElBQUksS0FBSyxTQUFULEdBQXFCLEtBQUssU0FBTCxHQUFpQixDQUF2QyxHQUE2QyxFQUFFLEtBQUYsQ0FBUSxRQUFyRCxHQUFpRSxRQUFRLENBQW5GO0FBQUEsYUFEZixFQUVLLElBRkwsQ0FFVSxHQUZWLEVBRWUsS0FBSyxNQUFMLEdBQWMsUUFBUSxDQUZyQyxFQUdLLElBSEwsQ0FHVSxJQUhWLEVBR2dCLEVBSGhCLEVBS0ssSUFMTCxDQUtVLGFBTFYsRUFLeUIsUUFMekIsRUFNSyxJQU5MLENBTVU7QUFBQSx1QkFBRyxLQUFLLFlBQUwsQ0FBa0IsRUFBRSxHQUFwQixDQUFIO0FBQUEsYUFOVjs7QUFVQSxnQkFBSSxXQUFXLEtBQUssdUJBQUwsQ0FBNkIsT0FBN0IsQ0FBZjs7QUFFQSxtQkFBTyxJQUFQLENBQVksVUFBVSxLQUFWLEVBQWlCO0FBQ3pCLG9CQUFJLE9BQU8sR0FBRyxNQUFILENBQVUsSUFBVixDQUFYO0FBQUEsb0JBQ0ksT0FBTyxLQUFLLFlBQUwsQ0FBa0IsTUFBTSxHQUF4QixDQURYO0FBRUEsNkJBQU0sK0JBQU4sQ0FBc0MsSUFBdEMsRUFBNEMsSUFBNUMsRUFBa0QsUUFBbEQsRUFBNEQsS0FBSyxNQUFMLENBQVksV0FBWixHQUEwQixLQUFLLElBQUwsQ0FBVSxPQUFwQyxHQUE4QyxLQUExRztBQUNILGFBSkQ7O0FBTUEsZ0JBQUksS0FBSyxNQUFMLENBQVksQ0FBWixDQUFjLFlBQWxCLEVBQWdDO0FBQzVCLHVCQUFPLElBQVAsQ0FBWSxXQUFaLEVBQXlCLFVBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSwyQkFBVSxrQkFBbUIsSUFBSSxLQUFLLFNBQVQsR0FBcUIsS0FBSyxTQUFMLEdBQWlCLENBQXZDLEdBQTRDLEVBQUUsS0FBRixDQUFRLFFBQXBELEdBQStELFFBQVEsQ0FBekYsSUFBK0YsSUFBL0YsSUFBd0csS0FBSyxNQUFMLEdBQWMsUUFBUSxDQUE5SCxJQUFtSSxHQUE3STtBQUFBLGlCQUF6QixFQUNLLElBREwsQ0FDVSxJQURWLEVBQ2dCLENBQUMsQ0FEakIsRUFFSyxJQUZMLENBRVUsSUFGVixFQUVnQixDQUZoQixFQUdLLElBSEwsQ0FHVSxhQUhWLEVBR3lCLEtBSHpCO0FBSUg7O0FBR0QsbUJBQU8sSUFBUCxHQUFjLE1BQWQ7O0FBR0EsaUJBQUssSUFBTCxDQUFVLGNBQVYsQ0FBeUIsT0FBTyxLQUFLLFdBQUwsQ0FBaUIsUUFBakIsQ0FBaEMsRUFDSyxJQURMLENBQ1UsV0FEVixFQUN1QixlQUFnQixLQUFLLEtBQUwsR0FBYSxDQUE3QixHQUFrQyxHQUFsQyxJQUF5QyxLQUFLLE1BQUwsR0FBYyxLQUFLLE1BQUwsQ0FBWSxNQUFuRSxJQUE2RSxHQURwRyxFQUVLLGNBRkwsQ0FFb0IsVUFBVSxLQUFLLFdBQUwsQ0FBaUIsT0FBakIsQ0FGOUIsRUFJSyxJQUpMLENBSVUsSUFKVixFQUlnQixRQUpoQixFQUtLLEtBTEwsQ0FLVyxhQUxYLEVBSzBCLFFBTDFCLEVBTUssSUFOTCxDQU1VLEtBQUssTUFBTCxDQUFZLENBQVosQ0FBYyxLQU54QjtBQU9IOzs7c0NBRWE7QUFDVixnQkFBSSxPQUFPLElBQVg7QUFDQSxnQkFBSSxPQUFPLEtBQUssSUFBaEI7QUFDQSxnQkFBSSxhQUFhLEtBQUssV0FBTCxDQUFpQixPQUFqQixDQUFqQjtBQUNBLGdCQUFJLGNBQWMsYUFBYSxJQUEvQjtBQUNBLGlCQUFLLFVBQUwsR0FBa0IsVUFBbEI7O0FBR0EsZ0JBQUksU0FBUyxLQUFLLElBQUwsQ0FBVSxTQUFWLENBQW9CLFVBQVUsV0FBOUIsRUFDUixJQURRLENBQ0gsS0FBSyxDQUFMLENBQU8sYUFESixDQUFiOztBQUdBLG1CQUFPLEtBQVAsR0FBZSxNQUFmLENBQXNCLE1BQXRCOztBQUVBLGdCQUFJLFVBQVU7QUFDVixtQkFBRyxDQURPO0FBRVYsbUJBQUc7QUFGTyxhQUFkO0FBSUEsZ0JBQUksS0FBSyxRQUFULEVBQW1CO0FBQ2Ysb0JBQUksVUFBVSxLQUFLLE1BQUwsQ0FBWSxDQUFaLENBQWMsTUFBZCxDQUFxQixPQUFuQztBQUNBLG9CQUFJLFVBQVUsUUFBUSxjQUFSLENBQXVCLENBQXZCLENBQWQ7QUFDQSx3QkFBUSxDQUFSLEdBQVksQ0FBQyxRQUFRLElBQXJCOztBQUVBLHdCQUFRLENBQVIsR0FBWSxVQUFVLENBQXRCO0FBQ0g7QUFDRCxtQkFDSyxJQURMLENBQ1UsR0FEVixFQUNlLFFBQVEsQ0FEdkIsRUFFSyxJQUZMLENBRVUsR0FGVixFQUVlLFVBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSx1QkFBVyxJQUFJLEtBQUssVUFBVCxHQUFzQixLQUFLLFVBQUwsR0FBa0IsQ0FBekMsR0FBOEMsRUFBRSxLQUFGLENBQVEsUUFBdEQsR0FBaUUsUUFBUSxDQUFuRjtBQUFBLGFBRmYsRUFHSyxJQUhMLENBR1UsSUFIVixFQUdnQixDQUFDLENBSGpCLEVBSUssSUFKTCxDQUlVLGFBSlYsRUFJeUIsS0FKekIsRUFLSyxJQUxMLENBS1UsT0FMVixFQUttQixVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsdUJBQVUsYUFBYSxHQUFiLEdBQW1CLFdBQW5CLEdBQWlDLEdBQWpDLEdBQXVDLFdBQXZDLEdBQXFELEdBQXJELEdBQTJELENBQXJFO0FBQUEsYUFMbkIsRUFPSyxJQVBMLENBT1UsVUFBVSxDQUFWLEVBQWE7QUFDZixvQkFBSSxZQUFZLEtBQUssWUFBTCxDQUFrQixFQUFFLEdBQXBCLENBQWhCO0FBQ0EsdUJBQU8sU0FBUDtBQUNILGFBVkw7O0FBWUEsZ0JBQUksV0FBVyxLQUFLLHVCQUFMLENBQTZCLE9BQTdCLENBQWY7O0FBRUEsbUJBQU8sSUFBUCxDQUFZLFVBQVUsS0FBVixFQUFpQjtBQUN6QixvQkFBSSxPQUFPLEdBQUcsTUFBSCxDQUFVLElBQVYsQ0FBWDtBQUFBLG9CQUNJLE9BQU8sS0FBSyxZQUFMLENBQWtCLE1BQU0sR0FBeEIsQ0FEWDtBQUVBLDZCQUFNLCtCQUFOLENBQXNDLElBQXRDLEVBQTRDLElBQTVDLEVBQWtELFFBQWxELEVBQTRELEtBQUssTUFBTCxDQUFZLFdBQVosR0FBMEIsS0FBSyxJQUFMLENBQVUsT0FBcEMsR0FBOEMsS0FBMUc7QUFDSCxhQUpEOztBQU1BLGdCQUFJLEtBQUssTUFBTCxDQUFZLENBQVosQ0FBYyxZQUFsQixFQUFnQztBQUM1Qix1QkFDSyxJQURMLENBQ1UsV0FEVixFQUN1QixVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsMkJBQVUsaUJBQWtCLFFBQVEsQ0FBMUIsR0FBaUMsSUFBakMsSUFBeUMsRUFBRSxLQUFGLENBQVEsUUFBUixJQUFvQixJQUFJLEtBQUssVUFBVCxHQUFzQixLQUFLLFVBQUwsR0FBa0IsQ0FBNUQsSUFBaUUsUUFBUSxDQUFsSCxJQUF1SCxHQUFqSTtBQUFBLGlCQUR2QixFQUVLLElBRkwsQ0FFVSxhQUZWLEVBRXlCLEtBRnpCOztBQUlILGFBTEQsTUFLTztBQUNILHVCQUFPLElBQVAsQ0FBWSxtQkFBWixFQUFpQyxRQUFqQztBQUNIOztBQUdELG1CQUFPLElBQVAsR0FBYyxNQUFkOztBQUdBLGlCQUFLLElBQUwsQ0FBVSxjQUFWLENBQXlCLE9BQU8sS0FBSyxXQUFMLENBQWlCLFFBQWpCLENBQWhDLEVBQ0ssY0FETCxDQUNvQixVQUFVLEtBQUssV0FBTCxDQUFpQixPQUFqQixDQUQ5QixFQUVLLElBRkwsQ0FFVSxXQUZWLEVBRXVCLGVBQWUsQ0FBQyxLQUFLLE1BQUwsQ0FBWSxJQUE1QixHQUFtQyxHQUFuQyxHQUEwQyxLQUFLLE1BQUwsR0FBYyxDQUF4RCxHQUE2RCxjQUZwRixFQUdLLElBSEwsQ0FHVSxJQUhWLEVBR2dCLEtBSGhCLEVBSUssS0FKTCxDQUlXLGFBSlgsRUFJMEIsUUFKMUIsRUFLSyxJQUxMLENBS1UsS0FBSyxNQUFMLENBQVksQ0FBWixDQUFjLEtBTHhCO0FBT0g7OztvQ0FHVyxXLEVBQWEsUyxFQUFXLGMsRUFBZ0I7O0FBRWhELGdCQUFJLE9BQU8sSUFBWDtBQUNBLGdCQUFJLE9BQU8sS0FBSyxJQUFoQjs7QUFFQSxnQkFBSSxhQUFhLEtBQUssV0FBTCxDQUFpQixPQUFqQixDQUFqQjtBQUNBLGdCQUFJLGNBQWMsYUFBYSxJQUEvQjtBQUNBLGdCQUFJLFNBQVMsVUFBVSxTQUFWLENBQW9CLE9BQU8sVUFBUCxHQUFvQixHQUFwQixHQUEwQixXQUE5QyxFQUNSLElBRFEsQ0FDSCxZQUFZLFlBRFQsQ0FBYjs7QUFHQSxnQkFBSSxvQkFBb0IsQ0FBeEI7QUFDQSxnQkFBSSxpQkFBaUIsQ0FBckI7O0FBRUEsZ0JBQUksZUFBZSxPQUFPLEtBQVAsR0FBZSxNQUFmLENBQXNCLEdBQXRCLENBQW5CO0FBQ0EseUJBQ0ssT0FETCxDQUNhLFVBRGIsRUFDeUIsSUFEekIsRUFFSyxPQUZMLENBRWEsV0FGYixFQUUwQixJQUYxQixFQUdLLE1BSEwsQ0FHWSxNQUhaLEVBR29CLE9BSHBCLENBRzRCLFlBSDVCLEVBRzBDLElBSDFDOztBQUtBLGdCQUFJLGtCQUFrQixhQUFhLGNBQWIsQ0FBNEIsU0FBNUIsQ0FBdEI7QUFDQSw0QkFBZ0IsTUFBaEIsQ0FBdUIsTUFBdkI7QUFDQSw0QkFBZ0IsTUFBaEIsQ0FBdUIsTUFBdkI7O0FBRUEsZ0JBQUksVUFBVSxRQUFRLGNBQVIsQ0FBdUIsWUFBWSxLQUFuQyxDQUFkO0FBQ0EsZ0JBQUksVUFBVSxVQUFVLENBQXhCOztBQUVBLGdCQUFJLGlCQUFpQixRQUFRLG9CQUE3QjtBQUNBLGdCQUFJLFFBQVEsS0FBSyxNQUFMLENBQVksQ0FBWixDQUFjLE1BQWQsQ0FBcUIsSUFBckIsQ0FBMEIsTUFBMUIsR0FBbUMsWUFBWSxLQUEzRDtBQUNBLGdCQUFJLFVBQVU7QUFDVixzQkFBTSxDQURJO0FBRVYsdUJBQU87QUFGRyxhQUFkOztBQUtBLGdCQUFJLENBQUMsY0FBTCxFQUFxQjtBQUNqQix3QkFBUSxLQUFSLEdBQWdCLEtBQUssQ0FBTCxDQUFPLE9BQVAsQ0FBZSxJQUEvQjtBQUNBLHdCQUFRLElBQVIsR0FBZSxLQUFLLENBQUwsQ0FBTyxPQUFQLENBQWUsSUFBOUI7QUFDQSxpQ0FBaUIsS0FBSyxLQUFMLEdBQWEsT0FBYixHQUF1QixRQUFRLElBQS9CLEdBQXNDLFFBQVEsS0FBL0Q7QUFDSDs7QUFHRCxtQkFDSyxJQURMLENBQ1UsV0FEVixFQUN1QixVQUFDLENBQUQsRUFBSSxDQUFKLEVBQVU7QUFDekIsb0JBQUksWUFBWSxnQkFBZ0IsVUFBVSxRQUFRLElBQWxDLElBQTBDLEdBQTFDLElBQWtELEtBQUssVUFBTCxHQUFrQixpQkFBbkIsR0FBd0MsSUFBSSxPQUE1QyxHQUFzRCxjQUF0RCxHQUF1RSxPQUF4SCxJQUFtSSxHQUFuSjtBQUNBLGtDQUFtQixFQUFFLGNBQUYsSUFBb0IsQ0FBdkM7QUFDQSxxQ0FBcUIsRUFBRSxjQUFGLElBQW9CLENBQXpDO0FBQ0EsdUJBQU8sU0FBUDtBQUNILGFBTkw7O0FBU0EsZ0JBQUksYUFBYSxpQkFBaUIsVUFBVSxDQUE1Qzs7QUFFQSxnQkFBSSxjQUFjLE9BQU8sU0FBUCxDQUFpQixTQUFqQixFQUNiLElBRGEsQ0FDUixXQURRLEVBQ0ssVUFBQyxDQUFELEVBQUksQ0FBSjtBQUFBLHVCQUFVLGdCQUFnQixhQUFhLGNBQTdCLElBQStDLE1BQXpEO0FBQUEsYUFETCxDQUFsQjs7QUFHQSxnQkFBSSxZQUFZLFlBQVksU0FBWixDQUFzQixNQUF0QixFQUNYLElBRFcsQ0FDTixPQURNLEVBQ0csY0FESCxFQUVYLElBRlcsQ0FFTixRQUZNLEVBRUksYUFBSTtBQUNoQix1QkFBTyxDQUFDLEVBQUUsY0FBRixJQUFvQixDQUFyQixJQUEwQixLQUFLLFVBQUwsR0FBa0IsRUFBRSxjQUE5QyxHQUErRCxVQUFVLENBQWhGO0FBQ0gsYUFKVyxFQUtYLElBTFcsQ0FLTixHQUxNLEVBS0QsQ0FMQyxFQU1YLElBTlcsQ0FNTixHQU5NLEVBTUQsQ0FOQzs7QUFBQSxhQVFYLElBUlcsQ0FRTixjQVJNLEVBUVUsQ0FSVixDQUFoQjs7QUFVQSxpQkFBSyxzQkFBTCxDQUE0QixXQUE1QixFQUF5QyxTQUF6Qzs7QUFHQSxtQkFBTyxTQUFQLENBQWlCLGlCQUFqQixFQUNLLElBREwsQ0FDVSxPQURWLEVBQ21CO0FBQUEsdUJBQUksMkJBQTJCLEVBQUUsS0FBakM7QUFBQSxhQURuQixFQUVLLElBRkwsQ0FFVSxPQUZWLEVBRW1CLFVBRm5CLEVBR0ssSUFITCxDQUdVLFFBSFYsRUFHb0IsYUFBSTtBQUNoQix1QkFBTyxDQUFDLEVBQUUsY0FBRixJQUFvQixDQUFyQixJQUEwQixLQUFLLFVBQUwsR0FBa0IsRUFBRSxjQUE5QyxHQUErRCxVQUFVLENBQWhGO0FBQ0gsYUFMTCxFQU1LLElBTkwsQ0FNVSxHQU5WLEVBTWUsQ0FOZixFQU9LLElBUEwsQ0FPVSxHQVBWLEVBT2UsQ0FQZixFQVFLLElBUkwsQ0FRVSxNQVJWLEVBUWtCLE9BUmxCLEVBU0ssSUFUTCxDQVNVLGNBVFYsRUFTMEIsQ0FUMUIsRUFVSyxJQVZMLENBVVUsY0FWVixFQVUwQixHQVYxQixFQVdLLElBWEwsQ0FXVSxRQVhWLEVBV29CLE9BWHBCOztBQWNBLG1CQUFPLElBQVAsQ0FBWSxVQUFVLEtBQVYsRUFBaUI7O0FBRXpCLHFCQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsRUFBNEIsS0FBNUIsRUFBbUMsR0FBRyxNQUFILENBQVUsSUFBVixDQUFuQyxFQUFvRCxhQUFhLGNBQWpFO0FBQ0gsYUFIRDtBQUtIOzs7b0NBRVcsVyxFQUFhLFMsRUFBVyxlLEVBQWlCOztBQUVqRCxnQkFBSSxPQUFPLElBQVg7QUFDQSxnQkFBSSxPQUFPLEtBQUssSUFBaEI7O0FBRUEsZ0JBQUksYUFBYSxLQUFLLFdBQUwsQ0FBaUIsT0FBakIsQ0FBakI7QUFDQSxnQkFBSSxjQUFjLGFBQWEsSUFBL0I7QUFDQSxnQkFBSSxTQUFTLFVBQVUsU0FBVixDQUFvQixPQUFPLFVBQVAsR0FBb0IsR0FBcEIsR0FBMEIsV0FBOUMsRUFDUixJQURRLENBQ0gsWUFBWSxZQURULENBQWI7O0FBR0EsZ0JBQUksb0JBQW9CLENBQXhCO0FBQ0EsZ0JBQUksaUJBQWlCLENBQXJCOztBQUVBLGdCQUFJLGVBQWUsT0FBTyxLQUFQLEdBQWUsTUFBZixDQUFzQixHQUF0QixDQUFuQjtBQUNBLHlCQUNLLE9BREwsQ0FDYSxVQURiLEVBQ3lCLElBRHpCLEVBRUssT0FGTCxDQUVhLFdBRmIsRUFFMEIsSUFGMUIsRUFHSyxNQUhMLENBR1ksTUFIWixFQUdvQixPQUhwQixDQUc0QixZQUg1QixFQUcwQyxJQUgxQzs7QUFLQSxnQkFBSSxrQkFBa0IsYUFBYSxjQUFiLENBQTRCLFNBQTVCLENBQXRCO0FBQ0EsNEJBQWdCLE1BQWhCLENBQXVCLE1BQXZCO0FBQ0EsNEJBQWdCLE1BQWhCLENBQXVCLE1BQXZCOztBQUVBLGdCQUFJLFVBQVUsUUFBUSxjQUFSLENBQXVCLFlBQVksS0FBbkMsQ0FBZDtBQUNBLGdCQUFJLFVBQVUsVUFBVSxDQUF4QjtBQUNBLGdCQUFJLGtCQUFrQixRQUFRLG9CQUE5Qjs7QUFFQSxnQkFBSSxRQUFRLEtBQUssTUFBTCxDQUFZLENBQVosQ0FBYyxNQUFkLENBQXFCLElBQXJCLENBQTBCLE1BQTFCLEdBQW1DLFlBQVksS0FBM0Q7O0FBRUEsZ0JBQUksVUFBVTtBQUNWLHFCQUFLLENBREs7QUFFVix3QkFBUTtBQUZFLGFBQWQ7O0FBS0EsZ0JBQUksQ0FBQyxlQUFMLEVBQXNCO0FBQ2xCLHdCQUFRLE1BQVIsR0FBaUIsS0FBSyxDQUFMLENBQU8sT0FBUCxDQUFlLE1BQWhDO0FBQ0Esd0JBQVEsR0FBUixHQUFjLEtBQUssQ0FBTCxDQUFPLE9BQVAsQ0FBZSxHQUE3QjtBQUNBLGtDQUFrQixLQUFLLE1BQUwsR0FBYyxPQUFkLEdBQXdCLFFBQVEsR0FBaEMsR0FBc0MsUUFBUSxNQUFoRTtBQUVILGFBTEQsTUFLTztBQUNILHdCQUFRLEdBQVIsR0FBYyxDQUFDLGVBQWY7QUFDSDs7O0FBR0QsbUJBQ0ssSUFETCxDQUNVLFdBRFYsRUFDdUIsVUFBQyxDQUFELEVBQUksQ0FBSixFQUFVO0FBQ3pCLG9CQUFJLFlBQVksZ0JBQWlCLEtBQUssU0FBTCxHQUFpQixpQkFBbEIsR0FBdUMsSUFBSSxPQUEzQyxHQUFxRCxjQUFyRCxHQUFzRSxPQUF0RixJQUFpRyxJQUFqRyxJQUF5RyxVQUFVLFFBQVEsR0FBM0gsSUFBa0ksR0FBbEo7QUFDQSxrQ0FBbUIsRUFBRSxjQUFGLElBQW9CLENBQXZDO0FBQ0EscUNBQXFCLEVBQUUsY0FBRixJQUFvQixDQUF6QztBQUNBLHVCQUFPLFNBQVA7QUFDSCxhQU5MOztBQVFBLGdCQUFJLGNBQWMsa0JBQWtCLFVBQVUsQ0FBOUM7O0FBRUEsZ0JBQUksY0FBYyxPQUFPLFNBQVAsQ0FBaUIsU0FBakIsRUFDYixJQURhLENBQ1IsV0FEUSxFQUNLLFVBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSx1QkFBVSxrQkFBbUIsQ0FBbkIsR0FBd0IsR0FBbEM7QUFBQSxhQURMLENBQWxCOztBQUlBLGdCQUFJLFlBQVksWUFBWSxTQUFaLENBQXNCLE1BQXRCLEVBQ1gsSUFEVyxDQUNOLFFBRE0sRUFDSSxlQURKLEVBRVgsSUFGVyxDQUVOLE9BRk0sRUFFRyxhQUFJO0FBQ2YsdUJBQU8sQ0FBQyxFQUFFLGNBQUYsSUFBb0IsQ0FBckIsSUFBMEIsS0FBSyxTQUFMLEdBQWlCLEVBQUUsY0FBN0MsR0FBOEQsVUFBVSxDQUEvRTtBQUNILGFBSlcsRUFLWCxJQUxXLENBS04sR0FMTSxFQUtELENBTEMsRUFNWCxJQU5XLENBTU4sR0FOTSxFQU1ELENBTkM7O0FBQUEsYUFRWCxJQVJXLENBUU4sY0FSTSxFQVFVLENBUlYsQ0FBaEI7O0FBVUEsaUJBQUssc0JBQUwsQ0FBNEIsV0FBNUIsRUFBeUMsU0FBekM7O0FBR0EsbUJBQU8sU0FBUCxDQUFpQixpQkFBakIsRUFDSyxJQURMLENBQ1UsT0FEVixFQUNtQjtBQUFBLHVCQUFJLDJCQUEyQixFQUFFLEtBQWpDO0FBQUEsYUFEbkIsRUFFSyxJQUZMLENBRVUsUUFGVixFQUVvQixXQUZwQixFQUdLLElBSEwsQ0FHVSxPQUhWLEVBR21CLGFBQUk7QUFDZix1QkFBTyxDQUFDLEVBQUUsY0FBRixJQUFvQixDQUFyQixJQUEwQixLQUFLLFNBQUwsR0FBaUIsRUFBRSxjQUE3QyxHQUE4RCxVQUFVLENBQS9FO0FBQ0gsYUFMTCxFQU1LLElBTkwsQ0FNVSxHQU5WLEVBTWUsQ0FOZixFQU9LLElBUEwsQ0FPVSxHQVBWLEVBT2UsQ0FQZixFQVFLLElBUkwsQ0FRVSxNQVJWLEVBUWtCLE9BUmxCLEVBU0ssSUFUTCxDQVNVLGNBVFYsRUFTMEIsQ0FUMUIsRUFVSyxJQVZMLENBVVUsY0FWVixFQVUwQixHQVYxQixFQVdLLElBWEwsQ0FXVSxRQVhWLEVBV29CLE9BWHBCOztBQWFBLG1CQUFPLElBQVAsQ0FBWSxVQUFVLEtBQVYsRUFBaUI7QUFDekIscUJBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixFQUE0QixLQUE1QixFQUFtQyxHQUFHLE1BQUgsQ0FBVSxJQUFWLENBQW5DLEVBQW9ELGNBQWMsZUFBbEU7QUFDSCxhQUZEOztBQUlBLG1CQUFPLElBQVAsR0FBYyxNQUFkO0FBRUg7OzsrQ0FFc0IsVyxFQUFhLFMsRUFBVztBQUMzQyxnQkFBSSxPQUFPLEtBQUssSUFBaEI7QUFDQSxnQkFBSSxPQUFPLElBQVg7QUFDQSxnQkFBSSxxQkFBcUIsRUFBekI7QUFDQSwrQkFBbUIsSUFBbkIsQ0FBd0IsVUFBVSxDQUFWLEVBQWE7QUFDakMsbUJBQUcsTUFBSCxDQUFVLElBQVYsRUFBZ0IsT0FBaEIsQ0FBd0IsYUFBeEIsRUFBdUMsSUFBdkM7QUFDQSxtQkFBRyxNQUFILENBQVUsS0FBSyxVQUFMLENBQWdCLFVBQTFCLEVBQXNDLFNBQXRDLENBQWdELHFCQUFxQixFQUFFLEtBQXZFLEVBQThFLE9BQTlFLENBQXNGLGFBQXRGLEVBQXFHLElBQXJHO0FBQ0gsYUFIRDs7QUFLQSxnQkFBSSxvQkFBb0IsRUFBeEI7QUFDQSw4QkFBa0IsSUFBbEIsQ0FBdUIsVUFBVSxDQUFWLEVBQWE7QUFDaEMsbUJBQUcsTUFBSCxDQUFVLElBQVYsRUFBZ0IsT0FBaEIsQ0FBd0IsYUFBeEIsRUFBdUMsS0FBdkM7QUFDQSxtQkFBRyxNQUFILENBQVUsS0FBSyxVQUFMLENBQWdCLFVBQTFCLEVBQXNDLFNBQXRDLENBQWdELHFCQUFxQixFQUFFLEtBQXZFLEVBQThFLE9BQTlFLENBQXNGLGFBQXRGLEVBQXFHLEtBQXJHO0FBQ0gsYUFIRDtBQUlBLGdCQUFJLEtBQUssT0FBVCxFQUFrQjs7QUFFZCxtQ0FBbUIsSUFBbkIsQ0FBd0IsYUFBSTtBQUN4Qix5QkFBSyxPQUFMLENBQWEsVUFBYixHQUNLLFFBREwsQ0FDYyxHQURkLEVBRUssS0FGTCxDQUVXLFNBRlgsRUFFc0IsRUFGdEI7QUFHQSx3QkFBSSxPQUFPLFlBQVksS0FBWixHQUFvQixJQUFwQixHQUEyQixFQUFFLGFBQXhDOztBQUVBLHlCQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLElBQWxCLEVBQ0ssS0FETCxDQUNXLE1BRFgsRUFDb0IsR0FBRyxLQUFILENBQVMsS0FBVCxHQUFpQixDQUFsQixHQUF1QixJQUQxQyxFQUVLLEtBRkwsQ0FFVyxLQUZYLEVBRW1CLEdBQUcsS0FBSCxDQUFTLEtBQVQsR0FBaUIsRUFBbEIsR0FBd0IsSUFGMUM7QUFHSCxpQkFURDs7QUFXQSxrQ0FBa0IsSUFBbEIsQ0FBdUIsYUFBSTtBQUN2Qix5QkFBSyxPQUFMLENBQWEsVUFBYixHQUNLLFFBREwsQ0FDYyxHQURkLEVBRUssS0FGTCxDQUVXLFNBRlgsRUFFc0IsQ0FGdEI7QUFHSCxpQkFKRDtBQU9IO0FBQ0Qsc0JBQVUsRUFBVixDQUFhLFdBQWIsRUFBMEIsVUFBVSxDQUFWLEVBQWE7QUFDbkMsb0JBQUksT0FBTyxJQUFYO0FBQ0EsbUNBQW1CLE9BQW5CLENBQTJCLFVBQVUsUUFBVixFQUFvQjtBQUMzQyw2QkFBUyxJQUFULENBQWMsSUFBZCxFQUFvQixDQUFwQjtBQUNILGlCQUZEO0FBR0gsYUFMRDtBQU1BLHNCQUFVLEVBQVYsQ0FBYSxVQUFiLEVBQXlCLFVBQVUsQ0FBVixFQUFhO0FBQ2xDLG9CQUFJLE9BQU8sSUFBWDtBQUNBLGtDQUFrQixPQUFsQixDQUEwQixVQUFVLFFBQVYsRUFBb0I7QUFDMUMsNkJBQVMsSUFBVCxDQUFjLElBQWQsRUFBb0IsQ0FBcEI7QUFDSCxpQkFGRDtBQUdILGFBTEQ7QUFNSDs7O3NDQUVhOztBQUVWLGdCQUFJLE9BQU8sSUFBWDtBQUNBLGdCQUFJLE9BQU8sS0FBSyxJQUFoQjtBQUNBLGdCQUFJLHFCQUFxQixLQUFLLFdBQUwsQ0FBaUIsT0FBakIsQ0FBekI7QUFDQSxnQkFBSSxVQUFVLFFBQVEsY0FBUixDQUF1QixDQUF2QixDQUFkO0FBQ0EsZ0JBQUksV0FBVyxLQUFLLENBQUwsQ0FBTyxNQUFQLENBQWMsWUFBZCxDQUEyQixNQUEzQixHQUFvQyxVQUFVLENBQTlDLEdBQWtELENBQWpFO0FBQ0EsZ0JBQUksV0FBVyxLQUFLLENBQUwsQ0FBTyxNQUFQLENBQWMsWUFBZCxDQUEyQixNQUEzQixHQUFvQyxVQUFVLENBQTlDLEdBQWtELENBQWpFO0FBQ0EsZ0JBQUksZ0JBQWdCLEtBQUssSUFBTCxDQUFVLGNBQVYsQ0FBeUIsT0FBTyxrQkFBaEMsQ0FBcEI7QUFDQSwwQkFBYyxJQUFkLENBQW1CLFdBQW5CLEVBQWdDLGVBQWUsUUFBZixHQUEwQixJQUExQixHQUFpQyxRQUFqQyxHQUE0QyxHQUE1RTs7QUFFQSxnQkFBSSxZQUFZLEtBQUssV0FBTCxDQUFpQixNQUFqQixDQUFoQjtBQUNBLGdCQUFJLFlBQVksS0FBSyxDQUFMLENBQU8sS0FBUCxDQUFhLElBQTdCOztBQUVBLGdCQUFJLFFBQVEsY0FBYyxTQUFkLENBQXdCLE9BQU8sU0FBL0IsRUFDUCxJQURPLENBQ0YsS0FBSyxJQUFMLENBQVUsS0FEUixDQUFaOztBQUdBLGdCQUFJLGFBQWEsTUFBTSxLQUFOLEdBQWMsTUFBZCxDQUFxQixHQUFyQixFQUNaLE9BRFksQ0FDSixTQURJLEVBQ08sSUFEUCxDQUFqQjtBQUVBLGtCQUFNLElBQU4sQ0FBVyxXQUFYLEVBQXdCO0FBQUEsdUJBQUksZ0JBQWlCLEtBQUssU0FBTCxHQUFpQixFQUFFLEdBQW5CLEdBQXlCLEtBQUssU0FBTCxHQUFpQixDQUEzQyxHQUFnRCxFQUFFLE1BQUYsQ0FBUyxLQUFULENBQWUsUUFBL0UsSUFBMkYsR0FBM0YsSUFBbUcsS0FBSyxVQUFMLEdBQWtCLEVBQUUsR0FBcEIsR0FBMEIsS0FBSyxVQUFMLEdBQWtCLENBQTdDLEdBQWtELEVBQUUsTUFBRixDQUFTLEtBQVQsQ0FBZSxRQUFuSyxJQUErSyxHQUFuTDtBQUFBLGFBQXhCOztBQUVBLGdCQUFJLFNBQVMsTUFBTSxjQUFOLENBQXFCLFlBQVksY0FBWixHQUE2QixTQUFsRCxDQUFiOztBQUVBLG1CQUNLLElBREwsQ0FDVSxPQURWLEVBQ21CLEtBQUssQ0FBTCxDQUFPLEtBQVAsQ0FBYSxLQURoQyxFQUVLLElBRkwsQ0FFVSxRQUZWLEVBRW9CLEtBQUssQ0FBTCxDQUFPLEtBQVAsQ0FBYSxNQUZqQyxFQUdLLElBSEwsQ0FHVSxHQUhWLEVBR2UsQ0FBQyxLQUFLLFNBQU4sR0FBa0IsQ0FIakMsRUFJSyxJQUpMLENBSVUsR0FKVixFQUllLENBQUMsS0FBSyxVQUFOLEdBQW1CLENBSmxDOztBQU1BLG1CQUFPLEtBQVAsQ0FBYSxNQUFiLEVBQXFCO0FBQUEsdUJBQUksRUFBRSxLQUFGLEtBQVksU0FBWixHQUF3QixLQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLFdBQTFDLEdBQXdELEtBQUssQ0FBTCxDQUFPLEtBQVAsQ0FBYSxLQUFiLENBQW1CLEVBQUUsS0FBckIsQ0FBNUQ7QUFBQSxhQUFyQjtBQUNBLG1CQUFPLElBQVAsQ0FBWSxjQUFaLEVBQTRCO0FBQUEsdUJBQUksRUFBRSxLQUFGLEtBQVksU0FBWixHQUF3QixDQUF4QixHQUE0QixDQUFoQztBQUFBLGFBQTVCOztBQUVBLGdCQUFJLHFCQUFxQixFQUF6QjtBQUNBLGdCQUFJLG9CQUFvQixFQUF4Qjs7QUFFQSxnQkFBSSxLQUFLLE9BQVQsRUFBa0I7O0FBRWQsbUNBQW1CLElBQW5CLENBQXdCLGFBQUk7QUFDeEIseUJBQUssT0FBTCxDQUFhLFVBQWIsR0FDSyxRQURMLENBQ2MsR0FEZCxFQUVLLEtBRkwsQ0FFVyxTQUZYLEVBRXNCLEVBRnRCO0FBR0Esd0JBQUksT0FBTyxFQUFFLEtBQUYsS0FBWSxTQUFaLEdBQXdCLEtBQUssTUFBTCxDQUFZLE9BQVosQ0FBb0IsVUFBNUMsR0FBeUQsS0FBSyxZQUFMLENBQWtCLEVBQUUsS0FBcEIsQ0FBcEU7O0FBRUEseUJBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsSUFBbEIsRUFDSyxLQURMLENBQ1csTUFEWCxFQUNvQixHQUFHLEtBQUgsQ0FBUyxLQUFULEdBQWlCLENBQWxCLEdBQXVCLElBRDFDLEVBRUssS0FGTCxDQUVXLEtBRlgsRUFFbUIsR0FBRyxLQUFILENBQVMsS0FBVCxHQUFpQixFQUFsQixHQUF3QixJQUYxQztBQUdILGlCQVREOztBQVdBLGtDQUFrQixJQUFsQixDQUF1QixhQUFJO0FBQ3ZCLHlCQUFLLE9BQUwsQ0FBYSxVQUFiLEdBQ0ssUUFETCxDQUNjLEdBRGQsRUFFSyxLQUZMLENBRVcsU0FGWCxFQUVzQixDQUZ0QjtBQUdILGlCQUpEO0FBT0g7O0FBRUQsZ0JBQUksS0FBSyxNQUFMLENBQVksZUFBaEIsRUFBaUM7QUFDN0Isb0JBQUksaUJBQWlCLEtBQUssTUFBTCxDQUFZLGNBQVosR0FBNkIsV0FBbEQ7QUFDQSxvQkFBSSxjQUFjLFNBQWQsV0FBYztBQUFBLDJCQUFHLEtBQUssVUFBTCxHQUFrQixLQUFsQixHQUEwQixFQUFFLEdBQS9CO0FBQUEsaUJBQWxCO0FBQ0Esb0JBQUksY0FBYyxTQUFkLFdBQWM7QUFBQSwyQkFBRyxLQUFLLFVBQUwsR0FBa0IsS0FBbEIsR0FBMEIsRUFBRSxHQUEvQjtBQUFBLGlCQUFsQjs7QUFHQSxtQ0FBbUIsSUFBbkIsQ0FBd0IsYUFBSTs7QUFFeEIseUJBQUssSUFBTCxDQUFVLFNBQVYsQ0FBb0IsVUFBVSxZQUFZLENBQVosQ0FBOUIsRUFBOEMsT0FBOUMsQ0FBc0QsY0FBdEQsRUFBc0UsSUFBdEU7QUFDQSx5QkFBSyxJQUFMLENBQVUsU0FBVixDQUFvQixVQUFVLFlBQVksQ0FBWixDQUE5QixFQUE4QyxPQUE5QyxDQUFzRCxjQUF0RCxFQUFzRSxJQUF0RTtBQUNILGlCQUpEO0FBS0Esa0NBQWtCLElBQWxCLENBQXVCLGFBQUk7QUFDdkIseUJBQUssSUFBTCxDQUFVLFNBQVYsQ0FBb0IsVUFBVSxZQUFZLENBQVosQ0FBOUIsRUFBOEMsT0FBOUMsQ0FBc0QsY0FBdEQsRUFBc0UsS0FBdEU7QUFDQSx5QkFBSyxJQUFMLENBQVUsU0FBVixDQUFvQixVQUFVLFlBQVksQ0FBWixDQUE5QixFQUE4QyxPQUE5QyxDQUFzRCxjQUF0RCxFQUFzRSxLQUF0RTtBQUNILGlCQUhEO0FBSUg7O0FBR0Qsa0JBQU0sRUFBTixDQUFTLFdBQVQsRUFBc0IsYUFBSztBQUN2QixtQ0FBbUIsT0FBbkIsQ0FBMkI7QUFBQSwyQkFBVSxTQUFTLENBQVQsQ0FBVjtBQUFBLGlCQUEzQjtBQUNILGFBRkQsRUFHSyxFQUhMLENBR1EsVUFIUixFQUdvQixhQUFLO0FBQ2pCLGtDQUFrQixPQUFsQixDQUEwQjtBQUFBLDJCQUFVLFNBQVMsQ0FBVCxDQUFWO0FBQUEsaUJBQTFCO0FBQ0gsYUFMTDs7QUFPQSxrQkFBTSxFQUFOLENBQVMsT0FBVCxFQUFrQixhQUFJO0FBQ2xCLHFCQUFLLE9BQUwsQ0FBYSxlQUFiLEVBQThCLENBQTlCO0FBQ0gsYUFGRDs7QUFLQSxrQkFBTSxJQUFOLEdBQWEsTUFBYjtBQUNIOzs7cUNBRVksSyxFQUFPO0FBQ2hCLGdCQUFJLENBQUMsS0FBSyxNQUFMLENBQVksQ0FBWixDQUFjLFNBQW5CLEVBQThCLE9BQU8sS0FBUDs7QUFFOUIsbUJBQU8sS0FBSyxNQUFMLENBQVksQ0FBWixDQUFjLFNBQWQsQ0FBd0IsSUFBeEIsQ0FBNkIsS0FBSyxNQUFsQyxFQUEwQyxLQUExQyxDQUFQO0FBQ0g7OztxQ0FFWSxLLEVBQU87QUFDaEIsZ0JBQUksQ0FBQyxLQUFLLE1BQUwsQ0FBWSxDQUFaLENBQWMsU0FBbkIsRUFBOEIsT0FBTyxLQUFQOztBQUU5QixtQkFBTyxLQUFLLE1BQUwsQ0FBWSxDQUFaLENBQWMsU0FBZCxDQUF3QixJQUF4QixDQUE2QixLQUFLLE1BQWxDLEVBQTBDLEtBQTFDLENBQVA7QUFDSDs7O3FDQUVZLEssRUFBTztBQUNoQixnQkFBSSxDQUFDLEtBQUssTUFBTCxDQUFZLENBQVosQ0FBYyxTQUFuQixFQUE4QixPQUFPLEtBQVA7O0FBRTlCLG1CQUFPLEtBQUssTUFBTCxDQUFZLENBQVosQ0FBYyxTQUFkLENBQXdCLElBQXhCLENBQTZCLEtBQUssTUFBbEMsRUFBMEMsS0FBMUMsQ0FBUDtBQUNIOzs7MENBRWlCLEssRUFBTztBQUNyQixnQkFBSSxDQUFDLEtBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsU0FBeEIsRUFBbUMsT0FBTyxLQUFQOztBQUVuQyxtQkFBTyxLQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLFNBQW5CLENBQTZCLElBQTdCLENBQWtDLEtBQUssTUFBdkMsRUFBK0MsS0FBL0MsQ0FBUDtBQUNIOzs7dUNBRWM7QUFDWCxnQkFBSSxPQUFPLElBQVg7QUFDQSxnQkFBSSxPQUFPLEtBQUssSUFBaEI7QUFDQSxnQkFBSSxVQUFVLEtBQUssSUFBTCxDQUFVLEtBQVYsR0FBa0IsRUFBaEM7QUFDQSxnQkFBSSxVQUFVLFFBQVEsY0FBUixDQUF1QixDQUF2QixDQUFkO0FBQ0EsZ0JBQUksS0FBSyxJQUFMLENBQVUsUUFBZCxFQUF3QjtBQUNwQiwyQkFBVyxVQUFVLENBQVYsR0FBYyxLQUFLLENBQUwsQ0FBTyxPQUFQLENBQWUsS0FBeEM7QUFDSCxhQUZELE1BRU8sSUFBSSxLQUFLLElBQUwsQ0FBVSxRQUFkLEVBQXdCO0FBQzNCLDJCQUFXLE9BQVg7QUFDSDtBQUNELGdCQUFJLFVBQVUsQ0FBZDtBQUNBLGdCQUFJLEtBQUssSUFBTCxDQUFVLFFBQVYsSUFBc0IsS0FBSyxJQUFMLENBQVUsUUFBcEMsRUFBOEM7QUFDMUMsMkJBQVcsVUFBVSxDQUFyQjtBQUNIOztBQUVELGdCQUFJLFdBQVcsRUFBZjtBQUNBLGdCQUFJLFlBQVksS0FBSyxJQUFMLENBQVUsTUFBVixHQUFtQixDQUFuQztBQUNBLGdCQUFJLFFBQVEsS0FBSyxDQUFMLENBQU8sS0FBUCxDQUFhLEtBQXpCOztBQUVBLGlCQUFLLE1BQUwsR0FBYyxtQkFBVyxLQUFLLEdBQWhCLEVBQXFCLEtBQUssSUFBMUIsRUFBZ0MsS0FBaEMsRUFBdUMsT0FBdkMsRUFBZ0QsT0FBaEQsRUFBeUQ7QUFBQSx1QkFBSyxLQUFLLGlCQUFMLENBQXVCLENBQXZCLENBQUw7QUFBQSxhQUF6RCxFQUF5RixlQUF6RixDQUF5RyxLQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLFlBQTVILEVBQTBJLGlCQUExSSxDQUE0SixRQUE1SixFQUFzSyxTQUF0SyxDQUFkO0FBQ0g7Ozt1Q0F0b0JxQixRLEVBQVU7QUFDNUIsbUJBQU8sUUFBUSxlQUFSLElBQTJCLFdBQVcsQ0FBdEMsQ0FBUDtBQUNIOzs7d0NBRXNCLEksRUFBTTtBQUN6QixnQkFBSSxXQUFXLENBQWY7QUFDQSxpQkFBSyxPQUFMLENBQWEsVUFBQyxVQUFELEVBQWEsU0FBYjtBQUFBLHVCQUEwQixZQUFZLGFBQWEsUUFBUSxjQUFSLENBQXVCLFNBQXZCLENBQW5EO0FBQUEsYUFBYjtBQUNBLG1CQUFPLFFBQVA7QUFDSDs7Ozs7O0FBdFhRLE8sQ0FFRixlLEdBQWtCLEU7QUFGaEIsTyxDQUdGLG9CLEdBQXVCLEM7Ozs7Ozs7Ozs7Ozs7O0FDbEdsQzs7QUFDQTs7QUFDQTs7Ozs7Ozs7SUFFYSxlLFdBQUEsZTs7Ozs7QUFnQ1QsNkJBQVksTUFBWixFQUFtQjtBQUFBOztBQUFBOztBQUFBLGNBOUJuQixRQThCbUIsR0E5QlQsTUFBSyxjQUFMLEdBQW9CLFdBOEJYO0FBQUEsY0E3Qm5CLFVBNkJtQixHQTdCUixJQTZCUTtBQUFBLGNBNUJuQixXQTRCbUIsR0E1Qk4sSUE0Qk07QUFBQSxjQTNCbkIsTUEyQm1CLEdBM0JaO0FBQ0gsbUJBQU8sRUFESjtBQUVILG9CQUFRLEVBRkw7QUFHSCx3QkFBWTtBQUhULFNBMkJZO0FBQUEsY0F0Qm5CLENBc0JtQixHQXRCakIsRTtBQUNFLG1CQUFPLEVBRFQsRTtBQUVFLGlCQUFLLENBRlA7QUFHRSxtQkFBTyxlQUFDLENBQUQsRUFBSSxHQUFKO0FBQUEsdUJBQVksYUFBTSxRQUFOLENBQWUsQ0FBZixJQUFvQixDQUFwQixHQUF3QixFQUFFLEdBQUYsQ0FBcEM7QUFBQSxhQUhULEU7QUFJRSxtQkFBTyxRQUpUO0FBS0UsbUJBQU87QUFMVCxTQXNCaUI7QUFBQSxjQWZuQixDQWVtQixHQWZqQixFO0FBQ0UsbUJBQU8sRUFEVCxFO0FBRUUsb0JBQVEsTUFGVjtBQUdFLG1CQUFPO0FBSFQsU0FlaUI7QUFBQSxjQVZuQixTQVVtQixHQVZULElBVVM7QUFBQSxjQVRuQixNQVNtQixHQVRaO0FBQ0gsaUJBQUssQ0FERjtBQUVILG1CQUFPLGVBQUMsQ0FBRDtBQUFBLHVCQUFPLEVBQUUsTUFBSyxNQUFMLENBQVksR0FBZCxDQUFQO0FBQUEsYUFGSixFO0FBR0gsbUJBQU87QUFISixTQVNZO0FBQUEsY0FKbkIsS0FJbUIsR0FKWCxTQUlXO0FBQUEsY0FIbkIsZUFHbUIsR0FIRixZQUdFO0FBQUEsY0FGbkIsVUFFbUIsR0FGUCxJQUVPOztBQUVmLFlBQUksY0FBSjs7QUFFQSxZQUFHLE1BQUgsRUFBVTtBQUNOLHlCQUFNLFVBQU4sUUFBdUIsTUFBdkI7QUFDSDs7QUFOYztBQVFsQjs7Ozs7SUFHUSxTLFdBQUEsUzs7O0FBQ1QsdUJBQVksbUJBQVosRUFBaUMsSUFBakMsRUFBdUMsTUFBdkMsRUFBK0M7QUFBQTs7QUFBQSw0RkFDckMsbUJBRHFDLEVBQ2hCLElBRGdCLEVBQ1YsSUFBSSxlQUFKLENBQW9CLE1BQXBCLENBRFU7QUFFOUM7Ozs7a0NBRVMsTSxFQUFPO0FBQ2Isa0dBQXVCLElBQUksZUFBSixDQUFvQixNQUFwQixDQUF2QjtBQUNIOzs7bUNBRVM7QUFDTjtBQUNBLGdCQUFJLE9BQUssSUFBVDs7QUFFQSxnQkFBSSxPQUFPLEtBQUssTUFBaEI7O0FBRUEsaUJBQUssSUFBTCxDQUFVLENBQVYsR0FBWSxFQUFaO0FBQ0EsaUJBQUssSUFBTCxDQUFVLENBQVYsR0FBWSxFQUFaO0FBQ0EsaUJBQUssSUFBTCxDQUFVLEdBQVYsR0FBYztBQUNWLHVCQUFPLEk7QUFERyxhQUFkOztBQUlBLGlCQUFLLElBQUwsQ0FBVSxVQUFWLEdBQXVCLEtBQUssVUFBNUI7QUFDQSxnQkFBRyxLQUFLLElBQUwsQ0FBVSxVQUFiLEVBQXdCO0FBQ3BCLHFCQUFLLElBQUwsQ0FBVSxNQUFWLENBQWlCLEtBQWpCLEdBQXlCLEtBQUssTUFBTCxDQUFZLEtBQVosR0FBb0IsS0FBSyxNQUFMLENBQVksS0FBaEMsR0FBc0MsS0FBSyxNQUFMLENBQVksTUFBWixHQUFtQixDQUFsRjtBQUNIOztBQUdELGlCQUFLLGVBQUw7O0FBR0EsaUJBQUssTUFBTDtBQUNBLGlCQUFLLGNBQUw7QUFDQSxpQkFBSyxnQkFBTDtBQUNBLGlCQUFLLE1BQUw7O0FBRUEsZ0JBQUcsS0FBSyxlQUFSLEVBQXdCO0FBQ3BCLHFCQUFLLElBQUwsQ0FBVSxhQUFWLEdBQTBCLEdBQUcsS0FBSCxDQUFTLEtBQUssZUFBZCxHQUExQjtBQUNIO0FBQ0QsZ0JBQUksYUFBYSxLQUFLLEtBQXRCO0FBQ0EsZ0JBQUksY0FBYyxPQUFPLFVBQVAsS0FBc0IsUUFBcEMsSUFBZ0Qsc0JBQXNCLE1BQTFFLEVBQWlGO0FBQzdFLHFCQUFLLElBQUwsQ0FBVSxLQUFWLEdBQWtCLFVBQWxCO0FBQ0gsYUFGRCxNQUVNLElBQUcsS0FBSyxJQUFMLENBQVUsYUFBYixFQUEyQjtBQUM3QixxQkFBSyxJQUFMLENBQVUsS0FBVixHQUFrQjtBQUFBLDJCQUFNLEtBQUssSUFBTCxDQUFVLGFBQVYsQ0FBd0IsRUFBRSxHQUExQixDQUFOO0FBQUEsaUJBQWxCO0FBQ0g7O0FBRUQsbUJBQU8sSUFBUDtBQUNIOzs7aUNBRU87O0FBRUosZ0JBQUksT0FBTyxLQUFLLElBQWhCO0FBQ0EsZ0JBQUksSUFBSSxLQUFLLENBQWI7QUFDQSxnQkFBSSxPQUFPLEtBQUssTUFBTCxDQUFZLENBQXZCOzs7Ozs7OztBQVFBLGNBQUUsS0FBRixHQUFVO0FBQUEsdUJBQUssS0FBSyxLQUFMLENBQVcsQ0FBWCxFQUFjLEtBQUssR0FBbkIsQ0FBTDtBQUFBLGFBQVY7QUFDQSxjQUFFLEtBQUYsR0FBVSxHQUFHLEtBQUgsQ0FBUyxLQUFLLEtBQWQsSUFBdUIsS0FBdkIsQ0FBNkIsQ0FBQyxDQUFELEVBQUksS0FBSyxLQUFULENBQTdCLENBQVY7QUFDQSxjQUFFLEdBQUYsR0FBUTtBQUFBLHVCQUFLLEVBQUUsS0FBRixDQUFRLEVBQUUsS0FBRixDQUFRLENBQVIsQ0FBUixDQUFMO0FBQUEsYUFBUjs7QUFFQSxjQUFFLElBQUYsR0FBUyxHQUFHLEdBQUgsQ0FBTyxJQUFQLEdBQWMsS0FBZCxDQUFvQixFQUFFLEtBQXRCLEVBQTZCLE1BQTdCLENBQW9DLEtBQUssTUFBekMsQ0FBVDtBQUNBLGdCQUFHLEtBQUssS0FBUixFQUFjO0FBQ1Ysa0JBQUUsSUFBRixDQUFPLEtBQVAsQ0FBYSxLQUFLLEtBQWxCO0FBQ0g7QUFDRCxnQkFBSSxPQUFPLEtBQUssSUFBaEI7QUFDQSxpQkFBSyxDQUFMLENBQU8sS0FBUCxDQUFhLE1BQWIsQ0FBb0IsQ0FBQyxHQUFHLEdBQUgsQ0FBTyxJQUFQLEVBQWEsS0FBSyxDQUFMLENBQU8sS0FBcEIsQ0FBRCxFQUE2QixHQUFHLEdBQUgsQ0FBTyxJQUFQLEVBQWEsS0FBSyxDQUFMLENBQU8sS0FBcEIsQ0FBN0IsQ0FBcEI7QUFFSDs7O2lDQUVROztBQUVMLGdCQUFJLE9BQU8sS0FBSyxJQUFoQjtBQUNBLGdCQUFJLElBQUksS0FBSyxDQUFiO0FBQ0EsZ0JBQUksT0FBTyxLQUFLLE1BQUwsQ0FBWSxDQUF2QjtBQUNBLGNBQUUsS0FBRixHQUFVLEdBQUcsS0FBSCxDQUFTLEtBQUssS0FBZCxJQUF1QixLQUF2QixDQUE2QixDQUFDLEtBQUssTUFBTixFQUFjLENBQWQsQ0FBN0IsQ0FBVjs7QUFFQSxjQUFFLElBQUYsR0FBUyxHQUFHLEdBQUgsQ0FBTyxJQUFQLEdBQWMsS0FBZCxDQUFvQixFQUFFLEtBQXRCLEVBQTZCLE1BQTdCLENBQW9DLEtBQUssTUFBekMsQ0FBVDs7QUFFQSxnQkFBSSxPQUFPLEtBQUssSUFBaEI7QUFDQSxpQkFBSyxDQUFMLENBQU8sS0FBUCxDQUFhLE1BQWIsQ0FBb0IsQ0FBQyxDQUFELEVBQUksR0FBRyxHQUFILENBQU8sS0FBSyxhQUFaLEVBQTJCO0FBQUEsdUJBQUcsRUFBRSxDQUFMO0FBQUEsYUFBM0IsQ0FBSixDQUFwQjtBQUNIOzs7eUNBRWdCO0FBQ2IsZ0JBQUksT0FBTyxLQUFLLElBQWhCO0FBQ0EsZ0JBQUksSUFBSSxLQUFLLENBQWI7QUFDQSxnQkFBSSxJQUFJLEtBQUssQ0FBYjtBQUNBLGdCQUFJLFFBQVEsS0FBSyxNQUFMLENBQVksQ0FBWixDQUFjLEtBQWQsR0FBc0IsRUFBRSxLQUFGLENBQVEsS0FBUixDQUFjLEtBQUssTUFBTCxDQUFZLENBQVosQ0FBYyxLQUE1QixDQUF0QixHQUEyRCxFQUFFLEtBQUYsQ0FBUSxLQUFSLEVBQXZFOztBQUVBLGlCQUFLLFNBQUwsR0FBaUIsR0FBRyxNQUFILENBQVUsU0FBVixHQUFzQixTQUF0QixDQUFnQyxLQUFLLE1BQUwsQ0FBWSxTQUE1QyxFQUNaLEtBRFksQ0FDTixFQUFFLEtBREksRUFFWixJQUZZLENBRVAsS0FGTyxDQUFqQjtBQUdBLGlCQUFLLGFBQUwsR0FBcUIsS0FBSyxTQUFMLENBQWUsS0FBSyxJQUFwQixDQUFyQjtBQUVIOzs7MkNBRWtCO0FBQUE7O0FBQ2YsZ0JBQUksT0FBSyxJQUFUO0FBQ0EsaUJBQUssSUFBTCxDQUFVLGVBQVYsR0FBNEIsS0FBSyxNQUFMLENBQVksTUFBWixJQUFzQixLQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLEtBQXJFOztBQUVBLGlCQUFLLElBQUwsQ0FBVSxLQUFWLEdBQWtCLEdBQUcsTUFBSCxDQUFVLEtBQVYsR0FBa0IsTUFBbEIsQ0FBeUI7QUFBQSx1QkFBRyxFQUFFLGFBQUw7QUFBQSxhQUF6QixDQUFsQjtBQUNBLGlCQUFLLElBQUwsQ0FBVSxXQUFWLEdBQXlCLEdBQUcsSUFBSCxHQUFVLEdBQVYsQ0FBYztBQUFBLHVCQUFLLE9BQUssSUFBTCxDQUFVLGVBQVYsR0FBNEIsT0FBSyxNQUFMLENBQVksTUFBWixDQUFtQixLQUFuQixDQUF5QixJQUF6QixDQUE4QixPQUFLLE1BQW5DLEVBQTJDLENBQTNDLENBQTVCLEdBQTRFLE1BQWpGO0FBQUEsYUFBZCxFQUF3RyxPQUF4RyxDQUFnSCxLQUFLLElBQXJILENBQXpCO0FBQ0EsaUJBQUssSUFBTCxDQUFVLFdBQVYsQ0FBc0IsT0FBdEIsQ0FBOEIsYUFBRztBQUM3QixrQkFBRSxhQUFGLEdBQWtCLE9BQUssSUFBTCxDQUFVLFNBQVYsQ0FBb0IsU0FBcEIsQ0FBOEIsT0FBSyxNQUFMLENBQVksU0FBWixJQUF5QixPQUFLLElBQUwsQ0FBVSxlQUFqRSxFQUFrRixFQUFFLE1BQXBGLENBQWxCO0FBQ0Esb0JBQUcsQ0FBQyxPQUFLLE1BQUwsQ0FBWSxTQUFiLElBQTBCLE9BQUssSUFBTCxDQUFVLGVBQXZDLEVBQXVEO0FBQ25ELHNCQUFFLGFBQUYsQ0FBZ0IsT0FBaEIsQ0FBd0IsYUFBSztBQUN6QiwwQkFBRSxFQUFGLEdBQU8sRUFBRSxFQUFGLEdBQUssT0FBSyxJQUFMLENBQVUsTUFBdEI7QUFDQSwwQkFBRSxDQUFGLEdBQU0sRUFBRSxDQUFGLEdBQUksT0FBSyxJQUFMLENBQVUsTUFBcEI7QUFDSCxxQkFIRDtBQUlIO0FBQ0osYUFSRDtBQVNBLGlCQUFLLElBQUwsQ0FBVSxpQkFBVixHQUE4QixLQUFLLElBQUwsQ0FBVSxLQUFWLENBQWdCLEtBQUssSUFBTCxDQUFVLFdBQTFCLENBQTlCO0FBQ0g7OztvQ0FFVTtBQUNQLGdCQUFJLE9BQU8sSUFBWDtBQUNBLGdCQUFJLE9BQU8sS0FBSyxJQUFoQjtBQUNBLGdCQUFJLFdBQVcsS0FBSyxNQUFMLENBQVksQ0FBM0I7QUFDQSxnQkFBSSxPQUFPLEtBQUssSUFBTCxDQUFVLGNBQVYsQ0FBeUIsT0FBSyxLQUFLLFdBQUwsQ0FBaUIsUUFBakIsQ0FBTCxHQUFnQyxHQUFoQyxHQUFvQyxLQUFLLFdBQUwsQ0FBaUIsTUFBakIsQ0FBcEMsSUFBOEQsS0FBSyxNQUFMLENBQVksTUFBWixHQUFxQixFQUFyQixHQUEwQixNQUFJLEtBQUssV0FBTCxDQUFpQixXQUFqQixDQUE1RixDQUF6QixFQUNOLElBRE0sQ0FDRCxXQURDLEVBQ1ksaUJBQWlCLEtBQUssTUFBdEIsR0FBK0IsR0FEM0MsQ0FBWDs7QUFHQSxnQkFBSSxRQUFRLElBQVo7QUFDQSxnQkFBSSxLQUFLLE1BQUwsQ0FBWSxVQUFoQixFQUE0QjtBQUN4Qix3QkFBUSxLQUFLLFVBQUwsR0FBa0IsSUFBbEIsQ0FBdUIsWUFBdkIsQ0FBUjtBQUNIOztBQUVELGtCQUFNLElBQU4sQ0FBVyxLQUFLLENBQUwsQ0FBTyxJQUFsQjs7QUFFQSxpQkFBSyxjQUFMLENBQW9CLFVBQVEsS0FBSyxXQUFMLENBQWlCLE9BQWpCLENBQTVCLEVBQ0ssSUFETCxDQUNVLFdBRFYsRUFDdUIsZUFBZSxLQUFLLEtBQUwsR0FBVyxDQUExQixHQUE4QixHQUE5QixHQUFvQyxLQUFLLE1BQUwsQ0FBWSxNQUFoRCxHQUF5RCxHQURoRixDO0FBQUEsYUFFSyxJQUZMLENBRVUsSUFGVixFQUVnQixNQUZoQixFQUdLLEtBSEwsQ0FHVyxhQUhYLEVBRzBCLFFBSDFCLEVBSUssSUFKTCxDQUlVLFNBQVMsS0FKbkI7QUFLSDs7O29DQUVVO0FBQ1AsZ0JBQUksT0FBTyxJQUFYO0FBQ0EsZ0JBQUksT0FBTyxLQUFLLElBQWhCO0FBQ0EsZ0JBQUksV0FBVyxLQUFLLE1BQUwsQ0FBWSxDQUEzQjtBQUNBLGdCQUFJLE9BQU8sS0FBSyxJQUFMLENBQVUsY0FBVixDQUF5QixPQUFLLEtBQUssV0FBTCxDQUFpQixRQUFqQixDQUFMLEdBQWdDLEdBQWhDLEdBQW9DLEtBQUssV0FBTCxDQUFpQixNQUFqQixDQUFwQyxJQUE4RCxLQUFLLE1BQUwsQ0FBWSxNQUFaLEdBQXFCLEVBQXJCLEdBQTBCLE1BQUksS0FBSyxXQUFMLENBQWlCLFdBQWpCLENBQTVGLENBQXpCLENBQVg7O0FBRUEsZ0JBQUksUUFBUSxJQUFaO0FBQ0EsZ0JBQUksS0FBSyxNQUFMLENBQVksVUFBaEIsRUFBNEI7QUFDeEIsd0JBQVEsS0FBSyxVQUFMLEdBQWtCLElBQWxCLENBQXVCLFlBQXZCLENBQVI7QUFDSDs7QUFFRCxrQkFBTSxJQUFOLENBQVcsS0FBSyxDQUFMLENBQU8sSUFBbEI7O0FBRUEsaUJBQUssY0FBTCxDQUFvQixVQUFRLEtBQUssV0FBTCxDQUFpQixPQUFqQixDQUE1QixFQUNLLElBREwsQ0FDVSxXQURWLEVBQ3VCLGVBQWMsQ0FBQyxLQUFLLE1BQUwsQ0FBWSxJQUEzQixHQUFpQyxHQUFqQyxHQUFzQyxLQUFLLE1BQUwsR0FBWSxDQUFsRCxHQUFxRCxjQUQ1RSxDO0FBQUEsYUFFSyxJQUZMLENBRVUsSUFGVixFQUVnQixLQUZoQixFQUdLLEtBSEwsQ0FHVyxhQUhYLEVBRzBCLFFBSDFCLEVBSUssSUFKTCxDQUlVLFNBQVMsS0FKbkI7QUFLSDs7O3dDQUdlO0FBQ1osZ0JBQUksT0FBTyxJQUFYO0FBQ0EsZ0JBQUksT0FBTyxLQUFLLElBQWhCOztBQUVBLGdCQUFJLGFBQWEsS0FBSyxXQUFMLENBQWlCLE9BQWpCLENBQWpCOztBQUVBLGdCQUFJLFdBQVcsS0FBSyxXQUFMLENBQWlCLEtBQWpCLENBQWY7QUFDQSxnQkFBSSxRQUFRLEtBQUssSUFBTCxDQUFVLFNBQVYsQ0FBb0IsTUFBSSxVQUF4QixFQUNQLElBRE8sQ0FDRixLQUFLLGlCQURILENBQVo7O0FBR0Esa0JBQU0sS0FBTixHQUFjLE1BQWQsQ0FBcUIsR0FBckIsRUFDSyxJQURMLENBQ1UsT0FEVixFQUNtQixVQURuQjs7QUFHQSxnQkFBSSxNQUFNLE1BQU0sU0FBTixDQUFnQixNQUFJLFFBQXBCLEVBQ0wsSUFESyxDQUNBO0FBQUEsdUJBQUssRUFBRSxhQUFQO0FBQUEsYUFEQSxDQUFWOztBQUdBLGdCQUFJLEtBQUosR0FBWSxNQUFaLENBQW1CLEdBQW5CLEVBQ0ssSUFETCxDQUNVLE9BRFYsRUFDbUIsUUFEbkIsRUFFSyxNQUZMLENBRVksTUFGWixFQUdLLElBSEwsQ0FHVSxHQUhWLEVBR2UsQ0FIZjs7QUFNQSxnQkFBSSxVQUFVLElBQUksTUFBSixDQUFXLE1BQVgsQ0FBZDs7QUFFQSxnQkFBSSxXQUFXLE9BQWY7QUFDQSxnQkFBSSxPQUFPLEdBQVg7QUFDQSxnQkFBSSxTQUFTLEtBQWI7QUFDQSxnQkFBSSxLQUFLLGlCQUFMLEVBQUosRUFBOEI7QUFDMUIsMkJBQVcsUUFBUSxVQUFSLEVBQVg7QUFDQSx1QkFBTyxJQUFJLFVBQUosRUFBUDtBQUNBLHlCQUFRLE1BQU0sVUFBTixFQUFSO0FBQ0g7O0FBRUQsaUJBQUssSUFBTCxDQUFVLFdBQVYsRUFBdUIsVUFBUyxDQUFULEVBQVk7QUFBRSx1QkFBTyxlQUFlLEtBQUssQ0FBTCxDQUFPLEtBQVAsQ0FBYSxFQUFFLENBQWYsQ0FBZixHQUFtQyxHQUFuQyxHQUEwQyxLQUFLLENBQUwsQ0FBTyxLQUFQLENBQWEsRUFBRSxFQUFGLEdBQU0sRUFBRSxDQUFyQixDQUExQyxHQUFxRSxHQUE1RTtBQUFrRixhQUF2SDs7QUFFQSxxQkFDSyxJQURMLENBQ1UsT0FEVixFQUNvQixLQUFLLENBQUwsQ0FBTyxLQUFQLENBQWEsS0FBSyxhQUFMLENBQW1CLENBQW5CLEVBQXNCLEVBQW5DLElBQXlDLEtBQUssQ0FBTCxDQUFPLEtBQVAsQ0FBYSxDQUFiLENBQXpDLEdBQTBELENBRDlFLEVBRUssSUFGTCxDQUVVLFFBRlYsRUFFb0I7QUFBQSx1QkFBTyxLQUFLLE1BQUwsR0FBYyxLQUFLLENBQUwsQ0FBTyxLQUFQLENBQWEsRUFBRSxDQUFmLENBQXJCO0FBQUEsYUFGcEI7O0FBSUEsZ0JBQUcsS0FBSyxJQUFMLENBQVUsS0FBYixFQUFtQjtBQUNmLHVCQUNLLElBREwsQ0FDVSxNQURWLEVBQ2tCLEtBQUssSUFBTCxDQUFVLEtBRDVCO0FBRUg7O0FBRUQsZ0JBQUksS0FBSyxPQUFULEVBQWtCO0FBQ2Qsb0JBQUksRUFBSixDQUFPLFdBQVAsRUFBb0IsYUFBSztBQUNyQix5QkFBSyxPQUFMLENBQWEsVUFBYixHQUNLLFFBREwsQ0FDYyxHQURkLEVBRUssS0FGTCxDQUVXLFNBRlgsRUFFc0IsRUFGdEI7QUFHQSx5QkFBSyxPQUFMLENBQWEsSUFBYixDQUFrQixFQUFFLENBQXBCLEVBQ0ssS0FETCxDQUNXLE1BRFgsRUFDb0IsR0FBRyxLQUFILENBQVMsS0FBVCxHQUFpQixDQUFsQixHQUF1QixJQUQxQyxFQUVLLEtBRkwsQ0FFVyxLQUZYLEVBRW1CLEdBQUcsS0FBSCxDQUFTLEtBQVQsR0FBaUIsRUFBbEIsR0FBd0IsSUFGMUM7QUFHSCxpQkFQRCxFQU9HLEVBUEgsQ0FPTSxVQVBOLEVBT2tCLGFBQUs7QUFDbkIseUJBQUssT0FBTCxDQUFhLFVBQWIsR0FDSyxRQURMLENBQ2MsR0FEZCxFQUVLLEtBRkwsQ0FFVyxTQUZYLEVBRXNCLENBRnRCO0FBR0gsaUJBWEQ7QUFZSDtBQUNELGtCQUFNLElBQU4sR0FBYSxNQUFiO0FBQ0EsZ0JBQUksSUFBSixHQUFXLE1BQVg7QUFDSDs7OytCQUVNLE8sRUFBUTtBQUNYLHdGQUFhLE9BQWI7QUFDQSxpQkFBSyxTQUFMO0FBQ0EsaUJBQUssU0FBTDs7QUFFQSxpQkFBSyxhQUFMOztBQUVBLGlCQUFLLFlBQUw7QUFDSDs7O3VDQUdjO0FBQ1gsZ0JBQUksT0FBTyxLQUFLLElBQWhCOztBQUVBLGdCQUFJLFFBQVEsS0FBSyxhQUFqQjtBQUNBLGdCQUFHLENBQUMsTUFBTSxNQUFOLEVBQUQsSUFBbUIsTUFBTSxNQUFOLEdBQWUsTUFBZixHQUFzQixDQUE1QyxFQUE4QztBQUMxQyxxQkFBSyxVQUFMLEdBQWtCLEtBQWxCO0FBQ0g7O0FBRUQsZ0JBQUcsQ0FBQyxLQUFLLFVBQVQsRUFBb0I7QUFDaEIsb0JBQUcsS0FBSyxNQUFMLElBQWUsS0FBSyxNQUFMLENBQVksU0FBOUIsRUFBd0M7QUFDcEMseUJBQUssTUFBTCxDQUFZLFNBQVosQ0FBc0IsTUFBdEI7QUFDSDtBQUNEO0FBQ0g7O0FBR0QsZ0JBQUksVUFBVSxLQUFLLElBQUwsQ0FBVSxLQUFWLEdBQWtCLEtBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsTUFBbkQ7QUFDQSxnQkFBSSxVQUFVLEtBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsTUFBakM7O0FBRUEsaUJBQUssTUFBTCxHQUFjLG1CQUFXLEtBQUssR0FBaEIsRUFBcUIsS0FBSyxJQUExQixFQUFnQyxLQUFoQyxFQUF1QyxPQUF2QyxFQUFnRCxPQUFoRCxDQUFkOztBQUVBLGdCQUFJLGVBQWUsS0FBSyxNQUFMLENBQVksS0FBWixHQUNkLFVBRGMsQ0FDSCxLQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLFVBRGhCLEVBRWQsTUFGYyxDQUVQLFVBRk8sRUFHZCxLQUhjLENBR1IsS0FIUSxDQUFuQjs7QUFLQSxpQkFBSyxNQUFMLENBQVksU0FBWixDQUNLLElBREwsQ0FDVSxZQURWO0FBRUg7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7d0JDaFRHLFc7Ozs7Ozt3QkFBYSxpQjs7Ozs7Ozs7OzhCQUNiLGlCOzs7Ozs7OEJBQW1CLHVCOzs7Ozs7Ozs7OEJBQ25CLGlCOzs7Ozs7OEJBQW1CLHVCOzs7Ozs7Ozs7dUJBQ25CLFU7Ozs7Ozt1QkFBWSxnQjs7Ozs7Ozs7O29CQUNaLE87Ozs7OztvQkFBUyxhOzs7Ozs7Ozs7OEJBQ1QsaUI7Ozs7Ozs4QkFBbUIsdUI7Ozs7Ozs7OztzQkFDbkIsUzs7Ozs7O3NCQUFXLGU7Ozs7Ozs7OztxQkFDWCxROzs7Ozs7cUJBQVUsYzs7Ozs7Ozs7OzRCQUNWLGU7Ozs7Ozs7OzttQkFDQSxNOzs7O0FBWlI7O0FBQ0EsMkJBQWEsTUFBYjs7Ozs7Ozs7Ozs7O0FDREE7O0FBQ0E7Ozs7Ozs7Ozs7SUFRYSxNLFdBQUEsTTtBQWFULG9CQUFZLEdBQVosRUFBaUIsWUFBakIsRUFBK0IsS0FBL0IsRUFBc0MsT0FBdEMsRUFBK0MsT0FBL0MsRUFBd0QsV0FBeEQsRUFBb0U7QUFBQTs7QUFBQSxhQVhwRSxjQVdvRSxHQVhyRCxNQVdxRDtBQUFBLGFBVnBFLFdBVW9FLEdBVnhELEtBQUssY0FBTCxHQUFvQixRQVVvQztBQUFBLGFBUHBFLEtBT29FO0FBQUEsYUFOcEUsSUFNb0U7QUFBQSxhQUxwRSxNQUtvRTtBQUFBLGFBRnBFLFdBRW9FLEdBRnRELFNBRXNEOztBQUNoRSxhQUFLLEtBQUwsR0FBVyxLQUFYO0FBQ0EsYUFBSyxHQUFMLEdBQVcsR0FBWDtBQUNBLGFBQUssSUFBTCxHQUFZLGFBQU0sSUFBTixFQUFaO0FBQ0EsYUFBSyxTQUFMLEdBQWtCLGFBQU0sY0FBTixDQUFxQixZQUFyQixFQUFtQyxPQUFLLEtBQUssV0FBN0MsRUFBMEQsR0FBMUQsRUFDYixJQURhLENBQ1IsV0FEUSxFQUNLLGVBQWEsT0FBYixHQUFxQixHQUFyQixHQUF5QixPQUF6QixHQUFpQyxHQUR0QyxFQUViLE9BRmEsQ0FFTCxLQUFLLFdBRkEsRUFFYSxJQUZiLENBQWxCOztBQUlBLGFBQUssV0FBTCxHQUFtQixXQUFuQjtBQUNIOzs7OzBDQUlpQixRLEVBQVUsUyxFQUFXLEssRUFBTTtBQUN6QyxnQkFBSSxhQUFhLEtBQUssY0FBTCxHQUFvQixpQkFBcEIsR0FBc0MsR0FBdEMsR0FBMEMsS0FBSyxJQUFoRTtBQUNBLGdCQUFJLFFBQU8sS0FBSyxLQUFoQjtBQUNBLGdCQUFJLE9BQU8sSUFBWDs7QUFFQSxpQkFBSyxjQUFMLEdBQXNCLGFBQU0sY0FBTixDQUFxQixLQUFLLEdBQTFCLEVBQStCLFVBQS9CLEVBQTJDLEtBQUssS0FBTCxDQUFXLEtBQVgsRUFBM0MsRUFBK0QsQ0FBL0QsRUFBa0UsR0FBbEUsRUFBdUUsQ0FBdkUsRUFBMEUsQ0FBMUUsQ0FBdEI7O0FBRUEsaUJBQUssU0FBTCxDQUFlLE1BQWYsQ0FBc0IsTUFBdEIsRUFDSyxJQURMLENBQ1UsT0FEVixFQUNtQixRQURuQixFQUVLLElBRkwsQ0FFVSxRQUZWLEVBRW9CLFNBRnBCLEVBR0ssSUFITCxDQUdVLEdBSFYsRUFHZSxDQUhmLEVBSUssSUFKTCxDQUlVLEdBSlYsRUFJZSxDQUpmLEVBS0ssS0FMTCxDQUtXLE1BTFgsRUFLbUIsVUFBUSxVQUFSLEdBQW1CLEdBTHRDOztBQVFBLGdCQUFJLFFBQVEsS0FBSyxTQUFMLENBQWUsU0FBZixDQUF5QixNQUF6QixFQUNQLElBRE8sQ0FDRCxNQUFNLE1BQU4sRUFEQyxDQUFaO0FBRUEsZ0JBQUksY0FBYSxNQUFNLE1BQU4sR0FBZSxNQUFmLEdBQXNCLENBQXZDO0FBQ0Esa0JBQU0sS0FBTixHQUFjLE1BQWQsQ0FBcUIsTUFBckI7O0FBRUEsa0JBQU0sSUFBTixDQUFXLEdBQVgsRUFBZ0IsUUFBaEIsRUFDSyxJQURMLENBQ1UsR0FEVixFQUNnQixVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsdUJBQVcsWUFBWSxJQUFFLFNBQUYsR0FBWSxXQUFuQztBQUFBLGFBRGhCLEVBRUssSUFGTCxDQUVVLElBRlYsRUFFZ0IsQ0FGaEI7O0FBQUEsYUFJSyxJQUpMLENBSVUsb0JBSlYsRUFJZ0MsUUFKaEMsRUFLSyxJQUxMLENBS1U7QUFBQSx1QkFBSSxLQUFLLFdBQUwsR0FBbUIsS0FBSyxXQUFMLENBQWlCLENBQWpCLENBQW5CLEdBQXlDLENBQTdDO0FBQUEsYUFMVjtBQU1BLGtCQUFNLElBQU4sQ0FBVyxtQkFBWCxFQUFnQyxRQUFoQztBQUNBLGdCQUFHLEtBQUssWUFBUixFQUFxQjtBQUNqQixzQkFDSyxJQURMLENBQ1UsV0FEVixFQUN1QixVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsMkJBQVUsaUJBQWlCLFFBQWpCLEdBQTRCLElBQTVCLElBQW9DLFlBQVksSUFBRSxTQUFGLEdBQVksV0FBNUQsSUFBNEUsR0FBdEY7QUFBQSxpQkFEdkIsRUFFSyxJQUZMLENBRVUsYUFGVixFQUV5QixPQUZ6QixFQUdLLElBSEwsQ0FHVSxJQUhWLEVBR2dCLENBSGhCLEVBSUssSUFKTCxDQUlVLElBSlYsRUFJZ0IsQ0FKaEI7QUFNSCxhQVBELE1BT0ssQ0FFSjs7QUFFRCxrQkFBTSxJQUFOLEdBQWEsTUFBYjs7QUFFQSxtQkFBTyxJQUFQO0FBQ0g7Ozt3Q0FFZSxZLEVBQWM7QUFDMUIsaUJBQUssWUFBTCxHQUFvQixZQUFwQjtBQUNBLG1CQUFPLElBQVA7QUFDSDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakZMOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7OztJQUdhLGdCLFdBQUEsZ0I7OztBQVVULDhCQUFZLE1BQVosRUFBbUI7QUFBQTs7QUFBQTs7QUFBQSxjQVJuQixjQVFtQixHQVJGLElBUUU7QUFBQSxjQVBuQixlQU9tQixHQVBELElBT0M7QUFBQSxjQU5uQixVQU1tQixHQU5SO0FBQ1AsbUJBQU8sSUFEQTtBQUVQLDJCQUFlLHVCQUFDLGdCQUFELEVBQW1CLG1CQUFuQjtBQUFBLHVCQUEyQyxpQ0FBZ0IsTUFBaEIsQ0FBdUIsZ0JBQXZCLEVBQXlDLG1CQUF6QyxDQUEzQztBQUFBLGFBRlI7QUFHUCwyQkFBZSxTO0FBSFIsU0FNUTs7O0FBR2YsWUFBRyxNQUFILEVBQVU7QUFDTix5QkFBTSxVQUFOLFFBQXVCLE1BQXZCO0FBQ0g7O0FBTGM7QUFPbEI7Ozs7O0lBR1EsVSxXQUFBLFU7OztBQUNULHdCQUFZLG1CQUFaLEVBQWlDLElBQWpDLEVBQXVDLE1BQXZDLEVBQStDO0FBQUE7O0FBQUEsNkZBQ3JDLG1CQURxQyxFQUNoQixJQURnQixFQUNWLElBQUksZ0JBQUosQ0FBcUIsTUFBckIsQ0FEVTtBQUU5Qzs7OztrQ0FFUyxNLEVBQU87QUFDYixtR0FBdUIsSUFBSSxnQkFBSixDQUFxQixNQUFyQixDQUF2QjtBQUNIOzs7bUNBRVM7QUFDTjtBQUNBLGlCQUFLLG1CQUFMO0FBQ0g7Ozs4Q0FFb0I7O0FBRWpCLGdCQUFJLE9BQU8sSUFBWDtBQUNBLGdCQUFJLGtCQUFrQixLQUFLLE1BQUwsQ0FBWSxNQUFaLElBQXNCLEtBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsS0FBL0Q7O0FBRUEsaUJBQUssSUFBTCxDQUFVLFdBQVYsR0FBdUIsRUFBdkI7O0FBR0EsZ0JBQUcsbUJBQW1CLEtBQUssTUFBTCxDQUFZLGNBQWxDLEVBQWlEO0FBQzdDLG9CQUFJLGFBQWEsS0FBSyxjQUFMLENBQW9CLEtBQUssSUFBekIsRUFBK0IsS0FBL0IsQ0FBakI7QUFDQSxxQkFBSyxJQUFMLENBQVUsV0FBVixDQUFzQixJQUF0QixDQUEyQixVQUEzQjtBQUNIOztBQUVELGdCQUFHLEtBQUssTUFBTCxDQUFZLGVBQWYsRUFBK0I7QUFDM0IscUJBQUssbUJBQUw7QUFDSDtBQUVKOzs7OENBRXFCO0FBQ2xCLGdCQUFJLE9BQU8sSUFBWDtBQUNBLGdCQUFJLGNBQWMsRUFBbEI7QUFDQSxpQkFBSyxJQUFMLENBQVUsT0FBVixDQUFtQixhQUFHO0FBQ2xCLG9CQUFJLFdBQVcsS0FBSyxNQUFMLENBQVksTUFBWixDQUFtQixLQUFuQixDQUF5QixDQUF6QixFQUE0QixLQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLEdBQS9DLENBQWY7O0FBRUEsb0JBQUcsQ0FBQyxRQUFELElBQWEsYUFBVyxDQUEzQixFQUE2QjtBQUN6QjtBQUNIOztBQUVELG9CQUFHLENBQUMsWUFBWSxRQUFaLENBQUosRUFBMEI7QUFDdEIsZ0NBQVksUUFBWixJQUF3QixFQUF4QjtBQUNIO0FBQ0QsNEJBQVksUUFBWixFQUFzQixJQUF0QixDQUEyQixDQUEzQjtBQUNILGFBWEQ7O0FBYUEsaUJBQUksSUFBSSxHQUFSLElBQWUsV0FBZixFQUEyQjtBQUN2QixvQkFBSSxDQUFDLFlBQVksY0FBWixDQUEyQixHQUEzQixDQUFMLEVBQXNDO0FBQ2xDO0FBQ0g7O0FBRUQsb0JBQUksYUFBYSxLQUFLLGNBQUwsQ0FBb0IsWUFBWSxHQUFaLENBQXBCLEVBQXNDLEdBQXRDLENBQWpCO0FBQ0EscUJBQUssSUFBTCxDQUFVLFdBQVYsQ0FBc0IsSUFBdEIsQ0FBMkIsVUFBM0I7QUFDSDtBQUNKOzs7dUNBRWMsTSxFQUFRLFEsRUFBUztBQUM1QixnQkFBSSxPQUFPLElBQVg7O0FBRUEsZ0JBQUksU0FBUyxPQUFPLEdBQVAsQ0FBVyxhQUFHO0FBQ3ZCLHVCQUFPLENBQUMsV0FBVyxLQUFLLElBQUwsQ0FBVSxDQUFWLENBQVksS0FBWixDQUFrQixDQUFsQixDQUFYLENBQUQsRUFBbUMsV0FBVyxLQUFLLElBQUwsQ0FBVSxDQUFWLENBQVksS0FBWixDQUFrQixDQUFsQixDQUFYLENBQW5DLENBQVA7QUFDSCxhQUZZLENBQWI7Ozs7QUFNQSxnQkFBSSxtQkFBb0IsaUNBQWdCLGdCQUFoQixDQUFpQyxNQUFqQyxDQUF4QjtBQUNBLGdCQUFJLHVCQUF1QixpQ0FBZ0Isb0JBQWhCLENBQXFDLGdCQUFyQyxDQUEzQjs7QUFHQSxnQkFBSSxVQUFVLEdBQUcsTUFBSCxDQUFVLE1BQVYsRUFBa0I7QUFBQSx1QkFBRyxFQUFFLENBQUYsQ0FBSDtBQUFBLGFBQWxCLENBQWQ7O0FBR0EsZ0JBQUksYUFBYSxDQUNiO0FBQ0ksbUJBQUcsUUFBUSxDQUFSLENBRFA7QUFFSSxtQkFBRyxxQkFBcUIsUUFBUSxDQUFSLENBQXJCO0FBRlAsYUFEYSxFQUtiO0FBQ0ksbUJBQUcsUUFBUSxDQUFSLENBRFA7QUFFSSxtQkFBRyxxQkFBcUIsUUFBUSxDQUFSLENBQXJCO0FBRlAsYUFMYSxDQUFqQjs7QUFXQSxnQkFBSSxPQUFPLEdBQUcsR0FBSCxDQUFPLElBQVAsR0FDTixXQURNLENBQ00sT0FETixFQUVOLENBRk0sQ0FFSjtBQUFBLHVCQUFLLEtBQUssSUFBTCxDQUFVLENBQVYsQ0FBWSxLQUFaLENBQWtCLEVBQUUsQ0FBcEIsQ0FBTDtBQUFBLGFBRkksRUFHTixDQUhNLENBR0o7QUFBQSx1QkFBSyxLQUFLLElBQUwsQ0FBVSxDQUFWLENBQVksS0FBWixDQUFrQixFQUFFLENBQXBCLENBQUw7QUFBQSxhQUhJLENBQVg7O0FBTUEsZ0JBQUksUUFBUSxLQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsS0FBMUI7O0FBRUEsZ0JBQUksZUFBZSxPQUFuQjtBQUNBLGdCQUFHLGFBQU0sVUFBTixDQUFpQixLQUFqQixDQUFILEVBQTJCO0FBQ3ZCLG9CQUFHLE9BQU8sTUFBUCxJQUFpQixhQUFXLEtBQS9CLEVBQXFDO0FBQ2pDLDRCQUFRLE1BQU0sT0FBTyxDQUFQLENBQU4sQ0FBUjtBQUNILGlCQUZELE1BRUs7QUFDRCw0QkFBUSxZQUFSO0FBQ0g7QUFDSixhQU5ELE1BTU0sSUFBRyxDQUFDLEtBQUQsSUFBVSxhQUFXLEtBQXhCLEVBQThCO0FBQ2hDLHdCQUFRLFlBQVI7QUFDSDs7QUFHRCxnQkFBSSxhQUFhLEtBQUssaUJBQUwsQ0FBdUIsTUFBdkIsRUFBK0IsT0FBL0IsRUFBeUMsZ0JBQXpDLEVBQTBELG9CQUExRCxDQUFqQjtBQUNBLG1CQUFPO0FBQ0gsdUJBQU8sWUFBWSxLQURoQjtBQUVILHNCQUFNLElBRkg7QUFHSCw0QkFBWSxVQUhUO0FBSUgsdUJBQU8sS0FKSjtBQUtILDRCQUFZO0FBTFQsYUFBUDtBQU9IOzs7MENBRWlCLE0sRUFBUSxPLEVBQVMsZ0IsRUFBaUIsb0IsRUFBcUI7QUFDckUsZ0JBQUksT0FBTyxJQUFYO0FBQ0EsZ0JBQUksUUFBUSxpQkFBaUIsQ0FBN0I7QUFDQSxnQkFBSSxJQUFJLE9BQU8sTUFBZjtBQUNBLGdCQUFJLG1CQUFtQixLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksSUFBRSxDQUFkLENBQXZCOztBQUVBLGdCQUFJLFFBQVEsSUFBSSxLQUFLLE1BQUwsQ0FBWSxVQUFaLENBQXVCLEtBQXZDO0FBQ0EsZ0JBQUksc0JBQXVCLElBQUksUUFBTSxDQUFyQztBQUNBLGdCQUFJLGdCQUFnQixLQUFLLE1BQUwsQ0FBWSxVQUFaLENBQXVCLGFBQXZCLENBQXFDLGdCQUFyQyxFQUFzRCxtQkFBdEQsQ0FBcEI7O0FBRUEsZ0JBQUksVUFBVSxPQUFPLEdBQVAsQ0FBVztBQUFBLHVCQUFHLEVBQUUsQ0FBRixDQUFIO0FBQUEsYUFBWCxDQUFkO0FBQ0EsZ0JBQUksUUFBUSxpQ0FBZ0IsSUFBaEIsQ0FBcUIsT0FBckIsQ0FBWjtBQUNBLGdCQUFJLFNBQU8sQ0FBWDtBQUNBLGdCQUFJLE9BQUssQ0FBVDtBQUNBLGdCQUFJLFVBQVEsQ0FBWjtBQUNBLGdCQUFJLE9BQUssQ0FBVDtBQUNBLGdCQUFJLFVBQVEsQ0FBWjtBQUNBLG1CQUFPLE9BQVAsQ0FBZSxhQUFHO0FBQ2Qsb0JBQUksSUFBSSxFQUFFLENBQUYsQ0FBUjtBQUNBLG9CQUFJLElBQUksRUFBRSxDQUFGLENBQVI7O0FBRUEsMEJBQVUsSUFBRSxDQUFaO0FBQ0Esd0JBQU0sQ0FBTjtBQUNBLHdCQUFNLENBQU47QUFDQSwyQkFBVSxJQUFFLENBQVo7QUFDQSwyQkFBVSxJQUFFLENBQVo7QUFDSCxhQVREO0FBVUEsZ0JBQUksSUFBSSxpQkFBaUIsQ0FBekI7QUFDQSxnQkFBSSxJQUFJLGlCQUFpQixDQUF6Qjs7QUFFQSxnQkFBSSxNQUFNLEtBQUcsSUFBRSxDQUFMLEtBQVcsQ0FBQyxVQUFRLElBQUUsTUFBVixHQUFpQixJQUFFLElBQXBCLEtBQTJCLElBQUUsT0FBRixHQUFXLE9BQUssSUFBM0MsQ0FBWCxDQUFWLEM7QUFDQSxnQkFBSSxNQUFNLENBQUMsVUFBVSxJQUFFLE1BQVosR0FBbUIsSUFBRSxJQUF0QixLQUE2QixLQUFHLElBQUUsQ0FBTCxDQUE3QixDQUFWLEM7O0FBRUEsZ0JBQUksVUFBVSxTQUFWLE9BQVU7QUFBQSx1QkFBSSxLQUFLLElBQUwsQ0FBVSxNQUFNLEtBQUssR0FBTCxDQUFTLElBQUUsS0FBWCxFQUFpQixDQUFqQixJQUFvQixHQUFwQyxDQUFKO0FBQUEsYUFBZCxDO0FBQ0EsZ0JBQUksZ0JBQWlCLFNBQWpCLGFBQWlCO0FBQUEsdUJBQUksZ0JBQWUsUUFBUSxDQUFSLENBQW5CO0FBQUEsYUFBckI7Ozs7OztBQVFBLGdCQUFJLDZCQUE2QixTQUE3QiwwQkFBNkIsSUFBRztBQUNoQyxvQkFBSSxtQkFBbUIscUJBQXFCLENBQXJCLENBQXZCO0FBQ0Esb0JBQUksTUFBTSxjQUFjLENBQWQsQ0FBVjtBQUNBLG9CQUFJLFdBQVcsbUJBQW1CLEdBQWxDO0FBQ0Esb0JBQUksU0FBUyxtQkFBbUIsR0FBaEM7QUFDQSx1QkFBTztBQUNILHVCQUFHLENBREE7QUFFSCx3QkFBSSxRQUZEO0FBR0gsd0JBQUk7QUFIRCxpQkFBUDtBQU1ILGFBWEQ7O0FBYUEsZ0JBQUksVUFBVSxDQUFDLFFBQVEsQ0FBUixJQUFXLFFBQVEsQ0FBUixDQUFaLElBQXdCLENBQXRDOzs7QUFHQSxnQkFBSSx1QkFBdUIsQ0FBQyxRQUFRLENBQVIsQ0FBRCxFQUFhLE9BQWIsRUFBdUIsUUFBUSxDQUFSLENBQXZCLEVBQW1DLEdBQW5DLENBQXVDLDBCQUF2QyxDQUEzQjs7QUFFQSxnQkFBSSxZQUFZLFNBQVosU0FBWTtBQUFBLHVCQUFLLENBQUw7QUFBQSxhQUFoQjs7QUFFQSxnQkFBSSxpQkFBa0IsR0FBRyxHQUFILENBQU8sSUFBUCxHQUNyQixXQURxQixDQUNULFVBRFMsRUFFakIsQ0FGaUIsQ0FFZjtBQUFBLHVCQUFLLEtBQUssSUFBTCxDQUFVLENBQVYsQ0FBWSxLQUFaLENBQWtCLEVBQUUsQ0FBcEIsQ0FBTDtBQUFBLGFBRmUsRUFHakIsRUFIaUIsQ0FHZDtBQUFBLHVCQUFLLFVBQVUsS0FBSyxJQUFMLENBQVUsQ0FBVixDQUFZLEtBQVosQ0FBa0IsRUFBRSxFQUFwQixDQUFWLENBQUw7QUFBQSxhQUhjLEVBSWpCLEVBSmlCLENBSWQ7QUFBQSx1QkFBSyxVQUFVLEtBQUssSUFBTCxDQUFVLENBQVYsQ0FBWSxLQUFaLENBQWtCLEVBQUUsRUFBcEIsQ0FBVixDQUFMO0FBQUEsYUFKYyxDQUF0Qjs7QUFNQSxtQkFBTztBQUNILHNCQUFLLGNBREY7QUFFSCx3QkFBTztBQUZKLGFBQVA7QUFJSDs7OytCQUVNLE8sRUFBUTtBQUNYLHlGQUFhLE9BQWI7QUFDQSxpQkFBSyxxQkFBTDtBQUVIOzs7Z0RBRXVCO0FBQ3BCLGdCQUFJLE9BQU8sSUFBWDtBQUNBLGdCQUFJLDJCQUEyQixLQUFLLFdBQUwsQ0FBaUIsc0JBQWpCLENBQS9CO0FBQ0EsZ0JBQUksOEJBQThCLE9BQUssd0JBQXZDOztBQUVBLGdCQUFJLGFBQWEsS0FBSyxXQUFMLENBQWlCLE1BQWpCLENBQWpCOztBQUVBLGdCQUFJLHNCQUFzQixLQUFLLElBQUwsQ0FBVSxjQUFWLENBQXlCLDJCQUF6QixFQUFzRCxNQUFJLEtBQUssa0JBQS9ELENBQTFCO0FBQ0EsZ0JBQUksMEJBQTBCLG9CQUFvQixjQUFwQixDQUFtQyxVQUFuQyxFQUN6QixJQUR5QixDQUNwQixJQURvQixFQUNkLFVBRGMsQ0FBOUI7O0FBSUEsb0NBQXdCLGNBQXhCLENBQXVDLE1BQXZDLEVBQ0ssSUFETCxDQUNVLE9BRFYsRUFDbUIsS0FBSyxJQUFMLENBQVUsS0FEN0IsRUFFSyxJQUZMLENBRVUsUUFGVixFQUVvQixLQUFLLElBQUwsQ0FBVSxNQUY5QixFQUdLLElBSEwsQ0FHVSxHQUhWLEVBR2UsQ0FIZixFQUlLLElBSkwsQ0FJVSxHQUpWLEVBSWUsQ0FKZjs7QUFNQSxnQ0FBb0IsSUFBcEIsQ0FBeUIsV0FBekIsRUFBc0MsVUFBQyxDQUFELEVBQUcsQ0FBSDtBQUFBLHVCQUFTLFVBQVEsVUFBUixHQUFtQixHQUE1QjtBQUFBLGFBQXRDOztBQUVBLGdCQUFJLGtCQUFrQixLQUFLLFdBQUwsQ0FBaUIsWUFBakIsQ0FBdEI7QUFDQSxnQkFBSSxzQkFBc0IsS0FBSyxXQUFMLENBQWlCLFlBQWpCLENBQTFCO0FBQ0EsZ0JBQUkscUJBQXFCLE9BQUssZUFBOUI7QUFDQSxnQkFBSSxhQUFhLG9CQUFvQixTQUFwQixDQUE4QixrQkFBOUIsRUFDWixJQURZLENBQ1AsS0FBSyxJQUFMLENBQVUsV0FESCxDQUFqQjs7QUFHQSxnQkFBSSxtQkFBbUIsV0FBVyxLQUFYLEdBQW1CLGNBQW5CLENBQWtDLGtCQUFsQyxDQUF2QjtBQUNBLGdCQUFJLFlBQVksS0FBSyxXQUFMLENBQWlCLE1BQWpCLENBQWhCO0FBQ0EsNkJBRUssTUFGTCxDQUVZLE1BRlosRUFHSyxJQUhMLENBR1UsT0FIVixFQUdtQixTQUhuQixFQUlLLElBSkwsQ0FJVSxpQkFKVixFQUk2QixpQkFKN0I7Ozs7O0FBU0EsZ0JBQUksT0FBTyxXQUFXLE1BQVgsQ0FBa0IsVUFBUSxTQUExQixFQUNOLEtBRE0sQ0FDQSxRQURBLEVBQ1U7QUFBQSx1QkFBSyxFQUFFLEtBQVA7QUFBQSxhQURWLENBQVg7Ozs7OztBQVFBLGdCQUFJLFFBQVEsSUFBWjtBQUNBLGdCQUFJLEtBQUssaUJBQUwsRUFBSixFQUE4QjtBQUMxQix3QkFBUSxLQUFLLFVBQUwsRUFBUjtBQUNIOztBQUVELGtCQUFNLElBQU4sQ0FBVyxHQUFYLEVBQWdCO0FBQUEsdUJBQUssRUFBRSxJQUFGLENBQU8sRUFBRSxVQUFULENBQUw7QUFBQSxhQUFoQjs7QUFHQSw2QkFDSyxNQURMLENBQ1ksTUFEWixFQUVLLElBRkwsQ0FFVSxPQUZWLEVBRW1CLG1CQUZuQixFQUdLLElBSEwsQ0FHVSxpQkFIVixFQUc2QixpQkFIN0IsRUFJSyxLQUpMLENBSVcsTUFKWCxFQUltQjtBQUFBLHVCQUFLLEVBQUUsS0FBUDtBQUFBLGFBSm5CLEVBS0ssS0FMTCxDQUtXLFNBTFgsRUFLc0IsS0FMdEI7O0FBU0EsZ0JBQUksT0FBTyxXQUFXLE1BQVgsQ0FBa0IsVUFBUSxtQkFBMUIsQ0FBWDs7QUFFQSxnQkFBSSxRQUFRLElBQVo7QUFDQSxnQkFBSSxLQUFLLGlCQUFMLEVBQUosRUFBOEI7QUFDMUIsd0JBQVEsS0FBSyxVQUFMLEVBQVI7QUFDSDtBQUNELGtCQUFNLElBQU4sQ0FBVyxHQUFYLEVBQWdCO0FBQUEsdUJBQUssRUFBRSxVQUFGLENBQWEsSUFBYixDQUFrQixFQUFFLFVBQUYsQ0FBYSxNQUEvQixDQUFMO0FBQUEsYUFBaEI7O0FBRUEsdUJBQVcsSUFBWCxHQUFrQixNQUFsQjtBQUVIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0U0w7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0lBRWEsdUIsV0FBQSx1Qjs7Ozs7OztBQTZCVCxxQ0FBWSxNQUFaLEVBQW1CO0FBQUE7O0FBQUE7O0FBQUEsY0EzQm5CLFFBMkJtQixHQTNCVCxNQUFLLGNBQUwsR0FBb0Isb0JBMkJYO0FBQUEsY0ExQm5CLElBMEJtQixHQTFCYixHQTBCYTtBQUFBLGNBekJuQixPQXlCbUIsR0F6QlYsRUF5QlU7QUFBQSxjQXhCbkIsS0F3Qm1CLEdBeEJaLElBd0JZO0FBQUEsY0F2Qm5CLE1BdUJtQixHQXZCWCxJQXVCVztBQUFBLGNBdEJuQixXQXNCbUIsR0F0Qk4sSUFzQk07QUFBQSxjQXJCbkIsS0FxQm1CLEdBckJaLFNBcUJZO0FBQUEsY0FwQm5CLENBb0JtQixHQXBCakIsRTtBQUNFLG9CQUFRLFFBRFY7QUFFRSxtQkFBTztBQUZULFNBb0JpQjtBQUFBLGNBaEJuQixDQWdCbUIsR0FoQmpCLEU7QUFDRSxvQkFBUSxNQURWO0FBRUUsbUJBQU87QUFGVCxTQWdCaUI7QUFBQSxjQVpuQixNQVltQixHQVpaO0FBQ0gsaUJBQUssU0FERixFO0FBRUgsMkJBQWUsS0FGWixFO0FBR0gsbUJBQU8sZUFBQyxDQUFELEVBQUksR0FBSjtBQUFBLHVCQUFZLEVBQUUsR0FBRixDQUFaO0FBQUEsYUFISixFO0FBSUgsbUJBQU87QUFKSixTQVlZO0FBQUEsY0FObkIsU0FNbUIsR0FOUjtBQUNQLG9CQUFRLEVBREQsRTtBQUVQLGtCQUFNLEVBRkMsRTtBQUdQLG1CQUFPLGVBQUMsQ0FBRCxFQUFJLFdBQUo7QUFBQSx1QkFBb0IsRUFBRSxXQUFGLENBQXBCO0FBQUEsYTtBQUhBLFNBTVE7O0FBRWYscUJBQU0sVUFBTixRQUF1QixNQUF2QjtBQUZlO0FBR2xCLEs7Ozs7Ozs7SUFLUSxpQixXQUFBLGlCOzs7QUFDVCwrQkFBWSxtQkFBWixFQUFpQyxJQUFqQyxFQUF1QyxNQUF2QyxFQUErQztBQUFBOztBQUFBLG9HQUNyQyxtQkFEcUMsRUFDaEIsSUFEZ0IsRUFDVixJQUFJLHVCQUFKLENBQTRCLE1BQTVCLENBRFU7QUFFOUM7Ozs7a0NBRVMsTSxFQUFRO0FBQ2QsMEdBQXVCLElBQUksdUJBQUosQ0FBNEIsTUFBNUIsQ0FBdkI7QUFFSDs7O21DQUVVO0FBQ1A7O0FBRUEsZ0JBQUksT0FBTyxJQUFYO0FBQ0EsZ0JBQUksU0FBUyxLQUFLLElBQUwsQ0FBVSxNQUF2QjtBQUNBLGdCQUFJLE9BQU8sS0FBSyxNQUFoQjtBQUNBLGlCQUFLLElBQUwsQ0FBVSxDQUFWLEdBQVksRUFBWjtBQUNBLGlCQUFLLElBQUwsQ0FBVSxDQUFWLEdBQVksRUFBWjtBQUNBLGlCQUFLLElBQUwsQ0FBVSxHQUFWLEdBQWM7QUFDVix1QkFBTyxJO0FBREcsYUFBZDs7QUFLQSxpQkFBSyxJQUFMLENBQVUsVUFBVixHQUF1QixLQUFLLFVBQTVCO0FBQ0EsZ0JBQUcsS0FBSyxJQUFMLENBQVUsVUFBYixFQUF3QjtBQUNwQix1QkFBTyxLQUFQLEdBQWUsS0FBSyxNQUFMLENBQVksS0FBWixHQUFvQixLQUFLLE1BQUwsQ0FBWSxLQUFoQyxHQUFzQyxLQUFLLE1BQUwsQ0FBWSxNQUFaLEdBQW1CLENBQXhFO0FBQ0g7O0FBRUQsaUJBQUssY0FBTDs7QUFFQSxpQkFBSyxJQUFMLENBQVUsSUFBVixHQUFpQixLQUFLLElBQXRCOztBQUdBLGdCQUFJLFFBQVEsS0FBSyxLQUFqQjtBQUNBLGdCQUFJLHFCQUFxQixLQUFLLG9CQUFMLEdBQTRCLHFCQUE1QixFQUF6QjtBQUNBLGdCQUFJLENBQUMsS0FBTCxFQUFZO0FBQ1Isb0JBQUksV0FBVyxPQUFPLElBQVAsR0FBYyxPQUFPLEtBQXJCLEdBQTZCLEtBQUssSUFBTCxDQUFVLFNBQVYsQ0FBb0IsTUFBcEIsR0FBMkIsS0FBSyxJQUFMLENBQVUsSUFBakY7QUFDQSx3QkFBUSxLQUFLLEdBQUwsQ0FBUyxtQkFBbUIsS0FBNUIsRUFBbUMsUUFBbkMsQ0FBUjtBQUVIO0FBQ0QsZ0JBQUksU0FBUyxLQUFiO0FBQ0EsZ0JBQUksQ0FBQyxNQUFMLEVBQWE7QUFDVCx5QkFBUyxtQkFBbUIsTUFBNUI7QUFDSDs7QUFFRCxpQkFBSyxJQUFMLENBQVUsS0FBVixHQUFrQixRQUFRLE9BQU8sSUFBZixHQUFzQixPQUFPLEtBQS9DO0FBQ0EsaUJBQUssSUFBTCxDQUFVLE1BQVYsR0FBbUIsU0FBUyxPQUFPLEdBQWhCLEdBQXNCLE9BQU8sTUFBaEQ7O0FBS0EsZ0JBQUcsS0FBSyxLQUFMLEtBQWEsU0FBaEIsRUFBMEI7QUFDdEIscUJBQUssS0FBTCxHQUFhLEtBQUssSUFBTCxDQUFVLElBQVYsR0FBaUIsRUFBOUI7QUFDSDs7QUFFRCxpQkFBSyxNQUFMO0FBQ0EsaUJBQUssTUFBTDs7QUFFQSxnQkFBSSxLQUFLLEdBQUwsQ0FBUyxlQUFiLEVBQThCO0FBQzFCLHFCQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsYUFBZCxHQUE4QixHQUFHLEtBQUgsQ0FBUyxLQUFLLEdBQUwsQ0FBUyxlQUFsQixHQUE5QjtBQUNIO0FBQ0QsZ0JBQUksYUFBYSxLQUFLLEdBQUwsQ0FBUyxLQUExQjtBQUNBLGdCQUFJLFVBQUosRUFBZ0I7QUFDWixxQkFBSyxJQUFMLENBQVUsR0FBVixDQUFjLFVBQWQsR0FBMkIsVUFBM0I7O0FBRUEsb0JBQUksT0FBTyxVQUFQLEtBQXNCLFFBQXRCLElBQWtDLHNCQUFzQixNQUE1RCxFQUFvRTtBQUNoRSx5QkFBSyxJQUFMLENBQVUsR0FBVixDQUFjLEtBQWQsR0FBc0IsVUFBdEI7QUFDSCxpQkFGRCxNQUVPLElBQUksS0FBSyxJQUFMLENBQVUsR0FBVixDQUFjLGFBQWxCLEVBQWlDO0FBQ3BDLHlCQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsS0FBZCxHQUFzQjtBQUFBLCtCQUFLLEtBQUssSUFBTCxDQUFVLEdBQVYsQ0FBYyxhQUFkLENBQTRCLEtBQUssSUFBTCxDQUFVLEdBQVYsQ0FBYyxVQUFkLENBQXlCLENBQXpCLENBQTVCLENBQUw7QUFBQSxxQkFBdEI7QUFDSDtBQUdKOztBQUlELG1CQUFPLElBQVA7QUFFSDs7O3lDQUVnQjtBQUNiLGdCQUFJLGdCQUFnQixLQUFLLE1BQUwsQ0FBWSxTQUFoQzs7QUFFQSxnQkFBSSxPQUFPLEtBQUssSUFBaEI7QUFDQSxnQkFBSSxPQUFPLEtBQUssSUFBaEI7QUFDQSxpQkFBSyxnQkFBTCxHQUF3QixFQUF4QjtBQUNBLGlCQUFLLFNBQUwsR0FBaUIsY0FBYyxJQUEvQjtBQUNBLGdCQUFHLENBQUMsS0FBSyxTQUFOLElBQW1CLENBQUMsS0FBSyxTQUFMLENBQWUsTUFBdEMsRUFBNkM7QUFDekMscUJBQUssU0FBTCxHQUFpQixhQUFNLGNBQU4sQ0FBcUIsSUFBckIsRUFBMkIsS0FBSyxNQUFMLENBQVksTUFBWixDQUFtQixHQUE5QyxFQUFtRCxLQUFLLE1BQUwsQ0FBWSxhQUEvRCxDQUFqQjtBQUNIOztBQUVELGlCQUFLLE1BQUwsR0FBYyxFQUFkO0FBQ0EsaUJBQUssZUFBTCxHQUF1QixFQUF2QjtBQUNBLGlCQUFLLFNBQUwsQ0FBZSxPQUFmLENBQXVCLFVBQUMsV0FBRCxFQUFjLEtBQWQsRUFBd0I7QUFDM0MscUJBQUssZ0JBQUwsQ0FBc0IsV0FBdEIsSUFBcUMsR0FBRyxNQUFILENBQVUsSUFBVixFQUFnQixVQUFTLENBQVQsRUFBWTtBQUFFLDJCQUFPLGNBQWMsS0FBZCxDQUFvQixDQUFwQixFQUF1QixXQUF2QixDQUFQO0FBQTRDLGlCQUExRSxDQUFyQztBQUNBLG9CQUFJLFFBQVEsV0FBWjtBQUNBLG9CQUFHLGNBQWMsTUFBZCxJQUF3QixjQUFjLE1BQWQsQ0FBcUIsTUFBckIsR0FBNEIsS0FBdkQsRUFBNkQ7O0FBRXpELDRCQUFRLGNBQWMsTUFBZCxDQUFxQixLQUFyQixDQUFSO0FBQ0g7QUFDRCxxQkFBSyxNQUFMLENBQVksSUFBWixDQUFpQixLQUFqQjtBQUNBLHFCQUFLLGVBQUwsQ0FBcUIsV0FBckIsSUFBb0MsS0FBcEM7QUFDSCxhQVREOztBQVdBLG9CQUFRLEdBQVIsQ0FBWSxLQUFLLGVBQWpCOztBQUVBLGlCQUFLLFFBQUwsR0FBZ0IsRUFBaEI7QUFDSDs7O2lDQUVROztBQUVMLGdCQUFJLE9BQU8sS0FBSyxJQUFoQjtBQUNBLGdCQUFJLElBQUksS0FBSyxDQUFiO0FBQ0EsZ0JBQUksT0FBTyxLQUFLLE1BQWhCOztBQUVBLGNBQUUsS0FBRixHQUFVLEtBQUssU0FBTCxDQUFlLEtBQXpCO0FBQ0EsY0FBRSxLQUFGLEdBQVUsR0FBRyxLQUFILENBQVMsS0FBSyxDQUFMLENBQU8sS0FBaEIsSUFBeUIsS0FBekIsQ0FBK0IsQ0FBQyxLQUFLLE9BQUwsR0FBZSxDQUFoQixFQUFtQixLQUFLLElBQUwsR0FBWSxLQUFLLE9BQUwsR0FBZSxDQUE5QyxDQUEvQixDQUFWO0FBQ0EsY0FBRSxHQUFGLEdBQVEsVUFBQyxDQUFELEVBQUksUUFBSjtBQUFBLHVCQUFpQixFQUFFLEtBQUYsQ0FBUSxFQUFFLEtBQUYsQ0FBUSxDQUFSLEVBQVcsUUFBWCxDQUFSLENBQWpCO0FBQUEsYUFBUjtBQUNBLGNBQUUsSUFBRixHQUFTLEdBQUcsR0FBSCxDQUFPLElBQVAsR0FBYyxLQUFkLENBQW9CLEVBQUUsS0FBdEIsRUFBNkIsTUFBN0IsQ0FBb0MsS0FBSyxDQUFMLENBQU8sTUFBM0MsRUFBbUQsS0FBbkQsQ0FBeUQsS0FBSyxLQUE5RCxDQUFUO0FBQ0EsY0FBRSxJQUFGLENBQU8sUUFBUCxDQUFnQixLQUFLLElBQUwsR0FBWSxLQUFLLFNBQUwsQ0FBZSxNQUEzQztBQUVIOzs7aUNBRVE7O0FBRUwsZ0JBQUksT0FBTyxLQUFLLElBQWhCO0FBQ0EsZ0JBQUksSUFBSSxLQUFLLENBQWI7QUFDQSxnQkFBSSxPQUFPLEtBQUssTUFBaEI7O0FBRUEsY0FBRSxLQUFGLEdBQVUsS0FBSyxTQUFMLENBQWUsS0FBekI7QUFDQSxjQUFFLEtBQUYsR0FBVSxHQUFHLEtBQUgsQ0FBUyxLQUFLLENBQUwsQ0FBTyxLQUFoQixJQUF5QixLQUF6QixDQUErQixDQUFFLEtBQUssSUFBTCxHQUFZLEtBQUssT0FBTCxHQUFlLENBQTdCLEVBQWdDLEtBQUssT0FBTCxHQUFlLENBQS9DLENBQS9CLENBQVY7QUFDQSxjQUFFLEdBQUYsR0FBUSxVQUFDLENBQUQsRUFBSSxRQUFKO0FBQUEsdUJBQWlCLEVBQUUsS0FBRixDQUFRLEVBQUUsS0FBRixDQUFRLENBQVIsRUFBVyxRQUFYLENBQVIsQ0FBakI7QUFBQSxhQUFSO0FBQ0EsY0FBRSxJQUFGLEdBQVEsR0FBRyxHQUFILENBQU8sSUFBUCxHQUFjLEtBQWQsQ0FBb0IsRUFBRSxLQUF0QixFQUE2QixNQUE3QixDQUFvQyxLQUFLLENBQUwsQ0FBTyxNQUEzQyxFQUFtRCxLQUFuRCxDQUF5RCxLQUFLLEtBQTlELENBQVI7QUFDQSxjQUFFLElBQUYsQ0FBTyxRQUFQLENBQWdCLENBQUMsS0FBSyxJQUFOLEdBQWEsS0FBSyxTQUFMLENBQWUsTUFBNUM7QUFDSDs7OytCQUVNO0FBQ0gsZ0JBQUksT0FBTSxJQUFWO0FBQ0EsZ0JBQUksSUFBSSxLQUFLLElBQUwsQ0FBVSxTQUFWLENBQW9CLE1BQTVCO0FBQ0EsZ0JBQUksT0FBTyxLQUFLLE1BQWhCOztBQUVBLGdCQUFJLFlBQVksS0FBSyxXQUFMLENBQWlCLE1BQWpCLENBQWhCO0FBQ0EsZ0JBQUksYUFBYSxZQUFVLElBQTNCO0FBQ0EsZ0JBQUksYUFBYSxZQUFVLElBQTNCOztBQUVBLGdCQUFJLGdCQUFnQixPQUFLLFVBQUwsR0FBZ0IsR0FBaEIsR0FBb0IsU0FBeEM7QUFDQSxnQkFBSSxnQkFBZ0IsT0FBSyxVQUFMLEdBQWdCLEdBQWhCLEdBQW9CLFNBQXhDOztBQUVBLGdCQUFJLGdCQUFnQixLQUFLLFdBQUwsQ0FBaUIsV0FBakIsQ0FBcEI7QUFDQSxpQkFBSyxJQUFMLENBQVUsU0FBVixDQUFvQixhQUFwQixFQUNLLElBREwsQ0FDVSxLQUFLLElBQUwsQ0FBVSxTQURwQixFQUVLLEtBRkwsR0FFYSxjQUZiLENBRTRCLGFBRjVCLEVBR0ssT0FITCxDQUdhLGFBSGIsRUFHNEIsQ0FBQyxLQUFLLE1BSGxDLEVBSUssSUFKTCxDQUlVLFdBSlYsRUFJdUIsVUFBQyxDQUFELEVBQUksQ0FBSjtBQUFBLHVCQUFVLGVBQWUsQ0FBQyxJQUFJLENBQUosR0FBUSxDQUFULElBQWMsS0FBSyxJQUFMLENBQVUsSUFBdkMsR0FBOEMsS0FBeEQ7QUFBQSxhQUp2QixFQUtLLElBTEwsQ0FLVSxVQUFTLENBQVQsRUFBWTtBQUFFLHFCQUFLLElBQUwsQ0FBVSxDQUFWLENBQVksS0FBWixDQUFrQixNQUFsQixDQUF5QixLQUFLLElBQUwsQ0FBVSxnQkFBVixDQUEyQixDQUEzQixDQUF6QixFQUF5RCxHQUFHLE1BQUgsQ0FBVSxJQUFWLEVBQWdCLElBQWhCLENBQXFCLEtBQUssSUFBTCxDQUFVLENBQVYsQ0FBWSxJQUFqQztBQUF5QyxhQUwxSDs7QUFPQSxpQkFBSyxJQUFMLENBQVUsU0FBVixDQUFvQixhQUFwQixFQUNLLElBREwsQ0FDVSxLQUFLLElBQUwsQ0FBVSxTQURwQixFQUVLLEtBRkwsR0FFYSxjQUZiLENBRTRCLGFBRjVCLEVBR0ssT0FITCxDQUdhLGFBSGIsRUFHNEIsQ0FBQyxLQUFLLE1BSGxDLEVBSUssSUFKTCxDQUlVLFdBSlYsRUFJdUIsVUFBQyxDQUFELEVBQUksQ0FBSjtBQUFBLHVCQUFVLGlCQUFpQixJQUFJLEtBQUssSUFBTCxDQUFVLElBQS9CLEdBQXNDLEdBQWhEO0FBQUEsYUFKdkIsRUFLSyxJQUxMLENBS1UsVUFBUyxDQUFULEVBQVk7QUFBRSxxQkFBSyxJQUFMLENBQVUsQ0FBVixDQUFZLEtBQVosQ0FBa0IsTUFBbEIsQ0FBeUIsS0FBSyxJQUFMLENBQVUsZ0JBQVYsQ0FBMkIsQ0FBM0IsQ0FBekIsRUFBeUQsR0FBRyxNQUFILENBQVUsSUFBVixFQUFnQixJQUFoQixDQUFxQixLQUFLLElBQUwsQ0FBVSxDQUFWLENBQVksSUFBakM7QUFBeUMsYUFMMUg7O0FBT0EsZ0JBQUksWUFBYSxLQUFLLFdBQUwsQ0FBaUIsTUFBakIsQ0FBakI7QUFDQSxnQkFBSSxPQUFPLEtBQUssSUFBTCxDQUFVLFNBQVYsQ0FBb0IsTUFBSSxTQUF4QixFQUNOLElBRE0sQ0FDRCxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLEtBQUssSUFBTCxDQUFVLFNBQTNCLEVBQXNDLEtBQUssSUFBTCxDQUFVLFNBQWhELENBREMsRUFFTixLQUZNLEdBRUUsY0FGRixDQUVpQixPQUFLLFNBRnRCLEVBR04sSUFITSxDQUdELFdBSEMsRUFHWTtBQUFBLHVCQUFLLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBTixHQUFVLENBQVgsSUFBZ0IsS0FBSyxJQUFMLENBQVUsSUFBekMsR0FBZ0QsR0FBaEQsR0FBc0QsRUFBRSxDQUFGLEdBQU0sS0FBSyxJQUFMLENBQVUsSUFBdEUsR0FBNkUsR0FBbEY7QUFBQSxhQUhaLENBQVg7O0FBS0EsZ0JBQUcsS0FBSyxLQUFSLEVBQWM7QUFDVixxQkFBSyxTQUFMLENBQWUsSUFBZjtBQUNIOztBQUVELGlCQUFLLElBQUwsQ0FBVSxXQUFWOzs7QUFLQSxpQkFBSyxNQUFMLENBQVk7QUFBQSx1QkFBSyxFQUFFLENBQUYsS0FBUSxFQUFFLENBQWY7QUFBQSxhQUFaLEVBQ0ssTUFETCxDQUNZLE1BRFosRUFFSyxJQUZMLENBRVUsR0FGVixFQUVlLEtBQUssT0FGcEIsRUFHSyxJQUhMLENBR1UsR0FIVixFQUdlLEtBQUssT0FIcEIsRUFJSyxJQUpMLENBSVUsSUFKVixFQUlnQixPQUpoQixFQUtLLElBTEwsQ0FLVztBQUFBLHVCQUFLLEtBQUssSUFBTCxDQUFVLGVBQVYsQ0FBMEIsRUFBRSxDQUE1QixDQUFMO0FBQUEsYUFMWDs7QUFVQSxxQkFBUyxXQUFULENBQXFCLENBQXJCLEVBQXdCO0FBQ3BCLG9CQUFJLE9BQU8sS0FBSyxJQUFoQjtBQUNBLHFCQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLENBQW5CO0FBQ0Esb0JBQUksT0FBTyxHQUFHLE1BQUgsQ0FBVSxJQUFWLENBQVg7O0FBRUEscUJBQUssQ0FBTCxDQUFPLEtBQVAsQ0FBYSxNQUFiLENBQW9CLEtBQUssZ0JBQUwsQ0FBc0IsRUFBRSxDQUF4QixDQUFwQjtBQUNBLHFCQUFLLENBQUwsQ0FBTyxLQUFQLENBQWEsTUFBYixDQUFvQixLQUFLLGdCQUFMLENBQXNCLEVBQUUsQ0FBeEIsQ0FBcEI7O0FBRUEsb0JBQUksYUFBYyxLQUFLLFdBQUwsQ0FBaUIsT0FBakIsQ0FBbEI7QUFDQSxxQkFBSyxNQUFMLENBQVksTUFBWixFQUNLLElBREwsQ0FDVSxPQURWLEVBQ21CLFVBRG5CLEVBRUssSUFGTCxDQUVVLEdBRlYsRUFFZSxLQUFLLE9BQUwsR0FBZSxDQUY5QixFQUdLLElBSEwsQ0FHVSxHQUhWLEVBR2UsS0FBSyxPQUFMLEdBQWUsQ0FIOUIsRUFJSyxJQUpMLENBSVUsT0FKVixFQUltQixLQUFLLElBQUwsR0FBWSxLQUFLLE9BSnBDLEVBS0ssSUFMTCxDQUtVLFFBTFYsRUFLb0IsS0FBSyxJQUFMLEdBQVksS0FBSyxPQUxyQzs7QUFRQSxrQkFBRSxNQUFGLEdBQVcsWUFBVztBQUNsQix3QkFBSSxVQUFVLElBQWQ7QUFDQSx3QkFBSSxPQUFPLEtBQUssU0FBTCxDQUFlLFFBQWYsRUFDTixJQURNLENBQ0QsS0FBSyxJQURKLENBQVg7O0FBR0EseUJBQUssS0FBTCxHQUFhLE1BQWIsQ0FBb0IsUUFBcEI7O0FBRUEseUJBQUssSUFBTCxDQUFVLElBQVYsRUFBZ0IsVUFBQyxDQUFEO0FBQUEsK0JBQU8sS0FBSyxDQUFMLENBQU8sR0FBUCxDQUFXLENBQVgsRUFBYyxRQUFRLENBQXRCLENBQVA7QUFBQSxxQkFBaEIsRUFDSyxJQURMLENBQ1UsSUFEVixFQUNnQixVQUFDLENBQUQ7QUFBQSwrQkFBTyxLQUFLLENBQUwsQ0FBTyxHQUFQLENBQVcsQ0FBWCxFQUFjLFFBQVEsQ0FBdEIsQ0FBUDtBQUFBLHFCQURoQixFQUVLLElBRkwsQ0FFVSxHQUZWLEVBRWUsS0FBSyxNQUFMLENBQVksR0FBWixDQUFnQixNQUYvQjs7QUFJQSx3QkFBSSxLQUFLLEdBQUwsQ0FBUyxLQUFiLEVBQW9CO0FBQ2hCLDZCQUFLLEtBQUwsQ0FBVyxNQUFYLEVBQW1CLEtBQUssR0FBTCxDQUFTLEtBQTVCO0FBQ0g7O0FBRUQsd0JBQUcsS0FBSyxPQUFSLEVBQWdCO0FBQ1osNkJBQUssRUFBTCxDQUFRLFdBQVIsRUFBcUIsVUFBQyxDQUFELEVBQU87QUFDeEIsaUNBQUssT0FBTCxDQUFhLFVBQWIsR0FDSyxRQURMLENBQ2MsR0FEZCxFQUVLLEtBRkwsQ0FFVyxTQUZYLEVBRXNCLEVBRnRCO0FBR0EsZ0NBQUksT0FBTyxNQUFNLEtBQUssQ0FBTCxDQUFPLEtBQVAsQ0FBYSxDQUFiLEVBQWdCLFFBQVEsQ0FBeEIsQ0FBTixHQUFtQyxJQUFuQyxHQUF5QyxLQUFLLENBQUwsQ0FBTyxLQUFQLENBQWEsQ0FBYixFQUFnQixRQUFRLENBQXhCLENBQXpDLEdBQXNFLEdBQWpGO0FBQ0EsaUNBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsSUFBbEIsRUFDSyxLQURMLENBQ1csTUFEWCxFQUNvQixHQUFHLEtBQUgsQ0FBUyxLQUFULEdBQWlCLENBQWxCLEdBQXVCLElBRDFDLEVBRUssS0FGTCxDQUVXLEtBRlgsRUFFbUIsR0FBRyxLQUFILENBQVMsS0FBVCxHQUFpQixFQUFsQixHQUF3QixJQUYxQzs7QUFJQSxnQ0FBSSxRQUFRLEtBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsS0FBbkIsQ0FBeUIsQ0FBekIsQ0FBWjtBQUNBLGdDQUFHLFNBQVMsVUFBUSxDQUFwQixFQUF1QjtBQUNuQix3Q0FBTSxPQUFOO0FBQ0Esb0NBQUksUUFBUSxLQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLEtBQS9CO0FBQ0Esb0NBQUcsS0FBSCxFQUFTO0FBQ0wsNENBQU0sUUFBTSxJQUFaO0FBQ0g7QUFDRCx3Q0FBTSxLQUFOO0FBQ0g7QUFDRCxpQ0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixJQUFsQixFQUNLLEtBREwsQ0FDVyxNQURYLEVBQ29CLEdBQUcsS0FBSCxDQUFTLEtBQVQsR0FBaUIsQ0FBbEIsR0FBdUIsSUFEMUMsRUFFSyxLQUZMLENBRVcsS0FGWCxFQUVtQixHQUFHLEtBQUgsQ0FBUyxLQUFULEdBQWlCLEVBQWxCLEdBQXdCLElBRjFDO0FBR0gseUJBckJELEVBc0JLLEVBdEJMLENBc0JRLFVBdEJSLEVBc0JvQixVQUFDLENBQUQsRUFBTTtBQUNsQixpQ0FBSyxPQUFMLENBQWEsVUFBYixHQUNLLFFBREwsQ0FDYyxHQURkLEVBRUssS0FGTCxDQUVXLFNBRlgsRUFFc0IsQ0FGdEI7QUFHSCx5QkExQkw7QUEyQkg7O0FBRUQseUJBQUssSUFBTCxHQUFZLE1BQVo7QUFDSCxpQkE5Q0Q7QUErQ0Esa0JBQUUsTUFBRjtBQUVIOztBQUdELGlCQUFLLFlBQUw7QUFDSDs7OytCQUVNLEksRUFBTTs7QUFFVCxnR0FBYSxJQUFiO0FBQ0EsaUJBQUssSUFBTCxDQUFVLFFBQVYsQ0FBbUIsT0FBbkIsQ0FBMkI7QUFBQSx1QkFBSyxFQUFFLE1BQUYsRUFBTDtBQUFBLGFBQTNCO0FBQ0EsaUJBQUssWUFBTDtBQUNIOzs7a0NBRVMsSSxFQUFNO0FBQ1osZ0JBQUksT0FBTyxJQUFYO0FBQ0EsZ0JBQUksUUFBUSxHQUFHLEdBQUgsQ0FBTyxLQUFQLEdBQ1AsQ0FETyxDQUNMLEtBQUssSUFBTCxDQUFVLENBQVYsQ0FBWSxLQURQLEVBRVAsQ0FGTyxDQUVMLEtBQUssSUFBTCxDQUFVLENBQVYsQ0FBWSxLQUZQLEVBR1AsRUFITyxDQUdKLFlBSEksRUFHVSxVQUhWLEVBSVAsRUFKTyxDQUlKLE9BSkksRUFJSyxTQUpMLEVBS1AsRUFMTyxDQUtKLFVBTEksRUFLUSxRQUxSLENBQVo7O0FBT0EsaUJBQUssTUFBTCxDQUFZLEdBQVosRUFBaUIsSUFBakIsQ0FBc0IsS0FBdEI7O0FBR0EsZ0JBQUksU0FBSjs7O0FBR0EscUJBQVMsVUFBVCxDQUFvQixDQUFwQixFQUF1QjtBQUNuQixvQkFBSSxjQUFjLElBQWxCLEVBQXdCO0FBQ3BCLHVCQUFHLE1BQUgsQ0FBVSxTQUFWLEVBQXFCLElBQXJCLENBQTBCLE1BQU0sS0FBTixFQUExQjtBQUNBLHlCQUFLLElBQUwsQ0FBVSxDQUFWLENBQVksS0FBWixDQUFrQixNQUFsQixDQUF5QixLQUFLLElBQUwsQ0FBVSxnQkFBVixDQUEyQixFQUFFLENBQTdCLENBQXpCO0FBQ0EseUJBQUssSUFBTCxDQUFVLENBQVYsQ0FBWSxLQUFaLENBQWtCLE1BQWxCLENBQXlCLEtBQUssSUFBTCxDQUFVLGdCQUFWLENBQTJCLEVBQUUsQ0FBN0IsQ0FBekI7QUFDQSxnQ0FBWSxJQUFaO0FBQ0g7QUFDSjs7O0FBR0QscUJBQVMsU0FBVCxDQUFtQixDQUFuQixFQUFzQjtBQUNsQixvQkFBSSxJQUFJLE1BQU0sTUFBTixFQUFSO0FBQ0EscUJBQUssSUFBTCxDQUFVLFNBQVYsQ0FBb0IsUUFBcEIsRUFBOEIsT0FBOUIsQ0FBc0MsUUFBdEMsRUFBZ0QsVUFBVSxDQUFWLEVBQWE7QUFDekQsMkJBQU8sRUFBRSxDQUFGLEVBQUssQ0FBTCxJQUFVLEVBQUUsRUFBRSxDQUFKLENBQVYsSUFBb0IsRUFBRSxFQUFFLENBQUosSUFBUyxFQUFFLENBQUYsRUFBSyxDQUFMLENBQTdCLElBQ0EsRUFBRSxDQUFGLEVBQUssQ0FBTCxJQUFVLEVBQUUsRUFBRSxDQUFKLENBRFYsSUFDb0IsRUFBRSxFQUFFLENBQUosSUFBUyxFQUFFLENBQUYsRUFBSyxDQUFMLENBRHBDO0FBRUgsaUJBSEQ7QUFJSDs7QUFFRCxxQkFBUyxRQUFULEdBQW9CO0FBQ2hCLG9CQUFJLE1BQU0sS0FBTixFQUFKLEVBQW1CLEtBQUssSUFBTCxDQUFVLFNBQVYsQ0FBb0IsU0FBcEIsRUFBK0IsT0FBL0IsQ0FBdUMsUUFBdkMsRUFBaUQsS0FBakQ7QUFDdEI7QUFDSjs7O3VDQUVjOztBQUVYLG9CQUFRLEdBQVIsQ0FBWSxjQUFaO0FBQ0EsZ0JBQUksT0FBTyxLQUFLLElBQWhCOztBQUVBLGdCQUFJLFFBQVEsS0FBSyxHQUFMLENBQVMsYUFBckI7QUFDQSxnQkFBRyxDQUFDLE1BQU0sTUFBTixFQUFELElBQW1CLE1BQU0sTUFBTixHQUFlLE1BQWYsR0FBc0IsQ0FBNUMsRUFBOEM7QUFDMUMscUJBQUssVUFBTCxHQUFrQixLQUFsQjtBQUNIOztBQUVELGdCQUFHLENBQUMsS0FBSyxVQUFULEVBQW9CO0FBQ2hCLG9CQUFHLEtBQUssTUFBTCxJQUFlLEtBQUssTUFBTCxDQUFZLFNBQTlCLEVBQXdDO0FBQ3BDLHlCQUFLLE1BQUwsQ0FBWSxTQUFaLENBQXNCLE1BQXRCO0FBQ0g7QUFDRDtBQUNIOztBQUdELGdCQUFJLFVBQVUsS0FBSyxJQUFMLENBQVUsS0FBVixHQUFrQixLQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLE1BQW5EO0FBQ0EsZ0JBQUksVUFBVSxLQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLE1BQWpDOztBQUVBLGlCQUFLLE1BQUwsR0FBYyxtQkFBVyxLQUFLLEdBQWhCLEVBQXFCLEtBQUssSUFBMUIsRUFBZ0MsS0FBaEMsRUFBdUMsT0FBdkMsRUFBZ0QsT0FBaEQsQ0FBZDs7QUFFQSxnQkFBSSxlQUFlLEtBQUssTUFBTCxDQUFZLEtBQVosR0FDZCxVQURjLENBQ0gsS0FBSyxNQUFMLENBQVksTUFBWixDQUFtQixVQURoQixFQUVkLE1BRmMsQ0FFUCxVQUZPLEVBR2QsS0FIYyxDQUdSLEtBSFEsQ0FBbkI7O0FBS0EsaUJBQUssTUFBTCxDQUFZLFNBQVosQ0FDSyxJQURMLENBQ1UsWUFEVjtBQUVIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6WEw7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0lBRWEsaUIsV0FBQSxpQjs7Ozs7QUFpQ1QsK0JBQVksTUFBWixFQUFtQjtBQUFBOztBQUFBOztBQUFBLGNBL0JuQixRQStCbUIsR0EvQlQsTUFBSyxjQUFMLEdBQW9CLGFBK0JYO0FBQUEsY0E5Qm5CLE1BOEJtQixHQTlCWCxLQThCVztBQUFBLGNBN0JuQixXQTZCbUIsR0E3Qk4sSUE2Qk07QUFBQSxjQTVCbkIsVUE0Qm1CLEdBNUJSLElBNEJRO0FBQUEsY0EzQm5CLE1BMkJtQixHQTNCWjtBQUNILG1CQUFPLEVBREo7QUFFSCxvQkFBUSxFQUZMO0FBR0gsd0JBQVk7QUFIVCxTQTJCWTtBQUFBLGNBckJuQixDQXFCbUIsR0FyQmpCLEU7QUFDRSxtQkFBTyxHQURULEU7QUFFRSxpQkFBSyxDQUZQO0FBR0UsbUJBQU8sZUFBQyxDQUFELEVBQUksR0FBSjtBQUFBLHVCQUFZLEVBQUUsR0FBRixDQUFaO0FBQUEsYUFIVCxFO0FBSUUsb0JBQVEsUUFKVjtBQUtFLG1CQUFPO0FBTFQsU0FxQmlCO0FBQUEsY0FkbkIsQ0FjbUIsR0FkakIsRTtBQUNFLG1CQUFPLEdBRFQsRTtBQUVFLGlCQUFLLENBRlA7QUFHRSxtQkFBTyxlQUFDLENBQUQsRUFBSSxHQUFKO0FBQUEsdUJBQVksRUFBRSxHQUFGLENBQVo7QUFBQSxhQUhULEU7QUFJRSxvQkFBUSxNQUpWO0FBS0UsbUJBQU87QUFMVCxTQWNpQjtBQUFBLGNBUG5CLE1BT21CLEdBUFo7QUFDSCxpQkFBSyxDQURGO0FBRUgsbUJBQU8sZUFBQyxDQUFELEVBQUksR0FBSjtBQUFBLHVCQUFZLEVBQUUsR0FBRixDQUFaO0FBQUEsYUFGSixFO0FBR0gsbUJBQU87QUFISixTQU9ZO0FBQUEsY0FGbkIsVUFFbUIsR0FGUCxJQUVPOztBQUVmLFlBQUksY0FBSjtBQUNBLGNBQUssR0FBTCxHQUFTO0FBQ0wsb0JBQVEsQ0FESDtBQUVMLG1CQUFPO0FBQUEsdUJBQUssT0FBTyxNQUFQLENBQWMsS0FBZCxDQUFvQixDQUFwQixFQUF1QixPQUFPLE1BQVAsQ0FBYyxHQUFyQyxDQUFMO0FBQUEsYUFGRixFO0FBR0wsNkJBQWlCO0FBSFosU0FBVDs7QUFNQSxZQUFHLE1BQUgsRUFBVTtBQUNOLHlCQUFNLFVBQU4sUUFBdUIsTUFBdkI7QUFDSDs7QUFYYztBQWFsQixLOzs7Ozs7SUFHUSxXLFdBQUEsVzs7O0FBQ1QseUJBQVksbUJBQVosRUFBaUMsSUFBakMsRUFBdUMsTUFBdkMsRUFBK0M7QUFBQTs7QUFBQSw4RkFDckMsbUJBRHFDLEVBQ2hCLElBRGdCLEVBQ1YsSUFBSSxpQkFBSixDQUFzQixNQUF0QixDQURVO0FBRTlDOzs7O2tDQUVTLE0sRUFBTztBQUNiLG9HQUF1QixJQUFJLGlCQUFKLENBQXNCLE1BQXRCLENBQXZCO0FBQ0g7OzttQ0FFUztBQUNOO0FBQ0EsZ0JBQUksT0FBSyxJQUFUOztBQUVBLGdCQUFJLE9BQU8sS0FBSyxNQUFoQjs7QUFFQSxpQkFBSyxJQUFMLENBQVUsQ0FBVixHQUFZLEVBQVo7QUFDQSxpQkFBSyxJQUFMLENBQVUsQ0FBVixHQUFZLEVBQVo7QUFDQSxpQkFBSyxJQUFMLENBQVUsR0FBVixHQUFjO0FBQ1YsdUJBQU8sSTtBQURHLGFBQWQ7O0FBS0EsaUJBQUssSUFBTCxDQUFVLFVBQVYsR0FBdUIsS0FBSyxVQUE1QjtBQUNBLGdCQUFHLEtBQUssSUFBTCxDQUFVLFVBQWIsRUFBd0I7QUFDcEIscUJBQUssSUFBTCxDQUFVLE1BQVYsQ0FBaUIsS0FBakIsR0FBeUIsS0FBSyxNQUFMLENBQVksS0FBWixHQUFvQixLQUFLLE1BQUwsQ0FBWSxLQUFoQyxHQUFzQyxLQUFLLE1BQUwsQ0FBWSxNQUFaLEdBQW1CLENBQWxGO0FBQ0g7O0FBR0QsaUJBQUssZUFBTDs7QUFFQSxpQkFBSyxNQUFMO0FBQ0EsaUJBQUssTUFBTDs7QUFFQSxnQkFBRyxLQUFLLEdBQUwsQ0FBUyxlQUFaLEVBQTRCO0FBQ3hCLHFCQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsYUFBZCxHQUE4QixHQUFHLEtBQUgsQ0FBUyxLQUFLLEdBQUwsQ0FBUyxlQUFsQixHQUE5QjtBQUNIO0FBQ0QsZ0JBQUksYUFBYSxLQUFLLEdBQUwsQ0FBUyxLQUExQjtBQUNBLGdCQUFHLFVBQUgsRUFBYztBQUNWLHFCQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsVUFBZCxHQUEyQixVQUEzQjs7QUFFQSxvQkFBSSxPQUFPLFVBQVAsS0FBc0IsUUFBdEIsSUFBa0Msc0JBQXNCLE1BQTVELEVBQW1FO0FBQy9ELHlCQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsS0FBZCxHQUFzQixVQUF0QjtBQUNILGlCQUZELE1BRU0sSUFBRyxLQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsYUFBakIsRUFBK0I7QUFDakMseUJBQUssSUFBTCxDQUFVLEdBQVYsQ0FBYyxLQUFkLEdBQXNCO0FBQUEsK0JBQU0sS0FBSyxJQUFMLENBQVUsR0FBVixDQUFjLGFBQWQsQ0FBNEIsS0FBSyxJQUFMLENBQVUsR0FBVixDQUFjLFVBQWQsQ0FBeUIsQ0FBekIsQ0FBNUIsQ0FBTjtBQUFBLHFCQUF0QjtBQUNIO0FBR0osYUFWRCxNQVVLLENBRUo7O0FBR0QsbUJBQU8sSUFBUDtBQUNIOzs7aUNBRU87O0FBRUosZ0JBQUksT0FBTyxLQUFLLElBQWhCO0FBQ0EsZ0JBQUksSUFBSSxLQUFLLENBQWI7QUFDQSxnQkFBSSxPQUFPLEtBQUssTUFBTCxDQUFZLENBQXZCOzs7Ozs7OztBQVFBLGNBQUUsS0FBRixHQUFVO0FBQUEsdUJBQUssS0FBSyxLQUFMLENBQVcsQ0FBWCxFQUFjLEtBQUssR0FBbkIsQ0FBTDtBQUFBLGFBQVY7QUFDQSxjQUFFLEtBQUYsR0FBVSxHQUFHLEtBQUgsQ0FBUyxLQUFLLEtBQWQsSUFBdUIsS0FBdkIsQ0FBNkIsQ0FBQyxDQUFELEVBQUksS0FBSyxLQUFULENBQTdCLENBQVY7QUFDQSxjQUFFLEdBQUYsR0FBUTtBQUFBLHVCQUFLLEVBQUUsS0FBRixDQUFRLEVBQUUsS0FBRixDQUFRLENBQVIsQ0FBUixDQUFMO0FBQUEsYUFBUjtBQUNBLGNBQUUsSUFBRixHQUFTLEdBQUcsR0FBSCxDQUFPLElBQVAsR0FBYyxLQUFkLENBQW9CLEVBQUUsS0FBdEIsRUFBNkIsTUFBN0IsQ0FBb0MsS0FBSyxNQUF6QyxDQUFUO0FBQ0EsZ0JBQUksT0FBTyxLQUFLLElBQWhCO0FBQ0EsaUJBQUssQ0FBTCxDQUFPLEtBQVAsQ0FBYSxNQUFiLENBQW9CLENBQUMsR0FBRyxHQUFILENBQU8sSUFBUCxFQUFhLEtBQUssQ0FBTCxDQUFPLEtBQXBCLElBQTJCLENBQTVCLEVBQStCLEdBQUcsR0FBSCxDQUFPLElBQVAsRUFBYSxLQUFLLENBQUwsQ0FBTyxLQUFwQixJQUEyQixDQUExRCxDQUFwQjtBQUNBLGdCQUFHLEtBQUssTUFBTCxDQUFZLE1BQWYsRUFBdUI7QUFDbkIsa0JBQUUsSUFBRixDQUFPLFFBQVAsQ0FBZ0IsQ0FBQyxLQUFLLE1BQXRCO0FBQ0g7QUFFSjs7O2lDQUVROztBQUVMLGdCQUFJLE9BQU8sS0FBSyxJQUFoQjtBQUNBLGdCQUFJLElBQUksS0FBSyxDQUFiO0FBQ0EsZ0JBQUksT0FBTyxLQUFLLE1BQUwsQ0FBWSxDQUF2Qjs7Ozs7Ozs7QUFRQSxjQUFFLEtBQUYsR0FBVTtBQUFBLHVCQUFLLEtBQUssS0FBTCxDQUFXLENBQVgsRUFBYyxLQUFLLEdBQW5CLENBQUw7QUFBQSxhQUFWO0FBQ0EsY0FBRSxLQUFGLEdBQVUsR0FBRyxLQUFILENBQVMsS0FBSyxLQUFkLElBQXVCLEtBQXZCLENBQTZCLENBQUMsS0FBSyxNQUFOLEVBQWMsQ0FBZCxDQUE3QixDQUFWO0FBQ0EsY0FBRSxHQUFGLEdBQVE7QUFBQSx1QkFBSyxFQUFFLEtBQUYsQ0FBUSxFQUFFLEtBQUYsQ0FBUSxDQUFSLENBQVIsQ0FBTDtBQUFBLGFBQVI7QUFDQSxjQUFFLElBQUYsR0FBUyxHQUFHLEdBQUgsQ0FBTyxJQUFQLEdBQWMsS0FBZCxDQUFvQixFQUFFLEtBQXRCLEVBQTZCLE1BQTdCLENBQW9DLEtBQUssTUFBekMsQ0FBVDs7QUFFQSxnQkFBRyxLQUFLLE1BQUwsQ0FBWSxNQUFmLEVBQXNCO0FBQ2xCLGtCQUFFLElBQUYsQ0FBTyxRQUFQLENBQWdCLENBQUMsS0FBSyxLQUF0QjtBQUNIOztBQUdELGdCQUFJLE9BQU8sS0FBSyxJQUFoQjtBQUNBLGlCQUFLLENBQUwsQ0FBTyxLQUFQLENBQWEsTUFBYixDQUFvQixDQUFDLEdBQUcsR0FBSCxDQUFPLElBQVAsRUFBYSxLQUFLLENBQUwsQ0FBTyxLQUFwQixJQUEyQixDQUE1QixFQUErQixHQUFHLEdBQUgsQ0FBTyxJQUFQLEVBQWEsS0FBSyxDQUFMLENBQU8sS0FBcEIsSUFBMkIsQ0FBMUQsQ0FBcEI7QUFDSDs7O29DQUVVO0FBQ1AsZ0JBQUksT0FBTyxJQUFYO0FBQ0EsZ0JBQUksT0FBTyxLQUFLLElBQWhCO0FBQ0EsZ0JBQUksV0FBVyxLQUFLLE1BQUwsQ0FBWSxDQUEzQjtBQUNBLGdCQUFJLE9BQU8sS0FBSyxJQUFMLENBQVUsY0FBVixDQUF5QixPQUFLLEtBQUssV0FBTCxDQUFpQixRQUFqQixDQUFMLEdBQWdDLEdBQWhDLEdBQW9DLEtBQUssV0FBTCxDQUFpQixNQUFqQixDQUFwQyxJQUE4RCxLQUFLLE1BQUwsQ0FBWSxNQUFaLEdBQXFCLEVBQXJCLEdBQTBCLE1BQUksS0FBSyxXQUFMLENBQWlCLFdBQWpCLENBQTVGLENBQXpCLEVBQ04sSUFETSxDQUNELFdBREMsRUFDWSxpQkFBaUIsS0FBSyxNQUF0QixHQUErQixHQUQzQyxDQUFYOztBQUdBLGdCQUFJLFFBQVEsSUFBWjtBQUNBLGdCQUFJLEtBQUssaUJBQUwsRUFBSixFQUE4QjtBQUMxQix3QkFBUSxLQUFLLFVBQUwsR0FBa0IsSUFBbEIsQ0FBdUIsWUFBdkIsQ0FBUjtBQUNIOztBQUVELGtCQUFNLElBQU4sQ0FBVyxLQUFLLENBQUwsQ0FBTyxJQUFsQjs7QUFFQSxpQkFBSyxjQUFMLENBQW9CLFVBQVEsS0FBSyxXQUFMLENBQWlCLE9BQWpCLENBQTVCLEVBQ0ssSUFETCxDQUNVLFdBRFYsRUFDdUIsZUFBZSxLQUFLLEtBQUwsR0FBVyxDQUExQixHQUE4QixHQUE5QixHQUFvQyxLQUFLLE1BQUwsQ0FBWSxNQUFoRCxHQUF5RCxHQURoRixDO0FBQUEsYUFFSyxJQUZMLENBRVUsSUFGVixFQUVnQixNQUZoQixFQUdLLEtBSEwsQ0FHVyxhQUhYLEVBRzBCLFFBSDFCLEVBSUssSUFKTCxDQUlVLFNBQVMsS0FKbkI7QUFLSDs7O29DQUVVO0FBQ1AsZ0JBQUksT0FBTyxJQUFYO0FBQ0EsZ0JBQUksT0FBTyxLQUFLLElBQWhCO0FBQ0EsZ0JBQUksV0FBVyxLQUFLLE1BQUwsQ0FBWSxDQUEzQjtBQUNBLGdCQUFJLE9BQU8sS0FBSyxJQUFMLENBQVUsY0FBVixDQUF5QixPQUFLLEtBQUssV0FBTCxDQUFpQixRQUFqQixDQUFMLEdBQWdDLEdBQWhDLEdBQW9DLEtBQUssV0FBTCxDQUFpQixNQUFqQixDQUFwQyxJQUE4RCxLQUFLLE1BQUwsQ0FBWSxNQUFaLEdBQXFCLEVBQXJCLEdBQTBCLE1BQUksS0FBSyxXQUFMLENBQWlCLFdBQWpCLENBQTVGLENBQXpCLENBQVg7O0FBRUEsZ0JBQUksUUFBUSxJQUFaO0FBQ0EsZ0JBQUksS0FBSyxpQkFBTCxFQUFKLEVBQThCO0FBQzFCLHdCQUFRLEtBQUssVUFBTCxHQUFrQixJQUFsQixDQUF1QixZQUF2QixDQUFSO0FBQ0g7O0FBRUQsa0JBQU0sSUFBTixDQUFXLEtBQUssQ0FBTCxDQUFPLElBQWxCOztBQUVBLGlCQUFLLGNBQUwsQ0FBb0IsVUFBUSxLQUFLLFdBQUwsQ0FBaUIsT0FBakIsQ0FBNUIsRUFDSyxJQURMLENBQ1UsV0FEVixFQUN1QixlQUFjLENBQUMsS0FBSyxNQUFMLENBQVksSUFBM0IsR0FBaUMsR0FBakMsR0FBc0MsS0FBSyxNQUFMLEdBQVksQ0FBbEQsR0FBcUQsY0FENUUsQztBQUFBLGFBRUssSUFGTCxDQUVVLElBRlYsRUFFZ0IsS0FGaEIsRUFHSyxLQUhMLENBR1csYUFIWCxFQUcwQixRQUgxQixFQUlLLElBSkwsQ0FJVSxTQUFTLEtBSm5CO0FBS0g7OzsrQkFFTSxPLEVBQVE7QUFDWCwwRkFBYSxPQUFiO0FBQ0EsaUJBQUssU0FBTDtBQUNBLGlCQUFLLFNBQUw7O0FBRUEsaUJBQUssVUFBTDs7QUFFQSxpQkFBSyxZQUFMO0FBQ0g7OztxQ0FFWTtBQUNULGdCQUFJLE9BQU8sSUFBWDtBQUNBLGdCQUFJLE9BQU8sS0FBSyxJQUFoQjtBQUNBLGdCQUFJLE9BQU8sS0FBSyxJQUFoQjtBQUNBLGdCQUFJLFdBQVcsS0FBSyxXQUFMLENBQWlCLEtBQWpCLENBQWY7QUFDQSxpQkFBSyxrQkFBTCxHQUEwQixLQUFLLFdBQUwsQ0FBaUIsZ0JBQWpCLENBQTFCOztBQUdBLGdCQUFJLGdCQUFnQixLQUFLLElBQUwsQ0FBVSxjQUFWLENBQXlCLE9BQU8sS0FBSyxrQkFBckMsQ0FBcEI7O0FBRUEsZ0JBQUksT0FBTyxjQUFjLFNBQWQsQ0FBd0IsTUFBTSxRQUE5QixFQUNOLElBRE0sQ0FDRCxJQURDLENBQVg7O0FBR0EsaUJBQUssS0FBTCxHQUFhLE1BQWIsQ0FBb0IsUUFBcEIsRUFDSyxJQURMLENBQ1UsT0FEVixFQUNtQixRQURuQjs7QUFHQSxnQkFBSSxRQUFRLElBQVo7QUFDQSxnQkFBSSxLQUFLLGlCQUFMLEVBQUosRUFBOEI7QUFDMUIsd0JBQVEsS0FBSyxVQUFMLEVBQVI7QUFDSDs7QUFFRCxrQkFBTSxJQUFOLENBQVcsR0FBWCxFQUFnQixLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLE1BQWhDLEVBQ0ssSUFETCxDQUNVLElBRFYsRUFDZ0IsS0FBSyxDQUFMLENBQU8sR0FEdkIsRUFFSyxJQUZMLENBRVUsSUFGVixFQUVnQixLQUFLLENBQUwsQ0FBTyxHQUZ2Qjs7QUFJQSxnQkFBSSxLQUFLLE9BQVQsRUFBa0I7QUFDZCxxQkFBSyxFQUFMLENBQVEsV0FBUixFQUFxQixhQUFLO0FBQ3RCLHlCQUFLLE9BQUwsQ0FBYSxVQUFiLEdBQ0ssUUFETCxDQUNjLEdBRGQsRUFFSyxLQUZMLENBRVcsU0FGWCxFQUVzQixFQUZ0QjtBQUdBLHdCQUFJLE9BQU8sTUFBTSxLQUFLLENBQUwsQ0FBTyxLQUFQLENBQWEsQ0FBYixDQUFOLEdBQXdCLElBQXhCLEdBQStCLEtBQUssQ0FBTCxDQUFPLEtBQVAsQ0FBYSxDQUFiLENBQS9CLEdBQWlELEdBQTVEO0FBQ0Esd0JBQUksUUFBUSxLQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLEtBQW5CLENBQXlCLENBQXpCLEVBQTRCLEtBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsR0FBL0MsQ0FBWjtBQUNBLHdCQUFJLFNBQVMsVUFBVSxDQUF2QixFQUEwQjtBQUN0QixnQ0FBUSxPQUFSO0FBQ0EsNEJBQUksUUFBUSxLQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLEtBQS9CO0FBQ0EsNEJBQUksS0FBSixFQUFXO0FBQ1Asb0NBQVEsUUFBUSxJQUFoQjtBQUNIO0FBQ0QsZ0NBQVEsS0FBUjtBQUNIO0FBQ0QseUJBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsSUFBbEIsRUFDSyxLQURMLENBQ1csTUFEWCxFQUNvQixHQUFHLEtBQUgsQ0FBUyxLQUFULEdBQWlCLENBQWxCLEdBQXVCLElBRDFDLEVBRUssS0FGTCxDQUVXLEtBRlgsRUFFbUIsR0FBRyxLQUFILENBQVMsS0FBVCxHQUFpQixFQUFsQixHQUF3QixJQUYxQztBQUdILGlCQWpCRCxFQWtCSyxFQWxCTCxDQWtCUSxVQWxCUixFQWtCb0IsYUFBSztBQUNqQix5QkFBSyxPQUFMLENBQWEsVUFBYixHQUNLLFFBREwsQ0FDYyxHQURkLEVBRUssS0FGTCxDQUVXLFNBRlgsRUFFc0IsQ0FGdEI7QUFHSCxpQkF0Qkw7QUF1Qkg7O0FBRUQsZ0JBQUksS0FBSyxHQUFMLENBQVMsS0FBYixFQUFvQjtBQUNoQixxQkFBSyxLQUFMLENBQVcsTUFBWCxFQUFtQixLQUFLLEdBQUwsQ0FBUyxLQUE1QjtBQUNIOztBQUVELGlCQUFLLElBQUwsR0FBWSxNQUFaO0FBQ0g7Ozt1Q0FFYzs7QUFHWCxnQkFBSSxPQUFPLEtBQUssSUFBaEI7O0FBRUEsZ0JBQUksUUFBUSxLQUFLLEdBQUwsQ0FBUyxhQUFyQjtBQUNBLGdCQUFHLENBQUMsTUFBTSxNQUFOLEVBQUQsSUFBbUIsTUFBTSxNQUFOLEdBQWUsTUFBZixHQUFzQixDQUE1QyxFQUE4QztBQUMxQyxxQkFBSyxVQUFMLEdBQWtCLEtBQWxCO0FBQ0g7O0FBRUQsZ0JBQUcsQ0FBQyxLQUFLLFVBQVQsRUFBb0I7QUFDaEIsb0JBQUcsS0FBSyxNQUFMLElBQWUsS0FBSyxNQUFMLENBQVksU0FBOUIsRUFBd0M7QUFDcEMseUJBQUssTUFBTCxDQUFZLFNBQVosQ0FBc0IsTUFBdEI7QUFDSDtBQUNEO0FBQ0g7O0FBR0QsZ0JBQUksVUFBVSxLQUFLLElBQUwsQ0FBVSxLQUFWLEdBQWtCLEtBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsTUFBbkQ7QUFDQSxnQkFBSSxVQUFVLEtBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsTUFBakM7O0FBRUEsaUJBQUssTUFBTCxHQUFjLG1CQUFXLEtBQUssR0FBaEIsRUFBcUIsS0FBSyxJQUExQixFQUFnQyxLQUFoQyxFQUF1QyxPQUF2QyxFQUFnRCxPQUFoRCxDQUFkOztBQUVBLGdCQUFJLGVBQWUsS0FBSyxNQUFMLENBQVksS0FBWixHQUNkLFVBRGMsQ0FDSCxLQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLFVBRGhCLEVBRWQsTUFGYyxDQUVQLFVBRk8sRUFHZCxLQUhjLENBR1IsS0FIUSxDQUFuQjs7QUFLQSxpQkFBSyxNQUFMLENBQVksU0FBWixDQUNLLElBREwsQ0FDVSxZQURWO0FBRUg7Ozs7Ozs7Ozs7OztRQ2pNVyxNLEdBQUEsTTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFuQmhCLElBQUksY0FBYyxDQUFsQixDOztBQUVBLFNBQVMsV0FBVCxDQUFzQixFQUF0QixFQUEwQixFQUExQixFQUE4QjtBQUM3QixLQUFJLE1BQU0sQ0FBTixJQUFXLEtBQUssR0FBTCxDQUFTLEVBQVQsSUFBZSxLQUFLLEdBQUwsQ0FBUyxRQUFRLEVBQVIsQ0FBVCxDQUFmLElBQXdDLENBQXZELEVBQTBEO0FBQ3pELFFBQU0saUJBQU4sQztBQUNBO0FBQ0QsS0FBSSxNQUFNLENBQU4sSUFBVyxLQUFLLENBQXBCLEVBQXVCO0FBQ3RCLFFBQU0saUJBQU47QUFDQTtBQUNELFFBQU8saUJBQWlCLFdBQVcsS0FBRyxDQUFkLEVBQWlCLEtBQUcsQ0FBcEIsQ0FBakIsQ0FBUDtBQUNBOztBQUVELFNBQVMsTUFBVCxDQUFpQixFQUFqQixFQUFxQjtBQUNwQixLQUFJLEtBQUssQ0FBTCxJQUFVLE1BQU0sQ0FBcEIsRUFBdUI7QUFDdEIsUUFBTSxpQkFBTjtBQUNBO0FBQ0QsUUFBTyxpQkFBaUIsTUFBTSxLQUFHLENBQVQsQ0FBakIsQ0FBUDtBQUNBOztBQUVNLFNBQVMsTUFBVCxDQUFpQixFQUFqQixFQUFxQixFQUFyQixFQUF5QjtBQUMvQixLQUFJLE1BQU0sQ0FBTixJQUFXLEtBQUssR0FBTCxDQUFTLEVBQVQsSUFBZSxLQUFLLEdBQUwsQ0FBUyxRQUFRLEVBQVIsQ0FBVCxDQUFmLElBQXdDLENBQXZELEVBQTBEO0FBQ3pELFFBQU0saUJBQU47QUFDQTtBQUNELEtBQUksTUFBTSxDQUFOLElBQVcsTUFBTSxDQUFyQixFQUF3QjtBQUN2QixRQUFNLGlCQUFOO0FBQ0E7QUFDRCxRQUFPLGlCQUFpQixNQUFNLEtBQUcsQ0FBVCxFQUFZLEtBQUcsQ0FBZixDQUFqQixDQUFQO0FBQ0E7O0FBRUQsU0FBUyxNQUFULENBQWlCLEVBQWpCLEVBQXFCLEVBQXJCLEVBQXlCLEVBQXpCLEVBQTZCO0FBQzVCLEtBQUssTUFBSSxDQUFMLElBQWEsS0FBSyxHQUFMLENBQVMsRUFBVCxJQUFjLEtBQUssR0FBTCxDQUFTLFFBQVEsRUFBUixDQUFULENBQWYsSUFBd0MsQ0FBeEQsRUFBNEQ7QUFDM0QsUUFBTSxpQkFBTixDO0FBQ0E7QUFDRCxLQUFLLE1BQUksQ0FBTCxJQUFhLEtBQUssR0FBTCxDQUFTLEVBQVQsSUFBYyxLQUFLLEdBQUwsQ0FBUyxRQUFRLEVBQVIsQ0FBVCxDQUFmLElBQXdDLENBQXhELEVBQTREO0FBQzNELFFBQU0saUJBQU4sQztBQUNBO0FBQ0QsS0FBSyxNQUFJLENBQUwsSUFBWSxLQUFHLENBQW5CLEVBQXVCO0FBQ3RCLFFBQU0saUJBQU47QUFDQTtBQUNELFFBQU8saUJBQWlCLE1BQU0sS0FBRyxDQUFULEVBQVksS0FBRyxDQUFmLEVBQWtCLEtBQUcsQ0FBckIsQ0FBakIsQ0FBUDtBQUNBOztBQUVELFNBQVMsS0FBVCxDQUFnQixFQUFoQixFQUFvQjtBQUNuQixRQUFPLGlCQUFpQixVQUFVLEtBQUcsQ0FBYixDQUFqQixDQUFQO0FBQ0E7O0FBRUQsU0FBUyxVQUFULENBQXFCLEVBQXJCLEVBQXdCLEVBQXhCLEVBQTRCO0FBQzNCLEtBQUssTUFBTSxDQUFQLElBQWUsS0FBSyxHQUFMLENBQVMsRUFBVCxJQUFnQixLQUFLLEdBQUwsQ0FBUyxRQUFRLEVBQVIsQ0FBVCxDQUFqQixJQUE0QyxDQUE5RCxFQUFrRTtBQUNqRSxRQUFNLGlCQUFOLEM7QUFDQTtBQUNELFFBQU8saUJBQWlCLGVBQWUsS0FBRyxDQUFsQixFQUFxQixLQUFHLENBQXhCLENBQWpCLENBQVA7QUFDQTs7QUFFRCxTQUFTLEtBQVQsQ0FBZ0IsRUFBaEIsRUFBb0IsRUFBcEIsRUFBd0I7QUFDdkIsS0FBSyxNQUFNLENBQVAsSUFBZSxLQUFLLEdBQUwsQ0FBUyxFQUFULElBQWUsS0FBSyxHQUFMLENBQVMsUUFBUSxFQUFSLENBQVQsQ0FBaEIsSUFBeUMsQ0FBM0QsRUFBK0Q7QUFDOUQsUUFBTSxpQkFBTixDO0FBQ0E7QUFDRCxRQUFPLGlCQUFpQixVQUFVLEtBQUcsQ0FBYixFQUFnQixLQUFHLENBQW5CLENBQWpCLENBQVA7QUFDQTs7QUFFRCxTQUFTLEtBQVQsQ0FBZ0IsRUFBaEIsRUFBb0IsRUFBcEIsRUFBd0IsRUFBeEIsRUFBNEI7QUFDM0IsS0FBSyxNQUFJLENBQUwsSUFBYSxLQUFLLEdBQUwsQ0FBUyxFQUFULElBQWMsS0FBSyxHQUFMLENBQVMsUUFBUSxFQUFSLENBQVQsQ0FBZixJQUF3QyxDQUF4RCxFQUE0RDtBQUMzRCxRQUFNLGlCQUFOLEM7QUFDQTtBQUNELEtBQUssTUFBSSxDQUFMLElBQWEsS0FBSyxHQUFMLENBQVMsRUFBVCxJQUFjLEtBQUssR0FBTCxDQUFTLFFBQVEsRUFBUixDQUFULENBQWYsSUFBd0MsQ0FBeEQsRUFBNEQ7QUFDM0QsUUFBTSxpQkFBTixDO0FBQ0E7QUFDRCxRQUFPLGlCQUFpQixVQUFVLEtBQUcsQ0FBYixFQUFnQixLQUFHLENBQW5CLEVBQXNCLEtBQUcsQ0FBekIsQ0FBakIsQ0FBUDtBQUNBOztBQUdELFNBQVMsU0FBVCxDQUFvQixFQUFwQixFQUF3QixFQUF4QixFQUE0QixFQUE1QixFQUFnQztBQUMvQixLQUFJLEVBQUo7O0FBRUEsS0FBSSxNQUFJLENBQVIsRUFBVztBQUNWLE9BQUcsQ0FBSDtBQUNBLEVBRkQsTUFFTyxJQUFJLEtBQUssQ0FBTCxJQUFVLENBQWQsRUFBaUI7QUFDdkIsTUFBSSxLQUFLLE1BQU0sS0FBSyxLQUFLLEVBQWhCLENBQVQ7QUFDQSxNQUFJLEtBQUssQ0FBVDtBQUNBLE9BQUssSUFBSSxLQUFLLEtBQUssQ0FBbkIsRUFBc0IsTUFBTSxDQUE1QixFQUErQixNQUFNLENBQXJDLEVBQXdDO0FBQ3ZDLFFBQUssSUFBSSxDQUFDLEtBQUssRUFBTCxHQUFVLENBQVgsSUFBZ0IsRUFBaEIsR0FBcUIsRUFBckIsR0FBMEIsRUFBbkM7QUFDQTtBQUNELE9BQUssSUFBSSxLQUFLLEdBQUwsQ0FBVSxJQUFJLEVBQWQsRUFBb0IsS0FBSyxDQUFOLEdBQVcsRUFBOUIsQ0FBVDtBQUNBLEVBUE0sTUFPQSxJQUFJLEtBQUssQ0FBTCxJQUFVLENBQWQsRUFBaUI7QUFDdkIsTUFBSSxLQUFLLEtBQUssRUFBTCxJQUFXLEtBQUssS0FBSyxFQUFyQixDQUFUO0FBQ0EsTUFBSSxLQUFLLENBQVQ7QUFDQSxPQUFLLElBQUksS0FBSyxLQUFLLENBQW5CLEVBQXNCLE1BQU0sQ0FBNUIsRUFBK0IsTUFBTSxDQUFyQyxFQUF3QztBQUN2QyxRQUFLLElBQUksQ0FBQyxLQUFLLEVBQUwsR0FBVSxDQUFYLElBQWdCLEVBQWhCLEdBQXFCLEVBQXJCLEdBQTBCLEVBQW5DO0FBQ0E7QUFDRCxPQUFLLEtBQUssR0FBTCxDQUFVLElBQUksRUFBZCxFQUFvQixLQUFLLENBQXpCLElBQStCLEVBQXBDO0FBQ0EsRUFQTSxNQU9BO0FBQ04sTUFBSSxLQUFLLEtBQUssS0FBTCxDQUFXLEtBQUssSUFBTCxDQUFVLEtBQUssRUFBTCxHQUFVLEVBQXBCLENBQVgsRUFBb0MsQ0FBcEMsQ0FBVDtBQUNBLE1BQUksS0FBSyxLQUFLLEdBQUwsQ0FBUyxLQUFLLEdBQUwsQ0FBUyxFQUFULENBQVQsRUFBdUIsQ0FBdkIsQ0FBVDtBQUNBLE1BQUksS0FBTSxNQUFNLENBQVAsR0FBWSxDQUFaLEdBQWdCLENBQXpCO0FBQ0EsT0FBSyxJQUFJLEtBQUssS0FBSyxDQUFuQixFQUFzQixNQUFNLENBQTVCLEVBQStCLE1BQU0sQ0FBckMsRUFBd0M7QUFDdkMsUUFBSyxJQUFJLENBQUMsS0FBSyxFQUFMLEdBQVUsQ0FBWCxJQUFnQixFQUFoQixHQUFxQixFQUFyQixHQUEwQixFQUFuQztBQUNBO0FBQ0QsTUFBSSxLQUFLLEtBQUssRUFBZDtBQUNBLE9BQUssSUFBSSxLQUFLLENBQWQsRUFBaUIsTUFBTSxLQUFLLENBQTVCLEVBQStCLE1BQU0sQ0FBckMsRUFBd0M7QUFDdkMsU0FBTSxDQUFDLEtBQUssQ0FBTixJQUFXLEVBQWpCO0FBQ0E7QUFDRCxNQUFJLE1BQU0sSUFBSSxFQUFKLEdBQVMsS0FBSyxHQUFMLENBQVMsRUFBVCxDQUFULEdBQXdCLEtBQUssR0FBTCxDQUFTLEtBQUssR0FBTCxDQUFTLEVBQVQsQ0FBVCxFQUF1QixFQUF2QixDQUF4QixHQUFxRCxFQUEvRDs7QUFFQSxPQUFLLEtBQUssR0FBTCxDQUFTLEtBQUssR0FBTCxDQUFTLEVBQVQsQ0FBVCxFQUF1QixDQUF2QixDQUFMO0FBQ0EsT0FBTSxNQUFNLENBQVAsR0FBWSxDQUFaLEdBQWdCLENBQXJCO0FBQ0EsT0FBSyxJQUFJLEtBQUssS0FBRyxDQUFqQixFQUFvQixNQUFNLENBQTFCLEVBQTZCLE1BQU0sQ0FBbkMsRUFBc0M7QUFDckMsUUFBSyxJQUFJLENBQUMsS0FBSyxDQUFOLElBQVcsRUFBWCxHQUFnQixFQUFoQixHQUFxQixFQUE5QjtBQUNBO0FBQ0QsT0FBSyxJQUFJLENBQUosRUFBTyxNQUFNLENBQU4sR0FBVSxJQUFJLEVBQUosR0FBUyxLQUFLLEVBQXhCLEdBQ1QsSUFBSSxLQUFLLEVBQVQsR0FBYyxLQUFLLEdBQUwsQ0FBUyxFQUFULENBQWQsR0FBNkIsS0FBSyxHQUFMLENBQVMsRUFBVCxDQUE3QixHQUE0QyxFQUQxQyxDQUFMO0FBRUE7QUFDRCxRQUFPLEVBQVA7QUFDQTs7QUFHRCxTQUFTLGNBQVQsQ0FBeUIsRUFBekIsRUFBNEIsRUFBNUIsRUFBZ0M7QUFDL0IsS0FBSSxFQUFKOztBQUVBLEtBQUksTUFBTSxDQUFWLEVBQWE7QUFDWixPQUFLLENBQUw7QUFDQSxFQUZELE1BRU8sSUFBSSxLQUFLLEdBQVQsRUFBYztBQUNwQixPQUFLLFVBQVUsQ0FBQyxLQUFLLEdBQUwsQ0FBVSxLQUFLLEVBQWYsRUFBb0IsSUFBRSxDQUF0QixLQUNYLElBQUksSUFBRSxDQUFGLEdBQUksRUFERyxDQUFELElBQ0ssS0FBSyxJQUFMLENBQVUsSUFBRSxDQUFGLEdBQUksRUFBZCxDQURmLENBQUw7QUFFQSxFQUhNLE1BR0EsSUFBSSxLQUFLLEdBQVQsRUFBYztBQUNwQixPQUFLLENBQUw7QUFDQSxFQUZNLE1BRUE7QUFDTixNQUFJLEVBQUo7QUFDYyxNQUFJLEVBQUo7QUFDQSxNQUFJLEdBQUo7QUFDZCxNQUFLLEtBQUssQ0FBTixJQUFZLENBQWhCLEVBQW1CO0FBQ2xCLFFBQUssSUFBSSxVQUFVLEtBQUssSUFBTCxDQUFVLEVBQVYsQ0FBVixDQUFUO0FBQ0EsUUFBSyxLQUFLLElBQUwsQ0FBVSxJQUFFLEtBQUssRUFBakIsSUFBdUIsS0FBSyxHQUFMLENBQVMsQ0FBQyxFQUFELEdBQUksQ0FBYixDQUF2QixHQUF5QyxLQUFLLElBQUwsQ0FBVSxFQUFWLENBQTlDO0FBQ0EsU0FBTSxDQUFOO0FBQ0EsR0FKRCxNQUlPO0FBQ04sUUFBSyxLQUFLLEtBQUssR0FBTCxDQUFTLENBQUMsRUFBRCxHQUFJLENBQWIsQ0FBVjtBQUNBLFNBQU0sQ0FBTjtBQUNBOztBQUVELE9BQUssS0FBSyxHQUFWLEVBQWUsTUFBTyxLQUFHLENBQXpCLEVBQTZCLE1BQU0sQ0FBbkMsRUFBc0M7QUFDckMsU0FBTSxLQUFLLEVBQVg7QUFDQSxTQUFNLEVBQU47QUFDQTtBQUNEO0FBQ0QsUUFBTyxFQUFQO0FBQ0E7O0FBRUQsU0FBUyxLQUFULENBQWdCLEVBQWhCLEVBQW9CO0FBQ25CLEtBQUksS0FBSyxDQUFDLEtBQUssR0FBTCxDQUFTLElBQUksRUFBSixJQUFVLElBQUksRUFBZCxDQUFULENBQVY7QUFDQSxLQUFJLEtBQUssS0FBSyxJQUFMLENBQ1IsTUFBTSxjQUNGLE1BQU0sZUFDTCxNQUFNLENBQUMsY0FBRCxHQUNOLE1BQUssQ0FBQyxjQUFELEdBQ0osTUFBTSxpQkFDTixNQUFNLGtCQUNQLE1BQU0sQ0FBQyxhQUFELEdBQ0osTUFBTSxpQkFDUCxNQUFNLENBQUMsY0FBRCxHQUNKLE1BQU0sa0JBQ1AsS0FBSSxlQURILENBREYsQ0FEQyxDQURGLENBREMsQ0FEQSxDQURELENBREEsQ0FERCxDQURKLENBRFEsQ0FBVDtBQVlBLEtBQUksS0FBRyxFQUFQLEVBQ2UsS0FBSyxDQUFDLEVBQU47QUFDZixRQUFPLEVBQVA7QUFDQTs7QUFFRCxTQUFTLFNBQVQsQ0FBb0IsRUFBcEIsRUFBd0I7QUFDdkIsS0FBSSxLQUFLLENBQVQsQztBQUNBLEtBQUksUUFBUSxLQUFLLEdBQUwsQ0FBUyxFQUFULENBQVo7O0FBRUEsS0FBSSxRQUFRLEdBQVosRUFBaUI7QUFDaEIsT0FBSyxLQUFLLEdBQUwsQ0FBVSxJQUNkLFNBQVMsYUFDTCxTQUFTLGNBQ1IsU0FBUyxjQUNULFNBQVMsY0FDVixTQUFTLGNBQ1AsUUFBUSxVQURWLENBREMsQ0FEQSxDQURELENBREosQ0FESSxFQU00QixDQUFDLEVBTjdCLElBTWlDLENBTnRDO0FBT0EsRUFSRCxNQVFPLElBQUksU0FBUyxHQUFiLEVBQWtCO0FBQ3hCLE9BQUssSUFBSSxLQUFLLEVBQWQsRUFBa0IsTUFBTSxDQUF4QixFQUEyQixJQUEzQixFQUFpQztBQUNoQyxRQUFLLE1BQU0sUUFBUSxFQUFkLENBQUw7QUFDQTtBQUNELE9BQUssS0FBSyxHQUFMLENBQVMsQ0FBQyxFQUFELEdBQU0sS0FBTixHQUFjLEtBQXZCLElBQ0YsS0FBSyxJQUFMLENBQVUsSUFBSSxLQUFLLEVBQW5CLENBREUsSUFDd0IsUUFBUSxFQURoQyxDQUFMO0FBRUE7O0FBRUQsS0FBSSxLQUFHLENBQVAsRUFDUSxLQUFLLElBQUksRUFBVDtBQUNSLFFBQU8sRUFBUDtBQUNBOztBQUdELFNBQVMsS0FBVCxDQUFnQixFQUFoQixFQUFvQixFQUFwQixFQUF3Qjs7QUFFdkIsS0FBSSxNQUFNLENBQU4sSUFBVyxNQUFNLENBQXJCLEVBQXdCO0FBQ3ZCLFFBQU0saUJBQU47QUFDQTs7QUFFRCxLQUFJLE1BQU0sR0FBVixFQUFlO0FBQ2QsU0FBTyxDQUFQO0FBQ0EsRUFGRCxNQUVPLElBQUksS0FBSyxHQUFULEVBQWM7QUFDcEIsU0FBTyxDQUFFLE1BQU0sRUFBTixFQUFVLElBQUksRUFBZCxDQUFUO0FBQ0E7O0FBRUQsS0FBSSxLQUFLLE1BQU0sRUFBTixDQUFUO0FBQ0EsS0FBSSxNQUFNLEtBQUssR0FBTCxDQUFTLEVBQVQsRUFBYSxDQUFiLENBQVY7O0FBRUEsS0FBSSxLQUFLLENBQUMsTUFBTSxDQUFQLElBQVksQ0FBckI7QUFDQSxLQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBSixHQUFVLEVBQVgsSUFBaUIsR0FBakIsR0FBdUIsQ0FBeEIsSUFBNkIsRUFBdEM7QUFDQSxLQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFKLEdBQVUsRUFBWCxJQUFpQixHQUFqQixHQUF1QixFQUF4QixJQUE4QixHQUE5QixHQUFvQyxFQUFyQyxJQUEyQyxHQUFwRDtBQUNBLEtBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBTCxHQUFXLEdBQVosSUFBbUIsR0FBbkIsR0FBeUIsSUFBMUIsSUFBa0MsR0FBbEMsR0FBd0MsSUFBekMsSUFBaUQsR0FBakQsR0FBdUQsR0FBeEQsSUFDSixLQURMO0FBRUEsS0FBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUwsR0FBVyxHQUFaLElBQW1CLEdBQW5CLEdBQXlCLEdBQTFCLElBQWlDLEdBQWpDLEdBQXVDLElBQXhDLElBQWdELEdBQWhELEdBQXNELEdBQXZELElBQThELEdBQTlELEdBQ04sS0FESyxJQUNJLE1BRGI7O0FBR0EsS0FBSSxLQUFLLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssS0FBSyxFQUFYLElBQWlCLEVBQXZCLElBQTZCLEVBQW5DLElBQXlDLEVBQS9DLElBQXFELEVBQS9ELENBQVQ7O0FBRUEsS0FBSSxNQUFNLEtBQUssR0FBTCxDQUFTLE1BQU0sRUFBTixDQUFULEVBQW9CLENBQXBCLElBQXlCLENBQW5DLEVBQXNDO0FBQ3JDLE1BQUksTUFBSjtBQUNBLEtBQUc7QUFDRixPQUFJLE1BQU0sVUFBVSxFQUFWLEVBQWMsRUFBZCxDQUFWO0FBQ0EsT0FBSSxNQUFNLEtBQUssQ0FBZjtBQUNBLE9BQUksU0FBUyxDQUFDLE1BQU0sRUFBUCxJQUNWLEtBQUssR0FBTCxDQUFTLENBQUMsTUFBTSxLQUFLLEdBQUwsQ0FBUyxPQUFPLEtBQUssS0FBSyxFQUFqQixDQUFULENBQU4sR0FDVCxLQUFLLEdBQUwsQ0FBUyxLQUFHLEdBQUgsR0FBTyxDQUFQLEdBQVMsS0FBSyxFQUF2QixDQURTLEdBQ29CLENBRHBCLEdBRVQsQ0FBQyxJQUFFLEdBQUYsR0FBUSxJQUFFLEVBQVgsSUFBaUIsQ0FGVCxJQUVjLENBRnZCLENBREg7QUFJQSxTQUFNLE1BQU47QUFDQSxZQUFTLG1CQUFtQixNQUFuQixFQUEyQixLQUFLLEdBQUwsQ0FBUyxRQUFRLE1BQU0sS0FBSyxHQUFMLENBQVMsRUFBVCxDQUFOLElBQW9CLENBQTVCLENBQVQsQ0FBM0IsQ0FBVDtBQUNBLEdBVEQsUUFTVSxFQUFELElBQVMsVUFBVSxDQVQ1QjtBQVVBO0FBQ0QsUUFBTyxFQUFQO0FBQ0E7O0FBRUQsU0FBUyxTQUFULENBQW9CLEVBQXBCLEVBQXdCLEVBQXhCLEVBQTRCOztBQUUzQixLQUFJLEVBQUo7QUFDTyxLQUFJLEVBQUo7QUFDUCxLQUFJLEtBQUssS0FBSyxLQUFMLENBQVcsS0FBSyxLQUFLLElBQUwsQ0FBVSxFQUFWLENBQWhCLEVBQStCLENBQS9CLENBQVQ7QUFDQSxLQUFJLEtBQUssS0FBSyxHQUFMLENBQVMsS0FBSyxHQUFMLENBQVMsRUFBVCxDQUFULEVBQXVCLENBQXZCLENBQVQ7QUFDQSxLQUFJLEtBQUssQ0FBVDs7QUFFQSxNQUFLLElBQUksS0FBSyxLQUFHLENBQWpCLEVBQW9CLE1BQU0sQ0FBMUIsRUFBNkIsTUFBTSxDQUFuQyxFQUFzQztBQUNyQyxPQUFLLElBQUksQ0FBQyxLQUFHLENBQUosSUFBUyxFQUFULEdBQWMsRUFBZCxHQUFtQixFQUE1QjtBQUNBOztBQUVELEtBQUksS0FBSyxDQUFMLElBQVUsQ0FBZCxFQUFpQjtBQUNoQixPQUFLLEtBQUssR0FBTCxDQUFTLEVBQVQsSUFBYSxDQUFsQjtBQUNBLE9BQUssRUFBTDtBQUNBLEVBSEQsTUFHTztBQUNOLE9BQU0sTUFBTSxDQUFQLEdBQVksQ0FBWixHQUFnQixLQUFLLEdBQUwsQ0FBUyxFQUFULElBQWEsS0FBSyxHQUFMLENBQVMsRUFBVCxDQUFiLEdBQTBCLEtBQUssRUFBcEQ7QUFDQSxPQUFJLEtBQUssS0FBRyxLQUFLLEVBQWpCO0FBQ0E7QUFDRCxRQUFPLElBQUksQ0FBSixFQUFPLElBQUksRUFBSixHQUFTLEtBQUssRUFBckIsQ0FBUDtBQUNBOztBQUVELFNBQVMsS0FBVCxDQUFnQixFQUFoQixFQUFvQixFQUFwQixFQUF3QixFQUF4QixFQUE0QjtBQUMzQixLQUFJLEVBQUo7O0FBRUEsS0FBSSxNQUFNLENBQU4sSUFBVyxNQUFNLENBQXJCLEVBQXdCO0FBQ3ZCLFFBQU0saUJBQU47QUFDQTs7QUFFRCxLQUFJLE1BQU0sQ0FBVixFQUFhO0FBQ1osT0FBSyxDQUFMO0FBQ0EsRUFGRCxNQUVPLElBQUksTUFBTSxDQUFWLEVBQWE7QUFDbkIsT0FBSyxJQUFJLEtBQUssR0FBTCxDQUFTLE1BQU0sRUFBTixFQUFVLE1BQU0sS0FBSyxDQUFyQixDQUFULEVBQWtDLENBQWxDLENBQVQ7QUFDQSxFQUZNLE1BRUEsSUFBSSxNQUFNLENBQVYsRUFBYTtBQUNuQixPQUFLLEtBQUssR0FBTCxDQUFTLE1BQU0sRUFBTixFQUFVLEtBQUcsQ0FBYixDQUFULEVBQTBCLENBQTFCLENBQUw7QUFDQSxFQUZNLE1BRUEsSUFBSSxNQUFNLENBQVYsRUFBYTtBQUNuQixNQUFJLEtBQUssV0FBVyxFQUFYLEVBQWUsSUFBSSxFQUFuQixDQUFUO0FBQ0EsTUFBSSxLQUFLLEtBQUssQ0FBZDtBQUNBLE9BQUssS0FBSyxLQUFLLEVBQUwsSUFBVyxJQUNwQixDQUFDLENBQUMsS0FBSyxFQUFOLElBQVksQ0FBWixHQUNBLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBSixHQUFTLEtBQUssRUFBZixJQUFxQixFQUFyQixHQUEwQixNQUFNLElBQUksRUFBSixHQUFTLEVBQWYsQ0FBM0IsSUFBaUQsRUFBakQsR0FDQSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUosR0FBUyxLQUFLLEVBQWYsSUFBcUIsRUFBckIsR0FBMEIsTUFBTSxLQUFLLEVBQUwsR0FBVSxFQUFoQixDQUEzQixJQUFrRCxFQUFsRCxHQUNFLEtBQUssRUFBTCxJQUFXLElBQUksRUFBSixHQUFTLENBQXBCLENBREgsSUFFRSxFQUZGLEdBRUssRUFITixJQUlFLEVBTEgsSUFNRSxFQVBPLENBQUwsQ0FBTDtBQVFBLEVBWE0sTUFXQSxJQUFJLEtBQUssRUFBVCxFQUFhO0FBQ25CLE9BQUssSUFBSSxPQUFPLEVBQVAsRUFBVyxFQUFYLEVBQWUsSUFBSSxFQUFuQixDQUFUO0FBQ0EsRUFGTSxNQUVBO0FBQ04sT0FBSyxPQUFPLEVBQVAsRUFBVyxFQUFYLEVBQWUsRUFBZixDQUFMO0FBQ0E7QUFDRCxRQUFPLEVBQVA7QUFDQTs7QUFFRCxTQUFTLE1BQVQsQ0FBaUIsRUFBakIsRUFBcUIsRUFBckIsRUFBeUIsRUFBekIsRUFBNkI7QUFDNUIsS0FBSSxLQUFLLFdBQVcsRUFBWCxFQUFlLEVBQWYsQ0FBVDtBQUNBLEtBQUksTUFBTSxLQUFLLENBQWY7QUFDQSxLQUFJLEtBQUssS0FBSyxFQUFMLElBQ1AsSUFDQSxDQUFDLENBQUMsS0FBSyxHQUFOLElBQWEsQ0FBYixHQUNBLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBSixHQUFTLEtBQUssR0FBZixJQUFzQixFQUF0QixHQUEyQixPQUFPLElBQUksRUFBSixHQUFTLEVBQWhCLENBQTVCLElBQW1ELEVBQW5ELEdBQ0EsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFKLEdBQVMsS0FBSyxHQUFmLElBQXNCLEVBQXRCLEdBQTJCLE9BQU8sS0FBSyxFQUFMLEdBQVUsRUFBakIsQ0FBNUIsSUFBb0QsRUFBcEQsR0FDRSxNQUFNLEdBQU4sSUFBYSxJQUFJLEVBQUosR0FBUyxDQUF0QixDQURILElBQytCLEVBRC9CLEdBQ29DLEVBRnJDLElBRTJDLEVBSDVDLElBR2tELEVBTDNDLENBQVQ7QUFNQSxLQUFJLE1BQUo7QUFDQSxJQUFHO0FBQ0YsTUFBSSxLQUFLLEtBQUssR0FBTCxDQUNSLENBQUMsQ0FBQyxLQUFHLEVBQUosSUFBVSxLQUFLLEdBQUwsQ0FBUyxDQUFDLEtBQUcsRUFBSixLQUFXLEtBQUssRUFBTCxHQUFVLEVBQXJCLENBQVQsQ0FBVixHQUNFLENBQUMsS0FBSyxDQUFOLElBQVcsS0FBSyxHQUFMLENBQVMsRUFBVCxDQURiLEdBRUUsS0FBSyxHQUFMLENBQVMsS0FBSyxFQUFMLElBQVcsS0FBRyxFQUFkLENBQVQsQ0FGRixHQUdFLEtBQUssR0FBTCxDQUFTLElBQUksS0FBSyxFQUFsQixDQUhGLEdBSUUsQ0FBQyxJQUFFLEVBQUYsR0FBUSxJQUFFLEVBQVYsR0FBZSxLQUFHLEtBQUcsRUFBTixDQUFoQixJQUEyQixDQUo5QixJQUtFLENBTk0sQ0FBVDtBQU9BLFdBQVMsQ0FBQyxVQUFVLEVBQVYsRUFBYyxFQUFkLEVBQWtCLEVBQWxCLElBQXdCLEVBQXpCLElBQStCLEVBQXhDO0FBQ0EsUUFBTSxNQUFOO0FBQ0EsRUFWRCxRQVVTLEtBQUssR0FBTCxDQUFTLE1BQVQsSUFBaUIsSUFWMUI7QUFXQSxRQUFPLEVBQVA7QUFDQTs7QUFFRCxTQUFTLFVBQVQsQ0FBcUIsRUFBckIsRUFBeUIsRUFBekIsRUFBNkI7QUFDNUIsS0FBSSxFQUFKOztBQUVBLEtBQUssS0FBSyxDQUFOLElBQWEsTUFBTSxDQUF2QixFQUEyQjtBQUMxQixRQUFNLGlCQUFOO0FBQ0EsRUFGRCxNQUVPLElBQUksTUFBTSxDQUFWLEVBQVk7QUFDbEIsT0FBSyxDQUFMO0FBQ0EsRUFGTSxNQUVBLElBQUksTUFBTSxDQUFWLEVBQWE7QUFDbkIsT0FBSyxLQUFLLEdBQUwsQ0FBUyxNQUFNLEtBQUssQ0FBWCxDQUFULEVBQXdCLENBQXhCLENBQUw7QUFDQSxFQUZNLE1BRUEsSUFBSSxNQUFNLENBQVYsRUFBYTtBQUNuQixPQUFLLENBQUMsQ0FBRCxHQUFLLEtBQUssR0FBTCxDQUFTLEVBQVQsQ0FBVjtBQUNBLEVBRk0sTUFFQTtBQUNOLE1BQUksS0FBSyxNQUFNLEVBQU4sQ0FBVDtBQUNBLE1BQUksTUFBTSxLQUFLLEVBQWY7O0FBRUEsT0FBSyxJQUFJLENBQUosRUFBTyxLQUFLLEtBQUssSUFBTCxDQUFVLElBQUksRUFBZCxJQUFvQixFQUF6QixHQUNULElBQUUsQ0FBRixJQUFPLE1BQU0sQ0FBYixDQURTLEdBRVQsTUFBTSxNQUFNLENBQVosSUFBaUIsQ0FBakIsR0FBcUIsS0FBSyxJQUFMLENBQVUsSUFBSSxFQUFkLENBRlosR0FHVCxJQUFFLEdBQUYsR0FBUSxFQUFSLElBQWMsT0FBTyxJQUFHLEdBQUgsR0FBUyxDQUFoQixJQUFxQixFQUFuQyxDQUhFLENBQUw7O0FBS0EsTUFBSSxNQUFNLEdBQVYsRUFBZTtBQUNkLE9BQUksR0FBSjtBQUNxQixPQUFJLEdBQUo7QUFDQSxPQUFJLEVBQUo7QUFDckIsTUFBRztBQUNGLFVBQU0sRUFBTjtBQUNBLFFBQUksS0FBSyxDQUFULEVBQVk7QUFDWCxXQUFNLENBQU47QUFDQSxLQUZELE1BRU8sSUFBSSxLQUFHLEdBQVAsRUFBWTtBQUNsQixXQUFNLFVBQVUsQ0FBQyxLQUFLLEdBQUwsQ0FBVSxLQUFLLEVBQWYsRUFBcUIsSUFBRSxDQUF2QixLQUE4QixJQUFJLElBQUUsQ0FBRixHQUFJLEVBQXRDLENBQUQsSUFDYixLQUFLLElBQUwsQ0FBVSxJQUFFLENBQUYsR0FBSSxFQUFkLENBREcsQ0FBTjtBQUVBLEtBSE0sTUFHQSxJQUFJLEtBQUcsR0FBUCxFQUFZO0FBQ2xCLFdBQU0sQ0FBTjtBQUNBLEtBRk0sTUFFQTtBQUNOLFNBQUksR0FBSjtBQUNtQyxTQUFJLEVBQUo7QUFDbkMsU0FBSyxLQUFLLENBQU4sSUFBWSxDQUFoQixFQUFtQjtBQUNsQixZQUFNLElBQUksVUFBVSxLQUFLLElBQUwsQ0FBVSxFQUFWLENBQVYsQ0FBVjtBQUNBLFdBQUssS0FBSyxJQUFMLENBQVUsSUFBRSxLQUFLLEVBQWpCLElBQXVCLEtBQUssR0FBTCxDQUFTLENBQUMsRUFBRCxHQUFJLENBQWIsQ0FBdkIsR0FBeUMsS0FBSyxJQUFMLENBQVUsRUFBVixDQUE5QztBQUNBLFlBQU0sQ0FBTjtBQUNBLE1BSkQsTUFJTztBQUNOLFlBQU0sS0FBSyxLQUFLLEdBQUwsQ0FBUyxDQUFDLEVBQUQsR0FBSSxDQUFiLENBQVg7QUFDQSxZQUFNLENBQU47QUFDQTs7QUFFRCxVQUFLLElBQUksS0FBSyxHQUFkLEVBQW1CLE1BQU0sS0FBRyxDQUE1QixFQUErQixNQUFNLENBQXJDLEVBQXdDO0FBQ3ZDLFlBQU0sS0FBSyxFQUFYO0FBQ0EsYUFBTyxFQUFQO0FBQ0E7QUFDRDtBQUNELFNBQUssS0FBSyxHQUFMLENBQVMsQ0FBQyxDQUFDLEtBQUcsQ0FBSixJQUFTLEtBQUssR0FBTCxDQUFTLEtBQUcsRUFBWixDQUFULEdBQTJCLEtBQUssR0FBTCxDQUFTLElBQUUsS0FBSyxFQUFQLEdBQVUsRUFBbkIsQ0FBM0IsR0FDWixFQURZLEdBQ1AsRUFETyxHQUNGLElBQUUsRUFBRixHQUFLLENBREosSUFDUyxDQURsQixDQUFMO0FBRUEsVUFBTSxDQUFDLE1BQU0sRUFBUCxJQUFhLEVBQW5CO0FBQ0EsU0FBSyxtQkFBbUIsRUFBbkIsRUFBdUIsQ0FBdkIsQ0FBTDtBQUNBLElBOUJELFFBOEJVLEtBQUssRUFBTixJQUFjLEtBQUssR0FBTCxDQUFTLE1BQU0sRUFBZixJQUFxQixJQTlCNUM7QUErQkE7QUFDRDtBQUNELFFBQU8sRUFBUDtBQUNBOztBQUVELFNBQVMsS0FBVCxDQUFnQixFQUFoQixFQUFvQjtBQUNuQixRQUFPLEtBQUssR0FBTCxDQUFTLEVBQVQsSUFBZSxLQUFLLEdBQUwsQ0FBUyxFQUFULENBQXRCO0FBQ0E7O0FBRUQsU0FBUyxHQUFULEdBQWdCO0FBQ2YsS0FBSSxPQUFPLFVBQVUsQ0FBVixDQUFYO0FBQ0EsTUFBSyxJQUFJLEtBQUssQ0FBZCxFQUFpQixJQUFJLFVBQVUsTUFBL0IsRUFBdUMsR0FBdkMsRUFBNEM7QUFDN0IsTUFBSSxPQUFPLFVBQVUsRUFBVixDQUFYLEVBQ1EsT0FBTyxVQUFVLEVBQVYsQ0FBUDtBQUN0QjtBQUNELFFBQU8sSUFBUDtBQUNBOztBQUVELFNBQVMsR0FBVCxHQUFnQjtBQUNmLEtBQUksT0FBTyxVQUFVLENBQVYsQ0FBWDtBQUNBLE1BQUssSUFBSSxLQUFLLENBQWQsRUFBaUIsSUFBSSxVQUFVLE1BQS9CLEVBQXVDLEdBQXZDLEVBQTRDO0FBQzdCLE1BQUksT0FBTyxVQUFVLEVBQVYsQ0FBWCxFQUNRLE9BQU8sVUFBVSxFQUFWLENBQVA7QUFDdEI7QUFDRCxRQUFPLElBQVA7QUFDQTs7QUFFRCxTQUFTLFNBQVQsQ0FBb0IsRUFBcEIsRUFBd0I7QUFDdkIsUUFBTyxLQUFLLEdBQUwsQ0FBUyxRQUFRLE1BQU0sS0FBSyxHQUFMLENBQVMsRUFBVCxDQUFOLElBQXNCLFdBQTlCLENBQVQsQ0FBUDtBQUNBOztBQUVELFNBQVMsZ0JBQVQsQ0FBMkIsRUFBM0IsRUFBK0I7QUFDOUIsS0FBSSxFQUFKLEVBQVE7QUFDUCxTQUFPLG1CQUFtQixFQUFuQixFQUF1QixVQUFVLEVBQVYsQ0FBdkIsQ0FBUDtBQUNBLEVBRkQsTUFFTztBQUNOLFNBQU8sR0FBUDtBQUNBO0FBQ0Q7O0FBRUQsU0FBUyxrQkFBVCxDQUE2QixFQUE3QixFQUFpQyxFQUFqQyxFQUFxQztBQUM3QixNQUFLLEtBQUssS0FBSyxHQUFMLENBQVMsRUFBVCxFQUFhLEVBQWIsQ0FBVjtBQUNBLE1BQUssS0FBSyxLQUFMLENBQVcsRUFBWCxDQUFMO0FBQ0EsUUFBTyxLQUFLLEtBQUssR0FBTCxDQUFTLEVBQVQsRUFBYSxFQUFiLENBQVo7QUFDUDs7QUFFRCxTQUFTLE9BQVQsQ0FBa0IsRUFBbEIsRUFBc0I7QUFDZCxLQUFJLEtBQUssQ0FBVCxFQUNRLE9BQU8sS0FBSyxLQUFMLENBQVcsRUFBWCxDQUFQLENBRFIsS0FHUSxPQUFPLEtBQUssSUFBTCxDQUFVLEVBQVYsQ0FBUDtBQUNmOzs7OztBQ3BmRDs7QUFFQSxJQUFJLEtBQUssT0FBTyxPQUFQLENBQWUsZUFBZixHQUFnQyxFQUF6QztBQUNBLEdBQUcsaUJBQUgsR0FBdUIsUUFBUSw4REFBUixDQUF2QjtBQUNBLEdBQUcsZ0JBQUgsR0FBc0IsUUFBUSw2REFBUixDQUF0QjtBQUNBLEdBQUcsb0JBQUgsR0FBMEIsUUFBUSxrRUFBUixDQUExQjtBQUNBLEdBQUcsYUFBSCxHQUFtQixRQUFRLDBEQUFSLENBQW5CO0FBQ0EsR0FBRyxpQkFBSCxHQUF1QixRQUFRLDhEQUFSLENBQXZCO0FBQ0EsR0FBRyx1QkFBSCxHQUE2QixRQUFRLHFFQUFSLENBQTdCO0FBQ0EsR0FBRyxRQUFILEdBQWMsUUFBUSxvREFBUixDQUFkO0FBQ0EsR0FBRyxJQUFILEdBQVUsUUFBUSxnREFBUixDQUFWO0FBQ0EsR0FBRyxNQUFILEdBQVksUUFBUSxtREFBUixDQUFaO0FBQ0EsR0FBRyxhQUFILEdBQWtCO0FBQUEsV0FBTyxLQUFLLElBQUwsQ0FBVSxHQUFHLFFBQUgsQ0FBWSxHQUFaLEtBQWtCLElBQUksTUFBSixHQUFXLENBQTdCLENBQVYsQ0FBUDtBQUFBLENBQWxCOztBQUdBLEdBQUcsTUFBSCxHQUFXLFVBQUMsZ0JBQUQsRUFBbUIsbUJBQW5CLEVBQTJDOztBQUNsRCxXQUFPLHFDQUFPLGdCQUFQLEVBQXlCLG1CQUF6QixDQUFQO0FBQ0gsQ0FGRDs7Ozs7Ozs7Ozs7Ozs7Ozs7SUNmYSxLLFdBQUEsSzs7Ozs7Ozs7O21DQUdTLEcsRUFBSzs7QUFFbkIsZ0JBQUksUUFBUSxJQUFaO0FBQ0EsZ0JBQUksV0FBVyxFQUFmOztBQUdBLGdCQUFJLENBQUMsR0FBRCxJQUFRLFVBQVUsTUFBVixHQUFtQixDQUEzQixJQUFnQyxNQUFNLE9BQU4sQ0FBYyxVQUFVLENBQVYsQ0FBZCxDQUFwQyxFQUFpRTtBQUM3RCxzQkFBTSxFQUFOO0FBQ0g7QUFDRCxrQkFBTSxPQUFPLEVBQWI7O0FBRUEsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxVQUFVLE1BQTlCLEVBQXNDLEdBQXRDLEVBQTJDO0FBQ3ZDLG9CQUFJLFNBQVMsVUFBVSxDQUFWLENBQWI7QUFDQSxvQkFBSSxDQUFDLE1BQUwsRUFDSTs7QUFFSixxQkFBSyxJQUFJLEdBQVQsSUFBZ0IsTUFBaEIsRUFBd0I7QUFDcEIsd0JBQUksQ0FBQyxPQUFPLGNBQVAsQ0FBc0IsR0FBdEIsQ0FBTCxFQUFpQztBQUM3QjtBQUNIO0FBQ0Qsd0JBQUksVUFBVSxNQUFNLE9BQU4sQ0FBYyxJQUFJLEdBQUosQ0FBZCxDQUFkO0FBQ0Esd0JBQUksV0FBVyxNQUFNLFFBQU4sQ0FBZSxJQUFJLEdBQUosQ0FBZixDQUFmO0FBQ0Esd0JBQUksU0FBUyxNQUFNLFFBQU4sQ0FBZSxPQUFPLEdBQVAsQ0FBZixDQUFiOztBQUVBLHdCQUFJLFlBQVksQ0FBQyxPQUFiLElBQXdCLE1BQTVCLEVBQW9DO0FBQ2hDLDhCQUFNLFVBQU4sQ0FBaUIsSUFBSSxHQUFKLENBQWpCLEVBQTJCLE9BQU8sR0FBUCxDQUEzQjtBQUNILHFCQUZELE1BRU87QUFDSCw0QkFBSSxHQUFKLElBQVcsT0FBTyxHQUFQLENBQVg7QUFDSDtBQUNKO0FBQ0o7O0FBRUQsbUJBQU8sR0FBUDtBQUNIOzs7a0NBRWdCLE0sRUFBUSxNLEVBQVE7QUFDN0IsZ0JBQUksU0FBUyxPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLE1BQWxCLENBQWI7QUFDQSxnQkFBSSxNQUFNLGdCQUFOLENBQXVCLE1BQXZCLEtBQWtDLE1BQU0sZ0JBQU4sQ0FBdUIsTUFBdkIsQ0FBdEMsRUFBc0U7QUFDbEUsdUJBQU8sSUFBUCxDQUFZLE1BQVosRUFBb0IsT0FBcEIsQ0FBNEIsZUFBTztBQUMvQix3QkFBSSxNQUFNLGdCQUFOLENBQXVCLE9BQU8sR0FBUCxDQUF2QixDQUFKLEVBQXlDO0FBQ3JDLDRCQUFJLEVBQUUsT0FBTyxNQUFULENBQUosRUFDSSxPQUFPLE1BQVAsQ0FBYyxNQUFkLHNCQUF3QixHQUF4QixFQUE4QixPQUFPLEdBQVAsQ0FBOUIsR0FESixLQUdJLE9BQU8sR0FBUCxJQUFjLE1BQU0sU0FBTixDQUFnQixPQUFPLEdBQVAsQ0FBaEIsRUFBNkIsT0FBTyxHQUFQLENBQTdCLENBQWQ7QUFDUCxxQkFMRCxNQUtPO0FBQ0gsK0JBQU8sTUFBUCxDQUFjLE1BQWQsc0JBQXdCLEdBQXhCLEVBQThCLE9BQU8sR0FBUCxDQUE5QjtBQUNIO0FBQ0osaUJBVEQ7QUFVSDtBQUNELG1CQUFPLE1BQVA7QUFDSDs7OzhCQUVZLEMsRUFBRyxDLEVBQUc7QUFDZixnQkFBSSxJQUFJLEVBQVI7QUFBQSxnQkFBWSxJQUFJLEVBQUUsTUFBbEI7QUFBQSxnQkFBMEIsSUFBSSxFQUFFLE1BQWhDO0FBQUEsZ0JBQXdDLENBQXhDO0FBQUEsZ0JBQTJDLENBQTNDO0FBQ0EsaUJBQUssSUFBSSxDQUFDLENBQVYsRUFBYSxFQUFFLENBQUYsR0FBTSxDQUFuQjtBQUF1QixxQkFBSyxJQUFJLENBQUMsQ0FBVixFQUFhLEVBQUUsQ0FBRixHQUFNLENBQW5CO0FBQXVCLHNCQUFFLElBQUYsQ0FBTyxFQUFDLEdBQUcsRUFBRSxDQUFGLENBQUosRUFBVSxHQUFHLENBQWIsRUFBZ0IsR0FBRyxFQUFFLENBQUYsQ0FBbkIsRUFBeUIsR0FBRyxDQUE1QixFQUFQO0FBQXZCO0FBQXZCLGFBQ0EsT0FBTyxDQUFQO0FBQ0g7Ozt1Q0FFcUIsSSxFQUFNLFEsRUFBVSxZLEVBQWM7QUFDaEQsZ0JBQUksTUFBTSxFQUFWO0FBQ0EsZ0JBQUksS0FBSyxNQUFULEVBQWlCO0FBQ2Isb0JBQUksSUFBSSxLQUFLLENBQUwsQ0FBUjtBQUNBLG9CQUFJLGFBQWEsS0FBakIsRUFBd0I7QUFDcEIsMEJBQU0sRUFBRSxHQUFGLENBQU0sVUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQjtBQUN4QiwrQkFBTyxDQUFQO0FBQ0gscUJBRkssQ0FBTjtBQUdILGlCQUpELE1BSU8sSUFBSSxRQUFPLENBQVAseUNBQU8sQ0FBUCxPQUFhLFFBQWpCLEVBQTJCOztBQUU5Qix5QkFBSyxJQUFJLElBQVQsSUFBaUIsQ0FBakIsRUFBb0I7QUFDaEIsNEJBQUksQ0FBQyxFQUFFLGNBQUYsQ0FBaUIsSUFBakIsQ0FBTCxFQUE2Qjs7QUFFN0IsNEJBQUksSUFBSixDQUFTLElBQVQ7QUFDSDtBQUNKO0FBQ0o7QUFDRCxnQkFBSSxDQUFDLFlBQUwsRUFBbUI7QUFDZixvQkFBSSxRQUFRLElBQUksT0FBSixDQUFZLFFBQVosQ0FBWjtBQUNBLG9CQUFJLFFBQVEsQ0FBQyxDQUFiLEVBQWdCO0FBQ1osd0JBQUksTUFBSixDQUFXLEtBQVgsRUFBa0IsQ0FBbEI7QUFDSDtBQUNKO0FBQ0QsbUJBQU8sR0FBUDtBQUNIOzs7eUNBRXVCLEksRUFBTTtBQUMxQixtQkFBUSxRQUFRLFFBQU8sSUFBUCx5Q0FBTyxJQUFQLE9BQWdCLFFBQXhCLElBQW9DLENBQUMsTUFBTSxPQUFOLENBQWMsSUFBZCxDQUFyQyxJQUE0RCxTQUFTLElBQTdFO0FBQ0g7OztpQ0FFZSxDLEVBQUc7QUFDZixtQkFBTyxNQUFNLElBQU4sSUFBYyxRQUFPLENBQVAseUNBQU8sQ0FBUCxPQUFhLFFBQWxDO0FBQ0g7OztpQ0FFZSxDLEVBQUc7QUFDZixtQkFBTyxDQUFDLE1BQU0sQ0FBTixDQUFELElBQWEsT0FBTyxDQUFQLEtBQWEsUUFBakM7QUFDSDs7O21DQUVpQixDLEVBQUc7QUFDakIsbUJBQU8sT0FBTyxDQUFQLEtBQWEsVUFBcEI7QUFDSDs7OytCQUVhLEMsRUFBRTtBQUNaLG1CQUFPLE9BQU8sU0FBUCxDQUFpQixRQUFqQixDQUEwQixJQUExQixDQUErQixDQUEvQixNQUFzQyxlQUE3QztBQUNIOzs7aUNBRWUsQyxFQUFFO0FBQ2QsbUJBQU8sT0FBTyxDQUFQLEtBQWEsUUFBYixJQUF5QixhQUFhLE1BQTdDO0FBQ0g7OzsrQ0FFNkIsTSxFQUFRLFEsRUFBVSxTLEVBQVcsTSxFQUFRO0FBQy9ELGdCQUFJLGdCQUFnQixTQUFTLEtBQVQsQ0FBZSxVQUFmLENBQXBCO0FBQ0EsZ0JBQUksVUFBVSxPQUFPLFNBQVAsRUFBa0IsY0FBYyxLQUFkLEVBQWxCLEVBQXlDLE1BQXpDLENBQWQsQztBQUNBLG1CQUFPLGNBQWMsTUFBZCxHQUF1QixDQUE5QixFQUFpQztBQUM3QixvQkFBSSxtQkFBbUIsY0FBYyxLQUFkLEVBQXZCO0FBQ0Esb0JBQUksZUFBZSxjQUFjLEtBQWQsRUFBbkI7QUFDQSxvQkFBSSxxQkFBcUIsR0FBekIsRUFBOEI7QUFDMUIsOEJBQVUsUUFBUSxPQUFSLENBQWdCLFlBQWhCLEVBQThCLElBQTlCLENBQVY7QUFDSCxpQkFGRCxNQUVPLElBQUkscUJBQXFCLEdBQXpCLEVBQThCO0FBQ2pDLDhCQUFVLFFBQVEsSUFBUixDQUFhLElBQWIsRUFBbUIsWUFBbkIsQ0FBVjtBQUNIO0FBQ0o7QUFDRCxtQkFBTyxPQUFQO0FBQ0g7Ozt1Q0FFcUIsTSxFQUFRLFEsRUFBVSxNLEVBQVE7QUFDNUMsbUJBQU8sTUFBTSxzQkFBTixDQUE2QixNQUE3QixFQUFxQyxRQUFyQyxFQUErQyxRQUEvQyxFQUF5RCxNQUF6RCxDQUFQO0FBQ0g7Ozt1Q0FFcUIsTSxFQUFRLFEsRUFBVTtBQUNwQyxtQkFBTyxNQUFNLHNCQUFOLENBQTZCLE1BQTdCLEVBQXFDLFFBQXJDLEVBQStDLFFBQS9DLENBQVA7QUFDSDs7O3VDQUVxQixNLEVBQVEsUSxFQUFVLE8sRUFBUztBQUM3QyxnQkFBSSxZQUFZLE9BQU8sTUFBUCxDQUFjLFFBQWQsQ0FBaEI7QUFDQSxnQkFBSSxVQUFVLEtBQVYsRUFBSixFQUF1QjtBQUNuQixvQkFBSSxPQUFKLEVBQWE7QUFDVCwyQkFBTyxPQUFPLE1BQVAsQ0FBYyxPQUFkLENBQVA7QUFDSDtBQUNELHVCQUFPLE1BQU0sY0FBTixDQUFxQixNQUFyQixFQUE2QixRQUE3QixDQUFQO0FBRUg7QUFDRCxtQkFBTyxTQUFQO0FBQ0g7Ozt1Q0FFcUIsTSxFQUFRLFEsRUFBVSxNLEVBQVE7QUFDNUMsZ0JBQUksWUFBWSxPQUFPLE1BQVAsQ0FBYyxRQUFkLENBQWhCO0FBQ0EsZ0JBQUksVUFBVSxLQUFWLEVBQUosRUFBdUI7QUFDbkIsdUJBQU8sTUFBTSxjQUFOLENBQXFCLE1BQXJCLEVBQTZCLFFBQTdCLEVBQXVDLE1BQXZDLENBQVA7QUFDSDtBQUNELG1CQUFPLFNBQVA7QUFDSDs7O3VDQUVxQixHLEVBQUssVSxFQUFZLEssRUFBTyxFLEVBQUksRSxFQUFJLEUsRUFBSSxFLEVBQUk7QUFDMUQsZ0JBQUksT0FBTyxNQUFNLGNBQU4sQ0FBcUIsR0FBckIsRUFBMEIsTUFBMUIsQ0FBWDtBQUNBLGdCQUFJLGlCQUFpQixLQUFLLE1BQUwsQ0FBWSxnQkFBWixFQUNoQixJQURnQixDQUNYLElBRFcsRUFDTCxVQURLLENBQXJCOztBQUdBLDJCQUNLLElBREwsQ0FDVSxJQURWLEVBQ2dCLEtBQUssR0FEckIsRUFFSyxJQUZMLENBRVUsSUFGVixFQUVnQixLQUFLLEdBRnJCLEVBR0ssSUFITCxDQUdVLElBSFYsRUFHZ0IsS0FBSyxHQUhyQixFQUlLLElBSkwsQ0FJVSxJQUpWLEVBSWdCLEtBQUssR0FKckI7OztBQU9BLGdCQUFJLFFBQVEsZUFBZSxTQUFmLENBQXlCLE1BQXpCLEVBQ1AsSUFETyxDQUNGLEtBREUsQ0FBWjs7QUFHQSxrQkFBTSxLQUFOLEdBQWMsTUFBZCxDQUFxQixNQUFyQjs7QUFFQSxrQkFBTSxJQUFOLENBQVcsUUFBWCxFQUFxQixVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsdUJBQVUsS0FBSyxNQUFNLE1BQU4sR0FBZSxDQUFwQixDQUFWO0FBQUEsYUFBckIsRUFDSyxJQURMLENBQ1UsWUFEVixFQUN3QjtBQUFBLHVCQUFLLENBQUw7QUFBQSxhQUR4Qjs7QUFHQSxrQkFBTSxJQUFOLEdBQWEsTUFBYjtBQUNIOzs7K0JBa0JhO0FBQ1YscUJBQVMsRUFBVCxHQUFjO0FBQ1YsdUJBQU8sS0FBSyxLQUFMLENBQVcsQ0FBQyxJQUFJLEtBQUssTUFBTCxFQUFMLElBQXNCLE9BQWpDLEVBQ0YsUUFERSxDQUNPLEVBRFAsRUFFRixTQUZFLENBRVEsQ0FGUixDQUFQO0FBR0g7O0FBRUQsbUJBQU8sT0FBTyxJQUFQLEdBQWMsR0FBZCxHQUFvQixJQUFwQixHQUEyQixHQUEzQixHQUFpQyxJQUFqQyxHQUF3QyxHQUF4QyxHQUNILElBREcsR0FDSSxHQURKLEdBQ1UsSUFEVixHQUNpQixJQURqQixHQUN3QixJQUQvQjtBQUVIOzs7Ozs7OENBRzRCLFMsRUFBVyxVLEVBQVksSyxFQUFNO0FBQ3RELGdCQUFJLFVBQVUsVUFBVSxJQUFWLEVBQWQ7QUFDQSxvQkFBUSxXQUFSLEdBQW9CLFVBQXBCOztBQUVBLGdCQUFJLFNBQVMsQ0FBYjtBQUNBLGdCQUFJLGlCQUFpQixDQUFyQjs7QUFFQSxnQkFBSSxRQUFRLHFCQUFSLEtBQWdDLFFBQU0sTUFBMUMsRUFBaUQ7QUFDN0MscUJBQUssSUFBSSxJQUFFLFdBQVcsTUFBWCxHQUFrQixDQUE3QixFQUErQixJQUFFLENBQWpDLEVBQW1DLEtBQUcsQ0FBdEMsRUFBd0M7QUFDcEMsd0JBQUksUUFBUSxrQkFBUixDQUEyQixDQUEzQixFQUE2QixDQUE3QixJQUFnQyxjQUFoQyxJQUFnRCxRQUFNLE1BQTFELEVBQWlFO0FBQzdELGdDQUFRLFdBQVIsR0FBb0IsV0FBVyxTQUFYLENBQXFCLENBQXJCLEVBQXVCLENBQXZCLElBQTBCLEtBQTlDO0FBQ0EsK0JBQU8sSUFBUDtBQUNIO0FBQ0o7QUFDRCx3QkFBUSxXQUFSLEdBQW9CLEtBQXBCLEM7QUFDQSx1QkFBTyxJQUFQO0FBQ0g7QUFDRCxtQkFBTyxLQUFQO0FBQ0g7Ozt3REFFc0MsUyxFQUFXLFUsRUFBWSxLLEVBQU8sTyxFQUFRO0FBQ3pFLGdCQUFJLGlCQUFpQixNQUFNLHFCQUFOLENBQTRCLFNBQTVCLEVBQXVDLFVBQXZDLEVBQW1ELEtBQW5ELENBQXJCO0FBQ0EsZ0JBQUcsa0JBQWtCLE9BQXJCLEVBQTZCO0FBQ3pCLDBCQUFVLEVBQVYsQ0FBYSxXQUFiLEVBQTBCLFVBQVUsQ0FBVixFQUFhO0FBQ25DLDRCQUFRLFVBQVIsR0FDSyxRQURMLENBQ2MsR0FEZCxFQUVLLEtBRkwsQ0FFVyxTQUZYLEVBRXNCLEVBRnRCO0FBR0EsNEJBQVEsSUFBUixDQUFhLFVBQWIsRUFDSyxLQURMLENBQ1csTUFEWCxFQUNvQixHQUFHLEtBQUgsQ0FBUyxLQUFULEdBQWlCLENBQWxCLEdBQXVCLElBRDFDLEVBRUssS0FGTCxDQUVXLEtBRlgsRUFFbUIsR0FBRyxLQUFILENBQVMsS0FBVCxHQUFpQixFQUFsQixHQUF3QixJQUYxQztBQUdILGlCQVBEOztBQVNBLDBCQUFVLEVBQVYsQ0FBYSxVQUFiLEVBQXlCLFVBQVUsQ0FBVixFQUFhO0FBQ2xDLDRCQUFRLFVBQVIsR0FDSyxRQURMLENBQ2MsR0FEZCxFQUVLLEtBRkwsQ0FFVyxTQUZYLEVBRXNCLENBRnRCO0FBR0gsaUJBSkQ7QUFLSDtBQUVKOzs7b0NBRWtCLE8sRUFBUTtBQUN2QixtQkFBTyxPQUFPLGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDLElBQWpDLEVBQXVDLGdCQUF2QyxDQUF3RCxXQUF4RCxDQUFQO0FBQ0g7Ozs7OztBQXhQUSxLLENBQ0YsTSxHQUFTLGE7O0FBRFAsSyxDQWlMRixjLEdBQWlCLFVBQVUsTUFBVixFQUFrQixTQUFsQixFQUE2QjtBQUNqRCxXQUFRLFVBQVUsU0FBUyxVQUFVLEtBQVYsQ0FBZ0IsUUFBaEIsQ0FBVCxFQUFvQyxFQUFwQyxDQUFWLElBQXFELEdBQTdEO0FBQ0gsQzs7QUFuTFEsSyxDQXFMRixhLEdBQWdCLFVBQVUsS0FBVixFQUFpQixTQUFqQixFQUE0QjtBQUMvQyxXQUFRLFNBQVMsU0FBUyxVQUFVLEtBQVYsQ0FBZ0IsT0FBaEIsQ0FBVCxFQUFtQyxFQUFuQyxDQUFULElBQW1ELEdBQTNEO0FBQ0gsQzs7QUF2TFEsSyxDQXlMRixlLEdBQWtCLFVBQVUsTUFBVixFQUFrQixTQUFsQixFQUE2QixNQUE3QixFQUFxQztBQUMxRCxXQUFPLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxNQUFNLGNBQU4sQ0FBcUIsTUFBckIsRUFBNkIsU0FBN0IsSUFBMEMsT0FBTyxHQUFqRCxHQUF1RCxPQUFPLE1BQTFFLENBQVA7QUFDSCxDOztBQTNMUSxLLENBNkxGLGMsR0FBaUIsVUFBVSxLQUFWLEVBQWlCLFNBQWpCLEVBQTRCLE1BQTVCLEVBQW9DO0FBQ3hELFdBQU8sS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLE1BQU0sYUFBTixDQUFvQixLQUFwQixFQUEyQixTQUEzQixJQUF3QyxPQUFPLElBQS9DLEdBQXNELE9BQU8sS0FBekUsQ0FBUDtBQUNILEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgY29sb3I6IHJlcXVpcmUoJy4vc3JjL2NvbG9yJyksXHJcbiAgc2l6ZTogcmVxdWlyZSgnLi9zcmMvc2l6ZScpLFxyXG4gIHN5bWJvbDogcmVxdWlyZSgnLi9zcmMvc3ltYm9sJylcclxufTtcclxuIiwidmFyIGhlbHBlciA9IHJlcXVpcmUoJy4vbGVnZW5kJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XHJcblxyXG4gIHZhciBzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLFxyXG4gICAgc2hhcGUgPSBcInJlY3RcIixcclxuICAgIHNoYXBlV2lkdGggPSAxNSxcclxuICAgIHNoYXBlSGVpZ2h0ID0gMTUsXHJcbiAgICBzaGFwZVJhZGl1cyA9IDEwLFxyXG4gICAgc2hhcGVQYWRkaW5nID0gMixcclxuICAgIGNlbGxzID0gWzVdLFxyXG4gICAgbGFiZWxzID0gW10sXHJcbiAgICBjbGFzc1ByZWZpeCA9IFwiXCIsXHJcbiAgICB1c2VDbGFzcyA9IGZhbHNlLFxyXG4gICAgdGl0bGUgPSBcIlwiLFxyXG4gICAgbGFiZWxGb3JtYXQgPSBkMy5mb3JtYXQoXCIuMDFmXCIpLFxyXG4gICAgbGFiZWxPZmZzZXQgPSAxMCxcclxuICAgIGxhYmVsQWxpZ24gPSBcIm1pZGRsZVwiLFxyXG4gICAgbGFiZWxEZWxpbWl0ZXIgPSBcInRvXCIsXHJcbiAgICBvcmllbnQgPSBcInZlcnRpY2FsXCIsXHJcbiAgICBhc2NlbmRpbmcgPSBmYWxzZSxcclxuICAgIHBhdGgsXHJcbiAgICBsZWdlbmREaXNwYXRjaGVyID0gZDMuZGlzcGF0Y2goXCJjZWxsb3ZlclwiLCBcImNlbGxvdXRcIiwgXCJjZWxsY2xpY2tcIik7XHJcblxyXG4gICAgZnVuY3Rpb24gbGVnZW5kKHN2Zyl7XHJcblxyXG4gICAgICB2YXIgdHlwZSA9IGhlbHBlci5kM19jYWxjVHlwZShzY2FsZSwgYXNjZW5kaW5nLCBjZWxscywgbGFiZWxzLCBsYWJlbEZvcm1hdCwgbGFiZWxEZWxpbWl0ZXIpLFxyXG4gICAgICAgIGxlZ2VuZEcgPSBzdmcuc2VsZWN0QWxsKCdnJykuZGF0YShbc2NhbGVdKTtcclxuXHJcbiAgICAgIGxlZ2VuZEcuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsIGNsYXNzUHJlZml4ICsgJ2xlZ2VuZENlbGxzJyk7XHJcblxyXG5cclxuICAgICAgdmFyIGNlbGwgPSBsZWdlbmRHLnNlbGVjdEFsbChcIi5cIiArIGNsYXNzUHJlZml4ICsgXCJjZWxsXCIpLmRhdGEodHlwZS5kYXRhKSxcclxuICAgICAgICBjZWxsRW50ZXIgPSBjZWxsLmVudGVyKCkuYXBwZW5kKFwiZ1wiLCBcIi5jZWxsXCIpLmF0dHIoXCJjbGFzc1wiLCBjbGFzc1ByZWZpeCArIFwiY2VsbFwiKS5zdHlsZShcIm9wYWNpdHlcIiwgMWUtNiksXHJcbiAgICAgICAgc2hhcGVFbnRlciA9IGNlbGxFbnRlci5hcHBlbmQoc2hhcGUpLmF0dHIoXCJjbGFzc1wiLCBjbGFzc1ByZWZpeCArIFwic3dhdGNoXCIpLFxyXG4gICAgICAgIHNoYXBlcyA9IGNlbGwuc2VsZWN0KFwiZy5cIiArIGNsYXNzUHJlZml4ICsgXCJjZWxsIFwiICsgc2hhcGUpO1xyXG5cclxuICAgICAgLy9hZGQgZXZlbnQgaGFuZGxlcnNcclxuICAgICAgaGVscGVyLmQzX2FkZEV2ZW50cyhjZWxsRW50ZXIsIGxlZ2VuZERpc3BhdGNoZXIpO1xyXG5cclxuICAgICAgY2VsbC5leGl0KCkudHJhbnNpdGlvbigpLnN0eWxlKFwib3BhY2l0eVwiLCAwKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgIGhlbHBlci5kM19kcmF3U2hhcGVzKHNoYXBlLCBzaGFwZXMsIHNoYXBlSGVpZ2h0LCBzaGFwZVdpZHRoLCBzaGFwZVJhZGl1cywgcGF0aCk7XHJcblxyXG4gICAgICBoZWxwZXIuZDNfYWRkVGV4dChsZWdlbmRHLCBjZWxsRW50ZXIsIHR5cGUubGFiZWxzLCBjbGFzc1ByZWZpeClcclxuXHJcbiAgICAgIC8vIHNldHMgcGxhY2VtZW50XHJcbiAgICAgIHZhciB0ZXh0ID0gY2VsbC5zZWxlY3QoXCJ0ZXh0XCIpLFxyXG4gICAgICAgIHNoYXBlU2l6ZSA9IHNoYXBlc1swXS5tYXAoIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC5nZXRCQm94KCk7IH0pO1xyXG5cclxuICAgICAgLy9zZXRzIHNjYWxlXHJcbiAgICAgIC8vZXZlcnl0aGluZyBpcyBmaWxsIGV4Y2VwdCBmb3IgbGluZSB3aGljaCBpcyBzdHJva2UsXHJcbiAgICAgIGlmICghdXNlQ2xhc3Mpe1xyXG4gICAgICAgIGlmIChzaGFwZSA9PSBcImxpbmVcIil7XHJcbiAgICAgICAgICBzaGFwZXMuc3R5bGUoXCJzdHJva2VcIiwgdHlwZS5mZWF0dXJlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc2hhcGVzLnN0eWxlKFwiZmlsbFwiLCB0eXBlLmZlYXR1cmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzaGFwZXMuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKGQpeyByZXR1cm4gY2xhc3NQcmVmaXggKyBcInN3YXRjaCBcIiArIHR5cGUuZmVhdHVyZShkKTsgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBjZWxsVHJhbnMsXHJcbiAgICAgIHRleHRUcmFucyxcclxuICAgICAgdGV4dEFsaWduID0gKGxhYmVsQWxpZ24gPT0gXCJzdGFydFwiKSA/IDAgOiAobGFiZWxBbGlnbiA9PSBcIm1pZGRsZVwiKSA/IDAuNSA6IDE7XHJcblxyXG4gICAgICAvL3Bvc2l0aW9ucyBjZWxscyBhbmQgdGV4dFxyXG4gICAgICBpZiAob3JpZW50ID09PSBcInZlcnRpY2FsXCIpe1xyXG4gICAgICAgIGNlbGxUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoMCwgXCIgKyAoaSAqIChzaGFwZVNpemVbaV0uaGVpZ2h0ICsgc2hhcGVQYWRkaW5nKSkgKyBcIilcIjsgfTtcclxuICAgICAgICB0ZXh0VHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKHNoYXBlU2l6ZVtpXS53aWR0aCArIHNoYXBlU2l6ZVtpXS54ICtcclxuICAgICAgICAgIGxhYmVsT2Zmc2V0KSArIFwiLFwiICsgKHNoYXBlU2l6ZVtpXS55ICsgc2hhcGVTaXplW2ldLmhlaWdodC8yICsgNSkgKyBcIilcIjsgfTtcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAob3JpZW50ID09PSBcImhvcml6b250YWxcIil7XHJcbiAgICAgICAgY2VsbFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIChpICogKHNoYXBlU2l6ZVtpXS53aWR0aCArIHNoYXBlUGFkZGluZykpICsgXCIsMClcIjsgfVxyXG4gICAgICAgIHRleHRUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAoc2hhcGVTaXplW2ldLndpZHRoKnRleHRBbGlnbiAgKyBzaGFwZVNpemVbaV0ueCkgK1xyXG4gICAgICAgICAgXCIsXCIgKyAoc2hhcGVTaXplW2ldLmhlaWdodCArIHNoYXBlU2l6ZVtpXS55ICsgbGFiZWxPZmZzZXQgKyA4KSArIFwiKVwiOyB9O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBoZWxwZXIuZDNfcGxhY2VtZW50KG9yaWVudCwgY2VsbCwgY2VsbFRyYW5zLCB0ZXh0LCB0ZXh0VHJhbnMsIGxhYmVsQWxpZ24pO1xyXG4gICAgICBoZWxwZXIuZDNfdGl0bGUoc3ZnLCBsZWdlbmRHLCB0aXRsZSwgY2xhc3NQcmVmaXgpO1xyXG5cclxuICAgICAgY2VsbC50cmFuc2l0aW9uKCkuc3R5bGUoXCJvcGFjaXR5XCIsIDEpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuICBsZWdlbmQuc2NhbGUgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzY2FsZTtcclxuICAgIHNjYWxlID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmNlbGxzID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY2VsbHM7XHJcbiAgICBpZiAoXy5sZW5ndGggPiAxIHx8IF8gPj0gMiApe1xyXG4gICAgICBjZWxscyA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5zaGFwZSA9IGZ1bmN0aW9uKF8sIGQpIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlO1xyXG4gICAgaWYgKF8gPT0gXCJyZWN0XCIgfHwgXyA9PSBcImNpcmNsZVwiIHx8IF8gPT0gXCJsaW5lXCIgfHwgKF8gPT0gXCJwYXRoXCIgJiYgKHR5cGVvZiBkID09PSAnc3RyaW5nJykpICl7XHJcbiAgICAgIHNoYXBlID0gXztcclxuICAgICAgcGF0aCA9IGQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5zaGFwZVdpZHRoID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGVXaWR0aDtcclxuICAgIHNoYXBlV2lkdGggPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlSGVpZ2h0ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGVIZWlnaHQ7XHJcbiAgICBzaGFwZUhlaWdodCA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuc2hhcGVSYWRpdXMgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZVJhZGl1cztcclxuICAgIHNoYXBlUmFkaXVzID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5zaGFwZVBhZGRpbmcgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZVBhZGRpbmc7XHJcbiAgICBzaGFwZVBhZGRpbmcgPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVscyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVscztcclxuICAgIGxhYmVscyA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbEFsaWduID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxBbGlnbjtcclxuICAgIGlmIChfID09IFwic3RhcnRcIiB8fCBfID09IFwiZW5kXCIgfHwgXyA9PSBcIm1pZGRsZVwiKSB7XHJcbiAgICAgIGxhYmVsQWxpZ24gPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxGb3JtYXQgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbEZvcm1hdDtcclxuICAgIGxhYmVsRm9ybWF0ID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsT2Zmc2V0ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxPZmZzZXQ7XHJcbiAgICBsYWJlbE9mZnNldCA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxEZWxpbWl0ZXIgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbERlbGltaXRlcjtcclxuICAgIGxhYmVsRGVsaW1pdGVyID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnVzZUNsYXNzID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdXNlQ2xhc3M7XHJcbiAgICBpZiAoXyA9PT0gdHJ1ZSB8fCBfID09PSBmYWxzZSl7XHJcbiAgICAgIHVzZUNsYXNzID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLm9yaWVudCA9IGZ1bmN0aW9uKF8pe1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gb3JpZW50O1xyXG4gICAgXyA9IF8udG9Mb3dlckNhc2UoKTtcclxuICAgIGlmIChfID09IFwiaG9yaXpvbnRhbFwiIHx8IF8gPT0gXCJ2ZXJ0aWNhbFwiKSB7XHJcbiAgICAgIG9yaWVudCA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5hc2NlbmRpbmcgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBhc2NlbmRpbmc7XHJcbiAgICBhc2NlbmRpbmcgPSAhIV87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5jbGFzc1ByZWZpeCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGNsYXNzUHJlZml4O1xyXG4gICAgY2xhc3NQcmVmaXggPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQudGl0bGUgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB0aXRsZTtcclxuICAgIHRpdGxlID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgZDMucmViaW5kKGxlZ2VuZCwgbGVnZW5kRGlzcGF0Y2hlciwgXCJvblwiKTtcclxuXHJcbiAgcmV0dXJuIGxlZ2VuZDtcclxuXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICBkM19pZGVudGl0eTogZnVuY3Rpb24gKGQpIHtcclxuICAgIHJldHVybiBkO1xyXG4gIH0sXHJcblxyXG4gIGQzX21lcmdlTGFiZWxzOiBmdW5jdGlvbiAoZ2VuLCBsYWJlbHMpIHtcclxuXHJcbiAgICAgIGlmKGxhYmVscy5sZW5ndGggPT09IDApIHJldHVybiBnZW47XHJcblxyXG4gICAgICBnZW4gPSAoZ2VuKSA/IGdlbiA6IFtdO1xyXG5cclxuICAgICAgdmFyIGkgPSBsYWJlbHMubGVuZ3RoO1xyXG4gICAgICBmb3IgKDsgaSA8IGdlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxhYmVscy5wdXNoKGdlbltpXSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGxhYmVscztcclxuICAgIH0sXHJcblxyXG4gIGQzX2xpbmVhckxlZ2VuZDogZnVuY3Rpb24gKHNjYWxlLCBjZWxscywgbGFiZWxGb3JtYXQpIHtcclxuICAgIHZhciBkYXRhID0gW107XHJcblxyXG4gICAgaWYgKGNlbGxzLmxlbmd0aCA+IDEpe1xyXG4gICAgICBkYXRhID0gY2VsbHM7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIGRvbWFpbiA9IHNjYWxlLmRvbWFpbigpLFxyXG4gICAgICBpbmNyZW1lbnQgPSAoZG9tYWluW2RvbWFpbi5sZW5ndGggLSAxXSAtIGRvbWFpblswXSkvKGNlbGxzIC0gMSksXHJcbiAgICAgIGkgPSAwO1xyXG5cclxuICAgICAgZm9yICg7IGkgPCBjZWxsczsgaSsrKXtcclxuICAgICAgICBkYXRhLnB1c2goZG9tYWluWzBdICsgaSppbmNyZW1lbnQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxhYmVscyA9IGRhdGEubWFwKGxhYmVsRm9ybWF0KTtcclxuXHJcbiAgICByZXR1cm4ge2RhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgIGxhYmVsczogbGFiZWxzLFxyXG4gICAgICAgICAgICBmZWF0dXJlOiBmdW5jdGlvbihkKXsgcmV0dXJuIHNjYWxlKGQpOyB9fTtcclxuICB9LFxyXG5cclxuICBkM19xdWFudExlZ2VuZDogZnVuY3Rpb24gKHNjYWxlLCBsYWJlbEZvcm1hdCwgbGFiZWxEZWxpbWl0ZXIpIHtcclxuICAgIHZhciBsYWJlbHMgPSBzY2FsZS5yYW5nZSgpLm1hcChmdW5jdGlvbihkKXtcclxuICAgICAgdmFyIGludmVydCA9IHNjYWxlLmludmVydEV4dGVudChkKSxcclxuICAgICAgYSA9IGxhYmVsRm9ybWF0KGludmVydFswXSksXHJcbiAgICAgIGIgPSBsYWJlbEZvcm1hdChpbnZlcnRbMV0pO1xyXG5cclxuICAgICAgLy8gaWYgKCggKGEpICYmIChhLmlzTmFuKCkpICYmIGIpe1xyXG4gICAgICAvLyAgIGNvbnNvbGUubG9nKFwiaW4gaW5pdGlhbCBzdGF0ZW1lbnRcIilcclxuICAgICAgICByZXR1cm4gbGFiZWxGb3JtYXQoaW52ZXJ0WzBdKSArIFwiIFwiICsgbGFiZWxEZWxpbWl0ZXIgKyBcIiBcIiArIGxhYmVsRm9ybWF0KGludmVydFsxXSk7XHJcbiAgICAgIC8vIH0gZWxzZSBpZiAoYSB8fCBiKSB7XHJcbiAgICAgIC8vICAgY29uc29sZS5sb2coJ2luIGVsc2Ugc3RhdGVtZW50JylcclxuICAgICAgLy8gICByZXR1cm4gKGEpID8gYSA6IGI7XHJcbiAgICAgIC8vIH1cclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4ge2RhdGE6IHNjYWxlLnJhbmdlKCksXHJcbiAgICAgICAgICAgIGxhYmVsczogbGFiZWxzLFxyXG4gICAgICAgICAgICBmZWF0dXJlOiB0aGlzLmQzX2lkZW50aXR5XHJcbiAgICAgICAgICB9O1xyXG4gIH0sXHJcblxyXG4gIGQzX29yZGluYWxMZWdlbmQ6IGZ1bmN0aW9uIChzY2FsZSkge1xyXG4gICAgcmV0dXJuIHtkYXRhOiBzY2FsZS5kb21haW4oKSxcclxuICAgICAgICAgICAgbGFiZWxzOiBzY2FsZS5kb21haW4oKSxcclxuICAgICAgICAgICAgZmVhdHVyZTogZnVuY3Rpb24oZCl7IHJldHVybiBzY2FsZShkKTsgfX07XHJcbiAgfSxcclxuXHJcbiAgZDNfZHJhd1NoYXBlczogZnVuY3Rpb24gKHNoYXBlLCBzaGFwZXMsIHNoYXBlSGVpZ2h0LCBzaGFwZVdpZHRoLCBzaGFwZVJhZGl1cywgcGF0aCkge1xyXG4gICAgaWYgKHNoYXBlID09PSBcInJlY3RcIil7XHJcbiAgICAgICAgc2hhcGVzLmF0dHIoXCJoZWlnaHRcIiwgc2hhcGVIZWlnaHQpLmF0dHIoXCJ3aWR0aFwiLCBzaGFwZVdpZHRoKTtcclxuXHJcbiAgICB9IGVsc2UgaWYgKHNoYXBlID09PSBcImNpcmNsZVwiKSB7XHJcbiAgICAgICAgc2hhcGVzLmF0dHIoXCJyXCIsIHNoYXBlUmFkaXVzKS8vLmF0dHIoXCJjeFwiLCBzaGFwZVJhZGl1cykuYXR0cihcImN5XCIsIHNoYXBlUmFkaXVzKTtcclxuXHJcbiAgICB9IGVsc2UgaWYgKHNoYXBlID09PSBcImxpbmVcIikge1xyXG4gICAgICAgIHNoYXBlcy5hdHRyKFwieDFcIiwgMCkuYXR0cihcIngyXCIsIHNoYXBlV2lkdGgpLmF0dHIoXCJ5MVwiLCAwKS5hdHRyKFwieTJcIiwgMCk7XHJcblxyXG4gICAgfSBlbHNlIGlmIChzaGFwZSA9PT0gXCJwYXRoXCIpIHtcclxuICAgICAgc2hhcGVzLmF0dHIoXCJkXCIsIHBhdGgpO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGQzX2FkZFRleHQ6IGZ1bmN0aW9uIChzdmcsIGVudGVyLCBsYWJlbHMsIGNsYXNzUHJlZml4KXtcclxuICAgIGVudGVyLmFwcGVuZChcInRleHRcIikuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJsYWJlbFwiKTtcclxuICAgIHN2Zy5zZWxlY3RBbGwoXCJnLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGwgdGV4dFwiKS5kYXRhKGxhYmVscykudGV4dCh0aGlzLmQzX2lkZW50aXR5KTtcclxuICB9LFxyXG5cclxuICBkM19jYWxjVHlwZTogZnVuY3Rpb24gKHNjYWxlLCBhc2NlbmRpbmcsIGNlbGxzLCBsYWJlbHMsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlcil7XHJcbiAgICB2YXIgdHlwZSA9IHNjYWxlLnRpY2tzID9cclxuICAgICAgICAgICAgdGhpcy5kM19saW5lYXJMZWdlbmQoc2NhbGUsIGNlbGxzLCBsYWJlbEZvcm1hdCkgOiBzY2FsZS5pbnZlcnRFeHRlbnQgP1xyXG4gICAgICAgICAgICB0aGlzLmQzX3F1YW50TGVnZW5kKHNjYWxlLCBsYWJlbEZvcm1hdCwgbGFiZWxEZWxpbWl0ZXIpIDogdGhpcy5kM19vcmRpbmFsTGVnZW5kKHNjYWxlKTtcclxuXHJcbiAgICB0eXBlLmxhYmVscyA9IHRoaXMuZDNfbWVyZ2VMYWJlbHModHlwZS5sYWJlbHMsIGxhYmVscyk7XHJcblxyXG4gICAgaWYgKGFzY2VuZGluZykge1xyXG4gICAgICB0eXBlLmxhYmVscyA9IHRoaXMuZDNfcmV2ZXJzZSh0eXBlLmxhYmVscyk7XHJcbiAgICAgIHR5cGUuZGF0YSA9IHRoaXMuZDNfcmV2ZXJzZSh0eXBlLmRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0eXBlO1xyXG4gIH0sXHJcblxyXG4gIGQzX3JldmVyc2U6IGZ1bmN0aW9uKGFycikge1xyXG4gICAgdmFyIG1pcnJvciA9IFtdO1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcnIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgIG1pcnJvcltpXSA9IGFycltsLWktMV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbWlycm9yO1xyXG4gIH0sXHJcblxyXG4gIGQzX3BsYWNlbWVudDogZnVuY3Rpb24gKG9yaWVudCwgY2VsbCwgY2VsbFRyYW5zLCB0ZXh0LCB0ZXh0VHJhbnMsIGxhYmVsQWxpZ24pIHtcclxuICAgIGNlbGwuYXR0cihcInRyYW5zZm9ybVwiLCBjZWxsVHJhbnMpO1xyXG4gICAgdGV4dC5hdHRyKFwidHJhbnNmb3JtXCIsIHRleHRUcmFucyk7XHJcbiAgICBpZiAob3JpZW50ID09PSBcImhvcml6b250YWxcIil7XHJcbiAgICAgIHRleHQuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBsYWJlbEFsaWduKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBkM19hZGRFdmVudHM6IGZ1bmN0aW9uKGNlbGxzLCBkaXNwYXRjaGVyKXtcclxuICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgIGNlbGxzLm9uKFwibW91c2VvdmVyLmxlZ2VuZFwiLCBmdW5jdGlvbiAoZCkgeyBfLmQzX2NlbGxPdmVyKGRpc3BhdGNoZXIsIGQsIHRoaXMpOyB9KVxyXG4gICAgICAgICAgLm9uKFwibW91c2VvdXQubGVnZW5kXCIsIGZ1bmN0aW9uIChkKSB7IF8uZDNfY2VsbE91dChkaXNwYXRjaGVyLCBkLCB0aGlzKTsgfSlcclxuICAgICAgICAgIC5vbihcImNsaWNrLmxlZ2VuZFwiLCBmdW5jdGlvbiAoZCkgeyBfLmQzX2NlbGxDbGljayhkaXNwYXRjaGVyLCBkLCB0aGlzKTsgfSk7XHJcbiAgfSxcclxuXHJcbiAgZDNfY2VsbE92ZXI6IGZ1bmN0aW9uKGNlbGxEaXNwYXRjaGVyLCBkLCBvYmope1xyXG4gICAgY2VsbERpc3BhdGNoZXIuY2VsbG92ZXIuY2FsbChvYmosIGQpO1xyXG4gIH0sXHJcblxyXG4gIGQzX2NlbGxPdXQ6IGZ1bmN0aW9uKGNlbGxEaXNwYXRjaGVyLCBkLCBvYmope1xyXG4gICAgY2VsbERpc3BhdGNoZXIuY2VsbG91dC5jYWxsKG9iaiwgZCk7XHJcbiAgfSxcclxuXHJcbiAgZDNfY2VsbENsaWNrOiBmdW5jdGlvbihjZWxsRGlzcGF0Y2hlciwgZCwgb2JqKXtcclxuICAgIGNlbGxEaXNwYXRjaGVyLmNlbGxjbGljay5jYWxsKG9iaiwgZCk7XHJcbiAgfSxcclxuXHJcbiAgZDNfdGl0bGU6IGZ1bmN0aW9uKHN2ZywgY2VsbHNTdmcsIHRpdGxlLCBjbGFzc1ByZWZpeCl7XHJcbiAgICBpZiAodGl0bGUgIT09IFwiXCIpe1xyXG5cclxuICAgICAgdmFyIHRpdGxlVGV4dCA9IHN2Zy5zZWxlY3RBbGwoJ3RleHQuJyArIGNsYXNzUHJlZml4ICsgJ2xlZ2VuZFRpdGxlJyk7XHJcblxyXG4gICAgICB0aXRsZVRleHQuZGF0YShbdGl0bGVdKVxyXG4gICAgICAgIC5lbnRlcigpXHJcbiAgICAgICAgLmFwcGVuZCgndGV4dCcpXHJcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgY2xhc3NQcmVmaXggKyAnbGVnZW5kVGl0bGUnKTtcclxuXHJcbiAgICAgICAgc3ZnLnNlbGVjdEFsbCgndGV4dC4nICsgY2xhc3NQcmVmaXggKyAnbGVnZW5kVGl0bGUnKVxyXG4gICAgICAgICAgICAudGV4dCh0aXRsZSlcclxuXHJcbiAgICAgIHZhciB5T2Zmc2V0ID0gc3ZnLnNlbGVjdCgnLicgKyBjbGFzc1ByZWZpeCArICdsZWdlbmRUaXRsZScpXHJcbiAgICAgICAgICAubWFwKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRbMF0uZ2V0QkJveCgpLmhlaWdodH0pWzBdLFxyXG4gICAgICB4T2Zmc2V0ID0gLWNlbGxzU3ZnLm1hcChmdW5jdGlvbihkKSB7IHJldHVybiBkWzBdLmdldEJCb3goKS54fSlbMF07XHJcblxyXG4gICAgICBjZWxsc1N2Zy5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyB4T2Zmc2V0ICsgJywnICsgKHlPZmZzZXQgKyAxMCkgKyAnKScpO1xyXG5cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwidmFyIGhlbHBlciA9IHJlcXVpcmUoJy4vbGVnZW5kJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9ICBmdW5jdGlvbigpe1xyXG5cclxuICB2YXIgc2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKSxcclxuICAgIHNoYXBlID0gXCJyZWN0XCIsXHJcbiAgICBzaGFwZVdpZHRoID0gMTUsXHJcbiAgICBzaGFwZVBhZGRpbmcgPSAyLFxyXG4gICAgY2VsbHMgPSBbNV0sXHJcbiAgICBsYWJlbHMgPSBbXSxcclxuICAgIHVzZVN0cm9rZSA9IGZhbHNlLFxyXG4gICAgY2xhc3NQcmVmaXggPSBcIlwiLFxyXG4gICAgdGl0bGUgPSBcIlwiLFxyXG4gICAgbGFiZWxGb3JtYXQgPSBkMy5mb3JtYXQoXCIuMDFmXCIpLFxyXG4gICAgbGFiZWxPZmZzZXQgPSAxMCxcclxuICAgIGxhYmVsQWxpZ24gPSBcIm1pZGRsZVwiLFxyXG4gICAgbGFiZWxEZWxpbWl0ZXIgPSBcInRvXCIsXHJcbiAgICBvcmllbnQgPSBcInZlcnRpY2FsXCIsXHJcbiAgICBhc2NlbmRpbmcgPSBmYWxzZSxcclxuICAgIHBhdGgsXHJcbiAgICBsZWdlbmREaXNwYXRjaGVyID0gZDMuZGlzcGF0Y2goXCJjZWxsb3ZlclwiLCBcImNlbGxvdXRcIiwgXCJjZWxsY2xpY2tcIik7XHJcblxyXG4gICAgZnVuY3Rpb24gbGVnZW5kKHN2Zyl7XHJcblxyXG4gICAgICB2YXIgdHlwZSA9IGhlbHBlci5kM19jYWxjVHlwZShzY2FsZSwgYXNjZW5kaW5nLCBjZWxscywgbGFiZWxzLCBsYWJlbEZvcm1hdCwgbGFiZWxEZWxpbWl0ZXIpLFxyXG4gICAgICAgIGxlZ2VuZEcgPSBzdmcuc2VsZWN0QWxsKCdnJykuZGF0YShbc2NhbGVdKTtcclxuXHJcbiAgICAgIGxlZ2VuZEcuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsIGNsYXNzUHJlZml4ICsgJ2xlZ2VuZENlbGxzJyk7XHJcblxyXG5cclxuICAgICAgdmFyIGNlbGwgPSBsZWdlbmRHLnNlbGVjdEFsbChcIi5cIiArIGNsYXNzUHJlZml4ICsgXCJjZWxsXCIpLmRhdGEodHlwZS5kYXRhKSxcclxuICAgICAgICBjZWxsRW50ZXIgPSBjZWxsLmVudGVyKCkuYXBwZW5kKFwiZ1wiLCBcIi5jZWxsXCIpLmF0dHIoXCJjbGFzc1wiLCBjbGFzc1ByZWZpeCArIFwiY2VsbFwiKS5zdHlsZShcIm9wYWNpdHlcIiwgMWUtNiksXHJcbiAgICAgICAgc2hhcGVFbnRlciA9IGNlbGxFbnRlci5hcHBlbmQoc2hhcGUpLmF0dHIoXCJjbGFzc1wiLCBjbGFzc1ByZWZpeCArIFwic3dhdGNoXCIpLFxyXG4gICAgICAgIHNoYXBlcyA9IGNlbGwuc2VsZWN0KFwiZy5cIiArIGNsYXNzUHJlZml4ICsgXCJjZWxsIFwiICsgc2hhcGUpO1xyXG5cclxuICAgICAgLy9hZGQgZXZlbnQgaGFuZGxlcnNcclxuICAgICAgaGVscGVyLmQzX2FkZEV2ZW50cyhjZWxsRW50ZXIsIGxlZ2VuZERpc3BhdGNoZXIpO1xyXG5cclxuICAgICAgY2VsbC5leGl0KCkudHJhbnNpdGlvbigpLnN0eWxlKFwib3BhY2l0eVwiLCAwKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgIC8vY3JlYXRlcyBzaGFwZVxyXG4gICAgICBpZiAoc2hhcGUgPT09IFwibGluZVwiKXtcclxuICAgICAgICBoZWxwZXIuZDNfZHJhd1NoYXBlcyhzaGFwZSwgc2hhcGVzLCAwLCBzaGFwZVdpZHRoKTtcclxuICAgICAgICBzaGFwZXMuYXR0cihcInN0cm9rZS13aWR0aFwiLCB0eXBlLmZlYXR1cmUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGhlbHBlci5kM19kcmF3U2hhcGVzKHNoYXBlLCBzaGFwZXMsIHR5cGUuZmVhdHVyZSwgdHlwZS5mZWF0dXJlLCB0eXBlLmZlYXR1cmUsIHBhdGgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBoZWxwZXIuZDNfYWRkVGV4dChsZWdlbmRHLCBjZWxsRW50ZXIsIHR5cGUubGFiZWxzLCBjbGFzc1ByZWZpeClcclxuXHJcbiAgICAgIC8vc2V0cyBwbGFjZW1lbnRcclxuICAgICAgdmFyIHRleHQgPSBjZWxsLnNlbGVjdChcInRleHRcIiksXHJcbiAgICAgICAgc2hhcGVTaXplID0gc2hhcGVzWzBdLm1hcChcclxuICAgICAgICAgIGZ1bmN0aW9uKGQsIGkpe1xyXG4gICAgICAgICAgICB2YXIgYmJveCA9IGQuZ2V0QkJveCgpXHJcbiAgICAgICAgICAgIHZhciBzdHJva2UgPSBzY2FsZSh0eXBlLmRhdGFbaV0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNoYXBlID09PSBcImxpbmVcIiAmJiBvcmllbnQgPT09IFwiaG9yaXpvbnRhbFwiKSB7XHJcbiAgICAgICAgICAgICAgYmJveC5oZWlnaHQgPSBiYm94LmhlaWdodCArIHN0cm9rZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzaGFwZSA9PT0gXCJsaW5lXCIgJiYgb3JpZW50ID09PSBcInZlcnRpY2FsXCIpe1xyXG4gICAgICAgICAgICAgIGJib3gud2lkdGggPSBiYm94LndpZHRoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYmJveDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIHZhciBtYXhIID0gZDMubWF4KHNoYXBlU2l6ZSwgZnVuY3Rpb24oZCl7IHJldHVybiBkLmhlaWdodCArIGQueTsgfSksXHJcbiAgICAgIG1heFcgPSBkMy5tYXgoc2hhcGVTaXplLCBmdW5jdGlvbihkKXsgcmV0dXJuIGQud2lkdGggKyBkLng7IH0pO1xyXG5cclxuICAgICAgdmFyIGNlbGxUcmFucyxcclxuICAgICAgdGV4dFRyYW5zLFxyXG4gICAgICB0ZXh0QWxpZ24gPSAobGFiZWxBbGlnbiA9PSBcInN0YXJ0XCIpID8gMCA6IChsYWJlbEFsaWduID09IFwibWlkZGxlXCIpID8gMC41IDogMTtcclxuXHJcbiAgICAgIC8vcG9zaXRpb25zIGNlbGxzIGFuZCB0ZXh0XHJcbiAgICAgIGlmIChvcmllbnQgPT09IFwidmVydGljYWxcIil7XHJcblxyXG4gICAgICAgIGNlbGxUcmFucyA9IGZ1bmN0aW9uKGQsaSkge1xyXG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gZDMuc3VtKHNoYXBlU2l6ZS5zbGljZSgwLCBpICsgMSApLCBmdW5jdGlvbihkKXsgcmV0dXJuIGQuaGVpZ2h0OyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKDAsIFwiICsgKGhlaWdodCArIGkqc2hhcGVQYWRkaW5nKSArIFwiKVwiOyB9O1xyXG5cclxuICAgICAgICB0ZXh0VHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKG1heFcgKyBsYWJlbE9mZnNldCkgKyBcIixcIiArXHJcbiAgICAgICAgICAoc2hhcGVTaXplW2ldLnkgKyBzaGFwZVNpemVbaV0uaGVpZ2h0LzIgKyA1KSArIFwiKVwiOyB9O1xyXG5cclxuICAgICAgfSBlbHNlIGlmIChvcmllbnQgPT09IFwiaG9yaXpvbnRhbFwiKXtcclxuICAgICAgICBjZWxsVHJhbnMgPSBmdW5jdGlvbihkLGkpIHtcclxuICAgICAgICAgICAgdmFyIHdpZHRoID0gZDMuc3VtKHNoYXBlU2l6ZS5zbGljZSgwLCBpICsgMSApLCBmdW5jdGlvbihkKXsgcmV0dXJuIGQud2lkdGg7IH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAod2lkdGggKyBpKnNoYXBlUGFkZGluZykgKyBcIiwwKVwiOyB9O1xyXG5cclxuICAgICAgICB0ZXh0VHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKHNoYXBlU2l6ZVtpXS53aWR0aCp0ZXh0QWxpZ24gICsgc2hhcGVTaXplW2ldLngpICsgXCIsXCIgK1xyXG4gICAgICAgICAgICAgIChtYXhIICsgbGFiZWxPZmZzZXQgKSArIFwiKVwiOyB9O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBoZWxwZXIuZDNfcGxhY2VtZW50KG9yaWVudCwgY2VsbCwgY2VsbFRyYW5zLCB0ZXh0LCB0ZXh0VHJhbnMsIGxhYmVsQWxpZ24pO1xyXG4gICAgICBoZWxwZXIuZDNfdGl0bGUoc3ZnLCBsZWdlbmRHLCB0aXRsZSwgY2xhc3NQcmVmaXgpO1xyXG5cclxuICAgICAgY2VsbC50cmFuc2l0aW9uKCkuc3R5bGUoXCJvcGFjaXR5XCIsIDEpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgbGVnZW5kLnNjYWxlID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2NhbGU7XHJcbiAgICBzY2FsZSA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5jZWxscyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGNlbGxzO1xyXG4gICAgaWYgKF8ubGVuZ3RoID4gMSB8fCBfID49IDIgKXtcclxuICAgICAgY2VsbHMgPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuXHJcbiAgbGVnZW5kLnNoYXBlID0gZnVuY3Rpb24oXywgZCkge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGU7XHJcbiAgICBpZiAoXyA9PSBcInJlY3RcIiB8fCBfID09IFwiY2lyY2xlXCIgfHwgXyA9PSBcImxpbmVcIiApe1xyXG4gICAgICBzaGFwZSA9IF87XHJcbiAgICAgIHBhdGggPSBkO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuc2hhcGVXaWR0aCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlV2lkdGg7XHJcbiAgICBzaGFwZVdpZHRoID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5zaGFwZVBhZGRpbmcgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZVBhZGRpbmc7XHJcbiAgICBzaGFwZVBhZGRpbmcgPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVscyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVscztcclxuICAgIGxhYmVscyA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbEFsaWduID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxBbGlnbjtcclxuICAgIGlmIChfID09IFwic3RhcnRcIiB8fCBfID09IFwiZW5kXCIgfHwgXyA9PSBcIm1pZGRsZVwiKSB7XHJcbiAgICAgIGxhYmVsQWxpZ24gPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxGb3JtYXQgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbEZvcm1hdDtcclxuICAgIGxhYmVsRm9ybWF0ID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsT2Zmc2V0ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxPZmZzZXQ7XHJcbiAgICBsYWJlbE9mZnNldCA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxEZWxpbWl0ZXIgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbERlbGltaXRlcjtcclxuICAgIGxhYmVsRGVsaW1pdGVyID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLm9yaWVudCA9IGZ1bmN0aW9uKF8pe1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gb3JpZW50O1xyXG4gICAgXyA9IF8udG9Mb3dlckNhc2UoKTtcclxuICAgIGlmIChfID09IFwiaG9yaXpvbnRhbFwiIHx8IF8gPT0gXCJ2ZXJ0aWNhbFwiKSB7XHJcbiAgICAgIG9yaWVudCA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5hc2NlbmRpbmcgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBhc2NlbmRpbmc7XHJcbiAgICBhc2NlbmRpbmcgPSAhIV87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5jbGFzc1ByZWZpeCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGNsYXNzUHJlZml4O1xyXG4gICAgY2xhc3NQcmVmaXggPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQudGl0bGUgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB0aXRsZTtcclxuICAgIHRpdGxlID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgZDMucmViaW5kKGxlZ2VuZCwgbGVnZW5kRGlzcGF0Y2hlciwgXCJvblwiKTtcclxuXHJcbiAgcmV0dXJuIGxlZ2VuZDtcclxuXHJcbn07XHJcbiIsInZhciBoZWxwZXIgPSByZXF1aXJlKCcuL2xlZ2VuZCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xyXG5cclxuICB2YXIgc2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKSxcclxuICAgIHNoYXBlID0gXCJwYXRoXCIsXHJcbiAgICBzaGFwZVdpZHRoID0gMTUsXHJcbiAgICBzaGFwZUhlaWdodCA9IDE1LFxyXG4gICAgc2hhcGVSYWRpdXMgPSAxMCxcclxuICAgIHNoYXBlUGFkZGluZyA9IDUsXHJcbiAgICBjZWxscyA9IFs1XSxcclxuICAgIGxhYmVscyA9IFtdLFxyXG4gICAgY2xhc3NQcmVmaXggPSBcIlwiLFxyXG4gICAgdXNlQ2xhc3MgPSBmYWxzZSxcclxuICAgIHRpdGxlID0gXCJcIixcclxuICAgIGxhYmVsRm9ybWF0ID0gZDMuZm9ybWF0KFwiLjAxZlwiKSxcclxuICAgIGxhYmVsQWxpZ24gPSBcIm1pZGRsZVwiLFxyXG4gICAgbGFiZWxPZmZzZXQgPSAxMCxcclxuICAgIGxhYmVsRGVsaW1pdGVyID0gXCJ0b1wiLFxyXG4gICAgb3JpZW50ID0gXCJ2ZXJ0aWNhbFwiLFxyXG4gICAgYXNjZW5kaW5nID0gZmFsc2UsXHJcbiAgICBsZWdlbmREaXNwYXRjaGVyID0gZDMuZGlzcGF0Y2goXCJjZWxsb3ZlclwiLCBcImNlbGxvdXRcIiwgXCJjZWxsY2xpY2tcIik7XHJcblxyXG4gICAgZnVuY3Rpb24gbGVnZW5kKHN2Zyl7XHJcblxyXG4gICAgICB2YXIgdHlwZSA9IGhlbHBlci5kM19jYWxjVHlwZShzY2FsZSwgYXNjZW5kaW5nLCBjZWxscywgbGFiZWxzLCBsYWJlbEZvcm1hdCwgbGFiZWxEZWxpbWl0ZXIpLFxyXG4gICAgICAgIGxlZ2VuZEcgPSBzdmcuc2VsZWN0QWxsKCdnJykuZGF0YShbc2NhbGVdKTtcclxuXHJcbiAgICAgIGxlZ2VuZEcuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsIGNsYXNzUHJlZml4ICsgJ2xlZ2VuZENlbGxzJyk7XHJcblxyXG4gICAgICB2YXIgY2VsbCA9IGxlZ2VuZEcuc2VsZWN0QWxsKFwiLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGxcIikuZGF0YSh0eXBlLmRhdGEpLFxyXG4gICAgICAgIGNlbGxFbnRlciA9IGNlbGwuZW50ZXIoKS5hcHBlbmQoXCJnXCIsIFwiLmNlbGxcIikuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJjZWxsXCIpLnN0eWxlKFwib3BhY2l0eVwiLCAxZS02KSxcclxuICAgICAgICBzaGFwZUVudGVyID0gY2VsbEVudGVyLmFwcGVuZChzaGFwZSkuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJzd2F0Y2hcIiksXHJcbiAgICAgICAgc2hhcGVzID0gY2VsbC5zZWxlY3QoXCJnLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGwgXCIgKyBzaGFwZSk7XHJcblxyXG4gICAgICAvL2FkZCBldmVudCBoYW5kbGVyc1xyXG4gICAgICBoZWxwZXIuZDNfYWRkRXZlbnRzKGNlbGxFbnRlciwgbGVnZW5kRGlzcGF0Y2hlcik7XHJcblxyXG4gICAgICAvL3JlbW92ZSBvbGQgc2hhcGVzXHJcbiAgICAgIGNlbGwuZXhpdCgpLnRyYW5zaXRpb24oKS5zdHlsZShcIm9wYWNpdHlcIiwgMCkucmVtb3ZlKCk7XHJcblxyXG4gICAgICBoZWxwZXIuZDNfZHJhd1NoYXBlcyhzaGFwZSwgc2hhcGVzLCBzaGFwZUhlaWdodCwgc2hhcGVXaWR0aCwgc2hhcGVSYWRpdXMsIHR5cGUuZmVhdHVyZSk7XHJcbiAgICAgIGhlbHBlci5kM19hZGRUZXh0KGxlZ2VuZEcsIGNlbGxFbnRlciwgdHlwZS5sYWJlbHMsIGNsYXNzUHJlZml4KVxyXG5cclxuICAgICAgLy8gc2V0cyBwbGFjZW1lbnRcclxuICAgICAgdmFyIHRleHQgPSBjZWxsLnNlbGVjdChcInRleHRcIiksXHJcbiAgICAgICAgc2hhcGVTaXplID0gc2hhcGVzWzBdLm1hcCggZnVuY3Rpb24oZCl7IHJldHVybiBkLmdldEJCb3goKTsgfSk7XHJcblxyXG4gICAgICB2YXIgbWF4SCA9IGQzLm1heChzaGFwZVNpemUsIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC5oZWlnaHQ7IH0pLFxyXG4gICAgICBtYXhXID0gZDMubWF4KHNoYXBlU2l6ZSwgZnVuY3Rpb24oZCl7IHJldHVybiBkLndpZHRoOyB9KTtcclxuXHJcbiAgICAgIHZhciBjZWxsVHJhbnMsXHJcbiAgICAgIHRleHRUcmFucyxcclxuICAgICAgdGV4dEFsaWduID0gKGxhYmVsQWxpZ24gPT0gXCJzdGFydFwiKSA/IDAgOiAobGFiZWxBbGlnbiA9PSBcIm1pZGRsZVwiKSA/IDAuNSA6IDE7XHJcblxyXG4gICAgICAvL3Bvc2l0aW9ucyBjZWxscyBhbmQgdGV4dFxyXG4gICAgICBpZiAob3JpZW50ID09PSBcInZlcnRpY2FsXCIpe1xyXG4gICAgICAgIGNlbGxUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoMCwgXCIgKyAoaSAqIChtYXhIICsgc2hhcGVQYWRkaW5nKSkgKyBcIilcIjsgfTtcclxuICAgICAgICB0ZXh0VHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKG1heFcgKyBsYWJlbE9mZnNldCkgKyBcIixcIiArXHJcbiAgICAgICAgICAgICAgKHNoYXBlU2l6ZVtpXS55ICsgc2hhcGVTaXplW2ldLmhlaWdodC8yICsgNSkgKyBcIilcIjsgfTtcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAob3JpZW50ID09PSBcImhvcml6b250YWxcIil7XHJcbiAgICAgICAgY2VsbFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIChpICogKG1heFcgKyBzaGFwZVBhZGRpbmcpKSArIFwiLDApXCI7IH07XHJcbiAgICAgICAgdGV4dFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIChzaGFwZVNpemVbaV0ud2lkdGgqdGV4dEFsaWduICArIHNoYXBlU2l6ZVtpXS54KSArIFwiLFwiICtcclxuICAgICAgICAgICAgICAobWF4SCArIGxhYmVsT2Zmc2V0ICkgKyBcIilcIjsgfTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaGVscGVyLmQzX3BsYWNlbWVudChvcmllbnQsIGNlbGwsIGNlbGxUcmFucywgdGV4dCwgdGV4dFRyYW5zLCBsYWJlbEFsaWduKTtcclxuICAgICAgaGVscGVyLmQzX3RpdGxlKHN2ZywgbGVnZW5kRywgdGl0bGUsIGNsYXNzUHJlZml4KTtcclxuICAgICAgY2VsbC50cmFuc2l0aW9uKCkuc3R5bGUoXCJvcGFjaXR5XCIsIDEpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gIGxlZ2VuZC5zY2FsZSA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNjYWxlO1xyXG4gICAgc2NhbGUgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuY2VsbHMgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBjZWxscztcclxuICAgIGlmIChfLmxlbmd0aCA+IDEgfHwgXyA+PSAyICl7XHJcbiAgICAgIGNlbGxzID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlUGFkZGluZyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlUGFkZGluZztcclxuICAgIHNoYXBlUGFkZGluZyA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxzID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxzO1xyXG4gICAgbGFiZWxzID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsQWxpZ24gPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbEFsaWduO1xyXG4gICAgaWYgKF8gPT0gXCJzdGFydFwiIHx8IF8gPT0gXCJlbmRcIiB8fCBfID09IFwibWlkZGxlXCIpIHtcclxuICAgICAgbGFiZWxBbGlnbiA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbEZvcm1hdCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsRm9ybWF0O1xyXG4gICAgbGFiZWxGb3JtYXQgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxPZmZzZXQgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbE9mZnNldDtcclxuICAgIGxhYmVsT2Zmc2V0ID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbERlbGltaXRlciA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsRGVsaW1pdGVyO1xyXG4gICAgbGFiZWxEZWxpbWl0ZXIgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQub3JpZW50ID0gZnVuY3Rpb24oXyl7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBvcmllbnQ7XHJcbiAgICBfID0gXy50b0xvd2VyQ2FzZSgpO1xyXG4gICAgaWYgKF8gPT0gXCJob3Jpem9udGFsXCIgfHwgXyA9PSBcInZlcnRpY2FsXCIpIHtcclxuICAgICAgb3JpZW50ID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmFzY2VuZGluZyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGFzY2VuZGluZztcclxuICAgIGFzY2VuZGluZyA9ICEhXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmNsYXNzUHJlZml4ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY2xhc3NQcmVmaXg7XHJcbiAgICBjbGFzc1ByZWZpeCA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC50aXRsZSA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHRpdGxlO1xyXG4gICAgdGl0bGUgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBkMy5yZWJpbmQobGVnZW5kLCBsZWdlbmREaXNwYXRjaGVyLCBcIm9uXCIpO1xyXG5cclxuICByZXR1cm4gbGVnZW5kO1xyXG5cclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxuLyoqXHJcbiAqICoqW0dhdXNzaWFuIGVycm9yIGZ1bmN0aW9uXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Vycm9yX2Z1bmN0aW9uKSoqXHJcbiAqXHJcbiAqIFRoZSBgZXJyb3JGdW5jdGlvbih4LyhzZCAqIE1hdGguc3FydCgyKSkpYCBpcyB0aGUgcHJvYmFiaWxpdHkgdGhhdCBhIHZhbHVlIGluIGFcclxuICogbm9ybWFsIGRpc3RyaWJ1dGlvbiB3aXRoIHN0YW5kYXJkIGRldmlhdGlvbiBzZCBpcyB3aXRoaW4geCBvZiB0aGUgbWVhbi5cclxuICpcclxuICogVGhpcyBmdW5jdGlvbiByZXR1cm5zIGEgbnVtZXJpY2FsIGFwcHJveGltYXRpb24gdG8gdGhlIGV4YWN0IHZhbHVlLlxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0geCBpbnB1dFxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IGVycm9yIGVzdGltYXRpb25cclxuICogQGV4YW1wbGVcclxuICogZXJyb3JGdW5jdGlvbigxKTsgLy89IDAuODQyN1xyXG4gKi9cclxuZnVuY3Rpb24gZXJyb3JGdW5jdGlvbih4Lyo6IG51bWJlciAqLykvKjogbnVtYmVyICovIHtcclxuICAgIHZhciB0ID0gMSAvICgxICsgMC41ICogTWF0aC5hYnMoeCkpO1xyXG4gICAgdmFyIHRhdSA9IHQgKiBNYXRoLmV4cCgtTWF0aC5wb3coeCwgMikgLVxyXG4gICAgICAgIDEuMjY1NTEyMjMgK1xyXG4gICAgICAgIDEuMDAwMDIzNjggKiB0ICtcclxuICAgICAgICAwLjM3NDA5MTk2ICogTWF0aC5wb3codCwgMikgK1xyXG4gICAgICAgIDAuMDk2Nzg0MTggKiBNYXRoLnBvdyh0LCAzKSAtXHJcbiAgICAgICAgMC4xODYyODgwNiAqIE1hdGgucG93KHQsIDQpICtcclxuICAgICAgICAwLjI3ODg2ODA3ICogTWF0aC5wb3codCwgNSkgLVxyXG4gICAgICAgIDEuMTM1MjAzOTggKiBNYXRoLnBvdyh0LCA2KSArXHJcbiAgICAgICAgMS40ODg1MTU4NyAqIE1hdGgucG93KHQsIDcpIC1cclxuICAgICAgICAwLjgyMjE1MjIzICogTWF0aC5wb3codCwgOCkgK1xyXG4gICAgICAgIDAuMTcwODcyNzcgKiBNYXRoLnBvdyh0LCA5KSk7XHJcbiAgICBpZiAoeCA+PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIDEgLSB0YXU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB0YXUgLSAxO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVycm9yRnVuY3Rpb247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbi8qKlxyXG4gKiBbU2ltcGxlIGxpbmVhciByZWdyZXNzaW9uXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1NpbXBsZV9saW5lYXJfcmVncmVzc2lvbilcclxuICogaXMgYSBzaW1wbGUgd2F5IHRvIGZpbmQgYSBmaXR0ZWQgbGluZVxyXG4gKiBiZXR3ZWVuIGEgc2V0IG9mIGNvb3JkaW5hdGVzLiBUaGlzIGFsZ29yaXRobSBmaW5kcyB0aGUgc2xvcGUgYW5kIHktaW50ZXJjZXB0IG9mIGEgcmVncmVzc2lvbiBsaW5lXHJcbiAqIHVzaW5nIHRoZSBsZWFzdCBzdW0gb2Ygc3F1YXJlcy5cclxuICpcclxuICogQHBhcmFtIHtBcnJheTxBcnJheTxudW1iZXI+Pn0gZGF0YSBhbiBhcnJheSBvZiB0d28tZWxlbWVudCBvZiBhcnJheXMsXHJcbiAqIGxpa2UgYFtbMCwgMV0sIFsyLCAzXV1gXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IG9iamVjdCBjb250YWluaW5nIHNsb3BlIGFuZCBpbnRlcnNlY3Qgb2YgcmVncmVzc2lvbiBsaW5lXHJcbiAqIEBleGFtcGxlXHJcbiAqIGxpbmVhclJlZ3Jlc3Npb24oW1swLCAwXSwgWzEsIDFdXSk7IC8vIHsgbTogMSwgYjogMCB9XHJcbiAqL1xyXG5mdW5jdGlvbiBsaW5lYXJSZWdyZXNzaW9uKGRhdGEvKjogQXJyYXk8QXJyYXk8bnVtYmVyPj4gKi8pLyo6IHsgbTogbnVtYmVyLCBiOiBudW1iZXIgfSAqLyB7XHJcblxyXG4gICAgdmFyIG0sIGI7XHJcblxyXG4gICAgLy8gU3RvcmUgZGF0YSBsZW5ndGggaW4gYSBsb2NhbCB2YXJpYWJsZSB0byByZWR1Y2VcclxuICAgIC8vIHJlcGVhdGVkIG9iamVjdCBwcm9wZXJ0eSBsb29rdXBzXHJcbiAgICB2YXIgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoO1xyXG5cclxuICAgIC8vaWYgdGhlcmUncyBvbmx5IG9uZSBwb2ludCwgYXJiaXRyYXJpbHkgY2hvb3NlIGEgc2xvcGUgb2YgMFxyXG4gICAgLy9hbmQgYSB5LWludGVyY2VwdCBvZiB3aGF0ZXZlciB0aGUgeSBvZiB0aGUgaW5pdGlhbCBwb2ludCBpc1xyXG4gICAgaWYgKGRhdGFMZW5ndGggPT09IDEpIHtcclxuICAgICAgICBtID0gMDtcclxuICAgICAgICBiID0gZGF0YVswXVsxXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gSW5pdGlhbGl6ZSBvdXIgc3VtcyBhbmQgc2NvcGUgdGhlIGBtYCBhbmQgYGJgXHJcbiAgICAgICAgLy8gdmFyaWFibGVzIHRoYXQgZGVmaW5lIHRoZSBsaW5lLlxyXG4gICAgICAgIHZhciBzdW1YID0gMCwgc3VtWSA9IDAsXHJcbiAgICAgICAgICAgIHN1bVhYID0gMCwgc3VtWFkgPSAwO1xyXG5cclxuICAgICAgICAvLyBVc2UgbG9jYWwgdmFyaWFibGVzIHRvIGdyYWIgcG9pbnQgdmFsdWVzXHJcbiAgICAgICAgLy8gd2l0aCBtaW5pbWFsIG9iamVjdCBwcm9wZXJ0eSBsb29rdXBzXHJcbiAgICAgICAgdmFyIHBvaW50LCB4LCB5O1xyXG5cclxuICAgICAgICAvLyBHYXRoZXIgdGhlIHN1bSBvZiBhbGwgeCB2YWx1ZXMsIHRoZSBzdW0gb2YgYWxsXHJcbiAgICAgICAgLy8geSB2YWx1ZXMsIGFuZCB0aGUgc3VtIG9mIHheMiBhbmQgKHgqeSkgZm9yIGVhY2hcclxuICAgICAgICAvLyB2YWx1ZS5cclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIEluIG1hdGggbm90YXRpb24sIHRoZXNlIHdvdWxkIGJlIFNTX3gsIFNTX3ksIFNTX3h4LCBhbmQgU1NfeHlcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGFMZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBwb2ludCA9IGRhdGFbaV07XHJcbiAgICAgICAgICAgIHggPSBwb2ludFswXTtcclxuICAgICAgICAgICAgeSA9IHBvaW50WzFdO1xyXG5cclxuICAgICAgICAgICAgc3VtWCArPSB4O1xyXG4gICAgICAgICAgICBzdW1ZICs9IHk7XHJcblxyXG4gICAgICAgICAgICBzdW1YWCArPSB4ICogeDtcclxuICAgICAgICAgICAgc3VtWFkgKz0geCAqIHk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBgbWAgaXMgdGhlIHNsb3BlIG9mIHRoZSByZWdyZXNzaW9uIGxpbmVcclxuICAgICAgICBtID0gKChkYXRhTGVuZ3RoICogc3VtWFkpIC0gKHN1bVggKiBzdW1ZKSkgL1xyXG4gICAgICAgICAgICAoKGRhdGFMZW5ndGggKiBzdW1YWCkgLSAoc3VtWCAqIHN1bVgpKTtcclxuXHJcbiAgICAgICAgLy8gYGJgIGlzIHRoZSB5LWludGVyY2VwdCBvZiB0aGUgbGluZS5cclxuICAgICAgICBiID0gKHN1bVkgLyBkYXRhTGVuZ3RoKSAtICgobSAqIHN1bVgpIC8gZGF0YUxlbmd0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmV0dXJuIGJvdGggdmFsdWVzIGFzIGFuIG9iamVjdC5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbTogbSxcclxuICAgICAgICBiOiBiXHJcbiAgICB9O1xyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsaW5lYXJSZWdyZXNzaW9uO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG4vKipcclxuICogR2l2ZW4gdGhlIG91dHB1dCBvZiBgbGluZWFyUmVncmVzc2lvbmA6IGFuIG9iamVjdFxyXG4gKiB3aXRoIGBtYCBhbmQgYGJgIHZhbHVlcyBpbmRpY2F0aW5nIHNsb3BlIGFuZCBpbnRlcmNlcHQsXHJcbiAqIHJlc3BlY3RpdmVseSwgZ2VuZXJhdGUgYSBsaW5lIGZ1bmN0aW9uIHRoYXQgdHJhbnNsYXRlc1xyXG4gKiB4IHZhbHVlcyBpbnRvIHkgdmFsdWVzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge09iamVjdH0gbWIgb2JqZWN0IHdpdGggYG1gIGFuZCBgYmAgbWVtYmVycywgcmVwcmVzZW50aW5nXHJcbiAqIHNsb3BlIGFuZCBpbnRlcnNlY3Qgb2YgZGVzaXJlZCBsaW5lXHJcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gbWV0aG9kIHRoYXQgY29tcHV0ZXMgeS12YWx1ZSBhdCBhbnkgZ2l2ZW5cclxuICogeC12YWx1ZSBvbiB0aGUgbGluZS5cclxuICogQGV4YW1wbGVcclxuICogdmFyIGwgPSBsaW5lYXJSZWdyZXNzaW9uTGluZShsaW5lYXJSZWdyZXNzaW9uKFtbMCwgMF0sIFsxLCAxXV0pKTtcclxuICogbCgwKSAvLz0gMFxyXG4gKiBsKDIpIC8vPSAyXHJcbiAqL1xyXG5mdW5jdGlvbiBsaW5lYXJSZWdyZXNzaW9uTGluZShtYi8qOiB7IGI6IG51bWJlciwgbTogbnVtYmVyIH0qLykvKjogRnVuY3Rpb24gKi8ge1xyXG4gICAgLy8gUmV0dXJuIGEgZnVuY3Rpb24gdGhhdCBjb21wdXRlcyBhIGB5YCB2YWx1ZSBmb3IgZWFjaFxyXG4gICAgLy8geCB2YWx1ZSBpdCBpcyBnaXZlbiwgYmFzZWQgb24gdGhlIHZhbHVlcyBvZiBgYmAgYW5kIGBhYFxyXG4gICAgLy8gdGhhdCB3ZSBqdXN0IGNvbXB1dGVkLlxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHgpIHtcclxuICAgICAgICByZXR1cm4gbWIuYiArIChtYi5tICogeCk7XHJcbiAgICB9O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxpbmVhclJlZ3Jlc3Npb25MaW5lO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgc3VtID0gcmVxdWlyZSgnLi9zdW0nKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgbWVhbiwgX2Fsc28ga25vd24gYXMgYXZlcmFnZV8sXHJcbiAqIGlzIHRoZSBzdW0gb2YgYWxsIHZhbHVlcyBvdmVyIHRoZSBudW1iZXIgb2YgdmFsdWVzLlxyXG4gKiBUaGlzIGlzIGEgW21lYXN1cmUgb2YgY2VudHJhbCB0ZW5kZW5jeV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ2VudHJhbF90ZW5kZW5jeSk6XHJcbiAqIGEgbWV0aG9kIG9mIGZpbmRpbmcgYSB0eXBpY2FsIG9yIGNlbnRyYWwgdmFsdWUgb2YgYSBzZXQgb2YgbnVtYmVycy5cclxuICpcclxuICogVGhpcyBydW5zIG9uIGBPKG4pYCwgbGluZWFyIHRpbWUgaW4gcmVzcGVjdCB0byB0aGUgYXJyYXlcclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGlucHV0IHZhbHVlc1xyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBtZWFuXHJcbiAqIEBleGFtcGxlXHJcbiAqIGNvbnNvbGUubG9nKG1lYW4oWzAsIDEwXSkpOyAvLyA1XHJcbiAqL1xyXG5mdW5jdGlvbiBtZWFuKHggLyo6IEFycmF5PG51bWJlcj4gKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgLy8gVGhlIG1lYW4gb2Ygbm8gbnVtYmVycyBpcyBudWxsXHJcbiAgICBpZiAoeC5sZW5ndGggPT09IDApIHsgcmV0dXJuIE5hTjsgfVxyXG5cclxuICAgIHJldHVybiBzdW0oeCkgLyB4Lmxlbmd0aDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtZWFuO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgc2FtcGxlQ292YXJpYW5jZSA9IHJlcXVpcmUoJy4vc2FtcGxlX2NvdmFyaWFuY2UnKTtcclxudmFyIHNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uID0gcmVxdWlyZSgnLi9zYW1wbGVfc3RhbmRhcmRfZGV2aWF0aW9uJyk7XHJcblxyXG4vKipcclxuICogVGhlIFtjb3JyZWxhdGlvbl0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Db3JyZWxhdGlvbl9hbmRfZGVwZW5kZW5jZSkgaXNcclxuICogYSBtZWFzdXJlIG9mIGhvdyBjb3JyZWxhdGVkIHR3byBkYXRhc2V0cyBhcmUsIGJldHdlZW4gLTEgYW5kIDFcclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGZpcnN0IGlucHV0XHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geSBzZWNvbmQgaW5wdXRcclxuICogQHJldHVybnMge251bWJlcn0gc2FtcGxlIGNvcnJlbGF0aW9uXHJcbiAqIEBleGFtcGxlXHJcbiAqIHZhciBhID0gWzEsIDIsIDMsIDQsIDUsIDZdO1xyXG4gKiB2YXIgYiA9IFsyLCAyLCAzLCA0LCA1LCA2MF07XHJcbiAqIHNhbXBsZUNvcnJlbGF0aW9uKGEsIGIpOyAvLz0gMC42OTFcclxuICovXHJcbmZ1bmN0aW9uIHNhbXBsZUNvcnJlbGF0aW9uKHgvKjogQXJyYXk8bnVtYmVyPiAqLywgeS8qOiBBcnJheTxudW1iZXI+ICovKS8qOm51bWJlciovIHtcclxuICAgIHZhciBjb3YgPSBzYW1wbGVDb3ZhcmlhbmNlKHgsIHkpLFxyXG4gICAgICAgIHhzdGQgPSBzYW1wbGVTdGFuZGFyZERldmlhdGlvbih4KSxcclxuICAgICAgICB5c3RkID0gc2FtcGxlU3RhbmRhcmREZXZpYXRpb24oeSk7XHJcblxyXG4gICAgcmV0dXJuIGNvdiAvIHhzdGQgLyB5c3RkO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNhbXBsZUNvcnJlbGF0aW9uO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgbWVhbiA9IHJlcXVpcmUoJy4vbWVhbicpO1xyXG5cclxuLyoqXHJcbiAqIFtTYW1wbGUgY292YXJpYW5jZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvU2FtcGxlX21lYW5fYW5kX3NhbXBsZUNvdmFyaWFuY2UpIG9mIHR3byBkYXRhc2V0czpcclxuICogaG93IG11Y2ggZG8gdGhlIHR3byBkYXRhc2V0cyBtb3ZlIHRvZ2V0aGVyP1xyXG4gKiB4IGFuZCB5IGFyZSB0d28gZGF0YXNldHMsIHJlcHJlc2VudGVkIGFzIGFycmF5cyBvZiBudW1iZXJzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggZmlyc3QgaW5wdXRcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB5IHNlY29uZCBpbnB1dFxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBzYW1wbGUgY292YXJpYW5jZVxyXG4gKiBAZXhhbXBsZVxyXG4gKiB2YXIgeCA9IFsxLCAyLCAzLCA0LCA1LCA2XTtcclxuICogdmFyIHkgPSBbNiwgNSwgNCwgMywgMiwgMV07XHJcbiAqIHNhbXBsZUNvdmFyaWFuY2UoeCwgeSk7IC8vPSAtMy41XHJcbiAqL1xyXG5mdW5jdGlvbiBzYW1wbGVDb3ZhcmlhbmNlKHggLyo6QXJyYXk8bnVtYmVyPiovLCB5IC8qOkFycmF5PG51bWJlcj4qLykvKjpudW1iZXIqLyB7XHJcblxyXG4gICAgLy8gVGhlIHR3byBkYXRhc2V0cyBtdXN0IGhhdmUgdGhlIHNhbWUgbGVuZ3RoIHdoaWNoIG11c3QgYmUgbW9yZSB0aGFuIDFcclxuICAgIGlmICh4Lmxlbmd0aCA8PSAxIHx8IHgubGVuZ3RoICE9PSB5Lmxlbmd0aCkge1xyXG4gICAgICAgIHJldHVybiBOYU47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZGV0ZXJtaW5lIHRoZSBtZWFuIG9mIGVhY2ggZGF0YXNldCBzbyB0aGF0IHdlIGNhbiBqdWRnZSBlYWNoXHJcbiAgICAvLyB2YWx1ZSBvZiB0aGUgZGF0YXNldCBmYWlybHkgYXMgdGhlIGRpZmZlcmVuY2UgZnJvbSB0aGUgbWVhbi4gdGhpc1xyXG4gICAgLy8gd2F5LCBpZiBvbmUgZGF0YXNldCBpcyBbMSwgMiwgM10gYW5kIFsyLCAzLCA0XSwgdGhlaXIgY292YXJpYW5jZVxyXG4gICAgLy8gZG9lcyBub3Qgc3VmZmVyIGJlY2F1c2Ugb2YgdGhlIGRpZmZlcmVuY2UgaW4gYWJzb2x1dGUgdmFsdWVzXHJcbiAgICB2YXIgeG1lYW4gPSBtZWFuKHgpLFxyXG4gICAgICAgIHltZWFuID0gbWVhbih5KSxcclxuICAgICAgICBzdW0gPSAwO1xyXG5cclxuICAgIC8vIGZvciBlYWNoIHBhaXIgb2YgdmFsdWVzLCB0aGUgY292YXJpYW5jZSBpbmNyZWFzZXMgd2hlbiB0aGVpclxyXG4gICAgLy8gZGlmZmVyZW5jZSBmcm9tIHRoZSBtZWFuIGlzIGFzc29jaWF0ZWQgLSBpZiBib3RoIGFyZSB3ZWxsIGFib3ZlXHJcbiAgICAvLyBvciBpZiBib3RoIGFyZSB3ZWxsIGJlbG93XHJcbiAgICAvLyB0aGUgbWVhbiwgdGhlIGNvdmFyaWFuY2UgaW5jcmVhc2VzIHNpZ25pZmljYW50bHkuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBzdW0gKz0gKHhbaV0gLSB4bWVhbikgKiAoeVtpXSAtIHltZWFuKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB0aGlzIGlzIEJlc3NlbHMnIENvcnJlY3Rpb246IGFuIGFkanVzdG1lbnQgbWFkZSB0byBzYW1wbGUgc3RhdGlzdGljc1xyXG4gICAgLy8gdGhhdCBhbGxvd3MgZm9yIHRoZSByZWR1Y2VkIGRlZ3JlZSBvZiBmcmVlZG9tIGVudGFpbGVkIGluIGNhbGN1bGF0aW5nXHJcbiAgICAvLyB2YWx1ZXMgZnJvbSBzYW1wbGVzIHJhdGhlciB0aGFuIGNvbXBsZXRlIHBvcHVsYXRpb25zLlxyXG4gICAgdmFyIGJlc3NlbHNDb3JyZWN0aW9uID0geC5sZW5ndGggLSAxO1xyXG5cclxuICAgIC8vIHRoZSBjb3ZhcmlhbmNlIGlzIHdlaWdodGVkIGJ5IHRoZSBsZW5ndGggb2YgdGhlIGRhdGFzZXRzLlxyXG4gICAgcmV0dXJuIHN1bSAvIGJlc3NlbHNDb3JyZWN0aW9uO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNhbXBsZUNvdmFyaWFuY2U7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBzYW1wbGVWYXJpYW5jZSA9IHJlcXVpcmUoJy4vc2FtcGxlX3ZhcmlhbmNlJyk7XHJcblxyXG4vKipcclxuICogVGhlIFtzdGFuZGFyZCBkZXZpYXRpb25dKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvU3RhbmRhcmRfZGV2aWF0aW9uKVxyXG4gKiBpcyB0aGUgc3F1YXJlIHJvb3Qgb2YgdGhlIHZhcmlhbmNlLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggaW5wdXQgYXJyYXlcclxuICogQHJldHVybnMge251bWJlcn0gc2FtcGxlIHN0YW5kYXJkIGRldmlhdGlvblxyXG4gKiBAZXhhbXBsZVxyXG4gKiBzcy5zYW1wbGVTdGFuZGFyZERldmlhdGlvbihbMiwgNCwgNCwgNCwgNSwgNSwgNywgOV0pO1xyXG4gKiAvLz0gMi4xMzhcclxuICovXHJcbmZ1bmN0aW9uIHNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uKHgvKjpBcnJheTxudW1iZXI+Ki8pLyo6bnVtYmVyKi8ge1xyXG4gICAgLy8gVGhlIHN0YW5kYXJkIGRldmlhdGlvbiBvZiBubyBudW1iZXJzIGlzIG51bGxcclxuICAgIHZhciBzYW1wbGVWYXJpYW5jZVggPSBzYW1wbGVWYXJpYW5jZSh4KTtcclxuICAgIGlmIChpc05hTihzYW1wbGVWYXJpYW5jZVgpKSB7IHJldHVybiBOYU47IH1cclxuICAgIHJldHVybiBNYXRoLnNxcnQoc2FtcGxlVmFyaWFuY2VYKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYW1wbGVTdGFuZGFyZERldmlhdGlvbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIHN1bU50aFBvd2VyRGV2aWF0aW9ucyA9IHJlcXVpcmUoJy4vc3VtX250aF9wb3dlcl9kZXZpYXRpb25zJyk7XHJcblxyXG4vKlxyXG4gKiBUaGUgW3NhbXBsZSB2YXJpYW5jZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVmFyaWFuY2UjU2FtcGxlX3ZhcmlhbmNlKVxyXG4gKiBpcyB0aGUgc3VtIG9mIHNxdWFyZWQgZGV2aWF0aW9ucyBmcm9tIHRoZSBtZWFuLiBUaGUgc2FtcGxlIHZhcmlhbmNlXHJcbiAqIGlzIGRpc3Rpbmd1aXNoZWQgZnJvbSB0aGUgdmFyaWFuY2UgYnkgdGhlIHVzYWdlIG9mIFtCZXNzZWwncyBDb3JyZWN0aW9uXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9CZXNzZWwnc19jb3JyZWN0aW9uKTpcclxuICogaW5zdGVhZCBvZiBkaXZpZGluZyB0aGUgc3VtIG9mIHNxdWFyZWQgZGV2aWF0aW9ucyBieSB0aGUgbGVuZ3RoIG9mIHRoZSBpbnB1dCxcclxuICogaXQgaXMgZGl2aWRlZCBieSB0aGUgbGVuZ3RoIG1pbnVzIG9uZS4gVGhpcyBjb3JyZWN0cyB0aGUgYmlhcyBpbiBlc3RpbWF0aW5nXHJcbiAqIGEgdmFsdWUgZnJvbSBhIHNldCB0aGF0IHlvdSBkb24ndCBrbm93IGlmIGZ1bGwuXHJcbiAqXHJcbiAqIFJlZmVyZW5jZXM6XHJcbiAqICogW1dvbGZyYW0gTWF0aFdvcmxkIG9uIFNhbXBsZSBWYXJpYW5jZV0oaHR0cDovL21hdGh3b3JsZC53b2xmcmFtLmNvbS9TYW1wbGVWYXJpYW5jZS5odG1sKVxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggaW5wdXQgYXJyYXlcclxuICogQHJldHVybiB7bnVtYmVyfSBzYW1wbGUgdmFyaWFuY2VcclxuICogQGV4YW1wbGVcclxuICogc2FtcGxlVmFyaWFuY2UoWzEsIDIsIDMsIDQsIDVdKTsgLy89IDIuNVxyXG4gKi9cclxuZnVuY3Rpb24gc2FtcGxlVmFyaWFuY2UoeCAvKjogQXJyYXk8bnVtYmVyPiAqLykvKjpudW1iZXIqLyB7XHJcbiAgICAvLyBUaGUgdmFyaWFuY2Ugb2Ygbm8gbnVtYmVycyBpcyBudWxsXHJcbiAgICBpZiAoeC5sZW5ndGggPD0gMSkgeyByZXR1cm4gTmFOOyB9XHJcblxyXG4gICAgdmFyIHN1bVNxdWFyZWREZXZpYXRpb25zVmFsdWUgPSBzdW1OdGhQb3dlckRldmlhdGlvbnMoeCwgMik7XHJcblxyXG4gICAgLy8gdGhpcyBpcyBCZXNzZWxzJyBDb3JyZWN0aW9uOiBhbiBhZGp1c3RtZW50IG1hZGUgdG8gc2FtcGxlIHN0YXRpc3RpY3NcclxuICAgIC8vIHRoYXQgYWxsb3dzIGZvciB0aGUgcmVkdWNlZCBkZWdyZWUgb2YgZnJlZWRvbSBlbnRhaWxlZCBpbiBjYWxjdWxhdGluZ1xyXG4gICAgLy8gdmFsdWVzIGZyb20gc2FtcGxlcyByYXRoZXIgdGhhbiBjb21wbGV0ZSBwb3B1bGF0aW9ucy5cclxuICAgIHZhciBiZXNzZWxzQ29ycmVjdGlvbiA9IHgubGVuZ3RoIC0gMTtcclxuXHJcbiAgICAvLyBGaW5kIHRoZSBtZWFuIHZhbHVlIG9mIHRoYXQgbGlzdFxyXG4gICAgcmV0dXJuIHN1bVNxdWFyZWREZXZpYXRpb25zVmFsdWUgLyBiZXNzZWxzQ29ycmVjdGlvbjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYW1wbGVWYXJpYW5jZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIHZhcmlhbmNlID0gcmVxdWlyZSgnLi92YXJpYW5jZScpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBbc3RhbmRhcmQgZGV2aWF0aW9uXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1N0YW5kYXJkX2RldmlhdGlvbilcclxuICogaXMgdGhlIHNxdWFyZSByb290IG9mIHRoZSB2YXJpYW5jZS4gSXQncyB1c2VmdWwgZm9yIG1lYXN1cmluZyB0aGUgYW1vdW50XHJcbiAqIG9mIHZhcmlhdGlvbiBvciBkaXNwZXJzaW9uIGluIGEgc2V0IG9mIHZhbHVlcy5cclxuICpcclxuICogU3RhbmRhcmQgZGV2aWF0aW9uIGlzIG9ubHkgYXBwcm9wcmlhdGUgZm9yIGZ1bGwtcG9wdWxhdGlvbiBrbm93bGVkZ2U6IGZvclxyXG4gKiBzYW1wbGVzIG9mIGEgcG9wdWxhdGlvbiwge0BsaW5rIHNhbXBsZVN0YW5kYXJkRGV2aWF0aW9ufSBpc1xyXG4gKiBtb3JlIGFwcHJvcHJpYXRlLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggaW5wdXRcclxuICogQHJldHVybnMge251bWJlcn0gc3RhbmRhcmQgZGV2aWF0aW9uXHJcbiAqIEBleGFtcGxlXHJcbiAqIHZhciBzY29yZXMgPSBbMiwgNCwgNCwgNCwgNSwgNSwgNywgOV07XHJcbiAqIHZhcmlhbmNlKHNjb3Jlcyk7IC8vPSA0XHJcbiAqIHN0YW5kYXJkRGV2aWF0aW9uKHNjb3Jlcyk7IC8vPSAyXHJcbiAqL1xyXG5mdW5jdGlvbiBzdGFuZGFyZERldmlhdGlvbih4IC8qOiBBcnJheTxudW1iZXI+ICovKS8qOm51bWJlciovIHtcclxuICAgIC8vIFRoZSBzdGFuZGFyZCBkZXZpYXRpb24gb2Ygbm8gbnVtYmVycyBpcyBudWxsXHJcbiAgICB2YXIgdiA9IHZhcmlhbmNlKHgpO1xyXG4gICAgaWYgKGlzTmFOKHYpKSB7IHJldHVybiAwOyB9XHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHYpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHN0YW5kYXJkRGV2aWF0aW9uO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG4vKipcclxuICogT3VyIGRlZmF1bHQgc3VtIGlzIHRoZSBbS2FoYW4gc3VtbWF0aW9uIGFsZ29yaXRobV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvS2FoYW5fc3VtbWF0aW9uX2FsZ29yaXRobSkgaXNcclxuICogYSBtZXRob2QgZm9yIGNvbXB1dGluZyB0aGUgc3VtIG9mIGEgbGlzdCBvZiBudW1iZXJzIHdoaWxlIGNvcnJlY3RpbmdcclxuICogZm9yIGZsb2F0aW5nLXBvaW50IGVycm9ycy4gVHJhZGl0aW9uYWxseSwgc3VtcyBhcmUgY2FsY3VsYXRlZCBhcyBtYW55XHJcbiAqIHN1Y2Nlc3NpdmUgYWRkaXRpb25zLCBlYWNoIG9uZSB3aXRoIGl0cyBvd24gZmxvYXRpbmctcG9pbnQgcm91bmRvZmYuIFRoZXNlXHJcbiAqIGxvc3NlcyBpbiBwcmVjaXNpb24gYWRkIHVwIGFzIHRoZSBudW1iZXIgb2YgbnVtYmVycyBpbmNyZWFzZXMuIFRoaXMgYWx0ZXJuYXRpdmVcclxuICogYWxnb3JpdGhtIGlzIG1vcmUgYWNjdXJhdGUgdGhhbiB0aGUgc2ltcGxlIHdheSBvZiBjYWxjdWxhdGluZyBzdW1zIGJ5IHNpbXBsZVxyXG4gKiBhZGRpdGlvbi5cclxuICpcclxuICogVGhpcyBydW5zIG9uIGBPKG4pYCwgbGluZWFyIHRpbWUgaW4gcmVzcGVjdCB0byB0aGUgYXJyYXlcclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGlucHV0XHJcbiAqIEByZXR1cm4ge251bWJlcn0gc3VtIG9mIGFsbCBpbnB1dCBudW1iZXJzXHJcbiAqIEBleGFtcGxlXHJcbiAqIGNvbnNvbGUubG9nKHN1bShbMSwgMiwgM10pKTsgLy8gNlxyXG4gKi9cclxuZnVuY3Rpb24gc3VtKHgvKjogQXJyYXk8bnVtYmVyPiAqLykvKjogbnVtYmVyICovIHtcclxuXHJcbiAgICAvLyBsaWtlIHRoZSB0cmFkaXRpb25hbCBzdW0gYWxnb3JpdGhtLCB3ZSBrZWVwIGEgcnVubmluZ1xyXG4gICAgLy8gY291bnQgb2YgdGhlIGN1cnJlbnQgc3VtLlxyXG4gICAgdmFyIHN1bSA9IDA7XHJcblxyXG4gICAgLy8gYnV0IHdlIGFsc28ga2VlcCB0aHJlZSBleHRyYSB2YXJpYWJsZXMgYXMgYm9va2tlZXBpbmc6XHJcbiAgICAvLyBtb3N0IGltcG9ydGFudGx5LCBhbiBlcnJvciBjb3JyZWN0aW9uIHZhbHVlLiBUaGlzIHdpbGwgYmUgYSB2ZXJ5XHJcbiAgICAvLyBzbWFsbCBudW1iZXIgdGhhdCBpcyB0aGUgb3Bwb3NpdGUgb2YgdGhlIGZsb2F0aW5nIHBvaW50IHByZWNpc2lvbiBsb3NzLlxyXG4gICAgdmFyIGVycm9yQ29tcGVuc2F0aW9uID0gMDtcclxuXHJcbiAgICAvLyB0aGlzIHdpbGwgYmUgZWFjaCBudW1iZXIgaW4gdGhlIGxpc3QgY29ycmVjdGVkIHdpdGggdGhlIGNvbXBlbnNhdGlvbiB2YWx1ZS5cclxuICAgIHZhciBjb3JyZWN0ZWRDdXJyZW50VmFsdWU7XHJcblxyXG4gICAgLy8gYW5kIHRoaXMgd2lsbCBiZSB0aGUgbmV4dCBzdW1cclxuICAgIHZhciBuZXh0U3VtO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIC8vIGZpcnN0IGNvcnJlY3QgdGhlIHZhbHVlIHRoYXQgd2UncmUgZ29pbmcgdG8gYWRkIHRvIHRoZSBzdW1cclxuICAgICAgICBjb3JyZWN0ZWRDdXJyZW50VmFsdWUgPSB4W2ldIC0gZXJyb3JDb21wZW5zYXRpb247XHJcblxyXG4gICAgICAgIC8vIGNvbXB1dGUgdGhlIG5leHQgc3VtLiBzdW0gaXMgbGlrZWx5IGEgbXVjaCBsYXJnZXIgbnVtYmVyXHJcbiAgICAgICAgLy8gdGhhbiBjb3JyZWN0ZWRDdXJyZW50VmFsdWUsIHNvIHdlJ2xsIGxvc2UgcHJlY2lzaW9uIGhlcmUsXHJcbiAgICAgICAgLy8gYW5kIG1lYXN1cmUgaG93IG11Y2ggcHJlY2lzaW9uIGlzIGxvc3QgaW4gdGhlIG5leHQgc3RlcFxyXG4gICAgICAgIG5leHRTdW0gPSBzdW0gKyBjb3JyZWN0ZWRDdXJyZW50VmFsdWU7XHJcblxyXG4gICAgICAgIC8vIHdlIGludGVudGlvbmFsbHkgZGlkbid0IGFzc2lnbiBzdW0gaW1tZWRpYXRlbHksIGJ1dCBzdG9yZWRcclxuICAgICAgICAvLyBpdCBmb3Igbm93IHNvIHdlIGNhbiBmaWd1cmUgb3V0IHRoaXM6IGlzIChzdW0gKyBuZXh0VmFsdWUpIC0gbmV4dFZhbHVlXHJcbiAgICAgICAgLy8gbm90IGVxdWFsIHRvIDA/IGlkZWFsbHkgaXQgd291bGQgYmUsIGJ1dCBpbiBwcmFjdGljZSBpdCB3b24ndDpcclxuICAgICAgICAvLyBpdCB3aWxsIGJlIHNvbWUgdmVyeSBzbWFsbCBudW1iZXIuIHRoYXQncyB3aGF0IHdlIHJlY29yZFxyXG4gICAgICAgIC8vIGFzIGVycm9yQ29tcGVuc2F0aW9uLlxyXG4gICAgICAgIGVycm9yQ29tcGVuc2F0aW9uID0gbmV4dFN1bSAtIHN1bSAtIGNvcnJlY3RlZEN1cnJlbnRWYWx1ZTtcclxuXHJcbiAgICAgICAgLy8gbm93IHRoYXQgd2UndmUgY29tcHV0ZWQgaG93IG11Y2ggd2UnbGwgY29ycmVjdCBmb3IgaW4gdGhlIG5leHRcclxuICAgICAgICAvLyBsb29wLCBzdGFydCB0cmVhdGluZyB0aGUgbmV4dFN1bSBhcyB0aGUgY3VycmVudCBzdW0uXHJcbiAgICAgICAgc3VtID0gbmV4dFN1bTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc3VtO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHN1bTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIG1lYW4gPSByZXF1aXJlKCcuL21lYW4nKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgc3VtIG9mIGRldmlhdGlvbnMgdG8gdGhlIE50aCBwb3dlci5cclxuICogV2hlbiBuPTIgaXQncyB0aGUgc3VtIG9mIHNxdWFyZWQgZGV2aWF0aW9ucy5cclxuICogV2hlbiBuPTMgaXQncyB0aGUgc3VtIG9mIGN1YmVkIGRldmlhdGlvbnMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbiBwb3dlclxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBzdW0gb2YgbnRoIHBvd2VyIGRldmlhdGlvbnNcclxuICogQGV4YW1wbGVcclxuICogdmFyIGlucHV0ID0gWzEsIDIsIDNdO1xyXG4gKiAvLyBzaW5jZSB0aGUgdmFyaWFuY2Ugb2YgYSBzZXQgaXMgdGhlIG1lYW4gc3F1YXJlZFxyXG4gKiAvLyBkZXZpYXRpb25zLCB3ZSBjYW4gY2FsY3VsYXRlIHRoYXQgd2l0aCBzdW1OdGhQb3dlckRldmlhdGlvbnM6XHJcbiAqIHZhciB2YXJpYW5jZSA9IHN1bU50aFBvd2VyRGV2aWF0aW9ucyhpbnB1dCkgLyBpbnB1dC5sZW5ndGg7XHJcbiAqL1xyXG5mdW5jdGlvbiBzdW1OdGhQb3dlckRldmlhdGlvbnMoeC8qOiBBcnJheTxudW1iZXI+ICovLCBuLyo6IG51bWJlciAqLykvKjpudW1iZXIqLyB7XHJcbiAgICB2YXIgbWVhblZhbHVlID0gbWVhbih4KSxcclxuICAgICAgICBzdW0gPSAwO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHN1bSArPSBNYXRoLnBvdyh4W2ldIC0gbWVhblZhbHVlLCBuKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc3VtO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHN1bU50aFBvd2VyRGV2aWF0aW9ucztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIHN1bU50aFBvd2VyRGV2aWF0aW9ucyA9IHJlcXVpcmUoJy4vc3VtX250aF9wb3dlcl9kZXZpYXRpb25zJyk7XHJcblxyXG4vKipcclxuICogVGhlIFt2YXJpYW5jZV0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9WYXJpYW5jZSlcclxuICogaXMgdGhlIHN1bSBvZiBzcXVhcmVkIGRldmlhdGlvbnMgZnJvbSB0aGUgbWVhbi5cclxuICpcclxuICogVGhpcyBpcyBhbiBpbXBsZW1lbnRhdGlvbiBvZiB2YXJpYW5jZSwgbm90IHNhbXBsZSB2YXJpYW5jZTpcclxuICogc2VlIHRoZSBgc2FtcGxlVmFyaWFuY2VgIG1ldGhvZCBpZiB5b3Ugd2FudCBhIHNhbXBsZSBtZWFzdXJlLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggYSBwb3B1bGF0aW9uXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHZhcmlhbmNlOiBhIHZhbHVlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB6ZXJvLlxyXG4gKiB6ZXJvIGluZGljYXRlcyB0aGF0IGFsbCB2YWx1ZXMgYXJlIGlkZW50aWNhbC5cclxuICogQGV4YW1wbGVcclxuICogc3MudmFyaWFuY2UoWzEsIDIsIDMsIDQsIDUsIDZdKTsgLy89IDIuOTE3XHJcbiAqL1xyXG5mdW5jdGlvbiB2YXJpYW5jZSh4Lyo6IEFycmF5PG51bWJlcj4gKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgLy8gVGhlIHZhcmlhbmNlIG9mIG5vIG51bWJlcnMgaXMgbnVsbFxyXG4gICAgaWYgKHgubGVuZ3RoID09PSAwKSB7IHJldHVybiBOYU47IH1cclxuXHJcbiAgICAvLyBGaW5kIHRoZSBtZWFuIG9mIHNxdWFyZWQgZGV2aWF0aW9ucyBiZXR3ZWVuIHRoZVxyXG4gICAgLy8gbWVhbiB2YWx1ZSBhbmQgZWFjaCB2YWx1ZS5cclxuICAgIHJldHVybiBzdW1OdGhQb3dlckRldmlhdGlvbnMoeCwgMikgLyB4Lmxlbmd0aDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB2YXJpYW5jZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxuLyoqXHJcbiAqIFRoZSBbWi1TY29yZSwgb3IgU3RhbmRhcmQgU2NvcmVdKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvU3RhbmRhcmRfc2NvcmUpLlxyXG4gKlxyXG4gKiBUaGUgc3RhbmRhcmQgc2NvcmUgaXMgdGhlIG51bWJlciBvZiBzdGFuZGFyZCBkZXZpYXRpb25zIGFuIG9ic2VydmF0aW9uXHJcbiAqIG9yIGRhdHVtIGlzIGFib3ZlIG9yIGJlbG93IHRoZSBtZWFuLiBUaHVzLCBhIHBvc2l0aXZlIHN0YW5kYXJkIHNjb3JlXHJcbiAqIHJlcHJlc2VudHMgYSBkYXR1bSBhYm92ZSB0aGUgbWVhbiwgd2hpbGUgYSBuZWdhdGl2ZSBzdGFuZGFyZCBzY29yZVxyXG4gKiByZXByZXNlbnRzIGEgZGF0dW0gYmVsb3cgdGhlIG1lYW4uIEl0IGlzIGEgZGltZW5zaW9ubGVzcyBxdWFudGl0eVxyXG4gKiBvYnRhaW5lZCBieSBzdWJ0cmFjdGluZyB0aGUgcG9wdWxhdGlvbiBtZWFuIGZyb20gYW4gaW5kaXZpZHVhbCByYXdcclxuICogc2NvcmUgYW5kIHRoZW4gZGl2aWRpbmcgdGhlIGRpZmZlcmVuY2UgYnkgdGhlIHBvcHVsYXRpb24gc3RhbmRhcmRcclxuICogZGV2aWF0aW9uLlxyXG4gKlxyXG4gKiBUaGUgei1zY29yZSBpcyBvbmx5IGRlZmluZWQgaWYgb25lIGtub3dzIHRoZSBwb3B1bGF0aW9uIHBhcmFtZXRlcnM7XHJcbiAqIGlmIG9uZSBvbmx5IGhhcyBhIHNhbXBsZSBzZXQsIHRoZW4gdGhlIGFuYWxvZ291cyBjb21wdXRhdGlvbiB3aXRoXHJcbiAqIHNhbXBsZSBtZWFuIGFuZCBzYW1wbGUgc3RhbmRhcmQgZGV2aWF0aW9uIHlpZWxkcyB0aGVcclxuICogU3R1ZGVudCdzIHQtc3RhdGlzdGljLlxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0geFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWVhblxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhbmRhcmREZXZpYXRpb25cclxuICogQHJldHVybiB7bnVtYmVyfSB6IHNjb3JlXHJcbiAqIEBleGFtcGxlXHJcbiAqIHNzLnpTY29yZSg3OCwgODAsIDUpOyAvLz0gLTAuNFxyXG4gKi9cclxuZnVuY3Rpb24gelNjb3JlKHgvKjpudW1iZXIqLywgbWVhbi8qOm51bWJlciovLCBzdGFuZGFyZERldmlhdGlvbi8qOm51bWJlciovKS8qOm51bWJlciovIHtcclxuICAgIHJldHVybiAoeCAtIG1lYW4pIC8gc3RhbmRhcmREZXZpYXRpb247XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gelNjb3JlO1xyXG4iLCJpbXBvcnQge0NoYXJ0LCBDaGFydENvbmZpZ30gZnJvbSBcIi4vY2hhcnRcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IHtMZWdlbmR9IGZyb20gXCIuL2xlZ2VuZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJhckNoYXJ0Q29uZmlnIGV4dGVuZHMgQ2hhcnRDb25maWd7XHJcblxyXG4gICAgc3ZnQ2xhc3M9IHRoaXMuY3NzQ2xhc3NQcmVmaXgrJ2Jhci1jaGFydCc7XHJcbiAgICBzaG93TGVnZW5kPXRydWU7XHJcbiAgICBzaG93VG9vbHRpcCA9dHJ1ZTtcclxuICAgIGxlZ2VuZD17XHJcbiAgICAgICAgd2lkdGg6IDgwLFxyXG4gICAgICAgIG1hcmdpbjogMTAsXHJcbiAgICAgICAgc2hhcGVXaWR0aDogMjBcclxuICAgIH07XHJcbiAgICB4PXsvLyBYIGF4aXMgY29uZmlnXHJcbiAgICAgICAgbGFiZWw6ICcnLCAvLyBheGlzIGxhYmVsXHJcbiAgICAgICAga2V5OiAwLFxyXG4gICAgICAgIHZhbHVlOiAoZCwga2V5KSA9PiBVdGlscy5pc051bWJlcihkKSA/IGQgOiBkW2tleV0sIC8vIHggdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICBzY2FsZTogXCJvcmRpbmFsXCIsXHJcbiAgICAgICAgdGlja3M6IHVuZGVmaW5lZCxcclxuICAgIH07XHJcbiAgICB5PXsvLyBZIGF4aXMgY29uZmlnXHJcbiAgICAgICAga2V5OiAxLFxyXG4gICAgICAgIHZhbHVlOiAoZCwga2V5KSA9PiBVdGlscy5pc051bWJlcihkKSA/IGQgOiBkW2tleV0sIC8vIHggdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICBsYWJlbDogJycsIC8vIGF4aXMgbGFiZWwsXHJcbiAgICAgICAgb3JpZW50OiBcImxlZnRcIixcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIlxyXG4gICAgfTtcclxuICAgIGdyb3Vwcz17XHJcbiAgICAgICAga2V5OiAxLFxyXG4gICAgICAgIHZhbHVlOiAoZCkgPT4gZFt0aGlzLmdyb3Vwcy5rZXldICwgLy8gZ3JvdXBpbmcgdmFsdWUgYWNjZXNzb3IsXHJcbiAgICAgICAgbGFiZWw6IFwiXCJcclxuICAgIH07XHJcbiAgICBjb2xvciA9IHVuZGVmaW5lZCAvLyBzdHJpbmcgb3IgZnVuY3Rpb24gcmV0dXJuaW5nIGNvbG9yJ3MgdmFsdWUgZm9yIGNvbG9yIHNjYWxlXHJcbiAgICBkM0NvbG9yQ2F0ZWdvcnk9ICdjYXRlZ29yeTEwJztcclxuICAgIHRyYW5zaXRpb249IHRydWU7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHZhciBjb25maWcgPSB0aGlzO1xyXG5cclxuICAgICAgICBpZihjdXN0b20pe1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEJhckNoYXJ0IGV4dGVuZHMgQ2hhcnR7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBzdXBlcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBuZXcgQmFyQ2hhcnRDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZyl7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgQmFyQ2hhcnRDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKXtcclxuICAgICAgICBzdXBlci5pbml0UGxvdCgpO1xyXG4gICAgICAgIHZhciBzZWxmPXRoaXM7XHJcblxyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC54PXt9O1xyXG4gICAgICAgIHRoaXMucGxvdC55PXt9O1xyXG5cclxuICAgICAgICB0aGlzLnBsb3Quc2hvd0xlZ2VuZCA9IGNvbmYuc2hvd0xlZ2VuZDtcclxuICAgICAgICBpZih0aGlzLnBsb3Quc2hvd0xlZ2VuZCl7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5tYXJnaW4ucmlnaHQgPSBjb25mLm1hcmdpbi5yaWdodCArIGNvbmYubGVnZW5kLndpZHRoK2NvbmYubGVnZW5kLm1hcmdpbioyO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMuY29tcHV0ZVBsb3RTaXplKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFkoKTtcclxuICAgICAgICB0aGlzLnNldHVwWCgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBHcm91cFN0YWNrcygpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cFlEb21haW4oKTtcclxuXHJcblxyXG4gICAgICAgIGlmKGNvbmYuZDNDb2xvckNhdGVnb3J5KXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmNvbG9yQ2F0ZWdvcnkgPSBkMy5zY2FsZVtjb25mLmQzQ29sb3JDYXRlZ29yeV0oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNvbG9yVmFsdWUgPSBjb25mLmNvbG9yO1xyXG4gICAgICAgIGlmIChjb2xvclZhbHVlICYmIHR5cGVvZiBjb2xvclZhbHVlID09PSAnc3RyaW5nJyB8fCBjb2xvclZhbHVlIGluc3RhbmNlb2YgU3RyaW5nKXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmNvbG9yID0gY29sb3JWYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZih0aGlzLnBsb3QuY29sb3JDYXRlZ29yeSl7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5jb2xvciA9IGQgPT4gIHNlbGYucGxvdC5jb2xvckNhdGVnb3J5KGQua2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgc2V0dXBYKCl7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB4ID0gcGxvdC54O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWcueDtcclxuXHJcbiAgICAgICAgLyogKlxyXG4gICAgICAgICAqIHZhbHVlIGFjY2Vzc29yIC0gcmV0dXJucyB0aGUgdmFsdWUgdG8gZW5jb2RlIGZvciBhIGdpdmVuIGRhdGEgb2JqZWN0LlxyXG4gICAgICAgICAqIHNjYWxlIC0gbWFwcyB2YWx1ZSB0byBhIHZpc3VhbCBkaXNwbGF5IGVuY29kaW5nLCBzdWNoIGFzIGEgcGl4ZWwgcG9zaXRpb24uXHJcbiAgICAgICAgICogbWFwIGZ1bmN0aW9uIC0gbWFwcyBmcm9tIGRhdGEgdmFsdWUgdG8gZGlzcGxheSB2YWx1ZVxyXG4gICAgICAgICAqIGF4aXMgLSBzZXRzIHVwIGF4aXNcclxuICAgICAgICAgKiovXHJcbiAgICAgICAgeC52YWx1ZSA9IGQgPT4gY29uZi52YWx1ZShkLCBjb25mLmtleSk7XHJcbiAgICAgICAgeC5zY2FsZSA9IGQzLnNjYWxlLm9yZGluYWwoKS5yYW5nZVJvdW5kQmFuZHMoWzAsIHBsb3Qud2lkdGhdLCAuMDgpO1xyXG4gICAgICAgIHgubWFwID0gZCA9PiB4LnNjYWxlKHgudmFsdWUoZCkpO1xyXG5cclxuICAgICAgICB4LmF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHguc2NhbGUpLm9yaWVudChjb25mLm9yaWVudCk7XHJcblxyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIHZhciBkb21haW47XHJcbiAgICAgICAgaWYoIXRoaXMuY29uZmlnLnNlcmllcyl7XHJcbiAgICAgICAgICAgIGRvbWFpbiA9IGQzLm1hcChkYXRhLCB4LnZhbHVlKS5rZXlzKCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGRvbWFpbiA9IGQzLm1hcChkYXRhWzBdLnZhbHVlcywgeC52YWx1ZSkua2V5cygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcGxvdC54LnNjYWxlLmRvbWFpbihkb21haW4pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCcgcGxvdC54LnNjYWxlLmRvbWFpbicsIHBsb3QueC5zY2FsZS5kb21haW4oKSk7XHJcbiAgICAgICAgXHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwWSAoKXtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHkgPSBwbG90Lnk7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZy55O1xyXG4gICAgICAgIHkudmFsdWUgPSBkID0+IGNvbmYudmFsdWUoZCwgY29uZi5rZXkpO1xyXG4gICAgICAgIHkuc2NhbGUgPSBkMy5zY2FsZVtjb25mLnNjYWxlXSgpLnJhbmdlKFtwbG90LmhlaWdodCwgMF0pO1xyXG4gICAgICAgIHkubWFwID0gZCA9PiB5LnNjYWxlKHkudmFsdWUoZCkpO1xyXG5cclxuICAgICAgICB5LmF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHkuc2NhbGUpLm9yaWVudChjb25mLm9yaWVudCk7XHJcbiAgICAgICAgaWYoY29uZi50aWNrcyl7XHJcbiAgICAgICAgICAgIHkuYXhpcy50aWNrcyhjb25mLnRpY2tzKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwWURvbWFpbigpIHtcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgICAgICB2YXIgZG9tYWluO1xyXG4gICAgICAgIHZhciB5U3RhY2tNYXggPSBkMy5tYXgocGxvdC5sYXllcnMsIGxheWVyID0+IGQzLm1heChsYXllci52YWx1ZXMsIGQgPT4gZC55MCArIGQueSkpO1xyXG4gICAgICAgIGlmKCF0aGlzLmNvbmZpZy5zZXJpZXMpe1xyXG4gICAgICAgICAgICBkb21haW4gPSBbZDMubWluKGRhdGEsIHBsb3QueS52YWx1ZSksIGQzLm1heChkYXRhLCBwbG90LnkudmFsdWUpXTtcclxuICAgICAgICB9ZWxzZXtcclxuXHJcbiAgICAgICAgICAgIC8vIHZhciBtaW4gPSBkMy5taW4oZGF0YSwgcz0+ZDMubWluKHMudmFsdWVzLCBwbG90LnkudmFsdWUpKTtcclxuICAgICAgICAgICAgdmFyIG1heCA9IHlTdGFja01heDtcclxuICAgICAgICAgICAgZG9tYWluID0gWzAsIG1heF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBsb3QueS5zY2FsZS5kb21haW4oZG9tYWluKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnIHBsb3QueS5zY2FsZS5kb21haW4nLCBwbG90Lnkuc2NhbGUuZG9tYWluKCkpO1xyXG4gICAgfVxyXG4gICAgZ3JvdXBEYXRhKCl7XHJcbiAgICAgICAgdmFyIHNlbGY9dGhpcztcclxuICAgICAgICB0aGlzLnBsb3QuZ3JvdXBpbmdFbmFibGVkID0gdGhpcy5jb25maWcuc2VyaWVzO1xyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIGlmKCF0aGlzLnBsb3QuZ3JvdXBpbmdFbmFibGVkICl7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5ncm91cGVkRGF0YSA9ICBbe1xyXG4gICAgICAgICAgICAgICAga2V5OiAncm9vdCcsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZXM6IHNlbGYubWFwVG9Qb2ludHMoZGF0YSlcclxuICAgICAgICAgICAgfV07XHJcbiAgICAgICAgfWVsc2V7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnBsb3QuZ3JvdXBlZERhdGEgPSAgZGF0YS5tYXAocz0+e1xyXG4gICAgICAgICAgICAgICAgcmV0dXJue1xyXG4gICAgICAgICAgICAgICAgICAgIGtleTogcy5rZXksXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBzZWxmLm1hcFRvUG9pbnRzKHMudmFsdWVzKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2V0dXBHcm91cFN0YWNrcygpIHtcclxuICAgICAgICB2YXIgc2VsZj10aGlzO1xyXG4gICAgICAgIHRoaXMuZ3JvdXBEYXRhKCk7XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC5zdGFjayA9IGQzLmxheW91dC5zdGFjaygpLnZhbHVlcyhkPT5kLnZhbHVlcyk7XHJcbiAgICAgICAgdGhpcy5wbG90LmxheWVycyA9IHRoaXMucGxvdC5zdGFjayh0aGlzLnBsb3QuZ3JvdXBlZERhdGEpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBtYXBUb1BvaW50cyh2YWx1ZXMpe1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHJldHVybiB2YWx1ZXMubWFwKHY9PntcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHg6IHBsb3QueC52YWx1ZSh2KSxcclxuICAgICAgICAgICAgICAgIHk6IHBsb3QueS52YWx1ZSh2KSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZHJhd0F4aXNYKCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBheGlzQ29uZiA9IHRoaXMuY29uZmlnLng7XHJcbiAgICAgICAgdmFyIGF4aXMgPSBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMteCcpK1wiLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMnKSsoc2VsZi5jb25maWcuZ3VpZGVzID8gJycgOiAnLicrc2VsZi5wcmVmaXhDbGFzcygnbm8tZ3VpZGVzJykpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgcGxvdC5oZWlnaHQgKyBcIilcIik7XHJcblxyXG4gICAgICAgIHZhciBheGlzVCA9IGF4aXM7XHJcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLnRyYW5zaXRpb24pIHtcclxuICAgICAgICAgICAgYXhpc1QgPSBheGlzLnRyYW5zaXRpb24oKS5lYXNlKFwic2luLWluLW91dFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGF4aXNULmNhbGwocGxvdC54LmF4aXMpO1xyXG5cclxuICAgICAgICBheGlzLnNlbGVjdE9yQXBwZW5kKFwidGV4dC5cIitzZWxmLnByZWZpeENsYXNzKCdsYWJlbCcpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisgKHBsb3Qud2lkdGgvMikgK1wiLFwiKyAocGxvdC5tYXJnaW4uYm90dG9tKSArXCIpXCIpICAvLyB0ZXh0IGlzIGRyYXduIG9mZiB0aGUgc2NyZWVuIHRvcCBsZWZ0LCBtb3ZlIGRvd24gYW5kIG91dCBhbmQgcm90YXRlXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCItMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGF4aXNDb25mLmxhYmVsKTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhd0F4aXNZKCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBheGlzQ29uZiA9IHRoaXMuY29uZmlnLnk7XHJcbiAgICAgICAgdmFyIGF4aXMgPSBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMteScpK1wiLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMnKSsoc2VsZi5jb25maWcuZ3VpZGVzID8gJycgOiAnLicrc2VsZi5wcmVmaXhDbGFzcygnbm8tZ3VpZGVzJykpKTtcclxuXHJcbiAgICAgICAgdmFyIGF4aXNUID0gYXhpcztcclxuICAgICAgICBpZiAoc2VsZi5jb25maWcudHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICBheGlzVCA9IGF4aXMudHJhbnNpdGlvbigpLmVhc2UoXCJzaW4taW4tb3V0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXhpc1QuY2FsbChwbG90LnkuYXhpcyk7XHJcblxyXG4gICAgICAgIGF4aXMuc2VsZWN0T3JBcHBlbmQoXCJ0ZXh0LlwiK3NlbGYucHJlZml4Q2xhc3MoJ2xhYmVsJykpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyAtcGxvdC5tYXJnaW4ubGVmdCArXCIsXCIrKHBsb3QuaGVpZ2h0LzIpK1wiKXJvdGF0ZSgtOTApXCIpICAvLyB0ZXh0IGlzIGRyYXduIG9mZiB0aGUgc2NyZWVuIHRvcCBsZWZ0LCBtb3ZlIGRvd24gYW5kIG91dCBhbmQgcm90YXRlXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCIxZW1cIilcclxuICAgICAgICAgICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoYXhpc0NvbmYubGFiZWwpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgZHJhd0JhcnMoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhwbG90LmxheWVycyk7XHJcblxyXG4gICAgICAgIHZhciBsYXllckNsYXNzID0gdGhpcy5wcmVmaXhDbGFzcyhcImxheWVyXCIpO1xyXG5cclxuICAgICAgICB2YXIgYmFyQ2xhc3MgPSB0aGlzLnByZWZpeENsYXNzKFwiYmFyXCIpO1xyXG4gICAgICAgIHZhciBsYXllciA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCIuXCIrbGF5ZXJDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGxvdC5sYXllcnMpO1xyXG5cclxuICAgICAgICBsYXllci5lbnRlcigpLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBsYXllckNsYXNzKTtcclxuXHJcbiAgICAgICAgdmFyIGJhciA9IGxheWVyLnNlbGVjdEFsbChcIi5cIitiYXJDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEoZCA9PiBkLnZhbHVlcyk7XHJcblxyXG4gICAgICAgIGJhci5lbnRlcigpLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBiYXJDbGFzcylcclxuICAgICAgICAgICAgLmFwcGVuZChcInJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDEpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGJhclJlY3QgPSBiYXIuc2VsZWN0KFwicmVjdFwiKTtcclxuXHJcbiAgICAgICAgdmFyIGJhclJlY3RUID0gYmFyUmVjdDtcclxuICAgICAgICB2YXIgYmFyVCA9IGJhcjtcclxuICAgICAgICB2YXIgbGF5ZXJUID0gbGF5ZXI7XHJcbiAgICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbkVuYWJsZWQoKSkge1xyXG4gICAgICAgICAgICBiYXJSZWN0VCA9IGJhclJlY3QudHJhbnNpdGlvbigpO1xyXG4gICAgICAgICAgICBiYXJUID0gYmFyLnRyYW5zaXRpb24oKTtcclxuICAgICAgICAgICAgbGF5ZXJUPSBsYXllci50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgeURvbWFpbiA9IHBsb3QueS5zY2FsZS5kb21haW4oKTtcclxuICAgICAgICBiYXJULmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBwbG90Lnguc2NhbGUoZC54KSArIFwiLFwiICsgKHBsb3QueS5zY2FsZShkLnkwK2QueSApKSArIFwiKVwiOyB9KTtcclxuXHJcbiAgICAgICAgYmFyUmVjdFRcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCAgcGxvdC54LnNjYWxlLnJhbmdlQmFuZCgpKVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBkID0+ICAgcGxvdC55LnNjYWxlKGQueTAgKSAtIHBsb3QueS5zY2FsZShkLnkwICsgZC55IC0geURvbWFpblswXSkpO1xyXG5cclxuXHJcbiAgICAgICAgaWYodGhpcy5wbG90LmNvbG9yKXtcclxuICAgICAgICAgICAgbGF5ZXJUXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgdGhpcy5wbG90LmNvbG9yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwbG90LnRvb2x0aXApIHtcclxuICAgICAgICAgICAgYmFyLm9uKFwibW91c2VvdmVyXCIsIGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAuOSk7XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAuaHRtbChkLnkpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZDMuZXZlbnQucGFnZVggKyA1KSArIFwicHhcIilcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcclxuICAgICAgICAgICAgfSkub24oXCJtb3VzZW91dFwiLCBkID0+IHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsYXllci5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICAgICAgYmFyLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUobmV3RGF0YSl7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKG5ld0RhdGEpO1xyXG4gICAgICAgIHRoaXMuZHJhd0F4aXNYKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3QXhpc1koKTtcclxuXHJcbiAgICAgICAgdGhpcy5kcmF3QmFycygpO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUxlZ2VuZCgpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgdXBkYXRlTGVnZW5kKCkge1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG5cclxuICAgICAgICB2YXIgc2NhbGUgPSBwbG90LmNvbG9yQ2F0ZWdvcnk7XHJcbiAgICAgICAgaWYoIXNjYWxlLmRvbWFpbigpIHx8IHNjYWxlLmRvbWFpbigpLmxlbmd0aDwyKXtcclxuICAgICAgICAgICAgcGxvdC5zaG93TGVnZW5kID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZighcGxvdC5zaG93TGVnZW5kKXtcclxuICAgICAgICAgICAgaWYocGxvdC5sZWdlbmQgJiYgcGxvdC5sZWdlbmQuY29udGFpbmVyKXtcclxuICAgICAgICAgICAgICAgIHBsb3QubGVnZW5kLmNvbnRhaW5lci5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdmFyIGxlZ2VuZFggPSB0aGlzLnBsb3Qud2lkdGggKyB0aGlzLmNvbmZpZy5sZWdlbmQubWFyZ2luO1xyXG4gICAgICAgIHZhciBsZWdlbmRZID0gdGhpcy5jb25maWcubGVnZW5kLm1hcmdpbjtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmQgPSBuZXcgTGVnZW5kKHRoaXMuc3ZnLCB0aGlzLnN2Z0csIHNjYWxlLCBsZWdlbmRYLCBsZWdlbmRZKTtcclxuXHJcbiAgICAgICAgdmFyIGxlZ2VuZExpbmVhciA9IHBsb3QubGVnZW5kLmNvbG9yKClcclxuICAgICAgICAgICAgLnNoYXBlV2lkdGgodGhpcy5jb25maWcubGVnZW5kLnNoYXBlV2lkdGgpXHJcbiAgICAgICAgICAgIC5vcmllbnQoJ3ZlcnRpY2FsJylcclxuICAgICAgICAgICAgLnNjYWxlKHNjYWxlKTtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmQuY29udGFpbmVyXHJcbiAgICAgICAgICAgIC5jYWxsKGxlZ2VuZExpbmVhcik7XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG4iLCJpbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBDaGFydENvbmZpZyB7XHJcbiAgICBjc3NDbGFzc1ByZWZpeCA9IFwib2RjLVwiO1xyXG4gICAgc3ZnQ2xhc3MgPSB0aGlzLmNzc0NsYXNzUHJlZml4ICsgJ213LWQzLWNoYXJ0JztcclxuICAgIHdpZHRoID0gdW5kZWZpbmVkO1xyXG4gICAgaGVpZ2h0ID0gdW5kZWZpbmVkO1xyXG4gICAgbWFyZ2luID0ge1xyXG4gICAgICAgIGxlZnQ6IDUwLFxyXG4gICAgICAgIHJpZ2h0OiAzMCxcclxuICAgICAgICB0b3A6IDMwLFxyXG4gICAgICAgIGJvdHRvbTogNTBcclxuICAgIH07XHJcbiAgICBzaG93VG9vbHRpcCA9IGZhbHNlO1xyXG4gICAgdHJhbnNpdGlvbiA9IHRydWU7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKSB7XHJcbiAgICAgICAgaWYgKGN1c3RvbSkge1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDaGFydCB7XHJcbiAgICB1dGlscyA9IFV0aWxzO1xyXG4gICAgYmFzZUNvbnRhaW5lcjtcclxuICAgIHN2ZztcclxuICAgIGNvbmZpZztcclxuICAgIHBsb3QgPSB7XHJcbiAgICAgICAgbWFyZ2luOiB7fVxyXG4gICAgfTtcclxuICAgIF9hdHRhY2hlZCA9IHt9O1xyXG4gICAgX2xheWVycyA9IHt9O1xyXG4gICAgX2V2ZW50cyA9IHt9O1xyXG4gICAgX2lzQXR0YWNoZWQ7XHJcbiAgICBfaXNJbml0aWFsaXplZD1mYWxzZTtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoYmFzZSwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5faXNBdHRhY2hlZCA9IGJhc2UgaW5zdGFuY2VvZiBDaGFydDtcclxuXHJcbiAgICAgICAgdGhpcy5iYXNlQ29udGFpbmVyID0gYmFzZTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRDb25maWcoY29uZmlnKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXREYXRhKGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICAgICAgdGhpcy5wb3N0SW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpIHtcclxuICAgICAgICBpZiAoIWNvbmZpZykge1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IG5ldyBDaGFydENvbmZpZygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGF0YShkYXRhKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcblxyXG4gICAgICAgIHNlbGYuaW5pdFBsb3QoKTtcclxuICAgICAgICBzZWxmLmluaXRTdmcoKTtcclxuXHJcbiAgICAgICAgc2VsZi5pbml0VG9vbHRpcCgpO1xyXG4gICAgICAgIHNlbGYuZHJhdygpO1xyXG4gICAgICAgIHRoaXMuX2lzSW5pdGlhbGl6ZWQ9dHJ1ZTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwb3N0SW5pdCgpe1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBpbml0U3ZnKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgY29uZmlnID0gdGhpcy5jb25maWc7XHJcbiAgICAgICAgY29uc29sZS5sb2coY29uZmlnLnN2Z0NsYXNzKTtcclxuXHJcbiAgICAgICAgdmFyIG1hcmdpbiA9IHNlbGYucGxvdC5tYXJnaW47XHJcbiAgICAgICAgdmFyIHdpZHRoID0gc2VsZi5wbG90LndpZHRoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQ7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IHNlbGYucGxvdC5oZWlnaHQgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbTtcclxuICAgICAgICB2YXIgYXNwZWN0ID0gd2lkdGggLyBoZWlnaHQ7XHJcbiAgICAgICAgaWYoIXNlbGYuX2lzQXR0YWNoZWQpe1xyXG4gICAgICAgICAgICBpZighdGhpcy5faXNJbml0aWFsaXplZCl7XHJcbiAgICAgICAgICAgICAgICBkMy5zZWxlY3Qoc2VsZi5iYXNlQ29udGFpbmVyKS5zZWxlY3QoXCJzdmdcIikucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2VsZi5zdmcgPSBkMy5zZWxlY3Qoc2VsZi5iYXNlQ29udGFpbmVyKS5zZWxlY3RPckFwcGVuZChcInN2Z1wiKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuc3ZnXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ2aWV3Qm94XCIsIFwiMCAwIFwiICsgXCIgXCIgKyB3aWR0aCArIFwiIFwiICsgaGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJwcmVzZXJ2ZUFzcGVjdFJhdGlvXCIsIFwieE1pZFlNaWQgbWVldFwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBjb25maWcuc3ZnQ2xhc3MpO1xyXG4gICAgICAgICAgICBzZWxmLnN2Z0cgPSBzZWxmLnN2Zy5zZWxlY3RPckFwcGVuZChcImcubWFpbi1ncm91cFwiKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5iYXNlQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgc2VsZi5zdmcgPSBzZWxmLmJhc2VDb250YWluZXIuc3ZnO1xyXG4gICAgICAgICAgICBzZWxmLnN2Z0cgPSBzZWxmLnN2Zy5zZWxlY3RPckFwcGVuZChcImcubWFpbi1ncm91cC5cIitjb25maWcuc3ZnQ2xhc3MpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWxmLnN2Z0cuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIG1hcmdpbi5sZWZ0ICsgXCIsXCIgKyBtYXJnaW4udG9wICsgXCIpXCIpO1xyXG5cclxuICAgICAgICBpZiAoIWNvbmZpZy53aWR0aCB8fCBjb25maWcuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdCh3aW5kb3cpXHJcbiAgICAgICAgICAgICAgICAub24oXCJyZXNpemVcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vVE9ETyBhZGQgcmVzcG9uc2l2ZW5lc3MgaWYgd2lkdGgvaGVpZ2h0IG5vdCBzcGVjaWZpZWRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0VG9vbHRpcCgpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBpZiAoc2VsZi5jb25maWcuc2hvd1Rvb2x0aXApIHtcclxuICAgICAgICAgICAgaWYoIXNlbGYuX2lzQXR0YWNoZWQgKXtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC50b29sdGlwID0gZDMuc2VsZWN0KFwiYm9keVwiKS5zZWxlY3RPckFwcGVuZCgnZGl2Licrc2VsZi5jb25maWcuY3NzQ2xhc3NQcmVmaXgrJ3Rvb2x0aXAnKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wbG90LnRvb2x0aXA9IHNlbGYuYmFzZUNvbnRhaW5lci5wbG90LnRvb2x0aXA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCkge1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSB0aGlzLmNvbmZpZy5tYXJnaW47XHJcbiAgICAgICAgdGhpcy5wbG90ID0gdGhpcy5wbG90IHx8IHt9O1xyXG4gICAgICAgIHRoaXMucGxvdC5tYXJnaW4gPSB7XHJcbiAgICAgICAgICAgIHRvcDogbWFyZ2luLnRvcCxcclxuICAgICAgICAgICAgYm90dG9tOiBtYXJnaW4uYm90dG9tLFxyXG4gICAgICAgICAgICBsZWZ0OiBtYXJnaW4ubGVmdCxcclxuICAgICAgICAgICAgcmlnaHQ6IG1hcmdpbi5yaWdodFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRhdGEpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsYXllck5hbWUsIGF0dGFjaG1lbnREYXRhO1xyXG4gICAgICAgIGZvciAodmFyIGF0dGFjaG1lbnROYW1lIGluIHRoaXMuX2F0dGFjaGVkKSB7XHJcblxyXG4gICAgICAgICAgICBhdHRhY2htZW50RGF0YSA9IGRhdGE7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9hdHRhY2hlZFthdHRhY2htZW50TmFtZV0udXBkYXRlKGF0dGFjaG1lbnREYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhdyhkYXRhKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoZGF0YSk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy9Cb3Jyb3dlZCBmcm9tIGQzLmNoYXJ0XHJcbiAgICAvKipcclxuICAgICAqIFJlZ2lzdGVyIG9yIHJldHJpZXZlIGFuIFwiYXR0YWNobWVudFwiIENoYXJ0LiBUaGUgXCJhdHRhY2htZW50XCIgY2hhcnQncyBgZHJhd2BcclxuICAgICAqIG1ldGhvZCB3aWxsIGJlIGludm9rZWQgd2hlbmV2ZXIgdGhlIGNvbnRhaW5pbmcgY2hhcnQncyBgZHJhd2AgbWV0aG9kIGlzXHJcbiAgICAgKiBpbnZva2VkLlxyXG4gICAgICpcclxuICAgICAqIEBleHRlcm5hbEV4YW1wbGUgY2hhcnQtYXR0YWNoXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF0dGFjaG1lbnROYW1lIE5hbWUgb2YgdGhlIGF0dGFjaG1lbnRcclxuICAgICAqIEBwYXJhbSB7Q2hhcnR9IFtjaGFydF0gQ2hhcnQgdG8gcmVnaXN0ZXIgYXMgYSBtaXggaW4gb2YgdGhpcyBjaGFydC4gV2hlblxyXG4gICAgICogICAgICAgIHVuc3BlY2lmaWVkLCB0aGlzIG1ldGhvZCB3aWxsIHJldHVybiB0aGUgYXR0YWNobWVudCBwcmV2aW91c2x5XHJcbiAgICAgKiAgICAgICAgcmVnaXN0ZXJlZCB3aXRoIHRoZSBzcGVjaWZpZWQgYGF0dGFjaG1lbnROYW1lYCAoaWYgYW55KS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Q2hhcnR9IFJlZmVyZW5jZSB0byB0aGlzIGNoYXJ0IChjaGFpbmFibGUpLlxyXG4gICAgICovXHJcbiAgICBhdHRhY2goYXR0YWNobWVudE5hbWUsIGNoYXJ0KSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2F0dGFjaGVkW2F0dGFjaG1lbnROYW1lXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2F0dGFjaGVkW2F0dGFjaG1lbnROYW1lXSA9IGNoYXJ0O1xyXG4gICAgICAgIHJldHVybiBjaGFydDtcclxuICAgIH07XHJcblxyXG4gICAgXHJcblxyXG4gICAgLy9Cb3Jyb3dlZCBmcm9tIGQzLmNoYXJ0XHJcbiAgICAvKipcclxuICAgICAqIFN1YnNjcmliZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGFuIGV2ZW50IHRyaWdnZXJlZCBvbiB0aGUgY2hhcnQuIFNlZSB7QGxpbmtcclxuICAgICAgICAqIENoYXJ0I29uY2V9IHRvIHN1YnNjcmliZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGFuIGV2ZW50IGZvciBvbmUgb2NjdXJlbmNlLlxyXG4gICAgICpcclxuICAgICAqIEBleHRlcm5hbEV4YW1wbGUge3J1bm5hYmxlfSBjaGFydC1vblxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGV2ZW50XHJcbiAgICAgKiBAcGFyYW0ge0NoYXJ0RXZlbnRIYW5kbGVyfSBjYWxsYmFjayBGdW5jdGlvbiB0byBiZSBpbnZva2VkIHdoZW4gdGhlIGV2ZW50XHJcbiAgICAgKiAgICAgICAgb2NjdXJzXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbnRleHRdIFZhbHVlIHRvIHNldCBhcyBgdGhpc2Agd2hlbiBpbnZva2luZyB0aGVcclxuICAgICAqICAgICAgICBgY2FsbGJhY2tgLiBEZWZhdWx0cyB0byB0aGUgY2hhcnQgaW5zdGFuY2UuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0NoYXJ0fSBBIHJlZmVyZW5jZSB0byB0aGlzIGNoYXJ0IChjaGFpbmFibGUpLlxyXG4gICAgICovXHJcbiAgICBvbihuYW1lLCBjYWxsYmFjaywgY29udGV4dCkge1xyXG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLl9ldmVudHNbbmFtZV0gfHwgKHRoaXMuX2V2ZW50c1tuYW1lXSA9IFtdKTtcclxuICAgICAgICBldmVudHMucHVzaCh7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcclxuICAgICAgICAgICAgY29udGV4dDogY29udGV4dCB8fCB0aGlzLFxyXG4gICAgICAgICAgICBfY2hhcnQ6IHRoaXNcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvL0JvcnJvd2VkIGZyb20gZDMuY2hhcnRcclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIFN1YnNjcmliZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGFuIGV2ZW50IHRyaWdnZXJlZCBvbiB0aGUgY2hhcnQuIFRoaXNcclxuICAgICAqIGZ1bmN0aW9uIHdpbGwgYmUgaW52b2tlZCBhdCB0aGUgbmV4dCBvY2N1cmFuY2Ugb2YgdGhlIGV2ZW50IGFuZCBpbW1lZGlhdGVseVxyXG4gICAgICogdW5zdWJzY3JpYmVkLiBTZWUge0BsaW5rIENoYXJ0I29ufSB0byBzdWJzY3JpYmUgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBhblxyXG4gICAgICogZXZlbnQgaW5kZWZpbml0ZWx5LlxyXG4gICAgICpcclxuICAgICAqIEBleHRlcm5hbEV4YW1wbGUge3J1bm5hYmxlfSBjaGFydC1vbmNlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgZXZlbnRcclxuICAgICAqIEBwYXJhbSB7Q2hhcnRFdmVudEhhbmRsZXJ9IGNhbGxiYWNrIEZ1bmN0aW9uIHRvIGJlIGludm9rZWQgd2hlbiB0aGUgZXZlbnRcclxuICAgICAqICAgICAgICBvY2N1cnNcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF0gVmFsdWUgdG8gc2V0IGFzIGB0aGlzYCB3aGVuIGludm9raW5nIHRoZVxyXG4gICAgICogICAgICAgIGBjYWxsYmFja2AuIERlZmF1bHRzIHRvIHRoZSBjaGFydCBpbnN0YW5jZVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtDaGFydH0gQSByZWZlcmVuY2UgdG8gdGhpcyBjaGFydCAoY2hhaW5hYmxlKVxyXG4gICAgICovXHJcbiAgICBvbmNlKG5hbWUsIGNhbGxiYWNrLCBjb250ZXh0KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBvbmNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZWxmLm9mZihuYW1lLCBvbmNlKTtcclxuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uKG5hbWUsIG9uY2UsIGNvbnRleHQpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvL0JvcnJvd2VkIGZyb20gZDMuY2hhcnRcclxuICAgIC8qKlxyXG4gICAgICogVW5zdWJzY3JpYmUgb25lIG9yIG1vcmUgY2FsbGJhY2sgZnVuY3Rpb25zIGZyb20gYW4gZXZlbnQgdHJpZ2dlcmVkIG9uIHRoZVxyXG4gICAgICogY2hhcnQuIFdoZW4gbm8gYXJndW1lbnRzIGFyZSBzcGVjaWZpZWQsICphbGwqIGhhbmRsZXJzIHdpbGwgYmUgdW5zdWJzY3JpYmVkLlxyXG4gICAgICogV2hlbiBvbmx5IGEgYG5hbWVgIGlzIHNwZWNpZmllZCwgYWxsIGhhbmRsZXJzIHN1YnNjcmliZWQgdG8gdGhhdCBldmVudCB3aWxsXHJcbiAgICAgKiBiZSB1bnN1YnNjcmliZWQuIFdoZW4gYSBgbmFtZWAgYW5kIGBjYWxsYmFja2AgYXJlIHNwZWNpZmllZCwgb25seSB0aGF0XHJcbiAgICAgKiBmdW5jdGlvbiB3aWxsIGJlIHVuc3Vic2NyaWJlZCBmcm9tIHRoYXQgZXZlbnQuIFdoZW4gYSBgbmFtZWAgYW5kIGBjb250ZXh0YFxyXG4gICAgICogYXJlIHNwZWNpZmllZCAoYnV0IGBjYWxsYmFja2AgaXMgb21pdHRlZCksIGFsbCBldmVudHMgYm91bmQgdG8gdGhlIGdpdmVuXHJcbiAgICAgKiBldmVudCB3aXRoIHRoZSBnaXZlbiBjb250ZXh0IHdpbGwgYmUgdW5zdWJzY3JpYmVkLlxyXG4gICAgICpcclxuICAgICAqIEBleHRlcm5hbEV4YW1wbGUge3J1bm5hYmxlfSBjaGFydC1vZmZcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW25hbWVdIE5hbWUgb2YgdGhlIGV2ZW50IHRvIGJlIHVuc3Vic2NyaWJlZFxyXG4gICAgICogQHBhcmFtIHtDaGFydEV2ZW50SGFuZGxlcn0gW2NhbGxiYWNrXSBGdW5jdGlvbiB0byBiZSB1bnN1YnNjcmliZWRcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF0gQ29udGV4dHMgdG8gYmUgdW5zdWJzY3JpYmVcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Q2hhcnR9IEEgcmVmZXJlbmNlIHRvIHRoaXMgY2hhcnQgKGNoYWluYWJsZSkuXHJcbiAgICAgKi9cclxuXHJcbiAgICBvZmYobmFtZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgbmFtZXMsIG4sIGV2ZW50cywgZXZlbnQsIGksIGo7XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSBhbGwgZXZlbnRzXHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgZm9yIChuYW1lIGluIHRoaXMuX2V2ZW50cykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW25hbWVdLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyByZW1vdmUgYWxsIGV2ZW50cyBmb3IgYSBzcGVjaWZpYyBuYW1lXHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgZXZlbnRzID0gdGhpcy5fZXZlbnRzW25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoZXZlbnRzKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudHMubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggd2hhdGV2ZXIgY29tYmluYXRpb24gb2YgbmFtZSwgY29udGV4dFxyXG4gICAgICAgIC8vIGFuZCBjYWxsYmFjay5cclxuICAgICAgICBuYW1lcyA9IG5hbWUgPyBbbmFtZV0gOiBPYmplY3Qua2V5cyh0aGlzLl9ldmVudHMpO1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBuID0gbmFtZXNbaV07XHJcbiAgICAgICAgICAgIGV2ZW50cyA9IHRoaXMuX2V2ZW50c1tuXTtcclxuICAgICAgICAgICAgaiA9IGV2ZW50cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIHdoaWxlIChqLS0pIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50ID0gZXZlbnRzW2pdO1xyXG4gICAgICAgICAgICAgICAgaWYgKChjYWxsYmFjayAmJiBjYWxsYmFjayA9PT0gZXZlbnQuY2FsbGJhY2spIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgKGNvbnRleHQgJiYgY29udGV4dCA9PT0gZXZlbnQuY29udGV4dCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudHMuc3BsaWNlKGosIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLy9Cb3Jyb3dlZCBmcm9tIGQzLmNoYXJ0XHJcbiAgICAvKipcclxuICAgICAqIFB1Ymxpc2ggYW4gZXZlbnQgb24gdGhpcyBjaGFydCB3aXRoIHRoZSBnaXZlbiBgbmFtZWAuXHJcbiAgICAgKlxyXG4gICAgICogQGV4dGVybmFsRXhhbXBsZSB7cnVubmFibGV9IGNoYXJ0LXRyaWdnZXJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBldmVudCB0byBwdWJsaXNoXHJcbiAgICAgKiBAcGFyYW0gey4uLip9IGFyZ3VtZW50cyBWYWx1ZXMgd2l0aCB3aGljaCB0byBpbnZva2UgdGhlIHJlZ2lzdGVyZWRcclxuICAgICAqICAgICAgICBjYWxsYmFja3MuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0NoYXJ0fSBBIHJlZmVyZW5jZSB0byB0aGlzIGNoYXJ0IChjaGFpbmFibGUpLlxyXG4gICAgICovXHJcbiAgICB0cmlnZ2VyKG5hbWUpIHtcclxuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XHJcbiAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50c1tuYW1lXTtcclxuICAgICAgICB2YXIgaSwgZXY7XHJcblxyXG4gICAgICAgIGlmIChldmVudHMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZXZlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBldiA9IGV2ZW50c1tpXTtcclxuICAgICAgICAgICAgICAgIGV2LmNhbGxiYWNrLmFwcGx5KGV2LmNvbnRleHQsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBnZXRCYXNlQ29udGFpbmVyKCl7XHJcbiAgICAgICAgaWYodGhpcy5faXNBdHRhY2hlZCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJhc2VDb250YWluZXIuc3ZnO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZDMuc2VsZWN0KHRoaXMuYmFzZUNvbnRhaW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QmFzZUNvbnRhaW5lck5vZGUoKXtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QmFzZUNvbnRhaW5lcigpLm5vZGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcmVmaXhDbGFzcyhjbGF6eiwgYWRkRG90KXtcclxuICAgICAgICByZXR1cm4gYWRkRG90PyAnLic6ICcnK3RoaXMuY29uZmlnLmNzc0NsYXNzUHJlZml4K2NsYXp6O1xyXG4gICAgfVxyXG4gICAgY29tcHV0ZVBsb3RTaXplKCkge1xyXG4gICAgICAgIHRoaXMucGxvdC53aWR0aCA9IFV0aWxzLmF2YWlsYWJsZVdpZHRoKHRoaXMuY29uZmlnLndpZHRoLCB0aGlzLmdldEJhc2VDb250YWluZXIoKSwgdGhpcy5wbG90Lm1hcmdpbik7XHJcbiAgICAgICAgdGhpcy5wbG90LmhlaWdodCA9IFV0aWxzLmF2YWlsYWJsZUhlaWdodCh0aGlzLmNvbmZpZy5oZWlnaHQsIHRoaXMuZ2V0QmFzZUNvbnRhaW5lcigpLCB0aGlzLnBsb3QubWFyZ2luKTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2l0aW9uRW5hYmxlZCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc0luaXRpYWxpemVkICYmIHRoaXMuY29uZmlnLnRyYW5zaXRpb247XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDaGFydCwgQ2hhcnRDb25maWd9IGZyb20gXCIuL2NoYXJ0XCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7U3RhdGlzdGljc1V0aWxzfSBmcm9tICcuL3N0YXRpc3RpY3MtdXRpbHMnXHJcbmltcG9ydCB7TGVnZW5kfSBmcm9tICcuL2xlZ2VuZCdcclxuaW1wb3J0IHtTY2F0dGVyUGxvdH0gZnJvbSAnLi9zY2F0dGVycGxvdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBDb3JyZWxhdGlvbk1hdHJpeENvbmZpZyBleHRlbmRzIENoYXJ0Q29uZmlnIHtcclxuXHJcbiAgICBzdmdDbGFzcyA9IHRoaXMuY3NzQ2xhc3NQcmVmaXgrJ2NvcnJlbGF0aW9uLW1hdHJpeCc7XHJcbiAgICBndWlkZXMgPSBmYWxzZTsgLy9zaG93IGF4aXMgZ3VpZGVzXHJcbiAgICBzaG93VG9vbHRpcCA9IHRydWU7IC8vc2hvdyB0b29sdGlwIG9uIGRvdCBob3ZlclxyXG4gICAgc2hvd0xlZ2VuZCA9IHRydWU7XHJcbiAgICBoaWdobGlnaHRMYWJlbHMgPSB0cnVlO1xyXG4gICAgcm90YXRlTGFiZWxzWCA9IHRydWU7XHJcbiAgICByb3RhdGVMYWJlbHNZID0gdHJ1ZTtcclxuICAgIHZhcmlhYmxlcyA9IHtcclxuICAgICAgICBsYWJlbHM6IHVuZGVmaW5lZCxcclxuICAgICAgICBrZXlzOiBbXSwgLy9vcHRpb25hbCBhcnJheSBvZiB2YXJpYWJsZSBrZXlzXHJcbiAgICAgICAgdmFsdWU6IChkLCB2YXJpYWJsZUtleSkgPT4gZFt2YXJpYWJsZUtleV0sIC8vIHZhcmlhYmxlIHZhbHVlIGFjY2Vzc29yXHJcbiAgICAgICAgc2NhbGU6IFwib3JkaW5hbFwiXHJcbiAgICB9O1xyXG4gICAgY29ycmVsYXRpb24gPSB7XHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCIsXHJcbiAgICAgICAgZG9tYWluOiBbLTEsIC0wLjc1LCAtMC41LCAwLCAwLjUsIDAuNzUsIDFdLFxyXG4gICAgICAgIHJhbmdlOiBbXCJkYXJrYmx1ZVwiLCBcImJsdWVcIiwgXCJsaWdodHNreWJsdWVcIiwgXCJ3aGl0ZVwiLCBcIm9yYW5nZXJlZFwiLCBcImNyaW1zb25cIiwgXCJkYXJrcmVkXCJdLFxyXG4gICAgICAgIHZhbHVlOiAoeFZhbHVlcywgeVZhbHVlcykgPT4gU3RhdGlzdGljc1V0aWxzLnNhbXBsZUNvcnJlbGF0aW9uKHhWYWx1ZXMsIHlWYWx1ZXMpXHJcblxyXG4gICAgfTtcclxuICAgIGNlbGwgPSB7XHJcbiAgICAgICAgc2hhcGU6IFwiZWxsaXBzZVwiLCAvL3Bvc3NpYmxlIHZhbHVlczogcmVjdCwgY2lyY2xlLCBlbGxpcHNlXHJcbiAgICAgICAgc2l6ZTogdW5kZWZpbmVkLFxyXG4gICAgICAgIHNpemVNaW46IDE1LFxyXG4gICAgICAgIHNpemVNYXg6IDI1MCxcclxuICAgICAgICBwYWRkaW5nOiAxXHJcbiAgICB9O1xyXG4gICAgbWFyZ2luID0ge1xyXG4gICAgICAgIGxlZnQ6IDYwLFxyXG4gICAgICAgIHJpZ2h0OiA1MCxcclxuICAgICAgICB0b3A6IDMwLFxyXG4gICAgICAgIGJvdHRvbTogNjBcclxuICAgIH07XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBpZiAoY3VzdG9tKSB7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb3JyZWxhdGlvbk1hdHJpeCBleHRlbmRzIENoYXJ0IHtcclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIG5ldyBDb3JyZWxhdGlvbk1hdHJpeENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgQ29ycmVsYXRpb25NYXRyaXhDb25maWcoY29uZmlnKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSB0aGlzLmNvbmZpZy5tYXJnaW47XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnggPSB7fTtcclxuICAgICAgICB0aGlzLnBsb3QuY29ycmVsYXRpb24gPSB7XHJcbiAgICAgICAgICAgIG1hdHJpeDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBjZWxsczogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBjb2xvcjoge30sXHJcbiAgICAgICAgICAgIHNoYXBlOiB7fVxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICB0aGlzLnNldHVwVmFyaWFibGVzKCk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gY29uZi53aWR0aDtcclxuICAgICAgICB2YXIgcGxhY2Vob2xkZXJOb2RlID0gdGhpcy5nZXRCYXNlQ29udGFpbmVyTm9kZSgpO1xyXG4gICAgICAgIHRoaXMucGxvdC5wbGFjZWhvbGRlck5vZGUgPSBwbGFjZWhvbGRlck5vZGU7XHJcblxyXG4gICAgICAgIHZhciBwYXJlbnRXaWR0aCA9IHBsYWNlaG9sZGVyTm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcclxuICAgICAgICBpZiAod2lkdGgpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wbG90LmNlbGxTaXplKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuY2VsbFNpemUgPSBNYXRoLm1heChjb25mLmNlbGwuc2l6ZU1pbiwgTWF0aC5taW4oY29uZi5jZWxsLnNpemVNYXgsICh3aWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0KSAvIHRoaXMucGxvdC52YXJpYWJsZXMubGVuZ3RoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxTaXplID0gdGhpcy5jb25maWcuY2VsbC5zaXplO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLnBsb3QuY2VsbFNpemUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsU2l6ZSA9IE1hdGgubWF4KGNvbmYuY2VsbC5zaXplTWluLCBNYXRoLm1pbihjb25mLmNlbGwuc2l6ZU1heCwgKHBhcmVudFdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQpIC8gdGhpcy5wbG90LnZhcmlhYmxlcy5sZW5ndGgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgd2lkdGggPSB0aGlzLnBsb3QuY2VsbFNpemUgKiB0aGlzLnBsb3QudmFyaWFibGVzLmxlbmd0aCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0O1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBoZWlnaHQgPSB3aWR0aDtcclxuICAgICAgICBpZiAoIWhlaWdodCkge1xyXG4gICAgICAgICAgICBoZWlnaHQgPSBwbGFjZWhvbGRlck5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wbG90LndpZHRoID0gd2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodDtcclxuICAgICAgICB0aGlzLnBsb3QuaGVpZ2h0ID0gdGhpcy5wbG90LndpZHRoO1xyXG5cclxuICAgICAgICB0aGlzLnNldHVwVmFyaWFibGVzU2NhbGVzKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cENvcnJlbGF0aW9uU2NhbGVzKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cENvcnJlbGF0aW9uTWF0cml4KCk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cFZhcmlhYmxlc1NjYWxlcygpIHtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHggPSBwbG90Lng7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZy52YXJpYWJsZXM7XHJcblxyXG4gICAgICAgIC8qICpcclxuICAgICAgICAgKiB2YWx1ZSBhY2Nlc3NvciAtIHJldHVybnMgdGhlIHZhbHVlIHRvIGVuY29kZSBmb3IgYSBnaXZlbiBkYXRhIG9iamVjdC5cclxuICAgICAgICAgKiBzY2FsZSAtIG1hcHMgdmFsdWUgdG8gYSB2aXN1YWwgZGlzcGxheSBlbmNvZGluZywgc3VjaCBhcyBhIHBpeGVsIHBvc2l0aW9uLlxyXG4gICAgICAgICAqIG1hcCBmdW5jdGlvbiAtIG1hcHMgZnJvbSBkYXRhIHZhbHVlIHRvIGRpc3BsYXkgdmFsdWVcclxuICAgICAgICAgKiBheGlzIC0gc2V0cyB1cCBheGlzXHJcbiAgICAgICAgICoqL1xyXG4gICAgICAgIHgudmFsdWUgPSBjb25mLnZhbHVlO1xyXG4gICAgICAgIHguc2NhbGUgPSBkMy5zY2FsZVtjb25mLnNjYWxlXSgpLnJhbmdlQmFuZHMoW3Bsb3Qud2lkdGgsIDBdKTtcclxuICAgICAgICB4Lm1hcCA9IGQgPT4geC5zY2FsZSh4LnZhbHVlKGQpKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwQ29ycmVsYXRpb25TY2FsZXMoKSB7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIGNvcnJDb25mID0gdGhpcy5jb25maWcuY29ycmVsYXRpb247XHJcblxyXG4gICAgICAgIHBsb3QuY29ycmVsYXRpb24uY29sb3Iuc2NhbGUgPSBkMy5zY2FsZVtjb3JyQ29uZi5zY2FsZV0oKS5kb21haW4oY29yckNvbmYuZG9tYWluKS5yYW5nZShjb3JyQ29uZi5yYW5nZSk7XHJcbiAgICAgICAgdmFyIHNoYXBlID0gcGxvdC5jb3JyZWxhdGlvbi5zaGFwZSA9IHt9O1xyXG5cclxuICAgICAgICB2YXIgY2VsbENvbmYgPSB0aGlzLmNvbmZpZy5jZWxsO1xyXG4gICAgICAgIHNoYXBlLnR5cGUgPSBjZWxsQ29uZi5zaGFwZTtcclxuXHJcbiAgICAgICAgdmFyIHNoYXBlU2l6ZSA9IHBsb3QuY2VsbFNpemUgLSBjZWxsQ29uZi5wYWRkaW5nICogMjtcclxuICAgICAgICBpZiAoc2hhcGUudHlwZSA9PSAnY2lyY2xlJykge1xyXG4gICAgICAgICAgICB2YXIgcmFkaXVzTWF4ID0gc2hhcGVTaXplIC8gMjtcclxuICAgICAgICAgICAgc2hhcGUucmFkaXVzU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzAsIDFdKS5yYW5nZShbMiwgcmFkaXVzTWF4XSk7XHJcbiAgICAgICAgICAgIHNoYXBlLnJhZGl1cyA9IGM9PiBzaGFwZS5yYWRpdXNTY2FsZShNYXRoLmFicyhjLnZhbHVlKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzaGFwZS50eXBlID09ICdlbGxpcHNlJykge1xyXG4gICAgICAgICAgICB2YXIgcmFkaXVzTWF4ID0gc2hhcGVTaXplIC8gMjtcclxuICAgICAgICAgICAgc2hhcGUucmFkaXVzU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzAsIDFdKS5yYW5nZShbcmFkaXVzTWF4LCAyXSk7XHJcbiAgICAgICAgICAgIHNoYXBlLnJhZGl1c1ggPSBjPT4gc2hhcGUucmFkaXVzU2NhbGUoTWF0aC5hYnMoYy52YWx1ZSkpO1xyXG4gICAgICAgICAgICBzaGFwZS5yYWRpdXNZID0gcmFkaXVzTWF4O1xyXG5cclxuICAgICAgICAgICAgc2hhcGUucm90YXRlVmFsID0gdiA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodiA9PSAwKSByZXR1cm4gXCIwXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAodiA8IDApIHJldHVybiBcIi00NVwiO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiNDVcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChzaGFwZS50eXBlID09ICdyZWN0Jykge1xyXG4gICAgICAgICAgICBzaGFwZS5zaXplID0gc2hhcGVTaXplO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNldHVwVmFyaWFibGVzKCkge1xyXG5cclxuICAgICAgICB2YXIgdmFyaWFibGVzQ29uZiA9IHRoaXMuY29uZmlnLnZhcmlhYmxlcztcclxuXHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgcGxvdC5kb21haW5CeVZhcmlhYmxlID0ge307XHJcbiAgICAgICAgcGxvdC52YXJpYWJsZXMgPSB2YXJpYWJsZXNDb25mLmtleXM7XHJcbiAgICAgICAgaWYgKCFwbG90LnZhcmlhYmxlcyB8fCAhcGxvdC52YXJpYWJsZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHBsb3QudmFyaWFibGVzID0gVXRpbHMuaW5mZXJWYXJpYWJsZXMoZGF0YSwgdGhpcy5jb25maWcuZ3JvdXBzLmtleSwgdGhpcy5jb25maWcuaW5jbHVkZUluUGxvdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwbG90LmxhYmVscyA9IFtdO1xyXG4gICAgICAgIHBsb3QubGFiZWxCeVZhcmlhYmxlID0ge307XHJcbiAgICAgICAgcGxvdC52YXJpYWJsZXMuZm9yRWFjaCgodmFyaWFibGVLZXksIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHBsb3QuZG9tYWluQnlWYXJpYWJsZVt2YXJpYWJsZUtleV0gPSBkMy5leHRlbnQoZGF0YSwgKGQpID0+IHZhcmlhYmxlc0NvbmYudmFsdWUoZCwgdmFyaWFibGVLZXkpKTtcclxuICAgICAgICAgICAgdmFyIGxhYmVsID0gdmFyaWFibGVLZXk7XHJcbiAgICAgICAgICAgIGlmICh2YXJpYWJsZXNDb25mLmxhYmVscyAmJiB2YXJpYWJsZXNDb25mLmxhYmVscy5sZW5ndGggPiBpbmRleCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxhYmVsID0gdmFyaWFibGVzQ29uZi5sYWJlbHNbaW5kZXhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBsb3QubGFiZWxzLnB1c2gobGFiZWwpO1xyXG4gICAgICAgICAgICBwbG90LmxhYmVsQnlWYXJpYWJsZVt2YXJpYWJsZUtleV0gPSBsYWJlbDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2cocGxvdC5sYWJlbEJ5VmFyaWFibGUpO1xyXG5cclxuICAgIH07XHJcblxyXG5cclxuICAgIHNldHVwQ29ycmVsYXRpb25NYXRyaXgoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIHZhciBtYXRyaXggPSB0aGlzLnBsb3QuY29ycmVsYXRpb24ubWF0cml4ID0gW107XHJcbiAgICAgICAgdmFyIG1hdHJpeENlbGxzID0gdGhpcy5wbG90LmNvcnJlbGF0aW9uLm1hdHJpeC5jZWxscyA9IFtdO1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG5cclxuICAgICAgICB2YXIgdmFyaWFibGVUb1ZhbHVlcyA9IHt9O1xyXG4gICAgICAgIHBsb3QudmFyaWFibGVzLmZvckVhY2goKHYsIGkpID0+IHtcclxuXHJcbiAgICAgICAgICAgIHZhcmlhYmxlVG9WYWx1ZXNbdl0gPSBkYXRhLm1hcChkPT5wbG90LngudmFsdWUoZCwgdikpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBwbG90LnZhcmlhYmxlcy5mb3JFYWNoKCh2MSwgaSkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgcm93ID0gW107XHJcbiAgICAgICAgICAgIG1hdHJpeC5wdXNoKHJvdyk7XHJcblxyXG4gICAgICAgICAgICBwbG90LnZhcmlhYmxlcy5mb3JFYWNoKCh2MiwgaikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvcnIgPSAxO1xyXG4gICAgICAgICAgICAgICAgaWYgKHYxICE9IHYyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29yciA9IHNlbGYuY29uZmlnLmNvcnJlbGF0aW9uLnZhbHVlKHZhcmlhYmxlVG9WYWx1ZXNbdjFdLCB2YXJpYWJsZVRvVmFsdWVzW3YyXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgY2VsbCA9IHtcclxuICAgICAgICAgICAgICAgICAgICByb3dWYXI6IHYxLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbFZhcjogdjIsXHJcbiAgICAgICAgICAgICAgICAgICAgcm93OiBpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbDogaixcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogY29yclxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJvdy5wdXNoKGNlbGwpO1xyXG5cclxuICAgICAgICAgICAgICAgIG1hdHJpeENlbGxzLnB1c2goY2VsbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgdXBkYXRlKG5ld0RhdGEpIHtcclxuICAgICAgICBzdXBlci51cGRhdGUobmV3RGF0YSk7XHJcbiAgICAgICAgLy8gdGhpcy51cGRhdGVcclxuICAgICAgICB0aGlzLnVwZGF0ZUNlbGxzKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWYXJpYWJsZUxhYmVscygpO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnNob3dMZWdlbmQpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVMZWdlbmQoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHVwZGF0ZVZhcmlhYmxlTGFiZWxzKCkge1xyXG4gICAgICAgIHRoaXMucGxvdC5sYWJlbENsYXNzID0gdGhpcy5wcmVmaXhDbGFzcyhcImxhYmVsXCIpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQXhpc1goKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUF4aXNZKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlQXhpc1goKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBsYWJlbENsYXNzID0gcGxvdC5sYWJlbENsYXNzO1xyXG4gICAgICAgIHZhciBsYWJlbFhDbGFzcyA9IGxhYmVsQ2xhc3MgKyBcIi14XCI7XHJcblxyXG4gICAgICAgIHZhciBsYWJlbHMgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIGxhYmVsWENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShwbG90LnZhcmlhYmxlcywgKGQsIGkpPT5pKTtcclxuXHJcbiAgICAgICAgbGFiZWxzLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKS5hdHRyKFwiY2xhc3NcIiwgKGQsIGkpID0+IGxhYmVsQ2xhc3MgKyBcIiBcIiArIGxhYmVsWENsYXNzICsgXCIgXCIgKyBsYWJlbFhDbGFzcyArIFwiLVwiICsgaSk7XHJcblxyXG4gICAgICAgIGxhYmVsc1xyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgKGQsIGkpID0+IGkgKiBwbG90LmNlbGxTaXplICsgcGxvdC5jZWxsU2l6ZSAvIDIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCBwbG90LmhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoXCJkeFwiLCAtMilcclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCA1KVxyXG4gICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpXHJcblxyXG4gICAgICAgICAgICAvLyAuYXR0cihcImRvbWluYW50LWJhc2VsaW5lXCIsIFwiaGFuZ2luZ1wiKVxyXG4gICAgICAgICAgICAudGV4dCh2PT5wbG90LmxhYmVsQnlWYXJpYWJsZVt2XSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5yb3RhdGVMYWJlbHNYKSB7XHJcbiAgICAgICAgICAgIGxhYmVscy5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInJvdGF0ZSgtNDUsIFwiICsgKGkgKiBwbG90LmNlbGxTaXplICsgcGxvdC5jZWxsU2l6ZSAvIDIgICkgKyBcIiwgXCIgKyBwbG90LmhlaWdodCArIFwiKVwiKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG1heFdpZHRoID0gc2VsZi5jb21wdXRlWEF4aXNMYWJlbHNXaWR0aCgpO1xyXG4gICAgICAgIGxhYmVscy5lYWNoKGZ1bmN0aW9uIChsYWJlbCkge1xyXG4gICAgICAgICAgICBVdGlscy5wbGFjZVRleHRXaXRoRWxsaXBzaXNBbmRUb29sdGlwKGQzLnNlbGVjdCh0aGlzKSwgbGFiZWwsIG1heFdpZHRoLCBzZWxmLmNvbmZpZy5zaG93VG9vbHRpcCA/IHNlbGYucGxvdC50b29sdGlwIDogZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsYWJlbHMuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUF4aXNZKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgbGFiZWxDbGFzcyA9IHBsb3QubGFiZWxDbGFzcztcclxuICAgICAgICB2YXIgbGFiZWxZQ2xhc3MgPSBwbG90LmxhYmVsQ2xhc3MgKyBcIi15XCI7XHJcbiAgICAgICAgdmFyIGxhYmVscyA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgbGFiZWxZQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBsb3QudmFyaWFibGVzKTtcclxuXHJcbiAgICAgICAgbGFiZWxzLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKTtcclxuXHJcbiAgICAgICAgbGFiZWxzXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgKGQsIGkpID0+IGkgKiBwbG90LmNlbGxTaXplICsgcGxvdC5jZWxsU2l6ZSAvIDIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHhcIiwgLTIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCAoZCwgaSkgPT4gbGFiZWxDbGFzcyArIFwiIFwiICsgbGFiZWxZQ2xhc3MgKyBcIiBcIiArIGxhYmVsWUNsYXNzICsgXCItXCIgKyBpKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcImRvbWluYW50LWJhc2VsaW5lXCIsIFwiaGFuZ2luZ1wiKVxyXG4gICAgICAgICAgICAudGV4dCh2PT5wbG90LmxhYmVsQnlWYXJpYWJsZVt2XSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5yb3RhdGVMYWJlbHNZKSB7XHJcbiAgICAgICAgICAgIGxhYmVsc1xyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwicm90YXRlKC00NSwgXCIgKyAwICsgXCIsIFwiICsgKGkgKiBwbG90LmNlbGxTaXplICsgcGxvdC5jZWxsU2l6ZSAvIDIpICsgXCIpXCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG1heFdpZHRoID0gc2VsZi5jb21wdXRlWUF4aXNMYWJlbHNXaWR0aCgpO1xyXG4gICAgICAgIGxhYmVscy5lYWNoKGZ1bmN0aW9uIChsYWJlbCkge1xyXG4gICAgICAgICAgICBVdGlscy5wbGFjZVRleHRXaXRoRWxsaXBzaXNBbmRUb29sdGlwKGQzLnNlbGVjdCh0aGlzKSwgbGFiZWwsIG1heFdpZHRoLCBzZWxmLmNvbmZpZy5zaG93VG9vbHRpcCA/IHNlbGYucGxvdC50b29sdGlwIDogZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsYWJlbHMuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXB1dGVZQXhpc0xhYmVsc1dpZHRoKCkge1xyXG4gICAgICAgIHZhciBtYXhXaWR0aCA9IHRoaXMucGxvdC5tYXJnaW4ubGVmdDtcclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLnJvdGF0ZUxhYmVsc1kpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1heFdpZHRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWF4V2lkdGggKj0gVXRpbHMuU1FSVF8yO1xyXG4gICAgICAgIHZhciBmb250U2l6ZSA9IDExOyAvL3RvZG8gY2hlY2sgYWN0dWFsIGZvbnQgc2l6ZVxyXG4gICAgICAgIG1heFdpZHRoIC09IGZvbnRTaXplIC8gMjtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1heFdpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXB1dGVYQXhpc0xhYmVsc1dpZHRoKG9mZnNldCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcucm90YXRlTGFiZWxzWCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wbG90LmNlbGxTaXplIC0gMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHNpemUgPSB0aGlzLnBsb3QubWFyZ2luLmJvdHRvbTtcclxuICAgICAgICBzaXplICo9IFV0aWxzLlNRUlRfMjtcclxuICAgICAgICB2YXIgZm9udFNpemUgPSAxMTsgLy90b2RvIGNoZWNrIGFjdHVhbCBmb250IHNpemVcclxuICAgICAgICBzaXplIC09IGZvbnRTaXplIC8gMjtcclxuICAgICAgICByZXR1cm4gc2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVDZWxscygpIHtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBjZWxsQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwiY2VsbFwiKTtcclxuICAgICAgICB2YXIgY2VsbFNoYXBlID0gcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS50eXBlO1xyXG5cclxuICAgICAgICB2YXIgY2VsbHMgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwiZy5cIiArIGNlbGxDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGxvdC5jb3JyZWxhdGlvbi5tYXRyaXguY2VsbHMpO1xyXG5cclxuICAgICAgICB2YXIgY2VsbEVudGVyRyA9IGNlbGxzLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuY2xhc3NlZChjZWxsQ2xhc3MsIHRydWUpO1xyXG4gICAgICAgIGNlbGxzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYz0+IFwidHJhbnNsYXRlKFwiICsgKHBsb3QuY2VsbFNpemUgKiBjLmNvbCArIHBsb3QuY2VsbFNpemUgLyAyKSArIFwiLFwiICsgKHBsb3QuY2VsbFNpemUgKiBjLnJvdyArIHBsb3QuY2VsbFNpemUgLyAyKSArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgY2VsbHMuY2xhc3NlZChzZWxmLmNvbmZpZy5jc3NDbGFzc1ByZWZpeCArIFwic2VsZWN0YWJsZVwiLCAhIXNlbGYuc2NhdHRlclBsb3QpO1xyXG5cclxuICAgICAgICB2YXIgc2VsZWN0b3IgPSBcIio6bm90KC5jZWxsLXNoYXBlLVwiICsgY2VsbFNoYXBlICsgXCIpXCI7XHJcblxyXG4gICAgICAgIHZhciB3cm9uZ1NoYXBlcyA9IGNlbGxzLnNlbGVjdEFsbChzZWxlY3Rvcik7XHJcbiAgICAgICAgd3JvbmdTaGFwZXMucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIHZhciBzaGFwZXMgPSBjZWxscy5zZWxlY3RPckFwcGVuZChjZWxsU2hhcGUgKyBcIi5jZWxsLXNoYXBlLVwiICsgY2VsbFNoYXBlKTtcclxuXHJcbiAgICAgICAgaWYgKHBsb3QuY29ycmVsYXRpb24uc2hhcGUudHlwZSA9PSAnY2lyY2xlJykge1xyXG5cclxuICAgICAgICAgICAgc2hhcGVzXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInJcIiwgcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5yYWRpdXMpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImN4XCIsIDApXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImN5XCIsIDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBsb3QuY29ycmVsYXRpb24uc2hhcGUudHlwZSA9PSAnZWxsaXBzZScpIHtcclxuICAgICAgICAgICAgLy8gY2VsbHMuYXR0cihcInRyYW5zZm9ybVwiLCBjPT4gXCJ0cmFuc2xhdGUoMzAwLDE1MCkgcm90YXRlKFwiK3Bsb3QuY29ycmVsYXRpb24uc2hhcGUucm90YXRlVmFsKGMudmFsdWUpK1wiKVwiKTtcclxuICAgICAgICAgICAgc2hhcGVzXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInJ4XCIsIHBsb3QuY29ycmVsYXRpb24uc2hhcGUucmFkaXVzWClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwicnlcIiwgcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5yYWRpdXNZKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCAwKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCAwKVxyXG5cclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGM9PiBcInJvdGF0ZShcIiArIHBsb3QuY29ycmVsYXRpb24uc2hhcGUucm90YXRlVmFsKGMudmFsdWUpICsgXCIpXCIpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGlmIChwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnR5cGUgPT0gJ3JlY3QnKSB7XHJcbiAgICAgICAgICAgIHNoYXBlc1xyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnNpemUpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnNpemUpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInhcIiwgLXBsb3QuY2VsbFNpemUgLyAyKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIC1wbG90LmNlbGxTaXplIC8gMik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNoYXBlcy5zdHlsZShcImZpbGxcIiwgYz0+IHBsb3QuY29ycmVsYXRpb24uY29sb3Iuc2NhbGUoYy52YWx1ZSkpO1xyXG5cclxuICAgICAgICB2YXIgbW91c2VvdmVyQ2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgdmFyIG1vdXNlb3V0Q2FsbGJhY2tzID0gW107XHJcblxyXG4gICAgICAgIGlmIChwbG90LnRvb2x0aXApIHtcclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3ZlckNhbGxiYWNrcy5wdXNoKGM9PiB7XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDIwMClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIC45KTtcclxuICAgICAgICAgICAgICAgIHZhciBodG1sID0gYy52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC5odG1sKGh0bWwpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZDMuZXZlbnQucGFnZVggKyA1KSArIFwicHhcIilcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBtb3VzZW91dENhbGxiYWNrcy5wdXNoKGM9PiB7XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLmhpZ2hsaWdodExhYmVscykge1xyXG4gICAgICAgICAgICB2YXIgaGlnaGxpZ2h0Q2xhc3MgPSBzZWxmLmNvbmZpZy5jc3NDbGFzc1ByZWZpeCArIFwiaGlnaGxpZ2h0XCI7XHJcbiAgICAgICAgICAgIHZhciB4TGFiZWxDbGFzcyA9IGM9PnBsb3QubGFiZWxDbGFzcyArIFwiLXgtXCIgKyBjLmNvbDtcclxuICAgICAgICAgICAgdmFyIHlMYWJlbENsYXNzID0gYz0+cGxvdC5sYWJlbENsYXNzICsgXCIteS1cIiArIGMucm93O1xyXG5cclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3ZlckNhbGxiYWNrcy5wdXNoKGM9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB4TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHlMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCB0cnVlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLnB1c2goYz0+IHtcclxuICAgICAgICAgICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgeExhYmVsQ2xhc3MoYykpLmNsYXNzZWQoaGlnaGxpZ2h0Q2xhc3MsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgeUxhYmVsQ2xhc3MoYykpLmNsYXNzZWQoaGlnaGxpZ2h0Q2xhc3MsIGZhbHNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgY2VsbHMub24oXCJtb3VzZW92ZXJcIiwgYyA9PiB7XHJcbiAgICAgICAgICAgIG1vdXNlb3ZlckNhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrPT5jYWxsYmFjayhjKSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgYyA9PiB7XHJcbiAgICAgICAgICAgICAgICBtb3VzZW91dENhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrPT5jYWxsYmFjayhjKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjZWxscy5vbihcImNsaWNrXCIsIGM9PiB7XHJcbiAgICAgICAgICAgIHNlbGYudHJpZ2dlcihcImNlbGwtc2VsZWN0ZWRcIiwgYyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICBjZWxscy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHVwZGF0ZUxlZ2VuZCgpIHtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIGxlZ2VuZFggPSB0aGlzLnBsb3Qud2lkdGggKyAxMDtcclxuICAgICAgICB2YXIgbGVnZW5kWSA9IDA7XHJcbiAgICAgICAgdmFyIGJhcldpZHRoID0gMTA7XHJcbiAgICAgICAgdmFyIGJhckhlaWdodCA9IHRoaXMucGxvdC5oZWlnaHQgLSAyO1xyXG4gICAgICAgIHZhciBzY2FsZSA9IHBsb3QuY29ycmVsYXRpb24uY29sb3Iuc2NhbGU7XHJcblxyXG4gICAgICAgIHBsb3QubGVnZW5kID0gbmV3IExlZ2VuZCh0aGlzLnN2ZywgdGhpcy5zdmdHLCBzY2FsZSwgbGVnZW5kWCwgbGVnZW5kWSkubGluZWFyR3JhZGllbnRCYXIoYmFyV2lkdGgsIGJhckhlaWdodCk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBhdHRhY2hTY2F0dGVyUGxvdChjb250YWluZXJTZWxlY3RvciwgY29uZmlnKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBjb25maWcgPSBjb25maWcgfHwge307XHJcblxyXG5cclxuICAgICAgICB2YXIgc2NhdHRlclBsb3RDb25maWcgPSB7XHJcbiAgICAgICAgICAgIGhlaWdodDogc2VsZi5wbG90LmhlaWdodCArIHNlbGYuY29uZmlnLm1hcmdpbi50b3AgKyBzZWxmLmNvbmZpZy5tYXJnaW4uYm90dG9tLFxyXG4gICAgICAgICAgICB3aWR0aDogc2VsZi5wbG90LmhlaWdodCArIHNlbGYuY29uZmlnLm1hcmdpbi50b3AgKyBzZWxmLmNvbmZpZy5tYXJnaW4uYm90dG9tLFxyXG4gICAgICAgICAgICBncm91cHM6IHtcclxuICAgICAgICAgICAgICAgIGtleTogc2VsZi5jb25maWcuZ3JvdXBzLmtleSxcclxuICAgICAgICAgICAgICAgIGxhYmVsOiBzZWxmLmNvbmZpZy5ncm91cHMubGFiZWxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ3VpZGVzOiB0cnVlLFxyXG4gICAgICAgICAgICBzaG93TGVnZW5kOiBmYWxzZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2NhdHRlclBsb3QgPSB0cnVlO1xyXG5cclxuICAgICAgICBzY2F0dGVyUGxvdENvbmZpZyA9IFV0aWxzLmRlZXBFeHRlbmQoc2NhdHRlclBsb3RDb25maWcsIGNvbmZpZyk7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5vbihcImNlbGwtc2VsZWN0ZWRcIiwgYz0+IHtcclxuXHJcblxyXG4gICAgICAgICAgICBzY2F0dGVyUGxvdENvbmZpZy54ID0ge1xyXG4gICAgICAgICAgICAgICAga2V5OiBjLnJvd1ZhcixcclxuICAgICAgICAgICAgICAgIGxhYmVsOiBzZWxmLnBsb3QubGFiZWxCeVZhcmlhYmxlW2Mucm93VmFyXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBzY2F0dGVyUGxvdENvbmZpZy55ID0ge1xyXG4gICAgICAgICAgICAgICAga2V5OiBjLmNvbFZhcixcclxuICAgICAgICAgICAgICAgIGxhYmVsOiBzZWxmLnBsb3QubGFiZWxCeVZhcmlhYmxlW2MuY29sVmFyXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5zY2F0dGVyUGxvdCAmJiBzZWxmLnNjYXR0ZXJQbG90ICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNjYXR0ZXJQbG90LnNldENvbmZpZyhzY2F0dGVyUGxvdENvbmZpZykuaW5pdCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zY2F0dGVyUGxvdCA9IG5ldyBTY2F0dGVyUGxvdChjb250YWluZXJTZWxlY3Rvciwgc2VsZi5kYXRhLCBzY2F0dGVyUGxvdENvbmZpZyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF0dGFjaChcIlNjYXR0ZXJQbG90XCIsIHNlbGYuc2NhdHRlclBsb3QpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEQzRXh0ZW5zaW9uc3tcclxuXHJcbiAgICBzdGF0aWMgZXh0ZW5kKCl7XHJcblxyXG4gICAgICAgIGQzLnNlbGVjdGlvbi5lbnRlci5wcm90b3R5cGUuaW5zZXJ0U2VsZWN0b3IgPVxyXG4gICAgICAgICAgICBkMy5zZWxlY3Rpb24ucHJvdG90eXBlLmluc2VydFNlbGVjdG9yID0gZnVuY3Rpb24oc2VsZWN0b3IsIGJlZm9yZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFV0aWxzLmluc2VydFNlbGVjdG9yKHRoaXMsIHNlbGVjdG9yLCBiZWZvcmUpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgZDMuc2VsZWN0aW9uLmVudGVyLnByb3RvdHlwZS5hcHBlbmRTZWxlY3RvciA9XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdGlvbi5wcm90b3R5cGUuYXBwZW5kU2VsZWN0b3IgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFV0aWxzLmFwcGVuZFNlbGVjdG9yKHRoaXMsIHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZDMuc2VsZWN0aW9uLmVudGVyLnByb3RvdHlwZS5zZWxlY3RPckFwcGVuZCA9XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdGlvbi5wcm90b3R5cGUuc2VsZWN0T3JBcHBlbmQgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFV0aWxzLnNlbGVjdE9yQXBwZW5kKHRoaXMsIHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZDMuc2VsZWN0aW9uLmVudGVyLnByb3RvdHlwZS5zZWxlY3RPckluc2VydCA9XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdGlvbi5wcm90b3R5cGUuc2VsZWN0T3JJbnNlcnQgPSBmdW5jdGlvbihzZWxlY3RvciwgYmVmb3JlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVXRpbHMuc2VsZWN0T3JJbnNlcnQodGhpcywgc2VsZWN0b3IsIGJlZm9yZSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG5cclxuXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDaGFydCwgQ2hhcnRDb25maWd9IGZyb20gXCIuL2NoYXJ0XCI7XHJcbmltcG9ydCB7SGVhdG1hcCwgSGVhdG1hcENvbmZpZ30gZnJvbSBcIi4vaGVhdG1hcFwiO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5pbXBvcnQge1N0YXRpc3RpY3NVdGlsc30gZnJvbSAnLi9zdGF0aXN0aWNzLXV0aWxzJ1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBIZWF0bWFwVGltZVNlcmllc0NvbmZpZyBleHRlbmRzIEhlYXRtYXBDb25maWcge1xyXG4gICAgeCA9IHtcclxuICAgICAgICBmaWxsTWlzc2luZzogZmFsc2UsIC8vIGZpbGwgbWlzc2luZyB2YWx1ZXMgdXNpbmcgaW50ZXJ2YWwgYW5kIGludGVydmFsU3RlcFxyXG4gICAgICAgIGludGVydmFsOiB1bmRlZmluZWQsIC8vdXNlZCBpbiBmaWxsaW5nIG1pc3NpbmcgdGlja3NcclxuICAgICAgICBpbnRlcnZhbFN0ZXA6IDEsXHJcbiAgICAgICAgZm9ybWF0OiB1bmRlZmluZWQsIC8vaW5wdXQgZGF0YSBkMyB0aW1lIGZvcm1hdFxyXG4gICAgICAgIGRpc3BsYXlGb3JtYXQ6IHVuZGVmaW5lZCwvL2QzIHRpbWUgZm9ybWF0IGZvciBkaXNwbGF5XHJcbiAgICAgICAgaW50ZXJ2YWxUb0Zvcm1hdHM6IFsgLy91c2VkIHRvIGd1ZXNzIGludGVydmFsIGFuZCBmb3JtYXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3llYXInLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0czogW1wiJVlcIl1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ21vbnRoJyxcclxuICAgICAgICAgICAgICAgIGZvcm1hdHM6IFtcIiVZLSVtXCJdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdkYXknLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0czogW1wiJVktJW0tJWRcIl1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2hvdXInLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0czogWyclSCcsICclWS0lbS0lZCAlSCddXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdtaW51dGUnLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0czogWyclSDolTScsICclWS0lbS0lZCAlSDolTSddXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdzZWNvbmQnLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0czogWyclSDolTTolUycsICclWS0lbS0lZCAlSDolTTolUyddXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdLFxyXG5cclxuICAgICAgICBzb3J0Q29tcGFyYXRvcjogZnVuY3Rpb24gc29ydENvbXBhcmF0b3IoYSwgYikge1xyXG4gICAgICAgICAgICByZXR1cm4gVXRpbHMuaXNTdHJpbmcoYSkgPyAgYS5sb2NhbGVDb21wYXJlKGIpIDogIGEgLSBiO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9ybWF0dGVyOiB1bmRlZmluZWRcclxuICAgIH07XHJcbiAgICB6ID0ge1xyXG4gICAgICAgIGZpbGxNaXNzaW5nOiB0cnVlIC8vIGZpaWxsIG1pc3NpbmcgdmFsdWVzIHdpdGggbmVhcmVzdCBwcmV2aW91cyB2YWx1ZVxyXG4gICAgfTtcclxuXHJcbiAgICBsZWdlbmQgPSB7XHJcbiAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB2YXIgc3VmZml4ID0gXCJcIjtcclxuICAgICAgICAgICAgaWYgKHYgLyAxMDAwMDAwID49IDEpIHtcclxuICAgICAgICAgICAgICAgIHN1ZmZpeCA9IFwiIE1cIjtcclxuICAgICAgICAgICAgICAgIHYgPSBOdW1iZXIodiAvIDEwMDAwMDApLnRvRml4ZWQoMyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIG5mID0gSW50bC5OdW1iZXJGb3JtYXQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5mLmZvcm1hdCh2KSArIHN1ZmZpeDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIGlmIChjdXN0b20pIHtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBIZWF0bWFwVGltZVNlcmllcyBleHRlbmRzIEhlYXRtYXAge1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IEhlYXRtYXBUaW1lU2VyaWVzQ29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBIZWF0bWFwVGltZVNlcmllc0NvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgc2V0dXBWYWx1ZXNCZWZvcmVHcm91cHNTb3J0KCkge1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueC50aW1lRm9ybWF0ID0gdGhpcy5jb25maWcueC5mb3JtYXQ7XHJcbiAgICAgICAgaWYodGhpcy5jb25maWcueC5kaXNwbGF5Rm9ybWF0ICYmICF0aGlzLnBsb3QueC50aW1lRm9ybWF0KXtcclxuICAgICAgICAgICAgdGhpcy5ndWVzc1RpbWVGb3JtYXQoKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBzdXBlci5zZXR1cFZhbHVlc0JlZm9yZUdyb3Vwc1NvcnQoKTtcclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLnguZmlsbE1pc3NpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRUaW1lRm9ybWF0QW5kSW50ZXJ2YWwoKTtcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnguaW50ZXJ2YWxTdGVwID0gdGhpcy5jb25maWcueC5pbnRlcnZhbFN0ZXAgfHwgMTtcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LngudGltZVBhcnNlciA9IHRoaXMuZ2V0VGltZVBhcnNlcigpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHRoaXMucGxvdC54LnVuaXF1ZVZhbHVlcy5zb3J0KHRoaXMuY29uZmlnLnguc29ydENvbXBhcmF0b3IpO1xyXG5cclxuICAgICAgICB2YXIgcHJldiA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC54LnVuaXF1ZVZhbHVlcy5mb3JFYWNoKCh4LCBpKT0+IHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLnBhcnNlVGltZSh4KTtcclxuICAgICAgICAgICAgaWYgKHByZXYgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHByZXYgPSBjdXJyZW50O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgbmV4dCA9IHNlbGYubmV4dFRpbWVUaWNrVmFsdWUocHJldik7XHJcbiAgICAgICAgICAgIHZhciBtaXNzaW5nID0gW107XHJcbiAgICAgICAgICAgIHZhciBpdGVyYXRpb24gPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoc2VsZi5jb21wYXJlVGltZVZhbHVlcyhuZXh0LCBjdXJyZW50KTw9MCkge1xyXG4gICAgICAgICAgICAgICAgaXRlcmF0aW9uKys7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlcmF0aW9uID4gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgdmFyIHRpbWVTdHJpbmcgPSBzZWxmLmZvcm1hdFRpbWUobmV4dCk7XHJcbiAgICAgICAgICAgICAgICBkW3RoaXMuY29uZmlnLngua2V5XSA9IHRpbWVTdHJpbmc7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi51cGRhdGVHcm91cHMoZCwgdGltZVN0cmluZywgc2VsZi5wbG90LnguZ3JvdXBzLCBzZWxmLmNvbmZpZy54Lmdyb3Vwcyk7XHJcbiAgICAgICAgICAgICAgICBtaXNzaW5nLnB1c2gobmV4dCk7XHJcbiAgICAgICAgICAgICAgICBuZXh0ID0gc2VsZi5uZXh0VGltZVRpY2tWYWx1ZShuZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcmV2ID0gY3VycmVudDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VUaW1lKHgpIHtcclxuICAgICAgICB2YXIgcGFyc2VyID0gdGhpcy5nZXRUaW1lUGFyc2VyKCk7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZSh4KTtcclxuICAgIH1cclxuXHJcbiAgICBmb3JtYXRUaW1lKGRhdGUpe1xyXG4gICAgICAgIHZhciBwYXJzZXIgPSB0aGlzLmdldFRpbWVQYXJzZXIoKTtcclxuICAgICAgICByZXR1cm4gcGFyc2VyKGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcm1hdFZhbHVlWCh2YWx1ZSkgeyAvL3VzZWQgb25seSBmb3IgZGlzcGxheVxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy54LmZvcm1hdHRlcikgcmV0dXJuIHRoaXMuY29uZmlnLnguZm9ybWF0dGVyLmNhbGwodGhpcy5jb25maWcsIHZhbHVlKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5jb25maWcueC5kaXNwbGF5Rm9ybWF0KXtcclxuICAgICAgICAgICAgdmFyIGRhdGUgPSB0aGlzLnBhcnNlVGltZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkMy50aW1lLmZvcm1hdCh0aGlzLmNvbmZpZy54LmRpc3BsYXlGb3JtYXQpKGRhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIXRoaXMucGxvdC54LnRpbWVGb3JtYXQpIHJldHVybiB2YWx1ZTtcclxuXHJcbiAgICAgICAgaWYoVXRpbHMuaXNEYXRlKHZhbHVlKSl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZvcm1hdFRpbWUodmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBhcmVUaW1lVmFsdWVzKGEsIGIpe1xyXG4gICAgICAgIHJldHVybiBhLWI7XHJcbiAgICB9XHJcblxyXG4gICAgdGltZVZhbHVlc0VxdWFsKGEsIGIpIHtcclxuICAgICAgICB2YXIgcGFyc2VyID0gdGhpcy5wbG90LngudGltZVBhcnNlcjtcclxuICAgICAgICByZXR1cm4gcGFyc2VyKGEpID09PSBwYXJzZXIoYik7XHJcbiAgICB9XHJcblxyXG4gICAgbmV4dFRpbWVUaWNrVmFsdWUodCkge1xyXG4gICAgICAgIHZhciBpbnRlcnZhbCA9IHRoaXMucGxvdC54LmludGVydmFsO1xyXG4gICAgICAgIHJldHVybiBkMy50aW1lW2ludGVydmFsXS5vZmZzZXQodCwgdGhpcy5wbG90LnguaW50ZXJ2YWxTdGVwKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0UGxvdCgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcuei5maWxsTWlzc2luZykge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWF0cml4LmZvckVhY2goKHJvdywgcm93SW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBwcmV2Um93VmFsdWUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICByb3cuZm9yRWFjaCgoY2VsbCwgY29sSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbC52YWx1ZSA9PT0gdW5kZWZpbmVkICYmIHByZXZSb3dWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwudmFsdWUgPSBwcmV2Um93VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwubWlzc2luZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHByZXZSb3dWYWx1ZSA9IGNlbGwudmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKG5ld0RhdGEpIHtcclxuICAgICAgICBzdXBlci51cGRhdGUobmV3RGF0YSk7XHJcblxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgaW5pdFRpbWVGb3JtYXRBbmRJbnRlcnZhbCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnguaW50ZXJ2YWwgPSB0aGlzLmNvbmZpZy54LmludGVydmFsO1xyXG5cclxuICAgICAgICBpZighdGhpcy5wbG90LngudGltZUZvcm1hdCl7XHJcbiAgICAgICAgICAgIHRoaXMuZ3Vlc3NUaW1lRm9ybWF0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZighdGhpcy5wbG90LnguaW50ZXJ2YWwgJiYgdGhpcy5wbG90LngudGltZUZvcm1hdCl7XHJcbiAgICAgICAgICAgIHRoaXMuZ3Vlc3NJbnRlcnZhbCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBndWVzc1RpbWVGb3JtYXQoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpIDwgc2VsZi5jb25maWcueC5pbnRlcnZhbFRvRm9ybWF0cy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGxldCBpbnRlcnZhbEZvcm1hdCA9IHNlbGYuY29uZmlnLnguaW50ZXJ2YWxUb0Zvcm1hdHNbaV07XHJcbiAgICAgICAgICAgIHZhciBmb3JtYXQgPSBudWxsO1xyXG4gICAgICAgICAgICB2YXIgZm9ybWF0TWF0Y2ggPSBpbnRlcnZhbEZvcm1hdC5mb3JtYXRzLnNvbWUoZj0+e1xyXG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gZjtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJzZXIgPSBkMy50aW1lLmZvcm1hdChmKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnBsb3QueC51bmlxdWVWYWx1ZXMuZXZlcnkoeD0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZXIucGFyc2UoeCkgIT09IG51bGxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYoZm9ybWF0TWF0Y2gpe1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wbG90LngudGltZUZvcm1hdCA9IGZvcm1hdDtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHdWVzc2VkIHRpbWVGb3JtYXQnLCBmb3JtYXQpO1xyXG4gICAgICAgICAgICAgICAgaWYoIXNlbGYucGxvdC54LmludGVydmFsKXtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnBsb3QueC5pbnRlcnZhbCA9IGludGVydmFsRm9ybWF0Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0d1ZXNzZWQgaW50ZXJ2YWwnLCBzZWxmLnBsb3QueC5pbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ3Vlc3NJbnRlcnZhbCgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGkgPCBzZWxmLmNvbmZpZy54LmludGVydmFsVG9Gb3JtYXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBpbnRlcnZhbEZvcm1hdCA9IHNlbGYuY29uZmlnLnguaW50ZXJ2YWxUb0Zvcm1hdHNbaV07XHJcblxyXG4gICAgICAgICAgICBpZihpbnRlcnZhbEZvcm1hdC5mb3JtYXRzLmluZGV4T2Yoc2VsZi5wbG90LngudGltZUZvcm1hdCkgPj0gMCl7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QueC5pbnRlcnZhbCA9IGludGVydmFsRm9ybWF0Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnR3Vlc3NlZCBpbnRlcnZhbCcsIHNlbGYucGxvdC54LmludGVydmFsKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXRUaW1lUGFyc2VyKCkge1xyXG4gICAgICAgIGlmKCF0aGlzLnBsb3QueC50aW1lUGFyc2VyKXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LngudGltZVBhcnNlciA9IGQzLnRpbWUuZm9ybWF0KHRoaXMucGxvdC54LnRpbWVGb3JtYXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5wbG90LngudGltZVBhcnNlcjtcclxuICAgIH1cclxufVxyXG5cclxuIiwiaW1wb3J0IHtDaGFydCwgQ2hhcnRDb25maWd9IGZyb20gXCIuL2NoYXJ0XCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7TGVnZW5kfSBmcm9tICcuL2xlZ2VuZCdcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgSGVhdG1hcENvbmZpZyBleHRlbmRzIENoYXJ0Q29uZmlnIHtcclxuXHJcbiAgICBzdmdDbGFzcyA9ICdvZGMtaGVhdG1hcCc7XHJcbiAgICBzaG93VG9vbHRpcCA9IHRydWU7IC8vc2hvdyB0b29sdGlwIG9uIGRvdCBob3ZlclxyXG4gICAgdG9vbHRpcCA9IHtcclxuICAgICAgICBub0RhdGFUZXh0OiBcIk4vQVwiXHJcbiAgICB9O1xyXG4gICAgc2hvd0xlZ2VuZCA9IHRydWU7XHJcbiAgICBsZWdlbmQgPSB7XHJcbiAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgIHJvdGF0ZUxhYmVsczogZmFsc2UsXHJcbiAgICAgICAgZGVjaW1hbFBsYWNlczogdW5kZWZpbmVkLFxyXG4gICAgICAgIGZvcm1hdHRlcjogdiA9PiB0aGlzLmxlZ2VuZC5kZWNpbWFsUGxhY2VzID09PSB1bmRlZmluZWQgPyB2IDogTnVtYmVyKHYpLnRvRml4ZWQodGhpcy5sZWdlbmQuZGVjaW1hbFBsYWNlcylcclxuICAgIH1cclxuICAgIGhpZ2hsaWdodExhYmVscyA9IHRydWU7XHJcbiAgICB4ID0gey8vIFggYXhpcyBjb25maWdcclxuICAgICAgICB0aXRsZTogJycsIC8vIGF4aXMgdGl0bGVcclxuICAgICAgICBrZXk6IDAsXHJcbiAgICAgICAgdmFsdWU6IChkKSA9PiBkW3RoaXMueC5rZXldLCAvLyB4IHZhbHVlIGFjY2Vzc29yXHJcbiAgICAgICAgcm90YXRlTGFiZWxzOiB0cnVlLFxyXG4gICAgICAgIHNvcnRMYWJlbHM6IGZhbHNlLFxyXG4gICAgICAgIHNvcnRDb21wYXJhdG9yOiAoYSwgYik9PiBVdGlscy5pc051bWJlcihhKSA/IGEgLSBiIDogYS5sb2NhbGVDb21wYXJlKGIpLFxyXG4gICAgICAgIGdyb3Vwczoge1xyXG4gICAgICAgICAgICBrZXlzOiBbXSxcclxuICAgICAgICAgICAgbGFiZWxzOiBbXSxcclxuICAgICAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IGRba2V5XSxcclxuICAgICAgICAgICAgb3ZlcmxhcDoge1xyXG4gICAgICAgICAgICAgICAgdG9wOiAyMCxcclxuICAgICAgICAgICAgICAgIGJvdHRvbTogMjBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9ybWF0dGVyOiB1bmRlZmluZWQgLy8gdmFsdWUgZm9ybWF0dGVyIGZ1bmN0aW9uXHJcblxyXG4gICAgfTtcclxuICAgIHkgPSB7Ly8gWSBheGlzIGNvbmZpZ1xyXG4gICAgICAgIHRpdGxlOiAnJywgLy8gYXhpcyB0aXRsZSxcclxuICAgICAgICByb3RhdGVMYWJlbHM6IHRydWUsXHJcbiAgICAgICAga2V5OiAxLFxyXG4gICAgICAgIHZhbHVlOiAoZCkgPT4gZFt0aGlzLnkua2V5XSwgLy8geSB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgIHNvcnRMYWJlbHM6IGZhbHNlLFxyXG4gICAgICAgIHNvcnRDb21wYXJhdG9yOiAoYSwgYik9PiBVdGlscy5pc051bWJlcihiKSA/IGIgLSBhIDogYi5sb2NhbGVDb21wYXJlKGEpLFxyXG4gICAgICAgIGdyb3Vwczoge1xyXG4gICAgICAgICAgICBrZXlzOiBbXSxcclxuICAgICAgICAgICAgbGFiZWxzOiBbXSxcclxuICAgICAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IGRba2V5XSxcclxuICAgICAgICAgICAgb3ZlcmxhcDoge1xyXG4gICAgICAgICAgICAgICAgbGVmdDogMjAsXHJcbiAgICAgICAgICAgICAgICByaWdodDogMjBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9ybWF0dGVyOiB1bmRlZmluZWQvLyB2YWx1ZSBmb3JtYXR0ZXIgZnVuY3Rpb25cclxuICAgIH07XHJcbiAgICB6ID0ge1xyXG4gICAgICAgIGtleTogMixcclxuICAgICAgICB2YWx1ZTogKGQpID0+IGRbdGhpcy56LmtleV0sXHJcbiAgICAgICAgbm90QXZhaWxhYmxlVmFsdWU6ICh2KSA9PiB2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCxcclxuXHJcbiAgICAgICAgZGVjaW1hbFBsYWNlczogdW5kZWZpbmVkLFxyXG4gICAgICAgIGZvcm1hdHRlcjogdiA9PiB0aGlzLnouZGVjaW1hbFBsYWNlcyA9PT0gdW5kZWZpbmVkID8gdiA6IE51bWJlcih2KS50b0ZpeGVkKHRoaXMuei5kZWNpbWFsUGxhY2VzKS8vIHZhbHVlIGZvcm1hdHRlciBmdW5jdGlvblxyXG5cclxuICAgIH07XHJcbiAgICBjb2xvciA9IHtcclxuICAgICAgICBub0RhdGFDb2xvcjogXCJ3aGl0ZVwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiLFxyXG4gICAgICAgIHJldmVyc2VTY2FsZTogZmFsc2UsXHJcbiAgICAgICAgcmFuZ2U6IFtcImRhcmtibHVlXCIsIFwibGlnaHRza3libHVlXCIsIFwib3JhbmdlXCIsIFwiY3JpbXNvblwiLCBcImRhcmtyZWRcIl1cclxuICAgIH07XHJcbiAgICBjZWxsID0ge1xyXG4gICAgICAgIHdpZHRoOiB1bmRlZmluZWQsXHJcbiAgICAgICAgaGVpZ2h0OiB1bmRlZmluZWQsXHJcbiAgICAgICAgc2l6ZU1pbjogMTUsXHJcbiAgICAgICAgc2l6ZU1heDogMjUwLFxyXG4gICAgICAgIHBhZGRpbmc6IDBcclxuICAgIH07XHJcbiAgICBtYXJnaW4gPSB7XHJcbiAgICAgICAgbGVmdDogNjAsXHJcbiAgICAgICAgcmlnaHQ6IDUwLFxyXG4gICAgICAgIHRvcDogMzAsXHJcbiAgICAgICAgYm90dG9tOiA4MFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIGlmIChjdXN0b20pIHtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLy9UT0RPIHJlZmFjdG9yXHJcbmV4cG9ydCBjbGFzcyBIZWF0bWFwIGV4dGVuZHMgQ2hhcnQge1xyXG5cclxuICAgIHN0YXRpYyBtYXhHcm91cEdhcFNpemUgPSAyNDtcclxuICAgIHN0YXRpYyBncm91cFRpdGxlUmVjdEhlaWdodCA9IDY7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IEhlYXRtYXBDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZykge1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IEhlYXRtYXBDb25maWcoY29uZmlnKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSB0aGlzLmNvbmZpZy5tYXJnaW47XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnggPSB7fTtcclxuICAgICAgICB0aGlzLnBsb3QueSA9IHt9O1xyXG4gICAgICAgIHRoaXMucGxvdC56ID0ge1xyXG4gICAgICAgICAgICBtYXRyaXhlczogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBjZWxsczogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBjb2xvcjoge30sXHJcbiAgICAgICAgICAgIHNoYXBlOiB7fVxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICB0aGlzLnNldHVwVmFsdWVzKCk7XHJcbiAgICAgICAgdGhpcy5idWlsZENlbGxzKCk7XHJcblxyXG4gICAgICAgIHZhciB0aXRsZVJlY3RXaWR0aCA9IDY7XHJcbiAgICAgICAgdGhpcy5wbG90Lngub3ZlcmxhcCA9IHtcclxuICAgICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgICAgICBib3R0b206IDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICh0aGlzLnBsb3QuZ3JvdXBCeVgpIHtcclxuICAgICAgICAgICAgbGV0IGRlcHRoID0gc2VsZi5jb25maWcueC5ncm91cHMua2V5cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGxldCBhbGxUaXRsZXNXaWR0aCA9IGRlcHRoICogKHRpdGxlUmVjdFdpZHRoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucGxvdC54Lm92ZXJsYXAuYm90dG9tID0gc2VsZi5jb25maWcueC5ncm91cHMub3ZlcmxhcC5ib3R0b207XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC54Lm92ZXJsYXAudG9wID0gc2VsZi5jb25maWcueC5ncm91cHMub3ZlcmxhcC50b3AgKyBhbGxUaXRsZXNXaWR0aDtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lm1hcmdpbi50b3AgPSBjb25mLm1hcmdpbi5yaWdodCArIGNvbmYueC5ncm91cHMub3ZlcmxhcC50b3A7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5tYXJnaW4uYm90dG9tID0gY29uZi5tYXJnaW4uYm90dG9tICsgY29uZi54Lmdyb3Vwcy5vdmVybGFwLmJvdHRvbTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLnBsb3QueS5vdmVybGFwID0ge1xyXG4gICAgICAgICAgICBsZWZ0OiAwLFxyXG4gICAgICAgICAgICByaWdodDogMFxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICBpZiAodGhpcy5wbG90Lmdyb3VwQnlZKSB7XHJcbiAgICAgICAgICAgIGxldCBkZXB0aCA9IHNlbGYuY29uZmlnLnkuZ3JvdXBzLmtleXMubGVuZ3RoO1xyXG4gICAgICAgICAgICBsZXQgYWxsVGl0bGVzV2lkdGggPSBkZXB0aCAqICh0aXRsZVJlY3RXaWR0aCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC55Lm92ZXJsYXAucmlnaHQgPSBzZWxmLmNvbmZpZy55Lmdyb3Vwcy5vdmVybGFwLmxlZnQgKyBhbGxUaXRsZXNXaWR0aDtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lnkub3ZlcmxhcC5sZWZ0ID0gc2VsZi5jb25maWcueS5ncm91cHMub3ZlcmxhcC5sZWZ0O1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWFyZ2luLmxlZnQgPSBjb25mLm1hcmdpbi5sZWZ0ICsgdGhpcy5wbG90Lnkub3ZlcmxhcC5sZWZ0O1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWFyZ2luLnJpZ2h0ID0gY29uZi5tYXJnaW4ucmlnaHQgKyB0aGlzLnBsb3QueS5vdmVybGFwLnJpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBsb3Quc2hvd0xlZ2VuZCA9IGNvbmYuc2hvd0xlZ2VuZDtcclxuICAgICAgICBpZiAodGhpcy5wbG90LnNob3dMZWdlbmQpIHtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lm1hcmdpbi5yaWdodCArPSBjb25mLmxlZ2VuZC53aWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb21wdXRlUGxvdFNpemUoKTtcclxuICAgICAgICB0aGlzLnNldHVwWlNjYWxlKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwVmFsdWVzKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgY29uZmlnID0gc2VsZi5jb25maWc7XHJcbiAgICAgICAgdmFyIHggPSBzZWxmLnBsb3QueDtcclxuICAgICAgICB2YXIgeSA9IHNlbGYucGxvdC55O1xyXG4gICAgICAgIHZhciB6ID0gc2VsZi5wbG90Lno7XHJcblxyXG5cclxuICAgICAgICB4LnZhbHVlID0gZCA9PiBjb25maWcueC52YWx1ZS5jYWxsKGNvbmZpZywgZCk7XHJcbiAgICAgICAgeS52YWx1ZSA9IGQgPT4gY29uZmlnLnkudmFsdWUuY2FsbChjb25maWcsIGQpO1xyXG4gICAgICAgIHoudmFsdWUgPSBkID0+IGNvbmZpZy56LnZhbHVlLmNhbGwoY29uZmlnLCBkKTtcclxuXHJcbiAgICAgICAgeC51bmlxdWVWYWx1ZXMgPSBbXTtcclxuICAgICAgICB5LnVuaXF1ZVZhbHVlcyA9IFtdO1xyXG5cclxuXHJcbiAgICAgICAgc2VsZi5wbG90Lmdyb3VwQnlZID0gISFjb25maWcueS5ncm91cHMua2V5cy5sZW5ndGg7XHJcbiAgICAgICAgc2VsZi5wbG90Lmdyb3VwQnlYID0gISFjb25maWcueC5ncm91cHMua2V5cy5sZW5ndGg7XHJcblxyXG4gICAgICAgIHkuZ3JvdXBzID0ge1xyXG4gICAgICAgICAgICBrZXk6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgbGFiZWw6ICcnLFxyXG4gICAgICAgICAgICB2YWx1ZXM6IFtdLFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogbnVsbCxcclxuICAgICAgICAgICAgbGV2ZWw6IDAsXHJcbiAgICAgICAgICAgIGluZGV4OiAwLFxyXG4gICAgICAgICAgICBsYXN0SW5kZXg6IDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIHguZ3JvdXBzID0ge1xyXG4gICAgICAgICAgICBrZXk6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgbGFiZWw6ICcnLFxyXG4gICAgICAgICAgICB2YWx1ZXM6IFtdLFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogbnVsbCxcclxuICAgICAgICAgICAgbGV2ZWw6IDAsXHJcbiAgICAgICAgICAgIGluZGV4OiAwLFxyXG4gICAgICAgICAgICBsYXN0SW5kZXg6IDBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgdmFsdWVNYXAgPSB7fTtcclxuICAgICAgICB2YXIgbWluWiA9IHVuZGVmaW5lZDtcclxuICAgICAgICB2YXIgbWF4WiA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmRhdGEuZm9yRWFjaChkPT4ge1xyXG5cclxuICAgICAgICAgICAgdmFyIHhWYWwgPSB4LnZhbHVlKGQpO1xyXG4gICAgICAgICAgICB2YXIgeVZhbCA9IHkudmFsdWUoZCk7XHJcbiAgICAgICAgICAgIHZhciB6VmFsUmF3ID0gei52YWx1ZShkKTtcclxuICAgICAgICAgICAgdmFyIHpWYWwgPSBjb25maWcuei5ub3RBdmFpbGFibGVWYWx1ZSh6VmFsUmF3KSA/IHVuZGVmaW5lZCA6IHBhcnNlRmxvYXQoelZhbFJhdyk7XHJcblxyXG5cclxuICAgICAgICAgICAgaWYgKHgudW5pcXVlVmFsdWVzLmluZGV4T2YoeFZhbCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB4LnVuaXF1ZVZhbHVlcy5wdXNoKHhWYWwpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoeS51bmlxdWVWYWx1ZXMuaW5kZXhPZih5VmFsKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHkudW5pcXVlVmFsdWVzLnB1c2goeVZhbCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBncm91cFkgPSB5Lmdyb3VwcztcclxuICAgICAgICAgICAgaWYgKHNlbGYucGxvdC5ncm91cEJ5WSkge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXBZID0gdGhpcy51cGRhdGVHcm91cHMoZCwgeVZhbCwgeS5ncm91cHMsIGNvbmZpZy55Lmdyb3Vwcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGdyb3VwWCA9IHguZ3JvdXBzO1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5wbG90Lmdyb3VwQnlYKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZ3JvdXBYID0gdGhpcy51cGRhdGVHcm91cHMoZCwgeFZhbCwgeC5ncm91cHMsIGNvbmZpZy54Lmdyb3Vwcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghdmFsdWVNYXBbZ3JvdXBZLmluZGV4XSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWVNYXBbZ3JvdXBZLmluZGV4XSA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXZhbHVlTWFwW2dyb3VwWS5pbmRleF1bZ3JvdXBYLmluZGV4XSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWVNYXBbZ3JvdXBZLmluZGV4XVtncm91cFguaW5kZXhdID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF2YWx1ZU1hcFtncm91cFkuaW5kZXhdW2dyb3VwWC5pbmRleF1beVZhbF0pIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlTWFwW2dyb3VwWS5pbmRleF1bZ3JvdXBYLmluZGV4XVt5VmFsXSA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhbHVlTWFwW2dyb3VwWS5pbmRleF1bZ3JvdXBYLmluZGV4XVt5VmFsXVt4VmFsXSA9IHpWYWw7XHJcblxyXG5cclxuICAgICAgICAgICAgaWYgKG1pblogPT09IHVuZGVmaW5lZCB8fCB6VmFsIDwgbWluWikge1xyXG4gICAgICAgICAgICAgICAgbWluWiA9IHpWYWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG1heFogPT09IHVuZGVmaW5lZCB8fCB6VmFsID4gbWF4Wikge1xyXG4gICAgICAgICAgICAgICAgbWF4WiA9IHpWYWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBzZWxmLnBsb3QudmFsdWVNYXAgPSB2YWx1ZU1hcDtcclxuXHJcblxyXG4gICAgICAgIGlmICghc2VsZi5wbG90Lmdyb3VwQnlYKSB7XHJcbiAgICAgICAgICAgIHguZ3JvdXBzLnZhbHVlcyA9IHgudW5pcXVlVmFsdWVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFzZWxmLnBsb3QuZ3JvdXBCeVkpIHtcclxuICAgICAgICAgICAgeS5ncm91cHMudmFsdWVzID0geS51bmlxdWVWYWx1ZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldHVwVmFsdWVzQmVmb3JlR3JvdXBzU29ydCgpO1xyXG5cclxuICAgICAgICB4LmdhcHMgPSBbXTtcclxuICAgICAgICB4LnRvdGFsVmFsdWVzQ291bnQgPSAwO1xyXG4gICAgICAgIHguYWxsVmFsdWVzTGlzdCA9IFtdO1xyXG4gICAgICAgIHRoaXMuc29ydEdyb3Vwcyh4LCB4Lmdyb3VwcywgY29uZmlnLngpO1xyXG5cclxuICAgICAgICB5LmdhcHMgPSBbXTtcclxuICAgICAgICB5LnRvdGFsVmFsdWVzQ291bnQgPSAwO1xyXG4gICAgICAgIHkuYWxsVmFsdWVzTGlzdCA9IFtdO1xyXG4gICAgICAgIHRoaXMuc29ydEdyb3Vwcyh5LCB5Lmdyb3VwcywgY29uZmlnLnkpO1xyXG5cclxuICAgICAgICB6Lm1pbiA9IG1pblo7XHJcbiAgICAgICAgei5tYXggPSBtYXhaO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBzZXR1cFZhbHVlc0JlZm9yZUdyb3Vwc1NvcnQoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgYnVpbGRDZWxscygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHggPSBzZWxmLnBsb3QueDtcclxuICAgICAgICB2YXIgeSA9IHNlbGYucGxvdC55O1xyXG4gICAgICAgIHZhciB6ID0gc2VsZi5wbG90Lno7XHJcbiAgICAgICAgdmFyIHZhbHVlTWFwID0gc2VsZi5wbG90LnZhbHVlTWFwO1xyXG5cclxuICAgICAgICB2YXIgbWF0cml4Q2VsbHMgPSBzZWxmLnBsb3QuY2VsbHMgPSBbXTtcclxuICAgICAgICB2YXIgbWF0cml4ID0gc2VsZi5wbG90Lm1hdHJpeCA9IFtdO1xyXG5cclxuICAgICAgICB5LmFsbFZhbHVlc0xpc3QuZm9yRWFjaCgodjEsIGkpPT4ge1xyXG4gICAgICAgICAgICB2YXIgcm93ID0gW107XHJcbiAgICAgICAgICAgIG1hdHJpeC5wdXNoKHJvdyk7XHJcblxyXG4gICAgICAgICAgICB4LmFsbFZhbHVlc0xpc3QuZm9yRWFjaCgodjIsIGopID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB6VmFsID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB6VmFsID0gdmFsdWVNYXBbdjEuZ3JvdXAuaW5kZXhdW3YyLmdyb3VwLmluZGV4XVt2MS52YWxdW3YyLnZhbF1cclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY2VsbCA9IHtcclxuICAgICAgICAgICAgICAgICAgICByb3dWYXI6IHYxLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbFZhcjogdjIsXHJcbiAgICAgICAgICAgICAgICAgICAgcm93OiBpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbDogaixcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogelZhbFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJvdy5wdXNoKGNlbGwpO1xyXG5cclxuICAgICAgICAgICAgICAgIG1hdHJpeENlbGxzLnB1c2goY2VsbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVHcm91cHMoZCwgYXhpc1ZhbCwgcm9vdEdyb3VwLCBheGlzR3JvdXBzQ29uZmlnKSB7XHJcblxyXG4gICAgICAgIHZhciBjb25maWcgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICB2YXIgY3VycmVudEdyb3VwID0gcm9vdEdyb3VwO1xyXG4gICAgICAgIGF4aXNHcm91cHNDb25maWcua2V5cy5mb3JFYWNoKChncm91cEtleSwgZ3JvdXBLZXlJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBjdXJyZW50R3JvdXAua2V5ID0gZ3JvdXBLZXk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWN1cnJlbnRHcm91cC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLmNoaWxkcmVuID0ge307XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBncm91cGluZ1ZhbHVlID0gYXhpc0dyb3Vwc0NvbmZpZy52YWx1ZS5jYWxsKGNvbmZpZywgZCwgZ3JvdXBLZXkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFjdXJyZW50R3JvdXAuY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoZ3JvdXBpbmdWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHJvb3RHcm91cC5sYXN0SW5kZXgrKztcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC5jaGlsZHJlbltncm91cGluZ1ZhbHVlXSA9IHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwaW5nVmFsdWU6IGdyb3VwaW5nVmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbGV2ZWw6IGN1cnJlbnRHcm91cC5sZXZlbCArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IHJvb3RHcm91cC5sYXN0SW5kZXgsXHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiBncm91cEtleVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjdXJyZW50R3JvdXAgPSBjdXJyZW50R3JvdXAuY2hpbGRyZW5bZ3JvdXBpbmdWYWx1ZV07XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChjdXJyZW50R3JvdXAudmFsdWVzLmluZGV4T2YoYXhpc1ZhbCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRHcm91cC52YWx1ZXMucHVzaChheGlzVmFsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjdXJyZW50R3JvdXA7XHJcbiAgICB9XHJcblxyXG4gICAgc29ydEdyb3VwcyhheGlzLCBncm91cCwgYXhpc0NvbmZpZywgZ2Fwcykge1xyXG4gICAgICAgIGlmIChheGlzQ29uZmlnLmdyb3Vwcy5sYWJlbHMgJiYgYXhpc0NvbmZpZy5ncm91cHMubGFiZWxzLmxlbmd0aCA+IGdyb3VwLmxldmVsKSB7XHJcbiAgICAgICAgICAgIGdyb3VwLmxhYmVsID0gYXhpc0NvbmZpZy5ncm91cHMubGFiZWxzW2dyb3VwLmxldmVsXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBncm91cC5sYWJlbCA9IGdyb3VwLmtleTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZ2Fwcykge1xyXG4gICAgICAgICAgICBnYXBzID0gWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZ2Fwcy5sZW5ndGggPD0gZ3JvdXAubGV2ZWwpIHtcclxuICAgICAgICAgICAgZ2Fwcy5wdXNoKDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ3JvdXAuYWxsVmFsdWVzQ291bnQgPSBncm91cC5hbGxWYWx1ZXNDb3VudCB8fCAwO1xyXG4gICAgICAgIGdyb3VwLmFsbFZhbHVlc0JlZm9yZUNvdW50ID0gZ3JvdXAuYWxsVmFsdWVzQmVmb3JlQ291bnQgfHwgMDtcclxuXHJcbiAgICAgICAgZ3JvdXAuZ2FwcyA9IGdhcHMuc2xpY2UoKTtcclxuICAgICAgICBncm91cC5nYXBzQmVmb3JlID0gZ2Fwcy5zbGljZSgpO1xyXG5cclxuXHJcbiAgICAgICAgZ3JvdXAuZ2Fwc1NpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBzU2l6ZShncm91cC5nYXBzKTtcclxuICAgICAgICBncm91cC5nYXBzQmVmb3JlU2l6ZSA9IGdyb3VwLmdhcHNTaXplO1xyXG4gICAgICAgIGlmIChncm91cC52YWx1ZXMpIHtcclxuICAgICAgICAgICAgaWYgKGF4aXNDb25maWcuc29ydExhYmVscykge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXAudmFsdWVzLnNvcnQoYXhpc0NvbmZpZy5zb3J0Q29tcGFyYXRvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ3JvdXAudmFsdWVzLmZvckVhY2godj0+YXhpcy5hbGxWYWx1ZXNMaXN0LnB1c2goe3ZhbDogdiwgZ3JvdXA6IGdyb3VwfSkpO1xyXG4gICAgICAgICAgICBncm91cC5hbGxWYWx1ZXNCZWZvcmVDb3VudCA9IGF4aXMudG90YWxWYWx1ZXNDb3VudDtcclxuICAgICAgICAgICAgYXhpcy50b3RhbFZhbHVlc0NvdW50ICs9IGdyb3VwLnZhbHVlcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGdyb3VwLmFsbFZhbHVlc0NvdW50ICs9IGdyb3VwLnZhbHVlcy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBncm91cC5jaGlsZHJlbkxpc3QgPSBbXTtcclxuICAgICAgICBpZiAoZ3JvdXAuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgdmFyIGNoaWxkcmVuQ291bnQgPSAwO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgY2hpbGRQcm9wIGluIGdyb3VwLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXAuY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoY2hpbGRQcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IGdyb3VwLmNoaWxkcmVuW2NoaWxkUHJvcF07XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAuY2hpbGRyZW5MaXN0LnB1c2goY2hpbGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuQ291bnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3J0R3JvdXBzKGF4aXMsIGNoaWxkLCBheGlzQ29uZmlnLCBnYXBzKTtcclxuICAgICAgICAgICAgICAgICAgICBncm91cC5hbGxWYWx1ZXNDb3VudCArPSBjaGlsZC5hbGxWYWx1ZXNDb3VudDtcclxuICAgICAgICAgICAgICAgICAgICBnYXBzW2dyb3VwLmxldmVsXSArPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZ2FwcyAmJiBjaGlsZHJlbkNvdW50ID4gMSkge1xyXG4gICAgICAgICAgICAgICAgZ2Fwc1tncm91cC5sZXZlbF0gLT0gMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZ3JvdXAuZ2Fwc0luc2lkZSA9IFtdO1xyXG4gICAgICAgICAgICBnYXBzLmZvckVhY2goKGQsIGkpPT4ge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXAuZ2Fwc0luc2lkZS5wdXNoKGQgLSAoZ3JvdXAuZ2Fwc0JlZm9yZVtpXSB8fCAwKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBncm91cC5nYXBzSW5zaWRlU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcHNTaXplKGdyb3VwLmdhcHNJbnNpZGUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGF4aXMuZ2Fwcy5sZW5ndGggPCBnYXBzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgYXhpcy5nYXBzID0gZ2FwcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgY29tcHV0ZVlBeGlzTGFiZWxzV2lkdGgob2Zmc2V0KSB7XHJcbiAgICAgICAgdmFyIG1heFdpZHRoID0gdGhpcy5wbG90Lm1hcmdpbi5sZWZ0O1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy55LnRpdGxlKSB7XHJcbiAgICAgICAgICAgIG1heFdpZHRoIC09IDE1O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2Zmc2V0ICYmIG9mZnNldC54KSB7XHJcbiAgICAgICAgICAgIG1heFdpZHRoICs9IG9mZnNldC54O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnkucm90YXRlTGFiZWxzKSB7XHJcbiAgICAgICAgICAgIG1heFdpZHRoICo9IFV0aWxzLlNRUlRfMjtcclxuICAgICAgICAgICAgdmFyIGZvbnRTaXplID0gMTE7IC8vdG9kbyBjaGVjayBhY3R1YWwgZm9udCBzaXplXHJcbiAgICAgICAgICAgIG1heFdpZHRoIC09Zm9udFNpemUvMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBtYXhXaWR0aDtcclxuICAgIH1cclxuXHJcbiAgICBjb21wdXRlWEF4aXNMYWJlbHNXaWR0aChvZmZzZXQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLngucm90YXRlTGFiZWxzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBsb3QuY2VsbFdpZHRoIC0gMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHNpemUgPSB0aGlzLnBsb3QubWFyZ2luLmJvdHRvbTtcclxuICAgICAgICBpZiAodGhpcy5jb25maWcueC50aXRsZSkge1xyXG4gICAgICAgICAgICBzaXplIC09IDE1O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2Zmc2V0ICYmIG9mZnNldC55KSB7XHJcbiAgICAgICAgICAgIHNpemUgLT0gb2Zmc2V0Lnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzaXplICo9IFV0aWxzLlNRUlRfMjtcclxuXHJcbiAgICAgICAgdmFyIGZvbnRTaXplID0gMTE7IC8vdG9kbyBjaGVjayBhY3R1YWwgZm9udCBzaXplXHJcbiAgICAgICAgc2l6ZSAtPWZvbnRTaXplLzI7XHJcblxyXG4gICAgICAgIHJldHVybiBzaXplO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjb21wdXRlR2FwU2l6ZShnYXBMZXZlbCkge1xyXG4gICAgICAgIHJldHVybiBIZWF0bWFwLm1heEdyb3VwR2FwU2l6ZSAvIChnYXBMZXZlbCArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjb21wdXRlR2Fwc1NpemUoZ2Fwcykge1xyXG4gICAgICAgIHZhciBnYXBzU2l6ZSA9IDA7XHJcbiAgICAgICAgZ2Fwcy5mb3JFYWNoKChnYXBzTnVtYmVyLCBnYXBzTGV2ZWwpPT4gZ2Fwc1NpemUgKz0gZ2Fwc051bWJlciAqIEhlYXRtYXAuY29tcHV0ZUdhcFNpemUoZ2Fwc0xldmVsKSk7XHJcbiAgICAgICAgcmV0dXJuIGdhcHNTaXplO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXB1dGVQbG90U2l6ZSgpIHtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICB2YXIgbWFyZ2luID0gcGxvdC5tYXJnaW47XHJcbiAgICAgICAgdmFyIGF2YWlsYWJsZVdpZHRoID0gVXRpbHMuYXZhaWxhYmxlV2lkdGgodGhpcy5jb25maWcud2lkdGgsIHRoaXMuZ2V0QmFzZUNvbnRhaW5lcigpLCB0aGlzLnBsb3QubWFyZ2luKTtcclxuICAgICAgICB2YXIgYXZhaWxhYmxlSGVpZ2h0ID0gVXRpbHMuYXZhaWxhYmxlSGVpZ2h0KHRoaXMuY29uZmlnLmhlaWdodCwgdGhpcy5nZXRCYXNlQ29udGFpbmVyKCksIHRoaXMucGxvdC5tYXJnaW4pO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IGF2YWlsYWJsZVdpZHRoO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBhdmFpbGFibGVIZWlnaHQ7XHJcblxyXG4gICAgICAgIHZhciB4R2Fwc1NpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBzU2l6ZShwbG90LnguZ2Fwcyk7XHJcblxyXG5cclxuICAgICAgICB2YXIgY29tcHV0ZWRDZWxsV2lkdGggPSBNYXRoLm1heChjb25mLmNlbGwuc2l6ZU1pbiwgTWF0aC5taW4oY29uZi5jZWxsLnNpemVNYXgsIChhdmFpbGFibGVXaWR0aCAtIHhHYXBzU2l6ZSkgLyB0aGlzLnBsb3QueC50b3RhbFZhbHVlc0NvdW50KSk7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLndpZHRoKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY29uZmlnLmNlbGwud2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsV2lkdGggPSBjb21wdXRlZENlbGxXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuY2VsbFdpZHRoID0gdGhpcy5jb25maWcuY2VsbC53aWR0aDtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wbG90LmNlbGxXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxXaWR0aCA9IGNvbXB1dGVkQ2VsbFdpZHRoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICB3aWR0aCA9IHRoaXMucGxvdC5jZWxsV2lkdGggKiB0aGlzLnBsb3QueC50b3RhbFZhbHVlc0NvdW50ICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQgKyB4R2Fwc1NpemU7XHJcblxyXG4gICAgICAgIHZhciB5R2Fwc1NpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBzU2l6ZShwbG90LnkuZ2Fwcyk7XHJcbiAgICAgICAgdmFyIGNvbXB1dGVkQ2VsbEhlaWdodCA9IE1hdGgubWF4KGNvbmYuY2VsbC5zaXplTWluLCBNYXRoLm1pbihjb25mLmNlbGwuc2l6ZU1heCwgKGF2YWlsYWJsZUhlaWdodCAtIHlHYXBzU2l6ZSkgLyB0aGlzLnBsb3QueS50b3RhbFZhbHVlc0NvdW50KSk7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmhlaWdodCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY29uZmlnLmNlbGwuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuY2VsbEhlaWdodCA9IGNvbXB1dGVkQ2VsbEhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsSGVpZ2h0ID0gdGhpcy5jb25maWcuY2VsbC5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMucGxvdC5jZWxsSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuY2VsbEhlaWdodCA9IGNvbXB1dGVkQ2VsbEhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGhlaWdodCA9IHRoaXMucGxvdC5jZWxsSGVpZ2h0ICogdGhpcy5wbG90LnkudG90YWxWYWx1ZXNDb3VudCArIG1hcmdpbi50b3AgKyBtYXJnaW4uYm90dG9tICsgeUdhcHNTaXplO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5wbG90LndpZHRoID0gd2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodDtcclxuICAgICAgICB0aGlzLnBsb3QuaGVpZ2h0ID0gaGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNldHVwWlNjYWxlKCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGNvbmZpZyA9IHNlbGYuY29uZmlnO1xyXG4gICAgICAgIHZhciB6ID0gc2VsZi5wbG90Lno7XHJcbiAgICAgICAgdmFyIHJhbmdlID0gY29uZmlnLmNvbG9yLnJhbmdlO1xyXG4gICAgICAgIHZhciBleHRlbnQgPSB6Lm1heCAtIHoubWluO1xyXG4gICAgICAgIHZhciBzY2FsZTtcclxuICAgICAgICB6LmRvbWFpbiA9IFtdO1xyXG4gICAgICAgIGlmIChjb25maWcuY29sb3Iuc2NhbGUgPT0gXCJwb3dcIikge1xyXG4gICAgICAgICAgICB2YXIgZXhwb25lbnQgPSAxMDtcclxuICAgICAgICAgICAgcmFuZ2UuZm9yRWFjaCgoYywgaSk9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdiA9IHoubWF4IC0gKGV4dGVudCAvIE1hdGgucG93KDEwLCBpKSk7XHJcbiAgICAgICAgICAgICAgICB6LmRvbWFpbi5wdXNoKHYpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzY2FsZSA9IGQzLnNjYWxlLnBvdygpLmV4cG9uZW50KGV4cG9uZW50KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbmZpZy5jb2xvci5zY2FsZSA9PSBcImxvZ1wiKSB7XHJcblxyXG4gICAgICAgICAgICByYW5nZS5mb3JFYWNoKChjLCBpKT0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB2ID0gei5taW4gKyAoZXh0ZW50IC8gTWF0aC5wb3coMTAsIGkpKTtcclxuICAgICAgICAgICAgICAgIHouZG9tYWluLnVuc2hpZnQodilcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc2NhbGUgPSBkMy5zY2FsZS5sb2coKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJhbmdlLmZvckVhY2goKGMsIGkpPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHYgPSB6Lm1pbiArIChleHRlbnQgKiAoaSAvIChyYW5nZS5sZW5ndGggLSAxKSkpO1xyXG4gICAgICAgICAgICAgICAgei5kb21haW4ucHVzaCh2KVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc2NhbGUgPSBkMy5zY2FsZVtjb25maWcuY29sb3Iuc2NhbGVdKCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgei5kb21haW5bMF0gPSB6Lm1pbjsgLy9yZW1vdmluZyB1bm5lY2Vzc2FyeSBmbG9hdGluZyBwb2ludHNcclxuICAgICAgICB6LmRvbWFpblt6LmRvbWFpbi5sZW5ndGggLSAxXSA9IHoubWF4OyAvL3JlbW92aW5nIHVubmVjZXNzYXJ5IGZsb2F0aW5nIHBvaW50c1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHouZG9tYWluKTtcclxuXHJcbiAgICAgICAgaWYgKGNvbmZpZy5jb2xvci5yZXZlcnNlU2NhbGUpIHtcclxuICAgICAgICAgICAgei5kb21haW4ucmV2ZXJzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHJhbmdlKTtcclxuICAgICAgICBwbG90LnouY29sb3Iuc2NhbGUgPSBzY2FsZS5kb21haW4oei5kb21haW4pLnJhbmdlKHJhbmdlKTtcclxuICAgICAgICB2YXIgc2hhcGUgPSBwbG90Lnouc2hhcGUgPSB7fTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxDb25mID0gdGhpcy5jb25maWcuY2VsbDtcclxuICAgICAgICBzaGFwZS50eXBlID0gXCJyZWN0XCI7XHJcblxyXG4gICAgICAgIHBsb3Quei5zaGFwZS53aWR0aCA9IHBsb3QuY2VsbFdpZHRoIC0gY2VsbENvbmYucGFkZGluZyAqIDI7XHJcbiAgICAgICAgcGxvdC56LnNoYXBlLmhlaWdodCA9IHBsb3QuY2VsbEhlaWdodCAtIGNlbGxDb25mLnBhZGRpbmcgKiAyO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB1cGRhdGUobmV3RGF0YSkge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuICAgICAgICBpZiAodGhpcy5wbG90Lmdyb3VwQnlZKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0dyb3Vwc1kodGhpcy5wbG90LnkuZ3JvdXBzLCB0aGlzLnN2Z0cpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5wbG90Lmdyb3VwQnlYKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0dyb3Vwc1godGhpcy5wbG90LnguZ3JvdXBzLCB0aGlzLnN2Z0cpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVDZWxscygpO1xyXG5cclxuICAgICAgICAvLyB0aGlzLnVwZGF0ZVZhcmlhYmxlTGFiZWxzKCk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlQXhpc1goKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUF4aXNZKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5zaG93TGVnZW5kKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGVnZW5kKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUF4aXNUaXRsZXMoKTtcclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlQXhpc1RpdGxlcygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcblxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgdXBkYXRlQXhpc1goKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBsYWJlbENsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImxhYmVsXCIpO1xyXG4gICAgICAgIHZhciBsYWJlbFhDbGFzcyA9IGxhYmVsQ2xhc3MgKyBcIi14XCI7XHJcbiAgICAgICAgdmFyIGxhYmVsWUNsYXNzID0gbGFiZWxDbGFzcyArIFwiLXlcIjtcclxuICAgICAgICBwbG90LmxhYmVsQ2xhc3MgPSBsYWJlbENsYXNzO1xyXG5cclxuICAgICAgICB2YXIgb2Zmc2V0WCA9IHtcclxuICAgICAgICAgICAgeDogMCxcclxuICAgICAgICAgICAgeTogMFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGV0IGdhcFNpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBTaXplKDApO1xyXG4gICAgICAgIGlmIChwbG90Lmdyb3VwQnlYKSB7XHJcbiAgICAgICAgICAgIGxldCBvdmVybGFwID0gc2VsZi5jb25maWcueC5ncm91cHMub3ZlcmxhcDtcclxuXHJcbiAgICAgICAgICAgIG9mZnNldFgueCA9IGdhcFNpemUgLyAyO1xyXG4gICAgICAgICAgICBvZmZzZXRYLnkgPSBvdmVybGFwLmJvdHRvbSArIGdhcFNpemUgLyAyICsgNjtcclxuICAgICAgICB9IGVsc2UgaWYgKHBsb3QuZ3JvdXBCeVkpIHtcclxuICAgICAgICAgICAgb2Zmc2V0WC55ID0gZ2FwU2l6ZTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB2YXIgbGFiZWxzID0gc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyBsYWJlbFhDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGxvdC54LmFsbFZhbHVlc0xpc3QsIChkLCBpKT0+aSk7XHJcblxyXG4gICAgICAgIGxhYmVscy5lbnRlcigpLmFwcGVuZChcInRleHRcIikuYXR0cihcImNsYXNzXCIsIChkLCBpKSA9PiBsYWJlbENsYXNzICsgXCIgXCIgKyBsYWJlbFhDbGFzcyArIFwiIFwiICsgbGFiZWxYQ2xhc3MgKyBcIi1cIiArIGkpO1xyXG5cclxuICAgICAgICBsYWJlbHNcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIChkLCBpKSA9PiAoaSAqIHBsb3QuY2VsbFdpZHRoICsgcGxvdC5jZWxsV2lkdGggLyAyKSArIChkLmdyb3VwLmdhcHNTaXplKSArIG9mZnNldFgueClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIHBsb3QuaGVpZ2h0ICsgb2Zmc2V0WC55KVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIDEwKVxyXG5cclxuICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAudGV4dChkPT5zZWxmLmZvcm1hdFZhbHVlWChkLnZhbCkpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHZhciBtYXhXaWR0aCA9IHNlbGYuY29tcHV0ZVhBeGlzTGFiZWxzV2lkdGgob2Zmc2V0WCk7XHJcblxyXG4gICAgICAgIGxhYmVscy5lYWNoKGZ1bmN0aW9uIChsYWJlbCkge1xyXG4gICAgICAgICAgICB2YXIgZWxlbSA9IGQzLnNlbGVjdCh0aGlzKSxcclxuICAgICAgICAgICAgICAgIHRleHQgPSBzZWxmLmZvcm1hdFZhbHVlWChsYWJlbC52YWwpO1xyXG4gICAgICAgICAgICBVdGlscy5wbGFjZVRleHRXaXRoRWxsaXBzaXNBbmRUb29sdGlwKGVsZW0sIHRleHQsIG1heFdpZHRoLCBzZWxmLmNvbmZpZy5zaG93VG9vbHRpcCA/IHNlbGYucGxvdC50b29sdGlwIDogZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoc2VsZi5jb25maWcueC5yb3RhdGVMYWJlbHMpIHtcclxuICAgICAgICAgICAgbGFiZWxzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwicm90YXRlKC00NSwgXCIgKyAoKGkgKiBwbG90LmNlbGxXaWR0aCArIHBsb3QuY2VsbFdpZHRoIC8gMikgKyBkLmdyb3VwLmdhcHNTaXplICsgb2Zmc2V0WC54ICkgKyBcIiwgXCIgKyAoIHBsb3QuaGVpZ2h0ICsgb2Zmc2V0WC55KSArIFwiKVwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJkeFwiLCAtMilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgOClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgbGFiZWxzLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcblxyXG4gICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RPckFwcGVuZChcImcuXCIgKyBzZWxmLnByZWZpeENsYXNzKCdheGlzLXgnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAocGxvdC53aWR0aCAvIDIpICsgXCIsXCIgKyAocGxvdC5oZWlnaHQgKyBwbG90Lm1hcmdpbi5ib3R0b20pICsgXCIpXCIpXHJcbiAgICAgICAgICAgIC5zZWxlY3RPckFwcGVuZChcInRleHQuXCIgKyBzZWxmLnByZWZpeENsYXNzKCdsYWJlbCcpKVxyXG5cclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCBcIi0wLjVlbVwiKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAudGV4dChzZWxmLmNvbmZpZy54LnRpdGxlKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVBeGlzWSgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGxhYmVsQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwibGFiZWxcIik7XHJcbiAgICAgICAgdmFyIGxhYmVsWUNsYXNzID0gbGFiZWxDbGFzcyArIFwiLXlcIjtcclxuICAgICAgICBwbG90LmxhYmVsQ2xhc3MgPSBsYWJlbENsYXNzO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGxhYmVscyA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgbGFiZWxZQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBsb3QueS5hbGxWYWx1ZXNMaXN0KTtcclxuXHJcbiAgICAgICAgbGFiZWxzLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKTtcclxuXHJcbiAgICAgICAgdmFyIG9mZnNldFkgPSB7XHJcbiAgICAgICAgICAgIHg6IDAsXHJcbiAgICAgICAgICAgIHk6IDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmIChwbG90Lmdyb3VwQnlZKSB7XHJcbiAgICAgICAgICAgIGxldCBvdmVybGFwID0gc2VsZi5jb25maWcueS5ncm91cHMub3ZlcmxhcDtcclxuICAgICAgICAgICAgbGV0IGdhcFNpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBTaXplKDApO1xyXG4gICAgICAgICAgICBvZmZzZXRZLnggPSAtb3ZlcmxhcC5sZWZ0O1xyXG5cclxuICAgICAgICAgICAgb2Zmc2V0WS55ID0gZ2FwU2l6ZSAvIDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxhYmVsc1xyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgb2Zmc2V0WS54KVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgKGQsIGkpID0+IChpICogcGxvdC5jZWxsSGVpZ2h0ICsgcGxvdC5jZWxsSGVpZ2h0IC8gMikgKyBkLmdyb3VwLmdhcHNTaXplICsgb2Zmc2V0WS55KVxyXG4gICAgICAgICAgICAuYXR0cihcImR4XCIsIC0yKVxyXG4gICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgKGQsIGkpID0+IGxhYmVsQ2xhc3MgKyBcIiBcIiArIGxhYmVsWUNsYXNzICsgXCIgXCIgKyBsYWJlbFlDbGFzcyArIFwiLVwiICsgaSlcclxuXHJcbiAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZm9ybWF0dGVkID0gc2VsZi5mb3JtYXRWYWx1ZVkoZC52YWwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdHRlZFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIG1heFdpZHRoID0gc2VsZi5jb21wdXRlWUF4aXNMYWJlbHNXaWR0aChvZmZzZXRZKTtcclxuXHJcbiAgICAgICAgbGFiZWxzLmVhY2goZnVuY3Rpb24gKGxhYmVsKSB7XHJcbiAgICAgICAgICAgIHZhciBlbGVtID0gZDMuc2VsZWN0KHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgdGV4dCA9IHNlbGYuZm9ybWF0VmFsdWVZKGxhYmVsLnZhbCk7XHJcbiAgICAgICAgICAgIFV0aWxzLnBsYWNlVGV4dFdpdGhFbGxpcHNpc0FuZFRvb2x0aXAoZWxlbSwgdGV4dCwgbWF4V2lkdGgsIHNlbGYuY29uZmlnLnNob3dUb29sdGlwID8gc2VsZi5wbG90LnRvb2x0aXAgOiBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy55LnJvdGF0ZUxhYmVscykge1xyXG4gICAgICAgICAgICBsYWJlbHNcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInJvdGF0ZSgtNDUsIFwiICsgKG9mZnNldFkueCAgKSArIFwiLCBcIiArIChkLmdyb3VwLmdhcHNTaXplICsgKGkgKiBwbG90LmNlbGxIZWlnaHQgKyBwbG90LmNlbGxIZWlnaHQgLyAyKSArIG9mZnNldFkueSkgKyBcIilcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIik7XHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiZHhcIiwgLTcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxhYmVscy5hdHRyKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBsYWJlbHMuZXhpdCgpLnJlbW92ZSgpO1xyXG5cclxuXHJcbiAgICAgICAgc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIiArIHNlbGYucHJlZml4Q2xhc3MoJ2F4aXMteScpKVxyXG4gICAgICAgICAgICAuc2VsZWN0T3JBcHBlbmQoXCJ0ZXh0LlwiICsgc2VsZi5wcmVmaXhDbGFzcygnbGFiZWwnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAtcGxvdC5tYXJnaW4ubGVmdCArIFwiLFwiICsgKHBsb3QuaGVpZ2h0IC8gMikgKyBcIilyb3RhdGUoLTkwKVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KHNlbGYuY29uZmlnLnkudGl0bGUpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgZHJhd0dyb3Vwc1kocGFyZW50R3JvdXAsIGNvbnRhaW5lciwgYXZhaWxhYmxlV2lkdGgpIHtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG5cclxuICAgICAgICB2YXIgZ3JvdXBDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJncm91cFwiKTtcclxuICAgICAgICB2YXIgZ3JvdXBZQ2xhc3MgPSBncm91cENsYXNzICsgXCIteVwiO1xyXG4gICAgICAgIHZhciBncm91cHMgPSBjb250YWluZXIuc2VsZWN0QWxsKFwiZy5cIiArIGdyb3VwQ2xhc3MgKyBcIi5cIiArIGdyb3VwWUNsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShwYXJlbnRHcm91cC5jaGlsZHJlbkxpc3QpO1xyXG5cclxuICAgICAgICB2YXIgdmFsdWVzQmVmb3JlQ291bnQgPSAwO1xyXG4gICAgICAgIHZhciBnYXBzQmVmb3JlU2l6ZSA9IDA7XHJcblxyXG4gICAgICAgIHZhciBncm91cHNFbnRlckcgPSBncm91cHMuZW50ZXIoKS5hcHBlbmQoXCJnXCIpO1xyXG4gICAgICAgIGdyb3Vwc0VudGVyR1xyXG4gICAgICAgICAgICAuY2xhc3NlZChncm91cENsYXNzLCB0cnVlKVxyXG4gICAgICAgICAgICAuY2xhc3NlZChncm91cFlDbGFzcywgdHJ1ZSlcclxuICAgICAgICAgICAgLmFwcGVuZChcInJlY3RcIikuY2xhc3NlZChcImdyb3VwLXJlY3RcIiwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIHZhciB0aXRsZUdyb3VwRW50ZXIgPSBncm91cHNFbnRlckcuYXBwZW5kU2VsZWN0b3IoXCJnLnRpdGxlXCIpO1xyXG4gICAgICAgIHRpdGxlR3JvdXBFbnRlci5hcHBlbmQoXCJyZWN0XCIpO1xyXG4gICAgICAgIHRpdGxlR3JvdXBFbnRlci5hcHBlbmQoXCJ0ZXh0XCIpO1xyXG5cclxuICAgICAgICB2YXIgZ2FwU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcFNpemUocGFyZW50R3JvdXAubGV2ZWwpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gZ2FwU2l6ZSAvIDQ7XHJcblxyXG4gICAgICAgIHZhciB0aXRsZVJlY3RXaWR0aCA9IEhlYXRtYXAuZ3JvdXBUaXRsZVJlY3RIZWlnaHQ7XHJcbiAgICAgICAgdmFyIGRlcHRoID0gc2VsZi5jb25maWcueS5ncm91cHMua2V5cy5sZW5ndGggLSBwYXJlbnRHcm91cC5sZXZlbDtcclxuICAgICAgICB2YXIgb3ZlcmxhcCA9IHtcclxuICAgICAgICAgICAgbGVmdDogMCxcclxuICAgICAgICAgICAgcmlnaHQ6IDBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoIWF2YWlsYWJsZVdpZHRoKSB7XHJcbiAgICAgICAgICAgIG92ZXJsYXAucmlnaHQgPSBwbG90Lnkub3ZlcmxhcC5sZWZ0O1xyXG4gICAgICAgICAgICBvdmVybGFwLmxlZnQgPSBwbG90Lnkub3ZlcmxhcC5sZWZ0O1xyXG4gICAgICAgICAgICBhdmFpbGFibGVXaWR0aCA9IHBsb3Qud2lkdGggKyBnYXBTaXplICsgb3ZlcmxhcC5sZWZ0ICsgb3ZlcmxhcC5yaWdodDtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBncm91cHNcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB0cmFuc2xhdGUgPSBcInRyYW5zbGF0ZShcIiArIChwYWRkaW5nIC0gb3ZlcmxhcC5sZWZ0KSArIFwiLFwiICsgKChwbG90LmNlbGxIZWlnaHQgKiB2YWx1ZXNCZWZvcmVDb3VudCkgKyBpICogZ2FwU2l6ZSArIGdhcHNCZWZvcmVTaXplICsgcGFkZGluZykgKyBcIilcIjtcclxuICAgICAgICAgICAgICAgIGdhcHNCZWZvcmVTaXplICs9IChkLmdhcHNJbnNpZGVTaXplIHx8IDApO1xyXG4gICAgICAgICAgICAgICAgdmFsdWVzQmVmb3JlQ291bnQgKz0gZC5hbGxWYWx1ZXNDb3VudCB8fCAwO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYW5zbGF0ZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHZhciBncm91cFdpZHRoID0gYXZhaWxhYmxlV2lkdGggLSBwYWRkaW5nICogMjtcclxuXHJcbiAgICAgICAgdmFyIHRpdGxlR3JvdXBzID0gZ3JvdXBzLnNlbGVjdEFsbChcImcudGl0bGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwidHJhbnNsYXRlKFwiICsgKGdyb3VwV2lkdGggLSB0aXRsZVJlY3RXaWR0aCkgKyBcIiwgMClcIik7XHJcblxyXG4gICAgICAgIHZhciB0aWxlUmVjdHMgPSB0aXRsZUdyb3Vwcy5zZWxlY3RBbGwoXCJyZWN0XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgdGl0bGVSZWN0V2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGQ9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCkgKyBwbG90LmNlbGxIZWlnaHQgKiBkLmFsbFZhbHVlc0NvdW50ICsgcGFkZGluZyAqIDJcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAwKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcImZpbGxcIiwgXCJsaWdodGdyZXlcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0R3JvdXBNb3VzZUNhbGxiYWNrcyhwYXJlbnRHcm91cCwgdGlsZVJlY3RzKTtcclxuXHJcblxyXG4gICAgICAgIGdyb3Vwcy5zZWxlY3RBbGwoXCJyZWN0Lmdyb3VwLXJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBkPT4gXCJncm91cC1yZWN0IGdyb3VwLXJlY3QtXCIgKyBkLmluZGV4KVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGdyb3VwV2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGQ9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCkgKyBwbG90LmNlbGxIZWlnaHQgKiBkLmFsbFZhbHVlc0NvdW50ICsgcGFkZGluZyAqIDJcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgXCJ3aGl0ZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImZpbGwtb3BhY2l0eVwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCAwLjUpXHJcbiAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlXCIsIFwiYmxhY2tcIilcclxuXHJcblxyXG4gICAgICAgIGdyb3Vwcy5lYWNoKGZ1bmN0aW9uIChncm91cCkge1xyXG5cclxuICAgICAgICAgICAgc2VsZi5kcmF3R3JvdXBzWS5jYWxsKHNlbGYsIGdyb3VwLCBkMy5zZWxlY3QodGhpcyksIGdyb3VwV2lkdGggLSB0aXRsZVJlY3RXaWR0aCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGRyYXdHcm91cHNYKHBhcmVudEdyb3VwLCBjb250YWluZXIsIGF2YWlsYWJsZUhlaWdodCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcblxyXG4gICAgICAgIHZhciBncm91cENsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImdyb3VwXCIpO1xyXG4gICAgICAgIHZhciBncm91cFhDbGFzcyA9IGdyb3VwQ2xhc3MgKyBcIi14XCI7XHJcbiAgICAgICAgdmFyIGdyb3VwcyA9IGNvbnRhaW5lci5zZWxlY3RBbGwoXCJnLlwiICsgZ3JvdXBDbGFzcyArIFwiLlwiICsgZ3JvdXBYQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBhcmVudEdyb3VwLmNoaWxkcmVuTGlzdCk7XHJcblxyXG4gICAgICAgIHZhciB2YWx1ZXNCZWZvcmVDb3VudCA9IDA7XHJcbiAgICAgICAgdmFyIGdhcHNCZWZvcmVTaXplID0gMDtcclxuXHJcbiAgICAgICAgdmFyIGdyb3Vwc0VudGVyRyA9IGdyb3Vwcy5lbnRlcigpLmFwcGVuZChcImdcIik7XHJcbiAgICAgICAgZ3JvdXBzRW50ZXJHXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKGdyb3VwQ2xhc3MsIHRydWUpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKGdyb3VwWENsYXNzLCB0cnVlKVxyXG4gICAgICAgICAgICAuYXBwZW5kKFwicmVjdFwiKS5jbGFzc2VkKFwiZ3JvdXAtcmVjdFwiLCB0cnVlKTtcclxuXHJcbiAgICAgICAgdmFyIHRpdGxlR3JvdXBFbnRlciA9IGdyb3Vwc0VudGVyRy5hcHBlbmRTZWxlY3RvcihcImcudGl0bGVcIik7XHJcbiAgICAgICAgdGl0bGVHcm91cEVudGVyLmFwcGVuZChcInJlY3RcIik7XHJcbiAgICAgICAgdGl0bGVHcm91cEVudGVyLmFwcGVuZChcInRleHRcIik7XHJcblxyXG4gICAgICAgIHZhciBnYXBTaXplID0gSGVhdG1hcC5jb21wdXRlR2FwU2l6ZShwYXJlbnRHcm91cC5sZXZlbCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBnYXBTaXplIC8gNDtcclxuICAgICAgICB2YXIgdGl0bGVSZWN0SGVpZ2h0ID0gSGVhdG1hcC5ncm91cFRpdGxlUmVjdEhlaWdodDtcclxuXHJcbiAgICAgICAgdmFyIGRlcHRoID0gc2VsZi5jb25maWcueC5ncm91cHMua2V5cy5sZW5ndGggLSBwYXJlbnRHcm91cC5sZXZlbDtcclxuXHJcbiAgICAgICAgdmFyIG92ZXJsYXAgPSB7XHJcbiAgICAgICAgICAgIHRvcDogMCxcclxuICAgICAgICAgICAgYm90dG9tOiAwXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKCFhdmFpbGFibGVIZWlnaHQpIHtcclxuICAgICAgICAgICAgb3ZlcmxhcC5ib3R0b20gPSBwbG90Lngub3ZlcmxhcC5ib3R0b207XHJcbiAgICAgICAgICAgIG92ZXJsYXAudG9wID0gcGxvdC54Lm92ZXJsYXAudG9wO1xyXG4gICAgICAgICAgICBhdmFpbGFibGVIZWlnaHQgPSBwbG90LmhlaWdodCArIGdhcFNpemUgKyBvdmVybGFwLnRvcCArIG92ZXJsYXAuYm90dG9tO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvdmVybGFwLnRvcCA9IC10aXRsZVJlY3RIZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdwYXJlbnRHcm91cCcscGFyZW50R3JvdXAsICdnYXBTaXplJywgZ2FwU2l6ZSwgcGxvdC54Lm92ZXJsYXApO1xyXG5cclxuICAgICAgICBncm91cHNcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB0cmFuc2xhdGUgPSBcInRyYW5zbGF0ZShcIiArICgocGxvdC5jZWxsV2lkdGggKiB2YWx1ZXNCZWZvcmVDb3VudCkgKyBpICogZ2FwU2l6ZSArIGdhcHNCZWZvcmVTaXplICsgcGFkZGluZykgKyBcIiwgXCIgKyAocGFkZGluZyAtIG92ZXJsYXAudG9wKSArIFwiKVwiO1xyXG4gICAgICAgICAgICAgICAgZ2Fwc0JlZm9yZVNpemUgKz0gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCk7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZXNCZWZvcmVDb3VudCArPSBkLmFsbFZhbHVlc0NvdW50IHx8IDA7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhbnNsYXRlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgZ3JvdXBIZWlnaHQgPSBhdmFpbGFibGVIZWlnaHQgLSBwYWRkaW5nICogMjtcclxuXHJcbiAgICAgICAgdmFyIHRpdGxlR3JvdXBzID0gZ3JvdXBzLnNlbGVjdEFsbChcImcudGl0bGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwidHJhbnNsYXRlKDAsIFwiICsgKDApICsgXCIpXCIpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIHRpbGVSZWN0cyA9IHRpdGxlR3JvdXBzLnNlbGVjdEFsbChcInJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgdGl0bGVSZWN0SGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGQ9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCkgKyBwbG90LmNlbGxXaWR0aCAqIGQuYWxsVmFsdWVzQ291bnQgKyBwYWRkaW5nICogMlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIDApXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiZmlsbFwiLCBcImxpZ2h0Z3JleVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRHcm91cE1vdXNlQ2FsbGJhY2tzKHBhcmVudEdyb3VwLCB0aWxlUmVjdHMpO1xyXG5cclxuXHJcbiAgICAgICAgZ3JvdXBzLnNlbGVjdEFsbChcInJlY3QuZ3JvdXAtcmVjdFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGQ9PiBcImdyb3VwLXJlY3QgZ3JvdXAtcmVjdC1cIiArIGQuaW5kZXgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGdyb3VwSGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGQ9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCkgKyBwbG90LmNlbGxXaWR0aCAqIGQuYWxsVmFsdWVzQ291bnQgKyBwYWRkaW5nICogMlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCBcIndoaXRlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZmlsbC1vcGFjaXR5XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDAuNSlcclxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2VcIiwgXCJibGFja1wiKTtcclxuXHJcbiAgICAgICAgZ3JvdXBzLmVhY2goZnVuY3Rpb24gKGdyb3VwKSB7XHJcbiAgICAgICAgICAgIHNlbGYuZHJhd0dyb3Vwc1guY2FsbChzZWxmLCBncm91cCwgZDMuc2VsZWN0KHRoaXMpLCBncm91cEhlaWdodCAtIHRpdGxlUmVjdEhlaWdodCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGdyb3Vwcy5leGl0KCkucmVtb3ZlKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNldEdyb3VwTW91c2VDYWxsYmFja3MocGFyZW50R3JvdXAsIHRpbGVSZWN0cykge1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgbW91c2VvdmVyQ2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoJ2hpZ2hsaWdodGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzLnBhcmVudE5vZGUucGFyZW50Tm9kZSkuc2VsZWN0QWxsKFwicmVjdC5ncm91cC1yZWN0LVwiICsgZC5pbmRleCkuY2xhc3NlZCgnaGlnaGxpZ2h0ZWQnLCB0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIG1vdXNlb3V0Q2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgbW91c2VvdXRDYWxsYmFja3MucHVzaChmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICBkMy5zZWxlY3QodGhpcykuY2xhc3NlZCgnaGlnaGxpZ2h0ZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzLnBhcmVudE5vZGUucGFyZW50Tm9kZSkuc2VsZWN0QWxsKFwicmVjdC5ncm91cC1yZWN0LVwiICsgZC5pbmRleCkuY2xhc3NlZCgnaGlnaGxpZ2h0ZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHBsb3QudG9vbHRpcCkge1xyXG5cclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goZD0+IHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGh0bWwgPSBwYXJlbnRHcm91cC5sYWJlbCArIFwiOiBcIiArIGQuZ3JvdXBpbmdWYWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAuaHRtbChodG1sKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkMy5ldmVudC5wYWdlWSAtIDI4KSArIFwicHhcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MucHVzaChkPT4ge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgdGlsZVJlY3RzLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKHNlbGYsIGQpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRpbGVSZWN0cy5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoc2VsZiwgZClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlQ2VsbHMoKSB7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgY2VsbENvbnRhaW5lckNsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImNlbGxzXCIpO1xyXG4gICAgICAgIHZhciBnYXBTaXplID0gSGVhdG1hcC5jb21wdXRlR2FwU2l6ZSgwKTtcclxuICAgICAgICB2YXIgcGFkZGluZ1ggPSBwbG90LnguZ3JvdXBzLmNoaWxkcmVuTGlzdC5sZW5ndGggPyBnYXBTaXplIC8gMiA6IDA7XHJcbiAgICAgICAgdmFyIHBhZGRpbmdZID0gcGxvdC55Lmdyb3Vwcy5jaGlsZHJlbkxpc3QubGVuZ3RoID8gZ2FwU2l6ZSAvIDIgOiAwO1xyXG4gICAgICAgIHZhciBjZWxsQ29udGFpbmVyID0gc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIiArIGNlbGxDb250YWluZXJDbGFzcyk7XHJcbiAgICAgICAgY2VsbENvbnRhaW5lci5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgcGFkZGluZ1ggKyBcIiwgXCIgKyBwYWRkaW5nWSArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJjZWxsXCIpO1xyXG4gICAgICAgIHZhciBjZWxsU2hhcGUgPSBwbG90Lnouc2hhcGUudHlwZTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxzID0gY2VsbENvbnRhaW5lci5zZWxlY3RBbGwoXCJnLlwiICsgY2VsbENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShzZWxmLnBsb3QuY2VsbHMpO1xyXG5cclxuICAgICAgICB2YXIgY2VsbEVudGVyRyA9IGNlbGxzLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuY2xhc3NlZChjZWxsQ2xhc3MsIHRydWUpO1xyXG4gICAgICAgIGNlbGxzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYz0+IFwidHJhbnNsYXRlKFwiICsgKChwbG90LmNlbGxXaWR0aCAqIGMuY29sICsgcGxvdC5jZWxsV2lkdGggLyAyKSArIGMuY29sVmFyLmdyb3VwLmdhcHNTaXplKSArIFwiLFwiICsgKChwbG90LmNlbGxIZWlnaHQgKiBjLnJvdyArIHBsb3QuY2VsbEhlaWdodCAvIDIpICsgYy5yb3dWYXIuZ3JvdXAuZ2Fwc1NpemUpICsgXCIpXCIpO1xyXG5cclxuICAgICAgICB2YXIgc2hhcGVzID0gY2VsbHMuc2VsZWN0T3JBcHBlbmQoY2VsbFNoYXBlICsgXCIuY2VsbC1zaGFwZS1cIiArIGNlbGxTaGFwZSk7XHJcblxyXG4gICAgICAgIHNoYXBlc1xyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHBsb3Quei5zaGFwZS53aWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgcGxvdC56LnNoYXBlLmhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIC1wbG90LmNlbGxXaWR0aCAvIDIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAtcGxvdC5jZWxsSGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICAgIHNoYXBlcy5zdHlsZShcImZpbGxcIiwgYz0+IGMudmFsdWUgPT09IHVuZGVmaW5lZCA/IHNlbGYuY29uZmlnLmNvbG9yLm5vRGF0YUNvbG9yIDogcGxvdC56LmNvbG9yLnNjYWxlKGMudmFsdWUpKTtcclxuICAgICAgICBzaGFwZXMuYXR0cihcImZpbGwtb3BhY2l0eVwiLCBkPT4gZC52YWx1ZSA9PT0gdW5kZWZpbmVkID8gMCA6IDEpO1xyXG5cclxuICAgICAgICB2YXIgbW91c2VvdmVyQ2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgdmFyIG1vdXNlb3V0Q2FsbGJhY2tzID0gW107XHJcblxyXG4gICAgICAgIGlmIChwbG90LnRvb2x0aXApIHtcclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3ZlckNhbGxiYWNrcy5wdXNoKGM9PiB7XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDIwMClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIC45KTtcclxuICAgICAgICAgICAgICAgIHZhciBodG1sID0gYy52YWx1ZSA9PT0gdW5kZWZpbmVkID8gc2VsZi5jb25maWcudG9vbHRpcC5ub0RhdGFUZXh0IDogc2VsZi5mb3JtYXRWYWx1ZVooYy52YWx1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLmh0bWwoaHRtbClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLnB1c2goYz0+IHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2VsZi5jb25maWcuaGlnaGxpZ2h0TGFiZWxzKSB7XHJcbiAgICAgICAgICAgIHZhciBoaWdobGlnaHRDbGFzcyA9IHNlbGYuY29uZmlnLmNzc0NsYXNzUHJlZml4ICsgXCJoaWdobGlnaHRcIjtcclxuICAgICAgICAgICAgdmFyIHhMYWJlbENsYXNzID0gYz0+cGxvdC5sYWJlbENsYXNzICsgXCIteC1cIiArIGMuY29sO1xyXG4gICAgICAgICAgICB2YXIgeUxhYmVsQ2xhc3MgPSBjPT5wbG90LmxhYmVsQ2xhc3MgKyBcIi15LVwiICsgYy5yb3c7XHJcblxyXG5cclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goYz0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHhMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgeUxhYmVsQ2xhc3MoYykpLmNsYXNzZWQoaGlnaGxpZ2h0Q2xhc3MsIHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MucHVzaChjPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB4TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB5TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBjZWxscy5vbihcIm1vdXNlb3ZlclwiLCBjID0+IHtcclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2s9PmNhbGxiYWNrKGMpKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCBjID0+IHtcclxuICAgICAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2s9PmNhbGxiYWNrKGMpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNlbGxzLm9uKFwiY2xpY2tcIiwgYz0+IHtcclxuICAgICAgICAgICAgc2VsZi50cmlnZ2VyKFwiY2VsbC1zZWxlY3RlZFwiLCBjKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIGNlbGxzLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3JtYXRWYWx1ZVgodmFsdWUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLnguZm9ybWF0dGVyKSByZXR1cm4gdmFsdWU7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy54LmZvcm1hdHRlci5jYWxsKHRoaXMuY29uZmlnLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9ybWF0VmFsdWVZKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy55LmZvcm1hdHRlcikgcmV0dXJuIHZhbHVlO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcueS5mb3JtYXR0ZXIuY2FsbCh0aGlzLmNvbmZpZywgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcm1hdFZhbHVlWih2YWx1ZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcuei5mb3JtYXR0ZXIpIHJldHVybiB2YWx1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnouZm9ybWF0dGVyLmNhbGwodGhpcy5jb25maWcsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3JtYXRMZWdlbmRWYWx1ZSh2YWx1ZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcubGVnZW5kLmZvcm1hdHRlcikgcmV0dXJuIHZhbHVlO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcubGVnZW5kLmZvcm1hdHRlci5jYWxsKHRoaXMuY29uZmlnLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTGVnZW5kKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgbGVnZW5kWCA9IHRoaXMucGxvdC53aWR0aCArIDEwO1xyXG4gICAgICAgIHZhciBnYXBTaXplID0gSGVhdG1hcC5jb21wdXRlR2FwU2l6ZSgwKTtcclxuICAgICAgICBpZiAodGhpcy5wbG90Lmdyb3VwQnlZKSB7XHJcbiAgICAgICAgICAgIGxlZ2VuZFggKz0gZ2FwU2l6ZSAvIDIgKyBwbG90Lnkub3ZlcmxhcC5yaWdodDtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucGxvdC5ncm91cEJ5WCkge1xyXG4gICAgICAgICAgICBsZWdlbmRYICs9IGdhcFNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsZWdlbmRZID0gMDtcclxuICAgICAgICBpZiAodGhpcy5wbG90Lmdyb3VwQnlYIHx8IHRoaXMucGxvdC5ncm91cEJ5WSkge1xyXG4gICAgICAgICAgICBsZWdlbmRZICs9IGdhcFNpemUgLyAyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGJhcldpZHRoID0gMTA7XHJcbiAgICAgICAgdmFyIGJhckhlaWdodCA9IHRoaXMucGxvdC5oZWlnaHQgLSAyO1xyXG4gICAgICAgIHZhciBzY2FsZSA9IHBsb3Quei5jb2xvci5zY2FsZTtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmQgPSBuZXcgTGVnZW5kKHRoaXMuc3ZnLCB0aGlzLnN2Z0csIHNjYWxlLCBsZWdlbmRYLCBsZWdlbmRZLCB2ID0+IHNlbGYuZm9ybWF0TGVnZW5kVmFsdWUodikpLnNldFJvdGF0ZUxhYmVscyhzZWxmLmNvbmZpZy5sZWdlbmQucm90YXRlTGFiZWxzKS5saW5lYXJHcmFkaWVudEJhcihiYXJXaWR0aCwgYmFySGVpZ2h0KTtcclxuICAgIH1cclxuXHJcblxyXG59XHJcbiIsImltcG9ydCB7Q2hhcnQsIENoYXJ0Q29uZmlnfSBmcm9tIFwiLi9jaGFydFwiO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5pbXBvcnQge0xlZ2VuZH0gZnJvbSBcIi4vbGVnZW5kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSGlzdG9ncmFtQ29uZmlnIGV4dGVuZHMgQ2hhcnRDb25maWd7XHJcblxyXG4gICAgc3ZnQ2xhc3M9IHRoaXMuY3NzQ2xhc3NQcmVmaXgrJ2hpc3RvZ3JhbSc7XHJcbiAgICBzaG93TGVnZW5kPXRydWU7XHJcbiAgICBzaG93VG9vbHRpcCA9dHJ1ZTtcclxuICAgIGxlZ2VuZD17XHJcbiAgICAgICAgd2lkdGg6IDgwLFxyXG4gICAgICAgIG1hcmdpbjogMTAsXHJcbiAgICAgICAgc2hhcGVXaWR0aDogMjBcclxuICAgIH07XHJcbiAgICB4PXsvLyBYIGF4aXMgY29uZmlnXHJcbiAgICAgICAgbGFiZWw6ICcnLCAvLyBheGlzIGxhYmVsXHJcbiAgICAgICAga2V5OiAwLFxyXG4gICAgICAgIHZhbHVlOiAoZCwga2V5KSA9PiBVdGlscy5pc051bWJlcihkKSA/IGQgOiBkW2tleV0sIC8vIHggdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIixcclxuICAgICAgICB0aWNrczogdW5kZWZpbmVkLFxyXG4gICAgfTtcclxuICAgIHk9ey8vIFkgYXhpcyBjb25maWdcclxuICAgICAgICBsYWJlbDogJycsIC8vIGF4aXMgbGFiZWwsXHJcbiAgICAgICAgb3JpZW50OiBcImxlZnRcIixcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIlxyXG4gICAgfTtcclxuICAgIGZyZXF1ZW5jeT10cnVlO1xyXG4gICAgZ3JvdXBzPXtcclxuICAgICAgICBrZXk6IDEsXHJcbiAgICAgICAgdmFsdWU6IChkKSA9PiBkW3RoaXMuZ3JvdXBzLmtleV0gLCAvLyBncm91cGluZyB2YWx1ZSBhY2Nlc3NvcixcclxuICAgICAgICBsYWJlbDogXCJcIlxyXG4gICAgfTtcclxuICAgIGNvbG9yID0gdW5kZWZpbmVkIC8vIHN0cmluZyBvciBmdW5jdGlvbiByZXR1cm5pbmcgY29sb3IncyB2YWx1ZSBmb3IgY29sb3Igc2NhbGVcclxuICAgIGQzQ29sb3JDYXRlZ29yeT0gJ2NhdGVnb3J5MTAnO1xyXG4gICAgdHJhbnNpdGlvbj0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdmFyIGNvbmZpZyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmKGN1c3RvbSl7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSGlzdG9ncmFtIGV4dGVuZHMgQ2hhcnR7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBzdXBlcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBuZXcgSGlzdG9ncmFtQ29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpe1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IEhpc3RvZ3JhbUNvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpe1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcbiAgICAgICAgdmFyIHNlbGY9dGhpcztcclxuXHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgdGhpcy5wbG90Lng9e307XHJcbiAgICAgICAgdGhpcy5wbG90Lnk9e307XHJcbiAgICAgICAgdGhpcy5wbG90LmJhcj17XHJcbiAgICAgICAgICAgIGNvbG9yOiBudWxsLy9jb2xvciBzY2FsZSBtYXBwaW5nIGZ1bmN0aW9uXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnNob3dMZWdlbmQgPSBjb25mLnNob3dMZWdlbmQ7XHJcbiAgICAgICAgaWYodGhpcy5wbG90LnNob3dMZWdlbmQpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWFyZ2luLnJpZ2h0ID0gY29uZi5tYXJnaW4ucmlnaHQgKyBjb25mLmxlZ2VuZC53aWR0aCtjb25mLmxlZ2VuZC5tYXJnaW4qMjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLmNvbXB1dGVQbG90U2l6ZSgpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cFgoKTtcclxuICAgICAgICB0aGlzLnNldHVwSGlzdG9ncmFtKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cEdyb3VwU3RhY2tzKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFkoKTtcclxuXHJcbiAgICAgICAgaWYoY29uZi5kM0NvbG9yQ2F0ZWdvcnkpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuY29sb3JDYXRlZ29yeSA9IGQzLnNjYWxlW2NvbmYuZDNDb2xvckNhdGVnb3J5XSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY29sb3JWYWx1ZSA9IGNvbmYuY29sb3I7XHJcbiAgICAgICAgaWYgKGNvbG9yVmFsdWUgJiYgdHlwZW9mIGNvbG9yVmFsdWUgPT09ICdzdHJpbmcnIHx8IGNvbG9yVmFsdWUgaW5zdGFuY2VvZiBTdHJpbmcpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuY29sb3IgPSBjb2xvclZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKHRoaXMucGxvdC5jb2xvckNhdGVnb3J5KXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmNvbG9yID0gZCA9PiAgc2VsZi5wbG90LmNvbG9yQ2F0ZWdvcnkoZC5rZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXBYKCl7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB4ID0gcGxvdC54O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWcueDtcclxuXHJcbiAgICAgICAgLyogKlxyXG4gICAgICAgICAqIHZhbHVlIGFjY2Vzc29yIC0gcmV0dXJucyB0aGUgdmFsdWUgdG8gZW5jb2RlIGZvciBhIGdpdmVuIGRhdGEgb2JqZWN0LlxyXG4gICAgICAgICAqIHNjYWxlIC0gbWFwcyB2YWx1ZSB0byBhIHZpc3VhbCBkaXNwbGF5IGVuY29kaW5nLCBzdWNoIGFzIGEgcGl4ZWwgcG9zaXRpb24uXHJcbiAgICAgICAgICogbWFwIGZ1bmN0aW9uIC0gbWFwcyBmcm9tIGRhdGEgdmFsdWUgdG8gZGlzcGxheSB2YWx1ZVxyXG4gICAgICAgICAqIGF4aXMgLSBzZXRzIHVwIGF4aXNcclxuICAgICAgICAgKiovXHJcbiAgICAgICAgeC52YWx1ZSA9IGQgPT4gY29uZi52YWx1ZShkLCBjb25mLmtleSk7XHJcbiAgICAgICAgeC5zY2FsZSA9IGQzLnNjYWxlW2NvbmYuc2NhbGVdKCkucmFuZ2UoWzAsIHBsb3Qud2lkdGhdKTtcclxuICAgICAgICB4Lm1hcCA9IGQgPT4geC5zY2FsZSh4LnZhbHVlKGQpKTtcclxuXHJcbiAgICAgICAgeC5heGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh4LnNjYWxlKS5vcmllbnQoY29uZi5vcmllbnQpO1xyXG4gICAgICAgIGlmKGNvbmYudGlja3Mpe1xyXG4gICAgICAgICAgICB4LmF4aXMudGlja3MoY29uZi50aWNrcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIHBsb3QueC5zY2FsZS5kb21haW4oW2QzLm1pbihkYXRhLCBwbG90LngudmFsdWUpLCBkMy5tYXgoZGF0YSwgcGxvdC54LnZhbHVlKV0pO1xyXG4gICAgICAgIFxyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cFkgKCl7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB5ID0gcGxvdC55O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWcueTtcclxuICAgICAgICB5LnNjYWxlID0gZDMuc2NhbGVbY29uZi5zY2FsZV0oKS5yYW5nZShbcGxvdC5oZWlnaHQsIDBdKTtcclxuXHJcbiAgICAgICAgeS5heGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh5LnNjYWxlKS5vcmllbnQoY29uZi5vcmllbnQpO1xyXG5cclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgICAgICBwbG90Lnkuc2NhbGUuZG9tYWluKFswLCBkMy5tYXgocGxvdC5oaXN0b2dyYW1CaW5zLCBkPT5kLnkpXSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwSGlzdG9ncmFtKCkge1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB4ID0gcGxvdC54O1xyXG4gICAgICAgIHZhciB5ID0gcGxvdC55O1xyXG4gICAgICAgIHZhciB0aWNrcyA9IHRoaXMuY29uZmlnLngudGlja3MgPyB4LnNjYWxlLnRpY2tzKHRoaXMuY29uZmlnLngudGlja3MpIDogeC5zY2FsZS50aWNrcygpO1xyXG5cclxuICAgICAgICBwbG90Lmhpc3RvZ3JhbSA9IGQzLmxheW91dC5oaXN0b2dyYW0oKS5mcmVxdWVuY3kodGhpcy5jb25maWcuZnJlcXVlbmN5KVxyXG4gICAgICAgICAgICAudmFsdWUoeC52YWx1ZSlcclxuICAgICAgICAgICAgLmJpbnModGlja3MpO1xyXG4gICAgICAgIHBsb3QuaGlzdG9ncmFtQmlucyA9IHBsb3QuaGlzdG9ncmFtKHRoaXMuZGF0YSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNldHVwR3JvdXBTdGFja3MoKSB7XHJcbiAgICAgICAgdmFyIHNlbGY9dGhpcztcclxuICAgICAgICB0aGlzLnBsb3QuZ3JvdXBpbmdFbmFibGVkID0gdGhpcy5jb25maWcuZ3JvdXBzICYmIHRoaXMuY29uZmlnLmdyb3Vwcy52YWx1ZTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnBsb3Quc3RhY2sgPSBkMy5sYXlvdXQuc3RhY2soKS52YWx1ZXMoZD0+ZC5oaXN0b2dyYW1CaW5zKTtcclxuICAgICAgICB0aGlzLnBsb3QuZ3JvdXBlZERhdGEgPSAgZDMubmVzdCgpLmtleShkID0+IHRoaXMucGxvdC5ncm91cGluZ0VuYWJsZWQgPyB0aGlzLmNvbmZpZy5ncm91cHMudmFsdWUuY2FsbCh0aGlzLmNvbmZpZywgZCkgOiAncm9vdCcgKS5lbnRyaWVzKHRoaXMuZGF0YSk7XHJcbiAgICAgICAgdGhpcy5wbG90Lmdyb3VwZWREYXRhLmZvckVhY2goZD0+e1xyXG4gICAgICAgICAgICBkLmhpc3RvZ3JhbUJpbnMgPSB0aGlzLnBsb3QuaGlzdG9ncmFtLmZyZXF1ZW5jeSh0aGlzLmNvbmZpZy5mcmVxdWVuY3kgfHwgdGhpcy5wbG90Lmdyb3VwaW5nRW5hYmxlZCkoZC52YWx1ZXMpO1xyXG4gICAgICAgICAgICBpZighdGhpcy5jb25maWcuZnJlcXVlbmN5ICYmIHRoaXMucGxvdC5ncm91cGluZ0VuYWJsZWQpe1xyXG4gICAgICAgICAgICAgICAgZC5oaXN0b2dyYW1CaW5zLmZvckVhY2goYiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYi5keSA9IGIuZHkvdGhpcy5kYXRhLmxlbmd0aFxyXG4gICAgICAgICAgICAgICAgICAgIGIueSA9IGIueS90aGlzLmRhdGEubGVuZ3RoXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucGxvdC5zdGFja2VkSGlzdG9ncmFtcyA9IHRoaXMucGxvdC5zdGFjayh0aGlzLnBsb3QuZ3JvdXBlZERhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXdBeGlzWCgpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgYXhpc0NvbmYgPSB0aGlzLmNvbmZpZy54O1xyXG4gICAgICAgIHZhciBheGlzID0gc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIitzZWxmLnByZWZpeENsYXNzKCdheGlzLXgnKStcIi5cIitzZWxmLnByZWZpeENsYXNzKCdheGlzJykrKHNlbGYuY29uZmlnLmd1aWRlcyA/ICcnIDogJy4nK3NlbGYucHJlZml4Q2xhc3MoJ25vLWd1aWRlcycpKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIHBsb3QuaGVpZ2h0ICsgXCIpXCIpO1xyXG5cclxuICAgICAgICB2YXIgYXhpc1QgPSBheGlzO1xyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy50cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGF4aXNUID0gYXhpcy50cmFuc2l0aW9uKCkuZWFzZShcInNpbi1pbi1vdXRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBheGlzVC5jYWxsKHBsb3QueC5heGlzKTtcclxuXHJcbiAgICAgICAgYXhpcy5zZWxlY3RPckFwcGVuZChcInRleHQuXCIrc2VsZi5wcmVmaXhDbGFzcygnbGFiZWwnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrIChwbG90LndpZHRoLzIpICtcIixcIisgKHBsb3QubWFyZ2luLmJvdHRvbSkgK1wiKVwiKSAgLy8gdGV4dCBpcyBkcmF3biBvZmYgdGhlIHNjcmVlbiB0b3AgbGVmdCwgbW92ZSBkb3duIGFuZCBvdXQgYW5kIHJvdGF0ZVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiLTFlbVwiKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAudGV4dChheGlzQ29uZi5sYWJlbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRyYXdBeGlzWSgpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgYXhpc0NvbmYgPSB0aGlzLmNvbmZpZy55O1xyXG4gICAgICAgIHZhciBheGlzID0gc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIitzZWxmLnByZWZpeENsYXNzKCdheGlzLXknKStcIi5cIitzZWxmLnByZWZpeENsYXNzKCdheGlzJykrKHNlbGYuY29uZmlnLmd1aWRlcyA/ICcnIDogJy4nK3NlbGYucHJlZml4Q2xhc3MoJ25vLWd1aWRlcycpKSk7XHJcblxyXG4gICAgICAgIHZhciBheGlzVCA9IGF4aXM7XHJcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLnRyYW5zaXRpb24pIHtcclxuICAgICAgICAgICAgYXhpc1QgPSBheGlzLnRyYW5zaXRpb24oKS5lYXNlKFwic2luLWluLW91dFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGF4aXNULmNhbGwocGxvdC55LmF4aXMpO1xyXG5cclxuICAgICAgICBheGlzLnNlbGVjdE9yQXBwZW5kKFwidGV4dC5cIitzZWxmLnByZWZpeENsYXNzKCdsYWJlbCcpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisgLXBsb3QubWFyZ2luLmxlZnQgK1wiLFwiKyhwbG90LmhlaWdodC8yKStcIilyb3RhdGUoLTkwKVwiKSAgLy8gdGV4dCBpcyBkcmF3biBvZmYgdGhlIHNjcmVlbiB0b3AgbGVmdCwgbW92ZSBkb3duIGFuZCBvdXQgYW5kIHJvdGF0ZVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGF4aXNDb25mLmxhYmVsKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIGRyYXdIaXN0b2dyYW0oKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBsYXllckNsYXNzID0gdGhpcy5wcmVmaXhDbGFzcyhcImxheWVyXCIpO1xyXG5cclxuICAgICAgICB2YXIgYmFyQ2xhc3MgPSB0aGlzLnByZWZpeENsYXNzKFwiYmFyXCIpO1xyXG4gICAgICAgIHZhciBsYXllciA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCIuXCIrbGF5ZXJDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGxvdC5zdGFja2VkSGlzdG9ncmFtcyk7XHJcblxyXG4gICAgICAgIGxheWVyLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGxheWVyQ2xhc3MpO1xyXG5cclxuICAgICAgICB2YXIgYmFyID0gbGF5ZXIuc2VsZWN0QWxsKFwiLlwiK2JhckNsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShkID0+IGQuaGlzdG9ncmFtQmlucyk7XHJcblxyXG4gICAgICAgIGJhci5lbnRlcigpLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBiYXJDbGFzcylcclxuICAgICAgICAgICAgLmFwcGVuZChcInJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDEpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGJhclJlY3QgPSBiYXIuc2VsZWN0KFwicmVjdFwiKTtcclxuXHJcbiAgICAgICAgdmFyIGJhclJlY3RUID0gYmFyUmVjdDtcclxuICAgICAgICB2YXIgYmFyVCA9IGJhcjtcclxuICAgICAgICB2YXIgbGF5ZXJUID0gbGF5ZXI7XHJcbiAgICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbkVuYWJsZWQoKSkge1xyXG4gICAgICAgICAgICBiYXJSZWN0VCA9IGJhclJlY3QudHJhbnNpdGlvbigpO1xyXG4gICAgICAgICAgICBiYXJUID0gYmFyLnRyYW5zaXRpb24oKTtcclxuICAgICAgICAgICAgbGF5ZXJUPSBsYXllci50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBiYXJULmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBwbG90Lnguc2NhbGUoZC54KSArIFwiLFwiICsgKHBsb3QueS5zY2FsZShkLnkwICtkLnkpKSArIFwiKVwiOyB9KTtcclxuXHJcbiAgICAgICAgYmFyUmVjdFRcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCAgcGxvdC54LnNjYWxlKHBsb3QuaGlzdG9ncmFtQmluc1swXS5keCkgLSBwbG90Lnguc2NhbGUoMCktIDEpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGQgPT4gICBwbG90LmhlaWdodCAtIHBsb3QueS5zY2FsZShkLnkpKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5wbG90LmNvbG9yKXtcclxuICAgICAgICAgICAgbGF5ZXJUXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgdGhpcy5wbG90LmNvbG9yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwbG90LnRvb2x0aXApIHtcclxuICAgICAgICAgICAgYmFyLm9uKFwibW91c2VvdmVyXCIsIGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAuOSk7XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAuaHRtbChkLnkpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZDMuZXZlbnQucGFnZVggKyA1KSArIFwicHhcIilcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcclxuICAgICAgICAgICAgfSkub24oXCJtb3VzZW91dFwiLCBkID0+IHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsYXllci5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICAgICAgYmFyLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUobmV3RGF0YSl7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKG5ld0RhdGEpO1xyXG4gICAgICAgIHRoaXMuZHJhd0F4aXNYKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3QXhpc1koKTtcclxuXHJcbiAgICAgICAgdGhpcy5kcmF3SGlzdG9ncmFtKCk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlTGVnZW5kKCk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICB1cGRhdGVMZWdlbmQoKSB7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcblxyXG4gICAgICAgIHZhciBzY2FsZSA9IHBsb3QuY29sb3JDYXRlZ29yeTtcclxuICAgICAgICBpZighc2NhbGUuZG9tYWluKCkgfHwgc2NhbGUuZG9tYWluKCkubGVuZ3RoPDIpe1xyXG4gICAgICAgICAgICBwbG90LnNob3dMZWdlbmQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCFwbG90LnNob3dMZWdlbmQpe1xyXG4gICAgICAgICAgICBpZihwbG90LmxlZ2VuZCAmJiBwbG90LmxlZ2VuZC5jb250YWluZXIpe1xyXG4gICAgICAgICAgICAgICAgcGxvdC5sZWdlbmQuY29udGFpbmVyLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB2YXIgbGVnZW5kWCA9IHRoaXMucGxvdC53aWR0aCArIHRoaXMuY29uZmlnLmxlZ2VuZC5tYXJnaW47XHJcbiAgICAgICAgdmFyIGxlZ2VuZFkgPSB0aGlzLmNvbmZpZy5sZWdlbmQubWFyZ2luO1xyXG5cclxuICAgICAgICBwbG90LmxlZ2VuZCA9IG5ldyBMZWdlbmQodGhpcy5zdmcsIHRoaXMuc3ZnRywgc2NhbGUsIGxlZ2VuZFgsIGxlZ2VuZFkpO1xyXG5cclxuICAgICAgICB2YXIgbGVnZW5kTGluZWFyID0gcGxvdC5sZWdlbmQuY29sb3IoKVxyXG4gICAgICAgICAgICAuc2hhcGVXaWR0aCh0aGlzLmNvbmZpZy5sZWdlbmQuc2hhcGVXaWR0aClcclxuICAgICAgICAgICAgLm9yaWVudCgndmVydGljYWwnKVxyXG4gICAgICAgICAgICAuc2NhbGUoc2NhbGUpO1xyXG5cclxuICAgICAgICBwbG90LmxlZ2VuZC5jb250YWluZXJcclxuICAgICAgICAgICAgLmNhbGwobGVnZW5kTGluZWFyKTtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHtEM0V4dGVuc2lvbnN9IGZyb20gJy4vZDMtZXh0ZW5zaW9ucydcclxuRDNFeHRlbnNpb25zLmV4dGVuZCgpO1xyXG5cclxuZXhwb3J0IHtTY2F0dGVyUGxvdCwgU2NhdHRlclBsb3RDb25maWd9IGZyb20gXCIuL3NjYXR0ZXJwbG90XCI7XHJcbmV4cG9ydCB7U2NhdHRlclBsb3RNYXRyaXgsIFNjYXR0ZXJQbG90TWF0cml4Q29uZmlnfSBmcm9tIFwiLi9zY2F0dGVycGxvdC1tYXRyaXhcIjtcclxuZXhwb3J0IHtDb3JyZWxhdGlvbk1hdHJpeCwgQ29ycmVsYXRpb25NYXRyaXhDb25maWd9IGZyb20gJy4vY29ycmVsYXRpb24tbWF0cml4J1xyXG5leHBvcnQge1JlZ3Jlc3Npb24sIFJlZ3Jlc3Npb25Db25maWd9IGZyb20gJy4vcmVncmVzc2lvbidcclxuZXhwb3J0IHtIZWF0bWFwLCBIZWF0bWFwQ29uZmlnfSBmcm9tICcuL2hlYXRtYXAnXHJcbmV4cG9ydCB7SGVhdG1hcFRpbWVTZXJpZXMsIEhlYXRtYXBUaW1lU2VyaWVzQ29uZmlnfSBmcm9tICcuL2hlYXRtYXAtdGltZXNlcmllcydcclxuZXhwb3J0IHtIaXN0b2dyYW0sIEhpc3RvZ3JhbUNvbmZpZ30gZnJvbSAnLi9oaXN0b2dyYW0nXHJcbmV4cG9ydCB7QmFyQ2hhcnQsIEJhckNoYXJ0Q29uZmlnfSBmcm9tICcuL2Jhci1jaGFydCdcclxuZXhwb3J0IHtTdGF0aXN0aWNzVXRpbHN9IGZyb20gJy4vc3RhdGlzdGljcy11dGlscydcclxuZXhwb3J0IHtMZWdlbmR9IGZyb20gJy4vbGVnZW5kJ1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiIsImltcG9ydCB7VXRpbHN9IGZyb20gXCIuL3V0aWxzXCI7XHJcbmltcG9ydCB7Y29sb3IsIHNpemUsIHN5bWJvbH0gZnJvbSBcIi4uL2Jvd2VyX2NvbXBvbmVudHMvZDMtbGVnZW5kL25vLWV4dGVuZFwiO1xyXG5cclxuLyp2YXIgZDMgPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL2QzJyk7XHJcbiovXHJcbi8vIHZhciBsZWdlbmQgPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL2QzLWxlZ2VuZC9uby1leHRlbmQnKTtcclxuLy9cclxuLy8gbW9kdWxlLmV4cG9ydHMubGVnZW5kID0gbGVnZW5kO1xyXG5cclxuZXhwb3J0IGNsYXNzIExlZ2VuZCB7XHJcblxyXG4gICAgY3NzQ2xhc3NQcmVmaXg9XCJvZGMtXCI7XHJcbiAgICBsZWdlbmRDbGFzcz10aGlzLmNzc0NsYXNzUHJlZml4K1wibGVnZW5kXCI7XHJcbiAgICBjb250YWluZXI7XHJcbiAgICBzY2FsZTtcclxuICAgIGNvbG9yPSBjb2xvcjtcclxuICAgIHNpemUgPSBzaXplO1xyXG4gICAgc3ltYm9sPSBzeW1ib2w7XHJcbiAgICBndWlkO1xyXG5cclxuICAgIGxhYmVsRm9ybWF0ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHN2ZywgbGVnZW5kUGFyZW50LCBzY2FsZSwgbGVnZW5kWCwgbGVnZW5kWSwgbGFiZWxGb3JtYXQpe1xyXG4gICAgICAgIHRoaXMuc2NhbGU9c2NhbGU7XHJcbiAgICAgICAgdGhpcy5zdmcgPSBzdmc7XHJcbiAgICAgICAgdGhpcy5ndWlkID0gVXRpbHMuZ3VpZCgpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gIFV0aWxzLnNlbGVjdE9yQXBwZW5kKGxlZ2VuZFBhcmVudCwgXCJnLlwiK3RoaXMubGVnZW5kQ2xhc3MsIFwiZ1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIitsZWdlbmRYK1wiLFwiK2xlZ2VuZFkrXCIpXCIpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKHRoaXMubGVnZW5kQ2xhc3MsIHRydWUpO1xyXG5cclxuICAgICAgICB0aGlzLmxhYmVsRm9ybWF0ID0gbGFiZWxGb3JtYXQ7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBsaW5lYXJHcmFkaWVudEJhcihiYXJXaWR0aCwgYmFySGVpZ2h0LCB0aXRsZSl7XHJcbiAgICAgICAgdmFyIGdyYWRpZW50SWQgPSB0aGlzLmNzc0NsYXNzUHJlZml4K1wibGluZWFyLWdyYWRpZW50XCIrXCItXCIrdGhpcy5ndWlkO1xyXG4gICAgICAgIHZhciBzY2FsZT0gdGhpcy5zY2FsZTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMubGluZWFyR3JhZGllbnQgPSBVdGlscy5saW5lYXJHcmFkaWVudCh0aGlzLnN2ZywgZ3JhZGllbnRJZCwgdGhpcy5zY2FsZS5yYW5nZSgpLCAwLCAxMDAsIDAsIDApO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmQoXCJyZWN0XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgYmFyV2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGJhckhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAwKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwidXJsKCNcIitncmFkaWVudElkK1wiKVwiKTtcclxuXHJcblxyXG4gICAgICAgIHZhciB0aWNrcyA9IHRoaXMuY29udGFpbmVyLnNlbGVjdEFsbChcInRleHRcIilcclxuICAgICAgICAgICAgLmRhdGEoIHNjYWxlLmRvbWFpbigpICk7XHJcbiAgICAgICAgdmFyIHRpY2tzTnVtYmVyID1zY2FsZS5kb21haW4oKS5sZW5ndGgtMTtcclxuICAgICAgICB0aWNrcy5lbnRlcigpLmFwcGVuZChcInRleHRcIik7XHJcblxyXG4gICAgICAgIHRpY2tzLmF0dHIoXCJ4XCIsIGJhcldpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgIChkLCBpKSA9PiAgYmFySGVpZ2h0IC0oaSpiYXJIZWlnaHQvdGlja3NOdW1iZXIpKVxyXG4gICAgICAgICAgICAuYXR0cihcImR4XCIsIDMpXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiZHlcIiwgMSlcclxuICAgICAgICAgICAgLmF0dHIoXCJhbGlnbm1lbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoZD0+IHNlbGYubGFiZWxGb3JtYXQgPyBzZWxmLmxhYmVsRm9ybWF0KGQpIDogZCk7XHJcbiAgICAgICAgdGlja3MuYXR0cihcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgaWYodGhpcy5yb3RhdGVMYWJlbHMpe1xyXG4gICAgICAgICAgICB0aWNrc1xyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwicm90YXRlKC00NSwgXCIgKyBiYXJXaWR0aCArIFwiLCBcIiArIChiYXJIZWlnaHQgLShpKmJhckhlaWdodC90aWNrc051bWJlcikpICsgXCIpXCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwic3RhcnRcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZHhcIiwgNSlcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgNSk7XHJcblxyXG4gICAgICAgIH1lbHNle1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRpY2tzLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Um90YXRlTGFiZWxzKHJvdGF0ZUxhYmVscykge1xyXG4gICAgICAgIHRoaXMucm90YXRlTGFiZWxzID0gcm90YXRlTGFiZWxzO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtDaGFydCwgQ2hhcnRDb25maWd9IGZyb20gXCIuL2NoYXJ0XCI7XHJcbmltcG9ydCB7U2NhdHRlclBsb3QsIFNjYXR0ZXJQbG90Q29uZmlnfSBmcm9tIFwiLi9zY2F0dGVycGxvdFwiO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5pbXBvcnQge1N0YXRpc3RpY3NVdGlsc30gZnJvbSAnLi9zdGF0aXN0aWNzLXV0aWxzJ1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBSZWdyZXNzaW9uQ29uZmlnIGV4dGVuZHMgU2NhdHRlclBsb3RDb25maWd7XHJcblxyXG4gICAgbWFpblJlZ3Jlc3Npb24gPSB0cnVlO1xyXG4gICAgZ3JvdXBSZWdyZXNzaW9uID0gdHJ1ZTtcclxuICAgIGNvbmZpZGVuY2U9e1xyXG4gICAgICAgIGxldmVsOiAwLjk1LFxyXG4gICAgICAgIGNyaXRpY2FsVmFsdWU6IChkZWdyZWVzT2ZGcmVlZG9tLCBjcml0aWNhbFByb2JhYmlsaXR5KSA9PiBTdGF0aXN0aWNzVXRpbHMudFZhbHVlKGRlZ3JlZXNPZkZyZWVkb20sIGNyaXRpY2FsUHJvYmFiaWxpdHkpLFxyXG4gICAgICAgIG1hcmdpbk9mRXJyb3I6IHVuZGVmaW5lZCAvL2N1c3RvbSAgbWFyZ2luIE9mIEVycm9yIGZ1bmN0aW9uICh4LCBwb2ludHMpXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgaWYoY3VzdG9tKXtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBSZWdyZXNzaW9uIGV4dGVuZHMgU2NhdHRlclBsb3R7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBzdXBlcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBuZXcgUmVncmVzc2lvbkNvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKXtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBSZWdyZXNzaW9uQ29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCl7XHJcbiAgICAgICAgc3VwZXIuaW5pdFBsb3QoKTtcclxuICAgICAgICB0aGlzLmluaXRSZWdyZXNzaW9uTGluZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0UmVncmVzc2lvbkxpbmVzKCl7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgZ3JvdXBzQXZhaWxhYmxlID0gc2VsZi5jb25maWcuZ3JvdXBzICYmIHNlbGYuY29uZmlnLmdyb3Vwcy52YWx1ZTtcclxuXHJcbiAgICAgICAgc2VsZi5wbG90LnJlZ3Jlc3Npb25zPSBbXTtcclxuXHJcblxyXG4gICAgICAgIGlmKGdyb3Vwc0F2YWlsYWJsZSAmJiBzZWxmLmNvbmZpZy5tYWluUmVncmVzc2lvbil7XHJcbiAgICAgICAgICAgIHZhciByZWdyZXNzaW9uID0gdGhpcy5pbml0UmVncmVzc2lvbih0aGlzLmRhdGEsIGZhbHNlKTtcclxuICAgICAgICAgICAgc2VsZi5wbG90LnJlZ3Jlc3Npb25zLnB1c2gocmVncmVzc2lvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihzZWxmLmNvbmZpZy5ncm91cFJlZ3Jlc3Npb24pe1xyXG4gICAgICAgICAgICB0aGlzLmluaXRHcm91cFJlZ3Jlc3Npb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXRHcm91cFJlZ3Jlc3Npb24oKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBkYXRhQnlHcm91cCA9IHt9O1xyXG4gICAgICAgIHNlbGYuZGF0YS5mb3JFYWNoIChkPT57XHJcbiAgICAgICAgICAgIHZhciBncm91cFZhbCA9IHNlbGYuY29uZmlnLmdyb3Vwcy52YWx1ZShkLCBzZWxmLmNvbmZpZy5ncm91cHMua2V5KTtcclxuXHJcbiAgICAgICAgICAgIGlmKCFncm91cFZhbCAmJiBncm91cFZhbCE9PTApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZighZGF0YUJ5R3JvdXBbZ3JvdXBWYWxdKXtcclxuICAgICAgICAgICAgICAgIGRhdGFCeUdyb3VwW2dyb3VwVmFsXSA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRhdGFCeUdyb3VwW2dyb3VwVmFsXS5wdXNoKGQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmb3IodmFyIGtleSBpbiBkYXRhQnlHcm91cCl7XHJcbiAgICAgICAgICAgIGlmICghZGF0YUJ5R3JvdXAuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciByZWdyZXNzaW9uID0gdGhpcy5pbml0UmVncmVzc2lvbihkYXRhQnlHcm91cFtrZXldLCBrZXkpO1xyXG4gICAgICAgICAgICBzZWxmLnBsb3QucmVncmVzc2lvbnMucHVzaChyZWdyZXNzaW9uKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFJlZ3Jlc3Npb24odmFsdWVzLCBncm91cFZhbCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgcG9pbnRzID0gdmFsdWVzLm1hcChkPT57XHJcbiAgICAgICAgICAgIHJldHVybiBbcGFyc2VGbG9hdChzZWxmLnBsb3QueC52YWx1ZShkKSksIHBhcnNlRmxvYXQoc2VsZi5wbG90LnkudmFsdWUoZCkpXTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gcG9pbnRzLnNvcnQoKGEsYikgPT4gYVswXS1iWzBdKTtcclxuXHJcbiAgICAgICAgdmFyIGxpbmVhclJlZ3Jlc3Npb24gPSAgU3RhdGlzdGljc1V0aWxzLmxpbmVhclJlZ3Jlc3Npb24ocG9pbnRzKTtcclxuICAgICAgICB2YXIgbGluZWFyUmVncmVzc2lvbkxpbmUgPSBTdGF0aXN0aWNzVXRpbHMubGluZWFyUmVncmVzc2lvbkxpbmUobGluZWFyUmVncmVzc2lvbik7XHJcblxyXG5cclxuICAgICAgICB2YXIgZXh0ZW50WCA9IGQzLmV4dGVudChwb2ludHMsIGQ9PmRbMF0pO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGxpbmVQb2ludHMgPSBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHg6IGV4dGVudFhbMF0sXHJcbiAgICAgICAgICAgICAgICB5OiBsaW5lYXJSZWdyZXNzaW9uTGluZShleHRlbnRYWzBdKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB4OiBleHRlbnRYWzFdLFxyXG4gICAgICAgICAgICAgICAgeTogbGluZWFyUmVncmVzc2lvbkxpbmUoZXh0ZW50WFsxXSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIHZhciBsaW5lID0gZDMuc3ZnLmxpbmUoKVxyXG4gICAgICAgICAgICAuaW50ZXJwb2xhdGUoXCJiYXNpc1wiKVxyXG4gICAgICAgICAgICAueChkID0+IHNlbGYucGxvdC54LnNjYWxlKGQueCkpXHJcbiAgICAgICAgICAgIC55KGQgPT4gc2VsZi5wbG90Lnkuc2NhbGUoZC55KSk7XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHZhciBjb2xvciA9IHNlbGYucGxvdC5kb3QuY29sb3I7XHJcblxyXG4gICAgICAgIHZhciBkZWZhdWx0Q29sb3IgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgaWYoVXRpbHMuaXNGdW5jdGlvbihjb2xvcikpe1xyXG4gICAgICAgICAgICBpZih2YWx1ZXMubGVuZ3RoICYmIGdyb3VwVmFsIT09ZmFsc2Upe1xyXG4gICAgICAgICAgICAgICAgY29sb3IgPSBjb2xvcih2YWx1ZXNbMF0pO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGNvbG9yID0gZGVmYXVsdENvbG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfWVsc2UgaWYoIWNvbG9yICYmIGdyb3VwVmFsPT09ZmFsc2Upe1xyXG4gICAgICAgICAgICBjb2xvciA9IGRlZmF1bHRDb2xvcjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB2YXIgY29uZmlkZW5jZSA9IHRoaXMuY29tcHV0ZUNvbmZpZGVuY2UocG9pbnRzLCBleHRlbnRYLCAgbGluZWFyUmVncmVzc2lvbixsaW5lYXJSZWdyZXNzaW9uTGluZSk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZ3JvdXA6IGdyb3VwVmFsIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICBsaW5lOiBsaW5lLFxyXG4gICAgICAgICAgICBsaW5lUG9pbnRzOiBsaW5lUG9pbnRzLFxyXG4gICAgICAgICAgICBjb2xvcjogY29sb3IsXHJcbiAgICAgICAgICAgIGNvbmZpZGVuY2U6IGNvbmZpZGVuY2VcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXB1dGVDb25maWRlbmNlKHBvaW50cywgZXh0ZW50WCwgbGluZWFyUmVncmVzc2lvbixsaW5lYXJSZWdyZXNzaW9uTGluZSl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBzbG9wZSA9IGxpbmVhclJlZ3Jlc3Npb24ubTtcclxuICAgICAgICB2YXIgbiA9IHBvaW50cy5sZW5ndGg7XHJcbiAgICAgICAgdmFyIGRlZ3JlZXNPZkZyZWVkb20gPSBNYXRoLm1heCgwLCBuLTIpO1xyXG5cclxuICAgICAgICB2YXIgYWxwaGEgPSAxIC0gc2VsZi5jb25maWcuY29uZmlkZW5jZS5sZXZlbDtcclxuICAgICAgICB2YXIgY3JpdGljYWxQcm9iYWJpbGl0eSAgPSAxIC0gYWxwaGEvMjtcclxuICAgICAgICB2YXIgY3JpdGljYWxWYWx1ZSA9IHNlbGYuY29uZmlnLmNvbmZpZGVuY2UuY3JpdGljYWxWYWx1ZShkZWdyZWVzT2ZGcmVlZG9tLGNyaXRpY2FsUHJvYmFiaWxpdHkpO1xyXG5cclxuICAgICAgICB2YXIgeFZhbHVlcyA9IHBvaW50cy5tYXAoZD0+ZFswXSk7XHJcbiAgICAgICAgdmFyIG1lYW5YID0gU3RhdGlzdGljc1V0aWxzLm1lYW4oeFZhbHVlcyk7XHJcbiAgICAgICAgdmFyIHhNeVN1bT0wO1xyXG4gICAgICAgIHZhciB4U3VtPTA7XHJcbiAgICAgICAgdmFyIHhQb3dTdW09MDtcclxuICAgICAgICB2YXIgeVN1bT0wO1xyXG4gICAgICAgIHZhciB5UG93U3VtPTA7XHJcbiAgICAgICAgcG9pbnRzLmZvckVhY2gocD0+e1xyXG4gICAgICAgICAgICB2YXIgeCA9IHBbMF07XHJcbiAgICAgICAgICAgIHZhciB5ID0gcFsxXTtcclxuXHJcbiAgICAgICAgICAgIHhNeVN1bSArPSB4Knk7XHJcbiAgICAgICAgICAgIHhTdW0rPXg7XHJcbiAgICAgICAgICAgIHlTdW0rPXk7XHJcbiAgICAgICAgICAgIHhQb3dTdW0rPSB4Kng7XHJcbiAgICAgICAgICAgIHlQb3dTdW0rPSB5Knk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIGEgPSBsaW5lYXJSZWdyZXNzaW9uLm07XHJcbiAgICAgICAgdmFyIGIgPSBsaW5lYXJSZWdyZXNzaW9uLmI7XHJcblxyXG4gICAgICAgIHZhciBTYTIgPSBuLyhuKzIpICogKCh5UG93U3VtLWEqeE15U3VtLWIqeVN1bSkvKG4qeFBvd1N1bS0oeFN1bSp4U3VtKSkpOyAvL1dhcmlhbmNqYSB3c3DDs8WCY3p5bm5pa2Ega2llcnVua293ZWdvIHJlZ3Jlc2ppIGxpbmlvd2VqIGFcclxuICAgICAgICB2YXIgU3kyID0gKHlQb3dTdW0gLSBhKnhNeVN1bS1iKnlTdW0pLyhuKihuLTIpKTsgLy9TYTIgLy9NZWFuIHkgdmFsdWUgdmFyaWFuY2VcclxuXHJcbiAgICAgICAgdmFyIGVycm9yRm4gPSB4PT4gTWF0aC5zcXJ0KFN5MiArIE1hdGgucG93KHgtbWVhblgsMikqU2EyKTsgLy9waWVyd2lhc3RlayBrd2FkcmF0b3d5IHogd2FyaWFuY2ppIGRvd29sbmVnbyBwdW5rdHUgcHJvc3RlalxyXG4gICAgICAgIHZhciBtYXJnaW5PZkVycm9yID0gIHg9PiBjcml0aWNhbFZhbHVlKiBlcnJvckZuKHgpO1xyXG5cclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ24nLCBuLCAnZGVncmVlc09mRnJlZWRvbScsIGRlZ3JlZXNPZkZyZWVkb20sICdjcml0aWNhbFByb2JhYmlsaXR5Jyxjcml0aWNhbFByb2JhYmlsaXR5KTtcclxuICAgICAgICAvLyB2YXIgY29uZmlkZW5jZURvd24gPSB4ID0+IGxpbmVhclJlZ3Jlc3Npb25MaW5lKHgpIC0gIG1hcmdpbk9mRXJyb3IoeCk7XHJcbiAgICAgICAgLy8gdmFyIGNvbmZpZGVuY2VVcCA9IHggPT4gbGluZWFyUmVncmVzc2lvbkxpbmUoeCkgKyAgbWFyZ2luT2ZFcnJvcih4KTtcclxuXHJcblxyXG4gICAgICAgIHZhciBjb21wdXRlQ29uZmlkZW5jZUFyZWFQb2ludCA9IHg9PntcclxuICAgICAgICAgICAgdmFyIGxpbmVhclJlZ3Jlc3Npb24gPSBsaW5lYXJSZWdyZXNzaW9uTGluZSh4KTtcclxuICAgICAgICAgICAgdmFyIG1vZSA9IG1hcmdpbk9mRXJyb3IoeCk7XHJcbiAgICAgICAgICAgIHZhciBjb25mRG93biA9IGxpbmVhclJlZ3Jlc3Npb24gLSBtb2U7XHJcbiAgICAgICAgICAgIHZhciBjb25mVXAgPSBsaW5lYXJSZWdyZXNzaW9uICsgbW9lO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgeDogeCxcclxuICAgICAgICAgICAgICAgIHkwOiBjb25mRG93bixcclxuICAgICAgICAgICAgICAgIHkxOiBjb25mVXBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgY2VudGVyWCA9IChleHRlbnRYWzFdK2V4dGVudFhbMF0pLzI7XHJcblxyXG4gICAgICAgIC8vIHZhciBjb25maWRlbmNlQXJlYVBvaW50cyA9IFtleHRlbnRYWzBdLCBjZW50ZXJYLCAgZXh0ZW50WFsxXV0ubWFwKGNvbXB1dGVDb25maWRlbmNlQXJlYVBvaW50KTtcclxuICAgICAgICB2YXIgY29uZmlkZW5jZUFyZWFQb2ludHMgPSBbZXh0ZW50WFswXSwgY2VudGVyWCwgIGV4dGVudFhbMV1dLm1hcChjb21wdXRlQ29uZmlkZW5jZUFyZWFQb2ludCk7XHJcblxyXG4gICAgICAgIHZhciBmaXRJblBsb3QgPSB5ID0+IHk7XHJcblxyXG4gICAgICAgIHZhciBjb25maWRlbmNlQXJlYSA9ICBkMy5zdmcuYXJlYSgpXHJcbiAgICAgICAgLmludGVycG9sYXRlKFwibW9ub3RvbmVcIilcclxuICAgICAgICAgICAgLngoZCA9PiBzZWxmLnBsb3QueC5zY2FsZShkLngpKVxyXG4gICAgICAgICAgICAueTAoZCA9PiBmaXRJblBsb3Qoc2VsZi5wbG90Lnkuc2NhbGUoZC55MCkpKVxyXG4gICAgICAgICAgICAueTEoZCA9PiBmaXRJblBsb3Qoc2VsZi5wbG90Lnkuc2NhbGUoZC55MSkpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgYXJlYTpjb25maWRlbmNlQXJlYSxcclxuICAgICAgICAgICAgcG9pbnRzOmNvbmZpZGVuY2VBcmVhUG9pbnRzXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUobmV3RGF0YSl7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKG5ld0RhdGEpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmVncmVzc2lvbkxpbmVzKCk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICB1cGRhdGVSZWdyZXNzaW9uTGluZXMoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciByZWdyZXNzaW9uQ29udGFpbmVyQ2xhc3MgPSB0aGlzLnByZWZpeENsYXNzKFwicmVncmVzc2lvbi1jb250YWluZXJcIik7XHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb25Db250YWluZXJTZWxlY3RvciA9IFwiZy5cIityZWdyZXNzaW9uQ29udGFpbmVyQ2xhc3M7XHJcblxyXG4gICAgICAgIHZhciBjbGlwUGF0aElkID0gc2VsZi5wcmVmaXhDbGFzcyhcImNsaXBcIik7XHJcblxyXG4gICAgICAgIHZhciByZWdyZXNzaW9uQ29udGFpbmVyID0gc2VsZi5zdmdHLnNlbGVjdE9ySW5zZXJ0KHJlZ3Jlc3Npb25Db250YWluZXJTZWxlY3RvciwgXCIuXCIrc2VsZi5kb3RzQ29udGFpbmVyQ2xhc3MpO1xyXG4gICAgICAgIHZhciByZWdyZXNzaW9uQ29udGFpbmVyQ2xpcCA9IHJlZ3Jlc3Npb25Db250YWluZXIuc2VsZWN0T3JBcHBlbmQoXCJjbGlwUGF0aFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIGNsaXBQYXRoSWQpO1xyXG5cclxuXHJcbiAgICAgICAgcmVncmVzc2lvbkNvbnRhaW5lckNsaXAuc2VsZWN0T3JBcHBlbmQoJ3JlY3QnKVxyXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCBzZWxmLnBsb3Qud2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCBzZWxmLnBsb3QuaGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cigneCcsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKCd5JywgMCk7XHJcblxyXG4gICAgICAgIHJlZ3Jlc3Npb25Db250YWluZXIuYXR0cihcImNsaXAtcGF0aFwiLCAoZCxpKSA9PiBcInVybCgjXCIrY2xpcFBhdGhJZCtcIilcIik7XHJcblxyXG4gICAgICAgIHZhciByZWdyZXNzaW9uQ2xhc3MgPSB0aGlzLnByZWZpeENsYXNzKFwicmVncmVzc2lvblwiKTtcclxuICAgICAgICB2YXIgY29uZmlkZW5jZUFyZWFDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJjb25maWRlbmNlXCIpO1xyXG4gICAgICAgIHZhciByZWdyZXNzaW9uU2VsZWN0b3IgPSBcImcuXCIrcmVncmVzc2lvbkNsYXNzO1xyXG4gICAgICAgIHZhciByZWdyZXNzaW9uID0gcmVncmVzc2lvbkNvbnRhaW5lci5zZWxlY3RBbGwocmVncmVzc2lvblNlbGVjdG9yKVxyXG4gICAgICAgICAgICAuZGF0YShzZWxmLnBsb3QucmVncmVzc2lvbnMpO1xyXG5cclxuICAgICAgICB2YXIgcmVncmVzc2lvbkVudGVyRyA9IHJlZ3Jlc3Npb24uZW50ZXIoKS5pbnNlcnRTZWxlY3RvcihyZWdyZXNzaW9uU2VsZWN0b3IpO1xyXG4gICAgICAgIHZhciBsaW5lQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwibGluZVwiKTtcclxuICAgICAgICByZWdyZXNzaW9uRW50ZXJHXHJcblxyXG4gICAgICAgICAgICAuYXBwZW5kKFwicGF0aFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGxpbmVDbGFzcylcclxuICAgICAgICAgICAgLmF0dHIoXCJzaGFwZS1yZW5kZXJpbmdcIiwgXCJvcHRpbWl6ZVF1YWxpdHlcIik7XHJcbiAgICAgICAgICAgIC8vIC5hcHBlbmQoXCJsaW5lXCIpXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiY2xhc3NcIiwgXCJsaW5lXCIpXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwic2hhcGUtcmVuZGVyaW5nXCIsIFwib3B0aW1pemVRdWFsaXR5XCIpO1xyXG5cclxuICAgICAgICB2YXIgbGluZSA9IHJlZ3Jlc3Npb24uc2VsZWN0KFwicGF0aC5cIitsaW5lQ2xhc3MpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCByID0+IHIuY29sb3IpO1xyXG4gICAgICAgIC8vIC5hdHRyKFwieDFcIiwgcj0+IHNlbGYucGxvdC54LnNjYWxlKHIubGluZVBvaW50c1swXS54KSlcclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJ5MVwiLCByPT4gc2VsZi5wbG90Lnkuc2NhbGUoci5saW5lUG9pbnRzWzBdLnkpKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcIngyXCIsIHI9PiBzZWxmLnBsb3QueC5zY2FsZShyLmxpbmVQb2ludHNbMV0ueCkpXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwieTJcIiwgcj0+IHNlbGYucGxvdC55LnNjYWxlKHIubGluZVBvaW50c1sxXS55KSlcclxuXHJcblxyXG4gICAgICAgIHZhciBsaW5lVCA9IGxpbmU7XHJcbiAgICAgICAgaWYgKHNlbGYudHJhbnNpdGlvbkVuYWJsZWQoKSkge1xyXG4gICAgICAgICAgICBsaW5lVCA9IGxpbmUudHJhbnNpdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGluZVQuYXR0cihcImRcIiwgciA9PiByLmxpbmUoci5saW5lUG9pbnRzKSlcclxuXHJcblxyXG4gICAgICAgIHJlZ3Jlc3Npb25FbnRlckdcclxuICAgICAgICAgICAgLmFwcGVuZChcInBhdGhcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBjb25maWRlbmNlQXJlYUNsYXNzKVxyXG4gICAgICAgICAgICAuYXR0cihcInNoYXBlLXJlbmRlcmluZ1wiLCBcIm9wdGltaXplUXVhbGl0eVwiKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIHIgPT4gci5jb2xvcilcclxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCBcIjAuNFwiKTtcclxuXHJcblxyXG5cclxuICAgICAgICB2YXIgYXJlYSA9IHJlZ3Jlc3Npb24uc2VsZWN0KFwicGF0aC5cIitjb25maWRlbmNlQXJlYUNsYXNzKTtcclxuXHJcbiAgICAgICAgdmFyIGFyZWFUID0gYXJlYTtcclxuICAgICAgICBpZiAoc2VsZi50cmFuc2l0aW9uRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgICAgIGFyZWFUID0gYXJlYS50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFyZWFULmF0dHIoXCJkXCIsIHIgPT4gci5jb25maWRlbmNlLmFyZWEoci5jb25maWRlbmNlLnBvaW50cykpO1xyXG5cclxuICAgICAgICByZWdyZXNzaW9uLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn1cclxuXHJcbiIsImltcG9ydCB7Q2hhcnQsIENoYXJ0Q29uZmlnfSBmcm9tIFwiLi9jaGFydFwiO1xyXG5pbXBvcnQge1NjYXR0ZXJQbG90Q29uZmlnfSBmcm9tIFwiLi9zY2F0dGVycGxvdFwiO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5pbXBvcnQge0xlZ2VuZH0gZnJvbSBcIi4vbGVnZW5kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2NhdHRlclBsb3RNYXRyaXhDb25maWcgZXh0ZW5kcyBTY2F0dGVyUGxvdENvbmZpZ3tcclxuXHJcbiAgICBzdmdDbGFzcz0gdGhpcy5jc3NDbGFzc1ByZWZpeCsnc2NhdHRlcnBsb3QtbWF0cml4JztcclxuICAgIHNpemU9IDIwMDsgLy9zY2F0dGVyIHBsb3QgY2VsbCBzaXplXHJcbiAgICBwYWRkaW5nPSAyMDsgLy9zY2F0dGVyIHBsb3QgY2VsbCBwYWRkaW5nXHJcbiAgICBicnVzaD0gdHJ1ZTtcclxuICAgIGd1aWRlcz0gdHJ1ZTsgLy9zaG93IGF4aXMgZ3VpZGVzXHJcbiAgICBzaG93VG9vbHRpcD0gdHJ1ZTsgLy9zaG93IHRvb2x0aXAgb24gZG90IGhvdmVyXHJcbiAgICB0aWNrcz0gdW5kZWZpbmVkOyAvL3RpY2tzIG51bWJlciwgKGRlZmF1bHQ6IGNvbXB1dGVkIHVzaW5nIGNlbGwgc2l6ZSlcclxuICAgIHg9ey8vIFggYXhpcyBjb25maWdcclxuICAgICAgICBvcmllbnQ6IFwiYm90dG9tXCIsXHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCJcclxuICAgIH07XHJcbiAgICB5PXsvLyBZIGF4aXMgY29uZmlnXHJcbiAgICAgICAgb3JpZW50OiBcImxlZnRcIixcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIlxyXG4gICAgfTtcclxuICAgIGdyb3Vwcz17XHJcbiAgICAgICAga2V5OiB1bmRlZmluZWQsIC8vb2JqZWN0IHByb3BlcnR5IG5hbWUgb3IgYXJyYXkgaW5kZXggd2l0aCBncm91cGluZyB2YXJpYWJsZVxyXG4gICAgICAgIGluY2x1ZGVJblBsb3Q6IGZhbHNlLCAvL2luY2x1ZGUgZ3JvdXAgYXMgdmFyaWFibGUgaW4gcGxvdCwgYm9vbGVhbiAoZGVmYXVsdDogZmFsc2UpXHJcbiAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IGRba2V5XSwgLy8gZ3JvdXBpbmcgdmFsdWUgYWNjZXNzb3IsXHJcbiAgICAgICAgbGFiZWw6IFwiXCJcclxuICAgIH07XHJcbiAgICB2YXJpYWJsZXM9IHtcclxuICAgICAgICBsYWJlbHM6IFtdLCAvL29wdGlvbmFsIGFycmF5IG9mIHZhcmlhYmxlIGxhYmVscyAoZm9yIHRoZSBkaWFnb25hbCBvZiB0aGUgcGxvdCkuXHJcbiAgICAgICAga2V5czogW10sIC8vb3B0aW9uYWwgYXJyYXkgb2YgdmFyaWFibGUga2V5c1xyXG4gICAgICAgIHZhbHVlOiAoZCwgdmFyaWFibGVLZXkpID0+IGRbdmFyaWFibGVLZXldIC8vIHZhcmlhYmxlIHZhbHVlIGFjY2Vzc29yXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNjYXR0ZXJQbG90TWF0cml4IGV4dGVuZHMgQ2hhcnQge1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IFNjYXR0ZXJQbG90TWF0cml4Q29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBTY2F0dGVyUGxvdE1hdHJpeENvbmZpZyhjb25maWcpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdFBsb3QoKTtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSB0aGlzLnBsb3QubWFyZ2luO1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcbiAgICAgICAgdGhpcy5wbG90Lng9e307XHJcbiAgICAgICAgdGhpcy5wbG90Lnk9e307XHJcbiAgICAgICAgdGhpcy5wbG90LmRvdD17XHJcbiAgICAgICAgICAgIGNvbG9yOiBudWxsLy9jb2xvciBzY2FsZSBtYXBwaW5nIGZ1bmN0aW9uXHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMucGxvdC5zaG93TGVnZW5kID0gY29uZi5zaG93TGVnZW5kO1xyXG4gICAgICAgIGlmKHRoaXMucGxvdC5zaG93TGVnZW5kKXtcclxuICAgICAgICAgICAgbWFyZ2luLnJpZ2h0ID0gY29uZi5tYXJnaW4ucmlnaHQgKyBjb25mLmxlZ2VuZC53aWR0aCtjb25mLmxlZ2VuZC5tYXJnaW4qMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBWYXJpYWJsZXMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnNpemUgPSBjb25mLnNpemU7XHJcblxyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBjb25mLndpZHRoO1xyXG4gICAgICAgIHZhciBib3VuZGluZ0NsaWVudFJlY3QgPSB0aGlzLmdldEJhc2VDb250YWluZXJOb2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgaWYgKCF3aWR0aCkge1xyXG4gICAgICAgICAgICB2YXIgbWF4V2lkdGggPSBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodCArIHRoaXMucGxvdC52YXJpYWJsZXMubGVuZ3RoKnRoaXMucGxvdC5zaXplO1xyXG4gICAgICAgICAgICB3aWR0aCA9IE1hdGgubWluKGJvdW5kaW5nQ2xpZW50UmVjdC53aWR0aCwgbWF4V2lkdGgpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IHdpZHRoO1xyXG4gICAgICAgIGlmICghaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGhlaWdodCA9IGJvdW5kaW5nQ2xpZW50UmVjdC5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnBsb3Qud2lkdGggPSB3aWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0O1xyXG4gICAgICAgIHRoaXMucGxvdC5oZWlnaHQgPSBoZWlnaHQgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAgaWYoY29uZi50aWNrcz09PXVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIGNvbmYudGlja3MgPSB0aGlzLnBsb3Quc2l6ZSAvIDQwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cFgoKTtcclxuICAgICAgICB0aGlzLnNldHVwWSgpO1xyXG5cclxuICAgICAgICBpZiAoY29uZi5kb3QuZDNDb2xvckNhdGVnb3J5KSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5kb3QuY29sb3JDYXRlZ29yeSA9IGQzLnNjYWxlW2NvbmYuZG90LmQzQ29sb3JDYXRlZ29yeV0oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNvbG9yVmFsdWUgPSBjb25mLmRvdC5jb2xvcjtcclxuICAgICAgICBpZiAoY29sb3JWYWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yVmFsdWUgPSBjb2xvclZhbHVlO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb2xvclZhbHVlID09PSAnc3RyaW5nJyB8fCBjb2xvclZhbHVlIGluc3RhbmNlb2YgU3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yID0gY29sb3JWYWx1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnBsb3QuZG90LmNvbG9yQ2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5kb3QuY29sb3IgPSBkID0+IHNlbGYucGxvdC5kb3QuY29sb3JDYXRlZ29yeShzZWxmLnBsb3QuZG90LmNvbG9yVmFsdWUoZCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cFZhcmlhYmxlcygpIHtcclxuICAgICAgICB2YXIgdmFyaWFibGVzQ29uZiA9IHRoaXMuY29uZmlnLnZhcmlhYmxlcztcclxuXHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgcGxvdC5kb21haW5CeVZhcmlhYmxlID0ge307XHJcbiAgICAgICAgcGxvdC52YXJpYWJsZXMgPSB2YXJpYWJsZXNDb25mLmtleXM7XHJcbiAgICAgICAgaWYoIXBsb3QudmFyaWFibGVzIHx8ICFwbG90LnZhcmlhYmxlcy5sZW5ndGgpe1xyXG4gICAgICAgICAgICBwbG90LnZhcmlhYmxlcyA9IFV0aWxzLmluZmVyVmFyaWFibGVzKGRhdGEsIHRoaXMuY29uZmlnLmdyb3Vwcy5rZXksIHRoaXMuY29uZmlnLmluY2x1ZGVJblBsb3QpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcGxvdC5sYWJlbHMgPSBbXTtcclxuICAgICAgICBwbG90LmxhYmVsQnlWYXJpYWJsZSA9IHt9O1xyXG4gICAgICAgIHBsb3QudmFyaWFibGVzLmZvckVhY2goKHZhcmlhYmxlS2V5LCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBwbG90LmRvbWFpbkJ5VmFyaWFibGVbdmFyaWFibGVLZXldID0gZDMuZXh0ZW50KGRhdGEsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHZhcmlhYmxlc0NvbmYudmFsdWUoZCwgdmFyaWFibGVLZXkpIH0pO1xyXG4gICAgICAgICAgICB2YXIgbGFiZWwgPSB2YXJpYWJsZUtleTtcclxuICAgICAgICAgICAgaWYodmFyaWFibGVzQ29uZi5sYWJlbHMgJiYgdmFyaWFibGVzQ29uZi5sYWJlbHMubGVuZ3RoPmluZGV4KXtcclxuXHJcbiAgICAgICAgICAgICAgICBsYWJlbCA9IHZhcmlhYmxlc0NvbmYubGFiZWxzW2luZGV4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwbG90LmxhYmVscy5wdXNoKGxhYmVsKTtcclxuICAgICAgICAgICAgcGxvdC5sYWJlbEJ5VmFyaWFibGVbdmFyaWFibGVLZXldID0gbGFiZWw7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHBsb3QubGFiZWxCeVZhcmlhYmxlKTtcclxuXHJcbiAgICAgICAgcGxvdC5zdWJwbG90cyA9IFtdO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cFgoKSB7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB4ID0gcGxvdC54O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcblxyXG4gICAgICAgIHgudmFsdWUgPSBjb25mLnZhcmlhYmxlcy52YWx1ZTtcclxuICAgICAgICB4LnNjYWxlID0gZDMuc2NhbGVbY29uZi54LnNjYWxlXSgpLnJhbmdlKFtjb25mLnBhZGRpbmcgLyAyLCBwbG90LnNpemUgLSBjb25mLnBhZGRpbmcgLyAyXSk7XHJcbiAgICAgICAgeC5tYXAgPSAoZCwgdmFyaWFibGUpID0+IHguc2NhbGUoeC52YWx1ZShkLCB2YXJpYWJsZSkpO1xyXG4gICAgICAgIHguYXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeC5zY2FsZSkub3JpZW50KGNvbmYueC5vcmllbnQpLnRpY2tzKGNvbmYudGlja3MpO1xyXG4gICAgICAgIHguYXhpcy50aWNrU2l6ZShwbG90LnNpemUgKiBwbG90LnZhcmlhYmxlcy5sZW5ndGgpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBZKCkge1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeSA9IHBsb3QueTtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB5LnZhbHVlID0gY29uZi52YXJpYWJsZXMudmFsdWU7XHJcbiAgICAgICAgeS5zY2FsZSA9IGQzLnNjYWxlW2NvbmYueS5zY2FsZV0oKS5yYW5nZShbIHBsb3Quc2l6ZSAtIGNvbmYucGFkZGluZyAvIDIsIGNvbmYucGFkZGluZyAvIDJdKTtcclxuICAgICAgICB5Lm1hcCA9IChkLCB2YXJpYWJsZSkgPT4geS5zY2FsZSh5LnZhbHVlKGQsIHZhcmlhYmxlKSk7XHJcbiAgICAgICAgeS5heGlzPSBkMy5zdmcuYXhpcygpLnNjYWxlKHkuc2NhbGUpLm9yaWVudChjb25mLnkub3JpZW50KS50aWNrcyhjb25mLnRpY2tzKTtcclxuICAgICAgICB5LmF4aXMudGlja1NpemUoLXBsb3Quc2l6ZSAqIHBsb3QudmFyaWFibGVzLmxlbmd0aCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRyYXcoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPXRoaXM7XHJcbiAgICAgICAgdmFyIG4gPSBzZWxmLnBsb3QudmFyaWFibGVzLmxlbmd0aDtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB2YXIgYXhpc0NsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImF4aXNcIik7XHJcbiAgICAgICAgdmFyIGF4aXNYQ2xhc3MgPSBheGlzQ2xhc3MrXCIteFwiO1xyXG4gICAgICAgIHZhciBheGlzWUNsYXNzID0gYXhpc0NsYXNzK1wiLXlcIjtcclxuXHJcbiAgICAgICAgdmFyIHhBeGlzU2VsZWN0b3IgPSBcImcuXCIrYXhpc1hDbGFzcytcIi5cIitheGlzQ2xhc3M7XHJcbiAgICAgICAgdmFyIHlBeGlzU2VsZWN0b3IgPSBcImcuXCIrYXhpc1lDbGFzcytcIi5cIitheGlzQ2xhc3M7XHJcblxyXG4gICAgICAgIHZhciBub0d1aWRlc0NsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcIm5vLWd1aWRlc1wiKTtcclxuICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKHhBeGlzU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5kYXRhKHNlbGYucGxvdC52YXJpYWJsZXMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZFNlbGVjdG9yKHhBeGlzU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKG5vR3VpZGVzQ2xhc3MsICFjb25mLmd1aWRlcylcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwidHJhbnNsYXRlKFwiICsgKG4gLSBpIC0gMSkgKiBzZWxmLnBsb3Quc2l6ZSArIFwiLDApXCIpXHJcbiAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uKGQpIHsgc2VsZi5wbG90Lnguc2NhbGUuZG9tYWluKHNlbGYucGxvdC5kb21haW5CeVZhcmlhYmxlW2RdKTsgZDMuc2VsZWN0KHRoaXMpLmNhbGwoc2VsZi5wbG90LnguYXhpcyk7IH0pO1xyXG5cclxuICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKHlBeGlzU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5kYXRhKHNlbGYucGxvdC52YXJpYWJsZXMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZFNlbGVjdG9yKHlBeGlzU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKG5vR3VpZGVzQ2xhc3MsICFjb25mLmd1aWRlcylcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwidHJhbnNsYXRlKDAsXCIgKyBpICogc2VsZi5wbG90LnNpemUgKyBcIilcIilcclxuICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24oZCkgeyBzZWxmLnBsb3QueS5zY2FsZS5kb21haW4oc2VsZi5wbG90LmRvbWFpbkJ5VmFyaWFibGVbZF0pOyBkMy5zZWxlY3QodGhpcykuY2FsbChzZWxmLnBsb3QueS5heGlzKTsgfSk7XHJcblxyXG4gICAgICAgIHZhciBjZWxsQ2xhc3MgPSAgc2VsZi5wcmVmaXhDbGFzcyhcImNlbGxcIik7XHJcbiAgICAgICAgdmFyIGNlbGwgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwiLlwiK2NlbGxDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEoc2VsZi51dGlscy5jcm9zcyhzZWxmLnBsb3QudmFyaWFibGVzLCBzZWxmLnBsb3QudmFyaWFibGVzKSlcclxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kU2VsZWN0b3IoXCJnLlwiK2NlbGxDbGFzcylcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZCA9PiBcInRyYW5zbGF0ZShcIiArIChuIC0gZC5pIC0gMSkgKiBzZWxmLnBsb3Quc2l6ZSArIFwiLFwiICsgZC5qICogc2VsZi5wbG90LnNpemUgKyBcIilcIik7XHJcblxyXG4gICAgICAgIGlmKGNvbmYuYnJ1c2gpe1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdCcnVzaChjZWxsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNlbGwuZWFjaChwbG90U3VicGxvdCk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgLy9MYWJlbHNcclxuICAgICAgICBjZWxsLmZpbHRlcihkID0+IGQuaSA9PT0gZC5qKVxyXG4gICAgICAgICAgICAuYXBwZW5kKFwidGV4dFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgY29uZi5wYWRkaW5nKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgY29uZi5wYWRkaW5nKVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiLjcxZW1cIilcclxuICAgICAgICAgICAgLnRleHQoIGQgPT4gc2VsZi5wbG90LmxhYmVsQnlWYXJpYWJsZVtkLnhdKTtcclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcGxvdFN1YnBsb3QocCkge1xyXG4gICAgICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICAgICAgcGxvdC5zdWJwbG90cy5wdXNoKHApO1xyXG4gICAgICAgICAgICB2YXIgY2VsbCA9IGQzLnNlbGVjdCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIHBsb3QueC5zY2FsZS5kb21haW4ocGxvdC5kb21haW5CeVZhcmlhYmxlW3AueF0pO1xyXG4gICAgICAgICAgICBwbG90Lnkuc2NhbGUuZG9tYWluKHBsb3QuZG9tYWluQnlWYXJpYWJsZVtwLnldKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmcmFtZUNsYXNzID0gIHNlbGYucHJlZml4Q2xhc3MoXCJmcmFtZVwiKTtcclxuICAgICAgICAgICAgY2VsbC5hcHBlbmQoXCJyZWN0XCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGZyYW1lQ2xhc3MpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInhcIiwgY29uZi5wYWRkaW5nIC8gMilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieVwiLCBjb25mLnBhZGRpbmcgLyAyKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBjb25mLnNpemUgLSBjb25mLnBhZGRpbmcpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBjb25mLnNpemUgLSBjb25mLnBhZGRpbmcpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHAudXBkYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3VicGxvdCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZG90cyA9IGNlbGwuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmRhdGEoc2VsZi5kYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICBkb3RzLmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGRvdHMuYXR0cihcImN4XCIsIChkKSA9PiBwbG90LngubWFwKGQsIHN1YnBsb3QueCkpXHJcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCAoZCkgPT4gcGxvdC55Lm1hcChkLCBzdWJwbG90LnkpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiclwiLCBzZWxmLmNvbmZpZy5kb3QucmFkaXVzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocGxvdC5kb3QuY29sb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb3RzLnN0eWxlKFwiZmlsbFwiLCBwbG90LmRvdC5jb2xvcilcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZihwbG90LnRvb2x0aXApe1xyXG4gICAgICAgICAgICAgICAgICAgIGRvdHMub24oXCJtb3VzZW92ZXJcIiwgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDIwMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IFwiKFwiICsgcGxvdC54LnZhbHVlKGQsIHN1YnBsb3QueCkgKyBcIiwgXCIgK3Bsb3QueS52YWx1ZShkLCBzdWJwbG90LnkpICsgXCIpXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC5odG1sKGh0bWwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkMy5ldmVudC5wYWdlWSAtIDI4KSArIFwicHhcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZ3JvdXAgPSBzZWxmLmNvbmZpZy5ncm91cHMudmFsdWUoZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGdyb3VwIHx8IGdyb3VwPT09MCApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCs9XCI8YnIvPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhYmVsID0gc2VsZi5jb25maWcuZ3JvdXBzLmxhYmVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYobGFiZWwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwrPWxhYmVsK1wiOiBcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwrPWdyb3VwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLmh0bWwoaHRtbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCAoZCk9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBkb3RzLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcC51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVMZWdlbmQoKTtcclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlKGRhdGEpIHtcclxuXHJcbiAgICAgICAgc3VwZXIudXBkYXRlKGRhdGEpO1xyXG4gICAgICAgIHRoaXMucGxvdC5zdWJwbG90cy5mb3JFYWNoKHAgPT4gcC51cGRhdGUoKSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVMZWdlbmQoKTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhd0JydXNoKGNlbGwpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGJydXNoID0gZDMuc3ZnLmJydXNoKClcclxuICAgICAgICAgICAgLngoc2VsZi5wbG90Lnguc2NhbGUpXHJcbiAgICAgICAgICAgIC55KHNlbGYucGxvdC55LnNjYWxlKVxyXG4gICAgICAgICAgICAub24oXCJicnVzaHN0YXJ0XCIsIGJydXNoc3RhcnQpXHJcbiAgICAgICAgICAgIC5vbihcImJydXNoXCIsIGJydXNobW92ZSlcclxuICAgICAgICAgICAgLm9uKFwiYnJ1c2hlbmRcIiwgYnJ1c2hlbmQpO1xyXG5cclxuICAgICAgICBjZWxsLmFwcGVuZChcImdcIikuY2FsbChicnVzaCk7XHJcblxyXG5cclxuICAgICAgICB2YXIgYnJ1c2hDZWxsO1xyXG5cclxuICAgICAgICAvLyBDbGVhciB0aGUgcHJldmlvdXNseS1hY3RpdmUgYnJ1c2gsIGlmIGFueS5cclxuICAgICAgICBmdW5jdGlvbiBicnVzaHN0YXJ0KHApIHtcclxuICAgICAgICAgICAgaWYgKGJydXNoQ2VsbCAhPT0gdGhpcykge1xyXG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KGJydXNoQ2VsbCkuY2FsbChicnVzaC5jbGVhcigpKTtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC54LnNjYWxlLmRvbWFpbihzZWxmLnBsb3QuZG9tYWluQnlWYXJpYWJsZVtwLnhdKTtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC55LnNjYWxlLmRvbWFpbihzZWxmLnBsb3QuZG9tYWluQnlWYXJpYWJsZVtwLnldKTtcclxuICAgICAgICAgICAgICAgIGJydXNoQ2VsbCA9IHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEhpZ2hsaWdodCB0aGUgc2VsZWN0ZWQgY2lyY2xlcy5cclxuICAgICAgICBmdW5jdGlvbiBicnVzaG1vdmUocCkge1xyXG4gICAgICAgICAgICB2YXIgZSA9IGJydXNoLmV4dGVudCgpO1xyXG4gICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwiY2lyY2xlXCIpLmNsYXNzZWQoXCJoaWRkZW5cIiwgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlWzBdWzBdID4gZFtwLnhdIHx8IGRbcC54XSA+IGVbMV1bMF1cclxuICAgICAgICAgICAgICAgICAgICB8fCBlWzBdWzFdID4gZFtwLnldIHx8IGRbcC55XSA+IGVbMV1bMV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBJZiB0aGUgYnJ1c2ggaXMgZW1wdHksIHNlbGVjdCBhbGwgY2lyY2xlcy5cclxuICAgICAgICBmdW5jdGlvbiBicnVzaGVuZCgpIHtcclxuICAgICAgICAgICAgaWYgKGJydXNoLmVtcHR5KCkpIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCIuaGlkZGVuXCIpLmNsYXNzZWQoXCJoaWRkZW5cIiwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlTGVnZW5kKCkge1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygndXBkYXRlTGVnZW5kJyk7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcblxyXG4gICAgICAgIHZhciBzY2FsZSA9IHBsb3QuZG90LmNvbG9yQ2F0ZWdvcnk7XHJcbiAgICAgICAgaWYoIXNjYWxlLmRvbWFpbigpIHx8IHNjYWxlLmRvbWFpbigpLmxlbmd0aDwyKXtcclxuICAgICAgICAgICAgcGxvdC5zaG93TGVnZW5kID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZighcGxvdC5zaG93TGVnZW5kKXtcclxuICAgICAgICAgICAgaWYocGxvdC5sZWdlbmQgJiYgcGxvdC5sZWdlbmQuY29udGFpbmVyKXtcclxuICAgICAgICAgICAgICAgIHBsb3QubGVnZW5kLmNvbnRhaW5lci5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdmFyIGxlZ2VuZFggPSB0aGlzLnBsb3Qud2lkdGggKyB0aGlzLmNvbmZpZy5sZWdlbmQubWFyZ2luO1xyXG4gICAgICAgIHZhciBsZWdlbmRZID0gdGhpcy5jb25maWcubGVnZW5kLm1hcmdpbjtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmQgPSBuZXcgTGVnZW5kKHRoaXMuc3ZnLCB0aGlzLnN2Z0csIHNjYWxlLCBsZWdlbmRYLCBsZWdlbmRZKTtcclxuXHJcbiAgICAgICAgdmFyIGxlZ2VuZExpbmVhciA9IHBsb3QubGVnZW5kLmNvbG9yKClcclxuICAgICAgICAgICAgLnNoYXBlV2lkdGgodGhpcy5jb25maWcubGVnZW5kLnNoYXBlV2lkdGgpXHJcbiAgICAgICAgICAgIC5vcmllbnQoJ3ZlcnRpY2FsJylcclxuICAgICAgICAgICAgLnNjYWxlKHNjYWxlKTtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmQuY29udGFpbmVyXHJcbiAgICAgICAgICAgIC5jYWxsKGxlZ2VuZExpbmVhcik7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge0NoYXJ0LCBDaGFydENvbmZpZ30gZnJvbSBcIi4vY2hhcnRcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IHtMZWdlbmR9IGZyb20gXCIuL2xlZ2VuZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNjYXR0ZXJQbG90Q29uZmlnIGV4dGVuZHMgQ2hhcnRDb25maWd7XHJcblxyXG4gICAgc3ZnQ2xhc3M9IHRoaXMuY3NzQ2xhc3NQcmVmaXgrJ3NjYXR0ZXJwbG90JztcclxuICAgIGd1aWRlcz0gZmFsc2U7IC8vc2hvdyBheGlzIGd1aWRlc1xyXG4gICAgc2hvd1Rvb2x0aXA9IHRydWU7IC8vc2hvdyB0b29sdGlwIG9uIGRvdCBob3ZlclxyXG4gICAgc2hvd0xlZ2VuZD10cnVlO1xyXG4gICAgbGVnZW5kPXtcclxuICAgICAgICB3aWR0aDogODAsXHJcbiAgICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgICBzaGFwZVdpZHRoOiAyMFxyXG4gICAgfTtcclxuXHJcbiAgICB4PXsvLyBYIGF4aXMgY29uZmlnXHJcbiAgICAgICAgbGFiZWw6ICdYJywgLy8gYXhpcyBsYWJlbFxyXG4gICAgICAgIGtleTogMCxcclxuICAgICAgICB2YWx1ZTogKGQsIGtleSkgPT4gZFtrZXldLCAvLyB4IHZhbHVlIGFjY2Vzc29yXHJcbiAgICAgICAgb3JpZW50OiBcImJvdHRvbVwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiXHJcbiAgICB9O1xyXG4gICAgeT17Ly8gWSBheGlzIGNvbmZpZ1xyXG4gICAgICAgIGxhYmVsOiAnWScsIC8vIGF4aXMgbGFiZWwsXHJcbiAgICAgICAga2V5OiAxLFxyXG4gICAgICAgIHZhbHVlOiAoZCwga2V5KSA9PiBkW2tleV0sIC8vIHkgdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICBvcmllbnQ6IFwibGVmdFwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiXHJcbiAgICB9O1xyXG4gICAgZ3JvdXBzPXtcclxuICAgICAgICBrZXk6IDIsXHJcbiAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IGRba2V5XSAsIC8vIGdyb3VwaW5nIHZhbHVlIGFjY2Vzc29yLFxyXG4gICAgICAgIGxhYmVsOiBcIlwiXHJcbiAgICB9O1xyXG4gICAgdHJhbnNpdGlvbj0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdmFyIGNvbmZpZyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5kb3Q9e1xyXG4gICAgICAgICAgICByYWRpdXM6IDIsXHJcbiAgICAgICAgICAgIGNvbG9yOiBkID0+IGNvbmZpZy5ncm91cHMudmFsdWUoZCwgY29uZmlnLmdyb3Vwcy5rZXkpLCAvLyBzdHJpbmcgb3IgZnVuY3Rpb24gcmV0dXJuaW5nIGNvbG9yJ3MgdmFsdWUgZm9yIGNvbG9yIHNjYWxlXHJcbiAgICAgICAgICAgIGQzQ29sb3JDYXRlZ29yeTogJ2NhdGVnb3J5MTAnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYoY3VzdG9tKXtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTY2F0dGVyUGxvdCBleHRlbmRzIENoYXJ0e1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IFNjYXR0ZXJQbG90Q29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpe1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IFNjYXR0ZXJQbG90Q29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCl7XHJcbiAgICAgICAgc3VwZXIuaW5pdFBsb3QoKTtcclxuICAgICAgICB2YXIgc2VsZj10aGlzO1xyXG5cclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueD17fTtcclxuICAgICAgICB0aGlzLnBsb3QueT17fTtcclxuICAgICAgICB0aGlzLnBsb3QuZG90PXtcclxuICAgICAgICAgICAgY29sb3I6IG51bGwvL2NvbG9yIHNjYWxlIG1hcHBpbmcgZnVuY3Rpb25cclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnNob3dMZWdlbmQgPSBjb25mLnNob3dMZWdlbmQ7XHJcbiAgICAgICAgaWYodGhpcy5wbG90LnNob3dMZWdlbmQpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWFyZ2luLnJpZ2h0ID0gY29uZi5tYXJnaW4ucmlnaHQgKyBjb25mLmxlZ2VuZC53aWR0aCtjb25mLmxlZ2VuZC5tYXJnaW4qMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHRoaXMuY29tcHV0ZVBsb3RTaXplKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBYKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFkoKTtcclxuXHJcbiAgICAgICAgaWYoY29uZi5kb3QuZDNDb2xvckNhdGVnb3J5KXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmRvdC5jb2xvckNhdGVnb3J5ID0gZDMuc2NhbGVbY29uZi5kb3QuZDNDb2xvckNhdGVnb3J5XSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY29sb3JWYWx1ZSA9IGNvbmYuZG90LmNvbG9yO1xyXG4gICAgICAgIGlmKGNvbG9yVmFsdWUpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yVmFsdWUgPSBjb2xvclZhbHVlO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb2xvclZhbHVlID09PSAnc3RyaW5nJyB8fCBjb2xvclZhbHVlIGluc3RhbmNlb2YgU3RyaW5nKXtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5kb3QuY29sb3IgPSBjb2xvclZhbHVlO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZih0aGlzLnBsb3QuZG90LmNvbG9yQ2F0ZWdvcnkpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmRvdC5jb2xvciA9IGQgPT4gIHNlbGYucGxvdC5kb3QuY29sb3JDYXRlZ29yeShzZWxmLnBsb3QuZG90LmNvbG9yVmFsdWUoZCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB9ZWxzZXtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXBYKCl7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB4ID0gcGxvdC54O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWcueDtcclxuXHJcbiAgICAgICAgLyogKlxyXG4gICAgICAgICAqIHZhbHVlIGFjY2Vzc29yIC0gcmV0dXJucyB0aGUgdmFsdWUgdG8gZW5jb2RlIGZvciBhIGdpdmVuIGRhdGEgb2JqZWN0LlxyXG4gICAgICAgICAqIHNjYWxlIC0gbWFwcyB2YWx1ZSB0byBhIHZpc3VhbCBkaXNwbGF5IGVuY29kaW5nLCBzdWNoIGFzIGEgcGl4ZWwgcG9zaXRpb24uXHJcbiAgICAgICAgICogbWFwIGZ1bmN0aW9uIC0gbWFwcyBmcm9tIGRhdGEgdmFsdWUgdG8gZGlzcGxheSB2YWx1ZVxyXG4gICAgICAgICAqIGF4aXMgLSBzZXRzIHVwIGF4aXNcclxuICAgICAgICAgKiovXHJcbiAgICAgICAgeC52YWx1ZSA9IGQgPT4gY29uZi52YWx1ZShkLCBjb25mLmtleSk7XHJcbiAgICAgICAgeC5zY2FsZSA9IGQzLnNjYWxlW2NvbmYuc2NhbGVdKCkucmFuZ2UoWzAsIHBsb3Qud2lkdGhdKTtcclxuICAgICAgICB4Lm1hcCA9IGQgPT4geC5zY2FsZSh4LnZhbHVlKGQpKTtcclxuICAgICAgICB4LmF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHguc2NhbGUpLm9yaWVudChjb25mLm9yaWVudCk7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgcGxvdC54LnNjYWxlLmRvbWFpbihbZDMubWluKGRhdGEsIHBsb3QueC52YWx1ZSktMSwgZDMubWF4KGRhdGEsIHBsb3QueC52YWx1ZSkrMV0pO1xyXG4gICAgICAgIGlmKHRoaXMuY29uZmlnLmd1aWRlcykge1xyXG4gICAgICAgICAgICB4LmF4aXMudGlja1NpemUoLXBsb3QuaGVpZ2h0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cFkgKCl7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB5ID0gcGxvdC55O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWcueTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB2YWx1ZSBhY2Nlc3NvciAtIHJldHVybnMgdGhlIHZhbHVlIHRvIGVuY29kZSBmb3IgYSBnaXZlbiBkYXRhIG9iamVjdC5cclxuICAgICAgICAgKiBzY2FsZSAtIG1hcHMgdmFsdWUgdG8gYSB2aXN1YWwgZGlzcGxheSBlbmNvZGluZywgc3VjaCBhcyBhIHBpeGVsIHBvc2l0aW9uLlxyXG4gICAgICAgICAqIG1hcCBmdW5jdGlvbiAtIG1hcHMgZnJvbSBkYXRhIHZhbHVlIHRvIGRpc3BsYXkgdmFsdWVcclxuICAgICAgICAgKiBheGlzIC0gc2V0cyB1cCBheGlzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgeS52YWx1ZSA9IGQgPT4gY29uZi52YWx1ZShkLCBjb25mLmtleSk7XHJcbiAgICAgICAgeS5zY2FsZSA9IGQzLnNjYWxlW2NvbmYuc2NhbGVdKCkucmFuZ2UoW3Bsb3QuaGVpZ2h0LCAwXSk7XHJcbiAgICAgICAgeS5tYXAgPSBkID0+IHkuc2NhbGUoeS52YWx1ZShkKSk7XHJcbiAgICAgICAgeS5heGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh5LnNjYWxlKS5vcmllbnQoY29uZi5vcmllbnQpO1xyXG5cclxuICAgICAgICBpZih0aGlzLmNvbmZpZy5ndWlkZXMpe1xyXG4gICAgICAgICAgICB5LmF4aXMudGlja1NpemUoLXBsb3Qud2lkdGgpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIHBsb3QueS5zY2FsZS5kb21haW4oW2QzLm1pbihkYXRhLCBwbG90LnkudmFsdWUpLTEsIGQzLm1heChkYXRhLCBwbG90LnkudmFsdWUpKzFdKTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhd0F4aXNYKCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBheGlzQ29uZiA9IHRoaXMuY29uZmlnLng7XHJcbiAgICAgICAgdmFyIGF4aXMgPSBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMteCcpK1wiLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMnKSsoc2VsZi5jb25maWcuZ3VpZGVzID8gJycgOiAnLicrc2VsZi5wcmVmaXhDbGFzcygnbm8tZ3VpZGVzJykpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgcGxvdC5oZWlnaHQgKyBcIilcIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGF4aXNUID0gYXhpcztcclxuICAgICAgICBpZiAoc2VsZi50cmFuc2l0aW9uRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgICAgIGF4aXNUID0gYXhpcy50cmFuc2l0aW9uKCkuZWFzZShcInNpbi1pbi1vdXRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBheGlzVC5jYWxsKHBsb3QueC5heGlzKTtcclxuICAgICAgICBcclxuICAgICAgICBheGlzLnNlbGVjdE9yQXBwZW5kKFwidGV4dC5cIitzZWxmLnByZWZpeENsYXNzKCdsYWJlbCcpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisgKHBsb3Qud2lkdGgvMikgK1wiLFwiKyAocGxvdC5tYXJnaW4uYm90dG9tKSArXCIpXCIpICAvLyB0ZXh0IGlzIGRyYXduIG9mZiB0aGUgc2NyZWVuIHRvcCBsZWZ0LCBtb3ZlIGRvd24gYW5kIG91dCBhbmQgcm90YXRlXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCItMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGF4aXNDb25mLmxhYmVsKTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhd0F4aXNZKCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBheGlzQ29uZiA9IHRoaXMuY29uZmlnLnk7XHJcbiAgICAgICAgdmFyIGF4aXMgPSBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMteScpK1wiLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMnKSsoc2VsZi5jb25maWcuZ3VpZGVzID8gJycgOiAnLicrc2VsZi5wcmVmaXhDbGFzcygnbm8tZ3VpZGVzJykpKTtcclxuXHJcbiAgICAgICAgdmFyIGF4aXNUID0gYXhpcztcclxuICAgICAgICBpZiAoc2VsZi50cmFuc2l0aW9uRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgICAgIGF4aXNUID0gYXhpcy50cmFuc2l0aW9uKCkuZWFzZShcInNpbi1pbi1vdXRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBheGlzVC5jYWxsKHBsb3QueS5heGlzKTtcclxuXHJcbiAgICAgICAgYXhpcy5zZWxlY3RPckFwcGVuZChcInRleHQuXCIrc2VsZi5wcmVmaXhDbGFzcygnbGFiZWwnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrIC1wbG90Lm1hcmdpbi5sZWZ0ICtcIixcIisocGxvdC5oZWlnaHQvMikrXCIpcm90YXRlKC05MClcIikgIC8vIHRleHQgaXMgZHJhd24gb2ZmIHRoZSBzY3JlZW4gdG9wIGxlZnQsIG1vdmUgZG93biBhbmQgb3V0IGFuZCByb3RhdGVcclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCBcIjFlbVwiKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAudGV4dChheGlzQ29uZi5sYWJlbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHVwZGF0ZShuZXdEYXRhKXtcclxuICAgICAgICBzdXBlci51cGRhdGUobmV3RGF0YSk7XHJcbiAgICAgICAgdGhpcy5kcmF3QXhpc1goKTtcclxuICAgICAgICB0aGlzLmRyYXdBeGlzWSgpO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZURvdHMoKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVMZWdlbmQoKTtcclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlRG90cygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgdmFyIGRvdENsYXNzID0gc2VsZi5wcmVmaXhDbGFzcygnZG90Jyk7XHJcbiAgICAgICAgc2VsZi5kb3RzQ29udGFpbmVyQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKCdkb3RzLWNvbnRhaW5lcicpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGRvdHNDb250YWluZXIgPSBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiICsgc2VsZi5kb3RzQ29udGFpbmVyQ2xhc3MpO1xyXG5cclxuICAgICAgICB2YXIgZG90cyA9IGRvdHNDb250YWluZXIuc2VsZWN0QWxsKCcuJyArIGRvdENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShkYXRhKTtcclxuXHJcbiAgICAgICAgZG90cy5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGRvdENsYXNzKTtcclxuXHJcbiAgICAgICAgdmFyIGRvdHNUID0gZG90cztcclxuICAgICAgICBpZiAoc2VsZi50cmFuc2l0aW9uRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgICAgIGRvdHNUID0gZG90cy50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkb3RzVC5hdHRyKFwiclwiLCBzZWxmLmNvbmZpZy5kb3QucmFkaXVzKVxyXG4gICAgICAgICAgICAuYXR0cihcImN4XCIsIHBsb3QueC5tYXApXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY3lcIiwgcGxvdC55Lm1hcCk7XHJcblxyXG4gICAgICAgIGlmIChwbG90LnRvb2x0aXApIHtcclxuICAgICAgICAgICAgZG90cy5vbihcIm1vdXNlb3ZlclwiLCBkID0+IHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGh0bWwgPSBcIihcIiArIHBsb3QueC52YWx1ZShkKSArIFwiLCBcIiArIHBsb3QueS52YWx1ZShkKSArIFwiKVwiO1xyXG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwID0gc2VsZi5jb25maWcuZ3JvdXBzLnZhbHVlKGQsIHNlbGYuY29uZmlnLmdyb3Vwcy5rZXkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwIHx8IGdyb3VwID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBcIjxici8+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhYmVsID0gc2VsZi5jb25maWcuZ3JvdXBzLmxhYmVsO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYWJlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sICs9IGxhYmVsICsgXCI6IFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBodG1sICs9IGdyb3VwXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAuaHRtbChodG1sKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkMy5ldmVudC5wYWdlWSAtIDI4KSArIFwicHhcIik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCBkID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwbG90LmRvdC5jb2xvcikge1xyXG4gICAgICAgICAgICBkb3RzLnN0eWxlKFwiZmlsbFwiLCBwbG90LmRvdC5jb2xvcilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRvdHMuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUxlZ2VuZCgpIHtcclxuXHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG5cclxuICAgICAgICB2YXIgc2NhbGUgPSBwbG90LmRvdC5jb2xvckNhdGVnb3J5O1xyXG4gICAgICAgIGlmKCFzY2FsZS5kb21haW4oKSB8fCBzY2FsZS5kb21haW4oKS5sZW5ndGg8Mil7XHJcbiAgICAgICAgICAgIHBsb3Quc2hvd0xlZ2VuZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIXBsb3Quc2hvd0xlZ2VuZCl7XHJcbiAgICAgICAgICAgIGlmKHBsb3QubGVnZW5kICYmIHBsb3QubGVnZW5kLmNvbnRhaW5lcil7XHJcbiAgICAgICAgICAgICAgICBwbG90LmxlZ2VuZC5jb250YWluZXIucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHZhciBsZWdlbmRYID0gdGhpcy5wbG90LndpZHRoICsgdGhpcy5jb25maWcubGVnZW5kLm1hcmdpbjtcclxuICAgICAgICB2YXIgbGVnZW5kWSA9IHRoaXMuY29uZmlnLmxlZ2VuZC5tYXJnaW47XHJcblxyXG4gICAgICAgIHBsb3QubGVnZW5kID0gbmV3IExlZ2VuZCh0aGlzLnN2ZywgdGhpcy5zdmdHLCBzY2FsZSwgbGVnZW5kWCwgbGVnZW5kWSk7XHJcblxyXG4gICAgICAgIHZhciBsZWdlbmRMaW5lYXIgPSBwbG90LmxlZ2VuZC5jb2xvcigpXHJcbiAgICAgICAgICAgIC5zaGFwZVdpZHRoKHRoaXMuY29uZmlnLmxlZ2VuZC5zaGFwZVdpZHRoKVxyXG4gICAgICAgICAgICAub3JpZW50KCd2ZXJ0aWNhbCcpXHJcbiAgICAgICAgICAgIC5zY2FsZShzY2FsZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcGxvdC5sZWdlbmQuY29udGFpbmVyXHJcbiAgICAgICAgICAgIC5jYWxsKGxlZ2VuZExpbmVhcik7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbn1cclxuIiwiLypcbiAqIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2JlbnJhc211c2VuLzEyNjE5NzdcbiAqIE5BTUVcbiAqIFxuICogc3RhdGlzdGljcy1kaXN0cmlidXRpb25zLmpzIC0gSmF2YVNjcmlwdCBsaWJyYXJ5IGZvciBjYWxjdWxhdGluZ1xuICogICBjcml0aWNhbCB2YWx1ZXMgYW5kIHVwcGVyIHByb2JhYmlsaXRpZXMgb2YgY29tbW9uIHN0YXRpc3RpY2FsXG4gKiAgIGRpc3RyaWJ1dGlvbnNcbiAqIFxuICogU1lOT1BTSVNcbiAqIFxuICogXG4gKiAgIC8vIENoaS1zcXVhcmVkLWNyaXQgKDIgZGVncmVlcyBvZiBmcmVlZG9tLCA5NXRoIHBlcmNlbnRpbGUgPSAwLjA1IGxldmVsXG4gKiAgIGNoaXNxcmRpc3RyKDIsIC4wNSlcbiAqICAgXG4gKiAgIC8vIHUtY3JpdCAoOTV0aCBwZXJjZW50aWxlID0gMC4wNSBsZXZlbClcbiAqICAgdWRpc3RyKC4wNSk7XG4gKiAgIFxuICogICAvLyB0LWNyaXQgKDEgZGVncmVlIG9mIGZyZWVkb20sIDk5LjV0aCBwZXJjZW50aWxlID0gMC4wMDUgbGV2ZWwpIFxuICogICB0ZGlzdHIoMSwuMDA1KTtcbiAqICAgXG4gKiAgIC8vIEYtY3JpdCAoMSBkZWdyZWUgb2YgZnJlZWRvbSBpbiBudW1lcmF0b3IsIDMgZGVncmVlcyBvZiBmcmVlZG9tIFxuICogICAvLyAgICAgICAgIGluIGRlbm9taW5hdG9yLCA5OXRoIHBlcmNlbnRpbGUgPSAwLjAxIGxldmVsKVxuICogICBmZGlzdHIoMSwzLC4wMSk7XG4gKiAgIFxuICogICAvLyB1cHBlciBwcm9iYWJpbGl0eSBvZiB0aGUgdSBkaXN0cmlidXRpb24gKHUgPSAtMC44NSk6IFEodSkgPSAxLUcodSlcbiAqICAgdXByb2IoLTAuODUpO1xuICogICBcbiAqICAgLy8gdXBwZXIgcHJvYmFiaWxpdHkgb2YgdGhlIGNoaS1zcXVhcmUgZGlzdHJpYnV0aW9uXG4gKiAgIC8vICgzIGRlZ3JlZXMgb2YgZnJlZWRvbSwgY2hpLXNxdWFyZWQgPSA2LjI1KTogUSA9IDEtR1xuICogICBjaGlzcXJwcm9iKDMsNi4yNSk7XG4gKiAgIFxuICogICAvLyB1cHBlciBwcm9iYWJpbGl0eSBvZiB0aGUgdCBkaXN0cmlidXRpb25cbiAqICAgLy8gKDMgZGVncmVlcyBvZiBmcmVlZG9tLCB0ID0gNi4yNTEpOiBRID0gMS1HXG4gKiAgIHRwcm9iKDMsNi4yNTEpO1xuICogICBcbiAqICAgLy8gdXBwZXIgcHJvYmFiaWxpdHkgb2YgdGhlIEYgZGlzdHJpYnV0aW9uXG4gKiAgIC8vICgzIGRlZ3JlZXMgb2YgZnJlZWRvbSBpbiBudW1lcmF0b3IsIDUgZGVncmVlcyBvZiBmcmVlZG9tIGluXG4gKiAgIC8vICBkZW5vbWluYXRvciwgRiA9IDYuMjUpOiBRID0gMS1HXG4gKiAgIGZwcm9iKDMsNSwuNjI1KTtcbiAqIFxuICogXG4gKiAgREVTQ1JJUFRJT05cbiAqIFxuICogVGhpcyBsaWJyYXJ5IGNhbGN1bGF0ZXMgcGVyY2VudGFnZSBwb2ludHMgKDUgc2lnbmlmaWNhbnQgZGlnaXRzKSBvZiB0aGUgdVxuICogKHN0YW5kYXJkIG5vcm1hbCkgZGlzdHJpYnV0aW9uLCB0aGUgc3R1ZGVudCdzIHQgZGlzdHJpYnV0aW9uLCB0aGVcbiAqIGNoaS1zcXVhcmUgZGlzdHJpYnV0aW9uIGFuZCB0aGUgRiBkaXN0cmlidXRpb24uIEl0IGNhbiBhbHNvIGNhbGN1bGF0ZSB0aGVcbiAqIHVwcGVyIHByb2JhYmlsaXR5ICg1IHNpZ25pZmljYW50IGRpZ2l0cykgb2YgdGhlIHUgKHN0YW5kYXJkIG5vcm1hbCksIHRoZVxuICogY2hpLXNxdWFyZSwgdGhlIHQgYW5kIHRoZSBGIGRpc3RyaWJ1dGlvbi5cbiAqIFxuICogVGhlc2UgY3JpdGljYWwgdmFsdWVzIGFyZSBuZWVkZWQgdG8gcGVyZm9ybSBzdGF0aXN0aWNhbCB0ZXN0cywgbGlrZSB0aGUgdVxuICogdGVzdCwgdGhlIHQgdGVzdCwgdGhlIEYgdGVzdCBhbmQgdGhlIGNoaS1zcXVhcmVkIHRlc3QsIGFuZCB0byBjYWxjdWxhdGVcbiAqIGNvbmZpZGVuY2UgaW50ZXJ2YWxzLlxuICogXG4gKiBJZiB5b3UgYXJlIGludGVyZXN0ZWQgaW4gbW9yZSBwcmVjaXNlIGFsZ29yaXRobXMgeW91IGNvdWxkIGxvb2sgYXQ6XG4gKiAgIFN0YXRMaWI6IGh0dHA6Ly9saWIuc3RhdC5jbXUuZWR1L2Fwc3RhdC8gOyBcbiAqICAgQXBwbGllZCBTdGF0aXN0aWNzIEFsZ29yaXRobXMgYnkgR3JpZmZpdGhzLCBQLiBhbmQgSGlsbCwgSS5ELlxuICogICAsIEVsbGlzIEhvcndvb2Q6IENoaWNoZXN0ZXIgKDE5ODUpXG4gKiBcbiAqIEJVR1MgXG4gKiBcbiAqIFRoaXMgcG9ydCB3YXMgcHJvZHVjZWQgZnJvbSB0aGUgUGVybCBtb2R1bGUgU3RhdGlzdGljczo6RGlzdHJpYnV0aW9uc1xuICogdGhhdCBoYXMgaGFkIG5vIGJ1ZyByZXBvcnRzIGluIHNldmVyYWwgeWVhcnMuICBJZiB5b3UgZmluZCBhIGJ1ZyB0aGVuXG4gKiBwbGVhc2UgZG91YmxlLWNoZWNrIHRoYXQgSmF2YVNjcmlwdCBkb2VzIG5vdCB0aGluZyB0aGUgbnVtYmVycyB5b3UgYXJlXG4gKiBwYXNzaW5nIGluIGFyZSBzdHJpbmdzLiAgKFlvdSBjYW4gc3VidHJhY3QgMCBmcm9tIHRoZW0gYXMgeW91IHBhc3MgdGhlbVxuICogaW4gc28gdGhhdCBcIjVcIiBpcyBwcm9wZXJseSB1bmRlcnN0b29kIHRvIGJlIDUuKSAgSWYgeW91IGhhdmUgcGFzc2VkIGluIGFcbiAqIG51bWJlciB0aGVuIHBsZWFzZSBjb250YWN0IHRoZSBhdXRob3JcbiAqIFxuICogQVVUSE9SXG4gKiBcbiAqIEJlbiBUaWxseSA8YnRpbGx5QGdtYWlsLmNvbT5cbiAqIFxuICogT3JpZ2lubCBQZXJsIHZlcnNpb24gYnkgTWljaGFlbCBLb3NwYWNoIDxtaWtlLnBlcmxAZ214LmF0PlxuICogXG4gKiBOaWNlIGZvcm1hdGluZywgc2ltcGxpZmljYXRpb24gYW5kIGJ1ZyByZXBhaXIgYnkgTWF0dGhpYXMgVHJhdXRuZXIgS3JvbWFublxuICogPG10a0BpZC5jYnMuZGs+XG4gKiBcbiAqIENPUFlSSUdIVCBcbiAqIFxuICogQ29weXJpZ2h0IDIwMDggQmVuIFRpbGx5LlxuICogXG4gKiBUaGlzIGxpYnJhcnkgaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdFxuICogdW5kZXIgdGhlIHNhbWUgdGVybXMgYXMgUGVybCBpdHNlbGYuICBUaGlzIG1lYW5zIHVuZGVyIGVpdGhlciB0aGUgUGVybFxuICogQXJ0aXN0aWMgTGljZW5zZSBvciB0aGUgR1BMIHYxIG9yIGxhdGVyLlxuICovXG5cbnZhciBTSUdOSUZJQ0FOVCA9IDU7IC8vIG51bWJlciBvZiBzaWduaWZpY2FudCBkaWdpdHMgdG8gYmUgcmV0dXJuZWRcblxuZnVuY3Rpb24gY2hpc3FyZGlzdHIgKCRuLCAkcCkge1xuXHRpZiAoJG4gPD0gMCB8fCBNYXRoLmFicygkbikgLSBNYXRoLmFicyhpbnRlZ2VyKCRuKSkgIT0gMCkge1xuXHRcdHRocm93KFwiSW52YWxpZCBuOiAkblxcblwiKTsgLyogZGVncmVlIG9mIGZyZWVkb20gKi9cblx0fVxuXHRpZiAoJHAgPD0gMCB8fCAkcCA+IDEpIHtcblx0XHR0aHJvdyhcIkludmFsaWQgcDogJHBcXG5cIik7IFxuXHR9XG5cdHJldHVybiBwcmVjaXNpb25fc3RyaW5nKF9zdWJjaGlzcXIoJG4tMCwgJHAtMCkpO1xufVxuXG5mdW5jdGlvbiB1ZGlzdHIgKCRwKSB7XG5cdGlmICgkcCA+IDEgfHwgJHAgPD0gMCkge1xuXHRcdHRocm93KFwiSW52YWxpZCBwOiAkcFxcblwiKTtcblx0fVxuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3VidSgkcC0wKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZGlzdHIgKCRuLCAkcCkge1xuXHRpZiAoJG4gPD0gMCB8fCBNYXRoLmFicygkbikgLSBNYXRoLmFicyhpbnRlZ2VyKCRuKSkgIT0gMCkge1xuXHRcdHRocm93KFwiSW52YWxpZCBuOiAkblxcblwiKTtcblx0fVxuXHRpZiAoJHAgPD0gMCB8fCAkcCA+PSAxKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIHA6ICRwXFxuXCIpO1xuXHR9XG5cdHJldHVybiBwcmVjaXNpb25fc3RyaW5nKF9zdWJ0KCRuLTAsICRwLTApKTtcbn1cblxuZnVuY3Rpb24gZmRpc3RyICgkbiwgJG0sICRwKSB7XG5cdGlmICgoJG48PTApIHx8ICgoTWF0aC5hYnMoJG4pLShNYXRoLmFicyhpbnRlZ2VyKCRuKSkpKSE9MCkpIHtcblx0XHR0aHJvdyhcIkludmFsaWQgbjogJG5cXG5cIik7IC8qIGZpcnN0IGRlZ3JlZSBvZiBmcmVlZG9tICovXG5cdH1cblx0aWYgKCgkbTw9MCkgfHwgKChNYXRoLmFicygkbSktKE1hdGguYWJzKGludGVnZXIoJG0pKSkpIT0wKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBtOiAkbVxcblwiKTsgLyogc2Vjb25kIGRlZ3JlZSBvZiBmcmVlZG9tICovXG5cdH1cblx0aWYgKCgkcDw9MCkgfHwgKCRwPjEpKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIHA6ICRwXFxuXCIpO1xuXHR9XG5cdHJldHVybiBwcmVjaXNpb25fc3RyaW5nKF9zdWJmKCRuLTAsICRtLTAsICRwLTApKTtcbn1cblxuZnVuY3Rpb24gdXByb2IgKCR4KSB7XG5cdHJldHVybiBwcmVjaXNpb25fc3RyaW5nKF9zdWJ1cHJvYigkeC0wKSk7XG59XG5cbmZ1bmN0aW9uIGNoaXNxcnByb2IgKCRuLCR4KSB7XG5cdGlmICgoJG4gPD0gMCkgfHwgKChNYXRoLmFicygkbikgLSAoTWF0aC5hYnMoaW50ZWdlcigkbikpKSkgIT0gMCkpIHtcblx0XHR0aHJvdyhcIkludmFsaWQgbjogJG5cXG5cIik7IC8qIGRlZ3JlZSBvZiBmcmVlZG9tICovXG5cdH1cblx0cmV0dXJuIHByZWNpc2lvbl9zdHJpbmcoX3N1YmNoaXNxcnByb2IoJG4tMCwgJHgtMCkpO1xufVxuXG5mdW5jdGlvbiB0cHJvYiAoJG4sICR4KSB7XG5cdGlmICgoJG4gPD0gMCkgfHwgKChNYXRoLmFicygkbikgLSBNYXRoLmFicyhpbnRlZ2VyKCRuKSkpICE9MCkpIHtcblx0XHR0aHJvdyhcIkludmFsaWQgbjogJG5cXG5cIik7IC8qIGRlZ3JlZSBvZiBmcmVlZG9tICovXG5cdH1cblx0cmV0dXJuIHByZWNpc2lvbl9zdHJpbmcoX3N1YnRwcm9iKCRuLTAsICR4LTApKTtcbn1cblxuZnVuY3Rpb24gZnByb2IgKCRuLCAkbSwgJHgpIHtcblx0aWYgKCgkbjw9MCkgfHwgKChNYXRoLmFicygkbiktKE1hdGguYWJzKGludGVnZXIoJG4pKSkpIT0wKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBuOiAkblxcblwiKTsgLyogZmlyc3QgZGVncmVlIG9mIGZyZWVkb20gKi9cblx0fVxuXHRpZiAoKCRtPD0wKSB8fCAoKE1hdGguYWJzKCRtKS0oTWF0aC5hYnMoaW50ZWdlcigkbSkpKSkhPTApKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG06ICRtXFxuXCIpOyAvKiBzZWNvbmQgZGVncmVlIG9mIGZyZWVkb20gKi9cblx0fSBcblx0cmV0dXJuIHByZWNpc2lvbl9zdHJpbmcoX3N1YmZwcm9iKCRuLTAsICRtLTAsICR4LTApKTtcbn1cblxuXG5mdW5jdGlvbiBfc3ViZnByb2IgKCRuLCAkbSwgJHgpIHtcblx0dmFyICRwO1xuXG5cdGlmICgkeDw9MCkge1xuXHRcdCRwPTE7XG5cdH0gZWxzZSBpZiAoJG0gJSAyID09IDApIHtcblx0XHR2YXIgJHogPSAkbSAvICgkbSArICRuICogJHgpO1xuXHRcdHZhciAkYSA9IDE7XG5cdFx0Zm9yICh2YXIgJGkgPSAkbSAtIDI7ICRpID49IDI7ICRpIC09IDIpIHtcblx0XHRcdCRhID0gMSArICgkbiArICRpIC0gMikgLyAkaSAqICR6ICogJGE7XG5cdFx0fVxuXHRcdCRwID0gMSAtIE1hdGgucG93KCgxIC0gJHopLCAoJG4gLyAyKSAqICRhKTtcblx0fSBlbHNlIGlmICgkbiAlIDIgPT0gMCkge1xuXHRcdHZhciAkeiA9ICRuICogJHggLyAoJG0gKyAkbiAqICR4KTtcblx0XHR2YXIgJGEgPSAxO1xuXHRcdGZvciAodmFyICRpID0gJG4gLSAyOyAkaSA+PSAyOyAkaSAtPSAyKSB7XG5cdFx0XHQkYSA9IDEgKyAoJG0gKyAkaSAtIDIpIC8gJGkgKiAkeiAqICRhO1xuXHRcdH1cblx0XHQkcCA9IE1hdGgucG93KCgxIC0gJHopLCAoJG0gLyAyKSkgKiAkYTtcblx0fSBlbHNlIHtcblx0XHR2YXIgJHkgPSBNYXRoLmF0YW4yKE1hdGguc3FydCgkbiAqICR4IC8gJG0pLCAxKTtcblx0XHR2YXIgJHogPSBNYXRoLnBvdyhNYXRoLnNpbigkeSksIDIpO1xuXHRcdHZhciAkYSA9ICgkbiA9PSAxKSA/IDAgOiAxO1xuXHRcdGZvciAodmFyICRpID0gJG4gLSAyOyAkaSA+PSAzOyAkaSAtPSAyKSB7XG5cdFx0XHQkYSA9IDEgKyAoJG0gKyAkaSAtIDIpIC8gJGkgKiAkeiAqICRhO1xuXHRcdH0gXG5cdFx0dmFyICRiID0gTWF0aC5QSTtcblx0XHRmb3IgKHZhciAkaSA9IDI7ICRpIDw9ICRtIC0gMTsgJGkgKz0gMikge1xuXHRcdFx0JGIgKj0gKCRpIC0gMSkgLyAkaTtcblx0XHR9XG5cdFx0dmFyICRwMSA9IDIgLyAkYiAqIE1hdGguc2luKCR5KSAqIE1hdGgucG93KE1hdGguY29zKCR5KSwgJG0pICogJGE7XG5cblx0XHQkeiA9IE1hdGgucG93KE1hdGguY29zKCR5KSwgMik7XG5cdFx0JGEgPSAoJG0gPT0gMSkgPyAwIDogMTtcblx0XHRmb3IgKHZhciAkaSA9ICRtLTI7ICRpID49IDM7ICRpIC09IDIpIHtcblx0XHRcdCRhID0gMSArICgkaSAtIDEpIC8gJGkgKiAkeiAqICRhO1xuXHRcdH1cblx0XHQkcCA9IG1heCgwLCAkcDEgKyAxIC0gMiAqICR5IC8gTWF0aC5QSVxuXHRcdFx0LSAyIC8gTWF0aC5QSSAqIE1hdGguc2luKCR5KSAqIE1hdGguY29zKCR5KSAqICRhKTtcblx0fVxuXHRyZXR1cm4gJHA7XG59XG5cblxuZnVuY3Rpb24gX3N1YmNoaXNxcnByb2IgKCRuLCR4KSB7XG5cdHZhciAkcDtcblxuXHRpZiAoJHggPD0gMCkge1xuXHRcdCRwID0gMTtcblx0fSBlbHNlIGlmICgkbiA+IDEwMCkge1xuXHRcdCRwID0gX3N1YnVwcm9iKChNYXRoLnBvdygoJHggLyAkbiksIDEvMylcblx0XHRcdFx0LSAoMSAtIDIvOS8kbikpIC8gTWF0aC5zcXJ0KDIvOS8kbikpO1xuXHR9IGVsc2UgaWYgKCR4ID4gNDAwKSB7XG5cdFx0JHAgPSAwO1xuXHR9IGVsc2UgeyAgIFxuXHRcdHZhciAkYTtcbiAgICAgICAgICAgICAgICB2YXIgJGk7XG4gICAgICAgICAgICAgICAgdmFyICRpMTtcblx0XHRpZiAoKCRuICUgMikgIT0gMCkge1xuXHRcdFx0JHAgPSAyICogX3N1YnVwcm9iKE1hdGguc3FydCgkeCkpO1xuXHRcdFx0JGEgPSBNYXRoLnNxcnQoMi9NYXRoLlBJKSAqIE1hdGguZXhwKC0keC8yKSAvIE1hdGguc3FydCgkeCk7XG5cdFx0XHQkaTEgPSAxO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkcCA9ICRhID0gTWF0aC5leHAoLSR4LzIpO1xuXHRcdFx0JGkxID0gMjtcblx0XHR9XG5cblx0XHRmb3IgKCRpID0gJGkxOyAkaSA8PSAoJG4tMik7ICRpICs9IDIpIHtcblx0XHRcdCRhICo9ICR4IC8gJGk7XG5cdFx0XHQkcCArPSAkYTtcblx0XHR9XG5cdH1cblx0cmV0dXJuICRwO1xufVxuXG5mdW5jdGlvbiBfc3VidSAoJHApIHtcblx0dmFyICR5ID0gLU1hdGgubG9nKDQgKiAkcCAqICgxIC0gJHApKTtcblx0dmFyICR4ID0gTWF0aC5zcXJ0KFxuXHRcdCR5ICogKDEuNTcwNzk2Mjg4XG5cdFx0ICArICR5ICogKC4wMzcwNjk4NzkwNlxuXHRcdCAgXHQrICR5ICogKC0uODM2NDM1MzU4OUUtM1xuXHRcdFx0ICArICR5ICooLS4yMjUwOTQ3MTc2RS0zXG5cdFx0XHQgIFx0KyAkeSAqICguNjg0MTIxODI5OUUtNVxuXHRcdFx0XHQgICsgJHkgKiAoMC41ODI0MjM4NTE1RS01XG5cdFx0XHRcdFx0KyAkeSAqICgtLjEwNDUyNzQ5N0UtNVxuXHRcdFx0XHRcdCAgKyAkeSAqICguODM2MDkzNzAxN0UtN1xuXHRcdFx0XHRcdFx0KyAkeSAqICgtLjMyMzEwODEyNzdFLThcblx0XHRcdFx0XHRcdCAgKyAkeSAqICguMzY1Nzc2MzAzNkUtMTBcblx0XHRcdFx0XHRcdFx0KyAkeSAqLjY5MzYyMzM5ODJFLTEyKSkpKSkpKSkpKSk7XG5cdGlmICgkcD4uNSlcbiAgICAgICAgICAgICAgICAkeCA9IC0keDtcblx0cmV0dXJuICR4O1xufVxuXG5mdW5jdGlvbiBfc3VidXByb2IgKCR4KSB7XG5cdHZhciAkcCA9IDA7IC8qIGlmICgkYWJzeCA+IDEwMCkgKi9cblx0dmFyICRhYnN4ID0gTWF0aC5hYnMoJHgpO1xuXG5cdGlmICgkYWJzeCA8IDEuOSkge1xuXHRcdCRwID0gTWF0aC5wb3coKDEgK1xuXHRcdFx0JGFic3ggKiAoLjA0OTg2NzM0N1xuXHRcdFx0ICArICRhYnN4ICogKC4wMjExNDEwMDYxXG5cdFx0XHQgIFx0KyAkYWJzeCAqICguMDAzMjc3NjI2M1xuXHRcdFx0XHQgICsgJGFic3ggKiAoLjAwMDAzODAwMzZcblx0XHRcdFx0XHQrICRhYnN4ICogKC4wMDAwNDg4OTA2XG5cdFx0XHRcdFx0ICArICRhYnN4ICogLjAwMDAwNTM4MykpKSkpKSwgLTE2KS8yO1xuXHR9IGVsc2UgaWYgKCRhYnN4IDw9IDEwMCkge1xuXHRcdGZvciAodmFyICRpID0gMTg7ICRpID49IDE7ICRpLS0pIHtcblx0XHRcdCRwID0gJGkgLyAoJGFic3ggKyAkcCk7XG5cdFx0fVxuXHRcdCRwID0gTWF0aC5leHAoLS41ICogJGFic3ggKiAkYWJzeCkgXG5cdFx0XHQvIE1hdGguc3FydCgyICogTWF0aC5QSSkgLyAoJGFic3ggKyAkcCk7XG5cdH1cblxuXHRpZiAoJHg8MClcbiAgICAgICAgXHQkcCA9IDEgLSAkcDtcblx0cmV0dXJuICRwO1xufVxuXG4gICBcbmZ1bmN0aW9uIF9zdWJ0ICgkbiwgJHApIHtcblxuXHRpZiAoJHAgPj0gMSB8fCAkcCA8PSAwKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIHA6ICRwXFxuXCIpO1xuXHR9XG5cblx0aWYgKCRwID09IDAuNSkge1xuXHRcdHJldHVybiAwO1xuXHR9IGVsc2UgaWYgKCRwIDwgMC41KSB7XG5cdFx0cmV0dXJuIC0gX3N1YnQoJG4sIDEgLSAkcCk7XG5cdH1cblxuXHR2YXIgJHUgPSBfc3VidSgkcCk7XG5cdHZhciAkdTIgPSBNYXRoLnBvdygkdSwgMik7XG5cblx0dmFyICRhID0gKCR1MiArIDEpIC8gNDtcblx0dmFyICRiID0gKCg1ICogJHUyICsgMTYpICogJHUyICsgMykgLyA5Njtcblx0dmFyICRjID0gKCgoMyAqICR1MiArIDE5KSAqICR1MiArIDE3KSAqICR1MiAtIDE1KSAvIDM4NDtcblx0dmFyICRkID0gKCgoKDc5ICogJHUyICsgNzc2KSAqICR1MiArIDE0ODIpICogJHUyIC0gMTkyMCkgKiAkdTIgLSA5NDUpIFxuXHRcdFx0XHQvIDkyMTYwO1xuXHR2YXIgJGUgPSAoKCgoKDI3ICogJHUyICsgMzM5KSAqICR1MiArIDkzMCkgKiAkdTIgLSAxNzgyKSAqICR1MiAtIDc2NSkgKiAkdTJcblx0XHRcdCsgMTc5NTUpIC8gMzY4NjQwO1xuXG5cdHZhciAkeCA9ICR1ICogKDEgKyAoJGEgKyAoJGIgKyAoJGMgKyAoJGQgKyAkZSAvICRuKSAvICRuKSAvICRuKSAvICRuKSAvICRuKTtcblxuXHRpZiAoJG4gPD0gTWF0aC5wb3cobG9nMTAoJHApLCAyKSArIDMpIHtcblx0XHR2YXIgJHJvdW5kO1xuXHRcdGRvIHsgXG5cdFx0XHR2YXIgJHAxID0gX3N1YnRwcm9iKCRuLCAkeCk7XG5cdFx0XHR2YXIgJG4xID0gJG4gKyAxO1xuXHRcdFx0dmFyICRkZWx0YSA9ICgkcDEgLSAkcCkgXG5cdFx0XHRcdC8gTWF0aC5leHAoKCRuMSAqIE1hdGgubG9nKCRuMSAvICgkbiArICR4ICogJHgpKSBcblx0XHRcdFx0XHQrIE1hdGgubG9nKCRuLyRuMS8yL01hdGguUEkpIC0gMSBcblx0XHRcdFx0XHQrICgxLyRuMSAtIDEvJG4pIC8gNikgLyAyKTtcblx0XHRcdCR4ICs9ICRkZWx0YTtcblx0XHRcdCRyb3VuZCA9IHJvdW5kX3RvX3ByZWNpc2lvbigkZGVsdGEsIE1hdGguYWJzKGludGVnZXIobG9nMTAoTWF0aC5hYnMoJHgpKS00KSkpO1xuXHRcdH0gd2hpbGUgKCgkeCkgJiYgKCRyb3VuZCAhPSAwKSk7XG5cdH1cblx0cmV0dXJuICR4O1xufVxuXG5mdW5jdGlvbiBfc3VidHByb2IgKCRuLCAkeCkge1xuXG5cdHZhciAkYTtcbiAgICAgICAgdmFyICRiO1xuXHR2YXIgJHcgPSBNYXRoLmF0YW4yKCR4IC8gTWF0aC5zcXJ0KCRuKSwgMSk7XG5cdHZhciAkeiA9IE1hdGgucG93KE1hdGguY29zKCR3KSwgMik7XG5cdHZhciAkeSA9IDE7XG5cblx0Zm9yICh2YXIgJGkgPSAkbi0yOyAkaSA+PSAyOyAkaSAtPSAyKSB7XG5cdFx0JHkgPSAxICsgKCRpLTEpIC8gJGkgKiAkeiAqICR5O1xuXHR9IFxuXG5cdGlmICgkbiAlIDIgPT0gMCkge1xuXHRcdCRhID0gTWF0aC5zaW4oJHcpLzI7XG5cdFx0JGIgPSAuNTtcblx0fSBlbHNlIHtcblx0XHQkYSA9ICgkbiA9PSAxKSA/IDAgOiBNYXRoLnNpbigkdykqTWF0aC5jb3MoJHcpL01hdGguUEk7XG5cdFx0JGI9IC41ICsgJHcvTWF0aC5QSTtcblx0fVxuXHRyZXR1cm4gbWF4KDAsIDEgLSAkYiAtICRhICogJHkpO1xufVxuXG5mdW5jdGlvbiBfc3ViZiAoJG4sICRtLCAkcCkge1xuXHR2YXIgJHg7XG5cblx0aWYgKCRwID49IDEgfHwgJHAgPD0gMCkge1xuXHRcdHRocm93KFwiSW52YWxpZCBwOiAkcFxcblwiKTtcblx0fVxuXG5cdGlmICgkcCA9PSAxKSB7XG5cdFx0JHggPSAwO1xuXHR9IGVsc2UgaWYgKCRtID09IDEpIHtcblx0XHQkeCA9IDEgLyBNYXRoLnBvdyhfc3VidCgkbiwgMC41IC0gJHAgLyAyKSwgMik7XG5cdH0gZWxzZSBpZiAoJG4gPT0gMSkge1xuXHRcdCR4ID0gTWF0aC5wb3coX3N1YnQoJG0sICRwLzIpLCAyKTtcblx0fSBlbHNlIGlmICgkbSA9PSAyKSB7XG5cdFx0dmFyICR1ID0gX3N1YmNoaXNxcigkbSwgMSAtICRwKTtcblx0XHR2YXIgJGEgPSAkbSAtIDI7XG5cdFx0JHggPSAxIC8gKCR1IC8gJG0gKiAoMSArXG5cdFx0XHQoKCR1IC0gJGEpIC8gMiArXG5cdFx0XHRcdCgoKDQgKiAkdSAtIDExICogJGEpICogJHUgKyAkYSAqICg3ICogJG0gLSAxMCkpIC8gMjQgK1xuXHRcdFx0XHRcdCgoKDIgKiAkdSAtIDEwICogJGEpICogJHUgKyAkYSAqICgxNyAqICRtIC0gMjYpKSAqICR1XG5cdFx0XHRcdFx0XHQtICRhICogJGEgKiAoOSAqICRtIC0gNilcblx0XHRcdFx0XHQpLzQ4LyRuXG5cdFx0XHRcdCkvJG5cblx0XHRcdCkvJG4pKTtcblx0fSBlbHNlIGlmICgkbiA+ICRtKSB7XG5cdFx0JHggPSAxIC8gX3N1YmYyKCRtLCAkbiwgMSAtICRwKVxuXHR9IGVsc2Uge1xuXHRcdCR4ID0gX3N1YmYyKCRuLCAkbSwgJHApXG5cdH1cblx0cmV0dXJuICR4O1xufVxuXG5mdW5jdGlvbiBfc3ViZjIgKCRuLCAkbSwgJHApIHtcblx0dmFyICR1ID0gX3N1YmNoaXNxcigkbiwgJHApO1xuXHR2YXIgJG4yID0gJG4gLSAyO1xuXHR2YXIgJHggPSAkdSAvICRuICogXG5cdFx0KDEgKyBcblx0XHRcdCgoJHUgLSAkbjIpIC8gMiArIFxuXHRcdFx0XHQoKCg0ICogJHUgLSAxMSAqICRuMikgKiAkdSArICRuMiAqICg3ICogJG4gLSAxMCkpIC8gMjQgKyBcblx0XHRcdFx0XHQoKCgyICogJHUgLSAxMCAqICRuMikgKiAkdSArICRuMiAqICgxNyAqICRuIC0gMjYpKSAqICR1IFxuXHRcdFx0XHRcdFx0LSAkbjIgKiAkbjIgKiAoOSAqICRuIC0gNikpIC8gNDggLyAkbSkgLyAkbSkgLyAkbSk7XG5cdHZhciAkZGVsdGE7XG5cdGRvIHtcblx0XHR2YXIgJHogPSBNYXRoLmV4cChcblx0XHRcdCgoJG4rJG0pICogTWF0aC5sb2coKCRuKyRtKSAvICgkbiAqICR4ICsgJG0pKSBcblx0XHRcdFx0KyAoJG4gLSAyKSAqIE1hdGgubG9nKCR4KVxuXHRcdFx0XHQrIE1hdGgubG9nKCRuICogJG0gLyAoJG4rJG0pKVxuXHRcdFx0XHQtIE1hdGgubG9nKDQgKiBNYXRoLlBJKVxuXHRcdFx0XHQtICgxLyRuICArIDEvJG0gLSAxLygkbiskbSkpLzZcblx0XHRcdCkvMik7XG5cdFx0JGRlbHRhID0gKF9zdWJmcHJvYigkbiwgJG0sICR4KSAtICRwKSAvICR6O1xuXHRcdCR4ICs9ICRkZWx0YTtcblx0fSB3aGlsZSAoTWF0aC5hYnMoJGRlbHRhKT4zZS00KTtcblx0cmV0dXJuICR4O1xufVxuXG5mdW5jdGlvbiBfc3ViY2hpc3FyICgkbiwgJHApIHtcblx0dmFyICR4O1xuXG5cdGlmICgoJHAgPiAxKSB8fCAoJHAgPD0gMCkpIHtcblx0XHR0aHJvdyhcIkludmFsaWQgcDogJHBcXG5cIik7XG5cdH0gZWxzZSBpZiAoJHAgPT0gMSl7XG5cdFx0JHggPSAwO1xuXHR9IGVsc2UgaWYgKCRuID09IDEpIHtcblx0XHQkeCA9IE1hdGgucG93KF9zdWJ1KCRwIC8gMiksIDIpO1xuXHR9IGVsc2UgaWYgKCRuID09IDIpIHtcblx0XHQkeCA9IC0yICogTWF0aC5sb2coJHApO1xuXHR9IGVsc2Uge1xuXHRcdHZhciAkdSA9IF9zdWJ1KCRwKTtcblx0XHR2YXIgJHUyID0gJHUgKiAkdTtcblxuXHRcdCR4ID0gbWF4KDAsICRuICsgTWF0aC5zcXJ0KDIgKiAkbikgKiAkdSBcblx0XHRcdCsgMi8zICogKCR1MiAtIDEpXG5cdFx0XHQrICR1ICogKCR1MiAtIDcpIC8gOSAvIE1hdGguc3FydCgyICogJG4pXG5cdFx0XHQtIDIvNDA1IC8gJG4gKiAoJHUyICogKDMgKiR1MiArIDcpIC0gMTYpKTtcblxuXHRcdGlmICgkbiA8PSAxMDApIHtcblx0XHRcdHZhciAkeDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJHAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyICR6O1xuXHRcdFx0ZG8ge1xuXHRcdFx0XHQkeDAgPSAkeDtcblx0XHRcdFx0aWYgKCR4IDwgMCkge1xuXHRcdFx0XHRcdCRwMSA9IDE7XG5cdFx0XHRcdH0gZWxzZSBpZiAoJG4+MTAwKSB7XG5cdFx0XHRcdFx0JHAxID0gX3N1YnVwcm9iKChNYXRoLnBvdygoJHggLyAkbiksICgxLzMpKSAtICgxIC0gMi85LyRuKSlcblx0XHRcdFx0XHRcdC8gTWF0aC5zcXJ0KDIvOS8kbikpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCR4PjQwMCkge1xuXHRcdFx0XHRcdCRwMSA9IDA7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFyICRpMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkYTtcblx0XHRcdFx0XHRpZiAoKCRuICUgMikgIT0gMCkge1xuXHRcdFx0XHRcdFx0JHAxID0gMiAqIF9zdWJ1cHJvYihNYXRoLnNxcnQoJHgpKTtcblx0XHRcdFx0XHRcdCRhID0gTWF0aC5zcXJ0KDIvTWF0aC5QSSkgKiBNYXRoLmV4cCgtJHgvMikgLyBNYXRoLnNxcnQoJHgpO1xuXHRcdFx0XHRcdFx0JGkwID0gMTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JHAxID0gJGEgPSBNYXRoLmV4cCgtJHgvMik7XG5cdFx0XHRcdFx0XHQkaTAgPSAyO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGZvciAodmFyICRpID0gJGkwOyAkaSA8PSAkbi0yOyAkaSArPSAyKSB7XG5cdFx0XHRcdFx0XHQkYSAqPSAkeCAvICRpO1xuXHRcdFx0XHRcdFx0JHAxICs9ICRhO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHQkeiA9IE1hdGguZXhwKCgoJG4tMSkgKiBNYXRoLmxvZygkeC8kbikgLSBNYXRoLmxvZyg0Kk1hdGguUEkqJHgpIFxuXHRcdFx0XHRcdCsgJG4gLSAkeCAtIDEvJG4vNikgLyAyKTtcblx0XHRcdFx0JHggKz0gKCRwMSAtICRwKSAvICR6O1xuXHRcdFx0XHQkeCA9IHJvdW5kX3RvX3ByZWNpc2lvbigkeCwgNSk7XG5cdFx0XHR9IHdoaWxlICgoJG4gPCAzMSkgJiYgKE1hdGguYWJzKCR4MCAtICR4KSA+IDFlLTQpKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuICR4O1xufVxuXG5mdW5jdGlvbiBsb2cxMCAoJG4pIHtcblx0cmV0dXJuIE1hdGgubG9nKCRuKSAvIE1hdGgubG9nKDEwKTtcbn1cbiBcbmZ1bmN0aW9uIG1heCAoKSB7XG5cdHZhciAkbWF4ID0gYXJndW1lbnRzWzBdO1xuXHRmb3IgKHZhciAkaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoJG1heCA8IGFyZ3VtZW50c1skaV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAkbWF4ID0gYXJndW1lbnRzWyRpXTtcblx0fVx0XG5cdHJldHVybiAkbWF4O1xufVxuXG5mdW5jdGlvbiBtaW4gKCkge1xuXHR2YXIgJG1pbiA9IGFyZ3VtZW50c1swXTtcblx0Zm9yICh2YXIgJGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRtaW4gPiBhcmd1bWVudHNbJGldKVxuICAgICAgICAgICAgICAgICAgICAgICAgJG1pbiA9IGFyZ3VtZW50c1skaV07XG5cdH1cblx0cmV0dXJuICRtaW47XG59XG5cbmZ1bmN0aW9uIHByZWNpc2lvbiAoJHgpIHtcblx0cmV0dXJuIE1hdGguYWJzKGludGVnZXIobG9nMTAoTWF0aC5hYnMoJHgpKSAtIFNJR05JRklDQU5UKSk7XG59XG5cbmZ1bmN0aW9uIHByZWNpc2lvbl9zdHJpbmcgKCR4KSB7XG5cdGlmICgkeCkge1xuXHRcdHJldHVybiByb3VuZF90b19wcmVjaXNpb24oJHgsIHByZWNpc2lvbigkeCkpO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBcIjBcIjtcblx0fVxufVxuXG5mdW5jdGlvbiByb3VuZF90b19wcmVjaXNpb24gKCR4LCAkcCkge1xuICAgICAgICAkeCA9ICR4ICogTWF0aC5wb3coMTAsICRwKTtcbiAgICAgICAgJHggPSBNYXRoLnJvdW5kKCR4KTtcbiAgICAgICAgcmV0dXJuICR4IC8gTWF0aC5wb3coMTAsICRwKTtcbn1cblxuZnVuY3Rpb24gaW50ZWdlciAoJGkpIHtcbiAgICAgICAgaWYgKCRpID4gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigkaSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKCRpKTtcbn0iLCJpbXBvcnQge3RkaXN0cn0gZnJvbSBcIi4vc3RhdGlzdGljcy1kaXN0cmlidXRpb25zXCJcclxuXHJcbnZhciBzdSA9IG1vZHVsZS5leHBvcnRzLlN0YXRpc3RpY3NVdGlscyA9e307XHJcbnN1LnNhbXBsZUNvcnJlbGF0aW9uID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvc2FtcGxlX2NvcnJlbGF0aW9uJyk7XHJcbnN1LmxpbmVhclJlZ3Jlc3Npb24gPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy9saW5lYXJfcmVncmVzc2lvbicpO1xyXG5zdS5saW5lYXJSZWdyZXNzaW9uTGluZSA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL2xpbmVhcl9yZWdyZXNzaW9uX2xpbmUnKTtcclxuc3UuZXJyb3JGdW5jdGlvbiA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL2Vycm9yX2Z1bmN0aW9uJyk7XHJcbnN1LnN0YW5kYXJkRGV2aWF0aW9uID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvc3RhbmRhcmRfZGV2aWF0aW9uJyk7XHJcbnN1LnNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvc2FtcGxlX3N0YW5kYXJkX2RldmlhdGlvbicpO1xyXG5zdS52YXJpYW5jZSA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL3ZhcmlhbmNlJyk7XHJcbnN1Lm1lYW4gPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy9tZWFuJyk7XHJcbnN1LnpTY29yZSA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL3pfc2NvcmUnKTtcclxuc3Uuc3RhbmRhcmRFcnJvcj0gYXJyID0+IE1hdGguc3FydChzdS52YXJpYW5jZShhcnIpLyhhcnIubGVuZ3RoLTEpKTtcclxuXHJcblxyXG5zdS50VmFsdWU9IChkZWdyZWVzT2ZGcmVlZG9tLCBjcml0aWNhbFByb2JhYmlsaXR5KSA9PiB7IC8vYXMgaW4gaHR0cDovL3N0YXR0cmVrLmNvbS9vbmxpbmUtY2FsY3VsYXRvci90LWRpc3RyaWJ1dGlvbi5hc3B4XHJcbiAgICByZXR1cm4gdGRpc3RyKGRlZ3JlZXNPZkZyZWVkb20sIGNyaXRpY2FsUHJvYmFiaWxpdHkpO1xyXG59OyIsImV4cG9ydCBjbGFzcyBVdGlscyB7XHJcbiAgICBzdGF0aWMgU1FSVF8yID0gMS40MTQyMTM1NjIzNztcclxuICAgIC8vIHVzYWdlIGV4YW1wbGUgZGVlcEV4dGVuZCh7fSwgb2JqQSwgb2JqQik7ID0+IHNob3VsZCB3b3JrIHNpbWlsYXIgdG8gJC5leHRlbmQodHJ1ZSwge30sIG9iakEsIG9iakIpO1xyXG4gICAgc3RhdGljIGRlZXBFeHRlbmQob3V0KSB7XHJcblxyXG4gICAgICAgIHZhciB1dGlscyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGVtcHR5T3V0ID0ge307XHJcblxyXG5cclxuICAgICAgICBpZiAoIW91dCAmJiBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBBcnJheS5pc0FycmF5KGFyZ3VtZW50c1sxXSkpIHtcclxuICAgICAgICAgICAgb3V0ID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG91dCA9IG91dCB8fCB7fTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgaWYgKCFzb3VyY2UpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgIGlmICghc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheShvdXRba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXNPYmplY3QgPSB1dGlscy5pc09iamVjdChvdXRba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3JjT2JqID0gdXRpbHMuaXNPYmplY3Qoc291cmNlW2tleV0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpc09iamVjdCAmJiAhaXNBcnJheSAmJiBzcmNPYmopIHtcclxuICAgICAgICAgICAgICAgICAgICB1dGlscy5kZWVwRXh0ZW5kKG91dFtrZXldLCBzb3VyY2Vba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dFtrZXldID0gc291cmNlW2tleV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBtZXJnZURlZXAodGFyZ2V0LCBzb3VyY2UpIHtcclxuICAgICAgICBsZXQgb3V0cHV0ID0gT2JqZWN0LmFzc2lnbih7fSwgdGFyZ2V0KTtcclxuICAgICAgICBpZiAoVXRpbHMuaXNPYmplY3ROb3RBcnJheSh0YXJnZXQpICYmIFV0aWxzLmlzT2JqZWN0Tm90QXJyYXkoc291cmNlKSkge1xyXG4gICAgICAgICAgICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChVdGlscy5pc09iamVjdE5vdEFycmF5KHNvdXJjZVtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKGtleSBpbiB0YXJnZXQpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKG91dHB1dCwge1trZXldOiBzb3VyY2Vba2V5XX0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0W2tleV0gPSBVdGlscy5tZXJnZURlZXAodGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihvdXRwdXQsIHtba2V5XTogc291cmNlW2tleV19KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNyb3NzKGEsIGIpIHtcclxuICAgICAgICB2YXIgYyA9IFtdLCBuID0gYS5sZW5ndGgsIG0gPSBiLmxlbmd0aCwgaSwgajtcclxuICAgICAgICBmb3IgKGkgPSAtMTsgKytpIDwgbjspIGZvciAoaiA9IC0xOyArK2ogPCBtOykgYy5wdXNoKHt4OiBhW2ldLCBpOiBpLCB5OiBiW2pdLCBqOiBqfSk7XHJcbiAgICAgICAgcmV0dXJuIGM7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBpbmZlclZhcmlhYmxlcyhkYXRhLCBncm91cEtleSwgaW5jbHVkZUdyb3VwKSB7XHJcbiAgICAgICAgdmFyIHJlcyA9IFtdO1xyXG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB2YXIgZCA9IGRhdGFbMF07XHJcbiAgICAgICAgICAgIGlmIChkIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIHJlcyA9IGQubWFwKGZ1bmN0aW9uICh2LCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZCA9PT0gJ29iamVjdCcpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIGQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWQuaGFzT3duUHJvcGVydHkocHJvcCkpIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXMucHVzaChwcm9wKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWluY2x1ZGVHcm91cCkge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSByZXMuaW5kZXhPZihncm91cEtleSk7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICByZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzXHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBpc09iamVjdE5vdEFycmF5KGl0ZW0pIHtcclxuICAgICAgICByZXR1cm4gKGl0ZW0gJiYgdHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KGl0ZW0pICYmIGl0ZW0gIT09IG51bGwpO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgaXNPYmplY3QoYSkge1xyXG4gICAgICAgIHJldHVybiBhICE9PSBudWxsICYmIHR5cGVvZiBhID09PSAnb2JqZWN0JztcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGlzTnVtYmVyKGEpIHtcclxuICAgICAgICByZXR1cm4gIWlzTmFOKGEpICYmIHR5cGVvZiBhID09PSAnbnVtYmVyJztcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGlzRnVuY3Rpb24oYSkge1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgYSA9PT0gJ2Z1bmN0aW9uJztcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGlzRGF0ZShhKXtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGEpID09PSAnW29iamVjdCBEYXRlXSdcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaXNTdHJpbmcoYSl7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBhID09PSAnc3RyaW5nJyB8fCBhIGluc3RhbmNlb2YgU3RyaW5nXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGluc2VydE9yQXBwZW5kU2VsZWN0b3IocGFyZW50LCBzZWxlY3Rvciwgb3BlcmF0aW9uLCBiZWZvcmUpIHtcclxuICAgICAgICB2YXIgc2VsZWN0b3JQYXJ0cyA9IHNlbGVjdG9yLnNwbGl0KC8oW1xcLlxcI10pLyk7XHJcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBwYXJlbnRbb3BlcmF0aW9uXShzZWxlY3RvclBhcnRzLnNoaWZ0KCksIGJlZm9yZSk7Ly9cIjpmaXJzdC1jaGlsZFwiXHJcbiAgICAgICAgd2hpbGUgKHNlbGVjdG9yUGFydHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZWN0b3JNb2RpZmllciA9IHNlbGVjdG9yUGFydHMuc2hpZnQoKTtcclxuICAgICAgICAgICAgdmFyIHNlbGVjdG9ySXRlbSA9IHNlbGVjdG9yUGFydHMuc2hpZnQoKTtcclxuICAgICAgICAgICAgaWYgKHNlbGVjdG9yTW9kaWZpZXIgPT09IFwiLlwiKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5jbGFzc2VkKHNlbGVjdG9ySXRlbSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZWN0b3JNb2RpZmllciA9PT0gXCIjXCIpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LmF0dHIoJ2lkJywgc2VsZWN0b3JJdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaW5zZXJ0U2VsZWN0b3IocGFyZW50LCBzZWxlY3RvciwgYmVmb3JlKSB7XHJcbiAgICAgICAgcmV0dXJuIFV0aWxzLmluc2VydE9yQXBwZW5kU2VsZWN0b3IocGFyZW50LCBzZWxlY3RvciwgXCJpbnNlcnRcIiwgYmVmb3JlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXBwZW5kU2VsZWN0b3IocGFyZW50LCBzZWxlY3Rvcikge1xyXG4gICAgICAgIHJldHVybiBVdGlscy5pbnNlcnRPckFwcGVuZFNlbGVjdG9yKHBhcmVudCwgc2VsZWN0b3IsIFwiYXBwZW5kXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzZWxlY3RPckFwcGVuZChwYXJlbnQsIHNlbGVjdG9yLCBlbGVtZW50KSB7XHJcbiAgICAgICAgdmFyIHNlbGVjdGlvbiA9IHBhcmVudC5zZWxlY3Qoc2VsZWN0b3IpO1xyXG4gICAgICAgIGlmIChzZWxlY3Rpb24uZW1wdHkoKSkge1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcmVudC5hcHBlbmQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFV0aWxzLmFwcGVuZFNlbGVjdG9yKHBhcmVudCwgc2VsZWN0b3IpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNlbGVjdGlvbjtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIHNlbGVjdE9ySW5zZXJ0KHBhcmVudCwgc2VsZWN0b3IsIGJlZm9yZSkge1xyXG4gICAgICAgIHZhciBzZWxlY3Rpb24gPSBwYXJlbnQuc2VsZWN0KHNlbGVjdG9yKTtcclxuICAgICAgICBpZiAoc2VsZWN0aW9uLmVtcHR5KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFV0aWxzLmluc2VydFNlbGVjdG9yKHBhcmVudCwgc2VsZWN0b3IsIGJlZm9yZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzZWxlY3Rpb247XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBsaW5lYXJHcmFkaWVudChzdmcsIGdyYWRpZW50SWQsIHJhbmdlLCB4MSwgeTEsIHgyLCB5Mikge1xyXG4gICAgICAgIHZhciBkZWZzID0gVXRpbHMuc2VsZWN0T3JBcHBlbmQoc3ZnLCBcImRlZnNcIik7XHJcbiAgICAgICAgdmFyIGxpbmVhckdyYWRpZW50ID0gZGVmcy5hcHBlbmQoXCJsaW5lYXJHcmFkaWVudFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIGdyYWRpZW50SWQpO1xyXG5cclxuICAgICAgICBsaW5lYXJHcmFkaWVudFxyXG4gICAgICAgICAgICAuYXR0cihcIngxXCIsIHgxICsgXCIlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieTFcIiwgeTEgKyBcIiVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ4MlwiLCB4MiArIFwiJVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInkyXCIsIHkyICsgXCIlXCIpO1xyXG5cclxuICAgICAgICAvL0FwcGVuZCBtdWx0aXBsZSBjb2xvciBzdG9wcyBieSB1c2luZyBEMydzIGRhdGEvZW50ZXIgc3RlcFxyXG4gICAgICAgIHZhciBzdG9wcyA9IGxpbmVhckdyYWRpZW50LnNlbGVjdEFsbChcInN0b3BcIilcclxuICAgICAgICAgICAgLmRhdGEocmFuZ2UpO1xyXG5cclxuICAgICAgICBzdG9wcy5lbnRlcigpLmFwcGVuZChcInN0b3BcIik7XHJcblxyXG4gICAgICAgIHN0b3BzLmF0dHIoXCJvZmZzZXRcIiwgKGQsIGkpID0+IGkgLyAocmFuZ2UubGVuZ3RoIC0gMSkpXHJcbiAgICAgICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCBkID0+IGQpO1xyXG5cclxuICAgICAgICBzdG9wcy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNhbml0aXplSGVpZ2h0ID0gZnVuY3Rpb24gKGhlaWdodCwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIChoZWlnaHQgfHwgcGFyc2VJbnQoY29udGFpbmVyLnN0eWxlKCdoZWlnaHQnKSwgMTApIHx8IDQwMCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBzYW5pdGl6ZVdpZHRoID0gZnVuY3Rpb24gKHdpZHRoLCBjb250YWluZXIpIHtcclxuICAgICAgICByZXR1cm4gKHdpZHRoIHx8IHBhcnNlSW50KGNvbnRhaW5lci5zdHlsZSgnd2lkdGgnKSwgMTApIHx8IDk2MCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBhdmFpbGFibGVIZWlnaHQgPSBmdW5jdGlvbiAoaGVpZ2h0LCBjb250YWluZXIsIG1hcmdpbikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLm1heCgwLCBVdGlscy5zYW5pdGl6ZUhlaWdodChoZWlnaHQsIGNvbnRhaW5lcikgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBhdmFpbGFibGVXaWR0aCA9IGZ1bmN0aW9uICh3aWR0aCwgY29udGFpbmVyLCBtYXJnaW4pIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5tYXgoMCwgVXRpbHMuc2FuaXRpemVXaWR0aCh3aWR0aCwgY29udGFpbmVyKSAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0KTtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGd1aWQoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gczQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKCgxICsgTWF0aC5yYW5kb20oKSkgKiAweDEwMDAwKVxyXG4gICAgICAgICAgICAgICAgLnRvU3RyaW5nKDE2KVxyXG4gICAgICAgICAgICAgICAgLnN1YnN0cmluZygxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzNCgpICsgczQoKSArICctJyArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICtcclxuICAgICAgICAgICAgczQoKSArICctJyArIHM0KCkgKyBzNCgpICsgczQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvL3BsYWNlcyB0ZXh0U3RyaW5nIGluIHRleHRPYmosIGFkZHMgYW4gZWxsaXBzaXMgaWYgdGV4dCBjYW4ndCBmaXQgaW4gd2lkdGhcclxuICAgIHN0YXRpYyBwbGFjZVRleHRXaXRoRWxsaXBzaXModGV4dEQzT2JqLCB0ZXh0U3RyaW5nLCB3aWR0aCl7XHJcbiAgICAgICAgdmFyIHRleHRPYmogPSB0ZXh0RDNPYmoubm9kZSgpO1xyXG4gICAgICAgIHRleHRPYmoudGV4dENvbnRlbnQ9dGV4dFN0cmluZztcclxuXHJcbiAgICAgICAgdmFyIG1hcmdpbiA9IDA7XHJcbiAgICAgICAgdmFyIGVsbGlwc2lzTGVuZ3RoID0gOTtcclxuICAgICAgICAvL2VsbGlwc2lzIGlzIG5lZWRlZFxyXG4gICAgICAgIGlmICh0ZXh0T2JqLmdldENvbXB1dGVkVGV4dExlbmd0aCgpPndpZHRoK21hcmdpbil7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHg9dGV4dFN0cmluZy5sZW5ndGgtMzt4PjA7eC09MSl7XHJcbiAgICAgICAgICAgICAgICBpZiAodGV4dE9iai5nZXRTdWJTdHJpbmdMZW5ndGgoMCx4KStlbGxpcHNpc0xlbmd0aDw9d2lkdGgrbWFyZ2luKXtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0T2JqLnRleHRDb250ZW50PXRleHRTdHJpbmcuc3Vic3RyaW5nKDAseCkrXCIuLi5cIjtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0ZXh0T2JqLnRleHRDb250ZW50PVwiLi4uXCI7IC8vY2FuJ3QgcGxhY2UgYXQgYWxsXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHBsYWNlVGV4dFdpdGhFbGxpcHNpc0FuZFRvb2x0aXAodGV4dEQzT2JqLCB0ZXh0U3RyaW5nLCB3aWR0aCwgdG9vbHRpcCl7XHJcbiAgICAgICAgdmFyIGVsbGlwc2lzUGxhY2VkID0gVXRpbHMucGxhY2VUZXh0V2l0aEVsbGlwc2lzKHRleHREM09iaiwgdGV4dFN0cmluZywgd2lkdGgpO1xyXG4gICAgICAgIGlmKGVsbGlwc2lzUGxhY2VkICYmIHRvb2x0aXApe1xyXG4gICAgICAgICAgICB0ZXh0RDNPYmoub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIHRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDIwMClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIC45KTtcclxuICAgICAgICAgICAgICAgIHRvb2x0aXAuaHRtbCh0ZXh0U3RyaW5nKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkMy5ldmVudC5wYWdlWSAtIDI4KSArIFwicHhcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGV4dEQzT2JqLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIHRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRGb250U2l6ZShlbGVtZW50KXtcclxuICAgICAgICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShcImZvbnQtc2l6ZVwiKTtcclxuICAgIH1cclxufVxyXG4iXX0=
