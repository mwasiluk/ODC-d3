export class Utils {
    // usage example deepExtend({}, objA, objB); => should work similar to $.extend(true, {}, objA, objB);
    static deepExtend(out) {

        var utils = this;
        var emptyOut = {};


        if (!out && arguments.length > 1 && Array.isArray(arguments[1])) {
            out = [];
        }
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            if (!source)
                continue;

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
    };

    static mergeDeep(target, source) {
        let output = Object.assign({}, target);
        if (Utils.isObjectNotArray(target) && Utils.isObjectNotArray(source)) {
            Object.keys(source).forEach(key => {
                if (Utils.isObjectNotArray(source[key])) {
                    if (!(key in target))
                        Object.assign(output, { [key]: source[key] });
                    else
                        output[key] = Utils.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    }

    static cross(a, b) {
        var c = [], n = a.length, m = b.length, i, j;
        for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
        return c;
    };

    static inferVariables(data, groupKey, includeGroup) {
        var res = [];
        if (data.length) {
            var d = data[0];
            if (d instanceof Array) {
                res=  d.map(function (v, i) {
                    return i;
                });
            }else if (typeof d === 'object'){

                for (var prop in d) {
                    if(!d.hasOwnProperty(prop)) continue;

                    res.push(prop);
                }
            }
        }
        if(!includeGroup){
            var index = res.indexOf(groupKey);
            if (index > -1) {
                res.splice(index, 1);
            }
        }
        return res
    };
    static isObjectNotArray(item) {
        return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
    };
    static isObject(a) {
        return a !== null && typeof a === 'object';
    };

    static isNumber(a) {
        return !isNaN(a) && typeof a === 'number';
    };

    static isFunction(a) {
        return typeof a === 'function';
    };

    static selectOrAppend(parent, selector, element) {
        var selection = parent.select(selector);
        if(selection.empty()){
            return parent.append(element || selector);
        }
        return selection;
    };
}
