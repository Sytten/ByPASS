#pragma once
#include "config.h"
#include "mbed.h"

struct XbeeMessage {
    char data[MAX_DATA_SIZE];
    int data_size;
};