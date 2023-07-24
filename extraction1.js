const fs = require('fs');
const csvParser = require('csv-parser');
const papa = require('papaparse');

function getSensorReadings(data) {
  const tail = data.slice(-1).pop();
  const readings = [
    parseFloat(tail[1]),
    parseFloat(tail[3]),
    parseFloat(tail[5]),
    parseFloat(tail[7]),
  ];
  return readings;
}

fs.createReadStream('C://Users//HP//Desktop//dtwin_native//dt1.csv')
  .pipe(csvParser())
  .on('data', (row) => {
    // Process each row here if needed
  })
  .on('end', () => {
    const csvData = fs.readFileSync('C://Users//HP//Desktop//dtwin_native//dt1.csv', 'utf8');
    const parsedData = papa.parse(csvData, { header: true }).data;

    const readings = getSensorReadings(parsedData);
    console.log(readings);
  });
