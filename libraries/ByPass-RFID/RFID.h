/**
 * RFID.h - Library to use ARDUINO RFID MODULE KIT 13.56 MHZ WITH TAGS SPI W AND R BY COOQROBOT.
 * Based on code Dr.Leong   ( WWW.B2CQSHOP.COM )
 * Created by Miguel Balboa (circuitito.com), Jan, 2012.
 * Rewritten by Soren Thing Andersen (access.thing.dk), fall of 2013 (Translation to English, refactored, comments, anti collision, cascade levels.)
 * Ported to mbed by Martin Olejar, Dec, 2013
 *
 * Please read this file for an overview and then RFID.cpp for comments on the specific functions.
 * Search for "mf-rc522" on ebay.com to purchase the MF-RC522 board.
 *
 * There are three hardware components involved:
 * 1) The micro controller: An Arduino
 * 2) The PCD (short for Proximity Coupling Device): NXP RFID Contactless Reader IC
 * 3) The PICC (short for Proximity Integrated Circuit Card): A card or tag using the ISO 14443A interface, eg Mifare or NTAG203.
 *
 * The microcontroller and card reader uses SPI for communication.
 * The protocol is described in the RFID datasheet: http://www.nxp.com/documents/data_sheet/RFID.pdf
 *
 * The card reader and the tags communicate using a 13.56MHz electromagnetic field.
 * The protocol is defined in ISO/IEC 14443-3 Identification cards -- Contactless integrated circuit cards -- Proximity cards -- Part 3: Initialization and anticollision".
 * A free version of the final draft can be found at http://wg8.de/wg8n1496_17n3613_Ballot_FCD14443-3.pdf
 * Details are found in chapter 6, Type A: Initialization and anticollision.
 *
 * If only the PICC UID is wanted, the above documents has all the needed information.
 * To read and write from MIFARE PICCs, the MIFARE protocol is used after the PICC has been selected.
 * The MIFARE Classic chips and protocol is described in the datasheets:
 *    1K:   http://www.nxp.com/documents/data_sheet/MF1S503x.pdf
 *    4K:   http://www.nxp.com/documents/data_sheet/MF1S703x.pdf
 *    Mini: http://www.idcardmarket.com/download/mifare_S20_datasheet.pdf
 * The MIFARE Ultralight chip and protocol is described in the datasheets:
 *    Ultralight:   http://www.nxp.com/documents/data_sheet/MF0ICU1.pdf
 *    Ultralight C: http://www.nxp.com/documents/short_data_sheet/MF0ICU2_SDS.pdf
 *
 * MIFARE Classic 1K (MF1S503x):
 *    Has 16 sectors * 4 blocks/sector * 16 bytes/block = 1024 bytes.
 *    The blocks are numbered 0-63.
 *    Block 3 in each sector is the Sector Trailer. See http://www.nxp.com/documents/data_sheet/MF1S503x.pdf sections 8.6 and 8.7:
 *        Bytes 0-5:   Key A
 *        Bytes 6-8:   Access Bits
 *        Bytes 9:     User data
 *        Bytes 10-15: Key B (or user data)
 *    Block 0 is read only manufacturer data.
 *    To access a block, an authentication using a key from the block's sector must be performed first.
 *    Example: To read from block 10, first authenticate using a key from sector 3 (blocks 8-11).
 *    All keys are set to FFFFFFFFFFFFh at chip delivery.
 *    Warning: Please read section 8.7 "Memory Access". It includes this text: if the PICC detects a format violation the whole sector is irreversibly blocked.
 *    To use a block in "value block" mode (for Increment/Decrement operations) you need to change the sector trailer. Use PICC_SetAccessBits() to calculate the bit patterns.
 * MIFARE Classic 4K (MF1S703x):
 *    Has (32 sectors * 4 blocks/sector + 8 sectors * 16 blocks/sector) * 16 bytes/block = 4096 bytes.
 *    The blocks are numbered 0-255.
 *    The last block in each sector is the Sector Trailer like above.
 * MIFARE Classic Mini (MF1 IC S20):
 *    Has 5 sectors * 4 blocks/sector * 16 bytes/block = 320 bytes.
 *    The blocks are numbered 0-19.
 *    The last block in each sector is the Sector Trailer like above.
 *
 * MIFARE Ultralight (MF0ICU1):
 *    Has 16 pages of 4 bytes = 64 bytes.
 *    Pages 0 + 1 is used for the 7-byte UID.
 *    Page 2 contains the last chech digit for the UID, one byte manufacturer internal data, and the lock bytes (see http://www.nxp.com/documents/data_sheet/MF0ICU1.pdf section 8.5.2)
 *    Page 3 is OTP, One Time Programmable bits. Once set to 1 they cannot revert to 0.
 *    Pages 4-15 are read/write unless blocked by the lock bytes in page 2.
 * MIFARE Ultralight C (MF0ICU2):
 *    Has 48 pages of 4 bytes = 64 bytes.
 *    Pages 0 + 1 is used for the 7-byte UID.
 *    Page 2 contains the last chech digit for the UID, one byte manufacturer internal data, and the lock bytes (see http://www.nxp.com/documents/data_sheet/MF0ICU1.pdf section 8.5.2)
 *    Page 3 is OTP, One Time Programmable bits. Once set to 1 they cannot revert to 0.
 *    Pages 4-39 are read/write unless blocked by the lock bytes in page 2.
 *    Page 40 Lock bytes
 *    Page 41 16 bit one way counter
 *    Pages 42-43 Authentication configuration
 *    Pages 44-47 Authentication key
 */
