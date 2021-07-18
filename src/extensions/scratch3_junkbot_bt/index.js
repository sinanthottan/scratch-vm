const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');
const uid = require('../../util/uid');
const BT = require('../../io/bt');
const Base64Util = require('../../util/base64-util');
const MathUtil = require('../../util/math-util');
const RateLimiter = require('../../util/rateLimiter.js');
const log = require('../../util/log');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,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';

/**
 * String with JB expected pairing pin.
 * @readonly
 */
const JBPairingPin = '1234';

/**
 * A maximum number of BT message sends per second, to be enforced by the rate limiter.
 * @type {number}
 */
const BTSendRateMax = 40;

/**
 * Enum for JB parameter encodings of various argument and return values.
 * Found in the 'JB Firmware Developer Kit', section4, page 9, at
 * https://education.lego.com/en-us/support/mindstorms-JB/developer-kits.
 *
 * The format for these values is:
 * 0xxxxxxx for Short Format
 * 1ttt-bbb for Long Format
 *
 * @readonly
 * @enum {number}
 */
const JBEncoding = {
    ONE_BYTE: 0x81, // = 0b1000-001, "1 byte to follow"
    TWO_BYTES: 0x82, // = 0b1000-010, "2 bytes to follow"
    FOUR_BYTES: 0x83, // = 0b1000-011, "4 bytes to follow"
    GLOBAL_VARIABLE_ONE_BYTE: 0xE1, // = 0b1110-001, "1 byte to follow"
    GLOBAL_CONSTANT_INDEX_0: 0x20, // = 0b00100000
    GLOBAL_VARIABLE_INDEX_0: 0x60 // = 0b01100000
};

/**
 * Enum for JB direct command types.
 * Found in the 'JB Communication Developer Kit', section 4, page 24, at
 * https://education.lego.com/en-us/support/mindstorms-JB/developer-kits.
 * @readonly
 * @enum {number}
 */
const JBCommand = {
    DIRECT_COMMAND_REPLY: 0x00,
    DIRECT_COMMAND_NO_REPLY: 0x80,
    DIRECT_REPLY: 0x02
};

/**
 * Enum for JB commands opcodes.
 * Found in the 'JB Firmware Developer Kit', section 4, page 10, at
 * https://education.lego.com/en-us/support/mindstorms-JB/developer-kits.
 * @readonly
 * @enum {number}
 */
const JBOpcode = {
    OPOUTPUT_STEP_SPEED: 0xAE,
    OPOUTPUT_TIME_SPEED: 0xAF,
    OPOUTPUT_STOP: 0xA3,
    OPOUTPUT_RESET: 0xA2,
    OPOUTPUT_STEP_SYNC: 0xB0,
    OPOUTPUT_TIME_SYNC: 0xB1,
    OPOUTPUT_GET_COUNT: 0xB3,
    OPSOUND: 0x94,
    OPSOUND_CMD_TONE: 1,
    OPSOUND_CMD_STOP: 0,
    OPINPUT_DEVICE_LIST: 0x98,
    OPINPUT_READSI: 0x9D
};

/**
 * Enum for JB values used as arguments to various opcodes.
 * Found in the 'JB Firmware Developer Kit', section4, page 10-onwards, at
 * https://education.lego.com/en-us/support/mindstorms-JB/developer-kits.
 * @readonly
 * @enum {number}
 */
const JBArgs = {
    LAYER: 0, // always 0, chained JBs not supported
    COAST: 0,
    BRAKE: 1,
    RAMP: 50, // time in milliseconds
    DO_NOT_CHANGE_TYPE: 0,
    MAX_DEVICES: 32 // 'Normally 32' from pg. 46
};

/**
 * Enum for JB device type numbers.
 * Found in the 'JB Firmware Developer Kit', section 5, page 100, at
 * https://education.lego.com/en-us/support/mindstorms-JB/developer-kits.
 * @readonly
 * @enum {string}
 */
const JBDevice = {
    29: 'color',
    30: 'ultrasonic',
    32: 'gyro',
    16: 'touch',
    8: 'mediumMotor',
    7: 'largeMotor',
    126: 'none',
    125: 'none'
};

/**
 * Enum for JB device modes.
 * Found in the 'JB Firmware Developer Kit', section 5, page 100, at
 * https://education.lego.com/en-us/support/mindstorms-JB/developer-kits.
 * @readonly
 * @enum {number}
 */
const JBMode = {
    touch: 0, // touch
    color: 1, // ambient
    ultrasonic: 1, // inch
    none: 0
};

/**
 * Enum for JB device labels used in the Scratch blocks/UI.
 * @readonly
 * @enum {string}
 */
