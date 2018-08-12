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
};


const fs = require('fs');
const yaml = require('js-yaml');

// fs.readFile('/opt/app/spec/fixtures/specIndex.yml', 'utf8', function(err, file) {
//   const spec = yaml.safeLoad(file);
//
//   refResolver.resolve(spec, function(err, result) {
//     if(err) {
//       throw(err);
//     }
//     debugger
//     const dump = JSON.stringify(result);
//     fs.writeFile('./tmp/bundled_spec.json', dump, function(err) {
//       if(err) {
//         console.log(err);
//       }
//     })
//   });
// });

// refResolver.resolve('/opt/app/tmp/open_api_data/api_spec/index.yml.ejs', function(err, result) {
refResolver.resolve('/opt/app/spec/fixtures/specIndex.yml', function(err, result) {
  if(err) {
    debugger
  } else {
    debugger
    const dump = JSON.stringify(result);
    fs.writeFile('./tmp/bundled_spec.json', dump, function(err) {
      if(err) {
        console.log(err);
      }
    })
  }
});

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

// debugger
