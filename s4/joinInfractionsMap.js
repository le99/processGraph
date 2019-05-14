//node --max-old-space-size=2000 ./filterVerticesInWays.js

const _ = require('underscore');
const fs = require('fs');
const es = require('event-stream');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'myproject';
const client = new MongoClient(url);
const async = require('async');

// const IN_INFRACTIONS = './data/infractionsObj.json';
// const OUT_FILE = './data/groupedInfractions.json';

const IN_GRAPH = './data/s3/graph.json';
const IN_INFRACTIONS = './data/s4/groupedInfractions.json';
const OUT_FILE = './data/s4/closestVertex.json';

var t0 = new Date().getTime();

client.connect(function(err) {
  if(err){
    return console.log(err);
  }
  console.log("Connected successfully to server");

  const db = client.db(dbName);


  loadFile(db, function(err, res){
    if(err){
      return console.log(err);
    }
    console.log('finish');
    console.log('time:' + ((new Date().getTime() - t0)/1000));

  });

  // add(db, [{id: 1}, {id:2}], function(){
  //   if(err){
  //     return console.log(err);
  //   }
  // });

  // client.close();
});

function add(db, data, callback){
    const collection = db.collection('documents');
    collection.insertMany(data, callback);

}

function loadFile(db, callback){
  fs.readFile(IN_INFRACTIONS, function(err, data){
    if(err){
      return console.log(err);
    }
    var groupedInfractions = JSON.parse(data);
    console.log('time:' + ((new Date().getTime() - t0)/1000));

    var groupedCoords = _.map(_.keys(groupedInfractions), function(v){
      return JSON.parse(v);
    });

    fs.readFile(IN_GRAPH, function(err, data){
      if(err){
        return console.log(err);
      }
      var graph = JSON.parse(data);
      console.log('time:' + ((new Date().getTime() - t0)/1000));

      var toAdd = _.map(graph, function(d){
        return {
          id: d.id,
          coords: [d.lon, d.lat],
          adj: d.adj
        };
      });
      console.log(toAdd.length);
      // console.log(toAdd);
      // callback();
      add(db, toAdd, callback);

      // var closestVertex = {};

      // console.log('wait: ' + _.keys(groupedCoords).length);
      // var group = groupedCoords[0];
      // var progress = 0;
      // _.each(groupedCoords, function(group){
      //   var minGraph = _.min(graph, function(v, k){
      //     return harvesine(group[0], group[1], v.lat, v.lon);
      //   });
      //
      //   closestVertex[JSON.stringify(group)] = minGraph;
      //   progress++;
      //   if(progress%20 === 0){
      //     console.log(progress);
      //   }
      // });

      // fs.writeFile(OUT_FILE, JSON.stringify(closestVertex, null, 2), function(err){
      //   if(err){
      //     return console.log(err);
      //   }
      //   console.log('time:' + ((new Date().getTime() - t0)/1000));
      // });

      // _.each(groupedCoords, function(v){
      //
      // });
    });

  });
}




// console.log(harvesine(4.760439, -74.044607, 4.751522, -74.046356));

//https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
function harvesine(lat1, lon1, lat2, lon2){

  function toRad(x) {
    return x * Math.PI / 180;
  }

  var R = 6371; // km
  //has a problem with the .toRad() method below.
  var x1 = lat2-lat1;
  var dLat = toRad(x1);
  var x2 = lon2-lon1;
  var dLon = toRad(x2);
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d;
}
