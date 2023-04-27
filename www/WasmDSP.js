/**
 *
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2023  Andrew Rogers
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */

// http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html

var WasmDSP = WasmDSP || {};

var WasmDSP = (function (my) {
    var generators = [];
    var paused = 0;
    var pm = postMessage; // The postMessage function is overridden below, keep reference to original.
    var queue = [];

    // Message generators are called after the user code is evaluated to allow results to be finalised.
    my.addMessageGenerator = function (gen) {
        generators.push(gen);
    };

    my.fetchScriptFE = function(url) {
        my.pause();
        var obj = {};
        queue.push(obj); // Push empty object on queue, add elements later.

        async function load() {
            const response = await fetch(url);
            const js = await response.text();
            var html = `<script type="text/javascript">${js}</script>`;
            obj.bundle = {"data":{"text/html":html},"metadata":{}};
            obj.type = "display_data";
            my.resume();
        }
        load();
    };

    my.loadModule = function (name) {
        my.js_files_dir = my.js_files_dir || "http://some-default-url.there/";
        importScripts(my.js_files_dir + "/" + name + ".js");
        return my[name];
    };

    my.pause = function () {
        paused += 1;
    };

    my.postHTML = function (html) {
        var obj = {"bundle":{"data":{"text/html":html},"metadata":{}},"type":"display_data"};
        postMessage(obj);
    };

    my.postJS = function (js) {
        var html = `<script type="text/javascript">${js}</script>`;
        var obj = {"bundle":{"data":{"text/html":html},"metadata":{}},"type":"display_data"};
        pm(obj);
    }

    my.resume = function () {
        paused -= 1;
        if (paused == 0) {
            while (queue.length > 0) {
                var obj = queue.shift();
                postMessage(obj);
            }
        }
    };

    // Override the global postMessage function so the registered message generators can post their own messages.
    postMessage = function(obj) {
        if (paused) {
            queue.push(obj);
        }
        else {
            if (obj.type === "execute_result") {
                for (var i=0; i < generators.length; i++) {
                    generators[i]();
                }
            }
            pm(obj);
        }
    };

    return my;
}(WasmDSP));

