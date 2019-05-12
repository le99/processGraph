const _ = require('underscore');
const _cliProgress = require('cli-progress');
const fs = require('fs');
const es = require('event-stream');
const JSONStream = require('JSONStream');
const sax = require("sax");
const XmlStream = require('xml-stream');

const stream = require('stream');

var pass = new stream.PassThrough({objectMode: true});

const IN_FILE = './data/in/XMLs/map.xml';
const OUT_FILE = './data/out/XMLs/mapWays.xml';

// const IN_FILE = './data/exampleMap.xml';
// const OUT_FILE = './data/out/exampleMap.json';

var progress = 0;

var t0 = new Date().getTime();


var file = fs.createReadStream(IN_FILE);
var xml = new XmlStream(file);
xml.preserve('osm > way', true);
xml.collect('subitem');
xml.on('endElement: osm > way', function(item) {

  var highway = _.some(item.$children, function(data){
    return data.$name === 'tag' && data.$.k && data.$.k === 'highway';
  });
  if(highway){
    var points = _.chain(item.$children)
      .filter(function(data){
        return data.$name == 'nd';
      })
      .map(function(data){
        return data.$.ref;
      })
      .value();

    pass.write(points);
    pass.resume();
  }
});
xml.on('end', function(){
  pass.end();
});

var out = fs.createWriteStream(OUT_FILE)
pass
  .pipe(es.map(function (data, cb) { //turn this async function into a stream
      // console.log('data');
      // console.log( data);
      cb(null, data);   //render it nicely
      progress++;
      if(progress % 10000 === 0){
        console.log(progress);
      }
    }))
  .pipe(JSONStream.stringify())
  .pipe(out)
  .on('error', function(err){
    console.log(err);
  })
  .on('finish', function(){
    console.log('time:' + ((new Date().getTime() - t0)/1000));
  });
