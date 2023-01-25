#include <stdio.h>
#include <stdlib.h>
#include <dlfcn.h>

int main()
{
    void *handle;
    void (*greet)(const char*);
    
    printf("Main says hello!\n");

    // Filename of "/side.so" needs the "/" as it has to exactly match a key in
    // the JS preloadedWasm array.
    handle = dlopen("/side.so", RTLD_LAZY);
    
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

