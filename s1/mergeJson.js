const _ = require('underscore');
const fs = require('fs');
const es = require('event-stream');
const JSONStream = require('JSONStream');

const IN_DIR = './data/s1/infractions/';
const IN_FILES = [
  'Abril_wgs84.json',
  'August_wgs84.json',
  'December_wgs84.json',
  'February_wgs84.json',
  'January_wgs84.json',
  'July_wgs84.json',
  'June_wgs84.json',
  'March_wgs84.json',
  'May_wgs84.json',
  'November_wgs84.json',
  'October_wgs84.json',
  'September_wgs84.json'
];

var t0 = new Date().getTime();

function makeStream(file){
  return fs.createReadStream(file)
    .pipe(es.split());
};

var out = fs.createWriteStream('./data/s1/infractions.json');

es.merge(
  _.map(IN_FILES, function(f){
    return fs.createReadStream(IN_DIR + f)
      .pipe(es.split());
  })
)
.pipe(es.join('\r\n'))
.pipe(out)
.on('error', function(err){
  console.log(err);
})
.on('finish', function () {
  out.end();
  console.log('time:' + ((new Date().getTime() - t0)/1000));
});

// var file = fs.createReadStream('./data/s1/infractions/Abril_wgs84.json')
//   .pipe(out)
//   .on('error', function(err){
//     console.log(err);
//   })
//   .on('finish', function () {
//     out.end();
//     console.log('time:' + ((new Date().getTime() - t0)/1000));
//   });
