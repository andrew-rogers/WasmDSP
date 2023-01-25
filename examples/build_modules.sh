#!/bin/sh

emcc side.c -sWASM=1 -sSIDE_MODULE=1 -o side.so
#emcc main.c -sWASM=1 -sMAIN_MODULE=1 -o main.html --preload-file side.so
emcc main.c -sWASM=1 -sMAIN_MODULE=1 -o main.html --preload-file side.so --use-preload-plugins

