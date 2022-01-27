let inputText = document.getElementById("writeText");
const writeButton = document.getElementById("writeButton");
const writeLog = document.getElementById("writeLog");

const readButton = document.getElementById("readButton");
const readLog = document.getElementById("readLog");

writeButton.addEventListener("click", async () => {
  console.log("write button clicked");
  writeLog.textContent = await "please touch the NFC tag!";
  try {
    let writeText = inputText.value;
    console.log(writeText);
    if (!writeText) {
      writeLog.textContent = "empty";
      return;
    }
    const reader = new NDEFReader();
    await reader.write(writeText);
    writeLog.textContent = `write: ${writeText}`;
  } catch (error) {
    writeLog.textContent = error;
    console.log(error);
  }
});

readButton.addEventListener("click", async () => {
  readLog.textContent = await "clicked read button";
  try {
    const reader = new NDEFReader();
    await reader.scan();
    readLog.textContent = "scan started";

    reader.addEventListener("error", () => {
      readLog.textContent += "Error";
    });

    reader.addEventListener("reading", ({ message, serialNumber }) => {
      readLog.textContent += `> Serial Number: ${serialNumber}`;
      readLog.textContent += message;
      for (const record of message.records) {
        const { data, encoding, recordType } = record;
        readLog.textContent += " TYPE:" + recordType;
        readLog.textContent += " ENC:" + encoding;
        if (recordType === "text") {
          const textDecoder = new TextDecoder(encoding);
          const text = textDecoder.decode(data);
          readLog.textContent += " TXT:" + text;
        } else {
          readLog.textContent += " DAT:" + data;
        }
      }
    });
  } catch (error) {
    readLog.textContent = error;
  }
});