const JBLabel = {
    touch: 'button',
    color: 'brightness',
    ultrasonic: 'distance'
};

/**
 * Manage power, direction, and timers for one JB motor.
 */
class JBMotor {

    /**
     * Construct a JB Motor instance, which could be of type 'largeMotor' or
     * 'mediumMotor'.
     *
     * @param {JB} parent - the JB peripheral which owns this motor.
     * @param {int} index - the zero-based index of this motor on its parent peripheral.
     * @param {string} type - the type of motor (i.e. 'largeMotor' or 'mediumMotor').
     */
    constructor (parent, index, type) {
        /**
         * The JB peripheral which owns this motor.
         * @type {JB}
         * @private
         */
        this._parent = parent;

        /**
         * The zero-based index of this motor on its parent peripheral.
         * @type {int}
         * @private
         */
        this._index = index;

        /**
         * The type of JB motor this could be: 'largeMotor' or 'mediumMotor'.
         * @type {string}
         * @private
         */
        this._type = type;

        /**
         * This motor's current direction: 1 for "clockwise" or -1 for "counterclockwise"
         * @type {number}
         * @private
         */
        this._direction = 1;

        /**
         * This motor's current power level, in the range [0,100].
         * @type {number}
         * @private
         */
        this._power = 50;

        /**
         * This motor's current position, in the range [0,360].
         * @type {number}
         * @private
         */
        this._position = 0;

        /**
         * An ID for the current coast command, to help override multiple coast
         * commands sent in succession.
         * @type {number}
         * @private
         */
        this._commandID = null;

        /**
         * A delay, in milliseconds, to add to coasting, to make sure that a brake
         * first takes effect if one was sent.
         * @type {number}
         * @private
         */
        this._coastDelay = 1000;
    }

    /**
     * @return {string} - this motor's type: 'largeMotor' or 'mediumMotor'
     */
    get type () {
        return this._type;
    }

    /**
     * @param {string} value - this motor's new type: 'largeMotor' or 'mediumMotor'
     */
    set type (value) {
        this._type = value;
    }

    /**
     * @return {int} - this motor's current direction: 1 for "clockwise" or -1 for "counterclockwise"
     */
    get direction () {
        return this._direction;
    }

    /**
     * @param {int} value - this motor's new direction: 1 for "clockwise" or -1 for "counterclockwise"
     */
    set direction (value) {
        if (value < 0) {
            this._direction = -1;
        } else {
            this._direction = 1;
        }
    }

    /**
     * @return {int} - this motor's current power level, in the range [0,100].
     */
    get power () {
        return this._power;
    }

    /**
     * @param {int} value - this motor's new power level, in the range [0,100].
     */
    set power (value) {
        this._power = value;
    }

    /**
     * @return {int} - this motor's current position, in the range [-inf,inf].
     */
    get position () {
        return this._position;
    }

    /**
     * @param {int} array - this motor's new position, in the range [0,360].
     */
    set position (array) {
        // tachoValue from Paula
        let value = array[0] + (array[1] * 256) + (array[2] * 256 * 256) + (array[3] * 256 * 256 * 256);
        if (value > 0x7fffffff) {
            value = value - 0x100000000;
        }
        this._position = value;
    }

    /**
     * Turn this motor on for a specific duration.
     * Found in the 'JB Firmware Developer Kit', page 56, at
     * https://education.lego.com/en-us/support/mindstorms-JB/developer-kits.
     *
     * Opcode arguments:
     * (Data8) LAYER – Specify chain layer number [0 - 3]
     * (Data8) NOS – Output bit field [0x00 – 0x0F]
     * (Data8) SPEED – Power level, [-100 – 100]
     * (Data32) STEP1 – Time in milliseconds for ramp up
     * (Data32) STEP2 – Time in milliseconds for continues run
     * (Data32) STEP3 – Time in milliseconds for ramp down
     * (Data8) BRAKE - Specify break level [0: Float, 1: Break]
     *
     * @param {number} milliseconds - run the motor for this long.
     */
    turnOnFor (milliseconds) {
        if (this._power === 0) return;

        const port = this._portMask(this._index);
        let n = milliseconds;
        let speed = this._power * this._direction;
        const ramp = JBArgs.RAMP;

        let byteCommand = [];
        byteCommand[0] = JBOpcode.OPOUTPUT_TIME_SPEED;

        // If speed is less than zero, make it positive and multiply the input
        // value by -1
        if (speed < 0) {
            speed = -1 * speed;
            n = -1 * n;
        }
        // If the input value is less than 0
        const dir = (n < 0) ? 0x100 - speed : speed; // step negative or positive
        n = Math.abs(n);
        // Setup motor run duration and ramping behavior
        let rampup = ramp;
        let rampdown = ramp;
        let run = n - (ramp * 2);
        if (run < 0) {
            rampup = Math.floor(n / 2);
            run = 0;
            rampdown = n - rampup;
        }
        // Generate motor command values
        const runcmd = this._runValues(run);
        byteCommand = byteCommand.concat([
            JBArgs.LAYER,
            port,
            JBEncoding.ONE_BYTE,
            dir & 0xff,
            JBEncoding.ONE_BYTE,
            rampup
        ]).concat(runcmd.concat([
            JBEncoding.ONE_BYTE,
            rampdown,
            JBArgs.BRAKE
        ]));

        const cmd = this._parent.generateCommand(
            JBCommand.DIRECT_COMMAND_NO_REPLY,
            byteCommand
        );

        this._parent.send(cmd);

        this.coastAfter(milliseconds);
    }