#ifndef RFID_h
#define RFID_h

#include "mbed.h"

//mbed Pins for SPI interface
#define SPI_MOSI    p5
#define SPI_MISO    p6
#define SPI_SCLK    p7
#define SPI_CS      p8
// mbed Pin for reset
#define MF_RESET    p9
// mbed Pins for Debug UART port
#define UART_RX     USBRX
#define UART_TX     USBTX

class RFID
{
public: 
    void detectRFIDCard();
    /**
     * RFID registers (described in chapter 9 of the datasheet).
     * When using SPI all addresses are shifted one bit left in the "SPI address byte" (section 8.1.2.3)
     */
    enum PCD_Register {
        // Page 0: Command and status
        //                0x00        // reserved for future use
        CommandReg      = 0x01 << 1,  // starts and stops command execution
        ComIEnReg       = 0x02 << 1,  // enable and disable interrupt request control bits
        DivIEnReg       = 0x03 << 1,  // enable and disable interrupt request control bits
        ComIrqReg       = 0x04 << 1,  // interrupt request bits
        DivIrqReg       = 0x05 << 1,  // interrupt request bits
        ErrorReg        = 0x06 << 1,  // error bits showing the error status of the last command executed
        Status1Reg      = 0x07 << 1,  // communication status bits
        Status2Reg      = 0x08 << 1,  // receiver and transmitter status bits
        FIFODataReg     = 0x09 << 1,  // input and output of 64 byte FIFO buffer
        FIFOLevelReg    = 0x0A << 1,  // number of bytes stored in the FIFO buffer
        WaterLevelReg   = 0x0B << 1,  // level for FIFO underflow and overflow warning
        ControlReg      = 0x0C << 1,  // miscellaneous control registers
        BitFramingReg   = 0x0D << 1,  // adjustments for bit-oriented frames
        CollReg         = 0x0E << 1,  // bit position of the first bit-collision detected on the RF interface
        //                0x0F        // reserved for future use

        // Page 1:Command
        //                0x10        // reserved for future use
        ModeReg         = 0x11 << 1,  // defines general modes for transmitting and receiving
        TxModeReg       = 0x12 << 1,  // defines transmission data rate and framing
        RxModeReg       = 0x13 << 1,  // defines reception data rate and framing
        TxControlReg    = 0x14 << 1,  // controls the logical behavior of the antenna driver pins TX1 and TX2
        TxASKReg        = 0x15 << 1,  // controls the setting of the transmission modulation
        TxSelReg        = 0x16 << 1,  // selects the internal sources for the antenna driver
        RxSelReg        = 0x17 << 1,  // selects internal receiver settings
        RxThresholdReg  = 0x18 << 1,  // selects thresholds for the bit decoder
        DemodReg        = 0x19 << 1,  // defines demodulator settings
        //                0x1A        // reserved for future use
        //                0x1B        // reserved for future use
        MfTxReg         = 0x1C << 1,  // controls some MIFARE communication transmit parameters
        MfRxReg         = 0x1D << 1,  // controls some MIFARE communication receive parameters
        //                0x1E        // reserved for future use
        SerialSpeedReg  = 0x1F << 1,  // selects the speed of the serial UART interface

        // Page 2: Configuration
        //                0x20        // reserved for future use
        CRCResultRegH   = 0x21 << 1,  // shows the MSB and LSB values of the CRC calculation
        CRCResultRegL   = 0x22 << 1,
        //                0x23        // reserved for future use
        ModWidthReg     = 0x24 << 1,  // controls the ModWidth setting?
        //                0x25        // reserved for future use
        RFCfgReg        = 0x26 << 1,  // configures the receiver gain
        GsNReg          = 0x27 << 1,  // selects the conductance of the antenna driver pins TX1 and TX2 for modulation
        CWGsPReg        = 0x28 << 1,  // defines the conductance of the p-driver output during periods of no modulation
        ModGsPReg       = 0x29 << 1,  // defines the conductance of the p-driver output during periods of modulation
        TModeReg        = 0x2A << 1,  // defines settings for the internal timer
        TPrescalerReg   = 0x2B << 1,  // the lower 8 bits of the TPrescaler value. The 4 high bits are in TModeReg.
        TReloadRegH     = 0x2C << 1,  // defines the 16-bit timer reload value
        TReloadRegL     = 0x2D << 1,
        TCntValueRegH   = 0x2E << 1,  // shows the 16-bit timer value
        TCntValueRegL   = 0x2F << 1,

