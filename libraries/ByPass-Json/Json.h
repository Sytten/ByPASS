#pragma once

#include <string.h>
#include "mbed.h"
#include "JsonValues.h"

#define MAX_BUFF_SIZE 128

// Functions to fill the output buffer
int request_payment(char* buffer, int id, char* clientId, int merchantId, int* items, int* quantities, int nbItem);
int request_balance(char* buffer, int id, char* clientId);
int request_add(char* buffer, int id, char* clientId, int amount);
int request_total(char* buffer,int id, int merchantId, int* items, int* quantities, int nbItem);

// Functions to parse the json buffer
int parse_payment(char* buffer, Payment* pmt);
int parse_balance(char* buffer, Balance* bal);
int parse_add(char* buffer, Add* a);
int parse_total(char* buffer, Total* tot);