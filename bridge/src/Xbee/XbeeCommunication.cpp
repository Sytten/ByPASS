#include "XbeeCommunication.h"
#include "ServerCommunication.h"
#include "XBeeLib.h"
#include "config.h"
#include "BypassDebug.h"

Mail<Message, 5> xbee_mailbox;

using namespace XBeeLib;

static void receive_cb(const RemoteXBeeZB& remote, bool broadcast, const uint8_t *const data, uint16_t len)
{
    Message* message = server_mailbox.alloc();
    
    if(message != NULL) {
        message->xbee = remote.get_addr64();
        memcpy(message->data, data, len);
        message->data_size = len + 1;
        server_mailbox.put(message);
    }
}

void xbee_communication_start() {
    XBeeZB xbee = XBeeZB(RADIO_TX, RADIO_RX, RADIO_RESET, NC, NC, 9600);
    xbee.register_receive_cb(&receive_cb);
    
    RadioStatus const radioStatus = xbee.init();
    MBED_ASSERT(radioStatus == Success);
    
    // Wait for network join
    while (!xbee.is_joined()) {
        Thread::wait(1000);
        DBG(".");
    }
    
    while(1) {
        // Process inputs
        xbee.process_rx_frames();
         
        // Send output  
        osEvent event = xbee_mailbox.get(0);

        if (event.status == osEventMail) {
            DBG("Message to send xbee");
            Message *message = (Message*)event.value.p;
            RemoteXBeeZB remoteDevice(message->xbee);
            
            const TxStatus txStatus = xbee.send_data(remoteDevice, (const uint8_t *)message->data, message->data_size);
            if (txStatus == TxStatusSuccess)
                DBG("Send data to Xbee done");
            else
                DBG("Send data to Xbee failed %d", (int) txStatus);
            xbee_mailbox.free(message);
        }
    }
}