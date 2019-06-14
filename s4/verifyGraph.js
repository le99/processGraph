const _ = require('underscore');
const fs = require('fs');
const async = require('async');

var t0 = new Date().getTime();

async.series(_.map([
  './data/s4/finalGraphSic.json'
], function(path){
  return readToObject(path);
}),function(err, results){
  if(err){
    return console.log(err);
  }

  var graph = results[0];

  console.log('VerticesSic:');
  console.log(_.keys(graph).length);

  console.log('Arcos:');
  var arcs = _.reduce(graph, function(memo, n){
    return memo + n.adj.length;
  }, 0);
  console.log(arcs/2);

  console.log('Infractions:');
  var infractions = _.reduce(graph, function(memo, n){
    return memo + n.infractions.length;
  }, 0);
  console.log(infractions);

});



function readToObject(path){
  return function(callback){
    fs.readFile(path, function(err, data){
        if(err){
          return callback(err);
        }
        callback(null, JSON.parse(data));
        console.log('time:' + ((new Date().getTime() - t0)/1000));
        return;
    });
  };
}
