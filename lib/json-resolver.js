'use strict';

const refResolver = require('./refResolver'),
      allOfResolver = require('./allof-resolver');

module.exports = {
  resolveRef: function(filePath, callback) {
    refResolver.resolve(filePath, callback);
  },
  resolveAllOf: function(filePath, callback) {
    allOfResolver.resolve(filePath, callback);
  }
}

// const fs = require('fs');

// refResolver.resolve('/opt/app/tmp/api_spec/index.yml', function(err, result) {
// // refResolver.resolve('/opt/app/tmp/specIndex.yml', function(err, result) {
//   if(err) {
//     throw(err);
//   }
//   debugger
//   const dump = JSON.stringify(result);
//   fs.writeFile('./tmp/bundled_spec.json', dump, function(err) {
//     if(err) {
//       console.log(err);
//     }
//   })
// });

// // allOfResolver.resolve('/opt/app/tmp/specIndex.yml', function(err, result) {
// allOfResolver.resolve('/opt/app/tmp/bundled_spec.json', function(err, result) {
//   if (err) {
//     throw(err);
//   }
//   debugger
//   const dump = JSON.stringify(result);
//   fs.writeFile('./tmp/merged_spec.json', dump, function(err) {
//     if(err) {
//       console.log(err);
//     }
//   })
// });
//
// debugger
