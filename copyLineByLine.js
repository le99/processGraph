const fs = require('fs');
const es = require('event-stream');


var out = fs.createWriteStream('./data/lineOut.txt')
var file = fs.createReadStream('./data/line.txt')
  .pipe(es.split())
  .pipe(es.map(function (data, cb) { //turn this async function into a stream
      console.log(data);
      cb(null, data+"\n");   //render it nicely
    }))
  .pipe(out)
  .on('error', function(err){
    console.log(err);
  });          // pipe it to stdout
