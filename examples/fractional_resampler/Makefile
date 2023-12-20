TARGET = fractional_resampler.wasm
MODULE = fractional_resampler.mjs
JS = fractional_resampler.js
HTML_SRC = fractional_resampler_src.html
HTML = fractional_resampler.html

OBJS = fractional_resampler.o FractionalResampler.o

CXXFLAGS += -I ../../lib/WasmDSP
LDFLAGS = -L ../../lib/WasmDSP -l WasmDSP --no-entry

RM = rm -f
WASM2MJS = $(EMSDK_NODE) ../../tools/wasm2mjs.mjs
EMBED = $(EMSDK_NODE) ../../tools/embed.mjs

all: $(HTML)

$(TARGET): $(OBJS)
	$(CXX) $(OBJS) $(LDFLAGS) -o $@ -Oz

$(MODULE): $(TARGET)
	$(WASM2MJS) $< $@

$(JS): $(MODULE)
	rollup -c

$(HTML): $(HTML_SRC) $(JS)
	$(EMBED) $< $@

%.o:%.cpp
	$(CXX) $(CXXFLAGS) -c -o $@ $<

clean:
	$(RM) $(TARGET) $(MODULE) $(JS) $(HTML)
	$(RM) $(OBJS)

