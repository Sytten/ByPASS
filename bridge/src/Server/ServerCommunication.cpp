#include "ServerCommunication.h"
#include "XbeeCommunication.h"
#include "config.h"
#include "HTTPClient.h"
#include "HTTPJson.h"
#include "BypassDebug.h"

Mail<Message, 5> server_mailbox;

static char data_buffer[MAX_DATA_SIZE];

void server_communication_start() {
    HTTPClient client;
    
    while(1) {
        osEvent event = server_mailbox.get();
        
        DBG("Message to send server");

        if (event.status == osEventMail) {
            Message *message = (Message*)event.value.p;
            
            HTTPJson data_in(data_buffer, MAX_DATA_SIZE);
            HTTPJson data_out(message->data, message->data_size);
            HTTPResult result = client.post(SERVER_ENDPOINT_URL, data_out, &data_in, SERVER_COMMUNICATION_TIMEOUT);
            
            DBG("%s", data_buffer);
            
            if(result == HTTP_OK) {
                DBG("No error");
                
                Message* response = xbee_mailbox.alloc();
                if(response != NULL) {
                    response->xbee = message->xbee;
                    strcpy(response->data, data_buffer);
                    response->data_size = strlen(data_buffer);
                    xbee_mailbox.put(response);
                }
            } else {
                DBG("Error occured: %d", result);
                
                Message* response = xbee_mailbox.alloc();
                if(response != NULL) {
                    response->xbee = message->xbee;
                    sprintf(response->data, "{\"error\":%d}", client.getHTTPResponseCode());
                    response->data_size = strlen(response->data);
                    xbee_mailbox.put(response);
                }
            }
            
            server_mailbox.free(message);
        }
    };
}