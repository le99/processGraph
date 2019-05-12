const fs = require('fs');
const es = require('event-stream');

var cont = 0;

var out = fs.createWriteStream('./data/out/XMLs/map.xml');
var file = fs.createReadStream('./data/in/XMLs/map.xml')
// var out = fs.createWriteStream('./data/out/XMLs/Central-WashingtonDC-OpenStreetMap.xml');
// var file = fs.createReadStream('./data/in/XMLs/Central-WashingtonDC-OpenStreetMap.xml')
  .pipe(es.split())
  .pipe(es.map(function (data, cb) { //turn this async function into a stream
      cb(null, data+"\n");
      cont ++;
    }))
  .pipe(out)
  .on('error', function(err){
    console.log(err);
  })
  .on('finish', function(){
      console.log('Copied file, lines: ' + cont);
  });          // pipe it to stdout