    /**
     * Set the motor to coast after a specified amount of time.
     * @param {number} time - the time in milliseconds.
     */
    coastAfter (time) {
        if (this._power === 0) return;

        // Set the motor command id to check before starting coast
        const commandId = uid();
        this._commandID = commandId;

        // Send coast message
        setTimeout(() => {
            // Do not send coast if another motor command changed the command id.
            if (this._commandID === commandId) {
                this.coast();
                this._commandID = null;
            }
        }, time + this._coastDelay); // add a delay so the brake takes effect
    }

    /**
     * Set the motor to coast.
     */
    coast () {
        if (this._power === 0) return;

        const cmd = this._parent.generateCommand(
            JBCommand.DIRECT_COMMAND_NO_REPLY,
            [
                JBOpcode.OPOUTPUT_STOP,
                JBArgs.LAYER,
                this._portMask(this._index), // port output bit field
                JBArgs.COAST
            ]
        );

        this._parent.send(cmd, false); // don't use rate limiter to ensure motor stops
    }

    /**
     * Generate motor run values for a given input.
     * @param  {number} run - run input.
     * @return {array} - run values as a byte array.
     */
    _runValues (run) {
        // If run duration is less than max 16-bit integer
        if (run < 0x7fff) {
            return [
                JBEncoding.TWO_BYTES,
                run & 0xff,
                (run >> 8) & 0xff
            ];
        }

        // Run forever
        return [
            JBEncoding.FOUR_BYTES,
            run & 0xff,
            (run >> 8) & 0xff,
            (run >> 16) & 0xff,
            (run >> 24) & 0xff
        ];
    }

    /**
     * Return a port value for the JB that is in the format for 'output bit field'
     * as 1/2/4/8, generally needed for motor ports, instead of the typical 0/1/2/3.
     * The documentation in the 'JB Firmware Developer Kit' for motor port arguments
     * is sometimes mistaken, but we believe motor ports are mostly addressed this way.
     * @param {number} port - the port number to convert to an 'output bit field'.
     * @return {number} - the converted port number.
     */
    _portMask (port) {
        return Math.pow(2, port);
    }
}

class JB {

    constructor (runtime, extensionId) {

        /**
         * The Scratch 3.0 runtime used to trigger the green flag button.
         * @type {Runtime}
         * @private
         */
        this._runtime = runtime;
        this._runtime.on('PROJECT_STOP_ALL', this.stopAll.bind(this));

        /**
         * The id of the extension this peripheral belongs to.
         */
        this._extensionId = extensionId;

        /**
         * A list of the names of the sensors connected in ports 1,2,3,4.
         * @type {string[]}
         * @private
         */
        this._sensorPorts = [];

        /**
         * A list of the names of the motors connected in ports A,B,C,D.
         * @type {string[]}
         * @private
         */
        this._motorPorts = [];

        /**
         * The state of all sensor values.
         * @type {string[]}
         * @private
         */
        this._sensors = {
            distance: 0,
            brightness: 0,
            buttons: [0, 0, 0, 0]
        };

        /**
         * The motors which this JB could possibly have connected.
         * @type {string[]}
         * @private
         */
        this._motors = [null, null, null, null];

        /**
         * The polling interval, in milliseconds.
         * @type {number}
         * @private
         */
        this._pollingInterval = 150;

        /**
         * The polling interval ID.
         * @type {number}
         * @private
         */
        this._pollingIntervalID = null;

        /**
         * The counter keeping track of polling cycles.
         * @type {string[]}
         * @private
         */
        this._pollingCounter = 0;

        /**
         * The Bluetooth socket connection for reading/writing peripheral data.
         * @type {BT}
         * @private
         */
        this._bt = null;
        this._runtime.registerPeripheralExtension(extensionId, this);

        /**
         * A rate limiter utility, to help limit the rate at which we send BT messages
         * over the socket to Scratch Link to a maximum number of sends per second.
         * @type {RateLimiter}
         * @private
         */
        this._rateLimiter = new RateLimiter(BTSendRateMax);

        this.reset = this.reset.bind(this);
        this._onConnect = this._onConnect.bind(this);
        this._onMessage = this._onMessage.bind(this);
        this._pollValues = this._pollValues.bind(this);
    }

