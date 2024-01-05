TARGET = signal
MJS = $(TARGET).mjs $(TARGET)_wasm.mjs Biquad.mjs FIR.mjs
DISTMOD = ../../dist/modules
JS = $(DISTMOD)/$(TARGET).js

LDFLAGS += --no-entry

$(JS): $(MJS)
	rollup -c

$(TARGET)_wasm.mjs: $(TARGET).wasm
	echo "export const b64=\`" > $@
	base64 $< >> $@
	echo "\`;" >> $@

$(TARGET).wasm: Biquad.o Buffer.o
	$(CXX) $^ $(LDFLAGS) -o $@ -Oz

