#pragma once
#include "rtos.h"

#include "Message.h"

extern Mail<Message, 5> server_mailbox;

void server_communication_start();