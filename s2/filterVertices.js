//node --max-old-space-size=2000 ./filterVerticesInWays.js

const _ = require('underscore');
const fs = require('fs');
const es = require('event-stream');


const IN_VERTICES = './data/s2/mapVertices.json';
const IN_WAYS = './data/s2/verticesFromWays.json';
const OUT_FILE = './data/s2/mapVerticesFiltered.json';

var t0 = new Date().getTime();


fs.readFile(IN_VERTICES, function(err, data){
  if(err){
    return console.log(err);
  }
  var vertices = JSON.parse(data);
  console.log('time:' + ((new Date().getTime() - t0)/1000));

  fs.readFile(IN_WAYS, function(err, data){
    if(err){
      return console.log(err);
    }
    var ways = JSON.parse(data);
    console.log('time:' + ((new Date().getTime() - t0)/1000));

    var filtered = {};
    _.each(ways, function(w){
      if(vertices[w]){
        filtered[w] = vertices[w];
      }
      else{
        console.log("err vertix not found:");
        console.log(w);
      }
    });

    fs.writeFile(OUT_FILE, JSON.stringify(filtered, null, 2), function(err){
      if(err){
        return console.log(err);
      }
      console.log('time:' + ((new Date().getTime() - t0)/1000));
    });

  });
});
