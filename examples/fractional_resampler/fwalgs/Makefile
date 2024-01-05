TARGET = libFR.a
OBJS = FractionalResampler.o

RM = rm -f

all: $(TARGET)

$(TARGET): $(OBJS)
	$(AR) rs $@ $^

%.o:%.cpp
	$(CXX) $(CXXFLAGS) -c -o $@ $<

clean:
	$(RM) $(TARGET)
	$(RM) $(OBJS)