        // Page 3:Test Registers
        //                0x30        // reserved for future use
        TestSel1Reg     = 0x31 << 1,  // general test signal configuration
        TestSel2Reg     = 0x32 << 1,  // general test signal configuration
        TestPinEnReg    = 0x33 << 1,  // enables pin output driver on pins D1 to D7
        TestPinValueReg = 0x34 << 1,  // defines the values for D1 to D7 when it is used as an I/O bus
        TestBusReg      = 0x35 << 1,  // shows the status of the internal test bus
        AutoTestReg     = 0x36 << 1,  // controls the digital self test
        VersionReg      = 0x37 << 1,  // shows the software version
        AnalogTestReg   = 0x38 << 1,  // controls the pins AUX1 and AUX2
        TestDAC1Reg     = 0x39 << 1,  // defines the test value for TestDAC1
        TestDAC2Reg     = 0x3A << 1,  // defines the test value for TestDAC2
        TestADCReg      = 0x3B << 1   // shows the value of ADC I and Q channels
        //                0x3C        // reserved for production tests
        //                0x3D        // reserved for production tests
        //                0x3E        // reserved for production tests
        //                0x3F        // reserved for production tests
    };

    // RFID commands Described in chapter 10 of the datasheet.
    enum PCD_Command {
        PCD_Idle               = 0x00,   // no action, cancels current command execution
        PCD_Mem                = 0x01,   // stores 25 bytes into the internal buffer
        PCD_GenerateRandomID   = 0x02,   // generates a 10-byte random ID number
        PCD_CalcCRC            = 0x03,   // activates the CRC coprocessor or performs a self test
        PCD_Transmit           = 0x04,   // transmits data from the FIFO buffer
        PCD_NoCmdChange        = 0x07,   // no command change, can be used to modify the CommandReg register bits without affecting the command, for example, the PowerDown bit
        PCD_Receive            = 0x08,   // activates the receiver circuits
        PCD_Transceive         = 0x0C,   // transmits data from FIFO buffer to antenna and automatically activates the receiver after transmission
        PCD_MFAuthent          = 0x0E,   // performs the MIFARE standard authentication as a reader
        PCD_SoftReset          = 0x0F    // resets the RFID
    };

    // Commands sent to the PICC.
    enum PICC_Command {
        // The commands used by the PCD to manage communication with several PICCs (ISO 14443-3, Type A, section 6.4)
        PICC_CMD_REQA          = 0x26,   // REQuest command, Type A. Invites PICCs in state IDLE to go to READY and prepare for anticollision or selection. 7 bit frame.
        PICC_CMD_WUPA          = 0x52,   // Wake-UP command, Type A. Invites PICCs in state IDLE and HALT to go to READY(*) and prepare for anticollision or selection. 7 bit frame.
        PICC_CMD_CT            = 0x88,   // Cascade Tag. Not really a command, but used during anti collision.
        PICC_CMD_SEL_CL1       = 0x93,   // Anti collision/Select, Cascade Level 1
        PICC_CMD_SEL_CL2       = 0x95,   // Anti collision/Select, Cascade Level 1
        PICC_CMD_SEL_CL3       = 0x97,   // Anti collision/Select, Cascade Level 1
        PICC_CMD_HLTA          = 0x50,   // HaLT command, Type A. Instructs an ACTIVE PICC to go to state HALT.

        // The commands used for MIFARE Classic (from http://www.nxp.com/documents/data_sheet/MF1S503x.pdf, Section 9)
        // Use PCD_MFAuthent to authenticate access to a sector, then use these commands to read/write/modify the blocks on the sector.
        // The read/write commands can also be used for MIFARE Ultralight.
        PICC_CMD_MF_AUTH_KEY_A = 0x60,   // Perform authentication with Key A
        PICC_CMD_MF_AUTH_KEY_B = 0x61,   // Perform authentication with Key B
        PICC_CMD_MF_READ       = 0x30,   // Reads one 16 byte block from the authenticated sector of the PICC. Also used for MIFARE Ultralight.
        PICC_CMD_MF_WRITE      = 0xA0,   // Writes one 16 byte block to the authenticated sector of the PICC. Called "COMPATIBILITY WRITE" for MIFARE Ultralight.
        PICC_CMD_MF_DECREMENT  = 0xC0,   // Decrements the contents of a block and stores the result in the internal data register.
        PICC_CMD_MF_INCREMENT  = 0xC1,   // Increments the contents of a block and stores the result in the internal data register.
        PICC_CMD_MF_RESTORE    = 0xC2,   // Reads the contents of a block into the internal data register.
        PICC_CMD_MF_TRANSFER   = 0xB0,   // Writes the contents of the internal data register to a block.

