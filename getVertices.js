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
const OUT_FILE = './data/out/XMLs/mapVertices.json';

// const IN_FILE = './data/in/XMLs/Central-WashingtonDC-OpenStreetMap.xml';
// const OUT_FILE = './data/out/XMLs/CentralMapVertices.json';

// const IN_FILE = './data/exampleMap.xml';
// const OUT_FILE = './data/out/exampleMapVertices.json';

var progress = 0;
var t0 = new Date().getTime();

var file = fs.createReadStream(IN_FILE);
var out = fs.createWriteStream(OUT_FILE);

var saxStream = sax.createStream(true, {})

var firstLine = false;
var openNode = false;
saxStream.on("error", function (e) {
  // unhandled errors will throw, since this is a proper node
  // event emitter.
  console.error("error!", e)
  // clear the error
  this._parser.error = null
  this._parser.resume()
})
saxStream.on("opentag", function (node) {
  // console.log(node);
  if(node.name === 'node'){
    openNode = true;
    if(!firstLine){
      out.write('\r\n');
    }
    else{
       firstLine = false;
     }
    out.write(JSON.stringify({
      id: node.attributes.id,
      lat: node.attributes.lat,
      lon: node.attributes.lon
    }));
  }
});

saxStream.on("closetag", function (node) {
  if(node === 'node'){
    openNode = false;

    progress++;
    if(progress % 50000 === 0){
      console.log(progress);
    }
  }

});

saxStream.on('end', function () {
  out.end();
  console.log('time:' + ((new Date().getTime() - t0)/1000));
});

file
  .pipe(saxStream);
