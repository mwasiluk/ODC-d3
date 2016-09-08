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
            var _this3 = this;

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

            if (conf.d3ColorCategory) {
                this.plot.colorCategory = d3.scale[conf.d3ColorCategory]();
            }
            var colorValue = conf.color;
            if (colorValue && typeof colorValue === 'string' || colorValue instanceof String) {
                this.plot.color = colorValue;
            } else if (this.plot.colorCategory) {
                if (this.config.groups) {
                    var domain = Object.getOwnPropertyNames(d3.map(this.data, function (d) {
                        return _this3.config.groups.value.call(_this3.config, d);
                    })['_']);
                    self.plot.colorCategory.domain(domain);
                }

                this.plot.color = function (d) {
                    return self.plot.colorCategory(d.key);
                };
            }

            this.plot.data = this.getDataToPlot();
            this.setupX();
            this.setupHistogram();
            this.setupGroupStacks();
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
            if (conf.ticks) {
                x.axis.ticks(conf.ticks);
            }
            var data = this.plot.data;
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

            var data = this.plot.data;
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
            plot.histogramBins = plot.histogram(this.plot.data);
        }
    }, {
        key: "setupGroupStacks",
        value: function setupGroupStacks() {
            var _this4 = this;

            var self = this;
            this.plot.groupingEnabled = this.config.groups && this.config.groups.value;

            this.plot.stack = d3.layout.stack().values(function (d) {
                return d.histogramBins;
            });
            this.plot.groupedData = d3.nest().key(function (d) {
                return _this4.plot.groupingEnabled ? _this4.config.groups.value.call(_this4.config, d) : 'root';
            }).entries(this.plot.data);
            this.plot.groupedData.forEach(function (d) {
                d.histogramBins = _this4.plot.histogram.frequency(_this4.config.frequency || _this4.plot.groupingEnabled)(d.values);
                if (!_this4.config.frequency && _this4.plot.groupingEnabled) {
                    d.histogramBins.forEach(function (b) {
                        b.dy = b.dy / _this4.plot.data.length;
                        b.y = b.y / _this4.plot.data.length;
                    });
                }
            });
            this.plot.stackedHistograms = this.plot.stack(this.plot.groupedData);
        }
    }, {
        key: "getDataToPlot",
        value: function getDataToPlot() {
            var _this5 = this;

            if (!this.enabledGroups) {
                return this.data;
            }

            return this.data.filter(function (d) {
                return _this5.enabledGroups.indexOf(_this5.config.groups.value.call(_this5.config, d)) > -1;
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

            var dx = plot.histogramBins.length ? plot.x.scale(plot.histogramBins[0].dx) : 0;
            barRectT.attr("width", dx - plot.x.scale(0) - 1).attr("height", function (d) {
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
            var _this6 = this;

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

            plot.legendColor = plot.legend.color().shapeWidth(this.config.legend.shapeWidth).orient('vertical').scale(scale);

            plot.legendColor.on('cellclick', function (c) {
                return _this6.onLegendCellClick(c);
            });

            plot.legend.container.call(plot.legendColor);
        }
    }, {
        key: "onLegendCellClick",
        value: function onLegendCellClick(cellValue) {
            this.updateEnabledGroups(cellValue);

            var isDisabled = this.enabledGroups.indexOf(cellValue) < 0;
            this.plot.legend.container.selectAll("g.cell").each(function (cell) {
                if (cell == cellValue) {
                    d3.select(this).classed("odc-disabled", isDisabled);
                }
            });

            this.init();
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
        }
    }, {
        key: "setData",
        value: function setData(data) {
            _get(Object.getPrototypeOf(Histogram.prototype), "setData", this).call(this, data);
            this.enabledGroups = null;
            return this;
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
            var self = this;
            var dataByGroup = {};
            this.plot.data.forEach(function (d) {
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

            this.setupGroups();

            this.plot.data = this.getDataToPlot();
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

            return this;
        }
    }, {
        key: "setupGroups",
        value: function setupGroups() {
            var self = this;
            var conf = this.config;
            this.plot.groupValue = function (d) {
                return conf.groups.value(d, conf.groups.key);
            };
            if (conf.dot.d3ColorCategory) {
                this.plot.dot.colorCategory = d3.scale[conf.dot.d3ColorCategory]();
            }
            var colorValue = conf.dot.color;
            if (colorValue) {
                this.plot.dot.colorValue = colorValue;

                if (typeof colorValue === 'string' || colorValue instanceof String) {
                    this.plot.dot.color = colorValue;
                } else if (this.plot.dot.colorCategory) {
                    var domain = Object.getOwnPropertyNames(d3.map(this.data, function (d) {
                        return self.plot.dot.colorValue.call(self, d);
                    })['_']);
                    self.plot.dot.colorCategory.domain(domain);
                    this.plot.dot.color = function (d) {
                        return self.plot.dot.colorCategory(self.plot.dot.colorValue.call(self, d));
                    };
                }
            }
        }
    }, {
        key: "getDataToPlot",
        value: function getDataToPlot() {
            var _this3 = this;

            if (!this.enabledGroups) {
                return this.data;
            }

            var filter = this.data.filter(function (d) {
                return _this3.enabledGroups.indexOf(_this3.plot.groupValue(d)) > -1;
            });
            console.log(filter.length);
            return filter;
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

            function plotSubplot(p) {
                var plot = self.plot;
                plot.subplots.push(p);
                var cell = d3.select(this);

                plot.x.scale.domain(plot.domainByVariable[p.x]);
                plot.y.scale.domain(plot.domainByVariable[p.y]);

                var frameClass = self.prefixClass("frame");
                cell.selectOrAppend("rect." + frameClass).attr("class", frameClass).attr("x", conf.padding / 2).attr("y", conf.padding / 2).attr("width", conf.size - conf.padding).attr("height", conf.size - conf.padding);

                p.update = function () {

                    var subplot = this;
                    var dots = cell.selectAll("circle").data(self.plot.data);

                    dots.enter().append("circle");

                    var dotsT = dots;
                    if (self.transitionEnabled()) {
                        dotsT = dots.transition();
                    }

                    dotsT.attr("cx", function (d) {
                        return plot.x.map(d, subplot.x);
                    }).attr("cy", function (d) {
                        return plot.y.map(d, subplot.y);
                    }).attr("r", self.config.dot.radius);

                    if (plot.dot.color) {
                        dotsT.style("fill", plot.dot.color);
                    }

                    if (plot.tooltip) {
                        dots.on("mouseover", function (d) {
                            plot.tooltip.transition().duration(200).style("opacity", .9);
                            var html = "(" + plot.x.value(d, subplot.x) + ", " + plot.y.value(d, subplot.y) + ")";
                            plot.tooltip.html(html).style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY - 28 + "px");

                            var group = self.config.groups ? self.config.groups.value(d) : false;
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

            var self = this;
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

            plot.legendColor = plot.legend.color().shapeWidth(this.config.legend.shapeWidth).orient('vertical').scale(scale);

            plot.legendColor.on('cellclick', function (c) {
                return self.onLegendCellClick(c);
            });

            plot.legend.container.call(plot.legendColor);
        }
    }, {
        key: "onLegendCellClick",
        value: function onLegendCellClick(cellValue) {
            this.updateEnabledGroups(cellValue);

            var isDisabled = this.enabledGroups.indexOf(cellValue) < 0;
            this.plot.legend.container.selectAll("g.cell").each(function (cell) {
                if (cell == cellValue) {
                    d3.select(this).classed("odc-disabled", isDisabled);
                }
            });

            this.init();
        }
    }, {
        key: "updateEnabledGroups",
        value: function updateEnabledGroups(cellValue) {
            if (!this.enabledGroups) {
                this.enabledGroups = this.plot.dot.colorCategory.domain().slice();
            }
            var index = this.enabledGroups.indexOf(cellValue);

            if (index < 0) {
                this.enabledGroups.push(cellValue);
            } else {
                this.enabledGroups.splice(index, 1);
            }
        }
    }, {
        key: "setData",
        value: function setData(data) {
            _get(Object.getPrototypeOf(ScatterPlotMatrix.prototype), "setData", this).call(this, data);
            this.enabledGroups = null;
            return this;
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

    //show axis guides

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
        _this.dot = {
            radius: 2,
            color: function color(d) {
                return _this.groups ? _this.groups.value(d, _this.groups.key) : '';
            }, // string or function returning color's value for color scale
            d3ColorCategory: 'category10'
        };
        _this.transition = true;


        if (custom) {
            _utils.Utils.deepExtend(_this, custom);
        }

        return _this;
    } //show tooltip on dot hover


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

            this.setupGroups();

            this.plot.data = this.getDataToPlot();
            this.setupX();
            this.setupY();

            return this;
        }
    }, {
        key: "setupGroups",
        value: function setupGroups() {
            var self = this;
            var conf = this.config;
            this.plot.groupValue = function (d) {
                return conf.groups.value(d, conf.groups.key);
            };
            if (conf.dot.d3ColorCategory) {
                this.plot.dot.colorCategory = d3.scale[conf.dot.d3ColorCategory]();
            }
            var colorValue = conf.dot.color;
            if (colorValue) {
                this.plot.dot.colorValue = colorValue;

                if (typeof colorValue === 'string' || colorValue instanceof String) {
                    this.plot.dot.color = colorValue;
                } else if (this.plot.dot.colorCategory) {
                    var domain = Object.getOwnPropertyNames(d3.map(this.data, function (d) {
                        return self.plot.dot.colorValue.call(self, d);
                    })['_']);
                    self.plot.dot.colorCategory.domain(domain);
                    this.plot.dot.color = function (d) {
                        return self.plot.dot.colorCategory(self.plot.dot.colorValue.call(self, d));
                    };
                }
            }
        }
    }, {
        key: "getDataToPlot",
        value: function getDataToPlot() {
            var _this3 = this;

            if (!this.enabledGroups) {
                return this.data;
            }

            return this.data.filter(function (d) {
                return _this3.enabledGroups.indexOf(_this3.plot.groupValue(d)) > -1;
            });
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
            var data = this.plot.data;
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

            var data = this.plot.data;
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
            var data = plot.data;
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
                    var group = self.config.groups ? self.config.groups.value(d, self.config.groups.key) : null;
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

            var self = this;
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

            plot.legendColor = plot.legend.color().shapeWidth(this.config.legend.shapeWidth).orient('vertical').scale(scale);

            plot.legendColor.on('cellclick', function (c) {
                return self.onLegendCellClick(c);
            });

            plot.legend.container.call(plot.legendColor);
        }
    }, {
        key: "onLegendCellClick",
        value: function onLegendCellClick(cellValue) {
            this.updateEnabledGroups(cellValue);

            var isDisabled = this.enabledGroups.indexOf(cellValue) < 0;
            this.plot.legend.container.selectAll("g.cell").each(function (cell) {
                if (cell == cellValue) {
                    d3.select(this).classed("odc-disabled", isDisabled);
                }
            });

            this.init();
        }
    }, {
        key: "updateEnabledGroups",
        value: function updateEnabledGroups(cellValue) {
            if (!this.enabledGroups) {
                this.enabledGroups = this.plot.dot.colorCategory.domain().slice();
            }
            var index = this.enabledGroups.indexOf(cellValue);

            if (index < 0) {
                this.enabledGroups.push(cellValue);
            } else {
                this.enabledGroups.splice(index, 1);
            }
        }
    }, {
        key: "setData",
        value: function setData(data) {
            _get(Object.getPrototypeOf(ScatterPlot.prototype), "setData", this).call(this, data);
            this.enabledGroups = null;
            return this;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJib3dlcl9jb21wb25lbnRzXFxkMy1sZWdlbmRcXG5vLWV4dGVuZC5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxjb2xvci5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxsZWdlbmQuanMiLCJib3dlcl9jb21wb25lbnRzXFxkMy1sZWdlbmRcXHNyY1xcc2l6ZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxzeW1ib2wuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxlcnJvcl9mdW5jdGlvbi5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXGxpbmVhcl9yZWdyZXNzaW9uLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcbGluZWFyX3JlZ3Jlc3Npb25fbGluZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXG1lYW4uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfY29ycmVsYXRpb24uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfY292YXJpYW5jZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXHNhbXBsZV9zdGFuZGFyZF9kZXZpYXRpb24uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfdmFyaWFuY2UuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzdGFuZGFyZF9kZXZpYXRpb24uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzdW0uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzdW1fbnRoX3Bvd2VyX2RldmlhdGlvbnMuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFx2YXJpYW5jZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXHpfc2NvcmUuanMiLCJzcmNcXGJhci1jaGFydC5qcyIsInNyY1xcY2hhcnQuanMiLCJzcmNcXGNvcnJlbGF0aW9uLW1hdHJpeC5qcyIsInNyY1xcZDMtZXh0ZW5zaW9ucy5qcyIsInNyY1xcaGVhdG1hcC10aW1lc2VyaWVzLmpzIiwic3JjXFxoZWF0bWFwLmpzIiwic3JjXFxoaXN0b2dyYW0uanMiLCJzcmNcXGluZGV4LmpzIiwic3JjXFxsZWdlbmQuanMiLCJzcmNcXHJlZ3Jlc3Npb24uanMiLCJzcmNcXHNjYXR0ZXJwbG90LW1hdHJpeC5qcyIsInNyY1xcc2NhdHRlcnBsb3QuanMiLCJzcmNcXHN0YXRpc3RpY3MtZGlzdHJpYnV0aW9ucy5qcyIsInNyY1xcc3RhdGlzdGljcy11dGlscy5qcyIsInNyY1xcdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQjtBQUNmLFNBQU8sUUFBUSxhQUFSLENBRFE7QUFFZixRQUFNLFFBQVEsWUFBUixDQUZTO0FBR2YsVUFBUSxRQUFRLGNBQVI7QUFITyxDQUFqQjs7Ozs7QUNBQSxJQUFJLFNBQVMsUUFBUSxVQUFSLENBQWI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFlBQVU7O0FBRXpCLE1BQUksUUFBUSxHQUFHLEtBQUgsQ0FBUyxNQUFULEVBQVo7QUFBQSxNQUNFLFFBQVEsTUFEVjtBQUFBLE1BRUUsYUFBYSxFQUZmO0FBQUEsTUFHRSxjQUFjLEVBSGhCO0FBQUEsTUFJRSxjQUFjLEVBSmhCO0FBQUEsTUFLRSxlQUFlLENBTGpCO0FBQUEsTUFNRSxRQUFRLENB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SCxDOztBQW5MUSxLLENBcUxGLGEsR0FBZ0IsVUFBVSxLQUFWLEVBQWlCLFNBQWpCLEVBQTRCO0FBQy9DLFdBQVEsU0FBUyxTQUFTLFVBQVUsS0FBVixDQUFnQixPQUFoQixDQUFULEVBQW1DLEVBQW5DLENBQVQsSUFBbUQsR0FBM0Q7QUFDSCxDOztBQXZMUSxLLENBeUxGLGUsR0FBa0IsVUFBVSxNQUFWLEVBQWtCLFNBQWxCLEVBQTZCLE1BQTdCLEVBQXFDO0FBQzFELFdBQU8sS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLE1BQU0sY0FBTixDQUFxQixNQUFyQixFQUE2QixTQUE3QixJQUEwQyxPQUFPLEdBQWpELEdBQXVELE9BQU8sTUFBMUUsQ0FBUDtBQUNILEM7O0FBM0xRLEssQ0E2TEYsYyxHQUFpQixVQUFVLEtBQVYsRUFBaUIsU0FBakIsRUFBNEIsTUFBNUIsRUFBb0M7QUFDeEQsV0FBTyxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksTUFBTSxhQUFOLENBQW9CLEtBQXBCLEVBQTJCLFNBQTNCLElBQXdDLE9BQU8sSUFBL0MsR0FBc0QsT0FBTyxLQUF6RSxDQUFQO0FBQ0gsQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICBjb2xvcjogcmVxdWlyZSgnLi9zcmMvY29sb3InKSxcclxuICBzaXplOiByZXF1aXJlKCcuL3NyYy9zaXplJyksXHJcbiAgc3ltYm9sOiByZXF1aXJlKCcuL3NyYy9zeW1ib2wnKVxyXG59O1xyXG4iLCJ2YXIgaGVscGVyID0gcmVxdWlyZSgnLi9sZWdlbmQnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgdmFyIHNjYWxlID0gZDMuc2NhbGUubGluZWFyKCksXHJcbiAgICBzaGFwZSA9IFwicmVjdFwiLFxyXG4gICAgc2hhcGVXaWR0aCA9IDE1LFxyXG4gICAgc2hhcGVIZWlnaHQgPSAxNSxcclxuICAgIHNoYXBlUmFkaXVzID0gMTAsXHJcbiAgICBzaGFwZVBhZGRpbmcgPSAyLFxyXG4gICAgY2VsbHMgPSBbNV0sXHJcbiAgICBsYWJlbHMgPSBbXSxcclxuICAgIGNsYXNzUHJlZml4ID0gXCJcIixcclxuICAgIHVzZUNsYXNzID0gZmFsc2UsXHJcbiAgICB0aXRsZSA9IFwiXCIsXHJcbiAgICBsYWJlbEZvcm1hdCA9IGQzLmZvcm1hdChcIi4wMWZcIiksXHJcbiAgICBsYWJlbE9mZnNldCA9IDEwLFxyXG4gICAgbGFiZWxBbGlnbiA9IFwibWlkZGxlXCIsXHJcbiAgICBsYWJlbERlbGltaXRlciA9IFwidG9cIixcclxuICAgIG9yaWVudCA9IFwidmVydGljYWxcIixcclxuICAgIGFzY2VuZGluZyA9IGZhbHNlLFxyXG4gICAgcGF0aCxcclxuICAgIGxlZ2VuZERpc3BhdGNoZXIgPSBkMy5kaXNwYXRjaChcImNlbGxvdmVyXCIsIFwiY2VsbG91dFwiLCBcImNlbGxjbGlja1wiKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsZWdlbmQoc3ZnKXtcclxuXHJcbiAgICAgIHZhciB0eXBlID0gaGVscGVyLmQzX2NhbGNUeXBlKHNjYWxlLCBhc2NlbmRpbmcsIGNlbGxzLCBsYWJlbHMsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlciksXHJcbiAgICAgICAgbGVnZW5kRyA9IHN2Zy5zZWxlY3RBbGwoJ2cnKS5kYXRhKFtzY2FsZV0pO1xyXG5cclxuICAgICAgbGVnZW5kRy5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgY2xhc3NQcmVmaXggKyAnbGVnZW5kQ2VsbHMnKTtcclxuXHJcblxyXG4gICAgICB2YXIgY2VsbCA9IGxlZ2VuZEcuc2VsZWN0QWxsKFwiLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGxcIikuZGF0YSh0eXBlLmRhdGEpLFxyXG4gICAgICAgIGNlbGxFbnRlciA9IGNlbGwuZW50ZXIoKS5hcHBlbmQoXCJnXCIsIFwiLmNlbGxcIikuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJjZWxsXCIpLnN0eWxlKFwib3BhY2l0eVwiLCAxZS02KSxcclxuICAgICAgICBzaGFwZUVudGVyID0gY2VsbEVudGVyLmFwcGVuZChzaGFwZSkuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJzd2F0Y2hcIiksXHJcbiAgICAgICAgc2hhcGVzID0gY2VsbC5zZWxlY3QoXCJnLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGwgXCIgKyBzaGFwZSk7XHJcblxyXG4gICAgICAvL2FkZCBldmVudCBoYW5kbGVyc1xyXG4gICAgICBoZWxwZXIuZDNfYWRkRXZlbnRzKGNlbGxFbnRlciwgbGVnZW5kRGlzcGF0Y2hlcik7XHJcblxyXG4gICAgICBjZWxsLmV4aXQoKS50cmFuc2l0aW9uKCkuc3R5bGUoXCJvcGFjaXR5XCIsIDApLnJlbW92ZSgpO1xyXG5cclxuICAgICAgaGVscGVyLmQzX2RyYXdTaGFwZXMoc2hhcGUsIHNoYXBlcywgc2hhcGVIZWlnaHQsIHNoYXBlV2lkdGgsIHNoYXBlUmFkaXVzLCBwYXRoKTtcclxuXHJcbiAgICAgIGhlbHBlci5kM19hZGRUZXh0KGxlZ2VuZEcsIGNlbGxFbnRlciwgdHlwZS5sYWJlbHMsIGNsYXNzUHJlZml4KVxyXG5cclxuICAgICAgLy8gc2V0cyBwbGFjZW1lbnRcclxuICAgICAgdmFyIHRleHQgPSBjZWxsLnNlbGVjdChcInRleHRcIiksXHJcbiAgICAgICAgc2hhcGVTaXplID0gc2hhcGVzWzBdLm1hcCggZnVuY3Rpb24oZCl7IHJldHVybiBkLmdldEJCb3goKTsgfSk7XHJcblxyXG4gICAgICAvL3NldHMgc2NhbGVcclxuICAgICAgLy9ldmVyeXRoaW5nIGlzIGZpbGwgZXhjZXB0IGZvciBsaW5lIHdoaWNoIGlzIHN0cm9rZSxcclxuICAgICAgaWYgKCF1c2VDbGFzcyl7XHJcbiAgICAgICAgaWYgKHNoYXBlID09IFwibGluZVwiKXtcclxuICAgICAgICAgIHNoYXBlcy5zdHlsZShcInN0cm9rZVwiLCB0eXBlLmZlYXR1cmUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzaGFwZXMuc3R5bGUoXCJmaWxsXCIsIHR5cGUuZmVhdHVyZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNoYXBlcy5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCl7IHJldHVybiBjbGFzc1ByZWZpeCArIFwic3dhdGNoIFwiICsgdHlwZS5mZWF0dXJlKGQpOyB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGNlbGxUcmFucyxcclxuICAgICAgdGV4dFRyYW5zLFxyXG4gICAgICB0ZXh0QWxpZ24gPSAobGFiZWxBbGlnbiA9PSBcInN0YXJ0XCIpID8gMCA6IChsYWJlbEFsaWduID09IFwibWlkZGxlXCIpID8gMC41IDogMTtcclxuXHJcbiAgICAgIC8vcG9zaXRpb25zIGNlbGxzIGFuZCB0ZXh0XHJcbiAgICAgIGlmIChvcmllbnQgPT09IFwidmVydGljYWxcIil7XHJcbiAgICAgICAgY2VsbFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZSgwLCBcIiArIChpICogKHNoYXBlU2l6ZVtpXS5oZWlnaHQgKyBzaGFwZVBhZGRpbmcpKSArIFwiKVwiOyB9O1xyXG4gICAgICAgIHRleHRUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAoc2hhcGVTaXplW2ldLndpZHRoICsgc2hhcGVTaXplW2ldLnggK1xyXG4gICAgICAgICAgbGFiZWxPZmZzZXQpICsgXCIsXCIgKyAoc2hhcGVTaXplW2ldLnkgKyBzaGFwZVNpemVbaV0uaGVpZ2h0LzIgKyA1KSArIFwiKVwiOyB9O1xyXG5cclxuICAgICAgfSBlbHNlIGlmIChvcmllbnQgPT09IFwiaG9yaXpvbnRhbFwiKXtcclxuICAgICAgICBjZWxsVHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKGkgKiAoc2hhcGVTaXplW2ldLndpZHRoICsgc2hhcGVQYWRkaW5nKSkgKyBcIiwwKVwiOyB9XHJcbiAgICAgICAgdGV4dFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIChzaGFwZVNpemVbaV0ud2lkdGgqdGV4dEFsaWduICArIHNoYXBlU2l6ZVtpXS54KSArXHJcbiAgICAgICAgICBcIixcIiArIChzaGFwZVNpemVbaV0uaGVpZ2h0ICsgc2hhcGVTaXplW2ldLnkgKyBsYWJlbE9mZnNldCArIDgpICsgXCIpXCI7IH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGhlbHBlci5kM19wbGFjZW1lbnQob3JpZW50LCBjZWxsLCBjZWxsVHJhbnMsIHRleHQsIHRleHRUcmFucywgbGFiZWxBbGlnbik7XHJcbiAgICAgIGhlbHBlci5kM190aXRsZShzdmcsIGxlZ2VuZEcsIHRpdGxlLCBjbGFzc1ByZWZpeCk7XHJcblxyXG4gICAgICBjZWxsLnRyYW5zaXRpb24oKS5zdHlsZShcIm9wYWNpdHlcIiwgMSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gIGxlZ2VuZC5zY2FsZSA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNjYWxlO1xyXG4gICAgc2NhbGUgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuY2VsbHMgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBjZWxscztcclxuICAgIGlmIChfLmxlbmd0aCA+IDEgfHwgXyA+PSAyICl7XHJcbiAgICAgIGNlbGxzID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlID0gZnVuY3Rpb24oXywgZCkge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGU7XHJcbiAgICBpZiAoXyA9PSBcInJlY3RcIiB8fCBfID09IFwiY2lyY2xlXCIgfHwgXyA9PSBcImxpbmVcIiB8fCAoXyA9PSBcInBhdGhcIiAmJiAodHlwZW9mIGQgPT09ICdzdHJpbmcnKSkgKXtcclxuICAgICAgc2hhcGUgPSBfO1xyXG4gICAgICBwYXRoID0gZDtcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlV2lkdGggPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZVdpZHRoO1xyXG4gICAgc2hhcGVXaWR0aCA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuc2hhcGVIZWlnaHQgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZUhlaWdodDtcclxuICAgIHNoYXBlSGVpZ2h0ID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5zaGFwZVJhZGl1cyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlUmFkaXVzO1xyXG4gICAgc2hhcGVSYWRpdXMgPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlUGFkZGluZyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlUGFkZGluZztcclxuICAgIHNoYXBlUGFkZGluZyA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxzID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxzO1xyXG4gICAgbGFiZWxzID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsQWxpZ24gPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbEFsaWduO1xyXG4gICAgaWYgKF8gPT0gXCJzdGFydFwiIHx8IF8gPT0gXCJlbmRcIiB8fCBfID09IFwibWlkZGxlXCIpIHtcclxuICAgICAgbGFiZWxBbGlnbiA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbEZvcm1hdCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsRm9ybWF0O1xyXG4gICAgbGFiZWxGb3JtYXQgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxPZmZzZXQgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbE9mZnNldDtcclxuICAgIGxhYmVsT2Zmc2V0ID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbERlbGltaXRlciA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsRGVsaW1pdGVyO1xyXG4gICAgbGFiZWxEZWxpbWl0ZXIgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQudXNlQ2xhc3MgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB1c2VDbGFzcztcclxuICAgIGlmIChfID09PSB0cnVlIHx8IF8gPT09IGZhbHNlKXtcclxuICAgICAgdXNlQ2xhc3MgPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQub3JpZW50ID0gZnVuY3Rpb24oXyl7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBvcmllbnQ7XHJcbiAgICBfID0gXy50b0xvd2VyQ2FzZSgpO1xyXG4gICAgaWYgKF8gPT0gXCJob3Jpem9udGFsXCIgfHwgXyA9PSBcInZlcnRpY2FsXCIpIHtcclxuICAgICAgb3JpZW50ID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmFzY2VuZGluZyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGFzY2VuZGluZztcclxuICAgIGFzY2VuZGluZyA9ICEhXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmNsYXNzUHJlZml4ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY2xhc3NQcmVmaXg7XHJcbiAgICBjbGFzc1ByZWZpeCA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC50aXRsZSA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHRpdGxlO1xyXG4gICAgdGl0bGUgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBkMy5yZWJpbmQobGVnZW5kLCBsZWdlbmREaXNwYXRjaGVyLCBcIm9uXCIpO1xyXG5cclxuICByZXR1cm4gbGVnZW5kO1xyXG5cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gIGQzX2lkZW50aXR5OiBmdW5jdGlvbiAoZCkge1xyXG4gICAgcmV0dXJuIGQ7XHJcbiAgfSxcclxuXHJcbiAgZDNfbWVyZ2VMYWJlbHM6IGZ1bmN0aW9uIChnZW4sIGxhYmVscykge1xyXG5cclxuICAgICAgaWYobGFiZWxzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGdlbjtcclxuXHJcbiAgICAgIGdlbiA9IChnZW4pID8gZ2VuIDogW107XHJcblxyXG4gICAgICB2YXIgaSA9IGxhYmVscy5sZW5ndGg7XHJcbiAgICAgIGZvciAoOyBpIDwgZ2VuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGFiZWxzLnB1c2goZ2VuW2ldKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbGFiZWxzO1xyXG4gICAgfSxcclxuXHJcbiAgZDNfbGluZWFyTGVnZW5kOiBmdW5jdGlvbiAoc2NhbGUsIGNlbGxzLCBsYWJlbEZvcm1hdCkge1xyXG4gICAgdmFyIGRhdGEgPSBbXTtcclxuXHJcbiAgICBpZiAoY2VsbHMubGVuZ3RoID4gMSl7XHJcbiAgICAgIGRhdGEgPSBjZWxscztcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgZG9tYWluID0gc2NhbGUuZG9tYWluKCksXHJcbiAgICAgIGluY3JlbWVudCA9IChkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdIC0gZG9tYWluWzBdKS8oY2VsbHMgLSAxKSxcclxuICAgICAgaSA9IDA7XHJcblxyXG4gICAgICBmb3IgKDsgaSA8IGNlbGxzOyBpKyspe1xyXG4gICAgICAgIGRhdGEucHVzaChkb21haW5bMF0gKyBpKmluY3JlbWVudCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgbGFiZWxzID0gZGF0YS5tYXAobGFiZWxGb3JtYXQpO1xyXG5cclxuICAgIHJldHVybiB7ZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgbGFiZWxzOiBsYWJlbHMsXHJcbiAgICAgICAgICAgIGZlYXR1cmU6IGZ1bmN0aW9uKGQpeyByZXR1cm4gc2NhbGUoZCk7IH19O1xyXG4gIH0sXHJcblxyXG4gIGQzX3F1YW50TGVnZW5kOiBmdW5jdGlvbiAoc2NhbGUsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlcikge1xyXG4gICAgdmFyIGxhYmVscyA9IHNjYWxlLnJhbmdlKCkubWFwKGZ1bmN0aW9uKGQpe1xyXG4gICAgICB2YXIgaW52ZXJ0ID0gc2NhbGUuaW52ZXJ0RXh0ZW50KGQpLFxyXG4gICAgICBhID0gbGFiZWxGb3JtYXQoaW52ZXJ0WzBdKSxcclxuICAgICAgYiA9IGxhYmVsRm9ybWF0KGludmVydFsxXSk7XHJcblxyXG4gICAgICAvLyBpZiAoKCAoYSkgJiYgKGEuaXNOYW4oKSkgJiYgYil7XHJcbiAgICAgIC8vICAgY29uc29sZS5sb2coXCJpbiBpbml0aWFsIHN0YXRlbWVudFwiKVxyXG4gICAgICAgIHJldHVybiBsYWJlbEZvcm1hdChpbnZlcnRbMF0pICsgXCIgXCIgKyBsYWJlbERlbGltaXRlciArIFwiIFwiICsgbGFiZWxGb3JtYXQoaW52ZXJ0WzFdKTtcclxuICAgICAgLy8gfSBlbHNlIGlmIChhIHx8IGIpIHtcclxuICAgICAgLy8gICBjb25zb2xlLmxvZygnaW4gZWxzZSBzdGF0ZW1lbnQnKVxyXG4gICAgICAvLyAgIHJldHVybiAoYSkgPyBhIDogYjtcclxuICAgICAgLy8gfVxyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7ZGF0YTogc2NhbGUucmFuZ2UoKSxcclxuICAgICAgICAgICAgbGFiZWxzOiBsYWJlbHMsXHJcbiAgICAgICAgICAgIGZlYXR1cmU6IHRoaXMuZDNfaWRlbnRpdHlcclxuICAgICAgICAgIH07XHJcbiAgfSxcclxuXHJcbiAgZDNfb3JkaW5hbExlZ2VuZDogZnVuY3Rpb24gKHNjYWxlKSB7XHJcbiAgICByZXR1cm4ge2RhdGE6IHNjYWxlLmRvbWFpbigpLFxyXG4gICAgICAgICAgICBsYWJlbHM6IHNjYWxlLmRvbWFpbigpLFxyXG4gICAgICAgICAgICBmZWF0dXJlOiBmdW5jdGlvbihkKXsgcmV0dXJuIHNjYWxlKGQpOyB9fTtcclxuICB9LFxyXG5cclxuICBkM19kcmF3U2hhcGVzOiBmdW5jdGlvbiAoc2hhcGUsIHNoYXBlcywgc2hhcGVIZWlnaHQsIHNoYXBlV2lkdGgsIHNoYXBlUmFkaXVzLCBwYXRoKSB7XHJcbiAgICBpZiAoc2hhcGUgPT09IFwicmVjdFwiKXtcclxuICAgICAgICBzaGFwZXMuYXR0cihcImhlaWdodFwiLCBzaGFwZUhlaWdodCkuYXR0cihcIndpZHRoXCIsIHNoYXBlV2lkdGgpO1xyXG5cclxuICAgIH0gZWxzZSBpZiAoc2hhcGUgPT09IFwiY2lyY2xlXCIpIHtcclxuICAgICAgICBzaGFwZXMuYXR0cihcInJcIiwgc2hhcGVSYWRpdXMpLy8uYXR0cihcImN4XCIsIHNoYXBlUmFkaXVzKS5hdHRyKFwiY3lcIiwgc2hhcGVSYWRpdXMpO1xyXG5cclxuICAgIH0gZWxzZSBpZiAoc2hhcGUgPT09IFwibGluZVwiKSB7XHJcbiAgICAgICAgc2hhcGVzLmF0dHIoXCJ4MVwiLCAwKS5hdHRyKFwieDJcIiwgc2hhcGVXaWR0aCkuYXR0cihcInkxXCIsIDApLmF0dHIoXCJ5MlwiLCAwKTtcclxuXHJcbiAgICB9IGVsc2UgaWYgKHNoYXBlID09PSBcInBhdGhcIikge1xyXG4gICAgICBzaGFwZXMuYXR0cihcImRcIiwgcGF0aCk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZDNfYWRkVGV4dDogZnVuY3Rpb24gKHN2ZywgZW50ZXIsIGxhYmVscywgY2xhc3NQcmVmaXgpe1xyXG4gICAgZW50ZXIuYXBwZW5kKFwidGV4dFwiKS5hdHRyKFwiY2xhc3NcIiwgY2xhc3NQcmVmaXggKyBcImxhYmVsXCIpO1xyXG4gICAgc3ZnLnNlbGVjdEFsbChcImcuXCIgKyBjbGFzc1ByZWZpeCArIFwiY2VsbCB0ZXh0XCIpLmRhdGEobGFiZWxzKS50ZXh0KHRoaXMuZDNfaWRlbnRpdHkpO1xyXG4gIH0sXHJcblxyXG4gIGQzX2NhbGNUeXBlOiBmdW5jdGlvbiAoc2NhbGUsIGFzY2VuZGluZywgY2VsbHMsIGxhYmVscywgbGFiZWxGb3JtYXQsIGxhYmVsRGVsaW1pdGVyKXtcclxuICAgIHZhciB0eXBlID0gc2NhbGUudGlja3MgP1xyXG4gICAgICAgICAgICB0aGlzLmQzX2xpbmVhckxlZ2VuZChzY2FsZSwgY2VsbHMsIGxhYmVsRm9ybWF0KSA6IHNjYWxlLmludmVydEV4dGVudCA/XHJcbiAgICAgICAgICAgIHRoaXMuZDNfcXVhbnRMZWdlbmQoc2NhbGUsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlcikgOiB0aGlzLmQzX29yZGluYWxMZWdlbmQoc2NhbGUpO1xyXG5cclxuICAgIHR5cGUubGFiZWxzID0gdGhpcy5kM19tZXJnZUxhYmVscyh0eXBlLmxhYmVscywgbGFiZWxzKTtcclxuXHJcbiAgICBpZiAoYXNjZW5kaW5nKSB7XHJcbiAgICAgIHR5cGUubGFiZWxzID0gdGhpcy5kM19yZXZlcnNlKHR5cGUubGFiZWxzKTtcclxuICAgICAgdHlwZS5kYXRhID0gdGhpcy5kM19yZXZlcnNlKHR5cGUuZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHR5cGU7XHJcbiAgfSxcclxuXHJcbiAgZDNfcmV2ZXJzZTogZnVuY3Rpb24oYXJyKSB7XHJcbiAgICB2YXIgbWlycm9yID0gW107XHJcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGFyci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgbWlycm9yW2ldID0gYXJyW2wtaS0xXTtcclxuICAgIH1cclxuICAgIHJldHVybiBtaXJyb3I7XHJcbiAgfSxcclxuXHJcbiAgZDNfcGxhY2VtZW50OiBmdW5jdGlvbiAob3JpZW50LCBjZWxsLCBjZWxsVHJhbnMsIHRleHQsIHRleHRUcmFucywgbGFiZWxBbGlnbikge1xyXG4gICAgY2VsbC5hdHRyKFwidHJhbnNmb3JtXCIsIGNlbGxUcmFucyk7XHJcbiAgICB0ZXh0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgdGV4dFRyYW5zKTtcclxuICAgIGlmIChvcmllbnQgPT09IFwiaG9yaXpvbnRhbFwiKXtcclxuICAgICAgdGV4dC5zdHlsZShcInRleHQtYW5jaG9yXCIsIGxhYmVsQWxpZ24pO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGQzX2FkZEV2ZW50czogZnVuY3Rpb24oY2VsbHMsIGRpc3BhdGNoZXIpe1xyXG4gICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgY2VsbHMub24oXCJtb3VzZW92ZXIubGVnZW5kXCIsIGZ1bmN0aW9uIChkKSB7IF8uZDNfY2VsbE92ZXIoZGlzcGF0Y2hlciwgZCwgdGhpcyk7IH0pXHJcbiAgICAgICAgICAub24oXCJtb3VzZW91dC5sZWdlbmRcIiwgZnVuY3Rpb24gKGQpIHsgXy5kM19jZWxsT3V0KGRpc3BhdGNoZXIsIGQsIHRoaXMpOyB9KVxyXG4gICAgICAgICAgLm9uKFwiY2xpY2subGVnZW5kXCIsIGZ1bmN0aW9uIChkKSB7IF8uZDNfY2VsbENsaWNrKGRpc3BhdGNoZXIsIGQsIHRoaXMpOyB9KTtcclxuICB9LFxyXG5cclxuICBkM19jZWxsT3ZlcjogZnVuY3Rpb24oY2VsbERpc3BhdGNoZXIsIGQsIG9iail7XHJcbiAgICBjZWxsRGlzcGF0Y2hlci5jZWxsb3Zlci5jYWxsKG9iaiwgZCk7XHJcbiAgfSxcclxuXHJcbiAgZDNfY2VsbE91dDogZnVuY3Rpb24oY2VsbERpc3BhdGNoZXIsIGQsIG9iail7XHJcbiAgICBjZWxsRGlzcGF0Y2hlci5jZWxsb3V0LmNhbGwob2JqLCBkKTtcclxuICB9LFxyXG5cclxuICBkM19jZWxsQ2xpY2s6IGZ1bmN0aW9uKGNlbGxEaXNwYXRjaGVyLCBkLCBvYmope1xyXG4gICAgY2VsbERpc3BhdGNoZXIuY2VsbGNsaWNrLmNhbGwob2JqLCBkKTtcclxuICB9LFxyXG5cclxuICBkM190aXRsZTogZnVuY3Rpb24oc3ZnLCBjZWxsc1N2ZywgdGl0bGUsIGNsYXNzUHJlZml4KXtcclxuICAgIGlmICh0aXRsZSAhPT0gXCJcIil7XHJcblxyXG4gICAgICB2YXIgdGl0bGVUZXh0ID0gc3ZnLnNlbGVjdEFsbCgndGV4dC4nICsgY2xhc3NQcmVmaXggKyAnbGVnZW5kVGl0bGUnKTtcclxuXHJcbiAgICAgIHRpdGxlVGV4dC5kYXRhKFt0aXRsZV0pXHJcbiAgICAgICAgLmVudGVyKClcclxuICAgICAgICAuYXBwZW5kKCd0ZXh0JylcclxuICAgICAgICAuYXR0cignY2xhc3MnLCBjbGFzc1ByZWZpeCArICdsZWdlbmRUaXRsZScpO1xyXG5cclxuICAgICAgICBzdmcuc2VsZWN0QWxsKCd0ZXh0LicgKyBjbGFzc1ByZWZpeCArICdsZWdlbmRUaXRsZScpXHJcbiAgICAgICAgICAgIC50ZXh0KHRpdGxlKVxyXG5cclxuICAgICAgdmFyIHlPZmZzZXQgPSBzdmcuc2VsZWN0KCcuJyArIGNsYXNzUHJlZml4ICsgJ2xlZ2VuZFRpdGxlJylcclxuICAgICAgICAgIC5tYXAoZnVuY3Rpb24oZCkgeyByZXR1cm4gZFswXS5nZXRCQm94KCkuaGVpZ2h0fSlbMF0sXHJcbiAgICAgIHhPZmZzZXQgPSAtY2VsbHNTdmcubWFwKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRbMF0uZ2V0QkJveCgpLnh9KVswXTtcclxuXHJcbiAgICAgIGNlbGxzU3ZnLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIHhPZmZzZXQgKyAnLCcgKyAoeU9mZnNldCArIDEwKSArICcpJyk7XHJcblxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJ2YXIgaGVscGVyID0gcmVxdWlyZSgnLi9sZWdlbmQnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gIGZ1bmN0aW9uKCl7XHJcblxyXG4gIHZhciBzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLFxyXG4gICAgc2hhcGUgPSBcInJlY3RcIixcclxuICAgIHNoYXBlV2lkdGggPSAxNSxcclxuICAgIHNoYXBlUGFkZGluZyA9IDIsXHJcbiAgICBjZWxscyA9IFs1XSxcclxuICAgIGxhYmVscyA9IFtdLFxyXG4gICAgdXNlU3Ryb2tlID0gZmFsc2UsXHJcbiAgICBjbGFzc1ByZWZpeCA9IFwiXCIsXHJcbiAgICB0aXRsZSA9IFwiXCIsXHJcbiAgICBsYWJlbEZvcm1hdCA9IGQzLmZvcm1hdChcIi4wMWZcIiksXHJcbiAgICBsYWJlbE9mZnNldCA9IDEwLFxyXG4gICAgbGFiZWxBbGlnbiA9IFwibWlkZGxlXCIsXHJcbiAgICBsYWJlbERlbGltaXRlciA9IFwidG9cIixcclxuICAgIG9yaWVudCA9IFwidmVydGljYWxcIixcclxuICAgIGFzY2VuZGluZyA9IGZhbHNlLFxyXG4gICAgcGF0aCxcclxuICAgIGxlZ2VuZERpc3BhdGNoZXIgPSBkMy5kaXNwYXRjaChcImNlbGxvdmVyXCIsIFwiY2VsbG91dFwiLCBcImNlbGxjbGlja1wiKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsZWdlbmQoc3ZnKXtcclxuXHJcbiAgICAgIHZhciB0eXBlID0gaGVscGVyLmQzX2NhbGNUeXBlKHNjYWxlLCBhc2NlbmRpbmcsIGNlbGxzLCBsYWJlbHMsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlciksXHJcbiAgICAgICAgbGVnZW5kRyA9IHN2Zy5zZWxlY3RBbGwoJ2cnKS5kYXRhKFtzY2FsZV0pO1xyXG5cclxuICAgICAgbGVnZW5kRy5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgY2xhc3NQcmVmaXggKyAnbGVnZW5kQ2VsbHMnKTtcclxuXHJcblxyXG4gICAgICB2YXIgY2VsbCA9IGxlZ2VuZEcuc2VsZWN0QWxsKFwiLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGxcIikuZGF0YSh0eXBlLmRhdGEpLFxyXG4gICAgICAgIGNlbGxFbnRlciA9IGNlbGwuZW50ZXIoKS5hcHBlbmQoXCJnXCIsIFwiLmNlbGxcIikuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJjZWxsXCIpLnN0eWxlKFwib3BhY2l0eVwiLCAxZS02KSxcclxuICAgICAgICBzaGFwZUVudGVyID0gY2VsbEVudGVyLmFwcGVuZChzaGFwZSkuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJzd2F0Y2hcIiksXHJcbiAgICAgICAgc2hhcGVzID0gY2VsbC5zZWxlY3QoXCJnLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGwgXCIgKyBzaGFwZSk7XHJcblxyXG4gICAgICAvL2FkZCBldmVudCBoYW5kbGVyc1xyXG4gICAgICBoZWxwZXIuZDNfYWRkRXZlbnRzKGNlbGxFbnRlciwgbGVnZW5kRGlzcGF0Y2hlcik7XHJcblxyXG4gICAgICBjZWxsLmV4aXQoKS50cmFuc2l0aW9uKCkuc3R5bGUoXCJvcGFjaXR5XCIsIDApLnJlbW92ZSgpO1xyXG5cclxuICAgICAgLy9jcmVhdGVzIHNoYXBlXHJcbiAgICAgIGlmIChzaGFwZSA9PT0gXCJsaW5lXCIpe1xyXG4gICAgICAgIGhlbHBlci5kM19kcmF3U2hhcGVzKHNoYXBlLCBzaGFwZXMsIDAsIHNoYXBlV2lkdGgpO1xyXG4gICAgICAgIHNoYXBlcy5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIHR5cGUuZmVhdHVyZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaGVscGVyLmQzX2RyYXdTaGFwZXMoc2hhcGUsIHNoYXBlcywgdHlwZS5mZWF0dXJlLCB0eXBlLmZlYXR1cmUsIHR5cGUuZmVhdHVyZSwgcGF0aCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGhlbHBlci5kM19hZGRUZXh0KGxlZ2VuZEcsIGNlbGxFbnRlciwgdHlwZS5sYWJlbHMsIGNsYXNzUHJlZml4KVxyXG5cclxuICAgICAgLy9zZXRzIHBsYWNlbWVudFxyXG4gICAgICB2YXIgdGV4dCA9IGNlbGwuc2VsZWN0KFwidGV4dFwiKSxcclxuICAgICAgICBzaGFwZVNpemUgPSBzaGFwZXNbMF0ubWFwKFxyXG4gICAgICAgICAgZnVuY3Rpb24oZCwgaSl7XHJcbiAgICAgICAgICAgIHZhciBiYm94ID0gZC5nZXRCQm94KClcclxuICAgICAgICAgICAgdmFyIHN0cm9rZSA9IHNjYWxlKHR5cGUuZGF0YVtpXSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2hhcGUgPT09IFwibGluZVwiICYmIG9yaWVudCA9PT0gXCJob3Jpem9udGFsXCIpIHtcclxuICAgICAgICAgICAgICBiYm94LmhlaWdodCA9IGJib3guaGVpZ2h0ICsgc3Ryb2tlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNoYXBlID09PSBcImxpbmVcIiAmJiBvcmllbnQgPT09IFwidmVydGljYWxcIil7XHJcbiAgICAgICAgICAgICAgYmJveC53aWR0aCA9IGJib3gud2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBiYm94O1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgdmFyIG1heEggPSBkMy5tYXgoc2hhcGVTaXplLCBmdW5jdGlvbihkKXsgcmV0dXJuIGQuaGVpZ2h0ICsgZC55OyB9KSxcclxuICAgICAgbWF4VyA9IGQzLm1heChzaGFwZVNpemUsIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC53aWR0aCArIGQueDsgfSk7XHJcblxyXG4gICAgICB2YXIgY2VsbFRyYW5zLFxyXG4gICAgICB0ZXh0VHJhbnMsXHJcbiAgICAgIHRleHRBbGlnbiA9IChsYWJlbEFsaWduID09IFwic3RhcnRcIikgPyAwIDogKGxhYmVsQWxpZ24gPT0gXCJtaWRkbGVcIikgPyAwLjUgOiAxO1xyXG5cclxuICAgICAgLy9wb3NpdGlvbnMgY2VsbHMgYW5kIHRleHRcclxuICAgICAgaWYgKG9yaWVudCA9PT0gXCJ2ZXJ0aWNhbFwiKXtcclxuXHJcbiAgICAgICAgY2VsbFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSBkMy5zdW0oc2hhcGVTaXplLnNsaWNlKDAsIGkgKyAxICksIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC5oZWlnaHQ7IH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoMCwgXCIgKyAoaGVpZ2h0ICsgaSpzaGFwZVBhZGRpbmcpICsgXCIpXCI7IH07XHJcblxyXG4gICAgICAgIHRleHRUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAobWF4VyArIGxhYmVsT2Zmc2V0KSArIFwiLFwiICtcclxuICAgICAgICAgIChzaGFwZVNpemVbaV0ueSArIHNoYXBlU2l6ZVtpXS5oZWlnaHQvMiArIDUpICsgXCIpXCI7IH07XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKG9yaWVudCA9PT0gXCJob3Jpem9udGFsXCIpe1xyXG4gICAgICAgIGNlbGxUcmFucyA9IGZ1bmN0aW9uKGQsaSkge1xyXG4gICAgICAgICAgICB2YXIgd2lkdGggPSBkMy5zdW0oc2hhcGVTaXplLnNsaWNlKDAsIGkgKyAxICksIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC53aWR0aDsgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArICh3aWR0aCArIGkqc2hhcGVQYWRkaW5nKSArIFwiLDApXCI7IH07XHJcblxyXG4gICAgICAgIHRleHRUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAoc2hhcGVTaXplW2ldLndpZHRoKnRleHRBbGlnbiAgKyBzaGFwZVNpemVbaV0ueCkgKyBcIixcIiArXHJcbiAgICAgICAgICAgICAgKG1heEggKyBsYWJlbE9mZnNldCApICsgXCIpXCI7IH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGhlbHBlci5kM19wbGFjZW1lbnQob3JpZW50LCBjZWxsLCBjZWxsVHJhbnMsIHRleHQsIHRleHRUcmFucywgbGFiZWxBbGlnbik7XHJcbiAgICAgIGhlbHBlci5kM190aXRsZShzdmcsIGxlZ2VuZEcsIHRpdGxlLCBjbGFzc1ByZWZpeCk7XHJcblxyXG4gICAgICBjZWxsLnRyYW5zaXRpb24oKS5zdHlsZShcIm9wYWNpdHlcIiwgMSk7XHJcblxyXG4gICAgfVxyXG5cclxuICBsZWdlbmQuc2NhbGUgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzY2FsZTtcclxuICAgIHNjYWxlID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmNlbGxzID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY2VsbHM7XHJcbiAgICBpZiAoXy5sZW5ndGggPiAxIHx8IF8gPj0gMiApe1xyXG4gICAgICBjZWxscyA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG5cclxuICBsZWdlbmQuc2hhcGUgPSBmdW5jdGlvbihfLCBkKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZTtcclxuICAgIGlmIChfID09IFwicmVjdFwiIHx8IF8gPT0gXCJjaXJjbGVcIiB8fCBfID09IFwibGluZVwiICl7XHJcbiAgICAgIHNoYXBlID0gXztcclxuICAgICAgcGF0aCA9IGQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5zaGFwZVdpZHRoID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGVXaWR0aDtcclxuICAgIHNoYXBlV2lkdGggPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlUGFkZGluZyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlUGFkZGluZztcclxuICAgIHNoYXBlUGFkZGluZyA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxzID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxzO1xyXG4gICAgbGFiZWxzID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsQWxpZ24gPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbEFsaWduO1xyXG4gICAgaWYgKF8gPT0gXCJzdGFydFwiIHx8IF8gPT0gXCJlbmRcIiB8fCBfID09IFwibWlkZGxlXCIpIHtcclxuICAgICAgbGFiZWxBbGlnbiA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbEZvcm1hdCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsRm9ybWF0O1xyXG4gICAgbGFiZWxGb3JtYXQgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxPZmZzZXQgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbE9mZnNldDtcclxuICAgIGxhYmVsT2Zmc2V0ID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbERlbGltaXRlciA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsRGVsaW1pdGVyO1xyXG4gICAgbGFiZWxEZWxpbWl0ZXIgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQub3JpZW50ID0gZnVuY3Rpb24oXyl7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBvcmllbnQ7XHJcbiAgICBfID0gXy50b0xvd2VyQ2FzZSgpO1xyXG4gICAgaWYgKF8gPT0gXCJob3Jpem9udGFsXCIgfHwgXyA9PSBcInZlcnRpY2FsXCIpIHtcclxuICAgICAgb3JpZW50ID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmFzY2VuZGluZyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGFzY2VuZGluZztcclxuICAgIGFzY2VuZGluZyA9ICEhXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmNsYXNzUHJlZml4ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY2xhc3NQcmVmaXg7XHJcbiAgICBjbGFzc1ByZWZpeCA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC50aXRsZSA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHRpdGxlO1xyXG4gICAgdGl0bGUgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBkMy5yZWJpbmQobGVnZW5kLCBsZWdlbmREaXNwYXRjaGVyLCBcIm9uXCIpO1xyXG5cclxuICByZXR1cm4gbGVnZW5kO1xyXG5cclxufTtcclxuIiwidmFyIGhlbHBlciA9IHJlcXVpcmUoJy4vbGVnZW5kJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XHJcblxyXG4gIHZhciBzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLFxyXG4gICAgc2hhcGUgPSBcInBhdGhcIixcclxuICAgIHNoYXBlV2lkdGggPSAxNSxcclxuICAgIHNoYXBlSGVpZ2h0ID0gMTUsXHJcbiAgICBzaGFwZVJhZGl1cyA9IDEwLFxyXG4gICAgc2hhcGVQYWRkaW5nID0gNSxcclxuICAgIGNlbGxzID0gWzVdLFxyXG4gICAgbGFiZWxzID0gW10sXHJcbiAgICBjbGFzc1ByZWZpeCA9IFwiXCIsXHJcbiAgICB1c2VDbGFzcyA9IGZhbHNlLFxyXG4gICAgdGl0bGUgPSBcIlwiLFxyXG4gICAgbGFiZWxGb3JtYXQgPSBkMy5mb3JtYXQoXCIuMDFmXCIpLFxyXG4gICAgbGFiZWxBbGlnbiA9IFwibWlkZGxlXCIsXHJcbiAgICBsYWJlbE9mZnNldCA9IDEwLFxyXG4gICAgbGFiZWxEZWxpbWl0ZXIgPSBcInRvXCIsXHJcbiAgICBvcmllbnQgPSBcInZlcnRpY2FsXCIsXHJcbiAgICBhc2NlbmRpbmcgPSBmYWxzZSxcclxuICAgIGxlZ2VuZERpc3BhdGNoZXIgPSBkMy5kaXNwYXRjaChcImNlbGxvdmVyXCIsIFwiY2VsbG91dFwiLCBcImNlbGxjbGlja1wiKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsZWdlbmQoc3ZnKXtcclxuXHJcbiAgICAgIHZhciB0eXBlID0gaGVscGVyLmQzX2NhbGNUeXBlKHNjYWxlLCBhc2NlbmRpbmcsIGNlbGxzLCBsYWJlbHMsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlciksXHJcbiAgICAgICAgbGVnZW5kRyA9IHN2Zy5zZWxlY3RBbGwoJ2cnKS5kYXRhKFtzY2FsZV0pO1xyXG5cclxuICAgICAgbGVnZW5kRy5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgY2xhc3NQcmVmaXggKyAnbGVnZW5kQ2VsbHMnKTtcclxuXHJcbiAgICAgIHZhciBjZWxsID0gbGVnZW5kRy5zZWxlY3RBbGwoXCIuXCIgKyBjbGFzc1ByZWZpeCArIFwiY2VsbFwiKS5kYXRhKHR5cGUuZGF0YSksXHJcbiAgICAgICAgY2VsbEVudGVyID0gY2VsbC5lbnRlcigpLmFwcGVuZChcImdcIiwgXCIuY2VsbFwiKS5hdHRyKFwiY2xhc3NcIiwgY2xhc3NQcmVmaXggKyBcImNlbGxcIikuc3R5bGUoXCJvcGFjaXR5XCIsIDFlLTYpLFxyXG4gICAgICAgIHNoYXBlRW50ZXIgPSBjZWxsRW50ZXIuYXBwZW5kKHNoYXBlKS5hdHRyKFwiY2xhc3NcIiwgY2xhc3NQcmVmaXggKyBcInN3YXRjaFwiKSxcclxuICAgICAgICBzaGFwZXMgPSBjZWxsLnNlbGVjdChcImcuXCIgKyBjbGFzc1ByZWZpeCArIFwiY2VsbCBcIiArIHNoYXBlKTtcclxuXHJcbiAgICAgIC8vYWRkIGV2ZW50IGhhbmRsZXJzXHJcbiAgICAgIGhlbHBlci5kM19hZGRFdmVudHMoY2VsbEVudGVyLCBsZWdlbmREaXNwYXRjaGVyKTtcclxuXHJcbiAgICAgIC8vcmVtb3ZlIG9sZCBzaGFwZXNcclxuICAgICAgY2VsbC5leGl0KCkudHJhbnNpdGlvbigpLnN0eWxlKFwib3BhY2l0eVwiLCAwKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgIGhlbHBlci5kM19kcmF3U2hhcGVzKHNoYXBlLCBzaGFwZXMsIHNoYXBlSGVpZ2h0LCBzaGFwZVdpZHRoLCBzaGFwZVJhZGl1cywgdHlwZS5mZWF0dXJlKTtcclxuICAgICAgaGVscGVyLmQzX2FkZFRleHQobGVnZW5kRywgY2VsbEVudGVyLCB0eXBlLmxhYmVscywgY2xhc3NQcmVmaXgpXHJcblxyXG4gICAgICAvLyBzZXRzIHBsYWNlbWVudFxyXG4gICAgICB2YXIgdGV4dCA9IGNlbGwuc2VsZWN0KFwidGV4dFwiKSxcclxuICAgICAgICBzaGFwZVNpemUgPSBzaGFwZXNbMF0ubWFwKCBmdW5jdGlvbihkKXsgcmV0dXJuIGQuZ2V0QkJveCgpOyB9KTtcclxuXHJcbiAgICAgIHZhciBtYXhIID0gZDMubWF4KHNoYXBlU2l6ZSwgZnVuY3Rpb24oZCl7IHJldHVybiBkLmhlaWdodDsgfSksXHJcbiAgICAgIG1heFcgPSBkMy5tYXgoc2hhcGVTaXplLCBmdW5jdGlvbihkKXsgcmV0dXJuIGQud2lkdGg7IH0pO1xyXG5cclxuICAgICAgdmFyIGNlbGxUcmFucyxcclxuICAgICAgdGV4dFRyYW5zLFxyXG4gICAgICB0ZXh0QWxpZ24gPSAobGFiZWxBbGlnbiA9PSBcInN0YXJ0XCIpID8gMCA6IChsYWJlbEFsaWduID09IFwibWlkZGxlXCIpID8gMC41IDogMTtcclxuXHJcbiAgICAgIC8vcG9zaXRpb25zIGNlbGxzIGFuZCB0ZXh0XHJcbiAgICAgIGlmIChvcmllbnQgPT09IFwidmVydGljYWxcIil7XHJcbiAgICAgICAgY2VsbFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZSgwLCBcIiArIChpICogKG1heEggKyBzaGFwZVBhZGRpbmcpKSArIFwiKVwiOyB9O1xyXG4gICAgICAgIHRleHRUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAobWF4VyArIGxhYmVsT2Zmc2V0KSArIFwiLFwiICtcclxuICAgICAgICAgICAgICAoc2hhcGVTaXplW2ldLnkgKyBzaGFwZVNpemVbaV0uaGVpZ2h0LzIgKyA1KSArIFwiKVwiOyB9O1xyXG5cclxuICAgICAgfSBlbHNlIGlmIChvcmllbnQgPT09IFwiaG9yaXpvbnRhbFwiKXtcclxuICAgICAgICBjZWxsVHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKGkgKiAobWF4VyArIHNoYXBlUGFkZGluZykpICsgXCIsMClcIjsgfTtcclxuICAgICAgICB0ZXh0VHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKHNoYXBlU2l6ZVtpXS53aWR0aCp0ZXh0QWxpZ24gICsgc2hhcGVTaXplW2ldLngpICsgXCIsXCIgK1xyXG4gICAgICAgICAgICAgIChtYXhIICsgbGFiZWxPZmZzZXQgKSArIFwiKVwiOyB9O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBoZWxwZXIuZDNfcGxhY2VtZW50KG9yaWVudCwgY2VsbCwgY2VsbFRyYW5zLCB0ZXh0LCB0ZXh0VHJhbnMsIGxhYmVsQWxpZ24pO1xyXG4gICAgICBoZWxwZXIuZDNfdGl0bGUoc3ZnLCBsZWdlbmRHLCB0aXRsZSwgY2xhc3NQcmVmaXgpO1xyXG4gICAgICBjZWxsLnRyYW5zaXRpb24oKS5zdHlsZShcIm9wYWNpdHlcIiwgMSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgbGVnZW5kLnNjYWxlID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2NhbGU7XHJcbiAgICBzY2FsZSA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5jZWxscyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGNlbGxzO1xyXG4gICAgaWYgKF8ubGVuZ3RoID4gMSB8fCBfID49IDIgKXtcclxuICAgICAgY2VsbHMgPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuc2hhcGVQYWRkaW5nID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGVQYWRkaW5nO1xyXG4gICAgc2hhcGVQYWRkaW5nID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbHMgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbHM7XHJcbiAgICBsYWJlbHMgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxBbGlnbiA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsQWxpZ247XHJcbiAgICBpZiAoXyA9PSBcInN0YXJ0XCIgfHwgXyA9PSBcImVuZFwiIHx8IF8gPT0gXCJtaWRkbGVcIikge1xyXG4gICAgICBsYWJlbEFsaWduID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsRm9ybWF0ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxGb3JtYXQ7XHJcbiAgICBsYWJlbEZvcm1hdCA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbE9mZnNldCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsT2Zmc2V0O1xyXG4gICAgbGFiZWxPZmZzZXQgPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsRGVsaW1pdGVyID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxEZWxpbWl0ZXI7XHJcbiAgICBsYWJlbERlbGltaXRlciA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5vcmllbnQgPSBmdW5jdGlvbihfKXtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIG9yaWVudDtcclxuICAgIF8gPSBfLnRvTG93ZXJDYXNlKCk7XHJcbiAgICBpZiAoXyA9PSBcImhvcml6b250YWxcIiB8fCBfID09IFwidmVydGljYWxcIikge1xyXG4gICAgICBvcmllbnQgPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuYXNjZW5kaW5nID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gYXNjZW5kaW5nO1xyXG4gICAgYXNjZW5kaW5nID0gISFfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuY2xhc3NQcmVmaXggPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBjbGFzc1ByZWZpeDtcclxuICAgIGNsYXNzUHJlZml4ID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnRpdGxlID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdGl0bGU7XHJcbiAgICB0aXRsZSA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGQzLnJlYmluZChsZWdlbmQsIGxlZ2VuZERpc3BhdGNoZXIsIFwib25cIik7XHJcblxyXG4gIHJldHVybiBsZWdlbmQ7XHJcblxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG4vKipcclxuICogKipbR2F1c3NpYW4gZXJyb3IgZnVuY3Rpb25dKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRXJyb3JfZnVuY3Rpb24pKipcclxuICpcclxuICogVGhlIGBlcnJvckZ1bmN0aW9uKHgvKHNkICogTWF0aC5zcXJ0KDIpKSlgIGlzIHRoZSBwcm9iYWJpbGl0eSB0aGF0IGEgdmFsdWUgaW4gYVxyXG4gKiBub3JtYWwgZGlzdHJpYnV0aW9uIHdpdGggc3RhbmRhcmQgZGV2aWF0aW9uIHNkIGlzIHdpdGhpbiB4IG9mIHRoZSBtZWFuLlxyXG4gKlxyXG4gKiBUaGlzIGZ1bmN0aW9uIHJldHVybnMgYSBudW1lcmljYWwgYXBwcm94aW1hdGlvbiB0byB0aGUgZXhhY3QgdmFsdWUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4IGlucHV0XHJcbiAqIEByZXR1cm4ge251bWJlcn0gZXJyb3IgZXN0aW1hdGlvblxyXG4gKiBAZXhhbXBsZVxyXG4gKiBlcnJvckZ1bmN0aW9uKDEpOyAvLz0gMC44NDI3XHJcbiAqL1xyXG5mdW5jdGlvbiBlcnJvckZ1bmN0aW9uKHgvKjogbnVtYmVyICovKS8qOiBudW1iZXIgKi8ge1xyXG4gICAgdmFyIHQgPSAxIC8gKDEgKyAwLjUgKiBNYXRoLmFicyh4KSk7XHJcbiAgICB2YXIgdGF1ID0gdCAqIE1hdGguZXhwKC1NYXRoLnBvdyh4LCAyKSAtXHJcbiAgICAgICAgMS4yNjU1MTIyMyArXHJcbiAgICAgICAgMS4wMDAwMjM2OCAqIHQgK1xyXG4gICAgICAgIDAuMzc0MDkxOTYgKiBNYXRoLnBvdyh0LCAyKSArXHJcbiAgICAgICAgMC4wOTY3ODQxOCAqIE1hdGgucG93KHQsIDMpIC1cclxuICAgICAgICAwLjE4NjI4ODA2ICogTWF0aC5wb3codCwgNCkgK1xyXG4gICAgICAgIDAuMjc4ODY4MDcgKiBNYXRoLnBvdyh0LCA1KSAtXHJcbiAgICAgICAgMS4xMzUyMDM5OCAqIE1hdGgucG93KHQsIDYpICtcclxuICAgICAgICAxLjQ4ODUxNTg3ICogTWF0aC5wb3codCwgNykgLVxyXG4gICAgICAgIDAuODIyMTUyMjMgKiBNYXRoLnBvdyh0LCA4KSArXHJcbiAgICAgICAgMC4xNzA4NzI3NyAqIE1hdGgucG93KHQsIDkpKTtcclxuICAgIGlmICh4ID49IDApIHtcclxuICAgICAgICByZXR1cm4gMSAtIHRhdTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRhdSAtIDE7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZXJyb3JGdW5jdGlvbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxuLyoqXHJcbiAqIFtTaW1wbGUgbGluZWFyIHJlZ3Jlc3Npb25dKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvU2ltcGxlX2xpbmVhcl9yZWdyZXNzaW9uKVxyXG4gKiBpcyBhIHNpbXBsZSB3YXkgdG8gZmluZCBhIGZpdHRlZCBsaW5lXHJcbiAqIGJldHdlZW4gYSBzZXQgb2YgY29vcmRpbmF0ZXMuIFRoaXMgYWxnb3JpdGhtIGZpbmRzIHRoZSBzbG9wZSBhbmQgeS1pbnRlcmNlcHQgb2YgYSByZWdyZXNzaW9uIGxpbmVcclxuICogdXNpbmcgdGhlIGxlYXN0IHN1bSBvZiBzcXVhcmVzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PEFycmF5PG51bWJlcj4+fSBkYXRhIGFuIGFycmF5IG9mIHR3by1lbGVtZW50IG9mIGFycmF5cyxcclxuICogbGlrZSBgW1swLCAxXSwgWzIsIDNdXWBcclxuICogQHJldHVybnMge09iamVjdH0gb2JqZWN0IGNvbnRhaW5pbmcgc2xvcGUgYW5kIGludGVyc2VjdCBvZiByZWdyZXNzaW9uIGxpbmVcclxuICogQGV4YW1wbGVcclxuICogbGluZWFyUmVncmVzc2lvbihbWzAsIDBdLCBbMSwgMV1dKTsgLy8geyBtOiAxLCBiOiAwIH1cclxuICovXHJcbmZ1bmN0aW9uIGxpbmVhclJlZ3Jlc3Npb24oZGF0YS8qOiBBcnJheTxBcnJheTxudW1iZXI+PiAqLykvKjogeyBtOiBudW1iZXIsIGI6IG51bWJlciB9ICovIHtcclxuXHJcbiAgICB2YXIgbSwgYjtcclxuXHJcbiAgICAvLyBTdG9yZSBkYXRhIGxlbmd0aCBpbiBhIGxvY2FsIHZhcmlhYmxlIHRvIHJlZHVjZVxyXG4gICAgLy8gcmVwZWF0ZWQgb2JqZWN0IHByb3BlcnR5IGxvb2t1cHNcclxuICAgIHZhciBkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGg7XHJcblxyXG4gICAgLy9pZiB0aGVyZSdzIG9ubHkgb25lIHBvaW50LCBhcmJpdHJhcmlseSBjaG9vc2UgYSBzbG9wZSBvZiAwXHJcbiAgICAvL2FuZCBhIHktaW50ZXJjZXB0IG9mIHdoYXRldmVyIHRoZSB5IG9mIHRoZSBpbml0aWFsIHBvaW50IGlzXHJcbiAgICBpZiAoZGF0YUxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIG0gPSAwO1xyXG4gICAgICAgIGIgPSBkYXRhWzBdWzFdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBJbml0aWFsaXplIG91ciBzdW1zIGFuZCBzY29wZSB0aGUgYG1gIGFuZCBgYmBcclxuICAgICAgICAvLyB2YXJpYWJsZXMgdGhhdCBkZWZpbmUgdGhlIGxpbmUuXHJcbiAgICAgICAgdmFyIHN1bVggPSAwLCBzdW1ZID0gMCxcclxuICAgICAgICAgICAgc3VtWFggPSAwLCBzdW1YWSA9IDA7XHJcblxyXG4gICAgICAgIC8vIFVzZSBsb2NhbCB2YXJpYWJsZXMgdG8gZ3JhYiBwb2ludCB2YWx1ZXNcclxuICAgICAgICAvLyB3aXRoIG1pbmltYWwgb2JqZWN0IHByb3BlcnR5IGxvb2t1cHNcclxuICAgICAgICB2YXIgcG9pbnQsIHgsIHk7XHJcblxyXG4gICAgICAgIC8vIEdhdGhlciB0aGUgc3VtIG9mIGFsbCB4IHZhbHVlcywgdGhlIHN1bSBvZiBhbGxcclxuICAgICAgICAvLyB5IHZhbHVlcywgYW5kIHRoZSBzdW0gb2YgeF4yIGFuZCAoeCp5KSBmb3IgZWFjaFxyXG4gICAgICAgIC8vIHZhbHVlLlxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gSW4gbWF0aCBub3RhdGlvbiwgdGhlc2Ugd291bGQgYmUgU1NfeCwgU1NfeSwgU1NfeHgsIGFuZCBTU194eVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YUxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHBvaW50ID0gZGF0YVtpXTtcclxuICAgICAgICAgICAgeCA9IHBvaW50WzBdO1xyXG4gICAgICAgICAgICB5ID0gcG9pbnRbMV07XHJcblxyXG4gICAgICAgICAgICBzdW1YICs9IHg7XHJcbiAgICAgICAgICAgIHN1bVkgKz0geTtcclxuXHJcbiAgICAgICAgICAgIHN1bVhYICs9IHggKiB4O1xyXG4gICAgICAgICAgICBzdW1YWSArPSB4ICogeTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGBtYCBpcyB0aGUgc2xvcGUgb2YgdGhlIHJlZ3Jlc3Npb24gbGluZVxyXG4gICAgICAgIG0gPSAoKGRhdGFMZW5ndGggKiBzdW1YWSkgLSAoc3VtWCAqIHN1bVkpKSAvXHJcbiAgICAgICAgICAgICgoZGF0YUxlbmd0aCAqIHN1bVhYKSAtIChzdW1YICogc3VtWCkpO1xyXG5cclxuICAgICAgICAvLyBgYmAgaXMgdGhlIHktaW50ZXJjZXB0IG9mIHRoZSBsaW5lLlxyXG4gICAgICAgIGIgPSAoc3VtWSAvIGRhdGFMZW5ndGgpIC0gKChtICogc3VtWCkgLyBkYXRhTGVuZ3RoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZXR1cm4gYm90aCB2YWx1ZXMgYXMgYW4gb2JqZWN0LlxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBtOiBtLFxyXG4gICAgICAgIGI6IGJcclxuICAgIH07XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxpbmVhclJlZ3Jlc3Npb247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbi8qKlxyXG4gKiBHaXZlbiB0aGUgb3V0cHV0IG9mIGBsaW5lYXJSZWdyZXNzaW9uYDogYW4gb2JqZWN0XHJcbiAqIHdpdGggYG1gIGFuZCBgYmAgdmFsdWVzIGluZGljYXRpbmcgc2xvcGUgYW5kIGludGVyY2VwdCxcclxuICogcmVzcGVjdGl2ZWx5LCBnZW5lcmF0ZSBhIGxpbmUgZnVuY3Rpb24gdGhhdCB0cmFuc2xhdGVzXHJcbiAqIHggdmFsdWVzIGludG8geSB2YWx1ZXMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYiBvYmplY3Qgd2l0aCBgbWAgYW5kIGBiYCBtZW1iZXJzLCByZXByZXNlbnRpbmdcclxuICogc2xvcGUgYW5kIGludGVyc2VjdCBvZiBkZXNpcmVkIGxpbmVcclxuICogQHJldHVybnMge0Z1bmN0aW9ufSBtZXRob2QgdGhhdCBjb21wdXRlcyB5LXZhbHVlIGF0IGFueSBnaXZlblxyXG4gKiB4LXZhbHVlIG9uIHRoZSBsaW5lLlxyXG4gKiBAZXhhbXBsZVxyXG4gKiB2YXIgbCA9IGxpbmVhclJlZ3Jlc3Npb25MaW5lKGxpbmVhclJlZ3Jlc3Npb24oW1swLCAwXSwgWzEsIDFdXSkpO1xyXG4gKiBsKDApIC8vPSAwXHJcbiAqIGwoMikgLy89IDJcclxuICovXHJcbmZ1bmN0aW9uIGxpbmVhclJlZ3Jlc3Npb25MaW5lKG1iLyo6IHsgYjogbnVtYmVyLCBtOiBudW1iZXIgfSovKS8qOiBGdW5jdGlvbiAqLyB7XHJcbiAgICAvLyBSZXR1cm4gYSBmdW5jdGlvbiB0aGF0IGNvbXB1dGVzIGEgYHlgIHZhbHVlIGZvciBlYWNoXHJcbiAgICAvLyB4IHZhbHVlIGl0IGlzIGdpdmVuLCBiYXNlZCBvbiB0aGUgdmFsdWVzIG9mIGBiYCBhbmQgYGFgXHJcbiAgICAvLyB0aGF0IHdlIGp1c3QgY29tcHV0ZWQuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24oeCkge1xyXG4gICAgICAgIHJldHVybiBtYi5iICsgKG1iLm0gKiB4KTtcclxuICAgIH07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGluZWFyUmVncmVzc2lvbkxpbmU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBzdW0gPSByZXF1aXJlKCcuL3N1bScpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBtZWFuLCBfYWxzbyBrbm93biBhcyBhdmVyYWdlXyxcclxuICogaXMgdGhlIHN1bSBvZiBhbGwgdmFsdWVzIG92ZXIgdGhlIG51bWJlciBvZiB2YWx1ZXMuXHJcbiAqIFRoaXMgaXMgYSBbbWVhc3VyZSBvZiBjZW50cmFsIHRlbmRlbmN5XShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9DZW50cmFsX3RlbmRlbmN5KTpcclxuICogYSBtZXRob2Qgb2YgZmluZGluZyBhIHR5cGljYWwgb3IgY2VudHJhbCB2YWx1ZSBvZiBhIHNldCBvZiBudW1iZXJzLlxyXG4gKlxyXG4gKiBUaGlzIHJ1bnMgb24gYE8obilgLCBsaW5lYXIgdGltZSBpbiByZXNwZWN0IHRvIHRoZSBhcnJheVxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggaW5wdXQgdmFsdWVzXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IG1lYW5cclxuICogQGV4YW1wbGVcclxuICogY29uc29sZS5sb2cobWVhbihbMCwgMTBdKSk7IC8vIDVcclxuICovXHJcbmZ1bmN0aW9uIG1lYW4oeCAvKjogQXJyYXk8bnVtYmVyPiAqLykvKjpudW1iZXIqLyB7XHJcbiAgICAvLyBUaGUgbWVhbiBvZiBubyBudW1iZXJzIGlzIG51bGxcclxuICAgIGlmICh4Lmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gTmFOOyB9XHJcblxyXG4gICAgcmV0dXJuIHN1bSh4KSAvIHgubGVuZ3RoO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1lYW47XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBzYW1wbGVDb3ZhcmlhbmNlID0gcmVxdWlyZSgnLi9zYW1wbGVfY292YXJpYW5jZScpO1xyXG52YXIgc2FtcGxlU3RhbmRhcmREZXZpYXRpb24gPSByZXF1aXJlKCcuL3NhbXBsZV9zdGFuZGFyZF9kZXZpYXRpb24nKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgW2NvcnJlbGF0aW9uXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0NvcnJlbGF0aW9uX2FuZF9kZXBlbmRlbmNlKSBpc1xyXG4gKiBhIG1lYXN1cmUgb2YgaG93IGNvcnJlbGF0ZWQgdHdvIGRhdGFzZXRzIGFyZSwgYmV0d2VlbiAtMSBhbmQgMVxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggZmlyc3QgaW5wdXRcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB5IHNlY29uZCBpbnB1dFxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBzYW1wbGUgY29ycmVsYXRpb25cclxuICogQGV4YW1wbGVcclxuICogdmFyIGEgPSBbMSwgMiwgMywgNCwgNSwgNl07XHJcbiAqIHZhciBiID0gWzIsIDIsIDMsIDQsIDUsIDYwXTtcclxuICogc2FtcGxlQ29ycmVsYXRpb24oYSwgYik7IC8vPSAwLjY5MVxyXG4gKi9cclxuZnVuY3Rpb24gc2FtcGxlQ29ycmVsYXRpb24oeC8qOiBBcnJheTxudW1iZXI+ICovLCB5Lyo6IEFycmF5PG51bWJlcj4gKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgdmFyIGNvdiA9IHNhbXBsZUNvdmFyaWFuY2UoeCwgeSksXHJcbiAgICAgICAgeHN0ZCA9IHNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uKHgpLFxyXG4gICAgICAgIHlzdGQgPSBzYW1wbGVTdGFuZGFyZERldmlhdGlvbih5KTtcclxuXHJcbiAgICByZXR1cm4gY292IC8geHN0ZCAvIHlzdGQ7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2FtcGxlQ29ycmVsYXRpb247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBtZWFuID0gcmVxdWlyZSgnLi9tZWFuJyk7XHJcblxyXG4vKipcclxuICogW1NhbXBsZSBjb3ZhcmlhbmNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TYW1wbGVfbWVhbl9hbmRfc2FtcGxlQ292YXJpYW5jZSkgb2YgdHdvIGRhdGFzZXRzOlxyXG4gKiBob3cgbXVjaCBkbyB0aGUgdHdvIGRhdGFzZXRzIG1vdmUgdG9nZXRoZXI/XHJcbiAqIHggYW5kIHkgYXJlIHR3byBkYXRhc2V0cywgcmVwcmVzZW50ZWQgYXMgYXJyYXlzIG9mIG51bWJlcnMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBmaXJzdCBpbnB1dFxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHkgc2Vjb25kIGlucHV0XHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHNhbXBsZSBjb3ZhcmlhbmNlXHJcbiAqIEBleGFtcGxlXHJcbiAqIHZhciB4ID0gWzEsIDIsIDMsIDQsIDUsIDZdO1xyXG4gKiB2YXIgeSA9IFs2LCA1LCA0LCAzLCAyLCAxXTtcclxuICogc2FtcGxlQ292YXJpYW5jZSh4LCB5KTsgLy89IC0zLjVcclxuICovXHJcbmZ1bmN0aW9uIHNhbXBsZUNvdmFyaWFuY2UoeCAvKjpBcnJheTxudW1iZXI+Ki8sIHkgLyo6QXJyYXk8bnVtYmVyPiovKS8qOm51bWJlciovIHtcclxuXHJcbiAgICAvLyBUaGUgdHdvIGRhdGFzZXRzIG11c3QgaGF2ZSB0aGUgc2FtZSBsZW5ndGggd2hpY2ggbXVzdCBiZSBtb3JlIHRoYW4gMVxyXG4gICAgaWYgKHgubGVuZ3RoIDw9IDEgfHwgeC5sZW5ndGggIT09IHkubGVuZ3RoKSB7XHJcbiAgICAgICAgcmV0dXJuIE5hTjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBkZXRlcm1pbmUgdGhlIG1lYW4gb2YgZWFjaCBkYXRhc2V0IHNvIHRoYXQgd2UgY2FuIGp1ZGdlIGVhY2hcclxuICAgIC8vIHZhbHVlIG9mIHRoZSBkYXRhc2V0IGZhaXJseSBhcyB0aGUgZGlmZmVyZW5jZSBmcm9tIHRoZSBtZWFuLiB0aGlzXHJcbiAgICAvLyB3YXksIGlmIG9uZSBkYXRhc2V0IGlzIFsxLCAyLCAzXSBhbmQgWzIsIDMsIDRdLCB0aGVpciBjb3ZhcmlhbmNlXHJcbiAgICAvLyBkb2VzIG5vdCBzdWZmZXIgYmVjYXVzZSBvZiB0aGUgZGlmZmVyZW5jZSBpbiBhYnNvbHV0ZSB2YWx1ZXNcclxuICAgIHZhciB4bWVhbiA9IG1lYW4oeCksXHJcbiAgICAgICAgeW1lYW4gPSBtZWFuKHkpLFxyXG4gICAgICAgIHN1bSA9IDA7XHJcblxyXG4gICAgLy8gZm9yIGVhY2ggcGFpciBvZiB2YWx1ZXMsIHRoZSBjb3ZhcmlhbmNlIGluY3JlYXNlcyB3aGVuIHRoZWlyXHJcbiAgICAvLyBkaWZmZXJlbmNlIGZyb20gdGhlIG1lYW4gaXMgYXNzb2NpYXRlZCAtIGlmIGJvdGggYXJlIHdlbGwgYWJvdmVcclxuICAgIC8vIG9yIGlmIGJvdGggYXJlIHdlbGwgYmVsb3dcclxuICAgIC8vIHRoZSBtZWFuLCB0aGUgY292YXJpYW5jZSBpbmNyZWFzZXMgc2lnbmlmaWNhbnRseS5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHN1bSArPSAoeFtpXSAtIHhtZWFuKSAqICh5W2ldIC0geW1lYW4pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRoaXMgaXMgQmVzc2VscycgQ29ycmVjdGlvbjogYW4gYWRqdXN0bWVudCBtYWRlIHRvIHNhbXBsZSBzdGF0aXN0aWNzXHJcbiAgICAvLyB0aGF0IGFsbG93cyBmb3IgdGhlIHJlZHVjZWQgZGVncmVlIG9mIGZyZWVkb20gZW50YWlsZWQgaW4gY2FsY3VsYXRpbmdcclxuICAgIC8vIHZhbHVlcyBmcm9tIHNhbXBsZXMgcmF0aGVyIHRoYW4gY29tcGxldGUgcG9wdWxhdGlvbnMuXHJcbiAgICB2YXIgYmVzc2Vsc0NvcnJlY3Rpb24gPSB4Lmxlbmd0aCAtIDE7XHJcblxyXG4gICAgLy8gdGhlIGNvdmFyaWFuY2UgaXMgd2VpZ2h0ZWQgYnkgdGhlIGxlbmd0aCBvZiB0aGUgZGF0YXNldHMuXHJcbiAgICByZXR1cm4gc3VtIC8gYmVzc2Vsc0NvcnJlY3Rpb247XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2FtcGxlQ292YXJpYW5jZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIHNhbXBsZVZhcmlhbmNlID0gcmVxdWlyZSgnLi9zYW1wbGVfdmFyaWFuY2UnKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgW3N0YW5kYXJkIGRldmlhdGlvbl0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TdGFuZGFyZF9kZXZpYXRpb24pXHJcbiAqIGlzIHRoZSBzcXVhcmUgcm9vdCBvZiB0aGUgdmFyaWFuY2UuXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBpbnB1dCBhcnJheVxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBzYW1wbGUgc3RhbmRhcmQgZGV2aWF0aW9uXHJcbiAqIEBleGFtcGxlXHJcbiAqIHNzLnNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uKFsyLCA0LCA0LCA0LCA1LCA1LCA3LCA5XSk7XHJcbiAqIC8vPSAyLjEzOFxyXG4gKi9cclxuZnVuY3Rpb24gc2FtcGxlU3RhbmRhcmREZXZpYXRpb24oeC8qOkFycmF5PG51bWJlcj4qLykvKjpudW1iZXIqLyB7XHJcbiAgICAvLyBUaGUgc3RhbmRhcmQgZGV2aWF0aW9uIG9mIG5vIG51bWJlcnMgaXMgbnVsbFxyXG4gICAgdmFyIHNhbXBsZVZhcmlhbmNlWCA9IHNhbXBsZVZhcmlhbmNlKHgpO1xyXG4gICAgaWYgKGlzTmFOKHNhbXBsZVZhcmlhbmNlWCkpIHsgcmV0dXJuIE5hTjsgfVxyXG4gICAgcmV0dXJuIE1hdGguc3FydChzYW1wbGVWYXJpYW5jZVgpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgc3VtTnRoUG93ZXJEZXZpYXRpb25zID0gcmVxdWlyZSgnLi9zdW1fbnRoX3Bvd2VyX2RldmlhdGlvbnMnKTtcclxuXHJcbi8qXHJcbiAqIFRoZSBbc2FtcGxlIHZhcmlhbmNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9WYXJpYW5jZSNTYW1wbGVfdmFyaWFuY2UpXHJcbiAqIGlzIHRoZSBzdW0gb2Ygc3F1YXJlZCBkZXZpYXRpb25zIGZyb20gdGhlIG1lYW4uIFRoZSBzYW1wbGUgdmFyaWFuY2VcclxuICogaXMgZGlzdGluZ3Vpc2hlZCBmcm9tIHRoZSB2YXJpYW5jZSBieSB0aGUgdXNhZ2Ugb2YgW0Jlc3NlbCdzIENvcnJlY3Rpb25dKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Jlc3NlbCdzX2NvcnJlY3Rpb24pOlxyXG4gKiBpbnN0ZWFkIG9mIGRpdmlkaW5nIHRoZSBzdW0gb2Ygc3F1YXJlZCBkZXZpYXRpb25zIGJ5IHRoZSBsZW5ndGggb2YgdGhlIGlucHV0LFxyXG4gKiBpdCBpcyBkaXZpZGVkIGJ5IHRoZSBsZW5ndGggbWludXMgb25lLiBUaGlzIGNvcnJlY3RzIHRoZSBiaWFzIGluIGVzdGltYXRpbmdcclxuICogYSB2YWx1ZSBmcm9tIGEgc2V0IHRoYXQgeW91IGRvbid0IGtub3cgaWYgZnVsbC5cclxuICpcclxuICogUmVmZXJlbmNlczpcclxuICogKiBbV29sZnJhbSBNYXRoV29ybGQgb24gU2FtcGxlIFZhcmlhbmNlXShodHRwOi8vbWF0aHdvcmxkLndvbGZyYW0uY29tL1NhbXBsZVZhcmlhbmNlLmh0bWwpXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBpbnB1dCBhcnJheVxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IHNhbXBsZSB2YXJpYW5jZVxyXG4gKiBAZXhhbXBsZVxyXG4gKiBzYW1wbGVWYXJpYW5jZShbMSwgMiwgMywgNCwgNV0pOyAvLz0gMi41XHJcbiAqL1xyXG5mdW5jdGlvbiBzYW1wbGVWYXJpYW5jZSh4IC8qOiBBcnJheTxudW1iZXI+ICovKS8qOm51bWJlciovIHtcclxuICAgIC8vIFRoZSB2YXJpYW5jZSBvZiBubyBudW1iZXJzIGlzIG51bGxcclxuICAgIGlmICh4Lmxlbmd0aCA8PSAxKSB7IHJldHVybiBOYU47IH1cclxuXHJcbiAgICB2YXIgc3VtU3F1YXJlZERldmlhdGlvbnNWYWx1ZSA9IHN1bU50aFBvd2VyRGV2aWF0aW9ucyh4LCAyKTtcclxuXHJcbiAgICAvLyB0aGlzIGlzIEJlc3NlbHMnIENvcnJlY3Rpb246IGFuIGFkanVzdG1lbnQgbWFkZSB0byBzYW1wbGUgc3RhdGlzdGljc1xyXG4gICAgLy8gdGhhdCBhbGxvd3MgZm9yIHRoZSByZWR1Y2VkIGRlZ3JlZSBvZiBmcmVlZG9tIGVudGFpbGVkIGluIGNhbGN1bGF0aW5nXHJcbiAgICAvLyB2YWx1ZXMgZnJvbSBzYW1wbGVzIHJhdGhlciB0aGFuIGNvbXBsZXRlIHBvcHVsYXRpb25zLlxyXG4gICAgdmFyIGJlc3NlbHNDb3JyZWN0aW9uID0geC5sZW5ndGggLSAxO1xyXG5cclxuICAgIC8vIEZpbmQgdGhlIG1lYW4gdmFsdWUgb2YgdGhhdCBsaXN0XHJcbiAgICByZXR1cm4gc3VtU3F1YXJlZERldmlhdGlvbnNWYWx1ZSAvIGJlc3NlbHNDb3JyZWN0aW9uO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNhbXBsZVZhcmlhbmNlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgdmFyaWFuY2UgPSByZXF1aXJlKCcuL3ZhcmlhbmNlJyk7XHJcblxyXG4vKipcclxuICogVGhlIFtzdGFuZGFyZCBkZXZpYXRpb25dKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvU3RhbmRhcmRfZGV2aWF0aW9uKVxyXG4gKiBpcyB0aGUgc3F1YXJlIHJvb3Qgb2YgdGhlIHZhcmlhbmNlLiBJdCdzIHVzZWZ1bCBmb3IgbWVhc3VyaW5nIHRoZSBhbW91bnRcclxuICogb2YgdmFyaWF0aW9uIG9yIGRpc3BlcnNpb24gaW4gYSBzZXQgb2YgdmFsdWVzLlxyXG4gKlxyXG4gKiBTdGFuZGFyZCBkZXZpYXRpb24gaXMgb25seSBhcHByb3ByaWF0ZSBmb3IgZnVsbC1wb3B1bGF0aW9uIGtub3dsZWRnZTogZm9yXHJcbiAqIHNhbXBsZXMgb2YgYSBwb3B1bGF0aW9uLCB7QGxpbmsgc2FtcGxlU3RhbmRhcmREZXZpYXRpb259IGlzXHJcbiAqIG1vcmUgYXBwcm9wcmlhdGUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBpbnB1dFxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBzdGFuZGFyZCBkZXZpYXRpb25cclxuICogQGV4YW1wbGVcclxuICogdmFyIHNjb3JlcyA9IFsyLCA0LCA0LCA0LCA1LCA1LCA3LCA5XTtcclxuICogdmFyaWFuY2Uoc2NvcmVzKTsgLy89IDRcclxuICogc3RhbmRhcmREZXZpYXRpb24oc2NvcmVzKTsgLy89IDJcclxuICovXHJcbmZ1bmN0aW9uIHN0YW5kYXJkRGV2aWF0aW9uKHggLyo6IEFycmF5PG51bWJlcj4gKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgLy8gVGhlIHN0YW5kYXJkIGRldmlhdGlvbiBvZiBubyBudW1iZXJzIGlzIG51bGxcclxuICAgIHZhciB2ID0gdmFyaWFuY2UoeCk7XHJcbiAgICBpZiAoaXNOYU4odikpIHsgcmV0dXJuIDA7IH1cclxuICAgIHJldHVybiBNYXRoLnNxcnQodik7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc3RhbmRhcmREZXZpYXRpb247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbi8qKlxyXG4gKiBPdXIgZGVmYXVsdCBzdW0gaXMgdGhlIFtLYWhhbiBzdW1tYXRpb24gYWxnb3JpdGhtXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9LYWhhbl9zdW1tYXRpb25fYWxnb3JpdGhtKSBpc1xyXG4gKiBhIG1ldGhvZCBmb3IgY29tcHV0aW5nIHRoZSBzdW0gb2YgYSBsaXN0IG9mIG51bWJlcnMgd2hpbGUgY29ycmVjdGluZ1xyXG4gKiBmb3IgZmxvYXRpbmctcG9pbnQgZXJyb3JzLiBUcmFkaXRpb25hbGx5LCBzdW1zIGFyZSBjYWxjdWxhdGVkIGFzIG1hbnlcclxuICogc3VjY2Vzc2l2ZSBhZGRpdGlvbnMsIGVhY2ggb25lIHdpdGggaXRzIG93biBmbG9hdGluZy1wb2ludCByb3VuZG9mZi4gVGhlc2VcclxuICogbG9zc2VzIGluIHByZWNpc2lvbiBhZGQgdXAgYXMgdGhlIG51bWJlciBvZiBudW1iZXJzIGluY3JlYXNlcy4gVGhpcyBhbHRlcm5hdGl2ZVxyXG4gKiBhbGdvcml0aG0gaXMgbW9yZSBhY2N1cmF0ZSB0aGFuIHRoZSBzaW1wbGUgd2F5IG9mIGNhbGN1bGF0aW5nIHN1bXMgYnkgc2ltcGxlXHJcbiAqIGFkZGl0aW9uLlxyXG4gKlxyXG4gKiBUaGlzIHJ1bnMgb24gYE8obilgLCBsaW5lYXIgdGltZSBpbiByZXNwZWN0IHRvIHRoZSBhcnJheVxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggaW5wdXRcclxuICogQHJldHVybiB7bnVtYmVyfSBzdW0gb2YgYWxsIGlucHV0IG51bWJlcnNcclxuICogQGV4YW1wbGVcclxuICogY29uc29sZS5sb2coc3VtKFsxLCAyLCAzXSkpOyAvLyA2XHJcbiAqL1xyXG5mdW5jdGlvbiBzdW0oeC8qOiBBcnJheTxudW1iZXI+ICovKS8qOiBudW1iZXIgKi8ge1xyXG5cclxuICAgIC8vIGxpa2UgdGhlIHRyYWRpdGlvbmFsIHN1bSBhbGdvcml0aG0sIHdlIGtlZXAgYSBydW5uaW5nXHJcbiAgICAvLyBjb3VudCBvZiB0aGUgY3VycmVudCBzdW0uXHJcbiAgICB2YXIgc3VtID0gMDtcclxuXHJcbiAgICAvLyBidXQgd2UgYWxzbyBrZWVwIHRocmVlIGV4dHJhIHZhcmlhYmxlcyBhcyBib29ra2VlcGluZzpcclxuICAgIC8vIG1vc3QgaW1wb3J0YW50bHksIGFuIGVycm9yIGNvcnJlY3Rpb24gdmFsdWUuIFRoaXMgd2lsbCBiZSBhIHZlcnlcclxuICAgIC8vIHNtYWxsIG51bWJlciB0aGF0IGlzIHRoZSBvcHBvc2l0ZSBvZiB0aGUgZmxvYXRpbmcgcG9pbnQgcHJlY2lzaW9uIGxvc3MuXHJcbiAgICB2YXIgZXJyb3JDb21wZW5zYXRpb24gPSAwO1xyXG5cclxuICAgIC8vIHRoaXMgd2lsbCBiZSBlYWNoIG51bWJlciBpbiB0aGUgbGlzdCBjb3JyZWN0ZWQgd2l0aCB0aGUgY29tcGVuc2F0aW9uIHZhbHVlLlxyXG4gICAgdmFyIGNvcnJlY3RlZEN1cnJlbnRWYWx1ZTtcclxuXHJcbiAgICAvLyBhbmQgdGhpcyB3aWxsIGJlIHRoZSBuZXh0IHN1bVxyXG4gICAgdmFyIG5leHRTdW07XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgLy8gZmlyc3QgY29ycmVjdCB0aGUgdmFsdWUgdGhhdCB3ZSdyZSBnb2luZyB0byBhZGQgdG8gdGhlIHN1bVxyXG4gICAgICAgIGNvcnJlY3RlZEN1cnJlbnRWYWx1ZSA9IHhbaV0gLSBlcnJvckNvbXBlbnNhdGlvbjtcclxuXHJcbiAgICAgICAgLy8gY29tcHV0ZSB0aGUgbmV4dCBzdW0uIHN1bSBpcyBsaWtlbHkgYSBtdWNoIGxhcmdlciBudW1iZXJcclxuICAgICAgICAvLyB0aGFuIGNvcnJlY3RlZEN1cnJlbnRWYWx1ZSwgc28gd2UnbGwgbG9zZSBwcmVjaXNpb24gaGVyZSxcclxuICAgICAgICAvLyBhbmQgbWVhc3VyZSBob3cgbXVjaCBwcmVjaXNpb24gaXMgbG9zdCBpbiB0aGUgbmV4dCBzdGVwXHJcbiAgICAgICAgbmV4dFN1bSA9IHN1bSArIGNvcnJlY3RlZEN1cnJlbnRWYWx1ZTtcclxuXHJcbiAgICAgICAgLy8gd2UgaW50ZW50aW9uYWxseSBkaWRuJ3QgYXNzaWduIHN1bSBpbW1lZGlhdGVseSwgYnV0IHN0b3JlZFxyXG4gICAgICAgIC8vIGl0IGZvciBub3cgc28gd2UgY2FuIGZpZ3VyZSBvdXQgdGhpczogaXMgKHN1bSArIG5leHRWYWx1ZSkgLSBuZXh0VmFsdWVcclxuICAgICAgICAvLyBub3QgZXF1YWwgdG8gMD8gaWRlYWxseSBpdCB3b3VsZCBiZSwgYnV0IGluIHByYWN0aWNlIGl0IHdvbid0OlxyXG4gICAgICAgIC8vIGl0IHdpbGwgYmUgc29tZSB2ZXJ5IHNtYWxsIG51bWJlci4gdGhhdCdzIHdoYXQgd2UgcmVjb3JkXHJcbiAgICAgICAgLy8gYXMgZXJyb3JDb21wZW5zYXRpb24uXHJcbiAgICAgICAgZXJyb3JDb21wZW5zYXRpb24gPSBuZXh0U3VtIC0gc3VtIC0gY29ycmVjdGVkQ3VycmVudFZhbHVlO1xyXG5cclxuICAgICAgICAvLyBub3cgdGhhdCB3ZSd2ZSBjb21wdXRlZCBob3cgbXVjaCB3ZSdsbCBjb3JyZWN0IGZvciBpbiB0aGUgbmV4dFxyXG4gICAgICAgIC8vIGxvb3AsIHN0YXJ0IHRyZWF0aW5nIHRoZSBuZXh0U3VtIGFzIHRoZSBjdXJyZW50IHN1bS5cclxuICAgICAgICBzdW0gPSBuZXh0U3VtO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdW07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc3VtO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgbWVhbiA9IHJlcXVpcmUoJy4vbWVhbicpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBzdW0gb2YgZGV2aWF0aW9ucyB0byB0aGUgTnRoIHBvd2VyLlxyXG4gKiBXaGVuIG49MiBpdCdzIHRoZSBzdW0gb2Ygc3F1YXJlZCBkZXZpYXRpb25zLlxyXG4gKiBXaGVuIG49MyBpdCdzIHRoZSBzdW0gb2YgY3ViZWQgZGV2aWF0aW9ucy5cclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBuIHBvd2VyXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHN1bSBvZiBudGggcG93ZXIgZGV2aWF0aW9uc1xyXG4gKiBAZXhhbXBsZVxyXG4gKiB2YXIgaW5wdXQgPSBbMSwgMiwgM107XHJcbiAqIC8vIHNpbmNlIHRoZSB2YXJpYW5jZSBvZiBhIHNldCBpcyB0aGUgbWVhbiBzcXVhcmVkXHJcbiAqIC8vIGRldmlhdGlvbnMsIHdlIGNhbiBjYWxjdWxhdGUgdGhhdCB3aXRoIHN1bU50aFBvd2VyRGV2aWF0aW9uczpcclxuICogdmFyIHZhcmlhbmNlID0gc3VtTnRoUG93ZXJEZXZpYXRpb25zKGlucHV0KSAvIGlucHV0Lmxlbmd0aDtcclxuICovXHJcbmZ1bmN0aW9uIHN1bU50aFBvd2VyRGV2aWF0aW9ucyh4Lyo6IEFycmF5PG51bWJlcj4gKi8sIG4vKjogbnVtYmVyICovKS8qOm51bWJlciovIHtcclxuICAgIHZhciBtZWFuVmFsdWUgPSBtZWFuKHgpLFxyXG4gICAgICAgIHN1bSA9IDA7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgc3VtICs9IE1hdGgucG93KHhbaV0gLSBtZWFuVmFsdWUsIG4pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdW07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc3VtTnRoUG93ZXJEZXZpYXRpb25zO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgc3VtTnRoUG93ZXJEZXZpYXRpb25zID0gcmVxdWlyZSgnLi9zdW1fbnRoX3Bvd2VyX2RldmlhdGlvbnMnKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgW3ZhcmlhbmNlXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1ZhcmlhbmNlKVxyXG4gKiBpcyB0aGUgc3VtIG9mIHNxdWFyZWQgZGV2aWF0aW9ucyBmcm9tIHRoZSBtZWFuLlxyXG4gKlxyXG4gKiBUaGlzIGlzIGFuIGltcGxlbWVudGF0aW9uIG9mIHZhcmlhbmNlLCBub3Qgc2FtcGxlIHZhcmlhbmNlOlxyXG4gKiBzZWUgdGhlIGBzYW1wbGVWYXJpYW5jZWAgbWV0aG9kIGlmIHlvdSB3YW50IGEgc2FtcGxlIG1lYXN1cmUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBhIHBvcHVsYXRpb25cclxuICogQHJldHVybnMge251bWJlcn0gdmFyaWFuY2U6IGEgdmFsdWUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHplcm8uXHJcbiAqIHplcm8gaW5kaWNhdGVzIHRoYXQgYWxsIHZhbHVlcyBhcmUgaWRlbnRpY2FsLlxyXG4gKiBAZXhhbXBsZVxyXG4gKiBzcy52YXJpYW5jZShbMSwgMiwgMywgNCwgNSwgNl0pOyAvLz0gMi45MTdcclxuICovXHJcbmZ1bmN0aW9uIHZhcmlhbmNlKHgvKjogQXJyYXk8bnVtYmVyPiAqLykvKjpudW1iZXIqLyB7XHJcbiAgICAvLyBUaGUgdmFyaWFuY2Ugb2Ygbm8gbnVtYmVycyBpcyBudWxsXHJcbiAgICBpZiAoeC5sZW5ndGggPT09IDApIHsgcmV0dXJuIE5hTjsgfVxyXG5cclxuICAgIC8vIEZpbmQgdGhlIG1lYW4gb2Ygc3F1YXJlZCBkZXZpYXRpb25zIGJldHdlZW4gdGhlXHJcbiAgICAvLyBtZWFuIHZhbHVlIGFuZCBlYWNoIHZhbHVlLlxyXG4gICAgcmV0dXJuIHN1bU50aFBvd2VyRGV2aWF0aW9ucyh4LCAyKSAvIHgubGVuZ3RoO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHZhcmlhbmNlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG4vKipcclxuICogVGhlIFtaLVNjb3JlLCBvciBTdGFuZGFyZCBTY29yZV0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TdGFuZGFyZF9zY29yZSkuXHJcbiAqXHJcbiAqIFRoZSBzdGFuZGFyZCBzY29yZSBpcyB0aGUgbnVtYmVyIG9mIHN0YW5kYXJkIGRldmlhdGlvbnMgYW4gb2JzZXJ2YXRpb25cclxuICogb3IgZGF0dW0gaXMgYWJvdmUgb3IgYmVsb3cgdGhlIG1lYW4uIFRodXMsIGEgcG9zaXRpdmUgc3RhbmRhcmQgc2NvcmVcclxuICogcmVwcmVzZW50cyBhIGRhdHVtIGFib3ZlIHRoZSBtZWFuLCB3aGlsZSBhIG5lZ2F0aXZlIHN0YW5kYXJkIHNjb3JlXHJcbiAqIHJlcHJlc2VudHMgYSBkYXR1bSBiZWxvdyB0aGUgbWVhbi4gSXQgaXMgYSBkaW1lbnNpb25sZXNzIHF1YW50aXR5XHJcbiAqIG9idGFpbmVkIGJ5IHN1YnRyYWN0aW5nIHRoZSBwb3B1bGF0aW9uIG1lYW4gZnJvbSBhbiBpbmRpdmlkdWFsIHJhd1xyXG4gKiBzY29yZSBhbmQgdGhlbiBkaXZpZGluZyB0aGUgZGlmZmVyZW5jZSBieSB0aGUgcG9wdWxhdGlvbiBzdGFuZGFyZFxyXG4gKiBkZXZpYXRpb24uXHJcbiAqXHJcbiAqIFRoZSB6LXNjb3JlIGlzIG9ubHkgZGVmaW5lZCBpZiBvbmUga25vd3MgdGhlIHBvcHVsYXRpb24gcGFyYW1ldGVycztcclxuICogaWYgb25lIG9ubHkgaGFzIGEgc2FtcGxlIHNldCwgdGhlbiB0aGUgYW5hbG9nb3VzIGNvbXB1dGF0aW9uIHdpdGhcclxuICogc2FtcGxlIG1lYW4gYW5kIHNhbXBsZSBzdGFuZGFyZCBkZXZpYXRpb24geWllbGRzIHRoZVxyXG4gKiBTdHVkZW50J3MgdC1zdGF0aXN0aWMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtZWFuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFuZGFyZERldmlhdGlvblxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IHogc2NvcmVcclxuICogQGV4YW1wbGVcclxuICogc3MuelNjb3JlKDc4LCA4MCwgNSk7IC8vPSAtMC40XHJcbiAqL1xyXG5mdW5jdGlvbiB6U2NvcmUoeC8qOm51bWJlciovLCBtZWFuLyo6bnVtYmVyKi8sIHN0YW5kYXJkRGV2aWF0aW9uLyo6bnVtYmVyKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgcmV0dXJuICh4IC0gbWVhbikgLyBzdGFuZGFyZERldmlhdGlvbjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB6U2NvcmU7XHJcbiIsImltcG9ydCB7Q2hhcnQsIENoYXJ0Q29uZmlnfSBmcm9tIFwiLi9jaGFydFwiO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5pbXBvcnQge0xlZ2VuZH0gZnJvbSBcIi4vbGVnZW5kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQmFyQ2hhcnRDb25maWcgZXh0ZW5kcyBDaGFydENvbmZpZ3tcclxuXHJcbiAgICBzdmdDbGFzcz0gdGhpcy5jc3NDbGFzc1ByZWZpeCsnYmFyLWNoYXJ0JztcclxuICAgIHNob3dMZWdlbmQ9dHJ1ZTtcclxuICAgIHNob3dUb29sdGlwID10cnVlO1xyXG4gICAgbGVnZW5kPXtcclxuICAgICAgICB3aWR0aDogODAsXHJcbiAgICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgICBzaGFwZVdpZHRoOiAyMFxyXG4gICAgfTtcclxuICAgIHg9ey8vIFggYXhpcyBjb25maWdcclxuICAgICAgICBsYWJlbDogJycsIC8vIGF4aXMgbGFiZWxcclxuICAgICAgICBrZXk6IDAsXHJcbiAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IFV0aWxzLmlzTnVtYmVyKGQpID8gZCA6IGRba2V5XSwgLy8geCB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgIHNjYWxlOiBcIm9yZGluYWxcIixcclxuICAgICAgICB0aWNrczogdW5kZWZpbmVkLFxyXG4gICAgfTtcclxuICAgIHk9ey8vIFkgYXhpcyBjb25maWdcclxuICAgICAgICBrZXk6IDEsXHJcbiAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IFV0aWxzLmlzTnVtYmVyKGQpID8gZCA6IGRba2V5XSwgLy8geCB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgIGxhYmVsOiAnJywgLy8gYXhpcyBsYWJlbCxcclxuICAgICAgICBvcmllbnQ6IFwibGVmdFwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiXHJcbiAgICB9O1xyXG4gICAgZ3JvdXBzPXtcclxuICAgICAgICBrZXk6IDEsXHJcbiAgICAgICAgdmFsdWU6IChkKSA9PiBkW3RoaXMuZ3JvdXBzLmtleV0gLCAvLyBncm91cGluZyB2YWx1ZSBhY2Nlc3NvcixcclxuICAgICAgICBsYWJlbDogXCJcIlxyXG4gICAgfTtcclxuICAgIGNvbG9yID0gdW5kZWZpbmVkIC8vIHN0cmluZyBvciBmdW5jdGlvbiByZXR1cm5pbmcgY29sb3IncyB2YWx1ZSBmb3IgY29sb3Igc2NhbGVcclxuICAgIGQzQ29sb3JDYXRlZ29yeT0gJ2NhdGVnb3J5MTAnO1xyXG4gICAgdHJhbnNpdGlvbj0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdmFyIGNvbmZpZyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmKGN1c3RvbSl7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQmFyQ2hhcnQgZXh0ZW5kcyBDaGFydHtcclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIG5ldyBCYXJDaGFydENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKXtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBCYXJDaGFydENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpe1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcbiAgICAgICAgdmFyIHNlbGY9dGhpcztcclxuXHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgdGhpcy5wbG90Lng9e307XHJcbiAgICAgICAgdGhpcy5wbG90Lnk9e307XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC5zaG93TGVnZW5kID0gY29uZi5zaG93TGVnZW5kO1xyXG4gICAgICAgIGlmKHRoaXMucGxvdC5zaG93TGVnZW5kKXtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lm1hcmdpbi5yaWdodCA9IGNvbmYubWFyZ2luLnJpZ2h0ICsgY29uZi5sZWdlbmQud2lkdGgrY29uZi5sZWdlbmQubWFyZ2luKjI7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5jb21wdXRlUGxvdFNpemUoKTtcclxuICAgICAgICB0aGlzLnNldHVwWSgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBYKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cEdyb3VwU3RhY2tzKCk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLnNldHVwWURvbWFpbigpO1xyXG5cclxuXHJcbiAgICAgICAgaWYoY29uZi5kM0NvbG9yQ2F0ZWdvcnkpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuY29sb3JDYXRlZ29yeSA9IGQzLnNjYWxlW2NvbmYuZDNDb2xvckNhdGVnb3J5XSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY29sb3JWYWx1ZSA9IGNvbmYuY29sb3I7XHJcbiAgICAgICAgaWYgKGNvbG9yVmFsdWUgJiYgdHlwZW9mIGNvbG9yVmFsdWUgPT09ICdzdHJpbmcnIHx8IGNvbG9yVmFsdWUgaW5zdGFuY2VvZiBTdHJpbmcpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuY29sb3IgPSBjb2xvclZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKHRoaXMucGxvdC5jb2xvckNhdGVnb3J5KXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmNvbG9yID0gZCA9PiAgc2VsZi5wbG90LmNvbG9yQ2F0ZWdvcnkoZC5rZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBzZXR1cFgoKXtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHggPSBwbG90Lng7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZy54O1xyXG5cclxuICAgICAgICAvKiAqXHJcbiAgICAgICAgICogdmFsdWUgYWNjZXNzb3IgLSByZXR1cm5zIHRoZSB2YWx1ZSB0byBlbmNvZGUgZm9yIGEgZ2l2ZW4gZGF0YSBvYmplY3QuXHJcbiAgICAgICAgICogc2NhbGUgLSBtYXBzIHZhbHVlIHRvIGEgdmlzdWFsIGRpc3BsYXkgZW5jb2RpbmcsIHN1Y2ggYXMgYSBwaXhlbCBwb3NpdGlvbi5cclxuICAgICAgICAgKiBtYXAgZnVuY3Rpb24gLSBtYXBzIGZyb20gZGF0YSB2YWx1ZSB0byBkaXNwbGF5IHZhbHVlXHJcbiAgICAgICAgICogYXhpcyAtIHNldHMgdXAgYXhpc1xyXG4gICAgICAgICAqKi9cclxuICAgICAgICB4LnZhbHVlID0gZCA9PiBjb25mLnZhbHVlKGQsIGNvbmYua2V5KTtcclxuICAgICAgICB4LnNjYWxlID0gZDMuc2NhbGUub3JkaW5hbCgpLnJhbmdlUm91bmRCYW5kcyhbMCwgcGxvdC53aWR0aF0sIC4wOCk7XHJcbiAgICAgICAgeC5tYXAgPSBkID0+IHguc2NhbGUoeC52YWx1ZShkKSk7XHJcblxyXG4gICAgICAgIHguYXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeC5zY2FsZSkub3JpZW50KGNvbmYub3JpZW50KTtcclxuXHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgdmFyIGRvbWFpbjtcclxuICAgICAgICBpZighdGhpcy5jb25maWcuc2VyaWVzKXtcclxuICAgICAgICAgICAgZG9tYWluID0gZDMubWFwKGRhdGEsIHgudmFsdWUpLmtleXMoKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgZG9tYWluID0gZDMubWFwKGRhdGFbMF0udmFsdWVzLCB4LnZhbHVlKS5rZXlzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwbG90Lnguc2NhbGUuZG9tYWluKGRvbWFpbik7XHJcbiAgICAgICAgY29uc29sZS5sb2coJyBwbG90Lnguc2NhbGUuZG9tYWluJywgcGxvdC54LnNjYWxlLmRvbWFpbigpKTtcclxuICAgICAgICBcclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBZICgpe1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeSA9IHBsb3QueTtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnLnk7XHJcbiAgICAgICAgeS52YWx1ZSA9IGQgPT4gY29uZi52YWx1ZShkLCBjb25mLmtleSk7XHJcbiAgICAgICAgeS5zY2FsZSA9IGQzLnNjYWxlW2NvbmYuc2NhbGVdKCkucmFuZ2UoW3Bsb3QuaGVpZ2h0LCAwXSk7XHJcbiAgICAgICAgeS5tYXAgPSBkID0+IHkuc2NhbGUoeS52YWx1ZShkKSk7XHJcblxyXG4gICAgICAgIHkuYXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeS5zY2FsZSkub3JpZW50KGNvbmYub3JpZW50KTtcclxuICAgICAgICBpZihjb25mLnRpY2tzKXtcclxuICAgICAgICAgICAgeS5heGlzLnRpY2tzKGNvbmYudGlja3MpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBZRG9tYWluKCkge1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIHZhciBkb21haW47XHJcbiAgICAgICAgdmFyIHlTdGFja01heCA9IGQzLm1heChwbG90LmxheWVycywgbGF5ZXIgPT4gZDMubWF4KGxheWVyLnZhbHVlcywgZCA9PiBkLnkwICsgZC55KSk7XHJcbiAgICAgICAgaWYoIXRoaXMuY29uZmlnLnNlcmllcyl7XHJcbiAgICAgICAgICAgIGRvbWFpbiA9IFtkMy5taW4oZGF0YSwgcGxvdC55LnZhbHVlKSwgZDMubWF4KGRhdGEsIHBsb3QueS52YWx1ZSldO1xyXG4gICAgICAgIH1lbHNle1xyXG5cclxuICAgICAgICAgICAgLy8gdmFyIG1pbiA9IGQzLm1pbihkYXRhLCBzPT5kMy5taW4ocy52YWx1ZXMsIHBsb3QueS52YWx1ZSkpO1xyXG4gICAgICAgICAgICB2YXIgbWF4ID0geVN0YWNrTWF4O1xyXG4gICAgICAgICAgICBkb21haW4gPSBbMCwgbWF4XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcGxvdC55LnNjYWxlLmRvbWFpbihkb21haW4pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCcgcGxvdC55LnNjYWxlLmRvbWFpbicsIHBsb3QueS5zY2FsZS5kb21haW4oKSk7XHJcbiAgICB9XHJcbiAgICBncm91cERhdGEoKXtcclxuICAgICAgICB2YXIgc2VsZj10aGlzO1xyXG4gICAgICAgIHRoaXMucGxvdC5ncm91cGluZ0VuYWJsZWQgPSB0aGlzLmNvbmZpZy5zZXJpZXM7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgaWYoIXRoaXMucGxvdC5ncm91cGluZ0VuYWJsZWQgKXtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lmdyb3VwZWREYXRhID0gIFt7XHJcbiAgICAgICAgICAgICAgICBrZXk6ICdyb290JyxcclxuICAgICAgICAgICAgICAgIHZhbHVlczogc2VsZi5tYXBUb1BvaW50cyhkYXRhKVxyXG4gICAgICAgICAgICB9XTtcclxuICAgICAgICB9ZWxzZXtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5ncm91cGVkRGF0YSA9ICBkYXRhLm1hcChzPT57XHJcbiAgICAgICAgICAgICAgICByZXR1cm57XHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiBzLmtleSxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IHNlbGYubWFwVG9Qb2ludHMocy52YWx1ZXMpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzZXR1cEdyb3VwU3RhY2tzKCkge1xyXG4gICAgICAgIHZhciBzZWxmPXRoaXM7XHJcbiAgICAgICAgdGhpcy5ncm91cERhdGEoKTtcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnN0YWNrID0gZDMubGF5b3V0LnN0YWNrKCkudmFsdWVzKGQ9PmQudmFsdWVzKTtcclxuICAgICAgICB0aGlzLnBsb3QubGF5ZXJzID0gdGhpcy5wbG90LnN0YWNrKHRoaXMucGxvdC5ncm91cGVkRGF0YSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIG1hcFRvUG9pbnRzKHZhbHVlcyl7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlcy5tYXAodj0+e1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgeDogcGxvdC54LnZhbHVlKHYpLFxyXG4gICAgICAgICAgICAgICAgeTogcGxvdC55LnZhbHVlKHYpLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBkcmF3QXhpc1goKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGF4aXNDb25mID0gdGhpcy5jb25maWcueDtcclxuICAgICAgICB2YXIgYXhpcyA9IHNlbGYuc3ZnRy5zZWxlY3RPckFwcGVuZChcImcuXCIrc2VsZi5wcmVmaXhDbGFzcygnYXhpcy14JykrXCIuXCIrc2VsZi5wcmVmaXhDbGFzcygnYXhpcycpKyhzZWxmLmNvbmZpZy5ndWlkZXMgPyAnJyA6ICcuJytzZWxmLnByZWZpeENsYXNzKCduby1ndWlkZXMnKSkpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyBwbG90LmhlaWdodCArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgdmFyIGF4aXNUID0gYXhpcztcclxuICAgICAgICBpZiAoc2VsZi5jb25maWcudHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICBheGlzVCA9IGF4aXMudHJhbnNpdGlvbigpLmVhc2UoXCJzaW4taW4tb3V0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXhpc1QuY2FsbChwbG90LnguYXhpcyk7XHJcblxyXG4gICAgICAgIGF4aXMuc2VsZWN0T3JBcHBlbmQoXCJ0ZXh0LlwiK3NlbGYucHJlZml4Q2xhc3MoJ2xhYmVsJykpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyAocGxvdC53aWR0aC8yKSArXCIsXCIrIChwbG90Lm1hcmdpbi5ib3R0b20pICtcIilcIikgIC8vIHRleHQgaXMgZHJhd24gb2ZmIHRoZSBzY3JlZW4gdG9wIGxlZnQsIG1vdmUgZG93biBhbmQgb3V0IGFuZCByb3RhdGVcclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCBcIi0xZW1cIilcclxuICAgICAgICAgICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoYXhpc0NvbmYubGFiZWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICBkcmF3QXhpc1koKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGF4aXNDb25mID0gdGhpcy5jb25maWcueTtcclxuICAgICAgICB2YXIgYXhpcyA9IHNlbGYuc3ZnRy5zZWxlY3RPckFwcGVuZChcImcuXCIrc2VsZi5wcmVmaXhDbGFzcygnYXhpcy15JykrXCIuXCIrc2VsZi5wcmVmaXhDbGFzcygnYXhpcycpKyhzZWxmLmNvbmZpZy5ndWlkZXMgPyAnJyA6ICcuJytzZWxmLnByZWZpeENsYXNzKCduby1ndWlkZXMnKSkpO1xyXG5cclxuICAgICAgICB2YXIgYXhpc1QgPSBheGlzO1xyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy50cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGF4aXNUID0gYXhpcy50cmFuc2l0aW9uKCkuZWFzZShcInNpbi1pbi1vdXRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBheGlzVC5jYWxsKHBsb3QueS5heGlzKTtcclxuXHJcbiAgICAgICAgYXhpcy5zZWxlY3RPckFwcGVuZChcInRleHQuXCIrc2VsZi5wcmVmaXhDbGFzcygnbGFiZWwnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrIC1wbG90Lm1hcmdpbi5sZWZ0ICtcIixcIisocGxvdC5oZWlnaHQvMikrXCIpcm90YXRlKC05MClcIikgIC8vIHRleHQgaXMgZHJhd24gb2ZmIHRoZSBzY3JlZW4gdG9wIGxlZnQsIG1vdmUgZG93biBhbmQgb3V0IGFuZCByb3RhdGVcclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCBcIjFlbVwiKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAudGV4dChheGlzQ29uZi5sYWJlbCk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBkcmF3QmFycygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHBsb3QubGF5ZXJzKTtcclxuXHJcbiAgICAgICAgdmFyIGxheWVyQ2xhc3MgPSB0aGlzLnByZWZpeENsYXNzKFwibGF5ZXJcIik7XHJcblxyXG4gICAgICAgIHZhciBiYXJDbGFzcyA9IHRoaXMucHJlZml4Q2xhc3MoXCJiYXJcIik7XHJcbiAgICAgICAgdmFyIGxheWVyID0gc2VsZi5zdmdHLnNlbGVjdEFsbChcIi5cIitsYXllckNsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShwbG90LmxheWVycyk7XHJcblxyXG4gICAgICAgIGxheWVyLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGxheWVyQ2xhc3MpO1xyXG5cclxuICAgICAgICB2YXIgYmFyID0gbGF5ZXIuc2VsZWN0QWxsKFwiLlwiK2JhckNsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShkID0+IGQudmFsdWVzKTtcclxuXHJcbiAgICAgICAgYmFyLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGJhckNsYXNzKVxyXG4gICAgICAgICAgICAuYXBwZW5kKFwicmVjdFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgMSk7XHJcblxyXG5cclxuICAgICAgICB2YXIgYmFyUmVjdCA9IGJhci5zZWxlY3QoXCJyZWN0XCIpO1xyXG5cclxuICAgICAgICB2YXIgYmFyUmVjdFQgPSBiYXJSZWN0O1xyXG4gICAgICAgIHZhciBiYXJUID0gYmFyO1xyXG4gICAgICAgIHZhciBsYXllclQgPSBsYXllcjtcclxuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgICAgIGJhclJlY3RUID0gYmFyUmVjdC50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgICAgIGJhclQgPSBiYXIudHJhbnNpdGlvbigpO1xyXG4gICAgICAgICAgICBsYXllclQ9IGxheWVyLnRyYW5zaXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB5RG9tYWluID0gcGxvdC55LnNjYWxlLmRvbWFpbigpO1xyXG4gICAgICAgIGJhclQuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIHBsb3QueC5zY2FsZShkLngpICsgXCIsXCIgKyAocGxvdC55LnNjYWxlKGQueTArZC55ICkpICsgXCIpXCI7IH0pO1xyXG5cclxuICAgICAgICBiYXJSZWN0VFxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsICBwbG90Lnguc2NhbGUucmFuZ2VCYW5kKCkpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGQgPT4gICBwbG90Lnkuc2NhbGUoZC55MCApIC0gcGxvdC55LnNjYWxlKGQueTAgKyBkLnkgLSB5RG9tYWluWzBdKSk7XHJcblxyXG5cclxuICAgICAgICBpZih0aGlzLnBsb3QuY29sb3Ipe1xyXG4gICAgICAgICAgICBsYXllclRcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCB0aGlzLnBsb3QuY29sb3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBsb3QudG9vbHRpcCkge1xyXG4gICAgICAgICAgICBiYXIub24oXCJtb3VzZW92ZXJcIiwgZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDIwMClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIC45KTtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC5odG1sKGQueSlcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG4gICAgICAgICAgICB9KS5vbihcIm1vdXNlb3V0XCIsIGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxheWVyLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgICAgICBiYXIuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShuZXdEYXRhKXtcclxuICAgICAgICBzdXBlci51cGRhdGUobmV3RGF0YSk7XHJcbiAgICAgICAgdGhpcy5kcmF3QXhpc1goKTtcclxuICAgICAgICB0aGlzLmRyYXdBeGlzWSgpO1xyXG5cclxuICAgICAgICB0aGlzLmRyYXdCYXJzKCk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlTGVnZW5kKCk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICB1cGRhdGVMZWdlbmQoKSB7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcblxyXG4gICAgICAgIHZhciBzY2FsZSA9IHBsb3QuY29sb3JDYXRlZ29yeTtcclxuICAgICAgICBpZighc2NhbGUuZG9tYWluKCkgfHwgc2NhbGUuZG9tYWluKCkubGVuZ3RoPDIpe1xyXG4gICAgICAgICAgICBwbG90LnNob3dMZWdlbmQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCFwbG90LnNob3dMZWdlbmQpe1xyXG4gICAgICAgICAgICBpZihwbG90LmxlZ2VuZCAmJiBwbG90LmxlZ2VuZC5jb250YWluZXIpe1xyXG4gICAgICAgICAgICAgICAgcGxvdC5sZWdlbmQuY29udGFpbmVyLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB2YXIgbGVnZW5kWCA9IHRoaXMucGxvdC53aWR0aCArIHRoaXMuY29uZmlnLmxlZ2VuZC5tYXJnaW47XHJcbiAgICAgICAgdmFyIGxlZ2VuZFkgPSB0aGlzLmNvbmZpZy5sZWdlbmQubWFyZ2luO1xyXG5cclxuICAgICAgICBwbG90LmxlZ2VuZCA9IG5ldyBMZWdlbmQodGhpcy5zdmcsIHRoaXMuc3ZnRywgc2NhbGUsIGxlZ2VuZFgsIGxlZ2VuZFkpO1xyXG5cclxuICAgICAgICB2YXIgbGVnZW5kTGluZWFyID0gcGxvdC5sZWdlbmQuY29sb3IoKVxyXG4gICAgICAgICAgICAuc2hhcGVXaWR0aCh0aGlzLmNvbmZpZy5sZWdlbmQuc2hhcGVXaWR0aClcclxuICAgICAgICAgICAgLm9yaWVudCgndmVydGljYWwnKVxyXG4gICAgICAgICAgICAuc2NhbGUoc2NhbGUpO1xyXG5cclxuICAgICAgICBwbG90LmxlZ2VuZC5jb250YWluZXJcclxuICAgICAgICAgICAgLmNhbGwobGVnZW5kTGluZWFyKTtcclxuICAgIH1cclxuXHJcblxyXG59XHJcbiIsImltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJ0Q29uZmlnIHtcclxuICAgIGNzc0NsYXNzUHJlZml4ID0gXCJvZGMtXCI7XHJcbiAgICBzdmdDbGFzcyA9IHRoaXMuY3NzQ2xhc3NQcmVmaXggKyAnbXctZDMtY2hhcnQnO1xyXG4gICAgd2lkdGggPSB1bmRlZmluZWQ7XHJcbiAgICBoZWlnaHQgPSB1bmRlZmluZWQ7XHJcbiAgICBtYXJnaW4gPSB7XHJcbiAgICAgICAgbGVmdDogNTAsXHJcbiAgICAgICAgcmlnaHQ6IDMwLFxyXG4gICAgICAgIHRvcDogMzAsXHJcbiAgICAgICAgYm90dG9tOiA1MFxyXG4gICAgfTtcclxuICAgIHNob3dUb29sdGlwID0gZmFsc2U7XHJcbiAgICB0cmFuc2l0aW9uID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pIHtcclxuICAgICAgICBpZiAoY3VzdG9tKSB7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJ0IHtcclxuICAgIHV0aWxzID0gVXRpbHM7XHJcbiAgICBiYXNlQ29udGFpbmVyO1xyXG4gICAgc3ZnO1xyXG4gICAgY29uZmlnO1xyXG4gICAgcGxvdCA9IHtcclxuICAgICAgICBtYXJnaW46IHt9XHJcbiAgICB9O1xyXG4gICAgX2F0dGFjaGVkID0ge307XHJcbiAgICBfbGF5ZXJzID0ge307XHJcbiAgICBfZXZlbnRzID0ge307XHJcbiAgICBfaXNBdHRhY2hlZDtcclxuICAgIF9pc0luaXRpYWxpemVkPWZhbHNlO1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihiYXNlLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9pc0F0dGFjaGVkID0gYmFzZSBpbnN0YW5jZW9mIENoYXJ0O1xyXG5cclxuICAgICAgICB0aGlzLmJhc2VDb250YWluZXIgPSBiYXNlO1xyXG5cclxuICAgICAgICB0aGlzLnNldENvbmZpZyhjb25maWcpO1xyXG5cclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgICB0aGlzLnBvc3RJbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZykge1xyXG4gICAgICAgIGlmICghY29uZmlnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gbmV3IENoYXJ0Q29uZmlnKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRhKGRhdGEpIHtcclxuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHJcbiAgICAgICAgc2VsZi5pbml0UGxvdCgpO1xyXG4gICAgICAgIHNlbGYuaW5pdFN2ZygpO1xyXG5cclxuICAgICAgICBzZWxmLmluaXRUb29sdGlwKCk7XHJcbiAgICAgICAgc2VsZi5kcmF3KCk7XHJcbiAgICAgICAgdGhpcy5faXNJbml0aWFsaXplZD10cnVlO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHBvc3RJbml0KCl7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXRTdmcoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBjb25maWcgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgdmFyIG1hcmdpbiA9IHNlbGYucGxvdC5tYXJnaW47XHJcbiAgICAgICAgdmFyIHdpZHRoID0gc2VsZi5wbG90LndpZHRoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQ7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IHNlbGYucGxvdC5oZWlnaHQgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbTtcclxuICAgICAgICB2YXIgYXNwZWN0ID0gd2lkdGggLyBoZWlnaHQ7XHJcbiAgICAgICAgaWYoIXNlbGYuX2lzQXR0YWNoZWQpe1xyXG4gICAgICAgICAgICBpZighdGhpcy5faXNJbml0aWFsaXplZCl7XHJcbiAgICAgICAgICAgICAgICBkMy5zZWxlY3Qoc2VsZi5iYXNlQ29udGFpbmVyKS5zZWxlY3QoXCJzdmdcIikucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2VsZi5zdmcgPSBkMy5zZWxlY3Qoc2VsZi5iYXNlQ29udGFpbmVyKS5zZWxlY3RPckFwcGVuZChcInN2Z1wiKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuc3ZnXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ2aWV3Qm94XCIsIFwiMCAwIFwiICsgXCIgXCIgKyB3aWR0aCArIFwiIFwiICsgaGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJwcmVzZXJ2ZUFzcGVjdFJhdGlvXCIsIFwieE1pZFlNaWQgbWVldFwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBjb25maWcuc3ZnQ2xhc3MpO1xyXG4gICAgICAgICAgICBzZWxmLnN2Z0cgPSBzZWxmLnN2Zy5zZWxlY3RPckFwcGVuZChcImcubWFpbi1ncm91cFwiKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5iYXNlQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgc2VsZi5zdmcgPSBzZWxmLmJhc2VDb250YWluZXIuc3ZnO1xyXG4gICAgICAgICAgICBzZWxmLnN2Z0cgPSBzZWxmLnN2Zy5zZWxlY3RPckFwcGVuZChcImcubWFpbi1ncm91cC5cIitjb25maWcuc3ZnQ2xhc3MpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWxmLnN2Z0cuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIG1hcmdpbi5sZWZ0ICsgXCIsXCIgKyBtYXJnaW4udG9wICsgXCIpXCIpO1xyXG5cclxuICAgICAgICBpZiAoIWNvbmZpZy53aWR0aCB8fCBjb25maWcuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdCh3aW5kb3cpXHJcbiAgICAgICAgICAgICAgICAub24oXCJyZXNpemVcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vVE9ETyBhZGQgcmVzcG9uc2l2ZW5lc3MgaWYgd2lkdGgvaGVpZ2h0IG5vdCBzcGVjaWZpZWRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0VG9vbHRpcCgpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBpZiAoc2VsZi5jb25maWcuc2hvd1Rvb2x0aXApIHtcclxuICAgICAgICAgICAgaWYoIXNlbGYuX2lzQXR0YWNoZWQgKXtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC50b29sdGlwID0gZDMuc2VsZWN0KFwiYm9keVwiKS5zZWxlY3RPckFwcGVuZCgnZGl2Licrc2VsZi5jb25maWcuY3NzQ2xhc3NQcmVmaXgrJ3Rvb2x0aXAnKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wbG90LnRvb2x0aXA9IHNlbGYuYmFzZUNvbnRhaW5lci5wbG90LnRvb2x0aXA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCkge1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSB0aGlzLmNvbmZpZy5tYXJnaW47XHJcbiAgICAgICAgdGhpcy5wbG90ID0gdGhpcy5wbG90IHx8IHt9O1xyXG4gICAgICAgIHRoaXMucGxvdC5tYXJnaW4gPSB7XHJcbiAgICAgICAgICAgIHRvcDogbWFyZ2luLnRvcCxcclxuICAgICAgICAgICAgYm90dG9tOiBtYXJnaW4uYm90dG9tLFxyXG4gICAgICAgICAgICBsZWZ0OiBtYXJnaW4ubGVmdCxcclxuICAgICAgICAgICAgcmlnaHQ6IG1hcmdpbi5yaWdodFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRhdGEpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsYXllck5hbWUsIGF0dGFjaG1lbnREYXRhO1xyXG4gICAgICAgIGZvciAodmFyIGF0dGFjaG1lbnROYW1lIGluIHRoaXMuX2F0dGFjaGVkKSB7XHJcblxyXG4gICAgICAgICAgICBhdHRhY2htZW50RGF0YSA9IGRhdGE7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9hdHRhY2hlZFthdHRhY2htZW50TmFtZV0udXBkYXRlKGF0dGFjaG1lbnREYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhdyhkYXRhKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoZGF0YSk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy9Cb3Jyb3dlZCBmcm9tIGQzLmNoYXJ0XHJcbiAgICAvKipcclxuICAgICAqIFJlZ2lzdGVyIG9yIHJldHJpZXZlIGFuIFwiYXR0YWNobWVudFwiIENoYXJ0LiBUaGUgXCJhdHRhY2htZW50XCIgY2hhcnQncyBgZHJhd2BcclxuICAgICAqIG1ldGhvZCB3aWxsIGJlIGludm9rZWQgd2hlbmV2ZXIgdGhlIGNvbnRhaW5pbmcgY2hhcnQncyBgZHJhd2AgbWV0aG9kIGlzXHJcbiAgICAgKiBpbnZva2VkLlxyXG4gICAgICpcclxuICAgICAqIEBleHRlcm5hbEV4YW1wbGUgY2hhcnQtYXR0YWNoXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF0dGFjaG1lbnROYW1lIE5hbWUgb2YgdGhlIGF0dGFjaG1lbnRcclxuICAgICAqIEBwYXJhbSB7Q2hhcnR9IFtjaGFydF0gQ2hhcnQgdG8gcmVnaXN0ZXIgYXMgYSBtaXggaW4gb2YgdGhpcyBjaGFydC4gV2hlblxyXG4gICAgICogICAgICAgIHVuc3BlY2lmaWVkLCB0aGlzIG1ldGhvZCB3aWxsIHJldHVybiB0aGUgYXR0YWNobWVudCBwcmV2aW91c2x5XHJcbiAgICAgKiAgICAgICAgcmVnaXN0ZXJlZCB3aXRoIHRoZSBzcGVjaWZpZWQgYGF0dGFjaG1lbnROYW1lYCAoaWYgYW55KS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Q2hhcnR9IFJlZmVyZW5jZSB0byB0aGlzIGNoYXJ0IChjaGFpbmFibGUpLlxyXG4gICAgICovXHJcbiAgICBhdHRhY2goYXR0YWNobWVudE5hbWUsIGNoYXJ0KSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2F0dGFjaGVkW2F0dGFjaG1lbnROYW1lXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2F0dGFjaGVkW2F0dGFjaG1lbnROYW1lXSA9IGNoYXJ0O1xyXG4gICAgICAgIHJldHVybiBjaGFydDtcclxuICAgIH07XHJcblxyXG4gICAgXHJcblxyXG4gICAgLy9Cb3Jyb3dlZCBmcm9tIGQzLmNoYXJ0XHJcbiAgICAvKipcclxuICAgICAqIFN1YnNjcmliZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGFuIGV2ZW50IHRyaWdnZXJlZCBvbiB0aGUgY2hhcnQuIFNlZSB7QGxpbmtcclxuICAgICAgICAqIENoYXJ0I29uY2V9IHRvIHN1YnNjcmliZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGFuIGV2ZW50IGZvciBvbmUgb2NjdXJlbmNlLlxyXG4gICAgICpcclxuICAgICAqIEBleHRlcm5hbEV4YW1wbGUge3J1bm5hYmxlfSBjaGFydC1vblxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGV2ZW50XHJcbiAgICAgKiBAcGFyYW0ge0NoYXJ0RXZlbnRIYW5kbGVyfSBjYWxsYmFjayBGdW5jdGlvbiB0byBiZSBpbnZva2VkIHdoZW4gdGhlIGV2ZW50XHJcbiAgICAgKiAgICAgICAgb2NjdXJzXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbnRleHRdIFZhbHVlIHRvIHNldCBhcyBgdGhpc2Agd2hlbiBpbnZva2luZyB0aGVcclxuICAgICAqICAgICAgICBgY2FsbGJhY2tgLiBEZWZhdWx0cyB0byB0aGUgY2hhcnQgaW5zdGFuY2UuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0NoYXJ0fSBBIHJlZmVyZW5jZSB0byB0aGlzIGNoYXJ0IChjaGFpbmFibGUpLlxyXG4gICAgICovXHJcbiAgICBvbihuYW1lLCBjYWxsYmFjaywgY29udGV4dCkge1xyXG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLl9ldmVudHNbbmFtZV0gfHwgKHRoaXMuX2V2ZW50c1tuYW1lXSA9IFtdKTtcclxuICAgICAgICBldmVudHMucHVzaCh7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcclxuICAgICAgICAgICAgY29udGV4dDogY29udGV4dCB8fCB0aGlzLFxyXG4gICAgICAgICAgICBfY2hhcnQ6IHRoaXNcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvL0JvcnJvd2VkIGZyb20gZDMuY2hhcnRcclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIFN1YnNjcmliZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGFuIGV2ZW50IHRyaWdnZXJlZCBvbiB0aGUgY2hhcnQuIFRoaXNcclxuICAgICAqIGZ1bmN0aW9uIHdpbGwgYmUgaW52b2tlZCBhdCB0aGUgbmV4dCBvY2N1cmFuY2Ugb2YgdGhlIGV2ZW50IGFuZCBpbW1lZGlhdGVseVxyXG4gICAgICogdW5zdWJzY3JpYmVkLiBTZWUge0BsaW5rIENoYXJ0I29ufSB0byBzdWJzY3JpYmUgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBhblxyXG4gICAgICogZXZlbnQgaW5kZWZpbml0ZWx5LlxyXG4gICAgICpcclxuICAgICAqIEBleHRlcm5hbEV4YW1wbGUge3J1bm5hYmxlfSBjaGFydC1vbmNlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgZXZlbnRcclxuICAgICAqIEBwYXJhbSB7Q2hhcnRFdmVudEhhbmRsZXJ9IGNhbGxiYWNrIEZ1bmN0aW9uIHRvIGJlIGludm9rZWQgd2hlbiB0aGUgZXZlbnRcclxuICAgICAqICAgICAgICBvY2N1cnNcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF0gVmFsdWUgdG8gc2V0IGFzIGB0aGlzYCB3aGVuIGludm9raW5nIHRoZVxyXG4gICAgICogICAgICAgIGBjYWxsYmFja2AuIERlZmF1bHRzIHRvIHRoZSBjaGFydCBpbnN0YW5jZVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtDaGFydH0gQSByZWZlcmVuY2UgdG8gdGhpcyBjaGFydCAoY2hhaW5hYmxlKVxyXG4gICAgICovXHJcbiAgICBvbmNlKG5hbWUsIGNhbGxiYWNrLCBjb250ZXh0KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBvbmNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZWxmLm9mZihuYW1lLCBvbmNlKTtcclxuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uKG5hbWUsIG9uY2UsIGNvbnRleHQpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvL0JvcnJvd2VkIGZyb20gZDMuY2hhcnRcclxuICAgIC8qKlxyXG4gICAgICogVW5zdWJzY3JpYmUgb25lIG9yIG1vcmUgY2FsbGJhY2sgZnVuY3Rpb25zIGZyb20gYW4gZXZlbnQgdHJpZ2dlcmVkIG9uIHRoZVxyXG4gICAgICogY2hhcnQuIFdoZW4gbm8gYXJndW1lbnRzIGFyZSBzcGVjaWZpZWQsICphbGwqIGhhbmRsZXJzIHdpbGwgYmUgdW5zdWJzY3JpYmVkLlxyXG4gICAgICogV2hlbiBvbmx5IGEgYG5hbWVgIGlzIHNwZWNpZmllZCwgYWxsIGhhbmRsZXJzIHN1YnNjcmliZWQgdG8gdGhhdCBldmVudCB3aWxsXHJcbiAgICAgKiBiZSB1bnN1YnNjcmliZWQuIFdoZW4gYSBgbmFtZWAgYW5kIGBjYWxsYmFja2AgYXJlIHNwZWNpZmllZCwgb25seSB0aGF0XHJcbiAgICAgKiBmdW5jdGlvbiB3aWxsIGJlIHVuc3Vic2NyaWJlZCBmcm9tIHRoYXQgZXZlbnQuIFdoZW4gYSBgbmFtZWAgYW5kIGBjb250ZXh0YFxyXG4gICAgICogYXJlIHNwZWNpZmllZCAoYnV0IGBjYWxsYmFja2AgaXMgb21pdHRlZCksIGFsbCBldmVudHMgYm91bmQgdG8gdGhlIGdpdmVuXHJcbiAgICAgKiBldmVudCB3aXRoIHRoZSBnaXZlbiBjb250ZXh0IHdpbGwgYmUgdW5zdWJzY3JpYmVkLlxyXG4gICAgICpcclxuICAgICAqIEBleHRlcm5hbEV4YW1wbGUge3J1bm5hYmxlfSBjaGFydC1vZmZcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW25hbWVdIE5hbWUgb2YgdGhlIGV2ZW50IHRvIGJlIHVuc3Vic2NyaWJlZFxyXG4gICAgICogQHBhcmFtIHtDaGFydEV2ZW50SGFuZGxlcn0gW2NhbGxiYWNrXSBGdW5jdGlvbiB0byBiZSB1bnN1YnNjcmliZWRcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF0gQ29udGV4dHMgdG8gYmUgdW5zdWJzY3JpYmVcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Q2hhcnR9IEEgcmVmZXJlbmNlIHRvIHRoaXMgY2hhcnQgKGNoYWluYWJsZSkuXHJcbiAgICAgKi9cclxuXHJcbiAgICBvZmYobmFtZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgbmFtZXMsIG4sIGV2ZW50cywgZXZlbnQsIGksIGo7XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSBhbGwgZXZlbnRzXHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgZm9yIChuYW1lIGluIHRoaXMuX2V2ZW50cykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW25hbWVdLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyByZW1vdmUgYWxsIGV2ZW50cyBmb3IgYSBzcGVjaWZpYyBuYW1lXHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgZXZlbnRzID0gdGhpcy5fZXZlbnRzW25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoZXZlbnRzKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudHMubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggd2hhdGV2ZXIgY29tYmluYXRpb24gb2YgbmFtZSwgY29udGV4dFxyXG4gICAgICAgIC8vIGFuZCBjYWxsYmFjay5cclxuICAgICAgICBuYW1lcyA9IG5hbWUgPyBbbmFtZV0gOiBPYmplY3Qua2V5cyh0aGlzLl9ldmVudHMpO1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBuID0gbmFtZXNbaV07XHJcbiAgICAgICAgICAgIGV2ZW50cyA9IHRoaXMuX2V2ZW50c1tuXTtcclxuICAgICAgICAgICAgaiA9IGV2ZW50cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIHdoaWxlIChqLS0pIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50ID0gZXZlbnRzW2pdO1xyXG4gICAgICAgICAgICAgICAgaWYgKChjYWxsYmFjayAmJiBjYWxsYmFjayA9PT0gZXZlbnQuY2FsbGJhY2spIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgKGNvbnRleHQgJiYgY29udGV4dCA9PT0gZXZlbnQuY29udGV4dCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudHMuc3BsaWNlKGosIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLy9Cb3Jyb3dlZCBmcm9tIGQzLmNoYXJ0XHJcbiAgICAvKipcclxuICAgICAqIFB1Ymxpc2ggYW4gZXZlbnQgb24gdGhpcyBjaGFydCB3aXRoIHRoZSBnaXZlbiBgbmFtZWAuXHJcbiAgICAgKlxyXG4gICAgICogQGV4dGVybmFsRXhhbXBsZSB7cnVubmFibGV9IGNoYXJ0LXRyaWdnZXJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBldmVudCB0byBwdWJsaXNoXHJcbiAgICAgKiBAcGFyYW0gey4uLip9IGFyZ3VtZW50cyBWYWx1ZXMgd2l0aCB3aGljaCB0byBpbnZva2UgdGhlIHJlZ2lzdGVyZWRcclxuICAgICAqICAgICAgICBjYWxsYmFja3MuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0NoYXJ0fSBBIHJlZmVyZW5jZSB0byB0aGlzIGNoYXJ0IChjaGFpbmFibGUpLlxyXG4gICAgICovXHJcbiAgICB0cmlnZ2VyKG5hbWUpIHtcclxuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XHJcbiAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50c1tuYW1lXTtcclxuICAgICAgICB2YXIgaSwgZXY7XHJcblxyXG4gICAgICAgIGlmIChldmVudHMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZXZlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBldiA9IGV2ZW50c1tpXTtcclxuICAgICAgICAgICAgICAgIGV2LmNhbGxiYWNrLmFwcGx5KGV2LmNvbnRleHQsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBnZXRCYXNlQ29udGFpbmVyKCl7XHJcbiAgICAgICAgaWYodGhpcy5faXNBdHRhY2hlZCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJhc2VDb250YWluZXIuc3ZnO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZDMuc2VsZWN0KHRoaXMuYmFzZUNvbnRhaW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QmFzZUNvbnRhaW5lck5vZGUoKXtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QmFzZUNvbnRhaW5lcigpLm5vZGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcmVmaXhDbGFzcyhjbGF6eiwgYWRkRG90KXtcclxuICAgICAgICByZXR1cm4gYWRkRG90PyAnLic6ICcnK3RoaXMuY29uZmlnLmNzc0NsYXNzUHJlZml4K2NsYXp6O1xyXG4gICAgfVxyXG4gICAgY29tcHV0ZVBsb3RTaXplKCkge1xyXG4gICAgICAgIHRoaXMucGxvdC53aWR0aCA9IFV0aWxzLmF2YWlsYWJsZVdpZHRoKHRoaXMuY29uZmlnLndpZHRoLCB0aGlzLmdldEJhc2VDb250YWluZXIoKSwgdGhpcy5wbG90Lm1hcmdpbik7XHJcbiAgICAgICAgdGhpcy5wbG90LmhlaWdodCA9IFV0aWxzLmF2YWlsYWJsZUhlaWdodCh0aGlzLmNvbmZpZy5oZWlnaHQsIHRoaXMuZ2V0QmFzZUNvbnRhaW5lcigpLCB0aGlzLnBsb3QubWFyZ2luKTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2l0aW9uRW5hYmxlZCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc0luaXRpYWxpemVkICYmIHRoaXMuY29uZmlnLnRyYW5zaXRpb247XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDaGFydCwgQ2hhcnRDb25maWd9IGZyb20gXCIuL2NoYXJ0XCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7U3RhdGlzdGljc1V0aWxzfSBmcm9tICcuL3N0YXRpc3RpY3MtdXRpbHMnXHJcbmltcG9ydCB7TGVnZW5kfSBmcm9tICcuL2xlZ2VuZCdcclxuaW1wb3J0IHtTY2F0dGVyUGxvdH0gZnJvbSAnLi9zY2F0dGVycGxvdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBDb3JyZWxhdGlvbk1hdHJpeENvbmZpZyBleHRlbmRzIENoYXJ0Q29uZmlnIHtcclxuXHJcbiAgICBzdmdDbGFzcyA9IHRoaXMuY3NzQ2xhc3NQcmVmaXgrJ2NvcnJlbGF0aW9uLW1hdHJpeCc7XHJcbiAgICBndWlkZXMgPSBmYWxzZTsgLy9zaG93IGF4aXMgZ3VpZGVzXHJcbiAgICBzaG93VG9vbHRpcCA9IHRydWU7IC8vc2hvdyB0b29sdGlwIG9uIGRvdCBob3ZlclxyXG4gICAgc2hvd0xlZ2VuZCA9IHRydWU7XHJcbiAgICBoaWdobGlnaHRMYWJlbHMgPSB0cnVlO1xyXG4gICAgcm90YXRlTGFiZWxzWCA9IHRydWU7XHJcbiAgICByb3RhdGVMYWJlbHNZID0gdHJ1ZTtcclxuICAgIHZhcmlhYmxlcyA9IHtcclxuICAgICAgICBsYWJlbHM6IHVuZGVmaW5lZCxcclxuICAgICAgICBrZXlzOiBbXSwgLy9vcHRpb25hbCBhcnJheSBvZiB2YXJpYWJsZSBrZXlzXHJcbiAgICAgICAgdmFsdWU6IChkLCB2YXJpYWJsZUtleSkgPT4gZFt2YXJpYWJsZUtleV0sIC8vIHZhcmlhYmxlIHZhbHVlIGFjY2Vzc29yXHJcbiAgICAgICAgc2NhbGU6IFwib3JkaW5hbFwiXHJcbiAgICB9O1xyXG4gICAgY29ycmVsYXRpb24gPSB7XHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCIsXHJcbiAgICAgICAgZG9tYWluOiBbLTEsIC0wLjc1LCAtMC41LCAwLCAwLjUsIDAuNzUsIDFdLFxyXG4gICAgICAgIHJhbmdlOiBbXCJkYXJrYmx1ZVwiLCBcImJsdWVcIiwgXCJsaWdodHNreWJsdWVcIiwgXCJ3aGl0ZVwiLCBcIm9yYW5nZXJlZFwiLCBcImNyaW1zb25cIiwgXCJkYXJrcmVkXCJdLFxyXG4gICAgICAgIHZhbHVlOiAoeFZhbHVlcywgeVZhbHVlcykgPT4gU3RhdGlzdGljc1V0aWxzLnNhbXBsZUNvcnJlbGF0aW9uKHhWYWx1ZXMsIHlWYWx1ZXMpXHJcblxyXG4gICAgfTtcclxuICAgIGNlbGwgPSB7XHJcbiAgICAgICAgc2hhcGU6IFwiZWxsaXBzZVwiLCAvL3Bvc3NpYmxlIHZhbHVlczogcmVjdCwgY2lyY2xlLCBlbGxpcHNlXHJcbiAgICAgICAgc2l6ZTogdW5kZWZpbmVkLFxyXG4gICAgICAgIHNpemVNaW46IDE1LFxyXG4gICAgICAgIHNpemVNYXg6IDI1MCxcclxuICAgICAgICBwYWRkaW5nOiAxXHJcbiAgICB9O1xyXG4gICAgbWFyZ2luID0ge1xyXG4gICAgICAgIGxlZnQ6IDYwLFxyXG4gICAgICAgIHJpZ2h0OiA1MCxcclxuICAgICAgICB0b3A6IDMwLFxyXG4gICAgICAgIGJvdHRvbTogNjBcclxuICAgIH07XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBpZiAoY3VzdG9tKSB7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb3JyZWxhdGlvbk1hdHJpeCBleHRlbmRzIENoYXJ0IHtcclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIG5ldyBDb3JyZWxhdGlvbk1hdHJpeENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgQ29ycmVsYXRpb25NYXRyaXhDb25maWcoY29uZmlnKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSB0aGlzLmNvbmZpZy5tYXJnaW47XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnggPSB7fTtcclxuICAgICAgICB0aGlzLnBsb3QuY29ycmVsYXRpb24gPSB7XHJcbiAgICAgICAgICAgIG1hdHJpeDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBjZWxsczogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBjb2xvcjoge30sXHJcbiAgICAgICAgICAgIHNoYXBlOiB7fVxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICB0aGlzLnNldHVwVmFyaWFibGVzKCk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gY29uZi53aWR0aDtcclxuICAgICAgICB2YXIgcGxhY2Vob2xkZXJOb2RlID0gdGhpcy5nZXRCYXNlQ29udGFpbmVyTm9kZSgpO1xyXG4gICAgICAgIHRoaXMucGxvdC5wbGFjZWhvbGRlck5vZGUgPSBwbGFjZWhvbGRlck5vZGU7XHJcblxyXG4gICAgICAgIHZhciBwYXJlbnRXaWR0aCA9IHBsYWNlaG9sZGVyTm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcclxuICAgICAgICBpZiAod2lkdGgpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wbG90LmNlbGxTaXplKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuY2VsbFNpemUgPSBNYXRoLm1heChjb25mLmNlbGwuc2l6ZU1pbiwgTWF0aC5taW4oY29uZi5jZWxsLnNpemVNYXgsICh3aWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0KSAvIHRoaXMucGxvdC52YXJpYWJsZXMubGVuZ3RoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxTaXplID0gdGhpcy5jb25maWcuY2VsbC5zaXplO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLnBsb3QuY2VsbFNpemUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsU2l6ZSA9IE1hdGgubWF4KGNvbmYuY2VsbC5zaXplTWluLCBNYXRoLm1pbihjb25mLmNlbGwuc2l6ZU1heCwgKHBhcmVudFdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQpIC8gdGhpcy5wbG90LnZhcmlhYmxlcy5sZW5ndGgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgd2lkdGggPSB0aGlzLnBsb3QuY2VsbFNpemUgKiB0aGlzLnBsb3QudmFyaWFibGVzLmxlbmd0aCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0O1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBoZWlnaHQgPSB3aWR0aDtcclxuICAgICAgICBpZiAoIWhlaWdodCkge1xyXG4gICAgICAgICAgICBoZWlnaHQgPSBwbGFjZWhvbGRlck5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wbG90LndpZHRoID0gd2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodDtcclxuICAgICAgICB0aGlzLnBsb3QuaGVpZ2h0ID0gdGhpcy5wbG90LndpZHRoO1xyXG5cclxuICAgICAgICB0aGlzLnNldHVwVmFyaWFibGVzU2NhbGVzKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cENvcnJlbGF0aW9uU2NhbGVzKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cENvcnJlbGF0aW9uTWF0cml4KCk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cFZhcmlhYmxlc1NjYWxlcygpIHtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHggPSBwbG90Lng7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZy52YXJpYWJsZXM7XHJcblxyXG4gICAgICAgIC8qICpcclxuICAgICAgICAgKiB2YWx1ZSBhY2Nlc3NvciAtIHJldHVybnMgdGhlIHZhbHVlIHRvIGVuY29kZSBmb3IgYSBnaXZlbiBkYXRhIG9iamVjdC5cclxuICAgICAgICAgKiBzY2FsZSAtIG1hcHMgdmFsdWUgdG8gYSB2aXN1YWwgZGlzcGxheSBlbmNvZGluZywgc3VjaCBhcyBhIHBpeGVsIHBvc2l0aW9uLlxyXG4gICAgICAgICAqIG1hcCBmdW5jdGlvbiAtIG1hcHMgZnJvbSBkYXRhIHZhbHVlIHRvIGRpc3BsYXkgdmFsdWVcclxuICAgICAgICAgKiBheGlzIC0gc2V0cyB1cCBheGlzXHJcbiAgICAgICAgICoqL1xyXG4gICAgICAgIHgudmFsdWUgPSBjb25mLnZhbHVlO1xyXG4gICAgICAgIHguc2NhbGUgPSBkMy5zY2FsZVtjb25mLnNjYWxlXSgpLnJhbmdlQmFuZHMoW3Bsb3Qud2lkdGgsIDBdKTtcclxuICAgICAgICB4Lm1hcCA9IGQgPT4geC5zY2FsZSh4LnZhbHVlKGQpKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwQ29ycmVsYXRpb25TY2FsZXMoKSB7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIGNvcnJDb25mID0gdGhpcy5jb25maWcuY29ycmVsYXRpb247XHJcblxyXG4gICAgICAgIHBsb3QuY29ycmVsYXRpb24uY29sb3Iuc2NhbGUgPSBkMy5zY2FsZVtjb3JyQ29uZi5zY2FsZV0oKS5kb21haW4oY29yckNvbmYuZG9tYWluKS5yYW5nZShjb3JyQ29uZi5yYW5nZSk7XHJcbiAgICAgICAgdmFyIHNoYXBlID0gcGxvdC5jb3JyZWxhdGlvbi5zaGFwZSA9IHt9O1xyXG5cclxuICAgICAgICB2YXIgY2VsbENvbmYgPSB0aGlzLmNvbmZpZy5jZWxsO1xyXG4gICAgICAgIHNoYXBlLnR5cGUgPSBjZWxsQ29uZi5zaGFwZTtcclxuXHJcbiAgICAgICAgdmFyIHNoYXBlU2l6ZSA9IHBsb3QuY2VsbFNpemUgLSBjZWxsQ29uZi5wYWRkaW5nICogMjtcclxuICAgICAgICBpZiAoc2hhcGUudHlwZSA9PSAnY2lyY2xlJykge1xyXG4gICAgICAgICAgICB2YXIgcmFkaXVzTWF4ID0gc2hhcGVTaXplIC8gMjtcclxuICAgICAgICAgICAgc2hhcGUucmFkaXVzU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzAsIDFdKS5yYW5nZShbMiwgcmFkaXVzTWF4XSk7XHJcbiAgICAgICAgICAgIHNoYXBlLnJhZGl1cyA9IGM9PiBzaGFwZS5yYWRpdXNTY2FsZShNYXRoLmFicyhjLnZhbHVlKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzaGFwZS50eXBlID09ICdlbGxpcHNlJykge1xyXG4gICAgICAgICAgICB2YXIgcmFkaXVzTWF4ID0gc2hhcGVTaXplIC8gMjtcclxuICAgICAgICAgICAgc2hhcGUucmFkaXVzU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzAsIDFdKS5yYW5nZShbcmFkaXVzTWF4LCAyXSk7XHJcbiAgICAgICAgICAgIHNoYXBlLnJhZGl1c1ggPSBjPT4gc2hhcGUucmFkaXVzU2NhbGUoTWF0aC5hYnMoYy52YWx1ZSkpO1xyXG4gICAgICAgICAgICBzaGFwZS5yYWRpdXNZID0gcmFkaXVzTWF4O1xyXG5cclxuICAgICAgICAgICAgc2hhcGUucm90YXRlVmFsID0gdiA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodiA9PSAwKSByZXR1cm4gXCIwXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAodiA8IDApIHJldHVybiBcIi00NVwiO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiNDVcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChzaGFwZS50eXBlID09ICdyZWN0Jykge1xyXG4gICAgICAgICAgICBzaGFwZS5zaXplID0gc2hhcGVTaXplO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNldHVwVmFyaWFibGVzKCkge1xyXG5cclxuICAgICAgICB2YXIgdmFyaWFibGVzQ29uZiA9IHRoaXMuY29uZmlnLnZhcmlhYmxlcztcclxuXHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgcGxvdC5kb21haW5CeVZhcmlhYmxlID0ge307XHJcbiAgICAgICAgcGxvdC52YXJpYWJsZXMgPSB2YXJpYWJsZXNDb25mLmtleXM7XHJcbiAgICAgICAgaWYgKCFwbG90LnZhcmlhYmxlcyB8fCAhcGxvdC52YXJpYWJsZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHBsb3QudmFyaWFibGVzID0gVXRpbHMuaW5mZXJWYXJpYWJsZXMoZGF0YSwgdGhpcy5jb25maWcuZ3JvdXBzLmtleSwgdGhpcy5jb25maWcuaW5jbHVkZUluUGxvdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwbG90LmxhYmVscyA9IFtdO1xyXG4gICAgICAgIHBsb3QubGFiZWxCeVZhcmlhYmxlID0ge307XHJcbiAgICAgICAgcGxvdC52YXJpYWJsZXMuZm9yRWFjaCgodmFyaWFibGVLZXksIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHBsb3QuZG9tYWluQnlWYXJpYWJsZVt2YXJpYWJsZUtleV0gPSBkMy5leHRlbnQoZGF0YSwgKGQpID0+IHZhcmlhYmxlc0NvbmYudmFsdWUoZCwgdmFyaWFibGVLZXkpKTtcclxuICAgICAgICAgICAgdmFyIGxhYmVsID0gdmFyaWFibGVLZXk7XHJcbiAgICAgICAgICAgIGlmICh2YXJpYWJsZXNDb25mLmxhYmVscyAmJiB2YXJpYWJsZXNDb25mLmxhYmVscy5sZW5ndGggPiBpbmRleCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxhYmVsID0gdmFyaWFibGVzQ29uZi5sYWJlbHNbaW5kZXhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBsb3QubGFiZWxzLnB1c2gobGFiZWwpO1xyXG4gICAgICAgICAgICBwbG90LmxhYmVsQnlWYXJpYWJsZVt2YXJpYWJsZUtleV0gPSBsYWJlbDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2cocGxvdC5sYWJlbEJ5VmFyaWFibGUpO1xyXG5cclxuICAgIH07XHJcblxyXG5cclxuICAgIHNldHVwQ29ycmVsYXRpb25NYXRyaXgoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIHZhciBtYXRyaXggPSB0aGlzLnBsb3QuY29ycmVsYXRpb24ubWF0cml4ID0gW107XHJcbiAgICAgICAgdmFyIG1hdHJpeENlbGxzID0gdGhpcy5wbG90LmNvcnJlbGF0aW9uLm1hdHJpeC5jZWxscyA9IFtdO1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG5cclxuICAgICAgICB2YXIgdmFyaWFibGVUb1ZhbHVlcyA9IHt9O1xyXG4gICAgICAgIHBsb3QudmFyaWFibGVzLmZvckVhY2goKHYsIGkpID0+IHtcclxuXHJcbiAgICAgICAgICAgIHZhcmlhYmxlVG9WYWx1ZXNbdl0gPSBkYXRhLm1hcChkPT5wbG90LngudmFsdWUoZCwgdikpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBwbG90LnZhcmlhYmxlcy5mb3JFYWNoKCh2MSwgaSkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgcm93ID0gW107XHJcbiAgICAgICAgICAgIG1hdHJpeC5wdXNoKHJvdyk7XHJcblxyXG4gICAgICAgICAgICBwbG90LnZhcmlhYmxlcy5mb3JFYWNoKCh2MiwgaikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvcnIgPSAxO1xyXG4gICAgICAgICAgICAgICAgaWYgKHYxICE9IHYyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29yciA9IHNlbGYuY29uZmlnLmNvcnJlbGF0aW9uLnZhbHVlKHZhcmlhYmxlVG9WYWx1ZXNbdjFdLCB2YXJpYWJsZVRvVmFsdWVzW3YyXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgY2VsbCA9IHtcclxuICAgICAgICAgICAgICAgICAgICByb3dWYXI6IHYxLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbFZhcjogdjIsXHJcbiAgICAgICAgICAgICAgICAgICAgcm93OiBpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbDogaixcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogY29yclxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJvdy5wdXNoKGNlbGwpO1xyXG5cclxuICAgICAgICAgICAgICAgIG1hdHJpeENlbGxzLnB1c2goY2VsbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgdXBkYXRlKG5ld0RhdGEpIHtcclxuICAgICAgICBzdXBlci51cGRhdGUobmV3RGF0YSk7XHJcbiAgICAgICAgLy8gdGhpcy51cGRhdGVcclxuICAgICAgICB0aGlzLnVwZGF0ZUNlbGxzKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWYXJpYWJsZUxhYmVscygpO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnNob3dMZWdlbmQpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVMZWdlbmQoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHVwZGF0ZVZhcmlhYmxlTGFiZWxzKCkge1xyXG4gICAgICAgIHRoaXMucGxvdC5sYWJlbENsYXNzID0gdGhpcy5wcmVmaXhDbGFzcyhcImxhYmVsXCIpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQXhpc1goKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUF4aXNZKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlQXhpc1goKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBsYWJlbENsYXNzID0gcGxvdC5sYWJlbENsYXNzO1xyXG4gICAgICAgIHZhciBsYWJlbFhDbGFzcyA9IGxhYmVsQ2xhc3MgKyBcIi14XCI7XHJcblxyXG4gICAgICAgIHZhciBsYWJlbHMgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIGxhYmVsWENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShwbG90LnZhcmlhYmxlcywgKGQsIGkpPT5pKTtcclxuXHJcbiAgICAgICAgbGFiZWxzLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKS5hdHRyKFwiY2xhc3NcIiwgKGQsIGkpID0+IGxhYmVsQ2xhc3MgKyBcIiBcIiArIGxhYmVsWENsYXNzICsgXCIgXCIgKyBsYWJlbFhDbGFzcyArIFwiLVwiICsgaSk7XHJcblxyXG4gICAgICAgIGxhYmVsc1xyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgKGQsIGkpID0+IGkgKiBwbG90LmNlbGxTaXplICsgcGxvdC5jZWxsU2l6ZSAvIDIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCBwbG90LmhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoXCJkeFwiLCAtMilcclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCA1KVxyXG4gICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpXHJcblxyXG4gICAgICAgICAgICAvLyAuYXR0cihcImRvbWluYW50LWJhc2VsaW5lXCIsIFwiaGFuZ2luZ1wiKVxyXG4gICAgICAgICAgICAudGV4dCh2PT5wbG90LmxhYmVsQnlWYXJpYWJsZVt2XSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5yb3RhdGVMYWJlbHNYKSB7XHJcbiAgICAgICAgICAgIGxhYmVscy5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInJvdGF0ZSgtNDUsIFwiICsgKGkgKiBwbG90LmNlbGxTaXplICsgcGxvdC5jZWxsU2l6ZSAvIDIgICkgKyBcIiwgXCIgKyBwbG90LmhlaWdodCArIFwiKVwiKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG1heFdpZHRoID0gc2VsZi5jb21wdXRlWEF4aXNMYWJlbHNXaWR0aCgpO1xyXG4gICAgICAgIGxhYmVscy5lYWNoKGZ1bmN0aW9uIChsYWJlbCkge1xyXG4gICAgICAgICAgICBVdGlscy5wbGFjZVRleHRXaXRoRWxsaXBzaXNBbmRUb29sdGlwKGQzLnNlbGVjdCh0aGlzKSwgbGFiZWwsIG1heFdpZHRoLCBzZWxmLmNvbmZpZy5zaG93VG9vbHRpcCA/IHNlbGYucGxvdC50b29sdGlwIDogZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsYWJlbHMuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUF4aXNZKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgbGFiZWxDbGFzcyA9IHBsb3QubGFiZWxDbGFzcztcclxuICAgICAgICB2YXIgbGFiZWxZQ2xhc3MgPSBwbG90LmxhYmVsQ2xhc3MgKyBcIi15XCI7XHJcbiAgICAgICAgdmFyIGxhYmVscyA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgbGFiZWxZQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBsb3QudmFyaWFibGVzKTtcclxuXHJcbiAgICAgICAgbGFiZWxzLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKTtcclxuXHJcbiAgICAgICAgbGFiZWxzXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgKGQsIGkpID0+IGkgKiBwbG90LmNlbGxTaXplICsgcGxvdC5jZWxsU2l6ZSAvIDIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHhcIiwgLTIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCAoZCwgaSkgPT4gbGFiZWxDbGFzcyArIFwiIFwiICsgbGFiZWxZQ2xhc3MgKyBcIiBcIiArIGxhYmVsWUNsYXNzICsgXCItXCIgKyBpKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcImRvbWluYW50LWJhc2VsaW5lXCIsIFwiaGFuZ2luZ1wiKVxyXG4gICAgICAgICAgICAudGV4dCh2PT5wbG90LmxhYmVsQnlWYXJpYWJsZVt2XSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5yb3RhdGVMYWJlbHNZKSB7XHJcbiAgICAgICAgICAgIGxhYmVsc1xyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwicm90YXRlKC00NSwgXCIgKyAwICsgXCIsIFwiICsgKGkgKiBwbG90LmNlbGxTaXplICsgcGxvdC5jZWxsU2l6ZSAvIDIpICsgXCIpXCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG1heFdpZHRoID0gc2VsZi5jb21wdXRlWUF4aXNMYWJlbHNXaWR0aCgpO1xyXG4gICAgICAgIGxhYmVscy5lYWNoKGZ1bmN0aW9uIChsYWJlbCkge1xyXG4gICAgICAgICAgICBVdGlscy5wbGFjZVRleHRXaXRoRWxsaXBzaXNBbmRUb29sdGlwKGQzLnNlbGVjdCh0aGlzKSwgbGFiZWwsIG1heFdpZHRoLCBzZWxmLmNvbmZpZy5zaG93VG9vbHRpcCA/IHNlbGYucGxvdC50b29sdGlwIDogZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsYWJlbHMuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXB1dGVZQXhpc0xhYmVsc1dpZHRoKCkge1xyXG4gICAgICAgIHZhciBtYXhXaWR0aCA9IHRoaXMucGxvdC5tYXJnaW4ubGVmdDtcclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLnJvdGF0ZUxhYmVsc1kpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1heFdpZHRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWF4V2lkdGggKj0gVXRpbHMuU1FSVF8yO1xyXG4gICAgICAgIHZhciBmb250U2l6ZSA9IDExOyAvL3RvZG8gY2hlY2sgYWN0dWFsIGZvbnQgc2l6ZVxyXG4gICAgICAgIG1heFdpZHRoIC09IGZvbnRTaXplIC8gMjtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1heFdpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXB1dGVYQXhpc0xhYmVsc1dpZHRoKG9mZnNldCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcucm90YXRlTGFiZWxzWCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wbG90LmNlbGxTaXplIC0gMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHNpemUgPSB0aGlzLnBsb3QubWFyZ2luLmJvdHRvbTtcclxuICAgICAgICBzaXplICo9IFV0aWxzLlNRUlRfMjtcclxuICAgICAgICB2YXIgZm9udFNpemUgPSAxMTsgLy90b2RvIGNoZWNrIGFjdHVhbCBmb250IHNpemVcclxuICAgICAgICBzaXplIC09IGZvbnRTaXplIC8gMjtcclxuICAgICAgICByZXR1cm4gc2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVDZWxscygpIHtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBjZWxsQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwiY2VsbFwiKTtcclxuICAgICAgICB2YXIgY2VsbFNoYXBlID0gcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS50eXBlO1xyXG5cclxuICAgICAgICB2YXIgY2VsbHMgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwiZy5cIiArIGNlbGxDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGxvdC5jb3JyZWxhdGlvbi5tYXRyaXguY2VsbHMpO1xyXG5cclxuICAgICAgICB2YXIgY2VsbEVudGVyRyA9IGNlbGxzLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuY2xhc3NlZChjZWxsQ2xhc3MsIHRydWUpO1xyXG4gICAgICAgIGNlbGxzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYz0+IFwidHJhbnNsYXRlKFwiICsgKHBsb3QuY2VsbFNpemUgKiBjLmNvbCArIHBsb3QuY2VsbFNpemUgLyAyKSArIFwiLFwiICsgKHBsb3QuY2VsbFNpemUgKiBjLnJvdyArIHBsb3QuY2VsbFNpemUgLyAyKSArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgY2VsbHMuY2xhc3NlZChzZWxmLmNvbmZpZy5jc3NDbGFzc1ByZWZpeCArIFwic2VsZWN0YWJsZVwiLCAhIXNlbGYuc2NhdHRlclBsb3QpO1xyXG5cclxuICAgICAgICB2YXIgc2VsZWN0b3IgPSBcIio6bm90KC5jZWxsLXNoYXBlLVwiICsgY2VsbFNoYXBlICsgXCIpXCI7XHJcblxyXG4gICAgICAgIHZhciB3cm9uZ1NoYXBlcyA9IGNlbGxzLnNlbGVjdEFsbChzZWxlY3Rvcik7XHJcbiAgICAgICAgd3JvbmdTaGFwZXMucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIHZhciBzaGFwZXMgPSBjZWxscy5zZWxlY3RPckFwcGVuZChjZWxsU2hhcGUgKyBcIi5jZWxsLXNoYXBlLVwiICsgY2VsbFNoYXBlKTtcclxuXHJcbiAgICAgICAgaWYgKHBsb3QuY29ycmVsYXRpb24uc2hhcGUudHlwZSA9PSAnY2lyY2xlJykge1xyXG5cclxuICAgICAgICAgICAgc2hhcGVzXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInJcIiwgcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5yYWRpdXMpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImN4XCIsIDApXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImN5XCIsIDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBsb3QuY29ycmVsYXRpb24uc2hhcGUudHlwZSA9PSAnZWxsaXBzZScpIHtcclxuICAgICAgICAgICAgLy8gY2VsbHMuYXR0cihcInRyYW5zZm9ybVwiLCBjPT4gXCJ0cmFuc2xhdGUoMzAwLDE1MCkgcm90YXRlKFwiK3Bsb3QuY29ycmVsYXRpb24uc2hhcGUucm90YXRlVmFsKGMudmFsdWUpK1wiKVwiKTtcclxuICAgICAgICAgICAgc2hhcGVzXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInJ4XCIsIHBsb3QuY29ycmVsYXRpb24uc2hhcGUucmFkaXVzWClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwicnlcIiwgcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5yYWRpdXNZKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCAwKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCAwKVxyXG5cclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGM9PiBcInJvdGF0ZShcIiArIHBsb3QuY29ycmVsYXRpb24uc2hhcGUucm90YXRlVmFsKGMudmFsdWUpICsgXCIpXCIpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGlmIChwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnR5cGUgPT0gJ3JlY3QnKSB7XHJcbiAgICAgICAgICAgIHNoYXBlc1xyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnNpemUpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnNpemUpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInhcIiwgLXBsb3QuY2VsbFNpemUgLyAyKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIC1wbG90LmNlbGxTaXplIC8gMik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNoYXBlcy5zdHlsZShcImZpbGxcIiwgYz0+IHBsb3QuY29ycmVsYXRpb24uY29sb3Iuc2NhbGUoYy52YWx1ZSkpO1xyXG5cclxuICAgICAgICB2YXIgbW91c2VvdmVyQ2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgdmFyIG1vdXNlb3V0Q2FsbGJhY2tzID0gW107XHJcblxyXG4gICAgICAgIGlmIChwbG90LnRvb2x0aXApIHtcclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3ZlckNhbGxiYWNrcy5wdXNoKGM9PiB7XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDIwMClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIC45KTtcclxuICAgICAgICAgICAgICAgIHZhciBodG1sID0gYy52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC5odG1sKGh0bWwpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZDMuZXZlbnQucGFnZVggKyA1KSArIFwicHhcIilcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBtb3VzZW91dENhbGxiYWNrcy5wdXNoKGM9PiB7XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLmhpZ2hsaWdodExhYmVscykge1xyXG4gICAgICAgICAgICB2YXIgaGlnaGxpZ2h0Q2xhc3MgPSBzZWxmLmNvbmZpZy5jc3NDbGFzc1ByZWZpeCArIFwiaGlnaGxpZ2h0XCI7XHJcbiAgICAgICAgICAgIHZhciB4TGFiZWxDbGFzcyA9IGM9PnBsb3QubGFiZWxDbGFzcyArIFwiLXgtXCIgKyBjLmNvbDtcclxuICAgICAgICAgICAgdmFyIHlMYWJlbENsYXNzID0gYz0+cGxvdC5sYWJlbENsYXNzICsgXCIteS1cIiArIGMucm93O1xyXG5cclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3ZlckNhbGxiYWNrcy5wdXNoKGM9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB4TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHlMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCB0cnVlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLnB1c2goYz0+IHtcclxuICAgICAgICAgICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgeExhYmVsQ2xhc3MoYykpLmNsYXNzZWQoaGlnaGxpZ2h0Q2xhc3MsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgeUxhYmVsQ2xhc3MoYykpLmNsYXNzZWQoaGlnaGxpZ2h0Q2xhc3MsIGZhbHNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgY2VsbHMub24oXCJtb3VzZW92ZXJcIiwgYyA9PiB7XHJcbiAgICAgICAgICAgIG1vdXNlb3ZlckNhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrPT5jYWxsYmFjayhjKSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgYyA9PiB7XHJcbiAgICAgICAgICAgICAgICBtb3VzZW91dENhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrPT5jYWxsYmFjayhjKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjZWxscy5vbihcImNsaWNrXCIsIGM9PiB7XHJcbiAgICAgICAgICAgIHNlbGYudHJpZ2dlcihcImNlbGwtc2VsZWN0ZWRcIiwgYyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICBjZWxscy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHVwZGF0ZUxlZ2VuZCgpIHtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIGxlZ2VuZFggPSB0aGlzLnBsb3Qud2lkdGggKyAxMDtcclxuICAgICAgICB2YXIgbGVnZW5kWSA9IDA7XHJcbiAgICAgICAgdmFyIGJhcldpZHRoID0gMTA7XHJcbiAgICAgICAgdmFyIGJhckhlaWdodCA9IHRoaXMucGxvdC5oZWlnaHQgLSAyO1xyXG4gICAgICAgIHZhciBzY2FsZSA9IHBsb3QuY29ycmVsYXRpb24uY29sb3Iuc2NhbGU7XHJcblxyXG4gICAgICAgIHBsb3QubGVnZW5kID0gbmV3IExlZ2VuZCh0aGlzLnN2ZywgdGhpcy5zdmdHLCBzY2FsZSwgbGVnZW5kWCwgbGVnZW5kWSkubGluZWFyR3JhZGllbnRCYXIoYmFyV2lkdGgsIGJhckhlaWdodCk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBhdHRhY2hTY2F0dGVyUGxvdChjb250YWluZXJTZWxlY3RvciwgY29uZmlnKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBjb25maWcgPSBjb25maWcgfHwge307XHJcblxyXG5cclxuICAgICAgICB2YXIgc2NhdHRlclBsb3RDb25maWcgPSB7XHJcbiAgICAgICAgICAgIGhlaWdodDogc2VsZi5wbG90LmhlaWdodCArIHNlbGYuY29uZmlnLm1hcmdpbi50b3AgKyBzZWxmLmNvbmZpZy5tYXJnaW4uYm90dG9tLFxyXG4gICAgICAgICAgICB3aWR0aDogc2VsZi5wbG90LmhlaWdodCArIHNlbGYuY29uZmlnLm1hcmdpbi50b3AgKyBzZWxmLmNvbmZpZy5tYXJnaW4uYm90dG9tLFxyXG4gICAgICAgICAgICBncm91cHM6IHtcclxuICAgICAgICAgICAgICAgIGtleTogc2VsZi5jb25maWcuZ3JvdXBzLmtleSxcclxuICAgICAgICAgICAgICAgIGxhYmVsOiBzZWxmLmNvbmZpZy5ncm91cHMubGFiZWxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ3VpZGVzOiB0cnVlLFxyXG4gICAgICAgICAgICBzaG93TGVnZW5kOiBmYWxzZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2NhdHRlclBsb3QgPSB0cnVlO1xyXG5cclxuICAgICAgICBzY2F0dGVyUGxvdENvbmZpZyA9IFV0aWxzLmRlZXBFeHRlbmQoc2NhdHRlclBsb3RDb25maWcsIGNvbmZpZyk7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5vbihcImNlbGwtc2VsZWN0ZWRcIiwgYz0+IHtcclxuXHJcblxyXG4gICAgICAgICAgICBzY2F0dGVyUGxvdENvbmZpZy54ID0ge1xyXG4gICAgICAgICAgICAgICAga2V5OiBjLnJvd1ZhcixcclxuICAgICAgICAgICAgICAgIGxhYmVsOiBzZWxmLnBsb3QubGFiZWxCeVZhcmlhYmxlW2Mucm93VmFyXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBzY2F0dGVyUGxvdENvbmZpZy55ID0ge1xyXG4gICAgICAgICAgICAgICAga2V5OiBjLmNvbFZhcixcclxuICAgICAgICAgICAgICAgIGxhYmVsOiBzZWxmLnBsb3QubGFiZWxCeVZhcmlhYmxlW2MuY29sVmFyXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5zY2F0dGVyUGxvdCAmJiBzZWxmLnNjYXR0ZXJQbG90ICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNjYXR0ZXJQbG90LnNldENvbmZpZyhzY2F0dGVyUGxvdENvbmZpZykuaW5pdCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zY2F0dGVyUGxvdCA9IG5ldyBTY2F0dGVyUGxvdChjb250YWluZXJTZWxlY3Rvciwgc2VsZi5kYXRhLCBzY2F0dGVyUGxvdENvbmZpZyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF0dGFjaChcIlNjYXR0ZXJQbG90XCIsIHNlbGYuc2NhdHRlclBsb3QpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEQzRXh0ZW5zaW9uc3tcclxuXHJcbiAgICBzdGF0aWMgZXh0ZW5kKCl7XHJcblxyXG4gICAgICAgIGQzLnNlbGVjdGlvbi5lbnRlci5wcm90b3R5cGUuaW5zZXJ0U2VsZWN0b3IgPVxyXG4gICAgICAgICAgICBkMy5zZWxlY3Rpb24ucHJvdG90eXBlLmluc2VydFNlbGVjdG9yID0gZnVuY3Rpb24oc2VsZWN0b3IsIGJlZm9yZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFV0aWxzLmluc2VydFNlbGVjdG9yKHRoaXMsIHNlbGVjdG9yLCBiZWZvcmUpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgZDMuc2VsZWN0aW9uLmVudGVyLnByb3RvdHlwZS5hcHBlbmRTZWxlY3RvciA9XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdGlvbi5wcm90b3R5cGUuYXBwZW5kU2VsZWN0b3IgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFV0aWxzLmFwcGVuZFNlbGVjdG9yKHRoaXMsIHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZDMuc2VsZWN0aW9uLmVudGVyLnByb3RvdHlwZS5zZWxlY3RPckFwcGVuZCA9XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdGlvbi5wcm90b3R5cGUuc2VsZWN0T3JBcHBlbmQgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFV0aWxzLnNlbGVjdE9yQXBwZW5kKHRoaXMsIHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZDMuc2VsZWN0aW9uLmVudGVyLnByb3RvdHlwZS5zZWxlY3RPckluc2VydCA9XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdGlvbi5wcm90b3R5cGUuc2VsZWN0T3JJbnNlcnQgPSBmdW5jdGlvbihzZWxlY3RvciwgYmVmb3JlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVXRpbHMuc2VsZWN0T3JJbnNlcnQodGhpcywgc2VsZWN0b3IsIGJlZm9yZSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG5cclxuXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDaGFydCwgQ2hhcnRDb25maWd9IGZyb20gXCIuL2NoYXJ0XCI7XHJcbmltcG9ydCB7SGVhdG1hcCwgSGVhdG1hcENvbmZpZ30gZnJvbSBcIi4vaGVhdG1hcFwiO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5pbXBvcnQge1N0YXRpc3RpY3NVdGlsc30gZnJvbSAnLi9zdGF0aXN0aWNzLXV0aWxzJ1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBIZWF0bWFwVGltZVNlcmllc0NvbmZpZyBleHRlbmRzIEhlYXRtYXBDb25maWcge1xyXG4gICAgeCA9IHtcclxuICAgICAgICBmaWxsTWlzc2luZzogZmFsc2UsIC8vIGZpbGwgbWlzc2luZyB2YWx1ZXMgdXNpbmcgaW50ZXJ2YWwgYW5kIGludGVydmFsU3RlcFxyXG4gICAgICAgIGludGVydmFsOiB1bmRlZmluZWQsIC8vdXNlZCBpbiBmaWxsaW5nIG1pc3NpbmcgdGlja3NcclxuICAgICAgICBpbnRlcnZhbFN0ZXA6IDEsXHJcbiAgICAgICAgZm9ybWF0OiB1bmRlZmluZWQsIC8vaW5wdXQgZGF0YSBkMyB0aW1lIGZvcm1hdFxyXG4gICAgICAgIGRpc3BsYXlGb3JtYXQ6IHVuZGVmaW5lZCwvL2QzIHRpbWUgZm9ybWF0IGZvciBkaXNwbGF5XHJcbiAgICAgICAgaW50ZXJ2YWxUb0Zvcm1hdHM6IFsgLy91c2VkIHRvIGd1ZXNzIGludGVydmFsIGFuZCBmb3JtYXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3llYXInLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0czogW1wiJVlcIl1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ21vbnRoJyxcclxuICAgICAgICAgICAgICAgIGZvcm1hdHM6IFtcIiVZLSVtXCJdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdkYXknLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0czogW1wiJVktJW0tJWRcIl1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2hvdXInLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0czogWyclSCcsICclWS0lbS0lZCAlSCddXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdtaW51dGUnLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0czogWyclSDolTScsICclWS0lbS0lZCAlSDolTSddXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdzZWNvbmQnLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0czogWyclSDolTTolUycsICclWS0lbS0lZCAlSDolTTolUyddXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdLFxyXG5cclxuICAgICAgICBzb3J0Q29tcGFyYXRvcjogZnVuY3Rpb24gc29ydENvbXBhcmF0b3IoYSwgYikge1xyXG4gICAgICAgICAgICByZXR1cm4gVXRpbHMuaXNTdHJpbmcoYSkgPyAgYS5sb2NhbGVDb21wYXJlKGIpIDogIGEgLSBiO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9ybWF0dGVyOiB1bmRlZmluZWRcclxuICAgIH07XHJcbiAgICB6ID0ge1xyXG4gICAgICAgIGZpbGxNaXNzaW5nOiB0cnVlIC8vIGZpaWxsIG1pc3NpbmcgdmFsdWVzIHdpdGggbmVhcmVzdCBwcmV2aW91cyB2YWx1ZVxyXG4gICAgfTtcclxuXHJcbiAgICBsZWdlbmQgPSB7XHJcbiAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB2YXIgc3VmZml4ID0gXCJcIjtcclxuICAgICAgICAgICAgaWYgKHYgLyAxMDAwMDAwID49IDEpIHtcclxuICAgICAgICAgICAgICAgIHN1ZmZpeCA9IFwiIE1cIjtcclxuICAgICAgICAgICAgICAgIHYgPSBOdW1iZXIodiAvIDEwMDAwMDApLnRvRml4ZWQoMyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIG5mID0gSW50bC5OdW1iZXJGb3JtYXQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5mLmZvcm1hdCh2KSArIHN1ZmZpeDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIGlmIChjdXN0b20pIHtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBIZWF0bWFwVGltZVNlcmllcyBleHRlbmRzIEhlYXRtYXAge1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IEhlYXRtYXBUaW1lU2VyaWVzQ29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBIZWF0bWFwVGltZVNlcmllc0NvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgc2V0dXBWYWx1ZXNCZWZvcmVHcm91cHNTb3J0KCkge1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueC50aW1lRm9ybWF0ID0gdGhpcy5jb25maWcueC5mb3JtYXQ7XHJcbiAgICAgICAgaWYodGhpcy5jb25maWcueC5kaXNwbGF5Rm9ybWF0ICYmICF0aGlzLnBsb3QueC50aW1lRm9ybWF0KXtcclxuICAgICAgICAgICAgdGhpcy5ndWVzc1RpbWVGb3JtYXQoKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBzdXBlci5zZXR1cFZhbHVlc0JlZm9yZUdyb3Vwc1NvcnQoKTtcclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLnguZmlsbE1pc3NpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRUaW1lRm9ybWF0QW5kSW50ZXJ2YWwoKTtcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnguaW50ZXJ2YWxTdGVwID0gdGhpcy5jb25maWcueC5pbnRlcnZhbFN0ZXAgfHwgMTtcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LngudGltZVBhcnNlciA9IHRoaXMuZ2V0VGltZVBhcnNlcigpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHRoaXMucGxvdC54LnVuaXF1ZVZhbHVlcy5zb3J0KHRoaXMuY29uZmlnLnguc29ydENvbXBhcmF0b3IpO1xyXG5cclxuICAgICAgICB2YXIgcHJldiA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC54LnVuaXF1ZVZhbHVlcy5mb3JFYWNoKCh4LCBpKT0+IHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLnBhcnNlVGltZSh4KTtcclxuICAgICAgICAgICAgaWYgKHByZXYgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHByZXYgPSBjdXJyZW50O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgbmV4dCA9IHNlbGYubmV4dFRpbWVUaWNrVmFsdWUocHJldik7XHJcbiAgICAgICAgICAgIHZhciBtaXNzaW5nID0gW107XHJcbiAgICAgICAgICAgIHZhciBpdGVyYXRpb24gPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoc2VsZi5jb21wYXJlVGltZVZhbHVlcyhuZXh0LCBjdXJyZW50KTw9MCkge1xyXG4gICAgICAgICAgICAgICAgaXRlcmF0aW9uKys7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlcmF0aW9uID4gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgdmFyIHRpbWVTdHJpbmcgPSBzZWxmLmZvcm1hdFRpbWUobmV4dCk7XHJcbiAgICAgICAgICAgICAgICBkW3RoaXMuY29uZmlnLngua2V5XSA9IHRpbWVTdHJpbmc7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi51cGRhdGVHcm91cHMoZCwgdGltZVN0cmluZywgc2VsZi5wbG90LnguZ3JvdXBzLCBzZWxmLmNvbmZpZy54Lmdyb3Vwcyk7XHJcbiAgICAgICAgICAgICAgICBtaXNzaW5nLnB1c2gobmV4dCk7XHJcbiAgICAgICAgICAgICAgICBuZXh0ID0gc2VsZi5uZXh0VGltZVRpY2tWYWx1ZShuZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcmV2ID0gY3VycmVudDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VUaW1lKHgpIHtcclxuICAgICAgICB2YXIgcGFyc2VyID0gdGhpcy5nZXRUaW1lUGFyc2VyKCk7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZSh4KTtcclxuICAgIH1cclxuXHJcbiAgICBmb3JtYXRUaW1lKGRhdGUpe1xyXG4gICAgICAgIHZhciBwYXJzZXIgPSB0aGlzLmdldFRpbWVQYXJzZXIoKTtcclxuICAgICAgICByZXR1cm4gcGFyc2VyKGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcm1hdFZhbHVlWCh2YWx1ZSkgeyAvL3VzZWQgb25seSBmb3IgZGlzcGxheVxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy54LmZvcm1hdHRlcikgcmV0dXJuIHRoaXMuY29uZmlnLnguZm9ybWF0dGVyLmNhbGwodGhpcy5jb25maWcsIHZhbHVlKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5jb25maWcueC5kaXNwbGF5Rm9ybWF0KXtcclxuICAgICAgICAgICAgdmFyIGRhdGUgPSB0aGlzLnBhcnNlVGltZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkMy50aW1lLmZvcm1hdCh0aGlzLmNvbmZpZy54LmRpc3BsYXlGb3JtYXQpKGRhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIXRoaXMucGxvdC54LnRpbWVGb3JtYXQpIHJldHVybiB2YWx1ZTtcclxuXHJcbiAgICAgICAgaWYoVXRpbHMuaXNEYXRlKHZhbHVlKSl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZvcm1hdFRpbWUodmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBhcmVUaW1lVmFsdWVzKGEsIGIpe1xyXG4gICAgICAgIHJldHVybiBhLWI7XHJcbiAgICB9XHJcblxyXG4gICAgdGltZVZhbHVlc0VxdWFsKGEsIGIpIHtcclxuICAgICAgICB2YXIgcGFyc2VyID0gdGhpcy5wbG90LngudGltZVBhcnNlcjtcclxuICAgICAgICByZXR1cm4gcGFyc2VyKGEpID09PSBwYXJzZXIoYik7XHJcbiAgICB9XHJcblxyXG4gICAgbmV4dFRpbWVUaWNrVmFsdWUodCkge1xyXG4gICAgICAgIHZhciBpbnRlcnZhbCA9IHRoaXMucGxvdC54LmludGVydmFsO1xyXG4gICAgICAgIHJldHVybiBkMy50aW1lW2ludGVydmFsXS5vZmZzZXQodCwgdGhpcy5wbG90LnguaW50ZXJ2YWxTdGVwKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0UGxvdCgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcuei5maWxsTWlzc2luZykge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWF0cml4LmZvckVhY2goKHJvdywgcm93SW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBwcmV2Um93VmFsdWUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICByb3cuZm9yRWFjaCgoY2VsbCwgY29sSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbC52YWx1ZSA9PT0gdW5kZWZpbmVkICYmIHByZXZSb3dWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwudmFsdWUgPSBwcmV2Um93VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwubWlzc2luZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHByZXZSb3dWYWx1ZSA9IGNlbGwudmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKG5ld0RhdGEpIHtcclxuICAgICAgICBzdXBlci51cGRhdGUobmV3RGF0YSk7XHJcblxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgaW5pdFRpbWVGb3JtYXRBbmRJbnRlcnZhbCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnguaW50ZXJ2YWwgPSB0aGlzLmNvbmZpZy54LmludGVydmFsO1xyXG5cclxuICAgICAgICBpZighdGhpcy5wbG90LngudGltZUZvcm1hdCl7XHJcbiAgICAgICAgICAgIHRoaXMuZ3Vlc3NUaW1lRm9ybWF0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZighdGhpcy5wbG90LnguaW50ZXJ2YWwgJiYgdGhpcy5wbG90LngudGltZUZvcm1hdCl7XHJcbiAgICAgICAgICAgIHRoaXMuZ3Vlc3NJbnRlcnZhbCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBndWVzc1RpbWVGb3JtYXQoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpIDwgc2VsZi5jb25maWcueC5pbnRlcnZhbFRvRm9ybWF0cy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGxldCBpbnRlcnZhbEZvcm1hdCA9IHNlbGYuY29uZmlnLnguaW50ZXJ2YWxUb0Zvcm1hdHNbaV07XHJcbiAgICAgICAgICAgIHZhciBmb3JtYXQgPSBudWxsO1xyXG4gICAgICAgICAgICB2YXIgZm9ybWF0TWF0Y2ggPSBpbnRlcnZhbEZvcm1hdC5mb3JtYXRzLnNvbWUoZj0+e1xyXG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gZjtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJzZXIgPSBkMy50aW1lLmZvcm1hdChmKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnBsb3QueC51bmlxdWVWYWx1ZXMuZXZlcnkoeD0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZXIucGFyc2UoeCkgIT09IG51bGxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYoZm9ybWF0TWF0Y2gpe1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wbG90LngudGltZUZvcm1hdCA9IGZvcm1hdDtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHdWVzc2VkIHRpbWVGb3JtYXQnLCBmb3JtYXQpO1xyXG4gICAgICAgICAgICAgICAgaWYoIXNlbGYucGxvdC54LmludGVydmFsKXtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnBsb3QueC5pbnRlcnZhbCA9IGludGVydmFsRm9ybWF0Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0d1ZXNzZWQgaW50ZXJ2YWwnLCBzZWxmLnBsb3QueC5pbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ3Vlc3NJbnRlcnZhbCgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGkgPCBzZWxmLmNvbmZpZy54LmludGVydmFsVG9Gb3JtYXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBpbnRlcnZhbEZvcm1hdCA9IHNlbGYuY29uZmlnLnguaW50ZXJ2YWxUb0Zvcm1hdHNbaV07XHJcblxyXG4gICAgICAgICAgICBpZihpbnRlcnZhbEZvcm1hdC5mb3JtYXRzLmluZGV4T2Yoc2VsZi5wbG90LngudGltZUZvcm1hdCkgPj0gMCl7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QueC5pbnRlcnZhbCA9IGludGVydmFsRm9ybWF0Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnR3Vlc3NlZCBpbnRlcnZhbCcsIHNlbGYucGxvdC54LmludGVydmFsKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXRUaW1lUGFyc2VyKCkge1xyXG4gICAgICAgIGlmKCF0aGlzLnBsb3QueC50aW1lUGFyc2VyKXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LngudGltZVBhcnNlciA9IGQzLnRpbWUuZm9ybWF0KHRoaXMucGxvdC54LnRpbWVGb3JtYXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5wbG90LngudGltZVBhcnNlcjtcclxuICAgIH1cclxufVxyXG5cclxuIiwiaW1wb3J0IHtDaGFydCwgQ2hhcnRDb25maWd9IGZyb20gXCIuL2NoYXJ0XCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7TGVnZW5kfSBmcm9tICcuL2xlZ2VuZCdcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgSGVhdG1hcENvbmZpZyBleHRlbmRzIENoYXJ0Q29uZmlnIHtcclxuXHJcbiAgICBzdmdDbGFzcyA9ICdvZGMtaGVhdG1hcCc7XHJcbiAgICBzaG93VG9vbHRpcCA9IHRydWU7IC8vc2hvdyB0b29sdGlwIG9uIGRvdCBob3ZlclxyXG4gICAgdG9vbHRpcCA9IHtcclxuICAgICAgICBub0RhdGFUZXh0OiBcIk4vQVwiXHJcbiAgICB9O1xyXG4gICAgc2hvd0xlZ2VuZCA9IHRydWU7XHJcbiAgICBsZWdlbmQgPSB7XHJcbiAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgIHJvdGF0ZUxhYmVsczogZmFsc2UsXHJcbiAgICAgICAgZGVjaW1hbFBsYWNlczogdW5kZWZpbmVkLFxyXG4gICAgICAgIGZvcm1hdHRlcjogdiA9PiB0aGlzLmxlZ2VuZC5kZWNpbWFsUGxhY2VzID09PSB1bmRlZmluZWQgPyB2IDogTnVtYmVyKHYpLnRvRml4ZWQodGhpcy5sZWdlbmQuZGVjaW1hbFBsYWNlcylcclxuICAgIH1cclxuICAgIGhpZ2hsaWdodExhYmVscyA9IHRydWU7XHJcbiAgICB4ID0gey8vIFggYXhpcyBjb25maWdcclxuICAgICAgICB0aXRsZTogJycsIC8vIGF4aXMgdGl0bGVcclxuICAgICAgICBrZXk6IDAsXHJcbiAgICAgICAgdmFsdWU6IChkKSA9PiBkW3RoaXMueC5rZXldLCAvLyB4IHZhbHVlIGFjY2Vzc29yXHJcbiAgICAgICAgcm90YXRlTGFiZWxzOiB0cnVlLFxyXG4gICAgICAgIHNvcnRMYWJlbHM6IGZhbHNlLFxyXG4gICAgICAgIHNvcnRDb21wYXJhdG9yOiAoYSwgYik9PiBVdGlscy5pc051bWJlcihhKSA/IGEgLSBiIDogYS5sb2NhbGVDb21wYXJlKGIpLFxyXG4gICAgICAgIGdyb3Vwczoge1xyXG4gICAgICAgICAgICBrZXlzOiBbXSxcclxuICAgICAgICAgICAgbGFiZWxzOiBbXSxcclxuICAgICAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IGRba2V5XSxcclxuICAgICAgICAgICAgb3ZlcmxhcDoge1xyXG4gICAgICAgICAgICAgICAgdG9wOiAyMCxcclxuICAgICAgICAgICAgICAgIGJvdHRvbTogMjBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9ybWF0dGVyOiB1bmRlZmluZWQgLy8gdmFsdWUgZm9ybWF0dGVyIGZ1bmN0aW9uXHJcblxyXG4gICAgfTtcclxuICAgIHkgPSB7Ly8gWSBheGlzIGNvbmZpZ1xyXG4gICAgICAgIHRpdGxlOiAnJywgLy8gYXhpcyB0aXRsZSxcclxuICAgICAgICByb3RhdGVMYWJlbHM6IHRydWUsXHJcbiAgICAgICAga2V5OiAxLFxyXG4gICAgICAgIHZhbHVlOiAoZCkgPT4gZFt0aGlzLnkua2V5XSwgLy8geSB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgIHNvcnRMYWJlbHM6IGZhbHNlLFxyXG4gICAgICAgIHNvcnRDb21wYXJhdG9yOiAoYSwgYik9PiBVdGlscy5pc051bWJlcihiKSA/IGIgLSBhIDogYi5sb2NhbGVDb21wYXJlKGEpLFxyXG4gICAgICAgIGdyb3Vwczoge1xyXG4gICAgICAgICAgICBrZXlzOiBbXSxcclxuICAgICAgICAgICAgbGFiZWxzOiBbXSxcclxuICAgICAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IGRba2V5XSxcclxuICAgICAgICAgICAgb3ZlcmxhcDoge1xyXG4gICAgICAgICAgICAgICAgbGVmdDogMjAsXHJcbiAgICAgICAgICAgICAgICByaWdodDogMjBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9ybWF0dGVyOiB1bmRlZmluZWQvLyB2YWx1ZSBmb3JtYXR0ZXIgZnVuY3Rpb25cclxuICAgIH07XHJcbiAgICB6ID0ge1xyXG4gICAgICAgIGtleTogMixcclxuICAgICAgICB2YWx1ZTogKGQpID0+IGRbdGhpcy56LmtleV0sXHJcbiAgICAgICAgbm90QXZhaWxhYmxlVmFsdWU6ICh2KSA9PiB2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCxcclxuXHJcbiAgICAgICAgZGVjaW1hbFBsYWNlczogdW5kZWZpbmVkLFxyXG4gICAgICAgIGZvcm1hdHRlcjogdiA9PiB0aGlzLnouZGVjaW1hbFBsYWNlcyA9PT0gdW5kZWZpbmVkID8gdiA6IE51bWJlcih2KS50b0ZpeGVkKHRoaXMuei5kZWNpbWFsUGxhY2VzKS8vIHZhbHVlIGZvcm1hdHRlciBmdW5jdGlvblxyXG5cclxuICAgIH07XHJcbiAgICBjb2xvciA9IHtcclxuICAgICAgICBub0RhdGFDb2xvcjogXCJ3aGl0ZVwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiLFxyXG4gICAgICAgIHJldmVyc2VTY2FsZTogZmFsc2UsXHJcbiAgICAgICAgcmFuZ2U6IFtcImRhcmtibHVlXCIsIFwibGlnaHRza3libHVlXCIsIFwib3JhbmdlXCIsIFwiY3JpbXNvblwiLCBcImRhcmtyZWRcIl1cclxuICAgIH07XHJcbiAgICBjZWxsID0ge1xyXG4gICAgICAgIHdpZHRoOiB1bmRlZmluZWQsXHJcbiAgICAgICAgaGVpZ2h0OiB1bmRlZmluZWQsXHJcbiAgICAgICAgc2l6ZU1pbjogMTUsXHJcbiAgICAgICAgc2l6ZU1heDogMjUwLFxyXG4gICAgICAgIHBhZGRpbmc6IDBcclxuICAgIH07XHJcbiAgICBtYXJnaW4gPSB7XHJcbiAgICAgICAgbGVmdDogNjAsXHJcbiAgICAgICAgcmlnaHQ6IDUwLFxyXG4gICAgICAgIHRvcDogMzAsXHJcbiAgICAgICAgYm90dG9tOiA4MFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIGlmIChjdXN0b20pIHtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLy9UT0RPIHJlZmFjdG9yXHJcbmV4cG9ydCBjbGFzcyBIZWF0bWFwIGV4dGVuZHMgQ2hhcnQge1xyXG5cclxuICAgIHN0YXRpYyBtYXhHcm91cEdhcFNpemUgPSAyNDtcclxuICAgIHN0YXRpYyBncm91cFRpdGxlUmVjdEhlaWdodCA9IDY7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IEhlYXRtYXBDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZykge1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IEhlYXRtYXBDb25maWcoY29uZmlnKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSB0aGlzLmNvbmZpZy5tYXJnaW47XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnggPSB7fTtcclxuICAgICAgICB0aGlzLnBsb3QueSA9IHt9O1xyXG4gICAgICAgIHRoaXMucGxvdC56ID0ge1xyXG4gICAgICAgICAgICBtYXRyaXhlczogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBjZWxsczogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBjb2xvcjoge30sXHJcbiAgICAgICAgICAgIHNoYXBlOiB7fVxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICB0aGlzLnNldHVwVmFsdWVzKCk7XHJcbiAgICAgICAgdGhpcy5idWlsZENlbGxzKCk7XHJcblxyXG4gICAgICAgIHZhciB0aXRsZVJlY3RXaWR0aCA9IDY7XHJcbiAgICAgICAgdGhpcy5wbG90Lngub3ZlcmxhcCA9IHtcclxuICAgICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgICAgICBib3R0b206IDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICh0aGlzLnBsb3QuZ3JvdXBCeVgpIHtcclxuICAgICAgICAgICAgbGV0IGRlcHRoID0gc2VsZi5jb25maWcueC5ncm91cHMua2V5cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGxldCBhbGxUaXRsZXNXaWR0aCA9IGRlcHRoICogKHRpdGxlUmVjdFdpZHRoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucGxvdC54Lm92ZXJsYXAuYm90dG9tID0gc2VsZi5jb25maWcueC5ncm91cHMub3ZlcmxhcC5ib3R0b207XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC54Lm92ZXJsYXAudG9wID0gc2VsZi5jb25maWcueC5ncm91cHMub3ZlcmxhcC50b3AgKyBhbGxUaXRsZXNXaWR0aDtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lm1hcmdpbi50b3AgPSBjb25mLm1hcmdpbi5yaWdodCArIGNvbmYueC5ncm91cHMub3ZlcmxhcC50b3A7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5tYXJnaW4uYm90dG9tID0gY29uZi5tYXJnaW4uYm90dG9tICsgY29uZi54Lmdyb3Vwcy5vdmVybGFwLmJvdHRvbTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLnBsb3QueS5vdmVybGFwID0ge1xyXG4gICAgICAgICAgICBsZWZ0OiAwLFxyXG4gICAgICAgICAgICByaWdodDogMFxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICBpZiAodGhpcy5wbG90Lmdyb3VwQnlZKSB7XHJcbiAgICAgICAgICAgIGxldCBkZXB0aCA9IHNlbGYuY29uZmlnLnkuZ3JvdXBzLmtleXMubGVuZ3RoO1xyXG4gICAgICAgICAgICBsZXQgYWxsVGl0bGVzV2lkdGggPSBkZXB0aCAqICh0aXRsZVJlY3RXaWR0aCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC55Lm92ZXJsYXAucmlnaHQgPSBzZWxmLmNvbmZpZy55Lmdyb3Vwcy5vdmVybGFwLmxlZnQgKyBhbGxUaXRsZXNXaWR0aDtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lnkub3ZlcmxhcC5sZWZ0ID0gc2VsZi5jb25maWcueS5ncm91cHMub3ZlcmxhcC5sZWZ0O1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWFyZ2luLmxlZnQgPSBjb25mLm1hcmdpbi5sZWZ0ICsgdGhpcy5wbG90Lnkub3ZlcmxhcC5sZWZ0O1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWFyZ2luLnJpZ2h0ID0gY29uZi5tYXJnaW4ucmlnaHQgKyB0aGlzLnBsb3QueS5vdmVybGFwLnJpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBsb3Quc2hvd0xlZ2VuZCA9IGNvbmYuc2hvd0xlZ2VuZDtcclxuICAgICAgICBpZiAodGhpcy5wbG90LnNob3dMZWdlbmQpIHtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lm1hcmdpbi5yaWdodCArPSBjb25mLmxlZ2VuZC53aWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb21wdXRlUGxvdFNpemUoKTtcclxuICAgICAgICB0aGlzLnNldHVwWlNjYWxlKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwVmFsdWVzKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgY29uZmlnID0gc2VsZi5jb25maWc7XHJcbiAgICAgICAgdmFyIHggPSBzZWxmLnBsb3QueDtcclxuICAgICAgICB2YXIgeSA9IHNlbGYucGxvdC55O1xyXG4gICAgICAgIHZhciB6ID0gc2VsZi5wbG90Lno7XHJcblxyXG5cclxuICAgICAgICB4LnZhbHVlID0gZCA9PiBjb25maWcueC52YWx1ZS5jYWxsKGNvbmZpZywgZCk7XHJcbiAgICAgICAgeS52YWx1ZSA9IGQgPT4gY29uZmlnLnkudmFsdWUuY2FsbChjb25maWcsIGQpO1xyXG4gICAgICAgIHoudmFsdWUgPSBkID0+IGNvbmZpZy56LnZhbHVlLmNhbGwoY29uZmlnLCBkKTtcclxuXHJcbiAgICAgICAgeC51bmlxdWVWYWx1ZXMgPSBbXTtcclxuICAgICAgICB5LnVuaXF1ZVZhbHVlcyA9IFtdO1xyXG5cclxuXHJcbiAgICAgICAgc2VsZi5wbG90Lmdyb3VwQnlZID0gISFjb25maWcueS5ncm91cHMua2V5cy5sZW5ndGg7XHJcbiAgICAgICAgc2VsZi5wbG90Lmdyb3VwQnlYID0gISFjb25maWcueC5ncm91cHMua2V5cy5sZW5ndGg7XHJcblxyXG4gICAgICAgIHkuZ3JvdXBzID0ge1xyXG4gICAgICAgICAgICBrZXk6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgbGFiZWw6ICcnLFxyXG4gICAgICAgICAgICB2YWx1ZXM6IFtdLFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogbnVsbCxcclxuICAgICAgICAgICAgbGV2ZWw6IDAsXHJcbiAgICAgICAgICAgIGluZGV4OiAwLFxyXG4gICAgICAgICAgICBsYXN0SW5kZXg6IDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIHguZ3JvdXBzID0ge1xyXG4gICAgICAgICAgICBrZXk6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgbGFiZWw6ICcnLFxyXG4gICAgICAgICAgICB2YWx1ZXM6IFtdLFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogbnVsbCxcclxuICAgICAgICAgICAgbGV2ZWw6IDAsXHJcbiAgICAgICAgICAgIGluZGV4OiAwLFxyXG4gICAgICAgICAgICBsYXN0SW5kZXg6IDBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgdmFsdWVNYXAgPSB7fTtcclxuICAgICAgICB2YXIgbWluWiA9IHVuZGVmaW5lZDtcclxuICAgICAgICB2YXIgbWF4WiA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmRhdGEuZm9yRWFjaChkPT4ge1xyXG5cclxuICAgICAgICAgICAgdmFyIHhWYWwgPSB4LnZhbHVlKGQpO1xyXG4gICAgICAgICAgICB2YXIgeVZhbCA9IHkudmFsdWUoZCk7XHJcbiAgICAgICAgICAgIHZhciB6VmFsUmF3ID0gei52YWx1ZShkKTtcclxuICAgICAgICAgICAgdmFyIHpWYWwgPSBjb25maWcuei5ub3RBdmFpbGFibGVWYWx1ZSh6VmFsUmF3KSA/IHVuZGVmaW5lZCA6IHBhcnNlRmxvYXQoelZhbFJhdyk7XHJcblxyXG5cclxuICAgICAgICAgICAgaWYgKHgudW5pcXVlVmFsdWVzLmluZGV4T2YoeFZhbCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB4LnVuaXF1ZVZhbHVlcy5wdXNoKHhWYWwpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoeS51bmlxdWVWYWx1ZXMuaW5kZXhPZih5VmFsKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHkudW5pcXVlVmFsdWVzLnB1c2goeVZhbCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBncm91cFkgPSB5Lmdyb3VwcztcclxuICAgICAgICAgICAgaWYgKHNlbGYucGxvdC5ncm91cEJ5WSkge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXBZID0gdGhpcy51cGRhdGVHcm91cHMoZCwgeVZhbCwgeS5ncm91cHMsIGNvbmZpZy55Lmdyb3Vwcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGdyb3VwWCA9IHguZ3JvdXBzO1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5wbG90Lmdyb3VwQnlYKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZ3JvdXBYID0gdGhpcy51cGRhdGVHcm91cHMoZCwgeFZhbCwgeC5ncm91cHMsIGNvbmZpZy54Lmdyb3Vwcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghdmFsdWVNYXBbZ3JvdXBZLmluZGV4XSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWVNYXBbZ3JvdXBZLmluZGV4XSA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXZhbHVlTWFwW2dyb3VwWS5pbmRleF1bZ3JvdXBYLmluZGV4XSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWVNYXBbZ3JvdXBZLmluZGV4XVtncm91cFguaW5kZXhdID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF2YWx1ZU1hcFtncm91cFkuaW5kZXhdW2dyb3VwWC5pbmRleF1beVZhbF0pIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlTWFwW2dyb3VwWS5pbmRleF1bZ3JvdXBYLmluZGV4XVt5VmFsXSA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhbHVlTWFwW2dyb3VwWS5pbmRleF1bZ3JvdXBYLmluZGV4XVt5VmFsXVt4VmFsXSA9IHpWYWw7XHJcblxyXG5cclxuICAgICAgICAgICAgaWYgKG1pblogPT09IHVuZGVmaW5lZCB8fCB6VmFsIDwgbWluWikge1xyXG4gICAgICAgICAgICAgICAgbWluWiA9IHpWYWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG1heFogPT09IHVuZGVmaW5lZCB8fCB6VmFsID4gbWF4Wikge1xyXG4gICAgICAgICAgICAgICAgbWF4WiA9IHpWYWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBzZWxmLnBsb3QudmFsdWVNYXAgPSB2YWx1ZU1hcDtcclxuXHJcblxyXG4gICAgICAgIGlmICghc2VsZi5wbG90Lmdyb3VwQnlYKSB7XHJcbiAgICAgICAgICAgIHguZ3JvdXBzLnZhbHVlcyA9IHgudW5pcXVlVmFsdWVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFzZWxmLnBsb3QuZ3JvdXBCeVkpIHtcclxuICAgICAgICAgICAgeS5ncm91cHMudmFsdWVzID0geS51bmlxdWVWYWx1ZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldHVwVmFsdWVzQmVmb3JlR3JvdXBzU29ydCgpO1xyXG5cclxuICAgICAgICB4LmdhcHMgPSBbXTtcclxuICAgICAgICB4LnRvdGFsVmFsdWVzQ291bnQgPSAwO1xyXG4gICAgICAgIHguYWxsVmFsdWVzTGlzdCA9IFtdO1xyXG4gICAgICAgIHRoaXMuc29ydEdyb3Vwcyh4LCB4Lmdyb3VwcywgY29uZmlnLngpO1xyXG5cclxuICAgICAgICB5LmdhcHMgPSBbXTtcclxuICAgICAgICB5LnRvdGFsVmFsdWVzQ291bnQgPSAwO1xyXG4gICAgICAgIHkuYWxsVmFsdWVzTGlzdCA9IFtdO1xyXG4gICAgICAgIHRoaXMuc29ydEdyb3Vwcyh5LCB5Lmdyb3VwcywgY29uZmlnLnkpO1xyXG5cclxuICAgICAgICB6Lm1pbiA9IG1pblo7XHJcbiAgICAgICAgei5tYXggPSBtYXhaO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBzZXR1cFZhbHVlc0JlZm9yZUdyb3Vwc1NvcnQoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgYnVpbGRDZWxscygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHggPSBzZWxmLnBsb3QueDtcclxuICAgICAgICB2YXIgeSA9IHNlbGYucGxvdC55O1xyXG4gICAgICAgIHZhciB6ID0gc2VsZi5wbG90Lno7XHJcbiAgICAgICAgdmFyIHZhbHVlTWFwID0gc2VsZi5wbG90LnZhbHVlTWFwO1xyXG5cclxuICAgICAgICB2YXIgbWF0cml4Q2VsbHMgPSBzZWxmLnBsb3QuY2VsbHMgPSBbXTtcclxuICAgICAgICB2YXIgbWF0cml4ID0gc2VsZi5wbG90Lm1hdHJpeCA9IFtdO1xyXG5cclxuICAgICAgICB5LmFsbFZhbHVlc0xpc3QuZm9yRWFjaCgodjEsIGkpPT4ge1xyXG4gICAgICAgICAgICB2YXIgcm93ID0gW107XHJcbiAgICAgICAgICAgIG1hdHJpeC5wdXNoKHJvdyk7XHJcblxyXG4gICAgICAgICAgICB4LmFsbFZhbHVlc0xpc3QuZm9yRWFjaCgodjIsIGopID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB6VmFsID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB6VmFsID0gdmFsdWVNYXBbdjEuZ3JvdXAuaW5kZXhdW3YyLmdyb3VwLmluZGV4XVt2MS52YWxdW3YyLnZhbF1cclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY2VsbCA9IHtcclxuICAgICAgICAgICAgICAgICAgICByb3dWYXI6IHYxLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbFZhcjogdjIsXHJcbiAgICAgICAgICAgICAgICAgICAgcm93OiBpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbDogaixcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogelZhbFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJvdy5wdXNoKGNlbGwpO1xyXG5cclxuICAgICAgICAgICAgICAgIG1hdHJpeENlbGxzLnB1c2goY2VsbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVHcm91cHMoZCwgYXhpc1ZhbCwgcm9vdEdyb3VwLCBheGlzR3JvdXBzQ29uZmlnKSB7XHJcblxyXG4gICAgICAgIHZhciBjb25maWcgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICB2YXIgY3VycmVudEdyb3VwID0gcm9vdEdyb3VwO1xyXG4gICAgICAgIGF4aXNHcm91cHNDb25maWcua2V5cy5mb3JFYWNoKChncm91cEtleSwgZ3JvdXBLZXlJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBjdXJyZW50R3JvdXAua2V5ID0gZ3JvdXBLZXk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWN1cnJlbnRHcm91cC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLmNoaWxkcmVuID0ge307XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBncm91cGluZ1ZhbHVlID0gYXhpc0dyb3Vwc0NvbmZpZy52YWx1ZS5jYWxsKGNvbmZpZywgZCwgZ3JvdXBLZXkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFjdXJyZW50R3JvdXAuY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoZ3JvdXBpbmdWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHJvb3RHcm91cC5sYXN0SW5kZXgrKztcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC5jaGlsZHJlbltncm91cGluZ1ZhbHVlXSA9IHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwaW5nVmFsdWU6IGdyb3VwaW5nVmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbGV2ZWw6IGN1cnJlbnRHcm91cC5sZXZlbCArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IHJvb3RHcm91cC5sYXN0SW5kZXgsXHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiBncm91cEtleVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjdXJyZW50R3JvdXAgPSBjdXJyZW50R3JvdXAuY2hpbGRyZW5bZ3JvdXBpbmdWYWx1ZV07XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChjdXJyZW50R3JvdXAudmFsdWVzLmluZGV4T2YoYXhpc1ZhbCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRHcm91cC52YWx1ZXMucHVzaChheGlzVmFsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjdXJyZW50R3JvdXA7XHJcbiAgICB9XHJcblxyXG4gICAgc29ydEdyb3VwcyhheGlzLCBncm91cCwgYXhpc0NvbmZpZywgZ2Fwcykge1xyXG4gICAgICAgIGlmIChheGlzQ29uZmlnLmdyb3Vwcy5sYWJlbHMgJiYgYXhpc0NvbmZpZy5ncm91cHMubGFiZWxzLmxlbmd0aCA+IGdyb3VwLmxldmVsKSB7XHJcbiAgICAgICAgICAgIGdyb3VwLmxhYmVsID0gYXhpc0NvbmZpZy5ncm91cHMubGFiZWxzW2dyb3VwLmxldmVsXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBncm91cC5sYWJlbCA9IGdyb3VwLmtleTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZ2Fwcykge1xyXG4gICAgICAgICAgICBnYXBzID0gWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZ2Fwcy5sZW5ndGggPD0gZ3JvdXAubGV2ZWwpIHtcclxuICAgICAgICAgICAgZ2Fwcy5wdXNoKDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ3JvdXAuYWxsVmFsdWVzQ291bnQgPSBncm91cC5hbGxWYWx1ZXNDb3VudCB8fCAwO1xyXG4gICAgICAgIGdyb3VwLmFsbFZhbHVlc0JlZm9yZUNvdW50ID0gZ3JvdXAuYWxsVmFsdWVzQmVmb3JlQ291bnQgfHwgMDtcclxuXHJcbiAgICAgICAgZ3JvdXAuZ2FwcyA9IGdhcHMuc2xpY2UoKTtcclxuICAgICAgICBncm91cC5nYXBzQmVmb3JlID0gZ2Fwcy5zbGljZSgpO1xyXG5cclxuXHJcbiAgICAgICAgZ3JvdXAuZ2Fwc1NpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBzU2l6ZShncm91cC5nYXBzKTtcclxuICAgICAgICBncm91cC5nYXBzQmVmb3JlU2l6ZSA9IGdyb3VwLmdhcHNTaXplO1xyXG4gICAgICAgIGlmIChncm91cC52YWx1ZXMpIHtcclxuICAgICAgICAgICAgaWYgKGF4aXNDb25maWcuc29ydExhYmVscykge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXAudmFsdWVzLnNvcnQoYXhpc0NvbmZpZy5zb3J0Q29tcGFyYXRvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ3JvdXAudmFsdWVzLmZvckVhY2godj0+YXhpcy5hbGxWYWx1ZXNMaXN0LnB1c2goe3ZhbDogdiwgZ3JvdXA6IGdyb3VwfSkpO1xyXG4gICAgICAgICAgICBncm91cC5hbGxWYWx1ZXNCZWZvcmVDb3VudCA9IGF4aXMudG90YWxWYWx1ZXNDb3VudDtcclxuICAgICAgICAgICAgYXhpcy50b3RhbFZhbHVlc0NvdW50ICs9IGdyb3VwLnZhbHVlcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGdyb3VwLmFsbFZhbHVlc0NvdW50ICs9IGdyb3VwLnZhbHVlcy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBncm91cC5jaGlsZHJlbkxpc3QgPSBbXTtcclxuICAgICAgICBpZiAoZ3JvdXAuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgdmFyIGNoaWxkcmVuQ291bnQgPSAwO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgY2hpbGRQcm9wIGluIGdyb3VwLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXAuY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoY2hpbGRQcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IGdyb3VwLmNoaWxkcmVuW2NoaWxkUHJvcF07XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAuY2hpbGRyZW5MaXN0LnB1c2goY2hpbGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuQ291bnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3J0R3JvdXBzKGF4aXMsIGNoaWxkLCBheGlzQ29uZmlnLCBnYXBzKTtcclxuICAgICAgICAgICAgICAgICAgICBncm91cC5hbGxWYWx1ZXNDb3VudCArPSBjaGlsZC5hbGxWYWx1ZXNDb3VudDtcclxuICAgICAgICAgICAgICAgICAgICBnYXBzW2dyb3VwLmxldmVsXSArPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZ2FwcyAmJiBjaGlsZHJlbkNvdW50ID4gMSkge1xyXG4gICAgICAgICAgICAgICAgZ2Fwc1tncm91cC5sZXZlbF0gLT0gMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZ3JvdXAuZ2Fwc0luc2lkZSA9IFtdO1xyXG4gICAgICAgICAgICBnYXBzLmZvckVhY2goKGQsIGkpPT4ge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXAuZ2Fwc0luc2lkZS5wdXNoKGQgLSAoZ3JvdXAuZ2Fwc0JlZm9yZVtpXSB8fCAwKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBncm91cC5nYXBzSW5zaWRlU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcHNTaXplKGdyb3VwLmdhcHNJbnNpZGUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGF4aXMuZ2Fwcy5sZW5ndGggPCBnYXBzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgYXhpcy5nYXBzID0gZ2FwcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgY29tcHV0ZVlBeGlzTGFiZWxzV2lkdGgob2Zmc2V0KSB7XHJcbiAgICAgICAgdmFyIG1heFdpZHRoID0gdGhpcy5wbG90Lm1hcmdpbi5sZWZ0O1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy55LnRpdGxlKSB7XHJcbiAgICAgICAgICAgIG1heFdpZHRoIC09IDE1O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2Zmc2V0ICYmIG9mZnNldC54KSB7XHJcbiAgICAgICAgICAgIG1heFdpZHRoICs9IG9mZnNldC54O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnkucm90YXRlTGFiZWxzKSB7XHJcbiAgICAgICAgICAgIG1heFdpZHRoICo9IFV0aWxzLlNRUlRfMjtcclxuICAgICAgICAgICAgdmFyIGZvbnRTaXplID0gMTE7IC8vdG9kbyBjaGVjayBhY3R1YWwgZm9udCBzaXplXHJcbiAgICAgICAgICAgIG1heFdpZHRoIC09Zm9udFNpemUvMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBtYXhXaWR0aDtcclxuICAgIH1cclxuXHJcbiAgICBjb21wdXRlWEF4aXNMYWJlbHNXaWR0aChvZmZzZXQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLngucm90YXRlTGFiZWxzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBsb3QuY2VsbFdpZHRoIC0gMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHNpemUgPSB0aGlzLnBsb3QubWFyZ2luLmJvdHRvbTtcclxuICAgICAgICBpZiAodGhpcy5jb25maWcueC50aXRsZSkge1xyXG4gICAgICAgICAgICBzaXplIC09IDE1O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2Zmc2V0ICYmIG9mZnNldC55KSB7XHJcbiAgICAgICAgICAgIHNpemUgLT0gb2Zmc2V0Lnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzaXplICo9IFV0aWxzLlNRUlRfMjtcclxuXHJcbiAgICAgICAgdmFyIGZvbnRTaXplID0gMTE7IC8vdG9kbyBjaGVjayBhY3R1YWwgZm9udCBzaXplXHJcbiAgICAgICAgc2l6ZSAtPWZvbnRTaXplLzI7XHJcblxyXG4gICAgICAgIHJldHVybiBzaXplO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjb21wdXRlR2FwU2l6ZShnYXBMZXZlbCkge1xyXG4gICAgICAgIHJldHVybiBIZWF0bWFwLm1heEdyb3VwR2FwU2l6ZSAvIChnYXBMZXZlbCArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjb21wdXRlR2Fwc1NpemUoZ2Fwcykge1xyXG4gICAgICAgIHZhciBnYXBzU2l6ZSA9IDA7XHJcbiAgICAgICAgZ2Fwcy5mb3JFYWNoKChnYXBzTnVtYmVyLCBnYXBzTGV2ZWwpPT4gZ2Fwc1NpemUgKz0gZ2Fwc051bWJlciAqIEhlYXRtYXAuY29tcHV0ZUdhcFNpemUoZ2Fwc0xldmVsKSk7XHJcbiAgICAgICAgcmV0dXJuIGdhcHNTaXplO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXB1dGVQbG90U2l6ZSgpIHtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICB2YXIgbWFyZ2luID0gcGxvdC5tYXJnaW47XHJcbiAgICAgICAgdmFyIGF2YWlsYWJsZVdpZHRoID0gVXRpbHMuYXZhaWxhYmxlV2lkdGgodGhpcy5jb25maWcud2lkdGgsIHRoaXMuZ2V0QmFzZUNvbnRhaW5lcigpLCB0aGlzLnBsb3QubWFyZ2luKTtcclxuICAgICAgICB2YXIgYXZhaWxhYmxlSGVpZ2h0ID0gVXRpbHMuYXZhaWxhYmxlSGVpZ2h0KHRoaXMuY29uZmlnLmhlaWdodCwgdGhpcy5nZXRCYXNlQ29udGFpbmVyKCksIHRoaXMucGxvdC5tYXJnaW4pO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IGF2YWlsYWJsZVdpZHRoO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBhdmFpbGFibGVIZWlnaHQ7XHJcblxyXG4gICAgICAgIHZhciB4R2Fwc1NpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBzU2l6ZShwbG90LnguZ2Fwcyk7XHJcblxyXG5cclxuICAgICAgICB2YXIgY29tcHV0ZWRDZWxsV2lkdGggPSBNYXRoLm1heChjb25mLmNlbGwuc2l6ZU1pbiwgTWF0aC5taW4oY29uZi5jZWxsLnNpemVNYXgsIChhdmFpbGFibGVXaWR0aCAtIHhHYXBzU2l6ZSkgLyB0aGlzLnBsb3QueC50b3RhbFZhbHVlc0NvdW50KSk7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLndpZHRoKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY29uZmlnLmNlbGwud2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsV2lkdGggPSBjb21wdXRlZENlbGxXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuY2VsbFdpZHRoID0gdGhpcy5jb25maWcuY2VsbC53aWR0aDtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wbG90LmNlbGxXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxXaWR0aCA9IGNvbXB1dGVkQ2VsbFdpZHRoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICB3aWR0aCA9IHRoaXMucGxvdC5jZWxsV2lkdGggKiB0aGlzLnBsb3QueC50b3RhbFZhbHVlc0NvdW50ICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQgKyB4R2Fwc1NpemU7XHJcblxyXG4gICAgICAgIHZhciB5R2Fwc1NpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBzU2l6ZShwbG90LnkuZ2Fwcyk7XHJcbiAgICAgICAgdmFyIGNvbXB1dGVkQ2VsbEhlaWdodCA9IE1hdGgubWF4KGNvbmYuY2VsbC5zaXplTWluLCBNYXRoLm1pbihjb25mLmNlbGwuc2l6ZU1heCwgKGF2YWlsYWJsZUhlaWdodCAtIHlHYXBzU2l6ZSkgLyB0aGlzLnBsb3QueS50b3RhbFZhbHVlc0NvdW50KSk7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmhlaWdodCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY29uZmlnLmNlbGwuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuY2VsbEhlaWdodCA9IGNvbXB1dGVkQ2VsbEhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsSGVpZ2h0ID0gdGhpcy5jb25maWcuY2VsbC5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMucGxvdC5jZWxsSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuY2VsbEhlaWdodCA9IGNvbXB1dGVkQ2VsbEhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGhlaWdodCA9IHRoaXMucGxvdC5jZWxsSGVpZ2h0ICogdGhpcy5wbG90LnkudG90YWxWYWx1ZXNDb3VudCArIG1hcmdpbi50b3AgKyBtYXJnaW4uYm90dG9tICsgeUdhcHNTaXplO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5wbG90LndpZHRoID0gd2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodDtcclxuICAgICAgICB0aGlzLnBsb3QuaGVpZ2h0ID0gaGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNldHVwWlNjYWxlKCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGNvbmZpZyA9IHNlbGYuY29uZmlnO1xyXG4gICAgICAgIHZhciB6ID0gc2VsZi5wbG90Lno7XHJcbiAgICAgICAgdmFyIHJhbmdlID0gY29uZmlnLmNvbG9yLnJhbmdlO1xyXG4gICAgICAgIHZhciBleHRlbnQgPSB6Lm1heCAtIHoubWluO1xyXG4gICAgICAgIHZhciBzY2FsZTtcclxuICAgICAgICB6LmRvbWFpbiA9IFtdO1xyXG4gICAgICAgIGlmIChjb25maWcuY29sb3Iuc2NhbGUgPT0gXCJwb3dcIikge1xyXG4gICAgICAgICAgICB2YXIgZXhwb25lbnQgPSAxMDtcclxuICAgICAgICAgICAgcmFuZ2UuZm9yRWFjaCgoYywgaSk9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdiA9IHoubWF4IC0gKGV4dGVudCAvIE1hdGgucG93KDEwLCBpKSk7XHJcbiAgICAgICAgICAgICAgICB6LmRvbWFpbi5wdXNoKHYpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzY2FsZSA9IGQzLnNjYWxlLnBvdygpLmV4cG9uZW50KGV4cG9uZW50KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbmZpZy5jb2xvci5zY2FsZSA9PSBcImxvZ1wiKSB7XHJcblxyXG4gICAgICAgICAgICByYW5nZS5mb3JFYWNoKChjLCBpKT0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB2ID0gei5taW4gKyAoZXh0ZW50IC8gTWF0aC5wb3coMTAsIGkpKTtcclxuICAgICAgICAgICAgICAgIHouZG9tYWluLnVuc2hpZnQodilcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc2NhbGUgPSBkMy5zY2FsZS5sb2coKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJhbmdlLmZvckVhY2goKGMsIGkpPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHYgPSB6Lm1pbiArIChleHRlbnQgKiAoaSAvIChyYW5nZS5sZW5ndGggLSAxKSkpO1xyXG4gICAgICAgICAgICAgICAgei5kb21haW4ucHVzaCh2KVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc2NhbGUgPSBkMy5zY2FsZVtjb25maWcuY29sb3Iuc2NhbGVdKCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgei5kb21haW5bMF0gPSB6Lm1pbjsgLy9yZW1vdmluZyB1bm5lY2Vzc2FyeSBmbG9hdGluZyBwb2ludHNcclxuICAgICAgICB6LmRvbWFpblt6LmRvbWFpbi5sZW5ndGggLSAxXSA9IHoubWF4OyAvL3JlbW92aW5nIHVubmVjZXNzYXJ5IGZsb2F0aW5nIHBvaW50c1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHouZG9tYWluKTtcclxuXHJcbiAgICAgICAgaWYgKGNvbmZpZy5jb2xvci5yZXZlcnNlU2NhbGUpIHtcclxuICAgICAgICAgICAgei5kb21haW4ucmV2ZXJzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHJhbmdlKTtcclxuICAgICAgICBwbG90LnouY29sb3Iuc2NhbGUgPSBzY2FsZS5kb21haW4oei5kb21haW4pLnJhbmdlKHJhbmdlKTtcclxuICAgICAgICB2YXIgc2hhcGUgPSBwbG90Lnouc2hhcGUgPSB7fTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxDb25mID0gdGhpcy5jb25maWcuY2VsbDtcclxuICAgICAgICBzaGFwZS50eXBlID0gXCJyZWN0XCI7XHJcblxyXG4gICAgICAgIHBsb3Quei5zaGFwZS53aWR0aCA9IHBsb3QuY2VsbFdpZHRoIC0gY2VsbENvbmYucGFkZGluZyAqIDI7XHJcbiAgICAgICAgcGxvdC56LnNoYXBlLmhlaWdodCA9IHBsb3QuY2VsbEhlaWdodCAtIGNlbGxDb25mLnBhZGRpbmcgKiAyO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB1cGRhdGUobmV3RGF0YSkge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuICAgICAgICBpZiAodGhpcy5wbG90Lmdyb3VwQnlZKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0dyb3Vwc1kodGhpcy5wbG90LnkuZ3JvdXBzLCB0aGlzLnN2Z0cpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5wbG90Lmdyb3VwQnlYKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0dyb3Vwc1godGhpcy5wbG90LnguZ3JvdXBzLCB0aGlzLnN2Z0cpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVDZWxscygpO1xyXG5cclxuICAgICAgICAvLyB0aGlzLnVwZGF0ZVZhcmlhYmxlTGFiZWxzKCk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlQXhpc1goKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUF4aXNZKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5zaG93TGVnZW5kKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGVnZW5kKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUF4aXNUaXRsZXMoKTtcclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlQXhpc1RpdGxlcygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcblxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgdXBkYXRlQXhpc1goKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBsYWJlbENsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImxhYmVsXCIpO1xyXG4gICAgICAgIHZhciBsYWJlbFhDbGFzcyA9IGxhYmVsQ2xhc3MgKyBcIi14XCI7XHJcbiAgICAgICAgdmFyIGxhYmVsWUNsYXNzID0gbGFiZWxDbGFzcyArIFwiLXlcIjtcclxuICAgICAgICBwbG90LmxhYmVsQ2xhc3MgPSBsYWJlbENsYXNzO1xyXG5cclxuICAgICAgICB2YXIgb2Zmc2V0WCA9IHtcclxuICAgICAgICAgICAgeDogMCxcclxuICAgICAgICAgICAgeTogMFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGV0IGdhcFNpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBTaXplKDApO1xyXG4gICAgICAgIGlmIChwbG90Lmdyb3VwQnlYKSB7XHJcbiAgICAgICAgICAgIGxldCBvdmVybGFwID0gc2VsZi5jb25maWcueC5ncm91cHMub3ZlcmxhcDtcclxuXHJcbiAgICAgICAgICAgIG9mZnNldFgueCA9IGdhcFNpemUgLyAyO1xyXG4gICAgICAgICAgICBvZmZzZXRYLnkgPSBvdmVybGFwLmJvdHRvbSArIGdhcFNpemUgLyAyICsgNjtcclxuICAgICAgICB9IGVsc2UgaWYgKHBsb3QuZ3JvdXBCeVkpIHtcclxuICAgICAgICAgICAgb2Zmc2V0WC55ID0gZ2FwU2l6ZTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB2YXIgbGFiZWxzID0gc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyBsYWJlbFhDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGxvdC54LmFsbFZhbHVlc0xpc3QsIChkLCBpKT0+aSk7XHJcblxyXG4gICAgICAgIGxhYmVscy5lbnRlcigpLmFwcGVuZChcInRleHRcIikuYXR0cihcImNsYXNzXCIsIChkLCBpKSA9PiBsYWJlbENsYXNzICsgXCIgXCIgKyBsYWJlbFhDbGFzcyArIFwiIFwiICsgbGFiZWxYQ2xhc3MgKyBcIi1cIiArIGkpO1xyXG5cclxuICAgICAgICBsYWJlbHNcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIChkLCBpKSA9PiAoaSAqIHBsb3QuY2VsbFdpZHRoICsgcGxvdC5jZWxsV2lkdGggLyAyKSArIChkLmdyb3VwLmdhcHNTaXplKSArIG9mZnNldFgueClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIHBsb3QuaGVpZ2h0ICsgb2Zmc2V0WC55KVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIDEwKVxyXG5cclxuICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAudGV4dChkPT5zZWxmLmZvcm1hdFZhbHVlWChkLnZhbCkpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHZhciBtYXhXaWR0aCA9IHNlbGYuY29tcHV0ZVhBeGlzTGFiZWxzV2lkdGgob2Zmc2V0WCk7XHJcblxyXG4gICAgICAgIGxhYmVscy5lYWNoKGZ1bmN0aW9uIChsYWJlbCkge1xyXG4gICAgICAgICAgICB2YXIgZWxlbSA9IGQzLnNlbGVjdCh0aGlzKSxcclxuICAgICAgICAgICAgICAgIHRleHQgPSBzZWxmLmZvcm1hdFZhbHVlWChsYWJlbC52YWwpO1xyXG4gICAgICAgICAgICBVdGlscy5wbGFjZVRleHRXaXRoRWxsaXBzaXNBbmRUb29sdGlwKGVsZW0sIHRleHQsIG1heFdpZHRoLCBzZWxmLmNvbmZpZy5zaG93VG9vbHRpcCA/IHNlbGYucGxvdC50b29sdGlwIDogZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoc2VsZi5jb25maWcueC5yb3RhdGVMYWJlbHMpIHtcclxuICAgICAgICAgICAgbGFiZWxzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwicm90YXRlKC00NSwgXCIgKyAoKGkgKiBwbG90LmNlbGxXaWR0aCArIHBsb3QuY2VsbFdpZHRoIC8gMikgKyBkLmdyb3VwLmdhcHNTaXplICsgb2Zmc2V0WC54ICkgKyBcIiwgXCIgKyAoIHBsb3QuaGVpZ2h0ICsgb2Zmc2V0WC55KSArIFwiKVwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJkeFwiLCAtMilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgOClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgbGFiZWxzLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcblxyXG4gICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RPckFwcGVuZChcImcuXCIgKyBzZWxmLnByZWZpeENsYXNzKCdheGlzLXgnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAocGxvdC53aWR0aCAvIDIpICsgXCIsXCIgKyAocGxvdC5oZWlnaHQgKyBwbG90Lm1hcmdpbi5ib3R0b20pICsgXCIpXCIpXHJcbiAgICAgICAgICAgIC5zZWxlY3RPckFwcGVuZChcInRleHQuXCIgKyBzZWxmLnByZWZpeENsYXNzKCdsYWJlbCcpKVxyXG5cclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCBcIi0wLjVlbVwiKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAudGV4dChzZWxmLmNvbmZpZy54LnRpdGxlKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVBeGlzWSgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGxhYmVsQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwibGFiZWxcIik7XHJcbiAgICAgICAgdmFyIGxhYmVsWUNsYXNzID0gbGFiZWxDbGFzcyArIFwiLXlcIjtcclxuICAgICAgICBwbG90LmxhYmVsQ2xhc3MgPSBsYWJlbENsYXNzO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGxhYmVscyA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgbGFiZWxZQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBsb3QueS5hbGxWYWx1ZXNMaXN0KTtcclxuXHJcbiAgICAgICAgbGFiZWxzLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKTtcclxuXHJcbiAgICAgICAgdmFyIG9mZnNldFkgPSB7XHJcbiAgICAgICAgICAgIHg6IDAsXHJcbiAgICAgICAgICAgIHk6IDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmIChwbG90Lmdyb3VwQnlZKSB7XHJcbiAgICAgICAgICAgIGxldCBvdmVybGFwID0gc2VsZi5jb25maWcueS5ncm91cHMub3ZlcmxhcDtcclxuICAgICAgICAgICAgbGV0IGdhcFNpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBTaXplKDApO1xyXG4gICAgICAgICAgICBvZmZzZXRZLnggPSAtb3ZlcmxhcC5sZWZ0O1xyXG5cclxuICAgICAgICAgICAgb2Zmc2V0WS55ID0gZ2FwU2l6ZSAvIDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxhYmVsc1xyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgb2Zmc2V0WS54KVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgKGQsIGkpID0+IChpICogcGxvdC5jZWxsSGVpZ2h0ICsgcGxvdC5jZWxsSGVpZ2h0IC8gMikgKyBkLmdyb3VwLmdhcHNTaXplICsgb2Zmc2V0WS55KVxyXG4gICAgICAgICAgICAuYXR0cihcImR4XCIsIC0yKVxyXG4gICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgKGQsIGkpID0+IGxhYmVsQ2xhc3MgKyBcIiBcIiArIGxhYmVsWUNsYXNzICsgXCIgXCIgKyBsYWJlbFlDbGFzcyArIFwiLVwiICsgaSlcclxuXHJcbiAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZm9ybWF0dGVkID0gc2VsZi5mb3JtYXRWYWx1ZVkoZC52YWwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdHRlZFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIG1heFdpZHRoID0gc2VsZi5jb21wdXRlWUF4aXNMYWJlbHNXaWR0aChvZmZzZXRZKTtcclxuXHJcbiAgICAgICAgbGFiZWxzLmVhY2goZnVuY3Rpb24gKGxhYmVsKSB7XHJcbiAgICAgICAgICAgIHZhciBlbGVtID0gZDMuc2VsZWN0KHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgdGV4dCA9IHNlbGYuZm9ybWF0VmFsdWVZKGxhYmVsLnZhbCk7XHJcbiAgICAgICAgICAgIFV0aWxzLnBsYWNlVGV4dFdpdGhFbGxpcHNpc0FuZFRvb2x0aXAoZWxlbSwgdGV4dCwgbWF4V2lkdGgsIHNlbGYuY29uZmlnLnNob3dUb29sdGlwID8gc2VsZi5wbG90LnRvb2x0aXAgOiBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy55LnJvdGF0ZUxhYmVscykge1xyXG4gICAgICAgICAgICBsYWJlbHNcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInJvdGF0ZSgtNDUsIFwiICsgKG9mZnNldFkueCAgKSArIFwiLCBcIiArIChkLmdyb3VwLmdhcHNTaXplICsgKGkgKiBwbG90LmNlbGxIZWlnaHQgKyBwbG90LmNlbGxIZWlnaHQgLyAyKSArIG9mZnNldFkueSkgKyBcIilcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIik7XHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiZHhcIiwgLTcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxhYmVscy5hdHRyKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBsYWJlbHMuZXhpdCgpLnJlbW92ZSgpO1xyXG5cclxuXHJcbiAgICAgICAgc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIiArIHNlbGYucHJlZml4Q2xhc3MoJ2F4aXMteScpKVxyXG4gICAgICAgICAgICAuc2VsZWN0T3JBcHBlbmQoXCJ0ZXh0LlwiICsgc2VsZi5wcmVmaXhDbGFzcygnbGFiZWwnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAtcGxvdC5tYXJnaW4ubGVmdCArIFwiLFwiICsgKHBsb3QuaGVpZ2h0IC8gMikgKyBcIilyb3RhdGUoLTkwKVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KHNlbGYuY29uZmlnLnkudGl0bGUpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgZHJhd0dyb3Vwc1kocGFyZW50R3JvdXAsIGNvbnRhaW5lciwgYXZhaWxhYmxlV2lkdGgpIHtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG5cclxuICAgICAgICB2YXIgZ3JvdXBDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJncm91cFwiKTtcclxuICAgICAgICB2YXIgZ3JvdXBZQ2xhc3MgPSBncm91cENsYXNzICsgXCIteVwiO1xyXG4gICAgICAgIHZhciBncm91cHMgPSBjb250YWluZXIuc2VsZWN0QWxsKFwiZy5cIiArIGdyb3VwQ2xhc3MgKyBcIi5cIiArIGdyb3VwWUNsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShwYXJlbnRHcm91cC5jaGlsZHJlbkxpc3QpO1xyXG5cclxuICAgICAgICB2YXIgdmFsdWVzQmVmb3JlQ291bnQgPSAwO1xyXG4gICAgICAgIHZhciBnYXBzQmVmb3JlU2l6ZSA9IDA7XHJcblxyXG4gICAgICAgIHZhciBncm91cHNFbnRlckcgPSBncm91cHMuZW50ZXIoKS5hcHBlbmQoXCJnXCIpO1xyXG4gICAgICAgIGdyb3Vwc0VudGVyR1xyXG4gICAgICAgICAgICAuY2xhc3NlZChncm91cENsYXNzLCB0cnVlKVxyXG4gICAgICAgICAgICAuY2xhc3NlZChncm91cFlDbGFzcywgdHJ1ZSlcclxuICAgICAgICAgICAgLmFwcGVuZChcInJlY3RcIikuY2xhc3NlZChcImdyb3VwLXJlY3RcIiwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIHZhciB0aXRsZUdyb3VwRW50ZXIgPSBncm91cHNFbnRlckcuYXBwZW5kU2VsZWN0b3IoXCJnLnRpdGxlXCIpO1xyXG4gICAgICAgIHRpdGxlR3JvdXBFbnRlci5hcHBlbmQoXCJyZWN0XCIpO1xyXG4gICAgICAgIHRpdGxlR3JvdXBFbnRlci5hcHBlbmQoXCJ0ZXh0XCIpO1xyXG5cclxuICAgICAgICB2YXIgZ2FwU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcFNpemUocGFyZW50R3JvdXAubGV2ZWwpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gZ2FwU2l6ZSAvIDQ7XHJcblxyXG4gICAgICAgIHZhciB0aXRsZVJlY3RXaWR0aCA9IEhlYXRtYXAuZ3JvdXBUaXRsZVJlY3RIZWlnaHQ7XHJcbiAgICAgICAgdmFyIGRlcHRoID0gc2VsZi5jb25maWcueS5ncm91cHMua2V5cy5sZW5ndGggLSBwYXJlbnRHcm91cC5sZXZlbDtcclxuICAgICAgICB2YXIgb3ZlcmxhcCA9IHtcclxuICAgICAgICAgICAgbGVmdDogMCxcclxuICAgICAgICAgICAgcmlnaHQ6IDBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoIWF2YWlsYWJsZVdpZHRoKSB7XHJcbiAgICAgICAgICAgIG92ZXJsYXAucmlnaHQgPSBwbG90Lnkub3ZlcmxhcC5sZWZ0O1xyXG4gICAgICAgICAgICBvdmVybGFwLmxlZnQgPSBwbG90Lnkub3ZlcmxhcC5sZWZ0O1xyXG4gICAgICAgICAgICBhdmFpbGFibGVXaWR0aCA9IHBsb3Qud2lkdGggKyBnYXBTaXplICsgb3ZlcmxhcC5sZWZ0ICsgb3ZlcmxhcC5yaWdodDtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBncm91cHNcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB0cmFuc2xhdGUgPSBcInRyYW5zbGF0ZShcIiArIChwYWRkaW5nIC0gb3ZlcmxhcC5sZWZ0KSArIFwiLFwiICsgKChwbG90LmNlbGxIZWlnaHQgKiB2YWx1ZXNCZWZvcmVDb3VudCkgKyBpICogZ2FwU2l6ZSArIGdhcHNCZWZvcmVTaXplICsgcGFkZGluZykgKyBcIilcIjtcclxuICAgICAgICAgICAgICAgIGdhcHNCZWZvcmVTaXplICs9IChkLmdhcHNJbnNpZGVTaXplIHx8IDApO1xyXG4gICAgICAgICAgICAgICAgdmFsdWVzQmVmb3JlQ291bnQgKz0gZC5hbGxWYWx1ZXNDb3VudCB8fCAwO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYW5zbGF0ZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHZhciBncm91cFdpZHRoID0gYXZhaWxhYmxlV2lkdGggLSBwYWRkaW5nICogMjtcclxuXHJcbiAgICAgICAgdmFyIHRpdGxlR3JvdXBzID0gZ3JvdXBzLnNlbGVjdEFsbChcImcudGl0bGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwidHJhbnNsYXRlKFwiICsgKGdyb3VwV2lkdGggLSB0aXRsZVJlY3RXaWR0aCkgKyBcIiwgMClcIik7XHJcblxyXG4gICAgICAgIHZhciB0aWxlUmVjdHMgPSB0aXRsZUdyb3Vwcy5zZWxlY3RBbGwoXCJyZWN0XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgdGl0bGVSZWN0V2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGQ9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCkgKyBwbG90LmNlbGxIZWlnaHQgKiBkLmFsbFZhbHVlc0NvdW50ICsgcGFkZGluZyAqIDJcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAwKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcImZpbGxcIiwgXCJsaWdodGdyZXlcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0R3JvdXBNb3VzZUNhbGxiYWNrcyhwYXJlbnRHcm91cCwgdGlsZVJlY3RzKTtcclxuXHJcblxyXG4gICAgICAgIGdyb3Vwcy5zZWxlY3RBbGwoXCJyZWN0Lmdyb3VwLXJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBkPT4gXCJncm91cC1yZWN0IGdyb3VwLXJlY3QtXCIgKyBkLmluZGV4KVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGdyb3VwV2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGQ9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCkgKyBwbG90LmNlbGxIZWlnaHQgKiBkLmFsbFZhbHVlc0NvdW50ICsgcGFkZGluZyAqIDJcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgXCJ3aGl0ZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImZpbGwtb3BhY2l0eVwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCAwLjUpXHJcbiAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlXCIsIFwiYmxhY2tcIilcclxuXHJcblxyXG4gICAgICAgIGdyb3Vwcy5lYWNoKGZ1bmN0aW9uIChncm91cCkge1xyXG5cclxuICAgICAgICAgICAgc2VsZi5kcmF3R3JvdXBzWS5jYWxsKHNlbGYsIGdyb3VwLCBkMy5zZWxlY3QodGhpcyksIGdyb3VwV2lkdGggLSB0aXRsZVJlY3RXaWR0aCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGRyYXdHcm91cHNYKHBhcmVudEdyb3VwLCBjb250YWluZXIsIGF2YWlsYWJsZUhlaWdodCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcblxyXG4gICAgICAgIHZhciBncm91cENsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImdyb3VwXCIpO1xyXG4gICAgICAgIHZhciBncm91cFhDbGFzcyA9IGdyb3VwQ2xhc3MgKyBcIi14XCI7XHJcbiAgICAgICAgdmFyIGdyb3VwcyA9IGNvbnRhaW5lci5zZWxlY3RBbGwoXCJnLlwiICsgZ3JvdXBDbGFzcyArIFwiLlwiICsgZ3JvdXBYQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBhcmVudEdyb3VwLmNoaWxkcmVuTGlzdCk7XHJcblxyXG4gICAgICAgIHZhciB2YWx1ZXNCZWZvcmVDb3VudCA9IDA7XHJcbiAgICAgICAgdmFyIGdhcHNCZWZvcmVTaXplID0gMDtcclxuXHJcbiAgICAgICAgdmFyIGdyb3Vwc0VudGVyRyA9IGdyb3Vwcy5lbnRlcigpLmFwcGVuZChcImdcIik7XHJcbiAgICAgICAgZ3JvdXBzRW50ZXJHXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKGdyb3VwQ2xhc3MsIHRydWUpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKGdyb3VwWENsYXNzLCB0cnVlKVxyXG4gICAgICAgICAgICAuYXBwZW5kKFwicmVjdFwiKS5jbGFzc2VkKFwiZ3JvdXAtcmVjdFwiLCB0cnVlKTtcclxuXHJcbiAgICAgICAgdmFyIHRpdGxlR3JvdXBFbnRlciA9IGdyb3Vwc0VudGVyRy5hcHBlbmRTZWxlY3RvcihcImcudGl0bGVcIik7XHJcbiAgICAgICAgdGl0bGVHcm91cEVudGVyLmFwcGVuZChcInJlY3RcIik7XHJcbiAgICAgICAgdGl0bGVHcm91cEVudGVyLmFwcGVuZChcInRleHRcIik7XHJcblxyXG4gICAgICAgIHZhciBnYXBTaXplID0gSGVhdG1hcC5jb21wdXRlR2FwU2l6ZShwYXJlbnRHcm91cC5sZXZlbCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBnYXBTaXplIC8gNDtcclxuICAgICAgICB2YXIgdGl0bGVSZWN0SGVpZ2h0ID0gSGVhdG1hcC5ncm91cFRpdGxlUmVjdEhlaWdodDtcclxuXHJcbiAgICAgICAgdmFyIGRlcHRoID0gc2VsZi5jb25maWcueC5ncm91cHMua2V5cy5sZW5ndGggLSBwYXJlbnRHcm91cC5sZXZlbDtcclxuXHJcbiAgICAgICAgdmFyIG92ZXJsYXAgPSB7XHJcbiAgICAgICAgICAgIHRvcDogMCxcclxuICAgICAgICAgICAgYm90dG9tOiAwXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKCFhdmFpbGFibGVIZWlnaHQpIHtcclxuICAgICAgICAgICAgb3ZlcmxhcC5ib3R0b20gPSBwbG90Lngub3ZlcmxhcC5ib3R0b207XHJcbiAgICAgICAgICAgIG92ZXJsYXAudG9wID0gcGxvdC54Lm92ZXJsYXAudG9wO1xyXG4gICAgICAgICAgICBhdmFpbGFibGVIZWlnaHQgPSBwbG90LmhlaWdodCArIGdhcFNpemUgKyBvdmVybGFwLnRvcCArIG92ZXJsYXAuYm90dG9tO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvdmVybGFwLnRvcCA9IC10aXRsZVJlY3RIZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdwYXJlbnRHcm91cCcscGFyZW50R3JvdXAsICdnYXBTaXplJywgZ2FwU2l6ZSwgcGxvdC54Lm92ZXJsYXApO1xyXG5cclxuICAgICAgICBncm91cHNcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB0cmFuc2xhdGUgPSBcInRyYW5zbGF0ZShcIiArICgocGxvdC5jZWxsV2lkdGggKiB2YWx1ZXNCZWZvcmVDb3VudCkgKyBpICogZ2FwU2l6ZSArIGdhcHNCZWZvcmVTaXplICsgcGFkZGluZykgKyBcIiwgXCIgKyAocGFkZGluZyAtIG92ZXJsYXAudG9wKSArIFwiKVwiO1xyXG4gICAgICAgICAgICAgICAgZ2Fwc0JlZm9yZVNpemUgKz0gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCk7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZXNCZWZvcmVDb3VudCArPSBkLmFsbFZhbHVlc0NvdW50IHx8IDA7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhbnNsYXRlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgZ3JvdXBIZWlnaHQgPSBhdmFpbGFibGVIZWlnaHQgLSBwYWRkaW5nICogMjtcclxuXHJcbiAgICAgICAgdmFyIHRpdGxlR3JvdXBzID0gZ3JvdXBzLnNlbGVjdEFsbChcImcudGl0bGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwidHJhbnNsYXRlKDAsIFwiICsgKDApICsgXCIpXCIpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIHRpbGVSZWN0cyA9IHRpdGxlR3JvdXBzLnNlbGVjdEFsbChcInJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgdGl0bGVSZWN0SGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGQ9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCkgKyBwbG90LmNlbGxXaWR0aCAqIGQuYWxsVmFsdWVzQ291bnQgKyBwYWRkaW5nICogMlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIDApXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiZmlsbFwiLCBcImxpZ2h0Z3JleVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRHcm91cE1vdXNlQ2FsbGJhY2tzKHBhcmVudEdyb3VwLCB0aWxlUmVjdHMpO1xyXG5cclxuXHJcbiAgICAgICAgZ3JvdXBzLnNlbGVjdEFsbChcInJlY3QuZ3JvdXAtcmVjdFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGQ9PiBcImdyb3VwLXJlY3QgZ3JvdXAtcmVjdC1cIiArIGQuaW5kZXgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGdyb3VwSGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGQ9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCkgKyBwbG90LmNlbGxXaWR0aCAqIGQuYWxsVmFsdWVzQ291bnQgKyBwYWRkaW5nICogMlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCBcIndoaXRlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZmlsbC1vcGFjaXR5XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDAuNSlcclxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2VcIiwgXCJibGFja1wiKTtcclxuXHJcbiAgICAgICAgZ3JvdXBzLmVhY2goZnVuY3Rpb24gKGdyb3VwKSB7XHJcbiAgICAgICAgICAgIHNlbGYuZHJhd0dyb3Vwc1guY2FsbChzZWxmLCBncm91cCwgZDMuc2VsZWN0KHRoaXMpLCBncm91cEhlaWdodCAtIHRpdGxlUmVjdEhlaWdodCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGdyb3Vwcy5leGl0KCkucmVtb3ZlKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNldEdyb3VwTW91c2VDYWxsYmFja3MocGFyZW50R3JvdXAsIHRpbGVSZWN0cykge1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgbW91c2VvdmVyQ2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoJ2hpZ2hsaWdodGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzLnBhcmVudE5vZGUucGFyZW50Tm9kZSkuc2VsZWN0QWxsKFwicmVjdC5ncm91cC1yZWN0LVwiICsgZC5pbmRleCkuY2xhc3NlZCgnaGlnaGxpZ2h0ZWQnLCB0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIG1vdXNlb3V0Q2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgbW91c2VvdXRDYWxsYmFja3MucHVzaChmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICBkMy5zZWxlY3QodGhpcykuY2xhc3NlZCgnaGlnaGxpZ2h0ZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzLnBhcmVudE5vZGUucGFyZW50Tm9kZSkuc2VsZWN0QWxsKFwicmVjdC5ncm91cC1yZWN0LVwiICsgZC5pbmRleCkuY2xhc3NlZCgnaGlnaGxpZ2h0ZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHBsb3QudG9vbHRpcCkge1xyXG5cclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goZD0+IHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGh0bWwgPSBwYXJlbnRHcm91cC5sYWJlbCArIFwiOiBcIiArIGQuZ3JvdXBpbmdWYWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAuaHRtbChodG1sKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkMy5ldmVudC5wYWdlWSAtIDI4KSArIFwicHhcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MucHVzaChkPT4ge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgdGlsZVJlY3RzLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKHNlbGYsIGQpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRpbGVSZWN0cy5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoc2VsZiwgZClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlQ2VsbHMoKSB7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgY2VsbENvbnRhaW5lckNsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImNlbGxzXCIpO1xyXG4gICAgICAgIHZhciBnYXBTaXplID0gSGVhdG1hcC5jb21wdXRlR2FwU2l6ZSgwKTtcclxuICAgICAgICB2YXIgcGFkZGluZ1ggPSBwbG90LnguZ3JvdXBzLmNoaWxkcmVuTGlzdC5sZW5ndGggPyBnYXBTaXplIC8gMiA6IDA7XHJcbiAgICAgICAgdmFyIHBhZGRpbmdZID0gcGxvdC55Lmdyb3Vwcy5jaGlsZHJlbkxpc3QubGVuZ3RoID8gZ2FwU2l6ZSAvIDIgOiAwO1xyXG4gICAgICAgIHZhciBjZWxsQ29udGFpbmVyID0gc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIiArIGNlbGxDb250YWluZXJDbGFzcyk7XHJcbiAgICAgICAgY2VsbENvbnRhaW5lci5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgcGFkZGluZ1ggKyBcIiwgXCIgKyBwYWRkaW5nWSArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJjZWxsXCIpO1xyXG4gICAgICAgIHZhciBjZWxsU2hhcGUgPSBwbG90Lnouc2hhcGUudHlwZTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxzID0gY2VsbENvbnRhaW5lci5zZWxlY3RBbGwoXCJnLlwiICsgY2VsbENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShzZWxmLnBsb3QuY2VsbHMpO1xyXG5cclxuICAgICAgICB2YXIgY2VsbEVudGVyRyA9IGNlbGxzLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuY2xhc3NlZChjZWxsQ2xhc3MsIHRydWUpO1xyXG4gICAgICAgIGNlbGxzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYz0+IFwidHJhbnNsYXRlKFwiICsgKChwbG90LmNlbGxXaWR0aCAqIGMuY29sICsgcGxvdC5jZWxsV2lkdGggLyAyKSArIGMuY29sVmFyLmdyb3VwLmdhcHNTaXplKSArIFwiLFwiICsgKChwbG90LmNlbGxIZWlnaHQgKiBjLnJvdyArIHBsb3QuY2VsbEhlaWdodCAvIDIpICsgYy5yb3dWYXIuZ3JvdXAuZ2Fwc1NpemUpICsgXCIpXCIpO1xyXG5cclxuICAgICAgICB2YXIgc2hhcGVzID0gY2VsbHMuc2VsZWN0T3JBcHBlbmQoY2VsbFNoYXBlICsgXCIuY2VsbC1zaGFwZS1cIiArIGNlbGxTaGFwZSk7XHJcblxyXG4gICAgICAgIHNoYXBlc1xyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHBsb3Quei5zaGFwZS53aWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgcGxvdC56LnNoYXBlLmhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIC1wbG90LmNlbGxXaWR0aCAvIDIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAtcGxvdC5jZWxsSGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICAgIHNoYXBlcy5zdHlsZShcImZpbGxcIiwgYz0+IGMudmFsdWUgPT09IHVuZGVmaW5lZCA/IHNlbGYuY29uZmlnLmNvbG9yLm5vRGF0YUNvbG9yIDogcGxvdC56LmNvbG9yLnNjYWxlKGMudmFsdWUpKTtcclxuICAgICAgICBzaGFwZXMuYXR0cihcImZpbGwtb3BhY2l0eVwiLCBkPT4gZC52YWx1ZSA9PT0gdW5kZWZpbmVkID8gMCA6IDEpO1xyXG5cclxuICAgICAgICB2YXIgbW91c2VvdmVyQ2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgdmFyIG1vdXNlb3V0Q2FsbGJhY2tzID0gW107XHJcblxyXG4gICAgICAgIGlmIChwbG90LnRvb2x0aXApIHtcclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3ZlckNhbGxiYWNrcy5wdXNoKGM9PiB7XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDIwMClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIC45KTtcclxuICAgICAgICAgICAgICAgIHZhciBodG1sID0gYy52YWx1ZSA9PT0gdW5kZWZpbmVkID8gc2VsZi5jb25maWcudG9vbHRpcC5ub0RhdGFUZXh0IDogc2VsZi5mb3JtYXRWYWx1ZVooYy52YWx1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLmh0bWwoaHRtbClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLnB1c2goYz0+IHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2VsZi5jb25maWcuaGlnaGxpZ2h0TGFiZWxzKSB7XHJcbiAgICAgICAgICAgIHZhciBoaWdobGlnaHRDbGFzcyA9IHNlbGYuY29uZmlnLmNzc0NsYXNzUHJlZml4ICsgXCJoaWdobGlnaHRcIjtcclxuICAgICAgICAgICAgdmFyIHhMYWJlbENsYXNzID0gYz0+cGxvdC5sYWJlbENsYXNzICsgXCIteC1cIiArIGMuY29sO1xyXG4gICAgICAgICAgICB2YXIgeUxhYmVsQ2xhc3MgPSBjPT5wbG90LmxhYmVsQ2xhc3MgKyBcIi15LVwiICsgYy5yb3c7XHJcblxyXG5cclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goYz0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHhMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgeUxhYmVsQ2xhc3MoYykpLmNsYXNzZWQoaGlnaGxpZ2h0Q2xhc3MsIHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MucHVzaChjPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB4TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB5TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBjZWxscy5vbihcIm1vdXNlb3ZlclwiLCBjID0+IHtcclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2s9PmNhbGxiYWNrKGMpKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCBjID0+IHtcclxuICAgICAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2s9PmNhbGxiYWNrKGMpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNlbGxzLm9uKFwiY2xpY2tcIiwgYz0+IHtcclxuICAgICAgICAgICAgc2VsZi50cmlnZ2VyKFwiY2VsbC1zZWxlY3RlZFwiLCBjKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIGNlbGxzLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3JtYXRWYWx1ZVgodmFsdWUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLnguZm9ybWF0dGVyKSByZXR1cm4gdmFsdWU7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy54LmZvcm1hdHRlci5jYWxsKHRoaXMuY29uZmlnLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9ybWF0VmFsdWVZKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy55LmZvcm1hdHRlcikgcmV0dXJuIHZhbHVlO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcueS5mb3JtYXR0ZXIuY2FsbCh0aGlzLmNvbmZpZywgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcm1hdFZhbHVlWih2YWx1ZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcuei5mb3JtYXR0ZXIpIHJldHVybiB2YWx1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnouZm9ybWF0dGVyLmNhbGwodGhpcy5jb25maWcsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3JtYXRMZWdlbmRWYWx1ZSh2YWx1ZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcubGVnZW5kLmZvcm1hdHRlcikgcmV0dXJuIHZhbHVlO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcubGVnZW5kLmZvcm1hdHRlci5jYWxsKHRoaXMuY29uZmlnLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTGVnZW5kKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgbGVnZW5kWCA9IHRoaXMucGxvdC53aWR0aCArIDEwO1xyXG4gICAgICAgIHZhciBnYXBTaXplID0gSGVhdG1hcC5jb21wdXRlR2FwU2l6ZSgwKTtcclxuICAgICAgICBpZiAodGhpcy5wbG90Lmdyb3VwQnlZKSB7XHJcbiAgICAgICAgICAgIGxlZ2VuZFggKz0gZ2FwU2l6ZSAvIDIgKyBwbG90Lnkub3ZlcmxhcC5yaWdodDtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucGxvdC5ncm91cEJ5WCkge1xyXG4gICAgICAgICAgICBsZWdlbmRYICs9IGdhcFNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsZWdlbmRZID0gMDtcclxuICAgICAgICBpZiAodGhpcy5wbG90Lmdyb3VwQnlYIHx8IHRoaXMucGxvdC5ncm91cEJ5WSkge1xyXG4gICAgICAgICAgICBsZWdlbmRZICs9IGdhcFNpemUgLyAyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGJhcldpZHRoID0gMTA7XHJcbiAgICAgICAgdmFyIGJhckhlaWdodCA9IHRoaXMucGxvdC5oZWlnaHQgLSAyO1xyXG4gICAgICAgIHZhciBzY2FsZSA9IHBsb3Quei5jb2xvci5zY2FsZTtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmQgPSBuZXcgTGVnZW5kKHRoaXMuc3ZnLCB0aGlzLnN2Z0csIHNjYWxlLCBsZWdlbmRYLCBsZWdlbmRZLCB2ID0+IHNlbGYuZm9ybWF0TGVnZW5kVmFsdWUodikpLnNldFJvdGF0ZUxhYmVscyhzZWxmLmNvbmZpZy5sZWdlbmQucm90YXRlTGFiZWxzKS5saW5lYXJHcmFkaWVudEJhcihiYXJXaWR0aCwgYmFySGVpZ2h0KTtcclxuICAgIH1cclxuXHJcblxyXG59XHJcbiIsImltcG9ydCB7Q2hhcnQsIENoYXJ0Q29uZmlnfSBmcm9tIFwiLi9jaGFydFwiO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5pbXBvcnQge0xlZ2VuZH0gZnJvbSBcIi4vbGVnZW5kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSGlzdG9ncmFtQ29uZmlnIGV4dGVuZHMgQ2hhcnRDb25maWd7XHJcblxyXG4gICAgc3ZnQ2xhc3M9IHRoaXMuY3NzQ2xhc3NQcmVmaXgrJ2hpc3RvZ3JhbSc7XHJcbiAgICBzaG93TGVnZW5kPXRydWU7XHJcbiAgICBzaG93VG9vbHRpcCA9dHJ1ZTtcclxuICAgIGxlZ2VuZD17XHJcbiAgICAgICAgd2lkdGg6IDgwLFxyXG4gICAgICAgIG1hcmdpbjogMTAsXHJcbiAgICAgICAgc2hhcGVXaWR0aDogMjBcclxuICAgIH07XHJcbiAgICB4PXsvLyBYIGF4aXMgY29uZmlnXHJcbiAgICAgICAgbGFiZWw6ICcnLCAvLyBheGlzIGxhYmVsXHJcbiAgICAgICAga2V5OiAwLFxyXG4gICAgICAgIHZhbHVlOiAoZCwga2V5KSA9PiBVdGlscy5pc051bWJlcihkKSA/IGQgOiBkW2tleV0sIC8vIHggdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIixcclxuICAgICAgICB0aWNrczogdW5kZWZpbmVkLFxyXG4gICAgfTtcclxuICAgIHk9ey8vIFkgYXhpcyBjb25maWdcclxuICAgICAgICBsYWJlbDogJycsIC8vIGF4aXMgbGFiZWwsXHJcbiAgICAgICAgb3JpZW50OiBcImxlZnRcIixcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIlxyXG4gICAgfTtcclxuICAgIGZyZXF1ZW5jeT10cnVlO1xyXG4gICAgZ3JvdXBzPXtcclxuICAgICAgICBrZXk6IDEsXHJcbiAgICAgICAgdmFsdWU6IChkKSA9PiBkW3RoaXMuZ3JvdXBzLmtleV0gLCAvLyBncm91cGluZyB2YWx1ZSBhY2Nlc3NvcixcclxuICAgICAgICBsYWJlbDogXCJcIlxyXG4gICAgfTtcclxuICAgIGNvbG9yID0gdW5kZWZpbmVkIC8vIHN0cmluZyBvciBmdW5jdGlvbiByZXR1cm5pbmcgY29sb3IncyB2YWx1ZSBmb3IgY29sb3Igc2NhbGVcclxuICAgIGQzQ29sb3JDYXRlZ29yeT0gJ2NhdGVnb3J5MTAnO1xyXG4gICAgdHJhbnNpdGlvbj0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdmFyIGNvbmZpZyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmKGN1c3RvbSl7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSGlzdG9ncmFtIGV4dGVuZHMgQ2hhcnR7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBzdXBlcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBuZXcgSGlzdG9ncmFtQ29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpe1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IEhpc3RvZ3JhbUNvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpe1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcbiAgICAgICAgdmFyIHNlbGY9dGhpcztcclxuXHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgdGhpcy5wbG90Lng9e307XHJcbiAgICAgICAgdGhpcy5wbG90Lnk9e307XHJcbiAgICAgICAgdGhpcy5wbG90LmJhcj17XHJcbiAgICAgICAgICAgIGNvbG9yOiBudWxsLy9jb2xvciBzY2FsZSBtYXBwaW5nIGZ1bmN0aW9uXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnNob3dMZWdlbmQgPSBjb25mLnNob3dMZWdlbmQ7XHJcbiAgICAgICAgaWYodGhpcy5wbG90LnNob3dMZWdlbmQpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWFyZ2luLnJpZ2h0ID0gY29uZi5tYXJnaW4ucmlnaHQgKyBjb25mLmxlZ2VuZC53aWR0aCtjb25mLmxlZ2VuZC5tYXJnaW4qMjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLmNvbXB1dGVQbG90U2l6ZSgpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIGlmKGNvbmYuZDNDb2xvckNhdGVnb3J5KXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmNvbG9yQ2F0ZWdvcnkgPSBkMy5zY2FsZVtjb25mLmQzQ29sb3JDYXRlZ29yeV0oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNvbG9yVmFsdWUgPSBjb25mLmNvbG9yO1xyXG4gICAgICAgIGlmIChjb2xvclZhbHVlICYmIHR5cGVvZiBjb2xvclZhbHVlID09PSAnc3RyaW5nJyB8fCBjb2xvclZhbHVlIGluc3RhbmNlb2YgU3RyaW5nKXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmNvbG9yID0gY29sb3JWYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZih0aGlzLnBsb3QuY29sb3JDYXRlZ29yeSl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuY29uZmlnLmdyb3Vwcyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgZG9tYWluID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoZDMubWFwKHRoaXMuZGF0YSwgZCA9PiB0aGlzLmNvbmZpZy5ncm91cHMudmFsdWUuY2FsbCh0aGlzLmNvbmZpZywgZCkpWydfJ10pO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wbG90LmNvbG9yQ2F0ZWdvcnkuZG9tYWluKGRvbWFpbik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5jb2xvciA9IGQgPT4gIHNlbGYucGxvdC5jb2xvckNhdGVnb3J5KGQua2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC5kYXRhID0gdGhpcy5nZXREYXRhVG9QbG90KCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFgoKTtcclxuICAgICAgICB0aGlzLnNldHVwSGlzdG9ncmFtKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cEdyb3VwU3RhY2tzKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFkoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXBYKCl7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB4ID0gcGxvdC54O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWcueDtcclxuXHJcbiAgICAgICAgLyogKlxyXG4gICAgICAgICAqIHZhbHVlIGFjY2Vzc29yIC0gcmV0dXJucyB0aGUgdmFsdWUgdG8gZW5jb2RlIGZvciBhIGdpdmVuIGRhdGEgb2JqZWN0LlxyXG4gICAgICAgICAqIHNjYWxlIC0gbWFwcyB2YWx1ZSB0byBhIHZpc3VhbCBkaXNwbGF5IGVuY29kaW5nLCBzdWNoIGFzIGEgcGl4ZWwgcG9zaXRpb24uXHJcbiAgICAgICAgICogbWFwIGZ1bmN0aW9uIC0gbWFwcyBmcm9tIGRhdGEgdmFsdWUgdG8gZGlzcGxheSB2YWx1ZVxyXG4gICAgICAgICAqIGF4aXMgLSBzZXRzIHVwIGF4aXNcclxuICAgICAgICAgKiovXHJcbiAgICAgICAgeC52YWx1ZSA9IGQgPT4gY29uZi52YWx1ZShkLCBjb25mLmtleSk7XHJcbiAgICAgICAgeC5zY2FsZSA9IGQzLnNjYWxlW2NvbmYuc2NhbGVdKCkucmFuZ2UoWzAsIHBsb3Qud2lkdGhdKTtcclxuICAgICAgICB4Lm1hcCA9IGQgPT4geC5zY2FsZSh4LnZhbHVlKGQpKTtcclxuXHJcbiAgICAgICAgeC5heGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh4LnNjYWxlKS5vcmllbnQoY29uZi5vcmllbnQpO1xyXG4gICAgICAgIGlmKGNvbmYudGlja3Mpe1xyXG4gICAgICAgICAgICB4LmF4aXMudGlja3MoY29uZi50aWNrcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5wbG90LmRhdGE7XHJcbiAgICAgICAgcGxvdC54LnNjYWxlLmRvbWFpbihbZDMubWluKGRhdGEsIHBsb3QueC52YWx1ZSksIGQzLm1heChkYXRhLCBwbG90LngudmFsdWUpXSk7XHJcbiAgICAgICAgXHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwWSAoKXtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHkgPSBwbG90Lnk7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZy55O1xyXG4gICAgICAgIHkuc2NhbGUgPSBkMy5zY2FsZVtjb25mLnNjYWxlXSgpLnJhbmdlKFtwbG90LmhlaWdodCwgMF0pO1xyXG5cclxuICAgICAgICB5LmF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHkuc2NhbGUpLm9yaWVudChjb25mLm9yaWVudCk7XHJcblxyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5wbG90LmRhdGE7XHJcbiAgICAgICAgcGxvdC55LnNjYWxlLmRvbWFpbihbMCwgZDMubWF4KHBsb3QuaGlzdG9ncmFtQmlucywgZD0+ZC55KV0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cEhpc3RvZ3JhbSgpIHtcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeCA9IHBsb3QueDtcclxuICAgICAgICB2YXIgeSA9IHBsb3QueTtcclxuICAgICAgICB2YXIgdGlja3MgPSB0aGlzLmNvbmZpZy54LnRpY2tzID8geC5zY2FsZS50aWNrcyh0aGlzLmNvbmZpZy54LnRpY2tzKSA6IHguc2NhbGUudGlja3MoKTtcclxuXHJcbiAgICAgICAgcGxvdC5oaXN0b2dyYW0gPSBkMy5sYXlvdXQuaGlzdG9ncmFtKCkuZnJlcXVlbmN5KHRoaXMuY29uZmlnLmZyZXF1ZW5jeSlcclxuICAgICAgICAgICAgLnZhbHVlKHgudmFsdWUpXHJcbiAgICAgICAgICAgIC5iaW5zKHRpY2tzKTtcclxuICAgICAgICBwbG90Lmhpc3RvZ3JhbUJpbnMgPSBwbG90Lmhpc3RvZ3JhbSh0aGlzLnBsb3QuZGF0YSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNldHVwR3JvdXBTdGFja3MoKSB7XHJcbiAgICAgICAgdmFyIHNlbGY9dGhpcztcclxuICAgICAgICB0aGlzLnBsb3QuZ3JvdXBpbmdFbmFibGVkID0gdGhpcy5jb25maWcuZ3JvdXBzICYmIHRoaXMuY29uZmlnLmdyb3Vwcy52YWx1ZTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnBsb3Quc3RhY2sgPSBkMy5sYXlvdXQuc3RhY2soKS52YWx1ZXMoZD0+ZC5oaXN0b2dyYW1CaW5zKTtcclxuICAgICAgICB0aGlzLnBsb3QuZ3JvdXBlZERhdGEgPSAgZDMubmVzdCgpLmtleShkID0+IHRoaXMucGxvdC5ncm91cGluZ0VuYWJsZWQgPyB0aGlzLmNvbmZpZy5ncm91cHMudmFsdWUuY2FsbCh0aGlzLmNvbmZpZywgZCkgOiAncm9vdCcgKS5lbnRyaWVzKHRoaXMucGxvdC5kYXRhKTtcclxuICAgICAgICB0aGlzLnBsb3QuZ3JvdXBlZERhdGEuZm9yRWFjaChkPT57XHJcbiAgICAgICAgICAgIGQuaGlzdG9ncmFtQmlucyA9IHRoaXMucGxvdC5oaXN0b2dyYW0uZnJlcXVlbmN5KHRoaXMuY29uZmlnLmZyZXF1ZW5jeSB8fCB0aGlzLnBsb3QuZ3JvdXBpbmdFbmFibGVkKShkLnZhbHVlcyk7XHJcbiAgICAgICAgICAgIGlmKCF0aGlzLmNvbmZpZy5mcmVxdWVuY3kgJiYgdGhpcy5wbG90Lmdyb3VwaW5nRW5hYmxlZCl7XHJcbiAgICAgICAgICAgICAgICBkLmhpc3RvZ3JhbUJpbnMuZm9yRWFjaChiID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBiLmR5ID0gYi5keS90aGlzLnBsb3QuZGF0YS5sZW5ndGhcclxuICAgICAgICAgICAgICAgICAgICBiLnkgPSBiLnkvdGhpcy5wbG90LmRhdGEubGVuZ3RoXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucGxvdC5zdGFja2VkSGlzdG9ncmFtcyA9IHRoaXMucGxvdC5zdGFjayh0aGlzLnBsb3QuZ3JvdXBlZERhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERhdGFUb1Bsb3QoKXtcclxuICAgICAgICBpZighdGhpcy5lbmFibGVkR3JvdXBzKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEuZmlsdGVyKGQgPT4gdGhpcy5lbmFibGVkR3JvdXBzLmluZGV4T2YodGhpcy5jb25maWcuZ3JvdXBzLnZhbHVlLmNhbGwodGhpcy5jb25maWcsIGQpKT4tMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhd0F4aXNYKCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBheGlzQ29uZiA9IHRoaXMuY29uZmlnLng7XHJcbiAgICAgICAgdmFyIGF4aXMgPSBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMteCcpK1wiLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMnKSsoc2VsZi5jb25maWcuZ3VpZGVzID8gJycgOiAnLicrc2VsZi5wcmVmaXhDbGFzcygnbm8tZ3VpZGVzJykpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgcGxvdC5oZWlnaHQgKyBcIilcIik7XHJcblxyXG4gICAgICAgIHZhciBheGlzVCA9IGF4aXM7XHJcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLnRyYW5zaXRpb24pIHtcclxuICAgICAgICAgICAgYXhpc1QgPSBheGlzLnRyYW5zaXRpb24oKS5lYXNlKFwic2luLWluLW91dFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGF4aXNULmNhbGwocGxvdC54LmF4aXMpO1xyXG5cclxuICAgICAgICBheGlzLnNlbGVjdE9yQXBwZW5kKFwidGV4dC5cIitzZWxmLnByZWZpeENsYXNzKCdsYWJlbCcpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisgKHBsb3Qud2lkdGgvMikgK1wiLFwiKyAocGxvdC5tYXJnaW4uYm90dG9tKSArXCIpXCIpICAvLyB0ZXh0IGlzIGRyYXduIG9mZiB0aGUgc2NyZWVuIHRvcCBsZWZ0LCBtb3ZlIGRvd24gYW5kIG91dCBhbmQgcm90YXRlXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCItMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGF4aXNDb25mLmxhYmVsKTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhd0F4aXNZKCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBheGlzQ29uZiA9IHRoaXMuY29uZmlnLnk7XHJcbiAgICAgICAgdmFyIGF4aXMgPSBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMteScpK1wiLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMnKSsoc2VsZi5jb25maWcuZ3VpZGVzID8gJycgOiAnLicrc2VsZi5wcmVmaXhDbGFzcygnbm8tZ3VpZGVzJykpKTtcclxuXHJcbiAgICAgICAgdmFyIGF4aXNUID0gYXhpcztcclxuICAgICAgICBpZiAoc2VsZi5jb25maWcudHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICBheGlzVCA9IGF4aXMudHJhbnNpdGlvbigpLmVhc2UoXCJzaW4taW4tb3V0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXhpc1QuY2FsbChwbG90LnkuYXhpcyk7XHJcblxyXG4gICAgICAgIGF4aXMuc2VsZWN0T3JBcHBlbmQoXCJ0ZXh0LlwiK3NlbGYucHJlZml4Q2xhc3MoJ2xhYmVsJykpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyAtcGxvdC5tYXJnaW4ubGVmdCArXCIsXCIrKHBsb3QuaGVpZ2h0LzIpK1wiKXJvdGF0ZSgtOTApXCIpICAvLyB0ZXh0IGlzIGRyYXduIG9mZiB0aGUgc2NyZWVuIHRvcCBsZWZ0LCBtb3ZlIGRvd24gYW5kIG91dCBhbmQgcm90YXRlXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCIxZW1cIilcclxuICAgICAgICAgICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoYXhpc0NvbmYubGFiZWwpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgZHJhd0hpc3RvZ3JhbSgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGxheWVyQ2xhc3MgPSB0aGlzLnByZWZpeENsYXNzKFwibGF5ZXJcIik7XHJcblxyXG4gICAgICAgIHZhciBiYXJDbGFzcyA9IHRoaXMucHJlZml4Q2xhc3MoXCJiYXJcIik7XHJcbiAgICAgICAgdmFyIGxheWVyID0gc2VsZi5zdmdHLnNlbGVjdEFsbChcIi5cIitsYXllckNsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShwbG90LnN0YWNrZWRIaXN0b2dyYW1zKTtcclxuXHJcbiAgICAgICAgbGF5ZXIuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgbGF5ZXJDbGFzcyk7XHJcblxyXG4gICAgICAgIHZhciBiYXIgPSBsYXllci5zZWxlY3RBbGwoXCIuXCIrYmFyQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKGQgPT4gZC5oaXN0b2dyYW1CaW5zKTtcclxuXHJcbiAgICAgICAgYmFyLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGJhckNsYXNzKVxyXG4gICAgICAgICAgICAuYXBwZW5kKFwicmVjdFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgMSk7XHJcblxyXG5cclxuICAgICAgICB2YXIgYmFyUmVjdCA9IGJhci5zZWxlY3QoXCJyZWN0XCIpO1xyXG5cclxuICAgICAgICB2YXIgYmFyUmVjdFQgPSBiYXJSZWN0O1xyXG4gICAgICAgIHZhciBiYXJUID0gYmFyO1xyXG4gICAgICAgIHZhciBsYXllclQgPSBsYXllcjtcclxuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgICAgIGJhclJlY3RUID0gYmFyUmVjdC50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgICAgIGJhclQgPSBiYXIudHJhbnNpdGlvbigpO1xyXG4gICAgICAgICAgICBsYXllclQ9IGxheWVyLnRyYW5zaXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJhclQuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIHBsb3QueC5zY2FsZShkLngpICsgXCIsXCIgKyAocGxvdC55LnNjYWxlKGQueTAgK2QueSkpICsgXCIpXCI7IH0pO1xyXG5cclxuICAgICAgICB2YXIgZHggPSBwbG90Lmhpc3RvZ3JhbUJpbnMubGVuZ3RoID8gIHBsb3QueC5zY2FsZShwbG90Lmhpc3RvZ3JhbUJpbnNbMF0uZHgpIDogMDtcclxuICAgICAgICBiYXJSZWN0VFxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsICBkeCAtIHBsb3QueC5zY2FsZSgwKS0gMSlcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZCA9PiAgIHBsb3QuaGVpZ2h0IC0gcGxvdC55LnNjYWxlKGQueSkpO1xyXG5cclxuICAgICAgICBpZih0aGlzLnBsb3QuY29sb3Ipe1xyXG4gICAgICAgICAgICBsYXllclRcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCB0aGlzLnBsb3QuY29sb3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBsb3QudG9vbHRpcCkge1xyXG4gICAgICAgICAgICBiYXIub24oXCJtb3VzZW92ZXJcIiwgZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDIwMClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIC45KTtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC5odG1sKGQueSlcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG4gICAgICAgICAgICB9KS5vbihcIm1vdXNlb3V0XCIsIGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxheWVyLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgICAgICBiYXIuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShuZXdEYXRhKXtcclxuICAgICAgICBzdXBlci51cGRhdGUobmV3RGF0YSk7XHJcbiAgICAgICAgdGhpcy5kcmF3QXhpc1goKTtcclxuICAgICAgICB0aGlzLmRyYXdBeGlzWSgpO1xyXG5cclxuICAgICAgICB0aGlzLmRyYXdIaXN0b2dyYW0oKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVMZWdlbmQoKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIHVwZGF0ZUxlZ2VuZCgpIHtcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuXHJcbiAgICAgICAgdmFyIHNjYWxlID0gcGxvdC5jb2xvckNhdGVnb3J5O1xyXG4gICAgICAgIGlmKCFzY2FsZS5kb21haW4oKSB8fCBzY2FsZS5kb21haW4oKS5sZW5ndGg8Mil7XHJcbiAgICAgICAgICAgIHBsb3Quc2hvd0xlZ2VuZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIXBsb3Quc2hvd0xlZ2VuZCl7XHJcbiAgICAgICAgICAgIGlmKHBsb3QubGVnZW5kICYmIHBsb3QubGVnZW5kLmNvbnRhaW5lcil7XHJcbiAgICAgICAgICAgICAgICBwbG90LmxlZ2VuZC5jb250YWluZXIucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHZhciBsZWdlbmRYID0gdGhpcy5wbG90LndpZHRoICsgdGhpcy5jb25maWcubGVnZW5kLm1hcmdpbjtcclxuICAgICAgICB2YXIgbGVnZW5kWSA9IHRoaXMuY29uZmlnLmxlZ2VuZC5tYXJnaW47XHJcblxyXG4gICAgICAgIHBsb3QubGVnZW5kID0gbmV3IExlZ2VuZCh0aGlzLnN2ZywgdGhpcy5zdmdHLCBzY2FsZSwgbGVnZW5kWCwgbGVnZW5kWSk7XHJcblxyXG4gICAgICAgIHBsb3QubGVnZW5kQ29sb3IgPSBwbG90LmxlZ2VuZC5jb2xvcigpXHJcbiAgICAgICAgICAgIC5zaGFwZVdpZHRoKHRoaXMuY29uZmlnLmxlZ2VuZC5zaGFwZVdpZHRoKVxyXG4gICAgICAgICAgICAub3JpZW50KCd2ZXJ0aWNhbCcpXHJcbiAgICAgICAgICAgIC5zY2FsZShzY2FsZSk7XHJcblxyXG5cclxuICAgICAgICBwbG90LmxlZ2VuZENvbG9yLm9uKCdjZWxsY2xpY2snLCBjPT4gdGhpcy5vbkxlZ2VuZENlbGxDbGljayhjKSk7XHJcblxyXG4gICAgICAgIHBsb3QubGVnZW5kLmNvbnRhaW5lclxyXG4gICAgICAgICAgICAuY2FsbChwbG90LmxlZ2VuZENvbG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkxlZ2VuZENlbGxDbGljayhjZWxsVmFsdWUpe1xyXG4gICAgICAgIHRoaXMudXBkYXRlRW5hYmxlZEdyb3VwcyhjZWxsVmFsdWUpO1xyXG5cclxuICAgICAgICB2YXIgaXNEaXNhYmxlZCA9IHRoaXMuZW5hYmxlZEdyb3Vwcy5pbmRleE9mKGNlbGxWYWx1ZSk8MDtcclxuICAgICAgICB0aGlzLnBsb3QubGVnZW5kLmNvbnRhaW5lci5zZWxlY3RBbGwoXCJnLmNlbGxcIikuZWFjaChmdW5jdGlvbihjZWxsKXtcclxuICAgICAgICAgICAgaWYoY2VsbCA9PSBjZWxsVmFsdWUpe1xyXG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoXCJvZGMtZGlzYWJsZWRcIiwgaXNEaXNhYmxlZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUVuYWJsZWRHcm91cHMoY2VsbFZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWRHcm91cHMpIHtcclxuICAgICAgICAgICAgdGhpcy5lbmFibGVkR3JvdXBzID0gdGhpcy5wbG90LmNvbG9yQ2F0ZWdvcnkuZG9tYWluKCkuc2xpY2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5lbmFibGVkR3JvdXBzLmluZGV4T2YoY2VsbFZhbHVlKTtcclxuXHJcbiAgICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZWRHcm91cHMucHVzaChjZWxsVmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZEdyb3Vwcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHNldERhdGEoZGF0YSl7XHJcbiAgICAgICAgc3VwZXIuc2V0RGF0YShkYXRhKTtcclxuICAgICAgICB0aGlzLmVuYWJsZWRHcm91cHMgPSBudWxsO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7RDNFeHRlbnNpb25zfSBmcm9tICcuL2QzLWV4dGVuc2lvbnMnXHJcbkQzRXh0ZW5zaW9ucy5leHRlbmQoKTtcclxuXHJcbmV4cG9ydCB7U2NhdHRlclBsb3QsIFNjYXR0ZXJQbG90Q29uZmlnfSBmcm9tIFwiLi9zY2F0dGVycGxvdFwiO1xyXG5leHBvcnQge1NjYXR0ZXJQbG90TWF0cml4LCBTY2F0dGVyUGxvdE1hdHJpeENvbmZpZ30gZnJvbSBcIi4vc2NhdHRlcnBsb3QtbWF0cml4XCI7XHJcbmV4cG9ydCB7Q29ycmVsYXRpb25NYXRyaXgsIENvcnJlbGF0aW9uTWF0cml4Q29uZmlnfSBmcm9tICcuL2NvcnJlbGF0aW9uLW1hdHJpeCdcclxuZXhwb3J0IHtSZWdyZXNzaW9uLCBSZWdyZXNzaW9uQ29uZmlnfSBmcm9tICcuL3JlZ3Jlc3Npb24nXHJcbmV4cG9ydCB7SGVhdG1hcCwgSGVhdG1hcENvbmZpZ30gZnJvbSAnLi9oZWF0bWFwJ1xyXG5leHBvcnQge0hlYXRtYXBUaW1lU2VyaWVzLCBIZWF0bWFwVGltZVNlcmllc0NvbmZpZ30gZnJvbSAnLi9oZWF0bWFwLXRpbWVzZXJpZXMnXHJcbmV4cG9ydCB7SGlzdG9ncmFtLCBIaXN0b2dyYW1Db25maWd9IGZyb20gJy4vaGlzdG9ncmFtJ1xyXG5leHBvcnQge0JhckNoYXJ0LCBCYXJDaGFydENvbmZpZ30gZnJvbSAnLi9iYXItY2hhcnQnXHJcbmV4cG9ydCB7U3RhdGlzdGljc1V0aWxzfSBmcm9tICcuL3N0YXRpc3RpY3MtdXRpbHMnXHJcbmV4cG9ydCB7TGVnZW5kfSBmcm9tICcuL2xlZ2VuZCdcclxuXHJcblxyXG5cclxuXHJcblxyXG4iLCJpbXBvcnQge1V0aWxzfSBmcm9tIFwiLi91dGlsc1wiO1xyXG5pbXBvcnQge2NvbG9yLCBzaXplLCBzeW1ib2x9IGZyb20gXCIuLi9ib3dlcl9jb21wb25lbnRzL2QzLWxlZ2VuZC9uby1leHRlbmRcIjtcclxuXHJcbi8qdmFyIGQzID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9kMycpO1xyXG4qL1xyXG4vLyB2YXIgbGVnZW5kID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9kMy1sZWdlbmQvbm8tZXh0ZW5kJyk7XHJcbi8vXHJcbi8vIG1vZHVsZS5leHBvcnRzLmxlZ2VuZCA9IGxlZ2VuZDtcclxuXHJcbmV4cG9ydCBjbGFzcyBMZWdlbmQge1xyXG5cclxuICAgIGNzc0NsYXNzUHJlZml4PVwib2RjLVwiO1xyXG4gICAgbGVnZW5kQ2xhc3M9dGhpcy5jc3NDbGFzc1ByZWZpeCtcImxlZ2VuZFwiO1xyXG4gICAgY29udGFpbmVyO1xyXG4gICAgc2NhbGU7XHJcbiAgICBjb2xvcj0gY29sb3I7XHJcbiAgICBzaXplID0gc2l6ZTtcclxuICAgIHN5bWJvbD0gc3ltYm9sO1xyXG4gICAgZ3VpZDtcclxuXHJcbiAgICBsYWJlbEZvcm1hdCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzdmcsIGxlZ2VuZFBhcmVudCwgc2NhbGUsIGxlZ2VuZFgsIGxlZ2VuZFksIGxhYmVsRm9ybWF0KXtcclxuICAgICAgICB0aGlzLnNjYWxlPXNjYWxlO1xyXG4gICAgICAgIHRoaXMuc3ZnID0gc3ZnO1xyXG4gICAgICAgIHRoaXMuZ3VpZCA9IFV0aWxzLmd1aWQoKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9ICBVdGlscy5zZWxlY3RPckFwcGVuZChsZWdlbmRQYXJlbnQsIFwiZy5cIit0aGlzLmxlZ2VuZENsYXNzLCBcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrbGVnZW5kWCtcIixcIitsZWdlbmRZK1wiKVwiKVxyXG4gICAgICAgICAgICAuY2xhc3NlZCh0aGlzLmxlZ2VuZENsYXNzLCB0cnVlKTtcclxuXHJcbiAgICAgICAgdGhpcy5sYWJlbEZvcm1hdCA9IGxhYmVsRm9ybWF0O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgbGluZWFyR3JhZGllbnRCYXIoYmFyV2lkdGgsIGJhckhlaWdodCwgdGl0bGUpe1xyXG4gICAgICAgIHZhciBncmFkaWVudElkID0gdGhpcy5jc3NDbGFzc1ByZWZpeCtcImxpbmVhci1ncmFkaWVudFwiK1wiLVwiK3RoaXMuZ3VpZDtcclxuICAgICAgICB2YXIgc2NhbGU9IHRoaXMuc2NhbGU7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmxpbmVhckdyYWRpZW50ID0gVXRpbHMubGluZWFyR3JhZGllbnQodGhpcy5zdmcsIGdyYWRpZW50SWQsIHRoaXMuc2NhbGUucmFuZ2UoKSwgMCwgMTAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kKFwicmVjdFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGJhcldpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBiYXJIZWlnaHQpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgMClcclxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcInVybCgjXCIrZ3JhZGllbnRJZCtcIilcIik7XHJcblxyXG5cclxuICAgICAgICB2YXIgdGlja3MgPSB0aGlzLmNvbnRhaW5lci5zZWxlY3RBbGwoXCJ0ZXh0XCIpXHJcbiAgICAgICAgICAgIC5kYXRhKCBzY2FsZS5kb21haW4oKSApO1xyXG4gICAgICAgIHZhciB0aWNrc051bWJlciA9c2NhbGUuZG9tYWluKCkubGVuZ3RoLTE7XHJcbiAgICAgICAgdGlja3MuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpO1xyXG5cclxuICAgICAgICB0aWNrcy5hdHRyKFwieFwiLCBiYXJXaWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsICAoZCwgaSkgPT4gIGJhckhlaWdodCAtKGkqYmFySGVpZ2h0L3RpY2tzTnVtYmVyKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJkeFwiLCAzKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcImR5XCIsIDEpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiYWxpZ25tZW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGQ9PiBzZWxmLmxhYmVsRm9ybWF0ID8gc2VsZi5sYWJlbEZvcm1hdChkKSA6IGQpO1xyXG4gICAgICAgIHRpY2tzLmF0dHIoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgIGlmKHRoaXMucm90YXRlTGFiZWxzKXtcclxuICAgICAgICAgICAgdGlja3NcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInJvdGF0ZSgtNDUsIFwiICsgYmFyV2lkdGggKyBcIiwgXCIgKyAoYmFySGVpZ2h0IC0oaSpiYXJIZWlnaHQvdGlja3NOdW1iZXIpKSArIFwiKVwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcInN0YXJ0XCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImR4XCIsIDUpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImR5XCIsIDUpO1xyXG5cclxuICAgICAgICB9ZWxzZXtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aWNrcy5leGl0KCkucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFJvdGF0ZUxhYmVscyhyb3RhdGVMYWJlbHMpIHtcclxuICAgICAgICB0aGlzLnJvdGF0ZUxhYmVscyA9IHJvdGF0ZUxhYmVscztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBcclxufSIsImltcG9ydCB7Q2hhcnQsIENoYXJ0Q29uZmlnfSBmcm9tIFwiLi9jaGFydFwiO1xyXG5pbXBvcnQge1NjYXR0ZXJQbG90LCBTY2F0dGVyUGxvdENvbmZpZ30gZnJvbSBcIi4vc2NhdHRlcnBsb3RcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IHtTdGF0aXN0aWNzVXRpbHN9IGZyb20gJy4vc3RhdGlzdGljcy11dGlscydcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgUmVncmVzc2lvbkNvbmZpZyBleHRlbmRzIFNjYXR0ZXJQbG90Q29uZmlne1xyXG5cclxuICAgIG1haW5SZWdyZXNzaW9uID0gdHJ1ZTtcclxuICAgIGdyb3VwUmVncmVzc2lvbiA9IHRydWU7XHJcbiAgICBjb25maWRlbmNlPXtcclxuICAgICAgICBsZXZlbDogMC45NSxcclxuICAgICAgICBjcml0aWNhbFZhbHVlOiAoZGVncmVlc09mRnJlZWRvbSwgY3JpdGljYWxQcm9iYWJpbGl0eSkgPT4gU3RhdGlzdGljc1V0aWxzLnRWYWx1ZShkZWdyZWVzT2ZGcmVlZG9tLCBjcml0aWNhbFByb2JhYmlsaXR5KSxcclxuICAgICAgICBtYXJnaW5PZkVycm9yOiB1bmRlZmluZWQgLy9jdXN0b20gIG1hcmdpbiBPZiBFcnJvciBmdW5jdGlvbiAoeCwgcG9pbnRzKVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIGlmKGN1c3RvbSl7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUmVncmVzc2lvbiBleHRlbmRzIFNjYXR0ZXJQbG90e1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IFJlZ3Jlc3Npb25Db25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZyl7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgUmVncmVzc2lvbkNvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpe1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcbiAgICAgICAgdGhpcy5pbml0UmVncmVzc2lvbkxpbmVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFJlZ3Jlc3Npb25MaW5lcygpe1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGdyb3Vwc0F2YWlsYWJsZSA9IHNlbGYuY29uZmlnLmdyb3VwcyAmJiBzZWxmLmNvbmZpZy5ncm91cHMudmFsdWU7XHJcblxyXG4gICAgICAgIHNlbGYucGxvdC5yZWdyZXNzaW9ucz0gW107XHJcblxyXG5cclxuICAgICAgICBpZihncm91cHNBdmFpbGFibGUgJiYgc2VsZi5jb25maWcubWFpblJlZ3Jlc3Npb24pe1xyXG4gICAgICAgICAgICB2YXIgcmVncmVzc2lvbiA9IHRoaXMuaW5pdFJlZ3Jlc3Npb24odGhpcy5wbG90LmRhdGEsIGZhbHNlKTtcclxuICAgICAgICAgICAgc2VsZi5wbG90LnJlZ3Jlc3Npb25zLnB1c2gocmVncmVzc2lvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihzZWxmLmNvbmZpZy5ncm91cFJlZ3Jlc3Npb24pe1xyXG4gICAgICAgICAgICB0aGlzLmluaXRHcm91cFJlZ3Jlc3Npb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXRHcm91cFJlZ3Jlc3Npb24oKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBkYXRhQnlHcm91cCA9IHt9O1xyXG4gICAgICAgIHRoaXMucGxvdC5kYXRhLmZvckVhY2ggKGQ9PntcclxuICAgICAgICAgICAgdmFyIGdyb3VwVmFsID0gc2VsZi5jb25maWcuZ3JvdXBzLnZhbHVlKGQsIHNlbGYuY29uZmlnLmdyb3Vwcy5rZXkpO1xyXG5cclxuICAgICAgICAgICAgaWYoIWdyb3VwVmFsICYmIGdyb3VwVmFsIT09MCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKCFkYXRhQnlHcm91cFtncm91cFZhbF0pe1xyXG4gICAgICAgICAgICAgICAgZGF0YUJ5R3JvdXBbZ3JvdXBWYWxdID0gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGF0YUJ5R3JvdXBbZ3JvdXBWYWxdLnB1c2goZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZvcih2YXIga2V5IGluIGRhdGFCeUdyb3VwKXtcclxuICAgICAgICAgICAgaWYgKCFkYXRhQnlHcm91cC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHJlZ3Jlc3Npb24gPSB0aGlzLmluaXRSZWdyZXNzaW9uKGRhdGFCeUdyb3VwW2tleV0sIGtleSk7XHJcbiAgICAgICAgICAgIHNlbGYucGxvdC5yZWdyZXNzaW9ucy5wdXNoKHJlZ3Jlc3Npb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0UmVncmVzc2lvbih2YWx1ZXMsIGdyb3VwVmFsKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciBwb2ludHMgPSB2YWx1ZXMubWFwKGQ9PntcclxuICAgICAgICAgICAgcmV0dXJuIFtwYXJzZUZsb2F0KHNlbGYucGxvdC54LnZhbHVlKGQpKSwgcGFyc2VGbG9hdChzZWxmLnBsb3QueS52YWx1ZShkKSldO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBwb2ludHMuc29ydCgoYSxiKSA9PiBhWzBdLWJbMF0pO1xyXG5cclxuICAgICAgICB2YXIgbGluZWFyUmVncmVzc2lvbiA9ICBTdGF0aXN0aWNzVXRpbHMubGluZWFyUmVncmVzc2lvbihwb2ludHMpO1xyXG4gICAgICAgIHZhciBsaW5lYXJSZWdyZXNzaW9uTGluZSA9IFN0YXRpc3RpY3NVdGlscy5saW5lYXJSZWdyZXNzaW9uTGluZShsaW5lYXJSZWdyZXNzaW9uKTtcclxuXHJcblxyXG4gICAgICAgIHZhciBleHRlbnRYID0gZDMuZXh0ZW50KHBvaW50cywgZD0+ZFswXSk7XHJcblxyXG5cclxuICAgICAgICB2YXIgbGluZVBvaW50cyA9IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeDogZXh0ZW50WFswXSxcclxuICAgICAgICAgICAgICAgIHk6IGxpbmVhclJlZ3Jlc3Npb25MaW5lKGV4dGVudFhbMF0pXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHg6IGV4dGVudFhbMV0sXHJcbiAgICAgICAgICAgICAgICB5OiBsaW5lYXJSZWdyZXNzaW9uTGluZShleHRlbnRYWzFdKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgdmFyIGxpbmUgPSBkMy5zdmcubGluZSgpXHJcbiAgICAgICAgICAgIC5pbnRlcnBvbGF0ZShcImJhc2lzXCIpXHJcbiAgICAgICAgICAgIC54KGQgPT4gc2VsZi5wbG90Lnguc2NhbGUoZC54KSlcclxuICAgICAgICAgICAgLnkoZCA9PiBzZWxmLnBsb3QueS5zY2FsZShkLnkpKTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgdmFyIGNvbG9yID0gc2VsZi5wbG90LmRvdC5jb2xvcjtcclxuXHJcbiAgICAgICAgdmFyIGRlZmF1bHRDb2xvciA9IFwiYmxhY2tcIjtcclxuICAgICAgICBpZihVdGlscy5pc0Z1bmN0aW9uKGNvbG9yKSl7XHJcbiAgICAgICAgICAgIGlmKHZhbHVlcy5sZW5ndGggJiYgZ3JvdXBWYWwhPT1mYWxzZSl7XHJcbiAgICAgICAgICAgICAgICBjb2xvciA9IGNvbG9yKHZhbHVlc1swXSk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgY29sb3IgPSBkZWZhdWx0Q29sb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZSBpZighY29sb3IgJiYgZ3JvdXBWYWw9PT1mYWxzZSl7XHJcbiAgICAgICAgICAgIGNvbG9yID0gZGVmYXVsdENvbG9yO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHZhciBjb25maWRlbmNlID0gdGhpcy5jb21wdXRlQ29uZmlkZW5jZShwb2ludHMsIGV4dGVudFgsICBsaW5lYXJSZWdyZXNzaW9uLGxpbmVhclJlZ3Jlc3Npb25MaW5lKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBncm91cDogZ3JvdXBWYWwgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgIGxpbmU6IGxpbmUsXHJcbiAgICAgICAgICAgIGxpbmVQb2ludHM6IGxpbmVQb2ludHMsXHJcbiAgICAgICAgICAgIGNvbG9yOiBjb2xvcixcclxuICAgICAgICAgICAgY29uZmlkZW5jZTogY29uZmlkZW5jZVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgY29tcHV0ZUNvbmZpZGVuY2UocG9pbnRzLCBleHRlbnRYLCBsaW5lYXJSZWdyZXNzaW9uLGxpbmVhclJlZ3Jlc3Npb25MaW5lKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHNsb3BlID0gbGluZWFyUmVncmVzc2lvbi5tO1xyXG4gICAgICAgIHZhciBuID0gcG9pbnRzLmxlbmd0aDtcclxuICAgICAgICB2YXIgZGVncmVlc09mRnJlZWRvbSA9IE1hdGgubWF4KDAsIG4tMik7XHJcblxyXG4gICAgICAgIHZhciBhbHBoYSA9IDEgLSBzZWxmLmNvbmZpZy5jb25maWRlbmNlLmxldmVsO1xyXG4gICAgICAgIHZhciBjcml0aWNhbFByb2JhYmlsaXR5ICA9IDEgLSBhbHBoYS8yO1xyXG4gICAgICAgIHZhciBjcml0aWNhbFZhbHVlID0gc2VsZi5jb25maWcuY29uZmlkZW5jZS5jcml0aWNhbFZhbHVlKGRlZ3JlZXNPZkZyZWVkb20sY3JpdGljYWxQcm9iYWJpbGl0eSk7XHJcblxyXG4gICAgICAgIHZhciB4VmFsdWVzID0gcG9pbnRzLm1hcChkPT5kWzBdKTtcclxuICAgICAgICB2YXIgbWVhblggPSBTdGF0aXN0aWNzVXRpbHMubWVhbih4VmFsdWVzKTtcclxuICAgICAgICB2YXIgeE15U3VtPTA7XHJcbiAgICAgICAgdmFyIHhTdW09MDtcclxuICAgICAgICB2YXIgeFBvd1N1bT0wO1xyXG4gICAgICAgIHZhciB5U3VtPTA7XHJcbiAgICAgICAgdmFyIHlQb3dTdW09MDtcclxuICAgICAgICBwb2ludHMuZm9yRWFjaChwPT57XHJcbiAgICAgICAgICAgIHZhciB4ID0gcFswXTtcclxuICAgICAgICAgICAgdmFyIHkgPSBwWzFdO1xyXG5cclxuICAgICAgICAgICAgeE15U3VtICs9IHgqeTtcclxuICAgICAgICAgICAgeFN1bSs9eDtcclxuICAgICAgICAgICAgeVN1bSs9eTtcclxuICAgICAgICAgICAgeFBvd1N1bSs9IHgqeDtcclxuICAgICAgICAgICAgeVBvd1N1bSs9IHkqeTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgYSA9IGxpbmVhclJlZ3Jlc3Npb24ubTtcclxuICAgICAgICB2YXIgYiA9IGxpbmVhclJlZ3Jlc3Npb24uYjtcclxuXHJcbiAgICAgICAgdmFyIFNhMiA9IG4vKG4rMikgKiAoKHlQb3dTdW0tYSp4TXlTdW0tYip5U3VtKS8obip4UG93U3VtLSh4U3VtKnhTdW0pKSk7IC8vV2FyaWFuY2phIHdzcMOzxYJjenlubmlrYSBraWVydW5rb3dlZ28gcmVncmVzamkgbGluaW93ZWogYVxyXG4gICAgICAgIHZhciBTeTIgPSAoeVBvd1N1bSAtIGEqeE15U3VtLWIqeVN1bSkvKG4qKG4tMikpOyAvL1NhMiAvL01lYW4geSB2YWx1ZSB2YXJpYW5jZVxyXG5cclxuICAgICAgICB2YXIgZXJyb3JGbiA9IHg9PiBNYXRoLnNxcnQoU3kyICsgTWF0aC5wb3coeC1tZWFuWCwyKSpTYTIpOyAvL3BpZXJ3aWFzdGVrIGt3YWRyYXRvd3kgeiB3YXJpYW5jamkgZG93b2xuZWdvIHB1bmt0dSBwcm9zdGVqXHJcbiAgICAgICAgdmFyIG1hcmdpbk9mRXJyb3IgPSAgeD0+IGNyaXRpY2FsVmFsdWUqIGVycm9yRm4oeCk7XHJcblxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbicsIG4sICdkZWdyZWVzT2ZGcmVlZG9tJywgZGVncmVlc09mRnJlZWRvbSwgJ2NyaXRpY2FsUHJvYmFiaWxpdHknLGNyaXRpY2FsUHJvYmFiaWxpdHkpO1xyXG4gICAgICAgIC8vIHZhciBjb25maWRlbmNlRG93biA9IHggPT4gbGluZWFyUmVncmVzc2lvbkxpbmUoeCkgLSAgbWFyZ2luT2ZFcnJvcih4KTtcclxuICAgICAgICAvLyB2YXIgY29uZmlkZW5jZVVwID0geCA9PiBsaW5lYXJSZWdyZXNzaW9uTGluZSh4KSArICBtYXJnaW5PZkVycm9yKHgpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGNvbXB1dGVDb25maWRlbmNlQXJlYVBvaW50ID0geD0+e1xyXG4gICAgICAgICAgICB2YXIgbGluZWFyUmVncmVzc2lvbiA9IGxpbmVhclJlZ3Jlc3Npb25MaW5lKHgpO1xyXG4gICAgICAgICAgICB2YXIgbW9lID0gbWFyZ2luT2ZFcnJvcih4KTtcclxuICAgICAgICAgICAgdmFyIGNvbmZEb3duID0gbGluZWFyUmVncmVzc2lvbiAtIG1vZTtcclxuICAgICAgICAgICAgdmFyIGNvbmZVcCA9IGxpbmVhclJlZ3Jlc3Npb24gKyBtb2U7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB4OiB4LFxyXG4gICAgICAgICAgICAgICAgeTA6IGNvbmZEb3duLFxyXG4gICAgICAgICAgICAgICAgeTE6IGNvbmZVcFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBjZW50ZXJYID0gKGV4dGVudFhbMV0rZXh0ZW50WFswXSkvMjtcclxuXHJcbiAgICAgICAgLy8gdmFyIGNvbmZpZGVuY2VBcmVhUG9pbnRzID0gW2V4dGVudFhbMF0sIGNlbnRlclgsICBleHRlbnRYWzFdXS5tYXAoY29tcHV0ZUNvbmZpZGVuY2VBcmVhUG9pbnQpO1xyXG4gICAgICAgIHZhciBjb25maWRlbmNlQXJlYVBvaW50cyA9IFtleHRlbnRYWzBdLCBjZW50ZXJYLCAgZXh0ZW50WFsxXV0ubWFwKGNvbXB1dGVDb25maWRlbmNlQXJlYVBvaW50KTtcclxuXHJcbiAgICAgICAgdmFyIGZpdEluUGxvdCA9IHkgPT4geTtcclxuXHJcbiAgICAgICAgdmFyIGNvbmZpZGVuY2VBcmVhID0gIGQzLnN2Zy5hcmVhKClcclxuICAgICAgICAuaW50ZXJwb2xhdGUoXCJtb25vdG9uZVwiKVxyXG4gICAgICAgICAgICAueChkID0+IHNlbGYucGxvdC54LnNjYWxlKGQueCkpXHJcbiAgICAgICAgICAgIC55MChkID0+IGZpdEluUGxvdChzZWxmLnBsb3QueS5zY2FsZShkLnkwKSkpXHJcbiAgICAgICAgICAgIC55MShkID0+IGZpdEluUGxvdChzZWxmLnBsb3QueS5zY2FsZShkLnkxKSkpO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBhcmVhOmNvbmZpZGVuY2VBcmVhLFxyXG4gICAgICAgICAgICBwb2ludHM6Y29uZmlkZW5jZUFyZWFQb2ludHNcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShuZXdEYXRhKXtcclxuICAgICAgICBzdXBlci51cGRhdGUobmV3RGF0YSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSZWdyZXNzaW9uTGluZXMoKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHVwZGF0ZVJlZ3Jlc3Npb25MaW5lcygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb25Db250YWluZXJDbGFzcyA9IHRoaXMucHJlZml4Q2xhc3MoXCJyZWdyZXNzaW9uLWNvbnRhaW5lclwiKTtcclxuICAgICAgICB2YXIgcmVncmVzc2lvbkNvbnRhaW5lclNlbGVjdG9yID0gXCJnLlwiK3JlZ3Jlc3Npb25Db250YWluZXJDbGFzcztcclxuXHJcbiAgICAgICAgdmFyIGNsaXBQYXRoSWQgPSBzZWxmLnByZWZpeENsYXNzKFwiY2xpcFwiKTtcclxuXHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb25Db250YWluZXIgPSBzZWxmLnN2Z0cuc2VsZWN0T3JJbnNlcnQocmVncmVzc2lvbkNvbnRhaW5lclNlbGVjdG9yLCBcIi5cIitzZWxmLmRvdHNDb250YWluZXJDbGFzcyk7XHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb25Db250YWluZXJDbGlwID0gcmVncmVzc2lvbkNvbnRhaW5lci5zZWxlY3RPckFwcGVuZChcImNsaXBQYXRoXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgY2xpcFBhdGhJZCk7XHJcblxyXG5cclxuICAgICAgICByZWdyZXNzaW9uQ29udGFpbmVyQ2xpcC5zZWxlY3RPckFwcGVuZCgncmVjdCcpXHJcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHNlbGYucGxvdC53aWR0aClcclxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHNlbGYucGxvdC5oZWlnaHQpXHJcbiAgICAgICAgICAgIC5hdHRyKCd4JywgMClcclxuICAgICAgICAgICAgLmF0dHIoJ3knLCAwKTtcclxuXHJcbiAgICAgICAgcmVncmVzc2lvbkNvbnRhaW5lci5hdHRyKFwiY2xpcC1wYXRoXCIsIChkLGkpID0+IFwidXJsKCNcIitjbGlwUGF0aElkK1wiKVwiKTtcclxuXHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb25DbGFzcyA9IHRoaXMucHJlZml4Q2xhc3MoXCJyZWdyZXNzaW9uXCIpO1xyXG4gICAgICAgIHZhciBjb25maWRlbmNlQXJlYUNsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImNvbmZpZGVuY2VcIik7XHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb25TZWxlY3RvciA9IFwiZy5cIityZWdyZXNzaW9uQ2xhc3M7XHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb24gPSByZWdyZXNzaW9uQ29udGFpbmVyLnNlbGVjdEFsbChyZWdyZXNzaW9uU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5kYXRhKHNlbGYucGxvdC5yZWdyZXNzaW9ucywgKGQsaSk9PiBkLmdyb3VwKTtcclxuXHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb25FbnRlckcgPSByZWdyZXNzaW9uLmVudGVyKCkuaW5zZXJ0U2VsZWN0b3IocmVncmVzc2lvblNlbGVjdG9yKTtcclxuICAgICAgICB2YXIgbGluZUNsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImxpbmVcIik7XHJcbiAgICAgICAgcmVncmVzc2lvbkVudGVyR1xyXG5cclxuICAgICAgICAgICAgLmFwcGVuZChcInBhdGhcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBsaW5lQ2xhc3MpXHJcbiAgICAgICAgICAgIC5hdHRyKFwic2hhcGUtcmVuZGVyaW5nXCIsIFwib3B0aW1pemVRdWFsaXR5XCIpO1xyXG4gICAgICAgICAgICAvLyAuYXBwZW5kKFwibGluZVwiKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcImNsYXNzXCIsIFwibGluZVwiKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcInNoYXBlLXJlbmRlcmluZ1wiLCBcIm9wdGltaXplUXVhbGl0eVwiKTtcclxuXHJcbiAgICAgICAgdmFyIGxpbmUgPSByZWdyZXNzaW9uLnNlbGVjdChcInBhdGguXCIrbGluZUNsYXNzKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgciA9PiByLmNvbG9yKTtcclxuICAgICAgICAvLyAuYXR0cihcIngxXCIsIHI9PiBzZWxmLnBsb3QueC5zY2FsZShyLmxpbmVQb2ludHNbMF0ueCkpXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwieTFcIiwgcj0+IHNlbGYucGxvdC55LnNjYWxlKHIubGluZVBvaW50c1swXS55KSlcclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJ4MlwiLCByPT4gc2VsZi5wbG90Lnguc2NhbGUoci5saW5lUG9pbnRzWzFdLngpKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcInkyXCIsIHI9PiBzZWxmLnBsb3QueS5zY2FsZShyLmxpbmVQb2ludHNbMV0ueSkpXHJcblxyXG5cclxuICAgICAgICB2YXIgbGluZVQgPSBsaW5lO1xyXG4gICAgICAgIGlmIChzZWxmLnRyYW5zaXRpb25FbmFibGVkKCkpIHtcclxuICAgICAgICAgICAgbGluZVQgPSBsaW5lLnRyYW5zaXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxpbmVULmF0dHIoXCJkXCIsIHIgPT4gci5saW5lKHIubGluZVBvaW50cykpXHJcblxyXG5cclxuICAgICAgICByZWdyZXNzaW9uRW50ZXJHXHJcbiAgICAgICAgICAgIC5hcHBlbmQoXCJwYXRoXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgY29uZmlkZW5jZUFyZWFDbGFzcylcclxuICAgICAgICAgICAgLmF0dHIoXCJzaGFwZS1yZW5kZXJpbmdcIiwgXCJvcHRpbWl6ZVF1YWxpdHlcIilcclxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCBcIjAuNFwiKTtcclxuXHJcblxyXG5cclxuICAgICAgICB2YXIgYXJlYSA9IHJlZ3Jlc3Npb24uc2VsZWN0KFwicGF0aC5cIitjb25maWRlbmNlQXJlYUNsYXNzKTtcclxuXHJcbiAgICAgICAgdmFyIGFyZWFUID0gYXJlYTtcclxuICAgICAgICBpZiAoc2VsZi50cmFuc2l0aW9uRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgICAgIGFyZWFUID0gYXJlYS50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFyZWFULmF0dHIoXCJkXCIsIHIgPT4gci5jb25maWRlbmNlLmFyZWEoci5jb25maWRlbmNlLnBvaW50cykpO1xyXG4gICAgICAgIGFyZWFULnN0eWxlKFwiZmlsbFwiLCByID0+IHIuY29sb3IpXHJcbiAgICAgICAgcmVncmVzc2lvbi5leGl0KCkucmVtb3ZlKCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG59XHJcblxyXG4iLCJpbXBvcnQge0NoYXJ0LCBDaGFydENvbmZpZ30gZnJvbSBcIi4vY2hhcnRcIjtcclxuaW1wb3J0IHtTY2F0dGVyUGxvdENvbmZpZ30gZnJvbSBcIi4vc2NhdHRlcnBsb3RcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IHtMZWdlbmR9IGZyb20gXCIuL2xlZ2VuZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNjYXR0ZXJQbG90TWF0cml4Q29uZmlnIGV4dGVuZHMgU2NhdHRlclBsb3RDb25maWd7XHJcblxyXG4gICAgc3ZnQ2xhc3M9IHRoaXMuY3NzQ2xhc3NQcmVmaXgrJ3NjYXR0ZXJwbG90LW1hdHJpeCc7XHJcbiAgICBzaXplPSAyMDA7IC8vc2NhdHRlciBwbG90IGNlbGwgc2l6ZVxyXG4gICAgcGFkZGluZz0gMjA7IC8vc2NhdHRlciBwbG90IGNlbGwgcGFkZGluZ1xyXG4gICAgYnJ1c2g9IHRydWU7XHJcbiAgICBndWlkZXM9IHRydWU7IC8vc2hvdyBheGlzIGd1aWRlc1xyXG4gICAgc2hvd1Rvb2x0aXA9IHRydWU7IC8vc2hvdyB0b29sdGlwIG9uIGRvdCBob3ZlclxyXG4gICAgdGlja3M9IHVuZGVmaW5lZDsgLy90aWNrcyBudW1iZXIsIChkZWZhdWx0OiBjb21wdXRlZCB1c2luZyBjZWxsIHNpemUpXHJcbiAgICB4PXsvLyBYIGF4aXMgY29uZmlnXHJcbiAgICAgICAgb3JpZW50OiBcImJvdHRvbVwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiXHJcbiAgICB9O1xyXG4gICAgeT17Ly8gWSBheGlzIGNvbmZpZ1xyXG4gICAgICAgIG9yaWVudDogXCJsZWZ0XCIsXHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCJcclxuICAgIH07XHJcbiAgICBncm91cHM9e1xyXG4gICAgICAgIGtleTogdW5kZWZpbmVkLCAvL29iamVjdCBwcm9wZXJ0eSBuYW1lIG9yIGFycmF5IGluZGV4IHdpdGggZ3JvdXBpbmcgdmFyaWFibGVcclxuICAgICAgICBpbmNsdWRlSW5QbG90OiBmYWxzZSwgLy9pbmNsdWRlIGdyb3VwIGFzIHZhcmlhYmxlIGluIHBsb3QsIGJvb2xlYW4gKGRlZmF1bHQ6IGZhbHNlKVxyXG4gICAgICAgIHZhbHVlOiAoZCwga2V5KSA9PiBkW2tleV0sIC8vIGdyb3VwaW5nIHZhbHVlIGFjY2Vzc29yLFxyXG4gICAgICAgIGxhYmVsOiBcIlwiXHJcbiAgICB9O1xyXG4gICAgdmFyaWFibGVzPSB7XHJcbiAgICAgICAgbGFiZWxzOiBbXSwgLy9vcHRpb25hbCBhcnJheSBvZiB2YXJpYWJsZSBsYWJlbHMgKGZvciB0aGUgZGlhZ29uYWwgb2YgdGhlIHBsb3QpLlxyXG4gICAgICAgIGtleXM6IFtdLCAvL29wdGlvbmFsIGFycmF5IG9mIHZhcmlhYmxlIGtleXNcclxuICAgICAgICB2YWx1ZTogKGQsIHZhcmlhYmxlS2V5KSA9PiBkW3ZhcmlhYmxlS2V5XSAvLyB2YXJpYWJsZSB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTY2F0dGVyUGxvdE1hdHJpeCBleHRlbmRzIENoYXJ0IHtcclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIG5ldyBTY2F0dGVyUGxvdE1hdHJpeENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgU2NhdHRlclBsb3RNYXRyaXhDb25maWcoY29uZmlnKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgbWFyZ2luID0gdGhpcy5wbG90Lm1hcmdpbjtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG4gICAgICAgIHRoaXMucGxvdC54PXt9O1xyXG4gICAgICAgIHRoaXMucGxvdC55PXt9O1xyXG4gICAgICAgIHRoaXMucGxvdC5kb3Q9e1xyXG4gICAgICAgICAgICBjb2xvcjogbnVsbC8vY29sb3Igc2NhbGUgbWFwcGluZyBmdW5jdGlvblxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICB0aGlzLnBsb3Quc2hvd0xlZ2VuZCA9IGNvbmYuc2hvd0xlZ2VuZDtcclxuICAgICAgICBpZih0aGlzLnBsb3Quc2hvd0xlZ2VuZCl7XHJcbiAgICAgICAgICAgIG1hcmdpbi5yaWdodCA9IGNvbmYubWFyZ2luLnJpZ2h0ICsgY29uZi5sZWdlbmQud2lkdGgrY29uZi5sZWdlbmQubWFyZ2luKjI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldHVwR3JvdXBzKCk7XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC5kYXRhID0gdGhpcy5nZXREYXRhVG9QbG90KCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFZhcmlhYmxlcygpO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3Quc2l6ZSA9IGNvbmYuc2l6ZTtcclxuXHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IGNvbmYud2lkdGg7XHJcbiAgICAgICAgdmFyIGJvdW5kaW5nQ2xpZW50UmVjdCA9IHRoaXMuZ2V0QmFzZUNvbnRhaW5lck5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBpZiAoIXdpZHRoKSB7XHJcbiAgICAgICAgICAgIHZhciBtYXhXaWR0aCA9IG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0ICsgdGhpcy5wbG90LnZhcmlhYmxlcy5sZW5ndGgqdGhpcy5wbG90LnNpemU7XHJcbiAgICAgICAgICAgIHdpZHRoID0gTWF0aC5taW4oYm91bmRpbmdDbGllbnRSZWN0LndpZHRoLCBtYXhXaWR0aCk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaGVpZ2h0ID0gd2lkdGg7XHJcbiAgICAgICAgaWYgKCFoZWlnaHQpIHtcclxuICAgICAgICAgICAgaGVpZ2h0ID0gYm91bmRpbmdDbGllbnRSZWN0LmhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC53aWR0aCA9IHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XHJcbiAgICAgICAgdGhpcy5wbG90LmhlaWdodCA9IGhlaWdodCAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tO1xyXG5cclxuXHJcblxyXG5cclxuICAgICAgICBpZihjb25mLnRpY2tzPT09dW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgY29uZi50aWNrcyA9IHRoaXMucGxvdC5zaXplIC8gNDA7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBYKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFkoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cEdyb3VwcygpIHtcclxuICAgICAgICB2YXIgc2VsZj10aGlzO1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcbiAgICAgICAgdGhpcy5wbG90Lmdyb3VwVmFsdWUgPSBkID0+IGNvbmYuZ3JvdXBzLnZhbHVlKGQsIGNvbmYuZ3JvdXBzLmtleSk7XHJcbiAgICAgICAgaWYoY29uZi5kb3QuZDNDb2xvckNhdGVnb3J5KXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmRvdC5jb2xvckNhdGVnb3J5ID0gZDMuc2NhbGVbY29uZi5kb3QuZDNDb2xvckNhdGVnb3J5XSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY29sb3JWYWx1ZSA9IGNvbmYuZG90LmNvbG9yO1xyXG4gICAgICAgIGlmKGNvbG9yVmFsdWUpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yVmFsdWUgPSBjb2xvclZhbHVlO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb2xvclZhbHVlID09PSAnc3RyaW5nJyB8fCBjb2xvclZhbHVlIGluc3RhbmNlb2YgU3RyaW5nKXtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5kb3QuY29sb3IgPSBjb2xvclZhbHVlO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZih0aGlzLnBsb3QuZG90LmNvbG9yQ2F0ZWdvcnkpe1xyXG4gICAgICAgICAgICAgICAgdmFyIGRvbWFpbiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGQzLm1hcCh0aGlzLmRhdGEsIGQgPT4gc2VsZi5wbG90LmRvdC5jb2xvclZhbHVlLmNhbGwoc2VsZixkKSlbJ18nXSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QuZG90LmNvbG9yQ2F0ZWdvcnkuZG9tYWluKGRvbWFpbik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yID0gZCA9PiAgc2VsZi5wbG90LmRvdC5jb2xvckNhdGVnb3J5KHNlbGYucGxvdC5kb3QuY29sb3JWYWx1ZS5jYWxsKHNlbGYsZCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldERhdGFUb1Bsb3QoKXtcclxuICAgICAgICBpZighdGhpcy5lbmFibGVkR3JvdXBzKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBmaWx0ZXIgPSB0aGlzLmRhdGEuZmlsdGVyKGQgPT4gdGhpcy5lbmFibGVkR3JvdXBzLmluZGV4T2YodGhpcy5wbG90Lmdyb3VwVmFsdWUoZCkpPi0xKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhmaWx0ZXIubGVuZ3RoKTtcclxuICAgICAgICByZXR1cm4gZmlsdGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwVmFyaWFibGVzKCkge1xyXG4gICAgICAgIHZhciB2YXJpYWJsZXNDb25mID0gdGhpcy5jb25maWcudmFyaWFibGVzO1xyXG5cclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICBwbG90LmRvbWFpbkJ5VmFyaWFibGUgPSB7fTtcclxuICAgICAgICBwbG90LnZhcmlhYmxlcyA9IHZhcmlhYmxlc0NvbmYua2V5cztcclxuICAgICAgICBpZighcGxvdC52YXJpYWJsZXMgfHwgIXBsb3QudmFyaWFibGVzLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIHBsb3QudmFyaWFibGVzID0gVXRpbHMuaW5mZXJWYXJpYWJsZXMoZGF0YSwgdGhpcy5jb25maWcuZ3JvdXBzLmtleSwgdGhpcy5jb25maWcuaW5jbHVkZUluUGxvdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwbG90LmxhYmVscyA9IFtdO1xyXG4gICAgICAgIHBsb3QubGFiZWxCeVZhcmlhYmxlID0ge307XHJcbiAgICAgICAgcGxvdC52YXJpYWJsZXMuZm9yRWFjaCgodmFyaWFibGVLZXksIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHBsb3QuZG9tYWluQnlWYXJpYWJsZVt2YXJpYWJsZUtleV0gPSBkMy5leHRlbnQoZGF0YSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gdmFyaWFibGVzQ29uZi52YWx1ZShkLCB2YXJpYWJsZUtleSkgfSk7XHJcbiAgICAgICAgICAgIHZhciBsYWJlbCA9IHZhcmlhYmxlS2V5O1xyXG4gICAgICAgICAgICBpZih2YXJpYWJsZXNDb25mLmxhYmVscyAmJiB2YXJpYWJsZXNDb25mLmxhYmVscy5sZW5ndGg+aW5kZXgpe1xyXG5cclxuICAgICAgICAgICAgICAgIGxhYmVsID0gdmFyaWFibGVzQ29uZi5sYWJlbHNbaW5kZXhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBsb3QubGFiZWxzLnB1c2gobGFiZWwpO1xyXG4gICAgICAgICAgICBwbG90LmxhYmVsQnlWYXJpYWJsZVt2YXJpYWJsZUtleV0gPSBsYWJlbDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2cocGxvdC5sYWJlbEJ5VmFyaWFibGUpO1xyXG5cclxuICAgICAgICBwbG90LnN1YnBsb3RzID0gW107XHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwWCgpIHtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHggPSBwbG90Lng7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgeC52YWx1ZSA9IGNvbmYudmFyaWFibGVzLnZhbHVlO1xyXG4gICAgICAgIHguc2NhbGUgPSBkMy5zY2FsZVtjb25mLnguc2NhbGVdKCkucmFuZ2UoW2NvbmYucGFkZGluZyAvIDIsIHBsb3Quc2l6ZSAtIGNvbmYucGFkZGluZyAvIDJdKTtcclxuICAgICAgICB4Lm1hcCA9IChkLCB2YXJpYWJsZSkgPT4geC5zY2FsZSh4LnZhbHVlKGQsIHZhcmlhYmxlKSk7XHJcbiAgICAgICAgeC5heGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh4LnNjYWxlKS5vcmllbnQoY29uZi54Lm9yaWVudCkudGlja3MoY29uZi50aWNrcyk7XHJcbiAgICAgICAgeC5heGlzLnRpY2tTaXplKHBsb3Quc2l6ZSAqIHBsb3QudmFyaWFibGVzLmxlbmd0aCk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cFkoKSB7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB5ID0gcGxvdC55O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcblxyXG4gICAgICAgIHkudmFsdWUgPSBjb25mLnZhcmlhYmxlcy52YWx1ZTtcclxuICAgICAgICB5LnNjYWxlID0gZDMuc2NhbGVbY29uZi55LnNjYWxlXSgpLnJhbmdlKFsgcGxvdC5zaXplIC0gY29uZi5wYWRkaW5nIC8gMiwgY29uZi5wYWRkaW5nIC8gMl0pO1xyXG4gICAgICAgIHkubWFwID0gKGQsIHZhcmlhYmxlKSA9PiB5LnNjYWxlKHkudmFsdWUoZCwgdmFyaWFibGUpKTtcclxuICAgICAgICB5LmF4aXM9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeS5zY2FsZSkub3JpZW50KGNvbmYueS5vcmllbnQpLnRpY2tzKGNvbmYudGlja3MpO1xyXG4gICAgICAgIHkuYXhpcy50aWNrU2l6ZSgtcGxvdC5zaXplICogcGxvdC52YXJpYWJsZXMubGVuZ3RoKTtcclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlKCBuZXdEYXRhKSB7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKG5ld0RhdGEpO1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9dGhpcztcclxuICAgICAgICB2YXIgbiA9IHNlbGYucGxvdC52YXJpYWJsZXMubGVuZ3RoO1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcblxyXG4gICAgICAgIHZhciBheGlzQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwiYXhpc1wiKTtcclxuICAgICAgICB2YXIgYXhpc1hDbGFzcyA9IGF4aXNDbGFzcytcIi14XCI7XHJcbiAgICAgICAgdmFyIGF4aXNZQ2xhc3MgPSBheGlzQ2xhc3MrXCIteVwiO1xyXG5cclxuICAgICAgICB2YXIgeEF4aXNTZWxlY3RvciA9IFwiZy5cIitheGlzWENsYXNzK1wiLlwiK2F4aXNDbGFzcztcclxuICAgICAgICB2YXIgeUF4aXNTZWxlY3RvciA9IFwiZy5cIitheGlzWUNsYXNzK1wiLlwiK2F4aXNDbGFzcztcclxuXHJcbiAgICAgICAgdmFyIG5vR3VpZGVzQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwibm8tZ3VpZGVzXCIpO1xyXG4gICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoeEF4aXNTZWxlY3RvcilcclxuICAgICAgICAgICAgLmRhdGEoc2VsZi5wbG90LnZhcmlhYmxlcylcclxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kU2VsZWN0b3IoeEF4aXNTZWxlY3RvcilcclxuICAgICAgICAgICAgLmNsYXNzZWQobm9HdWlkZXNDbGFzcywgIWNvbmYuZ3VpZGVzKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCAoZCwgaSkgPT4gXCJ0cmFuc2xhdGUoXCIgKyAobiAtIGkgLSAxKSAqIHNlbGYucGxvdC5zaXplICsgXCIsMClcIilcclxuICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24oZCkgeyBzZWxmLnBsb3QueC5zY2FsZS5kb21haW4oc2VsZi5wbG90LmRvbWFpbkJ5VmFyaWFibGVbZF0pOyBkMy5zZWxlY3QodGhpcykuY2FsbChzZWxmLnBsb3QueC5heGlzKTsgfSk7XHJcblxyXG4gICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoeUF4aXNTZWxlY3RvcilcclxuICAgICAgICAgICAgLmRhdGEoc2VsZi5wbG90LnZhcmlhYmxlcylcclxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kU2VsZWN0b3IoeUF4aXNTZWxlY3RvcilcclxuICAgICAgICAgICAgLmNsYXNzZWQobm9HdWlkZXNDbGFzcywgIWNvbmYuZ3VpZGVzKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCAoZCwgaSkgPT4gXCJ0cmFuc2xhdGUoMCxcIiArIGkgKiBzZWxmLnBsb3Quc2l6ZSArIFwiKVwiKVxyXG4gICAgICAgICAgICAuZWFjaChmdW5jdGlvbihkKSB7IHNlbGYucGxvdC55LnNjYWxlLmRvbWFpbihzZWxmLnBsb3QuZG9tYWluQnlWYXJpYWJsZVtkXSk7IGQzLnNlbGVjdCh0aGlzKS5jYWxsKHNlbGYucGxvdC55LmF4aXMpOyB9KTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxDbGFzcyA9ICBzZWxmLnByZWZpeENsYXNzKFwiY2VsbFwiKTtcclxuICAgICAgICB2YXIgY2VsbCA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCIuXCIrY2VsbENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShzZWxmLnV0aWxzLmNyb3NzKHNlbGYucGxvdC52YXJpYWJsZXMsIHNlbGYucGxvdC52YXJpYWJsZXMpKTtcclxuXHJcbiAgICAgICAgY2VsbC5lbnRlcigpLmFwcGVuZFNlbGVjdG9yKFwiZy5cIitjZWxsQ2xhc3MpLmZpbHRlcihkID0+IGQuaSA9PT0gZC5qKVxyXG4gICAgICAgICAgICAuYXBwZW5kKFwidGV4dFwiKTtcclxuXHJcbiAgICAgICAgY2VsbC5hdHRyKFwidHJhbnNmb3JtXCIsIGQgPT4gXCJ0cmFuc2xhdGUoXCIgKyAobiAtIGQuaSAtIDEpICogc2VsZi5wbG90LnNpemUgKyBcIixcIiArIGQuaiAqIHNlbGYucGxvdC5zaXplICsgXCIpXCIpO1xyXG5cclxuICAgICAgICBpZihjb25mLmJydXNoKXtcclxuICAgICAgICAgICAgdGhpcy5kcmF3QnJ1c2goY2VsbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjZWxsLmVhY2gocGxvdFN1YnBsb3QpO1xyXG5cclxuICAgICAgICAvL0xhYmVsc1xyXG4gICAgICAgIGNlbGwuc2VsZWN0KFwidGV4dFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgY29uZi5wYWRkaW5nKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgY29uZi5wYWRkaW5nKVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiLjcxZW1cIilcclxuICAgICAgICAgICAgLnRleHQoIGQgPT4gc2VsZi5wbG90LmxhYmVsQnlWYXJpYWJsZVtkLnhdKTtcclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcGxvdFN1YnBsb3QocCkge1xyXG4gICAgICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICAgICAgcGxvdC5zdWJwbG90cy5wdXNoKHApO1xyXG4gICAgICAgICAgICB2YXIgY2VsbCA9IGQzLnNlbGVjdCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIHBsb3QueC5zY2FsZS5kb21haW4ocGxvdC5kb21haW5CeVZhcmlhYmxlW3AueF0pO1xyXG4gICAgICAgICAgICBwbG90Lnkuc2NhbGUuZG9tYWluKHBsb3QuZG9tYWluQnlWYXJpYWJsZVtwLnldKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmcmFtZUNsYXNzID0gIHNlbGYucHJlZml4Q2xhc3MoXCJmcmFtZVwiKTtcclxuICAgICAgICAgICAgY2VsbC5zZWxlY3RPckFwcGVuZChcInJlY3QuXCIrZnJhbWVDbGFzcylcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgZnJhbWVDbGFzcylcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieFwiLCBjb25mLnBhZGRpbmcgLyAyKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIGNvbmYucGFkZGluZyAvIDIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGNvbmYuc2l6ZSAtIGNvbmYucGFkZGluZylcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGNvbmYuc2l6ZSAtIGNvbmYucGFkZGluZyk7XHJcblxyXG5cclxuICAgICAgICAgICAgcC51cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc3VicGxvdCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZG90cyA9IGNlbGwuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmRhdGEoc2VsZi5wbG90LmRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgIGRvdHMuZW50ZXIoKS5hcHBlbmQoXCJjaXJjbGVcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGRvdHNUID0gZG90cztcclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLnRyYW5zaXRpb25FbmFibGVkKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb3RzVCA9IGRvdHMudHJhbnNpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGRvdHNULmF0dHIoXCJjeFwiLCAoZCkgPT4gcGxvdC54Lm1hcChkLCBzdWJwbG90LngpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiY3lcIiwgKGQpID0+IHBsb3QueS5tYXAoZCwgc3VicGxvdC55KSlcclxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcInJcIiwgc2VsZi5jb25maWcuZG90LnJhZGl1cyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHBsb3QuZG90LmNvbG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG90c1Quc3R5bGUoXCJmaWxsXCIsIHBsb3QuZG90LmNvbG9yKVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmKHBsb3QudG9vbHRpcCl7XHJcbiAgICAgICAgICAgICAgICAgICAgZG90cy5vbihcIm1vdXNlb3ZlclwiLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAuOSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodG1sID0gXCIoXCIgKyBwbG90LngudmFsdWUoZCwgc3VicGxvdC54KSArIFwiLCBcIiArcGxvdC55LnZhbHVlKGQsIHN1YnBsb3QueSkgKyBcIilcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLmh0bWwoaHRtbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBncm91cCA9IHNlbGYuY29uZmlnLmdyb3VwcyA/IHNlbGYuY29uZmlnLmdyb3Vwcy52YWx1ZShkKSA6IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihncm91cCB8fCBncm91cD09PTAgKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwrPVwiPGJyLz5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYWJlbCA9IHNlbGYuY29uZmlnLmdyb3Vwcy5sYWJlbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGxhYmVsKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sKz1sYWJlbCtcIjogXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sKz1ncm91cFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC5odG1sKGh0bWwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkMy5ldmVudC5wYWdlWSAtIDI4KSArIFwicHhcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgKGQpPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZG90cy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHAudXBkYXRlKCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlTGVnZW5kKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRyYXdCcnVzaChjZWxsKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBicnVzaCA9IGQzLnN2Zy5icnVzaCgpXHJcbiAgICAgICAgICAgIC54KHNlbGYucGxvdC54LnNjYWxlKVxyXG4gICAgICAgICAgICAueShzZWxmLnBsb3QueS5zY2FsZSlcclxuICAgICAgICAgICAgLm9uKFwiYnJ1c2hzdGFydFwiLCBicnVzaHN0YXJ0KVxyXG4gICAgICAgICAgICAub24oXCJicnVzaFwiLCBicnVzaG1vdmUpXHJcbiAgICAgICAgICAgIC5vbihcImJydXNoZW5kXCIsIGJydXNoZW5kKTtcclxuXHJcbiAgICAgICAgY2VsbC5hcHBlbmQoXCJnXCIpLmNhbGwoYnJ1c2gpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGJydXNoQ2VsbDtcclxuXHJcbiAgICAgICAgLy8gQ2xlYXIgdGhlIHByZXZpb3VzbHktYWN0aXZlIGJydXNoLCBpZiBhbnkuXHJcbiAgICAgICAgZnVuY3Rpb24gYnJ1c2hzdGFydChwKSB7XHJcbiAgICAgICAgICAgIGlmIChicnVzaENlbGwgIT09IHRoaXMpIHtcclxuICAgICAgICAgICAgICAgIGQzLnNlbGVjdChicnVzaENlbGwpLmNhbGwoYnJ1c2guY2xlYXIoKSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QueC5zY2FsZS5kb21haW4oc2VsZi5wbG90LmRvbWFpbkJ5VmFyaWFibGVbcC54XSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QueS5zY2FsZS5kb21haW4oc2VsZi5wbG90LmRvbWFpbkJ5VmFyaWFibGVbcC55XSk7XHJcbiAgICAgICAgICAgICAgICBicnVzaENlbGwgPSB0aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBIaWdobGlnaHQgdGhlIHNlbGVjdGVkIGNpcmNsZXMuXHJcbiAgICAgICAgZnVuY3Rpb24gYnJ1c2htb3ZlKHApIHtcclxuICAgICAgICAgICAgdmFyIGUgPSBicnVzaC5leHRlbnQoKTtcclxuICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcImNpcmNsZVwiKS5jbGFzc2VkKFwiaGlkZGVuXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZVswXVswXSA+IGRbcC54XSB8fCBkW3AueF0gPiBlWzFdWzBdXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgZVswXVsxXSA+IGRbcC55XSB8fCBkW3AueV0gPiBlWzFdWzFdO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gSWYgdGhlIGJydXNoIGlzIGVtcHR5LCBzZWxlY3QgYWxsIGNpcmNsZXMuXHJcbiAgICAgICAgZnVuY3Rpb24gYnJ1c2hlbmQoKSB7XHJcbiAgICAgICAgICAgIGlmIChicnVzaC5lbXB0eSgpKSBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwiLmhpZGRlblwiKS5jbGFzc2VkKFwiaGlkZGVuXCIsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHVwZGF0ZUxlZ2VuZCgpIHtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPXRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcblxyXG4gICAgICAgIHZhciBzY2FsZSA9IHBsb3QuZG90LmNvbG9yQ2F0ZWdvcnk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgaWYoIXNjYWxlLmRvbWFpbigpIHx8IHNjYWxlLmRvbWFpbigpLmxlbmd0aDwyKXtcclxuICAgICAgICAgICAgcGxvdC5zaG93TGVnZW5kID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZighcGxvdC5zaG93TGVnZW5kKXtcclxuICAgICAgICAgICAgaWYocGxvdC5sZWdlbmQgJiYgcGxvdC5sZWdlbmQuY29udGFpbmVyKXtcclxuICAgICAgICAgICAgICAgIHBsb3QubGVnZW5kLmNvbnRhaW5lci5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdmFyIGxlZ2VuZFggPSB0aGlzLnBsb3Qud2lkdGggKyB0aGlzLmNvbmZpZy5sZWdlbmQubWFyZ2luO1xyXG4gICAgICAgIHZhciBsZWdlbmRZID0gdGhpcy5jb25maWcubGVnZW5kLm1hcmdpbjtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmQgPSBuZXcgTGVnZW5kKHRoaXMuc3ZnLCB0aGlzLnN2Z0csIHNjYWxlLCBsZWdlbmRYLCBsZWdlbmRZKTtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmRDb2xvciA9IHBsb3QubGVnZW5kLmNvbG9yKClcclxuICAgICAgICAgICAgLnNoYXBlV2lkdGgodGhpcy5jb25maWcubGVnZW5kLnNoYXBlV2lkdGgpXHJcbiAgICAgICAgICAgIC5vcmllbnQoJ3ZlcnRpY2FsJylcclxuICAgICAgICAgICAgLnNjYWxlKHNjYWxlKTtcclxuXHJcblxyXG4gICAgICAgIHBsb3QubGVnZW5kQ29sb3Iub24oJ2NlbGxjbGljaycsIGM9PiBzZWxmLm9uTGVnZW5kQ2VsbENsaWNrKGMpKTtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmQuY29udGFpbmVyXHJcbiAgICAgICAgICAgIC5jYWxsKHBsb3QubGVnZW5kQ29sb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTGVnZW5kQ2VsbENsaWNrKGNlbGxWYWx1ZSl7XHJcbiAgICAgICAgdGhpcy51cGRhdGVFbmFibGVkR3JvdXBzKGNlbGxWYWx1ZSk7XHJcblxyXG4gICAgICAgIHZhciBpc0Rpc2FibGVkID0gdGhpcy5lbmFibGVkR3JvdXBzLmluZGV4T2YoY2VsbFZhbHVlKTwwO1xyXG4gICAgICAgIHRoaXMucGxvdC5sZWdlbmQuY29udGFpbmVyLnNlbGVjdEFsbChcImcuY2VsbFwiKS5lYWNoKGZ1bmN0aW9uKGNlbGwpe1xyXG4gICAgICAgICAgICBpZihjZWxsID09IGNlbGxWYWx1ZSl7XHJcbiAgICAgICAgICAgICAgICBkMy5zZWxlY3QodGhpcykuY2xhc3NlZChcIm9kYy1kaXNhYmxlZFwiLCBpc0Rpc2FibGVkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlRW5hYmxlZEdyb3VwcyhjZWxsVmFsdWUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZEdyb3Vwcykge1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZWRHcm91cHMgPSB0aGlzLnBsb3QuZG90LmNvbG9yQ2F0ZWdvcnkuZG9tYWluKCkuc2xpY2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5lbmFibGVkR3JvdXBzLmluZGV4T2YoY2VsbFZhbHVlKTtcclxuXHJcbiAgICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZWRHcm91cHMucHVzaChjZWxsVmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZEdyb3Vwcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHNldERhdGEoZGF0YSl7XHJcbiAgICAgICAgc3VwZXIuc2V0RGF0YShkYXRhKTtcclxuICAgICAgICB0aGlzLmVuYWJsZWRHcm91cHMgPSBudWxsO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtDaGFydCwgQ2hhcnRDb25maWd9IGZyb20gXCIuL2NoYXJ0XCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7TGVnZW5kfSBmcm9tIFwiLi9sZWdlbmRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTY2F0dGVyUGxvdENvbmZpZyBleHRlbmRzIENoYXJ0Q29uZmlne1xyXG5cclxuICAgIHN2Z0NsYXNzPSB0aGlzLmNzc0NsYXNzUHJlZml4KydzY2F0dGVycGxvdCc7XHJcbiAgICBndWlkZXM9IGZhbHNlOyAvL3Nob3cgYXhpcyBndWlkZXNcclxuICAgIHNob3dUb29sdGlwPSB0cnVlOyAvL3Nob3cgdG9vbHRpcCBvbiBkb3QgaG92ZXJcclxuICAgIHNob3dMZWdlbmQ9dHJ1ZTtcclxuICAgIGxlZ2VuZD17XHJcbiAgICAgICAgd2lkdGg6IDgwLFxyXG4gICAgICAgIG1hcmdpbjogMTAsXHJcbiAgICAgICAgc2hhcGVXaWR0aDogMjBcclxuICAgIH07XHJcblxyXG4gICAgeD17Ly8gWCBheGlzIGNvbmZpZ1xyXG4gICAgICAgIGxhYmVsOiAnWCcsIC8vIGF4aXMgbGFiZWxcclxuICAgICAgICBrZXk6IDAsXHJcbiAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IGRba2V5XSwgLy8geCB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgIG9yaWVudDogXCJib3R0b21cIixcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIlxyXG4gICAgfTtcclxuICAgIHk9ey8vIFkgYXhpcyBjb25maWdcclxuICAgICAgICBsYWJlbDogJ1knLCAvLyBheGlzIGxhYmVsLFxyXG4gICAgICAgIGtleTogMSxcclxuICAgICAgICB2YWx1ZTogKGQsIGtleSkgPT4gZFtrZXldLCAvLyB5IHZhbHVlIGFjY2Vzc29yXHJcbiAgICAgICAgb3JpZW50OiBcImxlZnRcIixcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIlxyXG4gICAgfTtcclxuICAgIGdyb3Vwcz17XHJcbiAgICAgICAga2V5OiAyLFxyXG4gICAgICAgIHZhbHVlOiAoZCwga2V5KSA9PiBkW2tleV0gLCAvLyBncm91cGluZyB2YWx1ZSBhY2Nlc3NvcixcclxuICAgICAgICBsYWJlbDogXCJcIlxyXG4gICAgfTtcclxuICAgIGRvdCA9IHtcclxuICAgICAgICByYWRpdXM6IDIsXHJcbiAgICAgICAgY29sb3I6IGQgPT4gdGhpcy5ncm91cHMgPyB0aGlzLmdyb3Vwcy52YWx1ZShkLCB0aGlzLmdyb3Vwcy5rZXkpIDogJycsIC8vIHN0cmluZyBvciBmdW5jdGlvbiByZXR1cm5pbmcgY29sb3IncyB2YWx1ZSBmb3IgY29sb3Igc2NhbGVcclxuICAgICAgICBkM0NvbG9yQ2F0ZWdvcnk6ICdjYXRlZ29yeTEwJ1xyXG4gICAgfTtcclxuICAgIHRyYW5zaXRpb249IHRydWU7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKXtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIGlmKGN1c3RvbSl7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2NhdHRlclBsb3QgZXh0ZW5kcyBDaGFydHtcclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIG5ldyBTY2F0dGVyUGxvdENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKXtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBTY2F0dGVyUGxvdENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpe1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcbiAgICAgICAgdmFyIHNlbGY9dGhpcztcclxuXHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgdGhpcy5wbG90Lng9e307XHJcbiAgICAgICAgdGhpcy5wbG90Lnk9e307XHJcbiAgICAgICAgdGhpcy5wbG90LmRvdD17XHJcbiAgICAgICAgICAgIGNvbG9yOiBudWxsLy9jb2xvciBzY2FsZSBtYXBwaW5nIGZ1bmN0aW9uXHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMucGxvdC5zaG93TGVnZW5kID0gY29uZi5zaG93TGVnZW5kO1xyXG4gICAgICAgIGlmKHRoaXMucGxvdC5zaG93TGVnZW5kKXtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lm1hcmdpbi5yaWdodCA9IGNvbmYubWFyZ2luLnJpZ2h0ICsgY29uZi5sZWdlbmQud2lkdGgrY29uZi5sZWdlbmQubWFyZ2luKjI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICB0aGlzLmNvbXB1dGVQbG90U2l6ZSgpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cEdyb3VwcygpO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QuZGF0YSA9IHRoaXMuZ2V0RGF0YVRvUGxvdCgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBYKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFkoKTtcclxuXHJcblxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cEdyb3VwcygpIHtcclxuICAgICAgICB2YXIgc2VsZj10aGlzO1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcbiAgICAgICAgdGhpcy5wbG90Lmdyb3VwVmFsdWUgPSBkID0+IGNvbmYuZ3JvdXBzLnZhbHVlKGQsIGNvbmYuZ3JvdXBzLmtleSk7XHJcbiAgICAgICAgaWYoY29uZi5kb3QuZDNDb2xvckNhdGVnb3J5KXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmRvdC5jb2xvckNhdGVnb3J5ID0gZDMuc2NhbGVbY29uZi5kb3QuZDNDb2xvckNhdGVnb3J5XSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY29sb3JWYWx1ZSA9IGNvbmYuZG90LmNvbG9yO1xyXG4gICAgICAgIGlmKGNvbG9yVmFsdWUpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yVmFsdWUgPSBjb2xvclZhbHVlO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb2xvclZhbHVlID09PSAnc3RyaW5nJyB8fCBjb2xvclZhbHVlIGluc3RhbmNlb2YgU3RyaW5nKXtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5kb3QuY29sb3IgPSBjb2xvclZhbHVlO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZih0aGlzLnBsb3QuZG90LmNvbG9yQ2F0ZWdvcnkpe1xyXG4gICAgICAgICAgICAgICAgdmFyIGRvbWFpbiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGQzLm1hcCh0aGlzLmRhdGEsIGQgPT4gc2VsZi5wbG90LmRvdC5jb2xvclZhbHVlLmNhbGwoc2VsZixkKSlbJ18nXSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QuZG90LmNvbG9yQ2F0ZWdvcnkuZG9tYWluKGRvbWFpbik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yID0gZCA9PiAgc2VsZi5wbG90LmRvdC5jb2xvckNhdGVnb3J5KHNlbGYucGxvdC5kb3QuY29sb3JWYWx1ZS5jYWxsKHNlbGYsZCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldERhdGFUb1Bsb3QoKXtcclxuICAgICAgICBpZighdGhpcy5lbmFibGVkR3JvdXBzKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEuZmlsdGVyKGQgPT4gdGhpcy5lbmFibGVkR3JvdXBzLmluZGV4T2YodGhpcy5wbG90Lmdyb3VwVmFsdWUoZCkpPi0xKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cFgoKXtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHggPSBwbG90Lng7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZy54O1xyXG5cclxuICAgICAgICAvKiAqXHJcbiAgICAgICAgICogdmFsdWUgYWNjZXNzb3IgLSByZXR1cm5zIHRoZSB2YWx1ZSB0byBlbmNvZGUgZm9yIGEgZ2l2ZW4gZGF0YSBvYmplY3QuXHJcbiAgICAgICAgICogc2NhbGUgLSBtYXBzIHZhbHVlIHRvIGEgdmlzdWFsIGRpc3BsYXkgZW5jb2RpbmcsIHN1Y2ggYXMgYSBwaXhlbCBwb3NpdGlvbi5cclxuICAgICAgICAgKiBtYXAgZnVuY3Rpb24gLSBtYXBzIGZyb20gZGF0YSB2YWx1ZSB0byBkaXNwbGF5IHZhbHVlXHJcbiAgICAgICAgICogYXhpcyAtIHNldHMgdXAgYXhpc1xyXG4gICAgICAgICAqKi9cclxuICAgICAgICB4LnZhbHVlID0gZCA9PiBjb25mLnZhbHVlKGQsIGNvbmYua2V5KTtcclxuICAgICAgICB4LnNjYWxlID0gZDMuc2NhbGVbY29uZi5zY2FsZV0oKS5yYW5nZShbMCwgcGxvdC53aWR0aF0pO1xyXG4gICAgICAgIHgubWFwID0gZCA9PiB4LnNjYWxlKHgudmFsdWUoZCkpO1xyXG4gICAgICAgIHguYXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeC5zY2FsZSkub3JpZW50KGNvbmYub3JpZW50KTtcclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMucGxvdC5kYXRhO1xyXG4gICAgICAgIHBsb3QueC5zY2FsZS5kb21haW4oW2QzLm1pbihkYXRhLCBwbG90LngudmFsdWUpLTEsIGQzLm1heChkYXRhLCBwbG90LngudmFsdWUpKzFdKTtcclxuICAgICAgICBpZih0aGlzLmNvbmZpZy5ndWlkZXMpIHtcclxuICAgICAgICAgICAgeC5heGlzLnRpY2tTaXplKC1wbG90LmhlaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBZICgpe1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeSA9IHBsb3QueTtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnLnk7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdmFsdWUgYWNjZXNzb3IgLSByZXR1cm5zIHRoZSB2YWx1ZSB0byBlbmNvZGUgZm9yIGEgZ2l2ZW4gZGF0YSBvYmplY3QuXHJcbiAgICAgICAgICogc2NhbGUgLSBtYXBzIHZhbHVlIHRvIGEgdmlzdWFsIGRpc3BsYXkgZW5jb2RpbmcsIHN1Y2ggYXMgYSBwaXhlbCBwb3NpdGlvbi5cclxuICAgICAgICAgKiBtYXAgZnVuY3Rpb24gLSBtYXBzIGZyb20gZGF0YSB2YWx1ZSB0byBkaXNwbGF5IHZhbHVlXHJcbiAgICAgICAgICogYXhpcyAtIHNldHMgdXAgYXhpc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHkudmFsdWUgPSBkID0+IGNvbmYudmFsdWUoZCwgY29uZi5rZXkpO1xyXG4gICAgICAgIHkuc2NhbGUgPSBkMy5zY2FsZVtjb25mLnNjYWxlXSgpLnJhbmdlKFtwbG90LmhlaWdodCwgMF0pO1xyXG4gICAgICAgIHkubWFwID0gZCA9PiB5LnNjYWxlKHkudmFsdWUoZCkpO1xyXG4gICAgICAgIHkuYXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeS5zY2FsZSkub3JpZW50KGNvbmYub3JpZW50KTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5jb25maWcuZ3VpZGVzKXtcclxuICAgICAgICAgICAgeS5heGlzLnRpY2tTaXplKC1wbG90LndpZHRoKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMucGxvdC5kYXRhO1xyXG4gICAgICAgIHBsb3QueS5zY2FsZS5kb21haW4oW2QzLm1pbihkYXRhLCBwbG90LnkudmFsdWUpLTEsIGQzLm1heChkYXRhLCBwbG90LnkudmFsdWUpKzFdKTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhd0F4aXNYKCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBheGlzQ29uZiA9IHRoaXMuY29uZmlnLng7XHJcbiAgICAgICAgdmFyIGF4aXMgPSBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMteCcpK1wiLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMnKSsoc2VsZi5jb25maWcuZ3VpZGVzID8gJycgOiAnLicrc2VsZi5wcmVmaXhDbGFzcygnbm8tZ3VpZGVzJykpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgcGxvdC5oZWlnaHQgKyBcIilcIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGF4aXNUID0gYXhpcztcclxuICAgICAgICBpZiAoc2VsZi50cmFuc2l0aW9uRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgICAgIGF4aXNUID0gYXhpcy50cmFuc2l0aW9uKCkuZWFzZShcInNpbi1pbi1vdXRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBheGlzVC5jYWxsKHBsb3QueC5heGlzKTtcclxuICAgICAgICBcclxuICAgICAgICBheGlzLnNlbGVjdE9yQXBwZW5kKFwidGV4dC5cIitzZWxmLnByZWZpeENsYXNzKCdsYWJlbCcpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisgKHBsb3Qud2lkdGgvMikgK1wiLFwiKyAocGxvdC5tYXJnaW4uYm90dG9tKSArXCIpXCIpICAvLyB0ZXh0IGlzIGRyYXduIG9mZiB0aGUgc2NyZWVuIHRvcCBsZWZ0LCBtb3ZlIGRvd24gYW5kIG91dCBhbmQgcm90YXRlXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCItMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGF4aXNDb25mLmxhYmVsKTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhd0F4aXNZKCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBheGlzQ29uZiA9IHRoaXMuY29uZmlnLnk7XHJcbiAgICAgICAgdmFyIGF4aXMgPSBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMteScpK1wiLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMnKSsoc2VsZi5jb25maWcuZ3VpZGVzID8gJycgOiAnLicrc2VsZi5wcmVmaXhDbGFzcygnbm8tZ3VpZGVzJykpKTtcclxuXHJcbiAgICAgICAgdmFyIGF4aXNUID0gYXhpcztcclxuICAgICAgICBpZiAoc2VsZi50cmFuc2l0aW9uRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgICAgIGF4aXNUID0gYXhpcy50cmFuc2l0aW9uKCkuZWFzZShcInNpbi1pbi1vdXRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBheGlzVC5jYWxsKHBsb3QueS5heGlzKTtcclxuXHJcbiAgICAgICAgYXhpcy5zZWxlY3RPckFwcGVuZChcInRleHQuXCIrc2VsZi5wcmVmaXhDbGFzcygnbGFiZWwnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrIC1wbG90Lm1hcmdpbi5sZWZ0ICtcIixcIisocGxvdC5oZWlnaHQvMikrXCIpcm90YXRlKC05MClcIikgIC8vIHRleHQgaXMgZHJhd24gb2ZmIHRoZSBzY3JlZW4gdG9wIGxlZnQsIG1vdmUgZG93biBhbmQgb3V0IGFuZCByb3RhdGVcclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCBcIjFlbVwiKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAudGV4dChheGlzQ29uZi5sYWJlbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHVwZGF0ZShuZXdEYXRhKXtcclxuICAgICAgICBzdXBlci51cGRhdGUobmV3RGF0YSk7XHJcbiAgICAgICAgdGhpcy5kcmF3QXhpc1goKTtcclxuICAgICAgICB0aGlzLmRyYXdBeGlzWSgpO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZURvdHMoKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVMZWdlbmQoKTtcclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlRG90cygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGRhdGEgPSBwbG90LmRhdGE7XHJcbiAgICAgICAgdmFyIGRvdENsYXNzID0gc2VsZi5wcmVmaXhDbGFzcygnZG90Jyk7XHJcbiAgICAgICAgc2VsZi5kb3RzQ29udGFpbmVyQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKCdkb3RzLWNvbnRhaW5lcicpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGRvdHNDb250YWluZXIgPSBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiICsgc2VsZi5kb3RzQ29udGFpbmVyQ2xhc3MpO1xyXG5cclxuICAgICAgICB2YXIgZG90cyA9IGRvdHNDb250YWluZXIuc2VsZWN0QWxsKCcuJyArIGRvdENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShkYXRhKTtcclxuXHJcbiAgICAgICAgZG90cy5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGRvdENsYXNzKTtcclxuXHJcbiAgICAgICAgdmFyIGRvdHNUID0gZG90cztcclxuICAgICAgICBpZiAoc2VsZi50cmFuc2l0aW9uRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgICAgIGRvdHNUID0gZG90cy50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkb3RzVC5hdHRyKFwiclwiLCBzZWxmLmNvbmZpZy5kb3QucmFkaXVzKVxyXG4gICAgICAgICAgICAuYXR0cihcImN4XCIsIHBsb3QueC5tYXApXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY3lcIiwgcGxvdC55Lm1hcCk7XHJcblxyXG4gICAgICAgIGlmIChwbG90LnRvb2x0aXApIHtcclxuICAgICAgICAgICAgZG90cy5vbihcIm1vdXNlb3ZlclwiLCBkID0+IHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGh0bWwgPSBcIihcIiArIHBsb3QueC52YWx1ZShkKSArIFwiLCBcIiArIHBsb3QueS52YWx1ZShkKSArIFwiKVwiO1xyXG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwID0gc2VsZi5jb25maWcuZ3JvdXBzID8gIHNlbGYuY29uZmlnLmdyb3Vwcy52YWx1ZShkLCBzZWxmLmNvbmZpZy5ncm91cHMua2V5KSA6IG51bGw7XHJcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXAgfHwgZ3JvdXAgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBodG1sICs9IFwiPGJyLz5cIjtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSBzZWxmLmNvbmZpZy5ncm91cHMubGFiZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhYmVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gbGFiZWwgKyBcIjogXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gZ3JvdXBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC5odG1sKGh0bWwpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZDMuZXZlbnQucGFnZVggKyA1KSArIFwicHhcIilcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBsb3QuZG90LmNvbG9yKSB7XHJcbiAgICAgICAgICAgIGRvdHMuc3R5bGUoXCJmaWxsXCIsIHBsb3QuZG90LmNvbG9yKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG90cy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTGVnZW5kKCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9dGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuXHJcbiAgICAgICAgdmFyIHNjYWxlID0gcGxvdC5kb3QuY29sb3JDYXRlZ29yeTtcclxuXHJcblxyXG5cclxuICAgICAgICBpZighc2NhbGUuZG9tYWluKCkgfHwgc2NhbGUuZG9tYWluKCkubGVuZ3RoPDIpe1xyXG4gICAgICAgICAgICBwbG90LnNob3dMZWdlbmQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCFwbG90LnNob3dMZWdlbmQpe1xyXG4gICAgICAgICAgICBpZihwbG90LmxlZ2VuZCAmJiBwbG90LmxlZ2VuZC5jb250YWluZXIpe1xyXG4gICAgICAgICAgICAgICAgcGxvdC5sZWdlbmQuY29udGFpbmVyLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB2YXIgbGVnZW5kWCA9IHRoaXMucGxvdC53aWR0aCArIHRoaXMuY29uZmlnLmxlZ2VuZC5tYXJnaW47XHJcbiAgICAgICAgdmFyIGxlZ2VuZFkgPSB0aGlzLmNvbmZpZy5sZWdlbmQubWFyZ2luO1xyXG5cclxuICAgICAgICBwbG90LmxlZ2VuZCA9IG5ldyBMZWdlbmQodGhpcy5zdmcsIHRoaXMuc3ZnRywgc2NhbGUsIGxlZ2VuZFgsIGxlZ2VuZFkpO1xyXG5cclxuICAgICAgICBwbG90LmxlZ2VuZENvbG9yID0gcGxvdC5sZWdlbmQuY29sb3IoKVxyXG4gICAgICAgICAgICAuc2hhcGVXaWR0aCh0aGlzLmNvbmZpZy5sZWdlbmQuc2hhcGVXaWR0aClcclxuICAgICAgICAgICAgLm9yaWVudCgndmVydGljYWwnKVxyXG4gICAgICAgICAgICAuc2NhbGUoc2NhbGUpO1xyXG5cclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmRDb2xvci5vbignY2VsbGNsaWNrJywgYz0+IHNlbGYub25MZWdlbmRDZWxsQ2xpY2soYykpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHBsb3QubGVnZW5kLmNvbnRhaW5lclxyXG4gICAgICAgICAgICAuY2FsbChwbG90LmxlZ2VuZENvbG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkxlZ2VuZENlbGxDbGljayhjZWxsVmFsdWUpe1xyXG4gICAgICAgIHRoaXMudXBkYXRlRW5hYmxlZEdyb3VwcyhjZWxsVmFsdWUpO1xyXG5cclxuICAgICAgICB2YXIgaXNEaXNhYmxlZCA9IHRoaXMuZW5hYmxlZEdyb3Vwcy5pbmRleE9mKGNlbGxWYWx1ZSk8MDtcclxuICAgICAgICB0aGlzLnBsb3QubGVnZW5kLmNvbnRhaW5lci5zZWxlY3RBbGwoXCJnLmNlbGxcIikuZWFjaChmdW5jdGlvbihjZWxsKXtcclxuICAgICAgICAgICAgaWYoY2VsbCA9PSBjZWxsVmFsdWUpe1xyXG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoXCJvZGMtZGlzYWJsZWRcIiwgaXNEaXNhYmxlZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUVuYWJsZWRHcm91cHMoY2VsbFZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWRHcm91cHMpIHtcclxuICAgICAgICAgICAgdGhpcy5lbmFibGVkR3JvdXBzID0gdGhpcy5wbG90LmRvdC5jb2xvckNhdGVnb3J5LmRvbWFpbigpLnNsaWNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuZW5hYmxlZEdyb3Vwcy5pbmRleE9mKGNlbGxWYWx1ZSk7XHJcblxyXG4gICAgICAgIGlmIChpbmRleCA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy5lbmFibGVkR3JvdXBzLnB1c2goY2VsbFZhbHVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZWRHcm91cHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBzZXREYXRhKGRhdGEpe1xyXG4gICAgICAgIHN1cGVyLnNldERhdGEoZGF0YSk7XHJcbiAgICAgICAgdGhpcy5lbmFibGVkR3JvdXBzID0gbnVsbDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG4iLCIvKlxuICogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vYmVucmFzbXVzZW4vMTI2MTk3N1xuICogTkFNRVxuICogXG4gKiBzdGF0aXN0aWNzLWRpc3RyaWJ1dGlvbnMuanMgLSBKYXZhU2NyaXB0IGxpYnJhcnkgZm9yIGNhbGN1bGF0aW5nXG4gKiAgIGNyaXRpY2FsIHZhbHVlcyBhbmQgdXBwZXIgcHJvYmFiaWxpdGllcyBvZiBjb21tb24gc3RhdGlzdGljYWxcbiAqICAgZGlzdHJpYnV0aW9uc1xuICogXG4gKiBTWU5PUFNJU1xuICogXG4gKiBcbiAqICAgLy8gQ2hpLXNxdWFyZWQtY3JpdCAoMiBkZWdyZWVzIG9mIGZyZWVkb20sIDk1dGggcGVyY2VudGlsZSA9IDAuMDUgbGV2ZWxcbiAqICAgY2hpc3FyZGlzdHIoMiwgLjA1KVxuICogICBcbiAqICAgLy8gdS1jcml0ICg5NXRoIHBlcmNlbnRpbGUgPSAwLjA1IGxldmVsKVxuICogICB1ZGlzdHIoLjA1KTtcbiAqICAgXG4gKiAgIC8vIHQtY3JpdCAoMSBkZWdyZWUgb2YgZnJlZWRvbSwgOTkuNXRoIHBlcmNlbnRpbGUgPSAwLjAwNSBsZXZlbCkgXG4gKiAgIHRkaXN0cigxLC4wMDUpO1xuICogICBcbiAqICAgLy8gRi1jcml0ICgxIGRlZ3JlZSBvZiBmcmVlZG9tIGluIG51bWVyYXRvciwgMyBkZWdyZWVzIG9mIGZyZWVkb20gXG4gKiAgIC8vICAgICAgICAgaW4gZGVub21pbmF0b3IsIDk5dGggcGVyY2VudGlsZSA9IDAuMDEgbGV2ZWwpXG4gKiAgIGZkaXN0cigxLDMsLjAxKTtcbiAqICAgXG4gKiAgIC8vIHVwcGVyIHByb2JhYmlsaXR5IG9mIHRoZSB1IGRpc3RyaWJ1dGlvbiAodSA9IC0wLjg1KTogUSh1KSA9IDEtRyh1KVxuICogICB1cHJvYigtMC44NSk7XG4gKiAgIFxuICogICAvLyB1cHBlciBwcm9iYWJpbGl0eSBvZiB0aGUgY2hpLXNxdWFyZSBkaXN0cmlidXRpb25cbiAqICAgLy8gKDMgZGVncmVlcyBvZiBmcmVlZG9tLCBjaGktc3F1YXJlZCA9IDYuMjUpOiBRID0gMS1HXG4gKiAgIGNoaXNxcnByb2IoMyw2LjI1KTtcbiAqICAgXG4gKiAgIC8vIHVwcGVyIHByb2JhYmlsaXR5IG9mIHRoZSB0IGRpc3RyaWJ1dGlvblxuICogICAvLyAoMyBkZWdyZWVzIG9mIGZyZWVkb20sIHQgPSA2LjI1MSk6IFEgPSAxLUdcbiAqICAgdHByb2IoMyw2LjI1MSk7XG4gKiAgIFxuICogICAvLyB1cHBlciBwcm9iYWJpbGl0eSBvZiB0aGUgRiBkaXN0cmlidXRpb25cbiAqICAgLy8gKDMgZGVncmVlcyBvZiBmcmVlZG9tIGluIG51bWVyYXRvciwgNSBkZWdyZWVzIG9mIGZyZWVkb20gaW5cbiAqICAgLy8gIGRlbm9taW5hdG9yLCBGID0gNi4yNSk6IFEgPSAxLUdcbiAqICAgZnByb2IoMyw1LC42MjUpO1xuICogXG4gKiBcbiAqICBERVNDUklQVElPTlxuICogXG4gKiBUaGlzIGxpYnJhcnkgY2FsY3VsYXRlcyBwZXJjZW50YWdlIHBvaW50cyAoNSBzaWduaWZpY2FudCBkaWdpdHMpIG9mIHRoZSB1XG4gKiAoc3RhbmRhcmQgbm9ybWFsKSBkaXN0cmlidXRpb24sIHRoZSBzdHVkZW50J3MgdCBkaXN0cmlidXRpb24sIHRoZVxuICogY2hpLXNxdWFyZSBkaXN0cmlidXRpb24gYW5kIHRoZSBGIGRpc3RyaWJ1dGlvbi4gSXQgY2FuIGFsc28gY2FsY3VsYXRlIHRoZVxuICogdXBwZXIgcHJvYmFiaWxpdHkgKDUgc2lnbmlmaWNhbnQgZGlnaXRzKSBvZiB0aGUgdSAoc3RhbmRhcmQgbm9ybWFsKSwgdGhlXG4gKiBjaGktc3F1YXJlLCB0aGUgdCBhbmQgdGhlIEYgZGlzdHJpYnV0aW9uLlxuICogXG4gKiBUaGVzZSBjcml0aWNhbCB2YWx1ZXMgYXJlIG5lZWRlZCB0byBwZXJmb3JtIHN0YXRpc3RpY2FsIHRlc3RzLCBsaWtlIHRoZSB1XG4gKiB0ZXN0LCB0aGUgdCB0ZXN0LCB0aGUgRiB0ZXN0IGFuZCB0aGUgY2hpLXNxdWFyZWQgdGVzdCwgYW5kIHRvIGNhbGN1bGF0ZVxuICogY29uZmlkZW5jZSBpbnRlcnZhbHMuXG4gKiBcbiAqIElmIHlvdSBhcmUgaW50ZXJlc3RlZCBpbiBtb3JlIHByZWNpc2UgYWxnb3JpdGhtcyB5b3UgY291bGQgbG9vayBhdDpcbiAqICAgU3RhdExpYjogaHR0cDovL2xpYi5zdGF0LmNtdS5lZHUvYXBzdGF0LyA7IFxuICogICBBcHBsaWVkIFN0YXRpc3RpY3MgQWxnb3JpdGhtcyBieSBHcmlmZml0aHMsIFAuIGFuZCBIaWxsLCBJLkQuXG4gKiAgICwgRWxsaXMgSG9yd29vZDogQ2hpY2hlc3RlciAoMTk4NSlcbiAqIFxuICogQlVHUyBcbiAqIFxuICogVGhpcyBwb3J0IHdhcyBwcm9kdWNlZCBmcm9tIHRoZSBQZXJsIG1vZHVsZSBTdGF0aXN0aWNzOjpEaXN0cmlidXRpb25zXG4gKiB0aGF0IGhhcyBoYWQgbm8gYnVnIHJlcG9ydHMgaW4gc2V2ZXJhbCB5ZWFycy4gIElmIHlvdSBmaW5kIGEgYnVnIHRoZW5cbiAqIHBsZWFzZSBkb3VibGUtY2hlY2sgdGhhdCBKYXZhU2NyaXB0IGRvZXMgbm90IHRoaW5nIHRoZSBudW1iZXJzIHlvdSBhcmVcbiAqIHBhc3NpbmcgaW4gYXJlIHN0cmluZ3MuICAoWW91IGNhbiBzdWJ0cmFjdCAwIGZyb20gdGhlbSBhcyB5b3UgcGFzcyB0aGVtXG4gKiBpbiBzbyB0aGF0IFwiNVwiIGlzIHByb3Blcmx5IHVuZGVyc3Rvb2QgdG8gYmUgNS4pICBJZiB5b3UgaGF2ZSBwYXNzZWQgaW4gYVxuICogbnVtYmVyIHRoZW4gcGxlYXNlIGNvbnRhY3QgdGhlIGF1dGhvclxuICogXG4gKiBBVVRIT1JcbiAqIFxuICogQmVuIFRpbGx5IDxidGlsbHlAZ21haWwuY29tPlxuICogXG4gKiBPcmlnaW5sIFBlcmwgdmVyc2lvbiBieSBNaWNoYWVsIEtvc3BhY2ggPG1pa2UucGVybEBnbXguYXQ+XG4gKiBcbiAqIE5pY2UgZm9ybWF0aW5nLCBzaW1wbGlmaWNhdGlvbiBhbmQgYnVnIHJlcGFpciBieSBNYXR0aGlhcyBUcmF1dG5lciBLcm9tYW5uXG4gKiA8bXRrQGlkLmNicy5kaz5cbiAqIFxuICogQ09QWVJJR0hUIFxuICogXG4gKiBDb3B5cmlnaHQgMjAwOCBCZW4gVGlsbHkuXG4gKiBcbiAqIFRoaXMgbGlicmFyeSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0XG4gKiB1bmRlciB0aGUgc2FtZSB0ZXJtcyBhcyBQZXJsIGl0c2VsZi4gIFRoaXMgbWVhbnMgdW5kZXIgZWl0aGVyIHRoZSBQZXJsXG4gKiBBcnRpc3RpYyBMaWNlbnNlIG9yIHRoZSBHUEwgdjEgb3IgbGF0ZXIuXG4gKi9cblxudmFyIFNJR05JRklDQU5UID0gNTsgLy8gbnVtYmVyIG9mIHNpZ25pZmljYW50IGRpZ2l0cyB0byBiZSByZXR1cm5lZFxuXG5mdW5jdGlvbiBjaGlzcXJkaXN0ciAoJG4sICRwKSB7XG5cdGlmICgkbiA8PSAwIHx8IE1hdGguYWJzKCRuKSAtIE1hdGguYWJzKGludGVnZXIoJG4pKSAhPSAwKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG46ICRuXFxuXCIpOyAvKiBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9XG5cdGlmICgkcCA8PSAwIHx8ICRwID4gMSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBwOiAkcFxcblwiKTsgXG5cdH1cblx0cmV0dXJuIHByZWNpc2lvbl9zdHJpbmcoX3N1YmNoaXNxcigkbi0wLCAkcC0wKSk7XG59XG5cbmZ1bmN0aW9uIHVkaXN0ciAoJHApIHtcblx0aWYgKCRwID4gMSB8fCAkcCA8PSAwKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIHA6ICRwXFxuXCIpO1xuXHR9XG5cdHJldHVybiBwcmVjaXNpb25fc3RyaW5nKF9zdWJ1KCRwLTApKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRkaXN0ciAoJG4sICRwKSB7XG5cdGlmICgkbiA8PSAwIHx8IE1hdGguYWJzKCRuKSAtIE1hdGguYWJzKGludGVnZXIoJG4pKSAhPSAwKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG46ICRuXFxuXCIpO1xuXHR9XG5cdGlmICgkcCA8PSAwIHx8ICRwID49IDEpIHtcblx0XHR0aHJvdyhcIkludmFsaWQgcDogJHBcXG5cIik7XG5cdH1cblx0cmV0dXJuIHByZWNpc2lvbl9zdHJpbmcoX3N1YnQoJG4tMCwgJHAtMCkpO1xufVxuXG5mdW5jdGlvbiBmZGlzdHIgKCRuLCAkbSwgJHApIHtcblx0aWYgKCgkbjw9MCkgfHwgKChNYXRoLmFicygkbiktKE1hdGguYWJzKGludGVnZXIoJG4pKSkpIT0wKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBuOiAkblxcblwiKTsgLyogZmlyc3QgZGVncmVlIG9mIGZyZWVkb20gKi9cblx0fVxuXHRpZiAoKCRtPD0wKSB8fCAoKE1hdGguYWJzKCRtKS0oTWF0aC5hYnMoaW50ZWdlcigkbSkpKSkhPTApKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG06ICRtXFxuXCIpOyAvKiBzZWNvbmQgZGVncmVlIG9mIGZyZWVkb20gKi9cblx0fVxuXHRpZiAoKCRwPD0wKSB8fCAoJHA+MSkpIHtcblx0XHR0aHJvdyhcIkludmFsaWQgcDogJHBcXG5cIik7XG5cdH1cblx0cmV0dXJuIHByZWNpc2lvbl9zdHJpbmcoX3N1YmYoJG4tMCwgJG0tMCwgJHAtMCkpO1xufVxuXG5mdW5jdGlvbiB1cHJvYiAoJHgpIHtcblx0cmV0dXJuIHByZWNpc2lvbl9zdHJpbmcoX3N1YnVwcm9iKCR4LTApKTtcbn1cblxuZnVuY3Rpb24gY2hpc3FycHJvYiAoJG4sJHgpIHtcblx0aWYgKCgkbiA8PSAwKSB8fCAoKE1hdGguYWJzKCRuKSAtIChNYXRoLmFicyhpbnRlZ2VyKCRuKSkpKSAhPSAwKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBuOiAkblxcblwiKTsgLyogZGVncmVlIG9mIGZyZWVkb20gKi9cblx0fVxuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3ViY2hpc3FycHJvYigkbi0wLCAkeC0wKSk7XG59XG5cbmZ1bmN0aW9uIHRwcm9iICgkbiwgJHgpIHtcblx0aWYgKCgkbiA8PSAwKSB8fCAoKE1hdGguYWJzKCRuKSAtIE1hdGguYWJzKGludGVnZXIoJG4pKSkgIT0wKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBuOiAkblxcblwiKTsgLyogZGVncmVlIG9mIGZyZWVkb20gKi9cblx0fVxuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3VidHByb2IoJG4tMCwgJHgtMCkpO1xufVxuXG5mdW5jdGlvbiBmcHJvYiAoJG4sICRtLCAkeCkge1xuXHRpZiAoKCRuPD0wKSB8fCAoKE1hdGguYWJzKCRuKS0oTWF0aC5hYnMoaW50ZWdlcigkbikpKSkhPTApKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG46ICRuXFxuXCIpOyAvKiBmaXJzdCBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9XG5cdGlmICgoJG08PTApIHx8ICgoTWF0aC5hYnMoJG0pLShNYXRoLmFicyhpbnRlZ2VyKCRtKSkpKSE9MCkpIHtcblx0XHR0aHJvdyhcIkludmFsaWQgbTogJG1cXG5cIik7IC8qIHNlY29uZCBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9IFxuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3ViZnByb2IoJG4tMCwgJG0tMCwgJHgtMCkpO1xufVxuXG5cbmZ1bmN0aW9uIF9zdWJmcHJvYiAoJG4sICRtLCAkeCkge1xuXHR2YXIgJHA7XG5cblx0aWYgKCR4PD0wKSB7XG5cdFx0JHA9MTtcblx0fSBlbHNlIGlmICgkbSAlIDIgPT0gMCkge1xuXHRcdHZhciAkeiA9ICRtIC8gKCRtICsgJG4gKiAkeCk7XG5cdFx0dmFyICRhID0gMTtcblx0XHRmb3IgKHZhciAkaSA9ICRtIC0gMjsgJGkgPj0gMjsgJGkgLT0gMikge1xuXHRcdFx0JGEgPSAxICsgKCRuICsgJGkgLSAyKSAvICRpICogJHogKiAkYTtcblx0XHR9XG5cdFx0JHAgPSAxIC0gTWF0aC5wb3coKDEgLSAkeiksICgkbiAvIDIpICogJGEpO1xuXHR9IGVsc2UgaWYgKCRuICUgMiA9PSAwKSB7XG5cdFx0dmFyICR6ID0gJG4gKiAkeCAvICgkbSArICRuICogJHgpO1xuXHRcdHZhciAkYSA9IDE7XG5cdFx0Zm9yICh2YXIgJGkgPSAkbiAtIDI7ICRpID49IDI7ICRpIC09IDIpIHtcblx0XHRcdCRhID0gMSArICgkbSArICRpIC0gMikgLyAkaSAqICR6ICogJGE7XG5cdFx0fVxuXHRcdCRwID0gTWF0aC5wb3coKDEgLSAkeiksICgkbSAvIDIpKSAqICRhO1xuXHR9IGVsc2Uge1xuXHRcdHZhciAkeSA9IE1hdGguYXRhbjIoTWF0aC5zcXJ0KCRuICogJHggLyAkbSksIDEpO1xuXHRcdHZhciAkeiA9IE1hdGgucG93KE1hdGguc2luKCR5KSwgMik7XG5cdFx0dmFyICRhID0gKCRuID09IDEpID8gMCA6IDE7XG5cdFx0Zm9yICh2YXIgJGkgPSAkbiAtIDI7ICRpID49IDM7ICRpIC09IDIpIHtcblx0XHRcdCRhID0gMSArICgkbSArICRpIC0gMikgLyAkaSAqICR6ICogJGE7XG5cdFx0fSBcblx0XHR2YXIgJGIgPSBNYXRoLlBJO1xuXHRcdGZvciAodmFyICRpID0gMjsgJGkgPD0gJG0gLSAxOyAkaSArPSAyKSB7XG5cdFx0XHQkYiAqPSAoJGkgLSAxKSAvICRpO1xuXHRcdH1cblx0XHR2YXIgJHAxID0gMiAvICRiICogTWF0aC5zaW4oJHkpICogTWF0aC5wb3coTWF0aC5jb3MoJHkpLCAkbSkgKiAkYTtcblxuXHRcdCR6ID0gTWF0aC5wb3coTWF0aC5jb3MoJHkpLCAyKTtcblx0XHQkYSA9ICgkbSA9PSAxKSA/IDAgOiAxO1xuXHRcdGZvciAodmFyICRpID0gJG0tMjsgJGkgPj0gMzsgJGkgLT0gMikge1xuXHRcdFx0JGEgPSAxICsgKCRpIC0gMSkgLyAkaSAqICR6ICogJGE7XG5cdFx0fVxuXHRcdCRwID0gbWF4KDAsICRwMSArIDEgLSAyICogJHkgLyBNYXRoLlBJXG5cdFx0XHQtIDIgLyBNYXRoLlBJICogTWF0aC5zaW4oJHkpICogTWF0aC5jb3MoJHkpICogJGEpO1xuXHR9XG5cdHJldHVybiAkcDtcbn1cblxuXG5mdW5jdGlvbiBfc3ViY2hpc3FycHJvYiAoJG4sJHgpIHtcblx0dmFyICRwO1xuXG5cdGlmICgkeCA8PSAwKSB7XG5cdFx0JHAgPSAxO1xuXHR9IGVsc2UgaWYgKCRuID4gMTAwKSB7XG5cdFx0JHAgPSBfc3VidXByb2IoKE1hdGgucG93KCgkeCAvICRuKSwgMS8zKVxuXHRcdFx0XHQtICgxIC0gMi85LyRuKSkgLyBNYXRoLnNxcnQoMi85LyRuKSk7XG5cdH0gZWxzZSBpZiAoJHggPiA0MDApIHtcblx0XHQkcCA9IDA7XG5cdH0gZWxzZSB7ICAgXG5cdFx0dmFyICRhO1xuICAgICAgICAgICAgICAgIHZhciAkaTtcbiAgICAgICAgICAgICAgICB2YXIgJGkxO1xuXHRcdGlmICgoJG4gJSAyKSAhPSAwKSB7XG5cdFx0XHQkcCA9IDIgKiBfc3VidXByb2IoTWF0aC5zcXJ0KCR4KSk7XG5cdFx0XHQkYSA9IE1hdGguc3FydCgyL01hdGguUEkpICogTWF0aC5leHAoLSR4LzIpIC8gTWF0aC5zcXJ0KCR4KTtcblx0XHRcdCRpMSA9IDE7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRwID0gJGEgPSBNYXRoLmV4cCgtJHgvMik7XG5cdFx0XHQkaTEgPSAyO1xuXHRcdH1cblxuXHRcdGZvciAoJGkgPSAkaTE7ICRpIDw9ICgkbi0yKTsgJGkgKz0gMikge1xuXHRcdFx0JGEgKj0gJHggLyAkaTtcblx0XHRcdCRwICs9ICRhO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gJHA7XG59XG5cbmZ1bmN0aW9uIF9zdWJ1ICgkcCkge1xuXHR2YXIgJHkgPSAtTWF0aC5sb2coNCAqICRwICogKDEgLSAkcCkpO1xuXHR2YXIgJHggPSBNYXRoLnNxcnQoXG5cdFx0JHkgKiAoMS41NzA3OTYyODhcblx0XHQgICsgJHkgKiAoLjAzNzA2OTg3OTA2XG5cdFx0ICBcdCsgJHkgKiAoLS44MzY0MzUzNTg5RS0zXG5cdFx0XHQgICsgJHkgKigtLjIyNTA5NDcxNzZFLTNcblx0XHRcdCAgXHQrICR5ICogKC42ODQxMjE4Mjk5RS01XG5cdFx0XHRcdCAgKyAkeSAqICgwLjU4MjQyMzg1MTVFLTVcblx0XHRcdFx0XHQrICR5ICogKC0uMTA0NTI3NDk3RS01XG5cdFx0XHRcdFx0ICArICR5ICogKC44MzYwOTM3MDE3RS03XG5cdFx0XHRcdFx0XHQrICR5ICogKC0uMzIzMTA4MTI3N0UtOFxuXHRcdFx0XHRcdFx0ICArICR5ICogKC4zNjU3NzYzMDM2RS0xMFxuXHRcdFx0XHRcdFx0XHQrICR5ICouNjkzNjIzMzk4MkUtMTIpKSkpKSkpKSkpKTtcblx0aWYgKCRwPi41KVxuICAgICAgICAgICAgICAgICR4ID0gLSR4O1xuXHRyZXR1cm4gJHg7XG59XG5cbmZ1bmN0aW9uIF9zdWJ1cHJvYiAoJHgpIHtcblx0dmFyICRwID0gMDsgLyogaWYgKCRhYnN4ID4gMTAwKSAqL1xuXHR2YXIgJGFic3ggPSBNYXRoLmFicygkeCk7XG5cblx0aWYgKCRhYnN4IDwgMS45KSB7XG5cdFx0JHAgPSBNYXRoLnBvdygoMSArXG5cdFx0XHQkYWJzeCAqICguMDQ5ODY3MzQ3XG5cdFx0XHQgICsgJGFic3ggKiAoLjAyMTE0MTAwNjFcblx0XHRcdCAgXHQrICRhYnN4ICogKC4wMDMyNzc2MjYzXG5cdFx0XHRcdCAgKyAkYWJzeCAqICguMDAwMDM4MDAzNlxuXHRcdFx0XHRcdCsgJGFic3ggKiAoLjAwMDA0ODg5MDZcblx0XHRcdFx0XHQgICsgJGFic3ggKiAuMDAwMDA1MzgzKSkpKSkpLCAtMTYpLzI7XG5cdH0gZWxzZSBpZiAoJGFic3ggPD0gMTAwKSB7XG5cdFx0Zm9yICh2YXIgJGkgPSAxODsgJGkgPj0gMTsgJGktLSkge1xuXHRcdFx0JHAgPSAkaSAvICgkYWJzeCArICRwKTtcblx0XHR9XG5cdFx0JHAgPSBNYXRoLmV4cCgtLjUgKiAkYWJzeCAqICRhYnN4KSBcblx0XHRcdC8gTWF0aC5zcXJ0KDIgKiBNYXRoLlBJKSAvICgkYWJzeCArICRwKTtcblx0fVxuXG5cdGlmICgkeDwwKVxuICAgICAgICBcdCRwID0gMSAtICRwO1xuXHRyZXR1cm4gJHA7XG59XG5cbiAgIFxuZnVuY3Rpb24gX3N1YnQgKCRuLCAkcCkge1xuXG5cdGlmICgkcCA+PSAxIHx8ICRwIDw9IDApIHtcblx0XHR0aHJvdyhcIkludmFsaWQgcDogJHBcXG5cIik7XG5cdH1cblxuXHRpZiAoJHAgPT0gMC41KSB7XG5cdFx0cmV0dXJuIDA7XG5cdH0gZWxzZSBpZiAoJHAgPCAwLjUpIHtcblx0XHRyZXR1cm4gLSBfc3VidCgkbiwgMSAtICRwKTtcblx0fVxuXG5cdHZhciAkdSA9IF9zdWJ1KCRwKTtcblx0dmFyICR1MiA9IE1hdGgucG93KCR1LCAyKTtcblxuXHR2YXIgJGEgPSAoJHUyICsgMSkgLyA0O1xuXHR2YXIgJGIgPSAoKDUgKiAkdTIgKyAxNikgKiAkdTIgKyAzKSAvIDk2O1xuXHR2YXIgJGMgPSAoKCgzICogJHUyICsgMTkpICogJHUyICsgMTcpICogJHUyIC0gMTUpIC8gMzg0O1xuXHR2YXIgJGQgPSAoKCgoNzkgKiAkdTIgKyA3NzYpICogJHUyICsgMTQ4MikgKiAkdTIgLSAxOTIwKSAqICR1MiAtIDk0NSkgXG5cdFx0XHRcdC8gOTIxNjA7XG5cdHZhciAkZSA9ICgoKCgoMjcgKiAkdTIgKyAzMzkpICogJHUyICsgOTMwKSAqICR1MiAtIDE3ODIpICogJHUyIC0gNzY1KSAqICR1MlxuXHRcdFx0KyAxNzk1NSkgLyAzNjg2NDA7XG5cblx0dmFyICR4ID0gJHUgKiAoMSArICgkYSArICgkYiArICgkYyArICgkZCArICRlIC8gJG4pIC8gJG4pIC8gJG4pIC8gJG4pIC8gJG4pO1xuXG5cdGlmICgkbiA8PSBNYXRoLnBvdyhsb2cxMCgkcCksIDIpICsgMykge1xuXHRcdHZhciAkcm91bmQ7XG5cdFx0ZG8geyBcblx0XHRcdHZhciAkcDEgPSBfc3VidHByb2IoJG4sICR4KTtcblx0XHRcdHZhciAkbjEgPSAkbiArIDE7XG5cdFx0XHR2YXIgJGRlbHRhID0gKCRwMSAtICRwKSBcblx0XHRcdFx0LyBNYXRoLmV4cCgoJG4xICogTWF0aC5sb2coJG4xIC8gKCRuICsgJHggKiAkeCkpIFxuXHRcdFx0XHRcdCsgTWF0aC5sb2coJG4vJG4xLzIvTWF0aC5QSSkgLSAxIFxuXHRcdFx0XHRcdCsgKDEvJG4xIC0gMS8kbikgLyA2KSAvIDIpO1xuXHRcdFx0JHggKz0gJGRlbHRhO1xuXHRcdFx0JHJvdW5kID0gcm91bmRfdG9fcHJlY2lzaW9uKCRkZWx0YSwgTWF0aC5hYnMoaW50ZWdlcihsb2cxMChNYXRoLmFicygkeCkpLTQpKSk7XG5cdFx0fSB3aGlsZSAoKCR4KSAmJiAoJHJvdW5kICE9IDApKTtcblx0fVxuXHRyZXR1cm4gJHg7XG59XG5cbmZ1bmN0aW9uIF9zdWJ0cHJvYiAoJG4sICR4KSB7XG5cblx0dmFyICRhO1xuICAgICAgICB2YXIgJGI7XG5cdHZhciAkdyA9IE1hdGguYXRhbjIoJHggLyBNYXRoLnNxcnQoJG4pLCAxKTtcblx0dmFyICR6ID0gTWF0aC5wb3coTWF0aC5jb3MoJHcpLCAyKTtcblx0dmFyICR5ID0gMTtcblxuXHRmb3IgKHZhciAkaSA9ICRuLTI7ICRpID49IDI7ICRpIC09IDIpIHtcblx0XHQkeSA9IDEgKyAoJGktMSkgLyAkaSAqICR6ICogJHk7XG5cdH0gXG5cblx0aWYgKCRuICUgMiA9PSAwKSB7XG5cdFx0JGEgPSBNYXRoLnNpbigkdykvMjtcblx0XHQkYiA9IC41O1xuXHR9IGVsc2Uge1xuXHRcdCRhID0gKCRuID09IDEpID8gMCA6IE1hdGguc2luKCR3KSpNYXRoLmNvcygkdykvTWF0aC5QSTtcblx0XHQkYj0gLjUgKyAkdy9NYXRoLlBJO1xuXHR9XG5cdHJldHVybiBtYXgoMCwgMSAtICRiIC0gJGEgKiAkeSk7XG59XG5cbmZ1bmN0aW9uIF9zdWJmICgkbiwgJG0sICRwKSB7XG5cdHZhciAkeDtcblxuXHRpZiAoJHAgPj0gMSB8fCAkcCA8PSAwKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIHA6ICRwXFxuXCIpO1xuXHR9XG5cblx0aWYgKCRwID09IDEpIHtcblx0XHQkeCA9IDA7XG5cdH0gZWxzZSBpZiAoJG0gPT0gMSkge1xuXHRcdCR4ID0gMSAvIE1hdGgucG93KF9zdWJ0KCRuLCAwLjUgLSAkcCAvIDIpLCAyKTtcblx0fSBlbHNlIGlmICgkbiA9PSAxKSB7XG5cdFx0JHggPSBNYXRoLnBvdyhfc3VidCgkbSwgJHAvMiksIDIpO1xuXHR9IGVsc2UgaWYgKCRtID09IDIpIHtcblx0XHR2YXIgJHUgPSBfc3ViY2hpc3FyKCRtLCAxIC0gJHApO1xuXHRcdHZhciAkYSA9ICRtIC0gMjtcblx0XHQkeCA9IDEgLyAoJHUgLyAkbSAqICgxICtcblx0XHRcdCgoJHUgLSAkYSkgLyAyICtcblx0XHRcdFx0KCgoNCAqICR1IC0gMTEgKiAkYSkgKiAkdSArICRhICogKDcgKiAkbSAtIDEwKSkgLyAyNCArXG5cdFx0XHRcdFx0KCgoMiAqICR1IC0gMTAgKiAkYSkgKiAkdSArICRhICogKDE3ICogJG0gLSAyNikpICogJHVcblx0XHRcdFx0XHRcdC0gJGEgKiAkYSAqICg5ICogJG0gLSA2KVxuXHRcdFx0XHRcdCkvNDgvJG5cblx0XHRcdFx0KS8kblxuXHRcdFx0KS8kbikpO1xuXHR9IGVsc2UgaWYgKCRuID4gJG0pIHtcblx0XHQkeCA9IDEgLyBfc3ViZjIoJG0sICRuLCAxIC0gJHApXG5cdH0gZWxzZSB7XG5cdFx0JHggPSBfc3ViZjIoJG4sICRtLCAkcClcblx0fVxuXHRyZXR1cm4gJHg7XG59XG5cbmZ1bmN0aW9uIF9zdWJmMiAoJG4sICRtLCAkcCkge1xuXHR2YXIgJHUgPSBfc3ViY2hpc3FyKCRuLCAkcCk7XG5cdHZhciAkbjIgPSAkbiAtIDI7XG5cdHZhciAkeCA9ICR1IC8gJG4gKiBcblx0XHQoMSArIFxuXHRcdFx0KCgkdSAtICRuMikgLyAyICsgXG5cdFx0XHRcdCgoKDQgKiAkdSAtIDExICogJG4yKSAqICR1ICsgJG4yICogKDcgKiAkbiAtIDEwKSkgLyAyNCArIFxuXHRcdFx0XHRcdCgoKDIgKiAkdSAtIDEwICogJG4yKSAqICR1ICsgJG4yICogKDE3ICogJG4gLSAyNikpICogJHUgXG5cdFx0XHRcdFx0XHQtICRuMiAqICRuMiAqICg5ICogJG4gLSA2KSkgLyA0OCAvICRtKSAvICRtKSAvICRtKTtcblx0dmFyICRkZWx0YTtcblx0ZG8ge1xuXHRcdHZhciAkeiA9IE1hdGguZXhwKFxuXHRcdFx0KCgkbiskbSkgKiBNYXRoLmxvZygoJG4rJG0pIC8gKCRuICogJHggKyAkbSkpIFxuXHRcdFx0XHQrICgkbiAtIDIpICogTWF0aC5sb2coJHgpXG5cdFx0XHRcdCsgTWF0aC5sb2coJG4gKiAkbSAvICgkbiskbSkpXG5cdFx0XHRcdC0gTWF0aC5sb2coNCAqIE1hdGguUEkpXG5cdFx0XHRcdC0gKDEvJG4gICsgMS8kbSAtIDEvKCRuKyRtKSkvNlxuXHRcdFx0KS8yKTtcblx0XHQkZGVsdGEgPSAoX3N1YmZwcm9iKCRuLCAkbSwgJHgpIC0gJHApIC8gJHo7XG5cdFx0JHggKz0gJGRlbHRhO1xuXHR9IHdoaWxlIChNYXRoLmFicygkZGVsdGEpPjNlLTQpO1xuXHRyZXR1cm4gJHg7XG59XG5cbmZ1bmN0aW9uIF9zdWJjaGlzcXIgKCRuLCAkcCkge1xuXHR2YXIgJHg7XG5cblx0aWYgKCgkcCA+IDEpIHx8ICgkcCA8PSAwKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBwOiAkcFxcblwiKTtcblx0fSBlbHNlIGlmICgkcCA9PSAxKXtcblx0XHQkeCA9IDA7XG5cdH0gZWxzZSBpZiAoJG4gPT0gMSkge1xuXHRcdCR4ID0gTWF0aC5wb3coX3N1YnUoJHAgLyAyKSwgMik7XG5cdH0gZWxzZSBpZiAoJG4gPT0gMikge1xuXHRcdCR4ID0gLTIgKiBNYXRoLmxvZygkcCk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyICR1ID0gX3N1YnUoJHApO1xuXHRcdHZhciAkdTIgPSAkdSAqICR1O1xuXG5cdFx0JHggPSBtYXgoMCwgJG4gKyBNYXRoLnNxcnQoMiAqICRuKSAqICR1IFxuXHRcdFx0KyAyLzMgKiAoJHUyIC0gMSlcblx0XHRcdCsgJHUgKiAoJHUyIC0gNykgLyA5IC8gTWF0aC5zcXJ0KDIgKiAkbilcblx0XHRcdC0gMi80MDUgLyAkbiAqICgkdTIgKiAoMyAqJHUyICsgNykgLSAxNikpO1xuXG5cdFx0aWYgKCRuIDw9IDEwMCkge1xuXHRcdFx0dmFyICR4MDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkcDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJHo7XG5cdFx0XHRkbyB7XG5cdFx0XHRcdCR4MCA9ICR4O1xuXHRcdFx0XHRpZiAoJHggPCAwKSB7XG5cdFx0XHRcdFx0JHAxID0gMTtcblx0XHRcdFx0fSBlbHNlIGlmICgkbj4xMDApIHtcblx0XHRcdFx0XHQkcDEgPSBfc3VidXByb2IoKE1hdGgucG93KCgkeCAvICRuKSwgKDEvMykpIC0gKDEgLSAyLzkvJG4pKVxuXHRcdFx0XHRcdFx0LyBNYXRoLnNxcnQoMi85LyRuKSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoJHg+NDAwKSB7XG5cdFx0XHRcdFx0JHAxID0gMDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YXIgJGkwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRhO1xuXHRcdFx0XHRcdGlmICgoJG4gJSAyKSAhPSAwKSB7XG5cdFx0XHRcdFx0XHQkcDEgPSAyICogX3N1YnVwcm9iKE1hdGguc3FydCgkeCkpO1xuXHRcdFx0XHRcdFx0JGEgPSBNYXRoLnNxcnQoMi9NYXRoLlBJKSAqIE1hdGguZXhwKC0keC8yKSAvIE1hdGguc3FydCgkeCk7XG5cdFx0XHRcdFx0XHQkaTAgPSAxO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkcDEgPSAkYSA9IE1hdGguZXhwKC0keC8yKTtcblx0XHRcdFx0XHRcdCRpMCA9IDI7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Zm9yICh2YXIgJGkgPSAkaTA7ICRpIDw9ICRuLTI7ICRpICs9IDIpIHtcblx0XHRcdFx0XHRcdCRhICo9ICR4IC8gJGk7XG5cdFx0XHRcdFx0XHQkcDEgKz0gJGE7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdCR6ID0gTWF0aC5leHAoKCgkbi0xKSAqIE1hdGgubG9nKCR4LyRuKSAtIE1hdGgubG9nKDQqTWF0aC5QSSokeCkgXG5cdFx0XHRcdFx0KyAkbiAtICR4IC0gMS8kbi82KSAvIDIpO1xuXHRcdFx0XHQkeCArPSAoJHAxIC0gJHApIC8gJHo7XG5cdFx0XHRcdCR4ID0gcm91bmRfdG9fcHJlY2lzaW9uKCR4LCA1KTtcblx0XHRcdH0gd2hpbGUgKCgkbiA8IDMxKSAmJiAoTWF0aC5hYnMoJHgwIC0gJHgpID4gMWUtNCkpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gJHg7XG59XG5cbmZ1bmN0aW9uIGxvZzEwICgkbikge1xuXHRyZXR1cm4gTWF0aC5sb2coJG4pIC8gTWF0aC5sb2coMTApO1xufVxuIFxuZnVuY3Rpb24gbWF4ICgpIHtcblx0dmFyICRtYXggPSBhcmd1bWVudHNbMF07XG5cdGZvciAodmFyICRpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICgkbWF4IDwgYXJndW1lbnRzWyRpXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICRtYXggPSBhcmd1bWVudHNbJGldO1xuXHR9XHRcblx0cmV0dXJuICRtYXg7XG59XG5cbmZ1bmN0aW9uIG1pbiAoKSB7XG5cdHZhciAkbWluID0gYXJndW1lbnRzWzBdO1xuXHRmb3IgKHZhciAkaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoJG1pbiA+IGFyZ3VtZW50c1skaV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAkbWluID0gYXJndW1lbnRzWyRpXTtcblx0fVxuXHRyZXR1cm4gJG1pbjtcbn1cblxuZnVuY3Rpb24gcHJlY2lzaW9uICgkeCkge1xuXHRyZXR1cm4gTWF0aC5hYnMoaW50ZWdlcihsb2cxMChNYXRoLmFicygkeCkpIC0gU0lHTklGSUNBTlQpKTtcbn1cblxuZnVuY3Rpb24gcHJlY2lzaW9uX3N0cmluZyAoJHgpIHtcblx0aWYgKCR4KSB7XG5cdFx0cmV0dXJuIHJvdW5kX3RvX3ByZWNpc2lvbigkeCwgcHJlY2lzaW9uKCR4KSk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIFwiMFwiO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJvdW5kX3RvX3ByZWNpc2lvbiAoJHgsICRwKSB7XG4gICAgICAgICR4ID0gJHggKiBNYXRoLnBvdygxMCwgJHApO1xuICAgICAgICAkeCA9IE1hdGgucm91bmQoJHgpO1xuICAgICAgICByZXR1cm4gJHggLyBNYXRoLnBvdygxMCwgJHApO1xufVxuXG5mdW5jdGlvbiBpbnRlZ2VyICgkaSkge1xuICAgICAgICBpZiAoJGkgPiAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKCRpKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwoJGkpO1xufSIsImltcG9ydCB7dGRpc3RyfSBmcm9tIFwiLi9zdGF0aXN0aWNzLWRpc3RyaWJ1dGlvbnNcIlxyXG5cclxudmFyIHN1ID0gbW9kdWxlLmV4cG9ydHMuU3RhdGlzdGljc1V0aWxzID17fTtcclxuc3Uuc2FtcGxlQ29ycmVsYXRpb24gPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy9zYW1wbGVfY29ycmVsYXRpb24nKTtcclxuc3UubGluZWFyUmVncmVzc2lvbiA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL2xpbmVhcl9yZWdyZXNzaW9uJyk7XHJcbnN1LmxpbmVhclJlZ3Jlc3Npb25MaW5lID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvbGluZWFyX3JlZ3Jlc3Npb25fbGluZScpO1xyXG5zdS5lcnJvckZ1bmN0aW9uID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvZXJyb3JfZnVuY3Rpb24nKTtcclxuc3Uuc3RhbmRhcmREZXZpYXRpb24gPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy9zdGFuZGFyZF9kZXZpYXRpb24nKTtcclxuc3Uuc2FtcGxlU3RhbmRhcmREZXZpYXRpb24gPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy9zYW1wbGVfc3RhbmRhcmRfZGV2aWF0aW9uJyk7XHJcbnN1LnZhcmlhbmNlID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvdmFyaWFuY2UnKTtcclxuc3UubWVhbiA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL21lYW4nKTtcclxuc3UuelNjb3JlID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvel9zY29yZScpO1xyXG5zdS5zdGFuZGFyZEVycm9yPSBhcnIgPT4gTWF0aC5zcXJ0KHN1LnZhcmlhbmNlKGFycikvKGFyci5sZW5ndGgtMSkpO1xyXG5cclxuXHJcbnN1LnRWYWx1ZT0gKGRlZ3JlZXNPZkZyZWVkb20sIGNyaXRpY2FsUHJvYmFiaWxpdHkpID0+IHsgLy9hcyBpbiBodHRwOi8vc3RhdHRyZWsuY29tL29ubGluZS1jYWxjdWxhdG9yL3QtZGlzdHJpYnV0aW9uLmFzcHhcclxuICAgIHJldHVybiB0ZGlzdHIoZGVncmVlc09mRnJlZWRvbSwgY3JpdGljYWxQcm9iYWJpbGl0eSk7XHJcbn07IiwiZXhwb3J0IGNsYXNzIFV0aWxzIHtcclxuICAgIHN0YXRpYyBTUVJUXzIgPSAxLjQxNDIxMzU2MjM3O1xyXG4gICAgLy8gdXNhZ2UgZXhhbXBsZSBkZWVwRXh0ZW5kKHt9LCBvYmpBLCBvYmpCKTsgPT4gc2hvdWxkIHdvcmsgc2ltaWxhciB0byAkLmV4dGVuZCh0cnVlLCB7fSwgb2JqQSwgb2JqQik7XHJcbiAgICBzdGF0aWMgZGVlcEV4dGVuZChvdXQpIHtcclxuXHJcbiAgICAgICAgdmFyIHV0aWxzID0gdGhpcztcclxuICAgICAgICB2YXIgZW1wdHlPdXQgPSB7fTtcclxuXHJcblxyXG4gICAgICAgIGlmICghb3V0ICYmIGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIEFycmF5LmlzQXJyYXkoYXJndW1lbnRzWzFdKSkge1xyXG4gICAgICAgICAgICBvdXQgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb3V0ID0gb3V0IHx8IHt9O1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBpZiAoIXNvdXJjZSlcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5KG91dFtrZXldKTtcclxuICAgICAgICAgICAgICAgIHZhciBpc09iamVjdCA9IHV0aWxzLmlzT2JqZWN0KG91dFtrZXldKTtcclxuICAgICAgICAgICAgICAgIHZhciBzcmNPYmogPSB1dGlscy5pc09iamVjdChzb3VyY2Vba2V5XSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlzT2JqZWN0ICYmICFpc0FycmF5ICYmIHNyY09iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWxzLmRlZXBFeHRlbmQob3V0W2tleV0sIHNvdXJjZVtrZXldKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0W2tleV0gPSBzb3VyY2Vba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIG1lcmdlRGVlcCh0YXJnZXQsIHNvdXJjZSkge1xyXG4gICAgICAgIGxldCBvdXRwdXQgPSBPYmplY3QuYXNzaWduKHt9LCB0YXJnZXQpO1xyXG4gICAgICAgIGlmIChVdGlscy5pc09iamVjdE5vdEFycmF5KHRhcmdldCkgJiYgVXRpbHMuaXNPYmplY3ROb3RBcnJheShzb3VyY2UpKSB7XHJcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKFV0aWxzLmlzT2JqZWN0Tm90QXJyYXkoc291cmNlW2tleV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoa2V5IGluIHRhcmdldCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ob3V0cHV0LCB7W2tleV06IHNvdXJjZVtrZXldfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRba2V5XSA9IFV0aWxzLm1lcmdlRGVlcCh0YXJnZXRba2V5XSwgc291cmNlW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKG91dHB1dCwge1trZXldOiBzb3VyY2Vba2V5XX0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY3Jvc3MoYSwgYikge1xyXG4gICAgICAgIHZhciBjID0gW10sIG4gPSBhLmxlbmd0aCwgbSA9IGIubGVuZ3RoLCBpLCBqO1xyXG4gICAgICAgIGZvciAoaSA9IC0xOyArK2kgPCBuOykgZm9yIChqID0gLTE7ICsraiA8IG07KSBjLnB1c2goe3g6IGFbaV0sIGk6IGksIHk6IGJbal0sIGo6IGp9KTtcclxuICAgICAgICByZXR1cm4gYztcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGluZmVyVmFyaWFibGVzKGRhdGEsIGdyb3VwS2V5LCBpbmNsdWRlR3JvdXApIHtcclxuICAgICAgICB2YXIgcmVzID0gW107XHJcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHZhciBkID0gZGF0YVswXTtcclxuICAgICAgICAgICAgaWYgKGQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgcmVzID0gZC5tYXAoZnVuY3Rpb24gKHYsIGkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkID09PSAnb2JqZWN0Jykge1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZC5oYXNPd25Qcm9wZXJ0eShwcm9wKSkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKHByb3ApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghaW5jbHVkZUdyb3VwKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHJlcy5pbmRleE9mKGdyb3VwS2V5KTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHJlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXNcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGlzT2JqZWN0Tm90QXJyYXkoaXRlbSkge1xyXG4gICAgICAgIHJldHVybiAoaXRlbSAmJiB0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkoaXRlbSkgJiYgaXRlbSAhPT0gbnVsbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBpc09iamVjdChhKSB7XHJcbiAgICAgICAgcmV0dXJuIGEgIT09IG51bGwgJiYgdHlwZW9mIGEgPT09ICdvYmplY3QnO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgaXNOdW1iZXIoYSkge1xyXG4gICAgICAgIHJldHVybiAhaXNOYU4oYSkgJiYgdHlwZW9mIGEgPT09ICdudW1iZXInO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgaXNGdW5jdGlvbihhKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBhID09PSAnZnVuY3Rpb24nO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgaXNEYXRlKGEpe1xyXG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYSkgPT09ICdbb2JqZWN0IERhdGVdJ1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpc1N0cmluZyhhKXtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGEgPT09ICdzdHJpbmcnIHx8IGEgaW5zdGFuY2VvZiBTdHJpbmdcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaW5zZXJ0T3JBcHBlbmRTZWxlY3RvcihwYXJlbnQsIHNlbGVjdG9yLCBvcGVyYXRpb24sIGJlZm9yZSkge1xyXG4gICAgICAgIHZhciBzZWxlY3RvclBhcnRzID0gc2VsZWN0b3Iuc3BsaXQoLyhbXFwuXFwjXSkvKTtcclxuICAgICAgICB2YXIgZWxlbWVudCA9IHBhcmVudFtvcGVyYXRpb25dKHNlbGVjdG9yUGFydHMuc2hpZnQoKSwgYmVmb3JlKTsvL1wiOmZpcnN0LWNoaWxkXCJcclxuICAgICAgICB3aGlsZSAoc2VsZWN0b3JQYXJ0cy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxlY3Rvck1vZGlmaWVyID0gc2VsZWN0b3JQYXJ0cy5zaGlmdCgpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZWN0b3JJdGVtID0gc2VsZWN0b3JQYXJ0cy5zaGlmdCgpO1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0b3JNb2RpZmllciA9PT0gXCIuXCIpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LmNsYXNzZWQoc2VsZWN0b3JJdGVtLCB0cnVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxlY3Rvck1vZGlmaWVyID09PSBcIiNcIikge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQuYXR0cignaWQnLCBzZWxlY3Rvckl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpbnNlcnRTZWxlY3RvcihwYXJlbnQsIHNlbGVjdG9yLCBiZWZvcmUpIHtcclxuICAgICAgICByZXR1cm4gVXRpbHMuaW5zZXJ0T3JBcHBlbmRTZWxlY3RvcihwYXJlbnQsIHNlbGVjdG9yLCBcImluc2VydFwiLCBiZWZvcmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhcHBlbmRTZWxlY3RvcihwYXJlbnQsIHNlbGVjdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIFV0aWxzLmluc2VydE9yQXBwZW5kU2VsZWN0b3IocGFyZW50LCBzZWxlY3RvciwgXCJhcHBlbmRcIik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNlbGVjdE9yQXBwZW5kKHBhcmVudCwgc2VsZWN0b3IsIGVsZW1lbnQpIHtcclxuICAgICAgICB2YXIgc2VsZWN0aW9uID0gcGFyZW50LnNlbGVjdChzZWxlY3Rvcik7XHJcbiAgICAgICAgaWYgKHNlbGVjdGlvbi5lbXB0eSgpKSB7XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50LmFwcGVuZChlbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gVXRpbHMuYXBwZW5kU2VsZWN0b3IocGFyZW50LCBzZWxlY3Rvcik7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2VsZWN0aW9uO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgc2VsZWN0T3JJbnNlcnQocGFyZW50LCBzZWxlY3RvciwgYmVmb3JlKSB7XHJcbiAgICAgICAgdmFyIHNlbGVjdGlvbiA9IHBhcmVudC5zZWxlY3Qoc2VsZWN0b3IpO1xyXG4gICAgICAgIGlmIChzZWxlY3Rpb24uZW1wdHkoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gVXRpbHMuaW5zZXJ0U2VsZWN0b3IocGFyZW50LCBzZWxlY3RvciwgYmVmb3JlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNlbGVjdGlvbjtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGxpbmVhckdyYWRpZW50KHN2ZywgZ3JhZGllbnRJZCwgcmFuZ2UsIHgxLCB5MSwgeDIsIHkyKSB7XHJcbiAgICAgICAgdmFyIGRlZnMgPSBVdGlscy5zZWxlY3RPckFwcGVuZChzdmcsIFwiZGVmc1wiKTtcclxuICAgICAgICB2YXIgbGluZWFyR3JhZGllbnQgPSBkZWZzLmFwcGVuZChcImxpbmVhckdyYWRpZW50XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgZ3JhZGllbnRJZCk7XHJcblxyXG4gICAgICAgIGxpbmVhckdyYWRpZW50XHJcbiAgICAgICAgICAgIC5hdHRyKFwieDFcIiwgeDEgKyBcIiVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ5MVwiLCB5MSArIFwiJVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcIngyXCIsIHgyICsgXCIlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieTJcIiwgeTIgKyBcIiVcIik7XHJcblxyXG4gICAgICAgIC8vQXBwZW5kIG11bHRpcGxlIGNvbG9yIHN0b3BzIGJ5IHVzaW5nIEQzJ3MgZGF0YS9lbnRlciBzdGVwXHJcbiAgICAgICAgdmFyIHN0b3BzID0gbGluZWFyR3JhZGllbnQuc2VsZWN0QWxsKFwic3RvcFwiKVxyXG4gICAgICAgICAgICAuZGF0YShyYW5nZSk7XHJcblxyXG4gICAgICAgIHN0b3BzLmVudGVyKCkuYXBwZW5kKFwic3RvcFwiKTtcclxuXHJcbiAgICAgICAgc3RvcHMuYXR0cihcIm9mZnNldFwiLCAoZCwgaSkgPT4gaSAvIChyYW5nZS5sZW5ndGggLSAxKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIGQgPT4gZCk7XHJcblxyXG4gICAgICAgIHN0b3BzLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2FuaXRpemVIZWlnaHQgPSBmdW5jdGlvbiAoaGVpZ2h0LCBjb250YWluZXIpIHtcclxuICAgICAgICByZXR1cm4gKGhlaWdodCB8fCBwYXJzZUludChjb250YWluZXIuc3R5bGUoJ2hlaWdodCcpLCAxMCkgfHwgNDAwKTtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIHNhbml0aXplV2lkdGggPSBmdW5jdGlvbiAod2lkdGgsIGNvbnRhaW5lcikge1xyXG4gICAgICAgIHJldHVybiAod2lkdGggfHwgcGFyc2VJbnQoY29udGFpbmVyLnN0eWxlKCd3aWR0aCcpLCAxMCkgfHwgOTYwKTtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGF2YWlsYWJsZUhlaWdodCA9IGZ1bmN0aW9uIChoZWlnaHQsIGNvbnRhaW5lciwgbWFyZ2luKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KDAsIFV0aWxzLnNhbml0aXplSGVpZ2h0KGhlaWdodCwgY29udGFpbmVyKSAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tKTtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGF2YWlsYWJsZVdpZHRoID0gZnVuY3Rpb24gKHdpZHRoLCBjb250YWluZXIsIG1hcmdpbikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLm1heCgwLCBVdGlscy5zYW5pdGl6ZVdpZHRoKHdpZHRoLCBjb250YWluZXIpIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgZ3VpZCgpIHtcclxuICAgICAgICBmdW5jdGlvbiBzNCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKDEgKyBNYXRoLnJhbmRvbSgpKSAqIDB4MTAwMDApXHJcbiAgICAgICAgICAgICAgICAudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgICAgICAgICAuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHM0KCkgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArIHM0KCkgKyAnLScgK1xyXG4gICAgICAgICAgICBzNCgpICsgJy0nICsgczQoKSArIHM0KCkgKyBzNCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vcGxhY2VzIHRleHRTdHJpbmcgaW4gdGV4dE9iaiwgYWRkcyBhbiBlbGxpcHNpcyBpZiB0ZXh0IGNhbid0IGZpdCBpbiB3aWR0aFxyXG4gICAgc3RhdGljIHBsYWNlVGV4dFdpdGhFbGxpcHNpcyh0ZXh0RDNPYmosIHRleHRTdHJpbmcsIHdpZHRoKXtcclxuICAgICAgICB2YXIgdGV4dE9iaiA9IHRleHREM09iai5ub2RlKCk7XHJcbiAgICAgICAgdGV4dE9iai50ZXh0Q29udGVudD10ZXh0U3RyaW5nO1xyXG5cclxuICAgICAgICB2YXIgbWFyZ2luID0gMDtcclxuICAgICAgICB2YXIgZWxsaXBzaXNMZW5ndGggPSA5O1xyXG4gICAgICAgIC8vZWxsaXBzaXMgaXMgbmVlZGVkXHJcbiAgICAgICAgaWYgKHRleHRPYmouZ2V0Q29tcHV0ZWRUZXh0TGVuZ3RoKCk+d2lkdGgrbWFyZ2luKXtcclxuICAgICAgICAgICAgZm9yICh2YXIgeD10ZXh0U3RyaW5nLmxlbmd0aC0zO3g+MDt4LT0xKXtcclxuICAgICAgICAgICAgICAgIGlmICh0ZXh0T2JqLmdldFN1YlN0cmluZ0xlbmd0aCgwLHgpK2VsbGlwc2lzTGVuZ3RoPD13aWR0aCttYXJnaW4pe1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHRPYmoudGV4dENvbnRlbnQ9dGV4dFN0cmluZy5zdWJzdHJpbmcoMCx4KStcIi4uLlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRleHRPYmoudGV4dENvbnRlbnQ9XCIuLi5cIjsgLy9jYW4ndCBwbGFjZSBhdCBhbGxcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcGxhY2VUZXh0V2l0aEVsbGlwc2lzQW5kVG9vbHRpcCh0ZXh0RDNPYmosIHRleHRTdHJpbmcsIHdpZHRoLCB0b29sdGlwKXtcclxuICAgICAgICB2YXIgZWxsaXBzaXNQbGFjZWQgPSBVdGlscy5wbGFjZVRleHRXaXRoRWxsaXBzaXModGV4dEQzT2JqLCB0ZXh0U3RyaW5nLCB3aWR0aCk7XHJcbiAgICAgICAgaWYoZWxsaXBzaXNQbGFjZWQgJiYgdG9vbHRpcCl7XHJcbiAgICAgICAgICAgIHRleHREM09iai5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgdG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xyXG4gICAgICAgICAgICAgICAgdG9vbHRpcC5odG1sKHRleHRTdHJpbmcpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZDMuZXZlbnQucGFnZVggKyA1KSArIFwicHhcIilcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0ZXh0RDNPYmoub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgdG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldEZvbnRTaXplKGVsZW1lbnQpe1xyXG4gICAgICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwiZm9udC1zaXplXCIpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==
