TARGET = fractional_resampler
WASM = $(TARGET).wasm
WASMMJS = $(TARGET)_wasm.mjs
WASMDSP = ../..
JS = $(TARGET).js
HTML_SRC = $(TARGET)_src.html
HTML = $(TARGET).html

OBJS = $(TARGET).o

CXXFLAGS += -I ../../lib/WasmDSP -I ./fwalgs
LDFLAGS = -L ../../lib/WasmDSP -L ./fwalgs -l WasmDSP -l FR --no-entry

RM = $(EMSDK_NODE) $(WASMDSP)/tools/rm.mjs # Windows del doesn't like forward slashes, use simple rm node script.
WASM2MJS = $(EMSDK_NODE) $(WASMDSP)/tools/wasm2mjs.mjs
EMBED = $(EMSDK_NODE) $(WASMDSP)/tools/embed.mjs

all: $(HTML)

$(WASM): $(OBJS)
	$(CXX) $(OBJS) $(LDFLAGS) -o $@ -Oz

$(WASMMJS): $(WASM)
	$(WASM2MJS) $< $@

$(JS): $(WASMMJS)
	rollup -c

$(HTML): $(HTML_SRC) $(JS)
	$(EMBED) $< $@

%.o:%.cpp
	$(CXX) $(CXXFLAGS) -c -o $@ $<

clean:
	$(RM) $(WASM) $(WASMMJS) $(JS) $(HTML)
	$(RM) $(OBJS)

