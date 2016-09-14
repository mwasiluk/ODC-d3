import {Utils} from './utils'


export class ChartConfig {
    cssClassPrefix = "odc-";
    svgClass = this.cssClassPrefix + 'mw-d3-chart';
    width = undefined;
    height = undefined;
    margin = {
        left: 50,
        right: 30,
        top: 30,
        bottom: 50
    };
    showTooltip = false;
    transition = true;

    constructor(custom) {
        if (custom) {
            Utils.deepExtend(this, custom);
        }
    }


}

export class Chart {
    utils = Utils;
    baseContainer;
    svg;
    config;
    plot = {
        margin: {}
    };
    _attached = {};
    _layers = {};
    _events = {};
    _isAttached;
    _isInitialized=false;


    constructor(base, data, config) {
        
        this._isAttached = base instanceof Chart;

        this.baseContainer = base;

        this.setConfig(config);

        if (data) {
            this.setData(data);
        }

        this.init();
        this.postInit();
    }

    setConfig(config) {
        if (!config) {
            this.config = new ChartConfig();
        } else {
            this.config = config;
        }

        return this;
    }

    setData(data) {
        this.data = data;
        return this;
    }

    init() {
        var self = this;


        self.initPlot();
        self.initSvg();

        if(!this._isInitialized){
            self.initTooltip();
        }
        self.draw();
        this._isInitialized=true;
        return this;
    }

    postInit(){

    }

    initSvg() {
        var self = this;
        var config = this.config;

        var margin = self.plot.margin;
        var width = self.plot.width + margin.left + margin.right;
        var height = self.plot.height + margin.top + margin.bottom;
        var aspect = width / height;
        if(!self._isAttached){
            if(!this._isInitialized){
                d3.select(self.baseContainer).select("svg").remove();
            }
            self.svg = d3.select(self.baseContainer).selectOrAppend("svg");

            self.svg
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", "0 0 " + " " + width + " " + height)
                .attr("preserveAspectRatio", "xMidYMid meet")
                .attr("class", config.svgClass);
            self.svgG = self.svg.selectOrAppend("g.main-group");
        }else{
            console.log(self.baseContainer);
            self.svg = self.baseContainer.svg;
            self.svgG = self.svg.selectOrAppend("g.main-group."+config.svgClass)
        }

        self.svgG.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        if (!config.width || config.height) {
            d3.select(window)
                .on("resize", function () {
                    var transition = self.config.transition;
                    self.config.transition=false;
                    self.init();
                    self.config.transition = transition;
                });
        }
    }

    initTooltip(){
        var self = this;
        if (self.config.showTooltip) {
            if(!self._isAttached ){
                self.plot.tooltip = d3.select("body").selectOrAppend('div.'+self.config.cssClassPrefix+'tooltip')
                    .style("opacity", 0);
            }else{
                self.plot.tooltip= self.baseContainer.plot.tooltip;
            }

        }else{
            self.plot.tooltip = null;
        }
    }

    initPlot() {
        var margin = this.config.margin;
        this.plot = this.plot || {};
        this.plot.margin = {
            top: margin.top,
            bottom: margin.bottom,
            left: margin.left,
            right: margin.right
        };
    }

    update(data) {
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

    draw(data) {
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
    attach(attachmentName, chart) {
        if (arguments.length === 1) {
            return this._attached[attachmentName];
        }

        this._attached[attachmentName] = chart;
        return chart;
    };

    

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
    on(name, callback, context) {
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
    once(name, callback, context) {
        var self = this;
        var once = function () {
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

    off(name, callback, context) {
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
                if ((callback && callback === event.callback) ||
                    (context && context === event.context)) {
                    events.splice(j, 1);
                }
            }
        }

        return this;
    };

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
    trigger(name) {
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
    };
    getBaseContainer(){
        if(this._isAttached){
            return this.baseContainer.svg;
        }
        return d3.select(this.baseContainer);
    }

    getBaseContainerNode(){

        return this.getBaseContainer().node();
    }

    prefixClass(clazz, addDot){
        return addDot? '.': ''+this.config.cssClassPrefix+clazz;
    }
    computePlotSize() {
        this.plot.width = Utils.availableWidth(this.config.width, this.getBaseContainer(), this.plot.margin);
        this.plot.height = Utils.availableHeight(this.config.height, this.getBaseContainer(), this.plot.margin);
    }

    transitionEnabled(){
        return this._isInitialized && this.config.transition;
    }

    showTooltip(html){
        if(!this.plot.tooltip){
            return;
        }
        this.plot.tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        this.plot.tooltip.html(html)
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    }

    hideTooltip(){
        if(!this.plot.tooltip){
            return;
        }
        this.plot.tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    }
}
