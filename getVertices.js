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

const IN_FILE = './data/in/XMLs/Central-WashingtonDC-OpenStreetMap.xml';
const OUT_FILE = './data/out/XMLs/CentralMapVertices.json';

// const IN_FILE = './data/exampleMap.xml';
// const OUT_FILE = './data/out/exampleMapVertices.json';

var progress = 0;
var t0 = new Date().getTime();

var file = fs.createReadStream(IN_FILE);
var out = fs.createWriteStream(OUT_FILE)

var xml = new XmlStream(file);
var firstLine = true;

// xml.preserve('osm > node', true);
xml.on('endElement: osm > node', function(item) {
  // pass.write({id: item.$.id, lat: item.$.lat, lon: item.$.lon});
  // pass.resume();
  if(!firstLine){
    out.write('\r\n');
  }
  else{
    firstLine = false;
  }
  out.write(JSON.stringify({id: item.$.id, lat: item.$.lat, lon: item.$.lon}));

  progress++;
  if(progress % 10000 === 0){
    console.log(progress);
  }
  
});
xml.on('end', function(){
  // pass.end();
  out.end();
  console.log('time:' + ((new Date().getTime() - t0)/1000));
});

// pass
//   .pipe(es.map(function (data, cb) { //turn this async function into a stream
//       // console.log('data');
//       // console.log( data);
//       cb(null, data);   //render it nicely
//       // progress++;
//       // if(progress % 10000 === 0){
//       //   console.log(progress);
//       // }
//     }))
//   .pipe(JSONStream.stringify())
//   .pipe(out)
//   .on('error', function(err){
//     console.log(err);
//   })
//   .on('finish', function(){
//     console.log('time:' + ((new Date().getTime() - t0)/1000));
//   });