    get distance () {
        let value = this._sensors.distance > 100 ? 100 : this._sensors.distance;
        value = value < 0 ? 0 : value;
        value = Math.round(100 * value) / 100;

        return value;
    }

    get brightness () {
        return this._sensors.brightness;
    }

    /**
     * Access a particular motor on this peripheral.
     * @param {int} index - the zero-based index of the desired motor.
     * @return {JBMotor} - the JBMotor instance, if any, at that index.
     */
    motor (index) {
        return this._motors[index];
    }

    isButtonPressed (port) {
        return this._sensors.buttons[port] === 1;
    }

    beep (freq, time) {
        const cmd = this.generateCommand(
            JBCommand.DIRECT_COMMAND_NO_REPLY,
            [
                JBOpcode.OPSOUND,
                JBOpcode.OPSOUND_CMD_TONE,
                JBEncoding.ONE_BYTE,
                2,
                JBEncoding.TWO_BYTES,
                freq,
                freq >> 8,
                JBEncoding.TWO_BYTES,
                time,
                time >> 8
            ]
        );

        this.send(cmd);
    }

    stopAll () {
        this.stopAllMotors();
        this.stopSound();
    }

    stopSound () {
        const cmd = this.generateCommand(
            JBCommand.DIRECT_COMMAND_NO_REPLY,
            [
                JBOpcode.OPSOUND,
                JBOpcode.OPSOUND_CMD_STOP
            ]
        );

        this.send(cmd, false); // don't use rate limiter to ensure sound stops
    }

    stopAllMotors () {
        this._motors.forEach(motor => {
            if (motor) {
                motor.coast();
            }
        });
    }

    /**
     * Called by the runtime when user wants to scan for an JB peripheral.
     */
    scan () {
        if (this._bt) {
            this._bt.disconnect();
        }
        this._bt = new BT(this._runtime, this._extensionId, {
            majorDeviceClass: 8,
            minorDeviceClass: 1
        }, this._onConnect, this.reset, this._onMessage);
    }

    /**
     * Called by the runtime when user wants to connect to a certain JB peripheral.
     * @param {number} id - the id of the peripheral to connect to.
     */
    connect (id) {
        if (this._bt) {
            this._bt.connectPeripheral(id, JBPairingPin);
        }
    }

    /**
     * Called by the runtime when user wants to disconnect from the JB peripheral.
     */
    disconnect () {
        if (this._bt) {
            this._bt.disconnect();
        }

        this.reset();
    }

    /**
     * Reset all the state and timeout/interval ids.
     */
    reset () {
        this._sensorPorts = [];
        this._motorPorts = [];
        this._sensors = {
            distance: 0,
            brightness: 0,
            buttons: [0, 0, 0, 0]
        };
        this._motors = [null, null, null, null];

        if (this._pollingIntervalID) {
            window.clearInterval(this._pollingIntervalID);
            this._pollingIntervalID = null;
        }
    }

    /**
     * Called by the runtime to detect whether the JB peripheral is connected.
     * @return {boolean} - the connected state.
     */
    isConnected () {
        let connected = false;
        if (this._bt) {
            connected = this._bt.isConnected();
        }
        return connected;
    }

    /**
     * Send a message to the peripheral BT socket.
     * @param {Uint8Array} message - the message to send.
     * @param {boolean} [useLimiter=true] - if true, use the rate limiter
     * @return {Promise} - a promise result of the send operation.
     */
    send (message, useLimiter = true) {
        if (!this.isConnected()) return Promise.resolve();

        if (useLimiter) {
            if (!this._rateLimiter.okayToSend()) return Promise.resolve();
        }

        return this._bt.sendMessage({
            message: Base64Util.uint8ArrayToBase64(message),
            encoding: 'base64'
        });
    }

