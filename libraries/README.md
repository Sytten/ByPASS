# Libraries

## Description
Those are the various custom libraries that are used by the [POS](../pos) or the [Recharging Terminal](bypass/tree/master/recharge).

## Building
As for all C code in this project, it is highly recommended to copy the code in a new project on the (MBED compiler)[https://os.mbed.com/compiler/]. This way all the dependencies will be resolved automagically. We didn't try to build for other platforms than the LPC1768 so your mileage may vary, nor did we try to build it outside of the online IDE from (MBED)[https://www.mbed.com/en/].

For libraries we highly recommend that you create a library project for each of them and change the URLs in the `.lib` files to reflect those.
