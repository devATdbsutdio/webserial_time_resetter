const serialbtn = document.querySelector('.serial')
const syncbtn = document.querySelector('.sync')

// document.addEventListener("DOMContentLoaded", () => {
//     syncElems = document.querySelectorAll('.sync');
//     if(serialConnected === false || !navigator.serial){
//         // -- Disable sync
//         for (let el of syncElems) { el.disabled = true; }
//     }
// });

serialbtn.addEventListener("click", async () => {
    if(serialConnected === false){
        if (navigator.serial) {
            console.log('Web Serial API Supported 🤗');
            connectSerial();
        } else {
            console.log('Web Serial API not supported ! 🧐');
            // -- Disable sync
            // for (let el of syncElems) { el.disabled = true; }
        }
    }else{
        if (outputStream) {
            await outputStream.getWriter().close();
            await outputDone;
            outputStream = null;
            outputDone = null;
        }

        if(port){
            await port.close();
            port = null;
            console.log("Serial disconnected ❌");
            serialConnected = false;
            // -- Reset button colors. 
            serialbtn.style.backgroundColor = '#8f8f8f';
            document.getElementById('serialPlug').style.color= '#242424';
            // -- Disable sync
            // for (let el of syncElems) { el.disabled = true; }
        }
    }
});



async function connectSerial() {
    // -- Filter on devices with the VID
    const filter = { usbVendorId:  0x0403 };

    try {
        port = await navigator.serial.requestPort({ filters: [filter]});

        try {
            // -- Wait for the serial port to open.
            await port.open({ baudRate: 115200 });
            serialConnected = true;
            console.log("Serial connected 👍🏽");
             // -- Reflect button colors to show serial is connected.  
            serialbtn.style.backgroundColor = '#8abbb3';
            document.getElementById('serialPlug').style.color= '#355953';
            // -- Enable sync
            // for (let el of syncElems) { el.disabled = false; }

            // -- Setup the output stream here.
            const encoder = new TextEncoderStream();
            outputDone = encoder.readable.pipeTo(port.writable);
            outputStream = encoder.writable;
        } catch (e) {
            console.log(e);
        }
    } catch (error) {
        console.log("Didn't connect to anything 💔");
        serialConnected = false;
    }
}



syncbtn.addEventListener("click", () => {
    // -- Get the time
    const now = new Date;
    const serialTimeData = now.getHours()+":"+
                           now.getMinutes()+":"+
                           now.getSeconds()+":"+
                           now.getDay()+":"+
                           now.getDate()+":"+
                           now.getMonth()+":"+
                           now.getFullYear();
    // -- write the Serial Data
    if(port !=null){
        writeToStream(serialTimeData);
    }
});

function writeToStream(...lines) {
    const writer = outputStream.getWriter();
    lines.forEach(line => {
      console.log("[SEND]", line);
      writer.write(line + "\n");
    });
    writer.releaseLock();
}