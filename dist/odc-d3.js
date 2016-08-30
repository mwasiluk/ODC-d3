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
            fillMissing: false, // fiill missing values with nearest previous value
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

},{}]},{},[24])(24)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJib3dlcl9jb21wb25lbnRzXFxkMy1sZWdlbmRcXG5vLWV4dGVuZC5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxjb2xvci5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxsZWdlbmQuanMiLCJib3dlcl9jb21wb25lbnRzXFxkMy1sZWdlbmRcXHNyY1xcc2l6ZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxzeW1ib2wuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxlcnJvcl9mdW5jdGlvbi5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXGxpbmVhcl9yZWdyZXNzaW9uLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcbGluZWFyX3JlZ3Jlc3Npb25fbGluZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXG1lYW4uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfY29ycmVsYXRpb24uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfY292YXJpYW5jZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXHNhbXBsZV9zdGFuZGFyZF9kZXZpYXRpb24uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfdmFyaWFuY2UuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzdGFuZGFyZF9kZXZpYXRpb24uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzdW0uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzdW1fbnRoX3Bvd2VyX2RldmlhdGlvbnMuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFx2YXJpYW5jZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXHpfc2NvcmUuanMiLCJzcmNcXGNoYXJ0LmpzIiwic3JjXFxjb3JyZWxhdGlvbi1tYXRyaXguanMiLCJzcmNcXGQzLWV4dGVuc2lvbnMuanMiLCJzcmNcXGhlYXRtYXAtdGltZXNlcmllcy5qcyIsInNyY1xcaGVhdG1hcC5qcyIsInNyY1xcaW5kZXguanMiLCJzcmNcXGxlZ2VuZC5qcyIsInNyY1xccmVncmVzc2lvbi5qcyIsInNyY1xcc2NhdHRlcnBsb3QtbWF0cml4LmpzIiwic3JjXFxzY2F0dGVycGxvdC5qcyIsInNyY1xcc3RhdGlzdGljcy1kaXN0cmlidXRpb25zLmpzIiwic3JjXFxzdGF0aXN0aWNzLXV0aWxzLmpzIiwic3JjXFx1dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsT0FBTyxPQUFQLEdBQWlCO0FBQ2YsU0FBTyxRQUFRLGFBQVIsQ0FEUTtBQUVmLFFBQU0sUUFBUSxZQUFSLENBRlM7QUFHZixVQUFRLFFBQVEsY0FBUjtBQUhPLENBQWpCOzs7OztBQ0FBLElBQUksU0FBUyxRQUFRLFVBQVIsQ0FBYjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsWUFBVTs7QUFFekIsTUFBSSxRQUFRLEdBQUcsS0FBSCxDQUFTLE1BQVQsRUFBWjtBQUFBLE1BQ0UsUUFBUSxNQURWO0FBQUEsTUFFRSxhQUFhLEVBRmY7QUFBQSxNQUdFLGNBQWMsRUFIaEI7QUFBQSxNQUlFLGNBQWMsRUFKaEI7QUFBQSxNQUtFLGVBQWUsQ0FMakI7QUFBQSxNQU1FLFFBQVEsQ0FBQyxDQUFELENBTlY7QUFBQSxNQU9FLFNBQVMsRUFQWDtBQUFBLE1B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QVA7QUFDSCxDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIGNvbG9yOiByZXF1aXJlKCcuL3NyYy9jb2xvcicpLFxyXG4gIHNpemU6IHJlcXVpcmUoJy4vc3JjL3NpemUnKSxcclxuICBzeW1ib2w6IHJlcXVpcmUoJy4vc3JjL3N5bWJvbCcpXHJcbn07XHJcbiIsInZhciBoZWxwZXIgPSByZXF1aXJlKCcuL2xlZ2VuZCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xyXG5cclxuICB2YXIgc2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKSxcclxuICAgIHNoYXBlID0gXCJyZWN0XCIsXHJcbiAgICBzaGFwZVdpZHRoID0gMTUsXHJcbiAgICBzaGFwZUhlaWdodCA9IDE1LFxyXG4gICAgc2hhcGVSYWRpdXMgPSAxMCxcclxuICAgIHNoYXBlUGFkZGluZyA9IDIsXHJcbiAgICBjZWxscyA9IFs1XSxcclxuICAgIGxhYmVscyA9IFtdLFxyXG4gICAgY2xhc3NQcmVmaXggPSBcIlwiLFxyXG4gICAgdXNlQ2xhc3MgPSBmYWxzZSxcclxuICAgIHRpdGxlID0gXCJcIixcclxuICAgIGxhYmVsRm9ybWF0ID0gZDMuZm9ybWF0KFwiLjAxZlwiKSxcclxuICAgIGxhYmVsT2Zmc2V0ID0gMTAsXHJcbiAgICBsYWJlbEFsaWduID0gXCJtaWRkbGVcIixcclxuICAgIGxhYmVsRGVsaW1pdGVyID0gXCJ0b1wiLFxyXG4gICAgb3JpZW50ID0gXCJ2ZXJ0aWNhbFwiLFxyXG4gICAgYXNjZW5kaW5nID0gZmFsc2UsXHJcbiAgICBwYXRoLFxyXG4gICAgbGVnZW5kRGlzcGF0Y2hlciA9IGQzLmRpc3BhdGNoKFwiY2VsbG92ZXJcIiwgXCJjZWxsb3V0XCIsIFwiY2VsbGNsaWNrXCIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGxlZ2VuZChzdmcpe1xyXG5cclxuICAgICAgdmFyIHR5cGUgPSBoZWxwZXIuZDNfY2FsY1R5cGUoc2NhbGUsIGFzY2VuZGluZywgY2VsbHMsIGxhYmVscywgbGFiZWxGb3JtYXQsIGxhYmVsRGVsaW1pdGVyKSxcclxuICAgICAgICBsZWdlbmRHID0gc3ZnLnNlbGVjdEFsbCgnZycpLmRhdGEoW3NjYWxlXSk7XHJcblxyXG4gICAgICBsZWdlbmRHLmVudGVyKCkuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCBjbGFzc1ByZWZpeCArICdsZWdlbmRDZWxscycpO1xyXG5cclxuXHJcbiAgICAgIHZhciBjZWxsID0gbGVnZW5kRy5zZWxlY3RBbGwoXCIuXCIgKyBjbGFzc1ByZWZpeCArIFwiY2VsbFwiKS5kYXRhKHR5cGUuZGF0YSksXHJcbiAgICAgICAgY2VsbEVudGVyID0gY2VsbC5lbnRlcigpLmFwcGVuZChcImdcIiwgXCIuY2VsbFwiKS5hdHRyKFwiY2xhc3NcIiwgY2xhc3NQcmVmaXggKyBcImNlbGxcIikuc3R5bGUoXCJvcGFjaXR5XCIsIDFlLTYpLFxyXG4gICAgICAgIHNoYXBlRW50ZXIgPSBjZWxsRW50ZXIuYXBwZW5kKHNoYXBlKS5hdHRyKFwiY2xhc3NcIiwgY2xhc3NQcmVmaXggKyBcInN3YXRjaFwiKSxcclxuICAgICAgICBzaGFwZXMgPSBjZWxsLnNlbGVjdChcImcuXCIgKyBjbGFzc1ByZWZpeCArIFwiY2VsbCBcIiArIHNoYXBlKTtcclxuXHJcbiAgICAgIC8vYWRkIGV2ZW50IGhhbmRsZXJzXHJcbiAgICAgIGhlbHBlci5kM19hZGRFdmVudHMoY2VsbEVudGVyLCBsZWdlbmREaXNwYXRjaGVyKTtcclxuXHJcbiAgICAgIGNlbGwuZXhpdCgpLnRyYW5zaXRpb24oKS5zdHlsZShcIm9wYWNpdHlcIiwgMCkucmVtb3ZlKCk7XHJcblxyXG4gICAgICBoZWxwZXIuZDNfZHJhd1NoYXBlcyhzaGFwZSwgc2hhcGVzLCBzaGFwZUhlaWdodCwgc2hhcGVXaWR0aCwgc2hhcGVSYWRpdXMsIHBhdGgpO1xyXG5cclxuICAgICAgaGVscGVyLmQzX2FkZFRleHQobGVnZW5kRywgY2VsbEVudGVyLCB0eXBlLmxhYmVscywgY2xhc3NQcmVmaXgpXHJcblxyXG4gICAgICAvLyBzZXRzIHBsYWNlbWVudFxyXG4gICAgICB2YXIgdGV4dCA9IGNlbGwuc2VsZWN0KFwidGV4dFwiKSxcclxuICAgICAgICBzaGFwZVNpemUgPSBzaGFwZXNbMF0ubWFwKCBmdW5jdGlvbihkKXsgcmV0dXJuIGQuZ2V0QkJveCgpOyB9KTtcclxuXHJcbiAgICAgIC8vc2V0cyBzY2FsZVxyXG4gICAgICAvL2V2ZXJ5dGhpbmcgaXMgZmlsbCBleGNlcHQgZm9yIGxpbmUgd2hpY2ggaXMgc3Ryb2tlLFxyXG4gICAgICBpZiAoIXVzZUNsYXNzKXtcclxuICAgICAgICBpZiAoc2hhcGUgPT0gXCJsaW5lXCIpe1xyXG4gICAgICAgICAgc2hhcGVzLnN0eWxlKFwic3Ryb2tlXCIsIHR5cGUuZmVhdHVyZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNoYXBlcy5zdHlsZShcImZpbGxcIiwgdHlwZS5mZWF0dXJlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2hhcGVzLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihkKXsgcmV0dXJuIGNsYXNzUHJlZml4ICsgXCJzd2F0Y2ggXCIgKyB0eXBlLmZlYXR1cmUoZCk7IH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgY2VsbFRyYW5zLFxyXG4gICAgICB0ZXh0VHJhbnMsXHJcbiAgICAgIHRleHRBbGlnbiA9IChsYWJlbEFsaWduID09IFwic3RhcnRcIikgPyAwIDogKGxhYmVsQWxpZ24gPT0gXCJtaWRkbGVcIikgPyAwLjUgOiAxO1xyXG5cclxuICAgICAgLy9wb3NpdGlvbnMgY2VsbHMgYW5kIHRleHRcclxuICAgICAgaWYgKG9yaWVudCA9PT0gXCJ2ZXJ0aWNhbFwiKXtcclxuICAgICAgICBjZWxsVHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKDAsIFwiICsgKGkgKiAoc2hhcGVTaXplW2ldLmhlaWdodCArIHNoYXBlUGFkZGluZykpICsgXCIpXCI7IH07XHJcbiAgICAgICAgdGV4dFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIChzaGFwZVNpemVbaV0ud2lkdGggKyBzaGFwZVNpemVbaV0ueCArXHJcbiAgICAgICAgICBsYWJlbE9mZnNldCkgKyBcIixcIiArIChzaGFwZVNpemVbaV0ueSArIHNoYXBlU2l6ZVtpXS5oZWlnaHQvMiArIDUpICsgXCIpXCI7IH07XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKG9yaWVudCA9PT0gXCJob3Jpem9udGFsXCIpe1xyXG4gICAgICAgIGNlbGxUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAoaSAqIChzaGFwZVNpemVbaV0ud2lkdGggKyBzaGFwZVBhZGRpbmcpKSArIFwiLDApXCI7IH1cclxuICAgICAgICB0ZXh0VHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKHNoYXBlU2l6ZVtpXS53aWR0aCp0ZXh0QWxpZ24gICsgc2hhcGVTaXplW2ldLngpICtcclxuICAgICAgICAgIFwiLFwiICsgKHNoYXBlU2l6ZVtpXS5oZWlnaHQgKyBzaGFwZVNpemVbaV0ueSArIGxhYmVsT2Zmc2V0ICsgOCkgKyBcIilcIjsgfTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaGVscGVyLmQzX3BsYWNlbWVudChvcmllbnQsIGNlbGwsIGNlbGxUcmFucywgdGV4dCwgdGV4dFRyYW5zLCBsYWJlbEFsaWduKTtcclxuICAgICAgaGVscGVyLmQzX3RpdGxlKHN2ZywgbGVnZW5kRywgdGl0bGUsIGNsYXNzUHJlZml4KTtcclxuXHJcbiAgICAgIGNlbGwudHJhbnNpdGlvbigpLnN0eWxlKFwib3BhY2l0eVwiLCAxKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgbGVnZW5kLnNjYWxlID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2NhbGU7XHJcbiAgICBzY2FsZSA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5jZWxscyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGNlbGxzO1xyXG4gICAgaWYgKF8ubGVuZ3RoID4gMSB8fCBfID49IDIgKXtcclxuICAgICAgY2VsbHMgPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuc2hhcGUgPSBmdW5jdGlvbihfLCBkKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZTtcclxuICAgIGlmIChfID09IFwicmVjdFwiIHx8IF8gPT0gXCJjaXJjbGVcIiB8fCBfID09IFwibGluZVwiIHx8IChfID09IFwicGF0aFwiICYmICh0eXBlb2YgZCA9PT0gJ3N0cmluZycpKSApe1xyXG4gICAgICBzaGFwZSA9IF87XHJcbiAgICAgIHBhdGggPSBkO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuc2hhcGVXaWR0aCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlV2lkdGg7XHJcbiAgICBzaGFwZVdpZHRoID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5zaGFwZUhlaWdodCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlSGVpZ2h0O1xyXG4gICAgc2hhcGVIZWlnaHQgPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlUmFkaXVzID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGVSYWRpdXM7XHJcbiAgICBzaGFwZVJhZGl1cyA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuc2hhcGVQYWRkaW5nID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGVQYWRkaW5nO1xyXG4gICAgc2hhcGVQYWRkaW5nID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbHMgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbHM7XHJcbiAgICBsYWJlbHMgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxBbGlnbiA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsQWxpZ247XHJcbiAgICBpZiAoXyA9PSBcInN0YXJ0XCIgfHwgXyA9PSBcImVuZFwiIHx8IF8gPT0gXCJtaWRkbGVcIikge1xyXG4gICAgICBsYWJlbEFsaWduID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsRm9ybWF0ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxGb3JtYXQ7XHJcbiAgICBsYWJlbEZvcm1hdCA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbE9mZnNldCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsT2Zmc2V0O1xyXG4gICAgbGFiZWxPZmZzZXQgPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsRGVsaW1pdGVyID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxEZWxpbWl0ZXI7XHJcbiAgICBsYWJlbERlbGltaXRlciA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC51c2VDbGFzcyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHVzZUNsYXNzO1xyXG4gICAgaWYgKF8gPT09IHRydWUgfHwgXyA9PT0gZmFsc2Upe1xyXG4gICAgICB1c2VDbGFzcyA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5vcmllbnQgPSBmdW5jdGlvbihfKXtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIG9yaWVudDtcclxuICAgIF8gPSBfLnRvTG93ZXJDYXNlKCk7XHJcbiAgICBpZiAoXyA9PSBcImhvcml6b250YWxcIiB8fCBfID09IFwidmVydGljYWxcIikge1xyXG4gICAgICBvcmllbnQgPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuYXNjZW5kaW5nID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gYXNjZW5kaW5nO1xyXG4gICAgYXNjZW5kaW5nID0gISFfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuY2xhc3NQcmVmaXggPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBjbGFzc1ByZWZpeDtcclxuICAgIGNsYXNzUHJlZml4ID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnRpdGxlID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdGl0bGU7XHJcbiAgICB0aXRsZSA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGQzLnJlYmluZChsZWdlbmQsIGxlZ2VuZERpc3BhdGNoZXIsIFwib25cIik7XHJcblxyXG4gIHJldHVybiBsZWdlbmQ7XHJcblxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgZDNfaWRlbnRpdHk6IGZ1bmN0aW9uIChkKSB7XHJcbiAgICByZXR1cm4gZDtcclxuICB9LFxyXG5cclxuICBkM19tZXJnZUxhYmVsczogZnVuY3Rpb24gKGdlbiwgbGFiZWxzKSB7XHJcblxyXG4gICAgICBpZihsYWJlbHMubGVuZ3RoID09PSAwKSByZXR1cm4gZ2VuO1xyXG5cclxuICAgICAgZ2VuID0gKGdlbikgPyBnZW4gOiBbXTtcclxuXHJcbiAgICAgIHZhciBpID0gbGFiZWxzLmxlbmd0aDtcclxuICAgICAgZm9yICg7IGkgPCBnZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsYWJlbHMucHVzaChnZW5baV0pO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBsYWJlbHM7XHJcbiAgICB9LFxyXG5cclxuICBkM19saW5lYXJMZWdlbmQ6IGZ1bmN0aW9uIChzY2FsZSwgY2VsbHMsIGxhYmVsRm9ybWF0KSB7XHJcbiAgICB2YXIgZGF0YSA9IFtdO1xyXG5cclxuICAgIGlmIChjZWxscy5sZW5ndGggPiAxKXtcclxuICAgICAgZGF0YSA9IGNlbGxzO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBkb21haW4gPSBzY2FsZS5kb21haW4oKSxcclxuICAgICAgaW5jcmVtZW50ID0gKGRvbWFpbltkb21haW4ubGVuZ3RoIC0gMV0gLSBkb21haW5bMF0pLyhjZWxscyAtIDEpLFxyXG4gICAgICBpID0gMDtcclxuXHJcbiAgICAgIGZvciAoOyBpIDwgY2VsbHM7IGkrKyl7XHJcbiAgICAgICAgZGF0YS5wdXNoKGRvbWFpblswXSArIGkqaW5jcmVtZW50KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhciBsYWJlbHMgPSBkYXRhLm1hcChsYWJlbEZvcm1hdCk7XHJcblxyXG4gICAgcmV0dXJuIHtkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICBsYWJlbHM6IGxhYmVscyxcclxuICAgICAgICAgICAgZmVhdHVyZTogZnVuY3Rpb24oZCl7IHJldHVybiBzY2FsZShkKTsgfX07XHJcbiAgfSxcclxuXHJcbiAgZDNfcXVhbnRMZWdlbmQ6IGZ1bmN0aW9uIChzY2FsZSwgbGFiZWxGb3JtYXQsIGxhYmVsRGVsaW1pdGVyKSB7XHJcbiAgICB2YXIgbGFiZWxzID0gc2NhbGUucmFuZ2UoKS5tYXAoZnVuY3Rpb24oZCl7XHJcbiAgICAgIHZhciBpbnZlcnQgPSBzY2FsZS5pbnZlcnRFeHRlbnQoZCksXHJcbiAgICAgIGEgPSBsYWJlbEZvcm1hdChpbnZlcnRbMF0pLFxyXG4gICAgICBiID0gbGFiZWxGb3JtYXQoaW52ZXJ0WzFdKTtcclxuXHJcbiAgICAgIC8vIGlmICgoIChhKSAmJiAoYS5pc05hbigpKSAmJiBiKXtcclxuICAgICAgLy8gICBjb25zb2xlLmxvZyhcImluIGluaXRpYWwgc3RhdGVtZW50XCIpXHJcbiAgICAgICAgcmV0dXJuIGxhYmVsRm9ybWF0KGludmVydFswXSkgKyBcIiBcIiArIGxhYmVsRGVsaW1pdGVyICsgXCIgXCIgKyBsYWJlbEZvcm1hdChpbnZlcnRbMV0pO1xyXG4gICAgICAvLyB9IGVsc2UgaWYgKGEgfHwgYikge1xyXG4gICAgICAvLyAgIGNvbnNvbGUubG9nKCdpbiBlbHNlIHN0YXRlbWVudCcpXHJcbiAgICAgIC8vICAgcmV0dXJuIChhKSA/IGEgOiBiO1xyXG4gICAgICAvLyB9XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHtkYXRhOiBzY2FsZS5yYW5nZSgpLFxyXG4gICAgICAgICAgICBsYWJlbHM6IGxhYmVscyxcclxuICAgICAgICAgICAgZmVhdHVyZTogdGhpcy5kM19pZGVudGl0eVxyXG4gICAgICAgICAgfTtcclxuICB9LFxyXG5cclxuICBkM19vcmRpbmFsTGVnZW5kOiBmdW5jdGlvbiAoc2NhbGUpIHtcclxuICAgIHJldHVybiB7ZGF0YTogc2NhbGUuZG9tYWluKCksXHJcbiAgICAgICAgICAgIGxhYmVsczogc2NhbGUuZG9tYWluKCksXHJcbiAgICAgICAgICAgIGZlYXR1cmU6IGZ1bmN0aW9uKGQpeyByZXR1cm4gc2NhbGUoZCk7IH19O1xyXG4gIH0sXHJcblxyXG4gIGQzX2RyYXdTaGFwZXM6IGZ1bmN0aW9uIChzaGFwZSwgc2hhcGVzLCBzaGFwZUhlaWdodCwgc2hhcGVXaWR0aCwgc2hhcGVSYWRpdXMsIHBhdGgpIHtcclxuICAgIGlmIChzaGFwZSA9PT0gXCJyZWN0XCIpe1xyXG4gICAgICAgIHNoYXBlcy5hdHRyKFwiaGVpZ2h0XCIsIHNoYXBlSGVpZ2h0KS5hdHRyKFwid2lkdGhcIiwgc2hhcGVXaWR0aCk7XHJcblxyXG4gICAgfSBlbHNlIGlmIChzaGFwZSA9PT0gXCJjaXJjbGVcIikge1xyXG4gICAgICAgIHNoYXBlcy5hdHRyKFwiclwiLCBzaGFwZVJhZGl1cykvLy5hdHRyKFwiY3hcIiwgc2hhcGVSYWRpdXMpLmF0dHIoXCJjeVwiLCBzaGFwZVJhZGl1cyk7XHJcblxyXG4gICAgfSBlbHNlIGlmIChzaGFwZSA9PT0gXCJsaW5lXCIpIHtcclxuICAgICAgICBzaGFwZXMuYXR0cihcIngxXCIsIDApLmF0dHIoXCJ4MlwiLCBzaGFwZVdpZHRoKS5hdHRyKFwieTFcIiwgMCkuYXR0cihcInkyXCIsIDApO1xyXG5cclxuICAgIH0gZWxzZSBpZiAoc2hhcGUgPT09IFwicGF0aFwiKSB7XHJcbiAgICAgIHNoYXBlcy5hdHRyKFwiZFwiLCBwYXRoKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBkM19hZGRUZXh0OiBmdW5jdGlvbiAoc3ZnLCBlbnRlciwgbGFiZWxzLCBjbGFzc1ByZWZpeCl7XHJcbiAgICBlbnRlci5hcHBlbmQoXCJ0ZXh0XCIpLmF0dHIoXCJjbGFzc1wiLCBjbGFzc1ByZWZpeCArIFwibGFiZWxcIik7XHJcbiAgICBzdmcuc2VsZWN0QWxsKFwiZy5cIiArIGNsYXNzUHJlZml4ICsgXCJjZWxsIHRleHRcIikuZGF0YShsYWJlbHMpLnRleHQodGhpcy5kM19pZGVudGl0eSk7XHJcbiAgfSxcclxuXHJcbiAgZDNfY2FsY1R5cGU6IGZ1bmN0aW9uIChzY2FsZSwgYXNjZW5kaW5nLCBjZWxscywgbGFiZWxzLCBsYWJlbEZvcm1hdCwgbGFiZWxEZWxpbWl0ZXIpe1xyXG4gICAgdmFyIHR5cGUgPSBzY2FsZS50aWNrcyA/XHJcbiAgICAgICAgICAgIHRoaXMuZDNfbGluZWFyTGVnZW5kKHNjYWxlLCBjZWxscywgbGFiZWxGb3JtYXQpIDogc2NhbGUuaW52ZXJ0RXh0ZW50ID9cclxuICAgICAgICAgICAgdGhpcy5kM19xdWFudExlZ2VuZChzY2FsZSwgbGFiZWxGb3JtYXQsIGxhYmVsRGVsaW1pdGVyKSA6IHRoaXMuZDNfb3JkaW5hbExlZ2VuZChzY2FsZSk7XHJcblxyXG4gICAgdHlwZS5sYWJlbHMgPSB0aGlzLmQzX21lcmdlTGFiZWxzKHR5cGUubGFiZWxzLCBsYWJlbHMpO1xyXG5cclxuICAgIGlmIChhc2NlbmRpbmcpIHtcclxuICAgICAgdHlwZS5sYWJlbHMgPSB0aGlzLmQzX3JldmVyc2UodHlwZS5sYWJlbHMpO1xyXG4gICAgICB0eXBlLmRhdGEgPSB0aGlzLmQzX3JldmVyc2UodHlwZS5kYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHlwZTtcclxuICB9LFxyXG5cclxuICBkM19yZXZlcnNlOiBmdW5jdGlvbihhcnIpIHtcclxuICAgIHZhciBtaXJyb3IgPSBbXTtcclxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gYXJyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICBtaXJyb3JbaV0gPSBhcnJbbC1pLTFdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG1pcnJvcjtcclxuICB9LFxyXG5cclxuICBkM19wbGFjZW1lbnQ6IGZ1bmN0aW9uIChvcmllbnQsIGNlbGwsIGNlbGxUcmFucywgdGV4dCwgdGV4dFRyYW5zLCBsYWJlbEFsaWduKSB7XHJcbiAgICBjZWxsLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgY2VsbFRyYW5zKTtcclxuICAgIHRleHQuYXR0cihcInRyYW5zZm9ybVwiLCB0ZXh0VHJhbnMpO1xyXG4gICAgaWYgKG9yaWVudCA9PT0gXCJob3Jpem9udGFsXCIpe1xyXG4gICAgICB0ZXh0LnN0eWxlKFwidGV4dC1hbmNob3JcIiwgbGFiZWxBbGlnbik7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZDNfYWRkRXZlbnRzOiBmdW5jdGlvbihjZWxscywgZGlzcGF0Y2hlcil7XHJcbiAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICBjZWxscy5vbihcIm1vdXNlb3Zlci5sZWdlbmRcIiwgZnVuY3Rpb24gKGQpIHsgXy5kM19jZWxsT3ZlcihkaXNwYXRjaGVyLCBkLCB0aGlzKTsgfSlcclxuICAgICAgICAgIC5vbihcIm1vdXNlb3V0LmxlZ2VuZFwiLCBmdW5jdGlvbiAoZCkgeyBfLmQzX2NlbGxPdXQoZGlzcGF0Y2hlciwgZCwgdGhpcyk7IH0pXHJcbiAgICAgICAgICAub24oXCJjbGljay5sZWdlbmRcIiwgZnVuY3Rpb24gKGQpIHsgXy5kM19jZWxsQ2xpY2soZGlzcGF0Y2hlciwgZCwgdGhpcyk7IH0pO1xyXG4gIH0sXHJcblxyXG4gIGQzX2NlbGxPdmVyOiBmdW5jdGlvbihjZWxsRGlzcGF0Y2hlciwgZCwgb2JqKXtcclxuICAgIGNlbGxEaXNwYXRjaGVyLmNlbGxvdmVyLmNhbGwob2JqLCBkKTtcclxuICB9LFxyXG5cclxuICBkM19jZWxsT3V0OiBmdW5jdGlvbihjZWxsRGlzcGF0Y2hlciwgZCwgb2JqKXtcclxuICAgIGNlbGxEaXNwYXRjaGVyLmNlbGxvdXQuY2FsbChvYmosIGQpO1xyXG4gIH0sXHJcblxyXG4gIGQzX2NlbGxDbGljazogZnVuY3Rpb24oY2VsbERpc3BhdGNoZXIsIGQsIG9iail7XHJcbiAgICBjZWxsRGlzcGF0Y2hlci5jZWxsY2xpY2suY2FsbChvYmosIGQpO1xyXG4gIH0sXHJcblxyXG4gIGQzX3RpdGxlOiBmdW5jdGlvbihzdmcsIGNlbGxzU3ZnLCB0aXRsZSwgY2xhc3NQcmVmaXgpe1xyXG4gICAgaWYgKHRpdGxlICE9PSBcIlwiKXtcclxuXHJcbiAgICAgIHZhciB0aXRsZVRleHQgPSBzdmcuc2VsZWN0QWxsKCd0ZXh0LicgKyBjbGFzc1ByZWZpeCArICdsZWdlbmRUaXRsZScpO1xyXG5cclxuICAgICAgdGl0bGVUZXh0LmRhdGEoW3RpdGxlXSlcclxuICAgICAgICAuZW50ZXIoKVxyXG4gICAgICAgIC5hcHBlbmQoJ3RleHQnKVxyXG4gICAgICAgIC5hdHRyKCdjbGFzcycsIGNsYXNzUHJlZml4ICsgJ2xlZ2VuZFRpdGxlJyk7XHJcblxyXG4gICAgICAgIHN2Zy5zZWxlY3RBbGwoJ3RleHQuJyArIGNsYXNzUHJlZml4ICsgJ2xlZ2VuZFRpdGxlJylcclxuICAgICAgICAgICAgLnRleHQodGl0bGUpXHJcblxyXG4gICAgICB2YXIgeU9mZnNldCA9IHN2Zy5zZWxlY3QoJy4nICsgY2xhc3NQcmVmaXggKyAnbGVnZW5kVGl0bGUnKVxyXG4gICAgICAgICAgLm1hcChmdW5jdGlvbihkKSB7IHJldHVybiBkWzBdLmdldEJCb3goKS5oZWlnaHR9KVswXSxcclxuICAgICAgeE9mZnNldCA9IC1jZWxsc1N2Zy5tYXAoZnVuY3Rpb24oZCkgeyByZXR1cm4gZFswXS5nZXRCQm94KCkueH0pWzBdO1xyXG5cclxuICAgICAgY2VsbHNTdmcuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgeE9mZnNldCArICcsJyArICh5T2Zmc2V0ICsgMTApICsgJyknKTtcclxuXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsInZhciBoZWxwZXIgPSByZXF1aXJlKCcuL2xlZ2VuZCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAgZnVuY3Rpb24oKXtcclxuXHJcbiAgdmFyIHNjYWxlID0gZDMuc2NhbGUubGluZWFyKCksXHJcbiAgICBzaGFwZSA9IFwicmVjdFwiLFxyXG4gICAgc2hhcGVXaWR0aCA9IDE1LFxyXG4gICAgc2hhcGVQYWRkaW5nID0gMixcclxuICAgIGNlbGxzID0gWzVdLFxyXG4gICAgbGFiZWxzID0gW10sXHJcbiAgICB1c2VTdHJva2UgPSBmYWxzZSxcclxuICAgIGNsYXNzUHJlZml4ID0gXCJcIixcclxuICAgIHRpdGxlID0gXCJcIixcclxuICAgIGxhYmVsRm9ybWF0ID0gZDMuZm9ybWF0KFwiLjAxZlwiKSxcclxuICAgIGxhYmVsT2Zmc2V0ID0gMTAsXHJcbiAgICBsYWJlbEFsaWduID0gXCJtaWRkbGVcIixcclxuICAgIGxhYmVsRGVsaW1pdGVyID0gXCJ0b1wiLFxyXG4gICAgb3JpZW50ID0gXCJ2ZXJ0aWNhbFwiLFxyXG4gICAgYXNjZW5kaW5nID0gZmFsc2UsXHJcbiAgICBwYXRoLFxyXG4gICAgbGVnZW5kRGlzcGF0Y2hlciA9IGQzLmRpc3BhdGNoKFwiY2VsbG92ZXJcIiwgXCJjZWxsb3V0XCIsIFwiY2VsbGNsaWNrXCIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGxlZ2VuZChzdmcpe1xyXG5cclxuICAgICAgdmFyIHR5cGUgPSBoZWxwZXIuZDNfY2FsY1R5cGUoc2NhbGUsIGFzY2VuZGluZywgY2VsbHMsIGxhYmVscywgbGFiZWxGb3JtYXQsIGxhYmVsRGVsaW1pdGVyKSxcclxuICAgICAgICBsZWdlbmRHID0gc3ZnLnNlbGVjdEFsbCgnZycpLmRhdGEoW3NjYWxlXSk7XHJcblxyXG4gICAgICBsZWdlbmRHLmVudGVyKCkuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCBjbGFzc1ByZWZpeCArICdsZWdlbmRDZWxscycpO1xyXG5cclxuXHJcbiAgICAgIHZhciBjZWxsID0gbGVnZW5kRy5zZWxlY3RBbGwoXCIuXCIgKyBjbGFzc1ByZWZpeCArIFwiY2VsbFwiKS5kYXRhKHR5cGUuZGF0YSksXHJcbiAgICAgICAgY2VsbEVudGVyID0gY2VsbC5lbnRlcigpLmFwcGVuZChcImdcIiwgXCIuY2VsbFwiKS5hdHRyKFwiY2xhc3NcIiwgY2xhc3NQcmVmaXggKyBcImNlbGxcIikuc3R5bGUoXCJvcGFjaXR5XCIsIDFlLTYpLFxyXG4gICAgICAgIHNoYXBlRW50ZXIgPSBjZWxsRW50ZXIuYXBwZW5kKHNoYXBlKS5hdHRyKFwiY2xhc3NcIiwgY2xhc3NQcmVmaXggKyBcInN3YXRjaFwiKSxcclxuICAgICAgICBzaGFwZXMgPSBjZWxsLnNlbGVjdChcImcuXCIgKyBjbGFzc1ByZWZpeCArIFwiY2VsbCBcIiArIHNoYXBlKTtcclxuXHJcbiAgICAgIC8vYWRkIGV2ZW50IGhhbmRsZXJzXHJcbiAgICAgIGhlbHBlci5kM19hZGRFdmVudHMoY2VsbEVudGVyLCBsZWdlbmREaXNwYXRjaGVyKTtcclxuXHJcbiAgICAgIGNlbGwuZXhpdCgpLnRyYW5zaXRpb24oKS5zdHlsZShcIm9wYWNpdHlcIiwgMCkucmVtb3ZlKCk7XHJcblxyXG4gICAgICAvL2NyZWF0ZXMgc2hhcGVcclxuICAgICAgaWYgKHNoYXBlID09PSBcImxpbmVcIil7XHJcbiAgICAgICAgaGVscGVyLmQzX2RyYXdTaGFwZXMoc2hhcGUsIHNoYXBlcywgMCwgc2hhcGVXaWR0aCk7XHJcbiAgICAgICAgc2hhcGVzLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgdHlwZS5mZWF0dXJlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBoZWxwZXIuZDNfZHJhd1NoYXBlcyhzaGFwZSwgc2hhcGVzLCB0eXBlLmZlYXR1cmUsIHR5cGUuZmVhdHVyZSwgdHlwZS5mZWF0dXJlLCBwYXRoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaGVscGVyLmQzX2FkZFRleHQobGVnZW5kRywgY2VsbEVudGVyLCB0eXBlLmxhYmVscywgY2xhc3NQcmVmaXgpXHJcblxyXG4gICAgICAvL3NldHMgcGxhY2VtZW50XHJcbiAgICAgIHZhciB0ZXh0ID0gY2VsbC5zZWxlY3QoXCJ0ZXh0XCIpLFxyXG4gICAgICAgIHNoYXBlU2l6ZSA9IHNoYXBlc1swXS5tYXAoXHJcbiAgICAgICAgICBmdW5jdGlvbihkLCBpKXtcclxuICAgICAgICAgICAgdmFyIGJib3ggPSBkLmdldEJCb3goKVxyXG4gICAgICAgICAgICB2YXIgc3Ryb2tlID0gc2NhbGUodHlwZS5kYXRhW2ldKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzaGFwZSA9PT0gXCJsaW5lXCIgJiYgb3JpZW50ID09PSBcImhvcml6b250YWxcIikge1xyXG4gICAgICAgICAgICAgIGJib3guaGVpZ2h0ID0gYmJveC5oZWlnaHQgKyBzdHJva2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2hhcGUgPT09IFwibGluZVwiICYmIG9yaWVudCA9PT0gXCJ2ZXJ0aWNhbFwiKXtcclxuICAgICAgICAgICAgICBiYm94LndpZHRoID0gYmJveC53aWR0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGJib3g7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB2YXIgbWF4SCA9IGQzLm1heChzaGFwZVNpemUsIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC5oZWlnaHQgKyBkLnk7IH0pLFxyXG4gICAgICBtYXhXID0gZDMubWF4KHNoYXBlU2l6ZSwgZnVuY3Rpb24oZCl7IHJldHVybiBkLndpZHRoICsgZC54OyB9KTtcclxuXHJcbiAgICAgIHZhciBjZWxsVHJhbnMsXHJcbiAgICAgIHRleHRUcmFucyxcclxuICAgICAgdGV4dEFsaWduID0gKGxhYmVsQWxpZ24gPT0gXCJzdGFydFwiKSA/IDAgOiAobGFiZWxBbGlnbiA9PSBcIm1pZGRsZVwiKSA/IDAuNSA6IDE7XHJcblxyXG4gICAgICAvL3Bvc2l0aW9ucyBjZWxscyBhbmQgdGV4dFxyXG4gICAgICBpZiAob3JpZW50ID09PSBcInZlcnRpY2FsXCIpe1xyXG5cclxuICAgICAgICBjZWxsVHJhbnMgPSBmdW5jdGlvbihkLGkpIHtcclxuICAgICAgICAgICAgdmFyIGhlaWdodCA9IGQzLnN1bShzaGFwZVNpemUuc2xpY2UoMCwgaSArIDEgKSwgZnVuY3Rpb24oZCl7IHJldHVybiBkLmhlaWdodDsgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZSgwLCBcIiArIChoZWlnaHQgKyBpKnNoYXBlUGFkZGluZykgKyBcIilcIjsgfTtcclxuXHJcbiAgICAgICAgdGV4dFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIChtYXhXICsgbGFiZWxPZmZzZXQpICsgXCIsXCIgK1xyXG4gICAgICAgICAgKHNoYXBlU2l6ZVtpXS55ICsgc2hhcGVTaXplW2ldLmhlaWdodC8yICsgNSkgKyBcIilcIjsgfTtcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAob3JpZW50ID09PSBcImhvcml6b250YWxcIil7XHJcbiAgICAgICAgY2VsbFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7XHJcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IGQzLnN1bShzaGFwZVNpemUuc2xpY2UoMCwgaSArIDEgKSwgZnVuY3Rpb24oZCl7IHJldHVybiBkLndpZHRoOyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKHdpZHRoICsgaSpzaGFwZVBhZGRpbmcpICsgXCIsMClcIjsgfTtcclxuXHJcbiAgICAgICAgdGV4dFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIChzaGFwZVNpemVbaV0ud2lkdGgqdGV4dEFsaWduICArIHNoYXBlU2l6ZVtpXS54KSArIFwiLFwiICtcclxuICAgICAgICAgICAgICAobWF4SCArIGxhYmVsT2Zmc2V0ICkgKyBcIilcIjsgfTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaGVscGVyLmQzX3BsYWNlbWVudChvcmllbnQsIGNlbGwsIGNlbGxUcmFucywgdGV4dCwgdGV4dFRyYW5zLCBsYWJlbEFsaWduKTtcclxuICAgICAgaGVscGVyLmQzX3RpdGxlKHN2ZywgbGVnZW5kRywgdGl0bGUsIGNsYXNzUHJlZml4KTtcclxuXHJcbiAgICAgIGNlbGwudHJhbnNpdGlvbigpLnN0eWxlKFwib3BhY2l0eVwiLCAxKTtcclxuXHJcbiAgICB9XHJcblxyXG4gIGxlZ2VuZC5zY2FsZSA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNjYWxlO1xyXG4gICAgc2NhbGUgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuY2VsbHMgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBjZWxscztcclxuICAgIGlmIChfLmxlbmd0aCA+IDEgfHwgXyA+PSAyICl7XHJcbiAgICAgIGNlbGxzID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcblxyXG4gIGxlZ2VuZC5zaGFwZSA9IGZ1bmN0aW9uKF8sIGQpIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlO1xyXG4gICAgaWYgKF8gPT0gXCJyZWN0XCIgfHwgXyA9PSBcImNpcmNsZVwiIHx8IF8gPT0gXCJsaW5lXCIgKXtcclxuICAgICAgc2hhcGUgPSBfO1xyXG4gICAgICBwYXRoID0gZDtcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlV2lkdGggPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZVdpZHRoO1xyXG4gICAgc2hhcGVXaWR0aCA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuc2hhcGVQYWRkaW5nID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGVQYWRkaW5nO1xyXG4gICAgc2hhcGVQYWRkaW5nID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbHMgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbHM7XHJcbiAgICBsYWJlbHMgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxBbGlnbiA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsQWxpZ247XHJcbiAgICBpZiAoXyA9PSBcInN0YXJ0XCIgfHwgXyA9PSBcImVuZFwiIHx8IF8gPT0gXCJtaWRkbGVcIikge1xyXG4gICAgICBsYWJlbEFsaWduID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsRm9ybWF0ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxGb3JtYXQ7XHJcbiAgICBsYWJlbEZvcm1hdCA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbE9mZnNldCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsT2Zmc2V0O1xyXG4gICAgbGFiZWxPZmZzZXQgPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsRGVsaW1pdGVyID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxEZWxpbWl0ZXI7XHJcbiAgICBsYWJlbERlbGltaXRlciA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5vcmllbnQgPSBmdW5jdGlvbihfKXtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIG9yaWVudDtcclxuICAgIF8gPSBfLnRvTG93ZXJDYXNlKCk7XHJcbiAgICBpZiAoXyA9PSBcImhvcml6b250YWxcIiB8fCBfID09IFwidmVydGljYWxcIikge1xyXG4gICAgICBvcmllbnQgPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuYXNjZW5kaW5nID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gYXNjZW5kaW5nO1xyXG4gICAgYXNjZW5kaW5nID0gISFfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuY2xhc3NQcmVmaXggPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBjbGFzc1ByZWZpeDtcclxuICAgIGNsYXNzUHJlZml4ID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnRpdGxlID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdGl0bGU7XHJcbiAgICB0aXRsZSA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGQzLnJlYmluZChsZWdlbmQsIGxlZ2VuZERpc3BhdGNoZXIsIFwib25cIik7XHJcblxyXG4gIHJldHVybiBsZWdlbmQ7XHJcblxyXG59O1xyXG4iLCJ2YXIgaGVscGVyID0gcmVxdWlyZSgnLi9sZWdlbmQnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgdmFyIHNjYWxlID0gZDMuc2NhbGUubGluZWFyKCksXHJcbiAgICBzaGFwZSA9IFwicGF0aFwiLFxyXG4gICAgc2hhcGVXaWR0aCA9IDE1LFxyXG4gICAgc2hhcGVIZWlnaHQgPSAxNSxcclxuICAgIHNoYXBlUmFkaXVzID0gMTAsXHJcbiAgICBzaGFwZVBhZGRpbmcgPSA1LFxyXG4gICAgY2VsbHMgPSBbNV0sXHJcbiAgICBsYWJlbHMgPSBbXSxcclxuICAgIGNsYXNzUHJlZml4ID0gXCJcIixcclxuICAgIHVzZUNsYXNzID0gZmFsc2UsXHJcbiAgICB0aXRsZSA9IFwiXCIsXHJcbiAgICBsYWJlbEZvcm1hdCA9IGQzLmZvcm1hdChcIi4wMWZcIiksXHJcbiAgICBsYWJlbEFsaWduID0gXCJtaWRkbGVcIixcclxuICAgIGxhYmVsT2Zmc2V0ID0gMTAsXHJcbiAgICBsYWJlbERlbGltaXRlciA9IFwidG9cIixcclxuICAgIG9yaWVudCA9IFwidmVydGljYWxcIixcclxuICAgIGFzY2VuZGluZyA9IGZhbHNlLFxyXG4gICAgbGVnZW5kRGlzcGF0Y2hlciA9IGQzLmRpc3BhdGNoKFwiY2VsbG92ZXJcIiwgXCJjZWxsb3V0XCIsIFwiY2VsbGNsaWNrXCIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGxlZ2VuZChzdmcpe1xyXG5cclxuICAgICAgdmFyIHR5cGUgPSBoZWxwZXIuZDNfY2FsY1R5cGUoc2NhbGUsIGFzY2VuZGluZywgY2VsbHMsIGxhYmVscywgbGFiZWxGb3JtYXQsIGxhYmVsRGVsaW1pdGVyKSxcclxuICAgICAgICBsZWdlbmRHID0gc3ZnLnNlbGVjdEFsbCgnZycpLmRhdGEoW3NjYWxlXSk7XHJcblxyXG4gICAgICBsZWdlbmRHLmVudGVyKCkuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCBjbGFzc1ByZWZpeCArICdsZWdlbmRDZWxscycpO1xyXG5cclxuICAgICAgdmFyIGNlbGwgPSBsZWdlbmRHLnNlbGVjdEFsbChcIi5cIiArIGNsYXNzUHJlZml4ICsgXCJjZWxsXCIpLmRhdGEodHlwZS5kYXRhKSxcclxuICAgICAgICBjZWxsRW50ZXIgPSBjZWxsLmVudGVyKCkuYXBwZW5kKFwiZ1wiLCBcIi5jZWxsXCIpLmF0dHIoXCJjbGFzc1wiLCBjbGFzc1ByZWZpeCArIFwiY2VsbFwiKS5zdHlsZShcIm9wYWNpdHlcIiwgMWUtNiksXHJcbiAgICAgICAgc2hhcGVFbnRlciA9IGNlbGxFbnRlci5hcHBlbmQoc2hhcGUpLmF0dHIoXCJjbGFzc1wiLCBjbGFzc1ByZWZpeCArIFwic3dhdGNoXCIpLFxyXG4gICAgICAgIHNoYXBlcyA9IGNlbGwuc2VsZWN0KFwiZy5cIiArIGNsYXNzUHJlZml4ICsgXCJjZWxsIFwiICsgc2hhcGUpO1xyXG5cclxuICAgICAgLy9hZGQgZXZlbnQgaGFuZGxlcnNcclxuICAgICAgaGVscGVyLmQzX2FkZEV2ZW50cyhjZWxsRW50ZXIsIGxlZ2VuZERpc3BhdGNoZXIpO1xyXG5cclxuICAgICAgLy9yZW1vdmUgb2xkIHNoYXBlc1xyXG4gICAgICBjZWxsLmV4aXQoKS50cmFuc2l0aW9uKCkuc3R5bGUoXCJvcGFjaXR5XCIsIDApLnJlbW92ZSgpO1xyXG5cclxuICAgICAgaGVscGVyLmQzX2RyYXdTaGFwZXMoc2hhcGUsIHNoYXBlcywgc2hhcGVIZWlnaHQsIHNoYXBlV2lkdGgsIHNoYXBlUmFkaXVzLCB0eXBlLmZlYXR1cmUpO1xyXG4gICAgICBoZWxwZXIuZDNfYWRkVGV4dChsZWdlbmRHLCBjZWxsRW50ZXIsIHR5cGUubGFiZWxzLCBjbGFzc1ByZWZpeClcclxuXHJcbiAgICAgIC8vIHNldHMgcGxhY2VtZW50XHJcbiAgICAgIHZhciB0ZXh0ID0gY2VsbC5zZWxlY3QoXCJ0ZXh0XCIpLFxyXG4gICAgICAgIHNoYXBlU2l6ZSA9IHNoYXBlc1swXS5tYXAoIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC5nZXRCQm94KCk7IH0pO1xyXG5cclxuICAgICAgdmFyIG1heEggPSBkMy5tYXgoc2hhcGVTaXplLCBmdW5jdGlvbihkKXsgcmV0dXJuIGQuaGVpZ2h0OyB9KSxcclxuICAgICAgbWF4VyA9IGQzLm1heChzaGFwZVNpemUsIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC53aWR0aDsgfSk7XHJcblxyXG4gICAgICB2YXIgY2VsbFRyYW5zLFxyXG4gICAgICB0ZXh0VHJhbnMsXHJcbiAgICAgIHRleHRBbGlnbiA9IChsYWJlbEFsaWduID09IFwic3RhcnRcIikgPyAwIDogKGxhYmVsQWxpZ24gPT0gXCJtaWRkbGVcIikgPyAwLjUgOiAxO1xyXG5cclxuICAgICAgLy9wb3NpdGlvbnMgY2VsbHMgYW5kIHRleHRcclxuICAgICAgaWYgKG9yaWVudCA9PT0gXCJ2ZXJ0aWNhbFwiKXtcclxuICAgICAgICBjZWxsVHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKDAsIFwiICsgKGkgKiAobWF4SCArIHNoYXBlUGFkZGluZykpICsgXCIpXCI7IH07XHJcbiAgICAgICAgdGV4dFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIChtYXhXICsgbGFiZWxPZmZzZXQpICsgXCIsXCIgK1xyXG4gICAgICAgICAgICAgIChzaGFwZVNpemVbaV0ueSArIHNoYXBlU2l6ZVtpXS5oZWlnaHQvMiArIDUpICsgXCIpXCI7IH07XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKG9yaWVudCA9PT0gXCJob3Jpem9udGFsXCIpe1xyXG4gICAgICAgIGNlbGxUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAoaSAqIChtYXhXICsgc2hhcGVQYWRkaW5nKSkgKyBcIiwwKVwiOyB9O1xyXG4gICAgICAgIHRleHRUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAoc2hhcGVTaXplW2ldLndpZHRoKnRleHRBbGlnbiAgKyBzaGFwZVNpemVbaV0ueCkgKyBcIixcIiArXHJcbiAgICAgICAgICAgICAgKG1heEggKyBsYWJlbE9mZnNldCApICsgXCIpXCI7IH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGhlbHBlci5kM19wbGFjZW1lbnQob3JpZW50LCBjZWxsLCBjZWxsVHJhbnMsIHRleHQsIHRleHRUcmFucywgbGFiZWxBbGlnbik7XHJcbiAgICAgIGhlbHBlci5kM190aXRsZShzdmcsIGxlZ2VuZEcsIHRpdGxlLCBjbGFzc1ByZWZpeCk7XHJcbiAgICAgIGNlbGwudHJhbnNpdGlvbigpLnN0eWxlKFwib3BhY2l0eVwiLCAxKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICBsZWdlbmQuc2NhbGUgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzY2FsZTtcclxuICAgIHNjYWxlID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmNlbGxzID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY2VsbHM7XHJcbiAgICBpZiAoXy5sZW5ndGggPiAxIHx8IF8gPj0gMiApe1xyXG4gICAgICBjZWxscyA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5zaGFwZVBhZGRpbmcgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZVBhZGRpbmc7XHJcbiAgICBzaGFwZVBhZGRpbmcgPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVscyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVscztcclxuICAgIGxhYmVscyA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbEFsaWduID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxBbGlnbjtcclxuICAgIGlmIChfID09IFwic3RhcnRcIiB8fCBfID09IFwiZW5kXCIgfHwgXyA9PSBcIm1pZGRsZVwiKSB7XHJcbiAgICAgIGxhYmVsQWxpZ24gPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxGb3JtYXQgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbEZvcm1hdDtcclxuICAgIGxhYmVsRm9ybWF0ID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsT2Zmc2V0ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxPZmZzZXQ7XHJcbiAgICBsYWJlbE9mZnNldCA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxEZWxpbWl0ZXIgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbERlbGltaXRlcjtcclxuICAgIGxhYmVsRGVsaW1pdGVyID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLm9yaWVudCA9IGZ1bmN0aW9uKF8pe1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gb3JpZW50O1xyXG4gICAgXyA9IF8udG9Mb3dlckNhc2UoKTtcclxuICAgIGlmIChfID09IFwiaG9yaXpvbnRhbFwiIHx8IF8gPT0gXCJ2ZXJ0aWNhbFwiKSB7XHJcbiAgICAgIG9yaWVudCA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5hc2NlbmRpbmcgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBhc2NlbmRpbmc7XHJcbiAgICBhc2NlbmRpbmcgPSAhIV87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5jbGFzc1ByZWZpeCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGNsYXNzUHJlZml4O1xyXG4gICAgY2xhc3NQcmVmaXggPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQudGl0bGUgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB0aXRsZTtcclxuICAgIHRpdGxlID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgZDMucmViaW5kKGxlZ2VuZCwgbGVnZW5kRGlzcGF0Y2hlciwgXCJvblwiKTtcclxuXHJcbiAgcmV0dXJuIGxlZ2VuZDtcclxuXHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbi8qKlxyXG4gKiAqKltHYXVzc2lhbiBlcnJvciBmdW5jdGlvbl0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9FcnJvcl9mdW5jdGlvbikqKlxyXG4gKlxyXG4gKiBUaGUgYGVycm9yRnVuY3Rpb24oeC8oc2QgKiBNYXRoLnNxcnQoMikpKWAgaXMgdGhlIHByb2JhYmlsaXR5IHRoYXQgYSB2YWx1ZSBpbiBhXHJcbiAqIG5vcm1hbCBkaXN0cmlidXRpb24gd2l0aCBzdGFuZGFyZCBkZXZpYXRpb24gc2QgaXMgd2l0aGluIHggb2YgdGhlIG1lYW4uXHJcbiAqXHJcbiAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyBhIG51bWVyaWNhbCBhcHByb3hpbWF0aW9uIHRvIHRoZSBleGFjdCB2YWx1ZS5cclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IHggaW5wdXRcclxuICogQHJldHVybiB7bnVtYmVyfSBlcnJvciBlc3RpbWF0aW9uXHJcbiAqIEBleGFtcGxlXHJcbiAqIGVycm9yRnVuY3Rpb24oMSk7IC8vPSAwLjg0MjdcclxuICovXHJcbmZ1bmN0aW9uIGVycm9yRnVuY3Rpb24oeC8qOiBudW1iZXIgKi8pLyo6IG51bWJlciAqLyB7XHJcbiAgICB2YXIgdCA9IDEgLyAoMSArIDAuNSAqIE1hdGguYWJzKHgpKTtcclxuICAgIHZhciB0YXUgPSB0ICogTWF0aC5leHAoLU1hdGgucG93KHgsIDIpIC1cclxuICAgICAgICAxLjI2NTUxMjIzICtcclxuICAgICAgICAxLjAwMDAyMzY4ICogdCArXHJcbiAgICAgICAgMC4zNzQwOTE5NiAqIE1hdGgucG93KHQsIDIpICtcclxuICAgICAgICAwLjA5Njc4NDE4ICogTWF0aC5wb3codCwgMykgLVxyXG4gICAgICAgIDAuMTg2Mjg4MDYgKiBNYXRoLnBvdyh0LCA0KSArXHJcbiAgICAgICAgMC4yNzg4NjgwNyAqIE1hdGgucG93KHQsIDUpIC1cclxuICAgICAgICAxLjEzNTIwMzk4ICogTWF0aC5wb3codCwgNikgK1xyXG4gICAgICAgIDEuNDg4NTE1ODcgKiBNYXRoLnBvdyh0LCA3KSAtXHJcbiAgICAgICAgMC44MjIxNTIyMyAqIE1hdGgucG93KHQsIDgpICtcclxuICAgICAgICAwLjE3MDg3Mjc3ICogTWF0aC5wb3codCwgOSkpO1xyXG4gICAgaWYgKHggPj0gMCkge1xyXG4gICAgICAgIHJldHVybiAxIC0gdGF1O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGF1IC0gMTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlcnJvckZ1bmN0aW9uO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG4vKipcclxuICogW1NpbXBsZSBsaW5lYXIgcmVncmVzc2lvbl0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TaW1wbGVfbGluZWFyX3JlZ3Jlc3Npb24pXHJcbiAqIGlzIGEgc2ltcGxlIHdheSB0byBmaW5kIGEgZml0dGVkIGxpbmVcclxuICogYmV0d2VlbiBhIHNldCBvZiBjb29yZGluYXRlcy4gVGhpcyBhbGdvcml0aG0gZmluZHMgdGhlIHNsb3BlIGFuZCB5LWludGVyY2VwdCBvZiBhIHJlZ3Jlc3Npb24gbGluZVxyXG4gKiB1c2luZyB0aGUgbGVhc3Qgc3VtIG9mIHNxdWFyZXMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8QXJyYXk8bnVtYmVyPj59IGRhdGEgYW4gYXJyYXkgb2YgdHdvLWVsZW1lbnQgb2YgYXJyYXlzLFxyXG4gKiBsaWtlIGBbWzAsIDFdLCBbMiwgM11dYFxyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBvYmplY3QgY29udGFpbmluZyBzbG9wZSBhbmQgaW50ZXJzZWN0IG9mIHJlZ3Jlc3Npb24gbGluZVxyXG4gKiBAZXhhbXBsZVxyXG4gKiBsaW5lYXJSZWdyZXNzaW9uKFtbMCwgMF0sIFsxLCAxXV0pOyAvLyB7IG06IDEsIGI6IDAgfVxyXG4gKi9cclxuZnVuY3Rpb24gbGluZWFyUmVncmVzc2lvbihkYXRhLyo6IEFycmF5PEFycmF5PG51bWJlcj4+ICovKS8qOiB7IG06IG51bWJlciwgYjogbnVtYmVyIH0gKi8ge1xyXG5cclxuICAgIHZhciBtLCBiO1xyXG5cclxuICAgIC8vIFN0b3JlIGRhdGEgbGVuZ3RoIGluIGEgbG9jYWwgdmFyaWFibGUgdG8gcmVkdWNlXHJcbiAgICAvLyByZXBlYXRlZCBvYmplY3QgcHJvcGVydHkgbG9va3Vwc1xyXG4gICAgdmFyIGRhdGFMZW5ndGggPSBkYXRhLmxlbmd0aDtcclxuXHJcbiAgICAvL2lmIHRoZXJlJ3Mgb25seSBvbmUgcG9pbnQsIGFyYml0cmFyaWx5IGNob29zZSBhIHNsb3BlIG9mIDBcclxuICAgIC8vYW5kIGEgeS1pbnRlcmNlcHQgb2Ygd2hhdGV2ZXIgdGhlIHkgb2YgdGhlIGluaXRpYWwgcG9pbnQgaXNcclxuICAgIGlmIChkYXRhTGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgbSA9IDA7XHJcbiAgICAgICAgYiA9IGRhdGFbMF1bMV07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIEluaXRpYWxpemUgb3VyIHN1bXMgYW5kIHNjb3BlIHRoZSBgbWAgYW5kIGBiYFxyXG4gICAgICAgIC8vIHZhcmlhYmxlcyB0aGF0IGRlZmluZSB0aGUgbGluZS5cclxuICAgICAgICB2YXIgc3VtWCA9IDAsIHN1bVkgPSAwLFxyXG4gICAgICAgICAgICBzdW1YWCA9IDAsIHN1bVhZID0gMDtcclxuXHJcbiAgICAgICAgLy8gVXNlIGxvY2FsIHZhcmlhYmxlcyB0byBncmFiIHBvaW50IHZhbHVlc1xyXG4gICAgICAgIC8vIHdpdGggbWluaW1hbCBvYmplY3QgcHJvcGVydHkgbG9va3Vwc1xyXG4gICAgICAgIHZhciBwb2ludCwgeCwgeTtcclxuXHJcbiAgICAgICAgLy8gR2F0aGVyIHRoZSBzdW0gb2YgYWxsIHggdmFsdWVzLCB0aGUgc3VtIG9mIGFsbFxyXG4gICAgICAgIC8vIHkgdmFsdWVzLCBhbmQgdGhlIHN1bSBvZiB4XjIgYW5kICh4KnkpIGZvciBlYWNoXHJcbiAgICAgICAgLy8gdmFsdWUuXHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBJbiBtYXRoIG5vdGF0aW9uLCB0aGVzZSB3b3VsZCBiZSBTU194LCBTU195LCBTU194eCwgYW5kIFNTX3h5XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcG9pbnQgPSBkYXRhW2ldO1xyXG4gICAgICAgICAgICB4ID0gcG9pbnRbMF07XHJcbiAgICAgICAgICAgIHkgPSBwb2ludFsxXTtcclxuXHJcbiAgICAgICAgICAgIHN1bVggKz0geDtcclxuICAgICAgICAgICAgc3VtWSArPSB5O1xyXG5cclxuICAgICAgICAgICAgc3VtWFggKz0geCAqIHg7XHJcbiAgICAgICAgICAgIHN1bVhZICs9IHggKiB5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gYG1gIGlzIHRoZSBzbG9wZSBvZiB0aGUgcmVncmVzc2lvbiBsaW5lXHJcbiAgICAgICAgbSA9ICgoZGF0YUxlbmd0aCAqIHN1bVhZKSAtIChzdW1YICogc3VtWSkpIC9cclxuICAgICAgICAgICAgKChkYXRhTGVuZ3RoICogc3VtWFgpIC0gKHN1bVggKiBzdW1YKSk7XHJcblxyXG4gICAgICAgIC8vIGBiYCBpcyB0aGUgeS1pbnRlcmNlcHQgb2YgdGhlIGxpbmUuXHJcbiAgICAgICAgYiA9IChzdW1ZIC8gZGF0YUxlbmd0aCkgLSAoKG0gKiBzdW1YKSAvIGRhdGFMZW5ndGgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJldHVybiBib3RoIHZhbHVlcyBhcyBhbiBvYmplY3QuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG06IG0sXHJcbiAgICAgICAgYjogYlxyXG4gICAgfTtcclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGluZWFyUmVncmVzc2lvbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxuLyoqXHJcbiAqIEdpdmVuIHRoZSBvdXRwdXQgb2YgYGxpbmVhclJlZ3Jlc3Npb25gOiBhbiBvYmplY3RcclxuICogd2l0aCBgbWAgYW5kIGBiYCB2YWx1ZXMgaW5kaWNhdGluZyBzbG9wZSBhbmQgaW50ZXJjZXB0LFxyXG4gKiByZXNwZWN0aXZlbHksIGdlbmVyYXRlIGEgbGluZSBmdW5jdGlvbiB0aGF0IHRyYW5zbGF0ZXNcclxuICogeCB2YWx1ZXMgaW50byB5IHZhbHVlcy5cclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9IG1iIG9iamVjdCB3aXRoIGBtYCBhbmQgYGJgIG1lbWJlcnMsIHJlcHJlc2VudGluZ1xyXG4gKiBzbG9wZSBhbmQgaW50ZXJzZWN0IG9mIGRlc2lyZWQgbGluZVxyXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IG1ldGhvZCB0aGF0IGNvbXB1dGVzIHktdmFsdWUgYXQgYW55IGdpdmVuXHJcbiAqIHgtdmFsdWUgb24gdGhlIGxpbmUuXHJcbiAqIEBleGFtcGxlXHJcbiAqIHZhciBsID0gbGluZWFyUmVncmVzc2lvbkxpbmUobGluZWFyUmVncmVzc2lvbihbWzAsIDBdLCBbMSwgMV1dKSk7XHJcbiAqIGwoMCkgLy89IDBcclxuICogbCgyKSAvLz0gMlxyXG4gKi9cclxuZnVuY3Rpb24gbGluZWFyUmVncmVzc2lvbkxpbmUobWIvKjogeyBiOiBudW1iZXIsIG06IG51bWJlciB9Ki8pLyo6IEZ1bmN0aW9uICovIHtcclxuICAgIC8vIFJldHVybiBhIGZ1bmN0aW9uIHRoYXQgY29tcHV0ZXMgYSBgeWAgdmFsdWUgZm9yIGVhY2hcclxuICAgIC8vIHggdmFsdWUgaXQgaXMgZ2l2ZW4sIGJhc2VkIG9uIHRoZSB2YWx1ZXMgb2YgYGJgIGFuZCBgYWBcclxuICAgIC8vIHRoYXQgd2UganVzdCBjb21wdXRlZC5cclxuICAgIHJldHVybiBmdW5jdGlvbih4KSB7XHJcbiAgICAgICAgcmV0dXJuIG1iLmIgKyAobWIubSAqIHgpO1xyXG4gICAgfTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsaW5lYXJSZWdyZXNzaW9uTGluZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIHN1bSA9IHJlcXVpcmUoJy4vc3VtJyk7XHJcblxyXG4vKipcclxuICogVGhlIG1lYW4sIF9hbHNvIGtub3duIGFzIGF2ZXJhZ2VfLFxyXG4gKiBpcyB0aGUgc3VtIG9mIGFsbCB2YWx1ZXMgb3ZlciB0aGUgbnVtYmVyIG9mIHZhbHVlcy5cclxuICogVGhpcyBpcyBhIFttZWFzdXJlIG9mIGNlbnRyYWwgdGVuZGVuY3ldKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0NlbnRyYWxfdGVuZGVuY3kpOlxyXG4gKiBhIG1ldGhvZCBvZiBmaW5kaW5nIGEgdHlwaWNhbCBvciBjZW50cmFsIHZhbHVlIG9mIGEgc2V0IG9mIG51bWJlcnMuXHJcbiAqXHJcbiAqIFRoaXMgcnVucyBvbiBgTyhuKWAsIGxpbmVhciB0aW1lIGluIHJlc3BlY3QgdG8gdGhlIGFycmF5XHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBpbnB1dCB2YWx1ZXNcclxuICogQHJldHVybnMge251bWJlcn0gbWVhblxyXG4gKiBAZXhhbXBsZVxyXG4gKiBjb25zb2xlLmxvZyhtZWFuKFswLCAxMF0pKTsgLy8gNVxyXG4gKi9cclxuZnVuY3Rpb24gbWVhbih4IC8qOiBBcnJheTxudW1iZXI+ICovKS8qOm51bWJlciovIHtcclxuICAgIC8vIFRoZSBtZWFuIG9mIG5vIG51bWJlcnMgaXMgbnVsbFxyXG4gICAgaWYgKHgubGVuZ3RoID09PSAwKSB7IHJldHVybiBOYU47IH1cclxuXHJcbiAgICByZXR1cm4gc3VtKHgpIC8geC5sZW5ndGg7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWVhbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIHNhbXBsZUNvdmFyaWFuY2UgPSByZXF1aXJlKCcuL3NhbXBsZV9jb3ZhcmlhbmNlJyk7XHJcbnZhciBzYW1wbGVTdGFuZGFyZERldmlhdGlvbiA9IHJlcXVpcmUoJy4vc2FtcGxlX3N0YW5kYXJkX2RldmlhdGlvbicpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBbY29ycmVsYXRpb25dKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ29ycmVsYXRpb25fYW5kX2RlcGVuZGVuY2UpIGlzXHJcbiAqIGEgbWVhc3VyZSBvZiBob3cgY29ycmVsYXRlZCB0d28gZGF0YXNldHMgYXJlLCBiZXR3ZWVuIC0xIGFuZCAxXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBmaXJzdCBpbnB1dFxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHkgc2Vjb25kIGlucHV0XHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHNhbXBsZSBjb3JyZWxhdGlvblxyXG4gKiBAZXhhbXBsZVxyXG4gKiB2YXIgYSA9IFsxLCAyLCAzLCA0LCA1LCA2XTtcclxuICogdmFyIGIgPSBbMiwgMiwgMywgNCwgNSwgNjBdO1xyXG4gKiBzYW1wbGVDb3JyZWxhdGlvbihhLCBiKTsgLy89IDAuNjkxXHJcbiAqL1xyXG5mdW5jdGlvbiBzYW1wbGVDb3JyZWxhdGlvbih4Lyo6IEFycmF5PG51bWJlcj4gKi8sIHkvKjogQXJyYXk8bnVtYmVyPiAqLykvKjpudW1iZXIqLyB7XHJcbiAgICB2YXIgY292ID0gc2FtcGxlQ292YXJpYW5jZSh4LCB5KSxcclxuICAgICAgICB4c3RkID0gc2FtcGxlU3RhbmRhcmREZXZpYXRpb24oeCksXHJcbiAgICAgICAgeXN0ZCA9IHNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uKHkpO1xyXG5cclxuICAgIHJldHVybiBjb3YgLyB4c3RkIC8geXN0ZDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYW1wbGVDb3JyZWxhdGlvbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIG1lYW4gPSByZXF1aXJlKCcuL21lYW4nKTtcclxuXHJcbi8qKlxyXG4gKiBbU2FtcGxlIGNvdmFyaWFuY2VdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1NhbXBsZV9tZWFuX2FuZF9zYW1wbGVDb3ZhcmlhbmNlKSBvZiB0d28gZGF0YXNldHM6XHJcbiAqIGhvdyBtdWNoIGRvIHRoZSB0d28gZGF0YXNldHMgbW92ZSB0b2dldGhlcj9cclxuICogeCBhbmQgeSBhcmUgdHdvIGRhdGFzZXRzLCByZXByZXNlbnRlZCBhcyBhcnJheXMgb2YgbnVtYmVycy5cclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGZpcnN0IGlucHV0XHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geSBzZWNvbmQgaW5wdXRcclxuICogQHJldHVybnMge251bWJlcn0gc2FtcGxlIGNvdmFyaWFuY2VcclxuICogQGV4YW1wbGVcclxuICogdmFyIHggPSBbMSwgMiwgMywgNCwgNSwgNl07XHJcbiAqIHZhciB5ID0gWzYsIDUsIDQsIDMsIDIsIDFdO1xyXG4gKiBzYW1wbGVDb3ZhcmlhbmNlKHgsIHkpOyAvLz0gLTMuNVxyXG4gKi9cclxuZnVuY3Rpb24gc2FtcGxlQ292YXJpYW5jZSh4IC8qOkFycmF5PG51bWJlcj4qLywgeSAvKjpBcnJheTxudW1iZXI+Ki8pLyo6bnVtYmVyKi8ge1xyXG5cclxuICAgIC8vIFRoZSB0d28gZGF0YXNldHMgbXVzdCBoYXZlIHRoZSBzYW1lIGxlbmd0aCB3aGljaCBtdXN0IGJlIG1vcmUgdGhhbiAxXHJcbiAgICBpZiAoeC5sZW5ndGggPD0gMSB8fCB4Lmxlbmd0aCAhPT0geS5sZW5ndGgpIHtcclxuICAgICAgICByZXR1cm4gTmFOO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGRldGVybWluZSB0aGUgbWVhbiBvZiBlYWNoIGRhdGFzZXQgc28gdGhhdCB3ZSBjYW4ganVkZ2UgZWFjaFxyXG4gICAgLy8gdmFsdWUgb2YgdGhlIGRhdGFzZXQgZmFpcmx5IGFzIHRoZSBkaWZmZXJlbmNlIGZyb20gdGhlIG1lYW4uIHRoaXNcclxuICAgIC8vIHdheSwgaWYgb25lIGRhdGFzZXQgaXMgWzEsIDIsIDNdIGFuZCBbMiwgMywgNF0sIHRoZWlyIGNvdmFyaWFuY2VcclxuICAgIC8vIGRvZXMgbm90IHN1ZmZlciBiZWNhdXNlIG9mIHRoZSBkaWZmZXJlbmNlIGluIGFic29sdXRlIHZhbHVlc1xyXG4gICAgdmFyIHhtZWFuID0gbWVhbih4KSxcclxuICAgICAgICB5bWVhbiA9IG1lYW4oeSksXHJcbiAgICAgICAgc3VtID0gMDtcclxuXHJcbiAgICAvLyBmb3IgZWFjaCBwYWlyIG9mIHZhbHVlcywgdGhlIGNvdmFyaWFuY2UgaW5jcmVhc2VzIHdoZW4gdGhlaXJcclxuICAgIC8vIGRpZmZlcmVuY2UgZnJvbSB0aGUgbWVhbiBpcyBhc3NvY2lhdGVkIC0gaWYgYm90aCBhcmUgd2VsbCBhYm92ZVxyXG4gICAgLy8gb3IgaWYgYm90aCBhcmUgd2VsbCBiZWxvd1xyXG4gICAgLy8gdGhlIG1lYW4sIHRoZSBjb3ZhcmlhbmNlIGluY3JlYXNlcyBzaWduaWZpY2FudGx5LlxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgc3VtICs9ICh4W2ldIC0geG1lYW4pICogKHlbaV0gLSB5bWVhbik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdGhpcyBpcyBCZXNzZWxzJyBDb3JyZWN0aW9uOiBhbiBhZGp1c3RtZW50IG1hZGUgdG8gc2FtcGxlIHN0YXRpc3RpY3NcclxuICAgIC8vIHRoYXQgYWxsb3dzIGZvciB0aGUgcmVkdWNlZCBkZWdyZWUgb2YgZnJlZWRvbSBlbnRhaWxlZCBpbiBjYWxjdWxhdGluZ1xyXG4gICAgLy8gdmFsdWVzIGZyb20gc2FtcGxlcyByYXRoZXIgdGhhbiBjb21wbGV0ZSBwb3B1bGF0aW9ucy5cclxuICAgIHZhciBiZXNzZWxzQ29ycmVjdGlvbiA9IHgubGVuZ3RoIC0gMTtcclxuXHJcbiAgICAvLyB0aGUgY292YXJpYW5jZSBpcyB3ZWlnaHRlZCBieSB0aGUgbGVuZ3RoIG9mIHRoZSBkYXRhc2V0cy5cclxuICAgIHJldHVybiBzdW0gLyBiZXNzZWxzQ29ycmVjdGlvbjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYW1wbGVDb3ZhcmlhbmNlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgc2FtcGxlVmFyaWFuY2UgPSByZXF1aXJlKCcuL3NhbXBsZV92YXJpYW5jZScpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBbc3RhbmRhcmQgZGV2aWF0aW9uXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1N0YW5kYXJkX2RldmlhdGlvbilcclxuICogaXMgdGhlIHNxdWFyZSByb290IG9mIHRoZSB2YXJpYW5jZS5cclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGlucHV0IGFycmF5XHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHNhbXBsZSBzdGFuZGFyZCBkZXZpYXRpb25cclxuICogQGV4YW1wbGVcclxuICogc3Muc2FtcGxlU3RhbmRhcmREZXZpYXRpb24oWzIsIDQsIDQsIDQsIDUsIDUsIDcsIDldKTtcclxuICogLy89IDIuMTM4XHJcbiAqL1xyXG5mdW5jdGlvbiBzYW1wbGVTdGFuZGFyZERldmlhdGlvbih4Lyo6QXJyYXk8bnVtYmVyPiovKS8qOm51bWJlciovIHtcclxuICAgIC8vIFRoZSBzdGFuZGFyZCBkZXZpYXRpb24gb2Ygbm8gbnVtYmVycyBpcyBudWxsXHJcbiAgICB2YXIgc2FtcGxlVmFyaWFuY2VYID0gc2FtcGxlVmFyaWFuY2UoeCk7XHJcbiAgICBpZiAoaXNOYU4oc2FtcGxlVmFyaWFuY2VYKSkgeyByZXR1cm4gTmFOOyB9XHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHNhbXBsZVZhcmlhbmNlWCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2FtcGxlU3RhbmRhcmREZXZpYXRpb247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBzdW1OdGhQb3dlckRldmlhdGlvbnMgPSByZXF1aXJlKCcuL3N1bV9udGhfcG93ZXJfZGV2aWF0aW9ucycpO1xyXG5cclxuLypcclxuICogVGhlIFtzYW1wbGUgdmFyaWFuY2VdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1ZhcmlhbmNlI1NhbXBsZV92YXJpYW5jZSlcclxuICogaXMgdGhlIHN1bSBvZiBzcXVhcmVkIGRldmlhdGlvbnMgZnJvbSB0aGUgbWVhbi4gVGhlIHNhbXBsZSB2YXJpYW5jZVxyXG4gKiBpcyBkaXN0aW5ndWlzaGVkIGZyb20gdGhlIHZhcmlhbmNlIGJ5IHRoZSB1c2FnZSBvZiBbQmVzc2VsJ3MgQ29ycmVjdGlvbl0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQmVzc2VsJ3NfY29ycmVjdGlvbik6XHJcbiAqIGluc3RlYWQgb2YgZGl2aWRpbmcgdGhlIHN1bSBvZiBzcXVhcmVkIGRldmlhdGlvbnMgYnkgdGhlIGxlbmd0aCBvZiB0aGUgaW5wdXQsXHJcbiAqIGl0IGlzIGRpdmlkZWQgYnkgdGhlIGxlbmd0aCBtaW51cyBvbmUuIFRoaXMgY29ycmVjdHMgdGhlIGJpYXMgaW4gZXN0aW1hdGluZ1xyXG4gKiBhIHZhbHVlIGZyb20gYSBzZXQgdGhhdCB5b3UgZG9uJ3Qga25vdyBpZiBmdWxsLlxyXG4gKlxyXG4gKiBSZWZlcmVuY2VzOlxyXG4gKiAqIFtXb2xmcmFtIE1hdGhXb3JsZCBvbiBTYW1wbGUgVmFyaWFuY2VdKGh0dHA6Ly9tYXRod29ybGQud29sZnJhbS5jb20vU2FtcGxlVmFyaWFuY2UuaHRtbClcclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGlucHV0IGFycmF5XHJcbiAqIEByZXR1cm4ge251bWJlcn0gc2FtcGxlIHZhcmlhbmNlXHJcbiAqIEBleGFtcGxlXHJcbiAqIHNhbXBsZVZhcmlhbmNlKFsxLCAyLCAzLCA0LCA1XSk7IC8vPSAyLjVcclxuICovXHJcbmZ1bmN0aW9uIHNhbXBsZVZhcmlhbmNlKHggLyo6IEFycmF5PG51bWJlcj4gKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgLy8gVGhlIHZhcmlhbmNlIG9mIG5vIG51bWJlcnMgaXMgbnVsbFxyXG4gICAgaWYgKHgubGVuZ3RoIDw9IDEpIHsgcmV0dXJuIE5hTjsgfVxyXG5cclxuICAgIHZhciBzdW1TcXVhcmVkRGV2aWF0aW9uc1ZhbHVlID0gc3VtTnRoUG93ZXJEZXZpYXRpb25zKHgsIDIpO1xyXG5cclxuICAgIC8vIHRoaXMgaXMgQmVzc2VscycgQ29ycmVjdGlvbjogYW4gYWRqdXN0bWVudCBtYWRlIHRvIHNhbXBsZSBzdGF0aXN0aWNzXHJcbiAgICAvLyB0aGF0IGFsbG93cyBmb3IgdGhlIHJlZHVjZWQgZGVncmVlIG9mIGZyZWVkb20gZW50YWlsZWQgaW4gY2FsY3VsYXRpbmdcclxuICAgIC8vIHZhbHVlcyBmcm9tIHNhbXBsZXMgcmF0aGVyIHRoYW4gY29tcGxldGUgcG9wdWxhdGlvbnMuXHJcbiAgICB2YXIgYmVzc2Vsc0NvcnJlY3Rpb24gPSB4Lmxlbmd0aCAtIDE7XHJcblxyXG4gICAgLy8gRmluZCB0aGUgbWVhbiB2YWx1ZSBvZiB0aGF0IGxpc3RcclxuICAgIHJldHVybiBzdW1TcXVhcmVkRGV2aWF0aW9uc1ZhbHVlIC8gYmVzc2Vsc0NvcnJlY3Rpb247XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2FtcGxlVmFyaWFuY2U7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciB2YXJpYW5jZSA9IHJlcXVpcmUoJy4vdmFyaWFuY2UnKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgW3N0YW5kYXJkIGRldmlhdGlvbl0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TdGFuZGFyZF9kZXZpYXRpb24pXHJcbiAqIGlzIHRoZSBzcXVhcmUgcm9vdCBvZiB0aGUgdmFyaWFuY2UuIEl0J3MgdXNlZnVsIGZvciBtZWFzdXJpbmcgdGhlIGFtb3VudFxyXG4gKiBvZiB2YXJpYXRpb24gb3IgZGlzcGVyc2lvbiBpbiBhIHNldCBvZiB2YWx1ZXMuXHJcbiAqXHJcbiAqIFN0YW5kYXJkIGRldmlhdGlvbiBpcyBvbmx5IGFwcHJvcHJpYXRlIGZvciBmdWxsLXBvcHVsYXRpb24ga25vd2xlZGdlOiBmb3JcclxuICogc2FtcGxlcyBvZiBhIHBvcHVsYXRpb24sIHtAbGluayBzYW1wbGVTdGFuZGFyZERldmlhdGlvbn0gaXNcclxuICogbW9yZSBhcHByb3ByaWF0ZS5cclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGlucHV0XHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHN0YW5kYXJkIGRldmlhdGlvblxyXG4gKiBAZXhhbXBsZVxyXG4gKiB2YXIgc2NvcmVzID0gWzIsIDQsIDQsIDQsIDUsIDUsIDcsIDldO1xyXG4gKiB2YXJpYW5jZShzY29yZXMpOyAvLz0gNFxyXG4gKiBzdGFuZGFyZERldmlhdGlvbihzY29yZXMpOyAvLz0gMlxyXG4gKi9cclxuZnVuY3Rpb24gc3RhbmRhcmREZXZpYXRpb24oeCAvKjogQXJyYXk8bnVtYmVyPiAqLykvKjpudW1iZXIqLyB7XHJcbiAgICAvLyBUaGUgc3RhbmRhcmQgZGV2aWF0aW9uIG9mIG5vIG51bWJlcnMgaXMgbnVsbFxyXG4gICAgdmFyIHYgPSB2YXJpYW5jZSh4KTtcclxuICAgIGlmIChpc05hTih2KSkgeyByZXR1cm4gMDsgfVxyXG4gICAgcmV0dXJuIE1hdGguc3FydCh2KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzdGFuZGFyZERldmlhdGlvbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxuLyoqXHJcbiAqIE91ciBkZWZhdWx0IHN1bSBpcyB0aGUgW0thaGFuIHN1bW1hdGlvbiBhbGdvcml0aG1dKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0thaGFuX3N1bW1hdGlvbl9hbGdvcml0aG0pIGlzXHJcbiAqIGEgbWV0aG9kIGZvciBjb21wdXRpbmcgdGhlIHN1bSBvZiBhIGxpc3Qgb2YgbnVtYmVycyB3aGlsZSBjb3JyZWN0aW5nXHJcbiAqIGZvciBmbG9hdGluZy1wb2ludCBlcnJvcnMuIFRyYWRpdGlvbmFsbHksIHN1bXMgYXJlIGNhbGN1bGF0ZWQgYXMgbWFueVxyXG4gKiBzdWNjZXNzaXZlIGFkZGl0aW9ucywgZWFjaCBvbmUgd2l0aCBpdHMgb3duIGZsb2F0aW5nLXBvaW50IHJvdW5kb2ZmLiBUaGVzZVxyXG4gKiBsb3NzZXMgaW4gcHJlY2lzaW9uIGFkZCB1cCBhcyB0aGUgbnVtYmVyIG9mIG51bWJlcnMgaW5jcmVhc2VzLiBUaGlzIGFsdGVybmF0aXZlXHJcbiAqIGFsZ29yaXRobSBpcyBtb3JlIGFjY3VyYXRlIHRoYW4gdGhlIHNpbXBsZSB3YXkgb2YgY2FsY3VsYXRpbmcgc3VtcyBieSBzaW1wbGVcclxuICogYWRkaXRpb24uXHJcbiAqXHJcbiAqIFRoaXMgcnVucyBvbiBgTyhuKWAsIGxpbmVhciB0aW1lIGluIHJlc3BlY3QgdG8gdGhlIGFycmF5XHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBpbnB1dFxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IHN1bSBvZiBhbGwgaW5wdXQgbnVtYmVyc1xyXG4gKiBAZXhhbXBsZVxyXG4gKiBjb25zb2xlLmxvZyhzdW0oWzEsIDIsIDNdKSk7IC8vIDZcclxuICovXHJcbmZ1bmN0aW9uIHN1bSh4Lyo6IEFycmF5PG51bWJlcj4gKi8pLyo6IG51bWJlciAqLyB7XHJcblxyXG4gICAgLy8gbGlrZSB0aGUgdHJhZGl0aW9uYWwgc3VtIGFsZ29yaXRobSwgd2Uga2VlcCBhIHJ1bm5pbmdcclxuICAgIC8vIGNvdW50IG9mIHRoZSBjdXJyZW50IHN1bS5cclxuICAgIHZhciBzdW0gPSAwO1xyXG5cclxuICAgIC8vIGJ1dCB3ZSBhbHNvIGtlZXAgdGhyZWUgZXh0cmEgdmFyaWFibGVzIGFzIGJvb2trZWVwaW5nOlxyXG4gICAgLy8gbW9zdCBpbXBvcnRhbnRseSwgYW4gZXJyb3IgY29ycmVjdGlvbiB2YWx1ZS4gVGhpcyB3aWxsIGJlIGEgdmVyeVxyXG4gICAgLy8gc21hbGwgbnVtYmVyIHRoYXQgaXMgdGhlIG9wcG9zaXRlIG9mIHRoZSBmbG9hdGluZyBwb2ludCBwcmVjaXNpb24gbG9zcy5cclxuICAgIHZhciBlcnJvckNvbXBlbnNhdGlvbiA9IDA7XHJcblxyXG4gICAgLy8gdGhpcyB3aWxsIGJlIGVhY2ggbnVtYmVyIGluIHRoZSBsaXN0IGNvcnJlY3RlZCB3aXRoIHRoZSBjb21wZW5zYXRpb24gdmFsdWUuXHJcbiAgICB2YXIgY29ycmVjdGVkQ3VycmVudFZhbHVlO1xyXG5cclxuICAgIC8vIGFuZCB0aGlzIHdpbGwgYmUgdGhlIG5leHQgc3VtXHJcbiAgICB2YXIgbmV4dFN1bTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAvLyBmaXJzdCBjb3JyZWN0IHRoZSB2YWx1ZSB0aGF0IHdlJ3JlIGdvaW5nIHRvIGFkZCB0byB0aGUgc3VtXHJcbiAgICAgICAgY29ycmVjdGVkQ3VycmVudFZhbHVlID0geFtpXSAtIGVycm9yQ29tcGVuc2F0aW9uO1xyXG5cclxuICAgICAgICAvLyBjb21wdXRlIHRoZSBuZXh0IHN1bS4gc3VtIGlzIGxpa2VseSBhIG11Y2ggbGFyZ2VyIG51bWJlclxyXG4gICAgICAgIC8vIHRoYW4gY29ycmVjdGVkQ3VycmVudFZhbHVlLCBzbyB3ZSdsbCBsb3NlIHByZWNpc2lvbiBoZXJlLFxyXG4gICAgICAgIC8vIGFuZCBtZWFzdXJlIGhvdyBtdWNoIHByZWNpc2lvbiBpcyBsb3N0IGluIHRoZSBuZXh0IHN0ZXBcclxuICAgICAgICBuZXh0U3VtID0gc3VtICsgY29ycmVjdGVkQ3VycmVudFZhbHVlO1xyXG5cclxuICAgICAgICAvLyB3ZSBpbnRlbnRpb25hbGx5IGRpZG4ndCBhc3NpZ24gc3VtIGltbWVkaWF0ZWx5LCBidXQgc3RvcmVkXHJcbiAgICAgICAgLy8gaXQgZm9yIG5vdyBzbyB3ZSBjYW4gZmlndXJlIG91dCB0aGlzOiBpcyAoc3VtICsgbmV4dFZhbHVlKSAtIG5leHRWYWx1ZVxyXG4gICAgICAgIC8vIG5vdCBlcXVhbCB0byAwPyBpZGVhbGx5IGl0IHdvdWxkIGJlLCBidXQgaW4gcHJhY3RpY2UgaXQgd29uJ3Q6XHJcbiAgICAgICAgLy8gaXQgd2lsbCBiZSBzb21lIHZlcnkgc21hbGwgbnVtYmVyLiB0aGF0J3Mgd2hhdCB3ZSByZWNvcmRcclxuICAgICAgICAvLyBhcyBlcnJvckNvbXBlbnNhdGlvbi5cclxuICAgICAgICBlcnJvckNvbXBlbnNhdGlvbiA9IG5leHRTdW0gLSBzdW0gLSBjb3JyZWN0ZWRDdXJyZW50VmFsdWU7XHJcblxyXG4gICAgICAgIC8vIG5vdyB0aGF0IHdlJ3ZlIGNvbXB1dGVkIGhvdyBtdWNoIHdlJ2xsIGNvcnJlY3QgZm9yIGluIHRoZSBuZXh0XHJcbiAgICAgICAgLy8gbG9vcCwgc3RhcnQgdHJlYXRpbmcgdGhlIG5leHRTdW0gYXMgdGhlIGN1cnJlbnQgc3VtLlxyXG4gICAgICAgIHN1bSA9IG5leHRTdW07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHN1bTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzdW07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBtZWFuID0gcmVxdWlyZSgnLi9tZWFuJyk7XHJcblxyXG4vKipcclxuICogVGhlIHN1bSBvZiBkZXZpYXRpb25zIHRvIHRoZSBOdGggcG93ZXIuXHJcbiAqIFdoZW4gbj0yIGl0J3MgdGhlIHN1bSBvZiBzcXVhcmVkIGRldmlhdGlvbnMuXHJcbiAqIFdoZW4gbj0zIGl0J3MgdGhlIHN1bSBvZiBjdWJlZCBkZXZpYXRpb25zLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHhcclxuICogQHBhcmFtIHtudW1iZXJ9IG4gcG93ZXJcclxuICogQHJldHVybnMge251bWJlcn0gc3VtIG9mIG50aCBwb3dlciBkZXZpYXRpb25zXHJcbiAqIEBleGFtcGxlXHJcbiAqIHZhciBpbnB1dCA9IFsxLCAyLCAzXTtcclxuICogLy8gc2luY2UgdGhlIHZhcmlhbmNlIG9mIGEgc2V0IGlzIHRoZSBtZWFuIHNxdWFyZWRcclxuICogLy8gZGV2aWF0aW9ucywgd2UgY2FuIGNhbGN1bGF0ZSB0aGF0IHdpdGggc3VtTnRoUG93ZXJEZXZpYXRpb25zOlxyXG4gKiB2YXIgdmFyaWFuY2UgPSBzdW1OdGhQb3dlckRldmlhdGlvbnMoaW5wdXQpIC8gaW5wdXQubGVuZ3RoO1xyXG4gKi9cclxuZnVuY3Rpb24gc3VtTnRoUG93ZXJEZXZpYXRpb25zKHgvKjogQXJyYXk8bnVtYmVyPiAqLywgbi8qOiBudW1iZXIgKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgdmFyIG1lYW5WYWx1ZSA9IG1lYW4oeCksXHJcbiAgICAgICAgc3VtID0gMDtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBzdW0gKz0gTWF0aC5wb3coeFtpXSAtIG1lYW5WYWx1ZSwgbik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHN1bTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzdW1OdGhQb3dlckRldmlhdGlvbnM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBzdW1OdGhQb3dlckRldmlhdGlvbnMgPSByZXF1aXJlKCcuL3N1bV9udGhfcG93ZXJfZGV2aWF0aW9ucycpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBbdmFyaWFuY2VdKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVmFyaWFuY2UpXHJcbiAqIGlzIHRoZSBzdW0gb2Ygc3F1YXJlZCBkZXZpYXRpb25zIGZyb20gdGhlIG1lYW4uXHJcbiAqXHJcbiAqIFRoaXMgaXMgYW4gaW1wbGVtZW50YXRpb24gb2YgdmFyaWFuY2UsIG5vdCBzYW1wbGUgdmFyaWFuY2U6XHJcbiAqIHNlZSB0aGUgYHNhbXBsZVZhcmlhbmNlYCBtZXRob2QgaWYgeW91IHdhbnQgYSBzYW1wbGUgbWVhc3VyZS5cclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4IGEgcG9wdWxhdGlvblxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSB2YXJpYW5jZTogYSB2YWx1ZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gemVyby5cclxuICogemVybyBpbmRpY2F0ZXMgdGhhdCBhbGwgdmFsdWVzIGFyZSBpZGVudGljYWwuXHJcbiAqIEBleGFtcGxlXHJcbiAqIHNzLnZhcmlhbmNlKFsxLCAyLCAzLCA0LCA1LCA2XSk7IC8vPSAyLjkxN1xyXG4gKi9cclxuZnVuY3Rpb24gdmFyaWFuY2UoeC8qOiBBcnJheTxudW1iZXI+ICovKS8qOm51bWJlciovIHtcclxuICAgIC8vIFRoZSB2YXJpYW5jZSBvZiBubyBudW1iZXJzIGlzIG51bGxcclxuICAgIGlmICh4Lmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gTmFOOyB9XHJcblxyXG4gICAgLy8gRmluZCB0aGUgbWVhbiBvZiBzcXVhcmVkIGRldmlhdGlvbnMgYmV0d2VlbiB0aGVcclxuICAgIC8vIG1lYW4gdmFsdWUgYW5kIGVhY2ggdmFsdWUuXHJcbiAgICByZXR1cm4gc3VtTnRoUG93ZXJEZXZpYXRpb25zKHgsIDIpIC8geC5sZW5ndGg7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdmFyaWFuY2U7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbi8qKlxyXG4gKiBUaGUgW1otU2NvcmUsIG9yIFN0YW5kYXJkIFNjb3JlXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1N0YW5kYXJkX3Njb3JlKS5cclxuICpcclxuICogVGhlIHN0YW5kYXJkIHNjb3JlIGlzIHRoZSBudW1iZXIgb2Ygc3RhbmRhcmQgZGV2aWF0aW9ucyBhbiBvYnNlcnZhdGlvblxyXG4gKiBvciBkYXR1bSBpcyBhYm92ZSBvciBiZWxvdyB0aGUgbWVhbi4gVGh1cywgYSBwb3NpdGl2ZSBzdGFuZGFyZCBzY29yZVxyXG4gKiByZXByZXNlbnRzIGEgZGF0dW0gYWJvdmUgdGhlIG1lYW4sIHdoaWxlIGEgbmVnYXRpdmUgc3RhbmRhcmQgc2NvcmVcclxuICogcmVwcmVzZW50cyBhIGRhdHVtIGJlbG93IHRoZSBtZWFuLiBJdCBpcyBhIGRpbWVuc2lvbmxlc3MgcXVhbnRpdHlcclxuICogb2J0YWluZWQgYnkgc3VidHJhY3RpbmcgdGhlIHBvcHVsYXRpb24gbWVhbiBmcm9tIGFuIGluZGl2aWR1YWwgcmF3XHJcbiAqIHNjb3JlIGFuZCB0aGVuIGRpdmlkaW5nIHRoZSBkaWZmZXJlbmNlIGJ5IHRoZSBwb3B1bGF0aW9uIHN0YW5kYXJkXHJcbiAqIGRldmlhdGlvbi5cclxuICpcclxuICogVGhlIHotc2NvcmUgaXMgb25seSBkZWZpbmVkIGlmIG9uZSBrbm93cyB0aGUgcG9wdWxhdGlvbiBwYXJhbWV0ZXJzO1xyXG4gKiBpZiBvbmUgb25seSBoYXMgYSBzYW1wbGUgc2V0LCB0aGVuIHRoZSBhbmFsb2dvdXMgY29tcHV0YXRpb24gd2l0aFxyXG4gKiBzYW1wbGUgbWVhbiBhbmQgc2FtcGxlIHN0YW5kYXJkIGRldmlhdGlvbiB5aWVsZHMgdGhlXHJcbiAqIFN0dWRlbnQncyB0LXN0YXRpc3RpYy5cclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IHhcclxuICogQHBhcmFtIHtudW1iZXJ9IG1lYW5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YW5kYXJkRGV2aWF0aW9uXHJcbiAqIEByZXR1cm4ge251bWJlcn0geiBzY29yZVxyXG4gKiBAZXhhbXBsZVxyXG4gKiBzcy56U2NvcmUoNzgsIDgwLCA1KTsgLy89IC0wLjRcclxuICovXHJcbmZ1bmN0aW9uIHpTY29yZSh4Lyo6bnVtYmVyKi8sIG1lYW4vKjpudW1iZXIqLywgc3RhbmRhcmREZXZpYXRpb24vKjpudW1iZXIqLykvKjpudW1iZXIqLyB7XHJcbiAgICByZXR1cm4gKHggLSBtZWFuKSAvIHN0YW5kYXJkRGV2aWF0aW9uO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHpTY29yZTtcclxuIiwiaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgQ2hhcnRDb25maWcge1xyXG4gICAgY3NzQ2xhc3NQcmVmaXggPSBcIm9kYy1cIjtcclxuICAgIHN2Z0NsYXNzID0gdGhpcy5jc3NDbGFzc1ByZWZpeCArICdtdy1kMy1jaGFydCc7XHJcbiAgICB3aWR0aCA9IHVuZGVmaW5lZDtcclxuICAgIGhlaWdodCA9IHVuZGVmaW5lZDtcclxuICAgIG1hcmdpbiA9IHtcclxuICAgICAgICBsZWZ0OiA1MCxcclxuICAgICAgICByaWdodDogMzAsXHJcbiAgICAgICAgdG9wOiAzMCxcclxuICAgICAgICBib3R0b206IDUwXHJcbiAgICB9O1xyXG4gICAgc2hvd1Rvb2x0aXAgPSBmYWxzZTtcclxuICAgIHRyYW5zaXRpb24gPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSkge1xyXG4gICAgICAgIGlmIChjdXN0b20pIHtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hhcnQge1xyXG4gICAgdXRpbHMgPSBVdGlscztcclxuICAgIGJhc2VDb250YWluZXI7XHJcbiAgICBzdmc7XHJcbiAgICBjb25maWc7XHJcbiAgICBwbG90ID0ge1xyXG4gICAgICAgIG1hcmdpbjoge31cclxuICAgIH07XHJcbiAgICBfYXR0YWNoZWQgPSB7fTtcclxuICAgIF9sYXllcnMgPSB7fTtcclxuICAgIF9ldmVudHMgPSB7fTtcclxuICAgIF9pc0F0dGFjaGVkO1xyXG4gICAgX2lzSW5pdGlhbGl6ZWQ9ZmFsc2U7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGJhc2UsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2lzQXR0YWNoZWQgPSBiYXNlIGluc3RhbmNlb2YgQ2hhcnQ7XHJcblxyXG4gICAgICAgIHRoaXMuYmFzZUNvbnRhaW5lciA9IGJhc2U7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0Q29uZmlnKGNvbmZpZyk7XHJcblxyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YShkYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgICAgIHRoaXMucG9zdEluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKSB7XHJcbiAgICAgICAgaWYgKCFjb25maWcpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBuZXcgQ2hhcnRDb25maWcoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldERhdGEoZGF0YSkge1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cclxuICAgICAgICBzZWxmLmluaXRQbG90KCk7XHJcbiAgICAgICAgc2VsZi5pbml0U3ZnKCk7XHJcblxyXG4gICAgICAgIHNlbGYuaW5pdFRvb2x0aXAoKTtcclxuICAgICAgICBzZWxmLmRyYXcoKTtcclxuICAgICAgICB0aGlzLl9pc0luaXRpYWxpemVkPXRydWU7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcG9zdEluaXQoKXtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFN2ZygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGNvbmZpZyA9IHRoaXMuY29uZmlnO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGNvbmZpZy5zdmdDbGFzcyk7XHJcblxyXG4gICAgICAgIHZhciBtYXJnaW4gPSBzZWxmLnBsb3QubWFyZ2luO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IHNlbGYucGxvdC53aWR0aCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0O1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBzZWxmLnBsb3QuaGVpZ2h0ICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b207XHJcbiAgICAgICAgdmFyIGFzcGVjdCA9IHdpZHRoIC8gaGVpZ2h0O1xyXG4gICAgICAgIGlmKCFzZWxmLl9pc0F0dGFjaGVkKXtcclxuICAgICAgICAgICAgaWYoIXRoaXMuX2lzSW5pdGlhbGl6ZWQpe1xyXG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KHNlbGYuYmFzZUNvbnRhaW5lcikuc2VsZWN0KFwic3ZnXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNlbGYuc3ZnID0gZDMuc2VsZWN0KHNlbGYuYmFzZUNvbnRhaW5lcikuc2VsZWN0T3JBcHBlbmQoXCJzdmdcIik7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnN2Z1xyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidmlld0JveFwiLCBcIjAgMCBcIiArIFwiIFwiICsgd2lkdGggKyBcIiBcIiArIGhlaWdodClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwicHJlc2VydmVBc3BlY3RSYXRpb1wiLCBcInhNaWRZTWlkIG1lZXRcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgY29uZmlnLnN2Z0NsYXNzKTtcclxuICAgICAgICAgICAgc2VsZi5zdmdHID0gc2VsZi5zdmcuc2VsZWN0T3JBcHBlbmQoXCJnLm1haW4tZ3JvdXBcIik7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuYmFzZUNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIHNlbGYuc3ZnID0gc2VsZi5iYXNlQ29udGFpbmVyLnN2ZztcclxuICAgICAgICAgICAgc2VsZi5zdmdHID0gc2VsZi5zdmcuc2VsZWN0T3JBcHBlbmQoXCJnLm1haW4tZ3JvdXAuXCIrY29uZmlnLnN2Z0NsYXNzKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VsZi5zdmdHLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyBtYXJnaW4ubGVmdCArIFwiLFwiICsgbWFyZ2luLnRvcCArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgaWYgKCFjb25maWcud2lkdGggfHwgY29uZmlnLmhlaWdodCkge1xyXG4gICAgICAgICAgICBkMy5zZWxlY3Qod2luZG93KVxyXG4gICAgICAgICAgICAgICAgLm9uKFwicmVzaXplXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL1RPRE8gYWRkIHJlc3BvbnNpdmVuZXNzIGlmIHdpZHRoL2hlaWdodCBub3Qgc3BlY2lmaWVkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFRvb2x0aXAoKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLnNob3dUb29sdGlwKSB7XHJcbiAgICAgICAgICAgIGlmKCFzZWxmLl9pc0F0dGFjaGVkICl7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QudG9vbHRpcCA9IGQzLnNlbGVjdChcImJvZHlcIikuc2VsZWN0T3JBcHBlbmQoJ2Rpdi4nK3NlbGYuY29uZmlnLmNzc0NsYXNzUHJlZml4Kyd0b29sdGlwJylcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC50b29sdGlwPSBzZWxmLmJhc2VDb250YWluZXIucGxvdC50b29sdGlwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpIHtcclxuICAgICAgICB2YXIgbWFyZ2luID0gdGhpcy5jb25maWcubWFyZ2luO1xyXG4gICAgICAgIHRoaXMucGxvdD17XHJcbiAgICAgICAgICAgIG1hcmdpbjp7XHJcbiAgICAgICAgICAgICAgICB0b3A6IG1hcmdpbi50b3AsXHJcbiAgICAgICAgICAgICAgICBib3R0b206IG1hcmdpbi5ib3R0b20sXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiBtYXJnaW4ubGVmdCxcclxuICAgICAgICAgICAgICAgIHJpZ2h0OiBtYXJnaW4ucmlnaHRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRhdGEpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsYXllck5hbWUsIGF0dGFjaG1lbnREYXRhO1xyXG4gICAgICAgIGZvciAodmFyIGF0dGFjaG1lbnROYW1lIGluIHRoaXMuX2F0dGFjaGVkKSB7XHJcblxyXG4gICAgICAgICAgICBhdHRhY2htZW50RGF0YSA9IGRhdGE7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9hdHRhY2hlZFthdHRhY2htZW50TmFtZV0udXBkYXRlKGF0dGFjaG1lbnREYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2Jhc2UgdXBwZGF0ZScpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoZGF0YSkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlKGRhdGEpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vQm9ycm93ZWQgZnJvbSBkMy5jaGFydFxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWdpc3RlciBvciByZXRyaWV2ZSBhbiBcImF0dGFjaG1lbnRcIiBDaGFydC4gVGhlIFwiYXR0YWNobWVudFwiIGNoYXJ0J3MgYGRyYXdgXHJcbiAgICAgKiBtZXRob2Qgd2lsbCBiZSBpbnZva2VkIHdoZW5ldmVyIHRoZSBjb250YWluaW5nIGNoYXJ0J3MgYGRyYXdgIG1ldGhvZCBpc1xyXG4gICAgICogaW52b2tlZC5cclxuICAgICAqXHJcbiAgICAgKiBAZXh0ZXJuYWxFeGFtcGxlIGNoYXJ0LWF0dGFjaFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRhY2htZW50TmFtZSBOYW1lIG9mIHRoZSBhdHRhY2htZW50XHJcbiAgICAgKiBAcGFyYW0ge0NoYXJ0fSBbY2hhcnRdIENoYXJ0IHRvIHJlZ2lzdGVyIGFzIGEgbWl4IGluIG9mIHRoaXMgY2hhcnQuIFdoZW5cclxuICAgICAqICAgICAgICB1bnNwZWNpZmllZCwgdGhpcyBtZXRob2Qgd2lsbCByZXR1cm4gdGhlIGF0dGFjaG1lbnQgcHJldmlvdXNseVxyXG4gICAgICogICAgICAgIHJlZ2lzdGVyZWQgd2l0aCB0aGUgc3BlY2lmaWVkIGBhdHRhY2htZW50TmFtZWAgKGlmIGFueSkuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0NoYXJ0fSBSZWZlcmVuY2UgdG8gdGhpcyBjaGFydCAoY2hhaW5hYmxlKS5cclxuICAgICAqL1xyXG4gICAgYXR0YWNoKGF0dGFjaG1lbnROYW1lLCBjaGFydCkge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hdHRhY2hlZFthdHRhY2htZW50TmFtZV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9hdHRhY2hlZFthdHRhY2htZW50TmFtZV0gPSBjaGFydDtcclxuICAgICAgICByZXR1cm4gY2hhcnQ7XHJcbiAgICB9O1xyXG5cclxuICAgIFxyXG5cclxuICAgIC8vQm9ycm93ZWQgZnJvbSBkMy5jaGFydFxyXG4gICAgLyoqXHJcbiAgICAgKiBTdWJzY3JpYmUgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBhbiBldmVudCB0cmlnZ2VyZWQgb24gdGhlIGNoYXJ0LiBTZWUge0BsaW5rXHJcbiAgICAgICAgKiBDaGFydCNvbmNlfSB0byBzdWJzY3JpYmUgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBhbiBldmVudCBmb3Igb25lIG9jY3VyZW5jZS5cclxuICAgICAqXHJcbiAgICAgKiBAZXh0ZXJuYWxFeGFtcGxlIHtydW5uYWJsZX0gY2hhcnQtb25cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBldmVudFxyXG4gICAgICogQHBhcmFtIHtDaGFydEV2ZW50SGFuZGxlcn0gY2FsbGJhY2sgRnVuY3Rpb24gdG8gYmUgaW52b2tlZCB3aGVuIHRoZSBldmVudFxyXG4gICAgICogICAgICAgIG9jY3Vyc1xyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0XSBWYWx1ZSB0byBzZXQgYXMgYHRoaXNgIHdoZW4gaW52b2tpbmcgdGhlXHJcbiAgICAgKiAgICAgICAgYGNhbGxiYWNrYC4gRGVmYXVsdHMgdG8gdGhlIGNoYXJ0IGluc3RhbmNlLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtDaGFydH0gQSByZWZlcmVuY2UgdG8gdGhpcyBjaGFydCAoY2hhaW5hYmxlKS5cclxuICAgICAqL1xyXG4gICAgb24obmFtZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy5fZXZlbnRzW25hbWVdIHx8ICh0aGlzLl9ldmVudHNbbmFtZV0gPSBbXSk7XHJcbiAgICAgICAgZXZlbnRzLnB1c2goe1xyXG4gICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2ssXHJcbiAgICAgICAgICAgIGNvbnRleHQ6IGNvbnRleHQgfHwgdGhpcyxcclxuICAgICAgICAgICAgX2NoYXJ0OiB0aGlzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy9Cb3Jyb3dlZCBmcm9tIGQzLmNoYXJ0XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBTdWJzY3JpYmUgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBhbiBldmVudCB0cmlnZ2VyZWQgb24gdGhlIGNoYXJ0LiBUaGlzXHJcbiAgICAgKiBmdW5jdGlvbiB3aWxsIGJlIGludm9rZWQgYXQgdGhlIG5leHQgb2NjdXJhbmNlIG9mIHRoZSBldmVudCBhbmQgaW1tZWRpYXRlbHlcclxuICAgICAqIHVuc3Vic2NyaWJlZC4gU2VlIHtAbGluayBDaGFydCNvbn0gdG8gc3Vic2NyaWJlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYW5cclxuICAgICAqIGV2ZW50IGluZGVmaW5pdGVseS5cclxuICAgICAqXHJcbiAgICAgKiBAZXh0ZXJuYWxFeGFtcGxlIHtydW5uYWJsZX0gY2hhcnQtb25jZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGV2ZW50XHJcbiAgICAgKiBAcGFyYW0ge0NoYXJ0RXZlbnRIYW5kbGVyfSBjYWxsYmFjayBGdW5jdGlvbiB0byBiZSBpbnZva2VkIHdoZW4gdGhlIGV2ZW50XHJcbiAgICAgKiAgICAgICAgb2NjdXJzXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbnRleHRdIFZhbHVlIHRvIHNldCBhcyBgdGhpc2Agd2hlbiBpbnZva2luZyB0aGVcclxuICAgICAqICAgICAgICBgY2FsbGJhY2tgLiBEZWZhdWx0cyB0byB0aGUgY2hhcnQgaW5zdGFuY2VcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Q2hhcnR9IEEgcmVmZXJlbmNlIHRvIHRoaXMgY2hhcnQgKGNoYWluYWJsZSlcclxuICAgICAqL1xyXG4gICAgb25jZShuYW1lLCBjYWxsYmFjaywgY29udGV4dCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgb25jZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2VsZi5vZmYobmFtZSwgb25jZSk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gdGhpcy5vbihuYW1lLCBvbmNlLCBjb250ZXh0KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy9Cb3Jyb3dlZCBmcm9tIGQzLmNoYXJ0XHJcbiAgICAvKipcclxuICAgICAqIFVuc3Vic2NyaWJlIG9uZSBvciBtb3JlIGNhbGxiYWNrIGZ1bmN0aW9ucyBmcm9tIGFuIGV2ZW50IHRyaWdnZXJlZCBvbiB0aGVcclxuICAgICAqIGNoYXJ0LiBXaGVuIG5vIGFyZ3VtZW50cyBhcmUgc3BlY2lmaWVkLCAqYWxsKiBoYW5kbGVycyB3aWxsIGJlIHVuc3Vic2NyaWJlZC5cclxuICAgICAqIFdoZW4gb25seSBhIGBuYW1lYCBpcyBzcGVjaWZpZWQsIGFsbCBoYW5kbGVycyBzdWJzY3JpYmVkIHRvIHRoYXQgZXZlbnQgd2lsbFxyXG4gICAgICogYmUgdW5zdWJzY3JpYmVkLiBXaGVuIGEgYG5hbWVgIGFuZCBgY2FsbGJhY2tgIGFyZSBzcGVjaWZpZWQsIG9ubHkgdGhhdFxyXG4gICAgICogZnVuY3Rpb24gd2lsbCBiZSB1bnN1YnNjcmliZWQgZnJvbSB0aGF0IGV2ZW50LiBXaGVuIGEgYG5hbWVgIGFuZCBgY29udGV4dGBcclxuICAgICAqIGFyZSBzcGVjaWZpZWQgKGJ1dCBgY2FsbGJhY2tgIGlzIG9taXR0ZWQpLCBhbGwgZXZlbnRzIGJvdW5kIHRvIHRoZSBnaXZlblxyXG4gICAgICogZXZlbnQgd2l0aCB0aGUgZ2l2ZW4gY29udGV4dCB3aWxsIGJlIHVuc3Vic2NyaWJlZC5cclxuICAgICAqXHJcbiAgICAgKiBAZXh0ZXJuYWxFeGFtcGxlIHtydW5uYWJsZX0gY2hhcnQtb2ZmXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFtuYW1lXSBOYW1lIG9mIHRoZSBldmVudCB0byBiZSB1bnN1YnNjcmliZWRcclxuICAgICAqIEBwYXJhbSB7Q2hhcnRFdmVudEhhbmRsZXJ9IFtjYWxsYmFja10gRnVuY3Rpb24gdG8gYmUgdW5zdWJzY3JpYmVkXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbnRleHRdIENvbnRleHRzIHRvIGJlIHVuc3Vic2NyaWJlXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0NoYXJ0fSBBIHJlZmVyZW5jZSB0byB0aGlzIGNoYXJ0IChjaGFpbmFibGUpLlxyXG4gICAgICovXHJcblxyXG4gICAgb2ZmKG5hbWUsIGNhbGxiYWNrLCBjb250ZXh0KSB7XHJcbiAgICAgICAgdmFyIG5hbWVzLCBuLCBldmVudHMsIGV2ZW50LCBpLCBqO1xyXG5cclxuICAgICAgICAvLyByZW1vdmUgYWxsIGV2ZW50c1xyXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGZvciAobmFtZSBpbiB0aGlzLl9ldmVudHMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1tuYW1lXS5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIGFsbCBldmVudHMgZm9yIGEgc3BlY2lmaWMgbmFtZVxyXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIGV2ZW50cyA9IHRoaXMuX2V2ZW50c1tuYW1lXTtcclxuICAgICAgICAgICAgaWYgKGV2ZW50cykge1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyByZW1vdmUgYWxsIGV2ZW50cyB0aGF0IG1hdGNoIHdoYXRldmVyIGNvbWJpbmF0aW9uIG9mIG5hbWUsIGNvbnRleHRcclxuICAgICAgICAvLyBhbmQgY2FsbGJhY2suXHJcbiAgICAgICAgbmFtZXMgPSBuYW1lID8gW25hbWVdIDogT2JqZWN0LmtleXModGhpcy5fZXZlbnRzKTtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbiA9IG5hbWVzW2ldO1xyXG4gICAgICAgICAgICBldmVudHMgPSB0aGlzLl9ldmVudHNbbl07XHJcbiAgICAgICAgICAgIGogPSBldmVudHMubGVuZ3RoO1xyXG4gICAgICAgICAgICB3aGlsZSAoai0tKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudCA9IGV2ZW50c1tqXTtcclxuICAgICAgICAgICAgICAgIGlmICgoY2FsbGJhY2sgJiYgY2FsbGJhY2sgPT09IGV2ZW50LmNhbGxiYWNrKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIChjb250ZXh0ICYmIGNvbnRleHQgPT09IGV2ZW50LmNvbnRleHQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnNwbGljZShqLCAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vQm9ycm93ZWQgZnJvbSBkMy5jaGFydFxyXG4gICAgLyoqXHJcbiAgICAgKiBQdWJsaXNoIGFuIGV2ZW50IG9uIHRoaXMgY2hhcnQgd2l0aCB0aGUgZ2l2ZW4gYG5hbWVgLlxyXG4gICAgICpcclxuICAgICAqIEBleHRlcm5hbEV4YW1wbGUge3J1bm5hYmxlfSBjaGFydC10cmlnZ2VyXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgZXZlbnQgdG8gcHVibGlzaFxyXG4gICAgICogQHBhcmFtIHsuLi4qfSBhcmd1bWVudHMgVmFsdWVzIHdpdGggd2hpY2ggdG8gaW52b2tlIHRoZSByZWdpc3RlcmVkXHJcbiAgICAgKiAgICAgICAgY2FsbGJhY2tzLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtDaGFydH0gQSByZWZlcmVuY2UgdG8gdGhpcyBjaGFydCAoY2hhaW5hYmxlKS5cclxuICAgICAqL1xyXG4gICAgdHJpZ2dlcihuYW1lKSB7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xyXG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLl9ldmVudHNbbmFtZV07XHJcbiAgICAgICAgdmFyIGksIGV2O1xyXG5cclxuICAgICAgICBpZiAoZXZlbnRzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGV2ZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZXYgPSBldmVudHNbaV07XHJcbiAgICAgICAgICAgICAgICBldi5jYWxsYmFjay5hcHBseShldi5jb250ZXh0LCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgZ2V0QmFzZUNvbnRhaW5lcigpe1xyXG4gICAgICAgIGlmKHRoaXMuX2lzQXR0YWNoZWQpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5iYXNlQ29udGFpbmVyLnN2ZztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGQzLnNlbGVjdCh0aGlzLmJhc2VDb250YWluZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEJhc2VDb250YWluZXJOb2RlKCl7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmdldEJhc2VDb250YWluZXIoKS5ub2RlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJlZml4Q2xhc3MoY2xhenosIGFkZERvdCl7XHJcbiAgICAgICAgcmV0dXJuIGFkZERvdD8gJy4nOiAnJyt0aGlzLmNvbmZpZy5jc3NDbGFzc1ByZWZpeCtjbGF6ejtcclxuICAgIH1cclxuICAgIGNvbXB1dGVQbG90U2l6ZSgpIHtcclxuICAgICAgICB0aGlzLnBsb3Qud2lkdGggPSBVdGlscy5hdmFpbGFibGVXaWR0aCh0aGlzLmNvbmZpZy53aWR0aCwgdGhpcy5nZXRCYXNlQ29udGFpbmVyKCksIHRoaXMucGxvdC5tYXJnaW4pO1xyXG4gICAgICAgIHRoaXMucGxvdC5oZWlnaHQgPSBVdGlscy5hdmFpbGFibGVIZWlnaHQodGhpcy5jb25maWcuaGVpZ2h0LCB0aGlzLmdldEJhc2VDb250YWluZXIoKSwgdGhpcy5wbG90Lm1hcmdpbik7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDaGFydCwgQ2hhcnRDb25maWd9IGZyb20gXCIuL2NoYXJ0XCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7U3RhdGlzdGljc1V0aWxzfSBmcm9tICcuL3N0YXRpc3RpY3MtdXRpbHMnXHJcbmltcG9ydCB7TGVnZW5kfSBmcm9tICcuL2xlZ2VuZCdcclxuaW1wb3J0IHtTY2F0dGVyUGxvdH0gZnJvbSAnLi9zY2F0dGVycGxvdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBDb3JyZWxhdGlvbk1hdHJpeENvbmZpZyBleHRlbmRzIENoYXJ0Q29uZmlnIHtcclxuXHJcbiAgICBzdmdDbGFzcyA9ICdvZGMtY29ycmVsYXRpb24tbWF0cml4JztcclxuICAgIGd1aWRlcyA9IGZhbHNlOyAvL3Nob3cgYXhpcyBndWlkZXNcclxuICAgIHNob3dUb29sdGlwID0gdHJ1ZTsgLy9zaG93IHRvb2x0aXAgb24gZG90IGhvdmVyXHJcbiAgICBzaG93TGVnZW5kID0gdHJ1ZTtcclxuICAgIGhpZ2hsaWdodExhYmVscyA9IHRydWU7XHJcbiAgICByb3RhdGVMYWJlbHNYID0gdHJ1ZTtcclxuICAgIHJvdGF0ZUxhYmVsc1kgPSB0cnVlO1xyXG4gICAgdmFyaWFibGVzID0ge1xyXG4gICAgICAgIGxhYmVsczogdW5kZWZpbmVkLFxyXG4gICAgICAgIGtleXM6IFtdLCAvL29wdGlvbmFsIGFycmF5IG9mIHZhcmlhYmxlIGtleXNcclxuICAgICAgICB2YWx1ZTogKGQsIHZhcmlhYmxlS2V5KSA9PiBkW3ZhcmlhYmxlS2V5XSwgLy8gdmFyaWFibGUgdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICBzY2FsZTogXCJvcmRpbmFsXCJcclxuICAgIH07XHJcbiAgICBjb3JyZWxhdGlvbiA9IHtcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIixcclxuICAgICAgICBkb21haW46IFstMSwgLTAuNzUsIC0wLjUsIDAsIDAuNSwgMC43NSwgMV0sXHJcbiAgICAgICAgcmFuZ2U6IFtcImRhcmtibHVlXCIsIFwiYmx1ZVwiLCBcImxpZ2h0c2t5Ymx1ZVwiLCBcIndoaXRlXCIsIFwib3JhbmdlcmVkXCIsIFwiY3JpbXNvblwiLCBcImRhcmtyZWRcIl0sXHJcbiAgICAgICAgdmFsdWU6ICh4VmFsdWVzLCB5VmFsdWVzKSA9PiBTdGF0aXN0aWNzVXRpbHMuc2FtcGxlQ29ycmVsYXRpb24oeFZhbHVlcywgeVZhbHVlcylcclxuXHJcbiAgICB9O1xyXG4gICAgY2VsbCA9IHtcclxuICAgICAgICBzaGFwZTogXCJlbGxpcHNlXCIsIC8vcG9zc2libGUgdmFsdWVzOiByZWN0LCBjaXJjbGUsIGVsbGlwc2VcclxuICAgICAgICBzaXplOiB1bmRlZmluZWQsXHJcbiAgICAgICAgc2l6ZU1pbjogMTUsXHJcbiAgICAgICAgc2l6ZU1heDogMjUwLFxyXG4gICAgICAgIHBhZGRpbmc6IDFcclxuICAgIH07XHJcbiAgICBtYXJnaW4gPSB7XHJcbiAgICAgICAgbGVmdDogNjAsXHJcbiAgICAgICAgcmlnaHQ6IDUwLFxyXG4gICAgICAgIHRvcDogMzAsXHJcbiAgICAgICAgYm90dG9tOiA2MFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIGlmIChjdXN0b20pIHtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENvcnJlbGF0aW9uTWF0cml4IGV4dGVuZHMgQ2hhcnQge1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IENvcnJlbGF0aW9uTWF0cml4Q29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBDb3JyZWxhdGlvbk1hdHJpeENvbmZpZyhjb25maWcpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdFBsb3QoKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG1hcmdpbiA9IHRoaXMuY29uZmlnLm1hcmdpbjtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueCA9IHt9O1xyXG4gICAgICAgIHRoaXMucGxvdC5jb3JyZWxhdGlvbiA9IHtcclxuICAgICAgICAgICAgbWF0cml4OiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGNlbGxzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGNvbG9yOiB7fSxcclxuICAgICAgICAgICAgc2hhcGU6IHt9XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBWYXJpYWJsZXMoKTtcclxuICAgICAgICB2YXIgd2lkdGggPSBjb25mLndpZHRoO1xyXG4gICAgICAgIHZhciBwbGFjZWhvbGRlck5vZGUgPSB0aGlzLmdldEJhc2VDb250YWluZXJOb2RlKCk7XHJcbiAgICAgICAgdGhpcy5wbG90LnBsYWNlaG9sZGVyTm9kZSA9IHBsYWNlaG9sZGVyTm9kZTtcclxuXHJcbiAgICAgICAgdmFyIHBhcmVudFdpZHRoID0gcGxhY2Vob2xkZXJOb2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xyXG4gICAgICAgIGlmICh3aWR0aCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLnBsb3QuY2VsbFNpemUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsU2l6ZSA9IE1hdGgubWF4KGNvbmYuY2VsbC5zaXplTWluLCBNYXRoLm1pbihjb25mLmNlbGwuc2l6ZU1heCwgKHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQpIC8gdGhpcy5wbG90LnZhcmlhYmxlcy5sZW5ndGgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuY2VsbFNpemUgPSB0aGlzLmNvbmZpZy5jZWxsLnNpemU7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMucGxvdC5jZWxsU2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxTaXplID0gTWF0aC5tYXgoY29uZi5jZWxsLnNpemVNaW4sIE1hdGgubWluKGNvbmYuY2VsbC5zaXplTWF4LCAocGFyZW50V2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodCkgLyB0aGlzLnBsb3QudmFyaWFibGVzLmxlbmd0aCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB3aWR0aCA9IHRoaXMucGxvdC5jZWxsU2l6ZSAqIHRoaXMucGxvdC52YXJpYWJsZXMubGVuZ3RoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQ7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGhlaWdodCA9IHdpZHRoO1xyXG4gICAgICAgIGlmICghaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGhlaWdodCA9IHBsYWNlaG9sZGVyTm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnBsb3Qud2lkdGggPSB3aWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0O1xyXG4gICAgICAgIHRoaXMucGxvdC5oZWlnaHQgPSB0aGlzLnBsb3Qud2lkdGg7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBWYXJpYWJsZXNTY2FsZXMoKTtcclxuICAgICAgICB0aGlzLnNldHVwQ29ycmVsYXRpb25TY2FsZXMoKTtcclxuICAgICAgICB0aGlzLnNldHVwQ29ycmVsYXRpb25NYXRyaXgoKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwVmFyaWFibGVzU2NhbGVzKCkge1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeCA9IHBsb3QueDtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnLnZhcmlhYmxlcztcclxuXHJcbiAgICAgICAgLyogKlxyXG4gICAgICAgICAqIHZhbHVlIGFjY2Vzc29yIC0gcmV0dXJucyB0aGUgdmFsdWUgdG8gZW5jb2RlIGZvciBhIGdpdmVuIGRhdGEgb2JqZWN0LlxyXG4gICAgICAgICAqIHNjYWxlIC0gbWFwcyB2YWx1ZSB0byBhIHZpc3VhbCBkaXNwbGF5IGVuY29kaW5nLCBzdWNoIGFzIGEgcGl4ZWwgcG9zaXRpb24uXHJcbiAgICAgICAgICogbWFwIGZ1bmN0aW9uIC0gbWFwcyBmcm9tIGRhdGEgdmFsdWUgdG8gZGlzcGxheSB2YWx1ZVxyXG4gICAgICAgICAqIGF4aXMgLSBzZXRzIHVwIGF4aXNcclxuICAgICAgICAgKiovXHJcbiAgICAgICAgeC52YWx1ZSA9IGNvbmYudmFsdWU7XHJcbiAgICAgICAgeC5zY2FsZSA9IGQzLnNjYWxlW2NvbmYuc2NhbGVdKCkucmFuZ2VCYW5kcyhbcGxvdC53aWR0aCwgMF0pO1xyXG4gICAgICAgIHgubWFwID0gZCA9PiB4LnNjYWxlKHgudmFsdWUoZCkpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBDb3JyZWxhdGlvblNjYWxlcygpIHtcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgY29yckNvbmYgPSB0aGlzLmNvbmZpZy5jb3JyZWxhdGlvbjtcclxuXHJcbiAgICAgICAgcGxvdC5jb3JyZWxhdGlvbi5jb2xvci5zY2FsZSA9IGQzLnNjYWxlW2NvcnJDb25mLnNjYWxlXSgpLmRvbWFpbihjb3JyQ29uZi5kb21haW4pLnJhbmdlKGNvcnJDb25mLnJhbmdlKTtcclxuICAgICAgICB2YXIgc2hhcGUgPSBwbG90LmNvcnJlbGF0aW9uLnNoYXBlID0ge307XHJcblxyXG4gICAgICAgIHZhciBjZWxsQ29uZiA9IHRoaXMuY29uZmlnLmNlbGw7XHJcbiAgICAgICAgc2hhcGUudHlwZSA9IGNlbGxDb25mLnNoYXBlO1xyXG5cclxuICAgICAgICB2YXIgc2hhcGVTaXplID0gcGxvdC5jZWxsU2l6ZSAtIGNlbGxDb25mLnBhZGRpbmcgKiAyO1xyXG4gICAgICAgIGlmIChzaGFwZS50eXBlID09ICdjaXJjbGUnKSB7XHJcbiAgICAgICAgICAgIHZhciByYWRpdXNNYXggPSBzaGFwZVNpemUgLyAyO1xyXG4gICAgICAgICAgICBzaGFwZS5yYWRpdXNTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgMV0pLnJhbmdlKFsyLCByYWRpdXNNYXhdKTtcclxuICAgICAgICAgICAgc2hhcGUucmFkaXVzID0gYz0+IHNoYXBlLnJhZGl1c1NjYWxlKE1hdGguYWJzKGMudmFsdWUpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHNoYXBlLnR5cGUgPT0gJ2VsbGlwc2UnKSB7XHJcbiAgICAgICAgICAgIHZhciByYWRpdXNNYXggPSBzaGFwZVNpemUgLyAyO1xyXG4gICAgICAgICAgICBzaGFwZS5yYWRpdXNTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgMV0pLnJhbmdlKFtyYWRpdXNNYXgsIDJdKTtcclxuICAgICAgICAgICAgc2hhcGUucmFkaXVzWCA9IGM9PiBzaGFwZS5yYWRpdXNTY2FsZShNYXRoLmFicyhjLnZhbHVlKSk7XHJcbiAgICAgICAgICAgIHNoYXBlLnJhZGl1c1kgPSByYWRpdXNNYXg7XHJcblxyXG4gICAgICAgICAgICBzaGFwZS5yb3RhdGVWYWwgPSB2ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh2ID09IDApIHJldHVybiBcIjBcIjtcclxuICAgICAgICAgICAgICAgIGlmICh2IDwgMCkgcmV0dXJuIFwiLTQ1XCI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCI0NVwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHNoYXBlLnR5cGUgPT0gJ3JlY3QnKSB7XHJcbiAgICAgICAgICAgIHNoYXBlLnNpemUgPSBzaGFwZVNpemU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgc2V0dXBWYXJpYWJsZXMoKSB7XHJcblxyXG4gICAgICAgIHZhciB2YXJpYWJsZXNDb25mID0gdGhpcy5jb25maWcudmFyaWFibGVzO1xyXG5cclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICBwbG90LmRvbWFpbkJ5VmFyaWFibGUgPSB7fTtcclxuICAgICAgICBwbG90LnZhcmlhYmxlcyA9IHZhcmlhYmxlc0NvbmYua2V5cztcclxuICAgICAgICBpZiAoIXBsb3QudmFyaWFibGVzIHx8ICFwbG90LnZhcmlhYmxlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcGxvdC52YXJpYWJsZXMgPSBVdGlscy5pbmZlclZhcmlhYmxlcyhkYXRhLCB0aGlzLmNvbmZpZy5ncm91cHMua2V5LCB0aGlzLmNvbmZpZy5pbmNsdWRlSW5QbG90KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBsb3QubGFiZWxzID0gW107XHJcbiAgICAgICAgcGxvdC5sYWJlbEJ5VmFyaWFibGUgPSB7fTtcclxuICAgICAgICBwbG90LnZhcmlhYmxlcy5mb3JFYWNoKCh2YXJpYWJsZUtleSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgcGxvdC5kb21haW5CeVZhcmlhYmxlW3ZhcmlhYmxlS2V5XSA9IGQzLmV4dGVudChkYXRhLCAoZCkgPT4gdmFyaWFibGVzQ29uZi52YWx1ZShkLCB2YXJpYWJsZUtleSkpO1xyXG4gICAgICAgICAgICB2YXIgbGFiZWwgPSB2YXJpYWJsZUtleTtcclxuICAgICAgICAgICAgaWYgKHZhcmlhYmxlc0NvbmYubGFiZWxzICYmIHZhcmlhYmxlc0NvbmYubGFiZWxzLmxlbmd0aCA+IGluZGV4KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGFiZWwgPSB2YXJpYWJsZXNDb25mLmxhYmVsc1tpbmRleF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGxvdC5sYWJlbHMucHVzaChsYWJlbCk7XHJcbiAgICAgICAgICAgIHBsb3QubGFiZWxCeVZhcmlhYmxlW3ZhcmlhYmxlS2V5XSA9IGxhYmVsO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhwbG90LmxhYmVsQnlWYXJpYWJsZSk7XHJcblxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgc2V0dXBDb3JyZWxhdGlvbk1hdHJpeCgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgdmFyIG1hdHJpeCA9IHRoaXMucGxvdC5jb3JyZWxhdGlvbi5tYXRyaXggPSBbXTtcclxuICAgICAgICB2YXIgbWF0cml4Q2VsbHMgPSB0aGlzLnBsb3QuY29ycmVsYXRpb24ubWF0cml4LmNlbGxzID0gW107XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcblxyXG4gICAgICAgIHZhciB2YXJpYWJsZVRvVmFsdWVzID0ge307XHJcbiAgICAgICAgcGxvdC52YXJpYWJsZXMuZm9yRWFjaCgodiwgaSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgdmFyaWFibGVUb1ZhbHVlc1t2XSA9IGRhdGEubWFwKGQ9PnBsb3QueC52YWx1ZShkLCB2KSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHBsb3QudmFyaWFibGVzLmZvckVhY2goKHYxLCBpKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciByb3cgPSBbXTtcclxuICAgICAgICAgICAgbWF0cml4LnB1c2gocm93KTtcclxuXHJcbiAgICAgICAgICAgIHBsb3QudmFyaWFibGVzLmZvckVhY2goKHYyLCBqKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29yciA9IDE7XHJcbiAgICAgICAgICAgICAgICBpZiAodjEgIT0gdjIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb3JyID0gc2VsZi5jb25maWcuY29ycmVsYXRpb24udmFsdWUodmFyaWFibGVUb1ZhbHVlc1t2MV0sIHZhcmlhYmxlVG9WYWx1ZXNbdjJdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBjZWxsID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvd1ZhcjogdjEsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sVmFyOiB2MixcclxuICAgICAgICAgICAgICAgICAgICByb3c6IGksXHJcbiAgICAgICAgICAgICAgICAgICAgY29sOiBqLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjb3JyXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcm93LnB1c2goY2VsbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbWF0cml4Q2VsbHMucHVzaChjZWxsKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB1cGRhdGUobmV3RGF0YSkge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuICAgICAgICAvLyB0aGlzLnVwZGF0ZVxyXG4gICAgICAgIHRoaXMudXBkYXRlQ2VsbHMoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZhcmlhYmxlTGFiZWxzKCk7XHJcblxyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcuc2hvd0xlZ2VuZCkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxlZ2VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlVmFyaWFibGVMYWJlbHMoKSB7XHJcbiAgICAgICAgdGhpcy5wbG90LmxhYmVsQ2xhc3MgPSB0aGlzLnByZWZpeENsYXNzKFwibGFiZWxcIik7XHJcbiAgICAgICAgdGhpcy51cGRhdGVBeGlzWCgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQXhpc1koKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVBeGlzWCgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGxhYmVsQ2xhc3MgPSBwbG90LmxhYmVsQ2xhc3M7XHJcbiAgICAgICAgdmFyIGxhYmVsWENsYXNzID0gbGFiZWxDbGFzcyArIFwiLXhcIjtcclxuXHJcbiAgICAgICAgdmFyIGxhYmVscyA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgbGFiZWxYQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBsb3QudmFyaWFibGVzLCAoZCwgaSk9PmkpO1xyXG5cclxuICAgICAgICBsYWJlbHMuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpLmF0dHIoXCJjbGFzc1wiLCAoZCwgaSkgPT4gbGFiZWxDbGFzcyArIFwiIFwiICsgbGFiZWxYQ2xhc3MgKyBcIiBcIiArIGxhYmVsWENsYXNzICsgXCItXCIgKyBpKTtcclxuXHJcbiAgICAgICAgbGFiZWxzXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAoZCwgaSkgPT4gaSAqIHBsb3QuY2VsbFNpemUgKyBwbG90LmNlbGxTaXplIC8gMilcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIHBsb3QuaGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcImR4XCIsIC0yKVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIDUpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIilcclxuXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJoYW5naW5nXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KHY9PnBsb3QubGFiZWxCeVZhcmlhYmxlW3ZdKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnJvdGF0ZUxhYmVsc1gpIHtcclxuICAgICAgICAgICAgbGFiZWxzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwicm90YXRlKC00NSwgXCIgKyAoaSAqIHBsb3QuY2VsbFNpemUgKyBwbG90LmNlbGxTaXplIC8gMiAgKSArIFwiLCBcIiArIHBsb3QuaGVpZ2h0ICsgXCIpXCIpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbWF4V2lkdGggPSBzZWxmLmNvbXB1dGVYQXhpc0xhYmVsc1dpZHRoKCk7XHJcbiAgICAgICAgbGFiZWxzLmVhY2goZnVuY3Rpb24gKGxhYmVsKSB7XHJcbiAgICAgICAgICAgIFV0aWxzLnBsYWNlVGV4dFdpdGhFbGxpcHNpc0FuZFRvb2x0aXAoZDMuc2VsZWN0KHRoaXMpLCBsYWJlbCwgbWF4V2lkdGgsIHNlbGYuY29uZmlnLnNob3dUb29sdGlwID8gc2VsZi5wbG90LnRvb2x0aXAgOiBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxhYmVscy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlQXhpc1koKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBsYWJlbENsYXNzID0gcGxvdC5sYWJlbENsYXNzO1xyXG4gICAgICAgIHZhciBsYWJlbFlDbGFzcyA9IHBsb3QubGFiZWxDbGFzcyArIFwiLXlcIjtcclxuICAgICAgICB2YXIgbGFiZWxzID0gc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyBsYWJlbFlDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGxvdC52YXJpYWJsZXMpO1xyXG5cclxuICAgICAgICBsYWJlbHMuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpO1xyXG5cclxuICAgICAgICBsYWJlbHNcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAoZCwgaSkgPT4gaSAqIHBsb3QuY2VsbFNpemUgKyBwbG90LmNlbGxTaXplIC8gMilcclxuICAgICAgICAgICAgLmF0dHIoXCJkeFwiLCAtMilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIChkLCBpKSA9PiBsYWJlbENsYXNzICsgXCIgXCIgKyBsYWJlbFlDbGFzcyArIFwiIFwiICsgbGFiZWxZQ2xhc3MgKyBcIi1cIiArIGkpXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJoYW5naW5nXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KHY9PnBsb3QubGFiZWxCeVZhcmlhYmxlW3ZdKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnJvdGF0ZUxhYmVsc1kpIHtcclxuICAgICAgICAgICAgbGFiZWxzXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCAoZCwgaSkgPT4gXCJyb3RhdGUoLTQ1LCBcIiArIDAgKyBcIiwgXCIgKyAoaSAqIHBsb3QuY2VsbFNpemUgKyBwbG90LmNlbGxTaXplIC8gMikgKyBcIilcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbWF4V2lkdGggPSBzZWxmLmNvbXB1dGVZQXhpc0xhYmVsc1dpZHRoKCk7XHJcbiAgICAgICAgbGFiZWxzLmVhY2goZnVuY3Rpb24gKGxhYmVsKSB7XHJcbiAgICAgICAgICAgIFV0aWxzLnBsYWNlVGV4dFdpdGhFbGxpcHNpc0FuZFRvb2x0aXAoZDMuc2VsZWN0KHRoaXMpLCBsYWJlbCwgbWF4V2lkdGgsIHNlbGYuY29uZmlnLnNob3dUb29sdGlwID8gc2VsZi5wbG90LnRvb2x0aXAgOiBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxhYmVscy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcHV0ZVlBeGlzTGFiZWxzV2lkdGgoKSB7XHJcbiAgICAgICAgdmFyIG1heFdpZHRoID0gdGhpcy5wbG90Lm1hcmdpbi5sZWZ0O1xyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcucm90YXRlTGFiZWxzWSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbWF4V2lkdGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtYXhXaWR0aCAqPSBVdGlscy5TUVJUXzI7XHJcbiAgICAgICAgdmFyIGZvbnRTaXplID0gMTE7IC8vdG9kbyBjaGVjayBhY3R1YWwgZm9udCBzaXplXHJcbiAgICAgICAgbWF4V2lkdGggLT0gZm9udFNpemUgLyAyO1xyXG5cclxuICAgICAgICByZXR1cm4gbWF4V2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcHV0ZVhBeGlzTGFiZWxzV2lkdGgob2Zmc2V0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5yb3RhdGVMYWJlbHNYKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBsb3QuY2VsbFNpemUgLSAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc2l6ZSA9IHRoaXMucGxvdC5tYXJnaW4uYm90dG9tO1xyXG4gICAgICAgIHNpemUgKj0gVXRpbHMuU1FSVF8yO1xyXG4gICAgICAgIHZhciBmb250U2l6ZSA9IDExOyAvL3RvZG8gY2hlY2sgYWN0dWFsIGZvbnQgc2l6ZVxyXG4gICAgICAgIHNpemUgLT0gZm9udFNpemUgLyAyO1xyXG4gICAgICAgIHJldHVybiBzaXplO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUNlbGxzKCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGNlbGxDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJjZWxsXCIpO1xyXG4gICAgICAgIHZhciBjZWxsU2hhcGUgPSBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnR5cGU7XHJcblxyXG4gICAgICAgIHZhciBjZWxscyA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJnLlwiICsgY2VsbENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShwbG90LmNvcnJlbGF0aW9uLm1hdHJpeC5jZWxscyk7XHJcblxyXG4gICAgICAgIHZhciBjZWxsRW50ZXJHID0gY2VsbHMuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKGNlbGxDbGFzcywgdHJ1ZSk7XHJcbiAgICAgICAgY2VsbHMuYXR0cihcInRyYW5zZm9ybVwiLCBjPT4gXCJ0cmFuc2xhdGUoXCIgKyAocGxvdC5jZWxsU2l6ZSAqIGMuY29sICsgcGxvdC5jZWxsU2l6ZSAvIDIpICsgXCIsXCIgKyAocGxvdC5jZWxsU2l6ZSAqIGMucm93ICsgcGxvdC5jZWxsU2l6ZSAvIDIpICsgXCIpXCIpO1xyXG5cclxuICAgICAgICBjZWxscy5jbGFzc2VkKHNlbGYuY29uZmlnLmNzc0NsYXNzUHJlZml4ICsgXCJzZWxlY3RhYmxlXCIsICEhc2VsZi5zY2F0dGVyUGxvdCk7XHJcblxyXG4gICAgICAgIHZhciBzZWxlY3RvciA9IFwiKjpub3QoLmNlbGwtc2hhcGUtXCIgKyBjZWxsU2hhcGUgKyBcIilcIjtcclxuXHJcbiAgICAgICAgdmFyIHdyb25nU2hhcGVzID0gY2VsbHMuc2VsZWN0QWxsKHNlbGVjdG9yKTtcclxuICAgICAgICB3cm9uZ1NoYXBlcy5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgdmFyIHNoYXBlcyA9IGNlbGxzLnNlbGVjdE9yQXBwZW5kKGNlbGxTaGFwZSArIFwiLmNlbGwtc2hhcGUtXCIgKyBjZWxsU2hhcGUpO1xyXG5cclxuICAgICAgICBpZiAocGxvdC5jb3JyZWxhdGlvbi5zaGFwZS50eXBlID09ICdjaXJjbGUnKSB7XHJcblxyXG4gICAgICAgICAgICBzaGFwZXNcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiclwiLCBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnJhZGl1cylcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY3hcIiwgMClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY3lcIiwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGxvdC5jb3JyZWxhdGlvbi5zaGFwZS50eXBlID09ICdlbGxpcHNlJykge1xyXG4gICAgICAgICAgICAvLyBjZWxscy5hdHRyKFwidHJhbnNmb3JtXCIsIGM9PiBcInRyYW5zbGF0ZSgzMDAsMTUwKSByb3RhdGUoXCIrcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5yb3RhdGVWYWwoYy52YWx1ZSkrXCIpXCIpO1xyXG4gICAgICAgICAgICBzaGFwZXNcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwicnhcIiwgcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5yYWRpdXNYKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJyeVwiLCBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnJhZGl1c1kpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImN4XCIsIDApXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImN5XCIsIDApXHJcblxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYz0+IFwicm90YXRlKFwiICsgcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5yb3RhdGVWYWwoYy52YWx1ZSkgKyBcIilcIik7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgaWYgKHBsb3QuY29ycmVsYXRpb24uc2hhcGUudHlwZSA9PSAncmVjdCcpIHtcclxuICAgICAgICAgICAgc2hhcGVzXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHBsb3QuY29ycmVsYXRpb24uc2hhcGUuc2l6ZSlcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIHBsb3QuY29ycmVsYXRpb24uc2hhcGUuc2l6ZSlcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieFwiLCAtcGxvdC5jZWxsU2l6ZSAvIDIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInlcIiwgLXBsb3QuY2VsbFNpemUgLyAyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2hhcGVzLnN0eWxlKFwiZmlsbFwiLCBjPT4gcGxvdC5jb3JyZWxhdGlvbi5jb2xvci5zY2FsZShjLnZhbHVlKSk7XHJcblxyXG4gICAgICAgIHZhciBtb3VzZW92ZXJDYWxsYmFja3MgPSBbXTtcclxuICAgICAgICB2YXIgbW91c2VvdXRDYWxsYmFja3MgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKHBsb3QudG9vbHRpcCkge1xyXG5cclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goYz0+IHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGh0bWwgPSBjLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLmh0bWwoaHRtbClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLnB1c2goYz0+IHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2VsZi5jb25maWcuaGlnaGxpZ2h0TGFiZWxzKSB7XHJcbiAgICAgICAgICAgIHZhciBoaWdobGlnaHRDbGFzcyA9IHNlbGYuY29uZmlnLmNzc0NsYXNzUHJlZml4ICsgXCJoaWdobGlnaHRcIjtcclxuICAgICAgICAgICAgdmFyIHhMYWJlbENsYXNzID0gYz0+cGxvdC5sYWJlbENsYXNzICsgXCIteC1cIiArIGMuY29sO1xyXG4gICAgICAgICAgICB2YXIgeUxhYmVsQ2xhc3MgPSBjPT5wbG90LmxhYmVsQ2xhc3MgKyBcIi15LVwiICsgYy5yb3c7XHJcblxyXG5cclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goYz0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHhMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgeUxhYmVsQ2xhc3MoYykpLmNsYXNzZWQoaGlnaGxpZ2h0Q2xhc3MsIHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MucHVzaChjPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB4TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB5TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBjZWxscy5vbihcIm1vdXNlb3ZlclwiLCBjID0+IHtcclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2s9PmNhbGxiYWNrKGMpKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCBjID0+IHtcclxuICAgICAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2s9PmNhbGxiYWNrKGMpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNlbGxzLm9uKFwiY2xpY2tcIiwgYz0+IHtcclxuICAgICAgICAgICAgc2VsZi50cmlnZ2VyKFwiY2VsbC1zZWxlY3RlZFwiLCBjKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIGNlbGxzLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgdXBkYXRlTGVnZW5kKCkge1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgbGVnZW5kWCA9IHRoaXMucGxvdC53aWR0aCArIDEwO1xyXG4gICAgICAgIHZhciBsZWdlbmRZID0gMDtcclxuICAgICAgICB2YXIgYmFyV2lkdGggPSAxMDtcclxuICAgICAgICB2YXIgYmFySGVpZ2h0ID0gdGhpcy5wbG90LmhlaWdodCAtIDI7XHJcbiAgICAgICAgdmFyIHNjYWxlID0gcGxvdC5jb3JyZWxhdGlvbi5jb2xvci5zY2FsZTtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmQgPSBuZXcgTGVnZW5kKHRoaXMuc3ZnLCB0aGlzLnN2Z0csIHNjYWxlLCBsZWdlbmRYLCBsZWdlbmRZKS5saW5lYXJHcmFkaWVudEJhcihiYXJXaWR0aCwgYmFySGVpZ2h0KTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGF0dGFjaFNjYXR0ZXJQbG90KGNvbnRhaW5lclNlbGVjdG9yLCBjb25maWcpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblxyXG4gICAgICAgIHZhciBzY2F0dGVyUGxvdENvbmZpZyA9IHtcclxuICAgICAgICAgICAgaGVpZ2h0OiBzZWxmLnBsb3QuaGVpZ2h0ICsgc2VsZi5jb25maWcubWFyZ2luLnRvcCArIHNlbGYuY29uZmlnLm1hcmdpbi5ib3R0b20sXHJcbiAgICAgICAgICAgIHdpZHRoOiBzZWxmLnBsb3QuaGVpZ2h0ICsgc2VsZi5jb25maWcubWFyZ2luLnRvcCArIHNlbGYuY29uZmlnLm1hcmdpbi5ib3R0b20sXHJcbiAgICAgICAgICAgIGdyb3Vwczoge1xyXG4gICAgICAgICAgICAgICAga2V5OiBzZWxmLmNvbmZpZy5ncm91cHMua2V5LFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6IHNlbGYuY29uZmlnLmdyb3Vwcy5sYWJlbFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBndWlkZXM6IHRydWUsXHJcbiAgICAgICAgICAgIHNob3dMZWdlbmQ6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zY2F0dGVyUGxvdCA9IHRydWU7XHJcblxyXG4gICAgICAgIHNjYXR0ZXJQbG90Q29uZmlnID0gVXRpbHMuZGVlcEV4dGVuZChzY2F0dGVyUGxvdENvbmZpZywgY29uZmlnKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm9uKFwiY2VsbC1zZWxlY3RlZFwiLCBjPT4ge1xyXG5cclxuXHJcbiAgICAgICAgICAgIHNjYXR0ZXJQbG90Q29uZmlnLnggPSB7XHJcbiAgICAgICAgICAgICAgICBrZXk6IGMucm93VmFyLFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6IHNlbGYucGxvdC5sYWJlbEJ5VmFyaWFibGVbYy5yb3dWYXJdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHNjYXR0ZXJQbG90Q29uZmlnLnkgPSB7XHJcbiAgICAgICAgICAgICAgICBrZXk6IGMuY29sVmFyLFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6IHNlbGYucGxvdC5sYWJlbEJ5VmFyaWFibGVbYy5jb2xWYXJdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnNjYXR0ZXJQbG90ICYmIHNlbGYuc2NhdHRlclBsb3QgIT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2NhdHRlclBsb3Quc2V0Q29uZmlnKHNjYXR0ZXJQbG90Q29uZmlnKS5pbml0KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNjYXR0ZXJQbG90ID0gbmV3IFNjYXR0ZXJQbG90KGNvbnRhaW5lclNlbGVjdG9yLCBzZWxmLmRhdGEsIHNjYXR0ZXJQbG90Q29uZmlnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXR0YWNoKFwiU2NhdHRlclBsb3RcIiwgc2VsZi5zY2F0dGVyUGxvdCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgRDNFeHRlbnNpb25ze1xyXG5cclxuICAgIHN0YXRpYyBleHRlbmQoKXtcclxuXHJcbiAgICAgICAgZDMuc2VsZWN0aW9uLmVudGVyLnByb3RvdHlwZS5pbnNlcnRTZWxlY3RvciA9XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdGlvbi5wcm90b3R5cGUuaW5zZXJ0U2VsZWN0b3IgPSBmdW5jdGlvbihzZWxlY3RvciwgYmVmb3JlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVXRpbHMuaW5zZXJ0U2VsZWN0b3IodGhpcywgc2VsZWN0b3IsIGJlZm9yZSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICBkMy5zZWxlY3Rpb24uZW50ZXIucHJvdG90eXBlLmFwcGVuZFNlbGVjdG9yID1cclxuICAgICAgICAgICAgZDMuc2VsZWN0aW9uLnByb3RvdHlwZS5hcHBlbmRTZWxlY3RvciA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVXRpbHMuYXBwZW5kU2VsZWN0b3IodGhpcywgc2VsZWN0b3IpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICBkMy5zZWxlY3Rpb24uZW50ZXIucHJvdG90eXBlLnNlbGVjdE9yQXBwZW5kID1cclxuICAgICAgICAgICAgZDMuc2VsZWN0aW9uLnByb3RvdHlwZS5zZWxlY3RPckFwcGVuZCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVXRpbHMuc2VsZWN0T3JBcHBlbmQodGhpcywgc2VsZWN0b3IpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICBkMy5zZWxlY3Rpb24uZW50ZXIucHJvdG90eXBlLnNlbGVjdE9ySW5zZXJ0ID1cclxuICAgICAgICAgICAgZDMuc2VsZWN0aW9uLnByb3RvdHlwZS5zZWxlY3RPckluc2VydCA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBiZWZvcmUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBVdGlscy5zZWxlY3RPckluc2VydCh0aGlzLCBzZWxlY3RvciwgYmVmb3JlKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcblxyXG5cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NoYXJ0LCBDaGFydENvbmZpZ30gZnJvbSBcIi4vY2hhcnRcIjtcclxuaW1wb3J0IHtIZWF0bWFwLCBIZWF0bWFwQ29uZmlnfSBmcm9tIFwiLi9oZWF0bWFwXCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7U3RhdGlzdGljc1V0aWxzfSBmcm9tICcuL3N0YXRpc3RpY3MtdXRpbHMnXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEhlYXRtYXBUaW1lU2VyaWVzQ29uZmlnIGV4dGVuZHMgSGVhdG1hcENvbmZpZyB7XHJcbiAgICB4ID0ge1xyXG4gICAgICAgIGZpbGxNaXNzaW5nOiBmYWxzZSwgLy8gZmlpbGwgbWlzc2luZyB2YWx1ZXMgd2l0aCBuZWFyZXN0IHByZXZpb3VzIHZhbHVlXHJcbiAgICAgICAgaW50ZXJ2YWw6IHVuZGVmaW5lZCwgLy91c2VkIGluIGZpbGxpbmcgbWlzc2luZyB0aWNrc1xyXG4gICAgICAgIGludGVydmFsU3RlcDogMSxcclxuICAgICAgICBmb3JtYXQ6IHVuZGVmaW5lZCwgLy9pbnB1dCBkYXRhIGQzIHRpbWUgZm9ybWF0XHJcbiAgICAgICAgZGlzcGxheUZvcm1hdDogdW5kZWZpbmVkLC8vZDMgdGltZSBmb3JtYXQgZm9yIGRpc3BsYXlcclxuICAgICAgICBpbnRlcnZhbFRvRm9ybWF0czogWyAvL3VzZWQgdG8gZ3Vlc3MgaW50ZXJ2YWwgYW5kIGZvcm1hdFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAneWVhcicsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXRzOiBbXCIlWVwiXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnbW9udGgnLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0czogW1wiJVktJW1cIl1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2RheScsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXRzOiBbXCIlWS0lbS0lZFwiXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnaG91cicsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXRzOiBbJyVIJywgJyVZLSVtLSVkICVIJ11cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ21pbnV0ZScsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXRzOiBbJyVIOiVNJywgJyVZLSVtLSVkICVIOiVNJ11cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3NlY29uZCcsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXRzOiBbJyVIOiVNOiVTJywgJyVZLSVtLSVkICVIOiVNOiVTJ11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0sXHJcblxyXG4gICAgICAgIHNvcnRDb21wYXJhdG9yOiBmdW5jdGlvbiBzb3J0Q29tcGFyYXRvcihhLCBiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBVdGlscy5pc1N0cmluZyhhKSA/ICBhLmxvY2FsZUNvbXBhcmUoYikgOiAgYSAtIGI7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb3JtYXR0ZXI6IHVuZGVmaW5lZFxyXG4gICAgfTtcclxuICAgIHogPSB7XHJcbiAgICAgICAgZmlsbE1pc3Npbmc6IHRydWUgLy8gZmlpbGwgbWlzc2luZyB2YWx1ZXMgd2l0aCBuZWFyZXN0IHByZXZpb3VzIHZhbHVlXHJcbiAgICB9O1xyXG5cclxuICAgIGxlZ2VuZCA9IHtcclxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHZhciBzdWZmaXggPSBcIlwiO1xyXG4gICAgICAgICAgICBpZiAodiAvIDEwMDAwMDAgPj0gMSkge1xyXG4gICAgICAgICAgICAgICAgc3VmZml4ID0gXCIgTVwiO1xyXG4gICAgICAgICAgICAgICAgdiA9IE51bWJlcih2IC8gMTAwMDAwMCkudG9GaXhlZCgzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgbmYgPSBJbnRsLk51bWJlckZvcm1hdCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gbmYuZm9ybWF0KHYpICsgc3VmZml4O1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIGlmIChjdXN0b20pIHtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBIZWF0bWFwVGltZVNlcmllcyBleHRlbmRzIEhlYXRtYXAge1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IEhlYXRtYXBUaW1lU2VyaWVzQ29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBIZWF0bWFwVGltZVNlcmllc0NvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgc2V0dXBWYWx1ZXNCZWZvcmVHcm91cHNTb3J0KCkge1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueC50aW1lRm9ybWF0ID0gdGhpcy5jb25maWcueC5mb3JtYXQ7XHJcbiAgICAgICAgaWYodGhpcy5jb25maWcueC5kaXNwbGF5Rm9ybWF0ICYmICF0aGlzLnBsb3QueC50aW1lRm9ybWF0KXtcclxuICAgICAgICAgICAgdGhpcy5ndWVzc1RpbWVGb3JtYXQoKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBzdXBlci5zZXR1cFZhbHVlc0JlZm9yZUdyb3Vwc1NvcnQoKTtcclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLnguZmlsbE1pc3NpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRUaW1lRm9ybWF0QW5kSW50ZXJ2YWwoKTtcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnguaW50ZXJ2YWxTdGVwID0gdGhpcy5jb25maWcueC5pbnRlcnZhbFN0ZXAgfHwgMTtcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LngudGltZVBhcnNlciA9IHRoaXMuZ2V0VGltZVBhcnNlcigpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHRoaXMucGxvdC54LnVuaXF1ZVZhbHVlcy5zb3J0KHRoaXMuY29uZmlnLnguc29ydENvbXBhcmF0b3IpO1xyXG5cclxuICAgICAgICB2YXIgcHJldiA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC54LnVuaXF1ZVZhbHVlcy5mb3JFYWNoKCh4LCBpKT0+IHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLnBhcnNlVGltZSh4KTtcclxuICAgICAgICAgICAgaWYgKHByZXYgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHByZXYgPSBjdXJyZW50O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgbmV4dCA9IHNlbGYubmV4dFRpbWVUaWNrVmFsdWUocHJldik7XHJcbiAgICAgICAgICAgIHZhciBtaXNzaW5nID0gW107XHJcbiAgICAgICAgICAgIHZhciBpdGVyYXRpb24gPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoc2VsZi5jb21wYXJlVGltZVZhbHVlcyhuZXh0LCBjdXJyZW50KTw9MCkge1xyXG4gICAgICAgICAgICAgICAgaXRlcmF0aW9uKys7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlcmF0aW9uID4gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgdmFyIHRpbWVTdHJpbmcgPSBzZWxmLmZvcm1hdFRpbWUobmV4dCk7XHJcbiAgICAgICAgICAgICAgICBkW3RoaXMuY29uZmlnLngua2V5XSA9IHRpbWVTdHJpbmc7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi51cGRhdGVHcm91cHMoZCwgdGltZVN0cmluZywgc2VsZi5wbG90LnguZ3JvdXBzLCBzZWxmLmNvbmZpZy54Lmdyb3Vwcyk7XHJcbiAgICAgICAgICAgICAgICBtaXNzaW5nLnB1c2gobmV4dCk7XHJcbiAgICAgICAgICAgICAgICBuZXh0ID0gc2VsZi5uZXh0VGltZVRpY2tWYWx1ZShuZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcmV2ID0gY3VycmVudDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VUaW1lKHgpIHtcclxuICAgICAgICB2YXIgcGFyc2VyID0gdGhpcy5nZXRUaW1lUGFyc2VyKCk7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZSh4KTtcclxuICAgIH1cclxuXHJcbiAgICBmb3JtYXRUaW1lKGRhdGUpe1xyXG4gICAgICAgIHZhciBwYXJzZXIgPSB0aGlzLmdldFRpbWVQYXJzZXIoKTtcclxuICAgICAgICByZXR1cm4gcGFyc2VyKGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcm1hdFZhbHVlWCh2YWx1ZSkgeyAvL3VzZWQgb25seSBmb3IgZGlzcGxheVxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy54LmZvcm1hdHRlcikgcmV0dXJuIHRoaXMuY29uZmlnLnguZm9ybWF0dGVyLmNhbGwodGhpcy5jb25maWcsIHZhbHVlKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5jb25maWcueC5kaXNwbGF5Rm9ybWF0KXtcclxuICAgICAgICAgICAgdmFyIGRhdGUgPSB0aGlzLnBhcnNlVGltZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkMy50aW1lLmZvcm1hdCh0aGlzLmNvbmZpZy54LmRpc3BsYXlGb3JtYXQpKGRhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIXRoaXMucGxvdC54LnRpbWVGb3JtYXQpIHJldHVybiB2YWx1ZTtcclxuXHJcbiAgICAgICAgaWYoVXRpbHMuaXNEYXRlKHZhbHVlKSl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZvcm1hdFRpbWUodmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBhcmVUaW1lVmFsdWVzKGEsIGIpe1xyXG4gICAgICAgIHJldHVybiBhLWI7XHJcbiAgICB9XHJcblxyXG4gICAgdGltZVZhbHVlc0VxdWFsKGEsIGIpIHtcclxuICAgICAgICB2YXIgcGFyc2VyID0gdGhpcy5wbG90LngudGltZVBhcnNlcjtcclxuICAgICAgICByZXR1cm4gcGFyc2VyKGEpID09PSBwYXJzZXIoYik7XHJcbiAgICB9XHJcblxyXG4gICAgbmV4dFRpbWVUaWNrVmFsdWUodCkge1xyXG4gICAgICAgIHZhciBpbnRlcnZhbCA9IHRoaXMucGxvdC54LmludGVydmFsO1xyXG4gICAgICAgIHJldHVybiBkMy50aW1lW2ludGVydmFsXS5vZmZzZXQodCwgdGhpcy5wbG90LnguaW50ZXJ2YWxTdGVwKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0UGxvdCgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcuei5maWxsTWlzc2luZykge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWF0cml4LmZvckVhY2goKHJvdywgcm93SW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBwcmV2Um93VmFsdWUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICByb3cuZm9yRWFjaCgoY2VsbCwgY29sSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbC52YWx1ZSA9PT0gdW5kZWZpbmVkICYmIHByZXZSb3dWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwudmFsdWUgPSBwcmV2Um93VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwubWlzc2luZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHByZXZSb3dWYWx1ZSA9IGNlbGwudmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKG5ld0RhdGEpIHtcclxuICAgICAgICBzdXBlci51cGRhdGUobmV3RGF0YSk7XHJcblxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgaW5pdFRpbWVGb3JtYXRBbmRJbnRlcnZhbCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnguaW50ZXJ2YWwgPSB0aGlzLmNvbmZpZy54LmludGVydmFsO1xyXG5cclxuICAgICAgICBpZighdGhpcy5wbG90LngudGltZUZvcm1hdCl7XHJcbiAgICAgICAgICAgIHRoaXMuZ3Vlc3NUaW1lRm9ybWF0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZighdGhpcy5wbG90LnguaW50ZXJ2YWwgJiYgdGhpcy5wbG90LngudGltZUZvcm1hdCl7XHJcbiAgICAgICAgICAgIHRoaXMuZ3Vlc3NJbnRlcnZhbCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBndWVzc1RpbWVGb3JtYXQoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpIDwgc2VsZi5jb25maWcueC5pbnRlcnZhbFRvRm9ybWF0cy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGxldCBpbnRlcnZhbEZvcm1hdCA9IHNlbGYuY29uZmlnLnguaW50ZXJ2YWxUb0Zvcm1hdHNbaV07XHJcbiAgICAgICAgICAgIHZhciBmb3JtYXQgPSBudWxsO1xyXG4gICAgICAgICAgICB2YXIgZm9ybWF0TWF0Y2ggPSBpbnRlcnZhbEZvcm1hdC5mb3JtYXRzLnNvbWUoZj0+e1xyXG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gZjtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJzZXIgPSBkMy50aW1lLmZvcm1hdChmKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnBsb3QueC51bmlxdWVWYWx1ZXMuZXZlcnkoeD0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZXIucGFyc2UoeCkgIT09IG51bGxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYoZm9ybWF0TWF0Y2gpe1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wbG90LngudGltZUZvcm1hdCA9IGZvcm1hdDtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHdWVzc2VkIHRpbWVGb3JtYXQnLCBmb3JtYXQpO1xyXG4gICAgICAgICAgICAgICAgaWYoIXNlbGYucGxvdC54LmludGVydmFsKXtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnBsb3QueC5pbnRlcnZhbCA9IGludGVydmFsRm9ybWF0Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0d1ZXNzZWQgaW50ZXJ2YWwnLCBzZWxmLnBsb3QueC5pbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ3Vlc3NJbnRlcnZhbCgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGkgPCBzZWxmLmNvbmZpZy54LmludGVydmFsVG9Gb3JtYXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBpbnRlcnZhbEZvcm1hdCA9IHNlbGYuY29uZmlnLnguaW50ZXJ2YWxUb0Zvcm1hdHNbaV07XHJcblxyXG4gICAgICAgICAgICBpZihpbnRlcnZhbEZvcm1hdC5mb3JtYXRzLmluZGV4T2Yoc2VsZi5wbG90LngudGltZUZvcm1hdCkgPj0gMCl7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QueC5pbnRlcnZhbCA9IGludGVydmFsRm9ybWF0Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnR3Vlc3NlZCBpbnRlcnZhbCcsIHNlbGYucGxvdC54LmludGVydmFsKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXRUaW1lUGFyc2VyKCkge1xyXG4gICAgICAgIGlmKCF0aGlzLnBsb3QueC50aW1lUGFyc2VyKXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LngudGltZVBhcnNlciA9IGQzLnRpbWUuZm9ybWF0KHRoaXMucGxvdC54LnRpbWVGb3JtYXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5wbG90LngudGltZVBhcnNlcjtcclxuICAgIH1cclxufVxyXG5cclxuIiwiaW1wb3J0IHtDaGFydCwgQ2hhcnRDb25maWd9IGZyb20gXCIuL2NoYXJ0XCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7TGVnZW5kfSBmcm9tICcuL2xlZ2VuZCdcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgSGVhdG1hcENvbmZpZyBleHRlbmRzIENoYXJ0Q29uZmlnIHtcclxuXHJcbiAgICBzdmdDbGFzcyA9ICdvZGMtaGVhdG1hcCc7XHJcbiAgICBzaG93VG9vbHRpcCA9IHRydWU7IC8vc2hvdyB0b29sdGlwIG9uIGRvdCBob3ZlclxyXG4gICAgdG9vbHRpcCA9IHtcclxuICAgICAgICBub0RhdGFUZXh0OiBcIk4vQVwiXHJcbiAgICB9O1xyXG4gICAgc2hvd0xlZ2VuZCA9IHRydWU7XHJcbiAgICBsZWdlbmQgPSB7XHJcbiAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgIHJvdGF0ZUxhYmVsczogZmFsc2UsXHJcbiAgICAgICAgZGVjaW1hbFBsYWNlczogdW5kZWZpbmVkLFxyXG4gICAgICAgIGZvcm1hdHRlcjogdiA9PiB0aGlzLmxlZ2VuZC5kZWNpbWFsUGxhY2VzID09PSB1bmRlZmluZWQgPyB2IDogTnVtYmVyKHYpLnRvRml4ZWQodGhpcy5sZWdlbmQuZGVjaW1hbFBsYWNlcylcclxuICAgIH1cclxuICAgIGhpZ2hsaWdodExhYmVscyA9IHRydWU7XHJcbiAgICB4ID0gey8vIFggYXhpcyBjb25maWdcclxuICAgICAgICB0aXRsZTogJycsIC8vIGF4aXMgdGl0bGVcclxuICAgICAgICBrZXk6IDAsXHJcbiAgICAgICAgdmFsdWU6IChkKSA9PiBkW3RoaXMueC5rZXldLCAvLyB4IHZhbHVlIGFjY2Vzc29yXHJcbiAgICAgICAgcm90YXRlTGFiZWxzOiB0cnVlLFxyXG4gICAgICAgIHNvcnRMYWJlbHM6IGZhbHNlLFxyXG4gICAgICAgIHNvcnRDb21wYXJhdG9yOiAoYSwgYik9PiBVdGlscy5pc051bWJlcihhKSA/IGEgLSBiIDogYS5sb2NhbGVDb21wYXJlKGIpLFxyXG4gICAgICAgIGdyb3Vwczoge1xyXG4gICAgICAgICAgICBrZXlzOiBbXSxcclxuICAgICAgICAgICAgbGFiZWxzOiBbXSxcclxuICAgICAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IGRba2V5XSxcclxuICAgICAgICAgICAgb3ZlcmxhcDoge1xyXG4gICAgICAgICAgICAgICAgdG9wOiAyMCxcclxuICAgICAgICAgICAgICAgIGJvdHRvbTogMjBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9ybWF0dGVyOiB1bmRlZmluZWQgLy8gdmFsdWUgZm9ybWF0dGVyIGZ1bmN0aW9uXHJcblxyXG4gICAgfTtcclxuICAgIHkgPSB7Ly8gWSBheGlzIGNvbmZpZ1xyXG4gICAgICAgIHRpdGxlOiAnJywgLy8gYXhpcyB0aXRsZSxcclxuICAgICAgICByb3RhdGVMYWJlbHM6IHRydWUsXHJcbiAgICAgICAga2V5OiAxLFxyXG4gICAgICAgIHZhbHVlOiAoZCkgPT4gZFt0aGlzLnkua2V5XSwgLy8geSB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgIHNvcnRMYWJlbHM6IGZhbHNlLFxyXG4gICAgICAgIHNvcnRDb21wYXJhdG9yOiAoYSwgYik9PiBVdGlscy5pc051bWJlcihiKSA/IGIgLSBhIDogYi5sb2NhbGVDb21wYXJlKGEpLFxyXG4gICAgICAgIGdyb3Vwczoge1xyXG4gICAgICAgICAgICBrZXlzOiBbXSxcclxuICAgICAgICAgICAgbGFiZWxzOiBbXSxcclxuICAgICAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IGRba2V5XSxcclxuICAgICAgICAgICAgb3ZlcmxhcDoge1xyXG4gICAgICAgICAgICAgICAgbGVmdDogMjAsXHJcbiAgICAgICAgICAgICAgICByaWdodDogMjBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9ybWF0dGVyOiB1bmRlZmluZWQvLyB2YWx1ZSBmb3JtYXR0ZXIgZnVuY3Rpb25cclxuICAgIH07XHJcbiAgICB6ID0ge1xyXG4gICAgICAgIGtleTogMixcclxuICAgICAgICB2YWx1ZTogKGQpID0+IGRbdGhpcy56LmtleV0sXHJcbiAgICAgICAgbm90QXZhaWxhYmxlVmFsdWU6ICh2KSA9PiB2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCxcclxuXHJcbiAgICAgICAgZGVjaW1hbFBsYWNlczogdW5kZWZpbmVkLFxyXG4gICAgICAgIGZvcm1hdHRlcjogdiA9PiB0aGlzLnouZGVjaW1hbFBsYWNlcyA9PT0gdW5kZWZpbmVkID8gdiA6IE51bWJlcih2KS50b0ZpeGVkKHRoaXMuei5kZWNpbWFsUGxhY2VzKS8vIHZhbHVlIGZvcm1hdHRlciBmdW5jdGlvblxyXG5cclxuICAgIH07XHJcbiAgICBjb2xvciA9IHtcclxuICAgICAgICBub0RhdGFDb2xvcjogXCJ3aGl0ZVwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiLFxyXG4gICAgICAgIHJldmVyc2VTY2FsZTogZmFsc2UsXHJcbiAgICAgICAgcmFuZ2U6IFtcImRhcmtibHVlXCIsIFwibGlnaHRza3libHVlXCIsIFwib3JhbmdlXCIsIFwiY3JpbXNvblwiLCBcImRhcmtyZWRcIl1cclxuICAgIH07XHJcbiAgICBjZWxsID0ge1xyXG4gICAgICAgIHdpZHRoOiB1bmRlZmluZWQsXHJcbiAgICAgICAgaGVpZ2h0OiB1bmRlZmluZWQsXHJcbiAgICAgICAgc2l6ZU1pbjogMTUsXHJcbiAgICAgICAgc2l6ZU1heDogMjUwLFxyXG4gICAgICAgIHBhZGRpbmc6IDBcclxuICAgIH07XHJcbiAgICBtYXJnaW4gPSB7XHJcbiAgICAgICAgbGVmdDogNjAsXHJcbiAgICAgICAgcmlnaHQ6IDUwLFxyXG4gICAgICAgIHRvcDogMzAsXHJcbiAgICAgICAgYm90dG9tOiA4MFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIGlmIChjdXN0b20pIHtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLy9UT0RPIHJlZmFjdG9yXHJcbmV4cG9ydCBjbGFzcyBIZWF0bWFwIGV4dGVuZHMgQ2hhcnQge1xyXG5cclxuICAgIHN0YXRpYyBtYXhHcm91cEdhcFNpemUgPSAyNDtcclxuICAgIHN0YXRpYyBncm91cFRpdGxlUmVjdEhlaWdodCA9IDY7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IEhlYXRtYXBDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZykge1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IEhlYXRtYXBDb25maWcoY29uZmlnKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSB0aGlzLmNvbmZpZy5tYXJnaW47XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnggPSB7fTtcclxuICAgICAgICB0aGlzLnBsb3QueSA9IHt9O1xyXG4gICAgICAgIHRoaXMucGxvdC56ID0ge1xyXG4gICAgICAgICAgICBtYXRyaXhlczogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBjZWxsczogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBjb2xvcjoge30sXHJcbiAgICAgICAgICAgIHNoYXBlOiB7fVxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICB0aGlzLnNldHVwVmFsdWVzKCk7XHJcbiAgICAgICAgdGhpcy5idWlsZENlbGxzKCk7XHJcblxyXG4gICAgICAgIHZhciB0aXRsZVJlY3RXaWR0aCA9IDY7XHJcbiAgICAgICAgdGhpcy5wbG90Lngub3ZlcmxhcCA9IHtcclxuICAgICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgICAgICBib3R0b206IDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICh0aGlzLnBsb3QuZ3JvdXBCeVgpIHtcclxuICAgICAgICAgICAgbGV0IGRlcHRoID0gc2VsZi5jb25maWcueC5ncm91cHMua2V5cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGxldCBhbGxUaXRsZXNXaWR0aCA9IGRlcHRoICogKHRpdGxlUmVjdFdpZHRoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucGxvdC54Lm92ZXJsYXAuYm90dG9tID0gc2VsZi5jb25maWcueC5ncm91cHMub3ZlcmxhcC5ib3R0b207XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC54Lm92ZXJsYXAudG9wID0gc2VsZi5jb25maWcueC5ncm91cHMub3ZlcmxhcC50b3AgKyBhbGxUaXRsZXNXaWR0aDtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lm1hcmdpbi50b3AgPSBjb25mLm1hcmdpbi5yaWdodCArIGNvbmYueC5ncm91cHMub3ZlcmxhcC50b3A7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5tYXJnaW4uYm90dG9tID0gY29uZi5tYXJnaW4uYm90dG9tICsgY29uZi54Lmdyb3Vwcy5vdmVybGFwLmJvdHRvbTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLnBsb3QueS5vdmVybGFwID0ge1xyXG4gICAgICAgICAgICBsZWZ0OiAwLFxyXG4gICAgICAgICAgICByaWdodDogMFxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICBpZiAodGhpcy5wbG90Lmdyb3VwQnlZKSB7XHJcbiAgICAgICAgICAgIGxldCBkZXB0aCA9IHNlbGYuY29uZmlnLnkuZ3JvdXBzLmtleXMubGVuZ3RoO1xyXG4gICAgICAgICAgICBsZXQgYWxsVGl0bGVzV2lkdGggPSBkZXB0aCAqICh0aXRsZVJlY3RXaWR0aCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC55Lm92ZXJsYXAucmlnaHQgPSBzZWxmLmNvbmZpZy55Lmdyb3Vwcy5vdmVybGFwLmxlZnQgKyBhbGxUaXRsZXNXaWR0aDtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lnkub3ZlcmxhcC5sZWZ0ID0gc2VsZi5jb25maWcueS5ncm91cHMub3ZlcmxhcC5sZWZ0O1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWFyZ2luLmxlZnQgPSBjb25mLm1hcmdpbi5sZWZ0ICsgdGhpcy5wbG90Lnkub3ZlcmxhcC5sZWZ0O1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWFyZ2luLnJpZ2h0ID0gY29uZi5tYXJnaW4ucmlnaHQgKyB0aGlzLnBsb3QueS5vdmVybGFwLnJpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBsb3Quc2hvd0xlZ2VuZCA9IGNvbmYuc2hvd0xlZ2VuZDtcclxuICAgICAgICBpZiAodGhpcy5wbG90LnNob3dMZWdlbmQpIHtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lm1hcmdpbi5yaWdodCArPSBjb25mLmxlZ2VuZC53aWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb21wdXRlUGxvdFNpemUoKTtcclxuICAgICAgICB0aGlzLnNldHVwWlNjYWxlKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwVmFsdWVzKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgY29uZmlnID0gc2VsZi5jb25maWc7XHJcbiAgICAgICAgdmFyIHggPSBzZWxmLnBsb3QueDtcclxuICAgICAgICB2YXIgeSA9IHNlbGYucGxvdC55O1xyXG4gICAgICAgIHZhciB6ID0gc2VsZi5wbG90Lno7XHJcblxyXG5cclxuICAgICAgICB4LnZhbHVlID0gZCA9PiBjb25maWcueC52YWx1ZS5jYWxsKGNvbmZpZywgZCk7XHJcbiAgICAgICAgeS52YWx1ZSA9IGQgPT4gY29uZmlnLnkudmFsdWUuY2FsbChjb25maWcsIGQpO1xyXG4gICAgICAgIHoudmFsdWUgPSBkID0+IGNvbmZpZy56LnZhbHVlLmNhbGwoY29uZmlnLCBkKTtcclxuXHJcbiAgICAgICAgeC51bmlxdWVWYWx1ZXMgPSBbXTtcclxuICAgICAgICB5LnVuaXF1ZVZhbHVlcyA9IFtdO1xyXG5cclxuXHJcbiAgICAgICAgc2VsZi5wbG90Lmdyb3VwQnlZID0gISFjb25maWcueS5ncm91cHMua2V5cy5sZW5ndGg7XHJcbiAgICAgICAgc2VsZi5wbG90Lmdyb3VwQnlYID0gISFjb25maWcueC5ncm91cHMua2V5cy5sZW5ndGg7XHJcblxyXG4gICAgICAgIHkuZ3JvdXBzID0ge1xyXG4gICAgICAgICAgICBrZXk6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgbGFiZWw6ICcnLFxyXG4gICAgICAgICAgICB2YWx1ZXM6IFtdLFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogbnVsbCxcclxuICAgICAgICAgICAgbGV2ZWw6IDAsXHJcbiAgICAgICAgICAgIGluZGV4OiAwLFxyXG4gICAgICAgICAgICBsYXN0SW5kZXg6IDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIHguZ3JvdXBzID0ge1xyXG4gICAgICAgICAgICBrZXk6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgbGFiZWw6ICcnLFxyXG4gICAgICAgICAgICB2YWx1ZXM6IFtdLFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogbnVsbCxcclxuICAgICAgICAgICAgbGV2ZWw6IDAsXHJcbiAgICAgICAgICAgIGluZGV4OiAwLFxyXG4gICAgICAgICAgICBsYXN0SW5kZXg6IDBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgdmFsdWVNYXAgPSB7fTtcclxuICAgICAgICB2YXIgbWluWiA9IHVuZGVmaW5lZDtcclxuICAgICAgICB2YXIgbWF4WiA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmRhdGEuZm9yRWFjaChkPT4ge1xyXG5cclxuICAgICAgICAgICAgdmFyIHhWYWwgPSB4LnZhbHVlKGQpO1xyXG4gICAgICAgICAgICB2YXIgeVZhbCA9IHkudmFsdWUoZCk7XHJcbiAgICAgICAgICAgIHZhciB6VmFsUmF3ID0gei52YWx1ZShkKTtcclxuICAgICAgICAgICAgdmFyIHpWYWwgPSBjb25maWcuei5ub3RBdmFpbGFibGVWYWx1ZSh6VmFsUmF3KSA/IHVuZGVmaW5lZCA6IHBhcnNlRmxvYXQoelZhbFJhdyk7XHJcblxyXG5cclxuICAgICAgICAgICAgaWYgKHgudW5pcXVlVmFsdWVzLmluZGV4T2YoeFZhbCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB4LnVuaXF1ZVZhbHVlcy5wdXNoKHhWYWwpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoeS51bmlxdWVWYWx1ZXMuaW5kZXhPZih5VmFsKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHkudW5pcXVlVmFsdWVzLnB1c2goeVZhbCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBncm91cFkgPSB5Lmdyb3VwcztcclxuICAgICAgICAgICAgaWYgKHNlbGYucGxvdC5ncm91cEJ5WSkge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXBZID0gdGhpcy51cGRhdGVHcm91cHMoZCwgeVZhbCwgeS5ncm91cHMsIGNvbmZpZy55Lmdyb3Vwcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGdyb3VwWCA9IHguZ3JvdXBzO1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5wbG90Lmdyb3VwQnlYKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZ3JvdXBYID0gdGhpcy51cGRhdGVHcm91cHMoZCwgeFZhbCwgeC5ncm91cHMsIGNvbmZpZy54Lmdyb3Vwcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghdmFsdWVNYXBbZ3JvdXBZLmluZGV4XSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWVNYXBbZ3JvdXBZLmluZGV4XSA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXZhbHVlTWFwW2dyb3VwWS5pbmRleF1bZ3JvdXBYLmluZGV4XSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWVNYXBbZ3JvdXBZLmluZGV4XVtncm91cFguaW5kZXhdID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF2YWx1ZU1hcFtncm91cFkuaW5kZXhdW2dyb3VwWC5pbmRleF1beVZhbF0pIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlTWFwW2dyb3VwWS5pbmRleF1bZ3JvdXBYLmluZGV4XVt5VmFsXSA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhbHVlTWFwW2dyb3VwWS5pbmRleF1bZ3JvdXBYLmluZGV4XVt5VmFsXVt4VmFsXSA9IHpWYWw7XHJcblxyXG5cclxuICAgICAgICAgICAgaWYgKG1pblogPT09IHVuZGVmaW5lZCB8fCB6VmFsIDwgbWluWikge1xyXG4gICAgICAgICAgICAgICAgbWluWiA9IHpWYWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG1heFogPT09IHVuZGVmaW5lZCB8fCB6VmFsID4gbWF4Wikge1xyXG4gICAgICAgICAgICAgICAgbWF4WiA9IHpWYWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBzZWxmLnBsb3QudmFsdWVNYXAgPSB2YWx1ZU1hcDtcclxuXHJcblxyXG4gICAgICAgIGlmICghc2VsZi5wbG90Lmdyb3VwQnlYKSB7XHJcbiAgICAgICAgICAgIHguZ3JvdXBzLnZhbHVlcyA9IHgudW5pcXVlVmFsdWVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFzZWxmLnBsb3QuZ3JvdXBCeVkpIHtcclxuICAgICAgICAgICAgeS5ncm91cHMudmFsdWVzID0geS51bmlxdWVWYWx1ZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldHVwVmFsdWVzQmVmb3JlR3JvdXBzU29ydCgpO1xyXG5cclxuICAgICAgICB4LmdhcHMgPSBbXTtcclxuICAgICAgICB4LnRvdGFsVmFsdWVzQ291bnQgPSAwO1xyXG4gICAgICAgIHguYWxsVmFsdWVzTGlzdCA9IFtdO1xyXG4gICAgICAgIHRoaXMuc29ydEdyb3Vwcyh4LCB4Lmdyb3VwcywgY29uZmlnLngpO1xyXG5cclxuICAgICAgICB5LmdhcHMgPSBbXTtcclxuICAgICAgICB5LnRvdGFsVmFsdWVzQ291bnQgPSAwO1xyXG4gICAgICAgIHkuYWxsVmFsdWVzTGlzdCA9IFtdO1xyXG4gICAgICAgIHRoaXMuc29ydEdyb3Vwcyh5LCB5Lmdyb3VwcywgY29uZmlnLnkpO1xyXG5cclxuICAgICAgICB6Lm1pbiA9IG1pblo7XHJcbiAgICAgICAgei5tYXggPSBtYXhaO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBzZXR1cFZhbHVlc0JlZm9yZUdyb3Vwc1NvcnQoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgYnVpbGRDZWxscygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHggPSBzZWxmLnBsb3QueDtcclxuICAgICAgICB2YXIgeSA9IHNlbGYucGxvdC55O1xyXG4gICAgICAgIHZhciB6ID0gc2VsZi5wbG90Lno7XHJcbiAgICAgICAgdmFyIHZhbHVlTWFwID0gc2VsZi5wbG90LnZhbHVlTWFwO1xyXG5cclxuICAgICAgICB2YXIgbWF0cml4Q2VsbHMgPSBzZWxmLnBsb3QuY2VsbHMgPSBbXTtcclxuICAgICAgICB2YXIgbWF0cml4ID0gc2VsZi5wbG90Lm1hdHJpeCA9IFtdO1xyXG5cclxuICAgICAgICB5LmFsbFZhbHVlc0xpc3QuZm9yRWFjaCgodjEsIGkpPT4ge1xyXG4gICAgICAgICAgICB2YXIgcm93ID0gW107XHJcbiAgICAgICAgICAgIG1hdHJpeC5wdXNoKHJvdyk7XHJcblxyXG4gICAgICAgICAgICB4LmFsbFZhbHVlc0xpc3QuZm9yRWFjaCgodjIsIGopID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB6VmFsID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB6VmFsID0gdmFsdWVNYXBbdjEuZ3JvdXAuaW5kZXhdW3YyLmdyb3VwLmluZGV4XVt2MS52YWxdW3YyLnZhbF1cclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY2VsbCA9IHtcclxuICAgICAgICAgICAgICAgICAgICByb3dWYXI6IHYxLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbFZhcjogdjIsXHJcbiAgICAgICAgICAgICAgICAgICAgcm93OiBpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbDogaixcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogelZhbFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJvdy5wdXNoKGNlbGwpO1xyXG5cclxuICAgICAgICAgICAgICAgIG1hdHJpeENlbGxzLnB1c2goY2VsbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVHcm91cHMoZCwgYXhpc1ZhbCwgcm9vdEdyb3VwLCBheGlzR3JvdXBzQ29uZmlnKSB7XHJcblxyXG4gICAgICAgIHZhciBjb25maWcgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICB2YXIgY3VycmVudEdyb3VwID0gcm9vdEdyb3VwO1xyXG4gICAgICAgIGF4aXNHcm91cHNDb25maWcua2V5cy5mb3JFYWNoKChncm91cEtleSwgZ3JvdXBLZXlJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBjdXJyZW50R3JvdXAua2V5ID0gZ3JvdXBLZXk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWN1cnJlbnRHcm91cC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLmNoaWxkcmVuID0ge307XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBncm91cGluZ1ZhbHVlID0gYXhpc0dyb3Vwc0NvbmZpZy52YWx1ZS5jYWxsKGNvbmZpZywgZCwgZ3JvdXBLZXkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFjdXJyZW50R3JvdXAuY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoZ3JvdXBpbmdWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHJvb3RHcm91cC5sYXN0SW5kZXgrKztcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC5jaGlsZHJlbltncm91cGluZ1ZhbHVlXSA9IHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwaW5nVmFsdWU6IGdyb3VwaW5nVmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbGV2ZWw6IGN1cnJlbnRHcm91cC5sZXZlbCArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IHJvb3RHcm91cC5sYXN0SW5kZXgsXHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiBncm91cEtleVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjdXJyZW50R3JvdXAgPSBjdXJyZW50R3JvdXAuY2hpbGRyZW5bZ3JvdXBpbmdWYWx1ZV07XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChjdXJyZW50R3JvdXAudmFsdWVzLmluZGV4T2YoYXhpc1ZhbCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRHcm91cC52YWx1ZXMucHVzaChheGlzVmFsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjdXJyZW50R3JvdXA7XHJcbiAgICB9XHJcblxyXG4gICAgc29ydEdyb3VwcyhheGlzLCBncm91cCwgYXhpc0NvbmZpZywgZ2Fwcykge1xyXG4gICAgICAgIGlmIChheGlzQ29uZmlnLmdyb3Vwcy5sYWJlbHMgJiYgYXhpc0NvbmZpZy5ncm91cHMubGFiZWxzLmxlbmd0aCA+IGdyb3VwLmxldmVsKSB7XHJcbiAgICAgICAgICAgIGdyb3VwLmxhYmVsID0gYXhpc0NvbmZpZy5ncm91cHMubGFiZWxzW2dyb3VwLmxldmVsXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBncm91cC5sYWJlbCA9IGdyb3VwLmtleTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZ2Fwcykge1xyXG4gICAgICAgICAgICBnYXBzID0gWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZ2Fwcy5sZW5ndGggPD0gZ3JvdXAubGV2ZWwpIHtcclxuICAgICAgICAgICAgZ2Fwcy5wdXNoKDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ3JvdXAuYWxsVmFsdWVzQ291bnQgPSBncm91cC5hbGxWYWx1ZXNDb3VudCB8fCAwO1xyXG4gICAgICAgIGdyb3VwLmFsbFZhbHVlc0JlZm9yZUNvdW50ID0gZ3JvdXAuYWxsVmFsdWVzQmVmb3JlQ291bnQgfHwgMDtcclxuXHJcbiAgICAgICAgZ3JvdXAuZ2FwcyA9IGdhcHMuc2xpY2UoKTtcclxuICAgICAgICBncm91cC5nYXBzQmVmb3JlID0gZ2Fwcy5zbGljZSgpO1xyXG5cclxuXHJcbiAgICAgICAgZ3JvdXAuZ2Fwc1NpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBzU2l6ZShncm91cC5nYXBzKTtcclxuICAgICAgICBncm91cC5nYXBzQmVmb3JlU2l6ZSA9IGdyb3VwLmdhcHNTaXplO1xyXG4gICAgICAgIGlmIChncm91cC52YWx1ZXMpIHtcclxuICAgICAgICAgICAgaWYgKGF4aXNDb25maWcuc29ydExhYmVscykge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXAudmFsdWVzLnNvcnQoYXhpc0NvbmZpZy5zb3J0Q29tcGFyYXRvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ3JvdXAudmFsdWVzLmZvckVhY2godj0+YXhpcy5hbGxWYWx1ZXNMaXN0LnB1c2goe3ZhbDogdiwgZ3JvdXA6IGdyb3VwfSkpO1xyXG4gICAgICAgICAgICBncm91cC5hbGxWYWx1ZXNCZWZvcmVDb3VudCA9IGF4aXMudG90YWxWYWx1ZXNDb3VudDtcclxuICAgICAgICAgICAgYXhpcy50b3RhbFZhbHVlc0NvdW50ICs9IGdyb3VwLnZhbHVlcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGdyb3VwLmFsbFZhbHVlc0NvdW50ICs9IGdyb3VwLnZhbHVlcy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBncm91cC5jaGlsZHJlbkxpc3QgPSBbXTtcclxuICAgICAgICBpZiAoZ3JvdXAuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgdmFyIGNoaWxkcmVuQ291bnQgPSAwO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgY2hpbGRQcm9wIGluIGdyb3VwLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXAuY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoY2hpbGRQcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IGdyb3VwLmNoaWxkcmVuW2NoaWxkUHJvcF07XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAuY2hpbGRyZW5MaXN0LnB1c2goY2hpbGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuQ291bnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3J0R3JvdXBzKGF4aXMsIGNoaWxkLCBheGlzQ29uZmlnLCBnYXBzKTtcclxuICAgICAgICAgICAgICAgICAgICBncm91cC5hbGxWYWx1ZXNDb3VudCArPSBjaGlsZC5hbGxWYWx1ZXNDb3VudDtcclxuICAgICAgICAgICAgICAgICAgICBnYXBzW2dyb3VwLmxldmVsXSArPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZ2FwcyAmJiBjaGlsZHJlbkNvdW50ID4gMSkge1xyXG4gICAgICAgICAgICAgICAgZ2Fwc1tncm91cC5sZXZlbF0gLT0gMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZ3JvdXAuZ2Fwc0luc2lkZSA9IFtdO1xyXG4gICAgICAgICAgICBnYXBzLmZvckVhY2goKGQsIGkpPT4ge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXAuZ2Fwc0luc2lkZS5wdXNoKGQgLSAoZ3JvdXAuZ2Fwc0JlZm9yZVtpXSB8fCAwKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBncm91cC5nYXBzSW5zaWRlU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcHNTaXplKGdyb3VwLmdhcHNJbnNpZGUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGF4aXMuZ2Fwcy5sZW5ndGggPCBnYXBzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgYXhpcy5nYXBzID0gZ2FwcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgY29tcHV0ZVlBeGlzTGFiZWxzV2lkdGgob2Zmc2V0KSB7XHJcbiAgICAgICAgdmFyIG1heFdpZHRoID0gdGhpcy5wbG90Lm1hcmdpbi5sZWZ0O1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy55LnRpdGxlKSB7XHJcbiAgICAgICAgICAgIG1heFdpZHRoIC09IDE1O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2Zmc2V0ICYmIG9mZnNldC54KSB7XHJcbiAgICAgICAgICAgIG1heFdpZHRoICs9IG9mZnNldC54O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnkucm90YXRlTGFiZWxzKSB7XHJcbiAgICAgICAgICAgIG1heFdpZHRoICo9IFV0aWxzLlNRUlRfMjtcclxuICAgICAgICAgICAgdmFyIGZvbnRTaXplID0gMTE7IC8vdG9kbyBjaGVjayBhY3R1YWwgZm9udCBzaXplXHJcbiAgICAgICAgICAgIG1heFdpZHRoIC09Zm9udFNpemUvMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBtYXhXaWR0aDtcclxuICAgIH1cclxuXHJcbiAgICBjb21wdXRlWEF4aXNMYWJlbHNXaWR0aChvZmZzZXQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLngucm90YXRlTGFiZWxzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBsb3QuY2VsbFdpZHRoIC0gMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHNpemUgPSB0aGlzLnBsb3QubWFyZ2luLmJvdHRvbTtcclxuICAgICAgICBpZiAodGhpcy5jb25maWcueC50aXRsZSkge1xyXG4gICAgICAgICAgICBzaXplIC09IDE1O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2Zmc2V0ICYmIG9mZnNldC55KSB7XHJcbiAgICAgICAgICAgIHNpemUgLT0gb2Zmc2V0Lnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzaXplICo9IFV0aWxzLlNRUlRfMjtcclxuXHJcbiAgICAgICAgdmFyIGZvbnRTaXplID0gMTE7IC8vdG9kbyBjaGVjayBhY3R1YWwgZm9udCBzaXplXHJcbiAgICAgICAgc2l6ZSAtPWZvbnRTaXplLzI7XHJcblxyXG4gICAgICAgIHJldHVybiBzaXplO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjb21wdXRlR2FwU2l6ZShnYXBMZXZlbCkge1xyXG4gICAgICAgIHJldHVybiBIZWF0bWFwLm1heEdyb3VwR2FwU2l6ZSAvIChnYXBMZXZlbCArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjb21wdXRlR2Fwc1NpemUoZ2Fwcykge1xyXG4gICAgICAgIHZhciBnYXBzU2l6ZSA9IDA7XHJcbiAgICAgICAgZ2Fwcy5mb3JFYWNoKChnYXBzTnVtYmVyLCBnYXBzTGV2ZWwpPT4gZ2Fwc1NpemUgKz0gZ2Fwc051bWJlciAqIEhlYXRtYXAuY29tcHV0ZUdhcFNpemUoZ2Fwc0xldmVsKSk7XHJcbiAgICAgICAgcmV0dXJuIGdhcHNTaXplO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXB1dGVQbG90U2l6ZSgpIHtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICB2YXIgbWFyZ2luID0gcGxvdC5tYXJnaW47XHJcbiAgICAgICAgdmFyIGF2YWlsYWJsZVdpZHRoID0gVXRpbHMuYXZhaWxhYmxlV2lkdGgodGhpcy5jb25maWcud2lkdGgsIHRoaXMuZ2V0QmFzZUNvbnRhaW5lcigpLCB0aGlzLnBsb3QubWFyZ2luKTtcclxuICAgICAgICB2YXIgYXZhaWxhYmxlSGVpZ2h0ID0gVXRpbHMuYXZhaWxhYmxlSGVpZ2h0KHRoaXMuY29uZmlnLmhlaWdodCwgdGhpcy5nZXRCYXNlQ29udGFpbmVyKCksIHRoaXMucGxvdC5tYXJnaW4pO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IGF2YWlsYWJsZVdpZHRoO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBhdmFpbGFibGVIZWlnaHQ7XHJcblxyXG4gICAgICAgIHZhciB4R2Fwc1NpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBzU2l6ZShwbG90LnguZ2Fwcyk7XHJcblxyXG5cclxuICAgICAgICB2YXIgY29tcHV0ZWRDZWxsV2lkdGggPSBNYXRoLm1heChjb25mLmNlbGwuc2l6ZU1pbiwgTWF0aC5taW4oY29uZi5jZWxsLnNpemVNYXgsIChhdmFpbGFibGVXaWR0aCAtIHhHYXBzU2l6ZSkgLyB0aGlzLnBsb3QueC50b3RhbFZhbHVlc0NvdW50KSk7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLndpZHRoKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY29uZmlnLmNlbGwud2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsV2lkdGggPSBjb21wdXRlZENlbGxXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuY2VsbFdpZHRoID0gdGhpcy5jb25maWcuY2VsbC53aWR0aDtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wbG90LmNlbGxXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxXaWR0aCA9IGNvbXB1dGVkQ2VsbFdpZHRoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICB3aWR0aCA9IHRoaXMucGxvdC5jZWxsV2lkdGggKiB0aGlzLnBsb3QueC50b3RhbFZhbHVlc0NvdW50ICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQgKyB4R2Fwc1NpemU7XHJcblxyXG4gICAgICAgIHZhciB5R2Fwc1NpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBzU2l6ZShwbG90LnkuZ2Fwcyk7XHJcbiAgICAgICAgdmFyIGNvbXB1dGVkQ2VsbEhlaWdodCA9IE1hdGgubWF4KGNvbmYuY2VsbC5zaXplTWluLCBNYXRoLm1pbihjb25mLmNlbGwuc2l6ZU1heCwgKGF2YWlsYWJsZUhlaWdodCAtIHlHYXBzU2l6ZSkgLyB0aGlzLnBsb3QueS50b3RhbFZhbHVlc0NvdW50KSk7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmhlaWdodCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY29uZmlnLmNlbGwuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuY2VsbEhlaWdodCA9IGNvbXB1dGVkQ2VsbEhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsSGVpZ2h0ID0gdGhpcy5jb25maWcuY2VsbC5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMucGxvdC5jZWxsSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuY2VsbEhlaWdodCA9IGNvbXB1dGVkQ2VsbEhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGhlaWdodCA9IHRoaXMucGxvdC5jZWxsSGVpZ2h0ICogdGhpcy5wbG90LnkudG90YWxWYWx1ZXNDb3VudCArIG1hcmdpbi50b3AgKyBtYXJnaW4uYm90dG9tICsgeUdhcHNTaXplO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5wbG90LndpZHRoID0gd2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodDtcclxuICAgICAgICB0aGlzLnBsb3QuaGVpZ2h0ID0gaGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNldHVwWlNjYWxlKCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGNvbmZpZyA9IHNlbGYuY29uZmlnO1xyXG4gICAgICAgIHZhciB6ID0gc2VsZi5wbG90Lno7XHJcbiAgICAgICAgdmFyIHJhbmdlID0gY29uZmlnLmNvbG9yLnJhbmdlO1xyXG4gICAgICAgIHZhciBleHRlbnQgPSB6Lm1heCAtIHoubWluO1xyXG4gICAgICAgIHZhciBzY2FsZTtcclxuICAgICAgICB6LmRvbWFpbiA9IFtdO1xyXG4gICAgICAgIGlmIChjb25maWcuY29sb3Iuc2NhbGUgPT0gXCJwb3dcIikge1xyXG4gICAgICAgICAgICB2YXIgZXhwb25lbnQgPSAxMDtcclxuICAgICAgICAgICAgcmFuZ2UuZm9yRWFjaCgoYywgaSk9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdiA9IHoubWF4IC0gKGV4dGVudCAvIE1hdGgucG93KDEwLCBpKSk7XHJcbiAgICAgICAgICAgICAgICB6LmRvbWFpbi5wdXNoKHYpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzY2FsZSA9IGQzLnNjYWxlLnBvdygpLmV4cG9uZW50KGV4cG9uZW50KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbmZpZy5jb2xvci5zY2FsZSA9PSBcImxvZ1wiKSB7XHJcblxyXG4gICAgICAgICAgICByYW5nZS5mb3JFYWNoKChjLCBpKT0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB2ID0gei5taW4gKyAoZXh0ZW50IC8gTWF0aC5wb3coMTAsIGkpKTtcclxuICAgICAgICAgICAgICAgIHouZG9tYWluLnVuc2hpZnQodilcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc2NhbGUgPSBkMy5zY2FsZS5sb2coKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJhbmdlLmZvckVhY2goKGMsIGkpPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHYgPSB6Lm1pbiArIChleHRlbnQgKiAoaSAvIChyYW5nZS5sZW5ndGggLSAxKSkpO1xyXG4gICAgICAgICAgICAgICAgei5kb21haW4ucHVzaCh2KVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc2NhbGUgPSBkMy5zY2FsZVtjb25maWcuY29sb3Iuc2NhbGVdKCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgei5kb21haW5bMF0gPSB6Lm1pbjsgLy9yZW1vdmluZyB1bm5lY2Vzc2FyeSBmbG9hdGluZyBwb2ludHNcclxuICAgICAgICB6LmRvbWFpblt6LmRvbWFpbi5sZW5ndGggLSAxXSA9IHoubWF4OyAvL3JlbW92aW5nIHVubmVjZXNzYXJ5IGZsb2F0aW5nIHBvaW50c1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHouZG9tYWluKTtcclxuXHJcbiAgICAgICAgaWYgKGNvbmZpZy5jb2xvci5yZXZlcnNlU2NhbGUpIHtcclxuICAgICAgICAgICAgei5kb21haW4ucmV2ZXJzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHJhbmdlKTtcclxuICAgICAgICBwbG90LnouY29sb3Iuc2NhbGUgPSBzY2FsZS5kb21haW4oei5kb21haW4pLnJhbmdlKHJhbmdlKTtcclxuICAgICAgICB2YXIgc2hhcGUgPSBwbG90Lnouc2hhcGUgPSB7fTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxDb25mID0gdGhpcy5jb25maWcuY2VsbDtcclxuICAgICAgICBzaGFwZS50eXBlID0gXCJyZWN0XCI7XHJcblxyXG4gICAgICAgIHBsb3Quei5zaGFwZS53aWR0aCA9IHBsb3QuY2VsbFdpZHRoIC0gY2VsbENvbmYucGFkZGluZyAqIDI7XHJcbiAgICAgICAgcGxvdC56LnNoYXBlLmhlaWdodCA9IHBsb3QuY2VsbEhlaWdodCAtIGNlbGxDb25mLnBhZGRpbmcgKiAyO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB1cGRhdGUobmV3RGF0YSkge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuICAgICAgICBpZiAodGhpcy5wbG90Lmdyb3VwQnlZKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0dyb3Vwc1kodGhpcy5wbG90LnkuZ3JvdXBzLCB0aGlzLnN2Z0cpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5wbG90Lmdyb3VwQnlYKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0dyb3Vwc1godGhpcy5wbG90LnguZ3JvdXBzLCB0aGlzLnN2Z0cpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVDZWxscygpO1xyXG5cclxuICAgICAgICAvLyB0aGlzLnVwZGF0ZVZhcmlhYmxlTGFiZWxzKCk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlQXhpc1goKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUF4aXNZKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5zaG93TGVnZW5kKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGVnZW5kKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUF4aXNUaXRsZXMoKTtcclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlQXhpc1RpdGxlcygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcblxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgdXBkYXRlQXhpc1goKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBsYWJlbENsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImxhYmVsXCIpO1xyXG4gICAgICAgIHZhciBsYWJlbFhDbGFzcyA9IGxhYmVsQ2xhc3MgKyBcIi14XCI7XHJcbiAgICAgICAgdmFyIGxhYmVsWUNsYXNzID0gbGFiZWxDbGFzcyArIFwiLXlcIjtcclxuICAgICAgICBwbG90LmxhYmVsQ2xhc3MgPSBsYWJlbENsYXNzO1xyXG5cclxuICAgICAgICB2YXIgb2Zmc2V0WCA9IHtcclxuICAgICAgICAgICAgeDogMCxcclxuICAgICAgICAgICAgeTogMFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGV0IGdhcFNpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBTaXplKDApO1xyXG4gICAgICAgIGlmIChwbG90Lmdyb3VwQnlYKSB7XHJcbiAgICAgICAgICAgIGxldCBvdmVybGFwID0gc2VsZi5jb25maWcueC5ncm91cHMub3ZlcmxhcDtcclxuXHJcbiAgICAgICAgICAgIG9mZnNldFgueCA9IGdhcFNpemUgLyAyO1xyXG4gICAgICAgICAgICBvZmZzZXRYLnkgPSBvdmVybGFwLmJvdHRvbSArIGdhcFNpemUgLyAyICsgNjtcclxuICAgICAgICB9IGVsc2UgaWYgKHBsb3QuZ3JvdXBCeVkpIHtcclxuICAgICAgICAgICAgb2Zmc2V0WC55ID0gZ2FwU2l6ZTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB2YXIgbGFiZWxzID0gc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyBsYWJlbFhDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGxvdC54LmFsbFZhbHVlc0xpc3QsIChkLCBpKT0+aSk7XHJcblxyXG4gICAgICAgIGxhYmVscy5lbnRlcigpLmFwcGVuZChcInRleHRcIikuYXR0cihcImNsYXNzXCIsIChkLCBpKSA9PiBsYWJlbENsYXNzICsgXCIgXCIgKyBsYWJlbFhDbGFzcyArIFwiIFwiICsgbGFiZWxYQ2xhc3MgKyBcIi1cIiArIGkpO1xyXG5cclxuICAgICAgICBsYWJlbHNcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIChkLCBpKSA9PiAoaSAqIHBsb3QuY2VsbFdpZHRoICsgcGxvdC5jZWxsV2lkdGggLyAyKSArIChkLmdyb3VwLmdhcHNTaXplKSArIG9mZnNldFgueClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIHBsb3QuaGVpZ2h0ICsgb2Zmc2V0WC55KVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIDEwKVxyXG5cclxuICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAudGV4dChkPT5zZWxmLmZvcm1hdFZhbHVlWChkLnZhbCkpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHZhciBtYXhXaWR0aCA9IHNlbGYuY29tcHV0ZVhBeGlzTGFiZWxzV2lkdGgob2Zmc2V0WCk7XHJcblxyXG4gICAgICAgIGxhYmVscy5lYWNoKGZ1bmN0aW9uIChsYWJlbCkge1xyXG4gICAgICAgICAgICB2YXIgZWxlbSA9IGQzLnNlbGVjdCh0aGlzKSxcclxuICAgICAgICAgICAgICAgIHRleHQgPSBzZWxmLmZvcm1hdFZhbHVlWChsYWJlbC52YWwpO1xyXG4gICAgICAgICAgICBVdGlscy5wbGFjZVRleHRXaXRoRWxsaXBzaXNBbmRUb29sdGlwKGVsZW0sIHRleHQsIG1heFdpZHRoLCBzZWxmLmNvbmZpZy5zaG93VG9vbHRpcCA/IHNlbGYucGxvdC50b29sdGlwIDogZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoc2VsZi5jb25maWcueC5yb3RhdGVMYWJlbHMpIHtcclxuICAgICAgICAgICAgbGFiZWxzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwicm90YXRlKC00NSwgXCIgKyAoKGkgKiBwbG90LmNlbGxXaWR0aCArIHBsb3QuY2VsbFdpZHRoIC8gMikgKyBkLmdyb3VwLmdhcHNTaXplICsgb2Zmc2V0WC54ICkgKyBcIiwgXCIgKyAoIHBsb3QuaGVpZ2h0ICsgb2Zmc2V0WC55KSArIFwiKVwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJkeFwiLCAtMilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgOClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgbGFiZWxzLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcblxyXG4gICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RPckFwcGVuZChcImcuXCIgKyBzZWxmLnByZWZpeENsYXNzKCdheGlzLXgnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAocGxvdC53aWR0aCAvIDIpICsgXCIsXCIgKyAocGxvdC5oZWlnaHQgKyBwbG90Lm1hcmdpbi5ib3R0b20pICsgXCIpXCIpXHJcbiAgICAgICAgICAgIC5zZWxlY3RPckFwcGVuZChcInRleHQuXCIgKyBzZWxmLnByZWZpeENsYXNzKCdsYWJlbCcpKVxyXG5cclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCBcIi0wLjVlbVwiKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAudGV4dChzZWxmLmNvbmZpZy54LnRpdGxlKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVBeGlzWSgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGxhYmVsQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwibGFiZWxcIik7XHJcbiAgICAgICAgdmFyIGxhYmVsWUNsYXNzID0gbGFiZWxDbGFzcyArIFwiLXlcIjtcclxuICAgICAgICBwbG90LmxhYmVsQ2xhc3MgPSBsYWJlbENsYXNzO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGxhYmVscyA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgbGFiZWxZQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBsb3QueS5hbGxWYWx1ZXNMaXN0KTtcclxuXHJcbiAgICAgICAgbGFiZWxzLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKTtcclxuXHJcbiAgICAgICAgdmFyIG9mZnNldFkgPSB7XHJcbiAgICAgICAgICAgIHg6IDAsXHJcbiAgICAgICAgICAgIHk6IDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmIChwbG90Lmdyb3VwQnlZKSB7XHJcbiAgICAgICAgICAgIGxldCBvdmVybGFwID0gc2VsZi5jb25maWcueS5ncm91cHMub3ZlcmxhcDtcclxuICAgICAgICAgICAgbGV0IGdhcFNpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBTaXplKDApO1xyXG4gICAgICAgICAgICBvZmZzZXRZLnggPSAtb3ZlcmxhcC5sZWZ0O1xyXG5cclxuICAgICAgICAgICAgb2Zmc2V0WS55ID0gZ2FwU2l6ZSAvIDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxhYmVsc1xyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgb2Zmc2V0WS54KVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgKGQsIGkpID0+IChpICogcGxvdC5jZWxsSGVpZ2h0ICsgcGxvdC5jZWxsSGVpZ2h0IC8gMikgKyBkLmdyb3VwLmdhcHNTaXplICsgb2Zmc2V0WS55KVxyXG4gICAgICAgICAgICAuYXR0cihcImR4XCIsIC0yKVxyXG4gICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgKGQsIGkpID0+IGxhYmVsQ2xhc3MgKyBcIiBcIiArIGxhYmVsWUNsYXNzICsgXCIgXCIgKyBsYWJlbFlDbGFzcyArIFwiLVwiICsgaSlcclxuXHJcbiAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZm9ybWF0dGVkID0gc2VsZi5mb3JtYXRWYWx1ZVkoZC52YWwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdHRlZFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIG1heFdpZHRoID0gc2VsZi5jb21wdXRlWUF4aXNMYWJlbHNXaWR0aChvZmZzZXRZKTtcclxuXHJcbiAgICAgICAgbGFiZWxzLmVhY2goZnVuY3Rpb24gKGxhYmVsKSB7XHJcbiAgICAgICAgICAgIHZhciBlbGVtID0gZDMuc2VsZWN0KHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgdGV4dCA9IHNlbGYuZm9ybWF0VmFsdWVZKGxhYmVsLnZhbCk7XHJcbiAgICAgICAgICAgIFV0aWxzLnBsYWNlVGV4dFdpdGhFbGxpcHNpc0FuZFRvb2x0aXAoZWxlbSwgdGV4dCwgbWF4V2lkdGgsIHNlbGYuY29uZmlnLnNob3dUb29sdGlwID8gc2VsZi5wbG90LnRvb2x0aXAgOiBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy55LnJvdGF0ZUxhYmVscykge1xyXG4gICAgICAgICAgICBsYWJlbHNcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInJvdGF0ZSgtNDUsIFwiICsgKG9mZnNldFkueCAgKSArIFwiLCBcIiArIChkLmdyb3VwLmdhcHNTaXplICsgKGkgKiBwbG90LmNlbGxIZWlnaHQgKyBwbG90LmNlbGxIZWlnaHQgLyAyKSArIG9mZnNldFkueSkgKyBcIilcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIik7XHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiZHhcIiwgLTcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxhYmVscy5hdHRyKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBsYWJlbHMuZXhpdCgpLnJlbW92ZSgpO1xyXG5cclxuXHJcbiAgICAgICAgc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIiArIHNlbGYucHJlZml4Q2xhc3MoJ2F4aXMteScpKVxyXG4gICAgICAgICAgICAuc2VsZWN0T3JBcHBlbmQoXCJ0ZXh0LlwiICsgc2VsZi5wcmVmaXhDbGFzcygnbGFiZWwnKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAtcGxvdC5tYXJnaW4ubGVmdCArIFwiLFwiICsgKHBsb3QuaGVpZ2h0IC8gMikgKyBcIilyb3RhdGUoLTkwKVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KHNlbGYuY29uZmlnLnkudGl0bGUpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgZHJhd0dyb3Vwc1kocGFyZW50R3JvdXAsIGNvbnRhaW5lciwgYXZhaWxhYmxlV2lkdGgpIHtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG5cclxuICAgICAgICB2YXIgZ3JvdXBDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJncm91cFwiKTtcclxuICAgICAgICB2YXIgZ3JvdXBZQ2xhc3MgPSBncm91cENsYXNzICsgXCIteVwiO1xyXG4gICAgICAgIHZhciBncm91cHMgPSBjb250YWluZXIuc2VsZWN0QWxsKFwiZy5cIiArIGdyb3VwQ2xhc3MgKyBcIi5cIiArIGdyb3VwWUNsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShwYXJlbnRHcm91cC5jaGlsZHJlbkxpc3QpO1xyXG5cclxuICAgICAgICB2YXIgdmFsdWVzQmVmb3JlQ291bnQgPSAwO1xyXG4gICAgICAgIHZhciBnYXBzQmVmb3JlU2l6ZSA9IDA7XHJcblxyXG4gICAgICAgIHZhciBncm91cHNFbnRlckcgPSBncm91cHMuZW50ZXIoKS5hcHBlbmQoXCJnXCIpO1xyXG4gICAgICAgIGdyb3Vwc0VudGVyR1xyXG4gICAgICAgICAgICAuY2xhc3NlZChncm91cENsYXNzLCB0cnVlKVxyXG4gICAgICAgICAgICAuY2xhc3NlZChncm91cFlDbGFzcywgdHJ1ZSlcclxuICAgICAgICAgICAgLmFwcGVuZChcInJlY3RcIikuY2xhc3NlZChcImdyb3VwLXJlY3RcIiwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIHZhciB0aXRsZUdyb3VwRW50ZXIgPSBncm91cHNFbnRlckcuYXBwZW5kU2VsZWN0b3IoXCJnLnRpdGxlXCIpO1xyXG4gICAgICAgIHRpdGxlR3JvdXBFbnRlci5hcHBlbmQoXCJyZWN0XCIpO1xyXG4gICAgICAgIHRpdGxlR3JvdXBFbnRlci5hcHBlbmQoXCJ0ZXh0XCIpO1xyXG5cclxuICAgICAgICB2YXIgZ2FwU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcFNpemUocGFyZW50R3JvdXAubGV2ZWwpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gZ2FwU2l6ZSAvIDQ7XHJcblxyXG4gICAgICAgIHZhciB0aXRsZVJlY3RXaWR0aCA9IEhlYXRtYXAuZ3JvdXBUaXRsZVJlY3RIZWlnaHQ7XHJcbiAgICAgICAgdmFyIGRlcHRoID0gc2VsZi5jb25maWcueS5ncm91cHMua2V5cy5sZW5ndGggLSBwYXJlbnRHcm91cC5sZXZlbDtcclxuICAgICAgICB2YXIgb3ZlcmxhcCA9IHtcclxuICAgICAgICAgICAgbGVmdDogMCxcclxuICAgICAgICAgICAgcmlnaHQ6IDBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoIWF2YWlsYWJsZVdpZHRoKSB7XHJcbiAgICAgICAgICAgIG92ZXJsYXAucmlnaHQgPSBwbG90Lnkub3ZlcmxhcC5sZWZ0O1xyXG4gICAgICAgICAgICBvdmVybGFwLmxlZnQgPSBwbG90Lnkub3ZlcmxhcC5sZWZ0O1xyXG4gICAgICAgICAgICBhdmFpbGFibGVXaWR0aCA9IHBsb3Qud2lkdGggKyBnYXBTaXplICsgb3ZlcmxhcC5sZWZ0ICsgb3ZlcmxhcC5yaWdodDtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBncm91cHNcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB0cmFuc2xhdGUgPSBcInRyYW5zbGF0ZShcIiArIChwYWRkaW5nIC0gb3ZlcmxhcC5sZWZ0KSArIFwiLFwiICsgKChwbG90LmNlbGxIZWlnaHQgKiB2YWx1ZXNCZWZvcmVDb3VudCkgKyBpICogZ2FwU2l6ZSArIGdhcHNCZWZvcmVTaXplICsgcGFkZGluZykgKyBcIilcIjtcclxuICAgICAgICAgICAgICAgIGdhcHNCZWZvcmVTaXplICs9IChkLmdhcHNJbnNpZGVTaXplIHx8IDApO1xyXG4gICAgICAgICAgICAgICAgdmFsdWVzQmVmb3JlQ291bnQgKz0gZC5hbGxWYWx1ZXNDb3VudCB8fCAwO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYW5zbGF0ZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHZhciBncm91cFdpZHRoID0gYXZhaWxhYmxlV2lkdGggLSBwYWRkaW5nICogMjtcclxuXHJcbiAgICAgICAgdmFyIHRpdGxlR3JvdXBzID0gZ3JvdXBzLnNlbGVjdEFsbChcImcudGl0bGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwidHJhbnNsYXRlKFwiICsgKGdyb3VwV2lkdGggLSB0aXRsZVJlY3RXaWR0aCkgKyBcIiwgMClcIik7XHJcblxyXG4gICAgICAgIHZhciB0aWxlUmVjdHMgPSB0aXRsZUdyb3Vwcy5zZWxlY3RBbGwoXCJyZWN0XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgdGl0bGVSZWN0V2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGQ9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCkgKyBwbG90LmNlbGxIZWlnaHQgKiBkLmFsbFZhbHVlc0NvdW50ICsgcGFkZGluZyAqIDJcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAwKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcImZpbGxcIiwgXCJsaWdodGdyZXlcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0R3JvdXBNb3VzZUNhbGxiYWNrcyhwYXJlbnRHcm91cCwgdGlsZVJlY3RzKTtcclxuXHJcblxyXG4gICAgICAgIGdyb3Vwcy5zZWxlY3RBbGwoXCJyZWN0Lmdyb3VwLXJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBkPT4gXCJncm91cC1yZWN0IGdyb3VwLXJlY3QtXCIgKyBkLmluZGV4KVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGdyb3VwV2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGQ9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCkgKyBwbG90LmNlbGxIZWlnaHQgKiBkLmFsbFZhbHVlc0NvdW50ICsgcGFkZGluZyAqIDJcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgXCJ3aGl0ZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImZpbGwtb3BhY2l0eVwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCAwLjUpXHJcbiAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlXCIsIFwiYmxhY2tcIilcclxuXHJcblxyXG4gICAgICAgIGdyb3Vwcy5lYWNoKGZ1bmN0aW9uIChncm91cCkge1xyXG5cclxuICAgICAgICAgICAgc2VsZi5kcmF3R3JvdXBzWS5jYWxsKHNlbGYsIGdyb3VwLCBkMy5zZWxlY3QodGhpcyksIGdyb3VwV2lkdGggLSB0aXRsZVJlY3RXaWR0aCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGRyYXdHcm91cHNYKHBhcmVudEdyb3VwLCBjb250YWluZXIsIGF2YWlsYWJsZUhlaWdodCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcblxyXG4gICAgICAgIHZhciBncm91cENsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImdyb3VwXCIpO1xyXG4gICAgICAgIHZhciBncm91cFhDbGFzcyA9IGdyb3VwQ2xhc3MgKyBcIi14XCI7XHJcbiAgICAgICAgdmFyIGdyb3VwcyA9IGNvbnRhaW5lci5zZWxlY3RBbGwoXCJnLlwiICsgZ3JvdXBDbGFzcyArIFwiLlwiICsgZ3JvdXBYQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBhcmVudEdyb3VwLmNoaWxkcmVuTGlzdCk7XHJcblxyXG4gICAgICAgIHZhciB2YWx1ZXNCZWZvcmVDb3VudCA9IDA7XHJcbiAgICAgICAgdmFyIGdhcHNCZWZvcmVTaXplID0gMDtcclxuXHJcbiAgICAgICAgdmFyIGdyb3Vwc0VudGVyRyA9IGdyb3Vwcy5lbnRlcigpLmFwcGVuZChcImdcIik7XHJcbiAgICAgICAgZ3JvdXBzRW50ZXJHXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKGdyb3VwQ2xhc3MsIHRydWUpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKGdyb3VwWENsYXNzLCB0cnVlKVxyXG4gICAgICAgICAgICAuYXBwZW5kKFwicmVjdFwiKS5jbGFzc2VkKFwiZ3JvdXAtcmVjdFwiLCB0cnVlKTtcclxuXHJcbiAgICAgICAgdmFyIHRpdGxlR3JvdXBFbnRlciA9IGdyb3Vwc0VudGVyRy5hcHBlbmRTZWxlY3RvcihcImcudGl0bGVcIik7XHJcbiAgICAgICAgdGl0bGVHcm91cEVudGVyLmFwcGVuZChcInJlY3RcIik7XHJcbiAgICAgICAgdGl0bGVHcm91cEVudGVyLmFwcGVuZChcInRleHRcIik7XHJcblxyXG4gICAgICAgIHZhciBnYXBTaXplID0gSGVhdG1hcC5jb21wdXRlR2FwU2l6ZShwYXJlbnRHcm91cC5sZXZlbCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBnYXBTaXplIC8gNDtcclxuICAgICAgICB2YXIgdGl0bGVSZWN0SGVpZ2h0ID0gSGVhdG1hcC5ncm91cFRpdGxlUmVjdEhlaWdodDtcclxuXHJcbiAgICAgICAgdmFyIGRlcHRoID0gc2VsZi5jb25maWcueC5ncm91cHMua2V5cy5sZW5ndGggLSBwYXJlbnRHcm91cC5sZXZlbDtcclxuXHJcbiAgICAgICAgdmFyIG92ZXJsYXAgPSB7XHJcbiAgICAgICAgICAgIHRvcDogMCxcclxuICAgICAgICAgICAgYm90dG9tOiAwXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKCFhdmFpbGFibGVIZWlnaHQpIHtcclxuICAgICAgICAgICAgb3ZlcmxhcC5ib3R0b20gPSBwbG90Lngub3ZlcmxhcC5ib3R0b207XHJcbiAgICAgICAgICAgIG92ZXJsYXAudG9wID0gcGxvdC54Lm92ZXJsYXAudG9wO1xyXG4gICAgICAgICAgICBhdmFpbGFibGVIZWlnaHQgPSBwbG90LmhlaWdodCArIGdhcFNpemUgKyBvdmVybGFwLnRvcCArIG92ZXJsYXAuYm90dG9tO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvdmVybGFwLnRvcCA9IC10aXRsZVJlY3RIZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdwYXJlbnRHcm91cCcscGFyZW50R3JvdXAsICdnYXBTaXplJywgZ2FwU2l6ZSwgcGxvdC54Lm92ZXJsYXApO1xyXG5cclxuICAgICAgICBncm91cHNcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB0cmFuc2xhdGUgPSBcInRyYW5zbGF0ZShcIiArICgocGxvdC5jZWxsV2lkdGggKiB2YWx1ZXNCZWZvcmVDb3VudCkgKyBpICogZ2FwU2l6ZSArIGdhcHNCZWZvcmVTaXplICsgcGFkZGluZykgKyBcIiwgXCIgKyAocGFkZGluZyAtIG92ZXJsYXAudG9wKSArIFwiKVwiO1xyXG4gICAgICAgICAgICAgICAgZ2Fwc0JlZm9yZVNpemUgKz0gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCk7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZXNCZWZvcmVDb3VudCArPSBkLmFsbFZhbHVlc0NvdW50IHx8IDA7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhbnNsYXRlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgZ3JvdXBIZWlnaHQgPSBhdmFpbGFibGVIZWlnaHQgLSBwYWRkaW5nICogMjtcclxuXHJcbiAgICAgICAgdmFyIHRpdGxlR3JvdXBzID0gZ3JvdXBzLnNlbGVjdEFsbChcImcudGl0bGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwidHJhbnNsYXRlKDAsIFwiICsgKDApICsgXCIpXCIpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIHRpbGVSZWN0cyA9IHRpdGxlR3JvdXBzLnNlbGVjdEFsbChcInJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgdGl0bGVSZWN0SGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGQ9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCkgKyBwbG90LmNlbGxXaWR0aCAqIGQuYWxsVmFsdWVzQ291bnQgKyBwYWRkaW5nICogMlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIDApXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiZmlsbFwiLCBcImxpZ2h0Z3JleVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRHcm91cE1vdXNlQ2FsbGJhY2tzKHBhcmVudEdyb3VwLCB0aWxlUmVjdHMpO1xyXG5cclxuXHJcbiAgICAgICAgZ3JvdXBzLnNlbGVjdEFsbChcInJlY3QuZ3JvdXAtcmVjdFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGQ9PiBcImdyb3VwLXJlY3QgZ3JvdXAtcmVjdC1cIiArIGQuaW5kZXgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGdyb3VwSGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGQ9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCkgKyBwbG90LmNlbGxXaWR0aCAqIGQuYWxsVmFsdWVzQ291bnQgKyBwYWRkaW5nICogMlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCBcIndoaXRlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZmlsbC1vcGFjaXR5XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDAuNSlcclxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2VcIiwgXCJibGFja1wiKTtcclxuXHJcbiAgICAgICAgZ3JvdXBzLmVhY2goZnVuY3Rpb24gKGdyb3VwKSB7XHJcbiAgICAgICAgICAgIHNlbGYuZHJhd0dyb3Vwc1guY2FsbChzZWxmLCBncm91cCwgZDMuc2VsZWN0KHRoaXMpLCBncm91cEhlaWdodCAtIHRpdGxlUmVjdEhlaWdodCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGdyb3Vwcy5leGl0KCkucmVtb3ZlKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNldEdyb3VwTW91c2VDYWxsYmFja3MocGFyZW50R3JvdXAsIHRpbGVSZWN0cykge1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgbW91c2VvdmVyQ2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoJ2hpZ2hsaWdodGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzLnBhcmVudE5vZGUucGFyZW50Tm9kZSkuc2VsZWN0QWxsKFwicmVjdC5ncm91cC1yZWN0LVwiICsgZC5pbmRleCkuY2xhc3NlZCgnaGlnaGxpZ2h0ZWQnLCB0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIG1vdXNlb3V0Q2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgbW91c2VvdXRDYWxsYmFja3MucHVzaChmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICBkMy5zZWxlY3QodGhpcykuY2xhc3NlZCgnaGlnaGxpZ2h0ZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzLnBhcmVudE5vZGUucGFyZW50Tm9kZSkuc2VsZWN0QWxsKFwicmVjdC5ncm91cC1yZWN0LVwiICsgZC5pbmRleCkuY2xhc3NlZCgnaGlnaGxpZ2h0ZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHBsb3QudG9vbHRpcCkge1xyXG5cclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goZD0+IHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGh0bWwgPSBwYXJlbnRHcm91cC5sYWJlbCArIFwiOiBcIiArIGQuZ3JvdXBpbmdWYWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAuaHRtbChodG1sKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkMy5ldmVudC5wYWdlWSAtIDI4KSArIFwicHhcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MucHVzaChkPT4ge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgdGlsZVJlY3RzLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKHNlbGYsIGQpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRpbGVSZWN0cy5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoc2VsZiwgZClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlQ2VsbHMoKSB7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgY2VsbENvbnRhaW5lckNsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImNlbGxzXCIpO1xyXG4gICAgICAgIHZhciBnYXBTaXplID0gSGVhdG1hcC5jb21wdXRlR2FwU2l6ZSgwKTtcclxuICAgICAgICB2YXIgcGFkZGluZ1ggPSBwbG90LnguZ3JvdXBzLmNoaWxkcmVuTGlzdC5sZW5ndGggPyBnYXBTaXplIC8gMiA6IDA7XHJcbiAgICAgICAgdmFyIHBhZGRpbmdZID0gcGxvdC55Lmdyb3Vwcy5jaGlsZHJlbkxpc3QubGVuZ3RoID8gZ2FwU2l6ZSAvIDIgOiAwO1xyXG4gICAgICAgIHZhciBjZWxsQ29udGFpbmVyID0gc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIiArIGNlbGxDb250YWluZXJDbGFzcyk7XHJcbiAgICAgICAgY2VsbENvbnRhaW5lci5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgcGFkZGluZ1ggKyBcIiwgXCIgKyBwYWRkaW5nWSArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJjZWxsXCIpO1xyXG4gICAgICAgIHZhciBjZWxsU2hhcGUgPSBwbG90Lnouc2hhcGUudHlwZTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxzID0gY2VsbENvbnRhaW5lci5zZWxlY3RBbGwoXCJnLlwiICsgY2VsbENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShzZWxmLnBsb3QuY2VsbHMpO1xyXG5cclxuICAgICAgICB2YXIgY2VsbEVudGVyRyA9IGNlbGxzLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuY2xhc3NlZChjZWxsQ2xhc3MsIHRydWUpO1xyXG4gICAgICAgIGNlbGxzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYz0+IFwidHJhbnNsYXRlKFwiICsgKChwbG90LmNlbGxXaWR0aCAqIGMuY29sICsgcGxvdC5jZWxsV2lkdGggLyAyKSArIGMuY29sVmFyLmdyb3VwLmdhcHNTaXplKSArIFwiLFwiICsgKChwbG90LmNlbGxIZWlnaHQgKiBjLnJvdyArIHBsb3QuY2VsbEhlaWdodCAvIDIpICsgYy5yb3dWYXIuZ3JvdXAuZ2Fwc1NpemUpICsgXCIpXCIpO1xyXG5cclxuICAgICAgICB2YXIgc2hhcGVzID0gY2VsbHMuc2VsZWN0T3JBcHBlbmQoY2VsbFNoYXBlICsgXCIuY2VsbC1zaGFwZS1cIiArIGNlbGxTaGFwZSk7XHJcblxyXG4gICAgICAgIHNoYXBlc1xyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHBsb3Quei5zaGFwZS53aWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgcGxvdC56LnNoYXBlLmhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIC1wbG90LmNlbGxXaWR0aCAvIDIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAtcGxvdC5jZWxsSGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICAgIHNoYXBlcy5zdHlsZShcImZpbGxcIiwgYz0+IGMudmFsdWUgPT09IHVuZGVmaW5lZCA/IHNlbGYuY29uZmlnLmNvbG9yLm5vRGF0YUNvbG9yIDogcGxvdC56LmNvbG9yLnNjYWxlKGMudmFsdWUpKTtcclxuICAgICAgICBzaGFwZXMuYXR0cihcImZpbGwtb3BhY2l0eVwiLCBkPT4gZC52YWx1ZSA9PT0gdW5kZWZpbmVkID8gMCA6IDEpO1xyXG5cclxuICAgICAgICB2YXIgbW91c2VvdmVyQ2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgdmFyIG1vdXNlb3V0Q2FsbGJhY2tzID0gW107XHJcblxyXG4gICAgICAgIGlmIChwbG90LnRvb2x0aXApIHtcclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3ZlckNhbGxiYWNrcy5wdXNoKGM9PiB7XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDIwMClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIC45KTtcclxuICAgICAgICAgICAgICAgIHZhciBodG1sID0gYy52YWx1ZSA9PT0gdW5kZWZpbmVkID8gc2VsZi5jb25maWcudG9vbHRpcC5ub0RhdGFUZXh0IDogc2VsZi5mb3JtYXRWYWx1ZVooYy52YWx1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLmh0bWwoaHRtbClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLnB1c2goYz0+IHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2VsZi5jb25maWcuaGlnaGxpZ2h0TGFiZWxzKSB7XHJcbiAgICAgICAgICAgIHZhciBoaWdobGlnaHRDbGFzcyA9IHNlbGYuY29uZmlnLmNzc0NsYXNzUHJlZml4ICsgXCJoaWdobGlnaHRcIjtcclxuICAgICAgICAgICAgdmFyIHhMYWJlbENsYXNzID0gYz0+cGxvdC5sYWJlbENsYXNzICsgXCIteC1cIiArIGMuY29sO1xyXG4gICAgICAgICAgICB2YXIgeUxhYmVsQ2xhc3MgPSBjPT5wbG90LmxhYmVsQ2xhc3MgKyBcIi15LVwiICsgYy5yb3c7XHJcblxyXG5cclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goYz0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHhMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgeUxhYmVsQ2xhc3MoYykpLmNsYXNzZWQoaGlnaGxpZ2h0Q2xhc3MsIHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MucHVzaChjPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB4TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB5TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBjZWxscy5vbihcIm1vdXNlb3ZlclwiLCBjID0+IHtcclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2s9PmNhbGxiYWNrKGMpKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCBjID0+IHtcclxuICAgICAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2s9PmNhbGxiYWNrKGMpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNlbGxzLm9uKFwiY2xpY2tcIiwgYz0+IHtcclxuICAgICAgICAgICAgc2VsZi50cmlnZ2VyKFwiY2VsbC1zZWxlY3RlZFwiLCBjKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIGNlbGxzLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3JtYXRWYWx1ZVgodmFsdWUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLnguZm9ybWF0dGVyKSByZXR1cm4gdmFsdWU7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy54LmZvcm1hdHRlci5jYWxsKHRoaXMuY29uZmlnLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9ybWF0VmFsdWVZKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy55LmZvcm1hdHRlcikgcmV0dXJuIHZhbHVlO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcueS5mb3JtYXR0ZXIuY2FsbCh0aGlzLmNvbmZpZywgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcm1hdFZhbHVlWih2YWx1ZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcuei5mb3JtYXR0ZXIpIHJldHVybiB2YWx1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnouZm9ybWF0dGVyLmNhbGwodGhpcy5jb25maWcsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3JtYXRMZWdlbmRWYWx1ZSh2YWx1ZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcubGVnZW5kLmZvcm1hdHRlcikgcmV0dXJuIHZhbHVlO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcubGVnZW5kLmZvcm1hdHRlci5jYWxsKHRoaXMuY29uZmlnLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTGVnZW5kKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgbGVnZW5kWCA9IHRoaXMucGxvdC53aWR0aCArIDEwO1xyXG4gICAgICAgIHZhciBnYXBTaXplID0gSGVhdG1hcC5jb21wdXRlR2FwU2l6ZSgwKTtcclxuICAgICAgICBpZiAodGhpcy5wbG90Lmdyb3VwQnlZKSB7XHJcbiAgICAgICAgICAgIGxlZ2VuZFggKz0gZ2FwU2l6ZSAvIDIgKyBwbG90Lnkub3ZlcmxhcC5yaWdodDtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucGxvdC5ncm91cEJ5WCkge1xyXG4gICAgICAgICAgICBsZWdlbmRYICs9IGdhcFNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsZWdlbmRZID0gMDtcclxuICAgICAgICBpZiAodGhpcy5wbG90Lmdyb3VwQnlYIHx8IHRoaXMucGxvdC5ncm91cEJ5WSkge1xyXG4gICAgICAgICAgICBsZWdlbmRZICs9IGdhcFNpemUgLyAyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGJhcldpZHRoID0gMTA7XHJcbiAgICAgICAgdmFyIGJhckhlaWdodCA9IHRoaXMucGxvdC5oZWlnaHQgLSAyO1xyXG4gICAgICAgIHZhciBzY2FsZSA9IHBsb3Quei5jb2xvci5zY2FsZTtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmQgPSBuZXcgTGVnZW5kKHRoaXMuc3ZnLCB0aGlzLnN2Z0csIHNjYWxlLCBsZWdlbmRYLCBsZWdlbmRZLCB2ID0+IHNlbGYuZm9ybWF0TGVnZW5kVmFsdWUodikpLnNldFJvdGF0ZUxhYmVscyhzZWxmLmNvbmZpZy5sZWdlbmQucm90YXRlTGFiZWxzKS5saW5lYXJHcmFkaWVudEJhcihiYXJXaWR0aCwgYmFySGVpZ2h0KTtcclxuICAgIH1cclxuXHJcblxyXG59XHJcbiIsImltcG9ydCB7RDNFeHRlbnNpb25zfSBmcm9tICcuL2QzLWV4dGVuc2lvbnMnXHJcbkQzRXh0ZW5zaW9ucy5leHRlbmQoKTtcclxuXHJcbmV4cG9ydCB7U2NhdHRlclBsb3QsIFNjYXR0ZXJQbG90Q29uZmlnfSBmcm9tIFwiLi9zY2F0dGVycGxvdFwiO1xyXG5leHBvcnQge1NjYXR0ZXJQbG90TWF0cml4LCBTY2F0dGVyUGxvdE1hdHJpeENvbmZpZ30gZnJvbSBcIi4vc2NhdHRlcnBsb3QtbWF0cml4XCI7XHJcbmV4cG9ydCB7Q29ycmVsYXRpb25NYXRyaXgsIENvcnJlbGF0aW9uTWF0cml4Q29uZmlnfSBmcm9tICcuL2NvcnJlbGF0aW9uLW1hdHJpeCdcclxuZXhwb3J0IHtSZWdyZXNzaW9uLCBSZWdyZXNzaW9uQ29uZmlnfSBmcm9tICcuL3JlZ3Jlc3Npb24nXHJcbmV4cG9ydCB7SGVhdG1hcCwgSGVhdG1hcENvbmZpZ30gZnJvbSAnLi9oZWF0bWFwJ1xyXG5leHBvcnQge0hlYXRtYXBUaW1lU2VyaWVzLCBIZWF0bWFwVGltZVNlcmllc0NvbmZpZ30gZnJvbSAnLi9oZWF0bWFwLXRpbWVzZXJpZXMnXHJcbmV4cG9ydCB7U3RhdGlzdGljc1V0aWxzfSBmcm9tICcuL3N0YXRpc3RpY3MtdXRpbHMnXHJcbmV4cG9ydCB7TGVnZW5kfSBmcm9tICcuL2xlZ2VuZCdcclxuXHJcblxyXG5cclxuXHJcblxyXG4iLCJpbXBvcnQge1V0aWxzfSBmcm9tIFwiLi91dGlsc1wiO1xyXG5pbXBvcnQge2NvbG9yLCBzaXplLCBzeW1ib2x9IGZyb20gXCIuLi9ib3dlcl9jb21wb25lbnRzL2QzLWxlZ2VuZC9uby1leHRlbmRcIjtcclxuXHJcbi8qdmFyIGQzID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9kMycpO1xyXG4qL1xyXG4vLyB2YXIgbGVnZW5kID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9kMy1sZWdlbmQvbm8tZXh0ZW5kJyk7XHJcbi8vXHJcbi8vIG1vZHVsZS5leHBvcnRzLmxlZ2VuZCA9IGxlZ2VuZDtcclxuXHJcbmV4cG9ydCBjbGFzcyBMZWdlbmQge1xyXG5cclxuICAgIGNzc0NsYXNzUHJlZml4PVwib2RjLVwiO1xyXG4gICAgbGVnZW5kQ2xhc3M9dGhpcy5jc3NDbGFzc1ByZWZpeCtcImxlZ2VuZFwiO1xyXG4gICAgY29udGFpbmVyO1xyXG4gICAgc2NhbGU7XHJcbiAgICBjb2xvcj0gY29sb3I7XHJcbiAgICBzaXplID0gc2l6ZTtcclxuICAgIHN5bWJvbD0gc3ltYm9sO1xyXG4gICAgZ3VpZDtcclxuXHJcbiAgICBsYWJlbEZvcm1hdCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzdmcsIGxlZ2VuZFBhcmVudCwgc2NhbGUsIGxlZ2VuZFgsIGxlZ2VuZFksIGxhYmVsRm9ybWF0KXtcclxuICAgICAgICB0aGlzLnNjYWxlPXNjYWxlO1xyXG4gICAgICAgIHRoaXMuc3ZnID0gc3ZnO1xyXG4gICAgICAgIHRoaXMuZ3VpZCA9IFV0aWxzLmd1aWQoKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9ICBVdGlscy5zZWxlY3RPckFwcGVuZChsZWdlbmRQYXJlbnQsIFwiZy5cIit0aGlzLmxlZ2VuZENsYXNzLCBcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrbGVnZW5kWCtcIixcIitsZWdlbmRZK1wiKVwiKVxyXG4gICAgICAgICAgICAuY2xhc3NlZCh0aGlzLmxlZ2VuZENsYXNzLCB0cnVlKTtcclxuXHJcbiAgICAgICAgdGhpcy5sYWJlbEZvcm1hdCA9IGxhYmVsRm9ybWF0O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgbGluZWFyR3JhZGllbnRCYXIoYmFyV2lkdGgsIGJhckhlaWdodCwgdGl0bGUpe1xyXG4gICAgICAgIHZhciBncmFkaWVudElkID0gdGhpcy5jc3NDbGFzc1ByZWZpeCtcImxpbmVhci1ncmFkaWVudFwiK1wiLVwiK3RoaXMuZ3VpZDtcclxuICAgICAgICB2YXIgc2NhbGU9IHRoaXMuc2NhbGU7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmxpbmVhckdyYWRpZW50ID0gVXRpbHMubGluZWFyR3JhZGllbnQodGhpcy5zdmcsIGdyYWRpZW50SWQsIHRoaXMuc2NhbGUucmFuZ2UoKSwgMCwgMTAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kKFwicmVjdFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGJhcldpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBiYXJIZWlnaHQpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgMClcclxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcInVybCgjXCIrZ3JhZGllbnRJZCtcIilcIik7XHJcblxyXG5cclxuICAgICAgICB2YXIgdGlja3MgPSB0aGlzLmNvbnRhaW5lci5zZWxlY3RBbGwoXCJ0ZXh0XCIpXHJcbiAgICAgICAgICAgIC5kYXRhKCBzY2FsZS5kb21haW4oKSApO1xyXG4gICAgICAgIHZhciB0aWNrc051bWJlciA9c2NhbGUuZG9tYWluKCkubGVuZ3RoLTE7XHJcbiAgICAgICAgdGlja3MuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpO1xyXG5cclxuICAgICAgICB0aWNrcy5hdHRyKFwieFwiLCBiYXJXaWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsICAoZCwgaSkgPT4gIGJhckhlaWdodCAtKGkqYmFySGVpZ2h0L3RpY2tzTnVtYmVyKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJkeFwiLCAzKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcImR5XCIsIDEpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiYWxpZ25tZW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGQ9PiBzZWxmLmxhYmVsRm9ybWF0ID8gc2VsZi5sYWJlbEZvcm1hdChkKSA6IGQpO1xyXG4gICAgICAgIHRpY2tzLmF0dHIoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgIGlmKHRoaXMucm90YXRlTGFiZWxzKXtcclxuICAgICAgICAgICAgdGlja3NcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIChkLCBpKSA9PiBcInJvdGF0ZSgtNDUsIFwiICsgYmFyV2lkdGggKyBcIiwgXCIgKyAoYmFySGVpZ2h0IC0oaSpiYXJIZWlnaHQvdGlja3NOdW1iZXIpKSArIFwiKVwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcInN0YXJ0XCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImR4XCIsIDUpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImR5XCIsIDUpO1xyXG5cclxuICAgICAgICB9ZWxzZXtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aWNrcy5leGl0KCkucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFJvdGF0ZUxhYmVscyhyb3RhdGVMYWJlbHMpIHtcclxuICAgICAgICB0aGlzLnJvdGF0ZUxhYmVscyA9IHJvdGF0ZUxhYmVscztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufSIsImltcG9ydCB7Q2hhcnQsIENoYXJ0Q29uZmlnfSBmcm9tIFwiLi9jaGFydFwiO1xyXG5pbXBvcnQge1NjYXR0ZXJQbG90LCBTY2F0dGVyUGxvdENvbmZpZ30gZnJvbSBcIi4vc2NhdHRlcnBsb3RcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IHtTdGF0aXN0aWNzVXRpbHN9IGZyb20gJy4vc3RhdGlzdGljcy11dGlscydcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgUmVncmVzc2lvbkNvbmZpZyBleHRlbmRzIFNjYXR0ZXJQbG90Q29uZmlne1xyXG5cclxuICAgIG1haW5SZWdyZXNzaW9uID0gdHJ1ZTtcclxuICAgIGdyb3VwUmVncmVzc2lvbiA9IHRydWU7XHJcbiAgICBjb25maWRlbmNlPXtcclxuICAgICAgICBsZXZlbDogMC45NSxcclxuICAgICAgICBjcml0aWNhbFZhbHVlOiAoZGVncmVlc09mRnJlZWRvbSwgY3JpdGljYWxQcm9iYWJpbGl0eSkgPT4gU3RhdGlzdGljc1V0aWxzLnRWYWx1ZShkZWdyZWVzT2ZGcmVlZG9tLCBjcml0aWNhbFByb2JhYmlsaXR5KSxcclxuICAgICAgICBtYXJnaW5PZkVycm9yOiB1bmRlZmluZWQgLy9jdXN0b20gIG1hcmdpbiBPZiBFcnJvciBmdW5jdGlvbiAoeCwgcG9pbnRzKVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIGlmKGN1c3RvbSl7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUmVncmVzc2lvbiBleHRlbmRzIFNjYXR0ZXJQbG90e1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IFJlZ3Jlc3Npb25Db25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZyl7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgUmVncmVzc2lvbkNvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpe1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcbiAgICAgICAgdGhpcy5pbml0UmVncmVzc2lvbkxpbmVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFJlZ3Jlc3Npb25MaW5lcygpe1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGdyb3Vwc0F2YWlsYWJsZSA9IHNlbGYuY29uZmlnLmdyb3VwcyAmJiBzZWxmLmNvbmZpZy5ncm91cHMudmFsdWU7XHJcblxyXG4gICAgICAgIHNlbGYucGxvdC5yZWdyZXNzaW9ucz0gW107XHJcblxyXG5cclxuICAgICAgICBpZihncm91cHNBdmFpbGFibGUgJiYgc2VsZi5jb25maWcubWFpblJlZ3Jlc3Npb24pe1xyXG4gICAgICAgICAgICB2YXIgcmVncmVzc2lvbiA9IHRoaXMuaW5pdFJlZ3Jlc3Npb24odGhpcy5kYXRhLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIHNlbGYucGxvdC5yZWdyZXNzaW9ucy5wdXNoKHJlZ3Jlc3Npb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoc2VsZi5jb25maWcuZ3JvdXBSZWdyZXNzaW9uKXtcclxuICAgICAgICAgICAgdGhpcy5pbml0R3JvdXBSZWdyZXNzaW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBpbml0R3JvdXBSZWdyZXNzaW9uKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgZGF0YUJ5R3JvdXAgPSB7fTtcclxuICAgICAgICBzZWxmLmRhdGEuZm9yRWFjaCAoZD0+e1xyXG4gICAgICAgICAgICB2YXIgZ3JvdXBWYWwgPSBzZWxmLmNvbmZpZy5ncm91cHMudmFsdWUoZCwgc2VsZi5jb25maWcuZ3JvdXBzLmtleSk7XHJcblxyXG4gICAgICAgICAgICBpZighZ3JvdXBWYWwgJiYgZ3JvdXBWYWwhPT0wKXtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoIWRhdGFCeUdyb3VwW2dyb3VwVmFsXSl7XHJcbiAgICAgICAgICAgICAgICBkYXRhQnlHcm91cFtncm91cFZhbF0gPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkYXRhQnlHcm91cFtncm91cFZhbF0ucHVzaChkKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gZGF0YUJ5R3JvdXApe1xyXG4gICAgICAgICAgICBpZiAoIWRhdGFCeUdyb3VwLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVncmVzc2lvbiA9IHRoaXMuaW5pdFJlZ3Jlc3Npb24oZGF0YUJ5R3JvdXBba2V5XSwga2V5KTtcclxuICAgICAgICAgICAgc2VsZi5wbG90LnJlZ3Jlc3Npb25zLnB1c2gocmVncmVzc2lvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXRSZWdyZXNzaW9uKHZhbHVlcywgZ3JvdXBWYWwpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIHBvaW50cyA9IHZhbHVlcy5tYXAoZD0+e1xyXG4gICAgICAgICAgICByZXR1cm4gW3BhcnNlRmxvYXQoc2VsZi5wbG90LngudmFsdWUoZCkpLCBwYXJzZUZsb2F0KHNlbGYucGxvdC55LnZhbHVlKGQpKV07XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHBvaW50cy5zb3J0KChhLGIpID0+IGFbMF0tYlswXSk7XHJcblxyXG4gICAgICAgIHZhciBsaW5lYXJSZWdyZXNzaW9uID0gIFN0YXRpc3RpY3NVdGlscy5saW5lYXJSZWdyZXNzaW9uKHBvaW50cyk7XHJcbiAgICAgICAgdmFyIGxpbmVhclJlZ3Jlc3Npb25MaW5lID0gU3RhdGlzdGljc1V0aWxzLmxpbmVhclJlZ3Jlc3Npb25MaW5lKGxpbmVhclJlZ3Jlc3Npb24pO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGV4dGVudFggPSBkMy5leHRlbnQocG9pbnRzLCBkPT5kWzBdKTtcclxuXHJcblxyXG4gICAgICAgIHZhciBsaW5lUG9pbnRzID0gW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB4OiBleHRlbnRYWzBdLFxyXG4gICAgICAgICAgICAgICAgeTogbGluZWFyUmVncmVzc2lvbkxpbmUoZXh0ZW50WFswXSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeDogZXh0ZW50WFsxXSxcclxuICAgICAgICAgICAgICAgIHk6IGxpbmVhclJlZ3Jlc3Npb25MaW5lKGV4dGVudFhbMV0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICB2YXIgbGluZSA9IGQzLnN2Zy5saW5lKClcclxuICAgICAgICAgICAgLmludGVycG9sYXRlKFwiYmFzaXNcIilcclxuICAgICAgICAgICAgLngoZCA9PiBzZWxmLnBsb3QueC5zY2FsZShkLngpKVxyXG4gICAgICAgICAgICAueShkID0+IHNlbGYucGxvdC55LnNjYWxlKGQueSkpO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICB2YXIgY29sb3IgPSBzZWxmLnBsb3QuZG90LmNvbG9yO1xyXG5cclxuICAgICAgICB2YXIgZGVmYXVsdENvbG9yID0gXCJibGFja1wiO1xyXG4gICAgICAgIGlmKFV0aWxzLmlzRnVuY3Rpb24oY29sb3IpKXtcclxuICAgICAgICAgICAgaWYodmFsdWVzLmxlbmd0aCAmJiBncm91cFZhbCE9PWZhbHNlKXtcclxuICAgICAgICAgICAgICAgIGNvbG9yID0gY29sb3IodmFsdWVzWzBdKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBjb2xvciA9IGRlZmF1bHRDb2xvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1lbHNlIGlmKCFjb2xvciAmJiBncm91cFZhbD09PWZhbHNlKXtcclxuICAgICAgICAgICAgY29sb3IgPSBkZWZhdWx0Q29sb3I7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdmFyIGNvbmZpZGVuY2UgPSB0aGlzLmNvbXB1dGVDb25maWRlbmNlKHBvaW50cywgZXh0ZW50WCwgIGxpbmVhclJlZ3Jlc3Npb24sbGluZWFyUmVncmVzc2lvbkxpbmUpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGdyb3VwOiBncm91cFZhbCB8fCBmYWxzZSxcclxuICAgICAgICAgICAgbGluZTogbGluZSxcclxuICAgICAgICAgICAgbGluZVBvaW50czogbGluZVBvaW50cyxcclxuICAgICAgICAgICAgY29sb3I6IGNvbG9yLFxyXG4gICAgICAgICAgICBjb25maWRlbmNlOiBjb25maWRlbmNlXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wdXRlQ29uZmlkZW5jZShwb2ludHMsIGV4dGVudFgsIGxpbmVhclJlZ3Jlc3Npb24sbGluZWFyUmVncmVzc2lvbkxpbmUpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgc2xvcGUgPSBsaW5lYXJSZWdyZXNzaW9uLm07XHJcbiAgICAgICAgdmFyIG4gPSBwb2ludHMubGVuZ3RoO1xyXG4gICAgICAgIHZhciBkZWdyZWVzT2ZGcmVlZG9tID0gTWF0aC5tYXgoMCwgbi0yKTtcclxuXHJcbiAgICAgICAgdmFyIGFscGhhID0gMSAtIHNlbGYuY29uZmlnLmNvbmZpZGVuY2UubGV2ZWw7XHJcbiAgICAgICAgdmFyIGNyaXRpY2FsUHJvYmFiaWxpdHkgID0gMSAtIGFscGhhLzI7XHJcbiAgICAgICAgdmFyIGNyaXRpY2FsVmFsdWUgPSBzZWxmLmNvbmZpZy5jb25maWRlbmNlLmNyaXRpY2FsVmFsdWUoZGVncmVlc09mRnJlZWRvbSxjcml0aWNhbFByb2JhYmlsaXR5KTtcclxuXHJcbiAgICAgICAgdmFyIHhWYWx1ZXMgPSBwb2ludHMubWFwKGQ9PmRbMF0pO1xyXG4gICAgICAgIHZhciBtZWFuWCA9IFN0YXRpc3RpY3NVdGlscy5tZWFuKHhWYWx1ZXMpO1xyXG4gICAgICAgIHZhciB4TXlTdW09MDtcclxuICAgICAgICB2YXIgeFN1bT0wO1xyXG4gICAgICAgIHZhciB4UG93U3VtPTA7XHJcbiAgICAgICAgdmFyIHlTdW09MDtcclxuICAgICAgICB2YXIgeVBvd1N1bT0wO1xyXG4gICAgICAgIHBvaW50cy5mb3JFYWNoKHA9PntcclxuICAgICAgICAgICAgdmFyIHggPSBwWzBdO1xyXG4gICAgICAgICAgICB2YXIgeSA9IHBbMV07XHJcblxyXG4gICAgICAgICAgICB4TXlTdW0gKz0geCp5O1xyXG4gICAgICAgICAgICB4U3VtKz14O1xyXG4gICAgICAgICAgICB5U3VtKz15O1xyXG4gICAgICAgICAgICB4UG93U3VtKz0geCp4O1xyXG4gICAgICAgICAgICB5UG93U3VtKz0geSp5O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBhID0gbGluZWFyUmVncmVzc2lvbi5tO1xyXG4gICAgICAgIHZhciBiID0gbGluZWFyUmVncmVzc2lvbi5iO1xyXG5cclxuICAgICAgICB2YXIgU2EyID0gbi8obisyKSAqICgoeVBvd1N1bS1hKnhNeVN1bS1iKnlTdW0pLyhuKnhQb3dTdW0tKHhTdW0qeFN1bSkpKTsgLy9XYXJpYW5jamEgd3Nww7PFgmN6eW5uaWthIGtpZXJ1bmtvd2VnbyByZWdyZXNqaSBsaW5pb3dlaiBhXHJcbiAgICAgICAgdmFyIFN5MiA9ICh5UG93U3VtIC0gYSp4TXlTdW0tYip5U3VtKS8obioobi0yKSk7IC8vU2EyIC8vTWVhbiB5IHZhbHVlIHZhcmlhbmNlXHJcblxyXG4gICAgICAgIHZhciBlcnJvckZuID0geD0+IE1hdGguc3FydChTeTIgKyBNYXRoLnBvdyh4LW1lYW5YLDIpKlNhMik7IC8vcGllcndpYXN0ZWsga3dhZHJhdG93eSB6IHdhcmlhbmNqaSBkb3dvbG5lZ28gcHVua3R1IHByb3N0ZWpcclxuICAgICAgICB2YXIgbWFyZ2luT2ZFcnJvciA9ICB4PT4gY3JpdGljYWxWYWx1ZSogZXJyb3JGbih4KTtcclxuXHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCduJywgbiwgJ2RlZ3JlZXNPZkZyZWVkb20nLCBkZWdyZWVzT2ZGcmVlZG9tLCAnY3JpdGljYWxQcm9iYWJpbGl0eScsY3JpdGljYWxQcm9iYWJpbGl0eSk7XHJcbiAgICAgICAgLy8gdmFyIGNvbmZpZGVuY2VEb3duID0geCA9PiBsaW5lYXJSZWdyZXNzaW9uTGluZSh4KSAtICBtYXJnaW5PZkVycm9yKHgpO1xyXG4gICAgICAgIC8vIHZhciBjb25maWRlbmNlVXAgPSB4ID0+IGxpbmVhclJlZ3Jlc3Npb25MaW5lKHgpICsgIG1hcmdpbk9mRXJyb3IoeCk7XHJcblxyXG5cclxuICAgICAgICB2YXIgY29tcHV0ZUNvbmZpZGVuY2VBcmVhUG9pbnQgPSB4PT57XHJcbiAgICAgICAgICAgIHZhciBsaW5lYXJSZWdyZXNzaW9uID0gbGluZWFyUmVncmVzc2lvbkxpbmUoeCk7XHJcbiAgICAgICAgICAgIHZhciBtb2UgPSBtYXJnaW5PZkVycm9yKHgpO1xyXG4gICAgICAgICAgICB2YXIgY29uZkRvd24gPSBsaW5lYXJSZWdyZXNzaW9uIC0gbW9lO1xyXG4gICAgICAgICAgICB2YXIgY29uZlVwID0gbGluZWFyUmVncmVzc2lvbiArIG1vZTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHg6IHgsXHJcbiAgICAgICAgICAgICAgICB5MDogY29uZkRvd24sXHJcbiAgICAgICAgICAgICAgICB5MTogY29uZlVwXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGNlbnRlclggPSAoZXh0ZW50WFsxXStleHRlbnRYWzBdKS8yO1xyXG5cclxuICAgICAgICAvLyB2YXIgY29uZmlkZW5jZUFyZWFQb2ludHMgPSBbZXh0ZW50WFswXSwgY2VudGVyWCwgIGV4dGVudFhbMV1dLm1hcChjb21wdXRlQ29uZmlkZW5jZUFyZWFQb2ludCk7XHJcbiAgICAgICAgdmFyIGNvbmZpZGVuY2VBcmVhUG9pbnRzID0gW2V4dGVudFhbMF0sIGNlbnRlclgsICBleHRlbnRYWzFdXS5tYXAoY29tcHV0ZUNvbmZpZGVuY2VBcmVhUG9pbnQpO1xyXG5cclxuICAgICAgICB2YXIgZml0SW5QbG90ID0geSA9PiB5O1xyXG5cclxuICAgICAgICB2YXIgY29uZmlkZW5jZUFyZWEgPSAgZDMuc3ZnLmFyZWEoKVxyXG4gICAgICAgIC5pbnRlcnBvbGF0ZShcIm1vbm90b25lXCIpXHJcbiAgICAgICAgICAgIC54KGQgPT4gc2VsZi5wbG90Lnguc2NhbGUoZC54KSlcclxuICAgICAgICAgICAgLnkwKGQgPT4gZml0SW5QbG90KHNlbGYucGxvdC55LnNjYWxlKGQueTApKSlcclxuICAgICAgICAgICAgLnkxKGQgPT4gZml0SW5QbG90KHNlbGYucGxvdC55LnNjYWxlKGQueTEpKSk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGFyZWE6Y29uZmlkZW5jZUFyZWEsXHJcbiAgICAgICAgICAgIHBvaW50czpjb25maWRlbmNlQXJlYVBvaW50c1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKG5ld0RhdGEpe1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJlZ3Jlc3Npb25MaW5lcygpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlUmVncmVzc2lvbkxpbmVzKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcmVncmVzc2lvbkNvbnRhaW5lckNsYXNzID0gdGhpcy5wcmVmaXhDbGFzcyhcInJlZ3Jlc3Npb24tY29udGFpbmVyXCIpO1xyXG4gICAgICAgIHZhciByZWdyZXNzaW9uQ29udGFpbmVyU2VsZWN0b3IgPSBcImcuXCIrcmVncmVzc2lvbkNvbnRhaW5lckNsYXNzO1xyXG5cclxuICAgICAgICB2YXIgY2xpcFBhdGhJZCA9IHNlbGYucHJlZml4Q2xhc3MoXCJjbGlwXCIpO1xyXG5cclxuICAgICAgICB2YXIgcmVncmVzc2lvbkNvbnRhaW5lciA9IHNlbGYuc3ZnRy5zZWxlY3RPckluc2VydChyZWdyZXNzaW9uQ29udGFpbmVyU2VsZWN0b3IsIFwiLlwiK3NlbGYuZG90c0NvbnRhaW5lckNsYXNzKTtcclxuICAgICAgICB2YXIgcmVncmVzc2lvbkNvbnRhaW5lckNsaXAgPSByZWdyZXNzaW9uQ29udGFpbmVyLnNlbGVjdE9yQXBwZW5kKFwiY2xpcFBhdGhcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBjbGlwUGF0aElkKTtcclxuXHJcblxyXG4gICAgICAgIHJlZ3Jlc3Npb25Db250YWluZXJDbGlwLnNlbGVjdE9yQXBwZW5kKCdyZWN0JylcclxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgc2VsZi5wbG90LndpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0Jywgc2VsZi5wbG90LmhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAwKVxyXG4gICAgICAgICAgICAuYXR0cigneScsIDApO1xyXG5cclxuICAgICAgICByZWdyZXNzaW9uQ29udGFpbmVyLmF0dHIoXCJjbGlwLXBhdGhcIiwgKGQsaSkgPT4gXCJ1cmwoI1wiK2NsaXBQYXRoSWQrXCIpXCIpO1xyXG5cclxuICAgICAgICB2YXIgcmVncmVzc2lvbkNsYXNzID0gdGhpcy5wcmVmaXhDbGFzcyhcInJlZ3Jlc3Npb25cIik7XHJcbiAgICAgICAgdmFyIGNvbmZpZGVuY2VBcmVhQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwiY29uZmlkZW5jZVwiKTtcclxuICAgICAgICB2YXIgcmVncmVzc2lvblNlbGVjdG9yID0gXCJnLlwiK3JlZ3Jlc3Npb25DbGFzcztcclxuICAgICAgICB2YXIgcmVncmVzc2lvbiA9IHJlZ3Jlc3Npb25Db250YWluZXIuc2VsZWN0QWxsKHJlZ3Jlc3Npb25TZWxlY3RvcilcclxuICAgICAgICAgICAgLmRhdGEoc2VsZi5wbG90LnJlZ3Jlc3Npb25zKTtcclxuXHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb25FbnRlckcgPSByZWdyZXNzaW9uLmVudGVyKCkuaW5zZXJ0U2VsZWN0b3IocmVncmVzc2lvblNlbGVjdG9yKTtcclxuICAgICAgICB2YXIgbGluZUNsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImxpbmVcIik7XHJcbiAgICAgICAgcmVncmVzc2lvbkVudGVyR1xyXG5cclxuICAgICAgICAgICAgLmFwcGVuZChcInBhdGhcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBsaW5lQ2xhc3MpXHJcbiAgICAgICAgICAgIC5hdHRyKFwic2hhcGUtcmVuZGVyaW5nXCIsIFwib3B0aW1pemVRdWFsaXR5XCIpO1xyXG4gICAgICAgICAgICAvLyAuYXBwZW5kKFwibGluZVwiKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcImNsYXNzXCIsIFwibGluZVwiKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcInNoYXBlLXJlbmRlcmluZ1wiLCBcIm9wdGltaXplUXVhbGl0eVwiKTtcclxuXHJcbiAgICAgICAgdmFyIGxpbmUgPSByZWdyZXNzaW9uLnNlbGVjdChcInBhdGguXCIrbGluZUNsYXNzKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgciA9PiByLmNvbG9yKTtcclxuICAgICAgICAvLyAuYXR0cihcIngxXCIsIHI9PiBzZWxmLnBsb3QueC5zY2FsZShyLmxpbmVQb2ludHNbMF0ueCkpXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwieTFcIiwgcj0+IHNlbGYucGxvdC55LnNjYWxlKHIubGluZVBvaW50c1swXS55KSlcclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJ4MlwiLCByPT4gc2VsZi5wbG90Lnguc2NhbGUoci5saW5lUG9pbnRzWzFdLngpKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcInkyXCIsIHI9PiBzZWxmLnBsb3QueS5zY2FsZShyLmxpbmVQb2ludHNbMV0ueSkpXHJcblxyXG5cclxuICAgICAgICB2YXIgbGluZVQgPSBsaW5lO1xyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy50cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGxpbmVUID0gbGluZS50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsaW5lVC5hdHRyKFwiZFwiLCByID0+IHIubGluZShyLmxpbmVQb2ludHMpKVxyXG5cclxuXHJcbiAgICAgICAgcmVncmVzc2lvbkVudGVyR1xyXG4gICAgICAgICAgICAuYXBwZW5kKFwicGF0aFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGNvbmZpZGVuY2VBcmVhQ2xhc3MpXHJcbiAgICAgICAgICAgIC5hdHRyKFwic2hhcGUtcmVuZGVyaW5nXCIsIFwib3B0aW1pemVRdWFsaXR5XCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgciA9PiByLmNvbG9yKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIFwiMC40XCIpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHZhciBhcmVhID0gcmVncmVzc2lvbi5zZWxlY3QoXCJwYXRoLlwiK2NvbmZpZGVuY2VBcmVhQ2xhc3MpO1xyXG5cclxuICAgICAgICB2YXIgYXJlYVQgPSBhcmVhO1xyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy50cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGFyZWFUID0gYXJlYS50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFyZWFULmF0dHIoXCJkXCIsIHIgPT4gci5jb25maWRlbmNlLmFyZWEoci5jb25maWRlbmNlLnBvaW50cykpO1xyXG5cclxuICAgICAgICByZWdyZXNzaW9uLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn1cclxuXHJcbiIsImltcG9ydCB7Q2hhcnQsIENoYXJ0Q29uZmlnfSBmcm9tIFwiLi9jaGFydFwiO1xyXG5pbXBvcnQge1NjYXR0ZXJQbG90Q29uZmlnfSBmcm9tIFwiLi9zY2F0dGVycGxvdFwiO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5pbXBvcnQge0xlZ2VuZH0gZnJvbSBcIi4vbGVnZW5kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2NhdHRlclBsb3RNYXRyaXhDb25maWcgZXh0ZW5kcyBTY2F0dGVyUGxvdENvbmZpZ3tcclxuXHJcbiAgICBzdmdDbGFzcz0gdGhpcy5jc3NDbGFzc1ByZWZpeCsnc2NhdHRlcnBsb3QtbWF0cml4JztcclxuICAgIHNpemU9IDIwMDsgLy9zY2F0dGVyIHBsb3QgY2VsbCBzaXplXHJcbiAgICBwYWRkaW5nPSAyMDsgLy9zY2F0dGVyIHBsb3QgY2VsbCBwYWRkaW5nXHJcbiAgICBicnVzaD0gdHJ1ZTtcclxuICAgIGd1aWRlcz0gdHJ1ZTsgLy9zaG93IGF4aXMgZ3VpZGVzXHJcbiAgICBzaG93VG9vbHRpcD0gdHJ1ZTsgLy9zaG93IHRvb2x0aXAgb24gZG90IGhvdmVyXHJcbiAgICB0aWNrcz0gdW5kZWZpbmVkOyAvL3RpY2tzIG51bWJlciwgKGRlZmF1bHQ6IGNvbXB1dGVkIHVzaW5nIGNlbGwgc2l6ZSlcclxuICAgIHg9ey8vIFggYXhpcyBjb25maWdcclxuICAgICAgICBvcmllbnQ6IFwiYm90dG9tXCIsXHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCJcclxuICAgIH07XHJcbiAgICB5PXsvLyBZIGF4aXMgY29uZmlnXHJcbiAgICAgICAgb3JpZW50OiBcImxlZnRcIixcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIlxyXG4gICAgfTtcclxuICAgIGdyb3Vwcz17XHJcbiAgICAgICAga2V5OiB1bmRlZmluZWQsIC8vb2JqZWN0IHByb3BlcnR5IG5hbWUgb3IgYXJyYXkgaW5kZXggd2l0aCBncm91cGluZyB2YXJpYWJsZVxyXG4gICAgICAgIGluY2x1ZGVJblBsb3Q6IGZhbHNlLCAvL2luY2x1ZGUgZ3JvdXAgYXMgdmFyaWFibGUgaW4gcGxvdCwgYm9vbGVhbiAoZGVmYXVsdDogZmFsc2UpXHJcbiAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IGRba2V5XSwgLy8gZ3JvdXBpbmcgdmFsdWUgYWNjZXNzb3IsXHJcbiAgICAgICAgbGFiZWw6IFwiXCJcclxuICAgIH07XHJcbiAgICB2YXJpYWJsZXM9IHtcclxuICAgICAgICBsYWJlbHM6IFtdLCAvL29wdGlvbmFsIGFycmF5IG9mIHZhcmlhYmxlIGxhYmVscyAoZm9yIHRoZSBkaWFnb25hbCBvZiB0aGUgcGxvdCkuXHJcbiAgICAgICAga2V5czogW10sIC8vb3B0aW9uYWwgYXJyYXkgb2YgdmFyaWFibGUga2V5c1xyXG4gICAgICAgIHZhbHVlOiAoZCwgdmFyaWFibGVLZXkpID0+IGRbdmFyaWFibGVLZXldIC8vIHZhcmlhYmxlIHZhbHVlIGFjY2Vzc29yXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNjYXR0ZXJQbG90TWF0cml4IGV4dGVuZHMgQ2hhcnQge1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IFNjYXR0ZXJQbG90TWF0cml4Q29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBTY2F0dGVyUGxvdE1hdHJpeENvbmZpZyhjb25maWcpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdFBsb3QoKTtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSB0aGlzLnBsb3QubWFyZ2luO1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcbiAgICAgICAgdGhpcy5wbG90Lng9e307XHJcbiAgICAgICAgdGhpcy5wbG90Lnk9e307XHJcbiAgICAgICAgdGhpcy5wbG90LmRvdD17XHJcbiAgICAgICAgICAgIGNvbG9yOiBudWxsLy9jb2xvciBzY2FsZSBtYXBwaW5nIGZ1bmN0aW9uXHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMucGxvdC5zaG93TGVnZW5kID0gY29uZi5zaG93TGVnZW5kO1xyXG4gICAgICAgIGlmKHRoaXMucGxvdC5zaG93TGVnZW5kKXtcclxuICAgICAgICAgICAgbWFyZ2luLnJpZ2h0ID0gY29uZi5tYXJnaW4ucmlnaHQgKyBjb25mLmxlZ2VuZC53aWR0aCtjb25mLmxlZ2VuZC5tYXJnaW4qMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBWYXJpYWJsZXMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnNpemUgPSBjb25mLnNpemU7XHJcblxyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSBjb25mLndpZHRoO1xyXG4gICAgICAgIHZhciBib3VuZGluZ0NsaWVudFJlY3QgPSB0aGlzLmdldEJhc2VDb250YWluZXJOb2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgaWYgKCF3aWR0aCkge1xyXG4gICAgICAgICAgICB2YXIgbWF4V2lkdGggPSBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodCArIHRoaXMucGxvdC52YXJpYWJsZXMubGVuZ3RoKnRoaXMucGxvdC5zaXplO1xyXG4gICAgICAgICAgICB3aWR0aCA9IE1hdGgubWluKGJvdW5kaW5nQ2xpZW50UmVjdC53aWR0aCwgbWF4V2lkdGgpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IHdpZHRoO1xyXG4gICAgICAgIGlmICghaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGhlaWdodCA9IGJvdW5kaW5nQ2xpZW50UmVjdC5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnBsb3Qud2lkdGggPSB3aWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0O1xyXG4gICAgICAgIHRoaXMucGxvdC5oZWlnaHQgPSBoZWlnaHQgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAgaWYoY29uZi50aWNrcz09PXVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIGNvbmYudGlja3MgPSB0aGlzLnBsb3Quc2l6ZSAvIDQwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cFgoKTtcclxuICAgICAgICB0aGlzLnNldHVwWSgpO1xyXG5cclxuICAgICAgICBpZiAoY29uZi5kb3QuZDNDb2xvckNhdGVnb3J5KSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5kb3QuY29sb3JDYXRlZ29yeSA9IGQzLnNjYWxlW2NvbmYuZG90LmQzQ29sb3JDYXRlZ29yeV0oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNvbG9yVmFsdWUgPSBjb25mLmRvdC5jb2xvcjtcclxuICAgICAgICBpZiAoY29sb3JWYWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yVmFsdWUgPSBjb2xvclZhbHVlO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb2xvclZhbHVlID09PSAnc3RyaW5nJyB8fCBjb2xvclZhbHVlIGluc3RhbmNlb2YgU3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yID0gY29sb3JWYWx1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnBsb3QuZG90LmNvbG9yQ2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5kb3QuY29sb3IgPSBkID0+IHNlbGYucGxvdC5kb3QuY29sb3JDYXRlZ29yeShzZWxmLnBsb3QuZG90LmNvbG9yVmFsdWUoZCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cFZhcmlhYmxlcygpIHtcclxuICAgICAgICB2YXIgdmFyaWFibGVzQ29uZiA9IHRoaXMuY29uZmlnLnZhcmlhYmxlcztcclxuXHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgcGxvdC5kb21haW5CeVZhcmlhYmxlID0ge307XHJcbiAgICAgICAgcGxvdC52YXJpYWJsZXMgPSB2YXJpYWJsZXNDb25mLmtleXM7XHJcbiAgICAgICAgaWYoIXBsb3QudmFyaWFibGVzIHx8ICFwbG90LnZhcmlhYmxlcy5sZW5ndGgpe1xyXG4gICAgICAgICAgICBwbG90LnZhcmlhYmxlcyA9IFV0aWxzLmluZmVyVmFyaWFibGVzKGRhdGEsIHRoaXMuY29uZmlnLmdyb3Vwcy5rZXksIHRoaXMuY29uZmlnLmluY2x1ZGVJblBsb3QpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcGxvdC5sYWJlbHMgPSBbXTtcclxuICAgICAgICBwbG90LmxhYmVsQnlWYXJpYWJsZSA9IHt9O1xyXG4gICAgICAgIHBsb3QudmFyaWFibGVzLmZvckVhY2goKHZhcmlhYmxlS2V5LCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBwbG90LmRvbWFpbkJ5VmFyaWFibGVbdmFyaWFibGVLZXldID0gZDMuZXh0ZW50KGRhdGEsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHZhcmlhYmxlc0NvbmYudmFsdWUoZCwgdmFyaWFibGVLZXkpIH0pO1xyXG4gICAgICAgICAgICB2YXIgbGFiZWwgPSB2YXJpYWJsZUtleTtcclxuICAgICAgICAgICAgaWYodmFyaWFibGVzQ29uZi5sYWJlbHMgJiYgdmFyaWFibGVzQ29uZi5sYWJlbHMubGVuZ3RoPmluZGV4KXtcclxuXHJcbiAgICAgICAgICAgICAgICBsYWJlbCA9IHZhcmlhYmxlc0NvbmYubGFiZWxzW2luZGV4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwbG90LmxhYmVscy5wdXNoKGxhYmVsKTtcclxuICAgICAgICAgICAgcGxvdC5sYWJlbEJ5VmFyaWFibGVbdmFyaWFibGVLZXldID0gbGFiZWw7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHBsb3QubGFiZWxCeVZhcmlhYmxlKTtcclxuXHJcbiAgICAgICAgcGxvdC5zdWJwbG90cyA9IFtdO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cFgoKSB7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB4ID0gcGxvdC54O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcblxyXG4gICAgICAgIHgudmFsdWUgPSBjb25mLnZhcmlhYmxlcy52YWx1ZTtcclxuICAgICAgICB4LnNjYWxlID0gZDMuc2NhbGVbY29uZi54LnNjYWxlXSgpLnJhbmdlKFtjb25mLnBhZGRpbmcgLyAyLCBwbG90LnNpemUgLSBjb25mLnBhZGRpbmcgLyAyXSk7XHJcbiAgICAgICAgeC5tYXAgPSAoZCwgdmFyaWFibGUpID0+IHguc2NhbGUoeC52YWx1ZShkLCB2YXJpYWJsZSkpO1xyXG4gICAgICAgIHguYXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeC5zY2FsZSkub3JpZW50KGNvbmYueC5vcmllbnQpLnRpY2tzKGNvbmYudGlja3MpO1xyXG4gICAgICAgIHguYXhpcy50aWNrU2l6ZShwbG90LnNpemUgKiBwbG90LnZhcmlhYmxlcy5sZW5ndGgpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBZKCkge1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeSA9IHBsb3QueTtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB5LnZhbHVlID0gY29uZi52YXJpYWJsZXMudmFsdWU7XHJcbiAgICAgICAgeS5zY2FsZSA9IGQzLnNjYWxlW2NvbmYueS5zY2FsZV0oKS5yYW5nZShbIHBsb3Quc2l6ZSAtIGNvbmYucGFkZGluZyAvIDIsIGNvbmYucGFkZGluZyAvIDJdKTtcclxuICAgICAgICB5Lm1hcCA9IChkLCB2YXJpYWJsZSkgPT4geS5zY2FsZSh5LnZhbHVlKGQsIHZhcmlhYmxlKSk7XHJcbiAgICAgICAgeS5heGlzPSBkMy5zdmcuYXhpcygpLnNjYWxlKHkuc2NhbGUpLm9yaWVudChjb25mLnkub3JpZW50KS50aWNrcyhjb25mLnRpY2tzKTtcclxuICAgICAgICB5LmF4aXMudGlja1NpemUoLXBsb3Quc2l6ZSAqIHBsb3QudmFyaWFibGVzLmxlbmd0aCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRyYXcoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPXRoaXM7XHJcbiAgICAgICAgdmFyIG4gPSBzZWxmLnBsb3QudmFyaWFibGVzLmxlbmd0aDtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB2YXIgYXhpc0NsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImF4aXNcIik7XHJcbiAgICAgICAgdmFyIGF4aXNYQ2xhc3MgPSBheGlzQ2xhc3MrXCIteFwiO1xyXG4gICAgICAgIHZhciBheGlzWUNsYXNzID0gYXhpc0NsYXNzK1wiLXlcIjtcclxuXHJcbiAgICAgICAgdmFyIHhBeGlzU2VsZWN0b3IgPSBcImcuXCIrYXhpc1hDbGFzcytcIi5cIitheGlzQ2xhc3M7XHJcbiAgICAgICAgdmFyIHlBeGlzU2VsZWN0b3IgPSBcImcuXCIrYXhpc1lDbGFzcytcIi5cIitheGlzQ2xhc3M7XHJcblxyXG4gICAgICAgIHZhciBub0d1aWRlc0NsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcIm5vLWd1aWRlc1wiKTtcclxuICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKHhBeGlzU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5kYXRhKHNlbGYucGxvdC52YXJpYWJsZXMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZFNlbGVjdG9yKHhBeGlzU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKG5vR3VpZGVzQ2xhc3MsICFjb25mLmd1aWRlcylcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwidHJhbnNsYXRlKFwiICsgKG4gLSBpIC0gMSkgKiBzZWxmLnBsb3Quc2l6ZSArIFwiLDApXCIpXHJcbiAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uKGQpIHsgc2VsZi5wbG90Lnguc2NhbGUuZG9tYWluKHNlbGYucGxvdC5kb21haW5CeVZhcmlhYmxlW2RdKTsgZDMuc2VsZWN0KHRoaXMpLmNhbGwoc2VsZi5wbG90LnguYXhpcyk7IH0pO1xyXG5cclxuICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKHlBeGlzU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5kYXRhKHNlbGYucGxvdC52YXJpYWJsZXMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZFNlbGVjdG9yKHlBeGlzU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKG5vR3VpZGVzQ2xhc3MsICFjb25mLmd1aWRlcylcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwidHJhbnNsYXRlKDAsXCIgKyBpICogc2VsZi5wbG90LnNpemUgKyBcIilcIilcclxuICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24oZCkgeyBzZWxmLnBsb3QueS5zY2FsZS5kb21haW4oc2VsZi5wbG90LmRvbWFpbkJ5VmFyaWFibGVbZF0pOyBkMy5zZWxlY3QodGhpcykuY2FsbChzZWxmLnBsb3QueS5heGlzKTsgfSk7XHJcblxyXG4gICAgICAgIHZhciBjZWxsQ2xhc3MgPSAgc2VsZi5wcmVmaXhDbGFzcyhcImNlbGxcIik7XHJcbiAgICAgICAgdmFyIGNlbGwgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwiLlwiK2NlbGxDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEoc2VsZi51dGlscy5jcm9zcyhzZWxmLnBsb3QudmFyaWFibGVzLCBzZWxmLnBsb3QudmFyaWFibGVzKSlcclxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kU2VsZWN0b3IoXCJnLlwiK2NlbGxDbGFzcylcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZCA9PiBcInRyYW5zbGF0ZShcIiArIChuIC0gZC5pIC0gMSkgKiBzZWxmLnBsb3Quc2l6ZSArIFwiLFwiICsgZC5qICogc2VsZi5wbG90LnNpemUgKyBcIilcIik7XHJcblxyXG4gICAgICAgIGlmKGNvbmYuYnJ1c2gpe1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdCcnVzaChjZWxsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNlbGwuZWFjaChwbG90U3VicGxvdCk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgLy9MYWJlbHNcclxuICAgICAgICBjZWxsLmZpbHRlcihkID0+IGQuaSA9PT0gZC5qKVxyXG4gICAgICAgICAgICAuYXBwZW5kKFwidGV4dFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgY29uZi5wYWRkaW5nKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgY29uZi5wYWRkaW5nKVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiLjcxZW1cIilcclxuICAgICAgICAgICAgLnRleHQoIGQgPT4gc2VsZi5wbG90LmxhYmVsQnlWYXJpYWJsZVtkLnhdKTtcclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcGxvdFN1YnBsb3QocCkge1xyXG4gICAgICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICAgICAgcGxvdC5zdWJwbG90cy5wdXNoKHApO1xyXG4gICAgICAgICAgICB2YXIgY2VsbCA9IGQzLnNlbGVjdCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIHBsb3QueC5zY2FsZS5kb21haW4ocGxvdC5kb21haW5CeVZhcmlhYmxlW3AueF0pO1xyXG4gICAgICAgICAgICBwbG90Lnkuc2NhbGUuZG9tYWluKHBsb3QuZG9tYWluQnlWYXJpYWJsZVtwLnldKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmcmFtZUNsYXNzID0gIHNlbGYucHJlZml4Q2xhc3MoXCJmcmFtZVwiKTtcclxuICAgICAgICAgICAgY2VsbC5hcHBlbmQoXCJyZWN0XCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGZyYW1lQ2xhc3MpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInhcIiwgY29uZi5wYWRkaW5nIC8gMilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieVwiLCBjb25mLnBhZGRpbmcgLyAyKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBjb25mLnNpemUgLSBjb25mLnBhZGRpbmcpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBjb25mLnNpemUgLSBjb25mLnBhZGRpbmcpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHAudXBkYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3VicGxvdCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZG90cyA9IGNlbGwuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmRhdGEoc2VsZi5kYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICBkb3RzLmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGRvdHMuYXR0cihcImN4XCIsIChkKSA9PiBwbG90LngubWFwKGQsIHN1YnBsb3QueCkpXHJcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCAoZCkgPT4gcGxvdC55Lm1hcChkLCBzdWJwbG90LnkpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiclwiLCBzZWxmLmNvbmZpZy5kb3QucmFkaXVzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocGxvdC5kb3QuY29sb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb3RzLnN0eWxlKFwiZmlsbFwiLCBwbG90LmRvdC5jb2xvcilcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZihwbG90LnRvb2x0aXApe1xyXG4gICAgICAgICAgICAgICAgICAgIGRvdHMub24oXCJtb3VzZW92ZXJcIiwgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDIwMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IFwiKFwiICsgcGxvdC54LnZhbHVlKGQsIHN1YnBsb3QueCkgKyBcIiwgXCIgK3Bsb3QueS52YWx1ZShkLCBzdWJwbG90LnkpICsgXCIpXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC5odG1sKGh0bWwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkMy5ldmVudC5wYWdlWSAtIDI4KSArIFwicHhcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZ3JvdXAgPSBzZWxmLmNvbmZpZy5ncm91cHMudmFsdWUoZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGdyb3VwIHx8IGdyb3VwPT09MCApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCs9XCI8YnIvPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhYmVsID0gc2VsZi5jb25maWcuZ3JvdXBzLmxhYmVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYobGFiZWwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwrPWxhYmVsK1wiOiBcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwrPWdyb3VwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLmh0bWwoaHRtbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCAoZCk9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBkb3RzLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcC51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVMZWdlbmQoKTtcclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlKGRhdGEpIHtcclxuXHJcbiAgICAgICAgc3VwZXIudXBkYXRlKGRhdGEpO1xyXG4gICAgICAgIHRoaXMucGxvdC5zdWJwbG90cy5mb3JFYWNoKHAgPT4gcC51cGRhdGUoKSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVMZWdlbmQoKTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhd0JydXNoKGNlbGwpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGJydXNoID0gZDMuc3ZnLmJydXNoKClcclxuICAgICAgICAgICAgLngoc2VsZi5wbG90Lnguc2NhbGUpXHJcbiAgICAgICAgICAgIC55KHNlbGYucGxvdC55LnNjYWxlKVxyXG4gICAgICAgICAgICAub24oXCJicnVzaHN0YXJ0XCIsIGJydXNoc3RhcnQpXHJcbiAgICAgICAgICAgIC5vbihcImJydXNoXCIsIGJydXNobW92ZSlcclxuICAgICAgICAgICAgLm9uKFwiYnJ1c2hlbmRcIiwgYnJ1c2hlbmQpO1xyXG5cclxuICAgICAgICBjZWxsLmFwcGVuZChcImdcIikuY2FsbChicnVzaCk7XHJcblxyXG5cclxuICAgICAgICB2YXIgYnJ1c2hDZWxsO1xyXG5cclxuICAgICAgICAvLyBDbGVhciB0aGUgcHJldmlvdXNseS1hY3RpdmUgYnJ1c2gsIGlmIGFueS5cclxuICAgICAgICBmdW5jdGlvbiBicnVzaHN0YXJ0KHApIHtcclxuICAgICAgICAgICAgaWYgKGJydXNoQ2VsbCAhPT0gdGhpcykge1xyXG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KGJydXNoQ2VsbCkuY2FsbChicnVzaC5jbGVhcigpKTtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC54LnNjYWxlLmRvbWFpbihzZWxmLnBsb3QuZG9tYWluQnlWYXJpYWJsZVtwLnhdKTtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC55LnNjYWxlLmRvbWFpbihzZWxmLnBsb3QuZG9tYWluQnlWYXJpYWJsZVtwLnldKTtcclxuICAgICAgICAgICAgICAgIGJydXNoQ2VsbCA9IHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEhpZ2hsaWdodCB0aGUgc2VsZWN0ZWQgY2lyY2xlcy5cclxuICAgICAgICBmdW5jdGlvbiBicnVzaG1vdmUocCkge1xyXG4gICAgICAgICAgICB2YXIgZSA9IGJydXNoLmV4dGVudCgpO1xyXG4gICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwiY2lyY2xlXCIpLmNsYXNzZWQoXCJoaWRkZW5cIiwgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlWzBdWzBdID4gZFtwLnhdIHx8IGRbcC54XSA+IGVbMV1bMF1cclxuICAgICAgICAgICAgICAgICAgICB8fCBlWzBdWzFdID4gZFtwLnldIHx8IGRbcC55XSA+IGVbMV1bMV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBJZiB0aGUgYnJ1c2ggaXMgZW1wdHksIHNlbGVjdCBhbGwgY2lyY2xlcy5cclxuICAgICAgICBmdW5jdGlvbiBicnVzaGVuZCgpIHtcclxuICAgICAgICAgICAgaWYgKGJydXNoLmVtcHR5KCkpIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCIuaGlkZGVuXCIpLmNsYXNzZWQoXCJoaWRkZW5cIiwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlTGVnZW5kKCkge1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygndXBkYXRlTGVnZW5kJyk7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcblxyXG4gICAgICAgIHZhciBzY2FsZSA9IHBsb3QuZG90LmNvbG9yQ2F0ZWdvcnk7XHJcbiAgICAgICAgaWYoIXNjYWxlLmRvbWFpbigpIHx8IHNjYWxlLmRvbWFpbigpLmxlbmd0aDwyKXtcclxuICAgICAgICAgICAgcGxvdC5zaG93TGVnZW5kID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZighcGxvdC5zaG93TGVnZW5kKXtcclxuICAgICAgICAgICAgaWYocGxvdC5sZWdlbmQgJiYgcGxvdC5sZWdlbmQuY29udGFpbmVyKXtcclxuICAgICAgICAgICAgICAgIHBsb3QubGVnZW5kLmNvbnRhaW5lci5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdmFyIGxlZ2VuZFggPSB0aGlzLnBsb3Qud2lkdGggKyB0aGlzLmNvbmZpZy5sZWdlbmQubWFyZ2luO1xyXG4gICAgICAgIHZhciBsZWdlbmRZID0gdGhpcy5jb25maWcubGVnZW5kLm1hcmdpbjtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmQgPSBuZXcgTGVnZW5kKHRoaXMuc3ZnLCB0aGlzLnN2Z0csIHNjYWxlLCBsZWdlbmRYLCBsZWdlbmRZKTtcclxuXHJcbiAgICAgICAgdmFyIGxlZ2VuZExpbmVhciA9IHBsb3QubGVnZW5kLmNvbG9yKClcclxuICAgICAgICAgICAgLnNoYXBlV2lkdGgodGhpcy5jb25maWcubGVnZW5kLnNoYXBlV2lkdGgpXHJcbiAgICAgICAgICAgIC5vcmllbnQoJ3ZlcnRpY2FsJylcclxuICAgICAgICAgICAgLnNjYWxlKHNjYWxlKTtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmQuY29udGFpbmVyXHJcbiAgICAgICAgICAgIC5jYWxsKGxlZ2VuZExpbmVhcik7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge0NoYXJ0LCBDaGFydENvbmZpZ30gZnJvbSBcIi4vY2hhcnRcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IHtMZWdlbmR9IGZyb20gXCIuL2xlZ2VuZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNjYXR0ZXJQbG90Q29uZmlnIGV4dGVuZHMgQ2hhcnRDb25maWd7XHJcblxyXG4gICAgc3ZnQ2xhc3M9IHRoaXMuY3NzQ2xhc3NQcmVmaXgrJ3NjYXR0ZXJwbG90JztcclxuICAgIGd1aWRlcz0gZmFsc2U7IC8vc2hvdyBheGlzIGd1aWRlc1xyXG4gICAgc2hvd1Rvb2x0aXA9IHRydWU7IC8vc2hvdyB0b29sdGlwIG9uIGRvdCBob3ZlclxyXG4gICAgc2hvd0xlZ2VuZD10cnVlO1xyXG4gICAgbGVnZW5kPXtcclxuICAgICAgICB3aWR0aDogODAsXHJcbiAgICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgICBzaGFwZVdpZHRoOiAyMFxyXG4gICAgfTtcclxuXHJcbiAgICB4PXsvLyBYIGF4aXMgY29uZmlnXHJcbiAgICAgICAgbGFiZWw6ICdYJywgLy8gYXhpcyBsYWJlbFxyXG4gICAgICAgIGtleTogMCxcclxuICAgICAgICB2YWx1ZTogKGQsIGtleSkgPT4gZFtrZXldLCAvLyB4IHZhbHVlIGFjY2Vzc29yXHJcbiAgICAgICAgb3JpZW50OiBcImJvdHRvbVwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiXHJcbiAgICB9O1xyXG4gICAgeT17Ly8gWSBheGlzIGNvbmZpZ1xyXG4gICAgICAgIGxhYmVsOiAnWScsIC8vIGF4aXMgbGFiZWwsXHJcbiAgICAgICAga2V5OiAxLFxyXG4gICAgICAgIHZhbHVlOiAoZCwga2V5KSA9PiBkW2tleV0sIC8vIHkgdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICBvcmllbnQ6IFwibGVmdFwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiXHJcbiAgICB9O1xyXG4gICAgZ3JvdXBzPXtcclxuICAgICAgICBrZXk6IDIsXHJcbiAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IGRba2V5XSAsIC8vIGdyb3VwaW5nIHZhbHVlIGFjY2Vzc29yLFxyXG4gICAgICAgIGxhYmVsOiBcIlwiXHJcbiAgICB9O1xyXG4gICAgdHJhbnNpdGlvbj0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdmFyIGNvbmZpZyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5kb3Q9e1xyXG4gICAgICAgICAgICByYWRpdXM6IDIsXHJcbiAgICAgICAgICAgIGNvbG9yOiBkID0+IGNvbmZpZy5ncm91cHMudmFsdWUoZCwgY29uZmlnLmdyb3Vwcy5rZXkpLCAvLyBzdHJpbmcgb3IgZnVuY3Rpb24gcmV0dXJuaW5nIGNvbG9yJ3MgdmFsdWUgZm9yIGNvbG9yIHNjYWxlXHJcbiAgICAgICAgICAgIGQzQ29sb3JDYXRlZ29yeTogJ2NhdGVnb3J5MTAnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYoY3VzdG9tKXtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTY2F0dGVyUGxvdCBleHRlbmRzIENoYXJ0e1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IFNjYXR0ZXJQbG90Q29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpe1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IFNjYXR0ZXJQbG90Q29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCl7XHJcbiAgICAgICAgc3VwZXIuaW5pdFBsb3QoKTtcclxuICAgICAgICB2YXIgc2VsZj10aGlzO1xyXG5cclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueD17fTtcclxuICAgICAgICB0aGlzLnBsb3QueT17fTtcclxuICAgICAgICB0aGlzLnBsb3QuZG90PXtcclxuICAgICAgICAgICAgY29sb3I6IG51bGwvL2NvbG9yIHNjYWxlIG1hcHBpbmcgZnVuY3Rpb25cclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnNob3dMZWdlbmQgPSBjb25mLnNob3dMZWdlbmQ7XHJcbiAgICAgICAgaWYodGhpcy5wbG90LnNob3dMZWdlbmQpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWFyZ2luLnJpZ2h0ID0gY29uZi5tYXJnaW4ucmlnaHQgKyBjb25mLmxlZ2VuZC53aWR0aCtjb25mLmxlZ2VuZC5tYXJnaW4qMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHRoaXMuY29tcHV0ZVBsb3RTaXplKCk7XHJcbiAgICAgICAgXHJcblxyXG5cclxuICAgICAgICAvLyB2YXIgbGVnZW5kV2lkdGggPSBhdmFpbGFibGVXaWR0aDtcclxuICAgICAgICAvLyBsZWdlbmQud2lkdGgobGVnZW5kV2lkdGgpO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gd3JhcC5zZWxlY3QoJy5udi1sZWdlbmRXcmFwJylcclxuICAgICAgICAvLyAgICAgLmRhdHVtKGRhdGEpXHJcbiAgICAgICAgLy8gICAgIC5jYWxsKGxlZ2VuZCk7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBpZiAobGVnZW5kLmhlaWdodCgpID4gbWFyZ2luLnRvcCkge1xyXG4gICAgICAgIC8vICAgICBtYXJnaW4udG9wID0gbGVnZW5kLmhlaWdodCgpO1xyXG4gICAgICAgIC8vICAgICBhdmFpbGFibGVIZWlnaHQgPSBudi51dGlscy5hdmFpbGFibGVIZWlnaHQoaGVpZ2h0LCBjb250YWluZXIsIG1hcmdpbik7XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICB0aGlzLnNldHVwWCgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBZKCk7XHJcblxyXG4gICAgICAgIGlmKGNvbmYuZG90LmQzQ29sb3JDYXRlZ29yeSl7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5kb3QuY29sb3JDYXRlZ29yeSA9IGQzLnNjYWxlW2NvbmYuZG90LmQzQ29sb3JDYXRlZ29yeV0oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNvbG9yVmFsdWUgPSBjb25mLmRvdC5jb2xvcjtcclxuICAgICAgICBpZihjb2xvclZhbHVlKXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmRvdC5jb2xvclZhbHVlID0gY29sb3JWYWx1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29sb3JWYWx1ZSA9PT0gJ3N0cmluZycgfHwgY29sb3JWYWx1ZSBpbnN0YW5jZW9mIFN0cmluZyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yID0gY29sb3JWYWx1ZTtcclxuICAgICAgICAgICAgfWVsc2UgaWYodGhpcy5wbG90LmRvdC5jb2xvckNhdGVnb3J5KXtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5kb3QuY29sb3IgPSBkID0+ICBzZWxmLnBsb3QuZG90LmNvbG9yQ2F0ZWdvcnkoc2VsZi5wbG90LmRvdC5jb2xvclZhbHVlKGQpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfWVsc2V7XHJcblxyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cFgoKXtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHggPSBwbG90Lng7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZy54O1xyXG5cclxuICAgICAgICAvKiAqXHJcbiAgICAgICAgICogdmFsdWUgYWNjZXNzb3IgLSByZXR1cm5zIHRoZSB2YWx1ZSB0byBlbmNvZGUgZm9yIGEgZ2l2ZW4gZGF0YSBvYmplY3QuXHJcbiAgICAgICAgICogc2NhbGUgLSBtYXBzIHZhbHVlIHRvIGEgdmlzdWFsIGRpc3BsYXkgZW5jb2RpbmcsIHN1Y2ggYXMgYSBwaXhlbCBwb3NpdGlvbi5cclxuICAgICAgICAgKiBtYXAgZnVuY3Rpb24gLSBtYXBzIGZyb20gZGF0YSB2YWx1ZSB0byBkaXNwbGF5IHZhbHVlXHJcbiAgICAgICAgICogYXhpcyAtIHNldHMgdXAgYXhpc1xyXG4gICAgICAgICAqKi9cclxuICAgICAgICB4LnZhbHVlID0gZCA9PiBjb25mLnZhbHVlKGQsIGNvbmYua2V5KTtcclxuICAgICAgICB4LnNjYWxlID0gZDMuc2NhbGVbY29uZi5zY2FsZV0oKS5yYW5nZShbMCwgcGxvdC53aWR0aF0pO1xyXG4gICAgICAgIHgubWFwID0gZCA9PiB4LnNjYWxlKHgudmFsdWUoZCkpO1xyXG4gICAgICAgIHguYXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeC5zY2FsZSkub3JpZW50KGNvbmYub3JpZW50KTtcclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgICAgICBwbG90Lnguc2NhbGUuZG9tYWluKFtkMy5taW4oZGF0YSwgcGxvdC54LnZhbHVlKS0xLCBkMy5tYXgoZGF0YSwgcGxvdC54LnZhbHVlKSsxXSk7XHJcbiAgICAgICAgaWYodGhpcy5jb25maWcuZ3VpZGVzKSB7XHJcbiAgICAgICAgICAgIHguYXhpcy50aWNrU2l6ZSgtcGxvdC5oZWlnaHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwWSAoKXtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHkgPSBwbG90Lnk7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZy55O1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHZhbHVlIGFjY2Vzc29yIC0gcmV0dXJucyB0aGUgdmFsdWUgdG8gZW5jb2RlIGZvciBhIGdpdmVuIGRhdGEgb2JqZWN0LlxyXG4gICAgICAgICAqIHNjYWxlIC0gbWFwcyB2YWx1ZSB0byBhIHZpc3VhbCBkaXNwbGF5IGVuY29kaW5nLCBzdWNoIGFzIGEgcGl4ZWwgcG9zaXRpb24uXHJcbiAgICAgICAgICogbWFwIGZ1bmN0aW9uIC0gbWFwcyBmcm9tIGRhdGEgdmFsdWUgdG8gZGlzcGxheSB2YWx1ZVxyXG4gICAgICAgICAqIGF4aXMgLSBzZXRzIHVwIGF4aXNcclxuICAgICAgICAgKi9cclxuICAgICAgICB5LnZhbHVlID0gZCA9PiBjb25mLnZhbHVlKGQsIGNvbmYua2V5KTtcclxuICAgICAgICB5LnNjYWxlID0gZDMuc2NhbGVbY29uZi5zY2FsZV0oKS5yYW5nZShbcGxvdC5oZWlnaHQsIDBdKTtcclxuICAgICAgICB5Lm1hcCA9IGQgPT4geS5zY2FsZSh5LnZhbHVlKGQpKTtcclxuICAgICAgICB5LmF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHkuc2NhbGUpLm9yaWVudChjb25mLm9yaWVudCk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuY29uZmlnLmd1aWRlcyl7XHJcbiAgICAgICAgICAgIHkuYXhpcy50aWNrU2l6ZSgtcGxvdC53aWR0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgcGxvdC55LnNjYWxlLmRvbWFpbihbZDMubWluKGRhdGEsIHBsb3QueS52YWx1ZSktMSwgZDMubWF4KGRhdGEsIHBsb3QueS52YWx1ZSkrMV0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBkcmF3KCl7XHJcbiAgICAgICAgdGhpcy5kcmF3QXhpc1goKTtcclxuICAgICAgICB0aGlzLmRyYXdBeGlzWSgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGRyYXdBeGlzWCgpe1xyXG5cclxuICAgICAgICBcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGF4aXNDb25mID0gdGhpcy5jb25maWcueDtcclxuICAgICAgICB2YXIgYXhpcyA9IHNlbGYuc3ZnRy5zZWxlY3RPckFwcGVuZChcImcuXCIrc2VsZi5wcmVmaXhDbGFzcygnYXhpcy14JykrXCIuXCIrc2VsZi5wcmVmaXhDbGFzcygnYXhpcycpKyhzZWxmLmNvbmZpZy5ndWlkZXMgPyAnJyA6ICcuJytzZWxmLnByZWZpeENsYXNzKCduby1ndWlkZXMnKSkpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyBwbG90LmhlaWdodCArIFwiKVwiKTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgYXhpc1QgPSBheGlzO1xyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy50cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGF4aXNUID0gYXhpcy50cmFuc2l0aW9uKCkuZWFzZShcInNpbi1pbi1vdXRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBheGlzVC5jYWxsKHBsb3QueC5heGlzKTtcclxuICAgICAgICBcclxuICAgICAgICBheGlzLnNlbGVjdE9yQXBwZW5kKFwidGV4dC5cIitzZWxmLnByZWZpeENsYXNzKCdsYWJlbCcpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisgKHBsb3Qud2lkdGgvMikgK1wiLFwiKyAocGxvdC5tYXJnaW4uYm90dG9tKSArXCIpXCIpICAvLyB0ZXh0IGlzIGRyYXduIG9mZiB0aGUgc2NyZWVuIHRvcCBsZWZ0LCBtb3ZlIGRvd24gYW5kIG91dCBhbmQgcm90YXRlXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCItMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGF4aXNDb25mLmxhYmVsKTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhd0F4aXNZKCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBheGlzQ29uZiA9IHRoaXMuY29uZmlnLnk7XHJcbiAgICAgICAgdmFyIGF4aXMgPSBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMteScpK1wiLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMnKSsoc2VsZi5jb25maWcuZ3VpZGVzID8gJycgOiAnLicrc2VsZi5wcmVmaXhDbGFzcygnbm8tZ3VpZGVzJykpKTtcclxuXHJcbiAgICAgICAgdmFyIGF4aXNUID0gYXhpcztcclxuICAgICAgICBpZiAoc2VsZi5jb25maWcudHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICBheGlzVCA9IGF4aXMudHJhbnNpdGlvbigpLmVhc2UoXCJzaW4taW4tb3V0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXhpc1QuY2FsbChwbG90LnkuYXhpcyk7XHJcblxyXG4gICAgICAgIGF4aXMuc2VsZWN0T3JBcHBlbmQoXCJ0ZXh0LlwiK3NlbGYucHJlZml4Q2xhc3MoJ2xhYmVsJykpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyAtcGxvdC5tYXJnaW4ubGVmdCArXCIsXCIrKHBsb3QuaGVpZ2h0LzIpK1wiKXJvdGF0ZSgtOTApXCIpICAvLyB0ZXh0IGlzIGRyYXduIG9mZiB0aGUgc2NyZWVuIHRvcCBsZWZ0LCBtb3ZlIGRvd24gYW5kIG91dCBhbmQgcm90YXRlXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCIxZW1cIilcclxuICAgICAgICAgICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoYXhpc0NvbmYubGFiZWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICB1cGRhdGUobmV3RGF0YSl7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKG5ld0RhdGEpO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZURvdHMoKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVMZWdlbmQoKTtcclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlRG90cygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgdmFyIGRvdENsYXNzID0gc2VsZi5wcmVmaXhDbGFzcygnZG90Jyk7XHJcbiAgICAgICAgc2VsZi5kb3RzQ29udGFpbmVyQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKCdkb3RzLWNvbnRhaW5lcicpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGRvdHNDb250YWluZXIgPSBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiICsgc2VsZi5kb3RzQ29udGFpbmVyQ2xhc3MpO1xyXG5cclxuICAgICAgICB2YXIgZG90cyA9IGRvdHNDb250YWluZXIuc2VsZWN0QWxsKCcuJyArIGRvdENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShkYXRhKTtcclxuXHJcbiAgICAgICAgZG90cy5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGRvdENsYXNzKTtcclxuXHJcbiAgICAgICAgdmFyIGRvdHNUID0gZG90cztcclxuICAgICAgICBpZiAoc2VsZi5jb25maWcudHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICBkb3RzVCA9IGRvdHMudHJhbnNpdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG90c1QuYXR0cihcInJcIiwgc2VsZi5jb25maWcuZG90LnJhZGl1cylcclxuICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCBwbG90LngubWFwKVxyXG4gICAgICAgICAgICAuYXR0cihcImN5XCIsIHBsb3QueS5tYXApO1xyXG5cclxuICAgICAgICBpZiAocGxvdC50b29sdGlwKSB7XHJcbiAgICAgICAgICAgIGRvdHMub24oXCJtb3VzZW92ZXJcIiwgZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDIwMClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIC45KTtcclxuICAgICAgICAgICAgICAgIHZhciBodG1sID0gXCIoXCIgKyBwbG90LngudmFsdWUoZCkgKyBcIiwgXCIgKyBwbG90LnkudmFsdWUoZCkgKyBcIilcIjtcclxuICAgICAgICAgICAgICAgIHZhciBncm91cCA9IHNlbGYuY29uZmlnLmdyb3Vwcy52YWx1ZShkLCBzZWxmLmNvbmZpZy5ncm91cHMua2V5KTtcclxuICAgICAgICAgICAgICAgIGlmIChncm91cCB8fCBncm91cCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gXCI8YnIvPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsYWJlbCA9IHNlbGYuY29uZmlnLmdyb3Vwcy5sYWJlbDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGFiZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBsYWJlbCArIFwiOiBcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBncm91cFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLmh0bWwoaHRtbClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgZCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGxvdC5kb3QuY29sb3IpIHtcclxuICAgICAgICAgICAgZG90cy5zdHlsZShcImZpbGxcIiwgcGxvdC5kb3QuY29sb3IpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkb3RzLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVMZWdlbmQoKSB7XHJcblxyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuXHJcbiAgICAgICAgdmFyIHNjYWxlID0gcGxvdC5kb3QuY29sb3JDYXRlZ29yeTtcclxuICAgICAgICBpZighc2NhbGUuZG9tYWluKCkgfHwgc2NhbGUuZG9tYWluKCkubGVuZ3RoPDIpe1xyXG4gICAgICAgICAgICBwbG90LnNob3dMZWdlbmQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCFwbG90LnNob3dMZWdlbmQpe1xyXG4gICAgICAgICAgICBpZihwbG90LmxlZ2VuZCAmJiBwbG90LmxlZ2VuZC5jb250YWluZXIpe1xyXG4gICAgICAgICAgICAgICAgcGxvdC5sZWdlbmQuY29udGFpbmVyLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB2YXIgbGVnZW5kWCA9IHRoaXMucGxvdC53aWR0aCArIHRoaXMuY29uZmlnLmxlZ2VuZC5tYXJnaW47XHJcbiAgICAgICAgdmFyIGxlZ2VuZFkgPSB0aGlzLmNvbmZpZy5sZWdlbmQubWFyZ2luO1xyXG5cclxuICAgICAgICBwbG90LmxlZ2VuZCA9IG5ldyBMZWdlbmQodGhpcy5zdmcsIHRoaXMuc3ZnRywgc2NhbGUsIGxlZ2VuZFgsIGxlZ2VuZFkpO1xyXG5cclxuICAgICAgICB2YXIgbGVnZW5kTGluZWFyID0gcGxvdC5sZWdlbmQuY29sb3IoKVxyXG4gICAgICAgICAgICAuc2hhcGVXaWR0aCh0aGlzLmNvbmZpZy5sZWdlbmQuc2hhcGVXaWR0aClcclxuICAgICAgICAgICAgLm9yaWVudCgndmVydGljYWwnKVxyXG4gICAgICAgICAgICAuc2NhbGUoc2NhbGUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHBsb3QubGVnZW5kLmNvbnRhaW5lclxyXG4gICAgICAgICAgICAuY2FsbChsZWdlbmRMaW5lYXIpO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG59XHJcbiIsIi8qXG4gKiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9iZW5yYXNtdXNlbi8xMjYxOTc3XG4gKiBOQU1FXG4gKiBcbiAqIHN0YXRpc3RpY3MtZGlzdHJpYnV0aW9ucy5qcyAtIEphdmFTY3JpcHQgbGlicmFyeSBmb3IgY2FsY3VsYXRpbmdcbiAqICAgY3JpdGljYWwgdmFsdWVzIGFuZCB1cHBlciBwcm9iYWJpbGl0aWVzIG9mIGNvbW1vbiBzdGF0aXN0aWNhbFxuICogICBkaXN0cmlidXRpb25zXG4gKiBcbiAqIFNZTk9QU0lTXG4gKiBcbiAqIFxuICogICAvLyBDaGktc3F1YXJlZC1jcml0ICgyIGRlZ3JlZXMgb2YgZnJlZWRvbSwgOTV0aCBwZXJjZW50aWxlID0gMC4wNSBsZXZlbFxuICogICBjaGlzcXJkaXN0cigyLCAuMDUpXG4gKiAgIFxuICogICAvLyB1LWNyaXQgKDk1dGggcGVyY2VudGlsZSA9IDAuMDUgbGV2ZWwpXG4gKiAgIHVkaXN0ciguMDUpO1xuICogICBcbiAqICAgLy8gdC1jcml0ICgxIGRlZ3JlZSBvZiBmcmVlZG9tLCA5OS41dGggcGVyY2VudGlsZSA9IDAuMDA1IGxldmVsKSBcbiAqICAgdGRpc3RyKDEsLjAwNSk7XG4gKiAgIFxuICogICAvLyBGLWNyaXQgKDEgZGVncmVlIG9mIGZyZWVkb20gaW4gbnVtZXJhdG9yLCAzIGRlZ3JlZXMgb2YgZnJlZWRvbSBcbiAqICAgLy8gICAgICAgICBpbiBkZW5vbWluYXRvciwgOTl0aCBwZXJjZW50aWxlID0gMC4wMSBsZXZlbClcbiAqICAgZmRpc3RyKDEsMywuMDEpO1xuICogICBcbiAqICAgLy8gdXBwZXIgcHJvYmFiaWxpdHkgb2YgdGhlIHUgZGlzdHJpYnV0aW9uICh1ID0gLTAuODUpOiBRKHUpID0gMS1HKHUpXG4gKiAgIHVwcm9iKC0wLjg1KTtcbiAqICAgXG4gKiAgIC8vIHVwcGVyIHByb2JhYmlsaXR5IG9mIHRoZSBjaGktc3F1YXJlIGRpc3RyaWJ1dGlvblxuICogICAvLyAoMyBkZWdyZWVzIG9mIGZyZWVkb20sIGNoaS1zcXVhcmVkID0gNi4yNSk6IFEgPSAxLUdcbiAqICAgY2hpc3FycHJvYigzLDYuMjUpO1xuICogICBcbiAqICAgLy8gdXBwZXIgcHJvYmFiaWxpdHkgb2YgdGhlIHQgZGlzdHJpYnV0aW9uXG4gKiAgIC8vICgzIGRlZ3JlZXMgb2YgZnJlZWRvbSwgdCA9IDYuMjUxKTogUSA9IDEtR1xuICogICB0cHJvYigzLDYuMjUxKTtcbiAqICAgXG4gKiAgIC8vIHVwcGVyIHByb2JhYmlsaXR5IG9mIHRoZSBGIGRpc3RyaWJ1dGlvblxuICogICAvLyAoMyBkZWdyZWVzIG9mIGZyZWVkb20gaW4gbnVtZXJhdG9yLCA1IGRlZ3JlZXMgb2YgZnJlZWRvbSBpblxuICogICAvLyAgZGVub21pbmF0b3IsIEYgPSA2LjI1KTogUSA9IDEtR1xuICogICBmcHJvYigzLDUsLjYyNSk7XG4gKiBcbiAqIFxuICogIERFU0NSSVBUSU9OXG4gKiBcbiAqIFRoaXMgbGlicmFyeSBjYWxjdWxhdGVzIHBlcmNlbnRhZ2UgcG9pbnRzICg1IHNpZ25pZmljYW50IGRpZ2l0cykgb2YgdGhlIHVcbiAqIChzdGFuZGFyZCBub3JtYWwpIGRpc3RyaWJ1dGlvbiwgdGhlIHN0dWRlbnQncyB0IGRpc3RyaWJ1dGlvbiwgdGhlXG4gKiBjaGktc3F1YXJlIGRpc3RyaWJ1dGlvbiBhbmQgdGhlIEYgZGlzdHJpYnV0aW9uLiBJdCBjYW4gYWxzbyBjYWxjdWxhdGUgdGhlXG4gKiB1cHBlciBwcm9iYWJpbGl0eSAoNSBzaWduaWZpY2FudCBkaWdpdHMpIG9mIHRoZSB1IChzdGFuZGFyZCBub3JtYWwpLCB0aGVcbiAqIGNoaS1zcXVhcmUsIHRoZSB0IGFuZCB0aGUgRiBkaXN0cmlidXRpb24uXG4gKiBcbiAqIFRoZXNlIGNyaXRpY2FsIHZhbHVlcyBhcmUgbmVlZGVkIHRvIHBlcmZvcm0gc3RhdGlzdGljYWwgdGVzdHMsIGxpa2UgdGhlIHVcbiAqIHRlc3QsIHRoZSB0IHRlc3QsIHRoZSBGIHRlc3QgYW5kIHRoZSBjaGktc3F1YXJlZCB0ZXN0LCBhbmQgdG8gY2FsY3VsYXRlXG4gKiBjb25maWRlbmNlIGludGVydmFscy5cbiAqIFxuICogSWYgeW91IGFyZSBpbnRlcmVzdGVkIGluIG1vcmUgcHJlY2lzZSBhbGdvcml0aG1zIHlvdSBjb3VsZCBsb29rIGF0OlxuICogICBTdGF0TGliOiBodHRwOi8vbGliLnN0YXQuY211LmVkdS9hcHN0YXQvIDsgXG4gKiAgIEFwcGxpZWQgU3RhdGlzdGljcyBBbGdvcml0aG1zIGJ5IEdyaWZmaXRocywgUC4gYW5kIEhpbGwsIEkuRC5cbiAqICAgLCBFbGxpcyBIb3J3b29kOiBDaGljaGVzdGVyICgxOTg1KVxuICogXG4gKiBCVUdTIFxuICogXG4gKiBUaGlzIHBvcnQgd2FzIHByb2R1Y2VkIGZyb20gdGhlIFBlcmwgbW9kdWxlIFN0YXRpc3RpY3M6OkRpc3RyaWJ1dGlvbnNcbiAqIHRoYXQgaGFzIGhhZCBubyBidWcgcmVwb3J0cyBpbiBzZXZlcmFsIHllYXJzLiAgSWYgeW91IGZpbmQgYSBidWcgdGhlblxuICogcGxlYXNlIGRvdWJsZS1jaGVjayB0aGF0IEphdmFTY3JpcHQgZG9lcyBub3QgdGhpbmcgdGhlIG51bWJlcnMgeW91IGFyZVxuICogcGFzc2luZyBpbiBhcmUgc3RyaW5ncy4gIChZb3UgY2FuIHN1YnRyYWN0IDAgZnJvbSB0aGVtIGFzIHlvdSBwYXNzIHRoZW1cbiAqIGluIHNvIHRoYXQgXCI1XCIgaXMgcHJvcGVybHkgdW5kZXJzdG9vZCB0byBiZSA1LikgIElmIHlvdSBoYXZlIHBhc3NlZCBpbiBhXG4gKiBudW1iZXIgdGhlbiBwbGVhc2UgY29udGFjdCB0aGUgYXV0aG9yXG4gKiBcbiAqIEFVVEhPUlxuICogXG4gKiBCZW4gVGlsbHkgPGJ0aWxseUBnbWFpbC5jb20+XG4gKiBcbiAqIE9yaWdpbmwgUGVybCB2ZXJzaW9uIGJ5IE1pY2hhZWwgS29zcGFjaCA8bWlrZS5wZXJsQGdteC5hdD5cbiAqIFxuICogTmljZSBmb3JtYXRpbmcsIHNpbXBsaWZpY2F0aW9uIGFuZCBidWcgcmVwYWlyIGJ5IE1hdHRoaWFzIFRyYXV0bmVyIEtyb21hbm5cbiAqIDxtdGtAaWQuY2JzLmRrPlxuICogXG4gKiBDT1BZUklHSFQgXG4gKiBcbiAqIENvcHlyaWdodCAyMDA4IEJlbiBUaWxseS5cbiAqIFxuICogVGhpcyBsaWJyYXJ5IGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXRcbiAqIHVuZGVyIHRoZSBzYW1lIHRlcm1zIGFzIFBlcmwgaXRzZWxmLiAgVGhpcyBtZWFucyB1bmRlciBlaXRoZXIgdGhlIFBlcmxcbiAqIEFydGlzdGljIExpY2Vuc2Ugb3IgdGhlIEdQTCB2MSBvciBsYXRlci5cbiAqL1xuXG52YXIgU0lHTklGSUNBTlQgPSA1OyAvLyBudW1iZXIgb2Ygc2lnbmlmaWNhbnQgZGlnaXRzIHRvIGJlIHJldHVybmVkXG5cbmZ1bmN0aW9uIGNoaXNxcmRpc3RyICgkbiwgJHApIHtcblx0aWYgKCRuIDw9IDAgfHwgTWF0aC5hYnMoJG4pIC0gTWF0aC5hYnMoaW50ZWdlcigkbikpICE9IDApIHtcblx0XHR0aHJvdyhcIkludmFsaWQgbjogJG5cXG5cIik7IC8qIGRlZ3JlZSBvZiBmcmVlZG9tICovXG5cdH1cblx0aWYgKCRwIDw9IDAgfHwgJHAgPiAxKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIHA6ICRwXFxuXCIpOyBcblx0fVxuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3ViY2hpc3FyKCRuLTAsICRwLTApKTtcbn1cblxuZnVuY3Rpb24gdWRpc3RyICgkcCkge1xuXHRpZiAoJHAgPiAxIHx8ICRwIDw9IDApIHtcblx0XHR0aHJvdyhcIkludmFsaWQgcDogJHBcXG5cIik7XG5cdH1cblx0cmV0dXJuIHByZWNpc2lvbl9zdHJpbmcoX3N1YnUoJHAtMCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGRpc3RyICgkbiwgJHApIHtcblx0aWYgKCRuIDw9IDAgfHwgTWF0aC5hYnMoJG4pIC0gTWF0aC5hYnMoaW50ZWdlcigkbikpICE9IDApIHtcblx0XHR0aHJvdyhcIkludmFsaWQgbjogJG5cXG5cIik7XG5cdH1cblx0aWYgKCRwIDw9IDAgfHwgJHAgPj0gMSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBwOiAkcFxcblwiKTtcblx0fVxuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3VidCgkbi0wLCAkcC0wKSk7XG59XG5cbmZ1bmN0aW9uIGZkaXN0ciAoJG4sICRtLCAkcCkge1xuXHRpZiAoKCRuPD0wKSB8fCAoKE1hdGguYWJzKCRuKS0oTWF0aC5hYnMoaW50ZWdlcigkbikpKSkhPTApKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG46ICRuXFxuXCIpOyAvKiBmaXJzdCBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9XG5cdGlmICgoJG08PTApIHx8ICgoTWF0aC5hYnMoJG0pLShNYXRoLmFicyhpbnRlZ2VyKCRtKSkpKSE9MCkpIHtcblx0XHR0aHJvdyhcIkludmFsaWQgbTogJG1cXG5cIik7IC8qIHNlY29uZCBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9XG5cdGlmICgoJHA8PTApIHx8ICgkcD4xKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBwOiAkcFxcblwiKTtcblx0fVxuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3ViZigkbi0wLCAkbS0wLCAkcC0wKSk7XG59XG5cbmZ1bmN0aW9uIHVwcm9iICgkeCkge1xuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3VidXByb2IoJHgtMCkpO1xufVxuXG5mdW5jdGlvbiBjaGlzcXJwcm9iICgkbiwkeCkge1xuXHRpZiAoKCRuIDw9IDApIHx8ICgoTWF0aC5hYnMoJG4pIC0gKE1hdGguYWJzKGludGVnZXIoJG4pKSkpICE9IDApKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG46ICRuXFxuXCIpOyAvKiBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9XG5cdHJldHVybiBwcmVjaXNpb25fc3RyaW5nKF9zdWJjaGlzcXJwcm9iKCRuLTAsICR4LTApKTtcbn1cblxuZnVuY3Rpb24gdHByb2IgKCRuLCAkeCkge1xuXHRpZiAoKCRuIDw9IDApIHx8ICgoTWF0aC5hYnMoJG4pIC0gTWF0aC5hYnMoaW50ZWdlcigkbikpKSAhPTApKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG46ICRuXFxuXCIpOyAvKiBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9XG5cdHJldHVybiBwcmVjaXNpb25fc3RyaW5nKF9zdWJ0cHJvYigkbi0wLCAkeC0wKSk7XG59XG5cbmZ1bmN0aW9uIGZwcm9iICgkbiwgJG0sICR4KSB7XG5cdGlmICgoJG48PTApIHx8ICgoTWF0aC5hYnMoJG4pLShNYXRoLmFicyhpbnRlZ2VyKCRuKSkpKSE9MCkpIHtcblx0XHR0aHJvdyhcIkludmFsaWQgbjogJG5cXG5cIik7IC8qIGZpcnN0IGRlZ3JlZSBvZiBmcmVlZG9tICovXG5cdH1cblx0aWYgKCgkbTw9MCkgfHwgKChNYXRoLmFicygkbSktKE1hdGguYWJzKGludGVnZXIoJG0pKSkpIT0wKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBtOiAkbVxcblwiKTsgLyogc2Vjb25kIGRlZ3JlZSBvZiBmcmVlZG9tICovXG5cdH0gXG5cdHJldHVybiBwcmVjaXNpb25fc3RyaW5nKF9zdWJmcHJvYigkbi0wLCAkbS0wLCAkeC0wKSk7XG59XG5cblxuZnVuY3Rpb24gX3N1YmZwcm9iICgkbiwgJG0sICR4KSB7XG5cdHZhciAkcDtcblxuXHRpZiAoJHg8PTApIHtcblx0XHQkcD0xO1xuXHR9IGVsc2UgaWYgKCRtICUgMiA9PSAwKSB7XG5cdFx0dmFyICR6ID0gJG0gLyAoJG0gKyAkbiAqICR4KTtcblx0XHR2YXIgJGEgPSAxO1xuXHRcdGZvciAodmFyICRpID0gJG0gLSAyOyAkaSA+PSAyOyAkaSAtPSAyKSB7XG5cdFx0XHQkYSA9IDEgKyAoJG4gKyAkaSAtIDIpIC8gJGkgKiAkeiAqICRhO1xuXHRcdH1cblx0XHQkcCA9IDEgLSBNYXRoLnBvdygoMSAtICR6KSwgKCRuIC8gMikgKiAkYSk7XG5cdH0gZWxzZSBpZiAoJG4gJSAyID09IDApIHtcblx0XHR2YXIgJHogPSAkbiAqICR4IC8gKCRtICsgJG4gKiAkeCk7XG5cdFx0dmFyICRhID0gMTtcblx0XHRmb3IgKHZhciAkaSA9ICRuIC0gMjsgJGkgPj0gMjsgJGkgLT0gMikge1xuXHRcdFx0JGEgPSAxICsgKCRtICsgJGkgLSAyKSAvICRpICogJHogKiAkYTtcblx0XHR9XG5cdFx0JHAgPSBNYXRoLnBvdygoMSAtICR6KSwgKCRtIC8gMikpICogJGE7XG5cdH0gZWxzZSB7XG5cdFx0dmFyICR5ID0gTWF0aC5hdGFuMihNYXRoLnNxcnQoJG4gKiAkeCAvICRtKSwgMSk7XG5cdFx0dmFyICR6ID0gTWF0aC5wb3coTWF0aC5zaW4oJHkpLCAyKTtcblx0XHR2YXIgJGEgPSAoJG4gPT0gMSkgPyAwIDogMTtcblx0XHRmb3IgKHZhciAkaSA9ICRuIC0gMjsgJGkgPj0gMzsgJGkgLT0gMikge1xuXHRcdFx0JGEgPSAxICsgKCRtICsgJGkgLSAyKSAvICRpICogJHogKiAkYTtcblx0XHR9IFxuXHRcdHZhciAkYiA9IE1hdGguUEk7XG5cdFx0Zm9yICh2YXIgJGkgPSAyOyAkaSA8PSAkbSAtIDE7ICRpICs9IDIpIHtcblx0XHRcdCRiICo9ICgkaSAtIDEpIC8gJGk7XG5cdFx0fVxuXHRcdHZhciAkcDEgPSAyIC8gJGIgKiBNYXRoLnNpbigkeSkgKiBNYXRoLnBvdyhNYXRoLmNvcygkeSksICRtKSAqICRhO1xuXG5cdFx0JHogPSBNYXRoLnBvdyhNYXRoLmNvcygkeSksIDIpO1xuXHRcdCRhID0gKCRtID09IDEpID8gMCA6IDE7XG5cdFx0Zm9yICh2YXIgJGkgPSAkbS0yOyAkaSA+PSAzOyAkaSAtPSAyKSB7XG5cdFx0XHQkYSA9IDEgKyAoJGkgLSAxKSAvICRpICogJHogKiAkYTtcblx0XHR9XG5cdFx0JHAgPSBtYXgoMCwgJHAxICsgMSAtIDIgKiAkeSAvIE1hdGguUElcblx0XHRcdC0gMiAvIE1hdGguUEkgKiBNYXRoLnNpbigkeSkgKiBNYXRoLmNvcygkeSkgKiAkYSk7XG5cdH1cblx0cmV0dXJuICRwO1xufVxuXG5cbmZ1bmN0aW9uIF9zdWJjaGlzcXJwcm9iICgkbiwkeCkge1xuXHR2YXIgJHA7XG5cblx0aWYgKCR4IDw9IDApIHtcblx0XHQkcCA9IDE7XG5cdH0gZWxzZSBpZiAoJG4gPiAxMDApIHtcblx0XHQkcCA9IF9zdWJ1cHJvYigoTWF0aC5wb3coKCR4IC8gJG4pLCAxLzMpXG5cdFx0XHRcdC0gKDEgLSAyLzkvJG4pKSAvIE1hdGguc3FydCgyLzkvJG4pKTtcblx0fSBlbHNlIGlmICgkeCA+IDQwMCkge1xuXHRcdCRwID0gMDtcblx0fSBlbHNlIHsgICBcblx0XHR2YXIgJGE7XG4gICAgICAgICAgICAgICAgdmFyICRpO1xuICAgICAgICAgICAgICAgIHZhciAkaTE7XG5cdFx0aWYgKCgkbiAlIDIpICE9IDApIHtcblx0XHRcdCRwID0gMiAqIF9zdWJ1cHJvYihNYXRoLnNxcnQoJHgpKTtcblx0XHRcdCRhID0gTWF0aC5zcXJ0KDIvTWF0aC5QSSkgKiBNYXRoLmV4cCgtJHgvMikgLyBNYXRoLnNxcnQoJHgpO1xuXHRcdFx0JGkxID0gMTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHAgPSAkYSA9IE1hdGguZXhwKC0keC8yKTtcblx0XHRcdCRpMSA9IDI7XG5cdFx0fVxuXG5cdFx0Zm9yICgkaSA9ICRpMTsgJGkgPD0gKCRuLTIpOyAkaSArPSAyKSB7XG5cdFx0XHQkYSAqPSAkeCAvICRpO1xuXHRcdFx0JHAgKz0gJGE7XG5cdFx0fVxuXHR9XG5cdHJldHVybiAkcDtcbn1cblxuZnVuY3Rpb24gX3N1YnUgKCRwKSB7XG5cdHZhciAkeSA9IC1NYXRoLmxvZyg0ICogJHAgKiAoMSAtICRwKSk7XG5cdHZhciAkeCA9IE1hdGguc3FydChcblx0XHQkeSAqICgxLjU3MDc5NjI4OFxuXHRcdCAgKyAkeSAqICguMDM3MDY5ODc5MDZcblx0XHQgIFx0KyAkeSAqICgtLjgzNjQzNTM1ODlFLTNcblx0XHRcdCAgKyAkeSAqKC0uMjI1MDk0NzE3NkUtM1xuXHRcdFx0ICBcdCsgJHkgKiAoLjY4NDEyMTgyOTlFLTVcblx0XHRcdFx0ICArICR5ICogKDAuNTgyNDIzODUxNUUtNVxuXHRcdFx0XHRcdCsgJHkgKiAoLS4xMDQ1Mjc0OTdFLTVcblx0XHRcdFx0XHQgICsgJHkgKiAoLjgzNjA5MzcwMTdFLTdcblx0XHRcdFx0XHRcdCsgJHkgKiAoLS4zMjMxMDgxMjc3RS04XG5cdFx0XHRcdFx0XHQgICsgJHkgKiAoLjM2NTc3NjMwMzZFLTEwXG5cdFx0XHRcdFx0XHRcdCsgJHkgKi42OTM2MjMzOTgyRS0xMikpKSkpKSkpKSkpO1xuXHRpZiAoJHA+LjUpXG4gICAgICAgICAgICAgICAgJHggPSAtJHg7XG5cdHJldHVybiAkeDtcbn1cblxuZnVuY3Rpb24gX3N1YnVwcm9iICgkeCkge1xuXHR2YXIgJHAgPSAwOyAvKiBpZiAoJGFic3ggPiAxMDApICovXG5cdHZhciAkYWJzeCA9IE1hdGguYWJzKCR4KTtcblxuXHRpZiAoJGFic3ggPCAxLjkpIHtcblx0XHQkcCA9IE1hdGgucG93KCgxICtcblx0XHRcdCRhYnN4ICogKC4wNDk4NjczNDdcblx0XHRcdCAgKyAkYWJzeCAqICguMDIxMTQxMDA2MVxuXHRcdFx0ICBcdCsgJGFic3ggKiAoLjAwMzI3NzYyNjNcblx0XHRcdFx0ICArICRhYnN4ICogKC4wMDAwMzgwMDM2XG5cdFx0XHRcdFx0KyAkYWJzeCAqICguMDAwMDQ4ODkwNlxuXHRcdFx0XHRcdCAgKyAkYWJzeCAqIC4wMDAwMDUzODMpKSkpKSksIC0xNikvMjtcblx0fSBlbHNlIGlmICgkYWJzeCA8PSAxMDApIHtcblx0XHRmb3IgKHZhciAkaSA9IDE4OyAkaSA+PSAxOyAkaS0tKSB7XG5cdFx0XHQkcCA9ICRpIC8gKCRhYnN4ICsgJHApO1xuXHRcdH1cblx0XHQkcCA9IE1hdGguZXhwKC0uNSAqICRhYnN4ICogJGFic3gpIFxuXHRcdFx0LyBNYXRoLnNxcnQoMiAqIE1hdGguUEkpIC8gKCRhYnN4ICsgJHApO1xuXHR9XG5cblx0aWYgKCR4PDApXG4gICAgICAgIFx0JHAgPSAxIC0gJHA7XG5cdHJldHVybiAkcDtcbn1cblxuICAgXG5mdW5jdGlvbiBfc3VidCAoJG4sICRwKSB7XG5cblx0aWYgKCRwID49IDEgfHwgJHAgPD0gMCkge1xuXHRcdHRocm93KFwiSW52YWxpZCBwOiAkcFxcblwiKTtcblx0fVxuXG5cdGlmICgkcCA9PSAwLjUpIHtcblx0XHRyZXR1cm4gMDtcblx0fSBlbHNlIGlmICgkcCA8IDAuNSkge1xuXHRcdHJldHVybiAtIF9zdWJ0KCRuLCAxIC0gJHApO1xuXHR9XG5cblx0dmFyICR1ID0gX3N1YnUoJHApO1xuXHR2YXIgJHUyID0gTWF0aC5wb3coJHUsIDIpO1xuXG5cdHZhciAkYSA9ICgkdTIgKyAxKSAvIDQ7XG5cdHZhciAkYiA9ICgoNSAqICR1MiArIDE2KSAqICR1MiArIDMpIC8gOTY7XG5cdHZhciAkYyA9ICgoKDMgKiAkdTIgKyAxOSkgKiAkdTIgKyAxNykgKiAkdTIgLSAxNSkgLyAzODQ7XG5cdHZhciAkZCA9ICgoKCg3OSAqICR1MiArIDc3NikgKiAkdTIgKyAxNDgyKSAqICR1MiAtIDE5MjApICogJHUyIC0gOTQ1KSBcblx0XHRcdFx0LyA5MjE2MDtcblx0dmFyICRlID0gKCgoKCgyNyAqICR1MiArIDMzOSkgKiAkdTIgKyA5MzApICogJHUyIC0gMTc4MikgKiAkdTIgLSA3NjUpICogJHUyXG5cdFx0XHQrIDE3OTU1KSAvIDM2ODY0MDtcblxuXHR2YXIgJHggPSAkdSAqICgxICsgKCRhICsgKCRiICsgKCRjICsgKCRkICsgJGUgLyAkbikgLyAkbikgLyAkbikgLyAkbikgLyAkbik7XG5cblx0aWYgKCRuIDw9IE1hdGgucG93KGxvZzEwKCRwKSwgMikgKyAzKSB7XG5cdFx0dmFyICRyb3VuZDtcblx0XHRkbyB7IFxuXHRcdFx0dmFyICRwMSA9IF9zdWJ0cHJvYigkbiwgJHgpO1xuXHRcdFx0dmFyICRuMSA9ICRuICsgMTtcblx0XHRcdHZhciAkZGVsdGEgPSAoJHAxIC0gJHApIFxuXHRcdFx0XHQvIE1hdGguZXhwKCgkbjEgKiBNYXRoLmxvZygkbjEgLyAoJG4gKyAkeCAqICR4KSkgXG5cdFx0XHRcdFx0KyBNYXRoLmxvZygkbi8kbjEvMi9NYXRoLlBJKSAtIDEgXG5cdFx0XHRcdFx0KyAoMS8kbjEgLSAxLyRuKSAvIDYpIC8gMik7XG5cdFx0XHQkeCArPSAkZGVsdGE7XG5cdFx0XHQkcm91bmQgPSByb3VuZF90b19wcmVjaXNpb24oJGRlbHRhLCBNYXRoLmFicyhpbnRlZ2VyKGxvZzEwKE1hdGguYWJzKCR4KSktNCkpKTtcblx0XHR9IHdoaWxlICgoJHgpICYmICgkcm91bmQgIT0gMCkpO1xuXHR9XG5cdHJldHVybiAkeDtcbn1cblxuZnVuY3Rpb24gX3N1YnRwcm9iICgkbiwgJHgpIHtcblxuXHR2YXIgJGE7XG4gICAgICAgIHZhciAkYjtcblx0dmFyICR3ID0gTWF0aC5hdGFuMigkeCAvIE1hdGguc3FydCgkbiksIDEpO1xuXHR2YXIgJHogPSBNYXRoLnBvdyhNYXRoLmNvcygkdyksIDIpO1xuXHR2YXIgJHkgPSAxO1xuXG5cdGZvciAodmFyICRpID0gJG4tMjsgJGkgPj0gMjsgJGkgLT0gMikge1xuXHRcdCR5ID0gMSArICgkaS0xKSAvICRpICogJHogKiAkeTtcblx0fSBcblxuXHRpZiAoJG4gJSAyID09IDApIHtcblx0XHQkYSA9IE1hdGguc2luKCR3KS8yO1xuXHRcdCRiID0gLjU7XG5cdH0gZWxzZSB7XG5cdFx0JGEgPSAoJG4gPT0gMSkgPyAwIDogTWF0aC5zaW4oJHcpKk1hdGguY29zKCR3KS9NYXRoLlBJO1xuXHRcdCRiPSAuNSArICR3L01hdGguUEk7XG5cdH1cblx0cmV0dXJuIG1heCgwLCAxIC0gJGIgLSAkYSAqICR5KTtcbn1cblxuZnVuY3Rpb24gX3N1YmYgKCRuLCAkbSwgJHApIHtcblx0dmFyICR4O1xuXG5cdGlmICgkcCA+PSAxIHx8ICRwIDw9IDApIHtcblx0XHR0aHJvdyhcIkludmFsaWQgcDogJHBcXG5cIik7XG5cdH1cblxuXHRpZiAoJHAgPT0gMSkge1xuXHRcdCR4ID0gMDtcblx0fSBlbHNlIGlmICgkbSA9PSAxKSB7XG5cdFx0JHggPSAxIC8gTWF0aC5wb3coX3N1YnQoJG4sIDAuNSAtICRwIC8gMiksIDIpO1xuXHR9IGVsc2UgaWYgKCRuID09IDEpIHtcblx0XHQkeCA9IE1hdGgucG93KF9zdWJ0KCRtLCAkcC8yKSwgMik7XG5cdH0gZWxzZSBpZiAoJG0gPT0gMikge1xuXHRcdHZhciAkdSA9IF9zdWJjaGlzcXIoJG0sIDEgLSAkcCk7XG5cdFx0dmFyICRhID0gJG0gLSAyO1xuXHRcdCR4ID0gMSAvICgkdSAvICRtICogKDEgK1xuXHRcdFx0KCgkdSAtICRhKSAvIDIgK1xuXHRcdFx0XHQoKCg0ICogJHUgLSAxMSAqICRhKSAqICR1ICsgJGEgKiAoNyAqICRtIC0gMTApKSAvIDI0ICtcblx0XHRcdFx0XHQoKCgyICogJHUgLSAxMCAqICRhKSAqICR1ICsgJGEgKiAoMTcgKiAkbSAtIDI2KSkgKiAkdVxuXHRcdFx0XHRcdFx0LSAkYSAqICRhICogKDkgKiAkbSAtIDYpXG5cdFx0XHRcdFx0KS80OC8kblxuXHRcdFx0XHQpLyRuXG5cdFx0XHQpLyRuKSk7XG5cdH0gZWxzZSBpZiAoJG4gPiAkbSkge1xuXHRcdCR4ID0gMSAvIF9zdWJmMigkbSwgJG4sIDEgLSAkcClcblx0fSBlbHNlIHtcblx0XHQkeCA9IF9zdWJmMigkbiwgJG0sICRwKVxuXHR9XG5cdHJldHVybiAkeDtcbn1cblxuZnVuY3Rpb24gX3N1YmYyICgkbiwgJG0sICRwKSB7XG5cdHZhciAkdSA9IF9zdWJjaGlzcXIoJG4sICRwKTtcblx0dmFyICRuMiA9ICRuIC0gMjtcblx0dmFyICR4ID0gJHUgLyAkbiAqIFxuXHRcdCgxICsgXG5cdFx0XHQoKCR1IC0gJG4yKSAvIDIgKyBcblx0XHRcdFx0KCgoNCAqICR1IC0gMTEgKiAkbjIpICogJHUgKyAkbjIgKiAoNyAqICRuIC0gMTApKSAvIDI0ICsgXG5cdFx0XHRcdFx0KCgoMiAqICR1IC0gMTAgKiAkbjIpICogJHUgKyAkbjIgKiAoMTcgKiAkbiAtIDI2KSkgKiAkdSBcblx0XHRcdFx0XHRcdC0gJG4yICogJG4yICogKDkgKiAkbiAtIDYpKSAvIDQ4IC8gJG0pIC8gJG0pIC8gJG0pO1xuXHR2YXIgJGRlbHRhO1xuXHRkbyB7XG5cdFx0dmFyICR6ID0gTWF0aC5leHAoXG5cdFx0XHQoKCRuKyRtKSAqIE1hdGgubG9nKCgkbiskbSkgLyAoJG4gKiAkeCArICRtKSkgXG5cdFx0XHRcdCsgKCRuIC0gMikgKiBNYXRoLmxvZygkeClcblx0XHRcdFx0KyBNYXRoLmxvZygkbiAqICRtIC8gKCRuKyRtKSlcblx0XHRcdFx0LSBNYXRoLmxvZyg0ICogTWF0aC5QSSlcblx0XHRcdFx0LSAoMS8kbiAgKyAxLyRtIC0gMS8oJG4rJG0pKS82XG5cdFx0XHQpLzIpO1xuXHRcdCRkZWx0YSA9IChfc3ViZnByb2IoJG4sICRtLCAkeCkgLSAkcCkgLyAkejtcblx0XHQkeCArPSAkZGVsdGE7XG5cdH0gd2hpbGUgKE1hdGguYWJzKCRkZWx0YSk+M2UtNCk7XG5cdHJldHVybiAkeDtcbn1cblxuZnVuY3Rpb24gX3N1YmNoaXNxciAoJG4sICRwKSB7XG5cdHZhciAkeDtcblxuXHRpZiAoKCRwID4gMSkgfHwgKCRwIDw9IDApKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIHA6ICRwXFxuXCIpO1xuXHR9IGVsc2UgaWYgKCRwID09IDEpe1xuXHRcdCR4ID0gMDtcblx0fSBlbHNlIGlmICgkbiA9PSAxKSB7XG5cdFx0JHggPSBNYXRoLnBvdyhfc3VidSgkcCAvIDIpLCAyKTtcblx0fSBlbHNlIGlmICgkbiA9PSAyKSB7XG5cdFx0JHggPSAtMiAqIE1hdGgubG9nKCRwKTtcblx0fSBlbHNlIHtcblx0XHR2YXIgJHUgPSBfc3VidSgkcCk7XG5cdFx0dmFyICR1MiA9ICR1ICogJHU7XG5cblx0XHQkeCA9IG1heCgwLCAkbiArIE1hdGguc3FydCgyICogJG4pICogJHUgXG5cdFx0XHQrIDIvMyAqICgkdTIgLSAxKVxuXHRcdFx0KyAkdSAqICgkdTIgLSA3KSAvIDkgLyBNYXRoLnNxcnQoMiAqICRuKVxuXHRcdFx0LSAyLzQwNSAvICRuICogKCR1MiAqICgzICokdTIgKyA3KSAtIDE2KSk7XG5cblx0XHRpZiAoJG4gPD0gMTAwKSB7XG5cdFx0XHR2YXIgJHgwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRwMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkejtcblx0XHRcdGRvIHtcblx0XHRcdFx0JHgwID0gJHg7XG5cdFx0XHRcdGlmICgkeCA8IDApIHtcblx0XHRcdFx0XHQkcDEgPSAxO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCRuPjEwMCkge1xuXHRcdFx0XHRcdCRwMSA9IF9zdWJ1cHJvYigoTWF0aC5wb3coKCR4IC8gJG4pLCAoMS8zKSkgLSAoMSAtIDIvOS8kbikpXG5cdFx0XHRcdFx0XHQvIE1hdGguc3FydCgyLzkvJG4pKTtcblx0XHRcdFx0fSBlbHNlIGlmICgkeD40MDApIHtcblx0XHRcdFx0XHQkcDEgPSAwO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhciAkaTBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgJGE7XG5cdFx0XHRcdFx0aWYgKCgkbiAlIDIpICE9IDApIHtcblx0XHRcdFx0XHRcdCRwMSA9IDIgKiBfc3VidXByb2IoTWF0aC5zcXJ0KCR4KSk7XG5cdFx0XHRcdFx0XHQkYSA9IE1hdGguc3FydCgyL01hdGguUEkpICogTWF0aC5leHAoLSR4LzIpIC8gTWF0aC5zcXJ0KCR4KTtcblx0XHRcdFx0XHRcdCRpMCA9IDE7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRwMSA9ICRhID0gTWF0aC5leHAoLSR4LzIpO1xuXHRcdFx0XHRcdFx0JGkwID0gMjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRmb3IgKHZhciAkaSA9ICRpMDsgJGkgPD0gJG4tMjsgJGkgKz0gMikge1xuXHRcdFx0XHRcdFx0JGEgKj0gJHggLyAkaTtcblx0XHRcdFx0XHRcdCRwMSArPSAkYTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0JHogPSBNYXRoLmV4cCgoKCRuLTEpICogTWF0aC5sb2coJHgvJG4pIC0gTWF0aC5sb2coNCpNYXRoLlBJKiR4KSBcblx0XHRcdFx0XHQrICRuIC0gJHggLSAxLyRuLzYpIC8gMik7XG5cdFx0XHRcdCR4ICs9ICgkcDEgLSAkcCkgLyAkejtcblx0XHRcdFx0JHggPSByb3VuZF90b19wcmVjaXNpb24oJHgsIDUpO1xuXHRcdFx0fSB3aGlsZSAoKCRuIDwgMzEpICYmIChNYXRoLmFicygkeDAgLSAkeCkgPiAxZS00KSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiAkeDtcbn1cblxuZnVuY3Rpb24gbG9nMTAgKCRuKSB7XG5cdHJldHVybiBNYXRoLmxvZygkbikgLyBNYXRoLmxvZygxMCk7XG59XG4gXG5mdW5jdGlvbiBtYXggKCkge1xuXHR2YXIgJG1heCA9IGFyZ3VtZW50c1swXTtcblx0Zm9yICh2YXIgJGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRtYXggPCBhcmd1bWVudHNbJGldKVxuICAgICAgICAgICAgICAgICAgICAgICAgJG1heCA9IGFyZ3VtZW50c1skaV07XG5cdH1cdFxuXHRyZXR1cm4gJG1heDtcbn1cblxuZnVuY3Rpb24gbWluICgpIHtcblx0dmFyICRtaW4gPSBhcmd1bWVudHNbMF07XG5cdGZvciAodmFyICRpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICgkbWluID4gYXJndW1lbnRzWyRpXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICRtaW4gPSBhcmd1bWVudHNbJGldO1xuXHR9XG5cdHJldHVybiAkbWluO1xufVxuXG5mdW5jdGlvbiBwcmVjaXNpb24gKCR4KSB7XG5cdHJldHVybiBNYXRoLmFicyhpbnRlZ2VyKGxvZzEwKE1hdGguYWJzKCR4KSkgLSBTSUdOSUZJQ0FOVCkpO1xufVxuXG5mdW5jdGlvbiBwcmVjaXNpb25fc3RyaW5nICgkeCkge1xuXHRpZiAoJHgpIHtcblx0XHRyZXR1cm4gcm91bmRfdG9fcHJlY2lzaW9uKCR4LCBwcmVjaXNpb24oJHgpKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gXCIwXCI7XG5cdH1cbn1cblxuZnVuY3Rpb24gcm91bmRfdG9fcHJlY2lzaW9uICgkeCwgJHApIHtcbiAgICAgICAgJHggPSAkeCAqIE1hdGgucG93KDEwLCAkcCk7XG4gICAgICAgICR4ID0gTWF0aC5yb3VuZCgkeCk7XG4gICAgICAgIHJldHVybiAkeCAvIE1hdGgucG93KDEwLCAkcCk7XG59XG5cbmZ1bmN0aW9uIGludGVnZXIgKCRpKSB7XG4gICAgICAgIGlmICgkaSA+IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoJGkpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbCgkaSk7XG59IiwiaW1wb3J0IHt0ZGlzdHJ9IGZyb20gXCIuL3N0YXRpc3RpY3MtZGlzdHJpYnV0aW9uc1wiXHJcblxyXG52YXIgc3UgPSBtb2R1bGUuZXhwb3J0cy5TdGF0aXN0aWNzVXRpbHMgPXt9O1xyXG5zdS5zYW1wbGVDb3JyZWxhdGlvbiA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL3NhbXBsZV9jb3JyZWxhdGlvbicpO1xyXG5zdS5saW5lYXJSZWdyZXNzaW9uID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvbGluZWFyX3JlZ3Jlc3Npb24nKTtcclxuc3UubGluZWFyUmVncmVzc2lvbkxpbmUgPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy9saW5lYXJfcmVncmVzc2lvbl9saW5lJyk7XHJcbnN1LmVycm9yRnVuY3Rpb24gPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy9lcnJvcl9mdW5jdGlvbicpO1xyXG5zdS5zdGFuZGFyZERldmlhdGlvbiA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL3N0YW5kYXJkX2RldmlhdGlvbicpO1xyXG5zdS5zYW1wbGVTdGFuZGFyZERldmlhdGlvbiA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL3NhbXBsZV9zdGFuZGFyZF9kZXZpYXRpb24nKTtcclxuc3UudmFyaWFuY2UgPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy92YXJpYW5jZScpO1xyXG5zdS5tZWFuID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvbWVhbicpO1xyXG5zdS56U2NvcmUgPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy96X3Njb3JlJyk7XHJcbnN1LnN0YW5kYXJkRXJyb3I9IGFyciA9PiBNYXRoLnNxcnQoc3UudmFyaWFuY2UoYXJyKS8oYXJyLmxlbmd0aC0xKSk7XHJcblxyXG5cclxuc3UudFZhbHVlPSAoZGVncmVlc09mRnJlZWRvbSwgY3JpdGljYWxQcm9iYWJpbGl0eSkgPT4geyAvL2FzIGluIGh0dHA6Ly9zdGF0dHJlay5jb20vb25saW5lLWNhbGN1bGF0b3IvdC1kaXN0cmlidXRpb24uYXNweFxyXG4gICAgcmV0dXJuIHRkaXN0cihkZWdyZWVzT2ZGcmVlZG9tLCBjcml0aWNhbFByb2JhYmlsaXR5KTtcclxufTsiLCJleHBvcnQgY2xhc3MgVXRpbHMge1xyXG4gICAgc3RhdGljIFNRUlRfMiA9IDEuNDE0MjEzNTYyMzc7XHJcbiAgICAvLyB1c2FnZSBleGFtcGxlIGRlZXBFeHRlbmQoe30sIG9iakEsIG9iakIpOyA9PiBzaG91bGQgd29yayBzaW1pbGFyIHRvICQuZXh0ZW5kKHRydWUsIHt9LCBvYmpBLCBvYmpCKTtcclxuICAgIHN0YXRpYyBkZWVwRXh0ZW5kKG91dCkge1xyXG5cclxuICAgICAgICB2YXIgdXRpbHMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBlbXB0eU91dCA9IHt9O1xyXG5cclxuXHJcbiAgICAgICAgaWYgKCFvdXQgJiYgYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgQXJyYXkuaXNBcnJheShhcmd1bWVudHNbMV0pKSB7XHJcbiAgICAgICAgICAgIG91dCA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvdXQgPSBvdXQgfHwge307XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGlmICghc291cmNlKVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkob3V0W2tleV0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlzT2JqZWN0ID0gdXRpbHMuaXNPYmplY3Qob3V0W2tleV0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNyY09iaiA9IHV0aWxzLmlzT2JqZWN0KHNvdXJjZVtrZXldKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNPYmplY3QgJiYgIWlzQXJyYXkgJiYgc3JjT2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMuZGVlcEV4dGVuZChvdXRba2V5XSwgc291cmNlW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRba2V5XSA9IHNvdXJjZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgbWVyZ2VEZWVwKHRhcmdldCwgc291cmNlKSB7XHJcbiAgICAgICAgbGV0IG91dHB1dCA9IE9iamVjdC5hc3NpZ24oe30sIHRhcmdldCk7XHJcbiAgICAgICAgaWYgKFV0aWxzLmlzT2JqZWN0Tm90QXJyYXkodGFyZ2V0KSAmJiBVdGlscy5pc09iamVjdE5vdEFycmF5KHNvdXJjZSkpIHtcclxuICAgICAgICAgICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoVXRpbHMuaXNPYmplY3ROb3RBcnJheShzb3VyY2Vba2V5XSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIShrZXkgaW4gdGFyZ2V0KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihvdXRwdXQsIHtba2V5XTogc291cmNlW2tleV19KTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFtrZXldID0gVXRpbHMubWVyZ2VEZWVwKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ob3V0cHV0LCB7W2tleV06IHNvdXJjZVtrZXldfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0cHV0O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjcm9zcyhhLCBiKSB7XHJcbiAgICAgICAgdmFyIGMgPSBbXSwgbiA9IGEubGVuZ3RoLCBtID0gYi5sZW5ndGgsIGksIGo7XHJcbiAgICAgICAgZm9yIChpID0gLTE7ICsraSA8IG47KSBmb3IgKGogPSAtMTsgKytqIDwgbTspIGMucHVzaCh7eDogYVtpXSwgaTogaSwgeTogYltqXSwgajogan0pO1xyXG4gICAgICAgIHJldHVybiBjO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgaW5mZXJWYXJpYWJsZXMoZGF0YSwgZ3JvdXBLZXksIGluY2x1ZGVHcm91cCkge1xyXG4gICAgICAgIHZhciByZXMgPSBbXTtcclxuICAgICAgICBpZiAoZGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdmFyIGQgPSBkYXRhWzBdO1xyXG4gICAgICAgICAgICBpZiAoZCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICByZXMgPSBkLm1hcChmdW5jdGlvbiAodiwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGQgPT09ICdvYmplY3QnKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkLmhhc093blByb3BlcnR5KHByb3ApKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2gocHJvcCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFpbmNsdWRlR3JvdXApIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gcmVzLmluZGV4T2YoZ3JvdXBLZXkpO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgcmVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgaXNPYmplY3ROb3RBcnJheShpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIChpdGVtICYmIHR5cGVvZiBpdGVtID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShpdGVtKSAmJiBpdGVtICE9PSBudWxsKTtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGlzT2JqZWN0KGEpIHtcclxuICAgICAgICByZXR1cm4gYSAhPT0gbnVsbCAmJiB0eXBlb2YgYSA9PT0gJ29iamVjdCc7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBpc051bWJlcihhKSB7XHJcbiAgICAgICAgcmV0dXJuICFpc05hTihhKSAmJiB0eXBlb2YgYSA9PT0gJ251bWJlcic7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBpc0Z1bmN0aW9uKGEpIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGEgPT09ICdmdW5jdGlvbic7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBpc0RhdGUoYSl7XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhKSA9PT0gJ1tvYmplY3QgRGF0ZV0nXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGlzU3RyaW5nKGEpe1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgYSA9PT0gJ3N0cmluZycgfHwgYSBpbnN0YW5jZW9mIFN0cmluZ1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpbnNlcnRPckFwcGVuZFNlbGVjdG9yKHBhcmVudCwgc2VsZWN0b3IsIG9wZXJhdGlvbiwgYmVmb3JlKSB7XHJcbiAgICAgICAgdmFyIHNlbGVjdG9yUGFydHMgPSBzZWxlY3Rvci5zcGxpdCgvKFtcXC5cXCNdKS8pO1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gcGFyZW50W29wZXJhdGlvbl0oc2VsZWN0b3JQYXJ0cy5zaGlmdCgpLCBiZWZvcmUpOy8vXCI6Zmlyc3QtY2hpbGRcIlxyXG4gICAgICAgIHdoaWxlIChzZWxlY3RvclBhcnRzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGVjdG9yTW9kaWZpZXIgPSBzZWxlY3RvclBhcnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxlY3Rvckl0ZW0gPSBzZWxlY3RvclBhcnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3Rvck1vZGlmaWVyID09PSBcIi5cIikge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQuY2xhc3NlZChzZWxlY3Rvckl0ZW0sIHRydWUpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNlbGVjdG9yTW9kaWZpZXIgPT09IFwiI1wiKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5hdHRyKCdpZCcsIHNlbGVjdG9ySXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGluc2VydFNlbGVjdG9yKHBhcmVudCwgc2VsZWN0b3IsIGJlZm9yZSkge1xyXG4gICAgICAgIHJldHVybiBVdGlscy5pbnNlcnRPckFwcGVuZFNlbGVjdG9yKHBhcmVudCwgc2VsZWN0b3IsIFwiaW5zZXJ0XCIsIGJlZm9yZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFwcGVuZFNlbGVjdG9yKHBhcmVudCwgc2VsZWN0b3IpIHtcclxuICAgICAgICByZXR1cm4gVXRpbHMuaW5zZXJ0T3JBcHBlbmRTZWxlY3RvcihwYXJlbnQsIHNlbGVjdG9yLCBcImFwcGVuZFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2VsZWN0T3JBcHBlbmQocGFyZW50LCBzZWxlY3RvciwgZWxlbWVudCkge1xyXG4gICAgICAgIHZhciBzZWxlY3Rpb24gPSBwYXJlbnQuc2VsZWN0KHNlbGVjdG9yKTtcclxuICAgICAgICBpZiAoc2VsZWN0aW9uLmVtcHR5KCkpIHtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJlbnQuYXBwZW5kKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBVdGlscy5hcHBlbmRTZWxlY3RvcihwYXJlbnQsIHNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzZWxlY3Rpb247XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBzZWxlY3RPckluc2VydChwYXJlbnQsIHNlbGVjdG9yLCBiZWZvcmUpIHtcclxuICAgICAgICB2YXIgc2VsZWN0aW9uID0gcGFyZW50LnNlbGVjdChzZWxlY3Rvcik7XHJcbiAgICAgICAgaWYgKHNlbGVjdGlvbi5lbXB0eSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBVdGlscy5pbnNlcnRTZWxlY3RvcihwYXJlbnQsIHNlbGVjdG9yLCBiZWZvcmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2VsZWN0aW9uO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgbGluZWFyR3JhZGllbnQoc3ZnLCBncmFkaWVudElkLCByYW5nZSwgeDEsIHkxLCB4MiwgeTIpIHtcclxuICAgICAgICB2YXIgZGVmcyA9IFV0aWxzLnNlbGVjdE9yQXBwZW5kKHN2ZywgXCJkZWZzXCIpO1xyXG4gICAgICAgIHZhciBsaW5lYXJHcmFkaWVudCA9IGRlZnMuYXBwZW5kKFwibGluZWFyR3JhZGllbnRcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBncmFkaWVudElkKTtcclxuXHJcbiAgICAgICAgbGluZWFyR3JhZGllbnRcclxuICAgICAgICAgICAgLmF0dHIoXCJ4MVwiLCB4MSArIFwiJVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInkxXCIsIHkxICsgXCIlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieDJcIiwgeDIgKyBcIiVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ5MlwiLCB5MiArIFwiJVwiKTtcclxuXHJcbiAgICAgICAgLy9BcHBlbmQgbXVsdGlwbGUgY29sb3Igc3RvcHMgYnkgdXNpbmcgRDMncyBkYXRhL2VudGVyIHN0ZXBcclxuICAgICAgICB2YXIgc3RvcHMgPSBsaW5lYXJHcmFkaWVudC5zZWxlY3RBbGwoXCJzdG9wXCIpXHJcbiAgICAgICAgICAgIC5kYXRhKHJhbmdlKTtcclxuXHJcbiAgICAgICAgc3RvcHMuZW50ZXIoKS5hcHBlbmQoXCJzdG9wXCIpO1xyXG5cclxuICAgICAgICBzdG9wcy5hdHRyKFwib2Zmc2V0XCIsIChkLCBpKSA9PiBpIC8gKHJhbmdlLmxlbmd0aCAtIDEpKVxyXG4gICAgICAgICAgICAuYXR0cihcInN0b3AtY29sb3JcIiwgZCA9PiBkKTtcclxuXHJcbiAgICAgICAgc3RvcHMuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzYW5pdGl6ZUhlaWdodCA9IGZ1bmN0aW9uIChoZWlnaHQsIGNvbnRhaW5lcikge1xyXG4gICAgICAgIHJldHVybiAoaGVpZ2h0IHx8IHBhcnNlSW50KGNvbnRhaW5lci5zdHlsZSgnaGVpZ2h0JyksIDEwKSB8fCA0MDApO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgc2FuaXRpemVXaWR0aCA9IGZ1bmN0aW9uICh3aWR0aCwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgcmV0dXJuICh3aWR0aCB8fCBwYXJzZUludChjb250YWluZXIuc3R5bGUoJ3dpZHRoJyksIDEwKSB8fCA5NjApO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgYXZhaWxhYmxlSGVpZ2h0ID0gZnVuY3Rpb24gKGhlaWdodCwgY29udGFpbmVyLCBtYXJnaW4pIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5tYXgoMCwgVXRpbHMuc2FuaXRpemVIZWlnaHQoaGVpZ2h0LCBjb250YWluZXIpIC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b20pO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgYXZhaWxhYmxlV2lkdGggPSBmdW5jdGlvbiAod2lkdGgsIGNvbnRhaW5lciwgbWFyZ2luKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KDAsIFV0aWxzLnNhbml0aXplV2lkdGgod2lkdGgsIGNvbnRhaW5lcikgLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBndWlkKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIHM0KCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDAwMClcclxuICAgICAgICAgICAgICAgIC50b1N0cmluZygxNilcclxuICAgICAgICAgICAgICAgIC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gczQoKSArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArXHJcbiAgICAgICAgICAgIHM0KCkgKyAnLScgKyBzNCgpICsgczQoKSArIHM0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9wbGFjZXMgdGV4dFN0cmluZyBpbiB0ZXh0T2JqLCBhZGRzIGFuIGVsbGlwc2lzIGlmIHRleHQgY2FuJ3QgZml0IGluIHdpZHRoXHJcbiAgICBzdGF0aWMgcGxhY2VUZXh0V2l0aEVsbGlwc2lzKHRleHREM09iaiwgdGV4dFN0cmluZywgd2lkdGgpe1xyXG4gICAgICAgIHZhciB0ZXh0T2JqID0gdGV4dEQzT2JqLm5vZGUoKTtcclxuICAgICAgICB0ZXh0T2JqLnRleHRDb250ZW50PXRleHRTdHJpbmc7XHJcblxyXG4gICAgICAgIHZhciBtYXJnaW4gPSAwO1xyXG4gICAgICAgIHZhciBlbGxpcHNpc0xlbmd0aCA9IDk7XHJcbiAgICAgICAgLy9lbGxpcHNpcyBpcyBuZWVkZWRcclxuICAgICAgICBpZiAodGV4dE9iai5nZXRDb21wdXRlZFRleHRMZW5ndGgoKT53aWR0aCttYXJnaW4pe1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4PXRleHRTdHJpbmcubGVuZ3RoLTM7eD4wO3gtPTEpe1xyXG4gICAgICAgICAgICAgICAgaWYgKHRleHRPYmouZ2V0U3ViU3RyaW5nTGVuZ3RoKDAseCkrZWxsaXBzaXNMZW5ndGg8PXdpZHRoK21hcmdpbil7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dE9iai50ZXh0Q29udGVudD10ZXh0U3RyaW5nLnN1YnN0cmluZygwLHgpK1wiLi4uXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGV4dE9iai50ZXh0Q29udGVudD1cIi4uLlwiOyAvL2Nhbid0IHBsYWNlIGF0IGFsbFxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBwbGFjZVRleHRXaXRoRWxsaXBzaXNBbmRUb29sdGlwKHRleHREM09iaiwgdGV4dFN0cmluZywgd2lkdGgsIHRvb2x0aXApe1xyXG4gICAgICAgIHZhciBlbGxpcHNpc1BsYWNlZCA9IFV0aWxzLnBsYWNlVGV4dFdpdGhFbGxpcHNpcyh0ZXh0RDNPYmosIHRleHRTdHJpbmcsIHdpZHRoKTtcclxuICAgICAgICBpZihlbGxpcHNpc1BsYWNlZCAmJiB0b29sdGlwKXtcclxuICAgICAgICAgICAgdGV4dEQzT2JqLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICB0b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAuOSk7XHJcbiAgICAgICAgICAgICAgICB0b29sdGlwLmh0bWwodGV4dFN0cmluZylcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRleHREM09iai5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICB0b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0Rm9udFNpemUoZWxlbWVudCl7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoXCJmb250LXNpemVcIik7XHJcbiAgICB9XHJcbn1cclxuIl19
