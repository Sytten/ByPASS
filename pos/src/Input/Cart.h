#pragma once

#define MAX_NUMBER_ITEMS 10

struct Cart {
    int items[MAX_NUMBER_ITEMS]; 
    int quantities[MAX_NUMBER_ITEMS]; 
    int size;
};