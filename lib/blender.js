"use strict";

(function(exports) {

    function blender(url) {
        if (url.charAt(0) == ":") url = url.substring(1);
        if (url.lastIndexOf("#") != -1) url = url.substring(0,url.lastIndexOf("#"));

        // Is there a default document?
        url = url || blender.index;

        var main = document.querySelector("main");

        // Is there a URL to load?
        if (!url) {
            if (main) main.innerHTML = "";
            return window.dispatchEvent(new Event("hashload"));
        }

        // If the url starts with _ use the raw source (Jekyll does not serve those dirs)
        var process = (url.charAt(0) == '_' || url.endsWith(".md"));
        if (!blender.relative && process) url = "https://raw.githubusercontent.com"+blender.repo+"/"+blender.branch+blender.path+"/"+url;

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function(ev) {
            // Remove front matter
            var string = xhr.responseText, fm = "";
            string = string.replace(/^<?[-!]--([^]+?)--[->]$/m, function(m,g) { fm = g; return ""; });

            // Store front matter
            var info = document.info = fm ? { wordCount: 0 } : null;
            if (fm) fm.replace(/(\w+)\s*:\s*["']?(.+)/g, function(m,g1,g2) { info[g1] = g2.trim().replace(/['"]$/, ""); });
            if (info && info.tags) info.tags = info.tags.split(',');
            if (info && !info.date) info.date = (url.substring(url.lastIndexOf("/")+1, url.lastIndexOf("/")+11)) || new Date();

            // console.log(info);

            // Should process markdown
            var ct = xhr.getResponseHeader("Content-Type");
            if (ct == "text/markdown" || url.endsWith(".md") && marked) string = marked(string);

            if (main) main.innerHTML = string;

            // Evaluate scripts
            var scripts = main.getElementsByTagName("script");
            for (var i = 0; i < scripts.length; i++) {
                try { eval(scripts[i].innerHTML); }
                catch (ex) { console.log(url, "\n", ex); }
            }

            // Dispatch 'hashload' event to have the plugins re-render
            window.dispatchEvent(new Event("hashload"));
        };
        xhr.send(null);
    }

    // Defaults
    var script = document.querySelector("script[src*='blender']") || document.createElement("script");
    blender.repo = script.getAttribute("repo") || "/acrodrig/acrodrig.github.io";
    blender.branch = script.getAttribute("branch") || "master";
    blender.path = script.getAttribute("path") || "";
    blender.index = script.getAttribute("index") || "";
    blender.relative = script.hasAttribute("relative");

    // On hash chnage either load or fix URL
    window.onhashchange = function(ev) {
        var urn = location.hash.substring(1);

        // Normal hash change
        if ((urn.charAt(0) || ":") == ":") {
            blender(urn);
        }
        else {
            var url = ev.oldURL, lh = url.lastIndexOf("#");
            if (lh != -1 && url.charAt(lh+1) != ":") url = url.substring(0, lh);
            history.replaceState({}, "", url+"#"+urn);
        }
    };

    document.addEventListener("DOMContentLoaded", window.onhashchange);

    // If lodash is defined, augment and defined template settings
    if (typeof(_) != "undefined") {
        _.templateSettings.evaluate    = /{%([\s\S]+?)%}/g;
        _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

        _.render = function(elem, data) {
            if (!elem) return;
            elem.originalInnerHTML = elem.originalInnerHTML || elem.innerHTML;
            var template = _.template(_.unescape(elem.originalInnerHTML));
            elem.innerHTML = template(data);
        };
    }

    if (typeof(window) != "undefined") window.blender = blender;
    if (typeof(module) != "undefined") module.exports = blender;

})(typeof(exports) == "undefined" ? this["blender"] = { } : exports);