        // The commands used for MIFARE Ultralight (from http://www.nxp.com/documents/data_sheet/MF0ICU1.pdf, Section 8.6)
        // The PICC_CMD_MF_READ and PICC_CMD_MF_WRITE can also be used for MIFARE Ultralight.
        PICC_CMD_UL_WRITE      = 0xA2    // Writes one 4 byte page to the PICC.
    };

    // MIFARE constants that does not fit anywhere else
    enum MIFARE_Misc {
        MF_ACK                 = 0xA,    // The MIFARE Classic uses a 4 bit ACK/NAK. Any other value than 0xA is NAK.
        MF_KEY_SIZE            = 6       // A Mifare Crypto1 key is 6 bytes.
    };

    // PICC types we can detect. Remember to update PICC_GetTypeName() if you add more.
    enum PICC_Type {
        PICC_TYPE_UNKNOWN      = 0,
        PICC_TYPE_ISO_14443_4  = 1,  // PICC compliant with ISO/IEC 14443-4
        PICC_TYPE_ISO_18092    = 2,  // PICC compliant with ISO/IEC 18092 (NFC)
        PICC_TYPE_MIFARE_MINI  = 3,  // MIFARE Classic protocol, 320 bytes
        PICC_TYPE_MIFARE_1K    = 4,  // MIFARE Classic protocol, 1KB
        PICC_TYPE_MIFARE_4K    = 5,  // MIFARE Classic protocol, 4KB
        PICC_TYPE_MIFARE_UL    = 6,  // MIFARE Ultralight or Ultralight C
        PICC_TYPE_MIFARE_PLUS  = 7,  // MIFARE Plus
        PICC_TYPE_TNP3XXX      = 8,  // Only mentioned in NXP AN 10833 MIFARE Type Identification Procedure
        PICC_TYPE_NOT_COMPLETE = 255 // SAK indicates UID is not complete.
    };

    // Return codes from the functions in this class. Remember to update GetStatusCodeName() if you add more.
    enum StatusCode {
        STATUS_OK              = 1,  // Success
        STATUS_ERROR           = 2,  // Error in communication
        STATUS_COLLISION       = 3,  // Collision detected
        STATUS_TIMEOUT         = 4,  // Timeout in communication.
        STATUS_NO_ROOM         = 5,  // A buffer is not big enough.
        STATUS_INTERNAL_ERROR  = 6,  // Internal error in the code. Should not happen ;-)
        STATUS_INVALID         = 7,  // Invalid argument.
        STATUS_CRC_WRONG       = 8,  // The CRC_A does not match
        STATUS_MIFARE_NACK     = 9   // A MIFARE PICC responded with NAK.
    };

    // A struct used for passing the UID of a PICC.
    typedef struct {
        uint8_t    size;     // Number of bytes in the UID. 4, 7 or 10.
        uint8_t    uidByte[10];
        uint8_t    sak;      // The SAK (Select acknowledge) byte returned from the PICC after successful selection.
    } Uid;

    // A struct used for passing a MIFARE Crypto1 key
    typedef struct {
        uint8_t    keyByte[MF_KEY_SIZE];
    } MIFARE_Key;

    // Member variables
    Uid uid;                // Used by PICC_ReadCardSerial().

    // Size of the RFID FIFO
    static const uint8_t FIFO_SIZE = 64;   // The FIFO is 64 bytes.

    /**
    * RFID constructor
    *
    * @param mosi  SPI MOSI pin
    * @param miso  SPI MISO pin
    * @param sclk  SPI SCLK pin
    * @param cs    SPI CS pin
    * @param reset Reset pin
    */
    RFID(PinName mosi, PinName miso, PinName sclk, PinName cs, PinName reset);

    /**
    * RFID destructor
    */
    ~RFID();


    // ************************************************************************************
    //! @name Functions for manipulating the RFID
    // ************************************************************************************
    //@{

    /**
    * Initializes the RFID chip.
    */
    void    PCD_Init           (void);

    /**
    * Performs a soft reset on the RFID chip and waits for it to be ready again.
    */
    void    PCD_Reset          (void);

    /**
    * Turns the antenna on by enabling pins TX1 and TX2.
    * After a reset these pins disabled.
    */
    void    PCD_AntennaOn      (void);

