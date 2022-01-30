const serialbtn = document.querySelector('.serial');
const syncbtn = document.querySelector('.sync');
const spinicon =  document.querySelector('.fa-sync');
var whileSyncingPrompt = document.getElementById('syncingPrompt');

//-- [Await based delay function] Returns a Promise that resolves after "ms"
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


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


            // -- [TODO] Handle Events for physical re-connection of serial port by users when plug in the same device
            // navigator.serial.addEventListener("connect", (event) => {
            //     if(disconnectedByAccident && !wasClickedToDisconnect){ // TODO: retreive var state from session cache
            //         reconnectSerial(event);
            //     }
            // });


            // -- Handle Events for physical dis-connection of serial port by users by accident
            navigator.serial.addEventListener("disconnect", (event) => {
                // TBD: fires twice! "Duct Tape" mitigation strategy here! :|
                disconnectCounter += 1;
                if(disconnectCounter <= 1){
                    console.log('Serial Port was physically removed by by user ❌');
                    // -- Reset button colors. 
                    serialbtn.style.backgroundColor = '#8f8f8f';
                    document.getElementById('serialPlug').style.color= '#242424';
                    // -- Update some var's states accordingly 
                    // ** These vars are used later for serial port interaction
                    serialConnected = false;

                    // TODO: remove port pointer 
                    port = null;
                    event.port = null;
                    event.target = null;

                    // Stream related objects
                    // TODO: handle errors of pysical disconnection for output stream annd output done...
                    outputStream = null;
                    outputDone = null;
                    
                    connectCounter = 0; 
                    disconnectedByAccident = true; // TODO: save this in session cache
                }else{
                    disconnectCounter = 0;
                }
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
        webSerialSupported = false;

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
                serialConnected = false;
                wasClickedToDisconnect = true;

                console.log('[SERIAL BUTTON PRESSED] Disconnecting Serial...');
                console.log("Serial disconnected ❌");
                // -- Reset button colors. 
                serialbtn.style.backgroundColor = '#8f8f8f';
                document.getElementById('serialPlug').style.color= '#242424';
            }   
        }
    }
    connectCounter = 0;
});



async function connectSerial() {
    // ... TBD "Filters" options in requestPort();
    // ... TBD as waiting for better filters like device string identifiers etc. and not just VID and PID

    port = await navigator.serial.requestPort();

    try {
        // -- Wait for the serial port to open.
        await port.open({ baudRate: baudrate });

        if (port.writable && port.readable){
            // -- Setup the output stream here.
            const encoder = new TextEncoderStream();
            outputDone = encoder.readable.pipeTo(port.writable);
            outputStream = encoder.writable;

            serialConnected = true;
            wasClickedToDisconnect = false;
            disconnectedByAccident = false;
            console.log("Serial connected 👍🏽");
            // -- Reflect button colors to show serial is connected.  
            serialbtn.style.backgroundColor = '#8abbb3';
            document.getElementById('serialPlug').style.color= '#355953';
        }  
    } catch (e) {
        console.log(e);
    }
}



// -- For Automatically opening port, if it was connected before using "event.target" 
async function reconnectSerial(e){
    // TBD: fires twice! "Duct Tape" mitigation strategy here! :|
    connectCounter += 1;
    if(connectCounter <= 1){
        // alert('Device was attached again, please reconnect!');

        // ** Adding delays to avoid race condition and giving time for browser to actually make the port available
        // await delay(1000);
        port = await e.port || e.target;
        // await delay(1000);

        try {
            // -- Wait for the serial port to re-open.
            let tryReconnecting = true;
            while (tryReconnecting){
                try{
                    await port.open({ baudRate: baudrate});
                    if (port) {
                        tryReconnecting = false;
                    }
                } catch(err){
                    console.log('Error occured while attempting to re-open port:\n-> ', err);
                }
            }

            if (port.writable && port.readable){
                serialConnected = true;
                wasClickedToDisconnect = false;
                disconnectedByAccident = false;
                console.log('Serial Port is available again and Reconnected! 👍🏽');
                // -- Reflect button colors to show serial is connected.  
                serialbtn.style.backgroundColor = '#8abbb3';
                document.getElementById('serialPlug').style.color= '#355953';
            }  
        } catch (e) {
            console.log(e);
        }
    }else{
        connectCounter = 0;
    }
}




//------- Sync button method: Write the data structure -------//
syncbtn.addEventListener("click", () => {
    writeDateAndTimeData();
});



// -- Write the data for some time ...
const writeDateAndTimeData = async _ => {
    // Lock the button
    console.log('\nlock\n\n');
    // -- Reflect button colors to show locked.  
    syncbtn.style.backgroundColor = '#90a7a3';
    syncbtn.style.pointerEvents = 'none';
    // -- Spin the icon
    spinicon.classList.add('fa-spin');
    // -- Bring up the "press button on watch to sync" prompt for user 
    whileSyncingPrompt.style.display = "block";


    for (let i = 1; i < maxWrites+1; i++) {
            //UI related info
            currWriteCount = (maxWrites)-i;
            console.log(currWriteCount + " sec left");
            // Show the countdown remaining for user to sync time, near the button.
            whileSyncingPrompt.innerHTML = '[' + currWriteCount + ' sec left] Press button on watch to sync!'

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
                                delay_in_ms;
                                // enableTilt;

            // -- write the Serial Data
            if (port !=null && port.writable) writeToStream(serialData);
            else console.log("Not writing to Serial Port as it wasn't created/selected!\n"+serialData);

            await delay(writeFrequency);
        }

    // unlock the button
    console.log('\nun-lock\n');
    // TBD: Remove the countdown from near the button.
    // ...
    whileSyncingPrompt.style.display = "none";

    // -- Reflect button colors to show un-locked.  
    syncbtn.style.backgroundColor = '#8f8f8f';
    syncbtn.style.pointerEvents = 'auto';
    // -- Stop Spin the icon
    spinicon.classList.remove('fa-spin');
}



function writeToStream(...lines) {
    // -- Setup the output stream here.
    // const encoder = new TextEncoderStream();
    // outputDone = encoder.readable.pipeTo(port.writable);
    // outputStream = encoder.writable;

    const writer = outputStream.getWriter();

    lines.forEach(line => {
      console.log("[SEND]", line);
      writer.write(line + "\n");
    });
    writer.releaseLock();
}




//------- tilt enable disable stuff for frontend -------//
// const enableTiltSwSelector = document.getElementById('tilt_sw');
// let state = false;
// enableTiltSwSelector.addEventListener("click", () => {
//     state = !state;
//     if (state) enableTilt = 1;
//     else enableTilt = 0;
// });