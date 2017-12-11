#pragma once
#include "config.h"
#include "mbed.h"

struct Message {
    uint64_t xbee;
    char data[MAX_DATA_SIZE];
    int data_size;
};