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
			module.wasm.initialise(module.b64, function(){
				wasm_done++;
				if (module.onWasm) module.onWasm(module.wasm);
		        if (wasm_done >= wasm_cnt) callback();
			});
		}
	}
}

export function compileWasm(b64) {
    wasm_cnt++;
    return new Promise(function(resolve, reject) {
        let module = {};
        createImports(module);
        let binary = Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer;
        WebAssembly.instantiate(binary, module.imports)
        .then((result) => {
            module.exports = result.instance.exports;

            // Initialise the wasm.
            module.exports._initialize();
            resolve(module);
            wasm_done++;
            wasmCheck();
        })
        .catch((e) => {
            reject(e);
        });
    });
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

function createImports(module) {
    var env = {};
    var wsp = {};

    wsp.fd_close = function() {
        console.log("Not yet implemented");
    };

    wsp.fd_write = function() {
        console.log("Not yet implemented");
    };

    wsp.fd_seek = function() {
        console.log("Not yet implemented");
    };

    wsp.proc_exit = function() {
        console.log("Not yet implemented");
    };

    module.imports = {env: env, wasi_snapshot_preview1: wsp};
}

function wasmCheck() {
    if (wasm_done >= wasm_cnt) {
        if (callback) callback();
    }
}
