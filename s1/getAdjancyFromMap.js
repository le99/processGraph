const _ = require('underscore');
const fs = require('fs');
const es = require('event-stream');
const JSONStream = require('JSONStream');
const sax = require("sax");

const stream = require('stream');

var pass = new stream.PassThrough({objectMode: true});

const IN_FILE = './data/in/XMLs/map.xml';
const OUT_FILE = './data/s1/mapWays.json';

// const IN_FILE = './data/in/XMLs/Central-WashingtonDC-OpenStreetMap.xml';
// const OUT_FILE = './data/out/XMLs/CentralMapVertices.json';

// const IN_FILE = './data/exampleMap.xml';
// const OUT_FILE = './data/out/exampleMap.json';

var file = fs.createReadStream(IN_FILE);
var out = fs.createWriteStream(OUT_FILE);

var progress = 0;
var t0 = new Date().getTime();

var saxStream = sax.createStream(true, {});

var firstLine = true;

var openWay = false;
var wayData = null;

saxStream.on("error", function (e) {
  // unhandled errors will throw, since this is a proper node
  // event emitter.
  console.error("error!", e)
  // clear the error
  this._parser.error = null
  this._parser.resume()
});

saxStream.on("opentag", function (node) {
  // console.log(node);
  if(node.name === 'way'){
    openWay = true;
    wayData = {nd:[], highway: false};
  }
  else if(node.name === 'nd' && openWay){
    wayData.nd.push(node.attributes.ref);
  }
  else if(node.name === 'tag' && openWay){
    if(node.attributes.k === 'highway'){
      wayData.highway = true;
    }
  }
});

saxStream.on("closetag", function (node) {
  if(node === 'way'){
    openWay = false;

    if(wayData && wayData.highway){
      if(!firstLine){
        out.write('\r\n');
      }
      else{
         firstLine = false;
      }
      out.write(JSON.stringify(wayData.nd));
    }
    wayData = null;

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
