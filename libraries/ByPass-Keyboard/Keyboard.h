#pragma once

#include "mbed.h"
#include "rtos.h"

extern Queue<char, 10> keypadStroke;

// Initialise the keyboard (can be called multiple times)
void keyboard_init();