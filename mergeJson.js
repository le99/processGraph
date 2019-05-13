const fs = require('fs');
const es = require('event-stream');
const JSONStream = require('JSONStream');

var t0 = new Date().getTime();

function makeStream(file){
  return fs.createReadStream(file)
    .pipe(es.split());
};

var out = fs.createWriteStream('./data/s1/infractions.json');
var file = fs.createReadStream('./data/s1/infractions/Abril_wgs84.json')
  .pipe(es.split())
  .pipe(out)
  .on('error', function(err){
    console.log(err);
  })
  .on('finish', function () {
    out.end();
    console.log('time:' + ((new Date().getTime() - t0)/1000));
  });
