Compile DSP blocks written in C/C++ into a single JavaScript file.
==================================================================

The C/C++ source code is compiled into wasm using clang. The wasm binary is then converted to base64 allowing it to be integrated into the JavaScript source or HTML page. This makes it easy to generate static web pages incorporating the DSP blocks without the need for a server for the wasm binary files.

Conceptualisation vs Realtime DSP
---------------------------------

DSP conceptualisation often takes place using generic linear algebra packages such as [NumPy](https://numpy.org/) or [GNU Octave](https://octave.org/). The host platform on which the conceptualisation models are run have large amounts of memory and usually the vectors are as long as required to store the sample sequence for the entire model execution duration. Large vectors are passed through each stage of DSP in turn until the desired output is generated. This is not possible for real-time implemenations as the execution time is indefinate. Typical real-time systems are implemented on microcontrollers with limited memory. In a real-time DSP implementation input signal samples are collated into a much smaller vector, often only a few tens of samples long. These smaller vectors are continuously produced while the systems is active. Unlike the conceptualisation model, the real-time blocks have to retain some limited history about the previous sample vector(s). This makes the real-time implementation very different from the conceptualisation model.
