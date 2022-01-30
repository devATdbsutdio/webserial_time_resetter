let headerFont;
let footerFont;
let mainClockFont;


let reqIsFromComputerBrowser = false;
const show_serial_data_on_frontend = true;

//--------- DATE & TIME RELATED ----------//
let currDate;
let currMonth;
let currYear;
let currWeekday;
let currHour;
let currMinute;  
let currSeconds;
let weekdays = [
	"SUNDAY", 
	"MONDAY", 
	"TUESDAY", 
	"WEDNESDAY", 
	"THURSDAY", 
	"FRIDAY", 
	"SATURDAY"
]
let delay_in_ms = 4;
// let enableTilt = 0;

//--------- SERIAL PORT RELATED ----------//
let webSerialSupported = false;
let wasClickedToDisconnect = false;
let disconnectedByAccident = false;

let connectCounter = 0;
let disconnectCounter = 0;

let port;

const defaultVID = 0x0403;
const customVID = 0x2BD3;
var filterVID;

const baudrate = 115200;

let outputDone;
let outputStream;
let serialConnected = false;
let syncElems;

var serialData;

/* 
	Variables defining at what frequency data needs to be writtent to serial port and for how long
	e.g: write data 10 times at a frequency of 1 sec between writes.  
*/
let writeFor = 10000; // in ms
const writeFrequency = 1000; // in ms
let maxWrites = writeFor/writeFrequency; 
let currWriteCount = 0;