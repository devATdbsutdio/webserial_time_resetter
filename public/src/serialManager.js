const serialbtn = document.querySelector('.serial')
const syncbtn = document.querySelector('.sync')

// -- For checking if the browser that is making the request is from a computer or not
function isCompBrowser(){
    const state = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    return !state;
} 


// On load, check if browser is from a computer, if so check if it supports serial
document.addEventListener("DOMContentLoaded", () => {

    if(isCompBrowser()){
        reqIsFromComputerBrowser = true;
        
        console.log('Request was made from a computer browser!');
        console.log('So checking Web Serial Support...');

        // Hide "not from computer" banner warning.
        document.getElementById('notComputer').style.display = 'none';

        if (navigator.serial) {
            console.log('Web Serial API Supported 🤗');

            // Hide the "Non-chrome" warning Top Banner 
            document.getElementById('notSupported').style.display = 'none';
            // Enable "connect to serial" and "sync data" button and any interaction with it.
            document.querySelector('.buttonGroup').style.pointerEvents = 'auto';
            document.querySelector('.fa-plug').style.color = '#242424';
            document.querySelector('.fa-sync').style.color = '#242424';

            webSerialSupported = true;


            // -- Intention: Handle Events for physical re-connection of serial port by users when plug in the same device
            // -- TBD: how t auto connect/ auto open the SAME serial port (if possible)?
            navigator.serial.addEventListener("connect", (event) => {
                // ... Automatically open event.target or warn user a port is available ??
                reconnectSerial(event);
            });


            // -- Handle Events for physical dis-connection of serial port by users
            navigator.serial.addEventListener("disconnect", (event) => {
                // ... If the serial port was opened, a stream error would be observed as well, handle if any ??
                console.log('Serial Port dis-connected physically by user ❌');
                // -- Reset button colors. 
                serialbtn.style.backgroundColor = '#8f8f8f';
                document.getElementById('serialPlug').style.color= '#242424';
                // -- Update some var's states accordingly 
                // ** These vars are used later for serial port interaction
                serialConnected = false;
                port = null;
                counter = 0; //
            });
        }else{
            console.log('Web Serial API not supported ! 🧐');
            
            // Show the "Non-chrome" warning Top Banner 
            document.getElementById('notSupported').style.display = 'inline-block';
            // Disable "connect to serial" button and any interaction with it.
            document.querySelector('.buttonGroup').style.pointerEvents = 'none';
            document.querySelector('.fa-plug').style.color = '#545454';
            document.querySelector('.fa-sync').style.color = '#545454';

            webSerialSupported = false;
        }
    }else{
        reqIsFromComputerBrowser = false;

        console.log('Request was made from a mobile browser!🧐');
        console.log('Please go to a chrome browser (> chrome 89) from a computer and try again.');

        // Show "not from computer" banner warning.
        document.getElementById('notComputer').style.display = 'inline-block';

        // Disable "connect to serial" button and any interaction with it.
        document.querySelector('.buttonGroup').style.pointerEvents = 'none';
        document.querySelector('.fa-plug').style.color = '#545454';
        document.querySelector('.fa-sync').style.color = '#545454';
    }
});



// --- click: attemmpt to connect to serial port
// --- click, again: disconnect. 
serialbtn.addEventListener("click", async () => {
    if (reqIsFromComputerBrowser && webSerialSupported) {
        if(serialConnected === false){
            // ** Connect/Open Port Method
            connectSerial();
        }else{
            // ** Disconnnect/Close Port Method
            if (outputStream) {
                await outputStream.getWriter().close();
                await outputDone;
                outputStream = null;
                outputDone = null;
            }
            if (port){
                await port.close();
                port = null;
                console.log('[SERIAL BUTTON PRESSED] Disconnecting Serial...');
                console.log("Serial disconnected ❌");
                serialConnected = false;
                // -- Reset button colors. 
                serialbtn.style.backgroundColor = '#8f8f8f';
                document.getElementById('serialPlug').style.color= '#242424';
            }
        }
    }
    counter = 0;
});



async function connectSerial() {
    // ... TBD "Filters" options in requestPort();
    // ... TBD as waiting for better filters like device string identifiers etc. and not just VID and PID

    port = await navigator.serial.requestPort();

    try {
        // -- Wait for the serial port to open.
        await port.open({ baudRate: baudrate });

        if (port.writable && port.readable) serialConnected = true;

        console.log("Serial connected 👍🏽");

        // -- Reflect button colors to show serial is connected.  
        serialbtn.style.backgroundColor = '#8abbb3';
        document.getElementById('serialPlug').style.color= '#355953';
    } catch (e) {
        console.log(e);
    }
}


// -- For Automatically opening port, if it was connected before using "event.target" 
let counter = 0;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function reconnectSerial(e){
    // TBD: fires twice! "Duct Tape" mitigation strategy here! :|
    counter += 1;
    if(counter <= 1){
        // alert('Device was attached again, please reconnect!');

        // ** Adding delays to avpid race condition and giving time for browser to actually make the port available
        await delay(1000);
        port = await e.port || e.target;
        await delay(1000);
        try {
            // -- Wait for the serial port to re-open.
            await port.open({ baudRate: baudrate});
            await delay(1000);
            if (port.writable && port.readable) serialConnected = true;

            console.log('Serial Port is available again and Reconnected! 👍🏽');
            // -- Reflect button colors to show serial is connected.  
            serialbtn.style.backgroundColor = '#8abbb3';
            document.getElementById('serialPlug').style.color= '#355953';
        } catch (e) {
            console.log(e);
        }
    }else{
        counter = 0;
    }
    
}




//------- Sync button method: Write the data structure -------//
syncbtn.addEventListener("click", () => {
    // -- Get the time
    const now = new Date;
    
    let delay_selection = document.getElementById("delays");
    let delay_in_ms = Number(delay_selection.value);


    serialData = now.getHours()+":"+
                        now.getMinutes()+":"+
                        now.getSeconds()+":"+
                        now.getDay()+":"+
                        now.getDate()+":"+
                        now.getMonth()+":"+
                        now.getFullYear()+":"+
                        delay_in_ms+":"+
                        enableTilt;

    // -- write the Serial Data
    if (port !=null && port.writable) writeToStream(serialData);
    else console.log("Not writing to Serial Port as it wasn't created/selected!\n"+serialData);
});


function writeToStream(...lines) {
    // -- Setup the output stream here.
    const encoder = new TextEncoderStream();
    outputDone = encoder.readable.pipeTo(port.writable);
    outputStream = encoder.writable;
    const writer = outputStream.getWriter();

    lines.forEach(line => {
      console.log("[SEND]", line);
      writer.write(line + "\n");
    });
    writer.releaseLock();
}




//------- tilt enable disable stuff for frontend -------//
const enableTiltSwSelector = document.getElementById('tilt_sw');
let state = false;
enableTiltSwSelector.addEventListener("click", () => {
    state = !state;
    if (state) enableTilt = 1;
    else enableTilt = 0;
});