    /**
    * Writes a byte to the specified register in the RFID chip.
    * The interface is described in the datasheet section 8.1.2.
    *
    * @param reg   The register to write to. One of the PCD_Register enums.
    * @param value The value to write.
    */
    void    PCD_WriteRegister  (uint8_t reg, uint8_t value);

    /**
    * Writes a number of bytes to the specified register in the RFID chip.
    * The interface is described in the datasheet section 8.1.2.
    *
    * @param reg    The register to write to. One of the PCD_Register enums.
    * @param count  The number of bytes to write to the register
    * @param values The values to write. Byte array.
    */
    void    PCD_WriteRegister  (uint8_t reg, uint8_t count, uint8_t *values);

    /**
    * Reads a byte from the specified register in the RFID chip.
    * The interface is described in the datasheet section 8.1.2.
    *
    * @param reg The register to read from. One of the PCD_Register enums.
    * @returns Register value
    */
    uint8_t PCD_ReadRegister   (uint8_t reg);

    /**
    * Reads a number of bytes from the specified register in the RFID chip.
    * The interface is described in the datasheet section 8.1.2.
    *
    * @param reg     The register to read from. One of the PCD_Register enums.
    * @param count   The number of bytes to read.
    * @param values  Byte array to store the values in.
    * @param rxAlign Only bit positions rxAlign..7 in values[0] are updated.
    */
    void    PCD_ReadRegister   (uint8_t reg, uint8_t count, uint8_t *values, uint8_t rxAlign = 0);

    /**
    * Sets the bits given in mask in register reg.
    *
    * @param reg  The register to update. One of the PCD_Register enums.
    * @param mask The bits to set.
    */
    void    PCD_SetRegisterBits(uint8_t reg, uint8_t mask);

    /**
    * Clears the bits given in mask from register reg.
    *
    * @param reg  The register to update. One of the PCD_Register enums.
    * @param mask The bits to clear.
    */
    void    PCD_ClrRegisterBits(uint8_t reg, uint8_t mask);

    /**
    * Use the CRC coprocessor in the RFID to calculate a CRC_A.
    *
    * @param data   Pointer to the data to transfer to the FIFO for CRC calculation.
    * @param length The number of bytes to transfer.
    * @param result Pointer to result buffer. Result is written to result[0..1], low byte first.
    * @return STATUS_OK on success, STATUS_??? otherwise.
    */
    uint8_t PCD_CalculateCRC   (uint8_t *data, uint8_t length, uint8_t *result);

    /**
     * Executes the Transceive command.
     * CRC validation can only be done if backData and backLen are specified.
     *
     * @param sendData Pointer to the data to transfer to the FIFO.
     * @param sendLen  Number of bytes to transfer to the FIFO.
     * @param backData NULL or pointer to buffer if data should be read back after executing the command.
     * @param backLen  Max number of bytes to write to *backData. Out: The number of bytes returned.
     * @param validBits The number of valid bits in the last byte. 0 for 8 valid bits. Default NULL.
     * @param rxAlign  Defines the bit position in backData[0] for the first bit received. Default 0.
     * @param checkCRC True => The last two bytes of the response is assumed to be a CRC_A that must be validated.
     *
     * @return STATUS_OK on success, STATUS_??? otherwise.
     */
    uint8_t PCD_TransceiveData (uint8_t *sendData,
                                uint8_t sendLen,
                                uint8_t *backData,
                                uint8_t *backLen,
                                uint8_t *validBits = NULL,
                                uint8_t rxAlign    = 0,
                                bool    checkCRC   = false);


    /**
     * Transfers data to the RFID FIFO, executes a commend, waits for completion and transfers data back from the FIFO.
     * CRC validation can only be done if backData and backLen are specified.
     *
     * @param command   The command to execute. One of the PCD_Command enums.
     * @param waitIRq   The bits in the ComIrqReg register that signals successful completion of the command.
     * @param sendData  Pointer to the data to transfer to the FIFO.
     * @param sendLen   Number of bytes to transfer to the FIFO.
     * @param backData  NULL or pointer to buffer if data should be read back after executing the command.
     * @param backLen   In: Max number of bytes to write to *backData. Out: The number of bytes returned.
     * @param validBits In/Out: The number of valid bits in the last byte. 0 for 8 valid bits.
     * @param rxAlign   In: Defines the bit position in backData[0] for the first bit received. Default 0.
     * @param checkCRC  In: True => The last two bytes of the response is assumed to be a CRC_A that must be validated.
     *
     * @return STATUS_OK on success, STATUS_??? otherwise.
     */
    uint8_t PCD_CommunicateWithPICC(uint8_t command,
                                    uint8_t waitIRq,
                                    uint8_t *sendData,
                                    uint8_t sendLen,
                                    uint8_t *backData  = NULL,
                                    uint8_t *backLen   = NULL,
                                    uint8_t *validBits = NULL,
                                    uint8_t rxAlign    = 0,
                                    bool    checkCRC   = false);

