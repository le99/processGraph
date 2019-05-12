const fs = require('fs');
const es = require('event-stream');
const JSONStream = require('JSONStream');

var out = fs.createWriteStream('./data/out/json.json')
var file = fs.createReadStream('./data/json.json')
  .pipe(JSONStream.parse([true]))
  .pipe(es.map(function (data, cb) { //turn this async function into a stream
      console.log('data' + data);
      cb(null, data);   //render it nicely
    }))
  .pipe(JSONStream.stringify())
  .pipe(out)
  .on('error', function(err){
    console.log(err);
  });          // pipe it to stdout
