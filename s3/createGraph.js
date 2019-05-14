//node --max-old-space-size=2000 ./filterVerticesInWays.js

const _ = require('underscore');
const fs = require('fs');
const es = require('event-stream');


const IN_VERTICES = './data/s2/mapVerticesFiltered.json';
const IN_WAYS = './data/s2/ways.json';
const OUT_FILE = './data/s3/graph.json';

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

    var graph = _.mapObject(vertices, function(val, key){
      var o = _.clone(val);
      o.adj = [];
      return o;
    });
    _.each(ways, function(way){
      for(n = 0; n < way.length - 1; n++){
        graph[way[n]].adj.push(way[n+1]);
        graph[way[n+1]].adj.push(way[n]);
      }
    });

    fs.writeFile(OUT_FILE, JSON.stringify(graph, null, 2), function(err){
      if(err){
        return console.log(err);
      }
      console.log('time:' + ((new Date().getTime() - t0)/1000));
    });

  });
});
