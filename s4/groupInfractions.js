//node --max-old-space-size=2000 ./filterVerticesInWays.js

const _ = require('underscore');
const fs = require('fs');
const es = require('event-stream');

// const IN_INFRACTIONS = './data/infractionsObj.json';
// const OUT_FILE = './data/groupedInfractions.json';

// const IN_GRAPH = './data/s3/graph.json';
const IN_INFRACTIONS = './data/s2/infractions.json';
const OUT_FILE = './data/s4/groupedInfractions.json';

var t0 = new Date().getTime();


fs.readFile(IN_INFRACTIONS, function(err, data){
  if(err){
    return console.log(err);
  }
  var infractions = JSON.parse(data);
  console.log('time:' + ((new Date().getTime() - t0)/1000));
  console.log(_.keys(infractions).length);

  var grouped = _.chain(infractions)
    .map(function(v, k){
      var o = _.clone(v);
      o.id = k;
      return o;
    })
    .groupBy(function(v, k){
      return JSON.stringify([v.lat, v.lon]);
      // return (v.lat + "," + v.lon);
    })
    .mapObject(function(v, k){
      return _.map(v, function(s){
        return s.id;
      });
    })
    .value();

  // console.log(grouped);
  console.log(_.keys(grouped).length);
  console.log('time:' + ((new Date().getTime() - t0)/1000));

  fs.writeFile(OUT_FILE, JSON.stringify(grouped, null, 2), function(err){
    if(err){
      return console.log(err);
    }
    console.log('time:' + ((new Date().getTime() - t0)/1000));
  });

});
