"use strict";

(function(exports) {

    function blender(url) {
        if (url.charAt(0) == ":") url = url.substring(1);
        if (url.lastIndexOf("#") != -1) url = url.substring(0,url.lastIndexOf("#"));

        // Is there a default document?
        url = url || blender.index;

        var main = document.querySelector("main"), ev;
        document.body.setAttribute("layout", "default");

        // Reset meta variable
        window.meta = {};

        // Is there a URL to load?
        if (!url) {
            if (main) main.innerHTML = "";
            return window.dispatchEvent(createEvent("hashload"));
        }

        // If the url starts with _ use the raw source (Jekyll does not serve those dirs)
        if (!blender.relative && url.charAt(0)) url = "https://raw.githubusercontent.com"+blender.repo+"/"+blender.branch+blender.path+"/"+url;

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function(ev) {
            // Remove front matter
            var string = xhr.responseText, frontMatter = "";
            // console.log("SEARCH: ", string.search(/^<?[-!]--([^]+?)--[->]$/m));

            // ACR@1016-02-18: Has to replace `[^]` as match to every character for `[\s\S]` as the first would not work on IE
            string = string.replace(/^<?[-!]--([\s\S]+?)--[->]$/m, function(m,g) { frontMatter = g; return ""; });

            // Parse `frontMatter` into `meta`
            window.meta = parseMeta(frontMatter, url);

            // Should process markdown
            var ct = xhr.getResponseHeader("Content-Type");
            if ((ct == "text/markdown" || url.slice(-3) == ".md") && marked) string = marked(string);

            if (main) main.innerHTML = string;

            // Evaluate scripts
            var scripts = main.getElementsByTagName("script");
            for (var i = 0; i < scripts.length; i++) {
                // We do not do a try/catch on purpose so that errors percolate
                // try { eval(scripts[i].innerHTML); } catch (ex) { console.log(url, "\n", ex); }
                eval(scripts[i].innerHTML);
            }

            // Set layout
            document.body.setAttribute("layout", window.meta.layout || "default");

            // Dispatch 'hashload' event to have the plugins re-render
            window.dispatchEvent(createEvent("hashload"));
        };
        xhr.send(null);
    }

    function parseMeta(frontMatter, url) {
        if (!frontMatter) return {};
        var meta = {};
        frontMatter.replace(/(\w+)\s*:\s*["']?(.+)/g, function(m,g1,g2) { meta[g1] = g2.trim().replace(/['"]$/, ""); });
        if (meta.tags) meta.tags = meta.tags.split(',');
        if (!meta.date) meta.date = (url.substring(url.lastIndexOf("/")+1, url.lastIndexOf("/")+11)) || new Date();
        return meta;
    }

    function createEvent(type) {
        // Per http://stackoverflow.com/questions/20956964/detect-working-customevent-constructor
        if (typeof(CustomEvent) === "function") return new CustomEvent(type);
        var ev = document.createEvent("Event");
        ev.initEvent(type, true, false);
        return ev;
    }

    // Defaults
    var script = document.querySelector("script[src*='blender']") || document.createElement("script");
    blender.repo = script.getAttribute("repo") || "/acrodrig/acrodrig.github.io";
    blender.branch = script.getAttribute("branch") || "master";
    blender.path = script.getAttribute("path") || "";
    blender.index = script.getAttribute("index") || "";
    blender.relative = script.hasAttribute("relative");
    // blender.path = null;

    // On hash chnage either load or fix URL
    window.onhashchange = function(ev) {
        var hash = location.hash.substring(1);

        // Only call this function once per hash change!
        // if (hash == blender.path) return;
        // blender.path = hash;

        // Normal hash change
        if ((hash.charAt(0) || ":") == ":") {
            blender(hash);
        }
        else {
            var url = ev.oldURL, lh = url.lastIndexOf("#");
            if (lh != -1 && url.charAt(lh+1) != ":") url = url.substring(0, lh);
            history.replaceState({}, "", url+"#"+hash);
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
