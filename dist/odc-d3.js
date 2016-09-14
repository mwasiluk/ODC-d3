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
            return this;
        }
    }]);

    return BarChart;
}(_chartWithColorGroups.ChartWithColorGroups);

},{"./chart-with-color-groups":21,"./legend":29,"./utils":35}],20:[function(require,module,exports){
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
            value: function value(d) {
                return d.key;
            }, // x value accessor
            guides: false, //show axis guides
            scale: "ordinal"

        };
        _this.y = { // Y axis config
            title: '',
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
            this.plot.data = this.data;
            this.setupY();
            this.setupX();

            this.setupColor();
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
            var _this3 = this;

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
                    return self.plot.colorCategory(_this3.plot.x.value(d));
                };
            }
        }
    }]);

    return BoxPlotBase;
}(_chart.Chart);

},{"./chart":22,"./utils":35}],21:[function(require,module,exports){
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

},{"./chart":22,"./legend":29,"./utils":35}],22:[function(require,module,exports){
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
                d3.select(window).on("resize", function () {
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

},{"./utils":35}],23:[function(require,module,exports){
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

},{"./chart":22,"./legend":29,"./scatterplot":32,"./statistics-utils":34,"./utils":35}],24:[function(require,module,exports){
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

},{"./utils":35}],25:[function(require,module,exports){
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

},{"./chart":22,"./heatmap":26,"./statistics-utils":34,"./utils":35}],26:[function(require,module,exports){
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

},{"./chart":22,"./legend":29,"./utils":35}],27:[function(require,module,exports){
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

},{"./chart-with-color-groups":21,"./utils":35}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Legend = exports.StatisticsUtils = exports.BoxPlotBaseConfig = exports.BoxPlotBase = exports.BarChartConfig = exports.BarChart = exports.HistogramConfig = exports.Histogram = exports.HeatmapTimeSeriesConfig = exports.HeatmapTimeSeries = exports.HeatmapConfig = exports.Heatmap = exports.RegressionConfig = exports.Regression = exports.CorrelationMatrixConfig = exports.CorrelationMatrix = exports.ScatterPlotMatrixConfig = exports.ScatterPlotMatrix = exports.ScatterPlotConfig = exports.ScatterPlot = undefined;

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

},{"./bar-chart":19,"./box-plot-base":20,"./correlation-matrix":23,"./d3-extensions":24,"./heatmap":26,"./heatmap-timeseries":25,"./histogram":27,"./legend":29,"./regression":30,"./scatterplot":32,"./scatterplot-matrix":31,"./statistics-utils":34}],29:[function(require,module,exports){
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

},{"../bower_components/d3-legend/no-extend":1,"./utils":35}],30:[function(require,module,exports){
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

},{"./chart":22,"./scatterplot":32,"./statistics-utils":34,"./utils":35}],31:[function(require,module,exports){
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
                            plot.tooltip.transition().duration(200).style("opacity", .9);
                            var html = "(" + plot.x.value(d, subplot.x) + ", " + plot.y.value(d, subplot.y) + ")";
                            plot.tooltip.html(html).style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");

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
                            plot.tooltip.html(html).style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");
                        }).on("mouseout", function (d) {
                            plot.tooltip.transition().duration(500).style("opacity", 0);
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

},{"./chart-with-color-groups":21,"./legend":29,"./scatterplot":32,"./utils":35}],32:[function(require,module,exports){
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
                    plot.tooltip.transition().duration(200).style("opacity", .9);
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
                    plot.tooltip.html(html).style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");
                }).on("mouseout", function (d) {
                    plot.tooltip.transition().duration(500).style("opacity", 0);
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

},{"./chart-with-color-groups":21,"./legend":29,"./utils":35}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
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

},{"../bower_components/simple-statistics/src/error_function":6,"../bower_components/simple-statistics/src/linear_regression":7,"../bower_components/simple-statistics/src/linear_regression_line":8,"../bower_components/simple-statistics/src/mean":9,"../bower_components/simple-statistics/src/sample_correlation":10,"../bower_components/simple-statistics/src/sample_standard_deviation":12,"../bower_components/simple-statistics/src/standard_deviation":14,"../bower_components/simple-statistics/src/variance":17,"../bower_components/simple-statistics/src/z_score":18,"./statistics-distributions":33}],35:[function(require,module,exports){
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

},{}]},{},[28])(28)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJib3dlcl9jb21wb25lbnRzXFxkMy1sZWdlbmRcXG5vLWV4dGVuZC5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxjb2xvci5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxsZWdlbmQuanMiLCJib3dlcl9jb21wb25lbnRzXFxkMy1sZWdlbmRcXHNyY1xcc2l6ZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxzeW1ib2wuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxlcnJvcl9mdW5jdGlvbi5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXGxpbmVhcl9yZWdyZXNzaW9uLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcbGluZWFyX3JlZ3Jlc3Npb25fbGluZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXG1lYW4uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfY29ycmVsYXRpb24uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfY292YXJpYW5jZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXHNhbXBsZV9zdGFuZGFyZF9kZXZpYXRpb24uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfdmFyaWFuY2UuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzdGFuZGFyZF9kZXZpYXRpb24uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzdW0uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzdW1fbnRoX3Bvd2VyX2RldmlhdGlvbnMuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFx2YXJpYW5jZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXHpfc2NvcmUuanMiLCJzcmNcXGJhci1jaGFydC5qcyIsInNyY1xcYm94LXBsb3QtYmFzZS5qcyIsInNyY1xcY2hhcnQtd2l0aC1jb2xvci1ncm91cHMuanMiLCJzcmNcXGNoYXJ0LmpzIiwic3JjXFxjb3JyZWxhdGlvbi1tYXRyaXguanMiLCJzcmNcXGQzLWV4dGVuc2lvbnMuanMiLCJzcmNcXGhlYXRtYXAtdGltZXNlcmllcy5qcyIsInNyY1xcaGVhdG1hcC5qcyIsInNyY1xcaGlzdG9ncmFtLmpzIiwic3JjXFxpbmRleC5qcyIsInNyY1xcbGVnZW5kLmpzIiwic3JjXFxyZWdyZXNzaW9uLmpzIiwic3JjXFxzY2F0dGVycGxvdC1tYXRyaXguanMiLCJzcmNcXHNjYXR0ZXJwbG90LmpzIiwic3JjXFxzdGF0aXN0aWNzLWRpc3RyaWJ1dGlvbnMuanMiLCJzcmNcXHN0YXRpc3RpY3MtdXRpbHMuanMiLCJzcmNcXHV0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxPQUFPLE9BQVAsR0FBaUI7QUFDZixTQUFPLFFBQVEsYUFBUixDQURRO0FBRWYsUUFBTSxRQUFRLFlBQVIsQ0FGUztBQUdmLFVBQVEsUUFBUSxjQUFSO0FBSE8sQ0FBakI7Ozs7O0FDQUEsSUFBSSxTQUFTLFFBQVEsVUFBUixDQUFiOztBQUVBLE9BQU8sT0FBUCxHQUFpQixZQUFVOztBQUV6QixNQUFJLFFBQVEsR0FBRyxLQUFILENBQVMsTUFBVCxFQUFaO0FBQUEsTUFDRSxRQUFRLE1BRFY7QUFBQSxNQUVFLGFBQWEsRUFGZjtBQUFBLE1BR0UsY0FBYyxFQUhoQjtB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QUNILEM7O0FBM0xRLEssQ0E2TEYsZSxHQUFrQixVQUFVLE1BQVYsRUFBa0IsU0FBbEIsRUFBNkIsTUFBN0IsRUFBcUM7QUFDMUQsV0FBTyxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksTUFBTSxjQUFOLENBQXFCLE1BQXJCLEVBQTZCLFNBQTdCLElBQTBDLE9BQU8sR0FBakQsR0FBdUQsT0FBTyxNQUExRSxDQUFQO0FBQ0gsQzs7QUEvTFEsSyxDQWlNRixjLEdBQWlCLFVBQVUsS0FBVixFQUFpQixTQUFqQixFQUE0QixNQUE1QixFQUFvQztBQUN4RCxXQUFPLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxNQUFNLGFBQU4sQ0FBb0IsS0FBcEIsRUFBMkIsU0FBM0IsSUFBd0MsT0FBTyxJQUEvQyxHQUFzRCxPQUFPLEtBQXpFLENBQVA7QUFDSCxDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIGNvbG9yOiByZXF1aXJlKCcuL3NyYy9jb2xvcicpLFxyXG4gIHNpemU6IHJlcXVpcmUoJy4vc3JjL3NpemUnKSxcclxuICBzeW1ib2w6IHJlcXVpcmUoJy4vc3JjL3N5bWJvbCcpXHJcbn07XHJcbiIsInZhciBoZWxwZXIgPSByZXF1aXJlKCcuL2xlZ2VuZCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xyXG5cclxuICB2YXIgc2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKSxcclxuICAgIHNoYXBlID0gXCJyZWN0XCIsXHJcbiAgICBzaGFwZVdpZHRoID0gMTUsXHJcbiAgICBzaGFwZUhlaWdodCA9IDE1LFxyXG4gICAgc2hhcGVSYWRpdXMgPSAxMCxcclxuICAgIHNoYXBlUGFkZGluZyA9IDIsXHJcbiAgICBjZWxscyA9IFs1XSxcclxuICAgIGxhYmVscyA9IFtdLFxyXG4gICAgY2xhc3NQcmVmaXggPSBcIlwiLFxyXG4gICAgdXNlQ2xhc3MgPSBmYWxzZSxcclxuICAgIHRpdGxlID0gXCJcIixcclxuICAgIGxhYmVsRm9ybWF0ID0gZDMuZm9ybWF0KFwiLjAxZlwiKSxcclxuICAgIGxhYmVsT2Zmc2V0ID0gMTAsXHJcbiAgICBsYWJlbEFsaWduID0gXCJtaWRkbGVcIixcclxuICAgIGxhYmVsRGVsaW1pdGVyID0gXCJ0b1wiLFxyXG4gICAgb3JpZW50ID0gXCJ2ZXJ0aWNhbFwiLFxyXG4gICAgYXNjZW5kaW5nID0gZmFsc2UsXHJcbiAgICBwYXRoLFxyXG4gICAgbGVnZW5kRGlzcGF0Y2hlciA9IGQzLmRpc3BhdGNoKFwiY2VsbG92ZXJcIiwgXCJjZWxsb3V0XCIsIFwiY2VsbGNsaWNrXCIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGxlZ2VuZChzdmcpe1xyXG5cclxuICAgICAgdmFyIHR5cGUgPSBoZWxwZXIuZDNfY2FsY1R5cGUoc2NhbGUsIGFzY2VuZGluZywgY2VsbHMsIGxhYmVscywgbGFiZWxGb3JtYXQsIGxhYmVsRGVsaW1pdGVyKSxcclxuICAgICAgICBsZWdlbmRHID0gc3ZnLnNlbGVjdEFsbCgnZycpLmRhdGEoW3NjYWxlXSk7XHJcblxyXG4gICAgICBsZWdlbmRHLmVudGVyKCkuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCBjbGFzc1ByZWZpeCArICdsZWdlbmRDZWxscycpO1xyXG5cclxuXHJcbiAgICAgIHZhciBjZWxsID0gbGVnZW5kRy5zZWxlY3RBbGwoXCIuXCIgKyBjbGFzc1ByZWZpeCArIFwiY2VsbFwiKS5kYXRhKHR5cGUuZGF0YSksXHJcbiAgICAgICAgY2VsbEVudGVyID0gY2VsbC5lbnRlcigpLmFwcGVuZChcImdcIiwgXCIuY2VsbFwiKS5hdHRyKFwiY2xhc3NcIiwgY2xhc3NQcmVmaXggKyBcImNlbGxcIikuc3R5bGUoXCJvcGFjaXR5XCIsIDFlLTYpLFxyXG4gICAgICAgIHNoYXBlRW50ZXIgPSBjZWxsRW50ZXIuYXBwZW5kKHNoYXBlKS5hdHRyKFwiY2xhc3NcIiwgY2xhc3NQcmVmaXggKyBcInN3YXRjaFwiKSxcclxuICAgICAgICBzaGFwZXMgPSBjZWxsLnNlbGVjdChcImcuXCIgKyBjbGFzc1ByZWZpeCArIFwiY2VsbCBcIiArIHNoYXBlKTtcclxuXHJcbiAgICAgIC8vYWRkIGV2ZW50IGhhbmRsZXJzXHJcbiAgICAgIGhlbHBlci5kM19hZGRFdmVudHMoY2VsbEVudGVyLCBsZWdlbmREaXNwYXRjaGVyKTtcclxuXHJcbiAgICAgIGNlbGwuZXhpdCgpLnRyYW5zaXRpb24oKS5zdHlsZShcIm9wYWNpdHlcIiwgMCkucmVtb3ZlKCk7XHJcblxyXG4gICAgICBoZWxwZXIuZDNfZHJhd1NoYXBlcyhzaGFwZSwgc2hhcGVzLCBzaGFwZUhlaWdodCwgc2hhcGVXaWR0aCwgc2hhcGVSYWRpdXMsIHBhdGgpO1xyXG5cclxuICAgICAgaGVscGVyLmQzX2FkZFRleHQobGVnZW5kRywgY2VsbEVudGVyLCB0eXBlLmxhYmVscywgY2xhc3NQcmVmaXgpXHJcblxyXG4gICAgICAvLyBzZXRzIHBsYWNlbWVudFxyXG4gICAgICB2YXIgdGV4dCA9IGNlbGwuc2VsZWN0KFwidGV4dFwiKSxcclxuICAgICAgICBzaGFwZVNpemUgPSBzaGFwZXNbMF0ubWFwKCBmdW5jdGlvbihkKXsgcmV0dXJuIGQuZ2V0QkJveCgpOyB9KTtcclxuXHJcbiAgICAgIC8vc2V0cyBzY2FsZVxyXG4gICAgICAvL2V2ZXJ5dGhpbmcgaXMgZmlsbCBleGNlcHQgZm9yIGxpbmUgd2hpY2ggaXMgc3Ryb2tlLFxyXG4gICAgICBpZiAoIXVzZUNsYXNzKXtcclxuICAgICAgICBpZiAoc2hhcGUgPT0gXCJsaW5lXCIpe1xyXG4gICAgICAgICAgc2hhcGVzLnN0eWxlKFwic3Ryb2tlXCIsIHR5cGUuZmVhdHVyZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNoYXBlcy5zdHlsZShcImZpbGxcIiwgdHlwZS5mZWF0dXJlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2hhcGVzLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihkKXsgcmV0dXJuIGNsYXNzUHJlZml4ICsgXCJzd2F0Y2ggXCIgKyB0eXBlLmZlYXR1cmUoZCk7IH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgY2VsbFRyYW5zLFxyXG4gICAgICB0ZXh0VHJhbnMsXHJcbiAgICAgIHRleHRBbGlnbiA9IChsYWJlbEFsaWduID09IFwic3RhcnRcIikgPyAwIDogKGxhYmVsQWxpZ24gPT0gXCJtaWRkbGVcIikgPyAwLjUgOiAxO1xyXG5cclxuICAgICAgLy9wb3NpdGlvbnMgY2VsbHMgYW5kIHRleHRcclxuICAgICAgaWYgKG9yaWVudCA9PT0gXCJ2ZXJ0aWNhbFwiKXtcclxuICAgICAgICBjZWxsVHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKDAsIFwiICsgKGkgKiAoc2hhcGVTaXplW2ldLmhlaWdodCArIHNoYXBlUGFkZGluZykpICsgXCIpXCI7IH07XHJcbiAgICAgICAgdGV4dFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIChzaGFwZVNpemVbaV0ud2lkdGggKyBzaGFwZVNpemVbaV0ueCArXHJcbiAgICAgICAgICBsYWJlbE9mZnNldCkgKyBcIixcIiArIChzaGFwZVNpemVbaV0ueSArIHNoYXBlU2l6ZVtpXS5oZWlnaHQvMiArIDUpICsgXCIpXCI7IH07XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKG9yaWVudCA9PT0gXCJob3Jpem9udGFsXCIpe1xyXG4gICAgICAgIGNlbGxUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAoaSAqIChzaGFwZVNpemVbaV0ud2lkdGggKyBzaGFwZVBhZGRpbmcpKSArIFwiLDApXCI7IH1cclxuICAgICAgICB0ZXh0VHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKHNoYXBlU2l6ZVtpXS53aWR0aCp0ZXh0QWxpZ24gICsgc2hhcGVTaXplW2ldLngpICtcclxuICAgICAgICAgIFwiLFwiICsgKHNoYXBlU2l6ZVtpXS5oZWlnaHQgKyBzaGFwZVNpemVbaV0ueSArIGxhYmVsT2Zmc2V0ICsgOCkgKyBcIilcIjsgfTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaGVscGVyLmQzX3BsYWNlbWVudChvcmllbnQsIGNlbGwsIGNlbGxUcmFucywgdGV4dCwgdGV4dFRyYW5zLCBsYWJlbEFsaWduKTtcclxuICAgICAgaGVscGVyLmQzX3RpdGxlKHN2ZywgbGVnZW5kRywgdGl0bGUsIGNsYXNzUHJlZml4KTtcclxuXHJcbiAgICAgIGNlbGwudHJhbnNpdGlvbigpLnN0eWxlKFwib3BhY2l0eVwiLCAxKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgbGVnZW5kLnNjYWxlID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2NhbGU7XHJcbiAgICBzY2FsZSA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5jZWxscyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGNlbGxzO1xyXG4gICAgaWYgKF8ubGVuZ3RoID4gMSB8fCBfID49IDIgKXtcclxuICAgICAgY2VsbHMgPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuc2hhcGUgPSBmdW5jdGlvbihfLCBkKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZTtcclxuICAgIGlmIChfID09IFwicmVjdFwiIHx8IF8gPT0gXCJjaXJjbGVcIiB8fCBfID09IFwibGluZVwiIHx8IChfID09IFwicGF0aFwiICYmICh0eXBlb2YgZCA9PT0gJ3N0cmluZycpKSApe1xyXG4gICAgICBzaGFwZSA9IF87XHJcbiAgICAgIHBhdGggPSBkO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuc2hhcGVXaWR0aCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlV2lkdGg7XHJcbiAgICBzaGFwZVdpZHRoID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5zaGFwZUhlaWdodCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlSGVpZ2h0O1xyXG4gICAgc2hhcGVIZWlnaHQgPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlUmFkaXVzID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGVSYWRpdXM7XHJcbiAgICBzaGFwZVJhZGl1cyA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuc2hhcGVQYWRkaW5nID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGVQYWRkaW5nO1xyXG4gICAgc2hhcGVQYWRkaW5nID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbHMgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbHM7XHJcbiAgICBsYWJlbHMgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxBbGlnbiA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsQWxpZ247XHJcbiAgICBpZiAoXyA9PSBcInN0YXJ0XCIgfHwgXyA9PSBcImVuZFwiIHx8IF8gPT0gXCJtaWRkbGVcIikge1xyXG4gICAgICBsYWJlbEFsaWduID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsRm9ybWF0ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxGb3JtYXQ7XHJcbiAgICBsYWJlbEZvcm1hdCA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbE9mZnNldCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsT2Zmc2V0O1xyXG4gICAgbGFiZWxPZmZzZXQgPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsRGVsaW1pdGVyID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxEZWxpbWl0ZXI7XHJcbiAgICBsYWJlbERlbGltaXRlciA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC51c2VDbGFzcyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHVzZUNsYXNzO1xyXG4gICAgaWYgKF8gPT09IHRydWUgfHwgXyA9PT0gZmFsc2Upe1xyXG4gICAgICB1c2VDbGFzcyA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5vcmllbnQgPSBmdW5jdGlvbihfKXtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIG9yaWVudDtcclxuICAgIF8gPSBfLnRvTG93ZXJDYXNlKCk7XHJcbiAgICBpZiAoXyA9PSBcImhvcml6b250YWxcIiB8fCBfID09IFwidmVydGljYWxcIikge1xyXG4gICAgICBvcmllbnQgPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuYXNjZW5kaW5nID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gYXNjZW5kaW5nO1xyXG4gICAgYXNjZW5kaW5nID0gISFfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuY2xhc3NQcmVmaXggPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBjbGFzc1ByZWZpeDtcclxuICAgIGNsYXNzUHJlZml4ID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnRpdGxlID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdGl0bGU7XHJcbiAgICB0aXRsZSA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGQzLnJlYmluZChsZWdlbmQsIGxlZ2VuZERpc3BhdGNoZXIsIFwib25cIik7XHJcblxyXG4gIHJldHVybiBsZWdlbmQ7XHJcblxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgZDNfaWRlbnRpdHk6IGZ1bmN0aW9uIChkKSB7XHJcbiAgICByZXR1cm4gZDtcclxuICB9LFxyXG5cclxuICBkM19tZXJnZUxhYmVsczogZnVuY3Rpb24gKGdlbiwgbGFiZWxzKSB7XHJcblxyXG4gICAgICBpZihsYWJlbHMubGVuZ3RoID09PSAwKSByZXR1cm4gZ2VuO1xyXG5cclxuICAgICAgZ2VuID0gKGdlbikgPyBnZW4gOiBbXTtcclxuXHJcbiAgICAgIHZhciBpID0gbGFiZWxzLmxlbmd0aDtcclxuICAgICAgZm9yICg7IGkgPCBnZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsYWJlbHMucHVzaChnZW5baV0pO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBsYWJlbHM7XHJcbiAgICB9LFxyXG5cclxuICBkM19saW5lYXJMZWdlbmQ6IGZ1bmN0aW9uIChzY2FsZSwgY2VsbHMsIGxhYmVsRm9ybWF0KSB7XHJcbiAgICB2YXIgZGF0YSA9IFtdO1xyXG5cclxuICAgIGlmIChjZWxscy5sZW5ndGggPiAxKXtcclxuICAgICAgZGF0YSA9IGNlbGxzO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBkb21haW4gPSBzY2FsZS5kb21haW4oKSxcclxuICAgICAgaW5jcmVtZW50ID0gKGRvbWFpbltkb21haW4ubGVuZ3RoIC0gMV0gLSBkb21haW5bMF0pLyhjZWxscyAtIDEpLFxyXG4gICAgICBpID0gMDtcclxuXHJcbiAgICAgIGZvciAoOyBpIDwgY2VsbHM7IGkrKyl7XHJcbiAgICAgICAgZGF0YS5wdXNoKGRvbWFpblswXSArIGkqaW5jcmVtZW50KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhciBsYWJlbHMgPSBkYXRhLm1hcChsYWJlbEZvcm1hdCk7XHJcblxyXG4gICAgcmV0dXJuIHtkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICBsYWJlbHM6IGxhYmVscyxcclxuICAgICAgICAgICAgZmVhdHVyZTogZnVuY3Rpb24oZCl7IHJldHVybiBzY2FsZShkKTsgfX07XHJcbiAgfSxcclxuXHJcbiAgZDNfcXVhbnRMZWdlbmQ6IGZ1bmN0aW9uIChzY2FsZSwgbGFiZWxGb3JtYXQsIGxhYmVsRGVsaW1pdGVyKSB7XHJcbiAgICB2YXIgbGFiZWxzID0gc2NhbGUucmFuZ2UoKS5tYXAoZnVuY3Rpb24oZCl7XHJcbiAgICAgIHZhciBpbnZlcnQgPSBzY2FsZS5pbnZlcnRFeHRlbnQoZCksXHJcbiAgICAgIGEgPSBsYWJlbEZvcm1hdChpbnZlcnRbMF0pLFxyXG4gICAgICBiID0gbGFiZWxGb3JtYXQoaW52ZXJ0WzFdKTtcclxuXHJcbiAgICAgIC8vIGlmICgoIChhKSAmJiAoYS5pc05hbigpKSAmJiBiKXtcclxuICAgICAgLy8gICBjb25zb2xlLmxvZyhcImluIGluaXRpYWwgc3RhdGVtZW50XCIpXHJcbiAgICAgICAgcmV0dXJuIGxhYmVsRm9ybWF0KGludmVydFswXSkgKyBcIiBcIiArIGxhYmVsRGVsaW1pdGVyICsgXCIgXCIgKyBsYWJlbEZvcm1hdChpbnZlcnRbMV0pO1xyXG4gICAgICAvLyB9IGVsc2UgaWYgKGEgfHwgYikge1xyXG4gICAgICAvLyAgIGNvbnNvbGUubG9nKCdpbiBlbHNlIHN0YXRlbWVudCcpXHJcbiAgICAgIC8vICAgcmV0dXJuIChhKSA/IGEgOiBiO1xyXG4gICAgICAvLyB9XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHtkYXRhOiBzY2FsZS5yYW5nZSgpLFxyXG4gICAgICAgICAgICBsYWJlbHM6IGxhYmVscyxcclxuICAgICAgICAgICAgZmVhdHVyZTogdGhpcy5kM19pZGVudGl0eVxyXG4gICAgICAgICAgfTtcclxuICB9LFxyXG5cclxuICBkM19vcmRpbmFsTGVnZW5kOiBmdW5jdGlvbiAoc2NhbGUpIHtcclxuICAgIHJldHVybiB7ZGF0YTogc2NhbGUuZG9tYWluKCksXHJcbiAgICAgICAgICAgIGxhYmVsczogc2NhbGUuZG9tYWluKCksXHJcbiAgICAgICAgICAgIGZlYXR1cmU6IGZ1bmN0aW9uKGQpeyByZXR1cm4gc2NhbGUoZCk7IH19O1xyXG4gIH0sXHJcblxyXG4gIGQzX2RyYXdTaGFwZXM6IGZ1bmN0aW9uIChzaGFwZSwgc2hhcGVzLCBzaGFwZUhlaWdodCwgc2hhcGVXaWR0aCwgc2hhcGVSYWRpdXMsIHBhdGgpIHtcclxuICAgIGlmIChzaGFwZSA9PT0gXCJyZWN0XCIpe1xyXG4gICAgICAgIHNoYXBlcy5hdHRyKFwiaGVpZ2h0XCIsIHNoYXBlSGVpZ2h0KS5hdHRyKFwid2lkdGhcIiwgc2hhcGVXaWR0aCk7XHJcblxyXG4gICAgfSBlbHNlIGlmIChzaGFwZSA9PT0gXCJjaXJjbGVcIikge1xyXG4gICAgICAgIHNoYXBlcy5hdHRyKFwiclwiLCBzaGFwZVJhZGl1cykvLy5hdHRyKFwiY3hcIiwgc2hhcGVSYWRpdXMpLmF0dHIoXCJjeVwiLCBzaGFwZVJhZGl1cyk7XHJcblxyXG4gICAgfSBlbHNlIGlmIChzaGFwZSA9PT0gXCJsaW5lXCIpIHtcclxuICAgICAgICBzaGFwZXMuYXR0cihcIngxXCIsIDApLmF0dHIoXCJ4MlwiLCBzaGFwZVdpZHRoKS5hdHRyKFwieTFcIiwgMCkuYXR0cihcInkyXCIsIDApO1xyXG5cclxuICAgIH0gZWxzZSBpZiAoc2hhcGUgPT09IFwicGF0aFwiKSB7XHJcbiAgICAgIHNoYXBlcy5hdHRyKFwiZFwiLCBwYXRoKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBkM19hZGRUZXh0OiBmdW5jdGlvbiAoc3ZnLCBlbnRlciwgbGFiZWxzLCBjbGFzc1ByZWZpeCl7XHJcbiAgICBlbnRlci5hcHBlbmQoXCJ0ZXh0XCIpLmF0dHIoXCJjbGFzc1wiLCBjbGFzc1ByZWZpeCArIFwibGFiZWxcIik7XHJcbiAgICBzdmcuc2VsZWN0QWxsKFwiZy5cIiArIGNsYXNzUHJlZml4ICsgXCJjZWxsIHRleHRcIikuZGF0YShsYWJlbHMpLnRleHQodGhpcy5kM19pZGVudGl0eSk7XHJcbiAgfSxcclxuXHJcbiAgZDNfY2FsY1R5cGU6IGZ1bmN0aW9uIChzY2FsZSwgYXNjZW5kaW5nLCBjZWxscywgbGFiZWxzLCBsYWJlbEZvcm1hdCwgbGFiZWxEZWxpbWl0ZXIpe1xyXG4gICAgdmFyIHR5cGUgPSBzY2FsZS50aWNrcyA/XHJcbiAgICAgICAgICAgIHRoaXMuZDNfbGluZWFyTGVnZW5kKHNjYWxlLCBjZWxscywgbGFiZWxGb3JtYXQpIDogc2NhbGUuaW52ZXJ0RXh0ZW50ID9cclxuICAgICAgICAgICAgdGhpcy5kM19xdWFudExlZ2VuZChzY2FsZSwgbGFiZWxGb3JtYXQsIGxhYmVsRGVsaW1pdGVyKSA6IHRoaXMuZDNfb3JkaW5hbExlZ2VuZChzY2FsZSk7XHJcblxyXG4gICAgdHlwZS5sYWJlbHMgPSB0aGlzLmQzX21lcmdlTGFiZWxzKHR5cGUubGFiZWxzLCBsYWJlbHMpO1xyXG5cclxuICAgIGlmIChhc2NlbmRpbmcpIHtcclxuICAgICAgdHlwZS5sYWJlbHMgPSB0aGlzLmQzX3JldmVyc2UodHlwZS5sYWJlbHMpO1xyXG4gICAgICB0eXBlLmRhdGEgPSB0aGlzLmQzX3JldmVyc2UodHlwZS5kYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHlwZTtcclxuICB9LFxyXG5cclxuICBkM19yZXZlcnNlOiBmdW5jdGlvbihhcnIpIHtcclxuICAgIHZhciBtaXJyb3IgPSBbXTtcclxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gYXJyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICBtaXJyb3JbaV0gPSBhcnJbbC1pLTFdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG1pcnJvcjtcclxuICB9LFxyXG5cclxuICBkM19wbGFjZW1lbnQ6IGZ1bmN0aW9uIChvcmllbnQsIGNlbGwsIGNlbGxUcmFucywgdGV4dCwgdGV4dFRyYW5zLCBsYWJlbEFsaWduKSB7XHJcbiAgICBjZWxsLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgY2VsbFRyYW5zKTtcclxuICAgIHRleHQuYXR0cihcInRyYW5zZm9ybVwiLCB0ZXh0VHJhbnMpO1xyXG4gICAgaWYgKG9yaWVudCA9PT0gXCJob3Jpem9udGFsXCIpe1xyXG4gICAgICB0ZXh0LnN0eWxlKFwidGV4dC1hbmNob3JcIiwgbGFiZWxBbGlnbik7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZDNfYWRkRXZlbnRzOiBmdW5jdGlvbihjZWxscywgZGlzcGF0Y2hlcil7XHJcbiAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICBjZWxscy5vbihcIm1vdXNlb3Zlci5sZWdlbmRcIiwgZnVuY3Rpb24gKGQpIHsgXy5kM19jZWxsT3ZlcihkaXNwYXRjaGVyLCBkLCB0aGlzKTsgfSlcclxuICAgICAgICAgIC5vbihcIm1vdXNlb3V0LmxlZ2VuZFwiLCBmdW5jdGlvbiAoZCkgeyBfLmQzX2NlbGxPdXQoZGlzcGF0Y2hlciwgZCwgdGhpcyk7IH0pXHJcbiAgICAgICAgICAub24oXCJjbGljay5sZWdlbmRcIiwgZnVuY3Rpb24gKGQpIHsgXy5kM19jZWxsQ2xpY2soZGlzcGF0Y2hlciwgZCwgdGhpcyk7IH0pO1xyXG4gIH0sXHJcblxyXG4gIGQzX2NlbGxPdmVyOiBmdW5jdGlvbihjZWxsRGlzcGF0Y2hlciwgZCwgb2JqKXtcclxuICAgIGNlbGxEaXNwYXRjaGVyLmNlbGxvdmVyLmNhbGwob2JqLCBkKTtcclxuICB9LFxyXG5cclxuICBkM19jZWxsT3V0OiBmdW5jdGlvbihjZWxsRGlzcGF0Y2hlciwgZCwgb2JqKXtcclxuICAgIGNlbGxEaXNwYXRjaGVyLmNlbGxvdXQuY2FsbChvYmosIGQpO1xyXG4gIH0sXHJcblxyXG4gIGQzX2NlbGxDbGljazogZnVuY3Rpb24oY2VsbERpc3BhdGNoZXIsIGQsIG9iail7XHJcbiAgICBjZWxsRGlzcGF0Y2hlci5jZWxsY2xpY2suY2FsbChvYmosIGQpO1xyXG4gIH0sXHJcblxyXG4gIGQzX3RpdGxlOiBmdW5jdGlvbihzdmcsIGNlbGxzU3ZnLCB0aXRsZSwgY2xhc3NQcmVmaXgpe1xyXG4gICAgaWYgKHRpdGxlICE9PSBcIlwiKXtcclxuXHJcbiAgICAgIHZhciB0aXRsZVRleHQgPSBzdmcuc2VsZWN0QWxsKCd0ZXh0LicgKyBjbGFzc1ByZWZpeCArICdsZWdlbmRUaXRsZScpO1xyXG5cclxuICAgICAgdGl0bGVUZXh0LmRhdGEoW3RpdGxlXSlcclxuICAgICAgICAuZW50ZXIoKVxyXG4gICAgICAgIC5hcHBlbmQoJ3RleHQnKVxyXG4gICAgICAgIC5hdHRyKCdjbGFzcycsIGNsYXNzUHJlZml4ICsgJ2xlZ2VuZFRpdGxlJyk7XHJcblxyXG4gICAgICAgIHN2Zy5zZWxlY3RBbGwoJ3RleHQuJyArIGNsYXNzUHJlZml4ICsgJ2xlZ2VuZFRpdGxlJylcclxuICAgICAgICAgICAgLnRleHQodGl0bGUpXHJcblxyXG4gICAgICB2YXIgeU9mZnNldCA9IHN2Zy5zZWxlY3QoJy4nICsgY2xhc3NQcmVmaXggKyAnbGVnZW5kVGl0bGUnKVxyXG4gICAgICAgICAgLm1hcChmdW5jdGlvbihkKSB7IHJldHVybiBkWzBdLmdldEJCb3goKS5oZWlnaHR9KVswXSxcclxuICAgICAgeE9mZnNldCA9IC1jZWxsc1N2Zy5tYXAoZnVuY3Rpb24oZCkgeyByZXR1cm4gZFswXS5nZXRCQm94KCkueH0pWzBdO1xyXG5cclxuICAgICAgY2VsbHNTdmcuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgeE9mZnNldCArICcsJyArICh5T2Zmc2V0ICsgMTApICsgJyknKTtcclxuXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsInZhciBoZWxwZXIgPSByZXF1aXJlKCcuL2xlZ2VuZCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAgZnVuY3Rpb24oKXtcclxuXHJcbiAgdmFyIHNjYWxlID0gZDMuc2NhbGUubGluZWFyKCksXHJcbiAgICBzaGFwZSA9IFwicmVjdFwiLFxyXG4gICAgc2hhcGVXaWR0aCA9IDE1LFxyXG4gICAgc2hhcGVQYWRkaW5nID0gMixcclxuICAgIGNlbGxzID0gWzVdLFxyXG4gICAgbGFiZWxzID0gW10sXHJcbiAgICB1c2VTdHJva2UgPSBmYWxzZSxcclxuICAgIGNsYXNzUHJlZml4ID0gXCJcIixcclxuICAgIHRpdGxlID0gXCJcIixcclxuICAgIGxhYmVsRm9ybWF0ID0gZDMuZm9ybWF0KFwiLjAxZlwiKSxcclxuICAgIGxhYmVsT2Zmc2V0ID0gMTAsXHJcbiAgICBsYWJlbEFsaWduID0gXCJtaWRkbGVcIixcclxuICAgIGxhYmVsRGVsaW1pdGVyID0gXCJ0b1wiLFxyXG4gICAgb3JpZW50ID0gXCJ2ZXJ0aWNhbFwiLFxyXG4gICAgYXNjZW5kaW5nID0gZmFsc2UsXHJcbiAgICBwYXRoLFxyXG4gICAgbGVnZW5kRGlzcGF0Y2hlciA9IGQzLmRpc3BhdGNoKFwiY2VsbG92ZXJcIiwgXCJjZWxsb3V0XCIsIFwiY2VsbGNsaWNrXCIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGxlZ2VuZChzdmcpe1xyXG5cclxuICAgICAgdmFyIHR5cGUgPSBoZWxwZXIuZDNfY2FsY1R5cGUoc2NhbGUsIGFzY2VuZGluZywgY2VsbHMsIGxhYmVscywgbGFiZWxGb3JtYXQsIGxhYmVsRGVsaW1pdGVyKSxcclxuICAgICAgICBsZWdlbmRHID0gc3ZnLnNlbGVjdEFsbCgnZycpLmRhdGEoW3NjYWxlXSk7XHJcblxyXG4gICAgICBsZWdlbmRHLmVudGVyKCkuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCBjbGFzc1ByZWZpeCArICdsZWdlbmRDZWxscycpO1xyXG5cclxuXHJcbiAgICAgIHZhciBjZWxsID0gbGVnZW5kRy5zZWxlY3RBbGwoXCIuXCIgKyBjbGFzc1ByZWZpeCArIFwiY2VsbFwiKS5kYXRhKHR5cGUuZGF0YSksXHJcbiAgICAgICAgY2VsbEVudGVyID0gY2VsbC5lbnRlcigpLmFwcGVuZChcImdcIiwgXCIuY2VsbFwiKS5hdHRyKFwiY2xhc3NcIiwgY2xhc3NQcmVmaXggKyBcImNlbGxcIikuc3R5bGUoXCJvcGFjaXR5XCIsIDFlLTYpLFxyXG4gICAgICAgIHNoYXBlRW50ZXIgPSBjZWxsRW50ZXIuYXBwZW5kKHNoYXBlKS5hdHRyKFwiY2xhc3NcIiwgY2xhc3NQcmVmaXggKyBcInN3YXRjaFwiKSxcclxuICAgICAgICBzaGFwZXMgPSBjZWxsLnNlbGVjdChcImcuXCIgKyBjbGFzc1ByZWZpeCArIFwiY2VsbCBcIiArIHNoYXBlKTtcclxuXHJcbiAgICAgIC8vYWRkIGV2ZW50IGhhbmRsZXJzXHJcbiAgICAgIGhlbHBlci5kM19hZGRFdmVudHMoY2VsbEVudGVyLCBsZWdlbmREaXNwYXRjaGVyKTtcclxuXHJcbiAgICAgIGNlbGwuZXhpdCgpLnRyYW5zaXRpb24oKS5zdHlsZShcIm9wYWNpdHlcIiwgMCkucmVtb3ZlKCk7XHJcblxyXG4gICAgICAvL2NyZWF0ZXMgc2hhcGVcclxuICAgICAgaWYgKHNoYXBlID09PSBcImxpbmVcIil7XHJcbiAgICAgICAgaGVscGVyLmQzX2RyYXdTaGFwZXMoc2hhcGUsIHNoYXBlcywgMCwgc2hhcGVXaWR0aCk7XHJcbiAgICAgICAgc2hhcGVzLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgdHlwZS5mZWF0dXJlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBoZWxwZXIuZDNfZHJhd1NoYXBlcyhzaGFwZSwgc2hhcGVzLCB0eXBlLmZlYXR1cmUsIHR5cGUuZmVhdHVyZSwgdHlwZS5mZWF0dXJlLCBwYXRoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaGVscGVyLmQzX2FkZFRleHQobGVnZW5kRywgY2VsbEVudGVyLCB0eXBlLmxhYmVscywgY2xhc3NQcmVmaXgpXHJcblxyXG4gICAgICAvL3NldHMgcGxhY2VtZW50XHJcbiAgICAgIHZhciB0ZXh0ID0gY2VsbC5zZWxlY3QoXCJ0ZXh0XCIpLFxyXG4gICAgICAgIHNoYXBlU2l6ZSA9IHNoYXBlc1swXS5tYXAoXHJcbiAgICAgICAgICBmdW5jdGlvbihkLCBpKXtcclxuICAgICAgICAgICAgdmFyIGJib3ggPSBkLmdldEJCb3goKVxyXG4gICAgICAgICAgICB2YXIgc3Ryb2tlID0gc2NhbGUodHlwZS5kYXRhW2ldKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzaGFwZSA9PT0gXCJsaW5lXCIgJiYgb3JpZW50ID09PSBcImhvcml6b250YWxcIikge1xyXG4gICAgICAgICAgICAgIGJib3guaGVpZ2h0ID0gYmJveC5oZWlnaHQgKyBzdHJva2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2hhcGUgPT09IFwibGluZVwiICYmIG9yaWVudCA9PT0gXCJ2ZXJ0aWNhbFwiKXtcclxuICAgICAgICAgICAgICBiYm94LndpZHRoID0gYmJveC53aWR0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGJib3g7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB2YXIgbWF4SCA9IGQzLm1heChzaGFwZVNpemUsIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC5oZWlnaHQgKyBkLnk7IH0pLFxyXG4gICAgICBtYXhXID0gZDMubWF4KHNoYXBlU2l6ZSwgZnVuY3Rpb24oZCl7IHJldHVybiBkLndpZHRoICsgZC54OyB9KTtcclxuXHJcbiAgICAgIHZhciBjZWxsVHJhbnMsXHJcbiAgICAgIHRleHRUcmFucyxcclxuICAgICAgdGV4dEFsaWduID0gKGxhYmVsQWxpZ24gPT0gXCJzdGFydFwiKSA/IDAgOiAobGFiZWxBbGlnbiA9PSBcIm1pZGRsZVwiKSA/IDAuNSA6IDE7XHJcblxyXG4gICAgICAvL3Bvc2l0aW9ucyBjZWxscyBhbmQgdGV4dFxyXG4gICAgICBpZiAob3JpZW50ID09PSBcInZlcnRpY2FsXCIpe1xyXG5cclxuICAgICAgICBjZWxsVHJhbnMgPSBmdW5jdGlvbihkLGkpIHtcclxuICAgICAgICAgICAgdmFyIGhlaWdodCA9IGQzLnN1bShzaGFwZVNpemUuc2xpY2UoMCwgaSArIDEgKSwgZnVuY3Rpb24oZCl7IHJldHVybiBkLmhlaWdodDsgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZSgwLCBcIiArIChoZWlnaHQgKyBpKnNoYXBlUGFkZGluZykgKyBcIilcIjsgfTtcclxuXHJcbiAgICAgICAgdGV4dFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIChtYXhXICsgbGFiZWxPZmZzZXQpICsgXCIsXCIgK1xyXG4gICAgICAgICAgKHNoYXBlU2l6ZVtpXS55ICsgc2hhcGVTaXplW2ldLmhlaWdodC8yICsgNSkgKyBcIilcIjsgfTtcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAob3JpZW50ID09PSBcImhvcml6b250YWxcIil7XHJcbiAgICAgICAgY2VsbFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7XHJcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IGQzLnN1bShzaGFwZVNpemUuc2xpY2UoMCwgaSArIDEgKSwgZnVuY3Rpb24oZCl7IHJldHVybiBkLndpZHRoOyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKHdpZHRoICsgaSpzaGFwZVBhZGRpbmcpICsgXCIsMClcIjsgfTtcclxuXHJcbiAgICAgICAgdGV4dFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIChzaGFwZVNpemVbaV0ud2lkdGgqdGV4dEFsaWduICArIHNoYXBlU2l6ZVtpXS54KSArIFwiLFwiICtcclxuICAgICAgICAgICAgICAobWF4SCArIGxhYmVsT2Zmc2V0ICkgKyBcIilcIjsgfTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaGVscGVyLmQzX3BsYWNlbWVudChvcmllbnQsIGNlbGwsIGNlbGxUcmFucywgdGV4dCwgdGV4dFRyYW5zLCBsYWJlbEFsaWduKTtcclxuICAgICAgaGVscGVyLmQzX3RpdGxlKHN2ZywgbGVnZW5kRywgdGl0bGUsIGNsYXNzUHJlZml4KTtcclxuXHJcbiAgICAgIGNlbGwudHJhbnNpdGlvbigpLnN0eWxlKFwib3BhY2l0eVwiLCAxKTtcclxuXHJcbiAgICB9XHJcblxyXG4gIGxlZ2VuZC5zY2FsZSA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNjYWxlO1xyXG4gICAgc2NhbGUgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuY2VsbHMgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBjZWxscztcclxuICAgIGlmIChfLmxlbmd0aCA+IDEgfHwgXyA+PSAyICl7XHJcbiAgICAgIGNlbGxzID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcblxyXG4gIGxlZ2VuZC5zaGFwZSA9IGZ1bmN0aW9uKF8sIGQpIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlO1xyXG4gICAgaWYgKF8gPT0gXCJyZWN0XCIgfHwgXyA9PSBcImNpcmNsZVwiIHx8IF8gPT0gXCJsaW5lXCIgKXtcclxuICAgICAgc2hhcGUgPSBfO1xyXG4gICAgICBwYXRoID0gZDtcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlV2lkdGggPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZVdpZHRoO1xyXG4gICAgc2hhcGVXaWR0aCA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuc2hhcGVQYWRkaW5nID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGVQYWRkaW5nO1xyXG4gICAgc2hhcGVQYWRkaW5nID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbHMgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbHM7XHJcbiAgICBsYWJlbHMgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxBbGlnbiA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsQWxpZ247XHJcbiAgICBpZiAoXyA9PSBcInN0YXJ0XCIgfHwgXyA9PSBcImVuZFwiIHx8IF8gPT0gXCJtaWRkbGVcIikge1xyXG4gICAgICBsYWJlbEFsaWduID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsRm9ybWF0ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxGb3JtYXQ7XHJcbiAgICBsYWJlbEZvcm1hdCA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbE9mZnNldCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsT2Zmc2V0O1xyXG4gICAgbGFiZWxPZmZzZXQgPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsRGVsaW1pdGVyID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxEZWxpbWl0ZXI7XHJcbiAgICBsYWJlbERlbGltaXRlciA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5vcmllbnQgPSBmdW5jdGlvbihfKXtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIG9yaWVudDtcclxuICAgIF8gPSBfLnRvTG93ZXJDYXNlKCk7XHJcbiAgICBpZiAoXyA9PSBcImhvcml6b250YWxcIiB8fCBfID09IFwidmVydGljYWxcIikge1xyXG4gICAgICBvcmllbnQgPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuYXNjZW5kaW5nID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gYXNjZW5kaW5nO1xyXG4gICAgYXNjZW5kaW5nID0gISFfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuY2xhc3NQcmVmaXggPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBjbGFzc1ByZWZpeDtcclxuICAgIGNsYXNzUHJlZml4ID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnRpdGxlID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdGl0bGU7XHJcbiAgICB0aXRsZSA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGQzLnJlYmluZChsZWdlbmQsIGxlZ2VuZERpc3BhdGNoZXIsIFwib25cIik7XHJcblxyXG4gIHJldHVybiBsZWdlbmQ7XHJcblxyXG59O1xyXG4iLCJ2YXIgaGVscGVyID0gcmVxdWlyZSgnLi9sZWdlbmQnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgdmFyIHNjYWxlID0gZDMuc2NhbGUubGluZWFyKCksXHJcbiAgICBzaGFwZSA9IFwicGF0aFwiLFxyXG4gICAgc2hhcGVXaWR0aCA9IDE1LFxyXG4gICAgc2hhcGVIZWlnaHQgPSAxNSxcclxuICAgIHNoYXBlUmFkaXVzID0gMTAsXHJcbiAgICBzaGFwZVBhZGRpbmcgPSA1LFxyXG4gICAgY2VsbHMgPSBbNV0sXHJcbiAgICBsYWJlbHMgPSBbXSxcclxuICAgIGNsYXNzUHJlZml4ID0gXCJcIixcclxuICAgIHVzZUNsYXNzID0gZmFsc2UsXHJcbiAgICB0aXRsZSA9IFwiXCIsXHJcbiAgICBsYWJlbEZvcm1hdCA9IGQzLmZvcm1hdChcIi4wMWZcIiksXHJcbiAgICBsYWJlbEFsaWduID0gXCJtaWRkbGVcIixcclxuICAgIGxhYmVsT2Zmc2V0ID0gMTAsXHJcbiAgICBsYWJlbERlbGltaXRlciA9IFwidG9cIixcclxuICAgIG9yaWVudCA9IFwidmVydGljYWxcIixcclxuICAgIGFzY2VuZGluZyA9IGZhbHNlLFxyXG4gICAgbGVnZW5kRGlzcGF0Y2hlciA9IGQzLmRpc3BhdGNoKFwiY2VsbG92ZXJcIiwgXCJjZWxsb3V0XCIsIFwiY2VsbGNsaWNrXCIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGxlZ2VuZChzdmcpe1xyXG5cclxuICAgICAgdmFyIHR5cGUgPSBoZWxwZXIuZDNfY2FsY1R5cGUoc2NhbGUsIGFzY2VuZGluZywgY2VsbHMsIGxhYmVscywgbGFiZWxGb3JtYXQsIGxhYmVsRGVsaW1pdGVyKSxcclxuICAgICAgICBsZWdlbmRHID0gc3ZnLnNlbGVjdEFsbCgnZycpLmRhdGEoW3NjYWxlXSk7XHJcblxyXG4gICAgICBsZWdlbmRHLmVudGVyKCkuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCBjbGFzc1ByZWZpeCArICdsZWdlbmRDZWxscycpO1xyXG5cclxuICAgICAgdmFyIGNlbGwgPSBsZWdlbmRHLnNlbGVjdEFsbChcIi5cIiArIGNsYXNzUHJlZml4ICsgXCJjZWxsXCIpLmRhdGEodHlwZS5kYXRhKSxcclxuICAgICAgICBjZWxsRW50ZXIgPSBjZWxsLmVudGVyKCkuYXBwZW5kKFwiZ1wiLCBcIi5jZWxsXCIpLmF0dHIoXCJjbGFzc1wiLCBjbGFzc1ByZWZpeCArIFwiY2VsbFwiKS5zdHlsZShcIm9wYWNpdHlcIiwgMWUtNiksXHJcbiAgICAgICAgc2hhcGVFbnRlciA9IGNlbGxFbnRlci5hcHBlbmQoc2hhcGUpLmF0dHIoXCJjbGFzc1wiLCBjbGFzc1ByZWZpeCArIFwic3dhdGNoXCIpLFxyXG4gICAgICAgIHNoYXBlcyA9IGNlbGwuc2VsZWN0KFwiZy5cIiArIGNsYXNzUHJlZml4ICsgXCJjZWxsIFwiICsgc2hhcGUpO1xyXG5cclxuICAgICAgLy9hZGQgZXZlbnQgaGFuZGxlcnNcclxuICAgICAgaGVscGVyLmQzX2FkZEV2ZW50cyhjZWxsRW50ZXIsIGxlZ2VuZERpc3BhdGNoZXIpO1xyXG5cclxuICAgICAgLy9yZW1vdmUgb2xkIHNoYXBlc1xyXG4gICAgICBjZWxsLmV4aXQoKS50cmFuc2l0aW9uKCkuc3R5bGUoXCJvcGFjaXR5XCIsIDApLnJlbW92ZSgpO1xyXG5cclxuICAgICAgaGVscGVyLmQzX2RyYXdTaGFwZXMoc2hhcGUsIHNoYXBlcywgc2hhcGVIZWlnaHQsIHNoYXBlV2lkdGgsIHNoYXBlUmFkaXVzLCB0eXBlLmZlYXR1cmUpO1xyXG4gICAgICBoZWxwZXIuZDNfYWRkVGV4dChsZWdlbmRHLCBjZWxsRW50ZXIsIHR5cGUubGFiZWxzLCBjbGFzc1ByZWZpeClcclxuXHJcbiAgICAgIC8vIHNldHMgcGxhY2VtZW50XHJcbiAgICAgIHZhciB0ZXh0ID0gY2VsbC5zZWxlY3QoXCJ0ZXh0XCIpLFxyXG4gICAgICAgIHNoYXBlU2l6ZSA9IHNoYXBlc1swXS5tYXAoIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC5nZXRCQm94KCk7IH0pO1xyXG5cclxuICAgICAgdmFyIG1heEggPSBkMy5tYXgoc2hhcGVTaXplLCBmdW5jdGlvbihkKXsgcmV0dXJuIGQuaGVpZ2h0OyB9KSxcclxuICAgICAgbWF4VyA9IGQzLm1heChzaGFwZVNpemUsIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC53aWR0aDsgfSk7XHJcblxyXG4gICAgICB2YXIgY2VsbFRyYW5zLFxyXG4gICAgICB0ZXh0VHJhbnMsXHJcbiAgICAgIHRleHRBbGlnbiA9IChsYWJlbEFsaWduID09IFwic3RhcnRcIikgPyAwIDogKGxhYmVsQWxpZ24gPT0gXCJtaWRkbGVcIikgPyAwLjUgOiAxO1xyXG5cclxuICAgICAgLy9wb3NpdGlvbnMgY2VsbHMgYW5kIHRleHRcclxuICAgICAgaWYgKG9yaWVudCA9PT0gXCJ2ZXJ0aWNhbFwiKXtcclxuICAgICAgICBjZWxsVHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKDAsIFwiICsgKGkgKiAobWF4SCArIHNoYXBlUGFkZGluZykpICsgXCIpXCI7IH07XHJcbiAgICAgICAgdGV4dFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIChtYXhXICsgbGFiZWxPZmZzZXQpICsgXCIsXCIgK1xyXG4gICAgICAgICAgICAgIChzaGFwZVNpemVbaV0ueSArIHNoYXBlU2l6ZVtpXS5oZWlnaHQvMiArIDUpICsgXCIpXCI7IH07XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKG9yaWVudCA9PT0gXCJob3Jpem9udGFsXCIpe1xyXG4gICAgICAgIGNlbGxUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAoaSAqIChtYXhXICsgc2hhcGVQYWRkaW5nKSkgKyBcIiwwKVwiOyB9O1xyXG4gICAgICAgIHRleHRUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAoc2hhcGVTaXplW2ldLndpZHRoKnRleHRBbGlnbiAgKyBzaGFwZVNpemVbaV0ueCkgKyBcIixcIiArXHJcbiAgICAgICAgICAgICAgKG1heEggKyBsYWJlbE9mZnNldCApICsgXCIpXCI7IH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGhlbHBlci5kM19wbGFjZW1lbnQob3JpZW50LCBjZWxsLCBjZWxsVHJhbnMsIHRleHQsIHRleHRUcmFucywgbGFiZWxBbGlnbik7XHJcbiAgICAgIGhlbHBlci5kM190aXRsZShzdmcsIGxlZ2VuZEcsIHRpdGxlLCBjbGFzc1ByZWZpeCk7XHJcbiAgICAgIGNlbGwudHJhbnNpdGlvbigpLnN0eWxlKFwib3BhY2l0eVwiLCAxKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICBsZWdlbmQuc2NhbGUgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzY2FsZTtcclxuICAgIHNjYWxlID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmNlbGxzID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY2VsbHM7XHJcbiAgICBpZiAoXy5sZW5ndGggPiAxIHx8IF8gPj0gMiApe1xyXG4gICAgICBjZWxscyA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5zaGFwZVBhZGRpbmcgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZVBhZGRpbmc7XHJcbiAgICBzaGFwZVBhZGRpbmcgPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVscyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVscztcclxuICAgIGxhYmVscyA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbEFsaWduID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxBbGlnbjtcclxuICAgIGlmIChfID09IFwic3RhcnRcIiB8fCBfID09IFwiZW5kXCIgfHwgXyA9PSBcIm1pZGRsZVwiKSB7XHJcbiAgICAgIGxhYmVsQWxpZ24gPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxGb3JtYXQgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbEZvcm1hdDtcclxuICAgIGxhYmVsRm9ybWF0ID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsT2Zmc2V0ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxPZmZzZXQ7XHJcbiAgICBsYWJlbE9mZnNldCA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxEZWxpbWl0ZXIgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbERlbGltaXRlcjtcclxuICAgIGxhYmVsRGVsaW1pdGVyID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLm9yaWVudCA9IGZ1bmN0aW9uKF8pe1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gb3JpZW50O1xyXG4gICAgXyA9IF8udG9Mb3dlckNhc2UoKTtcclxuICAgIGlmIChfID09IFwiaG9yaXpvbnRhbFwiIHx8IF8gPT0gXCJ2ZXJ0aWNhbFwiKSB7XHJcbiAgICAgIG9yaWVudCA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5hc2NlbmRpbmcgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBhc2NlbmRpbmc7XHJcbiAgICBhc2NlbmRpbmcgPSAhIV87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5jbGFzc1ByZWZpeCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGNsYXNzUHJlZml4O1xyXG4gICAgY2xhc3NQcmVmaXggPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQudGl0bGUgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB0aXRsZTtcclxuICAgIHRpdGxlID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgZDMucmViaW5kKGxlZ2VuZCwgbGVnZW5kRGlzcGF0Y2hlciwgXCJvblwiKTtcclxuXHJcbiAgcmV0dXJuIGxlZ2VuZDtcclxuXHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbi8qKlxyXG4gKiAqKltHYXVzc2lhbiBlcnJvciBmdW5jdGlvbl0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9FcnJvcl9mdW5jdGlvbikqKlxyXG4gKlxyXG4gKiBUaGUgYGVycm9yRnVuY3Rpb24oeC8oc2QgKiBNYXRoLnNxcnQoMikpKWAgaXMgdGhlIHByb2JhYmlsaXR5IHRoYXQgYSB2YWx1ZSBpbiBhXHJcbiAqIG5vcm1hbCBkaXN0cmlidXRpb24gd2l0aCBzdGFuZGFyZCBkZXZpYXRpb24gc2QgaXMgd2l0aGluIHggb2YgdGhlIG1lYW4uXHJcbiAqXHJcbiAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyBhIG51bWVyaWNhbCBhcHByb3hpbWF0aW9uIHRvIHRoZSBleGFjdCB2YWx1ZS5cclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IHggaW5wdXRcclxuICogQHJldHVybiB7bnVtYmVyfSBlcnJvciBlc3RpbWF0aW9uXHJcbiAqIEBleGFtcGxlXHJcbiAqIGVycm9yRnVuY3Rpb24oMSk7IC8vPSAwLjg0MjdcclxuICovXHJcbmZ1bmN0aW9uIGVycm9yRnVuY3Rpb24oeC8qOiBudW1iZXIgKi8pLyo6IG51bWJlciAqLyB7XHJcbiAgICB2YXIgdCA9IDEgLyAoMSArIDAuNSAqIE1hdGguYWJzKHgpKTtcclxuICAgIHZhciB0YXUgPSB0ICogTWF0aC5leHAoLU1hdGgucG93KHgsIDIpIC1cclxuICAgICAgICAxLjI2NTUxMjIzICtcclxuICAgICAgICAxLjAwMDAyMzY4ICogdCArXHJcbiAgICAgICAgMC4zNzQwOTE5NiAqIE1hdGgucG93KHQsIDIpICtcclxuICAgICAgICAwLjA5Njc4NDE4ICogTWF0aC5wb3codCwgMykgLVxyXG4gICAgICAgIDAuMTg2Mjg4MDYgKiBNYXRoLnBvdyh0LCA0KSArXHJcbiAgICAgICAgMC4yNzg4NjgwNyAqIE1hdGgucG93KHQsIDUpIC1cclxuICAgICAgICAxLjEzNTIwMzk4ICogTWF0aC5wb3codCwgNikgK1xyXG4gICAgICAgIDEuNDg4NTE1ODcgKiBNYXRoLnBvdyh0LCA3KSAtXHJcbiAgICAgICAgMC44MjIxNTIyMyAqIE1hdGgucG93KHQsIDgpICtcclxuICAgICAgICAwLjE3MDg3Mjc3ICogTWF0aC5wb3codCwgOSkpO1xyXG4gICAgaWYgKHggPj0gMCkge1xyXG4gICAgICAgIHJldHVybiAxIC0gdGF1O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGF1IC0gMTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlcnJvckZ1bmN0aW9uO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG4vKipcclxuICogW1NpbXBsZSBsaW5lYXIgcmVncmVzc2lvbl0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TaW1wbGVfbGluZWFyX3JlZ3Jlc3Npb24pXHJcbiAqIGlzIGEgc2ltcGxlIHdheSB0byBmaW5kIGEgZml0dGVkIGxpbmVcclxuICogYmV0d2VlbiBhIHNldCBvZiBjb29yZGluYXRlcy4gVGhpcyBhbGdvcml0aG0gZmluZHMgdGhlIHNsb3BlIGFuZCB5LWludGVyY2VwdCBvZiBhIHJlZ3Jlc3Npb24gbGluZVxyXG4gKiB1c2luZyB0aGUgbGVhc3Qgc3VtIG9mIHNxdWFyZXMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8QXJyYXk8bnVtYmVyPj59IGRhdGEgYW4gYXJyYXkgb2YgdHdvLWVsZW1lbnQgb2YgYXJyYXlzLFxyXG4gKiBsaWtlIGBbWzAsIDFdLCBbMiwgM11dYFxyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBvYmplY3QgY29udGFpbmluZyBzbG9wZSBhbmQgaW50ZXJzZWN0IG9mIHJlZ3Jlc3Npb24gbGluZVxyXG4gKiBAZXhhbXBsZVxyXG4gKiBsaW5lYXJSZWdyZXNzaW9uKFtbMCwgMF0sIFsxLCAxXV0pOyAvLyB7IG06IDEsIGI6IDAgfVxyXG4gKi9cclxuZnVuY3Rpb24gbGluZWFyUmVncmVzc2lvbihkYXRhLyo6IEFycmF5PEFycmF5PG51bWJlcj4+ICovKS8qOiB7IG06IG51bWJlciwgYjogbnVtYmVyIH0gKi8ge1xyXG5cclxuICAgIHZhciBtLCBiO1xyXG5cclxuICAgIC8vIFN0b3JlIGRhdGEgbGVuZ3RoIGluIGEgbG9jYWwgdmFyaWFibGUgdG8gcmVkdWNlXHJcbiAgICAvLyByZXBlYXRlZCBvYmplY3QgcHJvcGVydHkgbG9va3Vwc1xyXG4gICAgdmFyIGRhdGFMZW5ndGggPSBkYXRhLmxlbmd0aDtcclxuXHJcbiAgICAvL2lmIHRoZXJlJ3Mgb25seSBvbmUgcG9pbnQsIGFyYml0cmFyaWx5IGNob29zZSBhIHNsb3BlIG9mIDBcclxuICAgIC8vYW5kIGEgeS1pbnRlcmNlcHQgb2Ygd2hhdGV2ZXIgdGhlIHkgb2YgdGhlIGluaXRpYWwgcG9pbnQgaXNcclxuICAgIGlmIChkYXRhTGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgbSA9IDA7XHJcbiAgICAgICAgYiA9IGRhdGFbMF1bMV07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIEluaXRpYWxpemUgb3VyIHN1bXMgYW5kIHNjb3BlIHRoZSBgbWAgYW5kIGBiYFxyXG4gICAgICAgIC8vIHZhcmlhYmxlcyB0aGF0IGRlZmluZSB0aGUgbGluZS5cclxuICAgICAgICB2YXIgc3VtWCA9IDAsIHN1bVkgPSAwLFxyXG4gICAgICAgICAgICBzdW1YWCA9IDAsIHN1bVhZID0gMDtcclxuXHJcbiAgICAgICAgLy8gVXNlIGxvY2FsIHZhcmlhYmxlcyB0byBncmFiIHBvaW50IHZhbHVlc1xyXG4gICAgICAgIC8vIHdpdGggbWluaW1hbCBvYmplY3QgcHJvcGVydHkgbG9va3Vwc1xyXG4gICAgICAgIHZhciBwb2ludCwgeCwgeTtcclxuXHJcbiAgICAgICAgLy8gR2F0aGVyIHRoZSBzdW0gb2YgYWxsIHggdmFsdWVzLCB0aGUgc3VtIG9mIGFsbFxyXG4gICAgICAgIC8vIHkgdmFsdWVzLCBhbmQgdGhlIHN1bSBvZiB4XjIgYW5kICh4KnkpIGZvciBlYWNoXHJcbiAgICAgICAgLy8gdmFsdWUuXHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBJbiBtYXRoIG5vdGF0aW9uLCB0aGVzZSB3b3VsZCBiZSBTU194LCBTU195LCBTU194eCwgYW5kIFNTX3h5XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcG9pbnQgPSBkYXRhW2ldO1xyXG4gICAgICAgICAgICB4ID0gcG9pbnRbMF07XHJcbiAgICAgICAgICAgIHkgPSBwb2ludFsxXTtcclxuXHJcbiAgICAgICAgICAgIHN1bVggKz0geDtcclxuICAgICAgICAgICAgc3VtWSArPSB5O1xyXG5cclxuICAgICAgICAgICAgc3VtWFggKz0geCAqIHg7XHJcbiAgICAgICAgICAgIHN1bVhZICs9IHggKiB5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gYG1gIGlzIHRoZSBzbG9wZSBvZiB0aGUgcmVncmVzc2lvbiBsaW5lXHJcbiAgICAgICAgbSA9ICgoZGF0YUxlbmd0aCAqIHN1bVhZKSAtIChzdW1YICogc3VtWSkpIC9cclxuICAgICAgICAgICAgKChkYXRhTGVuZ3RoICogc3VtWFgpIC0gKHN1bVggKiBzdW1YKSk7XHJcblxyXG4gICAgICAgIC8vIGBiYCBpcyB0aGUgeS1pbnRlcmNlcHQgb2YgdGhlIGxpbmUuXHJcbiAgICAgICAgYiA9IChzdW1ZIC8gZGF0YUxlbmd0aCkgLSAoKG0gKiBzdW1YKSAvIGRhdGFMZW5ndGgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJldHVybiBib3RoIHZhbHVlcyBhcyBhbiBvYmplY3QuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG06IG0sXHJcbiAgICAgICAgYjogYlxyXG4gICAgfTtcclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGluZWFyUmVncmVzc2lvbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxuLyoqXHJcbiAqIEdpdmVuIHRoZSBvdXRwdXQgb2YgYGxpbmVhclJlZ3Jlc3Npb25gOiBhbiBvYmplY3RcclxuICogd2l0aCBgbWAgYW5kIGBiYCB2YWx1ZXMgaW5kaWNhdGluZyBzbG9wZSBhbmQgaW50ZXJjZXB0LFxyXG4gKiByZXNwZWN0aXZlbHksIGdlbmVyYXRlIGEgbGluZSBmdW5jdGlvbiB0aGF0IHRyYW5zbGF0ZXNcclxuICogeCB2YWx1ZXMgaW50byB5IHZhbHVlcy5cclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9IG1iIG9iamVjdCB3aXRoIGBtYCBhbmQgYGJgIG1lbWJlcnMsIHJlcHJlc2VudGluZ1xyXG4gKiBzbG9wZSBhbmQgaW50ZXJzZWN0IG9mIGRlc2lyZWQgbGluZVxyXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IG1ldGhvZCB0aGF0IGNvbXB1dGVzIHktdmFsdWUgYXQgYW55IGdpdmVuXHJcbiAqIHgtdmFsdWUgb24gdGhlIGxpbmUuXHJcbiAqIEBleGFtcGxlXHJcbiAqIHZhciBsID0gbGluZWFyUmVncmVzc2lvbkxpbmUobGluZWFyUmVncmVzc2lvbihbWzAsIDBdLCBbMSwgMV1dKSk7XHJcbiAqIGwoMCkgLy89IDBcclxuICogbCgyKSAvLz0gMlxyXG4gKi9cclxuZnVuY3Rpb24gbGluZWFyUmVncmVzc2lvbkxpbmUobWIvKjogeyBiOiBudW1iZXIsIG06IG51bWJlciB9Ki8pLyo6IEZ1bmN0aW9uICovIHtcclxuICAgIC8vIFJldHVybiBhIGZ1bmN0aW9uIHRoYXQgY29tcHV0ZXMgYSBgeWAgdmFsdWUgZm9yIGVhY2hcclxuICAgIC8vIHggdmFsdWUgaXQgaXMgZ2l2ZW4sIGJhc2VkIG9uIHRoZSB2YWx1ZXMgb2YgYGJgIGFuZCBgYWBcclxuICAgIC8vIHRoYXQgd2UganVzdCBjb21wdXRlZC5cclxuICAgIHJldHVybiBmdW5jdGlvbih4KSB7XHJcbiAgICAgICAgcmV0dXJuIG1iLmIgKyAobWIubSAqIHgpO1xyXG4gICAgfTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsaW5lYXJSZWdyZXNzaW9uTGluZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIHN1bSA9IHJlcXVpcmUoJy4vc3VtJyk7XHJcblxyXG4vKipcclxuICogVGhlIG1lYW4sIF9hbHNvIGtub3duIGFzIGF2ZXJhZ2VfLFxyXG4gKiBpcyB0aGUgc3VtIG9mIGFsbCB2YWx1ZXMgb3ZlciB0aGUgbnVtYmVyIG9mIHZhbHVlcy5cclxuICogVGhpcyBpcyBhIFttZWFzdXJlIG9mIGNlbnRyYWwgdGVuZGVuY3ldKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0NlbnRyYWxfdGVuZGVuY3kpOlxyXG4gKiBhIG1ldGhvZCBvZiBmaW5kaW5nIGEgdHlwaWNhbCBvciBjZW50cmFsIHZhbHVlIG9mIGEgc2V0IG9mIG51bWJlcnMuXHJcbiAqXHJcbiAqIFRoaXMgcnVucyBvbiBgTyhuKWAsIGxpbmVhciB0aW1lIGluIHJlc3BlY3QgdG8gdGhlIGFycmF5XHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBpbnB1dCB2YWx1ZXNcclxuICogQHJldHVybnMge251bWJlcn0gbWVhblxyXG4gKiBAZXhhbXBsZVxyXG4gKiBjb25zb2xlLmxvZyhtZWFuKFswLCAxMF0pKTsgLy8gNVxyXG4gKi9cclxuZnVuY3Rpb24gbWVhbih4IC8qOiBBcnJheTxudW1iZXI+ICovKS8qOm51bWJlciovIHtcclxuICAgIC8vIFRoZSBtZWFuIG9mIG5vIG51bWJlcnMgaXMgbnVsbFxyXG4gICAgaWYgKHgubGVuZ3RoID09PSAwKSB7IHJldHVybiBOYU47IH1cclxuXHJcbiAgICByZXR1cm4gc3VtKHgpIC8geC5sZW5ndGg7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWVhbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIHNhbXBsZUNvdmFyaWFuY2UgPSByZXF1aXJlKCcuL3NhbXBsZV9jb3ZhcmlhbmNlJyk7XHJcbnZhciBzYW1wbGVTdGFuZGFyZERldmlhdGlvbiA9IHJlcXVpcmUoJy4vc2FtcGxlX3N0YW5kYXJkX2RldmlhdGlvbicpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBbY29ycmVsYXRpb25dKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ29ycmVsYXRpb25fYW5kX2RlcGVuZGVuY2UpIGlzXHJcbiAqIGEgbWVhc3VyZSBvZiBob3cgY29ycmVsYXRlZCB0d28gZGF0YXNldHMgYXJlLCBiZXR3ZWVuIC0xIGFuZCAxXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBmaXJzdCBpbnB1dFxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHkgc2Vjb25kIGlucHV0XHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHNhbXBsZSBjb3JyZWxhdGlvblxyXG4gKiBAZXhhbXBsZVxyXG4gKiB2YXIgYSA9IFsxLCAyLCAzLCA0LCA1LCA2XTtcclxuICogdmFyIGIgPSBbMiwgMiwgMywgNCwgNSwgNjBdO1xyXG4gKiBzYW1wbGVDb3JyZWxhdGlvbihhLCBiKTsgLy89IDAuNjkxXHJcbiAqL1xyXG5mdW5jdGlvbiBzYW1wbGVDb3JyZWxhdGlvbih4Lyo6IEFycmF5PG51bWJlcj4gKi8sIHkvKjogQXJyYXk8bnVtYmVyPiAqLykvKjpudW1iZXIqLyB7XHJcbiAgICB2YXIgY292ID0gc2FtcGxlQ292YXJpYW5jZSh4LCB5KSxcclxuICAgICAgICB4c3RkID0gc2FtcGxlU3RhbmRhcmREZXZpYXRpb24oeCksXHJcbiAgICAgICAgeXN0ZCA9IHNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uKHkpO1xyXG5cclxuICAgIHJldHVybiBjb3YgLyB4c3RkIC8geXN0ZDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYW1wbGVDb3JyZWxhdGlvbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIG1lYW4gPSByZXF1aXJlKCcuL21lYW4nKTtcclxuXHJcbi8qKlxyXG4gKiBbU2FtcGxlIGNvdmFyaWFuY2VdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1NhbXBsZV9tZWFuX2FuZF9zYW1wbGVDb3ZhcmlhbmNlKSBvZiB0d28gZGF0YXNldHM6XHJcbiAqIGhvdyBtdWNoIGRvIHRoZSB0d28gZGF0YXNldHMgbW92ZSB0b2dldGhlcj9cclxuICogeCBhbmQgeSBhcmUgdHdvIGRhdGFzZXRzLCByZXByZXNlbnRlZCBhcyBhcnJheXMgb2YgbnVtYmVycy5cclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGZpcnN0IGlucHV0XHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geSBzZWNvbmQgaW5wdXRcclxuICogQHJldHVybnMge251bWJlcn0gc2FtcGxlIGNvdmFyaWFuY2VcclxuICogQGV4YW1wbGVcclxuICogdmFyIHggPSBbMSwgMiwgMywgNCwgNSwgNl07XHJcbiAqIHZhciB5ID0gWzYsIDUsIDQsIDMsIDIsIDFdO1xyXG4gKiBzYW1wbGVDb3ZhcmlhbmNlKHgsIHkpOyAvLz0gLTMuNVxyXG4gKi9cclxuZnVuY3Rpb24gc2FtcGxlQ292YXJpYW5jZSh4IC8qOkFycmF5PG51bWJlcj4qLywgeSAvKjpBcnJheTxudW1iZXI+Ki8pLyo6bnVtYmVyKi8ge1xyXG5cclxuICAgIC8vIFRoZSB0d28gZGF0YXNldHMgbXVzdCBoYXZlIHRoZSBzYW1lIGxlbmd0aCB3aGljaCBtdXN0IGJlIG1vcmUgdGhhbiAxXHJcbiAgICBpZiAoeC5sZW5ndGggPD0gMSB8fCB4Lmxlbmd0aCAhPT0geS5sZW5ndGgpIHtcclxuICAgICAgICByZXR1cm4gTmFOO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGRldGVybWluZSB0aGUgbWVhbiBvZiBlYWNoIGRhdGFzZXQgc28gdGhhdCB3ZSBjYW4ganVkZ2UgZWFjaFxyXG4gICAgLy8gdmFsdWUgb2YgdGhlIGRhdGFzZXQgZmFpcmx5IGFzIHRoZSBkaWZmZXJlbmNlIGZyb20gdGhlIG1lYW4uIHRoaXNcclxuICAgIC8vIHdheSwgaWYgb25lIGRhdGFzZXQgaXMgWzEsIDIsIDNdIGFuZCBbMiwgMywgNF0sIHRoZWlyIGNvdmFyaWFuY2VcclxuICAgIC8vIGRvZXMgbm90IHN1ZmZlciBiZWNhdXNlIG9mIHRoZSBkaWZmZXJlbmNlIGluIGFic29sdXRlIHZhbHVlc1xyXG4gICAgdmFyIHhtZWFuID0gbWVhbih4KSxcclxuICAgICAgICB5bWVhbiA9IG1lYW4oeSksXHJcbiAgICAgICAgc3VtID0gMDtcclxuXHJcbiAgICAvLyBmb3IgZWFjaCBwYWlyIG9mIHZhbHVlcywgdGhlIGNvdmFyaWFuY2UgaW5jcmVhc2VzIHdoZW4gdGhlaXJcclxuICAgIC8vIGRpZmZlcmVuY2UgZnJvbSB0aGUgbWVhbiBpcyBhc3NvY2lhdGVkIC0gaWYgYm90aCBhcmUgd2VsbCBhYm92ZVxyXG4gICAgLy8gb3IgaWYgYm90aCBhcmUgd2VsbCBiZWxvd1xyXG4gICAgLy8gdGhlIG1lYW4sIHRoZSBjb3ZhcmlhbmNlIGluY3JlYXNlcyBzaWduaWZpY2FudGx5LlxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgc3VtICs9ICh4W2ldIC0geG1lYW4pICogKHlbaV0gLSB5bWVhbik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdGhpcyBpcyBCZXNzZWxzJyBDb3JyZWN0aW9uOiBhbiBhZGp1c3RtZW50IG1hZGUgdG8gc2FtcGxlIHN0YXRpc3RpY3NcclxuICAgIC8vIHRoYXQgYWxsb3dzIGZvciB0aGUgcmVkdWNlZCBkZWdyZWUgb2YgZnJlZWRvbSBlbnRhaWxlZCBpbiBjYWxjdWxhdGluZ1xyXG4gICAgLy8gdmFsdWVzIGZyb20gc2FtcGxlcyByYXRoZXIgdGhhbiBjb21wbGV0ZSBwb3B1bGF0aW9ucy5cclxuICAgIHZhciBiZXNzZWxzQ29ycmVjdGlvbiA9IHgubGVuZ3RoIC0gMTtcclxuXHJcbiAgICAvLyB0aGUgY292YXJpYW5jZSBpcyB3ZWlnaHRlZCBieSB0aGUgbGVuZ3RoIG9mIHRoZSBkYXRhc2V0cy5cclxuICAgIHJldHVybiBzdW0gLyBiZXNzZWxzQ29ycmVjdGlvbjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYW1wbGVDb3ZhcmlhbmNlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgc2FtcGxlVmFyaWFuY2UgPSByZXF1aXJlKCcuL3NhbXBsZV92YXJpYW5jZScpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBbc3RhbmRhcmQgZGV2aWF0aW9uXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1N0YW5kYXJkX2RldmlhdGlvbilcclxuICogaXMgdGhlIHNxdWFyZSByb290IG9mIHRoZSB2YXJpYW5jZS5cclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGlucHV0IGFycmF5XHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHNhbXBsZSBzdGFuZGFyZCBkZXZpYXRpb25cclxuICogQGV4YW1wbGVcclxuICogc3Muc2FtcGxlU3RhbmRhcmREZXZpYXRpb24oWzIsIDQsIDQsIDQsIDUsIDUsIDcsIDldKTtcclxuICogLy89IDIuMTM4XHJcbiAqL1xyXG5mdW5jdGlvbiBzYW1wbGVTdGFuZGFyZERldmlhdGlvbih4Lyo6QXJyYXk8bnVtYmVyPiovKS8qOm51bWJlciovIHtcclxuICAgIC8vIFRoZSBzdGFuZGFyZCBkZXZpYXRpb24gb2Ygbm8gbnVtYmVycyBpcyBudWxsXHJcbiAgICB2YXIgc2FtcGxlVmFyaWFuY2VYID0gc2FtcGxlVmFyaWFuY2UoeCk7XHJcbiAgICBpZiAoaXNOYU4oc2FtcGxlVmFyaWFuY2VYKSkgeyByZXR1cm4gTmFOOyB9XHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHNhbXBsZVZhcmlhbmNlWCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2FtcGxlU3RhbmRhcmREZXZpYXRpb247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBzdW1OdGhQb3dlckRldmlhdGlvbnMgPSByZXF1aXJlKCcuL3N1bV9udGhfcG93ZXJfZGV2aWF0aW9ucycpO1xyXG5cclxuLypcclxuICogVGhlIFtzYW1wbGUgdmFyaWFuY2VdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1ZhcmlhbmNlI1NhbXBsZV92YXJpYW5jZSlcclxuICogaXMgdGhlIHN1bSBvZiBzcXVhcmVkIGRldmlhdGlvbnMgZnJvbSB0aGUgbWVhbi4gVGhlIHNhbXBsZSB2YXJpYW5jZVxyXG4gKiBpcyBkaXN0aW5ndWlzaGVkIGZyb20gdGhlIHZhcmlhbmNlIGJ5IHRoZSB1c2FnZSBvZiBbQmVzc2VsJ3MgQ29ycmVjdGlvbl0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQmVzc2VsJ3NfY29ycmVjdGlvbik6XHJcbiAqIGluc3RlYWQgb2YgZGl2aWRpbmcgdGhlIHN1bSBvZiBzcXVhcmVkIGRldmlhdGlvbnMgYnkgdGhlIGxlbmd0aCBvZiB0aGUgaW5wdXQsXHJcbiAqIGl0IGlzIGRpdmlkZWQgYnkgdGhlIGxlbmd0aCBtaW51cyBvbmUuIFRoaXMgY29ycmVjdHMgdGhlIGJpYXMgaW4gZXN0aW1hdGluZ1xyXG4gKiBhIHZhbHVlIGZyb20gYSBzZXQgdGhhdCB5b3UgZG9uJ3Qga25vdyBpZiBmdWxsLlxyXG4gKlxyXG4gKiBSZWZlcmVuY2VzOlxyXG4gKiAqIFtXb2xmcmFtIE1hdGhXb3JsZCBvbiBTYW1wbGUgVmFyaWFuY2VdKGh0dHA6Ly9tYXRod29ybGQud29sZnJhbS5jb20vU2FtcGxlVmFyaWFuY2UuaHRtbClcclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGlucHV0IGFycmF5XHJcbiAqIEByZXR1cm4ge251bWJlcn0gc2FtcGxlIHZhcmlhbmNlXHJcbiAqIEBleGFtcGxlXHJcbiAqIHNhbXBsZVZhcmlhbmNlKFsxLCAyLCAzLCA0LCA1XSk7IC8vPSAyLjVcclxuICovXHJcbmZ1bmN0aW9uIHNhbXBsZVZhcmlhbmNlKHggLyo6IEFycmF5PG51bWJlcj4gKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgLy8gVGhlIHZhcmlhbmNlIG9mIG5vIG51bWJlcnMgaXMgbnVsbFxyXG4gICAgaWYgKHgubGVuZ3RoIDw9IDEpIHsgcmV0dXJuIE5hTjsgfVxyXG5cclxuICAgIHZhciBzdW1TcXVhcmVkRGV2aWF0aW9uc1ZhbHVlID0gc3VtTnRoUG93ZXJEZXZpYXRpb25zKHgsIDIpO1xyXG5cclxuICAgIC8vIHRoaXMgaXMgQmVzc2VscycgQ29ycmVjdGlvbjogYW4gYWRqdXN0bWVudCBtYWRlIHRvIHNhbXBsZSBzdGF0aXN0aWNzXHJcbiAgICAvLyB0aGF0IGFsbG93cyBmb3IgdGhlIHJlZHVjZWQgZGVncmVlIG9mIGZyZWVkb20gZW50YWlsZWQgaW4gY2FsY3VsYXRpbmdcclxuICAgIC8vIHZhbHVlcyBmcm9tIHNhbXBsZXMgcmF0aGVyIHRoYW4gY29tcGxldGUgcG9wdWxhdGlvbnMuXHJcbiAgICB2YXIgYmVzc2Vsc0NvcnJlY3Rpb24gPSB4Lmxlbmd0aCAtIDE7XHJcblxyXG4gICAgLy8gRmluZCB0aGUgbWVhbiB2YWx1ZSBvZiB0aGF0IGxpc3RcclxuICAgIHJldHVybiBzdW1TcXVhcmVkRGV2aWF0aW9uc1ZhbHVlIC8gYmVzc2Vsc0NvcnJlY3Rpb247XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2FtcGxlVmFyaWFuY2U7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciB2YXJpYW5jZSA9IHJlcXVpcmUoJy4vdmFyaWFuY2UnKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgW3N0YW5kYXJkIGRldmlhdGlvbl0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TdGFuZGFyZF9kZXZpYXRpb24pXHJcbiAqIGlzIHRoZSBzcXVhcmUgcm9vdCBvZiB0aGUgdmFyaWFuY2UuIEl0J3MgdXNlZnVsIGZvciBtZWFzdXJpbmcgdGhlIGFtb3VudFxyXG4gKiBvZiB2YXJpYXRpb24gb3IgZGlzcGVyc2lvbiBpbiBhIHNldCBvZiB2YWx1ZXMuXHJcbiAqXHJcbiAqIFN0YW5kYXJkIGRldmlhdGlvbiBpcyBvbmx5IGFwcHJvcHJpYXRlIGZvciBmdWxsLXBvcHVsYXRpb24ga25vd2xlZGdlOiBmb3JcclxuICogc2FtcGxlcyBvZiBhIHBvcHVsYXRpb24sIHtAbGluayBzYW1wbGVTdGFuZGFyZERldmlhdGlvbn0gaXNcclxuICogbW9yZSBhcHByb3ByaWF0ZS5cclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGlucHV0XHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHN0YW5kYXJkIGRldmlhdGlvblxyXG4gKiBAZXhhbXBsZVxyXG4gKiB2YXIgc2NvcmVzID0gWzIsIDQsIDQsIDQsIDUsIDUsIDcsIDldO1xyXG4gKiB2YXJpYW5jZShzY29yZXMpOyAvLz0gNFxyXG4gKiBzdGFuZGFyZERldmlhdGlvbihzY29yZXMpOyAvLz0gMlxyXG4gKi9cclxuZnVuY3Rpb24gc3RhbmRhcmREZXZpYXRpb24oeCAvKjogQXJyYXk8bnVtYmVyPiAqLykvKjpudW1iZXIqLyB7XHJcbiAgICAvLyBUaGUgc3RhbmRhcmQgZGV2aWF0aW9uIG9mIG5vIG51bWJlcnMgaXMgbnVsbFxyXG4gICAgdmFyIHYgPSB2YXJpYW5jZSh4KTtcclxuICAgIGlmIChpc05hTih2KSkgeyByZXR1cm4gMDsgfVxyXG4gICAgcmV0dXJuIE1hdGguc3FydCh2KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzdGFuZGFyZERldmlhdGlvbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxuLyoqXHJcbiAqIE91ciBkZWZhdWx0IHN1bSBpcyB0aGUgW0thaGFuIHN1bW1hdGlvbiBhbGdvcml0aG1dKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0thaGFuX3N1bW1hdGlvbl9hbGdvcml0aG0pIGlzXHJcbiAqIGEgbWV0aG9kIGZvciBjb21wdXRpbmcgdGhlIHN1bSBvZiBhIGxpc3Qgb2YgbnVtYmVycyB3aGlsZSBjb3JyZWN0aW5nXHJcbiAqIGZvciBmbG9hdGluZy1wb2ludCBlcnJvcnMuIFRyYWRpdGlvbmFsbHksIHN1bXMgYXJlIGNhbGN1bGF0ZWQgYXMgbWFueVxyXG4gKiBzdWNjZXNzaXZlIGFkZGl0aW9ucywgZWFjaCBvbmUgd2l0aCBpdHMgb3duIGZsb2F0aW5nLXBvaW50IHJvdW5kb2ZmLiBUaGVzZVxyXG4gKiBsb3NzZXMgaW4gcHJlY2lzaW9uIGFkZCB1cCBhcyB0aGUgbnVtYmVyIG9mIG51bWJlcnMgaW5jcmVhc2VzLiBUaGlzIGFsdGVybmF0aXZlXHJcbiAqIGFsZ29yaXRobSBpcyBtb3JlIGFjY3VyYXRlIHRoYW4gdGhlIHNpbXBsZSB3YXkgb2YgY2FsY3VsYXRpbmcgc3VtcyBieSBzaW1wbGVcclxuICogYWRkaXRpb24uXHJcbiAqXHJcbiAqIFRoaXMgcnVucyBvbiBgTyhuKWAsIGxpbmVhciB0aW1lIGluIHJlc3BlY3QgdG8gdGhlIGFycmF5XHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBpbnB1dFxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IHN1bSBvZiBhbGwgaW5wdXQgbnVtYmVyc1xyXG4gKiBAZXhhbXBsZVxyXG4gKiBjb25zb2xlLmxvZyhzdW0oWzEsIDIsIDNdKSk7IC8vIDZcclxuICovXHJcbmZ1bmN0aW9uIHN1bSh4Lyo6IEFycmF5PG51bWJlcj4gKi8pLyo6IG51bWJlciAqLyB7XHJcblxyXG4gICAgLy8gbGlrZSB0aGUgdHJhZGl0aW9uYWwgc3VtIGFsZ29yaXRobSwgd2Uga2VlcCBhIHJ1bm5pbmdcclxuICAgIC8vIGNvdW50IG9mIHRoZSBjdXJyZW50IHN1bS5cclxuICAgIHZhciBzdW0gPSAwO1xyXG5cclxuICAgIC8vIGJ1dCB3ZSBhbHNvIGtlZXAgdGhyZWUgZXh0cmEgdmFyaWFibGVzIGFzIGJvb2trZWVwaW5nOlxyXG4gICAgLy8gbW9zdCBpbXBvcnRhbnRseSwgYW4gZXJyb3IgY29ycmVjdGlvbiB2YWx1ZS4gVGhpcyB3aWxsIGJlIGEgdmVyeVxyXG4gICAgLy8gc21hbGwgbnVtYmVyIHRoYXQgaXMgdGhlIG9wcG9zaXRlIG9mIHRoZSBmbG9hdGluZyBwb2ludCBwcmVjaXNpb24gbG9zcy5cclxuICAgIHZhciBlcnJvckNvbXBlbnNhdGlvbiA9IDA7XHJcblxyXG4gICAgLy8gdGhpcyB3aWxsIGJlIGVhY2ggbnVtYmVyIGluIHRoZSBsaXN0IGNvcnJlY3RlZCB3aXRoIHRoZSBjb21wZW5zYXRpb24gdmFsdWUuXHJcbiAgICB2YXIgY29ycmVjdGVkQ3VycmVudFZhbHVlO1xyXG5cclxuICAgIC8vIGFuZCB0aGlzIHdpbGwgYmUgdGhlIG5leHQgc3VtXHJcbiAgICB2YXIgbmV4dFN1bTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAvLyBmaXJzdCBjb3JyZWN0IHRoZSB2YWx1ZSB0aGF0IHdlJ3JlIGdvaW5nIHRvIGFkZCB0byB0aGUgc3VtXHJcbiAgICAgICAgY29ycmVjdGVkQ3VycmVudFZhbHVlID0geFtpXSAtIGVycm9yQ29tcGVuc2F0aW9uO1xyXG5cclxuICAgICAgICAvLyBjb21wdXRlIHRoZSBuZXh0IHN1bS4gc3VtIGlzIGxpa2VseSBhIG11Y2ggbGFyZ2VyIG51bWJlclxyXG4gICAgICAgIC8vIHRoYW4gY29ycmVjdGVkQ3VycmVudFZhbHVlLCBzbyB3ZSdsbCBsb3NlIHByZWNpc2lvbiBoZXJlLFxyXG4gICAgICAgIC8vIGFuZCBtZWFzdXJlIGhvdyBtdWNoIHByZWNpc2lvbiBpcyBsb3N0IGluIHRoZSBuZXh0IHN0ZXBcclxuICAgICAgICBuZXh0U3VtID0gc3VtICsgY29ycmVjdGVkQ3VycmVudFZhbHVlO1xyXG5cclxuICAgICAgICAvLyB3ZSBpbnRlbnRpb25hbGx5IGRpZG4ndCBhc3NpZ24gc3VtIGltbWVkaWF0ZWx5LCBidXQgc3RvcmVkXHJcbiAgICAgICAgLy8gaXQgZm9yIG5vdyBzbyB3ZSBjYW4gZmlndXJlIG91dCB0aGlzOiBpcyAoc3VtICsgbmV4dFZhbHVlKSAtIG5leHRWYWx1ZVxyXG4gICAgICAgIC8vIG5vdCBlcXVhbCB0byAwPyBpZGVhbGx5IGl0IHdvdWxkIGJlLCBidXQgaW4gcHJhY3RpY2UgaXQgd29uJ3Q6XHJcbiAgICAgICAgLy8gaXQgd2lsbCBiZSBzb21lIHZlcnkgc21hbGwgbnVtYmVyLiB0aGF0J3Mgd2hhdCB3ZSByZWNvcmRcclxuICAgICAgICAvLyBhcyBlcnJvckNvbXBlbnNhdGlvbi5cclxuICAgICAgICBlcnJvckNvbXBlbnNhdGlvbiA9IG5leHRTdW0gLSBzdW0gLSBjb3JyZWN0ZWRDdXJyZW50VmFsdWU7XHJcblxyXG4gICAgICAgIC8vIG5vdyB0aGF0IHdlJ3ZlIGNvbXB1dGVkIGhvdyBtdWNoIHdlJ2xsIGNvcnJlY3QgZm9yIGluIHRoZSBuZXh0XHJcbiAgICAgICAgLy8gbG9vcCwgc3RhcnQgdHJlYXRpbmcgdGhlIG5leHRTdW0gYXMgdGhlIGN1cnJlbnQgc3VtLlxyXG4gICAgICAgIHN1bSA9IG5leHRTdW07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHN1bTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzdW07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBtZWFuID0gcmVxdWlyZSgnLi9tZWFuJyk7XHJcblxyXG4vKipcclxuICogVGhlIHN1bSBvZiBkZXZpYXRpb25zIHRvIHRoZSBOdGggcG93ZXIuXHJcbiAqIFdoZW4gbj0yIGl0J3MgdGhlIHN1bSBvZiBzcXVhcmVkIGRldmlhdGlvbnMuXHJcbiAqIFdoZW4gbj0zIGl0J3MgdGhlIHN1bSBvZiBjdWJlZCBkZXZpYXRpb25zLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHhcclxuICogQHBhcmFtIHtudW1iZXJ9IG4gcG93ZXJcclxuICogQHJldHVybnMge251bWJlcn0gc3VtIG9mIG50aCBwb3dlciBkZXZpYXRpb25zXHJcbiAqIEBleGFtcGxlXHJcbiAqIHZhciBpbnB1dCA9IFsxLCAyLCAzXTtcclxuICogLy8gc2luY2UgdGhlIHZhcmlhbmNlIG9mIGEgc2V0IGlzIHRoZSBtZWFuIHNxdWFyZWRcclxuICogLy8gZGV2aWF0aW9ucywgd2UgY2FuIGNhbGN1bGF0ZSB0aGF0IHdpdGggc3VtTnRoUG93ZXJEZXZpYXRpb25zOlxyXG4gKiB2YXIgdmFyaWFuY2UgPSBzdW1OdGhQb3dlckRldmlhdGlvbnMoaW5wdXQpIC8gaW5wdXQubGVuZ3RoO1xyXG4gKi9cclxuZnVuY3Rpb24gc3VtTnRoUG93ZXJEZXZpYXRpb25zKHgvKjogQXJyYXk8bnVtYmVyPiAqLywgbi8qOiBudW1iZXIgKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgdmFyIG1lYW5WYWx1ZSA9IG1lYW4oeCksXHJcbiAgICAgICAgc3VtID0gMDtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBzdW0gKz0gTWF0aC5wb3coeFtpXSAtIG1lYW5WYWx1ZSwgbik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHN1bTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzdW1OdGhQb3dlckRldmlhdGlvbnM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBzdW1OdGhQb3dlckRldmlhdGlvbnMgPSByZXF1aXJlKCcuL3N1bV9udGhfcG93ZXJfZGV2aWF0aW9ucycpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBbdmFyaWFuY2VdKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVmFyaWFuY2UpXHJcbiAqIGlzIHRoZSBzdW0gb2Ygc3F1YXJlZCBkZXZpYXRpb25zIGZyb20gdGhlIG1lYW4uXHJcbiAqXHJcbiAqIFRoaXMgaXMgYW4gaW1wbGVtZW50YXRpb24gb2YgdmFyaWFuY2UsIG5vdCBzYW1wbGUgdmFyaWFuY2U6XHJcbiAqIHNlZSB0aGUgYHNhbXBsZVZhcmlhbmNlYCBtZXRob2QgaWYgeW91IHdhbnQgYSBzYW1wbGUgbWVhc3VyZS5cclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGEgcG9wdWxhdGlvblxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSB2YXJpYW5jZTogYSB2YWx1ZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gemVyby5cclxuICogemVybyBpbmRpY2F0ZXMgdGhhdCBhbGwgdmFsdWVzIGFyZSBpZGVudGljYWwuXHJcbiAqIEBleGFtcGxlXHJcbiAqIHNzLnZhcmlhbmNlKFsxLCAyLCAzLCA0LCA1LCA2XSk7IC8vPSAyLjkxN1xyXG4gKi9cclxuZnVuY3Rpb24gdmFyaWFuY2UoeC8qOiBBcnJheTxudW1iZXI+ICovKS8qOm51bWJlciovIHtcclxuICAgIC8vIFRoZSB2YXJpYW5jZSBvZiBubyBudW1iZXJzIGlzIG51bGxcclxuICAgIGlmICh4Lmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gTmFOOyB9XHJcblxyXG4gICAgLy8gRmluZCB0aGUgbWVhbiBvZiBzcXVhcmVkIGRldmlhdGlvbnMgYmV0d2VlbiB0aGVcclxuICAgIC8vIG1lYW4gdmFsdWUgYW5kIGVhY2ggdmFsdWUuXHJcbiAgICByZXR1cm4gc3VtTnRoUG93ZXJEZXZpYXRpb25zKHgsIDIpIC8geC5sZW5ndGg7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdmFyaWFuY2U7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbi8qKlxyXG4gKiBUaGUgW1otU2NvcmUsIG9yIFN0YW5kYXJkIFNjb3JlXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1N0YW5kYXJkX3Njb3JlKS5cclxuICpcclxuICogVGhlIHN0YW5kYXJkIHNjb3JlIGlzIHRoZSBudW1iZXIgb2Ygc3RhbmRhcmQgZGV2aWF0aW9ucyBhbiBvYnNlcnZhdGlvblxyXG4gKiBvciBkYXR1bSBpcyBhYm92ZSBvciBiZWxvdyB0aGUgbWVhbi4gVGh1cywgYSBwb3NpdGl2ZSBzdGFuZGFyZCBzY29yZVxyXG4gKiByZXByZXNlbnRzIGEgZGF0dW0gYWJvdmUgdGhlIG1lYW4sIHdoaWxlIGEgbmVnYXRpdmUgc3RhbmRhcmQgc2NvcmVcclxuICogcmVwcmVzZW50cyBhIGRhdHVtIGJlbG93IHRoZSBtZWFuLiBJdCBpcyBhIGRpbWVuc2lvbmxlc3MgcXVhbnRpdHlcclxuICogb2J0YWluZWQgYnkgc3VidHJhY3RpbmcgdGhlIHBvcHVsYXRpb24gbWVhbiBmcm9tIGFuIGluZGl2aWR1YWwgcmF3XHJcbiAqIHNjb3JlIGFuZCB0aGVuIGRpdmlkaW5nIHRoZSBkaWZmZXJlbmNlIGJ5IHRoZSBwb3B1bGF0aW9uIHN0YW5kYXJkXHJcbiAqIGRldmlhdGlvbi5cclxuICpcclxuICogVGhlIHotc2NvcmUgaXMgb25seSBkZWZpbmVkIGlmIG9uZSBrbm93cyB0aGUgcG9wdWxhdGlvbiBwYXJhbWV0ZXJzO1xyXG4gKiBpZiBvbmUgb25seSBoYXMgYSBzYW1wbGUgc2V0LCB0aGVuIHRoZSBhbmFsb2dvdXMgY29tcHV0YXRpb24gd2l0aFxyXG4gKiBzYW1wbGUgbWVhbiBhbmQgc2FtcGxlIHN0YW5kYXJkIGRldmlhdGlvbiB5aWVsZHMgdGhlXHJcbiAqIFN0dWRlbnQncyB0LXN0YXRpc3RpYy5cclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IHhcclxuICogQHBhcmFtIHtudW1iZXJ9IG1lYW5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YW5kYXJkRGV2aWF0aW9uXHJcbiAqIEByZXR1cm4ge251bWJlcn0geiBzY29yZVxyXG4gKiBAZXhhbXBsZVxyXG4gKiBzcy56U2NvcmUoNzgsIDgwLCA1KTsgLy89IC0wLjRcclxuICovXHJcbmZ1bmN0aW9uIHpTY29yZSh4Lyo6bnVtYmVyKi8sIG1lYW4vKjpudW1iZXIqLywgc3RhbmRhcmREZXZpYXRpb24vKjpudW1iZXIqLykvKjpudW1iZXIqLyB7XHJcbiAgICByZXR1cm4gKHggLSBtZWFuKSAvIHN0YW5kYXJkRGV2aWF0aW9uO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHpTY29yZTtcclxuIiwiaW1wb3J0IHtDaGFydFdpdGhDb2xvckdyb3VwcywgQ2hhcnRXaXRoQ29sb3JHcm91cHNDb25maWd9IGZyb20gXCIuL2NoYXJ0LXdpdGgtY29sb3ItZ3JvdXBzXCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7TGVnZW5kfSBmcm9tIFwiLi9sZWdlbmRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBCYXJDaGFydENvbmZpZyBleHRlbmRzIENoYXJ0V2l0aENvbG9yR3JvdXBzQ29uZmlnIHtcclxuXHJcbiAgICBzdmdDbGFzcyA9IHRoaXMuY3NzQ2xhc3NQcmVmaXggKyAnYmFyLWNoYXJ0JztcclxuICAgIHNob3dMZWdlbmQgPSB0cnVlO1xyXG4gICAgc2hvd1Rvb2x0aXAgPSB0cnVlO1xyXG4gICAgeCA9IHsvLyBYIGF4aXMgY29uZmlnXHJcbiAgICAgICAgbGFiZWw6ICcnLCAvLyBheGlzIGxhYmVsXHJcbiAgICAgICAga2V5OiAwLFxyXG4gICAgICAgIHZhbHVlOiAoZCwga2V5KSA9PiBVdGlscy5pc051bWJlcihkKSA/IGQgOiBkW2tleV0sIC8vIHggdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICBzY2FsZTogXCJvcmRpbmFsXCIsXHJcbiAgICAgICAgdGlja3M6IHVuZGVmaW5lZCxcclxuICAgIH07XHJcbiAgICB5ID0gey8vIFkgYXhpcyBjb25maWdcclxuICAgICAgICBrZXk6IDEsXHJcbiAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IFV0aWxzLmlzTnVtYmVyKGQpID8gZCA6IGRba2V5XSwgLy8geCB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgIGxhYmVsOiAnJywgLy8gYXhpcyBsYWJlbCxcclxuICAgICAgICBvcmllbnQ6IFwibGVmdFwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiXHJcbiAgICB9O1xyXG4gICAgdHJhbnNpdGlvbiA9IHRydWU7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB2YXIgY29uZmlnID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKGN1c3RvbSkge1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEJhckNoYXJ0IGV4dGVuZHMgQ2hhcnRXaXRoQ29sb3JHcm91cHMge1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IEJhckNoYXJ0Q29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBCYXJDaGFydENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0UGxvdCgpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnggPSB7fTtcclxuICAgICAgICB0aGlzLnBsb3QueSA9IHt9O1xyXG5cclxuICAgICAgICB0aGlzLmNvbXB1dGVQbG90U2l6ZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBZKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFgoKTtcclxuICAgICAgICB0aGlzLnNldHVwR3JvdXBTdGFja3MoKTtcclxuICAgICAgICB0aGlzLnNldHVwWURvbWFpbigpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcblxyXG4gICAgc2V0dXBYKCkge1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeCA9IHBsb3QueDtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnLng7XHJcblxyXG4gICAgICAgIC8qICpcclxuICAgICAgICAgKiB2YWx1ZSBhY2Nlc3NvciAtIHJldHVybnMgdGhlIHZhbHVlIHRvIGVuY29kZSBmb3IgYSBnaXZlbiBkYXRhIG9iamVjdC5cclxuICAgICAgICAgKiBzY2FsZSAtIG1hcHMgdmFsdWUgdG8gYSB2aXN1YWwgZGlzcGxheSBlbmNvZGluZywgc3VjaCBhcyBhIHBpeGVsIHBvc2l0aW9uLlxyXG4gICAgICAgICAqIG1hcCBmdW5jdGlvbiAtIG1hcHMgZnJvbSBkYXRhIHZhbHVlIHRvIGRpc3BsYXkgdmFsdWVcclxuICAgICAgICAgKiBheGlzIC0gc2V0cyB1cCBheGlzXHJcbiAgICAgICAgICoqL1xyXG4gICAgICAgIHgudmFsdWUgPSBkID0+IGNvbmYudmFsdWUoZCwgY29uZi5rZXkpO1xyXG4gICAgICAgIHguc2NhbGUgPSBkMy5zY2FsZS5vcmRpbmFsKCkucmFuZ2VSb3VuZEJhbmRzKFswLCBwbG90LndpZHRoXSwgLjA4KTtcclxuICAgICAgICB4Lm1hcCA9IGQgPT4geC5zY2FsZSh4LnZhbHVlKGQpKTtcclxuXHJcbiAgICAgICAgeC5heGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh4LnNjYWxlKS5vcmllbnQoY29uZi5vcmllbnQpO1xyXG5cclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMucGxvdC5kYXRhO1xyXG4gICAgICAgIHZhciBkb21haW47XHJcbiAgICAgICAgaWYgKCFkYXRhIHx8ICFkYXRhLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBkb21haW4gPSBbXTtcclxuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLmNvbmZpZy5zZXJpZXMpIHtcclxuICAgICAgICAgICAgZG9tYWluID0gZDMubWFwKGRhdGEsIHgudmFsdWUpLmtleXMoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkb21haW4gPSBkMy5tYXAoZGF0YVswXS52YWx1ZXMsIHgudmFsdWUpLmtleXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBsb3QueC5zY2FsZS5kb21haW4oZG9tYWluKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwWSgpIHtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHkgPSBwbG90Lnk7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZy55O1xyXG4gICAgICAgIHkudmFsdWUgPSBkID0+IGNvbmYudmFsdWUoZCwgY29uZi5rZXkpO1xyXG4gICAgICAgIHkuc2NhbGUgPSBkMy5zY2FsZVtjb25mLnNjYWxlXSgpLnJhbmdlKFtwbG90LmhlaWdodCwgMF0pO1xyXG4gICAgICAgIHkubWFwID0gZCA9PiB5LnNjYWxlKHkudmFsdWUoZCkpO1xyXG5cclxuICAgICAgICB5LmF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHkuc2NhbGUpLm9yaWVudChjb25mLm9yaWVudCk7XHJcbiAgICAgICAgaWYgKGNvbmYudGlja3MpIHtcclxuICAgICAgICAgICAgeS5heGlzLnRpY2tzKGNvbmYudGlja3MpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBZRG9tYWluKCkge1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5wbG90LmRhdGE7XHJcbiAgICAgICAgdmFyIGRvbWFpbjtcclxuICAgICAgICB2YXIgeVN0YWNrTWF4ID0gZDMubWF4KHBsb3QubGF5ZXJzLCBsYXllciA9PiBkMy5tYXgobGF5ZXIucG9pbnRzLCBkID0+IGQueTAgKyBkLnkpKTtcclxuXHJcblxyXG4gICAgICAgIC8vIHZhciBtaW4gPSBkMy5taW4oZGF0YSwgcz0+ZDMubWluKHMudmFsdWVzLCBwbG90LnkudmFsdWUpKTtcclxuICAgICAgICB2YXIgbWF4ID0geVN0YWNrTWF4O1xyXG4gICAgICAgIGRvbWFpbiA9IFswLCBtYXhdO1xyXG5cclxuICAgICAgICBwbG90Lnkuc2NhbGUuZG9tYWluKGRvbWFpbik7XHJcbiAgICAgICAgY29uc29sZS5sb2coJyBwbG90Lnkuc2NhbGUuZG9tYWluJywgcGxvdC55LnNjYWxlLmRvbWFpbigpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cEdyb3VwU3RhY2tzKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmdyb3VwRGF0YSgpO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3Quc3RhY2sgPSBkMy5sYXlvdXQuc3RhY2soKS52YWx1ZXMoZD0+ZC5wb2ludHMpO1xyXG4gICAgICAgIHRoaXMucGxvdC5ncm91cGVkRGF0YS5mb3JFYWNoKHM9PiB7XHJcbiAgICAgICAgICAgIHMucG9pbnRzID0gcy52YWx1ZXMubWFwKHY9PnNlbGYubWFwVG9Qb2ludCh2KSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5wbG90LmxheWVycyA9IHRoaXMucGxvdC5zdGFjayh0aGlzLnBsb3QuZ3JvdXBlZERhdGEpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBtYXBUb1BvaW50KHZhbHVlKSB7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeDogcGxvdC54LnZhbHVlKHZhbHVlKSxcclxuICAgICAgICAgICAgeTogcGFyc2VGbG9hdChwbG90LnkudmFsdWUodmFsdWUpKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgZHJhd0F4aXNYKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgYXhpc0NvbmYgPSB0aGlzLmNvbmZpZy54O1xyXG4gICAgICAgIHZhciBheGlzID0gc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIiArIHNlbGYucHJlZml4Q2xhc3MoJ2F4aXMteCcpICsgXCIuXCIgKyBzZWxmLnByZWZpeENsYXNzKCdheGlzJykgKyAoc2VsZi5jb25maWcuZ3VpZGVzID8gJycgOiAnLicgKyBzZWxmLnByZWZpeENsYXNzKCduby1ndWlkZXMnKSkpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyBwbG90LmhlaWdodCArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgdmFyIGF4aXNUID0gYXhpcztcclxuICAgICAgICBpZiAoc2VsZi5jb25maWcudHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICBheGlzVCA9IGF4aXMudHJhbnNpdGlvbigpLmVhc2UoXCJzaW4taW4tb3V0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXhpc1QuY2FsbChwbG90LnguYXhpcyk7XHJcblxyXG4gICAgICAgIGF4aXMuc2VsZWN0T3JBcHBlbmQoXCJ0ZXh0LlwiICsgc2VsZi5wcmVmaXhDbGFzcygnbGFiZWwnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAocGxvdC53aWR0aCAvIDIpICsgXCIsXCIgKyAocGxvdC5tYXJnaW4uYm90dG9tKSArIFwiKVwiKSAgLy8gdGV4dCBpcyBkcmF3biBvZmYgdGhlIHNjcmVlbiB0b3AgbGVmdCwgbW92ZSBkb3duIGFuZCBvdXQgYW5kIHJvdGF0ZVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiLTFlbVwiKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAudGV4dChheGlzQ29uZi5sYWJlbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRyYXdBeGlzWSgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGF4aXNDb25mID0gdGhpcy5jb25maWcueTtcclxuICAgICAgICB2YXIgYXhpcyA9IHNlbGYuc3ZnRy5zZWxlY3RPckFwcGVuZChcImcuXCIgKyBzZWxmLnByZWZpeENsYXNzKCdheGlzLXknKSArIFwiLlwiICsgc2VsZi5wcmVmaXhDbGFzcygnYXhpcycpICsgKHNlbGYuY29uZmlnLmd1aWRlcyA/ICcnIDogJy4nICsgc2VsZi5wcmVmaXhDbGFzcygnbm8tZ3VpZGVzJykpKTtcclxuXHJcbiAgICAgICAgdmFyIGF4aXNUID0gYXhpcztcclxuICAgICAgICBpZiAoc2VsZi5jb25maWcudHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICBheGlzVCA9IGF4aXMudHJhbnNpdGlvbigpLmVhc2UoXCJzaW4taW4tb3V0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXhpc1QuY2FsbChwbG90LnkuYXhpcyk7XHJcblxyXG4gICAgICAgIGF4aXMuc2VsZWN0T3JBcHBlbmQoXCJ0ZXh0LlwiICsgc2VsZi5wcmVmaXhDbGFzcygnbGFiZWwnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAtcGxvdC5tYXJnaW4ubGVmdCArIFwiLFwiICsgKHBsb3QuaGVpZ2h0IC8gMikgKyBcIilyb3RhdGUoLTkwKVwiKSAgLy8gdGV4dCBpcyBkcmF3biBvZmYgdGhlIHNjcmVlbiB0b3AgbGVmdCwgbW92ZSBkb3duIGFuZCBvdXQgYW5kIHJvdGF0ZVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGF4aXNDb25mLmxhYmVsKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIGRyYXdCYXJzKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ2xheWVycycsIHBsb3QubGF5ZXJzKTtcclxuXHJcbiAgICAgICAgdmFyIGxheWVyQ2xhc3MgPSB0aGlzLnByZWZpeENsYXNzKFwibGF5ZXJcIik7XHJcblxyXG4gICAgICAgIHZhciBiYXJDbGFzcyA9IHRoaXMucHJlZml4Q2xhc3MoXCJiYXJcIik7XHJcbiAgICAgICAgdmFyIGxheWVyID0gc2VsZi5zdmdHLnNlbGVjdEFsbChcIi5cIiArIGxheWVyQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBsb3QubGF5ZXJzKTtcclxuXHJcbiAgICAgICAgbGF5ZXIuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgbGF5ZXJDbGFzcyk7XHJcblxyXG4gICAgICAgIHZhciBiYXIgPSBsYXllci5zZWxlY3RBbGwoXCIuXCIgKyBiYXJDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEoZCA9PiBkLnBvaW50cyk7XHJcblxyXG4gICAgICAgIGJhci5lbnRlcigpLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBiYXJDbGFzcylcclxuICAgICAgICAgICAgLmFwcGVuZChcInJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDEpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGJhclJlY3QgPSBiYXIuc2VsZWN0KFwicmVjdFwiKTtcclxuXHJcbiAgICAgICAgdmFyIGJhclJlY3RUID0gYmFyUmVjdDtcclxuICAgICAgICB2YXIgYmFyVCA9IGJhcjtcclxuICAgICAgICB2YXIgbGF5ZXJUID0gbGF5ZXI7XHJcbiAgICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbkVuYWJsZWQoKSkge1xyXG4gICAgICAgICAgICBiYXJSZWN0VCA9IGJhclJlY3QudHJhbnNpdGlvbigpO1xyXG4gICAgICAgICAgICBiYXJUID0gYmFyLnRyYW5zaXRpb24oKTtcclxuICAgICAgICAgICAgbGF5ZXJUID0gbGF5ZXIudHJhbnNpdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHlEb21haW4gPSBwbG90Lnkuc2NhbGUuZG9tYWluKCk7XHJcbiAgICAgICAgYmFyVC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHBsb3QueC5zY2FsZShkLngpICsgXCIsXCIgKyAocGxvdC55LnNjYWxlKGQueTAgKyBkLnkpKSArIFwiKVwiO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBiYXJSZWN0VFxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHBsb3QueC5zY2FsZS5yYW5nZUJhbmQoKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZCA9PiBwbG90Lnkuc2NhbGUoZC55MCkgLSBwbG90Lnkuc2NhbGUoZC55MCArIGQueSAtIHlEb21haW5bMF0pKTtcclxuXHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBsb3Quc2VyaWVzQ29sb3IpIHtcclxuICAgICAgICAgICAgbGF5ZXJUXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgdGhpcy5wbG90LnNlcmllc0NvbG9yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwbG90LnRvb2x0aXApIHtcclxuICAgICAgICAgICAgYmFyLm9uKFwibW91c2VvdmVyXCIsIGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAuOSk7XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAuaHRtbChkLnkpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZDMuZXZlbnQucGFnZVggKyA1KSArIFwicHhcIilcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcclxuICAgICAgICAgICAgfSkub24oXCJtb3VzZW91dFwiLCBkID0+IHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsYXllci5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICAgICAgYmFyLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUobmV3RGF0YSkge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuICAgICAgICB0aGlzLmRyYXdBeGlzWCgpO1xyXG4gICAgICAgIHRoaXMuZHJhd0F4aXNZKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3QmFycygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHtDaGFydCwgQ2hhcnRDb25maWd9IGZyb20gXCIuL2NoYXJ0XCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcblxyXG5leHBvcnQgY2xhc3MgQm94UGxvdEJhc2VDb25maWcgZXh0ZW5kcyBDaGFydENvbmZpZ3tcclxuXHJcbiAgICBzdmdDbGFzcyA9IHRoaXMuY3NzQ2xhc3NQcmVmaXggKyAnYm94LXBsb3QnO1xyXG4gICAgc2hvd0xlZ2VuZCA9IHRydWU7XHJcbiAgICBzaG93VG9vbHRpcCA9IHRydWU7XHJcbiAgICB4ID0gey8vIFggYXhpcyBjb25maWdcclxuICAgICAgICB0aXRsZTogJycsIC8vIGF4aXMgbGFiZWxcclxuICAgICAgICB2YWx1ZTogZCA9PiBkLmtleSwgLy8geCB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgIGd1aWRlczogZmFsc2UsIC8vc2hvdyBheGlzIGd1aWRlc1xyXG4gICAgICAgIHNjYWxlOiBcIm9yZGluYWxcIlxyXG5cclxuICAgIH07XHJcbiAgICB5ID0gey8vIFkgYXhpcyBjb25maWdcclxuICAgICAgICB0aXRsZTogJycsXHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCIsXHJcbiAgICAgICAgb3JpZW50OiAnbGVmdCcsXHJcbiAgICAgICAgZG9tYWluTWFyZ2luOiAwLjEsXHJcbiAgICAgICAgZ3VpZGVzOiB0cnVlIC8vc2hvdyBheGlzIGd1aWRlc1xyXG4gICAgfTtcclxuICAgIFExID0gZCA9PiBkLnZhbHVlcy5RMTtcclxuICAgIFEyID0gZCA9PiBkLnZhbHVlcy5RMjtcclxuICAgIFEzID0gZCA9PiBkLnZhbHVlcy5RMztcclxuICAgIFdsID0gZCA9PiBkLnZhbHVlcy53aGlza2VyTG93O1xyXG4gICAgV2ggPSBkID0+IGQudmFsdWVzLndoaXNrZXJIaWdoO1xyXG4gICAgb3V0bGllcnM9IGQ9PiBkLnZhbHVlcy5vdXRsaWVycztcclxuICAgIG91dGxpZXJWYWx1ZSA9IChkLGkpPT4gZDtcclxuICAgIG91dGxpZXJMYWJlbCA9IChkLGkpPT4gZDtcclxuICAgIG1pbkJveFdpZHRoID0gMzU7XHJcbiAgICBtYXhCb3hXaWR0aCA9IDEwMDtcclxuXHJcbiAgICB0cmFuc2l0aW9uID0gdHJ1ZTtcclxuICAgIGNvbG9yID0gIHVuZGVmaW5lZDsvLyBzdHJpbmcgb3IgZnVuY3Rpb24gcmV0dXJuaW5nIGNvbG9yJ3MgdmFsdWUgZm9yIGNvbG9yIHNjYWxlXHJcbiAgICBkM0NvbG9yQ2F0ZWdvcnk9ICdjYXRlZ29yeTEwJztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgaWYoY3VzdG9tKXtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBCb3hQbG90QmFzZSBleHRlbmRzIENoYXJ0e1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IEJveFBsb3RCYXNlQ29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpe1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IEJveFBsb3RCYXNlQ29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCl7XHJcbiAgICAgICAgc3VwZXIuaW5pdFBsb3QoKTtcclxuICAgICAgICBzdXBlci5jb21wdXRlUGxvdFNpemUoKTtcclxuICAgICAgICB0aGlzLnBsb3QueCA9IHt9O1xyXG4gICAgICAgIHRoaXMucGxvdC55ID0ge307XHJcbiAgICAgICAgdGhpcy5wbG90LmRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgdGhpcy5zZXR1cFkoKTtcclxuICAgICAgICB0aGlzLnNldHVwWCgpO1xyXG5cclxuICAgICAgICB0aGlzLnNldHVwQ29sb3IoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXBYKCkge1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeCA9IHBsb3QueDtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnLng7XHJcblxyXG4gICAgICAgIHgudmFsdWUgPSBjb25mLnZhbHVlO1xyXG4gICAgICAgIHguc2NhbGUgPSBkMy5zY2FsZS5vcmRpbmFsKCkucmFuZ2VSb3VuZEJhbmRzKFswLCBwbG90LndpZHRoXSwgLjA4KTtcclxuICAgICAgICB4Lm1hcCA9IGQgPT4geC5zY2FsZSh4LnZhbHVlKGQpKTtcclxuXHJcbiAgICAgICAgeC5heGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh4LnNjYWxlKS5vcmllbnQoY29uZi5vcmllbnQpO1xyXG4gICAgICAgIGlmKGNvbmYuZ3VpZGVzKXtcclxuICAgICAgICAgICAgeC5heGlzLnRpY2tTaXplKC1wbG90LmhlaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMucGxvdC5kYXRhO1xyXG4gICAgICAgIHZhciBkb21haW47XHJcbiAgICAgICAgaWYgKCFkYXRhIHx8ICFkYXRhLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBkb21haW4gPSBbXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkb21haW4gPSBkYXRhLm1hcCh4LnZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBsb3QueC5zY2FsZS5kb21haW4oZG9tYWluKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwWSgpIHtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHkgPSBwbG90Lnk7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZy55O1xyXG4gICAgICAgIHkudmFsdWUgPSBkID0+IGNvbmYudmFsdWUoZCwgY29uZi5rZXkpO1xyXG4gICAgICAgIHkuc2NhbGUgPSBkMy5zY2FsZVtjb25mLnNjYWxlXSgpLnJhbmdlKFtwbG90LmhlaWdodCwgMF0pO1xyXG4gICAgICAgIHkubWFwID0gZCA9PiB5LnNjYWxlKHkudmFsdWUoZCkpO1xyXG5cclxuICAgICAgICB5LmF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHkuc2NhbGUpLm9yaWVudChjb25mLm9yaWVudCk7XHJcbiAgICAgICAgaWYgKGNvbmYudGlja3MpIHtcclxuICAgICAgICAgICAgeS5heGlzLnRpY2tzKGNvbmYudGlja3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihjb25mLmd1aWRlcyl7XHJcbiAgICAgICAgICAgIHkuYXhpcy50aWNrU2l6ZSgtcGxvdC53aWR0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2V0dXBZRG9tYWluKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwWURvbWFpbigpIHtcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMucGxvdC5kYXRhO1xyXG4gICAgICAgIHZhciBjID0gdGhpcy5jb25maWc7XHJcblxyXG4gICAgICAgIHZhciB2YWx1ZXMgPSBbXSwgeU1pbiwgeU1heDtcclxuICAgICAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICAgICAgbGV0IHExID0gYy5RMShkKSwgXHJcbiAgICAgICAgICAgICAgICBxMyA9IGMuUTMoZCksIFxyXG4gICAgICAgICAgICAgICAgd2wgPSBjLldsKGQpLCBcclxuICAgICAgICAgICAgICAgIHdoID0gYy5XaChkKSxcclxuICAgICAgICAgICAgICAgIG91dGxpZXJzID0gYy5vdXRsaWVycyhkKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChvdXRsaWVycykge1xyXG4gICAgICAgICAgICAgICAgb3V0bGllcnMuZm9yRWFjaChmdW5jdGlvbiAobywgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKGMub3V0bGllclZhbHVlKG8sIGkpKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh3bCkgeyB2YWx1ZXMucHVzaCh3bCkgfVxyXG4gICAgICAgICAgICBpZiAocTEpIHsgdmFsdWVzLnB1c2gocTEpIH1cclxuICAgICAgICAgICAgaWYgKHEzKSB7IHZhbHVlcy5wdXNoKHEzKSB9XHJcbiAgICAgICAgICAgIGlmICh3aCkgeyB2YWx1ZXMucHVzaCh3aCkgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHlNaW4gPSBkMy5taW4odmFsdWVzKTtcclxuICAgICAgICB5TWF4ID0gZDMubWF4KHZhbHVlcyk7XHJcbiAgICAgICAgdmFyIG1hcmdpbiA9ICh5TWF4LXlNaW4pKiB0aGlzLmNvbmZpZy55LmRvbWFpbk1hcmdpbjtcclxuICAgICAgICB5TWluLT1tYXJnaW47XHJcbiAgICAgICAgeU1heCs9bWFyZ2luO1xyXG4gICAgICAgIHZhciBkb21haW4gPSBbIHlNaW4sIHlNYXggXSA7XHJcblxyXG4gICAgICAgIHBsb3QueS5zY2FsZS5kb21haW4oZG9tYWluKTtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3QXhpc1goKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBheGlzQ29uZiA9IHRoaXMuY29uZmlnLng7XHJcbiAgICAgICAgdmFyIGF4aXMgPSBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiICsgc2VsZi5wcmVmaXhDbGFzcygnYXhpcy14JykgKyBcIi5cIiArIHNlbGYucHJlZml4Q2xhc3MoJ2F4aXMnKSArIChheGlzQ29uZi5ndWlkZXMgPyAnJyA6ICcuJyArIHNlbGYucHJlZml4Q2xhc3MoJ25vLWd1aWRlcycpKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIHBsb3QuaGVpZ2h0ICsgXCIpXCIpO1xyXG5cclxuICAgICAgICB2YXIgYXhpc1QgPSBheGlzO1xyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy50cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGF4aXNUID0gYXhpcy50cmFuc2l0aW9uKCkuZWFzZShcInNpbi1pbi1vdXRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBheGlzVC5jYWxsKHBsb3QueC5heGlzKTtcclxuXHJcbiAgICAgICAgYXhpcy5zZWxlY3RPckFwcGVuZChcInRleHQuXCIrc2VsZi5wcmVmaXhDbGFzcygnbGFiZWwnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrIChwbG90LndpZHRoLzIpICtcIixcIisgKHBsb3QubWFyZ2luLmJvdHRvbSkgK1wiKVwiKSAgLy8gdGV4dCBpcyBkcmF3biBvZmYgdGhlIHNjcmVlbiB0b3AgbGVmdCwgbW92ZSBkb3duIGFuZCBvdXQgYW5kIHJvdGF0ZVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiLTFlbVwiKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAudGV4dChheGlzQ29uZi5sYWJlbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRyYXdBeGlzWSgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGF4aXNDb25mID0gdGhpcy5jb25maWcueTtcclxuICAgICAgICB2YXIgYXhpcyA9IHNlbGYuc3ZnRy5zZWxlY3RPckFwcGVuZChcImcuXCIgKyBzZWxmLnByZWZpeENsYXNzKCdheGlzLXknKSArIFwiLlwiICsgc2VsZi5wcmVmaXhDbGFzcygnYXhpcycpICsgKGF4aXNDb25mLmd1aWRlcyA/ICcnIDogJy4nICsgc2VsZi5wcmVmaXhDbGFzcygnbm8tZ3VpZGVzJykpKTtcclxuXHJcbiAgICAgICAgdmFyIGF4aXNUID0gYXhpcztcclxuICAgICAgICBpZiAoc2VsZi5jb25maWcudHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICBheGlzVCA9IGF4aXMudHJhbnNpdGlvbigpLmVhc2UoXCJzaW4taW4tb3V0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXhpc1QuY2FsbChwbG90LnkuYXhpcyk7XHJcblxyXG4gICAgICAgIGF4aXMuc2VsZWN0T3JBcHBlbmQoXCJ0ZXh0LlwiICsgc2VsZi5wcmVmaXhDbGFzcygnbGFiZWwnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAtcGxvdC5tYXJnaW4ubGVmdCArIFwiLFwiICsgKHBsb3QuaGVpZ2h0IC8gMikgKyBcIilyb3RhdGUoLTkwKVwiKSAgLy8gdGV4dCBpcyBkcmF3biBvZmYgdGhlIHNjcmVlbiB0b3AgbGVmdCwgbW92ZSBkb3duIGFuZCBvdXQgYW5kIHJvdGF0ZVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGF4aXNDb25mLnRpdGxlKTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhd0JveFBsb3RzKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICAgICAgcGxvdCA9IHNlbGYucGxvdCxcclxuICAgICAgICAgICAgY29uZmlnID0gc2VsZi5jb25maWcsXHJcbiAgICAgICAgICAgIGJveHBsb3RDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJib3hwbG90LWl0ZW1cIilcclxuICAgICAgICBcclxuICAgICAgICB2YXIgYm94cGxvdHMgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKCcuJytib3hwbG90Q2xhc3MpLmRhdGEocGxvdC5kYXRhKTtcclxuICAgICAgICB2YXIgYm94cGxvdEVudGVyID0gYm94cGxvdHMuZW50ZXIoKVxyXG4gICAgICAgICAgICAuYXBwZW5kKCdnJylcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgYm94cGxvdENsYXNzKVxyXG4gICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZS1vcGFjaXR5JywgMWUtNilcclxuICAgICAgICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCAxZS02KTtcclxuXHJcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gMTAwMDtcclxuICAgICAgICB2YXIgYm94cGxvdHNUID0gYm94cGxvdHM7XHJcbiAgICAgICAgaWYgKHNlbGYudHJhbnNpdGlvbkVuYWJsZWQoKSkge1xyXG4gICAgICAgICAgICBib3hwbG90c1QgPSBib3hwbG90cy50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgICAgIGJveHBsb3RzVC5kZWxheShmdW5jdGlvbihkLGkpIHsgcmV0dXJuIGkgKiBkdXJhdGlvbiAvIHBsb3QuZGF0YS5sZW5ndGggfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJveHBsb3RzVFxyXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCBwbG90LmNvbG9yKVxyXG4gICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZS1vcGFjaXR5JywgMSlcclxuICAgICAgICAgICAgLnN0eWxlKCdmaWxsLW9wYWNpdHknLCAwLjc1KVxyXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQsaSkgPT4ndHJhbnNsYXRlKCcgKyAocGxvdC54Lm1hcChkLGkpICsgcGxvdC54LnNjYWxlLnJhbmdlQmFuZCgpICogMC4wNSkgKyAnLCAwKScpXHJcbiAgICAgICAgYm94cGxvdHMuZXhpdCgpLnJlbW92ZSgpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGJveFdpZHRoID0gIWNvbmZpZy5tYXhCb3hXaWR0aCA/IHBsb3QueC5zY2FsZS5yYW5nZUJhbmQoKSAqIDAuOSA6IE1hdGgubWluKGNvbmZpZy5tYXhCb3hXaWR0aCwgTWF0aC5tYXgoY29uZmlnLm1pbkJveFdpZHRoLCBwbG90Lnguc2NhbGUucmFuZ2VCYW5kKCkgKiAwLjkpKTtcclxuICAgICAgICB2YXIgYm94TGVmdCAgPSBwbG90Lnguc2NhbGUucmFuZ2VCYW5kKCkgKiAwLjQ1IC0gYm94V2lkdGgvMjtcclxuICAgICAgICB2YXIgYm94UmlnaHQgPSBwbG90Lnguc2NhbGUucmFuZ2VCYW5kKCkgKiAwLjQ1ICsgYm94V2lkdGgvMjtcclxuXHJcbiAgICAgICAgdmFyIGJveENsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImJveFwiKTtcclxuXHJcbiAgICAgICAgYm94cGxvdEVudGVyLmFwcGVuZCgncmVjdCcpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsIGJveENsYXNzKVxyXG4gICAgICAgICAgICAvLyB0b29sdGlwIGV2ZW50c1xyXG4gICAgICAgICAgICAub24oJ21vdXNlb3ZlcicsIGZ1bmN0aW9uKGQsaSkge1xyXG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoJ2hvdmVyJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaHRtbCA9ICdRMzogJytjb25maWcuUTMoZCxpKSsnPGJyLz5RMjogJytjb25maWcuUTIoZCxpKSsnPGJyLz5RMTogJytjb25maWcuUTEoZCxpKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2hvd1Rvb2x0aXAoaHRtbClcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm9uKCdtb3VzZW91dCcsIGZ1bmN0aW9uKGQsaSkge1xyXG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoJ2hvdmVyJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5oaWRlVG9vbHRpcCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIGJveFJlY3RzID0gYm94cGxvdHMuc2VsZWN0KCdyZWN0LicrYm94Q2xhc3MpO1xyXG5cclxuICAgICAgICB2YXIgYm94UmVjdHNUID0gYm94UmVjdHM7XHJcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLnRyYW5zaXRpb24pIHtcclxuICAgICAgICAgICAgYm94UmVjdHNUID0gYm94UmVjdHMudHJhbnNpdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYm94UmVjdHNULmF0dHIoJ3knLCAoZCxpKSA9PiBwbG90Lnkuc2NhbGUoY29uZmlnLlEzKGQpKSlcclxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgYm94V2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKCd4JywgYm94TGVmdCApXHJcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCxpKSA9PiBNYXRoLmFicyhwbG90Lnkuc2NhbGUoY29uZmlnLlEzKGQpKSAtIHBsb3QueS5zY2FsZShjb25maWcuUTEoZCkpKSB8fCAxKVxyXG4gICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsIHBsb3QuY29sb3IpO1xyXG5cclxuICAgICAgICAvLyBtZWRpYW4gbGluZVxyXG4gICAgICAgIHZhciBtZWRpYW5DbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoJ21lZGlhbicpO1xyXG4gICAgICAgIGJveHBsb3RFbnRlci5hcHBlbmQoJ2xpbmUnKS5hdHRyKCdjbGFzcycsIG1lZGlhbkNsYXNzKTtcclxuXHJcbiAgICAgICAgYm94cGxvdHMuc2VsZWN0KCdsaW5lLicrbWVkaWFuQ2xhc3MpXHJcbiAgICAgICAgICAgIC5hdHRyKCd4MScsIGJveExlZnQpXHJcbiAgICAgICAgICAgIC5hdHRyKCd5MScsIChkLGkpID0+IHBsb3QueS5zY2FsZShjb25maWcuUTIoZCkpKVxyXG4gICAgICAgICAgICAuYXR0cigneDInLCBib3hSaWdodClcclxuICAgICAgICAgICAgLmF0dHIoJ3kyJywgKGQsaSkgPT4gcGxvdC55LnNjYWxlKGNvbmZpZy5RMihkKSkpO1xyXG5cclxuXHJcbiAgICAgICAgLy93aGlza2Vyc1xyXG5cclxuICAgICAgICB2YXIgd2hpc2tlckNsYXNzPSBzZWxmLnByZWZpeENsYXNzKFwid2hpc2tlclwiKSxcclxuICAgICAgICAgICAgdGlja0NsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImJveHBsb3QtdGlja1wiKTtcclxuXHJcbiAgICAgICAgdmFyIHdoaXNrZXJzID0gW3trZXk6ICdsb3cnLCB2YWx1ZTogY29uZmlnLldsfSwge2tleTogJ2hpZ2gnLCB2YWx1ZTogY29uZmlnLldofV07XHJcblxyXG4gICAgICAgIGJveHBsb3RFbnRlci5lYWNoKGZ1bmN0aW9uKGQsaSkge1xyXG4gICAgICAgICAgICB2YXIgYm94ID0gZDMuc2VsZWN0KHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgd2hpc2tlcnMuZm9yRWFjaChmPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGYudmFsdWUoZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBib3guYXBwZW5kKCdsaW5lJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCBwbG90LmNvbG9yKGQsaSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsIHdoaXNrZXJDbGFzcysnICcgKyBib3hwbG90Q2xhc3MrJy0nK2Yua2V5KTtcclxuICAgICAgICAgICAgICAgICAgICBib3guYXBwZW5kKCdsaW5lJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCBwbG90LmNvbG9yKGQsaSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsIHRpY2tDbGFzcysnICcgKyBib3hwbG90Q2xhc3MrJy0nK2Yua2V5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHdoaXNrZXJzLmZvckVhY2goZiA9PiB7XHJcbiAgICAgICAgICAgIHZhciBlbmRwb2ludCA9IChmLmtleSA9PT0gJ2xvdycpID8gY29uZmlnLlExIDogY29uZmlnLlEzO1xyXG5cclxuICAgICAgICAgICAgYm94cGxvdHMuc2VsZWN0KCcuJyt3aGlza2VyQ2xhc3MrJy4nK2JveHBsb3RDbGFzcysnLScrZi5rZXkpXHJcbiAgICAgICAgICAgICAgICAuYXR0cigneDEnLCBwbG90Lnguc2NhbGUucmFuZ2VCYW5kKCkgKiAwLjQ1IClcclxuICAgICAgICAgICAgICAgIC5hdHRyKCd5MScsIChkLGkpID0+IHBsb3QueS5zY2FsZShmLnZhbHVlKGQpKSlcclxuICAgICAgICAgICAgICAgIC5hdHRyKCd4MicsIHBsb3QueC5zY2FsZS5yYW5nZUJhbmQoKSAqIDAuNDUgKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3kyJywgKGQsaSkgPT4gcGxvdC55LnNjYWxlKGVuZHBvaW50KGQpKSk7XHJcbiAgICAgICAgICAgIGJveHBsb3RzLnNlbGVjdCgnLicrdGlja0NsYXNzKycuJytib3hwbG90Q2xhc3MrJy0nK2Yua2V5KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3gxJywgYm94TGVmdCApXHJcbiAgICAgICAgICAgICAgICAuYXR0cigneTEnLCAoZCxpKSA9PiBwbG90Lnkuc2NhbGUoZi52YWx1ZShkKSkpXHJcbiAgICAgICAgICAgICAgICAuYXR0cigneDInLCBib3hSaWdodCApXHJcbiAgICAgICAgICAgICAgICAuYXR0cigneTInLCAoZCxpKSA9PiBwbG90Lnkuc2NhbGUoZi52YWx1ZShkKSkpO1xyXG5cclxuICAgICAgICAgICAgYm94cGxvdEVudGVyLnNlbGVjdEFsbCgnLicrYm94cGxvdENsYXNzKyctJytmLmtleSlcclxuICAgICAgICAgICAgICAgIC5vbignbW91c2VvdmVyJywgZnVuY3Rpb24oZCxpLGopIHtcclxuICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QodGhpcykuY2xhc3NlZCgnaG92ZXInLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnNob3dUb29sdGlwKGYudmFsdWUoZCkpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLm9uKCdtb3VzZW91dCcsIGZ1bmN0aW9uKGQsaSxqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoJ2hvdmVyJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaGlkZVRvb2x0aXAoKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAvLyBvdXRsaWVyc1xyXG4gICAgICAgIHZhciBvdXRsaWVyQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwib3V0bGllclwiKTtcclxuICAgICAgICB2YXIgb3V0bGllcnMgPSBib3hwbG90cy5zZWxlY3RBbGwoJy4nK291dGxpZXJDbGFzcykuZGF0YSgoZCxpKSA9PiBjb25maWcub3V0bGllcnMoZCxpKSB8fCBbXSk7XHJcblxyXG4gICAgICAgIHZhciBvdXRsaWVyRW50ZXJDaXJjbGUgPSBvdXRsaWVycy5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJylcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgb3V0bGllckNsYXNzKVxyXG4gICAgICAgICAgICAuc3R5bGUoJ3otaW5kZXgnLCA5MDAwKTtcclxuXHJcbiAgICAgICAgb3V0bGllckVudGVyQ2lyY2xlXHJcbiAgICAgICAgICAgIC5vbignbW91c2VvdmVyJywgZnVuY3Rpb24gKGQsIGksIGopIHtcclxuICAgICAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKCdob3ZlcicsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zaG93VG9vbHRpcChjb25maWcub3V0bGllckxhYmVsKGQsaSkpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbignbW91c2VvdXQnLCBmdW5jdGlvbiAoZCwgaSwgaikge1xyXG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoJ2hvdmVyJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5oaWRlVG9vbHRpcCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIG91dGxpZXJzVCA9IG91dGxpZXJzO1xyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy50cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIG91dGxpZXJzVCA9IG91dGxpZXJzLnRyYW5zaXRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb3V0bGllcnNUXHJcbiAgICAgICAgICAgIC5hdHRyKCdjeCcsIHBsb3QueC5zY2FsZS5yYW5nZUJhbmQoKSAqIDAuNDUpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjeScsIChkLGkpID0+IHBsb3QueS5zY2FsZShjb25maWcub3V0bGllclZhbHVlKGQsaSkpKVxyXG4gICAgICAgICAgICAuYXR0cigncicsICczJyk7XHJcbiAgICAgICAgb3V0bGllcnMuZXhpdCgpLnJlbW92ZSgpO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKG5ld0RhdGEpe1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuICAgICAgICB0aGlzLmRyYXdBeGlzWCgpO1xyXG4gICAgICAgIHRoaXMuZHJhd0F4aXNZKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3Qm94UGxvdHMoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBDb2xvcigpIHtcclxuICAgICAgICB2YXIgc2VsZj10aGlzO1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcblxyXG4gICAgICAgIGlmKGNvbmYuZDNDb2xvckNhdGVnb3J5KXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmNvbG9yQ2F0ZWdvcnkgPSBkMy5zY2FsZVtjb25mLmQzQ29sb3JDYXRlZ29yeV0oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNvbG9yVmFsdWUgPSBjb25mLmNvbG9yO1xyXG4gICAgICAgIGlmIChjb2xvclZhbHVlICYmIHR5cGVvZiBjb2xvclZhbHVlID09PSAnc3RyaW5nJyB8fCBjb2xvclZhbHVlIGluc3RhbmNlb2YgU3RyaW5nKXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmNvbG9yID0gY29sb3JWYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZih0aGlzLnBsb3QuY29sb3JDYXRlZ29yeSl7XHJcbiAgICAgICAgICAgIHNlbGYucGxvdC5jb2xvclZhbHVlPWNvbG9yVmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5jb2xvciA9IGQgPT4gIHNlbGYucGxvdC5jb2xvckNhdGVnb3J5KHRoaXMucGxvdC54LnZhbHVlKGQpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDaGFydCwgQ2hhcnRDb25maWd9IGZyb20gXCIuL2NoYXJ0XCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7TGVnZW5kfSBmcm9tIFwiLi9sZWdlbmRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDaGFydFdpdGhDb2xvckdyb3Vwc0NvbmZpZyBleHRlbmRzIENoYXJ0Q29uZmlne1xyXG5cclxuICAgIHNob3dMZWdlbmQ9dHJ1ZTtcclxuICAgIGxlZ2VuZD17XHJcbiAgICAgICAgd2lkdGg6IDgwLFxyXG4gICAgICAgIG1hcmdpbjogMTAsXHJcbiAgICAgICAgc2hhcGVXaWR0aDogMjBcclxuICAgIH07XHJcbiAgICBncm91cHM9e1xyXG4gICAgICAgIGtleTogMixcclxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oZCkgeyByZXR1cm4gZFt0aGlzLmdyb3Vwcy5rZXldfSAgLCAvLyBncm91cGluZyB2YWx1ZSBhY2Nlc3NvcixcclxuICAgICAgICBsYWJlbDogXCJcIixcclxuICAgICAgICBkaXNwbGF5VmFsdWU6IHVuZGVmaW5lZCAvLyBvcHRpb25hbCBmdW5jdGlvbiByZXR1cm5pbmcgZGlzcGxheSB2YWx1ZSAoc2VyaWVzIGxhYmVsKSBmb3IgZ2l2ZW4gZ3JvdXAgdmFsdWUsIG9yIG9iamVjdC9hcnJheSBtYXBwaW5nIHZhbHVlIHRvIGRpc3BsYXkgdmFsdWVcclxuICAgIH07XHJcbiAgICBzZXJpZXMgPSBmYWxzZTtcclxuICAgIGNvbG9yID0gIHVuZGVmaW5lZDsvLyBzdHJpbmcgb3IgZnVuY3Rpb24gcmV0dXJuaW5nIGNvbG9yJ3MgdmFsdWUgZm9yIGNvbG9yIHNjYWxlXHJcbiAgICBkM0NvbG9yQ2F0ZWdvcnk9ICdjYXRlZ29yeTEwJztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgaWYoY3VzdG9tKXtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDaGFydFdpdGhDb2xvckdyb3VwcyBleHRlbmRzIENoYXJ0e1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IENoYXJ0V2l0aENvbG9yR3JvdXBzQ29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpe1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IENoYXJ0V2l0aENvbG9yR3JvdXBzQ29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCl7XHJcbiAgICAgICAgc3VwZXIuaW5pdFBsb3QoKTtcclxuICAgICAgICB2YXIgc2VsZj10aGlzO1xyXG5cclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG4gICAgICAgXHJcbiAgICAgICAgdGhpcy5wbG90LnNob3dMZWdlbmQgPSBjb25mLnNob3dMZWdlbmQ7XHJcbiAgICAgICAgaWYodGhpcy5wbG90LnNob3dMZWdlbmQpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWFyZ2luLnJpZ2h0ID0gY29uZi5tYXJnaW4ucmlnaHQgKyBjb25mLmxlZ2VuZC53aWR0aCtjb25mLmxlZ2VuZC5tYXJnaW4qMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXR1cEdyb3VwcygpO1xyXG4gICAgICAgIHRoaXMucGxvdC5kYXRhID0gdGhpcy5nZXREYXRhVG9QbG90KCk7XHJcbiAgICAgICAgdGhpcy5ncm91cERhdGEoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBpc0dyb3VwaW5nRW5hYmxlZCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5zZXJpZXMgfHwgISEodGhpcy5jb25maWcuZ3JvdXBzICYmIHRoaXMuY29uZmlnLmdyb3Vwcy52YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcHV0ZUdyb3VwQ29sb3JEb21haW4oKXtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoZDMubWFwKHRoaXMuZGF0YSwgZCA9PiB0aGlzLnBsb3QuZ3JvdXBWYWx1ZShkKSlbJ18nXSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXBHcm91cHMoKSB7XHJcbiAgICAgICAgdmFyIHNlbGY9dGhpcztcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QuZ3JvdXBpbmdFbmFibGVkID0gdGhpcy5pc0dyb3VwaW5nRW5hYmxlZCgpO1xyXG4gICAgICAgIHZhciBkb21haW4gPSBbXTtcclxuICAgICAgICBpZih0aGlzLnBsb3QuZ3JvdXBpbmdFbmFibGVkKXtcclxuICAgICAgICAgICAgc2VsZi5wbG90Lmdyb3VwVG9MYWJlbCA9IHt9O1xyXG4gICAgICAgICAgICBpZih0aGlzLmNvbmZpZy5zZXJpZXMpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90Lmdyb3VwVmFsdWUgPSBzID0+IHMua2V5O1xyXG4gICAgICAgICAgICAgICAgZG9tYWluID0gdGhpcy5jb21wdXRlR3JvdXBDb2xvckRvbWFpbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5mb3JFYWNoKHM9PntcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnBsb3QuZ3JvdXBUb0xhYmVsW3Mua2V5XSA9IHMubGFiZWx8fHMua2V5O1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuZ3JvdXBWYWx1ZSA9IGQgPT4gY29uZi5ncm91cHMudmFsdWUuY2FsbChjb25mLCBkKTtcclxuICAgICAgICAgICAgICAgIGRvbWFpbiA9IHRoaXMuY29tcHV0ZUdyb3VwQ29sb3JEb21haW4oKTtcclxuICAgICAgICAgICAgICAgIHZhciBnZXRMYWJlbD0gayA9PiBrO1xyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5jb25maWcuZ3JvdXBzLmRpc3BsYXlWYWx1ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoVXRpbHMuaXNGdW5jdGlvbihzZWxmLmNvbmZpZy5ncm91cHMuZGlzcGxheVZhbHVlKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldExhYmVsID0gaz0+c2VsZi5jb25maWcuZ3JvdXBzLmRpc3BsYXlWYWx1ZShrKSB8fCBrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKFV0aWxzLmlzT2JqZWN0KHNlbGYuY29uZmlnLmdyb3Vwcy5kaXNwbGF5VmFsdWUpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TGFiZWwgPSBrID0+IHNlbGYuY29uZmlnLmdyb3Vwcy5kaXNwbGF5VmFsdWVba10gfHwgaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkb21haW4uZm9yRWFjaChrPT57XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wbG90Lmdyb3VwVG9MYWJlbFtrXSA9IGdldExhYmVsKGspO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lmdyb3VwVmFsdWUgPSBkID0+IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihjb25mLmQzQ29sb3JDYXRlZ29yeSl7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5jb2xvckNhdGVnb3J5ID0gZDMuc2NhbGVbY29uZi5kM0NvbG9yQ2F0ZWdvcnldKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjb2xvclZhbHVlID0gY29uZi5jb2xvcjtcclxuICAgICAgICBpZiAoY29sb3JWYWx1ZSAmJiB0eXBlb2YgY29sb3JWYWx1ZSA9PT0gJ3N0cmluZycgfHwgY29sb3JWYWx1ZSBpbnN0YW5jZW9mIFN0cmluZyl7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5jb2xvciA9IGNvbG9yVmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5zZXJpZXNDb2xvciA9IHRoaXMucGxvdC5jb2xvcjtcclxuICAgICAgICB9ZWxzZSBpZih0aGlzLnBsb3QuY29sb3JDYXRlZ29yeSl7XHJcbiAgICAgICAgICAgIHNlbGYucGxvdC5jb2xvclZhbHVlPWNvbG9yVmFsdWU7XHJcbiAgICAgICAgICAgIHNlbGYucGxvdC5jb2xvckNhdGVnb3J5LmRvbWFpbihkb21haW4pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wbG90LnNlcmllc0NvbG9yID0gcyA9PiAgc2VsZi5wbG90LmNvbG9yQ2F0ZWdvcnkocy5rZXkpO1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuY29sb3IgPSBkID0+ICBzZWxmLnBsb3QuY29sb3JDYXRlZ29yeSh0aGlzLnBsb3QuZ3JvdXBWYWx1ZShkKSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuY29sb3IgPSB0aGlzLnBsb3Quc2VyaWVzQ29sb3IgPSBzPT4gJ2JsYWNrJ1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ3JvdXBEYXRhKCl7XHJcbiAgICAgICAgdmFyIHNlbGY9dGhpcztcclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMucGxvdC5kYXRhO1xyXG4gICAgICAgIGlmKCFzZWxmLnBsb3QuZ3JvdXBpbmdFbmFibGVkICl7XHJcbiAgICAgICAgICAgIHNlbGYucGxvdC5ncm91cGVkRGF0YSA9ICBbe1xyXG4gICAgICAgICAgICAgICAga2V5OiBudWxsLFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICcnLFxyXG4gICAgICAgICAgICAgICAgdmFsdWVzOiBkYXRhXHJcbiAgICAgICAgICAgIH1dO1xyXG4gICAgICAgICAgICBzZWxmLnBsb3QuZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoO1xyXG4gICAgICAgIH1lbHNle1xyXG5cclxuICAgICAgICAgICAgaWYoc2VsZi5jb25maWcuc2VyaWVzKXtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC5ncm91cGVkRGF0YSA9ICBkYXRhLm1hcChzPT57XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJue1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IHMua2V5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogcy5sYWJlbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBzLnZhbHVlc1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC5ncm91cGVkRGF0YSA9IGQzLm5lc3QoKS5rZXkodGhpcy5wbG90Lmdyb3VwVmFsdWUpLmVudHJpZXMoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QuZ3JvdXBlZERhdGEuZm9yRWFjaChnID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBnLmxhYmVsID0gc2VsZi5wbG90Lmdyb3VwVG9MYWJlbFtnLmtleV07XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5wbG90LmRhdGFMZW5ndGggPSBkMy5zdW0odGhpcy5wbG90Lmdyb3VwZWREYXRhLCBzPT5zLnZhbHVlcy5sZW5ndGgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdGhpcy5wbG90LnNlcmllc0NvbG9yXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGdldERhdGFUb1Bsb3QoKXtcclxuICAgICAgICBpZighdGhpcy5wbG90Lmdyb3VwaW5nRW5hYmxlZCB8fCAhdGhpcy5lbmFibGVkR3JvdXBzKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5maWx0ZXIoZCA9PiB0aGlzLmVuYWJsZWRHcm91cHMuaW5kZXhPZih0aGlzLnBsb3QuZ3JvdXBWYWx1ZShkKSk+LTEpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgdXBkYXRlKG5ld0RhdGEpe1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUxlZ2VuZCgpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlTGVnZW5kKCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9dGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuXHJcbiAgICAgICAgdmFyIHNjYWxlID0gcGxvdC5jb2xvckNhdGVnb3J5O1xyXG5cclxuXHJcblxyXG4gICAgICAgIGlmKCFzY2FsZS5kb21haW4oKSB8fCBzY2FsZS5kb21haW4oKS5sZW5ndGg8Mil7XHJcbiAgICAgICAgICAgIHBsb3Quc2hvd0xlZ2VuZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIXBsb3Quc2hvd0xlZ2VuZCl7XHJcbiAgICAgICAgICAgIGlmKHBsb3QubGVnZW5kICYmIHBsb3QubGVnZW5kLmNvbnRhaW5lcil7XHJcbiAgICAgICAgICAgICAgICBwbG90LmxlZ2VuZC5jb250YWluZXIucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHZhciBsZWdlbmRYID0gdGhpcy5wbG90LndpZHRoICsgdGhpcy5jb25maWcubGVnZW5kLm1hcmdpbjtcclxuICAgICAgICB2YXIgbGVnZW5kWSA9IHRoaXMuY29uZmlnLmxlZ2VuZC5tYXJnaW47XHJcblxyXG4gICAgICAgIHBsb3QubGVnZW5kID0gbmV3IExlZ2VuZCh0aGlzLnN2ZywgdGhpcy5zdmdHLCBzY2FsZSwgbGVnZW5kWCwgbGVnZW5kWSk7XHJcblxyXG4gICAgICAgIHBsb3QubGVnZW5kQ29sb3IgPSBwbG90LmxlZ2VuZC5jb2xvcigpXHJcbiAgICAgICAgICAgIC5zaGFwZVdpZHRoKHRoaXMuY29uZmlnLmxlZ2VuZC5zaGFwZVdpZHRoKVxyXG4gICAgICAgICAgICAub3JpZW50KCd2ZXJ0aWNhbCcpXHJcbiAgICAgICAgICAgIC5zY2FsZShzY2FsZSlcclxuICAgICAgICAgICAgLmxhYmVscyhzY2FsZS5kb21haW4oKS5tYXAodj0+cGxvdC5ncm91cFRvTGFiZWxbdl0pKTtcclxuXHJcblxyXG4gICAgICAgIHBsb3QubGVnZW5kQ29sb3Iub24oJ2NlbGxjbGljaycsIGM9PiBzZWxmLm9uTGVnZW5kQ2VsbENsaWNrKGMpKTtcclxuICAgICAgICBcclxuICAgICAgICBwbG90LmxlZ2VuZC5jb250YWluZXJcclxuICAgICAgICAgICAgLmNhbGwocGxvdC5sZWdlbmRDb2xvcik7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlTGVnZW5kQ2VsbFN0YXR1c2VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25MZWdlbmRDZWxsQ2xpY2soY2VsbFZhbHVlKXtcclxuICAgICAgICB0aGlzLnVwZGF0ZUVuYWJsZWRHcm91cHMoY2VsbFZhbHVlKTtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxuICAgIHVwZGF0ZUxlZ2VuZENlbGxTdGF0dXNlcygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5wbG90LmxlZ2VuZC5jb250YWluZXIuc2VsZWN0QWxsKFwiZy5jZWxsXCIpLmVhY2goZnVuY3Rpb24oY2VsbCl7XHJcbiAgICAgICAgICAgIHZhciBpc0Rpc2FibGVkID0gc2VsZi5lbmFibGVkR3JvdXBzICYmIHNlbGYuZW5hYmxlZEdyb3Vwcy5pbmRleE9mKGNlbGwpPDA7XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKFwib2RjLWRpc2FibGVkXCIsIGlzRGlzYWJsZWQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUVuYWJsZWRHcm91cHMoY2VsbFZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWRHcm91cHMpIHtcclxuICAgICAgICAgICAgdGhpcy5lbmFibGVkR3JvdXBzID0gdGhpcy5wbG90LmNvbG9yQ2F0ZWdvcnkuZG9tYWluKCkuc2xpY2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5lbmFibGVkR3JvdXBzLmluZGV4T2YoY2VsbFZhbHVlKTtcclxuXHJcbiAgICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZWRHcm91cHMucHVzaChjZWxsVmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZEdyb3Vwcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWRHcm91cHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZEdyb3VwcyA9IHRoaXMucGxvdC5jb2xvckNhdGVnb3J5LmRvbWFpbigpLnNsaWNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRhKGRhdGEpe1xyXG4gICAgICAgIHN1cGVyLnNldERhdGEoZGF0YSk7XHJcbiAgICAgICAgdGhpcy5lbmFibGVkR3JvdXBzID0gbnVsbDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBDaGFydENvbmZpZyB7XHJcbiAgICBjc3NDbGFzc1ByZWZpeCA9IFwib2RjLVwiO1xyXG4gICAgc3ZnQ2xhc3MgPSB0aGlzLmNzc0NsYXNzUHJlZml4ICsgJ213LWQzLWNoYXJ0JztcclxuICAgIHdpZHRoID0gdW5kZWZpbmVkO1xyXG4gICAgaGVpZ2h0ID0gdW5kZWZpbmVkO1xyXG4gICAgbWFyZ2luID0ge1xyXG4gICAgICAgIGxlZnQ6IDUwLFxyXG4gICAgICAgIHJpZ2h0OiAzMCxcclxuICAgICAgICB0b3A6IDMwLFxyXG4gICAgICAgIGJvdHRvbTogNTBcclxuICAgIH07XHJcbiAgICBzaG93VG9vbHRpcCA9IGZhbHNlO1xyXG4gICAgdHJhbnNpdGlvbiA9IHRydWU7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKSB7XHJcbiAgICAgICAgaWYgKGN1c3RvbSkge1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDaGFydCB7XHJcbiAgICB1dGlscyA9IFV0aWxzO1xyXG4gICAgYmFzZUNvbnRhaW5lcjtcclxuICAgIHN2ZztcclxuICAgIGNvbmZpZztcclxuICAgIHBsb3QgPSB7XHJcbiAgICAgICAgbWFyZ2luOiB7fVxyXG4gICAgfTtcclxuICAgIF9hdHRhY2hlZCA9IHt9O1xyXG4gICAgX2xheWVycyA9IHt9O1xyXG4gICAgX2V2ZW50cyA9IHt9O1xyXG4gICAgX2lzQXR0YWNoZWQ7XHJcbiAgICBfaXNJbml0aWFsaXplZD1mYWxzZTtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoYmFzZSwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5faXNBdHRhY2hlZCA9IGJhc2UgaW5zdGFuY2VvZiBDaGFydDtcclxuXHJcbiAgICAgICAgdGhpcy5iYXNlQ29udGFpbmVyID0gYmFzZTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRDb25maWcoY29uZmlnKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXREYXRhKGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICAgICAgdGhpcy5wb3N0SW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpIHtcclxuICAgICAgICBpZiAoIWNvbmZpZykge1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IG5ldyBDaGFydENvbmZpZygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGF0YShkYXRhKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcblxyXG4gICAgICAgIHNlbGYuaW5pdFBsb3QoKTtcclxuICAgICAgICBzZWxmLmluaXRTdmcoKTtcclxuXHJcbiAgICAgICAgaWYoIXRoaXMuX2lzSW5pdGlhbGl6ZWQpe1xyXG4gICAgICAgICAgICBzZWxmLmluaXRUb29sdGlwKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNlbGYuZHJhdygpO1xyXG4gICAgICAgIHRoaXMuX2lzSW5pdGlhbGl6ZWQ9dHJ1ZTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwb3N0SW5pdCgpe1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBpbml0U3ZnKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgY29uZmlnID0gdGhpcy5jb25maWc7XHJcblxyXG4gICAgICAgIHZhciBtYXJnaW4gPSBzZWxmLnBsb3QubWFyZ2luO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IHNlbGYucGxvdC53aWR0aCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0O1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBzZWxmLnBsb3QuaGVpZ2h0ICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b207XHJcbiAgICAgICAgdmFyIGFzcGVjdCA9IHdpZHRoIC8gaGVpZ2h0O1xyXG4gICAgICAgIGlmKCFzZWxmLl9pc0F0dGFjaGVkKXtcclxuICAgICAgICAgICAgaWYoIXRoaXMuX2lzSW5pdGlhbGl6ZWQpe1xyXG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KHNlbGYuYmFzZUNvbnRhaW5lcikuc2VsZWN0KFwic3ZnXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNlbGYuc3ZnID0gZDMuc2VsZWN0KHNlbGYuYmFzZUNvbnRhaW5lcikuc2VsZWN0T3JBcHBlbmQoXCJzdmdcIik7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnN2Z1xyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidmlld0JveFwiLCBcIjAgMCBcIiArIFwiIFwiICsgd2lkdGggKyBcIiBcIiArIGhlaWdodClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwicHJlc2VydmVBc3BlY3RSYXRpb1wiLCBcInhNaWRZTWlkIG1lZXRcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgY29uZmlnLnN2Z0NsYXNzKTtcclxuICAgICAgICAgICAgc2VsZi5zdmdHID0gc2VsZi5zdmcuc2VsZWN0T3JBcHBlbmQoXCJnLm1haW4tZ3JvdXBcIik7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuYmFzZUNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIHNlbGYuc3ZnID0gc2VsZi5iYXNlQ29udGFpbmVyLnN2ZztcclxuICAgICAgICAgICAgc2VsZi5zdmdHID0gc2VsZi5zdmcuc2VsZWN0T3JBcHBlbmQoXCJnLm1haW4tZ3JvdXAuXCIrY29uZmlnLnN2Z0NsYXNzKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VsZi5zdmdHLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyBtYXJnaW4ubGVmdCArIFwiLFwiICsgbWFyZ2luLnRvcCArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgaWYgKCFjb25maWcud2lkdGggfHwgY29uZmlnLmhlaWdodCkge1xyXG4gICAgICAgICAgICBkMy5zZWxlY3Qod2luZG93KVxyXG4gICAgICAgICAgICAgICAgLm9uKFwicmVzaXplXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNpdGlvbiA9IHNlbGYuY29uZmlnLnRyYW5zaXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25maWcudHJhbnNpdGlvbj1mYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmluaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbmZpZy50cmFuc2l0aW9uID0gdHJhbnNpdGlvbjtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0VG9vbHRpcCgpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBpZiAoc2VsZi5jb25maWcuc2hvd1Rvb2x0aXApIHtcclxuICAgICAgICAgICAgaWYoIXNlbGYuX2lzQXR0YWNoZWQgKXtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC50b29sdGlwID0gZDMuc2VsZWN0KFwiYm9keVwiKS5zZWxlY3RPckFwcGVuZCgnZGl2Licrc2VsZi5jb25maWcuY3NzQ2xhc3NQcmVmaXgrJ3Rvb2x0aXAnKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wbG90LnRvb2x0aXA9IHNlbGYuYmFzZUNvbnRhaW5lci5wbG90LnRvb2x0aXA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHNlbGYucGxvdC50b29sdGlwID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKSB7XHJcbiAgICAgICAgdmFyIG1hcmdpbiA9IHRoaXMuY29uZmlnLm1hcmdpbjtcclxuICAgICAgICB0aGlzLnBsb3QgPSB0aGlzLnBsb3QgfHwge307XHJcbiAgICAgICAgdGhpcy5wbG90Lm1hcmdpbiA9IHtcclxuICAgICAgICAgICAgdG9wOiBtYXJnaW4udG9wLFxyXG4gICAgICAgICAgICBib3R0b206IG1hcmdpbi5ib3R0b20sXHJcbiAgICAgICAgICAgIGxlZnQ6IG1hcmdpbi5sZWZ0LFxyXG4gICAgICAgICAgICByaWdodDogbWFyZ2luLnJpZ2h0XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZGF0YSkge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YShkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGxheWVyTmFtZSwgYXR0YWNobWVudERhdGE7XHJcbiAgICAgICAgZm9yICh2YXIgYXR0YWNobWVudE5hbWUgaW4gdGhpcy5fYXR0YWNoZWQpIHtcclxuXHJcbiAgICAgICAgICAgIGF0dGFjaG1lbnREYXRhID0gZGF0YTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2F0dGFjaGVkW2F0dGFjaG1lbnROYW1lXS51cGRhdGUoYXR0YWNobWVudERhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBkcmF3KGRhdGEpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZShkYXRhKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvL0JvcnJvd2VkIGZyb20gZDMuY2hhcnRcclxuICAgIC8qKlxyXG4gICAgICogUmVnaXN0ZXIgb3IgcmV0cmlldmUgYW4gXCJhdHRhY2htZW50XCIgQ2hhcnQuIFRoZSBcImF0dGFjaG1lbnRcIiBjaGFydCdzIGBkcmF3YFxyXG4gICAgICogbWV0aG9kIHdpbGwgYmUgaW52b2tlZCB3aGVuZXZlciB0aGUgY29udGFpbmluZyBjaGFydCdzIGBkcmF3YCBtZXRob2QgaXNcclxuICAgICAqIGludm9rZWQuXHJcbiAgICAgKlxyXG4gICAgICogQGV4dGVybmFsRXhhbXBsZSBjaGFydC1hdHRhY2hcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXR0YWNobWVudE5hbWUgTmFtZSBvZiB0aGUgYXR0YWNobWVudFxyXG4gICAgICogQHBhcmFtIHtDaGFydH0gW2NoYXJ0XSBDaGFydCB0byByZWdpc3RlciBhcyBhIG1peCBpbiBvZiB0aGlzIGNoYXJ0LiBXaGVuXHJcbiAgICAgKiAgICAgICAgdW5zcGVjaWZpZWQsIHRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIHRoZSBhdHRhY2htZW50IHByZXZpb3VzbHlcclxuICAgICAqICAgICAgICByZWdpc3RlcmVkIHdpdGggdGhlIHNwZWNpZmllZCBgYXR0YWNobWVudE5hbWVgIChpZiBhbnkpLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtDaGFydH0gUmVmZXJlbmNlIHRvIHRoaXMgY2hhcnQgKGNoYWluYWJsZSkuXHJcbiAgICAgKi9cclxuICAgIGF0dGFjaChhdHRhY2htZW50TmFtZSwgY2hhcnQpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXR0YWNoZWRbYXR0YWNobWVudE5hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fYXR0YWNoZWRbYXR0YWNobWVudE5hbWVdID0gY2hhcnQ7XHJcbiAgICAgICAgcmV0dXJuIGNoYXJ0O1xyXG4gICAgfTtcclxuXHJcbiAgICBcclxuXHJcbiAgICAvL0JvcnJvd2VkIGZyb20gZDMuY2hhcnRcclxuICAgIC8qKlxyXG4gICAgICogU3Vic2NyaWJlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYW4gZXZlbnQgdHJpZ2dlcmVkIG9uIHRoZSBjaGFydC4gU2VlIHtAbGlua1xyXG4gICAgICAgICogQ2hhcnQjb25jZX0gdG8gc3Vic2NyaWJlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYW4gZXZlbnQgZm9yIG9uZSBvY2N1cmVuY2UuXHJcbiAgICAgKlxyXG4gICAgICogQGV4dGVybmFsRXhhbXBsZSB7cnVubmFibGV9IGNoYXJ0LW9uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgZXZlbnRcclxuICAgICAqIEBwYXJhbSB7Q2hhcnRFdmVudEhhbmRsZXJ9IGNhbGxiYWNrIEZ1bmN0aW9uIHRvIGJlIGludm9rZWQgd2hlbiB0aGUgZXZlbnRcclxuICAgICAqICAgICAgICBvY2N1cnNcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF0gVmFsdWUgdG8gc2V0IGFzIGB0aGlzYCB3aGVuIGludm9raW5nIHRoZVxyXG4gICAgICogICAgICAgIGBjYWxsYmFja2AuIERlZmF1bHRzIHRvIHRoZSBjaGFydCBpbnN0YW5jZS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Q2hhcnR9IEEgcmVmZXJlbmNlIHRvIHRoaXMgY2hhcnQgKGNoYWluYWJsZSkuXHJcbiAgICAgKi9cclxuICAgIG9uKG5hbWUsIGNhbGxiYWNrLCBjb250ZXh0KSB7XHJcbiAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50c1tuYW1lXSB8fCAodGhpcy5fZXZlbnRzW25hbWVdID0gW10pO1xyXG4gICAgICAgIGV2ZW50cy5wdXNoKHtcclxuICAgICAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxyXG4gICAgICAgICAgICBjb250ZXh0OiBjb250ZXh0IHx8IHRoaXMsXHJcbiAgICAgICAgICAgIF9jaGFydDogdGhpc1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vQm9ycm93ZWQgZnJvbSBkMy5jaGFydFxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogU3Vic2NyaWJlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYW4gZXZlbnQgdHJpZ2dlcmVkIG9uIHRoZSBjaGFydC4gVGhpc1xyXG4gICAgICogZnVuY3Rpb24gd2lsbCBiZSBpbnZva2VkIGF0IHRoZSBuZXh0IG9jY3VyYW5jZSBvZiB0aGUgZXZlbnQgYW5kIGltbWVkaWF0ZWx5XHJcbiAgICAgKiB1bnN1YnNjcmliZWQuIFNlZSB7QGxpbmsgQ2hhcnQjb259IHRvIHN1YnNjcmliZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGFuXHJcbiAgICAgKiBldmVudCBpbmRlZmluaXRlbHkuXHJcbiAgICAgKlxyXG4gICAgICogQGV4dGVybmFsRXhhbXBsZSB7cnVubmFibGV9IGNoYXJ0LW9uY2VcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBldmVudFxyXG4gICAgICogQHBhcmFtIHtDaGFydEV2ZW50SGFuZGxlcn0gY2FsbGJhY2sgRnVuY3Rpb24gdG8gYmUgaW52b2tlZCB3aGVuIHRoZSBldmVudFxyXG4gICAgICogICAgICAgIG9jY3Vyc1xyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0XSBWYWx1ZSB0byBzZXQgYXMgYHRoaXNgIHdoZW4gaW52b2tpbmcgdGhlXHJcbiAgICAgKiAgICAgICAgYGNhbGxiYWNrYC4gRGVmYXVsdHMgdG8gdGhlIGNoYXJ0IGluc3RhbmNlXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0NoYXJ0fSBBIHJlZmVyZW5jZSB0byB0aGlzIGNoYXJ0IChjaGFpbmFibGUpXHJcbiAgICAgKi9cclxuICAgIG9uY2UobmFtZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG9uY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYub2ZmKG5hbWUsIG9uY2UpO1xyXG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub24obmFtZSwgb25jZSwgY29udGV4dCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vQm9ycm93ZWQgZnJvbSBkMy5jaGFydFxyXG4gICAgLyoqXHJcbiAgICAgKiBVbnN1YnNjcmliZSBvbmUgb3IgbW9yZSBjYWxsYmFjayBmdW5jdGlvbnMgZnJvbSBhbiBldmVudCB0cmlnZ2VyZWQgb24gdGhlXHJcbiAgICAgKiBjaGFydC4gV2hlbiBubyBhcmd1bWVudHMgYXJlIHNwZWNpZmllZCwgKmFsbCogaGFuZGxlcnMgd2lsbCBiZSB1bnN1YnNjcmliZWQuXHJcbiAgICAgKiBXaGVuIG9ubHkgYSBgbmFtZWAgaXMgc3BlY2lmaWVkLCBhbGwgaGFuZGxlcnMgc3Vic2NyaWJlZCB0byB0aGF0IGV2ZW50IHdpbGxcclxuICAgICAqIGJlIHVuc3Vic2NyaWJlZC4gV2hlbiBhIGBuYW1lYCBhbmQgYGNhbGxiYWNrYCBhcmUgc3BlY2lmaWVkLCBvbmx5IHRoYXRcclxuICAgICAqIGZ1bmN0aW9uIHdpbGwgYmUgdW5zdWJzY3JpYmVkIGZyb20gdGhhdCBldmVudC4gV2hlbiBhIGBuYW1lYCBhbmQgYGNvbnRleHRgXHJcbiAgICAgKiBhcmUgc3BlY2lmaWVkIChidXQgYGNhbGxiYWNrYCBpcyBvbWl0dGVkKSwgYWxsIGV2ZW50cyBib3VuZCB0byB0aGUgZ2l2ZW5cclxuICAgICAqIGV2ZW50IHdpdGggdGhlIGdpdmVuIGNvbnRleHQgd2lsbCBiZSB1bnN1YnNjcmliZWQuXHJcbiAgICAgKlxyXG4gICAgICogQGV4dGVybmFsRXhhbXBsZSB7cnVubmFibGV9IGNoYXJ0LW9mZlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbbmFtZV0gTmFtZSBvZiB0aGUgZXZlbnQgdG8gYmUgdW5zdWJzY3JpYmVkXHJcbiAgICAgKiBAcGFyYW0ge0NoYXJ0RXZlbnRIYW5kbGVyfSBbY2FsbGJhY2tdIEZ1bmN0aW9uIHRvIGJlIHVuc3Vic2NyaWJlZFxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0XSBDb250ZXh0cyB0byBiZSB1bnN1YnNjcmliZVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtDaGFydH0gQSByZWZlcmVuY2UgdG8gdGhpcyBjaGFydCAoY2hhaW5hYmxlKS5cclxuICAgICAqL1xyXG5cclxuICAgIG9mZihuYW1lLCBjYWxsYmFjaywgY29udGV4dCkge1xyXG4gICAgICAgIHZhciBuYW1lcywgbiwgZXZlbnRzLCBldmVudCwgaSwgajtcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIGFsbCBldmVudHNcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBmb3IgKG5hbWUgaW4gdGhpcy5fZXZlbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbbmFtZV0ubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSBhbGwgZXZlbnRzIGZvciBhIHNwZWNpZmljIG5hbWVcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICBldmVudHMgPSB0aGlzLl9ldmVudHNbbmFtZV07XHJcbiAgICAgICAgICAgIGlmIChldmVudHMpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50cy5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIGFsbCBldmVudHMgdGhhdCBtYXRjaCB3aGF0ZXZlciBjb21iaW5hdGlvbiBvZiBuYW1lLCBjb250ZXh0XHJcbiAgICAgICAgLy8gYW5kIGNhbGxiYWNrLlxyXG4gICAgICAgIG5hbWVzID0gbmFtZSA/IFtuYW1lXSA6IE9iamVjdC5rZXlzKHRoaXMuX2V2ZW50cyk7XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIG4gPSBuYW1lc1tpXTtcclxuICAgICAgICAgICAgZXZlbnRzID0gdGhpcy5fZXZlbnRzW25dO1xyXG4gICAgICAgICAgICBqID0gZXZlbnRzLmxlbmd0aDtcclxuICAgICAgICAgICAgd2hpbGUgKGotLSkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQgPSBldmVudHNbal07XHJcbiAgICAgICAgICAgICAgICBpZiAoKGNhbGxiYWNrICYmIGNhbGxiYWNrID09PSBldmVudC5jYWxsYmFjaykgfHxcclxuICAgICAgICAgICAgICAgICAgICAoY29udGV4dCAmJiBjb250ZXh0ID09PSBldmVudC5jb250ZXh0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy5zcGxpY2UoaiwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvL0JvcnJvd2VkIGZyb20gZDMuY2hhcnRcclxuICAgIC8qKlxyXG4gICAgICogUHVibGlzaCBhbiBldmVudCBvbiB0aGlzIGNoYXJ0IHdpdGggdGhlIGdpdmVuIGBuYW1lYC5cclxuICAgICAqXHJcbiAgICAgKiBAZXh0ZXJuYWxFeGFtcGxlIHtydW5uYWJsZX0gY2hhcnQtdHJpZ2dlclxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGV2ZW50IHRvIHB1Ymxpc2hcclxuICAgICAqIEBwYXJhbSB7Li4uKn0gYXJndW1lbnRzIFZhbHVlcyB3aXRoIHdoaWNoIHRvIGludm9rZSB0aGUgcmVnaXN0ZXJlZFxyXG4gICAgICogICAgICAgIGNhbGxiYWNrcy5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Q2hhcnR9IEEgcmVmZXJlbmNlIHRvIHRoaXMgY2hhcnQgKGNoYWluYWJsZSkuXHJcbiAgICAgKi9cclxuICAgIHRyaWdnZXIobmFtZSkge1xyXG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcclxuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy5fZXZlbnRzW25hbWVdO1xyXG4gICAgICAgIHZhciBpLCBldjtcclxuXHJcbiAgICAgICAgaWYgKGV2ZW50cyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGV2ID0gZXZlbnRzW2ldO1xyXG4gICAgICAgICAgICAgICAgZXYuY2FsbGJhY2suYXBwbHkoZXYuY29udGV4dCwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIGdldEJhc2VDb250YWluZXIoKXtcclxuICAgICAgICBpZih0aGlzLl9pc0F0dGFjaGVkKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFzZUNvbnRhaW5lci5zdmc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkMy5zZWxlY3QodGhpcy5iYXNlQ29udGFpbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRCYXNlQ29udGFpbmVyTm9kZSgpe1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRCYXNlQ29udGFpbmVyKCkubm9kZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByZWZpeENsYXNzKGNsYXp6LCBhZGREb3Qpe1xyXG4gICAgICAgIHJldHVybiBhZGREb3Q/ICcuJzogJycrdGhpcy5jb25maWcuY3NzQ2xhc3NQcmVmaXgrY2xheno7XHJcbiAgICB9XHJcbiAgICBjb21wdXRlUGxvdFNpemUoKSB7XHJcbiAgICAgICAgdGhpcy5wbG90LndpZHRoID0gVXRpbHMuYXZhaWxhYmxlV2lkdGgodGhpcy5jb25maWcud2lkdGgsIHRoaXMuZ2V0QmFzZUNvbnRhaW5lcigpLCB0aGlzLnBsb3QubWFyZ2luKTtcclxuICAgICAgICB0aGlzLnBsb3QuaGVpZ2h0ID0gVXRpbHMuYXZhaWxhYmxlSGVpZ2h0KHRoaXMuY29uZmlnLmhlaWdodCwgdGhpcy5nZXRCYXNlQ29udGFpbmVyKCksIHRoaXMucGxvdC5tYXJnaW4pO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zaXRpb25FbmFibGVkKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzSW5pdGlhbGl6ZWQgJiYgdGhpcy5jb25maWcudHJhbnNpdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBzaG93VG9vbHRpcChodG1sKXtcclxuICAgICAgICBpZighdGhpcy5wbG90LnRvb2x0aXApe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAuZHVyYXRpb24oMjAwKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIC45KTtcclxuICAgICAgICB0aGlzLnBsb3QudG9vbHRpcC5odG1sKGh0bWwpXHJcbiAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGVUb29sdGlwKCl7XHJcbiAgICAgICAgaWYoIXRoaXMucGxvdC50b29sdGlwKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcclxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NoYXJ0LCBDaGFydENvbmZpZ30gZnJvbSBcIi4vY2hhcnRcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IHtTdGF0aXN0aWNzVXRpbHN9IGZyb20gJy4vc3RhdGlzdGljcy11dGlscydcclxuaW1wb3J0IHtMZWdlbmR9IGZyb20gJy4vbGVnZW5kJ1xyXG5pbXBvcnQge1NjYXR0ZXJQbG90fSBmcm9tICcuL3NjYXR0ZXJwbG90J1xyXG5cclxuZXhwb3J0IGNsYXNzIENvcnJlbGF0aW9uTWF0cml4Q29uZmlnIGV4dGVuZHMgQ2hhcnRDb25maWcge1xyXG5cclxuICAgIHN2Z0NsYXNzID0gdGhpcy5jc3NDbGFzc1ByZWZpeCsnY29ycmVsYXRpb24tbWF0cml4JztcclxuICAgIGd1aWRlcyA9IGZhbHNlOyAvL3Nob3cgYXhpcyBndWlkZXNcclxuICAgIHNob3dUb29sdGlwID0gdHJ1ZTsgLy9zaG93IHRvb2x0aXAgb24gZG90IGhvdmVyXHJcbiAgICBzaG93TGVnZW5kID0gdHJ1ZTtcclxuICAgIGhpZ2hsaWdodExhYmVscyA9IHRydWU7XHJcbiAgICByb3RhdGVMYWJlbHNYID0gdHJ1ZTtcclxuICAgIHJvdGF0ZUxhYmVsc1kgPSB0cnVlO1xyXG4gICAgdmFyaWFibGVzID0ge1xyXG4gICAgICAgIGxhYmVsczogdW5kZWZpbmVkLFxyXG4gICAgICAgIGtleXM6IFtdLCAvL29wdGlvbmFsIGFycmF5IG9mIHZhcmlhYmxlIGtleXNcclxuICAgICAgICB2YWx1ZTogKGQsIHZhcmlhYmxlS2V5KSA9PiBkW3ZhcmlhYmxlS2V5XSwgLy8gdmFyaWFibGUgdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICBzY2FsZTogXCJvcmRpbmFsXCJcclxuICAgIH07XHJcbiAgICBjb3JyZWxhdGlvbiA9IHtcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIixcclxuICAgICAgICBkb21haW46IFstMSwgLTAuNzUsIC0wLjUsIDAsIDAuNSwgMC43NSwgMV0sXHJcbiAgICAgICAgcmFuZ2U6IFtcImRhcmtibHVlXCIsIFwiYmx1ZVwiLCBcImxpZ2h0c2t5Ymx1ZVwiLCBcIndoaXRlXCIsIFwib3JhbmdlcmVkXCIsIFwiY3JpbXNvblwiLCBcImRhcmtyZWRcIl0sXHJcbiAgICAgICAgdmFsdWU6ICh4VmFsdWVzLCB5VmFsdWVzKSA9PiBTdGF0aXN0aWNzVXRpbHMuc2FtcGxlQ29ycmVsYXRpb24oeFZhbHVlcywgeVZhbHVlcylcclxuXHJcbiAgICB9O1xyXG4gICAgY2VsbCA9IHtcclxuICAgICAgICBzaGFwZTogXCJlbGxpcHNlXCIsIC8vcG9zc2libGUgdmFsdWVzOiByZWN0LCBjaXJjbGUsIGVsbGlwc2VcclxuICAgICAgICBzaXplOiB1bmRlZmluZWQsXHJcbiAgICAgICAgc2l6ZU1pbjogMTUsXHJcbiAgICAgICAgc2l6ZU1heDogMjUwLFxyXG4gICAgICAgIHBhZGRpbmc6IDFcclxuICAgIH07XHJcbiAgICBtYXJnaW4gPSB7XHJcbiAgICAgICAgbGVmdDogNjAsXHJcbiAgICAgICAgcmlnaHQ6IDUwLFxyXG4gICAgICAgIHRvcDogMzAsXHJcbiAgICAgICAgYm90dG9tOiA2MFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIGlmIChjdXN0b20pIHtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENvcnJlbGF0aW9uTWF0cml4IGV4dGVuZHMgQ2hhcnQge1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IENvcnJlbGF0aW9uTWF0cml4Q29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBDb3JyZWxhdGlvbk1hdHJpeENvbmZpZyhjb25maWcpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdFBsb3QoKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG1hcmdpbiA9IHRoaXMuY29uZmlnLm1hcmdpbjtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueCA9IHt9O1xyXG4gICAgICAgIHRoaXMucGxvdC5jb3JyZWxhdGlvbiA9IHtcclxuICAgICAgICAgICAgbWF0cml4OiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGNlbGxzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGNvbG9yOiB7fSxcclxuICAgICAgICAgICAgc2hhcGU6IHt9XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBWYXJpYWJsZXMoKTtcclxuICAgICAgICB2YXIgd2lkdGggPSBjb25mLndpZHRoO1xyXG4gICAgICAgIHZhciBwbGFjZWhvbGRlck5vZGUgPSB0aGlzLmdldEJhc2VDb250YWluZXJOb2RlKCk7XHJcbiAgICAgICAgdGhpcy5wbG90LnBsYWNlaG9sZGVyTm9kZSA9IHBsYWNlaG9sZGVyTm9kZTtcclxuXHJcbiAgICAgICAgdmFyIHBhcmVudFdpZHRoID0gcGxhY2Vob2xkZXJOb2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xyXG4gICAgICAgIGlmICh3aWR0aCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLnBsb3QuY2VsbFNpemUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsU2l6ZSA9IE1hdGgubWF4KGNvbmYuY2VsbC5zaXplTWluLCBNYXRoLm1pbihjb25mLmNlbGwuc2l6ZU1heCwgKHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQpIC8gdGhpcy5wbG90LnZhcmlhYmxlcy5sZW5ndGgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuY2VsbFNpemUgPSB0aGlzLmNvbmZpZy5jZWxsLnNpemU7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMucGxvdC5jZWxsU2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxTaXplID0gTWF0aC5tYXgoY29uZi5jZWxsLnNpemVNaW4sIE1hdGgubWluKGNvbmYuY2VsbC5zaXplTWF4LCAocGFyZW50V2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodCkgLyB0aGlzLnBsb3QudmFyaWFibGVzLmxlbmd0aCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB3aWR0aCA9IHRoaXMucGxvdC5jZWxsU2l6ZSAqIHRoaXMucGxvdC52YXJpYWJsZXMubGVuZ3RoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQ7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGhlaWdodCA9IHdpZHRoO1xyXG4gICAgICAgIGlmICghaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGhlaWdodCA9IHBsYWNlaG9sZGVyTm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnBsb3Qud2lkdGggPSB3aWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0O1xyXG4gICAgICAgIHRoaXMucGxvdC5oZWlnaHQgPSB0aGlzLnBsb3Qud2lkdGg7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBWYXJpYWJsZXNTY2FsZXMoKTtcclxuICAgICAgICB0aGlzLnNldHVwQ29ycmVsYXRpb25TY2FsZXMoKTtcclxuICAgICAgICB0aGlzLnNldHVwQ29ycmVsYXRpb25NYXRyaXgoKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwVmFyaWFibGVzU2NhbGVzKCkge1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeCA9IHBsb3QueDtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnLnZhcmlhYmxlcztcclxuXHJcbiAgICAgICAgLyogKlxyXG4gICAgICAgICAqIHZhbHVlIGFjY2Vzc29yIC0gcmV0dXJucyB0aGUgdmFsdWUgdG8gZW5jb2RlIGZvciBhIGdpdmVuIGRhdGEgb2JqZWN0LlxyXG4gICAgICAgICAqIHNjYWxlIC0gbWFwcyB2YWx1ZSB0byBhIHZpc3VhbCBkaXNwbGF5IGVuY29kaW5nLCBzdWNoIGFzIGEgcGl4ZWwgcG9zaXRpb24uXHJcbiAgICAgICAgICogbWFwIGZ1bmN0aW9uIC0gbWFwcyBmcm9tIGRhdGEgdmFsdWUgdG8gZGlzcGxheSB2YWx1ZVxyXG4gICAgICAgICAqIGF4aXMgLSBzZXRzIHVwIGF4aXNcclxuICAgICAgICAgKiovXHJcbiAgICAgICAgeC52YWx1ZSA9IGNvbmYudmFsdWU7XHJcbiAgICAgICAgeC5zY2FsZSA9IGQzLnNjYWxlW2NvbmYuc2NhbGVdKCkucmFuZ2VCYW5kcyhbcGxvdC53aWR0aCwgMF0pO1xyXG4gICAgICAgIHgubWFwID0gZCA9PiB4LnNjYWxlKHgudmFsdWUoZCkpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBDb3JyZWxhdGlvblNjYWxlcygpIHtcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgY29yckNvbmYgPSB0aGlzLmNvbmZpZy5jb3JyZWxhdGlvbjtcclxuXHJcbiAgICAgICAgcGxvdC5jb3JyZWxhdGlvbi5jb2xvci5zY2FsZSA9IGQzLnNjYWxlW2NvcnJDb25mLnNjYWxlXSgpLmRvbWFpbihjb3JyQ29uZi5kb21haW4pLnJhbmdlKGNvcnJDb25mLnJhbmdlKTtcclxuICAgICAgICB2YXIgc2hhcGUgPSBwbG90LmNvcnJlbGF0aW9uLnNoYXBlID0ge307XHJcblxyXG4gICAgICAgIHZhciBjZWxsQ29uZiA9IHRoaXMuY29uZmlnLmNlbGw7XHJcbiAgICAgICAgc2hhcGUudHlwZSA9IGNlbGxDb25mLnNoYXBlO1xyXG5cclxuICAgICAgICB2YXIgc2hhcGVTaXplID0gcGxvdC5jZWxsU2l6ZSAtIGNlbGxDb25mLnBhZGRpbmcgKiAyO1xyXG4gICAgICAgIGlmIChzaGFwZS50eXBlID09ICdjaXJjbGUnKSB7XHJcbiAgICAgICAgICAgIHZhciByYWRpdXNNYXggPSBzaGFwZVNpemUgLyAyO1xyXG4gICAgICAgICAgICBzaGFwZS5yYWRpdXNTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgMV0pLnJhbmdlKFsyLCByYWRpdXNNYXhdKTtcclxuICAgICAgICAgICAgc2hhcGUucmFkaXVzID0gYz0+IHNoYXBlLnJhZGl1c1NjYWxlKE1hdGguYWJzKGMudmFsdWUpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHNoYXBlLnR5cGUgPT0gJ2VsbGlwc2UnKSB7XHJcbiAgICAgICAgICAgIHZhciByYWRpdXNNYXggPSBzaGFwZVNpemUgLyAyO1xyXG4gICAgICAgICAgICBzaGFwZS5yYWRpdXNTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgMV0pLnJhbmdlKFtyYWRpdXNNYXgsIDJdKTtcclxuICAgICAgICAgICAgc2hhcGUucmFkaXVzWCA9IGM9PiBzaGFwZS5yYWRpdXNTY2FsZShNYXRoLmFicyhjLnZhbHVlKSk7XHJcbiAgICAgICAgICAgIHNoYXBlLnJhZGl1c1kgPSByYWRpdXNNYXg7XHJcblxyXG4gICAgICAgICAgICBzaGFwZS5yb3RhdGVWYWwgPSB2ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh2ID09IDApIHJldHVybiBcIjBcIjtcclxuICAgICAgICAgICAgICAgIGlmICh2IDwgMCkgcmV0dXJuIFwiLTQ1XCI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCI0NVwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHNoYXBlLnR5cGUgPT0gJ3JlY3QnKSB7XHJcbiAgICAgICAgICAgIHNoYXBlLnNpemUgPSBzaGFwZVNpemU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgc2V0dXBWYXJpYWJsZXMoKSB7XHJcblxyXG4gICAgICAgIHZhciB2YXJpYWJsZXNDb25mID0gdGhpcy5jb25maWcudmFyaWFibGVzO1xyXG5cclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICBwbG90LmRvbWFpbkJ5VmFyaWFibGUgPSB7fTtcclxuICAgICAgICBwbG90LnZhcmlhYmxlcyA9IHZhcmlhYmxlc0NvbmYua2V5cztcclxuICAgICAgICBpZiAoIXBsb3QudmFyaWFibGVzIHx8ICFwbG90LnZhcmlhYmxlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcGxvdC52YXJpYWJsZXMgPSBVdGlscy5pbmZlclZhcmlhYmxlcyhkYXRhLCB0aGlzLmNvbmZpZy5ncm91cHMua2V5LCB0aGlzLmNvbmZpZy5pbmNsdWRlSW5QbG90KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBsb3QubGFiZWxzID0gW107XHJcbiAgICAgICAgcGxvdC5sYWJlbEJ5VmFyaWFibGUgPSB7fTtcclxuICAgICAgICBwbG90LnZhcmlhYmxlcy5mb3JFYWNoKCh2YXJpYWJsZUtleSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgcGxvdC5kb21haW5CeVZhcmlhYmxlW3ZhcmlhYmxlS2V5XSA9IGQzLmV4dGVudChkYXRhLCAoZCkgPT4gdmFyaWFibGVzQ29uZi52YWx1ZShkLCB2YXJpYWJsZUtleSkpO1xyXG4gICAgICAgICAgICB2YXIgbGFiZWwgPSB2YXJpYWJsZUtleTtcclxuICAgICAgICAgICAgaWYgKHZhcmlhYmxlc0NvbmYubGFiZWxzICYmIHZhcmlhYmxlc0NvbmYubGFiZWxzLmxlbmd0aCA+IGluZGV4KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGFiZWwgPSB2YXJpYWJsZXNDb25mLmxhYmVsc1tpbmRleF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGxvdC5sYWJlbHMucHVzaChsYWJlbCk7XHJcbiAgICAgICAgICAgIHBsb3QubGFiZWxCeVZhcmlhYmxlW3ZhcmlhYmxlS2V5XSA9IGxhYmVsO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhwbG90LmxhYmVsQnlWYXJpYWJsZSk7XHJcblxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgc2V0dXBDb3JyZWxhdGlvbk1hdHJpeCgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgdmFyIG1hdHJpeCA9IHRoaXMucGxvdC5jb3JyZWxhdGlvbi5tYXRyaXggPSBbXTtcclxuICAgICAgICB2YXIgbWF0cml4Q2VsbHMgPSB0aGlzLnBsb3QuY29ycmVsYXRpb24ubWF0cml4LmNlbGxzID0gW107XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcblxyXG4gICAgICAgIHZhciB2YXJpYWJsZVRvVmFsdWVzID0ge307XHJcbiAgICAgICAgcGxvdC52YXJpYWJsZXMuZm9yRWFjaCgodiwgaSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgdmFyaWFibGVUb1ZhbHVlc1t2XSA9IGRhdGEubWFwKGQ9PnBsb3QueC52YWx1ZShkLCB2KSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHBsb3QudmFyaWFibGVzLmZvckVhY2goKHYxLCBpKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciByb3cgPSBbXTtcclxuICAgICAgICAgICAgbWF0cml4LnB1c2gocm93KTtcclxuXHJcbiAgICAgICAgICAgIHBsb3QudmFyaWFibGVzLmZvckVhY2goKHYyLCBqKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29yciA9IDE7XHJcbiAgICAgICAgICAgICAgICBpZiAodjEgIT0gdjIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb3JyID0gc2VsZi5jb25maWcuY29ycmVsYXRpb24udmFsdWUodmFyaWFibGVUb1ZhbHVlc1t2MV0sIHZhcmlhYmxlVG9WYWx1ZXNbdjJdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBjZWxsID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvd1ZhcjogdjEsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sVmFyOiB2MixcclxuICAgICAgICAgICAgICAgICAgICByb3c6IGksXHJcbiAgICAgICAgICAgICAgICAgICAgY29sOiBqLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjb3JyXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcm93LnB1c2goY2VsbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbWF0cml4Q2VsbHMucHVzaChjZWxsKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB1cGRhdGUobmV3RGF0YSkge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuICAgICAgICAvLyB0aGlzLnVwZGF0ZVxyXG4gICAgICAgIHRoaXMudXBkYXRlQ2VsbHMoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZhcmlhYmxlTGFiZWxzKCk7XHJcblxyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcuc2hvd0xlZ2VuZCkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxlZ2VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlVmFyaWFibGVMYWJlbHMoKSB7XHJcbiAgICAgICAgdGhpcy5wbG90LmxhYmVsQ2xhc3MgPSB0aGlzLnByZWZpeENsYXNzKFwibGFiZWxcIik7XHJcbiAgICAgICAgdGhpcy51cGRhdGVBeGlzWCgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQXhpc1koKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVBeGlzWCgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGxhYmVsQ2xhc3MgPSBwbG90LmxhYmVsQ2xhc3M7XHJcbiAgICAgICAgdmFyIGxhYmVsWENsYXNzID0gbGFiZWxDbGFzcyArIFwiLXhcIjtcclxuXHJcbiAgICAgICAgdmFyIGxhYmVscyA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgbGFiZWxYQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBsb3QudmFyaWFibGVzLCAoZCwgaSk9PmkpO1xyXG5cclxuICAgICAgICBsYWJlbHMuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpLmF0dHIoXCJjbGFzc1wiLCAoZCwgaSkgPT4gbGFiZWxDbGFzcyArIFwiIFwiICsgbGFiZWxYQ2xhc3MgKyBcIiBcIiArIGxhYmVsWENsYXNzICsgXCItXCIgKyBpKTtcclxuXHJcbiAgICAgICAgbGFiZWxzXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAoZCwgaSkgPT4gaSAqIHBsb3QuY2VsbFNpemUgKyBwbG90LmNlbGxTaXplIC8gMilcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIHBsb3QuaGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcImR4XCIsIC0yKVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIDUpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIilcclxuXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJoYW5naW5nXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KHY9PnBsb3QubGFiZWxCeVZhcmlhYmxlW3ZdKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnJvdGF0ZUxhYmVsc1gpIHtcclxuICAgICAgICAgICAgbGFiZWxzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwicm90YXRlKC00NSwgXCIgKyAoaSAqIHBsb3QuY2VsbFNpemUgKyBwbG90LmNlbGxTaXplIC8gMiAgKSArIFwiLCBcIiArIHBsb3QuaGVpZ2h0ICsgXCIpXCIpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbWF4V2lkdGggPSBzZWxmLmNvbXB1dGVYQXhpc0xhYmVsc1dpZHRoKCk7XHJcbiAgICAgICAgbGFiZWxzLmVhY2goZnVuY3Rpb24gKGxhYmVsKSB7XHJcbiAgICAgICAgICAgIFV0aWxzLnBsYWNlVGV4dFdpdGhFbGxpcHNpc0FuZFRvb2x0aXAoZDMuc2VsZWN0KHRoaXMpLCBsYWJlbCwgbWF4V2lkdGgsIHNlbGYuY29uZmlnLnNob3dUb29sdGlwID8gc2VsZi5wbG90LnRvb2x0aXAgOiBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxhYmVscy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlQXhpc1koKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBsYWJlbENsYXNzID0gcGxvdC5sYWJlbENsYXNzO1xyXG4gICAgICAgIHZhciBsYWJlbFlDbGFzcyA9IHBsb3QubGFiZWxDbGFzcyArIFwiLXlcIjtcclxuICAgICAgICB2YXIgbGFiZWxzID0gc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyBsYWJlbFlDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGxvdC52YXJpYWJsZXMpO1xyXG5cclxuICAgICAgICBsYWJlbHMuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpO1xyXG5cclxuICAgICAgICBsYWJlbHNcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAoZCwgaSkgPT4gaSAqIHBsb3QuY2VsbFNpemUgKyBwbG90LmNlbGxTaXplIC8gMilcclxuICAgICAgICAgICAgLmF0dHIoXCJkeFwiLCAtMilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIChkLCBpKSA9PiBsYWJlbENsYXNzICsgXCIgXCIgKyBsYWJlbFlDbGFzcyArIFwiIFwiICsgbGFiZWxZQ2xhc3MgKyBcIi1cIiArIGkpXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJoYW5naW5nXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KHY9PnBsb3QubGFiZWxCeVZhcmlhYmxlW3ZdKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnJvdGF0ZUxhYmVsc1kpIHtcclxuICAgICAgICAgICAgbGFiZWxzXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCAoZCwgaSkgPT4gXCJyb3RhdGUoLTQ1LCBcIiArIDAgKyBcIiwgXCIgKyAoaSAqIHBsb3QuY2VsbFNpemUgKyBwbG90LmNlbGxTaXplIC8gMikgKyBcIilcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbWF4V2lkdGggPSBzZWxmLmNvbXB1dGVZQXhpc0xhYmVsc1dpZHRoKCk7XHJcbiAgICAgICAgbGFiZWxzLmVhY2goZnVuY3Rpb24gKGxhYmVsKSB7XHJcbiAgICAgICAgICAgIFV0aWxzLnBsYWNlVGV4dFdpdGhFbGxpcHNpc0FuZFRvb2x0aXAoZDMuc2VsZWN0KHRoaXMpLCBsYWJlbCwgbWF4V2lkdGgsIHNlbGYuY29uZmlnLnNob3dUb29sdGlwID8gc2VsZi5wbG90LnRvb2x0aXAgOiBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxhYmVscy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcHV0ZVlBeGlzTGFiZWxzV2lkdGgoKSB7XHJcbiAgICAgICAgdmFyIG1heFdpZHRoID0gdGhpcy5wbG90Lm1hcmdpbi5sZWZ0O1xyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcucm90YXRlTGFiZWxzWSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbWF4V2lkdGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtYXhXaWR0aCAqPSBVdGlscy5TUVJUXzI7XHJcbiAgICAgICAgdmFyIGZvbnRTaXplID0gMTE7IC8vdG9kbyBjaGVjayBhY3R1YWwgZm9udCBzaXplXHJcbiAgICAgICAgbWF4V2lkdGggLT0gZm9udFNpemUgLyAyO1xyXG5cclxuICAgICAgICByZXR1cm4gbWF4V2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcHV0ZVhBeGlzTGFiZWxzV2lkdGgob2Zmc2V0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5yb3RhdGVMYWJlbHNYKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBsb3QuY2VsbFNpemUgLSAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc2l6ZSA9IHRoaXMucGxvdC5tYXJnaW4uYm90dG9tO1xyXG4gICAgICAgIHNpemUgKj0gVXRpbHMuU1FSVF8yO1xyXG4gICAgICAgIHZhciBmb250U2l6ZSA9IDExOyAvL3RvZG8gY2hlY2sgYWN0dWFsIGZvbnQgc2l6ZVxyXG4gICAgICAgIHNpemUgLT0gZm9udFNpemUgLyAyO1xyXG4gICAgICAgIHJldHVybiBzaXplO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUNlbGxzKCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGNlbGxDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJjZWxsXCIpO1xyXG4gICAgICAgIHZhciBjZWxsU2hhcGUgPSBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnR5cGU7XHJcblxyXG4gICAgICAgIHZhciBjZWxscyA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJnLlwiICsgY2VsbENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShwbG90LmNvcnJlbGF0aW9uLm1hdHJpeC5jZWxscyk7XHJcblxyXG4gICAgICAgIHZhciBjZWxsRW50ZXJHID0gY2VsbHMuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKGNlbGxDbGFzcywgdHJ1ZSk7XHJcbiAgICAgICAgY2VsbHMuYXR0cihcInRyYW5zZm9ybVwiLCBjPT4gXCJ0cmFuc2xhdGUoXCIgKyAocGxvdC5jZWxsU2l6ZSAqIGMuY29sICsgcGxvdC5jZWxsU2l6ZSAvIDIpICsgXCIsXCIgKyAocGxvdC5jZWxsU2l6ZSAqIGMucm93ICsgcGxvdC5jZWxsU2l6ZSAvIDIpICsgXCIpXCIpO1xyXG5cclxuICAgICAgICBjZWxscy5jbGFzc2VkKHNlbGYuY29uZmlnLmNzc0NsYXNzUHJlZml4ICsgXCJzZWxlY3RhYmxlXCIsICEhc2VsZi5zY2F0dGVyUGxvdCk7XHJcblxyXG4gICAgICAgIHZhciBzZWxlY3RvciA9IFwiKjpub3QoLmNlbGwtc2hhcGUtXCIgKyBjZWxsU2hhcGUgKyBcIilcIjtcclxuXHJcbiAgICAgICAgdmFyIHdyb25nU2hhcGVzID0gY2VsbHMuc2VsZWN0QWxsKHNlbGVjdG9yKTtcclxuICAgICAgICB3cm9uZ1NoYXBlcy5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgdmFyIHNoYXBlcyA9IGNlbGxzLnNlbGVjdE9yQXBwZW5kKGNlbGxTaGFwZSArIFwiLmNlbGwtc2hhcGUtXCIgKyBjZWxsU2hhcGUpO1xyXG5cclxuICAgICAgICBpZiAocGxvdC5jb3JyZWxhdGlvbi5zaGFwZS50eXBlID09ICdjaXJjbGUnKSB7XHJcblxyXG4gICAgICAgICAgICBzaGFwZXNcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiclwiLCBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnJhZGl1cylcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY3hcIiwgMClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY3lcIiwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGxvdC5jb3JyZWxhdGlvbi5zaGFwZS50eXBlID09ICdlbGxpcHNlJykge1xyXG4gICAgICAgICAgICAvLyBjZWxscy5hdHRyKFwidHJhbnNmb3JtXCIsIGM9PiBcInRyYW5zbGF0ZSgzMDAsMTUwKSByb3RhdGUoXCIrcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5yb3RhdGVWYWwoYy52YWx1ZSkrXCIpXCIpO1xyXG4gICAgICAgICAgICBzaGFwZXNcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwicnhcIiwgcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5yYWRpdXNYKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJyeVwiLCBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnJhZGl1c1kpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImN4XCIsIDApXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImN5XCIsIDApXHJcblxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYz0+IFwicm90YXRlKFwiICsgcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5yb3RhdGVWYWwoYy52YWx1ZSkgKyBcIilcIik7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgaWYgKHBsb3QuY29ycmVsYXRpb24uc2hhcGUudHlwZSA9PSAncmVjdCcpIHtcclxuICAgICAgICAgICAgc2hhcGVzXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHBsb3QuY29ycmVsYXRpb24uc2hhcGUuc2l6ZSlcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIHBsb3QuY29ycmVsYXRpb24uc2hhcGUuc2l6ZSlcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieFwiLCAtcGxvdC5jZWxsU2l6ZSAvIDIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInlcIiwgLXBsb3QuY2VsbFNpemUgLyAyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2hhcGVzLnN0eWxlKFwiZmlsbFwiLCBjPT4gcGxvdC5jb3JyZWxhdGlvbi5jb2xvci5zY2FsZShjLnZhbHVlKSk7XHJcblxyXG4gICAgICAgIHZhciBtb3VzZW92ZXJDYWxsYmFja3MgPSBbXTtcclxuICAgICAgICB2YXIgbW91c2VvdXRDYWxsYmFja3MgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKHBsb3QudG9vbHRpcCkge1xyXG5cclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goYz0+IHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGh0bWwgPSBjLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLmh0bWwoaHRtbClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLnB1c2goYz0+IHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2VsZi5jb25maWcuaGlnaGxpZ2h0TGFiZWxzKSB7XHJcbiAgICAgICAgICAgIHZhciBoaWdobGlnaHRDbGFzcyA9IHNlbGYuY29uZmlnLmNzc0NsYXNzUHJlZml4ICsgXCJoaWdobGlnaHRcIjtcclxuICAgICAgICAgICAgdmFyIHhMYWJlbENsYXNzID0gYz0+cGxvdC5sYWJlbENsYXNzICsgXCIteC1cIiArIGMuY29sO1xyXG4gICAgICAgICAgICB2YXIgeUxhYmVsQ2xhc3MgPSBjPT5wbG90LmxhYmVsQ2xhc3MgKyBcIi15LVwiICsgYy5yb3c7XHJcblxyXG5cclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goYz0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHhMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgeUxhYmVsQ2xhc3MoYykpLmNsYXNzZWQoaGlnaGxpZ2h0Q2xhc3MsIHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MucHVzaChjPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB4TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB5TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBjZWxscy5vbihcIm1vdXNlb3ZlclwiLCBjID0+IHtcclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2s9PmNhbGxiYWNrKGMpKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCBjID0+IHtcclxuICAgICAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2s9PmNhbGxiYWNrKGMpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNlbGxzLm9uKFwiY2xpY2tcIiwgYz0+IHtcclxuICAgICAgICAgICAgc2VsZi50cmlnZ2VyKFwiY2VsbC1zZWxlY3RlZFwiLCBjKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIGNlbGxzLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgdXBkYXRlTGVnZW5kKCkge1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgbGVnZW5kWCA9IHRoaXMucGxvdC53aWR0aCArIDEwO1xyXG4gICAgICAgIHZhciBsZWdlbmRZID0gMDtcclxuICAgICAgICB2YXIgYmFyV2lkdGggPSAxMDtcclxuICAgICAgICB2YXIgYmFySGVpZ2h0ID0gdGhpcy5wbG90LmhlaWdodCAtIDI7XHJcbiAgICAgICAgdmFyIHNjYWxlID0gcGxvdC5jb3JyZWxhdGlvbi5jb2xvci5zY2FsZTtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmQgPSBuZXcgTGVnZW5kKHRoaXMuc3ZnLCB0aGlzLnN2Z0csIHNjYWxlLCBsZWdlbmRYLCBsZWdlbmRZKS5saW5lYXJHcmFkaWVudEJhcihiYXJXaWR0aCwgYmFySGVpZ2h0KTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGF0dGFjaFNjYXR0ZXJQbG90KGNvbnRhaW5lclNlbGVjdG9yLCBjb25maWcpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblxyXG4gICAgICAgIHZhciBzY2F0dGVyUGxvdENvbmZpZyA9IHtcclxuICAgICAgICAgICAgaGVpZ2h0OiBzZWxmLnBsb3QuaGVpZ2h0ICsgc2VsZi5jb25maWcubWFyZ2luLnRvcCArIHNlbGYuY29uZmlnLm1hcmdpbi5ib3R0b20sXHJcbiAgICAgICAgICAgIHdpZHRoOiBzZWxmLnBsb3QuaGVpZ2h0ICsgc2VsZi5jb25maWcubWFyZ2luLnRvcCArIHNlbGYuY29uZmlnLm1hcmdpbi5ib3R0b20sXHJcbiAgICAgICAgICAgIGdyb3Vwczoge1xyXG4gICAgICAgICAgICAgICAga2V5OiBzZWxmLmNvbmZpZy5ncm91cHMua2V5LFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6IHNlbGYuY29uZmlnLmdyb3Vwcy5sYWJlbFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBndWlkZXM6IHRydWUsXHJcbiAgICAgICAgICAgIHNob3dMZWdlbmQ6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zY2F0dGVyUGxvdCA9IHRydWU7XHJcblxyXG4gICAgICAgIHNjYXR0ZXJQbG90Q29uZmlnID0gVXRpbHMuZGVlcEV4dGVuZChzY2F0dGVyUGxvdENvbmZpZywgY29uZmlnKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm9uKFwiY2VsbC1zZWxlY3RlZFwiLCBjPT4ge1xyXG5cclxuXHJcbiAgICAgICAgICAgIHNjYXR0ZXJQbG90Q29uZmlnLnggPSB7XHJcbiAgICAgICAgICAgICAgICBrZXk6IGMucm93VmFyLFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6IHNlbGYucGxvdC5sYWJlbEJ5VmFyaWFibGVbYy5yb3dWYXJdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHNjYXR0ZXJQbG90Q29uZmlnLnkgPSB7XHJcbiAgICAgICAgICAgICAgICBrZXk6IGMuY29sVmFyLFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6IHNlbGYucGxvdC5sYWJlbEJ5VmFyaWFibGVbYy5jb2xWYXJdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnNjYXR0ZXJQbG90ICYmIHNlbGYuc2NhdHRlclBsb3QgIT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2NhdHRlclBsb3Quc2V0Q29uZmlnKHNjYXR0ZXJQbG90Q29uZmlnKS5pbml0KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNjYXR0ZXJQbG90ID0gbmV3IFNjYXR0ZXJQbG90KGNvbnRhaW5lclNlbGVjdG9yLCBzZWxmLmRhdGEsIHNjYXR0ZXJQbG90Q29uZmlnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXR0YWNoKFwiU2NhdHRlclBsb3RcIiwgc2VsZi5zY2F0dGVyUGxvdCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgRDNFeHRlbnNpb25ze1xyXG5cclxuICAgIHN0YXRpYyBleHRlbmQoKXtcclxuXHJcbiAgICAgICAgZDMuc2VsZWN0aW9uLmVudGVyLnByb3RvdHlwZS5pbnNlcnRTZWxlY3RvciA9XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdGlvbi5wcm90b3R5cGUuaW5zZXJ0U2VsZWN0b3IgPSBmdW5jdGlvbihzZWxlY3RvciwgYmVmb3JlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVXRpbHMuaW5zZXJ0U2VsZWN0b3IodGhpcywgc2VsZWN0b3IsIGJlZm9yZSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICBkMy5zZWxlY3Rpb24uZW50ZXIucHJvdG90eXBlLmFwcGVuZFNlbGVjdG9yID1cclxuICAgICAgICAgICAgZDMuc2VsZWN0aW9uLnByb3RvdHlwZS5hcHBlbmRTZWxlY3RvciA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVXRpbHMuYXBwZW5kU2VsZWN0b3IodGhpcywgc2VsZWN0b3IpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICBkMy5zZWxlY3Rpb24uZW50ZXIucHJvdG90eXBlLnNlbGVjdE9yQXBwZW5kID1cclxuICAgICAgICAgICAgZDMuc2VsZWN0aW9uLnByb3RvdHlwZS5zZWxlY3RPckFwcGVuZCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVXRpbHMuc2VsZWN0T3JBcHBlbmQodGhpcywgc2VsZWN0b3IpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICBkMy5zZWxlY3Rpb24uZW50ZXIucHJvdG90eXBlLnNlbGVjdE9ySW5zZXJ0ID1cclxuICAgICAgICAgICAgZDMuc2VsZWN0aW9uLnByb3RvdHlwZS5zZWxlY3RPckluc2VydCA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBiZWZvcmUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBVdGlscy5zZWxlY3RPckluc2VydCh0aGlzLCBzZWxlY3RvciwgYmVmb3JlKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcblxyXG5cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NoYXJ0LCBDaGFydENvbmZpZ30gZnJvbSBcIi4vY2hhcnRcIjtcclxuaW1wb3J0IHtIZWF0bWFwLCBIZWF0bWFwQ29uZmlnfSBmcm9tIFwiLi9oZWF0bWFwXCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7U3RhdGlzdGljc1V0aWxzfSBmcm9tICcuL3N0YXRpc3RpY3MtdXRpbHMnXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEhlYXRtYXBUaW1lU2VyaWVzQ29uZmlnIGV4dGVuZHMgSGVhdG1hcENvbmZpZyB7XHJcbiAgICB4ID0ge1xyXG4gICAgICAgIGZpbGxNaXNzaW5nOiBmYWxzZSwgLy8gZmlsbCBtaXNzaW5nIHZhbHVlcyB1c2luZyBpbnRlcnZhbCBhbmQgaW50ZXJ2YWxTdGVwXHJcbiAgICAgICAgaW50ZXJ2YWw6IHVuZGVmaW5lZCwgLy91c2VkIGluIGZpbGxpbmcgbWlzc2luZyB0aWNrc1xyXG4gICAgICAgIGludGVydmFsU3RlcDogMSxcclxuICAgICAgICBmb3JtYXQ6IHVuZGVmaW5lZCwgLy9pbnB1dCBkYXRhIGQzIHRpbWUgZm9ybWF0XHJcbiAgICAgICAgZGlzcGxheUZvcm1hdDogdW5kZWZpbmVkLC8vZDMgdGltZSBmb3JtYXQgZm9yIGRpc3BsYXlcclxuICAgICAgICBpbnRlcnZhbFRvRm9ybWF0czogWyAvL3VzZWQgdG8gZ3Vlc3MgaW50ZXJ2YWwgYW5kIGZvcm1hdFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAneWVhcicsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXRzOiBbXCIlWVwiXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnbW9udGgnLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0czogW1wiJVktJW1cIl1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2RheScsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXRzOiBbXCIlWS0lbS0lZFwiXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnaG91cicsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXRzOiBbJyVIJywgJyVZLSVtLSVkICVIJ11cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ21pbnV0ZScsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXRzOiBbJyVIOiVNJywgJyVZLSVtLSVkICVIOiVNJ11cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3NlY29uZCcsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXRzOiBbJyVIOiVNOiVTJywgJyVZLSVtLSVkICVIOiVNOiVTJ11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0sXHJcblxyXG4gICAgICAgIHNvcnRDb21wYXJhdG9yOiBmdW5jdGlvbiBzb3J0Q29tcGFyYXRvcihhLCBiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBVdGlscy5pc1N0cmluZyhhKSA/ICBhLmxvY2FsZUNvbXBhcmUoYikgOiAgYSAtIGI7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb3JtYXR0ZXI6IHVuZGVmaW5lZFxyXG4gICAgfTtcclxuICAgIHogPSB7XHJcbiAgICAgICAgZmlsbE1pc3Npbmc6IHRydWUgLy8gZmlpbGwgbWlzc2luZyB2YWx1ZXMgd2l0aCBuZWFyZXN0IHByZXZpb3VzIHZhbHVlXHJcbiAgICB9O1xyXG5cclxuICAgIGxlZ2VuZCA9IHtcclxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHZhciBzdWZmaXggPSBcIlwiO1xyXG4gICAgICAgICAgICBpZiAodiAvIDEwMDAwMDAgPj0gMSkge1xyXG4gICAgICAgICAgICAgICAgc3VmZml4ID0gXCIgTVwiO1xyXG4gICAgICAgICAgICAgICAgdiA9IE51bWJlcih2IC8gMTAwMDAwMCkudG9GaXhlZCgzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgbmYgPSBJbnRsLk51bWJlckZvcm1hdCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gbmYuZm9ybWF0KHYpICsgc3VmZml4O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgaWYgKGN1c3RvbSkge1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEhlYXRtYXBUaW1lU2VyaWVzIGV4dGVuZHMgSGVhdG1hcCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBzdXBlcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBuZXcgSGVhdG1hcFRpbWVTZXJpZXNDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZykge1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IEhlYXRtYXBUaW1lU2VyaWVzQ29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBzZXR1cFZhbHVlc0JlZm9yZUdyb3Vwc1NvcnQoKSB7XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC54LnRpbWVGb3JtYXQgPSB0aGlzLmNvbmZpZy54LmZvcm1hdDtcclxuICAgICAgICBpZih0aGlzLmNvbmZpZy54LmRpc3BsYXlGb3JtYXQgJiYgIXRoaXMucGxvdC54LnRpbWVGb3JtYXQpe1xyXG4gICAgICAgICAgICB0aGlzLmd1ZXNzVGltZUZvcm1hdCgpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHN1cGVyLnNldHVwVmFsdWVzQmVmb3JlR3JvdXBzU29ydCgpO1xyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcueC5maWxsTWlzc2luZykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdFRpbWVGb3JtYXRBbmRJbnRlcnZhbCgpO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueC5pbnRlcnZhbFN0ZXAgPSB0aGlzLmNvbmZpZy54LmludGVydmFsU3RlcCB8fCAxO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueC50aW1lUGFyc2VyID0gdGhpcy5nZXRUaW1lUGFyc2VyKCk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5wbG90LngudW5pcXVlVmFsdWVzLnNvcnQodGhpcy5jb25maWcueC5zb3J0Q29tcGFyYXRvcik7XHJcblxyXG4gICAgICAgIHZhciBwcmV2ID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LngudW5pcXVlVmFsdWVzLmZvckVhY2goKHgsIGkpPT4ge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudCA9IHRoaXMucGFyc2VUaW1lKHgpO1xyXG4gICAgICAgICAgICBpZiAocHJldiA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcHJldiA9IGN1cnJlbnQ7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBuZXh0ID0gc2VsZi5uZXh0VGltZVRpY2tWYWx1ZShwcmV2KTtcclxuICAgICAgICAgICAgdmFyIG1pc3NpbmcgPSBbXTtcclxuICAgICAgICAgICAgdmFyIGl0ZXJhdGlvbiA9IDA7XHJcbiAgICAgICAgICAgIHdoaWxlIChzZWxmLmNvbXBhcmVUaW1lVmFsdWVzKG5leHQsIGN1cnJlbnQpPD0wKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVyYXRpb24rKztcclxuICAgICAgICAgICAgICAgIGlmIChpdGVyYXRpb24gPiAxMDApIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBkID0ge307XHJcbiAgICAgICAgICAgICAgICB2YXIgdGltZVN0cmluZyA9IHNlbGYuZm9ybWF0VGltZShuZXh0KTtcclxuICAgICAgICAgICAgICAgIGRbdGhpcy5jb25maWcueC5rZXldID0gdGltZVN0cmluZztcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnVwZGF0ZUdyb3VwcyhkLCB0aW1lU3RyaW5nLCBzZWxmLnBsb3QueC5ncm91cHMsIHNlbGYuY29uZmlnLnguZ3JvdXBzKTtcclxuICAgICAgICAgICAgICAgIG1pc3NpbmcucHVzaChuZXh0KTtcclxuICAgICAgICAgICAgICAgIG5leHQgPSBzZWxmLm5leHRUaW1lVGlja1ZhbHVlKG5leHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByZXYgPSBjdXJyZW50O1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwYXJzZVRpbWUoeCkge1xyXG4gICAgICAgIHZhciBwYXJzZXIgPSB0aGlzLmdldFRpbWVQYXJzZXIoKTtcclxuICAgICAgICByZXR1cm4gcGFyc2VyLnBhcnNlKHgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcm1hdFRpbWUoZGF0ZSl7XHJcbiAgICAgICAgdmFyIHBhcnNlciA9IHRoaXMuZ2V0VGltZVBhcnNlcigpO1xyXG4gICAgICAgIHJldHVybiBwYXJzZXIoZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9ybWF0VmFsdWVYKHZhbHVlKSB7IC8vdXNlZCBvbmx5IGZvciBkaXNwbGF5XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnguZm9ybWF0dGVyKSByZXR1cm4gdGhpcy5jb25maWcueC5mb3JtYXR0ZXIuY2FsbCh0aGlzLmNvbmZpZywgdmFsdWUpO1xyXG5cclxuICAgICAgICBpZih0aGlzLmNvbmZpZy54LmRpc3BsYXlGb3JtYXQpe1xyXG4gICAgICAgICAgICB2YXIgZGF0ZSA9IHRoaXMucGFyc2VUaW1lKHZhbHVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGQzLnRpbWUuZm9ybWF0KHRoaXMuY29uZmlnLnguZGlzcGxheUZvcm1hdCkoZGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZighdGhpcy5wbG90LngudGltZUZvcm1hdCkgcmV0dXJuIHZhbHVlO1xyXG5cclxuICAgICAgICBpZihVdGlscy5pc0RhdGUodmFsdWUpKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0VGltZSh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcGFyZVRpbWVWYWx1ZXMoYSwgYil7XHJcbiAgICAgICAgcmV0dXJuIGEtYjtcclxuICAgIH1cclxuXHJcbiAgICB0aW1lVmFsdWVzRXF1YWwoYSwgYikge1xyXG4gICAgICAgIHZhciBwYXJzZXIgPSB0aGlzLnBsb3QueC50aW1lUGFyc2VyO1xyXG4gICAgICAgIHJldHVybiBwYXJzZXIoYSkgPT09IHBhcnNlcihiKTtcclxuICAgIH1cclxuXHJcbiAgICBuZXh0VGltZVRpY2tWYWx1ZSh0KSB7XHJcbiAgICAgICAgdmFyIGludGVydmFsID0gdGhpcy5wbG90LnguaW50ZXJ2YWw7XHJcbiAgICAgICAgcmV0dXJuIGQzLnRpbWVbaW50ZXJ2YWxdLm9mZnNldCh0LCB0aGlzLnBsb3QueC5pbnRlcnZhbFN0ZXApO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy56LmZpbGxNaXNzaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5tYXRyaXguZm9yRWFjaCgocm93LCByb3dJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByZXZSb3dWYWx1ZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIHJvdy5mb3JFYWNoKChjZWxsLCBjb2xJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjZWxsLnZhbHVlID09PSB1bmRlZmluZWQgJiYgcHJldlJvd1ZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC52YWx1ZSA9IHByZXZSb3dWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5taXNzaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldlJvd1ZhbHVlID0gY2VsbC52YWx1ZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUobmV3RGF0YSkge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuXHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBpbml0VGltZUZvcm1hdEFuZEludGVydmFsKCkge1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueC5pbnRlcnZhbCA9IHRoaXMuY29uZmlnLnguaW50ZXJ2YWw7XHJcblxyXG4gICAgICAgIGlmKCF0aGlzLnBsb3QueC50aW1lRm9ybWF0KXtcclxuICAgICAgICAgICAgdGhpcy5ndWVzc1RpbWVGb3JtYXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCF0aGlzLnBsb3QueC5pbnRlcnZhbCAmJiB0aGlzLnBsb3QueC50aW1lRm9ybWF0KXtcclxuICAgICAgICAgICAgdGhpcy5ndWVzc0ludGVydmFsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGd1ZXNzVGltZUZvcm1hdCgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGkgPCBzZWxmLmNvbmZpZy54LmludGVydmFsVG9Gb3JtYXRzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IGludGVydmFsRm9ybWF0ID0gc2VsZi5jb25maWcueC5pbnRlcnZhbFRvRm9ybWF0c1tpXTtcclxuICAgICAgICAgICAgdmFyIGZvcm1hdCA9IG51bGw7XHJcbiAgICAgICAgICAgIHZhciBmb3JtYXRNYXRjaCA9IGludGVydmFsRm9ybWF0LmZvcm1hdHMuc29tZShmPT57XHJcbiAgICAgICAgICAgICAgICBmb3JtYXQgPSBmO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcnNlciA9IGQzLnRpbWUuZm9ybWF0KGYpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYucGxvdC54LnVuaXF1ZVZhbHVlcy5ldmVyeSh4PT57XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZSh4KSAhPT0gbnVsbFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZihmb3JtYXRNYXRjaCl7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QueC50aW1lRm9ybWF0ID0gZm9ybWF0O1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0d1ZXNzZWQgdGltZUZvcm1hdCcsIGZvcm1hdCk7XHJcbiAgICAgICAgICAgICAgICBpZighc2VsZi5wbG90LnguaW50ZXJ2YWwpe1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucGxvdC54LmludGVydmFsID0gaW50ZXJ2YWxGb3JtYXQubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnR3Vlc3NlZCBpbnRlcnZhbCcsIHNlbGYucGxvdC54LmludGVydmFsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBndWVzc0ludGVydmFsKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBmb3IobGV0IGk9MDsgaSA8IHNlbGYuY29uZmlnLnguaW50ZXJ2YWxUb0Zvcm1hdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGludGVydmFsRm9ybWF0ID0gc2VsZi5jb25maWcueC5pbnRlcnZhbFRvRm9ybWF0c1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmKGludGVydmFsRm9ybWF0LmZvcm1hdHMuaW5kZXhPZihzZWxmLnBsb3QueC50aW1lRm9ybWF0KSA+PSAwKXtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC54LmludGVydmFsID0gaW50ZXJ2YWxGb3JtYXQubmFtZTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHdWVzc2VkIGludGVydmFsJywgc2VsZi5wbG90LnguaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldFRpbWVQYXJzZXIoKSB7XHJcbiAgICAgICAgaWYoIXRoaXMucGxvdC54LnRpbWVQYXJzZXIpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QueC50aW1lUGFyc2VyID0gZDMudGltZS5mb3JtYXQodGhpcy5wbG90LngudGltZUZvcm1hdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnBsb3QueC50aW1lUGFyc2VyO1xyXG4gICAgfVxyXG59XHJcblxyXG4iLCJpbXBvcnQge0NoYXJ0LCBDaGFydENvbmZpZ30gZnJvbSBcIi4vY2hhcnRcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IHtMZWdlbmR9IGZyb20gJy4vbGVnZW5kJ1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBIZWF0bWFwQ29uZmlnIGV4dGVuZHMgQ2hhcnRDb25maWcge1xyXG5cclxuICAgIHN2Z0NsYXNzID0gJ29kYy1oZWF0bWFwJztcclxuICAgIHNob3dUb29sdGlwID0gdHJ1ZTsgLy9zaG93IHRvb2x0aXAgb24gZG90IGhvdmVyXHJcbiAgICB0b29sdGlwID0ge1xyXG4gICAgICAgIG5vRGF0YVRleHQ6IFwiTi9BXCJcclxuICAgIH07XHJcbiAgICBzaG93TGVnZW5kID0gdHJ1ZTtcclxuICAgIGxlZ2VuZCA9IHtcclxuICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgcm90YXRlTGFiZWxzOiBmYWxzZSxcclxuICAgICAgICBkZWNpbWFsUGxhY2VzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgZm9ybWF0dGVyOiB2ID0+IHRoaXMubGVnZW5kLmRlY2ltYWxQbGFjZXMgPT09IHVuZGVmaW5lZCA/IHYgOiBOdW1iZXIodikudG9GaXhlZCh0aGlzLmxlZ2VuZC5kZWNpbWFsUGxhY2VzKVxyXG4gICAgfVxyXG4gICAgaGlnaGxpZ2h0TGFiZWxzID0gdHJ1ZTtcclxuICAgIHggPSB7Ly8gWCBheGlzIGNvbmZpZ1xyXG4gICAgICAgIHRpdGxlOiAnJywgLy8gYXhpcyB0aXRsZVxyXG4gICAgICAgIGtleTogMCxcclxuICAgICAgICB2YWx1ZTogKGQpID0+IGRbdGhpcy54LmtleV0sIC8vIHggdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICByb3RhdGVMYWJlbHM6IHRydWUsXHJcbiAgICAgICAgc29ydExhYmVsczogZmFsc2UsXHJcbiAgICAgICAgc29ydENvbXBhcmF0b3I6IChhLCBiKT0+IFV0aWxzLmlzTnVtYmVyKGEpID8gYSAtIGIgOiBhLmxvY2FsZUNvbXBhcmUoYiksXHJcbiAgICAgICAgZ3JvdXBzOiB7XHJcbiAgICAgICAgICAgIGtleXM6IFtdLFxyXG4gICAgICAgICAgICBsYWJlbHM6IFtdLFxyXG4gICAgICAgICAgICB2YWx1ZTogKGQsIGtleSkgPT4gZFtrZXldLFxyXG4gICAgICAgICAgICBvdmVybGFwOiB7XHJcbiAgICAgICAgICAgICAgICB0b3A6IDIwLFxyXG4gICAgICAgICAgICAgICAgYm90dG9tOiAyMFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb3JtYXR0ZXI6IHVuZGVmaW5lZCAvLyB2YWx1ZSBmb3JtYXR0ZXIgZnVuY3Rpb25cclxuXHJcbiAgICB9O1xyXG4gICAgeSA9IHsvLyBZIGF4aXMgY29uZmlnXHJcbiAgICAgICAgdGl0bGU6ICcnLCAvLyBheGlzIHRpdGxlLFxyXG4gICAgICAgIHJvdGF0ZUxhYmVsczogdHJ1ZSxcclxuICAgICAgICBrZXk6IDEsXHJcbiAgICAgICAgdmFsdWU6IChkKSA9PiBkW3RoaXMueS5rZXldLCAvLyB5IHZhbHVlIGFjY2Vzc29yXHJcbiAgICAgICAgc29ydExhYmVsczogZmFsc2UsXHJcbiAgICAgICAgc29ydENvbXBhcmF0b3I6IChhLCBiKT0+IFV0aWxzLmlzTnVtYmVyKGIpID8gYiAtIGEgOiBiLmxvY2FsZUNvbXBhcmUoYSksXHJcbiAgICAgICAgZ3JvdXBzOiB7XHJcbiAgICAgICAgICAgIGtleXM6IFtdLFxyXG4gICAgICAgICAgICBsYWJlbHM6IFtdLFxyXG4gICAgICAgICAgICB2YWx1ZTogKGQsIGtleSkgPT4gZFtrZXldLFxyXG4gICAgICAgICAgICBvdmVybGFwOiB7XHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAyMCxcclxuICAgICAgICAgICAgICAgIHJpZ2h0OiAyMFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb3JtYXR0ZXI6IHVuZGVmaW5lZC8vIHZhbHVlIGZvcm1hdHRlciBmdW5jdGlvblxyXG4gICAgfTtcclxuICAgIHogPSB7XHJcbiAgICAgICAga2V5OiAyLFxyXG4gICAgICAgIHZhbHVlOiAoZCkgPT4gZFt0aGlzLnoua2V5XSxcclxuICAgICAgICBub3RBdmFpbGFibGVWYWx1ZTogKHYpID0+IHYgPT09IG51bGwgfHwgdiA9PT0gdW5kZWZpbmVkLFxyXG5cclxuICAgICAgICBkZWNpbWFsUGxhY2VzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgZm9ybWF0dGVyOiB2ID0+IHRoaXMuei5kZWNpbWFsUGxhY2VzID09PSB1bmRlZmluZWQgPyB2IDogTnVtYmVyKHYpLnRvRml4ZWQodGhpcy56LmRlY2ltYWxQbGFjZXMpLy8gdmFsdWUgZm9ybWF0dGVyIGZ1bmN0aW9uXHJcblxyXG4gICAgfTtcclxuICAgIGNvbG9yID0ge1xyXG4gICAgICAgIG5vRGF0YUNvbG9yOiBcIndoaXRlXCIsXHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCIsXHJcbiAgICAgICAgcmV2ZXJzZVNjYWxlOiBmYWxzZSxcclxuICAgICAgICByYW5nZTogW1wiZGFya2JsdWVcIiwgXCJsaWdodHNreWJsdWVcIiwgXCJvcmFuZ2VcIiwgXCJjcmltc29uXCIsIFwiZGFya3JlZFwiXVxyXG4gICAgfTtcclxuICAgIGNlbGwgPSB7XHJcbiAgICAgICAgd2lkdGg6IHVuZGVmaW5lZCxcclxuICAgICAgICBoZWlnaHQ6IHVuZGVmaW5lZCxcclxuICAgICAgICBzaXplTWluOiAxNSxcclxuICAgICAgICBzaXplTWF4OiAyNTAsXHJcbiAgICAgICAgcGFkZGluZzogMFxyXG4gICAgfTtcclxuICAgIG1hcmdpbiA9IHtcclxuICAgICAgICBsZWZ0OiA2MCxcclxuICAgICAgICByaWdodDogNTAsXHJcbiAgICAgICAgdG9wOiAzMCxcclxuICAgICAgICBib3R0b206IDgwXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgaWYgKGN1c3RvbSkge1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vL1RPRE8gcmVmYWN0b3JcclxuZXhwb3J0IGNsYXNzIEhlYXRtYXAgZXh0ZW5kcyBDaGFydCB7XHJcblxyXG4gICAgc3RhdGljIG1heEdyb3VwR2FwU2l6ZSA9IDI0O1xyXG4gICAgc3RhdGljIGdyb3VwVGl0bGVSZWN0SGVpZ2h0ID0gNjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBzdXBlcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBuZXcgSGVhdG1hcENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgSGVhdG1hcENvbmZpZyhjb25maWcpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdFBsb3QoKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG1hcmdpbiA9IHRoaXMuY29uZmlnLm1hcmdpbjtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueCA9IHt9O1xyXG4gICAgICAgIHRoaXMucGxvdC55ID0ge307XHJcbiAgICAgICAgdGhpcy5wbG90LnogPSB7XHJcbiAgICAgICAgICAgIG1hdHJpeGVzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGNlbGxzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGNvbG9yOiB7fSxcclxuICAgICAgICAgICAgc2hhcGU6IHt9XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBWYWx1ZXMoKTtcclxuICAgICAgICB0aGlzLmJ1aWxkQ2VsbHMoKTtcclxuXHJcbiAgICAgICAgdmFyIHRpdGxlUmVjdFdpZHRoID0gNjtcclxuICAgICAgICB0aGlzLnBsb3QueC5vdmVybGFwID0ge1xyXG4gICAgICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgICAgIGJvdHRvbTogMFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKHRoaXMucGxvdC5ncm91cEJ5WCkge1xyXG4gICAgICAgICAgICBsZXQgZGVwdGggPSBzZWxmLmNvbmZpZy54Lmdyb3Vwcy5rZXlzLmxlbmd0aDtcclxuICAgICAgICAgICAgbGV0IGFsbFRpdGxlc1dpZHRoID0gZGVwdGggKiAodGl0bGVSZWN0V2lkdGgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wbG90Lngub3ZlcmxhcC5ib3R0b20gPSBzZWxmLmNvbmZpZy54Lmdyb3Vwcy5vdmVybGFwLmJvdHRvbTtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lngub3ZlcmxhcC50b3AgPSBzZWxmLmNvbmZpZy54Lmdyb3Vwcy5vdmVybGFwLnRvcCArIGFsbFRpdGxlc1dpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWFyZ2luLnRvcCA9IGNvbmYubWFyZ2luLnJpZ2h0ICsgY29uZi54Lmdyb3Vwcy5vdmVybGFwLnRvcDtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lm1hcmdpbi5ib3R0b20gPSBjb25mLm1hcmdpbi5ib3R0b20gKyBjb25mLnguZ3JvdXBzLm92ZXJsYXAuYm90dG9tO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMucGxvdC55Lm92ZXJsYXAgPSB7XHJcbiAgICAgICAgICAgIGxlZnQ6IDAsXHJcbiAgICAgICAgICAgIHJpZ2h0OiAwXHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBsb3QuZ3JvdXBCeVkpIHtcclxuICAgICAgICAgICAgbGV0IGRlcHRoID0gc2VsZi5jb25maWcueS5ncm91cHMua2V5cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGxldCBhbGxUaXRsZXNXaWR0aCA9IGRlcHRoICogKHRpdGxlUmVjdFdpZHRoKTtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lnkub3ZlcmxhcC5yaWdodCA9IHNlbGYuY29uZmlnLnkuZ3JvdXBzLm92ZXJsYXAubGVmdCArIGFsbFRpdGxlc1dpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QueS5vdmVybGFwLmxlZnQgPSBzZWxmLmNvbmZpZy55Lmdyb3Vwcy5vdmVybGFwLmxlZnQ7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5tYXJnaW4ubGVmdCA9IGNvbmYubWFyZ2luLmxlZnQgKyB0aGlzLnBsb3QueS5vdmVybGFwLmxlZnQ7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5tYXJnaW4ucmlnaHQgPSBjb25mLm1hcmdpbi5yaWdodCArIHRoaXMucGxvdC55Lm92ZXJsYXAucmlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxvdC5zaG93TGVnZW5kID0gY29uZi5zaG93TGVnZW5kO1xyXG4gICAgICAgIGlmICh0aGlzLnBsb3Quc2hvd0xlZ2VuZCkge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWFyZ2luLnJpZ2h0ICs9IGNvbmYubGVnZW5kLndpZHRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNvbXB1dGVQbG90U2l6ZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBaU2NhbGUoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXBWYWx1ZXMoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBjb25maWcgPSBzZWxmLmNvbmZpZztcclxuICAgICAgICB2YXIgeCA9IHNlbGYucGxvdC54O1xyXG4gICAgICAgIHZhciB5ID0gc2VsZi5wbG90Lnk7XHJcbiAgICAgICAgdmFyIHogPSBzZWxmLnBsb3QuejtcclxuXHJcblxyXG4gICAgICAgIHgudmFsdWUgPSBkID0+IGNvbmZpZy54LnZhbHVlLmNhbGwoY29uZmlnLCBkKTtcclxuICAgICAgICB5LnZhbHVlID0gZCA9PiBjb25maWcueS52YWx1ZS5jYWxsKGNvbmZpZywgZCk7XHJcbiAgICAgICAgei52YWx1ZSA9IGQgPT4gY29uZmlnLnoudmFsdWUuY2FsbChjb25maWcsIGQpO1xyXG5cclxuICAgICAgICB4LnVuaXF1ZVZhbHVlcyA9IFtdO1xyXG4gICAgICAgIHkudW5pcXVlVmFsdWVzID0gW107XHJcblxyXG5cclxuICAgICAgICBzZWxmLnBsb3QuZ3JvdXBCeVkgPSAhIWNvbmZpZy55Lmdyb3Vwcy5rZXlzLmxlbmd0aDtcclxuICAgICAgICBzZWxmLnBsb3QuZ3JvdXBCeVggPSAhIWNvbmZpZy54Lmdyb3Vwcy5rZXlzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgeS5ncm91cHMgPSB7XHJcbiAgICAgICAgICAgIGtleTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBsYWJlbDogJycsXHJcbiAgICAgICAgICAgIHZhbHVlczogW10sXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBudWxsLFxyXG4gICAgICAgICAgICBsZXZlbDogMCxcclxuICAgICAgICAgICAgaW5kZXg6IDAsXHJcbiAgICAgICAgICAgIGxhc3RJbmRleDogMFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgeC5ncm91cHMgPSB7XHJcbiAgICAgICAgICAgIGtleTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBsYWJlbDogJycsXHJcbiAgICAgICAgICAgIHZhbHVlczogW10sXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBudWxsLFxyXG4gICAgICAgICAgICBsZXZlbDogMCxcclxuICAgICAgICAgICAgaW5kZXg6IDAsXHJcbiAgICAgICAgICAgIGxhc3RJbmRleDogMFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciB2YWx1ZU1hcCA9IHt9O1xyXG4gICAgICAgIHZhciBtaW5aID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHZhciBtYXhaID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuZGF0YS5mb3JFYWNoKGQ9PiB7XHJcblxyXG4gICAgICAgICAgICB2YXIgeFZhbCA9IHgudmFsdWUoZCk7XHJcbiAgICAgICAgICAgIHZhciB5VmFsID0geS52YWx1ZShkKTtcclxuICAgICAgICAgICAgdmFyIHpWYWxSYXcgPSB6LnZhbHVlKGQpO1xyXG4gICAgICAgICAgICB2YXIgelZhbCA9IGNvbmZpZy56Lm5vdEF2YWlsYWJsZVZhbHVlKHpWYWxSYXcpID8gdW5kZWZpbmVkIDogcGFyc2VGbG9hdCh6VmFsUmF3KTtcclxuXHJcblxyXG4gICAgICAgICAgICBpZiAoeC51bmlxdWVWYWx1ZXMuaW5kZXhPZih4VmFsKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHgudW5pcXVlVmFsdWVzLnB1c2goeFZhbCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh5LnVuaXF1ZVZhbHVlcy5pbmRleE9mKHlWYWwpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgeS51bmlxdWVWYWx1ZXMucHVzaCh5VmFsKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGdyb3VwWSA9IHkuZ3JvdXBzO1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5wbG90Lmdyb3VwQnlZKSB7XHJcbiAgICAgICAgICAgICAgICBncm91cFkgPSB0aGlzLnVwZGF0ZUdyb3VwcyhkLCB5VmFsLCB5Lmdyb3VwcywgY29uZmlnLnkuZ3JvdXBzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZ3JvdXBYID0geC5ncm91cHM7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnBsb3QuZ3JvdXBCeVgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBncm91cFggPSB0aGlzLnVwZGF0ZUdyb3VwcyhkLCB4VmFsLCB4Lmdyb3VwcywgY29uZmlnLnguZ3JvdXBzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCF2YWx1ZU1hcFtncm91cFkuaW5kZXhdKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZU1hcFtncm91cFkuaW5kZXhdID0ge307XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghdmFsdWVNYXBbZ3JvdXBZLmluZGV4XVtncm91cFguaW5kZXhdKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZU1hcFtncm91cFkuaW5kZXhdW2dyb3VwWC5pbmRleF0gPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXZhbHVlTWFwW2dyb3VwWS5pbmRleF1bZ3JvdXBYLmluZGV4XVt5VmFsXSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWVNYXBbZ3JvdXBZLmluZGV4XVtncm91cFguaW5kZXhdW3lWYWxdID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFsdWVNYXBbZ3JvdXBZLmluZGV4XVtncm91cFguaW5kZXhdW3lWYWxdW3hWYWxdID0gelZhbDtcclxuXHJcblxyXG4gICAgICAgICAgICBpZiAobWluWiA9PT0gdW5kZWZpbmVkIHx8IHpWYWwgPCBtaW5aKSB7XHJcbiAgICAgICAgICAgICAgICBtaW5aID0gelZhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobWF4WiA9PT0gdW5kZWZpbmVkIHx8IHpWYWwgPiBtYXhaKSB7XHJcbiAgICAgICAgICAgICAgICBtYXhaID0gelZhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHNlbGYucGxvdC52YWx1ZU1hcCA9IHZhbHVlTWFwO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKCFzZWxmLnBsb3QuZ3JvdXBCeVgpIHtcclxuICAgICAgICAgICAgeC5ncm91cHMudmFsdWVzID0geC51bmlxdWVWYWx1ZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXNlbGYucGxvdC5ncm91cEJ5WSkge1xyXG4gICAgICAgICAgICB5Lmdyb3Vwcy52YWx1ZXMgPSB5LnVuaXF1ZVZhbHVlcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBWYWx1ZXNCZWZvcmVHcm91cHNTb3J0KCk7XHJcblxyXG4gICAgICAgIHguZ2FwcyA9IFtdO1xyXG4gICAgICAgIHgudG90YWxWYWx1ZXNDb3VudCA9IDA7XHJcbiAgICAgICAgeC5hbGxWYWx1ZXNMaXN0ID0gW107XHJcbiAgICAgICAgdGhpcy5zb3J0R3JvdXBzKHgsIHguZ3JvdXBzLCBjb25maWcueCk7XHJcblxyXG4gICAgICAgIHkuZ2FwcyA9IFtdO1xyXG4gICAgICAgIHkudG90YWxWYWx1ZXNDb3VudCA9IDA7XHJcbiAgICAgICAgeS5hbGxWYWx1ZXNMaXN0ID0gW107XHJcbiAgICAgICAgdGhpcy5zb3J0R3JvdXBzKHksIHkuZ3JvdXBzLCBjb25maWcueSk7XHJcblxyXG4gICAgICAgIHoubWluID0gbWluWjtcclxuICAgICAgICB6Lm1heCA9IG1heFo7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNldHVwVmFsdWVzQmVmb3JlR3JvdXBzU29ydCgpIHtcclxuICAgIH1cclxuXHJcbiAgICBidWlsZENlbGxzKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgeCA9IHNlbGYucGxvdC54O1xyXG4gICAgICAgIHZhciB5ID0gc2VsZi5wbG90Lnk7XHJcbiAgICAgICAgdmFyIHogPSBzZWxmLnBsb3QuejtcclxuICAgICAgICB2YXIgdmFsdWVNYXAgPSBzZWxmLnBsb3QudmFsdWVNYXA7XHJcblxyXG4gICAgICAgIHZhciBtYXRyaXhDZWxscyA9IHNlbGYucGxvdC5jZWxscyA9IFtdO1xyXG4gICAgICAgIHZhciBtYXRyaXggPSBzZWxmLnBsb3QubWF0cml4ID0gW107XHJcblxyXG4gICAgICAgIHkuYWxsVmFsdWVzTGlzdC5mb3JFYWNoKCh2MSwgaSk9PiB7XHJcbiAgICAgICAgICAgIHZhciByb3cgPSBbXTtcclxuICAgICAgICAgICAgbWF0cml4LnB1c2gocm93KTtcclxuXHJcbiAgICAgICAgICAgIHguYWxsVmFsdWVzTGlzdC5mb3JFYWNoKCh2MiwgaikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHpWYWwgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHpWYWwgPSB2YWx1ZU1hcFt2MS5ncm91cC5pbmRleF1bdjIuZ3JvdXAuaW5kZXhdW3YxLnZhbF1bdjIudmFsXVxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBjZWxsID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvd1ZhcjogdjEsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sVmFyOiB2MixcclxuICAgICAgICAgICAgICAgICAgICByb3c6IGksXHJcbiAgICAgICAgICAgICAgICAgICAgY29sOiBqLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB6VmFsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcm93LnB1c2goY2VsbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbWF0cml4Q2VsbHMucHVzaChjZWxsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUdyb3VwcyhkLCBheGlzVmFsLCByb290R3JvdXAsIGF4aXNHcm91cHNDb25maWcpIHtcclxuXHJcbiAgICAgICAgdmFyIGNvbmZpZyA9IHRoaXMuY29uZmlnO1xyXG4gICAgICAgIHZhciBjdXJyZW50R3JvdXAgPSByb290R3JvdXA7XHJcbiAgICAgICAgYXhpc0dyb3Vwc0NvbmZpZy5rZXlzLmZvckVhY2goKGdyb3VwS2V5LCBncm91cEtleUluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRHcm91cC5rZXkgPSBncm91cEtleTtcclxuXHJcbiAgICAgICAgICAgIGlmICghY3VycmVudEdyb3VwLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAuY2hpbGRyZW4gPSB7fTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGdyb3VwaW5nVmFsdWUgPSBheGlzR3JvdXBzQ29uZmlnLnZhbHVlLmNhbGwoY29uZmlnLCBkLCBncm91cEtleSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWN1cnJlbnRHcm91cC5jaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShncm91cGluZ1ZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcm9vdEdyb3VwLmxhc3RJbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLmNoaWxkcmVuW2dyb3VwaW5nVmFsdWVdID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlczogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBpbmdWYWx1ZTogZ3JvdXBpbmdWYWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICBsZXZlbDogY3VycmVudEdyb3VwLmxldmVsICsgMSxcclxuICAgICAgICAgICAgICAgICAgICBpbmRleDogcm9vdEdyb3VwLmxhc3RJbmRleCxcclxuICAgICAgICAgICAgICAgICAgICBrZXk6IGdyb3VwS2V5XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGN1cnJlbnRHcm91cCA9IGN1cnJlbnRHcm91cC5jaGlsZHJlbltncm91cGluZ1ZhbHVlXTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKGN1cnJlbnRHcm91cC52YWx1ZXMuaW5kZXhPZihheGlzVmFsKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgY3VycmVudEdyb3VwLnZhbHVlcy5wdXNoKGF4aXNWYWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRHcm91cDtcclxuICAgIH1cclxuXHJcbiAgICBzb3J0R3JvdXBzKGF4aXMsIGdyb3VwLCBheGlzQ29uZmlnLCBnYXBzKSB7XHJcbiAgICAgICAgaWYgKGF4aXNDb25maWcuZ3JvdXBzLmxhYmVscyAmJiBheGlzQ29uZmlnLmdyb3Vwcy5sYWJlbHMubGVuZ3RoID4gZ3JvdXAubGV2ZWwpIHtcclxuICAgICAgICAgICAgZ3JvdXAubGFiZWwgPSBheGlzQ29uZmlnLmdyb3Vwcy5sYWJlbHNbZ3JvdXAubGV2ZWxdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGdyb3VwLmxhYmVsID0gZ3JvdXAua2V5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFnYXBzKSB7XHJcbiAgICAgICAgICAgIGdhcHMgPSBbMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChnYXBzLmxlbmd0aCA8PSBncm91cC5sZXZlbCkge1xyXG4gICAgICAgICAgICBnYXBzLnB1c2goMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBncm91cC5hbGxWYWx1ZXNDb3VudCA9IGdyb3VwLmFsbFZhbHVlc0NvdW50IHx8IDA7XHJcbiAgICAgICAgZ3JvdXAuYWxsVmFsdWVzQmVmb3JlQ291bnQgPSBncm91cC5hbGxWYWx1ZXNCZWZvcmVDb3VudCB8fCAwO1xyXG5cclxuICAgICAgICBncm91cC5nYXBzID0gZ2Fwcy5zbGljZSgpO1xyXG4gICAgICAgIGdyb3VwLmdhcHNCZWZvcmUgPSBnYXBzLnNsaWNlKCk7XHJcblxyXG5cclxuICAgICAgICBncm91cC5nYXBzU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcHNTaXplKGdyb3VwLmdhcHMpO1xyXG4gICAgICAgIGdyb3VwLmdhcHNCZWZvcmVTaXplID0gZ3JvdXAuZ2Fwc1NpemU7XHJcbiAgICAgICAgaWYgKGdyb3VwLnZhbHVlcykge1xyXG4gICAgICAgICAgICBpZiAoYXhpc0NvbmZpZy5zb3J0TGFiZWxzKSB7XHJcbiAgICAgICAgICAgICAgICBncm91cC52YWx1ZXMuc29ydChheGlzQ29uZmlnLnNvcnRDb21wYXJhdG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBncm91cC52YWx1ZXMuZm9yRWFjaCh2PT5heGlzLmFsbFZhbHVlc0xpc3QucHVzaCh7dmFsOiB2LCBncm91cDogZ3JvdXB9KSk7XHJcbiAgICAgICAgICAgIGdyb3VwLmFsbFZhbHVlc0JlZm9yZUNvdW50ID0gYXhpcy50b3RhbFZhbHVlc0NvdW50O1xyXG4gICAgICAgICAgICBheGlzLnRvdGFsVmFsdWVzQ291bnQgKz0gZ3JvdXAudmFsdWVzLmxlbmd0aDtcclxuICAgICAgICAgICAgZ3JvdXAuYWxsVmFsdWVzQ291bnQgKz0gZ3JvdXAudmFsdWVzLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdyb3VwLmNoaWxkcmVuTGlzdCA9IFtdO1xyXG4gICAgICAgIGlmIChncm91cC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRyZW5Db3VudCA9IDA7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBjaGlsZFByb3AgaW4gZ3JvdXAuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgIGlmIChncm91cC5jaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShjaGlsZFByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gZ3JvdXAuY2hpbGRyZW5bY2hpbGRQcm9wXTtcclxuICAgICAgICAgICAgICAgICAgICBncm91cC5jaGlsZHJlbkxpc3QucHVzaChjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW5Db3VudCsrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvcnRHcm91cHMoYXhpcywgY2hpbGQsIGF4aXNDb25maWcsIGdhcHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwLmFsbFZhbHVlc0NvdW50ICs9IGNoaWxkLmFsbFZhbHVlc0NvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGdhcHNbZ3JvdXAubGV2ZWxdICs9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChnYXBzICYmIGNoaWxkcmVuQ291bnQgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICBnYXBzW2dyb3VwLmxldmVsXSAtPSAxO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBncm91cC5nYXBzSW5zaWRlID0gW107XHJcbiAgICAgICAgICAgIGdhcHMuZm9yRWFjaCgoZCwgaSk9PiB7XHJcbiAgICAgICAgICAgICAgICBncm91cC5nYXBzSW5zaWRlLnB1c2goZCAtIChncm91cC5nYXBzQmVmb3JlW2ldIHx8IDApKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGdyb3VwLmdhcHNJbnNpZGVTaXplID0gSGVhdG1hcC5jb21wdXRlR2Fwc1NpemUoZ3JvdXAuZ2Fwc0luc2lkZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoYXhpcy5nYXBzLmxlbmd0aCA8IGdhcHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBheGlzLmdhcHMgPSBnYXBzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBjb21wdXRlWUF4aXNMYWJlbHNXaWR0aChvZmZzZXQpIHtcclxuICAgICAgICB2YXIgbWF4V2lkdGggPSB0aGlzLnBsb3QubWFyZ2luLmxlZnQ7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnkudGl0bGUpIHtcclxuICAgICAgICAgICAgbWF4V2lkdGggLT0gMTU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvZmZzZXQgJiYgb2Zmc2V0LngpIHtcclxuICAgICAgICAgICAgbWF4V2lkdGggKz0gb2Zmc2V0Lng7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcueS5yb3RhdGVMYWJlbHMpIHtcclxuICAgICAgICAgICAgbWF4V2lkdGggKj0gVXRpbHMuU1FSVF8yO1xyXG4gICAgICAgICAgICB2YXIgZm9udFNpemUgPSAxMTsgLy90b2RvIGNoZWNrIGFjdHVhbCBmb250IHNpemVcclxuICAgICAgICAgICAgbWF4V2lkdGggLT1mb250U2l6ZS8yO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG1heFdpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXB1dGVYQXhpc0xhYmVsc1dpZHRoKG9mZnNldCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcueC5yb3RhdGVMYWJlbHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGxvdC5jZWxsV2lkdGggLSAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc2l6ZSA9IHRoaXMucGxvdC5tYXJnaW4uYm90dG9tO1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy54LnRpdGxlKSB7XHJcbiAgICAgICAgICAgIHNpemUgLT0gMTU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvZmZzZXQgJiYgb2Zmc2V0LnkpIHtcclxuICAgICAgICAgICAgc2l6ZSAtPSBvZmZzZXQueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNpemUgKj0gVXRpbHMuU1FSVF8yO1xyXG5cclxuICAgICAgICB2YXIgZm9udFNpemUgPSAxMTsgLy90b2RvIGNoZWNrIGFjdHVhbCBmb250IHNpemVcclxuICAgICAgICBzaXplIC09Zm9udFNpemUvMjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNvbXB1dGVHYXBTaXplKGdhcExldmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIEhlYXRtYXAubWF4R3JvdXBHYXBTaXplIC8gKGdhcExldmVsICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNvbXB1dGVHYXBzU2l6ZShnYXBzKSB7XHJcbiAgICAgICAgdmFyIGdhcHNTaXplID0gMDtcclxuICAgICAgICBnYXBzLmZvckVhY2goKGdhcHNOdW1iZXIsIGdhcHNMZXZlbCk9PiBnYXBzU2l6ZSArPSBnYXBzTnVtYmVyICogSGVhdG1hcC5jb21wdXRlR2FwU2l6ZShnYXBzTGV2ZWwpKTtcclxuICAgICAgICByZXR1cm4gZ2Fwc1NpemU7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcHV0ZVBsb3RTaXplKCkge1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSBwbG90Lm1hcmdpbjtcclxuICAgICAgICB2YXIgYXZhaWxhYmxlV2lkdGggPSBVdGlscy5hdmFpbGFibGVXaWR0aCh0aGlzLmNvbmZpZy53aWR0aCwgdGhpcy5nZXRCYXNlQ29udGFpbmVyKCksIHRoaXMucGxvdC5tYXJnaW4pO1xyXG4gICAgICAgIHZhciBhdmFpbGFibGVIZWlnaHQgPSBVdGlscy5hdmFpbGFibGVIZWlnaHQodGhpcy5jb25maWcuaGVpZ2h0LCB0aGlzLmdldEJhc2VDb250YWluZXIoKSwgdGhpcy5wbG90Lm1hcmdpbik7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gYXZhaWxhYmxlV2lkdGg7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IGF2YWlsYWJsZUhlaWdodDtcclxuXHJcbiAgICAgICAgdmFyIHhHYXBzU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcHNTaXplKHBsb3QueC5nYXBzKTtcclxuXHJcblxyXG4gICAgICAgIHZhciBjb21wdXRlZENlbGxXaWR0aCA9IE1hdGgubWF4KGNvbmYuY2VsbC5zaXplTWluLCBNYXRoLm1pbihjb25mLmNlbGwuc2l6ZU1heCwgKGF2YWlsYWJsZVdpZHRoIC0geEdhcHNTaXplKSAvIHRoaXMucGxvdC54LnRvdGFsVmFsdWVzQ291bnQpKTtcclxuICAgICAgICBpZiAodGhpcy5jb25maWcud2lkdGgpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jb25maWcuY2VsbC53aWR0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxXaWR0aCA9IGNvbXB1dGVkQ2VsbFdpZHRoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsV2lkdGggPSB0aGlzLmNvbmZpZy5jZWxsLndpZHRoO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLnBsb3QuY2VsbFdpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuY2VsbFdpZHRoID0gY29tcHV0ZWRDZWxsV2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdpZHRoID0gdGhpcy5wbG90LmNlbGxXaWR0aCAqIHRoaXMucGxvdC54LnRvdGFsVmFsdWVzQ291bnQgKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodCArIHhHYXBzU2l6ZTtcclxuXHJcbiAgICAgICAgdmFyIHlHYXBzU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcHNTaXplKHBsb3QueS5nYXBzKTtcclxuICAgICAgICB2YXIgY29tcHV0ZWRDZWxsSGVpZ2h0ID0gTWF0aC5tYXgoY29uZi5jZWxsLnNpemVNaW4sIE1hdGgubWluKGNvbmYuY2VsbC5zaXplTWF4LCAoYXZhaWxhYmxlSGVpZ2h0IC0geUdhcHNTaXplKSAvIHRoaXMucGxvdC55LnRvdGFsVmFsdWVzQ291bnQpKTtcclxuICAgICAgICBpZiAodGhpcy5jb25maWcuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jb25maWcuY2VsbC5oZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsSGVpZ2h0ID0gY29tcHV0ZWRDZWxsSGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxIZWlnaHQgPSB0aGlzLmNvbmZpZy5jZWxsLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wbG90LmNlbGxIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsSGVpZ2h0ID0gY29tcHV0ZWRDZWxsSGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaGVpZ2h0ID0gdGhpcy5wbG90LmNlbGxIZWlnaHQgKiB0aGlzLnBsb3QueS50b3RhbFZhbHVlc0NvdW50ICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b20gKyB5R2Fwc1NpemU7XHJcblxyXG5cclxuICAgICAgICB0aGlzLnBsb3Qud2lkdGggPSB3aWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0O1xyXG4gICAgICAgIHRoaXMucGxvdC5oZWlnaHQgPSBoZWlnaHQgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgc2V0dXBaU2NhbGUoKSB7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgY29uZmlnID0gc2VsZi5jb25maWc7XHJcbiAgICAgICAgdmFyIHogPSBzZWxmLnBsb3QuejtcclxuICAgICAgICB2YXIgcmFuZ2UgPSBjb25maWcuY29sb3IucmFuZ2U7XHJcbiAgICAgICAgdmFyIGV4dGVudCA9IHoubWF4IC0gei5taW47XHJcbiAgICAgICAgdmFyIHNjYWxlO1xyXG4gICAgICAgIHouZG9tYWluID0gW107XHJcbiAgICAgICAgaWYgKGNvbmZpZy5jb2xvci5zY2FsZSA9PSBcInBvd1wiKSB7XHJcbiAgICAgICAgICAgIHZhciBleHBvbmVudCA9IDEwO1xyXG4gICAgICAgICAgICByYW5nZS5mb3JFYWNoKChjLCBpKT0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB2ID0gei5tYXggLSAoZXh0ZW50IC8gTWF0aC5wb3coMTAsIGkpKTtcclxuICAgICAgICAgICAgICAgIHouZG9tYWluLnB1c2godilcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHNjYWxlID0gZDMuc2NhbGUucG93KCkuZXhwb25lbnQoZXhwb25lbnQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29uZmlnLmNvbG9yLnNjYWxlID09IFwibG9nXCIpIHtcclxuXHJcbiAgICAgICAgICAgIHJhbmdlLmZvckVhY2goKGMsIGkpPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHYgPSB6Lm1pbiArIChleHRlbnQgLyBNYXRoLnBvdygxMCwgaSkpO1xyXG4gICAgICAgICAgICAgICAgei5kb21haW4udW5zaGlmdCh2KVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzY2FsZSA9IGQzLnNjYWxlLmxvZygpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmFuZ2UuZm9yRWFjaCgoYywgaSk9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdiA9IHoubWluICsgKGV4dGVudCAqIChpIC8gKHJhbmdlLmxlbmd0aCAtIDEpKSk7XHJcbiAgICAgICAgICAgICAgICB6LmRvbWFpbi5wdXNoKHYpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzY2FsZSA9IGQzLnNjYWxlW2NvbmZpZy5jb2xvci5zY2FsZV0oKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB6LmRvbWFpblswXSA9IHoubWluOyAvL3JlbW92aW5nIHVubmVjZXNzYXJ5IGZsb2F0aW5nIHBvaW50c1xyXG4gICAgICAgIHouZG9tYWluW3ouZG9tYWluLmxlbmd0aCAtIDFdID0gei5tYXg7IC8vcmVtb3ZpbmcgdW5uZWNlc3NhcnkgZmxvYXRpbmcgcG9pbnRzXHJcbiAgICAgICAgY29uc29sZS5sb2coei5kb21haW4pO1xyXG5cclxuICAgICAgICBpZiAoY29uZmlnLmNvbG9yLnJldmVyc2VTY2FsZSkge1xyXG4gICAgICAgICAgICB6LmRvbWFpbi5yZXZlcnNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2cocmFuZ2UpO1xyXG4gICAgICAgIHBsb3Quei5jb2xvci5zY2FsZSA9IHNjYWxlLmRvbWFpbih6LmRvbWFpbikucmFuZ2UocmFuZ2UpO1xyXG4gICAgICAgIHZhciBzaGFwZSA9IHBsb3Quei5zaGFwZSA9IHt9O1xyXG5cclxuICAgICAgICB2YXIgY2VsbENvbmYgPSB0aGlzLmNvbmZpZy5jZWxsO1xyXG4gICAgICAgIHNoYXBlLnR5cGUgPSBcInJlY3RcIjtcclxuXHJcbiAgICAgICAgcGxvdC56LnNoYXBlLndpZHRoID0gcGxvdC5jZWxsV2lkdGggLSBjZWxsQ29uZi5wYWRkaW5nICogMjtcclxuICAgICAgICBwbG90Lnouc2hhcGUuaGVpZ2h0ID0gcGxvdC5jZWxsSGVpZ2h0IC0gY2VsbENvbmYucGFkZGluZyAqIDI7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHVwZGF0ZShuZXdEYXRhKSB7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKG5ld0RhdGEpO1xyXG4gICAgICAgIGlmICh0aGlzLnBsb3QuZ3JvdXBCeVkpIHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3R3JvdXBzWSh0aGlzLnBsb3QueS5ncm91cHMsIHRoaXMuc3ZnRyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnBsb3QuZ3JvdXBCeVgpIHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3R3JvdXBzWCh0aGlzLnBsb3QueC5ncm91cHMsIHRoaXMuc3ZnRyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUNlbGxzKCk7XHJcblxyXG4gICAgICAgIC8vIHRoaXMudXBkYXRlVmFyaWFibGVMYWJlbHMoKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVBeGlzWCgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQXhpc1koKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnNob3dMZWdlbmQpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVMZWdlbmQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlQXhpc1RpdGxlcygpO1xyXG4gICAgfTtcclxuXHJcbiAgICB1cGRhdGVBeGlzVGl0bGVzKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICB1cGRhdGVBeGlzWCgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGxhYmVsQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwibGFiZWxcIik7XHJcbiAgICAgICAgdmFyIGxhYmVsWENsYXNzID0gbGFiZWxDbGFzcyArIFwiLXhcIjtcclxuICAgICAgICB2YXIgbGFiZWxZQ2xhc3MgPSBsYWJlbENsYXNzICsgXCIteVwiO1xyXG4gICAgICAgIHBsb3QubGFiZWxDbGFzcyA9IGxhYmVsQ2xhc3M7XHJcblxyXG4gICAgICAgIHZhciBvZmZzZXRYID0ge1xyXG4gICAgICAgICAgICB4OiAwLFxyXG4gICAgICAgICAgICB5OiAwXHJcbiAgICAgICAgfTtcclxuICAgICAgICBsZXQgZ2FwU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcFNpemUoMCk7XHJcbiAgICAgICAgaWYgKHBsb3QuZ3JvdXBCeVgpIHtcclxuICAgICAgICAgICAgbGV0IG92ZXJsYXAgPSBzZWxmLmNvbmZpZy54Lmdyb3Vwcy5vdmVybGFwO1xyXG5cclxuICAgICAgICAgICAgb2Zmc2V0WC54ID0gZ2FwU2l6ZSAvIDI7XHJcbiAgICAgICAgICAgIG9mZnNldFgueSA9IG92ZXJsYXAuYm90dG9tICsgZ2FwU2l6ZSAvIDIgKyA2O1xyXG4gICAgICAgIH0gZWxzZSBpZiAocGxvdC5ncm91cEJ5WSkge1xyXG4gICAgICAgICAgICBvZmZzZXRYLnkgPSBnYXBTaXplO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHZhciBsYWJlbHMgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIGxhYmVsWENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShwbG90LnguYWxsVmFsdWVzTGlzdCwgKGQsIGkpPT5pKTtcclxuXHJcbiAgICAgICAgbGFiZWxzLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKS5hdHRyKFwiY2xhc3NcIiwgKGQsIGkpID0+IGxhYmVsQ2xhc3MgKyBcIiBcIiArIGxhYmVsWENsYXNzICsgXCIgXCIgKyBsYWJlbFhDbGFzcyArIFwiLVwiICsgaSk7XHJcblxyXG4gICAgICAgIGxhYmVsc1xyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgKGQsIGkpID0+IChpICogcGxvdC5jZWxsV2lkdGggKyBwbG90LmNlbGxXaWR0aCAvIDIpICsgKGQuZ3JvdXAuZ2Fwc1NpemUpICsgb2Zmc2V0WC54KVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgcGxvdC5oZWlnaHQgKyBvZmZzZXRYLnkpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgMTApXHJcblxyXG4gICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGQ9PnNlbGYuZm9ybWF0VmFsdWVYKGQudmFsKSk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgdmFyIG1heFdpZHRoID0gc2VsZi5jb21wdXRlWEF4aXNMYWJlbHNXaWR0aChvZmZzZXRYKTtcclxuXHJcbiAgICAgICAgbGFiZWxzLmVhY2goZnVuY3Rpb24gKGxhYmVsKSB7XHJcbiAgICAgICAgICAgIHZhciBlbGVtID0gZDMuc2VsZWN0KHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgdGV4dCA9IHNlbGYuZm9ybWF0VmFsdWVYKGxhYmVsLnZhbCk7XHJcbiAgICAgICAgICAgIFV0aWxzLnBsYWNlVGV4dFdpdGhFbGxpcHNpc0FuZFRvb2x0aXAoZWxlbSwgdGV4dCwgbWF4V2lkdGgsIHNlbGYuY29uZmlnLnNob3dUb29sdGlwID8gc2VsZi5wbG90LnRvb2x0aXAgOiBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy54LnJvdGF0ZUxhYmVscykge1xyXG4gICAgICAgICAgICBsYWJlbHMuYXR0cihcInRyYW5zZm9ybVwiLCAoZCwgaSkgPT4gXCJyb3RhdGUoLTQ1LCBcIiArICgoaSAqIHBsb3QuY2VsbFdpZHRoICsgcGxvdC5jZWxsV2lkdGggLyAyKSArIGQuZ3JvdXAuZ2Fwc1NpemUgKyBvZmZzZXRYLnggKSArIFwiLCBcIiArICggcGxvdC5oZWlnaHQgKyBvZmZzZXRYLnkpICsgXCIpXCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImR4XCIsIC0yKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCA4KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBsYWJlbHMuZXhpdCgpLnJlbW92ZSgpO1xyXG5cclxuXHJcbiAgICAgICAgc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIiArIHNlbGYucHJlZml4Q2xhc3MoJ2F4aXMteCcpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChwbG90LndpZHRoIC8gMikgKyBcIixcIiArIChwbG90LmhlaWdodCArIHBsb3QubWFyZ2luLmJvdHRvbSkgKyBcIilcIilcclxuICAgICAgICAgICAgLnNlbGVjdE9yQXBwZW5kKFwidGV4dC5cIiArIHNlbGYucHJlZml4Q2xhc3MoJ2xhYmVsJykpXHJcblxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiLTAuNWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KHNlbGYuY29uZmlnLngudGl0bGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUF4aXNZKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgbGFiZWxDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJsYWJlbFwiKTtcclxuICAgICAgICB2YXIgbGFiZWxZQ2xhc3MgPSBsYWJlbENsYXNzICsgXCIteVwiO1xyXG4gICAgICAgIHBsb3QubGFiZWxDbGFzcyA9IGxhYmVsQ2xhc3M7XHJcblxyXG5cclxuICAgICAgICB2YXIgbGFiZWxzID0gc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyBsYWJlbFlDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGxvdC55LmFsbFZhbHVlc0xpc3QpO1xyXG5cclxuICAgICAgICBsYWJlbHMuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpO1xyXG5cclxuICAgICAgICB2YXIgb2Zmc2V0WSA9IHtcclxuICAgICAgICAgICAgeDogMCxcclxuICAgICAgICAgICAgeTogMFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKHBsb3QuZ3JvdXBCeVkpIHtcclxuICAgICAgICAgICAgbGV0IG92ZXJsYXAgPSBzZWxmLmNvbmZpZy55Lmdyb3Vwcy5vdmVybGFwO1xyXG4gICAgICAgICAgICBsZXQgZ2FwU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcFNpemUoMCk7XHJcbiAgICAgICAgICAgIG9mZnNldFkueCA9IC1vdmVybGFwLmxlZnQ7XHJcblxyXG4gICAgICAgICAgICBvZmZzZXRZLnkgPSBnYXBTaXplIC8gMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGFiZWxzXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCBvZmZzZXRZLngpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAoZCwgaSkgPT4gKGkgKiBwbG90LmNlbGxIZWlnaHQgKyBwbG90LmNlbGxIZWlnaHQgLyAyKSArIGQuZ3JvdXAuZ2Fwc1NpemUgKyBvZmZzZXRZLnkpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHhcIiwgLTIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCAoZCwgaSkgPT4gbGFiZWxDbGFzcyArIFwiIFwiICsgbGFiZWxZQ2xhc3MgKyBcIiBcIiArIGxhYmVsWUNsYXNzICsgXCItXCIgKyBpKVxyXG5cclxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBmb3JtYXR0ZWQgPSBzZWxmLmZvcm1hdFZhbHVlWShkLnZhbCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0dGVkXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgbWF4V2lkdGggPSBzZWxmLmNvbXB1dGVZQXhpc0xhYmVsc1dpZHRoKG9mZnNldFkpO1xyXG5cclxuICAgICAgICBsYWJlbHMuZWFjaChmdW5jdGlvbiAobGFiZWwpIHtcclxuICAgICAgICAgICAgdmFyIGVsZW0gPSBkMy5zZWxlY3QodGhpcyksXHJcbiAgICAgICAgICAgICAgICB0ZXh0ID0gc2VsZi5mb3JtYXRWYWx1ZVkobGFiZWwudmFsKTtcclxuICAgICAgICAgICAgVXRpbHMucGxhY2VUZXh0V2l0aEVsbGlwc2lzQW5kVG9vbHRpcChlbGVtLCB0ZXh0LCBtYXhXaWR0aCwgc2VsZi5jb25maWcuc2hvd1Rvb2x0aXAgPyBzZWxmLnBsb3QudG9vbHRpcCA6IGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLnkucm90YXRlTGFiZWxzKSB7XHJcbiAgICAgICAgICAgIGxhYmVsc1xyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwicm90YXRlKC00NSwgXCIgKyAob2Zmc2V0WS54ICApICsgXCIsIFwiICsgKGQuZ3JvdXAuZ2Fwc1NpemUgKyAoaSAqIHBsb3QuY2VsbEhlaWdodCArIHBsb3QuY2VsbEhlaWdodCAvIDIpICsgb2Zmc2V0WS55KSArIFwiKVwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKTtcclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJkeFwiLCAtNyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGFiZWxzLmF0dHIoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGxhYmVscy5leGl0KCkucmVtb3ZlKCk7XHJcblxyXG5cclxuICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiICsgc2VsZi5wcmVmaXhDbGFzcygnYXhpcy15JykpXHJcbiAgICAgICAgICAgIC5zZWxlY3RPckFwcGVuZChcInRleHQuXCIgKyBzZWxmLnByZWZpeENsYXNzKCdsYWJlbCcpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIC1wbG90Lm1hcmdpbi5sZWZ0ICsgXCIsXCIgKyAocGxvdC5oZWlnaHQgLyAyKSArIFwiKXJvdGF0ZSgtOTApXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCIxZW1cIilcclxuICAgICAgICAgICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoc2VsZi5jb25maWcueS50aXRsZSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBkcmF3R3JvdXBzWShwYXJlbnRHcm91cCwgY29udGFpbmVyLCBhdmFpbGFibGVXaWR0aCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcblxyXG4gICAgICAgIHZhciBncm91cENsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImdyb3VwXCIpO1xyXG4gICAgICAgIHZhciBncm91cFlDbGFzcyA9IGdyb3VwQ2xhc3MgKyBcIi15XCI7XHJcbiAgICAgICAgdmFyIGdyb3VwcyA9IGNvbnRhaW5lci5zZWxlY3RBbGwoXCJnLlwiICsgZ3JvdXBDbGFzcyArIFwiLlwiICsgZ3JvdXBZQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBhcmVudEdyb3VwLmNoaWxkcmVuTGlzdCk7XHJcblxyXG4gICAgICAgIHZhciB2YWx1ZXNCZWZvcmVDb3VudCA9IDA7XHJcbiAgICAgICAgdmFyIGdhcHNCZWZvcmVTaXplID0gMDtcclxuXHJcbiAgICAgICAgdmFyIGdyb3Vwc0VudGVyRyA9IGdyb3Vwcy5lbnRlcigpLmFwcGVuZChcImdcIik7XHJcbiAgICAgICAgZ3JvdXBzRW50ZXJHXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKGdyb3VwQ2xhc3MsIHRydWUpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKGdyb3VwWUNsYXNzLCB0cnVlKVxyXG4gICAgICAgICAgICAuYXBwZW5kKFwicmVjdFwiKS5jbGFzc2VkKFwiZ3JvdXAtcmVjdFwiLCB0cnVlKTtcclxuXHJcbiAgICAgICAgdmFyIHRpdGxlR3JvdXBFbnRlciA9IGdyb3Vwc0VudGVyRy5hcHBlbmRTZWxlY3RvcihcImcudGl0bGVcIik7XHJcbiAgICAgICAgdGl0bGVHcm91cEVudGVyLmFwcGVuZChcInJlY3RcIik7XHJcbiAgICAgICAgdGl0bGVHcm91cEVudGVyLmFwcGVuZChcInRleHRcIik7XHJcblxyXG4gICAgICAgIHZhciBnYXBTaXplID0gSGVhdG1hcC5jb21wdXRlR2FwU2l6ZShwYXJlbnRHcm91cC5sZXZlbCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBnYXBTaXplIC8gNDtcclxuXHJcbiAgICAgICAgdmFyIHRpdGxlUmVjdFdpZHRoID0gSGVhdG1hcC5ncm91cFRpdGxlUmVjdEhlaWdodDtcclxuICAgICAgICB2YXIgZGVwdGggPSBzZWxmLmNvbmZpZy55Lmdyb3Vwcy5rZXlzLmxlbmd0aCAtIHBhcmVudEdyb3VwLmxldmVsO1xyXG4gICAgICAgIHZhciBvdmVybGFwID0ge1xyXG4gICAgICAgICAgICBsZWZ0OiAwLFxyXG4gICAgICAgICAgICByaWdodDogMFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmICghYXZhaWxhYmxlV2lkdGgpIHtcclxuICAgICAgICAgICAgb3ZlcmxhcC5yaWdodCA9IHBsb3QueS5vdmVybGFwLmxlZnQ7XHJcbiAgICAgICAgICAgIG92ZXJsYXAubGVmdCA9IHBsb3QueS5vdmVybGFwLmxlZnQ7XHJcbiAgICAgICAgICAgIGF2YWlsYWJsZVdpZHRoID0gcGxvdC53aWR0aCArIGdhcFNpemUgKyBvdmVybGFwLmxlZnQgKyBvdmVybGFwLnJpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGdyb3Vwc1xyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCAoZCwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRyYW5zbGF0ZSA9IFwidHJhbnNsYXRlKFwiICsgKHBhZGRpbmcgLSBvdmVybGFwLmxlZnQpICsgXCIsXCIgKyAoKHBsb3QuY2VsbEhlaWdodCAqIHZhbHVlc0JlZm9yZUNvdW50KSArIGkgKiBnYXBTaXplICsgZ2Fwc0JlZm9yZVNpemUgKyBwYWRkaW5nKSArIFwiKVwiO1xyXG4gICAgICAgICAgICAgICAgZ2Fwc0JlZm9yZVNpemUgKz0gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCk7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZXNCZWZvcmVDb3VudCArPSBkLmFsbFZhbHVlc0NvdW50IHx8IDA7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhbnNsYXRlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGdyb3VwV2lkdGggPSBhdmFpbGFibGVXaWR0aCAtIHBhZGRpbmcgKiAyO1xyXG5cclxuICAgICAgICB2YXIgdGl0bGVHcm91cHMgPSBncm91cHMuc2VsZWN0QWxsKFwiZy50aXRsZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCAoZCwgaSkgPT4gXCJ0cmFuc2xhdGUoXCIgKyAoZ3JvdXBXaWR0aCAtIHRpdGxlUmVjdFdpZHRoKSArIFwiLCAwKVwiKTtcclxuXHJcbiAgICAgICAgdmFyIHRpbGVSZWN0cyA9IHRpdGxlR3JvdXBzLnNlbGVjdEFsbChcInJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB0aXRsZVJlY3RXaWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZD0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoZC5nYXBzSW5zaWRlU2l6ZSB8fCAwKSArIHBsb3QuY2VsbEhlaWdodCAqIGQuYWxsVmFsdWVzQ291bnQgKyBwYWRkaW5nICogMlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIDApXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiZmlsbFwiLCBcImxpZ2h0Z3JleVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRHcm91cE1vdXNlQ2FsbGJhY2tzKHBhcmVudEdyb3VwLCB0aWxlUmVjdHMpO1xyXG5cclxuXHJcbiAgICAgICAgZ3JvdXBzLnNlbGVjdEFsbChcInJlY3QuZ3JvdXAtcmVjdFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGQ9PiBcImdyb3VwLXJlY3QgZ3JvdXAtcmVjdC1cIiArIGQuaW5kZXgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgZ3JvdXBXaWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZD0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoZC5nYXBzSW5zaWRlU2l6ZSB8fCAwKSArIHBsb3QuY2VsbEhlaWdodCAqIGQuYWxsVmFsdWVzQ291bnQgKyBwYWRkaW5nICogMlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCBcIndoaXRlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZmlsbC1vcGFjaXR5XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDAuNSlcclxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2VcIiwgXCJibGFja1wiKVxyXG5cclxuXHJcbiAgICAgICAgZ3JvdXBzLmVhY2goZnVuY3Rpb24gKGdyb3VwKSB7XHJcblxyXG4gICAgICAgICAgICBzZWxmLmRyYXdHcm91cHNZLmNhbGwoc2VsZiwgZ3JvdXAsIGQzLnNlbGVjdCh0aGlzKSwgZ3JvdXBXaWR0aCAtIHRpdGxlUmVjdFdpZHRoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZHJhd0dyb3Vwc1gocGFyZW50R3JvdXAsIGNvbnRhaW5lciwgYXZhaWxhYmxlSGVpZ2h0KSB7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuXHJcbiAgICAgICAgdmFyIGdyb3VwQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwiZ3JvdXBcIik7XHJcbiAgICAgICAgdmFyIGdyb3VwWENsYXNzID0gZ3JvdXBDbGFzcyArIFwiLXhcIjtcclxuICAgICAgICB2YXIgZ3JvdXBzID0gY29udGFpbmVyLnNlbGVjdEFsbChcImcuXCIgKyBncm91cENsYXNzICsgXCIuXCIgKyBncm91cFhDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGFyZW50R3JvdXAuY2hpbGRyZW5MaXN0KTtcclxuXHJcbiAgICAgICAgdmFyIHZhbHVlc0JlZm9yZUNvdW50ID0gMDtcclxuICAgICAgICB2YXIgZ2Fwc0JlZm9yZVNpemUgPSAwO1xyXG5cclxuICAgICAgICB2YXIgZ3JvdXBzRW50ZXJHID0gZ3JvdXBzLmVudGVyKCkuYXBwZW5kKFwiZ1wiKTtcclxuICAgICAgICBncm91cHNFbnRlckdcclxuICAgICAgICAgICAgLmNsYXNzZWQoZ3JvdXBDbGFzcywgdHJ1ZSlcclxuICAgICAgICAgICAgLmNsYXNzZWQoZ3JvdXBYQ2xhc3MsIHRydWUpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoXCJyZWN0XCIpLmNsYXNzZWQoXCJncm91cC1yZWN0XCIsIHRydWUpO1xyXG5cclxuICAgICAgICB2YXIgdGl0bGVHcm91cEVudGVyID0gZ3JvdXBzRW50ZXJHLmFwcGVuZFNlbGVjdG9yKFwiZy50aXRsZVwiKTtcclxuICAgICAgICB0aXRsZUdyb3VwRW50ZXIuYXBwZW5kKFwicmVjdFwiKTtcclxuICAgICAgICB0aXRsZUdyb3VwRW50ZXIuYXBwZW5kKFwidGV4dFwiKTtcclxuXHJcbiAgICAgICAgdmFyIGdhcFNpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBTaXplKHBhcmVudEdyb3VwLmxldmVsKTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IGdhcFNpemUgLyA0O1xyXG4gICAgICAgIHZhciB0aXRsZVJlY3RIZWlnaHQgPSBIZWF0bWFwLmdyb3VwVGl0bGVSZWN0SGVpZ2h0O1xyXG5cclxuICAgICAgICB2YXIgZGVwdGggPSBzZWxmLmNvbmZpZy54Lmdyb3Vwcy5rZXlzLmxlbmd0aCAtIHBhcmVudEdyb3VwLmxldmVsO1xyXG5cclxuICAgICAgICB2YXIgb3ZlcmxhcCA9IHtcclxuICAgICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgICAgICBib3R0b206IDBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoIWF2YWlsYWJsZUhlaWdodCkge1xyXG4gICAgICAgICAgICBvdmVybGFwLmJvdHRvbSA9IHBsb3QueC5vdmVybGFwLmJvdHRvbTtcclxuICAgICAgICAgICAgb3ZlcmxhcC50b3AgPSBwbG90Lngub3ZlcmxhcC50b3A7XHJcbiAgICAgICAgICAgIGF2YWlsYWJsZUhlaWdodCA9IHBsb3QuaGVpZ2h0ICsgZ2FwU2l6ZSArIG92ZXJsYXAudG9wICsgb3ZlcmxhcC5ib3R0b207XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG92ZXJsYXAudG9wID0gLXRpdGxlUmVjdEhlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3BhcmVudEdyb3VwJyxwYXJlbnRHcm91cCwgJ2dhcFNpemUnLCBnYXBTaXplLCBwbG90Lngub3ZlcmxhcCk7XHJcblxyXG4gICAgICAgIGdyb3Vwc1xyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCAoZCwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRyYW5zbGF0ZSA9IFwidHJhbnNsYXRlKFwiICsgKChwbG90LmNlbGxXaWR0aCAqIHZhbHVlc0JlZm9yZUNvdW50KSArIGkgKiBnYXBTaXplICsgZ2Fwc0JlZm9yZVNpemUgKyBwYWRkaW5nKSArIFwiLCBcIiArIChwYWRkaW5nIC0gb3ZlcmxhcC50b3ApICsgXCIpXCI7XHJcbiAgICAgICAgICAgICAgICBnYXBzQmVmb3JlU2l6ZSArPSAoZC5nYXBzSW5zaWRlU2l6ZSB8fCAwKTtcclxuICAgICAgICAgICAgICAgIHZhbHVlc0JlZm9yZUNvdW50ICs9IGQuYWxsVmFsdWVzQ291bnQgfHwgMDtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cmFuc2xhdGVcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciBncm91cEhlaWdodCA9IGF2YWlsYWJsZUhlaWdodCAtIHBhZGRpbmcgKiAyO1xyXG5cclxuICAgICAgICB2YXIgdGl0bGVHcm91cHMgPSBncm91cHMuc2VsZWN0QWxsKFwiZy50aXRsZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCAoZCwgaSkgPT4gXCJ0cmFuc2xhdGUoMCwgXCIgKyAoMCkgKyBcIilcIik7XHJcblxyXG5cclxuICAgICAgICB2YXIgdGlsZVJlY3RzID0gdGl0bGVHcm91cHMuc2VsZWN0QWxsKFwicmVjdFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCB0aXRsZVJlY3RIZWlnaHQpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgZD0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoZC5nYXBzSW5zaWRlU2l6ZSB8fCAwKSArIHBsb3QuY2VsbFdpZHRoICogZC5hbGxWYWx1ZXNDb3VudCArIHBhZGRpbmcgKiAyXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgMClcclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJmaWxsXCIsIFwibGlnaHRncmV5XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDApO1xyXG5cclxuICAgICAgICB0aGlzLnNldEdyb3VwTW91c2VDYWxsYmFja3MocGFyZW50R3JvdXAsIHRpbGVSZWN0cyk7XHJcblxyXG5cclxuICAgICAgICBncm91cHMuc2VsZWN0QWxsKFwicmVjdC5ncm91cC1yZWN0XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgZD0+IFwiZ3JvdXAtcmVjdCBncm91cC1yZWN0LVwiICsgZC5pbmRleClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZ3JvdXBIZWlnaHQpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgZD0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoZC5nYXBzSW5zaWRlU2l6ZSB8fCAwKSArIHBsb3QuY2VsbFdpZHRoICogZC5hbGxWYWx1ZXNDb3VudCArIHBhZGRpbmcgKiAyXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIFwid2hpdGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJmaWxsLW9wYWNpdHlcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMC41KVxyXG4gICAgICAgICAgICAuYXR0cihcInN0cm9rZVwiLCBcImJsYWNrXCIpO1xyXG5cclxuICAgICAgICBncm91cHMuZWFjaChmdW5jdGlvbiAoZ3JvdXApIHtcclxuICAgICAgICAgICAgc2VsZi5kcmF3R3JvdXBzWC5jYWxsKHNlbGYsIGdyb3VwLCBkMy5zZWxlY3QodGhpcyksIGdyb3VwSGVpZ2h0IC0gdGl0bGVSZWN0SGVpZ2h0KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZ3JvdXBzLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgc2V0R3JvdXBNb3VzZUNhbGxiYWNrcyhwYXJlbnRHcm91cCwgdGlsZVJlY3RzKSB7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBtb3VzZW92ZXJDYWxsYmFja3MgPSBbXTtcclxuICAgICAgICBtb3VzZW92ZXJDYWxsYmFja3MucHVzaChmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICBkMy5zZWxlY3QodGhpcykuY2xhc3NlZCgnaGlnaGxpZ2h0ZWQnLCB0cnVlKTtcclxuICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlKS5zZWxlY3RBbGwoXCJyZWN0Lmdyb3VwLXJlY3QtXCIgKyBkLmluZGV4KS5jbGFzc2VkKCdoaWdobGlnaHRlZCcsIHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgbW91c2VvdXRDYWxsYmFja3MgPSBbXTtcclxuICAgICAgICBtb3VzZW91dENhbGxiYWNrcy5wdXNoKGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKCdoaWdobGlnaHRlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlKS5zZWxlY3RBbGwoXCJyZWN0Lmdyb3VwLXJlY3QtXCIgKyBkLmluZGV4KS5jbGFzc2VkKCdoaWdobGlnaHRlZCcsIGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAocGxvdC50b29sdGlwKSB7XHJcblxyXG4gICAgICAgICAgICBtb3VzZW92ZXJDYWxsYmFja3MucHVzaChkPT4ge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAuOSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IHBhcmVudEdyb3VwLmxhYmVsICsgXCI6IFwiICsgZC5ncm91cGluZ1ZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC5odG1sKGh0bWwpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZDMuZXZlbnQucGFnZVggKyA1KSArIFwicHhcIilcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBtb3VzZW91dENhbGxiYWNrcy5wdXNoKGQ9PiB7XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICB0aWxlUmVjdHMub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBtb3VzZW92ZXJDYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoc2VsZiwgZClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGlsZVJlY3RzLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBtb3VzZW91dENhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChzZWxmLCBkKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVDZWxscygpIHtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBjZWxsQ29udGFpbmVyQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwiY2VsbHNcIik7XHJcbiAgICAgICAgdmFyIGdhcFNpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBTaXplKDApO1xyXG4gICAgICAgIHZhciBwYWRkaW5nWCA9IHBsb3QueC5ncm91cHMuY2hpbGRyZW5MaXN0Lmxlbmd0aCA/IGdhcFNpemUgLyAyIDogMDtcclxuICAgICAgICB2YXIgcGFkZGluZ1kgPSBwbG90LnkuZ3JvdXBzLmNoaWxkcmVuTGlzdC5sZW5ndGggPyBnYXBTaXplIC8gMiA6IDA7XHJcbiAgICAgICAgdmFyIGNlbGxDb250YWluZXIgPSBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiICsgY2VsbENvbnRhaW5lckNsYXNzKTtcclxuICAgICAgICBjZWxsQ29udGFpbmVyLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyBwYWRkaW5nWCArIFwiLCBcIiArIHBhZGRpbmdZICsgXCIpXCIpO1xyXG5cclxuICAgICAgICB2YXIgY2VsbENsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImNlbGxcIik7XHJcbiAgICAgICAgdmFyIGNlbGxTaGFwZSA9IHBsb3Quei5zaGFwZS50eXBlO1xyXG5cclxuICAgICAgICB2YXIgY2VsbHMgPSBjZWxsQ29udGFpbmVyLnNlbGVjdEFsbChcImcuXCIgKyBjZWxsQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHNlbGYucGxvdC5jZWxscyk7XHJcblxyXG4gICAgICAgIHZhciBjZWxsRW50ZXJHID0gY2VsbHMuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKGNlbGxDbGFzcywgdHJ1ZSk7XHJcbiAgICAgICAgY2VsbHMuYXR0cihcInRyYW5zZm9ybVwiLCBjPT4gXCJ0cmFuc2xhdGUoXCIgKyAoKHBsb3QuY2VsbFdpZHRoICogYy5jb2wgKyBwbG90LmNlbGxXaWR0aCAvIDIpICsgYy5jb2xWYXIuZ3JvdXAuZ2Fwc1NpemUpICsgXCIsXCIgKyAoKHBsb3QuY2VsbEhlaWdodCAqIGMucm93ICsgcGxvdC5jZWxsSGVpZ2h0IC8gMikgKyBjLnJvd1Zhci5ncm91cC5nYXBzU2l6ZSkgKyBcIilcIik7XHJcblxyXG4gICAgICAgIHZhciBzaGFwZXMgPSBjZWxscy5zZWxlY3RPckFwcGVuZChjZWxsU2hhcGUgKyBcIi5jZWxsLXNoYXBlLVwiICsgY2VsbFNoYXBlKTtcclxuXHJcbiAgICAgICAgc2hhcGVzXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgcGxvdC56LnNoYXBlLndpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBwbG90Lnouc2hhcGUuaGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgLXBsb3QuY2VsbFdpZHRoIC8gMilcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIC1wbG90LmNlbGxIZWlnaHQgLyAyKTtcclxuXHJcbiAgICAgICAgc2hhcGVzLnN0eWxlKFwiZmlsbFwiLCBjPT4gYy52YWx1ZSA9PT0gdW5kZWZpbmVkID8gc2VsZi5jb25maWcuY29sb3Iubm9EYXRhQ29sb3IgOiBwbG90LnouY29sb3Iuc2NhbGUoYy52YWx1ZSkpO1xyXG4gICAgICAgIHNoYXBlcy5hdHRyKFwiZmlsbC1vcGFjaXR5XCIsIGQ9PiBkLnZhbHVlID09PSB1bmRlZmluZWQgPyAwIDogMSk7XHJcblxyXG4gICAgICAgIHZhciBtb3VzZW92ZXJDYWxsYmFja3MgPSBbXTtcclxuICAgICAgICB2YXIgbW91c2VvdXRDYWxsYmFja3MgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKHBsb3QudG9vbHRpcCkge1xyXG5cclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goYz0+IHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGh0bWwgPSBjLnZhbHVlID09PSB1bmRlZmluZWQgPyBzZWxmLmNvbmZpZy50b29sdGlwLm5vRGF0YVRleHQgOiBzZWxmLmZvcm1hdFZhbHVlWihjLnZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAuaHRtbChodG1sKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkMy5ldmVudC5wYWdlWSAtIDI4KSArIFwicHhcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MucHVzaChjPT4ge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy5oaWdobGlnaHRMYWJlbHMpIHtcclxuICAgICAgICAgICAgdmFyIGhpZ2hsaWdodENsYXNzID0gc2VsZi5jb25maWcuY3NzQ2xhc3NQcmVmaXggKyBcImhpZ2hsaWdodFwiO1xyXG4gICAgICAgICAgICB2YXIgeExhYmVsQ2xhc3MgPSBjPT5wbG90LmxhYmVsQ2xhc3MgKyBcIi14LVwiICsgYy5jb2w7XHJcbiAgICAgICAgICAgIHZhciB5TGFiZWxDbGFzcyA9IGM9PnBsb3QubGFiZWxDbGFzcyArIFwiLXktXCIgKyBjLnJvdztcclxuXHJcblxyXG4gICAgICAgICAgICBtb3VzZW92ZXJDYWxsYmFja3MucHVzaChjPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgeExhYmVsQ2xhc3MoYykpLmNsYXNzZWQoaGlnaGxpZ2h0Q2xhc3MsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB5TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBtb3VzZW91dENhbGxiYWNrcy5wdXNoKGM9PiB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHhMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHlMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGNlbGxzLm9uKFwibW91c2VvdmVyXCIsIGMgPT4ge1xyXG4gICAgICAgICAgICBtb3VzZW92ZXJDYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjaz0+Y2FsbGJhY2soYykpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGMgPT4ge1xyXG4gICAgICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjaz0+Y2FsbGJhY2soYykpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY2VsbHMub24oXCJjbGlja1wiLCBjPT4ge1xyXG4gICAgICAgICAgICBzZWxmLnRyaWdnZXIoXCJjZWxsLXNlbGVjdGVkXCIsIGMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgY2VsbHMuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcm1hdFZhbHVlWCh2YWx1ZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcueC5mb3JtYXR0ZXIpIHJldHVybiB2YWx1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnguZm9ybWF0dGVyLmNhbGwodGhpcy5jb25maWcsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3JtYXRWYWx1ZVkodmFsdWUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLnkuZm9ybWF0dGVyKSByZXR1cm4gdmFsdWU7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy55LmZvcm1hdHRlci5jYWxsKHRoaXMuY29uZmlnLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9ybWF0VmFsdWVaKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy56LmZvcm1hdHRlcikgcmV0dXJuIHZhbHVlO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuei5mb3JtYXR0ZXIuY2FsbCh0aGlzLmNvbmZpZywgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcm1hdExlZ2VuZFZhbHVlKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5sZWdlbmQuZm9ybWF0dGVyKSByZXR1cm4gdmFsdWU7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5sZWdlbmQuZm9ybWF0dGVyLmNhbGwodGhpcy5jb25maWcsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVMZWdlbmQoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciBsZWdlbmRYID0gdGhpcy5wbG90LndpZHRoICsgMTA7XHJcbiAgICAgICAgdmFyIGdhcFNpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBTaXplKDApO1xyXG4gICAgICAgIGlmICh0aGlzLnBsb3QuZ3JvdXBCeVkpIHtcclxuICAgICAgICAgICAgbGVnZW5kWCArPSBnYXBTaXplIC8gMiArIHBsb3QueS5vdmVybGFwLnJpZ2h0O1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wbG90Lmdyb3VwQnlYKSB7XHJcbiAgICAgICAgICAgIGxlZ2VuZFggKz0gZ2FwU2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGxlZ2VuZFkgPSAwO1xyXG4gICAgICAgIGlmICh0aGlzLnBsb3QuZ3JvdXBCeVggfHwgdGhpcy5wbG90Lmdyb3VwQnlZKSB7XHJcbiAgICAgICAgICAgIGxlZ2VuZFkgKz0gZ2FwU2l6ZSAvIDI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgYmFyV2lkdGggPSAxMDtcclxuICAgICAgICB2YXIgYmFySGVpZ2h0ID0gdGhpcy5wbG90LmhlaWdodCAtIDI7XHJcbiAgICAgICAgdmFyIHNjYWxlID0gcGxvdC56LmNvbG9yLnNjYWxlO1xyXG5cclxuICAgICAgICBwbG90LmxlZ2VuZCA9IG5ldyBMZWdlbmQodGhpcy5zdmcsIHRoaXMuc3ZnRywgc2NhbGUsIGxlZ2VuZFgsIGxlZ2VuZFksIHYgPT4gc2VsZi5mb3JtYXRMZWdlbmRWYWx1ZSh2KSkuc2V0Um90YXRlTGFiZWxzKHNlbGYuY29uZmlnLmxlZ2VuZC5yb3RhdGVMYWJlbHMpLmxpbmVhckdyYWRpZW50QmFyKGJhcldpZHRoLCBiYXJIZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuIiwiaW1wb3J0IHtDaGFydFdpdGhDb2xvckdyb3VwcywgQ2hhcnRXaXRoQ29sb3JHcm91cHNDb25maWd9IGZyb20gXCIuL2NoYXJ0LXdpdGgtY29sb3ItZ3JvdXBzXCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcblxyXG5leHBvcnQgY2xhc3MgSGlzdG9ncmFtQ29uZmlnIGV4dGVuZHMgQ2hhcnRXaXRoQ29sb3JHcm91cHNDb25maWd7XHJcblxyXG4gICAgc3ZnQ2xhc3M9IHRoaXMuY3NzQ2xhc3NQcmVmaXgrJ2hpc3RvZ3JhbSc7XHJcbiAgICBzaG93TGVnZW5kPXRydWU7XHJcbiAgICBzaG93VG9vbHRpcCA9dHJ1ZTtcclxuICAgIHg9ey8vIFggYXhpcyBjb25maWdcclxuICAgICAgICBsYWJlbDogJycsIC8vIGF4aXMgbGFiZWxcclxuICAgICAgICBrZXk6IDAsXHJcbiAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IFV0aWxzLmlzTnVtYmVyKGQpID8gZCA6IHBhcnNlRmxvYXQoZFtrZXldKSwgLy8geCB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiLFxyXG4gICAgICAgIHRpY2tzOiB1bmRlZmluZWQsXHJcbiAgICB9O1xyXG4gICAgeT17Ly8gWSBheGlzIGNvbmZpZ1xyXG4gICAgICAgIGxhYmVsOiAnJywgLy8gYXhpcyBsYWJlbCxcclxuICAgICAgICBvcmllbnQ6IFwibGVmdFwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiXHJcbiAgICB9O1xyXG4gICAgZnJlcXVlbmN5PXRydWU7XHJcbiAgICBncm91cHM9e1xyXG4gICAgICAgIGtleTogMVxyXG4gICAgfTtcclxuICAgIHRyYW5zaXRpb249IHRydWU7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKXtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICBpZihjdXN0b20pe1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEhpc3RvZ3JhbSBleHRlbmRzIENoYXJ0V2l0aENvbG9yR3JvdXBze1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IEhpc3RvZ3JhbUNvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKXtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBIaXN0b2dyYW1Db25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKXtcclxuICAgICAgICBzdXBlci5pbml0UGxvdCgpO1xyXG4gICAgICAgIHZhciBzZWxmPXRoaXM7XHJcblxyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC54PXt9O1xyXG4gICAgICAgIHRoaXMucGxvdC55PXt9O1xyXG4gICAgICAgIHRoaXMucGxvdC5iYXI9e1xyXG4gICAgICAgICAgICBjb2xvcjogbnVsbC8vY29sb3Igc2NhbGUgbWFwcGluZyBmdW5jdGlvblxyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jb21wdXRlUGxvdFNpemUoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnNldHVwWCgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBIaXN0b2dyYW0oKTtcclxuICAgICAgICB0aGlzLnNldHVwR3JvdXBTdGFja3MoKTtcclxuICAgICAgICB0aGlzLnNldHVwWSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwWCgpe1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeCA9IHBsb3QueDtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnLng7XHJcblxyXG4gICAgICAgIC8qICpcclxuICAgICAgICAgKiB2YWx1ZSBhY2Nlc3NvciAtIHJldHVybnMgdGhlIHZhbHVlIHRvIGVuY29kZSBmb3IgYSBnaXZlbiBkYXRhIG9iamVjdC5cclxuICAgICAgICAgKiBzY2FsZSAtIG1hcHMgdmFsdWUgdG8gYSB2aXN1YWwgZGlzcGxheSBlbmNvZGluZywgc3VjaCBhcyBhIHBpeGVsIHBvc2l0aW9uLlxyXG4gICAgICAgICAqIG1hcCBmdW5jdGlvbiAtIG1hcHMgZnJvbSBkYXRhIHZhbHVlIHRvIGRpc3BsYXkgdmFsdWVcclxuICAgICAgICAgKiBheGlzIC0gc2V0cyB1cCBheGlzXHJcbiAgICAgICAgICoqL1xyXG4gICAgICAgIHgudmFsdWUgPSBkID0+IGNvbmYudmFsdWUoZCwgY29uZi5rZXkpO1xyXG4gICAgICAgIHguc2NhbGUgPSBkMy5zY2FsZVtjb25mLnNjYWxlXSgpLnJhbmdlKFswLCBwbG90LndpZHRoXSk7XHJcbiAgICAgICAgeC5tYXAgPSBkID0+IHguc2NhbGUoeC52YWx1ZShkKSk7XHJcblxyXG4gICAgICAgIHguYXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeC5zY2FsZSkub3JpZW50KGNvbmYub3JpZW50KTtcclxuICAgICAgICBpZihjb25mLnRpY2tzKXtcclxuICAgICAgICAgICAgeC5heGlzLnRpY2tzKGNvbmYudGlja3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMucGxvdC5ncm91cGVkRGF0YTtcclxuICAgICAgICBwbG90Lnguc2NhbGUuZG9tYWluKFtkMy5taW4oZGF0YSwgcz0+ZDMubWluKHMudmFsdWVzLCBwbG90LngudmFsdWUpKSwgZDMubWF4KGRhdGEsIHM9PmQzLm1heChzLnZhbHVlcywgcGxvdC54LnZhbHVlKSldKTtcclxuICAgICAgICBcclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBZICgpe1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeSA9IHBsb3QueTtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnLnk7XHJcbiAgICAgICAgeS5zY2FsZSA9IGQzLnNjYWxlW2NvbmYuc2NhbGVdKCkucmFuZ2UoW3Bsb3QuaGVpZ2h0LCAwXSk7XHJcblxyXG4gICAgICAgIHkuYXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeS5zY2FsZSkub3JpZW50KGNvbmYub3JpZW50KTtcclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMucGxvdC5kYXRhO1xyXG4gICAgICAgIHZhciB5U3RhY2tNYXggPSBkMy5tYXgocGxvdC5zdGFja2VkSGlzdG9ncmFtcywgbGF5ZXIgPT4gZDMubWF4KGxheWVyLmhpc3RvZ3JhbUJpbnMsIGQgPT4gZC55MCArIGQueSkpO1xyXG4gICAgICAgIHBsb3QueS5zY2FsZS5kb21haW4oWzAsIHlTdGFja01heF0pO1xyXG5cclxuICAgIH07XHJcblxyXG5cclxuICAgIHNldHVwSGlzdG9ncmFtKCkge1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB4ID0gcGxvdC54O1xyXG4gICAgICAgIHZhciB5ID0gcGxvdC55O1xyXG4gICAgICAgIHZhciB0aWNrcyA9IHRoaXMuY29uZmlnLngudGlja3MgPyB4LnNjYWxlLnRpY2tzKHRoaXMuY29uZmlnLngudGlja3MpIDogeC5zY2FsZS50aWNrcygpO1xyXG5cclxuICAgICAgICBwbG90Lmhpc3RvZ3JhbSA9IGQzLmxheW91dC5oaXN0b2dyYW0oKS5mcmVxdWVuY3kodGhpcy5jb25maWcuZnJlcXVlbmN5KVxyXG4gICAgICAgICAgICAudmFsdWUoeC52YWx1ZSlcclxuICAgICAgICAgICAgLmJpbnModGlja3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwR3JvdXBTdGFja3MoKSB7XHJcbiAgICAgICAgdmFyIHNlbGY9dGhpcztcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnBsb3QuZ3JvdXBlZERhdGEpO1xyXG4gICAgICAgIHRoaXMucGxvdC5zdGFjayA9IGQzLmxheW91dC5zdGFjaygpLnZhbHVlcyhkPT5kLmhpc3RvZ3JhbUJpbnMpO1xyXG4gICAgICAgIHRoaXMucGxvdC5ncm91cGVkRGF0YS5mb3JFYWNoKGQ9PntcclxuICAgICAgICAgICAgZC5oaXN0b2dyYW1CaW5zID0gdGhpcy5wbG90Lmhpc3RvZ3JhbS5mcmVxdWVuY3kodGhpcy5jb25maWcuZnJlcXVlbmN5IHx8IHRoaXMucGxvdC5ncm91cGluZ0VuYWJsZWQpKGQudmFsdWVzKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZC5oaXN0b2dyYW1CaW5zKTtcclxuICAgICAgICAgICAgaWYoIXRoaXMuY29uZmlnLmZyZXF1ZW5jeSAmJiB0aGlzLnBsb3QuZ3JvdXBpbmdFbmFibGVkKXtcclxuICAgICAgICAgICAgICAgIGQuaGlzdG9ncmFtQmlucy5mb3JFYWNoKGIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGIuZHkgPSBiLmR5L3RoaXMucGxvdC5kYXRhTGVuZ3RoXHJcbiAgICAgICAgICAgICAgICAgICAgYi55ID0gYi55L3RoaXMucGxvdC5kYXRhTGVuZ3RoXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucGxvdC5zdGFja2VkSGlzdG9ncmFtcyA9IHRoaXMucGxvdC5zdGFjayh0aGlzLnBsb3QuZ3JvdXBlZERhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXdBeGlzWCgpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgYXhpc0NvbmYgPSB0aGlzLmNvbmZpZy54O1xyXG4gICAgICAgIHZhciBheGlzID0gc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIitzZWxmLnByZWZpeENsYXNzKCdheGlzLXgnKStcIi5cIitzZWxmLnByZWZpeENsYXNzKCdheGlzJykrKHNlbGYuY29uZmlnLmd1aWRlcyA/ICcnIDogJy4nK3NlbGYucHJlZml4Q2xhc3MoJ25vLWd1aWRlcycpKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIHBsb3QuaGVpZ2h0ICsgXCIpXCIpO1xyXG5cclxuICAgICAgICB2YXIgYXhpc1QgPSBheGlzO1xyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy50cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGF4aXNUID0gYXhpcy50cmFuc2l0aW9uKCkuZWFzZShcInNpbi1pbi1vdXRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBheGlzVC5jYWxsKHBsb3QueC5heGlzKTtcclxuXHJcbiAgICAgICAgYXhpcy5zZWxlY3RPckFwcGVuZChcInRleHQuXCIrc2VsZi5wcmVmaXhDbGFzcygnbGFiZWwnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrIChwbG90LndpZHRoLzIpICtcIixcIisgKHBsb3QubWFyZ2luLmJvdHRvbSkgK1wiKVwiKSAgLy8gdGV4dCBpcyBkcmF3biBvZmYgdGhlIHNjcmVlbiB0b3AgbGVmdCwgbW92ZSBkb3duIGFuZCBvdXQgYW5kIHJvdGF0ZVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiLTFlbVwiKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAudGV4dChheGlzQ29uZi5sYWJlbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRyYXdBeGlzWSgpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgYXhpc0NvbmYgPSB0aGlzLmNvbmZpZy55O1xyXG4gICAgICAgIHZhciBheGlzID0gc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIitzZWxmLnByZWZpeENsYXNzKCdheGlzLXknKStcIi5cIitzZWxmLnByZWZpeENsYXNzKCdheGlzJykrKHNlbGYuY29uZmlnLmd1aWRlcyA/ICcnIDogJy4nK3NlbGYucHJlZml4Q2xhc3MoJ25vLWd1aWRlcycpKSk7XHJcblxyXG4gICAgICAgIHZhciBheGlzVCA9IGF4aXM7XHJcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLnRyYW5zaXRpb24pIHtcclxuICAgICAgICAgICAgYXhpc1QgPSBheGlzLnRyYW5zaXRpb24oKS5lYXNlKFwic2luLWluLW91dFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGF4aXNULmNhbGwocGxvdC55LmF4aXMpO1xyXG5cclxuICAgICAgICBheGlzLnNlbGVjdE9yQXBwZW5kKFwidGV4dC5cIitzZWxmLnByZWZpeENsYXNzKCdsYWJlbCcpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisgLXBsb3QubWFyZ2luLmxlZnQgK1wiLFwiKyhwbG90LmhlaWdodC8yKStcIilyb3RhdGUoLTkwKVwiKSAgLy8gdGV4dCBpcyBkcmF3biBvZmYgdGhlIHNjcmVlbiB0b3AgbGVmdCwgbW92ZSBkb3duIGFuZCBvdXQgYW5kIHJvdGF0ZVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGF4aXNDb25mLmxhYmVsKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIGRyYXdIaXN0b2dyYW0oKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBsYXllckNsYXNzID0gdGhpcy5wcmVmaXhDbGFzcyhcImxheWVyXCIpO1xyXG5cclxuICAgICAgICB2YXIgYmFyQ2xhc3MgPSB0aGlzLnByZWZpeENsYXNzKFwiYmFyXCIpO1xyXG4gICAgICAgIHZhciBsYXllciA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCIuXCIrbGF5ZXJDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGxvdC5zdGFja2VkSGlzdG9ncmFtcyk7XHJcblxyXG4gICAgICAgIGxheWVyLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGxheWVyQ2xhc3MpO1xyXG5cclxuICAgICAgICB2YXIgYmFyID0gbGF5ZXIuc2VsZWN0QWxsKFwiLlwiK2JhckNsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShkID0+IGQuaGlzdG9ncmFtQmlucyk7XHJcblxyXG4gICAgICAgIGJhci5lbnRlcigpLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBiYXJDbGFzcylcclxuICAgICAgICAgICAgLmFwcGVuZChcInJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDEpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGJhclJlY3QgPSBiYXIuc2VsZWN0KFwicmVjdFwiKTtcclxuXHJcbiAgICAgICAgdmFyIGJhclJlY3RUID0gYmFyUmVjdDtcclxuICAgICAgICB2YXIgYmFyVCA9IGJhcjtcclxuICAgICAgICB2YXIgbGF5ZXJUID0gbGF5ZXI7XHJcbiAgICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbkVuYWJsZWQoKSkge1xyXG4gICAgICAgICAgICBiYXJSZWN0VCA9IGJhclJlY3QudHJhbnNpdGlvbigpO1xyXG4gICAgICAgICAgICBiYXJUID0gYmFyLnRyYW5zaXRpb24oKTtcclxuICAgICAgICAgICAgbGF5ZXJUPSBsYXllci50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBiYXJULmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBwbG90Lnguc2NhbGUoZC54KSArIFwiLFwiICsgKHBsb3QueS5zY2FsZShkLnkwICtkLnkpKSArIFwiKVwiOyB9KTtcclxuXHJcbiAgICAgICAgdmFyIGR4ID0gcGxvdC5zdGFja2VkSGlzdG9ncmFtcy5sZW5ndGggPyAocGxvdC5zdGFja2VkSGlzdG9ncmFtc1swXS5oaXN0b2dyYW1CaW5zLmxlbmd0aCA/ICBwbG90Lnguc2NhbGUocGxvdC5zdGFja2VkSGlzdG9ncmFtc1swXS5oaXN0b2dyYW1CaW5zWzBdLmR4KSA6IDApIDogMDtcclxuICAgICAgICBiYXJSZWN0VFxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsICBkeCAtIHBsb3QueC5zY2FsZSgwKS0gMSlcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZCA9PiAgIHBsb3QuaGVpZ2h0IC0gcGxvdC55LnNjYWxlKGQueSkpO1xyXG5cclxuICAgICAgICBpZih0aGlzLnBsb3QuY29sb3Ipe1xyXG4gICAgICAgICAgICBsYXllclRcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCB0aGlzLnBsb3Quc2VyaWVzQ29sb3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBsb3QudG9vbHRpcCkge1xyXG4gICAgICAgICAgICBiYXIub24oXCJtb3VzZW92ZXJcIiwgZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDIwMClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIC45KTtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC5odG1sKGQueSlcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG4gICAgICAgICAgICB9KS5vbihcIm1vdXNlb3V0XCIsIGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxheWVyLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgICAgICBiYXIuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShuZXdEYXRhKXtcclxuICAgICAgICBzdXBlci51cGRhdGUobmV3RGF0YSk7XHJcbiAgICAgICAgdGhpcy5kcmF3QXhpc1goKTtcclxuICAgICAgICB0aGlzLmRyYXdBeGlzWSgpO1xyXG5cclxuICAgICAgICB0aGlzLmRyYXdIaXN0b2dyYW0oKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbn1cclxuIiwiaW1wb3J0IHtEM0V4dGVuc2lvbnN9IGZyb20gJy4vZDMtZXh0ZW5zaW9ucydcclxuRDNFeHRlbnNpb25zLmV4dGVuZCgpO1xyXG5cclxuZXhwb3J0IHtTY2F0dGVyUGxvdCwgU2NhdHRlclBsb3RDb25maWd9IGZyb20gXCIuL3NjYXR0ZXJwbG90XCI7XHJcbmV4cG9ydCB7U2NhdHRlclBsb3RNYXRyaXgsIFNjYXR0ZXJQbG90TWF0cml4Q29uZmlnfSBmcm9tIFwiLi9zY2F0dGVycGxvdC1tYXRyaXhcIjtcclxuZXhwb3J0IHtDb3JyZWxhdGlvbk1hdHJpeCwgQ29ycmVsYXRpb25NYXRyaXhDb25maWd9IGZyb20gJy4vY29ycmVsYXRpb24tbWF0cml4J1xyXG5leHBvcnQge1JlZ3Jlc3Npb24sIFJlZ3Jlc3Npb25Db25maWd9IGZyb20gJy4vcmVncmVzc2lvbidcclxuZXhwb3J0IHtIZWF0bWFwLCBIZWF0bWFwQ29uZmlnfSBmcm9tICcuL2hlYXRtYXAnXHJcbmV4cG9ydCB7SGVhdG1hcFRpbWVTZXJpZXMsIEhlYXRtYXBUaW1lU2VyaWVzQ29uZmlnfSBmcm9tICcuL2hlYXRtYXAtdGltZXNlcmllcydcclxuZXhwb3J0IHtIaXN0b2dyYW0sIEhpc3RvZ3JhbUNvbmZpZ30gZnJvbSAnLi9oaXN0b2dyYW0nXHJcbmV4cG9ydCB7QmFyQ2hhcnQsIEJhckNoYXJ0Q29uZmlnfSBmcm9tICcuL2Jhci1jaGFydCdcclxuZXhwb3J0IHtCb3hQbG90QmFzZSwgQm94UGxvdEJhc2VDb25maWd9IGZyb20gJy4vYm94LXBsb3QtYmFzZSdcclxuZXhwb3J0IHtTdGF0aXN0aWNzVXRpbHN9IGZyb20gJy4vc3RhdGlzdGljcy11dGlscydcclxuZXhwb3J0IHtMZWdlbmR9IGZyb20gJy4vbGVnZW5kJ1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiIsImltcG9ydCB7VXRpbHN9IGZyb20gXCIuL3V0aWxzXCI7XHJcbmltcG9ydCB7Y29sb3IsIHNpemUsIHN5bWJvbH0gZnJvbSBcIi4uL2Jvd2VyX2NvbXBvbmVudHMvZDMtbGVnZW5kL25vLWV4dGVuZFwiO1xyXG5cclxuLyp2YXIgZDMgPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL2QzJyk7XHJcbiovXHJcbi8vIHZhciBsZWdlbmQgPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL2QzLWxlZ2VuZC9uby1leHRlbmQnKTtcclxuLy9cclxuLy8gbW9kdWxlLmV4cG9ydHMubGVnZW5kID0gbGVnZW5kO1xyXG5cclxuZXhwb3J0IGNsYXNzIExlZ2VuZCB7XHJcblxyXG4gICAgY3NzQ2xhc3NQcmVmaXg9XCJvZGMtXCI7XHJcbiAgICBsZWdlbmRDbGFzcz10aGlzLmNzc0NsYXNzUHJlZml4K1wibGVnZW5kXCI7XHJcbiAgICBjb250YWluZXI7XHJcbiAgICBzY2FsZTtcclxuICAgIGNvbG9yPSBjb2xvcjtcclxuICAgIHNpemUgPSBzaXplO1xyXG4gICAgc3ltYm9sPSBzeW1ib2w7XHJcbiAgICBndWlkO1xyXG5cclxuICAgIGxhYmVsRm9ybWF0ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHN2ZywgbGVnZW5kUGFyZW50LCBzY2FsZSwgbGVnZW5kWCwgbGVnZW5kWSwgbGFiZWxGb3JtYXQpe1xyXG4gICAgICAgIHRoaXMuc2NhbGU9c2NhbGU7XHJcbiAgICAgICAgdGhpcy5zdmcgPSBzdmc7XHJcbiAgICAgICAgdGhpcy5ndWlkID0gVXRpbHMuZ3VpZCgpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gIFV0aWxzLnNlbGVjdE9yQXBwZW5kKGxlZ2VuZFBhcmVudCwgXCJnLlwiK3RoaXMubGVnZW5kQ2xhc3MsIFwiZ1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIitsZWdlbmRYK1wiLFwiK2xlZ2VuZFkrXCIpXCIpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKHRoaXMubGVnZW5kQ2xhc3MsIHRydWUpO1xyXG5cclxuICAgICAgICB0aGlzLmxhYmVsRm9ybWF0ID0gbGFiZWxGb3JtYXQ7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBsaW5lYXJHcmFkaWVudEJhcihiYXJXaWR0aCwgYmFySGVpZ2h0LCB0aXRsZSl7XHJcbiAgICAgICAgdmFyIGdyYWRpZW50SWQgPSB0aGlzLmNzc0NsYXNzUHJlZml4K1wibGluZWFyLWdyYWRpZW50XCIrXCItXCIrdGhpcy5ndWlkO1xyXG4gICAgICAgIHZhciBzY2FsZT0gdGhpcy5zY2FsZTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMubGluZWFyR3JhZGllbnQgPSBVdGlscy5saW5lYXJHcmFkaWVudCh0aGlzLnN2ZywgZ3JhZGllbnRJZCwgdGhpcy5zY2FsZS5yYW5nZSgpLCAwLCAxMDAsIDAsIDApO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmQoXCJyZWN0XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgYmFyV2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGJhckhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAwKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwidXJsKCNcIitncmFkaWVudElkK1wiKVwiKTtcclxuXHJcblxyXG4gICAgICAgIHZhciB0aWNrcyA9IHRoaXMuY29udGFpbmVyLnNlbGVjdEFsbChcInRleHRcIilcclxuICAgICAgICAgICAgLmRhdGEoIHNjYWxlLmRvbWFpbigpICk7XHJcbiAgICAgICAgdmFyIHRpY2tzTnVtYmVyID1zY2FsZS5kb21haW4oKS5sZW5ndGgtMTtcclxuICAgICAgICB0aWNrcy5lbnRlcigpLmFwcGVuZChcInRleHRcIik7XHJcblxyXG4gICAgICAgIHRpY2tzLmF0dHIoXCJ4XCIsIGJhcldpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgIChkLCBpKSA9PiAgYmFySGVpZ2h0IC0oaSpiYXJIZWlnaHQvdGlja3NOdW1iZXIpKVxyXG4gICAgICAgICAgICAuYXR0cihcImR4XCIsIDMpXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiZHlcIiwgMSlcclxuICAgICAgICAgICAgLmF0dHIoXCJhbGlnbm1lbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoZD0+IHNlbGYubGFiZWxGb3JtYXQgPyBzZWxmLmxhYmVsRm9ybWF0KGQpIDogZCk7XHJcbiAgICAgICAgdGlja3MuYXR0cihcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgaWYodGhpcy5yb3RhdGVMYWJlbHMpe1xyXG4gICAgICAgICAgICB0aWNrc1xyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwicm90YXRlKC00NSwgXCIgKyBiYXJXaWR0aCArIFwiLCBcIiArIChiYXJIZWlnaHQgLShpKmJhckhlaWdodC90aWNrc051bWJlcikpICsgXCIpXCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwic3RhcnRcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZHhcIiwgNSlcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgNSk7XHJcblxyXG4gICAgICAgIH1lbHNle1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRpY2tzLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Um90YXRlTGFiZWxzKHJvdGF0ZUxhYmVscykge1xyXG4gICAgICAgIHRoaXMucm90YXRlTGFiZWxzID0gcm90YXRlTGFiZWxzO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG59IiwiaW1wb3J0IHtDaGFydCwgQ2hhcnRDb25maWd9IGZyb20gXCIuL2NoYXJ0XCI7XHJcbmltcG9ydCB7U2NhdHRlclBsb3QsIFNjYXR0ZXJQbG90Q29uZmlnfSBmcm9tIFwiLi9zY2F0dGVycGxvdFwiO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5pbXBvcnQge1N0YXRpc3RpY3NVdGlsc30gZnJvbSAnLi9zdGF0aXN0aWNzLXV0aWxzJ1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBSZWdyZXNzaW9uQ29uZmlnIGV4dGVuZHMgU2NhdHRlclBsb3RDb25maWd7XHJcblxyXG4gICAgbWFpblJlZ3Jlc3Npb24gPSB0cnVlO1xyXG4gICAgZ3JvdXBSZWdyZXNzaW9uID0gdHJ1ZTtcclxuICAgIGNvbmZpZGVuY2U9e1xyXG4gICAgICAgIGxldmVsOiAwLjk1LFxyXG4gICAgICAgIGNyaXRpY2FsVmFsdWU6IChkZWdyZWVzT2ZGcmVlZG9tLCBjcml0aWNhbFByb2JhYmlsaXR5KSA9PiBTdGF0aXN0aWNzVXRpbHMudFZhbHVlKGRlZ3JlZXNPZkZyZWVkb20sIGNyaXRpY2FsUHJvYmFiaWxpdHkpLFxyXG4gICAgICAgIG1hcmdpbk9mRXJyb3I6IHVuZGVmaW5lZCAvL2N1c3RvbSAgbWFyZ2luIE9mIEVycm9yIGZ1bmN0aW9uICh4LCBwb2ludHMpXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgaWYoY3VzdG9tKXtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBSZWdyZXNzaW9uIGV4dGVuZHMgU2NhdHRlclBsb3R7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBzdXBlcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBuZXcgUmVncmVzc2lvbkNvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKXtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBSZWdyZXNzaW9uQ29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCl7XHJcbiAgICAgICAgc3VwZXIuaW5pdFBsb3QoKTtcclxuICAgICAgICB0aGlzLmluaXRSZWdyZXNzaW9uTGluZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0UmVncmVzc2lvbkxpbmVzKCl7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgZ3JvdXBzQXZhaWxhYmxlID0gc2VsZi5wbG90Lmdyb3VwaW5nRW5hYmxlZDtcclxuXHJcbiAgICAgICAgc2VsZi5wbG90LnJlZ3Jlc3Npb25zPSBbXTtcclxuXHJcblxyXG4gICAgICAgIGlmKGdyb3Vwc0F2YWlsYWJsZSAmJiBzZWxmLmNvbmZpZy5tYWluUmVncmVzc2lvbil7XHJcbiAgICAgICAgICAgIHZhciByZWdyZXNzaW9uID0gdGhpcy5pbml0UmVncmVzc2lvbih0aGlzLnBsb3QuZGF0YSwgZmFsc2UpO1xyXG4gICAgICAgICAgICBzZWxmLnBsb3QucmVncmVzc2lvbnMucHVzaChyZWdyZXNzaW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHNlbGYuY29uZmlnLmdyb3VwUmVncmVzc2lvbil7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdEdyb3VwUmVncmVzc2lvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdEdyb3VwUmVncmVzc2lvbigpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYucGxvdC5ncm91cGVkRGF0YS5mb3JFYWNoKGdyb3VwPT57XHJcbiAgICAgICAgICAgIHZhciByZWdyZXNzaW9uID0gdGhpcy5pbml0UmVncmVzc2lvbihncm91cC52YWx1ZXMsIGdyb3VwLmtleSk7XHJcbiAgICAgICAgICAgIHNlbGYucGxvdC5yZWdyZXNzaW9ucy5wdXNoKHJlZ3Jlc3Npb24pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRSZWdyZXNzaW9uKHZhbHVlcywgZ3JvdXBWYWwpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIHBvaW50cyA9IHZhbHVlcy5tYXAoZD0+e1xyXG4gICAgICAgICAgICByZXR1cm4gW3BhcnNlRmxvYXQoc2VsZi5wbG90LngudmFsdWUoZCkpLCBwYXJzZUZsb2F0KHNlbGYucGxvdC55LnZhbHVlKGQpKV07XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHBvaW50cy5zb3J0KChhLGIpID0+IGFbMF0tYlswXSk7XHJcblxyXG4gICAgICAgIHZhciBsaW5lYXJSZWdyZXNzaW9uID0gIFN0YXRpc3RpY3NVdGlscy5saW5lYXJSZWdyZXNzaW9uKHBvaW50cyk7XHJcbiAgICAgICAgdmFyIGxpbmVhclJlZ3Jlc3Npb25MaW5lID0gU3RhdGlzdGljc1V0aWxzLmxpbmVhclJlZ3Jlc3Npb25MaW5lKGxpbmVhclJlZ3Jlc3Npb24pO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGV4dGVudFggPSBkMy5leHRlbnQocG9pbnRzLCBkPT5kWzBdKTtcclxuXHJcblxyXG4gICAgICAgIHZhciBsaW5lUG9pbnRzID0gW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB4OiBleHRlbnRYWzBdLFxyXG4gICAgICAgICAgICAgICAgeTogbGluZWFyUmVncmVzc2lvbkxpbmUoZXh0ZW50WFswXSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeDogZXh0ZW50WFsxXSxcclxuICAgICAgICAgICAgICAgIHk6IGxpbmVhclJlZ3Jlc3Npb25MaW5lKGV4dGVudFhbMV0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICB2YXIgbGluZSA9IGQzLnN2Zy5saW5lKClcclxuICAgICAgICAgICAgLmludGVycG9sYXRlKFwiYmFzaXNcIilcclxuICAgICAgICAgICAgLngoZCA9PiBzZWxmLnBsb3QueC5zY2FsZShkLngpKVxyXG4gICAgICAgICAgICAueShkID0+IHNlbGYucGxvdC55LnNjYWxlKGQueSkpO1xyXG5cclxuICAgICAgICB2YXIgY29sb3IgPSBzZWxmLnBsb3QuY29sb3I7XHJcblxyXG4gICAgICAgIHZhciBkZWZhdWx0Q29sb3IgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgaWYoVXRpbHMuaXNGdW5jdGlvbihjb2xvcikpe1xyXG4gICAgICAgICAgICBpZih2YWx1ZXMubGVuZ3RoICYmIGdyb3VwVmFsIT09ZmFsc2Upe1xyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5jb25maWcuc2VyaWVzKXtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvciA9c2VsZi5wbG90LmNvbG9yQ2F0ZWdvcnkoZ3JvdXBWYWwpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3IgPSBjb2xvcih2YWx1ZXNbMF0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBjb2xvciA9IGRlZmF1bHRDb2xvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1lbHNlIGlmKCFjb2xvciAmJiBncm91cFZhbD09PWZhbHNlKXtcclxuICAgICAgICAgICAgY29sb3IgPSBkZWZhdWx0Q29sb3I7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdmFyIGNvbmZpZGVuY2UgPSB0aGlzLmNvbXB1dGVDb25maWRlbmNlKHBvaW50cywgZXh0ZW50WCwgIGxpbmVhclJlZ3Jlc3Npb24sbGluZWFyUmVncmVzc2lvbkxpbmUpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGdyb3VwOiBncm91cFZhbCB8fCBmYWxzZSxcclxuICAgICAgICAgICAgbGluZTogbGluZSxcclxuICAgICAgICAgICAgbGluZVBvaW50czogbGluZVBvaW50cyxcclxuICAgICAgICAgICAgY29sb3I6IGNvbG9yLFxyXG4gICAgICAgICAgICBjb25maWRlbmNlOiBjb25maWRlbmNlXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wdXRlQ29uZmlkZW5jZShwb2ludHMsIGV4dGVudFgsIGxpbmVhclJlZ3Jlc3Npb24sbGluZWFyUmVncmVzc2lvbkxpbmUpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgc2xvcGUgPSBsaW5lYXJSZWdyZXNzaW9uLm07XHJcbiAgICAgICAgdmFyIG4gPSBwb2ludHMubGVuZ3RoO1xyXG4gICAgICAgIHZhciBkZWdyZWVzT2ZGcmVlZG9tID0gTWF0aC5tYXgoMCwgbi0yKTtcclxuXHJcbiAgICAgICAgdmFyIGFscGhhID0gMSAtIHNlbGYuY29uZmlnLmNvbmZpZGVuY2UubGV2ZWw7XHJcbiAgICAgICAgdmFyIGNyaXRpY2FsUHJvYmFiaWxpdHkgID0gMSAtIGFscGhhLzI7XHJcbiAgICAgICAgdmFyIGNyaXRpY2FsVmFsdWUgPSBzZWxmLmNvbmZpZy5jb25maWRlbmNlLmNyaXRpY2FsVmFsdWUoZGVncmVlc09mRnJlZWRvbSxjcml0aWNhbFByb2JhYmlsaXR5KTtcclxuXHJcbiAgICAgICAgdmFyIHhWYWx1ZXMgPSBwb2ludHMubWFwKGQ9PmRbMF0pO1xyXG4gICAgICAgIHZhciBtZWFuWCA9IFN0YXRpc3RpY3NVdGlscy5tZWFuKHhWYWx1ZXMpO1xyXG4gICAgICAgIHZhciB4TXlTdW09MDtcclxuICAgICAgICB2YXIgeFN1bT0wO1xyXG4gICAgICAgIHZhciB4UG93U3VtPTA7XHJcbiAgICAgICAgdmFyIHlTdW09MDtcclxuICAgICAgICB2YXIgeVBvd1N1bT0wO1xyXG4gICAgICAgIHBvaW50cy5mb3JFYWNoKHA9PntcclxuICAgICAgICAgICAgdmFyIHggPSBwWzBdO1xyXG4gICAgICAgICAgICB2YXIgeSA9IHBbMV07XHJcblxyXG4gICAgICAgICAgICB4TXlTdW0gKz0geCp5O1xyXG4gICAgICAgICAgICB4U3VtKz14O1xyXG4gICAgICAgICAgICB5U3VtKz15O1xyXG4gICAgICAgICAgICB4UG93U3VtKz0geCp4O1xyXG4gICAgICAgICAgICB5UG93U3VtKz0geSp5O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBhID0gbGluZWFyUmVncmVzc2lvbi5tO1xyXG4gICAgICAgIHZhciBiID0gbGluZWFyUmVncmVzc2lvbi5iO1xyXG5cclxuICAgICAgICB2YXIgU2EyID0gbi8obisyKSAqICgoeVBvd1N1bS1hKnhNeVN1bS1iKnlTdW0pLyhuKnhQb3dTdW0tKHhTdW0qeFN1bSkpKTsgLy9XYXJpYW5jamEgd3Nww7PFgmN6eW5uaWthIGtpZXJ1bmtvd2VnbyByZWdyZXNqaSBsaW5pb3dlaiBhXHJcbiAgICAgICAgdmFyIFN5MiA9ICh5UG93U3VtIC0gYSp4TXlTdW0tYip5U3VtKS8obioobi0yKSk7IC8vU2EyIC8vTWVhbiB5IHZhbHVlIHZhcmlhbmNlXHJcblxyXG4gICAgICAgIHZhciBlcnJvckZuID0geD0+IE1hdGguc3FydChTeTIgKyBNYXRoLnBvdyh4LW1lYW5YLDIpKlNhMik7IC8vcGllcndpYXN0ZWsga3dhZHJhdG93eSB6IHdhcmlhbmNqaSBkb3dvbG5lZ28gcHVua3R1IHByb3N0ZWpcclxuICAgICAgICB2YXIgbWFyZ2luT2ZFcnJvciA9ICB4PT4gY3JpdGljYWxWYWx1ZSogZXJyb3JGbih4KTtcclxuXHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCduJywgbiwgJ2RlZ3JlZXNPZkZyZWVkb20nLCBkZWdyZWVzT2ZGcmVlZG9tLCAnY3JpdGljYWxQcm9iYWJpbGl0eScsY3JpdGljYWxQcm9iYWJpbGl0eSk7XHJcbiAgICAgICAgLy8gdmFyIGNvbmZpZGVuY2VEb3duID0geCA9PiBsaW5lYXJSZWdyZXNzaW9uTGluZSh4KSAtICBtYXJnaW5PZkVycm9yKHgpO1xyXG4gICAgICAgIC8vIHZhciBjb25maWRlbmNlVXAgPSB4ID0+IGxpbmVhclJlZ3Jlc3Npb25MaW5lKHgpICsgIG1hcmdpbk9mRXJyb3IoeCk7XHJcblxyXG5cclxuICAgICAgICB2YXIgY29tcHV0ZUNvbmZpZGVuY2VBcmVhUG9pbnQgPSB4PT57XHJcbiAgICAgICAgICAgIHZhciBsaW5lYXJSZWdyZXNzaW9uID0gbGluZWFyUmVncmVzc2lvbkxpbmUoeCk7XHJcbiAgICAgICAgICAgIHZhciBtb2UgPSBtYXJnaW5PZkVycm9yKHgpO1xyXG4gICAgICAgICAgICB2YXIgY29uZkRvd24gPSBsaW5lYXJSZWdyZXNzaW9uIC0gbW9lO1xyXG4gICAgICAgICAgICB2YXIgY29uZlVwID0gbGluZWFyUmVncmVzc2lvbiArIG1vZTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHg6IHgsXHJcbiAgICAgICAgICAgICAgICB5MDogY29uZkRvd24sXHJcbiAgICAgICAgICAgICAgICB5MTogY29uZlVwXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGNlbnRlclggPSAoZXh0ZW50WFsxXStleHRlbnRYWzBdKS8yO1xyXG5cclxuICAgICAgICAvLyB2YXIgY29uZmlkZW5jZUFyZWFQb2ludHMgPSBbZXh0ZW50WFswXSwgY2VudGVyWCwgIGV4dGVudFhbMV1dLm1hcChjb21wdXRlQ29uZmlkZW5jZUFyZWFQb2ludCk7XHJcbiAgICAgICAgdmFyIGNvbmZpZGVuY2VBcmVhUG9pbnRzID0gW2V4dGVudFhbMF0sIGNlbnRlclgsICBleHRlbnRYWzFdXS5tYXAoY29tcHV0ZUNvbmZpZGVuY2VBcmVhUG9pbnQpO1xyXG5cclxuICAgICAgICB2YXIgZml0SW5QbG90ID0geSA9PiB5O1xyXG5cclxuICAgICAgICB2YXIgY29uZmlkZW5jZUFyZWEgPSAgZDMuc3ZnLmFyZWEoKVxyXG4gICAgICAgIC5pbnRlcnBvbGF0ZShcIm1vbm90b25lXCIpXHJcbiAgICAgICAgICAgIC54KGQgPT4gc2VsZi5wbG90Lnguc2NhbGUoZC54KSlcclxuICAgICAgICAgICAgLnkwKGQgPT4gZml0SW5QbG90KHNlbGYucGxvdC55LnNjYWxlKGQueTApKSlcclxuICAgICAgICAgICAgLnkxKGQgPT4gZml0SW5QbG90KHNlbGYucGxvdC55LnNjYWxlKGQueTEpKSk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGFyZWE6Y29uZmlkZW5jZUFyZWEsXHJcbiAgICAgICAgICAgIHBvaW50czpjb25maWRlbmNlQXJlYVBvaW50c1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKG5ld0RhdGEpe1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJlZ3Jlc3Npb25MaW5lcygpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlUmVncmVzc2lvbkxpbmVzKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcmVncmVzc2lvbkNvbnRhaW5lckNsYXNzID0gdGhpcy5wcmVmaXhDbGFzcyhcInJlZ3Jlc3Npb24tY29udGFpbmVyXCIpO1xyXG4gICAgICAgIHZhciByZWdyZXNzaW9uQ29udGFpbmVyU2VsZWN0b3IgPSBcImcuXCIrcmVncmVzc2lvbkNvbnRhaW5lckNsYXNzO1xyXG5cclxuICAgICAgICB2YXIgY2xpcFBhdGhJZCA9IHNlbGYucHJlZml4Q2xhc3MoXCJjbGlwXCIpO1xyXG5cclxuICAgICAgICB2YXIgcmVncmVzc2lvbkNvbnRhaW5lciA9IHNlbGYuc3ZnRy5zZWxlY3RPckluc2VydChyZWdyZXNzaW9uQ29udGFpbmVyU2VsZWN0b3IsIFwiLlwiK3NlbGYuZG90c0NvbnRhaW5lckNsYXNzKTtcclxuICAgICAgICB2YXIgcmVncmVzc2lvbkNvbnRhaW5lckNsaXAgPSByZWdyZXNzaW9uQ29udGFpbmVyLnNlbGVjdE9yQXBwZW5kKFwiY2xpcFBhdGhcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBjbGlwUGF0aElkKTtcclxuXHJcblxyXG4gICAgICAgIHJlZ3Jlc3Npb25Db250YWluZXJDbGlwLnNlbGVjdE9yQXBwZW5kKCdyZWN0JylcclxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgc2VsZi5wbG90LndpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0Jywgc2VsZi5wbG90LmhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAwKVxyXG4gICAgICAgICAgICAuYXR0cigneScsIDApO1xyXG5cclxuICAgICAgICByZWdyZXNzaW9uQ29udGFpbmVyLmF0dHIoXCJjbGlwLXBhdGhcIiwgKGQsaSkgPT4gXCJ1cmwoI1wiK2NsaXBQYXRoSWQrXCIpXCIpO1xyXG5cclxuICAgICAgICB2YXIgcmVncmVzc2lvbkNsYXNzID0gdGhpcy5wcmVmaXhDbGFzcyhcInJlZ3Jlc3Npb25cIik7XHJcbiAgICAgICAgdmFyIGNvbmZpZGVuY2VBcmVhQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwiY29uZmlkZW5jZVwiKTtcclxuICAgICAgICB2YXIgcmVncmVzc2lvblNlbGVjdG9yID0gXCJnLlwiK3JlZ3Jlc3Npb25DbGFzcztcclxuICAgICAgICB2YXIgcmVncmVzc2lvbiA9IHJlZ3Jlc3Npb25Db250YWluZXIuc2VsZWN0QWxsKHJlZ3Jlc3Npb25TZWxlY3RvcilcclxuICAgICAgICAgICAgLmRhdGEoc2VsZi5wbG90LnJlZ3Jlc3Npb25zLCAoZCxpKT0+IGQuZ3JvdXApO1xyXG5cclxuICAgICAgICB2YXIgcmVncmVzc2lvbkVudGVyRyA9IHJlZ3Jlc3Npb24uZW50ZXIoKS5pbnNlcnRTZWxlY3RvcihyZWdyZXNzaW9uU2VsZWN0b3IpO1xyXG4gICAgICAgIHZhciBsaW5lQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwibGluZVwiKTtcclxuICAgICAgICByZWdyZXNzaW9uRW50ZXJHXHJcblxyXG4gICAgICAgICAgICAuYXBwZW5kKFwicGF0aFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGxpbmVDbGFzcylcclxuICAgICAgICAgICAgLmF0dHIoXCJzaGFwZS1yZW5kZXJpbmdcIiwgXCJvcHRpbWl6ZVF1YWxpdHlcIik7XHJcbiAgICAgICAgICAgIC8vIC5hcHBlbmQoXCJsaW5lXCIpXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiY2xhc3NcIiwgXCJsaW5lXCIpXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwic2hhcGUtcmVuZGVyaW5nXCIsIFwib3B0aW1pemVRdWFsaXR5XCIpO1xyXG5cclxuICAgICAgICB2YXIgbGluZSA9IHJlZ3Jlc3Npb24uc2VsZWN0KFwicGF0aC5cIitsaW5lQ2xhc3MpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCByID0+IHIuY29sb3IpO1xyXG4gICAgICAgIC8vIC5hdHRyKFwieDFcIiwgcj0+IHNlbGYucGxvdC54LnNjYWxlKHIubGluZVBvaW50c1swXS54KSlcclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJ5MVwiLCByPT4gc2VsZi5wbG90Lnkuc2NhbGUoci5saW5lUG9pbnRzWzBdLnkpKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcIngyXCIsIHI9PiBzZWxmLnBsb3QueC5zY2FsZShyLmxpbmVQb2ludHNbMV0ueCkpXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwieTJcIiwgcj0+IHNlbGYucGxvdC55LnNjYWxlKHIubGluZVBvaW50c1sxXS55KSlcclxuXHJcblxyXG4gICAgICAgIHZhciBsaW5lVCA9IGxpbmU7XHJcbiAgICAgICAgaWYgKHNlbGYudHJhbnNpdGlvbkVuYWJsZWQoKSkge1xyXG4gICAgICAgICAgICBsaW5lVCA9IGxpbmUudHJhbnNpdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGluZVQuYXR0cihcImRcIiwgciA9PiByLmxpbmUoci5saW5lUG9pbnRzKSlcclxuXHJcblxyXG4gICAgICAgIHJlZ3Jlc3Npb25FbnRlckdcclxuICAgICAgICAgICAgLmFwcGVuZChcInBhdGhcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBjb25maWRlbmNlQXJlYUNsYXNzKVxyXG4gICAgICAgICAgICAuYXR0cihcInNoYXBlLXJlbmRlcmluZ1wiLCBcIm9wdGltaXplUXVhbGl0eVwiKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIFwiMC40XCIpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHZhciBhcmVhID0gcmVncmVzc2lvbi5zZWxlY3QoXCJwYXRoLlwiK2NvbmZpZGVuY2VBcmVhQ2xhc3MpO1xyXG5cclxuICAgICAgICB2YXIgYXJlYVQgPSBhcmVhO1xyXG4gICAgICAgIGlmIChzZWxmLnRyYW5zaXRpb25FbmFibGVkKCkpIHtcclxuICAgICAgICAgICAgYXJlYVQgPSBhcmVhLnRyYW5zaXRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYXJlYVQuYXR0cihcImRcIiwgciA9PiByLmNvbmZpZGVuY2UuYXJlYShyLmNvbmZpZGVuY2UucG9pbnRzKSk7XHJcbiAgICAgICAgYXJlYVQuc3R5bGUoXCJmaWxsXCIsIHIgPT4gci5jb2xvcilcclxuICAgICAgICByZWdyZXNzaW9uLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn1cclxuXHJcbiIsImltcG9ydCB7Q2hhcnRXaXRoQ29sb3JHcm91cHN9IGZyb20gXCIuL2NoYXJ0LXdpdGgtY29sb3ItZ3JvdXBzXCI7XHJcbmltcG9ydCB7U2NhdHRlclBsb3RDb25maWd9IGZyb20gXCIuL3NjYXR0ZXJwbG90XCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7TGVnZW5kfSBmcm9tIFwiLi9sZWdlbmRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTY2F0dGVyUGxvdE1hdHJpeENvbmZpZyBleHRlbmRzIFNjYXR0ZXJQbG90Q29uZmlne1xyXG5cclxuICAgIHN2Z0NsYXNzPSB0aGlzLmNzc0NsYXNzUHJlZml4KydzY2F0dGVycGxvdC1tYXRyaXgnO1xyXG4gICAgc2l6ZT0gdW5kZWZpbmVkOyAvL3NjYXR0ZXIgcGxvdCBjZWxsIHNpemVcclxuICAgIG1pbkNlbGxTaXplID0gNTA7XHJcbiAgICBtYXhDZWxsU2l6ZSA9IDEwMDA7XHJcbiAgICBwYWRkaW5nPSAyMDsgLy9zY2F0dGVyIHBsb3QgY2VsbCBwYWRkaW5nXHJcbiAgICBicnVzaD0gdHJ1ZTtcclxuICAgIGd1aWRlcz0gdHJ1ZTsgLy9zaG93IGF4aXMgZ3VpZGVzXHJcbiAgICBzaG93VG9vbHRpcD0gdHJ1ZTsgLy9zaG93IHRvb2x0aXAgb24gZG90IGhvdmVyXHJcbiAgICB0aWNrcz0gdW5kZWZpbmVkOyAvL3RpY2tzIG51bWJlciwgKGRlZmF1bHQ6IGNvbXB1dGVkIHVzaW5nIGNlbGwgc2l6ZSlcclxuICAgIHg9ey8vIFggYXhpcyBjb25maWdcclxuICAgICAgICBvcmllbnQ6IFwiYm90dG9tXCIsXHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCJcclxuICAgIH07XHJcbiAgICB5PXsvLyBZIGF4aXMgY29uZmlnXHJcbiAgICAgICAgb3JpZW50OiBcImxlZnRcIixcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIlxyXG4gICAgfTtcclxuICAgIGdyb3Vwcz17XHJcbiAgICAgICAga2V5OiB1bmRlZmluZWQsIC8vb2JqZWN0IHByb3BlcnR5IG5hbWUgb3IgYXJyYXkgaW5kZXggd2l0aCBncm91cGluZyB2YXJpYWJsZVxyXG4gICAgICAgIGluY2x1ZGVJblBsb3Q6IGZhbHNlLCAvL2luY2x1ZGUgZ3JvdXAgYXMgdmFyaWFibGUgaW4gcGxvdCwgYm9vbGVhbiAoZGVmYXVsdDogZmFsc2UpXHJcbiAgICB9O1xyXG4gICAgdmFyaWFibGVzPSB7XHJcbiAgICAgICAgbGFiZWxzOiBbXSwgLy9vcHRpb25hbCBhcnJheSBvZiB2YXJpYWJsZSBsYWJlbHMgKGZvciB0aGUgZGlhZ29uYWwgb2YgdGhlIHBsb3QpLlxyXG4gICAgICAgIGtleXM6IFtdLCAvL29wdGlvbmFsIGFycmF5IG9mIHZhcmlhYmxlIGtleXNcclxuICAgICAgICB2YWx1ZTogKGQsIHZhcmlhYmxlS2V5KSA9PiBkW3ZhcmlhYmxlS2V5XSAvLyB2YXJpYWJsZSB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTY2F0dGVyUGxvdE1hdHJpeCBleHRlbmRzIENoYXJ0V2l0aENvbG9yR3JvdXBzIHtcclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIG5ldyBTY2F0dGVyUGxvdE1hdHJpeENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgU2NhdHRlclBsb3RNYXRyaXhDb25maWcoY29uZmlnKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgbWFyZ2luID0gdGhpcy5wbG90Lm1hcmdpbjtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG4gICAgICAgIHRoaXMucGxvdC54PXt9O1xyXG4gICAgICAgIHRoaXMucGxvdC55PXt9O1xyXG4gICAgICAgIHRoaXMucGxvdC5kb3Q9e1xyXG4gICAgICAgICAgICBjb2xvcjogbnVsbC8vY29sb3Igc2NhbGUgbWFwcGluZyBmdW5jdGlvblxyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zZXR1cFZhcmlhYmxlcygpO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3Quc2l6ZSA9IGNvbmYuc2l6ZTtcclxuXHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IGNvbmYud2lkdGg7XHJcbiAgICAgICAgdmFyIGF2YWlsYWJsZVdpZHRoID0gVXRpbHMuYXZhaWxhYmxlV2lkdGgodGhpcy5jb25maWcud2lkdGgsIHRoaXMuZ2V0QmFzZUNvbnRhaW5lcigpLCBtYXJnaW4pO1xyXG4gICAgICAgIHZhciBhdmFpbGFibGVIZWlnaHQgPSBVdGlscy5hdmFpbGFibGVIZWlnaHQodGhpcy5jb25maWcuaGVpZ2h0LCB0aGlzLmdldEJhc2VDb250YWluZXIoKSwgbWFyZ2luKTtcclxuICAgICAgICBpZiAoIXdpZHRoKSB7XHJcbiAgICAgICAgICAgIGlmKCF0aGlzLnBsb3Quc2l6ZSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3Quc2l6ZSA9ICBNYXRoLm1pbihjb25mLm1heENlbGxTaXplLCBNYXRoLm1heChjb25mLm1pbkNlbGxTaXplLCBhdmFpbGFibGVXaWR0aC90aGlzLnBsb3QudmFyaWFibGVzLmxlbmd0aCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdpZHRoID0gbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQgKyB0aGlzLnBsb3QudmFyaWFibGVzLmxlbmd0aCp0aGlzLnBsb3Quc2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIXRoaXMucGxvdC5zaXplKXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LnNpemUgPSAod2lkdGggLSAobWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQpKSAvIHRoaXMucGxvdC52YXJpYWJsZXMubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGhlaWdodCA9IHdpZHRoO1xyXG4gICAgICAgIGlmICghaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGhlaWdodCA9IGF2YWlsYWJsZUhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC53aWR0aCA9IHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XHJcbiAgICAgICAgdGhpcy5wbG90LmhlaWdodCA9IGhlaWdodCAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnRpY2tzID0gY29uZi50aWNrcztcclxuXHJcbiAgICAgICAgaWYodGhpcy5wbG90LnRpY2tzPT09dW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LnRpY2tzID0gdGhpcy5wbG90LnNpemUgLyA0MDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBYKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFkoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cFZhcmlhYmxlcygpIHtcclxuICAgICAgICB2YXIgdmFyaWFibGVzQ29uZiA9IHRoaXMuY29uZmlnLnZhcmlhYmxlcztcclxuXHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLnBsb3QuZ3JvdXBlZERhdGE7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgcGxvdC5kb21haW5CeVZhcmlhYmxlID0ge307XHJcbiAgICAgICAgcGxvdC52YXJpYWJsZXMgPSB2YXJpYWJsZXNDb25mLmtleXM7XHJcbiAgICAgICAgaWYoIXBsb3QudmFyaWFibGVzIHx8ICFwbG90LnZhcmlhYmxlcy5sZW5ndGgpe1xyXG5cclxuICAgICAgICAgICAgcGxvdC52YXJpYWJsZXMgPSBkYXRhLmxlbmd0aCA/IFV0aWxzLmluZmVyVmFyaWFibGVzKGRhdGFbMF0udmFsdWVzLCB0aGlzLmNvbmZpZy5ncm91cHMua2V5LCB0aGlzLmNvbmZpZy5pbmNsdWRlSW5QbG90KSA6IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcGxvdC5sYWJlbHMgPSBbXTtcclxuICAgICAgICBwbG90LmxhYmVsQnlWYXJpYWJsZSA9IHt9O1xyXG4gICAgICAgIHBsb3QudmFyaWFibGVzLmZvckVhY2goKHZhcmlhYmxlS2V5LCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgbWluID0gZDMubWluKGRhdGEsIHM9PmQzLm1pbihzLnZhbHVlcywgZD0+dmFyaWFibGVzQ29uZi52YWx1ZShkLCB2YXJpYWJsZUtleSkpKTtcclxuICAgICAgICAgICAgdmFyIG1heCA9IGQzLm1heChkYXRhLCBzPT5kMy5tYXgocy52YWx1ZXMsIGQ9PnZhcmlhYmxlc0NvbmYudmFsdWUoZCwgdmFyaWFibGVLZXkpKSk7XHJcbiAgICAgICAgICAgIHBsb3QuZG9tYWluQnlWYXJpYWJsZVt2YXJpYWJsZUtleV0gPSBbbWluLG1heF07XHJcbiAgICAgICAgICAgIHZhciBsYWJlbCA9IHZhcmlhYmxlS2V5O1xyXG4gICAgICAgICAgICBpZih2YXJpYWJsZXNDb25mLmxhYmVscyAmJiB2YXJpYWJsZXNDb25mLmxhYmVscy5sZW5ndGg+aW5kZXgpe1xyXG5cclxuICAgICAgICAgICAgICAgIGxhYmVsID0gdmFyaWFibGVzQ29uZi5sYWJlbHNbaW5kZXhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBsb3QubGFiZWxzLnB1c2gobGFiZWwpO1xyXG4gICAgICAgICAgICBwbG90LmxhYmVsQnlWYXJpYWJsZVt2YXJpYWJsZUtleV0gPSBsYWJlbDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcGxvdC5zdWJwbG90cyA9IFtdO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cFgoKSB7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB4ID0gcGxvdC54O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcblxyXG4gICAgICAgIHgudmFsdWUgPSBjb25mLnZhcmlhYmxlcy52YWx1ZTtcclxuICAgICAgICB4LnNjYWxlID0gZDMuc2NhbGVbY29uZi54LnNjYWxlXSgpLnJhbmdlKFtjb25mLnBhZGRpbmcgLyAyLCBwbG90LnNpemUgLSBjb25mLnBhZGRpbmcgLyAyXSk7XHJcbiAgICAgICAgeC5tYXAgPSAoZCwgdmFyaWFibGUpID0+IHguc2NhbGUoeC52YWx1ZShkLCB2YXJpYWJsZSkpO1xyXG4gICAgICAgIHguYXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeC5zY2FsZSkub3JpZW50KGNvbmYueC5vcmllbnQpLnRpY2tzKHBsb3QudGlja3MpO1xyXG4gICAgICAgIHguYXhpcy50aWNrU2l6ZShwbG90LnNpemUgKiBwbG90LnZhcmlhYmxlcy5sZW5ndGgpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBZKCkge1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeSA9IHBsb3QueTtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB5LnZhbHVlID0gY29uZi52YXJpYWJsZXMudmFsdWU7XHJcbiAgICAgICAgeS5zY2FsZSA9IGQzLnNjYWxlW2NvbmYueS5zY2FsZV0oKS5yYW5nZShbIHBsb3Quc2l6ZSAtIGNvbmYucGFkZGluZyAvIDIsIGNvbmYucGFkZGluZyAvIDJdKTtcclxuICAgICAgICB5Lm1hcCA9IChkLCB2YXJpYWJsZSkgPT4geS5zY2FsZSh5LnZhbHVlKGQsIHZhcmlhYmxlKSk7XHJcbiAgICAgICAgeS5heGlzPSBkMy5zdmcuYXhpcygpLnNjYWxlKHkuc2NhbGUpLm9yaWVudChjb25mLnkub3JpZW50KS50aWNrcyhwbG90LnRpY2tzKTtcclxuICAgICAgICB5LmF4aXMudGlja1NpemUoLXBsb3Quc2l6ZSAqIHBsb3QudmFyaWFibGVzLmxlbmd0aCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHVwZGF0ZSggbmV3RGF0YSkge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPXRoaXM7XHJcbiAgICAgICAgdmFyIG4gPSBzZWxmLnBsb3QudmFyaWFibGVzLmxlbmd0aDtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB2YXIgYXhpc0NsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImF4aXNcIik7XHJcbiAgICAgICAgdmFyIGF4aXNYQ2xhc3MgPSBheGlzQ2xhc3MrXCIteFwiO1xyXG4gICAgICAgIHZhciBheGlzWUNsYXNzID0gYXhpc0NsYXNzK1wiLXlcIjtcclxuXHJcbiAgICAgICAgdmFyIHhBeGlzU2VsZWN0b3IgPSBcImcuXCIrYXhpc1hDbGFzcytcIi5cIitheGlzQ2xhc3M7XHJcbiAgICAgICAgdmFyIHlBeGlzU2VsZWN0b3IgPSBcImcuXCIrYXhpc1lDbGFzcytcIi5cIitheGlzQ2xhc3M7XHJcblxyXG4gICAgICAgIHZhciBub0d1aWRlc0NsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcIm5vLWd1aWRlc1wiKTtcclxuICAgICAgICB2YXIgeEF4aXMgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKHhBeGlzU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5kYXRhKHNlbGYucGxvdC52YXJpYWJsZXMpO1xyXG5cclxuICAgICAgICB4QXhpcy5lbnRlcigpLmFwcGVuZFNlbGVjdG9yKHhBeGlzU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKG5vR3VpZGVzQ2xhc3MsICFjb25mLmd1aWRlcyk7XHJcblxyXG4gICAgICAgIHhBeGlzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwidHJhbnNsYXRlKFwiICsgKG4gLSBpIC0gMSkgKiBzZWxmLnBsb3Quc2l6ZSArIFwiLDApXCIpXHJcbiAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uKGQpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC54LnNjYWxlLmRvbWFpbihzZWxmLnBsb3QuZG9tYWluQnlWYXJpYWJsZVtkXSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXhpcyA9IGQzLnNlbGVjdCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLnRyYW5zaXRpb25FbmFibGVkKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBheGlzID0gYXhpcy50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBheGlzLmNhbGwoc2VsZi5wbG90LnguYXhpcyk7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgeEF4aXMuZXhpdCgpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICB2YXIgeUF4aXMgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKHlBeGlzU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5kYXRhKHNlbGYucGxvdC52YXJpYWJsZXMpO1xyXG4gICAgICAgIHlBeGlzLmVudGVyKCkuYXBwZW5kU2VsZWN0b3IoeUF4aXNTZWxlY3Rvcik7XHJcbiAgICAgICAgeUF4aXMuY2xhc3NlZChub0d1aWRlc0NsYXNzLCAhY29uZi5ndWlkZXMpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInRyYW5zbGF0ZSgwLFwiICsgaSAqIHNlbGYucGxvdC5zaXplICsgXCIpXCIpO1xyXG4gICAgICAgIHlBeGlzLmVhY2goZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICBzZWxmLnBsb3QueS5zY2FsZS5kb21haW4oc2VsZi5wbG90LmRvbWFpbkJ5VmFyaWFibGVbZF0pO1xyXG4gICAgICAgICAgICB2YXIgYXhpcyA9IGQzLnNlbGVjdCh0aGlzKTtcclxuICAgICAgICAgICAgaWYgKHNlbGYudHJhbnNpdGlvbkVuYWJsZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgYXhpcyA9IGF4aXMudHJhbnNpdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGF4aXMuY2FsbChzZWxmLnBsb3QueS5heGlzKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHlBeGlzLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxDbGFzcyA9ICBzZWxmLnByZWZpeENsYXNzKFwiY2VsbFwiKTtcclxuICAgICAgICB2YXIgY2VsbCA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCIuXCIrY2VsbENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShzZWxmLnV0aWxzLmNyb3NzKHNlbGYucGxvdC52YXJpYWJsZXMsIHNlbGYucGxvdC52YXJpYWJsZXMpKTtcclxuXHJcbiAgICAgICAgY2VsbC5lbnRlcigpLmFwcGVuZFNlbGVjdG9yKFwiZy5cIitjZWxsQ2xhc3MpLmZpbHRlcihkID0+IGQuaSA9PT0gZC5qKVxyXG4gICAgICAgICAgICAuYXBwZW5kKFwidGV4dFwiKTtcclxuXHJcbiAgICAgICAgY2VsbC5hdHRyKFwidHJhbnNmb3JtXCIsIGQgPT4gXCJ0cmFuc2xhdGUoXCIgKyAobiAtIGQuaSAtIDEpICogc2VsZi5wbG90LnNpemUgKyBcIixcIiArIGQuaiAqIHNlbGYucGxvdC5zaXplICsgXCIpXCIpO1xyXG5cclxuICAgICAgICBpZihjb25mLmJydXNoKXtcclxuICAgICAgICAgICAgdGhpcy5kcmF3QnJ1c2goY2VsbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjZWxsLmVhY2gocGxvdFN1YnBsb3QpO1xyXG5cclxuICAgICAgICAvL0xhYmVsc1xyXG4gICAgICAgIGNlbGwuc2VsZWN0KFwidGV4dFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgY29uZi5wYWRkaW5nKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgY29uZi5wYWRkaW5nKVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiLjcxZW1cIilcclxuICAgICAgICAgICAgLnRleHQoIGQgPT4gc2VsZi5wbG90LmxhYmVsQnlWYXJpYWJsZVtkLnhdKTtcclxuXHJcbiAgICAgICAgY2VsbC5leGl0KCkucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBsb3RTdWJwbG90KHApIHtcclxuICAgICAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgICAgIHBsb3Quc3VicGxvdHMucHVzaChwKTtcclxuICAgICAgICAgICAgdmFyIGNlbGwgPSBkMy5zZWxlY3QodGhpcyk7XHJcblxyXG4gICAgICAgICAgICBwbG90Lnguc2NhbGUuZG9tYWluKHBsb3QuZG9tYWluQnlWYXJpYWJsZVtwLnhdKTtcclxuICAgICAgICAgICAgcGxvdC55LnNjYWxlLmRvbWFpbihwbG90LmRvbWFpbkJ5VmFyaWFibGVbcC55XSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZnJhbWVDbGFzcyA9ICBzZWxmLnByZWZpeENsYXNzKFwiZnJhbWVcIik7XHJcbiAgICAgICAgICAgIGNlbGwuc2VsZWN0T3JBcHBlbmQoXCJyZWN0LlwiK2ZyYW1lQ2xhc3MpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGZyYW1lQ2xhc3MpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInhcIiwgY29uZi5wYWRkaW5nIC8gMilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieVwiLCBjb25mLnBhZGRpbmcgLyAyKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBwbG90LnNpemUgLSBjb25mLnBhZGRpbmcpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBwbG90LnNpemUgLSBjb25mLnBhZGRpbmcpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcC51cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc3VicGxvdCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGF5ZXJDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoJ2xheWVyJyk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBsYXllciA9IGNlbGwuc2VsZWN0QWxsKFwiZy5cIitsYXllckNsYXNzKS5kYXRhKHNlbGYucGxvdC5ncm91cGVkRGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGF5ZXIuZW50ZXIoKS5hcHBlbmRTZWxlY3RvcihcImcuXCIrbGF5ZXJDbGFzcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGRvdHMgPSBsYXllci5zZWxlY3RBbGwoXCJjaXJjbGVcIilcclxuICAgICAgICAgICAgICAgICAgICAuZGF0YShkPT5kLnZhbHVlcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgZG90cy5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZG90c1QgPSBkb3RzO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYudHJhbnNpdGlvbkVuYWJsZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvdHNUID0gZG90cy50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZG90c1QuYXR0cihcImN4XCIsIChkKSA9PiBwbG90LngubWFwKGQsIHN1YnBsb3QueCkpXHJcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCAoZCkgPT4gcGxvdC55Lm1hcChkLCBzdWJwbG90LnkpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiclwiLCBzZWxmLmNvbmZpZy5kb3RSYWRpdXMpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocGxvdC5zZXJpZXNDb2xvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGxheWVyLnN0eWxlKFwiZmlsbFwiLCBwbG90LnNlcmllc0NvbG9yKVxyXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYocGxvdC5jb2xvcil7XHJcbiAgICAgICAgICAgICAgICAgICAgZG90cy5zdHlsZShcImZpbGxcIiwgcGxvdC5jb2xvcilcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgaWYocGxvdC50b29sdGlwKXtcclxuICAgICAgICAgICAgICAgICAgICBkb3RzLm9uKFwibW91c2VvdmVyXCIsIChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIC45KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGh0bWwgPSBcIihcIiArIHBsb3QueC52YWx1ZShkLCBzdWJwbG90LngpICsgXCIsIFwiICtwbG90LnkudmFsdWUoZCwgc3VicGxvdC55KSArIFwiKVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAuaHRtbChodG1sKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZDMuZXZlbnQucGFnZVggKyA1KSArIFwicHhcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdyb3VwID0gc2VsZi5jb25maWcuZ3JvdXBzID8gIHNlbGYuY29uZmlnLmdyb3Vwcy52YWx1ZS5jYWxsKHNlbGYuY29uZmlnLGQpIDogbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZ3JvdXAgfHwgZ3JvdXA9PT0wICl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cCA9IHBsb3QuZ3JvdXBUb0xhYmVsW2dyb3VwXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwrPVwiPGJyLz5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYWJlbCA9IHNlbGYuY29uZmlnLmdyb3Vwcy5sYWJlbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGxhYmVsKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sKz1sYWJlbCtcIjogXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sKz1ncm91cFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC5odG1sKGh0bWwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkMy5ldmVudC5wYWdlWSAtIDI4KSArIFwicHhcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgKGQpPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZG90cy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICBsYXllci5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHAudXBkYXRlKCk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZHJhd0JydXNoKGNlbGwpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGJydXNoID0gZDMuc3ZnLmJydXNoKClcclxuICAgICAgICAgICAgLngoc2VsZi5wbG90Lnguc2NhbGUpXHJcbiAgICAgICAgICAgIC55KHNlbGYucGxvdC55LnNjYWxlKVxyXG4gICAgICAgICAgICAub24oXCJicnVzaHN0YXJ0XCIsIGJydXNoc3RhcnQpXHJcbiAgICAgICAgICAgIC5vbihcImJydXNoXCIsIGJydXNobW92ZSlcclxuICAgICAgICAgICAgLm9uKFwiYnJ1c2hlbmRcIiwgYnJ1c2hlbmQpO1xyXG5cclxuICAgICAgICBzZWxmLnBsb3QuYnJ1c2ggPSBicnVzaDtcclxuXHJcbiAgICAgICAgY2VsbC5zZWxlY3RPckFwcGVuZChcImcuYnJ1c2gtY29udGFpbmVyXCIpLmNhbGwoYnJ1c2gpO1xyXG4gICAgICAgIHNlbGYuY2xlYXJCcnVzaCgpO1xyXG5cclxuICAgICAgICAvLyBDbGVhciB0aGUgcHJldmlvdXNseS1hY3RpdmUgYnJ1c2gsIGlmIGFueS5cclxuICAgICAgICBmdW5jdGlvbiBicnVzaHN0YXJ0KHApIHtcclxuICAgICAgICAgICAgaWYgKHNlbGYucGxvdC5icnVzaENlbGwgIT09IHRoaXMpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuY2xlYXJCcnVzaCgpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wbG90Lnguc2NhbGUuZG9tYWluKHNlbGYucGxvdC5kb21haW5CeVZhcmlhYmxlW3AueF0pO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wbG90Lnkuc2NhbGUuZG9tYWluKHNlbGYucGxvdC5kb21haW5CeVZhcmlhYmxlW3AueV0pO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wbG90LmJydXNoQ2VsbCA9IHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEhpZ2hsaWdodCB0aGUgc2VsZWN0ZWQgY2lyY2xlcy5cclxuICAgICAgICBmdW5jdGlvbiBicnVzaG1vdmUocCkge1xyXG4gICAgICAgICAgICB2YXIgZSA9IGJydXNoLmV4dGVudCgpO1xyXG4gICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwiY2lyY2xlXCIpLmNsYXNzZWQoXCJoaWRkZW5cIiwgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlWzBdWzBdID4gZFtwLnhdIHx8IGRbcC54XSA+IGVbMV1bMF1cclxuICAgICAgICAgICAgICAgICAgICB8fCBlWzBdWzFdID4gZFtwLnldIHx8IGRbcC55XSA+IGVbMV1bMV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBJZiB0aGUgYnJ1c2ggaXMgZW1wdHksIHNlbGVjdCBhbGwgY2lyY2xlcy5cclxuICAgICAgICBmdW5jdGlvbiBicnVzaGVuZCgpIHtcclxuICAgICAgICAgICAgaWYgKGJydXNoLmVtcHR5KCkpIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCIuaGlkZGVuXCIpLmNsYXNzZWQoXCJoaWRkZW5cIiwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY2xlYXJCcnVzaCgpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBpZighc2VsZi5wbG90LmJydXNoQ2VsbCl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZDMuc2VsZWN0KHNlbGYucGxvdC5icnVzaENlbGwpLmNhbGwoc2VsZi5wbG90LmJydXNoLmNsZWFyKCkpO1xyXG4gICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCIuaGlkZGVuXCIpLmNsYXNzZWQoXCJoaWRkZW5cIiwgZmFsc2UpO1xyXG4gICAgICAgIHNlbGYucGxvdC5icnVzaENlbGw9bnVsbDtcclxuICAgIH1cclxufSIsImltcG9ydCB7Q2hhcnRXaXRoQ29sb3JHcm91cHMsIENoYXJ0V2l0aENvbG9yR3JvdXBzQ29uZmlnfSBmcm9tIFwiLi9jaGFydC13aXRoLWNvbG9yLWdyb3Vwc1wiO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5pbXBvcnQge0xlZ2VuZH0gZnJvbSBcIi4vbGVnZW5kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2NhdHRlclBsb3RDb25maWcgZXh0ZW5kcyBDaGFydFdpdGhDb2xvckdyb3Vwc0NvbmZpZ3tcclxuXHJcbiAgICBzdmdDbGFzcz0gdGhpcy5jc3NDbGFzc1ByZWZpeCsnc2NhdHRlcnBsb3QnO1xyXG4gICAgZ3VpZGVzPSBmYWxzZTsgLy9zaG93IGF4aXMgZ3VpZGVzXHJcbiAgICBzaG93VG9vbHRpcD0gdHJ1ZTsgLy9zaG93IHRvb2x0aXAgb24gZG90IGhvdmVyXHJcblxyXG4gICAgeD17Ly8gWCBheGlzIGNvbmZpZ1xyXG4gICAgICAgIGxhYmVsOiAnJywgLy8gYXhpcyBsYWJlbFxyXG4gICAgICAgIGtleTogMCxcclxuICAgICAgICB2YWx1ZTogKGQsIGtleSkgPT4gZFtrZXldLCAvLyB4IHZhbHVlIGFjY2Vzc29yXHJcbiAgICAgICAgb3JpZW50OiBcImJvdHRvbVwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiLFxyXG4gICAgICAgIGRvbWFpbk1hcmdpbjogMC4wNVxyXG4gICAgfTtcclxuICAgIHk9ey8vIFkgYXhpcyBjb25maWdcclxuICAgICAgICBsYWJlbDogJycsIC8vIGF4aXMgbGFiZWwsXHJcbiAgICAgICAga2V5OiAxLFxyXG4gICAgICAgIHZhbHVlOiAoZCwga2V5KSA9PiBkW2tleV0sIC8vIHkgdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICBvcmllbnQ6IFwibGVmdFwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiLFxyXG4gICAgICAgIGRvbWFpbk1hcmdpbjogMC4wNVxyXG4gICAgfTtcclxuICAgIGdyb3Vwcz17XHJcbiAgICAgICAga2V5OiAyXHJcbiAgICB9O1xyXG4gICAgZG90UmFkaXVzID0gMjtcclxuICAgIHRyYW5zaXRpb249IHRydWU7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKXtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIGlmKGN1c3RvbSl7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2NhdHRlclBsb3QgZXh0ZW5kcyBDaGFydFdpdGhDb2xvckdyb3Vwc3tcclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIG5ldyBTY2F0dGVyUGxvdENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKXtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBTY2F0dGVyUGxvdENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpe1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcbiAgICAgICAgdmFyIHNlbGY9dGhpcztcclxuXHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgdGhpcy5wbG90Lng9e307XHJcbiAgICAgICAgdGhpcy5wbG90Lnk9e307XHJcblxyXG4gICAgICAgIHRoaXMuY29tcHV0ZVBsb3RTaXplKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFgoKTtcclxuICAgICAgICB0aGlzLnNldHVwWSgpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cFgoKXtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHggPSBwbG90Lng7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZy54O1xyXG5cclxuICAgICAgICAvKiAqXHJcbiAgICAgICAgICogdmFsdWUgYWNjZXNzb3IgLSByZXR1cm5zIHRoZSB2YWx1ZSB0byBlbmNvZGUgZm9yIGEgZ2l2ZW4gZGF0YSBvYmplY3QuXHJcbiAgICAgICAgICogc2NhbGUgLSBtYXBzIHZhbHVlIHRvIGEgdmlzdWFsIGRpc3BsYXkgZW5jb2RpbmcsIHN1Y2ggYXMgYSBwaXhlbCBwb3NpdGlvbi5cclxuICAgICAgICAgKiBtYXAgZnVuY3Rpb24gLSBtYXBzIGZyb20gZGF0YSB2YWx1ZSB0byBkaXNwbGF5IHZhbHVlXHJcbiAgICAgICAgICogYXhpcyAtIHNldHMgdXAgYXhpc1xyXG4gICAgICAgICAqKi9cclxuICAgICAgICB4LnZhbHVlID0gZCA9PiBjb25mLnZhbHVlKGQsIGNvbmYua2V5KTtcclxuICAgICAgICB4LnNjYWxlID0gZDMuc2NhbGVbY29uZi5zY2FsZV0oKS5yYW5nZShbMCwgcGxvdC53aWR0aF0pO1xyXG4gICAgICAgIHgubWFwID0gZCA9PiB4LnNjYWxlKHgudmFsdWUoZCkpO1xyXG4gICAgICAgIHguYXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeC5zY2FsZSkub3JpZW50KGNvbmYub3JpZW50KTtcclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMucGxvdC5ncm91cGVkRGF0YTtcclxuXHJcblxyXG4gICAgICAgIHZhciBkb21haW4gPSBbcGFyc2VGbG9hdChkMy5taW4oZGF0YSwgcz0+ZDMubWluKHMudmFsdWVzLCBwbG90LngudmFsdWUpKSksIHBhcnNlRmxvYXQoZDMubWF4KGRhdGEsIHM9PmQzLm1heChzLnZhbHVlcywgcGxvdC54LnZhbHVlKSkpXTtcclxuICAgICAgICB2YXIgbWFyZ2luID0gKGRvbWFpblsxXS1kb21haW5bMF0pKiBjb25mLmRvbWFpbk1hcmdpbjtcclxuICAgICAgICBkb21haW5bMF0tPW1hcmdpbjtcclxuICAgICAgICBkb21haW5bMV0rPW1hcmdpbjtcclxuICAgICAgICBwbG90Lnguc2NhbGUuZG9tYWluKGRvbWFpbik7XHJcbiAgICAgICAgaWYodGhpcy5jb25maWcuZ3VpZGVzKSB7XHJcbiAgICAgICAgICAgIHguYXhpcy50aWNrU2l6ZSgtcGxvdC5oZWlnaHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwWSAoKXtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHkgPSBwbG90Lnk7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZy55O1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHZhbHVlIGFjY2Vzc29yIC0gcmV0dXJucyB0aGUgdmFsdWUgdG8gZW5jb2RlIGZvciBhIGdpdmVuIGRhdGEgb2JqZWN0LlxyXG4gICAgICAgICAqIHNjYWxlIC0gbWFwcyB2YWx1ZSB0byBhIHZpc3VhbCBkaXNwbGF5IGVuY29kaW5nLCBzdWNoIGFzIGEgcGl4ZWwgcG9zaXRpb24uXHJcbiAgICAgICAgICogbWFwIGZ1bmN0aW9uIC0gbWFwcyBmcm9tIGRhdGEgdmFsdWUgdG8gZGlzcGxheSB2YWx1ZVxyXG4gICAgICAgICAqIGF4aXMgLSBzZXRzIHVwIGF4aXNcclxuICAgICAgICAgKi9cclxuICAgICAgICB5LnZhbHVlID0gZCA9PiBjb25mLnZhbHVlKGQsIGNvbmYua2V5KTtcclxuICAgICAgICB5LnNjYWxlID0gZDMuc2NhbGVbY29uZi5zY2FsZV0oKS5yYW5nZShbcGxvdC5oZWlnaHQsIDBdKTtcclxuICAgICAgICB5Lm1hcCA9IGQgPT4geS5zY2FsZSh5LnZhbHVlKGQpKTtcclxuICAgICAgICB5LmF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHkuc2NhbGUpLm9yaWVudChjb25mLm9yaWVudCk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuY29uZmlnLmd1aWRlcyl7XHJcbiAgICAgICAgICAgIHkuYXhpcy50aWNrU2l6ZSgtcGxvdC53aWR0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLnBsb3QuZ3JvdXBlZERhdGE7XHJcblxyXG4gICAgICAgIHZhciBkb21haW4gPSBbcGFyc2VGbG9hdChkMy5taW4oZGF0YSwgcz0+ZDMubWluKHMudmFsdWVzLCBwbG90LnkudmFsdWUpKSksIHBhcnNlRmxvYXQoZDMubWF4KGRhdGEsIHM9PmQzLm1heChzLnZhbHVlcywgcGxvdC55LnZhbHVlKSkpXTtcclxuICAgICAgICB2YXIgbWFyZ2luID0gKGRvbWFpblsxXS1kb21haW5bMF0pKiBjb25mLmRvbWFpbk1hcmdpbjtcclxuICAgICAgICBkb21haW5bMF0tPW1hcmdpbjtcclxuICAgICAgICBkb21haW5bMV0rPW1hcmdpbjtcclxuICAgICAgICBwbG90Lnkuc2NhbGUuZG9tYWluKGRvbWFpbik7XHJcbiAgICAgICAgLy8gcGxvdC55LnNjYWxlLmRvbWFpbihbZDMubWluKGRhdGEsIHBsb3QueS52YWx1ZSktMSwgZDMubWF4KGRhdGEsIHBsb3QueS52YWx1ZSkrMV0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBkcmF3QXhpc1goKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGF4aXNDb25mID0gdGhpcy5jb25maWcueDtcclxuICAgICAgICB2YXIgYXhpcyA9IHNlbGYuc3ZnRy5zZWxlY3RPckFwcGVuZChcImcuXCIrc2VsZi5wcmVmaXhDbGFzcygnYXhpcy14JykrXCIuXCIrc2VsZi5wcmVmaXhDbGFzcygnYXhpcycpKyhzZWxmLmNvbmZpZy5ndWlkZXMgPyAnJyA6ICcuJytzZWxmLnByZWZpeENsYXNzKCduby1ndWlkZXMnKSkpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyBwbG90LmhlaWdodCArIFwiKVwiKTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgYXhpc1QgPSBheGlzO1xyXG4gICAgICAgIGlmIChzZWxmLnRyYW5zaXRpb25FbmFibGVkKCkpIHtcclxuICAgICAgICAgICAgYXhpc1QgPSBheGlzLnRyYW5zaXRpb24oKS5lYXNlKFwic2luLWluLW91dFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGF4aXNULmNhbGwocGxvdC54LmF4aXMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGF4aXMuc2VsZWN0T3JBcHBlbmQoXCJ0ZXh0LlwiK3NlbGYucHJlZml4Q2xhc3MoJ2xhYmVsJykpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyAocGxvdC53aWR0aC8yKSArXCIsXCIrIChwbG90Lm1hcmdpbi5ib3R0b20pICtcIilcIikgIC8vIHRleHQgaXMgZHJhd24gb2ZmIHRoZSBzY3JlZW4gdG9wIGxlZnQsIG1vdmUgZG93biBhbmQgb3V0IGFuZCByb3RhdGVcclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCBcIi0xZW1cIilcclxuICAgICAgICAgICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoYXhpc0NvbmYubGFiZWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICBkcmF3QXhpc1koKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGF4aXNDb25mID0gdGhpcy5jb25maWcueTtcclxuICAgICAgICB2YXIgYXhpcyA9IHNlbGYuc3ZnRy5zZWxlY3RPckFwcGVuZChcImcuXCIrc2VsZi5wcmVmaXhDbGFzcygnYXhpcy15JykrXCIuXCIrc2VsZi5wcmVmaXhDbGFzcygnYXhpcycpKyhzZWxmLmNvbmZpZy5ndWlkZXMgPyAnJyA6ICcuJytzZWxmLnByZWZpeENsYXNzKCduby1ndWlkZXMnKSkpO1xyXG5cclxuICAgICAgICB2YXIgYXhpc1QgPSBheGlzO1xyXG4gICAgICAgIGlmIChzZWxmLnRyYW5zaXRpb25FbmFibGVkKCkpIHtcclxuICAgICAgICAgICAgYXhpc1QgPSBheGlzLnRyYW5zaXRpb24oKS5lYXNlKFwic2luLWluLW91dFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGF4aXNULmNhbGwocGxvdC55LmF4aXMpO1xyXG5cclxuICAgICAgICBheGlzLnNlbGVjdE9yQXBwZW5kKFwidGV4dC5cIitzZWxmLnByZWZpeENsYXNzKCdsYWJlbCcpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisgLXBsb3QubWFyZ2luLmxlZnQgK1wiLFwiKyhwbG90LmhlaWdodC8yKStcIilyb3RhdGUoLTkwKVwiKSAgLy8gdGV4dCBpcyBkcmF3biBvZmYgdGhlIHNjcmVlbiB0b3AgbGVmdCwgbW92ZSBkb3duIGFuZCBvdXQgYW5kIHJvdGF0ZVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGF4aXNDb25mLmxhYmVsKTtcclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlKG5ld0RhdGEpe1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuICAgICAgICB0aGlzLmRyYXdBeGlzWCgpO1xyXG4gICAgICAgIHRoaXMuZHJhd0F4aXNZKCk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlRG90cygpO1xyXG4gICAgfTtcclxuXHJcbiAgICB1cGRhdGVEb3RzKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgZGF0YSA9IHBsb3QuZGF0YTtcclxuICAgICAgICB2YXIgbGF5ZXJDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoJ2xheWVyJyk7XHJcbiAgICAgICAgdmFyIGRvdENsYXNzID0gc2VsZi5wcmVmaXhDbGFzcygnZG90Jyk7XHJcbiAgICAgICAgc2VsZi5kb3RzQ29udGFpbmVyQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKCdkb3RzLWNvbnRhaW5lcicpO1xyXG5cclxuICAgICAgICB2YXIgZG90c0NvbnRhaW5lciA9IHNlbGYuc3ZnRy5zZWxlY3RPckFwcGVuZChcImcuXCIgKyBzZWxmLmRvdHNDb250YWluZXJDbGFzcyk7XHJcblxyXG4gICAgICAgIHZhciBsYXllciA9IGRvdHNDb250YWluZXIuc2VsZWN0QWxsKFwiZy5cIitsYXllckNsYXNzKS5kYXRhKHBsb3QuZ3JvdXBlZERhdGEpO1xyXG5cclxuICAgICAgICBsYXllci5lbnRlcigpLmFwcGVuZFNlbGVjdG9yKFwiZy5cIitsYXllckNsYXNzKTtcclxuXHJcbiAgICAgICAgdmFyIGRvdHMgPSBsYXllci5zZWxlY3RBbGwoJy4nICsgZG90Q2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKGQ9PmQudmFsdWVzKTtcclxuXHJcbiAgICAgICAgZG90cy5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGRvdENsYXNzKTtcclxuXHJcbiAgICAgICAgdmFyIGRvdHNUID0gZG90cztcclxuICAgICAgICBpZiAoc2VsZi50cmFuc2l0aW9uRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgICAgIGRvdHNUID0gZG90cy50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkb3RzVC5hdHRyKFwiclwiLCBzZWxmLmNvbmZpZy5kb3RSYWRpdXMpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY3hcIiwgcGxvdC54Lm1hcClcclxuICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCBwbG90LnkubWFwKTtcclxuXHJcbiAgICAgICAgaWYgKHBsb3QudG9vbHRpcCkge1xyXG4gICAgICAgICAgICBkb3RzLm9uKFwibW91c2VvdmVyXCIsIGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAuOSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IFwiKFwiICsgcGxvdC54LnZhbHVlKGQpICsgXCIsIFwiICsgcGxvdC55LnZhbHVlKGQpICsgXCIpXCI7XHJcbiAgICAgICAgICAgICAgICB2YXIgZ3JvdXAgPSBzZWxmLmNvbmZpZy5ncm91cHMgPyAgc2VsZi5jb25maWcuZ3JvdXBzLnZhbHVlLmNhbGwoc2VsZi5jb25maWcsZCkgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwIHx8IGdyb3VwID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAgPSBwbG90Lmdyb3VwVG9MYWJlbFtncm91cF07XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBcIjxici8+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhYmVsID0gc2VsZi5jb25maWcuZ3JvdXBzLmxhYmVsO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYWJlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sICs9IGxhYmVsICsgXCI6IFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBodG1sICs9IGdyb3VwXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAuaHRtbChodG1sKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkMy5ldmVudC5wYWdlWSAtIDI4KSArIFwicHhcIik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCBkID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwbG90LnNlcmllc0NvbG9yKSB7XHJcbiAgICAgICAgICAgIGxheWVyLnN0eWxlKFwiZmlsbFwiLCBwbG90LnNlcmllc0NvbG9yKVxyXG4gICAgICAgIH1lbHNlIGlmKHBsb3QuY29sb3Ipe1xyXG4gICAgICAgICAgICBkb3RzLnN0eWxlKFwiZmlsbFwiLCBwbG90LmNvbG9yKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG90cy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICAgICAgbGF5ZXIuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG59XHJcbiIsIi8qXG4gKiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9iZW5yYXNtdXNlbi8xMjYxOTc3XG4gKiBOQU1FXG4gKiBcbiAqIHN0YXRpc3RpY3MtZGlzdHJpYnV0aW9ucy5qcyAtIEphdmFTY3JpcHQgbGlicmFyeSBmb3IgY2FsY3VsYXRpbmdcbiAqICAgY3JpdGljYWwgdmFsdWVzIGFuZCB1cHBlciBwcm9iYWJpbGl0aWVzIG9mIGNvbW1vbiBzdGF0aXN0aWNhbFxuICogICBkaXN0cmlidXRpb25zXG4gKiBcbiAqIFNZTk9QU0lTXG4gKiBcbiAqIFxuICogICAvLyBDaGktc3F1YXJlZC1jcml0ICgyIGRlZ3JlZXMgb2YgZnJlZWRvbSwgOTV0aCBwZXJjZW50aWxlID0gMC4wNSBsZXZlbFxuICogICBjaGlzcXJkaXN0cigyLCAuMDUpXG4gKiAgIFxuICogICAvLyB1LWNyaXQgKDk1dGggcGVyY2VudGlsZSA9IDAuMDUgbGV2ZWwpXG4gKiAgIHVkaXN0ciguMDUpO1xuICogICBcbiAqICAgLy8gdC1jcml0ICgxIGRlZ3JlZSBvZiBmcmVlZG9tLCA5OS41dGggcGVyY2VudGlsZSA9IDAuMDA1IGxldmVsKSBcbiAqICAgdGRpc3RyKDEsLjAwNSk7XG4gKiAgIFxuICogICAvLyBGLWNyaXQgKDEgZGVncmVlIG9mIGZyZWVkb20gaW4gbnVtZXJhdG9yLCAzIGRlZ3JlZXMgb2YgZnJlZWRvbSBcbiAqICAgLy8gICAgICAgICBpbiBkZW5vbWluYXRvciwgOTl0aCBwZXJjZW50aWxlID0gMC4wMSBsZXZlbClcbiAqICAgZmRpc3RyKDEsMywuMDEpO1xuICogICBcbiAqICAgLy8gdXBwZXIgcHJvYmFiaWxpdHkgb2YgdGhlIHUgZGlzdHJpYnV0aW9uICh1ID0gLTAuODUpOiBRKHUpID0gMS1HKHUpXG4gKiAgIHVwcm9iKC0wLjg1KTtcbiAqICAgXG4gKiAgIC8vIHVwcGVyIHByb2JhYmlsaXR5IG9mIHRoZSBjaGktc3F1YXJlIGRpc3RyaWJ1dGlvblxuICogICAvLyAoMyBkZWdyZWVzIG9mIGZyZWVkb20sIGNoaS1zcXVhcmVkID0gNi4yNSk6IFEgPSAxLUdcbiAqICAgY2hpc3FycHJvYigzLDYuMjUpO1xuICogICBcbiAqICAgLy8gdXBwZXIgcHJvYmFiaWxpdHkgb2YgdGhlIHQgZGlzdHJpYnV0aW9uXG4gKiAgIC8vICgzIGRlZ3JlZXMgb2YgZnJlZWRvbSwgdCA9IDYuMjUxKTogUSA9IDEtR1xuICogICB0cHJvYigzLDYuMjUxKTtcbiAqICAgXG4gKiAgIC8vIHVwcGVyIHByb2JhYmlsaXR5IG9mIHRoZSBGIGRpc3RyaWJ1dGlvblxuICogICAvLyAoMyBkZWdyZWVzIG9mIGZyZWVkb20gaW4gbnVtZXJhdG9yLCA1IGRlZ3JlZXMgb2YgZnJlZWRvbSBpblxuICogICAvLyAgZGVub21pbmF0b3IsIEYgPSA2LjI1KTogUSA9IDEtR1xuICogICBmcHJvYigzLDUsLjYyNSk7XG4gKiBcbiAqIFxuICogIERFU0NSSVBUSU9OXG4gKiBcbiAqIFRoaXMgbGlicmFyeSBjYWxjdWxhdGVzIHBlcmNlbnRhZ2UgcG9pbnRzICg1IHNpZ25pZmljYW50IGRpZ2l0cykgb2YgdGhlIHVcbiAqIChzdGFuZGFyZCBub3JtYWwpIGRpc3RyaWJ1dGlvbiwgdGhlIHN0dWRlbnQncyB0IGRpc3RyaWJ1dGlvbiwgdGhlXG4gKiBjaGktc3F1YXJlIGRpc3RyaWJ1dGlvbiBhbmQgdGhlIEYgZGlzdHJpYnV0aW9uLiBJdCBjYW4gYWxzbyBjYWxjdWxhdGUgdGhlXG4gKiB1cHBlciBwcm9iYWJpbGl0eSAoNSBzaWduaWZpY2FudCBkaWdpdHMpIG9mIHRoZSB1IChzdGFuZGFyZCBub3JtYWwpLCB0aGVcbiAqIGNoaS1zcXVhcmUsIHRoZSB0IGFuZCB0aGUgRiBkaXN0cmlidXRpb24uXG4gKiBcbiAqIFRoZXNlIGNyaXRpY2FsIHZhbHVlcyBhcmUgbmVlZGVkIHRvIHBlcmZvcm0gc3RhdGlzdGljYWwgdGVzdHMsIGxpa2UgdGhlIHVcbiAqIHRlc3QsIHRoZSB0IHRlc3QsIHRoZSBGIHRlc3QgYW5kIHRoZSBjaGktc3F1YXJlZCB0ZXN0LCBhbmQgdG8gY2FsY3VsYXRlXG4gKiBjb25maWRlbmNlIGludGVydmFscy5cbiAqIFxuICogSWYgeW91IGFyZSBpbnRlcmVzdGVkIGluIG1vcmUgcHJlY2lzZSBhbGdvcml0aG1zIHlvdSBjb3VsZCBsb29rIGF0OlxuICogICBTdGF0TGliOiBodHRwOi8vbGliLnN0YXQuY211LmVkdS9hcHN0YXQvIDsgXG4gKiAgIEFwcGxpZWQgU3RhdGlzdGljcyBBbGdvcml0aG1zIGJ5IEdyaWZmaXRocywgUC4gYW5kIEhpbGwsIEkuRC5cbiAqICAgLCBFbGxpcyBIb3J3b29kOiBDaGljaGVzdGVyICgxOTg1KVxuICogXG4gKiBCVUdTIFxuICogXG4gKiBUaGlzIHBvcnQgd2FzIHByb2R1Y2VkIGZyb20gdGhlIFBlcmwgbW9kdWxlIFN0YXRpc3RpY3M6OkRpc3RyaWJ1dGlvbnNcbiAqIHRoYXQgaGFzIGhhZCBubyBidWcgcmVwb3J0cyBpbiBzZXZlcmFsIHllYXJzLiAgSWYgeW91IGZpbmQgYSBidWcgdGhlblxuICogcGxlYXNlIGRvdWJsZS1jaGVjayB0aGF0IEphdmFTY3JpcHQgZG9lcyBub3QgdGhpbmcgdGhlIG51bWJlcnMgeW91IGFyZVxuICogcGFzc2luZyBpbiBhcmUgc3RyaW5ncy4gIChZb3UgY2FuIHN1YnRyYWN0IDAgZnJvbSB0aGVtIGFzIHlvdSBwYXNzIHRoZW1cbiAqIGluIHNvIHRoYXQgXCI1XCIgaXMgcHJvcGVybHkgdW5kZXJzdG9vZCB0byBiZSA1LikgIElmIHlvdSBoYXZlIHBhc3NlZCBpbiBhXG4gKiBudW1iZXIgdGhlbiBwbGVhc2UgY29udGFjdCB0aGUgYXV0aG9yXG4gKiBcbiAqIEFVVEhPUlxuICogXG4gKiBCZW4gVGlsbHkgPGJ0aWxseUBnbWFpbC5jb20+XG4gKiBcbiAqIE9yaWdpbmwgUGVybCB2ZXJzaW9uIGJ5IE1pY2hhZWwgS29zcGFjaCA8bWlrZS5wZXJsQGdteC5hdD5cbiAqIFxuICogTmljZSBmb3JtYXRpbmcsIHNpbXBsaWZpY2F0aW9uIGFuZCBidWcgcmVwYWlyIGJ5IE1hdHRoaWFzIFRyYXV0bmVyIEtyb21hbm5cbiAqIDxtdGtAaWQuY2JzLmRrPlxuICogXG4gKiBDT1BZUklHSFQgXG4gKiBcbiAqIENvcHlyaWdodCAyMDA4IEJlbiBUaWxseS5cbiAqIFxuICogVGhpcyBsaWJyYXJ5IGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXRcbiAqIHVuZGVyIHRoZSBzYW1lIHRlcm1zIGFzIFBlcmwgaXRzZWxmLiAgVGhpcyBtZWFucyB1bmRlciBlaXRoZXIgdGhlIFBlcmxcbiAqIEFydGlzdGljIExpY2Vuc2Ugb3IgdGhlIEdQTCB2MSBvciBsYXRlci5cbiAqL1xuXG52YXIgU0lHTklGSUNBTlQgPSA1OyAvLyBudW1iZXIgb2Ygc2lnbmlmaWNhbnQgZGlnaXRzIHRvIGJlIHJldHVybmVkXG5cbmZ1bmN0aW9uIGNoaXNxcmRpc3RyICgkbiwgJHApIHtcblx0aWYgKCRuIDw9IDAgfHwgTWF0aC5hYnMoJG4pIC0gTWF0aC5hYnMoaW50ZWdlcigkbikpICE9IDApIHtcblx0XHR0aHJvdyhcIkludmFsaWQgbjogJG5cXG5cIik7IC8qIGRlZ3JlZSBvZiBmcmVlZG9tICovXG5cdH1cblx0aWYgKCRwIDw9IDAgfHwgJHAgPiAxKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIHA6ICRwXFxuXCIpOyBcblx0fVxuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3ViY2hpc3FyKCRuLTAsICRwLTApKTtcbn1cblxuZnVuY3Rpb24gdWRpc3RyICgkcCkge1xuXHRpZiAoJHAgPiAxIHx8ICRwIDw9IDApIHtcblx0XHR0aHJvdyhcIkludmFsaWQgcDogJHBcXG5cIik7XG5cdH1cblx0cmV0dXJuIHByZWNpc2lvbl9zdHJpbmcoX3N1YnUoJHAtMCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGRpc3RyICgkbiwgJHApIHtcblx0aWYgKCRuIDw9IDAgfHwgTWF0aC5hYnMoJG4pIC0gTWF0aC5hYnMoaW50ZWdlcigkbikpICE9IDApIHtcblx0XHR0aHJvdyhcIkludmFsaWQgbjogJG5cXG5cIik7XG5cdH1cblx0aWYgKCRwIDw9IDAgfHwgJHAgPj0gMSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBwOiAkcFxcblwiKTtcblx0fVxuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3VidCgkbi0wLCAkcC0wKSk7XG59XG5cbmZ1bmN0aW9uIGZkaXN0ciAoJG4sICRtLCAkcCkge1xuXHRpZiAoKCRuPD0wKSB8fCAoKE1hdGguYWJzKCRuKS0oTWF0aC5hYnMoaW50ZWdlcigkbikpKSkhPTApKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG46ICRuXFxuXCIpOyAvKiBmaXJzdCBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9XG5cdGlmICgoJG08PTApIHx8ICgoTWF0aC5hYnMoJG0pLShNYXRoLmFicyhpbnRlZ2VyKCRtKSkpKSE9MCkpIHtcblx0XHR0aHJvdyhcIkludmFsaWQgbTogJG1cXG5cIik7IC8qIHNlY29uZCBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9XG5cdGlmICgoJHA8PTApIHx8ICgkcD4xKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBwOiAkcFxcblwiKTtcblx0fVxuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3ViZigkbi0wLCAkbS0wLCAkcC0wKSk7XG59XG5cbmZ1bmN0aW9uIHVwcm9iICgkeCkge1xuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3VidXByb2IoJHgtMCkpO1xufVxuXG5mdW5jdGlvbiBjaGlzcXJwcm9iICgkbiwkeCkge1xuXHRpZiAoKCRuIDw9IDApIHx8ICgoTWF0aC5hYnMoJG4pIC0gKE1hdGguYWJzKGludGVnZXIoJG4pKSkpICE9IDApKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG46ICRuXFxuXCIpOyAvKiBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9XG5cdHJldHVybiBwcmVjaXNpb25fc3RyaW5nKF9zdWJjaGlzcXJwcm9iKCRuLTAsICR4LTApKTtcbn1cblxuZnVuY3Rpb24gdHByb2IgKCRuLCAkeCkge1xuXHRpZiAoKCRuIDw9IDApIHx8ICgoTWF0aC5hYnMoJG4pIC0gTWF0aC5hYnMoaW50ZWdlcigkbikpKSAhPTApKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG46ICRuXFxuXCIpOyAvKiBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9XG5cdHJldHVybiBwcmVjaXNpb25fc3RyaW5nKF9zdWJ0cHJvYigkbi0wLCAkeC0wKSk7XG59XG5cbmZ1bmN0aW9uIGZwcm9iICgkbiwgJG0sICR4KSB7XG5cdGlmICgoJG48PTApIHx8ICgoTWF0aC5hYnMoJG4pLShNYXRoLmFicyhpbnRlZ2VyKCRuKSkpKSE9MCkpIHtcblx0XHR0aHJvdyhcIkludmFsaWQgbjogJG5cXG5cIik7IC8qIGZpcnN0IGRlZ3JlZSBvZiBmcmVlZG9tICovXG5cdH1cblx0aWYgKCgkbTw9MCkgfHwgKChNYXRoLmFicygkbSktKE1hdGguYWJzKGludGVnZXIoJG0pKSkpIT0wKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBtOiAkbVxcblwiKTsgLyogc2Vjb25kIGRlZ3JlZSBvZiBmcmVlZG9tICovXG5cdH0gXG5cdHJldHVybiBwcmVjaXNpb25fc3RyaW5nKF9zdWJmcHJvYigkbi0wLCAkbS0wLCAkeC0wKSk7XG59XG5cblxuZnVuY3Rpb24gX3N1YmZwcm9iICgkbiwgJG0sICR4KSB7XG5cdHZhciAkcDtcblxuXHRpZiAoJHg8PTApIHtcblx0XHQkcD0xO1xuXHR9IGVsc2UgaWYgKCRtICUgMiA9PSAwKSB7XG5cdFx0dmFyICR6ID0gJG0gLyAoJG0gKyAkbiAqICR4KTtcblx0XHR2YXIgJGEgPSAxO1xuXHRcdGZvciAodmFyICRpID0gJG0gLSAyOyAkaSA+PSAyOyAkaSAtPSAyKSB7XG5cdFx0XHQkYSA9IDEgKyAoJG4gKyAkaSAtIDIpIC8gJGkgKiAkeiAqICRhO1xuXHRcdH1cblx0XHQkcCA9IDEgLSBNYXRoLnBvdygoMSAtICR6KSwgKCRuIC8gMikgKiAkYSk7XG5cdH0gZWxzZSBpZiAoJG4gJSAyID09IDApIHtcblx0XHR2YXIgJHogPSAkbiAqICR4IC8gKCRtICsgJG4gKiAkeCk7XG5cdFx0dmFyICRhID0gMTtcblx0XHRmb3IgKHZhciAkaSA9ICRuIC0gMjsgJGkgPj0gMjsgJGkgLT0gMikge1xuXHRcdFx0JGEgPSAxICsgKCRtICsgJGkgLSAyKSAvICRpICogJHogKiAkYTtcblx0XHR9XG5cdFx0JHAgPSBNYXRoLnBvdygoMSAtICR6KSwgKCRtIC8gMikpICogJGE7XG5cdH0gZWxzZSB7XG5cdFx0dmFyICR5ID0gTWF0aC5hdGFuMihNYXRoLnNxcnQoJG4gKiAkeCAvICRtKSwgMSk7XG5cdFx0dmFyICR6ID0gTWF0aC5wb3coTWF0aC5zaW4oJHkpLCAyKTtcblx0XHR2YXIgJGEgPSAoJG4gPT0gMSkgPyAwIDogMTtcblx0XHRmb3IgKHZhciAkaSA9ICRuIC0gMjsgJGkgPj0gMzsgJGkgLT0gMikge1xuXHRcdFx0JGEgPSAxICsgKCRtICsgJGkgLSAyKSAvICRpICogJHogKiAkYTtcblx0XHR9IFxuXHRcdHZhciAkYiA9IE1hdGguUEk7XG5cdFx0Zm9yICh2YXIgJGkgPSAyOyAkaSA8PSAkbSAtIDE7ICRpICs9IDIpIHtcblx0XHRcdCRiICo9ICgkaSAtIDEpIC8gJGk7XG5cdFx0fVxuXHRcdHZhciAkcDEgPSAyIC8gJGIgKiBNYXRoLnNpbigkeSkgKiBNYXRoLnBvdyhNYXRoLmNvcygkeSksICRtKSAqICRhO1xuXG5cdFx0JHogPSBNYXRoLnBvdyhNYXRoLmNvcygkeSksIDIpO1xuXHRcdCRhID0gKCRtID09IDEpID8gMCA6IDE7XG5cdFx0Zm9yICh2YXIgJGkgPSAkbS0yOyAkaSA+PSAzOyAkaSAtPSAyKSB7XG5cdFx0XHQkYSA9IDEgKyAoJGkgLSAxKSAvICRpICogJHogKiAkYTtcblx0XHR9XG5cdFx0JHAgPSBtYXgoMCwgJHAxICsgMSAtIDIgKiAkeSAvIE1hdGguUElcblx0XHRcdC0gMiAvIE1hdGguUEkgKiBNYXRoLnNpbigkeSkgKiBNYXRoLmNvcygkeSkgKiAkYSk7XG5cdH1cblx0cmV0dXJuICRwO1xufVxuXG5cbmZ1bmN0aW9uIF9zdWJjaGlzcXJwcm9iICgkbiwkeCkge1xuXHR2YXIgJHA7XG5cblx0aWYgKCR4IDw9IDApIHtcblx0XHQkcCA9IDE7XG5cdH0gZWxzZSBpZiAoJG4gPiAxMDApIHtcblx0XHQkcCA9IF9zdWJ1cHJvYigoTWF0aC5wb3coKCR4IC8gJG4pLCAxLzMpXG5cdFx0XHRcdC0gKDEgLSAyLzkvJG4pKSAvIE1hdGguc3FydCgyLzkvJG4pKTtcblx0fSBlbHNlIGlmICgkeCA+IDQwMCkge1xuXHRcdCRwID0gMDtcblx0fSBlbHNlIHsgICBcblx0XHR2YXIgJGE7XG4gICAgICAgICAgICAgICAgdmFyICRpO1xuICAgICAgICAgICAgICAgIHZhciAkaTE7XG5cdFx0aWYgKCgkbiAlIDIpICE9IDApIHtcblx0XHRcdCRwID0gMiAqIF9zdWJ1cHJvYihNYXRoLnNxcnQoJHgpKTtcblx0XHRcdCRhID0gTWF0aC5zcXJ0KDIvTWF0aC5QSSkgKiBNYXRoLmV4cCgtJHgvMikgLyBNYXRoLnNxcnQoJHgpO1xuXHRcdFx0JGkxID0gMTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHAgPSAkYSA9IE1hdGguZXhwKC0keC8yKTtcblx0XHRcdCRpMSA9IDI7XG5cdFx0fVxuXG5cdFx0Zm9yICgkaSA9ICRpMTsgJGkgPD0gKCRuLTIpOyAkaSArPSAyKSB7XG5cdFx0XHQkYSAqPSAkeCAvICRpO1xuXHRcdFx0JHAgKz0gJGE7XG5cdFx0fVxuXHR9XG5cdHJldHVybiAkcDtcbn1cblxuZnVuY3Rpb24gX3N1YnUgKCRwKSB7XG5cdHZhciAkeSA9IC1NYXRoLmxvZyg0ICogJHAgKiAoMSAtICRwKSk7XG5cdHZhciAkeCA9IE1hdGguc3FydChcblx0XHQkeSAqICgxLjU3MDc5NjI4OFxuXHRcdCAgKyAkeSAqICguMDM3MDY5ODc5MDZcblx0XHQgIFx0KyAkeSAqICgtLjgzNjQzNTM1ODlFLTNcblx0XHRcdCAgKyAkeSAqKC0uMjI1MDk0NzE3NkUtM1xuXHRcdFx0ICBcdCsgJHkgKiAoLjY4NDEyMTgyOTlFLTVcblx0XHRcdFx0ICArICR5ICogKDAuNTgyNDIzODUxNUUtNVxuXHRcdFx0XHRcdCsgJHkgKiAoLS4xMDQ1Mjc0OTdFLTVcblx0XHRcdFx0XHQgICsgJHkgKiAoLjgzNjA5MzcwMTdFLTdcblx0XHRcdFx0XHRcdCsgJHkgKiAoLS4zMjMxMDgxMjc3RS04XG5cdFx0XHRcdFx0XHQgICsgJHkgKiAoLjM2NTc3NjMwMzZFLTEwXG5cdFx0XHRcdFx0XHRcdCsgJHkgKi42OTM2MjMzOTgyRS0xMikpKSkpKSkpKSkpO1xuXHRpZiAoJHA+LjUpXG4gICAgICAgICAgICAgICAgJHggPSAtJHg7XG5cdHJldHVybiAkeDtcbn1cblxuZnVuY3Rpb24gX3N1YnVwcm9iICgkeCkge1xuXHR2YXIgJHAgPSAwOyAvKiBpZiAoJGFic3ggPiAxMDApICovXG5cdHZhciAkYWJzeCA9IE1hdGguYWJzKCR4KTtcblxuXHRpZiAoJGFic3ggPCAxLjkpIHtcblx0XHQkcCA9IE1hdGgucG93KCgxICtcblx0XHRcdCRhYnN4ICogKC4wNDk4NjczNDdcblx0XHRcdCAgKyAkYWJzeCAqICguMDIxMTQxMDA2MVxuXHRcdFx0ICBcdCsgJGFic3ggKiAoLjAwMzI3NzYyNjNcblx0XHRcdFx0ICArICRhYnN4ICogKC4wMDAwMzgwMDM2XG5cdFx0XHRcdFx0KyAkYWJzeCAqICguMDAwMDQ4ODkwNlxuXHRcdFx0XHRcdCAgKyAkYWJzeCAqIC4wMDAwMDUzODMpKSkpKSksIC0xNikvMjtcblx0fSBlbHNlIGlmICgkYWJzeCA8PSAxMDApIHtcblx0XHRmb3IgKHZhciAkaSA9IDE4OyAkaSA+PSAxOyAkaS0tKSB7XG5cdFx0XHQkcCA9ICRpIC8gKCRhYnN4ICsgJHApO1xuXHRcdH1cblx0XHQkcCA9IE1hdGguZXhwKC0uNSAqICRhYnN4ICogJGFic3gpIFxuXHRcdFx0LyBNYXRoLnNxcnQoMiAqIE1hdGguUEkpIC8gKCRhYnN4ICsgJHApO1xuXHR9XG5cblx0aWYgKCR4PDApXG4gICAgICAgIFx0JHAgPSAxIC0gJHA7XG5cdHJldHVybiAkcDtcbn1cblxuICAgXG5mdW5jdGlvbiBfc3VidCAoJG4sICRwKSB7XG5cblx0aWYgKCRwID49IDEgfHwgJHAgPD0gMCkge1xuXHRcdHRocm93KFwiSW52YWxpZCBwOiAkcFxcblwiKTtcblx0fVxuXG5cdGlmICgkcCA9PSAwLjUpIHtcblx0XHRyZXR1cm4gMDtcblx0fSBlbHNlIGlmICgkcCA8IDAuNSkge1xuXHRcdHJldHVybiAtIF9zdWJ0KCRuLCAxIC0gJHApO1xuXHR9XG5cblx0dmFyICR1ID0gX3N1YnUoJHApO1xuXHR2YXIgJHUyID0gTWF0aC5wb3coJHUsIDIpO1xuXG5cdHZhciAkYSA9ICgkdTIgKyAxKSAvIDQ7XG5cdHZhciAkYiA9ICgoNSAqICR1MiArIDE2KSAqICR1MiArIDMpIC8gOTY7XG5cdHZhciAkYyA9ICgoKDMgKiAkdTIgKyAxOSkgKiAkdTIgKyAxNykgKiAkdTIgLSAxNSkgLyAzODQ7XG5cdHZhciAkZCA9ICgoKCg3OSAqICR1MiArIDc3NikgKiAkdTIgKyAxNDgyKSAqICR1MiAtIDE5MjApICogJHUyIC0gOTQ1KSBcblx0XHRcdFx0LyA5MjE2MDtcblx0dmFyICRlID0gKCgoKCgyNyAqICR1MiArIDMzOSkgKiAkdTIgKyA5MzApICogJHUyIC0gMTc4MikgKiAkdTIgLSA3NjUpICogJHUyXG5cdFx0XHQrIDE3OTU1KSAvIDM2ODY0MDtcblxuXHR2YXIgJHggPSAkdSAqICgxICsgKCRhICsgKCRiICsgKCRjICsgKCRkICsgJGUgLyAkbikgLyAkbikgLyAkbikgLyAkbikgLyAkbik7XG5cblx0aWYgKCRuIDw9IE1hdGgucG93KGxvZzEwKCRwKSwgMikgKyAzKSB7XG5cdFx0dmFyICRyb3VuZDtcblx0XHRkbyB7IFxuXHRcdFx0dmFyICRwMSA9IF9zdWJ0cHJvYigkbiwgJHgpO1xuXHRcdFx0dmFyICRuMSA9ICRuICsgMTtcblx0XHRcdHZhciAkZGVsdGEgPSAoJHAxIC0gJHApIFxuXHRcdFx0XHQvIE1hdGguZXhwKCgkbjEgKiBNYXRoLmxvZygkbjEgLyAoJG4gKyAkeCAqICR4KSkgXG5cdFx0XHRcdFx0KyBNYXRoLmxvZygkbi8kbjEvMi9NYXRoLlBJKSAtIDEgXG5cdFx0XHRcdFx0KyAoMS8kbjEgLSAxLyRuKSAvIDYpIC8gMik7XG5cdFx0XHQkeCArPSAkZGVsdGE7XG5cdFx0XHQkcm91bmQgPSByb3VuZF90b19wcmVjaXNpb24oJGRlbHRhLCBNYXRoLmFicyhpbnRlZ2VyKGxvZzEwKE1hdGguYWJzKCR4KSktNCkpKTtcblx0XHR9IHdoaWxlICgoJHgpICYmICgkcm91bmQgIT0gMCkpO1xuXHR9XG5cdHJldHVybiAkeDtcbn1cblxuZnVuY3Rpb24gX3N1YnRwcm9iICgkbiwgJHgpIHtcblxuXHR2YXIgJGE7XG4gICAgICAgIHZhciAkYjtcblx0dmFyICR3ID0gTWF0aC5hdGFuMigkeCAvIE1hdGguc3FydCgkbiksIDEpO1xuXHR2YXIgJHogPSBNYXRoLnBvdyhNYXRoLmNvcygkdyksIDIpO1xuXHR2YXIgJHkgPSAxO1xuXG5cdGZvciAodmFyICRpID0gJG4tMjsgJGkgPj0gMjsgJGkgLT0gMikge1xuXHRcdCR5ID0gMSArICgkaS0xKSAvICRpICogJHogKiAkeTtcblx0fSBcblxuXHRpZiAoJG4gJSAyID09IDApIHtcblx0XHQkYSA9IE1hdGguc2luKCR3KS8yO1xuXHRcdCRiID0gLjU7XG5cdH0gZWxzZSB7XG5cdFx0JGEgPSAoJG4gPT0gMSkgPyAwIDogTWF0aC5zaW4oJHcpKk1hdGguY29zKCR3KS9NYXRoLlBJO1xuXHRcdCRiPSAuNSArICR3L01hdGguUEk7XG5cdH1cblx0cmV0dXJuIG1heCgwLCAxIC0gJGIgLSAkYSAqICR5KTtcbn1cblxuZnVuY3Rpb24gX3N1YmYgKCRuLCAkbSwgJHApIHtcblx0dmFyICR4O1xuXG5cdGlmICgkcCA+PSAxIHx8ICRwIDw9IDApIHtcblx0XHR0aHJvdyhcIkludmFsaWQgcDogJHBcXG5cIik7XG5cdH1cblxuXHRpZiAoJHAgPT0gMSkge1xuXHRcdCR4ID0gMDtcblx0fSBlbHNlIGlmICgkbSA9PSAxKSB7XG5cdFx0JHggPSAxIC8gTWF0aC5wb3coX3N1YnQoJG4sIDAuNSAtICRwIC8gMiksIDIpO1xuXHR9IGVsc2UgaWYgKCRuID09IDEpIHtcblx0XHQkeCA9IE1hdGgucG93KF9zdWJ0KCRtLCAkcC8yKSwgMik7XG5cdH0gZWxzZSBpZiAoJG0gPT0gMikge1xuXHRcdHZhciAkdSA9IF9zdWJjaGlzcXIoJG0sIDEgLSAkcCk7XG5cdFx0dmFyICRhID0gJG0gLSAyO1xuXHRcdCR4ID0gMSAvICgkdSAvICRtICogKDEgK1xuXHRcdFx0KCgkdSAtICRhKSAvIDIgK1xuXHRcdFx0XHQoKCg0ICogJHUgLSAxMSAqICRhKSAqICR1ICsgJGEgKiAoNyAqICRtIC0gMTApKSAvIDI0ICtcblx0XHRcdFx0XHQoKCgyICogJHUgLSAxMCAqICRhKSAqICR1ICsgJGEgKiAoMTcgKiAkbSAtIDI2KSkgKiAkdVxuXHRcdFx0XHRcdFx0LSAkYSAqICRhICogKDkgKiAkbSAtIDYpXG5cdFx0XHRcdFx0KS80OC8kblxuXHRcdFx0XHQpLyRuXG5cdFx0XHQpLyRuKSk7XG5cdH0gZWxzZSBpZiAoJG4gPiAkbSkge1xuXHRcdCR4ID0gMSAvIF9zdWJmMigkbSwgJG4sIDEgLSAkcClcblx0fSBlbHNlIHtcblx0XHQkeCA9IF9zdWJmMigkbiwgJG0sICRwKVxuXHR9XG5cdHJldHVybiAkeDtcbn1cblxuZnVuY3Rpb24gX3N1YmYyICgkbiwgJG0sICRwKSB7XG5cdHZhciAkdSA9IF9zdWJjaGlzcXIoJG4sICRwKTtcblx0dmFyICRuMiA9ICRuIC0gMjtcblx0dmFyICR4ID0gJHUgLyAkbiAqIFxuXHRcdCgxICsgXG5cdFx0XHQoKCR1IC0gJG4yKSAvIDIgKyBcblx0XHRcdFx0KCgoNCAqICR1IC0gMTEgKiAkbjIpICogJHUgKyAkbjIgKiAoNyAqICRuIC0gMTApKSAvIDI0ICsgXG5cdFx0XHRcdFx0KCgoMiAqICR1IC0gMTAgKiAkbjIpICogJHUgKyAkbjIgKiAoMTcgKiAkbiAtIDI2KSkgKiAkdSBcblx0XHRcdFx0XHRcdC0gJG4yICogJG4yICogKDkgKiAkbiAtIDYpKSAvIDQ4IC8gJG0pIC8gJG0pIC8gJG0pO1xuXHR2YXIgJGRlbHRhO1xuXHRkbyB7XG5cdFx0dmFyICR6ID0gTWF0aC5leHAoXG5cdFx0XHQoKCRuKyRtKSAqIE1hdGgubG9nKCgkbiskbSkgLyAoJG4gKiAkeCArICRtKSkgXG5cdFx0XHRcdCsgKCRuIC0gMikgKiBNYXRoLmxvZygkeClcblx0XHRcdFx0KyBNYXRoLmxvZygkbiAqICRtIC8gKCRuKyRtKSlcblx0XHRcdFx0LSBNYXRoLmxvZyg0ICogTWF0aC5QSSlcblx0XHRcdFx0LSAoMS8kbiAgKyAxLyRtIC0gMS8oJG4rJG0pKS82XG5cdFx0XHQpLzIpO1xuXHRcdCRkZWx0YSA9IChfc3ViZnByb2IoJG4sICRtLCAkeCkgLSAkcCkgLyAkejtcblx0XHQkeCArPSAkZGVsdGE7XG5cdH0gd2hpbGUgKE1hdGguYWJzKCRkZWx0YSk+M2UtNCk7XG5cdHJldHVybiAkeDtcbn1cblxuZnVuY3Rpb24gX3N1YmNoaXNxciAoJG4sICRwKSB7XG5cdHZhciAkeDtcblxuXHRpZiAoKCRwID4gMSkgfHwgKCRwIDw9IDApKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIHA6ICRwXFxuXCIpO1xuXHR9IGVsc2UgaWYgKCRwID09IDEpe1xuXHRcdCR4ID0gMDtcblx0fSBlbHNlIGlmICgkbiA9PSAxKSB7XG5cdFx0JHggPSBNYXRoLnBvdyhfc3VidSgkcCAvIDIpLCAyKTtcblx0fSBlbHNlIGlmICgkbiA9PSAyKSB7XG5cdFx0JHggPSAtMiAqIE1hdGgubG9nKCRwKTtcblx0fSBlbHNlIHtcblx0XHR2YXIgJHUgPSBfc3VidSgkcCk7XG5cdFx0dmFyICR1MiA9ICR1ICogJHU7XG5cblx0XHQkeCA9IG1heCgwLCAkbiArIE1hdGguc3FydCgyICogJG4pICogJHUgXG5cdFx0XHQrIDIvMyAqICgkdTIgLSAxKVxuXHRcdFx0KyAkdSAqICgkdTIgLSA3KSAvIDkgLyBNYXRoLnNxcnQoMiAqICRuKVxuXHRcdFx0LSAyLzQwNSAvICRuICogKCR1MiAqICgzICokdTIgKyA3KSAtIDE2KSk7XG5cblx0XHRpZiAoJG4gPD0gMTAwKSB7XG5cdFx0XHR2YXIgJHgwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRwMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkejtcblx0XHRcdGRvIHtcblx0XHRcdFx0JHgwID0gJHg7XG5cdFx0XHRcdGlmICgkeCA8IDApIHtcblx0XHRcdFx0XHQkcDEgPSAxO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCRuPjEwMCkge1xuXHRcdFx0XHRcdCRwMSA9IF9zdWJ1cHJvYigoTWF0aC5wb3coKCR4IC8gJG4pLCAoMS8zKSkgLSAoMSAtIDIvOS8kbikpXG5cdFx0XHRcdFx0XHQvIE1hdGguc3FydCgyLzkvJG4pKTtcblx0XHRcdFx0fSBlbHNlIGlmICgkeD40MDApIHtcblx0XHRcdFx0XHQkcDEgPSAwO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhciAkaTBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgJGE7XG5cdFx0XHRcdFx0aWYgKCgkbiAlIDIpICE9IDApIHtcblx0XHRcdFx0XHRcdCRwMSA9IDIgKiBfc3VidXByb2IoTWF0aC5zcXJ0KCR4KSk7XG5cdFx0XHRcdFx0XHQkYSA9IE1hdGguc3FydCgyL01hdGguUEkpICogTWF0aC5leHAoLSR4LzIpIC8gTWF0aC5zcXJ0KCR4KTtcblx0XHRcdFx0XHRcdCRpMCA9IDE7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRwMSA9ICRhID0gTWF0aC5leHAoLSR4LzIpO1xuXHRcdFx0XHRcdFx0JGkwID0gMjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRmb3IgKHZhciAkaSA9ICRpMDsgJGkgPD0gJG4tMjsgJGkgKz0gMikge1xuXHRcdFx0XHRcdFx0JGEgKj0gJHggLyAkaTtcblx0XHRcdFx0XHRcdCRwMSArPSAkYTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0JHogPSBNYXRoLmV4cCgoKCRuLTEpICogTWF0aC5sb2coJHgvJG4pIC0gTWF0aC5sb2coNCpNYXRoLlBJKiR4KSBcblx0XHRcdFx0XHQrICRuIC0gJHggLSAxLyRuLzYpIC8gMik7XG5cdFx0XHRcdCR4ICs9ICgkcDEgLSAkcCkgLyAkejtcblx0XHRcdFx0JHggPSByb3VuZF90b19wcmVjaXNpb24oJHgsIDUpO1xuXHRcdFx0fSB3aGlsZSAoKCRuIDwgMzEpICYmIChNYXRoLmFicygkeDAgLSAkeCkgPiAxZS00KSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiAkeDtcbn1cblxuZnVuY3Rpb24gbG9nMTAgKCRuKSB7XG5cdHJldHVybiBNYXRoLmxvZygkbikgLyBNYXRoLmxvZygxMCk7XG59XG4gXG5mdW5jdGlvbiBtYXggKCkge1xuXHR2YXIgJG1heCA9IGFyZ3VtZW50c1swXTtcblx0Zm9yICh2YXIgJGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRtYXggPCBhcmd1bWVudHNbJGldKVxuICAgICAgICAgICAgICAgICAgICAgICAgJG1heCA9IGFyZ3VtZW50c1skaV07XG5cdH1cdFxuXHRyZXR1cm4gJG1heDtcbn1cblxuZnVuY3Rpb24gbWluICgpIHtcblx0dmFyICRtaW4gPSBhcmd1bWVudHNbMF07XG5cdGZvciAodmFyICRpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICgkbWluID4gYXJndW1lbnRzWyRpXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICRtaW4gPSBhcmd1bWVudHNbJGldO1xuXHR9XG5cdHJldHVybiAkbWluO1xufVxuXG5mdW5jdGlvbiBwcmVjaXNpb24gKCR4KSB7XG5cdHJldHVybiBNYXRoLmFicyhpbnRlZ2VyKGxvZzEwKE1hdGguYWJzKCR4KSkgLSBTSUdOSUZJQ0FOVCkpO1xufVxuXG5mdW5jdGlvbiBwcmVjaXNpb25fc3RyaW5nICgkeCkge1xuXHRpZiAoJHgpIHtcblx0XHRyZXR1cm4gcm91bmRfdG9fcHJlY2lzaW9uKCR4LCBwcmVjaXNpb24oJHgpKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gXCIwXCI7XG5cdH1cbn1cblxuZnVuY3Rpb24gcm91bmRfdG9fcHJlY2lzaW9uICgkeCwgJHApIHtcbiAgICAgICAgJHggPSAkeCAqIE1hdGgucG93KDEwLCAkcCk7XG4gICAgICAgICR4ID0gTWF0aC5yb3VuZCgkeCk7XG4gICAgICAgIHJldHVybiAkeCAvIE1hdGgucG93KDEwLCAkcCk7XG59XG5cbmZ1bmN0aW9uIGludGVnZXIgKCRpKSB7XG4gICAgICAgIGlmICgkaSA+IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoJGkpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbCgkaSk7XG59IiwiaW1wb3J0IHt0ZGlzdHJ9IGZyb20gXCIuL3N0YXRpc3RpY3MtZGlzdHJpYnV0aW9uc1wiXHJcblxyXG52YXIgc3UgPSBtb2R1bGUuZXhwb3J0cy5TdGF0aXN0aWNzVXRpbHMgPXt9O1xyXG5zdS5zYW1wbGVDb3JyZWxhdGlvbiA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL3NhbXBsZV9jb3JyZWxhdGlvbicpO1xyXG5zdS5saW5lYXJSZWdyZXNzaW9uID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvbGluZWFyX3JlZ3Jlc3Npb24nKTtcclxuc3UubGluZWFyUmVncmVzc2lvbkxpbmUgPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy9saW5lYXJfcmVncmVzc2lvbl9saW5lJyk7XHJcbnN1LmVycm9yRnVuY3Rpb24gPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy9lcnJvcl9mdW5jdGlvbicpO1xyXG5zdS5zdGFuZGFyZERldmlhdGlvbiA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL3N0YW5kYXJkX2RldmlhdGlvbicpO1xyXG5zdS5zYW1wbGVTdGFuZGFyZERldmlhdGlvbiA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL3NhbXBsZV9zdGFuZGFyZF9kZXZpYXRpb24nKTtcclxuc3UudmFyaWFuY2UgPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy92YXJpYW5jZScpO1xyXG5zdS5tZWFuID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvbWVhbicpO1xyXG5zdS56U2NvcmUgPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy96X3Njb3JlJyk7XHJcbnN1LnN0YW5kYXJkRXJyb3I9IGFyciA9PiBNYXRoLnNxcnQoc3UudmFyaWFuY2UoYXJyKS8oYXJyLmxlbmd0aC0xKSk7XHJcblxyXG5cclxuc3UudFZhbHVlPSAoZGVncmVlc09mRnJlZWRvbSwgY3JpdGljYWxQcm9iYWJpbGl0eSkgPT4geyAvL2FzIGluIGh0dHA6Ly9zdGF0dHJlay5jb20vb25saW5lLWNhbGN1bGF0b3IvdC1kaXN0cmlidXRpb24uYXNweFxyXG4gICAgcmV0dXJuIHRkaXN0cihkZWdyZWVzT2ZGcmVlZG9tLCBjcml0aWNhbFByb2JhYmlsaXR5KTtcclxufTsiLCJleHBvcnQgY2xhc3MgVXRpbHMge1xyXG4gICAgc3RhdGljIFNRUlRfMiA9IDEuNDE0MjEzNTYyMzc7XHJcbiAgICAvLyB1c2FnZSBleGFtcGxlIGRlZXBFeHRlbmQoe30sIG9iakEsIG9iakIpOyA9PiBzaG91bGQgd29yayBzaW1pbGFyIHRvICQuZXh0ZW5kKHRydWUsIHt9LCBvYmpBLCBvYmpCKTtcclxuICAgIHN0YXRpYyBkZWVwRXh0ZW5kKG91dCkge1xyXG5cclxuICAgICAgICB2YXIgdXRpbHMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBlbXB0eU91dCA9IHt9O1xyXG5cclxuXHJcbiAgICAgICAgaWYgKCFvdXQgJiYgYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgQXJyYXkuaXNBcnJheShhcmd1bWVudHNbMV0pKSB7XHJcbiAgICAgICAgICAgIG91dCA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvdXQgPSBvdXQgfHwge307XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGlmICghc291cmNlKVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkob3V0W2tleV0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlzT2JqZWN0ID0gdXRpbHMuaXNPYmplY3Qob3V0W2tleV0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNyY09iaiA9IHV0aWxzLmlzT2JqZWN0KHNvdXJjZVtrZXldKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNPYmplY3QgJiYgIWlzQXJyYXkgJiYgc3JjT2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMuZGVlcEV4dGVuZChvdXRba2V5XSwgc291cmNlW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRba2V5XSA9IHNvdXJjZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgbWVyZ2VEZWVwKHRhcmdldCwgc291cmNlKSB7XHJcbiAgICAgICAgbGV0IG91dHB1dCA9IE9iamVjdC5hc3NpZ24oe30sIHRhcmdldCk7XHJcbiAgICAgICAgaWYgKFV0aWxzLmlzT2JqZWN0Tm90QXJyYXkodGFyZ2V0KSAmJiBVdGlscy5pc09iamVjdE5vdEFycmF5KHNvdXJjZSkpIHtcclxuICAgICAgICAgICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoVXRpbHMuaXNPYmplY3ROb3RBcnJheShzb3VyY2Vba2V5XSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIShrZXkgaW4gdGFyZ2V0KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihvdXRwdXQsIHtba2V5XTogc291cmNlW2tleV19KTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFtrZXldID0gVXRpbHMubWVyZ2VEZWVwKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ob3V0cHV0LCB7W2tleV06IHNvdXJjZVtrZXldfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0cHV0O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjcm9zcyhhLCBiKSB7XHJcbiAgICAgICAgdmFyIGMgPSBbXSwgbiA9IGEubGVuZ3RoLCBtID0gYi5sZW5ndGgsIGksIGo7XHJcbiAgICAgICAgZm9yIChpID0gLTE7ICsraSA8IG47KSBmb3IgKGogPSAtMTsgKytqIDwgbTspIGMucHVzaCh7eDogYVtpXSwgaTogaSwgeTogYltqXSwgajogan0pO1xyXG4gICAgICAgIHJldHVybiBjO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgaW5mZXJWYXJpYWJsZXMoZGF0YSwgZ3JvdXBLZXksIGluY2x1ZGVHcm91cCkge1xyXG4gICAgICAgIHZhciByZXMgPSBbXTtcclxuICAgICAgICBpZighZGF0YSl7XHJcbiAgICAgICAgICAgIHJldHVybiByZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdmFyIGQgPSBkYXRhWzBdO1xyXG4gICAgICAgICAgICBpZiAoZCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICByZXMgPSBkLm1hcChmdW5jdGlvbiAodiwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGQgPT09ICdvYmplY3QnKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkLmhhc093blByb3BlcnR5KHByb3ApKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2gocHJvcCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGdyb3VwS2V5ICE9PSBudWxsICYmIGdyb3VwS2V5ICE9PSB1bmRlZmluZWQgJiYgIWluY2x1ZGVHcm91cCkge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSByZXMuaW5kZXhPZihncm91cEtleSk7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICByZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzXHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBpc09iamVjdE5vdEFycmF5KGl0ZW0pIHtcclxuICAgICAgICByZXR1cm4gKGl0ZW0gJiYgdHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KGl0ZW0pICYmIGl0ZW0gIT09IG51bGwpO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgaXNPYmplY3QoYSkge1xyXG4gICAgICAgIHJldHVybiBhICE9PSBudWxsICYmIHR5cGVvZiBhID09PSAnb2JqZWN0JztcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGlzTnVtYmVyKGEpIHtcclxuICAgICAgICByZXR1cm4gIWlzTmFOKGEpICYmIHR5cGVvZiBhID09PSAnbnVtYmVyJztcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGlzRnVuY3Rpb24oYSkge1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgYSA9PT0gJ2Z1bmN0aW9uJztcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGlzRGF0ZShhKXtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGEpID09PSAnW29iamVjdCBEYXRlXSdcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaXNTdHJpbmcoYSl7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBhID09PSAnc3RyaW5nJyB8fCBhIGluc3RhbmNlb2YgU3RyaW5nXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGluc2VydE9yQXBwZW5kU2VsZWN0b3IocGFyZW50LCBzZWxlY3Rvciwgb3BlcmF0aW9uLCBiZWZvcmUpIHtcclxuICAgICAgICB2YXIgc2VsZWN0b3JQYXJ0cyA9IHNlbGVjdG9yLnNwbGl0KC8oW1xcLlxcI10pLyk7XHJcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBwYXJlbnRbb3BlcmF0aW9uXShzZWxlY3RvclBhcnRzLnNoaWZ0KCksIGJlZm9yZSk7Ly9cIjpmaXJzdC1jaGlsZFwiXHJcbiAgICAgICAgd2hpbGUgKHNlbGVjdG9yUGFydHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZWN0b3JNb2RpZmllciA9IHNlbGVjdG9yUGFydHMuc2hpZnQoKTtcclxuICAgICAgICAgICAgdmFyIHNlbGVjdG9ySXRlbSA9IHNlbGVjdG9yUGFydHMuc2hpZnQoKTtcclxuICAgICAgICAgICAgaWYgKHNlbGVjdG9yTW9kaWZpZXIgPT09IFwiLlwiKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5jbGFzc2VkKHNlbGVjdG9ySXRlbSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZWN0b3JNb2RpZmllciA9PT0gXCIjXCIpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LmF0dHIoJ2lkJywgc2VsZWN0b3JJdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaW5zZXJ0U2VsZWN0b3IocGFyZW50LCBzZWxlY3RvciwgYmVmb3JlKSB7XHJcbiAgICAgICAgcmV0dXJuIFV0aWxzLmluc2VydE9yQXBwZW5kU2VsZWN0b3IocGFyZW50LCBzZWxlY3RvciwgXCJpbnNlcnRcIiwgYmVmb3JlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXBwZW5kU2VsZWN0b3IocGFyZW50LCBzZWxlY3Rvcikge1xyXG4gICAgICAgIHJldHVybiBVdGlscy5pbnNlcnRPckFwcGVuZFNlbGVjdG9yKHBhcmVudCwgc2VsZWN0b3IsIFwiYXBwZW5kXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzZWxlY3RPckFwcGVuZChwYXJlbnQsIHNlbGVjdG9yLCBlbGVtZW50KSB7XHJcbiAgICAgICAgdmFyIHNlbGVjdGlvbiA9IHBhcmVudC5zZWxlY3Qoc2VsZWN0b3IpO1xyXG4gICAgICAgIGlmIChzZWxlY3Rpb24uZW1wdHkoKSkge1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcmVudC5hcHBlbmQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFV0aWxzLmFwcGVuZFNlbGVjdG9yKHBhcmVudCwgc2VsZWN0b3IpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNlbGVjdGlvbjtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIHNlbGVjdE9ySW5zZXJ0KHBhcmVudCwgc2VsZWN0b3IsIGJlZm9yZSkge1xyXG4gICAgICAgIHZhciBzZWxlY3Rpb24gPSBwYXJlbnQuc2VsZWN0KHNlbGVjdG9yKTtcclxuICAgICAgICBpZiAoc2VsZWN0aW9uLmVtcHR5KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFV0aWxzLmluc2VydFNlbGVjdG9yKHBhcmVudCwgc2VsZWN0b3IsIGJlZm9yZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzZWxlY3Rpb247XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBsaW5lYXJHcmFkaWVudChzdmcsIGdyYWRpZW50SWQsIHJhbmdlLCB4MSwgeTEsIHgyLCB5Mikge1xyXG4gICAgICAgIHZhciBkZWZzID0gVXRpbHMuc2VsZWN0T3JBcHBlbmQoc3ZnLCBcImRlZnNcIik7XHJcbiAgICAgICAgdmFyIGxpbmVhckdyYWRpZW50ID0gZGVmcy5hcHBlbmQoXCJsaW5lYXJHcmFkaWVudFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIGdyYWRpZW50SWQpO1xyXG5cclxuICAgICAgICBsaW5lYXJHcmFkaWVudFxyXG4gICAgICAgICAgICAuYXR0cihcIngxXCIsIHgxICsgXCIlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieTFcIiwgeTEgKyBcIiVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ4MlwiLCB4MiArIFwiJVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInkyXCIsIHkyICsgXCIlXCIpO1xyXG5cclxuICAgICAgICAvL0FwcGVuZCBtdWx0aXBsZSBjb2xvciBzdG9wcyBieSB1c2luZyBEMydzIGRhdGEvZW50ZXIgc3RlcFxyXG4gICAgICAgIHZhciBzdG9wcyA9IGxpbmVhckdyYWRpZW50LnNlbGVjdEFsbChcInN0b3BcIilcclxuICAgICAgICAgICAgLmRhdGEocmFuZ2UpO1xyXG5cclxuICAgICAgICBzdG9wcy5lbnRlcigpLmFwcGVuZChcInN0b3BcIik7XHJcblxyXG4gICAgICAgIHN0b3BzLmF0dHIoXCJvZmZzZXRcIiwgKGQsIGkpID0+IGkgLyAocmFuZ2UubGVuZ3RoIC0gMSkpXHJcbiAgICAgICAgICAgIC5hdHRyKFwic3RvcC1jb2xvclwiLCBkID0+IGQpO1xyXG5cclxuICAgICAgICBzdG9wcy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNhbml0aXplSGVpZ2h0ID0gZnVuY3Rpb24gKGhlaWdodCwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIChoZWlnaHQgfHwgcGFyc2VJbnQoY29udGFpbmVyLnN0eWxlKCdoZWlnaHQnKSwgMTApIHx8IDQwMCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBzYW5pdGl6ZVdpZHRoID0gZnVuY3Rpb24gKHdpZHRoLCBjb250YWluZXIpIHtcclxuICAgICAgICByZXR1cm4gKHdpZHRoIHx8IHBhcnNlSW50KGNvbnRhaW5lci5zdHlsZSgnd2lkdGgnKSwgMTApIHx8IDk2MCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBhdmFpbGFibGVIZWlnaHQgPSBmdW5jdGlvbiAoaGVpZ2h0LCBjb250YWluZXIsIG1hcmdpbikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLm1heCgwLCBVdGlscy5zYW5pdGl6ZUhlaWdodChoZWlnaHQsIGNvbnRhaW5lcikgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBhdmFpbGFibGVXaWR0aCA9IGZ1bmN0aW9uICh3aWR0aCwgY29udGFpbmVyLCBtYXJnaW4pIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5tYXgoMCwgVXRpbHMuc2FuaXRpemVXaWR0aCh3aWR0aCwgY29udGFpbmVyKSAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0KTtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGd1aWQoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gczQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKCgxICsgTWF0aC5yYW5kb20oKSkgKiAweDEwMDAwKVxyXG4gICAgICAgICAgICAgICAgLnRvU3RyaW5nKDE2KVxyXG4gICAgICAgICAgICAgICAgLnN1YnN0cmluZygxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzNCgpICsgczQoKSArICctJyArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICtcclxuICAgICAgICAgICAgczQoKSArICctJyArIHM0KCkgKyBzNCgpICsgczQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvL3BsYWNlcyB0ZXh0U3RyaW5nIGluIHRleHRPYmosIGFkZHMgYW4gZWxsaXBzaXMgaWYgdGV4dCBjYW4ndCBmaXQgaW4gd2lkdGhcclxuICAgIHN0YXRpYyBwbGFjZVRleHRXaXRoRWxsaXBzaXModGV4dEQzT2JqLCB0ZXh0U3RyaW5nLCB3aWR0aCl7XHJcbiAgICAgICAgdmFyIHRleHRPYmogPSB0ZXh0RDNPYmoubm9kZSgpO1xyXG4gICAgICAgIHRleHRPYmoudGV4dENvbnRlbnQ9dGV4dFN0cmluZztcclxuXHJcbiAgICAgICAgdmFyIG1hcmdpbiA9IDA7XHJcbiAgICAgICAgdmFyIGVsbGlwc2lzTGVuZ3RoID0gOTtcclxuICAgICAgICAvL2VsbGlwc2lzIGlzIG5lZWRlZFxyXG4gICAgICAgIGlmICh0ZXh0T2JqLmdldENvbXB1dGVkVGV4dExlbmd0aCgpPndpZHRoK21hcmdpbil7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHg9dGV4dFN0cmluZy5sZW5ndGgtMzt4PjA7eC09MSl7XHJcbiAgICAgICAgICAgICAgICBpZiAodGV4dE9iai5nZXRTdWJTdHJpbmdMZW5ndGgoMCx4KStlbGxpcHNpc0xlbmd0aDw9d2lkdGgrbWFyZ2luKXtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0T2JqLnRleHRDb250ZW50PXRleHRTdHJpbmcuc3Vic3RyaW5nKDAseCkrXCIuLi5cIjtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0ZXh0T2JqLnRleHRDb250ZW50PVwiLi4uXCI7IC8vY2FuJ3QgcGxhY2UgYXQgYWxsXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHBsYWNlVGV4dFdpdGhFbGxpcHNpc0FuZFRvb2x0aXAodGV4dEQzT2JqLCB0ZXh0U3RyaW5nLCB3aWR0aCwgdG9vbHRpcCl7XHJcbiAgICAgICAgdmFyIGVsbGlwc2lzUGxhY2VkID0gVXRpbHMucGxhY2VUZXh0V2l0aEVsbGlwc2lzKHRleHREM09iaiwgdGV4dFN0cmluZywgd2lkdGgpO1xyXG4gICAgICAgIGlmKGVsbGlwc2lzUGxhY2VkICYmIHRvb2x0aXApe1xyXG4gICAgICAgICAgICB0ZXh0RDNPYmoub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIHRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDIwMClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIC45KTtcclxuICAgICAgICAgICAgICAgIHRvb2x0aXAuaHRtbCh0ZXh0U3RyaW5nKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkMy5ldmVudC5wYWdlWSAtIDI4KSArIFwicHhcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGV4dEQzT2JqLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIHRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRGb250U2l6ZShlbGVtZW50KXtcclxuICAgICAgICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShcImZvbnQtc2l6ZVwiKTtcclxuICAgIH1cclxufVxyXG4iXX0=
