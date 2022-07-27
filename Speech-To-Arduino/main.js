const texts = document.querySelector(".texts"); //const = constant 

window.SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = 'ar-SA'; //default value

let p = document.createElement("p");

recognition.addEventListener("result", (e) => {
    texts.appendChild(p);
    const text = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

    p.innerText = text;
    if (e.results[0].isFinal) {
        if (text.includes("how are you")) {
            p = document.createElement("p");
            p.classList.add("replay");
            p.innerText = "I am fine. How are you?";
            texts.appendChild(p);
        }
        if (
            text.includes("what's your name") ||
            text.includes("what is your name")
        ) {
            p = document.createElement("p");
            p.classList.add("replay");
            p.innerText = "My Name is Saud";
            texts.appendChild(p);
        }
        if (text.includes("open Google")) {
            p = document.createElement("p");
            p.classList.add("replay");
            p.innerText = "opening google";
            texts.appendChild(p);
            console.log("opening google");
            window.open("https://www.google.com/");
        }
        p = document.createElement("p");
    }
});

recognition.addEventListener("end", () => {
    recognition.start();
});

recognition.start();
//document.getElementById("langauge").onclick;

function langauge_change() {

    if (recognition.lang == 'en-US') {
        lan = 'ar-SA';
        document.getElementById('lang1').innerHTML = 'Arabic';
        recognition.lang = 'ar-SA';
    } else if (recognition.lang == 'ar-SA') {
        lan = 'en-US';
        document.getElementById('lang1').innerHTML = 'English';
        recognition.lang = 'en-US';
    }
}

let el = document.getElementById('button1');
el.addEventListener('click', async () => {
    // Filter on devices with the Arduino Uno USB Vendor/Product IDs.
    /*
    const filters = [
     { usbVendorId: 0x2341, usbProductId: 0x0043 },
     { usbVendorId: 0x2341, usbProductId: 0x0001 }
    ];
    
    //Prompt user to select an Arduino Uno device.
     const port = await navigator.serial.requestPort({ filters });
       const { usbProductId, usbVendorId } = port.getInfo();
  */
    const port = await navigator.serial.requestPort();

    // Wait for the serial port to open.
    // ( The baudRate dictionary member specifies how 
    //fast data is sent over a serial line. It is expressed 
    //in units of bits-per-second (bps). Check your device's 
    //documentation for the correct value as all the data 
    //you send and receive will )

    await port.open({ baudRate: 9600 });

    // for transform streams which takes input and transforms it into a string.

    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();

    // Listen to data coming from the serial device.
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            reader.releaseLock();
            break;
        }
        // value is a string.
        console.log(value);
    }

    const textEncoder = new TextEncoderStream();
    const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

    reader.cancel();
    await readableStreamClosed.catch(() => { /* Ignore the error*/ });

    writer.close();
    await writableStreamClosed;

    await port.close();

    navigator.serial.addEventListener("connect", (event) => {
        // TODO: Automatically open event.target or warn user a port is available.
    });

    navigator.serial.addEventListener("disconnect", (event) => {
        // TODO: Remove |event.target| from the UI.
        // If the serial port was opened, a stream error would be observed as well.
    });
});











  // when continuously reading data from a serial device using a loop
  //-------------------------------------------------------------------------------------------
  // With transform streams.


// const textDecoder_loop = new TextDecoderStream();
// const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
// const reader = textDecoder.readable.getReader();

// // Listen to data coming from the serial device.
// while (true) {
//   const { value, done } = await reader.read();
//   if (done) {
//     reader.releaseLock();
//     break;
//   }
//   // value is a string.
//   console.log(value);
// }

// const textEncoder = new TextEncoderStream();
// const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

// reader.cancel();
// await readableStreamClosed.catch(() => { /* Ignore the error * });

// writer.close();
// await writableStreamClosed;

// await port.close(); */
