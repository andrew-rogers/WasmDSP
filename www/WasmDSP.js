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

var WasmDSP = (function (my) {
	var my = {};
	var generators = [];

	my.addMessageGenerator = function (gen) {
	    if (generators.length == 0) overridePostMessage()
		generators.push( gen )
	};
	
	my.postHTML = function (html) {
	    var obj = {"bundle":{"data":{"text/html":html},"metadata":{}},"type":"display_data"};
	    postMessage(obj);
	};

	function callGenerators() {
	    for (var i=0; i < generators.length; i++) {
	        generators[i]();
	    }
	}

	function overridePostMessage() {
	    // Override the global postMessage function so the registered message generators can post their own messages.
	    var pm = postMessage;
        postMessage = function(obj) {
            if (obj.type === "execute_result") callGenerators();
            pm(obj);
        };
	}

	return my;
}());

