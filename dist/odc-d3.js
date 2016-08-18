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
            this.plot = {
                margin: {
                    top: margin.top,
                    bottom: margin.bottom,
                    left: margin.left,
                    right: margin.right
                }
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
            console.log('base uppdate');
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
    }]);

    return Chart;
}();

},{"./utils":30}],20:[function(require,module,exports){
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

        _this.svgClass = 'odc-correlation-matrix';
        _this.guides = false;
        _this.showTooltip = true;
        _this.showLegend = true;
        _this.highlightLabels = true;
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
            var self = this;
            var plot = self.plot;
            var labelClass = self.prefixClass("label");
            var labelXClass = labelClass + "-x";
            var labelYClass = labelClass + "-y";
            plot.labelClass = labelClass;

            var labelsX = self.svgG.selectAll("text." + labelXClass).data(plot.variables, function (d, i) {
                return i;
            });

            labelsX.enter().append("text").attr("class", function (d, i) {
                return labelClass + " " + labelXClass + " " + labelXClass + "-" + i;
            });

            labelsX.attr("x", function (d, i) {
                return i * plot.cellSize + plot.cellSize / 2;
            }).attr("y", plot.height).attr("dx", -2).attr("dy", 5).attr("transform", function (d, i) {
                return "rotate(-45, " + (i * plot.cellSize + plot.cellSize / 2) + ", " + plot.height + ")";
            }).attr("text-anchor", "end")

            // .attr("dominant-baseline", "hanging")
            .text(function (v) {
                return plot.labelByVariable[v];
            });

            labelsX.exit().remove();

            //////

            var labelsY = self.svgG.selectAll("text." + labelYClass).data(plot.variables);

            labelsY.enter().append("text");

            labelsY.attr("x", 0).attr("y", function (d, i) {
                return i * plot.cellSize + plot.cellSize / 2;
            }).attr("dx", -2).attr("text-anchor", "end").attr("class", function (d, i) {
                return labelClass + " " + labelYClass + " " + labelYClass + "-" + i;
            })
            // .attr("dominant-baseline", "hanging")
            .text(function (v) {
                return plot.labelByVariable[v];
            });

            labelsY.exit().remove();
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

},{"./chart":19,"./legend":24,"./scatterplot":27,"./statistics-utils":29,"./utils":30}],21:[function(require,module,exports){
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

},{"./utils":30}],22:[function(require,module,exports){
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

            this.buildCells();
        }
    }, {
        key: 'buildCells',
        value: function buildCells() {
            var self = this;
            var config = self.config;
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
                    } catch (e) {
                        // console.log(e);

                    }

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
            if (config.color.scale == "log") {
                z.domain = [];
                range.forEach(function (c, i) {
                    var v = z.min + extent / Math.pow(10, i);
                    z.domain.unshift(v);
                });
            } else {
                z.domain = [];
                range.forEach(function (c, i) {
                    var v = z.min + extent * (i / (range.length - 1));
                    z.domain.push(v);
                });
            }
            z.domain[0] = z.min; //removing unnecessary floating points
            z.domain[z.domain.length - 1] = z.max; //removing unnecessary floating points
            console.log(z.domain);

            var plot = this.plot;

            console.log(range);
            plot.z.color.scale = d3.scale[config.color.scale]().domain(z.domain).range(range);
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

            this.updateVariableLabels();

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
            self.svgG.selectOrAppend("g." + self.prefixClass('axis-x')).attr("transform", "translate(" + plot.width / 2 + "," + (plot.height + plot.margin.bottom) + ")").selectOrAppend("text." + self.prefixClass('label')).attr("dy", "-1em").style("text-anchor", "middle").text(self.config.x.title);

            self.svgG.selectOrAppend("g." + self.prefixClass('axis-y')).selectOrAppend("text." + self.prefixClass('label')).attr("transform", "translate(" + -plot.margin.left + "," + plot.height / 2 + ")rotate(-90)").attr("dy", "1em").style("text-anchor", "middle").text(self.config.y.title);
        }
    }, {
        key: 'updateVariableLabels',
        value: function updateVariableLabels() {
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

            var labelsX = self.svgG.selectAll("text." + labelXClass).data(plot.x.allValuesList, function (d, i) {
                return i;
            });

            labelsX.enter().append("text").attr("class", function (d, i) {
                return labelClass + " " + labelXClass + " " + labelXClass + "-" + i;
            });

            labelsX.attr("x", function (d, i) {
                return i * plot.cellWidth + plot.cellWidth / 2 + d.group.gapsSize + offsetX.x;
            }).attr("y", plot.height + offsetX.y).attr("dy", 10).attr("text-anchor", "middle").text(function (d) {
                return self.formatValueX(d.val);
            });

            if (self.config.x.rotateLabels) {
                labelsX.attr("transform", function (d, i) {
                    return "rotate(-45, " + (i * plot.cellWidth + plot.cellWidth / 2 + d.group.gapsSize + offsetX.x) + ", " + (plot.height + offsetX.y) + ")";
                }).attr("dx", -2).attr("dy", 8).attr("text-anchor", "end");
            }

            labelsX.exit().remove();

            var labelsY = self.svgG.selectAll("text." + labelYClass).data(plot.y.allValuesList);

            labelsY.enter().append("text");

            var offsetY = {
                x: 0,
                y: 0
            };
            if (plot.groupByY) {
                var _overlap = self.config.y.groups.overlap;
                var _gapSize = Heatmap.computeGapSize(0);
                offsetY.x = -_overlap.left;

                offsetY.y = _gapSize / 2;
            }
            labelsY.attr("x", offsetY.x).attr("y", function (d, i) {
                return i * plot.cellHeight + plot.cellHeight / 2 + d.group.gapsSize + offsetY.y;
            }).attr("dx", -2).attr("text-anchor", "end").attr("class", function (d, i) {
                return labelClass + " " + labelYClass + " " + labelYClass + "-" + i;
            }).text(function (d) {
                return self.formatValueY(d.val);
            });

            if (self.config.y.rotateLabels) {
                labelsY.attr("transform", function (d, i) {
                    return "rotate(-45, " + offsetY.x + ", " + (d.group.gapsSize + (i * plot.cellHeight + plot.cellHeight / 2) + offsetY.y) + ")";
                }).attr("text-anchor", "end");
                // .attr("dx", -7);
            } else {
                labelsY.attr("dominant-baseline", "middle");
            }

            labelsY.exit().remove();
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

            var titleRectWidth = 6;
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

                var trnaslateVAl = "translate(" + (padding - overlap.left) + "," + (plot.cellHeight * valuesBeforeCount + i * gapSize + gapsBeforeSize + padding) + ")";
                gapsBeforeSize += d.gapsInsideSize || 0;
                valuesBeforeCount += d.allValuesCount || 0;
                return trnaslateVAl;
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
            var titleRectHeight = 6;

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

                var trnaslateVAl = "translate(" + (plot.cellWidth * valuesBeforeCount + i * gapSize + gapsBeforeSize + padding) + ", " + (padding - overlap.top) + ")";
                gapsBeforeSize += d.gapsInsideSize || 0;
                valuesBeforeCount += d.allValuesCount || 0;
                return trnaslateVAl;
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
            }).linearGradientBar(barWidth, barHeight);
        }
    }], [{
        key: 'computeGapSize',
        value: function computeGapSize(gapLevel) {
            return 24 / (gapLevel + 1);
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

},{"./chart":19,"./legend":24,"./utils":30}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Legend = exports.StatisticsUtils = exports.HeatmapConfig = exports.Heatmap = exports.RegressionConfig = exports.Regression = exports.CorrelationMatrixConfig = exports.CorrelationMatrix = exports.ScatterPlotMatrixConfig = exports.ScatterPlotMatrix = exports.ScatterPlotConfig = exports.ScatterPlot = undefined;

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

},{"./correlation-matrix":20,"./d3-extensions":21,"./heatmap":22,"./legend":24,"./regression":25,"./scatterplot":27,"./scatterplot-matrix":26,"./statistics-utils":29}],24:[function(require,module,exports){
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
            ticks.enter().append("text").attr("x", barWidth).attr("y", function (d, i) {
                return barHeight - i * barHeight / ticksNumber;
            }).attr("dx", 3)
            // .attr("dy", 1)
            .attr("alignment-baseline", "middle").text(function (d) {
                return self.labelFormat ? self.labelFormat(d) : d;
            });

            ticks.exit().remove();

            return this;
        }
    }]);

    return Legend;
}();

},{"../bower_components/d3-legend/no-extend":1,"./utils":30}],25:[function(require,module,exports){
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

            var line = regression.enter().insertSelector(regressionSelector).append("path").attr("class", self.prefixClass("line")).attr("shape-rendering", "optimizeQuality");
            // .append("line")
            // .attr("class", "line")
            // .attr("shape-rendering", "optimizeQuality");

            line
            // .attr("x1", r=> self.plot.x.scale(r.linePoints[0].x))
            // .attr("y1", r=> self.plot.y.scale(r.linePoints[0].y))
            // .attr("x2", r=> self.plot.x.scale(r.linePoints[1].x))
            // .attr("y2", r=> self.plot.y.scale(r.linePoints[1].y))
            .attr("d", function (r) {
                return r.line(r.linePoints);
            }).style("stroke", function (r) {
                return r.color;
            });

            var area = regression.enter().appendSelector(regressionSelector).append("path").attr("class", confidenceAreaClass).attr("shape-rendering", "optimizeQuality");

            area.attr("d", function (r) {
                return r.confidence.area(r.confidence.points);
            }).style("fill", function (r) {
                return r.color;
            }).style("opacity", "0.4");
        }
    }]);

    return Regression;
}(_scatterplot.ScatterPlot);

},{"./chart":19,"./scatterplot":27,"./statistics-utils":29,"./utils":30}],26:[function(require,module,exports){
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

},{"./chart":19,"./legend":24,"./scatterplot":27,"./utils":30}],27:[function(require,module,exports){
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

            // var legendWidth = availableWidth;
            // legend.width(legendWidth);
            //
            // wrap.select('.nv-legendWrap')
            //     .datum(data)
            //     .call(legend);
            //
            // if (legend.height() > margin.top) {
            //     margin.top = legend.height();
            //     availableHeight = nv.utils.availableHeight(height, container, margin);
            // }

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
        key: "draw",
        value: function draw() {
            this.drawAxisX();
            this.drawAxisY();
            this.update();
        }
    }, {
        key: "drawAxisX",
        value: function drawAxisX() {

            var self = this;
            var plot = self.plot;
            var axisConf = this.config.x;
            self.svgG.selectOrAppend("g." + self.prefixClass('axis-x') + "." + self.prefixClass('axis') + (self.config.guides ? '' : '.' + self.prefixClass('no-guides'))).attr("transform", "translate(0," + plot.height + ")").call(plot.x.axis).selectOrAppend("text." + self.prefixClass('label')).attr("transform", "translate(" + plot.width / 2 + "," + plot.margin.bottom + ")") // text is drawn off the screen top left, move down and out and rotate
            .attr("dy", "-1em").style("text-anchor", "middle").text(axisConf.label);
        }
    }, {
        key: "drawAxisY",
        value: function drawAxisY() {
            var self = this;
            var plot = self.plot;
            var axisConf = this.config.y;
            self.svgG.selectOrAppend("g." + self.prefixClass('axis-y') + "." + self.prefixClass('axis') + (self.config.guides ? '' : '.' + self.prefixClass('no-guides'))).call(plot.y.axis).selectOrAppend("text." + self.prefixClass('label')).attr("transform", "translate(" + -plot.margin.left + "," + plot.height / 2 + ")rotate(-90)") // text is drawn off the screen top left, move down and out and rotate
            .attr("dy", "1em").style("text-anchor", "middle").text(axisConf.label);
        }
    }, {
        key: "update",
        value: function update(newData) {
            _get(Object.getPrototypeOf(ScatterPlot.prototype), "update", this).call(this, newData);

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
            if (self.config.transition) {
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

},{"./chart":19,"./legend":24,"./utils":30}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{"../bower_components/simple-statistics/src/error_function":6,"../bower_components/simple-statistics/src/linear_regression":7,"../bower_components/simple-statistics/src/linear_regression_line":8,"../bower_components/simple-statistics/src/mean":9,"../bower_components/simple-statistics/src/sample_correlation":10,"../bower_components/simple-statistics/src/sample_standard_deviation":12,"../bower_components/simple-statistics/src/standard_deviation":14,"../bower_components/simple-statistics/src/variance":17,"../bower_components/simple-statistics/src/z_score":18,"./statistics-distributions":28}],30:[function(require,module,exports){
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
    }]);

    return Utils;
}();

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

},{}]},{},[23])(23)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJib3dlcl9jb21wb25lbnRzXFxkMy1sZWdlbmRcXG5vLWV4dGVuZC5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxjb2xvci5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxsZWdlbmQuanMiLCJib3dlcl9jb21wb25lbnRzXFxkMy1sZWdlbmRcXHNyY1xcc2l6ZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxzeW1ib2wuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxlcnJvcl9mdW5jdGlvbi5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXGxpbmVhcl9yZWdyZXNzaW9uLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcbGluZWFyX3JlZ3Jlc3Npb25fbGluZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXG1lYW4uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfY29ycmVsYXRpb24uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfY292YXJpYW5jZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXHNhbXBsZV9zdGFuZGFyZF9kZXZpYXRpb24uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfdmFyaWFuY2UuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzdGFuZGFyZF9kZXZpYXRpb24uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzdW0uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzdW1fbnRoX3Bvd2VyX2RldmlhdGlvbnMuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFx2YXJpYW5jZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXHpfc2NvcmUuanMiLCJzcmNcXGNoYXJ0LmpzIiwic3JjXFxjb3JyZWxhdGlvbi1tYXRyaXguanMiLCJzcmNcXGQzLWV4dGVuc2lvbnMuanMiLCJzcmNcXGhlYXRtYXAuanMiLCJzcmNcXGluZGV4LmpzIiwic3JjXFxsZWdlbmQuanMiLCJzcmNcXHJlZ3Jlc3Npb24uanMiLCJzcmNcXHNjYXR0ZXJwbG90LW1hdHJpeC5qcyIsInNyY1xcc2NhdHRlcnBsb3QuanMiLCJzcmNcXHN0YXRpc3RpY3MtZGlzdHJpYnV0aW9ucy5qcyIsInNyY1xcc3RhdGlzdGljcy11dGlscy5qcyIsInNyY1xcdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQjtBQUNmLFNBQU8sUUFBUSxhQUFSLENBRFE7QUFFZixRQUFNLFFBQVEsWUFBUixDQUZTO0FBR2YsVUFBUSxRQUFRLGNBQVI7QUFITyxDQUFqQjs7Ozs7QUNBQSxJQUFJLFNBQVMsUUFBUSxVQUFSLENBQWI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFlBQVU7O0FBRXpCLE1BQUksUUFBUSxHQUFHLEtBQUgsQ0FBUyxNQUFULEVBQVo7QUFBQSxNQUNFLFFBQVEsTUFEVjtBQUFBLE1BRUUsYUFBYSxFQUZmO0FBQUEsTUFHRSxjQUFjLEVBSGhCO0FBQUEsTUFJRSxjQUFjLEVBSmhCO0FBQUEsTUFLRSxlQUFlLENBTGpCO0FBQUEsTUFNRSxRQUFRLENBQUMsQ0FBRCxDQU5WO0FBQUEsTUFPRSxTQUFTLEVBUFg7QUFBQSxNQVFFLGNBQWMsRUFSaEI7QUFBQSxNQVNFLFdBQVcs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ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICBjb2xvcjogcmVxdWlyZSgnLi9zcmMvY29sb3InKSxcclxuICBzaXplOiByZXF1aXJlKCcuL3NyYy9zaXplJyksXHJcbiAgc3ltYm9sOiByZXF1aXJlKCcuL3NyYy9zeW1ib2wnKVxyXG59O1xyXG4iLCJ2YXIgaGVscGVyID0gcmVxdWlyZSgnLi9sZWdlbmQnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgdmFyIHNjYWxlID0gZDMuc2NhbGUubGluZWFyKCksXHJcbiAgICBzaGFwZSA9IFwicmVjdFwiLFxyXG4gICAgc2hhcGVXaWR0aCA9IDE1LFxyXG4gICAgc2hhcGVIZWlnaHQgPSAxNSxcclxuICAgIHNoYXBlUmFkaXVzID0gMTAsXHJcbiAgICBzaGFwZVBhZGRpbmcgPSAyLFxyXG4gICAgY2VsbHMgPSBbNV0sXHJcbiAgICBsYWJlbHMgPSBbXSxcclxuICAgIGNsYXNzUHJlZml4ID0gXCJcIixcclxuICAgIHVzZUNsYXNzID0gZmFsc2UsXHJcbiAgICB0aXRsZSA9IFwiXCIsXHJcbiAgICBsYWJlbEZvcm1hdCA9IGQzLmZvcm1hdChcIi4wMWZcIiksXHJcbiAgICBsYWJlbE9mZnNldCA9IDEwLFxyXG4gICAgbGFiZWxBbGlnbiA9IFwibWlkZGxlXCIsXHJcbiAgICBsYWJlbERlbGltaXRlciA9IFwidG9cIixcclxuICAgIG9yaWVudCA9IFwidmVydGljYWxcIixcclxuICAgIGFzY2VuZGluZyA9IGZhbHNlLFxyXG4gICAgcGF0aCxcclxuICAgIGxlZ2VuZERpc3BhdGNoZXIgPSBkMy5kaXNwYXRjaChcImNlbGxvdmVyXCIsIFwiY2VsbG91dFwiLCBcImNlbGxjbGlja1wiKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsZWdlbmQoc3ZnKXtcclxuXHJcbiAgICAgIHZhciB0eXBlID0gaGVscGVyLmQzX2NhbGNUeXBlKHNjYWxlLCBhc2NlbmRpbmcsIGNlbGxzLCBsYWJlbHMsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlciksXHJcbiAgICAgICAgbGVnZW5kRyA9IHN2Zy5zZWxlY3RBbGwoJ2cnKS5kYXRhKFtzY2FsZV0pO1xyXG5cclxuICAgICAgbGVnZW5kRy5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgY2xhc3NQcmVmaXggKyAnbGVnZW5kQ2VsbHMnKTtcclxuXHJcblxyXG4gICAgICB2YXIgY2VsbCA9IGxlZ2VuZEcuc2VsZWN0QWxsKFwiLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGxcIikuZGF0YSh0eXBlLmRhdGEpLFxyXG4gICAgICAgIGNlbGxFbnRlciA9IGNlbGwuZW50ZXIoKS5hcHBlbmQoXCJnXCIsIFwiLmNlbGxcIikuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJjZWxsXCIpLnN0eWxlKFwib3BhY2l0eVwiLCAxZS02KSxcclxuICAgICAgICBzaGFwZUVudGVyID0gY2VsbEVudGVyLmFwcGVuZChzaGFwZSkuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJzd2F0Y2hcIiksXHJcbiAgICAgICAgc2hhcGVzID0gY2VsbC5zZWxlY3QoXCJnLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGwgXCIgKyBzaGFwZSk7XHJcblxyXG4gICAgICAvL2FkZCBldmVudCBoYW5kbGVyc1xyXG4gICAgICBoZWxwZXIuZDNfYWRkRXZlbnRzKGNlbGxFbnRlciwgbGVnZW5kRGlzcGF0Y2hlcik7XHJcblxyXG4gICAgICBjZWxsLmV4aXQoKS50cmFuc2l0aW9uKCkuc3R5bGUoXCJvcGFjaXR5XCIsIDApLnJlbW92ZSgpO1xyXG5cclxuICAgICAgaGVscGVyLmQzX2RyYXdTaGFwZXMoc2hhcGUsIHNoYXBlcywgc2hhcGVIZWlnaHQsIHNoYXBlV2lkdGgsIHNoYXBlUmFkaXVzLCBwYXRoKTtcclxuXHJcbiAgICAgIGhlbHBlci5kM19hZGRUZXh0KGxlZ2VuZEcsIGNlbGxFbnRlciwgdHlwZS5sYWJlbHMsIGNsYXNzUHJlZml4KVxyXG5cclxuICAgICAgLy8gc2V0cyBwbGFjZW1lbnRcclxuICAgICAgdmFyIHRleHQgPSBjZWxsLnNlbGVjdChcInRleHRcIiksXHJcbiAgICAgICAgc2hhcGVTaXplID0gc2hhcGVzWzBdLm1hcCggZnVuY3Rpb24oZCl7IHJldHVybiBkLmdldEJCb3goKTsgfSk7XHJcblxyXG4gICAgICAvL3NldHMgc2NhbGVcclxuICAgICAgLy9ldmVyeXRoaW5nIGlzIGZpbGwgZXhjZXB0IGZvciBsaW5lIHdoaWNoIGlzIHN0cm9rZSxcclxuICAgICAgaWYgKCF1c2VDbGFzcyl7XHJcbiAgICAgICAgaWYgKHNoYXBlID09IFwibGluZVwiKXtcclxuICAgICAgICAgIHNoYXBlcy5zdHlsZShcInN0cm9rZVwiLCB0eXBlLmZlYXR1cmUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzaGFwZXMuc3R5bGUoXCJmaWxsXCIsIHR5cGUuZmVhdHVyZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNoYXBlcy5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCl7IHJldHVybiBjbGFzc1ByZWZpeCArIFwic3dhdGNoIFwiICsgdHlwZS5mZWF0dXJlKGQpOyB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGNlbGxUcmFucyxcclxuICAgICAgdGV4dFRyYW5zLFxyXG4gICAgICB0ZXh0QWxpZ24gPSAobGFiZWxBbGlnbiA9PSBcInN0YXJ0XCIpID8gMCA6IChsYWJlbEFsaWduID09IFwibWlkZGxlXCIpID8gMC41IDogMTtcclxuXHJcbiAgICAgIC8vcG9zaXRpb25zIGNlbGxzIGFuZCB0ZXh0XHJcbiAgICAgIGlmIChvcmllbnQgPT09IFwidmVydGljYWxcIil7XHJcbiAgICAgICAgY2VsbFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZSgwLCBcIiArIChpICogKHNoYXBlU2l6ZVtpXS5oZWlnaHQgKyBzaGFwZVBhZGRpbmcpKSArIFwiKVwiOyB9O1xyXG4gICAgICAgIHRleHRUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAoc2hhcGVTaXplW2ldLndpZHRoICsgc2hhcGVTaXplW2ldLnggK1xyXG4gICAgICAgICAgbGFiZWxPZmZzZXQpICsgXCIsXCIgKyAoc2hhcGVTaXplW2ldLnkgKyBzaGFwZVNpemVbaV0uaGVpZ2h0LzIgKyA1KSArIFwiKVwiOyB9O1xyXG5cclxuICAgICAgfSBlbHNlIGlmIChvcmllbnQgPT09IFwiaG9yaXpvbnRhbFwiKXtcclxuICAgICAgICBjZWxsVHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKGkgKiAoc2hhcGVTaXplW2ldLndpZHRoICsgc2hhcGVQYWRkaW5nKSkgKyBcIiwwKVwiOyB9XHJcbiAgICAgICAgdGV4dFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIChzaGFwZVNpemVbaV0ud2lkdGgqdGV4dEFsaWduICArIHNoYXBlU2l6ZVtpXS54KSArXHJcbiAgICAgICAgICBcIixcIiArIChzaGFwZVNpemVbaV0uaGVpZ2h0ICsgc2hhcGVTaXplW2ldLnkgKyBsYWJlbE9mZnNldCArIDgpICsgXCIpXCI7IH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGhlbHBlci5kM19wbGFjZW1lbnQob3JpZW50LCBjZWxsLCBjZWxsVHJhbnMsIHRleHQsIHRleHRUcmFucywgbGFiZWxBbGlnbik7XHJcbiAgICAgIGhlbHBlci5kM190aXRsZShzdmcsIGxlZ2VuZEcsIHRpdGxlLCBjbGFzc1ByZWZpeCk7XHJcblxyXG4gICAgICBjZWxsLnRyYW5zaXRpb24oKS5zdHlsZShcIm9wYWNpdHlcIiwgMSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gIGxlZ2VuZC5zY2FsZSA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNjYWxlO1xyXG4gICAgc2NhbGUgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuY2VsbHMgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBjZWxscztcclxuICAgIGlmIChfLmxlbmd0aCA+IDEgfHwgXyA+PSAyICl7XHJcbiAgICAgIGNlbGxzID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlID0gZnVuY3Rpb24oXywgZCkge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGU7XHJcbiAgICBpZiAoXyA9PSBcInJlY3RcIiB8fCBfID09IFwiY2lyY2xlXCIgfHwgXyA9PSBcImxpbmVcIiB8fCAoXyA9PSBcInBhdGhcIiAmJiAodHlwZW9mIGQgPT09ICdzdHJpbmcnKSkgKXtcclxuICAgICAgc2hhcGUgPSBfO1xyXG4gICAgICBwYXRoID0gZDtcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlV2lkdGggPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZVdpZHRoO1xyXG4gICAgc2hhcGVXaWR0aCA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuc2hhcGVIZWlnaHQgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZUhlaWdodDtcclxuICAgIHNoYXBlSGVpZ2h0ID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5zaGFwZVJhZGl1cyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlUmFkaXVzO1xyXG4gICAgc2hhcGVSYWRpdXMgPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlUGFkZGluZyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlUGFkZGluZztcclxuICAgIHNoYXBlUGFkZGluZyA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxzID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxzO1xyXG4gICAgbGFiZWxzID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsQWxpZ24gPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbEFsaWduO1xyXG4gICAgaWYgKF8gPT0gXCJzdGFydFwiIHx8IF8gPT0gXCJlbmRcIiB8fCBfID09IFwibWlkZGxlXCIpIHtcclxuICAgICAgbGFiZWxBbGlnbiA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbEZvcm1hdCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsRm9ybWF0O1xyXG4gICAgbGFiZWxGb3JtYXQgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxPZmZzZXQgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbE9mZnNldDtcclxuICAgIGxhYmVsT2Zmc2V0ID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbERlbGltaXRlciA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsRGVsaW1pdGVyO1xyXG4gICAgbGFiZWxEZWxpbWl0ZXIgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQudXNlQ2xhc3MgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB1c2VDbGFzcztcclxuICAgIGlmIChfID09PSB0cnVlIHx8IF8gPT09IGZhbHNlKXtcclxuICAgICAgdXNlQ2xhc3MgPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQub3JpZW50ID0gZnVuY3Rpb24oXyl7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBvcmllbnQ7XHJcbiAgICBfID0gXy50b0xvd2VyQ2FzZSgpO1xyXG4gICAgaWYgKF8gPT0gXCJob3Jpem9udGFsXCIgfHwgXyA9PSBcInZlcnRpY2FsXCIpIHtcclxuICAgICAgb3JpZW50ID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmFzY2VuZGluZyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGFzY2VuZGluZztcclxuICAgIGFzY2VuZGluZyA9ICEhXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmNsYXNzUHJlZml4ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY2xhc3NQcmVmaXg7XHJcbiAgICBjbGFzc1ByZWZpeCA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC50aXRsZSA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHRpdGxlO1xyXG4gICAgdGl0bGUgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBkMy5yZWJpbmQobGVnZW5kLCBsZWdlbmREaXNwYXRjaGVyLCBcIm9uXCIpO1xyXG5cclxuICByZXR1cm4gbGVnZW5kO1xyXG5cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gIGQzX2lkZW50aXR5OiBmdW5jdGlvbiAoZCkge1xyXG4gICAgcmV0dXJuIGQ7XHJcbiAgfSxcclxuXHJcbiAgZDNfbWVyZ2VMYWJlbHM6IGZ1bmN0aW9uIChnZW4sIGxhYmVscykge1xyXG5cclxuICAgICAgaWYobGFiZWxzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGdlbjtcclxuXHJcbiAgICAgIGdlbiA9IChnZW4pID8gZ2VuIDogW107XHJcblxyXG4gICAgICB2YXIgaSA9IGxhYmVscy5sZW5ndGg7XHJcbiAgICAgIGZvciAoOyBpIDwgZ2VuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGFiZWxzLnB1c2goZ2VuW2ldKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbGFiZWxzO1xyXG4gICAgfSxcclxuXHJcbiAgZDNfbGluZWFyTGVnZW5kOiBmdW5jdGlvbiAoc2NhbGUsIGNlbGxzLCBsYWJlbEZvcm1hdCkge1xyXG4gICAgdmFyIGRhdGEgPSBbXTtcclxuXHJcbiAgICBpZiAoY2VsbHMubGVuZ3RoID4gMSl7XHJcbiAgICAgIGRhdGEgPSBjZWxscztcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgZG9tYWluID0gc2NhbGUuZG9tYWluKCksXHJcbiAgICAgIGluY3JlbWVudCA9IChkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdIC0gZG9tYWluWzBdKS8oY2VsbHMgLSAxKSxcclxuICAgICAgaSA9IDA7XHJcblxyXG4gICAgICBmb3IgKDsgaSA8IGNlbGxzOyBpKyspe1xyXG4gICAgICAgIGRhdGEucHVzaChkb21haW5bMF0gKyBpKmluY3JlbWVudCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgbGFiZWxzID0gZGF0YS5tYXAobGFiZWxGb3JtYXQpO1xyXG5cclxuICAgIHJldHVybiB7ZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgbGFiZWxzOiBsYWJlbHMsXHJcbiAgICAgICAgICAgIGZlYXR1cmU6IGZ1bmN0aW9uKGQpeyByZXR1cm4gc2NhbGUoZCk7IH19O1xyXG4gIH0sXHJcblxyXG4gIGQzX3F1YW50TGVnZW5kOiBmdW5jdGlvbiAoc2NhbGUsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlcikge1xyXG4gICAgdmFyIGxhYmVscyA9IHNjYWxlLnJhbmdlKCkubWFwKGZ1bmN0aW9uKGQpe1xyXG4gICAgICB2YXIgaW52ZXJ0ID0gc2NhbGUuaW52ZXJ0RXh0ZW50KGQpLFxyXG4gICAgICBhID0gbGFiZWxGb3JtYXQoaW52ZXJ0WzBdKSxcclxuICAgICAgYiA9IGxhYmVsRm9ybWF0KGludmVydFsxXSk7XHJcblxyXG4gICAgICAvLyBpZiAoKCAoYSkgJiYgKGEuaXNOYW4oKSkgJiYgYil7XHJcbiAgICAgIC8vICAgY29uc29sZS5sb2coXCJpbiBpbml0aWFsIHN0YXRlbWVudFwiKVxyXG4gICAgICAgIHJldHVybiBsYWJlbEZvcm1hdChpbnZlcnRbMF0pICsgXCIgXCIgKyBsYWJlbERlbGltaXRlciArIFwiIFwiICsgbGFiZWxGb3JtYXQoaW52ZXJ0WzFdKTtcclxuICAgICAgLy8gfSBlbHNlIGlmIChhIHx8IGIpIHtcclxuICAgICAgLy8gICBjb25zb2xlLmxvZygnaW4gZWxzZSBzdGF0ZW1lbnQnKVxyXG4gICAgICAvLyAgIHJldHVybiAoYSkgPyBhIDogYjtcclxuICAgICAgLy8gfVxyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7ZGF0YTogc2NhbGUucmFuZ2UoKSxcclxuICAgICAgICAgICAgbGFiZWxzOiBsYWJlbHMsXHJcbiAgICAgICAgICAgIGZlYXR1cmU6IHRoaXMuZDNfaWRlbnRpdHlcclxuICAgICAgICAgIH07XHJcbiAgfSxcclxuXHJcbiAgZDNfb3JkaW5hbExlZ2VuZDogZnVuY3Rpb24gKHNjYWxlKSB7XHJcbiAgICByZXR1cm4ge2RhdGE6IHNjYWxlLmRvbWFpbigpLFxyXG4gICAgICAgICAgICBsYWJlbHM6IHNjYWxlLmRvbWFpbigpLFxyXG4gICAgICAgICAgICBmZWF0dXJlOiBmdW5jdGlvbihkKXsgcmV0dXJuIHNjYWxlKGQpOyB9fTtcclxuICB9LFxyXG5cclxuICBkM19kcmF3U2hhcGVzOiBmdW5jdGlvbiAoc2hhcGUsIHNoYXBlcywgc2hhcGVIZWlnaHQsIHNoYXBlV2lkdGgsIHNoYXBlUmFkaXVzLCBwYXRoKSB7XHJcbiAgICBpZiAoc2hhcGUgPT09IFwicmVjdFwiKXtcclxuICAgICAgICBzaGFwZXMuYXR0cihcImhlaWdodFwiLCBzaGFwZUhlaWdodCkuYXR0cihcIndpZHRoXCIsIHNoYXBlV2lkdGgpO1xyXG5cclxuICAgIH0gZWxzZSBpZiAoc2hhcGUgPT09IFwiY2lyY2xlXCIpIHtcclxuICAgICAgICBzaGFwZXMuYXR0cihcInJcIiwgc2hhcGVSYWRpdXMpLy8uYXR0cihcImN4XCIsIHNoYXBlUmFkaXVzKS5hdHRyKFwiY3lcIiwgc2hhcGVSYWRpdXMpO1xyXG5cclxuICAgIH0gZWxzZSBpZiAoc2hhcGUgPT09IFwibGluZVwiKSB7XHJcbiAgICAgICAgc2hhcGVzLmF0dHIoXCJ4MVwiLCAwKS5hdHRyKFwieDJcIiwgc2hhcGVXaWR0aCkuYXR0cihcInkxXCIsIDApLmF0dHIoXCJ5MlwiLCAwKTtcclxuXHJcbiAgICB9IGVsc2UgaWYgKHNoYXBlID09PSBcInBhdGhcIikge1xyXG4gICAgICBzaGFwZXMuYXR0cihcImRcIiwgcGF0aCk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZDNfYWRkVGV4dDogZnVuY3Rpb24gKHN2ZywgZW50ZXIsIGxhYmVscywgY2xhc3NQcmVmaXgpe1xyXG4gICAgZW50ZXIuYXBwZW5kKFwidGV4dFwiKS5hdHRyKFwiY2xhc3NcIiwgY2xhc3NQcmVmaXggKyBcImxhYmVsXCIpO1xyXG4gICAgc3ZnLnNlbGVjdEFsbChcImcuXCIgKyBjbGFzc1ByZWZpeCArIFwiY2VsbCB0ZXh0XCIpLmRhdGEobGFiZWxzKS50ZXh0KHRoaXMuZDNfaWRlbnRpdHkpO1xyXG4gIH0sXHJcblxyXG4gIGQzX2NhbGNUeXBlOiBmdW5jdGlvbiAoc2NhbGUsIGFzY2VuZGluZywgY2VsbHMsIGxhYmVscywgbGFiZWxGb3JtYXQsIGxhYmVsRGVsaW1pdGVyKXtcclxuICAgIHZhciB0eXBlID0gc2NhbGUudGlja3MgP1xyXG4gICAgICAgICAgICB0aGlzLmQzX2xpbmVhckxlZ2VuZChzY2FsZSwgY2VsbHMsIGxhYmVsRm9ybWF0KSA6IHNjYWxlLmludmVydEV4dGVudCA/XHJcbiAgICAgICAgICAgIHRoaXMuZDNfcXVhbnRMZWdlbmQoc2NhbGUsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlcikgOiB0aGlzLmQzX29yZGluYWxMZWdlbmQoc2NhbGUpO1xyXG5cclxuICAgIHR5cGUubGFiZWxzID0gdGhpcy5kM19tZXJnZUxhYmVscyh0eXBlLmxhYmVscywgbGFiZWxzKTtcclxuXHJcbiAgICBpZiAoYXNjZW5kaW5nKSB7XHJcbiAgICAgIHR5cGUubGFiZWxzID0gdGhpcy5kM19yZXZlcnNlKHR5cGUubGFiZWxzKTtcclxuICAgICAgdHlwZS5kYXRhID0gdGhpcy5kM19yZXZlcnNlKHR5cGUuZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHR5cGU7XHJcbiAgfSxcclxuXHJcbiAgZDNfcmV2ZXJzZTogZnVuY3Rpb24oYXJyKSB7XHJcbiAgICB2YXIgbWlycm9yID0gW107XHJcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGFyci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgbWlycm9yW2ldID0gYXJyW2wtaS0xXTtcclxuICAgIH1cclxuICAgIHJldHVybiBtaXJyb3I7XHJcbiAgfSxcclxuXHJcbiAgZDNfcGxhY2VtZW50OiBmdW5jdGlvbiAob3JpZW50LCBjZWxsLCBjZWxsVHJhbnMsIHRleHQsIHRleHRUcmFucywgbGFiZWxBbGlnbikge1xyXG4gICAgY2VsbC5hdHRyKFwidHJhbnNmb3JtXCIsIGNlbGxUcmFucyk7XHJcbiAgICB0ZXh0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgdGV4dFRyYW5zKTtcclxuICAgIGlmIChvcmllbnQgPT09IFwiaG9yaXpvbnRhbFwiKXtcclxuICAgICAgdGV4dC5zdHlsZShcInRleHQtYW5jaG9yXCIsIGxhYmVsQWxpZ24pO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGQzX2FkZEV2ZW50czogZnVuY3Rpb24oY2VsbHMsIGRpc3BhdGNoZXIpe1xyXG4gICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgY2VsbHMub24oXCJtb3VzZW92ZXIubGVnZW5kXCIsIGZ1bmN0aW9uIChkKSB7IF8uZDNfY2VsbE92ZXIoZGlzcGF0Y2hlciwgZCwgdGhpcyk7IH0pXHJcbiAgICAgICAgICAub24oXCJtb3VzZW91dC5sZWdlbmRcIiwgZnVuY3Rpb24gKGQpIHsgXy5kM19jZWxsT3V0KGRpc3BhdGNoZXIsIGQsIHRoaXMpOyB9KVxyXG4gICAgICAgICAgLm9uKFwiY2xpY2subGVnZW5kXCIsIGZ1bmN0aW9uIChkKSB7IF8uZDNfY2VsbENsaWNrKGRpc3BhdGNoZXIsIGQsIHRoaXMpOyB9KTtcclxuICB9LFxyXG5cclxuICBkM19jZWxsT3ZlcjogZnVuY3Rpb24oY2VsbERpc3BhdGNoZXIsIGQsIG9iail7XHJcbiAgICBjZWxsRGlzcGF0Y2hlci5jZWxsb3Zlci5jYWxsKG9iaiwgZCk7XHJcbiAgfSxcclxuXHJcbiAgZDNfY2VsbE91dDogZnVuY3Rpb24oY2VsbERpc3BhdGNoZXIsIGQsIG9iail7XHJcbiAgICBjZWxsRGlzcGF0Y2hlci5jZWxsb3V0LmNhbGwob2JqLCBkKTtcclxuICB9LFxyXG5cclxuICBkM19jZWxsQ2xpY2s6IGZ1bmN0aW9uKGNlbGxEaXNwYXRjaGVyLCBkLCBvYmope1xyXG4gICAgY2VsbERpc3BhdGNoZXIuY2VsbGNsaWNrLmNhbGwob2JqLCBkKTtcclxuICB9LFxyXG5cclxuICBkM190aXRsZTogZnVuY3Rpb24oc3ZnLCBjZWxsc1N2ZywgdGl0bGUsIGNsYXNzUHJlZml4KXtcclxuICAgIGlmICh0aXRsZSAhPT0gXCJcIil7XHJcblxyXG4gICAgICB2YXIgdGl0bGVUZXh0ID0gc3ZnLnNlbGVjdEFsbCgndGV4dC4nICsgY2xhc3NQcmVmaXggKyAnbGVnZW5kVGl0bGUnKTtcclxuXHJcbiAgICAgIHRpdGxlVGV4dC5kYXRhKFt0aXRsZV0pXHJcbiAgICAgICAgLmVudGVyKClcclxuICAgICAgICAuYXBwZW5kKCd0ZXh0JylcclxuICAgICAgICAuYXR0cignY2xhc3MnLCBjbGFzc1ByZWZpeCArICdsZWdlbmRUaXRsZScpO1xyXG5cclxuICAgICAgICBzdmcuc2VsZWN0QWxsKCd0ZXh0LicgKyBjbGFzc1ByZWZpeCArICdsZWdlbmRUaXRsZScpXHJcbiAgICAgICAgICAgIC50ZXh0KHRpdGxlKVxyXG5cclxuICAgICAgdmFyIHlPZmZzZXQgPSBzdmcuc2VsZWN0KCcuJyArIGNsYXNzUHJlZml4ICsgJ2xlZ2VuZFRpdGxlJylcclxuICAgICAgICAgIC5tYXAoZnVuY3Rpb24oZCkgeyByZXR1cm4gZFswXS5nZXRCQm94KCkuaGVpZ2h0fSlbMF0sXHJcbiAgICAgIHhPZmZzZXQgPSAtY2VsbHNTdmcubWFwKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRbMF0uZ2V0QkJveCgpLnh9KVswXTtcclxuXHJcbiAgICAgIGNlbGxzU3ZnLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIHhPZmZzZXQgKyAnLCcgKyAoeU9mZnNldCArIDEwKSArICcpJyk7XHJcblxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJ2YXIgaGVscGVyID0gcmVxdWlyZSgnLi9sZWdlbmQnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gIGZ1bmN0aW9uKCl7XHJcblxyXG4gIHZhciBzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLFxyXG4gICAgc2hhcGUgPSBcInJlY3RcIixcclxuICAgIHNoYXBlV2lkdGggPSAxNSxcclxuICAgIHNoYXBlUGFkZGluZyA9IDIsXHJcbiAgICBjZWxscyA9IFs1XSxcclxuICAgIGxhYmVscyA9IFtdLFxyXG4gICAgdXNlU3Ryb2tlID0gZmFsc2UsXHJcbiAgICBjbGFzc1ByZWZpeCA9IFwiXCIsXHJcbiAgICB0aXRsZSA9IFwiXCIsXHJcbiAgICBsYWJlbEZvcm1hdCA9IGQzLmZvcm1hdChcIi4wMWZcIiksXHJcbiAgICBsYWJlbE9mZnNldCA9IDEwLFxyXG4gICAgbGFiZWxBbGlnbiA9IFwibWlkZGxlXCIsXHJcbiAgICBsYWJlbERlbGltaXRlciA9IFwidG9cIixcclxuICAgIG9yaWVudCA9IFwidmVydGljYWxcIixcclxuICAgIGFzY2VuZGluZyA9IGZhbHNlLFxyXG4gICAgcGF0aCxcclxuICAgIGxlZ2VuZERpc3BhdGNoZXIgPSBkMy5kaXNwYXRjaChcImNlbGxvdmVyXCIsIFwiY2VsbG91dFwiLCBcImNlbGxjbGlja1wiKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsZWdlbmQoc3ZnKXtcclxuXHJcbiAgICAgIHZhciB0eXBlID0gaGVscGVyLmQzX2NhbGNUeXBlKHNjYWxlLCBhc2NlbmRpbmcsIGNlbGxzLCBsYWJlbHMsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlciksXHJcbiAgICAgICAgbGVnZW5kRyA9IHN2Zy5zZWxlY3RBbGwoJ2cnKS5kYXRhKFtzY2FsZV0pO1xyXG5cclxuICAgICAgbGVnZW5kRy5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgY2xhc3NQcmVmaXggKyAnbGVnZW5kQ2VsbHMnKTtcclxuXHJcblxyXG4gICAgICB2YXIgY2VsbCA9IGxlZ2VuZEcuc2VsZWN0QWxsKFwiLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGxcIikuZGF0YSh0eXBlLmRhdGEpLFxyXG4gICAgICAgIGNlbGxFbnRlciA9IGNlbGwuZW50ZXIoKS5hcHBlbmQoXCJnXCIsIFwiLmNlbGxcIikuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJjZWxsXCIpLnN0eWxlKFwib3BhY2l0eVwiLCAxZS02KSxcclxuICAgICAgICBzaGFwZUVudGVyID0gY2VsbEVudGVyLmFwcGVuZChzaGFwZSkuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJzd2F0Y2hcIiksXHJcbiAgICAgICAgc2hhcGVzID0gY2VsbC5zZWxlY3QoXCJnLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGwgXCIgKyBzaGFwZSk7XHJcblxyXG4gICAgICAvL2FkZCBldmVudCBoYW5kbGVyc1xyXG4gICAgICBoZWxwZXIuZDNfYWRkRXZlbnRzKGNlbGxFbnRlciwgbGVnZW5kRGlzcGF0Y2hlcik7XHJcblxyXG4gICAgICBjZWxsLmV4aXQoKS50cmFuc2l0aW9uKCkuc3R5bGUoXCJvcGFjaXR5XCIsIDApLnJlbW92ZSgpO1xyXG5cclxuICAgICAgLy9jcmVhdGVzIHNoYXBlXHJcbiAgICAgIGlmIChzaGFwZSA9PT0gXCJsaW5lXCIpe1xyXG4gICAgICAgIGhlbHBlci5kM19kcmF3U2hhcGVzKHNoYXBlLCBzaGFwZXMsIDAsIHNoYXBlV2lkdGgpO1xyXG4gICAgICAgIHNoYXBlcy5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIHR5cGUuZmVhdHVyZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaGVscGVyLmQzX2RyYXdTaGFwZXMoc2hhcGUsIHNoYXBlcywgdHlwZS5mZWF0dXJlLCB0eXBlLmZlYXR1cmUsIHR5cGUuZmVhdHVyZSwgcGF0aCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGhlbHBlci5kM19hZGRUZXh0KGxlZ2VuZEcsIGNlbGxFbnRlciwgdHlwZS5sYWJlbHMsIGNsYXNzUHJlZml4KVxyXG5cclxuICAgICAgLy9zZXRzIHBsYWNlbWVudFxyXG4gICAgICB2YXIgdGV4dCA9IGNlbGwuc2VsZWN0KFwidGV4dFwiKSxcclxuICAgICAgICBzaGFwZVNpemUgPSBzaGFwZXNbMF0ubWFwKFxyXG4gICAgICAgICAgZnVuY3Rpb24oZCwgaSl7XHJcbiAgICAgICAgICAgIHZhciBiYm94ID0gZC5nZXRCQm94KClcclxuICAgICAgICAgICAgdmFyIHN0cm9rZSA9IHNjYWxlKHR5cGUuZGF0YVtpXSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2hhcGUgPT09IFwibGluZVwiICYmIG9yaWVudCA9PT0gXCJob3Jpem9udGFsXCIpIHtcclxuICAgICAgICAgICAgICBiYm94LmhlaWdodCA9IGJib3guaGVpZ2h0ICsgc3Ryb2tlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNoYXBlID09PSBcImxpbmVcIiAmJiBvcmllbnQgPT09IFwidmVydGljYWxcIil7XHJcbiAgICAgICAgICAgICAgYmJveC53aWR0aCA9IGJib3gud2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBiYm94O1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgdmFyIG1heEggPSBkMy5tYXgoc2hhcGVTaXplLCBmdW5jdGlvbihkKXsgcmV0dXJuIGQuaGVpZ2h0ICsgZC55OyB9KSxcclxuICAgICAgbWF4VyA9IGQzLm1heChzaGFwZVNpemUsIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC53aWR0aCArIGQueDsgfSk7XHJcblxyXG4gICAgICB2YXIgY2VsbFRyYW5zLFxyXG4gICAgICB0ZXh0VHJhbnMsXHJcbiAgICAgIHRleHRBbGlnbiA9IChsYWJlbEFsaWduID09IFwic3RhcnRcIikgPyAwIDogKGxhYmVsQWxpZ24gPT0gXCJtaWRkbGVcIikgPyAwLjUgOiAxO1xyXG5cclxuICAgICAgLy9wb3NpdGlvbnMgY2VsbHMgYW5kIHRleHRcclxuICAgICAgaWYgKG9yaWVudCA9PT0gXCJ2ZXJ0aWNhbFwiKXtcclxuXHJcbiAgICAgICAgY2VsbFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSBkMy5zdW0oc2hhcGVTaXplLnNsaWNlKDAsIGkgKyAxICksIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC5oZWlnaHQ7IH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoMCwgXCIgKyAoaGVpZ2h0ICsgaSpzaGFwZVBhZGRpbmcpICsgXCIpXCI7IH07XHJcblxyXG4gICAgICAgIHRleHRUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAobWF4VyArIGxhYmVsT2Zmc2V0KSArIFwiLFwiICtcclxuICAgICAgICAgIChzaGFwZVNpemVbaV0ueSArIHNoYXBlU2l6ZVtpXS5oZWlnaHQvMiArIDUpICsgXCIpXCI7IH07XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKG9yaWVudCA9PT0gXCJob3Jpem9udGFsXCIpe1xyXG4gICAgICAgIGNlbGxUcmFucyA9IGZ1bmN0aW9uKGQsaSkge1xyXG4gICAgICAgICAgICB2YXIgd2lkdGggPSBkMy5zdW0oc2hhcGVTaXplLnNsaWNlKDAsIGkgKyAxICksIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC53aWR0aDsgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArICh3aWR0aCArIGkqc2hhcGVQYWRkaW5nKSArIFwiLDApXCI7IH07XHJcblxyXG4gICAgICAgIHRleHRUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAoc2hhcGVTaXplW2ldLndpZHRoKnRleHRBbGlnbiAgKyBzaGFwZVNpemVbaV0ueCkgKyBcIixcIiArXHJcbiAgICAgICAgICAgICAgKG1heEggKyBsYWJlbE9mZnNldCApICsgXCIpXCI7IH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGhlbHBlci5kM19wbGFjZW1lbnQob3JpZW50LCBjZWxsLCBjZWxsVHJhbnMsIHRleHQsIHRleHRUcmFucywgbGFiZWxBbGlnbik7XHJcbiAgICAgIGhlbHBlci5kM190aXRsZShzdmcsIGxlZ2VuZEcsIHRpdGxlLCBjbGFzc1ByZWZpeCk7XHJcblxyXG4gICAgICBjZWxsLnRyYW5zaXRpb24oKS5zdHlsZShcIm9wYWNpdHlcIiwgMSk7XHJcblxyXG4gICAgfVxyXG5cclxuICBsZWdlbmQuc2NhbGUgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzY2FsZTtcclxuICAgIHNjYWxlID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmNlbGxzID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY2VsbHM7XHJcbiAgICBpZiAoXy5sZW5ndGggPiAxIHx8IF8gPj0gMiApe1xyXG4gICAgICBjZWxscyA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG5cclxuICBsZWdlbmQuc2hhcGUgPSBmdW5jdGlvbihfLCBkKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZTtcclxuICAgIGlmIChfID09IFwicmVjdFwiIHx8IF8gPT0gXCJjaXJjbGVcIiB8fCBfID09IFwibGluZVwiICl7XHJcbiAgICAgIHNoYXBlID0gXztcclxuICAgICAgcGF0aCA9IGQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5zaGFwZVdpZHRoID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGVXaWR0aDtcclxuICAgIHNoYXBlV2lkdGggPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlUGFkZGluZyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlUGFkZGluZztcclxuICAgIHNoYXBlUGFkZGluZyA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxzID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxzO1xyXG4gICAgbGFiZWxzID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsQWxpZ24gPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbEFsaWduO1xyXG4gICAgaWYgKF8gPT0gXCJzdGFydFwiIHx8IF8gPT0gXCJlbmRcIiB8fCBfID09IFwibWlkZGxlXCIpIHtcclxuICAgICAgbGFiZWxBbGlnbiA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbEZvcm1hdCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsRm9ybWF0O1xyXG4gICAgbGFiZWxGb3JtYXQgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxPZmZzZXQgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbE9mZnNldDtcclxuICAgIGxhYmVsT2Zmc2V0ID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbERlbGltaXRlciA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsRGVsaW1pdGVyO1xyXG4gICAgbGFiZWxEZWxpbWl0ZXIgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQub3JpZW50ID0gZnVuY3Rpb24oXyl7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBvcmllbnQ7XHJcbiAgICBfID0gXy50b0xvd2VyQ2FzZSgpO1xyXG4gICAgaWYgKF8gPT0gXCJob3Jpem9udGFsXCIgfHwgXyA9PSBcInZlcnRpY2FsXCIpIHtcclxuICAgICAgb3JpZW50ID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmFzY2VuZGluZyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGFzY2VuZGluZztcclxuICAgIGFzY2VuZGluZyA9ICEhXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmNsYXNzUHJlZml4ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY2xhc3NQcmVmaXg7XHJcbiAgICBjbGFzc1ByZWZpeCA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC50aXRsZSA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHRpdGxlO1xyXG4gICAgdGl0bGUgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBkMy5yZWJpbmQobGVnZW5kLCBsZWdlbmREaXNwYXRjaGVyLCBcIm9uXCIpO1xyXG5cclxuICByZXR1cm4gbGVnZW5kO1xyXG5cclxufTtcclxuIiwidmFyIGhlbHBlciA9IHJlcXVpcmUoJy4vbGVnZW5kJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XHJcblxyXG4gIHZhciBzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLFxyXG4gICAgc2hhcGUgPSBcInBhdGhcIixcclxuICAgIHNoYXBlV2lkdGggPSAxNSxcclxuICAgIHNoYXBlSGVpZ2h0ID0gMTUsXHJcbiAgICBzaGFwZVJhZGl1cyA9IDEwLFxyXG4gICAgc2hhcGVQYWRkaW5nID0gNSxcclxuICAgIGNlbGxzID0gWzVdLFxyXG4gICAgbGFiZWxzID0gW10sXHJcbiAgICBjbGFzc1ByZWZpeCA9IFwiXCIsXHJcbiAgICB1c2VDbGFzcyA9IGZhbHNlLFxyXG4gICAgdGl0bGUgPSBcIlwiLFxyXG4gICAgbGFiZWxGb3JtYXQgPSBkMy5mb3JtYXQoXCIuMDFmXCIpLFxyXG4gICAgbGFiZWxBbGlnbiA9IFwibWlkZGxlXCIsXHJcbiAgICBsYWJlbE9mZnNldCA9IDEwLFxyXG4gICAgbGFiZWxEZWxpbWl0ZXIgPSBcInRvXCIsXHJcbiAgICBvcmllbnQgPSBcInZlcnRpY2FsXCIsXHJcbiAgICBhc2NlbmRpbmcgPSBmYWxzZSxcclxuICAgIGxlZ2VuZERpc3BhdGNoZXIgPSBkMy5kaXNwYXRjaChcImNlbGxvdmVyXCIsIFwiY2VsbG91dFwiLCBcImNlbGxjbGlja1wiKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsZWdlbmQoc3ZnKXtcclxuXHJcbiAgICAgIHZhciB0eXBlID0gaGVscGVyLmQzX2NhbGNUeXBlKHNjYWxlLCBhc2NlbmRpbmcsIGNlbGxzLCBsYWJlbHMsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlciksXHJcbiAgICAgICAgbGVnZW5kRyA9IHN2Zy5zZWxlY3RBbGwoJ2cnKS5kYXRhKFtzY2FsZV0pO1xyXG5cclxuICAgICAgbGVnZW5kRy5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgY2xhc3NQcmVmaXggKyAnbGVnZW5kQ2VsbHMnKTtcclxuXHJcbiAgICAgIHZhciBjZWxsID0gbGVnZW5kRy5zZWxlY3RBbGwoXCIuXCIgKyBjbGFzc1ByZWZpeCArIFwiY2VsbFwiKS5kYXRhKHR5cGUuZGF0YSksXHJcbiAgICAgICAgY2VsbEVudGVyID0gY2VsbC5lbnRlcigpLmFwcGVuZChcImdcIiwgXCIuY2VsbFwiKS5hdHRyKFwiY2xhc3NcIiwgY2xhc3NQcmVmaXggKyBcImNlbGxcIikuc3R5bGUoXCJvcGFjaXR5XCIsIDFlLTYpLFxyXG4gICAgICAgIHNoYXBlRW50ZXIgPSBjZWxsRW50ZXIuYXBwZW5kKHNoYXBlKS5hdHRyKFwiY2xhc3NcIiwgY2xhc3NQcmVmaXggKyBcInN3YXRjaFwiKSxcclxuICAgICAgICBzaGFwZXMgPSBjZWxsLnNlbGVjdChcImcuXCIgKyBjbGFzc1ByZWZpeCArIFwiY2VsbCBcIiArIHNoYXBlKTtcclxuXHJcbiAgICAgIC8vYWRkIGV2ZW50IGhhbmRsZXJzXHJcbiAgICAgIGhlbHBlci5kM19hZGRFdmVudHMoY2VsbEVudGVyLCBsZWdlbmREaXNwYXRjaGVyKTtcclxuXHJcbiAgICAgIC8vcmVtb3ZlIG9sZCBzaGFwZXNcclxuICAgICAgY2VsbC5leGl0KCkudHJhbnNpdGlvbigpLnN0eWxlKFwib3BhY2l0eVwiLCAwKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgIGhlbHBlci5kM19kcmF3U2hhcGVzKHNoYXBlLCBzaGFwZXMsIHNoYXBlSGVpZ2h0LCBzaGFwZVdpZHRoLCBzaGFwZVJhZGl1cywgdHlwZS5mZWF0dXJlKTtcclxuICAgICAgaGVscGVyLmQzX2FkZFRleHQobGVnZW5kRywgY2VsbEVudGVyLCB0eXBlLmxhYmVscywgY2xhc3NQcmVmaXgpXHJcblxyXG4gICAgICAvLyBzZXRzIHBsYWNlbWVudFxyXG4gICAgICB2YXIgdGV4dCA9IGNlbGwuc2VsZWN0KFwidGV4dFwiKSxcclxuICAgICAgICBzaGFwZVNpemUgPSBzaGFwZXNbMF0ubWFwKCBmdW5jdGlvbihkKXsgcmV0dXJuIGQuZ2V0QkJveCgpOyB9KTtcclxuXHJcbiAgICAgIHZhciBtYXhIID0gZDMubWF4KHNoYXBlU2l6ZSwgZnVuY3Rpb24oZCl7IHJldHVybiBkLmhlaWdodDsgfSksXHJcbiAgICAgIG1heFcgPSBkMy5tYXgoc2hhcGVTaXplLCBmdW5jdGlvbihkKXsgcmV0dXJuIGQud2lkdGg7IH0pO1xyXG5cclxuICAgICAgdmFyIGNlbGxUcmFucyxcclxuICAgICAgdGV4dFRyYW5zLFxyXG4gICAgICB0ZXh0QWxpZ24gPSAobGFiZWxBbGlnbiA9PSBcInN0YXJ0XCIpID8gMCA6IChsYWJlbEFsaWduID09IFwibWlkZGxlXCIpID8gMC41IDogMTtcclxuXHJcbiAgICAgIC8vcG9zaXRpb25zIGNlbGxzIGFuZCB0ZXh0XHJcbiAgICAgIGlmIChvcmllbnQgPT09IFwidmVydGljYWxcIil7XHJcbiAgICAgICAgY2VsbFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZSgwLCBcIiArIChpICogKG1heEggKyBzaGFwZVBhZGRpbmcpKSArIFwiKVwiOyB9O1xyXG4gICAgICAgIHRleHRUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAobWF4VyArIGxhYmVsT2Zmc2V0KSArIFwiLFwiICtcclxuICAgICAgICAgICAgICAoc2hhcGVTaXplW2ldLnkgKyBzaGFwZVNpemVbaV0uaGVpZ2h0LzIgKyA1KSArIFwiKVwiOyB9O1xyXG5cclxuICAgICAgfSBlbHNlIGlmIChvcmllbnQgPT09IFwiaG9yaXpvbnRhbFwiKXtcclxuICAgICAgICBjZWxsVHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKGkgKiAobWF4VyArIHNoYXBlUGFkZGluZykpICsgXCIsMClcIjsgfTtcclxuICAgICAgICB0ZXh0VHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKHNoYXBlU2l6ZVtpXS53aWR0aCp0ZXh0QWxpZ24gICsgc2hhcGVTaXplW2ldLngpICsgXCIsXCIgK1xyXG4gICAgICAgICAgICAgIChtYXhIICsgbGFiZWxPZmZzZXQgKSArIFwiKVwiOyB9O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBoZWxwZXIuZDNfcGxhY2VtZW50KG9yaWVudCwgY2VsbCwgY2VsbFRyYW5zLCB0ZXh0LCB0ZXh0VHJhbnMsIGxhYmVsQWxpZ24pO1xyXG4gICAgICBoZWxwZXIuZDNfdGl0bGUoc3ZnLCBsZWdlbmRHLCB0aXRsZSwgY2xhc3NQcmVmaXgpO1xyXG4gICAgICBjZWxsLnRyYW5zaXRpb24oKS5zdHlsZShcIm9wYWNpdHlcIiwgMSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgbGVnZW5kLnNjYWxlID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2NhbGU7XHJcbiAgICBzY2FsZSA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5jZWxscyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGNlbGxzO1xyXG4gICAgaWYgKF8ubGVuZ3RoID4gMSB8fCBfID49IDIgKXtcclxuICAgICAgY2VsbHMgPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuc2hhcGVQYWRkaW5nID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGVQYWRkaW5nO1xyXG4gICAgc2hhcGVQYWRkaW5nID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbHMgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbHM7XHJcbiAgICBsYWJlbHMgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxBbGlnbiA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsQWxpZ247XHJcbiAgICBpZiAoXyA9PSBcInN0YXJ0XCIgfHwgXyA9PSBcImVuZFwiIHx8IF8gPT0gXCJtaWRkbGVcIikge1xyXG4gICAgICBsYWJlbEFsaWduID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsRm9ybWF0ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxGb3JtYXQ7XHJcbiAgICBsYWJlbEZvcm1hdCA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbE9mZnNldCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsT2Zmc2V0O1xyXG4gICAgbGFiZWxPZmZzZXQgPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsRGVsaW1pdGVyID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxEZWxpbWl0ZXI7XHJcbiAgICBsYWJlbERlbGltaXRlciA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5vcmllbnQgPSBmdW5jdGlvbihfKXtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIG9yaWVudDtcclxuICAgIF8gPSBfLnRvTG93ZXJDYXNlKCk7XHJcbiAgICBpZiAoXyA9PSBcImhvcml6b250YWxcIiB8fCBfID09IFwidmVydGljYWxcIikge1xyXG4gICAgICBvcmllbnQgPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuYXNjZW5kaW5nID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gYXNjZW5kaW5nO1xyXG4gICAgYXNjZW5kaW5nID0gISFfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuY2xhc3NQcmVmaXggPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBjbGFzc1ByZWZpeDtcclxuICAgIGNsYXNzUHJlZml4ID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnRpdGxlID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdGl0bGU7XHJcbiAgICB0aXRsZSA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGQzLnJlYmluZChsZWdlbmQsIGxlZ2VuZERpc3BhdGNoZXIsIFwib25cIik7XHJcblxyXG4gIHJldHVybiBsZWdlbmQ7XHJcblxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG4vKipcclxuICogKipbR2F1c3NpYW4gZXJyb3IgZnVuY3Rpb25dKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRXJyb3JfZnVuY3Rpb24pKipcclxuICpcclxuICogVGhlIGBlcnJvckZ1bmN0aW9uKHgvKHNkICogTWF0aC5zcXJ0KDIpKSlgIGlzIHRoZSBwcm9iYWJpbGl0eSB0aGF0IGEgdmFsdWUgaW4gYVxyXG4gKiBub3JtYWwgZGlzdHJpYnV0aW9uIHdpdGggc3RhbmRhcmQgZGV2aWF0aW9uIHNkIGlzIHdpdGhpbiB4IG9mIHRoZSBtZWFuLlxyXG4gKlxyXG4gKiBUaGlzIGZ1bmN0aW9uIHJldHVybnMgYSBudW1lcmljYWwgYXBwcm94aW1hdGlvbiB0byB0aGUgZXhhY3QgdmFsdWUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4IGlucHV0XHJcbiAqIEByZXR1cm4ge251bWJlcn0gZXJyb3IgZXN0aW1hdGlvblxyXG4gKiBAZXhhbXBsZVxyXG4gKiBlcnJvckZ1bmN0aW9uKDEpOyAvLz0gMC44NDI3XHJcbiAqL1xyXG5mdW5jdGlvbiBlcnJvckZ1bmN0aW9uKHgvKjogbnVtYmVyICovKS8qOiBudW1iZXIgKi8ge1xyXG4gICAgdmFyIHQgPSAxIC8gKDEgKyAwLjUgKiBNYXRoLmFicyh4KSk7XHJcbiAgICB2YXIgdGF1ID0gdCAqIE1hdGguZXhwKC1NYXRoLnBvdyh4LCAyKSAtXHJcbiAgICAgICAgMS4yNjU1MTIyMyArXHJcbiAgICAgICAgMS4wMDAwMjM2OCAqIHQgK1xyXG4gICAgICAgIDAuMzc0MDkxOTYgKiBNYXRoLnBvdyh0LCAyKSArXHJcbiAgICAgICAgMC4wOTY3ODQxOCAqIE1hdGgucG93KHQsIDMpIC1cclxuICAgICAgICAwLjE4NjI4ODA2ICogTWF0aC5wb3codCwgNCkgK1xyXG4gICAgICAgIDAuMjc4ODY4MDcgKiBNYXRoLnBvdyh0LCA1KSAtXHJcbiAgICAgICAgMS4xMzUyMDM5OCAqIE1hdGgucG93KHQsIDYpICtcclxuICAgICAgICAxLjQ4ODUxNTg3ICogTWF0aC5wb3codCwgNykgLVxyXG4gICAgICAgIDAuODIyMTUyMjMgKiBNYXRoLnBvdyh0LCA4KSArXHJcbiAgICAgICAgMC4xNzA4NzI3NyAqIE1hdGgucG93KHQsIDkpKTtcclxuICAgIGlmICh4ID49IDApIHtcclxuICAgICAgICByZXR1cm4gMSAtIHRhdTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRhdSAtIDE7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZXJyb3JGdW5jdGlvbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxuLyoqXHJcbiAqIFtTaW1wbGUgbGluZWFyIHJlZ3Jlc3Npb25dKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvU2ltcGxlX2xpbmVhcl9yZWdyZXNzaW9uKVxyXG4gKiBpcyBhIHNpbXBsZSB3YXkgdG8gZmluZCBhIGZpdHRlZCBsaW5lXHJcbiAqIGJldHdlZW4gYSBzZXQgb2YgY29vcmRpbmF0ZXMuIFRoaXMgYWxnb3JpdGhtIGZpbmRzIHRoZSBzbG9wZSBhbmQgeS1pbnRlcmNlcHQgb2YgYSByZWdyZXNzaW9uIGxpbmVcclxuICogdXNpbmcgdGhlIGxlYXN0IHN1bSBvZiBzcXVhcmVzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PEFycmF5PG51bWJlcj4+fSBkYXRhIGFuIGFycmF5IG9mIHR3by1lbGVtZW50IG9mIGFycmF5cyxcclxuICogbGlrZSBgW1swLCAxXSwgWzIsIDNdXWBcclxuICogQHJldHVybnMge09iamVjdH0gb2JqZWN0IGNvbnRhaW5pbmcgc2xvcGUgYW5kIGludGVyc2VjdCBvZiByZWdyZXNzaW9uIGxpbmVcclxuICogQGV4YW1wbGVcclxuICogbGluZWFyUmVncmVzc2lvbihbWzAsIDBdLCBbMSwgMV1dKTsgLy8geyBtOiAxLCBiOiAwIH1cclxuICovXHJcbmZ1bmN0aW9uIGxpbmVhclJlZ3Jlc3Npb24oZGF0YS8qOiBBcnJheTxBcnJheTxudW1iZXI+PiAqLykvKjogeyBtOiBudW1iZXIsIGI6IG51bWJlciB9ICovIHtcclxuXHJcbiAgICB2YXIgbSwgYjtcclxuXHJcbiAgICAvLyBTdG9yZSBkYXRhIGxlbmd0aCBpbiBhIGxvY2FsIHZhcmlhYmxlIHRvIHJlZHVjZVxyXG4gICAgLy8gcmVwZWF0ZWQgb2JqZWN0IHByb3BlcnR5IGxvb2t1cHNcclxuICAgIHZhciBkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGg7XHJcblxyXG4gICAgLy9pZiB0aGVyZSdzIG9ubHkgb25lIHBvaW50LCBhcmJpdHJhcmlseSBjaG9vc2UgYSBzbG9wZSBvZiAwXHJcbiAgICAvL2FuZCBhIHktaW50ZXJjZXB0IG9mIHdoYXRldmVyIHRoZSB5IG9mIHRoZSBpbml0aWFsIHBvaW50IGlzXHJcbiAgICBpZiAoZGF0YUxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIG0gPSAwO1xyXG4gICAgICAgIGIgPSBkYXRhWzBdWzFdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBJbml0aWFsaXplIG91ciBzdW1zIGFuZCBzY29wZSB0aGUgYG1gIGFuZCBgYmBcclxuICAgICAgICAvLyB2YXJpYWJsZXMgdGhhdCBkZWZpbmUgdGhlIGxpbmUuXHJcbiAgICAgICAgdmFyIHN1bVggPSAwLCBzdW1ZID0gMCxcclxuICAgICAgICAgICAgc3VtWFggPSAwLCBzdW1YWSA9IDA7XHJcblxyXG4gICAgICAgIC8vIFVzZSBsb2NhbCB2YXJpYWJsZXMgdG8gZ3JhYiBwb2ludCB2YWx1ZXNcclxuICAgICAgICAvLyB3aXRoIG1pbmltYWwgb2JqZWN0IHByb3BlcnR5IGxvb2t1cHNcclxuICAgICAgICB2YXIgcG9pbnQsIHgsIHk7XHJcblxyXG4gICAgICAgIC8vIEdhdGhlciB0aGUgc3VtIG9mIGFsbCB4IHZhbHVlcywgdGhlIHN1bSBvZiBhbGxcclxuICAgICAgICAvLyB5IHZhbHVlcywgYW5kIHRoZSBzdW0gb2YgeF4yIGFuZCAoeCp5KSBmb3IgZWFjaFxyXG4gICAgICAgIC8vIHZhbHVlLlxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gSW4gbWF0aCBub3RhdGlvbiwgdGhlc2Ugd291bGQgYmUgU1NfeCwgU1NfeSwgU1NfeHgsIGFuZCBTU194eVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YUxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHBvaW50ID0gZGF0YVtpXTtcclxuICAgICAgICAgICAgeCA9IHBvaW50WzBdO1xyXG4gICAgICAgICAgICB5ID0gcG9pbnRbMV07XHJcblxyXG4gICAgICAgICAgICBzdW1YICs9IHg7XHJcbiAgICAgICAgICAgIHN1bVkgKz0geTtcclxuXHJcbiAgICAgICAgICAgIHN1bVhYICs9IHggKiB4O1xyXG4gICAgICAgICAgICBzdW1YWSArPSB4ICogeTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGBtYCBpcyB0aGUgc2xvcGUgb2YgdGhlIHJlZ3Jlc3Npb24gbGluZVxyXG4gICAgICAgIG0gPSAoKGRhdGFMZW5ndGggKiBzdW1YWSkgLSAoc3VtWCAqIHN1bVkpKSAvXHJcbiAgICAgICAgICAgICgoZGF0YUxlbmd0aCAqIHN1bVhYKSAtIChzdW1YICogc3VtWCkpO1xyXG5cclxuICAgICAgICAvLyBgYmAgaXMgdGhlIHktaW50ZXJjZXB0IG9mIHRoZSBsaW5lLlxyXG4gICAgICAgIGIgPSAoc3VtWSAvIGRhdGFMZW5ndGgpIC0gKChtICogc3VtWCkgLyBkYXRhTGVuZ3RoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZXR1cm4gYm90aCB2YWx1ZXMgYXMgYW4gb2JqZWN0LlxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBtOiBtLFxyXG4gICAgICAgIGI6IGJcclxuICAgIH07XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxpbmVhclJlZ3Jlc3Npb247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbi8qKlxyXG4gKiBHaXZlbiB0aGUgb3V0cHV0IG9mIGBsaW5lYXJSZWdyZXNzaW9uYDogYW4gb2JqZWN0XHJcbiAqIHdpdGggYG1gIGFuZCBgYmAgdmFsdWVzIGluZGljYXRpbmcgc2xvcGUgYW5kIGludGVyY2VwdCxcclxuICogcmVzcGVjdGl2ZWx5LCBnZW5lcmF0ZSBhIGxpbmUgZnVuY3Rpb24gdGhhdCB0cmFuc2xhdGVzXHJcbiAqIHggdmFsdWVzIGludG8geSB2YWx1ZXMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYiBvYmplY3Qgd2l0aCBgbWAgYW5kIGBiYCBtZW1iZXJzLCByZXByZXNlbnRpbmdcclxuICogc2xvcGUgYW5kIGludGVyc2VjdCBvZiBkZXNpcmVkIGxpbmVcclxuICogQHJldHVybnMge0Z1bmN0aW9ufSBtZXRob2QgdGhhdCBjb21wdXRlcyB5LXZhbHVlIGF0IGFueSBnaXZlblxyXG4gKiB4LXZhbHVlIG9uIHRoZSBsaW5lLlxyXG4gKiBAZXhhbXBsZVxyXG4gKiB2YXIgbCA9IGxpbmVhclJlZ3Jlc3Npb25MaW5lKGxpbmVhclJlZ3Jlc3Npb24oW1swLCAwXSwgWzEsIDFdXSkpO1xyXG4gKiBsKDApIC8vPSAwXHJcbiAqIGwoMikgLy89IDJcclxuICovXHJcbmZ1bmN0aW9uIGxpbmVhclJlZ3Jlc3Npb25MaW5lKG1iLyo6IHsgYjogbnVtYmVyLCBtOiBudW1iZXIgfSovKS8qOiBGdW5jdGlvbiAqLyB7XHJcbiAgICAvLyBSZXR1cm4gYSBmdW5jdGlvbiB0aGF0IGNvbXB1dGVzIGEgYHlgIHZhbHVlIGZvciBlYWNoXHJcbiAgICAvLyB4IHZhbHVlIGl0IGlzIGdpdmVuLCBiYXNlZCBvbiB0aGUgdmFsdWVzIG9mIGBiYCBhbmQgYGFgXHJcbiAgICAvLyB0aGF0IHdlIGp1c3QgY29tcHV0ZWQuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24oeCkge1xyXG4gICAgICAgIHJldHVybiBtYi5iICsgKG1iLm0gKiB4KTtcclxuICAgIH07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGluZWFyUmVncmVzc2lvbkxpbmU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBzdW0gPSByZXF1aXJlKCcuL3N1bScpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBtZWFuLCBfYWxzbyBrbm93biBhcyBhdmVyYWdlXyxcclxuICogaXMgdGhlIHN1bSBvZiBhbGwgdmFsdWVzIG92ZXIgdGhlIG51bWJlciBvZiB2YWx1ZXMuXHJcbiAqIFRoaXMgaXMgYSBbbWVhc3VyZSBvZiBjZW50cmFsIHRlbmRlbmN5XShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9DZW50cmFsX3RlbmRlbmN5KTpcclxuICogYSBtZXRob2Qgb2YgZmluZGluZyBhIHR5cGljYWwgb3IgY2VudHJhbCB2YWx1ZSBvZiBhIHNldCBvZiBudW1iZXJzLlxyXG4gKlxyXG4gKiBUaGlzIHJ1bnMgb24gYE8obilgLCBsaW5lYXIgdGltZSBpbiByZXNwZWN0IHRvIHRoZSBhcnJheVxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggaW5wdXQgdmFsdWVzXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IG1lYW5cclxuICogQGV4YW1wbGVcclxuICogY29uc29sZS5sb2cobWVhbihbMCwgMTBdKSk7IC8vIDVcclxuICovXHJcbmZ1bmN0aW9uIG1lYW4oeCAvKjogQXJyYXk8bnVtYmVyPiAqLykvKjpudW1iZXIqLyB7XHJcbiAgICAvLyBUaGUgbWVhbiBvZiBubyBudW1iZXJzIGlzIG51bGxcclxuICAgIGlmICh4Lmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gTmFOOyB9XHJcblxyXG4gICAgcmV0dXJuIHN1bSh4KSAvIHgubGVuZ3RoO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1lYW47XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBzYW1wbGVDb3ZhcmlhbmNlID0gcmVxdWlyZSgnLi9zYW1wbGVfY292YXJpYW5jZScpO1xyXG52YXIgc2FtcGxlU3RhbmRhcmREZXZpYXRpb24gPSByZXF1aXJlKCcuL3NhbXBsZV9zdGFuZGFyZF9kZXZpYXRpb24nKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgW2NvcnJlbGF0aW9uXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0NvcnJlbGF0aW9uX2FuZF9kZXBlbmRlbmNlKSBpc1xyXG4gKiBhIG1lYXN1cmUgb2YgaG93IGNvcnJlbGF0ZWQgdHdvIGRhdGFzZXRzIGFyZSwgYmV0d2VlbiAtMSBhbmQgMVxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggZmlyc3QgaW5wdXRcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB5IHNlY29uZCBpbnB1dFxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBzYW1wbGUgY29ycmVsYXRpb25cclxuICogQGV4YW1wbGVcclxuICogdmFyIGEgPSBbMSwgMiwgMywgNCwgNSwgNl07XHJcbiAqIHZhciBiID0gWzIsIDIsIDMsIDQsIDUsIDYwXTtcclxuICogc2FtcGxlQ29ycmVsYXRpb24oYSwgYik7IC8vPSAwLjY5MVxyXG4gKi9cclxuZnVuY3Rpb24gc2FtcGxlQ29ycmVsYXRpb24oeC8qOiBBcnJheTxudW1iZXI+ICovLCB5Lyo6IEFycmF5PG51bWJlcj4gKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgdmFyIGNvdiA9IHNhbXBsZUNvdmFyaWFuY2UoeCwgeSksXHJcbiAgICAgICAgeHN0ZCA9IHNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uKHgpLFxyXG4gICAgICAgIHlzdGQgPSBzYW1wbGVTdGFuZGFyZERldmlhdGlvbih5KTtcclxuXHJcbiAgICByZXR1cm4gY292IC8geHN0ZCAvIHlzdGQ7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2FtcGxlQ29ycmVsYXRpb247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBtZWFuID0gcmVxdWlyZSgnLi9tZWFuJyk7XHJcblxyXG4vKipcclxuICogW1NhbXBsZSBjb3ZhcmlhbmNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TYW1wbGVfbWVhbl9hbmRfc2FtcGxlQ292YXJpYW5jZSkgb2YgdHdvIGRhdGFzZXRzOlxyXG4gKiBob3cgbXVjaCBkbyB0aGUgdHdvIGRhdGFzZXRzIG1vdmUgdG9nZXRoZXI/XHJcbiAqIHggYW5kIHkgYXJlIHR3byBkYXRhc2V0cywgcmVwcmVzZW50ZWQgYXMgYXJyYXlzIG9mIG51bWJlcnMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBmaXJzdCBpbnB1dFxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHkgc2Vjb25kIGlucHV0XHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHNhbXBsZSBjb3ZhcmlhbmNlXHJcbiAqIEBleGFtcGxlXHJcbiAqIHZhciB4ID0gWzEsIDIsIDMsIDQsIDUsIDZdO1xyXG4gKiB2YXIgeSA9IFs2LCA1LCA0LCAzLCAyLCAxXTtcclxuICogc2FtcGxlQ292YXJpYW5jZSh4LCB5KTsgLy89IC0zLjVcclxuICovXHJcbmZ1bmN0aW9uIHNhbXBsZUNvdmFyaWFuY2UoeCAvKjpBcnJheTxudW1iZXI+Ki8sIHkgLyo6QXJyYXk8bnVtYmVyPiovKS8qOm51bWJlciovIHtcclxuXHJcbiAgICAvLyBUaGUgdHdvIGRhdGFzZXRzIG11c3QgaGF2ZSB0aGUgc2FtZSBsZW5ndGggd2hpY2ggbXVzdCBiZSBtb3JlIHRoYW4gMVxyXG4gICAgaWYgKHgubGVuZ3RoIDw9IDEgfHwgeC5sZW5ndGggIT09IHkubGVuZ3RoKSB7XHJcbiAgICAgICAgcmV0dXJuIE5hTjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBkZXRlcm1pbmUgdGhlIG1lYW4gb2YgZWFjaCBkYXRhc2V0IHNvIHRoYXQgd2UgY2FuIGp1ZGdlIGVhY2hcclxuICAgIC8vIHZhbHVlIG9mIHRoZSBkYXRhc2V0IGZhaXJseSBhcyB0aGUgZGlmZmVyZW5jZSBmcm9tIHRoZSBtZWFuLiB0aGlzXHJcbiAgICAvLyB3YXksIGlmIG9uZSBkYXRhc2V0IGlzIFsxLCAyLCAzXSBhbmQgWzIsIDMsIDRdLCB0aGVpciBjb3ZhcmlhbmNlXHJcbiAgICAvLyBkb2VzIG5vdCBzdWZmZXIgYmVjYXVzZSBvZiB0aGUgZGlmZmVyZW5jZSBpbiBhYnNvbHV0ZSB2YWx1ZXNcclxuICAgIHZhciB4bWVhbiA9IG1lYW4oeCksXHJcbiAgICAgICAgeW1lYW4gPSBtZWFuKHkpLFxyXG4gICAgICAgIHN1bSA9IDA7XHJcblxyXG4gICAgLy8gZm9yIGVhY2ggcGFpciBvZiB2YWx1ZXMsIHRoZSBjb3ZhcmlhbmNlIGluY3JlYXNlcyB3aGVuIHRoZWlyXHJcbiAgICAvLyBkaWZmZXJlbmNlIGZyb20gdGhlIG1lYW4gaXMgYXNzb2NpYXRlZCAtIGlmIGJvdGggYXJlIHdlbGwgYWJvdmVcclxuICAgIC8vIG9yIGlmIGJvdGggYXJlIHdlbGwgYmVsb3dcclxuICAgIC8vIHRoZSBtZWFuLCB0aGUgY292YXJpYW5jZSBpbmNyZWFzZXMgc2lnbmlmaWNhbnRseS5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHN1bSArPSAoeFtpXSAtIHhtZWFuKSAqICh5W2ldIC0geW1lYW4pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRoaXMgaXMgQmVzc2VscycgQ29ycmVjdGlvbjogYW4gYWRqdXN0bWVudCBtYWRlIHRvIHNhbXBsZSBzdGF0aXN0aWNzXHJcbiAgICAvLyB0aGF0IGFsbG93cyBmb3IgdGhlIHJlZHVjZWQgZGVncmVlIG9mIGZyZWVkb20gZW50YWlsZWQgaW4gY2FsY3VsYXRpbmdcclxuICAgIC8vIHZhbHVlcyBmcm9tIHNhbXBsZXMgcmF0aGVyIHRoYW4gY29tcGxldGUgcG9wdWxhdGlvbnMuXHJcbiAgICB2YXIgYmVzc2Vsc0NvcnJlY3Rpb24gPSB4Lmxlbmd0aCAtIDE7XHJcblxyXG4gICAgLy8gdGhlIGNvdmFyaWFuY2UgaXMgd2VpZ2h0ZWQgYnkgdGhlIGxlbmd0aCBvZiB0aGUgZGF0YXNldHMuXHJcbiAgICByZXR1cm4gc3VtIC8gYmVzc2Vsc0NvcnJlY3Rpb247XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2FtcGxlQ292YXJpYW5jZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIHNhbXBsZVZhcmlhbmNlID0gcmVxdWlyZSgnLi9zYW1wbGVfdmFyaWFuY2UnKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgW3N0YW5kYXJkIGRldmlhdGlvbl0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TdGFuZGFyZF9kZXZpYXRpb24pXHJcbiAqIGlzIHRoZSBzcXVhcmUgcm9vdCBvZiB0aGUgdmFyaWFuY2UuXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBpbnB1dCBhcnJheVxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBzYW1wbGUgc3RhbmRhcmQgZGV2aWF0aW9uXHJcbiAqIEBleGFtcGxlXHJcbiAqIHNzLnNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uKFsyLCA0LCA0LCA0LCA1LCA1LCA3LCA5XSk7XHJcbiAqIC8vPSAyLjEzOFxyXG4gKi9cclxuZnVuY3Rpb24gc2FtcGxlU3RhbmRhcmREZXZpYXRpb24oeC8qOkFycmF5PG51bWJlcj4qLykvKjpudW1iZXIqLyB7XHJcbiAgICAvLyBUaGUgc3RhbmRhcmQgZGV2aWF0aW9uIG9mIG5vIG51bWJlcnMgaXMgbnVsbFxyXG4gICAgdmFyIHNhbXBsZVZhcmlhbmNlWCA9IHNhbXBsZVZhcmlhbmNlKHgpO1xyXG4gICAgaWYgKGlzTmFOKHNhbXBsZVZhcmlhbmNlWCkpIHsgcmV0dXJuIE5hTjsgfVxyXG4gICAgcmV0dXJuIE1hdGguc3FydChzYW1wbGVWYXJpYW5jZVgpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgc3VtTnRoUG93ZXJEZXZpYXRpb25zID0gcmVxdWlyZSgnLi9zdW1fbnRoX3Bvd2VyX2RldmlhdGlvbnMnKTtcclxuXHJcbi8qXHJcbiAqIFRoZSBbc2FtcGxlIHZhcmlhbmNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9WYXJpYW5jZSNTYW1wbGVfdmFyaWFuY2UpXHJcbiAqIGlzIHRoZSBzdW0gb2Ygc3F1YXJlZCBkZXZpYXRpb25zIGZyb20gdGhlIG1lYW4uIFRoZSBzYW1wbGUgdmFyaWFuY2VcclxuICogaXMgZGlzdGluZ3Vpc2hlZCBmcm9tIHRoZSB2YXJpYW5jZSBieSB0aGUgdXNhZ2Ugb2YgW0Jlc3NlbCdzIENvcnJlY3Rpb25dKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Jlc3NlbCdzX2NvcnJlY3Rpb24pOlxyXG4gKiBpbnN0ZWFkIG9mIGRpdmlkaW5nIHRoZSBzdW0gb2Ygc3F1YXJlZCBkZXZpYXRpb25zIGJ5IHRoZSBsZW5ndGggb2YgdGhlIGlucHV0LFxyXG4gKiBpdCBpcyBkaXZpZGVkIGJ5IHRoZSBsZW5ndGggbWludXMgb25lLiBUaGlzIGNvcnJlY3RzIHRoZSBiaWFzIGluIGVzdGltYXRpbmdcclxuICogYSB2YWx1ZSBmcm9tIGEgc2V0IHRoYXQgeW91IGRvbid0IGtub3cgaWYgZnVsbC5cclxuICpcclxuICogUmVmZXJlbmNlczpcclxuICogKiBbV29sZnJhbSBNYXRoV29ybGQgb24gU2FtcGxlIFZhcmlhbmNlXShodHRwOi8vbWF0aHdvcmxkLndvbGZyYW0uY29tL1NhbXBsZVZhcmlhbmNlLmh0bWwpXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBpbnB1dCBhcnJheVxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IHNhbXBsZSB2YXJpYW5jZVxyXG4gKiBAZXhhbXBsZVxyXG4gKiBzYW1wbGVWYXJpYW5jZShbMSwgMiwgMywgNCwgNV0pOyAvLz0gMi41XHJcbiAqL1xyXG5mdW5jdGlvbiBzYW1wbGVWYXJpYW5jZSh4IC8qOiBBcnJheTxudW1iZXI+ICovKS8qOm51bWJlciovIHtcclxuICAgIC8vIFRoZSB2YXJpYW5jZSBvZiBubyBudW1iZXJzIGlzIG51bGxcclxuICAgIGlmICh4Lmxlbmd0aCA8PSAxKSB7IHJldHVybiBOYU47IH1cclxuXHJcbiAgICB2YXIgc3VtU3F1YXJlZERldmlhdGlvbnNWYWx1ZSA9IHN1bU50aFBvd2VyRGV2aWF0aW9ucyh4LCAyKTtcclxuXHJcbiAgICAvLyB0aGlzIGlzIEJlc3NlbHMnIENvcnJlY3Rpb246IGFuIGFkanVzdG1lbnQgbWFkZSB0byBzYW1wbGUgc3RhdGlzdGljc1xyXG4gICAgLy8gdGhhdCBhbGxvd3MgZm9yIHRoZSByZWR1Y2VkIGRlZ3JlZSBvZiBmcmVlZG9tIGVudGFpbGVkIGluIGNhbGN1bGF0aW5nXHJcbiAgICAvLyB2YWx1ZXMgZnJvbSBzYW1wbGVzIHJhdGhlciB0aGFuIGNvbXBsZXRlIHBvcHVsYXRpb25zLlxyXG4gICAgdmFyIGJlc3NlbHNDb3JyZWN0aW9uID0geC5sZW5ndGggLSAxO1xyXG5cclxuICAgIC8vIEZpbmQgdGhlIG1lYW4gdmFsdWUgb2YgdGhhdCBsaXN0XHJcbiAgICByZXR1cm4gc3VtU3F1YXJlZERldmlhdGlvbnNWYWx1ZSAvIGJlc3NlbHNDb3JyZWN0aW9uO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNhbXBsZVZhcmlhbmNlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgdmFyaWFuY2UgPSByZXF1aXJlKCcuL3ZhcmlhbmNlJyk7XHJcblxyXG4vKipcclxuICogVGhlIFtzdGFuZGFyZCBkZXZpYXRpb25dKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvU3RhbmRhcmRfZGV2aWF0aW9uKVxyXG4gKiBpcyB0aGUgc3F1YXJlIHJvb3Qgb2YgdGhlIHZhcmlhbmNlLiBJdCdzIHVzZWZ1bCBmb3IgbWVhc3VyaW5nIHRoZSBhbW91bnRcclxuICogb2YgdmFyaWF0aW9uIG9yIGRpc3BlcnNpb24gaW4gYSBzZXQgb2YgdmFsdWVzLlxyXG4gKlxyXG4gKiBTdGFuZGFyZCBkZXZpYXRpb24gaXMgb25seSBhcHByb3ByaWF0ZSBmb3IgZnVsbC1wb3B1bGF0aW9uIGtub3dsZWRnZTogZm9yXHJcbiAqIHNhbXBsZXMgb2YgYSBwb3B1bGF0aW9uLCB7QGxpbmsgc2FtcGxlU3RhbmRhcmREZXZpYXRpb259IGlzXHJcbiAqIG1vcmUgYXBwcm9wcmlhdGUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBpbnB1dFxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBzdGFuZGFyZCBkZXZpYXRpb25cclxuICogQGV4YW1wbGVcclxuICogdmFyIHNjb3JlcyA9IFsyLCA0LCA0LCA0LCA1LCA1LCA3LCA5XTtcclxuICogdmFyaWFuY2Uoc2NvcmVzKTsgLy89IDRcclxuICogc3RhbmRhcmREZXZpYXRpb24oc2NvcmVzKTsgLy89IDJcclxuICovXHJcbmZ1bmN0aW9uIHN0YW5kYXJkRGV2aWF0aW9uKHggLyo6IEFycmF5PG51bWJlcj4gKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgLy8gVGhlIHN0YW5kYXJkIGRldmlhdGlvbiBvZiBubyBudW1iZXJzIGlzIG51bGxcclxuICAgIHZhciB2ID0gdmFyaWFuY2UoeCk7XHJcbiAgICBpZiAoaXNOYU4odikpIHsgcmV0dXJuIDA7IH1cclxuICAgIHJldHVybiBNYXRoLnNxcnQodik7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc3RhbmRhcmREZXZpYXRpb247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbi8qKlxyXG4gKiBPdXIgZGVmYXVsdCBzdW0gaXMgdGhlIFtLYWhhbiBzdW1tYXRpb24gYWxnb3JpdGhtXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9LYWhhbl9zdW1tYXRpb25fYWxnb3JpdGhtKSBpc1xyXG4gKiBhIG1ldGhvZCBmb3IgY29tcHV0aW5nIHRoZSBzdW0gb2YgYSBsaXN0IG9mIG51bWJlcnMgd2hpbGUgY29ycmVjdGluZ1xyXG4gKiBmb3IgZmxvYXRpbmctcG9pbnQgZXJyb3JzLiBUcmFkaXRpb25hbGx5LCBzdW1zIGFyZSBjYWxjdWxhdGVkIGFzIG1hbnlcclxuICogc3VjY2Vzc2l2ZSBhZGRpdGlvbnMsIGVhY2ggb25lIHdpdGggaXRzIG93biBmbG9hdGluZy1wb2ludCByb3VuZG9mZi4gVGhlc2VcclxuICogbG9zc2VzIGluIHByZWNpc2lvbiBhZGQgdXAgYXMgdGhlIG51bWJlciBvZiBudW1iZXJzIGluY3JlYXNlcy4gVGhpcyBhbHRlcm5hdGl2ZVxyXG4gKiBhbGdvcml0aG0gaXMgbW9yZSBhY2N1cmF0ZSB0aGFuIHRoZSBzaW1wbGUgd2F5IG9mIGNhbGN1bGF0aW5nIHN1bXMgYnkgc2ltcGxlXHJcbiAqIGFkZGl0aW9uLlxyXG4gKlxyXG4gKiBUaGlzIHJ1bnMgb24gYE8obilgLCBsaW5lYXIgdGltZSBpbiByZXNwZWN0IHRvIHRoZSBhcnJheVxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggaW5wdXRcclxuICogQHJldHVybiB7bnVtYmVyfSBzdW0gb2YgYWxsIGlucHV0IG51bWJlcnNcclxuICogQGV4YW1wbGVcclxuICogY29uc29sZS5sb2coc3VtKFsxLCAyLCAzXSkpOyAvLyA2XHJcbiAqL1xyXG5mdW5jdGlvbiBzdW0oeC8qOiBBcnJheTxudW1iZXI+ICovKS8qOiBudW1iZXIgKi8ge1xyXG5cclxuICAgIC8vIGxpa2UgdGhlIHRyYWRpdGlvbmFsIHN1bSBhbGdvcml0aG0sIHdlIGtlZXAgYSBydW5uaW5nXHJcbiAgICAvLyBjb3VudCBvZiB0aGUgY3VycmVudCBzdW0uXHJcbiAgICB2YXIgc3VtID0gMDtcclxuXHJcbiAgICAvLyBidXQgd2UgYWxzbyBrZWVwIHRocmVlIGV4dHJhIHZhcmlhYmxlcyBhcyBib29ra2VlcGluZzpcclxuICAgIC8vIG1vc3QgaW1wb3J0YW50bHksIGFuIGVycm9yIGNvcnJlY3Rpb24gdmFsdWUuIFRoaXMgd2lsbCBiZSBhIHZlcnlcclxuICAgIC8vIHNtYWxsIG51bWJlciB0aGF0IGlzIHRoZSBvcHBvc2l0ZSBvZiB0aGUgZmxvYXRpbmcgcG9pbnQgcHJlY2lzaW9uIGxvc3MuXHJcbiAgICB2YXIgZXJyb3JDb21wZW5zYXRpb24gPSAwO1xyXG5cclxuICAgIC8vIHRoaXMgd2lsbCBiZSBlYWNoIG51bWJlciBpbiB0aGUgbGlzdCBjb3JyZWN0ZWQgd2l0aCB0aGUgY29tcGVuc2F0aW9uIHZhbHVlLlxyXG4gICAgdmFyIGNvcnJlY3RlZEN1cnJlbnRWYWx1ZTtcclxuXHJcbiAgICAvLyBhbmQgdGhpcyB3aWxsIGJlIHRoZSBuZXh0IHN1bVxyXG4gICAgdmFyIG5leHRTdW07XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgLy8gZmlyc3QgY29ycmVjdCB0aGUgdmFsdWUgdGhhdCB3ZSdyZSBnb2luZyB0byBhZGQgdG8gdGhlIHN1bVxyXG4gICAgICAgIGNvcnJlY3RlZEN1cnJlbnRWYWx1ZSA9IHhbaV0gLSBlcnJvckNvbXBlbnNhdGlvbjtcclxuXHJcbiAgICAgICAgLy8gY29tcHV0ZSB0aGUgbmV4dCBzdW0uIHN1bSBpcyBsaWtlbHkgYSBtdWNoIGxhcmdlciBudW1iZXJcclxuICAgICAgICAvLyB0aGFuIGNvcnJlY3RlZEN1cnJlbnRWYWx1ZSwgc28gd2UnbGwgbG9zZSBwcmVjaXNpb24gaGVyZSxcclxuICAgICAgICAvLyBhbmQgbWVhc3VyZSBob3cgbXVjaCBwcmVjaXNpb24gaXMgbG9zdCBpbiB0aGUgbmV4dCBzdGVwXHJcbiAgICAgICAgbmV4dFN1bSA9IHN1bSArIGNvcnJlY3RlZEN1cnJlbnRWYWx1ZTtcclxuXHJcbiAgICAgICAgLy8gd2UgaW50ZW50aW9uYWxseSBkaWRuJ3QgYXNzaWduIHN1bSBpbW1lZGlhdGVseSwgYnV0IHN0b3JlZFxyXG4gICAgICAgIC8vIGl0IGZvciBub3cgc28gd2UgY2FuIGZpZ3VyZSBvdXQgdGhpczogaXMgKHN1bSArIG5leHRWYWx1ZSkgLSBuZXh0VmFsdWVcclxuICAgICAgICAvLyBub3QgZXF1YWwgdG8gMD8gaWRlYWxseSBpdCB3b3VsZCBiZSwgYnV0IGluIHByYWN0aWNlIGl0IHdvbid0OlxyXG4gICAgICAgIC8vIGl0IHdpbGwgYmUgc29tZSB2ZXJ5IHNtYWxsIG51bWJlci4gdGhhdCdzIHdoYXQgd2UgcmVjb3JkXHJcbiAgICAgICAgLy8gYXMgZXJyb3JDb21wZW5zYXRpb24uXHJcbiAgICAgICAgZXJyb3JDb21wZW5zYXRpb24gPSBuZXh0U3VtIC0gc3VtIC0gY29ycmVjdGVkQ3VycmVudFZhbHVlO1xyXG5cclxuICAgICAgICAvLyBub3cgdGhhdCB3ZSd2ZSBjb21wdXRlZCBob3cgbXVjaCB3ZSdsbCBjb3JyZWN0IGZvciBpbiB0aGUgbmV4dFxyXG4gICAgICAgIC8vIGxvb3AsIHN0YXJ0IHRyZWF0aW5nIHRoZSBuZXh0U3VtIGFzIHRoZSBjdXJyZW50IHN1bS5cclxuICAgICAgICBzdW0gPSBuZXh0U3VtO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdW07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc3VtO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgbWVhbiA9IHJlcXVpcmUoJy4vbWVhbicpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBzdW0gb2YgZGV2aWF0aW9ucyB0byB0aGUgTnRoIHBvd2VyLlxyXG4gKiBXaGVuIG49MiBpdCdzIHRoZSBzdW0gb2Ygc3F1YXJlZCBkZXZpYXRpb25zLlxyXG4gKiBXaGVuIG49MyBpdCdzIHRoZSBzdW0gb2YgY3ViZWQgZGV2aWF0aW9ucy5cclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBuIHBvd2VyXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHN1bSBvZiBudGggcG93ZXIgZGV2aWF0aW9uc1xyXG4gKiBAZXhhbXBsZVxyXG4gKiB2YXIgaW5wdXQgPSBbMSwgMiwgM107XHJcbiAqIC8vIHNpbmNlIHRoZSB2YXJpYW5jZSBvZiBhIHNldCBpcyB0aGUgbWVhbiBzcXVhcmVkXHJcbiAqIC8vIGRldmlhdGlvbnMsIHdlIGNhbiBjYWxjdWxhdGUgdGhhdCB3aXRoIHN1bU50aFBvd2VyRGV2aWF0aW9uczpcclxuICogdmFyIHZhcmlhbmNlID0gc3VtTnRoUG93ZXJEZXZpYXRpb25zKGlucHV0KSAvIGlucHV0Lmxlbmd0aDtcclxuICovXHJcbmZ1bmN0aW9uIHN1bU50aFBvd2VyRGV2aWF0aW9ucyh4Lyo6IEFycmF5PG51bWJlcj4gKi8sIG4vKjogbnVtYmVyICovKS8qOm51bWJlciovIHtcclxuICAgIHZhciBtZWFuVmFsdWUgPSBtZWFuKHgpLFxyXG4gICAgICAgIHN1bSA9IDA7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgc3VtICs9IE1hdGgucG93KHhbaV0gLSBtZWFuVmFsdWUsIG4pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdW07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc3VtTnRoUG93ZXJEZXZpYXRpb25zO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgc3VtTnRoUG93ZXJEZXZpYXRpb25zID0gcmVxdWlyZSgnLi9zdW1fbnRoX3Bvd2VyX2RldmlhdGlvbnMnKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgW3ZhcmlhbmNlXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1ZhcmlhbmNlKVxyXG4gKiBpcyB0aGUgc3VtIG9mIHNxdWFyZWQgZGV2aWF0aW9ucyBmcm9tIHRoZSBtZWFuLlxyXG4gKlxyXG4gKiBUaGlzIGlzIGFuIGltcGxlbWVudGF0aW9uIG9mIHZhcmlhbmNlLCBub3Qgc2FtcGxlIHZhcmlhbmNlOlxyXG4gKiBzZWUgdGhlIGBzYW1wbGVWYXJpYW5jZWAgbWV0aG9kIGlmIHlvdSB3YW50IGEgc2FtcGxlIG1lYXN1cmUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBhIHBvcHVsYXRpb25cclxuICogQHJldHVybnMge251bWJlcn0gdmFyaWFuY2U6IGEgdmFsdWUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHplcm8uXHJcbiAqIHplcm8gaW5kaWNhdGVzIHRoYXQgYWxsIHZhbHVlcyBhcmUgaWRlbnRpY2FsLlxyXG4gKiBAZXhhbXBsZVxyXG4gKiBzcy52YXJpYW5jZShbMSwgMiwgMywgNCwgNSwgNl0pOyAvLz0gMi45MTdcclxuICovXHJcbmZ1bmN0aW9uIHZhcmlhbmNlKHgvKjogQXJyYXk8bnVtYmVyPiAqLykvKjpudW1iZXIqLyB7XHJcbiAgICAvLyBUaGUgdmFyaWFuY2Ugb2Ygbm8gbnVtYmVycyBpcyBudWxsXHJcbiAgICBpZiAoeC5sZW5ndGggPT09IDApIHsgcmV0dXJuIE5hTjsgfVxyXG5cclxuICAgIC8vIEZpbmQgdGhlIG1lYW4gb2Ygc3F1YXJlZCBkZXZpYXRpb25zIGJldHdlZW4gdGhlXHJcbiAgICAvLyBtZWFuIHZhbHVlIGFuZCBlYWNoIHZhbHVlLlxyXG4gICAgcmV0dXJuIHN1bU50aFBvd2VyRGV2aWF0aW9ucyh4LCAyKSAvIHgubGVuZ3RoO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHZhcmlhbmNlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG4vKipcclxuICogVGhlIFtaLVNjb3JlLCBvciBTdGFuZGFyZCBTY29yZV0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TdGFuZGFyZF9zY29yZSkuXHJcbiAqXHJcbiAqIFRoZSBzdGFuZGFyZCBzY29yZSBpcyB0aGUgbnVtYmVyIG9mIHN0YW5kYXJkIGRldmlhdGlvbnMgYW4gb2JzZXJ2YXRpb25cclxuICogb3IgZGF0dW0gaXMgYWJvdmUgb3IgYmVsb3cgdGhlIG1lYW4uIFRodXMsIGEgcG9zaXRpdmUgc3RhbmRhcmQgc2NvcmVcclxuICogcmVwcmVzZW50cyBhIGRhdHVtIGFib3ZlIHRoZSBtZWFuLCB3aGlsZSBhIG5lZ2F0aXZlIHN0YW5kYXJkIHNjb3JlXHJcbiAqIHJlcHJlc2VudHMgYSBkYXR1bSBiZWxvdyB0aGUgbWVhbi4gSXQgaXMgYSBkaW1lbnNpb25sZXNzIHF1YW50aXR5XHJcbiAqIG9idGFpbmVkIGJ5IHN1YnRyYWN0aW5nIHRoZSBwb3B1bGF0aW9uIG1lYW4gZnJvbSBhbiBpbmRpdmlkdWFsIHJhd1xyXG4gKiBzY29yZSBhbmQgdGhlbiBkaXZpZGluZyB0aGUgZGlmZmVyZW5jZSBieSB0aGUgcG9wdWxhdGlvbiBzdGFuZGFyZFxyXG4gKiBkZXZpYXRpb24uXHJcbiAqXHJcbiAqIFRoZSB6LXNjb3JlIGlzIG9ubHkgZGVmaW5lZCBpZiBvbmUga25vd3MgdGhlIHBvcHVsYXRpb24gcGFyYW1ldGVycztcclxuICogaWYgb25lIG9ubHkgaGFzIGEgc2FtcGxlIHNldCwgdGhlbiB0aGUgYW5hbG9nb3VzIGNvbXB1dGF0aW9uIHdpdGhcclxuICogc2FtcGxlIG1lYW4gYW5kIHNhbXBsZSBzdGFuZGFyZCBkZXZpYXRpb24geWllbGRzIHRoZVxyXG4gKiBTdHVkZW50J3MgdC1zdGF0aXN0aWMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtZWFuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFuZGFyZERldmlhdGlvblxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IHogc2NvcmVcclxuICogQGV4YW1wbGVcclxuICogc3MuelNjb3JlKDc4LCA4MCwgNSk7IC8vPSAtMC40XHJcbiAqL1xyXG5mdW5jdGlvbiB6U2NvcmUoeC8qOm51bWJlciovLCBtZWFuLyo6bnVtYmVyKi8sIHN0YW5kYXJkRGV2aWF0aW9uLyo6bnVtYmVyKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgcmV0dXJuICh4IC0gbWVhbikgLyBzdGFuZGFyZERldmlhdGlvbjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB6U2NvcmU7XHJcbiIsImltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJ0Q29uZmlnIHtcclxuICAgIGNzc0NsYXNzUHJlZml4ID0gXCJvZGMtXCI7XHJcbiAgICBzdmdDbGFzcyA9IHRoaXMuY3NzQ2xhc3NQcmVmaXggKyAnbXctZDMtY2hhcnQnO1xyXG4gICAgd2lkdGggPSB1bmRlZmluZWQ7XHJcbiAgICBoZWlnaHQgPSB1bmRlZmluZWQ7XHJcbiAgICBtYXJnaW4gPSB7XHJcbiAgICAgICAgbGVmdDogNTAsXHJcbiAgICAgICAgcmlnaHQ6IDMwLFxyXG4gICAgICAgIHRvcDogMzAsXHJcbiAgICAgICAgYm90dG9tOiA1MFxyXG4gICAgfTtcclxuICAgIHNob3dUb29sdGlwID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKSB7XHJcbiAgICAgICAgaWYgKGN1c3RvbSkge1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDaGFydCB7XHJcbiAgICB1dGlscyA9IFV0aWxzO1xyXG4gICAgYmFzZUNvbnRhaW5lcjtcclxuICAgIHN2ZztcclxuICAgIGNvbmZpZztcclxuICAgIHBsb3QgPSB7XHJcbiAgICAgICAgbWFyZ2luOiB7fVxyXG4gICAgfTtcclxuICAgIF9hdHRhY2hlZCA9IHt9O1xyXG4gICAgX2xheWVycyA9IHt9O1xyXG4gICAgX2V2ZW50cyA9IHt9O1xyXG4gICAgX2lzQXR0YWNoZWQ7XHJcbiAgICBfaXNJbml0aWFsaXplZD1mYWxzZTtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoYmFzZSwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5faXNBdHRhY2hlZCA9IGJhc2UgaW5zdGFuY2VvZiBDaGFydDtcclxuXHJcbiAgICAgICAgdGhpcy5iYXNlQ29udGFpbmVyID0gYmFzZTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRDb25maWcoY29uZmlnKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXREYXRhKGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICAgICAgdGhpcy5wb3N0SW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpIHtcclxuICAgICAgICBpZiAoIWNvbmZpZykge1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IG5ldyBDaGFydENvbmZpZygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGF0YShkYXRhKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcblxyXG4gICAgICAgIHNlbGYuaW5pdFBsb3QoKTtcclxuICAgICAgICBzZWxmLmluaXRTdmcoKTtcclxuXHJcbiAgICAgICAgc2VsZi5pbml0VG9vbHRpcCgpO1xyXG4gICAgICAgIHNlbGYuZHJhdygpO1xyXG4gICAgICAgIHRoaXMuX2lzSW5pdGlhbGl6ZWQ9dHJ1ZTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwb3N0SW5pdCgpe1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBpbml0U3ZnKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgY29uZmlnID0gdGhpcy5jb25maWc7XHJcbiAgICAgICAgY29uc29sZS5sb2coY29uZmlnLnN2Z0NsYXNzKTtcclxuXHJcbiAgICAgICAgdmFyIG1hcmdpbiA9IHNlbGYucGxvdC5tYXJnaW47XHJcbiAgICAgICAgdmFyIHdpZHRoID0gc2VsZi5wbG90LndpZHRoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQ7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IHNlbGYucGxvdC5oZWlnaHQgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbTtcclxuICAgICAgICB2YXIgYXNwZWN0ID0gd2lkdGggLyBoZWlnaHQ7XHJcbiAgICAgICAgaWYoIXNlbGYuX2lzQXR0YWNoZWQpe1xyXG4gICAgICAgICAgICBpZighdGhpcy5faXNJbml0aWFsaXplZCl7XHJcbiAgICAgICAgICAgICAgICBkMy5zZWxlY3Qoc2VsZi5iYXNlQ29udGFpbmVyKS5zZWxlY3QoXCJzdmdcIikucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2VsZi5zdmcgPSBkMy5zZWxlY3Qoc2VsZi5iYXNlQ29udGFpbmVyKS5zZWxlY3RPckFwcGVuZChcInN2Z1wiKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuc3ZnXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ2aWV3Qm94XCIsIFwiMCAwIFwiICsgXCIgXCIgKyB3aWR0aCArIFwiIFwiICsgaGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJwcmVzZXJ2ZUFzcGVjdFJhdGlvXCIsIFwieE1pZFlNaWQgbWVldFwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBjb25maWcuc3ZnQ2xhc3MpO1xyXG4gICAgICAgICAgICBzZWxmLnN2Z0cgPSBzZWxmLnN2Zy5zZWxlY3RPckFwcGVuZChcImcubWFpbi1ncm91cFwiKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5iYXNlQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgc2VsZi5zdmcgPSBzZWxmLmJhc2VDb250YWluZXIuc3ZnO1xyXG4gICAgICAgICAgICBzZWxmLnN2Z0cgPSBzZWxmLnN2Zy5zZWxlY3RPckFwcGVuZChcImcubWFpbi1ncm91cC5cIitjb25maWcuc3ZnQ2xhc3MpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWxmLnN2Z0cuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIG1hcmdpbi5sZWZ0ICsgXCIsXCIgKyBtYXJnaW4udG9wICsgXCIpXCIpO1xyXG5cclxuICAgICAgICBpZiAoIWNvbmZpZy53aWR0aCB8fCBjb25maWcuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdCh3aW5kb3cpXHJcbiAgICAgICAgICAgICAgICAub24oXCJyZXNpemVcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vVE9ETyBhZGQgcmVzcG9uc2l2ZW5lc3MgaWYgd2lkdGgvaGVpZ2h0IG5vdCBzcGVjaWZpZWRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0VG9vbHRpcCgpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBpZiAoc2VsZi5jb25maWcuc2hvd1Rvb2x0aXApIHtcclxuICAgICAgICAgICAgaWYoIXNlbGYuX2lzQXR0YWNoZWQgKXtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC50b29sdGlwID0gZDMuc2VsZWN0KFwiYm9keVwiKS5zZWxlY3RPckFwcGVuZCgnZGl2Licrc2VsZi5jb25maWcuY3NzQ2xhc3NQcmVmaXgrJ3Rvb2x0aXAnKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wbG90LnRvb2x0aXA9IHNlbGYuYmFzZUNvbnRhaW5lci5wbG90LnRvb2x0aXA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCkge1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSB0aGlzLmNvbmZpZy5tYXJnaW47XHJcbiAgICAgICAgdGhpcy5wbG90PXtcclxuICAgICAgICAgICAgbWFyZ2luOntcclxuICAgICAgICAgICAgICAgIHRvcDogbWFyZ2luLnRvcCxcclxuICAgICAgICAgICAgICAgIGJvdHRvbTogbWFyZ2luLmJvdHRvbSxcclxuICAgICAgICAgICAgICAgIGxlZnQ6IG1hcmdpbi5sZWZ0LFxyXG4gICAgICAgICAgICAgICAgcmlnaHQ6IG1hcmdpbi5yaWdodFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZGF0YSkge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YShkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGxheWVyTmFtZSwgYXR0YWNobWVudERhdGE7XHJcbiAgICAgICAgZm9yICh2YXIgYXR0YWNobWVudE5hbWUgaW4gdGhpcy5fYXR0YWNoZWQpIHtcclxuXHJcbiAgICAgICAgICAgIGF0dGFjaG1lbnREYXRhID0gZGF0YTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2F0dGFjaGVkW2F0dGFjaG1lbnROYW1lXS51cGRhdGUoYXR0YWNobWVudERhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZygnYmFzZSB1cHBkYXRlJyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhdyhkYXRhKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoZGF0YSk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy9Cb3Jyb3dlZCBmcm9tIGQzLmNoYXJ0XHJcbiAgICAvKipcclxuICAgICAqIFJlZ2lzdGVyIG9yIHJldHJpZXZlIGFuIFwiYXR0YWNobWVudFwiIENoYXJ0LiBUaGUgXCJhdHRhY2htZW50XCIgY2hhcnQncyBgZHJhd2BcclxuICAgICAqIG1ldGhvZCB3aWxsIGJlIGludm9rZWQgd2hlbmV2ZXIgdGhlIGNvbnRhaW5pbmcgY2hhcnQncyBgZHJhd2AgbWV0aG9kIGlzXHJcbiAgICAgKiBpbnZva2VkLlxyXG4gICAgICpcclxuICAgICAqIEBleHRlcm5hbEV4YW1wbGUgY2hhcnQtYXR0YWNoXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF0dGFjaG1lbnROYW1lIE5hbWUgb2YgdGhlIGF0dGFjaG1lbnRcclxuICAgICAqIEBwYXJhbSB7Q2hhcnR9IFtjaGFydF0gQ2hhcnQgdG8gcmVnaXN0ZXIgYXMgYSBtaXggaW4gb2YgdGhpcyBjaGFydC4gV2hlblxyXG4gICAgICogICAgICAgIHVuc3BlY2lmaWVkLCB0aGlzIG1ldGhvZCB3aWxsIHJldHVybiB0aGUgYXR0YWNobWVudCBwcmV2aW91c2x5XHJcbiAgICAgKiAgICAgICAgcmVnaXN0ZXJlZCB3aXRoIHRoZSBzcGVjaWZpZWQgYGF0dGFjaG1lbnROYW1lYCAoaWYgYW55KS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Q2hhcnR9IFJlZmVyZW5jZSB0byB0aGlzIGNoYXJ0IChjaGFpbmFibGUpLlxyXG4gICAgICovXHJcbiAgICBhdHRhY2goYXR0YWNobWVudE5hbWUsIGNoYXJ0KSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2F0dGFjaGVkW2F0dGFjaG1lbnROYW1lXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2F0dGFjaGVkW2F0dGFjaG1lbnROYW1lXSA9IGNoYXJ0O1xyXG4gICAgICAgIHJldHVybiBjaGFydDtcclxuICAgIH07XHJcblxyXG4gICAgXHJcblxyXG4gICAgLy9Cb3Jyb3dlZCBmcm9tIGQzLmNoYXJ0XHJcbiAgICAvKipcclxuICAgICAqIFN1YnNjcmliZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGFuIGV2ZW50IHRyaWdnZXJlZCBvbiB0aGUgY2hhcnQuIFNlZSB7QGxpbmtcclxuICAgICAgICAqIENoYXJ0I29uY2V9IHRvIHN1YnNjcmliZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGFuIGV2ZW50IGZvciBvbmUgb2NjdXJlbmNlLlxyXG4gICAgICpcclxuICAgICAqIEBleHRlcm5hbEV4YW1wbGUge3J1bm5hYmxlfSBjaGFydC1vblxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGV2ZW50XHJcbiAgICAgKiBAcGFyYW0ge0NoYXJ0RXZlbnRIYW5kbGVyfSBjYWxsYmFjayBGdW5jdGlvbiB0byBiZSBpbnZva2VkIHdoZW4gdGhlIGV2ZW50XHJcbiAgICAgKiAgICAgICAgb2NjdXJzXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbnRleHRdIFZhbHVlIHRvIHNldCBhcyBgdGhpc2Agd2hlbiBpbnZva2luZyB0aGVcclxuICAgICAqICAgICAgICBgY2FsbGJhY2tgLiBEZWZhdWx0cyB0byB0aGUgY2hhcnQgaW5zdGFuY2UuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0NoYXJ0fSBBIHJlZmVyZW5jZSB0byB0aGlzIGNoYXJ0IChjaGFpbmFibGUpLlxyXG4gICAgICovXHJcbiAgICBvbihuYW1lLCBjYWxsYmFjaywgY29udGV4dCkge1xyXG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLl9ldmVudHNbbmFtZV0gfHwgKHRoaXMuX2V2ZW50c1tuYW1lXSA9IFtdKTtcclxuICAgICAgICBldmVudHMucHVzaCh7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcclxuICAgICAgICAgICAgY29udGV4dDogY29udGV4dCB8fCB0aGlzLFxyXG4gICAgICAgICAgICBfY2hhcnQ6IHRoaXNcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvL0JvcnJvd2VkIGZyb20gZDMuY2hhcnRcclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIFN1YnNjcmliZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGFuIGV2ZW50IHRyaWdnZXJlZCBvbiB0aGUgY2hhcnQuIFRoaXNcclxuICAgICAqIGZ1bmN0aW9uIHdpbGwgYmUgaW52b2tlZCBhdCB0aGUgbmV4dCBvY2N1cmFuY2Ugb2YgdGhlIGV2ZW50IGFuZCBpbW1lZGlhdGVseVxyXG4gICAgICogdW5zdWJzY3JpYmVkLiBTZWUge0BsaW5rIENoYXJ0I29ufSB0byBzdWJzY3JpYmUgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBhblxyXG4gICAgICogZXZlbnQgaW5kZWZpbml0ZWx5LlxyXG4gICAgICpcclxuICAgICAqIEBleHRlcm5hbEV4YW1wbGUge3J1bm5hYmxlfSBjaGFydC1vbmNlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgZXZlbnRcclxuICAgICAqIEBwYXJhbSB7Q2hhcnRFdmVudEhhbmRsZXJ9IGNhbGxiYWNrIEZ1bmN0aW9uIHRvIGJlIGludm9rZWQgd2hlbiB0aGUgZXZlbnRcclxuICAgICAqICAgICAgICBvY2N1cnNcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF0gVmFsdWUgdG8gc2V0IGFzIGB0aGlzYCB3aGVuIGludm9raW5nIHRoZVxyXG4gICAgICogICAgICAgIGBjYWxsYmFja2AuIERlZmF1bHRzIHRvIHRoZSBjaGFydCBpbnN0YW5jZVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtDaGFydH0gQSByZWZlcmVuY2UgdG8gdGhpcyBjaGFydCAoY2hhaW5hYmxlKVxyXG4gICAgICovXHJcbiAgICBvbmNlKG5hbWUsIGNhbGxiYWNrLCBjb250ZXh0KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBvbmNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZWxmLm9mZihuYW1lLCBvbmNlKTtcclxuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uKG5hbWUsIG9uY2UsIGNvbnRleHQpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvL0JvcnJvd2VkIGZyb20gZDMuY2hhcnRcclxuICAgIC8qKlxyXG4gICAgICogVW5zdWJzY3JpYmUgb25lIG9yIG1vcmUgY2FsbGJhY2sgZnVuY3Rpb25zIGZyb20gYW4gZXZlbnQgdHJpZ2dlcmVkIG9uIHRoZVxyXG4gICAgICogY2hhcnQuIFdoZW4gbm8gYXJndW1lbnRzIGFyZSBzcGVjaWZpZWQsICphbGwqIGhhbmRsZXJzIHdpbGwgYmUgdW5zdWJzY3JpYmVkLlxyXG4gICAgICogV2hlbiBvbmx5IGEgYG5hbWVgIGlzIHNwZWNpZmllZCwgYWxsIGhhbmRsZXJzIHN1YnNjcmliZWQgdG8gdGhhdCBldmVudCB3aWxsXHJcbiAgICAgKiBiZSB1bnN1YnNjcmliZWQuIFdoZW4gYSBgbmFtZWAgYW5kIGBjYWxsYmFja2AgYXJlIHNwZWNpZmllZCwgb25seSB0aGF0XHJcbiAgICAgKiBmdW5jdGlvbiB3aWxsIGJlIHVuc3Vic2NyaWJlZCBmcm9tIHRoYXQgZXZlbnQuIFdoZW4gYSBgbmFtZWAgYW5kIGBjb250ZXh0YFxyXG4gICAgICogYXJlIHNwZWNpZmllZCAoYnV0IGBjYWxsYmFja2AgaXMgb21pdHRlZCksIGFsbCBldmVudHMgYm91bmQgdG8gdGhlIGdpdmVuXHJcbiAgICAgKiBldmVudCB3aXRoIHRoZSBnaXZlbiBjb250ZXh0IHdpbGwgYmUgdW5zdWJzY3JpYmVkLlxyXG4gICAgICpcclxuICAgICAqIEBleHRlcm5hbEV4YW1wbGUge3J1bm5hYmxlfSBjaGFydC1vZmZcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW25hbWVdIE5hbWUgb2YgdGhlIGV2ZW50IHRvIGJlIHVuc3Vic2NyaWJlZFxyXG4gICAgICogQHBhcmFtIHtDaGFydEV2ZW50SGFuZGxlcn0gW2NhbGxiYWNrXSBGdW5jdGlvbiB0byBiZSB1bnN1YnNjcmliZWRcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF0gQ29udGV4dHMgdG8gYmUgdW5zdWJzY3JpYmVcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Q2hhcnR9IEEgcmVmZXJlbmNlIHRvIHRoaXMgY2hhcnQgKGNoYWluYWJsZSkuXHJcbiAgICAgKi9cclxuXHJcbiAgICBvZmYobmFtZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgbmFtZXMsIG4sIGV2ZW50cywgZXZlbnQsIGksIGo7XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSBhbGwgZXZlbnRzXHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgZm9yIChuYW1lIGluIHRoaXMuX2V2ZW50cykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW25hbWVdLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyByZW1vdmUgYWxsIGV2ZW50cyBmb3IgYSBzcGVjaWZpYyBuYW1lXHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgZXZlbnRzID0gdGhpcy5fZXZlbnRzW25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoZXZlbnRzKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudHMubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggd2hhdGV2ZXIgY29tYmluYXRpb24gb2YgbmFtZSwgY29udGV4dFxyXG4gICAgICAgIC8vIGFuZCBjYWxsYmFjay5cclxuICAgICAgICBuYW1lcyA9IG5hbWUgPyBbbmFtZV0gOiBPYmplY3Qua2V5cyh0aGlzLl9ldmVudHMpO1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBuID0gbmFtZXNbaV07XHJcbiAgICAgICAgICAgIGV2ZW50cyA9IHRoaXMuX2V2ZW50c1tuXTtcclxuICAgICAgICAgICAgaiA9IGV2ZW50cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIHdoaWxlIChqLS0pIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50ID0gZXZlbnRzW2pdO1xyXG4gICAgICAgICAgICAgICAgaWYgKChjYWxsYmFjayAmJiBjYWxsYmFjayA9PT0gZXZlbnQuY2FsbGJhY2spIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgKGNvbnRleHQgJiYgY29udGV4dCA9PT0gZXZlbnQuY29udGV4dCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudHMuc3BsaWNlKGosIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLy9Cb3Jyb3dlZCBmcm9tIGQzLmNoYXJ0XHJcbiAgICAvKipcclxuICAgICAqIFB1Ymxpc2ggYW4gZXZlbnQgb24gdGhpcyBjaGFydCB3aXRoIHRoZSBnaXZlbiBgbmFtZWAuXHJcbiAgICAgKlxyXG4gICAgICogQGV4dGVybmFsRXhhbXBsZSB7cnVubmFibGV9IGNoYXJ0LXRyaWdnZXJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBldmVudCB0byBwdWJsaXNoXHJcbiAgICAgKiBAcGFyYW0gey4uLip9IGFyZ3VtZW50cyBWYWx1ZXMgd2l0aCB3aGljaCB0byBpbnZva2UgdGhlIHJlZ2lzdGVyZWRcclxuICAgICAqICAgICAgICBjYWxsYmFja3MuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0NoYXJ0fSBBIHJlZmVyZW5jZSB0byB0aGlzIGNoYXJ0IChjaGFpbmFibGUpLlxyXG4gICAgICovXHJcbiAgICB0cmlnZ2VyKG5hbWUpIHtcclxuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XHJcbiAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50c1tuYW1lXTtcclxuICAgICAgICB2YXIgaSwgZXY7XHJcblxyXG4gICAgICAgIGlmIChldmVudHMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZXZlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBldiA9IGV2ZW50c1tpXTtcclxuICAgICAgICAgICAgICAgIGV2LmNhbGxiYWNrLmFwcGx5KGV2LmNvbnRleHQsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBnZXRCYXNlQ29udGFpbmVyKCl7XHJcbiAgICAgICAgaWYodGhpcy5faXNBdHRhY2hlZCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJhc2VDb250YWluZXIuc3ZnO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZDMuc2VsZWN0KHRoaXMuYmFzZUNvbnRhaW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QmFzZUNvbnRhaW5lck5vZGUoKXtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QmFzZUNvbnRhaW5lcigpLm5vZGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcmVmaXhDbGFzcyhjbGF6eiwgYWRkRG90KXtcclxuICAgICAgICByZXR1cm4gYWRkRG90PyAnLic6ICcnK3RoaXMuY29uZmlnLmNzc0NsYXNzUHJlZml4K2NsYXp6O1xyXG4gICAgfVxyXG4gICAgY29tcHV0ZVBsb3RTaXplKCkge1xyXG4gICAgICAgIHRoaXMucGxvdC53aWR0aCA9IFV0aWxzLmF2YWlsYWJsZVdpZHRoKHRoaXMuY29uZmlnLndpZHRoLCB0aGlzLmdldEJhc2VDb250YWluZXIoKSwgdGhpcy5wbG90Lm1hcmdpbik7XHJcbiAgICAgICAgdGhpcy5wbG90LmhlaWdodCA9IFV0aWxzLmF2YWlsYWJsZUhlaWdodCh0aGlzLmNvbmZpZy5oZWlnaHQsIHRoaXMuZ2V0QmFzZUNvbnRhaW5lcigpLCB0aGlzLnBsb3QubWFyZ2luKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NoYXJ0LCBDaGFydENvbmZpZ30gZnJvbSBcIi4vY2hhcnRcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IHtTdGF0aXN0aWNzVXRpbHN9IGZyb20gJy4vc3RhdGlzdGljcy11dGlscydcclxuaW1wb3J0IHtMZWdlbmR9IGZyb20gJy4vbGVnZW5kJ1xyXG5pbXBvcnQge1NjYXR0ZXJQbG90fSBmcm9tICcuL3NjYXR0ZXJwbG90J1xyXG5cclxuZXhwb3J0IGNsYXNzIENvcnJlbGF0aW9uTWF0cml4Q29uZmlnIGV4dGVuZHMgQ2hhcnRDb25maWcge1xyXG5cclxuICAgIHN2Z0NsYXNzID0gJ29kYy1jb3JyZWxhdGlvbi1tYXRyaXgnO1xyXG4gICAgZ3VpZGVzID0gZmFsc2U7IC8vc2hvdyBheGlzIGd1aWRlc1xyXG4gICAgc2hvd1Rvb2x0aXAgPSB0cnVlOyAvL3Nob3cgdG9vbHRpcCBvbiBkb3QgaG92ZXJcclxuICAgIHNob3dMZWdlbmQgPSB0cnVlO1xyXG4gICAgaGlnaGxpZ2h0TGFiZWxzID0gdHJ1ZTtcclxuICAgIHZhcmlhYmxlcyA9IHtcclxuICAgICAgICBsYWJlbHM6IHVuZGVmaW5lZCxcclxuICAgICAgICBrZXlzOiBbXSwgLy9vcHRpb25hbCBhcnJheSBvZiB2YXJpYWJsZSBrZXlzXHJcbiAgICAgICAgdmFsdWU6IChkLCB2YXJpYWJsZUtleSkgPT4gZFt2YXJpYWJsZUtleV0sIC8vIHZhcmlhYmxlIHZhbHVlIGFjY2Vzc29yXHJcbiAgICAgICAgc2NhbGU6IFwib3JkaW5hbFwiXHJcbiAgICB9O1xyXG4gICAgY29ycmVsYXRpb24gPSB7XHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCIsXHJcbiAgICAgICAgZG9tYWluOiBbLTEsIC0wLjc1LCAtMC41LCAwLCAwLjUsIDAuNzUsIDFdLFxyXG4gICAgICAgIHJhbmdlOiBbXCJkYXJrYmx1ZVwiLCBcImJsdWVcIiwgXCJsaWdodHNreWJsdWVcIiwgXCJ3aGl0ZVwiLCBcIm9yYW5nZXJlZFwiLCBcImNyaW1zb25cIiwgXCJkYXJrcmVkXCJdLFxyXG4gICAgICAgIHZhbHVlOiAoeFZhbHVlcywgeVZhbHVlcykgPT4gU3RhdGlzdGljc1V0aWxzLnNhbXBsZUNvcnJlbGF0aW9uKHhWYWx1ZXMsIHlWYWx1ZXMpXHJcblxyXG4gICAgfTtcclxuICAgIGNlbGwgPSB7XHJcbiAgICAgICAgc2hhcGU6IFwiZWxsaXBzZVwiLCAvL3Bvc3NpYmxlIHZhbHVlczogcmVjdCwgY2lyY2xlLCBlbGxpcHNlXHJcbiAgICAgICAgc2l6ZTogdW5kZWZpbmVkLFxyXG4gICAgICAgIHNpemVNaW46IDE1LFxyXG4gICAgICAgIHNpemVNYXg6IDI1MCxcclxuICAgICAgICBwYWRkaW5nOiAxXHJcbiAgICB9O1xyXG4gICAgbWFyZ2luID0ge1xyXG4gICAgICAgIGxlZnQ6IDYwLFxyXG4gICAgICAgIHJpZ2h0OiA1MCxcclxuICAgICAgICB0b3A6IDMwLFxyXG4gICAgICAgIGJvdHRvbTogNjBcclxuICAgIH07XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBpZiAoY3VzdG9tKSB7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb3JyZWxhdGlvbk1hdHJpeCBleHRlbmRzIENoYXJ0IHtcclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIG5ldyBDb3JyZWxhdGlvbk1hdHJpeENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgQ29ycmVsYXRpb25NYXRyaXhDb25maWcoY29uZmlnKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSB0aGlzLmNvbmZpZy5tYXJnaW47XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgdGhpcy5wbG90Lng9e307XHJcbiAgICAgICAgdGhpcy5wbG90LmNvcnJlbGF0aW9uPXtcclxuICAgICAgICAgICAgbWF0cml4OiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGNlbGxzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGNvbG9yOiB7fSxcclxuICAgICAgICAgICAgc2hhcGU6IHt9XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBWYXJpYWJsZXMoKTtcclxuICAgICAgICB2YXIgd2lkdGggPSBjb25mLndpZHRoO1xyXG4gICAgICAgIHZhciBwbGFjZWhvbGRlck5vZGUgPSB0aGlzLmdldEJhc2VDb250YWluZXJOb2RlKCk7XHJcbiAgICAgICAgdGhpcy5wbG90LnBsYWNlaG9sZGVyTm9kZSA9IHBsYWNlaG9sZGVyTm9kZTtcclxuXHJcbiAgICAgICAgdmFyIHBhcmVudFdpZHRoID0gcGxhY2Vob2xkZXJOb2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xyXG4gICAgICAgIGlmICh3aWR0aCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLnBsb3QuY2VsbFNpemUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsU2l6ZSA9IE1hdGgubWF4KGNvbmYuY2VsbC5zaXplTWluLCBNYXRoLm1pbihjb25mLmNlbGwuc2l6ZU1heCwgKHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQpIC8gdGhpcy5wbG90LnZhcmlhYmxlcy5sZW5ndGgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuY2VsbFNpemUgPSB0aGlzLmNvbmZpZy5jZWxsLnNpemU7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMucGxvdC5jZWxsU2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxTaXplID0gTWF0aC5tYXgoY29uZi5jZWxsLnNpemVNaW4sIE1hdGgubWluKGNvbmYuY2VsbC5zaXplTWF4LCAocGFyZW50V2lkdGgtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0KSAvIHRoaXMucGxvdC52YXJpYWJsZXMubGVuZ3RoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHdpZHRoID0gdGhpcy5wbG90LmNlbGxTaXplICogdGhpcy5wbG90LnZhcmlhYmxlcy5sZW5ndGggKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodDtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaGVpZ2h0ID0gd2lkdGg7XHJcbiAgICAgICAgaWYgKCFoZWlnaHQpIHtcclxuICAgICAgICAgICAgaGVpZ2h0ID0gcGxhY2Vob2xkZXJOb2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC53aWR0aCA9IHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XHJcbiAgICAgICAgdGhpcy5wbG90LmhlaWdodCA9IHRoaXMucGxvdC53aWR0aDtcclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cFZhcmlhYmxlc1NjYWxlcygpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBDb3JyZWxhdGlvblNjYWxlcygpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBDb3JyZWxhdGlvbk1hdHJpeCgpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXBWYXJpYWJsZXNTY2FsZXMoKSB7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB4ID0gcGxvdC54O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWcudmFyaWFibGVzO1xyXG5cclxuICAgICAgICAvKiAqXHJcbiAgICAgICAgICogdmFsdWUgYWNjZXNzb3IgLSByZXR1cm5zIHRoZSB2YWx1ZSB0byBlbmNvZGUgZm9yIGEgZ2l2ZW4gZGF0YSBvYmplY3QuXHJcbiAgICAgICAgICogc2NhbGUgLSBtYXBzIHZhbHVlIHRvIGEgdmlzdWFsIGRpc3BsYXkgZW5jb2RpbmcsIHN1Y2ggYXMgYSBwaXhlbCBwb3NpdGlvbi5cclxuICAgICAgICAgKiBtYXAgZnVuY3Rpb24gLSBtYXBzIGZyb20gZGF0YSB2YWx1ZSB0byBkaXNwbGF5IHZhbHVlXHJcbiAgICAgICAgICogYXhpcyAtIHNldHMgdXAgYXhpc1xyXG4gICAgICAgICAqKi9cclxuICAgICAgICB4LnZhbHVlID0gY29uZi52YWx1ZTtcclxuICAgICAgICB4LnNjYWxlID0gZDMuc2NhbGVbY29uZi5zY2FsZV0oKS5yYW5nZUJhbmRzKFtwbG90LndpZHRoLCAwXSk7XHJcbiAgICAgICAgeC5tYXAgPSBkID0+IHguc2NhbGUoeC52YWx1ZShkKSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cENvcnJlbGF0aW9uU2NhbGVzKCkge1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciBjb3JyQ29uZiA9IHRoaXMuY29uZmlnLmNvcnJlbGF0aW9uO1xyXG5cclxuICAgICAgICBwbG90LmNvcnJlbGF0aW9uLmNvbG9yLnNjYWxlID0gZDMuc2NhbGVbY29yckNvbmYuc2NhbGVdKCkuZG9tYWluKGNvcnJDb25mLmRvbWFpbikucmFuZ2UoY29yckNvbmYucmFuZ2UpO1xyXG4gICAgICAgIHZhciBzaGFwZSA9IHBsb3QuY29ycmVsYXRpb24uc2hhcGUgPSB7fTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxDb25mID0gdGhpcy5jb25maWcuY2VsbDtcclxuICAgICAgICBzaGFwZS50eXBlID0gY2VsbENvbmYuc2hhcGU7XHJcblxyXG4gICAgICAgIHZhciBzaGFwZVNpemUgPSBwbG90LmNlbGxTaXplIC0gY2VsbENvbmYucGFkZGluZyAqIDI7XHJcbiAgICAgICAgaWYgKHNoYXBlLnR5cGUgPT0gJ2NpcmNsZScpIHtcclxuICAgICAgICAgICAgdmFyIHJhZGl1c01heCA9IHNoYXBlU2l6ZSAvIDI7XHJcbiAgICAgICAgICAgIHNoYXBlLnJhZGl1c1NjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFswLCAxXSkucmFuZ2UoWzIsIHJhZGl1c01heF0pO1xyXG4gICAgICAgICAgICBzaGFwZS5yYWRpdXMgPSBjPT4gc2hhcGUucmFkaXVzU2NhbGUoTWF0aC5hYnMoYy52YWx1ZSkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc2hhcGUudHlwZSA9PSAnZWxsaXBzZScpIHtcclxuICAgICAgICAgICAgdmFyIHJhZGl1c01heCA9IHNoYXBlU2l6ZSAvIDI7XHJcbiAgICAgICAgICAgIHNoYXBlLnJhZGl1c1NjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFswLCAxXSkucmFuZ2UoW3JhZGl1c01heCwgMl0pO1xyXG4gICAgICAgICAgICBzaGFwZS5yYWRpdXNYID0gYz0+IHNoYXBlLnJhZGl1c1NjYWxlKE1hdGguYWJzKGMudmFsdWUpKTtcclxuICAgICAgICAgICAgc2hhcGUucmFkaXVzWSA9IHJhZGl1c01heDtcclxuXHJcbiAgICAgICAgICAgIHNoYXBlLnJvdGF0ZVZhbCA9IHYgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHYgPT0gMCkgcmV0dXJuIFwiMFwiO1xyXG4gICAgICAgICAgICAgICAgaWYgKHYgPCAwKSByZXR1cm4gXCItNDVcIjtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIjQ1XCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoc2hhcGUudHlwZSA9PSAncmVjdCcpIHtcclxuICAgICAgICAgICAgc2hhcGUuc2l6ZSA9IHNoYXBlU2l6ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBzZXR1cFZhcmlhYmxlcygpIHtcclxuXHJcbiAgICAgICAgdmFyIHZhcmlhYmxlc0NvbmYgPSB0aGlzLmNvbmZpZy52YXJpYWJsZXM7XHJcblxyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHBsb3QuZG9tYWluQnlWYXJpYWJsZSA9IHt9O1xyXG4gICAgICAgIHBsb3QudmFyaWFibGVzID0gdmFyaWFibGVzQ29uZi5rZXlzO1xyXG4gICAgICAgIGlmICghcGxvdC52YXJpYWJsZXMgfHwgIXBsb3QudmFyaWFibGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBwbG90LnZhcmlhYmxlcyA9IFV0aWxzLmluZmVyVmFyaWFibGVzKGRhdGEsIHRoaXMuY29uZmlnLmdyb3Vwcy5rZXksIHRoaXMuY29uZmlnLmluY2x1ZGVJblBsb3QpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcGxvdC5sYWJlbHMgPSBbXTtcclxuICAgICAgICBwbG90LmxhYmVsQnlWYXJpYWJsZSA9IHt9O1xyXG4gICAgICAgIHBsb3QudmFyaWFibGVzLmZvckVhY2goKHZhcmlhYmxlS2V5LCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBwbG90LmRvbWFpbkJ5VmFyaWFibGVbdmFyaWFibGVLZXldID0gZDMuZXh0ZW50KGRhdGEsICAoZCkgPT4gdmFyaWFibGVzQ29uZi52YWx1ZShkLCB2YXJpYWJsZUtleSkpO1xyXG4gICAgICAgICAgICB2YXIgbGFiZWwgPSB2YXJpYWJsZUtleTtcclxuICAgICAgICAgICAgaWYgKHZhcmlhYmxlc0NvbmYubGFiZWxzICYmIHZhcmlhYmxlc0NvbmYubGFiZWxzLmxlbmd0aCA+IGluZGV4KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGFiZWwgPSB2YXJpYWJsZXNDb25mLmxhYmVsc1tpbmRleF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGxvdC5sYWJlbHMucHVzaChsYWJlbCk7XHJcbiAgICAgICAgICAgIHBsb3QubGFiZWxCeVZhcmlhYmxlW3ZhcmlhYmxlS2V5XSA9IGxhYmVsO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhwbG90LmxhYmVsQnlWYXJpYWJsZSk7XHJcblxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgc2V0dXBDb3JyZWxhdGlvbk1hdHJpeCgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgdmFyIG1hdHJpeCA9IHRoaXMucGxvdC5jb3JyZWxhdGlvbi5tYXRyaXggPSBbXTtcclxuICAgICAgICB2YXIgbWF0cml4Q2VsbHMgPSB0aGlzLnBsb3QuY29ycmVsYXRpb24ubWF0cml4LmNlbGxzID0gW107XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcblxyXG4gICAgICAgIHZhciB2YXJpYWJsZVRvVmFsdWVzID0ge307XHJcbiAgICAgICAgcGxvdC52YXJpYWJsZXMuZm9yRWFjaCgodiwgaSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgdmFyaWFibGVUb1ZhbHVlc1t2XSA9IGRhdGEubWFwKGQ9PnBsb3QueC52YWx1ZShkLCB2KSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHBsb3QudmFyaWFibGVzLmZvckVhY2goKHYxLCBpKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciByb3cgPSBbXTtcclxuICAgICAgICAgICAgbWF0cml4LnB1c2gocm93KTtcclxuXHJcbiAgICAgICAgICAgIHBsb3QudmFyaWFibGVzLmZvckVhY2goKHYyLCBqKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29yciA9IDE7XHJcbiAgICAgICAgICAgICAgICBpZiAodjEgIT0gdjIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb3JyID0gc2VsZi5jb25maWcuY29ycmVsYXRpb24udmFsdWUodmFyaWFibGVUb1ZhbHVlc1t2MV0sIHZhcmlhYmxlVG9WYWx1ZXNbdjJdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBjZWxsID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvd1ZhcjogdjEsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sVmFyOiB2MixcclxuICAgICAgICAgICAgICAgICAgICByb3c6IGksXHJcbiAgICAgICAgICAgICAgICAgICAgY29sOiBqLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjb3JyXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcm93LnB1c2goY2VsbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbWF0cml4Q2VsbHMucHVzaChjZWxsKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB1cGRhdGUobmV3RGF0YSkge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuICAgICAgICAvLyB0aGlzLnVwZGF0ZVxyXG4gICAgICAgIHRoaXMudXBkYXRlQ2VsbHMoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZhcmlhYmxlTGFiZWxzKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5zaG93TGVnZW5kKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGVnZW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB1cGRhdGVWYXJpYWJsZUxhYmVscygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGxhYmVsQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwibGFiZWxcIik7XHJcbiAgICAgICAgdmFyIGxhYmVsWENsYXNzID0gbGFiZWxDbGFzcyArIFwiLXhcIjtcclxuICAgICAgICB2YXIgbGFiZWxZQ2xhc3MgPSBsYWJlbENsYXNzICsgXCIteVwiO1xyXG4gICAgICAgIHBsb3QubGFiZWxDbGFzcyA9IGxhYmVsQ2xhc3M7XHJcblxyXG5cclxuICAgICAgICB2YXIgbGFiZWxzWCA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiK2xhYmVsWENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShwbG90LnZhcmlhYmxlcywgKGQsIGkpPT5pKTtcclxuXHJcbiAgICAgICAgbGFiZWxzWC5lbnRlcigpLmFwcGVuZChcInRleHRcIikuYXR0cihcImNsYXNzXCIsIChkLCBpKSA9PiBsYWJlbENsYXNzICsgXCIgXCIgK2xhYmVsWENsYXNzK1wiIFwiKyBsYWJlbFhDbGFzcyArIFwiLVwiICsgaSk7XHJcblxyXG5cclxuICAgICAgICBsYWJlbHNYXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAoZCwgaSkgPT4gaSAqIHBsb3QuY2VsbFNpemUgKyBwbG90LmNlbGxTaXplIC8gMilcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIHBsb3QuaGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcImR4XCIsIC0yKVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIDUpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInJvdGF0ZSgtNDUsIFwiICsgKGkgKiBwbG90LmNlbGxTaXplICsgcGxvdC5jZWxsU2l6ZSAvIDIgICkgKyBcIiwgXCIgKyBwbG90LmhlaWdodCArIFwiKVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpXHJcblxyXG4gICAgICAgICAgICAvLyAuYXR0cihcImRvbWluYW50LWJhc2VsaW5lXCIsIFwiaGFuZ2luZ1wiKVxyXG4gICAgICAgICAgICAudGV4dCh2PT5wbG90LmxhYmVsQnlWYXJpYWJsZVt2XSk7XHJcblxyXG4gICAgICAgIGxhYmVsc1guZXhpdCgpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAvLy8vLy9cclxuXHJcbiAgICAgICAgdmFyIGxhYmVsc1kgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIitsYWJlbFlDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGxvdC52YXJpYWJsZXMpO1xyXG5cclxuICAgICAgICBsYWJlbHNZLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKTtcclxuXHJcblxyXG4gICAgICAgIGxhYmVsc1lcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAoZCwgaSkgPT4gaSAqIHBsb3QuY2VsbFNpemUgKyBwbG90LmNlbGxTaXplIC8gMilcclxuICAgICAgICAgICAgLmF0dHIoXCJkeFwiLCAtMilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIChkLCBpKSA9PiBsYWJlbENsYXNzICsgXCIgXCIgKyBsYWJlbFlDbGFzcyArXCIgXCIgKyBsYWJlbFlDbGFzcyArIFwiLVwiICsgaSlcclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcImhhbmdpbmdcIilcclxuICAgICAgICAgICAgLnRleHQodj0+cGxvdC5sYWJlbEJ5VmFyaWFibGVbdl0pO1xyXG5cclxuICAgICAgICBsYWJlbHNZLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUNlbGxzKCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGNlbGxDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJjZWxsXCIpO1xyXG4gICAgICAgIHZhciBjZWxsU2hhcGUgPSBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnR5cGU7XHJcblxyXG4gICAgICAgIHZhciBjZWxscyA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJnLlwiK2NlbGxDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGxvdC5jb3JyZWxhdGlvbi5tYXRyaXguY2VsbHMpO1xyXG5cclxuICAgICAgICB2YXIgY2VsbEVudGVyRyA9IGNlbGxzLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuY2xhc3NlZChjZWxsQ2xhc3MsIHRydWUpO1xyXG4gICAgICAgIGNlbGxzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYz0+IFwidHJhbnNsYXRlKFwiICsgKHBsb3QuY2VsbFNpemUgKiBjLmNvbCArIHBsb3QuY2VsbFNpemUgLyAyKSArIFwiLFwiICsgKHBsb3QuY2VsbFNpemUgKiBjLnJvdyArIHBsb3QuY2VsbFNpemUgLyAyKSArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgY2VsbHMuY2xhc3NlZChzZWxmLmNvbmZpZy5jc3NDbGFzc1ByZWZpeCArIFwic2VsZWN0YWJsZVwiLCAhIXNlbGYuc2NhdHRlclBsb3QpO1xyXG5cclxuICAgICAgICB2YXIgc2VsZWN0b3IgPSBcIio6bm90KC5jZWxsLXNoYXBlLVwiK2NlbGxTaGFwZStcIilcIjtcclxuICAgICAgIFxyXG4gICAgICAgIHZhciB3cm9uZ1NoYXBlcyA9IGNlbGxzLnNlbGVjdEFsbChzZWxlY3Rvcik7XHJcbiAgICAgICAgd3JvbmdTaGFwZXMucmVtb3ZlKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHNoYXBlcyA9IGNlbGxzLnNlbGVjdE9yQXBwZW5kKGNlbGxTaGFwZStcIi5jZWxsLXNoYXBlLVwiK2NlbGxTaGFwZSk7XHJcblxyXG4gICAgICAgIGlmIChwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnR5cGUgPT0gJ2NpcmNsZScpIHtcclxuXHJcbiAgICAgICAgICAgIHNoYXBlc1xyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJyXCIsIHBsb3QuY29ycmVsYXRpb24uc2hhcGUucmFkaXVzKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCAwKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnR5cGUgPT0gJ2VsbGlwc2UnKSB7XHJcbiAgICAgICAgICAgIC8vIGNlbGxzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYz0+IFwidHJhbnNsYXRlKDMwMCwxNTApIHJvdGF0ZShcIitwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnJvdGF0ZVZhbChjLnZhbHVlKStcIilcIik7XHJcbiAgICAgICAgICAgIHNoYXBlc1xyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJyeFwiLCBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnJhZGl1c1gpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInJ5XCIsIHBsb3QuY29ycmVsYXRpb24uc2hhcGUucmFkaXVzWSlcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY3hcIiwgMClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY3lcIiwgMClcclxuXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBjPT4gXCJyb3RhdGUoXCIgKyBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnJvdGF0ZVZhbChjLnZhbHVlKSArIFwiKVwiKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBpZiAocGxvdC5jb3JyZWxhdGlvbi5zaGFwZS50eXBlID09ICdyZWN0Jykge1xyXG4gICAgICAgICAgICBzaGFwZXNcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5zaXplKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5zaXplKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIC1wbG90LmNlbGxTaXplIC8gMilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieVwiLCAtcGxvdC5jZWxsU2l6ZSAvIDIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzaGFwZXMuc3R5bGUoXCJmaWxsXCIsIGM9PiBwbG90LmNvcnJlbGF0aW9uLmNvbG9yLnNjYWxlKGMudmFsdWUpKTtcclxuXHJcbiAgICAgICAgdmFyIG1vdXNlb3ZlckNhbGxiYWNrcyA9IFtdO1xyXG4gICAgICAgIHZhciBtb3VzZW91dENhbGxiYWNrcyA9IFtdO1xyXG5cclxuICAgICAgICBpZiAocGxvdC50b29sdGlwKSB7XHJcblxyXG4gICAgICAgICAgICBtb3VzZW92ZXJDYWxsYmFja3MucHVzaChjPT4ge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAuOSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IGMudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAuaHRtbChodG1sKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkMy5ldmVudC5wYWdlWSAtIDI4KSArIFwicHhcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MucHVzaChjPT4ge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy5oaWdobGlnaHRMYWJlbHMpIHtcclxuICAgICAgICAgICAgdmFyIGhpZ2hsaWdodENsYXNzID0gc2VsZi5jb25maWcuY3NzQ2xhc3NQcmVmaXggKyBcImhpZ2hsaWdodFwiO1xyXG4gICAgICAgICAgICB2YXIgeExhYmVsQ2xhc3MgPSBjPT5wbG90LmxhYmVsQ2xhc3MgKyBcIi14LVwiICsgYy5jb2w7XHJcbiAgICAgICAgICAgIHZhciB5TGFiZWxDbGFzcyA9IGM9PnBsb3QubGFiZWxDbGFzcyArIFwiLXktXCIgKyBjLnJvdztcclxuXHJcblxyXG4gICAgICAgICAgICBtb3VzZW92ZXJDYWxsYmFja3MucHVzaChjPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgeExhYmVsQ2xhc3MoYykpLmNsYXNzZWQoaGlnaGxpZ2h0Q2xhc3MsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB5TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBtb3VzZW91dENhbGxiYWNrcy5wdXNoKGM9PiB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHhMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHlMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGNlbGxzLm9uKFwibW91c2VvdmVyXCIsIGMgPT4ge1xyXG4gICAgICAgICAgICBtb3VzZW92ZXJDYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjaz0+Y2FsbGJhY2soYykpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGMgPT4ge1xyXG4gICAgICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjaz0+Y2FsbGJhY2soYykpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY2VsbHMub24oXCJjbGlja1wiLCBjPT57XHJcbiAgICAgICAgICAgc2VsZi50cmlnZ2VyKFwiY2VsbC1zZWxlY3RlZFwiLCBjKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG5cclxuICAgICAgICBjZWxscy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHVwZGF0ZUxlZ2VuZCgpIHtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIGxlZ2VuZFggPSB0aGlzLnBsb3Qud2lkdGggKyAxMDtcclxuICAgICAgICB2YXIgbGVnZW5kWSA9IDA7XHJcbiAgICAgICAgdmFyIGJhcldpZHRoID0gMTA7XHJcbiAgICAgICAgdmFyIGJhckhlaWdodCA9IHRoaXMucGxvdC5oZWlnaHQgLSAyO1xyXG4gICAgICAgIHZhciBzY2FsZSA9IHBsb3QuY29ycmVsYXRpb24uY29sb3Iuc2NhbGU7XHJcblxyXG4gICAgICAgIHBsb3QubGVnZW5kID0gbmV3IExlZ2VuZCh0aGlzLnN2ZywgdGhpcy5zdmdHLCBzY2FsZSwgbGVnZW5kWCwgbGVnZW5kWSkubGluZWFyR3JhZGllbnRCYXIoYmFyV2lkdGgsIGJhckhlaWdodCk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBhdHRhY2hTY2F0dGVyUGxvdChjb250YWluZXJTZWxlY3RvciwgY29uZmlnKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBjb25maWcgPSBjb25maWcgfHwge307XHJcblxyXG5cclxuICAgICAgICB2YXIgc2NhdHRlclBsb3RDb25maWcgPSB7XHJcbiAgICAgICAgICAgIGhlaWdodDogc2VsZi5wbG90LmhlaWdodCtzZWxmLmNvbmZpZy5tYXJnaW4udG9wKyBzZWxmLmNvbmZpZy5tYXJnaW4uYm90dG9tLFxyXG4gICAgICAgICAgICB3aWR0aDogc2VsZi5wbG90LmhlaWdodCtzZWxmLmNvbmZpZy5tYXJnaW4udG9wKyBzZWxmLmNvbmZpZy5tYXJnaW4uYm90dG9tLFxyXG4gICAgICAgICAgICBncm91cHM6e1xyXG4gICAgICAgICAgICAgICAga2V5OiBzZWxmLmNvbmZpZy5ncm91cHMua2V5LFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6IHNlbGYuY29uZmlnLmdyb3Vwcy5sYWJlbFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBndWlkZXM6IHRydWUsXHJcbiAgICAgICAgICAgIHNob3dMZWdlbmQ6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zY2F0dGVyUGxvdD10cnVlO1xyXG5cclxuICAgICAgICBzY2F0dGVyUGxvdENvbmZpZyA9IFV0aWxzLmRlZXBFeHRlbmQoc2NhdHRlclBsb3RDb25maWcsIGNvbmZpZyk7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5vbihcImNlbGwtc2VsZWN0ZWRcIiwgYz0+e1xyXG5cclxuXHJcblxyXG4gICAgICAgICAgICBzY2F0dGVyUGxvdENvbmZpZy54PXtcclxuICAgICAgICAgICAgICAgIGtleTogYy5yb3dWYXIsXHJcbiAgICAgICAgICAgICAgICBsYWJlbDogc2VsZi5wbG90LmxhYmVsQnlWYXJpYWJsZVtjLnJvd1Zhcl1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgc2NhdHRlclBsb3RDb25maWcueT17XHJcbiAgICAgICAgICAgICAgICBrZXk6IGMuY29sVmFyLFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6IHNlbGYucGxvdC5sYWJlbEJ5VmFyaWFibGVbYy5jb2xWYXJdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmKHNlbGYuc2NhdHRlclBsb3QgJiYgc2VsZi5zY2F0dGVyUGxvdCAhPT10cnVlKXtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2NhdHRlclBsb3Quc2V0Q29uZmlnKHNjYXR0ZXJQbG90Q29uZmlnKS5pbml0KCk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zY2F0dGVyUGxvdCA9IG5ldyBTY2F0dGVyUGxvdChjb250YWluZXJTZWxlY3Rvciwgc2VsZi5kYXRhLCBzY2F0dGVyUGxvdENvbmZpZyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF0dGFjaChcIlNjYXR0ZXJQbG90XCIsIHNlbGYuc2NhdHRlclBsb3QpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEQzRXh0ZW5zaW9uc3tcclxuXHJcbiAgICBzdGF0aWMgZXh0ZW5kKCl7XHJcblxyXG4gICAgICAgIGQzLnNlbGVjdGlvbi5lbnRlci5wcm90b3R5cGUuaW5zZXJ0U2VsZWN0b3IgPVxyXG4gICAgICAgICAgICBkMy5zZWxlY3Rpb24ucHJvdG90eXBlLmluc2VydFNlbGVjdG9yID0gZnVuY3Rpb24oc2VsZWN0b3IsIGJlZm9yZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFV0aWxzLmluc2VydFNlbGVjdG9yKHRoaXMsIHNlbGVjdG9yLCBiZWZvcmUpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgZDMuc2VsZWN0aW9uLmVudGVyLnByb3RvdHlwZS5hcHBlbmRTZWxlY3RvciA9XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdGlvbi5wcm90b3R5cGUuYXBwZW5kU2VsZWN0b3IgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFV0aWxzLmFwcGVuZFNlbGVjdG9yKHRoaXMsIHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZDMuc2VsZWN0aW9uLmVudGVyLnByb3RvdHlwZS5zZWxlY3RPckFwcGVuZCA9XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdGlvbi5wcm90b3R5cGUuc2VsZWN0T3JBcHBlbmQgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFV0aWxzLnNlbGVjdE9yQXBwZW5kKHRoaXMsIHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZDMuc2VsZWN0aW9uLmVudGVyLnByb3RvdHlwZS5zZWxlY3RPckluc2VydCA9XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdGlvbi5wcm90b3R5cGUuc2VsZWN0T3JJbnNlcnQgPSBmdW5jdGlvbihzZWxlY3RvciwgYmVmb3JlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVXRpbHMuc2VsZWN0T3JJbnNlcnQodGhpcywgc2VsZWN0b3IsIGJlZm9yZSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG5cclxuXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDaGFydCwgQ2hhcnRDb25maWd9IGZyb20gXCIuL2NoYXJ0XCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7TGVnZW5kfSBmcm9tICcuL2xlZ2VuZCdcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgSGVhdG1hcENvbmZpZyBleHRlbmRzIENoYXJ0Q29uZmlnIHtcclxuXHJcbiAgICBzdmdDbGFzcyA9ICdvZGMtaGVhdG1hcCc7XHJcbiAgICBzaG93VG9vbHRpcCA9IHRydWU7IC8vc2hvdyB0b29sdGlwIG9uIGRvdCBob3ZlclxyXG4gICAgdG9vbHRpcCA9IHtcclxuICAgICAgICAgbm9EYXRhVGV4dDogXCJOL0FcIlxyXG4gICAgfTtcclxuICAgIHNob3dMZWdlbmQgPSB0cnVlO1xyXG4gICAgbGVnZW5kPXtcclxuICAgICAgICB3aWR0aDogMzAsXHJcblxyXG4gICAgICAgIGRlY2ltYWxQbGFjZXM6IHVuZGVmaW5lZCxcclxuICAgICAgICBmb3JtYXR0ZXI6IHYgPT4gdGhpcy5sZWdlbmQuZGVjaW1hbFBsYWNlcyA9PT0gdW5kZWZpbmVkID8gdiA6IE51bWJlcih2KS50b0ZpeGVkKHRoaXMubGVnZW5kLmRlY2ltYWxQbGFjZXMpXHJcbiAgICB9XHJcbiAgICBoaWdobGlnaHRMYWJlbHMgPSB0cnVlO1xyXG4gICAgeD17Ly8gWCBheGlzIGNvbmZpZ1xyXG4gICAgICAgIHRpdGxlOiAnJywgLy8gYXhpcyB0aXRsZVxyXG4gICAgICAgIGtleTogMCxcclxuICAgICAgICB2YWx1ZTogKGQpID0+IGRbdGhpcy54LmtleV0sIC8vIHggdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICByb3RhdGVMYWJlbHM6IHRydWUsXHJcbiAgICAgICAgc29ydExhYmVsczogZmFsc2UsXHJcbiAgICAgICAgc29ydENvbXBhcmF0b3I6IChhLCBiKT0+IFV0aWxzLmlzTnVtYmVyKGEpID8gYS1iIDogYS5sb2NhbGVDb21wYXJlKGIpLFxyXG4gICAgICAgIGdyb3Vwczoge1xyXG4gICAgICAgICAgICBrZXlzOiBbXSxcclxuICAgICAgICAgICAgbGFiZWxzOiBbXSxcclxuICAgICAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IGRba2V5XSxcclxuICAgICAgICAgICAgb3ZlcmxhcDoge1xyXG4gICAgICAgICAgICAgICAgdG9wOiAyMCxcclxuICAgICAgICAgICAgICAgIGJvdHRvbTogMjBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9ybWF0dGVyOiB1bmRlZmluZWQgLy8gdmFsdWUgZm9ybWF0dGVyIGZ1bmN0aW9uXHJcbiAgICAgICAgXHJcbiAgICB9O1xyXG4gICAgeT17Ly8gWSBheGlzIGNvbmZpZ1xyXG4gICAgICAgIHRpdGxlOiAnJywgLy8gYXhpcyB0aXRsZSxcclxuICAgICAgICByb3RhdGVMYWJlbHM6IHRydWUsXHJcbiAgICAgICAga2V5OiAxLFxyXG4gICAgICAgIHZhbHVlOiAoZCkgPT4gZFt0aGlzLnkua2V5XSwgLy8geSB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgIHNvcnRMYWJlbHM6IGZhbHNlLFxyXG4gICAgICAgIHNvcnRDb21wYXJhdG9yOiAoYSwgYik9PiBVdGlscy5pc051bWJlcihiKSA/IGItYSA6IGIubG9jYWxlQ29tcGFyZShhKSxcclxuICAgICAgICBncm91cHM6IHtcclxuICAgICAgICAgICAga2V5czogW10sXHJcbiAgICAgICAgICAgIGxhYmVsczogW10sXHJcbiAgICAgICAgICAgIHZhbHVlOiAoZCwga2V5KSA9PiBkW2tleV0sXHJcbiAgICAgICAgICAgIG92ZXJsYXA6IHtcclxuICAgICAgICAgICAgICAgIGxlZnQ6IDIwLFxyXG4gICAgICAgICAgICAgICAgcmlnaHQ6IDIwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGZvcm1hdHRlcjogdW5kZWZpbmVkLy8gdmFsdWUgZm9ybWF0dGVyIGZ1bmN0aW9uXHJcbiAgICB9O1xyXG4gICAgeiA9IHtcclxuICAgICAgICBrZXk6IDIsXHJcbiAgICAgICAgdmFsdWU6IChkKSA9PiAgZFt0aGlzLnoua2V5XSxcclxuICAgICAgICBub3RBdmFpbGFibGVWYWx1ZTogKHYpID0+ICB2ID09PSBudWxsIHx8IHY9PT11bmRlZmluZWQsXHJcblxyXG4gICAgICAgIGRlY2ltYWxQbGFjZXM6IHVuZGVmaW5lZCxcclxuICAgICAgICBmb3JtYXR0ZXI6IHYgPT4gdGhpcy56LmRlY2ltYWxQbGFjZXMgPT09IHVuZGVmaW5lZCA/IHYgOiBOdW1iZXIodikudG9GaXhlZCh0aGlzLnouZGVjaW1hbFBsYWNlcykvLyB2YWx1ZSBmb3JtYXR0ZXIgZnVuY3Rpb25cclxuXHJcbiAgICB9O1xyXG4gICAgY29sb3IgPSB7XHJcbiAgICAgICAgbm9EYXRhQ29sb3I6IFwid2hpdGVcIixcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIixcclxuICAgICAgICByYW5nZTogW1wiZGFya2JsdWVcIiwgXCJsaWdodHNreWJsdWVcIiwgXCJvcmFuZ2VcIiwgXCJjcmltc29uXCIsIFwiZGFya3JlZFwiXVxyXG4gICAgfTtcclxuICAgIGNlbGwgPSB7XHJcbiAgICAgICAgd2lkdGg6IHVuZGVmaW5lZCxcclxuICAgICAgICBoZWlnaHQ6IHVuZGVmaW5lZCxcclxuICAgICAgICBzaXplTWluOiAxNSxcclxuICAgICAgICBzaXplTWF4OiAyNTAsXHJcbiAgICAgICAgcGFkZGluZzogMFxyXG4gICAgfTtcclxuICAgIG1hcmdpbiA9IHtcclxuICAgICAgICBsZWZ0OiA2MCxcclxuICAgICAgICByaWdodDogNTAsXHJcbiAgICAgICAgdG9wOiAzMCxcclxuICAgICAgICBib3R0b206IDgwXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgaWYgKGN1c3RvbSkge1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vL1RPRE8gcmVmYWN0b3JcclxuZXhwb3J0IGNsYXNzIEhlYXRtYXAgZXh0ZW5kcyBDaGFydCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBzdXBlcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBuZXcgSGVhdG1hcENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgSGVhdG1hcENvbmZpZyhjb25maWcpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdFBsb3QoKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG1hcmdpbiA9IHRoaXMuY29uZmlnLm1hcmdpbjtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueD17fTtcclxuICAgICAgICB0aGlzLnBsb3QueT17fTtcclxuICAgICAgICB0aGlzLnBsb3Quej17XHJcbiAgICAgICAgICAgIG1hdHJpeGVzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGNlbGxzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGNvbG9yOiB7fSxcclxuICAgICAgICAgICAgc2hhcGU6IHt9XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBWYWx1ZXMoKTtcclxuXHJcbiAgICAgICAgdmFyIHRpdGxlUmVjdFdpZHRoID0gNjtcclxuICAgICAgICB0aGlzLnBsb3QueC5vdmVybGFwID17XHJcbiAgICAgICAgICAgIHRvcDowLFxyXG4gICAgICAgICAgICBib3R0b206IDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmKHRoaXMucGxvdC5ncm91cEJ5WCl7XHJcbiAgICAgICAgICAgIGxldCBkZXB0aCA9IHNlbGYuY29uZmlnLnguZ3JvdXBzLmtleXMubGVuZ3RoO1xyXG4gICAgICAgICAgICBsZXQgYWxsVGl0bGVzV2lkdGggPSBkZXB0aCoodGl0bGVSZWN0V2lkdGgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wbG90Lngub3ZlcmxhcC5ib3R0b20gPSBzZWxmLmNvbmZpZy54Lmdyb3Vwcy5vdmVybGFwLmJvdHRvbSA7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC54Lm92ZXJsYXAudG9wID0gc2VsZi5jb25maWcueC5ncm91cHMub3ZlcmxhcC50b3ArIGFsbFRpdGxlc1dpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWFyZ2luLnRvcCA9IGNvbmYubWFyZ2luLnJpZ2h0ICsgY29uZi54Lmdyb3Vwcy5vdmVybGFwLnRvcDtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lm1hcmdpbi5ib3R0b20gPSBjb25mLm1hcmdpbi5ib3R0b20gKyBjb25mLnguZ3JvdXBzLm92ZXJsYXAuYm90dG9tO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMucGxvdC55Lm92ZXJsYXAgPXtcclxuICAgICAgICAgICAgbGVmdDowLFxyXG4gICAgICAgICAgICByaWdodDogMFxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICBpZih0aGlzLnBsb3QuZ3JvdXBCeVkpe1xyXG4gICAgICAgICAgICBsZXQgZGVwdGggPSBzZWxmLmNvbmZpZy55Lmdyb3Vwcy5rZXlzLmxlbmd0aDtcclxuICAgICAgICAgICAgbGV0IGFsbFRpdGxlc1dpZHRoID0gZGVwdGgqKHRpdGxlUmVjdFdpZHRoKTtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lnkub3ZlcmxhcC5yaWdodCA9IHNlbGYuY29uZmlnLnkuZ3JvdXBzLm92ZXJsYXAubGVmdCArIGFsbFRpdGxlc1dpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QueS5vdmVybGFwLmxlZnQgPSBzZWxmLmNvbmZpZy55Lmdyb3Vwcy5vdmVybGFwLmxlZnQ7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5tYXJnaW4ubGVmdCA9IGNvbmYubWFyZ2luLmxlZnQgKyB0aGlzLnBsb3QueS5vdmVybGFwLmxlZnQ7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5tYXJnaW4ucmlnaHQgPSBjb25mLm1hcmdpbi5yaWdodCArIHRoaXMucGxvdC55Lm92ZXJsYXAucmlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxvdC5zaG93TGVnZW5kID0gY29uZi5zaG93TGVnZW5kO1xyXG4gICAgICAgIGlmKHRoaXMucGxvdC5zaG93TGVnZW5kKXtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lm1hcmdpbi5yaWdodCArPSBjb25mLmxlZ2VuZC53aWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb21wdXRlUGxvdFNpemUoKTtcclxuICAgICAgICB0aGlzLnNldHVwWlNjYWxlKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwVmFsdWVzKCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBjb25maWcgPSBzZWxmLmNvbmZpZztcclxuICAgICAgICB2YXIgeCA9IHNlbGYucGxvdC54O1xyXG4gICAgICAgIHZhciB5ID0gc2VsZi5wbG90Lnk7XHJcbiAgICAgICAgdmFyIHogPSBzZWxmLnBsb3QuejtcclxuXHJcblxyXG4gICAgICAgIHgudmFsdWUgPSBkID0+IGNvbmZpZy54LnZhbHVlLmNhbGwoY29uZmlnLCBkKTtcclxuICAgICAgICB5LnZhbHVlID0gZCA9PiBjb25maWcueS52YWx1ZS5jYWxsKGNvbmZpZywgZCk7XHJcbiAgICAgICAgei52YWx1ZSA9IGQgPT4gY29uZmlnLnoudmFsdWUuY2FsbChjb25maWcsIGQpO1xyXG5cclxuICAgICAgICB4LnVuaXF1ZVZhbHVlcyA9IFtdO1xyXG4gICAgICAgIHkudW5pcXVlVmFsdWVzID0gW107XHJcblxyXG5cclxuXHJcbiAgICAgICAgc2VsZi5wbG90Lmdyb3VwQnlZID0gISFjb25maWcueS5ncm91cHMua2V5cy5sZW5ndGg7XHJcbiAgICAgICAgc2VsZi5wbG90Lmdyb3VwQnlYID0gISFjb25maWcueC5ncm91cHMua2V5cy5sZW5ndGg7XHJcblxyXG4gICAgICAgIHkuZ3JvdXBzID0ge1xyXG4gICAgICAgICAgICBrZXk6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgbGFiZWw6ICcnLFxyXG4gICAgICAgICAgICB2YWx1ZXM6IFtdLFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogbnVsbCxcclxuICAgICAgICAgICAgbGV2ZWw6MCxcclxuICAgICAgICAgICAgaW5kZXg6IDAsXHJcbiAgICAgICAgICAgIGxhc3RJbmRleDogMFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgeC5ncm91cHMgPSB7XHJcbiAgICAgICAgICAgIGtleTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBsYWJlbDogJycsXHJcbiAgICAgICAgICAgIHZhbHVlczogW10sXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBudWxsLFxyXG4gICAgICAgICAgICBsZXZlbDowLFxyXG4gICAgICAgICAgICBpbmRleDogMCxcclxuICAgICAgICAgICAgbGFzdEluZGV4OiAwXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIHZhbHVlTWFwID0ge307XHJcbiAgICAgICAgdmFyIG1pblogPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdmFyIG1heFogPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5kYXRhLmZvckVhY2goZD0+e1xyXG5cclxuICAgICAgICAgICAgdmFyIHhWYWwgPSB4LnZhbHVlKGQpO1xyXG4gICAgICAgICAgICB2YXIgeVZhbCA9IHkudmFsdWUoZCk7XHJcbiAgICAgICAgICAgIHZhciB6VmFsUmF3ID0gei52YWx1ZShkKTtcclxuICAgICAgICAgICAgdmFyIHpWYWwgPSBjb25maWcuei5ub3RBdmFpbGFibGVWYWx1ZSh6VmFsUmF3KSA/IHVuZGVmaW5lZCA6IHBhcnNlRmxvYXQoelZhbFJhdyk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgIGlmKHgudW5pcXVlVmFsdWVzLmluZGV4T2YoeFZhbCk9PT0tMSl7XHJcbiAgICAgICAgICAgICAgICB4LnVuaXF1ZVZhbHVlcy5wdXNoKHhWYWwpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZih5LnVuaXF1ZVZhbHVlcy5pbmRleE9mKHlWYWwpPT09LTEpe1xyXG4gICAgICAgICAgICAgICAgeS51bmlxdWVWYWx1ZXMucHVzaCh5VmFsKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGdyb3VwWSA9IHkuZ3JvdXBzO1xyXG4gICAgICAgICAgICBpZihzZWxmLnBsb3QuZ3JvdXBCeVkpe1xyXG4gICAgICAgICAgICAgICAgZ3JvdXBZID0gdGhpcy51cGRhdGVHcm91cHMoZCwgeVZhbCwgeS5ncm91cHMsIGNvbmZpZy55Lmdyb3Vwcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGdyb3VwWCA9IHguZ3JvdXBzO1xyXG4gICAgICAgICAgICBpZihzZWxmLnBsb3QuZ3JvdXBCeVgpe1xyXG5cclxuICAgICAgICAgICAgICAgIGdyb3VwWCA9IHRoaXMudXBkYXRlR3JvdXBzKGQsIHhWYWwsIHguZ3JvdXBzLCBjb25maWcueC5ncm91cHMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZighdmFsdWVNYXBbZ3JvdXBZLmluZGV4XSl7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZU1hcFtncm91cFkuaW5kZXhdPXt9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZighdmFsdWVNYXBbZ3JvdXBZLmluZGV4XVtncm91cFguaW5kZXhdKXtcclxuICAgICAgICAgICAgICAgIHZhbHVlTWFwW2dyb3VwWS5pbmRleF1bZ3JvdXBYLmluZGV4XSA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKCF2YWx1ZU1hcFtncm91cFkuaW5kZXhdW2dyb3VwWC5pbmRleF1beVZhbF0pe1xyXG4gICAgICAgICAgICAgICAgdmFsdWVNYXBbZ3JvdXBZLmluZGV4XVtncm91cFguaW5kZXhdW3lWYWxdPXt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhbHVlTWFwW2dyb3VwWS5pbmRleF1bZ3JvdXBYLmluZGV4XVt5VmFsXVt4VmFsXT16VmFsO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGlmKG1pblogPT09IHVuZGVmaW5lZCB8fCB6VmFsPG1pblope1xyXG4gICAgICAgICAgICAgICAgbWluWiA9IHpWYWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYobWF4WiA9PT0gdW5kZWZpbmVkIHx8IHpWYWw+bWF4Wil7XHJcbiAgICAgICAgICAgICAgICBtYXhaID0gelZhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHNlbGYucGxvdC52YWx1ZU1hcCA9IHZhbHVlTWFwO1xyXG5cclxuXHJcbiAgICAgICAgaWYoIXNlbGYucGxvdC5ncm91cEJ5WCkge1xyXG4gICAgICAgICAgICB4Lmdyb3Vwcy52YWx1ZXMgPSB4LnVuaXF1ZVZhbHVlcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCFzZWxmLnBsb3QuZ3JvdXBCeVkpIHtcclxuICAgICAgICAgICAgeS5ncm91cHMudmFsdWVzID0geS51bmlxdWVWYWx1ZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB4LmdhcHM9W107XHJcbiAgICAgICAgeC50b3RhbFZhbHVlc0NvdW50PTA7XHJcbiAgICAgICAgeC5hbGxWYWx1ZXNMaXN0PVtdO1xyXG4gICAgICAgIHRoaXMuc29ydEdyb3Vwcyh4LCB4Lmdyb3VwcywgY29uZmlnLngpO1xyXG5cclxuXHJcbiAgICAgICAgeS5nYXBzPVtdO1xyXG4gICAgICAgIHkudG90YWxWYWx1ZXNDb3VudD0wO1xyXG4gICAgICAgIHkuYWxsVmFsdWVzTGlzdD1bXTtcclxuICAgICAgICB0aGlzLnNvcnRHcm91cHMoeSwgeS5ncm91cHMsIGNvbmZpZy55KTtcclxuXHJcbiAgICAgICAgei5taW4gPSBtaW5aO1xyXG4gICAgICAgIHoubWF4ID0gbWF4WjtcclxuXHJcbiAgICAgICAgdGhpcy5idWlsZENlbGxzKCk7XHJcblxyXG4gICAgfVxyXG4gICAgYnVpbGRDZWxscygpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgY29uZmlnID0gc2VsZi5jb25maWc7XHJcbiAgICAgICAgdmFyIHggPSBzZWxmLnBsb3QueDtcclxuICAgICAgICB2YXIgeSA9IHNlbGYucGxvdC55O1xyXG4gICAgICAgIHZhciB6ID0gc2VsZi5wbG90Lno7XHJcbiAgICAgICAgdmFyIHZhbHVlTWFwID0gc2VsZi5wbG90LnZhbHVlTWFwO1xyXG5cclxuICAgICAgICB2YXIgbWF0cml4Q2VsbHMgPSBzZWxmLnBsb3QuY2VsbHMgPVtdO1xyXG4gICAgICAgIHZhciBtYXRyaXggPSBzZWxmLnBsb3QubWF0cml4ID0gW107XHJcblxyXG4gICAgICAgIHkuYWxsVmFsdWVzTGlzdC5mb3JFYWNoKCh2MSwgaSk9PiB7XHJcbiAgICAgICAgICAgIHZhciByb3cgPSBbXTtcclxuICAgICAgICAgICAgbWF0cml4LnB1c2gocm93KTtcclxuXHJcbiAgICAgICAgICAgIHguYWxsVmFsdWVzTGlzdC5mb3JFYWNoKCh2MiwgaikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHpWYWwgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgICAgICAgICAgelZhbCA9dmFsdWVNYXBbdjEuZ3JvdXAuaW5kZXhdW3YyLmdyb3VwLmluZGV4XVt2MS52YWxdW3YyLnZhbF1cclxuICAgICAgICAgICAgICAgIH1jYXRjaChlKXtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGNlbGwgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcm93VmFyOiB2MSxcclxuICAgICAgICAgICAgICAgICAgICBjb2xWYXI6IHYyLFxyXG4gICAgICAgICAgICAgICAgICAgIHJvdzogaSxcclxuICAgICAgICAgICAgICAgICAgICBjb2w6IGosXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHpWYWxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByb3cucHVzaChjZWxsKTtcclxuXHJcbiAgICAgICAgICAgICAgICBtYXRyaXhDZWxscy5wdXNoKGNlbGwpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlR3JvdXBzKGQsYXhpc1ZhbCwgcm9vdEdyb3VwLCBheGlzR3JvdXBzQ29uZmlnKXtcclxuXHJcbiAgICAgICAgdmFyIGNvbmZpZyA9IHRoaXMuY29uZmlnO1xyXG4gICAgICAgIHZhciBjdXJyZW50R3JvdXAgPSByb290R3JvdXA7XHJcbiAgICAgICAgYXhpc0dyb3Vwc0NvbmZpZy5rZXlzLmZvckVhY2goKGdyb3VwS2V5LCBncm91cEtleUluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRHcm91cC5rZXkgPSBncm91cEtleTtcclxuXHJcbiAgICAgICAgICAgIGlmKCFjdXJyZW50R3JvdXAuY2hpbGRyZW4pe1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLmNoaWxkcmVuID0ge307XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBncm91cGluZ1ZhbHVlID0gYXhpc0dyb3Vwc0NvbmZpZy52YWx1ZS5jYWxsKGNvbmZpZywgZCwgZ3JvdXBLZXkpO1xyXG5cclxuICAgICAgICAgICAgaWYoIWN1cnJlbnRHcm91cC5jaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShncm91cGluZ1ZhbHVlKSl7XHJcbiAgICAgICAgICAgICAgICByb290R3JvdXAubGFzdEluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAuY2hpbGRyZW5bZ3JvdXBpbmdWYWx1ZV0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBncm91cGluZ1ZhbHVlOiBncm91cGluZ1ZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGxldmVsOiBjdXJyZW50R3JvdXAubGV2ZWwgKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4OiByb290R3JvdXAubGFzdEluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgIGtleTogZ3JvdXBLZXlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY3VycmVudEdyb3VwID0gY3VycmVudEdyb3VwLmNoaWxkcmVuW2dyb3VwaW5nVmFsdWVdO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZihjdXJyZW50R3JvdXAudmFsdWVzLmluZGV4T2YoYXhpc1ZhbCk9PT0tMSl7XHJcbiAgICAgICAgICAgIGN1cnJlbnRHcm91cC52YWx1ZXMucHVzaChheGlzVmFsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjdXJyZW50R3JvdXA7XHJcbiAgICB9XHJcblxyXG4gICAgc29ydEdyb3VwcyhheGlzLCBncm91cCwgYXhpc0NvbmZpZywgZ2Fwcyl7XHJcbiAgICAgICAgaWYoYXhpc0NvbmZpZy5ncm91cHMubGFiZWxzICYmIGF4aXNDb25maWcuZ3JvdXBzLmxhYmVscy5sZW5ndGg+Z3JvdXAubGV2ZWwpe1xyXG4gICAgICAgICAgICBncm91cC5sYWJlbCA9IGF4aXNDb25maWcuZ3JvdXBzLmxhYmVsc1tncm91cC5sZXZlbF07XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGdyb3VwLmxhYmVsID0gZ3JvdXAua2V5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIWdhcHMpe1xyXG4gICAgICAgICAgICBnYXBzID0gWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihnYXBzLmxlbmd0aDw9Z3JvdXAubGV2ZWwpe1xyXG4gICAgICAgICAgICBnYXBzLnB1c2goMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBncm91cC5hbGxWYWx1ZXNDb3VudCA9IGdyb3VwLmFsbFZhbHVlc0NvdW50IHx8IDA7XHJcbiAgICAgICAgZ3JvdXAuYWxsVmFsdWVzQmVmb3JlQ291bnQgPSBncm91cC5hbGxWYWx1ZXNCZWZvcmVDb3VudCB8fCAwO1xyXG5cclxuICAgICAgICBncm91cC5nYXBzID0gZ2Fwcy5zbGljZSgpO1xyXG4gICAgICAgIGdyb3VwLmdhcHNCZWZvcmUgPSBnYXBzLnNsaWNlKCk7XHJcblxyXG5cclxuICAgICAgICBncm91cC5nYXBzU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcHNTaXplKGdyb3VwLmdhcHMpO1xyXG4gICAgICAgIGdyb3VwLmdhcHNCZWZvcmVTaXplID0gZ3JvdXAuZ2Fwc1NpemU7XHJcbiAgICAgICAgaWYoZ3JvdXAudmFsdWVzKXtcclxuICAgICAgICAgICAgaWYoYXhpc0NvbmZpZy5zb3J0TGFiZWxzKXtcclxuICAgICAgICAgICAgICAgIGdyb3VwLnZhbHVlcy5zb3J0KGF4aXNDb25maWcuc29ydENvbXBhcmF0b3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdyb3VwLnZhbHVlcy5mb3JFYWNoKHY9PmF4aXMuYWxsVmFsdWVzTGlzdC5wdXNoKHt2YWw6diwgZ3JvdXA6IGdyb3VwfSkpO1xyXG4gICAgICAgICAgICBncm91cC5hbGxWYWx1ZXNCZWZvcmVDb3VudCA9IGF4aXMudG90YWxWYWx1ZXNDb3VudDtcclxuICAgICAgICAgICAgYXhpcy50b3RhbFZhbHVlc0NvdW50ICs9IGdyb3VwLnZhbHVlcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGdyb3VwLmFsbFZhbHVlc0NvdW50ICs9Z3JvdXAudmFsdWVzLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdyb3VwLmNoaWxkcmVuTGlzdCA9IFtdO1xyXG4gICAgICAgIGlmKGdyb3VwLmNoaWxkcmVuKXtcclxuICAgICAgICAgICAgdmFyIGNoaWxkcmVuQ291bnQ9MDtcclxuXHJcbiAgICAgICAgICAgIGZvcih2YXIgY2hpbGRQcm9wIGluIGdyb3VwLmNoaWxkcmVuKXtcclxuICAgICAgICAgICAgICAgIGlmKGdyb3VwLmNoaWxkcmVuLmhhc093blByb3BlcnR5KGNoaWxkUHJvcCkpe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IGdyb3VwLmNoaWxkcmVuW2NoaWxkUHJvcF07XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAuY2hpbGRyZW5MaXN0LnB1c2goY2hpbGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuQ291bnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3J0R3JvdXBzKGF4aXMsIGNoaWxkLCBheGlzQ29uZmlnLCBnYXBzKTtcclxuICAgICAgICAgICAgICAgICAgICBncm91cC5hbGxWYWx1ZXNDb3VudCArPWNoaWxkLmFsbFZhbHVlc0NvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGdhcHNbZ3JvdXAubGV2ZWxdKz0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihnYXBzICYmIGNoaWxkcmVuQ291bnQ+MSl7XHJcbiAgICAgICAgICAgICAgICBnYXBzW2dyb3VwLmxldmVsXS09MTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZ3JvdXAuZ2Fwc0luc2lkZSA9IFtdO1xyXG4gICAgICAgICAgICBnYXBzLmZvckVhY2goKGQsaSk9PntcclxuICAgICAgICAgICAgICAgIGdyb3VwLmdhcHNJbnNpZGUucHVzaChkLShncm91cC5nYXBzQmVmb3JlW2ldfHwgMCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZ3JvdXAuZ2Fwc0luc2lkZVNpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBzU2l6ZShncm91cC5nYXBzSW5zaWRlKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGF4aXMuZ2Fwcy5sZW5ndGggPCBnYXBzLmxlbmd0aCl7XHJcbiAgICAgICAgICAgICAgICBheGlzLmdhcHMgPSBnYXBzO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY29tcHV0ZUdhcFNpemUoZ2FwTGV2ZWwpe1xyXG4gICAgICAgIHJldHVybiAyNC8oZ2FwTGV2ZWwgKyAxKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY29tcHV0ZUdhcHNTaXplKGdhcHMpe1xyXG4gICAgICAgIHZhciBnYXBzU2l6ZSA9IDA7XHJcbiAgICAgICAgZ2Fwcy5mb3JFYWNoKChnYXBzTnVtYmVyLCBnYXBzTGV2ZWwpPT4gZ2Fwc1NpemUgKz0gZ2Fwc051bWJlciAqIEhlYXRtYXAuY29tcHV0ZUdhcFNpemUoZ2Fwc0xldmVsKSk7XHJcbiAgICAgICAgcmV0dXJuIGdhcHNTaXplO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXB1dGVQbG90U2l6ZSgpIHtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICB2YXIgbWFyZ2luID0gcGxvdC5tYXJnaW47XHJcbiAgICAgICAgdmFyIGF2YWlsYWJsZVdpZHRoID0gVXRpbHMuYXZhaWxhYmxlV2lkdGgodGhpcy5jb25maWcud2lkdGgsIHRoaXMuZ2V0QmFzZUNvbnRhaW5lcigpLCB0aGlzLnBsb3QubWFyZ2luKTtcclxuICAgICAgICB2YXIgYXZhaWxhYmxlSGVpZ2h0ID0gVXRpbHMuYXZhaWxhYmxlSGVpZ2h0KHRoaXMuY29uZmlnLmhlaWdodCwgdGhpcy5nZXRCYXNlQ29udGFpbmVyKCksIHRoaXMucGxvdC5tYXJnaW4pO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IGF2YWlsYWJsZVdpZHRoO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBhdmFpbGFibGVIZWlnaHQ7XHJcblxyXG4gICAgICAgIHZhciB4R2Fwc1NpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBzU2l6ZShwbG90LnguZ2Fwcyk7XHJcblxyXG5cclxuICAgICAgICB2YXIgY29tcHV0ZWRDZWxsV2lkdGggPSBNYXRoLm1heChjb25mLmNlbGwuc2l6ZU1pbiwgTWF0aC5taW4oY29uZi5jZWxsLnNpemVNYXgsIChhdmFpbGFibGVXaWR0aC14R2Fwc1NpemUpIC8gdGhpcy5wbG90LngudG90YWxWYWx1ZXNDb3VudCkpO1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy53aWR0aCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5jZWxsLndpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuY2VsbFdpZHRoID0gY29tcHV0ZWRDZWxsV2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxXaWR0aCA9IHRoaXMuY29uZmlnLmNlbGwud2lkdGg7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMucGxvdC5jZWxsV2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsV2lkdGggPSBjb21wdXRlZENlbGxXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgd2lkdGggPSB0aGlzLnBsb3QuY2VsbFdpZHRoICogdGhpcy5wbG90LngudG90YWxWYWx1ZXNDb3VudCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0K3hHYXBzU2l6ZTtcclxuXHJcbiAgICAgICAgdmFyIHlHYXBzU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcHNTaXplKHBsb3QueS5nYXBzKTtcclxuICAgICAgICB2YXIgY29tcHV0ZWRDZWxsSGVpZ2h0ID0gTWF0aC5tYXgoY29uZi5jZWxsLnNpemVNaW4sIE1hdGgubWluKGNvbmYuY2VsbC5zaXplTWF4LCAoYXZhaWxhYmxlSGVpZ2h0LXlHYXBzU2l6ZSkgLyB0aGlzLnBsb3QueS50b3RhbFZhbHVlc0NvdW50KSk7XHJcbiAgICAgICAgaWYodGhpcy5jb25maWcuaGVpZ2h0KXtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5jZWxsLmhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxIZWlnaHQgPSBjb21wdXRlZENlbGxIZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsSGVpZ2h0ID0gdGhpcy5jb25maWcuY2VsbC5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMucGxvdC5jZWxsSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuY2VsbEhlaWdodCA9IGNvbXB1dGVkQ2VsbEhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGhlaWdodCA9IHRoaXMucGxvdC5jZWxsSGVpZ2h0ICogdGhpcy5wbG90LnkudG90YWxWYWx1ZXNDb3VudCArIG1hcmdpbi50b3AgKyBtYXJnaW4uYm90dG9tICsgeUdhcHNTaXplO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5wbG90LndpZHRoID0gd2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodDtcclxuICAgICAgICB0aGlzLnBsb3QuaGVpZ2h0ID1oZWlnaHQgLW1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBzZXR1cFpTY2FsZSgpIHtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBjb25maWcgPSBzZWxmLmNvbmZpZztcclxuICAgICAgICB2YXIgeiA9IHNlbGYucGxvdC56O1xyXG4gICAgICAgIHZhciByYW5nZSA9IGNvbmZpZy5jb2xvci5yYW5nZTtcclxuICAgICAgICB2YXIgZXh0ZW50ID0gei5tYXggLSB6Lm1pbjtcclxuICAgICAgICBpZihjb25maWcuY29sb3Iuc2NhbGU9PVwibG9nXCIpe1xyXG4gICAgICAgICAgICB6LmRvbWFpbiA9IFtdO1xyXG4gICAgICAgICAgICByYW5nZS5mb3JFYWNoKChjLCBpKT0+e1xyXG4gICAgICAgICAgICAgICAgdmFyIHYgPSB6Lm1pbiArIChleHRlbnQvTWF0aC5wb3coMTAsIGkpKTtcclxuICAgICAgICAgICAgICAgIHouZG9tYWluLnVuc2hpZnQodilcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHouZG9tYWluID0gW107XHJcbiAgICAgICAgICAgIHJhbmdlLmZvckVhY2goKGMsIGkpPT57XHJcbiAgICAgICAgICAgICAgICB2YXIgdiA9IHoubWluICsgKGV4dGVudCAqIChpLyhyYW5nZS5sZW5ndGgtMSkpKTtcclxuICAgICAgICAgICAgICAgIHouZG9tYWluLnB1c2godilcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHouZG9tYWluWzBdPXoubWluOyAvL3JlbW92aW5nIHVubmVjZXNzYXJ5IGZsb2F0aW5nIHBvaW50c1xyXG4gICAgICAgIHouZG9tYWluW3ouZG9tYWluLmxlbmd0aC0xXT16Lm1heDsgLy9yZW1vdmluZyB1bm5lY2Vzc2FyeSBmbG9hdGluZyBwb2ludHNcclxuICAgICAgICBjb25zb2xlLmxvZyh6LmRvbWFpbik7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhyYW5nZSk7XHJcbiAgICAgICAgcGxvdC56LmNvbG9yLnNjYWxlID0gZDMuc2NhbGVbY29uZmlnLmNvbG9yLnNjYWxlXSgpLmRvbWFpbih6LmRvbWFpbikucmFuZ2UocmFuZ2UpO1xyXG4gICAgICAgIHZhciBzaGFwZSA9IHBsb3Quei5zaGFwZSA9IHt9O1xyXG5cclxuICAgICAgICB2YXIgY2VsbENvbmYgPSB0aGlzLmNvbmZpZy5jZWxsO1xyXG4gICAgICAgIHNoYXBlLnR5cGUgPSBcInJlY3RcIjtcclxuXHJcbiAgICAgICAgcGxvdC56LnNoYXBlLndpZHRoID0gcGxvdC5jZWxsV2lkdGggLSBjZWxsQ29uZi5wYWRkaW5nICogMjtcclxuICAgICAgICBwbG90Lnouc2hhcGUuaGVpZ2h0ID0gcGxvdC5jZWxsSGVpZ2h0IC0gY2VsbENvbmYucGFkZGluZyAqIDI7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHVwZGF0ZShuZXdEYXRhKSB7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKG5ld0RhdGEpO1xyXG4gICAgICAgIGlmKHRoaXMucGxvdC5ncm91cEJ5WSl7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0dyb3Vwc1kodGhpcy5wbG90LnkuZ3JvdXBzLCB0aGlzLnN2Z0cpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLnBsb3QuZ3JvdXBCeVgpe1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdHcm91cHNYKHRoaXMucGxvdC54Lmdyb3VwcywgdGhpcy5zdmdHKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlQ2VsbHMoKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVWYXJpYWJsZUxhYmVscygpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcuc2hvd0xlZ2VuZCkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxlZ2VuZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVBeGlzVGl0bGVzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHVwZGF0ZUF4aXNUaXRsZXMoKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIitzZWxmLnByZWZpeENsYXNzKCdheGlzLXgnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrIChwbG90LndpZHRoLzIpICtcIixcIisgKHBsb3QuaGVpZ2h0ICsgcGxvdC5tYXJnaW4uYm90dG9tKSArXCIpXCIpXHJcbiAgICAgICAgICAgIC5zZWxlY3RPckFwcGVuZChcInRleHQuXCIrc2VsZi5wcmVmaXhDbGFzcygnbGFiZWwnKSlcclxuXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCItMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KHNlbGYuY29uZmlnLngudGl0bGUpO1xyXG5cclxuICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMteScpKVxyXG4gICAgICAgICAgICAuc2VsZWN0T3JBcHBlbmQoXCJ0ZXh0LlwiK3NlbGYucHJlZml4Q2xhc3MoJ2xhYmVsJykpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyAtcGxvdC5tYXJnaW4ubGVmdCArXCIsXCIrKHBsb3QuaGVpZ2h0LzIpK1wiKXJvdGF0ZSgtOTApXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCIxZW1cIilcclxuICAgICAgICAgICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoc2VsZi5jb25maWcueS50aXRsZSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICB1cGRhdGVWYXJpYWJsZUxhYmVscygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGxhYmVsQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwibGFiZWxcIik7XHJcbiAgICAgICAgdmFyIGxhYmVsWENsYXNzID0gbGFiZWxDbGFzcyArIFwiLXhcIjtcclxuICAgICAgICB2YXIgbGFiZWxZQ2xhc3MgPSBsYWJlbENsYXNzICsgXCIteVwiO1xyXG4gICAgICAgIHBsb3QubGFiZWxDbGFzcyA9IGxhYmVsQ2xhc3M7XHJcblxyXG4gICAgICAgIHZhciBvZmZzZXRYID0ge1xyXG4gICAgICAgICAgICB4OjAsXHJcbiAgICAgICAgICAgIHk6MFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGV0IGdhcFNpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBTaXplKDApO1xyXG4gICAgICAgIGlmKHBsb3QuZ3JvdXBCeVgpe1xyXG4gICAgICAgICAgICBsZXQgb3ZlcmxhcCA9IHNlbGYuY29uZmlnLnguZ3JvdXBzLm92ZXJsYXA7XHJcblxyXG4gICAgICAgICAgICBvZmZzZXRYLng9IGdhcFNpemUvMjtcclxuICAgICAgICAgICAgb2Zmc2V0WC55PSBvdmVybGFwLmJvdHRvbStnYXBTaXplLzIrNjtcclxuICAgICAgICB9ZWxzZSBpZihwbG90Lmdyb3VwQnlZKXtcclxuICAgICAgICAgICAgb2Zmc2V0WC55PSBnYXBTaXplO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHZhciBsYWJlbHNYID0gc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIrbGFiZWxYQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBsb3QueC5hbGxWYWx1ZXNMaXN0LCAoZCwgaSk9PmkpO1xyXG5cclxuICAgICAgICBsYWJlbHNYLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKS5hdHRyKFwiY2xhc3NcIiwgKGQsIGkpID0+IGxhYmVsQ2xhc3MgKyBcIiBcIiArbGFiZWxYQ2xhc3MrXCIgXCIrIGxhYmVsWENsYXNzICsgXCItXCIgKyBpKTtcclxuXHJcbiAgICAgICAgbGFiZWxzWFxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgKGQsIGkpID0+IChpICogcGxvdC5jZWxsV2lkdGggKyBwbG90LmNlbGxXaWR0aCAvIDIpICsoZC5ncm91cC5nYXBzU2l6ZSkrb2Zmc2V0WC54KVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgcGxvdC5oZWlnaHQgKyBvZmZzZXRYLnkpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgMTApXHJcblxyXG4gICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGQ9PnNlbGYuZm9ybWF0VmFsdWVYKGQudmFsKSk7XHJcblxyXG4gICAgICAgIGlmKHNlbGYuY29uZmlnLngucm90YXRlTGFiZWxzKXtcclxuICAgICAgICAgICAgbGFiZWxzWC5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInJvdGF0ZSgtNDUsIFwiICsgKChpICogcGxvdC5jZWxsV2lkdGggKyBwbG90LmNlbGxXaWR0aCAvIDIpICtkLmdyb3VwLmdhcHNTaXplICtvZmZzZXRYLnggKSArIFwiLCBcIiArICggcGxvdC5oZWlnaHQgKyBvZmZzZXRYLnkpICsgXCIpXCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImR4XCIsIC0yKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCA4KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBsYWJlbHNYLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcblxyXG4gICAgICAgIHZhciBsYWJlbHNZID0gc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIrbGFiZWxZQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBsb3QueS5hbGxWYWx1ZXNMaXN0KTtcclxuXHJcbiAgICAgICAgbGFiZWxzWS5lbnRlcigpLmFwcGVuZChcInRleHRcIik7XHJcblxyXG4gICAgICAgIHZhciBvZmZzZXRZID0ge1xyXG4gICAgICAgICAgICB4OjAsXHJcbiAgICAgICAgICAgIHk6MFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYocGxvdC5ncm91cEJ5WSl7XHJcbiAgICAgICAgICAgIGxldCBvdmVybGFwID0gc2VsZi5jb25maWcueS5ncm91cHMub3ZlcmxhcDtcclxuICAgICAgICAgICAgbGV0IGdhcFNpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBTaXplKDApO1xyXG4gICAgICAgICAgICBvZmZzZXRZLng9IC1vdmVybGFwLmxlZnQ7XHJcblxyXG4gICAgICAgICAgICBvZmZzZXRZLnk9IGdhcFNpemUvMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGFiZWxzWVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgb2Zmc2V0WS54KVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgKGQsIGkpID0+IChpICogcGxvdC5jZWxsSGVpZ2h0ICsgcGxvdC5jZWxsSGVpZ2h0IC8gMikgKyBkLmdyb3VwLmdhcHNTaXplICtvZmZzZXRZLnkpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHhcIiwgLTIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCAoZCwgaSkgPT4gbGFiZWxDbGFzcyArIFwiIFwiICsgbGFiZWxZQ2xhc3MgK1wiIFwiICsgbGFiZWxZQ2xhc3MgKyBcIi1cIiArIGkpXHJcblxyXG4gICAgICAgICAgICAudGV4dChkPT5zZWxmLmZvcm1hdFZhbHVlWShkLnZhbCkpO1xyXG5cclxuICAgICAgICBpZihzZWxmLmNvbmZpZy55LnJvdGF0ZUxhYmVscyl7XHJcbiAgICAgICAgICAgIGxhYmVsc1lcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInJvdGF0ZSgtNDUsIFwiICsgKG9mZnNldFkueCAgKSArIFwiLCBcIiArIChkLmdyb3VwLmdhcHNTaXplKyhpICogcGxvdC5jZWxsSGVpZ2h0ICsgcGxvdC5jZWxsSGVpZ2h0IC8gMikgK29mZnNldFkueSkgKyBcIilcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIik7XHJcbiAgICAgICAgICAgICAgICAvLyAuYXR0cihcImR4XCIsIC03KTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgbGFiZWxzWS5hdHRyKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxhYmVsc1kuZXhpdCgpLnJlbW92ZSgpO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZHJhd0dyb3Vwc1kocGFyZW50R3JvdXAsIGNvbnRhaW5lciwgYXZhaWxhYmxlV2lkdGgpIHtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG5cclxuICAgICAgICB2YXIgZ3JvdXBDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJncm91cFwiKTtcclxuICAgICAgICB2YXIgZ3JvdXBZQ2xhc3MgPSBncm91cENsYXNzK1wiLXlcIjtcclxuICAgICAgICB2YXIgZ3JvdXBzID0gY29udGFpbmVyLnNlbGVjdEFsbChcImcuXCIrZ3JvdXBDbGFzcytcIi5cIitncm91cFlDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGFyZW50R3JvdXAuY2hpbGRyZW5MaXN0KTtcclxuXHJcbiAgICAgICAgdmFyIHZhbHVlc0JlZm9yZUNvdW50ID0wO1xyXG4gICAgICAgIHZhciBnYXBzQmVmb3JlU2l6ZSA9IDA7XHJcblxyXG4gICAgICAgIHZhciBncm91cHNFbnRlckcgPSBncm91cHMuZW50ZXIoKS5hcHBlbmQoXCJnXCIpO1xyXG4gICAgICAgIGdyb3Vwc0VudGVyR1xyXG4gICAgICAgICAgICAuY2xhc3NlZChncm91cENsYXNzLCB0cnVlKVxyXG4gICAgICAgICAgICAuY2xhc3NlZChncm91cFlDbGFzcywgdHJ1ZSlcclxuICAgICAgICAgICAgLmFwcGVuZChcInJlY3RcIikuY2xhc3NlZChcImdyb3VwLXJlY3RcIiwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIHZhciB0aXRsZUdyb3VwRW50ZXIgPSBncm91cHNFbnRlckcuYXBwZW5kU2VsZWN0b3IoXCJnLnRpdGxlXCIpO1xyXG4gICAgICAgIHRpdGxlR3JvdXBFbnRlci5hcHBlbmQoXCJyZWN0XCIpO1xyXG4gICAgICAgIHRpdGxlR3JvdXBFbnRlci5hcHBlbmQoXCJ0ZXh0XCIpO1xyXG5cclxuICAgICAgICB2YXIgZ2FwU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcFNpemUocGFyZW50R3JvdXAubGV2ZWwpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gZ2FwU2l6ZS80O1xyXG5cclxuICAgICAgICB2YXIgdGl0bGVSZWN0V2lkdGggPSA2O1xyXG4gICAgICAgIHZhciBkZXB0aCA9IHNlbGYuY29uZmlnLnkuZ3JvdXBzLmtleXMubGVuZ3RoIC0gcGFyZW50R3JvdXAubGV2ZWw7XHJcbiAgICAgICAgdmFyIG92ZXJsYXAgPXtcclxuICAgICAgICAgICAgbGVmdDowLFxyXG4gICAgICAgICAgICByaWdodDogMFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmKCFhdmFpbGFibGVXaWR0aCl7XHJcbiAgICAgICAgICAgIG92ZXJsYXAucmlnaHQgPSBwbG90Lnkub3ZlcmxhcC5sZWZ0O1xyXG4gICAgICAgICAgICBvdmVybGFwLmxlZnQgPSBwbG90Lnkub3ZlcmxhcC5sZWZ0O1xyXG4gICAgICAgICAgICBhdmFpbGFibGVXaWR0aCA9cGxvdC53aWR0aCArIGdhcFNpemUgKyBvdmVybGFwLmxlZnQrb3ZlcmxhcC5yaWdodDtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBncm91cHNcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IHtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHRybmFzbGF0ZVZBbCA9IFwidHJhbnNsYXRlKFwiICsgKHBhZGRpbmctb3ZlcmxhcC5sZWZ0KSArIFwiLFwiICsgKChwbG90LmNlbGxIZWlnaHQgKiB2YWx1ZXNCZWZvcmVDb3VudCkgKyBpKmdhcFNpemUgKyBnYXBzQmVmb3JlU2l6ZSArIHBhZGRpbmcpICsgXCIpXCI7XHJcbiAgICAgICAgICAgICAgICBnYXBzQmVmb3JlU2l6ZSs9KGQuZ2Fwc0luc2lkZVNpemV8fDApO1xyXG4gICAgICAgICAgICAgICAgdmFsdWVzQmVmb3JlQ291bnQrPWQuYWxsVmFsdWVzQ291bnR8fDA7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJuYXNsYXRlVkFsXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHZhciBncm91cFdpZHRoID0gYXZhaWxhYmxlV2lkdGgtcGFkZGluZyoyO1xyXG5cclxuICAgICAgICB2YXIgdGl0bGVHcm91cHMgPSBncm91cHMuc2VsZWN0QWxsKFwiZy50aXRsZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCAoZCwgaSkgPT4gXCJ0cmFuc2xhdGUoXCIrKGdyb3VwV2lkdGgtdGl0bGVSZWN0V2lkdGgpK1wiLCAwKVwiKTtcclxuXHJcbiAgICAgICAgdmFyIHRpbGVSZWN0cyA9IHRpdGxlR3JvdXBzLnNlbGVjdEFsbChcInJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB0aXRsZVJlY3RXaWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZD0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoZC5nYXBzSW5zaWRlU2l6ZXx8MCkgKyBwbG90LmNlbGxIZWlnaHQqZC5hbGxWYWx1ZXNDb3VudCArcGFkZGluZyoyXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgMClcclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJmaWxsXCIsIFwibGlnaHRncmV5XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDApO1xyXG5cclxuICAgICAgICB0aGlzLnNldEdyb3VwTW91c2VDYWxsYmFja3MocGFyZW50R3JvdXAsIHRpbGVSZWN0cyk7XHJcblxyXG5cclxuICAgICAgICBncm91cHMuc2VsZWN0QWxsKFwicmVjdC5ncm91cC1yZWN0XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgZD0+IFwiZ3JvdXAtcmVjdCBncm91cC1yZWN0LVwiK2QuaW5kZXgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgZ3JvdXBXaWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZD0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoZC5nYXBzSW5zaWRlU2l6ZXx8MCkgKyBwbG90LmNlbGxIZWlnaHQqZC5hbGxWYWx1ZXNDb3VudCArcGFkZGluZyoyXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIFwid2hpdGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJmaWxsLW9wYWNpdHlcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMC41KVxyXG4gICAgICAgICAgICAuYXR0cihcInN0cm9rZVwiLCBcImJsYWNrXCIpXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgICAgICBncm91cHMuZWFjaChmdW5jdGlvbihncm91cCl7XHJcblxyXG4gICAgICAgICAgICBzZWxmLmRyYXdHcm91cHNZLmNhbGwoc2VsZiwgZ3JvdXAsIGQzLnNlbGVjdCh0aGlzKSwgZ3JvdXBXaWR0aC10aXRsZVJlY3RXaWR0aCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGRyYXdHcm91cHNYKHBhcmVudEdyb3VwLCBjb250YWluZXIsIGF2YWlsYWJsZUhlaWdodCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcblxyXG4gICAgICAgIHZhciBncm91cENsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImdyb3VwXCIpO1xyXG4gICAgICAgIHZhciBncm91cFhDbGFzcyA9IGdyb3VwQ2xhc3MrXCIteFwiO1xyXG4gICAgICAgIHZhciBncm91cHMgPSBjb250YWluZXIuc2VsZWN0QWxsKFwiZy5cIitncm91cENsYXNzK1wiLlwiK2dyb3VwWENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShwYXJlbnRHcm91cC5jaGlsZHJlbkxpc3QpO1xyXG5cclxuICAgICAgICB2YXIgdmFsdWVzQmVmb3JlQ291bnQgPTA7XHJcbiAgICAgICAgdmFyIGdhcHNCZWZvcmVTaXplID0gMDtcclxuXHJcbiAgICAgICAgdmFyIGdyb3Vwc0VudGVyRyA9IGdyb3Vwcy5lbnRlcigpLmFwcGVuZChcImdcIik7XHJcbiAgICAgICAgZ3JvdXBzRW50ZXJHXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKGdyb3VwQ2xhc3MsIHRydWUpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKGdyb3VwWENsYXNzLCB0cnVlKVxyXG4gICAgICAgICAgICAuYXBwZW5kKFwicmVjdFwiKS5jbGFzc2VkKFwiZ3JvdXAtcmVjdFwiLCB0cnVlKTtcclxuXHJcbiAgICAgICAgdmFyIHRpdGxlR3JvdXBFbnRlciA9IGdyb3Vwc0VudGVyRy5hcHBlbmRTZWxlY3RvcihcImcudGl0bGVcIik7XHJcbiAgICAgICAgdGl0bGVHcm91cEVudGVyLmFwcGVuZChcInJlY3RcIik7XHJcbiAgICAgICAgdGl0bGVHcm91cEVudGVyLmFwcGVuZChcInRleHRcIik7XHJcblxyXG4gICAgICAgIHZhciBnYXBTaXplID0gSGVhdG1hcC5jb21wdXRlR2FwU2l6ZShwYXJlbnRHcm91cC5sZXZlbCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBnYXBTaXplLzQ7XHJcbiAgICAgICAgdmFyIHRpdGxlUmVjdEhlaWdodCA9IDY7XHJcblxyXG4gICAgICAgIHZhciBkZXB0aCA9IHNlbGYuY29uZmlnLnguZ3JvdXBzLmtleXMubGVuZ3RoIC0gcGFyZW50R3JvdXAubGV2ZWw7XHJcblxyXG4gICAgICAgIHZhciBvdmVybGFwPXtcclxuICAgICAgICAgICAgdG9wOjAsXHJcbiAgICAgICAgICAgIGJvdHRvbTogMFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmKCFhdmFpbGFibGVIZWlnaHQpe1xyXG4gICAgICAgICAgICBvdmVybGFwLmJvdHRvbSA9IHBsb3QueC5vdmVybGFwLmJvdHRvbTtcclxuICAgICAgICAgICAgb3ZlcmxhcC50b3AgPSBwbG90Lngub3ZlcmxhcC50b3A7XHJcblxyXG4gICAgICAgICAgICBhdmFpbGFibGVIZWlnaHQgPXBsb3QuaGVpZ2h0ICsgZ2FwU2l6ZSArIG92ZXJsYXAudG9wK292ZXJsYXAuYm90dG9tO1xyXG5cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgb3ZlcmxhcC50b3AgPSAtdGl0bGVSZWN0SGVpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygncGFyZW50R3JvdXAnLHBhcmVudEdyb3VwLCAnZ2FwU2l6ZScsIGdhcFNpemUsIHBsb3QueC5vdmVybGFwKTtcclxuXHJcbiAgICAgICAgZ3JvdXBzXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHRybmFzbGF0ZVZBbCA9IFwidHJhbnNsYXRlKFwiICsgKChwbG90LmNlbGxXaWR0aCAqIHZhbHVlc0JlZm9yZUNvdW50KSArIGkqZ2FwU2l6ZSArIGdhcHNCZWZvcmVTaXplICsgcGFkZGluZykgKyBcIiwgXCIrKHBhZGRpbmcgLW92ZXJsYXAudG9wKStcIilcIjtcclxuICAgICAgICAgICAgICAgIGdhcHNCZWZvcmVTaXplKz0oZC5nYXBzSW5zaWRlU2l6ZXx8MCk7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZXNCZWZvcmVDb3VudCs9ZC5hbGxWYWx1ZXNDb3VudHx8MDtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cm5hc2xhdGVWQWxcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciBncm91cEhlaWdodCA9IGF2YWlsYWJsZUhlaWdodC1wYWRkaW5nKjI7XHJcblxyXG4gICAgICAgIHZhciB0aXRsZUdyb3VwcyA9IGdyb3Vwcy5zZWxlY3RBbGwoXCJnLnRpdGxlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInRyYW5zbGF0ZSgwLCBcIisoMCkrXCIpXCIpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIHRpbGVSZWN0cyA9IHRpdGxlR3JvdXBzLnNlbGVjdEFsbChcInJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgdGl0bGVSZWN0SGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGQ9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGQuZ2Fwc0luc2lkZVNpemV8fDApICsgcGxvdC5jZWxsV2lkdGgqZC5hbGxWYWx1ZXNDb3VudCArcGFkZGluZyoyXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgMClcclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJmaWxsXCIsIFwibGlnaHRncmV5XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDApO1xyXG5cclxuICAgICAgICB0aGlzLnNldEdyb3VwTW91c2VDYWxsYmFja3MocGFyZW50R3JvdXAsIHRpbGVSZWN0cyk7XHJcblxyXG5cclxuICAgICAgICBncm91cHMuc2VsZWN0QWxsKFwicmVjdC5ncm91cC1yZWN0XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgZD0+IFwiZ3JvdXAtcmVjdCBncm91cC1yZWN0LVwiK2QuaW5kZXgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGdyb3VwSGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGQ9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGQuZ2Fwc0luc2lkZVNpemV8fDApICsgcGxvdC5jZWxsV2lkdGgqZC5hbGxWYWx1ZXNDb3VudCArcGFkZGluZyoyXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIFwid2hpdGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJmaWxsLW9wYWNpdHlcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMC41KVxyXG4gICAgICAgICAgICAuYXR0cihcInN0cm9rZVwiLCBcImJsYWNrXCIpO1xyXG5cclxuICAgICAgICBncm91cHMuZWFjaChmdW5jdGlvbihncm91cCl7XHJcbiAgICAgICAgICAgIHNlbGYuZHJhd0dyb3Vwc1guY2FsbChzZWxmLCBncm91cCwgZDMuc2VsZWN0KHRoaXMpLCBncm91cEhlaWdodC10aXRsZVJlY3RIZWlnaHQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBzZXRHcm91cE1vdXNlQ2FsbGJhY2tzKHBhcmVudEdyb3VwLCB0aWxlUmVjdHMpIHtcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG1vdXNlb3ZlckNhbGxiYWNrcyA9IFtdO1xyXG4gICAgICAgIG1vdXNlb3ZlckNhbGxiYWNrcy5wdXNoKGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKCdoaWdobGlnaHRlZCcsIHRydWUpO1xyXG4gICAgICAgICAgICBkMy5zZWxlY3QodGhpcy5wYXJlbnROb2RlLnBhcmVudE5vZGUpLnNlbGVjdEFsbChcInJlY3QuZ3JvdXAtcmVjdC1cIiArIGQuaW5kZXgpLmNsYXNzZWQoJ2hpZ2hsaWdodGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciBtb3VzZW91dENhbGxiYWNrcyA9IFtdO1xyXG4gICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoJ2hpZ2hsaWdodGVkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICBkMy5zZWxlY3QodGhpcy5wYXJlbnROb2RlLnBhcmVudE5vZGUpLnNlbGVjdEFsbChcInJlY3QuZ3JvdXAtcmVjdC1cIiArIGQuaW5kZXgpLmNsYXNzZWQoJ2hpZ2hsaWdodGVkJywgZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChwbG90LnRvb2x0aXApIHtcclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3ZlckNhbGxiYWNrcy5wdXNoKGQ9PiB7XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDIwMClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIC45KTtcclxuICAgICAgICAgICAgICAgIHZhciBodG1sID0gcGFyZW50R3JvdXAubGFiZWwgKyBcIjogXCIgKyBkLmdyb3VwaW5nVmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLmh0bWwoaHRtbClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLnB1c2goZD0+IHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRpbGVSZWN0cy5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIG1vdXNlb3ZlckNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChzZWxmLCBkKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aWxlUmVjdHMub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKHNlbGYsIGQpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUNlbGxzKCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGNlbGxDb250YWluZXJDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJjZWxsc1wiKTtcclxuICAgICAgICB2YXIgZ2FwU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcFNpemUoMCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmdYID0gcGxvdC54Lmdyb3Vwcy5jaGlsZHJlbkxpc3QubGVuZ3RoID8gZ2FwU2l6ZS8yIDogMDtcclxuICAgICAgICB2YXIgcGFkZGluZ1kgPSBwbG90LnkuZ3JvdXBzLmNoaWxkcmVuTGlzdC5sZW5ndGggPyBnYXBTaXplLzIgOiAwO1xyXG4gICAgICAgIHZhciBjZWxsQ29udGFpbmVyID0gc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIitjZWxsQ29udGFpbmVyQ2xhc3MpO1xyXG4gICAgICAgIGNlbGxDb250YWluZXIuYXR0cihcInRyYW5zZm9ybVwiICwgXCJ0cmFuc2xhdGUoXCIrcGFkZGluZ1grXCIsIFwiK3BhZGRpbmdZK1wiKVwiKTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJjZWxsXCIpO1xyXG4gICAgICAgIHZhciBjZWxsU2hhcGUgPSBwbG90Lnouc2hhcGUudHlwZTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxzID0gY2VsbENvbnRhaW5lci5zZWxlY3RBbGwoXCJnLlwiK2NlbGxDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEoc2VsZi5wbG90LmNlbGxzKTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxFbnRlckcgPSBjZWxscy5lbnRlcigpLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmNsYXNzZWQoY2VsbENsYXNzLCB0cnVlKTtcclxuICAgICAgICBjZWxscy5hdHRyKFwidHJhbnNmb3JtXCIsIGM9PiBcInRyYW5zbGF0ZShcIiArICgocGxvdC5jZWxsV2lkdGggKiBjLmNvbCArIHBsb3QuY2VsbFdpZHRoIC8gMikrYy5jb2xWYXIuZ3JvdXAuZ2Fwc1NpemUpICsgXCIsXCIgKyAoKHBsb3QuY2VsbEhlaWdodCAqIGMucm93ICsgcGxvdC5jZWxsSGVpZ2h0IC8gMikrYy5yb3dWYXIuZ3JvdXAuZ2Fwc1NpemUpICsgXCIpXCIpO1xyXG5cclxuICAgICAgICB2YXIgc2hhcGVzID0gY2VsbHMuc2VsZWN0T3JBcHBlbmQoY2VsbFNoYXBlK1wiLmNlbGwtc2hhcGUtXCIrY2VsbFNoYXBlKTtcclxuXHJcbiAgICAgICAgc2hhcGVzXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgcGxvdC56LnNoYXBlLndpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBwbG90Lnouc2hhcGUuaGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgLXBsb3QuY2VsbFdpZHRoIC8gMilcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIC1wbG90LmNlbGxIZWlnaHQgLyAyKTtcclxuXHJcbiAgICAgICAgc2hhcGVzLnN0eWxlKFwiZmlsbFwiLCBjPT4gYy52YWx1ZSA9PT0gdW5kZWZpbmVkID8gc2VsZi5jb25maWcuY29sb3Iubm9EYXRhQ29sb3IgOiBwbG90LnouY29sb3Iuc2NhbGUoYy52YWx1ZSkpO1xyXG4gICAgICAgIHNoYXBlcy5hdHRyKFwiZmlsbC1vcGFjaXR5XCIsIGQ9PiBkLnZhbHVlID09PSB1bmRlZmluZWQgPyAwIDogMSk7XHJcblxyXG4gICAgICAgIHZhciBtb3VzZW92ZXJDYWxsYmFja3MgPSBbXTtcclxuICAgICAgICB2YXIgbW91c2VvdXRDYWxsYmFja3MgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKHBsb3QudG9vbHRpcCkge1xyXG5cclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goYz0+IHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGh0bWwgPSBjLnZhbHVlID09PSB1bmRlZmluZWQgPyBzZWxmLmNvbmZpZy50b29sdGlwLm5vRGF0YVRleHQgOiBzZWxmLmZvcm1hdFZhbHVlWihjLnZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAuaHRtbChodG1sKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkMy5ldmVudC5wYWdlWSAtIDI4KSArIFwicHhcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MucHVzaChjPT4ge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy5oaWdobGlnaHRMYWJlbHMpIHtcclxuICAgICAgICAgICAgdmFyIGhpZ2hsaWdodENsYXNzID0gc2VsZi5jb25maWcuY3NzQ2xhc3NQcmVmaXggKyBcImhpZ2hsaWdodFwiO1xyXG4gICAgICAgICAgICB2YXIgeExhYmVsQ2xhc3MgPSBjPT5wbG90LmxhYmVsQ2xhc3MgKyBcIi14LVwiICsgYy5jb2w7XHJcbiAgICAgICAgICAgIHZhciB5TGFiZWxDbGFzcyA9IGM9PnBsb3QubGFiZWxDbGFzcyArIFwiLXktXCIgKyBjLnJvdztcclxuXHJcblxyXG4gICAgICAgICAgICBtb3VzZW92ZXJDYWxsYmFja3MucHVzaChjPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgeExhYmVsQ2xhc3MoYykpLmNsYXNzZWQoaGlnaGxpZ2h0Q2xhc3MsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB5TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBtb3VzZW91dENhbGxiYWNrcy5wdXNoKGM9PiB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHhMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHlMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGNlbGxzLm9uKFwibW91c2VvdmVyXCIsIGMgPT4ge1xyXG4gICAgICAgICAgICBtb3VzZW92ZXJDYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjaz0+Y2FsbGJhY2soYykpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGMgPT4ge1xyXG4gICAgICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjaz0+Y2FsbGJhY2soYykpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY2VsbHMub24oXCJjbGlja1wiLCBjPT57XHJcbiAgICAgICAgICAgc2VsZi50cmlnZ2VyKFwiY2VsbC1zZWxlY3RlZFwiLCBjKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG5cclxuICAgICAgICBjZWxscy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9ybWF0VmFsdWVYKHZhbHVlKXtcclxuICAgICAgICBpZighdGhpcy5jb25maWcueC5mb3JtYXR0ZXIpIHJldHVybiB2YWx1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnguZm9ybWF0dGVyLmNhbGwodGhpcy5jb25maWcsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3JtYXRWYWx1ZVkodmFsdWUpe1xyXG4gICAgICAgIGlmKCF0aGlzLmNvbmZpZy55LmZvcm1hdHRlcikgcmV0dXJuIHZhbHVlO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcueS5mb3JtYXR0ZXIuY2FsbCh0aGlzLmNvbmZpZywgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcm1hdFZhbHVlWih2YWx1ZSl7XHJcbiAgICAgICAgaWYoIXRoaXMuY29uZmlnLnouZm9ybWF0dGVyKSByZXR1cm4gdmFsdWU7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy56LmZvcm1hdHRlci5jYWxsKHRoaXMuY29uZmlnLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9ybWF0TGVnZW5kVmFsdWUodmFsdWUpe1xyXG4gICAgICAgIGlmKCF0aGlzLmNvbmZpZy5sZWdlbmQuZm9ybWF0dGVyKSByZXR1cm4gdmFsdWU7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5sZWdlbmQuZm9ybWF0dGVyLmNhbGwodGhpcy5jb25maWcsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVMZWdlbmQoKSB7XHJcbiAgICAgICAgdmFyIHNlbGY9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIGxlZ2VuZFggPSB0aGlzLnBsb3Qud2lkdGggKyAxMDtcclxuICAgICAgICB2YXIgZ2FwU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcFNpemUoMCk7XHJcbiAgICAgICAgaWYodGhpcy5wbG90Lmdyb3VwQnlZKXtcclxuICAgICAgICAgICAgbGVnZW5kWCs9IGdhcFNpemUvMiArcGxvdC55Lm92ZXJsYXAucmlnaHQ7XHJcbiAgICAgICAgfWVsc2UgaWYodGhpcy5wbG90Lmdyb3VwQnlYKXtcclxuICAgICAgICAgICAgbGVnZW5kWCs9IGdhcFNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsZWdlbmRZID0gMDtcclxuICAgICAgICBpZih0aGlzLnBsb3QuZ3JvdXBCeVggfHwgdGhpcy5wbG90Lmdyb3VwQnlZKXtcclxuICAgICAgICAgICAgbGVnZW5kWSs9IGdhcFNpemUvMjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB2YXIgYmFyV2lkdGggPSAxMDtcclxuICAgICAgICB2YXIgYmFySGVpZ2h0ID0gdGhpcy5wbG90LmhlaWdodCAtIDI7XHJcbiAgICAgICAgdmFyIHNjYWxlID0gcGxvdC56LmNvbG9yLnNjYWxlO1xyXG5cclxuICAgICAgICBwbG90LmxlZ2VuZCA9IG5ldyBMZWdlbmQodGhpcy5zdmcsIHRoaXMuc3ZnRywgc2NhbGUsIGxlZ2VuZFgsIGxlZ2VuZFksIHYgPT4gc2VsZi5mb3JtYXRMZWdlbmRWYWx1ZSh2KSkubGluZWFyR3JhZGllbnRCYXIoYmFyV2lkdGgsIGJhckhlaWdodCk7XHJcblxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7RDNFeHRlbnNpb25zfSBmcm9tICcuL2QzLWV4dGVuc2lvbnMnXHJcbkQzRXh0ZW5zaW9ucy5leHRlbmQoKTtcclxuXHJcbmV4cG9ydCB7U2NhdHRlclBsb3QsIFNjYXR0ZXJQbG90Q29uZmlnfSBmcm9tIFwiLi9zY2F0dGVycGxvdFwiO1xyXG5leHBvcnQge1NjYXR0ZXJQbG90TWF0cml4LCBTY2F0dGVyUGxvdE1hdHJpeENvbmZpZ30gZnJvbSBcIi4vc2NhdHRlcnBsb3QtbWF0cml4XCI7XHJcbmV4cG9ydCB7Q29ycmVsYXRpb25NYXRyaXgsIENvcnJlbGF0aW9uTWF0cml4Q29uZmlnfSBmcm9tICcuL2NvcnJlbGF0aW9uLW1hdHJpeCdcclxuZXhwb3J0IHtSZWdyZXNzaW9uLCBSZWdyZXNzaW9uQ29uZmlnfSBmcm9tICcuL3JlZ3Jlc3Npb24nXHJcbmV4cG9ydCB7SGVhdG1hcCwgSGVhdG1hcENvbmZpZ30gZnJvbSAnLi9oZWF0bWFwJ1xyXG5leHBvcnQge1N0YXRpc3RpY3NVdGlsc30gZnJvbSAnLi9zdGF0aXN0aWNzLXV0aWxzJ1xyXG5leHBvcnQge0xlZ2VuZH0gZnJvbSAnLi9sZWdlbmQnXHJcblxyXG5cclxuXHJcblxyXG5cclxuIiwiaW1wb3J0IHtVdGlsc30gZnJvbSBcIi4vdXRpbHNcIjtcclxuaW1wb3J0IHtjb2xvciwgc2l6ZSwgc3ltYm9sfSBmcm9tIFwiLi4vYm93ZXJfY29tcG9uZW50cy9kMy1sZWdlbmQvbm8tZXh0ZW5kXCI7XHJcblxyXG4vKnZhciBkMyA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvZDMnKTtcclxuKi9cclxuLy8gdmFyIGxlZ2VuZCA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvZDMtbGVnZW5kL25vLWV4dGVuZCcpO1xyXG4vL1xyXG4vLyBtb2R1bGUuZXhwb3J0cy5sZWdlbmQgPSBsZWdlbmQ7XHJcblxyXG5leHBvcnQgY2xhc3MgTGVnZW5kIHtcclxuXHJcbiAgICBjc3NDbGFzc1ByZWZpeD1cIm9kYy1cIjtcclxuICAgIGxlZ2VuZENsYXNzPXRoaXMuY3NzQ2xhc3NQcmVmaXgrXCJsZWdlbmRcIjtcclxuICAgIGNvbnRhaW5lcjtcclxuICAgIHNjYWxlO1xyXG4gICAgY29sb3I9IGNvbG9yO1xyXG4gICAgc2l6ZSA9IHNpemU7XHJcbiAgICBzeW1ib2w9IHN5bWJvbDtcclxuICAgIGd1aWQ7XHJcblxyXG4gICAgbGFiZWxGb3JtYXQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc3ZnLCBsZWdlbmRQYXJlbnQsIHNjYWxlLCBsZWdlbmRYLCBsZWdlbmRZLCBsYWJlbEZvcm1hdCl7XHJcbiAgICAgICAgdGhpcy5zY2FsZT1zY2FsZTtcclxuICAgICAgICB0aGlzLnN2ZyA9IHN2ZztcclxuICAgICAgICB0aGlzLmd1aWQgPSBVdGlscy5ndWlkKCk7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSAgVXRpbHMuc2VsZWN0T3JBcHBlbmQobGVnZW5kUGFyZW50LCBcImcuXCIrdGhpcy5sZWdlbmRDbGFzcywgXCJnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiK2xlZ2VuZFgrXCIsXCIrbGVnZW5kWStcIilcIilcclxuICAgICAgICAgICAgLmNsYXNzZWQodGhpcy5sZWdlbmRDbGFzcywgdHJ1ZSk7XHJcblxyXG4gICAgICAgIHRoaXMubGFiZWxGb3JtYXQgPSBsYWJlbEZvcm1hdDtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGxpbmVhckdyYWRpZW50QmFyKGJhcldpZHRoLCBiYXJIZWlnaHQsIHRpdGxlKXtcclxuICAgICAgICB2YXIgZ3JhZGllbnRJZCA9IHRoaXMuY3NzQ2xhc3NQcmVmaXgrXCJsaW5lYXItZ3JhZGllbnRcIitcIi1cIit0aGlzLmd1aWQ7XHJcbiAgICAgICAgdmFyIHNjYWxlPSB0aGlzLnNjYWxlO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5saW5lYXJHcmFkaWVudCA9IFV0aWxzLmxpbmVhckdyYWRpZW50KHRoaXMuc3ZnLCBncmFkaWVudElkLCB0aGlzLnNjYWxlLnJhbmdlKCksIDAsIDEwMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZChcInJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBiYXJXaWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgYmFySGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIDApXHJcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCJ1cmwoI1wiK2dyYWRpZW50SWQrXCIpXCIpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIHRpY2tzID0gdGhpcy5jb250YWluZXIuc2VsZWN0QWxsKFwidGV4dFwiKVxyXG4gICAgICAgICAgICAuZGF0YSggc2NhbGUuZG9tYWluKCkgKTtcclxuICAgICAgICB2YXIgdGlja3NOdW1iZXIgPXNjYWxlLmRvbWFpbigpLmxlbmd0aC0xO1xyXG4gICAgICAgIHRpY2tzLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgYmFyV2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAgKGQsIGkpID0+ICBiYXJIZWlnaHQgLShpKmJhckhlaWdodC90aWNrc051bWJlcikpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHhcIiwgMylcclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJkeVwiLCAxKVxyXG4gICAgICAgICAgICAuYXR0cihcImFsaWdubWVudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAudGV4dChkPT4gc2VsZi5sYWJlbEZvcm1hdCA/IHNlbGYubGFiZWxGb3JtYXQoZCkgOiBkKTtcclxuXHJcbiAgICAgICAgdGlja3MuZXhpdCgpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQge0NoYXJ0LCBDaGFydENvbmZpZ30gZnJvbSBcIi4vY2hhcnRcIjtcclxuaW1wb3J0IHtTY2F0dGVyUGxvdCwgU2NhdHRlclBsb3RDb25maWd9IGZyb20gXCIuL3NjYXR0ZXJwbG90XCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7U3RhdGlzdGljc1V0aWxzfSBmcm9tICcuL3N0YXRpc3RpY3MtdXRpbHMnXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFJlZ3Jlc3Npb25Db25maWcgZXh0ZW5kcyBTY2F0dGVyUGxvdENvbmZpZ3tcclxuXHJcbiAgICBtYWluUmVncmVzc2lvbiA9IHRydWU7XHJcbiAgICBncm91cFJlZ3Jlc3Npb24gPSB0cnVlO1xyXG4gICAgY29uZmlkZW5jZT17XHJcbiAgICAgICAgbGV2ZWw6IDAuOTUsXHJcbiAgICAgICAgY3JpdGljYWxWYWx1ZTogKGRlZ3JlZXNPZkZyZWVkb20sIGNyaXRpY2FsUHJvYmFiaWxpdHkpID0+IFN0YXRpc3RpY3NVdGlscy50VmFsdWUoZGVncmVlc09mRnJlZWRvbSwgY3JpdGljYWxQcm9iYWJpbGl0eSksXHJcbiAgICAgICAgbWFyZ2luT2ZFcnJvcjogdW5kZWZpbmVkIC8vY3VzdG9tICBtYXJnaW4gT2YgRXJyb3IgZnVuY3Rpb24gKHgsIHBvaW50cylcclxuICAgIH07XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKXtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICBpZihjdXN0b20pe1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFJlZ3Jlc3Npb24gZXh0ZW5kcyBTY2F0dGVyUGxvdHtcclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIG5ldyBSZWdyZXNzaW9uQ29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpe1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IFJlZ3Jlc3Npb25Db25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKXtcclxuICAgICAgICBzdXBlci5pbml0UGxvdCgpO1xyXG4gICAgICAgIHRoaXMuaW5pdFJlZ3Jlc3Npb25MaW5lcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRSZWdyZXNzaW9uTGluZXMoKXtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBncm91cHNBdmFpbGFibGUgPSBzZWxmLmNvbmZpZy5ncm91cHMgJiYgc2VsZi5jb25maWcuZ3JvdXBzLnZhbHVlO1xyXG5cclxuICAgICAgICBzZWxmLnBsb3QucmVncmVzc2lvbnM9IFtdO1xyXG5cclxuXHJcbiAgICAgICAgaWYoZ3JvdXBzQXZhaWxhYmxlICYmIHNlbGYuY29uZmlnLm1haW5SZWdyZXNzaW9uKXtcclxuICAgICAgICAgICAgdmFyIHJlZ3Jlc3Npb24gPSB0aGlzLmluaXRSZWdyZXNzaW9uKHRoaXMuZGF0YSwgZmFsc2UpO1xyXG4gICAgICAgICAgICBzZWxmLnBsb3QucmVncmVzc2lvbnMucHVzaChyZWdyZXNzaW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHNlbGYuY29uZmlnLmdyb3VwUmVncmVzc2lvbil7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdEdyb3VwUmVncmVzc2lvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdEdyb3VwUmVncmVzc2lvbigpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGRhdGFCeUdyb3VwID0ge307XHJcbiAgICAgICAgc2VsZi5kYXRhLmZvckVhY2ggKGQ9PntcclxuICAgICAgICAgICAgdmFyIGdyb3VwVmFsID0gc2VsZi5jb25maWcuZ3JvdXBzLnZhbHVlKGQsIHNlbGYuY29uZmlnLmdyb3Vwcy5rZXkpO1xyXG5cclxuICAgICAgICAgICAgaWYoIWdyb3VwVmFsICYmIGdyb3VwVmFsIT09MCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKCFkYXRhQnlHcm91cFtncm91cFZhbF0pe1xyXG4gICAgICAgICAgICAgICAgZGF0YUJ5R3JvdXBbZ3JvdXBWYWxdID0gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGF0YUJ5R3JvdXBbZ3JvdXBWYWxdLnB1c2goZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZvcih2YXIga2V5IGluIGRhdGFCeUdyb3VwKXtcclxuICAgICAgICAgICAgaWYgKCFkYXRhQnlHcm91cC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHJlZ3Jlc3Npb24gPSB0aGlzLmluaXRSZWdyZXNzaW9uKGRhdGFCeUdyb3VwW2tleV0sIGtleSk7XHJcbiAgICAgICAgICAgIHNlbGYucGxvdC5yZWdyZXNzaW9ucy5wdXNoKHJlZ3Jlc3Npb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0UmVncmVzc2lvbih2YWx1ZXMsIGdyb3VwVmFsKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciBwb2ludHMgPSB2YWx1ZXMubWFwKGQ9PntcclxuICAgICAgICAgICAgcmV0dXJuIFtwYXJzZUZsb2F0KHNlbGYucGxvdC54LnZhbHVlKGQpKSwgcGFyc2VGbG9hdChzZWxmLnBsb3QueS52YWx1ZShkKSldO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBwb2ludHMuc29ydCgoYSxiKSA9PiBhWzBdLWJbMF0pO1xyXG5cclxuICAgICAgICB2YXIgbGluZWFyUmVncmVzc2lvbiA9ICBTdGF0aXN0aWNzVXRpbHMubGluZWFyUmVncmVzc2lvbihwb2ludHMpO1xyXG4gICAgICAgIHZhciBsaW5lYXJSZWdyZXNzaW9uTGluZSA9IFN0YXRpc3RpY3NVdGlscy5saW5lYXJSZWdyZXNzaW9uTGluZShsaW5lYXJSZWdyZXNzaW9uKTtcclxuXHJcblxyXG4gICAgICAgIHZhciBleHRlbnRYID0gZDMuZXh0ZW50KHBvaW50cywgZD0+ZFswXSk7XHJcblxyXG5cclxuICAgICAgICB2YXIgbGluZVBvaW50cyA9IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeDogZXh0ZW50WFswXSxcclxuICAgICAgICAgICAgICAgIHk6IGxpbmVhclJlZ3Jlc3Npb25MaW5lKGV4dGVudFhbMF0pXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHg6IGV4dGVudFhbMV0sXHJcbiAgICAgICAgICAgICAgICB5OiBsaW5lYXJSZWdyZXNzaW9uTGluZShleHRlbnRYWzFdKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgdmFyIGxpbmUgPSBkMy5zdmcubGluZSgpXHJcbiAgICAgICAgICAgIC5pbnRlcnBvbGF0ZShcImJhc2lzXCIpXHJcbiAgICAgICAgICAgIC54KGQgPT4gc2VsZi5wbG90Lnguc2NhbGUoZC54KSlcclxuICAgICAgICAgICAgLnkoZCA9PiBzZWxmLnBsb3QueS5zY2FsZShkLnkpKTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgdmFyIGNvbG9yID0gc2VsZi5wbG90LmRvdC5jb2xvcjtcclxuXHJcbiAgICAgICAgdmFyIGRlZmF1bHRDb2xvciA9IFwiYmxhY2tcIjtcclxuICAgICAgICBpZihVdGlscy5pc0Z1bmN0aW9uKGNvbG9yKSl7XHJcbiAgICAgICAgICAgIGlmKHZhbHVlcy5sZW5ndGggJiYgZ3JvdXBWYWwhPT1mYWxzZSl7XHJcbiAgICAgICAgICAgICAgICBjb2xvciA9IGNvbG9yKHZhbHVlc1swXSk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgY29sb3IgPSBkZWZhdWx0Q29sb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZSBpZighY29sb3IgJiYgZ3JvdXBWYWw9PT1mYWxzZSl7XHJcbiAgICAgICAgICAgIGNvbG9yID0gZGVmYXVsdENvbG9yO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHZhciBjb25maWRlbmNlID0gdGhpcy5jb21wdXRlQ29uZmlkZW5jZShwb2ludHMsIGV4dGVudFgsICBsaW5lYXJSZWdyZXNzaW9uLGxpbmVhclJlZ3Jlc3Npb25MaW5lKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBncm91cDogZ3JvdXBWYWwgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgIGxpbmU6IGxpbmUsXHJcbiAgICAgICAgICAgIGxpbmVQb2ludHM6IGxpbmVQb2ludHMsXHJcbiAgICAgICAgICAgIGNvbG9yOiBjb2xvcixcclxuICAgICAgICAgICAgY29uZmlkZW5jZTogY29uZmlkZW5jZVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgY29tcHV0ZUNvbmZpZGVuY2UocG9pbnRzLCBleHRlbnRYLCBsaW5lYXJSZWdyZXNzaW9uLGxpbmVhclJlZ3Jlc3Npb25MaW5lKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHNsb3BlID0gbGluZWFyUmVncmVzc2lvbi5tO1xyXG4gICAgICAgIHZhciBuID0gcG9pbnRzLmxlbmd0aDtcclxuICAgICAgICB2YXIgZGVncmVlc09mRnJlZWRvbSA9IE1hdGgubWF4KDAsIG4tMik7XHJcblxyXG4gICAgICAgIHZhciBhbHBoYSA9IDEgLSBzZWxmLmNvbmZpZy5jb25maWRlbmNlLmxldmVsO1xyXG4gICAgICAgIHZhciBjcml0aWNhbFByb2JhYmlsaXR5ICA9IDEgLSBhbHBoYS8yO1xyXG4gICAgICAgIHZhciBjcml0aWNhbFZhbHVlID0gc2VsZi5jb25maWcuY29uZmlkZW5jZS5jcml0aWNhbFZhbHVlKGRlZ3JlZXNPZkZyZWVkb20sY3JpdGljYWxQcm9iYWJpbGl0eSk7XHJcblxyXG4gICAgICAgIHZhciB4VmFsdWVzID0gcG9pbnRzLm1hcChkPT5kWzBdKTtcclxuICAgICAgICB2YXIgbWVhblggPSBTdGF0aXN0aWNzVXRpbHMubWVhbih4VmFsdWVzKTtcclxuICAgICAgICB2YXIgeE15U3VtPTA7XHJcbiAgICAgICAgdmFyIHhTdW09MDtcclxuICAgICAgICB2YXIgeFBvd1N1bT0wO1xyXG4gICAgICAgIHZhciB5U3VtPTA7XHJcbiAgICAgICAgdmFyIHlQb3dTdW09MDtcclxuICAgICAgICBwb2ludHMuZm9yRWFjaChwPT57XHJcbiAgICAgICAgICAgIHZhciB4ID0gcFswXTtcclxuICAgICAgICAgICAgdmFyIHkgPSBwWzFdO1xyXG5cclxuICAgICAgICAgICAgeE15U3VtICs9IHgqeTtcclxuICAgICAgICAgICAgeFN1bSs9eDtcclxuICAgICAgICAgICAgeVN1bSs9eTtcclxuICAgICAgICAgICAgeFBvd1N1bSs9IHgqeDtcclxuICAgICAgICAgICAgeVBvd1N1bSs9IHkqeTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgYSA9IGxpbmVhclJlZ3Jlc3Npb24ubTtcclxuICAgICAgICB2YXIgYiA9IGxpbmVhclJlZ3Jlc3Npb24uYjtcclxuXHJcbiAgICAgICAgdmFyIFNhMiA9IG4vKG4rMikgKiAoKHlQb3dTdW0tYSp4TXlTdW0tYip5U3VtKS8obip4UG93U3VtLSh4U3VtKnhTdW0pKSk7IC8vV2FyaWFuY2phIHdzcMOzxYJjenlubmlrYSBraWVydW5rb3dlZ28gcmVncmVzamkgbGluaW93ZWogYVxyXG4gICAgICAgIHZhciBTeTIgPSAoeVBvd1N1bSAtIGEqeE15U3VtLWIqeVN1bSkvKG4qKG4tMikpOyAvL1NhMiAvL01lYW4geSB2YWx1ZSB2YXJpYW5jZVxyXG5cclxuICAgICAgICB2YXIgZXJyb3JGbiA9IHg9PiBNYXRoLnNxcnQoU3kyICsgTWF0aC5wb3coeC1tZWFuWCwyKSpTYTIpOyAvL3BpZXJ3aWFzdGVrIGt3YWRyYXRvd3kgeiB3YXJpYW5jamkgZG93b2xuZWdvIHB1bmt0dSBwcm9zdGVqXHJcbiAgICAgICAgdmFyIG1hcmdpbk9mRXJyb3IgPSAgeD0+IGNyaXRpY2FsVmFsdWUqIGVycm9yRm4oeCk7XHJcblxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbicsIG4sICdkZWdyZWVzT2ZGcmVlZG9tJywgZGVncmVlc09mRnJlZWRvbSwgJ2NyaXRpY2FsUHJvYmFiaWxpdHknLGNyaXRpY2FsUHJvYmFiaWxpdHkpO1xyXG4gICAgICAgIC8vIHZhciBjb25maWRlbmNlRG93biA9IHggPT4gbGluZWFyUmVncmVzc2lvbkxpbmUoeCkgLSAgbWFyZ2luT2ZFcnJvcih4KTtcclxuICAgICAgICAvLyB2YXIgY29uZmlkZW5jZVVwID0geCA9PiBsaW5lYXJSZWdyZXNzaW9uTGluZSh4KSArICBtYXJnaW5PZkVycm9yKHgpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGNvbXB1dGVDb25maWRlbmNlQXJlYVBvaW50ID0geD0+e1xyXG4gICAgICAgICAgICB2YXIgbGluZWFyUmVncmVzc2lvbiA9IGxpbmVhclJlZ3Jlc3Npb25MaW5lKHgpO1xyXG4gICAgICAgICAgICB2YXIgbW9lID0gbWFyZ2luT2ZFcnJvcih4KTtcclxuICAgICAgICAgICAgdmFyIGNvbmZEb3duID0gbGluZWFyUmVncmVzc2lvbiAtIG1vZTtcclxuICAgICAgICAgICAgdmFyIGNvbmZVcCA9IGxpbmVhclJlZ3Jlc3Npb24gKyBtb2U7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB4OiB4LFxyXG4gICAgICAgICAgICAgICAgeTA6IGNvbmZEb3duLFxyXG4gICAgICAgICAgICAgICAgeTE6IGNvbmZVcFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBjZW50ZXJYID0gKGV4dGVudFhbMV0rZXh0ZW50WFswXSkvMjtcclxuXHJcbiAgICAgICAgLy8gdmFyIGNvbmZpZGVuY2VBcmVhUG9pbnRzID0gW2V4dGVudFhbMF0sIGNlbnRlclgsICBleHRlbnRYWzFdXS5tYXAoY29tcHV0ZUNvbmZpZGVuY2VBcmVhUG9pbnQpO1xyXG4gICAgICAgIHZhciBjb25maWRlbmNlQXJlYVBvaW50cyA9IFtleHRlbnRYWzBdLCBjZW50ZXJYLCAgZXh0ZW50WFsxXV0ubWFwKGNvbXB1dGVDb25maWRlbmNlQXJlYVBvaW50KTtcclxuXHJcbiAgICAgICAgdmFyIGZpdEluUGxvdCA9IHkgPT4geTtcclxuXHJcbiAgICAgICAgdmFyIGNvbmZpZGVuY2VBcmVhID0gIGQzLnN2Zy5hcmVhKClcclxuICAgICAgICAuaW50ZXJwb2xhdGUoXCJtb25vdG9uZVwiKVxyXG4gICAgICAgICAgICAueChkID0+IHNlbGYucGxvdC54LnNjYWxlKGQueCkpXHJcbiAgICAgICAgICAgIC55MChkID0+IGZpdEluUGxvdChzZWxmLnBsb3QueS5zY2FsZShkLnkwKSkpXHJcbiAgICAgICAgICAgIC55MShkID0+IGZpdEluUGxvdChzZWxmLnBsb3QueS5zY2FsZShkLnkxKSkpO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBhcmVhOmNvbmZpZGVuY2VBcmVhLFxyXG4gICAgICAgICAgICBwb2ludHM6Y29uZmlkZW5jZUFyZWFQb2ludHNcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShuZXdEYXRhKXtcclxuICAgICAgICBzdXBlci51cGRhdGUobmV3RGF0YSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSZWdyZXNzaW9uTGluZXMoKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHVwZGF0ZVJlZ3Jlc3Npb25MaW5lcygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb25Db250YWluZXJDbGFzcyA9IHRoaXMucHJlZml4Q2xhc3MoXCJyZWdyZXNzaW9uLWNvbnRhaW5lclwiKTtcclxuICAgICAgICB2YXIgcmVncmVzc2lvbkNvbnRhaW5lclNlbGVjdG9yID0gXCJnLlwiK3JlZ3Jlc3Npb25Db250YWluZXJDbGFzcztcclxuXHJcbiAgICAgICAgdmFyIGNsaXBQYXRoSWQgPSBzZWxmLnByZWZpeENsYXNzKFwiY2xpcFwiKTtcclxuXHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb25Db250YWluZXIgPSBzZWxmLnN2Z0cuc2VsZWN0T3JJbnNlcnQocmVncmVzc2lvbkNvbnRhaW5lclNlbGVjdG9yLCBcIi5cIitzZWxmLmRvdHNDb250YWluZXJDbGFzcyk7XHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb25Db250YWluZXJDbGlwID0gcmVncmVzc2lvbkNvbnRhaW5lci5zZWxlY3RPckFwcGVuZChcImNsaXBQYXRoXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgY2xpcFBhdGhJZCk7XHJcblxyXG5cclxuICAgICAgICByZWdyZXNzaW9uQ29udGFpbmVyQ2xpcC5zZWxlY3RPckFwcGVuZCgncmVjdCcpXHJcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHNlbGYucGxvdC53aWR0aClcclxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHNlbGYucGxvdC5oZWlnaHQpXHJcbiAgICAgICAgICAgIC5hdHRyKCd4JywgMClcclxuICAgICAgICAgICAgLmF0dHIoJ3knLCAwKTtcclxuXHJcbiAgICAgICAgcmVncmVzc2lvbkNvbnRhaW5lci5hdHRyKFwiY2xpcC1wYXRoXCIsIChkLGkpID0+IFwidXJsKCNcIitjbGlwUGF0aElkK1wiKVwiKTtcclxuXHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb25DbGFzcyA9IHRoaXMucHJlZml4Q2xhc3MoXCJyZWdyZXNzaW9uXCIpO1xyXG4gICAgICAgIHZhciBjb25maWRlbmNlQXJlYUNsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImNvbmZpZGVuY2VcIik7XHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb25TZWxlY3RvciA9IFwiZy5cIityZWdyZXNzaW9uQ2xhc3M7XHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb24gPSByZWdyZXNzaW9uQ29udGFpbmVyLnNlbGVjdEFsbChyZWdyZXNzaW9uU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5kYXRhKHNlbGYucGxvdC5yZWdyZXNzaW9ucyk7XHJcblxyXG4gICAgICAgIHZhciBsaW5lID0gcmVncmVzc2lvbi5lbnRlcigpXHJcbiAgICAgICAgICAgIC5pbnNlcnRTZWxlY3RvcihyZWdyZXNzaW9uU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoXCJwYXRoXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgc2VsZi5wcmVmaXhDbGFzcyhcImxpbmVcIikpXHJcbiAgICAgICAgICAgIC5hdHRyKFwic2hhcGUtcmVuZGVyaW5nXCIsIFwib3B0aW1pemVRdWFsaXR5XCIpO1xyXG4gICAgICAgICAgICAvLyAuYXBwZW5kKFwibGluZVwiKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcImNsYXNzXCIsIFwibGluZVwiKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcInNoYXBlLXJlbmRlcmluZ1wiLCBcIm9wdGltaXplUXVhbGl0eVwiKTtcclxuXHJcbiAgICAgICAgbGluZVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcIngxXCIsIHI9PiBzZWxmLnBsb3QueC5zY2FsZShyLmxpbmVQb2ludHNbMF0ueCkpXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwieTFcIiwgcj0+IHNlbGYucGxvdC55LnNjYWxlKHIubGluZVBvaW50c1swXS55KSlcclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJ4MlwiLCByPT4gc2VsZi5wbG90Lnguc2NhbGUoci5saW5lUG9pbnRzWzFdLngpKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcInkyXCIsIHI9PiBzZWxmLnBsb3QueS5zY2FsZShyLmxpbmVQb2ludHNbMV0ueSkpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZFwiLCByID0+IHIubGluZShyLmxpbmVQb2ludHMpKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgciA9PiByLmNvbG9yKTtcclxuXHJcblxyXG4gICAgICAgIHZhciBhcmVhID0gcmVncmVzc2lvbi5lbnRlcigpXHJcbiAgICAgICAgICAgIC5hcHBlbmRTZWxlY3RvcihyZWdyZXNzaW9uU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoXCJwYXRoXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgY29uZmlkZW5jZUFyZWFDbGFzcylcclxuICAgICAgICAgICAgLmF0dHIoXCJzaGFwZS1yZW5kZXJpbmdcIiwgXCJvcHRpbWl6ZVF1YWxpdHlcIik7XHJcblxyXG5cclxuICAgICAgICBhcmVhXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZFwiLCByID0+IHIuY29uZmlkZW5jZS5hcmVhKHIuY29uZmlkZW5jZS5wb2ludHMpKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIHIgPT4gci5jb2xvcilcclxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCBcIjAuNFwiKTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG59XHJcblxyXG4iLCJpbXBvcnQge0NoYXJ0LCBDaGFydENvbmZpZ30gZnJvbSBcIi4vY2hhcnRcIjtcclxuaW1wb3J0IHtTY2F0dGVyUGxvdENvbmZpZ30gZnJvbSBcIi4vc2NhdHRlcnBsb3RcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IHtMZWdlbmR9IGZyb20gXCIuL2xlZ2VuZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNjYXR0ZXJQbG90TWF0cml4Q29uZmlnIGV4dGVuZHMgU2NhdHRlclBsb3RDb25maWd7XHJcblxyXG4gICAgc3ZnQ2xhc3M9IHRoaXMuY3NzQ2xhc3NQcmVmaXgrJ3NjYXR0ZXJwbG90LW1hdHJpeCc7XHJcbiAgICBzaXplPSAyMDA7IC8vc2NhdHRlciBwbG90IGNlbGwgc2l6ZVxyXG4gICAgcGFkZGluZz0gMjA7IC8vc2NhdHRlciBwbG90IGNlbGwgcGFkZGluZ1xyXG4gICAgYnJ1c2g9IHRydWU7XHJcbiAgICBndWlkZXM9IHRydWU7IC8vc2hvdyBheGlzIGd1aWRlc1xyXG4gICAgc2hvd1Rvb2x0aXA9IHRydWU7IC8vc2hvdyB0b29sdGlwIG9uIGRvdCBob3ZlclxyXG4gICAgdGlja3M9IHVuZGVmaW5lZDsgLy90aWNrcyBudW1iZXIsIChkZWZhdWx0OiBjb21wdXRlZCB1c2luZyBjZWxsIHNpemUpXHJcbiAgICB4PXsvLyBYIGF4aXMgY29uZmlnXHJcbiAgICAgICAgb3JpZW50OiBcImJvdHRvbVwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiXHJcbiAgICB9O1xyXG4gICAgeT17Ly8gWSBheGlzIGNvbmZpZ1xyXG4gICAgICAgIG9yaWVudDogXCJsZWZ0XCIsXHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCJcclxuICAgIH07XHJcbiAgICBncm91cHM9e1xyXG4gICAgICAgIGtleTogdW5kZWZpbmVkLCAvL29iamVjdCBwcm9wZXJ0eSBuYW1lIG9yIGFycmF5IGluZGV4IHdpdGggZ3JvdXBpbmcgdmFyaWFibGVcclxuICAgICAgICBpbmNsdWRlSW5QbG90OiBmYWxzZSwgLy9pbmNsdWRlIGdyb3VwIGFzIHZhcmlhYmxlIGluIHBsb3QsIGJvb2xlYW4gKGRlZmF1bHQ6IGZhbHNlKVxyXG4gICAgICAgIHZhbHVlOiAoZCwga2V5KSA9PiBkW2tleV0sIC8vIGdyb3VwaW5nIHZhbHVlIGFjY2Vzc29yLFxyXG4gICAgICAgIGxhYmVsOiBcIlwiXHJcbiAgICB9O1xyXG4gICAgdmFyaWFibGVzPSB7XHJcbiAgICAgICAgbGFiZWxzOiBbXSwgLy9vcHRpb25hbCBhcnJheSBvZiB2YXJpYWJsZSBsYWJlbHMgKGZvciB0aGUgZGlhZ29uYWwgb2YgdGhlIHBsb3QpLlxyXG4gICAgICAgIGtleXM6IFtdLCAvL29wdGlvbmFsIGFycmF5IG9mIHZhcmlhYmxlIGtleXNcclxuICAgICAgICB2YWx1ZTogKGQsIHZhcmlhYmxlS2V5KSA9PiBkW3ZhcmlhYmxlS2V5XSAvLyB2YXJpYWJsZSB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTY2F0dGVyUGxvdE1hdHJpeCBleHRlbmRzIENoYXJ0IHtcclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIG5ldyBTY2F0dGVyUGxvdE1hdHJpeENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgU2NhdHRlclBsb3RNYXRyaXhDb25maWcoY29uZmlnKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgbWFyZ2luID0gdGhpcy5wbG90Lm1hcmdpbjtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG4gICAgICAgIHRoaXMucGxvdC54PXt9O1xyXG4gICAgICAgIHRoaXMucGxvdC55PXt9O1xyXG4gICAgICAgIHRoaXMucGxvdC5kb3Q9e1xyXG4gICAgICAgICAgICBjb2xvcjogbnVsbC8vY29sb3Igc2NhbGUgbWFwcGluZyBmdW5jdGlvblxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICB0aGlzLnBsb3Quc2hvd0xlZ2VuZCA9IGNvbmYuc2hvd0xlZ2VuZDtcclxuICAgICAgICBpZih0aGlzLnBsb3Quc2hvd0xlZ2VuZCl7XHJcbiAgICAgICAgICAgIG1hcmdpbi5yaWdodCA9IGNvbmYubWFyZ2luLnJpZ2h0ICsgY29uZi5sZWdlbmQud2lkdGgrY29uZi5sZWdlbmQubWFyZ2luKjI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldHVwVmFyaWFibGVzKCk7XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC5zaXplID0gY29uZi5zaXplO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIHdpZHRoID0gY29uZi53aWR0aDtcclxuICAgICAgICB2YXIgYm91bmRpbmdDbGllbnRSZWN0ID0gdGhpcy5nZXRCYXNlQ29udGFpbmVyTm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGlmICghd2lkdGgpIHtcclxuICAgICAgICAgICAgdmFyIG1heFdpZHRoID0gbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQgKyB0aGlzLnBsb3QudmFyaWFibGVzLmxlbmd0aCp0aGlzLnBsb3Quc2l6ZTtcclxuICAgICAgICAgICAgd2lkdGggPSBNYXRoLm1pbihib3VuZGluZ0NsaWVudFJlY3Qud2lkdGgsIG1heFdpZHRoKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBoZWlnaHQgPSB3aWR0aDtcclxuICAgICAgICBpZiAoIWhlaWdodCkge1xyXG4gICAgICAgICAgICBoZWlnaHQgPSBib3VuZGluZ0NsaWVudFJlY3QuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wbG90LndpZHRoID0gd2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodDtcclxuICAgICAgICB0aGlzLnBsb3QuaGVpZ2h0ID0gaGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgIGlmKGNvbmYudGlja3M9PT11bmRlZmluZWQpe1xyXG4gICAgICAgICAgICBjb25mLnRpY2tzID0gdGhpcy5wbG90LnNpemUgLyA0MDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBYKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFkoKTtcclxuXHJcbiAgICAgICAgaWYgKGNvbmYuZG90LmQzQ29sb3JDYXRlZ29yeSkge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yQ2F0ZWdvcnkgPSBkMy5zY2FsZVtjb25mLmRvdC5kM0NvbG9yQ2F0ZWdvcnldKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjb2xvclZhbHVlID0gY29uZi5kb3QuY29sb3I7XHJcbiAgICAgICAgaWYgKGNvbG9yVmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmRvdC5jb2xvclZhbHVlID0gY29sb3JWYWx1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29sb3JWYWx1ZSA9PT0gJ3N0cmluZycgfHwgY29sb3JWYWx1ZSBpbnN0YW5jZW9mIFN0cmluZykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmRvdC5jb2xvciA9IGNvbG9yVmFsdWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wbG90LmRvdC5jb2xvckNhdGVnb3J5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yID0gZCA9PiBzZWxmLnBsb3QuZG90LmNvbG9yQ2F0ZWdvcnkoc2VsZi5wbG90LmRvdC5jb2xvclZhbHVlKGQpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBWYXJpYWJsZXMoKSB7XHJcbiAgICAgICAgdmFyIHZhcmlhYmxlc0NvbmYgPSB0aGlzLmNvbmZpZy52YXJpYWJsZXM7XHJcblxyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHBsb3QuZG9tYWluQnlWYXJpYWJsZSA9IHt9O1xyXG4gICAgICAgIHBsb3QudmFyaWFibGVzID0gdmFyaWFibGVzQ29uZi5rZXlzO1xyXG4gICAgICAgIGlmKCFwbG90LnZhcmlhYmxlcyB8fCAhcGxvdC52YXJpYWJsZXMubGVuZ3RoKXtcclxuICAgICAgICAgICAgcGxvdC52YXJpYWJsZXMgPSBVdGlscy5pbmZlclZhcmlhYmxlcyhkYXRhLCB0aGlzLmNvbmZpZy5ncm91cHMua2V5LCB0aGlzLmNvbmZpZy5pbmNsdWRlSW5QbG90KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBsb3QubGFiZWxzID0gW107XHJcbiAgICAgICAgcGxvdC5sYWJlbEJ5VmFyaWFibGUgPSB7fTtcclxuICAgICAgICBwbG90LnZhcmlhYmxlcy5mb3JFYWNoKCh2YXJpYWJsZUtleSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgcGxvdC5kb21haW5CeVZhcmlhYmxlW3ZhcmlhYmxlS2V5XSA9IGQzLmV4dGVudChkYXRhLCBmdW5jdGlvbihkKSB7IHJldHVybiB2YXJpYWJsZXNDb25mLnZhbHVlKGQsIHZhcmlhYmxlS2V5KSB9KTtcclxuICAgICAgICAgICAgdmFyIGxhYmVsID0gdmFyaWFibGVLZXk7XHJcbiAgICAgICAgICAgIGlmKHZhcmlhYmxlc0NvbmYubGFiZWxzICYmIHZhcmlhYmxlc0NvbmYubGFiZWxzLmxlbmd0aD5pbmRleCl7XHJcblxyXG4gICAgICAgICAgICAgICAgbGFiZWwgPSB2YXJpYWJsZXNDb25mLmxhYmVsc1tpbmRleF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGxvdC5sYWJlbHMucHVzaChsYWJlbCk7XHJcbiAgICAgICAgICAgIHBsb3QubGFiZWxCeVZhcmlhYmxlW3ZhcmlhYmxlS2V5XSA9IGxhYmVsO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhwbG90LmxhYmVsQnlWYXJpYWJsZSk7XHJcblxyXG4gICAgICAgIHBsb3Quc3VicGxvdHMgPSBbXTtcclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBYKCkge1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeCA9IHBsb3QueDtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB4LnZhbHVlID0gY29uZi52YXJpYWJsZXMudmFsdWU7XHJcbiAgICAgICAgeC5zY2FsZSA9IGQzLnNjYWxlW2NvbmYueC5zY2FsZV0oKS5yYW5nZShbY29uZi5wYWRkaW5nIC8gMiwgcGxvdC5zaXplIC0gY29uZi5wYWRkaW5nIC8gMl0pO1xyXG4gICAgICAgIHgubWFwID0gKGQsIHZhcmlhYmxlKSA9PiB4LnNjYWxlKHgudmFsdWUoZCwgdmFyaWFibGUpKTtcclxuICAgICAgICB4LmF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHguc2NhbGUpLm9yaWVudChjb25mLngub3JpZW50KS50aWNrcyhjb25mLnRpY2tzKTtcclxuICAgICAgICB4LmF4aXMudGlja1NpemUocGxvdC5zaXplICogcGxvdC52YXJpYWJsZXMubGVuZ3RoKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwWSgpIHtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHkgPSBwbG90Lnk7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgeS52YWx1ZSA9IGNvbmYudmFyaWFibGVzLnZhbHVlO1xyXG4gICAgICAgIHkuc2NhbGUgPSBkMy5zY2FsZVtjb25mLnkuc2NhbGVdKCkucmFuZ2UoWyBwbG90LnNpemUgLSBjb25mLnBhZGRpbmcgLyAyLCBjb25mLnBhZGRpbmcgLyAyXSk7XHJcbiAgICAgICAgeS5tYXAgPSAoZCwgdmFyaWFibGUpID0+IHkuc2NhbGUoeS52YWx1ZShkLCB2YXJpYWJsZSkpO1xyXG4gICAgICAgIHkuYXhpcz0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh5LnNjYWxlKS5vcmllbnQoY29uZi55Lm9yaWVudCkudGlja3MoY29uZi50aWNrcyk7XHJcbiAgICAgICAgeS5heGlzLnRpY2tTaXplKC1wbG90LnNpemUgKiBwbG90LnZhcmlhYmxlcy5sZW5ndGgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBkcmF3KCkge1xyXG4gICAgICAgIHZhciBzZWxmID10aGlzO1xyXG4gICAgICAgIHZhciBuID0gc2VsZi5wbG90LnZhcmlhYmxlcy5sZW5ndGg7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgdmFyIGF4aXNDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJheGlzXCIpO1xyXG4gICAgICAgIHZhciBheGlzWENsYXNzID0gYXhpc0NsYXNzK1wiLXhcIjtcclxuICAgICAgICB2YXIgYXhpc1lDbGFzcyA9IGF4aXNDbGFzcytcIi15XCI7XHJcblxyXG4gICAgICAgIHZhciB4QXhpc1NlbGVjdG9yID0gXCJnLlwiK2F4aXNYQ2xhc3MrXCIuXCIrYXhpc0NsYXNzO1xyXG4gICAgICAgIHZhciB5QXhpc1NlbGVjdG9yID0gXCJnLlwiK2F4aXNZQ2xhc3MrXCIuXCIrYXhpc0NsYXNzO1xyXG5cclxuICAgICAgICB2YXIgbm9HdWlkZXNDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJuby1ndWlkZXNcIik7XHJcbiAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbCh4QXhpc1NlbGVjdG9yKVxyXG4gICAgICAgICAgICAuZGF0YShzZWxmLnBsb3QudmFyaWFibGVzKVxyXG4gICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmRTZWxlY3Rvcih4QXhpc1NlbGVjdG9yKVxyXG4gICAgICAgICAgICAuY2xhc3NlZChub0d1aWRlc0NsYXNzLCAhY29uZi5ndWlkZXMpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInRyYW5zbGF0ZShcIiArIChuIC0gaSAtIDEpICogc2VsZi5wbG90LnNpemUgKyBcIiwwKVwiKVxyXG4gICAgICAgICAgICAuZWFjaChmdW5jdGlvbihkKSB7IHNlbGYucGxvdC54LnNjYWxlLmRvbWFpbihzZWxmLnBsb3QuZG9tYWluQnlWYXJpYWJsZVtkXSk7IGQzLnNlbGVjdCh0aGlzKS5jYWxsKHNlbGYucGxvdC54LmF4aXMpOyB9KTtcclxuXHJcbiAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbCh5QXhpc1NlbGVjdG9yKVxyXG4gICAgICAgICAgICAuZGF0YShzZWxmLnBsb3QudmFyaWFibGVzKVxyXG4gICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmRTZWxlY3Rvcih5QXhpc1NlbGVjdG9yKVxyXG4gICAgICAgICAgICAuY2xhc3NlZChub0d1aWRlc0NsYXNzLCAhY29uZi5ndWlkZXMpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInRyYW5zbGF0ZSgwLFwiICsgaSAqIHNlbGYucGxvdC5zaXplICsgXCIpXCIpXHJcbiAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uKGQpIHsgc2VsZi5wbG90Lnkuc2NhbGUuZG9tYWluKHNlbGYucGxvdC5kb21haW5CeVZhcmlhYmxlW2RdKTsgZDMuc2VsZWN0KHRoaXMpLmNhbGwoc2VsZi5wbG90LnkuYXhpcyk7IH0pO1xyXG5cclxuICAgICAgICB2YXIgY2VsbENsYXNzID0gIHNlbGYucHJlZml4Q2xhc3MoXCJjZWxsXCIpO1xyXG4gICAgICAgIHZhciBjZWxsID0gc2VsZi5zdmdHLnNlbGVjdEFsbChcIi5cIitjZWxsQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHNlbGYudXRpbHMuY3Jvc3Moc2VsZi5wbG90LnZhcmlhYmxlcywgc2VsZi5wbG90LnZhcmlhYmxlcykpXHJcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZFNlbGVjdG9yKFwiZy5cIitjZWxsQ2xhc3MpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGQgPT4gXCJ0cmFuc2xhdGUoXCIgKyAobiAtIGQuaSAtIDEpICogc2VsZi5wbG90LnNpemUgKyBcIixcIiArIGQuaiAqIHNlbGYucGxvdC5zaXplICsgXCIpXCIpO1xyXG5cclxuICAgICAgICBpZihjb25mLmJydXNoKXtcclxuICAgICAgICAgICAgdGhpcy5kcmF3QnJ1c2goY2VsbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjZWxsLmVhY2gocGxvdFN1YnBsb3QpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIC8vTGFiZWxzXHJcbiAgICAgICAgY2VsbC5maWx0ZXIoZCA9PiBkLmkgPT09IGQuailcclxuICAgICAgICAgICAgLmFwcGVuZChcInRleHRcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIGNvbmYucGFkZGluZylcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIGNvbmYucGFkZGluZylcclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCBcIi43MWVtXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KCBkID0+IHNlbGYucGxvdC5sYWJlbEJ5VmFyaWFibGVbZC54XSk7XHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBsb3RTdWJwbG90KHApIHtcclxuICAgICAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgICAgIHBsb3Quc3VicGxvdHMucHVzaChwKTtcclxuICAgICAgICAgICAgdmFyIGNlbGwgPSBkMy5zZWxlY3QodGhpcyk7XHJcblxyXG4gICAgICAgICAgICBwbG90Lnguc2NhbGUuZG9tYWluKHBsb3QuZG9tYWluQnlWYXJpYWJsZVtwLnhdKTtcclxuICAgICAgICAgICAgcGxvdC55LnNjYWxlLmRvbWFpbihwbG90LmRvbWFpbkJ5VmFyaWFibGVbcC55XSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZnJhbWVDbGFzcyA9ICBzZWxmLnByZWZpeENsYXNzKFwiZnJhbWVcIik7XHJcbiAgICAgICAgICAgIGNlbGwuYXBwZW5kKFwicmVjdFwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBmcmFtZUNsYXNzKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIGNvbmYucGFkZGluZyAvIDIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInlcIiwgY29uZi5wYWRkaW5nIC8gMilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgY29uZi5zaXplIC0gY29uZi5wYWRkaW5nKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgY29uZi5zaXplIC0gY29uZi5wYWRkaW5nKTtcclxuXHJcblxyXG4gICAgICAgICAgICBwLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN1YnBsb3QgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRvdHMgPSBjZWxsLnNlbGVjdEFsbChcImNpcmNsZVwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kYXRhKHNlbGYuZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZG90cy5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBkb3RzLmF0dHIoXCJjeFwiLCAoZCkgPT4gcGxvdC54Lm1hcChkLCBzdWJwbG90LngpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiY3lcIiwgKGQpID0+IHBsb3QueS5tYXAoZCwgc3VicGxvdC55KSlcclxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcInJcIiwgc2VsZi5jb25maWcuZG90LnJhZGl1cyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHBsb3QuZG90LmNvbG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG90cy5zdHlsZShcImZpbGxcIiwgcGxvdC5kb3QuY29sb3IpXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYocGxvdC50b29sdGlwKXtcclxuICAgICAgICAgICAgICAgICAgICBkb3RzLm9uKFwibW91c2VvdmVyXCIsIChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIC45KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGh0bWwgPSBcIihcIiArIHBsb3QueC52YWx1ZShkLCBzdWJwbG90LngpICsgXCIsIFwiICtwbG90LnkudmFsdWUoZCwgc3VicGxvdC55KSArIFwiKVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAuaHRtbChodG1sKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZDMuZXZlbnQucGFnZVggKyA1KSArIFwicHhcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdyb3VwID0gc2VsZi5jb25maWcuZ3JvdXBzLnZhbHVlKGQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihncm91cCB8fCBncm91cD09PTAgKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwrPVwiPGJyLz5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYWJlbCA9IHNlbGYuY29uZmlnLmdyb3Vwcy5sYWJlbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGxhYmVsKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sKz1sYWJlbCtcIjogXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sKz1ncm91cFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC5odG1sKGh0bWwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkMy5ldmVudC5wYWdlWSAtIDI4KSArIFwicHhcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgKGQpPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZG90cy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHAudXBkYXRlKCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlTGVnZW5kKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHVwZGF0ZShkYXRhKSB7XHJcblxyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShkYXRhKTtcclxuICAgICAgICB0aGlzLnBsb3Quc3VicGxvdHMuZm9yRWFjaChwID0+IHAudXBkYXRlKCkpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTGVnZW5kKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRyYXdCcnVzaChjZWxsKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBicnVzaCA9IGQzLnN2Zy5icnVzaCgpXHJcbiAgICAgICAgICAgIC54KHNlbGYucGxvdC54LnNjYWxlKVxyXG4gICAgICAgICAgICAueShzZWxmLnBsb3QueS5zY2FsZSlcclxuICAgICAgICAgICAgLm9uKFwiYnJ1c2hzdGFydFwiLCBicnVzaHN0YXJ0KVxyXG4gICAgICAgICAgICAub24oXCJicnVzaFwiLCBicnVzaG1vdmUpXHJcbiAgICAgICAgICAgIC5vbihcImJydXNoZW5kXCIsIGJydXNoZW5kKTtcclxuXHJcbiAgICAgICAgY2VsbC5hcHBlbmQoXCJnXCIpLmNhbGwoYnJ1c2gpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGJydXNoQ2VsbDtcclxuXHJcbiAgICAgICAgLy8gQ2xlYXIgdGhlIHByZXZpb3VzbHktYWN0aXZlIGJydXNoLCBpZiBhbnkuXHJcbiAgICAgICAgZnVuY3Rpb24gYnJ1c2hzdGFydChwKSB7XHJcbiAgICAgICAgICAgIGlmIChicnVzaENlbGwgIT09IHRoaXMpIHtcclxuICAgICAgICAgICAgICAgIGQzLnNlbGVjdChicnVzaENlbGwpLmNhbGwoYnJ1c2guY2xlYXIoKSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QueC5zY2FsZS5kb21haW4oc2VsZi5wbG90LmRvbWFpbkJ5VmFyaWFibGVbcC54XSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QueS5zY2FsZS5kb21haW4oc2VsZi5wbG90LmRvbWFpbkJ5VmFyaWFibGVbcC55XSk7XHJcbiAgICAgICAgICAgICAgICBicnVzaENlbGwgPSB0aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBIaWdobGlnaHQgdGhlIHNlbGVjdGVkIGNpcmNsZXMuXHJcbiAgICAgICAgZnVuY3Rpb24gYnJ1c2htb3ZlKHApIHtcclxuICAgICAgICAgICAgdmFyIGUgPSBicnVzaC5leHRlbnQoKTtcclxuICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcImNpcmNsZVwiKS5jbGFzc2VkKFwiaGlkZGVuXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZVswXVswXSA+IGRbcC54XSB8fCBkW3AueF0gPiBlWzFdWzBdXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgZVswXVsxXSA+IGRbcC55XSB8fCBkW3AueV0gPiBlWzFdWzFdO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gSWYgdGhlIGJydXNoIGlzIGVtcHR5LCBzZWxlY3QgYWxsIGNpcmNsZXMuXHJcbiAgICAgICAgZnVuY3Rpb24gYnJ1c2hlbmQoKSB7XHJcbiAgICAgICAgICAgIGlmIChicnVzaC5lbXB0eSgpKSBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwiLmhpZGRlblwiKS5jbGFzc2VkKFwiaGlkZGVuXCIsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHVwZGF0ZUxlZ2VuZCgpIHtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ3VwZGF0ZUxlZ2VuZCcpO1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG5cclxuICAgICAgICB2YXIgc2NhbGUgPSBwbG90LmRvdC5jb2xvckNhdGVnb3J5O1xyXG4gICAgICAgIGlmKCFzY2FsZS5kb21haW4oKSB8fCBzY2FsZS5kb21haW4oKS5sZW5ndGg8Mil7XHJcbiAgICAgICAgICAgIHBsb3Quc2hvd0xlZ2VuZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIXBsb3Quc2hvd0xlZ2VuZCl7XHJcbiAgICAgICAgICAgIGlmKHBsb3QubGVnZW5kICYmIHBsb3QubGVnZW5kLmNvbnRhaW5lcil7XHJcbiAgICAgICAgICAgICAgICBwbG90LmxlZ2VuZC5jb250YWluZXIucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHZhciBsZWdlbmRYID0gdGhpcy5wbG90LndpZHRoICsgdGhpcy5jb25maWcubGVnZW5kLm1hcmdpbjtcclxuICAgICAgICB2YXIgbGVnZW5kWSA9IHRoaXMuY29uZmlnLmxlZ2VuZC5tYXJnaW47XHJcblxyXG4gICAgICAgIHBsb3QubGVnZW5kID0gbmV3IExlZ2VuZCh0aGlzLnN2ZywgdGhpcy5zdmdHLCBzY2FsZSwgbGVnZW5kWCwgbGVnZW5kWSk7XHJcblxyXG4gICAgICAgIHZhciBsZWdlbmRMaW5lYXIgPSBwbG90LmxlZ2VuZC5jb2xvcigpXHJcbiAgICAgICAgICAgIC5zaGFwZVdpZHRoKHRoaXMuY29uZmlnLmxlZ2VuZC5zaGFwZVdpZHRoKVxyXG4gICAgICAgICAgICAub3JpZW50KCd2ZXJ0aWNhbCcpXHJcbiAgICAgICAgICAgIC5zY2FsZShzY2FsZSk7XHJcblxyXG4gICAgICAgIHBsb3QubGVnZW5kLmNvbnRhaW5lclxyXG4gICAgICAgICAgICAuY2FsbChsZWdlbmRMaW5lYXIpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtDaGFydCwgQ2hhcnRDb25maWd9IGZyb20gXCIuL2NoYXJ0XCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7TGVnZW5kfSBmcm9tIFwiLi9sZWdlbmRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTY2F0dGVyUGxvdENvbmZpZyBleHRlbmRzIENoYXJ0Q29uZmlne1xyXG5cclxuICAgIHN2Z0NsYXNzPSB0aGlzLmNzc0NsYXNzUHJlZml4KydzY2F0dGVycGxvdCc7XHJcbiAgICBndWlkZXM9IGZhbHNlOyAvL3Nob3cgYXhpcyBndWlkZXNcclxuICAgIHNob3dUb29sdGlwPSB0cnVlOyAvL3Nob3cgdG9vbHRpcCBvbiBkb3QgaG92ZXJcclxuICAgIHNob3dMZWdlbmQ9dHJ1ZTtcclxuICAgIGxlZ2VuZD17XHJcbiAgICAgICAgd2lkdGg6IDgwLFxyXG4gICAgICAgIG1hcmdpbjogMTAsXHJcbiAgICAgICAgc2hhcGVXaWR0aDogMjBcclxuICAgIH07XHJcblxyXG4gICAgeD17Ly8gWCBheGlzIGNvbmZpZ1xyXG4gICAgICAgIGxhYmVsOiAnWCcsIC8vIGF4aXMgbGFiZWxcclxuICAgICAgICBrZXk6IDAsXHJcbiAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IGRba2V5XSwgLy8geCB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgIG9yaWVudDogXCJib3R0b21cIixcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIlxyXG4gICAgfTtcclxuICAgIHk9ey8vIFkgYXhpcyBjb25maWdcclxuICAgICAgICBsYWJlbDogJ1knLCAvLyBheGlzIGxhYmVsLFxyXG4gICAgICAgIGtleTogMSxcclxuICAgICAgICB2YWx1ZTogKGQsIGtleSkgPT4gZFtrZXldLCAvLyB5IHZhbHVlIGFjY2Vzc29yXHJcbiAgICAgICAgb3JpZW50OiBcImxlZnRcIixcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIlxyXG4gICAgfTtcclxuICAgIGdyb3Vwcz17XHJcbiAgICAgICAga2V5OiAyLFxyXG4gICAgICAgIHZhbHVlOiAoZCwga2V5KSA9PiBkW2tleV0gLCAvLyBncm91cGluZyB2YWx1ZSBhY2Nlc3NvcixcclxuICAgICAgICBsYWJlbDogXCJcIlxyXG4gICAgfTtcclxuICAgIHRyYW5zaXRpb249IHRydWU7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHZhciBjb25maWcgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuZG90PXtcclxuICAgICAgICAgICAgcmFkaXVzOiAyLFxyXG4gICAgICAgICAgICBjb2xvcjogZCA9PiBjb25maWcuZ3JvdXBzLnZhbHVlKGQsIGNvbmZpZy5ncm91cHMua2V5KSwgLy8gc3RyaW5nIG9yIGZ1bmN0aW9uIHJldHVybmluZyBjb2xvcidzIHZhbHVlIGZvciBjb2xvciBzY2FsZVxyXG4gICAgICAgICAgICBkM0NvbG9yQ2F0ZWdvcnk6ICdjYXRlZ29yeTEwJ1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmKGN1c3RvbSl7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2NhdHRlclBsb3QgZXh0ZW5kcyBDaGFydHtcclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIG5ldyBTY2F0dGVyUGxvdENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKXtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBTY2F0dGVyUGxvdENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpe1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcbiAgICAgICAgdmFyIHNlbGY9dGhpcztcclxuXHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgdGhpcy5wbG90Lng9e307XHJcbiAgICAgICAgdGhpcy5wbG90Lnk9e307XHJcbiAgICAgICAgdGhpcy5wbG90LmRvdD17XHJcbiAgICAgICAgICAgIGNvbG9yOiBudWxsLy9jb2xvciBzY2FsZSBtYXBwaW5nIGZ1bmN0aW9uXHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMucGxvdC5zaG93TGVnZW5kID0gY29uZi5zaG93TGVnZW5kO1xyXG4gICAgICAgIGlmKHRoaXMucGxvdC5zaG93TGVnZW5kKXtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lm1hcmdpbi5yaWdodCA9IGNvbmYubWFyZ2luLnJpZ2h0ICsgY29uZi5sZWdlbmQud2lkdGgrY29uZi5sZWdlbmQubWFyZ2luKjI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICB0aGlzLmNvbXB1dGVQbG90U2l6ZSgpO1xyXG4gICAgICAgIFxyXG5cclxuXHJcbiAgICAgICAgLy8gdmFyIGxlZ2VuZFdpZHRoID0gYXZhaWxhYmxlV2lkdGg7XHJcbiAgICAgICAgLy8gbGVnZW5kLndpZHRoKGxlZ2VuZFdpZHRoKTtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIHdyYXAuc2VsZWN0KCcubnYtbGVnZW5kV3JhcCcpXHJcbiAgICAgICAgLy8gICAgIC5kYXR1bShkYXRhKVxyXG4gICAgICAgIC8vICAgICAuY2FsbChsZWdlbmQpO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gaWYgKGxlZ2VuZC5oZWlnaHQoKSA+IG1hcmdpbi50b3ApIHtcclxuICAgICAgICAvLyAgICAgbWFyZ2luLnRvcCA9IGxlZ2VuZC5oZWlnaHQoKTtcclxuICAgICAgICAvLyAgICAgYXZhaWxhYmxlSGVpZ2h0ID0gbnYudXRpbHMuYXZhaWxhYmxlSGVpZ2h0KGhlaWdodCwgY29udGFpbmVyLCBtYXJnaW4pO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cFgoKTtcclxuICAgICAgICB0aGlzLnNldHVwWSgpO1xyXG5cclxuICAgICAgICBpZihjb25mLmRvdC5kM0NvbG9yQ2F0ZWdvcnkpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yQ2F0ZWdvcnkgPSBkMy5zY2FsZVtjb25mLmRvdC5kM0NvbG9yQ2F0ZWdvcnldKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjb2xvclZhbHVlID0gY29uZi5kb3QuY29sb3I7XHJcbiAgICAgICAgaWYoY29sb3JWYWx1ZSl7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5kb3QuY29sb3JWYWx1ZSA9IGNvbG9yVmFsdWU7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbG9yVmFsdWUgPT09ICdzdHJpbmcnIHx8IGNvbG9yVmFsdWUgaW5zdGFuY2VvZiBTdHJpbmcpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmRvdC5jb2xvciA9IGNvbG9yVmFsdWU7XHJcbiAgICAgICAgICAgIH1lbHNlIGlmKHRoaXMucGxvdC5kb3QuY29sb3JDYXRlZ29yeSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yID0gZCA9PiAgc2VsZi5wbG90LmRvdC5jb2xvckNhdGVnb3J5KHNlbGYucGxvdC5kb3QuY29sb3JWYWx1ZShkKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIH1lbHNle1xyXG5cclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXBYKCl7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB4ID0gcGxvdC54O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWcueDtcclxuXHJcbiAgICAgICAgLyogKlxyXG4gICAgICAgICAqIHZhbHVlIGFjY2Vzc29yIC0gcmV0dXJucyB0aGUgdmFsdWUgdG8gZW5jb2RlIGZvciBhIGdpdmVuIGRhdGEgb2JqZWN0LlxyXG4gICAgICAgICAqIHNjYWxlIC0gbWFwcyB2YWx1ZSB0byBhIHZpc3VhbCBkaXNwbGF5IGVuY29kaW5nLCBzdWNoIGFzIGEgcGl4ZWwgcG9zaXRpb24uXHJcbiAgICAgICAgICogbWFwIGZ1bmN0aW9uIC0gbWFwcyBmcm9tIGRhdGEgdmFsdWUgdG8gZGlzcGxheSB2YWx1ZVxyXG4gICAgICAgICAqIGF4aXMgLSBzZXRzIHVwIGF4aXNcclxuICAgICAgICAgKiovXHJcbiAgICAgICAgeC52YWx1ZSA9IGQgPT4gY29uZi52YWx1ZShkLCBjb25mLmtleSk7XHJcbiAgICAgICAgeC5zY2FsZSA9IGQzLnNjYWxlW2NvbmYuc2NhbGVdKCkucmFuZ2UoWzAsIHBsb3Qud2lkdGhdKTtcclxuICAgICAgICB4Lm1hcCA9IGQgPT4geC5zY2FsZSh4LnZhbHVlKGQpKTtcclxuICAgICAgICB4LmF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHguc2NhbGUpLm9yaWVudChjb25mLm9yaWVudCk7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgcGxvdC54LnNjYWxlLmRvbWFpbihbZDMubWluKGRhdGEsIHBsb3QueC52YWx1ZSktMSwgZDMubWF4KGRhdGEsIHBsb3QueC52YWx1ZSkrMV0pO1xyXG4gICAgICAgIGlmKHRoaXMuY29uZmlnLmd1aWRlcykge1xyXG4gICAgICAgICAgICB4LmF4aXMudGlja1NpemUoLXBsb3QuaGVpZ2h0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cFkgKCl7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB5ID0gcGxvdC55O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWcueTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB2YWx1ZSBhY2Nlc3NvciAtIHJldHVybnMgdGhlIHZhbHVlIHRvIGVuY29kZSBmb3IgYSBnaXZlbiBkYXRhIG9iamVjdC5cclxuICAgICAgICAgKiBzY2FsZSAtIG1hcHMgdmFsdWUgdG8gYSB2aXN1YWwgZGlzcGxheSBlbmNvZGluZywgc3VjaCBhcyBhIHBpeGVsIHBvc2l0aW9uLlxyXG4gICAgICAgICAqIG1hcCBmdW5jdGlvbiAtIG1hcHMgZnJvbSBkYXRhIHZhbHVlIHRvIGRpc3BsYXkgdmFsdWVcclxuICAgICAgICAgKiBheGlzIC0gc2V0cyB1cCBheGlzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgeS52YWx1ZSA9IGQgPT4gY29uZi52YWx1ZShkLCBjb25mLmtleSk7XHJcbiAgICAgICAgeS5zY2FsZSA9IGQzLnNjYWxlW2NvbmYuc2NhbGVdKCkucmFuZ2UoW3Bsb3QuaGVpZ2h0LCAwXSk7XHJcbiAgICAgICAgeS5tYXAgPSBkID0+IHkuc2NhbGUoeS52YWx1ZShkKSk7XHJcbiAgICAgICAgeS5heGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh5LnNjYWxlKS5vcmllbnQoY29uZi5vcmllbnQpO1xyXG5cclxuICAgICAgICBpZih0aGlzLmNvbmZpZy5ndWlkZXMpe1xyXG4gICAgICAgICAgICB5LmF4aXMudGlja1NpemUoLXBsb3Qud2lkdGgpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIHBsb3QueS5zY2FsZS5kb21haW4oW2QzLm1pbihkYXRhLCBwbG90LnkudmFsdWUpLTEsIGQzLm1heChkYXRhLCBwbG90LnkudmFsdWUpKzFdKTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhdygpe1xyXG4gICAgICAgIHRoaXMuZHJhd0F4aXNYKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3QXhpc1koKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBkcmF3QXhpc1goKXtcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBheGlzQ29uZiA9IHRoaXMuY29uZmlnLng7XHJcbiAgICAgICAgc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIitzZWxmLnByZWZpeENsYXNzKCdheGlzLXgnKStcIi5cIitzZWxmLnByZWZpeENsYXNzKCdheGlzJykrKHNlbGYuY29uZmlnLmd1aWRlcyA/ICcnIDogJy4nK3NlbGYucHJlZml4Q2xhc3MoJ25vLWd1aWRlcycpKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIHBsb3QuaGVpZ2h0ICsgXCIpXCIpXHJcbiAgICAgICAgICAgIC5jYWxsKHBsb3QueC5heGlzKVxyXG4gICAgICAgICAgICAuc2VsZWN0T3JBcHBlbmQoXCJ0ZXh0LlwiK3NlbGYucHJlZml4Q2xhc3MoJ2xhYmVsJykpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyAocGxvdC53aWR0aC8yKSArXCIsXCIrIChwbG90Lm1hcmdpbi5ib3R0b20pICtcIilcIikgIC8vIHRleHQgaXMgZHJhd24gb2ZmIHRoZSBzY3JlZW4gdG9wIGxlZnQsIG1vdmUgZG93biBhbmQgb3V0IGFuZCByb3RhdGVcclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCBcIi0xZW1cIilcclxuICAgICAgICAgICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoYXhpc0NvbmYubGFiZWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICBkcmF3QXhpc1koKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGF4aXNDb25mID0gdGhpcy5jb25maWcueTtcclxuICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMteScpK1wiLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMnKSsoc2VsZi5jb25maWcuZ3VpZGVzID8gJycgOiAnLicrc2VsZi5wcmVmaXhDbGFzcygnbm8tZ3VpZGVzJykpKVxyXG4gICAgICAgICAgICAuY2FsbChwbG90LnkuYXhpcylcclxuICAgICAgICAgICAgLnNlbGVjdE9yQXBwZW5kKFwidGV4dC5cIitzZWxmLnByZWZpeENsYXNzKCdsYWJlbCcpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisgLXBsb3QubWFyZ2luLmxlZnQgK1wiLFwiKyhwbG90LmhlaWdodC8yKStcIilyb3RhdGUoLTkwKVwiKSAgLy8gdGV4dCBpcyBkcmF3biBvZmYgdGhlIHNjcmVlbiB0b3AgbGVmdCwgbW92ZSBkb3duIGFuZCBvdXQgYW5kIHJvdGF0ZVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGF4aXNDb25mLmxhYmVsKTtcclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlKG5ld0RhdGEpe1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVEb3RzKCk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlTGVnZW5kKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHVwZGF0ZURvdHMoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIHZhciBkb3RDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoJ2RvdCcpO1xyXG4gICAgICAgIHNlbGYuZG90c0NvbnRhaW5lckNsYXNzID0gc2VsZi5wcmVmaXhDbGFzcygnZG90cy1jb250YWluZXInKTtcclxuXHJcblxyXG4gICAgICAgIHZhciBkb3RzQ29udGFpbmVyID0gc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIiArIHNlbGYuZG90c0NvbnRhaW5lckNsYXNzKTtcclxuXHJcbiAgICAgICAgdmFyIGRvdHMgPSBkb3RzQ29udGFpbmVyLnNlbGVjdEFsbCgnLicgKyBkb3RDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEoZGF0YSk7XHJcblxyXG4gICAgICAgIGRvdHMuZW50ZXIoKS5hcHBlbmQoXCJjaXJjbGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBkb3RDbGFzcyk7XHJcblxyXG4gICAgICAgIHZhciBkb3RzVCA9IGRvdHM7XHJcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLnRyYW5zaXRpb24pIHtcclxuICAgICAgICAgICAgZG90c1QgPSBkb3RzLnRyYW5zaXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRvdHNULmF0dHIoXCJyXCIsIHNlbGYuY29uZmlnLmRvdC5yYWRpdXMpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY3hcIiwgcGxvdC54Lm1hcClcclxuICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCBwbG90LnkubWFwKTtcclxuXHJcbiAgICAgICAgaWYgKHBsb3QudG9vbHRpcCkge1xyXG4gICAgICAgICAgICBkb3RzLm9uKFwibW91c2VvdmVyXCIsIGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAuOSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IFwiKFwiICsgcGxvdC54LnZhbHVlKGQpICsgXCIsIFwiICsgcGxvdC55LnZhbHVlKGQpICsgXCIpXCI7XHJcbiAgICAgICAgICAgICAgICB2YXIgZ3JvdXAgPSBzZWxmLmNvbmZpZy5ncm91cHMudmFsdWUoZCwgc2VsZi5jb25maWcuZ3JvdXBzLmtleSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXAgfHwgZ3JvdXAgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBodG1sICs9IFwiPGJyLz5cIjtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSBzZWxmLmNvbmZpZy5ncm91cHMubGFiZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhYmVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gbGFiZWwgKyBcIjogXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gZ3JvdXBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC5odG1sKGh0bWwpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZDMuZXZlbnQucGFnZVggKyA1KSArIFwicHhcIilcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBsb3QuZG90LmNvbG9yKSB7XHJcbiAgICAgICAgICAgIGRvdHMuc3R5bGUoXCJmaWxsXCIsIHBsb3QuZG90LmNvbG9yKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG90cy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTGVnZW5kKCkge1xyXG5cclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcblxyXG4gICAgICAgIHZhciBzY2FsZSA9IHBsb3QuZG90LmNvbG9yQ2F0ZWdvcnk7XHJcbiAgICAgICAgaWYoIXNjYWxlLmRvbWFpbigpIHx8IHNjYWxlLmRvbWFpbigpLmxlbmd0aDwyKXtcclxuICAgICAgICAgICAgcGxvdC5zaG93TGVnZW5kID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZighcGxvdC5zaG93TGVnZW5kKXtcclxuICAgICAgICAgICAgaWYocGxvdC5sZWdlbmQgJiYgcGxvdC5sZWdlbmQuY29udGFpbmVyKXtcclxuICAgICAgICAgICAgICAgIHBsb3QubGVnZW5kLmNvbnRhaW5lci5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdmFyIGxlZ2VuZFggPSB0aGlzLnBsb3Qud2lkdGggKyB0aGlzLmNvbmZpZy5sZWdlbmQubWFyZ2luO1xyXG4gICAgICAgIHZhciBsZWdlbmRZID0gdGhpcy5jb25maWcubGVnZW5kLm1hcmdpbjtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmQgPSBuZXcgTGVnZW5kKHRoaXMuc3ZnLCB0aGlzLnN2Z0csIHNjYWxlLCBsZWdlbmRYLCBsZWdlbmRZKTtcclxuXHJcbiAgICAgICAgdmFyIGxlZ2VuZExpbmVhciA9IHBsb3QubGVnZW5kLmNvbG9yKClcclxuICAgICAgICAgICAgLnNoYXBlV2lkdGgodGhpcy5jb25maWcubGVnZW5kLnNoYXBlV2lkdGgpXHJcbiAgICAgICAgICAgIC5vcmllbnQoJ3ZlcnRpY2FsJylcclxuICAgICAgICAgICAgLnNjYWxlKHNjYWxlKTtcclxuICAgICAgICBcclxuICAgICAgICBwbG90LmxlZ2VuZC5jb250YWluZXJcclxuICAgICAgICAgICAgLmNhbGwobGVnZW5kTGluZWFyKTtcclxuICAgIH1cclxuXHJcbiAgICBcclxufVxyXG4iLCIvKlxuICogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vYmVucmFzbXVzZW4vMTI2MTk3N1xuICogTkFNRVxuICogXG4gKiBzdGF0aXN0aWNzLWRpc3RyaWJ1dGlvbnMuanMgLSBKYXZhU2NyaXB0IGxpYnJhcnkgZm9yIGNhbGN1bGF0aW5nXG4gKiAgIGNyaXRpY2FsIHZhbHVlcyBhbmQgdXBwZXIgcHJvYmFiaWxpdGllcyBvZiBjb21tb24gc3RhdGlzdGljYWxcbiAqICAgZGlzdHJpYnV0aW9uc1xuICogXG4gKiBTWU5PUFNJU1xuICogXG4gKiBcbiAqICAgLy8gQ2hpLXNxdWFyZWQtY3JpdCAoMiBkZWdyZWVzIG9mIGZyZWVkb20sIDk1dGggcGVyY2VudGlsZSA9IDAuMDUgbGV2ZWxcbiAqICAgY2hpc3FyZGlzdHIoMiwgLjA1KVxuICogICBcbiAqICAgLy8gdS1jcml0ICg5NXRoIHBlcmNlbnRpbGUgPSAwLjA1IGxldmVsKVxuICogICB1ZGlzdHIoLjA1KTtcbiAqICAgXG4gKiAgIC8vIHQtY3JpdCAoMSBkZWdyZWUgb2YgZnJlZWRvbSwgOTkuNXRoIHBlcmNlbnRpbGUgPSAwLjAwNSBsZXZlbCkgXG4gKiAgIHRkaXN0cigxLC4wMDUpO1xuICogICBcbiAqICAgLy8gRi1jcml0ICgxIGRlZ3JlZSBvZiBmcmVlZG9tIGluIG51bWVyYXRvciwgMyBkZWdyZWVzIG9mIGZyZWVkb20gXG4gKiAgIC8vICAgICAgICAgaW4gZGVub21pbmF0b3IsIDk5dGggcGVyY2VudGlsZSA9IDAuMDEgbGV2ZWwpXG4gKiAgIGZkaXN0cigxLDMsLjAxKTtcbiAqICAgXG4gKiAgIC8vIHVwcGVyIHByb2JhYmlsaXR5IG9mIHRoZSB1IGRpc3RyaWJ1dGlvbiAodSA9IC0wLjg1KTogUSh1KSA9IDEtRyh1KVxuICogICB1cHJvYigtMC44NSk7XG4gKiAgIFxuICogICAvLyB1cHBlciBwcm9iYWJpbGl0eSBvZiB0aGUgY2hpLXNxdWFyZSBkaXN0cmlidXRpb25cbiAqICAgLy8gKDMgZGVncmVlcyBvZiBmcmVlZG9tLCBjaGktc3F1YXJlZCA9IDYuMjUpOiBRID0gMS1HXG4gKiAgIGNoaXNxcnByb2IoMyw2LjI1KTtcbiAqICAgXG4gKiAgIC8vIHVwcGVyIHByb2JhYmlsaXR5IG9mIHRoZSB0IGRpc3RyaWJ1dGlvblxuICogICAvLyAoMyBkZWdyZWVzIG9mIGZyZWVkb20sIHQgPSA2LjI1MSk6IFEgPSAxLUdcbiAqICAgdHByb2IoMyw2LjI1MSk7XG4gKiAgIFxuICogICAvLyB1cHBlciBwcm9iYWJpbGl0eSBvZiB0aGUgRiBkaXN0cmlidXRpb25cbiAqICAgLy8gKDMgZGVncmVlcyBvZiBmcmVlZG9tIGluIG51bWVyYXRvciwgNSBkZWdyZWVzIG9mIGZyZWVkb20gaW5cbiAqICAgLy8gIGRlbm9taW5hdG9yLCBGID0gNi4yNSk6IFEgPSAxLUdcbiAqICAgZnByb2IoMyw1LC42MjUpO1xuICogXG4gKiBcbiAqICBERVNDUklQVElPTlxuICogXG4gKiBUaGlzIGxpYnJhcnkgY2FsY3VsYXRlcyBwZXJjZW50YWdlIHBvaW50cyAoNSBzaWduaWZpY2FudCBkaWdpdHMpIG9mIHRoZSB1XG4gKiAoc3RhbmRhcmQgbm9ybWFsKSBkaXN0cmlidXRpb24sIHRoZSBzdHVkZW50J3MgdCBkaXN0cmlidXRpb24sIHRoZVxuICogY2hpLXNxdWFyZSBkaXN0cmlidXRpb24gYW5kIHRoZSBGIGRpc3RyaWJ1dGlvbi4gSXQgY2FuIGFsc28gY2FsY3VsYXRlIHRoZVxuICogdXBwZXIgcHJvYmFiaWxpdHkgKDUgc2lnbmlmaWNhbnQgZGlnaXRzKSBvZiB0aGUgdSAoc3RhbmRhcmQgbm9ybWFsKSwgdGhlXG4gKiBjaGktc3F1YXJlLCB0aGUgdCBhbmQgdGhlIEYgZGlzdHJpYnV0aW9uLlxuICogXG4gKiBUaGVzZSBjcml0aWNhbCB2YWx1ZXMgYXJlIG5lZWRlZCB0byBwZXJmb3JtIHN0YXRpc3RpY2FsIHRlc3RzLCBsaWtlIHRoZSB1XG4gKiB0ZXN0LCB0aGUgdCB0ZXN0LCB0aGUgRiB0ZXN0IGFuZCB0aGUgY2hpLXNxdWFyZWQgdGVzdCwgYW5kIHRvIGNhbGN1bGF0ZVxuICogY29uZmlkZW5jZSBpbnRlcnZhbHMuXG4gKiBcbiAqIElmIHlvdSBhcmUgaW50ZXJlc3RlZCBpbiBtb3JlIHByZWNpc2UgYWxnb3JpdGhtcyB5b3UgY291bGQgbG9vayBhdDpcbiAqICAgU3RhdExpYjogaHR0cDovL2xpYi5zdGF0LmNtdS5lZHUvYXBzdGF0LyA7IFxuICogICBBcHBsaWVkIFN0YXRpc3RpY3MgQWxnb3JpdGhtcyBieSBHcmlmZml0aHMsIFAuIGFuZCBIaWxsLCBJLkQuXG4gKiAgICwgRWxsaXMgSG9yd29vZDogQ2hpY2hlc3RlciAoMTk4NSlcbiAqIFxuICogQlVHUyBcbiAqIFxuICogVGhpcyBwb3J0IHdhcyBwcm9kdWNlZCBmcm9tIHRoZSBQZXJsIG1vZHVsZSBTdGF0aXN0aWNzOjpEaXN0cmlidXRpb25zXG4gKiB0aGF0IGhhcyBoYWQgbm8gYnVnIHJlcG9ydHMgaW4gc2V2ZXJhbCB5ZWFycy4gIElmIHlvdSBmaW5kIGEgYnVnIHRoZW5cbiAqIHBsZWFzZSBkb3VibGUtY2hlY2sgdGhhdCBKYXZhU2NyaXB0IGRvZXMgbm90IHRoaW5nIHRoZSBudW1iZXJzIHlvdSBhcmVcbiAqIHBhc3NpbmcgaW4gYXJlIHN0cmluZ3MuICAoWW91IGNhbiBzdWJ0cmFjdCAwIGZyb20gdGhlbSBhcyB5b3UgcGFzcyB0aGVtXG4gKiBpbiBzbyB0aGF0IFwiNVwiIGlzIHByb3Blcmx5IHVuZGVyc3Rvb2QgdG8gYmUgNS4pICBJZiB5b3UgaGF2ZSBwYXNzZWQgaW4gYVxuICogbnVtYmVyIHRoZW4gcGxlYXNlIGNvbnRhY3QgdGhlIGF1dGhvclxuICogXG4gKiBBVVRIT1JcbiAqIFxuICogQmVuIFRpbGx5IDxidGlsbHlAZ21haWwuY29tPlxuICogXG4gKiBPcmlnaW5sIFBlcmwgdmVyc2lvbiBieSBNaWNoYWVsIEtvc3BhY2ggPG1pa2UucGVybEBnbXguYXQ+XG4gKiBcbiAqIE5pY2UgZm9ybWF0aW5nLCBzaW1wbGlmaWNhdGlvbiBhbmQgYnVnIHJlcGFpciBieSBNYXR0aGlhcyBUcmF1dG5lciBLcm9tYW5uXG4gKiA8bXRrQGlkLmNicy5kaz5cbiAqIFxuICogQ09QWVJJR0hUIFxuICogXG4gKiBDb3B5cmlnaHQgMjAwOCBCZW4gVGlsbHkuXG4gKiBcbiAqIFRoaXMgbGlicmFyeSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0XG4gKiB1bmRlciB0aGUgc2FtZSB0ZXJtcyBhcyBQZXJsIGl0c2VsZi4gIFRoaXMgbWVhbnMgdW5kZXIgZWl0aGVyIHRoZSBQZXJsXG4gKiBBcnRpc3RpYyBMaWNlbnNlIG9yIHRoZSBHUEwgdjEgb3IgbGF0ZXIuXG4gKi9cblxudmFyIFNJR05JRklDQU5UID0gNTsgLy8gbnVtYmVyIG9mIHNpZ25pZmljYW50IGRpZ2l0cyB0byBiZSByZXR1cm5lZFxuXG5mdW5jdGlvbiBjaGlzcXJkaXN0ciAoJG4sICRwKSB7XG5cdGlmICgkbiA8PSAwIHx8IE1hdGguYWJzKCRuKSAtIE1hdGguYWJzKGludGVnZXIoJG4pKSAhPSAwKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG46ICRuXFxuXCIpOyAvKiBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9XG5cdGlmICgkcCA8PSAwIHx8ICRwID4gMSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBwOiAkcFxcblwiKTsgXG5cdH1cblx0cmV0dXJuIHByZWNpc2lvbl9zdHJpbmcoX3N1YmNoaXNxcigkbi0wLCAkcC0wKSk7XG59XG5cbmZ1bmN0aW9uIHVkaXN0ciAoJHApIHtcblx0aWYgKCRwID4gMSB8fCAkcCA8PSAwKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIHA6ICRwXFxuXCIpO1xuXHR9XG5cdHJldHVybiBwcmVjaXNpb25fc3RyaW5nKF9zdWJ1KCRwLTApKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRkaXN0ciAoJG4sICRwKSB7XG5cdGlmICgkbiA8PSAwIHx8IE1hdGguYWJzKCRuKSAtIE1hdGguYWJzKGludGVnZXIoJG4pKSAhPSAwKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG46ICRuXFxuXCIpO1xuXHR9XG5cdGlmICgkcCA8PSAwIHx8ICRwID49IDEpIHtcblx0XHR0aHJvdyhcIkludmFsaWQgcDogJHBcXG5cIik7XG5cdH1cblx0cmV0dXJuIHByZWNpc2lvbl9zdHJpbmcoX3N1YnQoJG4tMCwgJHAtMCkpO1xufVxuXG5mdW5jdGlvbiBmZGlzdHIgKCRuLCAkbSwgJHApIHtcblx0aWYgKCgkbjw9MCkgfHwgKChNYXRoLmFicygkbiktKE1hdGguYWJzKGludGVnZXIoJG4pKSkpIT0wKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBuOiAkblxcblwiKTsgLyogZmlyc3QgZGVncmVlIG9mIGZyZWVkb20gKi9cblx0fVxuXHRpZiAoKCRtPD0wKSB8fCAoKE1hdGguYWJzKCRtKS0oTWF0aC5hYnMoaW50ZWdlcigkbSkpKSkhPTApKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG06ICRtXFxuXCIpOyAvKiBzZWNvbmQgZGVncmVlIG9mIGZyZWVkb20gKi9cblx0fVxuXHRpZiAoKCRwPD0wKSB8fCAoJHA+MSkpIHtcblx0XHR0aHJvdyhcIkludmFsaWQgcDogJHBcXG5cIik7XG5cdH1cblx0cmV0dXJuIHByZWNpc2lvbl9zdHJpbmcoX3N1YmYoJG4tMCwgJG0tMCwgJHAtMCkpO1xufVxuXG5mdW5jdGlvbiB1cHJvYiAoJHgpIHtcblx0cmV0dXJuIHByZWNpc2lvbl9zdHJpbmcoX3N1YnVwcm9iKCR4LTApKTtcbn1cblxuZnVuY3Rpb24gY2hpc3FycHJvYiAoJG4sJHgpIHtcblx0aWYgKCgkbiA8PSAwKSB8fCAoKE1hdGguYWJzKCRuKSAtIChNYXRoLmFicyhpbnRlZ2VyKCRuKSkpKSAhPSAwKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBuOiAkblxcblwiKTsgLyogZGVncmVlIG9mIGZyZWVkb20gKi9cblx0fVxuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3ViY2hpc3FycHJvYigkbi0wLCAkeC0wKSk7XG59XG5cbmZ1bmN0aW9uIHRwcm9iICgkbiwgJHgpIHtcblx0aWYgKCgkbiA8PSAwKSB8fCAoKE1hdGguYWJzKCRuKSAtIE1hdGguYWJzKGludGVnZXIoJG4pKSkgIT0wKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBuOiAkblxcblwiKTsgLyogZGVncmVlIG9mIGZyZWVkb20gKi9cblx0fVxuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3VidHByb2IoJG4tMCwgJHgtMCkpO1xufVxuXG5mdW5jdGlvbiBmcHJvYiAoJG4sICRtLCAkeCkge1xuXHRpZiAoKCRuPD0wKSB8fCAoKE1hdGguYWJzKCRuKS0oTWF0aC5hYnMoaW50ZWdlcigkbikpKSkhPTApKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG46ICRuXFxuXCIpOyAvKiBmaXJzdCBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9XG5cdGlmICgoJG08PTApIHx8ICgoTWF0aC5hYnMoJG0pLShNYXRoLmFicyhpbnRlZ2VyKCRtKSkpKSE9MCkpIHtcblx0XHR0aHJvdyhcIkludmFsaWQgbTogJG1cXG5cIik7IC8qIHNlY29uZCBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9IFxuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3ViZnByb2IoJG4tMCwgJG0tMCwgJHgtMCkpO1xufVxuXG5cbmZ1bmN0aW9uIF9zdWJmcHJvYiAoJG4sICRtLCAkeCkge1xuXHR2YXIgJHA7XG5cblx0aWYgKCR4PD0wKSB7XG5cdFx0JHA9MTtcblx0fSBlbHNlIGlmICgkbSAlIDIgPT0gMCkge1xuXHRcdHZhciAkeiA9ICRtIC8gKCRtICsgJG4gKiAkeCk7XG5cdFx0dmFyICRhID0gMTtcblx0XHRmb3IgKHZhciAkaSA9ICRtIC0gMjsgJGkgPj0gMjsgJGkgLT0gMikge1xuXHRcdFx0JGEgPSAxICsgKCRuICsgJGkgLSAyKSAvICRpICogJHogKiAkYTtcblx0XHR9XG5cdFx0JHAgPSAxIC0gTWF0aC5wb3coKDEgLSAkeiksICgkbiAvIDIpICogJGEpO1xuXHR9IGVsc2UgaWYgKCRuICUgMiA9PSAwKSB7XG5cdFx0dmFyICR6ID0gJG4gKiAkeCAvICgkbSArICRuICogJHgpO1xuXHRcdHZhciAkYSA9IDE7XG5cdFx0Zm9yICh2YXIgJGkgPSAkbiAtIDI7ICRpID49IDI7ICRpIC09IDIpIHtcblx0XHRcdCRhID0gMSArICgkbSArICRpIC0gMikgLyAkaSAqICR6ICogJGE7XG5cdFx0fVxuXHRcdCRwID0gTWF0aC5wb3coKDEgLSAkeiksICgkbSAvIDIpKSAqICRhO1xuXHR9IGVsc2Uge1xuXHRcdHZhciAkeSA9IE1hdGguYXRhbjIoTWF0aC5zcXJ0KCRuICogJHggLyAkbSksIDEpO1xuXHRcdHZhciAkeiA9IE1hdGgucG93KE1hdGguc2luKCR5KSwgMik7XG5cdFx0dmFyICRhID0gKCRuID09IDEpID8gMCA6IDE7XG5cdFx0Zm9yICh2YXIgJGkgPSAkbiAtIDI7ICRpID49IDM7ICRpIC09IDIpIHtcblx0XHRcdCRhID0gMSArICgkbSArICRpIC0gMikgLyAkaSAqICR6ICogJGE7XG5cdFx0fSBcblx0XHR2YXIgJGIgPSBNYXRoLlBJO1xuXHRcdGZvciAodmFyICRpID0gMjsgJGkgPD0gJG0gLSAxOyAkaSArPSAyKSB7XG5cdFx0XHQkYiAqPSAoJGkgLSAxKSAvICRpO1xuXHRcdH1cblx0XHR2YXIgJHAxID0gMiAvICRiICogTWF0aC5zaW4oJHkpICogTWF0aC5wb3coTWF0aC5jb3MoJHkpLCAkbSkgKiAkYTtcblxuXHRcdCR6ID0gTWF0aC5wb3coTWF0aC5jb3MoJHkpLCAyKTtcblx0XHQkYSA9ICgkbSA9PSAxKSA/IDAgOiAxO1xuXHRcdGZvciAodmFyICRpID0gJG0tMjsgJGkgPj0gMzsgJGkgLT0gMikge1xuXHRcdFx0JGEgPSAxICsgKCRpIC0gMSkgLyAkaSAqICR6ICogJGE7XG5cdFx0fVxuXHRcdCRwID0gbWF4KDAsICRwMSArIDEgLSAyICogJHkgLyBNYXRoLlBJXG5cdFx0XHQtIDIgLyBNYXRoLlBJICogTWF0aC5zaW4oJHkpICogTWF0aC5jb3MoJHkpICogJGEpO1xuXHR9XG5cdHJldHVybiAkcDtcbn1cblxuXG5mdW5jdGlvbiBfc3ViY2hpc3FycHJvYiAoJG4sJHgpIHtcblx0dmFyICRwO1xuXG5cdGlmICgkeCA8PSAwKSB7XG5cdFx0JHAgPSAxO1xuXHR9IGVsc2UgaWYgKCRuID4gMTAwKSB7XG5cdFx0JHAgPSBfc3VidXByb2IoKE1hdGgucG93KCgkeCAvICRuKSwgMS8zKVxuXHRcdFx0XHQtICgxIC0gMi85LyRuKSkgLyBNYXRoLnNxcnQoMi85LyRuKSk7XG5cdH0gZWxzZSBpZiAoJHggPiA0MDApIHtcblx0XHQkcCA9IDA7XG5cdH0gZWxzZSB7ICAgXG5cdFx0dmFyICRhO1xuICAgICAgICAgICAgICAgIHZhciAkaTtcbiAgICAgICAgICAgICAgICB2YXIgJGkxO1xuXHRcdGlmICgoJG4gJSAyKSAhPSAwKSB7XG5cdFx0XHQkcCA9IDIgKiBfc3VidXByb2IoTWF0aC5zcXJ0KCR4KSk7XG5cdFx0XHQkYSA9IE1hdGguc3FydCgyL01hdGguUEkpICogTWF0aC5leHAoLSR4LzIpIC8gTWF0aC5zcXJ0KCR4KTtcblx0XHRcdCRpMSA9IDE7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRwID0gJGEgPSBNYXRoLmV4cCgtJHgvMik7XG5cdFx0XHQkaTEgPSAyO1xuXHRcdH1cblxuXHRcdGZvciAoJGkgPSAkaTE7ICRpIDw9ICgkbi0yKTsgJGkgKz0gMikge1xuXHRcdFx0JGEgKj0gJHggLyAkaTtcblx0XHRcdCRwICs9ICRhO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gJHA7XG59XG5cbmZ1bmN0aW9uIF9zdWJ1ICgkcCkge1xuXHR2YXIgJHkgPSAtTWF0aC5sb2coNCAqICRwICogKDEgLSAkcCkpO1xuXHR2YXIgJHggPSBNYXRoLnNxcnQoXG5cdFx0JHkgKiAoMS41NzA3OTYyODhcblx0XHQgICsgJHkgKiAoLjAzNzA2OTg3OTA2XG5cdFx0ICBcdCsgJHkgKiAoLS44MzY0MzUzNTg5RS0zXG5cdFx0XHQgICsgJHkgKigtLjIyNTA5NDcxNzZFLTNcblx0XHRcdCAgXHQrICR5ICogKC42ODQxMjE4Mjk5RS01XG5cdFx0XHRcdCAgKyAkeSAqICgwLjU4MjQyMzg1MTVFLTVcblx0XHRcdFx0XHQrICR5ICogKC0uMTA0NTI3NDk3RS01XG5cdFx0XHRcdFx0ICArICR5ICogKC44MzYwOTM3MDE3RS03XG5cdFx0XHRcdFx0XHQrICR5ICogKC0uMzIzMTA4MTI3N0UtOFxuXHRcdFx0XHRcdFx0ICArICR5ICogKC4zNjU3NzYzMDM2RS0xMFxuXHRcdFx0XHRcdFx0XHQrICR5ICouNjkzNjIzMzk4MkUtMTIpKSkpKSkpKSkpKTtcblx0aWYgKCRwPi41KVxuICAgICAgICAgICAgICAgICR4ID0gLSR4O1xuXHRyZXR1cm4gJHg7XG59XG5cbmZ1bmN0aW9uIF9zdWJ1cHJvYiAoJHgpIHtcblx0dmFyICRwID0gMDsgLyogaWYgKCRhYnN4ID4gMTAwKSAqL1xuXHR2YXIgJGFic3ggPSBNYXRoLmFicygkeCk7XG5cblx0aWYgKCRhYnN4IDwgMS45KSB7XG5cdFx0JHAgPSBNYXRoLnBvdygoMSArXG5cdFx0XHQkYWJzeCAqICguMDQ5ODY3MzQ3XG5cdFx0XHQgICsgJGFic3ggKiAoLjAyMTE0MTAwNjFcblx0XHRcdCAgXHQrICRhYnN4ICogKC4wMDMyNzc2MjYzXG5cdFx0XHRcdCAgKyAkYWJzeCAqICguMDAwMDM4MDAzNlxuXHRcdFx0XHRcdCsgJGFic3ggKiAoLjAwMDA0ODg5MDZcblx0XHRcdFx0XHQgICsgJGFic3ggKiAuMDAwMDA1MzgzKSkpKSkpLCAtMTYpLzI7XG5cdH0gZWxzZSBpZiAoJGFic3ggPD0gMTAwKSB7XG5cdFx0Zm9yICh2YXIgJGkgPSAxODsgJGkgPj0gMTsgJGktLSkge1xuXHRcdFx0JHAgPSAkaSAvICgkYWJzeCArICRwKTtcblx0XHR9XG5cdFx0JHAgPSBNYXRoLmV4cCgtLjUgKiAkYWJzeCAqICRhYnN4KSBcblx0XHRcdC8gTWF0aC5zcXJ0KDIgKiBNYXRoLlBJKSAvICgkYWJzeCArICRwKTtcblx0fVxuXG5cdGlmICgkeDwwKVxuICAgICAgICBcdCRwID0gMSAtICRwO1xuXHRyZXR1cm4gJHA7XG59XG5cbiAgIFxuZnVuY3Rpb24gX3N1YnQgKCRuLCAkcCkge1xuXG5cdGlmICgkcCA+PSAxIHx8ICRwIDw9IDApIHtcblx0XHR0aHJvdyhcIkludmFsaWQgcDogJHBcXG5cIik7XG5cdH1cblxuXHRpZiAoJHAgPT0gMC41KSB7XG5cdFx0cmV0dXJuIDA7XG5cdH0gZWxzZSBpZiAoJHAgPCAwLjUpIHtcblx0XHRyZXR1cm4gLSBfc3VidCgkbiwgMSAtICRwKTtcblx0fVxuXG5cdHZhciAkdSA9IF9zdWJ1KCRwKTtcblx0dmFyICR1MiA9IE1hdGgucG93KCR1LCAyKTtcblxuXHR2YXIgJGEgPSAoJHUyICsgMSkgLyA0O1xuXHR2YXIgJGIgPSAoKDUgKiAkdTIgKyAxNikgKiAkdTIgKyAzKSAvIDk2O1xuXHR2YXIgJGMgPSAoKCgzICogJHUyICsgMTkpICogJHUyICsgMTcpICogJHUyIC0gMTUpIC8gMzg0O1xuXHR2YXIgJGQgPSAoKCgoNzkgKiAkdTIgKyA3NzYpICogJHUyICsgMTQ4MikgKiAkdTIgLSAxOTIwKSAqICR1MiAtIDk0NSkgXG5cdFx0XHRcdC8gOTIxNjA7XG5cdHZhciAkZSA9ICgoKCgoMjcgKiAkdTIgKyAzMzkpICogJHUyICsgOTMwKSAqICR1MiAtIDE3ODIpICogJHUyIC0gNzY1KSAqICR1MlxuXHRcdFx0KyAxNzk1NSkgLyAzNjg2NDA7XG5cblx0dmFyICR4ID0gJHUgKiAoMSArICgkYSArICgkYiArICgkYyArICgkZCArICRlIC8gJG4pIC8gJG4pIC8gJG4pIC8gJG4pIC8gJG4pO1xuXG5cdGlmICgkbiA8PSBNYXRoLnBvdyhsb2cxMCgkcCksIDIpICsgMykge1xuXHRcdHZhciAkcm91bmQ7XG5cdFx0ZG8geyBcblx0XHRcdHZhciAkcDEgPSBfc3VidHByb2IoJG4sICR4KTtcblx0XHRcdHZhciAkbjEgPSAkbiArIDE7XG5cdFx0XHR2YXIgJGRlbHRhID0gKCRwMSAtICRwKSBcblx0XHRcdFx0LyBNYXRoLmV4cCgoJG4xICogTWF0aC5sb2coJG4xIC8gKCRuICsgJHggKiAkeCkpIFxuXHRcdFx0XHRcdCsgTWF0aC5sb2coJG4vJG4xLzIvTWF0aC5QSSkgLSAxIFxuXHRcdFx0XHRcdCsgKDEvJG4xIC0gMS8kbikgLyA2KSAvIDIpO1xuXHRcdFx0JHggKz0gJGRlbHRhO1xuXHRcdFx0JHJvdW5kID0gcm91bmRfdG9fcHJlY2lzaW9uKCRkZWx0YSwgTWF0aC5hYnMoaW50ZWdlcihsb2cxMChNYXRoLmFicygkeCkpLTQpKSk7XG5cdFx0fSB3aGlsZSAoKCR4KSAmJiAoJHJvdW5kICE9IDApKTtcblx0fVxuXHRyZXR1cm4gJHg7XG59XG5cbmZ1bmN0aW9uIF9zdWJ0cHJvYiAoJG4sICR4KSB7XG5cblx0dmFyICRhO1xuICAgICAgICB2YXIgJGI7XG5cdHZhciAkdyA9IE1hdGguYXRhbjIoJHggLyBNYXRoLnNxcnQoJG4pLCAxKTtcblx0dmFyICR6ID0gTWF0aC5wb3coTWF0aC5jb3MoJHcpLCAyKTtcblx0dmFyICR5ID0gMTtcblxuXHRmb3IgKHZhciAkaSA9ICRuLTI7ICRpID49IDI7ICRpIC09IDIpIHtcblx0XHQkeSA9IDEgKyAoJGktMSkgLyAkaSAqICR6ICogJHk7XG5cdH0gXG5cblx0aWYgKCRuICUgMiA9PSAwKSB7XG5cdFx0JGEgPSBNYXRoLnNpbigkdykvMjtcblx0XHQkYiA9IC41O1xuXHR9IGVsc2Uge1xuXHRcdCRhID0gKCRuID09IDEpID8gMCA6IE1hdGguc2luKCR3KSpNYXRoLmNvcygkdykvTWF0aC5QSTtcblx0XHQkYj0gLjUgKyAkdy9NYXRoLlBJO1xuXHR9XG5cdHJldHVybiBtYXgoMCwgMSAtICRiIC0gJGEgKiAkeSk7XG59XG5cbmZ1bmN0aW9uIF9zdWJmICgkbiwgJG0sICRwKSB7XG5cdHZhciAkeDtcblxuXHRpZiAoJHAgPj0gMSB8fCAkcCA8PSAwKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIHA6ICRwXFxuXCIpO1xuXHR9XG5cblx0aWYgKCRwID09IDEpIHtcblx0XHQkeCA9IDA7XG5cdH0gZWxzZSBpZiAoJG0gPT0gMSkge1xuXHRcdCR4ID0gMSAvIE1hdGgucG93KF9zdWJ0KCRuLCAwLjUgLSAkcCAvIDIpLCAyKTtcblx0fSBlbHNlIGlmICgkbiA9PSAxKSB7XG5cdFx0JHggPSBNYXRoLnBvdyhfc3VidCgkbSwgJHAvMiksIDIpO1xuXHR9IGVsc2UgaWYgKCRtID09IDIpIHtcblx0XHR2YXIgJHUgPSBfc3ViY2hpc3FyKCRtLCAxIC0gJHApO1xuXHRcdHZhciAkYSA9ICRtIC0gMjtcblx0XHQkeCA9IDEgLyAoJHUgLyAkbSAqICgxICtcblx0XHRcdCgoJHUgLSAkYSkgLyAyICtcblx0XHRcdFx0KCgoNCAqICR1IC0gMTEgKiAkYSkgKiAkdSArICRhICogKDcgKiAkbSAtIDEwKSkgLyAyNCArXG5cdFx0XHRcdFx0KCgoMiAqICR1IC0gMTAgKiAkYSkgKiAkdSArICRhICogKDE3ICogJG0gLSAyNikpICogJHVcblx0XHRcdFx0XHRcdC0gJGEgKiAkYSAqICg5ICogJG0gLSA2KVxuXHRcdFx0XHRcdCkvNDgvJG5cblx0XHRcdFx0KS8kblxuXHRcdFx0KS8kbikpO1xuXHR9IGVsc2UgaWYgKCRuID4gJG0pIHtcblx0XHQkeCA9IDEgLyBfc3ViZjIoJG0sICRuLCAxIC0gJHApXG5cdH0gZWxzZSB7XG5cdFx0JHggPSBfc3ViZjIoJG4sICRtLCAkcClcblx0fVxuXHRyZXR1cm4gJHg7XG59XG5cbmZ1bmN0aW9uIF9zdWJmMiAoJG4sICRtLCAkcCkge1xuXHR2YXIgJHUgPSBfc3ViY2hpc3FyKCRuLCAkcCk7XG5cdHZhciAkbjIgPSAkbiAtIDI7XG5cdHZhciAkeCA9ICR1IC8gJG4gKiBcblx0XHQoMSArIFxuXHRcdFx0KCgkdSAtICRuMikgLyAyICsgXG5cdFx0XHRcdCgoKDQgKiAkdSAtIDExICogJG4yKSAqICR1ICsgJG4yICogKDcgKiAkbiAtIDEwKSkgLyAyNCArIFxuXHRcdFx0XHRcdCgoKDIgKiAkdSAtIDEwICogJG4yKSAqICR1ICsgJG4yICogKDE3ICogJG4gLSAyNikpICogJHUgXG5cdFx0XHRcdFx0XHQtICRuMiAqICRuMiAqICg5ICogJG4gLSA2KSkgLyA0OCAvICRtKSAvICRtKSAvICRtKTtcblx0dmFyICRkZWx0YTtcblx0ZG8ge1xuXHRcdHZhciAkeiA9IE1hdGguZXhwKFxuXHRcdFx0KCgkbiskbSkgKiBNYXRoLmxvZygoJG4rJG0pIC8gKCRuICogJHggKyAkbSkpIFxuXHRcdFx0XHQrICgkbiAtIDIpICogTWF0aC5sb2coJHgpXG5cdFx0XHRcdCsgTWF0aC5sb2coJG4gKiAkbSAvICgkbiskbSkpXG5cdFx0XHRcdC0gTWF0aC5sb2coNCAqIE1hdGguUEkpXG5cdFx0XHRcdC0gKDEvJG4gICsgMS8kbSAtIDEvKCRuKyRtKSkvNlxuXHRcdFx0KS8yKTtcblx0XHQkZGVsdGEgPSAoX3N1YmZwcm9iKCRuLCAkbSwgJHgpIC0gJHApIC8gJHo7XG5cdFx0JHggKz0gJGRlbHRhO1xuXHR9IHdoaWxlIChNYXRoLmFicygkZGVsdGEpPjNlLTQpO1xuXHRyZXR1cm4gJHg7XG59XG5cbmZ1bmN0aW9uIF9zdWJjaGlzcXIgKCRuLCAkcCkge1xuXHR2YXIgJHg7XG5cblx0aWYgKCgkcCA+IDEpIHx8ICgkcCA8PSAwKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBwOiAkcFxcblwiKTtcblx0fSBlbHNlIGlmICgkcCA9PSAxKXtcblx0XHQkeCA9IDA7XG5cdH0gZWxzZSBpZiAoJG4gPT0gMSkge1xuXHRcdCR4ID0gTWF0aC5wb3coX3N1YnUoJHAgLyAyKSwgMik7XG5cdH0gZWxzZSBpZiAoJG4gPT0gMikge1xuXHRcdCR4ID0gLTIgKiBNYXRoLmxvZygkcCk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyICR1ID0gX3N1YnUoJHApO1xuXHRcdHZhciAkdTIgPSAkdSAqICR1O1xuXG5cdFx0JHggPSBtYXgoMCwgJG4gKyBNYXRoLnNxcnQoMiAqICRuKSAqICR1IFxuXHRcdFx0KyAyLzMgKiAoJHUyIC0gMSlcblx0XHRcdCsgJHUgKiAoJHUyIC0gNykgLyA5IC8gTWF0aC5zcXJ0KDIgKiAkbilcblx0XHRcdC0gMi80MDUgLyAkbiAqICgkdTIgKiAoMyAqJHUyICsgNykgLSAxNikpO1xuXG5cdFx0aWYgKCRuIDw9IDEwMCkge1xuXHRcdFx0dmFyICR4MDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkcDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJHo7XG5cdFx0XHRkbyB7XG5cdFx0XHRcdCR4MCA9ICR4O1xuXHRcdFx0XHRpZiAoJHggPCAwKSB7XG5cdFx0XHRcdFx0JHAxID0gMTtcblx0XHRcdFx0fSBlbHNlIGlmICgkbj4xMDApIHtcblx0XHRcdFx0XHQkcDEgPSBfc3VidXByb2IoKE1hdGgucG93KCgkeCAvICRuKSwgKDEvMykpIC0gKDEgLSAyLzkvJG4pKVxuXHRcdFx0XHRcdFx0LyBNYXRoLnNxcnQoMi85LyRuKSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoJHg+NDAwKSB7XG5cdFx0XHRcdFx0JHAxID0gMDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YXIgJGkwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRhO1xuXHRcdFx0XHRcdGlmICgoJG4gJSAyKSAhPSAwKSB7XG5cdFx0XHRcdFx0XHQkcDEgPSAyICogX3N1YnVwcm9iKE1hdGguc3FydCgkeCkpO1xuXHRcdFx0XHRcdFx0JGEgPSBNYXRoLnNxcnQoMi9NYXRoLlBJKSAqIE1hdGguZXhwKC0keC8yKSAvIE1hdGguc3FydCgkeCk7XG5cdFx0XHRcdFx0XHQkaTAgPSAxO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkcDEgPSAkYSA9IE1hdGguZXhwKC0keC8yKTtcblx0XHRcdFx0XHRcdCRpMCA9IDI7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Zm9yICh2YXIgJGkgPSAkaTA7ICRpIDw9ICRuLTI7ICRpICs9IDIpIHtcblx0XHRcdFx0XHRcdCRhICo9ICR4IC8gJGk7XG5cdFx0XHRcdFx0XHQkcDEgKz0gJGE7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdCR6ID0gTWF0aC5leHAoKCgkbi0xKSAqIE1hdGgubG9nKCR4LyRuKSAtIE1hdGgubG9nKDQqTWF0aC5QSSokeCkgXG5cdFx0XHRcdFx0KyAkbiAtICR4IC0gMS8kbi82KSAvIDIpO1xuXHRcdFx0XHQkeCArPSAoJHAxIC0gJHApIC8gJHo7XG5cdFx0XHRcdCR4ID0gcm91bmRfdG9fcHJlY2lzaW9uKCR4LCA1KTtcblx0XHRcdH0gd2hpbGUgKCgkbiA8IDMxKSAmJiAoTWF0aC5hYnMoJHgwIC0gJHgpID4gMWUtNCkpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gJHg7XG59XG5cbmZ1bmN0aW9uIGxvZzEwICgkbikge1xuXHRyZXR1cm4gTWF0aC5sb2coJG4pIC8gTWF0aC5sb2coMTApO1xufVxuIFxuZnVuY3Rpb24gbWF4ICgpIHtcblx0dmFyICRtYXggPSBhcmd1bWVudHNbMF07XG5cdGZvciAodmFyICRpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICgkbWF4IDwgYXJndW1lbnRzWyRpXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICRtYXggPSBhcmd1bWVudHNbJGldO1xuXHR9XHRcblx0cmV0dXJuICRtYXg7XG59XG5cbmZ1bmN0aW9uIG1pbiAoKSB7XG5cdHZhciAkbWluID0gYXJndW1lbnRzWzBdO1xuXHRmb3IgKHZhciAkaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoJG1pbiA+IGFyZ3VtZW50c1skaV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAkbWluID0gYXJndW1lbnRzWyRpXTtcblx0fVxuXHRyZXR1cm4gJG1pbjtcbn1cblxuZnVuY3Rpb24gcHJlY2lzaW9uICgkeCkge1xuXHRyZXR1cm4gTWF0aC5hYnMoaW50ZWdlcihsb2cxMChNYXRoLmFicygkeCkpIC0gU0lHTklGSUNBTlQpKTtcbn1cblxuZnVuY3Rpb24gcHJlY2lzaW9uX3N0cmluZyAoJHgpIHtcblx0aWYgKCR4KSB7XG5cdFx0cmV0dXJuIHJvdW5kX3RvX3ByZWNpc2lvbigkeCwgcHJlY2lzaW9uKCR4KSk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIFwiMFwiO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJvdW5kX3RvX3ByZWNpc2lvbiAoJHgsICRwKSB7XG4gICAgICAgICR4ID0gJHggKiBNYXRoLnBvdygxMCwgJHApO1xuICAgICAgICAkeCA9IE1hdGgucm91bmQoJHgpO1xuICAgICAgICByZXR1cm4gJHggLyBNYXRoLnBvdygxMCwgJHApO1xufVxuXG5mdW5jdGlvbiBpbnRlZ2VyICgkaSkge1xuICAgICAgICBpZiAoJGkgPiAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKCRpKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwoJGkpO1xufSIsImltcG9ydCB7dGRpc3RyfSBmcm9tIFwiLi9zdGF0aXN0aWNzLWRpc3RyaWJ1dGlvbnNcIlxyXG5cclxudmFyIHN1ID0gbW9kdWxlLmV4cG9ydHMuU3RhdGlzdGljc1V0aWxzID17fTtcclxuc3Uuc2FtcGxlQ29ycmVsYXRpb24gPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy9zYW1wbGVfY29ycmVsYXRpb24nKTtcclxuc3UubGluZWFyUmVncmVzc2lvbiA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL2xpbmVhcl9yZWdyZXNzaW9uJyk7XHJcbnN1LmxpbmVhclJlZ3Jlc3Npb25MaW5lID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvbGluZWFyX3JlZ3Jlc3Npb25fbGluZScpO1xyXG5zdS5lcnJvckZ1bmN0aW9uID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvZXJyb3JfZnVuY3Rpb24nKTtcclxuc3Uuc3RhbmRhcmREZXZpYXRpb24gPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy9zdGFuZGFyZF9kZXZpYXRpb24nKTtcclxuc3Uuc2FtcGxlU3RhbmRhcmREZXZpYXRpb24gPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy9zYW1wbGVfc3RhbmRhcmRfZGV2aWF0aW9uJyk7XHJcbnN1LnZhcmlhbmNlID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvdmFyaWFuY2UnKTtcclxuc3UubWVhbiA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL21lYW4nKTtcclxuc3UuelNjb3JlID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvel9zY29yZScpO1xyXG5zdS5zdGFuZGFyZEVycm9yPSBhcnIgPT4gTWF0aC5zcXJ0KHN1LnZhcmlhbmNlKGFycikvKGFyci5sZW5ndGgtMSkpO1xyXG5cclxuXHJcbnN1LnRWYWx1ZT0gKGRlZ3JlZXNPZkZyZWVkb20sIGNyaXRpY2FsUHJvYmFiaWxpdHkpID0+IHsgLy9hcyBpbiBodHRwOi8vc3RhdHRyZWsuY29tL29ubGluZS1jYWxjdWxhdG9yL3QtZGlzdHJpYnV0aW9uLmFzcHhcclxuICAgIHJldHVybiB0ZGlzdHIoZGVncmVlc09mRnJlZWRvbSwgY3JpdGljYWxQcm9iYWJpbGl0eSk7XHJcbn07IiwiZXhwb3J0IGNsYXNzIFV0aWxzIHtcclxuICAgIC8vIHVzYWdlIGV4YW1wbGUgZGVlcEV4dGVuZCh7fSwgb2JqQSwgb2JqQik7ID0+IHNob3VsZCB3b3JrIHNpbWlsYXIgdG8gJC5leHRlbmQodHJ1ZSwge30sIG9iakEsIG9iakIpO1xyXG4gICAgc3RhdGljIGRlZXBFeHRlbmQob3V0KSB7XHJcblxyXG4gICAgICAgIHZhciB1dGlscyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGVtcHR5T3V0ID0ge307XHJcblxyXG5cclxuICAgICAgICBpZiAoIW91dCAmJiBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBBcnJheS5pc0FycmF5KGFyZ3VtZW50c1sxXSkpIHtcclxuICAgICAgICAgICAgb3V0ID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG91dCA9IG91dCB8fCB7fTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgaWYgKCFzb3VyY2UpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgIGlmICghc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheShvdXRba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXNPYmplY3QgPSB1dGlscy5pc09iamVjdChvdXRba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3JjT2JqID0gdXRpbHMuaXNPYmplY3Qoc291cmNlW2tleV0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpc09iamVjdCAmJiAhaXNBcnJheSAmJiBzcmNPYmopIHtcclxuICAgICAgICAgICAgICAgICAgICB1dGlscy5kZWVwRXh0ZW5kKG91dFtrZXldLCBzb3VyY2Vba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dFtrZXldID0gc291cmNlW2tleV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBtZXJnZURlZXAodGFyZ2V0LCBzb3VyY2UpIHtcclxuICAgICAgICBsZXQgb3V0cHV0ID0gT2JqZWN0LmFzc2lnbih7fSwgdGFyZ2V0KTtcclxuICAgICAgICBpZiAoVXRpbHMuaXNPYmplY3ROb3RBcnJheSh0YXJnZXQpICYmIFV0aWxzLmlzT2JqZWN0Tm90QXJyYXkoc291cmNlKSkge1xyXG4gICAgICAgICAgICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChVdGlscy5pc09iamVjdE5vdEFycmF5KHNvdXJjZVtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKGtleSBpbiB0YXJnZXQpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKG91dHB1dCwge1trZXldOiBzb3VyY2Vba2V5XX0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0W2tleV0gPSBVdGlscy5tZXJnZURlZXAodGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihvdXRwdXQsIHtba2V5XTogc291cmNlW2tleV19KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNyb3NzKGEsIGIpIHtcclxuICAgICAgICB2YXIgYyA9IFtdLCBuID0gYS5sZW5ndGgsIG0gPSBiLmxlbmd0aCwgaSwgajtcclxuICAgICAgICBmb3IgKGkgPSAtMTsgKytpIDwgbjspIGZvciAoaiA9IC0xOyArK2ogPCBtOykgYy5wdXNoKHt4OiBhW2ldLCBpOiBpLCB5OiBiW2pdLCBqOiBqfSk7XHJcbiAgICAgICAgcmV0dXJuIGM7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBpbmZlclZhcmlhYmxlcyhkYXRhLCBncm91cEtleSwgaW5jbHVkZUdyb3VwKSB7XHJcbiAgICAgICAgdmFyIHJlcyA9IFtdO1xyXG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB2YXIgZCA9IGRhdGFbMF07XHJcbiAgICAgICAgICAgIGlmIChkIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIHJlcyA9IGQubWFwKGZ1bmN0aW9uICh2LCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZCA9PT0gJ29iamVjdCcpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIGQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWQuaGFzT3duUHJvcGVydHkocHJvcCkpIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXMucHVzaChwcm9wKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWluY2x1ZGVHcm91cCkge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSByZXMuaW5kZXhPZihncm91cEtleSk7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICByZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzXHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBpc09iamVjdE5vdEFycmF5KGl0ZW0pIHtcclxuICAgICAgICByZXR1cm4gKGl0ZW0gJiYgdHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KGl0ZW0pICYmIGl0ZW0gIT09IG51bGwpO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgaXNPYmplY3QoYSkge1xyXG4gICAgICAgIHJldHVybiBhICE9PSBudWxsICYmIHR5cGVvZiBhID09PSAnb2JqZWN0JztcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGlzTnVtYmVyKGEpIHtcclxuICAgICAgICByZXR1cm4gIWlzTmFOKGEpICYmIHR5cGVvZiBhID09PSAnbnVtYmVyJztcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGlzRnVuY3Rpb24oYSkge1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgYSA9PT0gJ2Z1bmN0aW9uJztcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGluc2VydE9yQXBwZW5kU2VsZWN0b3IocGFyZW50LCBzZWxlY3Rvciwgb3BlcmF0aW9uLCBiZWZvcmUpIHtcclxuICAgICAgICB2YXIgc2VsZWN0b3JQYXJ0cyA9IHNlbGVjdG9yLnNwbGl0KC8oW1xcLlxcI10pLyk7XHJcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBwYXJlbnRbb3BlcmF0aW9uXShzZWxlY3RvclBhcnRzLnNoaWZ0KCksIGJlZm9yZSk7Ly9cIjpmaXJzdC1jaGlsZFwiXHJcbiAgICAgICAgd2hpbGUgKHNlbGVjdG9yUGFydHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZWN0b3JNb2RpZmllciA9IHNlbGVjdG9yUGFydHMuc2hpZnQoKTtcclxuICAgICAgICAgICAgdmFyIHNlbGVjdG9ySXRlbSA9IHNlbGVjdG9yUGFydHMuc2hpZnQoKTtcclxuICAgICAgICAgICAgaWYgKHNlbGVjdG9yTW9kaWZpZXIgPT09IFwiLlwiKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5jbGFzc2VkKHNlbGVjdG9ySXRlbSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZWN0b3JNb2RpZmllciA9PT0gXCIjXCIpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LmF0dHIoJ2lkJywgc2VsZWN0b3JJdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaW5zZXJ0U2VsZWN0b3IocGFyZW50LCBzZWxlY3RvciwgYmVmb3JlKSB7XHJcbiAgICAgICAgcmV0dXJuIFV0aWxzLmluc2VydE9yQXBwZW5kU2VsZWN0b3IocGFyZW50LCBzZWxlY3RvciwgXCJpbnNlcnRcIiwgYmVmb3JlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXBwZW5kU2VsZWN0b3IocGFyZW50LCBzZWxlY3Rvcikge1xyXG4gICAgICAgIHJldHVybiBVdGlscy5pbnNlcnRPckFwcGVuZFNlbGVjdG9yKHBhcmVudCwgc2VsZWN0b3IsIFwiYXBwZW5kXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzZWxlY3RPckFwcGVuZChwYXJlbnQsIHNlbGVjdG9yLCBlbGVtZW50KSB7XHJcbiAgICAgICAgdmFyIHNlbGVjdGlvbiA9IHBhcmVudC5zZWxlY3Qoc2VsZWN0b3IpO1xyXG4gICAgICAgIGlmIChzZWxlY3Rpb24uZW1wdHkoKSkge1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcmVudC5hcHBlbmQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFV0aWxzLmFwcGVuZFNlbGVjdG9yKHBhcmVudCwgc2VsZWN0b3IpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNlbGVjdGlvbjtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIHNlbGVjdE9ySW5zZXJ0KHBhcmVudCwgc2VsZWN0b3IsIGJlZm9yZSkge1xyXG4gICAgICAgIHZhciBzZWxlY3Rpb24gPSBwYXJlbnQuc2VsZWN0KHNlbGVjdG9yKTtcclxuICAgICAgICBpZiAoc2VsZWN0aW9uLmVtcHR5KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFV0aWxzLmluc2VydFNlbGVjdG9yKHBhcmVudCwgc2VsZWN0b3IsIGJlZm9yZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzZWxlY3Rpb247XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBsaW5lYXJHcmFkaWVudChzdmcsIGdyYWRpZW50SWQsIHJhbmdlLCB4MSwgeTEsIHgyLCB5Mikge1xyXG4gICAgICAgIHZhciBkZWZzID0gVXRpbHMuc2VsZWN0T3JBcHBlbmQoc3ZnLCBcImRlZnNcIik7XHJcbiAgICAgICAgdmFyIGxpbmVhckdyYWRpZW50ID0gZGVmcy5hcHBlbmQoXCJsaW5lYXJHcmFkaWVudFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIGdyYWRpZW50SWQpO1xyXG5cclxuICAgICAgICBsaW5lYXJHcmFkaWVudFxyXG4gICAgICAgICAgICAuYXR0cihcIngxXCIsIHgxICsgXCIlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieTFcIiwgeTEgKyBcIiVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ4MlwiLCB4MiArIFwiJVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInkyXCIsIHkyICsgXCIlXCIpO1xyXG5cclxuICAgICAgICAvL0FwcGVuZCBtdWx0aXBsZSBjb2xvciBzdG9wcyBieSB1c2luZyBEMydzIGRhdGEvZW50ZXIgc3RlcFxyXG4gICAgICAgIHZhciBzdG9wcyA9IGxpbmVhckdyYWRpZW50LnNlbGVjdEFsbChcInN0b3BcIilcclxuICAgICAgICAgICAgLmRhdGEocmFuZ2UpO1xyXG5cclxuICAgICAgICBzdG9wcy5lbnRlcigpLmFwcGVuZChcInN0b3BcIik7XHJcblxyXG4gICAgICAgIHN0b3BzLmF0dHIoXCJvZmZzZXRcIiwgKGQsIGkpID0+IGkgLyAocmFuZ2UubGVuZ3RoIC0gMSkpXHJcbiAgICAgICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCBkID0+IGQpO1xyXG5cclxuICAgICAgICBzdG9wcy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNhbml0aXplSGVpZ2h0ID0gZnVuY3Rpb24gKGhlaWdodCwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIChoZWlnaHQgfHwgcGFyc2VJbnQoY29udGFpbmVyLnN0eWxlKCdoZWlnaHQnKSwgMTApIHx8IDQwMCk7XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBzdGF0aWMgc2FuaXRpemVXaWR0aCA9IGZ1bmN0aW9uICh3aWR0aCwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgcmV0dXJuICh3aWR0aCB8fCBwYXJzZUludChjb250YWluZXIuc3R5bGUoJ3dpZHRoJyksIDEwKSB8fCA5NjApO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgYXZhaWxhYmxlSGVpZ2h0ID0gZnVuY3Rpb24gKGhlaWdodCwgY29udGFpbmVyLCBtYXJnaW4pIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5tYXgoMCwgVXRpbHMuc2FuaXRpemVIZWlnaHQoaGVpZ2h0LCBjb250YWluZXIpIC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b20pO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgYXZhaWxhYmxlV2lkdGggPSBmdW5jdGlvbiAod2lkdGgsIGNvbnRhaW5lciwgbWFyZ2luKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KDAsIFV0aWxzLnNhbml0aXplV2lkdGgod2lkdGgsIGNvbnRhaW5lcikgLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBndWlkKCkge1xyXG4gICAgZnVuY3Rpb24gczQoKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKDEgKyBNYXRoLnJhbmRvbSgpKSAqIDB4MTAwMDApXHJcbiAgICAgICAgICAgIC50b1N0cmluZygxNilcclxuICAgICAgICAgICAgLnN1YnN0cmluZygxKTtcclxuICAgIH1cclxuICAgIHJldHVybiBzNCgpICsgczQoKSArICctJyArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICtcclxuICAgICAgICBzNCgpICsgJy0nICsgczQoKSArIHM0KCkgKyBzNCgpO1xyXG59XHJcbn1cclxuIl19
