#include "XbeeCommunication.h"
#include "XBeeLib.h"
#include "config.h"

// Debug
#if 1
    #include <cstdio>
    #define DBG(x, ...) std::printf("[XBee : DBG]"x"\r\n", ##__VA_ARGS__); 
#else
    #define DBG(x, ...) 
#endif

Mail<XbeeMessage, 3> sending_mailbox;
Mail<XbeeMessage, 3> receiving_mailbox;

using namespace XBeeLib;
static RemoteXBeeZB coordinator(0);

static void receive_cb(const RemoteXBeeZB& remote, bool broadcast, const uint8_t *const data, uint16_t len)
{
    XbeeMessage* message = receiving_mailbox.alloc();

    if(message != NULL) {
        memcpy(message->data, data, len);
        message->data_size = len;
        receiving_mailbox.put(message);
    }
}

void xbee_communication_run()
{
    XBeeZB xbee = XBeeZB(RADIO_TX, RADIO_RX, RADIO_RESET, NC, NC, 9600);
    xbee.register_receive_cb(&receive_cb);

    RadioStatus const radioStatus = xbee.init();
    MBED_ASSERT(radioStatus == Success);

    // Wait for network join
    while (!xbee.is_joined()) {
        Thread::wait(1000);
    }

    while(1) {
        // Process inputs
        xbee.process_rx_frames();

        // Send output
        osEvent event = sending_mailbox.get(0);

        if (event.status == osEventMail) {
            DBG("New message to send coordinator");
            XbeeMessage *message = (XbeeMessage*)event.value.p;

            const TxStatus txStatus = xbee.send_data(coordinator, (const uint8_t *)message->data, message->data_size);
            if (txStatus == TxStatusSuccess) {
                DBG("Sent data to coordinator: OK");
            } else {
                DBG("Sent data to coordinator: failed with %d", (int) txStatus);
            }
            sending_mailbox.free(message);
        }
    }
}