    /**
     * Genrates direct commands that are sent to the JB as a single or compounded byte arrays.
     * See 'JB Communication Developer Kit', section 4, page 24 at
     * https://education.lego.com/en-us/support/mindstorms-JB/developer-kits.
     *
     * Direct commands are one of two types:
     * DIRECT_COMMAND_NO_REPLY = a direct command where no reply is expected
     * DIRECT_COMMAND_REPLY = a direct command where a reply is expected, and the
     * number and length of returned values needs to be specified.
     *
     * The direct command byte array sent takes the following format:
     * Byte 0 - 1: Command size, Little Endian. Command size not including these 2 bytes
     * Byte 2 - 3: Message counter, Little Endian. Forth running counter
     * Byte 4:     Command type. Either DIRECT_COMMAND_REPLY or DIRECT_COMMAND_NO_REPLY
     * Byte 5 - 6: Reservation (allocation) of global and local variables using a compressed format
     *             (globals reserved in byte 5 and the 2 lsb of byte 6, locals reserved in the upper
     *             6 bits of byte 6) – see documentation for more details.
     * Byte 7 - n: Byte codes as a single command or compound commands (I.e. more commands composed
     *             as a small program)
     *
     * @param {number} type - the direct command type.
     * @param {string} byteCommands - a compound array of JB Opcode + arguments.
     * @param {number} allocation - the allocation of global and local vars needed for replies.
     * @return {array} - generated complete command byte array, with header and compounded commands.
     */
    generateCommand (type, byteCommands, allocation = 0) {

        // Header (Bytes 0 - 6)
        let command = [];
        command[2] = 0; // Message counter unused for now
        command[3] = 0; // Message counter unused for now
        command[4] = type;
        command[5] = allocation & 0xFF;
        command[6] = allocation >> 8 && 0xFF;

        // Bytecodes (Bytes 7 - n)
        command = command.concat(byteCommands);

        // Calculate command length minus first two header bytes
        const len = command.length - 2;
        command[0] = len & 0xFF;
        command[1] = len >> 8 && 0xFF;

        return command;
    }

    /**
     * When the JB peripheral connects, start polling for sensor and motor values.
     * @private
     */
    _onConnect () {
        this._pollingIntervalID = window.setInterval(this._pollValues, this._pollingInterval);
    }

    /**
     * Poll the JB for sensor and motor input values, based on the list of
     * known connected sensors and motors. This is sent as many compound commands
     * in a direct command, with a reply expected.
     *
     * See 'JB Firmware Developer Kit', section 4.8, page 46, at
     * https://education.lego.com/en-us/support/mindstorms-JB/developer-kits
     * for a list of polling/input device commands and their arguments.
     *
     * @private
     */
    _pollValues () {
        if (!this.isConnected()) {
            window.clearInterval(this._pollingIntervalID);
            return;
        }

        const cmds = []; // compound command
        let allocation = 0;
        let sensorCount = 0;

        // Reset the list of devices every 20 counts
        if (this._pollingCounter % 20 === 0) {
            // GET DEVICE LIST
            cmds[0] = JBOpcode.OPINPUT_DEVICE_LIST;
            cmds[1] = JBEncoding.ONE_BYTE;
            cmds[2] = JBArgs.MAX_DEVICES;
            cmds[3] = JBEncoding.GLOBAL_VARIABLE_INDEX_0;
            cmds[4] = JBEncoding.GLOBAL_VARIABLE_ONE_BYTE;
            cmds[5] = JBEncoding.GLOBAL_CONSTANT_INDEX_0;

            // Command and payload lengths
            allocation = 33;

            this._updateDevices = true;
        } else {
            // GET SENSOR VALUES FOR CONNECTED SENSORS
            let index = 0;
            for (let i = 0; i < 4; i++) {
                if (this._sensorPorts[i] !== 'none') {
                    cmds[index + 0] = JBOpcode.OPINPUT_READSI;
                    cmds[index + 1] = JBArgs.LAYER;
                    cmds[index + 2] = i; // PORT
                    cmds[index + 3] = JBArgs.DO_NOT_CHANGE_TYPE;
                    cmds[index + 4] = JBMode[this._sensorPorts[i]];
                    cmds[index + 5] = JBEncoding.GLOBAL_VARIABLE_ONE_BYTE;
                    cmds[index + 6] = sensorCount * 4; // GLOBAL INDEX
                    index += 7;
                }
                sensorCount++;
            }

            // GET MOTOR POSITION VALUES, EVEN IF NO MOTOR PRESENT
            for (let i = 0; i < 4; i++) {
                cmds[index + 0] = JBOpcode.OPOUTPUT_GET_COUNT;
                cmds[index + 1] = JBArgs.LAYER;
                cmds[index + 2] = i; // PORT (incorrectly specified as 'Output bit field' in LEGO docs)
                cmds[index + 3] = JBEncoding.GLOBAL_VARIABLE_ONE_BYTE;
                cmds[index + 4] = sensorCount * 4; // GLOBAL INDEX
                index += 5;
                sensorCount++;
            }

            // Command and payload lengths
            allocation = sensorCount * 4;
        }

        const cmd = this.generateCommand(
            JBCommand.DIRECT_COMMAND_REPLY,
            cmds,
            allocation
        );

        this.send(cmd);

        this._pollingCounter++;
    }

