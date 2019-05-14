//node --max-old-space-size=2000 ./filterVerticesInWays.js

const _ = require('underscore');
const fs = require('fs');
const es = require('event-stream');
const JSONStream = require('JSONStream');


const IN_INFRACTIONS = './data/s1/infractions.json';
const OUT_FILE = './data/s2/infractions.json';

var t0 = new Date().getTime();
var progress = 0;

var lines = {};
var progress = 0;
var file2 = fs.createReadStream(IN_INFRACTIONS)
  .pipe(es.split())
  .pipe(es.parse())
  .pipe(es.map(function(data, cb){
    cb(null, [data.id, {lat: data.lat, lon: data.lon}]);
    progress++;
    if(progress % 50000 === 0){
      console.log(progress);
    }
    lines[data.id] = {lat: data.lat, lon: data.lon};
  }))
    .on('end', function(){
      console.log('time:' + ((new Date().getTime() - t0)/1000));
      console.log('writing');
      fs.writeFile(OUT_FILE, JSON.stringify(lines, null, 2), function(err){
        if(err){
          return console.log(err);
        }
        console.log('time:' + ((new Date().getTime() - t0)/1000));
      });
    });
