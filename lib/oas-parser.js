'use strict';

const resolver = require('./resolver');
const fileParser = require('./file-parser');
const fs = require('fs');

resolver.resolve('/opt/app/tmp/api_spec/index.yml', function(err, result) {
// resolver.resolve('/opt/app/tmp/specIndex.yml', function(err, result) {
  debugger
  const dump = JSON.stringify(result);
  fs.writeFile('./tmp/bundled_spec.json', dump, function(err) {
    if(err) {
      console.log(err);
    }
  })
});

// fileParser.parse('./tmp/spec.json', function(err, spec) {
//   debugger;
// });

debugger
