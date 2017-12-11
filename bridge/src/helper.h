#pragma once
#include "mbed.h"
#include "rtos.h"

extern Serial pc;

void print_buffer(char* buffer, int buffer_size);
void pretty_print_buffer(char* buffer, int buffer_size);
