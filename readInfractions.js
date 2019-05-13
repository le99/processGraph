const _ = require('underscore');
const fs = require('fs');
const es = require('event-stream');
const JSONStream = require('JSONStream');
const parse = require('csv-parse')

const IN_FILE = './data/infractions.csv';
const OUT_FILE = './data/out/infractions.json';

// const IN_FILE = './data/in/Datos Proyecto 3/Abril_wgs84.csv';
// const OUT_FILE = './data/s1/Abril_wgs84.json';

const IN_DIR = './data/in/Datos Proyecto 3/';
const OUT_DIR = './data/s1/infractions/';
const IN_FILES = [
  'Abril_wgs84.csv',
  'August_wgs84.csv',
  'December_wgs84.csv',
  'February_wgs84.csv',
  'January_wgs84.csv',
  'July_wgs84.csv',
  'June_wgs84.csv',
  'March_wgs84.csv',
  'May_wgs84.csv',
  'November_wgs84.csv',
  'October_wgs84.csv',
  'September_wgs84.csv'
];


// processFile(IN_FILE, OUT_FILE);


_.map(IN_FILES, function(file){
  processFile(IN_DIR + file, OUT_DIR + file.split('\.')[0] + '.json');
});

function processFile(in_file, out_file){
  var file = fs.createReadStream(in_file);
  var out = fs.createWriteStream(out_file);

  var progress = 0;
  var t0 = new Date().getTime();

  var firstLine = true;

  var inFirstRow = true;
  var firstRow = null;

  const parser = parse({
    delimiter: ';'
  })


  // Use the readable stream api
  parser.on('data', function(csvrow){
    if(!firstRow){
      firstRow = csvrow;
      firstRow = _.chain(csvrow)
        .map(function(val, idx){
          return {idx: idx, val: val};
        })
        .indexBy('val')
        .mapObject(function(val, idx){
          return parseInt(val.idx, 10);
        })
        .value();
    }
    else{
      if(!firstLine){
        out.write('\r\n');
      }
      else{
         firstLine = false;
      }
      // console.log(csvrow);
      out.write(JSON.stringify({
        id: csvrow[firstRow['OBJECTID']],
        lat: csvrow[firstRow['LAT']],
        lon: csvrow[firstRow['LONG']],
      }));

      progress++;
      if(progress % 50000 === 0){
        console.log(progress);
      }
    }

  });
  // Catch any error
  parser.on('error', function(err){
    console.error(err.message);
  });
  parser.on('end', function(){
    out.end();
    console.log('time:' + ((new Date().getTime() - t0)/1000));
  });

  file
    .pipe(parser);

}
