const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const cast = require('../../util/cast');
const formatMessage = require('format-message');
const BLE = require('../../io/ble');
const Base64Util = require('../../util/base64-util');


/**
 * Icon png to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,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';

/**
 * Enum for micro:bit BLE command protocol.
 * https://github.com/LLK/scratch-microbit-firmware/blob/master/protocol.md
 * @readonly
 * @enum {number}
 */
const BLECommand = {
		START_SYS: 0xF0,
		SET_OUTPUT: 0xF1,
		SET_SERVO: 0xF2,
		SET_PWM: 0xF3,
		SET_RGB: 0xF4,
		END_SYS: 0xF7,
    READ_INPUT: 0xF8,
    READ_DISTANCE: 0xF9,
    PLAY_TONE: 0xE1,
    READ_ANALOG: 0xE2,
    SET_MOTOR: 0xE3
};


/**
 * A time interval to wait (in milliseconds) before reporting to the BLE socket
 * that data has stopped coming from the peripheral.
 */
const BLETimeout = 4500;

/**
 * A time interval to wait (in milliseconds) while a block that sends a BLE message is running.
 * @type {number}
 */
const BLESendInterval = 100;

/**
 * A string to report to the BLE socket when the micro:bit has stopped receiving data.
 * @type {string}
 */
const BLEDataStoppedError = 'Junkbot extension stopped receiving data';

/**
 * Enum for micro:bit protocol.
 * https://github.com/LLK/scratch-microbit-firmware/blob/master/protocol.md
 * @readonly
 * @enum {string}
 */
const BLEUUID = {
    service: 0xFFE0,
		rxChar: 0xFFE1,
    txChar: 0xFFE1
};

/**
 * Manage communication with a MicroBit peripheral over a Scrath Link client socket.
 */
class JunkBot {

    /**
     * Construct a MicroBit communication object.
     * @param {Runtime} runtime - the Scratch 3.0 runtime
     * @param {string} extensionId - the id of the extension
     */
    constructor (runtime, extensionId) {

        /**
         * The Scratch 3.0 runtime used to trigger the green flag button.
         * @type {Runtime}
         * @private
         */
        this._runtime = runtime;

        /**
         * The BluetoothLowEnergy connection socket for reading/writing peripheral data.
         * @type {BLE}
         * @private
         */
        this._ble = null;
        this._runtime.registerPeripheralExtension(extensionId, this);

        /**
         * The id of the extension this peripheral belongs to.
         */
        this._extensionId = extensionId;

        /**
         * The most recently received value for each sensor.
         * @type {Object.<string, number>}
         * @private
         */
        this._sensors = {
            digVal:0,
            readDist:0,
            getAnalog:0
        };



        /**
         * Interval ID for data reading timeout.
         * @type {number}
         * @private
         */
        this._timeoutID = null;

        /**
         * A flag that is true while we are busy sending data to the BLE socket.
         * @type {boolean}
         * @private
         */
        this._busy = false;

        /**
         * ID for a timeout which is used to clear the busy flag if it has been
         * true for a long time.
         */
        this._busyTimeoutID = null;

        //this.reset = this.reset.bind(this);
        this._onConnect = this._onConnect.bind(this);
        this._onMessage = this._onMessage.bind(this);
    }

		/**
     * @param {array} value - the value
		 * @param {int} pin - the digital pin number
     * @return {Promise} - a Promise that resolves when writing to peripheral.
     */
    digitalWrite (pin, value) {
        return this.send(BLECommand.SET_OUTPUT, [pin, value]);
    }

		/**
		 * @param {int} pin - the digital pin number
     * @return {Promise} - a Promise that resolves when writing to peripheral.
     */
    digitalRead (pin) {
        return this.send(BLECommand.READ_INPUT, [pin]);
    }

    /**
		 * @param {int} pin - the digital pin number
     * @return {Promise} - a Promise that resolves when writing to peripheral.
     */
    readUltrasound (trigger,echo) {
        return this.send(BLECommand.READ_DISTANCE, [trigger, echo]);
    }

