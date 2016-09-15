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
                return this.groups.key === undefined ? null : d[this.groups.key];
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
                    self.plot.groupValue = function (d) {
                        return conf.groups.value.call(conf, d);
                    };
                    self.plot.groupedData = d3.nest().key(this.plot.groupValue).entries(data);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJib3dlcl9jb21wb25lbnRzXFxkMy1sZWdlbmRcXG5vLWV4dGVuZC5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxjb2xvci5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxsZWdlbmQuanMiLCJib3dlcl9jb21wb25lbnRzXFxkMy1sZWdlbmRcXHNyY1xcc2l6ZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxzeW1ib2wuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxlcnJvcl9mdW5jdGlvbi5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXGxpbmVhcl9yZWdyZXNzaW9uLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcbGluZWFyX3JlZ3Jlc3Npb25fbGluZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXG1lYW4uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxxdWFudGlsZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXHF1YW50aWxlX3NvcnRlZC5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXHF1aWNrc2VsZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc2FtcGxlX2NvcnJlbGF0aW9uLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc2FtcGxlX2NvdmFyaWFuY2UuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfc3RhbmRhcmRfZGV2aWF0aW9uLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc2FtcGxlX3ZhcmlhbmNlLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc3RhbmRhcmRfZGV2aWF0aW9uLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc3VtLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcc3VtX250aF9wb3dlcl9kZXZpYXRpb25zLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcdmFyaWFuY2UuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFx6X3Njb3JlLmpzIiwic3JjXFxiYXItY2hhcnQuanMiLCJzcmNcXGJveC1wbG90LWJhc2UuanMiLCJzcmNcXGJveC1wbG90LmpzIiwic3JjXFxjaGFydC13aXRoLWNvbG9yLWdyb3Vwcy5qcyIsInNyY1xcY2hhcnQuanMiLCJzcmNcXGNvcnJlbGF0aW9uLW1hdHJpeC5qcyIsInNyY1xcZDMtZXh0ZW5zaW9ucy5qcyIsInNyY1xcaGVhdG1hcC10aW1lc2VyaWVzLmpzIiwic3JjXFxoZWF0bWFwLmpzIiwic3JjXFxoaXN0b2dyYW0uanMiLCJzcmNcXGluZGV4LmpzIiwic3JjXFxsZWdlbmQuanMiLCJzcmNcXHJlZ3Jlc3Npb24uanMiLCJzcmNcXHNjYXR0ZXJwbG90LW1hdHJpeC5qcyIsInNyY1xcc2NhdHRlcnBsb3QuanMiLCJzcmNcXHN0YXRpc3RpY3MtZGlzdHJpYnV0aW9ucy5qcyIsInNyY1xcc3RhdGlzdGljcy11dGlscy5qcyIsInNyY1xcdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQjtBQUNmLFNBQU8sUUFBUSxhQUFSLENBRFE7QUFFZixRQUFNLFFBQVEsWUFBUixDQUZT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QUFwQixFQUEyQixTQUEzQixJQUF3QyxPQUFPLElBQS9DLEdBQXNELE9BQU8sS0FBekUsQ0FBUDtBQUNILEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgY29sb3I6IHJlcXVpcmUoJy4vc3JjL2NvbG9yJyksXHJcbiAgc2l6ZTogcmVxdWlyZSgnLi9zcmMvc2l6ZScpLFxyXG4gIHN5bWJvbDogcmVxdWlyZSgnLi9zcmMvc3ltYm9sJylcclxufTtcclxuIiwidmFyIGhlbHBlciA9IHJlcXVpcmUoJy4vbGVnZW5kJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XHJcblxyXG4gIHZhciBzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLFxyXG4gICAgc2hhcGUgPSBcInJlY3RcIixcclxuICAgIHNoYXBlV2lkdGggPSAxNSxcclxuICAgIHNoYXBlSGVpZ2h0ID0gMTUsXHJcbiAgICBzaGFwZVJhZGl1cyA9IDEwLFxyXG4gICAgc2hhcGVQYWRkaW5nID0gMixcclxuICAgIGNlbGxzID0gWzVdLFxyXG4gICAgbGFiZWxzID0gW10sXHJcbiAgICBjbGFzc1ByZWZpeCA9IFwiXCIsXHJcbiAgICB1c2VDbGFzcyA9IGZhbHNlLFxyXG4gICAgdGl0bGUgPSBcIlwiLFxyXG4gICAgbGFiZWxGb3JtYXQgPSBkMy5mb3JtYXQoXCIuMDFmXCIpLFxyXG4gICAgbGFiZWxPZmZzZXQgPSAxMCxcclxuICAgIGxhYmVsQWxpZ24gPSBcIm1pZGRsZVwiLFxyXG4gICAgbGFiZWxEZWxpbWl0ZXIgPSBcInRvXCIsXHJcbiAgICBvcmllbnQgPSBcInZlcnRpY2FsXCIsXHJcbiAgICBhc2NlbmRpbmcgPSBmYWxzZSxcclxuICAgIHBhdGgsXHJcbiAgICBsZWdlbmREaXNwYXRjaGVyID0gZDMuZGlzcGF0Y2goXCJjZWxsb3ZlclwiLCBcImNlbGxvdXRcIiwgXCJjZWxsY2xpY2tcIik7XHJcblxyXG4gICAgZnVuY3Rpb24gbGVnZW5kKHN2Zyl7XHJcblxyXG4gICAgICB2YXIgdHlwZSA9IGhlbHBlci5kM19jYWxjVHlwZShzY2FsZSwgYXNjZW5kaW5nLCBjZWxscywgbGFiZWxzLCBsYWJlbEZvcm1hdCwgbGFiZWxEZWxpbWl0ZXIpLFxyXG4gICAgICAgIGxlZ2VuZEcgPSBzdmcuc2VsZWN0QWxsKCdnJykuZGF0YShbc2NhbGVdKTtcclxuXHJcbiAgICAgIGxlZ2VuZEcuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsIGNsYXNzUHJlZml4ICsgJ2xlZ2VuZENlbGxzJyk7XHJcblxyXG5cclxuICAgICAgdmFyIGNlbGwgPSBsZWdlbmRHLnNlbGVjdEFsbChcIi5cIiArIGNsYXNzUHJlZml4ICsgXCJjZWxsXCIpLmRhdGEodHlwZS5kYXRhKSxcclxuICAgICAgICBjZWxsRW50ZXIgPSBjZWxsLmVudGVyKCkuYXBwZW5kKFwiZ1wiLCBcIi5jZWxsXCIpLmF0dHIoXCJjbGFzc1wiLCBjbGFzc1ByZWZpeCArIFwiY2VsbFwiKS5zdHlsZShcIm9wYWNpdHlcIiwgMWUtNiksXHJcbiAgICAgICAgc2hhcGVFbnRlciA9IGNlbGxFbnRlci5hcHBlbmQoc2hhcGUpLmF0dHIoXCJjbGFzc1wiLCBjbGFzc1ByZWZpeCArIFwic3dhdGNoXCIpLFxyXG4gICAgICAgIHNoYXBlcyA9IGNlbGwuc2VsZWN0KFwiZy5cIiArIGNsYXNzUHJlZml4ICsgXCJjZWxsIFwiICsgc2hhcGUpO1xyXG5cclxuICAgICAgLy9hZGQgZXZlbnQgaGFuZGxlcnNcclxuICAgICAgaGVscGVyLmQzX2FkZEV2ZW50cyhjZWxsRW50ZXIsIGxlZ2VuZERpc3BhdGNoZXIpO1xyXG5cclxuICAgICAgY2VsbC5leGl0KCkudHJhbnNpdGlvbigpLnN0eWxlKFwib3BhY2l0eVwiLCAwKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgIGhlbHBlci5kM19kcmF3U2hhcGVzKHNoYXBlLCBzaGFwZXMsIHNoYXBlSGVpZ2h0LCBzaGFwZVdpZHRoLCBzaGFwZVJhZGl1cywgcGF0aCk7XHJcblxyXG4gICAgICBoZWxwZXIuZDNfYWRkVGV4dChsZWdlbmRHLCBjZWxsRW50ZXIsIHR5cGUubGFiZWxzLCBjbGFzc1ByZWZpeClcclxuXHJcbiAgICAgIC8vIHNldHMgcGxhY2VtZW50XHJcbiAgICAgIHZhciB0ZXh0ID0gY2VsbC5zZWxlY3QoXCJ0ZXh0XCIpLFxyXG4gICAgICAgIHNoYXBlU2l6ZSA9IHNoYXBlc1swXS5tYXAoIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC5nZXRCQm94KCk7IH0pO1xyXG5cclxuICAgICAgLy9zZXRzIHNjYWxlXHJcbiAgICAgIC8vZXZlcnl0aGluZyBpcyBmaWxsIGV4Y2VwdCBmb3IgbGluZSB3aGljaCBpcyBzdHJva2UsXHJcbiAgICAgIGlmICghdXNlQ2xhc3Mpe1xyXG4gICAgICAgIGlmIChzaGFwZSA9PSBcImxpbmVcIil7XHJcbiAgICAgICAgICBzaGFwZXMuc3R5bGUoXCJzdHJva2VcIiwgdHlwZS5mZWF0dXJlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc2hhcGVzLnN0eWxlKFwiZmlsbFwiLCB0eXBlLmZlYXR1cmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzaGFwZXMuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKGQpeyByZXR1cm4gY2xhc3NQcmVmaXggKyBcInN3YXRjaCBcIiArIHR5cGUuZmVhdHVyZShkKTsgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBjZWxsVHJhbnMsXHJcbiAgICAgIHRleHRUcmFucyxcclxuICAgICAgdGV4dEFsaWduID0gKGxhYmVsQWxpZ24gPT0gXCJzdGFydFwiKSA/IDAgOiAobGFiZWxBbGlnbiA9PSBcIm1pZGRsZVwiKSA/IDAuNSA6IDE7XHJcblxyXG4gICAgICAvL3Bvc2l0aW9ucyBjZWxscyBhbmQgdGV4dFxyXG4gICAgICBpZiAob3JpZW50ID09PSBcInZlcnRpY2FsXCIpe1xyXG4gICAgICAgIGNlbGxUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoMCwgXCIgKyAoaSAqIChzaGFwZVNpemVbaV0uaGVpZ2h0ICsgc2hhcGVQYWRkaW5nKSkgKyBcIilcIjsgfTtcclxuICAgICAgICB0ZXh0VHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKHNoYXBlU2l6ZVtpXS53aWR0aCArIHNoYXBlU2l6ZVtpXS54ICtcclxuICAgICAgICAgIGxhYmVsT2Zmc2V0KSArIFwiLFwiICsgKHNoYXBlU2l6ZVtpXS55ICsgc2hhcGVTaXplW2ldLmhlaWdodC8yICsgNSkgKyBcIilcIjsgfTtcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAob3JpZW50ID09PSBcImhvcml6b250YWxcIil7XHJcbiAgICAgICAgY2VsbFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIChpICogKHNoYXBlU2l6ZVtpXS53aWR0aCArIHNoYXBlUGFkZGluZykpICsgXCIsMClcIjsgfVxyXG4gICAgICAgIHRleHRUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAoc2hhcGVTaXplW2ldLndpZHRoKnRleHRBbGlnbiAgKyBzaGFwZVNpemVbaV0ueCkgK1xyXG4gICAgICAgICAgXCIsXCIgKyAoc2hhcGVTaXplW2ldLmhlaWdodCArIHNoYXBlU2l6ZVtpXS55ICsgbGFiZWxPZmZzZXQgKyA4KSArIFwiKVwiOyB9O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBoZWxwZXIuZDNfcGxhY2VtZW50KG9yaWVudCwgY2VsbCwgY2VsbFRyYW5zLCB0ZXh0LCB0ZXh0VHJhbnMsIGxhYmVsQWxpZ24pO1xyXG4gICAgICBoZWxwZXIuZDNfdGl0bGUoc3ZnLCBsZWdlbmRHLCB0aXRsZSwgY2xhc3NQcmVmaXgpO1xyXG5cclxuICAgICAgY2VsbC50cmFuc2l0aW9uKCkuc3R5bGUoXCJvcGFjaXR5XCIsIDEpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuICBsZWdlbmQuc2NhbGUgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzY2FsZTtcclxuICAgIHNjYWxlID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmNlbGxzID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY2VsbHM7XHJcbiAgICBpZiAoXy5sZW5ndGggPiAxIHx8IF8gPj0gMiApe1xyXG4gICAgICBjZWxscyA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5zaGFwZSA9IGZ1bmN0aW9uKF8sIGQpIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlO1xyXG4gICAgaWYgKF8gPT0gXCJyZWN0XCIgfHwgXyA9PSBcImNpcmNsZVwiIHx8IF8gPT0gXCJsaW5lXCIgfHwgKF8gPT0gXCJwYXRoXCIgJiYgKHR5cGVvZiBkID09PSAnc3RyaW5nJykpICl7XHJcbiAgICAgIHNoYXBlID0gXztcclxuICAgICAgcGF0aCA9IGQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5zaGFwZVdpZHRoID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGVXaWR0aDtcclxuICAgIHNoYXBlV2lkdGggPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlSGVpZ2h0ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGVIZWlnaHQ7XHJcbiAgICBzaGFwZUhlaWdodCA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuc2hhcGVSYWRpdXMgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZVJhZGl1cztcclxuICAgIHNoYXBlUmFkaXVzID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5zaGFwZVBhZGRpbmcgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZVBhZGRpbmc7XHJcbiAgICBzaGFwZVBhZGRpbmcgPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVscyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVscztcclxuICAgIGxhYmVscyA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbEFsaWduID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxBbGlnbjtcclxuICAgIGlmIChfID09IFwic3RhcnRcIiB8fCBfID09IFwiZW5kXCIgfHwgXyA9PSBcIm1pZGRsZVwiKSB7XHJcbiAgICAgIGxhYmVsQWxpZ24gPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxGb3JtYXQgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbEZvcm1hdDtcclxuICAgIGxhYmVsRm9ybWF0ID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsT2Zmc2V0ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxPZmZzZXQ7XHJcbiAgICBsYWJlbE9mZnNldCA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxEZWxpbWl0ZXIgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbERlbGltaXRlcjtcclxuICAgIGxhYmVsRGVsaW1pdGVyID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnVzZUNsYXNzID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdXNlQ2xhc3M7XHJcbiAgICBpZiAoXyA9PT0gdHJ1ZSB8fCBfID09PSBmYWxzZSl7XHJcbiAgICAgIHVzZUNsYXNzID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLm9yaWVudCA9IGZ1bmN0aW9uKF8pe1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gb3JpZW50O1xyXG4gICAgXyA9IF8udG9Mb3dlckNhc2UoKTtcclxuICAgIGlmIChfID09IFwiaG9yaXpvbnRhbFwiIHx8IF8gPT0gXCJ2ZXJ0aWNhbFwiKSB7XHJcbiAgICAgIG9yaWVudCA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5hc2NlbmRpbmcgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBhc2NlbmRpbmc7XHJcbiAgICBhc2NlbmRpbmcgPSAhIV87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5jbGFzc1ByZWZpeCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGNsYXNzUHJlZml4O1xyXG4gICAgY2xhc3NQcmVmaXggPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQudGl0bGUgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB0aXRsZTtcclxuICAgIHRpdGxlID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgZDMucmViaW5kKGxlZ2VuZCwgbGVnZW5kRGlzcGF0Y2hlciwgXCJvblwiKTtcclxuXHJcbiAgcmV0dXJuIGxlZ2VuZDtcclxuXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICBkM19pZGVudGl0eTogZnVuY3Rpb24gKGQpIHtcclxuICAgIHJldHVybiBkO1xyXG4gIH0sXHJcblxyXG4gIGQzX21lcmdlTGFiZWxzOiBmdW5jdGlvbiAoZ2VuLCBsYWJlbHMpIHtcclxuXHJcbiAgICAgIGlmKGxhYmVscy5sZW5ndGggPT09IDApIHJldHVybiBnZW47XHJcblxyXG4gICAgICBnZW4gPSAoZ2VuKSA/IGdlbiA6IFtdO1xyXG5cclxuICAgICAgdmFyIGkgPSBsYWJlbHMubGVuZ3RoO1xyXG4gICAgICBmb3IgKDsgaSA8IGdlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxhYmVscy5wdXNoKGdlbltpXSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGxhYmVscztcclxuICAgIH0sXHJcblxyXG4gIGQzX2xpbmVhckxlZ2VuZDogZnVuY3Rpb24gKHNjYWxlLCBjZWxscywgbGFiZWxGb3JtYXQpIHtcclxuICAgIHZhciBkYXRhID0gW107XHJcblxyXG4gICAgaWYgKGNlbGxzLmxlbmd0aCA+IDEpe1xyXG4gICAgICBkYXRhID0gY2VsbHM7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIGRvbWFpbiA9IHNjYWxlLmRvbWFpbigpLFxyXG4gICAgICBpbmNyZW1lbnQgPSAoZG9tYWluW2RvbWFpbi5sZW5ndGggLSAxXSAtIGRvbWFpblswXSkvKGNlbGxzIC0gMSksXHJcbiAgICAgIGkgPSAwO1xyXG5cclxuICAgICAgZm9yICg7IGkgPCBjZWxsczsgaSsrKXtcclxuICAgICAgICBkYXRhLnB1c2goZG9tYWluWzBdICsgaSppbmNyZW1lbnQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxhYmVscyA9IGRhdGEubWFwKGxhYmVsRm9ybWF0KTtcclxuXHJcbiAgICByZXR1cm4ge2RhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgIGxhYmVsczogbGFiZWxzLFxyXG4gICAgICAgICAgICBmZWF0dXJlOiBmdW5jdGlvbihkKXsgcmV0dXJuIHNjYWxlKGQpOyB9fTtcclxuICB9LFxyXG5cclxuICBkM19xdWFudExlZ2VuZDogZnVuY3Rpb24gKHNjYWxlLCBsYWJlbEZvcm1hdCwgbGFiZWxEZWxpbWl0ZXIpIHtcclxuICAgIHZhciBsYWJlbHMgPSBzY2FsZS5yYW5nZSgpLm1hcChmdW5jdGlvbihkKXtcclxuICAgICAgdmFyIGludmVydCA9IHNjYWxlLmludmVydEV4dGVudChkKSxcclxuICAgICAgYSA9IGxhYmVsRm9ybWF0KGludmVydFswXSksXHJcbiAgICAgIGIgPSBsYWJlbEZvcm1hdChpbnZlcnRbMV0pO1xyXG5cclxuICAgICAgLy8gaWYgKCggKGEpICYmIChhLmlzTmFuKCkpICYmIGIpe1xyXG4gICAgICAvLyAgIGNvbnNvbGUubG9nKFwiaW4gaW5pdGlhbCBzdGF0ZW1lbnRcIilcclxuICAgICAgICByZXR1cm4gbGFiZWxGb3JtYXQoaW52ZXJ0WzBdKSArIFwiIFwiICsgbGFiZWxEZWxpbWl0ZXIgKyBcIiBcIiArIGxhYmVsRm9ybWF0KGludmVydFsxXSk7XHJcbiAgICAgIC8vIH0gZWxzZSBpZiAoYSB8fCBiKSB7XHJcbiAgICAgIC8vICAgY29uc29sZS5sb2coJ2luIGVsc2Ugc3RhdGVtZW50JylcclxuICAgICAgLy8gICByZXR1cm4gKGEpID8gYSA6IGI7XHJcbiAgICAgIC8vIH1cclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4ge2RhdGE6IHNjYWxlLnJhbmdlKCksXHJcbiAgICAgICAgICAgIGxhYmVsczogbGFiZWxzLFxyXG4gICAgICAgICAgICBmZWF0dXJlOiB0aGlzLmQzX2lkZW50aXR5XHJcbiAgICAgICAgICB9O1xyXG4gIH0sXHJcblxyXG4gIGQzX29yZGluYWxMZWdlbmQ6IGZ1bmN0aW9uIChzY2FsZSkge1xyXG4gICAgcmV0dXJuIHtkYXRhOiBzY2FsZS5kb21haW4oKSxcclxuICAgICAgICAgICAgbGFiZWxzOiBzY2FsZS5kb21haW4oKSxcclxuICAgICAgICAgICAgZmVhdHVyZTogZnVuY3Rpb24oZCl7IHJldHVybiBzY2FsZShkKTsgfX07XHJcbiAgfSxcclxuXHJcbiAgZDNfZHJhd1NoYXBlczogZnVuY3Rpb24gKHNoYXBlLCBzaGFwZXMsIHNoYXBlSGVpZ2h0LCBzaGFwZVdpZHRoLCBzaGFwZVJhZGl1cywgcGF0aCkge1xyXG4gICAgaWYgKHNoYXBlID09PSBcInJlY3RcIil7XHJcbiAgICAgICAgc2hhcGVzLmF0dHIoXCJoZWlnaHRcIiwgc2hhcGVIZWlnaHQpLmF0dHIoXCJ3aWR0aFwiLCBzaGFwZVdpZHRoKTtcclxuXHJcbiAgICB9IGVsc2UgaWYgKHNoYXBlID09PSBcImNpcmNsZVwiKSB7XHJcbiAgICAgICAgc2hhcGVzLmF0dHIoXCJyXCIsIHNoYXBlUmFkaXVzKS8vLmF0dHIoXCJjeFwiLCBzaGFwZVJhZGl1cykuYXR0cihcImN5XCIsIHNoYXBlUmFkaXVzKTtcclxuXHJcbiAgICB9IGVsc2UgaWYgKHNoYXBlID09PSBcImxpbmVcIikge1xyXG4gICAgICAgIHNoYXBlcy5hdHRyKFwieDFcIiwgMCkuYXR0cihcIngyXCIsIHNoYXBlV2lkdGgpLmF0dHIoXCJ5MVwiLCAwKS5hdHRyKFwieTJcIiwgMCk7XHJcblxyXG4gICAgfSBlbHNlIGlmIChzaGFwZSA9PT0gXCJwYXRoXCIpIHtcclxuICAgICAgc2hhcGVzLmF0dHIoXCJkXCIsIHBhdGgpO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGQzX2FkZFRleHQ6IGZ1bmN0aW9uIChzdmcsIGVudGVyLCBsYWJlbHMsIGNsYXNzUHJlZml4KXtcclxuICAgIGVudGVyLmFwcGVuZChcInRleHRcIikuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJsYWJlbFwiKTtcclxuICAgIHN2Zy5zZWxlY3RBbGwoXCJnLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGwgdGV4dFwiKS5kYXRhKGxhYmVscykudGV4dCh0aGlzLmQzX2lkZW50aXR5KTtcclxuICB9LFxyXG5cclxuICBkM19jYWxjVHlwZTogZnVuY3Rpb24gKHNjYWxlLCBhc2NlbmRpbmcsIGNlbGxzLCBsYWJlbHMsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlcil7XHJcbiAgICB2YXIgdHlwZSA9IHNjYWxlLnRpY2tzID9cclxuICAgICAgICAgICAgdGhpcy5kM19saW5lYXJMZWdlbmQoc2NhbGUsIGNlbGxzLCBsYWJlbEZvcm1hdCkgOiBzY2FsZS5pbnZlcnRFeHRlbnQgP1xyXG4gICAgICAgICAgICB0aGlzLmQzX3F1YW50TGVnZW5kKHNjYWxlLCBsYWJlbEZvcm1hdCwgbGFiZWxEZWxpbWl0ZXIpIDogdGhpcy5kM19vcmRpbmFsTGVnZW5kKHNjYWxlKTtcclxuXHJcbiAgICB0eXBlLmxhYmVscyA9IHRoaXMuZDNfbWVyZ2VMYWJlbHModHlwZS5sYWJlbHMsIGxhYmVscyk7XHJcblxyXG4gICAgaWYgKGFzY2VuZGluZykge1xyXG4gICAgICB0eXBlLmxhYmVscyA9IHRoaXMuZDNfcmV2ZXJzZSh0eXBlLmxhYmVscyk7XHJcbiAgICAgIHR5cGUuZGF0YSA9IHRoaXMuZDNfcmV2ZXJzZSh0eXBlLmRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0eXBlO1xyXG4gIH0sXHJcblxyXG4gIGQzX3JldmVyc2U6IGZ1bmN0aW9uKGFycikge1xyXG4gICAgdmFyIG1pcnJvciA9IFtdO1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcnIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgIG1pcnJvcltpXSA9IGFycltsLWktMV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbWlycm9yO1xyXG4gIH0sXHJcblxyXG4gIGQzX3BsYWNlbWVudDogZnVuY3Rpb24gKG9yaWVudCwgY2VsbCwgY2VsbFRyYW5zLCB0ZXh0LCB0ZXh0VHJhbnMsIGxhYmVsQWxpZ24pIHtcclxuICAgIGNlbGwuYXR0cihcInRyYW5zZm9ybVwiLCBjZWxsVHJhbnMpO1xyXG4gICAgdGV4dC5hdHRyKFwidHJhbnNmb3JtXCIsIHRleHRUcmFucyk7XHJcbiAgICBpZiAob3JpZW50ID09PSBcImhvcml6b250YWxcIil7XHJcbiAgICAgIHRleHQuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBsYWJlbEFsaWduKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBkM19hZGRFdmVudHM6IGZ1bmN0aW9uKGNlbGxzLCBkaXNwYXRjaGVyKXtcclxuICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgIGNlbGxzLm9uKFwibW91c2VvdmVyLmxlZ2VuZFwiLCBmdW5jdGlvbiAoZCkgeyBfLmQzX2NlbGxPdmVyKGRpc3BhdGNoZXIsIGQsIHRoaXMpOyB9KVxyXG4gICAgICAgICAgLm9uKFwibW91c2VvdXQubGVnZW5kXCIsIGZ1bmN0aW9uIChkKSB7IF8uZDNfY2VsbE91dChkaXNwYXRjaGVyLCBkLCB0aGlzKTsgfSlcclxuICAgICAgICAgIC5vbihcImNsaWNrLmxlZ2VuZFwiLCBmdW5jdGlvbiAoZCkgeyBfLmQzX2NlbGxDbGljayhkaXNwYXRjaGVyLCBkLCB0aGlzKTsgfSk7XHJcbiAgfSxcclxuXHJcbiAgZDNfY2VsbE92ZXI6IGZ1bmN0aW9uKGNlbGxEaXNwYXRjaGVyLCBkLCBvYmope1xyXG4gICAgY2VsbERpc3BhdGNoZXIuY2VsbG92ZXIuY2FsbChvYmosIGQpO1xyXG4gIH0sXHJcblxyXG4gIGQzX2NlbGxPdXQ6IGZ1bmN0aW9uKGNlbGxEaXNwYXRjaGVyLCBkLCBvYmope1xyXG4gICAgY2VsbERpc3BhdGNoZXIuY2VsbG91dC5jYWxsKG9iaiwgZCk7XHJcbiAgfSxcclxuXHJcbiAgZDNfY2VsbENsaWNrOiBmdW5jdGlvbihjZWxsRGlzcGF0Y2hlciwgZCwgb2JqKXtcclxuICAgIGNlbGxEaXNwYXRjaGVyLmNlbGxjbGljay5jYWxsKG9iaiwgZCk7XHJcbiAgfSxcclxuXHJcbiAgZDNfdGl0bGU6IGZ1bmN0aW9uKHN2ZywgY2VsbHNTdmcsIHRpdGxlLCBjbGFzc1ByZWZpeCl7XHJcbiAgICBpZiAodGl0bGUgIT09IFwiXCIpe1xyXG5cclxuICAgICAgdmFyIHRpdGxlVGV4dCA9IHN2Zy5zZWxlY3RBbGwoJ3RleHQuJyArIGNsYXNzUHJlZml4ICsgJ2xlZ2VuZFRpdGxlJyk7XHJcblxyXG4gICAgICB0aXRsZVRleHQuZGF0YShbdGl0bGVdKVxyXG4gICAgICAgIC5lbnRlcigpXHJcbiAgICAgICAgLmFwcGVuZCgndGV4dCcpXHJcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgY2xhc3NQcmVmaXggKyAnbGVnZW5kVGl0bGUnKTtcclxuXHJcbiAgICAgICAgc3ZnLnNlbGVjdEFsbCgndGV4dC4nICsgY2xhc3NQcmVmaXggKyAnbGVnZW5kVGl0bGUnKVxyXG4gICAgICAgICAgICAudGV4dCh0aXRsZSlcclxuXHJcbiAgICAgIHZhciB5T2Zmc2V0ID0gc3ZnLnNlbGVjdCgnLicgKyBjbGFzc1ByZWZpeCArICdsZWdlbmRUaXRsZScpXHJcbiAgICAgICAgICAubWFwKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRbMF0uZ2V0QkJveCgpLmhlaWdodH0pWzBdLFxyXG4gICAgICB4T2Zmc2V0ID0gLWNlbGxzU3ZnLm1hcChmdW5jdGlvbihkKSB7IHJldHVybiBkWzBdLmdldEJCb3goKS54fSlbMF07XHJcblxyXG4gICAgICBjZWxsc1N2Zy5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyB4T2Zmc2V0ICsgJywnICsgKHlPZmZzZXQgKyAxMCkgKyAnKScpO1xyXG5cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwidmFyIGhlbHBlciA9IHJlcXVpcmUoJy4vbGVnZW5kJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9ICBmdW5jdGlvbigpe1xyXG5cclxuICB2YXIgc2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKSxcclxuICAgIHNoYXBlID0gXCJyZWN0XCIsXHJcbiAgICBzaGFwZVdpZHRoID0gMTUsXHJcbiAgICBzaGFwZVBhZGRpbmcgPSAyLFxyXG4gICAgY2VsbHMgPSBbNV0sXHJcbiAgICBsYWJlbHMgPSBbXSxcclxuICAgIHVzZVN0cm9rZSA9IGZhbHNlLFxyXG4gICAgY2xhc3NQcmVmaXggPSBcIlwiLFxyXG4gICAgdGl0bGUgPSBcIlwiLFxyXG4gICAgbGFiZWxGb3JtYXQgPSBkMy5mb3JtYXQoXCIuMDFmXCIpLFxyXG4gICAgbGFiZWxPZmZzZXQgPSAxMCxcclxuICAgIGxhYmVsQWxpZ24gPSBcIm1pZGRsZVwiLFxyXG4gICAgbGFiZWxEZWxpbWl0ZXIgPSBcInRvXCIsXHJcbiAgICBvcmllbnQgPSBcInZlcnRpY2FsXCIsXHJcbiAgICBhc2NlbmRpbmcgPSBmYWxzZSxcclxuICAgIHBhdGgsXHJcbiAgICBsZWdlbmREaXNwYXRjaGVyID0gZDMuZGlzcGF0Y2goXCJjZWxsb3ZlclwiLCBcImNlbGxvdXRcIiwgXCJjZWxsY2xpY2tcIik7XHJcblxyXG4gICAgZnVuY3Rpb24gbGVnZW5kKHN2Zyl7XHJcblxyXG4gICAgICB2YXIgdHlwZSA9IGhlbHBlci5kM19jYWxjVHlwZShzY2FsZSwgYXNjZW5kaW5nLCBjZWxscywgbGFiZWxzLCBsYWJlbEZvcm1hdCwgbGFiZWxEZWxpbWl0ZXIpLFxyXG4gICAgICAgIGxlZ2VuZEcgPSBzdmcuc2VsZWN0QWxsKCdnJykuZGF0YShbc2NhbGVdKTtcclxuXHJcbiAgICAgIGxlZ2VuZEcuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsIGNsYXNzUHJlZml4ICsgJ2xlZ2VuZENlbGxzJyk7XHJcblxyXG5cclxuICAgICAgdmFyIGNlbGwgPSBsZWdlbmRHLnNlbGVjdEFsbChcIi5cIiArIGNsYXNzUHJlZml4ICsgXCJjZWxsXCIpLmRhdGEodHlwZS5kYXRhKSxcclxuICAgICAgICBjZWxsRW50ZXIgPSBjZWxsLmVudGVyKCkuYXBwZW5kKFwiZ1wiLCBcIi5jZWxsXCIpLmF0dHIoXCJjbGFzc1wiLCBjbGFzc1ByZWZpeCArIFwiY2VsbFwiKS5zdHlsZShcIm9wYWNpdHlcIiwgMWUtNiksXHJcbiAgICAgICAgc2hhcGVFbnRlciA9IGNlbGxFbnRlci5hcHBlbmQoc2hhcGUpLmF0dHIoXCJjbGFzc1wiLCBjbGFzc1ByZWZpeCArIFwic3dhdGNoXCIpLFxyXG4gICAgICAgIHNoYXBlcyA9IGNlbGwuc2VsZWN0KFwiZy5cIiArIGNsYXNzUHJlZml4ICsgXCJjZWxsIFwiICsgc2hhcGUpO1xyXG5cclxuICAgICAgLy9hZGQgZXZlbnQgaGFuZGxlcnNcclxuICAgICAgaGVscGVyLmQzX2FkZEV2ZW50cyhjZWxsRW50ZXIsIGxlZ2VuZERpc3BhdGNoZXIpO1xyXG5cclxuICAgICAgY2VsbC5leGl0KCkudHJhbnNpdGlvbigpLnN0eWxlKFwib3BhY2l0eVwiLCAwKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgIC8vY3JlYXRlcyBzaGFwZVxyXG4gICAgICBpZiAoc2hhcGUgPT09IFwibGluZVwiKXtcclxuICAgICAgICBoZWxwZXIuZDNfZHJhd1NoYXBlcyhzaGFwZSwgc2hhcGVzLCAwLCBzaGFwZVdpZHRoKTtcclxuICAgICAgICBzaGFwZXMuYXR0cihcInN0cm9rZS13aWR0aFwiLCB0eXBlLmZlYXR1cmUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGhlbHBlci5kM19kcmF3U2hhcGVzKHNoYXBlLCBzaGFwZXMsIHR5cGUuZmVhdHVyZSwgdHlwZS5mZWF0dXJlLCB0eXBlLmZlYXR1cmUsIHBhdGgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBoZWxwZXIuZDNfYWRkVGV4dChsZWdlbmRHLCBjZWxsRW50ZXIsIHR5cGUubGFiZWxzLCBjbGFzc1ByZWZpeClcclxuXHJcbiAgICAgIC8vc2V0cyBwbGFjZW1lbnRcclxuICAgICAgdmFyIHRleHQgPSBjZWxsLnNlbGVjdChcInRleHRcIiksXHJcbiAgICAgICAgc2hhcGVTaXplID0gc2hhcGVzWzBdLm1hcChcclxuICAgICAgICAgIGZ1bmN0aW9uKGQsIGkpe1xyXG4gICAgICAgICAgICB2YXIgYmJveCA9IGQuZ2V0QkJveCgpXHJcbiAgICAgICAgICAgIHZhciBzdHJva2UgPSBzY2FsZSh0eXBlLmRhdGFbaV0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNoYXBlID09PSBcImxpbmVcIiAmJiBvcmllbnQgPT09IFwiaG9yaXpvbnRhbFwiKSB7XHJcbiAgICAgICAgICAgICAgYmJveC5oZWlnaHQgPSBiYm94LmhlaWdodCArIHN0cm9rZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzaGFwZSA9PT0gXCJsaW5lXCIgJiYgb3JpZW50ID09PSBcInZlcnRpY2FsXCIpe1xyXG4gICAgICAgICAgICAgIGJib3gud2lkdGggPSBiYm94LndpZHRoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYmJveDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIHZhciBtYXhIID0gZDMubWF4KHNoYXBlU2l6ZSwgZnVuY3Rpb24oZCl7IHJldHVybiBkLmhlaWdodCArIGQueTsgfSksXHJcbiAgICAgIG1heFcgPSBkMy5tYXgoc2hhcGVTaXplLCBmdW5jdGlvbihkKXsgcmV0dXJuIGQud2lkdGggKyBkLng7IH0pO1xyXG5cclxuICAgICAgdmFyIGNlbGxUcmFucyxcclxuICAgICAgdGV4dFRyYW5zLFxyXG4gICAgICB0ZXh0QWxpZ24gPSAobGFiZWxBbGlnbiA9PSBcInN0YXJ0XCIpID8gMCA6IChsYWJlbEFsaWduID09IFwibWlkZGxlXCIpID8gMC41IDogMTtcclxuXHJcbiAgICAgIC8vcG9zaXRpb25zIGNlbGxzIGFuZCB0ZXh0XHJcbiAgICAgIGlmIChvcmllbnQgPT09IFwidmVydGljYWxcIil7XHJcblxyXG4gICAgICAgIGNlbGxUcmFucyA9IGZ1bmN0aW9uKGQsaSkge1xyXG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gZDMuc3VtKHNoYXBlU2l6ZS5zbGljZSgwLCBpICsgMSApLCBmdW5jdGlvbihkKXsgcmV0dXJuIGQuaGVpZ2h0OyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKDAsIFwiICsgKGhlaWdodCArIGkqc2hhcGVQYWRkaW5nKSArIFwiKVwiOyB9O1xyXG5cclxuICAgICAgICB0ZXh0VHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKG1heFcgKyBsYWJlbE9mZnNldCkgKyBcIixcIiArXHJcbiAgICAgICAgICAoc2hhcGVTaXplW2ldLnkgKyBzaGFwZVNpemVbaV0uaGVpZ2h0LzIgKyA1KSArIFwiKVwiOyB9O1xyXG5cclxuICAgICAgfSBlbHNlIGlmIChvcmllbnQgPT09IFwiaG9yaXpvbnRhbFwiKXtcclxuICAgICAgICBjZWxsVHJhbnMgPSBmdW5jdGlvbihkLGkpIHtcclxuICAgICAgICAgICAgdmFyIHdpZHRoID0gZDMuc3VtKHNoYXBlU2l6ZS5zbGljZSgwLCBpICsgMSApLCBmdW5jdGlvbihkKXsgcmV0dXJuIGQud2lkdGg7IH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAod2lkdGggKyBpKnNoYXBlUGFkZGluZykgKyBcIiwwKVwiOyB9O1xyXG5cclxuICAgICAgICB0ZXh0VHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKHNoYXBlU2l6ZVtpXS53aWR0aCp0ZXh0QWxpZ24gICsgc2hhcGVTaXplW2ldLngpICsgXCIsXCIgK1xyXG4gICAgICAgICAgICAgIChtYXhIICsgbGFiZWxPZmZzZXQgKSArIFwiKVwiOyB9O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBoZWxwZXIuZDNfcGxhY2VtZW50KG9yaWVudCwgY2VsbCwgY2VsbFRyYW5zLCB0ZXh0LCB0ZXh0VHJhbnMsIGxhYmVsQWxpZ24pO1xyXG4gICAgICBoZWxwZXIuZDNfdGl0bGUoc3ZnLCBsZWdlbmRHLCB0aXRsZSwgY2xhc3NQcmVmaXgpO1xyXG5cclxuICAgICAgY2VsbC50cmFuc2l0aW9uKCkuc3R5bGUoXCJvcGFjaXR5XCIsIDEpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgbGVnZW5kLnNjYWxlID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2NhbGU7XHJcbiAgICBzY2FsZSA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5jZWxscyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGNlbGxzO1xyXG4gICAgaWYgKF8ubGVuZ3RoID4gMSB8fCBfID49IDIgKXtcclxuICAgICAgY2VsbHMgPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuXHJcbiAgbGVnZW5kLnNoYXBlID0gZnVuY3Rpb24oXywgZCkge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGU7XHJcbiAgICBpZiAoXyA9PSBcInJlY3RcIiB8fCBfID09IFwiY2lyY2xlXCIgfHwgXyA9PSBcImxpbmVcIiApe1xyXG4gICAgICBzaGFwZSA9IF87XHJcbiAgICAgIHBhdGggPSBkO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuc2hhcGVXaWR0aCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlV2lkdGg7XHJcbiAgICBzaGFwZVdpZHRoID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5zaGFwZVBhZGRpbmcgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZVBhZGRpbmc7XHJcbiAgICBzaGFwZVBhZGRpbmcgPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVscyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVscztcclxuICAgIGxhYmVscyA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbEFsaWduID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxBbGlnbjtcclxuICAgIGlmIChfID09IFwic3RhcnRcIiB8fCBfID09IFwiZW5kXCIgfHwgXyA9PSBcIm1pZGRsZVwiKSB7XHJcbiAgICAgIGxhYmVsQWxpZ24gPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxGb3JtYXQgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbEZvcm1hdDtcclxuICAgIGxhYmVsRm9ybWF0ID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsT2Zmc2V0ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxPZmZzZXQ7XHJcbiAgICBsYWJlbE9mZnNldCA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxEZWxpbWl0ZXIgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbERlbGltaXRlcjtcclxuICAgIGxhYmVsRGVsaW1pdGVyID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLm9yaWVudCA9IGZ1bmN0aW9uKF8pe1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gb3JpZW50O1xyXG4gICAgXyA9IF8udG9Mb3dlckNhc2UoKTtcclxuICAgIGlmIChfID09IFwiaG9yaXpvbnRhbFwiIHx8IF8gPT0gXCJ2ZXJ0aWNhbFwiKSB7XHJcbiAgICAgIG9yaWVudCA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5hc2NlbmRpbmcgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBhc2NlbmRpbmc7XHJcbiAgICBhc2NlbmRpbmcgPSAhIV87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5jbGFzc1ByZWZpeCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGNsYXNzUHJlZml4O1xyXG4gICAgY2xhc3NQcmVmaXggPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQudGl0bGUgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB0aXRsZTtcclxuICAgIHRpdGxlID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgZDMucmViaW5kKGxlZ2VuZCwgbGVnZW5kRGlzcGF0Y2hlciwgXCJvblwiKTtcclxuXHJcbiAgcmV0dXJuIGxlZ2VuZDtcclxuXHJcbn07XHJcbiIsInZhciBoZWxwZXIgPSByZXF1aXJlKCcuL2xlZ2VuZCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xyXG5cclxuICB2YXIgc2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKSxcclxuICAgIHNoYXBlID0gXCJwYXRoXCIsXHJcbiAgICBzaGFwZVdpZHRoID0gMTUsXHJcbiAgICBzaGFwZUhlaWdodCA9IDE1LFxyXG4gICAgc2hhcGVSYWRpdXMgPSAxMCxcclxuICAgIHNoYXBlUGFkZGluZyA9IDUsXHJcbiAgICBjZWxscyA9IFs1XSxcclxuICAgIGxhYmVscyA9IFtdLFxyXG4gICAgY2xhc3NQcmVmaXggPSBcIlwiLFxyXG4gICAgdXNlQ2xhc3MgPSBmYWxzZSxcclxuICAgIHRpdGxlID0gXCJcIixcclxuICAgIGxhYmVsRm9ybWF0ID0gZDMuZm9ybWF0KFwiLjAxZlwiKSxcclxuICAgIGxhYmVsQWxpZ24gPSBcIm1pZGRsZVwiLFxyXG4gICAgbGFiZWxPZmZzZXQgPSAxMCxcclxuICAgIGxhYmVsRGVsaW1pdGVyID0gXCJ0b1wiLFxyXG4gICAgb3JpZW50ID0gXCJ2ZXJ0aWNhbFwiLFxyXG4gICAgYXNjZW5kaW5nID0gZmFsc2UsXHJcbiAgICBsZWdlbmREaXNwYXRjaGVyID0gZDMuZGlzcGF0Y2goXCJjZWxsb3ZlclwiLCBcImNlbGxvdXRcIiwgXCJjZWxsY2xpY2tcIik7XHJcblxyXG4gICAgZnVuY3Rpb24gbGVnZW5kKHN2Zyl7XHJcblxyXG4gICAgICB2YXIgdHlwZSA9IGhlbHBlci5kM19jYWxjVHlwZShzY2FsZSwgYXNjZW5kaW5nLCBjZWxscywgbGFiZWxzLCBsYWJlbEZvcm1hdCwgbGFiZWxEZWxpbWl0ZXIpLFxyXG4gICAgICAgIGxlZ2VuZEcgPSBzdmcuc2VsZWN0QWxsKCdnJykuZGF0YShbc2NhbGVdKTtcclxuXHJcbiAgICAgIGxlZ2VuZEcuZW50ZXIoKS5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsIGNsYXNzUHJlZml4ICsgJ2xlZ2VuZENlbGxzJyk7XHJcblxyXG4gICAgICB2YXIgY2VsbCA9IGxlZ2VuZEcuc2VsZWN0QWxsKFwiLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGxcIikuZGF0YSh0eXBlLmRhdGEpLFxyXG4gICAgICAgIGNlbGxFbnRlciA9IGNlbGwuZW50ZXIoKS5hcHBlbmQoXCJnXCIsIFwiLmNlbGxcIikuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJjZWxsXCIpLnN0eWxlKFwib3BhY2l0eVwiLCAxZS02KSxcclxuICAgICAgICBzaGFwZUVudGVyID0gY2VsbEVudGVyLmFwcGVuZChzaGFwZSkuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJzd2F0Y2hcIiksXHJcbiAgICAgICAgc2hhcGVzID0gY2VsbC5zZWxlY3QoXCJnLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGwgXCIgKyBzaGFwZSk7XHJcblxyXG4gICAgICAvL2FkZCBldmVudCBoYW5kbGVyc1xyXG4gICAgICBoZWxwZXIuZDNfYWRkRXZlbnRzKGNlbGxFbnRlciwgbGVnZW5kRGlzcGF0Y2hlcik7XHJcblxyXG4gICAgICAvL3JlbW92ZSBvbGQgc2hhcGVzXHJcbiAgICAgIGNlbGwuZXhpdCgpLnRyYW5zaXRpb24oKS5zdHlsZShcIm9wYWNpdHlcIiwgMCkucmVtb3ZlKCk7XHJcblxyXG4gICAgICBoZWxwZXIuZDNfZHJhd1NoYXBlcyhzaGFwZSwgc2hhcGVzLCBzaGFwZUhlaWdodCwgc2hhcGVXaWR0aCwgc2hhcGVSYWRpdXMsIHR5cGUuZmVhdHVyZSk7XHJcbiAgICAgIGhlbHBlci5kM19hZGRUZXh0KGxlZ2VuZEcsIGNlbGxFbnRlciwgdHlwZS5sYWJlbHMsIGNsYXNzUHJlZml4KVxyXG5cclxuICAgICAgLy8gc2V0cyBwbGFjZW1lbnRcclxuICAgICAgdmFyIHRleHQgPSBjZWxsLnNlbGVjdChcInRleHRcIiksXHJcbiAgICAgICAgc2hhcGVTaXplID0gc2hhcGVzWzBdLm1hcCggZnVuY3Rpb24oZCl7IHJldHVybiBkLmdldEJCb3goKTsgfSk7XHJcblxyXG4gICAgICB2YXIgbWF4SCA9IGQzLm1heChzaGFwZVNpemUsIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC5oZWlnaHQ7IH0pLFxyXG4gICAgICBtYXhXID0gZDMubWF4KHNoYXBlU2l6ZSwgZnVuY3Rpb24oZCl7IHJldHVybiBkLndpZHRoOyB9KTtcclxuXHJcbiAgICAgIHZhciBjZWxsVHJhbnMsXHJcbiAgICAgIHRleHRUcmFucyxcclxuICAgICAgdGV4dEFsaWduID0gKGxhYmVsQWxpZ24gPT0gXCJzdGFydFwiKSA/IDAgOiAobGFiZWxBbGlnbiA9PSBcIm1pZGRsZVwiKSA/IDAuNSA6IDE7XHJcblxyXG4gICAgICAvL3Bvc2l0aW9ucyBjZWxscyBhbmQgdGV4dFxyXG4gICAgICBpZiAob3JpZW50ID09PSBcInZlcnRpY2FsXCIpe1xyXG4gICAgICAgIGNlbGxUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoMCwgXCIgKyAoaSAqIChtYXhIICsgc2hhcGVQYWRkaW5nKSkgKyBcIilcIjsgfTtcclxuICAgICAgICB0ZXh0VHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKG1heFcgKyBsYWJlbE9mZnNldCkgKyBcIixcIiArXHJcbiAgICAgICAgICAgICAgKHNoYXBlU2l6ZVtpXS55ICsgc2hhcGVTaXplW2ldLmhlaWdodC8yICsgNSkgKyBcIilcIjsgfTtcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAob3JpZW50ID09PSBcImhvcml6b250YWxcIil7XHJcbiAgICAgICAgY2VsbFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIChpICogKG1heFcgKyBzaGFwZVBhZGRpbmcpKSArIFwiLDApXCI7IH07XHJcbiAgICAgICAgdGV4dFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIChzaGFwZVNpemVbaV0ud2lkdGgqdGV4dEFsaWduICArIHNoYXBlU2l6ZVtpXS54KSArIFwiLFwiICtcclxuICAgICAgICAgICAgICAobWF4SCArIGxhYmVsT2Zmc2V0ICkgKyBcIilcIjsgfTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaGVscGVyLmQzX3BsYWNlbWVudChvcmllbnQsIGNlbGwsIGNlbGxUcmFucywgdGV4dCwgdGV4dFRyYW5zLCBsYWJlbEFsaWduKTtcclxuICAgICAgaGVscGVyLmQzX3RpdGxlKHN2ZywgbGVnZW5kRywgdGl0bGUsIGNsYXNzUHJlZml4KTtcclxuICAgICAgY2VsbC50cmFuc2l0aW9uKCkuc3R5bGUoXCJvcGFjaXR5XCIsIDEpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gIGxlZ2VuZC5zY2FsZSA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNjYWxlO1xyXG4gICAgc2NhbGUgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuY2VsbHMgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBjZWxscztcclxuICAgIGlmIChfLmxlbmd0aCA+IDEgfHwgXyA+PSAyICl7XHJcbiAgICAgIGNlbGxzID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlUGFkZGluZyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlUGFkZGluZztcclxuICAgIHNoYXBlUGFkZGluZyA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxzID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxzO1xyXG4gICAgbGFiZWxzID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsQWxpZ24gPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbEFsaWduO1xyXG4gICAgaWYgKF8gPT0gXCJzdGFydFwiIHx8IF8gPT0gXCJlbmRcIiB8fCBfID09IFwibWlkZGxlXCIpIHtcclxuICAgICAgbGFiZWxBbGlnbiA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbEZvcm1hdCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsRm9ybWF0O1xyXG4gICAgbGFiZWxGb3JtYXQgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxPZmZzZXQgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbE9mZnNldDtcclxuICAgIGxhYmVsT2Zmc2V0ID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbERlbGltaXRlciA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsRGVsaW1pdGVyO1xyXG4gICAgbGFiZWxEZWxpbWl0ZXIgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQub3JpZW50ID0gZnVuY3Rpb24oXyl7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBvcmllbnQ7XHJcbiAgICBfID0gXy50b0xvd2VyQ2FzZSgpO1xyXG4gICAgaWYgKF8gPT0gXCJob3Jpem9udGFsXCIgfHwgXyA9PSBcInZlcnRpY2FsXCIpIHtcclxuICAgICAgb3JpZW50ID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmFzY2VuZGluZyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGFzY2VuZGluZztcclxuICAgIGFzY2VuZGluZyA9ICEhXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmNsYXNzUHJlZml4ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY2xhc3NQcmVmaXg7XHJcbiAgICBjbGFzc1ByZWZpeCA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC50aXRsZSA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHRpdGxlO1xyXG4gICAgdGl0bGUgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBkMy5yZWJpbmQobGVnZW5kLCBsZWdlbmREaXNwYXRjaGVyLCBcIm9uXCIpO1xyXG5cclxuICByZXR1cm4gbGVnZW5kO1xyXG5cclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxuLyoqXHJcbiAqICoqW0dhdXNzaWFuIGVycm9yIGZ1bmN0aW9uXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Vycm9yX2Z1bmN0aW9uKSoqXHJcbiAqXHJcbiAqIFRoZSBgZXJyb3JGdW5jdGlvbih4LyhzZCAqIE1hdGguc3FydCgyKSkpYCBpcyB0aGUgcHJvYmFiaWxpdHkgdGhhdCBhIHZhbHVlIGluIGFcclxuICogbm9ybWFsIGRpc3RyaWJ1dGlvbiB3aXRoIHN0YW5kYXJkIGRldmlhdGlvbiBzZCBpcyB3aXRoaW4geCBvZiB0aGUgbWVhbi5cclxuICpcclxuICogVGhpcyBmdW5jdGlvbiByZXR1cm5zIGEgbnVtZXJpY2FsIGFwcHJveGltYXRpb24gdG8gdGhlIGV4YWN0IHZhbHVlLlxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0geCBpbnB1dFxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IGVycm9yIGVzdGltYXRpb25cclxuICogQGV4YW1wbGVcclxuICogZXJyb3JGdW5jdGlvbigxKTsgLy89IDAuODQyN1xyXG4gKi9cclxuZnVuY3Rpb24gZXJyb3JGdW5jdGlvbih4Lyo6IG51bWJlciAqLykvKjogbnVtYmVyICovIHtcclxuICAgIHZhciB0ID0gMSAvICgxICsgMC41ICogTWF0aC5hYnMoeCkpO1xyXG4gICAgdmFyIHRhdSA9IHQgKiBNYXRoLmV4cCgtTWF0aC5wb3coeCwgMikgLVxyXG4gICAgICAgIDEuMjY1NTEyMjMgK1xyXG4gICAgICAgIDEuMDAwMDIzNjggKiB0ICtcclxuICAgICAgICAwLjM3NDA5MTk2ICogTWF0aC5wb3codCwgMikgK1xyXG4gICAgICAgIDAuMDk2Nzg0MTggKiBNYXRoLnBvdyh0LCAzKSAtXHJcbiAgICAgICAgMC4xODYyODgwNiAqIE1hdGgucG93KHQsIDQpICtcclxuICAgICAgICAwLjI3ODg2ODA3ICogTWF0aC5wb3codCwgNSkgLVxyXG4gICAgICAgIDEuMTM1MjAzOTggKiBNYXRoLnBvdyh0LCA2KSArXHJcbiAgICAgICAgMS40ODg1MTU4NyAqIE1hdGgucG93KHQsIDcpIC1cclxuICAgICAgICAwLjgyMjE1MjIzICogTWF0aC5wb3codCwgOCkgK1xyXG4gICAgICAgIDAuMTcwODcyNzcgKiBNYXRoLnBvdyh0LCA5KSk7XHJcbiAgICBpZiAoeCA+PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIDEgLSB0YXU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB0YXUgLSAxO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVycm9yRnVuY3Rpb247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbi8qKlxyXG4gKiBbU2ltcGxlIGxpbmVhciByZWdyZXNzaW9uXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1NpbXBsZV9saW5lYXJfcmVncmVzc2lvbilcclxuICogaXMgYSBzaW1wbGUgd2F5IHRvIGZpbmQgYSBmaXR0ZWQgbGluZVxyXG4gKiBiZXR3ZWVuIGEgc2V0IG9mIGNvb3JkaW5hdGVzLiBUaGlzIGFsZ29yaXRobSBmaW5kcyB0aGUgc2xvcGUgYW5kIHktaW50ZXJjZXB0IG9mIGEgcmVncmVzc2lvbiBsaW5lXHJcbiAqIHVzaW5nIHRoZSBsZWFzdCBzdW0gb2Ygc3F1YXJlcy5cclxuICpcclxuICogQHBhcmFtIHtBcnJheTxBcnJheTxudW1iZXI+Pn0gZGF0YSBhbiBhcnJheSBvZiB0d28tZWxlbWVudCBvZiBhcnJheXMsXHJcbiAqIGxpa2UgYFtbMCwgMV0sIFsyLCAzXV1gXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IG9iamVjdCBjb250YWluaW5nIHNsb3BlIGFuZCBpbnRlcnNlY3Qgb2YgcmVncmVzc2lvbiBsaW5lXHJcbiAqIEBleGFtcGxlXHJcbiAqIGxpbmVhclJlZ3Jlc3Npb24oW1swLCAwXSwgWzEsIDFdXSk7IC8vIHsgbTogMSwgYjogMCB9XHJcbiAqL1xyXG5mdW5jdGlvbiBsaW5lYXJSZWdyZXNzaW9uKGRhdGEvKjogQXJyYXk8QXJyYXk8bnVtYmVyPj4gKi8pLyo6IHsgbTogbnVtYmVyLCBiOiBudW1iZXIgfSAqLyB7XHJcblxyXG4gICAgdmFyIG0sIGI7XHJcblxyXG4gICAgLy8gU3RvcmUgZGF0YSBsZW5ndGggaW4gYSBsb2NhbCB2YXJpYWJsZSB0byByZWR1Y2VcclxuICAgIC8vIHJlcGVhdGVkIG9iamVjdCBwcm9wZXJ0eSBsb29rdXBzXHJcbiAgICB2YXIgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoO1xyXG5cclxuICAgIC8vaWYgdGhlcmUncyBvbmx5IG9uZSBwb2ludCwgYXJiaXRyYXJpbHkgY2hvb3NlIGEgc2xvcGUgb2YgMFxyXG4gICAgLy9hbmQgYSB5LWludGVyY2VwdCBvZiB3aGF0ZXZlciB0aGUgeSBvZiB0aGUgaW5pdGlhbCBwb2ludCBpc1xyXG4gICAgaWYgKGRhdGFMZW5ndGggPT09IDEpIHtcclxuICAgICAgICBtID0gMDtcclxuICAgICAgICBiID0gZGF0YVswXVsxXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gSW5pdGlhbGl6ZSBvdXIgc3VtcyBhbmQgc2NvcGUgdGhlIGBtYCBhbmQgYGJgXHJcbiAgICAgICAgLy8gdmFyaWFibGVzIHRoYXQgZGVmaW5lIHRoZSBsaW5lLlxyXG4gICAgICAgIHZhciBzdW1YID0gMCwgc3VtWSA9IDAsXHJcbiAgICAgICAgICAgIHN1bVhYID0gMCwgc3VtWFkgPSAwO1xyXG5cclxuICAgICAgICAvLyBVc2UgbG9jYWwgdmFyaWFibGVzIHRvIGdyYWIgcG9pbnQgdmFsdWVzXHJcbiAgICAgICAgLy8gd2l0aCBtaW5pbWFsIG9iamVjdCBwcm9wZXJ0eSBsb29rdXBzXHJcbiAgICAgICAgdmFyIHBvaW50LCB4LCB5O1xyXG5cclxuICAgICAgICAvLyBHYXRoZXIgdGhlIHN1bSBvZiBhbGwgeCB2YWx1ZXMsIHRoZSBzdW0gb2YgYWxsXHJcbiAgICAgICAgLy8geSB2YWx1ZXMsIGFuZCB0aGUgc3VtIG9mIHheMiBhbmQgKHgqeSkgZm9yIGVhY2hcclxuICAgICAgICAvLyB2YWx1ZS5cclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIEluIG1hdGggbm90YXRpb24sIHRoZXNlIHdvdWxkIGJlIFNTX3gsIFNTX3ksIFNTX3h4LCBhbmQgU1NfeHlcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGFMZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBwb2ludCA9IGRhdGFbaV07XHJcbiAgICAgICAgICAgIHggPSBwb2ludFswXTtcclxuICAgICAgICAgICAgeSA9IHBvaW50WzFdO1xyXG5cclxuICAgICAgICAgICAgc3VtWCArPSB4O1xyXG4gICAgICAgICAgICBzdW1ZICs9IHk7XHJcblxyXG4gICAgICAgICAgICBzdW1YWCArPSB4ICogeDtcclxuICAgICAgICAgICAgc3VtWFkgKz0geCAqIHk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBgbWAgaXMgdGhlIHNsb3BlIG9mIHRoZSByZWdyZXNzaW9uIGxpbmVcclxuICAgICAgICBtID0gKChkYXRhTGVuZ3RoICogc3VtWFkpIC0gKHN1bVggKiBzdW1ZKSkgL1xyXG4gICAgICAgICAgICAoKGRhdGFMZW5ndGggKiBzdW1YWCkgLSAoc3VtWCAqIHN1bVgpKTtcclxuXHJcbiAgICAgICAgLy8gYGJgIGlzIHRoZSB5LWludGVyY2VwdCBvZiB0aGUgbGluZS5cclxuICAgICAgICBiID0gKHN1bVkgLyBkYXRhTGVuZ3RoKSAtICgobSAqIHN1bVgpIC8gZGF0YUxlbmd0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmV0dXJuIGJvdGggdmFsdWVzIGFzIGFuIG9iamVjdC5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbTogbSxcclxuICAgICAgICBiOiBiXHJcbiAgICB9O1xyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsaW5lYXJSZWdyZXNzaW9uO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG4vKipcclxuICogR2l2ZW4gdGhlIG91dHB1dCBvZiBgbGluZWFyUmVncmVzc2lvbmA6IGFuIG9iamVjdFxyXG4gKiB3aXRoIGBtYCBhbmQgYGJgIHZhbHVlcyBpbmRpY2F0aW5nIHNsb3BlIGFuZCBpbnRlcmNlcHQsXHJcbiAqIHJlc3BlY3RpdmVseSwgZ2VuZXJhdGUgYSBsaW5lIGZ1bmN0aW9uIHRoYXQgdHJhbnNsYXRlc1xyXG4gKiB4IHZhbHVlcyBpbnRvIHkgdmFsdWVzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge09iamVjdH0gbWIgb2JqZWN0IHdpdGggYG1gIGFuZCBgYmAgbWVtYmVycywgcmVwcmVzZW50aW5nXHJcbiAqIHNsb3BlIGFuZCBpbnRlcnNlY3Qgb2YgZGVzaXJlZCBsaW5lXHJcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gbWV0aG9kIHRoYXQgY29tcHV0ZXMgeS12YWx1ZSBhdCBhbnkgZ2l2ZW5cclxuICogeC12YWx1ZSBvbiB0aGUgbGluZS5cclxuICogQGV4YW1wbGVcclxuICogdmFyIGwgPSBsaW5lYXJSZWdyZXNzaW9uTGluZShsaW5lYXJSZWdyZXNzaW9uKFtbMCwgMF0sIFsxLCAxXV0pKTtcclxuICogbCgwKSAvLz0gMFxyXG4gKiBsKDIpIC8vPSAyXHJcbiAqL1xyXG5mdW5jdGlvbiBsaW5lYXJSZWdyZXNzaW9uTGluZShtYi8qOiB7IGI6IG51bWJlciwgbTogbnVtYmVyIH0qLykvKjogRnVuY3Rpb24gKi8ge1xyXG4gICAgLy8gUmV0dXJuIGEgZnVuY3Rpb24gdGhhdCBjb21wdXRlcyBhIGB5YCB2YWx1ZSBmb3IgZWFjaFxyXG4gICAgLy8geCB2YWx1ZSBpdCBpcyBnaXZlbiwgYmFzZWQgb24gdGhlIHZhbHVlcyBvZiBgYmAgYW5kIGBhYFxyXG4gICAgLy8gdGhhdCB3ZSBqdXN0IGNvbXB1dGVkLlxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHgpIHtcclxuICAgICAgICByZXR1cm4gbWIuYiArIChtYi5tICogeCk7XHJcbiAgICB9O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxpbmVhclJlZ3Jlc3Npb25MaW5lO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgc3VtID0gcmVxdWlyZSgnLi9zdW0nKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgbWVhbiwgX2Fsc28ga25vd24gYXMgYXZlcmFnZV8sXHJcbiAqIGlzIHRoZSBzdW0gb2YgYWxsIHZhbHVlcyBvdmVyIHRoZSBudW1iZXIgb2YgdmFsdWVzLlxyXG4gKiBUaGlzIGlzIGEgW21lYXN1cmUgb2YgY2VudHJhbCB0ZW5kZW5jeV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ2VudHJhbF90ZW5kZW5jeSk6XHJcbiAqIGEgbWV0aG9kIG9mIGZpbmRpbmcgYSB0eXBpY2FsIG9yIGNlbnRyYWwgdmFsdWUgb2YgYSBzZXQgb2YgbnVtYmVycy5cclxuICpcclxuICogVGhpcyBydW5zIG9uIGBPKG4pYCwgbGluZWFyIHRpbWUgaW4gcmVzcGVjdCB0byB0aGUgYXJyYXlcclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGlucHV0IHZhbHVlc1xyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBtZWFuXHJcbiAqIEBleGFtcGxlXHJcbiAqIGNvbnNvbGUubG9nKG1lYW4oWzAsIDEwXSkpOyAvLyA1XHJcbiAqL1xyXG5mdW5jdGlvbiBtZWFuKHggLyo6IEFycmF5PG51bWJlcj4gKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgLy8gVGhlIG1lYW4gb2Ygbm8gbnVtYmVycyBpcyBudWxsXHJcbiAgICBpZiAoeC5sZW5ndGggPT09IDApIHsgcmV0dXJuIE5hTjsgfVxyXG5cclxuICAgIHJldHVybiBzdW0oeCkgLyB4Lmxlbmd0aDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtZWFuO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgcXVhbnRpbGVTb3J0ZWQgPSByZXF1aXJlKCcuL3F1YW50aWxlX3NvcnRlZCcpO1xyXG52YXIgcXVpY2tzZWxlY3QgPSByZXF1aXJlKCcuL3F1aWNrc2VsZWN0Jyk7XHJcblxyXG4vKipcclxuICogVGhlIFtxdWFudGlsZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvUXVhbnRpbGUpOlxyXG4gKiB0aGlzIGlzIGEgcG9wdWxhdGlvbiBxdWFudGlsZSwgc2luY2Ugd2UgYXNzdW1lIHRvIGtub3cgdGhlIGVudGlyZVxyXG4gKiBkYXRhc2V0IGluIHRoaXMgbGlicmFyeS4gVGhpcyBpcyBhbiBpbXBsZW1lbnRhdGlvbiBvZiB0aGVcclxuICogW1F1YW50aWxlcyBvZiBhIFBvcHVsYXRpb25dKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvUXVhbnRpbGUjUXVhbnRpbGVzX29mX2FfcG9wdWxhdGlvbilcclxuICogYWxnb3JpdGhtIGZyb20gd2lraXBlZGlhLlxyXG4gKlxyXG4gKiBTYW1wbGUgaXMgYSBvbmUtZGltZW5zaW9uYWwgYXJyYXkgb2YgbnVtYmVycyxcclxuICogYW5kIHAgaXMgZWl0aGVyIGEgZGVjaW1hbCBudW1iZXIgZnJvbSAwIHRvIDEgb3IgYW4gYXJyYXkgb2YgZGVjaW1hbFxyXG4gKiBudW1iZXJzIGZyb20gMCB0byAxLlxyXG4gKiBJbiB0ZXJtcyBvZiBhIGsvcSBxdWFudGlsZSwgcCA9IGsvcSAtIGl0J3MganVzdCBkZWFsaW5nIHdpdGggZnJhY3Rpb25zIG9yIGRlYWxpbmdcclxuICogd2l0aCBkZWNpbWFsIHZhbHVlcy5cclxuICogV2hlbiBwIGlzIGFuIGFycmF5LCB0aGUgcmVzdWx0IG9mIHRoZSBmdW5jdGlvbiBpcyBhbHNvIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGFwcHJvcHJpYXRlXHJcbiAqIHF1YW50aWxlcyBpbiBpbnB1dCBvcmRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHNhbXBsZSBhIHNhbXBsZSBmcm9tIHRoZSBwb3B1bGF0aW9uXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBwIHRoZSBkZXNpcmVkIHF1YW50aWxlLCBhcyBhIG51bWJlciBiZXR3ZWVuIDAgYW5kIDFcclxuICogQHJldHVybnMge251bWJlcn0gcXVhbnRpbGVcclxuICogQGV4YW1wbGVcclxuICogdmFyIGRhdGEgPSBbMywgNiwgNywgOCwgOCwgOSwgMTAsIDEzLCAxNSwgMTYsIDIwXTtcclxuICogcXVhbnRpbGUoZGF0YSwgMSk7IC8vPSBtYXgoZGF0YSk7XHJcbiAqIHF1YW50aWxlKGRhdGEsIDApOyAvLz0gbWluKGRhdGEpO1xyXG4gKiBxdWFudGlsZShkYXRhLCAwLjUpOyAvLz0gOVxyXG4gKi9cclxuZnVuY3Rpb24gcXVhbnRpbGUoc2FtcGxlIC8qOiBBcnJheTxudW1iZXI+ICovLCBwIC8qOiBBcnJheTxudW1iZXI+IHwgbnVtYmVyICovKSB7XHJcbiAgICB2YXIgY29weSA9IHNhbXBsZS5zbGljZSgpO1xyXG5cclxuICAgIGlmIChBcnJheS5pc0FycmF5KHApKSB7XHJcbiAgICAgICAgLy8gcmVhcnJhbmdlIGVsZW1lbnRzIHNvIHRoYXQgZWFjaCBlbGVtZW50IGNvcnJlc3BvbmRpbmcgdG8gYSByZXF1ZXN0ZWRcclxuICAgICAgICAvLyBxdWFudGlsZSBpcyBvbiBhIHBsYWNlIGl0IHdvdWxkIGJlIGlmIHRoZSBhcnJheSB3YXMgZnVsbHkgc29ydGVkXHJcbiAgICAgICAgbXVsdGlRdWFudGlsZVNlbGVjdChjb3B5LCBwKTtcclxuICAgICAgICAvLyBJbml0aWFsaXplIHRoZSByZXN1bHQgYXJyYXlcclxuICAgICAgICB2YXIgcmVzdWx0cyA9IFtdO1xyXG4gICAgICAgIC8vIEZvciBlYWNoIHJlcXVlc3RlZCBxdWFudGlsZVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICByZXN1bHRzW2ldID0gcXVhbnRpbGVTb3J0ZWQoY29weSwgcFtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHRzO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgaWR4ID0gcXVhbnRpbGVJbmRleChjb3B5Lmxlbmd0aCwgcCk7XHJcbiAgICAgICAgcXVhbnRpbGVTZWxlY3QoY29weSwgaWR4LCAwLCBjb3B5Lmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIHJldHVybiBxdWFudGlsZVNvcnRlZChjb3B5LCBwKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcXVhbnRpbGVTZWxlY3QoYXJyLCBrLCBsZWZ0LCByaWdodCkge1xyXG4gICAgaWYgKGsgJSAxID09PSAwKSB7XHJcbiAgICAgICAgcXVpY2tzZWxlY3QoYXJyLCBrLCBsZWZ0LCByaWdodCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGsgPSBNYXRoLmZsb29yKGspO1xyXG4gICAgICAgIHF1aWNrc2VsZWN0KGFyciwgaywgbGVmdCwgcmlnaHQpO1xyXG4gICAgICAgIHF1aWNrc2VsZWN0KGFyciwgayArIDEsIGsgKyAxLCByaWdodCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG11bHRpUXVhbnRpbGVTZWxlY3QoYXJyLCBwKSB7XHJcbiAgICB2YXIgaW5kaWNlcyA9IFswXTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGluZGljZXMucHVzaChxdWFudGlsZUluZGV4KGFyci5sZW5ndGgsIHBbaV0pKTtcclxuICAgIH1cclxuICAgIGluZGljZXMucHVzaChhcnIubGVuZ3RoIC0gMSk7XHJcbiAgICBpbmRpY2VzLnNvcnQoY29tcGFyZSk7XHJcblxyXG4gICAgdmFyIHN0YWNrID0gWzAsIGluZGljZXMubGVuZ3RoIC0gMV07XHJcblxyXG4gICAgd2hpbGUgKHN0YWNrLmxlbmd0aCkge1xyXG4gICAgICAgIHZhciByID0gTWF0aC5jZWlsKHN0YWNrLnBvcCgpKTtcclxuICAgICAgICB2YXIgbCA9IE1hdGguZmxvb3Ioc3RhY2sucG9wKCkpO1xyXG4gICAgICAgIGlmIChyIC0gbCA8PSAxKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgdmFyIG0gPSBNYXRoLmZsb29yKChsICsgcikgLyAyKTtcclxuICAgICAgICBxdWFudGlsZVNlbGVjdChhcnIsIGluZGljZXNbbV0sIGluZGljZXNbbF0sIGluZGljZXNbcl0pO1xyXG5cclxuICAgICAgICBzdGFjay5wdXNoKGwsIG0sIG0sIHIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjb21wYXJlKGEsIGIpIHtcclxuICAgIHJldHVybiBhIC0gYjtcclxufVxyXG5cclxuZnVuY3Rpb24gcXVhbnRpbGVJbmRleChsZW4gLyo6IG51bWJlciAqLywgcCAvKjogbnVtYmVyICovKS8qOm51bWJlciovIHtcclxuICAgIHZhciBpZHggPSBsZW4gKiBwO1xyXG4gICAgaWYgKHAgPT09IDEpIHtcclxuICAgICAgICAvLyBJZiBwIGlzIDEsIGRpcmVjdGx5IHJldHVybiB0aGUgbGFzdCBpbmRleFxyXG4gICAgICAgIHJldHVybiBsZW4gLSAxO1xyXG4gICAgfSBlbHNlIGlmIChwID09PSAwKSB7XHJcbiAgICAgICAgLy8gSWYgcCBpcyAwLCBkaXJlY3RseSByZXR1cm4gdGhlIGZpcnN0IGluZGV4XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9IGVsc2UgaWYgKGlkeCAlIDEgIT09IDApIHtcclxuICAgICAgICAvLyBJZiBpbmRleCBpcyBub3QgaW50ZWdlciwgcmV0dXJuIHRoZSBuZXh0IGluZGV4IGluIGFycmF5XHJcbiAgICAgICAgcmV0dXJuIE1hdGguY2VpbChpZHgpIC0gMTtcclxuICAgIH0gZWxzZSBpZiAobGVuICUgMiA9PT0gMCkge1xyXG4gICAgICAgIC8vIElmIHRoZSBsaXN0IGhhcyBldmVuLWxlbmd0aCwgd2UnbGwgcmV0dXJuIHRoZSBtaWRkbGUgb2YgdHdvIGluZGljZXNcclxuICAgICAgICAvLyBhcm91bmQgcXVhbnRpbGUgdG8gaW5kaWNhdGUgdGhhdCB3ZSBuZWVkIGFuIGF2ZXJhZ2UgdmFsdWUgb2YgdGhlIHR3b1xyXG4gICAgICAgIHJldHVybiBpZHggLSAwLjU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIEZpbmFsbHksIGluIHRoZSBzaW1wbGUgY2FzZSBvZiBhbiBpbnRlZ2VyIGluZGV4XHJcbiAgICAgICAgLy8gd2l0aCBhbiBvZGQtbGVuZ3RoIGxpc3QsIHJldHVybiB0aGUgaW5kZXhcclxuICAgICAgICByZXR1cm4gaWR4O1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHF1YW50aWxlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG4vKipcclxuICogVGhpcyBpcyB0aGUgaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gb2YgcXVhbnRpbGVzOiB3aGVuIHlvdSBrbm93XHJcbiAqIHRoYXQgdGhlIG9yZGVyIGlzIHNvcnRlZCwgeW91IGRvbid0IG5lZWQgdG8gcmUtc29ydCBpdCwgYW5kIHRoZSBjb21wdXRhdGlvbnNcclxuICogYXJlIGZhc3Rlci5cclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSBzYW1wbGUgaW5wdXQgZGF0YVxyXG4gKiBAcGFyYW0ge251bWJlcn0gcCBkZXNpcmVkIHF1YW50aWxlOiBhIG51bWJlciBiZXR3ZWVuIDAgdG8gMSwgaW5jbHVzaXZlXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHF1YW50aWxlIHZhbHVlXHJcbiAqIEBleGFtcGxlXHJcbiAqIHZhciBkYXRhID0gWzMsIDYsIDcsIDgsIDgsIDksIDEwLCAxMywgMTUsIDE2LCAyMF07XHJcbiAqIHF1YW50aWxlU29ydGVkKGRhdGEsIDEpOyAvLz0gbWF4KGRhdGEpO1xyXG4gKiBxdWFudGlsZVNvcnRlZChkYXRhLCAwKTsgLy89IG1pbihkYXRhKTtcclxuICogcXVhbnRpbGVTb3J0ZWQoZGF0YSwgMC41KTsgLy89IDlcclxuICovXHJcbmZ1bmN0aW9uIHF1YW50aWxlU29ydGVkKHNhbXBsZSAvKjogQXJyYXk8bnVtYmVyPiAqLywgcCAvKjogbnVtYmVyICovKS8qOm51bWJlciovIHtcclxuICAgIHZhciBpZHggPSBzYW1wbGUubGVuZ3RoICogcDtcclxuICAgIGlmIChwIDwgMCB8fCBwID4gMSkge1xyXG4gICAgICAgIHJldHVybiBOYU47XHJcbiAgICB9IGVsc2UgaWYgKHAgPT09IDEpIHtcclxuICAgICAgICAvLyBJZiBwIGlzIDEsIGRpcmVjdGx5IHJldHVybiB0aGUgbGFzdCBlbGVtZW50XHJcbiAgICAgICAgcmV0dXJuIHNhbXBsZVtzYW1wbGUubGVuZ3RoIC0gMV07XHJcbiAgICB9IGVsc2UgaWYgKHAgPT09IDApIHtcclxuICAgICAgICAvLyBJZiBwIGlzIDAsIGRpcmVjdGx5IHJldHVybiB0aGUgZmlyc3QgZWxlbWVudFxyXG4gICAgICAgIHJldHVybiBzYW1wbGVbMF07XHJcbiAgICB9IGVsc2UgaWYgKGlkeCAlIDEgIT09IDApIHtcclxuICAgICAgICAvLyBJZiBwIGlzIG5vdCBpbnRlZ2VyLCByZXR1cm4gdGhlIG5leHQgZWxlbWVudCBpbiBhcnJheVxyXG4gICAgICAgIHJldHVybiBzYW1wbGVbTWF0aC5jZWlsKGlkeCkgLSAxXTtcclxuICAgIH0gZWxzZSBpZiAoc2FtcGxlLmxlbmd0aCAlIDIgPT09IDApIHtcclxuICAgICAgICAvLyBJZiB0aGUgbGlzdCBoYXMgZXZlbi1sZW5ndGgsIHdlJ2xsIHRha2UgdGhlIGF2ZXJhZ2Ugb2YgdGhpcyBudW1iZXJcclxuICAgICAgICAvLyBhbmQgdGhlIG5leHQgdmFsdWUsIGlmIHRoZXJlIGlzIG9uZVxyXG4gICAgICAgIHJldHVybiAoc2FtcGxlW2lkeCAtIDFdICsgc2FtcGxlW2lkeF0pIC8gMjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gRmluYWxseSwgaW4gdGhlIHNpbXBsZSBjYXNlIG9mIGFuIGludGVnZXIgdmFsdWVcclxuICAgICAgICAvLyB3aXRoIGFuIG9kZC1sZW5ndGggbGlzdCwgcmV0dXJuIHRoZSBzYW1wbGUgdmFsdWUgYXQgdGhlIGluZGV4LlxyXG4gICAgICAgIHJldHVybiBzYW1wbGVbaWR4XTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBxdWFudGlsZVNvcnRlZDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBxdWlja3NlbGVjdDtcclxuXHJcbi8qKlxyXG4gKiBSZWFycmFuZ2UgaXRlbXMgaW4gYGFycmAgc28gdGhhdCBhbGwgaXRlbXMgaW4gYFtsZWZ0LCBrXWAgcmFuZ2UgYXJlIHRoZSBzbWFsbGVzdC5cclxuICogVGhlIGBrYC10aCBlbGVtZW50IHdpbGwgaGF2ZSB0aGUgYChrIC0gbGVmdCArIDEpYC10aCBzbWFsbGVzdCB2YWx1ZSBpbiBgW2xlZnQsIHJpZ2h0XWAuXHJcbiAqXHJcbiAqIEltcGxlbWVudHMgRmxveWQtUml2ZXN0IHNlbGVjdGlvbiBhbGdvcml0aG0gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRmxveWQtUml2ZXN0X2FsZ29yaXRobVxyXG4gKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IGFyciBpbnB1dCBhcnJheVxyXG4gKiBAcGFyYW0ge251bWJlcn0gayBwaXZvdCBpbmRleFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbGVmdCBsZWZ0IGluZGV4XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSByaWdodCByaWdodCBpbmRleFxyXG4gKiBAcmV0dXJucyB7dW5kZWZpbmVkfVxyXG4gKiBAZXhhbXBsZVxyXG4gKiB2YXIgYXJyID0gWzY1LCAyOCwgNTksIDMzLCAyMSwgNTYsIDIyLCA5NSwgNTAsIDEyLCA5MCwgNTMsIDI4LCA3NywgMzldO1xyXG4gKiBxdWlja3NlbGVjdChhcnIsIDgpO1xyXG4gKiAvLyBbMzksIDI4LCAyOCwgMzMsIDIxLCAxMiwgMjIsIDUwLCA1MywgNTYsIDU5LCA2NSwgOTAsIDc3LCA5NV1cclxuICovXHJcbmZ1bmN0aW9uIHF1aWNrc2VsZWN0KGFyciAvKjogQXJyYXk8bnVtYmVyPiAqLywgayAvKjogbnVtYmVyICovLCBsZWZ0IC8qOiBudW1iZXIgKi8sIHJpZ2h0IC8qOiBudW1iZXIgKi8pIHtcclxuICAgIGxlZnQgPSBsZWZ0IHx8IDA7XHJcbiAgICByaWdodCA9IHJpZ2h0IHx8IChhcnIubGVuZ3RoIC0gMSk7XHJcblxyXG4gICAgd2hpbGUgKHJpZ2h0ID4gbGVmdCkge1xyXG4gICAgICAgIC8vIDYwMCBhbmQgMC41IGFyZSBhcmJpdHJhcnkgY29uc3RhbnRzIGNob3NlbiBpbiB0aGUgb3JpZ2luYWwgcGFwZXIgdG8gbWluaW1pemUgZXhlY3V0aW9uIHRpbWVcclxuICAgICAgICBpZiAocmlnaHQgLSBsZWZ0ID4gNjAwKSB7XHJcbiAgICAgICAgICAgIHZhciBuID0gcmlnaHQgLSBsZWZ0ICsgMTtcclxuICAgICAgICAgICAgdmFyIG0gPSBrIC0gbGVmdCArIDE7XHJcbiAgICAgICAgICAgIHZhciB6ID0gTWF0aC5sb2cobik7XHJcbiAgICAgICAgICAgIHZhciBzID0gMC41ICogTWF0aC5leHAoMiAqIHogLyAzKTtcclxuICAgICAgICAgICAgdmFyIHNkID0gMC41ICogTWF0aC5zcXJ0KHogKiBzICogKG4gLSBzKSAvIG4pO1xyXG4gICAgICAgICAgICBpZiAobSAtIG4gLyAyIDwgMCkgc2QgKj0gLTE7XHJcbiAgICAgICAgICAgIHZhciBuZXdMZWZ0ID0gTWF0aC5tYXgobGVmdCwgTWF0aC5mbG9vcihrIC0gbSAqIHMgLyBuICsgc2QpKTtcclxuICAgICAgICAgICAgdmFyIG5ld1JpZ2h0ID0gTWF0aC5taW4ocmlnaHQsIE1hdGguZmxvb3IoayArIChuIC0gbSkgKiBzIC8gbiArIHNkKSk7XHJcbiAgICAgICAgICAgIHF1aWNrc2VsZWN0KGFyciwgaywgbmV3TGVmdCwgbmV3UmlnaHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHQgPSBhcnJba107XHJcbiAgICAgICAgdmFyIGkgPSBsZWZ0O1xyXG4gICAgICAgIHZhciBqID0gcmlnaHQ7XHJcblxyXG4gICAgICAgIHN3YXAoYXJyLCBsZWZ0LCBrKTtcclxuICAgICAgICBpZiAoYXJyW3JpZ2h0XSA+IHQpIHN3YXAoYXJyLCBsZWZ0LCByaWdodCk7XHJcblxyXG4gICAgICAgIHdoaWxlIChpIDwgaikge1xyXG4gICAgICAgICAgICBzd2FwKGFyciwgaSwgaik7XHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgai0tO1xyXG4gICAgICAgICAgICB3aGlsZSAoYXJyW2ldIDwgdCkgaSsrO1xyXG4gICAgICAgICAgICB3aGlsZSAoYXJyW2pdID4gdCkgai0tO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGFycltsZWZ0XSA9PT0gdCkgc3dhcChhcnIsIGxlZnQsIGopO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBqKys7XHJcbiAgICAgICAgICAgIHN3YXAoYXJyLCBqLCByaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaiA8PSBrKSBsZWZ0ID0gaiArIDE7XHJcbiAgICAgICAgaWYgKGsgPD0gaikgcmlnaHQgPSBqIC0gMTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc3dhcChhcnIsIGksIGopIHtcclxuICAgIHZhciB0bXAgPSBhcnJbaV07XHJcbiAgICBhcnJbaV0gPSBhcnJbal07XHJcbiAgICBhcnJbal0gPSB0bXA7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIHNhbXBsZUNvdmFyaWFuY2UgPSByZXF1aXJlKCcuL3NhbXBsZV9jb3ZhcmlhbmNlJyk7XHJcbnZhciBzYW1wbGVTdGFuZGFyZERldmlhdGlvbiA9IHJlcXVpcmUoJy4vc2FtcGxlX3N0YW5kYXJkX2RldmlhdGlvbicpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBbY29ycmVsYXRpb25dKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ29ycmVsYXRpb25fYW5kX2RlcGVuZGVuY2UpIGlzXHJcbiAqIGEgbWVhc3VyZSBvZiBob3cgY29ycmVsYXRlZCB0d28gZGF0YXNldHMgYXJlLCBiZXR3ZWVuIC0xIGFuZCAxXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBmaXJzdCBpbnB1dFxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHkgc2Vjb25kIGlucHV0XHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHNhbXBsZSBjb3JyZWxhdGlvblxyXG4gKiBAZXhhbXBsZVxyXG4gKiB2YXIgYSA9IFsxLCAyLCAzLCA0LCA1LCA2XTtcclxuICogdmFyIGIgPSBbMiwgMiwgMywgNCwgNSwgNjBdO1xyXG4gKiBzYW1wbGVDb3JyZWxhdGlvbihhLCBiKTsgLy89IDAuNjkxXHJcbiAqL1xyXG5mdW5jdGlvbiBzYW1wbGVDb3JyZWxhdGlvbih4Lyo6IEFycmF5PG51bWJlcj4gKi8sIHkvKjogQXJyYXk8bnVtYmVyPiAqLykvKjpudW1iZXIqLyB7XHJcbiAgICB2YXIgY292ID0gc2FtcGxlQ292YXJpYW5jZSh4LCB5KSxcclxuICAgICAgICB4c3RkID0gc2FtcGxlU3RhbmRhcmREZXZpYXRpb24oeCksXHJcbiAgICAgICAgeXN0ZCA9IHNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uKHkpO1xyXG5cclxuICAgIHJldHVybiBjb3YgLyB4c3RkIC8geXN0ZDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYW1wbGVDb3JyZWxhdGlvbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIG1lYW4gPSByZXF1aXJlKCcuL21lYW4nKTtcclxuXHJcbi8qKlxyXG4gKiBbU2FtcGxlIGNvdmFyaWFuY2VdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1NhbXBsZV9tZWFuX2FuZF9zYW1wbGVDb3ZhcmlhbmNlKSBvZiB0d28gZGF0YXNldHM6XHJcbiAqIGhvdyBtdWNoIGRvIHRoZSB0d28gZGF0YXNldHMgbW92ZSB0b2dldGhlcj9cclxuICogeCBhbmQgeSBhcmUgdHdvIGRhdGFzZXRzLCByZXByZXNlbnRlZCBhcyBhcnJheXMgb2YgbnVtYmVycy5cclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGZpcnN0IGlucHV0XHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geSBzZWNvbmQgaW5wdXRcclxuICogQHJldHVybnMge251bWJlcn0gc2FtcGxlIGNvdmFyaWFuY2VcclxuICogQGV4YW1wbGVcclxuICogdmFyIHggPSBbMSwgMiwgMywgNCwgNSwgNl07XHJcbiAqIHZhciB5ID0gWzYsIDUsIDQsIDMsIDIsIDFdO1xyXG4gKiBzYW1wbGVDb3ZhcmlhbmNlKHgsIHkpOyAvLz0gLTMuNVxyXG4gKi9cclxuZnVuY3Rpb24gc2FtcGxlQ292YXJpYW5jZSh4IC8qOkFycmF5PG51bWJlcj4qLywgeSAvKjpBcnJheTxudW1iZXI+Ki8pLyo6bnVtYmVyKi8ge1xyXG5cclxuICAgIC8vIFRoZSB0d28gZGF0YXNldHMgbXVzdCBoYXZlIHRoZSBzYW1lIGxlbmd0aCB3aGljaCBtdXN0IGJlIG1vcmUgdGhhbiAxXHJcbiAgICBpZiAoeC5sZW5ndGggPD0gMSB8fCB4Lmxlbmd0aCAhPT0geS5sZW5ndGgpIHtcclxuICAgICAgICByZXR1cm4gTmFOO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGRldGVybWluZSB0aGUgbWVhbiBvZiBlYWNoIGRhdGFzZXQgc28gdGhhdCB3ZSBjYW4ganVkZ2UgZWFjaFxyXG4gICAgLy8gdmFsdWUgb2YgdGhlIGRhdGFzZXQgZmFpcmx5IGFzIHRoZSBkaWZmZXJlbmNlIGZyb20gdGhlIG1lYW4uIHRoaXNcclxuICAgIC8vIHdheSwgaWYgb25lIGRhdGFzZXQgaXMgWzEsIDIsIDNdIGFuZCBbMiwgMywgNF0sIHRoZWlyIGNvdmFyaWFuY2VcclxuICAgIC8vIGRvZXMgbm90IHN1ZmZlciBiZWNhdXNlIG9mIHRoZSBkaWZmZXJlbmNlIGluIGFic29sdXRlIHZhbHVlc1xyXG4gICAgdmFyIHhtZWFuID0gbWVhbih4KSxcclxuICAgICAgICB5bWVhbiA9IG1lYW4oeSksXHJcbiAgICAgICAgc3VtID0gMDtcclxuXHJcbiAgICAvLyBmb3IgZWFjaCBwYWlyIG9mIHZhbHVlcywgdGhlIGNvdmFyaWFuY2UgaW5jcmVhc2VzIHdoZW4gdGhlaXJcclxuICAgIC8vIGRpZmZlcmVuY2UgZnJvbSB0aGUgbWVhbiBpcyBhc3NvY2lhdGVkIC0gaWYgYm90aCBhcmUgd2VsbCBhYm92ZVxyXG4gICAgLy8gb3IgaWYgYm90aCBhcmUgd2VsbCBiZWxvd1xyXG4gICAgLy8gdGhlIG1lYW4sIHRoZSBjb3ZhcmlhbmNlIGluY3JlYXNlcyBzaWduaWZpY2FudGx5LlxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgc3VtICs9ICh4W2ldIC0geG1lYW4pICogKHlbaV0gLSB5bWVhbik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdGhpcyBpcyBCZXNzZWxzJyBDb3JyZWN0aW9uOiBhbiBhZGp1c3RtZW50IG1hZGUgdG8gc2FtcGxlIHN0YXRpc3RpY3NcclxuICAgIC8vIHRoYXQgYWxsb3dzIGZvciB0aGUgcmVkdWNlZCBkZWdyZWUgb2YgZnJlZWRvbSBlbnRhaWxlZCBpbiBjYWxjdWxhdGluZ1xyXG4gICAgLy8gdmFsdWVzIGZyb20gc2FtcGxlcyByYXRoZXIgdGhhbiBjb21wbGV0ZSBwb3B1bGF0aW9ucy5cclxuICAgIHZhciBiZXNzZWxzQ29ycmVjdGlvbiA9IHgubGVuZ3RoIC0gMTtcclxuXHJcbiAgICAvLyB0aGUgY292YXJpYW5jZSBpcyB3ZWlnaHRlZCBieSB0aGUgbGVuZ3RoIG9mIHRoZSBkYXRhc2V0cy5cclxuICAgIHJldHVybiBzdW0gLyBiZXNzZWxzQ29ycmVjdGlvbjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYW1wbGVDb3ZhcmlhbmNlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgc2FtcGxlVmFyaWFuY2UgPSByZXF1aXJlKCcuL3NhbXBsZV92YXJpYW5jZScpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBbc3RhbmRhcmQgZGV2aWF0aW9uXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1N0YW5kYXJkX2RldmlhdGlvbilcclxuICogaXMgdGhlIHNxdWFyZSByb290IG9mIHRoZSB2YXJpYW5jZS5cclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGlucHV0IGFycmF5XHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHNhbXBsZSBzdGFuZGFyZCBkZXZpYXRpb25cclxuICogQGV4YW1wbGVcclxuICogc3Muc2FtcGxlU3RhbmRhcmREZXZpYXRpb24oWzIsIDQsIDQsIDQsIDUsIDUsIDcsIDldKTtcclxuICogLy89IDIuMTM4XHJcbiAqL1xyXG5mdW5jdGlvbiBzYW1wbGVTdGFuZGFyZERldmlhdGlvbih4Lyo6QXJyYXk8bnVtYmVyPiovKS8qOm51bWJlciovIHtcclxuICAgIC8vIFRoZSBzdGFuZGFyZCBkZXZpYXRpb24gb2Ygbm8gbnVtYmVycyBpcyBudWxsXHJcbiAgICB2YXIgc2FtcGxlVmFyaWFuY2VYID0gc2FtcGxlVmFyaWFuY2UoeCk7XHJcbiAgICBpZiAoaXNOYU4oc2FtcGxlVmFyaWFuY2VYKSkgeyByZXR1cm4gTmFOOyB9XHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHNhbXBsZVZhcmlhbmNlWCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2FtcGxlU3RhbmRhcmREZXZpYXRpb247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBzdW1OdGhQb3dlckRldmlhdGlvbnMgPSByZXF1aXJlKCcuL3N1bV9udGhfcG93ZXJfZGV2aWF0aW9ucycpO1xyXG5cclxuLypcclxuICogVGhlIFtzYW1wbGUgdmFyaWFuY2VdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1ZhcmlhbmNlI1NhbXBsZV92YXJpYW5jZSlcclxuICogaXMgdGhlIHN1bSBvZiBzcXVhcmVkIGRldmlhdGlvbnMgZnJvbSB0aGUgbWVhbi4gVGhlIHNhbXBsZSB2YXJpYW5jZVxyXG4gKiBpcyBkaXN0aW5ndWlzaGVkIGZyb20gdGhlIHZhcmlhbmNlIGJ5IHRoZSB1c2FnZSBvZiBbQmVzc2VsJ3MgQ29ycmVjdGlvbl0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQmVzc2VsJ3NfY29ycmVjdGlvbik6XHJcbiAqIGluc3RlYWQgb2YgZGl2aWRpbmcgdGhlIHN1bSBvZiBzcXVhcmVkIGRldmlhdGlvbnMgYnkgdGhlIGxlbmd0aCBvZiB0aGUgaW5wdXQsXHJcbiAqIGl0IGlzIGRpdmlkZWQgYnkgdGhlIGxlbmd0aCBtaW51cyBvbmUuIFRoaXMgY29ycmVjdHMgdGhlIGJpYXMgaW4gZXN0aW1hdGluZ1xyXG4gKiBhIHZhbHVlIGZyb20gYSBzZXQgdGhhdCB5b3UgZG9uJ3Qga25vdyBpZiBmdWxsLlxyXG4gKlxyXG4gKiBSZWZlcmVuY2VzOlxyXG4gKiAqIFtXb2xmcmFtIE1hdGhXb3JsZCBvbiBTYW1wbGUgVmFyaWFuY2VdKGh0dHA6Ly9tYXRod29ybGQud29sZnJhbS5jb20vU2FtcGxlVmFyaWFuY2UuaHRtbClcclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGlucHV0IGFycmF5XHJcbiAqIEByZXR1cm4ge251bWJlcn0gc2FtcGxlIHZhcmlhbmNlXHJcbiAqIEBleGFtcGxlXHJcbiAqIHNhbXBsZVZhcmlhbmNlKFsxLCAyLCAzLCA0LCA1XSk7IC8vPSAyLjVcclxuICovXHJcbmZ1bmN0aW9uIHNhbXBsZVZhcmlhbmNlKHggLyo6IEFycmF5PG51bWJlcj4gKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgLy8gVGhlIHZhcmlhbmNlIG9mIG5vIG51bWJlcnMgaXMgbnVsbFxyXG4gICAgaWYgKHgubGVuZ3RoIDw9IDEpIHsgcmV0dXJuIE5hTjsgfVxyXG5cclxuICAgIHZhciBzdW1TcXVhcmVkRGV2aWF0aW9uc1ZhbHVlID0gc3VtTnRoUG93ZXJEZXZpYXRpb25zKHgsIDIpO1xyXG5cclxuICAgIC8vIHRoaXMgaXMgQmVzc2VscycgQ29ycmVjdGlvbjogYW4gYWRqdXN0bWVudCBtYWRlIHRvIHNhbXBsZSBzdGF0aXN0aWNzXHJcbiAgICAvLyB0aGF0IGFsbG93cyBmb3IgdGhlIHJlZHVjZWQgZGVncmVlIG9mIGZyZWVkb20gZW50YWlsZWQgaW4gY2FsY3VsYXRpbmdcclxuICAgIC8vIHZhbHVlcyBmcm9tIHNhbXBsZXMgcmF0aGVyIHRoYW4gY29tcGxldGUgcG9wdWxhdGlvbnMuXHJcbiAgICB2YXIgYmVzc2Vsc0NvcnJlY3Rpb24gPSB4Lmxlbmd0aCAtIDE7XHJcblxyXG4gICAgLy8gRmluZCB0aGUgbWVhbiB2YWx1ZSBvZiB0aGF0IGxpc3RcclxuICAgIHJldHVybiBzdW1TcXVhcmVkRGV2aWF0aW9uc1ZhbHVlIC8gYmVzc2Vsc0NvcnJlY3Rpb247XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2FtcGxlVmFyaWFuY2U7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciB2YXJpYW5jZSA9IHJlcXVpcmUoJy4vdmFyaWFuY2UnKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgW3N0YW5kYXJkIGRldmlhdGlvbl0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TdGFuZGFyZF9kZXZpYXRpb24pXHJcbiAqIGlzIHRoZSBzcXVhcmUgcm9vdCBvZiB0aGUgdmFyaWFuY2UuIEl0J3MgdXNlZnVsIGZvciBtZWFzdXJpbmcgdGhlIGFtb3VudFxyXG4gKiBvZiB2YXJpYXRpb24gb3IgZGlzcGVyc2lvbiBpbiBhIHNldCBvZiB2YWx1ZXMuXHJcbiAqXHJcbiAqIFN0YW5kYXJkIGRldmlhdGlvbiBpcyBvbmx5IGFwcHJvcHJpYXRlIGZvciBmdWxsLXBvcHVsYXRpb24ga25vd2xlZGdlOiBmb3JcclxuICogc2FtcGxlcyBvZiBhIHBvcHVsYXRpb24sIHtAbGluayBzYW1wbGVTdGFuZGFyZERldmlhdGlvbn0gaXNcclxuICogbW9yZSBhcHByb3ByaWF0ZS5cclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGlucHV0XHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHN0YW5kYXJkIGRldmlhdGlvblxyXG4gKiBAZXhhbXBsZVxyXG4gKiB2YXIgc2NvcmVzID0gWzIsIDQsIDQsIDQsIDUsIDUsIDcsIDldO1xyXG4gKiB2YXJpYW5jZShzY29yZXMpOyAvLz0gNFxyXG4gKiBzdGFuZGFyZERldmlhdGlvbihzY29yZXMpOyAvLz0gMlxyXG4gKi9cclxuZnVuY3Rpb24gc3RhbmRhcmREZXZpYXRpb24oeCAvKjogQXJyYXk8bnVtYmVyPiAqLykvKjpudW1iZXIqLyB7XHJcbiAgICAvLyBUaGUgc3RhbmRhcmQgZGV2aWF0aW9uIG9mIG5vIG51bWJlcnMgaXMgbnVsbFxyXG4gICAgdmFyIHYgPSB2YXJpYW5jZSh4KTtcclxuICAgIGlmIChpc05hTih2KSkgeyByZXR1cm4gMDsgfVxyXG4gICAgcmV0dXJuIE1hdGguc3FydCh2KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzdGFuZGFyZERldmlhdGlvbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxuLyoqXHJcbiAqIE91ciBkZWZhdWx0IHN1bSBpcyB0aGUgW0thaGFuIHN1bW1hdGlvbiBhbGdvcml0aG1dKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0thaGFuX3N1bW1hdGlvbl9hbGdvcml0aG0pIGlzXHJcbiAqIGEgbWV0aG9kIGZvciBjb21wdXRpbmcgdGhlIHN1bSBvZiBhIGxpc3Qgb2YgbnVtYmVycyB3aGlsZSBjb3JyZWN0aW5nXHJcbiAqIGZvciBmbG9hdGluZy1wb2ludCBlcnJvcnMuIFRyYWRpdGlvbmFsbHksIHN1bXMgYXJlIGNhbGN1bGF0ZWQgYXMgbWFueVxyXG4gKiBzdWNjZXNzaXZlIGFkZGl0aW9ucywgZWFjaCBvbmUgd2l0aCBpdHMgb3duIGZsb2F0aW5nLXBvaW50IHJvdW5kb2ZmLiBUaGVzZVxyXG4gKiBsb3NzZXMgaW4gcHJlY2lzaW9uIGFkZCB1cCBhcyB0aGUgbnVtYmVyIG9mIG51bWJlcnMgaW5jcmVhc2VzLiBUaGlzIGFsdGVybmF0aXZlXHJcbiAqIGFsZ29yaXRobSBpcyBtb3JlIGFjY3VyYXRlIHRoYW4gdGhlIHNpbXBsZSB3YXkgb2YgY2FsY3VsYXRpbmcgc3VtcyBieSBzaW1wbGVcclxuICogYWRkaXRpb24uXHJcbiAqXHJcbiAqIFRoaXMgcnVucyBvbiBgTyhuKWAsIGxpbmVhciB0aW1lIGluIHJlc3BlY3QgdG8gdGhlIGFycmF5XHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBpbnB1dFxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IHN1bSBvZiBhbGwgaW5wdXQgbnVtYmVyc1xyXG4gKiBAZXhhbXBsZVxyXG4gKiBjb25zb2xlLmxvZyhzdW0oWzEsIDIsIDNdKSk7IC8vIDZcclxuICovXHJcbmZ1bmN0aW9uIHN1bSh4Lyo6IEFycmF5PG51bWJlcj4gKi8pLyo6IG51bWJlciAqLyB7XHJcblxyXG4gICAgLy8gbGlrZSB0aGUgdHJhZGl0aW9uYWwgc3VtIGFsZ29yaXRobSwgd2Uga2VlcCBhIHJ1bm5pbmdcclxuICAgIC8vIGNvdW50IG9mIHRoZSBjdXJyZW50IHN1bS5cclxuICAgIHZhciBzdW0gPSAwO1xyXG5cclxuICAgIC8vIGJ1dCB3ZSBhbHNvIGtlZXAgdGhyZWUgZXh0cmEgdmFyaWFibGVzIGFzIGJvb2trZWVwaW5nOlxyXG4gICAgLy8gbW9zdCBpbXBvcnRhbnRseSwgYW4gZXJyb3IgY29ycmVjdGlvbiB2YWx1ZS4gVGhpcyB3aWxsIGJlIGEgdmVyeVxyXG4gICAgLy8gc21hbGwgbnVtYmVyIHRoYXQgaXMgdGhlIG9wcG9zaXRlIG9mIHRoZSBmbG9hdGluZyBwb2ludCBwcmVjaXNpb24gbG9zcy5cclxuICAgIHZhciBlcnJvckNvbXBlbnNhdGlvbiA9IDA7XHJcblxyXG4gICAgLy8gdGhpcyB3aWxsIGJlIGVhY2ggbnVtYmVyIGluIHRoZSBsaXN0IGNvcnJlY3RlZCB3aXRoIHRoZSBjb21wZW5zYXRpb24gdmFsdWUuXHJcbiAgICB2YXIgY29ycmVjdGVkQ3VycmVudFZhbHVlO1xyXG5cclxuICAgIC8vIGFuZCB0aGlzIHdpbGwgYmUgdGhlIG5leHQgc3VtXHJcbiAgICB2YXIgbmV4dFN1bTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAvLyBmaXJzdCBjb3JyZWN0IHRoZSB2YWx1ZSB0aGF0IHdlJ3JlIGdvaW5nIHRvIGFkZCB0byB0aGUgc3VtXHJcbiAgICAgICAgY29ycmVjdGVkQ3VycmVudFZhbHVlID0geFtpXSAtIGVycm9yQ29tcGVuc2F0aW9uO1xyXG5cclxuICAgICAgICAvLyBjb21wdXRlIHRoZSBuZXh0IHN1bS4gc3VtIGlzIGxpa2VseSBhIG11Y2ggbGFyZ2VyIG51bWJlclxyXG4gICAgICAgIC8vIHRoYW4gY29ycmVjdGVkQ3VycmVudFZhbHVlLCBzbyB3ZSdsbCBsb3NlIHByZWNpc2lvbiBoZXJlLFxyXG4gICAgICAgIC8vIGFuZCBtZWFzdXJlIGhvdyBtdWNoIHByZWNpc2lvbiBpcyBsb3N0IGluIHRoZSBuZXh0IHN0ZXBcclxuICAgICAgICBuZXh0U3VtID0gc3VtICsgY29ycmVjdGVkQ3VycmVudFZhbHVlO1xyXG5cclxuICAgICAgICAvLyB3ZSBpbnRlbnRpb25hbGx5IGRpZG4ndCBhc3NpZ24gc3VtIGltbWVkaWF0ZWx5LCBidXQgc3RvcmVkXHJcbiAgICAgICAgLy8gaXQgZm9yIG5vdyBzbyB3ZSBjYW4gZmlndXJlIG91dCB0aGlzOiBpcyAoc3VtICsgbmV4dFZhbHVlKSAtIG5leHRWYWx1ZVxyXG4gICAgICAgIC8vIG5vdCBlcXVhbCB0byAwPyBpZGVhbGx5IGl0IHdvdWxkIGJlLCBidXQgaW4gcHJhY3RpY2UgaXQgd29uJ3Q6XHJcbiAgICAgICAgLy8gaXQgd2lsbCBiZSBzb21lIHZlcnkgc21hbGwgbnVtYmVyLiB0aGF0J3Mgd2hhdCB3ZSByZWNvcmRcclxuICAgICAgICAvLyBhcyBlcnJvckNvbXBlbnNhdGlvbi5cclxuICAgICAgICBlcnJvckNvbXBlbnNhdGlvbiA9IG5leHRTdW0gLSBzdW0gLSBjb3JyZWN0ZWRDdXJyZW50VmFsdWU7XHJcblxyXG4gICAgICAgIC8vIG5vdyB0aGF0IHdlJ3ZlIGNvbXB1dGVkIGhvdyBtdWNoIHdlJ2xsIGNvcnJlY3QgZm9yIGluIHRoZSBuZXh0XHJcbiAgICAgICAgLy8gbG9vcCwgc3RhcnQgdHJlYXRpbmcgdGhlIG5leHRTdW0gYXMgdGhlIGN1cnJlbnQgc3VtLlxyXG4gICAgICAgIHN1bSA9IG5leHRTdW07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHN1bTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzdW07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBtZWFuID0gcmVxdWlyZSgnLi9tZWFuJyk7XHJcblxyXG4vKipcclxuICogVGhlIHN1bSBvZiBkZXZpYXRpb25zIHRvIHRoZSBOdGggcG93ZXIuXHJcbiAqIFdoZW4gbj0yIGl0J3MgdGhlIHN1bSBvZiBzcXVhcmVkIGRldmlhdGlvbnMuXHJcbiAqIFdoZW4gbj0zIGl0J3MgdGhlIHN1bSBvZiBjdWJlZCBkZXZpYXRpb25zLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHhcclxuICogQHBhcmFtIHtudW1iZXJ9IG4gcG93ZXJcclxuICogQHJldHVybnMge251bWJlcn0gc3VtIG9mIG50aCBwb3dlciBkZXZpYXRpb25zXHJcbiAqIEBleGFtcGxlXHJcbiAqIHZhciBpbnB1dCA9IFsxLCAyLCAzXTtcclxuICogLy8gc2luY2UgdGhlIHZhcmlhbmNlIG9mIGEgc2V0IGlzIHRoZSBtZWFuIHNxdWFyZWRcclxuICogLy8gZGV2aWF0aW9ucywgd2UgY2FuIGNhbGN1bGF0ZSB0aGF0IHdpdGggc3VtTnRoUG93ZXJEZXZpYXRpb25zOlxyXG4gKiB2YXIgdmFyaWFuY2UgPSBzdW1OdGhQb3dlckRldmlhdGlvbnMoaW5wdXQpIC8gaW5wdXQubGVuZ3RoO1xyXG4gKi9cclxuZnVuY3Rpb24gc3VtTnRoUG93ZXJEZXZpYXRpb25zKHgvKjogQXJyYXk8bnVtYmVyPiAqLywgbi8qOiBudW1iZXIgKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgdmFyIG1lYW5WYWx1ZSA9IG1lYW4oeCksXHJcbiAgICAgICAgc3VtID0gMDtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBzdW0gKz0gTWF0aC5wb3coeFtpXSAtIG1lYW5WYWx1ZSwgbik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHN1bTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzdW1OdGhQb3dlckRldmlhdGlvbnM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBzdW1OdGhQb3dlckRldmlhdGlvbnMgPSByZXF1aXJlKCcuL3N1bV9udGhfcG93ZXJfZGV2aWF0aW9ucycpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBbdmFyaWFuY2VdKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVmFyaWFuY2UpXHJcbiAqIGlzIHRoZSBzdW0gb2Ygc3F1YXJlZCBkZXZpYXRpb25zIGZyb20gdGhlIG1lYW4uXHJcbiAqXHJcbiAqIFRoaXMgaXMgYW4gaW1wbGVtZW50YXRpb24gb2YgdmFyaWFuY2UsIG5vdCBzYW1wbGUgdmFyaWFuY2U6XHJcbiAqIHNlZSB0aGUgYHNhbXBsZVZhcmlhbmNlYCBtZXRob2QgaWYgeW91IHdhbnQgYSBzYW1wbGUgbWVhc3VyZS5cclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGEgcG9wdWxhdGlvblxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSB2YXJpYW5jZTogYSB2YWx1ZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gemVyby5cclxuICogemVybyBpbmRpY2F0ZXMgdGhhdCBhbGwgdmFsdWVzIGFyZSBpZGVudGljYWwuXHJcbiAqIEBleGFtcGxlXHJcbiAqIHNzLnZhcmlhbmNlKFsxLCAyLCAzLCA0LCA1LCA2XSk7IC8vPSAyLjkxN1xyXG4gKi9cclxuZnVuY3Rpb24gdmFyaWFuY2UoeC8qOiBBcnJheTxudW1iZXI+ICovKS8qOm51bWJlciovIHtcclxuICAgIC8vIFRoZSB2YXJpYW5jZSBvZiBubyBudW1iZXJzIGlzIG51bGxcclxuICAgIGlmICh4Lmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gTmFOOyB9XHJcblxyXG4gICAgLy8gRmluZCB0aGUgbWVhbiBvZiBzcXVhcmVkIGRldmlhdGlvbnMgYmV0d2VlbiB0aGVcclxuICAgIC8vIG1lYW4gdmFsdWUgYW5kIGVhY2ggdmFsdWUuXHJcbiAgICByZXR1cm4gc3VtTnRoUG93ZXJEZXZpYXRpb25zKHgsIDIpIC8geC5sZW5ndGg7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdmFyaWFuY2U7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbi8qKlxyXG4gKiBUaGUgW1otU2NvcmUsIG9yIFN0YW5kYXJkIFNjb3JlXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1N0YW5kYXJkX3Njb3JlKS5cclxuICpcclxuICogVGhlIHN0YW5kYXJkIHNjb3JlIGlzIHRoZSBudW1iZXIgb2Ygc3RhbmRhcmQgZGV2aWF0aW9ucyBhbiBvYnNlcnZhdGlvblxyXG4gKiBvciBkYXR1bSBpcyBhYm92ZSBvciBiZWxvdyB0aGUgbWVhbi4gVGh1cywgYSBwb3NpdGl2ZSBzdGFuZGFyZCBzY29yZVxyXG4gKiByZXByZXNlbnRzIGEgZGF0dW0gYWJvdmUgdGhlIG1lYW4sIHdoaWxlIGEgbmVnYXRpdmUgc3RhbmRhcmQgc2NvcmVcclxuICogcmVwcmVzZW50cyBhIGRhdHVtIGJlbG93IHRoZSBtZWFuLiBJdCBpcyBhIGRpbWVuc2lvbmxlc3MgcXVhbnRpdHlcclxuICogb2J0YWluZWQgYnkgc3VidHJhY3RpbmcgdGhlIHBvcHVsYXRpb24gbWVhbiBmcm9tIGFuIGluZGl2aWR1YWwgcmF3XHJcbiAqIHNjb3JlIGFuZCB0aGVuIGRpdmlkaW5nIHRoZSBkaWZmZXJlbmNlIGJ5IHRoZSBwb3B1bGF0aW9uIHN0YW5kYXJkXHJcbiAqIGRldmlhdGlvbi5cclxuICpcclxuICogVGhlIHotc2NvcmUgaXMgb25seSBkZWZpbmVkIGlmIG9uZSBrbm93cyB0aGUgcG9wdWxhdGlvbiBwYXJhbWV0ZXJzO1xyXG4gKiBpZiBvbmUgb25seSBoYXMgYSBzYW1wbGUgc2V0LCB0aGVuIHRoZSBhbmFsb2dvdXMgY29tcHV0YXRpb24gd2l0aFxyXG4gKiBzYW1wbGUgbWVhbiBhbmQgc2FtcGxlIHN0YW5kYXJkIGRldmlhdGlvbiB5aWVsZHMgdGhlXHJcbiAqIFN0dWRlbnQncyB0LXN0YXRpc3RpYy5cclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IHhcclxuICogQHBhcmFtIHtudW1iZXJ9IG1lYW5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YW5kYXJkRGV2aWF0aW9uXHJcbiAqIEByZXR1cm4ge251bWJlcn0geiBzY29yZVxyXG4gKiBAZXhhbXBsZVxyXG4gKiBzcy56U2NvcmUoNzgsIDgwLCA1KTsgLy89IC0wLjRcclxuICovXHJcbmZ1bmN0aW9uIHpTY29yZSh4Lyo6bnVtYmVyKi8sIG1lYW4vKjpudW1iZXIqLywgc3RhbmRhcmREZXZpYXRpb24vKjpudW1iZXIqLykvKjpudW1iZXIqLyB7XHJcbiAgICByZXR1cm4gKHggLSBtZWFuKSAvIHN0YW5kYXJkRGV2aWF0aW9uO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHpTY29yZTtcclxuIiwiaW1wb3J0IHtDaGFydFdpdGhDb2xvckdyb3VwcywgQ2hhcnRXaXRoQ29sb3JHcm91cHNDb25maWd9IGZyb20gXCIuL2NoYXJ0LXdpdGgtY29sb3ItZ3JvdXBzXCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7TGVnZW5kfSBmcm9tIFwiLi9sZWdlbmRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBCYXJDaGFydENvbmZpZyBleHRlbmRzIENoYXJ0V2l0aENvbG9yR3JvdXBzQ29uZmlnIHtcclxuXHJcbiAgICBzdmdDbGFzcyA9IHRoaXMuY3NzQ2xhc3NQcmVmaXggKyAnYmFyLWNoYXJ0JztcclxuICAgIHNob3dMZWdlbmQgPSB0cnVlO1xyXG4gICAgc2hvd1Rvb2x0aXAgPSB0cnVlO1xyXG4gICAgeCA9IHsvLyBYIGF4aXMgY29uZmlnXHJcbiAgICAgICAgbGFiZWw6ICcnLCAvLyBheGlzIGxhYmVsXHJcbiAgICAgICAga2V5OiAwLFxyXG4gICAgICAgIHZhbHVlOiAoZCwga2V5KSA9PiBVdGlscy5pc051bWJlcihkKSA/IGQgOiBkW2tleV0sIC8vIHggdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICBzY2FsZTogXCJvcmRpbmFsXCIsXHJcbiAgICAgICAgdGlja3M6IHVuZGVmaW5lZCxcclxuICAgIH07XHJcbiAgICB5ID0gey8vIFkgYXhpcyBjb25maWdcclxuICAgICAgICBrZXk6IDEsXHJcbiAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IFV0aWxzLmlzTnVtYmVyKGQpID8gZCA6IGRba2V5XSwgLy8geCB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgIGxhYmVsOiAnJywgLy8gYXhpcyBsYWJlbCxcclxuICAgICAgICBvcmllbnQ6IFwibGVmdFwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiXHJcbiAgICB9O1xyXG4gICAgdHJhbnNpdGlvbiA9IHRydWU7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB2YXIgY29uZmlnID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKGN1c3RvbSkge1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEJhckNoYXJ0IGV4dGVuZHMgQ2hhcnRXaXRoQ29sb3JHcm91cHMge1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IEJhckNoYXJ0Q29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBCYXJDaGFydENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0UGxvdCgpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnggPSB7fTtcclxuICAgICAgICB0aGlzLnBsb3QueSA9IHt9O1xyXG5cclxuICAgICAgICB0aGlzLmNvbXB1dGVQbG90U2l6ZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBZKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFgoKTtcclxuICAgICAgICB0aGlzLnNldHVwR3JvdXBTdGFja3MoKTtcclxuICAgICAgICB0aGlzLnNldHVwWURvbWFpbigpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcblxyXG4gICAgc2V0dXBYKCkge1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeCA9IHBsb3QueDtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnLng7XHJcblxyXG4gICAgICAgIC8qICpcclxuICAgICAgICAgKiB2YWx1ZSBhY2Nlc3NvciAtIHJldHVybnMgdGhlIHZhbHVlIHRvIGVuY29kZSBmb3IgYSBnaXZlbiBkYXRhIG9iamVjdC5cclxuICAgICAgICAgKiBzY2FsZSAtIG1hcHMgdmFsdWUgdG8gYSB2aXN1YWwgZGlzcGxheSBlbmNvZGluZywgc3VjaCBhcyBhIHBpeGVsIHBvc2l0aW9uLlxyXG4gICAgICAgICAqIG1hcCBmdW5jdGlvbiAtIG1hcHMgZnJvbSBkYXRhIHZhbHVlIHRvIGRpc3BsYXkgdmFsdWVcclxuICAgICAgICAgKiBheGlzIC0gc2V0cyB1cCBheGlzXHJcbiAgICAgICAgICoqL1xyXG4gICAgICAgIHgudmFsdWUgPSBkID0+IGNvbmYudmFsdWUoZCwgY29uZi5rZXkpO1xyXG4gICAgICAgIHguc2NhbGUgPSBkMy5zY2FsZS5vcmRpbmFsKCkucmFuZ2VSb3VuZEJhbmRzKFswLCBwbG90LndpZHRoXSwgLjA4KTtcclxuICAgICAgICB4Lm1hcCA9IGQgPT4geC5zY2FsZSh4LnZhbHVlKGQpKTtcclxuXHJcbiAgICAgICAgeC5heGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh4LnNjYWxlKS5vcmllbnQoY29uZi5vcmllbnQpO1xyXG5cclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMucGxvdC5kYXRhO1xyXG4gICAgICAgIHZhciBkb21haW47XHJcbiAgICAgICAgaWYgKCFkYXRhIHx8ICFkYXRhLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBkb21haW4gPSBbXTtcclxuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLmNvbmZpZy5zZXJpZXMpIHtcclxuICAgICAgICAgICAgZG9tYWluID0gZDMubWFwKGRhdGEsIHgudmFsdWUpLmtleXMoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkb21haW4gPSBkMy5tYXAoZGF0YVswXS52YWx1ZXMsIHgudmFsdWUpLmtleXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBsb3QueC5zY2FsZS5kb21haW4oZG9tYWluKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwWSgpIHtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHkgPSBwbG90Lnk7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZy55O1xyXG4gICAgICAgIHkudmFsdWUgPSBkID0+IGNvbmYudmFsdWUoZCwgY29uZi5rZXkpO1xyXG4gICAgICAgIHkuc2NhbGUgPSBkMy5zY2FsZVtjb25mLnNjYWxlXSgpLnJhbmdlKFtwbG90LmhlaWdodCwgMF0pO1xyXG4gICAgICAgIHkubWFwID0gZCA9PiB5LnNjYWxlKHkudmFsdWUoZCkpO1xyXG5cclxuICAgICAgICB5LmF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHkuc2NhbGUpLm9yaWVudChjb25mLm9yaWVudCk7XHJcbiAgICAgICAgaWYgKGNvbmYudGlja3MpIHtcclxuICAgICAgICAgICAgeS5heGlzLnRpY2tzKGNvbmYudGlja3MpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBZRG9tYWluKCkge1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5wbG90LmRhdGE7XHJcbiAgICAgICAgdmFyIGRvbWFpbjtcclxuICAgICAgICB2YXIgeVN0YWNrTWF4ID0gZDMubWF4KHBsb3QubGF5ZXJzLCBsYXllciA9PiBkMy5tYXgobGF5ZXIucG9pbnRzLCBkID0+IGQueTAgKyBkLnkpKTtcclxuXHJcblxyXG4gICAgICAgIC8vIHZhciBtaW4gPSBkMy5taW4oZGF0YSwgcz0+ZDMubWluKHMudmFsdWVzLCBwbG90LnkudmFsdWUpKTtcclxuICAgICAgICB2YXIgbWF4ID0geVN0YWNrTWF4O1xyXG4gICAgICAgIGRvbWFpbiA9IFswLCBtYXhdO1xyXG5cclxuICAgICAgICBwbG90Lnkuc2NhbGUuZG9tYWluKGRvbWFpbik7XHJcbiAgICAgICAgY29uc29sZS5sb2coJyBwbG90Lnkuc2NhbGUuZG9tYWluJywgcGxvdC55LnNjYWxlLmRvbWFpbigpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cEdyb3VwU3RhY2tzKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmdyb3VwRGF0YSgpO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3Quc3RhY2sgPSBkMy5sYXlvdXQuc3RhY2soKS52YWx1ZXMoZD0+ZC5wb2ludHMpO1xyXG4gICAgICAgIHRoaXMucGxvdC5ncm91cGVkRGF0YS5mb3JFYWNoKHM9PiB7XHJcbiAgICAgICAgICAgIHMucG9pbnRzID0gcy52YWx1ZXMubWFwKHY9PnNlbGYubWFwVG9Qb2ludCh2KSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5wbG90LmxheWVycyA9IHRoaXMucGxvdC5zdGFjayh0aGlzLnBsb3QuZ3JvdXBlZERhdGEpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBtYXBUb1BvaW50KHZhbHVlKSB7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeDogcGxvdC54LnZhbHVlKHZhbHVlKSxcclxuICAgICAgICAgICAgeTogcGFyc2VGbG9hdChwbG90LnkudmFsdWUodmFsdWUpKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgZHJhd0F4aXNYKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgYXhpc0NvbmYgPSB0aGlzLmNvbmZpZy54O1xyXG4gICAgICAgIHZhciBheGlzID0gc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIiArIHNlbGYucHJlZml4Q2xhc3MoJ2F4aXMteCcpICsgXCIuXCIgKyBzZWxmLnByZWZpeENsYXNzKCdheGlzJykgKyAoc2VsZi5jb25maWcuZ3VpZGVzID8gJycgOiAnLicgKyBzZWxmLnByZWZpeENsYXNzKCduby1ndWlkZXMnKSkpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyBwbG90LmhlaWdodCArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgdmFyIGF4aXNUID0gYXhpcztcclxuICAgICAgICBpZiAoc2VsZi5jb25maWcudHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICBheGlzVCA9IGF4aXMudHJhbnNpdGlvbigpLmVhc2UoXCJzaW4taW4tb3V0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXhpc1QuY2FsbChwbG90LnguYXhpcyk7XHJcblxyXG4gICAgICAgIGF4aXMuc2VsZWN0T3JBcHBlbmQoXCJ0ZXh0LlwiICsgc2VsZi5wcmVmaXhDbGFzcygnbGFiZWwnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAocGxvdC53aWR0aCAvIDIpICsgXCIsXCIgKyAocGxvdC5tYXJnaW4uYm90dG9tKSArIFwiKVwiKSAgLy8gdGV4dCBpcyBkcmF3biBvZmYgdGhlIHNjcmVlbiB0b3AgbGVmdCwgbW92ZSBkb3duIGFuZCBvdXQgYW5kIHJvdGF0ZVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiLTFlbVwiKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAudGV4dChheGlzQ29uZi5sYWJlbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRyYXdBeGlzWSgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGF4aXNDb25mID0gdGhpcy5jb25maWcueTtcclxuICAgICAgICB2YXIgYXhpcyA9IHNlbGYuc3ZnRy5zZWxlY3RPckFwcGVuZChcImcuXCIgKyBzZWxmLnByZWZpeENsYXNzKCdheGlzLXknKSArIFwiLlwiICsgc2VsZi5wcmVmaXhDbGFzcygnYXhpcycpICsgKHNlbGYuY29uZmlnLmd1aWRlcyA/ICcnIDogJy4nICsgc2VsZi5wcmVmaXhDbGFzcygnbm8tZ3VpZGVzJykpKTtcclxuXHJcbiAgICAgICAgdmFyIGF4aXNUID0gYXhpcztcclxuICAgICAgICBpZiAoc2VsZi5jb25maWcudHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICBheGlzVCA9IGF4aXMudHJhbnNpdGlvbigpLmVhc2UoXCJzaW4taW4tb3V0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXhpc1QuY2FsbChwbG90LnkuYXhpcyk7XHJcblxyXG4gICAgICAgIGF4aXMuc2VsZWN0T3JBcHBlbmQoXCJ0ZXh0LlwiICsgc2VsZi5wcmVmaXhDbGFzcygnbGFiZWwnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAtcGxvdC5tYXJnaW4ubGVmdCArIFwiLFwiICsgKHBsb3QuaGVpZ2h0IC8gMikgKyBcIilyb3RhdGUoLTkwKVwiKSAgLy8gdGV4dCBpcyBkcmF3biBvZmYgdGhlIHNjcmVlbiB0b3AgbGVmdCwgbW92ZSBkb3duIGFuZCBvdXQgYW5kIHJvdGF0ZVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGF4aXNDb25mLmxhYmVsKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIGRyYXdCYXJzKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ2xheWVycycsIHBsb3QubGF5ZXJzKTtcclxuXHJcbiAgICAgICAgdmFyIGxheWVyQ2xhc3MgPSB0aGlzLnByZWZpeENsYXNzKFwibGF5ZXJcIik7XHJcblxyXG4gICAgICAgIHZhciBiYXJDbGFzcyA9IHRoaXMucHJlZml4Q2xhc3MoXCJiYXJcIik7XHJcbiAgICAgICAgdmFyIGxheWVyID0gc2VsZi5zdmdHLnNlbGVjdEFsbChcIi5cIiArIGxheWVyQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBsb3QubGF5ZXJzKTtcclxuXHJcbiAgICAgICAgbGF5ZXIuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgbGF5ZXJDbGFzcyk7XHJcblxyXG4gICAgICAgIHZhciBiYXIgPSBsYXllci5zZWxlY3RBbGwoXCIuXCIgKyBiYXJDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEoZCA9PiBkLnBvaW50cyk7XHJcblxyXG4gICAgICAgIGJhci5lbnRlcigpLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBiYXJDbGFzcylcclxuICAgICAgICAgICAgLmFwcGVuZChcInJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDEpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGJhclJlY3QgPSBiYXIuc2VsZWN0KFwicmVjdFwiKTtcclxuXHJcbiAgICAgICAgdmFyIGJhclJlY3RUID0gYmFyUmVjdDtcclxuICAgICAgICB2YXIgYmFyVCA9IGJhcjtcclxuICAgICAgICB2YXIgbGF5ZXJUID0gbGF5ZXI7XHJcbiAgICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbkVuYWJsZWQoKSkge1xyXG4gICAgICAgICAgICBiYXJSZWN0VCA9IGJhclJlY3QudHJhbnNpdGlvbigpO1xyXG4gICAgICAgICAgICBiYXJUID0gYmFyLnRyYW5zaXRpb24oKTtcclxuICAgICAgICAgICAgbGF5ZXJUID0gbGF5ZXIudHJhbnNpdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHlEb21haW4gPSBwbG90Lnkuc2NhbGUuZG9tYWluKCk7XHJcbiAgICAgICAgYmFyVC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHBsb3QueC5zY2FsZShkLngpICsgXCIsXCIgKyAocGxvdC55LnNjYWxlKGQueTAgKyBkLnkpKSArIFwiKVwiO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBiYXJSZWN0VFxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHBsb3QueC5zY2FsZS5yYW5nZUJhbmQoKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZCA9PiBwbG90Lnkuc2NhbGUoZC55MCkgLSBwbG90Lnkuc2NhbGUoZC55MCArIGQueSAtIHlEb21haW5bMF0pKTtcclxuXHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBsb3Quc2VyaWVzQ29sb3IpIHtcclxuICAgICAgICAgICAgbGF5ZXJUXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgdGhpcy5wbG90LnNlcmllc0NvbG9yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwbG90LnRvb2x0aXApIHtcclxuICAgICAgICAgICAgYmFyLm9uKFwibW91c2VvdmVyXCIsIGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zaG93VG9vbHRpcChkLnkpO1xyXG4gICAgICAgICAgICB9KS5vbihcIm1vdXNlb3V0XCIsIGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5oaWRlVG9vbHRpcCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGF5ZXIuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgICAgIGJhci5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKG5ld0RhdGEpIHtcclxuICAgICAgICBzdXBlci51cGRhdGUobmV3RGF0YSk7XHJcbiAgICAgICAgdGhpcy5kcmF3QXhpc1goKTtcclxuICAgICAgICB0aGlzLmRyYXdBeGlzWSgpO1xyXG4gICAgICAgIHRoaXMuZHJhd0JhcnMoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG59XHJcbiIsImltcG9ydCB7Q2hhcnQsIENoYXJ0Q29uZmlnfSBmcm9tIFwiLi9jaGFydFwiO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5cclxuZXhwb3J0IGNsYXNzIEJveFBsb3RCYXNlQ29uZmlnIGV4dGVuZHMgQ2hhcnRDb25maWd7XHJcblxyXG4gICAgc3ZnQ2xhc3MgPSB0aGlzLmNzc0NsYXNzUHJlZml4ICsgJ2JveC1wbG90JztcclxuICAgIHNob3dMZWdlbmQgPSB0cnVlO1xyXG4gICAgc2hvd1Rvb2x0aXAgPSB0cnVlO1xyXG4gICAgeCA9IHsvLyBYIGF4aXMgY29uZmlnXHJcbiAgICAgICAgdGl0bGU6ICcnLCAvLyBheGlzIGxhYmVsXHJcbiAgICAgICAgdmFsdWU6IHMgPT4gcy5rZXksIC8vIHggdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICBndWlkZXM6IGZhbHNlLCAvL3Nob3cgYXhpcyBndWlkZXNcclxuICAgICAgICBzY2FsZTogXCJvcmRpbmFsXCJcclxuXHJcbiAgICB9O1xyXG4gICAgeSA9IHsvLyBZIGF4aXMgY29uZmlnXHJcbiAgICAgICAgdGl0bGU6ICcnLFxyXG4gICAgICAgIHZhbHVlOiBkID0+IGQsIC8vIHkgdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIixcclxuICAgICAgICBvcmllbnQ6ICdsZWZ0JyxcclxuICAgICAgICBkb21haW5NYXJnaW46IDAuMSxcclxuICAgICAgICBndWlkZXM6IHRydWUgLy9zaG93IGF4aXMgZ3VpZGVzXHJcbiAgICB9O1xyXG4gICAgUTEgPSBkID0+IGQudmFsdWVzLlExO1xyXG4gICAgUTIgPSBkID0+IGQudmFsdWVzLlEyO1xyXG4gICAgUTMgPSBkID0+IGQudmFsdWVzLlEzO1xyXG4gICAgV2wgPSBkID0+IGQudmFsdWVzLndoaXNrZXJMb3c7XHJcbiAgICBXaCA9IGQgPT4gZC52YWx1ZXMud2hpc2tlckhpZ2g7XHJcbiAgICBvdXRsaWVycz0gZD0+IGQudmFsdWVzLm91dGxpZXJzO1xyXG4gICAgb3V0bGllclZhbHVlID0gKGQsaSk9PiBkO1xyXG4gICAgb3V0bGllckxhYmVsID0gKGQsaSk9PiBkO1xyXG4gICAgbWluQm94V2lkdGggPSAzNTtcclxuICAgIG1heEJveFdpZHRoID0gMTAwO1xyXG5cclxuICAgIHRyYW5zaXRpb24gPSB0cnVlO1xyXG4gICAgY29sb3IgPSAgdW5kZWZpbmVkOy8vIHN0cmluZyBvciBmdW5jdGlvbiByZXR1cm5pbmcgY29sb3IncyB2YWx1ZSBmb3IgY29sb3Igc2NhbGVcclxuICAgIGQzQ29sb3JDYXRlZ29yeT0gJ2NhdGVnb3J5MTAnO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBpZihjdXN0b20pe1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEJveFBsb3RCYXNlIGV4dGVuZHMgQ2hhcnR7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBzdXBlcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBuZXcgQm94UGxvdEJhc2VDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZyl7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgQm94UGxvdEJhc2VDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKXtcclxuICAgICAgICBzdXBlci5pbml0UGxvdCgpO1xyXG4gICAgICAgIHN1cGVyLmNvbXB1dGVQbG90U2l6ZSgpO1xyXG4gICAgICAgIHRoaXMucGxvdC54ID0ge307XHJcbiAgICAgICAgdGhpcy5wbG90LnkgPSB7fTtcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LmRhdGEgPSB0aGlzLmdldERhdGFUb1Bsb3QoKTtcclxuICAgICAgICB0aGlzLnNldHVwWSgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBYKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBDb2xvcigpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBnZXREYXRhVG9QbG90KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXBYKCkge1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeCA9IHBsb3QueDtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnLng7XHJcblxyXG4gICAgICAgIHgudmFsdWUgPSBjb25mLnZhbHVlO1xyXG4gICAgICAgIHguc2NhbGUgPSBkMy5zY2FsZS5vcmRpbmFsKCkucmFuZ2VSb3VuZEJhbmRzKFswLCBwbG90LndpZHRoXSwgLjA4KTtcclxuICAgICAgICB4Lm1hcCA9IGQgPT4geC5zY2FsZSh4LnZhbHVlKGQpKTtcclxuXHJcbiAgICAgICAgeC5heGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh4LnNjYWxlKS5vcmllbnQoY29uZi5vcmllbnQpO1xyXG4gICAgICAgIGlmKGNvbmYuZ3VpZGVzKXtcclxuICAgICAgICAgICAgeC5heGlzLnRpY2tTaXplKC1wbG90LmhlaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMucGxvdC5kYXRhO1xyXG4gICAgICAgIHZhciBkb21haW47XHJcbiAgICAgICAgaWYgKCFkYXRhIHx8ICFkYXRhLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBkb21haW4gPSBbXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkb21haW4gPSBkYXRhLm1hcCh4LnZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBsb3QueC5zY2FsZS5kb21haW4oZG9tYWluKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwWSgpIHtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHkgPSBwbG90Lnk7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZy55O1xyXG4gICAgICAgIHkudmFsdWUgPSBkID0+IGNvbmYudmFsdWUuY2FsbCh0aGlzLmNvbmZpZywgZCk7XHJcbiAgICAgICAgeS5zY2FsZSA9IGQzLnNjYWxlW2NvbmYuc2NhbGVdKCkucmFuZ2UoW3Bsb3QuaGVpZ2h0LCAwXSk7XHJcbiAgICAgICAgeS5tYXAgPSBkID0+IHkuc2NhbGUoeS52YWx1ZShkKSk7XHJcblxyXG4gICAgICAgIHkuYXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeS5zY2FsZSkub3JpZW50KGNvbmYub3JpZW50KTtcclxuICAgICAgICBpZiAoY29uZi50aWNrcykge1xyXG4gICAgICAgICAgICB5LmF4aXMudGlja3MoY29uZi50aWNrcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGNvbmYuZ3VpZGVzKXtcclxuICAgICAgICAgICAgeS5heGlzLnRpY2tTaXplKC1wbG90LndpZHRoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXR1cFlEb21haW4oKTtcclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBZRG9tYWluKCkge1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5wbG90LmRhdGE7XHJcbiAgICAgICAgdmFyIGMgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgdmFyIHZhbHVlcyA9IFtdLCB5TWluLCB5TWF4O1xyXG4gICAgICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICBsZXQgcTEgPSBjLlExKGQpLCBcclxuICAgICAgICAgICAgICAgIHEzID0gYy5RMyhkKSwgXHJcbiAgICAgICAgICAgICAgICB3bCA9IGMuV2woZCksIFxyXG4gICAgICAgICAgICAgICAgd2ggPSBjLldoKGQpLFxyXG4gICAgICAgICAgICAgICAgb3V0bGllcnMgPSBjLm91dGxpZXJzKGQpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKG91dGxpZXJzKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRsaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChvLCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goYy5vdXRsaWVyVmFsdWUobywgaSkpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHdsKSB7IHZhbHVlcy5wdXNoKHdsKSB9XHJcbiAgICAgICAgICAgIGlmIChxMSkgeyB2YWx1ZXMucHVzaChxMSkgfVxyXG4gICAgICAgICAgICBpZiAocTMpIHsgdmFsdWVzLnB1c2gocTMpIH1cclxuICAgICAgICAgICAgaWYgKHdoKSB7IHZhbHVlcy5wdXNoKHdoKSB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgeU1pbiA9IGQzLm1pbih2YWx1ZXMpO1xyXG4gICAgICAgIHlNYXggPSBkMy5tYXgodmFsdWVzKTtcclxuICAgICAgICB2YXIgbWFyZ2luID0gKHlNYXgteU1pbikqIHRoaXMuY29uZmlnLnkuZG9tYWluTWFyZ2luO1xyXG4gICAgICAgIHlNaW4tPW1hcmdpbjtcclxuICAgICAgICB5TWF4Kz1tYXJnaW47XHJcbiAgICAgICAgdmFyIGRvbWFpbiA9IFsgeU1pbiwgeU1heCBdIDtcclxuXHJcbiAgICAgICAgcGxvdC55LnNjYWxlLmRvbWFpbihkb21haW4pO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXdBeGlzWCgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGF4aXNDb25mID0gdGhpcy5jb25maWcueDtcclxuICAgICAgICB2YXIgYXhpcyA9IHNlbGYuc3ZnRy5zZWxlY3RPckFwcGVuZChcImcuXCIgKyBzZWxmLnByZWZpeENsYXNzKCdheGlzLXgnKSArIFwiLlwiICsgc2VsZi5wcmVmaXhDbGFzcygnYXhpcycpICsgKGF4aXNDb25mLmd1aWRlcyA/ICcnIDogJy4nICsgc2VsZi5wcmVmaXhDbGFzcygnbm8tZ3VpZGVzJykpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgcGxvdC5oZWlnaHQgKyBcIilcIik7XHJcblxyXG4gICAgICAgIHZhciBheGlzVCA9IGF4aXM7XHJcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLnRyYW5zaXRpb24pIHtcclxuICAgICAgICAgICAgYXhpc1QgPSBheGlzLnRyYW5zaXRpb24oKS5lYXNlKFwic2luLWluLW91dFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGF4aXNULmNhbGwocGxvdC54LmF4aXMpO1xyXG5cclxuICAgICAgICBheGlzLnNlbGVjdE9yQXBwZW5kKFwidGV4dC5cIitzZWxmLnByZWZpeENsYXNzKCdsYWJlbCcpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisgKHBsb3Qud2lkdGgvMikgK1wiLFwiKyAocGxvdC5tYXJnaW4uYm90dG9tKSArXCIpXCIpICAvLyB0ZXh0IGlzIGRyYXduIG9mZiB0aGUgc2NyZWVuIHRvcCBsZWZ0LCBtb3ZlIGRvd24gYW5kIG91dCBhbmQgcm90YXRlXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCItMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGF4aXNDb25mLmxhYmVsKTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhd0F4aXNZKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgYXhpc0NvbmYgPSB0aGlzLmNvbmZpZy55O1xyXG4gICAgICAgIHZhciBheGlzID0gc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIiArIHNlbGYucHJlZml4Q2xhc3MoJ2F4aXMteScpICsgXCIuXCIgKyBzZWxmLnByZWZpeENsYXNzKCdheGlzJykgKyAoYXhpc0NvbmYuZ3VpZGVzID8gJycgOiAnLicgKyBzZWxmLnByZWZpeENsYXNzKCduby1ndWlkZXMnKSkpO1xyXG5cclxuICAgICAgICB2YXIgYXhpc1QgPSBheGlzO1xyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy50cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGF4aXNUID0gYXhpcy50cmFuc2l0aW9uKCkuZWFzZShcInNpbi1pbi1vdXRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBheGlzVC5jYWxsKHBsb3QueS5heGlzKTtcclxuXHJcbiAgICAgICAgYXhpcy5zZWxlY3RPckFwcGVuZChcInRleHQuXCIgKyBzZWxmLnByZWZpeENsYXNzKCdsYWJlbCcpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIC1wbG90Lm1hcmdpbi5sZWZ0ICsgXCIsXCIgKyAocGxvdC5oZWlnaHQgLyAyKSArIFwiKXJvdGF0ZSgtOTApXCIpICAvLyB0ZXh0IGlzIGRyYXduIG9mZiB0aGUgc2NyZWVuIHRvcCBsZWZ0LCBtb3ZlIGRvd24gYW5kIG91dCBhbmQgcm90YXRlXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCIxZW1cIilcclxuICAgICAgICAgICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoYXhpc0NvbmYudGl0bGUpO1xyXG4gICAgfTtcclxuXHJcbiAgICBkcmF3Qm94UGxvdHMoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICAgICAgICBwbG90ID0gc2VsZi5wbG90LFxyXG4gICAgICAgICAgICBjb25maWcgPSBzZWxmLmNvbmZpZyxcclxuICAgICAgICAgICAgYm94cGxvdENsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImJveHBsb3QtaXRlbVwiKVxyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBib3hwbG90cyA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoJy4nK2JveHBsb3RDbGFzcykuZGF0YShwbG90LmRhdGEpO1xyXG4gICAgICAgIHZhciBib3hwbG90RW50ZXIgPSBib3hwbG90cy5lbnRlcigpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCBib3hwbG90Q2xhc3MpXHJcbiAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlLW9wYWNpdHknLCAxZS02KVxyXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwtb3BhY2l0eScsIDFlLTYpO1xyXG5cclxuICAgICAgICB2YXIgZHVyYXRpb24gPSAxMDAwO1xyXG4gICAgICAgIHZhciBib3hwbG90c1QgPSBib3hwbG90cztcclxuICAgICAgICBpZiAoc2VsZi50cmFuc2l0aW9uRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgICAgIGJveHBsb3RzVCA9IGJveHBsb3RzLnRyYW5zaXRpb24oKTtcclxuICAgICAgICAgICAgYm94cGxvdHNULmRlbGF5KGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gaSAqIGR1cmF0aW9uIC8gcGxvdC5kYXRhLmxlbmd0aCB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYm94cGxvdHNUXHJcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIHBsb3QuY29sb3IpXHJcbiAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlLW9wYWNpdHknLCAxKVxyXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwtb3BhY2l0eScsIDAuNzUpXHJcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCxpKSA9Pid0cmFuc2xhdGUoJyArIChwbG90LngubWFwKGQsaSkgKyBwbG90Lnguc2NhbGUucmFuZ2VCYW5kKCkgKiAwLjA1KSArICcsIDApJylcclxuICAgICAgICBib3hwbG90cy5leGl0KCkucmVtb3ZlKCk7XHJcblxyXG5cclxuICAgICAgICB2YXIgYm94V2lkdGggPSAhY29uZmlnLm1heEJveFdpZHRoID8gcGxvdC54LnNjYWxlLnJhbmdlQmFuZCgpICogMC45IDogTWF0aC5taW4oY29uZmlnLm1heEJveFdpZHRoLCBNYXRoLm1heChjb25maWcubWluQm94V2lkdGgsIHBsb3QueC5zY2FsZS5yYW5nZUJhbmQoKSAqIDAuOSkpO1xyXG4gICAgICAgIHZhciBib3hMZWZ0ICA9IHBsb3QueC5zY2FsZS5yYW5nZUJhbmQoKSAqIDAuNDUgLSBib3hXaWR0aC8yO1xyXG4gICAgICAgIHZhciBib3hSaWdodCA9IHBsb3QueC5zY2FsZS5yYW5nZUJhbmQoKSAqIDAuNDUgKyBib3hXaWR0aC8yO1xyXG5cclxuICAgICAgICB2YXIgYm94Q2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwiYm94XCIpO1xyXG5cclxuICAgICAgICBib3hwbG90RW50ZXIuYXBwZW5kKCdyZWN0JylcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgYm94Q2xhc3MpXHJcbiAgICAgICAgICAgIC8vIHRvb2x0aXAgZXZlbnRzXHJcbiAgICAgICAgICAgIC5vbignbW91c2VvdmVyJywgZnVuY3Rpb24oZCxpKSB7XHJcbiAgICAgICAgICAgICAgICBkMy5zZWxlY3QodGhpcykuY2xhc3NlZCgnaG92ZXInLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHZhciBodG1sID0gJ1EzOiAnK2NvbmZpZy5RMyhkLGkpKyc8YnIvPlEyOiAnK2NvbmZpZy5RMihkLGkpKyc8YnIvPlExOiAnK2NvbmZpZy5RMShkLGkpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zaG93VG9vbHRpcChodG1sKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oJ21vdXNlb3V0JywgZnVuY3Rpb24oZCxpKSB7XHJcbiAgICAgICAgICAgICAgICBkMy5zZWxlY3QodGhpcykuY2xhc3NlZCgnaG92ZXInLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmhpZGVUb29sdGlwKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgYm94UmVjdHMgPSBib3hwbG90cy5zZWxlY3QoJ3JlY3QuJytib3hDbGFzcyk7XHJcblxyXG4gICAgICAgIHZhciBib3hSZWN0c1QgPSBib3hSZWN0cztcclxuICAgICAgICBpZiAoc2VsZi5jb25maWcudHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICBib3hSZWN0c1QgPSBib3hSZWN0cy50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBib3hSZWN0c1QuYXR0cigneScsIChkLGkpID0+IHBsb3QueS5zY2FsZShjb25maWcuUTMoZCkpKVxyXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCBib3hXaWR0aClcclxuICAgICAgICAgICAgLmF0dHIoJ3gnLCBib3hMZWZ0IClcclxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkLGkpID0+IE1hdGguYWJzKHBsb3QueS5zY2FsZShjb25maWcuUTMoZCkpIC0gcGxvdC55LnNjYWxlKGNvbmZpZy5RMShkKSkpIHx8IDEpXHJcbiAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgcGxvdC5jb2xvcik7XHJcblxyXG4gICAgICAgIC8vIG1lZGlhbiBsaW5lXHJcbiAgICAgICAgdmFyIG1lZGlhbkNsYXNzID0gc2VsZi5wcmVmaXhDbGFzcygnbWVkaWFuJyk7XHJcbiAgICAgICAgYm94cGxvdEVudGVyLmFwcGVuZCgnbGluZScpLmF0dHIoJ2NsYXNzJywgbWVkaWFuQ2xhc3MpO1xyXG5cclxuICAgICAgICBib3hwbG90cy5zZWxlY3QoJ2xpbmUuJyttZWRpYW5DbGFzcylcclxuICAgICAgICAgICAgLmF0dHIoJ3gxJywgYm94TGVmdClcclxuICAgICAgICAgICAgLmF0dHIoJ3kxJywgKGQsaSkgPT4gcGxvdC55LnNjYWxlKGNvbmZpZy5RMihkKSkpXHJcbiAgICAgICAgICAgIC5hdHRyKCd4MicsIGJveFJpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cigneTInLCAoZCxpKSA9PiBwbG90Lnkuc2NhbGUoY29uZmlnLlEyKGQpKSk7XHJcblxyXG5cclxuICAgICAgICAvL3doaXNrZXJzXHJcblxyXG4gICAgICAgIHZhciB3aGlza2VyQ2xhc3M9IHNlbGYucHJlZml4Q2xhc3MoXCJ3aGlza2VyXCIpLFxyXG4gICAgICAgICAgICB0aWNrQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwiYm94cGxvdC10aWNrXCIpO1xyXG5cclxuICAgICAgICB2YXIgd2hpc2tlcnMgPSBbe2tleTogJ2xvdycsIHZhbHVlOiBjb25maWcuV2x9LCB7a2V5OiAnaGlnaCcsIHZhbHVlOiBjb25maWcuV2h9XTtcclxuXHJcbiAgICAgICAgYm94cGxvdEVudGVyLmVhY2goZnVuY3Rpb24oZCxpKSB7XHJcbiAgICAgICAgICAgIHZhciBib3ggPSBkMy5zZWxlY3QodGhpcyk7XHJcblxyXG4gICAgICAgICAgICB3aGlza2Vycy5mb3JFYWNoKGY9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZi52YWx1ZShkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJveC5hcHBlbmQoJ2xpbmUnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsIHBsb3QuY29sb3IoZCxpKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgd2hpc2tlckNsYXNzKycgJyArIGJveHBsb3RDbGFzcysnLScrZi5rZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJveC5hcHBlbmQoJ2xpbmUnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsIHBsb3QuY29sb3IoZCxpKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgdGlja0NsYXNzKycgJyArIGJveHBsb3RDbGFzcysnLScrZi5rZXkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgd2hpc2tlcnMuZm9yRWFjaChmID0+IHtcclxuICAgICAgICAgICAgdmFyIGVuZHBvaW50ID0gKGYua2V5ID09PSAnbG93JykgPyBjb25maWcuUTEgOiBjb25maWcuUTM7XHJcblxyXG4gICAgICAgICAgICBib3hwbG90cy5zZWxlY3QoJy4nK3doaXNrZXJDbGFzcysnLicrYm94cGxvdENsYXNzKyctJytmLmtleSlcclxuICAgICAgICAgICAgICAgIC5hdHRyKCd4MScsIHBsb3QueC5zY2FsZS5yYW5nZUJhbmQoKSAqIDAuNDUgKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3kxJywgKGQsaSkgPT4gcGxvdC55LnNjYWxlKGYudmFsdWUoZCkpKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3gyJywgcGxvdC54LnNjYWxlLnJhbmdlQmFuZCgpICogMC40NSApXHJcbiAgICAgICAgICAgICAgICAuYXR0cigneTInLCAoZCxpKSA9PiBwbG90Lnkuc2NhbGUoZW5kcG9pbnQoZCkpKTtcclxuICAgICAgICAgICAgYm94cGxvdHMuc2VsZWN0KCcuJyt0aWNrQ2xhc3MrJy4nK2JveHBsb3RDbGFzcysnLScrZi5rZXkpXHJcbiAgICAgICAgICAgICAgICAuYXR0cigneDEnLCBib3hMZWZ0IClcclxuICAgICAgICAgICAgICAgIC5hdHRyKCd5MScsIChkLGkpID0+IHBsb3QueS5zY2FsZShmLnZhbHVlKGQpKSlcclxuICAgICAgICAgICAgICAgIC5hdHRyKCd4MicsIGJveFJpZ2h0IClcclxuICAgICAgICAgICAgICAgIC5hdHRyKCd5MicsIChkLGkpID0+IHBsb3QueS5zY2FsZShmLnZhbHVlKGQpKSk7XHJcblxyXG4gICAgICAgICAgICBib3hwbG90RW50ZXIuc2VsZWN0QWxsKCcuJytib3hwbG90Q2xhc3MrJy0nK2Yua2V5KVxyXG4gICAgICAgICAgICAgICAgLm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbihkLGksaikge1xyXG4gICAgICAgICAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKCdob3ZlcicsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2hvd1Rvb2x0aXAoZi52YWx1ZShkKSlcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAub24oJ21vdXNlb3V0JywgZnVuY3Rpb24oZCxpLGopIHtcclxuICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QodGhpcykuY2xhc3NlZCgnaG92ZXInLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5oaWRlVG9vbHRpcCgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIC8vIG91dGxpZXJzXHJcbiAgICAgICAgdmFyIG91dGxpZXJDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJvdXRsaWVyXCIpO1xyXG4gICAgICAgIHZhciBvdXRsaWVycyA9IGJveHBsb3RzLnNlbGVjdEFsbCgnLicrb3V0bGllckNsYXNzKS5kYXRhKChkLGkpID0+IGNvbmZpZy5vdXRsaWVycyhkLGkpIHx8IFtdKTtcclxuXHJcbiAgICAgICAgdmFyIG91dGxpZXJFbnRlckNpcmNsZSA9IG91dGxpZXJzLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCBvdXRsaWVyQ2xhc3MpXHJcbiAgICAgICAgICAgIC5zdHlsZSgnei1pbmRleCcsIDkwMDApO1xyXG5cclxuICAgICAgICBvdXRsaWVyRW50ZXJDaXJjbGVcclxuICAgICAgICAgICAgLm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbiAoZCwgaSwgaikge1xyXG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoJ2hvdmVyJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNob3dUb29sdGlwKGNvbmZpZy5vdXRsaWVyTGFiZWwoZCxpKSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm9uKCdtb3VzZW91dCcsIGZ1bmN0aW9uIChkLCBpLCBqKSB7XHJcbiAgICAgICAgICAgICAgICBkMy5zZWxlY3QodGhpcykuY2xhc3NlZCgnaG92ZXInLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmhpZGVUb29sdGlwKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgb3V0bGllcnNUID0gb3V0bGllcnM7XHJcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLnRyYW5zaXRpb24pIHtcclxuICAgICAgICAgICAgb3V0bGllcnNUID0gb3V0bGllcnMudHJhbnNpdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvdXRsaWVyc1RcclxuICAgICAgICAgICAgLmF0dHIoJ2N4JywgcGxvdC54LnNjYWxlLnJhbmdlQmFuZCgpICogMC40NSlcclxuICAgICAgICAgICAgLmF0dHIoJ2N5JywgKGQsaSkgPT4gcGxvdC55LnNjYWxlKGNvbmZpZy5vdXRsaWVyVmFsdWUoZCxpKSkpXHJcbiAgICAgICAgICAgIC5hdHRyKCdyJywgJzMnKTtcclxuICAgICAgICBvdXRsaWVycy5leGl0KCkucmVtb3ZlKCk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUobmV3RGF0YSl7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKG5ld0RhdGEpO1xyXG4gICAgICAgIHRoaXMuZHJhd0F4aXNYKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3QXhpc1koKTtcclxuICAgICAgICB0aGlzLmRyYXdCb3hQbG90cygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cENvbG9yKCkge1xyXG4gICAgICAgIHZhciBzZWxmPXRoaXM7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgaWYoY29uZi5kM0NvbG9yQ2F0ZWdvcnkpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuY29sb3JDYXRlZ29yeSA9IGQzLnNjYWxlW2NvbmYuZDNDb2xvckNhdGVnb3J5XSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY29sb3JWYWx1ZSA9IGNvbmYuY29sb3I7XHJcbiAgICAgICAgaWYgKGNvbG9yVmFsdWUgJiYgdHlwZW9mIGNvbG9yVmFsdWUgPT09ICdzdHJpbmcnIHx8IGNvbG9yVmFsdWUgaW5zdGFuY2VvZiBTdHJpbmcpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuY29sb3IgPSBjb2xvclZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKHRoaXMucGxvdC5jb2xvckNhdGVnb3J5KXtcclxuICAgICAgICAgICAgc2VsZi5wbG90LmNvbG9yVmFsdWU9Y29sb3JWYWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmNvbG9yID0gZCA9PiAgc2VsZi5wbG90LmNvbG9yQ2F0ZWdvcnkodGhpcy5wbG90LngudmFsdWUoZCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0JveFBsb3RCYXNlLCBCb3hQbG90QmFzZUNvbmZpZ30gZnJvbSBcIi4vYm94LXBsb3QtYmFzZVwiO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5pbXBvcnQge1N0YXRpc3RpY3NVdGlsc30gZnJvbSAnLi9zdGF0aXN0aWNzLXV0aWxzJ1xyXG5cclxuZXhwb3J0IGNsYXNzIEJveFBsb3RDb25maWcgZXh0ZW5kcyBCb3hQbG90QmFzZUNvbmZpZ3tcclxuXHJcbiAgICBzdmdDbGFzcyA9IHRoaXMuY3NzQ2xhc3NQcmVmaXggKyAnYm94LXBsb3QnO1xyXG4gICAgc2hvd0xlZ2VuZCA9IHRydWU7XHJcbiAgICBzaG93VG9vbHRpcCA9IHRydWU7XHJcbiAgICB5ID0gey8vIFkgYXhpcyBjb25maWdcclxuICAgICAgICB0aXRsZTogJycsXHJcbiAgICAgICAga2V5OiB1bmRlZmluZWQsXHJcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHRoaXMueS5rZXk9PT11bmRlZmluZWQgPyBkIDogZFt0aGlzLnkua2V5XX0gLCAvLyB5IHZhbHVlIGFjY2Vzc29yXHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCIsXHJcbiAgICAgICAgb3JpZW50OiAnbGVmdCcsXHJcbiAgICAgICAgZG9tYWluTWFyZ2luOiAwLjEsXHJcbiAgICAgICAgZ3VpZGVzOiB0cnVlIC8vc2hvdyBheGlzIGd1aWRlc1xyXG4gICAgfTtcclxuICAgIHNlcmllcyA9IGZhbHNlO1xyXG4gICAgZ3JvdXBzPXtcclxuICAgICAgICBrZXk6IHVuZGVmaW5lZCxcclxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oZCkgeyByZXR1cm4gdGhpcy5ncm91cHMua2V5PT09dW5kZWZpbmVkID8gbnVsbCA6IGRbdGhpcy5ncm91cHMua2V5XX0gICwgLy8gZ3JvdXBpbmcgdmFsdWUgYWNjZXNzb3IsXHJcbiAgICAgICAgbGFiZWw6IFwiXCIsXHJcbiAgICAgICAgZGlzcGxheVZhbHVlOiB1bmRlZmluZWQgLy8gb3B0aW9uYWwgZnVuY3Rpb24gcmV0dXJuaW5nIGRpc3BsYXkgdmFsdWUgKHNlcmllcyBsYWJlbCkgZm9yIGdpdmVuIGdyb3VwIHZhbHVlLCBvciBvYmplY3QvYXJyYXkgbWFwcGluZyB2YWx1ZSB0byBkaXNwbGF5IHZhbHVlXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgaWYoY3VzdG9tKXtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEJveFBsb3QgZXh0ZW5kcyBCb3hQbG90QmFzZXtcclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIG5ldyBCb3hQbG90Q29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpe1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IEJveFBsb3RDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGF0YVRvUGxvdCgpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgY29uZiA9IHNlbGYuY29uZmlnO1xyXG4gICAgICAgIHNlbGYucGxvdC5ncm91cGluZ0VuYWJsZWQgPSB0aGlzLmlzR3JvdXBpbmdFbmFibGVkKCk7XHJcblxyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIGlmKCFzZWxmLnBsb3QuZ3JvdXBpbmdFbmFibGVkICl7XHJcbiAgICAgICAgICAgIHNlbGYucGxvdC5ncm91cGVkRGF0YSA9ICBbe1xyXG4gICAgICAgICAgICAgICAga2V5OiBudWxsLFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICcnLFxyXG4gICAgICAgICAgICAgICAgdmFsdWVzOiBkYXRhXHJcbiAgICAgICAgICAgIH1dO1xyXG4gICAgICAgICAgICBzZWxmLnBsb3QuZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBpZihzZWxmLmNvbmZpZy5zZXJpZXMpe1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wbG90Lmdyb3VwZWREYXRhID0gIGRhdGEubWFwKHM9PntcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogcy5rZXksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBzLmxhYmVsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IHMudmFsdWVzXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wbG90Lmdyb3VwVmFsdWUgPSBkID0+IGNvbmYuZ3JvdXBzLnZhbHVlLmNhbGwoY29uZiwgZCk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QuZ3JvdXBlZERhdGEgPSBkMy5uZXN0KCkua2V5KHRoaXMucGxvdC5ncm91cFZhbHVlKS5lbnRyaWVzKGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLnBsb3QuZGF0YUxlbmd0aCA9IGQzLnN1bSh0aGlzLnBsb3QuZ3JvdXBlZERhdGEsIHM9PnMudmFsdWVzLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuICAgICAgICBzZWxmLnBsb3QuZ3JvdXBlZERhdGEuZm9yRWFjaChzPT57XHJcbiAgICAgICAgICAgIGlmKCFBcnJheS5pc0FycmF5KHMudmFsdWVzKSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciB2YWx1ZXMgPSBzLnZhbHVlcy5tYXAoZD0+cGFyc2VGbG9hdChzZWxmLmNvbmZpZy55LnZhbHVlLmNhbGwoc2VsZi5jb25maWcsIGQpKSk7XHJcbiAgICAgICAgICAgIHMudmFsdWVzLlExID0gU3RhdGlzdGljc1V0aWxzLnF1YW50aWxlKHZhbHVlcywgMC4yNSk7XHJcbiAgICAgICAgICAgIHMudmFsdWVzLlEyID0gU3RhdGlzdGljc1V0aWxzLnF1YW50aWxlKHZhbHVlcywgMC41KTtcclxuICAgICAgICAgICAgcy52YWx1ZXMuUTMgPSBTdGF0aXN0aWNzVXRpbHMucXVhbnRpbGUodmFsdWVzLCAwLjc1KTtcclxuICAgICAgICAgICAgcy52YWx1ZXMud2hpc2tlckxvdyA9IGQzLm1pbih2YWx1ZXMpO1xyXG4gICAgICAgICAgICBzLnZhbHVlcy53aGlza2VySGlnaCA9IGQzLm1heCh2YWx1ZXMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gc2VsZi5wbG90Lmdyb3VwZWREYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIGlzR3JvdXBpbmdFbmFibGVkKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnNlcmllcyB8fCAhISh0aGlzLmNvbmZpZy5ncm91cHMgJiYgdGhpcy5jb25maWcuZ3JvdXBzLnZhbHVlKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NoYXJ0LCBDaGFydENvbmZpZ30gZnJvbSBcIi4vY2hhcnRcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IHtMZWdlbmR9IGZyb20gXCIuL2xlZ2VuZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJ0V2l0aENvbG9yR3JvdXBzQ29uZmlnIGV4dGVuZHMgQ2hhcnRDb25maWd7XHJcblxyXG4gICAgc2hvd0xlZ2VuZD10cnVlO1xyXG4gICAgbGVnZW5kPXtcclxuICAgICAgICB3aWR0aDogODAsXHJcbiAgICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgICBzaGFwZVdpZHRoOiAyMFxyXG4gICAgfTtcclxuICAgIGdyb3Vwcz17XHJcbiAgICAgICAga2V5OiAyLFxyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihkKSB7IHJldHVybiBkW3RoaXMuZ3JvdXBzLmtleV19ICAsIC8vIGdyb3VwaW5nIHZhbHVlIGFjY2Vzc29yLFxyXG4gICAgICAgIGxhYmVsOiBcIlwiLFxyXG4gICAgICAgIGRpc3BsYXlWYWx1ZTogdW5kZWZpbmVkIC8vIG9wdGlvbmFsIGZ1bmN0aW9uIHJldHVybmluZyBkaXNwbGF5IHZhbHVlIChzZXJpZXMgbGFiZWwpIGZvciBnaXZlbiBncm91cCB2YWx1ZSwgb3Igb2JqZWN0L2FycmF5IG1hcHBpbmcgdmFsdWUgdG8gZGlzcGxheSB2YWx1ZVxyXG4gICAgfTtcclxuICAgIHNlcmllcyA9IGZhbHNlO1xyXG4gICAgY29sb3IgPSAgdW5kZWZpbmVkOy8vIHN0cmluZyBvciBmdW5jdGlvbiByZXR1cm5pbmcgY29sb3IncyB2YWx1ZSBmb3IgY29sb3Igc2NhbGVcclxuICAgIGQzQ29sb3JDYXRlZ29yeT0gJ2NhdGVnb3J5MTAnO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBpZihjdXN0b20pe1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJ0V2l0aENvbG9yR3JvdXBzIGV4dGVuZHMgQ2hhcnR7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBzdXBlcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBuZXcgQ2hhcnRXaXRoQ29sb3JHcm91cHNDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZyl7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgQ2hhcnRXaXRoQ29sb3JHcm91cHNDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKXtcclxuICAgICAgICBzdXBlci5pbml0UGxvdCgpO1xyXG4gICAgICAgIHZhciBzZWxmPXRoaXM7XHJcblxyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcbiAgICAgICBcclxuICAgICAgICB0aGlzLnBsb3Quc2hvd0xlZ2VuZCA9IGNvbmYuc2hvd0xlZ2VuZDtcclxuICAgICAgICBpZih0aGlzLnBsb3Quc2hvd0xlZ2VuZCl7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5tYXJnaW4ucmlnaHQgPSBjb25mLm1hcmdpbi5yaWdodCArIGNvbmYubGVnZW5kLndpZHRoK2NvbmYubGVnZW5kLm1hcmdpbioyO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldHVwR3JvdXBzKCk7XHJcbiAgICAgICAgdGhpcy5wbG90LmRhdGEgPSB0aGlzLmdldERhdGFUb1Bsb3QoKTtcclxuICAgICAgICB0aGlzLmdyb3VwRGF0YSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGlzR3JvdXBpbmdFbmFibGVkKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnNlcmllcyB8fCAhISh0aGlzLmNvbmZpZy5ncm91cHMgJiYgdGhpcy5jb25maWcuZ3JvdXBzLnZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wdXRlR3JvdXBDb2xvckRvbWFpbigpe1xyXG4gICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhkMy5tYXAodGhpcy5kYXRhLCBkID0+IHRoaXMucGxvdC5ncm91cFZhbHVlKGQpKVsnXyddKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cEdyb3VwcygpIHtcclxuICAgICAgICB2YXIgc2VsZj10aGlzO1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC5ncm91cGluZ0VuYWJsZWQgPSB0aGlzLmlzR3JvdXBpbmdFbmFibGVkKCk7XHJcbiAgICAgICAgdmFyIGRvbWFpbiA9IFtdO1xyXG4gICAgICAgIGlmKHRoaXMucGxvdC5ncm91cGluZ0VuYWJsZWQpe1xyXG4gICAgICAgICAgICBzZWxmLnBsb3QuZ3JvdXBUb0xhYmVsID0ge307XHJcbiAgICAgICAgICAgIGlmKHRoaXMuY29uZmlnLnNlcmllcyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuZ3JvdXBWYWx1ZSA9IHMgPT4gcy5rZXk7XHJcbiAgICAgICAgICAgICAgICBkb21haW4gPSB0aGlzLmNvbXB1dGVHcm91cENvbG9yRG9tYWluKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLmZvckVhY2gocz0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucGxvdC5ncm91cFRvTGFiZWxbcy5rZXldID0gcy5sYWJlbHx8cy5rZXk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5ncm91cFZhbHVlID0gZCA9PiBjb25mLmdyb3Vwcy52YWx1ZS5jYWxsKGNvbmYsIGQpO1xyXG4gICAgICAgICAgICAgICAgZG9tYWluID0gdGhpcy5jb21wdXRlR3JvdXBDb2xvckRvbWFpbigpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGdldExhYmVsPSBrID0+IGs7XHJcbiAgICAgICAgICAgICAgICBpZihzZWxmLmNvbmZpZy5ncm91cHMuZGlzcGxheVZhbHVlKXtcclxuICAgICAgICAgICAgICAgICAgICBpZihVdGlscy5pc0Z1bmN0aW9uKHNlbGYuY29uZmlnLmdyb3Vwcy5kaXNwbGF5VmFsdWUpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TGFiZWwgPSBrPT5zZWxmLmNvbmZpZy5ncm91cHMuZGlzcGxheVZhbHVlKGspIHx8IGs7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYoVXRpbHMuaXNPYmplY3Qoc2VsZi5jb25maWcuZ3JvdXBzLmRpc3BsYXlWYWx1ZSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRMYWJlbCA9IGsgPT4gc2VsZi5jb25maWcuZ3JvdXBzLmRpc3BsYXlWYWx1ZVtrXSB8fCBrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRvbWFpbi5mb3JFYWNoKGs9PntcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnBsb3QuZ3JvdXBUb0xhYmVsW2tdID0gZ2V0TGFiZWwoayk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuZ3JvdXBWYWx1ZSA9IGQgPT4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKGNvbmYuZDNDb2xvckNhdGVnb3J5KXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmNvbG9yQ2F0ZWdvcnkgPSBkMy5zY2FsZVtjb25mLmQzQ29sb3JDYXRlZ29yeV0oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNvbG9yVmFsdWUgPSBjb25mLmNvbG9yO1xyXG4gICAgICAgIGlmIChjb2xvclZhbHVlICYmIHR5cGVvZiBjb2xvclZhbHVlID09PSAnc3RyaW5nJyB8fCBjb2xvclZhbHVlIGluc3RhbmNlb2YgU3RyaW5nKXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmNvbG9yID0gY29sb3JWYWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5wbG90LnNlcmllc0NvbG9yID0gdGhpcy5wbG90LmNvbG9yO1xyXG4gICAgICAgIH1lbHNlIGlmKHRoaXMucGxvdC5jb2xvckNhdGVnb3J5KXtcclxuICAgICAgICAgICAgc2VsZi5wbG90LmNvbG9yVmFsdWU9Y29sb3JWYWx1ZTtcclxuICAgICAgICAgICAgc2VsZi5wbG90LmNvbG9yQ2F0ZWdvcnkuZG9tYWluKGRvbWFpbik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnBsb3Quc2VyaWVzQ29sb3IgPSBzID0+ICBzZWxmLnBsb3QuY29sb3JDYXRlZ29yeShzLmtleSk7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5jb2xvciA9IGQgPT4gIHNlbGYucGxvdC5jb2xvckNhdGVnb3J5KHRoaXMucGxvdC5ncm91cFZhbHVlKGQpKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5jb2xvciA9IHRoaXMucGxvdC5zZXJpZXNDb2xvciA9IHM9PiAnYmxhY2snXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBncm91cERhdGEoKXtcclxuICAgICAgICB2YXIgc2VsZj10aGlzO1xyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5wbG90LmRhdGE7XHJcbiAgICAgICAgaWYoIXNlbGYucGxvdC5ncm91cGluZ0VuYWJsZWQgKXtcclxuICAgICAgICAgICAgc2VsZi5wbG90Lmdyb3VwZWREYXRhID0gIFt7XHJcbiAgICAgICAgICAgICAgICBrZXk6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBsYWJlbDogJycsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZXM6IGRhdGFcclxuICAgICAgICAgICAgfV07XHJcbiAgICAgICAgICAgIHNlbGYucGxvdC5kYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGg7XHJcbiAgICAgICAgfWVsc2V7XHJcblxyXG4gICAgICAgICAgICBpZihzZWxmLmNvbmZpZy5zZXJpZXMpe1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wbG90Lmdyb3VwZWREYXRhID0gIGRhdGEubWFwKHM9PntcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogcy5rZXksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBzLmxhYmVsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IHMudmFsdWVzXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wbG90Lmdyb3VwZWREYXRhID0gZDMubmVzdCgpLmtleSh0aGlzLnBsb3QuZ3JvdXBWYWx1ZSkuZW50cmllcyhkYXRhKTtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC5ncm91cGVkRGF0YS5mb3JFYWNoKGcgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGcubGFiZWwgPSBzZWxmLnBsb3QuZ3JvdXBUb0xhYmVsW2cua2V5XTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLnBsb3QuZGF0YUxlbmd0aCA9IGQzLnN1bSh0aGlzLnBsb3QuZ3JvdXBlZERhdGEsIHM9PnMudmFsdWVzLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB0aGlzLnBsb3Quc2VyaWVzQ29sb3JcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGF0YVRvUGxvdCgpe1xyXG4gICAgICAgIGlmKCF0aGlzLnBsb3QuZ3JvdXBpbmdFbmFibGVkIHx8ICF0aGlzLmVuYWJsZWRHcm91cHMpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmZpbHRlcihkID0+IHRoaXMuZW5hYmxlZEdyb3Vwcy5pbmRleE9mKHRoaXMucGxvdC5ncm91cFZhbHVlKGQpKT4tMSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICB1cGRhdGUobmV3RGF0YSl7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKG5ld0RhdGEpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTGVnZW5kKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICB1cGRhdGVMZWdlbmQoKSB7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID10aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG5cclxuICAgICAgICB2YXIgc2NhbGUgPSBwbG90LmNvbG9yQ2F0ZWdvcnk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgaWYoIXNjYWxlLmRvbWFpbigpIHx8IHNjYWxlLmRvbWFpbigpLmxlbmd0aDwyKXtcclxuICAgICAgICAgICAgcGxvdC5zaG93TGVnZW5kID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZighcGxvdC5zaG93TGVnZW5kKXtcclxuICAgICAgICAgICAgaWYocGxvdC5sZWdlbmQgJiYgcGxvdC5sZWdlbmQuY29udGFpbmVyKXtcclxuICAgICAgICAgICAgICAgIHBsb3QubGVnZW5kLmNvbnRhaW5lci5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdmFyIGxlZ2VuZFggPSB0aGlzLnBsb3Qud2lkdGggKyB0aGlzLmNvbmZpZy5sZWdlbmQubWFyZ2luO1xyXG4gICAgICAgIHZhciBsZWdlbmRZID0gdGhpcy5jb25maWcubGVnZW5kLm1hcmdpbjtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmQgPSBuZXcgTGVnZW5kKHRoaXMuc3ZnLCB0aGlzLnN2Z0csIHNjYWxlLCBsZWdlbmRYLCBsZWdlbmRZKTtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmRDb2xvciA9IHBsb3QubGVnZW5kLmNvbG9yKClcclxuICAgICAgICAgICAgLnNoYXBlV2lkdGgodGhpcy5jb25maWcubGVnZW5kLnNoYXBlV2lkdGgpXHJcbiAgICAgICAgICAgIC5vcmllbnQoJ3ZlcnRpY2FsJylcclxuICAgICAgICAgICAgLnNjYWxlKHNjYWxlKVxyXG4gICAgICAgICAgICAubGFiZWxzKHNjYWxlLmRvbWFpbigpLm1hcCh2PT5wbG90Lmdyb3VwVG9MYWJlbFt2XSkpO1xyXG5cclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmRDb2xvci5vbignY2VsbGNsaWNrJywgYz0+IHNlbGYub25MZWdlbmRDZWxsQ2xpY2soYykpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHBsb3QubGVnZW5kLmNvbnRhaW5lclxyXG4gICAgICAgICAgICAuY2FsbChwbG90LmxlZ2VuZENvbG9yKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVMZWdlbmRDZWxsU3RhdHVzZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkxlZ2VuZENlbGxDbGljayhjZWxsVmFsdWUpe1xyXG4gICAgICAgIHRoaXMudXBkYXRlRW5hYmxlZEdyb3VwcyhjZWxsVmFsdWUpO1xyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlTGVnZW5kQ2VsbFN0YXR1c2VzKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLnBsb3QubGVnZW5kLmNvbnRhaW5lci5zZWxlY3RBbGwoXCJnLmNlbGxcIikuZWFjaChmdW5jdGlvbihjZWxsKXtcclxuICAgICAgICAgICAgdmFyIGlzRGlzYWJsZWQgPSBzZWxmLmVuYWJsZWRHcm91cHMgJiYgc2VsZi5lbmFibGVkR3JvdXBzLmluZGV4T2YoY2VsbCk8MDtcclxuICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoXCJvZGMtZGlzYWJsZWRcIiwgaXNEaXNhYmxlZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlRW5hYmxlZEdyb3VwcyhjZWxsVmFsdWUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZEdyb3Vwcykge1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZWRHcm91cHMgPSB0aGlzLnBsb3QuY29sb3JDYXRlZ29yeS5kb21haW4oKS5zbGljZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmVuYWJsZWRHcm91cHMuaW5kZXhPZihjZWxsVmFsdWUpO1xyXG5cclxuICAgICAgICBpZiAoaW5kZXggPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZEdyb3Vwcy5wdXNoKGNlbGxWYWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5lbmFibGVkR3JvdXBzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZEdyb3Vwcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5lbmFibGVkR3JvdXBzID0gdGhpcy5wbG90LmNvbG9yQ2F0ZWdvcnkuZG9tYWluKCkuc2xpY2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNldERhdGEoZGF0YSl7XHJcbiAgICAgICAgc3VwZXIuc2V0RGF0YShkYXRhKTtcclxuICAgICAgICB0aGlzLmVuYWJsZWRHcm91cHMgPSBudWxsO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJ0Q29uZmlnIHtcclxuICAgIGNzc0NsYXNzUHJlZml4ID0gXCJvZGMtXCI7XHJcbiAgICBzdmdDbGFzcyA9IHRoaXMuY3NzQ2xhc3NQcmVmaXggKyAnbXctZDMtY2hhcnQnO1xyXG4gICAgd2lkdGggPSB1bmRlZmluZWQ7XHJcbiAgICBoZWlnaHQgPSB1bmRlZmluZWQ7XHJcbiAgICBtYXJnaW4gPSB7XHJcbiAgICAgICAgbGVmdDogNTAsXHJcbiAgICAgICAgcmlnaHQ6IDMwLFxyXG4gICAgICAgIHRvcDogMzAsXHJcbiAgICAgICAgYm90dG9tOiA1MFxyXG4gICAgfTtcclxuICAgIHNob3dUb29sdGlwID0gZmFsc2U7XHJcbiAgICB0cmFuc2l0aW9uID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pIHtcclxuICAgICAgICBpZiAoY3VzdG9tKSB7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJ0IHtcclxuICAgIHV0aWxzID0gVXRpbHM7XHJcbiAgICBiYXNlQ29udGFpbmVyO1xyXG4gICAgc3ZnO1xyXG4gICAgY29uZmlnO1xyXG4gICAgcGxvdCA9IHtcclxuICAgICAgICBtYXJnaW46IHt9XHJcbiAgICB9O1xyXG4gICAgX2F0dGFjaGVkID0ge307XHJcbiAgICBfbGF5ZXJzID0ge307XHJcbiAgICBfZXZlbnRzID0ge307XHJcbiAgICBfaXNBdHRhY2hlZDtcclxuICAgIF9pc0luaXRpYWxpemVkPWZhbHNlO1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihiYXNlLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9pc0F0dGFjaGVkID0gYmFzZSBpbnN0YW5jZW9mIENoYXJ0O1xyXG5cclxuICAgICAgICB0aGlzLmJhc2VDb250YWluZXIgPSBiYXNlO1xyXG5cclxuICAgICAgICB0aGlzLnNldENvbmZpZyhjb25maWcpO1xyXG5cclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgICB0aGlzLnBvc3RJbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZykge1xyXG4gICAgICAgIGlmICghY29uZmlnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gbmV3IENoYXJ0Q29uZmlnKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRhKGRhdGEpIHtcclxuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHJcbiAgICAgICAgc2VsZi5pbml0UGxvdCgpO1xyXG4gICAgICAgIHNlbGYuaW5pdFN2ZygpO1xyXG5cclxuICAgICAgICBpZighdGhpcy5faXNJbml0aWFsaXplZCl7XHJcbiAgICAgICAgICAgIHNlbGYuaW5pdFRvb2x0aXAoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2VsZi5kcmF3KCk7XHJcbiAgICAgICAgdGhpcy5faXNJbml0aWFsaXplZD10cnVlO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHBvc3RJbml0KCl7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXRTdmcoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBjb25maWcgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgdmFyIG1hcmdpbiA9IHNlbGYucGxvdC5tYXJnaW47XHJcbiAgICAgICAgdmFyIHdpZHRoID0gc2VsZi5wbG90LndpZHRoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQ7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IHNlbGYucGxvdC5oZWlnaHQgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbTtcclxuICAgICAgICB2YXIgYXNwZWN0ID0gd2lkdGggLyBoZWlnaHQ7XHJcbiAgICAgICAgaWYoIXNlbGYuX2lzQXR0YWNoZWQpe1xyXG4gICAgICAgICAgICBpZighdGhpcy5faXNJbml0aWFsaXplZCl7XHJcbiAgICAgICAgICAgICAgICBkMy5zZWxlY3Qoc2VsZi5iYXNlQ29udGFpbmVyKS5zZWxlY3QoXCJzdmdcIikucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2VsZi5zdmcgPSBkMy5zZWxlY3Qoc2VsZi5iYXNlQ29udGFpbmVyKS5zZWxlY3RPckFwcGVuZChcInN2Z1wiKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuc3ZnXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ2aWV3Qm94XCIsIFwiMCAwIFwiICsgXCIgXCIgKyB3aWR0aCArIFwiIFwiICsgaGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJwcmVzZXJ2ZUFzcGVjdFJhdGlvXCIsIFwieE1pZFlNaWQgbWVldFwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBjb25maWcuc3ZnQ2xhc3MpO1xyXG4gICAgICAgICAgICBzZWxmLnN2Z0cgPSBzZWxmLnN2Zy5zZWxlY3RPckFwcGVuZChcImcubWFpbi1ncm91cFwiKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5iYXNlQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgc2VsZi5zdmcgPSBzZWxmLmJhc2VDb250YWluZXIuc3ZnO1xyXG4gICAgICAgICAgICBzZWxmLnN2Z0cgPSBzZWxmLnN2Zy5zZWxlY3RPckFwcGVuZChcImcubWFpbi1ncm91cC5cIitjb25maWcuc3ZnQ2xhc3MpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWxmLnN2Z0cuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIG1hcmdpbi5sZWZ0ICsgXCIsXCIgKyBtYXJnaW4udG9wICsgXCIpXCIpO1xyXG5cclxuICAgICAgICBpZiAoIWNvbmZpZy53aWR0aCB8fCBjb25maWcuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdCh3aW5kb3cpXHJcbiAgICAgICAgICAgICAgICAub24oXCJyZXNpemVcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0cmFuc2l0aW9uID0gc2VsZi5jb25maWcudHJhbnNpdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbmZpZy50cmFuc2l0aW9uPWZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29uZmlnLnRyYW5zaXRpb24gPSB0cmFuc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXRUb29sdGlwKCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy5zaG93VG9vbHRpcCkge1xyXG4gICAgICAgICAgICBpZighc2VsZi5faXNBdHRhY2hlZCApe1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wbG90LnRvb2x0aXAgPSBkMy5zZWxlY3QoXCJib2R5XCIpLnNlbGVjdE9yQXBwZW5kKCdkaXYuJytzZWxmLmNvbmZpZy5jc3NDbGFzc1ByZWZpeCsndG9vbHRpcCcpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QudG9vbHRpcD0gc2VsZi5iYXNlQ29udGFpbmVyLnBsb3QudG9vbHRpcDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgc2VsZi5wbG90LnRvb2x0aXAgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpIHtcclxuICAgICAgICB2YXIgbWFyZ2luID0gdGhpcy5jb25maWcubWFyZ2luO1xyXG4gICAgICAgIHRoaXMucGxvdCA9IHRoaXMucGxvdCB8fCB7fTtcclxuICAgICAgICB0aGlzLnBsb3QubWFyZ2luID0ge1xyXG4gICAgICAgICAgICB0b3A6IG1hcmdpbi50b3AsXHJcbiAgICAgICAgICAgIGJvdHRvbTogbWFyZ2luLmJvdHRvbSxcclxuICAgICAgICAgICAgbGVmdDogbWFyZ2luLmxlZnQsXHJcbiAgICAgICAgICAgIHJpZ2h0OiBtYXJnaW4ucmlnaHRcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkYXRhKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXREYXRhKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbGF5ZXJOYW1lLCBhdHRhY2htZW50RGF0YTtcclxuICAgICAgICBmb3IgKHZhciBhdHRhY2htZW50TmFtZSBpbiB0aGlzLl9hdHRhY2hlZCkge1xyXG5cclxuICAgICAgICAgICAgYXR0YWNobWVudERhdGEgPSBkYXRhO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fYXR0YWNoZWRbYXR0YWNobWVudE5hbWVdLnVwZGF0ZShhdHRhY2htZW50RGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoZGF0YSkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlKGRhdGEpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vQm9ycm93ZWQgZnJvbSBkMy5jaGFydFxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWdpc3RlciBvciByZXRyaWV2ZSBhbiBcImF0dGFjaG1lbnRcIiBDaGFydC4gVGhlIFwiYXR0YWNobWVudFwiIGNoYXJ0J3MgYGRyYXdgXHJcbiAgICAgKiBtZXRob2Qgd2lsbCBiZSBpbnZva2VkIHdoZW5ldmVyIHRoZSBjb250YWluaW5nIGNoYXJ0J3MgYGRyYXdgIG1ldGhvZCBpc1xyXG4gICAgICogaW52b2tlZC5cclxuICAgICAqXHJcbiAgICAgKiBAZXh0ZXJuYWxFeGFtcGxlIGNoYXJ0LWF0dGFjaFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRhY2htZW50TmFtZSBOYW1lIG9mIHRoZSBhdHRhY2htZW50XHJcbiAgICAgKiBAcGFyYW0ge0NoYXJ0fSBbY2hhcnRdIENoYXJ0IHRvIHJlZ2lzdGVyIGFzIGEgbWl4IGluIG9mIHRoaXMgY2hhcnQuIFdoZW5cclxuICAgICAqICAgICAgICB1bnNwZWNpZmllZCwgdGhpcyBtZXRob2Qgd2lsbCByZXR1cm4gdGhlIGF0dGFjaG1lbnQgcHJldmlvdXNseVxyXG4gICAgICogICAgICAgIHJlZ2lzdGVyZWQgd2l0aCB0aGUgc3BlY2lmaWVkIGBhdHRhY2htZW50TmFtZWAgKGlmIGFueSkuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0NoYXJ0fSBSZWZlcmVuY2UgdG8gdGhpcyBjaGFydCAoY2hhaW5hYmxlKS5cclxuICAgICAqL1xyXG4gICAgYXR0YWNoKGF0dGFjaG1lbnROYW1lLCBjaGFydCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hdHRhY2hlZFthdHRhY2htZW50TmFtZV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9hdHRhY2hlZFthdHRhY2htZW50TmFtZV0gPSBjaGFydDtcclxuICAgICAgICByZXR1cm4gY2hhcnQ7XHJcbiAgICB9O1xyXG5cclxuICAgIFxyXG5cclxuICAgIC8vQm9ycm93ZWQgZnJvbSBkMy5jaGFydFxyXG4gICAgLyoqXHJcbiAgICAgKiBTdWJzY3JpYmUgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBhbiBldmVudCB0cmlnZ2VyZWQgb24gdGhlIGNoYXJ0LiBTZWUge0BsaW5rXHJcbiAgICAgICAgKiBDaGFydCNvbmNlfSB0byBzdWJzY3JpYmUgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBhbiBldmVudCBmb3Igb25lIG9jY3VyZW5jZS5cclxuICAgICAqXHJcbiAgICAgKiBAZXh0ZXJuYWxFeGFtcGxlIHtydW5uYWJsZX0gY2hhcnQtb25cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBldmVudFxyXG4gICAgICogQHBhcmFtIHtDaGFydEV2ZW50SGFuZGxlcn0gY2FsbGJhY2sgRnVuY3Rpb24gdG8gYmUgaW52b2tlZCB3aGVuIHRoZSBldmVudFxyXG4gICAgICogICAgICAgIG9jY3Vyc1xyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0XSBWYWx1ZSB0byBzZXQgYXMgYHRoaXNgIHdoZW4gaW52b2tpbmcgdGhlXHJcbiAgICAgKiAgICAgICAgYGNhbGxiYWNrYC4gRGVmYXVsdHMgdG8gdGhlIGNoYXJ0IGluc3RhbmNlLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtDaGFydH0gQSByZWZlcmVuY2UgdG8gdGhpcyBjaGFydCAoY2hhaW5hYmxlKS5cclxuICAgICAqL1xyXG4gICAgb24obmFtZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy5fZXZlbnRzW25hbWVdIHx8ICh0aGlzLl9ldmVudHNbbmFtZV0gPSBbXSk7XHJcbiAgICAgICAgZXZlbnRzLnB1c2goe1xyXG4gICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2ssXHJcbiAgICAgICAgICAgIGNvbnRleHQ6IGNvbnRleHQgfHwgdGhpcyxcclxuICAgICAgICAgICAgX2NoYXJ0OiB0aGlzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy9Cb3Jyb3dlZCBmcm9tIGQzLmNoYXJ0XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBTdWJzY3JpYmUgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBhbiBldmVudCB0cmlnZ2VyZWQgb24gdGhlIGNoYXJ0LiBUaGlzXHJcbiAgICAgKiBmdW5jdGlvbiB3aWxsIGJlIGludm9rZWQgYXQgdGhlIG5leHQgb2NjdXJhbmNlIG9mIHRoZSBldmVudCBhbmQgaW1tZWRpYXRlbHlcclxuICAgICAqIHVuc3Vic2NyaWJlZC4gU2VlIHtAbGluayBDaGFydCNvbn0gdG8gc3Vic2NyaWJlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYW5cclxuICAgICAqIGV2ZW50IGluZGVmaW5pdGVseS5cclxuICAgICAqXHJcbiAgICAgKiBAZXh0ZXJuYWxFeGFtcGxlIHtydW5uYWJsZX0gY2hhcnQtb25jZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGV2ZW50XHJcbiAgICAgKiBAcGFyYW0ge0NoYXJ0RXZlbnRIYW5kbGVyfSBjYWxsYmFjayBGdW5jdGlvbiB0byBiZSBpbnZva2VkIHdoZW4gdGhlIGV2ZW50XHJcbiAgICAgKiAgICAgICAgb2NjdXJzXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbnRleHRdIFZhbHVlIHRvIHNldCBhcyBgdGhpc2Agd2hlbiBpbnZva2luZyB0aGVcclxuICAgICAqICAgICAgICBgY2FsbGJhY2tgLiBEZWZhdWx0cyB0byB0aGUgY2hhcnQgaW5zdGFuY2VcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Q2hhcnR9IEEgcmVmZXJlbmNlIHRvIHRoaXMgY2hhcnQgKGNoYWluYWJsZSlcclxuICAgICAqL1xyXG4gICAgb25jZShuYW1lLCBjYWxsYmFjaywgY29udGV4dCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgb25jZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2VsZi5vZmYobmFtZSwgb25jZSk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gdGhpcy5vbihuYW1lLCBvbmNlLCBjb250ZXh0KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy9Cb3Jyb3dlZCBmcm9tIGQzLmNoYXJ0XHJcbiAgICAvKipcclxuICAgICAqIFVuc3Vic2NyaWJlIG9uZSBvciBtb3JlIGNhbGxiYWNrIGZ1bmN0aW9ucyBmcm9tIGFuIGV2ZW50IHRyaWdnZXJlZCBvbiB0aGVcclxuICAgICAqIGNoYXJ0LiBXaGVuIG5vIGFyZ3VtZW50cyBhcmUgc3BlY2lmaWVkLCAqYWxsKiBoYW5kbGVycyB3aWxsIGJlIHVuc3Vic2NyaWJlZC5cclxuICAgICAqIFdoZW4gb25seSBhIGBuYW1lYCBpcyBzcGVjaWZpZWQsIGFsbCBoYW5kbGVycyBzdWJzY3JpYmVkIHRvIHRoYXQgZXZlbnQgd2lsbFxyXG4gICAgICogYmUgdW5zdWJzY3JpYmVkLiBXaGVuIGEgYG5hbWVgIGFuZCBgY2FsbGJhY2tgIGFyZSBzcGVjaWZpZWQsIG9ubHkgdGhhdFxyXG4gICAgICogZnVuY3Rpb24gd2lsbCBiZSB1bnN1YnNjcmliZWQgZnJvbSB0aGF0IGV2ZW50LiBXaGVuIGEgYG5hbWVgIGFuZCBgY29udGV4dGBcclxuICAgICAqIGFyZSBzcGVjaWZpZWQgKGJ1dCBgY2FsbGJhY2tgIGlzIG9taXR0ZWQpLCBhbGwgZXZlbnRzIGJvdW5kIHRvIHRoZSBnaXZlblxyXG4gICAgICogZXZlbnQgd2l0aCB0aGUgZ2l2ZW4gY29udGV4dCB3aWxsIGJlIHVuc3Vic2NyaWJlZC5cclxuICAgICAqXHJcbiAgICAgKiBAZXh0ZXJuYWxFeGFtcGxlIHtydW5uYWJsZX0gY2hhcnQtb2ZmXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFtuYW1lXSBOYW1lIG9mIHRoZSBldmVudCB0byBiZSB1bnN1YnNjcmliZWRcclxuICAgICAqIEBwYXJhbSB7Q2hhcnRFdmVudEhhbmRsZXJ9IFtjYWxsYmFja10gRnVuY3Rpb24gdG8gYmUgdW5zdWJzY3JpYmVkXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbnRleHRdIENvbnRleHRzIHRvIGJlIHVuc3Vic2NyaWJlXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0NoYXJ0fSBBIHJlZmVyZW5jZSB0byB0aGlzIGNoYXJ0IChjaGFpbmFibGUpLlxyXG4gICAgICovXHJcblxyXG4gICAgb2ZmKG5hbWUsIGNhbGxiYWNrLCBjb250ZXh0KSB7XHJcbiAgICAgICAgdmFyIG5hbWVzLCBuLCBldmVudHMsIGV2ZW50LCBpLCBqO1xyXG5cclxuICAgICAgICAvLyByZW1vdmUgYWxsIGV2ZW50c1xyXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGZvciAobmFtZSBpbiB0aGlzLl9ldmVudHMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1tuYW1lXS5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIGFsbCBldmVudHMgZm9yIGEgc3BlY2lmaWMgbmFtZVxyXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIGV2ZW50cyA9IHRoaXMuX2V2ZW50c1tuYW1lXTtcclxuICAgICAgICAgICAgaWYgKGV2ZW50cykge1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyByZW1vdmUgYWxsIGV2ZW50cyB0aGF0IG1hdGNoIHdoYXRldmVyIGNvbWJpbmF0aW9uIG9mIG5hbWUsIGNvbnRleHRcclxuICAgICAgICAvLyBhbmQgY2FsbGJhY2suXHJcbiAgICAgICAgbmFtZXMgPSBuYW1lID8gW25hbWVdIDogT2JqZWN0LmtleXModGhpcy5fZXZlbnRzKTtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbiA9IG5hbWVzW2ldO1xyXG4gICAgICAgICAgICBldmVudHMgPSB0aGlzLl9ldmVudHNbbl07XHJcbiAgICAgICAgICAgIGogPSBldmVudHMubGVuZ3RoO1xyXG4gICAgICAgICAgICB3aGlsZSAoai0tKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudCA9IGV2ZW50c1tqXTtcclxuICAgICAgICAgICAgICAgIGlmICgoY2FsbGJhY2sgJiYgY2FsbGJhY2sgPT09IGV2ZW50LmNhbGxiYWNrKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIChjb250ZXh0ICYmIGNvbnRleHQgPT09IGV2ZW50LmNvbnRleHQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnNwbGljZShqLCAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vQm9ycm93ZWQgZnJvbSBkMy5jaGFydFxyXG4gICAgLyoqXHJcbiAgICAgKiBQdWJsaXNoIGFuIGV2ZW50IG9uIHRoaXMgY2hhcnQgd2l0aCB0aGUgZ2l2ZW4gYG5hbWVgLlxyXG4gICAgICpcclxuICAgICAqIEBleHRlcm5hbEV4YW1wbGUge3J1bm5hYmxlfSBjaGFydC10cmlnZ2VyXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgZXZlbnQgdG8gcHVibGlzaFxyXG4gICAgICogQHBhcmFtIHsuLi4qfSBhcmd1bWVudHMgVmFsdWVzIHdpdGggd2hpY2ggdG8gaW52b2tlIHRoZSByZWdpc3RlcmVkXHJcbiAgICAgKiAgICAgICAgY2FsbGJhY2tzLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtDaGFydH0gQSByZWZlcmVuY2UgdG8gdGhpcyBjaGFydCAoY2hhaW5hYmxlKS5cclxuICAgICAqL1xyXG4gICAgdHJpZ2dlcihuYW1lKSB7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xyXG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLl9ldmVudHNbbmFtZV07XHJcbiAgICAgICAgdmFyIGksIGV2O1xyXG5cclxuICAgICAgICBpZiAoZXZlbnRzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGV2ZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZXYgPSBldmVudHNbaV07XHJcbiAgICAgICAgICAgICAgICBldi5jYWxsYmFjay5hcHBseShldi5jb250ZXh0LCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgZ2V0QmFzZUNvbnRhaW5lcigpe1xyXG4gICAgICAgIGlmKHRoaXMuX2lzQXR0YWNoZWQpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5iYXNlQ29udGFpbmVyLnN2ZztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGQzLnNlbGVjdCh0aGlzLmJhc2VDb250YWluZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEJhc2VDb250YWluZXJOb2RlKCl7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmdldEJhc2VDb250YWluZXIoKS5ub2RlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJlZml4Q2xhc3MoY2xhenosIGFkZERvdCl7XHJcbiAgICAgICAgcmV0dXJuIGFkZERvdD8gJy4nOiAnJyt0aGlzLmNvbmZpZy5jc3NDbGFzc1ByZWZpeCtjbGF6ejtcclxuICAgIH1cclxuICAgIGNvbXB1dGVQbG90U2l6ZSgpIHtcclxuICAgICAgICB0aGlzLnBsb3Qud2lkdGggPSBVdGlscy5hdmFpbGFibGVXaWR0aCh0aGlzLmNvbmZpZy53aWR0aCwgdGhpcy5nZXRCYXNlQ29udGFpbmVyKCksIHRoaXMucGxvdC5tYXJnaW4pO1xyXG4gICAgICAgIHRoaXMucGxvdC5oZWlnaHQgPSBVdGlscy5hdmFpbGFibGVIZWlnaHQodGhpcy5jb25maWcuaGVpZ2h0LCB0aGlzLmdldEJhc2VDb250YWluZXIoKSwgdGhpcy5wbG90Lm1hcmdpbik7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNpdGlvbkVuYWJsZWQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5faXNJbml0aWFsaXplZCAmJiB0aGlzLmNvbmZpZy50cmFuc2l0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dUb29sdGlwKGh0bWwpe1xyXG4gICAgICAgIGlmKCF0aGlzLnBsb3QudG9vbHRpcCl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgIC5kdXJhdGlvbigyMDApXHJcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xyXG4gICAgICAgIHRoaXMucGxvdC50b29sdGlwLmh0bWwoaHRtbClcclxuICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZDMuZXZlbnQucGFnZVggKyA1KSArIFwicHhcIilcclxuICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkMy5ldmVudC5wYWdlWSAtIDI4KSArIFwicHhcIik7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZVRvb2x0aXAoKXtcclxuICAgICAgICBpZighdGhpcy5wbG90LnRvb2x0aXApe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q2hhcnQsIENoYXJ0Q29uZmlnfSBmcm9tIFwiLi9jaGFydFwiO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5pbXBvcnQge1N0YXRpc3RpY3NVdGlsc30gZnJvbSAnLi9zdGF0aXN0aWNzLXV0aWxzJ1xyXG5pbXBvcnQge0xlZ2VuZH0gZnJvbSAnLi9sZWdlbmQnXHJcbmltcG9ydCB7U2NhdHRlclBsb3R9IGZyb20gJy4vc2NhdHRlcnBsb3QnXHJcblxyXG5leHBvcnQgY2xhc3MgQ29ycmVsYXRpb25NYXRyaXhDb25maWcgZXh0ZW5kcyBDaGFydENvbmZpZyB7XHJcblxyXG4gICAgc3ZnQ2xhc3MgPSB0aGlzLmNzc0NsYXNzUHJlZml4Kydjb3JyZWxhdGlvbi1tYXRyaXgnO1xyXG4gICAgZ3VpZGVzID0gZmFsc2U7IC8vc2hvdyBheGlzIGd1aWRlc1xyXG4gICAgc2hvd1Rvb2x0aXAgPSB0cnVlOyAvL3Nob3cgdG9vbHRpcCBvbiBkb3QgaG92ZXJcclxuICAgIHNob3dMZWdlbmQgPSB0cnVlO1xyXG4gICAgaGlnaGxpZ2h0TGFiZWxzID0gdHJ1ZTtcclxuICAgIHJvdGF0ZUxhYmVsc1ggPSB0cnVlO1xyXG4gICAgcm90YXRlTGFiZWxzWSA9IHRydWU7XHJcbiAgICB2YXJpYWJsZXMgPSB7XHJcbiAgICAgICAgbGFiZWxzOiB1bmRlZmluZWQsXHJcbiAgICAgICAga2V5czogW10sIC8vb3B0aW9uYWwgYXJyYXkgb2YgdmFyaWFibGUga2V5c1xyXG4gICAgICAgIHZhbHVlOiAoZCwgdmFyaWFibGVLZXkpID0+IGRbdmFyaWFibGVLZXldLCAvLyB2YXJpYWJsZSB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgIHNjYWxlOiBcIm9yZGluYWxcIlxyXG4gICAgfTtcclxuICAgIGNvcnJlbGF0aW9uID0ge1xyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiLFxyXG4gICAgICAgIGRvbWFpbjogWy0xLCAtMC43NSwgLTAuNSwgMCwgMC41LCAwLjc1LCAxXSxcclxuICAgICAgICByYW5nZTogW1wiZGFya2JsdWVcIiwgXCJibHVlXCIsIFwibGlnaHRza3libHVlXCIsIFwid2hpdGVcIiwgXCJvcmFuZ2VyZWRcIiwgXCJjcmltc29uXCIsIFwiZGFya3JlZFwiXSxcclxuICAgICAgICB2YWx1ZTogKHhWYWx1ZXMsIHlWYWx1ZXMpID0+IFN0YXRpc3RpY3NVdGlscy5zYW1wbGVDb3JyZWxhdGlvbih4VmFsdWVzLCB5VmFsdWVzKVxyXG5cclxuICAgIH07XHJcbiAgICBjZWxsID0ge1xyXG4gICAgICAgIHNoYXBlOiBcImVsbGlwc2VcIiwgLy9wb3NzaWJsZSB2YWx1ZXM6IHJlY3QsIGNpcmNsZSwgZWxsaXBzZVxyXG4gICAgICAgIHNpemU6IHVuZGVmaW5lZCxcclxuICAgICAgICBzaXplTWluOiAxNSxcclxuICAgICAgICBzaXplTWF4OiAyNTAsXHJcbiAgICAgICAgcGFkZGluZzogMVxyXG4gICAgfTtcclxuICAgIG1hcmdpbiA9IHtcclxuICAgICAgICBsZWZ0OiA2MCxcclxuICAgICAgICByaWdodDogNTAsXHJcbiAgICAgICAgdG9wOiAzMCxcclxuICAgICAgICBib3R0b206IDYwXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgaWYgKGN1c3RvbSkge1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ29ycmVsYXRpb25NYXRyaXggZXh0ZW5kcyBDaGFydCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBzdXBlcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBuZXcgQ29ycmVsYXRpb25NYXRyaXhDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZykge1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IENvcnJlbGF0aW9uTWF0cml4Q29uZmlnKGNvbmZpZykpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0UGxvdCgpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgbWFyZ2luID0gdGhpcy5jb25maWcubWFyZ2luO1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC54ID0ge307XHJcbiAgICAgICAgdGhpcy5wbG90LmNvcnJlbGF0aW9uID0ge1xyXG4gICAgICAgICAgICBtYXRyaXg6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgY2VsbHM6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgY29sb3I6IHt9LFxyXG4gICAgICAgICAgICBzaGFwZToge31cclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cFZhcmlhYmxlcygpO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IGNvbmYud2lkdGg7XHJcbiAgICAgICAgdmFyIHBsYWNlaG9sZGVyTm9kZSA9IHRoaXMuZ2V0QmFzZUNvbnRhaW5lck5vZGUoKTtcclxuICAgICAgICB0aGlzLnBsb3QucGxhY2Vob2xkZXJOb2RlID0gcGxhY2Vob2xkZXJOb2RlO1xyXG5cclxuICAgICAgICB2YXIgcGFyZW50V2lkdGggPSBwbGFjZWhvbGRlck5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XHJcbiAgICAgICAgaWYgKHdpZHRoKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMucGxvdC5jZWxsU2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxTaXplID0gTWF0aC5tYXgoY29uZi5jZWxsLnNpemVNaW4sIE1hdGgubWluKGNvbmYuY2VsbC5zaXplTWF4LCAod2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodCkgLyB0aGlzLnBsb3QudmFyaWFibGVzLmxlbmd0aCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsU2l6ZSA9IHRoaXMuY29uZmlnLmNlbGwuc2l6ZTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wbG90LmNlbGxTaXplKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuY2VsbFNpemUgPSBNYXRoLm1heChjb25mLmNlbGwuc2l6ZU1pbiwgTWF0aC5taW4oY29uZi5jZWxsLnNpemVNYXgsIChwYXJlbnRXaWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0KSAvIHRoaXMucGxvdC52YXJpYWJsZXMubGVuZ3RoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHdpZHRoID0gdGhpcy5wbG90LmNlbGxTaXplICogdGhpcy5wbG90LnZhcmlhYmxlcy5sZW5ndGggKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodDtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaGVpZ2h0ID0gd2lkdGg7XHJcbiAgICAgICAgaWYgKCFoZWlnaHQpIHtcclxuICAgICAgICAgICAgaGVpZ2h0ID0gcGxhY2Vob2xkZXJOb2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC53aWR0aCA9IHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XHJcbiAgICAgICAgdGhpcy5wbG90LmhlaWdodCA9IHRoaXMucGxvdC53aWR0aDtcclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cFZhcmlhYmxlc1NjYWxlcygpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBDb3JyZWxhdGlvblNjYWxlcygpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBDb3JyZWxhdGlvbk1hdHJpeCgpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXBWYXJpYWJsZXNTY2FsZXMoKSB7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB4ID0gcGxvdC54O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWcudmFyaWFibGVzO1xyXG5cclxuICAgICAgICAvKiAqXHJcbiAgICAgICAgICogdmFsdWUgYWNjZXNzb3IgLSByZXR1cm5zIHRoZSB2YWx1ZSB0byBlbmNvZGUgZm9yIGEgZ2l2ZW4gZGF0YSBvYmplY3QuXHJcbiAgICAgICAgICogc2NhbGUgLSBtYXBzIHZhbHVlIHRvIGEgdmlzdWFsIGRpc3BsYXkgZW5jb2RpbmcsIHN1Y2ggYXMgYSBwaXhlbCBwb3NpdGlvbi5cclxuICAgICAgICAgKiBtYXAgZnVuY3Rpb24gLSBtYXBzIGZyb20gZGF0YSB2YWx1ZSB0byBkaXNwbGF5IHZhbHVlXHJcbiAgICAgICAgICogYXhpcyAtIHNldHMgdXAgYXhpc1xyXG4gICAgICAgICAqKi9cclxuICAgICAgICB4LnZhbHVlID0gY29uZi52YWx1ZTtcclxuICAgICAgICB4LnNjYWxlID0gZDMuc2NhbGVbY29uZi5zY2FsZV0oKS5yYW5nZUJhbmRzKFtwbG90LndpZHRoLCAwXSk7XHJcbiAgICAgICAgeC5tYXAgPSBkID0+IHguc2NhbGUoeC52YWx1ZShkKSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cENvcnJlbGF0aW9uU2NhbGVzKCkge1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciBjb3JyQ29uZiA9IHRoaXMuY29uZmlnLmNvcnJlbGF0aW9uO1xyXG5cclxuICAgICAgICBwbG90LmNvcnJlbGF0aW9uLmNvbG9yLnNjYWxlID0gZDMuc2NhbGVbY29yckNvbmYuc2NhbGVdKCkuZG9tYWluKGNvcnJDb25mLmRvbWFpbikucmFuZ2UoY29yckNvbmYucmFuZ2UpO1xyXG4gICAgICAgIHZhciBzaGFwZSA9IHBsb3QuY29ycmVsYXRpb24uc2hhcGUgPSB7fTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxDb25mID0gdGhpcy5jb25maWcuY2VsbDtcclxuICAgICAgICBzaGFwZS50eXBlID0gY2VsbENvbmYuc2hhcGU7XHJcblxyXG4gICAgICAgIHZhciBzaGFwZVNpemUgPSBwbG90LmNlbGxTaXplIC0gY2VsbENvbmYucGFkZGluZyAqIDI7XHJcbiAgICAgICAgaWYgKHNoYXBlLnR5cGUgPT0gJ2NpcmNsZScpIHtcclxuICAgICAgICAgICAgdmFyIHJhZGl1c01heCA9IHNoYXBlU2l6ZSAvIDI7XHJcbiAgICAgICAgICAgIHNoYXBlLnJhZGl1c1NjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFswLCAxXSkucmFuZ2UoWzIsIHJhZGl1c01heF0pO1xyXG4gICAgICAgICAgICBzaGFwZS5yYWRpdXMgPSBjPT4gc2hhcGUucmFkaXVzU2NhbGUoTWF0aC5hYnMoYy52YWx1ZSkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc2hhcGUudHlwZSA9PSAnZWxsaXBzZScpIHtcclxuICAgICAgICAgICAgdmFyIHJhZGl1c01heCA9IHNoYXBlU2l6ZSAvIDI7XHJcbiAgICAgICAgICAgIHNoYXBlLnJhZGl1c1NjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFswLCAxXSkucmFuZ2UoW3JhZGl1c01heCwgMl0pO1xyXG4gICAgICAgICAgICBzaGFwZS5yYWRpdXNYID0gYz0+IHNoYXBlLnJhZGl1c1NjYWxlKE1hdGguYWJzKGMudmFsdWUpKTtcclxuICAgICAgICAgICAgc2hhcGUucmFkaXVzWSA9IHJhZGl1c01heDtcclxuXHJcbiAgICAgICAgICAgIHNoYXBlLnJvdGF0ZVZhbCA9IHYgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHYgPT0gMCkgcmV0dXJuIFwiMFwiO1xyXG4gICAgICAgICAgICAgICAgaWYgKHYgPCAwKSByZXR1cm4gXCItNDVcIjtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIjQ1XCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoc2hhcGUudHlwZSA9PSAncmVjdCcpIHtcclxuICAgICAgICAgICAgc2hhcGUuc2l6ZSA9IHNoYXBlU2l6ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBzZXR1cFZhcmlhYmxlcygpIHtcclxuXHJcbiAgICAgICAgdmFyIHZhcmlhYmxlc0NvbmYgPSB0aGlzLmNvbmZpZy52YXJpYWJsZXM7XHJcblxyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHBsb3QuZG9tYWluQnlWYXJpYWJsZSA9IHt9O1xyXG4gICAgICAgIHBsb3QudmFyaWFibGVzID0gdmFyaWFibGVzQ29uZi5rZXlzO1xyXG4gICAgICAgIGlmICghcGxvdC52YXJpYWJsZXMgfHwgIXBsb3QudmFyaWFibGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBwbG90LnZhcmlhYmxlcyA9IFV0aWxzLmluZmVyVmFyaWFibGVzKGRhdGEsIHRoaXMuY29uZmlnLmdyb3Vwcy5rZXksIHRoaXMuY29uZmlnLmluY2x1ZGVJblBsb3QpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcGxvdC5sYWJlbHMgPSBbXTtcclxuICAgICAgICBwbG90LmxhYmVsQnlWYXJpYWJsZSA9IHt9O1xyXG4gICAgICAgIHBsb3QudmFyaWFibGVzLmZvckVhY2goKHZhcmlhYmxlS2V5LCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBwbG90LmRvbWFpbkJ5VmFyaWFibGVbdmFyaWFibGVLZXldID0gZDMuZXh0ZW50KGRhdGEsIChkKSA9PiB2YXJpYWJsZXNDb25mLnZhbHVlKGQsIHZhcmlhYmxlS2V5KSk7XHJcbiAgICAgICAgICAgIHZhciBsYWJlbCA9IHZhcmlhYmxlS2V5O1xyXG4gICAgICAgICAgICBpZiAodmFyaWFibGVzQ29uZi5sYWJlbHMgJiYgdmFyaWFibGVzQ29uZi5sYWJlbHMubGVuZ3RoID4gaW5kZXgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsYWJlbCA9IHZhcmlhYmxlc0NvbmYubGFiZWxzW2luZGV4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwbG90LmxhYmVscy5wdXNoKGxhYmVsKTtcclxuICAgICAgICAgICAgcGxvdC5sYWJlbEJ5VmFyaWFibGVbdmFyaWFibGVLZXldID0gbGFiZWw7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHBsb3QubGFiZWxCeVZhcmlhYmxlKTtcclxuXHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBzZXR1cENvcnJlbGF0aW9uTWF0cml4KCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgICAgICB2YXIgbWF0cml4ID0gdGhpcy5wbG90LmNvcnJlbGF0aW9uLm1hdHJpeCA9IFtdO1xyXG4gICAgICAgIHZhciBtYXRyaXhDZWxscyA9IHRoaXMucGxvdC5jb3JyZWxhdGlvbi5tYXRyaXguY2VsbHMgPSBbXTtcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuXHJcbiAgICAgICAgdmFyIHZhcmlhYmxlVG9WYWx1ZXMgPSB7fTtcclxuICAgICAgICBwbG90LnZhcmlhYmxlcy5mb3JFYWNoKCh2LCBpKSA9PiB7XHJcblxyXG4gICAgICAgICAgICB2YXJpYWJsZVRvVmFsdWVzW3ZdID0gZGF0YS5tYXAoZD0+cGxvdC54LnZhbHVlKGQsIHYpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcGxvdC52YXJpYWJsZXMuZm9yRWFjaCgodjEsIGkpID0+IHtcclxuICAgICAgICAgICAgdmFyIHJvdyA9IFtdO1xyXG4gICAgICAgICAgICBtYXRyaXgucHVzaChyb3cpO1xyXG5cclxuICAgICAgICAgICAgcGxvdC52YXJpYWJsZXMuZm9yRWFjaCgodjIsIGopID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBjb3JyID0gMTtcclxuICAgICAgICAgICAgICAgIGlmICh2MSAhPSB2Mikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvcnIgPSBzZWxmLmNvbmZpZy5jb3JyZWxhdGlvbi52YWx1ZSh2YXJpYWJsZVRvVmFsdWVzW3YxXSwgdmFyaWFibGVUb1ZhbHVlc1t2Ml0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIGNlbGwgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcm93VmFyOiB2MSxcclxuICAgICAgICAgICAgICAgICAgICBjb2xWYXI6IHYyLFxyXG4gICAgICAgICAgICAgICAgICAgIHJvdzogaSxcclxuICAgICAgICAgICAgICAgICAgICBjb2w6IGosXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGNvcnJcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByb3cucHVzaChjZWxsKTtcclxuXHJcbiAgICAgICAgICAgICAgICBtYXRyaXhDZWxscy5wdXNoKGNlbGwpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHVwZGF0ZShuZXdEYXRhKSB7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKG5ld0RhdGEpO1xyXG4gICAgICAgIC8vIHRoaXMudXBkYXRlXHJcbiAgICAgICAgdGhpcy51cGRhdGVDZWxscygpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmFyaWFibGVMYWJlbHMoKTtcclxuXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5zaG93TGVnZW5kKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGVnZW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB1cGRhdGVWYXJpYWJsZUxhYmVscygpIHtcclxuICAgICAgICB0aGlzLnBsb3QubGFiZWxDbGFzcyA9IHRoaXMucHJlZml4Q2xhc3MoXCJsYWJlbFwiKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUF4aXNYKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVBeGlzWSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUF4aXNYKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgbGFiZWxDbGFzcyA9IHBsb3QubGFiZWxDbGFzcztcclxuICAgICAgICB2YXIgbGFiZWxYQ2xhc3MgPSBsYWJlbENsYXNzICsgXCIteFwiO1xyXG5cclxuICAgICAgICB2YXIgbGFiZWxzID0gc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyBsYWJlbFhDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGxvdC52YXJpYWJsZXMsIChkLCBpKT0+aSk7XHJcblxyXG4gICAgICAgIGxhYmVscy5lbnRlcigpLmFwcGVuZChcInRleHRcIikuYXR0cihcImNsYXNzXCIsIChkLCBpKSA9PiBsYWJlbENsYXNzICsgXCIgXCIgKyBsYWJlbFhDbGFzcyArIFwiIFwiICsgbGFiZWxYQ2xhc3MgKyBcIi1cIiArIGkpO1xyXG5cclxuICAgICAgICBsYWJlbHNcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIChkLCBpKSA9PiBpICogcGxvdC5jZWxsU2l6ZSArIHBsb3QuY2VsbFNpemUgLyAyKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgcGxvdC5oZWlnaHQpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHhcIiwgLTIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgNSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKVxyXG5cclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcImhhbmdpbmdcIilcclxuICAgICAgICAgICAgLnRleHQodj0+cGxvdC5sYWJlbEJ5VmFyaWFibGVbdl0pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcucm90YXRlTGFiZWxzWCkge1xyXG4gICAgICAgICAgICBsYWJlbHMuYXR0cihcInRyYW5zZm9ybVwiLCAoZCwgaSkgPT4gXCJyb3RhdGUoLTQ1LCBcIiArIChpICogcGxvdC5jZWxsU2l6ZSArIHBsb3QuY2VsbFNpemUgLyAyICApICsgXCIsIFwiICsgcGxvdC5oZWlnaHQgKyBcIilcIilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBtYXhXaWR0aCA9IHNlbGYuY29tcHV0ZVhBeGlzTGFiZWxzV2lkdGgoKTtcclxuICAgICAgICBsYWJlbHMuZWFjaChmdW5jdGlvbiAobGFiZWwpIHtcclxuICAgICAgICAgICAgVXRpbHMucGxhY2VUZXh0V2l0aEVsbGlwc2lzQW5kVG9vbHRpcChkMy5zZWxlY3QodGhpcyksIGxhYmVsLCBtYXhXaWR0aCwgc2VsZi5jb25maWcuc2hvd1Rvb2x0aXAgPyBzZWxmLnBsb3QudG9vbHRpcCA6IGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGFiZWxzLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVBeGlzWSgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGxhYmVsQ2xhc3MgPSBwbG90LmxhYmVsQ2xhc3M7XHJcbiAgICAgICAgdmFyIGxhYmVsWUNsYXNzID0gcGxvdC5sYWJlbENsYXNzICsgXCIteVwiO1xyXG4gICAgICAgIHZhciBsYWJlbHMgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIGxhYmVsWUNsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShwbG90LnZhcmlhYmxlcyk7XHJcblxyXG4gICAgICAgIGxhYmVscy5lbnRlcigpLmFwcGVuZChcInRleHRcIik7XHJcblxyXG4gICAgICAgIGxhYmVsc1xyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIChkLCBpKSA9PiBpICogcGxvdC5jZWxsU2l6ZSArIHBsb3QuY2VsbFNpemUgLyAyKVxyXG4gICAgICAgICAgICAuYXR0cihcImR4XCIsIC0yKVxyXG4gICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgKGQsIGkpID0+IGxhYmVsQ2xhc3MgKyBcIiBcIiArIGxhYmVsWUNsYXNzICsgXCIgXCIgKyBsYWJlbFlDbGFzcyArIFwiLVwiICsgaSlcclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcImhhbmdpbmdcIilcclxuICAgICAgICAgICAgLnRleHQodj0+cGxvdC5sYWJlbEJ5VmFyaWFibGVbdl0pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcucm90YXRlTGFiZWxzWSkge1xyXG4gICAgICAgICAgICBsYWJlbHNcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInJvdGF0ZSgtNDUsIFwiICsgMCArIFwiLCBcIiArIChpICogcGxvdC5jZWxsU2l6ZSArIHBsb3QuY2VsbFNpemUgLyAyKSArIFwiKVwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBtYXhXaWR0aCA9IHNlbGYuY29tcHV0ZVlBeGlzTGFiZWxzV2lkdGgoKTtcclxuICAgICAgICBsYWJlbHMuZWFjaChmdW5jdGlvbiAobGFiZWwpIHtcclxuICAgICAgICAgICAgVXRpbHMucGxhY2VUZXh0V2l0aEVsbGlwc2lzQW5kVG9vbHRpcChkMy5zZWxlY3QodGhpcyksIGxhYmVsLCBtYXhXaWR0aCwgc2VsZi5jb25maWcuc2hvd1Rvb2x0aXAgPyBzZWxmLnBsb3QudG9vbHRpcCA6IGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGFiZWxzLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wdXRlWUF4aXNMYWJlbHNXaWR0aCgpIHtcclxuICAgICAgICB2YXIgbWF4V2lkdGggPSB0aGlzLnBsb3QubWFyZ2luLmxlZnQ7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5yb3RhdGVMYWJlbHNZKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtYXhXaWR0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1heFdpZHRoICo9IFV0aWxzLlNRUlRfMjtcclxuICAgICAgICB2YXIgZm9udFNpemUgPSAxMTsgLy90b2RvIGNoZWNrIGFjdHVhbCBmb250IHNpemVcclxuICAgICAgICBtYXhXaWR0aCAtPSBmb250U2l6ZSAvIDI7XHJcblxyXG4gICAgICAgIHJldHVybiBtYXhXaWR0aDtcclxuICAgIH1cclxuXHJcbiAgICBjb21wdXRlWEF4aXNMYWJlbHNXaWR0aChvZmZzZXQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLnJvdGF0ZUxhYmVsc1gpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGxvdC5jZWxsU2l6ZSAtIDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBzaXplID0gdGhpcy5wbG90Lm1hcmdpbi5ib3R0b207XHJcbiAgICAgICAgc2l6ZSAqPSBVdGlscy5TUVJUXzI7XHJcbiAgICAgICAgdmFyIGZvbnRTaXplID0gMTE7IC8vdG9kbyBjaGVjayBhY3R1YWwgZm9udCBzaXplXHJcbiAgICAgICAgc2l6ZSAtPSBmb250U2l6ZSAvIDI7XHJcbiAgICAgICAgcmV0dXJuIHNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlQ2VsbHMoKSB7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgY2VsbENsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImNlbGxcIik7XHJcbiAgICAgICAgdmFyIGNlbGxTaGFwZSA9IHBsb3QuY29ycmVsYXRpb24uc2hhcGUudHlwZTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxzID0gc2VsZi5zdmdHLnNlbGVjdEFsbChcImcuXCIgKyBjZWxsQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBsb3QuY29ycmVsYXRpb24ubWF0cml4LmNlbGxzKTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxFbnRlckcgPSBjZWxscy5lbnRlcigpLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmNsYXNzZWQoY2VsbENsYXNzLCB0cnVlKTtcclxuICAgICAgICBjZWxscy5hdHRyKFwidHJhbnNmb3JtXCIsIGM9PiBcInRyYW5zbGF0ZShcIiArIChwbG90LmNlbGxTaXplICogYy5jb2wgKyBwbG90LmNlbGxTaXplIC8gMikgKyBcIixcIiArIChwbG90LmNlbGxTaXplICogYy5yb3cgKyBwbG90LmNlbGxTaXplIC8gMikgKyBcIilcIik7XHJcblxyXG4gICAgICAgIGNlbGxzLmNsYXNzZWQoc2VsZi5jb25maWcuY3NzQ2xhc3NQcmVmaXggKyBcInNlbGVjdGFibGVcIiwgISFzZWxmLnNjYXR0ZXJQbG90KTtcclxuXHJcbiAgICAgICAgdmFyIHNlbGVjdG9yID0gXCIqOm5vdCguY2VsbC1zaGFwZS1cIiArIGNlbGxTaGFwZSArIFwiKVwiO1xyXG5cclxuICAgICAgICB2YXIgd3JvbmdTaGFwZXMgPSBjZWxscy5zZWxlY3RBbGwoc2VsZWN0b3IpO1xyXG4gICAgICAgIHdyb25nU2hhcGVzLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICB2YXIgc2hhcGVzID0gY2VsbHMuc2VsZWN0T3JBcHBlbmQoY2VsbFNoYXBlICsgXCIuY2VsbC1zaGFwZS1cIiArIGNlbGxTaGFwZSk7XHJcblxyXG4gICAgICAgIGlmIChwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnR5cGUgPT0gJ2NpcmNsZScpIHtcclxuXHJcbiAgICAgICAgICAgIHNoYXBlc1xyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJyXCIsIHBsb3QuY29ycmVsYXRpb24uc2hhcGUucmFkaXVzKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCAwKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnR5cGUgPT0gJ2VsbGlwc2UnKSB7XHJcbiAgICAgICAgICAgIC8vIGNlbGxzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYz0+IFwidHJhbnNsYXRlKDMwMCwxNTApIHJvdGF0ZShcIitwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnJvdGF0ZVZhbChjLnZhbHVlKStcIilcIik7XHJcbiAgICAgICAgICAgIHNoYXBlc1xyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJyeFwiLCBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnJhZGl1c1gpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInJ5XCIsIHBsb3QuY29ycmVsYXRpb24uc2hhcGUucmFkaXVzWSlcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY3hcIiwgMClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY3lcIiwgMClcclxuXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBjPT4gXCJyb3RhdGUoXCIgKyBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnJvdGF0ZVZhbChjLnZhbHVlKSArIFwiKVwiKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBpZiAocGxvdC5jb3JyZWxhdGlvbi5zaGFwZS50eXBlID09ICdyZWN0Jykge1xyXG4gICAgICAgICAgICBzaGFwZXNcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5zaXplKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5zaXplKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIC1wbG90LmNlbGxTaXplIC8gMilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieVwiLCAtcGxvdC5jZWxsU2l6ZSAvIDIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzaGFwZXMuc3R5bGUoXCJmaWxsXCIsIGM9PiBwbG90LmNvcnJlbGF0aW9uLmNvbG9yLnNjYWxlKGMudmFsdWUpKTtcclxuXHJcbiAgICAgICAgdmFyIG1vdXNlb3ZlckNhbGxiYWNrcyA9IFtdO1xyXG4gICAgICAgIHZhciBtb3VzZW91dENhbGxiYWNrcyA9IFtdO1xyXG5cclxuICAgICAgICBpZiAocGxvdC50b29sdGlwKSB7XHJcblxyXG4gICAgICAgICAgICBtb3VzZW92ZXJDYWxsYmFja3MucHVzaChjPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGh0bWwgPSBjLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zaG93VG9vbHRpcChodG1sKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBtb3VzZW91dENhbGxiYWNrcy5wdXNoKGM9PiB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmhpZGVUb29sdGlwKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2VsZi5jb25maWcuaGlnaGxpZ2h0TGFiZWxzKSB7XHJcbiAgICAgICAgICAgIHZhciBoaWdobGlnaHRDbGFzcyA9IHNlbGYuY29uZmlnLmNzc0NsYXNzUHJlZml4ICsgXCJoaWdobGlnaHRcIjtcclxuICAgICAgICAgICAgdmFyIHhMYWJlbENsYXNzID0gYz0+cGxvdC5sYWJlbENsYXNzICsgXCIteC1cIiArIGMuY29sO1xyXG4gICAgICAgICAgICB2YXIgeUxhYmVsQ2xhc3MgPSBjPT5wbG90LmxhYmVsQ2xhc3MgKyBcIi15LVwiICsgYy5yb3c7XHJcblxyXG5cclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goYz0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHhMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgeUxhYmVsQ2xhc3MoYykpLmNsYXNzZWQoaGlnaGxpZ2h0Q2xhc3MsIHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MucHVzaChjPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB4TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB5TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBjZWxscy5vbihcIm1vdXNlb3ZlclwiLCBjID0+IHtcclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2s9PmNhbGxiYWNrKGMpKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCBjID0+IHtcclxuICAgICAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2s9PmNhbGxiYWNrKGMpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNlbGxzLm9uKFwiY2xpY2tcIiwgYz0+IHtcclxuICAgICAgICAgICAgc2VsZi50cmlnZ2VyKFwiY2VsbC1zZWxlY3RlZFwiLCBjKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIGNlbGxzLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgdXBkYXRlTGVnZW5kKCkge1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgbGVnZW5kWCA9IHRoaXMucGxvdC53aWR0aCArIDEwO1xyXG4gICAgICAgIHZhciBsZWdlbmRZID0gMDtcclxuICAgICAgICB2YXIgYmFyV2lkdGggPSAxMDtcclxuICAgICAgICB2YXIgYmFySGVpZ2h0ID0gdGhpcy5wbG90LmhlaWdodCAtIDI7XHJcbiAgICAgICAgdmFyIHNjYWxlID0gcGxvdC5jb3JyZWxhdGlvbi5jb2xvci5zY2FsZTtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmQgPSBuZXcgTGVnZW5kKHRoaXMuc3ZnLCB0aGlzLnN2Z0csIHNjYWxlLCBsZWdlbmRYLCBsZWdlbmRZKS5saW5lYXJHcmFkaWVudEJhcihiYXJXaWR0aCwgYmFySGVpZ2h0KTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGF0dGFjaFNjYXR0ZXJQbG90KGNvbnRhaW5lclNlbGVjdG9yLCBjb25maWcpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblxyXG4gICAgICAgIHZhciBzY2F0dGVyUGxvdENvbmZpZyA9IHtcclxuICAgICAgICAgICAgaGVpZ2h0OiBzZWxmLnBsb3QuaGVpZ2h0ICsgc2VsZi5jb25maWcubWFyZ2luLnRvcCArIHNlbGYuY29uZmlnLm1hcmdpbi5ib3R0b20sXHJcbiAgICAgICAgICAgIHdpZHRoOiBzZWxmLnBsb3QuaGVpZ2h0ICsgc2VsZi5jb25maWcubWFyZ2luLnRvcCArIHNlbGYuY29uZmlnLm1hcmdpbi5ib3R0b20sXHJcbiAgICAgICAgICAgIGdyb3Vwczoge1xyXG4gICAgICAgICAgICAgICAga2V5OiBzZWxmLmNvbmZpZy5ncm91cHMua2V5LFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6IHNlbGYuY29uZmlnLmdyb3Vwcy5sYWJlbFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBndWlkZXM6IHRydWUsXHJcbiAgICAgICAgICAgIHNob3dMZWdlbmQ6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zY2F0dGVyUGxvdCA9IHRydWU7XHJcblxyXG4gICAgICAgIHNjYXR0ZXJQbG90Q29uZmlnID0gVXRpbHMuZGVlcEV4dGVuZChzY2F0dGVyUGxvdENvbmZpZywgY29uZmlnKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm9uKFwiY2VsbC1zZWxlY3RlZFwiLCBjPT4ge1xyXG5cclxuXHJcbiAgICAgICAgICAgIHNjYXR0ZXJQbG90Q29uZmlnLnggPSB7XHJcbiAgICAgICAgICAgICAgICBrZXk6IGMucm93VmFyLFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6IHNlbGYucGxvdC5sYWJlbEJ5VmFyaWFibGVbYy5yb3dWYXJdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHNjYXR0ZXJQbG90Q29uZmlnLnkgPSB7XHJcbiAgICAgICAgICAgICAgICBrZXk6IGMuY29sVmFyLFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6IHNlbGYucGxvdC5sYWJlbEJ5VmFyaWFibGVbYy5jb2xWYXJdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnNjYXR0ZXJQbG90ICYmIHNlbGYuc2NhdHRlclBsb3QgIT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2NhdHRlclBsb3Quc2V0Q29uZmlnKHNjYXR0ZXJQbG90Q29uZmlnKS5pbml0KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNjYXR0ZXJQbG90ID0gbmV3IFNjYXR0ZXJQbG90KGNvbnRhaW5lclNlbGVjdG9yLCBzZWxmLmRhdGEsIHNjYXR0ZXJQbG90Q29uZmlnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXR0YWNoKFwiU2NhdHRlclBsb3RcIiwgc2VsZi5zY2F0dGVyUGxvdCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgRDNFeHRlbnNpb25ze1xyXG5cclxuICAgIHN0YXRpYyBleHRlbmQoKXtcclxuXHJcbiAgICAgICAgZDMuc2VsZWN0aW9uLmVudGVyLnByb3RvdHlwZS5pbnNlcnRTZWxlY3RvciA9XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdGlvbi5wcm90b3R5cGUuaW5zZXJ0U2VsZWN0b3IgPSBmdW5jdGlvbihzZWxlY3RvciwgYmVmb3JlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVXRpbHMuaW5zZXJ0U2VsZWN0b3IodGhpcywgc2VsZWN0b3IsIGJlZm9yZSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICBkMy5zZWxlY3Rpb24uZW50ZXIucHJvdG90eXBlLmFwcGVuZFNlbGVjdG9yID1cclxuICAgICAgICAgICAgZDMuc2VsZWN0aW9uLnByb3RvdHlwZS5hcHBlbmRTZWxlY3RvciA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVXRpbHMuYXBwZW5kU2VsZWN0b3IodGhpcywgc2VsZWN0b3IpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICBkMy5zZWxlY3Rpb24uZW50ZXIucHJvdG90eXBlLnNlbGVjdE9yQXBwZW5kID1cclxuICAgICAgICAgICAgZDMuc2VsZWN0aW9uLnByb3RvdHlwZS5zZWxlY3RPckFwcGVuZCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVXRpbHMuc2VsZWN0T3JBcHBlbmQodGhpcywgc2VsZWN0b3IpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICBkMy5zZWxlY3Rpb24uZW50ZXIucHJvdG90eXBlLnNlbGVjdE9ySW5zZXJ0ID1cclxuICAgICAgICAgICAgZDMuc2VsZWN0aW9uLnByb3RvdHlwZS5zZWxlY3RPckluc2VydCA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBiZWZvcmUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBVdGlscy5zZWxlY3RPckluc2VydCh0aGlzLCBzZWxlY3RvciwgYmVmb3JlKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcblxyXG5cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NoYXJ0LCBDaGFydENvbmZpZ30gZnJvbSBcIi4vY2hhcnRcIjtcclxuaW1wb3J0IHtIZWF0bWFwLCBIZWF0bWFwQ29uZmlnfSBmcm9tIFwiLi9oZWF0bWFwXCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7U3RhdGlzdGljc1V0aWxzfSBmcm9tICcuL3N0YXRpc3RpY3MtdXRpbHMnXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEhlYXRtYXBUaW1lU2VyaWVzQ29uZmlnIGV4dGVuZHMgSGVhdG1hcENvbmZpZyB7XHJcbiAgICB4ID0ge1xyXG4gICAgICAgIGZpbGxNaXNzaW5nOiBmYWxzZSwgLy8gZmlsbCBtaXNzaW5nIHZhbHVlcyB1c2luZyBpbnRlcnZhbCBhbmQgaW50ZXJ2YWxTdGVwXHJcbiAgICAgICAgaW50ZXJ2YWw6IHVuZGVmaW5lZCwgLy91c2VkIGluIGZpbGxpbmcgbWlzc2luZyB0aWNrc1xyXG4gICAgICAgIGludGVydmFsU3RlcDogMSxcclxuICAgICAgICBmb3JtYXQ6IHVuZGVmaW5lZCwgLy9pbnB1dCBkYXRhIGQzIHRpbWUgZm9ybWF0XHJcbiAgICAgICAgZGlzcGxheUZvcm1hdDogdW5kZWZpbmVkLC8vZDMgdGltZSBmb3JtYXQgZm9yIGRpc3BsYXlcclxuICAgICAgICBpbnRlcnZhbFRvRm9ybWF0czogWyAvL3VzZWQgdG8gZ3Vlc3MgaW50ZXJ2YWwgYW5kIGZvcm1hdFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAneWVhcicsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXRzOiBbXCIlWVwiXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnbW9udGgnLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0czogW1wiJVktJW1cIl1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2RheScsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXRzOiBbXCIlWS0lbS0lZFwiXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnaG91cicsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXRzOiBbJyVIJywgJyVZLSVtLSVkICVIJ11cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ21pbnV0ZScsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXRzOiBbJyVIOiVNJywgJyVZLSVtLSVkICVIOiVNJ11cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3NlY29uZCcsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXRzOiBbJyVIOiVNOiVTJywgJyVZLSVtLSVkICVIOiVNOiVTJ11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0sXHJcblxyXG4gICAgICAgIHNvcnRDb21wYXJhdG9yOiBmdW5jdGlvbiBzb3J0Q29tcGFyYXRvcihhLCBiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBVdGlscy5pc1N0cmluZyhhKSA/ICBhLmxvY2FsZUNvbXBhcmUoYikgOiAgYSAtIGI7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb3JtYXR0ZXI6IHVuZGVmaW5lZFxyXG4gICAgfTtcclxuICAgIHogPSB7XHJcbiAgICAgICAgZmlsbE1pc3Npbmc6IHRydWUgLy8gZmlpbGwgbWlzc2luZyB2YWx1ZXMgd2l0aCBuZWFyZXN0IHByZXZpb3VzIHZhbHVlXHJcbiAgICB9O1xyXG5cclxuICAgIGxlZ2VuZCA9IHtcclxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHZhciBzdWZmaXggPSBcIlwiO1xyXG4gICAgICAgICAgICBpZiAodiAvIDEwMDAwMDAgPj0gMSkge1xyXG4gICAgICAgICAgICAgICAgc3VmZml4ID0gXCIgTVwiO1xyXG4gICAgICAgICAgICAgICAgdiA9IE51bWJlcih2IC8gMTAwMDAwMCkudG9GaXhlZCgzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgbmYgPSBJbnRsLk51bWJlckZvcm1hdCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gbmYuZm9ybWF0KHYpICsgc3VmZml4O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgaWYgKGN1c3RvbSkge1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSGVhdG1hcFRpbWVTZXJpZXMgZXh0ZW5kcyBIZWF0bWFwIHtcclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIG5ldyBIZWF0bWFwVGltZVNlcmllc0NvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgSGVhdG1hcFRpbWVTZXJpZXNDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNldHVwVmFsdWVzQmVmb3JlR3JvdXBzU29ydCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LngudGltZUZvcm1hdCA9IHRoaXMuY29uZmlnLnguZm9ybWF0O1xyXG4gICAgICAgIGlmKHRoaXMuY29uZmlnLnguZGlzcGxheUZvcm1hdCAmJiAhdGhpcy5wbG90LngudGltZUZvcm1hdCl7XHJcbiAgICAgICAgICAgIHRoaXMuZ3Vlc3NUaW1lRm9ybWF0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgc3VwZXIuc2V0dXBWYWx1ZXNCZWZvcmVHcm91cHNTb3J0KCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy54LmZpbGxNaXNzaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5pbml0VGltZUZvcm1hdEFuZEludGVydmFsKCk7XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC54LmludGVydmFsU3RlcCA9IHRoaXMuY29uZmlnLnguaW50ZXJ2YWxTdGVwIHx8IDE7XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC54LnRpbWVQYXJzZXIgPSB0aGlzLmdldFRpbWVQYXJzZXIoKTtcclxuXHJcblxyXG5cclxuICAgICAgICB0aGlzLnBsb3QueC51bmlxdWVWYWx1ZXMuc29ydCh0aGlzLmNvbmZpZy54LnNvcnRDb21wYXJhdG9yKTtcclxuXHJcbiAgICAgICAgdmFyIHByZXYgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueC51bmlxdWVWYWx1ZXMuZm9yRWFjaCgoeCwgaSk9PiB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5wYXJzZVRpbWUoeCk7XHJcbiAgICAgICAgICAgIGlmIChwcmV2ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBwcmV2ID0gY3VycmVudDtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIG5leHQgPSBzZWxmLm5leHRUaW1lVGlja1ZhbHVlKHByZXYpO1xyXG4gICAgICAgICAgICB2YXIgbWlzc2luZyA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgaXRlcmF0aW9uID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKHNlbGYuY29tcGFyZVRpbWVWYWx1ZXMobmV4dCwgY3VycmVudCk8PTApIHtcclxuICAgICAgICAgICAgICAgIGl0ZXJhdGlvbisrO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZXJhdGlvbiA+IDEwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIGQgPSB7fTtcclxuICAgICAgICAgICAgICAgIHZhciB0aW1lU3RyaW5nID0gc2VsZi5mb3JtYXRUaW1lKG5leHQpO1xyXG4gICAgICAgICAgICAgICAgZFt0aGlzLmNvbmZpZy54LmtleV0gPSB0aW1lU3RyaW5nO1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYudXBkYXRlR3JvdXBzKGQsIHRpbWVTdHJpbmcsIHNlbGYucGxvdC54Lmdyb3Vwcywgc2VsZi5jb25maWcueC5ncm91cHMpO1xyXG4gICAgICAgICAgICAgICAgbWlzc2luZy5wdXNoKG5leHQpO1xyXG4gICAgICAgICAgICAgICAgbmV4dCA9IHNlbGYubmV4dFRpbWVUaWNrVmFsdWUobmV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJldiA9IGN1cnJlbnQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlVGltZSh4KSB7XHJcbiAgICAgICAgdmFyIHBhcnNlciA9IHRoaXMuZ2V0VGltZVBhcnNlcigpO1xyXG4gICAgICAgIHJldHVybiBwYXJzZXIucGFyc2UoeCk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9ybWF0VGltZShkYXRlKXtcclxuICAgICAgICB2YXIgcGFyc2VyID0gdGhpcy5nZXRUaW1lUGFyc2VyKCk7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlcihkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3JtYXRWYWx1ZVgodmFsdWUpIHsgLy91c2VkIG9ubHkgZm9yIGRpc3BsYXlcclxuICAgICAgICBpZiAodGhpcy5jb25maWcueC5mb3JtYXR0ZXIpIHJldHVybiB0aGlzLmNvbmZpZy54LmZvcm1hdHRlci5jYWxsKHRoaXMuY29uZmlnLCB2YWx1ZSk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuY29uZmlnLnguZGlzcGxheUZvcm1hdCl7XHJcbiAgICAgICAgICAgIHZhciBkYXRlID0gdGhpcy5wYXJzZVRpbWUodmFsdWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gZDMudGltZS5mb3JtYXQodGhpcy5jb25maWcueC5kaXNwbGF5Rm9ybWF0KShkYXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCF0aGlzLnBsb3QueC50aW1lRm9ybWF0KSByZXR1cm4gdmFsdWU7XHJcblxyXG4gICAgICAgIGlmKFV0aWxzLmlzRGF0ZSh2YWx1ZSkpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXRUaW1lKHZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wYXJlVGltZVZhbHVlcyhhLCBiKXtcclxuICAgICAgICByZXR1cm4gYS1iO1xyXG4gICAgfVxyXG5cclxuICAgIHRpbWVWYWx1ZXNFcXVhbChhLCBiKSB7XHJcbiAgICAgICAgdmFyIHBhcnNlciA9IHRoaXMucGxvdC54LnRpbWVQYXJzZXI7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlcihhKSA9PT0gcGFyc2VyKGIpO1xyXG4gICAgfVxyXG5cclxuICAgIG5leHRUaW1lVGlja1ZhbHVlKHQpIHtcclxuICAgICAgICB2YXIgaW50ZXJ2YWwgPSB0aGlzLnBsb3QueC5pbnRlcnZhbDtcclxuICAgICAgICByZXR1cm4gZDMudGltZVtpbnRlcnZhbF0ub2Zmc2V0KHQsIHRoaXMucGxvdC54LmludGVydmFsU3RlcCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdFBsb3QoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnouZmlsbE1pc3NpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lm1hdHJpeC5mb3JFYWNoKChyb3csIHJvd0luZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJldlJvd1ZhbHVlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgcm93LmZvckVhY2goKGNlbGwsIGNvbEluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNlbGwudmFsdWUgPT09IHVuZGVmaW5lZCAmJiBwcmV2Um93VmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLnZhbHVlID0gcHJldlJvd1ZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLm1pc3NpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBwcmV2Um93VmFsdWUgPSBjZWxsLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShuZXdEYXRhKSB7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKG5ld0RhdGEpO1xyXG5cclxuICAgIH07XHJcblxyXG5cclxuICAgIGluaXRUaW1lRm9ybWF0QW5kSW50ZXJ2YWwoKSB7XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC54LmludGVydmFsID0gdGhpcy5jb25maWcueC5pbnRlcnZhbDtcclxuXHJcbiAgICAgICAgaWYoIXRoaXMucGxvdC54LnRpbWVGb3JtYXQpe1xyXG4gICAgICAgICAgICB0aGlzLmd1ZXNzVGltZUZvcm1hdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIXRoaXMucGxvdC54LmludGVydmFsICYmIHRoaXMucGxvdC54LnRpbWVGb3JtYXQpe1xyXG4gICAgICAgICAgICB0aGlzLmd1ZXNzSW50ZXJ2YWwoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ3Vlc3NUaW1lRm9ybWF0KCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBmb3IobGV0IGk9MDsgaSA8IHNlbGYuY29uZmlnLnguaW50ZXJ2YWxUb0Zvcm1hdHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgaW50ZXJ2YWxGb3JtYXQgPSBzZWxmLmNvbmZpZy54LmludGVydmFsVG9Gb3JtYXRzW2ldO1xyXG4gICAgICAgICAgICB2YXIgZm9ybWF0ID0gbnVsbDtcclxuICAgICAgICAgICAgdmFyIGZvcm1hdE1hdGNoID0gaW50ZXJ2YWxGb3JtYXQuZm9ybWF0cy5zb21lKGY9PntcclxuICAgICAgICAgICAgICAgIGZvcm1hdCA9IGY7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyc2VyID0gZDMudGltZS5mb3JtYXQoZik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5wbG90LngudW5pcXVlVmFsdWVzLmV2ZXJ5KHg9PntcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VyLnBhcnNlKHgpICE9PSBudWxsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmKGZvcm1hdE1hdGNoKXtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC54LnRpbWVGb3JtYXQgPSBmb3JtYXQ7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnR3Vlc3NlZCB0aW1lRm9ybWF0JywgZm9ybWF0KTtcclxuICAgICAgICAgICAgICAgIGlmKCFzZWxmLnBsb3QueC5pbnRlcnZhbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wbG90LnguaW50ZXJ2YWwgPSBpbnRlcnZhbEZvcm1hdC5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHdWVzc2VkIGludGVydmFsJywgc2VsZi5wbG90LnguaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGd1ZXNzSW50ZXJ2YWwoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpIDwgc2VsZi5jb25maWcueC5pbnRlcnZhbFRvRm9ybWF0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgaW50ZXJ2YWxGb3JtYXQgPSBzZWxmLmNvbmZpZy54LmludGVydmFsVG9Gb3JtYXRzW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYoaW50ZXJ2YWxGb3JtYXQuZm9ybWF0cy5pbmRleE9mKHNlbGYucGxvdC54LnRpbWVGb3JtYXQpID49IDApe1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wbG90LnguaW50ZXJ2YWwgPSBpbnRlcnZhbEZvcm1hdC5uYW1lO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0d1ZXNzZWQgaW50ZXJ2YWwnLCBzZWxmLnBsb3QueC5pbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0VGltZVBhcnNlcigpIHtcclxuICAgICAgICBpZighdGhpcy5wbG90LngudGltZVBhcnNlcil7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC54LnRpbWVQYXJzZXIgPSBkMy50aW1lLmZvcm1hdCh0aGlzLnBsb3QueC50aW1lRm9ybWF0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGxvdC54LnRpbWVQYXJzZXI7XHJcbiAgICB9XHJcbn1cclxuXHJcbiIsImltcG9ydCB7Q2hhcnQsIENoYXJ0Q29uZmlnfSBmcm9tIFwiLi9jaGFydFwiO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5pbXBvcnQge0xlZ2VuZH0gZnJvbSAnLi9sZWdlbmQnXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEhlYXRtYXBDb25maWcgZXh0ZW5kcyBDaGFydENvbmZpZyB7XHJcblxyXG4gICAgc3ZnQ2xhc3MgPSAnb2RjLWhlYXRtYXAnO1xyXG4gICAgc2hvd1Rvb2x0aXAgPSB0cnVlOyAvL3Nob3cgdG9vbHRpcCBvbiBkb3QgaG92ZXJcclxuICAgIHRvb2x0aXAgPSB7XHJcbiAgICAgICAgbm9EYXRhVGV4dDogXCJOL0FcIlxyXG4gICAgfTtcclxuICAgIHNob3dMZWdlbmQgPSB0cnVlO1xyXG4gICAgbGVnZW5kID0ge1xyXG4gICAgICAgIHdpZHRoOiAzMCxcclxuICAgICAgICByb3RhdGVMYWJlbHM6IGZhbHNlLFxyXG4gICAgICAgIGRlY2ltYWxQbGFjZXM6IHVuZGVmaW5lZCxcclxuICAgICAgICBmb3JtYXR0ZXI6IHYgPT4gdGhpcy5sZWdlbmQuZGVjaW1hbFBsYWNlcyA9PT0gdW5kZWZpbmVkID8gdiA6IE51bWJlcih2KS50b0ZpeGVkKHRoaXMubGVnZW5kLmRlY2ltYWxQbGFjZXMpXHJcbiAgICB9XHJcbiAgICBoaWdobGlnaHRMYWJlbHMgPSB0cnVlO1xyXG4gICAgeCA9IHsvLyBYIGF4aXMgY29uZmlnXHJcbiAgICAgICAgdGl0bGU6ICcnLCAvLyBheGlzIHRpdGxlXHJcbiAgICAgICAga2V5OiAwLFxyXG4gICAgICAgIHZhbHVlOiAoZCkgPT4gZFt0aGlzLngua2V5XSwgLy8geCB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgIHJvdGF0ZUxhYmVsczogdHJ1ZSxcclxuICAgICAgICBzb3J0TGFiZWxzOiBmYWxzZSxcclxuICAgICAgICBzb3J0Q29tcGFyYXRvcjogKGEsIGIpPT4gVXRpbHMuaXNOdW1iZXIoYSkgPyBhIC0gYiA6IGEubG9jYWxlQ29tcGFyZShiKSxcclxuICAgICAgICBncm91cHM6IHtcclxuICAgICAgICAgICAga2V5czogW10sXHJcbiAgICAgICAgICAgIGxhYmVsczogW10sXHJcbiAgICAgICAgICAgIHZhbHVlOiAoZCwga2V5KSA9PiBkW2tleV0sXHJcbiAgICAgICAgICAgIG92ZXJsYXA6IHtcclxuICAgICAgICAgICAgICAgIHRvcDogMjAsXHJcbiAgICAgICAgICAgICAgICBib3R0b206IDIwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGZvcm1hdHRlcjogdW5kZWZpbmVkIC8vIHZhbHVlIGZvcm1hdHRlciBmdW5jdGlvblxyXG5cclxuICAgIH07XHJcbiAgICB5ID0gey8vIFkgYXhpcyBjb25maWdcclxuICAgICAgICB0aXRsZTogJycsIC8vIGF4aXMgdGl0bGUsXHJcbiAgICAgICAgcm90YXRlTGFiZWxzOiB0cnVlLFxyXG4gICAgICAgIGtleTogMSxcclxuICAgICAgICB2YWx1ZTogKGQpID0+IGRbdGhpcy55LmtleV0sIC8vIHkgdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICBzb3J0TGFiZWxzOiBmYWxzZSxcclxuICAgICAgICBzb3J0Q29tcGFyYXRvcjogKGEsIGIpPT4gVXRpbHMuaXNOdW1iZXIoYikgPyBiIC0gYSA6IGIubG9jYWxlQ29tcGFyZShhKSxcclxuICAgICAgICBncm91cHM6IHtcclxuICAgICAgICAgICAga2V5czogW10sXHJcbiAgICAgICAgICAgIGxhYmVsczogW10sXHJcbiAgICAgICAgICAgIHZhbHVlOiAoZCwga2V5KSA9PiBkW2tleV0sXHJcbiAgICAgICAgICAgIG92ZXJsYXA6IHtcclxuICAgICAgICAgICAgICAgIGxlZnQ6IDIwLFxyXG4gICAgICAgICAgICAgICAgcmlnaHQ6IDIwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGZvcm1hdHRlcjogdW5kZWZpbmVkLy8gdmFsdWUgZm9ybWF0dGVyIGZ1bmN0aW9uXHJcbiAgICB9O1xyXG4gICAgeiA9IHtcclxuICAgICAgICBrZXk6IDIsXHJcbiAgICAgICAgdmFsdWU6IChkKSA9PiBkW3RoaXMuei5rZXldLFxyXG4gICAgICAgIG5vdEF2YWlsYWJsZVZhbHVlOiAodikgPT4gdiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQsXHJcblxyXG4gICAgICAgIGRlY2ltYWxQbGFjZXM6IHVuZGVmaW5lZCxcclxuICAgICAgICBmb3JtYXR0ZXI6IHYgPT4gdGhpcy56LmRlY2ltYWxQbGFjZXMgPT09IHVuZGVmaW5lZCA/IHYgOiBOdW1iZXIodikudG9GaXhlZCh0aGlzLnouZGVjaW1hbFBsYWNlcykvLyB2YWx1ZSBmb3JtYXR0ZXIgZnVuY3Rpb25cclxuXHJcbiAgICB9O1xyXG4gICAgY29sb3IgPSB7XHJcbiAgICAgICAgbm9EYXRhQ29sb3I6IFwid2hpdGVcIixcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIixcclxuICAgICAgICByZXZlcnNlU2NhbGU6IGZhbHNlLFxyXG4gICAgICAgIHJhbmdlOiBbXCJkYXJrYmx1ZVwiLCBcImxpZ2h0c2t5Ymx1ZVwiLCBcIm9yYW5nZVwiLCBcImNyaW1zb25cIiwgXCJkYXJrcmVkXCJdXHJcbiAgICB9O1xyXG4gICAgY2VsbCA9IHtcclxuICAgICAgICB3aWR0aDogdW5kZWZpbmVkLFxyXG4gICAgICAgIGhlaWdodDogdW5kZWZpbmVkLFxyXG4gICAgICAgIHNpemVNaW46IDE1LFxyXG4gICAgICAgIHNpemVNYXg6IDI1MCxcclxuICAgICAgICBwYWRkaW5nOiAwXHJcbiAgICB9O1xyXG4gICAgbWFyZ2luID0ge1xyXG4gICAgICAgIGxlZnQ6IDYwLFxyXG4gICAgICAgIHJpZ2h0OiA1MCxcclxuICAgICAgICB0b3A6IDMwLFxyXG4gICAgICAgIGJvdHRvbTogODBcclxuICAgIH07XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBpZiAoY3VzdG9tKSB7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vVE9ETyByZWZhY3RvclxyXG5leHBvcnQgY2xhc3MgSGVhdG1hcCBleHRlbmRzIENoYXJ0IHtcclxuXHJcbiAgICBzdGF0aWMgbWF4R3JvdXBHYXBTaXplID0gMjQ7XHJcbiAgICBzdGF0aWMgZ3JvdXBUaXRsZVJlY3RIZWlnaHQgPSA2O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIG5ldyBIZWF0bWFwQ29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBIZWF0bWFwQ29uZmlnKGNvbmZpZykpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0UGxvdCgpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgbWFyZ2luID0gdGhpcy5jb25maWcubWFyZ2luO1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC54ID0ge307XHJcbiAgICAgICAgdGhpcy5wbG90LnkgPSB7fTtcclxuICAgICAgICB0aGlzLnBsb3QueiA9IHtcclxuICAgICAgICAgICAgbWF0cml4ZXM6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgY2VsbHM6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgY29sb3I6IHt9LFxyXG4gICAgICAgICAgICBzaGFwZToge31cclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cFZhbHVlcygpO1xyXG4gICAgICAgIHRoaXMuYnVpbGRDZWxscygpO1xyXG5cclxuICAgICAgICB2YXIgdGl0bGVSZWN0V2lkdGggPSA2O1xyXG4gICAgICAgIHRoaXMucGxvdC54Lm92ZXJsYXAgPSB7XHJcbiAgICAgICAgICAgIHRvcDogMCxcclxuICAgICAgICAgICAgYm90dG9tOiAwXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAodGhpcy5wbG90Lmdyb3VwQnlYKSB7XHJcbiAgICAgICAgICAgIGxldCBkZXB0aCA9IHNlbGYuY29uZmlnLnguZ3JvdXBzLmtleXMubGVuZ3RoO1xyXG4gICAgICAgICAgICBsZXQgYWxsVGl0bGVzV2lkdGggPSBkZXB0aCAqICh0aXRsZVJlY3RXaWR0aCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnBsb3QueC5vdmVybGFwLmJvdHRvbSA9IHNlbGYuY29uZmlnLnguZ3JvdXBzLm92ZXJsYXAuYm90dG9tO1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QueC5vdmVybGFwLnRvcCA9IHNlbGYuY29uZmlnLnguZ3JvdXBzLm92ZXJsYXAudG9wICsgYWxsVGl0bGVzV2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5tYXJnaW4udG9wID0gY29uZi5tYXJnaW4ucmlnaHQgKyBjb25mLnguZ3JvdXBzLm92ZXJsYXAudG9wO1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWFyZ2luLmJvdHRvbSA9IGNvbmYubWFyZ2luLmJvdHRvbSArIGNvbmYueC5ncm91cHMub3ZlcmxhcC5ib3R0b207XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5wbG90Lnkub3ZlcmxhcCA9IHtcclxuICAgICAgICAgICAgbGVmdDogMCxcclxuICAgICAgICAgICAgcmlnaHQ6IDBcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgaWYgKHRoaXMucGxvdC5ncm91cEJ5WSkge1xyXG4gICAgICAgICAgICBsZXQgZGVwdGggPSBzZWxmLmNvbmZpZy55Lmdyb3Vwcy5rZXlzLmxlbmd0aDtcclxuICAgICAgICAgICAgbGV0IGFsbFRpdGxlc1dpZHRoID0gZGVwdGggKiAodGl0bGVSZWN0V2lkdGgpO1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QueS5vdmVybGFwLnJpZ2h0ID0gc2VsZi5jb25maWcueS5ncm91cHMub3ZlcmxhcC5sZWZ0ICsgYWxsVGl0bGVzV2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC55Lm92ZXJsYXAubGVmdCA9IHNlbGYuY29uZmlnLnkuZ3JvdXBzLm92ZXJsYXAubGVmdDtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lm1hcmdpbi5sZWZ0ID0gY29uZi5tYXJnaW4ubGVmdCArIHRoaXMucGxvdC55Lm92ZXJsYXAubGVmdDtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lm1hcmdpbi5yaWdodCA9IGNvbmYubWFyZ2luLnJpZ2h0ICsgdGhpcy5wbG90Lnkub3ZlcmxhcC5yaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbG90LnNob3dMZWdlbmQgPSBjb25mLnNob3dMZWdlbmQ7XHJcbiAgICAgICAgaWYgKHRoaXMucGxvdC5zaG93TGVnZW5kKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5tYXJnaW4ucmlnaHQgKz0gY29uZi5sZWdlbmQud2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY29tcHV0ZVBsb3RTaXplKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFpTY2FsZSgpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cFZhbHVlcygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGNvbmZpZyA9IHNlbGYuY29uZmlnO1xyXG4gICAgICAgIHZhciB4ID0gc2VsZi5wbG90Lng7XHJcbiAgICAgICAgdmFyIHkgPSBzZWxmLnBsb3QueTtcclxuICAgICAgICB2YXIgeiA9IHNlbGYucGxvdC56O1xyXG5cclxuXHJcbiAgICAgICAgeC52YWx1ZSA9IGQgPT4gY29uZmlnLngudmFsdWUuY2FsbChjb25maWcsIGQpO1xyXG4gICAgICAgIHkudmFsdWUgPSBkID0+IGNvbmZpZy55LnZhbHVlLmNhbGwoY29uZmlnLCBkKTtcclxuICAgICAgICB6LnZhbHVlID0gZCA9PiBjb25maWcuei52YWx1ZS5jYWxsKGNvbmZpZywgZCk7XHJcblxyXG4gICAgICAgIHgudW5pcXVlVmFsdWVzID0gW107XHJcbiAgICAgICAgeS51bmlxdWVWYWx1ZXMgPSBbXTtcclxuXHJcblxyXG4gICAgICAgIHNlbGYucGxvdC5ncm91cEJ5WSA9ICEhY29uZmlnLnkuZ3JvdXBzLmtleXMubGVuZ3RoO1xyXG4gICAgICAgIHNlbGYucGxvdC5ncm91cEJ5WCA9ICEhY29uZmlnLnguZ3JvdXBzLmtleXMubGVuZ3RoO1xyXG5cclxuICAgICAgICB5Lmdyb3VwcyA9IHtcclxuICAgICAgICAgICAga2V5OiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGxhYmVsOiAnJyxcclxuICAgICAgICAgICAgdmFsdWVzOiBbXSxcclxuICAgICAgICAgICAgY2hpbGRyZW46IG51bGwsXHJcbiAgICAgICAgICAgIGxldmVsOiAwLFxyXG4gICAgICAgICAgICBpbmRleDogMCxcclxuICAgICAgICAgICAgbGFzdEluZGV4OiAwXHJcbiAgICAgICAgfTtcclxuICAgICAgICB4Lmdyb3VwcyA9IHtcclxuICAgICAgICAgICAga2V5OiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGxhYmVsOiAnJyxcclxuICAgICAgICAgICAgdmFsdWVzOiBbXSxcclxuICAgICAgICAgICAgY2hpbGRyZW46IG51bGwsXHJcbiAgICAgICAgICAgIGxldmVsOiAwLFxyXG4gICAgICAgICAgICBpbmRleDogMCxcclxuICAgICAgICAgICAgbGFzdEluZGV4OiAwXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIHZhbHVlTWFwID0ge307XHJcbiAgICAgICAgdmFyIG1pblogPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdmFyIG1heFogPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5kYXRhLmZvckVhY2goZD0+IHtcclxuXHJcbiAgICAgICAgICAgIHZhciB4VmFsID0geC52YWx1ZShkKTtcclxuICAgICAgICAgICAgdmFyIHlWYWwgPSB5LnZhbHVlKGQpO1xyXG4gICAgICAgICAgICB2YXIgelZhbFJhdyA9IHoudmFsdWUoZCk7XHJcbiAgICAgICAgICAgIHZhciB6VmFsID0gY29uZmlnLnoubm90QXZhaWxhYmxlVmFsdWUoelZhbFJhdykgPyB1bmRlZmluZWQgOiBwYXJzZUZsb2F0KHpWYWxSYXcpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGlmICh4LnVuaXF1ZVZhbHVlcy5pbmRleE9mKHhWYWwpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgeC51bmlxdWVWYWx1ZXMucHVzaCh4VmFsKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHkudW5pcXVlVmFsdWVzLmluZGV4T2YoeVZhbCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB5LnVuaXF1ZVZhbHVlcy5wdXNoKHlWYWwpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgZ3JvdXBZID0geS5ncm91cHM7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnBsb3QuZ3JvdXBCeVkpIHtcclxuICAgICAgICAgICAgICAgIGdyb3VwWSA9IHRoaXMudXBkYXRlR3JvdXBzKGQsIHlWYWwsIHkuZ3JvdXBzLCBjb25maWcueS5ncm91cHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBncm91cFggPSB4Lmdyb3VwcztcclxuICAgICAgICAgICAgaWYgKHNlbGYucGxvdC5ncm91cEJ5WCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGdyb3VwWCA9IHRoaXMudXBkYXRlR3JvdXBzKGQsIHhWYWwsIHguZ3JvdXBzLCBjb25maWcueC5ncm91cHMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXZhbHVlTWFwW2dyb3VwWS5pbmRleF0pIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlTWFwW2dyb3VwWS5pbmRleF0gPSB7fTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCF2YWx1ZU1hcFtncm91cFkuaW5kZXhdW2dyb3VwWC5pbmRleF0pIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlTWFwW2dyb3VwWS5pbmRleF1bZ3JvdXBYLmluZGV4XSA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdmFsdWVNYXBbZ3JvdXBZLmluZGV4XVtncm91cFguaW5kZXhdW3lWYWxdKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZU1hcFtncm91cFkuaW5kZXhdW2dyb3VwWC5pbmRleF1beVZhbF0gPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YWx1ZU1hcFtncm91cFkuaW5kZXhdW2dyb3VwWC5pbmRleF1beVZhbF1beFZhbF0gPSB6VmFsO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGlmIChtaW5aID09PSB1bmRlZmluZWQgfHwgelZhbCA8IG1pblopIHtcclxuICAgICAgICAgICAgICAgIG1pblogPSB6VmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChtYXhaID09PSB1bmRlZmluZWQgfHwgelZhbCA+IG1heFopIHtcclxuICAgICAgICAgICAgICAgIG1heFogPSB6VmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc2VsZi5wbG90LnZhbHVlTWFwID0gdmFsdWVNYXA7XHJcblxyXG5cclxuICAgICAgICBpZiAoIXNlbGYucGxvdC5ncm91cEJ5WCkge1xyXG4gICAgICAgICAgICB4Lmdyb3Vwcy52YWx1ZXMgPSB4LnVuaXF1ZVZhbHVlcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghc2VsZi5wbG90Lmdyb3VwQnlZKSB7XHJcbiAgICAgICAgICAgIHkuZ3JvdXBzLnZhbHVlcyA9IHkudW5pcXVlVmFsdWVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cFZhbHVlc0JlZm9yZUdyb3Vwc1NvcnQoKTtcclxuXHJcbiAgICAgICAgeC5nYXBzID0gW107XHJcbiAgICAgICAgeC50b3RhbFZhbHVlc0NvdW50ID0gMDtcclxuICAgICAgICB4LmFsbFZhbHVlc0xpc3QgPSBbXTtcclxuICAgICAgICB0aGlzLnNvcnRHcm91cHMoeCwgeC5ncm91cHMsIGNvbmZpZy54KTtcclxuXHJcbiAgICAgICAgeS5nYXBzID0gW107XHJcbiAgICAgICAgeS50b3RhbFZhbHVlc0NvdW50ID0gMDtcclxuICAgICAgICB5LmFsbFZhbHVlc0xpc3QgPSBbXTtcclxuICAgICAgICB0aGlzLnNvcnRHcm91cHMoeSwgeS5ncm91cHMsIGNvbmZpZy55KTtcclxuXHJcbiAgICAgICAgei5taW4gPSBtaW5aO1xyXG4gICAgICAgIHoubWF4ID0gbWF4WjtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXBWYWx1ZXNCZWZvcmVHcm91cHNTb3J0KCkge1xyXG4gICAgfVxyXG5cclxuICAgIGJ1aWxkQ2VsbHMoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciB4ID0gc2VsZi5wbG90Lng7XHJcbiAgICAgICAgdmFyIHkgPSBzZWxmLnBsb3QueTtcclxuICAgICAgICB2YXIgeiA9IHNlbGYucGxvdC56O1xyXG4gICAgICAgIHZhciB2YWx1ZU1hcCA9IHNlbGYucGxvdC52YWx1ZU1hcDtcclxuXHJcbiAgICAgICAgdmFyIG1hdHJpeENlbGxzID0gc2VsZi5wbG90LmNlbGxzID0gW107XHJcbiAgICAgICAgdmFyIG1hdHJpeCA9IHNlbGYucGxvdC5tYXRyaXggPSBbXTtcclxuXHJcbiAgICAgICAgeS5hbGxWYWx1ZXNMaXN0LmZvckVhY2goKHYxLCBpKT0+IHtcclxuICAgICAgICAgICAgdmFyIHJvdyA9IFtdO1xyXG4gICAgICAgICAgICBtYXRyaXgucHVzaChyb3cpO1xyXG5cclxuICAgICAgICAgICAgeC5hbGxWYWx1ZXNMaXN0LmZvckVhY2goKHYyLCBqKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgelZhbCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgelZhbCA9IHZhbHVlTWFwW3YxLmdyb3VwLmluZGV4XVt2Mi5ncm91cC5pbmRleF1bdjEudmFsXVt2Mi52YWxdXHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGNlbGwgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcm93VmFyOiB2MSxcclxuICAgICAgICAgICAgICAgICAgICBjb2xWYXI6IHYyLFxyXG4gICAgICAgICAgICAgICAgICAgIHJvdzogaSxcclxuICAgICAgICAgICAgICAgICAgICBjb2w6IGosXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHpWYWxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByb3cucHVzaChjZWxsKTtcclxuXHJcbiAgICAgICAgICAgICAgICBtYXRyaXhDZWxscy5wdXNoKGNlbGwpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlR3JvdXBzKGQsIGF4aXNWYWwsIHJvb3RHcm91cCwgYXhpc0dyb3Vwc0NvbmZpZykge1xyXG5cclxuICAgICAgICB2YXIgY29uZmlnID0gdGhpcy5jb25maWc7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRHcm91cCA9IHJvb3RHcm91cDtcclxuICAgICAgICBheGlzR3JvdXBzQ29uZmlnLmtleXMuZm9yRWFjaCgoZ3JvdXBLZXksIGdyb3VwS2V5SW5kZXgpID0+IHtcclxuICAgICAgICAgICAgY3VycmVudEdyb3VwLmtleSA9IGdyb3VwS2V5O1xyXG5cclxuICAgICAgICAgICAgaWYgKCFjdXJyZW50R3JvdXAuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC5jaGlsZHJlbiA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgZ3JvdXBpbmdWYWx1ZSA9IGF4aXNHcm91cHNDb25maWcudmFsdWUuY2FsbChjb25maWcsIGQsIGdyb3VwS2V5KTtcclxuXHJcbiAgICAgICAgICAgIGlmICghY3VycmVudEdyb3VwLmNoaWxkcmVuLmhhc093blByb3BlcnR5KGdyb3VwaW5nVmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICByb290R3JvdXAubGFzdEluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAuY2hpbGRyZW5bZ3JvdXBpbmdWYWx1ZV0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBncm91cGluZ1ZhbHVlOiBncm91cGluZ1ZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGxldmVsOiBjdXJyZW50R3JvdXAubGV2ZWwgKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4OiByb290R3JvdXAubGFzdEluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgIGtleTogZ3JvdXBLZXlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY3VycmVudEdyb3VwID0gY3VycmVudEdyb3VwLmNoaWxkcmVuW2dyb3VwaW5nVmFsdWVdO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoY3VycmVudEdyb3VwLnZhbHVlcy5pbmRleE9mKGF4aXNWYWwpID09PSAtMSkge1xyXG4gICAgICAgICAgICBjdXJyZW50R3JvdXAudmFsdWVzLnB1c2goYXhpc1ZhbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY3VycmVudEdyb3VwO1xyXG4gICAgfVxyXG5cclxuICAgIHNvcnRHcm91cHMoYXhpcywgZ3JvdXAsIGF4aXNDb25maWcsIGdhcHMpIHtcclxuICAgICAgICBpZiAoYXhpc0NvbmZpZy5ncm91cHMubGFiZWxzICYmIGF4aXNDb25maWcuZ3JvdXBzLmxhYmVscy5sZW5ndGggPiBncm91cC5sZXZlbCkge1xyXG4gICAgICAgICAgICBncm91cC5sYWJlbCA9IGF4aXNDb25maWcuZ3JvdXBzLmxhYmVsc1tncm91cC5sZXZlbF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZ3JvdXAubGFiZWwgPSBncm91cC5rZXk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWdhcHMpIHtcclxuICAgICAgICAgICAgZ2FwcyA9IFswXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGdhcHMubGVuZ3RoIDw9IGdyb3VwLmxldmVsKSB7XHJcbiAgICAgICAgICAgIGdhcHMucHVzaCgwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdyb3VwLmFsbFZhbHVlc0NvdW50ID0gZ3JvdXAuYWxsVmFsdWVzQ291bnQgfHwgMDtcclxuICAgICAgICBncm91cC5hbGxWYWx1ZXNCZWZvcmVDb3VudCA9IGdyb3VwLmFsbFZhbHVlc0JlZm9yZUNvdW50IHx8IDA7XHJcblxyXG4gICAgICAgIGdyb3VwLmdhcHMgPSBnYXBzLnNsaWNlKCk7XHJcbiAgICAgICAgZ3JvdXAuZ2Fwc0JlZm9yZSA9IGdhcHMuc2xpY2UoKTtcclxuXHJcblxyXG4gICAgICAgIGdyb3VwLmdhcHNTaXplID0gSGVhdG1hcC5jb21wdXRlR2Fwc1NpemUoZ3JvdXAuZ2Fwcyk7XHJcbiAgICAgICAgZ3JvdXAuZ2Fwc0JlZm9yZVNpemUgPSBncm91cC5nYXBzU2l6ZTtcclxuICAgICAgICBpZiAoZ3JvdXAudmFsdWVzKSB7XHJcbiAgICAgICAgICAgIGlmIChheGlzQ29uZmlnLnNvcnRMYWJlbHMpIHtcclxuICAgICAgICAgICAgICAgIGdyb3VwLnZhbHVlcy5zb3J0KGF4aXNDb25maWcuc29ydENvbXBhcmF0b3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdyb3VwLnZhbHVlcy5mb3JFYWNoKHY9PmF4aXMuYWxsVmFsdWVzTGlzdC5wdXNoKHt2YWw6IHYsIGdyb3VwOiBncm91cH0pKTtcclxuICAgICAgICAgICAgZ3JvdXAuYWxsVmFsdWVzQmVmb3JlQ291bnQgPSBheGlzLnRvdGFsVmFsdWVzQ291bnQ7XHJcbiAgICAgICAgICAgIGF4aXMudG90YWxWYWx1ZXNDb3VudCArPSBncm91cC52YWx1ZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICBncm91cC5hbGxWYWx1ZXNDb3VudCArPSBncm91cC52YWx1ZXMubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ3JvdXAuY2hpbGRyZW5MaXN0ID0gW107XHJcbiAgICAgICAgaWYgKGdyb3VwLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbkNvdW50ID0gMDtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGNoaWxkUHJvcCBpbiBncm91cC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwLmNoaWxkcmVuLmhhc093blByb3BlcnR5KGNoaWxkUHJvcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBncm91cC5jaGlsZHJlbltjaGlsZFByb3BdO1xyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwLmNoaWxkcmVuTGlzdC5wdXNoKGNoaWxkKTtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbkNvdW50Kys7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc29ydEdyb3VwcyhheGlzLCBjaGlsZCwgYXhpc0NvbmZpZywgZ2Fwcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAuYWxsVmFsdWVzQ291bnQgKz0gY2hpbGQuYWxsVmFsdWVzQ291bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2Fwc1tncm91cC5sZXZlbF0gKz0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGdhcHMgJiYgY2hpbGRyZW5Db3VudCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIGdhcHNbZ3JvdXAubGV2ZWxdIC09IDE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGdyb3VwLmdhcHNJbnNpZGUgPSBbXTtcclxuICAgICAgICAgICAgZ2Fwcy5mb3JFYWNoKChkLCBpKT0+IHtcclxuICAgICAgICAgICAgICAgIGdyb3VwLmdhcHNJbnNpZGUucHVzaChkIC0gKGdyb3VwLmdhcHNCZWZvcmVbaV0gfHwgMCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZ3JvdXAuZ2Fwc0luc2lkZVNpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBzU2l6ZShncm91cC5nYXBzSW5zaWRlKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChheGlzLmdhcHMubGVuZ3RoIDwgZ2Fwcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGF4aXMuZ2FwcyA9IGdhcHM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNvbXB1dGVZQXhpc0xhYmVsc1dpZHRoKG9mZnNldCkge1xyXG4gICAgICAgIHZhciBtYXhXaWR0aCA9IHRoaXMucGxvdC5tYXJnaW4ubGVmdDtcclxuICAgICAgICBpZiAodGhpcy5jb25maWcueS50aXRsZSkge1xyXG4gICAgICAgICAgICBtYXhXaWR0aCAtPSAxNTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9mZnNldCAmJiBvZmZzZXQueCkge1xyXG4gICAgICAgICAgICBtYXhXaWR0aCArPSBvZmZzZXQueDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy55LnJvdGF0ZUxhYmVscykge1xyXG4gICAgICAgICAgICBtYXhXaWR0aCAqPSBVdGlscy5TUVJUXzI7XHJcbiAgICAgICAgICAgIHZhciBmb250U2l6ZSA9IDExOyAvL3RvZG8gY2hlY2sgYWN0dWFsIGZvbnQgc2l6ZVxyXG4gICAgICAgICAgICBtYXhXaWR0aCAtPWZvbnRTaXplLzI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbWF4V2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcHV0ZVhBeGlzTGFiZWxzV2lkdGgob2Zmc2V0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy54LnJvdGF0ZUxhYmVscykge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wbG90LmNlbGxXaWR0aCAtIDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBzaXplID0gdGhpcy5wbG90Lm1hcmdpbi5ib3R0b207XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLngudGl0bGUpIHtcclxuICAgICAgICAgICAgc2l6ZSAtPSAxNTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9mZnNldCAmJiBvZmZzZXQueSkge1xyXG4gICAgICAgICAgICBzaXplIC09IG9mZnNldC55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2l6ZSAqPSBVdGlscy5TUVJUXzI7XHJcblxyXG4gICAgICAgIHZhciBmb250U2l6ZSA9IDExOyAvL3RvZG8gY2hlY2sgYWN0dWFsIGZvbnQgc2l6ZVxyXG4gICAgICAgIHNpemUgLT1mb250U2l6ZS8yO1xyXG5cclxuICAgICAgICByZXR1cm4gc2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY29tcHV0ZUdhcFNpemUoZ2FwTGV2ZWwpIHtcclxuICAgICAgICByZXR1cm4gSGVhdG1hcC5tYXhHcm91cEdhcFNpemUgLyAoZ2FwTGV2ZWwgKyAxKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY29tcHV0ZUdhcHNTaXplKGdhcHMpIHtcclxuICAgICAgICB2YXIgZ2Fwc1NpemUgPSAwO1xyXG4gICAgICAgIGdhcHMuZm9yRWFjaCgoZ2Fwc051bWJlciwgZ2Fwc0xldmVsKT0+IGdhcHNTaXplICs9IGdhcHNOdW1iZXIgKiBIZWF0bWFwLmNvbXB1dGVHYXBTaXplKGdhcHNMZXZlbCkpO1xyXG4gICAgICAgIHJldHVybiBnYXBzU2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wdXRlUGxvdFNpemUoKSB7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcbiAgICAgICAgdmFyIG1hcmdpbiA9IHBsb3QubWFyZ2luO1xyXG4gICAgICAgIHZhciBhdmFpbGFibGVXaWR0aCA9IFV0aWxzLmF2YWlsYWJsZVdpZHRoKHRoaXMuY29uZmlnLndpZHRoLCB0aGlzLmdldEJhc2VDb250YWluZXIoKSwgdGhpcy5wbG90Lm1hcmdpbik7XHJcbiAgICAgICAgdmFyIGF2YWlsYWJsZUhlaWdodCA9IFV0aWxzLmF2YWlsYWJsZUhlaWdodCh0aGlzLmNvbmZpZy5oZWlnaHQsIHRoaXMuZ2V0QmFzZUNvbnRhaW5lcigpLCB0aGlzLnBsb3QubWFyZ2luKTtcclxuICAgICAgICB2YXIgd2lkdGggPSBhdmFpbGFibGVXaWR0aDtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gYXZhaWxhYmxlSGVpZ2h0O1xyXG5cclxuICAgICAgICB2YXIgeEdhcHNTaXplID0gSGVhdG1hcC5jb21wdXRlR2Fwc1NpemUocGxvdC54LmdhcHMpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGNvbXB1dGVkQ2VsbFdpZHRoID0gTWF0aC5tYXgoY29uZi5jZWxsLnNpemVNaW4sIE1hdGgubWluKGNvbmYuY2VsbC5zaXplTWF4LCAoYXZhaWxhYmxlV2lkdGggLSB4R2Fwc1NpemUpIC8gdGhpcy5wbG90LngudG90YWxWYWx1ZXNDb3VudCkpO1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy53aWR0aCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5jZWxsLndpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuY2VsbFdpZHRoID0gY29tcHV0ZWRDZWxsV2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxXaWR0aCA9IHRoaXMuY29uZmlnLmNlbGwud2lkdGg7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMucGxvdC5jZWxsV2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsV2lkdGggPSBjb21wdXRlZENlbGxXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgd2lkdGggPSB0aGlzLnBsb3QuY2VsbFdpZHRoICogdGhpcy5wbG90LngudG90YWxWYWx1ZXNDb3VudCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0ICsgeEdhcHNTaXplO1xyXG5cclxuICAgICAgICB2YXIgeUdhcHNTaXplID0gSGVhdG1hcC5jb21wdXRlR2Fwc1NpemUocGxvdC55LmdhcHMpO1xyXG4gICAgICAgIHZhciBjb21wdXRlZENlbGxIZWlnaHQgPSBNYXRoLm1heChjb25mLmNlbGwuc2l6ZU1pbiwgTWF0aC5taW4oY29uZi5jZWxsLnNpemVNYXgsIChhdmFpbGFibGVIZWlnaHQgLSB5R2Fwc1NpemUpIC8gdGhpcy5wbG90LnkudG90YWxWYWx1ZXNDb3VudCkpO1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5oZWlnaHQpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5jZWxsLmhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxIZWlnaHQgPSBjb21wdXRlZENlbGxIZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuY2VsbEhlaWdodCA9IHRoaXMuY29uZmlnLmNlbGwuaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLnBsb3QuY2VsbEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxIZWlnaHQgPSBjb21wdXRlZENlbGxIZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBoZWlnaHQgPSB0aGlzLnBsb3QuY2VsbEhlaWdodCAqIHRoaXMucGxvdC55LnRvdGFsVmFsdWVzQ291bnQgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbSArIHlHYXBzU2l6ZTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMucGxvdC53aWR0aCA9IHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XHJcbiAgICAgICAgdGhpcy5wbG90LmhlaWdodCA9IGhlaWdodCAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBzZXR1cFpTY2FsZSgpIHtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBjb25maWcgPSBzZWxmLmNvbmZpZztcclxuICAgICAgICB2YXIgeiA9IHNlbGYucGxvdC56O1xyXG4gICAgICAgIHZhciByYW5nZSA9IGNvbmZpZy5jb2xvci5yYW5nZTtcclxuICAgICAgICB2YXIgZXh0ZW50ID0gei5tYXggLSB6Lm1pbjtcclxuICAgICAgICB2YXIgc2NhbGU7XHJcbiAgICAgICAgei5kb21haW4gPSBbXTtcclxuICAgICAgICBpZiAoY29uZmlnLmNvbG9yLnNjYWxlID09IFwicG93XCIpIHtcclxuICAgICAgICAgICAgdmFyIGV4cG9uZW50ID0gMTA7XHJcbiAgICAgICAgICAgIHJhbmdlLmZvckVhY2goKGMsIGkpPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHYgPSB6Lm1heCAtIChleHRlbnQgLyBNYXRoLnBvdygxMCwgaSkpO1xyXG4gICAgICAgICAgICAgICAgei5kb21haW4ucHVzaCh2KVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc2NhbGUgPSBkMy5zY2FsZS5wb3coKS5leHBvbmVudChleHBvbmVudCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb25maWcuY29sb3Iuc2NhbGUgPT0gXCJsb2dcIikge1xyXG5cclxuICAgICAgICAgICAgcmFuZ2UuZm9yRWFjaCgoYywgaSk9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdiA9IHoubWluICsgKGV4dGVudCAvIE1hdGgucG93KDEwLCBpKSk7XHJcbiAgICAgICAgICAgICAgICB6LmRvbWFpbi51bnNoaWZ0KHYpXHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHNjYWxlID0gZDMuc2NhbGUubG9nKClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByYW5nZS5mb3JFYWNoKChjLCBpKT0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB2ID0gei5taW4gKyAoZXh0ZW50ICogKGkgLyAocmFuZ2UubGVuZ3RoIC0gMSkpKTtcclxuICAgICAgICAgICAgICAgIHouZG9tYWluLnB1c2godilcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHNjYWxlID0gZDMuc2NhbGVbY29uZmlnLmNvbG9yLnNjYWxlXSgpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHouZG9tYWluWzBdID0gei5taW47IC8vcmVtb3ZpbmcgdW5uZWNlc3NhcnkgZmxvYXRpbmcgcG9pbnRzXHJcbiAgICAgICAgei5kb21haW5bei5kb21haW4ubGVuZ3RoIC0gMV0gPSB6Lm1heDsgLy9yZW1vdmluZyB1bm5lY2Vzc2FyeSBmbG9hdGluZyBwb2ludHNcclxuICAgICAgICBjb25zb2xlLmxvZyh6LmRvbWFpbik7XHJcblxyXG4gICAgICAgIGlmIChjb25maWcuY29sb3IucmV2ZXJzZVNjYWxlKSB7XHJcbiAgICAgICAgICAgIHouZG9tYWluLnJldmVyc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhyYW5nZSk7XHJcbiAgICAgICAgcGxvdC56LmNvbG9yLnNjYWxlID0gc2NhbGUuZG9tYWluKHouZG9tYWluKS5yYW5nZShyYW5nZSk7XHJcbiAgICAgICAgdmFyIHNoYXBlID0gcGxvdC56LnNoYXBlID0ge307XHJcblxyXG4gICAgICAgIHZhciBjZWxsQ29uZiA9IHRoaXMuY29uZmlnLmNlbGw7XHJcbiAgICAgICAgc2hhcGUudHlwZSA9IFwicmVjdFwiO1xyXG5cclxuICAgICAgICBwbG90Lnouc2hhcGUud2lkdGggPSBwbG90LmNlbGxXaWR0aCAtIGNlbGxDb25mLnBhZGRpbmcgKiAyO1xyXG4gICAgICAgIHBsb3Quei5zaGFwZS5oZWlnaHQgPSBwbG90LmNlbGxIZWlnaHQgLSBjZWxsQ29uZi5wYWRkaW5nICogMjtcclxuICAgIH1cclxuXHJcblxyXG4gICAgdXBkYXRlKG5ld0RhdGEpIHtcclxuICAgICAgICBzdXBlci51cGRhdGUobmV3RGF0YSk7XHJcbiAgICAgICAgaWYgKHRoaXMucGxvdC5ncm91cEJ5WSkge1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdHcm91cHNZKHRoaXMucGxvdC55Lmdyb3VwcywgdGhpcy5zdmdHKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucGxvdC5ncm91cEJ5WCkge1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdHcm91cHNYKHRoaXMucGxvdC54Lmdyb3VwcywgdGhpcy5zdmdHKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlQ2VsbHMoKTtcclxuXHJcbiAgICAgICAgLy8gdGhpcy51cGRhdGVWYXJpYWJsZUxhYmVscygpO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUF4aXNYKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVBeGlzWSgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcuc2hvd0xlZ2VuZCkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxlZ2VuZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVBeGlzVGl0bGVzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHVwZGF0ZUF4aXNUaXRsZXMoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHVwZGF0ZUF4aXNYKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgbGFiZWxDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJsYWJlbFwiKTtcclxuICAgICAgICB2YXIgbGFiZWxYQ2xhc3MgPSBsYWJlbENsYXNzICsgXCIteFwiO1xyXG4gICAgICAgIHZhciBsYWJlbFlDbGFzcyA9IGxhYmVsQ2xhc3MgKyBcIi15XCI7XHJcbiAgICAgICAgcGxvdC5sYWJlbENsYXNzID0gbGFiZWxDbGFzcztcclxuXHJcbiAgICAgICAgdmFyIG9mZnNldFggPSB7XHJcbiAgICAgICAgICAgIHg6IDAsXHJcbiAgICAgICAgICAgIHk6IDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCBnYXBTaXplID0gSGVhdG1hcC5jb21wdXRlR2FwU2l6ZSgwKTtcclxuICAgICAgICBpZiAocGxvdC5ncm91cEJ5WCkge1xyXG4gICAgICAgICAgICBsZXQgb3ZlcmxhcCA9IHNlbGYuY29uZmlnLnguZ3JvdXBzLm92ZXJsYXA7XHJcblxyXG4gICAgICAgICAgICBvZmZzZXRYLnggPSBnYXBTaXplIC8gMjtcclxuICAgICAgICAgICAgb2Zmc2V0WC55ID0gb3ZlcmxhcC5ib3R0b20gKyBnYXBTaXplIC8gMiArIDY7XHJcbiAgICAgICAgfSBlbHNlIGlmIChwbG90Lmdyb3VwQnlZKSB7XHJcbiAgICAgICAgICAgIG9mZnNldFgueSA9IGdhcFNpemU7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdmFyIGxhYmVscyA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgbGFiZWxYQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBsb3QueC5hbGxWYWx1ZXNMaXN0LCAoZCwgaSk9PmkpO1xyXG5cclxuICAgICAgICBsYWJlbHMuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpLmF0dHIoXCJjbGFzc1wiLCAoZCwgaSkgPT4gbGFiZWxDbGFzcyArIFwiIFwiICsgbGFiZWxYQ2xhc3MgKyBcIiBcIiArIGxhYmVsWENsYXNzICsgXCItXCIgKyBpKTtcclxuXHJcbiAgICAgICAgbGFiZWxzXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAoZCwgaSkgPT4gKGkgKiBwbG90LmNlbGxXaWR0aCArIHBsb3QuY2VsbFdpZHRoIC8gMikgKyAoZC5ncm91cC5nYXBzU2l6ZSkgKyBvZmZzZXRYLngpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCBwbG90LmhlaWdodCArIG9mZnNldFgueSlcclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCAxMClcclxuXHJcbiAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoZD0+c2VsZi5mb3JtYXRWYWx1ZVgoZC52YWwpKTtcclxuXHJcblxyXG5cclxuICAgICAgICB2YXIgbWF4V2lkdGggPSBzZWxmLmNvbXB1dGVYQXhpc0xhYmVsc1dpZHRoKG9mZnNldFgpO1xyXG5cclxuICAgICAgICBsYWJlbHMuZWFjaChmdW5jdGlvbiAobGFiZWwpIHtcclxuICAgICAgICAgICAgdmFyIGVsZW0gPSBkMy5zZWxlY3QodGhpcyksXHJcbiAgICAgICAgICAgICAgICB0ZXh0ID0gc2VsZi5mb3JtYXRWYWx1ZVgobGFiZWwudmFsKTtcclxuICAgICAgICAgICAgVXRpbHMucGxhY2VUZXh0V2l0aEVsbGlwc2lzQW5kVG9vbHRpcChlbGVtLCB0ZXh0LCBtYXhXaWR0aCwgc2VsZi5jb25maWcuc2hvd1Rvb2x0aXAgPyBzZWxmLnBsb3QudG9vbHRpcCA6IGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLngucm90YXRlTGFiZWxzKSB7XHJcbiAgICAgICAgICAgIGxhYmVscy5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInJvdGF0ZSgtNDUsIFwiICsgKChpICogcGxvdC5jZWxsV2lkdGggKyBwbG90LmNlbGxXaWR0aCAvIDIpICsgZC5ncm91cC5nYXBzU2l6ZSArIG9mZnNldFgueCApICsgXCIsIFwiICsgKCBwbG90LmhlaWdodCArIG9mZnNldFgueSkgKyBcIilcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZHhcIiwgLTIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImR5XCIsIDgpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGxhYmVscy5leGl0KCkucmVtb3ZlKCk7XHJcblxyXG5cclxuICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiICsgc2VsZi5wcmVmaXhDbGFzcygnYXhpcy14JykpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKHBsb3Qud2lkdGggLyAyKSArIFwiLFwiICsgKHBsb3QuaGVpZ2h0ICsgcGxvdC5tYXJnaW4uYm90dG9tKSArIFwiKVwiKVxyXG4gICAgICAgICAgICAuc2VsZWN0T3JBcHBlbmQoXCJ0ZXh0LlwiICsgc2VsZi5wcmVmaXhDbGFzcygnbGFiZWwnKSlcclxuXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCItMC41ZW1cIilcclxuICAgICAgICAgICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoc2VsZi5jb25maWcueC50aXRsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlQXhpc1koKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBsYWJlbENsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImxhYmVsXCIpO1xyXG4gICAgICAgIHZhciBsYWJlbFlDbGFzcyA9IGxhYmVsQ2xhc3MgKyBcIi15XCI7XHJcbiAgICAgICAgcGxvdC5sYWJlbENsYXNzID0gbGFiZWxDbGFzcztcclxuXHJcblxyXG4gICAgICAgIHZhciBsYWJlbHMgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIGxhYmVsWUNsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShwbG90LnkuYWxsVmFsdWVzTGlzdCk7XHJcblxyXG4gICAgICAgIGxhYmVscy5lbnRlcigpLmFwcGVuZChcInRleHRcIik7XHJcblxyXG4gICAgICAgIHZhciBvZmZzZXRZID0ge1xyXG4gICAgICAgICAgICB4OiAwLFxyXG4gICAgICAgICAgICB5OiAwXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAocGxvdC5ncm91cEJ5WSkge1xyXG4gICAgICAgICAgICBsZXQgb3ZlcmxhcCA9IHNlbGYuY29uZmlnLnkuZ3JvdXBzLm92ZXJsYXA7XHJcbiAgICAgICAgICAgIGxldCBnYXBTaXplID0gSGVhdG1hcC5jb21wdXRlR2FwU2l6ZSgwKTtcclxuICAgICAgICAgICAgb2Zmc2V0WS54ID0gLW92ZXJsYXAubGVmdDtcclxuXHJcbiAgICAgICAgICAgIG9mZnNldFkueSA9IGdhcFNpemUgLyAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsYWJlbHNcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIG9mZnNldFkueClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIChkLCBpKSA9PiAoaSAqIHBsb3QuY2VsbEhlaWdodCArIHBsb3QuY2VsbEhlaWdodCAvIDIpICsgZC5ncm91cC5nYXBzU2l6ZSArIG9mZnNldFkueSlcclxuICAgICAgICAgICAgLmF0dHIoXCJkeFwiLCAtMilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIChkLCBpKSA9PiBsYWJlbENsYXNzICsgXCIgXCIgKyBsYWJlbFlDbGFzcyArIFwiIFwiICsgbGFiZWxZQ2xhc3MgKyBcIi1cIiArIGkpXHJcblxyXG4gICAgICAgICAgICAudGV4dChmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGZvcm1hdHRlZCA9IHNlbGYuZm9ybWF0VmFsdWVZKGQudmFsKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXR0ZWRcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciBtYXhXaWR0aCA9IHNlbGYuY29tcHV0ZVlBeGlzTGFiZWxzV2lkdGgob2Zmc2V0WSk7XHJcblxyXG4gICAgICAgIGxhYmVscy5lYWNoKGZ1bmN0aW9uIChsYWJlbCkge1xyXG4gICAgICAgICAgICB2YXIgZWxlbSA9IGQzLnNlbGVjdCh0aGlzKSxcclxuICAgICAgICAgICAgICAgIHRleHQgPSBzZWxmLmZvcm1hdFZhbHVlWShsYWJlbC52YWwpO1xyXG4gICAgICAgICAgICBVdGlscy5wbGFjZVRleHRXaXRoRWxsaXBzaXNBbmRUb29sdGlwKGVsZW0sIHRleHQsIG1heFdpZHRoLCBzZWxmLmNvbmZpZy5zaG93VG9vbHRpcCA/IHNlbGYucGxvdC50b29sdGlwIDogZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoc2VsZi5jb25maWcueS5yb3RhdGVMYWJlbHMpIHtcclxuICAgICAgICAgICAgbGFiZWxzXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCAoZCwgaSkgPT4gXCJyb3RhdGUoLTQ1LCBcIiArIChvZmZzZXRZLnggICkgKyBcIiwgXCIgKyAoZC5ncm91cC5nYXBzU2l6ZSArIChpICogcGxvdC5jZWxsSGVpZ2h0ICsgcGxvdC5jZWxsSGVpZ2h0IC8gMikgKyBvZmZzZXRZLnkpICsgXCIpXCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpO1xyXG4gICAgICAgICAgICAvLyAuYXR0cihcImR4XCIsIC03KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsYWJlbHMuYXR0cihcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgbGFiZWxzLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcblxyXG4gICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RPckFwcGVuZChcImcuXCIgKyBzZWxmLnByZWZpeENsYXNzKCdheGlzLXknKSlcclxuICAgICAgICAgICAgLnNlbGVjdE9yQXBwZW5kKFwidGV4dC5cIiArIHNlbGYucHJlZml4Q2xhc3MoJ2xhYmVsJykpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgLXBsb3QubWFyZ2luLmxlZnQgKyBcIixcIiArIChwbG90LmhlaWdodCAvIDIpICsgXCIpcm90YXRlKC05MClcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCBcIjFlbVwiKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAudGV4dChzZWxmLmNvbmZpZy55LnRpdGxlKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGRyYXdHcm91cHNZKHBhcmVudEdyb3VwLCBjb250YWluZXIsIGF2YWlsYWJsZVdpZHRoKSB7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuXHJcbiAgICAgICAgdmFyIGdyb3VwQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwiZ3JvdXBcIik7XHJcbiAgICAgICAgdmFyIGdyb3VwWUNsYXNzID0gZ3JvdXBDbGFzcyArIFwiLXlcIjtcclxuICAgICAgICB2YXIgZ3JvdXBzID0gY29udGFpbmVyLnNlbGVjdEFsbChcImcuXCIgKyBncm91cENsYXNzICsgXCIuXCIgKyBncm91cFlDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGFyZW50R3JvdXAuY2hpbGRyZW5MaXN0KTtcclxuXHJcbiAgICAgICAgdmFyIHZhbHVlc0JlZm9yZUNvdW50ID0gMDtcclxuICAgICAgICB2YXIgZ2Fwc0JlZm9yZVNpemUgPSAwO1xyXG5cclxuICAgICAgICB2YXIgZ3JvdXBzRW50ZXJHID0gZ3JvdXBzLmVudGVyKCkuYXBwZW5kKFwiZ1wiKTtcclxuICAgICAgICBncm91cHNFbnRlckdcclxuICAgICAgICAgICAgLmNsYXNzZWQoZ3JvdXBDbGFzcywgdHJ1ZSlcclxuICAgICAgICAgICAgLmNsYXNzZWQoZ3JvdXBZQ2xhc3MsIHRydWUpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoXCJyZWN0XCIpLmNsYXNzZWQoXCJncm91cC1yZWN0XCIsIHRydWUpO1xyXG5cclxuICAgICAgICB2YXIgdGl0bGVHcm91cEVudGVyID0gZ3JvdXBzRW50ZXJHLmFwcGVuZFNlbGVjdG9yKFwiZy50aXRsZVwiKTtcclxuICAgICAgICB0aXRsZUdyb3VwRW50ZXIuYXBwZW5kKFwicmVjdFwiKTtcclxuICAgICAgICB0aXRsZUdyb3VwRW50ZXIuYXBwZW5kKFwidGV4dFwiKTtcclxuXHJcbiAgICAgICAgdmFyIGdhcFNpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBTaXplKHBhcmVudEdyb3VwLmxldmVsKTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IGdhcFNpemUgLyA0O1xyXG5cclxuICAgICAgICB2YXIgdGl0bGVSZWN0V2lkdGggPSBIZWF0bWFwLmdyb3VwVGl0bGVSZWN0SGVpZ2h0O1xyXG4gICAgICAgIHZhciBkZXB0aCA9IHNlbGYuY29uZmlnLnkuZ3JvdXBzLmtleXMubGVuZ3RoIC0gcGFyZW50R3JvdXAubGV2ZWw7XHJcbiAgICAgICAgdmFyIG92ZXJsYXAgPSB7XHJcbiAgICAgICAgICAgIGxlZnQ6IDAsXHJcbiAgICAgICAgICAgIHJpZ2h0OiAwXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKCFhdmFpbGFibGVXaWR0aCkge1xyXG4gICAgICAgICAgICBvdmVybGFwLnJpZ2h0ID0gcGxvdC55Lm92ZXJsYXAubGVmdDtcclxuICAgICAgICAgICAgb3ZlcmxhcC5sZWZ0ID0gcGxvdC55Lm92ZXJsYXAubGVmdDtcclxuICAgICAgICAgICAgYXZhaWxhYmxlV2lkdGggPSBwbG90LndpZHRoICsgZ2FwU2l6ZSArIG92ZXJsYXAubGVmdCArIG92ZXJsYXAucmlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZ3JvdXBzXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHJhbnNsYXRlID0gXCJ0cmFuc2xhdGUoXCIgKyAocGFkZGluZyAtIG92ZXJsYXAubGVmdCkgKyBcIixcIiArICgocGxvdC5jZWxsSGVpZ2h0ICogdmFsdWVzQmVmb3JlQ291bnQpICsgaSAqIGdhcFNpemUgKyBnYXBzQmVmb3JlU2l6ZSArIHBhZGRpbmcpICsgXCIpXCI7XHJcbiAgICAgICAgICAgICAgICBnYXBzQmVmb3JlU2l6ZSArPSAoZC5nYXBzSW5zaWRlU2l6ZSB8fCAwKTtcclxuICAgICAgICAgICAgICAgIHZhbHVlc0JlZm9yZUNvdW50ICs9IGQuYWxsVmFsdWVzQ291bnQgfHwgMDtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cmFuc2xhdGVcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB2YXIgZ3JvdXBXaWR0aCA9IGF2YWlsYWJsZVdpZHRoIC0gcGFkZGluZyAqIDI7XHJcblxyXG4gICAgICAgIHZhciB0aXRsZUdyb3VwcyA9IGdyb3Vwcy5zZWxlY3RBbGwoXCJnLnRpdGxlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInRyYW5zbGF0ZShcIiArIChncm91cFdpZHRoIC0gdGl0bGVSZWN0V2lkdGgpICsgXCIsIDApXCIpO1xyXG5cclxuICAgICAgICB2YXIgdGlsZVJlY3RzID0gdGl0bGVHcm91cHMuc2VsZWN0QWxsKFwicmVjdFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHRpdGxlUmVjdFdpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBkPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChkLmdhcHNJbnNpZGVTaXplIHx8IDApICsgcGxvdC5jZWxsSGVpZ2h0ICogZC5hbGxWYWx1ZXNDb3VudCArIHBhZGRpbmcgKiAyXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgMClcclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJmaWxsXCIsIFwibGlnaHRncmV5XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDApO1xyXG5cclxuICAgICAgICB0aGlzLnNldEdyb3VwTW91c2VDYWxsYmFja3MocGFyZW50R3JvdXAsIHRpbGVSZWN0cyk7XHJcblxyXG5cclxuICAgICAgICBncm91cHMuc2VsZWN0QWxsKFwicmVjdC5ncm91cC1yZWN0XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgZD0+IFwiZ3JvdXAtcmVjdCBncm91cC1yZWN0LVwiICsgZC5pbmRleClcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBncm91cFdpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBkPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChkLmdhcHNJbnNpZGVTaXplIHx8IDApICsgcGxvdC5jZWxsSGVpZ2h0ICogZC5hbGxWYWx1ZXNDb3VudCArIHBhZGRpbmcgKiAyXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIFwid2hpdGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJmaWxsLW9wYWNpdHlcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMC41KVxyXG4gICAgICAgICAgICAuYXR0cihcInN0cm9rZVwiLCBcImJsYWNrXCIpXHJcblxyXG5cclxuICAgICAgICBncm91cHMuZWFjaChmdW5jdGlvbiAoZ3JvdXApIHtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuZHJhd0dyb3Vwc1kuY2FsbChzZWxmLCBncm91cCwgZDMuc2VsZWN0KHRoaXMpLCBncm91cFdpZHRoIC0gdGl0bGVSZWN0V2lkdGgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBkcmF3R3JvdXBzWChwYXJlbnRHcm91cCwgY29udGFpbmVyLCBhdmFpbGFibGVIZWlnaHQpIHtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG5cclxuICAgICAgICB2YXIgZ3JvdXBDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJncm91cFwiKTtcclxuICAgICAgICB2YXIgZ3JvdXBYQ2xhc3MgPSBncm91cENsYXNzICsgXCIteFwiO1xyXG4gICAgICAgIHZhciBncm91cHMgPSBjb250YWluZXIuc2VsZWN0QWxsKFwiZy5cIiArIGdyb3VwQ2xhc3MgKyBcIi5cIiArIGdyb3VwWENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShwYXJlbnRHcm91cC5jaGlsZHJlbkxpc3QpO1xyXG5cclxuICAgICAgICB2YXIgdmFsdWVzQmVmb3JlQ291bnQgPSAwO1xyXG4gICAgICAgIHZhciBnYXBzQmVmb3JlU2l6ZSA9IDA7XHJcblxyXG4gICAgICAgIHZhciBncm91cHNFbnRlckcgPSBncm91cHMuZW50ZXIoKS5hcHBlbmQoXCJnXCIpO1xyXG4gICAgICAgIGdyb3Vwc0VudGVyR1xyXG4gICAgICAgICAgICAuY2xhc3NlZChncm91cENsYXNzLCB0cnVlKVxyXG4gICAgICAgICAgICAuY2xhc3NlZChncm91cFhDbGFzcywgdHJ1ZSlcclxuICAgICAgICAgICAgLmFwcGVuZChcInJlY3RcIikuY2xhc3NlZChcImdyb3VwLXJlY3RcIiwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIHZhciB0aXRsZUdyb3VwRW50ZXIgPSBncm91cHNFbnRlckcuYXBwZW5kU2VsZWN0b3IoXCJnLnRpdGxlXCIpO1xyXG4gICAgICAgIHRpdGxlR3JvdXBFbnRlci5hcHBlbmQoXCJyZWN0XCIpO1xyXG4gICAgICAgIHRpdGxlR3JvdXBFbnRlci5hcHBlbmQoXCJ0ZXh0XCIpO1xyXG5cclxuICAgICAgICB2YXIgZ2FwU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcFNpemUocGFyZW50R3JvdXAubGV2ZWwpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gZ2FwU2l6ZSAvIDQ7XHJcbiAgICAgICAgdmFyIHRpdGxlUmVjdEhlaWdodCA9IEhlYXRtYXAuZ3JvdXBUaXRsZVJlY3RIZWlnaHQ7XHJcblxyXG4gICAgICAgIHZhciBkZXB0aCA9IHNlbGYuY29uZmlnLnguZ3JvdXBzLmtleXMubGVuZ3RoIC0gcGFyZW50R3JvdXAubGV2ZWw7XHJcblxyXG4gICAgICAgIHZhciBvdmVybGFwID0ge1xyXG4gICAgICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgICAgIGJvdHRvbTogMFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmICghYXZhaWxhYmxlSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIG92ZXJsYXAuYm90dG9tID0gcGxvdC54Lm92ZXJsYXAuYm90dG9tO1xyXG4gICAgICAgICAgICBvdmVybGFwLnRvcCA9IHBsb3QueC5vdmVybGFwLnRvcDtcclxuICAgICAgICAgICAgYXZhaWxhYmxlSGVpZ2h0ID0gcGxvdC5oZWlnaHQgKyBnYXBTaXplICsgb3ZlcmxhcC50b3AgKyBvdmVybGFwLmJvdHRvbTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb3ZlcmxhcC50b3AgPSAtdGl0bGVSZWN0SGVpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygncGFyZW50R3JvdXAnLHBhcmVudEdyb3VwLCAnZ2FwU2l6ZScsIGdhcFNpemUsIHBsb3QueC5vdmVybGFwKTtcclxuXHJcbiAgICAgICAgZ3JvdXBzXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHJhbnNsYXRlID0gXCJ0cmFuc2xhdGUoXCIgKyAoKHBsb3QuY2VsbFdpZHRoICogdmFsdWVzQmVmb3JlQ291bnQpICsgaSAqIGdhcFNpemUgKyBnYXBzQmVmb3JlU2l6ZSArIHBhZGRpbmcpICsgXCIsIFwiICsgKHBhZGRpbmcgLSBvdmVybGFwLnRvcCkgKyBcIilcIjtcclxuICAgICAgICAgICAgICAgIGdhcHNCZWZvcmVTaXplICs9IChkLmdhcHNJbnNpZGVTaXplIHx8IDApO1xyXG4gICAgICAgICAgICAgICAgdmFsdWVzQmVmb3JlQ291bnQgKz0gZC5hbGxWYWx1ZXNDb3VudCB8fCAwO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYW5zbGF0ZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIGdyb3VwSGVpZ2h0ID0gYXZhaWxhYmxlSGVpZ2h0IC0gcGFkZGluZyAqIDI7XHJcblxyXG4gICAgICAgIHZhciB0aXRsZUdyb3VwcyA9IGdyb3Vwcy5zZWxlY3RBbGwoXCJnLnRpdGxlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInRyYW5zbGF0ZSgwLCBcIiArICgwKSArIFwiKVwiKTtcclxuXHJcblxyXG4gICAgICAgIHZhciB0aWxlUmVjdHMgPSB0aXRsZUdyb3Vwcy5zZWxlY3RBbGwoXCJyZWN0XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIHRpdGxlUmVjdEhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBkPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChkLmdhcHNJbnNpZGVTaXplIHx8IDApICsgcGxvdC5jZWxsV2lkdGggKiBkLmFsbFZhbHVlc0NvdW50ICsgcGFkZGluZyAqIDJcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAwKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcImZpbGxcIiwgXCJsaWdodGdyZXlcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0R3JvdXBNb3VzZUNhbGxiYWNrcyhwYXJlbnRHcm91cCwgdGlsZVJlY3RzKTtcclxuXHJcblxyXG4gICAgICAgIGdyb3Vwcy5zZWxlY3RBbGwoXCJyZWN0Lmdyb3VwLXJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBkPT4gXCJncm91cC1yZWN0IGdyb3VwLXJlY3QtXCIgKyBkLmluZGV4KVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBncm91cEhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBkPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChkLmdhcHNJbnNpZGVTaXplIHx8IDApICsgcGxvdC5jZWxsV2lkdGggKiBkLmFsbFZhbHVlc0NvdW50ICsgcGFkZGluZyAqIDJcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgXCJ3aGl0ZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImZpbGwtb3BhY2l0eVwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCAwLjUpXHJcbiAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlXCIsIFwiYmxhY2tcIik7XHJcblxyXG4gICAgICAgIGdyb3Vwcy5lYWNoKGZ1bmN0aW9uIChncm91cCkge1xyXG4gICAgICAgICAgICBzZWxmLmRyYXdHcm91cHNYLmNhbGwoc2VsZiwgZ3JvdXAsIGQzLnNlbGVjdCh0aGlzKSwgZ3JvdXBIZWlnaHQgLSB0aXRsZVJlY3RIZWlnaHQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBncm91cHMuZXhpdCgpLnJlbW92ZSgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBzZXRHcm91cE1vdXNlQ2FsbGJhY2tzKHBhcmVudEdyb3VwLCB0aWxlUmVjdHMpIHtcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG1vdXNlb3ZlckNhbGxiYWNrcyA9IFtdO1xyXG4gICAgICAgIG1vdXNlb3ZlckNhbGxiYWNrcy5wdXNoKGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKCdoaWdobGlnaHRlZCcsIHRydWUpO1xyXG4gICAgICAgICAgICBkMy5zZWxlY3QodGhpcy5wYXJlbnROb2RlLnBhcmVudE5vZGUpLnNlbGVjdEFsbChcInJlY3QuZ3JvdXAtcmVjdC1cIiArIGQuaW5kZXgpLmNsYXNzZWQoJ2hpZ2hsaWdodGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciBtb3VzZW91dENhbGxiYWNrcyA9IFtdO1xyXG4gICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoJ2hpZ2hsaWdodGVkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICBkMy5zZWxlY3QodGhpcy5wYXJlbnROb2RlLnBhcmVudE5vZGUpLnNlbGVjdEFsbChcInJlY3QuZ3JvdXAtcmVjdC1cIiArIGQuaW5kZXgpLmNsYXNzZWQoJ2hpZ2hsaWdodGVkJywgZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChwbG90LnRvb2x0aXApIHtcclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3ZlckNhbGxiYWNrcy5wdXNoKGQ9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IHBhcmVudEdyb3VwLmxhYmVsICsgXCI6IFwiICsgZC5ncm91cGluZ1ZhbHVlO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zaG93VG9vbHRpcChodG1sKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBtb3VzZW91dENhbGxiYWNrcy5wdXNoKGQ9PiB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmhpZGVUb29sdGlwKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRpbGVSZWN0cy5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIG1vdXNlb3ZlckNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChzZWxmLCBkKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aWxlUmVjdHMub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKHNlbGYsIGQpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUNlbGxzKCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGNlbGxDb250YWluZXJDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJjZWxsc1wiKTtcclxuICAgICAgICB2YXIgZ2FwU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcFNpemUoMCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmdYID0gcGxvdC54Lmdyb3Vwcy5jaGlsZHJlbkxpc3QubGVuZ3RoID8gZ2FwU2l6ZSAvIDIgOiAwO1xyXG4gICAgICAgIHZhciBwYWRkaW5nWSA9IHBsb3QueS5ncm91cHMuY2hpbGRyZW5MaXN0Lmxlbmd0aCA/IGdhcFNpemUgLyAyIDogMDtcclxuICAgICAgICB2YXIgY2VsbENvbnRhaW5lciA9IHNlbGYuc3ZnRy5zZWxlY3RPckFwcGVuZChcImcuXCIgKyBjZWxsQ29udGFpbmVyQ2xhc3MpO1xyXG4gICAgICAgIGNlbGxDb250YWluZXIuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIHBhZGRpbmdYICsgXCIsIFwiICsgcGFkZGluZ1kgKyBcIilcIik7XHJcblxyXG4gICAgICAgIHZhciBjZWxsQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwiY2VsbFwiKTtcclxuICAgICAgICB2YXIgY2VsbFNoYXBlID0gcGxvdC56LnNoYXBlLnR5cGU7XHJcblxyXG4gICAgICAgIHZhciBjZWxscyA9IGNlbGxDb250YWluZXIuc2VsZWN0QWxsKFwiZy5cIiArIGNlbGxDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEoc2VsZi5wbG90LmNlbGxzKTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxFbnRlckcgPSBjZWxscy5lbnRlcigpLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmNsYXNzZWQoY2VsbENsYXNzLCB0cnVlKTtcclxuICAgICAgICBjZWxscy5hdHRyKFwidHJhbnNmb3JtXCIsIGM9PiBcInRyYW5zbGF0ZShcIiArICgocGxvdC5jZWxsV2lkdGggKiBjLmNvbCArIHBsb3QuY2VsbFdpZHRoIC8gMikgKyBjLmNvbFZhci5ncm91cC5nYXBzU2l6ZSkgKyBcIixcIiArICgocGxvdC5jZWxsSGVpZ2h0ICogYy5yb3cgKyBwbG90LmNlbGxIZWlnaHQgLyAyKSArIGMucm93VmFyLmdyb3VwLmdhcHNTaXplKSArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgdmFyIHNoYXBlcyA9IGNlbGxzLnNlbGVjdE9yQXBwZW5kKGNlbGxTaGFwZSArIFwiLmNlbGwtc2hhcGUtXCIgKyBjZWxsU2hhcGUpO1xyXG5cclxuICAgICAgICBzaGFwZXNcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBwbG90Lnouc2hhcGUud2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIHBsb3Quei5zaGFwZS5oZWlnaHQpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAtcGxvdC5jZWxsV2lkdGggLyAyKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgLXBsb3QuY2VsbEhlaWdodCAvIDIpO1xyXG5cclxuICAgICAgICBzaGFwZXMuc3R5bGUoXCJmaWxsXCIsIGM9PiBjLnZhbHVlID09PSB1bmRlZmluZWQgPyBzZWxmLmNvbmZpZy5jb2xvci5ub0RhdGFDb2xvciA6IHBsb3Quei5jb2xvci5zY2FsZShjLnZhbHVlKSk7XHJcbiAgICAgICAgc2hhcGVzLmF0dHIoXCJmaWxsLW9wYWNpdHlcIiwgZD0+IGQudmFsdWUgPT09IHVuZGVmaW5lZCA/IDAgOiAxKTtcclxuXHJcbiAgICAgICAgdmFyIG1vdXNlb3ZlckNhbGxiYWNrcyA9IFtdO1xyXG4gICAgICAgIHZhciBtb3VzZW91dENhbGxiYWNrcyA9IFtdO1xyXG5cclxuICAgICAgICBpZiAocGxvdC50b29sdGlwKSB7XHJcblxyXG4gICAgICAgICAgICBtb3VzZW92ZXJDYWxsYmFja3MucHVzaChjPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGh0bWwgPSBjLnZhbHVlID09PSB1bmRlZmluZWQgPyBzZWxmLmNvbmZpZy50b29sdGlwLm5vRGF0YVRleHQgOiBzZWxmLmZvcm1hdFZhbHVlWihjLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2hvd1Rvb2x0aXAoaHRtbCk7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLnB1c2goYz0+IHtcclxuICAgICAgICAgICAgICAgIHNlbGYuaGlkZVRvb2x0aXAoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2VsZi5jb25maWcuaGlnaGxpZ2h0TGFiZWxzKSB7XHJcbiAgICAgICAgICAgIHZhciBoaWdobGlnaHRDbGFzcyA9IHNlbGYuY29uZmlnLmNzc0NsYXNzUHJlZml4ICsgXCJoaWdobGlnaHRcIjtcclxuICAgICAgICAgICAgdmFyIHhMYWJlbENsYXNzID0gYz0+cGxvdC5sYWJlbENsYXNzICsgXCIteC1cIiArIGMuY29sO1xyXG4gICAgICAgICAgICB2YXIgeUxhYmVsQ2xhc3MgPSBjPT5wbG90LmxhYmVsQ2xhc3MgKyBcIi15LVwiICsgYy5yb3c7XHJcblxyXG5cclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goYz0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHhMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgeUxhYmVsQ2xhc3MoYykpLmNsYXNzZWQoaGlnaGxpZ2h0Q2xhc3MsIHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MucHVzaChjPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB4TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB5TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBjZWxscy5vbihcIm1vdXNlb3ZlclwiLCBjID0+IHtcclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2s9PmNhbGxiYWNrKGMpKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCBjID0+IHtcclxuICAgICAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2s9PmNhbGxiYWNrKGMpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNlbGxzLm9uKFwiY2xpY2tcIiwgYz0+IHtcclxuICAgICAgICAgICAgc2VsZi50cmlnZ2VyKFwiY2VsbC1zZWxlY3RlZFwiLCBjKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIGNlbGxzLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3JtYXRWYWx1ZVgodmFsdWUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLnguZm9ybWF0dGVyKSByZXR1cm4gdmFsdWU7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy54LmZvcm1hdHRlci5jYWxsKHRoaXMuY29uZmlnLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9ybWF0VmFsdWVZKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy55LmZvcm1hdHRlcikgcmV0dXJuIHZhbHVlO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcueS5mb3JtYXR0ZXIuY2FsbCh0aGlzLmNvbmZpZywgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcm1hdFZhbHVlWih2YWx1ZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcuei5mb3JtYXR0ZXIpIHJldHVybiB2YWx1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnouZm9ybWF0dGVyLmNhbGwodGhpcy5jb25maWcsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3JtYXRMZWdlbmRWYWx1ZSh2YWx1ZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcubGVnZW5kLmZvcm1hdHRlcikgcmV0dXJuIHZhbHVlO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcubGVnZW5kLmZvcm1hdHRlci5jYWxsKHRoaXMuY29uZmlnLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTGVnZW5kKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgbGVnZW5kWCA9IHRoaXMucGxvdC53aWR0aCArIDEwO1xyXG4gICAgICAgIHZhciBnYXBTaXplID0gSGVhdG1hcC5jb21wdXRlR2FwU2l6ZSgwKTtcclxuICAgICAgICBpZiAodGhpcy5wbG90Lmdyb3VwQnlZKSB7XHJcbiAgICAgICAgICAgIGxlZ2VuZFggKz0gZ2FwU2l6ZSAvIDIgKyBwbG90Lnkub3ZlcmxhcC5yaWdodDtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucGxvdC5ncm91cEJ5WCkge1xyXG4gICAgICAgICAgICBsZWdlbmRYICs9IGdhcFNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsZWdlbmRZID0gMDtcclxuICAgICAgICBpZiAodGhpcy5wbG90Lmdyb3VwQnlYIHx8IHRoaXMucGxvdC5ncm91cEJ5WSkge1xyXG4gICAgICAgICAgICBsZWdlbmRZICs9IGdhcFNpemUgLyAyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGJhcldpZHRoID0gMTA7XHJcbiAgICAgICAgdmFyIGJhckhlaWdodCA9IHRoaXMucGxvdC5oZWlnaHQgLSAyO1xyXG4gICAgICAgIHZhciBzY2FsZSA9IHBsb3Quei5jb2xvci5zY2FsZTtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmQgPSBuZXcgTGVnZW5kKHRoaXMuc3ZnLCB0aGlzLnN2Z0csIHNjYWxlLCBsZWdlbmRYLCBsZWdlbmRZLCB2ID0+IHNlbGYuZm9ybWF0TGVnZW5kVmFsdWUodikpLnNldFJvdGF0ZUxhYmVscyhzZWxmLmNvbmZpZy5sZWdlbmQucm90YXRlTGFiZWxzKS5saW5lYXJHcmFkaWVudEJhcihiYXJXaWR0aCwgYmFySGVpZ2h0KTtcclxuICAgIH1cclxuXHJcblxyXG59XHJcbiIsImltcG9ydCB7Q2hhcnRXaXRoQ29sb3JHcm91cHMsIENoYXJ0V2l0aENvbG9yR3JvdXBzQ29uZmlnfSBmcm9tIFwiLi9jaGFydC13aXRoLWNvbG9yLWdyb3Vwc1wiO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5cclxuZXhwb3J0IGNsYXNzIEhpc3RvZ3JhbUNvbmZpZyBleHRlbmRzIENoYXJ0V2l0aENvbG9yR3JvdXBzQ29uZmlne1xyXG5cclxuICAgIHN2Z0NsYXNzPSB0aGlzLmNzc0NsYXNzUHJlZml4KydoaXN0b2dyYW0nO1xyXG4gICAgc2hvd0xlZ2VuZD10cnVlO1xyXG4gICAgc2hvd1Rvb2x0aXAgPXRydWU7XHJcbiAgICB4PXsvLyBYIGF4aXMgY29uZmlnXHJcbiAgICAgICAgbGFiZWw6ICcnLCAvLyBheGlzIGxhYmVsXHJcbiAgICAgICAga2V5OiAwLFxyXG4gICAgICAgIHZhbHVlOiAoZCwga2V5KSA9PiBVdGlscy5pc051bWJlcihkKSA/IGQgOiBwYXJzZUZsb2F0KGRba2V5XSksIC8vIHggdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIixcclxuICAgICAgICB0aWNrczogdW5kZWZpbmVkLFxyXG4gICAgfTtcclxuICAgIHk9ey8vIFkgYXhpcyBjb25maWdcclxuICAgICAgICBsYWJlbDogJycsIC8vIGF4aXMgbGFiZWwsXHJcbiAgICAgICAgb3JpZW50OiBcImxlZnRcIixcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIlxyXG4gICAgfTtcclxuICAgIGZyZXF1ZW5jeT10cnVlO1xyXG4gICAgZ3JvdXBzPXtcclxuICAgICAgICBrZXk6IDFcclxuICAgIH07XHJcbiAgICB0cmFuc2l0aW9uPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgaWYoY3VzdG9tKXtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBIaXN0b2dyYW0gZXh0ZW5kcyBDaGFydFdpdGhDb2xvckdyb3Vwc3tcclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIG5ldyBIaXN0b2dyYW1Db25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZyl7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgSGlzdG9ncmFtQ29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCl7XHJcbiAgICAgICAgc3VwZXIuaW5pdFBsb3QoKTtcclxuICAgICAgICB2YXIgc2VsZj10aGlzO1xyXG5cclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueD17fTtcclxuICAgICAgICB0aGlzLnBsb3QueT17fTtcclxuICAgICAgICB0aGlzLnBsb3QuYmFyPXtcclxuICAgICAgICAgICAgY29sb3I6IG51bGwvL2NvbG9yIHNjYWxlIG1hcHBpbmcgZnVuY3Rpb25cclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuY29tcHV0ZVBsb3RTaXplKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zZXR1cFgoKTtcclxuICAgICAgICB0aGlzLnNldHVwSGlzdG9ncmFtKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cEdyb3VwU3RhY2tzKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFkoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cFgoKXtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHggPSBwbG90Lng7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZy54O1xyXG5cclxuICAgICAgICAvKiAqXHJcbiAgICAgICAgICogdmFsdWUgYWNjZXNzb3IgLSByZXR1cm5zIHRoZSB2YWx1ZSB0byBlbmNvZGUgZm9yIGEgZ2l2ZW4gZGF0YSBvYmplY3QuXHJcbiAgICAgICAgICogc2NhbGUgLSBtYXBzIHZhbHVlIHRvIGEgdmlzdWFsIGRpc3BsYXkgZW5jb2RpbmcsIHN1Y2ggYXMgYSBwaXhlbCBwb3NpdGlvbi5cclxuICAgICAgICAgKiBtYXAgZnVuY3Rpb24gLSBtYXBzIGZyb20gZGF0YSB2YWx1ZSB0byBkaXNwbGF5IHZhbHVlXHJcbiAgICAgICAgICogYXhpcyAtIHNldHMgdXAgYXhpc1xyXG4gICAgICAgICAqKi9cclxuICAgICAgICB4LnZhbHVlID0gZCA9PiBjb25mLnZhbHVlKGQsIGNvbmYua2V5KTtcclxuICAgICAgICB4LnNjYWxlID0gZDMuc2NhbGVbY29uZi5zY2FsZV0oKS5yYW5nZShbMCwgcGxvdC53aWR0aF0pO1xyXG4gICAgICAgIHgubWFwID0gZCA9PiB4LnNjYWxlKHgudmFsdWUoZCkpO1xyXG5cclxuICAgICAgICB4LmF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHguc2NhbGUpLm9yaWVudChjb25mLm9yaWVudCk7XHJcbiAgICAgICAgaWYoY29uZi50aWNrcyl7XHJcbiAgICAgICAgICAgIHguYXhpcy50aWNrcyhjb25mLnRpY2tzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLnBsb3QuZ3JvdXBlZERhdGE7XHJcbiAgICAgICAgcGxvdC54LnNjYWxlLmRvbWFpbihbZDMubWluKGRhdGEsIHM9PmQzLm1pbihzLnZhbHVlcywgcGxvdC54LnZhbHVlKSksIGQzLm1heChkYXRhLCBzPT5kMy5tYXgocy52YWx1ZXMsIHBsb3QueC52YWx1ZSkpXSk7XHJcbiAgICAgICAgXHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwWSAoKXtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHkgPSBwbG90Lnk7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZy55O1xyXG4gICAgICAgIHkuc2NhbGUgPSBkMy5zY2FsZVtjb25mLnNjYWxlXSgpLnJhbmdlKFtwbG90LmhlaWdodCwgMF0pO1xyXG5cclxuICAgICAgICB5LmF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHkuc2NhbGUpLm9yaWVudChjb25mLm9yaWVudCk7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLnBsb3QuZGF0YTtcclxuICAgICAgICB2YXIgeVN0YWNrTWF4ID0gZDMubWF4KHBsb3Quc3RhY2tlZEhpc3RvZ3JhbXMsIGxheWVyID0+IGQzLm1heChsYXllci5oaXN0b2dyYW1CaW5zLCBkID0+IGQueTAgKyBkLnkpKTtcclxuICAgICAgICBwbG90Lnkuc2NhbGUuZG9tYWluKFswLCB5U3RhY2tNYXhdKTtcclxuXHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBzZXR1cEhpc3RvZ3JhbSgpIHtcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeCA9IHBsb3QueDtcclxuICAgICAgICB2YXIgeSA9IHBsb3QueTtcclxuICAgICAgICB2YXIgdGlja3MgPSB0aGlzLmNvbmZpZy54LnRpY2tzID8geC5zY2FsZS50aWNrcyh0aGlzLmNvbmZpZy54LnRpY2tzKSA6IHguc2NhbGUudGlja3MoKTtcclxuXHJcbiAgICAgICAgcGxvdC5oaXN0b2dyYW0gPSBkMy5sYXlvdXQuaGlzdG9ncmFtKCkuZnJlcXVlbmN5KHRoaXMuY29uZmlnLmZyZXF1ZW5jeSlcclxuICAgICAgICAgICAgLnZhbHVlKHgudmFsdWUpXHJcbiAgICAgICAgICAgIC5iaW5zKHRpY2tzKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cEdyb3VwU3RhY2tzKCkge1xyXG4gICAgICAgIHZhciBzZWxmPXRoaXM7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5wbG90Lmdyb3VwZWREYXRhKTtcclxuICAgICAgICB0aGlzLnBsb3Quc3RhY2sgPSBkMy5sYXlvdXQuc3RhY2soKS52YWx1ZXMoZD0+ZC5oaXN0b2dyYW1CaW5zKTtcclxuICAgICAgICB0aGlzLnBsb3QuZ3JvdXBlZERhdGEuZm9yRWFjaChkPT57XHJcbiAgICAgICAgICAgIGQuaGlzdG9ncmFtQmlucyA9IHRoaXMucGxvdC5oaXN0b2dyYW0uZnJlcXVlbmN5KHRoaXMuY29uZmlnLmZyZXF1ZW5jeSB8fCB0aGlzLnBsb3QuZ3JvdXBpbmdFbmFibGVkKShkLnZhbHVlcyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGQuaGlzdG9ncmFtQmlucyk7XHJcbiAgICAgICAgICAgIGlmKCF0aGlzLmNvbmZpZy5mcmVxdWVuY3kgJiYgdGhpcy5wbG90Lmdyb3VwaW5nRW5hYmxlZCl7XHJcbiAgICAgICAgICAgICAgICBkLmhpc3RvZ3JhbUJpbnMuZm9yRWFjaChiID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBiLmR5ID0gYi5keS90aGlzLnBsb3QuZGF0YUxlbmd0aFxyXG4gICAgICAgICAgICAgICAgICAgIGIueSA9IGIueS90aGlzLnBsb3QuZGF0YUxlbmd0aFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnBsb3Quc3RhY2tlZEhpc3RvZ3JhbXMgPSB0aGlzLnBsb3Quc3RhY2sodGhpcy5wbG90Lmdyb3VwZWREYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3QXhpc1goKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGF4aXNDb25mID0gdGhpcy5jb25maWcueDtcclxuICAgICAgICB2YXIgYXhpcyA9IHNlbGYuc3ZnRy5zZWxlY3RPckFwcGVuZChcImcuXCIrc2VsZi5wcmVmaXhDbGFzcygnYXhpcy14JykrXCIuXCIrc2VsZi5wcmVmaXhDbGFzcygnYXhpcycpKyhzZWxmLmNvbmZpZy5ndWlkZXMgPyAnJyA6ICcuJytzZWxmLnByZWZpeENsYXNzKCduby1ndWlkZXMnKSkpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyBwbG90LmhlaWdodCArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgdmFyIGF4aXNUID0gYXhpcztcclxuICAgICAgICBpZiAoc2VsZi5jb25maWcudHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICBheGlzVCA9IGF4aXMudHJhbnNpdGlvbigpLmVhc2UoXCJzaW4taW4tb3V0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXhpc1QuY2FsbChwbG90LnguYXhpcyk7XHJcblxyXG4gICAgICAgIGF4aXMuc2VsZWN0T3JBcHBlbmQoXCJ0ZXh0LlwiK3NlbGYucHJlZml4Q2xhc3MoJ2xhYmVsJykpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyAocGxvdC53aWR0aC8yKSArXCIsXCIrIChwbG90Lm1hcmdpbi5ib3R0b20pICtcIilcIikgIC8vIHRleHQgaXMgZHJhd24gb2ZmIHRoZSBzY3JlZW4gdG9wIGxlZnQsIG1vdmUgZG93biBhbmQgb3V0IGFuZCByb3RhdGVcclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCBcIi0xZW1cIilcclxuICAgICAgICAgICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoYXhpc0NvbmYubGFiZWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICBkcmF3QXhpc1koKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGF4aXNDb25mID0gdGhpcy5jb25maWcueTtcclxuICAgICAgICB2YXIgYXhpcyA9IHNlbGYuc3ZnRy5zZWxlY3RPckFwcGVuZChcImcuXCIrc2VsZi5wcmVmaXhDbGFzcygnYXhpcy15JykrXCIuXCIrc2VsZi5wcmVmaXhDbGFzcygnYXhpcycpKyhzZWxmLmNvbmZpZy5ndWlkZXMgPyAnJyA6ICcuJytzZWxmLnByZWZpeENsYXNzKCduby1ndWlkZXMnKSkpO1xyXG5cclxuICAgICAgICB2YXIgYXhpc1QgPSBheGlzO1xyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy50cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGF4aXNUID0gYXhpcy50cmFuc2l0aW9uKCkuZWFzZShcInNpbi1pbi1vdXRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBheGlzVC5jYWxsKHBsb3QueS5heGlzKTtcclxuXHJcbiAgICAgICAgYXhpcy5zZWxlY3RPckFwcGVuZChcInRleHQuXCIrc2VsZi5wcmVmaXhDbGFzcygnbGFiZWwnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrIC1wbG90Lm1hcmdpbi5sZWZ0ICtcIixcIisocGxvdC5oZWlnaHQvMikrXCIpcm90YXRlKC05MClcIikgIC8vIHRleHQgaXMgZHJhd24gb2ZmIHRoZSBzY3JlZW4gdG9wIGxlZnQsIG1vdmUgZG93biBhbmQgb3V0IGFuZCByb3RhdGVcclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCBcIjFlbVwiKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAudGV4dChheGlzQ29uZi5sYWJlbCk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBkcmF3SGlzdG9ncmFtKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgbGF5ZXJDbGFzcyA9IHRoaXMucHJlZml4Q2xhc3MoXCJsYXllclwiKTtcclxuXHJcbiAgICAgICAgdmFyIGJhckNsYXNzID0gdGhpcy5wcmVmaXhDbGFzcyhcImJhclwiKTtcclxuICAgICAgICB2YXIgbGF5ZXIgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwiLlwiK2xheWVyQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBsb3Quc3RhY2tlZEhpc3RvZ3JhbXMpO1xyXG5cclxuICAgICAgICBsYXllci5lbnRlcigpLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBsYXllckNsYXNzKTtcclxuXHJcbiAgICAgICAgdmFyIGJhciA9IGxheWVyLnNlbGVjdEFsbChcIi5cIitiYXJDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEoZCA9PiBkLmhpc3RvZ3JhbUJpbnMpO1xyXG5cclxuICAgICAgICBiYXIuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgYmFyQ2xhc3MpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoXCJyZWN0XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAxKTtcclxuXHJcblxyXG4gICAgICAgIHZhciBiYXJSZWN0ID0gYmFyLnNlbGVjdChcInJlY3RcIik7XHJcblxyXG4gICAgICAgIHZhciBiYXJSZWN0VCA9IGJhclJlY3Q7XHJcbiAgICAgICAgdmFyIGJhclQgPSBiYXI7XHJcbiAgICAgICAgdmFyIGxheWVyVCA9IGxheWVyO1xyXG4gICAgICAgIGlmICh0aGlzLnRyYW5zaXRpb25FbmFibGVkKCkpIHtcclxuICAgICAgICAgICAgYmFyUmVjdFQgPSBiYXJSZWN0LnRyYW5zaXRpb24oKTtcclxuICAgICAgICAgICAgYmFyVCA9IGJhci50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgICAgIGxheWVyVD0gbGF5ZXIudHJhbnNpdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYmFyVC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgcGxvdC54LnNjYWxlKGQueCkgKyBcIixcIiArIChwbG90Lnkuc2NhbGUoZC55MCArZC55KSkgKyBcIilcIjsgfSk7XHJcblxyXG4gICAgICAgIHZhciBkeCA9IHBsb3Quc3RhY2tlZEhpc3RvZ3JhbXMubGVuZ3RoID8gKHBsb3Quc3RhY2tlZEhpc3RvZ3JhbXNbMF0uaGlzdG9ncmFtQmlucy5sZW5ndGggPyAgcGxvdC54LnNjYWxlKHBsb3Quc3RhY2tlZEhpc3RvZ3JhbXNbMF0uaGlzdG9ncmFtQmluc1swXS5keCkgOiAwKSA6IDA7XHJcbiAgICAgICAgYmFyUmVjdFRcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCAgZHggLSBwbG90Lnguc2NhbGUoMCktIDEpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGQgPT4gICBwbG90LmhlaWdodCAtIHBsb3QueS5zY2FsZShkLnkpKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5wbG90LmNvbG9yKXtcclxuICAgICAgICAgICAgbGF5ZXJUXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgdGhpcy5wbG90LnNlcmllc0NvbG9yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwbG90LnRvb2x0aXApIHtcclxuICAgICAgICAgICAgYmFyLm9uKFwibW91c2VvdmVyXCIsIGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zaG93VG9vbHRpcChkLnkpO1xyXG4gICAgICAgICAgICB9KS5vbihcIm1vdXNlb3V0XCIsIGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5oaWRlVG9vbHRpcCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGF5ZXIuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgICAgIGJhci5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKG5ld0RhdGEpe1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuICAgICAgICB0aGlzLmRyYXdBeGlzWCgpO1xyXG4gICAgICAgIHRoaXMuZHJhd0F4aXNZKCk7XHJcblxyXG4gICAgICAgIHRoaXMuZHJhd0hpc3RvZ3JhbSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxufVxyXG4iLCJpbXBvcnQge0QzRXh0ZW5zaW9uc30gZnJvbSAnLi9kMy1leHRlbnNpb25zJ1xyXG5EM0V4dGVuc2lvbnMuZXh0ZW5kKCk7XHJcblxyXG5leHBvcnQge1NjYXR0ZXJQbG90LCBTY2F0dGVyUGxvdENvbmZpZ30gZnJvbSBcIi4vc2NhdHRlcnBsb3RcIjtcclxuZXhwb3J0IHtTY2F0dGVyUGxvdE1hdHJpeCwgU2NhdHRlclBsb3RNYXRyaXhDb25maWd9IGZyb20gXCIuL3NjYXR0ZXJwbG90LW1hdHJpeFwiO1xyXG5leHBvcnQge0NvcnJlbGF0aW9uTWF0cml4LCBDb3JyZWxhdGlvbk1hdHJpeENvbmZpZ30gZnJvbSAnLi9jb3JyZWxhdGlvbi1tYXRyaXgnXHJcbmV4cG9ydCB7UmVncmVzc2lvbiwgUmVncmVzc2lvbkNvbmZpZ30gZnJvbSAnLi9yZWdyZXNzaW9uJ1xyXG5leHBvcnQge0hlYXRtYXAsIEhlYXRtYXBDb25maWd9IGZyb20gJy4vaGVhdG1hcCdcclxuZXhwb3J0IHtIZWF0bWFwVGltZVNlcmllcywgSGVhdG1hcFRpbWVTZXJpZXNDb25maWd9IGZyb20gJy4vaGVhdG1hcC10aW1lc2VyaWVzJ1xyXG5leHBvcnQge0hpc3RvZ3JhbSwgSGlzdG9ncmFtQ29uZmlnfSBmcm9tICcuL2hpc3RvZ3JhbSdcclxuZXhwb3J0IHtCYXJDaGFydCwgQmFyQ2hhcnRDb25maWd9IGZyb20gJy4vYmFyLWNoYXJ0J1xyXG5leHBvcnQge0JveFBsb3RCYXNlLCBCb3hQbG90QmFzZUNvbmZpZ30gZnJvbSAnLi9ib3gtcGxvdC1iYXNlJ1xyXG5leHBvcnQge0JveFBsb3QsIEJveFBsb3RDb25maWd9IGZyb20gJy4vYm94LXBsb3QnXHJcbmV4cG9ydCB7U3RhdGlzdGljc1V0aWxzfSBmcm9tICcuL3N0YXRpc3RpY3MtdXRpbHMnXHJcbmV4cG9ydCB7TGVnZW5kfSBmcm9tICcuL2xlZ2VuZCdcclxuXHJcblxyXG5cclxuXHJcblxyXG4iLCJpbXBvcnQge1V0aWxzfSBmcm9tIFwiLi91dGlsc1wiO1xyXG5pbXBvcnQge2NvbG9yLCBzaXplLCBzeW1ib2x9IGZyb20gXCIuLi9ib3dlcl9jb21wb25lbnRzL2QzLWxlZ2VuZC9uby1leHRlbmRcIjtcclxuXHJcbi8qdmFyIGQzID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9kMycpO1xyXG4qL1xyXG4vLyB2YXIgbGVnZW5kID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9kMy1sZWdlbmQvbm8tZXh0ZW5kJyk7XHJcbi8vXHJcbi8vIG1vZHVsZS5leHBvcnRzLmxlZ2VuZCA9IGxlZ2VuZDtcclxuXHJcbmV4cG9ydCBjbGFzcyBMZWdlbmQge1xyXG5cclxuICAgIGNzc0NsYXNzUHJlZml4PVwib2RjLVwiO1xyXG4gICAgbGVnZW5kQ2xhc3M9dGhpcy5jc3NDbGFzc1ByZWZpeCtcImxlZ2VuZFwiO1xyXG4gICAgY29udGFpbmVyO1xyXG4gICAgc2NhbGU7XHJcbiAgICBjb2xvcj0gY29sb3I7XHJcbiAgICBzaXplID0gc2l6ZTtcclxuICAgIHN5bWJvbD0gc3ltYm9sO1xyXG4gICAgZ3VpZDtcclxuXHJcbiAgICBsYWJlbEZvcm1hdCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzdmcsIGxlZ2VuZFBhcmVudCwgc2NhbGUsIGxlZ2VuZFgsIGxlZ2VuZFksIGxhYmVsRm9ybWF0KXtcclxuICAgICAgICB0aGlzLnNjYWxlPXNjYWxlO1xyXG4gICAgICAgIHRoaXMuc3ZnID0gc3ZnO1xyXG4gICAgICAgIHRoaXMuZ3VpZCA9IFV0aWxzLmd1aWQoKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9ICBVdGlscy5zZWxlY3RPckFwcGVuZChsZWdlbmRQYXJlbnQsIFwiZy5cIit0aGlzLmxlZ2VuZENsYXNzLCBcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrbGVnZW5kWCtcIixcIitsZWdlbmRZK1wiKVwiKVxyXG4gICAgICAgICAgICAuY2xhc3NlZCh0aGlzLmxlZ2VuZENsYXNzLCB0cnVlKTtcclxuXHJcbiAgICAgICAgdGhpcy5sYWJlbEZvcm1hdCA9IGxhYmVsRm9ybWF0O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgbGluZWFyR3JhZGllbnRCYXIoYmFyV2lkdGgsIGJhckhlaWdodCwgdGl0bGUpe1xyXG4gICAgICAgIHZhciBncmFkaWVudElkID0gdGhpcy5jc3NDbGFzc1ByZWZpeCtcImxpbmVhci1ncmFkaWVudFwiK1wiLVwiK3RoaXMuZ3VpZDtcclxuICAgICAgICB2YXIgc2NhbGU9IHRoaXMuc2NhbGU7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmxpbmVhckdyYWRpZW50ID0gVXRpbHMubGluZWFyR3JhZGllbnQodGhpcy5zdmcsIGdyYWRpZW50SWQsIHRoaXMuc2NhbGUucmFuZ2UoKSwgMCwgMTAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kKFwicmVjdFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGJhcldpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBiYXJIZWlnaHQpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgMClcclxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcInVybCgjXCIrZ3JhZGllbnRJZCtcIilcIik7XHJcblxyXG5cclxuICAgICAgICB2YXIgdGlja3MgPSB0aGlzLmNvbnRhaW5lci5zZWxlY3RBbGwoXCJ0ZXh0XCIpXHJcbiAgICAgICAgICAgIC5kYXRhKCBzY2FsZS5kb21haW4oKSApO1xyXG4gICAgICAgIHZhciB0aWNrc051bWJlciA9c2NhbGUuZG9tYWluKCkubGVuZ3RoLTE7XHJcbiAgICAgICAgdGlja3MuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpO1xyXG5cclxuICAgICAgICB0aWNrcy5hdHRyKFwieFwiLCBiYXJXaWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsICAoZCwgaSkgPT4gIGJhckhlaWdodCAtKGkqYmFySGVpZ2h0L3RpY2tzTnVtYmVyKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJkeFwiLCAzKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcImR5XCIsIDEpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiYWxpZ25tZW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGQ9PiBzZWxmLmxhYmVsRm9ybWF0ID8gc2VsZi5sYWJlbEZvcm1hdChkKSA6IGQpO1xyXG4gICAgICAgIHRpY2tzLmF0dHIoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgIGlmKHRoaXMucm90YXRlTGFiZWxzKXtcclxuICAgICAgICAgICAgdGlja3NcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInJvdGF0ZSgtNDUsIFwiICsgYmFyV2lkdGggKyBcIiwgXCIgKyAoYmFySGVpZ2h0IC0oaSpiYXJIZWlnaHQvdGlja3NOdW1iZXIpKSArIFwiKVwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcInN0YXJ0XCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImR4XCIsIDUpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImR5XCIsIDUpO1xyXG5cclxuICAgICAgICB9ZWxzZXtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aWNrcy5leGl0KCkucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFJvdGF0ZUxhYmVscyhyb3RhdGVMYWJlbHMpIHtcclxuICAgICAgICB0aGlzLnJvdGF0ZUxhYmVscyA9IHJvdGF0ZUxhYmVscztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBcclxufSIsImltcG9ydCB7Q2hhcnQsIENoYXJ0Q29uZmlnfSBmcm9tIFwiLi9jaGFydFwiO1xyXG5pbXBvcnQge1NjYXR0ZXJQbG90LCBTY2F0dGVyUGxvdENvbmZpZ30gZnJvbSBcIi4vc2NhdHRlcnBsb3RcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IHtTdGF0aXN0aWNzVXRpbHN9IGZyb20gJy4vc3RhdGlzdGljcy11dGlscydcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgUmVncmVzc2lvbkNvbmZpZyBleHRlbmRzIFNjYXR0ZXJQbG90Q29uZmlne1xyXG5cclxuICAgIG1haW5SZWdyZXNzaW9uID0gdHJ1ZTtcclxuICAgIGdyb3VwUmVncmVzc2lvbiA9IHRydWU7XHJcbiAgICBjb25maWRlbmNlPXtcclxuICAgICAgICBsZXZlbDogMC45NSxcclxuICAgICAgICBjcml0aWNhbFZhbHVlOiAoZGVncmVlc09mRnJlZWRvbSwgY3JpdGljYWxQcm9iYWJpbGl0eSkgPT4gU3RhdGlzdGljc1V0aWxzLnRWYWx1ZShkZWdyZWVzT2ZGcmVlZG9tLCBjcml0aWNhbFByb2JhYmlsaXR5KSxcclxuICAgICAgICBtYXJnaW5PZkVycm9yOiB1bmRlZmluZWQgLy9jdXN0b20gIG1hcmdpbiBPZiBFcnJvciBmdW5jdGlvbiAoeCwgcG9pbnRzKVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIGlmKGN1c3RvbSl7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUmVncmVzc2lvbiBleHRlbmRzIFNjYXR0ZXJQbG90e1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IFJlZ3Jlc3Npb25Db25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZyl7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgUmVncmVzc2lvbkNvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpe1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcbiAgICAgICAgdGhpcy5pbml0UmVncmVzc2lvbkxpbmVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFJlZ3Jlc3Npb25MaW5lcygpe1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGdyb3Vwc0F2YWlsYWJsZSA9IHNlbGYucGxvdC5ncm91cGluZ0VuYWJsZWQ7XHJcblxyXG4gICAgICAgIHNlbGYucGxvdC5yZWdyZXNzaW9ucz0gW107XHJcblxyXG5cclxuICAgICAgICBpZihncm91cHNBdmFpbGFibGUgJiYgc2VsZi5jb25maWcubWFpblJlZ3Jlc3Npb24pe1xyXG4gICAgICAgICAgICB2YXIgcmVncmVzc2lvbiA9IHRoaXMuaW5pdFJlZ3Jlc3Npb24odGhpcy5wbG90LmRhdGEsIGZhbHNlKTtcclxuICAgICAgICAgICAgc2VsZi5wbG90LnJlZ3Jlc3Npb25zLnB1c2gocmVncmVzc2lvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihzZWxmLmNvbmZpZy5ncm91cFJlZ3Jlc3Npb24pe1xyXG4gICAgICAgICAgICB0aGlzLmluaXRHcm91cFJlZ3Jlc3Npb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXRHcm91cFJlZ3Jlc3Npb24oKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLnBsb3QuZ3JvdXBlZERhdGEuZm9yRWFjaChncm91cD0+e1xyXG4gICAgICAgICAgICB2YXIgcmVncmVzc2lvbiA9IHRoaXMuaW5pdFJlZ3Jlc3Npb24oZ3JvdXAudmFsdWVzLCBncm91cC5rZXkpO1xyXG4gICAgICAgICAgICBzZWxmLnBsb3QucmVncmVzc2lvbnMucHVzaChyZWdyZXNzaW9uKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0UmVncmVzc2lvbih2YWx1ZXMsIGdyb3VwVmFsKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciBwb2ludHMgPSB2YWx1ZXMubWFwKGQ9PntcclxuICAgICAgICAgICAgcmV0dXJuIFtwYXJzZUZsb2F0KHNlbGYucGxvdC54LnZhbHVlKGQpKSwgcGFyc2VGbG9hdChzZWxmLnBsb3QueS52YWx1ZShkKSldO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBwb2ludHMuc29ydCgoYSxiKSA9PiBhWzBdLWJbMF0pO1xyXG5cclxuICAgICAgICB2YXIgbGluZWFyUmVncmVzc2lvbiA9ICBTdGF0aXN0aWNzVXRpbHMubGluZWFyUmVncmVzc2lvbihwb2ludHMpO1xyXG4gICAgICAgIHZhciBsaW5lYXJSZWdyZXNzaW9uTGluZSA9IFN0YXRpc3RpY3NVdGlscy5saW5lYXJSZWdyZXNzaW9uTGluZShsaW5lYXJSZWdyZXNzaW9uKTtcclxuXHJcblxyXG4gICAgICAgIHZhciBleHRlbnRYID0gZDMuZXh0ZW50KHBvaW50cywgZD0+ZFswXSk7XHJcblxyXG5cclxuICAgICAgICB2YXIgbGluZVBvaW50cyA9IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeDogZXh0ZW50WFswXSxcclxuICAgICAgICAgICAgICAgIHk6IGxpbmVhclJlZ3Jlc3Npb25MaW5lKGV4dGVudFhbMF0pXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHg6IGV4dGVudFhbMV0sXHJcbiAgICAgICAgICAgICAgICB5OiBsaW5lYXJSZWdyZXNzaW9uTGluZShleHRlbnRYWzFdKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgdmFyIGxpbmUgPSBkMy5zdmcubGluZSgpXHJcbiAgICAgICAgICAgIC5pbnRlcnBvbGF0ZShcImJhc2lzXCIpXHJcbiAgICAgICAgICAgIC54KGQgPT4gc2VsZi5wbG90Lnguc2NhbGUoZC54KSlcclxuICAgICAgICAgICAgLnkoZCA9PiBzZWxmLnBsb3QueS5zY2FsZShkLnkpKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbG9yID0gc2VsZi5wbG90LmNvbG9yO1xyXG5cclxuICAgICAgICB2YXIgZGVmYXVsdENvbG9yID0gXCJibGFja1wiO1xyXG4gICAgICAgIGlmKFV0aWxzLmlzRnVuY3Rpb24oY29sb3IpKXtcclxuICAgICAgICAgICAgaWYodmFsdWVzLmxlbmd0aCAmJiBncm91cFZhbCE9PWZhbHNlKXtcclxuICAgICAgICAgICAgICAgIGlmKHNlbGYuY29uZmlnLnNlcmllcyl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3IgPXNlbGYucGxvdC5jb2xvckNhdGVnb3J5KGdyb3VwVmFsKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yID0gY29sb3IodmFsdWVzWzBdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgY29sb3IgPSBkZWZhdWx0Q29sb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZSBpZighY29sb3IgJiYgZ3JvdXBWYWw9PT1mYWxzZSl7XHJcbiAgICAgICAgICAgIGNvbG9yID0gZGVmYXVsdENvbG9yO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHZhciBjb25maWRlbmNlID0gdGhpcy5jb21wdXRlQ29uZmlkZW5jZShwb2ludHMsIGV4dGVudFgsICBsaW5lYXJSZWdyZXNzaW9uLGxpbmVhclJlZ3Jlc3Npb25MaW5lKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBncm91cDogZ3JvdXBWYWwgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgIGxpbmU6IGxpbmUsXHJcbiAgICAgICAgICAgIGxpbmVQb2ludHM6IGxpbmVQb2ludHMsXHJcbiAgICAgICAgICAgIGNvbG9yOiBjb2xvcixcclxuICAgICAgICAgICAgY29uZmlkZW5jZTogY29uZmlkZW5jZVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgY29tcHV0ZUNvbmZpZGVuY2UocG9pbnRzLCBleHRlbnRYLCBsaW5lYXJSZWdyZXNzaW9uLGxpbmVhclJlZ3Jlc3Npb25MaW5lKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHNsb3BlID0gbGluZWFyUmVncmVzc2lvbi5tO1xyXG4gICAgICAgIHZhciBuID0gcG9pbnRzLmxlbmd0aDtcclxuICAgICAgICB2YXIgZGVncmVlc09mRnJlZWRvbSA9IE1hdGgubWF4KDAsIG4tMik7XHJcblxyXG4gICAgICAgIHZhciBhbHBoYSA9IDEgLSBzZWxmLmNvbmZpZy5jb25maWRlbmNlLmxldmVsO1xyXG4gICAgICAgIHZhciBjcml0aWNhbFByb2JhYmlsaXR5ICA9IDEgLSBhbHBoYS8yO1xyXG4gICAgICAgIHZhciBjcml0aWNhbFZhbHVlID0gc2VsZi5jb25maWcuY29uZmlkZW5jZS5jcml0aWNhbFZhbHVlKGRlZ3JlZXNPZkZyZWVkb20sY3JpdGljYWxQcm9iYWJpbGl0eSk7XHJcblxyXG4gICAgICAgIHZhciB4VmFsdWVzID0gcG9pbnRzLm1hcChkPT5kWzBdKTtcclxuICAgICAgICB2YXIgbWVhblggPSBTdGF0aXN0aWNzVXRpbHMubWVhbih4VmFsdWVzKTtcclxuICAgICAgICB2YXIgeE15U3VtPTA7XHJcbiAgICAgICAgdmFyIHhTdW09MDtcclxuICAgICAgICB2YXIgeFBvd1N1bT0wO1xyXG4gICAgICAgIHZhciB5U3VtPTA7XHJcbiAgICAgICAgdmFyIHlQb3dTdW09MDtcclxuICAgICAgICBwb2ludHMuZm9yRWFjaChwPT57XHJcbiAgICAgICAgICAgIHZhciB4ID0gcFswXTtcclxuICAgICAgICAgICAgdmFyIHkgPSBwWzFdO1xyXG5cclxuICAgICAgICAgICAgeE15U3VtICs9IHgqeTtcclxuICAgICAgICAgICAgeFN1bSs9eDtcclxuICAgICAgICAgICAgeVN1bSs9eTtcclxuICAgICAgICAgICAgeFBvd1N1bSs9IHgqeDtcclxuICAgICAgICAgICAgeVBvd1N1bSs9IHkqeTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgYSA9IGxpbmVhclJlZ3Jlc3Npb24ubTtcclxuICAgICAgICB2YXIgYiA9IGxpbmVhclJlZ3Jlc3Npb24uYjtcclxuXHJcbiAgICAgICAgdmFyIFNhMiA9IG4vKG4rMikgKiAoKHlQb3dTdW0tYSp4TXlTdW0tYip5U3VtKS8obip4UG93U3VtLSh4U3VtKnhTdW0pKSk7IC8vV2FyaWFuY2phIHdzcMOzxYJjenlubmlrYSBraWVydW5rb3dlZ28gcmVncmVzamkgbGluaW93ZWogYVxyXG4gICAgICAgIHZhciBTeTIgPSAoeVBvd1N1bSAtIGEqeE15U3VtLWIqeVN1bSkvKG4qKG4tMikpOyAvL1NhMiAvL01lYW4geSB2YWx1ZSB2YXJpYW5jZVxyXG5cclxuICAgICAgICB2YXIgZXJyb3JGbiA9IHg9PiBNYXRoLnNxcnQoU3kyICsgTWF0aC5wb3coeC1tZWFuWCwyKSpTYTIpOyAvL3BpZXJ3aWFzdGVrIGt3YWRyYXRvd3kgeiB3YXJpYW5jamkgZG93b2xuZWdvIHB1bmt0dSBwcm9zdGVqXHJcbiAgICAgICAgdmFyIG1hcmdpbk9mRXJyb3IgPSAgeD0+IGNyaXRpY2FsVmFsdWUqIGVycm9yRm4oeCk7XHJcblxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbicsIG4sICdkZWdyZWVzT2ZGcmVlZG9tJywgZGVncmVlc09mRnJlZWRvbSwgJ2NyaXRpY2FsUHJvYmFiaWxpdHknLGNyaXRpY2FsUHJvYmFiaWxpdHkpO1xyXG4gICAgICAgIC8vIHZhciBjb25maWRlbmNlRG93biA9IHggPT4gbGluZWFyUmVncmVzc2lvbkxpbmUoeCkgLSAgbWFyZ2luT2ZFcnJvcih4KTtcclxuICAgICAgICAvLyB2YXIgY29uZmlkZW5jZVVwID0geCA9PiBsaW5lYXJSZWdyZXNzaW9uTGluZSh4KSArICBtYXJnaW5PZkVycm9yKHgpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGNvbXB1dGVDb25maWRlbmNlQXJlYVBvaW50ID0geD0+e1xyXG4gICAgICAgICAgICB2YXIgbGluZWFyUmVncmVzc2lvbiA9IGxpbmVhclJlZ3Jlc3Npb25MaW5lKHgpO1xyXG4gICAgICAgICAgICB2YXIgbW9lID0gbWFyZ2luT2ZFcnJvcih4KTtcclxuICAgICAgICAgICAgdmFyIGNvbmZEb3duID0gbGluZWFyUmVncmVzc2lvbiAtIG1vZTtcclxuICAgICAgICAgICAgdmFyIGNvbmZVcCA9IGxpbmVhclJlZ3Jlc3Npb24gKyBtb2U7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB4OiB4LFxyXG4gICAgICAgICAgICAgICAgeTA6IGNvbmZEb3duLFxyXG4gICAgICAgICAgICAgICAgeTE6IGNvbmZVcFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBjZW50ZXJYID0gKGV4dGVudFhbMV0rZXh0ZW50WFswXSkvMjtcclxuXHJcbiAgICAgICAgLy8gdmFyIGNvbmZpZGVuY2VBcmVhUG9pbnRzID0gW2V4dGVudFhbMF0sIGNlbnRlclgsICBleHRlbnRYWzFdXS5tYXAoY29tcHV0ZUNvbmZpZGVuY2VBcmVhUG9pbnQpO1xyXG4gICAgICAgIHZhciBjb25maWRlbmNlQXJlYVBvaW50cyA9IFtleHRlbnRYWzBdLCBjZW50ZXJYLCAgZXh0ZW50WFsxXV0ubWFwKGNvbXB1dGVDb25maWRlbmNlQXJlYVBvaW50KTtcclxuXHJcbiAgICAgICAgdmFyIGZpdEluUGxvdCA9IHkgPT4geTtcclxuXHJcbiAgICAgICAgdmFyIGNvbmZpZGVuY2VBcmVhID0gIGQzLnN2Zy5hcmVhKClcclxuICAgICAgICAuaW50ZXJwb2xhdGUoXCJtb25vdG9uZVwiKVxyXG4gICAgICAgICAgICAueChkID0+IHNlbGYucGxvdC54LnNjYWxlKGQueCkpXHJcbiAgICAgICAgICAgIC55MChkID0+IGZpdEluUGxvdChzZWxmLnBsb3QueS5zY2FsZShkLnkwKSkpXHJcbiAgICAgICAgICAgIC55MShkID0+IGZpdEluUGxvdChzZWxmLnBsb3QueS5zY2FsZShkLnkxKSkpO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBhcmVhOmNvbmZpZGVuY2VBcmVhLFxyXG4gICAgICAgICAgICBwb2ludHM6Y29uZmlkZW5jZUFyZWFQb2ludHNcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShuZXdEYXRhKXtcclxuICAgICAgICBzdXBlci51cGRhdGUobmV3RGF0YSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSZWdyZXNzaW9uTGluZXMoKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHVwZGF0ZVJlZ3Jlc3Npb25MaW5lcygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb25Db250YWluZXJDbGFzcyA9IHRoaXMucHJlZml4Q2xhc3MoXCJyZWdyZXNzaW9uLWNvbnRhaW5lclwiKTtcclxuICAgICAgICB2YXIgcmVncmVzc2lvbkNvbnRhaW5lclNlbGVjdG9yID0gXCJnLlwiK3JlZ3Jlc3Npb25Db250YWluZXJDbGFzcztcclxuXHJcbiAgICAgICAgdmFyIGNsaXBQYXRoSWQgPSBzZWxmLnByZWZpeENsYXNzKFwiY2xpcFwiKTtcclxuXHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb25Db250YWluZXIgPSBzZWxmLnN2Z0cuc2VsZWN0T3JJbnNlcnQocmVncmVzc2lvbkNvbnRhaW5lclNlbGVjdG9yLCBcIi5cIitzZWxmLmRvdHNDb250YWluZXJDbGFzcyk7XHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb25Db250YWluZXJDbGlwID0gcmVncmVzc2lvbkNvbnRhaW5lci5zZWxlY3RPckFwcGVuZChcImNsaXBQYXRoXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgY2xpcFBhdGhJZCk7XHJcblxyXG5cclxuICAgICAgICByZWdyZXNzaW9uQ29udGFpbmVyQ2xpcC5zZWxlY3RPckFwcGVuZCgncmVjdCcpXHJcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHNlbGYucGxvdC53aWR0aClcclxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHNlbGYucGxvdC5oZWlnaHQpXHJcbiAgICAgICAgICAgIC5hdHRyKCd4JywgMClcclxuICAgICAgICAgICAgLmF0dHIoJ3knLCAwKTtcclxuXHJcbiAgICAgICAgcmVncmVzc2lvbkNvbnRhaW5lci5hdHRyKFwiY2xpcC1wYXRoXCIsIChkLGkpID0+IFwidXJsKCNcIitjbGlwUGF0aElkK1wiKVwiKTtcclxuXHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb25DbGFzcyA9IHRoaXMucHJlZml4Q2xhc3MoXCJyZWdyZXNzaW9uXCIpO1xyXG4gICAgICAgIHZhciBjb25maWRlbmNlQXJlYUNsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImNvbmZpZGVuY2VcIik7XHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb25TZWxlY3RvciA9IFwiZy5cIityZWdyZXNzaW9uQ2xhc3M7XHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb24gPSByZWdyZXNzaW9uQ29udGFpbmVyLnNlbGVjdEFsbChyZWdyZXNzaW9uU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5kYXRhKHNlbGYucGxvdC5yZWdyZXNzaW9ucywgKGQsaSk9PiBkLmdyb3VwKTtcclxuXHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb25FbnRlckcgPSByZWdyZXNzaW9uLmVudGVyKCkuaW5zZXJ0U2VsZWN0b3IocmVncmVzc2lvblNlbGVjdG9yKTtcclxuICAgICAgICB2YXIgbGluZUNsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImxpbmVcIik7XHJcbiAgICAgICAgcmVncmVzc2lvbkVudGVyR1xyXG5cclxuICAgICAgICAgICAgLmFwcGVuZChcInBhdGhcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBsaW5lQ2xhc3MpXHJcbiAgICAgICAgICAgIC5hdHRyKFwic2hhcGUtcmVuZGVyaW5nXCIsIFwib3B0aW1pemVRdWFsaXR5XCIpO1xyXG4gICAgICAgICAgICAvLyAuYXBwZW5kKFwibGluZVwiKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcImNsYXNzXCIsIFwibGluZVwiKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcInNoYXBlLXJlbmRlcmluZ1wiLCBcIm9wdGltaXplUXVhbGl0eVwiKTtcclxuXHJcbiAgICAgICAgdmFyIGxpbmUgPSByZWdyZXNzaW9uLnNlbGVjdChcInBhdGguXCIrbGluZUNsYXNzKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgciA9PiByLmNvbG9yKTtcclxuICAgICAgICAvLyAuYXR0cihcIngxXCIsIHI9PiBzZWxmLnBsb3QueC5zY2FsZShyLmxpbmVQb2ludHNbMF0ueCkpXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwieTFcIiwgcj0+IHNlbGYucGxvdC55LnNjYWxlKHIubGluZVBvaW50c1swXS55KSlcclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJ4MlwiLCByPT4gc2VsZi5wbG90Lnguc2NhbGUoci5saW5lUG9pbnRzWzFdLngpKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcInkyXCIsIHI9PiBzZWxmLnBsb3QueS5zY2FsZShyLmxpbmVQb2ludHNbMV0ueSkpXHJcblxyXG5cclxuICAgICAgICB2YXIgbGluZVQgPSBsaW5lO1xyXG4gICAgICAgIGlmIChzZWxmLnRyYW5zaXRpb25FbmFibGVkKCkpIHtcclxuICAgICAgICAgICAgbGluZVQgPSBsaW5lLnRyYW5zaXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxpbmVULmF0dHIoXCJkXCIsIHIgPT4gci5saW5lKHIubGluZVBvaW50cykpXHJcblxyXG5cclxuICAgICAgICByZWdyZXNzaW9uRW50ZXJHXHJcbiAgICAgICAgICAgIC5hcHBlbmQoXCJwYXRoXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgY29uZmlkZW5jZUFyZWFDbGFzcylcclxuICAgICAgICAgICAgLmF0dHIoXCJzaGFwZS1yZW5kZXJpbmdcIiwgXCJvcHRpbWl6ZVF1YWxpdHlcIilcclxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCBcIjAuNFwiKTtcclxuXHJcblxyXG5cclxuICAgICAgICB2YXIgYXJlYSA9IHJlZ3Jlc3Npb24uc2VsZWN0KFwicGF0aC5cIitjb25maWRlbmNlQXJlYUNsYXNzKTtcclxuXHJcbiAgICAgICAgdmFyIGFyZWFUID0gYXJlYTtcclxuICAgICAgICBpZiAoc2VsZi50cmFuc2l0aW9uRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgICAgIGFyZWFUID0gYXJlYS50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFyZWFULmF0dHIoXCJkXCIsIHIgPT4gci5jb25maWRlbmNlLmFyZWEoci5jb25maWRlbmNlLnBvaW50cykpO1xyXG4gICAgICAgIGFyZWFULnN0eWxlKFwiZmlsbFwiLCByID0+IHIuY29sb3IpXHJcbiAgICAgICAgcmVncmVzc2lvbi5leGl0KCkucmVtb3ZlKCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG59XHJcblxyXG4iLCJpbXBvcnQge0NoYXJ0V2l0aENvbG9yR3JvdXBzfSBmcm9tIFwiLi9jaGFydC13aXRoLWNvbG9yLWdyb3Vwc1wiO1xyXG5pbXBvcnQge1NjYXR0ZXJQbG90Q29uZmlnfSBmcm9tIFwiLi9zY2F0dGVycGxvdFwiO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5pbXBvcnQge0xlZ2VuZH0gZnJvbSBcIi4vbGVnZW5kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2NhdHRlclBsb3RNYXRyaXhDb25maWcgZXh0ZW5kcyBTY2F0dGVyUGxvdENvbmZpZ3tcclxuXHJcbiAgICBzdmdDbGFzcz0gdGhpcy5jc3NDbGFzc1ByZWZpeCsnc2NhdHRlcnBsb3QtbWF0cml4JztcclxuICAgIHNpemU9IHVuZGVmaW5lZDsgLy9zY2F0dGVyIHBsb3QgY2VsbCBzaXplXHJcbiAgICBtaW5DZWxsU2l6ZSA9IDUwO1xyXG4gICAgbWF4Q2VsbFNpemUgPSAxMDAwO1xyXG4gICAgcGFkZGluZz0gMjA7IC8vc2NhdHRlciBwbG90IGNlbGwgcGFkZGluZ1xyXG4gICAgYnJ1c2g9IHRydWU7XHJcbiAgICBndWlkZXM9IHRydWU7IC8vc2hvdyBheGlzIGd1aWRlc1xyXG4gICAgc2hvd1Rvb2x0aXA9IHRydWU7IC8vc2hvdyB0b29sdGlwIG9uIGRvdCBob3ZlclxyXG4gICAgdGlja3M9IHVuZGVmaW5lZDsgLy90aWNrcyBudW1iZXIsIChkZWZhdWx0OiBjb21wdXRlZCB1c2luZyBjZWxsIHNpemUpXHJcbiAgICB4PXsvLyBYIGF4aXMgY29uZmlnXHJcbiAgICAgICAgb3JpZW50OiBcImJvdHRvbVwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiXHJcbiAgICB9O1xyXG4gICAgeT17Ly8gWSBheGlzIGNvbmZpZ1xyXG4gICAgICAgIG9yaWVudDogXCJsZWZ0XCIsXHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCJcclxuICAgIH07XHJcbiAgICBncm91cHM9e1xyXG4gICAgICAgIGtleTogdW5kZWZpbmVkLCAvL29iamVjdCBwcm9wZXJ0eSBuYW1lIG9yIGFycmF5IGluZGV4IHdpdGggZ3JvdXBpbmcgdmFyaWFibGVcclxuICAgICAgICBpbmNsdWRlSW5QbG90OiBmYWxzZSwgLy9pbmNsdWRlIGdyb3VwIGFzIHZhcmlhYmxlIGluIHBsb3QsIGJvb2xlYW4gKGRlZmF1bHQ6IGZhbHNlKVxyXG4gICAgfTtcclxuICAgIHZhcmlhYmxlcz0ge1xyXG4gICAgICAgIGxhYmVsczogW10sIC8vb3B0aW9uYWwgYXJyYXkgb2YgdmFyaWFibGUgbGFiZWxzIChmb3IgdGhlIGRpYWdvbmFsIG9mIHRoZSBwbG90KS5cclxuICAgICAgICBrZXlzOiBbXSwgLy9vcHRpb25hbCBhcnJheSBvZiB2YXJpYWJsZSBrZXlzXHJcbiAgICAgICAgdmFsdWU6IChkLCB2YXJpYWJsZUtleSkgPT4gZFt2YXJpYWJsZUtleV0gLy8gdmFyaWFibGUgdmFsdWUgYWNjZXNzb3JcclxuICAgIH07XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgIH1cclxuXHJcblxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2NhdHRlclBsb3RNYXRyaXggZXh0ZW5kcyBDaGFydFdpdGhDb2xvckdyb3VwcyB7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBzdXBlcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBuZXcgU2NhdHRlclBsb3RNYXRyaXhDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZykge1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IFNjYXR0ZXJQbG90TWF0cml4Q29uZmlnKGNvbmZpZykpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0UGxvdCgpO1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG1hcmdpbiA9IHRoaXMucGxvdC5tYXJnaW47XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICB0aGlzLnBsb3QueD17fTtcclxuICAgICAgICB0aGlzLnBsb3QueT17fTtcclxuICAgICAgICB0aGlzLnBsb3QuZG90PXtcclxuICAgICAgICAgICAgY29sb3I6IG51bGwvL2NvbG9yIHNjYWxlIG1hcHBpbmcgZnVuY3Rpb25cclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2V0dXBWYXJpYWJsZXMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnNpemUgPSBjb25mLnNpemU7XHJcblxyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBjb25mLndpZHRoO1xyXG4gICAgICAgIHZhciBhdmFpbGFibGVXaWR0aCA9IFV0aWxzLmF2YWlsYWJsZVdpZHRoKHRoaXMuY29uZmlnLndpZHRoLCB0aGlzLmdldEJhc2VDb250YWluZXIoKSwgbWFyZ2luKTtcclxuICAgICAgICB2YXIgYXZhaWxhYmxlSGVpZ2h0ID0gVXRpbHMuYXZhaWxhYmxlSGVpZ2h0KHRoaXMuY29uZmlnLmhlaWdodCwgdGhpcy5nZXRCYXNlQ29udGFpbmVyKCksIG1hcmdpbik7XHJcbiAgICAgICAgaWYgKCF3aWR0aCkge1xyXG4gICAgICAgICAgICBpZighdGhpcy5wbG90LnNpemUpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LnNpemUgPSAgTWF0aC5taW4oY29uZi5tYXhDZWxsU2l6ZSwgTWF0aC5tYXgoY29uZi5taW5DZWxsU2l6ZSwgYXZhaWxhYmxlV2lkdGgvdGhpcy5wbG90LnZhcmlhYmxlcy5sZW5ndGgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB3aWR0aCA9IG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0ICsgdGhpcy5wbG90LnZhcmlhYmxlcy5sZW5ndGgqdGhpcy5wbG90LnNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCF0aGlzLnBsb3Quc2l6ZSl7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5zaXplID0gKHdpZHRoIC0gKG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0KSkgLyB0aGlzLnBsb3QudmFyaWFibGVzLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBoZWlnaHQgPSB3aWR0aDtcclxuICAgICAgICBpZiAoIWhlaWdodCkge1xyXG4gICAgICAgICAgICBoZWlnaHQgPSBhdmFpbGFibGVIZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnBsb3Qud2lkdGggPSB3aWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0O1xyXG4gICAgICAgIHRoaXMucGxvdC5oZWlnaHQgPSBoZWlnaHQgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMucGxvdC50aWNrcyA9IGNvbmYudGlja3M7XHJcblxyXG4gICAgICAgIGlmKHRoaXMucGxvdC50aWNrcz09PXVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC50aWNrcyA9IHRoaXMucGxvdC5zaXplIC8gNDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldHVwWCgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBZKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBWYXJpYWJsZXMoKSB7XHJcbiAgICAgICAgdmFyIHZhcmlhYmxlc0NvbmYgPSB0aGlzLmNvbmZpZy52YXJpYWJsZXM7XHJcblxyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5wbG90Lmdyb3VwZWREYXRhO1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHBsb3QuZG9tYWluQnlWYXJpYWJsZSA9IHt9O1xyXG4gICAgICAgIHBsb3QudmFyaWFibGVzID0gdmFyaWFibGVzQ29uZi5rZXlzO1xyXG4gICAgICAgIGlmKCFwbG90LnZhcmlhYmxlcyB8fCAhcGxvdC52YXJpYWJsZXMubGVuZ3RoKXtcclxuXHJcbiAgICAgICAgICAgIHBsb3QudmFyaWFibGVzID0gZGF0YS5sZW5ndGggPyBVdGlscy5pbmZlclZhcmlhYmxlcyhkYXRhWzBdLnZhbHVlcywgdGhpcy5jb25maWcuZ3JvdXBzLmtleSwgdGhpcy5jb25maWcuaW5jbHVkZUluUGxvdCkgOiBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBsb3QubGFiZWxzID0gW107XHJcbiAgICAgICAgcGxvdC5sYWJlbEJ5VmFyaWFibGUgPSB7fTtcclxuICAgICAgICBwbG90LnZhcmlhYmxlcy5mb3JFYWNoKCh2YXJpYWJsZUtleSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgdmFyIG1pbiA9IGQzLm1pbihkYXRhLCBzPT5kMy5taW4ocy52YWx1ZXMsIGQ9PnZhcmlhYmxlc0NvbmYudmFsdWUoZCwgdmFyaWFibGVLZXkpKSk7XHJcbiAgICAgICAgICAgIHZhciBtYXggPSBkMy5tYXgoZGF0YSwgcz0+ZDMubWF4KHMudmFsdWVzLCBkPT52YXJpYWJsZXNDb25mLnZhbHVlKGQsIHZhcmlhYmxlS2V5KSkpO1xyXG4gICAgICAgICAgICBwbG90LmRvbWFpbkJ5VmFyaWFibGVbdmFyaWFibGVLZXldID0gW21pbixtYXhdO1xyXG4gICAgICAgICAgICB2YXIgbGFiZWwgPSB2YXJpYWJsZUtleTtcclxuICAgICAgICAgICAgaWYodmFyaWFibGVzQ29uZi5sYWJlbHMgJiYgdmFyaWFibGVzQ29uZi5sYWJlbHMubGVuZ3RoPmluZGV4KXtcclxuXHJcbiAgICAgICAgICAgICAgICBsYWJlbCA9IHZhcmlhYmxlc0NvbmYubGFiZWxzW2luZGV4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwbG90LmxhYmVscy5wdXNoKGxhYmVsKTtcclxuICAgICAgICAgICAgcGxvdC5sYWJlbEJ5VmFyaWFibGVbdmFyaWFibGVLZXldID0gbGFiZWw7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHBsb3Quc3VicGxvdHMgPSBbXTtcclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBYKCkge1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeCA9IHBsb3QueDtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB4LnZhbHVlID0gY29uZi52YXJpYWJsZXMudmFsdWU7XHJcbiAgICAgICAgeC5zY2FsZSA9IGQzLnNjYWxlW2NvbmYueC5zY2FsZV0oKS5yYW5nZShbY29uZi5wYWRkaW5nIC8gMiwgcGxvdC5zaXplIC0gY29uZi5wYWRkaW5nIC8gMl0pO1xyXG4gICAgICAgIHgubWFwID0gKGQsIHZhcmlhYmxlKSA9PiB4LnNjYWxlKHgudmFsdWUoZCwgdmFyaWFibGUpKTtcclxuICAgICAgICB4LmF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHguc2NhbGUpLm9yaWVudChjb25mLngub3JpZW50KS50aWNrcyhwbG90LnRpY2tzKTtcclxuICAgICAgICB4LmF4aXMudGlja1NpemUocGxvdC5zaXplICogcGxvdC52YXJpYWJsZXMubGVuZ3RoKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwWSgpIHtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHkgPSBwbG90Lnk7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgeS52YWx1ZSA9IGNvbmYudmFyaWFibGVzLnZhbHVlO1xyXG4gICAgICAgIHkuc2NhbGUgPSBkMy5zY2FsZVtjb25mLnkuc2NhbGVdKCkucmFuZ2UoWyBwbG90LnNpemUgLSBjb25mLnBhZGRpbmcgLyAyLCBjb25mLnBhZGRpbmcgLyAyXSk7XHJcbiAgICAgICAgeS5tYXAgPSAoZCwgdmFyaWFibGUpID0+IHkuc2NhbGUoeS52YWx1ZShkLCB2YXJpYWJsZSkpO1xyXG4gICAgICAgIHkuYXhpcz0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh5LnNjYWxlKS5vcmllbnQoY29uZi55Lm9yaWVudCkudGlja3MocGxvdC50aWNrcyk7XHJcbiAgICAgICAgeS5heGlzLnRpY2tTaXplKC1wbG90LnNpemUgKiBwbG90LnZhcmlhYmxlcy5sZW5ndGgpO1xyXG4gICAgfTtcclxuXHJcbiAgICB1cGRhdGUoIG5ld0RhdGEpIHtcclxuICAgICAgICBzdXBlci51cGRhdGUobmV3RGF0YSk7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID10aGlzO1xyXG4gICAgICAgIHZhciBuID0gc2VsZi5wbG90LnZhcmlhYmxlcy5sZW5ndGg7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgdmFyIGF4aXNDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJheGlzXCIpO1xyXG4gICAgICAgIHZhciBheGlzWENsYXNzID0gYXhpc0NsYXNzK1wiLXhcIjtcclxuICAgICAgICB2YXIgYXhpc1lDbGFzcyA9IGF4aXNDbGFzcytcIi15XCI7XHJcblxyXG4gICAgICAgIHZhciB4QXhpc1NlbGVjdG9yID0gXCJnLlwiK2F4aXNYQ2xhc3MrXCIuXCIrYXhpc0NsYXNzO1xyXG4gICAgICAgIHZhciB5QXhpc1NlbGVjdG9yID0gXCJnLlwiK2F4aXNZQ2xhc3MrXCIuXCIrYXhpc0NsYXNzO1xyXG5cclxuICAgICAgICB2YXIgbm9HdWlkZXNDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJuby1ndWlkZXNcIik7XHJcbiAgICAgICAgdmFyIHhBeGlzID0gc2VsZi5zdmdHLnNlbGVjdEFsbCh4QXhpc1NlbGVjdG9yKVxyXG4gICAgICAgICAgICAuZGF0YShzZWxmLnBsb3QudmFyaWFibGVzKTtcclxuXHJcbiAgICAgICAgeEF4aXMuZW50ZXIoKS5hcHBlbmRTZWxlY3Rvcih4QXhpc1NlbGVjdG9yKVxyXG4gICAgICAgICAgICAuY2xhc3NlZChub0d1aWRlc0NsYXNzLCAhY29uZi5ndWlkZXMpO1xyXG5cclxuICAgICAgICB4QXhpcy5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInRyYW5zbGF0ZShcIiArIChuIC0gaSAtIDEpICogc2VsZi5wbG90LnNpemUgKyBcIiwwKVwiKVxyXG4gICAgICAgICAgICAuZWFjaChmdW5jdGlvbihkKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QueC5zY2FsZS5kb21haW4oc2VsZi5wbG90LmRvbWFpbkJ5VmFyaWFibGVbZF0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIGF4aXMgPSBkMy5zZWxlY3QodGhpcyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi50cmFuc2l0aW9uRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXhpcyA9IGF4aXMudHJhbnNpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYXhpcy5jYWxsKHNlbGYucGxvdC54LmF4aXMpO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHhBeGlzLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgdmFyIHlBeGlzID0gc2VsZi5zdmdHLnNlbGVjdEFsbCh5QXhpc1NlbGVjdG9yKVxyXG4gICAgICAgICAgICAuZGF0YShzZWxmLnBsb3QudmFyaWFibGVzKTtcclxuICAgICAgICB5QXhpcy5lbnRlcigpLmFwcGVuZFNlbGVjdG9yKHlBeGlzU2VsZWN0b3IpO1xyXG4gICAgICAgIHlBeGlzLmNsYXNzZWQobm9HdWlkZXNDbGFzcywgIWNvbmYuZ3VpZGVzKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCAoZCwgaSkgPT4gXCJ0cmFuc2xhdGUoMCxcIiArIGkgKiBzZWxmLnBsb3Quc2l6ZSArIFwiKVwiKTtcclxuICAgICAgICB5QXhpcy5lYWNoKGZ1bmN0aW9uKGQpIHtcclxuICAgICAgICAgICAgc2VsZi5wbG90Lnkuc2NhbGUuZG9tYWluKHNlbGYucGxvdC5kb21haW5CeVZhcmlhYmxlW2RdKTtcclxuICAgICAgICAgICAgdmFyIGF4aXMgPSBkMy5zZWxlY3QodGhpcyk7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnRyYW5zaXRpb25FbmFibGVkKCkpIHtcclxuICAgICAgICAgICAgICAgIGF4aXMgPSBheGlzLnRyYW5zaXRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBheGlzLmNhbGwoc2VsZi5wbG90LnkuYXhpcyk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB5QXhpcy5leGl0KCkucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIHZhciBjZWxsQ2xhc3MgPSAgc2VsZi5wcmVmaXhDbGFzcyhcImNlbGxcIik7XHJcbiAgICAgICAgdmFyIGNlbGwgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwiLlwiK2NlbGxDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEoc2VsZi51dGlscy5jcm9zcyhzZWxmLnBsb3QudmFyaWFibGVzLCBzZWxmLnBsb3QudmFyaWFibGVzKSk7XHJcblxyXG4gICAgICAgIGNlbGwuZW50ZXIoKS5hcHBlbmRTZWxlY3RvcihcImcuXCIrY2VsbENsYXNzKS5maWx0ZXIoZCA9PiBkLmkgPT09IGQuailcclxuICAgICAgICAgICAgLmFwcGVuZChcInRleHRcIik7XHJcblxyXG4gICAgICAgIGNlbGwuYXR0cihcInRyYW5zZm9ybVwiLCBkID0+IFwidHJhbnNsYXRlKFwiICsgKG4gLSBkLmkgLSAxKSAqIHNlbGYucGxvdC5zaXplICsgXCIsXCIgKyBkLmogKiBzZWxmLnBsb3Quc2l6ZSArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgaWYoY29uZi5icnVzaCl7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0JydXNoKGNlbGwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2VsbC5lYWNoKHBsb3RTdWJwbG90KTtcclxuXHJcbiAgICAgICAgLy9MYWJlbHNcclxuICAgICAgICBjZWxsLnNlbGVjdChcInRleHRcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIGNvbmYucGFkZGluZylcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIGNvbmYucGFkZGluZylcclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCBcIi43MWVtXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KCBkID0+IHNlbGYucGxvdC5sYWJlbEJ5VmFyaWFibGVbZC54XSk7XHJcblxyXG4gICAgICAgIGNlbGwuZXhpdCgpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBwbG90U3VicGxvdChwKSB7XHJcbiAgICAgICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgICAgICBwbG90LnN1YnBsb3RzLnB1c2gocCk7XHJcbiAgICAgICAgICAgIHZhciBjZWxsID0gZDMuc2VsZWN0KHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgcGxvdC54LnNjYWxlLmRvbWFpbihwbG90LmRvbWFpbkJ5VmFyaWFibGVbcC54XSk7XHJcbiAgICAgICAgICAgIHBsb3QueS5zY2FsZS5kb21haW4ocGxvdC5kb21haW5CeVZhcmlhYmxlW3AueV0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIGZyYW1lQ2xhc3MgPSAgc2VsZi5wcmVmaXhDbGFzcyhcImZyYW1lXCIpO1xyXG4gICAgICAgICAgICBjZWxsLnNlbGVjdE9yQXBwZW5kKFwicmVjdC5cIitmcmFtZUNsYXNzKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBmcmFtZUNsYXNzKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIGNvbmYucGFkZGluZyAvIDIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInlcIiwgY29uZi5wYWRkaW5nIC8gMilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgcGxvdC5zaXplIC0gY29uZi5wYWRkaW5nKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgcGxvdC5zaXplIC0gY29uZi5wYWRkaW5nKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHAudXBkYXRlID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHN1YnBsb3QgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxheWVyQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKCdsYXllcicpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbGF5ZXIgPSBjZWxsLnNlbGVjdEFsbChcImcuXCIrbGF5ZXJDbGFzcykuZGF0YShzZWxmLnBsb3QuZ3JvdXBlZERhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxheWVyLmVudGVyKCkuYXBwZW5kU2VsZWN0b3IoXCJnLlwiK2xheWVyQ2xhc3MpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBkb3RzID0gbGF5ZXIuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmRhdGEoZD0+ZC52YWx1ZXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGRvdHMuZW50ZXIoKS5hcHBlbmQoXCJjaXJjbGVcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGRvdHNUID0gZG90cztcclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLnRyYW5zaXRpb25FbmFibGVkKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb3RzVCA9IGRvdHMudHJhbnNpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGRvdHNULmF0dHIoXCJjeFwiLCAoZCkgPT4gcGxvdC54Lm1hcChkLCBzdWJwbG90LngpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiY3lcIiwgKGQpID0+IHBsb3QueS5tYXAoZCwgc3VicGxvdC55KSlcclxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcInJcIiwgc2VsZi5jb25maWcuZG90UmFkaXVzKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHBsb3Quc2VyaWVzQ29sb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBsYXllci5zdHlsZShcImZpbGxcIiwgcGxvdC5zZXJpZXNDb2xvcilcclxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKHBsb3QuY29sb3Ipe1xyXG4gICAgICAgICAgICAgICAgICAgIGRvdHMuc3R5bGUoXCJmaWxsXCIsIHBsb3QuY29sb3IpXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwbG90LnRvb2x0aXApIHtcclxuICAgICAgICAgICAgICAgICAgICBkb3RzLm9uKFwibW91c2VvdmVyXCIsIChkKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IFwiKFwiICsgcGxvdC54LnZhbHVlKGQsIHN1YnBsb3QueCkgKyBcIiwgXCIgKyBwbG90LnkudmFsdWUoZCwgc3VicGxvdC55KSArIFwiKVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZ3JvdXAgPSBzZWxmLmNvbmZpZy5ncm91cHMgPyBzZWxmLmNvbmZpZy5ncm91cHMudmFsdWUuY2FsbChzZWxmLmNvbmZpZywgZCkgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ3JvdXAgfHwgZ3JvdXAgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwID0gcGxvdC5ncm91cFRvTGFiZWxbZ3JvdXBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBcIjxici8+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSBzZWxmLmNvbmZpZy5ncm91cHMubGFiZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobGFiZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sICs9IGxhYmVsICsgXCI6IFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBncm91cFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2hvd1Rvb2x0aXAoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgKGQpPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oaWRlVG9vbHRpcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBkb3RzLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIGxheWVyLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcC51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBkcmF3QnJ1c2goY2VsbCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgYnJ1c2ggPSBkMy5zdmcuYnJ1c2goKVxyXG4gICAgICAgICAgICAueChzZWxmLnBsb3QueC5zY2FsZSlcclxuICAgICAgICAgICAgLnkoc2VsZi5wbG90Lnkuc2NhbGUpXHJcbiAgICAgICAgICAgIC5vbihcImJydXNoc3RhcnRcIiwgYnJ1c2hzdGFydClcclxuICAgICAgICAgICAgLm9uKFwiYnJ1c2hcIiwgYnJ1c2htb3ZlKVxyXG4gICAgICAgICAgICAub24oXCJicnVzaGVuZFwiLCBicnVzaGVuZCk7XHJcblxyXG4gICAgICAgIHNlbGYucGxvdC5icnVzaCA9IGJydXNoO1xyXG5cclxuICAgICAgICBjZWxsLnNlbGVjdE9yQXBwZW5kKFwiZy5icnVzaC1jb250YWluZXJcIikuY2FsbChicnVzaCk7XHJcbiAgICAgICAgc2VsZi5jbGVhckJydXNoKCk7XHJcblxyXG4gICAgICAgIC8vIENsZWFyIHRoZSBwcmV2aW91c2x5LWFjdGl2ZSBicnVzaCwgaWYgYW55LlxyXG4gICAgICAgIGZ1bmN0aW9uIGJydXNoc3RhcnQocCkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5wbG90LmJydXNoQ2VsbCAhPT0gdGhpcykge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jbGVhckJydXNoKCk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QueC5zY2FsZS5kb21haW4oc2VsZi5wbG90LmRvbWFpbkJ5VmFyaWFibGVbcC54XSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QueS5zY2FsZS5kb21haW4oc2VsZi5wbG90LmRvbWFpbkJ5VmFyaWFibGVbcC55XSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QuYnJ1c2hDZWxsID0gdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSGlnaGxpZ2h0IHRoZSBzZWxlY3RlZCBjaXJjbGVzLlxyXG4gICAgICAgIGZ1bmN0aW9uIGJydXNobW92ZShwKSB7XHJcbiAgICAgICAgICAgIHZhciBlID0gYnJ1c2guZXh0ZW50KCk7XHJcbiAgICAgICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJjaXJjbGVcIikuY2xhc3NlZChcImhpZGRlblwiLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVbMF1bMF0gPiBkW3AueF0gfHwgZFtwLnhdID4gZVsxXVswXVxyXG4gICAgICAgICAgICAgICAgICAgIHx8IGVbMF1bMV0gPiBkW3AueV0gfHwgZFtwLnldID4gZVsxXVsxXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIElmIHRoZSBicnVzaCBpcyBlbXB0eSwgc2VsZWN0IGFsbCBjaXJjbGVzLlxyXG4gICAgICAgIGZ1bmN0aW9uIGJydXNoZW5kKCkge1xyXG4gICAgICAgICAgICBpZiAoYnJ1c2guZW1wdHkoKSkgc2VsZi5zdmdHLnNlbGVjdEFsbChcIi5oaWRkZW5cIikuY2xhc3NlZChcImhpZGRlblwiLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjbGVhckJydXNoKCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGlmKCFzZWxmLnBsb3QuYnJ1c2hDZWxsKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkMy5zZWxlY3Qoc2VsZi5wbG90LmJydXNoQ2VsbCkuY2FsbChzZWxmLnBsb3QuYnJ1c2guY2xlYXIoKSk7XHJcbiAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcIi5oaWRkZW5cIikuY2xhc3NlZChcImhpZGRlblwiLCBmYWxzZSk7XHJcbiAgICAgICAgc2VsZi5wbG90LmJydXNoQ2VsbD1udWxsO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtDaGFydFdpdGhDb2xvckdyb3VwcywgQ2hhcnRXaXRoQ29sb3JHcm91cHNDb25maWd9IGZyb20gXCIuL2NoYXJ0LXdpdGgtY29sb3ItZ3JvdXBzXCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7TGVnZW5kfSBmcm9tIFwiLi9sZWdlbmRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTY2F0dGVyUGxvdENvbmZpZyBleHRlbmRzIENoYXJ0V2l0aENvbG9yR3JvdXBzQ29uZmlne1xyXG5cclxuICAgIHN2Z0NsYXNzPSB0aGlzLmNzc0NsYXNzUHJlZml4KydzY2F0dGVycGxvdCc7XHJcbiAgICBndWlkZXM9IGZhbHNlOyAvL3Nob3cgYXhpcyBndWlkZXNcclxuICAgIHNob3dUb29sdGlwPSB0cnVlOyAvL3Nob3cgdG9vbHRpcCBvbiBkb3QgaG92ZXJcclxuXHJcbiAgICB4PXsvLyBYIGF4aXMgY29uZmlnXHJcbiAgICAgICAgbGFiZWw6ICcnLCAvLyBheGlzIGxhYmVsXHJcbiAgICAgICAga2V5OiAwLFxyXG4gICAgICAgIHZhbHVlOiAoZCwga2V5KSA9PiBkW2tleV0sIC8vIHggdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICBvcmllbnQ6IFwiYm90dG9tXCIsXHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCIsXHJcbiAgICAgICAgZG9tYWluTWFyZ2luOiAwLjA1XHJcbiAgICB9O1xyXG4gICAgeT17Ly8gWSBheGlzIGNvbmZpZ1xyXG4gICAgICAgIGxhYmVsOiAnJywgLy8gYXhpcyBsYWJlbCxcclxuICAgICAgICBrZXk6IDEsXHJcbiAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IGRba2V5XSwgLy8geSB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgIG9yaWVudDogXCJsZWZ0XCIsXHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCIsXHJcbiAgICAgICAgZG9tYWluTWFyZ2luOiAwLjA1XHJcbiAgICB9O1xyXG4gICAgZ3JvdXBzPXtcclxuICAgICAgICBrZXk6IDJcclxuICAgIH07XHJcbiAgICBkb3RSYWRpdXMgPSAyO1xyXG4gICAgdHJhbnNpdGlvbj0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgaWYoY3VzdG9tKXtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTY2F0dGVyUGxvdCBleHRlbmRzIENoYXJ0V2l0aENvbG9yR3JvdXBze1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IFNjYXR0ZXJQbG90Q29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpe1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IFNjYXR0ZXJQbG90Q29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCl7XHJcbiAgICAgICAgc3VwZXIuaW5pdFBsb3QoKTtcclxuICAgICAgICB2YXIgc2VsZj10aGlzO1xyXG5cclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueD17fTtcclxuICAgICAgICB0aGlzLnBsb3QueT17fTtcclxuXHJcbiAgICAgICAgdGhpcy5jb21wdXRlUGxvdFNpemUoKTtcclxuICAgICAgICB0aGlzLnNldHVwWCgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBZKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwWCgpe1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeCA9IHBsb3QueDtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnLng7XHJcblxyXG4gICAgICAgIC8qICpcclxuICAgICAgICAgKiB2YWx1ZSBhY2Nlc3NvciAtIHJldHVybnMgdGhlIHZhbHVlIHRvIGVuY29kZSBmb3IgYSBnaXZlbiBkYXRhIG9iamVjdC5cclxuICAgICAgICAgKiBzY2FsZSAtIG1hcHMgdmFsdWUgdG8gYSB2aXN1YWwgZGlzcGxheSBlbmNvZGluZywgc3VjaCBhcyBhIHBpeGVsIHBvc2l0aW9uLlxyXG4gICAgICAgICAqIG1hcCBmdW5jdGlvbiAtIG1hcHMgZnJvbSBkYXRhIHZhbHVlIHRvIGRpc3BsYXkgdmFsdWVcclxuICAgICAgICAgKiBheGlzIC0gc2V0cyB1cCBheGlzXHJcbiAgICAgICAgICoqL1xyXG4gICAgICAgIHgudmFsdWUgPSBkID0+IGNvbmYudmFsdWUoZCwgY29uZi5rZXkpO1xyXG4gICAgICAgIHguc2NhbGUgPSBkMy5zY2FsZVtjb25mLnNjYWxlXSgpLnJhbmdlKFswLCBwbG90LndpZHRoXSk7XHJcbiAgICAgICAgeC5tYXAgPSBkID0+IHguc2NhbGUoeC52YWx1ZShkKSk7XHJcbiAgICAgICAgeC5heGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh4LnNjYWxlKS5vcmllbnQoY29uZi5vcmllbnQpO1xyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5wbG90Lmdyb3VwZWREYXRhO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGRvbWFpbiA9IFtwYXJzZUZsb2F0KGQzLm1pbihkYXRhLCBzPT5kMy5taW4ocy52YWx1ZXMsIHBsb3QueC52YWx1ZSkpKSwgcGFyc2VGbG9hdChkMy5tYXgoZGF0YSwgcz0+ZDMubWF4KHMudmFsdWVzLCBwbG90LngudmFsdWUpKSldO1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSAoZG9tYWluWzFdLWRvbWFpblswXSkqIGNvbmYuZG9tYWluTWFyZ2luO1xyXG4gICAgICAgIGRvbWFpblswXS09bWFyZ2luO1xyXG4gICAgICAgIGRvbWFpblsxXSs9bWFyZ2luO1xyXG4gICAgICAgIHBsb3QueC5zY2FsZS5kb21haW4oZG9tYWluKTtcclxuICAgICAgICBpZih0aGlzLmNvbmZpZy5ndWlkZXMpIHtcclxuICAgICAgICAgICAgeC5heGlzLnRpY2tTaXplKC1wbG90LmhlaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBZICgpe1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeSA9IHBsb3QueTtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnLnk7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdmFsdWUgYWNjZXNzb3IgLSByZXR1cm5zIHRoZSB2YWx1ZSB0byBlbmNvZGUgZm9yIGEgZ2l2ZW4gZGF0YSBvYmplY3QuXHJcbiAgICAgICAgICogc2NhbGUgLSBtYXBzIHZhbHVlIHRvIGEgdmlzdWFsIGRpc3BsYXkgZW5jb2RpbmcsIHN1Y2ggYXMgYSBwaXhlbCBwb3NpdGlvbi5cclxuICAgICAgICAgKiBtYXAgZnVuY3Rpb24gLSBtYXBzIGZyb20gZGF0YSB2YWx1ZSB0byBkaXNwbGF5IHZhbHVlXHJcbiAgICAgICAgICogYXhpcyAtIHNldHMgdXAgYXhpc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHkudmFsdWUgPSBkID0+IGNvbmYudmFsdWUoZCwgY29uZi5rZXkpO1xyXG4gICAgICAgIHkuc2NhbGUgPSBkMy5zY2FsZVtjb25mLnNjYWxlXSgpLnJhbmdlKFtwbG90LmhlaWdodCwgMF0pO1xyXG4gICAgICAgIHkubWFwID0gZCA9PiB5LnNjYWxlKHkudmFsdWUoZCkpO1xyXG4gICAgICAgIHkuYXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeS5zY2FsZSkub3JpZW50KGNvbmYub3JpZW50KTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5jb25maWcuZ3VpZGVzKXtcclxuICAgICAgICAgICAgeS5heGlzLnRpY2tTaXplKC1wbG90LndpZHRoKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMucGxvdC5ncm91cGVkRGF0YTtcclxuXHJcbiAgICAgICAgdmFyIGRvbWFpbiA9IFtwYXJzZUZsb2F0KGQzLm1pbihkYXRhLCBzPT5kMy5taW4ocy52YWx1ZXMsIHBsb3QueS52YWx1ZSkpKSwgcGFyc2VGbG9hdChkMy5tYXgoZGF0YSwgcz0+ZDMubWF4KHMudmFsdWVzLCBwbG90LnkudmFsdWUpKSldO1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSAoZG9tYWluWzFdLWRvbWFpblswXSkqIGNvbmYuZG9tYWluTWFyZ2luO1xyXG4gICAgICAgIGRvbWFpblswXS09bWFyZ2luO1xyXG4gICAgICAgIGRvbWFpblsxXSs9bWFyZ2luO1xyXG4gICAgICAgIHBsb3QueS5zY2FsZS5kb21haW4oZG9tYWluKTtcclxuICAgICAgICAvLyBwbG90Lnkuc2NhbGUuZG9tYWluKFtkMy5taW4oZGF0YSwgcGxvdC55LnZhbHVlKS0xLCBkMy5tYXgoZGF0YSwgcGxvdC55LnZhbHVlKSsxXSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRyYXdBeGlzWCgpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgYXhpc0NvbmYgPSB0aGlzLmNvbmZpZy54O1xyXG4gICAgICAgIHZhciBheGlzID0gc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIitzZWxmLnByZWZpeENsYXNzKCdheGlzLXgnKStcIi5cIitzZWxmLnByZWZpeENsYXNzKCdheGlzJykrKHNlbGYuY29uZmlnLmd1aWRlcyA/ICcnIDogJy4nK3NlbGYucHJlZml4Q2xhc3MoJ25vLWd1aWRlcycpKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIHBsb3QuaGVpZ2h0ICsgXCIpXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBheGlzVCA9IGF4aXM7XHJcbiAgICAgICAgaWYgKHNlbGYudHJhbnNpdGlvbkVuYWJsZWQoKSkge1xyXG4gICAgICAgICAgICBheGlzVCA9IGF4aXMudHJhbnNpdGlvbigpLmVhc2UoXCJzaW4taW4tb3V0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXhpc1QuY2FsbChwbG90LnguYXhpcyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgYXhpcy5zZWxlY3RPckFwcGVuZChcInRleHQuXCIrc2VsZi5wcmVmaXhDbGFzcygnbGFiZWwnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrIChwbG90LndpZHRoLzIpICtcIixcIisgKHBsb3QubWFyZ2luLmJvdHRvbSkgK1wiKVwiKSAgLy8gdGV4dCBpcyBkcmF3biBvZmYgdGhlIHNjcmVlbiB0b3AgbGVmdCwgbW92ZSBkb3duIGFuZCBvdXQgYW5kIHJvdGF0ZVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiLTFlbVwiKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAudGV4dChheGlzQ29uZi5sYWJlbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRyYXdBeGlzWSgpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgYXhpc0NvbmYgPSB0aGlzLmNvbmZpZy55O1xyXG4gICAgICAgIHZhciBheGlzID0gc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIitzZWxmLnByZWZpeENsYXNzKCdheGlzLXknKStcIi5cIitzZWxmLnByZWZpeENsYXNzKCdheGlzJykrKHNlbGYuY29uZmlnLmd1aWRlcyA/ICcnIDogJy4nK3NlbGYucHJlZml4Q2xhc3MoJ25vLWd1aWRlcycpKSk7XHJcblxyXG4gICAgICAgIHZhciBheGlzVCA9IGF4aXM7XHJcbiAgICAgICAgaWYgKHNlbGYudHJhbnNpdGlvbkVuYWJsZWQoKSkge1xyXG4gICAgICAgICAgICBheGlzVCA9IGF4aXMudHJhbnNpdGlvbigpLmVhc2UoXCJzaW4taW4tb3V0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXhpc1QuY2FsbChwbG90LnkuYXhpcyk7XHJcblxyXG4gICAgICAgIGF4aXMuc2VsZWN0T3JBcHBlbmQoXCJ0ZXh0LlwiK3NlbGYucHJlZml4Q2xhc3MoJ2xhYmVsJykpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyAtcGxvdC5tYXJnaW4ubGVmdCArXCIsXCIrKHBsb3QuaGVpZ2h0LzIpK1wiKXJvdGF0ZSgtOTApXCIpICAvLyB0ZXh0IGlzIGRyYXduIG9mZiB0aGUgc2NyZWVuIHRvcCBsZWZ0LCBtb3ZlIGRvd24gYW5kIG91dCBhbmQgcm90YXRlXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCIxZW1cIilcclxuICAgICAgICAgICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoYXhpc0NvbmYubGFiZWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICB1cGRhdGUobmV3RGF0YSl7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKG5ld0RhdGEpO1xyXG4gICAgICAgIHRoaXMuZHJhd0F4aXNYKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3QXhpc1koKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVEb3RzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHVwZGF0ZURvdHMoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBkYXRhID0gcGxvdC5kYXRhO1xyXG4gICAgICAgIHZhciBsYXllckNsYXNzID0gc2VsZi5wcmVmaXhDbGFzcygnbGF5ZXInKTtcclxuICAgICAgICB2YXIgZG90Q2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKCdkb3QnKTtcclxuICAgICAgICBzZWxmLmRvdHNDb250YWluZXJDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoJ2RvdHMtY29udGFpbmVyJyk7XHJcblxyXG4gICAgICAgIHZhciBkb3RzQ29udGFpbmVyID0gc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIiArIHNlbGYuZG90c0NvbnRhaW5lckNsYXNzKTtcclxuXHJcbiAgICAgICAgdmFyIGxheWVyID0gZG90c0NvbnRhaW5lci5zZWxlY3RBbGwoXCJnLlwiK2xheWVyQ2xhc3MpLmRhdGEocGxvdC5ncm91cGVkRGF0YSk7XHJcblxyXG4gICAgICAgIGxheWVyLmVudGVyKCkuYXBwZW5kU2VsZWN0b3IoXCJnLlwiK2xheWVyQ2xhc3MpO1xyXG5cclxuICAgICAgICB2YXIgZG90cyA9IGxheWVyLnNlbGVjdEFsbCgnLicgKyBkb3RDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEoZD0+ZC52YWx1ZXMpO1xyXG5cclxuICAgICAgICBkb3RzLmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgZG90Q2xhc3MpO1xyXG5cclxuICAgICAgICB2YXIgZG90c1QgPSBkb3RzO1xyXG4gICAgICAgIGlmIChzZWxmLnRyYW5zaXRpb25FbmFibGVkKCkpIHtcclxuICAgICAgICAgICAgZG90c1QgPSBkb3RzLnRyYW5zaXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRvdHNULmF0dHIoXCJyXCIsIHNlbGYuY29uZmlnLmRvdFJhZGl1cylcclxuICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCBwbG90LngubWFwKVxyXG4gICAgICAgICAgICAuYXR0cihcImN5XCIsIHBsb3QueS5tYXApO1xyXG5cclxuICAgICAgICBpZiAocGxvdC50b29sdGlwKSB7XHJcbiAgICAgICAgICAgIGRvdHMub24oXCJtb3VzZW92ZXJcIiwgZCA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IFwiKFwiICsgcGxvdC54LnZhbHVlKGQpICsgXCIsIFwiICsgcGxvdC55LnZhbHVlKGQpICsgXCIpXCI7XHJcbiAgICAgICAgICAgICAgICB2YXIgZ3JvdXAgPSBzZWxmLmNvbmZpZy5ncm91cHMgPyAgc2VsZi5jb25maWcuZ3JvdXBzLnZhbHVlLmNhbGwoc2VsZi5jb25maWcsZCkgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwIHx8IGdyb3VwID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAgPSBwbG90Lmdyb3VwVG9MYWJlbFtncm91cF07XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBcIjxici8+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhYmVsID0gc2VsZi5jb25maWcuZ3JvdXBzLmxhYmVsO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYWJlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sICs9IGxhYmVsICsgXCI6IFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBodG1sICs9IGdyb3VwXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNob3dUb29sdGlwKGh0bWwpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgZCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5oaWRlVG9vbHRpcCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGxvdC5zZXJpZXNDb2xvcikge1xyXG4gICAgICAgICAgICBsYXllci5zdHlsZShcImZpbGxcIiwgcGxvdC5zZXJpZXNDb2xvcilcclxuICAgICAgICB9ZWxzZSBpZihwbG90LmNvbG9yKXtcclxuICAgICAgICAgICAgZG90cy5zdHlsZShcImZpbGxcIiwgcGxvdC5jb2xvcilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRvdHMuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgICAgIGxheWVyLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgIH1cclxufVxyXG4iLCIvKlxuICogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vYmVucmFzbXVzZW4vMTI2MTk3N1xuICogTkFNRVxuICogXG4gKiBzdGF0aXN0aWNzLWRpc3RyaWJ1dGlvbnMuanMgLSBKYXZhU2NyaXB0IGxpYnJhcnkgZm9yIGNhbGN1bGF0aW5nXG4gKiAgIGNyaXRpY2FsIHZhbHVlcyBhbmQgdXBwZXIgcHJvYmFiaWxpdGllcyBvZiBjb21tb24gc3RhdGlzdGljYWxcbiAqICAgZGlzdHJpYnV0aW9uc1xuICogXG4gKiBTWU5PUFNJU1xuICogXG4gKiBcbiAqICAgLy8gQ2hpLXNxdWFyZWQtY3JpdCAoMiBkZWdyZWVzIG9mIGZyZWVkb20sIDk1dGggcGVyY2VudGlsZSA9IDAuMDUgbGV2ZWxcbiAqICAgY2hpc3FyZGlzdHIoMiwgLjA1KVxuICogICBcbiAqICAgLy8gdS1jcml0ICg5NXRoIHBlcmNlbnRpbGUgPSAwLjA1IGxldmVsKVxuICogICB1ZGlzdHIoLjA1KTtcbiAqICAgXG4gKiAgIC8vIHQtY3JpdCAoMSBkZWdyZWUgb2YgZnJlZWRvbSwgOTkuNXRoIHBlcmNlbnRpbGUgPSAwLjAwNSBsZXZlbCkgXG4gKiAgIHRkaXN0cigxLC4wMDUpO1xuICogICBcbiAqICAgLy8gRi1jcml0ICgxIGRlZ3JlZSBvZiBmcmVlZG9tIGluIG51bWVyYXRvciwgMyBkZWdyZWVzIG9mIGZyZWVkb20gXG4gKiAgIC8vICAgICAgICAgaW4gZGVub21pbmF0b3IsIDk5dGggcGVyY2VudGlsZSA9IDAuMDEgbGV2ZWwpXG4gKiAgIGZkaXN0cigxLDMsLjAxKTtcbiAqICAgXG4gKiAgIC8vIHVwcGVyIHByb2JhYmlsaXR5IG9mIHRoZSB1IGRpc3RyaWJ1dGlvbiAodSA9IC0wLjg1KTogUSh1KSA9IDEtRyh1KVxuICogICB1cHJvYigtMC44NSk7XG4gKiAgIFxuICogICAvLyB1cHBlciBwcm9iYWJpbGl0eSBvZiB0aGUgY2hpLXNxdWFyZSBkaXN0cmlidXRpb25cbiAqICAgLy8gKDMgZGVncmVlcyBvZiBmcmVlZG9tLCBjaGktc3F1YXJlZCA9IDYuMjUpOiBRID0gMS1HXG4gKiAgIGNoaXNxcnByb2IoMyw2LjI1KTtcbiAqICAgXG4gKiAgIC8vIHVwcGVyIHByb2JhYmlsaXR5IG9mIHRoZSB0IGRpc3RyaWJ1dGlvblxuICogICAvLyAoMyBkZWdyZWVzIG9mIGZyZWVkb20sIHQgPSA2LjI1MSk6IFEgPSAxLUdcbiAqICAgdHByb2IoMyw2LjI1MSk7XG4gKiAgIFxuICogICAvLyB1cHBlciBwcm9iYWJpbGl0eSBvZiB0aGUgRiBkaXN0cmlidXRpb25cbiAqICAgLy8gKDMgZGVncmVlcyBvZiBmcmVlZG9tIGluIG51bWVyYXRvciwgNSBkZWdyZWVzIG9mIGZyZWVkb20gaW5cbiAqICAgLy8gIGRlbm9taW5hdG9yLCBGID0gNi4yNSk6IFEgPSAxLUdcbiAqICAgZnByb2IoMyw1LC42MjUpO1xuICogXG4gKiBcbiAqICBERVNDUklQVElPTlxuICogXG4gKiBUaGlzIGxpYnJhcnkgY2FsY3VsYXRlcyBwZXJjZW50YWdlIHBvaW50cyAoNSBzaWduaWZpY2FudCBkaWdpdHMpIG9mIHRoZSB1XG4gKiAoc3RhbmRhcmQgbm9ybWFsKSBkaXN0cmlidXRpb24sIHRoZSBzdHVkZW50J3MgdCBkaXN0cmlidXRpb24sIHRoZVxuICogY2hpLXNxdWFyZSBkaXN0cmlidXRpb24gYW5kIHRoZSBGIGRpc3RyaWJ1dGlvbi4gSXQgY2FuIGFsc28gY2FsY3VsYXRlIHRoZVxuICogdXBwZXIgcHJvYmFiaWxpdHkgKDUgc2lnbmlmaWNhbnQgZGlnaXRzKSBvZiB0aGUgdSAoc3RhbmRhcmQgbm9ybWFsKSwgdGhlXG4gKiBjaGktc3F1YXJlLCB0aGUgdCBhbmQgdGhlIEYgZGlzdHJpYnV0aW9uLlxuICogXG4gKiBUaGVzZSBjcml0aWNhbCB2YWx1ZXMgYXJlIG5lZWRlZCB0byBwZXJmb3JtIHN0YXRpc3RpY2FsIHRlc3RzLCBsaWtlIHRoZSB1XG4gKiB0ZXN0LCB0aGUgdCB0ZXN0LCB0aGUgRiB0ZXN0IGFuZCB0aGUgY2hpLXNxdWFyZWQgdGVzdCwgYW5kIHRvIGNhbGN1bGF0ZVxuICogY29uZmlkZW5jZSBpbnRlcnZhbHMuXG4gKiBcbiAqIElmIHlvdSBhcmUgaW50ZXJlc3RlZCBpbiBtb3JlIHByZWNpc2UgYWxnb3JpdGhtcyB5b3UgY291bGQgbG9vayBhdDpcbiAqICAgU3RhdExpYjogaHR0cDovL2xpYi5zdGF0LmNtdS5lZHUvYXBzdGF0LyA7IFxuICogICBBcHBsaWVkIFN0YXRpc3RpY3MgQWxnb3JpdGhtcyBieSBHcmlmZml0aHMsIFAuIGFuZCBIaWxsLCBJLkQuXG4gKiAgICwgRWxsaXMgSG9yd29vZDogQ2hpY2hlc3RlciAoMTk4NSlcbiAqIFxuICogQlVHUyBcbiAqIFxuICogVGhpcyBwb3J0IHdhcyBwcm9kdWNlZCBmcm9tIHRoZSBQZXJsIG1vZHVsZSBTdGF0aXN0aWNzOjpEaXN0cmlidXRpb25zXG4gKiB0aGF0IGhhcyBoYWQgbm8gYnVnIHJlcG9ydHMgaW4gc2V2ZXJhbCB5ZWFycy4gIElmIHlvdSBmaW5kIGEgYnVnIHRoZW5cbiAqIHBsZWFzZSBkb3VibGUtY2hlY2sgdGhhdCBKYXZhU2NyaXB0IGRvZXMgbm90IHRoaW5nIHRoZSBudW1iZXJzIHlvdSBhcmVcbiAqIHBhc3NpbmcgaW4gYXJlIHN0cmluZ3MuICAoWW91IGNhbiBzdWJ0cmFjdCAwIGZyb20gdGhlbSBhcyB5b3UgcGFzcyB0aGVtXG4gKiBpbiBzbyB0aGF0IFwiNVwiIGlzIHByb3Blcmx5IHVuZGVyc3Rvb2QgdG8gYmUgNS4pICBJZiB5b3UgaGF2ZSBwYXNzZWQgaW4gYVxuICogbnVtYmVyIHRoZW4gcGxlYXNlIGNvbnRhY3QgdGhlIGF1dGhvclxuICogXG4gKiBBVVRIT1JcbiAqIFxuICogQmVuIFRpbGx5IDxidGlsbHlAZ21haWwuY29tPlxuICogXG4gKiBPcmlnaW5sIFBlcmwgdmVyc2lvbiBieSBNaWNoYWVsIEtvc3BhY2ggPG1pa2UucGVybEBnbXguYXQ+XG4gKiBcbiAqIE5pY2UgZm9ybWF0aW5nLCBzaW1wbGlmaWNhdGlvbiBhbmQgYnVnIHJlcGFpciBieSBNYXR0aGlhcyBUcmF1dG5lciBLcm9tYW5uXG4gKiA8bXRrQGlkLmNicy5kaz5cbiAqIFxuICogQ09QWVJJR0hUIFxuICogXG4gKiBDb3B5cmlnaHQgMjAwOCBCZW4gVGlsbHkuXG4gKiBcbiAqIFRoaXMgbGlicmFyeSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0XG4gKiB1bmRlciB0aGUgc2FtZSB0ZXJtcyBhcyBQZXJsIGl0c2VsZi4gIFRoaXMgbWVhbnMgdW5kZXIgZWl0aGVyIHRoZSBQZXJsXG4gKiBBcnRpc3RpYyBMaWNlbnNlIG9yIHRoZSBHUEwgdjEgb3IgbGF0ZXIuXG4gKi9cblxudmFyIFNJR05JRklDQU5UID0gNTsgLy8gbnVtYmVyIG9mIHNpZ25pZmljYW50IGRpZ2l0cyB0byBiZSByZXR1cm5lZFxuXG5mdW5jdGlvbiBjaGlzcXJkaXN0ciAoJG4sICRwKSB7XG5cdGlmICgkbiA8PSAwIHx8IE1hdGguYWJzKCRuKSAtIE1hdGguYWJzKGludGVnZXIoJG4pKSAhPSAwKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG46ICRuXFxuXCIpOyAvKiBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9XG5cdGlmICgkcCA8PSAwIHx8ICRwID4gMSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBwOiAkcFxcblwiKTsgXG5cdH1cblx0cmV0dXJuIHByZWNpc2lvbl9zdHJpbmcoX3N1YmNoaXNxcigkbi0wLCAkcC0wKSk7XG59XG5cbmZ1bmN0aW9uIHVkaXN0ciAoJHApIHtcblx0aWYgKCRwID4gMSB8fCAkcCA8PSAwKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIHA6ICRwXFxuXCIpO1xuXHR9XG5cdHJldHVybiBwcmVjaXNpb25fc3RyaW5nKF9zdWJ1KCRwLTApKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRkaXN0ciAoJG4sICRwKSB7XG5cdGlmICgkbiA8PSAwIHx8IE1hdGguYWJzKCRuKSAtIE1hdGguYWJzKGludGVnZXIoJG4pKSAhPSAwKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG46ICRuXFxuXCIpO1xuXHR9XG5cdGlmICgkcCA8PSAwIHx8ICRwID49IDEpIHtcblx0XHR0aHJvdyhcIkludmFsaWQgcDogJHBcXG5cIik7XG5cdH1cblx0cmV0dXJuIHByZWNpc2lvbl9zdHJpbmcoX3N1YnQoJG4tMCwgJHAtMCkpO1xufVxuXG5mdW5jdGlvbiBmZGlzdHIgKCRuLCAkbSwgJHApIHtcblx0aWYgKCgkbjw9MCkgfHwgKChNYXRoLmFicygkbiktKE1hdGguYWJzKGludGVnZXIoJG4pKSkpIT0wKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBuOiAkblxcblwiKTsgLyogZmlyc3QgZGVncmVlIG9mIGZyZWVkb20gKi9cblx0fVxuXHRpZiAoKCRtPD0wKSB8fCAoKE1hdGguYWJzKCRtKS0oTWF0aC5hYnMoaW50ZWdlcigkbSkpKSkhPTApKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG06ICRtXFxuXCIpOyAvKiBzZWNvbmQgZGVncmVlIG9mIGZyZWVkb20gKi9cblx0fVxuXHRpZiAoKCRwPD0wKSB8fCAoJHA+MSkpIHtcblx0XHR0aHJvdyhcIkludmFsaWQgcDogJHBcXG5cIik7XG5cdH1cblx0cmV0dXJuIHByZWNpc2lvbl9zdHJpbmcoX3N1YmYoJG4tMCwgJG0tMCwgJHAtMCkpO1xufVxuXG5mdW5jdGlvbiB1cHJvYiAoJHgpIHtcblx0cmV0dXJuIHByZWNpc2lvbl9zdHJpbmcoX3N1YnVwcm9iKCR4LTApKTtcbn1cblxuZnVuY3Rpb24gY2hpc3FycHJvYiAoJG4sJHgpIHtcblx0aWYgKCgkbiA8PSAwKSB8fCAoKE1hdGguYWJzKCRuKSAtIChNYXRoLmFicyhpbnRlZ2VyKCRuKSkpKSAhPSAwKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBuOiAkblxcblwiKTsgLyogZGVncmVlIG9mIGZyZWVkb20gKi9cblx0fVxuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3ViY2hpc3FycHJvYigkbi0wLCAkeC0wKSk7XG59XG5cbmZ1bmN0aW9uIHRwcm9iICgkbiwgJHgpIHtcblx0aWYgKCgkbiA8PSAwKSB8fCAoKE1hdGguYWJzKCRuKSAtIE1hdGguYWJzKGludGVnZXIoJG4pKSkgIT0wKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBuOiAkblxcblwiKTsgLyogZGVncmVlIG9mIGZyZWVkb20gKi9cblx0fVxuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3VidHByb2IoJG4tMCwgJHgtMCkpO1xufVxuXG5mdW5jdGlvbiBmcHJvYiAoJG4sICRtLCAkeCkge1xuXHRpZiAoKCRuPD0wKSB8fCAoKE1hdGguYWJzKCRuKS0oTWF0aC5hYnMoaW50ZWdlcigkbikpKSkhPTApKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG46ICRuXFxuXCIpOyAvKiBmaXJzdCBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9XG5cdGlmICgoJG08PTApIHx8ICgoTWF0aC5hYnMoJG0pLShNYXRoLmFicyhpbnRlZ2VyKCRtKSkpKSE9MCkpIHtcblx0XHR0aHJvdyhcIkludmFsaWQgbTogJG1cXG5cIik7IC8qIHNlY29uZCBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9IFxuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3ViZnByb2IoJG4tMCwgJG0tMCwgJHgtMCkpO1xufVxuXG5cbmZ1bmN0aW9uIF9zdWJmcHJvYiAoJG4sICRtLCAkeCkge1xuXHR2YXIgJHA7XG5cblx0aWYgKCR4PD0wKSB7XG5cdFx0JHA9MTtcblx0fSBlbHNlIGlmICgkbSAlIDIgPT0gMCkge1xuXHRcdHZhciAkeiA9ICRtIC8gKCRtICsgJG4gKiAkeCk7XG5cdFx0dmFyICRhID0gMTtcblx0XHRmb3IgKHZhciAkaSA9ICRtIC0gMjsgJGkgPj0gMjsgJGkgLT0gMikge1xuXHRcdFx0JGEgPSAxICsgKCRuICsgJGkgLSAyKSAvICRpICogJHogKiAkYTtcblx0XHR9XG5cdFx0JHAgPSAxIC0gTWF0aC5wb3coKDEgLSAkeiksICgkbiAvIDIpICogJGEpO1xuXHR9IGVsc2UgaWYgKCRuICUgMiA9PSAwKSB7XG5cdFx0dmFyICR6ID0gJG4gKiAkeCAvICgkbSArICRuICogJHgpO1xuXHRcdHZhciAkYSA9IDE7XG5cdFx0Zm9yICh2YXIgJGkgPSAkbiAtIDI7ICRpID49IDI7ICRpIC09IDIpIHtcblx0XHRcdCRhID0gMSArICgkbSArICRpIC0gMikgLyAkaSAqICR6ICogJGE7XG5cdFx0fVxuXHRcdCRwID0gTWF0aC5wb3coKDEgLSAkeiksICgkbSAvIDIpKSAqICRhO1xuXHR9IGVsc2Uge1xuXHRcdHZhciAkeSA9IE1hdGguYXRhbjIoTWF0aC5zcXJ0KCRuICogJHggLyAkbSksIDEpO1xuXHRcdHZhciAkeiA9IE1hdGgucG93KE1hdGguc2luKCR5KSwgMik7XG5cdFx0dmFyICRhID0gKCRuID09IDEpID8gMCA6IDE7XG5cdFx0Zm9yICh2YXIgJGkgPSAkbiAtIDI7ICRpID49IDM7ICRpIC09IDIpIHtcblx0XHRcdCRhID0gMSArICgkbSArICRpIC0gMikgLyAkaSAqICR6ICogJGE7XG5cdFx0fSBcblx0XHR2YXIgJGIgPSBNYXRoLlBJO1xuXHRcdGZvciAodmFyICRpID0gMjsgJGkgPD0gJG0gLSAxOyAkaSArPSAyKSB7XG5cdFx0XHQkYiAqPSAoJGkgLSAxKSAvICRpO1xuXHRcdH1cblx0XHR2YXIgJHAxID0gMiAvICRiICogTWF0aC5zaW4oJHkpICogTWF0aC5wb3coTWF0aC5jb3MoJHkpLCAkbSkgKiAkYTtcblxuXHRcdCR6ID0gTWF0aC5wb3coTWF0aC5jb3MoJHkpLCAyKTtcblx0XHQkYSA9ICgkbSA9PSAxKSA/IDAgOiAxO1xuXHRcdGZvciAodmFyICRpID0gJG0tMjsgJGkgPj0gMzsgJGkgLT0gMikge1xuXHRcdFx0JGEgPSAxICsgKCRpIC0gMSkgLyAkaSAqICR6ICogJGE7XG5cdFx0fVxuXHRcdCRwID0gbWF4KDAsICRwMSArIDEgLSAyICogJHkgLyBNYXRoLlBJXG5cdFx0XHQtIDIgLyBNYXRoLlBJICogTWF0aC5zaW4oJHkpICogTWF0aC5jb3MoJHkpICogJGEpO1xuXHR9XG5cdHJldHVybiAkcDtcbn1cblxuXG5mdW5jdGlvbiBfc3ViY2hpc3FycHJvYiAoJG4sJHgpIHtcblx0dmFyICRwO1xuXG5cdGlmICgkeCA8PSAwKSB7XG5cdFx0JHAgPSAxO1xuXHR9IGVsc2UgaWYgKCRuID4gMTAwKSB7XG5cdFx0JHAgPSBfc3VidXByb2IoKE1hdGgucG93KCgkeCAvICRuKSwgMS8zKVxuXHRcdFx0XHQtICgxIC0gMi85LyRuKSkgLyBNYXRoLnNxcnQoMi85LyRuKSk7XG5cdH0gZWxzZSBpZiAoJHggPiA0MDApIHtcblx0XHQkcCA9IDA7XG5cdH0gZWxzZSB7ICAgXG5cdFx0dmFyICRhO1xuICAgICAgICAgICAgICAgIHZhciAkaTtcbiAgICAgICAgICAgICAgICB2YXIgJGkxO1xuXHRcdGlmICgoJG4gJSAyKSAhPSAwKSB7XG5cdFx0XHQkcCA9IDIgKiBfc3VidXByb2IoTWF0aC5zcXJ0KCR4KSk7XG5cdFx0XHQkYSA9IE1hdGguc3FydCgyL01hdGguUEkpICogTWF0aC5leHAoLSR4LzIpIC8gTWF0aC5zcXJ0KCR4KTtcblx0XHRcdCRpMSA9IDE7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRwID0gJGEgPSBNYXRoLmV4cCgtJHgvMik7XG5cdFx0XHQkaTEgPSAyO1xuXHRcdH1cblxuXHRcdGZvciAoJGkgPSAkaTE7ICRpIDw9ICgkbi0yKTsgJGkgKz0gMikge1xuXHRcdFx0JGEgKj0gJHggLyAkaTtcblx0XHRcdCRwICs9ICRhO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gJHA7XG59XG5cbmZ1bmN0aW9uIF9zdWJ1ICgkcCkge1xuXHR2YXIgJHkgPSAtTWF0aC5sb2coNCAqICRwICogKDEgLSAkcCkpO1xuXHR2YXIgJHggPSBNYXRoLnNxcnQoXG5cdFx0JHkgKiAoMS41NzA3OTYyODhcblx0XHQgICsgJHkgKiAoLjAzNzA2OTg3OTA2XG5cdFx0ICBcdCsgJHkgKiAoLS44MzY0MzUzNTg5RS0zXG5cdFx0XHQgICsgJHkgKigtLjIyNTA5NDcxNzZFLTNcblx0XHRcdCAgXHQrICR5ICogKC42ODQxMjE4Mjk5RS01XG5cdFx0XHRcdCAgKyAkeSAqICgwLjU4MjQyMzg1MTVFLTVcblx0XHRcdFx0XHQrICR5ICogKC0uMTA0NTI3NDk3RS01XG5cdFx0XHRcdFx0ICArICR5ICogKC44MzYwOTM3MDE3RS03XG5cdFx0XHRcdFx0XHQrICR5ICogKC0uMzIzMTA4MTI3N0UtOFxuXHRcdFx0XHRcdFx0ICArICR5ICogKC4zNjU3NzYzMDM2RS0xMFxuXHRcdFx0XHRcdFx0XHQrICR5ICouNjkzNjIzMzk4MkUtMTIpKSkpKSkpKSkpKTtcblx0aWYgKCRwPi41KVxuICAgICAgICAgICAgICAgICR4ID0gLSR4O1xuXHRyZXR1cm4gJHg7XG59XG5cbmZ1bmN0aW9uIF9zdWJ1cHJvYiAoJHgpIHtcblx0dmFyICRwID0gMDsgLyogaWYgKCRhYnN4ID4gMTAwKSAqL1xuXHR2YXIgJGFic3ggPSBNYXRoLmFicygkeCk7XG5cblx0aWYgKCRhYnN4IDwgMS45KSB7XG5cdFx0JHAgPSBNYXRoLnBvdygoMSArXG5cdFx0XHQkYWJzeCAqICguMDQ5ODY3MzQ3XG5cdFx0XHQgICsgJGFic3ggKiAoLjAyMTE0MTAwNjFcblx0XHRcdCAgXHQrICRhYnN4ICogKC4wMDMyNzc2MjYzXG5cdFx0XHRcdCAgKyAkYWJzeCAqICguMDAwMDM4MDAzNlxuXHRcdFx0XHRcdCsgJGFic3ggKiAoLjAwMDA0ODg5MDZcblx0XHRcdFx0XHQgICsgJGFic3ggKiAuMDAwMDA1MzgzKSkpKSkpLCAtMTYpLzI7XG5cdH0gZWxzZSBpZiAoJGFic3ggPD0gMTAwKSB7XG5cdFx0Zm9yICh2YXIgJGkgPSAxODsgJGkgPj0gMTsgJGktLSkge1xuXHRcdFx0JHAgPSAkaSAvICgkYWJzeCArICRwKTtcblx0XHR9XG5cdFx0JHAgPSBNYXRoLmV4cCgtLjUgKiAkYWJzeCAqICRhYnN4KSBcblx0XHRcdC8gTWF0aC5zcXJ0KDIgKiBNYXRoLlBJKSAvICgkYWJzeCArICRwKTtcblx0fVxuXG5cdGlmICgkeDwwKVxuICAgICAgICBcdCRwID0gMSAtICRwO1xuXHRyZXR1cm4gJHA7XG59XG5cbiAgIFxuZnVuY3Rpb24gX3N1YnQgKCRuLCAkcCkge1xuXG5cdGlmICgkcCA+PSAxIHx8ICRwIDw9IDApIHtcblx0XHR0aHJvdyhcIkludmFsaWQgcDogJHBcXG5cIik7XG5cdH1cblxuXHRpZiAoJHAgPT0gMC41KSB7XG5cdFx0cmV0dXJuIDA7XG5cdH0gZWxzZSBpZiAoJHAgPCAwLjUpIHtcblx0XHRyZXR1cm4gLSBfc3VidCgkbiwgMSAtICRwKTtcblx0fVxuXG5cdHZhciAkdSA9IF9zdWJ1KCRwKTtcblx0dmFyICR1MiA9IE1hdGgucG93KCR1LCAyKTtcblxuXHR2YXIgJGEgPSAoJHUyICsgMSkgLyA0O1xuXHR2YXIgJGIgPSAoKDUgKiAkdTIgKyAxNikgKiAkdTIgKyAzKSAvIDk2O1xuXHR2YXIgJGMgPSAoKCgzICogJHUyICsgMTkpICogJHUyICsgMTcpICogJHUyIC0gMTUpIC8gMzg0O1xuXHR2YXIgJGQgPSAoKCgoNzkgKiAkdTIgKyA3NzYpICogJHUyICsgMTQ4MikgKiAkdTIgLSAxOTIwKSAqICR1MiAtIDk0NSkgXG5cdFx0XHRcdC8gOTIxNjA7XG5cdHZhciAkZSA9ICgoKCgoMjcgKiAkdTIgKyAzMzkpICogJHUyICsgOTMwKSAqICR1MiAtIDE3ODIpICogJHUyIC0gNzY1KSAqICR1MlxuXHRcdFx0KyAxNzk1NSkgLyAzNjg2NDA7XG5cblx0dmFyICR4ID0gJHUgKiAoMSArICgkYSArICgkYiArICgkYyArICgkZCArICRlIC8gJG4pIC8gJG4pIC8gJG4pIC8gJG4pIC8gJG4pO1xuXG5cdGlmICgkbiA8PSBNYXRoLnBvdyhsb2cxMCgkcCksIDIpICsgMykge1xuXHRcdHZhciAkcm91bmQ7XG5cdFx0ZG8geyBcblx0XHRcdHZhciAkcDEgPSBfc3VidHByb2IoJG4sICR4KTtcblx0XHRcdHZhciAkbjEgPSAkbiArIDE7XG5cdFx0XHR2YXIgJGRlbHRhID0gKCRwMSAtICRwKSBcblx0XHRcdFx0LyBNYXRoLmV4cCgoJG4xICogTWF0aC5sb2coJG4xIC8gKCRuICsgJHggKiAkeCkpIFxuXHRcdFx0XHRcdCsgTWF0aC5sb2coJG4vJG4xLzIvTWF0aC5QSSkgLSAxIFxuXHRcdFx0XHRcdCsgKDEvJG4xIC0gMS8kbikgLyA2KSAvIDIpO1xuXHRcdFx0JHggKz0gJGRlbHRhO1xuXHRcdFx0JHJvdW5kID0gcm91bmRfdG9fcHJlY2lzaW9uKCRkZWx0YSwgTWF0aC5hYnMoaW50ZWdlcihsb2cxMChNYXRoLmFicygkeCkpLTQpKSk7XG5cdFx0fSB3aGlsZSAoKCR4KSAmJiAoJHJvdW5kICE9IDApKTtcblx0fVxuXHRyZXR1cm4gJHg7XG59XG5cbmZ1bmN0aW9uIF9zdWJ0cHJvYiAoJG4sICR4KSB7XG5cblx0dmFyICRhO1xuICAgICAgICB2YXIgJGI7XG5cdHZhciAkdyA9IE1hdGguYXRhbjIoJHggLyBNYXRoLnNxcnQoJG4pLCAxKTtcblx0dmFyICR6ID0gTWF0aC5wb3coTWF0aC5jb3MoJHcpLCAyKTtcblx0dmFyICR5ID0gMTtcblxuXHRmb3IgKHZhciAkaSA9ICRuLTI7ICRpID49IDI7ICRpIC09IDIpIHtcblx0XHQkeSA9IDEgKyAoJGktMSkgLyAkaSAqICR6ICogJHk7XG5cdH0gXG5cblx0aWYgKCRuICUgMiA9PSAwKSB7XG5cdFx0JGEgPSBNYXRoLnNpbigkdykvMjtcblx0XHQkYiA9IC41O1xuXHR9IGVsc2Uge1xuXHRcdCRhID0gKCRuID09IDEpID8gMCA6IE1hdGguc2luKCR3KSpNYXRoLmNvcygkdykvTWF0aC5QSTtcblx0XHQkYj0gLjUgKyAkdy9NYXRoLlBJO1xuXHR9XG5cdHJldHVybiBtYXgoMCwgMSAtICRiIC0gJGEgKiAkeSk7XG59XG5cbmZ1bmN0aW9uIF9zdWJmICgkbiwgJG0sICRwKSB7XG5cdHZhciAkeDtcblxuXHRpZiAoJHAgPj0gMSB8fCAkcCA8PSAwKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIHA6ICRwXFxuXCIpO1xuXHR9XG5cblx0aWYgKCRwID09IDEpIHtcblx0XHQkeCA9IDA7XG5cdH0gZWxzZSBpZiAoJG0gPT0gMSkge1xuXHRcdCR4ID0gMSAvIE1hdGgucG93KF9zdWJ0KCRuLCAwLjUgLSAkcCAvIDIpLCAyKTtcblx0fSBlbHNlIGlmICgkbiA9PSAxKSB7XG5cdFx0JHggPSBNYXRoLnBvdyhfc3VidCgkbSwgJHAvMiksIDIpO1xuXHR9IGVsc2UgaWYgKCRtID09IDIpIHtcblx0XHR2YXIgJHUgPSBfc3ViY2hpc3FyKCRtLCAxIC0gJHApO1xuXHRcdHZhciAkYSA9ICRtIC0gMjtcblx0XHQkeCA9IDEgLyAoJHUgLyAkbSAqICgxICtcblx0XHRcdCgoJHUgLSAkYSkgLyAyICtcblx0XHRcdFx0KCgoNCAqICR1IC0gMTEgKiAkYSkgKiAkdSArICRhICogKDcgKiAkbSAtIDEwKSkgLyAyNCArXG5cdFx0XHRcdFx0KCgoMiAqICR1IC0gMTAgKiAkYSkgKiAkdSArICRhICogKDE3ICogJG0gLSAyNikpICogJHVcblx0XHRcdFx0XHRcdC0gJGEgKiAkYSAqICg5ICogJG0gLSA2KVxuXHRcdFx0XHRcdCkvNDgvJG5cblx0XHRcdFx0KS8kblxuXHRcdFx0KS8kbikpO1xuXHR9IGVsc2UgaWYgKCRuID4gJG0pIHtcblx0XHQkeCA9IDEgLyBfc3ViZjIoJG0sICRuLCAxIC0gJHApXG5cdH0gZWxzZSB7XG5cdFx0JHggPSBfc3ViZjIoJG4sICRtLCAkcClcblx0fVxuXHRyZXR1cm4gJHg7XG59XG5cbmZ1bmN0aW9uIF9zdWJmMiAoJG4sICRtLCAkcCkge1xuXHR2YXIgJHUgPSBfc3ViY2hpc3FyKCRuLCAkcCk7XG5cdHZhciAkbjIgPSAkbiAtIDI7XG5cdHZhciAkeCA9ICR1IC8gJG4gKiBcblx0XHQoMSArIFxuXHRcdFx0KCgkdSAtICRuMikgLyAyICsgXG5cdFx0XHRcdCgoKDQgKiAkdSAtIDExICogJG4yKSAqICR1ICsgJG4yICogKDcgKiAkbiAtIDEwKSkgLyAyNCArIFxuXHRcdFx0XHRcdCgoKDIgKiAkdSAtIDEwICogJG4yKSAqICR1ICsgJG4yICogKDE3ICogJG4gLSAyNikpICogJHUgXG5cdFx0XHRcdFx0XHQtICRuMiAqICRuMiAqICg5ICogJG4gLSA2KSkgLyA0OCAvICRtKSAvICRtKSAvICRtKTtcblx0dmFyICRkZWx0YTtcblx0ZG8ge1xuXHRcdHZhciAkeiA9IE1hdGguZXhwKFxuXHRcdFx0KCgkbiskbSkgKiBNYXRoLmxvZygoJG4rJG0pIC8gKCRuICogJHggKyAkbSkpIFxuXHRcdFx0XHQrICgkbiAtIDIpICogTWF0aC5sb2coJHgpXG5cdFx0XHRcdCsgTWF0aC5sb2coJG4gKiAkbSAvICgkbiskbSkpXG5cdFx0XHRcdC0gTWF0aC5sb2coNCAqIE1hdGguUEkpXG5cdFx0XHRcdC0gKDEvJG4gICsgMS8kbSAtIDEvKCRuKyRtKSkvNlxuXHRcdFx0KS8yKTtcblx0XHQkZGVsdGEgPSAoX3N1YmZwcm9iKCRuLCAkbSwgJHgpIC0gJHApIC8gJHo7XG5cdFx0JHggKz0gJGRlbHRhO1xuXHR9IHdoaWxlIChNYXRoLmFicygkZGVsdGEpPjNlLTQpO1xuXHRyZXR1cm4gJHg7XG59XG5cbmZ1bmN0aW9uIF9zdWJjaGlzcXIgKCRuLCAkcCkge1xuXHR2YXIgJHg7XG5cblx0aWYgKCgkcCA+IDEpIHx8ICgkcCA8PSAwKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBwOiAkcFxcblwiKTtcblx0fSBlbHNlIGlmICgkcCA9PSAxKXtcblx0XHQkeCA9IDA7XG5cdH0gZWxzZSBpZiAoJG4gPT0gMSkge1xuXHRcdCR4ID0gTWF0aC5wb3coX3N1YnUoJHAgLyAyKSwgMik7XG5cdH0gZWxzZSBpZiAoJG4gPT0gMikge1xuXHRcdCR4ID0gLTIgKiBNYXRoLmxvZygkcCk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyICR1ID0gX3N1YnUoJHApO1xuXHRcdHZhciAkdTIgPSAkdSAqICR1O1xuXG5cdFx0JHggPSBtYXgoMCwgJG4gKyBNYXRoLnNxcnQoMiAqICRuKSAqICR1IFxuXHRcdFx0KyAyLzMgKiAoJHUyIC0gMSlcblx0XHRcdCsgJHUgKiAoJHUyIC0gNykgLyA5IC8gTWF0aC5zcXJ0KDIgKiAkbilcblx0XHRcdC0gMi80MDUgLyAkbiAqICgkdTIgKiAoMyAqJHUyICsgNykgLSAxNikpO1xuXG5cdFx0aWYgKCRuIDw9IDEwMCkge1xuXHRcdFx0dmFyICR4MDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkcDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJHo7XG5cdFx0XHRkbyB7XG5cdFx0XHRcdCR4MCA9ICR4O1xuXHRcdFx0XHRpZiAoJHggPCAwKSB7XG5cdFx0XHRcdFx0JHAxID0gMTtcblx0XHRcdFx0fSBlbHNlIGlmICgkbj4xMDApIHtcblx0XHRcdFx0XHQkcDEgPSBfc3VidXByb2IoKE1hdGgucG93KCgkeCAvICRuKSwgKDEvMykpIC0gKDEgLSAyLzkvJG4pKVxuXHRcdFx0XHRcdFx0LyBNYXRoLnNxcnQoMi85LyRuKSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoJHg+NDAwKSB7XG5cdFx0XHRcdFx0JHAxID0gMDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YXIgJGkwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRhO1xuXHRcdFx0XHRcdGlmICgoJG4gJSAyKSAhPSAwKSB7XG5cdFx0XHRcdFx0XHQkcDEgPSAyICogX3N1YnVwcm9iKE1hdGguc3FydCgkeCkpO1xuXHRcdFx0XHRcdFx0JGEgPSBNYXRoLnNxcnQoMi9NYXRoLlBJKSAqIE1hdGguZXhwKC0keC8yKSAvIE1hdGguc3FydCgkeCk7XG5cdFx0XHRcdFx0XHQkaTAgPSAxO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkcDEgPSAkYSA9IE1hdGguZXhwKC0keC8yKTtcblx0XHRcdFx0XHRcdCRpMCA9IDI7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Zm9yICh2YXIgJGkgPSAkaTA7ICRpIDw9ICRuLTI7ICRpICs9IDIpIHtcblx0XHRcdFx0XHRcdCRhICo9ICR4IC8gJGk7XG5cdFx0XHRcdFx0XHQkcDEgKz0gJGE7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdCR6ID0gTWF0aC5leHAoKCgkbi0xKSAqIE1hdGgubG9nKCR4LyRuKSAtIE1hdGgubG9nKDQqTWF0aC5QSSokeCkgXG5cdFx0XHRcdFx0KyAkbiAtICR4IC0gMS8kbi82KSAvIDIpO1xuXHRcdFx0XHQkeCArPSAoJHAxIC0gJHApIC8gJHo7XG5cdFx0XHRcdCR4ID0gcm91bmRfdG9fcHJlY2lzaW9uKCR4LCA1KTtcblx0XHRcdH0gd2hpbGUgKCgkbiA8IDMxKSAmJiAoTWF0aC5hYnMoJHgwIC0gJHgpID4gMWUtNCkpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gJHg7XG59XG5cbmZ1bmN0aW9uIGxvZzEwICgkbikge1xuXHRyZXR1cm4gTWF0aC5sb2coJG4pIC8gTWF0aC5sb2coMTApO1xufVxuIFxuZnVuY3Rpb24gbWF4ICgpIHtcblx0dmFyICRtYXggPSBhcmd1bWVudHNbMF07XG5cdGZvciAodmFyICRpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICgkbWF4IDwgYXJndW1lbnRzWyRpXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICRtYXggPSBhcmd1bWVudHNbJGldO1xuXHR9XHRcblx0cmV0dXJuICRtYXg7XG59XG5cbmZ1bmN0aW9uIG1pbiAoKSB7XG5cdHZhciAkbWluID0gYXJndW1lbnRzWzBdO1xuXHRmb3IgKHZhciAkaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoJG1pbiA+IGFyZ3VtZW50c1skaV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAkbWluID0gYXJndW1lbnRzWyRpXTtcblx0fVxuXHRyZXR1cm4gJG1pbjtcbn1cblxuZnVuY3Rpb24gcHJlY2lzaW9uICgkeCkge1xuXHRyZXR1cm4gTWF0aC5hYnMoaW50ZWdlcihsb2cxMChNYXRoLmFicygkeCkpIC0gU0lHTklGSUNBTlQpKTtcbn1cblxuZnVuY3Rpb24gcHJlY2lzaW9uX3N0cmluZyAoJHgpIHtcblx0aWYgKCR4KSB7XG5cdFx0cmV0dXJuIHJvdW5kX3RvX3ByZWNpc2lvbigkeCwgcHJlY2lzaW9uKCR4KSk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIFwiMFwiO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJvdW5kX3RvX3ByZWNpc2lvbiAoJHgsICRwKSB7XG4gICAgICAgICR4ID0gJHggKiBNYXRoLnBvdygxMCwgJHApO1xuICAgICAgICAkeCA9IE1hdGgucm91bmQoJHgpO1xuICAgICAgICByZXR1cm4gJHggLyBNYXRoLnBvdygxMCwgJHApO1xufVxuXG5mdW5jdGlvbiBpbnRlZ2VyICgkaSkge1xuICAgICAgICBpZiAoJGkgPiAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKCRpKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwoJGkpO1xufSIsImltcG9ydCB7dGRpc3RyfSBmcm9tIFwiLi9zdGF0aXN0aWNzLWRpc3RyaWJ1dGlvbnNcIlxyXG5cclxudmFyIHN1ID0gbW9kdWxlLmV4cG9ydHMuU3RhdGlzdGljc1V0aWxzID17fTtcclxuc3Uuc2FtcGxlQ29ycmVsYXRpb24gPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy9zYW1wbGVfY29ycmVsYXRpb24nKTtcclxuc3UubGluZWFyUmVncmVzc2lvbiA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL2xpbmVhcl9yZWdyZXNzaW9uJyk7XHJcbnN1LmxpbmVhclJlZ3Jlc3Npb25MaW5lID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvbGluZWFyX3JlZ3Jlc3Npb25fbGluZScpO1xyXG5zdS5lcnJvckZ1bmN0aW9uID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvZXJyb3JfZnVuY3Rpb24nKTtcclxuc3Uuc3RhbmRhcmREZXZpYXRpb24gPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy9zdGFuZGFyZF9kZXZpYXRpb24nKTtcclxuc3Uuc2FtcGxlU3RhbmRhcmREZXZpYXRpb24gPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy9zYW1wbGVfc3RhbmRhcmRfZGV2aWF0aW9uJyk7XHJcbnN1LnZhcmlhbmNlID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvdmFyaWFuY2UnKTtcclxuc3UubWVhbiA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL21lYW4nKTtcclxuc3UuelNjb3JlID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvel9zY29yZScpO1xyXG5zdS5zdGFuZGFyZEVycm9yPSBhcnIgPT4gTWF0aC5zcXJ0KHN1LnZhcmlhbmNlKGFycikvKGFyci5sZW5ndGgtMSkpO1xyXG5zdS5xdWFudGlsZSA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL3F1YW50aWxlJyk7XHJcblxyXG5zdS50VmFsdWU9IChkZWdyZWVzT2ZGcmVlZG9tLCBjcml0aWNhbFByb2JhYmlsaXR5KSA9PiB7IC8vYXMgaW4gaHR0cDovL3N0YXR0cmVrLmNvbS9vbmxpbmUtY2FsY3VsYXRvci90LWRpc3RyaWJ1dGlvbi5hc3B4XHJcbiAgICByZXR1cm4gdGRpc3RyKGRlZ3JlZXNPZkZyZWVkb20sIGNyaXRpY2FsUHJvYmFiaWxpdHkpO1xyXG59OyIsImV4cG9ydCBjbGFzcyBVdGlscyB7XHJcbiAgICBzdGF0aWMgU1FSVF8yID0gMS40MTQyMTM1NjIzNztcclxuICAgIC8vIHVzYWdlIGV4YW1wbGUgZGVlcEV4dGVuZCh7fSwgb2JqQSwgb2JqQik7ID0+IHNob3VsZCB3b3JrIHNpbWlsYXIgdG8gJC5leHRlbmQodHJ1ZSwge30sIG9iakEsIG9iakIpO1xyXG4gICAgc3RhdGljIGRlZXBFeHRlbmQob3V0KSB7XHJcblxyXG4gICAgICAgIHZhciB1dGlscyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGVtcHR5T3V0ID0ge307XHJcblxyXG5cclxuICAgICAgICBpZiAoIW91dCAmJiBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBBcnJheS5pc0FycmF5KGFyZ3VtZW50c1sxXSkpIHtcclxuICAgICAgICAgICAgb3V0ID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG91dCA9IG91dCB8fCB7fTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgaWYgKCFzb3VyY2UpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgIGlmICghc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheShvdXRba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXNPYmplY3QgPSB1dGlscy5pc09iamVjdChvdXRba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3JjT2JqID0gdXRpbHMuaXNPYmplY3Qoc291cmNlW2tleV0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpc09iamVjdCAmJiAhaXNBcnJheSAmJiBzcmNPYmopIHtcclxuICAgICAgICAgICAgICAgICAgICB1dGlscy5kZWVwRXh0ZW5kKG91dFtrZXldLCBzb3VyY2Vba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dFtrZXldID0gc291cmNlW2tleV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBtZXJnZURlZXAodGFyZ2V0LCBzb3VyY2UpIHtcclxuICAgICAgICBsZXQgb3V0cHV0ID0gT2JqZWN0LmFzc2lnbih7fSwgdGFyZ2V0KTtcclxuICAgICAgICBpZiAoVXRpbHMuaXNPYmplY3ROb3RBcnJheSh0YXJnZXQpICYmIFV0aWxzLmlzT2JqZWN0Tm90QXJyYXkoc291cmNlKSkge1xyXG4gICAgICAgICAgICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChVdGlscy5pc09iamVjdE5vdEFycmF5KHNvdXJjZVtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKGtleSBpbiB0YXJnZXQpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKG91dHB1dCwge1trZXldOiBzb3VyY2Vba2V5XX0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0W2tleV0gPSBVdGlscy5tZXJnZURlZXAodGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihvdXRwdXQsIHtba2V5XTogc291cmNlW2tleV19KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNyb3NzKGEsIGIpIHtcclxuICAgICAgICB2YXIgYyA9IFtdLCBuID0gYS5sZW5ndGgsIG0gPSBiLmxlbmd0aCwgaSwgajtcclxuICAgICAgICBmb3IgKGkgPSAtMTsgKytpIDwgbjspIGZvciAoaiA9IC0xOyArK2ogPCBtOykgYy5wdXNoKHt4OiBhW2ldLCBpOiBpLCB5OiBiW2pdLCBqOiBqfSk7XHJcbiAgICAgICAgcmV0dXJuIGM7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBpbmZlclZhcmlhYmxlcyhkYXRhLCBncm91cEtleSwgaW5jbHVkZUdyb3VwKSB7XHJcbiAgICAgICAgdmFyIHJlcyA9IFtdO1xyXG4gICAgICAgIGlmKCFkYXRhKXtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB2YXIgZCA9IGRhdGFbMF07XHJcbiAgICAgICAgICAgIGlmIChkIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIHJlcyA9IGQubWFwKGZ1bmN0aW9uICh2LCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZCA9PT0gJ29iamVjdCcpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIGQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWQuaGFzT3duUHJvcGVydHkocHJvcCkpIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXMucHVzaChwcm9wKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZ3JvdXBLZXkgIT09IG51bGwgJiYgZ3JvdXBLZXkgIT09IHVuZGVmaW5lZCAmJiAhaW5jbHVkZUdyb3VwKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHJlcy5pbmRleE9mKGdyb3VwS2V5KTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHJlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXNcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGlzT2JqZWN0Tm90QXJyYXkoaXRlbSkge1xyXG4gICAgICAgIHJldHVybiAoaXRlbSAmJiB0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkoaXRlbSkgJiYgaXRlbSAhPT0gbnVsbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBpc09iamVjdChhKSB7XHJcbiAgICAgICAgcmV0dXJuIGEgIT09IG51bGwgJiYgdHlwZW9mIGEgPT09ICdvYmplY3QnO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgaXNOdW1iZXIoYSkge1xyXG4gICAgICAgIHJldHVybiAhaXNOYU4oYSkgJiYgdHlwZW9mIGEgPT09ICdudW1iZXInO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgaXNGdW5jdGlvbihhKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBhID09PSAnZnVuY3Rpb24nO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgaXNEYXRlKGEpe1xyXG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYSkgPT09ICdbb2JqZWN0IERhdGVdJ1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpc1N0cmluZyhhKXtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGEgPT09ICdzdHJpbmcnIHx8IGEgaW5zdGFuY2VvZiBTdHJpbmdcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaW5zZXJ0T3JBcHBlbmRTZWxlY3RvcihwYXJlbnQsIHNlbGVjdG9yLCBvcGVyYXRpb24sIGJlZm9yZSkge1xyXG4gICAgICAgIHZhciBzZWxlY3RvclBhcnRzID0gc2VsZWN0b3Iuc3BsaXQoLyhbXFwuXFwjXSkvKTtcclxuICAgICAgICB2YXIgZWxlbWVudCA9IHBhcmVudFtvcGVyYXRpb25dKHNlbGVjdG9yUGFydHMuc2hpZnQoKSwgYmVmb3JlKTsvL1wiOmZpcnN0LWNoaWxkXCJcclxuICAgICAgICB3aGlsZSAoc2VsZWN0b3JQYXJ0cy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxlY3Rvck1vZGlmaWVyID0gc2VsZWN0b3JQYXJ0cy5zaGlmdCgpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZWN0b3JJdGVtID0gc2VsZWN0b3JQYXJ0cy5zaGlmdCgpO1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0b3JNb2RpZmllciA9PT0gXCIuXCIpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LmNsYXNzZWQoc2VsZWN0b3JJdGVtLCB0cnVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxlY3Rvck1vZGlmaWVyID09PSBcIiNcIikge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQuYXR0cignaWQnLCBzZWxlY3Rvckl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpbnNlcnRTZWxlY3RvcihwYXJlbnQsIHNlbGVjdG9yLCBiZWZvcmUpIHtcclxuICAgICAgICByZXR1cm4gVXRpbHMuaW5zZXJ0T3JBcHBlbmRTZWxlY3RvcihwYXJlbnQsIHNlbGVjdG9yLCBcImluc2VydFwiLCBiZWZvcmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhcHBlbmRTZWxlY3RvcihwYXJlbnQsIHNlbGVjdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIFV0aWxzLmluc2VydE9yQXBwZW5kU2VsZWN0b3IocGFyZW50LCBzZWxlY3RvciwgXCJhcHBlbmRcIik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNlbGVjdE9yQXBwZW5kKHBhcmVudCwgc2VsZWN0b3IsIGVsZW1lbnQpIHtcclxuICAgICAgICB2YXIgc2VsZWN0aW9uID0gcGFyZW50LnNlbGVjdChzZWxlY3Rvcik7XHJcbiAgICAgICAgaWYgKHNlbGVjdGlvbi5lbXB0eSgpKSB7XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50LmFwcGVuZChlbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gVXRpbHMuYXBwZW5kU2VsZWN0b3IocGFyZW50LCBzZWxlY3Rvcik7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2VsZWN0aW9uO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgc2VsZWN0T3JJbnNlcnQocGFyZW50LCBzZWxlY3RvciwgYmVmb3JlKSB7XHJcbiAgICAgICAgdmFyIHNlbGVjdGlvbiA9IHBhcmVudC5zZWxlY3Qoc2VsZWN0b3IpO1xyXG4gICAgICAgIGlmIChzZWxlY3Rpb24uZW1wdHkoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gVXRpbHMuaW5zZXJ0U2VsZWN0b3IocGFyZW50LCBzZWxlY3RvciwgYmVmb3JlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNlbGVjdGlvbjtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGxpbmVhckdyYWRpZW50KHN2ZywgZ3JhZGllbnRJZCwgcmFuZ2UsIHgxLCB5MSwgeDIsIHkyKSB7XHJcbiAgICAgICAgdmFyIGRlZnMgPSBVdGlscy5zZWxlY3RPckFwcGVuZChzdmcsIFwiZGVmc1wiKTtcclxuICAgICAgICB2YXIgbGluZWFyR3JhZGllbnQgPSBkZWZzLmFwcGVuZChcImxpbmVhckdyYWRpZW50XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgZ3JhZGllbnRJZCk7XHJcblxyXG4gICAgICAgIGxpbmVhckdyYWRpZW50XHJcbiAgICAgICAgICAgIC5hdHRyKFwieDFcIiwgeDEgKyBcIiVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ5MVwiLCB5MSArIFwiJVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcIngyXCIsIHgyICsgXCIlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieTJcIiwgeTIgKyBcIiVcIik7XHJcblxyXG4gICAgICAgIC8vQXBwZW5kIG11bHRpcGxlIGNvbG9yIHN0b3BzIGJ5IHVzaW5nIEQzJ3MgZGF0YS9lbnRlciBzdGVwXHJcbiAgICAgICAgdmFyIHN0b3BzID0gbGluZWFyR3JhZGllbnQuc2VsZWN0QWxsKFwic3RvcFwiKVxyXG4gICAgICAgICAgICAuZGF0YShyYW5nZSk7XHJcblxyXG4gICAgICAgIHN0b3BzLmVudGVyKCkuYXBwZW5kKFwic3RvcFwiKTtcclxuXHJcbiAgICAgICAgc3RvcHMuYXR0cihcIm9mZnNldFwiLCAoZCwgaSkgPT4gaSAvIChyYW5nZS5sZW5ndGggLSAxKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIGQgPT4gZCk7XHJcblxyXG4gICAgICAgIHN0b3BzLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2FuaXRpemVIZWlnaHQgPSBmdW5jdGlvbiAoaGVpZ2h0LCBjb250YWluZXIpIHtcclxuICAgICAgICByZXR1cm4gKGhlaWdodCB8fCBwYXJzZUludChjb250YWluZXIuc3R5bGUoJ2hlaWdodCcpLCAxMCkgfHwgNDAwKTtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIHNhbml0aXplV2lkdGggPSBmdW5jdGlvbiAod2lkdGgsIGNvbnRhaW5lcikge1xyXG4gICAgICAgIHJldHVybiAod2lkdGggfHwgcGFyc2VJbnQoY29udGFpbmVyLnN0eWxlKCd3aWR0aCcpLCAxMCkgfHwgOTYwKTtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGF2YWlsYWJsZUhlaWdodCA9IGZ1bmN0aW9uIChoZWlnaHQsIGNvbnRhaW5lciwgbWFyZ2luKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KDAsIFV0aWxzLnNhbml0aXplSGVpZ2h0KGhlaWdodCwgY29udGFpbmVyKSAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tKTtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGF2YWlsYWJsZVdpZHRoID0gZnVuY3Rpb24gKHdpZHRoLCBjb250YWluZXIsIG1hcmdpbikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLm1heCgwLCBVdGlscy5zYW5pdGl6ZVdpZHRoKHdpZHRoLCBjb250YWluZXIpIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgZ3VpZCgpIHtcclxuICAgICAgICBmdW5jdGlvbiBzNCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKDEgKyBNYXRoLnJhbmRvbSgpKSAqIDB4MTAwMDApXHJcbiAgICAgICAgICAgICAgICAudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgICAgICAgICAuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHM0KCkgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArIHM0KCkgKyAnLScgK1xyXG4gICAgICAgICAgICBzNCgpICsgJy0nICsgczQoKSArIHM0KCkgKyBzNCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vcGxhY2VzIHRleHRTdHJpbmcgaW4gdGV4dE9iaiwgYWRkcyBhbiBlbGxpcHNpcyBpZiB0ZXh0IGNhbid0IGZpdCBpbiB3aWR0aFxyXG4gICAgc3RhdGljIHBsYWNlVGV4dFdpdGhFbGxpcHNpcyh0ZXh0RDNPYmosIHRleHRTdHJpbmcsIHdpZHRoKXtcclxuICAgICAgICB2YXIgdGV4dE9iaiA9IHRleHREM09iai5ub2RlKCk7XHJcbiAgICAgICAgdGV4dE9iai50ZXh0Q29udGVudD10ZXh0U3RyaW5nO1xyXG5cclxuICAgICAgICB2YXIgbWFyZ2luID0gMDtcclxuICAgICAgICB2YXIgZWxsaXBzaXNMZW5ndGggPSA5O1xyXG4gICAgICAgIC8vZWxsaXBzaXMgaXMgbmVlZGVkXHJcbiAgICAgICAgaWYgKHRleHRPYmouZ2V0Q29tcHV0ZWRUZXh0TGVuZ3RoKCk+d2lkdGgrbWFyZ2luKXtcclxuICAgICAgICAgICAgZm9yICh2YXIgeD10ZXh0U3RyaW5nLmxlbmd0aC0zO3g+MDt4LT0xKXtcclxuICAgICAgICAgICAgICAgIGlmICh0ZXh0T2JqLmdldFN1YlN0cmluZ0xlbmd0aCgwLHgpK2VsbGlwc2lzTGVuZ3RoPD13aWR0aCttYXJnaW4pe1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHRPYmoudGV4dENvbnRlbnQ9dGV4dFN0cmluZy5zdWJzdHJpbmcoMCx4KStcIi4uLlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRleHRPYmoudGV4dENvbnRlbnQ9XCIuLi5cIjsgLy9jYW4ndCBwbGFjZSBhdCBhbGxcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcGxhY2VUZXh0V2l0aEVsbGlwc2lzQW5kVG9vbHRpcCh0ZXh0RDNPYmosIHRleHRTdHJpbmcsIHdpZHRoLCB0b29sdGlwKXtcclxuICAgICAgICB2YXIgZWxsaXBzaXNQbGFjZWQgPSBVdGlscy5wbGFjZVRleHRXaXRoRWxsaXBzaXModGV4dEQzT2JqLCB0ZXh0U3RyaW5nLCB3aWR0aCk7XHJcbiAgICAgICAgaWYoZWxsaXBzaXNQbGFjZWQgJiYgdG9vbHRpcCl7XHJcbiAgICAgICAgICAgIHRleHREM09iai5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgdG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xyXG4gICAgICAgICAgICAgICAgdG9vbHRpcC5odG1sKHRleHRTdHJpbmcpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZDMuZXZlbnQucGFnZVggKyA1KSArIFwicHhcIilcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0ZXh0RDNPYmoub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgdG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldEZvbnRTaXplKGVsZW1lbnQpe1xyXG4gICAgICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwiZm9udC1zaXplXCIpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==
