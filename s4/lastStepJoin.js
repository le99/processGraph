const _ = require('underscore');
const fs = require('fs');
const es = require('event-stream');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'myproject';
const client = new MongoClient(url);
const async = require('async');


const OUT_FILE = './data/s4/finalGraph.json';


var t0 = new Date().getTime();

async.series(_.map([
  './data/s4/closestVertex.json',
  './data/s3/graph.json',
  './data/s4/groupedInfractions.json'
], function(path){
  return readToObject(path);
}),function(err, results){
  if(err){
    return console.log(err);
  }

  var closestVertex = results[0];
  var graph = results[1];
  var groupedInfractions = results[2];

  var closesLatLon = {};
  _.each(closestVertex, function(v, k){
    if(!closesLatLon[v.id]){
      closesLatLon[v.id] = [];
    }
    closesLatLon[v.id].push(k);
  });


  var res = _.map(graph, function(v, k){
    var c = _.clone(v);
    c.infractions = [];

    var latLongs = closesLatLon[k];
    _.each(latLongs, function(ll){
      c.infractions = c.infractions.concat(groupedInfractions[ll]);
    });
    return c;
  });

  console.log('time:' + ((new Date().getTime() - t0)/1000));

  fs.writeFile(OUT_FILE, JSON.stringify(res, null, 2), function(err){
    if(err){
      return console.log(err);
    }
    console.log('time:' + ((new Date().getTime() - t0)/1000));
  });

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