    /**
     * @param {int} value - the value
		 * @param {int} pin - the digital pin number
     * @return {Promise} - a Promise that resolves when writing to peripheral.
     */
    setServo (pin, angle) {
        return this.send(BLECommand.SET_SERVO, [pin, angle]);
    }

    /**
     * @param {int} note - the note
     * @param {int} beat - the beat
		 * @param {int} pin - the digital pin number
     * @return {Promise} - a Promise that resolves when writing to peripheral.
     */
    playTone (pin, note, beat) {
        return this.send(BLECommand.PLAY_TONE, [pin, note, beat]);
    }

    /**
     * @param {int} value - the PWM value
		 * @param {int} pin - the digital pin number
     * @return {Promise} - a Promise that resolves when writing to peripheral.
     */
    analogWrite (pin, value) {
        return this.send(BLECommand.SET_PWM, [pin, value]);
    }

    /**
     * @param {int} value1value2value3 - the PWM value
		 * @param {int} pin1pin2pin3 - the digital pin number
     * @return {Promise} - a Promise that resolves when writing to peripheral.
     */
    setRGB (pin1, value1, pin2, value2, pin3, value3) {
        return this.send(BLECommand.SET_RGB, [pin1, value1, pin2, value2, pin3, value3]);
    }

    /**
		 * @param {int} pin - the digital pin number
     * @return {Promise} - a Promise that resolves when writing to peripheral.
     */
    analogRead (pin) {
        return this.send(BLECommand.READ_ANALOG, [pin]);
    }

    /**
     * @param {int} direction - the direction
     * @param {int} speed - the speed
		 * @param {int} pin - the digital pin number
     * @return {Promise} - a Promise that resolves when writing to peripheral.
     */
    runMotor (pin, direction, speed) {
        return this.send(BLECommand.SET_MOTOR, [pin, direction, speed]);
    }

    /**
     * @return {Uint8Array} - the current state of the 5x5 LED matrix.
     */
    get digVal () {
        return this._sensors.digVal;
    }

    /**
     * @return {Uint8Array} - the current state of the 5x5 LED matrix.
     */
    get getDistance () {
        return this._sensors.readDist;
    }

    /**
     * @return {Uint8Array} - the current state of the 5x5 LED matrix.
     */
    get getAnalog () {
        return this._sensors.getAnalog;
    }

    /**
     * Called by the runtime when user wants to scan for a peripheral.
     */
    scan () {
        if (this._ble) {
            this._ble.disconnect();
						//console.log("scan initiated");
        }
        this._ble = new BLE(this._runtime, this._extensionId, {
            filters: [
                {services: [BLEUUID.service]}
            ]
        }, this._onConnect, this.reset);
    }

    /**
     * Called by the runtime when user wants to connect to a certain peripheral.
     * @param {number} id - the id of the peripheral to connect to.
     */
    connect (id) {
        if (this._ble) {
            this._ble.connectPeripheral(id);
						//console.log("connect success");
        }
    }

    /**
     * Disconnect from the micro:bit.
     */
    disconnect () {
        if (this._ble) {
            this._ble.disconnect();
						//console.log("disconnect triggered");
        }

        this.reset();
    }

    /**
     * Reset all the state and timeout/interval ids.
     */
    reset () {
        if (this._timeoutID) {
            window.clearTimeout(this._timeoutID);
						//console.log("reset initiated");
            this._timeoutID = null;
        }
    }

    /**
     * Return true if connected to the micro:bit.
     * @return {boolean} - whether the micro:bit is connected.
     */
    isConnected () {
        let connected = false;
        if (this._ble) {
            connected = this._ble.isConnected();
					//	console.log("is connected");
					//	console.log(connected);
        }
        return connected;
    }

