#pragma once

#define MAX_DATA_SIZE                   128
#define XBEE_ADDR_SIZE                  8

#define SERVER_ENDPOINT_URL             "http://192.168.2.6:3000/api/zigbee/bridge"
#define SERVER_COMMUNICATION_TIMEOUT    1500

// Xbee
#define FRAME_BUFFER_SIZE               4
#define MAX_FRAME_PAYLOAD_LEN           128

#define SYNC_OPS_TIMEOUT_MS             2000

#define RADIO_TX                        p13
#define RADIO_RX                        p14 
#define RADIO_RESET                     p8