    /**
     * Transmits a REQuest command, Type A. Invites PICCs in state IDLE to go to READY and prepare for anticollision or selection. 7 bit frame.
     * Beware: When two PICCs are in the field at the same time I often get STATUS_TIMEOUT - probably due do bad antenna design.
     *
     * @param bufferATQA  The buffer to store the ATQA (Answer to request) in
     * @param bufferSize  Buffer size, at least two bytes. Also number of bytes returned if STATUS_OK.
     *
     * @return STATUS_OK on success, STATUS_??? otherwise.
     */
    uint8_t PICC_RequestA      (uint8_t *bufferATQA, uint8_t *bufferSize);

    /**
     * Transmits a Wake-UP command, Type A. Invites PICCs in state IDLE and HALT to go to READY(*) and prepare for anticollision or selection. 7 bit frame.
     * Beware: When two PICCs are in the field at the same time I often get STATUS_TIMEOUT - probably due do bad antenna design.
     *
     * @param bufferATQA  The buffer to store the ATQA (Answer to request) in
     * @param bufferSize  Buffer size, at least two bytes. Also number of bytes returned if STATUS_OK.
     *
     * @return STATUS_OK on success, STATUS_??? otherwise.
     */
    uint8_t PICC_WakeupA       (uint8_t *bufferATQA, uint8_t *bufferSize);

    /**
     * Transmits REQA or WUPA commands.
     * Beware: When two PICCs are in the field at the same time I often get STATUS_TIMEOUT - probably due do bad antenna design.
     *
     * @param command     The command to send - PICC_CMD_REQA or PICC_CMD_WUPA
     * @param bufferATQA  The buffer to store the ATQA (Answer to request) in
     * @param bufferSize  Buffer size, at least two bytes. Also number of bytes returned if STATUS_OK.
     *
     * @return STATUS_OK on success, STATUS_??? otherwise.
     */
    uint8_t PICC_REQA_or_WUPA  (uint8_t command, uint8_t *bufferATQA, uint8_t *bufferSize);

    /**
     * Transmits SELECT/ANTICOLLISION commands to select a single PICC.
     * Before calling this function the PICCs must be placed in the READY(*) state by calling PICC_RequestA() or PICC_WakeupA().
     * On success:
     *   - The chosen PICC is in state ACTIVE(*) and all other PICCs have returned to state IDLE/HALT. (Figure 7 of the ISO/IEC 14443-3 draft.)
     *   - The UID size and value of the chosen PICC is returned in *uid along with the SAK.
     *
     * A PICC UID consists of 4, 7 or 10 bytes.
     * Only 4 bytes can be specified in a SELECT command, so for the longer UIDs two or three iterations are used:
     *
     *   UID size        Number of UID bytes                Cascade levels                Example of PICC
     *   ========        ===================                ==============                ===============
     *   single                   4                                1                      MIFARE Classic
     *   double                   7                                2                      MIFARE Ultralight
     *   triple                  10                                3                      Not currently in use?
     *
     *
     * @param uid        Pointer to Uid struct. Normally output, but can also be used to supply a known UID.
     * @param validBits  The number of known UID bits supplied in *uid. Normally 0. If set you must also supply uid->size.
     *
     * @return STATUS_OK on success, STATUS_??? otherwise.
     */
    uint8_t PICC_Select        (Uid *uid, uint8_t validBits = 0);

    /**
     * Instructs a PICC in state ACTIVE(*) to go to state HALT.
     *
     * @return STATUS_OK on success, STATUS_??? otherwise.
     */
    uint8_t PICC_HaltA         (void);

    // ************************************************************************************
    //@}


    // ************************************************************************************
    //! @name Functions for communicating with MIFARE PICCs
    // ************************************************************************************
    //@{

    /**
     * Executes the RFID MFAuthent command.
     * This command manages MIFARE authentication to enable a secure communication to any MIFARE Mini, MIFARE 1K and MIFARE 4K card.
     * The authentication is described in the RFID datasheet section 10.3.1.9 and http://www.nxp.com/documents/data_sheet/MF1S503x.pdf section 10.1.
     * For use with MIFARE Classic PICCs.
     * The PICC must be selected - ie in state ACTIVE(*) - before calling this function.
     * Remember to call PCD_StopCrypto1() after communicating with the authenticated PICC - otherwise no new communications can start.
     *
     * All keys are set to FFFFFFFFFFFFh at chip delivery.
     *
     * @param command    PICC_CMD_MF_AUTH_KEY_A or PICC_CMD_MF_AUTH_KEY_B
     * @param blockAddr  The block number. See numbering in the comments in the .h file.
     * @param key        Pointer to the Crypteo1 key to use (6 bytes)
     * @param uid        Pointer to Uid struct. The first 4 bytes of the UID is used.
     *
     * @return STATUS_OK on success, STATUS_??? otherwise. Probably STATUS_TIMEOUT if you supply the wrong key.
     */
    uint8_t PCD_Authenticate   (uint8_t command, uint8_t blockAddr, MIFARE_Key *key, Uid *uid);

