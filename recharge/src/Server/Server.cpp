#include "Server.h"
#include "XbeeCommunication.h"
#include "Json.h"
#include "debug.h"

static int id = 0;

int get_client_balance(Balance* balance)
{
    XbeeMessage* message = sending_mailbox.alloc();

    if(message != NULL) {
        request_balance(message->data, id++, balance->clientId);
        message->data_size = strlen(message->data);
        sending_mailbox.put(message);
    }

    osEvent event = receiving_mailbox.get();
    if (event.status == osEventMail) {
        DBG("Received message");
        XbeeMessage *message = (XbeeMessage*)event.value.p;

        message->data[message->data_size] = '\0';
        DBG("Data:%s", message->data);

        parse_balance(message->data, balance);

        receiving_mailbox.free(message);
    }

    return 0;
}

int add_money_client(Add* add)
{
    XbeeMessage* message = sending_mailbox.alloc();

    if(message != NULL) {

        request_add(message->data, id++, add->clientId, add->amount);
        message->data_size = strlen(message->data);
        sending_mailbox.put(message);
    }

    osEvent event = receiving_mailbox.get();
    if (event.status == osEventMail) {
        DBG("Received message");
        XbeeMessage *message = (XbeeMessage*)event.value.p;

        message->data[message->data_size] = '\0';
        DBG("Data:%s", message->data);

        parse_add(message->data, add);

        receiving_mailbox.free(message);
    }

    return 0;
}