    /**
     * Message handler for incoming JB reply messages, either a list of connected
     * devices (sensors and motors) or the values of the connected sensors and motors.
     *
     * See 'JB Communication Developer Kit', section 4.1, page 24 at
     * https://education.lego.com/en-us/support/mindstorms-JB/developer-kits
     * for more details on direct reply formats.
     *
     * The direct reply byte array sent takes the following format:
     * Byte 0 – 1: Reply size, Little Endian. Reply size not including these 2 bytes
     * Byte 2 – 3: Message counter, Little Endian. Equals the Direct Command
     * Byte 4:     Reply type. Either DIRECT_REPLY or DIRECT_REPLY_ERROR
     * Byte 5 - n: Resonse buffer. I.e. the content of the by the Command reserved global variables.
     *             I.e. if the command reserved 64 bytes, these bytes will be placed in the reply
     *             packet as the bytes 5 to 68.
     *
     * See 'JB Firmware Developer Kit', section 4.8, page 56 at
     * https://education.lego.com/en-us/support/mindstorms-JB/developer-kits
     * for direct response buffer formats for various commands.
     *
     * @param {object} params - incoming message parameters
     * @private
     */
    _onMessage (params) {
        const message = params.message;
        const data = Base64Util.base64ToUint8Array(message);

        if (data[4] !== JBCommand.DIRECT_REPLY) {
            return;
        }

        if (this._updateDevices) {

            // PARSE DEVICE LIST
            for (let i = 0; i < 4; i++) {
                const deviceType = JBDevice[data[i + 5]];
                // if returned device type is null, use 'none'
                this._sensorPorts[i] = deviceType ? deviceType : 'none';
            }
            for (let i = 0; i < 4; i++) {
                const deviceType = JBDevice[data[i + 21]];
                // if returned device type is null, use 'none'
                this._motorPorts[i] = deviceType ? deviceType : 'none';
            }
            for (let m = 0; m < 4; m++) {
                const type = this._motorPorts[m];
                if (type !== 'none' && !this._motors[m]) {
                    // add new motor if don't already have one
                    this._motors[m] = new JBMotor(this, m, type);
                }
                if (type === 'none' && this._motors[m]) {
                    // clear old motor
                    this._motors[m] = null;
                }
            }
            this._updateDevices = false;

        // eslint-disable-next-line no-undefined
        } else if (!this._sensorPorts.includes(undefined) && !this._motorPorts.includes(undefined)) {

            // PARSE SENSOR VALUES
            let offset = 5; // start reading sensor values at byte 5
            for (let i = 0; i < 4; i++) {
                // array 2 float
                const buffer = new Uint8Array([
                    data[offset],
                    data[offset + 1],
                    data[offset + 2],
                    data[offset + 3]
                ]).buffer;
                const view = new DataView(buffer);
                const value = view.getFloat32(0, true);

                if (JBLabel[this._sensorPorts[i]] === 'button') {
                    // Read a button value per port
                    this._sensors.buttons[i] = value ? value : 0;
                } else if (JBLabel[this._sensorPorts[i]]) { // if valid
                    // Read brightness / distance values and set to 0 if null
                    this._sensors[JBLabel[this._sensorPorts[i]]] = value ? value : 0;
                }
                offset += 4;
            }

            // PARSE MOTOR POSITION VALUES, EVEN IF NO MOTOR PRESENT
            for (let i = 0; i < 4; i++) {
                const positionArray = [
                    data[offset],
                    data[offset + 1],
                    data[offset + 2],
                    data[offset + 3]
                ];
                if (this._motors[i]) {
                    this._motors[i].position = positionArray;
                }
                offset += 4;
            }

        }
    }
}

/**
 * Enum for motor port names.
 * Note: if changed, will break compatibility with previously saved projects.
 * @readonly
 * @enum {string}
 */
const JBMotorMenu = ['A', 'B', 'C', 'D'];

/**
 * Enum for sensor port names.
 * Note: if changed, will break compatibility with previously saved projects.
 * @readonly
 * @enum {string}
 */
const JBSensorMenu = ['1', '2', '3', '4'];

class Scratch3JBBlocks {

