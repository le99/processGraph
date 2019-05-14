//node --max-old-space-size=2000 ./filterVerticesInWays.js

const _ = require('underscore');
const fs = require('fs');
const es = require('event-stream');
const JSONStream = require('JSONStream');

var cont = 0;
var ways = [];

var t0 = new Date().getTime();


// const IN_FILE = './data/mapVertices.json';
// const OUT_FILE = './data/mapVertices.json';

const IN_FILE = './data/s1/mapVertices.json';
const OUT_FILE = './data/s2/mapVertices.json';

var vertices = {};
var progress = 0;
var file2 = fs.createReadStream(IN_FILE)
  .pipe(es.split())
  .pipe(es.parse())
  .pipe(es.map(function(data, cb){
    cb(null, [data.id, {lat: data.lat, lon: data.lon}]);
    progress++;
    if(progress % 50000 === 0){
      console.log(progress);
    }
    vertices[data.id] = {id: data.id, lat: data.lat, lon: data.lon};
    }))
    .on('end', function(){
      console.log('time:' + ((new Date().getTime() - t0)/1000));
      console.log('writing');
      fs.writeFile(OUT_FILE, JSON.stringify(vertices, null, 2), function(err){
        if(err){
          return console.log(err);
        }
        console.log('time:' + ((new Date().getTime() - t0)/1000));
      });
    });

// var progress = 0;
// var file2 = fs.createReadStream(IN_FILE)
//   .pipe(es.split())
//   .pipe(es.parse())
//   .pipe(es.map(function(data, cb){
//     cb(null, [data.id, {lat: data.lat, lon: data.lon}]);
//     progress++;
//     if(progress % 50000 === 0){
//       console.log(progress);
//     }
//   }))
//   .pipe(JSONStream.stringifyObject())
//   .pipe(fs.createWriteStream(OUT_FILE))
//   .on('error', function(err){
//     console.log(err);
//   })
//   .on('finish', function(){
//     console.log('time:' + ((new Date().getTime() - t0)/1000));
//   });
