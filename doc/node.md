Running WebAssembly in Node.js
==============================

Adapted from details found [here](https://nodejs.org/en/learn/getting-started/nodejs-with-webassembly).

Create an example C++ file 'add.cpp' with the following content.

```
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
extern "C" float add(float a, float b)
{
    return a+b;
}
```

This can be compiled to webassembly using the following.

```
$ em++ --no-entry -Oz add.cpp -o add.wasm
```

Create a javascirpt file 'add.js' that will run in node.js and instatiate the webassembly module.

```
const fs = require('node:fs');
const wasmBuffer = fs.readFileSync('add.wasm');
WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  const { add } = wasmModule.instance.exports;
  const sum = add(56.1, 67.3);
  console.log(sum); // Outputs: 123.4
});
```

Run this in node.

```
$ node add.js
```
