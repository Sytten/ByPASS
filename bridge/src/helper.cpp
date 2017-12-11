#include "helper.h"

Serial pc(USBTX, USBRX);

void print_buffer(char* buffer, int buffer_size) {
    for(int i = 0; i <  buffer_size; i++) {
        pc.putc(buffer[i]);
    }
    pc.putc('\n');
}

void pretty_print_buffer(char* buffer, int buffer_size) {
    pc.printf("0x");
    for(int i = 0; i <  buffer_size; i++) {
        pc.printf("%02x", buffer[i]);
    }
    pc.putc('\n');
}
