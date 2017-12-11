#pragma once

struct Payment {
    int id;
    bool status;
    int balance;
};

// TODO: change those
struct Balance {
    int id;
    char* clientId;
    int solde;
};

struct Add {
    int id;
    char* clientId;
    int amount;
    int solde;
};

struct Total {
    int id;
    int total;
};
