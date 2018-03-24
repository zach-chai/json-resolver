'use strict';

const path = require('path'),
      fs   = require('fs');

module.exports = {
  extension: function(filePath) {
    try {
      return path.extname(path.basename(filePath));
    } catch(e) {
      console.log(e);
    }
  },

  canLoad: function(path) {
    try {
      return fs.lstatSync(path).isFile();
    } catch(e) {
      console.log(e);
    }
  },

  load: function(path, callback) {
    try {
      fs.readFile(path, 'utf8', callback);
    } catch(e) {
      console.log(e);
    }
  }
}
