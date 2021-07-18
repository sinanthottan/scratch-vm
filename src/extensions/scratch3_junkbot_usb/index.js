//const wsServer = require('./wsServer'); // or './wsServer'
//let com_path = wsServer.findCom();
//console.log(com_path);

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Clone = require('../../util/clone');
const Cast = require('../../util/cast');
const Color = require('../../util/color');
const formatMessage = require('format-message');
const MathUtil = require('../../util/math-util');
const Timer = require('../../util/timer');
const ReconnectingWebSocket = require('../../util/ReconnectingWebSocket');

const CRC = require('crc-full').CRC;
var crc = new CRC("CRC16_XMODEM", 16, 0x1021, 0x0000, 0x0000, false, false);

/* Icon svg to be displayed at the left edge of each extension block, encoded as a data URI. */
const blockIconURI = 'data:image/png;base64,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';

/* Icon svg to be displayed in the category menu, encoded as a data URI. */
const menuIconURI = 'data:image/png;base64,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';

const	START_SYS = 0xF0,
		SET_OUTPUT = 0xF1,
		SET_SERVO = 0xF2,
		SET_PWM = 0xF3,
		SET_ANIM = 0xF4,
		SET_RGB = 0xF5,
		DFP_MSG = 0xF6,
		END_SYS = 0xF7;

const 	ANIM_NUM = 0xE0,
		LEDS_ON = 0xE1,
		LEDS_MOVE = 0xE2;


const 	PLAY_SONG = 0x03,
		NEXT = 0x01,
		PREV = 0x02,
		PLAY = 0x0D,
		PAUSE = 0x0E,
		VOLUME = 0x06;

var 	DigitalInByte,
		Distance,
		PotValue,
		LightValue,
		Servo1Pos,
		Servo2Pos,
		RGB1,
		RGB2;


function mapValues(val, aMin, aMax, bMin, bMax) {
	var output = (((bMax - bMin) * (val - aMin)) / (aMax - aMin)) + bMin;
	if(output > 255)
		output = 255;
	if(output < 0)
		output = 0;
	return Math.round(output);
};

var startTime = Date.now();
function millis(){
	return Date.now() - startTime;
}


const JunkbotConnectionState = ['Connesso', 'Disconnesso'];
//const ArduinoAnalogOut = ['3', '5', '6'];
const ArduinoBoolValues = ['Attivo', 'Disattivo'];
const ArduinoAnalogIn = ['Potenziometro','Luce'];
const ArduinoDigitalIn = ['A', 'B', 'C', 'D' ];
const ArduinoRGBn = ['RGB1', 'RGB2'];
const ArduinoRGBch = ['Red', 'Green', 'Blue'];
const ArduinoServos = ['Motore1', 'Motore2'];
const ArduinoDFPlayer = ['PLAY', 'STOP', 'NEXT', 'PREVIOUS'];
const ArduinoAnimations = ['Nessuna', 'Fuoco', 'Besin', 'Battito', 'Gradiente', 'Sinelon', 'BPM', 'Confetti', 'Glitter', 'Juggle', 'Onesine', 'Plasma'];
const ArduinoDirections = ['Sinistra', 'Destra'];

