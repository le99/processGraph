//node --max-old-space-size=2000 ./filterVerticesInWays.js

const _ = require('underscore');
const fs = require('fs');
const es = require('event-stream');
const JSONStream = require('JSONStream');

var cont = 0;
var vertices = {};
var ways = [];

var t0 = new Date().getTime();


// const IN_FILE = './data/mapWays.json';
// const IN_VERTICES = './data/mapVertices.json';
// const OUT_FILE = './data/filteresVerticesFromWays.json';

const IN_FILE = './data/s1/mapWays.json';
const IN_VERTICES = './data/s1/mapVertices.json';
const OUT_FILE = './data/s2/filteredVerticesFromWays.json';




var writeFilteredVertices = function(waysArray){
  var uniques = _.chain(waysArray)
    .flatten(true)
    .sortBy(function(val){
      return val;
    })
    .uniq(true)
    .value();
  // fs.writeFile(OUT_FILE, JSON.stringify(uniques, null, 2), function(err){
  //   if(err){
  //     return console.log(err);
  //   }
  //   console.log('time:' + ((new Date().getTime() - t0)/1000));
  // });

  var toWrite = {};
  _.each(uniques, function(data){
    if(vertices[data]){
      toWrite[data] = {
        lat: vertices[data].lat,
        lon: vertices[data].lon
      };
    }
    else{
      console.log("didn't find value:");
      console.log(data);
    }
  });

  console.log('writing out file');

  fs.writeFile(OUT_FILE, JSON.stringify(toWrite, null, 2), function(err){
    if(err){
      return console.log(err);
    }
    console.log('time:' + ((new Date().getTime() - t0)/1000));
  });

  // console.log('writing out file');
  // var out = fs.createWriteStream(OUT_FILE);
  // var first = true;
  // _.each(uniques, function(data){
  //   if(vertices[data]){
  //     if(!first){
  //       out.write('\r\n');
  //     }
  //     else{
  //       first = false;
  //     }
  //     out.write(JSON.stringify({id: data,
  //       lat: vertices[data].lat,
  //       lon: vertices[data].lon}));
  //   }
  //   else{
  //     console.log("didn't find value:");
  //     console.log(data);
  //
  //   }
  // });
  // out.end();

  // es.readArray(uniques)
  //   .pipe(es.map(function(data, callback){
  //
  //     if(vertices[data]){
  //       callback(null, {id: data,
  //         lat: vertices[data].lat,
  //         lon: vertices[data].lon});
  //     }
  //     else{
  //       callback("didn't find value:");
  //       console.log(data);
  //
  //     }
  //   }))
  //   .pipe(es.stringify())
  //   // .pipe(JSONStream.stringify())
  //   .pipe(fs.createWriteStream(OUT_FILE));

};

var readWays = function(){
  var contWays = 0;
  var file2 = fs.createReadStream(IN_FILE)
    .pipe(es.split())
    .pipe(es.parse())
    .pipe(es.map(function (data, cb) { //turn this async function into a stream
        // console.log('data' + data);
        cb(null, data);
        ways.push(data);
      }))
    .on('error', function(err){
      console.log(err);
    })
    .on('end', function(){
      console.log('--ways--');
      console.log('lines: ' + contWays);
      console.log('ways.length: ' + ways.length);

      writeFilteredVertices(ways);
    });
};


var file = fs.createReadStream(IN_VERTICES)
  .pipe(es.split())
  .pipe(es.parse())
  .pipe(es.map(function (data, cb) { //turn this async function into a stream
      // console.log('data' + data);
      cb(null, data);   //render it nicely
      cont++;

      // if(cont < 5000*1000){
        vertices[data.id] = {lat: data.lat, lon: data.lon};
      // }
      // else if(cont == 5000*1000){
      //   console.log(process.memoryUsage());
      // }
    }))
  .on('error', function(err){
    console.log(err);
  })
  .on('end', function(){
    console.log('--vertices--');
    console.log('lines: ' + cont);
    console.log('vertices.length: ' + vertices.length);
    readWays();
  });
