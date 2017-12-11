#include "mbed.h"
#include "rtos.h"
#include "EthernetInterface.h"

#include "ServerCommunication.h"
#include "XbeeCommunication.h"
#include "BypassDebug.h"
 
int main() {
    // Ethernet setup
    EthernetInterface eth;
    eth.init();
    eth.connect();
    DBG("IP Address is: %s", eth.getIPAddress());
    
    // Threads setup
    Thread server_communication;
    server_communication.start(callback(server_communication_start));
    
    Thread xbee_communication;
    xbee_communication.start(callback(xbee_communication_start));
    
    while(1) {
        Thread::wait(5000);
        DBG("Tik");
    }
    
    eth.disconnect();
}