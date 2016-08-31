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

},{"./utils":32}],20:[function(require,module,exports){
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

},{"./chart":19,"./legend":26,"./scatterplot":29,"./statistics-utils":31,"./utils":32}],21:[function(require,module,exports){
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

},{"./utils":32}],22:[function(require,module,exports){
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

},{"./chart":19,"./heatmap":23,"./statistics-utils":31,"./utils":32}],23:[function(require,module,exports){
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

},{"./chart":19,"./legend":26,"./utils":32}],24:[function(require,module,exports){
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

            plot.histogram = d3.layout.histogram().value(x.value).bins(ticks);
            plot.histogramBins = plot.histogram(this.data);
        }
    }, {
        key: "setupGroupStacks",
        value: function setupGroupStacks() {
            var _this3 = this;

            this.plot.groupingEnabled = this.config.groups && this.config.groups.value;

            this.plot.stack = d3.layout.stack().values(function (d) {
                return d.histogramBins;
            });

            this.plot.groupedData = d3.nest().key(function (d) {
                return _this3.plot.groupingEnabled ? _this3.config.groups.value.call(_this3.config, d) : 'root';
            }).entries(this.data);
            this.plot.groupedData.forEach(function (d) {
                d.histogramBins = _this3.plot.histogram(d.values);
            });
            this.plot.stackedHistograms = this.plot.stack(this.plot.groupedData);
            // console.log('this.plot.groupedData',this.plot.groupedData, 'this.plot.stackedHistograms ',this.plot.stackedHistograms );
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

            console.log(plot.histogramBins, plot.height);

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

},{"./chart":19,"./legend":26,"./utils":32}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Legend = exports.StatisticsUtils = exports.HistogramConfig = exports.Histogram = exports.HeatmapTimeSeriesConfig = exports.HeatmapTimeSeries = exports.HeatmapConfig = exports.Heatmap = exports.RegressionConfig = exports.Regression = exports.CorrelationMatrixConfig = exports.CorrelationMatrix = exports.ScatterPlotMatrixConfig = exports.ScatterPlotMatrix = exports.ScatterPlotConfig = exports.ScatterPlot = undefined;

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

},{"./correlation-matrix":20,"./d3-extensions":21,"./heatmap":23,"./heatmap-timeseries":22,"./histogram":24,"./legend":26,"./regression":27,"./scatterplot":29,"./scatterplot-matrix":28,"./statistics-utils":31}],26:[function(require,module,exports){
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

},{"../bower_components/d3-legend/no-extend":1,"./utils":32}],27:[function(require,module,exports){
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

},{"./chart":19,"./scatterplot":29,"./statistics-utils":31,"./utils":32}],28:[function(require,module,exports){
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

},{"./chart":19,"./legend":26,"./scatterplot":29,"./utils":32}],29:[function(require,module,exports){
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

},{"./chart":19,"./legend":26,"./utils":32}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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

},{"../bower_components/simple-statistics/src/error_function":6,"../bower_components/simple-statistics/src/linear_regression":7,"../bower_components/simple-statistics/src/linear_regression_line":8,"../bower_components/simple-statistics/src/mean":9,"../bower_components/simple-statistics/src/sample_correlation":10,"../bower_components/simple-statistics/src/sample_standard_deviation":12,"../bower_components/simple-statistics/src/standard_deviation":14,"../bower_components/simple-statistics/src/variance":17,"../bower_components/simple-statistics/src/z_score":18,"./statistics-distributions":30}],32:[function(require,module,exports){
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

},{}]},{},[25])(25)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJib3dlcl9jb21wb25lbnRzXFxkMy1sZWdlbmRcXG5vLWV4dGVuZC5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxjb2xvci5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxsZWdlbmQuanMiLCJib3dlcl9jb21wb25lbnRzXFxkMy1sZWdlbmRcXHNyY1xcc2l6ZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXGQzLWxlZ2VuZFxcc3JjXFxzeW1ib2wuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxlcnJvcl9mdW5jdGlvbi5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXGxpbmVhcl9yZWdyZXNzaW9uLmpzIiwiYm93ZXJfY29tcG9uZW50c1xcc2ltcGxlLXN0YXRpc3RpY3NcXHNyY1xcbGluZWFyX3JlZ3Jlc3Npb25fbGluZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXG1lYW4uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfY29ycmVsYXRpb24uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfY292YXJpYW5jZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXHNhbXBsZV9zdGFuZGFyZF9kZXZpYXRpb24uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzYW1wbGVfdmFyaWFuY2UuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzdGFuZGFyZF9kZXZpYXRpb24uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzdW0uanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFxzdW1fbnRoX3Bvd2VyX2RldmlhdGlvbnMuanMiLCJib3dlcl9jb21wb25lbnRzXFxzaW1wbGUtc3RhdGlzdGljc1xcc3JjXFx2YXJpYW5jZS5qcyIsImJvd2VyX2NvbXBvbmVudHNcXHNpbXBsZS1zdGF0aXN0aWNzXFxzcmNcXHpfc2NvcmUuanMiLCJzcmNcXGNoYXJ0LmpzIiwic3JjXFxjb3JyZWxhdGlvbi1tYXRyaXguanMiLCJzcmNcXGQzLWV4dGVuc2lvbnMuanMiLCJzcmNcXGhlYXRtYXAtdGltZXNlcmllcy5qcyIsInNyY1xcaGVhdG1hcC5qcyIsInNyY1xcaGlzdG9ncmFtLmpzIiwic3JjXFxpbmRleC5qcyIsInNyY1xcbGVnZW5kLmpzIiwic3JjXFxyZWdyZXNzaW9uLmpzIiwic3JjXFxzY2F0dGVycGxvdC1tYXRyaXguanMiLCJzcmNcXHNjYXR0ZXJwbG90LmpzIiwic3JjXFxzdGF0aXN0aWNzLWRpc3RyaWJ1dGlvbnMuanMiLCJzcmNcXHN0YXRpc3RpY3MtdXRpbHMuanMiLCJzcmNcXHV0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxPQUFPLE9BQVAsR0FBaUI7QUFDZixTQUFPLFFBQVEsYUFBUixDQURRO0FBRWYsUUFBTSxRQUFRLFlBQVIsQ0FGUztBQUdmLFVBQVEsUUFBUSxjQUFSO0FBSE8sQ0FBakI7Ozs7O0FDQUEsSUFBSSxTQUFTLFFBQVEsVUFBUixDQUFiOztBQUVBLE9BQU8sT0FBUCxHQUFpQixZQUFVOztBQUV6QixNQUFJLFFBQVEsR0FBRyxLQUFILENBQVMsTUFBVCxFQUFaO0FBQUEsTUFDRSxRQUFRLE1BRFY7QUFBQSxNQUVFLGFBQWEsRUFGZjtBQUFBLE1BR0UsY0FBYyxFQUhoQjtBQUFBLE1BSUUsY0FBYyxFQUpoQjtBQUFBLE1BS0UsZUFBZSxDQUxqQjtBQUFBLE1BTUUsUUFBUSxDQUFDLENBQUQsQ0FOVjtBQUFBLE1B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QW5DLENBQVQsSUFBbUQsR0FBM0Q7QUFDSCxDOztBQXZMUSxLLENBeUxGLGUsR0FBa0IsVUFBVSxNQUFWLEVBQWtCLFNBQWxCLEVBQTZCLE1BQTdCLEVBQXFDO0FBQzFELFdBQU8sS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLE1BQU0sY0FBTixDQUFxQixNQUFyQixFQUE2QixTQUE3QixJQUEwQyxPQUFPLEdBQWpELEdBQXVELE9BQU8sTUFBMUUsQ0FBUDtBQUNILEM7O0FBM0xRLEssQ0E2TEYsYyxHQUFpQixVQUFVLEtBQVYsRUFBaUIsU0FBakIsRUFBNEIsTUFBNUIsRUFBb0M7QUFDeEQsV0FBTyxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksTUFBTSxhQUFOLENBQW9CLEtBQXBCLEVBQTJCLFNBQTNCLElBQXdDLE9BQU8sSUFBL0MsR0FBc0QsT0FBTyxLQUF6RSxDQUFQO0FBQ0gsQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICBjb2xvcjogcmVxdWlyZSgnLi9zcmMvY29sb3InKSxcclxuICBzaXplOiByZXF1aXJlKCcuL3NyYy9zaXplJyksXHJcbiAgc3ltYm9sOiByZXF1aXJlKCcuL3NyYy9zeW1ib2wnKVxyXG59O1xyXG4iLCJ2YXIgaGVscGVyID0gcmVxdWlyZSgnLi9sZWdlbmQnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgdmFyIHNjYWxlID0gZDMuc2NhbGUubGluZWFyKCksXHJcbiAgICBzaGFwZSA9IFwicmVjdFwiLFxyXG4gICAgc2hhcGVXaWR0aCA9IDE1LFxyXG4gICAgc2hhcGVIZWlnaHQgPSAxNSxcclxuICAgIHNoYXBlUmFkaXVzID0gMTAsXHJcbiAgICBzaGFwZVBhZGRpbmcgPSAyLFxyXG4gICAgY2VsbHMgPSBbNV0sXHJcbiAgICBsYWJlbHMgPSBbXSxcclxuICAgIGNsYXNzUHJlZml4ID0gXCJcIixcclxuICAgIHVzZUNsYXNzID0gZmFsc2UsXHJcbiAgICB0aXRsZSA9IFwiXCIsXHJcbiAgICBsYWJlbEZvcm1hdCA9IGQzLmZvcm1hdChcIi4wMWZcIiksXHJcbiAgICBsYWJlbE9mZnNldCA9IDEwLFxyXG4gICAgbGFiZWxBbGlnbiA9IFwibWlkZGxlXCIsXHJcbiAgICBsYWJlbERlbGltaXRlciA9IFwidG9cIixcclxuICAgIG9yaWVudCA9IFwidmVydGljYWxcIixcclxuICAgIGFzY2VuZGluZyA9IGZhbHNlLFxyXG4gICAgcGF0aCxcclxuICAgIGxlZ2VuZERpc3BhdGNoZXIgPSBkMy5kaXNwYXRjaChcImNlbGxvdmVyXCIsIFwiY2VsbG91dFwiLCBcImNlbGxjbGlja1wiKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsZWdlbmQoc3ZnKXtcclxuXHJcbiAgICAgIHZhciB0eXBlID0gaGVscGVyLmQzX2NhbGNUeXBlKHNjYWxlLCBhc2NlbmRpbmcsIGNlbGxzLCBsYWJlbHMsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlciksXHJcbiAgICAgICAgbGVnZW5kRyA9IHN2Zy5zZWxlY3RBbGwoJ2cnKS5kYXRhKFtzY2FsZV0pO1xyXG5cclxuICAgICAgbGVnZW5kRy5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgY2xhc3NQcmVmaXggKyAnbGVnZW5kQ2VsbHMnKTtcclxuXHJcblxyXG4gICAgICB2YXIgY2VsbCA9IGxlZ2VuZEcuc2VsZWN0QWxsKFwiLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGxcIikuZGF0YSh0eXBlLmRhdGEpLFxyXG4gICAgICAgIGNlbGxFbnRlciA9IGNlbGwuZW50ZXIoKS5hcHBlbmQoXCJnXCIsIFwiLmNlbGxcIikuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJjZWxsXCIpLnN0eWxlKFwib3BhY2l0eVwiLCAxZS02KSxcclxuICAgICAgICBzaGFwZUVudGVyID0gY2VsbEVudGVyLmFwcGVuZChzaGFwZSkuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJzd2F0Y2hcIiksXHJcbiAgICAgICAgc2hhcGVzID0gY2VsbC5zZWxlY3QoXCJnLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGwgXCIgKyBzaGFwZSk7XHJcblxyXG4gICAgICAvL2FkZCBldmVudCBoYW5kbGVyc1xyXG4gICAgICBoZWxwZXIuZDNfYWRkRXZlbnRzKGNlbGxFbnRlciwgbGVnZW5kRGlzcGF0Y2hlcik7XHJcblxyXG4gICAgICBjZWxsLmV4aXQoKS50cmFuc2l0aW9uKCkuc3R5bGUoXCJvcGFjaXR5XCIsIDApLnJlbW92ZSgpO1xyXG5cclxuICAgICAgaGVscGVyLmQzX2RyYXdTaGFwZXMoc2hhcGUsIHNoYXBlcywgc2hhcGVIZWlnaHQsIHNoYXBlV2lkdGgsIHNoYXBlUmFkaXVzLCBwYXRoKTtcclxuXHJcbiAgICAgIGhlbHBlci5kM19hZGRUZXh0KGxlZ2VuZEcsIGNlbGxFbnRlciwgdHlwZS5sYWJlbHMsIGNsYXNzUHJlZml4KVxyXG5cclxuICAgICAgLy8gc2V0cyBwbGFjZW1lbnRcclxuICAgICAgdmFyIHRleHQgPSBjZWxsLnNlbGVjdChcInRleHRcIiksXHJcbiAgICAgICAgc2hhcGVTaXplID0gc2hhcGVzWzBdLm1hcCggZnVuY3Rpb24oZCl7IHJldHVybiBkLmdldEJCb3goKTsgfSk7XHJcblxyXG4gICAgICAvL3NldHMgc2NhbGVcclxuICAgICAgLy9ldmVyeXRoaW5nIGlzIGZpbGwgZXhjZXB0IGZvciBsaW5lIHdoaWNoIGlzIHN0cm9rZSxcclxuICAgICAgaWYgKCF1c2VDbGFzcyl7XHJcbiAgICAgICAgaWYgKHNoYXBlID09IFwibGluZVwiKXtcclxuICAgICAgICAgIHNoYXBlcy5zdHlsZShcInN0cm9rZVwiLCB0eXBlLmZlYXR1cmUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzaGFwZXMuc3R5bGUoXCJmaWxsXCIsIHR5cGUuZmVhdHVyZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNoYXBlcy5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCl7IHJldHVybiBjbGFzc1ByZWZpeCArIFwic3dhdGNoIFwiICsgdHlwZS5mZWF0dXJlKGQpOyB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGNlbGxUcmFucyxcclxuICAgICAgdGV4dFRyYW5zLFxyXG4gICAgICB0ZXh0QWxpZ24gPSAobGFiZWxBbGlnbiA9PSBcInN0YXJ0XCIpID8gMCA6IChsYWJlbEFsaWduID09IFwibWlkZGxlXCIpID8gMC41IDogMTtcclxuXHJcbiAgICAgIC8vcG9zaXRpb25zIGNlbGxzIGFuZCB0ZXh0XHJcbiAgICAgIGlmIChvcmllbnQgPT09IFwidmVydGljYWxcIil7XHJcbiAgICAgICAgY2VsbFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZSgwLCBcIiArIChpICogKHNoYXBlU2l6ZVtpXS5oZWlnaHQgKyBzaGFwZVBhZGRpbmcpKSArIFwiKVwiOyB9O1xyXG4gICAgICAgIHRleHRUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAoc2hhcGVTaXplW2ldLndpZHRoICsgc2hhcGVTaXplW2ldLnggK1xyXG4gICAgICAgICAgbGFiZWxPZmZzZXQpICsgXCIsXCIgKyAoc2hhcGVTaXplW2ldLnkgKyBzaGFwZVNpemVbaV0uaGVpZ2h0LzIgKyA1KSArIFwiKVwiOyB9O1xyXG5cclxuICAgICAgfSBlbHNlIGlmIChvcmllbnQgPT09IFwiaG9yaXpvbnRhbFwiKXtcclxuICAgICAgICBjZWxsVHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKGkgKiAoc2hhcGVTaXplW2ldLndpZHRoICsgc2hhcGVQYWRkaW5nKSkgKyBcIiwwKVwiOyB9XHJcbiAgICAgICAgdGV4dFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIChzaGFwZVNpemVbaV0ud2lkdGgqdGV4dEFsaWduICArIHNoYXBlU2l6ZVtpXS54KSArXHJcbiAgICAgICAgICBcIixcIiArIChzaGFwZVNpemVbaV0uaGVpZ2h0ICsgc2hhcGVTaXplW2ldLnkgKyBsYWJlbE9mZnNldCArIDgpICsgXCIpXCI7IH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGhlbHBlci5kM19wbGFjZW1lbnQob3JpZW50LCBjZWxsLCBjZWxsVHJhbnMsIHRleHQsIHRleHRUcmFucywgbGFiZWxBbGlnbik7XHJcbiAgICAgIGhlbHBlci5kM190aXRsZShzdmcsIGxlZ2VuZEcsIHRpdGxlLCBjbGFzc1ByZWZpeCk7XHJcblxyXG4gICAgICBjZWxsLnRyYW5zaXRpb24oKS5zdHlsZShcIm9wYWNpdHlcIiwgMSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gIGxlZ2VuZC5zY2FsZSA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNjYWxlO1xyXG4gICAgc2NhbGUgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuY2VsbHMgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBjZWxscztcclxuICAgIGlmIChfLmxlbmd0aCA+IDEgfHwgXyA+PSAyICl7XHJcbiAgICAgIGNlbGxzID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlID0gZnVuY3Rpb24oXywgZCkge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGU7XHJcbiAgICBpZiAoXyA9PSBcInJlY3RcIiB8fCBfID09IFwiY2lyY2xlXCIgfHwgXyA9PSBcImxpbmVcIiB8fCAoXyA9PSBcInBhdGhcIiAmJiAodHlwZW9mIGQgPT09ICdzdHJpbmcnKSkgKXtcclxuICAgICAgc2hhcGUgPSBfO1xyXG4gICAgICBwYXRoID0gZDtcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlV2lkdGggPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZVdpZHRoO1xyXG4gICAgc2hhcGVXaWR0aCA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuc2hhcGVIZWlnaHQgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZUhlaWdodDtcclxuICAgIHNoYXBlSGVpZ2h0ID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5zaGFwZVJhZGl1cyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlUmFkaXVzO1xyXG4gICAgc2hhcGVSYWRpdXMgPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlUGFkZGluZyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlUGFkZGluZztcclxuICAgIHNoYXBlUGFkZGluZyA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxzID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxzO1xyXG4gICAgbGFiZWxzID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsQWxpZ24gPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbEFsaWduO1xyXG4gICAgaWYgKF8gPT0gXCJzdGFydFwiIHx8IF8gPT0gXCJlbmRcIiB8fCBfID09IFwibWlkZGxlXCIpIHtcclxuICAgICAgbGFiZWxBbGlnbiA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbEZvcm1hdCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsRm9ybWF0O1xyXG4gICAgbGFiZWxGb3JtYXQgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxPZmZzZXQgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbE9mZnNldDtcclxuICAgIGxhYmVsT2Zmc2V0ID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbERlbGltaXRlciA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsRGVsaW1pdGVyO1xyXG4gICAgbGFiZWxEZWxpbWl0ZXIgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQudXNlQ2xhc3MgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB1c2VDbGFzcztcclxuICAgIGlmIChfID09PSB0cnVlIHx8IF8gPT09IGZhbHNlKXtcclxuICAgICAgdXNlQ2xhc3MgPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQub3JpZW50ID0gZnVuY3Rpb24oXyl7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBvcmllbnQ7XHJcbiAgICBfID0gXy50b0xvd2VyQ2FzZSgpO1xyXG4gICAgaWYgKF8gPT0gXCJob3Jpem9udGFsXCIgfHwgXyA9PSBcInZlcnRpY2FsXCIpIHtcclxuICAgICAgb3JpZW50ID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmFzY2VuZGluZyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGFzY2VuZGluZztcclxuICAgIGFzY2VuZGluZyA9ICEhXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmNsYXNzUHJlZml4ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY2xhc3NQcmVmaXg7XHJcbiAgICBjbGFzc1ByZWZpeCA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC50aXRsZSA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHRpdGxlO1xyXG4gICAgdGl0bGUgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBkMy5yZWJpbmQobGVnZW5kLCBsZWdlbmREaXNwYXRjaGVyLCBcIm9uXCIpO1xyXG5cclxuICByZXR1cm4gbGVnZW5kO1xyXG5cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gIGQzX2lkZW50aXR5OiBmdW5jdGlvbiAoZCkge1xyXG4gICAgcmV0dXJuIGQ7XHJcbiAgfSxcclxuXHJcbiAgZDNfbWVyZ2VMYWJlbHM6IGZ1bmN0aW9uIChnZW4sIGxhYmVscykge1xyXG5cclxuICAgICAgaWYobGFiZWxzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGdlbjtcclxuXHJcbiAgICAgIGdlbiA9IChnZW4pID8gZ2VuIDogW107XHJcblxyXG4gICAgICB2YXIgaSA9IGxhYmVscy5sZW5ndGg7XHJcbiAgICAgIGZvciAoOyBpIDwgZ2VuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGFiZWxzLnB1c2goZ2VuW2ldKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbGFiZWxzO1xyXG4gICAgfSxcclxuXHJcbiAgZDNfbGluZWFyTGVnZW5kOiBmdW5jdGlvbiAoc2NhbGUsIGNlbGxzLCBsYWJlbEZvcm1hdCkge1xyXG4gICAgdmFyIGRhdGEgPSBbXTtcclxuXHJcbiAgICBpZiAoY2VsbHMubGVuZ3RoID4gMSl7XHJcbiAgICAgIGRhdGEgPSBjZWxscztcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgZG9tYWluID0gc2NhbGUuZG9tYWluKCksXHJcbiAgICAgIGluY3JlbWVudCA9IChkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdIC0gZG9tYWluWzBdKS8oY2VsbHMgLSAxKSxcclxuICAgICAgaSA9IDA7XHJcblxyXG4gICAgICBmb3IgKDsgaSA8IGNlbGxzOyBpKyspe1xyXG4gICAgICAgIGRhdGEucHVzaChkb21haW5bMF0gKyBpKmluY3JlbWVudCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgbGFiZWxzID0gZGF0YS5tYXAobGFiZWxGb3JtYXQpO1xyXG5cclxuICAgIHJldHVybiB7ZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgbGFiZWxzOiBsYWJlbHMsXHJcbiAgICAgICAgICAgIGZlYXR1cmU6IGZ1bmN0aW9uKGQpeyByZXR1cm4gc2NhbGUoZCk7IH19O1xyXG4gIH0sXHJcblxyXG4gIGQzX3F1YW50TGVnZW5kOiBmdW5jdGlvbiAoc2NhbGUsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlcikge1xyXG4gICAgdmFyIGxhYmVscyA9IHNjYWxlLnJhbmdlKCkubWFwKGZ1bmN0aW9uKGQpe1xyXG4gICAgICB2YXIgaW52ZXJ0ID0gc2NhbGUuaW52ZXJ0RXh0ZW50KGQpLFxyXG4gICAgICBhID0gbGFiZWxGb3JtYXQoaW52ZXJ0WzBdKSxcclxuICAgICAgYiA9IGxhYmVsRm9ybWF0KGludmVydFsxXSk7XHJcblxyXG4gICAgICAvLyBpZiAoKCAoYSkgJiYgKGEuaXNOYW4oKSkgJiYgYil7XHJcbiAgICAgIC8vICAgY29uc29sZS5sb2coXCJpbiBpbml0aWFsIHN0YXRlbWVudFwiKVxyXG4gICAgICAgIHJldHVybiBsYWJlbEZvcm1hdChpbnZlcnRbMF0pICsgXCIgXCIgKyBsYWJlbERlbGltaXRlciArIFwiIFwiICsgbGFiZWxGb3JtYXQoaW52ZXJ0WzFdKTtcclxuICAgICAgLy8gfSBlbHNlIGlmIChhIHx8IGIpIHtcclxuICAgICAgLy8gICBjb25zb2xlLmxvZygnaW4gZWxzZSBzdGF0ZW1lbnQnKVxyXG4gICAgICAvLyAgIHJldHVybiAoYSkgPyBhIDogYjtcclxuICAgICAgLy8gfVxyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7ZGF0YTogc2NhbGUucmFuZ2UoKSxcclxuICAgICAgICAgICAgbGFiZWxzOiBsYWJlbHMsXHJcbiAgICAgICAgICAgIGZlYXR1cmU6IHRoaXMuZDNfaWRlbnRpdHlcclxuICAgICAgICAgIH07XHJcbiAgfSxcclxuXHJcbiAgZDNfb3JkaW5hbExlZ2VuZDogZnVuY3Rpb24gKHNjYWxlKSB7XHJcbiAgICByZXR1cm4ge2RhdGE6IHNjYWxlLmRvbWFpbigpLFxyXG4gICAgICAgICAgICBsYWJlbHM6IHNjYWxlLmRvbWFpbigpLFxyXG4gICAgICAgICAgICBmZWF0dXJlOiBmdW5jdGlvbihkKXsgcmV0dXJuIHNjYWxlKGQpOyB9fTtcclxuICB9LFxyXG5cclxuICBkM19kcmF3U2hhcGVzOiBmdW5jdGlvbiAoc2hhcGUsIHNoYXBlcywgc2hhcGVIZWlnaHQsIHNoYXBlV2lkdGgsIHNoYXBlUmFkaXVzLCBwYXRoKSB7XHJcbiAgICBpZiAoc2hhcGUgPT09IFwicmVjdFwiKXtcclxuICAgICAgICBzaGFwZXMuYXR0cihcImhlaWdodFwiLCBzaGFwZUhlaWdodCkuYXR0cihcIndpZHRoXCIsIHNoYXBlV2lkdGgpO1xyXG5cclxuICAgIH0gZWxzZSBpZiAoc2hhcGUgPT09IFwiY2lyY2xlXCIpIHtcclxuICAgICAgICBzaGFwZXMuYXR0cihcInJcIiwgc2hhcGVSYWRpdXMpLy8uYXR0cihcImN4XCIsIHNoYXBlUmFkaXVzKS5hdHRyKFwiY3lcIiwgc2hhcGVSYWRpdXMpO1xyXG5cclxuICAgIH0gZWxzZSBpZiAoc2hhcGUgPT09IFwibGluZVwiKSB7XHJcbiAgICAgICAgc2hhcGVzLmF0dHIoXCJ4MVwiLCAwKS5hdHRyKFwieDJcIiwgc2hhcGVXaWR0aCkuYXR0cihcInkxXCIsIDApLmF0dHIoXCJ5MlwiLCAwKTtcclxuXHJcbiAgICB9IGVsc2UgaWYgKHNoYXBlID09PSBcInBhdGhcIikge1xyXG4gICAgICBzaGFwZXMuYXR0cihcImRcIiwgcGF0aCk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZDNfYWRkVGV4dDogZnVuY3Rpb24gKHN2ZywgZW50ZXIsIGxhYmVscywgY2xhc3NQcmVmaXgpe1xyXG4gICAgZW50ZXIuYXBwZW5kKFwidGV4dFwiKS5hdHRyKFwiY2xhc3NcIiwgY2xhc3NQcmVmaXggKyBcImxhYmVsXCIpO1xyXG4gICAgc3ZnLnNlbGVjdEFsbChcImcuXCIgKyBjbGFzc1ByZWZpeCArIFwiY2VsbCB0ZXh0XCIpLmRhdGEobGFiZWxzKS50ZXh0KHRoaXMuZDNfaWRlbnRpdHkpO1xyXG4gIH0sXHJcblxyXG4gIGQzX2NhbGNUeXBlOiBmdW5jdGlvbiAoc2NhbGUsIGFzY2VuZGluZywgY2VsbHMsIGxhYmVscywgbGFiZWxGb3JtYXQsIGxhYmVsRGVsaW1pdGVyKXtcclxuICAgIHZhciB0eXBlID0gc2NhbGUudGlja3MgP1xyXG4gICAgICAgICAgICB0aGlzLmQzX2xpbmVhckxlZ2VuZChzY2FsZSwgY2VsbHMsIGxhYmVsRm9ybWF0KSA6IHNjYWxlLmludmVydEV4dGVudCA/XHJcbiAgICAgICAgICAgIHRoaXMuZDNfcXVhbnRMZWdlbmQoc2NhbGUsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlcikgOiB0aGlzLmQzX29yZGluYWxMZWdlbmQoc2NhbGUpO1xyXG5cclxuICAgIHR5cGUubGFiZWxzID0gdGhpcy5kM19tZXJnZUxhYmVscyh0eXBlLmxhYmVscywgbGFiZWxzKTtcclxuXHJcbiAgICBpZiAoYXNjZW5kaW5nKSB7XHJcbiAgICAgIHR5cGUubGFiZWxzID0gdGhpcy5kM19yZXZlcnNlKHR5cGUubGFiZWxzKTtcclxuICAgICAgdHlwZS5kYXRhID0gdGhpcy5kM19yZXZlcnNlKHR5cGUuZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHR5cGU7XHJcbiAgfSxcclxuXHJcbiAgZDNfcmV2ZXJzZTogZnVuY3Rpb24oYXJyKSB7XHJcbiAgICB2YXIgbWlycm9yID0gW107XHJcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGFyci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgbWlycm9yW2ldID0gYXJyW2wtaS0xXTtcclxuICAgIH1cclxuICAgIHJldHVybiBtaXJyb3I7XHJcbiAgfSxcclxuXHJcbiAgZDNfcGxhY2VtZW50OiBmdW5jdGlvbiAob3JpZW50LCBjZWxsLCBjZWxsVHJhbnMsIHRleHQsIHRleHRUcmFucywgbGFiZWxBbGlnbikge1xyXG4gICAgY2VsbC5hdHRyKFwidHJhbnNmb3JtXCIsIGNlbGxUcmFucyk7XHJcbiAgICB0ZXh0LmF0dHIoXCJ0cmFuc2Zvcm1cIiwgdGV4dFRyYW5zKTtcclxuICAgIGlmIChvcmllbnQgPT09IFwiaG9yaXpvbnRhbFwiKXtcclxuICAgICAgdGV4dC5zdHlsZShcInRleHQtYW5jaG9yXCIsIGxhYmVsQWxpZ24pO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGQzX2FkZEV2ZW50czogZnVuY3Rpb24oY2VsbHMsIGRpc3BhdGNoZXIpe1xyXG4gICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgY2VsbHMub24oXCJtb3VzZW92ZXIubGVnZW5kXCIsIGZ1bmN0aW9uIChkKSB7IF8uZDNfY2VsbE92ZXIoZGlzcGF0Y2hlciwgZCwgdGhpcyk7IH0pXHJcbiAgICAgICAgICAub24oXCJtb3VzZW91dC5sZWdlbmRcIiwgZnVuY3Rpb24gKGQpIHsgXy5kM19jZWxsT3V0KGRpc3BhdGNoZXIsIGQsIHRoaXMpOyB9KVxyXG4gICAgICAgICAgLm9uKFwiY2xpY2subGVnZW5kXCIsIGZ1bmN0aW9uIChkKSB7IF8uZDNfY2VsbENsaWNrKGRpc3BhdGNoZXIsIGQsIHRoaXMpOyB9KTtcclxuICB9LFxyXG5cclxuICBkM19jZWxsT3ZlcjogZnVuY3Rpb24oY2VsbERpc3BhdGNoZXIsIGQsIG9iail7XHJcbiAgICBjZWxsRGlzcGF0Y2hlci5jZWxsb3Zlci5jYWxsKG9iaiwgZCk7XHJcbiAgfSxcclxuXHJcbiAgZDNfY2VsbE91dDogZnVuY3Rpb24oY2VsbERpc3BhdGNoZXIsIGQsIG9iail7XHJcbiAgICBjZWxsRGlzcGF0Y2hlci5jZWxsb3V0LmNhbGwob2JqLCBkKTtcclxuICB9LFxyXG5cclxuICBkM19jZWxsQ2xpY2s6IGZ1bmN0aW9uKGNlbGxEaXNwYXRjaGVyLCBkLCBvYmope1xyXG4gICAgY2VsbERpc3BhdGNoZXIuY2VsbGNsaWNrLmNhbGwob2JqLCBkKTtcclxuICB9LFxyXG5cclxuICBkM190aXRsZTogZnVuY3Rpb24oc3ZnLCBjZWxsc1N2ZywgdGl0bGUsIGNsYXNzUHJlZml4KXtcclxuICAgIGlmICh0aXRsZSAhPT0gXCJcIil7XHJcblxyXG4gICAgICB2YXIgdGl0bGVUZXh0ID0gc3ZnLnNlbGVjdEFsbCgndGV4dC4nICsgY2xhc3NQcmVmaXggKyAnbGVnZW5kVGl0bGUnKTtcclxuXHJcbiAgICAgIHRpdGxlVGV4dC5kYXRhKFt0aXRsZV0pXHJcbiAgICAgICAgLmVudGVyKClcclxuICAgICAgICAuYXBwZW5kKCd0ZXh0JylcclxuICAgICAgICAuYXR0cignY2xhc3MnLCBjbGFzc1ByZWZpeCArICdsZWdlbmRUaXRsZScpO1xyXG5cclxuICAgICAgICBzdmcuc2VsZWN0QWxsKCd0ZXh0LicgKyBjbGFzc1ByZWZpeCArICdsZWdlbmRUaXRsZScpXHJcbiAgICAgICAgICAgIC50ZXh0KHRpdGxlKVxyXG5cclxuICAgICAgdmFyIHlPZmZzZXQgPSBzdmcuc2VsZWN0KCcuJyArIGNsYXNzUHJlZml4ICsgJ2xlZ2VuZFRpdGxlJylcclxuICAgICAgICAgIC5tYXAoZnVuY3Rpb24oZCkgeyByZXR1cm4gZFswXS5nZXRCQm94KCkuaGVpZ2h0fSlbMF0sXHJcbiAgICAgIHhPZmZzZXQgPSAtY2VsbHNTdmcubWFwKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRbMF0uZ2V0QkJveCgpLnh9KVswXTtcclxuXHJcbiAgICAgIGNlbGxzU3ZnLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIHhPZmZzZXQgKyAnLCcgKyAoeU9mZnNldCArIDEwKSArICcpJyk7XHJcblxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJ2YXIgaGVscGVyID0gcmVxdWlyZSgnLi9sZWdlbmQnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gIGZ1bmN0aW9uKCl7XHJcblxyXG4gIHZhciBzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLFxyXG4gICAgc2hhcGUgPSBcInJlY3RcIixcclxuICAgIHNoYXBlV2lkdGggPSAxNSxcclxuICAgIHNoYXBlUGFkZGluZyA9IDIsXHJcbiAgICBjZWxscyA9IFs1XSxcclxuICAgIGxhYmVscyA9IFtdLFxyXG4gICAgdXNlU3Ryb2tlID0gZmFsc2UsXHJcbiAgICBjbGFzc1ByZWZpeCA9IFwiXCIsXHJcbiAgICB0aXRsZSA9IFwiXCIsXHJcbiAgICBsYWJlbEZvcm1hdCA9IGQzLmZvcm1hdChcIi4wMWZcIiksXHJcbiAgICBsYWJlbE9mZnNldCA9IDEwLFxyXG4gICAgbGFiZWxBbGlnbiA9IFwibWlkZGxlXCIsXHJcbiAgICBsYWJlbERlbGltaXRlciA9IFwidG9cIixcclxuICAgIG9yaWVudCA9IFwidmVydGljYWxcIixcclxuICAgIGFzY2VuZGluZyA9IGZhbHNlLFxyXG4gICAgcGF0aCxcclxuICAgIGxlZ2VuZERpc3BhdGNoZXIgPSBkMy5kaXNwYXRjaChcImNlbGxvdmVyXCIsIFwiY2VsbG91dFwiLCBcImNlbGxjbGlja1wiKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsZWdlbmQoc3ZnKXtcclxuXHJcbiAgICAgIHZhciB0eXBlID0gaGVscGVyLmQzX2NhbGNUeXBlKHNjYWxlLCBhc2NlbmRpbmcsIGNlbGxzLCBsYWJlbHMsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlciksXHJcbiAgICAgICAgbGVnZW5kRyA9IHN2Zy5zZWxlY3RBbGwoJ2cnKS5kYXRhKFtzY2FsZV0pO1xyXG5cclxuICAgICAgbGVnZW5kRy5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgY2xhc3NQcmVmaXggKyAnbGVnZW5kQ2VsbHMnKTtcclxuXHJcblxyXG4gICAgICB2YXIgY2VsbCA9IGxlZ2VuZEcuc2VsZWN0QWxsKFwiLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGxcIikuZGF0YSh0eXBlLmRhdGEpLFxyXG4gICAgICAgIGNlbGxFbnRlciA9IGNlbGwuZW50ZXIoKS5hcHBlbmQoXCJnXCIsIFwiLmNlbGxcIikuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJjZWxsXCIpLnN0eWxlKFwib3BhY2l0eVwiLCAxZS02KSxcclxuICAgICAgICBzaGFwZUVudGVyID0gY2VsbEVudGVyLmFwcGVuZChzaGFwZSkuYXR0cihcImNsYXNzXCIsIGNsYXNzUHJlZml4ICsgXCJzd2F0Y2hcIiksXHJcbiAgICAgICAgc2hhcGVzID0gY2VsbC5zZWxlY3QoXCJnLlwiICsgY2xhc3NQcmVmaXggKyBcImNlbGwgXCIgKyBzaGFwZSk7XHJcblxyXG4gICAgICAvL2FkZCBldmVudCBoYW5kbGVyc1xyXG4gICAgICBoZWxwZXIuZDNfYWRkRXZlbnRzKGNlbGxFbnRlciwgbGVnZW5kRGlzcGF0Y2hlcik7XHJcblxyXG4gICAgICBjZWxsLmV4aXQoKS50cmFuc2l0aW9uKCkuc3R5bGUoXCJvcGFjaXR5XCIsIDApLnJlbW92ZSgpO1xyXG5cclxuICAgICAgLy9jcmVhdGVzIHNoYXBlXHJcbiAgICAgIGlmIChzaGFwZSA9PT0gXCJsaW5lXCIpe1xyXG4gICAgICAgIGhlbHBlci5kM19kcmF3U2hhcGVzKHNoYXBlLCBzaGFwZXMsIDAsIHNoYXBlV2lkdGgpO1xyXG4gICAgICAgIHNoYXBlcy5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIHR5cGUuZmVhdHVyZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaGVscGVyLmQzX2RyYXdTaGFwZXMoc2hhcGUsIHNoYXBlcywgdHlwZS5mZWF0dXJlLCB0eXBlLmZlYXR1cmUsIHR5cGUuZmVhdHVyZSwgcGF0aCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGhlbHBlci5kM19hZGRUZXh0KGxlZ2VuZEcsIGNlbGxFbnRlciwgdHlwZS5sYWJlbHMsIGNsYXNzUHJlZml4KVxyXG5cclxuICAgICAgLy9zZXRzIHBsYWNlbWVudFxyXG4gICAgICB2YXIgdGV4dCA9IGNlbGwuc2VsZWN0KFwidGV4dFwiKSxcclxuICAgICAgICBzaGFwZVNpemUgPSBzaGFwZXNbMF0ubWFwKFxyXG4gICAgICAgICAgZnVuY3Rpb24oZCwgaSl7XHJcbiAgICAgICAgICAgIHZhciBiYm94ID0gZC5nZXRCQm94KClcclxuICAgICAgICAgICAgdmFyIHN0cm9rZSA9IHNjYWxlKHR5cGUuZGF0YVtpXSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2hhcGUgPT09IFwibGluZVwiICYmIG9yaWVudCA9PT0gXCJob3Jpem9udGFsXCIpIHtcclxuICAgICAgICAgICAgICBiYm94LmhlaWdodCA9IGJib3guaGVpZ2h0ICsgc3Ryb2tlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNoYXBlID09PSBcImxpbmVcIiAmJiBvcmllbnQgPT09IFwidmVydGljYWxcIil7XHJcbiAgICAgICAgICAgICAgYmJveC53aWR0aCA9IGJib3gud2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBiYm94O1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgdmFyIG1heEggPSBkMy5tYXgoc2hhcGVTaXplLCBmdW5jdGlvbihkKXsgcmV0dXJuIGQuaGVpZ2h0ICsgZC55OyB9KSxcclxuICAgICAgbWF4VyA9IGQzLm1heChzaGFwZVNpemUsIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC53aWR0aCArIGQueDsgfSk7XHJcblxyXG4gICAgICB2YXIgY2VsbFRyYW5zLFxyXG4gICAgICB0ZXh0VHJhbnMsXHJcbiAgICAgIHRleHRBbGlnbiA9IChsYWJlbEFsaWduID09IFwic3RhcnRcIikgPyAwIDogKGxhYmVsQWxpZ24gPT0gXCJtaWRkbGVcIikgPyAwLjUgOiAxO1xyXG5cclxuICAgICAgLy9wb3NpdGlvbnMgY2VsbHMgYW5kIHRleHRcclxuICAgICAgaWYgKG9yaWVudCA9PT0gXCJ2ZXJ0aWNhbFwiKXtcclxuXHJcbiAgICAgICAgY2VsbFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSBkMy5zdW0oc2hhcGVTaXplLnNsaWNlKDAsIGkgKyAxICksIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC5oZWlnaHQ7IH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoMCwgXCIgKyAoaGVpZ2h0ICsgaSpzaGFwZVBhZGRpbmcpICsgXCIpXCI7IH07XHJcblxyXG4gICAgICAgIHRleHRUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAobWF4VyArIGxhYmVsT2Zmc2V0KSArIFwiLFwiICtcclxuICAgICAgICAgIChzaGFwZVNpemVbaV0ueSArIHNoYXBlU2l6ZVtpXS5oZWlnaHQvMiArIDUpICsgXCIpXCI7IH07XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKG9yaWVudCA9PT0gXCJob3Jpem9udGFsXCIpe1xyXG4gICAgICAgIGNlbGxUcmFucyA9IGZ1bmN0aW9uKGQsaSkge1xyXG4gICAgICAgICAgICB2YXIgd2lkdGggPSBkMy5zdW0oc2hhcGVTaXplLnNsaWNlKDAsIGkgKyAxICksIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC53aWR0aDsgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArICh3aWR0aCArIGkqc2hhcGVQYWRkaW5nKSArIFwiLDApXCI7IH07XHJcblxyXG4gICAgICAgIHRleHRUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAoc2hhcGVTaXplW2ldLndpZHRoKnRleHRBbGlnbiAgKyBzaGFwZVNpemVbaV0ueCkgKyBcIixcIiArXHJcbiAgICAgICAgICAgICAgKG1heEggKyBsYWJlbE9mZnNldCApICsgXCIpXCI7IH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGhlbHBlci5kM19wbGFjZW1lbnQob3JpZW50LCBjZWxsLCBjZWxsVHJhbnMsIHRleHQsIHRleHRUcmFucywgbGFiZWxBbGlnbik7XHJcbiAgICAgIGhlbHBlci5kM190aXRsZShzdmcsIGxlZ2VuZEcsIHRpdGxlLCBjbGFzc1ByZWZpeCk7XHJcblxyXG4gICAgICBjZWxsLnRyYW5zaXRpb24oKS5zdHlsZShcIm9wYWNpdHlcIiwgMSk7XHJcblxyXG4gICAgfVxyXG5cclxuICBsZWdlbmQuc2NhbGUgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzY2FsZTtcclxuICAgIHNjYWxlID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmNlbGxzID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY2VsbHM7XHJcbiAgICBpZiAoXy5sZW5ndGggPiAxIHx8IF8gPj0gMiApe1xyXG4gICAgICBjZWxscyA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG5cclxuICBsZWdlbmQuc2hhcGUgPSBmdW5jdGlvbihfLCBkKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzaGFwZTtcclxuICAgIGlmIChfID09IFwicmVjdFwiIHx8IF8gPT0gXCJjaXJjbGVcIiB8fCBfID09IFwibGluZVwiICl7XHJcbiAgICAgIHNoYXBlID0gXztcclxuICAgICAgcGF0aCA9IGQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5zaGFwZVdpZHRoID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGVXaWR0aDtcclxuICAgIHNoYXBlV2lkdGggPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnNoYXBlUGFkZGluZyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNoYXBlUGFkZGluZztcclxuICAgIHNoYXBlUGFkZGluZyA9ICtfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxzID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxzO1xyXG4gICAgbGFiZWxzID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsQWxpZ24gPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbEFsaWduO1xyXG4gICAgaWYgKF8gPT0gXCJzdGFydFwiIHx8IF8gPT0gXCJlbmRcIiB8fCBfID09IFwibWlkZGxlXCIpIHtcclxuICAgICAgbGFiZWxBbGlnbiA9IF87XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbEZvcm1hdCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsRm9ybWF0O1xyXG4gICAgbGFiZWxGb3JtYXQgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxPZmZzZXQgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbE9mZnNldDtcclxuICAgIGxhYmVsT2Zmc2V0ID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbERlbGltaXRlciA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsRGVsaW1pdGVyO1xyXG4gICAgbGFiZWxEZWxpbWl0ZXIgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQub3JpZW50ID0gZnVuY3Rpb24oXyl7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBvcmllbnQ7XHJcbiAgICBfID0gXy50b0xvd2VyQ2FzZSgpO1xyXG4gICAgaWYgKF8gPT0gXCJob3Jpem9udGFsXCIgfHwgXyA9PSBcInZlcnRpY2FsXCIpIHtcclxuICAgICAgb3JpZW50ID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmFzY2VuZGluZyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGFzY2VuZGluZztcclxuICAgIGFzY2VuZGluZyA9ICEhXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmNsYXNzUHJlZml4ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY2xhc3NQcmVmaXg7XHJcbiAgICBjbGFzc1ByZWZpeCA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC50aXRsZSA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHRpdGxlO1xyXG4gICAgdGl0bGUgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBkMy5yZWJpbmQobGVnZW5kLCBsZWdlbmREaXNwYXRjaGVyLCBcIm9uXCIpO1xyXG5cclxuICByZXR1cm4gbGVnZW5kO1xyXG5cclxufTtcclxuIiwidmFyIGhlbHBlciA9IHJlcXVpcmUoJy4vbGVnZW5kJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XHJcblxyXG4gIHZhciBzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLFxyXG4gICAgc2hhcGUgPSBcInBhdGhcIixcclxuICAgIHNoYXBlV2lkdGggPSAxNSxcclxuICAgIHNoYXBlSGVpZ2h0ID0gMTUsXHJcbiAgICBzaGFwZVJhZGl1cyA9IDEwLFxyXG4gICAgc2hhcGVQYWRkaW5nID0gNSxcclxuICAgIGNlbGxzID0gWzVdLFxyXG4gICAgbGFiZWxzID0gW10sXHJcbiAgICBjbGFzc1ByZWZpeCA9IFwiXCIsXHJcbiAgICB1c2VDbGFzcyA9IGZhbHNlLFxyXG4gICAgdGl0bGUgPSBcIlwiLFxyXG4gICAgbGFiZWxGb3JtYXQgPSBkMy5mb3JtYXQoXCIuMDFmXCIpLFxyXG4gICAgbGFiZWxBbGlnbiA9IFwibWlkZGxlXCIsXHJcbiAgICBsYWJlbE9mZnNldCA9IDEwLFxyXG4gICAgbGFiZWxEZWxpbWl0ZXIgPSBcInRvXCIsXHJcbiAgICBvcmllbnQgPSBcInZlcnRpY2FsXCIsXHJcbiAgICBhc2NlbmRpbmcgPSBmYWxzZSxcclxuICAgIGxlZ2VuZERpc3BhdGNoZXIgPSBkMy5kaXNwYXRjaChcImNlbGxvdmVyXCIsIFwiY2VsbG91dFwiLCBcImNlbGxjbGlja1wiKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsZWdlbmQoc3ZnKXtcclxuXHJcbiAgICAgIHZhciB0eXBlID0gaGVscGVyLmQzX2NhbGNUeXBlKHNjYWxlLCBhc2NlbmRpbmcsIGNlbGxzLCBsYWJlbHMsIGxhYmVsRm9ybWF0LCBsYWJlbERlbGltaXRlciksXHJcbiAgICAgICAgbGVnZW5kRyA9IHN2Zy5zZWxlY3RBbGwoJ2cnKS5kYXRhKFtzY2FsZV0pO1xyXG5cclxuICAgICAgbGVnZW5kRy5lbnRlcigpLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgY2xhc3NQcmVmaXggKyAnbGVnZW5kQ2VsbHMnKTtcclxuXHJcbiAgICAgIHZhciBjZWxsID0gbGVnZW5kRy5zZWxlY3RBbGwoXCIuXCIgKyBjbGFzc1ByZWZpeCArIFwiY2VsbFwiKS5kYXRhKHR5cGUuZGF0YSksXHJcbiAgICAgICAgY2VsbEVudGVyID0gY2VsbC5lbnRlcigpLmFwcGVuZChcImdcIiwgXCIuY2VsbFwiKS5hdHRyKFwiY2xhc3NcIiwgY2xhc3NQcmVmaXggKyBcImNlbGxcIikuc3R5bGUoXCJvcGFjaXR5XCIsIDFlLTYpLFxyXG4gICAgICAgIHNoYXBlRW50ZXIgPSBjZWxsRW50ZXIuYXBwZW5kKHNoYXBlKS5hdHRyKFwiY2xhc3NcIiwgY2xhc3NQcmVmaXggKyBcInN3YXRjaFwiKSxcclxuICAgICAgICBzaGFwZXMgPSBjZWxsLnNlbGVjdChcImcuXCIgKyBjbGFzc1ByZWZpeCArIFwiY2VsbCBcIiArIHNoYXBlKTtcclxuXHJcbiAgICAgIC8vYWRkIGV2ZW50IGhhbmRsZXJzXHJcbiAgICAgIGhlbHBlci5kM19hZGRFdmVudHMoY2VsbEVudGVyLCBsZWdlbmREaXNwYXRjaGVyKTtcclxuXHJcbiAgICAgIC8vcmVtb3ZlIG9sZCBzaGFwZXNcclxuICAgICAgY2VsbC5leGl0KCkudHJhbnNpdGlvbigpLnN0eWxlKFwib3BhY2l0eVwiLCAwKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgIGhlbHBlci5kM19kcmF3U2hhcGVzKHNoYXBlLCBzaGFwZXMsIHNoYXBlSGVpZ2h0LCBzaGFwZVdpZHRoLCBzaGFwZVJhZGl1cywgdHlwZS5mZWF0dXJlKTtcclxuICAgICAgaGVscGVyLmQzX2FkZFRleHQobGVnZW5kRywgY2VsbEVudGVyLCB0eXBlLmxhYmVscywgY2xhc3NQcmVmaXgpXHJcblxyXG4gICAgICAvLyBzZXRzIHBsYWNlbWVudFxyXG4gICAgICB2YXIgdGV4dCA9IGNlbGwuc2VsZWN0KFwidGV4dFwiKSxcclxuICAgICAgICBzaGFwZVNpemUgPSBzaGFwZXNbMF0ubWFwKCBmdW5jdGlvbihkKXsgcmV0dXJuIGQuZ2V0QkJveCgpOyB9KTtcclxuXHJcbiAgICAgIHZhciBtYXhIID0gZDMubWF4KHNoYXBlU2l6ZSwgZnVuY3Rpb24oZCl7IHJldHVybiBkLmhlaWdodDsgfSksXHJcbiAgICAgIG1heFcgPSBkMy5tYXgoc2hhcGVTaXplLCBmdW5jdGlvbihkKXsgcmV0dXJuIGQud2lkdGg7IH0pO1xyXG5cclxuICAgICAgdmFyIGNlbGxUcmFucyxcclxuICAgICAgdGV4dFRyYW5zLFxyXG4gICAgICB0ZXh0QWxpZ24gPSAobGFiZWxBbGlnbiA9PSBcInN0YXJ0XCIpID8gMCA6IChsYWJlbEFsaWduID09IFwibWlkZGxlXCIpID8gMC41IDogMTtcclxuXHJcbiAgICAgIC8vcG9zaXRpb25zIGNlbGxzIGFuZCB0ZXh0XHJcbiAgICAgIGlmIChvcmllbnQgPT09IFwidmVydGljYWxcIil7XHJcbiAgICAgICAgY2VsbFRyYW5zID0gZnVuY3Rpb24oZCxpKSB7IHJldHVybiBcInRyYW5zbGF0ZSgwLCBcIiArIChpICogKG1heEggKyBzaGFwZVBhZGRpbmcpKSArIFwiKVwiOyB9O1xyXG4gICAgICAgIHRleHRUcmFucyA9IGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAobWF4VyArIGxhYmVsT2Zmc2V0KSArIFwiLFwiICtcclxuICAgICAgICAgICAgICAoc2hhcGVTaXplW2ldLnkgKyBzaGFwZVNpemVbaV0uaGVpZ2h0LzIgKyA1KSArIFwiKVwiOyB9O1xyXG5cclxuICAgICAgfSBlbHNlIGlmIChvcmllbnQgPT09IFwiaG9yaXpvbnRhbFwiKXtcclxuICAgICAgICBjZWxsVHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKGkgKiAobWF4VyArIHNoYXBlUGFkZGluZykpICsgXCIsMClcIjsgfTtcclxuICAgICAgICB0ZXh0VHJhbnMgPSBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKHNoYXBlU2l6ZVtpXS53aWR0aCp0ZXh0QWxpZ24gICsgc2hhcGVTaXplW2ldLngpICsgXCIsXCIgK1xyXG4gICAgICAgICAgICAgIChtYXhIICsgbGFiZWxPZmZzZXQgKSArIFwiKVwiOyB9O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBoZWxwZXIuZDNfcGxhY2VtZW50KG9yaWVudCwgY2VsbCwgY2VsbFRyYW5zLCB0ZXh0LCB0ZXh0VHJhbnMsIGxhYmVsQWxpZ24pO1xyXG4gICAgICBoZWxwZXIuZDNfdGl0bGUoc3ZnLCBsZWdlbmRHLCB0aXRsZSwgY2xhc3NQcmVmaXgpO1xyXG4gICAgICBjZWxsLnRyYW5zaXRpb24oKS5zdHlsZShcIm9wYWNpdHlcIiwgMSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgbGVnZW5kLnNjYWxlID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2NhbGU7XHJcbiAgICBzY2FsZSA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5jZWxscyA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGNlbGxzO1xyXG4gICAgaWYgKF8ubGVuZ3RoID4gMSB8fCBfID49IDIgKXtcclxuICAgICAgY2VsbHMgPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuc2hhcGVQYWRkaW5nID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc2hhcGVQYWRkaW5nO1xyXG4gICAgc2hhcGVQYWRkaW5nID0gK187XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbHMgPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsYWJlbHM7XHJcbiAgICBsYWJlbHMgPSBfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQubGFiZWxBbGlnbiA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsQWxpZ247XHJcbiAgICBpZiAoXyA9PSBcInN0YXJ0XCIgfHwgXyA9PSBcImVuZFwiIHx8IF8gPT0gXCJtaWRkbGVcIikge1xyXG4gICAgICBsYWJlbEFsaWduID0gXztcclxuICAgIH1cclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsRm9ybWF0ID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxGb3JtYXQ7XHJcbiAgICBsYWJlbEZvcm1hdCA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5sYWJlbE9mZnNldCA9IGZ1bmN0aW9uKF8pIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxhYmVsT2Zmc2V0O1xyXG4gICAgbGFiZWxPZmZzZXQgPSArXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLmxhYmVsRGVsaW1pdGVyID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGFiZWxEZWxpbWl0ZXI7XHJcbiAgICBsYWJlbERlbGltaXRlciA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGxlZ2VuZC5vcmllbnQgPSBmdW5jdGlvbihfKXtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIG9yaWVudDtcclxuICAgIF8gPSBfLnRvTG93ZXJDYXNlKCk7XHJcbiAgICBpZiAoXyA9PSBcImhvcml6b250YWxcIiB8fCBfID09IFwidmVydGljYWxcIikge1xyXG4gICAgICBvcmllbnQgPSBfO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuYXNjZW5kaW5nID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gYXNjZW5kaW5nO1xyXG4gICAgYXNjZW5kaW5nID0gISFfO1xyXG4gICAgcmV0dXJuIGxlZ2VuZDtcclxuICB9O1xyXG5cclxuICBsZWdlbmQuY2xhc3NQcmVmaXggPSBmdW5jdGlvbihfKSB7XHJcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBjbGFzc1ByZWZpeDtcclxuICAgIGNsYXNzUHJlZml4ID0gXztcclxuICAgIHJldHVybiBsZWdlbmQ7XHJcbiAgfTtcclxuXHJcbiAgbGVnZW5kLnRpdGxlID0gZnVuY3Rpb24oXykge1xyXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdGl0bGU7XHJcbiAgICB0aXRsZSA9IF87XHJcbiAgICByZXR1cm4gbGVnZW5kO1xyXG4gIH07XHJcblxyXG4gIGQzLnJlYmluZChsZWdlbmQsIGxlZ2VuZERpc3BhdGNoZXIsIFwib25cIik7XHJcblxyXG4gIHJldHVybiBsZWdlbmQ7XHJcblxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG4vKipcclxuICogKipbR2F1c3NpYW4gZXJyb3IgZnVuY3Rpb25dKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRXJyb3JfZnVuY3Rpb24pKipcclxuICpcclxuICogVGhlIGBlcnJvckZ1bmN0aW9uKHgvKHNkICogTWF0aC5zcXJ0KDIpKSlgIGlzIHRoZSBwcm9iYWJpbGl0eSB0aGF0IGEgdmFsdWUgaW4gYVxyXG4gKiBub3JtYWwgZGlzdHJpYnV0aW9uIHdpdGggc3RhbmRhcmQgZGV2aWF0aW9uIHNkIGlzIHdpdGhpbiB4IG9mIHRoZSBtZWFuLlxyXG4gKlxyXG4gKiBUaGlzIGZ1bmN0aW9uIHJldHVybnMgYSBudW1lcmljYWwgYXBwcm94aW1hdGlvbiB0byB0aGUgZXhhY3QgdmFsdWUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4IGlucHV0XHJcbiAqIEByZXR1cm4ge251bWJlcn0gZXJyb3IgZXN0aW1hdGlvblxyXG4gKiBAZXhhbXBsZVxyXG4gKiBlcnJvckZ1bmN0aW9uKDEpOyAvLz0gMC44NDI3XHJcbiAqL1xyXG5mdW5jdGlvbiBlcnJvckZ1bmN0aW9uKHgvKjogbnVtYmVyICovKS8qOiBudW1iZXIgKi8ge1xyXG4gICAgdmFyIHQgPSAxIC8gKDEgKyAwLjUgKiBNYXRoLmFicyh4KSk7XHJcbiAgICB2YXIgdGF1ID0gdCAqIE1hdGguZXhwKC1NYXRoLnBvdyh4LCAyKSAtXHJcbiAgICAgICAgMS4yNjU1MTIyMyArXHJcbiAgICAgICAgMS4wMDAwMjM2OCAqIHQgK1xyXG4gICAgICAgIDAuMzc0MDkxOTYgKiBNYXRoLnBvdyh0LCAyKSArXHJcbiAgICAgICAgMC4wOTY3ODQxOCAqIE1hdGgucG93KHQsIDMpIC1cclxuICAgICAgICAwLjE4NjI4ODA2ICogTWF0aC5wb3codCwgNCkgK1xyXG4gICAgICAgIDAuMjc4ODY4MDcgKiBNYXRoLnBvdyh0LCA1KSAtXHJcbiAgICAgICAgMS4xMzUyMDM5OCAqIE1hdGgucG93KHQsIDYpICtcclxuICAgICAgICAxLjQ4ODUxNTg3ICogTWF0aC5wb3codCwgNykgLVxyXG4gICAgICAgIDAuODIyMTUyMjMgKiBNYXRoLnBvdyh0LCA4KSArXHJcbiAgICAgICAgMC4xNzA4NzI3NyAqIE1hdGgucG93KHQsIDkpKTtcclxuICAgIGlmICh4ID49IDApIHtcclxuICAgICAgICByZXR1cm4gMSAtIHRhdTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRhdSAtIDE7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZXJyb3JGdW5jdGlvbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxuLyoqXHJcbiAqIFtTaW1wbGUgbGluZWFyIHJlZ3Jlc3Npb25dKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvU2ltcGxlX2xpbmVhcl9yZWdyZXNzaW9uKVxyXG4gKiBpcyBhIHNpbXBsZSB3YXkgdG8gZmluZCBhIGZpdHRlZCBsaW5lXHJcbiAqIGJldHdlZW4gYSBzZXQgb2YgY29vcmRpbmF0ZXMuIFRoaXMgYWxnb3JpdGhtIGZpbmRzIHRoZSBzbG9wZSBhbmQgeS1pbnRlcmNlcHQgb2YgYSByZWdyZXNzaW9uIGxpbmVcclxuICogdXNpbmcgdGhlIGxlYXN0IHN1bSBvZiBzcXVhcmVzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PEFycmF5PG51bWJlcj4+fSBkYXRhIGFuIGFycmF5IG9mIHR3by1lbGVtZW50IG9mIGFycmF5cyxcclxuICogbGlrZSBgW1swLCAxXSwgWzIsIDNdXWBcclxuICogQHJldHVybnMge09iamVjdH0gb2JqZWN0IGNvbnRhaW5pbmcgc2xvcGUgYW5kIGludGVyc2VjdCBvZiByZWdyZXNzaW9uIGxpbmVcclxuICogQGV4YW1wbGVcclxuICogbGluZWFyUmVncmVzc2lvbihbWzAsIDBdLCBbMSwgMV1dKTsgLy8geyBtOiAxLCBiOiAwIH1cclxuICovXHJcbmZ1bmN0aW9uIGxpbmVhclJlZ3Jlc3Npb24oZGF0YS8qOiBBcnJheTxBcnJheTxudW1iZXI+PiAqLykvKjogeyBtOiBudW1iZXIsIGI6IG51bWJlciB9ICovIHtcclxuXHJcbiAgICB2YXIgbSwgYjtcclxuXHJcbiAgICAvLyBTdG9yZSBkYXRhIGxlbmd0aCBpbiBhIGxvY2FsIHZhcmlhYmxlIHRvIHJlZHVjZVxyXG4gICAgLy8gcmVwZWF0ZWQgb2JqZWN0IHByb3BlcnR5IGxvb2t1cHNcclxuICAgIHZhciBkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGg7XHJcblxyXG4gICAgLy9pZiB0aGVyZSdzIG9ubHkgb25lIHBvaW50LCBhcmJpdHJhcmlseSBjaG9vc2UgYSBzbG9wZSBvZiAwXHJcbiAgICAvL2FuZCBhIHktaW50ZXJjZXB0IG9mIHdoYXRldmVyIHRoZSB5IG9mIHRoZSBpbml0aWFsIHBvaW50IGlzXHJcbiAgICBpZiAoZGF0YUxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIG0gPSAwO1xyXG4gICAgICAgIGIgPSBkYXRhWzBdWzFdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBJbml0aWFsaXplIG91ciBzdW1zIGFuZCBzY29wZSB0aGUgYG1gIGFuZCBgYmBcclxuICAgICAgICAvLyB2YXJpYWJsZXMgdGhhdCBkZWZpbmUgdGhlIGxpbmUuXHJcbiAgICAgICAgdmFyIHN1bVggPSAwLCBzdW1ZID0gMCxcclxuICAgICAgICAgICAgc3VtWFggPSAwLCBzdW1YWSA9IDA7XHJcblxyXG4gICAgICAgIC8vIFVzZSBsb2NhbCB2YXJpYWJsZXMgdG8gZ3JhYiBwb2ludCB2YWx1ZXNcclxuICAgICAgICAvLyB3aXRoIG1pbmltYWwgb2JqZWN0IHByb3BlcnR5IGxvb2t1cHNcclxuICAgICAgICB2YXIgcG9pbnQsIHgsIHk7XHJcblxyXG4gICAgICAgIC8vIEdhdGhlciB0aGUgc3VtIG9mIGFsbCB4IHZhbHVlcywgdGhlIHN1bSBvZiBhbGxcclxuICAgICAgICAvLyB5IHZhbHVlcywgYW5kIHRoZSBzdW0gb2YgeF4yIGFuZCAoeCp5KSBmb3IgZWFjaFxyXG4gICAgICAgIC8vIHZhbHVlLlxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gSW4gbWF0aCBub3RhdGlvbiwgdGhlc2Ugd291bGQgYmUgU1NfeCwgU1NfeSwgU1NfeHgsIGFuZCBTU194eVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YUxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHBvaW50ID0gZGF0YVtpXTtcclxuICAgICAgICAgICAgeCA9IHBvaW50WzBdO1xyXG4gICAgICAgICAgICB5ID0gcG9pbnRbMV07XHJcblxyXG4gICAgICAgICAgICBzdW1YICs9IHg7XHJcbiAgICAgICAgICAgIHN1bVkgKz0geTtcclxuXHJcbiAgICAgICAgICAgIHN1bVhYICs9IHggKiB4O1xyXG4gICAgICAgICAgICBzdW1YWSArPSB4ICogeTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGBtYCBpcyB0aGUgc2xvcGUgb2YgdGhlIHJlZ3Jlc3Npb24gbGluZVxyXG4gICAgICAgIG0gPSAoKGRhdGFMZW5ndGggKiBzdW1YWSkgLSAoc3VtWCAqIHN1bVkpKSAvXHJcbiAgICAgICAgICAgICgoZGF0YUxlbmd0aCAqIHN1bVhYKSAtIChzdW1YICogc3VtWCkpO1xyXG5cclxuICAgICAgICAvLyBgYmAgaXMgdGhlIHktaW50ZXJjZXB0IG9mIHRoZSBsaW5lLlxyXG4gICAgICAgIGIgPSAoc3VtWSAvIGRhdGFMZW5ndGgpIC0gKChtICogc3VtWCkgLyBkYXRhTGVuZ3RoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZXR1cm4gYm90aCB2YWx1ZXMgYXMgYW4gb2JqZWN0LlxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBtOiBtLFxyXG4gICAgICAgIGI6IGJcclxuICAgIH07XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxpbmVhclJlZ3Jlc3Npb247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbi8qKlxyXG4gKiBHaXZlbiB0aGUgb3V0cHV0IG9mIGBsaW5lYXJSZWdyZXNzaW9uYDogYW4gb2JqZWN0XHJcbiAqIHdpdGggYG1gIGFuZCBgYmAgdmFsdWVzIGluZGljYXRpbmcgc2xvcGUgYW5kIGludGVyY2VwdCxcclxuICogcmVzcGVjdGl2ZWx5LCBnZW5lcmF0ZSBhIGxpbmUgZnVuY3Rpb24gdGhhdCB0cmFuc2xhdGVzXHJcbiAqIHggdmFsdWVzIGludG8geSB2YWx1ZXMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYiBvYmplY3Qgd2l0aCBgbWAgYW5kIGBiYCBtZW1iZXJzLCByZXByZXNlbnRpbmdcclxuICogc2xvcGUgYW5kIGludGVyc2VjdCBvZiBkZXNpcmVkIGxpbmVcclxuICogQHJldHVybnMge0Z1bmN0aW9ufSBtZXRob2QgdGhhdCBjb21wdXRlcyB5LXZhbHVlIGF0IGFueSBnaXZlblxyXG4gKiB4LXZhbHVlIG9uIHRoZSBsaW5lLlxyXG4gKiBAZXhhbXBsZVxyXG4gKiB2YXIgbCA9IGxpbmVhclJlZ3Jlc3Npb25MaW5lKGxpbmVhclJlZ3Jlc3Npb24oW1swLCAwXSwgWzEsIDFdXSkpO1xyXG4gKiBsKDApIC8vPSAwXHJcbiAqIGwoMikgLy89IDJcclxuICovXHJcbmZ1bmN0aW9uIGxpbmVhclJlZ3Jlc3Npb25MaW5lKG1iLyo6IHsgYjogbnVtYmVyLCBtOiBudW1iZXIgfSovKS8qOiBGdW5jdGlvbiAqLyB7XHJcbiAgICAvLyBSZXR1cm4gYSBmdW5jdGlvbiB0aGF0IGNvbXB1dGVzIGEgYHlgIHZhbHVlIGZvciBlYWNoXHJcbiAgICAvLyB4IHZhbHVlIGl0IGlzIGdpdmVuLCBiYXNlZCBvbiB0aGUgdmFsdWVzIG9mIGBiYCBhbmQgYGFgXHJcbiAgICAvLyB0aGF0IHdlIGp1c3QgY29tcHV0ZWQuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24oeCkge1xyXG4gICAgICAgIHJldHVybiBtYi5iICsgKG1iLm0gKiB4KTtcclxuICAgIH07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGluZWFyUmVncmVzc2lvbkxpbmU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBzdW0gPSByZXF1aXJlKCcuL3N1bScpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBtZWFuLCBfYWxzbyBrbm93biBhcyBhdmVyYWdlXyxcclxuICogaXMgdGhlIHN1bSBvZiBhbGwgdmFsdWVzIG92ZXIgdGhlIG51bWJlciBvZiB2YWx1ZXMuXHJcbiAqIFRoaXMgaXMgYSBbbWVhc3VyZSBvZiBjZW50cmFsIHRlbmRlbmN5XShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9DZW50cmFsX3RlbmRlbmN5KTpcclxuICogYSBtZXRob2Qgb2YgZmluZGluZyBhIHR5cGljYWwgb3IgY2VudHJhbCB2YWx1ZSBvZiBhIHNldCBvZiBudW1iZXJzLlxyXG4gKlxyXG4gKiBUaGlzIHJ1bnMgb24gYE8obilgLCBsaW5lYXIgdGltZSBpbiByZXNwZWN0IHRvIHRoZSBhcnJheVxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggaW5wdXQgdmFsdWVzXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IG1lYW5cclxuICogQGV4YW1wbGVcclxuICogY29uc29sZS5sb2cobWVhbihbMCwgMTBdKSk7IC8vIDVcclxuICovXHJcbmZ1bmN0aW9uIG1lYW4oeCAvKjogQXJyYXk8bnVtYmVyPiAqLykvKjpudW1iZXIqLyB7XHJcbiAgICAvLyBUaGUgbWVhbiBvZiBubyBudW1iZXJzIGlzIG51bGxcclxuICAgIGlmICh4Lmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gTmFOOyB9XHJcblxyXG4gICAgcmV0dXJuIHN1bSh4KSAvIHgubGVuZ3RoO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1lYW47XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBzYW1wbGVDb3ZhcmlhbmNlID0gcmVxdWlyZSgnLi9zYW1wbGVfY292YXJpYW5jZScpO1xyXG52YXIgc2FtcGxlU3RhbmRhcmREZXZpYXRpb24gPSByZXF1aXJlKCcuL3NhbXBsZV9zdGFuZGFyZF9kZXZpYXRpb24nKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgW2NvcnJlbGF0aW9uXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0NvcnJlbGF0aW9uX2FuZF9kZXBlbmRlbmNlKSBpc1xyXG4gKiBhIG1lYXN1cmUgb2YgaG93IGNvcnJlbGF0ZWQgdHdvIGRhdGFzZXRzIGFyZSwgYmV0d2VlbiAtMSBhbmQgMVxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggZmlyc3QgaW5wdXRcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB5IHNlY29uZCBpbnB1dFxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBzYW1wbGUgY29ycmVsYXRpb25cclxuICogQGV4YW1wbGVcclxuICogdmFyIGEgPSBbMSwgMiwgMywgNCwgNSwgNl07XHJcbiAqIHZhciBiID0gWzIsIDIsIDMsIDQsIDUsIDYwXTtcclxuICogc2FtcGxlQ29ycmVsYXRpb24oYSwgYik7IC8vPSAwLjY5MVxyXG4gKi9cclxuZnVuY3Rpb24gc2FtcGxlQ29ycmVsYXRpb24oeC8qOiBBcnJheTxudW1iZXI+ICovLCB5Lyo6IEFycmF5PG51bWJlcj4gKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgdmFyIGNvdiA9IHNhbXBsZUNvdmFyaWFuY2UoeCwgeSksXHJcbiAgICAgICAgeHN0ZCA9IHNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uKHgpLFxyXG4gICAgICAgIHlzdGQgPSBzYW1wbGVTdGFuZGFyZERldmlhdGlvbih5KTtcclxuXHJcbiAgICByZXR1cm4gY292IC8geHN0ZCAvIHlzdGQ7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2FtcGxlQ29ycmVsYXRpb247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbnZhciBtZWFuID0gcmVxdWlyZSgnLi9tZWFuJyk7XHJcblxyXG4vKipcclxuICogW1NhbXBsZSBjb3ZhcmlhbmNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TYW1wbGVfbWVhbl9hbmRfc2FtcGxlQ292YXJpYW5jZSkgb2YgdHdvIGRhdGFzZXRzOlxyXG4gKiBob3cgbXVjaCBkbyB0aGUgdHdvIGRhdGFzZXRzIG1vdmUgdG9nZXRoZXI/XHJcbiAqIHggYW5kIHkgYXJlIHR3byBkYXRhc2V0cywgcmVwcmVzZW50ZWQgYXMgYXJyYXlzIG9mIG51bWJlcnMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBmaXJzdCBpbnB1dFxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHkgc2Vjb25kIGlucHV0XHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHNhbXBsZSBjb3ZhcmlhbmNlXHJcbiAqIEBleGFtcGxlXHJcbiAqIHZhciB4ID0gWzEsIDIsIDMsIDQsIDUsIDZdO1xyXG4gKiB2YXIgeSA9IFs2LCA1LCA0LCAzLCAyLCAxXTtcclxuICogc2FtcGxlQ292YXJpYW5jZSh4LCB5KTsgLy89IC0zLjVcclxuICovXHJcbmZ1bmN0aW9uIHNhbXBsZUNvdmFyaWFuY2UoeCAvKjpBcnJheTxudW1iZXI+Ki8sIHkgLyo6QXJyYXk8bnVtYmVyPiovKS8qOm51bWJlciovIHtcclxuXHJcbiAgICAvLyBUaGUgdHdvIGRhdGFzZXRzIG11c3QgaGF2ZSB0aGUgc2FtZSBsZW5ndGggd2hpY2ggbXVzdCBiZSBtb3JlIHRoYW4gMVxyXG4gICAgaWYgKHgubGVuZ3RoIDw9IDEgfHwgeC5sZW5ndGggIT09IHkubGVuZ3RoKSB7XHJcbiAgICAgICAgcmV0dXJuIE5hTjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBkZXRlcm1pbmUgdGhlIG1lYW4gb2YgZWFjaCBkYXRhc2V0IHNvIHRoYXQgd2UgY2FuIGp1ZGdlIGVhY2hcclxuICAgIC8vIHZhbHVlIG9mIHRoZSBkYXRhc2V0IGZhaXJseSBhcyB0aGUgZGlmZmVyZW5jZSBmcm9tIHRoZSBtZWFuLiB0aGlzXHJcbiAgICAvLyB3YXksIGlmIG9uZSBkYXRhc2V0IGlzIFsxLCAyLCAzXSBhbmQgWzIsIDMsIDRdLCB0aGVpciBjb3ZhcmlhbmNlXHJcbiAgICAvLyBkb2VzIG5vdCBzdWZmZXIgYmVjYXVzZSBvZiB0aGUgZGlmZmVyZW5jZSBpbiBhYnNvbHV0ZSB2YWx1ZXNcclxuICAgIHZhciB4bWVhbiA9IG1lYW4oeCksXHJcbiAgICAgICAgeW1lYW4gPSBtZWFuKHkpLFxyXG4gICAgICAgIHN1bSA9IDA7XHJcblxyXG4gICAgLy8gZm9yIGVhY2ggcGFpciBvZiB2YWx1ZXMsIHRoZSBjb3ZhcmlhbmNlIGluY3JlYXNlcyB3aGVuIHRoZWlyXHJcbiAgICAvLyBkaWZmZXJlbmNlIGZyb20gdGhlIG1lYW4gaXMgYXNzb2NpYXRlZCAtIGlmIGJvdGggYXJlIHdlbGwgYWJvdmVcclxuICAgIC8vIG9yIGlmIGJvdGggYXJlIHdlbGwgYmVsb3dcclxuICAgIC8vIHRoZSBtZWFuLCB0aGUgY292YXJpYW5jZSBpbmNyZWFzZXMgc2lnbmlmaWNhbnRseS5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHN1bSArPSAoeFtpXSAtIHhtZWFuKSAqICh5W2ldIC0geW1lYW4pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRoaXMgaXMgQmVzc2VscycgQ29ycmVjdGlvbjogYW4gYWRqdXN0bWVudCBtYWRlIHRvIHNhbXBsZSBzdGF0aXN0aWNzXHJcbiAgICAvLyB0aGF0IGFsbG93cyBmb3IgdGhlIHJlZHVjZWQgZGVncmVlIG9mIGZyZWVkb20gZW50YWlsZWQgaW4gY2FsY3VsYXRpbmdcclxuICAgIC8vIHZhbHVlcyBmcm9tIHNhbXBsZXMgcmF0aGVyIHRoYW4gY29tcGxldGUgcG9wdWxhdGlvbnMuXHJcbiAgICB2YXIgYmVzc2Vsc0NvcnJlY3Rpb24gPSB4Lmxlbmd0aCAtIDE7XHJcblxyXG4gICAgLy8gdGhlIGNvdmFyaWFuY2UgaXMgd2VpZ2h0ZWQgYnkgdGhlIGxlbmd0aCBvZiB0aGUgZGF0YXNldHMuXHJcbiAgICByZXR1cm4gc3VtIC8gYmVzc2Vsc0NvcnJlY3Rpb247XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2FtcGxlQ292YXJpYW5jZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBAZmxvdyAqL1xyXG5cclxudmFyIHNhbXBsZVZhcmlhbmNlID0gcmVxdWlyZSgnLi9zYW1wbGVfdmFyaWFuY2UnKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgW3N0YW5kYXJkIGRldmlhdGlvbl0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TdGFuZGFyZF9kZXZpYXRpb24pXHJcbiAqIGlzIHRoZSBzcXVhcmUgcm9vdCBvZiB0aGUgdmFyaWFuY2UuXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBpbnB1dCBhcnJheVxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBzYW1wbGUgc3RhbmRhcmQgZGV2aWF0aW9uXHJcbiAqIEBleGFtcGxlXHJcbiAqIHNzLnNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uKFsyLCA0LCA0LCA0LCA1LCA1LCA3LCA5XSk7XHJcbiAqIC8vPSAyLjEzOFxyXG4gKi9cclxuZnVuY3Rpb24gc2FtcGxlU3RhbmRhcmREZXZpYXRpb24oeC8qOkFycmF5PG51bWJlcj4qLykvKjpudW1iZXIqLyB7XHJcbiAgICAvLyBUaGUgc3RhbmRhcmQgZGV2aWF0aW9uIG9mIG5vIG51bWJlcnMgaXMgbnVsbFxyXG4gICAgdmFyIHNhbXBsZVZhcmlhbmNlWCA9IHNhbXBsZVZhcmlhbmNlKHgpO1xyXG4gICAgaWYgKGlzTmFOKHNhbXBsZVZhcmlhbmNlWCkpIHsgcmV0dXJuIE5hTjsgfVxyXG4gICAgcmV0dXJuIE1hdGguc3FydChzYW1wbGVWYXJpYW5jZVgpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNhbXBsZVN0YW5kYXJkRGV2aWF0aW9uO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgc3VtTnRoUG93ZXJEZXZpYXRpb25zID0gcmVxdWlyZSgnLi9zdW1fbnRoX3Bvd2VyX2RldmlhdGlvbnMnKTtcclxuXHJcbi8qXHJcbiAqIFRoZSBbc2FtcGxlIHZhcmlhbmNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9WYXJpYW5jZSNTYW1wbGVfdmFyaWFuY2UpXHJcbiAqIGlzIHRoZSBzdW0gb2Ygc3F1YXJlZCBkZXZpYXRpb25zIGZyb20gdGhlIG1lYW4uIFRoZSBzYW1wbGUgdmFyaWFuY2VcclxuICogaXMgZGlzdGluZ3Vpc2hlZCBmcm9tIHRoZSB2YXJpYW5jZSBieSB0aGUgdXNhZ2Ugb2YgW0Jlc3NlbCdzIENvcnJlY3Rpb25dKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Jlc3NlbCdzX2NvcnJlY3Rpb24pOlxyXG4gKiBpbnN0ZWFkIG9mIGRpdmlkaW5nIHRoZSBzdW0gb2Ygc3F1YXJlZCBkZXZpYXRpb25zIGJ5IHRoZSBsZW5ndGggb2YgdGhlIGlucHV0LFxyXG4gKiBpdCBpcyBkaXZpZGVkIGJ5IHRoZSBsZW5ndGggbWludXMgb25lLiBUaGlzIGNvcnJlY3RzIHRoZSBiaWFzIGluIGVzdGltYXRpbmdcclxuICogYSB2YWx1ZSBmcm9tIGEgc2V0IHRoYXQgeW91IGRvbid0IGtub3cgaWYgZnVsbC5cclxuICpcclxuICogUmVmZXJlbmNlczpcclxuICogKiBbV29sZnJhbSBNYXRoV29ybGQgb24gU2FtcGxlIFZhcmlhbmNlXShodHRwOi8vbWF0aHdvcmxkLndvbGZyYW0uY29tL1NhbXBsZVZhcmlhbmNlLmh0bWwpXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBpbnB1dCBhcnJheVxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IHNhbXBsZSB2YXJpYW5jZVxyXG4gKiBAZXhhbXBsZVxyXG4gKiBzYW1wbGVWYXJpYW5jZShbMSwgMiwgMywgNCwgNV0pOyAvLz0gMi41XHJcbiAqL1xyXG5mdW5jdGlvbiBzYW1wbGVWYXJpYW5jZSh4IC8qOiBBcnJheTxudW1iZXI+ICovKS8qOm51bWJlciovIHtcclxuICAgIC8vIFRoZSB2YXJpYW5jZSBvZiBubyBudW1iZXJzIGlzIG51bGxcclxuICAgIGlmICh4Lmxlbmd0aCA8PSAxKSB7IHJldHVybiBOYU47IH1cclxuXHJcbiAgICB2YXIgc3VtU3F1YXJlZERldmlhdGlvbnNWYWx1ZSA9IHN1bU50aFBvd2VyRGV2aWF0aW9ucyh4LCAyKTtcclxuXHJcbiAgICAvLyB0aGlzIGlzIEJlc3NlbHMnIENvcnJlY3Rpb246IGFuIGFkanVzdG1lbnQgbWFkZSB0byBzYW1wbGUgc3RhdGlzdGljc1xyXG4gICAgLy8gdGhhdCBhbGxvd3MgZm9yIHRoZSByZWR1Y2VkIGRlZ3JlZSBvZiBmcmVlZG9tIGVudGFpbGVkIGluIGNhbGN1bGF0aW5nXHJcbiAgICAvLyB2YWx1ZXMgZnJvbSBzYW1wbGVzIHJhdGhlciB0aGFuIGNvbXBsZXRlIHBvcHVsYXRpb25zLlxyXG4gICAgdmFyIGJlc3NlbHNDb3JyZWN0aW9uID0geC5sZW5ndGggLSAxO1xyXG5cclxuICAgIC8vIEZpbmQgdGhlIG1lYW4gdmFsdWUgb2YgdGhhdCBsaXN0XHJcbiAgICByZXR1cm4gc3VtU3F1YXJlZERldmlhdGlvbnNWYWx1ZSAvIGJlc3NlbHNDb3JyZWN0aW9uO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNhbXBsZVZhcmlhbmNlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgdmFyaWFuY2UgPSByZXF1aXJlKCcuL3ZhcmlhbmNlJyk7XHJcblxyXG4vKipcclxuICogVGhlIFtzdGFuZGFyZCBkZXZpYXRpb25dKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvU3RhbmRhcmRfZGV2aWF0aW9uKVxyXG4gKiBpcyB0aGUgc3F1YXJlIHJvb3Qgb2YgdGhlIHZhcmlhbmNlLiBJdCdzIHVzZWZ1bCBmb3IgbWVhc3VyaW5nIHRoZSBhbW91bnRcclxuICogb2YgdmFyaWF0aW9uIG9yIGRpc3BlcnNpb24gaW4gYSBzZXQgb2YgdmFsdWVzLlxyXG4gKlxyXG4gKiBTdGFuZGFyZCBkZXZpYXRpb24gaXMgb25seSBhcHByb3ByaWF0ZSBmb3IgZnVsbC1wb3B1bGF0aW9uIGtub3dsZWRnZTogZm9yXHJcbiAqIHNhbXBsZXMgb2YgYSBwb3B1bGF0aW9uLCB7QGxpbmsgc2FtcGxlU3RhbmRhcmREZXZpYXRpb259IGlzXHJcbiAqIG1vcmUgYXBwcm9wcmlhdGUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBpbnB1dFxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBzdGFuZGFyZCBkZXZpYXRpb25cclxuICogQGV4YW1wbGVcclxuICogdmFyIHNjb3JlcyA9IFsyLCA0LCA0LCA0LCA1LCA1LCA3LCA5XTtcclxuICogdmFyaWFuY2Uoc2NvcmVzKTsgLy89IDRcclxuICogc3RhbmRhcmREZXZpYXRpb24oc2NvcmVzKTsgLy89IDJcclxuICovXHJcbmZ1bmN0aW9uIHN0YW5kYXJkRGV2aWF0aW9uKHggLyo6IEFycmF5PG51bWJlcj4gKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgLy8gVGhlIHN0YW5kYXJkIGRldmlhdGlvbiBvZiBubyBudW1iZXJzIGlzIG51bGxcclxuICAgIHZhciB2ID0gdmFyaWFuY2UoeCk7XHJcbiAgICBpZiAoaXNOYU4odikpIHsgcmV0dXJuIDA7IH1cclxuICAgIHJldHVybiBNYXRoLnNxcnQodik7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc3RhbmRhcmREZXZpYXRpb247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLyogQGZsb3cgKi9cclxuXHJcbi8qKlxyXG4gKiBPdXIgZGVmYXVsdCBzdW0gaXMgdGhlIFtLYWhhbiBzdW1tYXRpb24gYWxnb3JpdGhtXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9LYWhhbl9zdW1tYXRpb25fYWxnb3JpdGhtKSBpc1xyXG4gKiBhIG1ldGhvZCBmb3IgY29tcHV0aW5nIHRoZSBzdW0gb2YgYSBsaXN0IG9mIG51bWJlcnMgd2hpbGUgY29ycmVjdGluZ1xyXG4gKiBmb3IgZmxvYXRpbmctcG9pbnQgZXJyb3JzLiBUcmFkaXRpb25hbGx5LCBzdW1zIGFyZSBjYWxjdWxhdGVkIGFzIG1hbnlcclxuICogc3VjY2Vzc2l2ZSBhZGRpdGlvbnMsIGVhY2ggb25lIHdpdGggaXRzIG93biBmbG9hdGluZy1wb2ludCByb3VuZG9mZi4gVGhlc2VcclxuICogbG9zc2VzIGluIHByZWNpc2lvbiBhZGQgdXAgYXMgdGhlIG51bWJlciBvZiBudW1iZXJzIGluY3JlYXNlcy4gVGhpcyBhbHRlcm5hdGl2ZVxyXG4gKiBhbGdvcml0aG0gaXMgbW9yZSBhY2N1cmF0ZSB0aGFuIHRoZSBzaW1wbGUgd2F5IG9mIGNhbGN1bGF0aW5nIHN1bXMgYnkgc2ltcGxlXHJcbiAqIGFkZGl0aW9uLlxyXG4gKlxyXG4gKiBUaGlzIHJ1bnMgb24gYE8obilgLCBsaW5lYXIgdGltZSBpbiByZXNwZWN0IHRvIHRoZSBhcnJheVxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IHggaW5wdXRcclxuICogQHJldHVybiB7bnVtYmVyfSBzdW0gb2YgYWxsIGlucHV0IG51bWJlcnNcclxuICogQGV4YW1wbGVcclxuICogY29uc29sZS5sb2coc3VtKFsxLCAyLCAzXSkpOyAvLyA2XHJcbiAqL1xyXG5mdW5jdGlvbiBzdW0oeC8qOiBBcnJheTxudW1iZXI+ICovKS8qOiBudW1iZXIgKi8ge1xyXG5cclxuICAgIC8vIGxpa2UgdGhlIHRyYWRpdGlvbmFsIHN1bSBhbGdvcml0aG0sIHdlIGtlZXAgYSBydW5uaW5nXHJcbiAgICAvLyBjb3VudCBvZiB0aGUgY3VycmVudCBzdW0uXHJcbiAgICB2YXIgc3VtID0gMDtcclxuXHJcbiAgICAvLyBidXQgd2UgYWxzbyBrZWVwIHRocmVlIGV4dHJhIHZhcmlhYmxlcyBhcyBib29ra2VlcGluZzpcclxuICAgIC8vIG1vc3QgaW1wb3J0YW50bHksIGFuIGVycm9yIGNvcnJlY3Rpb24gdmFsdWUuIFRoaXMgd2lsbCBiZSBhIHZlcnlcclxuICAgIC8vIHNtYWxsIG51bWJlciB0aGF0IGlzIHRoZSBvcHBvc2l0ZSBvZiB0aGUgZmxvYXRpbmcgcG9pbnQgcHJlY2lzaW9uIGxvc3MuXHJcbiAgICB2YXIgZXJyb3JDb21wZW5zYXRpb24gPSAwO1xyXG5cclxuICAgIC8vIHRoaXMgd2lsbCBiZSBlYWNoIG51bWJlciBpbiB0aGUgbGlzdCBjb3JyZWN0ZWQgd2l0aCB0aGUgY29tcGVuc2F0aW9uIHZhbHVlLlxyXG4gICAgdmFyIGNvcnJlY3RlZEN1cnJlbnRWYWx1ZTtcclxuXHJcbiAgICAvLyBhbmQgdGhpcyB3aWxsIGJlIHRoZSBuZXh0IHN1bVxyXG4gICAgdmFyIG5leHRTdW07XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgLy8gZmlyc3QgY29ycmVjdCB0aGUgdmFsdWUgdGhhdCB3ZSdyZSBnb2luZyB0byBhZGQgdG8gdGhlIHN1bVxyXG4gICAgICAgIGNvcnJlY3RlZEN1cnJlbnRWYWx1ZSA9IHhbaV0gLSBlcnJvckNvbXBlbnNhdGlvbjtcclxuXHJcbiAgICAgICAgLy8gY29tcHV0ZSB0aGUgbmV4dCBzdW0uIHN1bSBpcyBsaWtlbHkgYSBtdWNoIGxhcmdlciBudW1iZXJcclxuICAgICAgICAvLyB0aGFuIGNvcnJlY3RlZEN1cnJlbnRWYWx1ZSwgc28gd2UnbGwgbG9zZSBwcmVjaXNpb24gaGVyZSxcclxuICAgICAgICAvLyBhbmQgbWVhc3VyZSBob3cgbXVjaCBwcmVjaXNpb24gaXMgbG9zdCBpbiB0aGUgbmV4dCBzdGVwXHJcbiAgICAgICAgbmV4dFN1bSA9IHN1bSArIGNvcnJlY3RlZEN1cnJlbnRWYWx1ZTtcclxuXHJcbiAgICAgICAgLy8gd2UgaW50ZW50aW9uYWxseSBkaWRuJ3QgYXNzaWduIHN1bSBpbW1lZGlhdGVseSwgYnV0IHN0b3JlZFxyXG4gICAgICAgIC8vIGl0IGZvciBub3cgc28gd2UgY2FuIGZpZ3VyZSBvdXQgdGhpczogaXMgKHN1bSArIG5leHRWYWx1ZSkgLSBuZXh0VmFsdWVcclxuICAgICAgICAvLyBub3QgZXF1YWwgdG8gMD8gaWRlYWxseSBpdCB3b3VsZCBiZSwgYnV0IGluIHByYWN0aWNlIGl0IHdvbid0OlxyXG4gICAgICAgIC8vIGl0IHdpbGwgYmUgc29tZSB2ZXJ5IHNtYWxsIG51bWJlci4gdGhhdCdzIHdoYXQgd2UgcmVjb3JkXHJcbiAgICAgICAgLy8gYXMgZXJyb3JDb21wZW5zYXRpb24uXHJcbiAgICAgICAgZXJyb3JDb21wZW5zYXRpb24gPSBuZXh0U3VtIC0gc3VtIC0gY29ycmVjdGVkQ3VycmVudFZhbHVlO1xyXG5cclxuICAgICAgICAvLyBub3cgdGhhdCB3ZSd2ZSBjb21wdXRlZCBob3cgbXVjaCB3ZSdsbCBjb3JyZWN0IGZvciBpbiB0aGUgbmV4dFxyXG4gICAgICAgIC8vIGxvb3AsIHN0YXJ0IHRyZWF0aW5nIHRoZSBuZXh0U3VtIGFzIHRoZSBjdXJyZW50IHN1bS5cclxuICAgICAgICBzdW0gPSBuZXh0U3VtO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdW07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc3VtO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgbWVhbiA9IHJlcXVpcmUoJy4vbWVhbicpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBzdW0gb2YgZGV2aWF0aW9ucyB0byB0aGUgTnRoIHBvd2VyLlxyXG4gKiBXaGVuIG49MiBpdCdzIHRoZSBzdW0gb2Ygc3F1YXJlZCBkZXZpYXRpb25zLlxyXG4gKiBXaGVuIG49MyBpdCdzIHRoZSBzdW0gb2YgY3ViZWQgZGV2aWF0aW9ucy5cclxuICpcclxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSB4XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBuIHBvd2VyXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHN1bSBvZiBudGggcG93ZXIgZGV2aWF0aW9uc1xyXG4gKiBAZXhhbXBsZVxyXG4gKiB2YXIgaW5wdXQgPSBbMSwgMiwgM107XHJcbiAqIC8vIHNpbmNlIHRoZSB2YXJpYW5jZSBvZiBhIHNldCBpcyB0aGUgbWVhbiBzcXVhcmVkXHJcbiAqIC8vIGRldmlhdGlvbnMsIHdlIGNhbiBjYWxjdWxhdGUgdGhhdCB3aXRoIHN1bU50aFBvd2VyRGV2aWF0aW9uczpcclxuICogdmFyIHZhcmlhbmNlID0gc3VtTnRoUG93ZXJEZXZpYXRpb25zKGlucHV0KSAvIGlucHV0Lmxlbmd0aDtcclxuICovXHJcbmZ1bmN0aW9uIHN1bU50aFBvd2VyRGV2aWF0aW9ucyh4Lyo6IEFycmF5PG51bWJlcj4gKi8sIG4vKjogbnVtYmVyICovKS8qOm51bWJlciovIHtcclxuICAgIHZhciBtZWFuVmFsdWUgPSBtZWFuKHgpLFxyXG4gICAgICAgIHN1bSA9IDA7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgc3VtICs9IE1hdGgucG93KHhbaV0gLSBtZWFuVmFsdWUsIG4pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdW07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc3VtTnRoUG93ZXJEZXZpYXRpb25zO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG52YXIgc3VtTnRoUG93ZXJEZXZpYXRpb25zID0gcmVxdWlyZSgnLi9zdW1fbnRoX3Bvd2VyX2RldmlhdGlvbnMnKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgW3ZhcmlhbmNlXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1ZhcmlhbmNlKVxyXG4gKiBpcyB0aGUgc3VtIG9mIHNxdWFyZWQgZGV2aWF0aW9ucyBmcm9tIHRoZSBtZWFuLlxyXG4gKlxyXG4gKiBUaGlzIGlzIGFuIGltcGxlbWVudGF0aW9uIG9mIHZhcmlhbmNlLCBub3Qgc2FtcGxlIHZhcmlhbmNlOlxyXG4gKiBzZWUgdGhlIGBzYW1wbGVWYXJpYW5jZWAgbWV0aG9kIGlmIHlvdSB3YW50IGEgc2FtcGxlIG1lYXN1cmUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0geCBhIHBvcHVsYXRpb25cclxuICogQHJldHVybnMge251bWJlcn0gdmFyaWFuY2U6IGEgdmFsdWUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHplcm8uXHJcbiAqIHplcm8gaW5kaWNhdGVzIHRoYXQgYWxsIHZhbHVlcyBhcmUgaWRlbnRpY2FsLlxyXG4gKiBAZXhhbXBsZVxyXG4gKiBzcy52YXJpYW5jZShbMSwgMiwgMywgNCwgNSwgNl0pOyAvLz0gMi45MTdcclxuICovXHJcbmZ1bmN0aW9uIHZhcmlhbmNlKHgvKjogQXJyYXk8bnVtYmVyPiAqLykvKjpudW1iZXIqLyB7XHJcbiAgICAvLyBUaGUgdmFyaWFuY2Ugb2Ygbm8gbnVtYmVycyBpcyBudWxsXHJcbiAgICBpZiAoeC5sZW5ndGggPT09IDApIHsgcmV0dXJuIE5hTjsgfVxyXG5cclxuICAgIC8vIEZpbmQgdGhlIG1lYW4gb2Ygc3F1YXJlZCBkZXZpYXRpb25zIGJldHdlZW4gdGhlXHJcbiAgICAvLyBtZWFuIHZhbHVlIGFuZCBlYWNoIHZhbHVlLlxyXG4gICAgcmV0dXJuIHN1bU50aFBvd2VyRGV2aWF0aW9ucyh4LCAyKSAvIHgubGVuZ3RoO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHZhcmlhbmNlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8qIEBmbG93ICovXHJcblxyXG4vKipcclxuICogVGhlIFtaLVNjb3JlLCBvciBTdGFuZGFyZCBTY29yZV0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TdGFuZGFyZF9zY29yZSkuXHJcbiAqXHJcbiAqIFRoZSBzdGFuZGFyZCBzY29yZSBpcyB0aGUgbnVtYmVyIG9mIHN0YW5kYXJkIGRldmlhdGlvbnMgYW4gb2JzZXJ2YXRpb25cclxuICogb3IgZGF0dW0gaXMgYWJvdmUgb3IgYmVsb3cgdGhlIG1lYW4uIFRodXMsIGEgcG9zaXRpdmUgc3RhbmRhcmQgc2NvcmVcclxuICogcmVwcmVzZW50cyBhIGRhdHVtIGFib3ZlIHRoZSBtZWFuLCB3aGlsZSBhIG5lZ2F0aXZlIHN0YW5kYXJkIHNjb3JlXHJcbiAqIHJlcHJlc2VudHMgYSBkYXR1bSBiZWxvdyB0aGUgbWVhbi4gSXQgaXMgYSBkaW1lbnNpb25sZXNzIHF1YW50aXR5XHJcbiAqIG9idGFpbmVkIGJ5IHN1YnRyYWN0aW5nIHRoZSBwb3B1bGF0aW9uIG1lYW4gZnJvbSBhbiBpbmRpdmlkdWFsIHJhd1xyXG4gKiBzY29yZSBhbmQgdGhlbiBkaXZpZGluZyB0aGUgZGlmZmVyZW5jZSBieSB0aGUgcG9wdWxhdGlvbiBzdGFuZGFyZFxyXG4gKiBkZXZpYXRpb24uXHJcbiAqXHJcbiAqIFRoZSB6LXNjb3JlIGlzIG9ubHkgZGVmaW5lZCBpZiBvbmUga25vd3MgdGhlIHBvcHVsYXRpb24gcGFyYW1ldGVycztcclxuICogaWYgb25lIG9ubHkgaGFzIGEgc2FtcGxlIHNldCwgdGhlbiB0aGUgYW5hbG9nb3VzIGNvbXB1dGF0aW9uIHdpdGhcclxuICogc2FtcGxlIG1lYW4gYW5kIHNhbXBsZSBzdGFuZGFyZCBkZXZpYXRpb24geWllbGRzIHRoZVxyXG4gKiBTdHVkZW50J3MgdC1zdGF0aXN0aWMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtZWFuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFuZGFyZERldmlhdGlvblxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IHogc2NvcmVcclxuICogQGV4YW1wbGVcclxuICogc3MuelNjb3JlKDc4LCA4MCwgNSk7IC8vPSAtMC40XHJcbiAqL1xyXG5mdW5jdGlvbiB6U2NvcmUoeC8qOm51bWJlciovLCBtZWFuLyo6bnVtYmVyKi8sIHN0YW5kYXJkRGV2aWF0aW9uLyo6bnVtYmVyKi8pLyo6bnVtYmVyKi8ge1xyXG4gICAgcmV0dXJuICh4IC0gbWVhbikgLyBzdGFuZGFyZERldmlhdGlvbjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB6U2NvcmU7XHJcbiIsImltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJ0Q29uZmlnIHtcclxuICAgIGNzc0NsYXNzUHJlZml4ID0gXCJvZGMtXCI7XHJcbiAgICBzdmdDbGFzcyA9IHRoaXMuY3NzQ2xhc3NQcmVmaXggKyAnbXctZDMtY2hhcnQnO1xyXG4gICAgd2lkdGggPSB1bmRlZmluZWQ7XHJcbiAgICBoZWlnaHQgPSB1bmRlZmluZWQ7XHJcbiAgICBtYXJnaW4gPSB7XHJcbiAgICAgICAgbGVmdDogNTAsXHJcbiAgICAgICAgcmlnaHQ6IDMwLFxyXG4gICAgICAgIHRvcDogMzAsXHJcbiAgICAgICAgYm90dG9tOiA1MFxyXG4gICAgfTtcclxuICAgIHNob3dUb29sdGlwID0gZmFsc2U7XHJcbiAgICB0cmFuc2l0aW9uID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pIHtcclxuICAgICAgICBpZiAoY3VzdG9tKSB7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJ0IHtcclxuICAgIHV0aWxzID0gVXRpbHM7XHJcbiAgICBiYXNlQ29udGFpbmVyO1xyXG4gICAgc3ZnO1xyXG4gICAgY29uZmlnO1xyXG4gICAgcGxvdCA9IHtcclxuICAgICAgICBtYXJnaW46IHt9XHJcbiAgICB9O1xyXG4gICAgX2F0dGFjaGVkID0ge307XHJcbiAgICBfbGF5ZXJzID0ge307XHJcbiAgICBfZXZlbnRzID0ge307XHJcbiAgICBfaXNBdHRhY2hlZDtcclxuICAgIF9pc0luaXRpYWxpemVkPWZhbHNlO1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihiYXNlLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9pc0F0dGFjaGVkID0gYmFzZSBpbnN0YW5jZW9mIENoYXJ0O1xyXG5cclxuICAgICAgICB0aGlzLmJhc2VDb250YWluZXIgPSBiYXNlO1xyXG5cclxuICAgICAgICB0aGlzLnNldENvbmZpZyhjb25maWcpO1xyXG5cclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgICB0aGlzLnBvc3RJbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZykge1xyXG4gICAgICAgIGlmICghY29uZmlnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gbmV3IENoYXJ0Q29uZmlnKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRhKGRhdGEpIHtcclxuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHJcbiAgICAgICAgc2VsZi5pbml0UGxvdCgpO1xyXG4gICAgICAgIHNlbGYuaW5pdFN2ZygpO1xyXG5cclxuICAgICAgICBzZWxmLmluaXRUb29sdGlwKCk7XHJcbiAgICAgICAgc2VsZi5kcmF3KCk7XHJcbiAgICAgICAgdGhpcy5faXNJbml0aWFsaXplZD10cnVlO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHBvc3RJbml0KCl7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXRTdmcoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBjb25maWcgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICBjb25zb2xlLmxvZyhjb25maWcuc3ZnQ2xhc3MpO1xyXG5cclxuICAgICAgICB2YXIgbWFyZ2luID0gc2VsZi5wbG90Lm1hcmdpbjtcclxuICAgICAgICB2YXIgd2lkdGggPSBzZWxmLnBsb3Qud2lkdGggKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodDtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gc2VsZi5wbG90LmhlaWdodCArIG1hcmdpbi50b3AgKyBtYXJnaW4uYm90dG9tO1xyXG4gICAgICAgIHZhciBhc3BlY3QgPSB3aWR0aCAvIGhlaWdodDtcclxuICAgICAgICBpZighc2VsZi5faXNBdHRhY2hlZCl7XHJcbiAgICAgICAgICAgIGlmKCF0aGlzLl9pc0luaXRpYWxpemVkKXtcclxuICAgICAgICAgICAgICAgIGQzLnNlbGVjdChzZWxmLmJhc2VDb250YWluZXIpLnNlbGVjdChcInN2Z1wiKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZWxmLnN2ZyA9IGQzLnNlbGVjdChzZWxmLmJhc2VDb250YWluZXIpLnNlbGVjdE9yQXBwZW5kKFwic3ZnXCIpO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5zdmdcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgd2lkdGgpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBoZWlnaHQpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInZpZXdCb3hcIiwgXCIwIDAgXCIgKyBcIiBcIiArIHdpZHRoICsgXCIgXCIgKyBoZWlnaHQpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInByZXNlcnZlQXNwZWN0UmF0aW9cIiwgXCJ4TWlkWU1pZCBtZWV0XCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGNvbmZpZy5zdmdDbGFzcyk7XHJcbiAgICAgICAgICAgIHNlbGYuc3ZnRyA9IHNlbGYuc3ZnLnNlbGVjdE9yQXBwZW5kKFwiZy5tYWluLWdyb3VwXCIpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLmJhc2VDb250YWluZXIpO1xyXG4gICAgICAgICAgICBzZWxmLnN2ZyA9IHNlbGYuYmFzZUNvbnRhaW5lci5zdmc7XHJcbiAgICAgICAgICAgIHNlbGYuc3ZnRyA9IHNlbGYuc3ZnLnNlbGVjdE9yQXBwZW5kKFwiZy5tYWluLWdyb3VwLlwiK2NvbmZpZy5zdmdDbGFzcylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlbGYuc3ZnRy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgbWFyZ2luLmxlZnQgKyBcIixcIiArIG1hcmdpbi50b3AgKyBcIilcIik7XHJcblxyXG4gICAgICAgIGlmICghY29uZmlnLndpZHRoIHx8IGNvbmZpZy5oZWlnaHQpIHtcclxuICAgICAgICAgICAgZDMuc2VsZWN0KHdpbmRvdylcclxuICAgICAgICAgICAgICAgIC5vbihcInJlc2l6ZVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9UT0RPIGFkZCByZXNwb25zaXZlbmVzcyBpZiB3aWR0aC9oZWlnaHQgbm90IHNwZWNpZmllZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXRUb29sdGlwKCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy5zaG93VG9vbHRpcCkge1xyXG4gICAgICAgICAgICBpZighc2VsZi5faXNBdHRhY2hlZCApe1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wbG90LnRvb2x0aXAgPSBkMy5zZWxlY3QoXCJib2R5XCIpLnNlbGVjdE9yQXBwZW5kKCdkaXYuJytzZWxmLmNvbmZpZy5jc3NDbGFzc1ByZWZpeCsndG9vbHRpcCcpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QudG9vbHRpcD0gc2VsZi5iYXNlQ29udGFpbmVyLnBsb3QudG9vbHRpcDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKSB7XHJcbiAgICAgICAgdmFyIG1hcmdpbiA9IHRoaXMuY29uZmlnLm1hcmdpbjtcclxuICAgICAgICB0aGlzLnBsb3QgPSB0aGlzLnBsb3QgfHwge307XHJcbiAgICAgICAgdGhpcy5wbG90Lm1hcmdpbiA9IHtcclxuICAgICAgICAgICAgdG9wOiBtYXJnaW4udG9wLFxyXG4gICAgICAgICAgICBib3R0b206IG1hcmdpbi5ib3R0b20sXHJcbiAgICAgICAgICAgIGxlZnQ6IG1hcmdpbi5sZWZ0LFxyXG4gICAgICAgICAgICByaWdodDogbWFyZ2luLnJpZ2h0XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZGF0YSkge1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YShkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGxheWVyTmFtZSwgYXR0YWNobWVudERhdGE7XHJcbiAgICAgICAgZm9yICh2YXIgYXR0YWNobWVudE5hbWUgaW4gdGhpcy5fYXR0YWNoZWQpIHtcclxuXHJcbiAgICAgICAgICAgIGF0dGFjaG1lbnREYXRhID0gZGF0YTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2F0dGFjaGVkW2F0dGFjaG1lbnROYW1lXS51cGRhdGUoYXR0YWNobWVudERhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBkcmF3KGRhdGEpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZShkYXRhKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvL0JvcnJvd2VkIGZyb20gZDMuY2hhcnRcclxuICAgIC8qKlxyXG4gICAgICogUmVnaXN0ZXIgb3IgcmV0cmlldmUgYW4gXCJhdHRhY2htZW50XCIgQ2hhcnQuIFRoZSBcImF0dGFjaG1lbnRcIiBjaGFydCdzIGBkcmF3YFxyXG4gICAgICogbWV0aG9kIHdpbGwgYmUgaW52b2tlZCB3aGVuZXZlciB0aGUgY29udGFpbmluZyBjaGFydCdzIGBkcmF3YCBtZXRob2QgaXNcclxuICAgICAqIGludm9rZWQuXHJcbiAgICAgKlxyXG4gICAgICogQGV4dGVybmFsRXhhbXBsZSBjaGFydC1hdHRhY2hcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXR0YWNobWVudE5hbWUgTmFtZSBvZiB0aGUgYXR0YWNobWVudFxyXG4gICAgICogQHBhcmFtIHtDaGFydH0gW2NoYXJ0XSBDaGFydCB0byByZWdpc3RlciBhcyBhIG1peCBpbiBvZiB0aGlzIGNoYXJ0LiBXaGVuXHJcbiAgICAgKiAgICAgICAgdW5zcGVjaWZpZWQsIHRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIHRoZSBhdHRhY2htZW50IHByZXZpb3VzbHlcclxuICAgICAqICAgICAgICByZWdpc3RlcmVkIHdpdGggdGhlIHNwZWNpZmllZCBgYXR0YWNobWVudE5hbWVgIChpZiBhbnkpLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtDaGFydH0gUmVmZXJlbmNlIHRvIHRoaXMgY2hhcnQgKGNoYWluYWJsZSkuXHJcbiAgICAgKi9cclxuICAgIGF0dGFjaChhdHRhY2htZW50TmFtZSwgY2hhcnQpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXR0YWNoZWRbYXR0YWNobWVudE5hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fYXR0YWNoZWRbYXR0YWNobWVudE5hbWVdID0gY2hhcnQ7XHJcbiAgICAgICAgcmV0dXJuIGNoYXJ0O1xyXG4gICAgfTtcclxuXHJcbiAgICBcclxuXHJcbiAgICAvL0JvcnJvd2VkIGZyb20gZDMuY2hhcnRcclxuICAgIC8qKlxyXG4gICAgICogU3Vic2NyaWJlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYW4gZXZlbnQgdHJpZ2dlcmVkIG9uIHRoZSBjaGFydC4gU2VlIHtAbGlua1xyXG4gICAgICAgICogQ2hhcnQjb25jZX0gdG8gc3Vic2NyaWJlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYW4gZXZlbnQgZm9yIG9uZSBvY2N1cmVuY2UuXHJcbiAgICAgKlxyXG4gICAgICogQGV4dGVybmFsRXhhbXBsZSB7cnVubmFibGV9IGNoYXJ0LW9uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgZXZlbnRcclxuICAgICAqIEBwYXJhbSB7Q2hhcnRFdmVudEhhbmRsZXJ9IGNhbGxiYWNrIEZ1bmN0aW9uIHRvIGJlIGludm9rZWQgd2hlbiB0aGUgZXZlbnRcclxuICAgICAqICAgICAgICBvY2N1cnNcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF0gVmFsdWUgdG8gc2V0IGFzIGB0aGlzYCB3aGVuIGludm9raW5nIHRoZVxyXG4gICAgICogICAgICAgIGBjYWxsYmFja2AuIERlZmF1bHRzIHRvIHRoZSBjaGFydCBpbnN0YW5jZS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Q2hhcnR9IEEgcmVmZXJlbmNlIHRvIHRoaXMgY2hhcnQgKGNoYWluYWJsZSkuXHJcbiAgICAgKi9cclxuICAgIG9uKG5hbWUsIGNhbGxiYWNrLCBjb250ZXh0KSB7XHJcbiAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50c1tuYW1lXSB8fCAodGhpcy5fZXZlbnRzW25hbWVdID0gW10pO1xyXG4gICAgICAgIGV2ZW50cy5wdXNoKHtcclxuICAgICAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxyXG4gICAgICAgICAgICBjb250ZXh0OiBjb250ZXh0IHx8IHRoaXMsXHJcbiAgICAgICAgICAgIF9jaGFydDogdGhpc1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vQm9ycm93ZWQgZnJvbSBkMy5jaGFydFxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogU3Vic2NyaWJlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYW4gZXZlbnQgdHJpZ2dlcmVkIG9uIHRoZSBjaGFydC4gVGhpc1xyXG4gICAgICogZnVuY3Rpb24gd2lsbCBiZSBpbnZva2VkIGF0IHRoZSBuZXh0IG9jY3VyYW5jZSBvZiB0aGUgZXZlbnQgYW5kIGltbWVkaWF0ZWx5XHJcbiAgICAgKiB1bnN1YnNjcmliZWQuIFNlZSB7QGxpbmsgQ2hhcnQjb259IHRvIHN1YnNjcmliZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGFuXHJcbiAgICAgKiBldmVudCBpbmRlZmluaXRlbHkuXHJcbiAgICAgKlxyXG4gICAgICogQGV4dGVybmFsRXhhbXBsZSB7cnVubmFibGV9IGNoYXJ0LW9uY2VcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBldmVudFxyXG4gICAgICogQHBhcmFtIHtDaGFydEV2ZW50SGFuZGxlcn0gY2FsbGJhY2sgRnVuY3Rpb24gdG8gYmUgaW52b2tlZCB3aGVuIHRoZSBldmVudFxyXG4gICAgICogICAgICAgIG9jY3Vyc1xyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0XSBWYWx1ZSB0byBzZXQgYXMgYHRoaXNgIHdoZW4gaW52b2tpbmcgdGhlXHJcbiAgICAgKiAgICAgICAgYGNhbGxiYWNrYC4gRGVmYXVsdHMgdG8gdGhlIGNoYXJ0IGluc3RhbmNlXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0NoYXJ0fSBBIHJlZmVyZW5jZSB0byB0aGlzIGNoYXJ0IChjaGFpbmFibGUpXHJcbiAgICAgKi9cclxuICAgIG9uY2UobmFtZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG9uY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYub2ZmKG5hbWUsIG9uY2UpO1xyXG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub24obmFtZSwgb25jZSwgY29udGV4dCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vQm9ycm93ZWQgZnJvbSBkMy5jaGFydFxyXG4gICAgLyoqXHJcbiAgICAgKiBVbnN1YnNjcmliZSBvbmUgb3IgbW9yZSBjYWxsYmFjayBmdW5jdGlvbnMgZnJvbSBhbiBldmVudCB0cmlnZ2VyZWQgb24gdGhlXHJcbiAgICAgKiBjaGFydC4gV2hlbiBubyBhcmd1bWVudHMgYXJlIHNwZWNpZmllZCwgKmFsbCogaGFuZGxlcnMgd2lsbCBiZSB1bnN1YnNjcmliZWQuXHJcbiAgICAgKiBXaGVuIG9ubHkgYSBgbmFtZWAgaXMgc3BlY2lmaWVkLCBhbGwgaGFuZGxlcnMgc3Vic2NyaWJlZCB0byB0aGF0IGV2ZW50IHdpbGxcclxuICAgICAqIGJlIHVuc3Vic2NyaWJlZC4gV2hlbiBhIGBuYW1lYCBhbmQgYGNhbGxiYWNrYCBhcmUgc3BlY2lmaWVkLCBvbmx5IHRoYXRcclxuICAgICAqIGZ1bmN0aW9uIHdpbGwgYmUgdW5zdWJzY3JpYmVkIGZyb20gdGhhdCBldmVudC4gV2hlbiBhIGBuYW1lYCBhbmQgYGNvbnRleHRgXHJcbiAgICAgKiBhcmUgc3BlY2lmaWVkIChidXQgYGNhbGxiYWNrYCBpcyBvbWl0dGVkKSwgYWxsIGV2ZW50cyBib3VuZCB0byB0aGUgZ2l2ZW5cclxuICAgICAqIGV2ZW50IHdpdGggdGhlIGdpdmVuIGNvbnRleHQgd2lsbCBiZSB1bnN1YnNjcmliZWQuXHJcbiAgICAgKlxyXG4gICAgICogQGV4dGVybmFsRXhhbXBsZSB7cnVubmFibGV9IGNoYXJ0LW9mZlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbbmFtZV0gTmFtZSBvZiB0aGUgZXZlbnQgdG8gYmUgdW5zdWJzY3JpYmVkXHJcbiAgICAgKiBAcGFyYW0ge0NoYXJ0RXZlbnRIYW5kbGVyfSBbY2FsbGJhY2tdIEZ1bmN0aW9uIHRvIGJlIHVuc3Vic2NyaWJlZFxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0XSBDb250ZXh0cyB0byBiZSB1bnN1YnNjcmliZVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtDaGFydH0gQSByZWZlcmVuY2UgdG8gdGhpcyBjaGFydCAoY2hhaW5hYmxlKS5cclxuICAgICAqL1xyXG5cclxuICAgIG9mZihuYW1lLCBjYWxsYmFjaywgY29udGV4dCkge1xyXG4gICAgICAgIHZhciBuYW1lcywgbiwgZXZlbnRzLCBldmVudCwgaSwgajtcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIGFsbCBldmVudHNcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBmb3IgKG5hbWUgaW4gdGhpcy5fZXZlbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbbmFtZV0ubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSBhbGwgZXZlbnRzIGZvciBhIHNwZWNpZmljIG5hbWVcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICBldmVudHMgPSB0aGlzLl9ldmVudHNbbmFtZV07XHJcbiAgICAgICAgICAgIGlmIChldmVudHMpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50cy5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIGFsbCBldmVudHMgdGhhdCBtYXRjaCB3aGF0ZXZlciBjb21iaW5hdGlvbiBvZiBuYW1lLCBjb250ZXh0XHJcbiAgICAgICAgLy8gYW5kIGNhbGxiYWNrLlxyXG4gICAgICAgIG5hbWVzID0gbmFtZSA/IFtuYW1lXSA6IE9iamVjdC5rZXlzKHRoaXMuX2V2ZW50cyk7XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIG4gPSBuYW1lc1tpXTtcclxuICAgICAgICAgICAgZXZlbnRzID0gdGhpcy5fZXZlbnRzW25dO1xyXG4gICAgICAgICAgICBqID0gZXZlbnRzLmxlbmd0aDtcclxuICAgICAgICAgICAgd2hpbGUgKGotLSkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQgPSBldmVudHNbal07XHJcbiAgICAgICAgICAgICAgICBpZiAoKGNhbGxiYWNrICYmIGNhbGxiYWNrID09PSBldmVudC5jYWxsYmFjaykgfHxcclxuICAgICAgICAgICAgICAgICAgICAoY29udGV4dCAmJiBjb250ZXh0ID09PSBldmVudC5jb250ZXh0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy5zcGxpY2UoaiwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvL0JvcnJvd2VkIGZyb20gZDMuY2hhcnRcclxuICAgIC8qKlxyXG4gICAgICogUHVibGlzaCBhbiBldmVudCBvbiB0aGlzIGNoYXJ0IHdpdGggdGhlIGdpdmVuIGBuYW1lYC5cclxuICAgICAqXHJcbiAgICAgKiBAZXh0ZXJuYWxFeGFtcGxlIHtydW5uYWJsZX0gY2hhcnQtdHJpZ2dlclxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGV2ZW50IHRvIHB1Ymxpc2hcclxuICAgICAqIEBwYXJhbSB7Li4uKn0gYXJndW1lbnRzIFZhbHVlcyB3aXRoIHdoaWNoIHRvIGludm9rZSB0aGUgcmVnaXN0ZXJlZFxyXG4gICAgICogICAgICAgIGNhbGxiYWNrcy5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Q2hhcnR9IEEgcmVmZXJlbmNlIHRvIHRoaXMgY2hhcnQgKGNoYWluYWJsZSkuXHJcbiAgICAgKi9cclxuICAgIHRyaWdnZXIobmFtZSkge1xyXG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcclxuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy5fZXZlbnRzW25hbWVdO1xyXG4gICAgICAgIHZhciBpLCBldjtcclxuXHJcbiAgICAgICAgaWYgKGV2ZW50cyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGV2ID0gZXZlbnRzW2ldO1xyXG4gICAgICAgICAgICAgICAgZXYuY2FsbGJhY2suYXBwbHkoZXYuY29udGV4dCwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIGdldEJhc2VDb250YWluZXIoKXtcclxuICAgICAgICBpZih0aGlzLl9pc0F0dGFjaGVkKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFzZUNvbnRhaW5lci5zdmc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkMy5zZWxlY3QodGhpcy5iYXNlQ29udGFpbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRCYXNlQ29udGFpbmVyTm9kZSgpe1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRCYXNlQ29udGFpbmVyKCkubm9kZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByZWZpeENsYXNzKGNsYXp6LCBhZGREb3Qpe1xyXG4gICAgICAgIHJldHVybiBhZGREb3Q/ICcuJzogJycrdGhpcy5jb25maWcuY3NzQ2xhc3NQcmVmaXgrY2xheno7XHJcbiAgICB9XHJcbiAgICBjb21wdXRlUGxvdFNpemUoKSB7XHJcbiAgICAgICAgdGhpcy5wbG90LndpZHRoID0gVXRpbHMuYXZhaWxhYmxlV2lkdGgodGhpcy5jb25maWcud2lkdGgsIHRoaXMuZ2V0QmFzZUNvbnRhaW5lcigpLCB0aGlzLnBsb3QubWFyZ2luKTtcclxuICAgICAgICB0aGlzLnBsb3QuaGVpZ2h0ID0gVXRpbHMuYXZhaWxhYmxlSGVpZ2h0KHRoaXMuY29uZmlnLmhlaWdodCwgdGhpcy5nZXRCYXNlQ29udGFpbmVyKCksIHRoaXMucGxvdC5tYXJnaW4pO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zaXRpb25FbmFibGVkKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzSW5pdGlhbGl6ZWQgJiYgdGhpcy5jb25maWcudHJhbnNpdGlvbjtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NoYXJ0LCBDaGFydENvbmZpZ30gZnJvbSBcIi4vY2hhcnRcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IHtTdGF0aXN0aWNzVXRpbHN9IGZyb20gJy4vc3RhdGlzdGljcy11dGlscydcclxuaW1wb3J0IHtMZWdlbmR9IGZyb20gJy4vbGVnZW5kJ1xyXG5pbXBvcnQge1NjYXR0ZXJQbG90fSBmcm9tICcuL3NjYXR0ZXJwbG90J1xyXG5cclxuZXhwb3J0IGNsYXNzIENvcnJlbGF0aW9uTWF0cml4Q29uZmlnIGV4dGVuZHMgQ2hhcnRDb25maWcge1xyXG5cclxuICAgIHN2Z0NsYXNzID0gdGhpcy5jc3NDbGFzc1ByZWZpeCsnY29ycmVsYXRpb24tbWF0cml4JztcclxuICAgIGd1aWRlcyA9IGZhbHNlOyAvL3Nob3cgYXhpcyBndWlkZXNcclxuICAgIHNob3dUb29sdGlwID0gdHJ1ZTsgLy9zaG93IHRvb2x0aXAgb24gZG90IGhvdmVyXHJcbiAgICBzaG93TGVnZW5kID0gdHJ1ZTtcclxuICAgIGhpZ2hsaWdodExhYmVscyA9IHRydWU7XHJcbiAgICByb3RhdGVMYWJlbHNYID0gdHJ1ZTtcclxuICAgIHJvdGF0ZUxhYmVsc1kgPSB0cnVlO1xyXG4gICAgdmFyaWFibGVzID0ge1xyXG4gICAgICAgIGxhYmVsczogdW5kZWZpbmVkLFxyXG4gICAgICAgIGtleXM6IFtdLCAvL29wdGlvbmFsIGFycmF5IG9mIHZhcmlhYmxlIGtleXNcclxuICAgICAgICB2YWx1ZTogKGQsIHZhcmlhYmxlS2V5KSA9PiBkW3ZhcmlhYmxlS2V5XSwgLy8gdmFyaWFibGUgdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICBzY2FsZTogXCJvcmRpbmFsXCJcclxuICAgIH07XHJcbiAgICBjb3JyZWxhdGlvbiA9IHtcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIixcclxuICAgICAgICBkb21haW46IFstMSwgLTAuNzUsIC0wLjUsIDAsIDAuNSwgMC43NSwgMV0sXHJcbiAgICAgICAgcmFuZ2U6IFtcImRhcmtibHVlXCIsIFwiYmx1ZVwiLCBcImxpZ2h0c2t5Ymx1ZVwiLCBcIndoaXRlXCIsIFwib3JhbmdlcmVkXCIsIFwiY3JpbXNvblwiLCBcImRhcmtyZWRcIl0sXHJcbiAgICAgICAgdmFsdWU6ICh4VmFsdWVzLCB5VmFsdWVzKSA9PiBTdGF0aXN0aWNzVXRpbHMuc2FtcGxlQ29ycmVsYXRpb24oeFZhbHVlcywgeVZhbHVlcylcclxuXHJcbiAgICB9O1xyXG4gICAgY2VsbCA9IHtcclxuICAgICAgICBzaGFwZTogXCJlbGxpcHNlXCIsIC8vcG9zc2libGUgdmFsdWVzOiByZWN0LCBjaXJjbGUsIGVsbGlwc2VcclxuICAgICAgICBzaXplOiB1bmRlZmluZWQsXHJcbiAgICAgICAgc2l6ZU1pbjogMTUsXHJcbiAgICAgICAgc2l6ZU1heDogMjUwLFxyXG4gICAgICAgIHBhZGRpbmc6IDFcclxuICAgIH07XHJcbiAgICBtYXJnaW4gPSB7XHJcbiAgICAgICAgbGVmdDogNjAsXHJcbiAgICAgICAgcmlnaHQ6IDUwLFxyXG4gICAgICAgIHRvcDogMzAsXHJcbiAgICAgICAgYm90dG9tOiA2MFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIGlmIChjdXN0b20pIHtcclxuICAgICAgICAgICAgVXRpbHMuZGVlcEV4dGVuZCh0aGlzLCBjdXN0b20pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENvcnJlbGF0aW9uTWF0cml4IGV4dGVuZHMgQ2hhcnQge1xyXG4gICAgY29uc3RydWN0b3IocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIocGxhY2Vob2xkZXJTZWxlY3RvciwgZGF0YSwgbmV3IENvcnJlbGF0aW9uTWF0cml4Q29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0Q29uZmlnKG5ldyBDb3JyZWxhdGlvbk1hdHJpeENvbmZpZyhjb25maWcpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdFBsb3QoKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG1hcmdpbiA9IHRoaXMuY29uZmlnLm1hcmdpbjtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueCA9IHt9O1xyXG4gICAgICAgIHRoaXMucGxvdC5jb3JyZWxhdGlvbiA9IHtcclxuICAgICAgICAgICAgbWF0cml4OiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGNlbGxzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGNvbG9yOiB7fSxcclxuICAgICAgICAgICAgc2hhcGU6IHt9XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBWYXJpYWJsZXMoKTtcclxuICAgICAgICB2YXIgd2lkdGggPSBjb25mLndpZHRoO1xyXG4gICAgICAgIHZhciBwbGFjZWhvbGRlck5vZGUgPSB0aGlzLmdldEJhc2VDb250YWluZXJOb2RlKCk7XHJcbiAgICAgICAgdGhpcy5wbG90LnBsYWNlaG9sZGVyTm9kZSA9IHBsYWNlaG9sZGVyTm9kZTtcclxuXHJcbiAgICAgICAgdmFyIHBhcmVudFdpZHRoID0gcGxhY2Vob2xkZXJOb2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xyXG4gICAgICAgIGlmICh3aWR0aCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLnBsb3QuY2VsbFNpemUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsU2l6ZSA9IE1hdGgubWF4KGNvbmYuY2VsbC5zaXplTWluLCBNYXRoLm1pbihjb25mLmNlbGwuc2l6ZU1heCwgKHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQpIC8gdGhpcy5wbG90LnZhcmlhYmxlcy5sZW5ndGgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuY2VsbFNpemUgPSB0aGlzLmNvbmZpZy5jZWxsLnNpemU7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMucGxvdC5jZWxsU2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxTaXplID0gTWF0aC5tYXgoY29uZi5jZWxsLnNpemVNaW4sIE1hdGgubWluKGNvbmYuY2VsbC5zaXplTWF4LCAocGFyZW50V2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodCkgLyB0aGlzLnBsb3QudmFyaWFibGVzLmxlbmd0aCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB3aWR0aCA9IHRoaXMucGxvdC5jZWxsU2l6ZSAqIHRoaXMucGxvdC52YXJpYWJsZXMubGVuZ3RoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQ7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGhlaWdodCA9IHdpZHRoO1xyXG4gICAgICAgIGlmICghaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGhlaWdodCA9IHBsYWNlaG9sZGVyTm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnBsb3Qud2lkdGggPSB3aWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0O1xyXG4gICAgICAgIHRoaXMucGxvdC5oZWlnaHQgPSB0aGlzLnBsb3Qud2lkdGg7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBWYXJpYWJsZXNTY2FsZXMoKTtcclxuICAgICAgICB0aGlzLnNldHVwQ29ycmVsYXRpb25TY2FsZXMoKTtcclxuICAgICAgICB0aGlzLnNldHVwQ29ycmVsYXRpb25NYXRyaXgoKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwVmFyaWFibGVzU2NhbGVzKCkge1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgeCA9IHBsb3QueDtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnLnZhcmlhYmxlcztcclxuXHJcbiAgICAgICAgLyogKlxyXG4gICAgICAgICAqIHZhbHVlIGFjY2Vzc29yIC0gcmV0dXJucyB0aGUgdmFsdWUgdG8gZW5jb2RlIGZvciBhIGdpdmVuIGRhdGEgb2JqZWN0LlxyXG4gICAgICAgICAqIHNjYWxlIC0gbWFwcyB2YWx1ZSB0byBhIHZpc3VhbCBkaXNwbGF5IGVuY29kaW5nLCBzdWNoIGFzIGEgcGl4ZWwgcG9zaXRpb24uXHJcbiAgICAgICAgICogbWFwIGZ1bmN0aW9uIC0gbWFwcyBmcm9tIGRhdGEgdmFsdWUgdG8gZGlzcGxheSB2YWx1ZVxyXG4gICAgICAgICAqIGF4aXMgLSBzZXRzIHVwIGF4aXNcclxuICAgICAgICAgKiovXHJcbiAgICAgICAgeC52YWx1ZSA9IGNvbmYudmFsdWU7XHJcbiAgICAgICAgeC5zY2FsZSA9IGQzLnNjYWxlW2NvbmYuc2NhbGVdKCkucmFuZ2VCYW5kcyhbcGxvdC53aWR0aCwgMF0pO1xyXG4gICAgICAgIHgubWFwID0gZCA9PiB4LnNjYWxlKHgudmFsdWUoZCkpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2V0dXBDb3JyZWxhdGlvblNjYWxlcygpIHtcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgY29yckNvbmYgPSB0aGlzLmNvbmZpZy5jb3JyZWxhdGlvbjtcclxuXHJcbiAgICAgICAgcGxvdC5jb3JyZWxhdGlvbi5jb2xvci5zY2FsZSA9IGQzLnNjYWxlW2NvcnJDb25mLnNjYWxlXSgpLmRvbWFpbihjb3JyQ29uZi5kb21haW4pLnJhbmdlKGNvcnJDb25mLnJhbmdlKTtcclxuICAgICAgICB2YXIgc2hhcGUgPSBwbG90LmNvcnJlbGF0aW9uLnNoYXBlID0ge307XHJcblxyXG4gICAgICAgIHZhciBjZWxsQ29uZiA9IHRoaXMuY29uZmlnLmNlbGw7XHJcbiAgICAgICAgc2hhcGUudHlwZSA9IGNlbGxDb25mLnNoYXBlO1xyXG5cclxuICAgICAgICB2YXIgc2hhcGVTaXplID0gcGxvdC5jZWxsU2l6ZSAtIGNlbGxDb25mLnBhZGRpbmcgKiAyO1xyXG4gICAgICAgIGlmIChzaGFwZS50eXBlID09ICdjaXJjbGUnKSB7XHJcbiAgICAgICAgICAgIHZhciByYWRpdXNNYXggPSBzaGFwZVNpemUgLyAyO1xyXG4gICAgICAgICAgICBzaGFwZS5yYWRpdXNTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgMV0pLnJhbmdlKFsyLCByYWRpdXNNYXhdKTtcclxuICAgICAgICAgICAgc2hhcGUucmFkaXVzID0gYz0+IHNoYXBlLnJhZGl1c1NjYWxlKE1hdGguYWJzKGMudmFsdWUpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHNoYXBlLnR5cGUgPT0gJ2VsbGlwc2UnKSB7XHJcbiAgICAgICAgICAgIHZhciByYWRpdXNNYXggPSBzaGFwZVNpemUgLyAyO1xyXG4gICAgICAgICAgICBzaGFwZS5yYWRpdXNTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgMV0pLnJhbmdlKFtyYWRpdXNNYXgsIDJdKTtcclxuICAgICAgICAgICAgc2hhcGUucmFkaXVzWCA9IGM9PiBzaGFwZS5yYWRpdXNTY2FsZShNYXRoLmFicyhjLnZhbHVlKSk7XHJcbiAgICAgICAgICAgIHNoYXBlLnJhZGl1c1kgPSByYWRpdXNNYXg7XHJcblxyXG4gICAgICAgICAgICBzaGFwZS5yb3RhdGVWYWwgPSB2ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh2ID09IDApIHJldHVybiBcIjBcIjtcclxuICAgICAgICAgICAgICAgIGlmICh2IDwgMCkgcmV0dXJuIFwiLTQ1XCI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCI0NVwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHNoYXBlLnR5cGUgPT0gJ3JlY3QnKSB7XHJcbiAgICAgICAgICAgIHNoYXBlLnNpemUgPSBzaGFwZVNpemU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgc2V0dXBWYXJpYWJsZXMoKSB7XHJcblxyXG4gICAgICAgIHZhciB2YXJpYWJsZXNDb25mID0gdGhpcy5jb25maWcudmFyaWFibGVzO1xyXG5cclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICBwbG90LmRvbWFpbkJ5VmFyaWFibGUgPSB7fTtcclxuICAgICAgICBwbG90LnZhcmlhYmxlcyA9IHZhcmlhYmxlc0NvbmYua2V5cztcclxuICAgICAgICBpZiAoIXBsb3QudmFyaWFibGVzIHx8ICFwbG90LnZhcmlhYmxlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcGxvdC52YXJpYWJsZXMgPSBVdGlscy5pbmZlclZhcmlhYmxlcyhkYXRhLCB0aGlzLmNvbmZpZy5ncm91cHMua2V5LCB0aGlzLmNvbmZpZy5pbmNsdWRlSW5QbG90KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBsb3QubGFiZWxzID0gW107XHJcbiAgICAgICAgcGxvdC5sYWJlbEJ5VmFyaWFibGUgPSB7fTtcclxuICAgICAgICBwbG90LnZhcmlhYmxlcy5mb3JFYWNoKCh2YXJpYWJsZUtleSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgcGxvdC5kb21haW5CeVZhcmlhYmxlW3ZhcmlhYmxlS2V5XSA9IGQzLmV4dGVudChkYXRhLCAoZCkgPT4gdmFyaWFibGVzQ29uZi52YWx1ZShkLCB2YXJpYWJsZUtleSkpO1xyXG4gICAgICAgICAgICB2YXIgbGFiZWwgPSB2YXJpYWJsZUtleTtcclxuICAgICAgICAgICAgaWYgKHZhcmlhYmxlc0NvbmYubGFiZWxzICYmIHZhcmlhYmxlc0NvbmYubGFiZWxzLmxlbmd0aCA+IGluZGV4KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGFiZWwgPSB2YXJpYWJsZXNDb25mLmxhYmVsc1tpbmRleF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGxvdC5sYWJlbHMucHVzaChsYWJlbCk7XHJcbiAgICAgICAgICAgIHBsb3QubGFiZWxCeVZhcmlhYmxlW3ZhcmlhYmxlS2V5XSA9IGxhYmVsO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhwbG90LmxhYmVsQnlWYXJpYWJsZSk7XHJcblxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgc2V0dXBDb3JyZWxhdGlvbk1hdHJpeCgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgdmFyIG1hdHJpeCA9IHRoaXMucGxvdC5jb3JyZWxhdGlvbi5tYXRyaXggPSBbXTtcclxuICAgICAgICB2YXIgbWF0cml4Q2VsbHMgPSB0aGlzLnBsb3QuY29ycmVsYXRpb24ubWF0cml4LmNlbGxzID0gW107XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcblxyXG4gICAgICAgIHZhciB2YXJpYWJsZVRvVmFsdWVzID0ge307XHJcbiAgICAgICAgcGxvdC52YXJpYWJsZXMuZm9yRWFjaCgodiwgaSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgdmFyaWFibGVUb1ZhbHVlc1t2XSA9IGRhdGEubWFwKGQ9PnBsb3QueC52YWx1ZShkLCB2KSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHBsb3QudmFyaWFibGVzLmZvckVhY2goKHYxLCBpKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciByb3cgPSBbXTtcclxuICAgICAgICAgICAgbWF0cml4LnB1c2gocm93KTtcclxuXHJcbiAgICAgICAgICAgIHBsb3QudmFyaWFibGVzLmZvckVhY2goKHYyLCBqKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29yciA9IDE7XHJcbiAgICAgICAgICAgICAgICBpZiAodjEgIT0gdjIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb3JyID0gc2VsZi5jb25maWcuY29ycmVsYXRpb24udmFsdWUodmFyaWFibGVUb1ZhbHVlc1t2MV0sIHZhcmlhYmxlVG9WYWx1ZXNbdjJdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBjZWxsID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvd1ZhcjogdjEsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sVmFyOiB2MixcclxuICAgICAgICAgICAgICAgICAgICByb3c6IGksXHJcbiAgICAgICAgICAgICAgICAgICAgY29sOiBqLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjb3JyXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcm93LnB1c2goY2VsbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbWF0cml4Q2VsbHMucHVzaChjZWxsKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB1cGRhdGUobmV3RGF0YSkge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuICAgICAgICAvLyB0aGlzLnVwZGF0ZVxyXG4gICAgICAgIHRoaXMudXBkYXRlQ2VsbHMoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZhcmlhYmxlTGFiZWxzKCk7XHJcblxyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcuc2hvd0xlZ2VuZCkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxlZ2VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlVmFyaWFibGVMYWJlbHMoKSB7XHJcbiAgICAgICAgdGhpcy5wbG90LmxhYmVsQ2xhc3MgPSB0aGlzLnByZWZpeENsYXNzKFwibGFiZWxcIik7XHJcbiAgICAgICAgdGhpcy51cGRhdGVBeGlzWCgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQXhpc1koKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVBeGlzWCgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGxhYmVsQ2xhc3MgPSBwbG90LmxhYmVsQ2xhc3M7XHJcbiAgICAgICAgdmFyIGxhYmVsWENsYXNzID0gbGFiZWxDbGFzcyArIFwiLXhcIjtcclxuXHJcbiAgICAgICAgdmFyIGxhYmVscyA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgbGFiZWxYQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBsb3QudmFyaWFibGVzLCAoZCwgaSk9PmkpO1xyXG5cclxuICAgICAgICBsYWJlbHMuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpLmF0dHIoXCJjbGFzc1wiLCAoZCwgaSkgPT4gbGFiZWxDbGFzcyArIFwiIFwiICsgbGFiZWxYQ2xhc3MgKyBcIiBcIiArIGxhYmVsWENsYXNzICsgXCItXCIgKyBpKTtcclxuXHJcbiAgICAgICAgbGFiZWxzXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAoZCwgaSkgPT4gaSAqIHBsb3QuY2VsbFNpemUgKyBwbG90LmNlbGxTaXplIC8gMilcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIHBsb3QuaGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcImR4XCIsIC0yKVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIDUpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIilcclxuXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJoYW5naW5nXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KHY9PnBsb3QubGFiZWxCeVZhcmlhYmxlW3ZdKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnJvdGF0ZUxhYmVsc1gpIHtcclxuICAgICAgICAgICAgbGFiZWxzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwicm90YXRlKC00NSwgXCIgKyAoaSAqIHBsb3QuY2VsbFNpemUgKyBwbG90LmNlbGxTaXplIC8gMiAgKSArIFwiLCBcIiArIHBsb3QuaGVpZ2h0ICsgXCIpXCIpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbWF4V2lkdGggPSBzZWxmLmNvbXB1dGVYQXhpc0xhYmVsc1dpZHRoKCk7XHJcbiAgICAgICAgbGFiZWxzLmVhY2goZnVuY3Rpb24gKGxhYmVsKSB7XHJcbiAgICAgICAgICAgIFV0aWxzLnBsYWNlVGV4dFdpdGhFbGxpcHNpc0FuZFRvb2x0aXAoZDMuc2VsZWN0KHRoaXMpLCBsYWJlbCwgbWF4V2lkdGgsIHNlbGYuY29uZmlnLnNob3dUb29sdGlwID8gc2VsZi5wbG90LnRvb2x0aXAgOiBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxhYmVscy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlQXhpc1koKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBsYWJlbENsYXNzID0gcGxvdC5sYWJlbENsYXNzO1xyXG4gICAgICAgIHZhciBsYWJlbFlDbGFzcyA9IHBsb3QubGFiZWxDbGFzcyArIFwiLXlcIjtcclxuICAgICAgICB2YXIgbGFiZWxzID0gc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyBsYWJlbFlDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGxvdC52YXJpYWJsZXMpO1xyXG5cclxuICAgICAgICBsYWJlbHMuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpO1xyXG5cclxuICAgICAgICBsYWJlbHNcclxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAoZCwgaSkgPT4gaSAqIHBsb3QuY2VsbFNpemUgKyBwbG90LmNlbGxTaXplIC8gMilcclxuICAgICAgICAgICAgLmF0dHIoXCJkeFwiLCAtMilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIChkLCBpKSA9PiBsYWJlbENsYXNzICsgXCIgXCIgKyBsYWJlbFlDbGFzcyArIFwiIFwiICsgbGFiZWxZQ2xhc3MgKyBcIi1cIiArIGkpXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJoYW5naW5nXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KHY9PnBsb3QubGFiZWxCeVZhcmlhYmxlW3ZdKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnJvdGF0ZUxhYmVsc1kpIHtcclxuICAgICAgICAgICAgbGFiZWxzXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCAoZCwgaSkgPT4gXCJyb3RhdGUoLTQ1LCBcIiArIDAgKyBcIiwgXCIgKyAoaSAqIHBsb3QuY2VsbFNpemUgKyBwbG90LmNlbGxTaXplIC8gMikgKyBcIilcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbWF4V2lkdGggPSBzZWxmLmNvbXB1dGVZQXhpc0xhYmVsc1dpZHRoKCk7XHJcbiAgICAgICAgbGFiZWxzLmVhY2goZnVuY3Rpb24gKGxhYmVsKSB7XHJcbiAgICAgICAgICAgIFV0aWxzLnBsYWNlVGV4dFdpdGhFbGxpcHNpc0FuZFRvb2x0aXAoZDMuc2VsZWN0KHRoaXMpLCBsYWJlbCwgbWF4V2lkdGgsIHNlbGYuY29uZmlnLnNob3dUb29sdGlwID8gc2VsZi5wbG90LnRvb2x0aXAgOiBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxhYmVscy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcHV0ZVlBeGlzTGFiZWxzV2lkdGgoKSB7XHJcbiAgICAgICAgdmFyIG1heFdpZHRoID0gdGhpcy5wbG90Lm1hcmdpbi5sZWZ0O1xyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcucm90YXRlTGFiZWxzWSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbWF4V2lkdGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtYXhXaWR0aCAqPSBVdGlscy5TUVJUXzI7XHJcbiAgICAgICAgdmFyIGZvbnRTaXplID0gMTE7IC8vdG9kbyBjaGVjayBhY3R1YWwgZm9udCBzaXplXHJcbiAgICAgICAgbWF4V2lkdGggLT0gZm9udFNpemUgLyAyO1xyXG5cclxuICAgICAgICByZXR1cm4gbWF4V2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcHV0ZVhBeGlzTGFiZWxzV2lkdGgob2Zmc2V0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5yb3RhdGVMYWJlbHNYKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBsb3QuY2VsbFNpemUgLSAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc2l6ZSA9IHRoaXMucGxvdC5tYXJnaW4uYm90dG9tO1xyXG4gICAgICAgIHNpemUgKj0gVXRpbHMuU1FSVF8yO1xyXG4gICAgICAgIHZhciBmb250U2l6ZSA9IDExOyAvL3RvZG8gY2hlY2sgYWN0dWFsIGZvbnQgc2l6ZVxyXG4gICAgICAgIHNpemUgLT0gZm9udFNpemUgLyAyO1xyXG4gICAgICAgIHJldHVybiBzaXplO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUNlbGxzKCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGNlbGxDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJjZWxsXCIpO1xyXG4gICAgICAgIHZhciBjZWxsU2hhcGUgPSBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnR5cGU7XHJcblxyXG4gICAgICAgIHZhciBjZWxscyA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJnLlwiICsgY2VsbENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShwbG90LmNvcnJlbGF0aW9uLm1hdHJpeC5jZWxscyk7XHJcblxyXG4gICAgICAgIHZhciBjZWxsRW50ZXJHID0gY2VsbHMuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKGNlbGxDbGFzcywgdHJ1ZSk7XHJcbiAgICAgICAgY2VsbHMuYXR0cihcInRyYW5zZm9ybVwiLCBjPT4gXCJ0cmFuc2xhdGUoXCIgKyAocGxvdC5jZWxsU2l6ZSAqIGMuY29sICsgcGxvdC5jZWxsU2l6ZSAvIDIpICsgXCIsXCIgKyAocGxvdC5jZWxsU2l6ZSAqIGMucm93ICsgcGxvdC5jZWxsU2l6ZSAvIDIpICsgXCIpXCIpO1xyXG5cclxuICAgICAgICBjZWxscy5jbGFzc2VkKHNlbGYuY29uZmlnLmNzc0NsYXNzUHJlZml4ICsgXCJzZWxlY3RhYmxlXCIsICEhc2VsZi5zY2F0dGVyUGxvdCk7XHJcblxyXG4gICAgICAgIHZhciBzZWxlY3RvciA9IFwiKjpub3QoLmNlbGwtc2hhcGUtXCIgKyBjZWxsU2hhcGUgKyBcIilcIjtcclxuXHJcbiAgICAgICAgdmFyIHdyb25nU2hhcGVzID0gY2VsbHMuc2VsZWN0QWxsKHNlbGVjdG9yKTtcclxuICAgICAgICB3cm9uZ1NoYXBlcy5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgdmFyIHNoYXBlcyA9IGNlbGxzLnNlbGVjdE9yQXBwZW5kKGNlbGxTaGFwZSArIFwiLmNlbGwtc2hhcGUtXCIgKyBjZWxsU2hhcGUpO1xyXG5cclxuICAgICAgICBpZiAocGxvdC5jb3JyZWxhdGlvbi5zaGFwZS50eXBlID09ICdjaXJjbGUnKSB7XHJcblxyXG4gICAgICAgICAgICBzaGFwZXNcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiclwiLCBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnJhZGl1cylcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY3hcIiwgMClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY3lcIiwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGxvdC5jb3JyZWxhdGlvbi5zaGFwZS50eXBlID09ICdlbGxpcHNlJykge1xyXG4gICAgICAgICAgICAvLyBjZWxscy5hdHRyKFwidHJhbnNmb3JtXCIsIGM9PiBcInRyYW5zbGF0ZSgzMDAsMTUwKSByb3RhdGUoXCIrcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5yb3RhdGVWYWwoYy52YWx1ZSkrXCIpXCIpO1xyXG4gICAgICAgICAgICBzaGFwZXNcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwicnhcIiwgcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5yYWRpdXNYKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJyeVwiLCBwbG90LmNvcnJlbGF0aW9uLnNoYXBlLnJhZGl1c1kpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImN4XCIsIDApXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImN5XCIsIDApXHJcblxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYz0+IFwicm90YXRlKFwiICsgcGxvdC5jb3JyZWxhdGlvbi5zaGFwZS5yb3RhdGVWYWwoYy52YWx1ZSkgKyBcIilcIik7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgaWYgKHBsb3QuY29ycmVsYXRpb24uc2hhcGUudHlwZSA9PSAncmVjdCcpIHtcclxuICAgICAgICAgICAgc2hhcGVzXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHBsb3QuY29ycmVsYXRpb24uc2hhcGUuc2l6ZSlcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIHBsb3QuY29ycmVsYXRpb24uc2hhcGUuc2l6ZSlcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieFwiLCAtcGxvdC5jZWxsU2l6ZSAvIDIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInlcIiwgLXBsb3QuY2VsbFNpemUgLyAyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2hhcGVzLnN0eWxlKFwiZmlsbFwiLCBjPT4gcGxvdC5jb3JyZWxhdGlvbi5jb2xvci5zY2FsZShjLnZhbHVlKSk7XHJcblxyXG4gICAgICAgIHZhciBtb3VzZW92ZXJDYWxsYmFja3MgPSBbXTtcclxuICAgICAgICB2YXIgbW91c2VvdXRDYWxsYmFja3MgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKHBsb3QudG9vbHRpcCkge1xyXG5cclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goYz0+IHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGh0bWwgPSBjLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLmh0bWwoaHRtbClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLnB1c2goYz0+IHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2VsZi5jb25maWcuaGlnaGxpZ2h0TGFiZWxzKSB7XHJcbiAgICAgICAgICAgIHZhciBoaWdobGlnaHRDbGFzcyA9IHNlbGYuY29uZmlnLmNzc0NsYXNzUHJlZml4ICsgXCJoaWdobGlnaHRcIjtcclxuICAgICAgICAgICAgdmFyIHhMYWJlbENsYXNzID0gYz0+cGxvdC5sYWJlbENsYXNzICsgXCIteC1cIiArIGMuY29sO1xyXG4gICAgICAgICAgICB2YXIgeUxhYmVsQ2xhc3MgPSBjPT5wbG90LmxhYmVsQ2xhc3MgKyBcIi15LVwiICsgYy5yb3c7XHJcblxyXG5cclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goYz0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHhMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgeUxhYmVsQ2xhc3MoYykpLmNsYXNzZWQoaGlnaGxpZ2h0Q2xhc3MsIHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MucHVzaChjPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB4TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB5TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBjZWxscy5vbihcIm1vdXNlb3ZlclwiLCBjID0+IHtcclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2s9PmNhbGxiYWNrKGMpKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCBjID0+IHtcclxuICAgICAgICAgICAgICAgIG1vdXNlb3V0Q2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2s9PmNhbGxiYWNrKGMpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNlbGxzLm9uKFwiY2xpY2tcIiwgYz0+IHtcclxuICAgICAgICAgICAgc2VsZi50cmlnZ2VyKFwiY2VsbC1zZWxlY3RlZFwiLCBjKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIGNlbGxzLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgdXBkYXRlTGVnZW5kKCkge1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgbGVnZW5kWCA9IHRoaXMucGxvdC53aWR0aCArIDEwO1xyXG4gICAgICAgIHZhciBsZWdlbmRZID0gMDtcclxuICAgICAgICB2YXIgYmFyV2lkdGggPSAxMDtcclxuICAgICAgICB2YXIgYmFySGVpZ2h0ID0gdGhpcy5wbG90LmhlaWdodCAtIDI7XHJcbiAgICAgICAgdmFyIHNjYWxlID0gcGxvdC5jb3JyZWxhdGlvbi5jb2xvci5zY2FsZTtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmQgPSBuZXcgTGVnZW5kKHRoaXMuc3ZnLCB0aGlzLnN2Z0csIHNjYWxlLCBsZWdlbmRYLCBsZWdlbmRZKS5saW5lYXJHcmFkaWVudEJhcihiYXJXaWR0aCwgYmFySGVpZ2h0KTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGF0dGFjaFNjYXR0ZXJQbG90KGNvbnRhaW5lclNlbGVjdG9yLCBjb25maWcpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcclxuXHJcblxyXG4gICAgICAgIHZhciBzY2F0dGVyUGxvdENvbmZpZyA9IHtcclxuICAgICAgICAgICAgaGVpZ2h0OiBzZWxmLnBsb3QuaGVpZ2h0ICsgc2VsZi5jb25maWcubWFyZ2luLnRvcCArIHNlbGYuY29uZmlnLm1hcmdpbi5ib3R0b20sXHJcbiAgICAgICAgICAgIHdpZHRoOiBzZWxmLnBsb3QuaGVpZ2h0ICsgc2VsZi5jb25maWcubWFyZ2luLnRvcCArIHNlbGYuY29uZmlnLm1hcmdpbi5ib3R0b20sXHJcbiAgICAgICAgICAgIGdyb3Vwczoge1xyXG4gICAgICAgICAgICAgICAga2V5OiBzZWxmLmNvbmZpZy5ncm91cHMua2V5LFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6IHNlbGYuY29uZmlnLmdyb3Vwcy5sYWJlbFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBndWlkZXM6IHRydWUsXHJcbiAgICAgICAgICAgIHNob3dMZWdlbmQ6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zY2F0dGVyUGxvdCA9IHRydWU7XHJcblxyXG4gICAgICAgIHNjYXR0ZXJQbG90Q29uZmlnID0gVXRpbHMuZGVlcEV4dGVuZChzY2F0dGVyUGxvdENvbmZpZywgY29uZmlnKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm9uKFwiY2VsbC1zZWxlY3RlZFwiLCBjPT4ge1xyXG5cclxuXHJcbiAgICAgICAgICAgIHNjYXR0ZXJQbG90Q29uZmlnLnggPSB7XHJcbiAgICAgICAgICAgICAgICBrZXk6IGMucm93VmFyLFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6IHNlbGYucGxvdC5sYWJlbEJ5VmFyaWFibGVbYy5yb3dWYXJdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHNjYXR0ZXJQbG90Q29uZmlnLnkgPSB7XHJcbiAgICAgICAgICAgICAgICBrZXk6IGMuY29sVmFyLFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6IHNlbGYucGxvdC5sYWJlbEJ5VmFyaWFibGVbYy5jb2xWYXJdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnNjYXR0ZXJQbG90ICYmIHNlbGYuc2NhdHRlclBsb3QgIT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2NhdHRlclBsb3Quc2V0Q29uZmlnKHNjYXR0ZXJQbG90Q29uZmlnKS5pbml0KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNjYXR0ZXJQbG90ID0gbmV3IFNjYXR0ZXJQbG90KGNvbnRhaW5lclNlbGVjdG9yLCBzZWxmLmRhdGEsIHNjYXR0ZXJQbG90Q29uZmlnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXR0YWNoKFwiU2NhdHRlclBsb3RcIiwgc2VsZi5zY2F0dGVyUGxvdCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgRDNFeHRlbnNpb25ze1xyXG5cclxuICAgIHN0YXRpYyBleHRlbmQoKXtcclxuXHJcbiAgICAgICAgZDMuc2VsZWN0aW9uLmVudGVyLnByb3RvdHlwZS5pbnNlcnRTZWxlY3RvciA9XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdGlvbi5wcm90b3R5cGUuaW5zZXJ0U2VsZWN0b3IgPSBmdW5jdGlvbihzZWxlY3RvciwgYmVmb3JlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVXRpbHMuaW5zZXJ0U2VsZWN0b3IodGhpcywgc2VsZWN0b3IsIGJlZm9yZSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICBkMy5zZWxlY3Rpb24uZW50ZXIucHJvdG90eXBlLmFwcGVuZFNlbGVjdG9yID1cclxuICAgICAgICAgICAgZDMuc2VsZWN0aW9uLnByb3RvdHlwZS5hcHBlbmRTZWxlY3RvciA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVXRpbHMuYXBwZW5kU2VsZWN0b3IodGhpcywgc2VsZWN0b3IpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICBkMy5zZWxlY3Rpb24uZW50ZXIucHJvdG90eXBlLnNlbGVjdE9yQXBwZW5kID1cclxuICAgICAgICAgICAgZDMuc2VsZWN0aW9uLnByb3RvdHlwZS5zZWxlY3RPckFwcGVuZCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVXRpbHMuc2VsZWN0T3JBcHBlbmQodGhpcywgc2VsZWN0b3IpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICBkMy5zZWxlY3Rpb24uZW50ZXIucHJvdG90eXBlLnNlbGVjdE9ySW5zZXJ0ID1cclxuICAgICAgICAgICAgZDMuc2VsZWN0aW9uLnByb3RvdHlwZS5zZWxlY3RPckluc2VydCA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBiZWZvcmUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBVdGlscy5zZWxlY3RPckluc2VydCh0aGlzLCBzZWxlY3RvciwgYmVmb3JlKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcblxyXG5cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NoYXJ0LCBDaGFydENvbmZpZ30gZnJvbSBcIi4vY2hhcnRcIjtcclxuaW1wb3J0IHtIZWF0bWFwLCBIZWF0bWFwQ29uZmlnfSBmcm9tIFwiLi9oZWF0bWFwXCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7U3RhdGlzdGljc1V0aWxzfSBmcm9tICcuL3N0YXRpc3RpY3MtdXRpbHMnXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEhlYXRtYXBUaW1lU2VyaWVzQ29uZmlnIGV4dGVuZHMgSGVhdG1hcENvbmZpZyB7XHJcbiAgICB4ID0ge1xyXG4gICAgICAgIGZpbGxNaXNzaW5nOiBmYWxzZSwgLy8gZmlsbCBtaXNzaW5nIHZhbHVlcyB1c2luZyBpbnRlcnZhbCBhbmQgaW50ZXJ2YWxTdGVwXHJcbiAgICAgICAgaW50ZXJ2YWw6IHVuZGVmaW5lZCwgLy91c2VkIGluIGZpbGxpbmcgbWlzc2luZyB0aWNrc1xyXG4gICAgICAgIGludGVydmFsU3RlcDogMSxcclxuICAgICAgICBmb3JtYXQ6IHVuZGVmaW5lZCwgLy9pbnB1dCBkYXRhIGQzIHRpbWUgZm9ybWF0XHJcbiAgICAgICAgZGlzcGxheUZvcm1hdDogdW5kZWZpbmVkLC8vZDMgdGltZSBmb3JtYXQgZm9yIGRpc3BsYXlcclxuICAgICAgICBpbnRlcnZhbFRvRm9ybWF0czogWyAvL3VzZWQgdG8gZ3Vlc3MgaW50ZXJ2YWwgYW5kIGZvcm1hdFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAneWVhcicsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXRzOiBbXCIlWVwiXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnbW9udGgnLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0czogW1wiJVktJW1cIl1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2RheScsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXRzOiBbXCIlWS0lbS0lZFwiXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnaG91cicsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXRzOiBbJyVIJywgJyVZLSVtLSVkICVIJ11cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ21pbnV0ZScsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXRzOiBbJyVIOiVNJywgJyVZLSVtLSVkICVIOiVNJ11cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3NlY29uZCcsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXRzOiBbJyVIOiVNOiVTJywgJyVZLSVtLSVkICVIOiVNOiVTJ11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0sXHJcblxyXG4gICAgICAgIHNvcnRDb21wYXJhdG9yOiBmdW5jdGlvbiBzb3J0Q29tcGFyYXRvcihhLCBiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBVdGlscy5pc1N0cmluZyhhKSA/ICBhLmxvY2FsZUNvbXBhcmUoYikgOiAgYSAtIGI7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb3JtYXR0ZXI6IHVuZGVmaW5lZFxyXG4gICAgfTtcclxuICAgIHogPSB7XHJcbiAgICAgICAgZmlsbE1pc3Npbmc6IHRydWUgLy8gZmlpbGwgbWlzc2luZyB2YWx1ZXMgd2l0aCBuZWFyZXN0IHByZXZpb3VzIHZhbHVlXHJcbiAgICB9O1xyXG5cclxuICAgIGxlZ2VuZCA9IHtcclxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHZhciBzdWZmaXggPSBcIlwiO1xyXG4gICAgICAgICAgICBpZiAodiAvIDEwMDAwMDAgPj0gMSkge1xyXG4gICAgICAgICAgICAgICAgc3VmZml4ID0gXCIgTVwiO1xyXG4gICAgICAgICAgICAgICAgdiA9IE51bWJlcih2IC8gMTAwMDAwMCkudG9GaXhlZCgzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgbmYgPSBJbnRsLk51bWJlckZvcm1hdCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gbmYuZm9ybWF0KHYpICsgc3VmZml4O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgaWYgKGN1c3RvbSkge1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEhlYXRtYXBUaW1lU2VyaWVzIGV4dGVuZHMgSGVhdG1hcCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBzdXBlcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBuZXcgSGVhdG1hcFRpbWVTZXJpZXNDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZykge1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IEhlYXRtYXBUaW1lU2VyaWVzQ29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBzZXR1cFZhbHVlc0JlZm9yZUdyb3Vwc1NvcnQoKSB7XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC54LnRpbWVGb3JtYXQgPSB0aGlzLmNvbmZpZy54LmZvcm1hdDtcclxuICAgICAgICBpZih0aGlzLmNvbmZpZy54LmRpc3BsYXlGb3JtYXQgJiYgIXRoaXMucGxvdC54LnRpbWVGb3JtYXQpe1xyXG4gICAgICAgICAgICB0aGlzLmd1ZXNzVGltZUZvcm1hdCgpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHN1cGVyLnNldHVwVmFsdWVzQmVmb3JlR3JvdXBzU29ydCgpO1xyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcueC5maWxsTWlzc2luZykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdFRpbWVGb3JtYXRBbmRJbnRlcnZhbCgpO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueC5pbnRlcnZhbFN0ZXAgPSB0aGlzLmNvbmZpZy54LmludGVydmFsU3RlcCB8fCAxO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueC50aW1lUGFyc2VyID0gdGhpcy5nZXRUaW1lUGFyc2VyKCk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5wbG90LngudW5pcXVlVmFsdWVzLnNvcnQodGhpcy5jb25maWcueC5zb3J0Q29tcGFyYXRvcik7XHJcblxyXG4gICAgICAgIHZhciBwcmV2ID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LngudW5pcXVlVmFsdWVzLmZvckVhY2goKHgsIGkpPT4ge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudCA9IHRoaXMucGFyc2VUaW1lKHgpO1xyXG4gICAgICAgICAgICBpZiAocHJldiA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcHJldiA9IGN1cnJlbnQ7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBuZXh0ID0gc2VsZi5uZXh0VGltZVRpY2tWYWx1ZShwcmV2KTtcclxuICAgICAgICAgICAgdmFyIG1pc3NpbmcgPSBbXTtcclxuICAgICAgICAgICAgdmFyIGl0ZXJhdGlvbiA9IDA7XHJcbiAgICAgICAgICAgIHdoaWxlIChzZWxmLmNvbXBhcmVUaW1lVmFsdWVzKG5leHQsIGN1cnJlbnQpPD0wKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVyYXRpb24rKztcclxuICAgICAgICAgICAgICAgIGlmIChpdGVyYXRpb24gPiAxMDApIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBkID0ge307XHJcbiAgICAgICAgICAgICAgICB2YXIgdGltZVN0cmluZyA9IHNlbGYuZm9ybWF0VGltZShuZXh0KTtcclxuICAgICAgICAgICAgICAgIGRbdGhpcy5jb25maWcueC5rZXldID0gdGltZVN0cmluZztcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnVwZGF0ZUdyb3VwcyhkLCB0aW1lU3RyaW5nLCBzZWxmLnBsb3QueC5ncm91cHMsIHNlbGYuY29uZmlnLnguZ3JvdXBzKTtcclxuICAgICAgICAgICAgICAgIG1pc3NpbmcucHVzaChuZXh0KTtcclxuICAgICAgICAgICAgICAgIG5leHQgPSBzZWxmLm5leHRUaW1lVGlja1ZhbHVlKG5leHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByZXYgPSBjdXJyZW50O1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwYXJzZVRpbWUoeCkge1xyXG4gICAgICAgIHZhciBwYXJzZXIgPSB0aGlzLmdldFRpbWVQYXJzZXIoKTtcclxuICAgICAgICByZXR1cm4gcGFyc2VyLnBhcnNlKHgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcm1hdFRpbWUoZGF0ZSl7XHJcbiAgICAgICAgdmFyIHBhcnNlciA9IHRoaXMuZ2V0VGltZVBhcnNlcigpO1xyXG4gICAgICAgIHJldHVybiBwYXJzZXIoZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9ybWF0VmFsdWVYKHZhbHVlKSB7IC8vdXNlZCBvbmx5IGZvciBkaXNwbGF5XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnguZm9ybWF0dGVyKSByZXR1cm4gdGhpcy5jb25maWcueC5mb3JtYXR0ZXIuY2FsbCh0aGlzLmNvbmZpZywgdmFsdWUpO1xyXG5cclxuICAgICAgICBpZih0aGlzLmNvbmZpZy54LmRpc3BsYXlGb3JtYXQpe1xyXG4gICAgICAgICAgICB2YXIgZGF0ZSA9IHRoaXMucGFyc2VUaW1lKHZhbHVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGQzLnRpbWUuZm9ybWF0KHRoaXMuY29uZmlnLnguZGlzcGxheUZvcm1hdCkoZGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZighdGhpcy5wbG90LngudGltZUZvcm1hdCkgcmV0dXJuIHZhbHVlO1xyXG5cclxuICAgICAgICBpZihVdGlscy5pc0RhdGUodmFsdWUpKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0VGltZSh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcGFyZVRpbWVWYWx1ZXMoYSwgYil7XHJcbiAgICAgICAgcmV0dXJuIGEtYjtcclxuICAgIH1cclxuXHJcbiAgICB0aW1lVmFsdWVzRXF1YWwoYSwgYikge1xyXG4gICAgICAgIHZhciBwYXJzZXIgPSB0aGlzLnBsb3QueC50aW1lUGFyc2VyO1xyXG4gICAgICAgIHJldHVybiBwYXJzZXIoYSkgPT09IHBhcnNlcihiKTtcclxuICAgIH1cclxuXHJcbiAgICBuZXh0VGltZVRpY2tWYWx1ZSh0KSB7XHJcbiAgICAgICAgdmFyIGludGVydmFsID0gdGhpcy5wbG90LnguaW50ZXJ2YWw7XHJcbiAgICAgICAgcmV0dXJuIGQzLnRpbWVbaW50ZXJ2YWxdLm9mZnNldCh0LCB0aGlzLnBsb3QueC5pbnRlcnZhbFN0ZXApO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRQbG90KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy56LmZpbGxNaXNzaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5tYXRyaXguZm9yRWFjaCgocm93LCByb3dJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByZXZSb3dWYWx1ZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIHJvdy5mb3JFYWNoKChjZWxsLCBjb2xJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjZWxsLnZhbHVlID09PSB1bmRlZmluZWQgJiYgcHJldlJvd1ZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC52YWx1ZSA9IHByZXZSb3dWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5taXNzaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldlJvd1ZhbHVlID0gY2VsbC52YWx1ZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUobmV3RGF0YSkge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuXHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBpbml0VGltZUZvcm1hdEFuZEludGVydmFsKCkge1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueC5pbnRlcnZhbCA9IHRoaXMuY29uZmlnLnguaW50ZXJ2YWw7XHJcblxyXG4gICAgICAgIGlmKCF0aGlzLnBsb3QueC50aW1lRm9ybWF0KXtcclxuICAgICAgICAgICAgdGhpcy5ndWVzc1RpbWVGb3JtYXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCF0aGlzLnBsb3QueC5pbnRlcnZhbCAmJiB0aGlzLnBsb3QueC50aW1lRm9ybWF0KXtcclxuICAgICAgICAgICAgdGhpcy5ndWVzc0ludGVydmFsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGd1ZXNzVGltZUZvcm1hdCgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGkgPCBzZWxmLmNvbmZpZy54LmludGVydmFsVG9Gb3JtYXRzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IGludGVydmFsRm9ybWF0ID0gc2VsZi5jb25maWcueC5pbnRlcnZhbFRvRm9ybWF0c1tpXTtcclxuICAgICAgICAgICAgdmFyIGZvcm1hdCA9IG51bGw7XHJcbiAgICAgICAgICAgIHZhciBmb3JtYXRNYXRjaCA9IGludGVydmFsRm9ybWF0LmZvcm1hdHMuc29tZShmPT57XHJcbiAgICAgICAgICAgICAgICBmb3JtYXQgPSBmO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcnNlciA9IGQzLnRpbWUuZm9ybWF0KGYpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYucGxvdC54LnVuaXF1ZVZhbHVlcy5ldmVyeSh4PT57XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZSh4KSAhPT0gbnVsbFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZihmb3JtYXRNYXRjaCl7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBsb3QueC50aW1lRm9ybWF0ID0gZm9ybWF0O1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0d1ZXNzZWQgdGltZUZvcm1hdCcsIGZvcm1hdCk7XHJcbiAgICAgICAgICAgICAgICBpZighc2VsZi5wbG90LnguaW50ZXJ2YWwpe1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucGxvdC54LmludGVydmFsID0gaW50ZXJ2YWxGb3JtYXQubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnR3Vlc3NlZCBpbnRlcnZhbCcsIHNlbGYucGxvdC54LmludGVydmFsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBndWVzc0ludGVydmFsKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBmb3IobGV0IGk9MDsgaSA8IHNlbGYuY29uZmlnLnguaW50ZXJ2YWxUb0Zvcm1hdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGludGVydmFsRm9ybWF0ID0gc2VsZi5jb25maWcueC5pbnRlcnZhbFRvRm9ybWF0c1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmKGludGVydmFsRm9ybWF0LmZvcm1hdHMuaW5kZXhPZihzZWxmLnBsb3QueC50aW1lRm9ybWF0KSA+PSAwKXtcclxuICAgICAgICAgICAgICAgIHNlbGYucGxvdC54LmludGVydmFsID0gaW50ZXJ2YWxGb3JtYXQubmFtZTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHdWVzc2VkIGludGVydmFsJywgc2VsZi5wbG90LnguaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldFRpbWVQYXJzZXIoKSB7XHJcbiAgICAgICAgaWYoIXRoaXMucGxvdC54LnRpbWVQYXJzZXIpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QueC50aW1lUGFyc2VyID0gZDMudGltZS5mb3JtYXQodGhpcy5wbG90LngudGltZUZvcm1hdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnBsb3QueC50aW1lUGFyc2VyO1xyXG4gICAgfVxyXG59XHJcblxyXG4iLCJpbXBvcnQge0NoYXJ0LCBDaGFydENvbmZpZ30gZnJvbSBcIi4vY2hhcnRcIjtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IHtMZWdlbmR9IGZyb20gJy4vbGVnZW5kJ1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBIZWF0bWFwQ29uZmlnIGV4dGVuZHMgQ2hhcnRDb25maWcge1xyXG5cclxuICAgIHN2Z0NsYXNzID0gJ29kYy1oZWF0bWFwJztcclxuICAgIHNob3dUb29sdGlwID0gdHJ1ZTsgLy9zaG93IHRvb2x0aXAgb24gZG90IGhvdmVyXHJcbiAgICB0b29sdGlwID0ge1xyXG4gICAgICAgIG5vRGF0YVRleHQ6IFwiTi9BXCJcclxuICAgIH07XHJcbiAgICBzaG93TGVnZW5kID0gdHJ1ZTtcclxuICAgIGxlZ2VuZCA9IHtcclxuICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgcm90YXRlTGFiZWxzOiBmYWxzZSxcclxuICAgICAgICBkZWNpbWFsUGxhY2VzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgZm9ybWF0dGVyOiB2ID0+IHRoaXMubGVnZW5kLmRlY2ltYWxQbGFjZXMgPT09IHVuZGVmaW5lZCA/IHYgOiBOdW1iZXIodikudG9GaXhlZCh0aGlzLmxlZ2VuZC5kZWNpbWFsUGxhY2VzKVxyXG4gICAgfVxyXG4gICAgaGlnaGxpZ2h0TGFiZWxzID0gdHJ1ZTtcclxuICAgIHggPSB7Ly8gWCBheGlzIGNvbmZpZ1xyXG4gICAgICAgIHRpdGxlOiAnJywgLy8gYXhpcyB0aXRsZVxyXG4gICAgICAgIGtleTogMCxcclxuICAgICAgICB2YWx1ZTogKGQpID0+IGRbdGhpcy54LmtleV0sIC8vIHggdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICByb3RhdGVMYWJlbHM6IHRydWUsXHJcbiAgICAgICAgc29ydExhYmVsczogZmFsc2UsXHJcbiAgICAgICAgc29ydENvbXBhcmF0b3I6IChhLCBiKT0+IFV0aWxzLmlzTnVtYmVyKGEpID8gYSAtIGIgOiBhLmxvY2FsZUNvbXBhcmUoYiksXHJcbiAgICAgICAgZ3JvdXBzOiB7XHJcbiAgICAgICAgICAgIGtleXM6IFtdLFxyXG4gICAgICAgICAgICBsYWJlbHM6IFtdLFxyXG4gICAgICAgICAgICB2YWx1ZTogKGQsIGtleSkgPT4gZFtrZXldLFxyXG4gICAgICAgICAgICBvdmVybGFwOiB7XHJcbiAgICAgICAgICAgICAgICB0b3A6IDIwLFxyXG4gICAgICAgICAgICAgICAgYm90dG9tOiAyMFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb3JtYXR0ZXI6IHVuZGVmaW5lZCAvLyB2YWx1ZSBmb3JtYXR0ZXIgZnVuY3Rpb25cclxuXHJcbiAgICB9O1xyXG4gICAgeSA9IHsvLyBZIGF4aXMgY29uZmlnXHJcbiAgICAgICAgdGl0bGU6ICcnLCAvLyBheGlzIHRpdGxlLFxyXG4gICAgICAgIHJvdGF0ZUxhYmVsczogdHJ1ZSxcclxuICAgICAgICBrZXk6IDEsXHJcbiAgICAgICAgdmFsdWU6IChkKSA9PiBkW3RoaXMueS5rZXldLCAvLyB5IHZhbHVlIGFjY2Vzc29yXHJcbiAgICAgICAgc29ydExhYmVsczogZmFsc2UsXHJcbiAgICAgICAgc29ydENvbXBhcmF0b3I6IChhLCBiKT0+IFV0aWxzLmlzTnVtYmVyKGIpID8gYiAtIGEgOiBiLmxvY2FsZUNvbXBhcmUoYSksXHJcbiAgICAgICAgZ3JvdXBzOiB7XHJcbiAgICAgICAgICAgIGtleXM6IFtdLFxyXG4gICAgICAgICAgICBsYWJlbHM6IFtdLFxyXG4gICAgICAgICAgICB2YWx1ZTogKGQsIGtleSkgPT4gZFtrZXldLFxyXG4gICAgICAgICAgICBvdmVybGFwOiB7XHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAyMCxcclxuICAgICAgICAgICAgICAgIHJpZ2h0OiAyMFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb3JtYXR0ZXI6IHVuZGVmaW5lZC8vIHZhbHVlIGZvcm1hdHRlciBmdW5jdGlvblxyXG4gICAgfTtcclxuICAgIHogPSB7XHJcbiAgICAgICAga2V5OiAyLFxyXG4gICAgICAgIHZhbHVlOiAoZCkgPT4gZFt0aGlzLnoua2V5XSxcclxuICAgICAgICBub3RBdmFpbGFibGVWYWx1ZTogKHYpID0+IHYgPT09IG51bGwgfHwgdiA9PT0gdW5kZWZpbmVkLFxyXG5cclxuICAgICAgICBkZWNpbWFsUGxhY2VzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgZm9ybWF0dGVyOiB2ID0+IHRoaXMuei5kZWNpbWFsUGxhY2VzID09PSB1bmRlZmluZWQgPyB2IDogTnVtYmVyKHYpLnRvRml4ZWQodGhpcy56LmRlY2ltYWxQbGFjZXMpLy8gdmFsdWUgZm9ybWF0dGVyIGZ1bmN0aW9uXHJcblxyXG4gICAgfTtcclxuICAgIGNvbG9yID0ge1xyXG4gICAgICAgIG5vRGF0YUNvbG9yOiBcIndoaXRlXCIsXHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCIsXHJcbiAgICAgICAgcmV2ZXJzZVNjYWxlOiBmYWxzZSxcclxuICAgICAgICByYW5nZTogW1wiZGFya2JsdWVcIiwgXCJsaWdodHNreWJsdWVcIiwgXCJvcmFuZ2VcIiwgXCJjcmltc29uXCIsIFwiZGFya3JlZFwiXVxyXG4gICAgfTtcclxuICAgIGNlbGwgPSB7XHJcbiAgICAgICAgd2lkdGg6IHVuZGVmaW5lZCxcclxuICAgICAgICBoZWlnaHQ6IHVuZGVmaW5lZCxcclxuICAgICAgICBzaXplTWluOiAxNSxcclxuICAgICAgICBzaXplTWF4OiAyNTAsXHJcbiAgICAgICAgcGFkZGluZzogMFxyXG4gICAgfTtcclxuICAgIG1hcmdpbiA9IHtcclxuICAgICAgICBsZWZ0OiA2MCxcclxuICAgICAgICByaWdodDogNTAsXHJcbiAgICAgICAgdG9wOiAzMCxcclxuICAgICAgICBib3R0b206IDgwXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgaWYgKGN1c3RvbSkge1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vL1RPRE8gcmVmYWN0b3JcclxuZXhwb3J0IGNsYXNzIEhlYXRtYXAgZXh0ZW5kcyBDaGFydCB7XHJcblxyXG4gICAgc3RhdGljIG1heEdyb3VwR2FwU2l6ZSA9IDI0O1xyXG4gICAgc3RhdGljIGdyb3VwVGl0bGVSZWN0SGVpZ2h0ID0gNjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBzdXBlcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBuZXcgSGVhdG1hcENvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25maWcoY29uZmlnKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgSGVhdG1hcENvbmZpZyhjb25maWcpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdFBsb3QoKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG1hcmdpbiA9IHRoaXMuY29uZmlnLm1hcmdpbjtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3QueCA9IHt9O1xyXG4gICAgICAgIHRoaXMucGxvdC55ID0ge307XHJcbiAgICAgICAgdGhpcy5wbG90LnogPSB7XHJcbiAgICAgICAgICAgIG1hdHJpeGVzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGNlbGxzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGNvbG9yOiB7fSxcclxuICAgICAgICAgICAgc2hhcGU6IHt9XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBWYWx1ZXMoKTtcclxuICAgICAgICB0aGlzLmJ1aWxkQ2VsbHMoKTtcclxuXHJcbiAgICAgICAgdmFyIHRpdGxlUmVjdFdpZHRoID0gNjtcclxuICAgICAgICB0aGlzLnBsb3QueC5vdmVybGFwID0ge1xyXG4gICAgICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgICAgIGJvdHRvbTogMFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKHRoaXMucGxvdC5ncm91cEJ5WCkge1xyXG4gICAgICAgICAgICBsZXQgZGVwdGggPSBzZWxmLmNvbmZpZy54Lmdyb3Vwcy5rZXlzLmxlbmd0aDtcclxuICAgICAgICAgICAgbGV0IGFsbFRpdGxlc1dpZHRoID0gZGVwdGggKiAodGl0bGVSZWN0V2lkdGgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wbG90Lngub3ZlcmxhcC5ib3R0b20gPSBzZWxmLmNvbmZpZy54Lmdyb3Vwcy5vdmVybGFwLmJvdHRvbTtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lngub3ZlcmxhcC50b3AgPSBzZWxmLmNvbmZpZy54Lmdyb3Vwcy5vdmVybGFwLnRvcCArIGFsbFRpdGxlc1dpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWFyZ2luLnRvcCA9IGNvbmYubWFyZ2luLnJpZ2h0ICsgY29uZi54Lmdyb3Vwcy5vdmVybGFwLnRvcDtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lm1hcmdpbi5ib3R0b20gPSBjb25mLm1hcmdpbi5ib3R0b20gKyBjb25mLnguZ3JvdXBzLm92ZXJsYXAuYm90dG9tO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMucGxvdC55Lm92ZXJsYXAgPSB7XHJcbiAgICAgICAgICAgIGxlZnQ6IDAsXHJcbiAgICAgICAgICAgIHJpZ2h0OiAwXHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBsb3QuZ3JvdXBCeVkpIHtcclxuICAgICAgICAgICAgbGV0IGRlcHRoID0gc2VsZi5jb25maWcueS5ncm91cHMua2V5cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGxldCBhbGxUaXRsZXNXaWR0aCA9IGRlcHRoICogKHRpdGxlUmVjdFdpZHRoKTtcclxuICAgICAgICAgICAgdGhpcy5wbG90Lnkub3ZlcmxhcC5yaWdodCA9IHNlbGYuY29uZmlnLnkuZ3JvdXBzLm92ZXJsYXAubGVmdCArIGFsbFRpdGxlc1dpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QueS5vdmVybGFwLmxlZnQgPSBzZWxmLmNvbmZpZy55Lmdyb3Vwcy5vdmVybGFwLmxlZnQ7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5tYXJnaW4ubGVmdCA9IGNvbmYubWFyZ2luLmxlZnQgKyB0aGlzLnBsb3QueS5vdmVybGFwLmxlZnQ7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5tYXJnaW4ucmlnaHQgPSBjb25mLm1hcmdpbi5yaWdodCArIHRoaXMucGxvdC55Lm92ZXJsYXAucmlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxvdC5zaG93TGVnZW5kID0gY29uZi5zaG93TGVnZW5kO1xyXG4gICAgICAgIGlmICh0aGlzLnBsb3Quc2hvd0xlZ2VuZCkge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWFyZ2luLnJpZ2h0ICs9IGNvbmYubGVnZW5kLndpZHRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNvbXB1dGVQbG90U2l6ZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBaU2NhbGUoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXBWYWx1ZXMoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBjb25maWcgPSBzZWxmLmNvbmZpZztcclxuICAgICAgICB2YXIgeCA9IHNlbGYucGxvdC54O1xyXG4gICAgICAgIHZhciB5ID0gc2VsZi5wbG90Lnk7XHJcbiAgICAgICAgdmFyIHogPSBzZWxmLnBsb3QuejtcclxuXHJcblxyXG4gICAgICAgIHgudmFsdWUgPSBkID0+IGNvbmZpZy54LnZhbHVlLmNhbGwoY29uZmlnLCBkKTtcclxuICAgICAgICB5LnZhbHVlID0gZCA9PiBjb25maWcueS52YWx1ZS5jYWxsKGNvbmZpZywgZCk7XHJcbiAgICAgICAgei52YWx1ZSA9IGQgPT4gY29uZmlnLnoudmFsdWUuY2FsbChjb25maWcsIGQpO1xyXG5cclxuICAgICAgICB4LnVuaXF1ZVZhbHVlcyA9IFtdO1xyXG4gICAgICAgIHkudW5pcXVlVmFsdWVzID0gW107XHJcblxyXG5cclxuICAgICAgICBzZWxmLnBsb3QuZ3JvdXBCeVkgPSAhIWNvbmZpZy55Lmdyb3Vwcy5rZXlzLmxlbmd0aDtcclxuICAgICAgICBzZWxmLnBsb3QuZ3JvdXBCeVggPSAhIWNvbmZpZy54Lmdyb3Vwcy5rZXlzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgeS5ncm91cHMgPSB7XHJcbiAgICAgICAgICAgIGtleTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBsYWJlbDogJycsXHJcbiAgICAgICAgICAgIHZhbHVlczogW10sXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBudWxsLFxyXG4gICAgICAgICAgICBsZXZlbDogMCxcclxuICAgICAgICAgICAgaW5kZXg6IDAsXHJcbiAgICAgICAgICAgIGxhc3RJbmRleDogMFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgeC5ncm91cHMgPSB7XHJcbiAgICAgICAgICAgIGtleTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBsYWJlbDogJycsXHJcbiAgICAgICAgICAgIHZhbHVlczogW10sXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBudWxsLFxyXG4gICAgICAgICAgICBsZXZlbDogMCxcclxuICAgICAgICAgICAgaW5kZXg6IDAsXHJcbiAgICAgICAgICAgIGxhc3RJbmRleDogMFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciB2YWx1ZU1hcCA9IHt9O1xyXG4gICAgICAgIHZhciBtaW5aID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHZhciBtYXhaID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuZGF0YS5mb3JFYWNoKGQ9PiB7XHJcblxyXG4gICAgICAgICAgICB2YXIgeFZhbCA9IHgudmFsdWUoZCk7XHJcbiAgICAgICAgICAgIHZhciB5VmFsID0geS52YWx1ZShkKTtcclxuICAgICAgICAgICAgdmFyIHpWYWxSYXcgPSB6LnZhbHVlKGQpO1xyXG4gICAgICAgICAgICB2YXIgelZhbCA9IGNvbmZpZy56Lm5vdEF2YWlsYWJsZVZhbHVlKHpWYWxSYXcpID8gdW5kZWZpbmVkIDogcGFyc2VGbG9hdCh6VmFsUmF3KTtcclxuXHJcblxyXG4gICAgICAgICAgICBpZiAoeC51bmlxdWVWYWx1ZXMuaW5kZXhPZih4VmFsKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHgudW5pcXVlVmFsdWVzLnB1c2goeFZhbCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh5LnVuaXF1ZVZhbHVlcy5pbmRleE9mKHlWYWwpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgeS51bmlxdWVWYWx1ZXMucHVzaCh5VmFsKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGdyb3VwWSA9IHkuZ3JvdXBzO1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5wbG90Lmdyb3VwQnlZKSB7XHJcbiAgICAgICAgICAgICAgICBncm91cFkgPSB0aGlzLnVwZGF0ZUdyb3VwcyhkLCB5VmFsLCB5Lmdyb3VwcywgY29uZmlnLnkuZ3JvdXBzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZ3JvdXBYID0geC5ncm91cHM7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnBsb3QuZ3JvdXBCeVgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBncm91cFggPSB0aGlzLnVwZGF0ZUdyb3VwcyhkLCB4VmFsLCB4Lmdyb3VwcywgY29uZmlnLnguZ3JvdXBzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCF2YWx1ZU1hcFtncm91cFkuaW5kZXhdKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZU1hcFtncm91cFkuaW5kZXhdID0ge307XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghdmFsdWVNYXBbZ3JvdXBZLmluZGV4XVtncm91cFguaW5kZXhdKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZU1hcFtncm91cFkuaW5kZXhdW2dyb3VwWC5pbmRleF0gPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXZhbHVlTWFwW2dyb3VwWS5pbmRleF1bZ3JvdXBYLmluZGV4XVt5VmFsXSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWVNYXBbZ3JvdXBZLmluZGV4XVtncm91cFguaW5kZXhdW3lWYWxdID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFsdWVNYXBbZ3JvdXBZLmluZGV4XVtncm91cFguaW5kZXhdW3lWYWxdW3hWYWxdID0gelZhbDtcclxuXHJcblxyXG4gICAgICAgICAgICBpZiAobWluWiA9PT0gdW5kZWZpbmVkIHx8IHpWYWwgPCBtaW5aKSB7XHJcbiAgICAgICAgICAgICAgICBtaW5aID0gelZhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobWF4WiA9PT0gdW5kZWZpbmVkIHx8IHpWYWwgPiBtYXhaKSB7XHJcbiAgICAgICAgICAgICAgICBtYXhaID0gelZhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHNlbGYucGxvdC52YWx1ZU1hcCA9IHZhbHVlTWFwO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKCFzZWxmLnBsb3QuZ3JvdXBCeVgpIHtcclxuICAgICAgICAgICAgeC5ncm91cHMudmFsdWVzID0geC51bmlxdWVWYWx1ZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXNlbGYucGxvdC5ncm91cEJ5WSkge1xyXG4gICAgICAgICAgICB5Lmdyb3Vwcy52YWx1ZXMgPSB5LnVuaXF1ZVZhbHVlcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBWYWx1ZXNCZWZvcmVHcm91cHNTb3J0KCk7XHJcblxyXG4gICAgICAgIHguZ2FwcyA9IFtdO1xyXG4gICAgICAgIHgudG90YWxWYWx1ZXNDb3VudCA9IDA7XHJcbiAgICAgICAgeC5hbGxWYWx1ZXNMaXN0ID0gW107XHJcbiAgICAgICAgdGhpcy5zb3J0R3JvdXBzKHgsIHguZ3JvdXBzLCBjb25maWcueCk7XHJcblxyXG4gICAgICAgIHkuZ2FwcyA9IFtdO1xyXG4gICAgICAgIHkudG90YWxWYWx1ZXNDb3VudCA9IDA7XHJcbiAgICAgICAgeS5hbGxWYWx1ZXNMaXN0ID0gW107XHJcbiAgICAgICAgdGhpcy5zb3J0R3JvdXBzKHksIHkuZ3JvdXBzLCBjb25maWcueSk7XHJcblxyXG4gICAgICAgIHoubWluID0gbWluWjtcclxuICAgICAgICB6Lm1heCA9IG1heFo7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNldHVwVmFsdWVzQmVmb3JlR3JvdXBzU29ydCgpIHtcclxuICAgIH1cclxuXHJcbiAgICBidWlsZENlbGxzKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgeCA9IHNlbGYucGxvdC54O1xyXG4gICAgICAgIHZhciB5ID0gc2VsZi5wbG90Lnk7XHJcbiAgICAgICAgdmFyIHogPSBzZWxmLnBsb3QuejtcclxuICAgICAgICB2YXIgdmFsdWVNYXAgPSBzZWxmLnBsb3QudmFsdWVNYXA7XHJcblxyXG4gICAgICAgIHZhciBtYXRyaXhDZWxscyA9IHNlbGYucGxvdC5jZWxscyA9IFtdO1xyXG4gICAgICAgIHZhciBtYXRyaXggPSBzZWxmLnBsb3QubWF0cml4ID0gW107XHJcblxyXG4gICAgICAgIHkuYWxsVmFsdWVzTGlzdC5mb3JFYWNoKCh2MSwgaSk9PiB7XHJcbiAgICAgICAgICAgIHZhciByb3cgPSBbXTtcclxuICAgICAgICAgICAgbWF0cml4LnB1c2gocm93KTtcclxuXHJcbiAgICAgICAgICAgIHguYWxsVmFsdWVzTGlzdC5mb3JFYWNoKCh2MiwgaikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHpWYWwgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHpWYWwgPSB2YWx1ZU1hcFt2MS5ncm91cC5pbmRleF1bdjIuZ3JvdXAuaW5kZXhdW3YxLnZhbF1bdjIudmFsXVxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBjZWxsID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvd1ZhcjogdjEsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sVmFyOiB2MixcclxuICAgICAgICAgICAgICAgICAgICByb3c6IGksXHJcbiAgICAgICAgICAgICAgICAgICAgY29sOiBqLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB6VmFsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcm93LnB1c2goY2VsbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbWF0cml4Q2VsbHMucHVzaChjZWxsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUdyb3VwcyhkLCBheGlzVmFsLCByb290R3JvdXAsIGF4aXNHcm91cHNDb25maWcpIHtcclxuXHJcbiAgICAgICAgdmFyIGNvbmZpZyA9IHRoaXMuY29uZmlnO1xyXG4gICAgICAgIHZhciBjdXJyZW50R3JvdXAgPSByb290R3JvdXA7XHJcbiAgICAgICAgYXhpc0dyb3Vwc0NvbmZpZy5rZXlzLmZvckVhY2goKGdyb3VwS2V5LCBncm91cEtleUluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRHcm91cC5rZXkgPSBncm91cEtleTtcclxuXHJcbiAgICAgICAgICAgIGlmICghY3VycmVudEdyb3VwLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAuY2hpbGRyZW4gPSB7fTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGdyb3VwaW5nVmFsdWUgPSBheGlzR3JvdXBzQ29uZmlnLnZhbHVlLmNhbGwoY29uZmlnLCBkLCBncm91cEtleSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWN1cnJlbnRHcm91cC5jaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShncm91cGluZ1ZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcm9vdEdyb3VwLmxhc3RJbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLmNoaWxkcmVuW2dyb3VwaW5nVmFsdWVdID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlczogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBpbmdWYWx1ZTogZ3JvdXBpbmdWYWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICBsZXZlbDogY3VycmVudEdyb3VwLmxldmVsICsgMSxcclxuICAgICAgICAgICAgICAgICAgICBpbmRleDogcm9vdEdyb3VwLmxhc3RJbmRleCxcclxuICAgICAgICAgICAgICAgICAgICBrZXk6IGdyb3VwS2V5XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGN1cnJlbnRHcm91cCA9IGN1cnJlbnRHcm91cC5jaGlsZHJlbltncm91cGluZ1ZhbHVlXTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKGN1cnJlbnRHcm91cC52YWx1ZXMuaW5kZXhPZihheGlzVmFsKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgY3VycmVudEdyb3VwLnZhbHVlcy5wdXNoKGF4aXNWYWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRHcm91cDtcclxuICAgIH1cclxuXHJcbiAgICBzb3J0R3JvdXBzKGF4aXMsIGdyb3VwLCBheGlzQ29uZmlnLCBnYXBzKSB7XHJcbiAgICAgICAgaWYgKGF4aXNDb25maWcuZ3JvdXBzLmxhYmVscyAmJiBheGlzQ29uZmlnLmdyb3Vwcy5sYWJlbHMubGVuZ3RoID4gZ3JvdXAubGV2ZWwpIHtcclxuICAgICAgICAgICAgZ3JvdXAubGFiZWwgPSBheGlzQ29uZmlnLmdyb3Vwcy5sYWJlbHNbZ3JvdXAubGV2ZWxdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGdyb3VwLmxhYmVsID0gZ3JvdXAua2V5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFnYXBzKSB7XHJcbiAgICAgICAgICAgIGdhcHMgPSBbMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChnYXBzLmxlbmd0aCA8PSBncm91cC5sZXZlbCkge1xyXG4gICAgICAgICAgICBnYXBzLnB1c2goMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBncm91cC5hbGxWYWx1ZXNDb3VudCA9IGdyb3VwLmFsbFZhbHVlc0NvdW50IHx8IDA7XHJcbiAgICAgICAgZ3JvdXAuYWxsVmFsdWVzQmVmb3JlQ291bnQgPSBncm91cC5hbGxWYWx1ZXNCZWZvcmVDb3VudCB8fCAwO1xyXG5cclxuICAgICAgICBncm91cC5nYXBzID0gZ2Fwcy5zbGljZSgpO1xyXG4gICAgICAgIGdyb3VwLmdhcHNCZWZvcmUgPSBnYXBzLnNsaWNlKCk7XHJcblxyXG5cclxuICAgICAgICBncm91cC5nYXBzU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcHNTaXplKGdyb3VwLmdhcHMpO1xyXG4gICAgICAgIGdyb3VwLmdhcHNCZWZvcmVTaXplID0gZ3JvdXAuZ2Fwc1NpemU7XHJcbiAgICAgICAgaWYgKGdyb3VwLnZhbHVlcykge1xyXG4gICAgICAgICAgICBpZiAoYXhpc0NvbmZpZy5zb3J0TGFiZWxzKSB7XHJcbiAgICAgICAgICAgICAgICBncm91cC52YWx1ZXMuc29ydChheGlzQ29uZmlnLnNvcnRDb21wYXJhdG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBncm91cC52YWx1ZXMuZm9yRWFjaCh2PT5heGlzLmFsbFZhbHVlc0xpc3QucHVzaCh7dmFsOiB2LCBncm91cDogZ3JvdXB9KSk7XHJcbiAgICAgICAgICAgIGdyb3VwLmFsbFZhbHVlc0JlZm9yZUNvdW50ID0gYXhpcy50b3RhbFZhbHVlc0NvdW50O1xyXG4gICAgICAgICAgICBheGlzLnRvdGFsVmFsdWVzQ291bnQgKz0gZ3JvdXAudmFsdWVzLmxlbmd0aDtcclxuICAgICAgICAgICAgZ3JvdXAuYWxsVmFsdWVzQ291bnQgKz0gZ3JvdXAudmFsdWVzLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdyb3VwLmNoaWxkcmVuTGlzdCA9IFtdO1xyXG4gICAgICAgIGlmIChncm91cC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRyZW5Db3VudCA9IDA7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBjaGlsZFByb3AgaW4gZ3JvdXAuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgIGlmIChncm91cC5jaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShjaGlsZFByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gZ3JvdXAuY2hpbGRyZW5bY2hpbGRQcm9wXTtcclxuICAgICAgICAgICAgICAgICAgICBncm91cC5jaGlsZHJlbkxpc3QucHVzaChjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW5Db3VudCsrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvcnRHcm91cHMoYXhpcywgY2hpbGQsIGF4aXNDb25maWcsIGdhcHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwLmFsbFZhbHVlc0NvdW50ICs9IGNoaWxkLmFsbFZhbHVlc0NvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGdhcHNbZ3JvdXAubGV2ZWxdICs9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChnYXBzICYmIGNoaWxkcmVuQ291bnQgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICBnYXBzW2dyb3VwLmxldmVsXSAtPSAxO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBncm91cC5nYXBzSW5zaWRlID0gW107XHJcbiAgICAgICAgICAgIGdhcHMuZm9yRWFjaCgoZCwgaSk9PiB7XHJcbiAgICAgICAgICAgICAgICBncm91cC5nYXBzSW5zaWRlLnB1c2goZCAtIChncm91cC5nYXBzQmVmb3JlW2ldIHx8IDApKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGdyb3VwLmdhcHNJbnNpZGVTaXplID0gSGVhdG1hcC5jb21wdXRlR2Fwc1NpemUoZ3JvdXAuZ2Fwc0luc2lkZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoYXhpcy5nYXBzLmxlbmd0aCA8IGdhcHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBheGlzLmdhcHMgPSBnYXBzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBjb21wdXRlWUF4aXNMYWJlbHNXaWR0aChvZmZzZXQpIHtcclxuICAgICAgICB2YXIgbWF4V2lkdGggPSB0aGlzLnBsb3QubWFyZ2luLmxlZnQ7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnkudGl0bGUpIHtcclxuICAgICAgICAgICAgbWF4V2lkdGggLT0gMTU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvZmZzZXQgJiYgb2Zmc2V0LngpIHtcclxuICAgICAgICAgICAgbWF4V2lkdGggKz0gb2Zmc2V0Lng7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcueS5yb3RhdGVMYWJlbHMpIHtcclxuICAgICAgICAgICAgbWF4V2lkdGggKj0gVXRpbHMuU1FSVF8yO1xyXG4gICAgICAgICAgICB2YXIgZm9udFNpemUgPSAxMTsgLy90b2RvIGNoZWNrIGFjdHVhbCBmb250IHNpemVcclxuICAgICAgICAgICAgbWF4V2lkdGggLT1mb250U2l6ZS8yO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG1heFdpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXB1dGVYQXhpc0xhYmVsc1dpZHRoKG9mZnNldCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcueC5yb3RhdGVMYWJlbHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGxvdC5jZWxsV2lkdGggLSAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc2l6ZSA9IHRoaXMucGxvdC5tYXJnaW4uYm90dG9tO1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy54LnRpdGxlKSB7XHJcbiAgICAgICAgICAgIHNpemUgLT0gMTU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvZmZzZXQgJiYgb2Zmc2V0LnkpIHtcclxuICAgICAgICAgICAgc2l6ZSAtPSBvZmZzZXQueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNpemUgKj0gVXRpbHMuU1FSVF8yO1xyXG5cclxuICAgICAgICB2YXIgZm9udFNpemUgPSAxMTsgLy90b2RvIGNoZWNrIGFjdHVhbCBmb250IHNpemVcclxuICAgICAgICBzaXplIC09Zm9udFNpemUvMjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNvbXB1dGVHYXBTaXplKGdhcExldmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIEhlYXRtYXAubWF4R3JvdXBHYXBTaXplIC8gKGdhcExldmVsICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNvbXB1dGVHYXBzU2l6ZShnYXBzKSB7XHJcbiAgICAgICAgdmFyIGdhcHNTaXplID0gMDtcclxuICAgICAgICBnYXBzLmZvckVhY2goKGdhcHNOdW1iZXIsIGdhcHNMZXZlbCk9PiBnYXBzU2l6ZSArPSBnYXBzTnVtYmVyICogSGVhdG1hcC5jb21wdXRlR2FwU2l6ZShnYXBzTGV2ZWwpKTtcclxuICAgICAgICByZXR1cm4gZ2Fwc1NpemU7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcHV0ZVBsb3RTaXplKCkge1xyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICB2YXIgY29uZiA9IHRoaXMuY29uZmlnO1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSBwbG90Lm1hcmdpbjtcclxuICAgICAgICB2YXIgYXZhaWxhYmxlV2lkdGggPSBVdGlscy5hdmFpbGFibGVXaWR0aCh0aGlzLmNvbmZpZy53aWR0aCwgdGhpcy5nZXRCYXNlQ29udGFpbmVyKCksIHRoaXMucGxvdC5tYXJnaW4pO1xyXG4gICAgICAgIHZhciBhdmFpbGFibGVIZWlnaHQgPSBVdGlscy5hdmFpbGFibGVIZWlnaHQodGhpcy5jb25maWcuaGVpZ2h0LCB0aGlzLmdldEJhc2VDb250YWluZXIoKSwgdGhpcy5wbG90Lm1hcmdpbik7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gYXZhaWxhYmxlV2lkdGg7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IGF2YWlsYWJsZUhlaWdodDtcclxuXHJcbiAgICAgICAgdmFyIHhHYXBzU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcHNTaXplKHBsb3QueC5nYXBzKTtcclxuXHJcblxyXG4gICAgICAgIHZhciBjb21wdXRlZENlbGxXaWR0aCA9IE1hdGgubWF4KGNvbmYuY2VsbC5zaXplTWluLCBNYXRoLm1pbihjb25mLmNlbGwuc2l6ZU1heCwgKGF2YWlsYWJsZVdpZHRoIC0geEdhcHNTaXplKSAvIHRoaXMucGxvdC54LnRvdGFsVmFsdWVzQ291bnQpKTtcclxuICAgICAgICBpZiAodGhpcy5jb25maWcud2lkdGgpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jb25maWcuY2VsbC53aWR0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxXaWR0aCA9IGNvbXB1dGVkQ2VsbFdpZHRoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsV2lkdGggPSB0aGlzLmNvbmZpZy5jZWxsLndpZHRoO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLnBsb3QuY2VsbFdpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuY2VsbFdpZHRoID0gY29tcHV0ZWRDZWxsV2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdpZHRoID0gdGhpcy5wbG90LmNlbGxXaWR0aCAqIHRoaXMucGxvdC54LnRvdGFsVmFsdWVzQ291bnQgKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodCArIHhHYXBzU2l6ZTtcclxuXHJcbiAgICAgICAgdmFyIHlHYXBzU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcHNTaXplKHBsb3QueS5nYXBzKTtcclxuICAgICAgICB2YXIgY29tcHV0ZWRDZWxsSGVpZ2h0ID0gTWF0aC5tYXgoY29uZi5jZWxsLnNpemVNaW4sIE1hdGgubWluKGNvbmYuY2VsbC5zaXplTWF4LCAoYXZhaWxhYmxlSGVpZ2h0IC0geUdhcHNTaXplKSAvIHRoaXMucGxvdC55LnRvdGFsVmFsdWVzQ291bnQpKTtcclxuICAgICAgICBpZiAodGhpcy5jb25maWcuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jb25maWcuY2VsbC5oZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsSGVpZ2h0ID0gY29tcHV0ZWRDZWxsSGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmNlbGxIZWlnaHQgPSB0aGlzLmNvbmZpZy5jZWxsLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wbG90LmNlbGxIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5jZWxsSGVpZ2h0ID0gY29tcHV0ZWRDZWxsSGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaGVpZ2h0ID0gdGhpcy5wbG90LmNlbGxIZWlnaHQgKiB0aGlzLnBsb3QueS50b3RhbFZhbHVlc0NvdW50ICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b20gKyB5R2Fwc1NpemU7XHJcblxyXG5cclxuICAgICAgICB0aGlzLnBsb3Qud2lkdGggPSB3aWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0O1xyXG4gICAgICAgIHRoaXMucGxvdC5oZWlnaHQgPSBoZWlnaHQgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgc2V0dXBaU2NhbGUoKSB7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgY29uZmlnID0gc2VsZi5jb25maWc7XHJcbiAgICAgICAgdmFyIHogPSBzZWxmLnBsb3QuejtcclxuICAgICAgICB2YXIgcmFuZ2UgPSBjb25maWcuY29sb3IucmFuZ2U7XHJcbiAgICAgICAgdmFyIGV4dGVudCA9IHoubWF4IC0gei5taW47XHJcbiAgICAgICAgdmFyIHNjYWxlO1xyXG4gICAgICAgIHouZG9tYWluID0gW107XHJcbiAgICAgICAgaWYgKGNvbmZpZy5jb2xvci5zY2FsZSA9PSBcInBvd1wiKSB7XHJcbiAgICAgICAgICAgIHZhciBleHBvbmVudCA9IDEwO1xyXG4gICAgICAgICAgICByYW5nZS5mb3JFYWNoKChjLCBpKT0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB2ID0gei5tYXggLSAoZXh0ZW50IC8gTWF0aC5wb3coMTAsIGkpKTtcclxuICAgICAgICAgICAgICAgIHouZG9tYWluLnB1c2godilcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHNjYWxlID0gZDMuc2NhbGUucG93KCkuZXhwb25lbnQoZXhwb25lbnQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29uZmlnLmNvbG9yLnNjYWxlID09IFwibG9nXCIpIHtcclxuXHJcbiAgICAgICAgICAgIHJhbmdlLmZvckVhY2goKGMsIGkpPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHYgPSB6Lm1pbiArIChleHRlbnQgLyBNYXRoLnBvdygxMCwgaSkpO1xyXG4gICAgICAgICAgICAgICAgei5kb21haW4udW5zaGlmdCh2KVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzY2FsZSA9IGQzLnNjYWxlLmxvZygpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmFuZ2UuZm9yRWFjaCgoYywgaSk9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdiA9IHoubWluICsgKGV4dGVudCAqIChpIC8gKHJhbmdlLmxlbmd0aCAtIDEpKSk7XHJcbiAgICAgICAgICAgICAgICB6LmRvbWFpbi5wdXNoKHYpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzY2FsZSA9IGQzLnNjYWxlW2NvbmZpZy5jb2xvci5zY2FsZV0oKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB6LmRvbWFpblswXSA9IHoubWluOyAvL3JlbW92aW5nIHVubmVjZXNzYXJ5IGZsb2F0aW5nIHBvaW50c1xyXG4gICAgICAgIHouZG9tYWluW3ouZG9tYWluLmxlbmd0aCAtIDFdID0gei5tYXg7IC8vcmVtb3ZpbmcgdW5uZWNlc3NhcnkgZmxvYXRpbmcgcG9pbnRzXHJcbiAgICAgICAgY29uc29sZS5sb2coei5kb21haW4pO1xyXG5cclxuICAgICAgICBpZiAoY29uZmlnLmNvbG9yLnJldmVyc2VTY2FsZSkge1xyXG4gICAgICAgICAgICB6LmRvbWFpbi5yZXZlcnNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2cocmFuZ2UpO1xyXG4gICAgICAgIHBsb3Quei5jb2xvci5zY2FsZSA9IHNjYWxlLmRvbWFpbih6LmRvbWFpbikucmFuZ2UocmFuZ2UpO1xyXG4gICAgICAgIHZhciBzaGFwZSA9IHBsb3Quei5zaGFwZSA9IHt9O1xyXG5cclxuICAgICAgICB2YXIgY2VsbENvbmYgPSB0aGlzLmNvbmZpZy5jZWxsO1xyXG4gICAgICAgIHNoYXBlLnR5cGUgPSBcInJlY3RcIjtcclxuXHJcbiAgICAgICAgcGxvdC56LnNoYXBlLndpZHRoID0gcGxvdC5jZWxsV2lkdGggLSBjZWxsQ29uZi5wYWRkaW5nICogMjtcclxuICAgICAgICBwbG90Lnouc2hhcGUuaGVpZ2h0ID0gcGxvdC5jZWxsSGVpZ2h0IC0gY2VsbENvbmYucGFkZGluZyAqIDI7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHVwZGF0ZShuZXdEYXRhKSB7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKG5ld0RhdGEpO1xyXG4gICAgICAgIGlmICh0aGlzLnBsb3QuZ3JvdXBCeVkpIHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3R3JvdXBzWSh0aGlzLnBsb3QueS5ncm91cHMsIHRoaXMuc3ZnRyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnBsb3QuZ3JvdXBCeVgpIHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3R3JvdXBzWCh0aGlzLnBsb3QueC5ncm91cHMsIHRoaXMuc3ZnRyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUNlbGxzKCk7XHJcblxyXG4gICAgICAgIC8vIHRoaXMudXBkYXRlVmFyaWFibGVMYWJlbHMoKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVBeGlzWCgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQXhpc1koKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnNob3dMZWdlbmQpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVMZWdlbmQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlQXhpc1RpdGxlcygpO1xyXG4gICAgfTtcclxuXHJcbiAgICB1cGRhdGVBeGlzVGl0bGVzKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICB1cGRhdGVBeGlzWCgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGxhYmVsQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwibGFiZWxcIik7XHJcbiAgICAgICAgdmFyIGxhYmVsWENsYXNzID0gbGFiZWxDbGFzcyArIFwiLXhcIjtcclxuICAgICAgICB2YXIgbGFiZWxZQ2xhc3MgPSBsYWJlbENsYXNzICsgXCIteVwiO1xyXG4gICAgICAgIHBsb3QubGFiZWxDbGFzcyA9IGxhYmVsQ2xhc3M7XHJcblxyXG4gICAgICAgIHZhciBvZmZzZXRYID0ge1xyXG4gICAgICAgICAgICB4OiAwLFxyXG4gICAgICAgICAgICB5OiAwXHJcbiAgICAgICAgfTtcclxuICAgICAgICBsZXQgZ2FwU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcFNpemUoMCk7XHJcbiAgICAgICAgaWYgKHBsb3QuZ3JvdXBCeVgpIHtcclxuICAgICAgICAgICAgbGV0IG92ZXJsYXAgPSBzZWxmLmNvbmZpZy54Lmdyb3Vwcy5vdmVybGFwO1xyXG5cclxuICAgICAgICAgICAgb2Zmc2V0WC54ID0gZ2FwU2l6ZSAvIDI7XHJcbiAgICAgICAgICAgIG9mZnNldFgueSA9IG92ZXJsYXAuYm90dG9tICsgZ2FwU2l6ZSAvIDIgKyA2O1xyXG4gICAgICAgIH0gZWxzZSBpZiAocGxvdC5ncm91cEJ5WSkge1xyXG4gICAgICAgICAgICBvZmZzZXRYLnkgPSBnYXBTaXplO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHZhciBsYWJlbHMgPSBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIGxhYmVsWENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShwbG90LnguYWxsVmFsdWVzTGlzdCwgKGQsIGkpPT5pKTtcclxuXHJcbiAgICAgICAgbGFiZWxzLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKS5hdHRyKFwiY2xhc3NcIiwgKGQsIGkpID0+IGxhYmVsQ2xhc3MgKyBcIiBcIiArIGxhYmVsWENsYXNzICsgXCIgXCIgKyBsYWJlbFhDbGFzcyArIFwiLVwiICsgaSk7XHJcblxyXG4gICAgICAgIGxhYmVsc1xyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgKGQsIGkpID0+IChpICogcGxvdC5jZWxsV2lkdGggKyBwbG90LmNlbGxXaWR0aCAvIDIpICsgKGQuZ3JvdXAuZ2Fwc1NpemUpICsgb2Zmc2V0WC54KVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgcGxvdC5oZWlnaHQgKyBvZmZzZXRYLnkpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgMTApXHJcblxyXG4gICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGQ9PnNlbGYuZm9ybWF0VmFsdWVYKGQudmFsKSk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgdmFyIG1heFdpZHRoID0gc2VsZi5jb21wdXRlWEF4aXNMYWJlbHNXaWR0aChvZmZzZXRYKTtcclxuXHJcbiAgICAgICAgbGFiZWxzLmVhY2goZnVuY3Rpb24gKGxhYmVsKSB7XHJcbiAgICAgICAgICAgIHZhciBlbGVtID0gZDMuc2VsZWN0KHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgdGV4dCA9IHNlbGYuZm9ybWF0VmFsdWVYKGxhYmVsLnZhbCk7XHJcbiAgICAgICAgICAgIFV0aWxzLnBsYWNlVGV4dFdpdGhFbGxpcHNpc0FuZFRvb2x0aXAoZWxlbSwgdGV4dCwgbWF4V2lkdGgsIHNlbGYuY29uZmlnLnNob3dUb29sdGlwID8gc2VsZi5wbG90LnRvb2x0aXAgOiBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy54LnJvdGF0ZUxhYmVscykge1xyXG4gICAgICAgICAgICBsYWJlbHMuYXR0cihcInRyYW5zZm9ybVwiLCAoZCwgaSkgPT4gXCJyb3RhdGUoLTQ1LCBcIiArICgoaSAqIHBsb3QuY2VsbFdpZHRoICsgcGxvdC5jZWxsV2lkdGggLyAyKSArIGQuZ3JvdXAuZ2Fwc1NpemUgKyBvZmZzZXRYLnggKSArIFwiLCBcIiArICggcGxvdC5oZWlnaHQgKyBvZmZzZXRYLnkpICsgXCIpXCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImR4XCIsIC0yKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCA4KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBsYWJlbHMuZXhpdCgpLnJlbW92ZSgpO1xyXG5cclxuXHJcbiAgICAgICAgc2VsZi5zdmdHLnNlbGVjdE9yQXBwZW5kKFwiZy5cIiArIHNlbGYucHJlZml4Q2xhc3MoJ2F4aXMteCcpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChwbG90LndpZHRoIC8gMikgKyBcIixcIiArIChwbG90LmhlaWdodCArIHBsb3QubWFyZ2luLmJvdHRvbSkgKyBcIilcIilcclxuICAgICAgICAgICAgLnNlbGVjdE9yQXBwZW5kKFwidGV4dC5cIiArIHNlbGYucHJlZml4Q2xhc3MoJ2xhYmVsJykpXHJcblxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiLTAuNWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KHNlbGYuY29uZmlnLngudGl0bGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUF4aXNZKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgbGFiZWxDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJsYWJlbFwiKTtcclxuICAgICAgICB2YXIgbGFiZWxZQ2xhc3MgPSBsYWJlbENsYXNzICsgXCIteVwiO1xyXG4gICAgICAgIHBsb3QubGFiZWxDbGFzcyA9IGxhYmVsQ2xhc3M7XHJcblxyXG5cclxuICAgICAgICB2YXIgbGFiZWxzID0gc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyBsYWJlbFlDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGxvdC55LmFsbFZhbHVlc0xpc3QpO1xyXG5cclxuICAgICAgICBsYWJlbHMuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpO1xyXG5cclxuICAgICAgICB2YXIgb2Zmc2V0WSA9IHtcclxuICAgICAgICAgICAgeDogMCxcclxuICAgICAgICAgICAgeTogMFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKHBsb3QuZ3JvdXBCeVkpIHtcclxuICAgICAgICAgICAgbGV0IG92ZXJsYXAgPSBzZWxmLmNvbmZpZy55Lmdyb3Vwcy5vdmVybGFwO1xyXG4gICAgICAgICAgICBsZXQgZ2FwU2l6ZSA9IEhlYXRtYXAuY29tcHV0ZUdhcFNpemUoMCk7XHJcbiAgICAgICAgICAgIG9mZnNldFkueCA9IC1vdmVybGFwLmxlZnQ7XHJcblxyXG4gICAgICAgICAgICBvZmZzZXRZLnkgPSBnYXBTaXplIC8gMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGFiZWxzXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCBvZmZzZXRZLngpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAoZCwgaSkgPT4gKGkgKiBwbG90LmNlbGxIZWlnaHQgKyBwbG90LmNlbGxIZWlnaHQgLyAyKSArIGQuZ3JvdXAuZ2Fwc1NpemUgKyBvZmZzZXRZLnkpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHhcIiwgLTIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCAoZCwgaSkgPT4gbGFiZWxDbGFzcyArIFwiIFwiICsgbGFiZWxZQ2xhc3MgKyBcIiBcIiArIGxhYmVsWUNsYXNzICsgXCItXCIgKyBpKVxyXG5cclxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBmb3JtYXR0ZWQgPSBzZWxmLmZvcm1hdFZhbHVlWShkLnZhbCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0dGVkXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgbWF4V2lkdGggPSBzZWxmLmNvbXB1dGVZQXhpc0xhYmVsc1dpZHRoKG9mZnNldFkpO1xyXG5cclxuICAgICAgICBsYWJlbHMuZWFjaChmdW5jdGlvbiAobGFiZWwpIHtcclxuICAgICAgICAgICAgdmFyIGVsZW0gPSBkMy5zZWxlY3QodGhpcyksXHJcbiAgICAgICAgICAgICAgICB0ZXh0ID0gc2VsZi5mb3JtYXRWYWx1ZVkobGFiZWwudmFsKTtcclxuICAgICAgICAgICAgVXRpbHMucGxhY2VUZXh0V2l0aEVsbGlwc2lzQW5kVG9vbHRpcChlbGVtLCB0ZXh0LCBtYXhXaWR0aCwgc2VsZi5jb25maWcuc2hvd1Rvb2x0aXAgPyBzZWxmLnBsb3QudG9vbHRpcCA6IGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLnkucm90YXRlTGFiZWxzKSB7XHJcbiAgICAgICAgICAgIGxhYmVsc1xyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgKGQsIGkpID0+IFwicm90YXRlKC00NSwgXCIgKyAob2Zmc2V0WS54ICApICsgXCIsIFwiICsgKGQuZ3JvdXAuZ2Fwc1NpemUgKyAoaSAqIHBsb3QuY2VsbEhlaWdodCArIHBsb3QuY2VsbEhlaWdodCAvIDIpICsgb2Zmc2V0WS55KSArIFwiKVwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKTtcclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJkeFwiLCAtNyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGFiZWxzLmF0dHIoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGxhYmVscy5leGl0KCkucmVtb3ZlKCk7XHJcblxyXG5cclxuICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiICsgc2VsZi5wcmVmaXhDbGFzcygnYXhpcy15JykpXHJcbiAgICAgICAgICAgIC5zZWxlY3RPckFwcGVuZChcInRleHQuXCIgKyBzZWxmLnByZWZpeENsYXNzKCdsYWJlbCcpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIC1wbG90Lm1hcmdpbi5sZWZ0ICsgXCIsXCIgKyAocGxvdC5oZWlnaHQgLyAyKSArIFwiKXJvdGF0ZSgtOTApXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCIxZW1cIilcclxuICAgICAgICAgICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoc2VsZi5jb25maWcueS50aXRsZSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBkcmF3R3JvdXBzWShwYXJlbnRHcm91cCwgY29udGFpbmVyLCBhdmFpbGFibGVXaWR0aCkge1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcblxyXG4gICAgICAgIHZhciBncm91cENsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImdyb3VwXCIpO1xyXG4gICAgICAgIHZhciBncm91cFlDbGFzcyA9IGdyb3VwQ2xhc3MgKyBcIi15XCI7XHJcbiAgICAgICAgdmFyIGdyb3VwcyA9IGNvbnRhaW5lci5zZWxlY3RBbGwoXCJnLlwiICsgZ3JvdXBDbGFzcyArIFwiLlwiICsgZ3JvdXBZQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHBhcmVudEdyb3VwLmNoaWxkcmVuTGlzdCk7XHJcblxyXG4gICAgICAgIHZhciB2YWx1ZXNCZWZvcmVDb3VudCA9IDA7XHJcbiAgICAgICAgdmFyIGdhcHNCZWZvcmVTaXplID0gMDtcclxuXHJcbiAgICAgICAgdmFyIGdyb3Vwc0VudGVyRyA9IGdyb3Vwcy5lbnRlcigpLmFwcGVuZChcImdcIik7XHJcbiAgICAgICAgZ3JvdXBzRW50ZXJHXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKGdyb3VwQ2xhc3MsIHRydWUpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKGdyb3VwWUNsYXNzLCB0cnVlKVxyXG4gICAgICAgICAgICAuYXBwZW5kKFwicmVjdFwiKS5jbGFzc2VkKFwiZ3JvdXAtcmVjdFwiLCB0cnVlKTtcclxuXHJcbiAgICAgICAgdmFyIHRpdGxlR3JvdXBFbnRlciA9IGdyb3Vwc0VudGVyRy5hcHBlbmRTZWxlY3RvcihcImcudGl0bGVcIik7XHJcbiAgICAgICAgdGl0bGVHcm91cEVudGVyLmFwcGVuZChcInJlY3RcIik7XHJcbiAgICAgICAgdGl0bGVHcm91cEVudGVyLmFwcGVuZChcInRleHRcIik7XHJcblxyXG4gICAgICAgIHZhciBnYXBTaXplID0gSGVhdG1hcC5jb21wdXRlR2FwU2l6ZShwYXJlbnRHcm91cC5sZXZlbCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBnYXBTaXplIC8gNDtcclxuXHJcbiAgICAgICAgdmFyIHRpdGxlUmVjdFdpZHRoID0gSGVhdG1hcC5ncm91cFRpdGxlUmVjdEhlaWdodDtcclxuICAgICAgICB2YXIgZGVwdGggPSBzZWxmLmNvbmZpZy55Lmdyb3Vwcy5rZXlzLmxlbmd0aCAtIHBhcmVudEdyb3VwLmxldmVsO1xyXG4gICAgICAgIHZhciBvdmVybGFwID0ge1xyXG4gICAgICAgICAgICBsZWZ0OiAwLFxyXG4gICAgICAgICAgICByaWdodDogMFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmICghYXZhaWxhYmxlV2lkdGgpIHtcclxuICAgICAgICAgICAgb3ZlcmxhcC5yaWdodCA9IHBsb3QueS5vdmVybGFwLmxlZnQ7XHJcbiAgICAgICAgICAgIG92ZXJsYXAubGVmdCA9IHBsb3QueS5vdmVybGFwLmxlZnQ7XHJcbiAgICAgICAgICAgIGF2YWlsYWJsZVdpZHRoID0gcGxvdC53aWR0aCArIGdhcFNpemUgKyBvdmVybGFwLmxlZnQgKyBvdmVybGFwLnJpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGdyb3Vwc1xyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCAoZCwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRyYW5zbGF0ZSA9IFwidHJhbnNsYXRlKFwiICsgKHBhZGRpbmcgLSBvdmVybGFwLmxlZnQpICsgXCIsXCIgKyAoKHBsb3QuY2VsbEhlaWdodCAqIHZhbHVlc0JlZm9yZUNvdW50KSArIGkgKiBnYXBTaXplICsgZ2Fwc0JlZm9yZVNpemUgKyBwYWRkaW5nKSArIFwiKVwiO1xyXG4gICAgICAgICAgICAgICAgZ2Fwc0JlZm9yZVNpemUgKz0gKGQuZ2Fwc0luc2lkZVNpemUgfHwgMCk7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZXNCZWZvcmVDb3VudCArPSBkLmFsbFZhbHVlc0NvdW50IHx8IDA7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhbnNsYXRlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGdyb3VwV2lkdGggPSBhdmFpbGFibGVXaWR0aCAtIHBhZGRpbmcgKiAyO1xyXG5cclxuICAgICAgICB2YXIgdGl0bGVHcm91cHMgPSBncm91cHMuc2VsZWN0QWxsKFwiZy50aXRsZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCAoZCwgaSkgPT4gXCJ0cmFuc2xhdGUoXCIgKyAoZ3JvdXBXaWR0aCAtIHRpdGxlUmVjdFdpZHRoKSArIFwiLCAwKVwiKTtcclxuXHJcbiAgICAgICAgdmFyIHRpbGVSZWN0cyA9IHRpdGxlR3JvdXBzLnNlbGVjdEFsbChcInJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB0aXRsZVJlY3RXaWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZD0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoZC5nYXBzSW5zaWRlU2l6ZSB8fCAwKSArIHBsb3QuY2VsbEhlaWdodCAqIGQuYWxsVmFsdWVzQ291bnQgKyBwYWRkaW5nICogMlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIDApXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwiZmlsbFwiLCBcImxpZ2h0Z3JleVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRHcm91cE1vdXNlQ2FsbGJhY2tzKHBhcmVudEdyb3VwLCB0aWxlUmVjdHMpO1xyXG5cclxuXHJcbiAgICAgICAgZ3JvdXBzLnNlbGVjdEFsbChcInJlY3QuZ3JvdXAtcmVjdFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGQ9PiBcImdyb3VwLXJlY3QgZ3JvdXAtcmVjdC1cIiArIGQuaW5kZXgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgZ3JvdXBXaWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZD0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoZC5nYXBzSW5zaWRlU2l6ZSB8fCAwKSArIHBsb3QuY2VsbEhlaWdodCAqIGQuYWxsVmFsdWVzQ291bnQgKyBwYWRkaW5nICogMlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCBcIndoaXRlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZmlsbC1vcGFjaXR5XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDAuNSlcclxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2VcIiwgXCJibGFja1wiKVxyXG5cclxuXHJcbiAgICAgICAgZ3JvdXBzLmVhY2goZnVuY3Rpb24gKGdyb3VwKSB7XHJcblxyXG4gICAgICAgICAgICBzZWxmLmRyYXdHcm91cHNZLmNhbGwoc2VsZiwgZ3JvdXAsIGQzLnNlbGVjdCh0aGlzKSwgZ3JvdXBXaWR0aCAtIHRpdGxlUmVjdFdpZHRoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZHJhd0dyb3Vwc1gocGFyZW50R3JvdXAsIGNvbnRhaW5lciwgYXZhaWxhYmxlSGVpZ2h0KSB7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuXHJcbiAgICAgICAgdmFyIGdyb3VwQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwiZ3JvdXBcIik7XHJcbiAgICAgICAgdmFyIGdyb3VwWENsYXNzID0gZ3JvdXBDbGFzcyArIFwiLXhcIjtcclxuICAgICAgICB2YXIgZ3JvdXBzID0gY29udGFpbmVyLnNlbGVjdEFsbChcImcuXCIgKyBncm91cENsYXNzICsgXCIuXCIgKyBncm91cFhDbGFzcylcclxuICAgICAgICAgICAgLmRhdGEocGFyZW50R3JvdXAuY2hpbGRyZW5MaXN0KTtcclxuXHJcbiAgICAgICAgdmFyIHZhbHVlc0JlZm9yZUNvdW50ID0gMDtcclxuICAgICAgICB2YXIgZ2Fwc0JlZm9yZVNpemUgPSAwO1xyXG5cclxuICAgICAgICB2YXIgZ3JvdXBzRW50ZXJHID0gZ3JvdXBzLmVudGVyKCkuYXBwZW5kKFwiZ1wiKTtcclxuICAgICAgICBncm91cHNFbnRlckdcclxuICAgICAgICAgICAgLmNsYXNzZWQoZ3JvdXBDbGFzcywgdHJ1ZSlcclxuICAgICAgICAgICAgLmNsYXNzZWQoZ3JvdXBYQ2xhc3MsIHRydWUpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoXCJyZWN0XCIpLmNsYXNzZWQoXCJncm91cC1yZWN0XCIsIHRydWUpO1xyXG5cclxuICAgICAgICB2YXIgdGl0bGVHcm91cEVudGVyID0gZ3JvdXBzRW50ZXJHLmFwcGVuZFNlbGVjdG9yKFwiZy50aXRsZVwiKTtcclxuICAgICAgICB0aXRsZUdyb3VwRW50ZXIuYXBwZW5kKFwicmVjdFwiKTtcclxuICAgICAgICB0aXRsZUdyb3VwRW50ZXIuYXBwZW5kKFwidGV4dFwiKTtcclxuXHJcbiAgICAgICAgdmFyIGdhcFNpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBTaXplKHBhcmVudEdyb3VwLmxldmVsKTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IGdhcFNpemUgLyA0O1xyXG4gICAgICAgIHZhciB0aXRsZVJlY3RIZWlnaHQgPSBIZWF0bWFwLmdyb3VwVGl0bGVSZWN0SGVpZ2h0O1xyXG5cclxuICAgICAgICB2YXIgZGVwdGggPSBzZWxmLmNvbmZpZy54Lmdyb3Vwcy5rZXlzLmxlbmd0aCAtIHBhcmVudEdyb3VwLmxldmVsO1xyXG5cclxuICAgICAgICB2YXIgb3ZlcmxhcCA9IHtcclxuICAgICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgICAgICBib3R0b206IDBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoIWF2YWlsYWJsZUhlaWdodCkge1xyXG4gICAgICAgICAgICBvdmVybGFwLmJvdHRvbSA9IHBsb3QueC5vdmVybGFwLmJvdHRvbTtcclxuICAgICAgICAgICAgb3ZlcmxhcC50b3AgPSBwbG90Lngub3ZlcmxhcC50b3A7XHJcbiAgICAgICAgICAgIGF2YWlsYWJsZUhlaWdodCA9IHBsb3QuaGVpZ2h0ICsgZ2FwU2l6ZSArIG92ZXJsYXAudG9wICsgb3ZlcmxhcC5ib3R0b207XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG92ZXJsYXAudG9wID0gLXRpdGxlUmVjdEhlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3BhcmVudEdyb3VwJyxwYXJlbnRHcm91cCwgJ2dhcFNpemUnLCBnYXBTaXplLCBwbG90Lngub3ZlcmxhcCk7XHJcblxyXG4gICAgICAgIGdyb3Vwc1xyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCAoZCwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRyYW5zbGF0ZSA9IFwidHJhbnNsYXRlKFwiICsgKChwbG90LmNlbGxXaWR0aCAqIHZhbHVlc0JlZm9yZUNvdW50KSArIGkgKiBnYXBTaXplICsgZ2Fwc0JlZm9yZVNpemUgKyBwYWRkaW5nKSArIFwiLCBcIiArIChwYWRkaW5nIC0gb3ZlcmxhcC50b3ApICsgXCIpXCI7XHJcbiAgICAgICAgICAgICAgICBnYXBzQmVmb3JlU2l6ZSArPSAoZC5nYXBzSW5zaWRlU2l6ZSB8fCAwKTtcclxuICAgICAgICAgICAgICAgIHZhbHVlc0JlZm9yZUNvdW50ICs9IGQuYWxsVmFsdWVzQ291bnQgfHwgMDtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cmFuc2xhdGVcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciBncm91cEhlaWdodCA9IGF2YWlsYWJsZUhlaWdodCAtIHBhZGRpbmcgKiAyO1xyXG5cclxuICAgICAgICB2YXIgdGl0bGVHcm91cHMgPSBncm91cHMuc2VsZWN0QWxsKFwiZy50aXRsZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCAoZCwgaSkgPT4gXCJ0cmFuc2xhdGUoMCwgXCIgKyAoMCkgKyBcIilcIik7XHJcblxyXG5cclxuICAgICAgICB2YXIgdGlsZVJlY3RzID0gdGl0bGVHcm91cHMuc2VsZWN0QWxsKFwicmVjdFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCB0aXRsZVJlY3RIZWlnaHQpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgZD0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoZC5nYXBzSW5zaWRlU2l6ZSB8fCAwKSArIHBsb3QuY2VsbFdpZHRoICogZC5hbGxWYWx1ZXNDb3VudCArIHBhZGRpbmcgKiAyXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgMClcclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJmaWxsXCIsIFwibGlnaHRncmV5XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDApO1xyXG5cclxuICAgICAgICB0aGlzLnNldEdyb3VwTW91c2VDYWxsYmFja3MocGFyZW50R3JvdXAsIHRpbGVSZWN0cyk7XHJcblxyXG5cclxuICAgICAgICBncm91cHMuc2VsZWN0QWxsKFwicmVjdC5ncm91cC1yZWN0XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgZD0+IFwiZ3JvdXAtcmVjdCBncm91cC1yZWN0LVwiICsgZC5pbmRleClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZ3JvdXBIZWlnaHQpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgZD0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoZC5nYXBzSW5zaWRlU2l6ZSB8fCAwKSArIHBsb3QuY2VsbFdpZHRoICogZC5hbGxWYWx1ZXNDb3VudCArIHBhZGRpbmcgKiAyXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIFwid2hpdGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJmaWxsLW9wYWNpdHlcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMC41KVxyXG4gICAgICAgICAgICAuYXR0cihcInN0cm9rZVwiLCBcImJsYWNrXCIpO1xyXG5cclxuICAgICAgICBncm91cHMuZWFjaChmdW5jdGlvbiAoZ3JvdXApIHtcclxuICAgICAgICAgICAgc2VsZi5kcmF3R3JvdXBzWC5jYWxsKHNlbGYsIGdyb3VwLCBkMy5zZWxlY3QodGhpcyksIGdyb3VwSGVpZ2h0IC0gdGl0bGVSZWN0SGVpZ2h0KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZ3JvdXBzLmV4aXQoKS5yZW1vdmUoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgc2V0R3JvdXBNb3VzZUNhbGxiYWNrcyhwYXJlbnRHcm91cCwgdGlsZVJlY3RzKSB7XHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBtb3VzZW92ZXJDYWxsYmFja3MgPSBbXTtcclxuICAgICAgICBtb3VzZW92ZXJDYWxsYmFja3MucHVzaChmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICBkMy5zZWxlY3QodGhpcykuY2xhc3NlZCgnaGlnaGxpZ2h0ZWQnLCB0cnVlKTtcclxuICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlKS5zZWxlY3RBbGwoXCJyZWN0Lmdyb3VwLXJlY3QtXCIgKyBkLmluZGV4KS5jbGFzc2VkKCdoaWdobGlnaHRlZCcsIHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgbW91c2VvdXRDYWxsYmFja3MgPSBbXTtcclxuICAgICAgICBtb3VzZW91dENhbGxiYWNrcy5wdXNoKGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKCdoaWdobGlnaHRlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlKS5zZWxlY3RBbGwoXCJyZWN0Lmdyb3VwLXJlY3QtXCIgKyBkLmluZGV4KS5jbGFzc2VkKCdoaWdobGlnaHRlZCcsIGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAocGxvdC50b29sdGlwKSB7XHJcblxyXG4gICAgICAgICAgICBtb3VzZW92ZXJDYWxsYmFja3MucHVzaChkPT4ge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAuOSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IHBhcmVudEdyb3VwLmxhYmVsICsgXCI6IFwiICsgZC5ncm91cGluZ1ZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC5odG1sKGh0bWwpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZDMuZXZlbnQucGFnZVggKyA1KSArIFwicHhcIilcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBtb3VzZW91dENhbGxiYWNrcy5wdXNoKGQ9PiB7XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICB0aWxlUmVjdHMub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBtb3VzZW92ZXJDYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoc2VsZiwgZClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGlsZVJlY3RzLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBtb3VzZW91dENhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChzZWxmLCBkKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVDZWxscygpIHtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBjZWxsQ29udGFpbmVyQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwiY2VsbHNcIik7XHJcbiAgICAgICAgdmFyIGdhcFNpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBTaXplKDApO1xyXG4gICAgICAgIHZhciBwYWRkaW5nWCA9IHBsb3QueC5ncm91cHMuY2hpbGRyZW5MaXN0Lmxlbmd0aCA/IGdhcFNpemUgLyAyIDogMDtcclxuICAgICAgICB2YXIgcGFkZGluZ1kgPSBwbG90LnkuZ3JvdXBzLmNoaWxkcmVuTGlzdC5sZW5ndGggPyBnYXBTaXplIC8gMiA6IDA7XHJcbiAgICAgICAgdmFyIGNlbGxDb250YWluZXIgPSBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiICsgY2VsbENvbnRhaW5lckNsYXNzKTtcclxuICAgICAgICBjZWxsQ29udGFpbmVyLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyBwYWRkaW5nWCArIFwiLCBcIiArIHBhZGRpbmdZICsgXCIpXCIpO1xyXG5cclxuICAgICAgICB2YXIgY2VsbENsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImNlbGxcIik7XHJcbiAgICAgICAgdmFyIGNlbGxTaGFwZSA9IHBsb3Quei5zaGFwZS50eXBlO1xyXG5cclxuICAgICAgICB2YXIgY2VsbHMgPSBjZWxsQ29udGFpbmVyLnNlbGVjdEFsbChcImcuXCIgKyBjZWxsQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKHNlbGYucGxvdC5jZWxscyk7XHJcblxyXG4gICAgICAgIHZhciBjZWxsRW50ZXJHID0gY2VsbHMuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5jbGFzc2VkKGNlbGxDbGFzcywgdHJ1ZSk7XHJcbiAgICAgICAgY2VsbHMuYXR0cihcInRyYW5zZm9ybVwiLCBjPT4gXCJ0cmFuc2xhdGUoXCIgKyAoKHBsb3QuY2VsbFdpZHRoICogYy5jb2wgKyBwbG90LmNlbGxXaWR0aCAvIDIpICsgYy5jb2xWYXIuZ3JvdXAuZ2Fwc1NpemUpICsgXCIsXCIgKyAoKHBsb3QuY2VsbEhlaWdodCAqIGMucm93ICsgcGxvdC5jZWxsSGVpZ2h0IC8gMikgKyBjLnJvd1Zhci5ncm91cC5nYXBzU2l6ZSkgKyBcIilcIik7XHJcblxyXG4gICAgICAgIHZhciBzaGFwZXMgPSBjZWxscy5zZWxlY3RPckFwcGVuZChjZWxsU2hhcGUgKyBcIi5jZWxsLXNoYXBlLVwiICsgY2VsbFNoYXBlKTtcclxuXHJcbiAgICAgICAgc2hhcGVzXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgcGxvdC56LnNoYXBlLndpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBwbG90Lnouc2hhcGUuaGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgLXBsb3QuY2VsbFdpZHRoIC8gMilcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIC1wbG90LmNlbGxIZWlnaHQgLyAyKTtcclxuXHJcbiAgICAgICAgc2hhcGVzLnN0eWxlKFwiZmlsbFwiLCBjPT4gYy52YWx1ZSA9PT0gdW5kZWZpbmVkID8gc2VsZi5jb25maWcuY29sb3Iubm9EYXRhQ29sb3IgOiBwbG90LnouY29sb3Iuc2NhbGUoYy52YWx1ZSkpO1xyXG4gICAgICAgIHNoYXBlcy5hdHRyKFwiZmlsbC1vcGFjaXR5XCIsIGQ9PiBkLnZhbHVlID09PSB1bmRlZmluZWQgPyAwIDogMSk7XHJcblxyXG4gICAgICAgIHZhciBtb3VzZW92ZXJDYWxsYmFja3MgPSBbXTtcclxuICAgICAgICB2YXIgbW91c2VvdXRDYWxsYmFja3MgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKHBsb3QudG9vbHRpcCkge1xyXG5cclxuICAgICAgICAgICAgbW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goYz0+IHtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGh0bWwgPSBjLnZhbHVlID09PSB1bmRlZmluZWQgPyBzZWxmLmNvbmZpZy50b29sdGlwLm5vRGF0YVRleHQgOiBzZWxmLmZvcm1hdFZhbHVlWihjLnZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAuaHRtbChodG1sKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwidG9wXCIsIChkMy5ldmVudC5wYWdlWSAtIDI4KSArIFwicHhcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MucHVzaChjPT4ge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy5oaWdobGlnaHRMYWJlbHMpIHtcclxuICAgICAgICAgICAgdmFyIGhpZ2hsaWdodENsYXNzID0gc2VsZi5jb25maWcuY3NzQ2xhc3NQcmVmaXggKyBcImhpZ2hsaWdodFwiO1xyXG4gICAgICAgICAgICB2YXIgeExhYmVsQ2xhc3MgPSBjPT5wbG90LmxhYmVsQ2xhc3MgKyBcIi14LVwiICsgYy5jb2w7XHJcbiAgICAgICAgICAgIHZhciB5TGFiZWxDbGFzcyA9IGM9PnBsb3QubGFiZWxDbGFzcyArIFwiLXktXCIgKyBjLnJvdztcclxuXHJcblxyXG4gICAgICAgICAgICBtb3VzZW92ZXJDYWxsYmFja3MucHVzaChjPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJ0ZXh0LlwiICsgeExhYmVsQ2xhc3MoYykpLmNsYXNzZWQoaGlnaGxpZ2h0Q2xhc3MsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdmdHLnNlbGVjdEFsbChcInRleHQuXCIgKyB5TGFiZWxDbGFzcyhjKSkuY2xhc3NlZChoaWdobGlnaHRDbGFzcywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBtb3VzZW91dENhbGxiYWNrcy5wdXNoKGM9PiB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHhMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnN2Z0cuc2VsZWN0QWxsKFwidGV4dC5cIiArIHlMYWJlbENsYXNzKGMpKS5jbGFzc2VkKGhpZ2hsaWdodENsYXNzLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGNlbGxzLm9uKFwibW91c2VvdmVyXCIsIGMgPT4ge1xyXG4gICAgICAgICAgICBtb3VzZW92ZXJDYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjaz0+Y2FsbGJhY2soYykpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGMgPT4ge1xyXG4gICAgICAgICAgICAgICAgbW91c2VvdXRDYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjaz0+Y2FsbGJhY2soYykpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY2VsbHMub24oXCJjbGlja1wiLCBjPT4ge1xyXG4gICAgICAgICAgICBzZWxmLnRyaWdnZXIoXCJjZWxsLXNlbGVjdGVkXCIsIGMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgY2VsbHMuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcm1hdFZhbHVlWCh2YWx1ZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcueC5mb3JtYXR0ZXIpIHJldHVybiB2YWx1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnguZm9ybWF0dGVyLmNhbGwodGhpcy5jb25maWcsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3JtYXRWYWx1ZVkodmFsdWUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLnkuZm9ybWF0dGVyKSByZXR1cm4gdmFsdWU7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy55LmZvcm1hdHRlci5jYWxsKHRoaXMuY29uZmlnLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9ybWF0VmFsdWVaKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy56LmZvcm1hdHRlcikgcmV0dXJuIHZhbHVlO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuei5mb3JtYXR0ZXIuY2FsbCh0aGlzLmNvbmZpZywgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcm1hdExlZ2VuZFZhbHVlKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5sZWdlbmQuZm9ybWF0dGVyKSByZXR1cm4gdmFsdWU7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5sZWdlbmQuZm9ybWF0dGVyLmNhbGwodGhpcy5jb25maWcsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVMZWdlbmQoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciBsZWdlbmRYID0gdGhpcy5wbG90LndpZHRoICsgMTA7XHJcbiAgICAgICAgdmFyIGdhcFNpemUgPSBIZWF0bWFwLmNvbXB1dGVHYXBTaXplKDApO1xyXG4gICAgICAgIGlmICh0aGlzLnBsb3QuZ3JvdXBCeVkpIHtcclxuICAgICAgICAgICAgbGVnZW5kWCArPSBnYXBTaXplIC8gMiArIHBsb3QueS5vdmVybGFwLnJpZ2h0O1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wbG90Lmdyb3VwQnlYKSB7XHJcbiAgICAgICAgICAgIGxlZ2VuZFggKz0gZ2FwU2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGxlZ2VuZFkgPSAwO1xyXG4gICAgICAgIGlmICh0aGlzLnBsb3QuZ3JvdXBCeVggfHwgdGhpcy5wbG90Lmdyb3VwQnlZKSB7XHJcbiAgICAgICAgICAgIGxlZ2VuZFkgKz0gZ2FwU2l6ZSAvIDI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgYmFyV2lkdGggPSAxMDtcclxuICAgICAgICB2YXIgYmFySGVpZ2h0ID0gdGhpcy5wbG90LmhlaWdodCAtIDI7XHJcbiAgICAgICAgdmFyIHNjYWxlID0gcGxvdC56LmNvbG9yLnNjYWxlO1xyXG5cclxuICAgICAgICBwbG90LmxlZ2VuZCA9IG5ldyBMZWdlbmQodGhpcy5zdmcsIHRoaXMuc3ZnRywgc2NhbGUsIGxlZ2VuZFgsIGxlZ2VuZFksIHYgPT4gc2VsZi5mb3JtYXRMZWdlbmRWYWx1ZSh2KSkuc2V0Um90YXRlTGFiZWxzKHNlbGYuY29uZmlnLmxlZ2VuZC5yb3RhdGVMYWJlbHMpLmxpbmVhckdyYWRpZW50QmFyKGJhcldpZHRoLCBiYXJIZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuIiwiaW1wb3J0IHtDaGFydCwgQ2hhcnRDb25maWd9IGZyb20gXCIuL2NoYXJ0XCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7TGVnZW5kfSBmcm9tIFwiLi9sZWdlbmRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBIaXN0b2dyYW1Db25maWcgZXh0ZW5kcyBDaGFydENvbmZpZ3tcclxuXHJcbiAgICBzdmdDbGFzcz0gdGhpcy5jc3NDbGFzc1ByZWZpeCsnaGlzdG9ncmFtJztcclxuICAgIHNob3dMZWdlbmQ9dHJ1ZTtcclxuICAgIHNob3dUb29sdGlwID10cnVlO1xyXG4gICAgbGVnZW5kPXtcclxuICAgICAgICB3aWR0aDogODAsXHJcbiAgICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgICBzaGFwZVdpZHRoOiAyMFxyXG4gICAgfTtcclxuICAgIHg9ey8vIFggYXhpcyBjb25maWdcclxuICAgICAgICBsYWJlbDogJycsIC8vIGF4aXMgbGFiZWxcclxuICAgICAgICBrZXk6IDAsXHJcbiAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IFV0aWxzLmlzTnVtYmVyKGQpID8gZCA6IGRba2V5XSwgLy8geCB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiLFxyXG4gICAgICAgIHRpY2tzOiB1bmRlZmluZWQsXHJcbiAgICB9O1xyXG4gICAgeT17Ly8gWSBheGlzIGNvbmZpZ1xyXG4gICAgICAgIGxhYmVsOiAnJywgLy8gYXhpcyBsYWJlbCxcclxuICAgICAgICBvcmllbnQ6IFwibGVmdFwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiXHJcbiAgICB9O1xyXG4gICAgZ3JvdXBzPXtcclxuICAgICAgICBrZXk6IDEsXHJcbiAgICAgICAgdmFsdWU6IChkKSA9PiBkW3RoaXMuZ3JvdXBzLmtleV0gLCAvLyBncm91cGluZyB2YWx1ZSBhY2Nlc3NvcixcclxuICAgICAgICBsYWJlbDogXCJcIlxyXG4gICAgfTtcclxuICAgIGNvbG9yID0gdW5kZWZpbmVkIC8vIHN0cmluZyBvciBmdW5jdGlvbiByZXR1cm5pbmcgY29sb3IncyB2YWx1ZSBmb3IgY29sb3Igc2NhbGVcclxuICAgIGQzQ29sb3JDYXRlZ29yeT0gJ2NhdGVnb3J5MTAnO1xyXG4gICAgdHJhbnNpdGlvbj0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjdXN0b20pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdmFyIGNvbmZpZyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmKGN1c3RvbSl7XHJcbiAgICAgICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSGlzdG9ncmFtIGV4dGVuZHMgQ2hhcnR7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBzdXBlcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBuZXcgSGlzdG9ncmFtQ29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpe1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IEhpc3RvZ3JhbUNvbmZpZyhjb25maWcpKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpe1xyXG4gICAgICAgIHN1cGVyLmluaXRQbG90KCk7XHJcbiAgICAgICAgdmFyIHNlbGY9dGhpcztcclxuXHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgdGhpcy5wbG90Lng9e307XHJcbiAgICAgICAgdGhpcy5wbG90Lnk9e307XHJcbiAgICAgICAgdGhpcy5wbG90LmJhcj17XHJcbiAgICAgICAgICAgIGNvbG9yOiBudWxsLy9jb2xvciBzY2FsZSBtYXBwaW5nIGZ1bmN0aW9uXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnNob3dMZWdlbmQgPSBjb25mLnNob3dMZWdlbmQ7XHJcbiAgICAgICAgaWYodGhpcy5wbG90LnNob3dMZWdlbmQpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QubWFyZ2luLnJpZ2h0ID0gY29uZi5tYXJnaW4ucmlnaHQgKyBjb25mLmxlZ2VuZC53aWR0aCtjb25mLmxlZ2VuZC5tYXJnaW4qMjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLmNvbXB1dGVQbG90U2l6ZSgpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cFgoKTtcclxuICAgICAgICB0aGlzLnNldHVwSGlzdG9ncmFtKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cEdyb3VwU3RhY2tzKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFkoKTtcclxuXHJcbiAgICAgICAgaWYoY29uZi5kM0NvbG9yQ2F0ZWdvcnkpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuY29sb3JDYXRlZ29yeSA9IGQzLnNjYWxlW2NvbmYuZDNDb2xvckNhdGVnb3J5XSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY29sb3JWYWx1ZSA9IGNvbmYuY29sb3I7XHJcbiAgICAgICAgaWYgKGNvbG9yVmFsdWUgJiYgdHlwZW9mIGNvbG9yVmFsdWUgPT09ICdzdHJpbmcnIHx8IGNvbG9yVmFsdWUgaW5zdGFuY2VvZiBTdHJpbmcpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuY29sb3IgPSBjb2xvclZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKHRoaXMucGxvdC5jb2xvckNhdGVnb3J5KXtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmNvbG9yID0gZCA9PiAgc2VsZi5wbG90LmNvbG9yQ2F0ZWdvcnkoZC5rZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXBYKCl7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB4ID0gcGxvdC54O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWcueDtcclxuXHJcbiAgICAgICAgLyogKlxyXG4gICAgICAgICAqIHZhbHVlIGFjY2Vzc29yIC0gcmV0dXJucyB0aGUgdmFsdWUgdG8gZW5jb2RlIGZvciBhIGdpdmVuIGRhdGEgb2JqZWN0LlxyXG4gICAgICAgICAqIHNjYWxlIC0gbWFwcyB2YWx1ZSB0byBhIHZpc3VhbCBkaXNwbGF5IGVuY29kaW5nLCBzdWNoIGFzIGEgcGl4ZWwgcG9zaXRpb24uXHJcbiAgICAgICAgICogbWFwIGZ1bmN0aW9uIC0gbWFwcyBmcm9tIGRhdGEgdmFsdWUgdG8gZGlzcGxheSB2YWx1ZVxyXG4gICAgICAgICAqIGF4aXMgLSBzZXRzIHVwIGF4aXNcclxuICAgICAgICAgKiovXHJcbiAgICAgICAgeC52YWx1ZSA9IGQgPT4gY29uZi52YWx1ZShkLCBjb25mLmtleSk7XHJcbiAgICAgICAgeC5zY2FsZSA9IGQzLnNjYWxlW2NvbmYuc2NhbGVdKCkucmFuZ2UoWzAsIHBsb3Qud2lkdGhdKTtcclxuICAgICAgICB4Lm1hcCA9IGQgPT4geC5zY2FsZSh4LnZhbHVlKGQpKTtcclxuXHJcbiAgICAgICAgeC5heGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh4LnNjYWxlKS5vcmllbnQoY29uZi5vcmllbnQpO1xyXG4gICAgICAgIGlmKGNvbmYudGlja3Mpe1xyXG4gICAgICAgICAgICB4LmF4aXMudGlja3MoY29uZi50aWNrcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIHBsb3QueC5zY2FsZS5kb21haW4oW2QzLm1pbihkYXRhLCBwbG90LngudmFsdWUpLCBkMy5tYXgoZGF0YSwgcGxvdC54LnZhbHVlKV0pO1xyXG5cclxuXHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cFkgKCl7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB5ID0gcGxvdC55O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWcueTtcclxuICAgICAgICB5LnNjYWxlID0gZDMuc2NhbGVbY29uZi5zY2FsZV0oKS5yYW5nZShbcGxvdC5oZWlnaHQsIDBdKTtcclxuXHJcbiAgICAgICAgeS5heGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh5LnNjYWxlKS5vcmllbnQoY29uZi5vcmllbnQpO1xyXG5cclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgICAgICBwbG90Lnkuc2NhbGUuZG9tYWluKFswLCBkMy5tYXgocGxvdC5oaXN0b2dyYW1CaW5zLCBkPT5kLnkpXSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwSGlzdG9ncmFtKCkge1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB4ID0gcGxvdC54O1xyXG4gICAgICAgIHZhciB5ID0gcGxvdC55O1xyXG4gICAgICAgIHZhciB0aWNrcyA9IHRoaXMuY29uZmlnLngudGlja3MgPyB4LnNjYWxlLnRpY2tzKHRoaXMuY29uZmlnLngudGlja3MpIDogeC5zY2FsZS50aWNrcygpO1xyXG5cclxuICAgICAgICBwbG90Lmhpc3RvZ3JhbSA9IGQzLmxheW91dC5oaXN0b2dyYW0oKVxyXG4gICAgICAgICAgICAudmFsdWUoeC52YWx1ZSlcclxuICAgICAgICAgICAgLmJpbnModGlja3MpO1xyXG4gICAgICAgIHBsb3QuaGlzdG9ncmFtQmlucyA9IHBsb3QuaGlzdG9ncmFtKHRoaXMuZGF0YSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNldHVwR3JvdXBTdGFja3MoKSB7XHJcbiAgICAgICAgdGhpcy5wbG90Lmdyb3VwaW5nRW5hYmxlZCA9IHRoaXMuY29uZmlnLmdyb3VwcyAmJiB0aGlzLmNvbmZpZy5ncm91cHMudmFsdWU7XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC5zdGFjayA9IGQzLmxheW91dC5zdGFjaygpLnZhbHVlcyhmdW5jdGlvbihkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZC5oaXN0b2dyYW1CaW5zO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMucGxvdC5ncm91cGVkRGF0YSA9ICBkMy5uZXN0KCkua2V5KGQgPT4gdGhpcy5wbG90Lmdyb3VwaW5nRW5hYmxlZCA/IHRoaXMuY29uZmlnLmdyb3Vwcy52YWx1ZS5jYWxsKHRoaXMuY29uZmlnLCBkKSA6ICdyb290JyApLmVudHJpZXModGhpcy5kYXRhKTtcclxuICAgICAgICB0aGlzLnBsb3QuZ3JvdXBlZERhdGEuZm9yRWFjaChkPT57XHJcbiAgICAgICAgICAgIGQuaGlzdG9ncmFtQmlucyA9IHRoaXMucGxvdC5oaXN0b2dyYW0oZC52YWx1ZXMpO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnBsb3Quc3RhY2tlZEhpc3RvZ3JhbXMgPSB0aGlzLnBsb3Quc3RhY2sodGhpcy5wbG90Lmdyb3VwZWREYXRhKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygndGhpcy5wbG90Lmdyb3VwZWREYXRhJyx0aGlzLnBsb3QuZ3JvdXBlZERhdGEsICd0aGlzLnBsb3Quc3RhY2tlZEhpc3RvZ3JhbXMgJyx0aGlzLnBsb3Quc3RhY2tlZEhpc3RvZ3JhbXMgKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZHJhd0F4aXNYKCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBheGlzQ29uZiA9IHRoaXMuY29uZmlnLng7XHJcbiAgICAgICAgdmFyIGF4aXMgPSBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMteCcpK1wiLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMnKSsoc2VsZi5jb25maWcuZ3VpZGVzID8gJycgOiAnLicrc2VsZi5wcmVmaXhDbGFzcygnbm8tZ3VpZGVzJykpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgcGxvdC5oZWlnaHQgKyBcIilcIik7XHJcblxyXG4gICAgICAgIHZhciBheGlzVCA9IGF4aXM7XHJcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLnRyYW5zaXRpb24pIHtcclxuICAgICAgICAgICAgYXhpc1QgPSBheGlzLnRyYW5zaXRpb24oKS5lYXNlKFwic2luLWluLW91dFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGF4aXNULmNhbGwocGxvdC54LmF4aXMpO1xyXG5cclxuICAgICAgICBheGlzLnNlbGVjdE9yQXBwZW5kKFwidGV4dC5cIitzZWxmLnByZWZpeENsYXNzKCdsYWJlbCcpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisgKHBsb3Qud2lkdGgvMikgK1wiLFwiKyAocGxvdC5tYXJnaW4uYm90dG9tKSArXCIpXCIpICAvLyB0ZXh0IGlzIGRyYXduIG9mZiB0aGUgc2NyZWVuIHRvcCBsZWZ0LCBtb3ZlIGRvd24gYW5kIG91dCBhbmQgcm90YXRlXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCItMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGF4aXNDb25mLmxhYmVsKTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhd0F4aXNZKCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgIHZhciBheGlzQ29uZiA9IHRoaXMuY29uZmlnLnk7XHJcbiAgICAgICAgdmFyIGF4aXMgPSBzZWxmLnN2Z0cuc2VsZWN0T3JBcHBlbmQoXCJnLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMteScpK1wiLlwiK3NlbGYucHJlZml4Q2xhc3MoJ2F4aXMnKSsoc2VsZi5jb25maWcuZ3VpZGVzID8gJycgOiAnLicrc2VsZi5wcmVmaXhDbGFzcygnbm8tZ3VpZGVzJykpKTtcclxuXHJcbiAgICAgICAgdmFyIGF4aXNUID0gYXhpcztcclxuICAgICAgICBpZiAoc2VsZi5jb25maWcudHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICBheGlzVCA9IGF4aXMudHJhbnNpdGlvbigpLmVhc2UoXCJzaW4taW4tb3V0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXhpc1QuY2FsbChwbG90LnkuYXhpcyk7XHJcblxyXG4gICAgICAgIGF4aXMuc2VsZWN0T3JBcHBlbmQoXCJ0ZXh0LlwiK3NlbGYucHJlZml4Q2xhc3MoJ2xhYmVsJykpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyAtcGxvdC5tYXJnaW4ubGVmdCArXCIsXCIrKHBsb3QuaGVpZ2h0LzIpK1wiKXJvdGF0ZSgtOTApXCIpICAvLyB0ZXh0IGlzIGRyYXduIG9mZiB0aGUgc2NyZWVuIHRvcCBsZWZ0LCBtb3ZlIGRvd24gYW5kIG91dCBhbmQgcm90YXRlXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCIxZW1cIilcclxuICAgICAgICAgICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoYXhpc0NvbmYubGFiZWwpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgZHJhd0hpc3RvZ3JhbSgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHBsb3QuaGlzdG9ncmFtQmlucywgcGxvdC5oZWlnaHQpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGxheWVyQ2xhc3MgPSB0aGlzLnByZWZpeENsYXNzKFwibGF5ZXJcIik7XHJcblxyXG4gICAgICAgIHZhciBiYXJDbGFzcyA9IHRoaXMucHJlZml4Q2xhc3MoXCJiYXJcIik7XHJcbiAgICAgICAgdmFyIGxheWVyID0gc2VsZi5zdmdHLnNlbGVjdEFsbChcIi5cIitsYXllckNsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShwbG90LnN0YWNrZWRIaXN0b2dyYW1zKTtcclxuXHJcbiAgICAgICAgbGF5ZXIuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgbGF5ZXJDbGFzcyk7XHJcblxyXG4gICAgICAgIHZhciBiYXIgPSBsYXllci5zZWxlY3RBbGwoXCIuXCIrYmFyQ2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKGQgPT4gZC5oaXN0b2dyYW1CaW5zKTtcclxuXHJcbiAgICAgICAgYmFyLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGJhckNsYXNzKVxyXG4gICAgICAgICAgICAuYXBwZW5kKFwicmVjdFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgMSk7XHJcblxyXG5cclxuICAgICAgICB2YXIgYmFyUmVjdCA9IGJhci5zZWxlY3QoXCJyZWN0XCIpO1xyXG5cclxuICAgICAgICB2YXIgYmFyUmVjdFQgPSBiYXJSZWN0O1xyXG4gICAgICAgIHZhciBiYXJUID0gYmFyO1xyXG4gICAgICAgIHZhciBsYXllclQgPSBsYXllcjtcclxuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgICAgIGJhclJlY3RUID0gYmFyUmVjdC50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgICAgIGJhclQgPSBiYXIudHJhbnNpdGlvbigpO1xyXG4gICAgICAgICAgICBsYXllclQ9IGxheWVyLnRyYW5zaXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJhclQuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIHBsb3QueC5zY2FsZShkLngpICsgXCIsXCIgKyAocGxvdC55LnNjYWxlKGQueTAgK2QueSkpICsgXCIpXCI7IH0pO1xyXG5cclxuICAgICAgICBiYXJSZWN0VFxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsICBwbG90Lnguc2NhbGUocGxvdC5oaXN0b2dyYW1CaW5zWzBdLmR4KSAtIHBsb3QueC5zY2FsZSgwKS0gMSlcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZCA9PiAgIHBsb3QuaGVpZ2h0IC0gcGxvdC55LnNjYWxlKGQueSkpO1xyXG5cclxuICAgICAgICBpZih0aGlzLnBsb3QuY29sb3Ipe1xyXG4gICAgICAgICAgICBsYXllclRcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCB0aGlzLnBsb3QuY29sb3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBsb3QudG9vbHRpcCkge1xyXG4gICAgICAgICAgICBiYXIub24oXCJtb3VzZW92ZXJcIiwgZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDIwMClcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIC45KTtcclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC5odG1sKGQueSlcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJsZWZ0XCIsIChkMy5ldmVudC5wYWdlWCArIDUpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG4gICAgICAgICAgICB9KS5vbihcIm1vdXNlb3V0XCIsIGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxheWVyLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgICAgICBiYXIuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShuZXdEYXRhKXtcclxuICAgICAgICBzdXBlci51cGRhdGUobmV3RGF0YSk7XHJcbiAgICAgICAgdGhpcy5kcmF3QXhpc1goKTtcclxuICAgICAgICB0aGlzLmRyYXdBeGlzWSgpO1xyXG5cclxuICAgICAgICB0aGlzLmRyYXdIaXN0b2dyYW0oKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnVwZGF0ZUxlZ2VuZCgpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgdXBkYXRlTGVnZW5kKCkge1xyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG5cclxuICAgICAgICB2YXIgc2NhbGUgPSBwbG90LmNvbG9yQ2F0ZWdvcnk7XHJcbiAgICAgICAgaWYoIXNjYWxlLmRvbWFpbigpIHx8IHNjYWxlLmRvbWFpbigpLmxlbmd0aDwyKXtcclxuICAgICAgICAgICAgcGxvdC5zaG93TGVnZW5kID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZighcGxvdC5zaG93TGVnZW5kKXtcclxuICAgICAgICAgICAgaWYocGxvdC5sZWdlbmQgJiYgcGxvdC5sZWdlbmQuY29udGFpbmVyKXtcclxuICAgICAgICAgICAgICAgIHBsb3QubGVnZW5kLmNvbnRhaW5lci5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdmFyIGxlZ2VuZFggPSB0aGlzLnBsb3Qud2lkdGggKyB0aGlzLmNvbmZpZy5sZWdlbmQubWFyZ2luO1xyXG4gICAgICAgIHZhciBsZWdlbmRZID0gdGhpcy5jb25maWcubGVnZW5kLm1hcmdpbjtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmQgPSBuZXcgTGVnZW5kKHRoaXMuc3ZnLCB0aGlzLnN2Z0csIHNjYWxlLCBsZWdlbmRYLCBsZWdlbmRZKTtcclxuXHJcbiAgICAgICAgdmFyIGxlZ2VuZExpbmVhciA9IHBsb3QubGVnZW5kLmNvbG9yKClcclxuICAgICAgICAgICAgLnNoYXBlV2lkdGgodGhpcy5jb25maWcubGVnZW5kLnNoYXBlV2lkdGgpXHJcbiAgICAgICAgICAgIC5vcmllbnQoJ3ZlcnRpY2FsJylcclxuICAgICAgICAgICAgLnNjYWxlKHNjYWxlKTtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmQuY29udGFpbmVyXHJcbiAgICAgICAgICAgIC5jYWxsKGxlZ2VuZExpbmVhcik7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7RDNFeHRlbnNpb25zfSBmcm9tICcuL2QzLWV4dGVuc2lvbnMnXHJcbkQzRXh0ZW5zaW9ucy5leHRlbmQoKTtcclxuXHJcbmV4cG9ydCB7U2NhdHRlclBsb3QsIFNjYXR0ZXJQbG90Q29uZmlnfSBmcm9tIFwiLi9zY2F0dGVycGxvdFwiO1xyXG5leHBvcnQge1NjYXR0ZXJQbG90TWF0cml4LCBTY2F0dGVyUGxvdE1hdHJpeENvbmZpZ30gZnJvbSBcIi4vc2NhdHRlcnBsb3QtbWF0cml4XCI7XHJcbmV4cG9ydCB7Q29ycmVsYXRpb25NYXRyaXgsIENvcnJlbGF0aW9uTWF0cml4Q29uZmlnfSBmcm9tICcuL2NvcnJlbGF0aW9uLW1hdHJpeCdcclxuZXhwb3J0IHtSZWdyZXNzaW9uLCBSZWdyZXNzaW9uQ29uZmlnfSBmcm9tICcuL3JlZ3Jlc3Npb24nXHJcbmV4cG9ydCB7SGVhdG1hcCwgSGVhdG1hcENvbmZpZ30gZnJvbSAnLi9oZWF0bWFwJ1xyXG5leHBvcnQge0hlYXRtYXBUaW1lU2VyaWVzLCBIZWF0bWFwVGltZVNlcmllc0NvbmZpZ30gZnJvbSAnLi9oZWF0bWFwLXRpbWVzZXJpZXMnXHJcbmV4cG9ydCB7SGlzdG9ncmFtLCBIaXN0b2dyYW1Db25maWd9IGZyb20gJy4vaGlzdG9ncmFtJ1xyXG5leHBvcnQge1N0YXRpc3RpY3NVdGlsc30gZnJvbSAnLi9zdGF0aXN0aWNzLXV0aWxzJ1xyXG5leHBvcnQge0xlZ2VuZH0gZnJvbSAnLi9sZWdlbmQnXHJcblxyXG5cclxuXHJcblxyXG5cclxuIiwiaW1wb3J0IHtVdGlsc30gZnJvbSBcIi4vdXRpbHNcIjtcclxuaW1wb3J0IHtjb2xvciwgc2l6ZSwgc3ltYm9sfSBmcm9tIFwiLi4vYm93ZXJfY29tcG9uZW50cy9kMy1sZWdlbmQvbm8tZXh0ZW5kXCI7XHJcblxyXG4vKnZhciBkMyA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvZDMnKTtcclxuKi9cclxuLy8gdmFyIGxlZ2VuZCA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvZDMtbGVnZW5kL25vLWV4dGVuZCcpO1xyXG4vL1xyXG4vLyBtb2R1bGUuZXhwb3J0cy5sZWdlbmQgPSBsZWdlbmQ7XHJcblxyXG5leHBvcnQgY2xhc3MgTGVnZW5kIHtcclxuXHJcbiAgICBjc3NDbGFzc1ByZWZpeD1cIm9kYy1cIjtcclxuICAgIGxlZ2VuZENsYXNzPXRoaXMuY3NzQ2xhc3NQcmVmaXgrXCJsZWdlbmRcIjtcclxuICAgIGNvbnRhaW5lcjtcclxuICAgIHNjYWxlO1xyXG4gICAgY29sb3I9IGNvbG9yO1xyXG4gICAgc2l6ZSA9IHNpemU7XHJcbiAgICBzeW1ib2w9IHN5bWJvbDtcclxuICAgIGd1aWQ7XHJcblxyXG4gICAgbGFiZWxGb3JtYXQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc3ZnLCBsZWdlbmRQYXJlbnQsIHNjYWxlLCBsZWdlbmRYLCBsZWdlbmRZLCBsYWJlbEZvcm1hdCl7XHJcbiAgICAgICAgdGhpcy5zY2FsZT1zY2FsZTtcclxuICAgICAgICB0aGlzLnN2ZyA9IHN2ZztcclxuICAgICAgICB0aGlzLmd1aWQgPSBVdGlscy5ndWlkKCk7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSAgVXRpbHMuc2VsZWN0T3JBcHBlbmQobGVnZW5kUGFyZW50LCBcImcuXCIrdGhpcy5sZWdlbmRDbGFzcywgXCJnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiK2xlZ2VuZFgrXCIsXCIrbGVnZW5kWStcIilcIilcclxuICAgICAgICAgICAgLmNsYXNzZWQodGhpcy5sZWdlbmRDbGFzcywgdHJ1ZSk7XHJcblxyXG4gICAgICAgIHRoaXMubGFiZWxGb3JtYXQgPSBsYWJlbEZvcm1hdDtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGxpbmVhckdyYWRpZW50QmFyKGJhcldpZHRoLCBiYXJIZWlnaHQsIHRpdGxlKXtcclxuICAgICAgICB2YXIgZ3JhZGllbnRJZCA9IHRoaXMuY3NzQ2xhc3NQcmVmaXgrXCJsaW5lYXItZ3JhZGllbnRcIitcIi1cIit0aGlzLmd1aWQ7XHJcbiAgICAgICAgdmFyIHNjYWxlPSB0aGlzLnNjYWxlO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5saW5lYXJHcmFkaWVudCA9IFV0aWxzLmxpbmVhckdyYWRpZW50KHRoaXMuc3ZnLCBncmFkaWVudElkLCB0aGlzLnNjYWxlLnJhbmdlKCksIDAsIDEwMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZChcInJlY3RcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBiYXJXaWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgYmFySGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIDApXHJcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCJ1cmwoI1wiK2dyYWRpZW50SWQrXCIpXCIpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIHRpY2tzID0gdGhpcy5jb250YWluZXIuc2VsZWN0QWxsKFwidGV4dFwiKVxyXG4gICAgICAgICAgICAuZGF0YSggc2NhbGUuZG9tYWluKCkgKTtcclxuICAgICAgICB2YXIgdGlja3NOdW1iZXIgPXNjYWxlLmRvbWFpbigpLmxlbmd0aC0xO1xyXG4gICAgICAgIHRpY2tzLmVudGVyKCkuYXBwZW5kKFwidGV4dFwiKTtcclxuXHJcbiAgICAgICAgdGlja3MuYXR0cihcInhcIiwgYmFyV2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAgKGQsIGkpID0+ICBiYXJIZWlnaHQgLShpKmJhckhlaWdodC90aWNrc051bWJlcikpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHhcIiwgMylcclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJkeVwiLCAxKVxyXG4gICAgICAgICAgICAuYXR0cihcImFsaWdubWVudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAudGV4dChkPT4gc2VsZi5sYWJlbEZvcm1hdCA/IHNlbGYubGFiZWxGb3JtYXQoZCkgOiBkKTtcclxuICAgICAgICB0aWNrcy5hdHRyKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICBpZih0aGlzLnJvdGF0ZUxhYmVscyl7XHJcbiAgICAgICAgICAgIHRpY2tzXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCAoZCwgaSkgPT4gXCJyb3RhdGUoLTQ1LCBcIiArIGJhcldpZHRoICsgXCIsIFwiICsgKGJhckhlaWdodCAtKGkqYmFySGVpZ2h0L3RpY2tzTnVtYmVyKSkgKyBcIilcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJzdGFydFwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJkeFwiLCA1KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCA1KTtcclxuXHJcbiAgICAgICAgfWVsc2V7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGlja3MuZXhpdCgpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZXRSb3RhdGVMYWJlbHMocm90YXRlTGFiZWxzKSB7XHJcbiAgICAgICAgdGhpcy5yb3RhdGVMYWJlbHMgPSByb3RhdGVMYWJlbHM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge0NoYXJ0LCBDaGFydENvbmZpZ30gZnJvbSBcIi4vY2hhcnRcIjtcclxuaW1wb3J0IHtTY2F0dGVyUGxvdCwgU2NhdHRlclBsb3RDb25maWd9IGZyb20gXCIuL3NjYXR0ZXJwbG90XCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7U3RhdGlzdGljc1V0aWxzfSBmcm9tICcuL3N0YXRpc3RpY3MtdXRpbHMnXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFJlZ3Jlc3Npb25Db25maWcgZXh0ZW5kcyBTY2F0dGVyUGxvdENvbmZpZ3tcclxuXHJcbiAgICBtYWluUmVncmVzc2lvbiA9IHRydWU7XHJcbiAgICBncm91cFJlZ3Jlc3Npb24gPSB0cnVlO1xyXG4gICAgY29uZmlkZW5jZT17XHJcbiAgICAgICAgbGV2ZWw6IDAuOTUsXHJcbiAgICAgICAgY3JpdGljYWxWYWx1ZTogKGRlZ3JlZXNPZkZyZWVkb20sIGNyaXRpY2FsUHJvYmFiaWxpdHkpID0+IFN0YXRpc3RpY3NVdGlscy50VmFsdWUoZGVncmVlc09mRnJlZWRvbSwgY3JpdGljYWxQcm9iYWJpbGl0eSksXHJcbiAgICAgICAgbWFyZ2luT2ZFcnJvcjogdW5kZWZpbmVkIC8vY3VzdG9tICBtYXJnaW4gT2YgRXJyb3IgZnVuY3Rpb24gKHgsIHBvaW50cylcclxuICAgIH07XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKXtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICBpZihjdXN0b20pe1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFJlZ3Jlc3Npb24gZXh0ZW5kcyBTY2F0dGVyUGxvdHtcclxuICAgIGNvbnN0cnVjdG9yKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKHBsYWNlaG9sZGVyU2VsZWN0b3IsIGRhdGEsIG5ldyBSZWdyZXNzaW9uQ29uZmlnKGNvbmZpZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbmZpZyhjb25maWcpe1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IFJlZ3Jlc3Npb25Db25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKXtcclxuICAgICAgICBzdXBlci5pbml0UGxvdCgpO1xyXG4gICAgICAgIHRoaXMuaW5pdFJlZ3Jlc3Npb25MaW5lcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRSZWdyZXNzaW9uTGluZXMoKXtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBncm91cHNBdmFpbGFibGUgPSBzZWxmLmNvbmZpZy5ncm91cHMgJiYgc2VsZi5jb25maWcuZ3JvdXBzLnZhbHVlO1xyXG5cclxuICAgICAgICBzZWxmLnBsb3QucmVncmVzc2lvbnM9IFtdO1xyXG5cclxuXHJcbiAgICAgICAgaWYoZ3JvdXBzQXZhaWxhYmxlICYmIHNlbGYuY29uZmlnLm1haW5SZWdyZXNzaW9uKXtcclxuICAgICAgICAgICAgdmFyIHJlZ3Jlc3Npb24gPSB0aGlzLmluaXRSZWdyZXNzaW9uKHRoaXMuZGF0YSwgZmFsc2UpO1xyXG4gICAgICAgICAgICBzZWxmLnBsb3QucmVncmVzc2lvbnMucHVzaChyZWdyZXNzaW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHNlbGYuY29uZmlnLmdyb3VwUmVncmVzc2lvbil7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdEdyb3VwUmVncmVzc2lvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdEdyb3VwUmVncmVzc2lvbigpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGRhdGFCeUdyb3VwID0ge307XHJcbiAgICAgICAgc2VsZi5kYXRhLmZvckVhY2ggKGQ9PntcclxuICAgICAgICAgICAgdmFyIGdyb3VwVmFsID0gc2VsZi5jb25maWcuZ3JvdXBzLnZhbHVlKGQsIHNlbGYuY29uZmlnLmdyb3Vwcy5rZXkpO1xyXG5cclxuICAgICAgICAgICAgaWYoIWdyb3VwVmFsICYmIGdyb3VwVmFsIT09MCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKCFkYXRhQnlHcm91cFtncm91cFZhbF0pe1xyXG4gICAgICAgICAgICAgICAgZGF0YUJ5R3JvdXBbZ3JvdXBWYWxdID0gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGF0YUJ5R3JvdXBbZ3JvdXBWYWxdLnB1c2goZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZvcih2YXIga2V5IGluIGRhdGFCeUdyb3VwKXtcclxuICAgICAgICAgICAgaWYgKCFkYXRhQnlHcm91cC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHJlZ3Jlc3Npb24gPSB0aGlzLmluaXRSZWdyZXNzaW9uKGRhdGFCeUdyb3VwW2tleV0sIGtleSk7XHJcbiAgICAgICAgICAgIHNlbGYucGxvdC5yZWdyZXNzaW9ucy5wdXNoKHJlZ3Jlc3Npb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0UmVncmVzc2lvbih2YWx1ZXMsIGdyb3VwVmFsKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciBwb2ludHMgPSB2YWx1ZXMubWFwKGQ9PntcclxuICAgICAgICAgICAgcmV0dXJuIFtwYXJzZUZsb2F0KHNlbGYucGxvdC54LnZhbHVlKGQpKSwgcGFyc2VGbG9hdChzZWxmLnBsb3QueS52YWx1ZShkKSldO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBwb2ludHMuc29ydCgoYSxiKSA9PiBhWzBdLWJbMF0pO1xyXG5cclxuICAgICAgICB2YXIgbGluZWFyUmVncmVzc2lvbiA9ICBTdGF0aXN0aWNzVXRpbHMubGluZWFyUmVncmVzc2lvbihwb2ludHMpO1xyXG4gICAgICAgIHZhciBsaW5lYXJSZWdyZXNzaW9uTGluZSA9IFN0YXRpc3RpY3NVdGlscy5saW5lYXJSZWdyZXNzaW9uTGluZShsaW5lYXJSZWdyZXNzaW9uKTtcclxuXHJcblxyXG4gICAgICAgIHZhciBleHRlbnRYID0gZDMuZXh0ZW50KHBvaW50cywgZD0+ZFswXSk7XHJcblxyXG5cclxuICAgICAgICB2YXIgbGluZVBvaW50cyA9IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeDogZXh0ZW50WFswXSxcclxuICAgICAgICAgICAgICAgIHk6IGxpbmVhclJlZ3Jlc3Npb25MaW5lKGV4dGVudFhbMF0pXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHg6IGV4dGVudFhbMV0sXHJcbiAgICAgICAgICAgICAgICB5OiBsaW5lYXJSZWdyZXNzaW9uTGluZShleHRlbnRYWzFdKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgdmFyIGxpbmUgPSBkMy5zdmcubGluZSgpXHJcbiAgICAgICAgICAgIC5pbnRlcnBvbGF0ZShcImJhc2lzXCIpXHJcbiAgICAgICAgICAgIC54KGQgPT4gc2VsZi5wbG90Lnguc2NhbGUoZC54KSlcclxuICAgICAgICAgICAgLnkoZCA9PiBzZWxmLnBsb3QueS5zY2FsZShkLnkpKTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgdmFyIGNvbG9yID0gc2VsZi5wbG90LmRvdC5jb2xvcjtcclxuXHJcbiAgICAgICAgdmFyIGRlZmF1bHRDb2xvciA9IFwiYmxhY2tcIjtcclxuICAgICAgICBpZihVdGlscy5pc0Z1bmN0aW9uKGNvbG9yKSl7XHJcbiAgICAgICAgICAgIGlmKHZhbHVlcy5sZW5ndGggJiYgZ3JvdXBWYWwhPT1mYWxzZSl7XHJcbiAgICAgICAgICAgICAgICBjb2xvciA9IGNvbG9yKHZhbHVlc1swXSk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgY29sb3IgPSBkZWZhdWx0Q29sb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZSBpZighY29sb3IgJiYgZ3JvdXBWYWw9PT1mYWxzZSl7XHJcbiAgICAgICAgICAgIGNvbG9yID0gZGVmYXVsdENvbG9yO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHZhciBjb25maWRlbmNlID0gdGhpcy5jb21wdXRlQ29uZmlkZW5jZShwb2ludHMsIGV4dGVudFgsICBsaW5lYXJSZWdyZXNzaW9uLGxpbmVhclJlZ3Jlc3Npb25MaW5lKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBncm91cDogZ3JvdXBWYWwgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgIGxpbmU6IGxpbmUsXHJcbiAgICAgICAgICAgIGxpbmVQb2ludHM6IGxpbmVQb2ludHMsXHJcbiAgICAgICAgICAgIGNvbG9yOiBjb2xvcixcclxuICAgICAgICAgICAgY29uZmlkZW5jZTogY29uZmlkZW5jZVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgY29tcHV0ZUNvbmZpZGVuY2UocG9pbnRzLCBleHRlbnRYLCBsaW5lYXJSZWdyZXNzaW9uLGxpbmVhclJlZ3Jlc3Npb25MaW5lKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHNsb3BlID0gbGluZWFyUmVncmVzc2lvbi5tO1xyXG4gICAgICAgIHZhciBuID0gcG9pbnRzLmxlbmd0aDtcclxuICAgICAgICB2YXIgZGVncmVlc09mRnJlZWRvbSA9IE1hdGgubWF4KDAsIG4tMik7XHJcblxyXG4gICAgICAgIHZhciBhbHBoYSA9IDEgLSBzZWxmLmNvbmZpZy5jb25maWRlbmNlLmxldmVsO1xyXG4gICAgICAgIHZhciBjcml0aWNhbFByb2JhYmlsaXR5ICA9IDEgLSBhbHBoYS8yO1xyXG4gICAgICAgIHZhciBjcml0aWNhbFZhbHVlID0gc2VsZi5jb25maWcuY29uZmlkZW5jZS5jcml0aWNhbFZhbHVlKGRlZ3JlZXNPZkZyZWVkb20sY3JpdGljYWxQcm9iYWJpbGl0eSk7XHJcblxyXG4gICAgICAgIHZhciB4VmFsdWVzID0gcG9pbnRzLm1hcChkPT5kWzBdKTtcclxuICAgICAgICB2YXIgbWVhblggPSBTdGF0aXN0aWNzVXRpbHMubWVhbih4VmFsdWVzKTtcclxuICAgICAgICB2YXIgeE15U3VtPTA7XHJcbiAgICAgICAgdmFyIHhTdW09MDtcclxuICAgICAgICB2YXIgeFBvd1N1bT0wO1xyXG4gICAgICAgIHZhciB5U3VtPTA7XHJcbiAgICAgICAgdmFyIHlQb3dTdW09MDtcclxuICAgICAgICBwb2ludHMuZm9yRWFjaChwPT57XHJcbiAgICAgICAgICAgIHZhciB4ID0gcFswXTtcclxuICAgICAgICAgICAgdmFyIHkgPSBwWzFdO1xyXG5cclxuICAgICAgICAgICAgeE15U3VtICs9IHgqeTtcclxuICAgICAgICAgICAgeFN1bSs9eDtcclxuICAgICAgICAgICAgeVN1bSs9eTtcclxuICAgICAgICAgICAgeFBvd1N1bSs9IHgqeDtcclxuICAgICAgICAgICAgeVBvd1N1bSs9IHkqeTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgYSA9IGxpbmVhclJlZ3Jlc3Npb24ubTtcclxuICAgICAgICB2YXIgYiA9IGxpbmVhclJlZ3Jlc3Npb24uYjtcclxuXHJcbiAgICAgICAgdmFyIFNhMiA9IG4vKG4rMikgKiAoKHlQb3dTdW0tYSp4TXlTdW0tYip5U3VtKS8obip4UG93U3VtLSh4U3VtKnhTdW0pKSk7IC8vV2FyaWFuY2phIHdzcMOzxYJjenlubmlrYSBraWVydW5rb3dlZ28gcmVncmVzamkgbGluaW93ZWogYVxyXG4gICAgICAgIHZhciBTeTIgPSAoeVBvd1N1bSAtIGEqeE15U3VtLWIqeVN1bSkvKG4qKG4tMikpOyAvL1NhMiAvL01lYW4geSB2YWx1ZSB2YXJpYW5jZVxyXG5cclxuICAgICAgICB2YXIgZXJyb3JGbiA9IHg9PiBNYXRoLnNxcnQoU3kyICsgTWF0aC5wb3coeC1tZWFuWCwyKSpTYTIpOyAvL3BpZXJ3aWFzdGVrIGt3YWRyYXRvd3kgeiB3YXJpYW5jamkgZG93b2xuZWdvIHB1bmt0dSBwcm9zdGVqXHJcbiAgICAgICAgdmFyIG1hcmdpbk9mRXJyb3IgPSAgeD0+IGNyaXRpY2FsVmFsdWUqIGVycm9yRm4oeCk7XHJcblxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbicsIG4sICdkZWdyZWVzT2ZGcmVlZG9tJywgZGVncmVlc09mRnJlZWRvbSwgJ2NyaXRpY2FsUHJvYmFiaWxpdHknLGNyaXRpY2FsUHJvYmFiaWxpdHkpO1xyXG4gICAgICAgIC8vIHZhciBjb25maWRlbmNlRG93biA9IHggPT4gbGluZWFyUmVncmVzc2lvbkxpbmUoeCkgLSAgbWFyZ2luT2ZFcnJvcih4KTtcclxuICAgICAgICAvLyB2YXIgY29uZmlkZW5jZVVwID0geCA9PiBsaW5lYXJSZWdyZXNzaW9uTGluZSh4KSArICBtYXJnaW5PZkVycm9yKHgpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGNvbXB1dGVDb25maWRlbmNlQXJlYVBvaW50ID0geD0+e1xyXG4gICAgICAgICAgICB2YXIgbGluZWFyUmVncmVzc2lvbiA9IGxpbmVhclJlZ3Jlc3Npb25MaW5lKHgpO1xyXG4gICAgICAgICAgICB2YXIgbW9lID0gbWFyZ2luT2ZFcnJvcih4KTtcclxuICAgICAgICAgICAgdmFyIGNvbmZEb3duID0gbGluZWFyUmVncmVzc2lvbiAtIG1vZTtcclxuICAgICAgICAgICAgdmFyIGNvbmZVcCA9IGxpbmVhclJlZ3Jlc3Npb24gKyBtb2U7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB4OiB4LFxyXG4gICAgICAgICAgICAgICAgeTA6IGNvbmZEb3duLFxyXG4gICAgICAgICAgICAgICAgeTE6IGNvbmZVcFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBjZW50ZXJYID0gKGV4dGVudFhbMV0rZXh0ZW50WFswXSkvMjtcclxuXHJcbiAgICAgICAgLy8gdmFyIGNvbmZpZGVuY2VBcmVhUG9pbnRzID0gW2V4dGVudFhbMF0sIGNlbnRlclgsICBleHRlbnRYWzFdXS5tYXAoY29tcHV0ZUNvbmZpZGVuY2VBcmVhUG9pbnQpO1xyXG4gICAgICAgIHZhciBjb25maWRlbmNlQXJlYVBvaW50cyA9IFtleHRlbnRYWzBdLCBjZW50ZXJYLCAgZXh0ZW50WFsxXV0ubWFwKGNvbXB1dGVDb25maWRlbmNlQXJlYVBvaW50KTtcclxuXHJcbiAgICAgICAgdmFyIGZpdEluUGxvdCA9IHkgPT4geTtcclxuXHJcbiAgICAgICAgdmFyIGNvbmZpZGVuY2VBcmVhID0gIGQzLnN2Zy5hcmVhKClcclxuICAgICAgICAuaW50ZXJwb2xhdGUoXCJtb25vdG9uZVwiKVxyXG4gICAgICAgICAgICAueChkID0+IHNlbGYucGxvdC54LnNjYWxlKGQueCkpXHJcbiAgICAgICAgICAgIC55MChkID0+IGZpdEluUGxvdChzZWxmLnBsb3QueS5zY2FsZShkLnkwKSkpXHJcbiAgICAgICAgICAgIC55MShkID0+IGZpdEluUGxvdChzZWxmLnBsb3QueS5zY2FsZShkLnkxKSkpO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBhcmVhOmNvbmZpZGVuY2VBcmVhLFxyXG4gICAgICAgICAgICBwb2ludHM6Y29uZmlkZW5jZUFyZWFQb2ludHNcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShuZXdEYXRhKXtcclxuICAgICAgICBzdXBlci51cGRhdGUobmV3RGF0YSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSZWdyZXNzaW9uTGluZXMoKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHVwZGF0ZVJlZ3Jlc3Npb25MaW5lcygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb25Db250YWluZXJDbGFzcyA9IHRoaXMucHJlZml4Q2xhc3MoXCJyZWdyZXNzaW9uLWNvbnRhaW5lclwiKTtcclxuICAgICAgICB2YXIgcmVncmVzc2lvbkNvbnRhaW5lclNlbGVjdG9yID0gXCJnLlwiK3JlZ3Jlc3Npb25Db250YWluZXJDbGFzcztcclxuXHJcbiAgICAgICAgdmFyIGNsaXBQYXRoSWQgPSBzZWxmLnByZWZpeENsYXNzKFwiY2xpcFwiKTtcclxuXHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb25Db250YWluZXIgPSBzZWxmLnN2Z0cuc2VsZWN0T3JJbnNlcnQocmVncmVzc2lvbkNvbnRhaW5lclNlbGVjdG9yLCBcIi5cIitzZWxmLmRvdHNDb250YWluZXJDbGFzcyk7XHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb25Db250YWluZXJDbGlwID0gcmVncmVzc2lvbkNvbnRhaW5lci5zZWxlY3RPckFwcGVuZChcImNsaXBQYXRoXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgY2xpcFBhdGhJZCk7XHJcblxyXG5cclxuICAgICAgICByZWdyZXNzaW9uQ29udGFpbmVyQ2xpcC5zZWxlY3RPckFwcGVuZCgncmVjdCcpXHJcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHNlbGYucGxvdC53aWR0aClcclxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHNlbGYucGxvdC5oZWlnaHQpXHJcbiAgICAgICAgICAgIC5hdHRyKCd4JywgMClcclxuICAgICAgICAgICAgLmF0dHIoJ3knLCAwKTtcclxuXHJcbiAgICAgICAgcmVncmVzc2lvbkNvbnRhaW5lci5hdHRyKFwiY2xpcC1wYXRoXCIsIChkLGkpID0+IFwidXJsKCNcIitjbGlwUGF0aElkK1wiKVwiKTtcclxuXHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb25DbGFzcyA9IHRoaXMucHJlZml4Q2xhc3MoXCJyZWdyZXNzaW9uXCIpO1xyXG4gICAgICAgIHZhciBjb25maWRlbmNlQXJlYUNsYXNzID0gc2VsZi5wcmVmaXhDbGFzcyhcImNvbmZpZGVuY2VcIik7XHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb25TZWxlY3RvciA9IFwiZy5cIityZWdyZXNzaW9uQ2xhc3M7XHJcbiAgICAgICAgdmFyIHJlZ3Jlc3Npb24gPSByZWdyZXNzaW9uQ29udGFpbmVyLnNlbGVjdEFsbChyZWdyZXNzaW9uU2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5kYXRhKHNlbGYucGxvdC5yZWdyZXNzaW9ucyk7XHJcblxyXG4gICAgICAgIHZhciByZWdyZXNzaW9uRW50ZXJHID0gcmVncmVzc2lvbi5lbnRlcigpLmluc2VydFNlbGVjdG9yKHJlZ3Jlc3Npb25TZWxlY3Rvcik7XHJcbiAgICAgICAgdmFyIGxpbmVDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoXCJsaW5lXCIpO1xyXG4gICAgICAgIHJlZ3Jlc3Npb25FbnRlckdcclxuXHJcbiAgICAgICAgICAgIC5hcHBlbmQoXCJwYXRoXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgbGluZUNsYXNzKVxyXG4gICAgICAgICAgICAuYXR0cihcInNoYXBlLXJlbmRlcmluZ1wiLCBcIm9wdGltaXplUXVhbGl0eVwiKTtcclxuICAgICAgICAgICAgLy8gLmFwcGVuZChcImxpbmVcIilcclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJjbGFzc1wiLCBcImxpbmVcIilcclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJzaGFwZS1yZW5kZXJpbmdcIiwgXCJvcHRpbWl6ZVF1YWxpdHlcIik7XHJcblxyXG4gICAgICAgIHZhciBsaW5lID0gcmVncmVzc2lvbi5zZWxlY3QoXCJwYXRoLlwiK2xpbmVDbGFzcylcclxuICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIHIgPT4gci5jb2xvcik7XHJcbiAgICAgICAgLy8gLmF0dHIoXCJ4MVwiLCByPT4gc2VsZi5wbG90Lnguc2NhbGUoci5saW5lUG9pbnRzWzBdLngpKVxyXG4gICAgICAgICAgICAvLyAuYXR0cihcInkxXCIsIHI9PiBzZWxmLnBsb3QueS5zY2FsZShyLmxpbmVQb2ludHNbMF0ueSkpXHJcbiAgICAgICAgICAgIC8vIC5hdHRyKFwieDJcIiwgcj0+IHNlbGYucGxvdC54LnNjYWxlKHIubGluZVBvaW50c1sxXS54KSlcclxuICAgICAgICAgICAgLy8gLmF0dHIoXCJ5MlwiLCByPT4gc2VsZi5wbG90Lnkuc2NhbGUoci5saW5lUG9pbnRzWzFdLnkpKVxyXG5cclxuXHJcbiAgICAgICAgdmFyIGxpbmVUID0gbGluZTtcclxuICAgICAgICBpZiAoc2VsZi50cmFuc2l0aW9uRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgICAgIGxpbmVUID0gbGluZS50cmFuc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsaW5lVC5hdHRyKFwiZFwiLCByID0+IHIubGluZShyLmxpbmVQb2ludHMpKVxyXG5cclxuXHJcbiAgICAgICAgcmVncmVzc2lvbkVudGVyR1xyXG4gICAgICAgICAgICAuYXBwZW5kKFwicGF0aFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGNvbmZpZGVuY2VBcmVhQ2xhc3MpXHJcbiAgICAgICAgICAgIC5hdHRyKFwic2hhcGUtcmVuZGVyaW5nXCIsIFwib3B0aW1pemVRdWFsaXR5XCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgciA9PiByLmNvbG9yKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIFwiMC40XCIpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHZhciBhcmVhID0gcmVncmVzc2lvbi5zZWxlY3QoXCJwYXRoLlwiK2NvbmZpZGVuY2VBcmVhQ2xhc3MpO1xyXG5cclxuICAgICAgICB2YXIgYXJlYVQgPSBhcmVhO1xyXG4gICAgICAgIGlmIChzZWxmLnRyYW5zaXRpb25FbmFibGVkKCkpIHtcclxuICAgICAgICAgICAgYXJlYVQgPSBhcmVhLnRyYW5zaXRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYXJlYVQuYXR0cihcImRcIiwgciA9PiByLmNvbmZpZGVuY2UuYXJlYShyLmNvbmZpZGVuY2UucG9pbnRzKSk7XHJcblxyXG4gICAgICAgIHJlZ3Jlc3Npb24uZXhpdCgpLnJlbW92ZSgpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxufVxyXG5cclxuIiwiaW1wb3J0IHtDaGFydCwgQ2hhcnRDb25maWd9IGZyb20gXCIuL2NoYXJ0XCI7XHJcbmltcG9ydCB7U2NhdHRlclBsb3RDb25maWd9IGZyb20gXCIuL3NjYXR0ZXJwbG90XCI7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7TGVnZW5kfSBmcm9tIFwiLi9sZWdlbmRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTY2F0dGVyUGxvdE1hdHJpeENvbmZpZyBleHRlbmRzIFNjYXR0ZXJQbG90Q29uZmlne1xyXG5cclxuICAgIHN2Z0NsYXNzPSB0aGlzLmNzc0NsYXNzUHJlZml4KydzY2F0dGVycGxvdC1tYXRyaXgnO1xyXG4gICAgc2l6ZT0gMjAwOyAvL3NjYXR0ZXIgcGxvdCBjZWxsIHNpemVcclxuICAgIHBhZGRpbmc9IDIwOyAvL3NjYXR0ZXIgcGxvdCBjZWxsIHBhZGRpbmdcclxuICAgIGJydXNoPSB0cnVlO1xyXG4gICAgZ3VpZGVzPSB0cnVlOyAvL3Nob3cgYXhpcyBndWlkZXNcclxuICAgIHNob3dUb29sdGlwPSB0cnVlOyAvL3Nob3cgdG9vbHRpcCBvbiBkb3QgaG92ZXJcclxuICAgIHRpY2tzPSB1bmRlZmluZWQ7IC8vdGlja3MgbnVtYmVyLCAoZGVmYXVsdDogY29tcHV0ZWQgdXNpbmcgY2VsbCBzaXplKVxyXG4gICAgeD17Ly8gWCBheGlzIGNvbmZpZ1xyXG4gICAgICAgIG9yaWVudDogXCJib3R0b21cIixcclxuICAgICAgICBzY2FsZTogXCJsaW5lYXJcIlxyXG4gICAgfTtcclxuICAgIHk9ey8vIFkgYXhpcyBjb25maWdcclxuICAgICAgICBvcmllbnQ6IFwibGVmdFwiLFxyXG4gICAgICAgIHNjYWxlOiBcImxpbmVhclwiXHJcbiAgICB9O1xyXG4gICAgZ3JvdXBzPXtcclxuICAgICAgICBrZXk6IHVuZGVmaW5lZCwgLy9vYmplY3QgcHJvcGVydHkgbmFtZSBvciBhcnJheSBpbmRleCB3aXRoIGdyb3VwaW5nIHZhcmlhYmxlXHJcbiAgICAgICAgaW5jbHVkZUluUGxvdDogZmFsc2UsIC8vaW5jbHVkZSBncm91cCBhcyB2YXJpYWJsZSBpbiBwbG90LCBib29sZWFuIChkZWZhdWx0OiBmYWxzZSlcclxuICAgICAgICB2YWx1ZTogKGQsIGtleSkgPT4gZFtrZXldLCAvLyBncm91cGluZyB2YWx1ZSBhY2Nlc3NvcixcclxuICAgICAgICBsYWJlbDogXCJcIlxyXG4gICAgfTtcclxuICAgIHZhcmlhYmxlcz0ge1xyXG4gICAgICAgIGxhYmVsczogW10sIC8vb3B0aW9uYWwgYXJyYXkgb2YgdmFyaWFibGUgbGFiZWxzIChmb3IgdGhlIGRpYWdvbmFsIG9mIHRoZSBwbG90KS5cclxuICAgICAgICBrZXlzOiBbXSwgLy9vcHRpb25hbCBhcnJheSBvZiB2YXJpYWJsZSBrZXlzXHJcbiAgICAgICAgdmFsdWU6IChkLCB2YXJpYWJsZUtleSkgPT4gZFt2YXJpYWJsZUtleV0gLy8gdmFyaWFibGUgdmFsdWUgYWNjZXNzb3JcclxuICAgIH07XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VzdG9tKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIFV0aWxzLmRlZXBFeHRlbmQodGhpcywgY3VzdG9tKTtcclxuICAgIH1cclxuXHJcblxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2NhdHRlclBsb3RNYXRyaXggZXh0ZW5kcyBDaGFydCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBzdXBlcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBuZXcgU2NhdHRlclBsb3RNYXRyaXhDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZykge1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXRDb25maWcobmV3IFNjYXR0ZXJQbG90TWF0cml4Q29uZmlnKGNvbmZpZykpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBpbml0UGxvdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0UGxvdCgpO1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG1hcmdpbiA9IHRoaXMucGxvdC5tYXJnaW47XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICB0aGlzLnBsb3QueD17fTtcclxuICAgICAgICB0aGlzLnBsb3QueT17fTtcclxuICAgICAgICB0aGlzLnBsb3QuZG90PXtcclxuICAgICAgICAgICAgY29sb3I6IG51bGwvL2NvbG9yIHNjYWxlIG1hcHBpbmcgZnVuY3Rpb25cclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5wbG90LnNob3dMZWdlbmQgPSBjb25mLnNob3dMZWdlbmQ7XHJcbiAgICAgICAgaWYodGhpcy5wbG90LnNob3dMZWdlbmQpe1xyXG4gICAgICAgICAgICBtYXJnaW4ucmlnaHQgPSBjb25mLm1hcmdpbi5yaWdodCArIGNvbmYubGVnZW5kLndpZHRoK2NvbmYubGVnZW5kLm1hcmdpbioyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cFZhcmlhYmxlcygpO1xyXG5cclxuICAgICAgICB0aGlzLnBsb3Quc2l6ZSA9IGNvbmYuc2l6ZTtcclxuXHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IGNvbmYud2lkdGg7XHJcbiAgICAgICAgdmFyIGJvdW5kaW5nQ2xpZW50UmVjdCA9IHRoaXMuZ2V0QmFzZUNvbnRhaW5lck5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBpZiAoIXdpZHRoKSB7XHJcbiAgICAgICAgICAgIHZhciBtYXhXaWR0aCA9IG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0ICsgdGhpcy5wbG90LnZhcmlhYmxlcy5sZW5ndGgqdGhpcy5wbG90LnNpemU7XHJcbiAgICAgICAgICAgIHdpZHRoID0gTWF0aC5taW4oYm91bmRpbmdDbGllbnRSZWN0LndpZHRoLCBtYXhXaWR0aCk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaGVpZ2h0ID0gd2lkdGg7XHJcbiAgICAgICAgaWYgKCFoZWlnaHQpIHtcclxuICAgICAgICAgICAgaGVpZ2h0ID0gYm91bmRpbmdDbGllbnRSZWN0LmhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC53aWR0aCA9IHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XHJcbiAgICAgICAgdGhpcy5wbG90LmhlaWdodCA9IGhlaWdodCAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tO1xyXG5cclxuXHJcblxyXG5cclxuICAgICAgICBpZihjb25mLnRpY2tzPT09dW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgY29uZi50aWNrcyA9IHRoaXMucGxvdC5zaXplIC8gNDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldHVwWCgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBZKCk7XHJcblxyXG4gICAgICAgIGlmIChjb25mLmRvdC5kM0NvbG9yQ2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgdGhpcy5wbG90LmRvdC5jb2xvckNhdGVnb3J5ID0gZDMuc2NhbGVbY29uZi5kb3QuZDNDb2xvckNhdGVnb3J5XSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY29sb3JWYWx1ZSA9IGNvbmYuZG90LmNvbG9yO1xyXG4gICAgICAgIGlmIChjb2xvclZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5kb3QuY29sb3JWYWx1ZSA9IGNvbG9yVmFsdWU7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbG9yVmFsdWUgPT09ICdzdHJpbmcnIHx8IGNvbG9yVmFsdWUgaW5zdGFuY2VvZiBTdHJpbmcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxvdC5kb3QuY29sb3IgPSBjb2xvclZhbHVlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucGxvdC5kb3QuY29sb3JDYXRlZ29yeSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmRvdC5jb2xvciA9IGQgPT4gc2VsZi5wbG90LmRvdC5jb2xvckNhdGVnb3J5KHNlbGYucGxvdC5kb3QuY29sb3JWYWx1ZShkKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwVmFyaWFibGVzKCkge1xyXG4gICAgICAgIHZhciB2YXJpYWJsZXNDb25mID0gdGhpcy5jb25maWcudmFyaWFibGVzO1xyXG5cclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuICAgICAgICBwbG90LmRvbWFpbkJ5VmFyaWFibGUgPSB7fTtcclxuICAgICAgICBwbG90LnZhcmlhYmxlcyA9IHZhcmlhYmxlc0NvbmYua2V5cztcclxuICAgICAgICBpZighcGxvdC52YXJpYWJsZXMgfHwgIXBsb3QudmFyaWFibGVzLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIHBsb3QudmFyaWFibGVzID0gVXRpbHMuaW5mZXJWYXJpYWJsZXMoZGF0YSwgdGhpcy5jb25maWcuZ3JvdXBzLmtleSwgdGhpcy5jb25maWcuaW5jbHVkZUluUGxvdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwbG90LmxhYmVscyA9IFtdO1xyXG4gICAgICAgIHBsb3QubGFiZWxCeVZhcmlhYmxlID0ge307XHJcbiAgICAgICAgcGxvdC52YXJpYWJsZXMuZm9yRWFjaCgodmFyaWFibGVLZXksIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHBsb3QuZG9tYWluQnlWYXJpYWJsZVt2YXJpYWJsZUtleV0gPSBkMy5leHRlbnQoZGF0YSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gdmFyaWFibGVzQ29uZi52YWx1ZShkLCB2YXJpYWJsZUtleSkgfSk7XHJcbiAgICAgICAgICAgIHZhciBsYWJlbCA9IHZhcmlhYmxlS2V5O1xyXG4gICAgICAgICAgICBpZih2YXJpYWJsZXNDb25mLmxhYmVscyAmJiB2YXJpYWJsZXNDb25mLmxhYmVscy5sZW5ndGg+aW5kZXgpe1xyXG5cclxuICAgICAgICAgICAgICAgIGxhYmVsID0gdmFyaWFibGVzQ29uZi5sYWJlbHNbaW5kZXhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBsb3QubGFiZWxzLnB1c2gobGFiZWwpO1xyXG4gICAgICAgICAgICBwbG90LmxhYmVsQnlWYXJpYWJsZVt2YXJpYWJsZUtleV0gPSBsYWJlbDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2cocGxvdC5sYWJlbEJ5VmFyaWFibGUpO1xyXG5cclxuICAgICAgICBwbG90LnN1YnBsb3RzID0gW107XHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwWCgpIHtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHggPSBwbG90Lng7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZztcclxuXHJcbiAgICAgICAgeC52YWx1ZSA9IGNvbmYudmFyaWFibGVzLnZhbHVlO1xyXG4gICAgICAgIHguc2NhbGUgPSBkMy5zY2FsZVtjb25mLnguc2NhbGVdKCkucmFuZ2UoW2NvbmYucGFkZGluZyAvIDIsIHBsb3Quc2l6ZSAtIGNvbmYucGFkZGluZyAvIDJdKTtcclxuICAgICAgICB4Lm1hcCA9IChkLCB2YXJpYWJsZSkgPT4geC5zY2FsZSh4LnZhbHVlKGQsIHZhcmlhYmxlKSk7XHJcbiAgICAgICAgeC5heGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh4LnNjYWxlKS5vcmllbnQoY29uZi54Lm9yaWVudCkudGlja3MoY29uZi50aWNrcyk7XHJcbiAgICAgICAgeC5heGlzLnRpY2tTaXplKHBsb3Quc2l6ZSAqIHBsb3QudmFyaWFibGVzLmxlbmd0aCk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzZXR1cFkoKSB7XHJcblxyXG4gICAgICAgIHZhciBwbG90ID0gdGhpcy5wbG90O1xyXG4gICAgICAgIHZhciB5ID0gcGxvdC55O1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcblxyXG4gICAgICAgIHkudmFsdWUgPSBjb25mLnZhcmlhYmxlcy52YWx1ZTtcclxuICAgICAgICB5LnNjYWxlID0gZDMuc2NhbGVbY29uZi55LnNjYWxlXSgpLnJhbmdlKFsgcGxvdC5zaXplIC0gY29uZi5wYWRkaW5nIC8gMiwgY29uZi5wYWRkaW5nIC8gMl0pO1xyXG4gICAgICAgIHkubWFwID0gKGQsIHZhcmlhYmxlKSA9PiB5LnNjYWxlKHkudmFsdWUoZCwgdmFyaWFibGUpKTtcclxuICAgICAgICB5LmF4aXM9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeS5zY2FsZSkub3JpZW50KGNvbmYueS5vcmllbnQpLnRpY2tzKGNvbmYudGlja3MpO1xyXG4gICAgICAgIHkuYXhpcy50aWNrU2l6ZSgtcGxvdC5zaXplICogcGxvdC52YXJpYWJsZXMubGVuZ3RoKTtcclxuICAgIH07XHJcblxyXG4gICAgZHJhdygpIHtcclxuICAgICAgICB2YXIgc2VsZiA9dGhpcztcclxuICAgICAgICB2YXIgbiA9IHNlbGYucGxvdC52YXJpYWJsZXMubGVuZ3RoO1xyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcblxyXG4gICAgICAgIHZhciBheGlzQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwiYXhpc1wiKTtcclxuICAgICAgICB2YXIgYXhpc1hDbGFzcyA9IGF4aXNDbGFzcytcIi14XCI7XHJcbiAgICAgICAgdmFyIGF4aXNZQ2xhc3MgPSBheGlzQ2xhc3MrXCIteVwiO1xyXG5cclxuICAgICAgICB2YXIgeEF4aXNTZWxlY3RvciA9IFwiZy5cIitheGlzWENsYXNzK1wiLlwiK2F4aXNDbGFzcztcclxuICAgICAgICB2YXIgeUF4aXNTZWxlY3RvciA9IFwiZy5cIitheGlzWUNsYXNzK1wiLlwiK2F4aXNDbGFzcztcclxuXHJcbiAgICAgICAgdmFyIG5vR3VpZGVzQ2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKFwibm8tZ3VpZGVzXCIpO1xyXG4gICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoeEF4aXNTZWxlY3RvcilcclxuICAgICAgICAgICAgLmRhdGEoc2VsZi5wbG90LnZhcmlhYmxlcylcclxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kU2VsZWN0b3IoeEF4aXNTZWxlY3RvcilcclxuICAgICAgICAgICAgLmNsYXNzZWQobm9HdWlkZXNDbGFzcywgIWNvbmYuZ3VpZGVzKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCAoZCwgaSkgPT4gXCJ0cmFuc2xhdGUoXCIgKyAobiAtIGkgLSAxKSAqIHNlbGYucGxvdC5zaXplICsgXCIsMClcIilcclxuICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24oZCkgeyBzZWxmLnBsb3QueC5zY2FsZS5kb21haW4oc2VsZi5wbG90LmRvbWFpbkJ5VmFyaWFibGVbZF0pOyBkMy5zZWxlY3QodGhpcykuY2FsbChzZWxmLnBsb3QueC5heGlzKTsgfSk7XHJcblxyXG4gICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoeUF4aXNTZWxlY3RvcilcclxuICAgICAgICAgICAgLmRhdGEoc2VsZi5wbG90LnZhcmlhYmxlcylcclxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kU2VsZWN0b3IoeUF4aXNTZWxlY3RvcilcclxuICAgICAgICAgICAgLmNsYXNzZWQobm9HdWlkZXNDbGFzcywgIWNvbmYuZ3VpZGVzKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCAoZCwgaSkgPT4gXCJ0cmFuc2xhdGUoMCxcIiArIGkgKiBzZWxmLnBsb3Quc2l6ZSArIFwiKVwiKVxyXG4gICAgICAgICAgICAuZWFjaChmdW5jdGlvbihkKSB7IHNlbGYucGxvdC55LnNjYWxlLmRvbWFpbihzZWxmLnBsb3QuZG9tYWluQnlWYXJpYWJsZVtkXSk7IGQzLnNlbGVjdCh0aGlzKS5jYWxsKHNlbGYucGxvdC55LmF4aXMpOyB9KTtcclxuXHJcbiAgICAgICAgdmFyIGNlbGxDbGFzcyA9ICBzZWxmLnByZWZpeENsYXNzKFwiY2VsbFwiKTtcclxuICAgICAgICB2YXIgY2VsbCA9IHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCIuXCIrY2VsbENsYXNzKVxyXG4gICAgICAgICAgICAuZGF0YShzZWxmLnV0aWxzLmNyb3NzKHNlbGYucGxvdC52YXJpYWJsZXMsIHNlbGYucGxvdC52YXJpYWJsZXMpKVxyXG4gICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmRTZWxlY3RvcihcImcuXCIrY2VsbENsYXNzKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBkID0+IFwidHJhbnNsYXRlKFwiICsgKG4gLSBkLmkgLSAxKSAqIHNlbGYucGxvdC5zaXplICsgXCIsXCIgKyBkLmogKiBzZWxmLnBsb3Quc2l6ZSArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgaWYoY29uZi5icnVzaCl7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0JydXNoKGNlbGwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2VsbC5lYWNoKHBsb3RTdWJwbG90KTtcclxuXHJcblxyXG5cclxuICAgICAgICAvL0xhYmVsc1xyXG4gICAgICAgIGNlbGwuZmlsdGVyKGQgPT4gZC5pID09PSBkLmopXHJcbiAgICAgICAgICAgIC5hcHBlbmQoXCJ0ZXh0XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCBjb25mLnBhZGRpbmcpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCBjb25mLnBhZGRpbmcpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCIuNzFlbVwiKVxyXG4gICAgICAgICAgICAudGV4dCggZCA9PiBzZWxmLnBsb3QubGFiZWxCeVZhcmlhYmxlW2QueF0pO1xyXG5cclxuXHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwbG90U3VicGxvdChwKSB7XHJcbiAgICAgICAgICAgIHZhciBwbG90ID0gc2VsZi5wbG90O1xyXG4gICAgICAgICAgICBwbG90LnN1YnBsb3RzLnB1c2gocCk7XHJcbiAgICAgICAgICAgIHZhciBjZWxsID0gZDMuc2VsZWN0KHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgcGxvdC54LnNjYWxlLmRvbWFpbihwbG90LmRvbWFpbkJ5VmFyaWFibGVbcC54XSk7XHJcbiAgICAgICAgICAgIHBsb3QueS5zY2FsZS5kb21haW4ocGxvdC5kb21haW5CeVZhcmlhYmxlW3AueV0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIGZyYW1lQ2xhc3MgPSAgc2VsZi5wcmVmaXhDbGFzcyhcImZyYW1lXCIpO1xyXG4gICAgICAgICAgICBjZWxsLmFwcGVuZChcInJlY3RcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgZnJhbWVDbGFzcylcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieFwiLCBjb25mLnBhZGRpbmcgLyAyKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIGNvbmYucGFkZGluZyAvIDIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGNvbmYuc2l6ZSAtIGNvbmYucGFkZGluZylcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGNvbmYuc2l6ZSAtIGNvbmYucGFkZGluZyk7XHJcblxyXG5cclxuICAgICAgICAgICAgcC51cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzdWJwbG90ID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHZhciBkb3RzID0gY2VsbC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcclxuICAgICAgICAgICAgICAgICAgICAuZGF0YShzZWxmLmRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgIGRvdHMuZW50ZXIoKS5hcHBlbmQoXCJjaXJjbGVcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgZG90cy5hdHRyKFwiY3hcIiwgKGQpID0+IHBsb3QueC5tYXAoZCwgc3VicGxvdC54KSlcclxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcImN5XCIsIChkKSA9PiBwbG90LnkubWFwKGQsIHN1YnBsb3QueSkpXHJcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJyXCIsIHNlbGYuY29uZmlnLmRvdC5yYWRpdXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwbG90LmRvdC5jb2xvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvdHMuc3R5bGUoXCJmaWxsXCIsIHBsb3QuZG90LmNvbG9yKVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmKHBsb3QudG9vbHRpcCl7XHJcbiAgICAgICAgICAgICAgICAgICAgZG90cy5vbihcIm1vdXNlb3ZlclwiLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAuOSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodG1sID0gXCIoXCIgKyBwbG90LngudmFsdWUoZCwgc3VicGxvdC54KSArIFwiLCBcIiArcGxvdC55LnZhbHVlKGQsIHN1YnBsb3QueSkgKyBcIilcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLmh0bWwoaHRtbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzLmV2ZW50LnBhZ2VYICsgNSkgKyBcInB4XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBncm91cCA9IHNlbGYuY29uZmlnLmdyb3Vwcy52YWx1ZShkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZ3JvdXAgfHwgZ3JvdXA9PT0wICl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sKz1cIjxici8+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSBzZWxmLmNvbmZpZy5ncm91cHMubGFiZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihsYWJlbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCs9bGFiZWwrXCI6IFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCs9Z3JvdXBcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbG90LnRvb2x0aXAuaHRtbChodG1sKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZDMuZXZlbnQucGFnZVggKyA1KSArIFwicHhcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDMuZXZlbnQucGFnZVkgLSAyOCkgKyBcInB4XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIChkKT0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGRvdHMuZXhpdCgpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBwLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUxlZ2VuZCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICB1cGRhdGUoZGF0YSkge1xyXG5cclxuICAgICAgICBzdXBlci51cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgdGhpcy5wbG90LnN1YnBsb3RzLmZvckVhY2gocCA9PiBwLnVwZGF0ZSgpKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUxlZ2VuZCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBkcmF3QnJ1c2goY2VsbCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgYnJ1c2ggPSBkMy5zdmcuYnJ1c2goKVxyXG4gICAgICAgICAgICAueChzZWxmLnBsb3QueC5zY2FsZSlcclxuICAgICAgICAgICAgLnkoc2VsZi5wbG90Lnkuc2NhbGUpXHJcbiAgICAgICAgICAgIC5vbihcImJydXNoc3RhcnRcIiwgYnJ1c2hzdGFydClcclxuICAgICAgICAgICAgLm9uKFwiYnJ1c2hcIiwgYnJ1c2htb3ZlKVxyXG4gICAgICAgICAgICAub24oXCJicnVzaGVuZFwiLCBicnVzaGVuZCk7XHJcblxyXG4gICAgICAgIGNlbGwuYXBwZW5kKFwiZ1wiKS5jYWxsKGJydXNoKTtcclxuXHJcblxyXG4gICAgICAgIHZhciBicnVzaENlbGw7XHJcblxyXG4gICAgICAgIC8vIENsZWFyIHRoZSBwcmV2aW91c2x5LWFjdGl2ZSBicnVzaCwgaWYgYW55LlxyXG4gICAgICAgIGZ1bmN0aW9uIGJydXNoc3RhcnQocCkge1xyXG4gICAgICAgICAgICBpZiAoYnJ1c2hDZWxsICE9PSB0aGlzKSB7XHJcbiAgICAgICAgICAgICAgICBkMy5zZWxlY3QoYnJ1c2hDZWxsKS5jYWxsKGJydXNoLmNsZWFyKCkpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wbG90Lnguc2NhbGUuZG9tYWluKHNlbGYucGxvdC5kb21haW5CeVZhcmlhYmxlW3AueF0pO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wbG90Lnkuc2NhbGUuZG9tYWluKHNlbGYucGxvdC5kb21haW5CeVZhcmlhYmxlW3AueV0pO1xyXG4gICAgICAgICAgICAgICAgYnJ1c2hDZWxsID0gdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSGlnaGxpZ2h0IHRoZSBzZWxlY3RlZCBjaXJjbGVzLlxyXG4gICAgICAgIGZ1bmN0aW9uIGJydXNobW92ZShwKSB7XHJcbiAgICAgICAgICAgIHZhciBlID0gYnJ1c2guZXh0ZW50KCk7XHJcbiAgICAgICAgICAgIHNlbGYuc3ZnRy5zZWxlY3RBbGwoXCJjaXJjbGVcIikuY2xhc3NlZChcImhpZGRlblwiLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVbMF1bMF0gPiBkW3AueF0gfHwgZFtwLnhdID4gZVsxXVswXVxyXG4gICAgICAgICAgICAgICAgICAgIHx8IGVbMF1bMV0gPiBkW3AueV0gfHwgZFtwLnldID4gZVsxXVsxXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIElmIHRoZSBicnVzaCBpcyBlbXB0eSwgc2VsZWN0IGFsbCBjaXJjbGVzLlxyXG4gICAgICAgIGZ1bmN0aW9uIGJydXNoZW5kKCkge1xyXG4gICAgICAgICAgICBpZiAoYnJ1c2guZW1wdHkoKSkgc2VsZi5zdmdHLnNlbGVjdEFsbChcIi5oaWRkZW5cIikuY2xhc3NlZChcImhpZGRlblwiLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB1cGRhdGVMZWdlbmQoKSB7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCd1cGRhdGVMZWdlbmQnKTtcclxuICAgICAgICB2YXIgcGxvdCA9IHRoaXMucGxvdDtcclxuXHJcbiAgICAgICAgdmFyIHNjYWxlID0gcGxvdC5kb3QuY29sb3JDYXRlZ29yeTtcclxuICAgICAgICBpZighc2NhbGUuZG9tYWluKCkgfHwgc2NhbGUuZG9tYWluKCkubGVuZ3RoPDIpe1xyXG4gICAgICAgICAgICBwbG90LnNob3dMZWdlbmQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCFwbG90LnNob3dMZWdlbmQpe1xyXG4gICAgICAgICAgICBpZihwbG90LmxlZ2VuZCAmJiBwbG90LmxlZ2VuZC5jb250YWluZXIpe1xyXG4gICAgICAgICAgICAgICAgcGxvdC5sZWdlbmQuY29udGFpbmVyLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB2YXIgbGVnZW5kWCA9IHRoaXMucGxvdC53aWR0aCArIHRoaXMuY29uZmlnLmxlZ2VuZC5tYXJnaW47XHJcbiAgICAgICAgdmFyIGxlZ2VuZFkgPSB0aGlzLmNvbmZpZy5sZWdlbmQubWFyZ2luO1xyXG5cclxuICAgICAgICBwbG90LmxlZ2VuZCA9IG5ldyBMZWdlbmQodGhpcy5zdmcsIHRoaXMuc3ZnRywgc2NhbGUsIGxlZ2VuZFgsIGxlZ2VuZFkpO1xyXG5cclxuICAgICAgICB2YXIgbGVnZW5kTGluZWFyID0gcGxvdC5sZWdlbmQuY29sb3IoKVxyXG4gICAgICAgICAgICAuc2hhcGVXaWR0aCh0aGlzLmNvbmZpZy5sZWdlbmQuc2hhcGVXaWR0aClcclxuICAgICAgICAgICAgLm9yaWVudCgndmVydGljYWwnKVxyXG4gICAgICAgICAgICAuc2NhbGUoc2NhbGUpO1xyXG5cclxuICAgICAgICBwbG90LmxlZ2VuZC5jb250YWluZXJcclxuICAgICAgICAgICAgLmNhbGwobGVnZW5kTGluZWFyKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7Q2hhcnQsIENoYXJ0Q29uZmlnfSBmcm9tIFwiLi9jaGFydFwiO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJ1xyXG5pbXBvcnQge0xlZ2VuZH0gZnJvbSBcIi4vbGVnZW5kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2NhdHRlclBsb3RDb25maWcgZXh0ZW5kcyBDaGFydENvbmZpZ3tcclxuXHJcbiAgICBzdmdDbGFzcz0gdGhpcy5jc3NDbGFzc1ByZWZpeCsnc2NhdHRlcnBsb3QnO1xyXG4gICAgZ3VpZGVzPSBmYWxzZTsgLy9zaG93IGF4aXMgZ3VpZGVzXHJcbiAgICBzaG93VG9vbHRpcD0gdHJ1ZTsgLy9zaG93IHRvb2x0aXAgb24gZG90IGhvdmVyXHJcbiAgICBzaG93TGVnZW5kPXRydWU7XHJcbiAgICBsZWdlbmQ9e1xyXG4gICAgICAgIHdpZHRoOiA4MCxcclxuICAgICAgICBtYXJnaW46IDEwLFxyXG4gICAgICAgIHNoYXBlV2lkdGg6IDIwXHJcbiAgICB9O1xyXG5cclxuICAgIHg9ey8vIFggYXhpcyBjb25maWdcclxuICAgICAgICBsYWJlbDogJ1gnLCAvLyBheGlzIGxhYmVsXHJcbiAgICAgICAga2V5OiAwLFxyXG4gICAgICAgIHZhbHVlOiAoZCwga2V5KSA9PiBkW2tleV0sIC8vIHggdmFsdWUgYWNjZXNzb3JcclxuICAgICAgICBvcmllbnQ6IFwiYm90dG9tXCIsXHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCJcclxuICAgIH07XHJcbiAgICB5PXsvLyBZIGF4aXMgY29uZmlnXHJcbiAgICAgICAgbGFiZWw6ICdZJywgLy8gYXhpcyBsYWJlbCxcclxuICAgICAgICBrZXk6IDEsXHJcbiAgICAgICAgdmFsdWU6IChkLCBrZXkpID0+IGRba2V5XSwgLy8geSB2YWx1ZSBhY2Nlc3NvclxyXG4gICAgICAgIG9yaWVudDogXCJsZWZ0XCIsXHJcbiAgICAgICAgc2NhbGU6IFwibGluZWFyXCJcclxuICAgIH07XHJcbiAgICBncm91cHM9e1xyXG4gICAgICAgIGtleTogMixcclxuICAgICAgICB2YWx1ZTogKGQsIGtleSkgPT4gZFtrZXldICwgLy8gZ3JvdXBpbmcgdmFsdWUgYWNjZXNzb3IsXHJcbiAgICAgICAgbGFiZWw6IFwiXCJcclxuICAgIH07XHJcbiAgICB0cmFuc2l0aW9uPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1c3RvbSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB2YXIgY29uZmlnID0gdGhpcztcclxuICAgICAgICB0aGlzLmRvdD17XHJcbiAgICAgICAgICAgIHJhZGl1czogMixcclxuICAgICAgICAgICAgY29sb3I6IGQgPT4gY29uZmlnLmdyb3Vwcy52YWx1ZShkLCBjb25maWcuZ3JvdXBzLmtleSksIC8vIHN0cmluZyBvciBmdW5jdGlvbiByZXR1cm5pbmcgY29sb3IncyB2YWx1ZSBmb3IgY29sb3Igc2NhbGVcclxuICAgICAgICAgICAgZDNDb2xvckNhdGVnb3J5OiAnY2F0ZWdvcnkxMCdcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZihjdXN0b20pe1xyXG4gICAgICAgICAgICBVdGlscy5kZWVwRXh0ZW5kKHRoaXMsIGN1c3RvbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNjYXR0ZXJQbG90IGV4dGVuZHMgQ2hhcnR7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBjb25maWcpIHtcclxuICAgICAgICBzdXBlcihwbGFjZWhvbGRlclNlbGVjdG9yLCBkYXRhLCBuZXcgU2NhdHRlclBsb3RDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uZmlnKGNvbmZpZyl7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldENvbmZpZyhuZXcgU2NhdHRlclBsb3RDb25maWcoY29uZmlnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBsb3QoKXtcclxuICAgICAgICBzdXBlci5pbml0UGxvdCgpO1xyXG4gICAgICAgIHZhciBzZWxmPXRoaXM7XHJcblxyXG4gICAgICAgIHZhciBjb25mID0gdGhpcy5jb25maWc7XHJcblxyXG4gICAgICAgIHRoaXMucGxvdC54PXt9O1xyXG4gICAgICAgIHRoaXMucGxvdC55PXt9O1xyXG4gICAgICAgIHRoaXMucGxvdC5kb3Q9e1xyXG4gICAgICAgICAgICBjb2xvcjogbnVsbC8vY29sb3Igc2NhbGUgbWFwcGluZyBmdW5jdGlvblxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICB0aGlzLnBsb3Quc2hvd0xlZ2VuZCA9IGNvbmYuc2hvd0xlZ2VuZDtcclxuICAgICAgICBpZih0aGlzLnBsb3Quc2hvd0xlZ2VuZCl7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5tYXJnaW4ucmlnaHQgPSBjb25mLm1hcmdpbi5yaWdodCArIGNvbmYubGVnZW5kLndpZHRoK2NvbmYubGVnZW5kLm1hcmdpbioyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgdGhpcy5jb21wdXRlUGxvdFNpemUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cFgoKTtcclxuICAgICAgICB0aGlzLnNldHVwWSgpO1xyXG5cclxuICAgICAgICBpZihjb25mLmRvdC5kM0NvbG9yQ2F0ZWdvcnkpe1xyXG4gICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yQ2F0ZWdvcnkgPSBkMy5zY2FsZVtjb25mLmRvdC5kM0NvbG9yQ2F0ZWdvcnldKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjb2xvclZhbHVlID0gY29uZi5kb3QuY29sb3I7XHJcbiAgICAgICAgaWYoY29sb3JWYWx1ZSl7XHJcbiAgICAgICAgICAgIHRoaXMucGxvdC5kb3QuY29sb3JWYWx1ZSA9IGNvbG9yVmFsdWU7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbG9yVmFsdWUgPT09ICdzdHJpbmcnIHx8IGNvbG9yVmFsdWUgaW5zdGFuY2VvZiBTdHJpbmcpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbG90LmRvdC5jb2xvciA9IGNvbG9yVmFsdWU7XHJcbiAgICAgICAgICAgIH1lbHNlIGlmKHRoaXMucGxvdC5kb3QuY29sb3JDYXRlZ29yeSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsb3QuZG90LmNvbG9yID0gZCA9PiAgc2VsZi5wbG90LmRvdC5jb2xvckNhdGVnb3J5KHNlbGYucGxvdC5kb3QuY29sb3JWYWx1ZShkKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIH1lbHNle1xyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cFgoKXtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHggPSBwbG90Lng7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZy54O1xyXG5cclxuICAgICAgICAvKiAqXHJcbiAgICAgICAgICogdmFsdWUgYWNjZXNzb3IgLSByZXR1cm5zIHRoZSB2YWx1ZSB0byBlbmNvZGUgZm9yIGEgZ2l2ZW4gZGF0YSBvYmplY3QuXHJcbiAgICAgICAgICogc2NhbGUgLSBtYXBzIHZhbHVlIHRvIGEgdmlzdWFsIGRpc3BsYXkgZW5jb2RpbmcsIHN1Y2ggYXMgYSBwaXhlbCBwb3NpdGlvbi5cclxuICAgICAgICAgKiBtYXAgZnVuY3Rpb24gLSBtYXBzIGZyb20gZGF0YSB2YWx1ZSB0byBkaXNwbGF5IHZhbHVlXHJcbiAgICAgICAgICogYXhpcyAtIHNldHMgdXAgYXhpc1xyXG4gICAgICAgICAqKi9cclxuICAgICAgICB4LnZhbHVlID0gZCA9PiBjb25mLnZhbHVlKGQsIGNvbmYua2V5KTtcclxuICAgICAgICB4LnNjYWxlID0gZDMuc2NhbGVbY29uZi5zY2FsZV0oKS5yYW5nZShbMCwgcGxvdC53aWR0aF0pO1xyXG4gICAgICAgIHgubWFwID0gZCA9PiB4LnNjYWxlKHgudmFsdWUoZCkpO1xyXG4gICAgICAgIHguYXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeC5zY2FsZSkub3JpZW50KGNvbmYub3JpZW50KTtcclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgICAgICBwbG90Lnguc2NhbGUuZG9tYWluKFtkMy5taW4oZGF0YSwgcGxvdC54LnZhbHVlKS0xLCBkMy5tYXgoZGF0YSwgcGxvdC54LnZhbHVlKSsxXSk7XHJcbiAgICAgICAgaWYodGhpcy5jb25maWcuZ3VpZGVzKSB7XHJcbiAgICAgICAgICAgIHguYXhpcy50aWNrU2l6ZSgtcGxvdC5oZWlnaHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHNldHVwWSAoKXtcclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcbiAgICAgICAgdmFyIHkgPSBwbG90Lnk7XHJcbiAgICAgICAgdmFyIGNvbmYgPSB0aGlzLmNvbmZpZy55O1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHZhbHVlIGFjY2Vzc29yIC0gcmV0dXJucyB0aGUgdmFsdWUgdG8gZW5jb2RlIGZvciBhIGdpdmVuIGRhdGEgb2JqZWN0LlxyXG4gICAgICAgICAqIHNjYWxlIC0gbWFwcyB2YWx1ZSB0byBhIHZpc3VhbCBkaXNwbGF5IGVuY29kaW5nLCBzdWNoIGFzIGEgcGl4ZWwgcG9zaXRpb24uXHJcbiAgICAgICAgICogbWFwIGZ1bmN0aW9uIC0gbWFwcyBmcm9tIGRhdGEgdmFsdWUgdG8gZGlzcGxheSB2YWx1ZVxyXG4gICAgICAgICAqIGF4aXMgLSBzZXRzIHVwIGF4aXNcclxuICAgICAgICAgKi9cclxuICAgICAgICB5LnZhbHVlID0gZCA9PiBjb25mLnZhbHVlKGQsIGNvbmYua2V5KTtcclxuICAgICAgICB5LnNjYWxlID0gZDMuc2NhbGVbY29uZi5zY2FsZV0oKS5yYW5nZShbcGxvdC5oZWlnaHQsIDBdKTtcclxuICAgICAgICB5Lm1hcCA9IGQgPT4geS5zY2FsZSh5LnZhbHVlKGQpKTtcclxuICAgICAgICB5LmF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHkuc2NhbGUpLm9yaWVudChjb25mLm9yaWVudCk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuY29uZmlnLmd1aWRlcyl7XHJcbiAgICAgICAgICAgIHkuYXhpcy50aWNrU2l6ZSgtcGxvdC53aWR0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgcGxvdC55LnNjYWxlLmRvbWFpbihbZDMubWluKGRhdGEsIHBsb3QueS52YWx1ZSktMSwgZDMubWF4KGRhdGEsIHBsb3QueS52YWx1ZSkrMV0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBkcmF3QXhpc1goKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGF4aXNDb25mID0gdGhpcy5jb25maWcueDtcclxuICAgICAgICB2YXIgYXhpcyA9IHNlbGYuc3ZnRy5zZWxlY3RPckFwcGVuZChcImcuXCIrc2VsZi5wcmVmaXhDbGFzcygnYXhpcy14JykrXCIuXCIrc2VsZi5wcmVmaXhDbGFzcygnYXhpcycpKyhzZWxmLmNvbmZpZy5ndWlkZXMgPyAnJyA6ICcuJytzZWxmLnByZWZpeENsYXNzKCduby1ndWlkZXMnKSkpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyBwbG90LmhlaWdodCArIFwiKVwiKTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgYXhpc1QgPSBheGlzO1xyXG4gICAgICAgIGlmIChzZWxmLnRyYW5zaXRpb25FbmFibGVkKCkpIHtcclxuICAgICAgICAgICAgYXhpc1QgPSBheGlzLnRyYW5zaXRpb24oKS5lYXNlKFwic2luLWluLW91dFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGF4aXNULmNhbGwocGxvdC54LmF4aXMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGF4aXMuc2VsZWN0T3JBcHBlbmQoXCJ0ZXh0LlwiK3NlbGYucHJlZml4Q2xhc3MoJ2xhYmVsJykpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiKyAocGxvdC53aWR0aC8yKSArXCIsXCIrIChwbG90Lm1hcmdpbi5ib3R0b20pICtcIilcIikgIC8vIHRleHQgaXMgZHJhd24gb2ZmIHRoZSBzY3JlZW4gdG9wIGxlZnQsIG1vdmUgZG93biBhbmQgb3V0IGFuZCByb3RhdGVcclxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCBcIi0xZW1cIilcclxuICAgICAgICAgICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgLnRleHQoYXhpc0NvbmYubGFiZWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICBkcmF3QXhpc1koKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBsb3QgPSBzZWxmLnBsb3Q7XHJcbiAgICAgICAgdmFyIGF4aXNDb25mID0gdGhpcy5jb25maWcueTtcclxuICAgICAgICB2YXIgYXhpcyA9IHNlbGYuc3ZnRy5zZWxlY3RPckFwcGVuZChcImcuXCIrc2VsZi5wcmVmaXhDbGFzcygnYXhpcy15JykrXCIuXCIrc2VsZi5wcmVmaXhDbGFzcygnYXhpcycpKyhzZWxmLmNvbmZpZy5ndWlkZXMgPyAnJyA6ICcuJytzZWxmLnByZWZpeENsYXNzKCduby1ndWlkZXMnKSkpO1xyXG5cclxuICAgICAgICB2YXIgYXhpc1QgPSBheGlzO1xyXG4gICAgICAgIGlmIChzZWxmLnRyYW5zaXRpb25FbmFibGVkKCkpIHtcclxuICAgICAgICAgICAgYXhpc1QgPSBheGlzLnRyYW5zaXRpb24oKS5lYXNlKFwic2luLWluLW91dFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGF4aXNULmNhbGwocGxvdC55LmF4aXMpO1xyXG5cclxuICAgICAgICBheGlzLnNlbGVjdE9yQXBwZW5kKFwidGV4dC5cIitzZWxmLnByZWZpeENsYXNzKCdsYWJlbCcpKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisgLXBsb3QubWFyZ2luLmxlZnQgK1wiLFwiKyhwbG90LmhlaWdodC8yKStcIilyb3RhdGUoLTkwKVwiKSAgLy8gdGV4dCBpcyBkcmF3biBvZmYgdGhlIHNjcmVlbiB0b3AgbGVmdCwgbW92ZSBkb3duIGFuZCBvdXQgYW5kIHJvdGF0ZVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiMWVtXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgIC50ZXh0KGF4aXNDb25mLmxhYmVsKTtcclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlKG5ld0RhdGEpe1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShuZXdEYXRhKTtcclxuICAgICAgICB0aGlzLmRyYXdBeGlzWCgpO1xyXG4gICAgICAgIHRoaXMuZHJhd0F4aXNZKCk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlRG90cygpO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUxlZ2VuZCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICB1cGRhdGVEb3RzKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgcGxvdCA9IHNlbGYucGxvdDtcclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgICAgICB2YXIgZG90Q2xhc3MgPSBzZWxmLnByZWZpeENsYXNzKCdkb3QnKTtcclxuICAgICAgICBzZWxmLmRvdHNDb250YWluZXJDbGFzcyA9IHNlbGYucHJlZml4Q2xhc3MoJ2RvdHMtY29udGFpbmVyJyk7XHJcblxyXG5cclxuICAgICAgICB2YXIgZG90c0NvbnRhaW5lciA9IHNlbGYuc3ZnRy5zZWxlY3RPckFwcGVuZChcImcuXCIgKyBzZWxmLmRvdHNDb250YWluZXJDbGFzcyk7XHJcblxyXG4gICAgICAgIHZhciBkb3RzID0gZG90c0NvbnRhaW5lci5zZWxlY3RBbGwoJy4nICsgZG90Q2xhc3MpXHJcbiAgICAgICAgICAgIC5kYXRhKGRhdGEpO1xyXG5cclxuICAgICAgICBkb3RzLmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgZG90Q2xhc3MpO1xyXG5cclxuICAgICAgICB2YXIgZG90c1QgPSBkb3RzO1xyXG4gICAgICAgIGlmIChzZWxmLnRyYW5zaXRpb25FbmFibGVkKCkpIHtcclxuICAgICAgICAgICAgZG90c1QgPSBkb3RzLnRyYW5zaXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRvdHNULmF0dHIoXCJyXCIsIHNlbGYuY29uZmlnLmRvdC5yYWRpdXMpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY3hcIiwgcGxvdC54Lm1hcClcclxuICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCBwbG90LnkubWFwKTtcclxuXHJcbiAgICAgICAgaWYgKHBsb3QudG9vbHRpcCkge1xyXG4gICAgICAgICAgICBkb3RzLm9uKFwibW91c2VvdmVyXCIsIGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgcGxvdC50b29sdGlwLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbigyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAuOSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IFwiKFwiICsgcGxvdC54LnZhbHVlKGQpICsgXCIsIFwiICsgcGxvdC55LnZhbHVlKGQpICsgXCIpXCI7XHJcbiAgICAgICAgICAgICAgICB2YXIgZ3JvdXAgPSBzZWxmLmNvbmZpZy5ncm91cHMudmFsdWUoZCwgc2VsZi5jb25maWcuZ3JvdXBzLmtleSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXAgfHwgZ3JvdXAgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBodG1sICs9IFwiPGJyLz5cIjtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSBzZWxmLmNvbmZpZy5ncm91cHMubGFiZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhYmVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gbGFiZWwgKyBcIjogXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gZ3JvdXBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC5odG1sKGh0bWwpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZDMuZXZlbnQucGFnZVggKyA1KSArIFwicHhcIilcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHBsb3QudG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBsb3QuZG90LmNvbG9yKSB7XHJcbiAgICAgICAgICAgIGRvdHMuc3R5bGUoXCJmaWxsXCIsIHBsb3QuZG90LmNvbG9yKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG90cy5leGl0KCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTGVnZW5kKCkge1xyXG5cclxuXHJcbiAgICAgICAgdmFyIHBsb3QgPSB0aGlzLnBsb3Q7XHJcblxyXG4gICAgICAgIHZhciBzY2FsZSA9IHBsb3QuZG90LmNvbG9yQ2F0ZWdvcnk7XHJcbiAgICAgICAgaWYoIXNjYWxlLmRvbWFpbigpIHx8IHNjYWxlLmRvbWFpbigpLmxlbmd0aDwyKXtcclxuICAgICAgICAgICAgcGxvdC5zaG93TGVnZW5kID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZighcGxvdC5zaG93TGVnZW5kKXtcclxuICAgICAgICAgICAgaWYocGxvdC5sZWdlbmQgJiYgcGxvdC5sZWdlbmQuY29udGFpbmVyKXtcclxuICAgICAgICAgICAgICAgIHBsb3QubGVnZW5kLmNvbnRhaW5lci5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdmFyIGxlZ2VuZFggPSB0aGlzLnBsb3Qud2lkdGggKyB0aGlzLmNvbmZpZy5sZWdlbmQubWFyZ2luO1xyXG4gICAgICAgIHZhciBsZWdlbmRZID0gdGhpcy5jb25maWcubGVnZW5kLm1hcmdpbjtcclxuXHJcbiAgICAgICAgcGxvdC5sZWdlbmQgPSBuZXcgTGVnZW5kKHRoaXMuc3ZnLCB0aGlzLnN2Z0csIHNjYWxlLCBsZWdlbmRYLCBsZWdlbmRZKTtcclxuXHJcbiAgICAgICAgdmFyIGxlZ2VuZExpbmVhciA9IHBsb3QubGVnZW5kLmNvbG9yKClcclxuICAgICAgICAgICAgLnNoYXBlV2lkdGgodGhpcy5jb25maWcubGVnZW5kLnNoYXBlV2lkdGgpXHJcbiAgICAgICAgICAgIC5vcmllbnQoJ3ZlcnRpY2FsJylcclxuICAgICAgICAgICAgLnNjYWxlKHNjYWxlKTtcclxuICAgICAgICBcclxuICAgICAgICBwbG90LmxlZ2VuZC5jb250YWluZXJcclxuICAgICAgICAgICAgLmNhbGwobGVnZW5kTGluZWFyKTtcclxuICAgIH1cclxuXHJcbiAgICBcclxufVxyXG4iLCIvKlxuICogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vYmVucmFzbXVzZW4vMTI2MTk3N1xuICogTkFNRVxuICogXG4gKiBzdGF0aXN0aWNzLWRpc3RyaWJ1dGlvbnMuanMgLSBKYXZhU2NyaXB0IGxpYnJhcnkgZm9yIGNhbGN1bGF0aW5nXG4gKiAgIGNyaXRpY2FsIHZhbHVlcyBhbmQgdXBwZXIgcHJvYmFiaWxpdGllcyBvZiBjb21tb24gc3RhdGlzdGljYWxcbiAqICAgZGlzdHJpYnV0aW9uc1xuICogXG4gKiBTWU5PUFNJU1xuICogXG4gKiBcbiAqICAgLy8gQ2hpLXNxdWFyZWQtY3JpdCAoMiBkZWdyZWVzIG9mIGZyZWVkb20sIDk1dGggcGVyY2VudGlsZSA9IDAuMDUgbGV2ZWxcbiAqICAgY2hpc3FyZGlzdHIoMiwgLjA1KVxuICogICBcbiAqICAgLy8gdS1jcml0ICg5NXRoIHBlcmNlbnRpbGUgPSAwLjA1IGxldmVsKVxuICogICB1ZGlzdHIoLjA1KTtcbiAqICAgXG4gKiAgIC8vIHQtY3JpdCAoMSBkZWdyZWUgb2YgZnJlZWRvbSwgOTkuNXRoIHBlcmNlbnRpbGUgPSAwLjAwNSBsZXZlbCkgXG4gKiAgIHRkaXN0cigxLC4wMDUpO1xuICogICBcbiAqICAgLy8gRi1jcml0ICgxIGRlZ3JlZSBvZiBmcmVlZG9tIGluIG51bWVyYXRvciwgMyBkZWdyZWVzIG9mIGZyZWVkb20gXG4gKiAgIC8vICAgICAgICAgaW4gZGVub21pbmF0b3IsIDk5dGggcGVyY2VudGlsZSA9IDAuMDEgbGV2ZWwpXG4gKiAgIGZkaXN0cigxLDMsLjAxKTtcbiAqICAgXG4gKiAgIC8vIHVwcGVyIHByb2JhYmlsaXR5IG9mIHRoZSB1IGRpc3RyaWJ1dGlvbiAodSA9IC0wLjg1KTogUSh1KSA9IDEtRyh1KVxuICogICB1cHJvYigtMC44NSk7XG4gKiAgIFxuICogICAvLyB1cHBlciBwcm9iYWJpbGl0eSBvZiB0aGUgY2hpLXNxdWFyZSBkaXN0cmlidXRpb25cbiAqICAgLy8gKDMgZGVncmVlcyBvZiBmcmVlZG9tLCBjaGktc3F1YXJlZCA9IDYuMjUpOiBRID0gMS1HXG4gKiAgIGNoaXNxcnByb2IoMyw2LjI1KTtcbiAqICAgXG4gKiAgIC8vIHVwcGVyIHByb2JhYmlsaXR5IG9mIHRoZSB0IGRpc3RyaWJ1dGlvblxuICogICAvLyAoMyBkZWdyZWVzIG9mIGZyZWVkb20sIHQgPSA2LjI1MSk6IFEgPSAxLUdcbiAqICAgdHByb2IoMyw2LjI1MSk7XG4gKiAgIFxuICogICAvLyB1cHBlciBwcm9iYWJpbGl0eSBvZiB0aGUgRiBkaXN0cmlidXRpb25cbiAqICAgLy8gKDMgZGVncmVlcyBvZiBmcmVlZG9tIGluIG51bWVyYXRvciwgNSBkZWdyZWVzIG9mIGZyZWVkb20gaW5cbiAqICAgLy8gIGRlbm9taW5hdG9yLCBGID0gNi4yNSk6IFEgPSAxLUdcbiAqICAgZnByb2IoMyw1LC42MjUpO1xuICogXG4gKiBcbiAqICBERVNDUklQVElPTlxuICogXG4gKiBUaGlzIGxpYnJhcnkgY2FsY3VsYXRlcyBwZXJjZW50YWdlIHBvaW50cyAoNSBzaWduaWZpY2FudCBkaWdpdHMpIG9mIHRoZSB1XG4gKiAoc3RhbmRhcmQgbm9ybWFsKSBkaXN0cmlidXRpb24sIHRoZSBzdHVkZW50J3MgdCBkaXN0cmlidXRpb24sIHRoZVxuICogY2hpLXNxdWFyZSBkaXN0cmlidXRpb24gYW5kIHRoZSBGIGRpc3RyaWJ1dGlvbi4gSXQgY2FuIGFsc28gY2FsY3VsYXRlIHRoZVxuICogdXBwZXIgcHJvYmFiaWxpdHkgKDUgc2lnbmlmaWNhbnQgZGlnaXRzKSBvZiB0aGUgdSAoc3RhbmRhcmQgbm9ybWFsKSwgdGhlXG4gKiBjaGktc3F1YXJlLCB0aGUgdCBhbmQgdGhlIEYgZGlzdHJpYnV0aW9uLlxuICogXG4gKiBUaGVzZSBjcml0aWNhbCB2YWx1ZXMgYXJlIG5lZWRlZCB0byBwZXJmb3JtIHN0YXRpc3RpY2FsIHRlc3RzLCBsaWtlIHRoZSB1XG4gKiB0ZXN0LCB0aGUgdCB0ZXN0LCB0aGUgRiB0ZXN0IGFuZCB0aGUgY2hpLXNxdWFyZWQgdGVzdCwgYW5kIHRvIGNhbGN1bGF0ZVxuICogY29uZmlkZW5jZSBpbnRlcnZhbHMuXG4gKiBcbiAqIElmIHlvdSBhcmUgaW50ZXJlc3RlZCBpbiBtb3JlIHByZWNpc2UgYWxnb3JpdGhtcyB5b3UgY291bGQgbG9vayBhdDpcbiAqICAgU3RhdExpYjogaHR0cDovL2xpYi5zdGF0LmNtdS5lZHUvYXBzdGF0LyA7IFxuICogICBBcHBsaWVkIFN0YXRpc3RpY3MgQWxnb3JpdGhtcyBieSBHcmlmZml0aHMsIFAuIGFuZCBIaWxsLCBJLkQuXG4gKiAgICwgRWxsaXMgSG9yd29vZDogQ2hpY2hlc3RlciAoMTk4NSlcbiAqIFxuICogQlVHUyBcbiAqIFxuICogVGhpcyBwb3J0IHdhcyBwcm9kdWNlZCBmcm9tIHRoZSBQZXJsIG1vZHVsZSBTdGF0aXN0aWNzOjpEaXN0cmlidXRpb25zXG4gKiB0aGF0IGhhcyBoYWQgbm8gYnVnIHJlcG9ydHMgaW4gc2V2ZXJhbCB5ZWFycy4gIElmIHlvdSBmaW5kIGEgYnVnIHRoZW5cbiAqIHBsZWFzZSBkb3VibGUtY2hlY2sgdGhhdCBKYXZhU2NyaXB0IGRvZXMgbm90IHRoaW5nIHRoZSBudW1iZXJzIHlvdSBhcmVcbiAqIHBhc3NpbmcgaW4gYXJlIHN0cmluZ3MuICAoWW91IGNhbiBzdWJ0cmFjdCAwIGZyb20gdGhlbSBhcyB5b3UgcGFzcyB0aGVtXG4gKiBpbiBzbyB0aGF0IFwiNVwiIGlzIHByb3Blcmx5IHVuZGVyc3Rvb2QgdG8gYmUgNS4pICBJZiB5b3UgaGF2ZSBwYXNzZWQgaW4gYVxuICogbnVtYmVyIHRoZW4gcGxlYXNlIGNvbnRhY3QgdGhlIGF1dGhvclxuICogXG4gKiBBVVRIT1JcbiAqIFxuICogQmVuIFRpbGx5IDxidGlsbHlAZ21haWwuY29tPlxuICogXG4gKiBPcmlnaW5sIFBlcmwgdmVyc2lvbiBieSBNaWNoYWVsIEtvc3BhY2ggPG1pa2UucGVybEBnbXguYXQ+XG4gKiBcbiAqIE5pY2UgZm9ybWF0aW5nLCBzaW1wbGlmaWNhdGlvbiBhbmQgYnVnIHJlcGFpciBieSBNYXR0aGlhcyBUcmF1dG5lciBLcm9tYW5uXG4gKiA8bXRrQGlkLmNicy5kaz5cbiAqIFxuICogQ09QWVJJR0hUIFxuICogXG4gKiBDb3B5cmlnaHQgMjAwOCBCZW4gVGlsbHkuXG4gKiBcbiAqIFRoaXMgbGlicmFyeSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0XG4gKiB1bmRlciB0aGUgc2FtZSB0ZXJtcyBhcyBQZXJsIGl0c2VsZi4gIFRoaXMgbWVhbnMgdW5kZXIgZWl0aGVyIHRoZSBQZXJsXG4gKiBBcnRpc3RpYyBMaWNlbnNlIG9yIHRoZSBHUEwgdjEgb3IgbGF0ZXIuXG4gKi9cblxudmFyIFNJR05JRklDQU5UID0gNTsgLy8gbnVtYmVyIG9mIHNpZ25pZmljYW50IGRpZ2l0cyB0byBiZSByZXR1cm5lZFxuXG5mdW5jdGlvbiBjaGlzcXJkaXN0ciAoJG4sICRwKSB7XG5cdGlmICgkbiA8PSAwIHx8IE1hdGguYWJzKCRuKSAtIE1hdGguYWJzKGludGVnZXIoJG4pKSAhPSAwKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG46ICRuXFxuXCIpOyAvKiBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9XG5cdGlmICgkcCA8PSAwIHx8ICRwID4gMSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBwOiAkcFxcblwiKTsgXG5cdH1cblx0cmV0dXJuIHByZWNpc2lvbl9zdHJpbmcoX3N1YmNoaXNxcigkbi0wLCAkcC0wKSk7XG59XG5cbmZ1bmN0aW9uIHVkaXN0ciAoJHApIHtcblx0aWYgKCRwID4gMSB8fCAkcCA8PSAwKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIHA6ICRwXFxuXCIpO1xuXHR9XG5cdHJldHVybiBwcmVjaXNpb25fc3RyaW5nKF9zdWJ1KCRwLTApKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRkaXN0ciAoJG4sICRwKSB7XG5cdGlmICgkbiA8PSAwIHx8IE1hdGguYWJzKCRuKSAtIE1hdGguYWJzKGludGVnZXIoJG4pKSAhPSAwKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG46ICRuXFxuXCIpO1xuXHR9XG5cdGlmICgkcCA8PSAwIHx8ICRwID49IDEpIHtcblx0XHR0aHJvdyhcIkludmFsaWQgcDogJHBcXG5cIik7XG5cdH1cblx0cmV0dXJuIHByZWNpc2lvbl9zdHJpbmcoX3N1YnQoJG4tMCwgJHAtMCkpO1xufVxuXG5mdW5jdGlvbiBmZGlzdHIgKCRuLCAkbSwgJHApIHtcblx0aWYgKCgkbjw9MCkgfHwgKChNYXRoLmFicygkbiktKE1hdGguYWJzKGludGVnZXIoJG4pKSkpIT0wKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBuOiAkblxcblwiKTsgLyogZmlyc3QgZGVncmVlIG9mIGZyZWVkb20gKi9cblx0fVxuXHRpZiAoKCRtPD0wKSB8fCAoKE1hdGguYWJzKCRtKS0oTWF0aC5hYnMoaW50ZWdlcigkbSkpKSkhPTApKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG06ICRtXFxuXCIpOyAvKiBzZWNvbmQgZGVncmVlIG9mIGZyZWVkb20gKi9cblx0fVxuXHRpZiAoKCRwPD0wKSB8fCAoJHA+MSkpIHtcblx0XHR0aHJvdyhcIkludmFsaWQgcDogJHBcXG5cIik7XG5cdH1cblx0cmV0dXJuIHByZWNpc2lvbl9zdHJpbmcoX3N1YmYoJG4tMCwgJG0tMCwgJHAtMCkpO1xufVxuXG5mdW5jdGlvbiB1cHJvYiAoJHgpIHtcblx0cmV0dXJuIHByZWNpc2lvbl9zdHJpbmcoX3N1YnVwcm9iKCR4LTApKTtcbn1cblxuZnVuY3Rpb24gY2hpc3FycHJvYiAoJG4sJHgpIHtcblx0aWYgKCgkbiA8PSAwKSB8fCAoKE1hdGguYWJzKCRuKSAtIChNYXRoLmFicyhpbnRlZ2VyKCRuKSkpKSAhPSAwKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBuOiAkblxcblwiKTsgLyogZGVncmVlIG9mIGZyZWVkb20gKi9cblx0fVxuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3ViY2hpc3FycHJvYigkbi0wLCAkeC0wKSk7XG59XG5cbmZ1bmN0aW9uIHRwcm9iICgkbiwgJHgpIHtcblx0aWYgKCgkbiA8PSAwKSB8fCAoKE1hdGguYWJzKCRuKSAtIE1hdGguYWJzKGludGVnZXIoJG4pKSkgIT0wKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBuOiAkblxcblwiKTsgLyogZGVncmVlIG9mIGZyZWVkb20gKi9cblx0fVxuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3VidHByb2IoJG4tMCwgJHgtMCkpO1xufVxuXG5mdW5jdGlvbiBmcHJvYiAoJG4sICRtLCAkeCkge1xuXHRpZiAoKCRuPD0wKSB8fCAoKE1hdGguYWJzKCRuKS0oTWF0aC5hYnMoaW50ZWdlcigkbikpKSkhPTApKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIG46ICRuXFxuXCIpOyAvKiBmaXJzdCBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9XG5cdGlmICgoJG08PTApIHx8ICgoTWF0aC5hYnMoJG0pLShNYXRoLmFicyhpbnRlZ2VyKCRtKSkpKSE9MCkpIHtcblx0XHR0aHJvdyhcIkludmFsaWQgbTogJG1cXG5cIik7IC8qIHNlY29uZCBkZWdyZWUgb2YgZnJlZWRvbSAqL1xuXHR9IFxuXHRyZXR1cm4gcHJlY2lzaW9uX3N0cmluZyhfc3ViZnByb2IoJG4tMCwgJG0tMCwgJHgtMCkpO1xufVxuXG5cbmZ1bmN0aW9uIF9zdWJmcHJvYiAoJG4sICRtLCAkeCkge1xuXHR2YXIgJHA7XG5cblx0aWYgKCR4PD0wKSB7XG5cdFx0JHA9MTtcblx0fSBlbHNlIGlmICgkbSAlIDIgPT0gMCkge1xuXHRcdHZhciAkeiA9ICRtIC8gKCRtICsgJG4gKiAkeCk7XG5cdFx0dmFyICRhID0gMTtcblx0XHRmb3IgKHZhciAkaSA9ICRtIC0gMjsgJGkgPj0gMjsgJGkgLT0gMikge1xuXHRcdFx0JGEgPSAxICsgKCRuICsgJGkgLSAyKSAvICRpICogJHogKiAkYTtcblx0XHR9XG5cdFx0JHAgPSAxIC0gTWF0aC5wb3coKDEgLSAkeiksICgkbiAvIDIpICogJGEpO1xuXHR9IGVsc2UgaWYgKCRuICUgMiA9PSAwKSB7XG5cdFx0dmFyICR6ID0gJG4gKiAkeCAvICgkbSArICRuICogJHgpO1xuXHRcdHZhciAkYSA9IDE7XG5cdFx0Zm9yICh2YXIgJGkgPSAkbiAtIDI7ICRpID49IDI7ICRpIC09IDIpIHtcblx0XHRcdCRhID0gMSArICgkbSArICRpIC0gMikgLyAkaSAqICR6ICogJGE7XG5cdFx0fVxuXHRcdCRwID0gTWF0aC5wb3coKDEgLSAkeiksICgkbSAvIDIpKSAqICRhO1xuXHR9IGVsc2Uge1xuXHRcdHZhciAkeSA9IE1hdGguYXRhbjIoTWF0aC5zcXJ0KCRuICogJHggLyAkbSksIDEpO1xuXHRcdHZhciAkeiA9IE1hdGgucG93KE1hdGguc2luKCR5KSwgMik7XG5cdFx0dmFyICRhID0gKCRuID09IDEpID8gMCA6IDE7XG5cdFx0Zm9yICh2YXIgJGkgPSAkbiAtIDI7ICRpID49IDM7ICRpIC09IDIpIHtcblx0XHRcdCRhID0gMSArICgkbSArICRpIC0gMikgLyAkaSAqICR6ICogJGE7XG5cdFx0fSBcblx0XHR2YXIgJGIgPSBNYXRoLlBJO1xuXHRcdGZvciAodmFyICRpID0gMjsgJGkgPD0gJG0gLSAxOyAkaSArPSAyKSB7XG5cdFx0XHQkYiAqPSAoJGkgLSAxKSAvICRpO1xuXHRcdH1cblx0XHR2YXIgJHAxID0gMiAvICRiICogTWF0aC5zaW4oJHkpICogTWF0aC5wb3coTWF0aC5jb3MoJHkpLCAkbSkgKiAkYTtcblxuXHRcdCR6ID0gTWF0aC5wb3coTWF0aC5jb3MoJHkpLCAyKTtcblx0XHQkYSA9ICgkbSA9PSAxKSA/IDAgOiAxO1xuXHRcdGZvciAodmFyICRpID0gJG0tMjsgJGkgPj0gMzsgJGkgLT0gMikge1xuXHRcdFx0JGEgPSAxICsgKCRpIC0gMSkgLyAkaSAqICR6ICogJGE7XG5cdFx0fVxuXHRcdCRwID0gbWF4KDAsICRwMSArIDEgLSAyICogJHkgLyBNYXRoLlBJXG5cdFx0XHQtIDIgLyBNYXRoLlBJICogTWF0aC5zaW4oJHkpICogTWF0aC5jb3MoJHkpICogJGEpO1xuXHR9XG5cdHJldHVybiAkcDtcbn1cblxuXG5mdW5jdGlvbiBfc3ViY2hpc3FycHJvYiAoJG4sJHgpIHtcblx0dmFyICRwO1xuXG5cdGlmICgkeCA8PSAwKSB7XG5cdFx0JHAgPSAxO1xuXHR9IGVsc2UgaWYgKCRuID4gMTAwKSB7XG5cdFx0JHAgPSBfc3VidXByb2IoKE1hdGgucG93KCgkeCAvICRuKSwgMS8zKVxuXHRcdFx0XHQtICgxIC0gMi85LyRuKSkgLyBNYXRoLnNxcnQoMi85LyRuKSk7XG5cdH0gZWxzZSBpZiAoJHggPiA0MDApIHtcblx0XHQkcCA9IDA7XG5cdH0gZWxzZSB7ICAgXG5cdFx0dmFyICRhO1xuICAgICAgICAgICAgICAgIHZhciAkaTtcbiAgICAgICAgICAgICAgICB2YXIgJGkxO1xuXHRcdGlmICgoJG4gJSAyKSAhPSAwKSB7XG5cdFx0XHQkcCA9IDIgKiBfc3VidXByb2IoTWF0aC5zcXJ0KCR4KSk7XG5cdFx0XHQkYSA9IE1hdGguc3FydCgyL01hdGguUEkpICogTWF0aC5leHAoLSR4LzIpIC8gTWF0aC5zcXJ0KCR4KTtcblx0XHRcdCRpMSA9IDE7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRwID0gJGEgPSBNYXRoLmV4cCgtJHgvMik7XG5cdFx0XHQkaTEgPSAyO1xuXHRcdH1cblxuXHRcdGZvciAoJGkgPSAkaTE7ICRpIDw9ICgkbi0yKTsgJGkgKz0gMikge1xuXHRcdFx0JGEgKj0gJHggLyAkaTtcblx0XHRcdCRwICs9ICRhO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gJHA7XG59XG5cbmZ1bmN0aW9uIF9zdWJ1ICgkcCkge1xuXHR2YXIgJHkgPSAtTWF0aC5sb2coNCAqICRwICogKDEgLSAkcCkpO1xuXHR2YXIgJHggPSBNYXRoLnNxcnQoXG5cdFx0JHkgKiAoMS41NzA3OTYyODhcblx0XHQgICsgJHkgKiAoLjAzNzA2OTg3OTA2XG5cdFx0ICBcdCsgJHkgKiAoLS44MzY0MzUzNTg5RS0zXG5cdFx0XHQgICsgJHkgKigtLjIyNTA5NDcxNzZFLTNcblx0XHRcdCAgXHQrICR5ICogKC42ODQxMjE4Mjk5RS01XG5cdFx0XHRcdCAgKyAkeSAqICgwLjU4MjQyMzg1MTVFLTVcblx0XHRcdFx0XHQrICR5ICogKC0uMTA0NTI3NDk3RS01XG5cdFx0XHRcdFx0ICArICR5ICogKC44MzYwOTM3MDE3RS03XG5cdFx0XHRcdFx0XHQrICR5ICogKC0uMzIzMTA4MTI3N0UtOFxuXHRcdFx0XHRcdFx0ICArICR5ICogKC4zNjU3NzYzMDM2RS0xMFxuXHRcdFx0XHRcdFx0XHQrICR5ICouNjkzNjIzMzk4MkUtMTIpKSkpKSkpKSkpKTtcblx0aWYgKCRwPi41KVxuICAgICAgICAgICAgICAgICR4ID0gLSR4O1xuXHRyZXR1cm4gJHg7XG59XG5cbmZ1bmN0aW9uIF9zdWJ1cHJvYiAoJHgpIHtcblx0dmFyICRwID0gMDsgLyogaWYgKCRhYnN4ID4gMTAwKSAqL1xuXHR2YXIgJGFic3ggPSBNYXRoLmFicygkeCk7XG5cblx0aWYgKCRhYnN4IDwgMS45KSB7XG5cdFx0JHAgPSBNYXRoLnBvdygoMSArXG5cdFx0XHQkYWJzeCAqICguMDQ5ODY3MzQ3XG5cdFx0XHQgICsgJGFic3ggKiAoLjAyMTE0MTAwNjFcblx0XHRcdCAgXHQrICRhYnN4ICogKC4wMDMyNzc2MjYzXG5cdFx0XHRcdCAgKyAkYWJzeCAqICguMDAwMDM4MDAzNlxuXHRcdFx0XHRcdCsgJGFic3ggKiAoLjAwMDA0ODg5MDZcblx0XHRcdFx0XHQgICsgJGFic3ggKiAuMDAwMDA1MzgzKSkpKSkpLCAtMTYpLzI7XG5cdH0gZWxzZSBpZiAoJGFic3ggPD0gMTAwKSB7XG5cdFx0Zm9yICh2YXIgJGkgPSAxODsgJGkgPj0gMTsgJGktLSkge1xuXHRcdFx0JHAgPSAkaSAvICgkYWJzeCArICRwKTtcblx0XHR9XG5cdFx0JHAgPSBNYXRoLmV4cCgtLjUgKiAkYWJzeCAqICRhYnN4KSBcblx0XHRcdC8gTWF0aC5zcXJ0KDIgKiBNYXRoLlBJKSAvICgkYWJzeCArICRwKTtcblx0fVxuXG5cdGlmICgkeDwwKVxuICAgICAgICBcdCRwID0gMSAtICRwO1xuXHRyZXR1cm4gJHA7XG59XG5cbiAgIFxuZnVuY3Rpb24gX3N1YnQgKCRuLCAkcCkge1xuXG5cdGlmICgkcCA+PSAxIHx8ICRwIDw9IDApIHtcblx0XHR0aHJvdyhcIkludmFsaWQgcDogJHBcXG5cIik7XG5cdH1cblxuXHRpZiAoJHAgPT0gMC41KSB7XG5cdFx0cmV0dXJuIDA7XG5cdH0gZWxzZSBpZiAoJHAgPCAwLjUpIHtcblx0XHRyZXR1cm4gLSBfc3VidCgkbiwgMSAtICRwKTtcblx0fVxuXG5cdHZhciAkdSA9IF9zdWJ1KCRwKTtcblx0dmFyICR1MiA9IE1hdGgucG93KCR1LCAyKTtcblxuXHR2YXIgJGEgPSAoJHUyICsgMSkgLyA0O1xuXHR2YXIgJGIgPSAoKDUgKiAkdTIgKyAxNikgKiAkdTIgKyAzKSAvIDk2O1xuXHR2YXIgJGMgPSAoKCgzICogJHUyICsgMTkpICogJHUyICsgMTcpICogJHUyIC0gMTUpIC8gMzg0O1xuXHR2YXIgJGQgPSAoKCgoNzkgKiAkdTIgKyA3NzYpICogJHUyICsgMTQ4MikgKiAkdTIgLSAxOTIwKSAqICR1MiAtIDk0NSkgXG5cdFx0XHRcdC8gOTIxNjA7XG5cdHZhciAkZSA9ICgoKCgoMjcgKiAkdTIgKyAzMzkpICogJHUyICsgOTMwKSAqICR1MiAtIDE3ODIpICogJHUyIC0gNzY1KSAqICR1MlxuXHRcdFx0KyAxNzk1NSkgLyAzNjg2NDA7XG5cblx0dmFyICR4ID0gJHUgKiAoMSArICgkYSArICgkYiArICgkYyArICgkZCArICRlIC8gJG4pIC8gJG4pIC8gJG4pIC8gJG4pIC8gJG4pO1xuXG5cdGlmICgkbiA8PSBNYXRoLnBvdyhsb2cxMCgkcCksIDIpICsgMykge1xuXHRcdHZhciAkcm91bmQ7XG5cdFx0ZG8geyBcblx0XHRcdHZhciAkcDEgPSBfc3VidHByb2IoJG4sICR4KTtcblx0XHRcdHZhciAkbjEgPSAkbiArIDE7XG5cdFx0XHR2YXIgJGRlbHRhID0gKCRwMSAtICRwKSBcblx0XHRcdFx0LyBNYXRoLmV4cCgoJG4xICogTWF0aC5sb2coJG4xIC8gKCRuICsgJHggKiAkeCkpIFxuXHRcdFx0XHRcdCsgTWF0aC5sb2coJG4vJG4xLzIvTWF0aC5QSSkgLSAxIFxuXHRcdFx0XHRcdCsgKDEvJG4xIC0gMS8kbikgLyA2KSAvIDIpO1xuXHRcdFx0JHggKz0gJGRlbHRhO1xuXHRcdFx0JHJvdW5kID0gcm91bmRfdG9fcHJlY2lzaW9uKCRkZWx0YSwgTWF0aC5hYnMoaW50ZWdlcihsb2cxMChNYXRoLmFicygkeCkpLTQpKSk7XG5cdFx0fSB3aGlsZSAoKCR4KSAmJiAoJHJvdW5kICE9IDApKTtcblx0fVxuXHRyZXR1cm4gJHg7XG59XG5cbmZ1bmN0aW9uIF9zdWJ0cHJvYiAoJG4sICR4KSB7XG5cblx0dmFyICRhO1xuICAgICAgICB2YXIgJGI7XG5cdHZhciAkdyA9IE1hdGguYXRhbjIoJHggLyBNYXRoLnNxcnQoJG4pLCAxKTtcblx0dmFyICR6ID0gTWF0aC5wb3coTWF0aC5jb3MoJHcpLCAyKTtcblx0dmFyICR5ID0gMTtcblxuXHRmb3IgKHZhciAkaSA9ICRuLTI7ICRpID49IDI7ICRpIC09IDIpIHtcblx0XHQkeSA9IDEgKyAoJGktMSkgLyAkaSAqICR6ICogJHk7XG5cdH0gXG5cblx0aWYgKCRuICUgMiA9PSAwKSB7XG5cdFx0JGEgPSBNYXRoLnNpbigkdykvMjtcblx0XHQkYiA9IC41O1xuXHR9IGVsc2Uge1xuXHRcdCRhID0gKCRuID09IDEpID8gMCA6IE1hdGguc2luKCR3KSpNYXRoLmNvcygkdykvTWF0aC5QSTtcblx0XHQkYj0gLjUgKyAkdy9NYXRoLlBJO1xuXHR9XG5cdHJldHVybiBtYXgoMCwgMSAtICRiIC0gJGEgKiAkeSk7XG59XG5cbmZ1bmN0aW9uIF9zdWJmICgkbiwgJG0sICRwKSB7XG5cdHZhciAkeDtcblxuXHRpZiAoJHAgPj0gMSB8fCAkcCA8PSAwKSB7XG5cdFx0dGhyb3coXCJJbnZhbGlkIHA6ICRwXFxuXCIpO1xuXHR9XG5cblx0aWYgKCRwID09IDEpIHtcblx0XHQkeCA9IDA7XG5cdH0gZWxzZSBpZiAoJG0gPT0gMSkge1xuXHRcdCR4ID0gMSAvIE1hdGgucG93KF9zdWJ0KCRuLCAwLjUgLSAkcCAvIDIpLCAyKTtcblx0fSBlbHNlIGlmICgkbiA9PSAxKSB7XG5cdFx0JHggPSBNYXRoLnBvdyhfc3VidCgkbSwgJHAvMiksIDIpO1xuXHR9IGVsc2UgaWYgKCRtID09IDIpIHtcblx0XHR2YXIgJHUgPSBfc3ViY2hpc3FyKCRtLCAxIC0gJHApO1xuXHRcdHZhciAkYSA9ICRtIC0gMjtcblx0XHQkeCA9IDEgLyAoJHUgLyAkbSAqICgxICtcblx0XHRcdCgoJHUgLSAkYSkgLyAyICtcblx0XHRcdFx0KCgoNCAqICR1IC0gMTEgKiAkYSkgKiAkdSArICRhICogKDcgKiAkbSAtIDEwKSkgLyAyNCArXG5cdFx0XHRcdFx0KCgoMiAqICR1IC0gMTAgKiAkYSkgKiAkdSArICRhICogKDE3ICogJG0gLSAyNikpICogJHVcblx0XHRcdFx0XHRcdC0gJGEgKiAkYSAqICg5ICogJG0gLSA2KVxuXHRcdFx0XHRcdCkvNDgvJG5cblx0XHRcdFx0KS8kblxuXHRcdFx0KS8kbikpO1xuXHR9IGVsc2UgaWYgKCRuID4gJG0pIHtcblx0XHQkeCA9IDEgLyBfc3ViZjIoJG0sICRuLCAxIC0gJHApXG5cdH0gZWxzZSB7XG5cdFx0JHggPSBfc3ViZjIoJG4sICRtLCAkcClcblx0fVxuXHRyZXR1cm4gJHg7XG59XG5cbmZ1bmN0aW9uIF9zdWJmMiAoJG4sICRtLCAkcCkge1xuXHR2YXIgJHUgPSBfc3ViY2hpc3FyKCRuLCAkcCk7XG5cdHZhciAkbjIgPSAkbiAtIDI7XG5cdHZhciAkeCA9ICR1IC8gJG4gKiBcblx0XHQoMSArIFxuXHRcdFx0KCgkdSAtICRuMikgLyAyICsgXG5cdFx0XHRcdCgoKDQgKiAkdSAtIDExICogJG4yKSAqICR1ICsgJG4yICogKDcgKiAkbiAtIDEwKSkgLyAyNCArIFxuXHRcdFx0XHRcdCgoKDIgKiAkdSAtIDEwICogJG4yKSAqICR1ICsgJG4yICogKDE3ICogJG4gLSAyNikpICogJHUgXG5cdFx0XHRcdFx0XHQtICRuMiAqICRuMiAqICg5ICogJG4gLSA2KSkgLyA0OCAvICRtKSAvICRtKSAvICRtKTtcblx0dmFyICRkZWx0YTtcblx0ZG8ge1xuXHRcdHZhciAkeiA9IE1hdGguZXhwKFxuXHRcdFx0KCgkbiskbSkgKiBNYXRoLmxvZygoJG4rJG0pIC8gKCRuICogJHggKyAkbSkpIFxuXHRcdFx0XHQrICgkbiAtIDIpICogTWF0aC5sb2coJHgpXG5cdFx0XHRcdCsgTWF0aC5sb2coJG4gKiAkbSAvICgkbiskbSkpXG5cdFx0XHRcdC0gTWF0aC5sb2coNCAqIE1hdGguUEkpXG5cdFx0XHRcdC0gKDEvJG4gICsgMS8kbSAtIDEvKCRuKyRtKSkvNlxuXHRcdFx0KS8yKTtcblx0XHQkZGVsdGEgPSAoX3N1YmZwcm9iKCRuLCAkbSwgJHgpIC0gJHApIC8gJHo7XG5cdFx0JHggKz0gJGRlbHRhO1xuXHR9IHdoaWxlIChNYXRoLmFicygkZGVsdGEpPjNlLTQpO1xuXHRyZXR1cm4gJHg7XG59XG5cbmZ1bmN0aW9uIF9zdWJjaGlzcXIgKCRuLCAkcCkge1xuXHR2YXIgJHg7XG5cblx0aWYgKCgkcCA+IDEpIHx8ICgkcCA8PSAwKSkge1xuXHRcdHRocm93KFwiSW52YWxpZCBwOiAkcFxcblwiKTtcblx0fSBlbHNlIGlmICgkcCA9PSAxKXtcblx0XHQkeCA9IDA7XG5cdH0gZWxzZSBpZiAoJG4gPT0gMSkge1xuXHRcdCR4ID0gTWF0aC5wb3coX3N1YnUoJHAgLyAyKSwgMik7XG5cdH0gZWxzZSBpZiAoJG4gPT0gMikge1xuXHRcdCR4ID0gLTIgKiBNYXRoLmxvZygkcCk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyICR1ID0gX3N1YnUoJHApO1xuXHRcdHZhciAkdTIgPSAkdSAqICR1O1xuXG5cdFx0JHggPSBtYXgoMCwgJG4gKyBNYXRoLnNxcnQoMiAqICRuKSAqICR1IFxuXHRcdFx0KyAyLzMgKiAoJHUyIC0gMSlcblx0XHRcdCsgJHUgKiAoJHUyIC0gNykgLyA5IC8gTWF0aC5zcXJ0KDIgKiAkbilcblx0XHRcdC0gMi80MDUgLyAkbiAqICgkdTIgKiAoMyAqJHUyICsgNykgLSAxNikpO1xuXG5cdFx0aWYgKCRuIDw9IDEwMCkge1xuXHRcdFx0dmFyICR4MDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkcDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJHo7XG5cdFx0XHRkbyB7XG5cdFx0XHRcdCR4MCA9ICR4O1xuXHRcdFx0XHRpZiAoJHggPCAwKSB7XG5cdFx0XHRcdFx0JHAxID0gMTtcblx0XHRcdFx0fSBlbHNlIGlmICgkbj4xMDApIHtcblx0XHRcdFx0XHQkcDEgPSBfc3VidXByb2IoKE1hdGgucG93KCgkeCAvICRuKSwgKDEvMykpIC0gKDEgLSAyLzkvJG4pKVxuXHRcdFx0XHRcdFx0LyBNYXRoLnNxcnQoMi85LyRuKSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoJHg+NDAwKSB7XG5cdFx0XHRcdFx0JHAxID0gMDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YXIgJGkwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRhO1xuXHRcdFx0XHRcdGlmICgoJG4gJSAyKSAhPSAwKSB7XG5cdFx0XHRcdFx0XHQkcDEgPSAyICogX3N1YnVwcm9iKE1hdGguc3FydCgkeCkpO1xuXHRcdFx0XHRcdFx0JGEgPSBNYXRoLnNxcnQoMi9NYXRoLlBJKSAqIE1hdGguZXhwKC0keC8yKSAvIE1hdGguc3FydCgkeCk7XG5cdFx0XHRcdFx0XHQkaTAgPSAxO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkcDEgPSAkYSA9IE1hdGguZXhwKC0keC8yKTtcblx0XHRcdFx0XHRcdCRpMCA9IDI7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Zm9yICh2YXIgJGkgPSAkaTA7ICRpIDw9ICRuLTI7ICRpICs9IDIpIHtcblx0XHRcdFx0XHRcdCRhICo9ICR4IC8gJGk7XG5cdFx0XHRcdFx0XHQkcDEgKz0gJGE7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdCR6ID0gTWF0aC5leHAoKCgkbi0xKSAqIE1hdGgubG9nKCR4LyRuKSAtIE1hdGgubG9nKDQqTWF0aC5QSSokeCkgXG5cdFx0XHRcdFx0KyAkbiAtICR4IC0gMS8kbi82KSAvIDIpO1xuXHRcdFx0XHQkeCArPSAoJHAxIC0gJHApIC8gJHo7XG5cdFx0XHRcdCR4ID0gcm91bmRfdG9fcHJlY2lzaW9uKCR4LCA1KTtcblx0XHRcdH0gd2hpbGUgKCgkbiA8IDMxKSAmJiAoTWF0aC5hYnMoJHgwIC0gJHgpID4gMWUtNCkpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gJHg7XG59XG5cbmZ1bmN0aW9uIGxvZzEwICgkbikge1xuXHRyZXR1cm4gTWF0aC5sb2coJG4pIC8gTWF0aC5sb2coMTApO1xufVxuIFxuZnVuY3Rpb24gbWF4ICgpIHtcblx0dmFyICRtYXggPSBhcmd1bWVudHNbMF07XG5cdGZvciAodmFyICRpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICgkbWF4IDwgYXJndW1lbnRzWyRpXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICRtYXggPSBhcmd1bWVudHNbJGldO1xuXHR9XHRcblx0cmV0dXJuICRtYXg7XG59XG5cbmZ1bmN0aW9uIG1pbiAoKSB7XG5cdHZhciAkbWluID0gYXJndW1lbnRzWzBdO1xuXHRmb3IgKHZhciAkaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoJG1pbiA+IGFyZ3VtZW50c1skaV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAkbWluID0gYXJndW1lbnRzWyRpXTtcblx0fVxuXHRyZXR1cm4gJG1pbjtcbn1cblxuZnVuY3Rpb24gcHJlY2lzaW9uICgkeCkge1xuXHRyZXR1cm4gTWF0aC5hYnMoaW50ZWdlcihsb2cxMChNYXRoLmFicygkeCkpIC0gU0lHTklGSUNBTlQpKTtcbn1cblxuZnVuY3Rpb24gcHJlY2lzaW9uX3N0cmluZyAoJHgpIHtcblx0aWYgKCR4KSB7XG5cdFx0cmV0dXJuIHJvdW5kX3RvX3ByZWNpc2lvbigkeCwgcHJlY2lzaW9uKCR4KSk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIFwiMFwiO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJvdW5kX3RvX3ByZWNpc2lvbiAoJHgsICRwKSB7XG4gICAgICAgICR4ID0gJHggKiBNYXRoLnBvdygxMCwgJHApO1xuICAgICAgICAkeCA9IE1hdGgucm91bmQoJHgpO1xuICAgICAgICByZXR1cm4gJHggLyBNYXRoLnBvdygxMCwgJHApO1xufVxuXG5mdW5jdGlvbiBpbnRlZ2VyICgkaSkge1xuICAgICAgICBpZiAoJGkgPiAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKCRpKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwoJGkpO1xufSIsImltcG9ydCB7dGRpc3RyfSBmcm9tIFwiLi9zdGF0aXN0aWNzLWRpc3RyaWJ1dGlvbnNcIlxyXG5cclxudmFyIHN1ID0gbW9kdWxlLmV4cG9ydHMuU3RhdGlzdGljc1V0aWxzID17fTtcclxuc3Uuc2FtcGxlQ29ycmVsYXRpb24gPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy9zYW1wbGVfY29ycmVsYXRpb24nKTtcclxuc3UubGluZWFyUmVncmVzc2lvbiA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL2xpbmVhcl9yZWdyZXNzaW9uJyk7XHJcbnN1LmxpbmVhclJlZ3Jlc3Npb25MaW5lID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvbGluZWFyX3JlZ3Jlc3Npb25fbGluZScpO1xyXG5zdS5lcnJvckZ1bmN0aW9uID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvZXJyb3JfZnVuY3Rpb24nKTtcclxuc3Uuc3RhbmRhcmREZXZpYXRpb24gPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy9zdGFuZGFyZF9kZXZpYXRpb24nKTtcclxuc3Uuc2FtcGxlU3RhbmRhcmREZXZpYXRpb24gPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL3NpbXBsZS1zdGF0aXN0aWNzL3NyYy9zYW1wbGVfc3RhbmRhcmRfZGV2aWF0aW9uJyk7XHJcbnN1LnZhcmlhbmNlID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvdmFyaWFuY2UnKTtcclxuc3UubWVhbiA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvc2ltcGxlLXN0YXRpc3RpY3Mvc3JjL21lYW4nKTtcclxuc3UuelNjb3JlID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9zaW1wbGUtc3RhdGlzdGljcy9zcmMvel9zY29yZScpO1xyXG5zdS5zdGFuZGFyZEVycm9yPSBhcnIgPT4gTWF0aC5zcXJ0KHN1LnZhcmlhbmNlKGFycikvKGFyci5sZW5ndGgtMSkpO1xyXG5cclxuXHJcbnN1LnRWYWx1ZT0gKGRlZ3JlZXNPZkZyZWVkb20sIGNyaXRpY2FsUHJvYmFiaWxpdHkpID0+IHsgLy9hcyBpbiBodHRwOi8vc3RhdHRyZWsuY29tL29ubGluZS1jYWxjdWxhdG9yL3QtZGlzdHJpYnV0aW9uLmFzcHhcclxuICAgIHJldHVybiB0ZGlzdHIoZGVncmVlc09mRnJlZWRvbSwgY3JpdGljYWxQcm9iYWJpbGl0eSk7XHJcbn07IiwiZXhwb3J0IGNsYXNzIFV0aWxzIHtcclxuICAgIHN0YXRpYyBTUVJUXzIgPSAxLjQxNDIxMzU2MjM3O1xyXG4gICAgLy8gdXNhZ2UgZXhhbXBsZSBkZWVwRXh0ZW5kKHt9LCBvYmpBLCBvYmpCKTsgPT4gc2hvdWxkIHdvcmsgc2ltaWxhciB0byAkLmV4dGVuZCh0cnVlLCB7fSwgb2JqQSwgb2JqQik7XHJcbiAgICBzdGF0aWMgZGVlcEV4dGVuZChvdXQpIHtcclxuXHJcbiAgICAgICAgdmFyIHV0aWxzID0gdGhpcztcclxuICAgICAgICB2YXIgZW1wdHlPdXQgPSB7fTtcclxuXHJcblxyXG4gICAgICAgIGlmICghb3V0ICYmIGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIEFycmF5LmlzQXJyYXkoYXJndW1lbnRzWzFdKSkge1xyXG4gICAgICAgICAgICBvdXQgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb3V0ID0gb3V0IHx8IHt9O1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBpZiAoIXNvdXJjZSlcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5KG91dFtrZXldKTtcclxuICAgICAgICAgICAgICAgIHZhciBpc09iamVjdCA9IHV0aWxzLmlzT2JqZWN0KG91dFtrZXldKTtcclxuICAgICAgICAgICAgICAgIHZhciBzcmNPYmogPSB1dGlscy5pc09iamVjdChzb3VyY2Vba2V5XSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlzT2JqZWN0ICYmICFpc0FycmF5ICYmIHNyY09iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWxzLmRlZXBFeHRlbmQob3V0W2tleV0sIHNvdXJjZVtrZXldKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0W2tleV0gPSBzb3VyY2Vba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIG1lcmdlRGVlcCh0YXJnZXQsIHNvdXJjZSkge1xyXG4gICAgICAgIGxldCBvdXRwdXQgPSBPYmplY3QuYXNzaWduKHt9LCB0YXJnZXQpO1xyXG4gICAgICAgIGlmIChVdGlscy5pc09iamVjdE5vdEFycmF5KHRhcmdldCkgJiYgVXRpbHMuaXNPYmplY3ROb3RBcnJheShzb3VyY2UpKSB7XHJcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKFV0aWxzLmlzT2JqZWN0Tm90QXJyYXkoc291cmNlW2tleV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoa2V5IGluIHRhcmdldCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ob3V0cHV0LCB7W2tleV06IHNvdXJjZVtrZXldfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRba2V5XSA9IFV0aWxzLm1lcmdlRGVlcCh0YXJnZXRba2V5XSwgc291cmNlW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKG91dHB1dCwge1trZXldOiBzb3VyY2Vba2V5XX0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY3Jvc3MoYSwgYikge1xyXG4gICAgICAgIHZhciBjID0gW10sIG4gPSBhLmxlbmd0aCwgbSA9IGIubGVuZ3RoLCBpLCBqO1xyXG4gICAgICAgIGZvciAoaSA9IC0xOyArK2kgPCBuOykgZm9yIChqID0gLTE7ICsraiA8IG07KSBjLnB1c2goe3g6IGFbaV0sIGk6IGksIHk6IGJbal0sIGo6IGp9KTtcclxuICAgICAgICByZXR1cm4gYztcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGluZmVyVmFyaWFibGVzKGRhdGEsIGdyb3VwS2V5LCBpbmNsdWRlR3JvdXApIHtcclxuICAgICAgICB2YXIgcmVzID0gW107XHJcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHZhciBkID0gZGF0YVswXTtcclxuICAgICAgICAgICAgaWYgKGQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgcmVzID0gZC5tYXAoZnVuY3Rpb24gKHYsIGkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkID09PSAnb2JqZWN0Jykge1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZC5oYXNPd25Qcm9wZXJ0eShwcm9wKSkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKHByb3ApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghaW5jbHVkZUdyb3VwKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHJlcy5pbmRleE9mKGdyb3VwS2V5KTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHJlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXNcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGlzT2JqZWN0Tm90QXJyYXkoaXRlbSkge1xyXG4gICAgICAgIHJldHVybiAoaXRlbSAmJiB0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkoaXRlbSkgJiYgaXRlbSAhPT0gbnVsbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBpc09iamVjdChhKSB7XHJcbiAgICAgICAgcmV0dXJuIGEgIT09IG51bGwgJiYgdHlwZW9mIGEgPT09ICdvYmplY3QnO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgaXNOdW1iZXIoYSkge1xyXG4gICAgICAgIHJldHVybiAhaXNOYU4oYSkgJiYgdHlwZW9mIGEgPT09ICdudW1iZXInO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgaXNGdW5jdGlvbihhKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBhID09PSAnZnVuY3Rpb24nO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgaXNEYXRlKGEpe1xyXG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYSkgPT09ICdbb2JqZWN0IERhdGVdJ1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpc1N0cmluZyhhKXtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGEgPT09ICdzdHJpbmcnIHx8IGEgaW5zdGFuY2VvZiBTdHJpbmdcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaW5zZXJ0T3JBcHBlbmRTZWxlY3RvcihwYXJlbnQsIHNlbGVjdG9yLCBvcGVyYXRpb24sIGJlZm9yZSkge1xyXG4gICAgICAgIHZhciBzZWxlY3RvclBhcnRzID0gc2VsZWN0b3Iuc3BsaXQoLyhbXFwuXFwjXSkvKTtcclxuICAgICAgICB2YXIgZWxlbWVudCA9IHBhcmVudFtvcGVyYXRpb25dKHNlbGVjdG9yUGFydHMuc2hpZnQoKSwgYmVmb3JlKTsvL1wiOmZpcnN0LWNoaWxkXCJcclxuICAgICAgICB3aGlsZSAoc2VsZWN0b3JQYXJ0cy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxlY3Rvck1vZGlmaWVyID0gc2VsZWN0b3JQYXJ0cy5zaGlmdCgpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZWN0b3JJdGVtID0gc2VsZWN0b3JQYXJ0cy5zaGlmdCgpO1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0b3JNb2RpZmllciA9PT0gXCIuXCIpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LmNsYXNzZWQoc2VsZWN0b3JJdGVtLCB0cnVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxlY3Rvck1vZGlmaWVyID09PSBcIiNcIikge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQuYXR0cignaWQnLCBzZWxlY3Rvckl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpbnNlcnRTZWxlY3RvcihwYXJlbnQsIHNlbGVjdG9yLCBiZWZvcmUpIHtcclxuICAgICAgICByZXR1cm4gVXRpbHMuaW5zZXJ0T3JBcHBlbmRTZWxlY3RvcihwYXJlbnQsIHNlbGVjdG9yLCBcImluc2VydFwiLCBiZWZvcmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhcHBlbmRTZWxlY3RvcihwYXJlbnQsIHNlbGVjdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIFV0aWxzLmluc2VydE9yQXBwZW5kU2VsZWN0b3IocGFyZW50LCBzZWxlY3RvciwgXCJhcHBlbmRcIik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNlbGVjdE9yQXBwZW5kKHBhcmVudCwgc2VsZWN0b3IsIGVsZW1lbnQpIHtcclxuICAgICAgICB2YXIgc2VsZWN0aW9uID0gcGFyZW50LnNlbGVjdChzZWxlY3Rvcik7XHJcbiAgICAgICAgaWYgKHNlbGVjdGlvbi5lbXB0eSgpKSB7XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50LmFwcGVuZChlbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gVXRpbHMuYXBwZW5kU2VsZWN0b3IocGFyZW50LCBzZWxlY3Rvcik7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2VsZWN0aW9uO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgc2VsZWN0T3JJbnNlcnQocGFyZW50LCBzZWxlY3RvciwgYmVmb3JlKSB7XHJcbiAgICAgICAgdmFyIHNlbGVjdGlvbiA9IHBhcmVudC5zZWxlY3Qoc2VsZWN0b3IpO1xyXG4gICAgICAgIGlmIChzZWxlY3Rpb24uZW1wdHkoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gVXRpbHMuaW5zZXJ0U2VsZWN0b3IocGFyZW50LCBzZWxlY3RvciwgYmVmb3JlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNlbGVjdGlvbjtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGxpbmVhckdyYWRpZW50KHN2ZywgZ3JhZGllbnRJZCwgcmFuZ2UsIHgxLCB5MSwgeDIsIHkyKSB7XHJcbiAgICAgICAgdmFyIGRlZnMgPSBVdGlscy5zZWxlY3RPckFwcGVuZChzdmcsIFwiZGVmc1wiKTtcclxuICAgICAgICB2YXIgbGluZWFyR3JhZGllbnQgPSBkZWZzLmFwcGVuZChcImxpbmVhckdyYWRpZW50XCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgZ3JhZGllbnRJZCk7XHJcblxyXG4gICAgICAgIGxpbmVhckdyYWRpZW50XHJcbiAgICAgICAgICAgIC5hdHRyKFwieDFcIiwgeDEgKyBcIiVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ5MVwiLCB5MSArIFwiJVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcIngyXCIsIHgyICsgXCIlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieTJcIiwgeTIgKyBcIiVcIik7XHJcblxyXG4gICAgICAgIC8vQXBwZW5kIG11bHRpcGxlIGNvbG9yIHN0b3BzIGJ5IHVzaW5nIEQzJ3MgZGF0YS9lbnRlciBzdGVwXHJcbiAgICAgICAgdmFyIHN0b3BzID0gbGluZWFyR3JhZGllbnQuc2VsZWN0QWxsKFwic3RvcFwiKVxyXG4gICAgICAgICAgICAuZGF0YShyYW5nZSk7XHJcblxyXG4gICAgICAgIHN0b3BzLmVudGVyKCkuYXBwZW5kKFwic3RvcFwiKTtcclxuXHJcbiAgICAgICAgc3RvcHMuYXR0cihcIm9mZnNldFwiLCAoZCwgaSkgPT4gaSAvIChyYW5nZS5sZW5ndGggLSAxKSlcclxuICAgICAgICAgICAgLmF0dHIoXCJzdG9wLWNvbG9yXCIsIGQgPT4gZCk7XHJcblxyXG4gICAgICAgIHN0b3BzLmV4aXQoKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2FuaXRpemVIZWlnaHQgPSBmdW5jdGlvbiAoaGVpZ2h0LCBjb250YWluZXIpIHtcclxuICAgICAgICByZXR1cm4gKGhlaWdodCB8fCBwYXJzZUludChjb250YWluZXIuc3R5bGUoJ2hlaWdodCcpLCAxMCkgfHwgNDAwKTtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIHNhbml0aXplV2lkdGggPSBmdW5jdGlvbiAod2lkdGgsIGNvbnRhaW5lcikge1xyXG4gICAgICAgIHJldHVybiAod2lkdGggfHwgcGFyc2VJbnQoY29udGFpbmVyLnN0eWxlKCd3aWR0aCcpLCAxMCkgfHwgOTYwKTtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGF2YWlsYWJsZUhlaWdodCA9IGZ1bmN0aW9uIChoZWlnaHQsIGNvbnRhaW5lciwgbWFyZ2luKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KDAsIFV0aWxzLnNhbml0aXplSGVpZ2h0KGhlaWdodCwgY29udGFpbmVyKSAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tKTtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGF2YWlsYWJsZVdpZHRoID0gZnVuY3Rpb24gKHdpZHRoLCBjb250YWluZXIsIG1hcmdpbikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLm1heCgwLCBVdGlscy5zYW5pdGl6ZVdpZHRoKHdpZHRoLCBjb250YWluZXIpIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgZ3VpZCgpIHtcclxuICAgICAgICBmdW5jdGlvbiBzNCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKDEgKyBNYXRoLnJhbmRvbSgpKSAqIDB4MTAwMDApXHJcbiAgICAgICAgICAgICAgICAudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgICAgICAgICAuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHM0KCkgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArIHM0KCkgKyAnLScgK1xyXG4gICAgICAgICAgICBzNCgpICsgJy0nICsgczQoKSArIHM0KCkgKyBzNCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vcGxhY2VzIHRleHRTdHJpbmcgaW4gdGV4dE9iaiwgYWRkcyBhbiBlbGxpcHNpcyBpZiB0ZXh0IGNhbid0IGZpdCBpbiB3aWR0aFxyXG4gICAgc3RhdGljIHBsYWNlVGV4dFdpdGhFbGxpcHNpcyh0ZXh0RDNPYmosIHRleHRTdHJpbmcsIHdpZHRoKXtcclxuICAgICAgICB2YXIgdGV4dE9iaiA9IHRleHREM09iai5ub2RlKCk7XHJcbiAgICAgICAgdGV4dE9iai50ZXh0Q29udGVudD10ZXh0U3RyaW5nO1xyXG5cclxuICAgICAgICB2YXIgbWFyZ2luID0gMDtcclxuICAgICAgICB2YXIgZWxsaXBzaXNMZW5ndGggPSA5O1xyXG4gICAgICAgIC8vZWxsaXBzaXMgaXMgbmVlZGVkXHJcbiAgICAgICAgaWYgKHRleHRPYmouZ2V0Q29tcHV0ZWRUZXh0TGVuZ3RoKCk+d2lkdGgrbWFyZ2luKXtcclxuICAgICAgICAgICAgZm9yICh2YXIgeD10ZXh0U3RyaW5nLmxlbmd0aC0zO3g+MDt4LT0xKXtcclxuICAgICAgICAgICAgICAgIGlmICh0ZXh0T2JqLmdldFN1YlN0cmluZ0xlbmd0aCgwLHgpK2VsbGlwc2lzTGVuZ3RoPD13aWR0aCttYXJnaW4pe1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHRPYmoudGV4dENvbnRlbnQ9dGV4dFN0cmluZy5zdWJzdHJpbmcoMCx4KStcIi4uLlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRleHRPYmoudGV4dENvbnRlbnQ9XCIuLi5cIjsgLy9jYW4ndCBwbGFjZSBhdCBhbGxcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcGxhY2VUZXh0V2l0aEVsbGlwc2lzQW5kVG9vbHRpcCh0ZXh0RDNPYmosIHRleHRTdHJpbmcsIHdpZHRoLCB0b29sdGlwKXtcclxuICAgICAgICB2YXIgZWxsaXBzaXNQbGFjZWQgPSBVdGlscy5wbGFjZVRleHRXaXRoRWxsaXBzaXModGV4dEQzT2JqLCB0ZXh0U3RyaW5nLCB3aWR0aCk7XHJcbiAgICAgICAgaWYoZWxsaXBzaXNQbGFjZWQgJiYgdG9vbHRpcCl7XHJcbiAgICAgICAgICAgIHRleHREM09iai5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgdG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgLjkpO1xyXG4gICAgICAgICAgICAgICAgdG9vbHRpcC5odG1sKHRleHRTdHJpbmcpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwibGVmdFwiLCAoZDMuZXZlbnQucGFnZVggKyA1KSArIFwicHhcIilcclxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ0b3BcIiwgKGQzLmV2ZW50LnBhZ2VZIC0gMjgpICsgXCJweFwiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0ZXh0RDNPYmoub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgdG9vbHRpcC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldEZvbnRTaXplKGVsZW1lbnQpe1xyXG4gICAgICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwiZm9udC1zaXplXCIpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==
