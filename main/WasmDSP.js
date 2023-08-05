export function compileWasm(b64) {
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
        })
        .catch((e) => {
            reject(e);
        });
    });
}

export function importModules(urls) {
    return new Promise(function(resolve, reject){
        let cnt = 0;
        for (var i=0; i<urls.length; i++) {
            var script = document.createElement('script');
            script.setAttribute('src', urls[i]);
            script.setAttribute('type', 'text/javascript');
            script.onload = function() {
                cnt++;
                if (cnt == urls.length) {
                    resolve();
                }
            };
            document.head.appendChild(script);
        }
    });
}

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