    /**
     * The ID of the extension.
     * @return {string} the id
     */
    static get EXTENSION_ID () {
        return 'jb';
    }

    /**
     * Creates a new instance of the JB extension.
     * @param  {object} runtime VM runtime
     * @constructor
     */
    constructor (runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        // Create a new JB peripheral instance
        this._peripheral = new JB(this.runtime, Scratch3JBBlocks.EXTENSION_ID);

        this._playNoteForPicker = this._playNoteForPicker.bind(this);
        this.runtime.on('PLAY_NOTE', this._playNoteForPicker);
    }

    /**
     * Define the JB extension.
     * @return {object} Extension description.
     */
    getInfo () {
        return {
            id: Scratch3JBBlocks.EXTENSION_ID,
            name: 'LEGO JB',
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: 'motorTurnClockwise',
                    text: formatMessage({
                        id: 'jb.motorTurnClockwise',
                        default: 'motor [PORT] turn this way for [TIME] seconds',
                        description: 'turn a motor clockwise for some time'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PORT: {
                            type: ArgumentType.STRING,
                            menu: 'motorPorts',
                            defaultValue: 0
                        },
                        TIME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'motorTurnCounterClockwise',
                    text: formatMessage({
                        id: 'jb.motorTurnCounterClockwise',
                        default: 'motor [PORT] turn that way for [TIME] seconds',
                        description: 'turn a motor counter-clockwise for some time'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PORT: {
                            type: ArgumentType.STRING,
                            menu: 'motorPorts',
                            defaultValue: 0
                        },
                        TIME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'motorSetPower',
                    text: formatMessage({
                        id: 'jb.motorSetPower',
                        default: 'motor [PORT] set power [POWER] %',
                        description: 'set a motor\'s power to some value'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PORT: {
                            type: ArgumentType.STRING,
                            menu: 'motorPorts',
                            defaultValue: 0
                        },
                        POWER: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: 'getMotorPosition',
                    text: formatMessage({
                        id: 'jb.getMotorPosition',
                        default: 'motor [PORT] position',
                        description: 'get the measured degrees a motor has turned'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        PORT: {
                            type: ArgumentType.STRING,
                            menu: 'motorPorts',
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'whenButtonPressed',
                    text: formatMessage({
                        id: 'jb.whenButtonPressed',
                        default: 'when button [PORT] pressed',
                        description: 'when a button connected to a port is pressed'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        PORT: {
                            type: ArgumentType.STRING,
                            menu: 'sensorPorts',
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'whenDistanceLessThan',
                    text: formatMessage({
                        id: 'jb.whenDistanceLessThan',
                        default: 'when distance < [DISTANCE]',
                        description: 'when the value measured by the distance sensor is less than some value'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        DISTANCE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 5
                        }
                    }
                },
                {
                    opcode: 'whenBrightnessLessThan',
                    text: formatMessage({
                        id: 'jb.whenBrightnessLessThan',
                        default: 'when brightness < [DISTANCE]',
                        description: 'when value measured by brightness sensor is less than some value'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        DISTANCE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'buttonPressed',
                    text: formatMessage({
                        id: 'jb.buttonPressed',
                        default: 'button [PORT] pressed?',
                        description: 'is a button on some port pressed?'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        PORT: {
                            type: ArgumentType.STRING,
                            menu: 'sensorPorts',
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'getDistance',
                    text: formatMessage({
                        id: 'jb.getDistance',
                        default: 'distance',
                        description: 'gets measured distance'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getBrightness',
                    text: formatMessage({
                        id: 'jb.getBrightness',
                        default: 'brightness',
                        description: 'gets measured brightness'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'beep',
                    text: formatMessage({
                        id: 'jb.beepNote',
                        default: 'beep note [NOTE] for [TIME] secs',
                        description: 'play some note on jb for some time'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NOTE: {
                            type: ArgumentType.NOTE,
                            defaultValue: 60
                        },
                        TIME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0.5
                        }
                    }
                }
            ],
            menus: {
                motorPorts: {
                    acceptReporters: true,
                    items: this._formatMenu(JBMotorMenu)
                },
                sensorPorts: {
                    acceptReporters: true,
                    items: this._formatMenu(JBSensorMenu)
                }
            }
        };
    }

    motorTurnClockwise (args) {
        const port = Cast.toNumber(args.PORT);
        let time = Cast.toNumber(args.TIME) * 1000;
        time = MathUtil.clamp(time, 0, 15000);

        return new Promise(resolve => {
            this._forEachMotor(port, motorIndex => {
                const motor = this._peripheral.motor(motorIndex);
                if (motor) {
                    motor.direction = 1;
                    motor.turnOnFor(time);
                }
            });

            // Run for some time even when no motor is connected
            setTimeout(resolve, time);
        });
    }

    motorTurnCounterClockwise (args) {
        const port = Cast.toNumber(args.PORT);
        let time = Cast.toNumber(args.TIME) * 1000;
        time = MathUtil.clamp(time, 0, 15000);

        return new Promise(resolve => {
            this._forEachMotor(port, motorIndex => {
                const motor = this._peripheral.motor(motorIndex);
                if (motor) {
                    motor.direction = -1;
                    motor.turnOnFor(time);
                }
            });

            // Run for some time even when no motor is connected
            setTimeout(resolve, time);
        });
    }

    motorSetPower (args) {
        const port = Cast.toNumber(args.PORT);
        const power = MathUtil.clamp(Cast.toNumber(args.POWER), 0, 100);

        this._forEachMotor(port, motorIndex => {
            const motor = this._peripheral.motor(motorIndex);
            if (motor) {
                motor.power = power;
            }
        });
    }

    getMotorPosition (args) {
        const port = Cast.toNumber(args.PORT);

        if (![0, 1, 2, 3].includes(port)) {
            return;
        }

        const motor = this._peripheral.motor(port);
        let position = 0;
        if (motor) {
            position = MathUtil.wrapClamp(motor.position, 0, 360);
        }

        return position;
    }

    whenButtonPressed (args) {
        const port = Cast.toNumber(args.PORT);

        if (![0, 1, 2, 3].includes(port)) {
            return;
        }

        return this._peripheral.isButtonPressed(port);
    }

    whenDistanceLessThan (args) {
        const distance = MathUtil.clamp(Cast.toNumber(args.DISTANCE), 0, 100);

        return this._peripheral.distance < distance;
    }

    whenBrightnessLessThan (args) {
        const brightness = MathUtil.clamp(Cast.toNumber(args.DISTANCE), 0, 100);

        return this._peripheral.brightness < brightness;
    }

    buttonPressed (args) {
        const port = Cast.toNumber(args.PORT);

        if (![0, 1, 2, 3].includes(port)) {
            return;
        }

        return this._peripheral.isButtonPressed(port);
    }

    getDistance () {
        return this._peripheral.distance;
    }

    getBrightness () {
        return this._peripheral.brightness;
    }

    _playNoteForPicker (note, category) {
        if (category !== this.getInfo().name) return;
        this.beep({
            NOTE: note,
            TIME: 0.25
        });
    }

    beep (args) {
        const note = MathUtil.clamp(Cast.toNumber(args.NOTE), 47, 99); // valid JB sounds
        let time = Cast.toNumber(args.TIME) * 1000;
        time = MathUtil.clamp(time, 0, 3000);

        if (time === 0) {
            return; // don't send a beep time of 0
        }

        return new Promise(resolve => {
            // https://en.wikipedia.org/wiki/MIDI_tuning_standard#Frequency_values
            const freq = Math.pow(2, ((note - 69 + 12) / 12)) * 440;
            this._peripheral.beep(freq, time);

            // Run for some time even when no piezo is connected.
            setTimeout(resolve, time);
        });
    }

    /**
     * Call a callback for each motor indexed by the provided motor ID.
     *
     * Note: This way of looping through motors is currently unnecessary, but could be
     * useful if an 'all motors' option is added in the future (see WeDo2 extension).
     *
     * @param {MotorID} motorID - the ID specifier.
     * @param {Function} callback - the function to call with the numeric motor index for each motor.
     * @private
     */
    _forEachMotor (motorID, callback) {
        let motors;
        switch (motorID) {
        case 0:
            motors = [0];
            break;
        case 1:
            motors = [1];
            break;
        case 2:
            motors = [2];
            break;
        case 3:
            motors = [3];
            break;
        default:
            log.warn(`Invalid motor ID: ${motorID}`);
            motors = [];
            break;
        }
        for (const index of motors) {
            callback(index);
        }
    }

    /**
     * Formats menus into a format suitable for block menus, and loading previously
     * saved projects:
     * [
     *   {
     *    text: label,
     *    value: index
     *   },
     *   {
     *    text: label,
     *    value: index
     *   },
     *   etc...
     * ]
     *
     * @param {array} menu - a menu to format.
     * @return {object} - a formatted menu as an object.
     * @private
     */
    _formatMenu (menu) {
        const m = [];
        for (let i = 0; i < menu.length; i++) {
            const obj = {};
            obj.text = menu[i];
            obj.value = i.toString();
            m.push(obj);
        }
        return m;
    }
}

module.exports = Scratch3JBBlocks;
