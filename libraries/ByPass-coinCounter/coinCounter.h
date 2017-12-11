#pragma once

#include "mbed.h"

extern int money;

//Init function 
void coinCounter_init();

//Enable/disable coin counter power
void coinCounter_enable(bool enable);


//Private functions
static void coinCounterTimeOut_isr();
static void coinCounter_isr();
