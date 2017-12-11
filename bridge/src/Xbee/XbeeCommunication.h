#pragma once
#include "Message.h"
#include "rtos.h"

extern Mail<Message, 5> xbee_mailbox;

void xbee_communication_start();