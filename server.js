const express = require("express");
const app = express();
const fs = require("fs");
const { parse } = require("csv-parse");
const columnsToKeep = [2, 4, 6, 8];
let lastRow = null;

// WebSockets setup
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8081 });

// Function to read the CSV file and update the lastRow variable
function readAndUpdateData() {
  fs.createReadStream("C://Users//HP//Desktop//dtwin_native//dt1.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      lastRow = row.map((value) => parseFloat(value));
    })
    .on("end", function () {
      if (lastRow) {
        const filteredRow = lastRow.filter((value, index) => columnsToKeep.includes(index + 1));
        console.log("Updated data:", filteredRow);
        // Send the updated data to connected WebSocket clients
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(filteredRow));
          }
        });
      }
    })
    .on("error", function (error) {
      console.log(error.message);
    });
}

// Initial data read and update
readAndUpdateData();

// Schedule the data update every 3 seconds
const updateInterval = 1000; // 1 seconds
setInterval(readAndUpdateData, updateInterval);

// WebSocket connection handling
wss.on("connection", function connection(ws) {
  console.log("WebSocket client connected");
});

app.get("/data", (req, res) => {
  if (lastRow) {
    const filteredRow = lastRow.filter((value, index) => columnsToKeep.includes(index + 1));
    res.json(filteredRow);
  } else {
    res.status(500).json({ error: "No data available." });
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
