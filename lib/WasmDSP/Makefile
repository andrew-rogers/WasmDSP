OBJS = emjs.o JsMediator.o

CXXFLAGS += -fPIC
 
RM = rm -f

all:	libWasmDSP.a


%.o:%.cpp
	$(CXX) $(CXXFLAGS) -c -o $@ $<

libWasmDSP.a: $(OBJS)
	$(AR) rvs $@ $^

clean:
	$(RM) libWasmDSP.a
	$(RM) $(OBJS)

