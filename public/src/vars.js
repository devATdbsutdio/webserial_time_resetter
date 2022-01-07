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
let enableTilt = 0;

//--------- SERIAL PORT RELATED ----------//
let webSerialSupported = false;

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



//--------- OS finger printing to alrt use to install FTDI VCP drivers respective to their OS -----------//
// function getOS() {
// 	var userAgent = window.navigator.userAgent,
// 		platform = window.navigator.platform,
// 		macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
// 		windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
// 		iosPlatforms = ['iPhone', 'iPad', 'iPod'],
// 		os = null;

// 	if (macosPlatforms.indexOf(platform) !== -1) {
// 		os = 'Mac OS';
// 	} else if (iosPlatforms.indexOf(platform) !== -1) {
// 		os = 'iOS';
// 	} else if (windowsPlatforms.indexOf(platform) !== -1) {
// 		os = 'Windows';
// 	} else if (/Android/.test(userAgent)) {
// 		os = 'Android';
// 	} else if (!os && /Linux/.test(platform)) {
// 		os = 'Linux';
// 	}

//   return os;
// }

// document.addEventListener("DOMContentLoaded", () => {
// 	if (getOS() === 'Mac OS'){
// 		console.log("Mac OS detected, Please make sure you have the drivers installed: <link>");
// 	}else if(getOS() === 'Windows'){

// 	}else if (getOS() === 'Linux'){

// 	}else{

// 	}
// });

// https://ftdichip.com/drivers/vcp-drivers/