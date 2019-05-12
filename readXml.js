const fs = require('fs');
const es = require('event-stream');
const JSONStream = require('JSONStream');
const sax = require("sax");
const XmlStream = require('xml-stream');

const stream = require('stream');

var pass = new stream.PassThrough({objectMode: true});

var file = fs.createReadStream('./data/exampleMap.xml');
var xml = new XmlStream(file);
xml.preserve('osm > node', true);
xml.collect('subitem');
xml.on('endElement: osm > node', function(item) {
  pass.write({id: item.$.id, lat: item.$.lat, lon: item.$.lon});
  pass.resume();
});
xml.on('end', function(){
  pass.end();
});

var out = fs.createWriteStream('./data/out/exampleMap.json')
pass
  .pipe(es.map(function (data, cb) { //turn this async function into a stream
      console.log('data');
      console.log( data);
      cb(null, data);   //render it nicely
    }))
  .pipe(JSONStream.stringify())
  .pipe(out)
  .on('error', function(err){
    console.log(err);
  });
