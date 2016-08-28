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

},{"./utils":31}],20:[function(require,module,exports){
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
            }).attr("y", plot.height).attr("dx", -2).attr("dy", 5).attr("text-anchor", "end")

            // .attr("dominant-baseline", "hanging")
            .text(function (v) {
                return plot.labelByVariable[v];
            });

            if (this.config.rotateLabelsX) {
                labelsX.attr("transform", function (d, i) {
                    return "rotate(-45, " + (i * plot.cellSize + plot.cellSize / 2) + ", " + plot.height + ")";
                });
            }

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

            if (this.config.rotateLabelsY) {
                labelsX.attr("transform", function (d, i) {
                    return "rotate(-45, " + (i * plot.cellSize + plot.cellSize / 2) + ", " + plot.height + ")";
                });
                labelsY.attr("transform", function (d, i) {
                    return "rotate(-45, " + 0 + ", " + (i * plot.cellSize + plot.cellSize / 2) + ")";
                }).attr("text-anchor", "end");
            }

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

},{"./chart":19,"./legend":25,"./scatterplot":28,"./statistics-utils":30,"./utils":31}],21:[function(require,module,exports){
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

},{"./utils":31}],22:[function(require,module,exports){
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
            fillMissing: false // fiill missing values with nearest previous value
        };
        _this.z = {
            fillMissing: true // fiill missing values with nearest previous value
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

            _get(Object.getPrototypeOf(HeatmapTimeSeries.prototype), "setupValuesBeforeGroupsSort", this).call(this);
            if (!this.config.x.fillMissing) {
                return;
            }
            var self = this;

            this.plot.x.uniqueValues.sort(this.config.x.sortComparator);

            var prev = null;

            this.plot.x.uniqueValues.forEach(function (x, i) {
                var current = _this3.getTimeValue(x);
                if (prev === null) {
                    prev = current;
                    return;
                }

                var next = self.nextTimeTickValue(prev);
                var missing = [];
                var iteration = 0;
                while (!self.timeValuesEqual(current, next)) {
                    iteration++;
                    if (iteration > 100) {
                        break;
                    }
                    var d = {};
                    d[_this3.config.x.key] = next;

                    self.updateGroups(d, next, self.plot.x.groups, self.config.x.groups);
                    missing.push(next);
                    next = self.nextTimeTickValue(next);
                }
                prev = current;
            });
        }
    }, {
        key: "getTimeValue",
        value: function getTimeValue(x) {
            return Number(x);
        }
    }, {
        key: "timeValuesEqual",
        value: function timeValuesEqual(a, b) {
            return a == b;
        }
    }, {
        key: "nextTimeTickValue",
        value: function nextTimeTickValue(t) {
            return t + 1;
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
    }]);

    return HeatmapTimeSeries;
}(_heatmap.Heatmap);

},{"./chart":19,"./heatmap":23,"./statistics-utils":30,"./utils":31}],23:[function(require,module,exports){
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

            var maxWidth = self.computeXAxisLabelsWidth(offsetX);

            labelsX.each(function (label) {
                var elem = d3.select(this),
                    text = self.formatValueX(label.val);
                _utils.Utils.placeTextWithEllipsisAndTooltip(elem, text, maxWidth, self.config.showTooltip ? self.plot.tooltip : false);
            });

            if (self.config.x.rotateLabels) {
                labelsX.attr("transform", function (d, i) {
                    return "rotate(-45, " + (i * plot.cellWidth + plot.cellWidth / 2 + d.group.gapsSize + offsetX.x) + ", " + (plot.height + offsetX.y) + ")";
                }).attr("dx", -2).attr("dy", 8).attr("text-anchor", "end");
            }

            labelsX.exit().remove();

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

            var labelsY = self.svgG.selectAll("text." + labelYClass).data(plot.y.allValuesList);

            labelsY.enter().append("text");

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
            labelsY.attr("x", offsetY.x).attr("y", function (d, i) {
                return i * plot.cellHeight + plot.cellHeight / 2 + d.group.gapsSize + offsetY.y;
            }).attr("dx", -2).attr("text-anchor", "end").attr("class", function (d, i) {
                return labelClass + " " + labelYClass + " " + labelYClass + "-" + i;
            }).text(function (d) {
                var formatted = self.formatValueY(d.val);
                return formatted;
            });

            var maxWidth = self.computeYAxisLabelsWidth(offsetY);

            labelsY.each(function (label) {
                var elem = d3.select(this),
                    text = self.formatValueY(label.val);
                _utils.Utils.placeTextWithEllipsisAndTooltip(elem, text, maxWidth, self.config.showTooltip ? self.plot.tooltip : false);
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

},{"./chart":19,"./legend":25,"./utils":31}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Legend = exports.StatisticsUtils = exports.HeatmapTimeSeriesConfig = exports.HeatmapTimeSeries = exports.HeatmapConfig = exports.Heatmap = exports.RegressionConfig = exports.Regression = exports.CorrelationMatrixConfig = exports.CorrelationMatrix = exports.ScatterPlotMatrixConfig = exports.ScatterPlotMatrix = exports.ScatterPlotConfig = exports.ScatterPlot = undefined;

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

},{"./correlation-matrix":20,"./d3-extensions":21,"./heatmap":23,"./heatmap-timeseries":22,"./legend":25,"./regression":26,"./scatterplot":28,"./scatterplot-matrix":27,"./statistics-utils":30}],25:[function(require,module,exports){
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

},{"../bower_components/d3-legend/no-extend":1,"./utils":31}],26:[function(require,module,exports){
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
            if (self.config.transition) {
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
            if (self.config.transition) {
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

},{"./chart":19,"./scatterplot":28,"./statistics-utils":30,"./utils":31}],27:[function(require,module,exports){
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

},{"./chart":19,"./legend":25,"./scatterplot":28,"./utils":31}],28:[function(require,module,exports){
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

},{"./chart":19,"./legend":25,"./utils":31}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
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

},{"../bower_components/simple-statistics/src/error_function":6,"../bower_components/simple-statistics/src/linear_regression":7,"../bower_components/simple-statistics/src/linear_regression_line":8,"../bower_components/simple-statistics/src/mean":9,"../bower_components/simple-statistics/src/sample_correlation":10,"../bower_components/simple-statistics/src/sample_standard_deviation":12,"../bower_components/simple-statistics/src/standard_deviation":14,"../bower_components/simple-statistics/src/variance":17,"../bower_components/simple-statistics/src/z_score":18,"./statistics-distributions":29}],31:[function(require,module,exports){
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

},{}]},{},[24])(24)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJib3dlcl9jb21wb25lbnRzXFxkMy1sZWdlbmRcXG5vLWV4dGVuZC5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxjb2xvci5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxsZWdlbmQuanMiLCJib3dlcl9jb21wb25lbnRzXFxkMy1sZWdlbmRcXHNyY1xcc2l6ZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxzeW1ib2wuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxlcnJvcl9mdW5jdGlvbi5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXGxpbmVhcl9yZWdyZXNzaW9uLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcbGluZWFyX3JlZ3Jlc3Npb25fbGluZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXG1lYW4uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfY29ycmVsYXRpb24uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfY292YXJpYW5jZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXHNhbXBsZV9zdGFuZGFyZF9kZXZpYXRpb24uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfdmFyaWFuY2UuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzdGFuZGFyZF9kZXZpYXRpb24uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzdW0uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzdW1fbnRoX3Bvd2VyX2RldmlhdGlvbnMuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFx2YXJpYW5jZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXHpfc2NvcmUuanMiLCJzcmNcXGNoYXJ0LmpzIiwic3JjXFxjb3JyZWxhdGlvbi1tYXRyaXguanMiLCJzcmNcXGQzLWV4dGVuc2lvbnMuanMiLCJzcmNcXGhlYXRtYXAtdGltZXNlcmllcy5qcyIsInNyY1xcaGVhdG1hcC5qcyIsInNyY1xcaW5kZXguanMiLCJzcmNcXGxlZ2VuZC5qcyIsInNyY1xccmVncmVzc2lvbi5qcyIsInNyY1xcc2NhdHRlcnBsb3QtbWF0cml4LmpzIiwic3JjXFxzY2F0dGVycGxvdC5qcyIsInNyY1xcc3RhdGlzdGljcy1kaXN0cmlidXRpb25zLmpzIiwic3JjXFxzdGF0aXN0aWNzLXV0aWxzLmpzIiwic3JjXFx1dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsT0FBTyxPQUFQLEdBQWlCO0FBQ2YsU0FBTyxRQUFRLGFBQVIsQ0FEUTtBQUVmLFFBQU0sUUFBUSxZQUFSLENBRlM7QUFHZixVQUFRLFFBQVEsY0FBUjtBQUhPLENBQWpCOzs7OztBQ0FBLElBQUksU0FBUyxRQUFRLFVBQVIsQ0FBYjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsWUFBVTs7QUFFekIsTUFBSSxRQUFRLEdBQUcsS0FBSCxDQUFTLE1BQVQsRUFBWjtBQUFBLE1BQ0UsUUFBUSxNQURWO0FBQUEsTUFFRSxhQUFhLEVBRmY7QUFBQSxNQUdFLGNBQWMsRUFIaEI7QUFBQSxNQUlFLGNBQWMsRUFKaEI7QUFBQSxNQUtFLGVBQWUsQ0FMakI7QUFBQSxNQU1FLFFBQVEsQ0FBQyxDQUFELENBTlY7QUFBQSxNQU9FLFNBQVMsRUFQWDtBQUFBLE1B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QUFoQixDQUFULEVBQW9DLEVBQXBDLENBQVYsSUFBcUQsR0FBN0Q7QUFDSCxDOztBQTNLUSxLLENBNktGLGEsR0FBZ0IsVUFBVSxLQUFWLEVBQWlCLFNBQWpCLEVBQTRCO0FBQy9DLFdBQVEsU0FBUyxTQUFTLFVBQVUsS0FBVixDQUFnQixPQUFoQixDQUFULEVBQW1DLEVBQW5DLENBQVQsSUFBbUQsR0FBM0Q7QUFDSCxDOztBQS9LUSxLLENBaUxGLGUsR0FBa0IsVUFBVSxNQUFWLEVBQWtCLFNBQWxCLEVBQTZCLE1BQTdCLEVBQXFDO0FBQzFELFdBQU8sS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLE1BQU0sY0FBTixDQUFxQixNQUFyQixFQUE2QixTQUE3QixJQUEwQyxPQUFPLEdBQWpELEdBQXVELE9BQU8sTUFBMUUsQ0FBUDtBQUNILEM7O0FBbkxRLEssQ0FxTEYsYyxHQUFpQixVQUFVLEtBQVYsRUFBaUIsU0FBakIsRUFBNEIsTUFBNUIsRUFBb0M7QUFDeEQsV0FBTyxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksTUFBTSxhQUFOLENBQW9CLEtBQXBCLEVBQTJCLFNBQTNCLElBQXdDLE9BQU8sSUFBL0MsR0FBc0QsT0FBTyxLQUF6RSxDQUFQO0FBQ0gsQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICBjb2xvcjogcmVxdWlyZSgnLi9zcmMvY29sb3InKSxcclxuICBzaXplOiByZXF1aXJlKCcuL3NyYy9zaXplJyksXHJcbiAgc3ltYm9sOiByZXF1aXJlKCcuL3NyYy9zeW1ib2wnKVxyXG59O1xyXG4iLCJ2YXIgaGVscGVyID0gcmVxdWlyZSgnLi9sZWdlbmQnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgdmFyIHNjYWxlID0gZDMuc2NhbGUubGluZWFyKCksXHJcbiAgICBzaGFwZSA9IFwicmVjdFwiLFxyXG4gICAgc2hhcGVXaWR0aCA9IDE1LFxyXG4gICAgc2hhcGVIZWlnaHQgPSAxNSxcclxuICAgIHNoYXBlUmFkaXVzID0gMTAsXHJcbiAgICBzaGFwZVBhZGRpbmcgPSAyLFxyXG4gICAgY2VsbHMgPSBbNV0sXHJcbiAgICBsYWJlbHMgPSBbXSxcclxuICAgIGNsYXNzUHJlZml4ID0gXCJcIixcclxuICAgIHVzZUNsYXNzID0gZmFsc2UsXHJcbiAgICB0aXRsZSA9IFwiXCIsXHJcbiAgICBsYWJlbEZvcm1hdCA9IGQzLmZvcm1hdChcIi4wMWZcIiksXHJcbiAgICBsYWJlbE9mZnNldCA9IDEwLFxyXG4gICAgbGFiZWxBbGlnbiA9IFwibWlkZGxlXCIsXHJcbiAgICBsYWJlbERlbGltaXRlciA9IFwidG9cIixcclxuICAgIG9yaWVudCA9IFwidmVydGljYWxcIixcclxuICAgIGFzY2VuZGluZyA9IGZhbHNlLFxyXG4gICAgcGF0aCxcclxuICAgIGxlZ2VuZERpc3BhdGNoZXIgPSBkMy5kaXNwYXRjaChcImNlbGxvdmVyXCIsIFwiY2VsbG91dFwiLCBcImNlbGxjbGlja1wiKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsZWdlbmQoc3ZnKXtcclxuXHJcbiAgICAgIHZhciB0eXBlID0gaGVscGVyLmQzX2NhbGNUeXBlKHNjYWxlLCBhc2NlbmRpbmcsIGNlbGxzLCBsYWJlbHMsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlciksXHJcbiAgICAgICAgbGVnZW5kRyA9IHN2Zy5zZWxlY3RBbGwoJ2cnKS5kYXRhKFtzY2FsZV0pO1xyXG5cclxuICAgICAgbGVnZW5kRy5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgY2xhc3NQcmVmaXggKyAnbGVnZW5kQ2VsbHMnKTtcclxuXHJcblxyXG4gICAgICB2YXIgY2VsbCA9IGxlZ2VuZEcuc2VsZWN0QWxsKFwiLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGxcIikuZGF0YSh0eXBlLmRhdGEpLFxyXG4gICAgICAgIGNlbGxFbnRlciA9IGNlbGwuZW50ZXIoKS5hcHBlbmQoXCJnXCIsIFwiLmNlbGxcIikuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJjZWxsXCIpLnN0eWxlKFwib3BhY2l0eVwiLCAxZS02KSxcclxuICAgICAgICBzaGFwZUVudGVyID0gY2VsbEVudGVyLmFwcGVuZChzaGFwZSkuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJzd2F0Y2hcIiksXHJcbiAgICAgICAgc2hhcGVzID0gY2VsbC5zZWxlY3QoXCJnLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGwgXCIgKyBzaGFwZSk7XHJcblxyXG4gICAgICAvL2FkZCBldmVudCBoYW5kbGVyc1xyXG4gICAgICBoZWxwZXIuZDNfYWRkRXZlbnRzKGNlbGxFbnRlciwgbGVnZW5kRGlzcGF0Y2hlcik7XHJcblxyXG4gICAgICBjZWxsLmV4aXQoKS50cmFuc2l0aW9uKCkuc3R5bGUoXCJvcGFjaXR5XCIsIDApLnJlbW92ZSgpO1xyXG5cclxuICAgICAgaGVscGVyLmQzX2RyYXdTaGFwZXMoc2hhcGUsIHNoYXBlcywgc2hhcGVIZWlnaHQsIHNoYXBlV2lkdGgsIHNoYXBlUmFkaXVzLCBwYXRoKTtcclxuXHJcbiAgICAgIGhlbHBlci5kM19hZGRUZXh0KGxlZ2VuZEcsIGNlbGxFbnRlciwgdHlwZS5sYWJlbHMsIGNsYXNzUHJlZml4KVxyXG5cclxuICAgICAgLy8gc2V0cyBwbGFjZW1lbnRcclxuICAgICAgdmFyIHRleHQgPSBjZWxsLnNlbGVjdChcInRleHRcIiksXHJcbiAgICAgICAgc2hhcGVTaXplID0gc2hhcGVzWzBdLm1hcCggZnVuY3Rpb24oZCl7IHJldHVybiBkLmdldEJCb3goKTsgfSk7XHJcblxyXG4gICAgICAvL3NldHMgc2NhbGVcclxuICAgICAgLy9ldmVyeXRoaW5nIGlzIGZpbGwgZXhjZXB0IGZvciBsaW5lIHdoaWNoIGlzIHN0cm9rZSxcclxuICAgICAgaWYgKCF1c2VDbGFzcyl7XHJcbiAgICAgICAgaWYgKHNoYXBlID09IFwibGluZVwiKXtcclxuICAgICAgICAgIHNoYXBlcy5zdHlsZShcInN0cm9rZVwiLCB0eXBlLmZlYXR1cmUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzaGFwZXMuc3R5bGUoXCJmaWxsXCIsIHR5cGUuZmVhdHVyZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNoYXBlcy5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCl7IHJldHVybiBjbGFzc1ByZWZpeCArIFwic3dhdGNoIFwiICsgdHlwZS5mZWF0dXJlKGQpOyB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGNlbGxUcmFucyxcclxuICAgICAgdGV4dFRyYW5zLFxyXG4gICAgICB0ZXh0QWxpZ24gPSAobGFiZWxBbGlnbiA9PSBcInN0YXJ0XCIpID8gMCA6IChsYWJlbEFsaWduID09IFwibWlkZGxlXCIpID8gMC41IDogMTtcclxuXHJcbiAgICAgIC8vcG9zaXRpb25zIGNlbGxzIGFuZCB0ZXh0XHJcbiAgICAgIGlmIChvcmllbnQgPT09IFwidmVydGljYWxcIil7XHJcbiAgICAgICAgY2VsbFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZSgwLCBcIiArIChpICogKHNoYXBlU2l6ZVtpXS5oZWlnaHQgKyBzaGFwZVBhZGRpbmcpKSArIFwiKVwiOyB9O1xyXG4gICAgICAgIHRleHRUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAoc2hhcGVTaXplW2ldLndpZHRoICsgc2hhcGVTaXplW2ldLnggK1xyXG4gICAgICAgICAgbGFiZWxPZmZzZXQpICsgXCIsXCIgKyAoc2hhcGVTaXplW2ldLnkgKyBzaGFwZVNpemVbaV0uaGVpZ2h0LzIgKyA1KSArIFwiKVwiOyB9O1xyXG5cclxuICAgICAgfSBlbHNlIGlmIChvcmllbnQgPT09IFwiaG9yaXpvbnRhbFwiKXtcclxuICAgICAgICBjZWxsVHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKGkgKiAoc2hhcGVTaXplW2ldLndpZHRoICsgc2hhcGVQYWRkaW5nKSkgKyBcIiwwKVwiOyB9XHJcbiAgICAgICAgdGV4dFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIChzaGFwZVNpemVbaV0ud2lkdGgqdGV4dEFsaWduICArIHNoYXBlU2l6ZVtpXS54KSArXHJcbiAgICAgICAgICBcIixcIiArIChzaGFwZVNpemVbaV0uaGVpZ2h0ICsgc2hhcGVTaXplW2ldLnkgKyBsYWJlbE9mZnNldCArIDgpICsgXCIpXCI7IH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGhlbHBlci5kM19wbGFjZW1lbnQob3JpZW50LCBjZWxsLCBjZWxsVHJhbnMsIHRleHQsIHRleHRUcmFucywgbGFiZWxBbGlnbik7XHJcbiAgICAgIGhlbHBlci5kM190aXRsZShzdmcsIGxlZ2VuZEcsIHRpdGxlLCBjbGFzc1ByZWZpeCk7XHJcblxyXG4gICAgICBjZWxsLnRyYW5zaXRpb24oKS5zdHlsZShcIm9wYWNpdHlcIiwgMSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gIGxlZ2VuZC5zY2FsZSA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNjYWxlO1xyXG4gICAgc2NhbGUgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuY2VsbHMgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBjZWxscztcclxuICAgIGlmIChfLmxlbmd0aCA+IDEgfHwgXyA+PSAyICl7XHJcbiAgICAgIGNlbGxzID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlID0gZnVuY3Rpb24oXywgZCkge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGU7XHJcbiAgICBpZiAoXyA9PSBcInJlY3RcIiB8fCBfID09IFwiY2lyY2xlXCIgfHwgXyA9PSBcImxpbmVcIiB8fCAoXyA9PSBcInBhdGhcIiAmJiAodHlwZW9mIGQgPT09ICdzdHJpbmcnKSkgKXtcclxuICAgICAgc2hhcGUgPSBfO1xyXG4gICAgICBwYXRoID0gZDtcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlV2lkdGggPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZVdpZHRoO1xyXG4gICAgc2hhcGVXaWR0aCA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuc2hhcGVIZWlnaHQgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZUhlaWdodDtcclxuICAgIHNoYXBlSGVpZ2h0ID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5zaGFwZVJhZGl1cyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlUmFkaXVzO1xyXG4gICAgc2hhcGVSYWRpdXMgPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlUGFkZGluZyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlUGFkZGluZztcclxuICAgIHNoYXBlUGFkZGluZyA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxzID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxzO1xyXG4gICAgbGFiZWxzID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsQWxpZ24gPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbEFsaWduO1xyXG4gICAgaWYgKF8gPT0gXCJzdGFydFwiIHx8IF8gPT0gXCJlbmRcIiB8fCBfID09IFwibWlkZGxlXCIpIHtcclxuICAgICAgbGFiZWxBbGlnbiA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbEZvcm1hdCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsRm9ybWF0O1xyXG4gICAgbGFiZWxGb3JtYXQgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxPZmZzZXQgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbE9mZnNldDtcclxuICAgIGxhYmVsT2Zmc2V0ID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbERlbGltaXRlciA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsRGVsaW1pdGVyO1xyXG4gICAgbGFiZWxEZWxpbWl0ZXIgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQudXNlQ2xhc3MgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB1c2VDbGFzcztcclxuICAgIGlmIChfID09PSB0cnVlIHx8IF8gPT09IGZhbHNlKXtcclxuICAgICAgdXNlQ2xhc3MgPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQub3JpZW50ID0gZnVuY3Rpb24oXyl7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBvcmllbnQ7XHJcbiAgICBfID0gXy50b0xvd2VyQ2FzZSgpO1xyXG4gICAgaWYgKF8gPT0gXCJob3Jpem9udGFsXCIgfHwgXyA9PSBcInZlcnRpY2FsXCIpIHtcclxuICAgICAgb3JpZW50ID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmFzY2VuZGluZyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGFzY2VuZGluZztcclxuICAgIGFzY2VuZGluZyA9ICEhXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmNsYXNzUHJlZml4ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY2xhc3NQcmVmaXg7XHJcbiAgICBjbGFzc1ByZWZpeCA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC50aXRsZSA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHRpdGxlO1xyXG4gICAgdGl0bGUgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBkMy5yZWJpbmQobGVnZW5kLCBsZWdlbmREaXNwYXRjaGVyLCBcIm9uXCIpO1xyXG5cclxuICByZXR1cm4gbGVnZW5kO1xyXG5cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gIGQzX2lkZW50aXR5OiBmdW5jdGlvbiAoZCkge1xyXG4gICAgcmV0dXJuIGQ7XHJcbiAgfSxcclxuXHJcbiAgZDNfbWVyZ2VMYWJlbHM6IGZ1bmN0aW9uIChnZW4sIGxhYmVscykge1xyXG5cclxuICAgICAgaWYobGFiZWxzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGdlbjtcclxuXHJcbiAgICAgIGdlbiA9IChnZW4pID8gZ2VuIDogW107XHJcblxyXG4gICAgICB2YXIgaSA9IGxhYmVscy5sZW5ndGg7XHJcbiAgICAgIGZvciAoOyBpIDwgZ2VuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGFiZWxzLnB1c2goZ2VuW2ldKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbGFiZWxzO1xyXG4gICAgfSxcclxuXHJcbiAgZDNfbGluZWFyTGVnZW5kOiBmdW5jdGlvbiAoc2NhbGUsIGNlbGxzLCBsYWJlbEZvcm1hdCkge1xyXG4gICAgdmFyIGRhdGEgPSBbXTtcclxuXHJcbiAgICBpZiAoY2VsbHMubGVuZ3RoID4gMSl7XHJcbiAgICAgIGRhdGEgPSBjZWxscztcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgZG9tYWluID0gc2NhbGUuZG9tYWluKCksXHJcbiAgICAgIGluY3JlbWVudCA9IChkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdIC0gZG9tYWluWzBdKS8oY2VsbHMgLSAxKSxcclxuICAgICAgaSA9IDA7XHJcblxyXG4gICAgICBmb3IgKDsgaSA8IGNlbGxzOyBpKyspe1xyXG4gICAgICAgIGRhdGEucHVzaChkb21haW5bMF0gKyBpKmluY3JlbWVudCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgbGFiZWxzID0gZGF0YS5tYXAobGFiZWxGb3JtYXQpO1xyXG5cclxuICAgIHJldHVybiB7ZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgbGFiZWxzOiBsYWJlbHMsXHJcbiAgICAgICAgICAgIGZlYXR1cmU6IGZ1bmN0aW9uKGQpeyByZXR1cm4gc2NhbGUoZCk7IH19O1xyXG4gIH0sXHJcblxyXG4gIGQzX3F1YW50TGVnZW5kOiBmdW5jdGlvbiAoc2NhbGUsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlcikge1xyXG4gICAgdmFyIGxhYmVscyA9IHNjYWxlLnJhbmdlKCkubWFwKGZ1bmN0aW9uKGQpe1xyXG4gICAgICB2YXIgaW52ZXJ0ID0gc2NhbGUuaW52ZXJ0RXh0ZW50KGQpLFxyXG4gICAgICBhID0gbGFiZWxGb3JtYXQoaW52ZXJ0WzBdKSxcclxuICAgICAgYiA9IGxhYmVsRm9ybWF0KGludmVydFsxXSk7XHJcblxyXG4gICAgICAvLyBpZiAoKCAoYSkgJiYgKGEuaXNOYW4oKSkgJiYgYil7XHJcbiAgICAgIC8vICAgY29uc29sZS5sb2coXCJpbiBpbml0aWFsIHN0YXRlbWVudFwiKVxyXG4gICAgICAgIHJldHVybiBsYWJlbEZvcm1hdChpbnZlcnRbMF0pICsgXCIgXCIgKyBsYWJlbERlbGltaXRlciArIFwiIFwiICsgbGFiZWxGb3JtYXQoaW52ZXJ0WzFdKTtcclxuICAgICAgLy8gfSBlbHNlIGlmIChhIHx8IGIpIHtcclxuICAgICAgLy8gICBjb25zb2xlLmxvZygnaW4gZWxzZSBzdGF0ZW1lbnQnKVxyXG4gICAgICAvLyAgIHJldHVybiAoYSkgPyBhIDogYjtcclxuICAgICAgLy8gfVxyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7ZGF0YTogc2NhbGUucmFuZ2UoKSxcclxuICAgICAgICAgICAgbGFiZWxzOiBsYWJlbHMsXHJcbiAgICAgICAgICAgIGZlYXR1cmU6IHRoaXMuZDNfaWRlbnRpdHlcclxuICAgICAgICAgIH07XHJcbiAgfSxcclxuXHJcbiAgZDNfb3JkaW5hbExlZ2VuZDogZnVuY3Rpb24gKHNjYWxlKSB7XHJcbiAgICByZXR1cm4ge2RhdGE6IHNjYWxlLmRvbWFpbigpLFxyXG4gICAgICAgICAgICBsYWJlbHM6IHNjYWxlLmRvbWFpbigpLFxyXG4gICAgICAgICAgICBmZWF0dXJlOiBmdW5jdGlvbihkKXsgcmV0dXJuIHNjYWxlKGQpOyB9fTtcclxuICB9LFxyXG5cclxuICBkM19kcmF3U2hhcGVzOiBmdW5jdGlvbiAoc2hhcGUsIHNoYXBlcywgc2hhcGVIZWlnaHQsIHNoYXBlV2lkdGgsIHNoYXBlUmFkaXVzLCBwYXRoKSB7XHJcbiAgICBpZiAoc2hhcGUgPT09IFwicmVjdFwiKXtcclxuICAgICAgICBzaGFwZXMuYXR0cihcImhlaWdodFwiLCBzaGFwZUhlaWdodCkuYXR0cihcIndpZHRoXCIsIHNoYXBlV2lkdGgpO1xyXG5cclxuICAgIH0gZWxzZSBpZiAoc2hhcGUgPT09IFwiY2lyY2xlXCIpIHtcclxuICAgICAgICBzaGFwZXMuYXR0cihcInJcIiwgc2hhcGVSYWRpdXMpLy8uYXR0cihcImN4XCIsIHNoYXBlUmFkaXVzKS5hdHRyKFwiY3lcIiwgc2hhcGVSYWRpdXMpO1xyXG5cclxuICAgIH0gZWxzZSBpZiAoc2hhcGUgPT09IFwibGluZVwiKSB7XHJcbiAgICAgICAgc2hhcGVzLmF0dHIoXCJ4MVwiLCAwKS5hdHRyKFwieDJcIiwgc2hhcGVXaWR0aCkuYXR0cihcInkxXCIsIDApLmF0dHIoXCJ5MlwiLCAwKTtcclxuXHJcbiAgICB9IGVsc2UgaWYgKHNoYXBlID09PSBcInBhdGhcIikge1xyXG4gICAgICBzaGFwZXMuYXR0cihcImRcIiwgcGF0aCk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZDNfYWRkVGV4dDogZnVuY3Rpb24gKHN2ZywgZW50ZXIsIGxhYmVscywgY2xhc3NQcmVmaXgpe1xyXG4gICAgZW50ZXIuYXBwZW5kKFwidGV4dFwiKS5hdHRyKFwiY2xhc3NcIiwgY2xhc3NQcmVmaXggKyBcImxhYmVsXCIpO1xyXG4gICAgc3ZnLnNlbGVjdEFsbChcImcuXCIgKyBjbGFzc1ByZWZpeCArIFwiY2VsbCB0ZXh0XCIpLmRhdGEobGFiZWxzKS50ZXh0KHRoaXMuZDNfaWRlbnRpdHkpO1xyXG4gIH0sXHJcblxyXG4gIGQzX2NhbGNUeXBlOiBmdW5jdGlvbiAoc2NhbGUsIGFzY2VuZGluZywgY2VsbHMsIGxhYmVscywgbGFiZWxGb3JtYXQsIGxhYmVsRGVsaW1pdGVyKXtcclxuICAgIHZhciB0eXBlID0gc2NhbGUudGlja3MgP1xyXG4gICAgICAgICAgICB0aGlzLmQzX2xpbmVhckxlZ2VuZChzY2FsZSwgY2VsbHMsIGxhYmVsRm9ybWF0KSA6IHNjYWxlLmludmVydEV4dGVudCA/XHJcbiAgICAgICAgICAgIHRoaXMuZDNfcXVhbnRMZWdlbmQoc2NhbGUsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlcikgOiB0aGlzLmQzX29yZGluYWxMZWdlbmQoc2NhbGUpO1xyXG5cclxuICAgIHR5cGUubGFiZWxzID0gdGhpcy5kM19tZXJnZUxhYmVscyh0eXBlLmxhYmVscywgbGFiZWxzKTtcclxuXHJcbiAgICBpZiAoYXNjZW5kaW5nKSB7XHJcbiAgICAgIHR5cGUubGFiZWxzID0gdGhpcy5kM19yZXZlcnNlKHR5cGUubGFiZWxzKTtcclxuICAgICAgdHlwZS5kYXRhID0gdGhpcy5kM19yZXZlcnNlKHR5cGUuZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHR5cGU7XHJcbiAgfSxcclxuXHJcbiAgZDNfcmV2ZXJzZTogZnVuY3Rpb24oYXJyKSB7XHJcbiAgICB2YXIgbWlycm9yID0gW107XHJcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGFyci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgbWlycm9yW2ldID0gYXJyW2wtaS0xXTtcclxuICAgIH1cclxuICAgIHJldHVybiBtaXJyb3I7XHJcbiAgfSxcclxuXHJcbiAgZDNfcGxhY2VtZW50OiBmdW5jdGlvbiAob3JpZW50LCBjZWxsLCBjZWxsVHJhbnMsIHRleHQsIHRleHRUcmFucywgbGFiZWxBbGlnbikge1xyXG4gICAgY2VsbC5hdHRyKFwidHJhbnNmb3JtXCIsIGNlbGxUcmFucyk7XHJcbiAgICB0ZXh0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgdGV4dFRyYW5zKTtcclxuICAgIGlmIChvcmllbnQgPT09IFwiaG9yaXpvbnRhbFwiKXtcclxuICAgICAgdGV4dC5zdHlsZShcInRleHQtYW5jaG9yXCIsIGxhYmVsQWxpZ24pO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGQzX2FkZEV2ZW50czogZnVuY3Rpb24oY2VsbHMsIGRpc3BhdGNoZXIpe1xyXG4gICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgY2VsbHMub24oXCJtb3VzZW92ZXIubGVnZW5kXCIsIGZ1bmN0aW9uIChkKSB7IF8uZDNfY2VsbE92ZXIoZGlzcGF0Y2hlciwgZCwgdGhpcyk7IH0pXHJcbiAgICAgICAgICAub24oXCJtb3VzZW91dC5sZWdlbmRcIiwgZnVuY3Rpb24gKGQpIHsgXy5kM19jZWxsT3V0KGRpc3BhdGNoZXIsIGQsIHRoaXMpOyB9KVxyXG4gICAgICAgICAgLm9uKFwiY2xpY2subGVnZW5kXCIsIGZ1bmN0aW9uIChkKSB7IF8uZDNfY2VsbENsaWNrKGRpc3BhdGNoZXIsIGQsIHRoaXMpOyB9KTtcclxuICB9LFxyXG5cclxuICBkM19jZWxsT3ZlcjogZnVuY3Rpb24oY2VsbERpc3BhdGNoZXIsIGQsIG9iail7XHJcbiAgICBjZWxsRGlzcGF0Y2hlci5jZWxsb3Zlci5jYWxsKG9iaiwgZCk7XHJcbiAgfSxcclxuXHJcbiAgZDNfY2VsbE91dDogZnVuY3Rpb24oY2VsbERpc3BhdGNoZXIsIGQsIG9iail7XHJcbiAgICBjZWxsRGlzcGF0Y2hlci5jZWxsb3V0LmNhbGwob2JqLCBkKTtcclxuICB9LFxyXG5cclxuICBkM19jZWxsQ2xpY2s6IGZ1bmN0aW9uKGNlbGxEaXNwYXRjaGVyLCBkLCBvYmope1xyXG4gICAgY2VsbERpc3BhdGNoZXIuY2VsbGNsaWNrLmNhbGwob2JqLCBkKTtcclxuICB9LFxyXG5cclxuICBkM190aXRsZTogZnVuY3Rpb24oc3ZnLCBjZWxsc1N2ZywgdGl0bGUsIGNsYXNzUHJlZml4KXtcclxuICAgIGlmICh0aXRsZSAhPT0gXCJcIil7XHJcblxyXG4gICAgICB2YXIgdGl0bGVUZXh0ID0gc3ZnLnNlbGVjdEFsbCgndGV4dC4nICsgY2xhc3NQcmVmaXggKyAnbGVnZW5kVGl0bGUnKTtcclxuXHJcbiAgICAgIHRpdGxlVGV4dC5kYXRhKFt0aXRsZV0pXHJcbiAgICAgICAgLmVudGVyKClcclxuICAgICAgICAuYXBwZW5kKCd0ZXh0JylcclxuICAgICAgICAuYXR0cignY2xhc3MnLCBjbGFzc1ByZWZpeCArICdsZWdlbmRUaXRsZScpO1xyXG5cclxuICAgICAgICBzdmcuc2VsZWN0QWxsKCd0ZXh0LicgKyBjbGFzc1ByZWZpeCArICdsZWdlbmRUaXRsZScpXHJcbiAgICAgICAgICAgIC50ZXh0KHRpdGxlKVxyXG5cclxuICAgICAgdmFyIHlPZmZzZXQgPSBzdmcuc2VsZWN0KCcuJyArIGNsYXNzUHJlZml4ICsgJ2xlZ2VuZFRpdGxlJylcclxuICAgICAgICAgIC5tYXAoZnVuY3Rpb24oZCkgeyByZXR1cm4gZFswXS5nZXRCQm94KCkuaGVpZ2h0fSlbMF0sXHJcbiAgICAgIHhPZmZzZXQgPSAtY2VsbHNTdmcubWFwKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRbMF0uZ2V0QkJveCgpLnh9KVswXTtcclxuXHJcbiAgICAgIGNlbGxzU3ZnLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIHhPZmZzZXQgKyAnLCcgKyAoeU9mZnNldCArIDEwKSArICcpJyk7XHJcblxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJ2YXIgaGVscGVyID0gcmVxdWlyZSgnLi9sZWdlbmQnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gIGZ1bmN0aW9uKCl7XHJcblxyXG4gIHZhciBzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLFxyXG4gICAgc2hhcGUgPSBcInJlY3RcIixcclxuICAgIHNoYXBlV2lkdGggPSAxNSxcclxuICAgIHNoYXBlUGFkZGluZyA9IDIsXHJcbiAgICBjZWxscyA9IFs1XSxcclxuICAgIGxhYmVscyA9IFtdLFxyXG4gICAgdXNlU3Ryb2tlID0gZmFsc2UsXHJcbiAgICBjbGFzc1ByZWZpeCA9IFwiXCIsXHJcbiAgICB0aXRsZSA9IFwiXCIsXHJcbiAgICBsYWJlbEZvcm1hdCA9IGQzLmZvcm1hdChcIi4wMWZcIiksXHJcbiAgICBsYWJlbE9mZnNldCA9IDEwLFxyXG4gICAgbGFiZWxBbGlnbiA9IFwibWlkZGxlXCIsXHJcbiAgICBsYWJlbERlbGltaXRlciA9IFwidG9cIixcclxuICAgIG9yaWVudCA9IFwidmVydGljYWxcIixcclxuICAgIGFzY2VuZGluZyA9IGZhbHNlLFxyXG4gICAgcGF0aCxcclxuICAgIGxlZ2VuZERpc3BhdGNoZXIgPSBkMy5kaXNwYXRjaChcImNlbGxvdmVyXCIsIFwiY2VsbG91dFwiLCBcImNlbGxjbGlja1wiKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsZWdlbmQoc3ZnKXtcclxuXHJcbiAgICAgIHZhciB0eXBlID0gaGVscGVyLmQzX2NhbGNUeXBlKHNjYWxlLCBhc2NlbmRpbmcsIGNlbGxzLCBsYWJlbHMsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlciksXHJcbiAgICAgICAgbGVnZW5kRyA9IHN2Zy5zZWxlY3RBbGwoJ2cnKS5kYXRhKFtzY2FsZV0pO1xyXG5cclxuICAgICAgbGVnZW5kRy5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgY2xhc3NQcmVmaXggKyAnbGVnZW5kQ2VsbHMnKTtcclxuXHJcblxyXG4gICAgICB2YXIgY2VsbCA9IGxlZ2VuZEcuc2VsZWN0QWxsKFwiLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGxcIikuZGF0YSh0eXBlLmRhdGEpLFxyXG4gICAgICAgIGNlbGxFbnRlciA9IGNlbGwuZW50ZXIoKS5hcHBlbmQoXCJnXCIsIFwiLmNlbGxcIikuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJjZWxsXCIpLnN0eWxlKFwib3BhY2l0eVwiLCAxZS02KSxcclxuICAgICAgICBzaGFwZUVudGVyID0gY2VsbEVudGVyLmFwcGVuZChzaGFwZSkuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJzd2F0Y2hcIiksXHJcbiAgICAgICAgc2hhcGVzID0gY2VsbC5zZWxlY3QoXCJnLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGwgXCIgKyBzaGFwZSk7XHJcblxyXG4gICAgICAvL2FkZCBldmVudCBoYW5kbGVyc1xyXG4gICAgICBoZWxwZXIuZDNfYWRkRXZlbnRzKGNlbGxFbnRlciwgbGVnZW5kRGlzcGF0Y2hlcik7XHJcblxyXG4gICAgICBjZWxsLmV4aXQoKS50cmFuc2l0aW9uKCkuc3R5bGUoXCJvcGFjaXR5XCIsIDApLnJlbW92ZSgpO1xyXG5cclxuICAgICAgLy9jcmVhdGVzIHNoYXBlXHJcbiAgICAgIGlmIChzaGFwZSA9PT0gXCJsaW5lXCIpe1xyXG4gICAgICAgIGhlbHBlci5kM19kcmF3U2hhcGVzKHNoYXBlLCBzaGFwZXMsIDAsIHNoYXBlV2lkdGgpO1xyXG4gICAgICAgIHNoYXBlcy5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIHR5cGUuZmVhdHVyZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaGVscGVyLmQzX2RyYXdTaGFwZXMoc2hhcGUsIHNoYXBlcywgdHlwZS5mZWF0dXJlLCB0eXBlLmZlYXR1cmUsIHR5cGUuZmVhdHVyZSwgcGF0aCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGhlbHBlci5kM19hZGRUZXh0KGxlZ2VuZEcsIGNlbGxFbnRlciwgdHlwZS5sYWJlbHMsIGNsYXNzUHJlZml4KVxyXG5cclxuICAgICAgLy9zZXRzIHBsYWNlbWVudFxyXG4gICAgICB2YXIgdGV4dCA9IGNlbGwuc2VsZWN0KFwidGV4dFwiKSxcclxuICAgICAgICBzaGFwZVNpemUgPSBzaGFwZXNbMF0ubWFwKFxyXG4gICAgICAgICAgZnVuY3Rpb24oZCwgaSl7XHJcbiAgICAgICAgICAgIHZhciBiYm94ID0gZC5nZXRCQm94KClcclxuICAgICAgICAgICAgdmFyIHN0cm9rZSA9IHNjYWxlKHR5cGUuZGF0YVtpXSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2hhcGUgPT09IFwibGluZVwiICYmIG9yaWVudCA9PT0gXCJob3Jpem9udGFsXCIpIHtcclxuICAgICAgICAgICAgICBiYm94LmhlaWdodCA9IGJib3guaGVpZ2h0ICsgc3Ryb2tlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNoYXBlID09PSBcImxpbmVcIiAmJiBvcmllbnQgPT09IFwidmVydGljYWxcIil7XHJcbiAgICAgICAgICAgICAgYmJveC53aWR0aCA9IGJib3gud2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBiYm94O1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgdmFyIG1heEggPSBkMy5tYXgoc2hhcGVTaXplLCBmdW5jdGlvbihkKXsgcmV0dXJuIGQuaGVpZ2h0ICsgZC55OyB9KSxcclxuICAgICAgbWF4VyA9IGQzLm1heChzaGFwZVNpemUsIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC53aWR0aCArIGQueDsgfSk7XHJcblxyXG4gICAgICB2YXIgY2VsbFRyYW5zLFxyXG4gICAgICB0ZXh0VHJhbnMsXHJcbiAgICAgIHRleHRBbGlnbiA9IChsYWJlbEFsaWduID09IFwic3RhcnRcIikgPyAwIDogKGxhYmVsQWxpZ24gPT0gXCJtaWRkbGVcIikgPyAwLjUgOiAxO1xyXG5cclxuICAgICAgLy9wb3NpdGlvbnMgY2VsbHMgYW5kIHRleHRcclxuICAgICAgaWYgKG9yaWVudCA9PT0gXCJ2ZXJ0aWNhbFwiKXtcclxuXHJcbiAgICAgICAgY2VsbFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSBkMy5zdW0oc2hhcGVTaXplLnNsaWNlKDAsIGkgKyAxICksIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC5oZWlnaHQ7IH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoMCwgXCIgKyAoaGVpZ2h0ICsgaSpzaGFwZVBhZGRpbmcpICsgXCIpXCI7IH07XHJcblxyXG4gICAgICAgIHRleHRUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAobWF4VyArIGxhYmVsT2Zmc2V0KSArIFwiLFwiICtcclxuICAgICAgICAgIChzaGFwZVNpemVbaV0ueSArIHNoYXBlU2l6ZVtpXS5oZWlnaHQvMiArIDUpICsgXCIpXCI7IH07XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKG9yaWVudCA9PT0gXCJob3Jpem9udGFsXCIpe1xyXG4gICAgICAgIGNlbGxUcmFucyA9IGZ1bmN0aW9uKGQsaSkge1xyXG4gICAgICAgICAgICB2YXIgd2lkdGggPSBkMy5zdW0oc2hhcGVTaXplLnNsaWNlKDAsIGkgKyAxICksIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC53aWR0aDsgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArICh3aWR0aCArIGkqc2hhcGVQYWRkaW5nKSArIFwiLDApXCI7IH07XHJcblxyXG4gICAgICAgIHRleHRUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAoc2hhcGVTaXplW2ldLndpZHRoKnRleHRBbGlnbiAgKyBzaGFwZVNpemVbaV0ueCkgKyBcIixcIiArXHJcbiAgICAgICAgICAgICAgKG1heEggKyBsYWJlbE9mZnNldCApICsgXCIpXCI7IH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGhlbHBlci5kM19wbGFjZW1lbnQob3JpZW50LCBjZWxsLCBjZWxsVHJhbnMsIHRleHQsIHRleHRUcmFucywgbGFiZWxBbGlnbik7XHJcbiAgICAgIGhlbHBlci5kM190aXRsZShzdmcsIGxlZ2VuZEcsIHRpdGxlLCBjbGFzc1ByZWZpeCk7XHJcblxyXG4gICAgICBjZWxsLnRyYW5zaXRpb24oKS5zdHlsZShcIm9wYWNpdHlcIiwgMSk7XHJcblxyXG4gICAgfVxyXG5cclxuICBsZWdlbmQuc2NhbGUgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzY2FsZTtcclxuICAgIHNjYWxlID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmNlbGxzID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY2VsbHM7XHJcbiAgICBpZiAoXy5sZW5ndGggPiAxIHx8IF8gPj0gMiApe1xyXG4gICAgICBjZWxscyA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG5cclxuICBsZWdlbmQuc2hhcGUgPSBmdW5jdGlvbihfLCBkKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZTtcclxuICAgIGlmIChfID09IFwicmVjdFwiIHx8IF8gPT0gXCJjaXJjbGVcIiB8fCBfID09IFwibGluZVwiICl7XHJcbiAgICAgIHNoYXBlID0gXztcclxuICAgICAgcGF0aCA9IGQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5zaGFwZVdpZHRoID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGVXaWR0aDtcclxuICAgIHNoYXBlV2lkdGggPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlUGFkZGluZyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlUGFkZGluZztcclxuICAgIHNoYXBlUGFkZGluZyA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxzID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxzO1xyXG4gICAgbGFiZWxzID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsQWxpZ24gPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbEFsaWduO1xyXG4gICAgaWYgKF8gPT0gXCJzdGFydFwiIHx8IF8gPT0gXCJlbmRcIiB8fCBfID09IFwibWlkZGxlXCIpIHtcclxuICAgICAgbGFiZWxBbGlnbiA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbEZvcm1hdCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsRm9ybWF0O1xyXG4gICAgbGFiZWxGb3JtYXQgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxPZmZzZXQgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbE9mZnNldDtcclxuICAgIGxhYmVsT2Zmc2V0ID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbERlbGltaXRlciA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsRGVsaW1pdGVyO1xyXG4gICAgbGFiZWxEZWxpbWl0ZXIgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQub3JpZW50ID0gZnVuY3Rpb24oXyl7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBvcmllbnQ7XHJcbiAgICBfID0gXy50b0xvd2VyQ2FzZSgpO1xyXG4gICAgaWYgKF8gPT0gXCJob3Jpem9udGFsXCIgfHwgXyA9PSBcInZlcnRpY2FsXCIpIHtcclxuICAgICAgb3JpZW50ID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmFzY2VuZGluZyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGFzY2VuZGluZztcclxuICAgIGFzY2VuZGluZyA9ICEhXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmNsYXNzUHJlZml4ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY2xhc3NQcmVmaXg7XHJcbiAgICBjbGFzc1ByZWZpeCA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC50aXRsZSA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHRpdGxlO1xyXG4gICAgdGl0bGUgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBkMy5yZWJpbmQobGVnZW5kLCBsZWdlbmREaXNwYXRjaGVyLCBcIm9uXCIpO1xyXG5cclxuICByZXR1cm4gbGVnZW5kO1xyXG5cclxufTtcclxuIiwidmFyIGhlbHBlciA9IHJlcXVpcmUoJy4vbGVnZW5kJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XHJcblxyXG4gIHZhciBzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLFxyXG4gICAgc2hhcGUgPSBcInBhdGhcIixcclxuICAgIHNoYXBlV2lkdGggPSAxNSxcclxuICAgIHNoYXBlSGVpZ2h0ID0gMTUsXHJcbiAgICBzaGFwZVJhZGl1cyA9IDEwLFxyXG4gICAgc2hhcGVQYWRkaW5nID0gNSxcclxuICAgIGNlbGxzID0gWzVdLFxyXG4gICAgbGFiZWxzID0gW10sXHJcbiAgICBjbGFzc1ByZWZpeCA9IFwiXCIsXHJcbiAgICB1c2VDbGFzcyA9IGZhbHNlLFxyXG4gICAgdGl0bGUgPSBcIlwiLFxyXG4gICAgbGFiZWxGb3JtYXQgPSBkMy5mb3JtYXQoXCIuMDFmXCIpLFxyXG4gICAgbGFiZWxBbGlnbiA9IFwibWlkZGxlXCIsXHJcbiAgICBsYWJlbE9mZnNldCA9IDEwLFxyXG4gICAgbGFiZWxEZWxpbWl0ZXIgPSBcInRvXCIsXHJcbiAgICBvcmllbnQgPSBcInZlcnRpY2FsXCIsXHJcbiAgICBhc2NlbmRpbmcgPSBmYWxzZSxcclxuICAgIGxlZ2VuZERpc3BhdGNoZXIgPSBkMy5kaXNwYXRjaChcImNlbGxvdmVyXCIsIFwiY2VsbG91dFwiLCBcImNlbGxjbGlja1wiKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsZWdlbmQoc3ZnKXtcclxuXHJcbiAgICAgIHZhciB0eXBlID0gaGVscGVyLmQzX2NhbGNUeXBlKHNjYWxlLCBhc2NlbmRpbmcsIGNlbGxzLCBsYWJlbHMsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlciksXHJcbiAgICAgICAgbGVnZW5kRyA9IHN2Zy5zZWxlY3RBbGwoJ2cnKS5kYXRhKFtzY2FsZV0pO1xyXG5cclxuICAgICAgbGVnZW5kRy5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgY2xhc3NQcmVmaXggKyAnbGVnZW5kQ2VsbHMnKTtcclxuXHJcbiAgICAgIHZhciBjZWxsID0gbGVnZW5kRy5zZWxlY3RBbGwoXCIuXCIgKyBjbGFzc1ByZWZpeCArIFwiY2VsbFwiKS5kYXRhKHR5cGUuZGF0YSksXHJcbiAgICAgICAgY2VsbEVudGVyID0gY2VsbC5lbnRlcigpLmFwcGVuZChcImdcIiwgXCIuY2VsbFwiKS5hdHRyKFwiY2xhc3NcIiwgY2xhc3NQcmVmaXggKyBcImNlbGxcIikuc3R5bGUoXCJvcGFjaXR5XCIsIDFlLTYpLFxyXG4gICAgICAgIHNoYXBlRW50ZXIgPSBjZWxsRW50ZXIuYXBwZW5kKHNoYXBlKS5hdHRyKFwiY2xhc3NcIiwgY2xhc3NQcmVmaXggKyBcInN3YXRjaFwiKSxcclxuICAgICAgICBzaGFwZXMgPSBjZWxsLnNlbGVjdChcImcuXCIgKyBjbGFzc1ByZWZpeCArIFwiY2VsbCBcIiArIHNoYXBlKTtcclxuXHJcbiAgICAgIC8vYWRkIGV2ZW50IGhhbmRsZXJzXHJcbiAgICAgIGhlbHBlci5kM19hZGRFdmVudHMoY2VsbEVudGVyLCBsZWdlbmREaXNwYXRjaGVyKTtcclxuXHJcbiAgICAgIC8vcmVtb3ZlIG9sZCBzaGFwZXNcclxuICAgICAgY2VsbC5leGl0KCkudHJhbnNpdGlvbigpLnN0eWxlKFwib3BhY2l0eVwiLCAwKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgIGhlbHBlci5kM19kcmF3U2hhcGVzKHNoYXBlLCBzaGFwZXMsIHNoYXBlSGVpZ2h0LCBzaGFwZVdpZHRoLCBzaGFwZVJhZGl1cywgdHlwZS5mZWF0dXJlKTtcclxuICAgICAgaGVscGVyLmQzX2FkZFRleHQobGVnZW5kRywgY2VsbEVudGVyLCB0eXBlLmxhYmVscywgY2xhc3NQcmVmaXgpXHJcblxyXG4gICAgICAvLyBzZXRzIHBsYWNlbWVudFxyXG4gICAgICB2YXIgdGV4dCA9IGNlbGwuc2VsZWN0KFwidGV4dFwiKSxcclxuICAgICAgICBzaGFwZVNpemUgPSBzaGFwZXNbMF0ubWFwKCBmdW5jdGlvbihkKXsgcmV0dXJuIGQuZ2V0QkJveCgpOyB9KTtcclxuXHJcbiAgICAgIHZhciBtYXhIID0gZDMubWF4KHNoYXBlU2l6ZSwgZnVuY3Rpb24oZCl7IHJldHVybiBkLmhlaWdodDsgfSksXHJcbiAgICAgIG1heFcgPSBkMy5tYXgoc2hhcGVTaXplLCBmdW5jdGlvbihkKXsgcmV0dXJuIGQud2lkdGg7IH0pO1xyXG5cclxuICAgICAgdmFyIGNlbGxUcmFucyxcclxuICAgICAgdGV4dFRyYW5zLFxyXG4gICAgICB0ZXh0QWxpZ24gPSAobGFiZWxBbGlnbiA9PSBcInN0YXJ0XCIpID8gMCA6IChsYWJlbEFsaWduID09IFwibWlkZGxlXCIpID8gMC41IDogMTtcclxuXHJcbiAgICAgIC8vcG9zaXRpb25zIGNlbGxzIGFuZCB0ZXh0XHJcbiAgICAgIGlmIChvcmllbnQgPT09IFwidmVydGljYWxcIil7XHJcbiAgICAgICAgY2VsbFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZSgwLCBcIiArIChpICogKG1heEggKyBzaGFwZVBhZGRpbmcpKSArIFwiKVwiOyB9O1xyXG4gICAgICAgIHRleHRUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAobWF4VyArIGxhYmVsT2Zmc2V0KSArIFwiLFwiICtcclxuICAgICAgICAgICAgICAoc2hhcGVTaXplW2ldLnkgKyBzaGFwZVNpemVbaV0uaGVpZ2h0LzIgKyA1KSArIFwiKVwiOyB9O1xyXG5cclxuICAgICAgfSBlbHNlIGlmIChvcmllbnQgPT09IFwiaG9yaXpvbnRhbFwiKXtcclxuICAgICAgICBjZWxsVHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKGkgKiAobWF4VyArIHNoYXBlUGFkZGluZykpICsgXCIsMClcIjsgfTtcclxuICAgICAgICB0ZXh0VHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKHNoYXBlU2l6ZVtpXS53aWR0aCp0ZXh0QWxpZ24gICsgc2hhcGVTaXplW2ldLngpICsgXCIsXCIgK1xyXG4gICAgICAgICAgICAgIChtYXhIICsgbGFiZWxPZmZzZXQgKSArIFwiKVwiOyB9O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBoZWxwZXIuZDNfcGxhY2VtZW50KG9yaWVudCwgY2VsbCwgY2VsbFRyYW5zLCB0ZXh0LCB0ZXh0VHJhbnMsIGxhYmVsQWxpZ24pO1xyXG4gICAgICBoZWxwZXIuZDNfdGl0bGUoc3ZnLCBsZWdlbmRHLCB0aXRsZSwgY2xhc3NQcmVmaXgpO1xyXG4gICAgICBjZWxsLnRyYW5zaXRpb24oKS5zdHlsZShcIm9wYWNpdHlcIiwgMSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgbGVnZW5kLnNjYWxlID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2NhbGU7XHJcbiAgICBzY2FsZSA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5jZWxscyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGNlbGxzO1xyXG4gICAgaWYgKF8ubGVuZ3RoID4gMSB8fCBfID49IDIgKXtcclxuICAgICAgY2VsbHMgPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuc2hhcGVQYWRkaW5nID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGVQYWRkaW5nO1xyXG4gICAgc2hhcGVQYWRkaW5nID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbHMgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbHM7XHJcbiAgICBsYWJlbHMgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxBbGlnbiA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsQWxpZ247XHJcbiAgICBpZiAoXyA9PSBcInN0YXJ0XCIgfHwgXyA9PSBcImVuZFwiIHx8IF8gPT0gXCJtaWRkbGVcIikge1xyXG4gICAgICBsYWJlbEFsaWduID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsRm9ybWF0ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxGb3JtYXQ7XHJcbiAgICBsYWJlbEZvcm1hdCA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbE9mZnNldCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsT2Zmc2V0O1xyXG4gICAgbGFiZWxPZmZzZXQgPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsRGVsaW1pdGVyID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxEZWxpbWl0ZXI7XHJcbiAgICBsYWJlbERlbGltaXRlciA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5vcmllbnQgPSBmdW5jdGlvbihfKXtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIG9yaWVudDtcclxuICAgIF8gPSBfLnRvTG93ZXJDYXNlKCk7XHJcbiAgICBpZiAoXyA9PSBcImhvcml6b250YWxcIiB8fCBfID09IFwidmVydGljYWxcIikge1xyXG4gICAgICBvcmllbnQgPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuYXNjZW5kaW5nID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gYXNjZW5kaW5nO1xyXG4gICAgYXNjZW5kaW5nID0gISFfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuY2xhc3NQcmVmaXggPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBjbGFzc1ByZWZpeDtcclxuICAgIGNsYXNzUHJlZml4ID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnRpdGxlID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdGl0bGU7XHJcbiAgICB0aXRsZSA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGQzLnJlYmluZChsZWdlbmQsIGxlZ2VuZERpc3BhdGNoZXIsIFwib25cIik7XHJcblxyXG4gIHJldHVybiBsZWdlbmQ7XHJcblxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG4vKipcclxuICogKipbR2F1c3NpYW4gZXJyb3IgZnVuY3Rpb25dKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRXJyb3JfZnVuY3Rpb24pKipcclxuICpcclxuICogVGhlIGBlcnJvckZ1bmN0aW9uKHgvKHNkICogTWF0aC5zcXJ0KDIpKSlgIGlzIHRoZSBwcm9iYWJpbGl0eSB0aGF0IGEgdmFsdWUgaW4gYVxyXG4gKiBub3JtYWwgZGlzdHJpYnV0aW9uIHdpdGggc3RhbmRhcmQgZGV2aWF0aW9uIHNkIGlzIHdpdGhpbiB4IG9mIHRoZSBtZWFuLlxyXG4gKlxyXG4gKiBUaGlzIGZ1bmN0aW9uIHJldHVybnMgYSBudW1lcmljYWwgYXBwcm94aW1hdGlvbiB0byB0aGUgZXhhY3QgdmFsdWUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4IGlucHV0XHJcbiAqIEByZXR1cm4ge251bWJlcn0gZXJyb3IgZXN0aW1hdGlvblxyXG4gKiBAZXhhbXBsZVxyXG4gKiBlcnJvckZ1bmN0aW9uKDEpOyAvLz0gMC44NDI3XHJcbiAqL1xyXG5mdW5jdGlvbiBlcnJvckZ1bmN0aW9uKHgvKjogbnVtYmVyICovKS8qOiBudW1iZXIgKi8ge1xyXG4gICAgdmFyIHQgPSAxIC8gKDEgKyAwLjUgKiBNYXRoLmFicyh4KSk7XHJcbiAgICB2YXIgdGF1ID0gdCAqIE1hdGguZXhwKC1NYXRoLnBvdyh4LCAyKSAtXHJcbiAgICAgICAgMS4yNjU1MTIyMyArXHJcbiAgICAgICAgMS4wMDAwMjM2OCAqIHQgK1xyXG4gICAgICAgIDAuMzc0MDkxOTYgKiBNYXRoLnBvdyh0LCAyKSArXHJcbiAgICAgICAgMC4wOTY3ODQxOCAqIE1hdGgucG93KHQsIDMpIC1cclxuICAgICAgICAwLjE4NjI4ODA2ICogTWF0aC5wb3codCwgNCkgK1xyXG4gICAgICAgIDAuMjc4ODY4MDcgKiBNYXRoLnBvdyh0LCA1KSAtXHJcbiAgICAgICAgMS4xMzUyMDM5OCAqIE1hdGgucG93KHQsIDYpICtcclxuICAgICAgICAxLjQ4ODUxNTg3ICogTWF0aC5wb3codCwgNykgLVxyXG4gICAgICAgIDAuODIyMTUyMjMgKiBNYXRoLnBvdyh0LCA4KSArXHJcbiAgICAgICAgMC4xNzA4NzI3NyAqIE1hdGgucG93KHQsIDkpKTtcclxuICAgIGlmICh4ID49IDApIHtcclxuICAgICAgICByZXR1cm4gMSAtIHRhdTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRhdSAtIDE7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZXJyb3JGdW5jdGlvbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxuLyoqXHJcbiAqIFtTaW1wbGUgbGluZWFyIHJlZ3Jlc3Npb25dKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvU2ltcGxlX2xpbmVhcl9yZWdyZXNzaW9uKVxyXG4gKiBpcyBhIHNpbXBsZSB3YXkgdG8gZmluZCBhIGZpdHRlZCBsaW5lXHJcbiAqIGJldHdlZW4gYSBzZXQgb2YgY29vcmRpbmF0ZXMuIFRoaXMgYWxnb3JpdGhtIGZpbmRzIHRoZSBzbG9wZSBhbmQgeS1pbnRlcmNlcHQgb2YgYSByZWdyZXNzaW9uIGxpbmVcclxuICogdXNpbmcgdGhlIGxlYXN0IHN1bSBvZiBzcXVhcmVzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PEFycmF5PG51bWJlcj4+fSBkYXRhIGFuIGFycmF5IG9mIHR3by1lbGVtZW50IG9mIGFycmF5cyxcclxuICogbGlrZSBgW1swLCAxXSwgWzIsIDNdXWBcclxuICogQHJldHVybnMge09iamVjdH0gb2JqZWN0IGNvbnRhaW5pbmcgc2xvcGUgYW5kIGludGVyc2VjdCBvZiByZWdyZXNzaW9uIGxpbmVcclxuICogQGV4YW1wbGVcclxuICogbGluZWFyUmVncmVzc2lvbihbWzAsIDBdLCBbMSwgMV1dKTsgLy8geyBtOiAxLCBiOiAwIH1cclxuICovXHJcbmZ1bmN0aW9uIGxpbmVhclJlZ3Jlc3Npb24oZGF0YS8qOiBBcnJheTxBcnJheTxudW1iZXI+PiAqLykvKjogeyBtOiBudW1iZXIsIGI6IG51bWJlciB9ICovIHtcclxuXHJcbiAgICB2YXIgbSwgYjtcclxuXHJcbiAgICAvLyBTdG9yZSBkYXRhIGxlbmd0aCBpbiBhIGxvY2FsIHZhcmlhYmxlIHRvIHJlZHVjZVxyXG4gICAgLy8gcmVwZWF0ZWQgb2JqZWN0IHByb3BlcnR5IGxvb2t1cHNcclxuICAgIHZhciBkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGg7XHJcblxyXG4gICAgLy9pZiB0aGVyZSdzIG9ubHkgb25lIHBvaW50LCBhcmJpdHJhcmlseSBjaG9vc2UgYSBzbG9wZSBvZiAwXHJcbiAgICAvL2FuZCBhIHktaW50ZXJjZXB0IG9mIHdoYXRldmVyIHRoZSB5IG9mIHRoZSBpbml0aWFsIHBvaW50IGlzXHJcbiAgICBpZiAoZGF0YUxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIG0gPSAwO1xyXG4gICAgICAgIGIgPSBkYXRhWzBdWzFdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBJbml0aWFsaXplIG91ciBzdW1zIGFuZCBzY29wZSB0aGUgYG1gIGFuZCBgYmBcclxuICAgICAgICAvLyB2YXJpYWJsZXMgdGhhdCBkZWZpbmUgdGhlIGxpbmUuXHJcbiAgICAgICAgdmFyIHN1bVggPSAwLCBzdW1ZID0gMCxcclxuICAgICAgICAgICAgc3VtWFggPSAwLCBzdW1YWSA9IDA7XHJcblxyXG4gICAgICAgIC8vIFVzZSBsb2NhbCB2YXJpYWJsZXMgdG8gZ3JhYiBwb2ludCB2YWx1ZXNcclxuICAgICAgICAvLyB3aXRoIG1pbmltYWwgb2JqZWN0IHByb3BlcnR5IGxvb2t1cHNcclxuICAgICAgICB2YXIgcG9pbnQsIHgsIHk7XHJcblxyXG4gICAgICAgIC8vIEdhdGhlciB0aGUgc3VtIG9mIGFsbCB4IHZhbHVlcywgdGhlIHN1bSBvZiBhbGxcclxuICAgICAgICAvLyB5IHZhbHVlcywgYW5kIHRoZSBzdW0gb2YgeF4yIGFuZCAoeCp5KSBmb3IgZWFjaFxyXG4gICAgICAgIC8vIHZhbHVlLlxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gSW4gbWF0aCBub3RhdGlvbiwgdGhlc2Ugd291bGQgYmUgU1NfeCwgU1NfeSwgU1NfeHgsIGFuZCBTU194eVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YUxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHBvaW50ID0gZGF0YVtpXTtcclxuICAgICAgICAgICAgeCA9IHBvaW50WzBdO1xyXG4gICAgICAgICAgICB5ID0gcG9pbnRbMV07XHJcblxyXG4gICAgICAgICAgICBzdW1YICs9IHg7XHJcbiAgICAgICAgICAgIHN1bVkgKz0geTtcclxuXHJcbiAgICAgICAgICAgIHN1bVhYICs9IHggKiB4O1xyXG4gICAgICAgICAgICBzdW1YWSArPSB4ICogeTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGBtYCBpcyB0aGUgc2xvcGUgb2YgdGhlIHJlZ3Jlc3Npb24gbGluZVxyXG4gICAgICAgIG0gPSAoKGRhdGFMZW5ndGggKiBzdW1YWSkgLSAoc3VtWCAqIHN1bVkpKSAvXHJcbiAgICAgICAgICAgICgoZGF0YUxlbmd0aCAqIHN1bVhYKSAtIChzdW1YICogc3VtWCkpO1xyXG5cclxuICAgICAgICAvLyBgYmAgaXMgdGhlIHktaW50ZXJjZXB0IG9mIHRoZSBsaW5lLlxyXG4gICAgICAgIGIgPSAoc3VtWSAvIGRhdGFMZW5ndGgpIC0gKChtICogc3VtWCkgLyBkYXRhTGVuZ3RoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZXR1cm4gYm90aCB2YWx1ZXMgYXMgYW4gb2JqZWN0LlxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBtOiBtLFxyXG4gICAgICAgIGI6IGJcclxuICAgIH07XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxpbmVhclJlZ3Jlc3Npb247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbi8qKlxyXG4gKiBHaXZlbiB0aGUgb3V0cHV0IG9mIGBsaW5lYXJSZWdyZXNzaW9uYDogYW4gb2JqZWN0XHJcbiAqIHdpdGggYG1gIGFuZCBgYmAgdmFsdWVzIGluZGljYXRpbmcgc2xvcGUgYW5kIGludGVyY2VwdCxcclxuICogcmVzcGVjdGl2ZWx5LCBnZW5lcmF0ZSBhIGxpbmUgZnVuY3Rpb24gdGhhdCB0cmFuc2xhdGVzXHJcbiAqIHggdmFsdWVzIGludG8geSB2YWx1ZXMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYiBvYmplY3Qgd2l0aCBgbWAgYW5kIGBiYCBtZW1iZXJzLCByZXByZXNlbnRpbmdcclxuICogc2xvcGUgYW5kIGludGVyc2VjdCBvZiBkZXNpcmVkIGxpbmVcclxuICogQHJldHVybnMge0Z1bmN0aW9ufSBtZXRob2QgdGhhdCBjb21wdXRlcyB5LXZhbHVlIGF0IGFueSBnaXZlblxyXG4gKiB4LXZhbHVlIG9uIHRoZSBsaW5lLlxyXG4gKiBAZXhhbXBsZVxyXG4gKiB2YXIgbCA9IGxpbmVhclJlZ3Jlc3Npb25MaW5lKGxpbmVhclJlZ3Jlc3Npb24oW1swLCAwXSwgWzEsIDFdXSkpO1xyXG4gKiBsKDApIC8vPSAwXHJcbiAqIGwoMikgLy89IDJcclxuICovXHJcbmZ1bmN0aW9uIGxpbmVhclJlZ3Jlc3Npb25MaW5lKG1iLyo6IHsgYjogbnVtYmVyLCBtOiBudW1iZXIgfSovKS8qOiBGdW5jdGlvbiAqLyB7XHJcbiAgICAvLyBSZXR1cm4gYSBmdW5jdGlvbiB0aGF0IGNvbXB1dGVzIGEgYHlgIHZhbHVlIGZvciBlYWNoXHJcbiAgICAvLyB4IHZhbHVlIGl0IGlzIGdpdmVuLCBiYXNlZCBvbiB0aGUgdmFsdWVzIG9mIGBiYCBhbmQgYGFgXHJcbiAgICAvLyB0aGF0IHdlIGp1c3QgY29tcHV0ZWQuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24oeCkge1xyXG4gICAgICAgIHJldHVybiBtYi5iICsgKG1iLm0gKiB4KTtcclxuICAgIH07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGluZWFyUmVncmVzc2lvbkxpbmU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBzdW0gPSByZXF1aXJlKCcuL3N1bScpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBtZWFuLCBfYWxzbyBrbm93biBhcyBhdmVyYWdlXyxcclxuICogaXMgdGhlIHN1bSBvZiBhbGwgdmFsdWVzIG92ZXIgdGhlIG51bWJlciBvZiB2YWx1ZXMuXHJcbiAqIFRoaXMgaXMgYSBbbWVhc3VyZSBvZiBjZW50cmFsIHRlbmRlbmN5XShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9DZW50cmFsX3RlbmRlbmN5KTpcclxuICogYSBtZXRob2Qgb2YgZmluZGluZyBhIHR5cGljYWwgb3IgY2VudHJhbCB2YWx1ZSBvZiBhIHNldCBvZiBudW1iZXJzLlxyXG4gKlxyXG4gKiBUaGlzIHJ1bnMgb24gYE8obilgLCBsaW5lYXIgdGltZSBpbiByZXNwZWN0IHRvIHRoZSBhcnJheVxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggaW5wdXQgdmFsdWVzXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IG1lYW5cclxuICogQGV4YW1wbGVcclxuICogY29uc29sZS5sb2cobWVhbihbMCwgMTBdKSk7IC8vIDVcclxuICovXHJcbmZ1bmN0aW9uIG1lYW4oeCAvKjogQXJyYXk8bnVtYmVyPiAqLykvKjpudW1iZXIqLyB7XHJcbiAgICAvLyBUaGUgbWVhbiBvZiBubyBudW1iZXJzIGlzIG51bGxcclxuICAgIGlmICh4Lmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gTmFOOyB9XHJcblxyXG4gICAgcmV0dXJuIHN1bSh4KSAvIHgubGVuZ3RoO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1lYW47XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBzYW1wbGVDb3ZhcmlhbmNlID0gcmVxdWlyZSgnLi9zYW1wbGVfY292YXJpYW5jZScpO1xyXG52YXIgc2FtcGxlU3RhbmRhcmREZXZpYXRpb24gPSByZXF1aXJlKCcuL3NhbXBsZV9zdGFuZGFyZF9kZXZpYXRpb24nKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgW2NvcnJlbGF0aW9uXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0NvcnJlbGF0aW9uX2FuZF9kZXBlbmRlbmNlKSBpc1xyXG4gKiBhIG1lYXN1cmUgb2YgaG93IGNvcnJlbGF0ZWQgdHdvIGRhdGFzZXRzIGFyZSwgYmV0d2VlbiAtMSBhbmQgMVxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggZmlyc3QgaW5wdXRcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB5IHNlY29uZCBpbnB1dFxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBzYW1wbGUgY29ycmVsYXRpb25cclxuICogQGV4YW1wbGVcclxuICogdmFyIGEgPSBbMSwgMiwgMywgNCwgNSwgNl07XHJcbiAqIHZhciBiID0gWzIsIDIsIDMsIDQsIDUsIDYwXTtcclxuICogc2FtcGxlQ29ycmVsYXRpb24oYSwgYik7IC8vPSAwLjY5MVxyXG4gKi9cclxuZnVuY3Rpb24gc2FtcGxlQ29ycmVsYXRpb24oeC8qOiBBcnJheTxudW1iZXI+ICovLCB5Lyo6IEFycmF5PG51bWJlcj4gKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgdmFyIGNvdiA9IHNhbXBsZUNvdmFyaWFuY2UoeCwgeSksXHJcbiAgICAgICAgeHN0ZCA9IHNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uKHgpLFxyXG4gICAgICAgIHlzdGQgPSBzYW1wbGVTdGFuZGFyZERldmlhdGlvbih5KTtcclxuXHJcbiAgICByZXR1cm4gY292IC8geHN0ZCAvIHlzdGQ7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2FtcGxlQ29ycmVsYXRpb247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBtZWFuID0gcmVxdWlyZSgnLi9tZWFuJyk7XHJcblxyXG4vKipcclxuICogW1NhbXBsZSBjb3ZhcmlhbmNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TYW1wbGVfbWVhbl9hbmRfc2FtcGxlQ292YXJpYW5jZSkgb2YgdHdvIGRhdGFzZXRzOlxyXG4gKiBob3cgbXVjaCBkbyB0aGUgdHdvIGRhdGFzZXRzIG1vdmUgdG9nZXRoZXI/XHJcbiAqIHggYW5kIHkgYXJlIHR3byBkYXRhc2V0cywgcmVwcmVzZW50ZWQgYXMgYXJyYXlzIG9mIG51bWJlcnMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBmaXJzdCBpbnB1dFxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHkgc2Vjb25kIGlucHV0XHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHNhbXBsZSBjb3ZhcmlhbmNlXHJcbiAqIEBleGFtcGxlXHJcbiAqIHZhciB4ID0gWzEsIDIsIDMsIDQsIDUsIDZdO1xyXG4gKiB2YXIgeSA9IFs2LCA1LCA0LCAzLCAyLCAxXTtcclxuICogc2FtcGxlQ292YXJpYW5jZSh4LCB5KTsgLy89IC0zLjVcclxuICovXHJcbmZ1bmN0aW9uIHNhbXBsZUNvdmFyaWFuY2UoeCAvKjpBcnJheTxudW1iZXI+Ki8sIHkgLyo6QXJyYXk8bnVtYmVyPiovKS8qOm51bWJlciovIHtcclxuXHJcbiAgICAvLyBUaGUgdHdvIGRhdGFzZXRzIG11c3QgaGF2ZSB0aGUgc2FtZSBsZW5ndGggd2hpY2ggbXVzdCBiZSBtb3JlIHRoYW4gMVxyXG4gICAgaWYgKHgubGVuZ3RoIDw9IDEgfHwgeC5sZW5ndGggIT09IHkubGVuZ3RoKSB7XHJcbiAgICAgICAgcmV0dXJuIE5hTjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBkZXRlcm1pbmUgdGhlIG1lYW4gb2YgZWFjaCBkYXRhc2V0IHNvIHRoYXQgd2UgY2FuIGp1ZGdlIGVhY2hcclxuICAgIC8vIHZhbHVlIG9mIHRoZSBkYXRhc2V0IGZhaXJseSBhcyB0aGUgZGlmZmVyZW5jZSBmcm9tIHRoZSBtZWFuLiB0aGlzXHJcbiAgICAvLyB3YXksIGlmIG9uZSBkYXRhc2V0IGlzIFsxLCAyLCAzXSBhbmQgWzIsIDMsIDRdLCB0aGVpciBjb3ZhcmlhbmNlXHJcbiAgICAvLyBkb2VzIG5vdCBzdWZmZXIgYmVjYXVzZSBvZiB0aGUgZGlmZmVyZW5jZSBpbiBhYnNvbHV0ZSB2YWx1ZXNcclxuICAgIHZhciB4bWVhbiA9IG1lYW4oeCksXHJcbiAgICAgICAgeW1lYW4gPSBtZWFuKHkpLFxyXG4gICAgICAgIHN1bSA9IDA7XHJcblxyXG4gICAgLy8gZm9yIGVhY2ggcGFpciBvZiB2YWx1ZXMsIHRoZSBjb3ZhcmlhbmNlIGluY3JlYXNlcyB3aGVuIHRoZWlyXHJcbiAgICAvLyBkaWZmZXJlbmNlIGZyb20gdGhlIG1lYW4gaXMgYXNzb2NpYXRlZCAtIGlmIGJvdGggYXJlIHdlbGwgYWJvdmVcclxuICAgIC8vIG9yIGlmIGJvdGggYXJlIHdlbGwgYmVsb3dcclxuICAgIC8vIHRoZSBtZWFuLCB0aGUgY292YXJpYW5jZSBpbmNyZWFzZXMgc2lnbmlmaWNhbnRseS5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHN1bSArPSAoeFtpXSAtIHhtZWFuKSAqICh5W2ldIC0geW1lYW4pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRoaXMgaXMgQmVzc2VscycgQ29ycmVjdGlvbjogYW4gYWRqdXN0bWVudCBtYWRlIHRvIHNhbXBsZSBzdGF0aXN0aWNzXHJcbiAgICAvLyB0aGF0IGFsbG93cyBmb3IgdGhlIHJlZHVjZWQgZGVncmVlIG9mIGZyZWVkb20gZW50YWlsZWQgaW4gY2FsY3VsYXRpbmdcclxuICAgIC8vIHZhbHVlcyBmcm9tIHNhbXBsZXMgcmF0aGVyIHRoYW4gY29tcGxldGUgcG9wdWxhdGlvbnMuXHJcbiAgICB2YXIgYmVzc2Vsc0NvcnJlY3Rpb24gPSB4Lmxlbmd0aCAtIDE7XHJcblxyXG4gICAgLy8gdGhlIGNvdmFyaWFuY2UgaXMgd2VpZ2h0ZWQgYnkgdGhlIGxlbmd0aCBvZiB0aGUgZGF0YXNldHMuXHJcbiAgICByZXR1cm4gc3VtIC8gYmVzc2Vsc0NvcnJlY3Rpb247XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2FtcGxlQ292YXJpYW5jZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIHNhbXBsZVZhcmlhbmNlID0gcmVxdWlyZSgnLi9zYW1wbGVfdmFyaWFuY2UnKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgW3N0YW5kYXJkIGRldmlhdGlvbl0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TdGFuZGFyZF9kZXZpYXRpb24pXHJcbiAqIGlzIHRoZSBzcXVhcmUgcm9vdCBvZiB0aGUgdmFyaWFuY2UuXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBpbnB1dCBhcnJheVxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBzYW1wbGUgc3RhbmRhcmQgZGV2aWF0aW9uXHJcbiAqIEBleGFtcGxlXHJcbiAqIHNzLnNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uKFsyLCA0LCA0LCA0LCA1LCA1LCA3LCA5XSk7XHJcbiAqIC8vPSAyLjEzOFxyXG4gKi9cclxuZnVuY3Rpb24gc2FtcGxlU3RhbmRhcmREZXZpYXRpb24oeC8qOkFycmF5PG51bWJlcj4qLykvKjpudW1iZXIqLyB7XHJcbiAgICAvLyBUaGUgc3RhbmRhcmQgZGV2aWF0aW9uIG9mIG5vIG51bWJlcnMgaXMgbnVsbFxyXG4gICAgdmFyIHNhbXBsZVZhcmlhbmNlWCA9IHNhbXBsZVZhcmlhbmNlKHgpO1xyXG4gICAgaWYgKGlzTmFOKHNhbXBsZVZhcmlhbmNlWCkpIHsgcmV0dXJuIE5hTjsgfVxyXG4gICAgcmV0dXJuIE1hdGguc3FydChzYW1wbGVWYXJpYW5jZVgpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgc3VtTnRoUG93ZXJEZXZpYXRpb25zID0gcmVxdWlyZSgnLi9zdW1fbnRoX3Bvd2VyX2RldmlhdGlvbnMnKTtcclxuXHJcbi8qXHJcbiAqIFRoZSBbc2FtcGxlIHZhcmlhbmNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9WYXJpYW5jZSNTYW1wbGVfdmFyaWFuY2UpXHJcbiAqIGlzIHRoZSBzdW0gb2Ygc3F1YXJlZCBkZXZpYXRpb25zIGZyb20gdGhlIG1lYW4uIFRoZSBzYW1wbGUgdmFyaWFuY2VcclxuICogaXMgZGlzdGluZ3Vpc2hlZCBmcm9tIHRoZSB2YXJpYW5jZSBieSB0aGUgdXNhZ2Ugb2YgW0Jlc3NlbCdzIENvcnJlY3Rpb25dKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Jlc3NlbCdzX2NvcnJlY3Rpb24pOlxyXG4gKiBpbnN0ZWFkIG9mIGRpdmlkaW5nIHRoZSBzdW0gb2Ygc3F1YXJlZCBkZXZpYXRpb25zIGJ5IHRoZSBsZW5ndGggb2YgdGhlIGlucHV0LFxyXG4gKiBpdCBpcyBkaXZpZGVkIGJ5IHRoZSBsZW5ndGggbWludXMgb25lLiBUaGlzIGNvcnJlY3RzIHRoZSBiaWFzIGluIGVzdGltYXRpbmdcclxuICogYSB2YWx1ZSBmcm9tIGEgc2V0IHRoYXQgeW91IGRvbid0IGtub3cgaWYgZnVsbC5cclxuICpcclxuICogUmVmZXJlbmNlczpcclxuICogKiBbV29sZnJhbSBNYXRoV29ybGQgb24gU2FtcGxlIFZhcmlhbmNlXShodHRwOi8vbWF0aHdvcmxkLndvbGZyYW0uY29tL1NhbXBsZVZhcmlhbmNlLmh0bWwpXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBpbnB1dCBhcnJheVxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IHNhbXBsZSB2YXJpYW5jZVxyXG4gKiBAZXhhbXBsZVxyXG4gKiBzYW1wbGVWYXJpYW5jZShbMSwgMiwgMywgNCwgNV0pOyAvLz0gMi41XHJcbiAqL1xyXG5mdW5jdGlvbiBzYW1wbGVWYXJpYW5jZSh4IC8qOiBBcnJheTxudW1iZXI+ICovKS8qOm51bWJlciovIHtcclxuICAgIC8vIFRoZSB2YXJpYW5jZSBvZiBubyBudW1iZXJzIGlzIG51bGxcclxuICAgIGlmICh4Lmxlbmd0aCA8PSAxKSB7IHJldHVybiBOYU47IH1cclxuXHJcbiAgICB2YXIgc3VtU3F1YXJlZERldmlhdGlvbnNWYWx1ZSA9IHN1bU50aFBvd2VyRGV2aWF0aW9ucyh4LCAyKTtcclxuXHJcbiAgICAvLyB0aGlzIGlzIEJlc3NlbHMnIENvcnJlY3Rpb246IGFuIGFkanVzdG1lbnQgbWFkZSB0byBzYW1wbGUgc3RhdGlzdGljc1xyXG4gICAgLy8gdGhhdCBhbGxvd3MgZm9yIHRoZSByZWR1Y2VkIGRlZ3JlZSBvZiBmcmVlZG9tIGVudGFpbGVkIGluIGNhbGN1bGF0aW5nXHJcbiAgICAvLyB2YWx1ZXMgZnJvbSBzYW1wbGVzIHJhdGhlciB0aGFuIGNvbXBsZXRlIHBvcHVsYXRpb25zLlxyXG4gICAgdmFyIGJlc3NlbHNDb3JyZWN0aW9uID0geC5sZW5ndGggLSAxO1xyXG5cclxuICAgIC8vIEZpbmQgdGhlIG1lYW4gdmFsdWUgb2YgdGhhdCBsaXN0XHJcbiAgICByZXR1cm4gc3VtU3F1YXJlZERldmlhdGlvbnNWYWx1ZSAvIGJlc3NlbHNDb3JyZWN0aW9uO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNhbXBsZVZhcmlhbmNlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgdmFyaWFuY2UgPSByZXF1aXJlKCcuL3ZhcmlhbmNlJyk7XHJcblxyXG4vKipcclxuICogVGhlIFtzdGFuZGFyZCBkZXZpYXRpb25dKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvU3RhbmRhcmRfZGV2aWF0aW9uKVxyXG4gKiBpcyB0aGUgc3F1YXJlIHJvb3Qgb2YgdGhlIHZhcmlhbmNlLiBJdCdzIHVzZWZ1bCBmb3IgbWVhc3VyaW5nIHRoZSBhbW91bnRcclxuICogb2YgdmFyaWF0aW9uIG9yIGRpc3BlcnNpb24gaW4gYSBzZXQgb2YgdmFsdWVzLlxyXG4gKlxyXG4gKiBTdGFuZGFyZCBkZXZpYXRpb24gaXMgb25seSBhcHByb3ByaWF0ZSBmb3IgZnVsbC1wb3B1bGF0aW9uIGtub3dsZWRnZTogZm9yXHJcbiAqIHNhbXBsZXMgb2YgYSBwb3B1bGF0aW9uLCB7QGxpbmsgc2FtcGxlU3RhbmRhcmREZXZpYXRpb259IGlzXHJcbiAqIG1vcmUgYXBwcm9wcmlhdGUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBpbnB1dFxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBzdGFuZGFyZCBkZXZpYXRpb25cclxuICogQGV4YW1wbGVcclxuICogdmFyIHNjb3JlcyA9IFsyLCA0LCA0LCA0LCA1LCA1LCA3LCA5XTtcclxuICogdmFyaWFuY2Uoc2NvcmVzKTsgLy89IDRcclxuICogc3RhbmRhcmREZXZpYXRpb24oc2NvcmVzKTsgLy89IDJcclxuICovXHJcbmZ1bmN0aW9uIHN0YW5kYXJkRGV2aWF0aW9uKHggLyo6IEFycmF5PG51bWJlcj4gKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgLy8gVGhlIHN0YW5kYXJkIGRldmlhdGlvbiBvZiBubyBudW1iZXJzIGlzIG51bGxcclxuICAgIHZhciB2ID0gdmFyaWFuY2UoeCk7XHJcbiAgICBpZiAoaXNOYU4odikpIHsgcmV0dXJuIDA7IH1cclxuICAgIHJldHVybiBNYXRoLnNxcnQodik7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc3RhbmRhcmREZXZpYXRpb247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbi8qKlxyXG4gKiBPdXIgZGVmYXVsdCBzdW0gaXMgdGhlIFtLYWhhbiBzdW1tYXRpb24gYWxnb3JpdGhtXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9LYWhhbl9zdW1tYXRpb25fYWxnb3JpdGhtKSBpc1xyXG4gKiBhIG1ldGhvZCBmb3IgY29tcHV0aW5nIHRoZSBzdW0gb2YgYSBsaXN0IG9mIG51bWJlcnMgd2hpbGUgY29ycmVjdGluZ1xyXG4gKiBmb3IgZmxvYXRpbmctcG9pbnQgZXJyb3JzLiBUcmFkaXRpb25hbGx5LCBzdW1zIGFyZSBjYWxjdWxhdGVkIGFzIG1hbnlcclxuICogc3VjY2Vzc2l2ZSBhZGRpdGlvbnMsIGVhY2ggb25lIHdpdGggaXRzIG93biBmbG9hdGluZy1wb2ludCByb3VuZG9mZi4gVGhlc2VcclxuICogbG9zc2VzIGluIHByZWNpc2lvbiBhZGQgdXAgYXMgdGhlIG51bWJlciBvZiBudW1iZXJzIGluY3JlYXNlcy4gVGhpcyBhbHRlcm5hdGl2ZVxyXG4gKiBhbGdvcml0aG0gaXMgbW9yZSBhY2N1cmF0ZSB0aGFuIHRoZSBzaW1wbGUgd2F5IG9mIGNhbGN1bGF0aW5nIHN1bXMgYnkgc2ltcGxlXHJcbiAqIGFkZGl0aW9uLlxyXG4gKlxyXG4gKiBUaGlzIHJ1bnMgb24gYE8obilgLCBsaW5lYXIgdGltZSBpbiByZXNwZWN0IHRvIHRoZSBhcnJheVxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggaW5wdXRcclxuICogQHJldHVybiB7bnVtYmVyfSBzdW0gb2YgYWxsIGlucHV0IG51bWJlcnNcclxuICogQGV4YW1wbGVcclxuICogY29uc29sZS5sb2coc3VtKFsxLCAyLCAzXSkpOyAvLyA2XHJcbiAqL1xyXG5mdW5jdGlvbiBzdW0oeC8qOiBBcnJheTxudW1iZXI+ICovKS8qOiBudW1iZXIgKi8ge1xyXG5cclxuICAgIC8vIGxpa2UgdGhlIHRyYWRpdGlvbmFsIHN1bSBhbGdvcml0aG0sIHdlIGtlZXAgYSBydW5uaW5nXHJcbiAgICAvLyBjb3VudCBvZiB0aGUgY3VycmVudCBzdW0uXHJcbiAgICB2YXIgc3VtID0gMDtcclxuXHJcbiAgICAvLyBidXQgd2UgYWxzbyBrZWVwIHRocmVlIGV4dHJhIHZhcmlhYmxlcyBhcyBib29ra2VlcGluZzpcclxuICAgIC8vIG1vc3QgaW1wb3J0YW50bHksIGFuIGVycm9yIGNvcnJlY3Rpb24gdmFsdWUuIFRoaXMgd2lsbCBiZSBhIHZlcnlcclxuICAgIC8vIHNtYWxsIG51bWJlciB0aGF0IGlzIHRoZSBvcHBvc2l0ZSBvZiB0aGUgZmxvYXRpbmcgcG9pbnQgcHJlY2lzaW9uIGxvc3MuXHJcbiAgICB2YXIgZXJyb3JDb21wZW5zYXRpb24gPSAwO1xyXG5cclxuICAgIC8vIHRoaXMgd2lsbCBiZSBlYWNoIG51bWJlciBpbiB0aGUgbGlzdCBjb3JyZWN0ZWQgd2l0aCB0aGUgY29tcGVuc2F0aW9uIHZhbHVlLlxyXG4gICAgdmFyIGNvcnJlY3RlZEN1cnJlbnRWYWx1ZTtcclxuXHJcbiAgICAvLyBhbmQgdGhpcyB3aWxsIGJlIHRoZSBuZXh0IHN1bVxyXG4gICAgdmFyIG5leHRTdW07XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgLy8gZmlyc3QgY29ycmVjdCB0aGUgdmFsdWUgdGhhdCB3ZSdyZSBnb2luZyB0byBhZGQgdG8gdGhlIHN1bVxyXG4gICAgICAgIGNvcnJlY3RlZEN1cnJlbnRWYWx1ZSA9IHhbaV0gLSBlcnJvckNvbXBlbnNhdGlvbjtcclxuXHJcbiAgICAgICAgLy8gY29tcHV0ZSB0aGUgbmV4dCBzdW0uIHN1bSBpcyBsaWtlbHkgYSBtdWNoIGxhcmdlciBudW1iZXJcclxuICAgICAgICAvLyB0aGFuIGNvcnJlY3RlZEN1cnJlbnRWYWx1ZSwgc28gd2UnbGwgbG9zZSBwcmVjaXNpb24gaGVyZSxcclxuICAgICAgICAvLyBhbmQgbWVhc3VyZSBob3cgbXVjaCBwcmVjaXNpb24gaXMgbG9zdCBpbiB0aGUgbmV4dCBzdGVwXHJcbiAgICAgICAgbmV4dFN1bSA9IHN1bSArIGNvcnJlY3RlZEN1cnJlbnRWYWx1ZTtcclxuXHJcbiAgICAgICAgLy8gd2UgaW50ZW50aW9uYWxseSBkaWRuJ3QgYXNzaWduIHN1bSBpbW1lZGlhdGVseSwgYnV0IHN0b3JlZFxyXG4gICAgICAgIC8vIGl0IGZvciBub3cgc28gd2UgY2FuIGZpZ3VyZSBvdXQgdGhpczogaXMgKHN1bSArIG5leHRWYWx1ZSkgLSBuZXh0VmFsdWVcclxuICAgICAgICAvLyBub3QgZXF1YWwgdG8gMD8gaWRlYWxseSBpdCB3b3VsZCBiZSwgYnV0IGluIHByYWN0aWNlIGl0IHdvbid0OlxyXG4gICAgICAgIC8vIGl0IHdpbGwgYmUgc29tZSB2ZXJ5IHNtYWxsIG51bWJlci4gdGhhdCdzIHdoYXQgd2UgcmVjb3JkXHJcbiAgICAgICAgLy8gYXMgZXJyb3JDb21wZW5zYXRpb24uXHJcbiAgICAgICAgZXJyb3JDb21wZW5zYXRpb24gPSBuZXh0U3VtIC0gc3VtIC0gY29ycmVjdGVkQ3VycmVudFZhbHVlO1xyXG5cclxuICAgICAgICAvLyBub3cgdGhhdCB3ZSd2ZSBjb21wdXRlZCBob3cgbXVjaCB3ZSdsbCBjb3JyZWN0IGZvciBpbiB0aGUgbmV4dFxyXG4gICAgICAgIC8vIGxvb3AsIHN0YXJ0IHRyZWF0aW5nIHRoZSBuZXh0U3VtIGFzIHRoZSBjdXJyZW50IHN1bS5cclxuICAgICAgICBzdW0gPSBuZXh0U3VtO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdW07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc3VtO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgbWVhbiA9IHJlcXVpcmUoJy4vbWVhbicpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBzdW0gb2YgZGV2aWF0aW9ucyB0byB0aGUgTnRoIHBvd2VyLlxyXG4gKiBXaGVuIG49MiBpdCdzIHRoZSBzdW0gb2Ygc3F1YXJlZCBkZXZpYXRpb25zLlxyXG4gKiBXaGVuIG49MyBpdCdzIHRoZSBzdW0gb2YgY3ViZWQgZGV2aWF0aW9ucy5cclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBuIHBvd2VyXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHN1bSBvZiBudGggcG93ZXIgZGV2aWF0aW9uc1xyXG4gKiBAZXhhbXBsZVxyXG4gKiB2YXIgaW5wdXQgPSBbMSwgMiwgM107XHJcbiAqIC8vIHNpbmNlIHRoZSB2YXJpYW5jZSBvZiBhIHNldCBpcyB0aGUgbWVhbiBzcXVhcmVkXHJcbiAqIC8vIGRldmlhdGlvbnMsIHdlIGNhbiBjYWxjdWxhdGUgdGhhdCB3aXRoIHN1bU50aFBvd2VyRGV2aWF0aW9uczpcclxuICogdmFyIHZhcmlhbmNlID0gc3VtTnRoUG93ZXJEZXZpYXRpb25zKGlucHV0KSAvIGlucHV0Lmxlbmd0aDtcclxuICovXHJcbmZ1bmN0aW9uIHN1bU50aFBvd2VyRGV2aWF0aW9ucyh4Lyo6IEFycmF5PG51bWJlcj4gKi8sIG4vKjogbnVtYmVyICovKS8qOm51bWJlciovIHtcclxuICAgIHZhciBtZWFuVmFsdWUgPSBtZWFuKHgpLFxyXG4gICAgICAgIHN1bSA9IDA7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgc3VtICs9IE1hdGgucG93KHhbaV0gLSBtZWFuVmFsdWUsIG4pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdW07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc3VtTnRoUG93ZXJEZXZpYXRpb25zO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgc3VtTnRoUG93ZXJEZXZpYXRpb25zID0gcmVxdWlyZSgnLi9zdW1fbnRoX3Bvd2VyX2RldmlhdGlvbnMnKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgW3ZhcmlhbmNlXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1ZhcmlhbmNlKVxyXG4gKiBpcyB0aGUgc3VtIG9mIHNxdWFyZWQgZGV2aWF0aW9ucyBmcm9tIHRoZSBtZWFuLlxyXG4gKlxyXG4gKiBUaGlzIGlzIGFuIGltcGxlbWVudGF0aW9uIG9mIHZhcmlhbmNlLCBub3Qgc2FtcGxlIHZhcmlhbmNlOlxyXG4gKiBzZWUgdGhlIGBzYW1wbGVWYXJpYW5jZWAgbWV0aG9kIGlmIHlvdSB3YW50IGEgc2FtcGxlIG1lYXN1cmUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBhIHBvcHVsYXRpb25cclxuICogQHJldHVybnMge251bWJlcn0gdmFyaWFuY2U6IGEgdmFsdWUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHplcm8uXHJcbiAqIHplcm8gaW5kaWNhdGVzIHRoYXQgYWxsIHZhbHVlcyBhcmUgaWRlbnRpY2FsLlxyXG4gKiBAZXhhbXBsZVxyXG4gKiBzcy52YXJpYW5jZShbMSwgMiwgMywgNCwgNSwgNl0pOyAvLz0gMi45MTdcclxuICovXHJcbmZ1bmN0aW9uIHZhcmlhbmNlKHgvKjogQXJyYXk8bnVtYmVyPiAqLykvKjpudW1iZXIqLyB7XHJcbiAgICAvLyBUaGUgdmFyaWFuY2Ugb2Ygbm8gbnVtYmVycyBpcyBudWxsXHJcbiAgICBpZiAoeC5sZW5ndGggPT09IDApIHsgcmV0dXJuIE5hTjsgfVxyXG5cclxuICAgIC8vIEZpbmQgdGhlIG1lYW4gb2Ygc3F1YXJlZCBkZXZpYXRpb25zIGJldHdlZW4gdGhlXHJcbiAgICAvLyBtZWFuIHZhbHVlIGFuZCBlYWNoIHZhbHVlLlxyXG4gICAgcmV0dXJuIHN1bU50aFBvd2VyRGV2aWF0aW9ucyh4LCAyKSAvIHgubGVuZ3RoO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHZhcmlhbmNlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG4vKipcclxuICogVGhlIFtaLVNjb3JlLCBvciBTdGFuZGFyZCBTY29yZV0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TdGFuZGFyZF9zY29yZSkuXHJcbiAqXHJcbiAqIFRoZSBzdGFuZGFyZCBzY29yZSBpcyB0aGUgbnVtYmVyIG9mIHN0YW5kYXJkIGRldmlhdGlvbnMgYW4gb2JzZXJ2YXRpb25cclxuICogb3IgZGF0dW0gaXMgYWJvdmUgb3IgYmVsb3cgdGhlIG1lYW4uIFRodXMsIGEgcG9zaXRpdmUgc3RhbmRhcmQgc2NvcmVcclxuICogcmVwcmVzZW50cyBhIGRhdHVtIGFib3ZlIHRoZSBtZWFuLCB3aGlsZSBhIG5lZ2F0aXZlIHN0YW5kYXJkIHNjb3JlXHJcbiAqIHJlcHJlc2VudHMgYSBkYXR1bSBiZWxvdyB0aGUgbWVhbi4gSXQgaXMgYSBkaW1lbnNpb25sZXNzIHF1YW50aXR5XHJcbiAqIG9idGFpbmVkIGJ5IHN1YnRyYWN0aW5nIHRoZSBwb3B1bGF0aW9uIG1lYW4gZnJvbSBhbiBpbmRpdmlkdWFsIHJhd1xyXG4gKiBzY29yZSBhbmQgdGhlbiBkaXZpZGluZyB0aGUgZGlmZmVyZW5jZSBieSB0aGUgcG9wdWxhdGlvbiBzdGFuZGFyZFxyXG4gKiBkZXZpYXRpb24uXHJcbiAqXHJcbiAqIFRoZSB6LXNjb3JlIGlzIG9ubHkgZGVmaW5lZCBpZiBvbmUga25vd3MgdGhlIHBvcHVsYXRpb24gcGFyYW1ldGVycztcclxuICogaWYgb25lIG9ubHkgaGFzIGEgc2FtcGxlIHNldCwgdGhlbiB0aGUgYW5hbG9nb3VzIGNvbXB1dGF0aW9uIHdpdGhcclxuICogc2FtcGxlIG1lYW4gYW5kIHNhbXBsZSBzdGFuZGFyZCBkZXZpYXRpb24geWllbGRzIHRoZVxyXG4gKiBTdHVkZW50J3MgdC1zdGF0aXN0aWMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtZWFuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFuZGFyZERldmlhdGlvblxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IHogc2NvcmVcclxuICogQGV4YW1wbGVcclxuICogc3MuelNjb3JlKDc4LCA4MCwgNSk7IC8vPSAtMC40XHJcbiAqL1xyXG5mdW5jdGlvbiB6U2NvcmUoeC8qOm51bWJlciovLCBtZWFuLyo6bnVtYmVyKi8sIHN0YW5kYXJkRGV2aWF0aW9uLyo6bnVtYmVyKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgcmV0dXJuICh4IC0gbWVhbikgLyBzdGFuZGFyZERldmlhdGlvbjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB6U2NvcmU7XHJcbiIsImltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJ0Q29uZmlnIHtcclxuICAgIGNzc0NsYXNzUHJlZml4ID0gXCJvZGMtXCI7XHJcbiAgICBzdmdDbGFzcyA9IHRoaXMuY3NzQ2xhc3NQcmVmaXggKyAnbXctZDMtY2hhcnQnO1xyXG4gICAgd2lkdGggPSB1bmRlZmluZWQ7XHJcbiAgICBoZWlnaHQgPSB1bmRlZmluZWQ7XHJcbiAgICBtYXJnaW4gPSB7XHJcbiAgICAgICAgbGVmdDogNTAsXHJcbiAgICAgICAgcmlnaHQ6IDMwLFxyXG4gICAgICAgIHRvcDogMzAsXHJcbiAgICAgICAgYm90dG9tOiA1MFxyXG4gICAgfTtcclxuICAgIHNob3dUb29sdGlwID0gZmFsc2U7XHJcbiAgICB0cmFuc2l0aW9uID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pIHtcclxuICAgICAgICBpZiAoY3VzdG9tKSB7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJ0IHtcclxuICAgIHV0aWxzID0gVXRpbHM7XHJcbiAgICBiYXNlQ29udGFpbmVyO1xyXG4gICAgc3ZnO1xyXG4gICAgY29uZmlnO1xyXG4gICAgcGxvdCA9IHtcclxuICAgICAgICBtYXJnaW46IHt9XHJcbiAgICB9O1xyXG4gICAgX2F0dGFjaGVkID0ge307XHJcbiAgICBfbGF5ZXJzID0ge307XHJcbiAgICBfZXZlbnRzID0ge307XHJcbiAgICBfaXNBdHRhY2hlZDtcclxuICAgIF9pc0luaXRpYWxpemVkPWZhbHNlO1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihiYXNlLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9pc0F0dGFjaGVkID0gYmFzZSBpbnN0YW5jZW9mIENoYXJ0O1xyXG5cclxuICAgICAgICB0aGlzLmJhc2VDb250YWluZXIgPSBiYXNlO1xyXG5cclxuICAgICAgICB0aGlzLnNldENvbmZpZyhjb25maWcpO1xyXG5cclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgICB0aGlzLnBvc3RJbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZykge1xyXG4gICAgICAgIGlmICghY29uZmlnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gbmV3IENoYXJ0Q29uZmlnKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRhKGRhdGEpIHtcclxuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHJcbiAgICAgICAgc2VsZi5pbml0UGxvdCgpO1xyXG4gICAgICAgIHNlbGYuaW5pdFN2ZygpO1xyXG5cclxuICAgICAgICBzZWxmLmluaXRUb29sdGlwKCk7XHJcbiAgICAgICAgc2VsZi5kcmF3KCk7XHJcbiAgICAgICAgdGhpcy5faXNJbml0aWFsaXplZD10cnVlO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHBvc3RJbml0KCl7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXRTdmcoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBjb25maWcgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICBjb25zb2xlLmxvZyhjb25maWcuc3ZnQ2xhc3MpO1xyXG5cclxuICAgICAgICB2YXIgbWFyZ2luID0gc2VsZi5wbG90Lm1hcmdpbjtcclxuICAgICAgICB2YXIgd2lkdGggPSBzZWxmLnBsb3Qud2lkdGggKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodDtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gc2VsZi5wbG90LmhlaWdodCArIG1hcmdpbi50b3AgKyBtYXJnaW4uYm90dG9tO1xyXG4gICAgICAgIHZhciBhc3BlY3QgPSB3aWR0aCAvIGhlaWdodDtcclxuICAgICAgICBpZighc2VsZi5faXNBdHRhY2hlZCl7XHJcbiAgICAgICAgICAgIGlmKCF0aGlzLl9pc0luaXRpYWxpemVkKXtcclxuICAgICAgICAgICAgICAgIGQzLnNlbGVjdChzZWxmLmJhc2VDb250YWluZXIpLnNlbGVjdChcInN2Z1wiKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZWxmLnN2ZyA9IGQzLnNlbGVjdChzZWxmLmJhc2VDb250YWluZXIpLnNlbGVjdE9yQXBwZW5kKFwic3ZnXCIpO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5zdmdcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgd2lkdGgpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBoZWlnaHQpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInZpZXdCb3hcIiwgXCIwIDAgXCIgKyBcIiBcIiArIHdpZHRoICsgXCIgXCIgKyBoZWlnaHQpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInByZXNlcnZlQXNwZWN0UmF0aW9cIiwgXCJ4TWlkWU1pZCBtZWV0XCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGNvbmZpZy5zdmdDbGFzcyk7XHJcbiAgICAgICAgICAgIHNlbGYuc3ZnRyA9IHNlbGYuc3ZnLnNlbGVjdE9yQXBwZW5kKFwiZy5tYWluLWdyb3VwXCIpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLmJhc2VDb250YWluZXIpO1xyXG4gICAgICAgICAgICBzZWxmLnN2ZyA9IHNlbGYuYmFzZUNvbnRhaW5lci5zdmc7XHJcbiAgICAgICAgICAgIHNlbGYuc3ZnRyA9IHNlbGYuc3ZnLnNlbGVjdE9yQXBwZW5kKFwiZy5tYWluLWdyb3VwLlwiK2NvbmZpZy5zdmdDbGFzcylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlbGYuc3ZnRy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgbWFyZ2luLmxlZnQgKyBcIixcIiArIG1hcmdpbi50b3AgKyBcIilcIik7XHJcblxyXG4gICAgICAgIGlmICghY29uZmlnLndpZHRoIHx8IGNvbmZpZy5oZWlnaHQpIHtcclxuICAgICAgICAgICAgZDMuc2VsZWN0KHdpbmRvdylcclxuICAgICAgICAgICAgICAgIC5vbihcInJlc2l6ZVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9UT0RPIGFkZCByZXNwb25zaXZlbmVzcyBpZiB3aWR0aC9oZWlnaHQgbm90IHNwZWNpZmllZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXRUb29sdGlwKCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy5zaG93VG9vbHRpcCkge1xyXG4gICAgICAgICAgICBpZighc2VsZi5faXNBdHRhY2hlZCApe1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wbG90LnRvb2x0aXAgPSBkMy5zZWxlY3QoXCJib2R5XCIpLnNlbGVjdE9yQXBwZW5kKCdkaXYuJytzZWxmLmNvbmZpZy5jc3NDbGFzc1ByZWZpeCsndG9vbHRpcCcpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QudG9vbHRpcD0gc2VsZi5iYXNlQ29udGFpbmVyLnBsb3QudG9vbHRpcDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKSB7XHJcbiAgICAgICAgdmFyIG1hcmdpbiA9IHRoaXMuY29uZmlnLm1hcmdpbjtcclxuICAgICAgICB0aGlzLnBsb3Q9e1xyXG4gICAgICAgICAgICBtYXJnaW46e1xyXG4gICAgICAgICAgICAgICAgdG9wOiBtYXJnaW4udG9wLFxyXG4gICAgICAgICAgICAgICAgYm90dG9tOiBtYXJnaW4uYm90dG9tLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogbWFyZ2luLmxlZnQsXHJcbiAgICAgICAgICAgICAgICByaWdodDogbWFyZ2luLnJpZ2h0XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkYXRhKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXREYXRhKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbGF5ZXJOYW1lLCBhdHRhY2htZW50RGF0YTtcclxuICAgICAgICBmb3IgKHZhciBhdHRhY2htZW50TmFtZSBpbiB0aGlzLl9hdHRhY2hlZCkge1xyXG5cclxuICAgICAgICAgICAgYXR0YWNobWVudERhdGEgPSBkYXRhO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fYXR0YWNoZWRbYXR0YWNobWVudE5hbWVdLnVwZGF0ZShhdHRhY2htZW50RGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdiYXNlIHVwcGRhdGUnKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBkcmF3KGRhdGEpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZShkYXRhKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvL0JvcnJvd2VkIGZyb20gZDMuY2hhcnRcclxuICAgIC8qKlxyXG4gICAgICogUmVnaXN0ZXIgb3IgcmV0cmlldmUgYW4gXCJhdHRhY2htZW50XCIgQ2hhcnQuIFRoZSBcImF0dGFjaG1lbnRcIiBjaGFydCdzIGBkcmF3YFxyXG4gICAgICogbWV0aG9kIHdpbGwgYmUgaW52b2tlZCB3aGVuZXZlciB0aGUgY29udGFpbmluZyBjaGFydCdzIGBkcmF3YCBtZXRob2QgaXNcclxuICAgICAqIGludm9rZWQuXHJcbiAgICAgKlxyXG4gICAgICogQGV4dGVybmFsRXhhbXBsZSBjaGFydC1hdHRhY2hcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXR0YWNobWVudE5hbWUgTmFtZSBvZiB0aGUgYXR0YWNobWVudFxyXG4gICAgICogQHBhcmFtIHtDaGFydH0gW2NoYXJ0XSBDaGFydCB0byByZWdpc3RlciBhcyBhIG1peCBpbiBvZiB0aGlzIGNoYXJ0LiBXaGVuXHJcbiAgICAgKiAgICAgICAgdW5zcGVjaWZpZWQsIHRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIHRoZSBhdHRhY2htZW50IHByZXZpb3VzbHlcclxuICAgICAqICAgICAgICByZWdpc3RlcmVkIHdpdGggdGhlIHNwZWNpZmllZCBgYXR0YWNobWVudE5hbWVgIChpZiBhbnkpLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtDaGFydH0gUmVmZXJlbmNlIHRvIHRoaXMgY2hhcnQgKGNoYWluYWJsZSkuXHJcbiAgICAgKi9cclxuICAgIGF0dGFjaChhdHRhY2htZW50TmFtZSwgY2hhcnQpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXR0YWNoZWRbYXR0YWNobWVudE5hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fYXR0YWNoZWRbYXR0YWNobWVudE5hbWVdID0gY2hhcnQ7XHJcbiAgICAgICAgcmV0dXJuIGNoYXJ0O1xyXG4gICAgfTtcclxuXHJcbiAgICBcclxuXHJcbiAgICAvL0JvcnJvd2VkIGZyb20gZDMuY2hhcnRcclxuICAgIC8qKlxyXG4gICAgICogU3Vic2NyaWJlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYW4gZXZlbnQgdHJpZ2dlcmVkIG9uIHRoZSBjaGFydC4gU2VlIHtAbGlua1xyXG4gICAgICAgICogQ2hhcnQjb25jZX0gdG8gc3Vic2NyaWJlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYW4gZXZlbnQgZm9yIG9uZSBvY2N1cmVuY2UuXHJcbiAgICAgKlxyXG4gICAgICogQGV4dGVybmFsRXhhbXBsZSB7cnVubmFibGV9IGNoYXJ0LW9uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgZXZlbnRcclxuICAgICAqIEBwYXJhbSB7Q2hhcnRFdmVudEhhbmRsZXJ9IGNhbGxiYWNrIEZ1bmN0aW9uIHRvIGJlIGludm9rZWQgd2hlbiB0aGUgZXZlbnRcclxuICAgICAqICAgICAgICBvY2N1cnNcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF0gVmFsdWUgdG8gc2V0IGFzIGB0aGlzYCB3aGVuIGludm9raW5nIHRoZVxyXG4gICAgICogICAgICAgIGBjYWxsYmFja2AuIERlZmF1bHRzIHRvIHRoZSBjaGFydCBpbnN0YW5jZS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Q2hhcnR9IEEgcmVmZXJlbmNlIHRvIHRoaXMgY2hhcnQgKGNoYWluYWJsZSkuXHJcbiAgICAgKi9cclxuICAgIG9uKG5hbWUsIGNhbGxiYWNrLCBjb250ZXh0KSB7XHJcbiAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50c1tuYW1lXSB8fCAodGhpcy5fZXZlbnRzW25hbWVdID0gW10pO1xyXG4gICAgICAgIGV2ZW50cy5wdXNoKHtcclxuICAgICAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxyXG4gICAgICAgICAgICBjb250ZXh0OiBjb250ZXh0IHx8IHRoaXMsXHJcbiAgICAgICAgICAgIF9jaGFydDogdGhpc1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vQm9ycm93ZWQgZnJvbSBkMy5jaGFydFxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogU3Vic2NyaWJlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYW4gZXZlbnQgdHJpZ2dlcmVkIG9uIHRoZSBjaGFydC4gVGhpc1xyXG4gICAgICogZnVuY3Rpb24gd2lsbCBiZSBpbnZva2VkIGF0IHRoZSBuZXh0IG9jY3VyYW5jZSBvZiB0aGUgZXZlbnQgYW5kIGltbWVkaWF0ZWx5XHJcbiAgICAgKiB1bnN1YnNjcmliZWQuIFNlZSB7QGxpbmsgQ2hhcnQjb259IHRvIHN1YnNjcmliZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGFuXHJcbiAgICAgKiBldmVudCBpbmRlZmluaXRlbHkuXHJcbiAgICAgKlxyXG4gICAgICogQGV4dGVybmFsRXhhbXBsZSB7cnVubmFibGV9IGNoYXJ0LW9uY2VcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBldmVudFxyXG4gICAgICogQHBhcmFtIHtDaGFydEV2ZW50SGFuZGxlcn0gY2FsbGJhY2sgRnVuY3Rpb24gdG8gYmUgaW52b2tlZCB3aGVuIHRoZSBldmVudFxyXG4gICAgICogICAgICAgIG9jY3Vyc1xyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0XSBWYWx1ZSB0byBzZXQgYXMgYHRoaXNgIHdoZW4gaW52b2tpbmcgdGhlXHJcbiAgICAgKiAgICAgICAgYGNhbGxiYWNrYC4gRGVmYXVsdHMgdG8gdGhlIGNoYXJ0IGluc3RhbmNlXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0NoYXJ0fSBBIHJlZmVyZW5jZSB0byB0aGlzIGNoYXJ0IChjaGFpbmFibGUpXHJcbiAgICAgKi9cclxuICAgIG9uY2UobmFtZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG9uY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYub2ZmKG5hbWUsIG9uY2UpO1xyXG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub24obmFtZSwgb25jZSwgY29udGV4dCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vQm9ycm93ZWQgZnJvbSBkMy5jaGFydFxyXG4gICAgLyoqXHJcbiAgICAgKiBVbnN1YnNjcmliZSBvbmUgb3IgbW9yZSBjYWxsYmFjayBmdW5jdGlvbnMgZnJvbSBhbiBldmVudCB0cmlnZ2VyZWQgb24gdGhlXHJcbiAgICAgKiBjaGFydC4gV2hlbiBubyBhcmd1bWVudHMgYXJlIHNwZWNpZmllZCwgKmFsbCogaGFuZGxlcnMgd2lsbCBiZSB1bnN1YnNjcmliZWQuXHJcbiAgICAgKiBXaGVuIG9ubHkgYSBgbmFtZWAgaXMgc3BlY2lmaWVkLCBhbGwgaGFuZGxlcnMgc3Vic2NyaWJlZCB0byB0aGF0IGV2ZW50IHdpbGxcclxuICAgICAqIGJlIHVuc3Vic2NyaWJlZC4gV2hlbiBhIGBuYW1lYCBhbmQgYGNhbGxiYWNrYCBhcmUgc3BlY2lmaWVkLCBvbmx5IHRoYXRcclxuICAgICAqIGZ1bmN0aW9uIHdpbGwgYmUgdW5zdWJzY3JpYmVkIGZyb20gdGhhdCBldmVudC4gV2hlbiBhIGBuYW1lYCBhbmQgYGNvbnRleHRgXHJcbiAgICAgKiBhcmUgc3BlY2lmaWVkIChidXQgYGNhbGxiYWNrYCBpcyBvbWl0dGVkKSwgYWxsIGV2ZW50cyBib3VuZCB0byB0aGUgZ2l2ZW5cclxuICAgICAqIGV2ZW50IHdpdGggdGhlIGdpdmVuIGNvbnRleHQgd2lsbCBiZSB1bnN1YnNjcmliZWQuXHJcbiAgICAgKlxyXG4gICAgICogQGV4dGVybmFsRXhhbXBsZSB7cnVubmFibGV9IGNoYXJ0LW9mZlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbbmFtZV0gTmFtZSBvZiB0aGUgZXZlbnQgdG8gYmUgdW5zdWJzY3JpYmVkXHJcbiAgICAgKiBAcGFyYW0ge0NoYXJ0RXZlbnRIYW5kbGVyfSBbY2FsbGJhY2tdIEZ1bmN0aW9uIHRvIGJlIHVuc3Vic2NyaWJlZFxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0XSBDb250ZXh0cyB0byBiZSB1bnN1YnNjcmliZVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtDaGFydH0gQSByZWZlcmVuY2UgdG8gdGhpcyBjaGFydCAoY2hhaW5hYmxlKS5cclxuICAgICAqL1xyXG5cclxuICAgIG9mZihuYW1lLCBjYWxsYmFjaywgY29udGV4dCkge1xyXG4gICAgICAgIHZhciBuYW1lcywgbiwgZXZlbnRzLCBldmVudCwgaSwgajtcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIGFsbCBldmVudHNcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBmb3IgKG5hbWUgaW4gdGhpcy5fZXZlbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbbmFtZV0ubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSBhbGwgZXZlbnRzIGZvciBhIHNwZWNpZmljIG5hbWVcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICBldmVudHMgPSB0aGlzLl9ldmVudHNbbmFtZV07XHJcbiAgICAgICAgICAgIGlmIChldmVudHMpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50cy5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIGFsbCBldmVudHMgdGhhdCBtYXRjaCB3aGF0ZXZlciBjb21iaW5hdGlvbiBvZiBuYW1lLCBjb250ZXh0XHJcbiAgICAgICAgLy8gYW5kIGNhbGxiYWNrLlxyXG4gICAgICAgIG5hbWVzID0gbmFtZSA/IFtuYW1lXSA6IE9iamVjdC5rZXlzKHRoaXMuX2V2ZW50cyk7XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIG4gPSBuYW1lc1tpXTtcclxuICAgICAgICAgICAgZXZlbnRzID0gdGhpcy5fZXZlbnRzW25dO1xyXG4gICAgICAgICAgICBqID0gZXZlbnRzLmxlbmd0aDtcclxuICAgICAgICAgICAgd2hpbGUgKGotLSkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQgPSBldmVudHNbal07XHJcbiAgICAgICAgICAgICAgICBpZiAoKGNhbGxiYWNrICYmIGNhbGxiYWNrID09PSBldmVudC5jYWxsYmFjaykgfHxcclxuICAgICAgICAgICAgICAgICAgICAoY29udGV4dCAmJiBjb250ZXh0ID09PSBldmVudC5jb250ZXh0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy5zcGxpY2UoaiwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvL0JvcnJvd2VkIGZyb20gZDMuY2hhcnRcclxuICAgIC8qKlxyXG4gICAgICogUHVibGlzaCBhbiBldmVudCBvbiB0aGlzIGNoYXJ0IHdpdGggdGhlIGdpdmVuIGBuYW1lYC5cclxuICAgICAqXHJcbiAgICAgKiBAZXh0ZXJuYWxFeGFtcGxlIHtydW5uYWJsZX0gY2hhcnQtdHJpZ2dlclxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGV2ZW50IHRvIHB1Ymxpc2hcclxuICAgICAqIEBwYXJhbSB7Li4uKn0gYXJndW1lbnRzIFZhbHVlcyB3aXRoIHdoaWNoIHRvIGludm9rZSB0aGUgcmVnaXN0ZXJlZFxyXG4gICAgICogICAgICAgIGNhbGxiYWNrcy5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Q2hhcnR9IEEgcmVmZXJlbmNlIHRvIHRoaXMgY2hhcnQgKGNoYWluYWJsZSkuXHJcbiAgICAgKi9cclxuICAgIHRyaWdnZXIobmFtZSkge1xyXG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcclxuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy5fZXZlbnRzW25hbWVdO1xyXG4gICAgICAgIHZhciBpLCBldjtcclxuXHJcbiAgICAgICAgaWYgKGV2ZW50cyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGV2ID0gZXZlbnRzW2ldO1xyXG4gICAgICAgICAgICAgICAgZXYuY2FsbGJhY2suYXBwbHkoZXYuY29udGV4dCwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIGdldEJhc2VDb250YWluZXIoKXtcclxuICAgICAgICBpZih0aGlzLl9pc0F0dGFjaGVkKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFzZUNvbnRhaW5lci5zdmc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkMy5zZWxlY3QodGhpcy5iYXNlQ29udGFpbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRCYXNlQ29udGFpbmVyTm9kZSgpe1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRCYXNlQ29udGFpbmVyKCkubm9kZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByZWZpeENsYXNzKGNsYXp6LCBhZGREb3Qpe1xyXG4gICAgICAgIHJldHVybiBhZGREb3Q/ICcuJzogJycrdGhpcy5jb25maWcuY3NzQ2xhc3NQcmVmaXgrY2xheno7XHJcbiAgICB9XHJcbiAgICBjb21wdXRlUGxvdFNpemUoKSB7XHJcbiAgICAgICAgdGhpcy5wbG90LndpZHRoID0gVXRpbHMuYXZhaWxhYmxlV2lkdGgodGhpcy5jb25maWcud2lkdGgsIHRoaXMuZ2V0QmFzZUNvbnRhaW5lcigpLCB0aGlzLnBsb3QubWFyZ2luKTtcclxuICAgICAgICB0aGlzLnBsb3QuaGVpZ2h0ID0gVXRpbHMuYXZhaWxhYmxlSGVpZ2h0KHRoaXMuY29uZmlnLmhlaWdodCwgdGhpcy5nZXRCYXNlQ29udGFpbmVyKCksIHRoaXMucGxvdC5tYXJnaW4pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q2hhcnQsIENoYXJ0Q29uZmlnfSBmcm9tIFwiLi9jaGFydFwiO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5pbXBvcnQge1N0YXRpc3RpY3NVdGlsc30gZnJvbSAnLi9zdGF0aXN0aWNzLXV0aWxzJ1xyXG5pbXBvcnQge0xlZ2VuZH0gZnJvbSAnLi9sZWdlbmQnXHJcbmltcG9ydCB7U2NhdHRlclBsb3R9IGZyb20gJy4vc2NhdHRlcnBsb3QnXHJcblxyXG5leHBvcnQgY2xhc3MgQ29ycmVsYXRpb25NYXRyaXhDb25maWcgZXh0ZW5kcyBDaGFydENvbmZpZyB7XHJcblxyXG4gICAgc3ZnQ2xhc3MgPSAnb2RjLWNvcnJlbGF0aW9uLW1hdHJpeCc7XHJcbiAgICBndWlkZXMgPSBmYWxzZTsgLy9zaG93IGF4aXMgZ3VpZGVzXHJcbiAgICBzaG93VG9vbHRpcCA9IHRydWU7IC8vc2hvdyB0b29sdGlwIG9uIGRvdCBob3ZlclxyXG4gICAgc2hvd0xlZ2VuZCA9IHRydWU7XHJcbiAgICBoaWdobGlnaHRMYWJlbHMgPSB0cnVlO1xyXG4gICAgcm90YXRlTGFiZWxzWCA9IHRydWU7XHJcbiAgICByb3RhdGVMYWJlbHNZID0gdHJ1ZTtcclxuICAgIHZhcmlhYmxlcyA9IHtcclxuICAgICAgICBsYWJlbHM6IHVuZGVmaW5lZCxcclxuICAgICAgICBrZXlzOiBbXSwgLy9vcHRpb25hbCBhcnJheSBvZiB2YXJpYWJsZSBrZXlzXHJcbiAgICAgICAgdmFsdWU6IChkLCB2YXJpYWJsZUtleSkgPT4gZFt2YXJpYWJsZUtleV0sIC8vIHZhcmlhYmxlIHZhbHVlIGFjY2Vzc29yXHJcbiAgICAgICAgc2NhbGU6IFwib3JkaW5hbFwiXHJcbiAgICB9O1xyXG4gICAgY29ycmVsYXRpb24gPSB7XHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCIsXHJcbiAgICAgICAgZG9tYWluOiBbLTEsIC0wLjc1LCAtMC41LCAwLCAwLjUsIDAuNzUsIDFdLFxyXG4gICAgICAgIHJhbmdlOiBbXCJkYXJrYmx1ZVwiLCBcImJsdWVcIiwgXCJsaWdodHNreWJsdWVcIiwgXCJ3aGl0ZVwiLCBcIm9yYW5nZXJlZFwiLCBcImNyaW1zb25cIiwgXCJkYXJrcmVkXCJdLFxyXG4gICAgICAgIHZhbHVlOiAoeFZhbHVlcywgeVZhbHVlcykgPT4gU3RhdGlzdGljc1V0aWxzLnNhbXBsZUNvcnJlbGF0aW9uKHhWYWx1ZXMsIHlWYWx1ZXMpXHJcblxyXG4gICAgfTtcclxuICAgIGNlbGwgPSB7XHJcbiAgICAgICAgc2hhcGU6IFwiZWxsaXBzZVwiLCAvL3Bvc3NpYmxlIHZhbHVlczogcmVjdCwgY2lyY2xlLCBlbGxpcHNlXHJcbiAgICAgICAgc2l6ZTogdW5kZWZpbmVkLFxyXG4gICAgICAgIHNpemVNaW46IDE1LFxyXG4gICAgICAgIHNpemVNYXg6IDI1MCxcclxuICAgICAgICBwYWRkaW5nOiAxXHJcbiAgICB9O1xyXG4gICAgbWFyZ2luID0ge1xyXG4gICAgICAgIGxlZnQ6IDYwLFxyXG4gICAgICAgIHJpZ2h0OiA1MCxcclxuICAgICAgICB0b3A6IDMwLFxyXG4gICAgICAgIGJvdHRvbTogNjBcclxuICAgIH07XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBpZiAoY3VzdG9tKSB7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb3JyZWxhdGlvbk1hdHJpeCBleHRlbmRzIENoYXJ0IHtcclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIG5ldyBDb3JyZWxhdGlvbk1hdHJpeENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgQ29ycmVsYXRpb25NYXRyaXhDb25maWcoY29uZmlnKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSB0aGlzLmNvbmZpZy5tYXJnaW47XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgdGhpcy5wbG90Lng9e307XHJcbiAgICAgICAgdGhpcy5wbG90LmNvcnJlbGF0aW9uPXtcclxuICAgICAgICAgICAgbWF0cml4OiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGNlbGxzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGNvbG9yOiB7fSxcclxuICAgICAgICAgICAgc2hhcGU6IHt9XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBWYXJpYWJsZXMoKTtcclxuICAgICAgICB2YXIgd2lkdGggPSBjb25mLndpZHRoO1xyXG4gICAgICAgIHZhciBwbGFjZWhvbGRlck5vZGUgPSB0aGlzLmdldEJhc2VDb250YWluZXJOb2RlKCk7XHJcbiAgICAgICAgdGhpcy5wbG90LnBsYWNlaG9sZGVyTm9kZSA9IHBsYWNlaG9sZGVyTm9kZTtcclxuXHJcbiAgICAgICAgdmFyIHBhcmVudFdpZHRoID0gcGxhY2Vob2xkZXJOb2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xyXG4gICAgICAgIGlmICh3aWR0aCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLnBsb3QuY2VsbFNpemUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsU2l6ZSA9IE1hdGgubWF4KGNvbmYuY2VsbC5zaXplTWluLCBNYXRoLm1pbihjb25mLmNlbGwuc2l6ZU1heCwgKHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQpIC8gdGhpcy5wbG90LnZhcmlhYmxlcy5sZW5ndGgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuY2VsbFNpemUgPSB0aGlzLmNvbmZpZy5jZWxsLnNpemU7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMucGxvdC5jZWxsU2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxTaXplID0gTWF0aC5tYXgoY29uZi5jZWxsLnNpemVNaW4sIE1hdGgubWluKGNvbmYuY2VsbC5zaXplTWF4LCAocGFyZW50V2lkdGgtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0KSAvIHRoaXMucGxvdC52YXJpYWJsZXMubGVuZ3RoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHdpZHRoID0gdGhpcy5wbG90LmNlbGxTaXplICogdGhpcy5wbG90LnZhcmlhYmxlcy5sZW5ndGggKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodDtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaGVpZ2h0ID0gd2lkdGg7XHJcbiAgICAgICAgaWYgKCFoZWlnaHQpIHtcclxuICAgICAgICAgICAgaGVpZ2h0ID0gcGxhY2Vob2xkZXJOb2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC53aWR0aCA9IHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XHJcbiAgICAgICAgdGhpcy5wbG90LmhlaWdodCA9IHRoaXMucGxvdC53aWR0aDtcclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cFZhcmlhYmxlc1NjYWxlcygpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBDb3JyZWxhdGlvblNjYWxlcygpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBDb3JyZWxhdGlvbk1hdHJpeCgpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXBWYXJpYWJsZXNTY2FsZXMoKSB7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB4ID0gcGxvdC54O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWcudmFyaWFibGVzO1xyXG5cclxuICAgICAgICAvKiAqXHJcbiAgICAgICAgICogdmFsdWUgYWNjZXNzb3IgLSByZXR1cm5zIHRoZSB2YWx1ZSB0byBlbmNvZGUgZm9yIGEgZ2l2ZW4gZGF0YSBvYmplY3QuXHJcbiAgICAgICAgICogc2NhbGUgLSBtYXBzIHZhbHVlIHRvIGEgdmlzdWFsIGRpc3BsYXkgZW5jb2RpbmcsIHN1Y2ggYXMgYSBwaXhlbCBwb3NpdGlvbi5cclxuICAgICAgICAgKiBtYXAgZnVuY3Rpb24gLSBtYXBzIGZyb20gZGF0YSB2YWx1ZSB0byBkaXNwbGF5IHZhbHVlXHJcbiAgICAgICAgICogYXhpcyAtIHNldHMgdXAgYXhpc1xyXG4gICAgICAgICAqKi9cclxuICAgICAgICB4LnZhbHVlID0gY29uZi52YWx1ZTtcclxuICAgICAgICB4LnNjYWxlID0gZDMuc2NhbGVbY29uZi5zY2FsZV0oKS5yYW5nZUJhbmRzKFtwbG90LndpZHRoLCAwXSk7XHJcbiAgICAgICAgeC5tYXAgPSBkID0+IHguc2NhbGUoeC52YWx1ZShkKSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cENvcnJlbGF0aW9uU2NhbGVzKCkge1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciBjb3JyQ29uZiA9IHRoaXMuY29uZmlnLmNvcnJlbGF0aW9uO1xyXG5cclxuICAgICAgICBwbG90LmNvcnJlbGF0aW9uLmNvbG9yLnNjYWxlID0gZDMuc2NhbGVbY29yckNvbmYuc2NhbGVdKCkuZG9tYWluKGNvcnJDb25mLmRvbWFpbikucmFuZ2UoY29yckNvbmYucmFuZ2UpO1xyXG4gICAgICAgIHZhciBzaGFwZSA9IHBsb3QuY29ycmVsYXRpb24uc2hhcGUgPSB7fTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxDb25mID0gdGhpcy5jb25maWcuY2VsbDtcclxuICAgICAgICBzaGFwZS50eXBlID0gY2VsbENvbmYuc2hhcGU7XHJcblxyXG4gICAgICAgIHZhciBzaGFwZVNpemUgPSBwbG90LmNlbGxTaXplIC0gY2VsbENvbmYucGFkZGluZyAqIDI7XHJcbiAgICAgICAgaWYgKHNoYXBlLnR5cGUgPT0gJ2NpcmNsZScpIHtcclxuICAgICAgICAgICAgdmFyIHJhZGl1c01heCA9IHNoYXBlU2l6ZSAvIDI7XHJcbiAgICAgICAgICAgIHNoYXBlLnJhZGl1c1NjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFswLCAxXSkucmFuZ2UoWzIsIHJhZGl1c01heF0pO1xyXG4gICAgICAgICAgICBzaGFwZS5yYWRpdXMgPSBjPT4gc2hhcGUucmFkaXVzU2NhbGUoTWF0aC5hYnMoYy52YWx1ZSkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc2hhcGUudHlwZSA9PSAnZWxsaXBzZScpIHtcclxuICAgICAgICAgICAgdmFyIHJhZGl1c01heCA9IHNoYXBlU2l6ZSAvIDI7XHJcbiAgICAgICAgICAgIHNoYXBlLnJhZGl1c1NjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFswLCAxXSkucmFuZ2UoW3JhZGl1c01heCwgMl0pO1xyXG4gICAgICAgICAgICBzaGFwZS5yYWRpdXNYID0gYz0+IHNoYXBlLnJhZGl1c1NjYWxlKE1hdGguYWJzKGMudmFsdWUpKTtcclxuICAgICAgICAgICAgc2hhcGUucmFkaXVzWSA9IHJhZGl1c01heDtcclxuXHJcbiAgICAgICAgICAgIHNoYXBlLnJvdGF0ZVZhbCA9IHYgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHYgPT0gMCkgcmV0dXJuIFwiMFwiO1xyXG4gICAgICAgICAgICAgICAgaWYgKHYgPCAwKSByZXR1cm4gXCItNDVcIjtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIjQ1XCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoc2hhcGUudHlwZSA9PSAncmVjdCcpIHtcclxuICAgICAgICAgICAgc2hhcGUuc2l6ZSA9IHNoYXBlU2l6ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBzZXR1cFZhcmlhYmxlcygpIHtcclxuXHJcbiAgICAgICAgdmFyIHZhcmlhYmxlc0NvbmYgPSB0aGlzLmNvbmZpZy52YXJpYWJsZXM7XHJcblxyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHBsb3QuZG9tYWluQnlWYXJpYWJsZSA9IHt9O1xyXG4gICAgICAgIHBsb3QudmFyaWFibGVzID0gdmFyaWFibGVzQ29uZi5rZXlzO1xyXG4gICAgICAgIGlmICghcGxvdC52YXJpYWJsZXMgfHwgIXBsb3QudmFyaWFibGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBwbG90LnZhcmlhYmxlcyA9IFV0aWxzLmluZmVyVmFyaWFibGVzKGRhdGEsIHRoaXMuY29uZmlnLmdyb3Vwcy5rZXksIHRoaXMuY29uZmlnLmluY2x1ZGVJblBsb3QpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcGxvdC5sYWJlbHMgPSBbXTtcclxuICAgICAgICBwbG90LmxhYmVsQnlWYXJpYWJsZSA9IHt9O1xyXG4gICAgICAgIHBsb3QudmFyaWFibGVzLmZvckVhY2goKHZhcmlhYmxlS2V5LCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBwbG90LmRvbWFpbkJ5VmFyaWFibGVbdmFyaWFibGVLZXldID0gZDMuZXh0ZW50KGRhdGEsICAoZCkgPT4gdmFyaWFibGVzQ29uZi52YWx1ZShkLCB2YXJpYWJsZUtleSkpO1xyXG4gICAgICAgICAgICB2YXIgbGFiZWwgPSB2YXJpYWJsZUtleTtcclxuICAgICAgICAgICAgaWYgKHZhcmlhYmxlc0NvbmYubGFiZWxzICYmIHZhcmlhYmxlc0NvbmYubGFiZWxzLmxlbmd0aCA+IGluZGV4KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGFiZWwgPSB2YXJpYWJsZXNDb25mLmxhYmVsc1tpbmRleF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGxvdC5sYWJlbHMucHVzaChsYWJlbCk7XHJcbiAgICAgICAgICAgIHBsb3QubGFiZWxCeVZhcmlhYmxlW3ZhcmlhYmxlS2V5XSA9IGxhYmVsO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhwbG90LmxhYmVsQnlWYXJpYWJsZSk7XHJcblxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgc2V0dXBDb3JyZWxhdGlvbk1hdHJpeCgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgdmFyIG1hdHJpeCA9IHRoaXMucGxvdC5jb3JyZWxhdGlvbi5tYXRyaXggPSBbXTtcclxuICAgICAgICB2YXIgbWF0cml4Q2VsbHMgPSB0aGlzLnBsb3QuY29ycmVsYXRpb24ubWF0cml4LmNlbGxzID0gW107XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcblxyXG4gICAgICAgIHZhciB2YXJpYWJsZVRvVmFsdWVzID0ge307XHJcbiAgICAgICAgcGxvdC52YXJpYWJsZXMuZm9yRWFjaCgodiwgaSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgdmFyaWFibGVUb1ZhbHVlc1t2XSA9IGRhdGEubWFwKGQ9PnBsb3QueC52YWx1ZShkLCB2KSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHBsb3QudmFyaWFibGVzLmZvckVhY2goKHYxLCBpKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciByb3cgPSBbXTtcclxuICAgICAgICAgICAgbWF0cml4LnB1c2gocm93KTtcclxuXHJcbiAgICAgICAgICAgIHBsb3QudmFyaWFibGVzLmZvckVhY2goKHYyLCBqKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29yciA9IDE7XHJcbiAgICAgICAgICAgICAgICBpZiAodjEgIT0gdjIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb3JyID0gc2VsZi5jb25maWcuY29ycmVsYXRpb24udmFsdWUodmFyaWFibGVUb1ZhbHVlc1t2MV0sIHZhcmlhYmxlVG9WYWx1ZXNbdjJdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBjZWxsID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvd1ZhcjogdjEsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sVmFyOiB2MixcclxuICAgICAgICAgICAgICAgICAgICByb3c6IGksXHJcbiAgICAgICAgICAgICAgICAgICAgY29sOiBqLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjb3JyXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcm93LnB1c2goY2VsbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbWF0cml4Q2VsbHMucHVzaChjZWxsKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB1cGRhdGUobmV3RGF0YSkge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuICAgICAgICAvLyB0aGlzLnVwZGF0ZVxyXG4gICAgICAgIHRoaXMudXBkYXRlQ2VsbHMoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZhcmlhYmxlTGFiZWxzKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5zaG93TGVnZW5kKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGVnZW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB1cGRhdGVWYXJpYWJsZUxhYmVscygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGxhYmVsQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwibGFiZWxcIik7XHJcbiAgICAgICAgdmFyIGxhYmVsWENsYXNzID0gbGFiZWxDbGFzcyArIFwiLXhcIjtcclxuICAgICAgICB2YXIgbGFiZWxZQ2xhc3MgPSBsYWJlbENsYXNzICsgXCIteVwiO1xyXG4gICAgICAgIHBsb3QubGFiZWxDbGFzcyA9IGxhYmVsQ2xhc3M7XHJcblxyXG5cclxuICAgICAgICB2YXIgbGFiZWxzWCA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiK2xhYmVsWENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShwbG90LnZhcmlhYmxlcywgKGQsIGkpPT5pKTtcclxuXHJcbiAgICAgICAgbGFiZWxzWC5lbnRlcigpLmFwcGVuZChcInRleHRcIikuYXR0cihcImNsYXNzXCIsIChkLCBpKSA9PiBsYWJlbENsYXNzICsgXCIgXCIgK2xhYmVsWENsYXNzK1wiIFwiKyBsYWJlbFhDbGFzcyArIFwiLVwiICsgaSk7XHJcblxyXG5cclxuICAgICAgICBsYWJlbHNYXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAoZCwgaSkgPT4gaSAqIHBsb3QuY2VsbFNpemUgKyBwbG90LmNlbGxTaXplIC8gMilcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIHBsb3QuaGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcImR4XCIsIC0yKVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIDUpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIilcclxuXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJoYW5naW5nXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KHY9PnBsb3QubGFiZWxCeVZhcmlhYmxlW3ZdKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5jb25maWcucm90YXRlTGFiZWxzWCl7XHJcbiAgICAgICAgICAgIGxhYmVsc1guYXR0cihcInRyYW5zZm9ybVwiLCAoZCwgaSkgPT4gXCJyb3RhdGUoLTQ1LCBcIiArIChpICogcGxvdC5jZWxsU2l6ZSArIHBsb3QuY2VsbFNpemUgLyAyICApICsgXCIsIFwiICsgcGxvdC5oZWlnaHQgKyBcIilcIilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxhYmVsc1guZXhpdCgpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAvLy8vLy9cclxuXHJcbiAgICAgICAgdmFyIGxhYmVsc1kgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIitsYWJlbFlDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGxvdC52YXJpYWJsZXMpO1xyXG5cclxuICAgICAgICBsYWJlbHNZLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKTtcclxuXHJcblxyXG4gICAgICAgIGxhYmVsc1lcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAoZCwgaSkgPT4gaSAqIHBsb3QuY2VsbFNpemUgKyBwbG90LmNlbGxTaXplIC8gMilcclxuICAgICAgICAgICAgLmF0dHIoXCJkeFwiLCAtMilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIChkLCBpKSA9PiBsYWJlbENsYXNzICsgXCIgXCIgKyBsYWJlbFlDbGFzcyArXCIgXCIgKyBsYWJlbFlDbGFzcyArIFwiLVwiICsgaSlcclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcImhhbmdpbmdcIilcclxuICAgICAgICAgICAgLnRleHQodj0+cGxvdC5sYWJlbEJ5VmFyaWFibGVbdl0pO1xyXG5cclxuICAgICAgICBpZih0aGlzLmNvbmZpZy5yb3RhdGVMYWJlbHNZKXtcclxuICAgICAgICAgICAgbGFiZWxzWC5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInJvdGF0ZSgtNDUsIFwiICsgKGkgKiBwbG90LmNlbGxTaXplICsgcGxvdC5jZWxsU2l6ZSAvIDIgICkgKyBcIiwgXCIgKyBwbG90LmhlaWdodCArIFwiKVwiKTtcclxuICAgICAgICAgICAgbGFiZWxzWVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwicm90YXRlKC00NSwgXCIgKyAwICsgXCIsIFwiICsgKGkgKiBwbG90LmNlbGxTaXplICsgcGxvdC5jZWxsU2l6ZSAvIDIpICsgXCIpXCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGFiZWxzWS5leGl0KCkucmVtb3ZlKCk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVDZWxscygpIHtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBjZWxsQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwiY2VsbFwiKTtcclxuICAgICAgICB2YXIgY2VsbFNoYXBlID0gcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS50eXBlO1xyXG5cclxuICAgICAgICB2YXIgY2VsbHMgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwiZy5cIitjZWxsQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBsb3QuY29ycmVsYXRpb24ubWF0cml4LmNlbGxzKTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxFbnRlckcgPSBjZWxscy5lbnRlcigpLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmNsYXNzZWQoY2VsbENsYXNzLCB0cnVlKTtcclxuICAgICAgICBjZWxscy5hdHRyKFwidHJhbnNmb3JtXCIsIGM9PiBcInRyYW5zbGF0ZShcIiArIChwbG90LmNlbGxTaXplICogYy5jb2wgKyBwbG90LmNlbGxTaXplIC8gMikgKyBcIixcIiArIChwbG90LmNlbGxTaXplICogYy5yb3cgKyBwbG90LmNlbGxTaXplIC8gMikgKyBcIilcIik7XHJcblxyXG4gICAgICAgIGNlbGxzLmNsYXNzZWQoc2VsZi5jb25maWcuY3NzQ2xhc3NQcmVmaXggKyBcInNlbGVjdGFibGVcIiwgISFzZWxmLnNjYXR0ZXJQbG90KTtcclxuXHJcbiAgICAgICAgdmFyIHNlbGVjdG9yID0gXCIqOm5vdCguY2VsbC1zaGFwZS1cIitjZWxsU2hhcGUrXCIpXCI7XHJcbiAgICAgICBcclxuICAgICAgICB2YXIgd3JvbmdTaGFwZXMgPSBjZWxscy5zZWxlY3RBbGwoc2VsZWN0b3IpO1xyXG4gICAgICAgIHdyb25nU2hhcGVzLnJlbW92ZSgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBzaGFwZXMgPSBjZWxscy5zZWxlY3RPckFwcGVuZChjZWxsU2hhcGUrXCIuY2VsbC1zaGFwZS1cIitjZWxsU2hhcGUpO1xyXG5cclxuICAgICAgICBpZiAocGxvdC5jb3JyZWxhdGlvbi5zaGFwZS50eXBlID09ICdjaXJjbGUnKSB7XHJcblxyXG4gICAgICAgICAgICBzaGFwZXNcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiclwiLCBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnJhZGl1cylcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY3hcIiwgMClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY3lcIiwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGxvdC5jb3JyZWxhdGlvbi5zaGFwZS50eXBlID09ICdlbGxpcHNlJykge1xyXG4gICAgICAgICAgICAvLyBjZWxscy5hdHRyKFwidHJhbnNmb3JtXCIsIGM9PiBcInRyYW5zbGF0ZSgzMDAsMTUwKSByb3RhdGUoXCIrcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5yb3RhdGVWYWwoYy52YWx1ZSkrXCIpXCIpO1xyXG4gICAgICAgICAgICBzaGFwZXNcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwicnhcIiwgcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5yYWRpdXNYKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJyeVwiLCBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnJhZGl1c1kpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImN4XCIsIDApXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImN5XCIsIDApXHJcblxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYz0+IFwicm90YXRlKFwiICsgcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5yb3RhdGVWYWwoYy52YWx1ZSkgKyBcIilcIik7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgaWYgKHBsb3QuY29ycmVsYXRpb24uc2hhcGUudHlwZSA9PSAncmVjdCcpIHtcclxuICAgICAgICAgICAgc2hhcGVzXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHBsb3QuY29ycmVsYXRpb24uc2hhcGUuc2l6ZSlcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIHBsb3QuY29ycmVsYXRpb24uc2hhcGUuc2l6ZSlcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieFwiLCAtcGxvdC5jZWxsU2l6ZSAvIDIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInlcIiwgLXBsb3QuY2VsbFNpemUgLyAyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2hhcGVzLnN0eWxlKFwiZmlsbFwiLCBjPT4gcGxvdC5jb3JyZWxhdGlvbi5jb2xvci5zY2FsZShjLnZhbHVlKSk7XHJcblxyXG4gICAgICAgIHZhciBtb3VzZW92ZXJDYWxsYmFja3MgPSBbXTtcclxuICAgICAgICB2YXIgbW91c2VvdXRDYWxsYmFja3MgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKHBsb3QudG9vbHRpcCkge1xyXG5cclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goYz0+IHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGh0bWwgPSBjLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLmh0bWwoaHRtbClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLnB1c2goYz0+IHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2VsZi5jb25maWcuaGlnaGxpZ2h0TGFiZWxzKSB7XHJcbiAgICAgICAgICAgIHZhciBoaWdobGlnaHRDbGFzcyA9IHNlbGYuY29uZmlnLmNzc0NsYXNzUHJlZml4ICsgXCJoaWdobGlnaHRcIjtcclxuICAgICAgICAgICAgdmFyIHhMYWJlbENsYXNzID0gYz0+cGxvdC5sYWJlbENsYXNzICsgXCIteC1cIiArIGMuY29sO1xyXG4gICAgICAgICAgICB2YXIgeUxhYmVsQ2xhc3MgPSBjPT5wbG90LmxhYmVsQ2xhc3MgKyBcIi15LVwiICsgYy5yb3c7XHJcblxyXG5cclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goYz0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHhMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgeUxhYmVsQ2xhc3MoYykpLmNsYXNzZWQoaGlnaGxpZ2h0Q2xhc3MsIHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MucHVzaChjPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB4TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB5TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBjZWxscy5vbihcIm1vdXNlb3ZlclwiLCBjID0+IHtcclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2s9PmNhbGxiYWNrKGMpKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCBjID0+IHtcclxuICAgICAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2s9PmNhbGxiYWNrKGMpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNlbGxzLm9uKFwiY2xpY2tcIiwgYz0+e1xyXG4gICAgICAgICAgIHNlbGYudHJpZ2dlcihcImNlbGwtc2VsZWN0ZWRcIiwgYyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgY2VsbHMuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB1cGRhdGVMZWdlbmQoKSB7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciBsZWdlbmRYID0gdGhpcy5wbG90LndpZHRoICsgMTA7XHJcbiAgICAgICAgdmFyIGxlZ2VuZFkgPSAwO1xyXG4gICAgICAgIHZhciBiYXJXaWR0aCA9IDEwO1xyXG4gICAgICAgIHZhciBiYXJIZWlnaHQgPSB0aGlzLnBsb3QuaGVpZ2h0IC0gMjtcclxuICAgICAgICB2YXIgc2NhbGUgPSBwbG90LmNvcnJlbGF0aW9uLmNvbG9yLnNjYWxlO1xyXG5cclxuICAgICAgICBwbG90LmxlZ2VuZCA9IG5ldyBMZWdlbmQodGhpcy5zdmcsIHRoaXMuc3ZnRywgc2NhbGUsIGxlZ2VuZFgsIGxlZ2VuZFkpLmxpbmVhckdyYWRpZW50QmFyKGJhcldpZHRoLCBiYXJIZWlnaHQpO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXR0YWNoU2NhdHRlclBsb3QoY29udGFpbmVyU2VsZWN0b3IsIGNvbmZpZykge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xyXG5cclxuXHJcbiAgICAgICAgdmFyIHNjYXR0ZXJQbG90Q29uZmlnID0ge1xyXG4gICAgICAgICAgICBoZWlnaHQ6IHNlbGYucGxvdC5oZWlnaHQrc2VsZi5jb25maWcubWFyZ2luLnRvcCsgc2VsZi5jb25maWcubWFyZ2luLmJvdHRvbSxcclxuICAgICAgICAgICAgd2lkdGg6IHNlbGYucGxvdC5oZWlnaHQrc2VsZi5jb25maWcubWFyZ2luLnRvcCsgc2VsZi5jb25maWcubWFyZ2luLmJvdHRvbSxcclxuICAgICAgICAgICAgZ3JvdXBzOntcclxuICAgICAgICAgICAgICAgIGtleTogc2VsZi5jb25maWcuZ3JvdXBzLmtleSxcclxuICAgICAgICAgICAgICAgIGxhYmVsOiBzZWxmLmNvbmZpZy5ncm91cHMubGFiZWxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ3VpZGVzOiB0cnVlLFxyXG4gICAgICAgICAgICBzaG93TGVnZW5kOiBmYWxzZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2NhdHRlclBsb3Q9dHJ1ZTtcclxuXHJcbiAgICAgICAgc2NhdHRlclBsb3RDb25maWcgPSBVdGlscy5kZWVwRXh0ZW5kKHNjYXR0ZXJQbG90Q29uZmlnLCBjb25maWcpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMub24oXCJjZWxsLXNlbGVjdGVkXCIsIGM9PntcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgc2NhdHRlclBsb3RDb25maWcueD17XHJcbiAgICAgICAgICAgICAgICBrZXk6IGMucm93VmFyLFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6IHNlbGYucGxvdC5sYWJlbEJ5VmFyaWFibGVbYy5yb3dWYXJdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHNjYXR0ZXJQbG90Q29uZmlnLnk9e1xyXG4gICAgICAgICAgICAgICAga2V5OiBjLmNvbFZhcixcclxuICAgICAgICAgICAgICAgIGxhYmVsOiBzZWxmLnBsb3QubGFiZWxCeVZhcmlhYmxlW2MuY29sVmFyXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZihzZWxmLnNjYXR0ZXJQbG90ICYmIHNlbGYuc2NhdHRlclBsb3QgIT09dHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNjYXR0ZXJQbG90LnNldENvbmZpZyhzY2F0dGVyUGxvdENvbmZpZykuaW5pdCgpO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2NhdHRlclBsb3QgPSBuZXcgU2NhdHRlclBsb3QoY29udGFpbmVyU2VsZWN0b3IsIHNlbGYuZGF0YSwgc2NhdHRlclBsb3RDb25maWcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdHRhY2goXCJTY2F0dGVyUGxvdFwiLCBzZWxmLnNjYXR0ZXJQbG90KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBEM0V4dGVuc2lvbnN7XHJcblxyXG4gICAgc3RhdGljIGV4dGVuZCgpe1xyXG5cclxuICAgICAgICBkMy5zZWxlY3Rpb24uZW50ZXIucHJvdG90eXBlLmluc2VydFNlbGVjdG9yID1cclxuICAgICAgICAgICAgZDMuc2VsZWN0aW9uLnByb3RvdHlwZS5pbnNlcnRTZWxlY3RvciA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBiZWZvcmUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBVdGlscy5pbnNlcnRTZWxlY3Rvcih0aGlzLCBzZWxlY3RvciwgYmVmb3JlKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIGQzLnNlbGVjdGlvbi5lbnRlci5wcm90b3R5cGUuYXBwZW5kU2VsZWN0b3IgPVxyXG4gICAgICAgICAgICBkMy5zZWxlY3Rpb24ucHJvdG90eXBlLmFwcGVuZFNlbGVjdG9yID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBVdGlscy5hcHBlbmRTZWxlY3Rvcih0aGlzLCBzZWxlY3Rvcik7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIGQzLnNlbGVjdGlvbi5lbnRlci5wcm90b3R5cGUuc2VsZWN0T3JBcHBlbmQgPVxyXG4gICAgICAgICAgICBkMy5zZWxlY3Rpb24ucHJvdG90eXBlLnNlbGVjdE9yQXBwZW5kID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBVdGlscy5zZWxlY3RPckFwcGVuZCh0aGlzLCBzZWxlY3Rvcik7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIGQzLnNlbGVjdGlvbi5lbnRlci5wcm90b3R5cGUuc2VsZWN0T3JJbnNlcnQgPVxyXG4gICAgICAgICAgICBkMy5zZWxlY3Rpb24ucHJvdG90eXBlLnNlbGVjdE9ySW5zZXJ0ID0gZnVuY3Rpb24oc2VsZWN0b3IsIGJlZm9yZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFV0aWxzLnNlbGVjdE9ySW5zZXJ0KHRoaXMsIHNlbGVjdG9yLCBiZWZvcmUpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuXHJcblxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q2hhcnQsIENoYXJ0Q29uZmlnfSBmcm9tIFwiLi9jaGFydFwiO1xyXG5pbXBvcnQge0hlYXRtYXAsIEhlYXRtYXBDb25maWd9IGZyb20gXCIuL2hlYXRtYXBcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IHtTdGF0aXN0aWNzVXRpbHN9IGZyb20gJy4vc3RhdGlzdGljcy11dGlscydcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgSGVhdG1hcFRpbWVTZXJpZXNDb25maWcgZXh0ZW5kcyBIZWF0bWFwQ29uZmlnIHtcclxuICAgIHggPSB7XHJcbiAgICAgICAgZmlsbE1pc3Npbmc6IGZhbHNlIC8vIGZpaWxsIG1pc3NpbmcgdmFsdWVzIHdpdGggbmVhcmVzdCBwcmV2aW91cyB2YWx1ZVxyXG4gICAgfTtcclxuICAgIHogPSB7XHJcbiAgICAgICAgZmlsbE1pc3Npbmc6IHRydWUgLy8gZmlpbGwgbWlzc2luZyB2YWx1ZXMgd2l0aCBuZWFyZXN0IHByZXZpb3VzIHZhbHVlXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIGlmIChjdXN0b20pIHtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBIZWF0bWFwVGltZVNlcmllcyBleHRlbmRzIEhlYXRtYXAge1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IEhlYXRtYXBUaW1lU2VyaWVzQ29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBIZWF0bWFwVGltZVNlcmllc0NvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cFZhbHVlc0JlZm9yZUdyb3Vwc1NvcnQoKSB7XHJcbiAgICAgICAgc3VwZXIuc2V0dXBWYWx1ZXNCZWZvcmVHcm91cHNTb3J0KCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy54LmZpbGxNaXNzaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueC51bmlxdWVWYWx1ZXMuc29ydCh0aGlzLmNvbmZpZy54LnNvcnRDb21wYXJhdG9yKTtcclxuXHJcbiAgICAgICAgdmFyIHByZXYgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueC51bmlxdWVWYWx1ZXMuZm9yRWFjaCgoeCwgaSk9PiB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5nZXRUaW1lVmFsdWUoeCk7XHJcbiAgICAgICAgICAgIGlmIChwcmV2ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBwcmV2ID0gY3VycmVudDtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIG5leHQgPSBzZWxmLm5leHRUaW1lVGlja1ZhbHVlKHByZXYpO1xyXG4gICAgICAgICAgICB2YXIgbWlzc2luZyA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgaXRlcmF0aW9uID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKCFzZWxmLnRpbWVWYWx1ZXNFcXVhbChjdXJyZW50LCBuZXh0KSkge1xyXG4gICAgICAgICAgICAgICAgaXRlcmF0aW9uKys7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlcmF0aW9uID4gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgZFt0aGlzLmNvbmZpZy54LmtleV0gPSBuZXh0O1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYudXBkYXRlR3JvdXBzKGQsIG5leHQsIHNlbGYucGxvdC54Lmdyb3Vwcywgc2VsZi5jb25maWcueC5ncm91cHMpO1xyXG4gICAgICAgICAgICAgICAgbWlzc2luZy5wdXNoKG5leHQpO1xyXG4gICAgICAgICAgICAgICAgbmV4dCA9IHNlbGYubmV4dFRpbWVUaWNrVmFsdWUobmV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJldiA9IGN1cnJlbnQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGdldFRpbWVWYWx1ZSh4KSB7XHJcbiAgICAgICAgcmV0dXJuIE51bWJlcih4KTtcclxuICAgIH1cclxuXHJcbiAgICB0aW1lVmFsdWVzRXF1YWwoYSwgYikge1xyXG4gICAgICAgIHJldHVybiBhID09IGI7XHJcbiAgICB9XHJcblxyXG4gICAgbmV4dFRpbWVUaWNrVmFsdWUodCkge1xyXG4gICAgICAgIHJldHVybiB0ICsgMTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0UGxvdCgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcuei5maWxsTWlzc2luZykge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWF0cml4LmZvckVhY2goKHJvdywgcm93SW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBwcmV2Um93VmFsdWUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICByb3cuZm9yRWFjaCgoY2VsbCwgY29sSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbC52YWx1ZSA9PT0gdW5kZWZpbmVkICYmIHByZXZSb3dWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwudmFsdWUgPSBwcmV2Um93VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwubWlzc2luZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHByZXZSb3dWYWx1ZSA9IGNlbGwudmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKG5ld0RhdGEpIHtcclxuICAgICAgICBzdXBlci51cGRhdGUobmV3RGF0YSk7XHJcblxyXG4gICAgfTtcclxuXHJcblxyXG59XHJcblxyXG4iLCJpbXBvcnQge0NoYXJ0LCBDaGFydENvbmZpZ30gZnJvbSBcIi4vY2hhcnRcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IHtMZWdlbmR9IGZyb20gJy4vbGVnZW5kJ1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBIZWF0bWFwQ29uZmlnIGV4dGVuZHMgQ2hhcnRDb25maWcge1xyXG5cclxuICAgIHN2Z0NsYXNzID0gJ29kYy1oZWF0bWFwJztcclxuICAgIHNob3dUb29sdGlwID0gdHJ1ZTsgLy9zaG93IHRvb2x0aXAgb24gZG90IGhvdmVyXHJcbiAgICB0b29sdGlwID0ge1xyXG4gICAgICAgIG5vRGF0YVRleHQ6IFwiTi9BXCJcclxuICAgIH07XHJcbiAgICBzaG93TGVnZW5kID0gdHJ1ZTtcclxuICAgIGxlZ2VuZCA9IHtcclxuICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgcm90YXRlTGFiZWxzOiBmYWxzZSxcclxuICAgICAgICBkZWNpbWFsUGxhY2VzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgZm9ybWF0dGVyOiB2ID0+IHRoaXMubGVnZW5kLmRlY2ltYWxQbGFjZXMgPT09IHVuZGVmaW5lZCA/IHYgOiBOdW1iZXIodikudG9GaXhlZCh0aGlzLmxlZ2VuZC5kZWNpbWFsUGxhY2VzKVxyXG4gICAgfVxyXG4gICAgaGlnaGxpZ2h0TGFiZWxzID0gdHJ1ZTtcclxuICAgIHggPSB7Ly8gWCBheGlzIGNvbmZpZ1xyXG4gICAgICAgIHRpdGxlOiAnJywgLy8gYXhpcyB0aXRsZVxyXG4gICAgICAgIGtleTogMCxcclxuICAgICAgICB2YWx1ZTogKGQpID0+IGRbdGhpcy54LmtleV0sIC8vIHggdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICByb3RhdGVMYWJlbHM6IHRydWUsXHJcbiAgICAgICAgc29ydExhYmVsczogZmFsc2UsXHJcbiAgICAgICAgc29ydENvbXBhcmF0b3I6IChhLCBiKT0+IFV0aWxzLmlzTnVtYmVyKGEpID8gYSAtIGIgOiBhLmxvY2FsZUNvbXBhcmUoYiksXHJcbiAgICAgICAgZ3JvdXBzOiB7XHJcbiAgICAgICAgICAgIGtleXM6IFtdLFxyXG4gICAgICAgICAgICBsYWJlbHM6IFtdLFxyXG4gICAgICAgICAgICB2YWx1ZTogKGQsIGtleSkgPT4gZFtrZXldLFxyXG4gICAgICAgICAgICBvdmVybGFwOiB7XHJcbiAgICAgICAgICAgICAgICB0b3A6IDIwLFxyXG4gICAgICAgICAgICAgICAgYm90dG9tOiAyMFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb3JtYXR0ZXI6IHVuZGVmaW5lZCAvLyB2YWx1ZSBmb3JtYXR0ZXIgZnVuY3Rpb25cclxuXHJcbiAgICB9O1xyXG4gICAgeSA9IHsvLyBZIGF4aXMgY29uZmlnXHJcbiAgICAgICAgdGl0bGU6ICcnLCAvLyBheGlzIHRpdGxlLFxyXG4gICAgICAgIHJvdGF0ZUxhYmVsczogdHJ1ZSxcclxuICAgICAgICBrZXk6IDEsXHJcbiAgICAgICAgdmFsdWU6IChkKSA9PiBkW3RoaXMueS5rZXldLCAvLyB5IHZhbHVlIGFjY2Vzc29yXHJcbiAgICAgICAgc29ydExhYmVsczogZmFsc2UsXHJcbiAgICAgICAgc29ydENvbXBhcmF0b3I6IChhLCBiKT0+IFV0aWxzLmlzTnVtYmVyKGIpID8gYiAtIGEgOiBiLmxvY2FsZUNvbXBhcmUoYSksXHJcbiAgICAgICAgZ3JvdXBzOiB7XHJcbiAgICAgICAgICAgIGtleXM6IFtdLFxyXG4gICAgICAgICAgICBsYWJlbHM6IFtdLFxyXG4gICAgICAgICAgICB2YWx1ZTogKGQsIGtleSkgPT4gZFtrZXldLFxyXG4gICAgICAgICAgICBvdmVybGFwOiB7XHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAyMCxcclxuICAgICAgICAgICAgICAgIHJpZ2h0OiAyMFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb3JtYXR0ZXI6IHVuZGVmaW5lZC8vIHZhbHVlIGZvcm1hdHRlciBmdW5jdGlvblxyXG4gICAgfTtcclxuICAgIHogPSB7XHJcbiAgICAgICAga2V5OiAyLFxyXG4gICAgICAgIHZhbHVlOiAoZCkgPT4gZFt0aGlzLnoua2V5XSxcclxuICAgICAgICBub3RBdmFpbGFibGVWYWx1ZTogKHYpID0+IHYgPT09IG51bGwgfHwgdiA9PT0gdW5kZWZpbmVkLFxyXG5cclxuICAgICAgICBkZWNpbWFsUGxhY2VzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgZm9ybWF0dGVyOiB2ID0+IHRoaXMuei5kZWNpbWFsUGxhY2VzID09PSB1bmRlZmluZWQgPyB2IDogTnVtYmVyKHYpLnRvRml4ZWQodGhpcy56LmRlY2ltYWxQbGFjZXMpLy8gdmFsdWUgZm9ybWF0dGVyIGZ1bmN0aW9uXHJcblxyXG4gICAgfTtcclxuICAgIGNvbG9yID0ge1xyXG4gICAgICAgIG5vRGF0YUNvbG9yOiBcIndoaXRlXCIsXHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCIsXHJcbiAgICAgICAgcmV2ZXJzZVNjYWxlOiBmYWxzZSxcclxuICAgICAgICByYW5nZTogW1wiZGFya2JsdWVcIiwgXCJsaWdodHNreWJsdWVcIiwgXCJvcmFuZ2VcIiwgXCJjcmltc29uXCIsIFwiZGFya3JlZFwiXVxyXG4gICAgfTtcclxuICAgIGNlbGwgPSB7XHJcbiAgICAgICAgd2lkdGg6IHVuZGVmaW5lZCxcclxuICAgICAgICBoZWlnaHQ6IHVuZGVmaW5lZCxcclxuICAgICAgICBzaXplTWluOiAxNSxcclxuICAgICAgICBzaXplTWF4OiAyNTAsXHJcbiAgICAgICAgcGFkZGluZzogMFxyXG4gICAgfTtcclxuICAgIG1hcmdpbiA9IHtcclxuICAgICAgICBsZWZ0OiA2MCxcclxuICAgICAgICByaWdodDogNTAsXHJcbiAgICAgICAgdG9wOiAzMCxcclxuICAgICAgICBib3R0b206IDgwXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgaWYgKGN1c3RvbSkge1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vL1RPRE8gcmVmYWN0b3JcclxuZXhwb3J0IGNsYXNzIEhlYXRtYXAgZXh0ZW5kcyBDaGFydCB7XHJcblxyXG4gICAgc3RhdGljIG1heEdyb3VwR2FwU2l6ZSA9IDI0O1xyXG4gICAgc3RhdGljIGdyb3VwVGl0bGVSZWN0SGVpZ2h0ID0gNjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBzdXBlcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBuZXcgSGVhdG1hcENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgSGVhdG1hcENvbmZpZyhjb25maWcpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdFBsb3QoKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG1hcmdpbiA9IHRoaXMuY29uZmlnLm1hcmdpbjtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueCA9IHt9O1xyXG4gICAgICAgIHRoaXMucGxvdC55ID0ge307XHJcbiAgICAgICAgdGhpcy5wbG90LnogPSB7XHJcbiAgICAgICAgICAgIG1hdHJpeGVzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGNlbGxzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGNvbG9yOiB7fSxcclxuICAgICAgICAgICAgc2hhcGU6IHt9XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBWYWx1ZXMoKTtcclxuICAgICAgICB0aGlzLmJ1aWxkQ2VsbHMoKTtcclxuXHJcbiAgICAgICAgdmFyIHRpdGxlUmVjdFdpZHRoID0gNjtcclxuICAgICAgICB0aGlzLnBsb3QueC5vdmVybGFwID0ge1xyXG4gICAgICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgICAgIGJvdHRvbTogMFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKHRoaXMucGxvdC5ncm91cEJ5WCkge1xyXG4gICAgICAgICAgICBsZXQgZGVwdGggPSBzZWxmLmNvbmZpZy54Lmdyb3Vwcy5rZXlzLmxlbmd0aDtcclxuICAgICAgICAgICAgbGV0IGFsbFRpdGxlc1dpZHRoID0gZGVwdGggKiAodGl0bGVSZWN0V2lkdGgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wbG90Lngub3ZlcmxhcC5ib3R0b20gPSBzZWxmLmNvbmZpZy54Lmdyb3Vwcy5vdmVybGFwLmJvdHRvbTtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lngub3ZlcmxhcC50b3AgPSBzZWxmLmNvbmZpZy54Lmdyb3Vwcy5vdmVybGFwLnRvcCArIGFsbFRpdGxlc1dpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWFyZ2luLnRvcCA9IGNvbmYubWFyZ2luLnJpZ2h0ICsgY29uZi54Lmdyb3Vwcy5vdmVybGFwLnRvcDtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lm1hcmdpbi5ib3R0b20gPSBjb25mLm1hcmdpbi5ib3R0b20gKyBjb25mLnguZ3JvdXBzLm92ZXJsYXAuYm90dG9tO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMucGxvdC55Lm92ZXJsYXAgPSB7XHJcbiAgICAgICAgICAgIGxlZnQ6IDAsXHJcbiAgICAgICAgICAgIHJpZ2h0OiAwXHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBsb3QuZ3JvdXBCeVkpIHtcclxuICAgICAgICAgICAgbGV0IGRlcHRoID0gc2VsZi5jb25maWcueS5ncm91cHMua2V5cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGxldCBhbGxUaXRsZXNXaWR0aCA9IGRlcHRoICogKHRpdGxlUmVjdFdpZHRoKTtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lnkub3ZlcmxhcC5yaWdodCA9IHNlbGYuY29uZmlnLnkuZ3JvdXBzLm92ZXJsYXAubGVmdCArIGFsbFRpdGxlc1dpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QueS5vdmVybGFwLmxlZnQgPSBzZWxmLmNvbmZpZy55Lmdyb3Vwcy5vdmVybGFwLmxlZnQ7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5tYXJnaW4ubGVmdCA9IGNvbmYubWFyZ2luLmxlZnQgKyB0aGlzLnBsb3QueS5vdmVybGFwLmxlZnQ7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5tYXJnaW4ucmlnaHQgPSBjb25mLm1hcmdpbi5yaWdodCArIHRoaXMucGxvdC55Lm92ZXJsYXAucmlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxvdC5zaG93TGVnZW5kID0gY29uZi5zaG93TGVnZW5kO1xyXG4gICAgICAgIGlmICh0aGlzLnBsb3Quc2hvd0xlZ2VuZCkge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWFyZ2luLnJpZ2h0ICs9IGNvbmYubGVnZW5kLndpZHRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNvbXB1dGVQbG90U2l6ZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBaU2NhbGUoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXBWYWx1ZXMoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBjb25maWcgPSBzZWxmLmNvbmZpZztcclxuICAgICAgICB2YXIgeCA9IHNlbGYucGxvdC54O1xyXG4gICAgICAgIHZhciB5ID0gc2VsZi5wbG90Lnk7XHJcbiAgICAgICAgdmFyIHogPSBzZWxmLnBsb3QuejtcclxuXHJcblxyXG4gICAgICAgIHgudmFsdWUgPSBkID0+IGNvbmZpZy54LnZhbHVlLmNhbGwoY29uZmlnLCBkKTtcclxuICAgICAgICB5LnZhbHVlID0gZCA9PiBjb25maWcueS52YWx1ZS5jYWxsKGNvbmZpZywgZCk7XHJcbiAgICAgICAgei52YWx1ZSA9IGQgPT4gY29uZmlnLnoudmFsdWUuY2FsbChjb25maWcsIGQpO1xyXG5cclxuICAgICAgICB4LnVuaXF1ZVZhbHVlcyA9IFtdO1xyXG4gICAgICAgIHkudW5pcXVlVmFsdWVzID0gW107XHJcblxyXG5cclxuICAgICAgICBzZWxmLnBsb3QuZ3JvdXBCeVkgPSAhIWNvbmZpZy55Lmdyb3Vwcy5rZXlzLmxlbmd0aDtcclxuICAgICAgICBzZWxmLnBsb3QuZ3JvdXBCeVggPSAhIWNvbmZpZy54Lmdyb3Vwcy5rZXlzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgeS5ncm91cHMgPSB7XHJcbiAgICAgICAgICAgIGtleTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBsYWJlbDogJycsXHJcbiAgICAgICAgICAgIHZhbHVlczogW10sXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBudWxsLFxyXG4gICAgICAgICAgICBsZXZlbDogMCxcclxuICAgICAgICAgICAgaW5kZXg6IDAsXHJcbiAgICAgICAgICAgIGxhc3RJbmRleDogMFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgeC5ncm91cHMgPSB7XHJcbiAgICAgICAgICAgIGtleTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBsYWJlbDogJycsXHJcbiAgICAgICAgICAgIHZhbHVlczogW10sXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBudWxsLFxyXG4gICAgICAgICAgICBsZXZlbDogMCxcclxuICAgICAgICAgICAgaW5kZXg6IDAsXHJcbiAgICAgICAgICAgIGxhc3RJbmRleDogMFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciB2YWx1ZU1hcCA9IHt9O1xyXG4gICAgICAgIHZhciBtaW5aID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHZhciBtYXhaID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuZGF0YS5mb3JFYWNoKGQ9PiB7XHJcblxyXG4gICAgICAgICAgICB2YXIgeFZhbCA9IHgudmFsdWUoZCk7XHJcbiAgICAgICAgICAgIHZhciB5VmFsID0geS52YWx1ZShkKTtcclxuICAgICAgICAgICAgdmFyIHpWYWxSYXcgPSB6LnZhbHVlKGQpO1xyXG4gICAgICAgICAgICB2YXIgelZhbCA9IGNvbmZpZy56Lm5vdEF2YWlsYWJsZVZhbHVlKHpWYWxSYXcpID8gdW5kZWZpbmVkIDogcGFyc2VGbG9hdCh6VmFsUmF3KTtcclxuXHJcblxyXG4gICAgICAgICAgICBpZiAoeC51bmlxdWVWYWx1ZXMuaW5kZXhPZih4VmFsKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHgudW5pcXVlVmFsdWVzLnB1c2goeFZhbCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh5LnVuaXF1ZVZhbHVlcy5pbmRleE9mKHlWYWwpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgeS51bmlxdWVWYWx1ZXMucHVzaCh5VmFsKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGdyb3VwWSA9IHkuZ3JvdXBzO1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5wbG90Lmdyb3VwQnlZKSB7XHJcbiAgICAgICAgICAgICAgICBncm91cFkgPSB0aGlzLnVwZGF0ZUdyb3VwcyhkLCB5VmFsLCB5Lmdyb3VwcywgY29uZmlnLnkuZ3JvdXBzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZ3JvdXBYID0geC5ncm91cHM7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnBsb3QuZ3JvdXBCeVgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBncm91cFggPSB0aGlzLnVwZGF0ZUdyb3VwcyhkLCB4VmFsLCB4Lmdyb3VwcywgY29uZmlnLnguZ3JvdXBzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCF2YWx1ZU1hcFtncm91cFkuaW5kZXhdKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZU1hcFtncm91cFkuaW5kZXhdID0ge307XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghdmFsdWVNYXBbZ3JvdXBZLmluZGV4XVtncm91cFguaW5kZXhdKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZU1hcFtncm91cFkuaW5kZXhdW2dyb3VwWC5pbmRleF0gPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXZhbHVlTWFwW2dyb3VwWS5pbmRleF1bZ3JvdXBYLmluZGV4XVt5VmFsXSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWVNYXBbZ3JvdXBZLmluZGV4XVtncm91cFguaW5kZXhdW3lWYWxdID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFsdWVNYXBbZ3JvdXBZLmluZGV4XVtncm91cFguaW5kZXhdW3lWYWxdW3hWYWxdID0gelZhbDtcclxuXHJcblxyXG4gICAgICAgICAgICBpZiAobWluWiA9PT0gdW5kZWZpbmVkIHx8IHpWYWwgPCBtaW5aKSB7XHJcbiAgICAgICAgICAgICAgICBtaW5aID0gelZhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobWF4WiA9PT0gdW5kZWZpbmVkIHx8IHpWYWwgPiBtYXhaKSB7XHJcbiAgICAgICAgICAgICAgICBtYXhaID0gelZhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHNlbGYucGxvdC52YWx1ZU1hcCA9IHZhbHVlTWFwO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKCFzZWxmLnBsb3QuZ3JvdXBCeVgpIHtcclxuICAgICAgICAgICAgeC5ncm91cHMudmFsdWVzID0geC51bmlxdWVWYWx1ZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXNlbGYucGxvdC5ncm91cEJ5WSkge1xyXG4gICAgICAgICAgICB5Lmdyb3Vwcy52YWx1ZXMgPSB5LnVuaXF1ZVZhbHVlcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBWYWx1ZXNCZWZvcmVHcm91cHNTb3J0KCk7XHJcblxyXG4gICAgICAgIHguZ2FwcyA9IFtdO1xyXG4gICAgICAgIHgudG90YWxWYWx1ZXNDb3VudCA9IDA7XHJcbiAgICAgICAgeC5hbGxWYWx1ZXNMaXN0ID0gW107XHJcbiAgICAgICAgdGhpcy5zb3J0R3JvdXBzKHgsIHguZ3JvdXBzLCBjb25maWcueCk7XHJcblxyXG4gICAgICAgIHkuZ2FwcyA9IFtdO1xyXG4gICAgICAgIHkudG90YWxWYWx1ZXNDb3VudCA9IDA7XHJcbiAgICAgICAgeS5hbGxWYWx1ZXNMaXN0ID0gW107XHJcbiAgICAgICAgdGhpcy5zb3J0R3JvdXBzKHksIHkuZ3JvdXBzLCBjb25maWcueSk7XHJcblxyXG4gICAgICAgIHoubWluID0gbWluWjtcclxuICAgICAgICB6Lm1heCA9IG1heFo7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNldHVwVmFsdWVzQmVmb3JlR3JvdXBzU29ydCgpIHtcclxuICAgIH1cclxuXHJcbiAgICBidWlsZENlbGxzKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgeCA9IHNlbGYucGxvdC54O1xyXG4gICAgICAgIHZhciB5ID0gc2VsZi5wbG90Lnk7XHJcbiAgICAgICAgdmFyIHogPSBzZWxmLnBsb3QuejtcclxuICAgICAgICB2YXIgdmFsdWVNYXAgPSBzZWxmLnBsb3QudmFsdWVNYXA7XHJcblxyXG4gICAgICAgIHZhciBtYXRyaXhDZWxscyA9IHNlbGYucGxvdC5jZWxscyA9IFtdO1xyXG4gICAgICAgIHZhciBtYXRyaXggPSBzZWxmLnBsb3QubWF0cml4ID0gW107XHJcblxyXG4gICAgICAgIHkuYWxsVmFsdWVzTGlzdC5mb3JFYWNoKCh2MSwgaSk9PiB7XHJcbiAgICAgICAgICAgIHZhciByb3cgPSBbXTtcclxuICAgICAgICAgICAgbWF0cml4LnB1c2gocm93KTtcclxuXHJcbiAgICAgICAgICAgIHguYWxsVmFsdWVzTGlzdC5mb3JFYWNoKCh2MiwgaikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHpWYWwgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHpWYWwgPSB2YWx1ZU1hcFt2MS5ncm91cC5pbmRleF1bdjIuZ3JvdXAuaW5kZXhdW3YxLnZhbF1bdjIudmFsXVxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBjZWxsID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvd1ZhcjogdjEsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sVmFyOiB2MixcclxuICAgICAgICAgICAgICAgICAgICByb3c6IGksXHJcbiAgICAgICAgICAgICAgICAgICAgY29sOiBqLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB6VmFsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcm93LnB1c2goY2VsbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbWF0cml4Q2VsbHMucHVzaChjZWxsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUdyb3VwcyhkLCBheGlzVmFsLCByb290R3JvdXAsIGF4aXNHcm91cHNDb25maWcpIHtcclxuXHJcbiAgICAgICAgdmFyIGNvbmZpZyA9IHRoaXMuY29uZmlnO1xyXG4gICAgICAgIHZhciBjdXJyZW50R3JvdXAgPSByb290R3JvdXA7XHJcbiAgICAgICAgYXhpc0dyb3Vwc0NvbmZpZy5rZXlzLmZvckVhY2goKGdyb3VwS2V5LCBncm91cEtleUluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRHcm91cC5rZXkgPSBncm91cEtleTtcclxuXHJcbiAgICAgICAgICAgIGlmICghY3VycmVudEdyb3VwLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAuY2hpbGRyZW4gPSB7fTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGdyb3VwaW5nVmFsdWUgPSBheGlzR3JvdXBzQ29uZmlnLnZhbHVlLmNhbGwoY29uZmlnLCBkLCBncm91cEtleSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWN1cnJlbnRHcm91cC5jaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShncm91cGluZ1ZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcm9vdEdyb3VwLmxhc3RJbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLmNoaWxkcmVuW2dyb3VwaW5nVmFsdWVdID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlczogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBpbmdWYWx1ZTogZ3JvdXBpbmdWYWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICBsZXZlbDogY3VycmVudEdyb3VwLmxldmVsICsgMSxcclxuICAgICAgICAgICAgICAgICAgICBpbmRleDogcm9vdEdyb3VwLmxhc3RJbmRleCxcclxuICAgICAgICAgICAgICAgICAgICBrZXk6IGdyb3VwS2V5XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGN1cnJlbnRHcm91cCA9IGN1cnJlbnRHcm91cC5jaGlsZHJlbltncm91cGluZ1ZhbHVlXTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKGN1cnJlbnRHcm91cC52YWx1ZXMuaW5kZXhPZihheGlzVmFsKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgY3VycmVudEdyb3VwLnZhbHVlcy5wdXNoKGF4aXNWYWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRHcm91cDtcclxuICAgIH1cclxuXHJcbiAgICBzb3J0R3JvdXBzKGF4aXMsIGdyb3VwLCBheGlzQ29uZmlnLCBnYXBzKSB7XHJcbiAgICAgICAgaWYgKGF4aXNDb25maWcuZ3JvdXBzLmxhYmVscyAmJiBheGlzQ29uZmlnLmdyb3Vwcy5sYWJlbHMubGVuZ3RoID4gZ3JvdXAubGV2ZWwpIHtcclxuICAgICAgICAgICAgZ3JvdXAubGFiZWwgPSBheGlzQ29uZmlnLmdyb3Vwcy5sYWJlbHNbZ3JvdXAubGV2ZWxdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGdyb3VwLmxhYmVsID0gZ3JvdXAua2V5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFnYXBzKSB7XHJcbiAgICAgICAgICAgIGdhcHMgPSBbMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChnYXBzLmxlbmd0aCA8PSBncm91cC5sZXZlbCkge1xyXG4gICAgICAgICAgICBnYXBzLnB1c2goMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBncm91cC5hbGxWYWx1ZXNDb3VudCA9IGdyb3VwLmFsbFZhbHVlc0NvdW50IHx8IDA7XHJcbiAgICAgICAgZ3JvdXAuYWxsVmFsdWVzQmVmb3JlQ291bnQgPSBncm91cC5hbGxWYWx1ZXNCZWZvcmVDb3VudCB8fCAwO1xyXG5cclxuICAgICAgICBncm91cC5nYXBzID0gZ2Fwcy5zbGljZSgpO1xyXG4gICAgICAgIGdyb3VwLmdhcHNCZWZvcmUgPSBnYXBzLnNsaWNlKCk7XHJcblxyXG5cclxuICAgICAgICBncm91cC5nYXBzU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcHNTaXplKGdyb3VwLmdhcHMpO1xyXG4gICAgICAgIGdyb3VwLmdhcHNCZWZvcmVTaXplID0gZ3JvdXAuZ2Fwc1NpemU7XHJcbiAgICAgICAgaWYgKGdyb3VwLnZhbHVlcykge1xyXG4gICAgICAgICAgICBpZiAoYXhpc0NvbmZpZy5zb3J0TGFiZWxzKSB7XHJcbiAgICAgICAgICAgICAgICBncm91cC52YWx1ZXMuc29ydChheGlzQ29uZmlnLnNvcnRDb21wYXJhdG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBncm91cC52YWx1ZXMuZm9yRWFjaCh2PT5heGlzLmFsbFZhbHVlc0xpc3QucHVzaCh7dmFsOiB2LCBncm91cDogZ3JvdXB9KSk7XHJcbiAgICAgICAgICAgIGdyb3VwLmFsbFZhbHVlc0JlZm9yZUNvdW50ID0gYXhpcy50b3RhbFZhbHVlc0NvdW50O1xyXG4gICAgICAgICAgICBheGlzLnRvdGFsVmFsdWVzQ291bnQgKz0gZ3JvdXAudmFsdWVzLmxlbmd0aDtcclxuICAgICAgICAgICAgZ3JvdXAuYWxsVmFsdWVzQ291bnQgKz0gZ3JvdXAudmFsdWVzLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdyb3VwLmNoaWxkcmVuTGlzdCA9IFtdO1xyXG4gICAgICAgIGlmIChncm91cC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRyZW5Db3VudCA9IDA7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBjaGlsZFByb3AgaW4gZ3JvdXAuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgIGlmIChncm91cC5jaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShjaGlsZFByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gZ3JvdXAuY2hpbGRyZW5bY2hpbGRQcm9wXTtcclxuICAgICAgICAgICAgICAgICAgICBncm91cC5jaGlsZHJlbkxpc3QucHVzaChjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW5Db3VudCsrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvcnRHcm91cHMoYXhpcywgY2hpbGQsIGF4aXNDb25maWcsIGdhcHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwLmFsbFZhbHVlc0NvdW50ICs9IGNoaWxkLmFsbFZhbHVlc0NvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGdhcHNbZ3JvdXAubGV2ZWxdICs9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChnYXBzICYmIGNoaWxkcmVuQ291bnQgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICBnYXBzW2dyb3VwLmxldmVsXSAtPSAxO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBncm91cC5nYXBzSW5zaWRlID0gW107XHJcbiAgICAgICAgICAgIGdhcHMuZm9yRWFjaCgoZCwgaSk9PiB7XHJcbiAgICAgICAgICAgICAgICBncm91cC5nYXBzSW5zaWRlLnB1c2goZCAtIChncm91cC5nYXBzQmVmb3JlW2ldIHx8IDApKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGdyb3VwLmdhcHNJbnNpZGVTaXplID0gSGVhdG1hcC5jb21wdXRlR2Fwc1NpemUoZ3JvdXAuZ2Fwc0luc2lkZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoYXhpcy5nYXBzLmxlbmd0aCA8IGdhcHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBheGlzLmdhcHMgPSBnYXBzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBjb21wdXRlWUF4aXNMYWJlbHNXaWR0aChvZmZzZXQpIHtcclxuICAgICAgICB2YXIgbWF4V2lkdGggPSB0aGlzLnBsb3QubWFyZ2luLmxlZnQ7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnkudGl0bGUpIHtcclxuICAgICAgICAgICAgbWF4V2lkdGggLT0gMTU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvZmZzZXQgJiYgb2Zmc2V0LngpIHtcclxuICAgICAgICAgICAgbWF4V2lkdGggKz0gb2Zmc2V0Lng7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcueS5yb3RhdGVMYWJlbHMpIHtcclxuICAgICAgICAgICAgbWF4V2lkdGggKj0gVXRpbHMuU1FSVF8yO1xyXG4gICAgICAgICAgICB2YXIgZm9udFNpemUgPSAxMTsgLy90b2RvIGNoZWNrIGFjdHVhbCBmb250IHNpemVcclxuICAgICAgICAgICAgbWF4V2lkdGggLT1mb250U2l6ZS8yO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG1heFdpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXB1dGVYQXhpc0xhYmVsc1dpZHRoKG9mZnNldCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcueC5yb3RhdGVMYWJlbHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGxvdC5jZWxsV2lkdGggLSAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc2l6ZSA9IHRoaXMucGxvdC5tYXJnaW4uYm90dG9tO1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy54LnRpdGxlKSB7XHJcbiAgICAgICAgICAgIHNpemUgLT0gMTU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvZmZzZXQgJiYgb2Zmc2V0LnkpIHtcclxuICAgICAgICAgICAgc2l6ZSAtPSBvZmZzZXQueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNpemUgKj0gVXRpbHMuU1FSVF8yO1xyXG5cclxuICAgICAgICB2YXIgZm9udFNpemUgPSAxMTsgLy90b2RvIGNoZWNrIGFjdHVhbCBmb250IHNpemVcclxuICAgICAgICBzaXplIC09Zm9udFNpemUvMjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNvbXB1dGVHYXBTaXplKGdhcExldmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIEhlYXRtYXAubWF4R3JvdXBHYXBTaXplIC8gKGdhcExldmVsICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNvbXB1dGVHYXBzU2l6ZShnYXBzKSB7XHJcbiAgICAgICAgdmFyIGdhcHNTaXplID0gMDtcclxuICAgICAgICBnYXBzLmZvckVhY2goKGdhcHNOdW1iZXIsIGdhcHNMZXZlbCk9PiBnYXBzU2l6ZSArPSBnYXBzTnVtYmVyICogSGVhdG1hcC5jb21wdXRlR2FwU2l6ZShnYXBzTGV2ZWwpKTtcclxuICAgICAgICByZXR1cm4gZ2Fwc1NpemU7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcHV0ZVBsb3RTaXplKCkge1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSBwbG90Lm1hcmdpbjtcclxuICAgICAgICB2YXIgYXZhaWxhYmxlV2lkdGggPSBVdGlscy5hdmFpbGFibGVXaWR0aCh0aGlzLmNvbmZpZy53aWR0aCwgdGhpcy5nZXRCYXNlQ29udGFpbmVyKCksIHRoaXMucGxvdC5tYXJnaW4pO1xyXG4gICAgICAgIHZhciBhdmFpbGFibGVIZWlnaHQgPSBVdGlscy5hdmFpbGFibGVIZWlnaHQodGhpcy5jb25maWcuaGVpZ2h0LCB0aGlzLmdldEJhc2VDb250YWluZXIoKSwgdGhpcy5wbG90Lm1hcmdpbik7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gYXZhaWxhYmxlV2lkdGg7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IGF2YWlsYWJsZUhlaWdodDtcclxuXHJcbiAgICAgICAgdmFyIHhHYXBzU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcHNTaXplKHBsb3QueC5nYXBzKTtcclxuXHJcblxyXG4gICAgICAgIHZhciBjb21wdXRlZENlbGxXaWR0aCA9IE1hdGgubWF4KGNvbmYuY2VsbC5zaXplTWluLCBNYXRoLm1pbihjb25mLmNlbGwuc2l6ZU1heCwgKGF2YWlsYWJsZVdpZHRoIC0geEdhcHNTaXplKSAvIHRoaXMucGxvdC54LnRvdGFsVmFsdWVzQ291bnQpKTtcclxuICAgICAgICBpZiAodGhpcy5jb25maWcud2lkdGgpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jb25maWcuY2VsbC53aWR0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxXaWR0aCA9IGNvbXB1dGVkQ2VsbFdpZHRoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsV2lkdGggPSB0aGlzLmNvbmZpZy5jZWxsLndpZHRoO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLnBsb3QuY2VsbFdpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuY2VsbFdpZHRoID0gY29tcHV0ZWRDZWxsV2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdpZHRoID0gdGhpcy5wbG90LmNlbGxXaWR0aCAqIHRoaXMucGxvdC54LnRvdGFsVmFsdWVzQ291bnQgKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodCArIHhHYXBzU2l6ZTtcclxuXHJcbiAgICAgICAgdmFyIHlHYXBzU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcHNTaXplKHBsb3QueS5nYXBzKTtcclxuICAgICAgICB2YXIgY29tcHV0ZWRDZWxsSGVpZ2h0ID0gTWF0aC5tYXgoY29uZi5jZWxsLnNpemVNaW4sIE1hdGgubWluKGNvbmYuY2VsbC5zaXplTWF4LCAoYXZhaWxhYmxlSGVpZ2h0IC0geUdhcHNTaXplKSAvIHRoaXMucGxvdC55LnRvdGFsVmFsdWVzQ291bnQpKTtcclxuICAgICAgICBpZiAodGhpcy5jb25maWcuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jb25maWcuY2VsbC5oZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsSGVpZ2h0ID0gY29tcHV0ZWRDZWxsSGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxIZWlnaHQgPSB0aGlzLmNvbmZpZy5jZWxsLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wbG90LmNlbGxIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsSGVpZ2h0ID0gY29tcHV0ZWRDZWxsSGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaGVpZ2h0ID0gdGhpcy5wbG90LmNlbGxIZWlnaHQgKiB0aGlzLnBsb3QueS50b3RhbFZhbHVlc0NvdW50ICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b20gKyB5R2Fwc1NpemU7XHJcblxyXG5cclxuICAgICAgICB0aGlzLnBsb3Qud2lkdGggPSB3aWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0O1xyXG4gICAgICAgIHRoaXMucGxvdC5oZWlnaHQgPSBoZWlnaHQgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgc2V0dXBaU2NhbGUoKSB7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgY29uZmlnID0gc2VsZi5jb25maWc7XHJcbiAgICAgICAgdmFyIHogPSBzZWxmLnBsb3QuejtcclxuICAgICAgICB2YXIgcmFuZ2UgPSBjb25maWcuY29sb3IucmFuZ2U7XHJcbiAgICAgICAgdmFyIGV4dGVudCA9IHoubWF4IC0gei5taW47XHJcbiAgICAgICAgdmFyIHNjYWxlO1xyXG4gICAgICAgIHouZG9tYWluID0gW107XHJcbiAgICAgICAgaWYgKGNvbmZpZy5jb2xvci5zY2FsZSA9PSBcInBvd1wiKSB7XHJcbiAgICAgICAgICAgIHZhciBleHBvbmVudCA9IDEwO1xyXG4gICAgICAgICAgICByYW5nZS5mb3JFYWNoKChjLCBpKT0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB2ID0gei5tYXggLSAoZXh0ZW50IC8gTWF0aC5wb3coMTAsIGkpKTtcclxuICAgICAgICAgICAgICAgIHouZG9tYWluLnB1c2godilcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHNjYWxlID0gZDMuc2NhbGUucG93KCkuZXhwb25lbnQoZXhwb25lbnQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29uZmlnLmNvbG9yLnNjYWxlID09IFwibG9nXCIpIHtcclxuXHJcbiAgICAgICAgICAgIHJhbmdlLmZvckVhY2goKGMsIGkpPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHYgPSB6Lm1pbiArIChleHRlbnQgLyBNYXRoLnBvdygxMCwgaSkpO1xyXG4gICAgICAgICAgICAgICAgei5kb21haW4udW5zaGlmdCh2KVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzY2FsZSA9IGQzLnNjYWxlLmxvZygpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmFuZ2UuZm9yRWFjaCgoYywgaSk9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdiA9IHoubWluICsgKGV4dGVudCAqIChpIC8gKHJhbmdlLmxlbmd0aCAtIDEpKSk7XHJcbiAgICAgICAgICAgICAgICB6LmRvbWFpbi5wdXNoKHYpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzY2FsZSA9IGQzLnNjYWxlW2NvbmZpZy5jb2xvci5zY2FsZV0oKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB6LmRvbWFpblswXSA9IHoubWluOyAvL3JlbW92aW5nIHVubmVjZXNzYXJ5IGZsb2F0aW5nIHBvaW50c1xyXG4gICAgICAgIHouZG9tYWluW3ouZG9tYWluLmxlbmd0aCAtIDFdID0gei5tYXg7IC8vcmVtb3ZpbmcgdW5uZWNlc3NhcnkgZmxvYXRpbmcgcG9pbnRzXHJcbiAgICAgICAgY29uc29sZS5sb2coei5kb21haW4pO1xyXG5cclxuICAgICAgICBpZiAoY29uZmlnLmNvbG9yLnJldmVyc2VTY2FsZSkge1xyXG4gICAgICAgICAgICB6LmRvbWFpbi5yZXZlcnNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2cocmFuZ2UpO1xyXG4gICAgICAgIHBsb3Quei5jb2xvci5zY2FsZSA9IHNjYWxlLmRvbWFpbih6LmRvbWFpbikucmFuZ2UocmFuZ2UpO1xyXG4gICAgICAgIHZhciBzaGFwZSA9IHBsb3Quei5zaGFwZSA9IHt9O1xyXG5cclxuICAgICAgICB2YXIgY2VsbENvbmYgPSB0aGlzLmNvbmZpZy5jZWxsO1xyXG4gICAgICAgIHNoYXBlLnR5cGUgPSBcInJlY3RcIjtcclxuXHJcbiAgICAgICAgcGxvdC56LnNoYXBlLndpZHRoID0gcGxvdC5jZWxsV2lkdGggLSBjZWxsQ29uZi5wYWRkaW5nICogMjtcclxuICAgICAgICBwbG90Lnouc2hhcGUuaGVpZ2h0ID0gcGxvdC5jZWxsSGVpZ2h0IC0gY2VsbENvbmYucGFkZGluZyAqIDI7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHVwZGF0ZShuZXdEYXRhKSB7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKG5ld0RhdGEpO1xyXG4gICAgICAgIGlmICh0aGlzLnBsb3QuZ3JvdXBCeVkpIHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3R3JvdXBzWSh0aGlzLnBsb3QueS5ncm91cHMsIHRoaXMuc3ZnRyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnBsb3QuZ3JvdXBCeVgpIHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3R3JvdXBzWCh0aGlzLnBsb3QueC5ncm91cHMsIHRoaXMuc3ZnRyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUNlbGxzKCk7XHJcblxyXG4gICAgICAgIC8vIHRoaXMudXBkYXRlVmFyaWFibGVMYWJlbHMoKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVBeGlzWCgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQXhpc1koKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnNob3dMZWdlbmQpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVMZWdlbmQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlQXhpc1RpdGxlcygpO1xyXG4gICAgfTtcclxuXHJcbiAgICB1cGRhdGVBeGlzVGl0bGVzKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICB1cGRhdGVBeGlzWCgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGxhYmVsQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwibGFiZWxcIik7XHJcbiAgICAgICAgdmFyIGxhYmVsWENsYXNzID0gbGFiZWxDbGFzcyArIFwiLXhcIjtcclxuICAgICAgICB2YXIgbGFiZWxZQ2xhc3MgPSBsYWJlbENsYXNzICsgXCIteVwiO1xyXG4gICAgICAgIHBsb3QubGFiZWxDbGFzcyA9IGxhYmVsQ2xhc3M7XHJcblxyXG4gICAgICAgIHZhciBvZmZzZXRYID0ge1xyXG4gICAgICAgICAgICB4OiAwLFxyXG4gICAgICAgICAgICB5OiAwXHJcbiAgICAgICAgfTtcclxuICAgICAgICBsZXQgZ2FwU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcFNpemUoMCk7XHJcbiAgICAgICAgaWYgKHBsb3QuZ3JvdXBCeVgpIHtcclxuICAgICAgICAgICAgbGV0IG92ZXJsYXAgPSBzZWxmLmNvbmZpZy54Lmdyb3Vwcy5vdmVybGFwO1xyXG5cclxuICAgICAgICAgICAgb2Zmc2V0WC54ID0gZ2FwU2l6ZSAvIDI7XHJcbiAgICAgICAgICAgIG9mZnNldFgueSA9IG92ZXJsYXAuYm90dG9tICsgZ2FwU2l6ZSAvIDIgKyA2O1xyXG4gICAgICAgIH0gZWxzZSBpZiAocGxvdC5ncm91cEJ5WSkge1xyXG4gICAgICAgICAgICBvZmZzZXRYLnkgPSBnYXBTaXplO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHZhciBsYWJlbHNYID0gc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyBsYWJlbFhDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGxvdC54LmFsbFZhbHVlc0xpc3QsIChkLCBpKT0+aSk7XHJcblxyXG4gICAgICAgIGxhYmVsc1guZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpLmF0dHIoXCJjbGFzc1wiLCAoZCwgaSkgPT4gbGFiZWxDbGFzcyArIFwiIFwiICsgbGFiZWxYQ2xhc3MgKyBcIiBcIiArIGxhYmVsWENsYXNzICsgXCItXCIgKyBpKTtcclxuXHJcbiAgICAgICAgbGFiZWxzWFxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgKGQsIGkpID0+IChpICogcGxvdC5jZWxsV2lkdGggKyBwbG90LmNlbGxXaWR0aCAvIDIpICsgKGQuZ3JvdXAuZ2Fwc1NpemUpICsgb2Zmc2V0WC54KVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgcGxvdC5oZWlnaHQgKyBvZmZzZXRYLnkpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgMTApXHJcblxyXG4gICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGQ9PnNlbGYuZm9ybWF0VmFsdWVYKGQudmFsKSk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgdmFyIG1heFdpZHRoID0gc2VsZi5jb21wdXRlWEF4aXNMYWJlbHNXaWR0aChvZmZzZXRYKTtcclxuXHJcbiAgICAgICAgbGFiZWxzWC5lYWNoKGZ1bmN0aW9uIChsYWJlbCkge1xyXG4gICAgICAgICAgICB2YXIgZWxlbSA9IGQzLnNlbGVjdCh0aGlzKSxcclxuICAgICAgICAgICAgICAgIHRleHQgPSBzZWxmLmZvcm1hdFZhbHVlWChsYWJlbC52YWwpO1xyXG4gICAgICAgICAgICBVdGlscy5wbGFjZVRleHRXaXRoRWxsaXBzaXNBbmRUb29sdGlwKGVsZW0sIHRleHQsIG1heFdpZHRoLCBzZWxmLmNvbmZpZy5zaG93VG9vbHRpcCA/IHNlbGYucGxvdC50b29sdGlwIDogZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoc2VsZi5jb25maWcueC5yb3RhdGVMYWJlbHMpIHtcclxuICAgICAgICAgICAgbGFiZWxzWC5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInJvdGF0ZSgtNDUsIFwiICsgKChpICogcGxvdC5jZWxsV2lkdGggKyBwbG90LmNlbGxXaWR0aCAvIDIpICsgZC5ncm91cC5nYXBzU2l6ZSArIG9mZnNldFgueCApICsgXCIsIFwiICsgKCBwbG90LmhlaWdodCArIG9mZnNldFgueSkgKyBcIilcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZHhcIiwgLTIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImR5XCIsIDgpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGxhYmVsc1guZXhpdCgpLnJlbW92ZSgpO1xyXG5cclxuXHJcbiAgICAgICAgc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIiArIHNlbGYucHJlZml4Q2xhc3MoJ2F4aXMteCcpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChwbG90LndpZHRoIC8gMikgKyBcIixcIiArIChwbG90LmhlaWdodCArIHBsb3QubWFyZ2luLmJvdHRvbSkgKyBcIilcIilcclxuICAgICAgICAgICAgLnNlbGVjdE9yQXBwZW5kKFwidGV4dC5cIiArIHNlbGYucHJlZml4Q2xhc3MoJ2xhYmVsJykpXHJcblxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiLTAuNWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KHNlbGYuY29uZmlnLngudGl0bGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUF4aXNZKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgbGFiZWxDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJsYWJlbFwiKTtcclxuICAgICAgICB2YXIgbGFiZWxZQ2xhc3MgPSBsYWJlbENsYXNzICsgXCIteVwiO1xyXG4gICAgICAgIHBsb3QubGFiZWxDbGFzcyA9IGxhYmVsQ2xhc3M7XHJcblxyXG5cclxuICAgICAgICB2YXIgbGFiZWxzWSA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgbGFiZWxZQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBsb3QueS5hbGxWYWx1ZXNMaXN0KTtcclxuXHJcbiAgICAgICAgbGFiZWxzWS5lbnRlcigpLmFwcGVuZChcInRleHRcIik7XHJcblxyXG4gICAgICAgIHZhciBvZmZzZXRZID0ge1xyXG4gICAgICAgICAgICB4OiAwLFxyXG4gICAgICAgICAgICB5OiAwXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAocGxvdC5ncm91cEJ5WSkge1xyXG4gICAgICAgICAgICBsZXQgb3ZlcmxhcCA9IHNlbGYuY29uZmlnLnkuZ3JvdXBzLm92ZXJsYXA7XHJcbiAgICAgICAgICAgIGxldCBnYXBTaXplID0gSGVhdG1hcC5jb21wdXRlR2FwU2l6ZSgwKTtcclxuICAgICAgICAgICAgb2Zmc2V0WS54ID0gLW92ZXJsYXAubGVmdDtcclxuXHJcbiAgICAgICAgICAgIG9mZnNldFkueSA9IGdhcFNpemUgLyAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsYWJlbHNZXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCBvZmZzZXRZLngpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAoZCwgaSkgPT4gKGkgKiBwbG90LmNlbGxIZWlnaHQgKyBwbG90LmNlbGxIZWlnaHQgLyAyKSArIGQuZ3JvdXAuZ2Fwc1NpemUgKyBvZmZzZXRZLnkpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHhcIiwgLTIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCAoZCwgaSkgPT4gbGFiZWxDbGFzcyArIFwiIFwiICsgbGFiZWxZQ2xhc3MgKyBcIiBcIiArIGxhYmVsWUNsYXNzICsgXCItXCIgKyBpKVxyXG5cclxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBmb3JtYXR0ZWQgPSBzZWxmLmZvcm1hdFZhbHVlWShkLnZhbCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0dGVkXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgbWF4V2lkdGggPSBzZWxmLmNvbXB1dGVZQXhpc0xhYmVsc1dpZHRoKG9mZnNldFkpO1xyXG5cclxuICAgICAgICBsYWJlbHNZLmVhY2goZnVuY3Rpb24gKGxhYmVsKSB7XHJcbiAgICAgICAgICAgIHZhciBlbGVtID0gZDMuc2VsZWN0KHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgdGV4dCA9IHNlbGYuZm9ybWF0VmFsdWVZKGxhYmVsLnZhbCk7XHJcbiAgICAgICAgICAgIFV0aWxzLnBsYWNlVGV4dFdpdGhFbGxpcHNpc0FuZFRvb2x0aXAoZWxlbSwgdGV4dCwgbWF4V2lkdGgsIHNlbGYuY29uZmlnLnNob3dUb29sdGlwID8gc2VsZi5wbG90LnRvb2x0aXAgOiBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy55LnJvdGF0ZUxhYmVscykge1xyXG4gICAgICAgICAgICBsYWJlbHNZXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCAoZCwgaSkgPT4gXCJyb3RhdGUoLTQ1LCBcIiArIChvZmZzZXRZLnggICkgKyBcIiwgXCIgKyAoZC5ncm91cC5nYXBzU2l6ZSArIChpICogcGxvdC5jZWxsSGVpZ2h0ICsgcGxvdC5jZWxsSGVpZ2h0IC8gMikgKyBvZmZzZXRZLnkpICsgXCIpXCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpO1xyXG4gICAgICAgICAgICAvLyAuYXR0cihcImR4XCIsIC03KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsYWJlbHNZLmF0dHIoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGxhYmVsc1kuZXhpdCgpLnJlbW92ZSgpO1xyXG5cclxuXHJcbiAgICAgICAgc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIiArIHNlbGYucHJlZml4Q2xhc3MoJ2F4aXMteScpKVxyXG4gICAgICAgICAgICAuc2VsZWN0T3JBcHBlbmQoXCJ0ZXh0LlwiICsgc2VsZi5wcmVmaXhDbGFzcygnbGFiZWwnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAtcGxvdC5tYXJnaW4ubGVmdCArIFwiLFwiICsgKHBsb3QuaGVpZ2h0IC8gMikgKyBcIilyb3RhdGUoLTkwKVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KHNlbGYuY29uZmlnLnkudGl0bGUpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgZHJhd0dyb3Vwc1kocGFyZW50R3JvdXAsIGNvbnRhaW5lciwgYXZhaWxhYmxlV2lkdGgpIHtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG5cclxuICAgICAgICB2YXIgZ3JvdXBDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJncm91cFwiKTtcclxuICAgICAgICB2YXIgZ3JvdXBZQ2xhc3MgPSBncm91cENsYXNzICsgXCIteVwiO1xyXG4gICAgICAgIHZhciBncm91cHMgPSBjb250YWluZXIuc2VsZWN0QWxsKFwiZy5cIiArIGdyb3VwQ2xhc3MgKyBcIi5cIiArIGdyb3VwWUNsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShwYXJlbnRHcm91cC5jaGlsZHJlbkxpc3QpO1xyXG5cclxuICAgICAgICB2YXIgdmFsdWVzQmVmb3JlQ291bnQgPSAwO1xyXG4gICAgICAgIHZhciBnYXBzQmVmb3JlU2l6ZSA9IDA7XHJcblxyXG4gICAgICAgIHZhciBncm91cHNFbnRlckcgPSBncm91cHMuZW50ZXIoKS5hcHBlbmQoXCJnXCIpO1xyXG4gICAgICAgIGdyb3Vwc0VudGVyR1xyXG4gICAgICAgICAgICAuY2xhc3NlZChncm91cENsYXNzLCB0cnVlKVxyXG4gICAgICAgICAgICAuY2xhc3NlZChncm91cFlDbGFzcywgdHJ1ZSlcclxuICAgICAgICAgICAgLmFwcGVuZChcInJlY3RcIikuY2xhc3NlZChcImdyb3VwLXJlY3RcIiwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIHZhciB0aXRsZUdyb3VwRW50ZXIgPSBncm91cHNFbnRlckcuYXBwZW5kU2VsZWN0b3IoXCJnLnRpdGxlXCIpO1xyXG4gICAgICAgIHRpdGxlR3JvdXBFbnRlci5hcHBlbmQoXCJyZWN0XCIpO1xyXG4gICAgICAgIHRpdGxlR3JvdXBFbnRlci5hcHBlbmQoXCJ0ZXh0XCIpO1xyXG5cclxuICAgICAgICB2YXIgZ2FwU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcFNpemUocGFyZW50R3JvdXAubGV2ZWwpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gZ2FwU2l6ZSAvIDQ7XHJcblxyXG4gICAgICAgIHZhciB0aXRsZVJlY3RXaWR0aCA9IEhlYXRtYXAuZ3JvdXBUaXRsZVJlY3RIZWlnaHQ7XHJcbiAgICAgICAgdmFyIGRlcHRoID0gc2VsZi5jb25maWcueS5ncm91cHMua2V5cy5sZW5ndGggLSBwYXJlbnRHcm91cC5sZXZlbDtcclxuICAgICAgICB2YXIgb3ZlcmxhcCA9IHtcclxuICAgICAgICAgICAgbGVmdDogMCxcclxuICAgICAgICAgICAgcmlnaHQ6IDBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoIWF2YWlsYWJsZVdpZHRoKSB7XHJcbiAgICAgICAgICAgIG92ZXJsYXAucmlnaHQgPSBwbG90Lnkub3ZlcmxhcC5sZWZ0O1xyXG4gICAgICAgICAgICBvdmVybGFwLmxlZnQgPSBwbG90Lnkub3ZlcmxhcC5sZWZ0O1xyXG4gICAgICAgICAgICBhdmFpbGFibGVXaWR0aCA9IHBsb3Qud2lkdGggKyBnYXBTaXplICsgb3ZlcmxhcC5sZWZ0ICsgb3ZlcmxhcC5yaWdodDtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBncm91cHNcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB0cmFuc2xhdGUgPSBcInRyYW5zbGF0ZShcIiArIChwYWRkaW5nIC0gb3ZlcmxhcC5sZWZ0KSArIFwiLFwiICsgKChwbG90LmNlbGxIZWlnaHQgKiB2YWx1ZXNCZWZvcmVDb3VudCkgKyBpICogZ2FwU2l6ZSArIGdhcHNCZWZvcmVTaXplICsgcGFkZGluZykgKyBcIilcIjtcclxuICAgICAgICAgICAgICAgIGdhcHNCZWZvcmVTaXplICs9IChkLmdhcHNJbnNpZGVTaXplIHx8IDApO1xyXG4gICAgICAgICAgICAgICAgdmFsdWVzQmVmb3JlQ291bnQgKz0gZC5hbGxWYWx1ZXNDb3VudCB8fCAwO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYW5zbGF0ZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHZhciBncm91cFdpZHRoID0gYXZhaWxhYmxlV2lkdGggLSBwYWRkaW5nICogMjtcclxuXHJcbiAgICAgICAgdmFyIHRpdGxlR3JvdXBzID0gZ3JvdXBzLnNlbGVjdEFsbChcImcudGl0bGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwidHJhbnNsYXRlKFwiICsgKGdyb3VwV2lkdGggLSB0aXRsZVJlY3RXaWR0aCkgKyBcIiwgMClcIik7XHJcblxyXG4gICAgICAgIHZhciB0aWxlUmVjdHMgPSB0aXRsZUdyb3Vwcy5zZWxlY3RBbGwoXCJyZWN0XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgdGl0bGVSZWN0V2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGQ9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCkgKyBwbG90LmNlbGxIZWlnaHQgKiBkLmFsbFZhbHVlc0NvdW50ICsgcGFkZGluZyAqIDJcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAwKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcImZpbGxcIiwgXCJsaWdodGdyZXlcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0R3JvdXBNb3VzZUNhbGxiYWNrcyhwYXJlbnRHcm91cCwgdGlsZVJlY3RzKTtcclxuXHJcblxyXG4gICAgICAgIGdyb3Vwcy5zZWxlY3RBbGwoXCJyZWN0Lmdyb3VwLXJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBkPT4gXCJncm91cC1yZWN0IGdyb3VwLXJlY3QtXCIgKyBkLmluZGV4KVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGdyb3VwV2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGQ9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCkgKyBwbG90LmNlbGxIZWlnaHQgKiBkLmFsbFZhbHVlc0NvdW50ICsgcGFkZGluZyAqIDJcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgXCJ3aGl0ZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImZpbGwtb3BhY2l0eVwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCAwLjUpXHJcbiAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlXCIsIFwiYmxhY2tcIilcclxuXHJcblxyXG4gICAgICAgIGdyb3Vwcy5lYWNoKGZ1bmN0aW9uIChncm91cCkge1xyXG5cclxuICAgICAgICAgICAgc2VsZi5kcmF3R3JvdXBzWS5jYWxsKHNlbGYsIGdyb3VwLCBkMy5zZWxlY3QodGhpcyksIGdyb3VwV2lkdGggLSB0aXRsZVJlY3RXaWR0aCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGRyYXdHcm91cHNYKHBhcmVudEdyb3VwLCBjb250YWluZXIsIGF2YWlsYWJsZUhlaWdodCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcblxyXG4gICAgICAgIHZhciBncm91cENsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImdyb3VwXCIpO1xyXG4gICAgICAgIHZhciBncm91cFhDbGFzcyA9IGdyb3VwQ2xhc3MgKyBcIi14XCI7XHJcbiAgICAgICAgdmFyIGdyb3VwcyA9IGNvbnRhaW5lci5zZWxlY3RBbGwoXCJnLlwiICsgZ3JvdXBDbGFzcyArIFwiLlwiICsgZ3JvdXBYQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBhcmVudEdyb3VwLmNoaWxkcmVuTGlzdCk7XHJcblxyXG4gICAgICAgIHZhciB2YWx1ZXNCZWZvcmVDb3VudCA9IDA7XHJcbiAgICAgICAgdmFyIGdhcHNCZWZvcmVTaXplID0gMDtcclxuXHJcbiAgICAgICAgdmFyIGdyb3Vwc0VudGVyRyA9IGdyb3Vwcy5lbnRlcigpLmFwcGVuZChcImdcIik7XHJcbiAgICAgICAgZ3JvdXBzRW50ZXJHXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKGdyb3VwQ2xhc3MsIHRydWUpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKGdyb3VwWENsYXNzLCB0cnVlKVxyXG4gICAgICAgICAgICAuYXBwZW5kKFwicmVjdFwiKS5jbGFzc2VkKFwiZ3JvdXAtcmVjdFwiLCB0cnVlKTtcclxuXHJcbiAgICAgICAgdmFyIHRpdGxlR3JvdXBFbnRlciA9IGdyb3Vwc0VudGVyRy5hcHBlbmRTZWxlY3RvcihcImcudGl0bGVcIik7XHJcbiAgICAgICAgdGl0bGVHcm91cEVudGVyLmFwcGVuZChcInJlY3RcIik7XHJcbiAgICAgICAgdGl0bGVHcm91cEVudGVyLmFwcGVuZChcInRleHRcIik7XHJcblxyXG4gICAgICAgIHZhciBnYXBTaXplID0gSGVhdG1hcC5jb21wdXRlR2FwU2l6ZShwYXJlbnRHcm91cC5sZXZlbCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBnYXBTaXplIC8gNDtcclxuICAgICAgICB2YXIgdGl0bGVSZWN0SGVpZ2h0ID0gSGVhdG1hcC5ncm91cFRpdGxlUmVjdEhlaWdodDtcclxuXHJcbiAgICAgICAgdmFyIGRlcHRoID0gc2VsZi5jb25maWcueC5ncm91cHMua2V5cy5sZW5ndGggLSBwYXJlbnRHcm91cC5sZXZlbDtcclxuXHJcbiAgICAgICAgdmFyIG92ZXJsYXAgPSB7XHJcbiAgICAgICAgICAgIHRvcDogMCxcclxuICAgICAgICAgICAgYm90dG9tOiAwXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKCFhdmFpbGFibGVIZWlnaHQpIHtcclxuICAgICAgICAgICAgb3ZlcmxhcC5ib3R0b20gPSBwbG90Lngub3ZlcmxhcC5ib3R0b207XHJcbiAgICAgICAgICAgIG92ZXJsYXAudG9wID0gcGxvdC54Lm92ZXJsYXAudG9wO1xyXG4gICAgICAgICAgICBhdmFpbGFibGVIZWlnaHQgPSBwbG90LmhlaWdodCArIGdhcFNpemUgKyBvdmVybGFwLnRvcCArIG92ZXJsYXAuYm90dG9tO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvdmVybGFwLnRvcCA9IC10aXRsZVJlY3RIZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdwYXJlbnRHcm91cCcscGFyZW50R3JvdXAsICdnYXBTaXplJywgZ2FwU2l6ZSwgcGxvdC54Lm92ZXJsYXApO1xyXG5cclxuICAgICAgICBncm91cHNcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB0cmFuc2xhdGUgPSBcInRyYW5zbGF0ZShcIiArICgocGxvdC5jZWxsV2lkdGggKiB2YWx1ZXNCZWZvcmVDb3VudCkgKyBpICogZ2FwU2l6ZSArIGdhcHNCZWZvcmVTaXplICsgcGFkZGluZykgKyBcIiwgXCIgKyAocGFkZGluZyAtIG92ZXJsYXAudG9wKSArIFwiKVwiO1xyXG4gICAgICAgICAgICAgICAgZ2Fwc0JlZm9yZVNpemUgKz0gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCk7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZXNCZWZvcmVDb3VudCArPSBkLmFsbFZhbHVlc0NvdW50IHx8IDA7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhbnNsYXRlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgZ3JvdXBIZWlnaHQgPSBhdmFpbGFibGVIZWlnaHQgLSBwYWRkaW5nICogMjtcclxuXHJcbiAgICAgICAgdmFyIHRpdGxlR3JvdXBzID0gZ3JvdXBzLnNlbGVjdEFsbChcImcudGl0bGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwidHJhbnNsYXRlKDAsIFwiICsgKDApICsgXCIpXCIpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIHRpbGVSZWN0cyA9IHRpdGxlR3JvdXBzLnNlbGVjdEFsbChcInJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgdGl0bGVSZWN0SGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGQ9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCkgKyBwbG90LmNlbGxXaWR0aCAqIGQuYWxsVmFsdWVzQ291bnQgKyBwYWRkaW5nICogMlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIDApXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiZmlsbFwiLCBcImxpZ2h0Z3JleVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRHcm91cE1vdXNlQ2FsbGJhY2tzKHBhcmVudEdyb3VwLCB0aWxlUmVjdHMpO1xyXG5cclxuXHJcbiAgICAgICAgZ3JvdXBzLnNlbGVjdEFsbChcInJlY3QuZ3JvdXAtcmVjdFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGQ9PiBcImdyb3VwLXJlY3QgZ3JvdXAtcmVjdC1cIiArIGQuaW5kZXgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGdyb3VwSGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGQ9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCkgKyBwbG90LmNlbGxXaWR0aCAqIGQuYWxsVmFsdWVzQ291bnQgKyBwYWRkaW5nICogMlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCBcIndoaXRlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZmlsbC1vcGFjaXR5XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDAuNSlcclxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2VcIiwgXCJibGFja1wiKTtcclxuXHJcbiAgICAgICAgZ3JvdXBzLmVhY2goZnVuY3Rpb24gKGdyb3VwKSB7XHJcbiAgICAgICAgICAgIHNlbGYuZHJhd0dyb3Vwc1guY2FsbChzZWxmLCBncm91cCwgZDMuc2VsZWN0KHRoaXMpLCBncm91cEhlaWdodCAtIHRpdGxlUmVjdEhlaWdodCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGdyb3Vwcy5leGl0KCkucmVtb3ZlKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNldEdyb3VwTW91c2VDYWxsYmFja3MocGFyZW50R3JvdXAsIHRpbGVSZWN0cykge1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgbW91c2VvdmVyQ2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoJ2hpZ2hsaWdodGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzLnBhcmVudE5vZGUucGFyZW50Tm9kZSkuc2VsZWN0QWxsKFwicmVjdC5ncm91cC1yZWN0LVwiICsgZC5pbmRleCkuY2xhc3NlZCgnaGlnaGxpZ2h0ZWQnLCB0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIG1vdXNlb3V0Q2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgbW91c2VvdXRDYWxsYmFja3MucHVzaChmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICBkMy5zZWxlY3QodGhpcykuY2xhc3NlZCgnaGlnaGxpZ2h0ZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzLnBhcmVudE5vZGUucGFyZW50Tm9kZSkuc2VsZWN0QWxsKFwicmVjdC5ncm91cC1yZWN0LVwiICsgZC5pbmRleCkuY2xhc3NlZCgnaGlnaGxpZ2h0ZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHBsb3QudG9vbHRpcCkge1xyXG5cclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goZD0+IHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGh0bWwgPSBwYXJlbnRHcm91cC5sYWJlbCArIFwiOiBcIiArIGQuZ3JvdXBpbmdWYWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAuaHRtbChodG1sKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkMy5ldmVudC5wYWdlWSAtIDI4KSArIFwicHhcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MucHVzaChkPT4ge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgdGlsZVJlY3RzLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKHNlbGYsIGQpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRpbGVSZWN0cy5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoc2VsZiwgZClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlQ2VsbHMoKSB7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgY2VsbENvbnRhaW5lckNsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImNlbGxzXCIpO1xyXG4gICAgICAgIHZhciBnYXBTaXplID0gSGVhdG1hcC5jb21wdXRlR2FwU2l6ZSgwKTtcclxuICAgICAgICB2YXIgcGFkZGluZ1ggPSBwbG90LnguZ3JvdXBzLmNoaWxkcmVuTGlzdC5sZW5ndGggPyBnYXBTaXplIC8gMiA6IDA7XHJcbiAgICAgICAgdmFyIHBhZGRpbmdZID0gcGxvdC55Lmdyb3Vwcy5jaGlsZHJlbkxpc3QubGVuZ3RoID8gZ2FwU2l6ZSAvIDIgOiAwO1xyXG4gICAgICAgIHZhciBjZWxsQ29udGFpbmVyID0gc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIiArIGNlbGxDb250YWluZXJDbGFzcyk7XHJcbiAgICAgICAgY2VsbENvbnRhaW5lci5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgcGFkZGluZ1ggKyBcIiwgXCIgKyBwYWRkaW5nWSArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJjZWxsXCIpO1xyXG4gICAgICAgIHZhciBjZWxsU2hhcGUgPSBwbG90Lnouc2hhcGUudHlwZTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxzID0gY2VsbENvbnRhaW5lci5zZWxlY3RBbGwoXCJnLlwiICsgY2VsbENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShzZWxmLnBsb3QuY2VsbHMpO1xyXG5cclxuICAgICAgICB2YXIgY2VsbEVudGVyRyA9IGNlbGxzLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuY2xhc3NlZChjZWxsQ2xhc3MsIHRydWUpO1xyXG4gICAgICAgIGNlbGxzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYz0+IFwidHJhbnNsYXRlKFwiICsgKChwbG90LmNlbGxXaWR0aCAqIGMuY29sICsgcGxvdC5jZWxsV2lkdGggLyAyKSArIGMuY29sVmFyLmdyb3VwLmdhcHNTaXplKSArIFwiLFwiICsgKChwbG90LmNlbGxIZWlnaHQgKiBjLnJvdyArIHBsb3QuY2VsbEhlaWdodCAvIDIpICsgYy5yb3dWYXIuZ3JvdXAuZ2Fwc1NpemUpICsgXCIpXCIpO1xyXG5cclxuICAgICAgICB2YXIgc2hhcGVzID0gY2VsbHMuc2VsZWN0T3JBcHBlbmQoY2VsbFNoYXBlICsgXCIuY2VsbC1zaGFwZS1cIiArIGNlbGxTaGFwZSk7XHJcblxyXG4gICAgICAgIHNoYXBlc1xyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHBsb3Quei5zaGFwZS53aWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgcGxvdC56LnNoYXBlLmhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIC1wbG90LmNlbGxXaWR0aCAvIDIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAtcGxvdC5jZWxsSGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICAgIHNoYXBlcy5zdHlsZShcImZpbGxcIiwgYz0+IGMudmFsdWUgPT09IHVuZGVmaW5lZCA/IHNlbGYuY29uZmlnLmNvbG9yLm5vRGF0YUNvbG9yIDogcGxvdC56LmNvbG9yLnNjYWxlKGMudmFsdWUpKTtcclxuICAgICAgICBzaGFwZXMuYXR0cihcImZpbGwtb3BhY2l0eVwiLCBkPT4gZC52YWx1ZSA9PT0gdW5kZWZpbmVkID8gMCA6IDEpO1xyXG5cclxuICAgICAgICB2YXIgbW91c2VvdmVyQ2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgdmFyIG1vdXNlb3V0Q2FsbGJhY2tzID0gW107XHJcblxyXG4gICAgICAgIGlmIChwbG90LnRvb2x0aXApIHtcclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3ZlckNhbGxiYWNrcy5wdXNoKGM9PiB7XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDIwMClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIC45KTtcclxuICAgICAgICAgICAgICAgIHZhciBodG1sID0gYy52YWx1ZSA9PT0gdW5kZWZpbmVkID8gc2VsZi5jb25maWcudG9vbHRpcC5ub0RhdGFUZXh0IDogc2VsZi5mb3JtYXRWYWx1ZVooYy52YWx1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLmh0bWwoaHRtbClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLnB1c2goYz0+IHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2VsZi5jb25maWcuaGlnaGxpZ2h0TGFiZWxzKSB7XHJcbiAgICAgICAgICAgIHZhciBoaWdobGlnaHRDbGFzcyA9IHNlbGYuY29uZmlnLmNzc0NsYXNzUHJlZml4ICsgXCJoaWdobGlnaHRcIjtcclxuICAgICAgICAgICAgdmFyIHhMYWJlbENsYXNzID0gYz0+cGxvdC5sYWJlbENsYXNzICsgXCIteC1cIiArIGMuY29sO1xyXG4gICAgICAgICAgICB2YXIgeUxhYmVsQ2xhc3MgPSBjPT5wbG90LmxhYmVsQ2xhc3MgKyBcIi15LVwiICsgYy5yb3c7XHJcblxyXG5cclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goYz0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHhMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgeUxhYmVsQ2xhc3MoYykpLmNsYXNzZWQoaGlnaGxpZ2h0Q2xhc3MsIHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MucHVzaChjPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB4TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB5TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBjZWxscy5vbihcIm1vdXNlb3ZlclwiLCBjID0+IHtcclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2s9PmNhbGxiYWNrKGMpKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCBjID0+IHtcclxuICAgICAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2s9PmNhbGxiYWNrKGMpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNlbGxzLm9uKFwiY2xpY2tcIiwgYz0+IHtcclxuICAgICAgICAgICAgc2VsZi50cmlnZ2VyKFwiY2VsbC1zZWxlY3RlZFwiLCBjKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIGNlbGxzLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3JtYXRWYWx1ZVgodmFsdWUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLnguZm9ybWF0dGVyKSByZXR1cm4gdmFsdWU7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy54LmZvcm1hdHRlci5jYWxsKHRoaXMuY29uZmlnLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9ybWF0VmFsdWVZKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy55LmZvcm1hdHRlcikgcmV0dXJuIHZhbHVlO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcueS5mb3JtYXR0ZXIuY2FsbCh0aGlzLmNvbmZpZywgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcm1hdFZhbHVlWih2YWx1ZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcuei5mb3JtYXR0ZXIpIHJldHVybiB2YWx1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnouZm9ybWF0dGVyLmNhbGwodGhpcy5jb25maWcsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3JtYXRMZWdlbmRWYWx1ZSh2YWx1ZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcubGVnZW5kLmZvcm1hdHRlcikgcmV0dXJuIHZhbHVlO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcubGVnZW5kLmZvcm1hdHRlci5jYWxsKHRoaXMuY29uZmlnLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTGVnZW5kKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgbGVnZW5kWCA9IHRoaXMucGxvdC53aWR0aCArIDEwO1xyXG4gICAgICAgIHZhciBnYXBTaXplID0gSGVhdG1hcC5jb21wdXRlR2FwU2l6ZSgwKTtcclxuICAgICAgICBpZiAodGhpcy5wbG90Lmdyb3VwQnlZKSB7XHJcbiAgICAgICAgICAgIGxlZ2VuZFggKz0gZ2FwU2l6ZSAvIDIgKyBwbG90Lnkub3ZlcmxhcC5yaWdodDtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucGxvdC5ncm91cEJ5WCkge1xyXG4gICAgICAgICAgICBsZWdlbmRYICs9IGdhcFNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsZWdlbmRZID0gMDtcclxuICAgICAgICBpZiAodGhpcy5wbG90Lmdyb3VwQnlYIHx8IHRoaXMucGxvdC5ncm91cEJ5WSkge1xyXG4gICAgICAgICAgICBsZWdlbmRZICs9IGdhcFNpemUgLyAyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGJhcldpZHRoID0gMTA7XHJcbiAgICAgICAgdmFyIGJhckhlaWdodCA9IHRoaXMucGxvdC5oZWlnaHQgLSAyO1xyXG4gICAgICAgIHZhciBzY2FsZSA9IHBsb3Quei5jb2xvci5zY2FsZTtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmQgPSBuZXcgTGVnZW5kKHRoaXMuc3ZnLCB0aGlzLnN2Z0csIHNjYWxlLCBsZWdlbmRYLCBsZWdlbmRZLCB2ID0+IHNlbGYuZm9ybWF0TGVnZW5kVmFsdWUodikpLnNldFJvdGF0ZUxhYmVscyhzZWxmLmNvbmZpZy5sZWdlbmQucm90YXRlTGFiZWxzKS5saW5lYXJHcmFkaWVudEJhcihiYXJXaWR0aCwgYmFySGVpZ2h0KTtcclxuICAgIH1cclxuXHJcblxyXG59XHJcbiIsImltcG9ydCB7RDNFeHRlbnNpb25zfSBmcm9tICcuL2QzLWV4dGVuc2lvbnMnXHJcbkQzRXh0ZW5zaW9ucy5leHRlbmQoKTtcclxuXHJcbmV4cG9ydCB7U2NhdHRlclBsb3QsIFNjYXR0ZXJQbG90Q29uZmlnfSBmcm9tIFwiLi9zY2F0dGVycGxvdFwiO1xyXG5leHBvcnQge1NjYXR0ZXJQbG90TWF0cml4LCBTY2F0dGVyUGxvdE1hdHJpeENvbmZpZ30gZnJvbSBcIi4vc2NhdHRlcnBsb3QtbWF0cml4XCI7XHJcbmV4cG9ydCB7Q29ycmVsYXRpb25NYXRyaXgsIENvcnJlbGF0aW9uTWF0cml4Q29uZmlnfSBmcm9tICcuL2NvcnJlbGF0aW9uLW1hdHJpeCdcclxuZXhwb3J0IHtSZWdyZXNzaW9uLCBSZWdyZXNzaW9uQ29uZmlnfSBmcm9tICcuL3JlZ3Jlc3Npb24nXHJcbmV4cG9ydCB7SGVhdG1hcCwgSGVhdG1hcENvbmZpZ30gZnJvbSAnLi9oZWF0bWFwJ1xyXG5leHBvcnQge0hlYXRtYXBUaW1lU2VyaWVzLCBIZWF0bWFwVGltZVNlcmllc0NvbmZpZ30gZnJvbSAnLi9oZWF0bWFwLXRpbWVzZXJpZXMnXHJcbmV4cG9ydCB7U3RhdGlzdGljc1V0aWxzfSBmcm9tICcuL3N0YXRpc3RpY3MtdXRpbHMnXHJcbmV4cG9ydCB7TGVnZW5kfSBmcm9tICcuL2xlZ2VuZCdcclxuXHJcblxyXG5cclxuXHJcblxyXG4iLCJpbXBvcnQge1V0aWxzfSBmcm9tIFwiLi91dGlsc1wiO1xyXG5pbXBvcnQge2NvbG9yLCBzaXplLCBzeW1ib2x9IGZyb20gXCIuLi9ib3dlcl9jb21wb25lbnRzL2QzLWxlZ2VuZC9uby1leHRlbmRcIjtcclxuXHJcbi8qdmFyIGQzID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9kMycpO1xyXG4qL1xyXG4vLyB2YXIgbGVnZW5kID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9kMy1sZWdlbmQvbm8tZXh0ZW5kJyk7XHJcbi8vXHJcbi8vIG1vZHVsZS5leHBvcnRzLmxlZ2VuZCA9IGxlZ2VuZDtcclxuXHJcbmV4cG9ydCBjbGFzcyBMZWdlbmQge1xyXG5cclxuICAgIGNzc0NsYXNzUHJlZml4PVwib2RjLVwiO1xyXG4gICAgbGVnZW5kQ2xhc3M9dGhpcy5jc3NDbGFzc1ByZWZpeCtcImxlZ2VuZFwiO1xyXG4gICAgY29udGFpbmVyO1xyXG4gICAgc2NhbGU7XHJcbiAgICBjb2xvcj0gY29sb3I7XHJcbiAgICBzaXplID0gc2l6ZTtcclxuICAgIHN5bWJvbD0gc3ltYm9sO1xyXG4gICAgZ3VpZDtcclxuXHJcbiAgICBsYWJlbEZvcm1hdCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzdmcsIGxlZ2VuZFBhcmVudCwgc2NhbGUsIGxlZ2VuZFgsIGxlZ2VuZFksIGxhYmVsRm9ybWF0KXtcclxuICAgICAgICB0aGlzLnNjYWxlPXNjYWxlO1xyXG4gICAgICAgIHRoaXMuc3ZnID0gc3ZnO1xyXG4gICAgICAgIHRoaXMuZ3VpZCA9IFV0aWxzLmd1aWQoKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9ICBVdGlscy5zZWxlY3RPckFwcGVuZChsZWdlbmRQYXJlbnQsIFwiZy5cIit0aGlzLmxlZ2VuZENsYXNzLCBcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrbGVnZW5kWCtcIixcIitsZWdlbmRZK1wiKVwiKVxyXG4gICAgICAgICAgICAuY2xhc3NlZCh0aGlzLmxlZ2VuZENsYXNzLCB0cnVlKTtcclxuXHJcbiAgICAgICAgdGhpcy5sYWJlbEZvcm1hdCA9IGxhYmVsRm9ybWF0O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgbGluZWFyR3JhZGllbnRCYXIoYmFyV2lkdGgsIGJhckhlaWdodCwgdGl0bGUpe1xyXG4gICAgICAgIHZhciBncmFkaWVudElkID0gdGhpcy5jc3NDbGFzc1ByZWZpeCtcImxpbmVhci1ncmFkaWVudFwiK1wiLVwiK3RoaXMuZ3VpZDtcclxuICAgICAgICB2YXIgc2NhbGU9IHRoaXMuc2NhbGU7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmxpbmVhckdyYWRpZW50ID0gVXRpbHMubGluZWFyR3JhZGllbnQodGhpcy5zdmcsIGdyYWRpZW50SWQsIHRoaXMuc2NhbGUucmFuZ2UoKSwgMCwgMTAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kKFwicmVjdFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGJhcldpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBiYXJIZWlnaHQpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgMClcclxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcInVybCgjXCIrZ3JhZGllbnRJZCtcIilcIik7XHJcblxyXG5cclxuICAgICAgICB2YXIgdGlja3MgPSB0aGlzLmNvbnRhaW5lci5zZWxlY3RBbGwoXCJ0ZXh0XCIpXHJcbiAgICAgICAgICAgIC5kYXRhKCBzY2FsZS5kb21haW4oKSApO1xyXG4gICAgICAgIHZhciB0aWNrc051bWJlciA9c2NhbGUuZG9tYWluKCkubGVuZ3RoLTE7XHJcbiAgICAgICAgdGlja3MuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpO1xyXG5cclxuICAgICAgICB0aWNrcy5hdHRyKFwieFwiLCBiYXJXaWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsICAoZCwgaSkgPT4gIGJhckhlaWdodCAtKGkqYmFySGVpZ2h0L3RpY2tzTnVtYmVyKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJkeFwiLCAzKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcImR5XCIsIDEpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiYWxpZ25tZW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGQ9PiBzZWxmLmxhYmVsRm9ybWF0ID8gc2VsZi5sYWJlbEZvcm1hdChkKSA6IGQpO1xyXG4gICAgICAgIHRpY2tzLmF0dHIoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgIGlmKHRoaXMucm90YXRlTGFiZWxzKXtcclxuICAgICAgICAgICAgdGlja3NcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInJvdGF0ZSgtNDUsIFwiICsgYmFyV2lkdGggKyBcIiwgXCIgKyAoYmFySGVpZ2h0IC0oaSpiYXJIZWlnaHQvdGlja3NOdW1iZXIpKSArIFwiKVwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcInN0YXJ0XCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImR4XCIsIDUpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImR5XCIsIDUpO1xyXG5cclxuICAgICAgICB9ZWxzZXtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aWNrcy5leGl0KCkucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFJvdGF0ZUxhYmVscyhyb3RhdGVMYWJlbHMpIHtcclxuICAgICAgICB0aGlzLnJvdGF0ZUxhYmVscyA9IHJvdGF0ZUxhYmVscztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufSIsImltcG9ydCB7Q2hhcnQsIENoYXJ0Q29uZmlnfSBmcm9tIFwiLi9jaGFydFwiO1xyXG5pbXBvcnQge1NjYXR0ZXJQbG90LCBTY2F0dGVyUGxvdENvbmZpZ30gZnJvbSBcIi4vc2NhdHRlcnBsb3RcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IHtTdGF0aXN0aWNzVXRpbHN9IGZyb20gJy4vc3RhdGlzdGljcy11dGlscydcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgUmVncmVzc2lvbkNvbmZpZyBleHRlbmRzIFNjYXR0ZXJQbG90Q29uZmlne1xyXG5cclxuICAgIG1haW5SZWdyZXNzaW9uID0gdHJ1ZTtcclxuICAgIGdyb3VwUmVncmVzc2lvbiA9IHRydWU7XHJcbiAgICBjb25maWRlbmNlPXtcclxuICAgICAgICBsZXZlbDogMC45NSxcclxuICAgICAgICBjcml0aWNhbFZhbHVlOiAoZGVncmVlc09mRnJlZWRvbSwgY3JpdGljYWxQcm9iYWJpbGl0eSkgPT4gU3RhdGlzdGljc1V0aWxzLnRWYWx1ZShkZWdyZWVzT2ZGcmVlZG9tLCBjcml0aWNhbFByb2JhYmlsaXR5KSxcclxuICAgICAgICBtYXJnaW5PZkVycm9yOiB1bmRlZmluZWQgLy9jdXN0b20gIG1hcmdpbiBPZiBFcnJvciBmdW5jdGlvbiAoeCwgcG9pbnRzKVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIGlmKGN1c3RvbSl7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUmVncmVzc2lvbiBleHRlbmRzIFNjYXR0ZXJQbG90e1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IFJlZ3Jlc3Npb25Db25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZyl7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgUmVncmVzc2lvbkNvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpe1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcbiAgICAgICAgdGhpcy5pbml0UmVncmVzc2lvbkxpbmVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFJlZ3Jlc3Npb25MaW5lcygpe1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGdyb3Vwc0F2YWlsYWJsZSA9IHNlbGYuY29uZmlnLmdyb3VwcyAmJiBzZWxmLmNvbmZpZy5ncm91cHMudmFsdWU7XHJcblxyXG4gICAgICAgIHNlbGYucGxvdC5yZWdyZXNzaW9ucz0gW107XHJcblxyXG5cclxuICAgICAgICBpZihncm91cHNBdmFpbGFibGUgJiYgc2VsZi5jb25maWcubWFpblJlZ3Jlc3Npb24pe1xyXG4gICAgICAgICAgICB2YXIgcmVncmVzc2lvbiA9IHRoaXMuaW5pdFJlZ3Jlc3Npb24odGhpcy5kYXRhLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIHNlbGYucGxvdC5yZWdyZXNzaW9ucy5wdXNoKHJlZ3Jlc3Npb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoc2VsZi5jb25maWcuZ3JvdXBSZWdyZXNzaW9uKXtcclxuICAgICAgICAgICAgdGhpcy5pbml0R3JvdXBSZWdyZXNzaW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBpbml0R3JvdXBSZWdyZXNzaW9uKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgZGF0YUJ5R3JvdXAgPSB7fTtcclxuICAgICAgICBzZWxmLmRhdGEuZm9yRWFjaCAoZD0+e1xyXG4gICAgICAgICAgICB2YXIgZ3JvdXBWYWwgPSBzZWxmLmNvbmZpZy5ncm91cHMudmFsdWUoZCwgc2VsZi5jb25maWcuZ3JvdXBzLmtleSk7XHJcblxyXG4gICAgICAgICAgICBpZighZ3JvdXBWYWwgJiYgZ3JvdXBWYWwhPT0wKXtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoIWRhdGFCeUdyb3VwW2dyb3VwVmFsXSl7XHJcbiAgICAgICAgICAgICAgICBkYXRhQnlHcm91cFtncm91cFZhbF0gPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkYXRhQnlHcm91cFtncm91cFZhbF0ucHVzaChkKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gZGF0YUJ5R3JvdXApe1xyXG4gICAgICAgICAgICBpZiAoIWRhdGFCeUdyb3VwLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVncmVzc2lvbiA9IHRoaXMuaW5pdFJlZ3Jlc3Npb24oZGF0YUJ5R3JvdXBba2V5XSwga2V5KTtcclxuICAgICAgICAgICAgc2VsZi5wbG90LnJlZ3Jlc3Npb25zLnB1c2gocmVncmVzc2lvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXRSZWdyZXNzaW9uKHZhbHVlcywgZ3JvdXBWYWwpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIHBvaW50cyA9IHZhbHVlcy5tYXAoZD0+e1xyXG4gICAgICAgICAgICByZXR1cm4gW3BhcnNlRmxvYXQoc2VsZi5wbG90LngudmFsdWUoZCkpLCBwYXJzZUZsb2F0KHNlbGYucGxvdC55LnZhbHVlKGQpKV07XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHBvaW50cy5zb3J0KChhLGIpID0+IGFbMF0tYlswXSk7XHJcblxyXG4gICAgICAgIHZhciBsaW5lYXJSZWdyZXNzaW9uID0gIFN0YXRpc3RpY3NVdGlscy5saW5lYXJSZWdyZXNzaW9uKHBvaW50cyk7XHJcbiAgICAgICAgdmFyIGxpbmVhclJlZ3Jlc3Npb25MaW5lID0gU3RhdGlzdGljc1V0aWxzLmxpbmVhclJlZ3Jlc3Npb25MaW5lKGxpbmVhclJlZ3Jlc3Npb24pO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGV4dGVudFggPSBkMy5leHRlbnQocG9pbnRzLCBkPT5kWzBdKTtcclxuXHJcblxyXG4gICAgICAgIHZhciBsaW5lUG9pbnRzID0gW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB4OiBleHRlbnRYWzBdLFxyXG4gICAgICAgICAgICAgICAgeTogbGluZWFyUmVncmVzc2lvbkxpbmUoZXh0ZW50WFswXSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeDogZXh0ZW50WFsxXSxcclxuICAgICAgICAgICAgICAgIHk6IGxpbmVhclJlZ3Jlc3Npb25MaW5lKGV4dGVudFhbMV0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICB2YXIgbGluZSA9IGQzLnN2Zy5saW5lKClcclxuICAgICAgICAgICAgLmludGVycG9sYXRlKFwiYmFzaXNcIilcclxuICAgICAgICAgICAgLngoZCA9PiBzZWxmLnBsb3QueC5zY2FsZShkLngpKVxyXG4gICAgICAgICAgICAueShkID0+IHNlbGYucGxvdC55LnNjYWxlKGQueSkpO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICB2YXIgY29sb3IgPSBzZWxmLnBsb3QuZG90LmNvbG9yO1xyXG5cclxuICAgICAgICB2YXIgZGVmYXVsdENvbG9yID0gXCJibGFja1wiO1xyXG4gICAgICAgIGlmKFV0aWxzLmlzRnVuY3Rpb24oY29sb3IpKXtcclxuICAgICAgICAgICAgaWYodmFsdWVzLmxlbmd0aCAmJiBncm91cFZhbCE9PWZhbHNlKXtcclxuICAgICAgICAgICAgICAgIGNvbG9yID0gY29sb3IodmFsdWVzWzBdKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBjb2xvciA9IGRlZmF1bHRDb2xvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1lbHNlIGlmKCFjb2xvciAmJiBncm91cFZhbD09PWZhbHNlKXtcclxuICAgICAgICAgICAgY29sb3IgPSBkZWZhdWx0Q29sb3I7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdmFyIGNvbmZpZGVuY2UgPSB0aGlzLmNvbXB1dGVDb25maWRlbmNlKHBvaW50cywgZXh0ZW50WCwgIGxpbmVhclJlZ3Jlc3Npb24sbGluZWFyUmVncmVzc2lvbkxpbmUpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGdyb3VwOiBncm91cFZhbCB8fCBmYWxzZSxcclxuICAgICAgICAgICAgbGluZTogbGluZSxcclxuICAgICAgICAgICAgbGluZVBvaW50czogbGluZVBvaW50cyxcclxuICAgICAgICAgICAgY29sb3I6IGNvbG9yLFxyXG4gICAgICAgICAgICBjb25maWRlbmNlOiBjb25maWRlbmNlXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wdXRlQ29uZmlkZW5jZShwb2ludHMsIGV4dGVudFgsIGxpbmVhclJlZ3Jlc3Npb24sbGluZWFyUmVncmVzc2lvbkxpbmUpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgc2xvcGUgPSBsaW5lYXJSZWdyZXNzaW9uLm07XHJcbiAgICAgICAgdmFyIG4gPSBwb2ludHMubGVuZ3RoO1xyXG4gICAgICAgIHZhciBkZWdyZWVzT2ZGcmVlZG9tID0gTWF0aC5tYXgoMCwgbi0yKTtcclxuXHJcbiAgICAgICAgdmFyIGFscGhhID0gMSAtIHNlbGYuY29uZmlnLmNvbmZpZGVuY2UubGV2ZWw7XHJcbiAgICAgICAgdmFyIGNyaXRpY2FsUHJvYmFiaWxpdHkgID0gMSAtIGFscGhhLzI7XHJcbiAgICAgICAgdmFyIGNyaXRpY2FsVmFsdWUgPSBzZWxmLmNvbmZpZy5jb25maWRlbmNlLmNyaXRpY2FsVmFsdWUoZGVncmVlc09mRnJlZWRvbSxjcml0aWNhbFByb2JhYmlsaXR5KTtcclxuXHJcbiAgICAgICAgdmFyIHhWYWx1ZXMgPSBwb2ludHMubWFwKGQ9PmRbMF0pO1xyXG4gICAgICAgIHZhciBtZWFuWCA9IFN0YXRpc3RpY3NVdGlscy5tZWFuKHhWYWx1ZXMpO1xyXG4gICAgICAgIHZhciB4TXlTdW09MDtcclxuICAgICAgICB2YXIgeFN1bT0wO1xyXG4gICAgICAgIHZhciB4UG93U3VtPTA7XHJcbiAgICAgICAgdmFyIHlTdW09MDtcclxuICAgICAgICB2YXIgeVBvd1N1bT0wO1xyXG4gICAgICAgIHBvaW50cy5mb3JFYWNoKHA9PntcclxuICAgICAgICAgICAgdmFyIHggPSBwWzBdO1xyXG4gICAgICAgICAgICB2YXIgeSA9IHBbMV07XHJcblxyXG4gICAgICAgICAgICB4TXlTdW0gKz0geCp5O1xyXG4gICAgICAgICAgICB4U3VtKz14O1xyXG4gICAgICAgICAgICB5U3VtKz15O1xyXG4gICAgICAgICAgICB4UG93U3VtKz0geCp4O1xyXG4gICAgICAgICAgICB5UG93U3VtKz0geSp5O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBhID0gbGluZWFyUmVncmVzc2lvbi5tO1xyXG4gICAgICAgIHZhciBiID0gbGluZWFyUmVncmVzc2lvbi5iO1xyXG5cclxuICAgICAgICB2YXIgU2EyID0gbi8obisyKSAqICgoeVBvd1N1bS1hKnhNeVN1bS1iKnlTdW0pLyhuKnhQb3dTdW0tKHhTdW0qeFN1bSkpKTsgLy9XYXJpYW5jamEgd3Nww7PFgmN6eW5uaWthIGtpZXJ1bmtvd2VnbyByZWdyZXNqaSBsaW5pb3dlaiBhXHJcbiAgICAgICAgdmFyIFN5MiA9ICh5UG93U3VtIC0gYSp4TXlTdW0tYip5U3VtKS8obioobi0yKSk7IC8vU2EyIC8vTWVhbiB5IHZhbHVlIHZhcmlhbmNlXHJcblxyXG4gICAgICAgIHZhciBlcnJvckZuID0geD0+IE1hdGguc3FydChTeTIgKyBNYXRoLnBvdyh4LW1lYW5YLDIpKlNhMik7IC8vcGllcndpYXN0ZWsga3dhZHJhdG93eSB6IHdhcmlhbmNqaSBkb3dvbG5lZ28gcHVua3R1IHByb3N0ZWpcclxuICAgICAgICB2YXIgbWFyZ2luT2ZFcnJvciA9ICB4PT4gY3JpdGljYWxWYWx1ZSogZXJyb3JGbih4KTtcclxuXHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCduJywgbiwgJ2RlZ3JlZXNPZkZyZWVkb20nLCBkZWdyZWVzT2ZGcmVlZG9tLCAnY3JpdGljYWxQcm9iYWJpbGl0eScsY3JpdGljYWxQcm9iYWJpbGl0eSk7XHJcbiAgICAgICAgLy8gdmFyIGNvbmZpZGVuY2VEb3duID0geCA9PiBsaW5lYXJSZWdyZXNzaW9uTGluZSh4KSAtICBtYXJnaW5PZkVycm9yKHgpO1xyXG4gICAgICAgIC8vIHZhciBjb25maWRlbmNlVXAgPSB4ID0+IGxpbmVhclJlZ3Jlc3Npb25MaW5lKHgpICsgIG1hcmdpbk9mRXJyb3IoeCk7XHJcblxyXG5cclxuICAgICAgICB2YXIgY29tcHV0ZUNvbmZpZGVuY2VBcmVhUG9pbnQgPSB4PT57XHJcbiAgICAgICAgICAgIHZhciBsaW5lYXJSZWdyZXNzaW9uID0gbGluZWFyUmVncmVzc2lvbkxpbmUoeCk7XHJcbiAgICAgICAgICAgIHZhciBtb2UgPSBtYXJnaW5PZkVycm9yKHgpO1xyXG4gICAgICAgICAgICB2YXIgY29uZkRvd24gPSBsaW5lYXJSZWdyZXNzaW9uIC0gbW9lO1xyXG4gICAgICAgICAgICB2YXIgY29uZlVwID0gbGluZWFyUmVncmVzc2lvbiArIG1vZTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHg6IHgsXHJcbiAgICAgICAgICAgICAgICB5MDogY29uZkRvd24sXHJcbiAgICAgICAgICAgICAgICB5MTogY29uZlVwXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGNlbnRlclggPSAoZXh0ZW50WFsxXStleHRlbnRYWzBdKS8yO1xyXG5cclxuICAgICAgICAvLyB2YXIgY29uZmlkZW5jZUFyZWFQb2ludHMgPSBbZXh0ZW50WFswXSwgY2VudGVyWCwgIGV4dGVudFhbMV1dLm1hcChjb21wdXRlQ29uZmlkZW5jZUFyZWFQb2ludCk7XHJcbiAgICAgICAgdmFyIGNvbmZpZGVuY2VBcmVhUG9pbnRzID0gW2V4dGVudFhbMF0sIGNlbnRlclgsICBleHRlbnRYWzFdXS5tYXAoY29tcHV0ZUNvbmZpZGVuY2VBcmVhUG9pbnQpO1xyXG5cclxuICAgICAgICB2YXIgZml0SW5QbG90ID0geSA9PiB5O1xyXG5cclxuICAgICAgICB2YXIgY29uZmlkZW5jZUFyZWEgPSAgZDMuc3ZnLmFyZWEoKVxyXG4gICAgICAgIC5pbnRlcnBvbGF0ZShcIm1vbm90b25lXCIpXHJcbiAgICAgICAgICAgIC54KGQgPT4gc2VsZi5wbG90Lnguc2NhbGUoZC54KSlcclxuICAgICAgICAgICAgLnkwKGQgPT4gZml0SW5QbG90KHNlbGYucGxvdC55LnNjYWxlKGQueTApKSlcclxuICAgICAgICAgICAgLnkxKGQgPT4gZml0SW5QbG90KHNlbGYucGxvdC55LnNjYWxlKGQueTEpKSk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGFyZWE6Y29uZmlkZW5jZUFyZWEsXHJcbiAgICAgICAgICAgIHBvaW50czpjb25maWRlbmNlQXJlYVBvaW50c1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKG5ld0RhdGEpe1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJlZ3Jlc3Npb25MaW5lcygpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlUmVncmVzc2lvbkxpbmVzKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcmVncmVzc2lvbkNvbnRhaW5lckNsYXNzID0gdGhpcy5wcmVmaXhDbGFzcyhcInJlZ3Jlc3Npb24tY29udGFpbmVyXCIpO1xyXG4gICAgICAgIHZhciByZWdyZXNzaW9uQ29udGFpbmVyU2VsZWN0b3IgPSBcImcuXCIrcmVncmVzc2lvbkNvbnRhaW5lckNsYXNzO1xyXG5cclxuICAgICAgICB2YXIgY2xpcFBhdGhJZCA9IHNlbGYucHJlZml4Q2xhc3MoXCJjbGlwXCIpO1xyXG5cclxuICAgICAgICB2YXIgcmVncmVzc2lvbkNvbnRhaW5lciA9IHNlbGYuc3ZnRy5zZWxlY3RPckluc2VydChyZWdyZXNzaW9uQ29udGFpbmVyU2VsZWN0b3IsIFwiLlwiK3NlbGYuZG90c0NvbnRhaW5lckNsYXNzKTtcclxuICAgICAgICB2YXIgcmVncmVzc2lvbkNvbnRhaW5lckNsaXAgPSByZWdyZXNzaW9uQ29udGFpbmVyLnNlbGVjdE9yQXBwZW5kKFwiY2xpcFBhdGhcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBjbGlwUGF0aElkKTtcclxuXHJcblxyXG4gICAgICAgIHJlZ3Jlc3Npb25Db250YWluZXJDbGlwLnNlbGVjdE9yQXBwZW5kKCdyZWN0JylcclxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgc2VsZi5wbG90LndpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0Jywgc2VsZi5wbG90LmhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAwKVxyXG4gICAgICAgICAgICAuYXR0cigneScsIDApO1xyXG5cclxuICAgICAgICByZWdyZXNzaW9uQ29udGFpbmVyLmF0dHIoXCJjbGlwLXBhdGhcIiwgKGQsaSkgPT4gXCJ1cmwoI1wiK2NsaXBQYXRoSWQrXCIpXCIpO1xyXG5cclxuICAgICAgICB2YXIgcmVncmVzc2lvbkNsYXNzID0gdGhpcy5wcmVmaXhDbGFzcyhcInJlZ3Jlc3Npb25cIik7XHJcbiAgICAgICAgdmFyIGNvbmZpZGVuY2VBcmVhQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwiY29uZmlkZW5jZVwiKTtcclxuICAgICAgICB2YXIgcmVncmVzc2lvblNlbGVjdG9yID0gXCJnLlwiK3JlZ3Jlc3Npb25DbGFzcztcclxuICAgICAgICB2YXIgcmVncmVzc2lvbiA9IHJlZ3Jlc3Npb25Db250YWluZXIuc2VsZWN0QWxsKHJlZ3Jlc3Npb25TZWxlY3RvcilcclxuICAgICAgICAgICAgLmRhdGEoc2VsZi5wbG90LnJlZ3Jlc3Npb25zKTtcclxuXHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb25FbnRlckcgPSByZWdyZXNzaW9uLmVudGVyKCkuaW5zZXJ0U2VsZWN0b3IocmVncmVzc2lvblNlbGVjdG9yKTtcclxuICAgICAgICB2YXIgbGluZUNsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImxpbmVcIik7XHJcbiAgICAgICAgcmVncmVzc2lvbkVudGVyR1xyXG5cclxuICAgICAgICAgICAgLmFwcGVuZChcInBhdGhcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBsaW5lQ2xhc3MpXHJcbiAgICAgICAgICAgIC5hdHRyKFwic2hhcGUtcmVuZGVyaW5nXCIsIFwib3B0aW1pemVRdWFsaXR5XCIpO1xyXG4gICAgICAgICAgICAvLyAuYXBwZW5kKFwibGluZVwiKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcImNsYXNzXCIsIFwibGluZVwiKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcInNoYXBlLXJlbmRlcmluZ1wiLCBcIm9wdGltaXplUXVhbGl0eVwiKTtcclxuXHJcbiAgICAgICAgdmFyIGxpbmUgPSByZWdyZXNzaW9uLnNlbGVjdChcInBhdGguXCIrbGluZUNsYXNzKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgciA9PiByLmNvbG9yKTtcclxuICAgICAgICAvLyAuYXR0cihcIngxXCIsIHI9PiBzZWxmLnBsb3QueC5zY2FsZShyLmxpbmVQb2ludHNbMF0ueCkpXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwieTFcIiwgcj0+IHNlbGYucGxvdC55LnNjYWxlKHIubGluZVBvaW50c1swXS55KSlcclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJ4MlwiLCByPT4gc2VsZi5wbG90Lnguc2NhbGUoci5saW5lUG9pbnRzWzFdLngpKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcInkyXCIsIHI9PiBzZWxmLnBsb3QueS5zY2FsZShyLmxpbmVQb2ludHNbMV0ueSkpXHJcblxyXG5cclxuICAgICAgICB2YXIgbGluZVQgPSBsaW5lO1xyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy50cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGxpbmVUID0gbGluZS50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsaW5lVC5hdHRyKFwiZFwiLCByID0+IHIubGluZShyLmxpbmVQb2ludHMpKVxyXG5cclxuXHJcbiAgICAgICAgcmVncmVzc2lvbkVudGVyR1xyXG4gICAgICAgICAgICAuYXBwZW5kKFwicGF0aFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGNvbmZpZGVuY2VBcmVhQ2xhc3MpXHJcbiAgICAgICAgICAgIC5hdHRyKFwic2hhcGUtcmVuZGVyaW5nXCIsIFwib3B0aW1pemVRdWFsaXR5XCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgciA9PiByLmNvbG9yKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIFwiMC40XCIpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHZhciBhcmVhID0gcmVncmVzc2lvbi5zZWxlY3QoXCJwYXRoLlwiK2NvbmZpZGVuY2VBcmVhQ2xhc3MpO1xyXG5cclxuICAgICAgICB2YXIgYXJlYVQgPSBhcmVhO1xyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy50cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGFyZWFUID0gYXJlYS50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFyZWFULmF0dHIoXCJkXCIsIHIgPT4gci5jb25maWRlbmNlLmFyZWEoci5jb25maWRlbmNlLnBvaW50cykpO1xyXG5cclxuICAgICAgICByZWdyZXNzaW9uLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn1cclxuXHJcbiIsImltcG9ydCB7Q2hhcnQsIENoYXJ0Q29uZmlnfSBmcm9tIFwiLi9jaGFydFwiO1xyXG5pbXBvcnQge1NjYXR0ZXJQbG90Q29uZmlnfSBmcm9tIFwiLi9zY2F0dGVycGxvdFwiO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5pbXBvcnQge0xlZ2VuZH0gZnJvbSBcIi4vbGVnZW5kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2NhdHRlclBsb3RNYXRyaXhDb25maWcgZXh0ZW5kcyBTY2F0dGVyUGxvdENvbmZpZ3tcclxuXHJcbiAgICBzdmdDbGFzcz0gdGhpcy5jc3NDbGFzc1ByZWZpeCsnc2NhdHRlcnBsb3QtbWF0cml4JztcclxuICAgIHNpemU9IDIwMDsgLy9zY2F0dGVyIHBsb3QgY2VsbCBzaXplXHJcbiAgICBwYWRkaW5nPSAyMDsgLy9zY2F0dGVyIHBsb3QgY2VsbCBwYWRkaW5nXHJcbiAgICBicnVzaD0gdHJ1ZTtcclxuICAgIGd1aWRlcz0gdHJ1ZTsgLy9zaG93IGF4aXMgZ3VpZGVzXHJcbiAgICBzaG93VG9vbHRpcD0gdHJ1ZTsgLy9zaG93IHRvb2x0aXAgb24gZG90IGhvdmVyXHJcbiAgICB0aWNrcz0gdW5kZWZpbmVkOyAvL3RpY2tzIG51bWJlciwgKGRlZmF1bHQ6IGNvbXB1dGVkIHVzaW5nIGNlbGwgc2l6ZSlcclxuICAgIHg9ey8vIFggYXhpcyBjb25maWdcclxuICAgICAgICBvcmllbnQ6IFwiYm90dG9tXCIsXHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCJcclxuICAgIH07XHJcbiAgICB5PXsvLyBZIGF4aXMgY29uZmlnXHJcbiAgICAgICAgb3JpZW50OiBcImxlZnRcIixcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIlxyXG4gICAgfTtcclxuICAgIGdyb3Vwcz17XHJcbiAgICAgICAga2V5OiB1bmRlZmluZWQsIC8vb2JqZWN0IHByb3BlcnR5IG5hbWUgb3IgYXJyYXkgaW5kZXggd2l0aCBncm91cGluZyB2YXJpYWJsZVxyXG4gICAgICAgIGluY2x1ZGVJblBsb3Q6IGZhbHNlLCAvL2luY2x1ZGUgZ3JvdXAgYXMgdmFyaWFibGUgaW4gcGxvdCwgYm9vbGVhbiAoZGVmYXVsdDogZmFsc2UpXHJcbiAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IGRba2V5XSwgLy8gZ3JvdXBpbmcgdmFsdWUgYWNjZXNzb3IsXHJcbiAgICAgICAgbGFiZWw6IFwiXCJcclxuICAgIH07XHJcbiAgICB2YXJpYWJsZXM9IHtcclxuICAgICAgICBsYWJlbHM6IFtdLCAvL29wdGlvbmFsIGFycmF5IG9mIHZhcmlhYmxlIGxhYmVscyAoZm9yIHRoZSBkaWFnb25hbCBvZiB0aGUgcGxvdCkuXHJcbiAgICAgICAga2V5czogW10sIC8vb3B0aW9uYWwgYXJyYXkgb2YgdmFyaWFibGUga2V5c1xyXG4gICAgICAgIHZhbHVlOiAoZCwgdmFyaWFibGVLZXkpID0+IGRbdmFyaWFibGVLZXldIC8vIHZhcmlhYmxlIHZhbHVlIGFjY2Vzc29yXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNjYXR0ZXJQbG90TWF0cml4IGV4dGVuZHMgQ2hhcnQge1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IFNjYXR0ZXJQbG90TWF0cml4Q29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBTY2F0dGVyUGxvdE1hdHJpeENvbmZpZyhjb25maWcpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdFBsb3QoKTtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSB0aGlzLnBsb3QubWFyZ2luO1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcbiAgICAgICAgdGhpcy5wbG90Lng9e307XHJcbiAgICAgICAgdGhpcy5wbG90Lnk9e307XHJcbiAgICAgICAgdGhpcy5wbG90LmRvdD17XHJcbiAgICAgICAgICAgIGNvbG9yOiBudWxsLy9jb2xvciBzY2FsZSBtYXBwaW5nIGZ1bmN0aW9uXHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMucGxvdC5zaG93TGVnZW5kID0gY29uZi5zaG93TGVnZW5kO1xyXG4gICAgICAgIGlmKHRoaXMucGxvdC5zaG93TGVnZW5kKXtcclxuICAgICAgICAgICAgbWFyZ2luLnJpZ2h0ID0gY29uZi5tYXJnaW4ucmlnaHQgKyBjb25mLmxlZ2VuZC53aWR0aCtjb25mLmxlZ2VuZC5tYXJnaW4qMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBWYXJpYWJsZXMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnNpemUgPSBjb25mLnNpemU7XHJcblxyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBjb25mLndpZHRoO1xyXG4gICAgICAgIHZhciBib3VuZGluZ0NsaWVudFJlY3QgPSB0aGlzLmdldEJhc2VDb250YWluZXJOb2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgaWYgKCF3aWR0aCkge1xyXG4gICAgICAgICAgICB2YXIgbWF4V2lkdGggPSBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodCArIHRoaXMucGxvdC52YXJpYWJsZXMubGVuZ3RoKnRoaXMucGxvdC5zaXplO1xyXG4gICAgICAgICAgICB3aWR0aCA9IE1hdGgubWluKGJvdW5kaW5nQ2xpZW50UmVjdC53aWR0aCwgbWF4V2lkdGgpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IHdpZHRoO1xyXG4gICAgICAgIGlmICghaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGhlaWdodCA9IGJvdW5kaW5nQ2xpZW50UmVjdC5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnBsb3Qud2lkdGggPSB3aWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0O1xyXG4gICAgICAgIHRoaXMucGxvdC5oZWlnaHQgPSBoZWlnaHQgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAgaWYoY29uZi50aWNrcz09PXVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIGNvbmYudGlja3MgPSB0aGlzLnBsb3Quc2l6ZSAvIDQwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cFgoKTtcclxuICAgICAgICB0aGlzLnNldHVwWSgpO1xyXG5cclxuICAgICAgICBpZiAoY29uZi5kb3QuZDNDb2xvckNhdGVnb3J5KSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5kb3QuY29sb3JDYXRlZ29yeSA9IGQzLnNjYWxlW2NvbmYuZG90LmQzQ29sb3JDYXRlZ29yeV0oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNvbG9yVmFsdWUgPSBjb25mLmRvdC5jb2xvcjtcclxuICAgICAgICBpZiAoY29sb3JWYWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yVmFsdWUgPSBjb2xvclZhbHVlO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb2xvclZhbHVlID09PSAnc3RyaW5nJyB8fCBjb2xvclZhbHVlIGluc3RhbmNlb2YgU3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yID0gY29sb3JWYWx1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnBsb3QuZG90LmNvbG9yQ2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5kb3QuY29sb3IgPSBkID0+IHNlbGYucGxvdC5kb3QuY29sb3JDYXRlZ29yeShzZWxmLnBsb3QuZG90LmNvbG9yVmFsdWUoZCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cFZhcmlhYmxlcygpIHtcclxuICAgICAgICB2YXIgdmFyaWFibGVzQ29uZiA9IHRoaXMuY29uZmlnLnZhcmlhYmxlcztcclxuXHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgcGxvdC5kb21haW5CeVZhcmlhYmxlID0ge307XHJcbiAgICAgICAgcGxvdC52YXJpYWJsZXMgPSB2YXJpYWJsZXNDb25mLmtleXM7XHJcbiAgICAgICAgaWYoIXBsb3QudmFyaWFibGVzIHx8ICFwbG90LnZhcmlhYmxlcy5sZW5ndGgpe1xyXG4gICAgICAgICAgICBwbG90LnZhcmlhYmxlcyA9IFV0aWxzLmluZmVyVmFyaWFibGVzKGRhdGEsIHRoaXMuY29uZmlnLmdyb3Vwcy5rZXksIHRoaXMuY29uZmlnLmluY2x1ZGVJblBsb3QpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcGxvdC5sYWJlbHMgPSBbXTtcclxuICAgICAgICBwbG90LmxhYmVsQnlWYXJpYWJsZSA9IHt9O1xyXG4gICAgICAgIHBsb3QudmFyaWFibGVzLmZvckVhY2goKHZhcmlhYmxlS2V5LCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBwbG90LmRvbWFpbkJ5VmFyaWFibGVbdmFyaWFibGVLZXldID0gZDMuZXh0ZW50KGRhdGEsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHZhcmlhYmxlc0NvbmYudmFsdWUoZCwgdmFyaWFibGVLZXkpIH0pO1xyXG4gICAgICAgICAgICB2YXIgbGFiZWwgPSB2YXJpYWJsZUtleTtcclxuICAgICAgICAgICAgaWYodmFyaWFibGVzQ29uZi5sYWJlbHMgJiYgdmFyaWFibGVzQ29uZi5sYWJlbHMubGVuZ3RoPmluZGV4KXtcclxuXHJcbiAgICAgICAgICAgICAgICBsYWJlbCA9IHZhcmlhYmxlc0NvbmYubGFiZWxzW2luZGV4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwbG90LmxhYmVscy5wdXNoKGxhYmVsKTtcclxuICAgICAgICAgICAgcGxvdC5sYWJlbEJ5VmFyaWFibGVbdmFyaWFibGVLZXldID0gbGFiZWw7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHBsb3QubGFiZWxCeVZhcmlhYmxlKTtcclxuXHJcbiAgICAgICAgcGxvdC5zdWJwbG90cyA9IFtdO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cFgoKSB7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB4ID0gcGxvdC54O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcblxyXG4gICAgICAgIHgudmFsdWUgPSBjb25mLnZhcmlhYmxlcy52YWx1ZTtcclxuICAgICAgICB4LnNjYWxlID0gZDMuc2NhbGVbY29uZi54LnNjYWxlXSgpLnJhbmdlKFtjb25mLnBhZGRpbmcgLyAyLCBwbG90LnNpemUgLSBjb25mLnBhZGRpbmcgLyAyXSk7XHJcbiAgICAgICAgeC5tYXAgPSAoZCwgdmFyaWFibGUpID0+IHguc2NhbGUoeC52YWx1ZShkLCB2YXJpYWJsZSkpO1xyXG4gICAgICAgIHguYXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeC5zY2FsZSkub3JpZW50KGNvbmYueC5vcmllbnQpLnRpY2tzKGNvbmYudGlja3MpO1xyXG4gICAgICAgIHguYXhpcy50aWNrU2l6ZShwbG90LnNpemUgKiBwbG90LnZhcmlhYmxlcy5sZW5ndGgpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBZKCkge1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeSA9IHBsb3QueTtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB5LnZhbHVlID0gY29uZi52YXJpYWJsZXMudmFsdWU7XHJcbiAgICAgICAgeS5zY2FsZSA9IGQzLnNjYWxlW2NvbmYueS5zY2FsZV0oKS5yYW5nZShbIHBsb3Quc2l6ZSAtIGNvbmYucGFkZGluZyAvIDIsIGNvbmYucGFkZGluZyAvIDJdKTtcclxuICAgICAgICB5Lm1hcCA9IChkLCB2YXJpYWJsZSkgPT4geS5zY2FsZSh5LnZhbHVlKGQsIHZhcmlhYmxlKSk7XHJcbiAgICAgICAgeS5heGlzPSBkMy5zdmcuYXhpcygpLnNjYWxlKHkuc2NhbGUpLm9yaWVudChjb25mLnkub3JpZW50KS50aWNrcyhjb25mLnRpY2tzKTtcclxuICAgICAgICB5LmF4aXMudGlja1NpemUoLXBsb3Quc2l6ZSAqIHBsb3QudmFyaWFibGVzLmxlbmd0aCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRyYXcoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPXRoaXM7XHJcbiAgICAgICAgdmFyIG4gPSBzZWxmLnBsb3QudmFyaWFibGVzLmxlbmd0aDtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB2YXIgYXhpc0NsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImF4aXNcIik7XHJcbiAgICAgICAgdmFyIGF4aXNYQ2xhc3MgPSBheGlzQ2xhc3MrXCIteFwiO1xyXG4gICAgICAgIHZhciBheGlzWUNsYXNzID0gYXhpc0NsYXNzK1wiLXlcIjtcclxuXHJcbiAgICAgICAgdmFyIHhBeGlzU2VsZWN0b3IgPSBcImcuXCIrYXhpc1hDbGFzcytcIi5cIitheGlzQ2xhc3M7XHJcbiAgICAgICAgdmFyIHlBeGlzU2VsZWN0b3IgPSBcImcuXCIrYXhpc1lDbGFzcytcIi5cIitheGlzQ2xhc3M7XHJcblxyXG4gICAgICAgIHZhciBub0d1aWRlc0NsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcIm5vLWd1aWRlc1wiKTtcclxuICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKHhBeGlzU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5kYXRhKHNlbGYucGxvdC52YXJpYWJsZXMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZFNlbGVjdG9yKHhBeGlzU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKG5vR3VpZGVzQ2xhc3MsICFjb25mLmd1aWRlcylcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwidHJhbnNsYXRlKFwiICsgKG4gLSBpIC0gMSkgKiBzZWxmLnBsb3Quc2l6ZSArIFwiLDApXCIpXHJcbiAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uKGQpIHsgc2VsZi5wbG90Lnguc2NhbGUuZG9tYWluKHNlbGYucGxvdC5kb21haW5CeVZhcmlhYmxlW2RdKTsgZDMuc2VsZWN0KHRoaXMpLmNhbGwoc2VsZi5wbG90LnguYXhpcyk7IH0pO1xyXG5cclxuICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKHlBeGlzU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5kYXRhKHNlbGYucGxvdC52YXJpYWJsZXMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZFNlbGVjdG9yKHlBeGlzU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKG5vR3VpZGVzQ2xhc3MsICFjb25mLmd1aWRlcylcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwidHJhbnNsYXRlKDAsXCIgKyBpICogc2VsZi5wbG90LnNpemUgKyBcIilcIilcclxuICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24oZCkgeyBzZWxmLnBsb3QueS5zY2FsZS5kb21haW4oc2VsZi5wbG90LmRvbWFpbkJ5VmFyaWFibGVbZF0pOyBkMy5zZWxlY3QodGhpcykuY2FsbChzZWxmLnBsb3QueS5heGlzKTsgfSk7XHJcblxyXG4gICAgICAgIHZhciBjZWxsQ2xhc3MgPSAgc2VsZi5wcmVmaXhDbGFzcyhcImNlbGxcIik7XHJcbiAgICAgICAgdmFyIGNlbGwgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwiLlwiK2NlbGxDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEoc2VsZi51dGlscy5jcm9zcyhzZWxmLnBsb3QudmFyaWFibGVzLCBzZWxmLnBsb3QudmFyaWFibGVzKSlcclxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kU2VsZWN0b3IoXCJnLlwiK2NlbGxDbGFzcylcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZCA9PiBcInRyYW5zbGF0ZShcIiArIChuIC0gZC5pIC0gMSkgKiBzZWxmLnBsb3Quc2l6ZSArIFwiLFwiICsgZC5qICogc2VsZi5wbG90LnNpemUgKyBcIilcIik7XHJcblxyXG4gICAgICAgIGlmKGNvbmYuYnJ1c2gpe1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdCcnVzaChjZWxsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNlbGwuZWFjaChwbG90U3VicGxvdCk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgLy9MYWJlbHNcclxuICAgICAgICBjZWxsLmZpbHRlcihkID0+IGQuaSA9PT0gZC5qKVxyXG4gICAgICAgICAgICAuYXBwZW5kKFwidGV4dFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgY29uZi5wYWRkaW5nKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgY29uZi5wYWRkaW5nKVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiLjcxZW1cIilcclxuICAgICAgICAgICAgLnRleHQoIGQgPT4gc2VsZi5wbG90LmxhYmVsQnlWYXJpYWJsZVtkLnhdKTtcclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcGxvdFN1YnBsb3QocCkge1xyXG4gICAgICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICAgICAgcGxvdC5zdWJwbG90cy5wdXNoKHApO1xyXG4gICAgICAgICAgICB2YXIgY2VsbCA9IGQzLnNlbGVjdCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIHBsb3QueC5zY2FsZS5kb21haW4ocGxvdC5kb21haW5CeVZhcmlhYmxlW3AueF0pO1xyXG4gICAgICAgICAgICBwbG90Lnkuc2NhbGUuZG9tYWluKHBsb3QuZG9tYWluQnlWYXJpYWJsZVtwLnldKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmcmFtZUNsYXNzID0gIHNlbGYucHJlZml4Q2xhc3MoXCJmcmFtZVwiKTtcclxuICAgICAgICAgICAgY2VsbC5hcHBlbmQoXCJyZWN0XCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGZyYW1lQ2xhc3MpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInhcIiwgY29uZi5wYWRkaW5nIC8gMilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieVwiLCBjb25mLnBhZGRpbmcgLyAyKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBjb25mLnNpemUgLSBjb25mLnBhZGRpbmcpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBjb25mLnNpemUgLSBjb25mLnBhZGRpbmcpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHAudXBkYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3VicGxvdCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZG90cyA9IGNlbGwuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmRhdGEoc2VsZi5kYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICBkb3RzLmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGRvdHMuYXR0cihcImN4XCIsIChkKSA9PiBwbG90LngubWFwKGQsIHN1YnBsb3QueCkpXHJcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCAoZCkgPT4gcGxvdC55Lm1hcChkLCBzdWJwbG90LnkpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiclwiLCBzZWxmLmNvbmZpZy5kb3QucmFkaXVzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocGxvdC5kb3QuY29sb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb3RzLnN0eWxlKFwiZmlsbFwiLCBwbG90LmRvdC5jb2xvcilcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZihwbG90LnRvb2x0aXApe1xyXG4gICAgICAgICAgICAgICAgICAgIGRvdHMub24oXCJtb3VzZW92ZXJcIiwgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDIwMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IFwiKFwiICsgcGxvdC54LnZhbHVlKGQsIHN1YnBsb3QueCkgKyBcIiwgXCIgK3Bsb3QueS52YWx1ZShkLCBzdWJwbG90LnkpICsgXCIpXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC5odG1sKGh0bWwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkMy5ldmVudC5wYWdlWSAtIDI4KSArIFwicHhcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZ3JvdXAgPSBzZWxmLmNvbmZpZy5ncm91cHMudmFsdWUoZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGdyb3VwIHx8IGdyb3VwPT09MCApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCs9XCI8YnIvPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhYmVsID0gc2VsZi5jb25maWcuZ3JvdXBzLmxhYmVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYobGFiZWwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwrPWxhYmVsK1wiOiBcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwrPWdyb3VwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLmh0bWwoaHRtbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCAoZCk9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBkb3RzLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcC51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVMZWdlbmQoKTtcclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlKGRhdGEpIHtcclxuXHJcbiAgICAgICAgc3VwZXIudXBkYXRlKGRhdGEpO1xyXG4gICAgICAgIHRoaXMucGxvdC5zdWJwbG90cy5mb3JFYWNoKHAgPT4gcC51cGRhdGUoKSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVMZWdlbmQoKTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhd0JydXNoKGNlbGwpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGJydXNoID0gZDMuc3ZnLmJydXNoKClcclxuICAgICAgICAgICAgLngoc2VsZi5wbG90Lnguc2NhbGUpXHJcbiAgICAgICAgICAgIC55KHNlbGYucGxvdC55LnNjYWxlKVxyXG4gICAgICAgICAgICAub24oXCJicnVzaHN0YXJ0XCIsIGJydXNoc3RhcnQpXHJcbiAgICAgICAgICAgIC5vbihcImJydXNoXCIsIGJydXNobW92ZSlcclxuICAgICAgICAgICAgLm9uKFwiYnJ1c2hlbmRcIiwgYnJ1c2hlbmQpO1xyXG5cclxuICAgICAgICBjZWxsLmFwcGVuZChcImdcIikuY2FsbChicnVzaCk7XHJcblxyXG5cclxuICAgICAgICB2YXIgYnJ1c2hDZWxsO1xyXG5cclxuICAgICAgICAvLyBDbGVhciB0aGUgcHJldmlvdXNseS1hY3RpdmUgYnJ1c2gsIGlmIGFueS5cclxuICAgICAgICBmdW5jdGlvbiBicnVzaHN0YXJ0KHApIHtcclxuICAgICAgICAgICAgaWYgKGJydXNoQ2VsbCAhPT0gdGhpcykge1xyXG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KGJydXNoQ2VsbCkuY2FsbChicnVzaC5jbGVhcigpKTtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC54LnNjYWxlLmRvbWFpbihzZWxmLnBsb3QuZG9tYWluQnlWYXJpYWJsZVtwLnhdKTtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC55LnNjYWxlLmRvbWFpbihzZWxmLnBsb3QuZG9tYWluQnlWYXJpYWJsZVtwLnldKTtcclxuICAgICAgICAgICAgICAgIGJydXNoQ2VsbCA9IHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEhpZ2hsaWdodCB0aGUgc2VsZWN0ZWQgY2lyY2xlcy5cclxuICAgICAgICBmdW5jdGlvbiBicnVzaG1vdmUocCkge1xyXG4gICAgICAgICAgICB2YXIgZSA9IGJydXNoLmV4dGVudCgpO1xyXG4gICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwiY2lyY2xlXCIpLmNsYXNzZWQoXCJoaWRkZW5cIiwgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlWzBdWzBdID4gZFtwLnhdIHx8IGRbcC54XSA+IGVbMV1bMF1cclxuICAgICAgICAgICAgICAgICAgICB8fCBlWzBdWzFdID4gZFtwLnldIHx8IGRbcC55XSA+IGVbMV1bMV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBJZiB0aGUgYnJ1c2ggaXMgZW1wdHksIHNlbGVjdCBhbGwgY2lyY2xlcy5cclxuICAgICAgICBmdW5jdGlvbiBicnVzaGVuZCgpIHtcclxuICAgICAgICAgICAgaWYgKGJydXNoLmVtcHR5KCkpIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCIuaGlkZGVuXCIpLmNsYXNzZWQoXCJoaWRkZW5cIiwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlTGVnZW5kKCkge1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygndXBkYXRlTGVnZW5kJyk7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcblxyXG4gICAgICAgIHZhciBzY2FsZSA9IHBsb3QuZG90LmNvbG9yQ2F0ZWdvcnk7XHJcbiAgICAgICAgaWYoIXNjYWxlLmRvbWFpbigpIHx8IHNjYWxlLmRvbWFpbigpLmxlbmd0aDwyKXtcclxuICAgICAgICAgICAgcGxvdC5zaG93TGVnZW5kID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZighcGxvdC5zaG93TGVnZW5kKXtcclxuICAgICAgICAgICAgaWYocGxvdC5sZWdlbmQgJiYgcGxvdC5sZWdlbmQuY29udGFpbmVyKXtcclxuICAgICAgICAgICAgICAgIHBsb3QubGVnZW5kLmNvbnRhaW5lci5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdmFyIGxlZ2VuZFggPSB0aGlzLnBsb3Qud2lkdGggKyB0aGlzLmNvbmZpZy5sZWdlbmQubWFyZ2luO1xyXG4gICAgICAgIHZhciBsZWdlbmRZID0gdGhpcy5jb25maWcubGVnZW5kLm1hcmdpbjtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmQgPSBuZXcgTGVnZW5kKHRoaXMuc3ZnLCB0aGlzLnN2Z0csIHNjYWxlLCBsZWdlbmRYLCBsZWdlbmRZKTtcclxuXHJcbiAgICAgICAgdmFyIGxlZ2VuZExpbmVhciA9IHBsb3QubGVnZW5kLmNvbG9yKClcclxuICAgICAgICAgICAgLnNoYXBlV2lkdGgodGhpcy5jb25maWcubGVnZW5kLnNoYXBlV2lkdGgpXHJcbiAgICAgICAgICAgIC5vcmllbnQoJ3ZlcnRpY2FsJylcclxuICAgICAgICAgICAgLnNjYWxlKHNjYWxlKTtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmQuY29udGFpbmVyXHJcbiAgICAgICAgICAgIC5jYWxsKGxlZ2VuZExpbmVhcik7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge0NoYXJ0LCBDaGFydENvbmZpZ30gZnJvbSBcIi4vY2hhcnRcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IHtMZWdlbmR9IGZyb20gXCIuL2xlZ2VuZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNjYXR0ZXJQbG90Q29uZmlnIGV4dGVuZHMgQ2hhcnRDb25maWd7XHJcblxyXG4gICAgc3ZnQ2xhc3M9IHRoaXMuY3NzQ2xhc3NQcmVmaXgrJ3NjYXR0ZXJwbG90JztcclxuICAgIGd1aWRlcz0gZmFsc2U7IC8vc2hvdyBheGlzIGd1aWRlc1xyXG4gICAgc2hvd1Rvb2x0aXA9IHRydWU7IC8vc2hvdyB0b29sdGlwIG9uIGRvdCBob3ZlclxyXG4gICAgc2hvd0xlZ2VuZD10cnVlO1xyXG4gICAgbGVnZW5kPXtcclxuICAgICAgICB3aWR0aDogODAsXHJcbiAgICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgICBzaGFwZVdpZHRoOiAyMFxyXG4gICAgfTtcclxuXHJcbiAgICB4PXsvLyBYIGF4aXMgY29uZmlnXHJcbiAgICAgICAgbGFiZWw6ICdYJywgLy8gYXhpcyBsYWJlbFxyXG4gICAgICAgIGtleTogMCxcclxuICAgICAgICB2YWx1ZTogKGQsIGtleSkgPT4gZFtrZXldLCAvLyB4IHZhbHVlIGFjY2Vzc29yXHJcbiAgICAgICAgb3JpZW50OiBcImJvdHRvbVwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiXHJcbiAgICB9O1xyXG4gICAgeT17Ly8gWSBheGlzIGNvbmZpZ1xyXG4gICAgICAgIGxhYmVsOiAnWScsIC8vIGF4aXMgbGFiZWwsXHJcbiAgICAgICAga2V5OiAxLFxyXG4gICAgICAgIHZhbHVlOiAoZCwga2V5KSA9PiBkW2tleV0sIC8vIHkgdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICBvcmllbnQ6IFwibGVmdFwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiXHJcbiAgICB9O1xyXG4gICAgZ3JvdXBzPXtcclxuICAgICAgICBrZXk6IDIsXHJcbiAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IGRba2V5XSAsIC8vIGdyb3VwaW5nIHZhbHVlIGFjY2Vzc29yLFxyXG4gICAgICAgIGxhYmVsOiBcIlwiXHJcbiAgICB9O1xyXG4gICAgdHJhbnNpdGlvbj0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdmFyIGNvbmZpZyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5kb3Q9e1xyXG4gICAgICAgICAgICByYWRpdXM6IDIsXHJcbiAgICAgICAgICAgIGNvbG9yOiBkID0+IGNvbmZpZy5ncm91cHMudmFsdWUoZCwgY29uZmlnLmdyb3Vwcy5rZXkpLCAvLyBzdHJpbmcgb3IgZnVuY3Rpb24gcmV0dXJuaW5nIGNvbG9yJ3MgdmFsdWUgZm9yIGNvbG9yIHNjYWxlXHJcbiAgICAgICAgICAgIGQzQ29sb3JDYXRlZ29yeTogJ2NhdGVnb3J5MTAnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYoY3VzdG9tKXtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTY2F0dGVyUGxvdCBleHRlbmRzIENoYXJ0e1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IFNjYXR0ZXJQbG90Q29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpe1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IFNjYXR0ZXJQbG90Q29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCl7XHJcbiAgICAgICAgc3VwZXIuaW5pdFBsb3QoKTtcclxuICAgICAgICB2YXIgc2VsZj10aGlzO1xyXG5cclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueD17fTtcclxuICAgICAgICB0aGlzLnBsb3QueT17fTtcclxuICAgICAgICB0aGlzLnBsb3QuZG90PXtcclxuICAgICAgICAgICAgY29sb3I6IG51bGwvL2NvbG9yIHNjYWxlIG1hcHBpbmcgZnVuY3Rpb25cclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnNob3dMZWdlbmQgPSBjb25mLnNob3dMZWdlbmQ7XHJcbiAgICAgICAgaWYodGhpcy5wbG90LnNob3dMZWdlbmQpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWFyZ2luLnJpZ2h0ID0gY29uZi5tYXJnaW4ucmlnaHQgKyBjb25mLmxlZ2VuZC53aWR0aCtjb25mLmxlZ2VuZC5tYXJnaW4qMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHRoaXMuY29tcHV0ZVBsb3RTaXplKCk7XHJcbiAgICAgICAgXHJcblxyXG5cclxuICAgICAgICAvLyB2YXIgbGVnZW5kV2lkdGggPSBhdmFpbGFibGVXaWR0aDtcclxuICAgICAgICAvLyBsZWdlbmQud2lkdGgobGVnZW5kV2lkdGgpO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gd3JhcC5zZWxlY3QoJy5udi1sZWdlbmRXcmFwJylcclxuICAgICAgICAvLyAgICAgLmRhdHVtKGRhdGEpXHJcbiAgICAgICAgLy8gICAgIC5jYWxsKGxlZ2VuZCk7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBpZiAobGVnZW5kLmhlaWdodCgpID4gbWFyZ2luLnRvcCkge1xyXG4gICAgICAgIC8vICAgICBtYXJnaW4udG9wID0gbGVnZW5kLmhlaWdodCgpO1xyXG4gICAgICAgIC8vICAgICBhdmFpbGFibGVIZWlnaHQgPSBudi51dGlscy5hdmFpbGFibGVIZWlnaHQoaGVpZ2h0LCBjb250YWluZXIsIG1hcmdpbik7XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICB0aGlzLnNldHVwWCgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBZKCk7XHJcblxyXG4gICAgICAgIGlmKGNvbmYuZG90LmQzQ29sb3JDYXRlZ29yeSl7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5kb3QuY29sb3JDYXRlZ29yeSA9IGQzLnNjYWxlW2NvbmYuZG90LmQzQ29sb3JDYXRlZ29yeV0oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNvbG9yVmFsdWUgPSBjb25mLmRvdC5jb2xvcjtcclxuICAgICAgICBpZihjb2xvclZhbHVlKXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmRvdC5jb2xvclZhbHVlID0gY29sb3JWYWx1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29sb3JWYWx1ZSA9PT0gJ3N0cmluZycgfHwgY29sb3JWYWx1ZSBpbnN0YW5jZW9mIFN0cmluZyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yID0gY29sb3JWYWx1ZTtcclxuICAgICAgICAgICAgfWVsc2UgaWYodGhpcy5wbG90LmRvdC5jb2xvckNhdGVnb3J5KXtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5kb3QuY29sb3IgPSBkID0+ICBzZWxmLnBsb3QuZG90LmNvbG9yQ2F0ZWdvcnkoc2VsZi5wbG90LmRvdC5jb2xvclZhbHVlKGQpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfWVsc2V7XHJcblxyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cFgoKXtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHggPSBwbG90Lng7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZy54O1xyXG5cclxuICAgICAgICAvKiAqXHJcbiAgICAgICAgICogdmFsdWUgYWNjZXNzb3IgLSByZXR1cm5zIHRoZSB2YWx1ZSB0byBlbmNvZGUgZm9yIGEgZ2l2ZW4gZGF0YSBvYmplY3QuXHJcbiAgICAgICAgICogc2NhbGUgLSBtYXBzIHZhbHVlIHRvIGEgdmlzdWFsIGRpc3BsYXkgZW5jb2RpbmcsIHN1Y2ggYXMgYSBwaXhlbCBwb3NpdGlvbi5cclxuICAgICAgICAgKiBtYXAgZnVuY3Rpb24gLSBtYXBzIGZyb20gZGF0YSB2YWx1ZSB0byBkaXNwbGF5IHZhbHVlXHJcbiAgICAgICAgICogYXhpcyAtIHNldHMgdXAgYXhpc1xyXG4gICAgICAgICAqKi9cclxuICAgICAgICB4LnZhbHVlID0gZCA9PiBjb25mLnZhbHVlKGQsIGNvbmYua2V5KTtcclxuICAgICAgICB4LnNjYWxlID0gZDMuc2NhbGVbY29uZi5zY2FsZV0oKS5yYW5nZShbMCwgcGxvdC53aWR0aF0pO1xyXG4gICAgICAgIHgubWFwID0gZCA9PiB4LnNjYWxlKHgudmFsdWUoZCkpO1xyXG4gICAgICAgIHguYXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeC5zY2FsZSkub3JpZW50KGNvbmYub3JpZW50KTtcclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgICAgICBwbG90Lnguc2NhbGUuZG9tYWluKFtkMy5taW4oZGF0YSwgcGxvdC54LnZhbHVlKS0xLCBkMy5tYXgoZGF0YSwgcGxvdC54LnZhbHVlKSsxXSk7XHJcbiAgICAgICAgaWYodGhpcy5jb25maWcuZ3VpZGVzKSB7XHJcbiAgICAgICAgICAgIHguYXhpcy50aWNrU2l6ZSgtcGxvdC5oZWlnaHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwWSAoKXtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHkgPSBwbG90Lnk7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZy55O1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHZhbHVlIGFjY2Vzc29yIC0gcmV0dXJucyB0aGUgdmFsdWUgdG8gZW5jb2RlIGZvciBhIGdpdmVuIGRhdGEgb2JqZWN0LlxyXG4gICAgICAgICAqIHNjYWxlIC0gbWFwcyB2YWx1ZSB0byBhIHZpc3VhbCBkaXNwbGF5IGVuY29kaW5nLCBzdWNoIGFzIGEgcGl4ZWwgcG9zaXRpb24uXHJcbiAgICAgICAgICogbWFwIGZ1bmN0aW9uIC0gbWFwcyBmcm9tIGRhdGEgdmFsdWUgdG8gZGlzcGxheSB2YWx1ZVxyXG4gICAgICAgICAqIGF4aXMgLSBzZXRzIHVwIGF4aXNcclxuICAgICAgICAgKi9cclxuICAgICAgICB5LnZhbHVlID0gZCA9PiBjb25mLnZhbHVlKGQsIGNvbmYua2V5KTtcclxuICAgICAgICB5LnNjYWxlID0gZDMuc2NhbGVbY29uZi5zY2FsZV0oKS5yYW5nZShbcGxvdC5oZWlnaHQsIDBdKTtcclxuICAgICAgICB5Lm1hcCA9IGQgPT4geS5zY2FsZSh5LnZhbHVlKGQpKTtcclxuICAgICAgICB5LmF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHkuc2NhbGUpLm9yaWVudChjb25mLm9yaWVudCk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuY29uZmlnLmd1aWRlcyl7XHJcbiAgICAgICAgICAgIHkuYXhpcy50aWNrU2l6ZSgtcGxvdC53aWR0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgcGxvdC55LnNjYWxlLmRvbWFpbihbZDMubWluKGRhdGEsIHBsb3QueS52YWx1ZSktMSwgZDMubWF4KGRhdGEsIHBsb3QueS52YWx1ZSkrMV0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBkcmF3KCl7XHJcbiAgICAgICAgdGhpcy5kcmF3QXhpc1goKTtcclxuICAgICAgICB0aGlzLmRyYXdBeGlzWSgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRyYXdBeGlzWCgpe1xyXG5cclxuICAgICAgICBcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGF4aXNDb25mID0gdGhpcy5jb25maWcueDtcclxuICAgICAgICB2YXIgYXhpcyA9IHNlbGYuc3ZnRy5zZWxlY3RPckFwcGVuZChcImcuXCIrc2VsZi5wcmVmaXhDbGFzcygnYXhpcy14JykrXCIuXCIrc2VsZi5wcmVmaXhDbGFzcygnYXhpcycpKyhzZWxmLmNvbmZpZy5ndWlkZXMgPyAnJyA6ICcuJytzZWxmLnByZWZpeENsYXNzKCduby1ndWlkZXMnKSkpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyBwbG90LmhlaWdodCArIFwiKVwiKTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgYXhpc1QgPSBheGlzO1xyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy50cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGF4aXNUID0gYXhpcy50cmFuc2l0aW9uKCkuZWFzZShcInNpbi1pbi1vdXRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBheGlzVC5jYWxsKHBsb3QueC5heGlzKTtcclxuICAgICAgICBcclxuICAgICAgICBheGlzLnNlbGVjdE9yQXBwZW5kKFwidGV4dC5cIitzZWxmLnByZWZpeENsYXNzKCdsYWJlbCcpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisgKHBsb3Qud2lkdGgvMikgK1wiLFwiKyAocGxvdC5tYXJnaW4uYm90dG9tKSArXCIpXCIpICAvLyB0ZXh0IGlzIGRyYXduIG9mZiB0aGUgc2NyZWVuIHRvcCBsZWZ0LCBtb3ZlIGRvd24gYW5kIG91dCBhbmQgcm90YXRlXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCItMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGF4aXNDb25mLmxhYmVsKTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhd0F4aXNZKCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBheGlzQ29uZiA9IHRoaXMuY29uZmlnLnk7XHJcbiAgICAgICAgdmFyIGF4aXMgPSBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMteScpK1wiLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMnKSsoc2VsZi5jb25maWcuZ3VpZGVzID8gJycgOiAnLicrc2VsZi5wcmVmaXhDbGFzcygnbm8tZ3VpZGVzJykpKTtcclxuXHJcbiAgICAgICAgdmFyIGF4aXNUID0gYXhpcztcclxuICAgICAgICBpZiAoc2VsZi5jb25maWcudHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICBheGlzVCA9IGF4aXMudHJhbnNpdGlvbigpLmVhc2UoXCJzaW4taW4tb3V0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXhpc1QuY2FsbChwbG90LnkuYXhpcyk7XHJcblxyXG4gICAgICAgIGF4aXMuc2VsZWN0T3JBcHBlbmQoXCJ0ZXh0LlwiK3NlbGYucHJlZml4Q2xhc3MoJ2xhYmVsJykpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyAtcGxvdC5tYXJnaW4ubGVmdCArXCIsXCIrKHBsb3QuaGVpZ2h0LzIpK1wiKXJvdGF0ZSgtOTApXCIpICAvLyB0ZXh0IGlzIGRyYXduIG9mZiB0aGUgc2NyZWVuIHRvcCBsZWZ0LCBtb3ZlIGRvd24gYW5kIG91dCBhbmQgcm90YXRlXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCIxZW1cIilcclxuICAgICAgICAgICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoYXhpc0NvbmYubGFiZWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICB1cGRhdGUobmV3RGF0YSl7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKG5ld0RhdGEpO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZURvdHMoKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVMZWdlbmQoKTtcclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlRG90cygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgdmFyIGRvdENsYXNzID0gc2VsZi5wcmVmaXhDbGFzcygnZG90Jyk7XHJcbiAgICAgICAgc2VsZi5kb3RzQ29udGFpbmVyQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKCdkb3RzLWNvbnRhaW5lcicpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGRvdHNDb250YWluZXIgPSBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiICsgc2VsZi5kb3RzQ29udGFpbmVyQ2xhc3MpO1xyXG5cclxuICAgICAgICB2YXIgZG90cyA9IGRvdHNDb250YWluZXIuc2VsZWN0QWxsKCcuJyArIGRvdENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShkYXRhKTtcclxuXHJcbiAgICAgICAgZG90cy5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGRvdENsYXNzKTtcclxuXHJcbiAgICAgICAgdmFyIGRvdHNUID0gZG90cztcclxuICAgICAgICBpZiAoc2VsZi5jb25maWcudHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICBkb3RzVCA9IGRvdHMudHJhbnNpdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG90c1QuYXR0cihcInJcIiwgc2VsZi5jb25maWcuZG90LnJhZGl1cylcclxuICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCBwbG90LngubWFwKVxyXG4gICAgICAgICAgICAuYXR0cihcImN5XCIsIHBsb3QueS5tYXApO1xyXG5cclxuICAgICAgICBpZiAocGxvdC50b29sdGlwKSB7XHJcbiAgICAgICAgICAgIGRvdHMub24oXCJtb3VzZW92ZXJcIiwgZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDIwMClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIC45KTtcclxuICAgICAgICAgICAgICAgIHZhciBodG1sID0gXCIoXCIgKyBwbG90LngudmFsdWUoZCkgKyBcIiwgXCIgKyBwbG90LnkudmFsdWUoZCkgKyBcIilcIjtcclxuICAgICAgICAgICAgICAgIHZhciBncm91cCA9IHNlbGYuY29uZmlnLmdyb3Vwcy52YWx1ZShkLCBzZWxmLmNvbmZpZy5ncm91cHMua2V5KTtcclxuICAgICAgICAgICAgICAgIGlmIChncm91cCB8fCBncm91cCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gXCI8YnIvPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsYWJlbCA9IHNlbGYuY29uZmlnLmdyb3Vwcy5sYWJlbDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGFiZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBsYWJlbCArIFwiOiBcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBncm91cFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLmh0bWwoaHRtbClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgZCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGxvdC5kb3QuY29sb3IpIHtcclxuICAgICAgICAgICAgZG90cy5zdHlsZShcImZpbGxcIiwgcGxvdC5kb3QuY29sb3IpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkb3RzLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVMZWdlbmQoKSB7XHJcblxyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuXHJcbiAgICAgICAgdmFyIHNjYWxlID0gcGxvdC5kb3QuY29sb3JDYXRlZ29yeTtcclxuICAgICAgICBpZighc2NhbGUuZG9tYWluKCkgfHwgc2NhbGUuZG9tYWluKCkubGVuZ3RoPDIpe1xyXG4gICAgICAgICAgICBwbG90LnNob3dMZWdlbmQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCFwbG90LnNob3dMZWdlbmQpe1xyXG4gICAgICAgICAgICBpZihwbG90LmxlZ2VuZCAmJiBwbG90LmxlZ2VuZC5jb250YWluZXIpe1xyXG4gICAgICAgICAgICAgICAgcGxvdC5sZWdlbmQuY29udGFpbmVyLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB2YXIgbGVnZW5kWCA9IHRoaXMucGxvdC53aWR0aCArIHRoaXMuY29uZmlnLmxlZ2VuZC5tYXJnaW47XHJcbiAgICAgICAgdmFyIGxlZ2VuZFkgPSB0aGlzLmNvbmZpZy5sZWdlbmQubWFyZ2luO1xyXG5cclxuICAgICAgICBwbG90LmxlZ2VuZCA9IG5ldyBMZWdlbmQodGhpcy5zdmcsIHRoaXMuc3ZnRywgc2NhbGUsIGxlZ2VuZFgsIGxlZ2VuZFkpO1xyXG5cclxuICAgICAgICB2YXIgbGVnZW5kTGluZWFyID0gcGxvdC5sZWdlbmQuY29sb3IoKVxyXG4gICAgICAgICAgICAuc2hhcGVXaWR0aCh0aGlzLmNvbmZpZy5sZWdlbmQuc2hhcGVXaWR0aClcclxuICAgICAgICAgICAgLm9yaWVudCgndmVydGljYWwnKVxyXG4gICAgICAgICAgICAuc2NhbGUoc2NhbGUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHBsb3QubGVnZW5kLmNvbnRhaW5lclxyXG4gICAgICAgICAgICAuY2FsbChsZWdlbmRMaW5lYXIpO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG59XHJcbiIsIi8qXG4gKiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9iZW5yYXNtdXNlbi8xMjYxOTc3XG4gKiBOQU1FXG4gKiBcbiAqIHN0YXRpc3RpY3MtZGlzdHJpYnV0aW9ucy5qcyAtIEphdmFTY3JpcHQgbGlicmFyeSBmb3IgY2FsY3VsYXRpbmdcbiAqICAgY3JpdGljYWwgdmFsdWVzIGFuZCB1cHBlciBwcm9iYWJpbGl0aWVzIG9mIGNvbW1vbiBzdGF0aXN0aWNhbFxuICogICBkaXN0cmlidXRpb25zXG4gKiBcbiAqIFNZTk9QU0lTXG4gKiBcbiAqIFxuICogICAvLyBDaGktc3F1YXJlZC1jcml0ICgyIGRlZ3JlZXMgb2YgZnJlZWRvbSwgOTV0aCBwZXJjZW50aWxlID0gMC4wNSBsZXZlbFxuICogICBjaGlzcXJkaXN0cigyLCAuMDUpXG4gKiAgIFxuICogICAvLyB1LWNyaXQgKDk1dGggcGVyY2VudGlsZSA9IDAuMDUgbGV2ZWwpXG4gKiAgIHVkaXN0ciguMDUpO1xuICogICBcbiAqICAgLy8gdC1jcml0ICgxIGRlZ3JlZSBvZiBmcmVlZG9tLCA5OS41dGggcGVyY2VudGlsZSA9IDAuMDA1IGxldmVsKSBcbiAqICAgdGRpc3RyKDEsLjAwNSk7XG4gKiAgIFxuICogICAvLyBGLWNyaXQgKDEgZGVncmVlIG9mIGZyZWVkb20gaW4gbnVtZXJhdG9yLCAzIGRlZ3JlZXMgb2YgZnJlZWRvbSBcbiAqICAgLy8gICAgICAgICBpbiBkZW5vbWluYXRvciwgOTl0aCBwZXJjZW50aWxlID0gMC4wMSBsZXZlbClcbiAqICAgZmRpc3RyKDEsMywuMDEpO1xuICogICBcbiAqICAgLy8gdXBwZXIgcHJvYmFiaWxpdHkgb2YgdGhlIHUgZGlzdHJpYnV0aW9uICh1ID0gLTAuODUpOiBRKHUpID0gMS1HKHUpXG4gKiAgIHVwcm9iKC0wLjg1KTtcbiAqICAgXG4gKiAgIC8vIHVwcGVyIHByb2JhYmlsaXR5IG9mIHRoZSBjaGktc3F1YXJlIGRpc3RyaWJ1dGlvblxuICogICAvLyAoMyBkZWdyZWVzIG9mIGZyZWVkb20sIGNoaS1zcXVhcmVkID0gNi4yNSk6IFEgPSAxLUdcbiAqICAgY2hpc3FycHJvYigzLDYuMjUpO1xuICogICBcbiAqICAgLy8gdXBwZXIgcHJvYmFiaWxpdHkgb2YgdGhlIHQgZGlzdHJpYnV0aW9uXG4gKiAgIC8vICgzIGRlZ3JlZXMgb2YgZnJlZWRvbSwgdCA9IDYuMjUxKTogUSA9IDEtR1xuICogICB0cHJvYigzLDYuMjUxKTtcbiAqICAgXG4gKiAgIC8vIHVwcGVyIHByb2JhYmlsaXR5IG9mIHRoZSBGIGRpc3RyaWJ1dGlvblxuICogICAvLyAoMyBkZWdyZWVzIG9mIGZyZWVkb20gaW4gbnVtZXJhdG9yLCA1IGRlZ3JlZXMgb2YgZnJlZWRvbSBpblxuICogICAvLyAgZGVub21pbmF0b3IsIEYgPSA2LjI1KTogUSA9IDEtR1xuICogICBmcHJvYigzLDUsLjYyNSk7XG4gKiBcbiAqIFxuICogIERFU0NSSVBUSU9OXG4gKiBcbiAqIFRoaXMgbGlicmFyeSBjYWxjdWxhdGVzIHBlcmNlbnRhZ2UgcG9pbnRzICg1IHNpZ25pZmljYW50IGRpZ2l0cykgb2YgdGhlIHVcbiAqIChzdGFuZGFyZCBub3JtYWwpIGRpc3RyaWJ1dGlvbiwgdGhlIHN0dWRlbnQncyB0IGRpc3RyaWJ1dGlvbiwgdGhlXG4gKiBjaGktc3F1YXJlIGRpc3RyaWJ1dGlvbiBhbmQgdGhlIEYgZGlzdHJpYnV0aW9uLiBJdCBjYW4gYWxzbyBjYWxjdWxhdGUgdGhlXG4gKiB1cHBlciBwcm9iYWJpbGl0eSAoNSBzaWduaWZpY2FudCBkaWdpdHMpIG9mIHRoZSB1IChzdGFuZGFyZCBub3JtYWwpLCB0aGVcbiAqIGNoaS1zcXVhcmUsIHRoZSB0IGFuZCB0aGUgRiBkaXN0cmlidXRpb24uXG4gKiBcbiAqIFRoZXNlIGNyaXRpY2FsIHZhbHVlcyBhcmUgbmVlZGVkIHRvIHBlcmZvcm0gc3RhdGlzdGljYWwgdGVzdHMsIGxpa2UgdGhlIHVcbiAqIHRlc3QsIHRoZSB0IHRlc3QsIHRoZSBGIHRlc3QgYW5kIHRoZSBjaGktc3F1YXJlZCB0ZXN0LCBhbmQgdG8gY2FsY3VsYXRlXG4gKiBjb25maWRlbmNlIGludGVydmFscy5cbiAqIFxuICogSWYgeW91IGFyZSBpbnRlcmVzdGVkIGluIG1vcmUgcHJlY2lzZSBhbGdvcml0aG1zIHlvdSBjb3VsZCBsb29rIGF0OlxuICogICBTdGF0TGliOiBodHRwOi8vbGliLnN0YXQuY211LmVkdS9hcHN0YXQvIDsgXG4gKiAgIEFwcGxpZWQgU3RhdGlzdGljcyBBbGdvcml0aG1zIGJ5IEdyaWZmaXRocywgUC4gYW5kIEhpbGwsIEkuRC5cbiAqICAgLCBFbGxpcyBIb3J3b29kOiBDaGljaGVzdGVyICgxOTg1KVxuICogXG4gKiBCVUdTIFxuICogXG4gKiBUaGlzIHBvcnQgd2FzIHByb2R1Y2VkIGZyb20gdGhlIFBlcmwgbW9kdWxlIFN0YXRpc3RpY3M6OkRpc3RyaWJ1dGlvbnNcbiAqIHRoYXQgaGFzIGhhZCBubyBidWcgcmVwb3J0cyBpbiBzZXZlcmFsIHllYXJzLiAgSWYgeW91IGZpbmQgYSBidWcgdGhlblxuICogcGxlYXNlIGRvdWJsZS1jaGVjayB0aGF0IEphdmFTY3JpcHQgZG9lcyBub3QgdGhpbmcgdGhlIG51bWJlcnMgeW91IGFyZVxuICogcGFzc2luZyBpbiBhcmUgc3RyaW5ncy4gIChZb3UgY2FuIHN1YnRyYWN0IDAgZnJvbSB0aGVtIGFzIHlvdSBwYXNzIHRoZW1cbiAqIGluIHNvIHRoYXQgXCI1XCIgaXMgcHJvcGVybHkgdW5kZXJzdG9vZCB0byBiZSA1LikgIElmIHlvdSBoYXZlIHBhc3NlZCBpbiBhXG4gKiBudW1iZXIgdGhlbiBwbGVhc2UgY29udGFjdCB0aGUgYXV0aG9yXG4gKiBcbiAqIEFVVEhPUlxuICogXG4gKiBCZW4gVGlsbHkgPGJ0aWxseUBnbWFpbC5jb20+XG4gKiBcbiAqIE9yaWdpbmwgUGVybCB2ZXJzaW9uIGJ5IE1pY2hhZWwgS29zcGFjaCA8bWlrZS5wZXJsQGdteC5hdD5cbiAqIFxuICogTmljZSBmb3JtYXRpbmcsIHNpbXBsaWZpY2F0aW9uIGFuZCBidWcgcmVwYWlyIGJ5IE1hdHRoaWFzIFRyYXV0bmVyIEtyb21hbm5cbiAqIDxtdGtAaWQuY2JzLmRrPlxuICogXG4gKiBDT1BZUklHSFQgXG4gKiBcbiAqIENvcHlyaWdodCAyMDA4IEJlbiBUaWxseS5cbiAqIFxuICogVGhpcyBsaWJyYXJ5IGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXRcbiAqIHVuZGVyIHRoZSBzYW1lIHRlcm1zIGFzIFBlcmwgaXRzZWxmLiAgVGhpcyBtZWFucyB1bmRlciBlaXRoZXIgdGhlIFBlcmxcbiAqIEFydGlzdGljIExpY2Vuc2Ugb3IgdGhlIEdQTCB2MSBvciBsYXRlci5cbiAqL1xuXG52YXIgU0lHTklGSUNBTlQgPSA1OyAvLyBudW1iZXIgb2Ygc2lnbmlmaWNhbnQgZGlnaXRzIHRvIGJlIHJldHVybmVkXG5cbmZ1bmN0aW9uIGNoaXNxcmRpc3RyICgkbiwgJHApIHtcblx0aWYgKCRuIDw9IDAgfHwgTWF0aC5hYnMoJG4pIC0gTWF0aC5hYnMoaW50ZWdlcigkbikpICE9IDApIHtcblx0XHR0aHJvdyhcIkludmFsaWQgbjogJG5cXG5cIik7IC8qIGRlZ3JlZSBvZiBmcmVlZG9tICovXG5cdH1cblx0aWYgKCRwIDw9IDAgfHwgJHAgPiAxKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIHA6ICRwXFxuXCIpOyBcblx0fVxuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3ViY2hpc3FyKCRuLTAsICRwLTApKTtcbn1cblxuZnVuY3Rpb24gdWRpc3RyICgkcCkge1xuXHRpZiAoJHAgPiAxIHx8ICRwIDw9IDApIHtcblx0XHR0aHJvdyhcIkludmFsaWQgcDogJHBcXG5cIik7XG5cdH1cblx0cmV0dXJuIHByZWNpc2lvbl9zdHJpbmcoX3N1YnUoJHAtMCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGRpc3RyICgkbiwgJHApIHtcblx0aWYgKCRuIDw9IDAgfHwgTWF0aC5hYnMoJG4pIC0gTWF0aC5hYnMoaW50ZWdlcigkbikpICE9IDApIHtcblx0XHR0aHJvdyhcIkludmFsaWQgbjogJG5cXG5cIik7XG5cdH1cblx0aWYgKCRwIDw9IDAgfHwgJHAgPj0gMSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBwOiAkcFxcblwiKTtcblx0fVxuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3VidCgkbi0wLCAkcC0wKSk7XG59XG5cbmZ1bmN0aW9uIGZkaXN0ciAoJG4sICRtLCAkcCkge1xuXHRpZiAoKCRuPD0wKSB8fCAoKE1hdGguYWJzKCRuKS0oTWF0aC5hYnMoaW50ZWdlcigkbikpKSkhPTApKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG46ICRuXFxuXCIpOyAvKiBmaXJzdCBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9XG5cdGlmICgoJG08PTApIHx8ICgoTWF0aC5hYnMoJG0pLShNYXRoLmFicyhpbnRlZ2VyKCRtKSkpKSE9MCkpIHtcblx0XHR0aHJvdyhcIkludmFsaWQgbTogJG1cXG5cIik7IC8qIHNlY29uZCBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9XG5cdGlmICgoJHA8PTApIHx8ICgkcD4xKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBwOiAkcFxcblwiKTtcblx0fVxuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3ViZigkbi0wLCAkbS0wLCAkcC0wKSk7XG59XG5cbmZ1bmN0aW9uIHVwcm9iICgkeCkge1xuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3VidXByb2IoJHgtMCkpO1xufVxuXG5mdW5jdGlvbiBjaGlzcXJwcm9iICgkbiwkeCkge1xuXHRpZiAoKCRuIDw9IDApIHx8ICgoTWF0aC5hYnMoJG4pIC0gKE1hdGguYWJzKGludGVnZXIoJG4pKSkpICE9IDApKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG46ICRuXFxuXCIpOyAvKiBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9XG5cdHJldHVybiBwcmVjaXNpb25fc3RyaW5nKF9zdWJjaGlzcXJwcm9iKCRuLTAsICR4LTApKTtcbn1cblxuZnVuY3Rpb24gdHByb2IgKCRuLCAkeCkge1xuXHRpZiAoKCRuIDw9IDApIHx8ICgoTWF0aC5hYnMoJG4pIC0gTWF0aC5hYnMoaW50ZWdlcigkbikpKSAhPTApKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG46ICRuXFxuXCIpOyAvKiBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9XG5cdHJldHVybiBwcmVjaXNpb25fc3RyaW5nKF9zdWJ0cHJvYigkbi0wLCAkeC0wKSk7XG59XG5cbmZ1bmN0aW9uIGZwcm9iICgkbiwgJG0sICR4KSB7XG5cdGlmICgoJG48PTApIHx8ICgoTWF0aC5hYnMoJG4pLShNYXRoLmFicyhpbnRlZ2VyKCRuKSkpKSE9MCkpIHtcblx0XHR0aHJvdyhcIkludmFsaWQgbjogJG5cXG5cIik7IC8qIGZpcnN0IGRlZ3JlZSBvZiBmcmVlZG9tICovXG5cdH1cblx0aWYgKCgkbTw9MCkgfHwgKChNYXRoLmFicygkbSktKE1hdGguYWJzKGludGVnZXIoJG0pKSkpIT0wKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBtOiAkbVxcblwiKTsgLyogc2Vjb25kIGRlZ3JlZSBvZiBmcmVlZG9tICovXG5cdH0gXG5cdHJldHVybiBwcmVjaXNpb25fc3RyaW5nKF9zdWJmcHJvYigkbi0wLCAkbS0wLCAkeC0wKSk7XG59XG5cblxuZnVuY3Rpb24gX3N1YmZwcm9iICgkbiwgJG0sICR4KSB7XG5cdHZhciAkcDtcblxuXHRpZiAoJHg8PTApIHtcblx0XHQkcD0xO1xuXHR9IGVsc2UgaWYgKCRtICUgMiA9PSAwKSB7XG5cdFx0dmFyICR6ID0gJG0gLyAoJG0gKyAkbiAqICR4KTtcblx0XHR2YXIgJGEgPSAxO1xuXHRcdGZvciAodmFyICRpID0gJG0gLSAyOyAkaSA+PSAyOyAkaSAtPSAyKSB7XG5cdFx0XHQkYSA9IDEgKyAoJG4gKyAkaSAtIDIpIC8gJGkgKiAkeiAqICRhO1xuXHRcdH1cblx0XHQkcCA9IDEgLSBNYXRoLnBvdygoMSAtICR6KSwgKCRuIC8gMikgKiAkYSk7XG5cdH0gZWxzZSBpZiAoJG4gJSAyID09IDApIHtcblx0XHR2YXIgJHogPSAkbiAqICR4IC8gKCRtICsgJG4gKiAkeCk7XG5cdFx0dmFyICRhID0gMTtcblx0XHRmb3IgKHZhciAkaSA9ICRuIC0gMjsgJGkgPj0gMjsgJGkgLT0gMikge1xuXHRcdFx0JGEgPSAxICsgKCRtICsgJGkgLSAyKSAvICRpICogJHogKiAkYTtcblx0XHR9XG5cdFx0JHAgPSBNYXRoLnBvdygoMSAtICR6KSwgKCRtIC8gMikpICogJGE7XG5cdH0gZWxzZSB7XG5cdFx0dmFyICR5ID0gTWF0aC5hdGFuMihNYXRoLnNxcnQoJG4gKiAkeCAvICRtKSwgMSk7XG5cdFx0dmFyICR6ID0gTWF0aC5wb3coTWF0aC5zaW4oJHkpLCAyKTtcblx0XHR2YXIgJGEgPSAoJG4gPT0gMSkgPyAwIDogMTtcblx0XHRmb3IgKHZhciAkaSA9ICRuIC0gMjsgJGkgPj0gMzsgJGkgLT0gMikge1xuXHRcdFx0JGEgPSAxICsgKCRtICsgJGkgLSAyKSAvICRpICogJHogKiAkYTtcblx0XHR9IFxuXHRcdHZhciAkYiA9IE1hdGguUEk7XG5cdFx0Zm9yICh2YXIgJGkgPSAyOyAkaSA8PSAkbSAtIDE7ICRpICs9IDIpIHtcblx0XHRcdCRiICo9ICgkaSAtIDEpIC8gJGk7XG5cdFx0fVxuXHRcdHZhciAkcDEgPSAyIC8gJGIgKiBNYXRoLnNpbigkeSkgKiBNYXRoLnBvdyhNYXRoLmNvcygkeSksICRtKSAqICRhO1xuXG5cdFx0JHogPSBNYXRoLnBvdyhNYXRoLmNvcygkeSksIDIpO1xuXHRcdCRhID0gKCRtID09IDEpID8gMCA6IDE7XG5cdFx0Zm9yICh2YXIgJGkgPSAkbS0yOyAkaSA+PSAzOyAkaSAtPSAyKSB7XG5cdFx0XHQkYSA9IDEgKyAoJGkgLSAxKSAvICRpICogJHogKiAkYTtcblx0XHR9XG5cdFx0JHAgPSBtYXgoMCwgJHAxICsgMSAtIDIgKiAkeSAvIE1hdGguUElcblx0XHRcdC0gMiAvIE1hdGguUEkgKiBNYXRoLnNpbigkeSkgKiBNYXRoLmNvcygkeSkgKiAkYSk7XG5cdH1cblx0cmV0dXJuICRwO1xufVxuXG5cbmZ1bmN0aW9uIF9zdWJjaGlzcXJwcm9iICgkbiwkeCkge1xuXHR2YXIgJHA7XG5cblx0aWYgKCR4IDw9IDApIHtcblx0XHQkcCA9IDE7XG5cdH0gZWxzZSBpZiAoJG4gPiAxMDApIHtcblx0XHQkcCA9IF9zdWJ1cHJvYigoTWF0aC5wb3coKCR4IC8gJG4pLCAxLzMpXG5cdFx0XHRcdC0gKDEgLSAyLzkvJG4pKSAvIE1hdGguc3FydCgyLzkvJG4pKTtcblx0fSBlbHNlIGlmICgkeCA+IDQwMCkge1xuXHRcdCRwID0gMDtcblx0fSBlbHNlIHsgICBcblx0XHR2YXIgJGE7XG4gICAgICAgICAgICAgICAgdmFyICRpO1xuICAgICAgICAgICAgICAgIHZhciAkaTE7XG5cdFx0aWYgKCgkbiAlIDIpICE9IDApIHtcblx0XHRcdCRwID0gMiAqIF9zdWJ1cHJvYihNYXRoLnNxcnQoJHgpKTtcblx0XHRcdCRhID0gTWF0aC5zcXJ0KDIvTWF0aC5QSSkgKiBNYXRoLmV4cCgtJHgvMikgLyBNYXRoLnNxcnQoJHgpO1xuXHRcdFx0JGkxID0gMTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHAgPSAkYSA9IE1hdGguZXhwKC0keC8yKTtcblx0XHRcdCRpMSA9IDI7XG5cdFx0fVxuXG5cdFx0Zm9yICgkaSA9ICRpMTsgJGkgPD0gKCRuLTIpOyAkaSArPSAyKSB7XG5cdFx0XHQkYSAqPSAkeCAvICRpO1xuXHRcdFx0JHAgKz0gJGE7XG5cdFx0fVxuXHR9XG5cdHJldHVybiAkcDtcbn1cblxuZnVuY3Rpb24gX3N1YnUgKCRwKSB7XG5cdHZhciAkeSA9IC1NYXRoLmxvZyg0ICogJHAgKiAoMSAtICRwKSk7XG5cdHZhciAkeCA9IE1hdGguc3FydChcblx0XHQkeSAqICgxLjU3MDc5NjI4OFxuXHRcdCAgKyAkeSAqICguMDM3MDY5ODc5MDZcblx0XHQgIFx0KyAkeSAqICgtLjgzNjQzNTM1ODlFLTNcblx0XHRcdCAgKyAkeSAqKC0uMjI1MDk0NzE3NkUtM1xuXHRcdFx0ICBcdCsgJHkgKiAoLjY4NDEyMTgyOTlFLTVcblx0XHRcdFx0ICArICR5ICogKDAuNTgyNDIzODUxNUUtNVxuXHRcdFx0XHRcdCsgJHkgKiAoLS4xMDQ1Mjc0OTdFLTVcblx0XHRcdFx0XHQgICsgJHkgKiAoLjgzNjA5MzcwMTdFLTdcblx0XHRcdFx0XHRcdCsgJHkgKiAoLS4zMjMxMDgxMjc3RS04XG5cdFx0XHRcdFx0XHQgICsgJHkgKiAoLjM2NTc3NjMwMzZFLTEwXG5cdFx0XHRcdFx0XHRcdCsgJHkgKi42OTM2MjMzOTgyRS0xMikpKSkpKSkpKSkpO1xuXHRpZiAoJHA+LjUpXG4gICAgICAgICAgICAgICAgJHggPSAtJHg7XG5cdHJldHVybiAkeDtcbn1cblxuZnVuY3Rpb24gX3N1YnVwcm9iICgkeCkge1xuXHR2YXIgJHAgPSAwOyAvKiBpZiAoJGFic3ggPiAxMDApICovXG5cdHZhciAkYWJzeCA9IE1hdGguYWJzKCR4KTtcblxuXHRpZiAoJGFic3ggPCAxLjkpIHtcblx0XHQkcCA9IE1hdGgucG93KCgxICtcblx0XHRcdCRhYnN4ICogKC4wNDk4NjczNDdcblx0XHRcdCAgKyAkYWJzeCAqICguMDIxMTQxMDA2MVxuXHRcdFx0ICBcdCsgJGFic3ggKiAoLjAwMzI3NzYyNjNcblx0XHRcdFx0ICArICRhYnN4ICogKC4wMDAwMzgwMDM2XG5cdFx0XHRcdFx0KyAkYWJzeCAqICguMDAwMDQ4ODkwNlxuXHRcdFx0XHRcdCAgKyAkYWJzeCAqIC4wMDAwMDUzODMpKSkpKSksIC0xNikvMjtcblx0fSBlbHNlIGlmICgkYWJzeCA8PSAxMDApIHtcblx0XHRmb3IgKHZhciAkaSA9IDE4OyAkaSA+PSAxOyAkaS0tKSB7XG5cdFx0XHQkcCA9ICRpIC8gKCRhYnN4ICsgJHApO1xuXHRcdH1cblx0XHQkcCA9IE1hdGguZXhwKC0uNSAqICRhYnN4ICogJGFic3gpIFxuXHRcdFx0LyBNYXRoLnNxcnQoMiAqIE1hdGguUEkpIC8gKCRhYnN4ICsgJHApO1xuXHR9XG5cblx0aWYgKCR4PDApXG4gICAgICAgIFx0JHAgPSAxIC0gJHA7XG5cdHJldHVybiAkcDtcbn1cblxuICAgXG5mdW5jdGlvbiBfc3VidCAoJG4sICRwKSB7XG5cblx0aWYgKCRwID49IDEgfHwgJHAgPD0gMCkge1xuXHRcdHRocm93KFwiSW52YWxpZCBwOiAkcFxcblwiKTtcblx0fVxuXG5cdGlmICgkcCA9PSAwLjUpIHtcblx0XHRyZXR1cm4gMDtcblx0fSBlbHNlIGlmICgkcCA8IDAuNSkge1xuXHRcdHJldHVybiAtIF9zdWJ0KCRuLCAxIC0gJHApO1xuXHR9XG5cblx0dmFyICR1ID0gX3N1YnUoJHApO1xuXHR2YXIgJHUyID0gTWF0aC5wb3coJHUsIDIpO1xuXG5cdHZhciAkYSA9ICgkdTIgKyAxKSAvIDQ7XG5cdHZhciAkYiA9ICgoNSAqICR1MiArIDE2KSAqICR1MiArIDMpIC8gOTY7XG5cdHZhciAkYyA9ICgoKDMgKiAkdTIgKyAxOSkgKiAkdTIgKyAxNykgKiAkdTIgLSAxNSkgLyAzODQ7XG5cdHZhciAkZCA9ICgoKCg3OSAqICR1MiArIDc3NikgKiAkdTIgKyAxNDgyKSAqICR1MiAtIDE5MjApICogJHUyIC0gOTQ1KSBcblx0XHRcdFx0LyA5MjE2MDtcblx0dmFyICRlID0gKCgoKCgyNyAqICR1MiArIDMzOSkgKiAkdTIgKyA5MzApICogJHUyIC0gMTc4MikgKiAkdTIgLSA3NjUpICogJHUyXG5cdFx0XHQrIDE3OTU1KSAvIDM2ODY0MDtcblxuXHR2YXIgJHggPSAkdSAqICgxICsgKCRhICsgKCRiICsgKCRjICsgKCRkICsgJGUgLyAkbikgLyAkbikgLyAkbikgLyAkbikgLyAkbik7XG5cblx0aWYgKCRuIDw9IE1hdGgucG93KGxvZzEwKCRwKSwgMikgKyAzKSB7XG5cdFx0dmFyICRyb3VuZDtcblx0XHRkbyB7IFxuXHRcdFx0dmFyICRwMSA9IF9zdWJ0cHJvYigkbiwgJHgpO1xuXHRcdFx0dmFyICRuMSA9ICRuICsgMTtcblx0XHRcdHZhciAkZGVsdGEgPSAoJHAxIC0gJHApIFxuXHRcdFx0XHQvIE1hdGguZXhwKCgkbjEgKiBNYXRoLmxvZygkbjEgLyAoJG4gKyAkeCAqICR4KSkgXG5cdFx0XHRcdFx0KyBNYXRoLmxvZygkbi8kbjEvMi9NYXRoLlBJKSAtIDEgXG5cdFx0XHRcdFx0KyAoMS8kbjEgLSAxLyRuKSAvIDYpIC8gMik7XG5cdFx0XHQkeCArPSAkZGVsdGE7XG5cdFx0XHQkcm91bmQgPSByb3VuZF90b19wcmVjaXNpb24oJGRlbHRhLCBNYXRoLmFicyhpbnRlZ2VyKGxvZzEwKE1hdGguYWJzKCR4KSktNCkpKTtcblx0XHR9IHdoaWxlICgoJHgpICYmICgkcm91bmQgIT0gMCkpO1xuXHR9XG5cdHJldHVybiAkeDtcbn1cblxuZnVuY3Rpb24gX3N1YnRwcm9iICgkbiwgJHgpIHtcblxuXHR2YXIgJGE7XG4gICAgICAgIHZhciAkYjtcblx0dmFyICR3ID0gTWF0aC5hdGFuMigkeCAvIE1hdGguc3FydCgkbiksIDEpO1xuXHR2YXIgJHogPSBNYXRoLnBvdyhNYXRoLmNvcygkdyksIDIpO1xuXHR2YXIgJHkgPSAxO1xuXG5cdGZvciAodmFyICRpID0gJG4tMjsgJGkgPj0gMjsgJGkgLT0gMikge1xuXHRcdCR5ID0gMSArICgkaS0xKSAvICRpICogJHogKiAkeTtcblx0fSBcblxuXHRpZiAoJG4gJSAyID09IDApIHtcblx0XHQkYSA9IE1hdGguc2luKCR3KS8yO1xuXHRcdCRiID0gLjU7XG5cdH0gZWxzZSB7XG5cdFx0JGEgPSAoJG4gPT0gMSkgPyAwIDogTWF0aC5zaW4oJHcpKk1hdGguY29zKCR3KS9NYXRoLlBJO1xuXHRcdCRiPSAuNSArICR3L01hdGguUEk7XG5cdH1cblx0cmV0dXJuIG1heCgwLCAxIC0gJGIgLSAkYSAqICR5KTtcbn1cblxuZnVuY3Rpb24gX3N1YmYgKCRuLCAkbSwgJHApIHtcblx0dmFyICR4O1xuXG5cdGlmICgkcCA+PSAxIHx8ICRwIDw9IDApIHtcblx0XHR0aHJvdyhcIkludmFsaWQgcDogJHBcXG5cIik7XG5cdH1cblxuXHRpZiAoJHAgPT0gMSkge1xuXHRcdCR4ID0gMDtcblx0fSBlbHNlIGlmICgkbSA9PSAxKSB7XG5cdFx0JHggPSAxIC8gTWF0aC5wb3coX3N1YnQoJG4sIDAuNSAtICRwIC8gMiksIDIpO1xuXHR9IGVsc2UgaWYgKCRuID09IDEpIHtcblx0XHQkeCA9IE1hdGgucG93KF9zdWJ0KCRtLCAkcC8yKSwgMik7XG5cdH0gZWxzZSBpZiAoJG0gPT0gMikge1xuXHRcdHZhciAkdSA9IF9zdWJjaGlzcXIoJG0sIDEgLSAkcCk7XG5cdFx0dmFyICRhID0gJG0gLSAyO1xuXHRcdCR4ID0gMSAvICgkdSAvICRtICogKDEgK1xuXHRcdFx0KCgkdSAtICRhKSAvIDIgK1xuXHRcdFx0XHQoKCg0ICogJHUgLSAxMSAqICRhKSAqICR1ICsgJGEgKiAoNyAqICRtIC0gMTApKSAvIDI0ICtcblx0XHRcdFx0XHQoKCgyICogJHUgLSAxMCAqICRhKSAqICR1ICsgJGEgKiAoMTcgKiAkbSAtIDI2KSkgKiAkdVxuXHRcdFx0XHRcdFx0LSAkYSAqICRhICogKDkgKiAkbSAtIDYpXG5cdFx0XHRcdFx0KS80OC8kblxuXHRcdFx0XHQpLyRuXG5cdFx0XHQpLyRuKSk7XG5cdH0gZWxzZSBpZiAoJG4gPiAkbSkge1xuXHRcdCR4ID0gMSAvIF9zdWJmMigkbSwgJG4sIDEgLSAkcClcblx0fSBlbHNlIHtcblx0XHQkeCA9IF9zdWJmMigkbiwgJG0sICRwKVxuXHR9XG5cdHJldHVybiAkeDtcbn1cblxuZnVuY3Rpb24gX3N1YmYyICgkbiwgJG0sICRwKSB7XG5cdHZhciAkdSA9IF9zdWJjaGlzcXIoJG4sICRwKTtcblx0dmFyICRuMiA9ICRuIC0gMjtcblx0dmFyICR4ID0gJHUgLyAkbiAqIFxuXHRcdCgxICsgXG5cdFx0XHQoKCR1IC0gJG4yKSAvIDIgKyBcblx0XHRcdFx0KCgoNCAqICR1IC0gMTEgKiAkbjIpICogJHUgKyAkbjIgKiAoNyAqICRuIC0gMTApKSAvIDI0ICsgXG5cdFx0XHRcdFx0KCgoMiAqICR1IC0gMTAgKiAkbjIpICogJHUgKyAkbjIgKiAoMTcgKiAkbiAtIDI2KSkgKiAkdSBcblx0XHRcdFx0XHRcdC0gJG4yICogJG4yICogKDkgKiAkbiAtIDYpKSAvIDQ4IC8gJG0pIC8gJG0pIC8gJG0pO1xuXHR2YXIgJGRlbHRhO1xuXHRkbyB7XG5cdFx0dmFyICR6ID0gTWF0aC5leHAoXG5cdFx0XHQoKCRuKyRtKSAqIE1hdGgubG9nKCgkbiskbSkgLyAoJG4gKiAkeCArICRtKSkgXG5cdFx0XHRcdCsgKCRuIC0gMikgKiBNYXRoLmxvZygkeClcblx0XHRcdFx0KyBNYXRoLmxvZygkbiAqICRtIC8gKCRuKyRtKSlcblx0XHRcdFx0LSBNYXRoLmxvZyg0ICogTWF0aC5QSSlcblx0XHRcdFx0LSAoMS8kbiAgKyAxLyRtIC0gMS8oJG4rJG0pKS82XG5cdFx0XHQpLzIpO1xuXHRcdCRkZWx0YSA9IChfc3ViZnByb2IoJG4sICRtLCAkeCkgLSAkcCkgLyAkejtcblx0XHQkeCArPSAkZGVsdGE7XG5cdH0gd2hpbGUgKE1hdGguYWJzKCRkZWx0YSk+M2UtNCk7XG5cdHJldHVybiAkeDtcbn1cblxuZnVuY3Rpb24gX3N1YmNoaXNxciAoJG4sICRwKSB7XG5cdHZhciAkeDtcblxuXHRpZiAoKCRwID4gMSkgfHwgKCRwIDw9IDApKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIHA6ICRwXFxuXCIpO1xuXHR9IGVsc2UgaWYgKCRwID09IDEpe1xuXHRcdCR4ID0gMDtcblx0fSBlbHNlIGlmICgkbiA9PSAxKSB7XG5cdFx0JHggPSBNYXRoLnBvdyhfc3VidSgkcCAvIDIpLCAyKTtcblx0fSBlbHNlIGlmICgkbiA9PSAyKSB7XG5cdFx0JHggPSAtMiAqIE1hdGgubG9nKCRwKTtcblx0fSBlbHNlIHtcblx0XHR2YXIgJHUgPSBfc3VidSgkcCk7XG5cdFx0dmFyICR1MiA9ICR1ICogJHU7XG5cblx0XHQkeCA9IG1heCgwLCAkbiArIE1hdGguc3FydCgyICogJG4pICogJHUgXG5cdFx0XHQrIDIvMyAqICgkdTIgLSAxKVxuXHRcdFx0KyAkdSAqICgkdTIgLSA3KSAvIDkgLyBNYXRoLnNxcnQoMiAqICRuKVxuXHRcdFx0LSAyLzQwNSAvICRuICogKCR1MiAqICgzICokdTIgKyA3KSAtIDE2KSk7XG5cblx0XHRpZiAoJG4gPD0gMTAwKSB7XG5cdFx0XHR2YXIgJHgwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRwMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkejtcblx0XHRcdGRvIHtcblx0XHRcdFx0JHgwID0gJHg7XG5cdFx0XHRcdGlmICgkeCA8IDApIHtcblx0XHRcdFx0XHQkcDEgPSAxO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCRuPjEwMCkge1xuXHRcdFx0XHRcdCRwMSA9IF9zdWJ1cHJvYigoTWF0aC5wb3coKCR4IC8gJG4pLCAoMS8zKSkgLSAoMSAtIDIvOS8kbikpXG5cdFx0XHRcdFx0XHQvIE1hdGguc3FydCgyLzkvJG4pKTtcblx0XHRcdFx0fSBlbHNlIGlmICgkeD40MDApIHtcblx0XHRcdFx0XHQkcDEgPSAwO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhciAkaTBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgJGE7XG5cdFx0XHRcdFx0aWYgKCgkbiAlIDIpICE9IDApIHtcblx0XHRcdFx0XHRcdCRwMSA9IDIgKiBfc3VidXByb2IoTWF0aC5zcXJ0KCR4KSk7XG5cdFx0XHRcdFx0XHQkYSA9IE1hdGguc3FydCgyL01hdGguUEkpICogTWF0aC5leHAoLSR4LzIpIC8gTWF0aC5zcXJ0KCR4KTtcblx0XHRcdFx0XHRcdCRpMCA9IDE7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRwMSA9ICRhID0gTWF0aC5leHAoLSR4LzIpO1xuXHRcdFx0XHRcdFx0JGkwID0gMjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRmb3IgKHZhciAkaSA9ICRpMDsgJGkgPD0gJG4tMjsgJGkgKz0gMikge1xuXHRcdFx0XHRcdFx0JGEgKj0gJHggLyAkaTtcblx0XHRcdFx0XHRcdCRwMSArPSAkYTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0JHogPSBNYXRoLmV4cCgoKCRuLTEpICogTWF0aC5sb2coJHgvJG4pIC0gTWF0aC5sb2coNCpNYXRoLlBJKiR4KSBcblx0XHRcdFx0XHQrICRuIC0gJHggLSAxLyRuLzYpIC8gMik7XG5cdFx0XHRcdCR4ICs9ICgkcDEgLSAkcCkgLyAkejtcblx0XHRcdFx0JHggPSByb3VuZF90b19wcmVjaXNpb24oJHgsIDUpO1xuXHRcdFx0fSB3aGlsZSAoKCRuIDwgMzEpICYmIChNYXRoLmFicygkeDAgLSAkeCkgPiAxZS00KSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiAkeDtcbn1cblxuZnVuY3Rpb24gbG9nMTAgKCRuKSB7XG5cdHJldHVybiBNYXRoLmxvZygkbikgLyBNYXRoLmxvZygxMCk7XG59XG4gXG5mdW5jdGlvbiBtYXggKCkge1xuXHR2YXIgJG1heCA9IGFyZ3VtZW50c1swXTtcblx0Zm9yICh2YXIgJGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRtYXggPCBhcmd1bWVudHNbJGldKVxuICAgICAgICAgICAgICAgICAgICAgICAgJG1heCA9IGFyZ3VtZW50c1skaV07XG5cdH1cdFxuXHRyZXR1cm4gJG1heDtcbn1cblxuZnVuY3Rpb24gbWluICgpIHtcblx0dmFyICRtaW4gPSBhcmd1bWVudHNbMF07XG5cdGZvciAodmFyICRpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICgkbWluID4gYXJndW1lbnRzWyRpXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICRtaW4gPSBhcmd1bWVudHNbJGldO1xuXHR9XG5cdHJldHVybiAkbWluO1xufVxuXG5mdW5jdGlvbiBwcmVjaXNpb24gKCR4KSB7XG5cdHJldHVybiBNYXRoLmFicyhpbnRlZ2VyKGxvZzEwKE1hdGguYWJzKCR4KSkgLSBTSUdOSUZJQ0FOVCkpO1xufVxuXG5mdW5jdGlvbiBwcmVjaXNpb25fc3RyaW5nICgkeCkge1xuXHRpZiAoJHgpIHtcblx0XHRyZXR1cm4gcm91bmRfdG9fcHJlY2lzaW9uKCR4LCBwcmVjaXNpb24oJHgpKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gXCIwXCI7XG5cdH1cbn1cblxuZnVuY3Rpb24gcm91bmRfdG9fcHJlY2lzaW9uICgkeCwgJHApIHtcbiAgICAgICAgJHggPSAkeCAqIE1hdGgucG93KDEwLCAkcCk7XG4gICAgICAgICR4ID0gTWF0aC5yb3VuZCgkeCk7XG4gICAgICAgIHJldHVybiAkeCAvIE1hdGgucG93KDEwLCAkcCk7XG59XG5cbmZ1bmN0aW9uIGludGVnZXIgKCRpKSB7XG4gICAgICAgIGlmICgkaSA+IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoJGkpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbCgkaSk7XG59IiwiaW1wb3J0IHt0ZGlzdHJ9IGZyb20gXCIuL3N0YXRpc3RpY3MtZGlzdHJpYnV0aW9uc1wiXHJcblxyXG52YXIgc3UgPSBtb2R1bGUuZXhwb3J0cy5TdGF0aXN0aWNzVXRpbHMgPXt9O1xyXG5zdS5zYW1wbGVDb3JyZWxhdGlvbiA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL3NhbXBsZV9jb3JyZWxhdGlvbicpO1xyXG5zdS5saW5lYXJSZWdyZXNzaW9uID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvbGluZWFyX3JlZ3Jlc3Npb24nKTtcclxuc3UubGluZWFyUmVncmVzc2lvbkxpbmUgPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy9saW5lYXJfcmVncmVzc2lvbl9saW5lJyk7XHJcbnN1LmVycm9yRnVuY3Rpb24gPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy9lcnJvcl9mdW5jdGlvbicpO1xyXG5zdS5zdGFuZGFyZERldmlhdGlvbiA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL3N0YW5kYXJkX2RldmlhdGlvbicpO1xyXG5zdS5zYW1wbGVTdGFuZGFyZERldmlhdGlvbiA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL3NhbXBsZV9zdGFuZGFyZF9kZXZpYXRpb24nKTtcclxuc3UudmFyaWFuY2UgPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy92YXJpYW5jZScpO1xyXG5zdS5tZWFuID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvbWVhbicpO1xyXG5zdS56U2NvcmUgPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy96X3Njb3JlJyk7XHJcbnN1LnN0YW5kYXJkRXJyb3I9IGFyciA9PiBNYXRoLnNxcnQoc3UudmFyaWFuY2UoYXJyKS8oYXJyLmxlbmd0aC0xKSk7XHJcblxyXG5cclxuc3UudFZhbHVlPSAoZGVncmVlc09mRnJlZWRvbSwgY3JpdGljYWxQcm9iYWJpbGl0eSkgPT4geyAvL2FzIGluIGh0dHA6Ly9zdGF0dHJlay5jb20vb25saW5lLWNhbGN1bGF0b3IvdC1kaXN0cmlidXRpb24uYXNweFxyXG4gICAgcmV0dXJuIHRkaXN0cihkZWdyZWVzT2ZGcmVlZG9tLCBjcml0aWNhbFByb2JhYmlsaXR5KTtcclxufTsiLCJleHBvcnQgY2xhc3MgVXRpbHMge1xyXG4gICAgc3RhdGljIFNRUlRfMiA9IDEuNDE0MjEzNTYyMzc7XHJcbiAgICAvLyB1c2FnZSBleGFtcGxlIGRlZXBFeHRlbmQoe30sIG9iakEsIG9iakIpOyA9PiBzaG91bGQgd29yayBzaW1pbGFyIHRvICQuZXh0ZW5kKHRydWUsIHt9LCBvYmpBLCBvYmpCKTtcclxuICAgIHN0YXRpYyBkZWVwRXh0ZW5kKG91dCkge1xyXG5cclxuICAgICAgICB2YXIgdXRpbHMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBlbXB0eU91dCA9IHt9O1xyXG5cclxuXHJcbiAgICAgICAgaWYgKCFvdXQgJiYgYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgQXJyYXkuaXNBcnJheShhcmd1bWVudHNbMV0pKSB7XHJcbiAgICAgICAgICAgIG91dCA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvdXQgPSBvdXQgfHwge307XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGlmICghc291cmNlKVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkob3V0W2tleV0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlzT2JqZWN0ID0gdXRpbHMuaXNPYmplY3Qob3V0W2tleV0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNyY09iaiA9IHV0aWxzLmlzT2JqZWN0KHNvdXJjZVtrZXldKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNPYmplY3QgJiYgIWlzQXJyYXkgJiYgc3JjT2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMuZGVlcEV4dGVuZChvdXRba2V5XSwgc291cmNlW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRba2V5XSA9IHNvdXJjZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgbWVyZ2VEZWVwKHRhcmdldCwgc291cmNlKSB7XHJcbiAgICAgICAgbGV0IG91dHB1dCA9IE9iamVjdC5hc3NpZ24oe30sIHRhcmdldCk7XHJcbiAgICAgICAgaWYgKFV0aWxzLmlzT2JqZWN0Tm90QXJyYXkodGFyZ2V0KSAmJiBVdGlscy5pc09iamVjdE5vdEFycmF5KHNvdXJjZSkpIHtcclxuICAgICAgICAgICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoVXRpbHMuaXNPYmplY3ROb3RBcnJheShzb3VyY2Vba2V5XSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIShrZXkgaW4gdGFyZ2V0KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihvdXRwdXQsIHtba2V5XTogc291cmNlW2tleV19KTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFtrZXldID0gVXRpbHMubWVyZ2VEZWVwKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ob3V0cHV0LCB7W2tleV06IHNvdXJjZVtrZXldfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0cHV0O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjcm9zcyhhLCBiKSB7XHJcbiAgICAgICAgdmFyIGMgPSBbXSwgbiA9IGEubGVuZ3RoLCBtID0gYi5sZW5ndGgsIGksIGo7XHJcbiAgICAgICAgZm9yIChpID0gLTE7ICsraSA8IG47KSBmb3IgKGogPSAtMTsgKytqIDwgbTspIGMucHVzaCh7eDogYVtpXSwgaTogaSwgeTogYltqXSwgajogan0pO1xyXG4gICAgICAgIHJldHVybiBjO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgaW5mZXJWYXJpYWJsZXMoZGF0YSwgZ3JvdXBLZXksIGluY2x1ZGVHcm91cCkge1xyXG4gICAgICAgIHZhciByZXMgPSBbXTtcclxuICAgICAgICBpZiAoZGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdmFyIGQgPSBkYXRhWzBdO1xyXG4gICAgICAgICAgICBpZiAoZCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICByZXMgPSBkLm1hcChmdW5jdGlvbiAodiwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGQgPT09ICdvYmplY3QnKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkLmhhc093blByb3BlcnR5KHByb3ApKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2gocHJvcCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFpbmNsdWRlR3JvdXApIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gcmVzLmluZGV4T2YoZ3JvdXBLZXkpO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgcmVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgaXNPYmplY3ROb3RBcnJheShpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIChpdGVtICYmIHR5cGVvZiBpdGVtID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShpdGVtKSAmJiBpdGVtICE9PSBudWxsKTtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGlzT2JqZWN0KGEpIHtcclxuICAgICAgICByZXR1cm4gYSAhPT0gbnVsbCAmJiB0eXBlb2YgYSA9PT0gJ29iamVjdCc7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBpc051bWJlcihhKSB7XHJcbiAgICAgICAgcmV0dXJuICFpc05hTihhKSAmJiB0eXBlb2YgYSA9PT0gJ251bWJlcic7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBpc0Z1bmN0aW9uKGEpIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGEgPT09ICdmdW5jdGlvbic7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBpbnNlcnRPckFwcGVuZFNlbGVjdG9yKHBhcmVudCwgc2VsZWN0b3IsIG9wZXJhdGlvbiwgYmVmb3JlKSB7XHJcbiAgICAgICAgdmFyIHNlbGVjdG9yUGFydHMgPSBzZWxlY3Rvci5zcGxpdCgvKFtcXC5cXCNdKS8pO1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gcGFyZW50W29wZXJhdGlvbl0oc2VsZWN0b3JQYXJ0cy5zaGlmdCgpLCBiZWZvcmUpOy8vXCI6Zmlyc3QtY2hpbGRcIlxyXG4gICAgICAgIHdoaWxlIChzZWxlY3RvclBhcnRzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGVjdG9yTW9kaWZpZXIgPSBzZWxlY3RvclBhcnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxlY3Rvckl0ZW0gPSBzZWxlY3RvclBhcnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3Rvck1vZGlmaWVyID09PSBcIi5cIikge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQuY2xhc3NlZChzZWxlY3Rvckl0ZW0sIHRydWUpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNlbGVjdG9yTW9kaWZpZXIgPT09IFwiI1wiKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5hdHRyKCdpZCcsIHNlbGVjdG9ySXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGluc2VydFNlbGVjdG9yKHBhcmVudCwgc2VsZWN0b3IsIGJlZm9yZSkge1xyXG4gICAgICAgIHJldHVybiBVdGlscy5pbnNlcnRPckFwcGVuZFNlbGVjdG9yKHBhcmVudCwgc2VsZWN0b3IsIFwiaW5zZXJ0XCIsIGJlZm9yZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFwcGVuZFNlbGVjdG9yKHBhcmVudCwgc2VsZWN0b3IpIHtcclxuICAgICAgICByZXR1cm4gVXRpbHMuaW5zZXJ0T3JBcHBlbmRTZWxlY3RvcihwYXJlbnQsIHNlbGVjdG9yLCBcImFwcGVuZFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2VsZWN0T3JBcHBlbmQocGFyZW50LCBzZWxlY3RvciwgZWxlbWVudCkge1xyXG4gICAgICAgIHZhciBzZWxlY3Rpb24gPSBwYXJlbnQuc2VsZWN0KHNlbGVjdG9yKTtcclxuICAgICAgICBpZiAoc2VsZWN0aW9uLmVtcHR5KCkpIHtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJlbnQuYXBwZW5kKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBVdGlscy5hcHBlbmRTZWxlY3RvcihwYXJlbnQsIHNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzZWxlY3Rpb247XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBzZWxlY3RPckluc2VydChwYXJlbnQsIHNlbGVjdG9yLCBiZWZvcmUpIHtcclxuICAgICAgICB2YXIgc2VsZWN0aW9uID0gcGFyZW50LnNlbGVjdChzZWxlY3Rvcik7XHJcbiAgICAgICAgaWYgKHNlbGVjdGlvbi5lbXB0eSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBVdGlscy5pbnNlcnRTZWxlY3RvcihwYXJlbnQsIHNlbGVjdG9yLCBiZWZvcmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2VsZWN0aW9uO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgbGluZWFyR3JhZGllbnQoc3ZnLCBncmFkaWVudElkLCByYW5nZSwgeDEsIHkxLCB4MiwgeTIpIHtcclxuICAgICAgICB2YXIgZGVmcyA9IFV0aWxzLnNlbGVjdE9yQXBwZW5kKHN2ZywgXCJkZWZzXCIpO1xyXG4gICAgICAgIHZhciBsaW5lYXJHcmFkaWVudCA9IGRlZnMuYXBwZW5kKFwibGluZWFyR3JhZGllbnRcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBncmFkaWVudElkKTtcclxuXHJcbiAgICAgICAgbGluZWFyR3JhZGllbnRcclxuICAgICAgICAgICAgLmF0dHIoXCJ4MVwiLCB4MSArIFwiJVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInkxXCIsIHkxICsgXCIlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieDJcIiwgeDIgKyBcIiVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ5MlwiLCB5MiArIFwiJVwiKTtcclxuXHJcbiAgICAgICAgLy9BcHBlbmQgbXVsdGlwbGUgY29sb3Igc3RvcHMgYnkgdXNpbmcgRDMncyBkYXRhL2VudGVyIHN0ZXBcclxuICAgICAgICB2YXIgc3RvcHMgPSBsaW5lYXJHcmFkaWVudC5zZWxlY3RBbGwoXCJzdG9wXCIpXHJcbiAgICAgICAgICAgIC5kYXRhKHJhbmdlKTtcclxuXHJcbiAgICAgICAgc3RvcHMuZW50ZXIoKS5hcHBlbmQoXCJzdG9wXCIpO1xyXG5cclxuICAgICAgICBzdG9wcy5hdHRyKFwib2Zmc2V0XCIsIChkLCBpKSA9PiBpIC8gKHJhbmdlLmxlbmd0aCAtIDEpKVxyXG4gICAgICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgZCA9PiBkKTtcclxuXHJcbiAgICAgICAgc3RvcHMuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzYW5pdGl6ZUhlaWdodCA9IGZ1bmN0aW9uIChoZWlnaHQsIGNvbnRhaW5lcikge1xyXG4gICAgICAgIHJldHVybiAoaGVpZ2h0IHx8IHBhcnNlSW50KGNvbnRhaW5lci5zdHlsZSgnaGVpZ2h0JyksIDEwKSB8fCA0MDApO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgc2FuaXRpemVXaWR0aCA9IGZ1bmN0aW9uICh3aWR0aCwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgcmV0dXJuICh3aWR0aCB8fCBwYXJzZUludChjb250YWluZXIuc3R5bGUoJ3dpZHRoJyksIDEwKSB8fCA5NjApO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgYXZhaWxhYmxlSGVpZ2h0ID0gZnVuY3Rpb24gKGhlaWdodCwgY29udGFpbmVyLCBtYXJnaW4pIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5tYXgoMCwgVXRpbHMuc2FuaXRpemVIZWlnaHQoaGVpZ2h0LCBjb250YWluZXIpIC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b20pO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgYXZhaWxhYmxlV2lkdGggPSBmdW5jdGlvbiAod2lkdGgsIGNvbnRhaW5lciwgbWFyZ2luKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KDAsIFV0aWxzLnNhbml0aXplV2lkdGgod2lkdGgsIGNvbnRhaW5lcikgLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBndWlkKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIHM0KCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDAwMClcclxuICAgICAgICAgICAgICAgIC50b1N0cmluZygxNilcclxuICAgICAgICAgICAgICAgIC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gczQoKSArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArXHJcbiAgICAgICAgICAgIHM0KCkgKyAnLScgKyBzNCgpICsgczQoKSArIHM0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9wbGFjZXMgdGV4dFN0cmluZyBpbiB0ZXh0T2JqLCBhZGRzIGFuIGVsbGlwc2lzIGlmIHRleHQgY2FuJ3QgZml0IGluIHdpZHRoXHJcbiAgICBzdGF0aWMgcGxhY2VUZXh0V2l0aEVsbGlwc2lzKHRleHREM09iaiwgdGV4dFN0cmluZywgd2lkdGgpe1xyXG4gICAgICAgIHZhciB0ZXh0T2JqID0gdGV4dEQzT2JqLm5vZGUoKTtcclxuICAgICAgICB0ZXh0T2JqLnRleHRDb250ZW50PXRleHRTdHJpbmc7XHJcblxyXG4gICAgICAgIHZhciBtYXJnaW4gPSAwO1xyXG4gICAgICAgIHZhciBlbGxpcHNpc0xlbmd0aCA9IDk7XHJcbiAgICAgICAgLy9lbGxpcHNpcyBpcyBuZWVkZWRcclxuICAgICAgICBpZiAodGV4dE9iai5nZXRDb21wdXRlZFRleHRMZW5ndGgoKT53aWR0aCttYXJnaW4pe1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4PXRleHRTdHJpbmcubGVuZ3RoLTM7eD4wO3gtPTEpe1xyXG4gICAgICAgICAgICAgICAgaWYgKHRleHRPYmouZ2V0U3ViU3RyaW5nTGVuZ3RoKDAseCkrZWxsaXBzaXNMZW5ndGg8PXdpZHRoK21hcmdpbil7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dE9iai50ZXh0Q29udGVudD10ZXh0U3RyaW5nLnN1YnN0cmluZygwLHgpK1wiLi4uXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGV4dE9iai50ZXh0Q29udGVudD1cIi4uLlwiOyAvL2Nhbid0IHBsYWNlIGF0IGFsbFxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBwbGFjZVRleHRXaXRoRWxsaXBzaXNBbmRUb29sdGlwKHRleHREM09iaiwgdGV4dFN0cmluZywgd2lkdGgsIHRvb2x0aXApe1xyXG4gICAgICAgIHZhciBlbGxpcHNpc1BsYWNlZCA9IFV0aWxzLnBsYWNlVGV4dFdpdGhFbGxpcHNpcyh0ZXh0RDNPYmosIHRleHRTdHJpbmcsIHdpZHRoKTtcclxuICAgICAgICBpZihlbGxpcHNpc1BsYWNlZCAmJiB0b29sdGlwKXtcclxuICAgICAgICAgICAgdGV4dEQzT2JqLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICB0b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAuOSk7XHJcbiAgICAgICAgICAgICAgICB0b29sdGlwLmh0bWwodGV4dFN0cmluZylcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRleHREM09iai5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICB0b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0Rm9udFNpemUoZWxlbWVudCl7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoXCJmb250LXNpemVcIik7XHJcbiAgICB9XHJcbn1cclxuIl19
