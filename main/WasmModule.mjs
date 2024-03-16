/**
 *
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2022,2023  Andrew Rogers
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

var WasmModule = function() {
    this.arrays = {};
    this.array_list = [];
    this.module = {};
    this._createImports();
    this.handlers = {};
};

WasmModule.prototype.addHandler = function(ptr, func) {
    const key = 's' + ptr;
    this.handlers[key] = func;
};

WasmModule.prototype.addImports = function(imports) {
    let env = this.module.imports.env;
    for (let i in imports) {
        env[i] = imports[i];
    }
};

WasmModule.prototype.callCFunc = function( func_name ) {
    console.log("Wasm not initialised."); // Re-defined in initialise().
};

WasmModule.prototype.cfunc = function( func_name ) {
    console.log("Wasm not initialised."); // Re-defined in initialise().
};

WasmModule.prototype.initialise = function (binary, postInit) {

    if (typeof binary === 'string') {
        // Convert base64 into binary
        binary = Uint8Array.from(atob(binary), c => c.charCodeAt(0)).buffer;
    }

    // Re-assign the C function lookup function.
    var mod = this.module;
    this.cfunc = function (func_name) {
        return mod.exports[func_name];
    };
    this.callCFunc = function (func_name) {
        var func = mod.exports[func_name];
        func();
    }

    // Instantiate the wasm.
    var that = this;
    WebAssembly.instantiate(binary, mod.imports)
    .then((result) => {
        mod.exports = result.instance.exports;

        // Typed array representations for memory.
        that.setMemory(mod.exports.memory.buffer);

        // Initialise the wasm.
        mod.exports._initialize();
        that.exports = mod.exports;
        if (postInit) postInit();
    });
};

WasmModule.prototype.read = function( type, address, num ) {
    var mem = this.module.mem[type];
    var index = address >> mem.address_shift;
    return Array.from(mem.buf.slice(index, index + num));
};

WasmModule.prototype.readString = function( cstr ) {
    var heap = this.module.memUint8;
    var str = "";
    if (cstr==0) return "";
    var i = cstr;
    while (heap[i] > 0) str += String.fromCharCode(heap[i++]);
    return str
};

WasmModule.prototype.setMemory = function(buffer) {
    var mod = this.module;
    mod.memFloat32 = new Float32Array(buffer);
    mod.memFloat64 = new Float64Array(buffer);
    mod.memInt32   = new Int32Array  (buffer);
    mod.memUint8   = new Uint8Array  (buffer);
    mod.memUint32  = new Uint32Array (buffer);

    mod.mem = {
        F32: {buf: mod.memFloat32, address_shift: 2},
        F64: {buf: mod.memFloat64, address_shift: 3},
        S32: {buf: mod.memInt32,   address_shift: 2},
        U8:  {buf: mod.memUint8,   address_shift: 0},
        U32: {buf: mod.memUint32,  address_shift: 2}
    };
};

WasmModule.prototype.write = function( type, arr, address ) {
    var mem = this.module.mem[type];
    var index = address >> mem.address_shift;
    mem.buf.set( arr, index );
};

WasmModule.prototype.writeString = function( string, address ) {
    var index = address;
    var mem = this.module.memUint8;
    for (var i = 0; i < string.length; i++) {
        mem[index++] = string.charCodeAt(i);
    }
    mem[index] = 0; // C strings are null terminated.
};

WasmModule.prototype._createImports = function() {
    var env = {};
    var that = this;

    env.emjs_event = function( mediator, sender, id ) {
        that._handleEvent(mediator, sender, id);
    };

    env.jsArrayOpen = function( utf8_name ) {
        const name = that.readString(utf8_name);
        that.arrays[name] = that.arrays[name] || [];
        that.array_list.push(that.arrays[name]);
        return that.array_list.length - 1;
    };

    env.jsArrayWrite = function( id, ptr, cnt) {
        const vals = that.read('F32', ptr, cnt);
        that.array_list[id].push(...vals);
    };

    env.jsEval = function( utf8_src ) {
        const f = Function(that.readString(utf8_src));
        f();
    };

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

    this.module.imports = {env: env, wasi_snapshot_preview1: wsp};
};

WasmModule.prototype._handleEvent = function(sender, id) {
	let key = 's' + sender;
	this.handlers[key](id);
};

export {WasmModule}