    /**
     * Used to exit the PCD from its authenticated state.
     * Remember to call this function after communicating with an authenticated PICC - otherwise no new communications can start.
     */
    void    PCD_StopCrypto1    (void);

    /**
     * Reads 16 bytes (+ 2 bytes CRC_A) from the active PICC.
     *
     * For MIFARE Classic the sector containing the block must be authenticated before calling this function.
     *
     * For MIFARE Ultralight only addresses 00h to 0Fh are decoded.
     * The MF0ICU1 returns a NAK for higher addresses.
     * The MF0ICU1 responds to the READ command by sending 16 bytes starting from the page address defined by the command argument.
     * For example; if blockAddr is 03h then pages 03h, 04h, 05h, 06h are returned.
     * A roll-back is implemented: If blockAddr is 0Eh, then the contents of pages 0Eh, 0Fh, 00h and 01h are returned.
     *
     * The buffer must be at least 18 bytes because a CRC_A is also returned.
     * Checks the CRC_A before returning STATUS_OK.
     *
     * @param blockAddr  MIFARE Classic: The block (0-0xff) number. MIFARE Ultralight: The first page to return data from.
     * @param buffer     The buffer to store the data in
     * @param bufferSize Buffer size, at least 18 bytes. Also number of bytes returned if STATUS_OK.
     *
     * @return STATUS_OK on success, STATUS_??? otherwise.
     */
    uint8_t MIFARE_Read        (uint8_t blockAddr, uint8_t *buffer, uint8_t *bufferSize);

    /**
     * Writes 16 bytes to the active PICC.
     *
     * For MIFARE Classic the sector containing the block must be authenticated before calling this function.
     *
     * For MIFARE Ultralight the opretaion is called "COMPATIBILITY WRITE".
     * Even though 16 bytes are transferred to the Ultralight PICC, only the least significant 4 bytes (bytes 0 to 3)
     * are written to the specified address. It is recommended to set the remaining bytes 04h to 0Fh to all logic 0.
     *
     * @param blockAddr  MIFARE Classic: The block (0-0xff) number. MIFARE Ultralight: The page (2-15) to write to.
     * @param buffer     The 16 bytes to write to the PICC
     * @param bufferSize Buffer size, must be at least 16 bytes. Exactly 16 bytes are written.
     *
     * @return STATUS_OK on success, STATUS_??? otherwise.
    */
    uint8_t MIFARE_Write       (uint8_t blockAddr, uint8_t *buffer, uint8_t bufferSize);

    /**
     * Writes a 4 byte page to the active MIFARE Ultralight PICC.
     *
     * @param page       The page (2-15) to write to.
     * @param buffer     The 4 bytes to write to the PICC
     * @param bufferSize Buffer size, must be at least 4 bytes. Exactly 4 bytes are written.
     *
     * @return STATUS_OK on success, STATUS_??? otherwise.
     */
    uint8_t MIFARE_UltralightWrite(uint8_t page, uint8_t *buffer, uint8_t bufferSize);

    /**
     * MIFARE Decrement subtracts the delta from the value of the addressed block, and stores the result in a volatile memory.
     * For MIFARE Classic only. The sector containing the block must be authenticated before calling this function.
     * Only for blocks in "value block" mode, ie with access bits [C1 C2 C3] = [110] or [001].
     * Use MIFARE_Transfer() to store the result in a block.
     *
     * @param blockAddr The block (0-0xff) number.
     * @param delta     This number is subtracted from the value of block blockAddr.
     *
     * @return STATUS_OK on success, STATUS_??? otherwise.
     */
    uint8_t MIFARE_Decrement   (uint8_t blockAddr, uint32_t delta);

    /**
     * MIFARE Increment adds the delta to the value of the addressed block, and stores the result in a volatile memory.
     * For MIFARE Classic only. The sector containing the block must be authenticated before calling this function.
     * Only for blocks in "value block" mode, ie with access bits [C1 C2 C3] = [110] or [001].
     * Use MIFARE_Transfer() to store the result in a block.
     *
     * @param blockAddr The block (0-0xff) number.
     * @param delta     This number is added to the value of block blockAddr.
     *
     * @return STATUS_OK on success, STATUS_??? otherwise.
     */
    uint8_t MIFARE_Increment   (uint8_t blockAddr, uint32_t delta);

