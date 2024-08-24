/**
 *
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2024  Andrew Rogers
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

import {WasmModule} from './WasmModule.mjs'

export {WasmModule}

export function initialise(modules, callback) {
	let wasm_cnt = 0;
	let wasm_done = 0;
	for (let k in modules) {
		let module = modules[k];
		if (module.b64) {
			wasm_cnt++;
			module.wasm = new WasmModule();
			module.wasm.initialise(module, function(){
				wasm_done++;
				if (module.onWasm) module.onWasm(module.wasm);
		        if (wasm_done >= wasm_cnt) callback();
			});
		}
	}
}

export function importModules(urls) {
    return new Promise(function(resolve, reject){
        let cnt = 0;
        callback = function() {
            resolve();
        };
        for (var i=0; i<urls.length; i++) {
            var script = document.createElement('script');
            script.setAttribute('src', urls[i]);
            script.setAttribute('type', 'text/javascript');
            script.onload = function() {
                cnt++;
                if (cnt == urls.length) {
                    wasmCheck();
                }
            };
            document.head.appendChild(script);
        }
    });
}

let callback = null;
let wasm_cnt = 0;
let wasm_done = 0;

function wasmCheck() {
    if (wasm_done >= wasm_cnt) {
        if (callback) callback();
    }
}