/**
 * Class for the "Arduino" extension's blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3JunkbotUSBBlocks {

	constructor (runtime) {
		this.runtime = runtime;
		startTime = Date.now();
		this.lastMillis = 0;
		RGB1 = Cast.toRgbColorObject('#000000');
		RGB2 = Cast.toRgbColorObject('#000000');

		this.ws = new ReconnectingWebSocket("ws://localhost:8081");
		this.ws.binaryType = 'arraybuffer';

		this.ws.onmessage =  this._getWsData;
		this.ws.onopen =  this._openSocket;
		this.ws.onclose =  this._closeSocket;
		this.ws.onerror =  this._errorSocket;
		this.ws.onlistening  = this._serverListening;

		this._sendWsData = this._sendWsData.bind(this);
		this._getWsData = this._getWsData.bind(this);
		this._serverListening = this._serverListening.bind(this);
		this._openSocket = this._openSocket.bind(this);
		this._closeSocket = this._closeSocket.bind(this);
		this._errorSocket = this._errorSocket.bind(this);
	}



	/**
	 * @returns {object} metadata for this extension and its blocks.
	 */
	getInfo () {
		return {
			id: 'junkbot_usb',
			name: formatMessage({
				id: 'junkbot_usb.categoryName',
				default: 'Junkbot USB',
				description: 'Junkbot extension'
			}),
			menuIconURI: menuIconURI,
			blockIconURI: blockIconURI,
			blocks: [

				/*
				{
					opcode: 'ifConnected',
					blockType: BlockType.BOOLEAN,
					text: 'Se Junkbot è [CONNECTION]',
					arguments: {
						CONNECTION: {
							type: ArgumentType.BOOL,
							menu: 'mConnection',
							defaultValue: JunkbotConnectionState[0]
						}
					}
				},
				*/

				{
					opcode: 'ifDigitalRead',
					blockType: BlockType.BOOLEAN,
					text: 'Pulsante[DIGITAL_IN]=[BOOL_VAL]',

					arguments: {
						DIGITAL_IN: {
							type: ArgumentType.STRING,
							menu: 'mDigitalIn',
							defaultValue: ArduinoDigitalIn[1]
						},
						BOOL_VAL: {
							type: ArgumentType.STRING,
							menu: 'mBoolVal',
							defaultValue: ArduinoBoolValues[0]
						},
					}
				},

				{
					opcode: 'analogRead',
					blockType: BlockType.REPORTER,
					text: 'Leggi [ANALOG_IN]',
					arguments: {
						ANALOG_IN: {
							type: ArgumentType.STRING,
							menu: 'mAnalogIn',
							defaultValue: ArduinoAnalogIn[0]
						}
					}
				},

				{
					opcode: 'distance',
					blockType: BlockType.REPORTER,
					text: 'Distanza (cm)',
				},

				/*
				{
					opcode: 'analogWrite',
					blockType: BlockType.COMMAND,
					text: 'Imposta[ANALOG_OUT]al[PWM_VALUE]%',
					arguments: {
						ANALOG_OUT: {
							menu: 'mAnalogOut',
							defaultValue: ArduinoAnalogOut[0]
						},
						PWM_VALUE: {
							type: ArgumentType.NUMBER,
							defaultValue: 50
						}
					}
				},
				*/

				//{opcode: 'doNothing1',blockType: BlockType.HAT,text: 'Servo Motori                ', func : 'doNothing'},

				{
					opcode: 'servoWritePos',
					blockType: BlockType.COMMAND,
					text: 'Ruota[SERVO_N]a[POS_VAL]°',
					arguments: {
						SERVO_N: {
							menu: 'mServos',
							defaultValue: ArduinoServos[0]
						},
						POS_VAL: {
							type: ArgumentType.NUMBER,
							defaultValue: 90
						}
					}
				},

				{
					opcode: 'servoMovePos',
					blockType: BlockType.COMMAND,
					text: 'Sposta[SERVO_N]di[POS_VAL]°',
					arguments: {
						SERVO_N: {
							menu: 'mServos',
							defaultValue: ArduinoServos[0]
						},
						POS_VAL: {
							type: ArgumentType.NUMBER,
							defaultValue: 10
						}
					}
				},

				//{opcode: 'doNothing2',blockType: BlockType.HAT,text: 'Luci RGB (Red Green Blue)   ', func : 'doNothing'},

				{
					opcode: 'setAnimation',
					blockType: BlockType.COMMAND,
					text: 'Avvia animazione[ANIMATION]',
					arguments: {
						ANIMATION: {
							menu: 'mAnimation',
							defaultValue: ArduinoAnimations[1]
						}
					}
				},

				{
					opcode: 'on_nLed',
					blockType: BlockType.COMMAND,
					text: 'Accendi[N_LED]LED',
					arguments: {
						N_LED: {
							type: ArgumentType.NUMBER,
							defaultValue: 10
						}
					}
				},

				{
					opcode: 'move_nLed',
					blockType: BlockType.COMMAND,
					text: 'Sposta LED di [N_MOVE] a [DIR]',
					arguments: {
						N_MOVE: {
							type: ArgumentType.NUMBER,
							defaultValue: 2
						},
						DIR: {
							menu: 'mDirections',
							defaultValue: ArduinoDirections[0]
						}
					}
				},

				{
					opcode: 'setRGBtoColor',
					blockType: BlockType.COMMAND,
					text: 'Imposta[RGB_N]al colore[COLOR]',
					arguments: {
						RGB_N: {
							menu: 'mRGBn',
							defaultValue: ArduinoRGBn[0]
						},
						COLOR: {
							type: ArgumentType.COLOR,
							defaultValue: '#c700ff'
						}
					}
				},

				{
					opcode: 'setRandomRGB',
					blockType: BlockType.COMMAND,
					text: 'Un colore a caso per[RGB_N]',
					arguments: {
						RGB_N: {
							type: ArgumentType.STRING,
							menu: 'mRGBn',
							defaultValue: ArduinoRGBn[0]
						}
					}
				},

				{
					opcode: 'setColorOfRGB',
					blockType: BlockType.COMMAND,
					text: 'Imposta[RGB_CH][RGB_N]a[COLOR_VAL]',
					arguments: {
						RGB_CH: {
							type: ArgumentType.STRING,
							menu: 'mRGBch',
							defaultValue: ArduinoRGBch[0]
						},
						RGB_N: {
							type: ArgumentType.STRING,
							menu: 'mRGBn',
							defaultValue: ArduinoRGBn[0]
						},
						COLOR_VAL: {
							type: ArgumentType.NUMBER,
							defaultValue: 100
						}
					}
				},
				{
					opcode: 'addToColorOfRGB',
					blockType: BlockType.COMMAND,
					text: 'Modifica[RGB_CH][RGB_N]di[VAL]',
					arguments: {
						RGB_CH: {
							type: ArgumentType.STRING,
							menu: 'mRGBch',
							defaultValue: ArduinoRGBch[0]
						},
						RGB_N: {
							type: ArgumentType.STRING,
							menu: 'mRGBn',
							defaultValue: ArduinoRGBn[0]
						},
						VAL: {
							type: ArgumentType.NUMBER,
							defaultValue: 5
						}
					}
				},

				//{opcode: 'doNothing3',blockType: BlockType.HAT,text: 'MP3 Player                         ', func: 'doNothing'},

				{
					opcode: 'setDFPVolume',
					blockType: BlockType.COMMAND,
					text: 'Volume MP3 Player:[VOLUME]',
					arguments: {
						VOLUME: {
							type: ArgumentType.NUMBER,
							defaultValue: 20
						}
					}
				},

				{
					opcode: 'setDFPSong',
					blockType: BlockType.COMMAND,
					text: 'Suona canzone n°[SONG]',
					arguments: {
						SONG: {
							type: ArgumentType.NUMBER,
							defaultValue: 5
						}
					}
				},

				{
					opcode: 'controlDFPlayer',
					blockType: BlockType.COMMAND,
					text: 'Controlla MP3 player[DFP_CMD]',
					arguments: {
						DFP_CMD: {
							type: ArgumentType.STRING,
							menu: 'mMusicDFP',
							defaultValue: ArduinoDFPlayer[0]
						}
					}
				},


			],

			menus: {
				//mConnection: this._formatMenu(ArduinoConnectionState),
				mBoolVal:    this._formatMenu(ArduinoBoolValues),
				mDigitalIn:  this._formatMenu(ArduinoDigitalIn),
				mAnalogIn:   this._formatMenu(ArduinoAnalogIn),
				//mAnalogOut:  this._formatMenu(ArduinoAnalogOut),
				mRGBn:		 this._formatMenu(ArduinoRGBn),
				mRGBch:		 this._formatMenu(ArduinoRGBch),
				mServos: 	 this._formatMenu(ArduinoServos),
				mMusicDFP:	 this._formatMenu(ArduinoDFPlayer),
				mAnimation:  this._formatMenu(ArduinoAnimations),
				mDirections: this._formatMenu(ArduinoDirections)
			}
		};
	}

	doNothing(){
		return;
	}

	on_nLed(args){
		let n_led =  Cast.toNumber(args.N_LED);
		return this._sendWsData(SET_ANIM, LEDS_ON, n_led);
	}

	move_nLed(args){
		let n_pos =  Cast.toNumber(args.N_MOVE);
		let dir = ArduinoDirections.indexOf(args.DIR);
		return this._sendWsData(SET_ANIM, LEDS_MOVE, n_pos, dir);
	}

	setAnimation(args){
		let anim_name = args.ANIMATION;
		let anim_num = ArduinoAnimations.indexOf(anim_name);
		return this._sendWsData(SET_ANIM, ANIM_NUM, anim_num);
	}

	controlDFPlayer(args){
		let cmd = args.DFP_CMD;
		let msg = 0x00;
		switch(cmd) {
		  case ArduinoDFPlayer[0]:
			msg = PLAY;
			break;
		  case ArduinoDFPlayer[1]:
			msg = PAUSE;
			break;
		  case ArduinoDFPlayer[2]:
			msg = NEXT;
			break;
		  case ArduinoDFPlayer[2]:
			msg = PREV;
			break;
		}
		return this._sendWsData(DFP_MSG, msg, 0x00);
	}

	setDFPVolume(args){
		let volume = Cast.toNumber(args.VOLUME);
		return this._sendWsData(DFP_MSG, VOLUME, volume);
	}

	setDFPSong(args){
		let song = Cast.toNumber(args.SONG);
		return this._sendWsData(DFP_MSG, PLAY_SONG, song);
	}

	ifConnected(args){
		let val = args.CONNECTION;
		let res = false;
		if (this.ws.readyState)
			res = true;
		if( val == JunkbotConnectionState[1])
			res = ! res;
		return res;
	}

	// inByte = ( digitalRead(inPins[i]) << i) | inByte;
	ifDigitalRead(args){
		//console.log(RGB1);
		//console.log(RGB2);
		let pin_name = Cast.toString(args.DIGITAL_IN);
		let pin = ArduinoDigitalIn.indexOf(pin_name);
		let pattern = (0x01 << pin);
		let result = (pattern & DigitalInByte);
		let state = false;
		if (pattern == result)
			state = true;
		if (args.BOOL_VAL == ArduinoBoolValues[0])
			state = !state;
		return state;
	}

	analogRead(args) {
		if(args.ANALOG_IN === ArduinoAnalogIn[0])
			return  Cast.toNumber(PotValue);
		else
			return Cast.toNumber(LightValue);
	}

	distance() {
		let dist = Cast.toNumber(Distance);
		if(dist <= 255)
			return  dist;
	}

	analogWrite(args) {
		let pin = Cast.toNumber(args.ANALOG_OUT);
		let val = Cast.toNumber(args.PWM_VALUE);
		val = mapValues(val, 0, 100, 0, 255);
		return this._sendWsData(SET_PWM, pin, val);
	}

	servoWritePos(args) {
		let pin = (args.SERVO_N == ArduinoServos[0]) ? 1 : 2;
		let actualPos = args.SERVO_N == ArduinoServos[0] ? Servo1Pos : Servo2Pos;
		let newPos = Cast.toNumber(args.POS_VAL);
		//console.log(newPos, actualPos);
		if (newPos != actualPos)
			return this._sendWsData(SET_SERVO, pin, newPos);
	}

	servoMovePos(args) {
		let pin = (args.SERVO_N == ArduinoServos[0]) ? 1 : 2;
		let actualPos = args.SERVO_N == ArduinoServos[0] ? Servo1Pos : Servo2Pos;
		let newPos = actualPos + Cast.toNumber(args.POS_VAL);
		//console.log(newPos, actualPos);
		if (actualPos > 180)
			actualPos = 180;
		if (actualPos < 0)
			actualPos = 0;
		if (newPos != actualPos)
			return this._sendWsData(SET_SERVO, pin, newPos);
	}

	setRGBtoColor (args) {
		let rgb_n = (args.RGB_N == 'RGB1') ? 1:2;
		let rgb = Cast.toRgbColorObject(args.COLOR);
		var RGB;
		(rgb_n == 1) ? RGB = RGB1 : RGB = RGB2;
		let r = rgb.r;
		let g = rgb.g;
		let b = rgb.b;
		return this._sendWsData(SET_RGB, rgb_n, r, g, b);
	}

	setColorOfRGB (args) {
		let rgb_n = (args.RGB_N == 'RGB1') ? 1:2;
		let ch_type = args.RGB_CH;
		let ch_val = Cast.toNumber(args.COLOR_VAL);
		ch_val = mapValues(ch_val, 0, 100, 0, 255);

		var RGB;
		(rgb_n == 1) ? RGB = RGB1 : RGB = RGB2;
		if(ch_type == ArduinoRGBch[0])
			RGB.r = ch_val;
		else if(ch_type == ArduinoRGBch[1])
			RGB.g = ch_val;
		else if(ch_type == ArduinoRGBch[2])
			RGB.b = ch_val;

		return this._sendWsData(SET_RGB, rgb_n, RGB.r, RGB.g, RGB.b);
	}

	addToColorOfRGB (args) {
		let rgb_n = (args.RGB_N == 'RGB1') ? 1:2;
		let ch_type = args.RGB_CH;
		let add_val = Cast.toNumber(args.VAL);

		var RGB;
		(rgb_n == 1) ? RGB = RGB1 : RGB = RGB2;

		if(ch_type == ArduinoRGBch[0])
			RGB.r = Math.abs((RGB.r + add_val)%256);
		else if(ch_type == ArduinoRGBch[1])
			RGB.g = Math.abs((RGB.g + add_val)%256);
		else if(ch_type == ArduinoRGBch[2])
			RGB.b = Math.abs((RGB.b + add_val)%256);

		return this._sendWsData(SET_RGB, rgb_n, RGB.r, RGB.g, RGB.b);
	}

	setRandomRGB (args){
		let rgb_n = (args.RGB_N == 'RGB1') ? 1:2;
		var RGB;
		(rgb_n == 1) ? RGB = RGB1 : RGB = RGB2;
		RGB.r = Math.floor(Math.random() * 256);
		RGB.g = Math.floor(Math.random() * 256);
		RGB.b = Math.floor(Math.random() * 256);
		return this._sendWsData(SET_RGB, rgb_n, RGB.r, RGB.g, RGB.b);
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
            //obj.value = menu[i]; //i.toString();
            m.push(obj);
        }
        return m;
	}

	_serverListening(){
		console.log('websocket server is running');
	}

	/* openSocket(), set ping timings and connection status */
	_openSocket() {
		console.log('WebSocket connection: ', this.ws.readyState);
	}
	/* closeSocket() */
	_closeSocket() {
		console.log('WebSocket connection: ', this.ws.readyState);
	}
	/* errorSocket() */
	_errorSocket(err) {
		console.log(err);
	}

	_sendWsData(cmd, elem, par1, par2 =0, par3=0, par4=0) {
		mils = millis();
		var msg = [START_SYS, cmd, elem, par1, par2, par3, par4, END_SYS];
		var computed_crc = crc.compute(msg);
		msg.push(computed_crc >> 8);
		msg.push(computed_crc & 0xFF);
		//console.log( mils, this.lastMillis )
		if(mils - this.lastMillis > 5){
			this.lastMillis = mils;
			this.ws.send(msg);
			console.log(msg);
		}

	}

	/* get called whenever there is new Data from the ws server. */
    _getWsData(msg) {
		dataArray = JSON.parse(msg.data);
		//console.log(msg);
		try {
			DigitalInByte = dataArray.data[1];
			Distance = dataArray.data[2];
			PotValue = dataArray.data[3];
			LightValue = dataArray.data[4];
			Servo1Pos = dataArray.data[5];
			Servo2Pos = dataArray.data[6];
			RGB1.r = dataArray.data[7];
			RGB1.g = dataArray.data[8];
			RGB1.b = dataArray.data[9];
			RGB2.r = dataArray.data[10];
			RGB2.g = dataArray.data[11];
			RGB2.b = dataArray.data[12];

		}
		catch(err){;}
	}
}

module.exports = Scratch3JunkbotUSBBlocks;
