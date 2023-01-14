#include <stdio.h>
#include <stdlib.h>
#include <dlfcn.h>

int main()
{
    void *handle;
    void (*greet)(const char*);
    
    printf("Main says hello!\n");

    handle = dlopen("./side.wasm", RTLD_LAZY);
    
    if (!handle) {
        /* fail to load the side module */
        fprintf(stderr, "Error: %s\n", dlerror());
        return EXIT_FAILURE;
    }

    *(void**)(&greet) = dlsym(handle, "greet");
    if (!greet) {
        /* Not found */
        fprintf(stderr, "Error: %s\n", dlerror());
        dlclose(handle);
        return EXIT_FAILURE;
    }

    greet("Doc");
    dlclose(handle);

    return EXIT_SUCCESS;
}