    /**
     * Send a message to the peripheral BLE socket.
     * @param {number} command - the BLE command hex.
     * @param {Uint8Array} message - the message to write
     */
    send (command, message) {
        if (!this.isConnected()) return;
        if (this._busy) return;
				//console.log("trying to send message");

        // Set a busy flag so that while we are sending a message and waiting for
        // the response, additional messages are ignored.
        this._busy = true;

        // Set a timeout after which to reset the busy flag. This is used in case
        // a BLE message was sent for which we never received a response, because
        // e.g. the peripheral was turned off after the message was sent. We reset
        // the busy flag after a while so that it is possible to try again later.
        this._busyTimeoutID = window.setTimeout(() => {
            this._busy = false;
        }, 5000);

				mils = millis();
        var data = BLECommand.START_SYS + ";" + command + ";";
        for (let i = 0; i < message.length; i++) {
            data += message[i] + ";";
        }
        data += BLECommand.END_SYS + ";"
        //console.log("data:" + data);
        this._ble.write(BLEUUID.service, BLEUUID.txChar, data, '', false).then(
            () => {
                this._busy = false;
								//console.log("data sent");
                window.clearTimeout(this._busyTimeoutID);
            }
        );
    }

    /**
     * Starts reading data from peripheral after BLE has connected to it.
     * @private
     */
    _onConnect () {
        this._ble.read(BLEUUID.service, BLEUUID.rxChar, true, this._onMessage);
				//console.log("connected");
      /*  this._timeoutID = window.setTimeout(
            () => this._ble.handleDisconnectError(BLEDataStoppedError),
            BLETimeout
        );
				*/
    }

    /**
     * Process the sensor data from the incoming BLE characteristic.
     * @param {object} base64 - the incoming BLE data.
     * @private
     */
    _onMessage (base64) {
        // parse data
        const data = Base64Util.base64ToUint8Array(base64);
        //console.log("return data:" + data);
        this._sensors.digVal = data[1];
        this._sensors.readDist = data[2];
        this._sensors.getAnalog = data[3];

        // cancel disconnect timeout and start a new one
        //window.clearTimeout(this._timeoutID);
        //this._timeoutID = window.setTimeout(
        //    () => this._ble.handleDisconnectError(BLEDataStoppedError),
      //      BLETimeout
      //  );
    }

}

/**
 * Enum for tilt sensor direction.
 * @readonly
 * @enum {string}
 */
const JunkbotTiltDirection = {
    FRONT: 'front',
    BACK: 'back',
    LEFT: 'left',
    RIGHT: 'right',
    ANY: 'any'
};

/**
 * Enum for Digital PIN.
 * @readonly
 * @enum {string}
 */
const JunkbotDigitalPort = {
    B1: '6',
    B2: '8',
		B3: '10',
		B4: '11',
		B5: '12',
		B6: '13'
};

/**
 * Enum for Digital PIN.
 * @readonly
 * @enum {string}
 */
const ToneNote = {
    C2: '65',
    D2: '73',
    E2: '82',
    F2: '87',
    G2: '98',
    A2: '110',
    B2: '123',
    C3: '131',
    D3: '147',
    E3: '165',
    F3: '175',
    G3: '196',
    A3: '220',
    B3: '247',
    C4: '262',
    D4: '294',
    E4: '330',
    F4: '349',
    G4: '392',
    A4: '440',
    B4: '494'
};

/**
 * Enum for Digital PIN.
 * @readonly
 * @enum {string}
 */
const ToneBeat = {
    HALF: '500',
    QUARTER: '250',
    EIGHTH: '125',
    WHOLE: '1000',
    DOUBLE: '2000',
    ZERO: '0'
};
/**
 * Enum for Digital PIN.
 * @readonly
 * @enum {string}
 */
const DigitalPin = [6,7,8,9,10,11,12,13];

function millis(){
	return Date.now() - startTime;
}

/**
 * Scratch 3.0 blocks to interact with a Junkbot peripheral.
 */
