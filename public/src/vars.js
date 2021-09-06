let headerFont;
let footerFont;
let mainClockFont;

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


//--------- SERIAL PORT RELATED ----------//
let port;

const defaultVID = 0x0403;
const customVID = 0x2BD3;
var filterVID;

let outputDone;
let outputStream;
let serialConnected = false;
let syncElems;
