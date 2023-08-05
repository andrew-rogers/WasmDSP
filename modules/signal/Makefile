
LDFLAGS += --no-entry
TARGET = signal

$(TARGET)_wasm.js: $(TARGET).wasm
	echo "export const b64=\`" > $@
	base64 $< >> $@
	echo "\`;" >> $@

$(TARGET).wasm: Biquad.o Buffer.o
	$(CXX) $^ $(LDFLAGS) -o $@ -Oz
