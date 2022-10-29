Compile DSP blocks written in C/C++ and embed into a single HTML file.
======================================================================

The C/C++ source code is compiled into wasm using clang. The wasm binary is then converted to base64 allowing it to be integrated into the JavaScript source or HTML page. This makes it easy to generate static web pages incorporating the DSP blocks without the need for a server for the wasm binary files.

Conceptualisation vs Real-time DSP
----------------------------------

DSP conceptualisation often takes place using generic linear algebra packages such as [NumPy](https://numpy.org/) or [GNU Octave](https://octave.org/). The host platform on which the conceptualisation models are run have large amounts of memory and usually the vectors are as long as required to store the sample sequence for the entire model execution duration. Large vectors are passed through each stage of DSP in turn until the desired output is generated. This is not possible for real-time implementations as the execution time is indefinite. Typical real-time systems are implemented on microcontrollers with limited memory. In a real-time DSP implementation input signal samples are collated into a much smaller vector, often only a few tens of samples long. These smaller vectors are continuously produced while the systems is active. Unlike the conceptualisation model, the real-time blocks have to retain some limited history about the previous sample vector(s). This makes the real-time implementation very different from the conceptualisation model.

### Advantages of Linear Algebra Tools

It is very convenient to understand and teach DSP principles using vector space and linear algebra. This allows the DSP operations to be represented in terms of mathematical expressions. All of the DSP operations can now be analysed mathematically using various transforms. Generic tools often offer graph plotting utilities which is the DSP designers equivalent of an oscilloscope and spectrum analyser.

### Disadvantages of Linear Algebra Tools

It can be easy to lose sight of the real-time constraints of real world DSP applications. This results in a significant real-time system development time as often the real-time constraints will require many adaptations to the initial concepts derived using the linear algebra tools.

### Hybrid Approach

Real-time DSP blocks written in C/C++ can be either compiled for the target microcontroller or for a PC platform. When compiled for the PC platform these can be combined with conceptualised blocks to give the advantages offered by the linear algebra tools. Such an approach allows a block by block migration approach to the real-time implementation whilst maintaining a demonstrable DSP solution.

Demonstration and Teaching
--------------------------

Whether for team communication in industry or for teaching in educational environments, it is desirable to be able to demonstrate the principles of the DSP system to others. It is desirable to do this without requiring the audience to have access to the real-time electronics and ideally without requiring them to install specialist software or linear algebra tools. [AndrewWIDE](https://github.com/andrew-rogers/AndrewWIDE) achieves this but has a very heavy focus on the presentation (in the browser) aspects. AndrewWIDE did not adequately define a block interface and relies heavily on JSON to communicate between C++ and the browser. WasmDSP intends to separate this concern and allow a block interface to be used in AndrewWIDE and other JavaScript projects such as [JupyterLite](https://jupyterlite.readthedocs.io/en/latest/).

What WasmDSP Provides
---------------------

There are two main parts to WasmDSP.

* Building the wasm binary and embedding this into a JavaScript element in the HTML file.
* JavaScript API providing access to DSP blocks in the wasm binary.

