TARGET = signal
WASM = $(TARGET).wasm
WASMMJS = $(TARGET)_wasm.mjs
MJS = $(TARGET).mjs Biquad.mjs FIR.mjs
WASMDSP = ../..
KISSFFT_DIR = ../../../kissfft
DISTMOD = $(WASMDSP)/dist/modules
JS = $(DISTMOD)/$(TARGET).js

OBJS = Biquad.o Buffer.o FFT.o kiss_fft.o

CXXFLAGS += -I $(KISSFFT_DIR)
LDFLAGS += --no-entry


RM = $(EMSDK_NODE) $(WASMDSP)/tools/rm.mjs # Windows del doesn't like forward slashes, use simple rm node script.
WASM2MJS = $(EMSDK_NODE) $(WASMDSP)/tools/wasm2mjs.mjs

$(JS): $(MJS) $(WASMMJS)
	rollup -c

$(WASMMJS): $(WASM)
	$(WASM2MJS) $< $@

$(WASM): $(OBJS)
	$(CXX) $^ $(LDFLAGS) -o $@ -Oz

kiss_fft.o: $(KISSFFT_DIR)/kiss_fft.c
	$(CC) $(CXXFLAGS) -c -o $@ $<

clean:
	$(RM) $(WASM) $(WASMMJS) $(JS)
	$(RM) $(OBJS)

