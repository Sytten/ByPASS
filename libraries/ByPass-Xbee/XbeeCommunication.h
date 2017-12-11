#pragma once
#include "XbeeMessage.h"
#include "rtos.h"

extern Mail<XbeeMessage, 3> sending_mailbox;
extern Mail<XbeeMessage, 3> receiving_mailbox;

// Bidirectionnal async communication for a many-to-one configuration
void xbee_communication_run();