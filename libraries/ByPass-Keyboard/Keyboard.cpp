#include "Keyboard.h"
#include "Keypad.h"

Queue<char, 10> keypadStroke;

static Keypad keypad(p27,p28,p29,p30,p23,p24,p25,p26);
static bool initialised = false;

char Keytable[] = {
    '1', '2', '3', 'F', // r0
    '4', '5', '6', 'E', // r1
    '7', '8', '9', 'D', // r2
    'A', '0', 'B', 'C'  // r3
    // c0   c1   c2   c3
};

static uint32_t keyboard_isr(uint32_t index)
{
    keypadStroke.put(Keytable+index);
    return 0;
}

void keyboard_init()
{
    if(!initialised) {
        keypad.attach(&keyboard_isr);
        keypad.start();
        initialised = true;
    }
}