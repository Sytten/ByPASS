// core code for the charging terminal

#include "mbed.h"
#include "rtos.h"
#include "RFID.h"
#include "XbeeCommunication.h"
#include "debug.h"
#include "TextLCD.h"
#include "Server.h"
#include "coinCounter.h"

DigitalIn button(p21);

RFID RfChip (SPI_MOSI, SPI_MISO, SPI_SCLK, SPI_CS, MF_RESET);
TextLCD lcd(p10, p16, p17, p18, p19, p20, TextLCD::LCD16x2);

int money;

enum states {
    RFID,
    GET_CLIENT_INFO,
    MONAYEUR,
    SEND_DATA
};

enum states state = RFID;

void processing()
{
    char clientId[MAX_CLIENTID_SIZE+1];
    Balance balance;
    Add add;
    coinCounter_init();
    bool buttunIsPress = false;

    while(1) {
        switch(state) {
            case RFID:
                lcd.cls();
                lcd.printf("Lecture carte");
                // TODO: move logic
                DBG("RFID");
                RfChip.detectRFIDCard();
                for (uint8_t i = 0; i < RfChip.uid.size; i++) {
                    sprintf(clientId+(i*2),"%02x", RfChip.uid.uidByte[i]);
                    DBG("%02X", RfChip.uid.uidByte[i]);
                }

                clientId[RfChip.uid.size*2] = '\0';
                balance.clientId = clientId;
                DBG("%s", clientId);
                state = GET_CLIENT_INFO;
                break;

            case GET_CLIENT_INFO:
                printf("GET_CLIENT_INFO\n");
                get_client_balance(&balance);
                lcd.cls();
                lcd.printf("Balance: %d.%02d$", balance.solde/100, balance.solde % 100);
                state = MONAYEUR;
                break;

            case MONAYEUR:
                printf("MONAYEUR\n");
                lcd.locate(0,1);
                lcd.printf("Mettre monnaie");
                money = -5;
                coinCounter_enable(true);
                //TODO clean up this while
                while(!buttunIsPress) {
                    buttunIsPress = button;
                }
                buttunIsPress = false;
                coinCounter_enable(false);
                DBG("All money: %d", money);
                lcd.cls();
                lcd.printf("Argent: %d.%02d$", money/100, money% 100);
                state = SEND_DATA;
                break;

            case SEND_DATA:
                printf("SEND_DATA\n");
                add.clientId = balance.clientId;
                add.amount = money;
                add_money_client(&add);
                lcd.locate(0,1);
                lcd.printf("Solde: %d.%02d$", add.solde/100, add.solde% 100);
                Thread::wait(5000);
                state = RFID;
                break;

        }
    }
}


int main()
{
    Thread t_xbee;
    t_xbee.start(xbee_communication_run);
    processing();
}
