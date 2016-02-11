"use strict";

(function(exports) {

    function blender(url) {
        if (url.charAt(0) == ":") url = url.substring(1);
        if (url.lastIndexOf("#") != -1) url = url.substring(0,url.lastIndexOf("#"));
        // if (!url) return;

        url = url || blender.home;

        // Is there a URL to load?
        if (!url) return window.dispatchEvent(new Event("hashload"));

        // If the url starts with _ use the raw source (Jekyll does not serve those dirs)
        // var local = (location.hostname == "localhost");
        if (url.charAt(0) == '_' || url.endsWith(".md")) url = "https://raw.githubusercontent.com"+blender.repo+"/"+blender.branch+blender.path+"/"+url;

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
            if (ct == "text/markdown" || url.endsWith(".md")) string = marked(string);

            var main = document.querySelector("main");
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
    blender.home = "_pages/home.html";
    blender.repo = "/acrodrig/acrodrig.github.io";
    blender.branch = "master";
    blender.path = "";

    // Init Code
    var script = document.querySelector("script[src*='blender.js']");
    var scriptHash =  (script && script.src.indexOf("#") != -1 ? script.src.substring(script.src.indexOf("#")+1) : "");

    if (scriptHash) {
        var repo = blender.repo = scriptHash;

        // Check if the path is included
        var fs = repo.indexOf("/", 1), ss = repo.indexOf("/", fs + 1);
        if (ss > 0) {
            blender.repo = repo.substring(0, ss);
            blender.path = repo.substring(ss);
        }
    }

    // On hash chnage either load or fix URL
    window.onhashchange = function(ev) {
        var urn = location.hash.substring(1);

        // Normal hash change
        if ((urn.charAt(0) || ":") == ":") blender(urn);
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
