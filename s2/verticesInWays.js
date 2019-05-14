//node --max-old-space-size=2000 ./filterVerticesInWays.js

const _ = require('underscore');
const fs = require('fs');
const es = require('event-stream');
const JSONStream = require('JSONStream');

var cont = 0;
var ways = [];

var t0 = new Date().getTime();


// const IN_FILE = './data/mapWays.json';
// const OUT_FILE = './data/filteresVerticesFromWays.json';

const IN_FILE = './data/s1/mapWays.json';
const OUT_FILE = './data/s2/verticesFromWays.json';

var progress = 0;
var file2 = fs.createReadStream(IN_FILE)
  .pipe(es.split())
  .pipe(es.parse())
  .pipe(es.flatmapSync(function (data) {
    return data;
  }))
  .pipe(JSONStream.stringify())
  .pipe(fs.createWriteStream(OUT_FILE))
  .on('error', function(err){
    console.log(err);
  })
  .on('finish', function(){
    console.log('time:' + ((new Date().getTime() - t0)/1000));

  });
