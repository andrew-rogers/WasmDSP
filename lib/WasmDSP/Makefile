OBJS = emjs.o JSArray.o

CXXFLAGS += -fPIC
 
WASMDSP = ../..
RM = $(EMSDK_NODE) $(WASMDSP)/tools/rm.mjs # Windows del doesn't like forward slashes, use simple rm node script.

all:	libWasmDSP.a


%.o:%.cpp
	$(CXX) $(CXXFLAGS) -c -o $@ $<

libWasmDSP.a: $(OBJS)
	$(AR) rcs $@ $^

clean:
	$(RM) libWasmDSP.a
	$(RM) $(OBJS)

