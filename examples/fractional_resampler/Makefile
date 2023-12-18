TARGET = fractional_resampler.wasm
MODULE = fractional_resampler.mjs
JS = fractional_resampler.js
HTML_SRC = fractional_resampler_src.html
HTML = fractional_resampler.html

OBJS = fractional_resampler.o

LDFLAGS = --no-entry

RM = rm -f
WASM2MJS = $(EMSDK_NODE) ../../build/wasm2mjs.mjs
EMBED = $(EMSDK_NODE) ../../build/embed.mjs

all: $(HTML)

$(TARGET): $(OBJS)
	$(CXX) $(OBJS) $(LDFLAGS) -o $@ -Oz

$(MODULE): $(TARGET)
	$(WASM2MJS) $< $@
	
$(JS): $(MODULE)
	rollup -c
	
$(HTML): $(HTML_SRC) $(JS)
	$(EMBED) $< $@

clean:
	$(RM) $(TARGET) $(MODULE) $(JS) $(HTML)
	$(RM) $(OBJS)

