#include "Bypass-LED.h"
#include "mbed.h"

static DigitalOut ledG(p21);
static DigitalOut ledY(p22);

static Timeout green_timeout;
static Timeout yellow_timeout;

static void green_led_off(){
    ledG = 0;
}

static void yellow_led_off(){
    ledY = 0;
}

void status_yellow(bool status){
    ledY = status;
}

void status_green(bool status){
    ledG = status;
}
void signal_green(){
    ledG = 1;
    green_timeout.attach(&green_led_off, 1.0f);   
}

void signal_yellow(){
    ledY = 1;
    yellow_timeout.attach(&yellow_led_off, 1.0f);   
}