#pragma once

#define MAX_DATA_SIZE                   128

// RFID
#define MAX_UID_SIZE                    16
#define MAX_CLIENTID_SIZE               MAX_UID_SIZE*2

// Xbee
#define FRAME_BUFFER_SIZE               4
#define MAX_FRAME_PAYLOAD_LEN           128

#define SYNC_OPS_TIMEOUT_MS             2000

#define RADIO_TX                        p13
#define RADIO_RX                        p14 
#define RADIO_RESET                     p12