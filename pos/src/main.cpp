// core code for the payment terminal

#include "mbed.h"
#include "rtos.h"
#include "RFID.h"
#include "XbeeCommunication.h"
#include "Input.h"
#include "debug.h"
#include "Server.h"
#include "TextLCD.h"
#include "Bypass-LED.h"

RFID RfChip (SPI_MOSI, SPI_MISO, SPI_SCLK, SPI_CS, MF_RESET);
TextLCD lcd(p10, p16, p17, p18, p19, p20, TextLCD::LCD16x2);

int id = 0;

enum states {
    GET_MERCHANT_ID,
    ENTER_CART,
    GET_CART_TOTAL,
    RFID,
    PAIEMENT
};

enum states state = GET_MERCHANT_ID;

void processing()
{  
    Cart cart;
    int cost;
    int merchantId;
    char clientId[MAX_CLIENTID_SIZE+1];

    while(1) {
        switch(state) {

            case GET_MERCHANT_ID:
                lcd.cls();
                lcd.printf("Entrer le numero de marchand");
                DBG("GET_MERCHANT_ID");
                merchantId = receiving_merchantId();
                signal_green();
                state = ENTER_CART;
                break;

            case ENTER_CART:
                lcd.cls();
                lcd.printf("Achats en cours\n");
                DBG("ENTER_CART");
                receiving_cart(&cart);
                state = GET_CART_TOTAL;
                break;

            case GET_CART_TOTAL:
                DBG("GET_CART_TOTAL");
                cost = get_cart_total(&cart, merchantId);
                if(cost >= 0) {
                    lcd.printf("Total: %d.%02d$", cost/100, cost % 100);
                    state = RFID;
                } else {
                    lcd.printf("Erreur de panier");
                    status_yellow(true);
                    Thread::wait(3000);
                    status_yellow(false);
                    state = ENTER_CART;
                }
                break;

            case RFID:
                // Todo: move logic
                DBG("RFID");
                lcd.locate(0,0);
                lcd.printf("Taper la carte  ");
                RfChip.detectRFIDCard();
                for (uint8_t i = 0; i < RfChip.uid.size; i++) {
                    sprintf(clientId+(i*2),"%02x", RfChip.uid.uidByte[i]);
                    DBG("%02X", RfChip.uid.uidByte[i]);
                }

                clientId[RfChip.uid.size*2] = '\0';
                DBG("%s", clientId);
                state = PAIEMENT;
                break;

            case PAIEMENT:
                DBG("PAIEMENT");
                lcd.locate(0,0);
                lcd.printf("Paiement...     ");
                status_green(true);
                status_yellow(true);
                Payment payment = perform_transaction(&cart, merchantId, clientId);

                if(payment.status == true) {
                    lcd.cls();
                    lcd.printf("Paiement reussi\nSolde: %d.%02d$", payment.balance/100, payment.balance % 100);
                    status_yellow(false);
                } else {
                    lcd.cls();
                    lcd.printf("Paiement echoue!");
                    status_green(false);
                }
                Thread::wait(4000);
                status_green(false);
                status_yellow(false);
                state = ENTER_CART;
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