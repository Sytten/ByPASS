#include "coinCounter.h"
#include "debug.h"

const uint8_t coinValues[]= {0,5,10,25,100,200,0};
InterruptIn coinCounter(p28);
Timeout coinCounter_timeout;
DigitalOut coinCounterPwr(p29);

volatile uint8_t coinCounter_value=0;

void coinCounter_init()
{
    coinCounter.fall(&coinCounter_isr);
    coinCounter_enable(false);
}

void coinCounter_enable(bool enable)
{
    coinCounterPwr=enable;
}

void coinCounterTimeOut_isr()
{
    if(coinCounter_value > 6) coinCounter_value=0;

    money += coinValues[coinCounter_value];

    coinCounter_value=0;

}

void coinCounter_isr()
{
    coinCounter_timeout.attach(&coinCounterTimeOut_isr,0.16); //60ms
    coinCounter_value++;
}