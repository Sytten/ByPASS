#include "Json.h"
#include "MbedJSONValue.h"
#include <string>

// Debug
#if 1
#include <cstdio>
#define DBG(x, ...) std::printf("[%s:%d - DBG]\t"x"\r\n", __FILE__, __LINE__, ##__VA_ARGS__);
#else
#define DBG(x, ...)
#endif

int request_payment(char* buffer, int id, char* clientId, int merchantId, int* items, int*  quantities, int nbItem)
{
    int error = 0;
    MbedJSONValue json;

    json["id"] = id;
    json["method"] = 1;
    json["clientId"] = clientId;
    json["merchantId"] = merchantId;
    for(int i=0; i<nbItem; i++) {
        json["items"][i] = items[i];
        json["qty"][i] = quantities[i];
    }

    strncpy(buffer,json.serialize().c_str(),MAX_BUFF_SIZE);
    DBG("%s", buffer);

    return error;
}


int request_balance(char* buffer, int id, char* clientId)
{
    int error = 0;
    MbedJSONValue json;

    json["id"] = id;
    json["method"] = 2;
    json["clientId"] = clientId;

    strncpy(buffer,json.serialize().c_str(),MAX_BUFF_SIZE);
    DBG("%s", buffer);

    return error;
}

int request_add(char* buffer, int id, char* clientId, int amount)
{
    int error = 0;
    MbedJSONValue json;

    json["id"] = id;
    json["method"] = 3;
    json["clientId"] = clientId;
    json["amount"] = amount;

    strncpy(buffer,json.serialize().c_str(),MAX_BUFF_SIZE);
    DBG("%s", buffer);

    return error;
}

int request_total(char* buffer,int id,int merchantId, int* items, int* quantities, int nbItem)
{
    int error = 0;
    MbedJSONValue json;

    json["id"] = id;
    json["method"] = 4;
    json["merchantId"] = merchantId;
    for(int i=0; i<nbItem; i++) {
        json["items"][i] = items[i];
        json["qty"][i] = quantities[i];
    }

    strncpy(buffer,json.serialize().c_str(),MAX_BUFF_SIZE);
    DBG("%s", buffer);

    return error;
}

int parse_payment(char* buffer, Payment* pmt)
{
    int error = 0;
    MbedJSONValue json;

    parse(json, buffer);
    DBG("%s", buffer);

    if (json.hasMember("error")) {
        error = json["error"].get<int>();
        DBG("error: %d", error);
    }
    if (json.hasMember("id")) {
        pmt->id = json["id"].get<int>();
        DBG("id: %d", pmt->id);
    }
    if (json.hasMember("status")) {
        pmt->status = json["status"].get<bool>();
        DBG("Status: %d", pmt->status);
    }
    if (json.hasMember("solde")) {
        pmt->balance = json["solde"].get<int>();
        DBG("Balance: %d", pmt->balance);
    }

    return error;
}

int parse_balance(char* buffer, Balance* bal)
{
    int error = 0;
    MbedJSONValue json;

    parse(json, buffer);
    DBG("%s", buffer);

    if (json.hasMember("error")) {
        error = json["error"].get<int>();
        DBG("error: %d", error);
    }
    if (json.hasMember("id")) {
        bal->id = json["id"].get<int>();
        DBG("id: %d", bal->id);
    }
    if (json.hasMember("solde")) {
        bal->solde = json["solde"].get<int>();
        DBG("solde: %d.%02d$", bal->solde/100, bal->solde % 100);
    }

    return error;
}

int parse_add(char* buffer, Add* a)
{
    int error = 0;
    MbedJSONValue json;

    parse(json, buffer);
    DBG("%s", buffer);

    if (json.hasMember("error")) {
        error = json["error"].get<int>();
        DBG("error: %d", error);
    }
    if (json.hasMember("id")) {
        a->id = json["id"].get<int>();
        DBG("id: %d", a->id);
    }
    if (json.hasMember("solde")) {
        a->solde = json["solde"].get<int>();
        DBG("solde: %d", a->solde);
    }

    return error;
}

int parse_total(char* buffer, Total* tot)
{
    int error = 0;
    MbedJSONValue json;

    parse(json, buffer);
    DBG("%s", buffer);

    if (json.hasMember("error")) {
        error = json["error"].get<int>();
        DBG("error: %d", error);
    }
    if (json.hasMember("id")) {
        tot->id = json["id"].get<int>();
        DBG("id: %d", tot->id);
    }
    if (json.hasMember("total")) {
        tot->total = json["total"].get<int>();
        DBG("Total: %d", tot->total);
    }

    return error;
}