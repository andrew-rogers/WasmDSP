
LDFLAGS += --no-entry
TARGET = signal.wasm

$(TARGET): Biquad.o
	$(CXX) $^ $(LDFLAGS) -o $@ -Oz
