'use strict';

const refResolver = require('./refResolver');

module.exports = {
  resolve: function(filePath, callback) {
    refResolver.resolve(filePath, callback);
  }
}

const fs = require('fs');
refResolver.resolve('/opt/app/tmp/api_spec/index.yml', function(err, result) {
// refResolver.resolve('/opt/app/tmp/specIndex.yml', function(err, result) {
  if(err) {
    throw(err);
  }
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
