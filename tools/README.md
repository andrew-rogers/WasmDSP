```
andrew@penguin:~/GITws/WasmDSP$ sudo apt install clang lld wabt
andrew@penguin:~/GITws/WasmDSP$ cd examples/
andrew@penguin:~/GITws/WasmDSP/examples$ clang++ --target=wasm32 -nostdlib add.cpp -Oz -c
andrew@penguin:~/GITws/WasmDSP/examples$ clang++ --target=wasm32 -nostdlib -Wl,--no-entry -Wl,--export-all add.o -Oz -o add.wasm
andrew@penguin:~/GITws/WasmDSP/examples$ wasm2wat add.wasm 
(module
  (type (;0;) (func))
  (type (;1;) (func (param i32 i32) (result i32)))
  (func $__wasm_call_ctors (type 0))
  (func $add (type 1) (param i32 i32) (result i32)
    local.get 0
    local.get 1
    i32.add
    i32.const 3
    i32.add)
  (table (;0;) 1 1 funcref)
  (memory (;0;) 2)
  (global (;0;) (mut i32) (i32.const 66560))
  (global (;1;) i32 (i32.const 1024))
  (global (;2;) i32 (i32.const 1024))
  (global (;3;) i32 (i32.const 1024))
  (global (;4;) i32 (i32.const 66560))
  (global (;5;) i32 (i32.const 0))
  (global (;6;) i32 (i32.const 1))
  (export "memory" (memory 0))
  (export "__wasm_call_ctors" (func $__wasm_call_ctors))
  (export "add" (func $add))
  (export "__dso_handle" (global 1))
  (export "__data_end" (global 2))
  (export "__global_base" (global 3))
  (export "__heap_base" (global 4))
  (export "__memory_base" (global 5))
  (export "__table_base" (global 6)))
```
  
```
andrew@penguin:~/GITws/WasmDSP/examples$ base64 add.wasm 
AGFzbQEAAAABCgJgAABgAn9/AX8DAwIAAQQFAXABAQEFAwEAAgYrB38BQYCIBAt/AEGACAt/AEGA
CAt/AEGACAt/AEGAiAQLfwBBAAt/AEEBCwd9CQZtZW1vcnkCABFfX3dhc21fY2FsbF9jdG9ycwAA
A2FkZAABDF9fZHNvX2hhbmRsZQMBCl9fZGF0YV9lbmQDAg1fX2dsb2JhbF9iYXNlAwMLX19oZWFw
X2Jhc2UDBA1fX21lbW9yeV9iYXNlAwUMX190YWJsZV9iYXNlAwYKDwICAAsKACAAIAFqQQNqCwAg
BG5hbWUBGQIAEV9fd2FzbV9jYWxsX2N0b3JzAQNhZGQALwlwcm9kdWNlcnMBDHByb2Nlc3NlZC1i
eQEMRGViaWFuIGNsYW5nCDExLjAuMS0y
```
