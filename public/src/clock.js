const zeroPad = (num, places) => String(num).padStart(places, '0');

document.addEventListener("DOMContentLoaded", () => {
    setInterval( () => { 
        var now = new Date();
        var month = now.getMonth()+1; // month starts from 0

        currDate = zeroPad(now.getDate(), 2);
        currMonth = zeroPad(month, 2);
        currYear = now.getFullYear();
        currWeekday = now.getDay();

        currHour = zeroPad(now.getHours(), 2);
        currMinute = zeroPad(now.getMinutes(), 2);  
        currSeconds = zeroPad(now.getSeconds(), 2);

        // const hms = currHour + ":"+ currMinute +":" + currSeconds;
        const hm = currHour + ":"+ currMinute;
        const ss = currSeconds;
        const date = currDate + "-" + currMonth + "-" + currYear + "  " + weekdays[currWeekday];

        document.querySelector('.hm').innerText = hm;
        document.querySelector('.ss').innerText = ss;
        document.querySelector('.date').innerText = date;


        // -- for showing Serial data structure on the front end
        if (show_serial_data_on_frontend == true){
            // -- Get the time & date ahd otehr data for teh serial data
            const now = new Date;
            var delay_selection = document.getElementById("delays");
            var delay_in_ms = delay_selection.value;
            const FE_serialTimeData = now.getHours()+":"+
                                now.getMinutes()+":"+
                                now.getSeconds()+":"+
                                now.getDay()+":"+
                                now.getDate()+":"+
                                now.getMonth()+":"+
                                now.getFullYear()

            // const FE_serialTimeData = now.getHours()+":"+
            //         now.getMinutes()+":"+
            //         now.getSeconds()+":"+
            //         now.getDay()+":"+
            //         now.getDate()+":"+
            //         now.getMonth()+":"+
            //         now.getFullYear()+":"+
            //         delay_in_ms;

            // console.log(FE_serialTimeData);
            // ds = document.getElementById('data_structure');
            // ds.innerHTML = FE_serialTimeData;
        }

    }, 1000);
});

