#include <stdio.h>

// Chrome won't allow synchronous wasm compile when larger than 4kB
#define SIZE 2000
char dummy[SIZE] = {};

void greet(const char* name)
{
    printf("Side says hello %s!\n", name);
}

