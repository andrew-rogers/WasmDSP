
LDFLAGS += --no-entry
TARGET = dsp.wasm

$(TARGET): Biquad.o
	$(CXX) $^ $(LDFLAGS) -o $@ -Oz
