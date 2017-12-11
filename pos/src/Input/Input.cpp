#include "Input.h"
#include "Keyboard.h"
#include "debug.h"
#include "Bypass-LED.h"

#define CANCEL 'D'
#define COMPLETE 'C'
#define SWITCH_MODE 'F'
#define ADD_NEW_ITEM 'E'

enum InputStates {
    QUANTITY,
    ITEM
};

static inline bool isNumeric(char c)
{
    if (c <= 0x39 && c >= 0x30 )
        return true;

    return false;
}


static inline int charToNum(char c)
{
    return (int)(c-0x30);
}

bool receiving_cart(Cart *cart)
{
    keyboard_init();
    
    int tempValue = 0;
    InputStates state = QUANTITY;
    cart->size = 0;
    
    // Clean buffer
    while(keypadStroke.get(0).value.p != NULL);

    while(1) {

        osEvent evt = keypadStroke.get();
        
        // Skip if other event
        if (evt.status != osEventMessage)
            continue;

        // Get Curren key
        char *key = (char*)evt.value.p;

        // If max number of items, wait for complete or cancel
        if (cart->size == MAX_NUMBER_ITEMS) {
            if (*key == CANCEL)
                return false;
            if (*key != COMPLETE)
                continue;
            return true;
        }

        switch(state) {
            case QUANTITY:
                // Get quantity if numeric and not exceeding the max number size
                if (isNumeric(*key) && tempValue < MAX_NUMBER_POSITION) {
                    tempValue = tempValue * 10 + charToNum(*key);
                } else if (*key == SWITCH_MODE) {
                    cart->quantities[cart->size] = tempValue;
                    tempValue = 0;
                    state = ITEM;
                } else if (*key == CANCEL) {
                    return false;
                }
                break;

            case ITEM:
                // Get item if numeric and not exceeding the max number size
                if (isNumeric(*key)  && tempValue < MAX_NUMBER_POSITION) {
                    tempValue = tempValue * 10 + charToNum(*key);
                } else if (*key == ADD_NEW_ITEM) {
                    cart->items[cart->size] = tempValue;
                    DBG("Qty: %d, Item: %d", cart->quantities[cart->size], cart->items[cart->size]);
                    tempValue = 0;
                    state = QUANTITY;
                    cart->size++;
                    signal_green();
                } else if (*key == CANCEL) {
                    return false;
                } else if (*key == COMPLETE) {
                    cart->items[cart->size] = tempValue;
                    DBG("Qty: %d, Item: %d", cart->quantities[cart->size], cart->items[cart->size]);
                    cart->size++;
                    signal_green();
                    return true;
                }
                break;
        }
    }
}

int receiving_merchantId()
{
    keyboard_init();
    
    // Clean buffer
    while(keypadStroke.get(0).value.p != NULL);
    
    int merchantId = 0;
    
    while(merchantId < MAX_NUMBER_POSITION) {
        osEvent event = keypadStroke.get();
        if (event.status != osEventMessage)
            continue;
        
        // Get new character, verify it's a number and add to the id
        char *key = (char*)event.value.p;
        if(isNumeric(*key))
            merchantId = merchantId * 10 + charToNum(*key);
    }
    
    DBG("%d", merchantId);
    return merchantId;
}