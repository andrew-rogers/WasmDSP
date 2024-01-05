TARGET = signal
WASM = $(TARGET).wasm
WASMMJS = $(TARGET)_wasm.mjs
MJS = $(TARGET).mjs Biquad.mjs FIR.mjs
WASMDSP = ../..
DISTMOD = $(WASMDSP)/dist/modules
JS = $(DISTMOD)/$(TARGET).js

OBJS = Biquad.o Buffer.o

LDFLAGS += --no-entry


RM = $(EMSDK_NODE) $(WASMDSP)/tools/rm.mjs # Windows del doesn't like forward slashes, use simple rm node script.
WASM2MJS = $(EMSDK_NODE) $(WASMDSP)/tools/wasm2mjs.mjs

$(JS): $(MJS) $(WASMMJS)
	rollup -c

$(WASMMJS): $(WASM)
	$(WASM2MJS) $< $@

$(WASM): $(OBJS)
	$(CXX) $^ $(LDFLAGS) -o $@ -Oz

clean:
	$(RM) $(WASM) $(WASMMJS) $(JS)
	$(RM) $(OBJS)