    /**
     * MIFARE Restore copies the value of the addressed block into a volatile memory.
     * For MIFARE Classic only. The sector containing the block must be authenticated before calling this function.
     * Only for blocks in "value block" mode, ie with access bits [C1 C2 C3] = [110] or [001].
     * Use MIFARE_Transfer() to store the result in a block.
     *
     * @param blockAddr The block (0-0xff) number.
     *
     * @return STATUS_OK on success, STATUS_??? otherwise.
     */
    uint8_t MIFARE_Restore     (uint8_t blockAddr);

    /**
     * MIFARE Transfer writes the value stored in the volatile memory into one MIFARE Classic block.
     * For MIFARE Classic only. The sector containing the block must be authenticated before calling this function.
     * Only for blocks in "value block" mode, ie with access bits [C1 C2 C3] = [110] or [001].
     *
     * @param blockAddr The block (0-0xff) number.
     *
     * @return STATUS_OK on success, STATUS_??? otherwise.
     */
    uint8_t MIFARE_Transfer    (uint8_t blockAddr);

    // ************************************************************************************
    //@}


    // ************************************************************************************
    //! @name Support functions
    // ************************************************************************************
    //@{

    /**
     * Wrapper for MIFARE protocol communication.
     * Adds CRC_A, executes the Transceive command and checks that the response is MF_ACK or a timeout.
     *
     * @param sendData      Pointer to the data to transfer to the FIFO. Do NOT include the CRC_A.
     * @param sendLen       Number of bytes in sendData.
     * @param acceptTimeout True => A timeout is also success
     *
     * @return STATUS_OK on success, STATUS_??? otherwise.
     */
    uint8_t PCD_MIFARE_Transceive(uint8_t *sendData, uint8_t sendLen, bool acceptTimeout = false);

    /**
     * Translates the SAK (Select Acknowledge) to a PICC type.
     *
     * @param sak The SAK byte returned from PICC_Select().
     *
     * @return PICC_Type
     */
    uint8_t PICC_GetType         (uint8_t sak);

    /**
     * Returns a string pointer to the PICC type name.
     *
     * @param type One of the PICC_Type enums.
     *
     * @return A string pointer to the PICC type name.
     */
    char*   PICC_GetTypeName     (uint8_t type);

    /**
     * Returns a string pointer to a status code name.
     *
     * @param code One of the StatusCode enums.
     *
     * @return A string pointer to a status code name.
     */
    char*   GetStatusCodeName    (uint8_t code);

    /**
     * Calculates the bit pattern needed for the specified access bits. In the [C1 C2 C3] tupples C1 is MSB (=4) and C3 is LSB (=1).
     *
     * @param accessBitBuffer Pointer to byte 6, 7 and 8 in the sector trailer. Bytes [0..2] will be set.
     * @param g0              Access bits [C1 C2 C3] for block 0 (for sectors 0-31) or blocks 0-4 (for sectors 32-39)
     * @param g1              Access bits [C1 C2 C3] for block 1 (for sectors 0-31) or blocks 5-9 (for sectors 32-39)
     * @param g2              Access bits [C1 C2 C3] for block 2 (for sectors 0-31) or blocks 10-14 (for sectors 32-39)
     * @param g3              Access bits [C1 C2 C3] for the sector trailer, block 3 (for sectors 0-31) or block 15 (for sectors 32-39)
     */
    void    MIFARE_SetAccessBits (uint8_t *accessBitBuffer,
                                  uint8_t g0,
                                  uint8_t g1,
                                  uint8_t g2,
                                  uint8_t g3);

    // ************************************************************************************
    //@}


    // ************************************************************************************
    //! @name Convenience functions - does not add extra functionality
    // ************************************************************************************
    //@{

    /**
     * Returns true if a PICC responds to PICC_CMD_REQA.
     * Only "new" cards in state IDLE are invited. Sleeping cards in state HALT are ignored.
     *
     * @return bool
     */
    bool    PICC_IsNewCardPresent(void);

    /**
     * Simple wrapper around PICC_Select.
     * Returns true if a UID could be read.
     * Remember to call PICC_IsNewCardPresent(), PICC_RequestA() or PICC_WakeupA() first.
     * The read UID is available in the class variable uid.
     *
     * @return bool
     */
    bool    PICC_ReadCardSerial  (void);

    // ************************************************************************************
    //@}


private:
    SPI              m_SPI;
    DigitalOut       m_CS;
    DigitalOut       m_RESET;

    /**
     * Helper function for the two-step MIFARE Classic protocol operations Decrement, Increment and Restore.
     *
     * @param command    The command to use
     * @param blockAddr  The block (0-0xff) number.
     * @param data       The data to transfer in step 2
     *
     * @return STATUS_OK on success, STATUS_??? otherwise.
     */
    uint8_t MIFARE_TwoStepHelper(uint8_t command, uint8_t blockAddr, uint32_t data);


};

#endif
