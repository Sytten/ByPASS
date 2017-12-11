#pragma once

#include "Cart.h"
#include "JsonValues.h"

int get_cart_total(Cart* cart, int merchantId);
Payment perform_transaction(Cart* cart, int merchantId, char* clientId);