// Loaded into the harness page after the bundle; exposed as window.__odc.
(function () {
    var GUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;

    function roundNumbers(value) {
        return value.replace(GUID, 'GUID').replace(/-?\d+\.\d+(e[-+]?\d+)?/g, function (n) {
            var r = Math.round(parseFloat(n) * 1000) / 1000;
            return String(Object.is(r, -0) ? 0 : r);
        });
    }

    // Normalized, deterministic text form of an SVG subtree: one line per
    // element with sorted attributes, numbers rounded to 3 decimals and
    // random guids replaced. Used for characterization snapshots.
    function serialize(node, depth) {
        depth = depth || 0;
        var attrs = Array.prototype.slice.call(node.attributes)
            .map(function (a) {
                return a.name + '="' + roundNumbers(a.value) + '"';
            })
            .sort();
        var own = Array.prototype.filter.call(node.childNodes, function (n) {
            return n.nodeType === 3 && n.textContent.trim();
        }).map(function (n) {
            return n.textContent.trim();
        }).join(' ');
        var line = new Array(depth + 1).join('  ') + node.tagName.toLowerCase()
            + (attrs.length ? ' ' + attrs.join(' ') : '')
            + (own ? ' | ' + roundNumbers(own) : '');
        var children = Array.prototype.filter.call(node.childNodes, function (n) {
            return n.nodeType === 1;
        }).map(function (n) {
            return serialize(n, depth + 1);
        });
        return [line].concat(children).join('\n');
    }

    function container(id) {
        var el = document.getElementById(id || 'c1');
        return el;
    }

    window.__odc = {
        serialize: function (id) {
            var svg = container(id).querySelector('svg');
            return svg ? serialize(svg) : null;
        },
        count: function (selector, id) {
            return container(id).querySelectorAll(selector).length;
        },
        data: function (selector, id) {
            return Array.prototype.map.call(container(id).querySelectorAll(selector), function (n) {
                return n.__data__;
            });
        },
        attrs: function (selector, names, id) {
            return Array.prototype.map.call(container(id).querySelectorAll(selector), function (n) {
                return names.map(function (a) {
                    var v = n.getAttribute(a);
                    return v === null ? null : roundNumbers(v);
                });
            });
        },
        reset: function () {
            ['c1', 'c2'].forEach(function (id) {
                container(id).innerHTML = '';
            });
        }
    };
})();
