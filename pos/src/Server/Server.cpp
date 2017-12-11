#include "Server.h"
#include "XbeeCommunication.h"
#include "Json.h"
#include "debug.h"

static int id = 0;

int get_cart_total(Cart* cart, int merchantId) {
    XbeeMessage* message = sending_mailbox.alloc();

    if(message != NULL) {
        request_total(message->data, id++, merchantId, cart->items, cart->quantities, cart->size);
        message->data_size = strlen(message->data);
        sending_mailbox.put(message);
    }

    osEvent event = receiving_mailbox.get();
    if (event.status == osEventMail) {
        DBG("Received message");
        XbeeMessage *message = (XbeeMessage*)event.value.p;

        message->data[message->data_size] = '\0';
        DBG("Data:%s", message->data);
        
        Total total;
        int error = parse_total(message->data, &total);  
              
        receiving_mailbox.free(message);
        
        if(error != 0){
            return -1;
        }
        return total.total;
    }
    
    return 0;
}

Payment perform_transaction(Cart* cart, int merchantId, char* clientId) {
    XbeeMessage* message = sending_mailbox.alloc();
    Payment payment;

    if(message != NULL) {
        request_payment(message->data, id++, clientId, merchantId, cart->items, cart->quantities, cart->size);
        message->data_size = strlen(message->data);
        sending_mailbox.put(message);
    }

    osEvent event = receiving_mailbox.get();
    if (event.status == osEventMail) {
        DBG("Received message");
        XbeeMessage *message = (XbeeMessage*)event.value.p;

        message->data[message->data_size] = '\0';
        DBG("Data:%s", message->data);
        
        int error = parse_payment(message->data, &payment);
        
        receiving_mailbox.free(message);
        
        if(error != 0){
            payment.status = false;
        }
    }
    
    return payment;
}