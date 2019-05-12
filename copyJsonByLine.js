const fs = require('fs');
const es = require('event-stream');


var out = fs.createWriteStream('./data/out/lineJson.json')
var file = fs.createReadStream('./data/lineJson.json')
  .pipe(es.split())
  .pipe(es.parse())
  .pipe(es.stringify())
  .pipe(es.map(function (data, cb) { //turn this async function into a stream
      console.log(data);
      cb(null, data);   //render it nicely
    }))
  .pipe(out)
  .on('error', function(err){
    console.log(err);
  });          // pipe it to stdout
