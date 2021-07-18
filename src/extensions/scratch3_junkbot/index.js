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
    CMD_PIN_CONFIG: 0x80,
    CMD_DISPLAY_TEXT: 0x81,
    CMD_DISPLAY_LED: 0x82
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
class Junkbot {

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
            tiltX: 0,
            tiltY: 0,
            buttonA: 0,
            buttonB: 0,
            touchPins: [0, 0, 0],
            gestureState: 0,
            ledMatrixState: new Uint8Array(5)
        };

        /**
         * The most recently received value for each gesture.
         * @type {Object.<string, Object>}
         * @private
         */
        this._gestures = {
            moving: false,
            move: {
                active: false,
                timeout: false
            },
            shake: {
                active: false,
                timeout: false
            },
            jump: {
                active: false,
                timeout: false
            }
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

        this.reset = this.reset.bind(this);
        this._onConnect = this._onConnect.bind(this);
        this._onMessage = this._onMessage.bind(this);
    }

    /**
     * @param {string} text - the text to display.
     * @return {Promise} - a Promise that resolves when writing to peripheral.
     */
    displayText (text) {
        const output = new Uint8Array(text.length);
        for (let i = 0; i < text.length; i++) {
            output[i] = text.charCodeAt(i);
        }
        return this.send(BLECommand.CMD_DISPLAY_TEXT, output);
    }

    /**
     * @param {Uint8Array} matrix - the matrix to display.
     * @return {Promise} - a Promise that resolves when writing to peripheral.
     */
    displayMatrix (matrix) {
        return this.send(BLECommand.CMD_DISPLAY_LED, matrix);
    }

    /**
     * @return {number} - the latest value received for the tilt sensor's tilt about the X axis.
     */
    get tiltX () {
        return this._sensors.tiltX;
    }

    /**
     * @return {number} - the latest value received for the tilt sensor's tilt about the Y axis.
     */
    get tiltY () {
        return this._sensors.tiltY;
    }

    /**
     * @return {boolean} - the latest value received for the A button.
     */
    get buttonA () {
        return this._sensors.buttonA;
    }

    /**
     * @return {boolean} - the latest value received for the B button.
     */
    get buttonB () {
        return this._sensors.buttonB;
    }

    /**
     * @return {number} - the latest value received for the motion gesture states.
     */
    get gestureState () {
        return this._sensors.gestureState;
    }

    /**
     * @return {Uint8Array} - the current state of the 5x5 LED matrix.
     */
    get ledMatrixState () {
        return this._sensors.ledMatrixState;
    }

    /**
     * Called by the runtime when user wants to scan for a peripheral.
     */
    scan () {
        if (this._ble) {
            this._ble.disconnect();
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
        }
    }

    /**
     * Disconnect from the micro:bit.
     */
    disconnect () {
        if (this._ble) {
            this._ble.disconnect();
        }

        this.reset();
    }

    /**
     * Reset all the state and timeout/interval ids.
     */
    reset () {
        if (this._timeoutID) {
            window.clearTimeout(this._timeoutID);
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

        const output = new Uint8Array(message.length + 1);
        output[0] = command; // attach command to beginning of message
        for (let i = 0; i < message.length; i++) {
            output[i + 1] = message[i];
        }
        const data = Base64Util.uint8ArrayToBase64(output);

        this._ble.write(BLEUUID.service, BLEUUID.txChar, data, 'base64', true).then(
            () => {
                this._busy = false;
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
        this._timeoutID = window.setTimeout(
            () => this._ble.handleDisconnectError(BLEDataStoppedError),
            BLETimeout
        );
    }

    /**
     * Process the sensor data from the incoming BLE characteristic.
     * @param {object} base64 - the incoming BLE data.
     * @private
     */
    _onMessage (base64) {
        // parse data
        const data = Base64Util.base64ToUint8Array(base64);

        this._sensors.tiltX = data[1] | (data[0] << 8);
        if (this._sensors.tiltX > (1 << 15)) this._sensors.tiltX -= (1 << 16);
        this._sensors.tiltY = data[3] | (data[2] << 8);
        if (this._sensors.tiltY > (1 << 15)) this._sensors.tiltY -= (1 << 16);

        this._sensors.buttonA = data[4];
        this._sensors.buttonB = data[5];

        this._sensors.touchPins[0] = data[6];
        this._sensors.touchPins[1] = data[7];
        this._sensors.touchPins[2] = data[8];

        this._sensors.gestureState = data[9];

        // cancel disconnect timeout and start a new one
        window.clearTimeout(this._timeoutID);
        this._timeoutID = window.setTimeout(
            () => this._ble.handleDisconnectError(BLEDataStoppedError),
            BLETimeout
        );
    }

    /**
     * @param {number} pin - the pin to check touch state.
     * @return {number} - the latest value received for the touch pin states.
     * @private
     */
    _checkPinState (pin) {
        return this._sensors.touchPins[pin];
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
 * Enum for micro:bit gestures.
 * @readonly
 * @enum {string}
 */
const JunkbotGestures = {
    MOVED: 'moved',
    SHAKEN: 'shaken',
    JUMPED: 'jumped'
};

/**
 * Enum for micro:bit buttons.
 * @readonly
 * @enum {string}
 */
const JunkbotButtons = {
    A: 'A',
    B: 'B',
    ANY: 'any'
};

/**
 * Enum for micro:bit pin states.
 * @readonly
 * @enum {string}
 */
const JunkbotPinState = {
    ON: 'on',
    OFF: 'off'
};

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
        return 'junkbot';
    }

    /**
     * @return {number} - the tilt sensor counts as "tilted" if its tilt angle meets or exceeds this threshold.
     */
    static get TILT_THRESHOLD () {
        return 15;
    }

    /**
     * @return {array} - text and values for each buttons menu element
     */
    get BUTTONS_MENU () {
        return [
            {
                text: 'A',
                value: JunkbotButtons.A
            },
            {
                text: 'B',
                value: JunkbotButtons.B
            },
            {
                text: formatMessage({
                    id: 'junkbot.buttonsMenu.any',
                    default: 'any',
                    description: 'label for "any" element in button picker for Junkbot extension'
                }),
                value: JunkbotButtons.ANY
            }
        ];
    }

    /**
     * @return {array} - text and values for each gestures menu element
     */
    get GESTURES_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'junkbot.gesturesMenu.moved',
                    default: 'moved',
                    description: 'label for moved gesture in gesture picker for Junkbot extension'
                }),
                value: JunkbotGestures.MOVED
            },
            {
                text: formatMessage({
                    id: 'junkbot.gesturesMenu.shaken',
                    default: 'shaken',
                    description: 'label for shaken gesture in gesture picker for Junkbot extension'
                }),
                value: JunkbotGestures.SHAKEN
            },
            {
                text: formatMessage({
                    id: 'junkbot.gesturesMenu.jumped',
                    default: 'jumped',
                    description: 'label for jumped gesture in gesture picker for Junkbot extension'
                }),
                value: JunkbotGestures.JUMPED
            }
        ];
    }

    /**
     * @return {array} - text and values for each pin state menu element
     */
    get PIN_STATE_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'junkbot.pinStateMenu.on',
                    default: 'on',
                    description: 'label for on element in pin state picker for Junkbot extension'
                }),
                value: JunkbotPinState.ON
            },
            {
                text: formatMessage({
                    id: 'junkbot.pinStateMenu.off',
                    default: 'off',
                    description: 'label for off element in pin state picker for Junkbot extension'
                }),
                value: JunkbotPinState.OFF
            }
        ];
    }

    /**
     * @return {array} - text and values for each tilt direction menu element
     */
    get TILT_DIRECTION_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'junkbot.tiltDirectionMenu.front',
                    default: 'front',
                    description: 'label for front element in tilt direction picker for Junkbot extension'
                }),
                value: JunkbotTiltDirection.FRONT
            },
            {
                text: formatMessage({
                    id: 'junkbot.tiltDirectionMenu.back',
                    default: 'back',
                    description: 'label for back element in tilt direction picker for Junkbot extension'
                }),
                value: JunkbotTiltDirection.BACK
            },
            {
                text: formatMessage({
                    id: 'junkbot.tiltDirectionMenu.left',
                    default: 'left',
                    description: 'label for left element in tilt direction picker for Junkbot extension'
                }),
                value: JunkbotTiltDirection.LEFT
            },
            {
                text: formatMessage({
                    id: 'junkbot.tiltDirectionMenu.right',
                    default: 'right',
                    description: 'label for right element in tilt direction picker for Junkbot extension'
                }),
                value: JunkbotTiltDirection.RIGHT
            }
        ];
    }

    /**
     * @return {array} - text and values for each tilt direction (plus "any") menu element
     */
    get TILT_DIRECTION_ANY_MENU () {
        return [
            ...this.TILT_DIRECTION_MENU,
            {
                text: formatMessage({
                    id: 'junkbot.tiltDirectionMenu.any',
                    default: 'any',
                    description: 'label for any direction element in tilt direction picker for Junkbot extension'
                }),
                value: JunkbotTiltDirection.ANY
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

        // Create a new MicroBit peripheral instance
        this._peripheral = new Junkbot(this.runtime, Scratch3JunkbotBlocks.EXTENSION_ID);
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
                    opcode: 'whenButtonPressed',
                    text: formatMessage({
                        id: 'junkbot.whenButtonPressed',
                        default: 'when [BTN] button pressed',
                        description: 'when the selected button on the Junkbot is pressed'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'buttons',
                            defaultValue: JunkbotButtons.A
                        }
                    }
                },
                {
                    opcode: 'isButtonPressed',
                    text: formatMessage({
                        id: 'junkbot.isButtonPressed',
                        default: '[BTN] button pressed?',
                        description: 'is the selected button on the Junkbot pressed?'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'buttons',
                            defaultValue: JunkbotButtons.A
                        }
                    }
                },
                '---',
                {
                    opcode: 'whenGesture',
                    text: formatMessage({
                        id: 'junkbot.whenGesture',
                        default: 'when [GESTURE]',
                        description: 'when the selected gesture is detected by the Junkbot'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        GESTURE: {
                            type: ArgumentType.STRING,
                            menu: 'gestures',
                            defaultValue: JunkbotGestures.MOVED
                        }
                    }
                },
                '---',
                {
                    opcode: 'displaySymbol',
                    text: formatMessage({
                        id: 'junkbot.displaySymbol',
                        default: 'display [MATRIX]',
                        description: 'display a pattern on the Junkbot display'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        MATRIX: {
                            type: ArgumentType.MATRIX,
                            defaultValue: '0101010101100010101000100'
                        }
                    }
                },
                {
                    opcode: 'displayText',
                    text: formatMessage({
                        id: 'junkbot.displayText',
                        default: 'display text [TEXT]',
                        description: 'display text on the Junkbot display'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'junkbot.defaultTextToDisplay',
                                default: 'Hello!',
                                description: `default text to display.
                                IMPORTANT - the Junkbot only supports letters a-z, A-Z.
                                Please substitute a default word in your language
                                that can be written with those characters,
                                substitute non-accented characters or leave it as "Hello!".
                                Check the Junkbot site documentation for details`
                            })
                        }
                    }
                },
                {
                    opcode: 'displayClear',
                    text: formatMessage({
                        id: 'junkbot.clearDisplay',
                        default: 'clear display',
                        description: 'display nothing on the Junkbot display'
                    }),
                    blockType: BlockType.COMMAND
                },
                '---',
                {
                    opcode: 'whenTilted',
                    text: formatMessage({
                        id: 'junkbot.whenTilted',
                        default: 'when tilted [DIRECTION]',
                        description: 'when the Junkbot is tilted in a direction'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        DIRECTION: {
                            type: ArgumentType.STRING,
                            menu: 'tiltDirectionAny',
                            defaultValue: JunkbotTiltDirection.ANY
                        }
                    }
                },
                {
                    opcode: 'isTilted',
                    text: formatMessage({
                        id: 'junkbot.isTilted',
                        default: 'tilted [DIRECTION]?',
                        description: 'is the Junkbot is tilted in a direction?'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        DIRECTION: {
                            type: ArgumentType.STRING,
                            menu: 'tiltDirectionAny',
                            defaultValue: JunkbotTiltDirection.ANY
                        }
                    }
                },
                {
                    opcode: 'getTiltAngle',
                    text: formatMessage({
                        id: 'junkbot.tiltAngle',
                        default: 'tilt angle [DIRECTION]',
                        description: 'how much the Junkbot is tilted in a direction'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        DIRECTION: {
                            type: ArgumentType.STRING,
                            menu: 'tiltDirection',
                            defaultValue: JunkbotTiltDirection.FRONT
                        }
                    }
                },
                '---',
                {
                    opcode: 'whenPinConnected',
                    text: formatMessage({
                        id: 'junkbot.whenPinConnected',
                        default: 'when pin [PIN] connected',
                        description: 'when the pin detects a connection to Earth/Ground'

                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'touchPins',
                            defaultValue: '0'
                        }
                    }
                }
            ],
            menus: {
                buttons: {
                    acceptReporters: true,
                    items: this.BUTTONS_MENU
                },
                gestures: {
                    acceptReporters: true,
                    items: this.GESTURES_MENU
                },
                pinState: {
                    acceptReporters: true,
                    items: this.PIN_STATE_MENU
                },
                tiltDirection: {
                    acceptReporters: true,
                    items: this.TILT_DIRECTION_MENU
                },
                tiltDirectionAny: {
                    acceptReporters: true,
                    items: this.TILT_DIRECTION_ANY_MENU
                },
                touchPins: {
                    acceptReporters: true,
                    items: ['0', '1', '2']
                }
            }
        };
    }

    /**
     * Test whether the A or B button is pressed
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if the button is pressed.
     */
    whenButtonPressed (args) {
        if (args.BTN === 'any') {
            return this._peripheral.buttonA | this._peripheral.buttonB;
        } else if (args.BTN === 'A') {
            return this._peripheral.buttonA;
        } else if (args.BTN === 'B') {
            return this._peripheral.buttonB;
        }
        return false;
    }

    /**
     * Test whether the A or B button is pressed
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if the button is pressed.
     */
    isButtonPressed (args) {
        if (args.BTN === 'any') {
            return (this._peripheral.buttonA | this._peripheral.buttonB) !== 0;
        } else if (args.BTN === 'A') {
            return this._peripheral.buttonA !== 0;
        } else if (args.BTN === 'B') {
            return this._peripheral.buttonB !== 0;
        }
        return false;
    }

    /**
     * Test whether the micro:bit is moving
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if the micro:bit is moving.
     */
    whenGesture (args) {
        const gesture = cast.toString(args.GESTURE);
        if (gesture === 'moved') {
            return (this._peripheral.gestureState >> 2) & 1;
        } else if (gesture === 'shaken') {
            return this._peripheral.gestureState & 1;
        } else if (gesture === 'jumped') {
            return (this._peripheral.gestureState >> 1) & 1;
        }
        return false;
    }

    /**
     * Display a predefined symbol on the 5x5 LED matrix.
     * @param {object} args - the block's arguments.
     * @return {Promise} - a Promise that resolves after a tick.
     */
    displaySymbol (args) {
        const symbol = cast.toString(args.MATRIX).replace(/\s/g, '');
        const reducer = (accumulator, c, index) => {
            const value = (c === '0') ? accumulator : accumulator + Math.pow(2, index);
            return value;
        };
        const hex = symbol.split('').reduce(reducer, 0);
        if (hex !== null) {
            this._peripheral.ledMatrixState[0] = hex & 0x1F;
            this._peripheral.ledMatrixState[1] = (hex >> 5) & 0x1F;
            this._peripheral.ledMatrixState[2] = (hex >> 10) & 0x1F;
            this._peripheral.ledMatrixState[3] = (hex >> 15) & 0x1F;
            this._peripheral.ledMatrixState[4] = (hex >> 20) & 0x1F;
            this._peripheral.displayMatrix(this._peripheral.ledMatrixState);
        }

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, BLESendInterval);
        });
    }

    /**
     * Display text on the 5x5 LED matrix.
     * @param {object} args - the block's arguments.
     * @return {Promise} - a Promise that resolves after the text is done printing.
     * Note the limit is 19 characters
     * The print time is calculated by multiplying the number of horizontal pixels
     * by the default scroll delay of 120ms.
     * The number of horizontal pixels = 6px for each character in the string,
     * 1px before the string, and 5px after the string.
     */
    displayText (args) {
        const text = String(args.TEXT).substring(0, 19);
        if (text.length > 0) this._peripheral.displayText(text);
        const yieldDelay = 120 * ((6 * text.length) + 6);

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, yieldDelay);
        });
    }

    /**
     * Turn all 5x5 matrix LEDs off.
     * @return {Promise} - a Promise that resolves after a tick.
     */
    displayClear () {
        for (let i = 0; i < 5; i++) {
            this._peripheral.ledMatrixState[i] = 0;
        }
        this._peripheral.displayMatrix(this._peripheral.ledMatrixState);

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, BLESendInterval);
        });
    }

    /**
     * Test whether the tilt sensor is currently tilted.
     * @param {object} args - the block's arguments.
     * @property {TiltDirection} DIRECTION - the tilt direction to test (front, back, left, right, or any).
     * @return {boolean} - true if the tilt sensor is tilted past a threshold in the specified direction.
     */
    whenTilted (args) {
        return this._isTilted(args.DIRECTION);
    }

    /**
     * Test whether the tilt sensor is currently tilted.
     * @param {object} args - the block's arguments.
     * @property {TiltDirection} DIRECTION - the tilt direction to test (front, back, left, right, or any).
     * @return {boolean} - true if the tilt sensor is tilted past a threshold in the specified direction.
     */
    isTilted (args) {
        return this._isTilted(args.DIRECTION);
    }

    /**
     * @param {object} args - the block's arguments.
     * @property {TiltDirection} DIRECTION - the direction (front, back, left, right) to check.
     * @return {number} - the tilt sensor's angle in the specified direction.
     * Note that getTiltAngle(front) = -getTiltAngle(back) and getTiltAngle(left) = -getTiltAngle(right).
     */
    getTiltAngle (args) {
        return this._getTiltAngle(args.DIRECTION);
    }

    /**
     * Test whether the tilt sensor is currently tilted.
     * @param {TiltDirection} direction - the tilt direction to test (front, back, left, right, or any).
     * @return {boolean} - true if the tilt sensor is tilted past a threshold in the specified direction.
     * @private
     */
    _isTilted (direction) {
        switch (direction) {
        case JunkbotTiltDirection.ANY:
            return (Math.abs(this._peripheral.tiltX / 10) >= Scratch3JunkbotBlocks.TILT_THRESHOLD) ||
                (Math.abs(this._peripheral.tiltY / 10) >= Scratch3JunkbotBlocks.TILT_THRESHOLD);
        default:
            return this._getTiltAngle(direction) >= Scratch3JunkbotBlocks.TILT_THRESHOLD;
        }
    }

    /**
     * @param {TiltDirection} direction - the direction (front, back, left, right) to check.
     * @return {number} - the tilt sensor's angle in the specified direction.
     * Note that getTiltAngle(front) = -getTiltAngle(back) and getTiltAngle(left) = -getTiltAngle(right).
     * @private
     */
    _getTiltAngle (direction) {
        switch (direction) {
        case JunkbotTiltDirection.FRONT:
            return Math.round(this._peripheral.tiltY / -10);
        case JunkbotTiltDirection.BACK:
            return Math.round(this._peripheral.tiltY / 10);
        case JunkbotTiltDirection.LEFT:
            return Math.round(this._peripheral.tiltX / -10);
        case JunkbotTiltDirection.RIGHT:
            return Math.round(this._peripheral.tiltX / 10);
        default:
            log.warn(`Unknown tilt direction in _getTiltAngle: ${direction}`);
        }
    }

    /**
     * @param {object} args - the block's arguments.
     * @return {boolean} - the touch pin state.
     * @private
     */
    whenPinConnected (args) {
        const pin = parseInt(args.PIN, 10);
        if (isNaN(pin)) return;
        if (pin < 0 || pin > 2) return false;
        return this._peripheral._checkPinState(pin);
    }
}

module.exports = Scratch3JunkbotBlocks;
