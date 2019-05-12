const _ = require('underscore');
const _cliProgress = require('cli-progress');
const fs = require('fs');
const es = require('event-stream');
const JSONStream = require('JSONStream');
const sax = require("sax");
const XmlStream = require('xml-stream');

const stream = require('stream');

var pass = new stream.PassThrough({objectMode: true});

// const IN_FILE = './data/in/XMLs/map.xml';
// const OUT_FILE = './data/out/XMLs/mapVertices.json';

const IN_FILE = './data/exampleMap.xml';
const OUT_FILE = './data/out/exampleMapVertices.json';

var progress = 0;

var file = fs.createReadStream(IN_FILE);
var xml = new XmlStream(file);
xml.preserve('osm > node', true);
xml.on('endElement: osm > node', function(item) {
  pass.write({id: item.$.id, lat: item.$.lat, lon: item.$.lon});
  pass.resume();
});
xml.on('end', function(){
  pass.end();
});

var out = fs.createWriteStream(OUT_FILE)
pass
  .pipe(es.map(function (data, cb) { //turn this async function into a stream
      console.log('data');
      console.log( data);
      cb(null, data);   //render it nicely
      progress++;
    }))
  .pipe(JSONStream.stringify())
  .pipe(out)
  .on('error', function(err){
    console.log(err);
  })
  .on('finish', function(){
    // bar1.stop();
  });
