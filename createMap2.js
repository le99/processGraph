const fs = require('fs');
const es = require('event-stream');

var cont = 0;
var vertices = [];
var ways = [];

var file = fs.createReadStream('./data/s1/mapVertices.json')
  .pipe(es.split())
  .pipe(es.map(function (data, cb) { //turn this async function into a stream
      // console.log('data' + data);
      cb(null, data);   //render it nicely
      cont++;
      vertices.push(JSON.parse(data));
    }))
  .on('error', function(err){
    console.log(err);
  })
  .on('end', function(){
    console.log('lines: ' + cont);
    console.log(ways[0]);
  });

// var file = fs.createReadStream('./data/s1/mapWays.json')
//   .pipe(es.split())
//   .pipe(es.map(function (data, cb) { //turn this async function into a stream
//       // console.log('data' + data);
//       cb(null, data);   //render it nicely
//       cont++;
//       ways.push(JSON.parse(data));
//     }))
//   .on('error', function(err){
//     console.log(err);
//   })
//   .on('end', function(){
//     console.log('lines: ' + cont);
//     console.log(ways[0]);
//   });
