const fs = require("fs");
const { parse } = require("csv-parse");

const columnsToKeep = [2, 4, 6, 8];
let lastRow = null;

fs.createReadStream("C://Users//HP//Desktop//dtwin_native//dt1.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    lastRow = row.map((value) => parseFloat(value));
  })
  .on("end", function () {
    if (lastRow) {
      const filteredRow = lastRow.filter((value, index) => columnsToKeep.includes(index + 1));
      console.log(filteredRow);
    } else {
      console.log("No data found in the CSV.");
    }
    console.log("finished");
  })
  .on("error", function (error) {
    console.log(error.message);
  });
