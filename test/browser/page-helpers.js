// Loaded into the harness page after the bundle; exposed as window.__odc.
(function () {
    var GUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;

    // guids: optional map guid -> GUID_n (numbered by first appearance), so
    // that relations between ids and references survive the normalization
    function roundNumbers(value, guids) {
        if (guids) {
            value = value.replace(GUID, function (g) {
                if (!guids.has(g)) {
                    guids.set(g, 'GUID_' + (guids.size + 1));
                }
                return guids.get(g);
            });
        }
        return value.replace(/-?\d+\.\d+(e[-+]?\d+)?/g, function (n) {
            var r = Math.round(parseFloat(n) * 1000) / 1000;
            return String(Object.is(r, -0) ? 0 : r);
        });
    }

    // Normalized, deterministic text form of an SVG subtree: one line per
    // element with sorted attributes, numbers rounded to 3 decimals and
    // random guids replaced by GUID_1, GUID_2, ... in order of appearance.
    // Used for characterization snapshots.
    function serialize(node, depth, guids) {
        depth = depth || 0;
        guids = guids || new Map();
        var attrs = Array.prototype.slice.call(node.attributes)
            .map(function (a) {
                return a.name + '="' + roundNumbers(a.value, guids) + '"';
            })
            .sort();
        var own = Array.prototype.filter.call(node.childNodes, function (n) {
            return n.nodeType === 3 && n.textContent.trim();
        }).map(function (n) {
            return n.textContent.trim();
        }).join(' ');
        var line = new Array(depth + 1).join('  ') + node.tagName.toLowerCase()
            + (attrs.length ? ' ' + attrs.join(' ') : '')
            + (own ? ' | ' + roundNumbers(own, guids) : '');
        var children = Array.prototype.filter.call(node.childNodes, function (n) {
            return n.nodeType === 1;
        }).map(function (n) {
            return serialize(n, depth + 1, guids);
        });
        return [line].concat(children).join('\n');
    }

    function container(id) {
        var el = document.getElementById(id || 'c1');
        return el;
    }

    var REF = /url\(\s*["']?#([^"')\s]+)["']?\s*\)/g;

    // All in-document references (url(#id) in attributes/inline style,
    // href="#id") made by elements inside the container's svg.
    function references(id) {
        var svg = container(id).querySelector('svg');
        var out = [];
        if (!svg) {
            return out;
        }
        [svg].concat(Array.prototype.slice.call(svg.querySelectorAll('*'))).forEach(function (el) {
            Array.prototype.forEach.call(el.attributes, function (a) {
                var m, targets = [];
                REF.lastIndex = 0;
                while ((m = REF.exec(a.value))) {
                    targets.push(m[1]);
                }
                if ((a.name === 'href' || a.name === 'xlink:href') && a.value.charAt(0) === '#') {
                    targets.push(a.value.slice(1));
                }
                targets.forEach(function (t) {
                    var target = document.getElementById(t);
                    out.push({
                        from: el.tagName.toLowerCase() + '@' + a.name,
                        id: t,
                        exists: !!target,
                        inSameSvg: !!target && svg.contains(target)
                    });
                });
            });
        });
        return out;
    }

    window.__odc = {
        references: references,
        // ids that occur more than once in the whole document
        duplicateIds: function () {
            var seen = {}, dup = [];
            Array.prototype.forEach.call(document.querySelectorAll('[id]'), function (el) {
                if (seen[el.id] && dup.indexOf(el.id) < 0) {
                    dup.push(el.id);
                }
                seen[el.id] = true;
            });
            return dup;
        },
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