class Scratch3JunkbotBlocks {

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return 'Junkbot';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return 'junkbotble';
    }

		/**
     * @return {array} - text and values for each PORT menu element
     */
    get PORTS_MENU () {
        return [
          {
              text: 'B1',
              value: JunkbotDigitalPort.B1
          },
          {
              text: 'B2',
              value: JunkbotDigitalPort.B2
          },
            {
                text: 'B3',
                value: JunkbotDigitalPort.B3
            },
						{
                text: 'B4',
                value: JunkbotDigitalPort.B4
            },
						{
                text: 'B5',
                value: JunkbotDigitalPort.B5
            },
						{
                text: 'B6',
                value: JunkbotDigitalPort.B6
            }
        ];
    }

    /**
     * @return {array} - text and values for each PORT menu element
     */
    get PORTS_MENU_4PIN () {
        return [
          {
              text: 'B1',
              value: JunkbotDigitalPort.B1
          },
          {
              text: 'B2',
              value: JunkbotDigitalPort.B2
          }
        ];
    }

    /**
     * @return {array} - text and values for each PORT menu element
     */
    get PORTS_MENU_3PIN () {
        return [
          {
              text: 'B3',
              value: JunkbotDigitalPort.B3
          },
          {
              text: 'B4',
              value: JunkbotDigitalPort.B4
          },
          {
              text: 'B5',
              value: JunkbotDigitalPort.B5
          },
          {
              text: 'B6',
              value: JunkbotDigitalPort.B6
          }
        ];
    }

    /**
     * @return {array} - text and values for each PORT menu element
     */
    get VALUE_MENU () {
        return [
						{
                text: 'HIGH',
                value: '1'
            },
						{
                text: 'LOW',
                value: '0'
            }
        ];
    }

    /**
     * @return {array} - text and values for each PORT menu element
     */
    get DIRECTION_ARRAY () {
        return [
						{
                text: 'Clockwise',
                value: '1'
            },
						{
                text: 'Anti-Clockwise',
                value: '0'
            }
        ];
    }

    /**
     * @return {array} - text and values for each PORT menu element
     */
    get MOTOR_PORT () {
        return [
						{
                text: 'A',
                value: '2'
            },
						{
                text: 'B',
                value: '4'
            }
        ];
    }

    /**
     * @return {array} - text and values for each PORT menu element
     */
    get BEATS () {
        return [
						{
                text: 'Half',
                value: ToneBeat.HALF
            },
						{
                text: 'Quarter',
                value: ToneBeat.QUARTER
            },
						{
                text: 'Eighth',
                value: ToneBeat.EIGHTH
            },
						{
                text: 'Whole',
                value: ToneBeat.WHOLE
            },
						{
                text: 'Double',
                value: ToneBeat.DOUBLE
            },
						{
                text: 'Zero',
                value: ToneBeat.ZERO
            }
        ];
    }

    /**
     * @return {array} - text and values for each PORT menu element
     */
    get NOTES () {
        return [
						{
                text: 'C2',
                value: ToneNote.C2
            },
						{
                text: 'D2',
                value: ToneNote.D2
            },
						{
                text: 'E2',
                value: ToneNote.E2
            },
						{
                text: 'F2',
                value: ToneNote.F2
            },
						{
                text: 'G2',
                value: ToneNote.G2
            },
						{
                text: 'A2',
                value: ToneNote.A2
            },
						{
                text: 'B2',
                value: ToneNote.B2
            },
            {
                text: 'C3',
                value: ToneNote.C3
            },
						{
                text: 'D3',
                value: ToneNote.D3
            },
						{
                text: 'E3',
                value: ToneNote.E3
            },
						{
                text: 'F3',
                value: ToneNote.F3
            },
						{
                text: 'G3',
                value: ToneNote.G3
            },
						{
                text: 'A3',
                value: ToneNote.A3
            },
						{
                text: 'B3',
                value: ToneNote.B3
            },
            {
                text: 'C4',
                value: ToneNote.C4
            },
						{
                text: 'D4',
                value: ToneNote.D4
            },
						{
                text: 'E4',
                value: ToneNote.E4
            },
						{
                text: 'F4',
                value: ToneNote.F4
            },
						{
                text: 'G4',
                value: ToneNote.G4
            },
						{
                text: 'A3',
                value: ToneNote.C2
            },
						{
                text: 'B4',
                value: ToneNote.B4
            }
        ];
    }

    /**
     * Construct a set of MicroBit blocks.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor (runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;
				startTime = Date.now();
				this.lastMillis = 0;

        // Create a new MicroBit peripheral instance
        this._peripheral = new JunkBot(this.runtime, Scratch3JunkbotBlocks.EXTENSION_ID);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: Scratch3JunkbotBlocks.EXTENSION_ID,
            name: Scratch3JunkbotBlocks.EXTENSION_NAME,
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [

								{
                    opcode: 'jbDigitalWrite',
                    text: formatMessage({
                        id: 'junkbotble.jbDigitalWrite',
                        default: 'set port [PIN] output as [STATE]',
                        description: 'set value for Junkbot Port'
                    }),
                    blockType: BlockType.COMMAND,
										arguments: {
                        STATE: {
                            type: ArgumentType.STRING,
                            menu: 'setValue',
                            defaultValue: '1'
                        },
												PIN: {
                            type: ArgumentType.STRING,
                            menu: 'setPort3Pin',
                            defaultValue: JunkbotDigitalPort.B6
                        }
										}
                },
                {
                    opcode: 'setServo',
                    text: formatMessage({
                        id: 'junkbotble.setServo',
                        default: 'set servo [PORT] angle as [ANGLE]',
                        description: 'set angle for servo motor'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                      PORT: {
                          type: ArgumentType.STRING,
                          menu: 'setPort3Pin',
                          defaultValue: JunkbotDigitalPort.B6
                      },
                      ANGLE: {
                          type: ArgumentType.STRING,
                          defaultValue: "90"
                      }
                    }
                },
                {
                    opcode: 'readUltrasound',
                    text: formatMessage({
                        id: 'junkbotble.readUltrasound',
                        default: 'read ultrasound sensor [PORT]',
                        description: 'read distance from ultrasound sensor'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                      PORT: {
                          type: ArgumentType.STRING,
                          menu: 'setPort4Pin',
                          defaultValue: JunkbotDigitalPort.B1
                      }
                    }
                },
                {
                    opcode: 'runMotor',
                    text: formatMessage({
                        id: 'junkbotble.runMotor',
                        default: 'move motor [MOTOR] direction [DIRECTION] speed [SPEED]',
                        description: 'set value for digital pin'
                    }),
                    blockType: BlockType.COMMAND,
										arguments: {
                        MOTOR: {
                            type: ArgumentType.STRING,
                            menu: 'setMotor',
                            defaultValue: '2'
                        },
												DIRECTION: {
                            type: ArgumentType.STRING,
                            menu: 'setDirection',
                            defaultValue: '1'
                        },
												SPEED: {
                            type: ArgumentType.STRING,
                            defaultValue: '255'
                        }
										}
                },
                {
                    opcode: 'playTone',
                    text: formatMessage({
                        id: 'junkbotble.playTone',
                        default: 'play tone [PORT] on note [NOTE] beat [BEAT]',
                        description: 'play tone with note and beat'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                      PORT: {
                          type: ArgumentType.STRING,
                          menu: 'setPort3Pin',
                          defaultValue: JunkbotDigitalPort.B6
                      },
                      NOTE: {
                          type: ArgumentType.STRING,
                          menu: 'setNote',
                          defaultValue: ToneNote.C2
                      },
                      BEAT: {
                          type: ArgumentType.STRING,
                          menu: 'setBeat',
                          defaultValue: ToneBeat.Half
                      }
                    }
                },
                {
                    opcode: 'digitalWrite',
                    text: formatMessage({
                        id: 'junkbotble.digitalWrite',
                        default: 'set digital pin [PIN] output as [STATE]',
                        description: 'set value for digital pin'
                    }),
                    blockType: BlockType.COMMAND,
										arguments: {
                        STATE: {
                            type: ArgumentType.STRING,
                            menu: 'setValue',
                            defaultValue: '1'
                        },
												PIN: {
                            type: ArgumentType.STRING,
                            menu: 'setPin',
                            defaultValue: '13'
                        }
										}
                },
                {
                    opcode: 'digitalRead',
                    text: formatMessage({
                        id: 'junkbotble.digitalRead',
                        default: 'read digital pin [PIN]',
                        description: 'read the digital pin'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                      PIN: {
                          type: ArgumentType.STRING,
                          menu: 'setPin',
                          defaultValue: '13'
                      }
                    }
                },
                {
                    opcode: 'analogWrite',
                    text: formatMessage({
                        id: 'junkbotble.analogWrite',
                        default: 'set pwm pin [PIN] output as [VALUE]',
                        description: 'Set PWM pin'
                    }),
                    blockType: BlockType.COMMAND,
										arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: '0'
                        },
												PIN: {
                            type: ArgumentType.STRING,
                            menu: 'setPort',
                            defaultValue: JunkbotDigitalPort.B3
                        }
										}
                },
                {
                    opcode: 'setRGB',
                    text: formatMessage({
                        id: 'junkbotble.setRGB',
                        default: 'set R[PIN1]-[VALUE1] G[PIN2]-[VALUE2] B[PIN3]-[VALUE3]',
                        description: 'set value for digital pin'
                    }),
                    blockType: BlockType.COMMAND,
										arguments: {
                        VALUE1: {
                            type: ArgumentType.STRING,
                            defaultValue: '255'
                        },
												PIN1: {
                            type: ArgumentType.STRING,
                            menu: 'setPin',
                            defaultValue: '8'
                        },
                        VALUE2: {
                            type: ArgumentType.STRING,
                            defaultValue: '255'
                        },
												PIN2: {
                            type: ArgumentType.STRING,
                            menu: 'setPin',
                            defaultValue: '9'
                        },
                        VALUE3: {
                            type: ArgumentType.STRING,
                            defaultValue: '255'
                        },
												PIN3: {
                            type: ArgumentType.STRING,
                            menu: 'setPin',
                            defaultValue: '10'
                        }
										}
                },
                {
                    opcode: 'analogRead',
                    text: formatMessage({
                        id: 'junkbotble.analogRead',
                        default: 'read analog pin A [PIN]',
                        description: 'read analog pin'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                      PIN: {
                          type: ArgumentType.STRING,
                          defaultValue: '0'
                      }
                    }
                }
            ],
            menus: {
								setValue: {
                    acceptReporters: true,
                    items: this.VALUE_MENU
                },
								setPin: {
                    acceptReporters: true,
                    items: ['6', '7','8', '9', '10', '11', '12', '13']
                },
								setPort: {
									acceptReporters: true,
									items: this.PORTS_MENU
								},
								setPort4Pin: {
									acceptReporters: true,
									items: this.PORTS_MENU_4PIN
								},
								setPort3Pin: {
									acceptReporters: true,
									items: this.PORTS_MENU_3PIN
								},
								setAngle: {
                    acceptReporters: true,
                    items: ['0', '45','90', '180', '360']
                },
								setNote: {
                    acceptReporters: true,
                    items: this.NOTES
                },
								setBeat: {
                    acceptReporters: true,
                    items: this.BEATS
                },
                setDirection: {
									acceptReporters: true,
									items: this.DIRECTION_ARRAY
								},
                setMotor: {
									acceptReporters: true,
									items: this.MOTOR_PORT
								}
            }
        };
    }

    /**
     * Test whether the A or B button is pressed
     * @param {object} args - the block's arguments.
     * @return {Promise} - true if the button is pressed.
     */
		digitalWrite (args) {
        const value = parseInt(args.STATE, 10);
				const pin = parseInt(args.PIN, 10);
        this._peripheral.digitalWrite(pin,value);
        const yieldDelay = 120 * ((6 * value.length) + 6);

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, yieldDelay);
        });
    }

    /**
     * Test whether the A or B button is pressed
     * @param {object} args - the block's arguments.
     * @return {Promise} - true if the button is pressed.
     */
    jbDigitalWrite (args) {
        const value = String(args.STATE).substring(0, 19);
				const pin = parseInt(args.PIN, 10);
        this._peripheral.digitalWrite(pin,value);
        const yieldDelay = 120 * ((6 * value.length) + 6);

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, yieldDelay);
        });
    }

    /**
     * Test whether the A or B button is pressed
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if the button is pressed.
     */
    digitalRead (args) {
      //let pin_name = parseInt(args.PORT[0], 10);
      let pin_name = parseInt(args.PIN, 10);
      let pin = DigitalPin.indexOf(pin_name);
      this._peripheral.digitalRead(pin);
      let pattern = (0x01 << pin);
      const yieldDelay = 1000;
      return new Promise(resolve => {
          setTimeout(() => {
              resolve();
          }, yieldDelay);
      })
      .then(output => {
        let state = false;
        let result = (pattern & this._peripheral.digVal);
        if (pattern == result){
          state = true;
        }
        return state;
      });

    }

    /**
     * Test whether the A or B button is pressed
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if the button is pressed.
     */
    analogRead (args) {
      let pin = parseInt(args.PIN, 10);
      this._peripheral.analogRead(pin);
      const yieldDelay = 500;
      return new Promise(resolve => {
          setTimeout(() => {
              resolve();
          }, yieldDelay);
      })
      .then(output => {
        return this._peripheral.getAnalog;
      });

    }


    /**
     * Test whether the A or B button is pressed
     * @param {object} args - the block's arguments.
     * @return {integer} - distance of ultrasound
     */
    readUltrasound (args) {
      const echo = parseInt(args.PORT, 10);
      const trigger = echo + 1;
      this._peripheral.readUltrasound(trigger,echo);
      const yieldDelay = 500;
      return new Promise(resolve => {
          setTimeout(() => {
              resolve();
          }, yieldDelay);
      })
      .then(output => {
        return this._peripheral.getDistance;
      });
    }

    /**
     * Test whether the A or B button is pressed
     * @param {object} args - the block's arguments.
     * @return {Promise} - distance of ultrasound
     */
    setServo (args) {
        const angle = parseInt(args.ANGLE, 10);
				const pin = parseInt(args.PORT, 10);
        this._peripheral.setServo(pin,angle);
        const yieldDelay = 120 * ((6 * angle.length) + 6);

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, yieldDelay);
        });
    }

    /**
     * Test whether the A or B button is pressed
     * @param {object} args - the block's arguments.
     * @return {Promise} - distance of ultrasound
     */
    playTone (args) {
        const note = parseInt(args.NOTE, 10);
        const beat = parseInt(args.BEAT, 10);
				const pin = parseInt(args.PORT, 10);
        this._peripheral.playTone(pin,note,beat);
        const yieldDelay = beat;

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, yieldDelay);
        });
    }

    /**
     * Test whether the A or B button is pressed
     * @param {object} args - the block's arguments.
     * @return {Promise} - distance of ultrasound
     */
    analogWrite (args) {
        const value = String(args.VALUE).substring(0, 19);
				const pin = parseInt(args.PIN, 10);
        this._peripheral.analogWrite(pin,value);
        const yieldDelay = 120 * ((6 * value.length) + 6);

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, yieldDelay);
        });
    }

    /**
     * Test whether the A or B button is pressed
     * @param {object} args - the block's arguments.
     * @return {Promise} - distance of ultrasound
     */
    setRGB (args) {
        const value1 = String(args.VALUE1).substring(0, 19);
				const pin1 = parseInt(args.PIN1, 10);
        const value2 = String(args.VALUE2).substring(0, 19);
				const pin2 = parseInt(args.PIN2, 10);
        const value3 = String(args.VALUE3).substring(0, 19);
				const pin3 = parseInt(args.PIN3, 10);
        this._peripheral.setRGB(pin1,value1,pin2,value2,pin3,value3);
        const yieldDelay = 120 * ((6 * value3.length) + 6);

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, yieldDelay);
        });
    }

    /**
     * Test whether the A or B button is pressed
     * @param {object} args - the block's arguments.
     * @return {Promise} - distance of ultrasound
     */
    runMotor (args) {
        const pin = parseInt(args.MOTOR, 10);
				const direction = parseInt(args.DIRECTION, 10);
        const speed = parseInt(args.SPEED, 10);
        this._peripheral.runMotor(pin, direction, speed);
        const yieldDelay = 500;

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, yieldDelay);
        });
    }
}

module.exports = Scratch3JunkbotBlocks;
