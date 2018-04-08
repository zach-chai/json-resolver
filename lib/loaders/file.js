'use strict';

const path = require('path'),
      fs   = require('fs');

module.exports = {
  extension: function(filePath) {
    try {
      return path.extname(path.basename(filePath));
    } catch(e) {
      throw e;
    }
  },

  canLoad: function(path) {
    try {
      return fs.lstatSync(path).isFile();
    } catch(e) {
      throw e;
    }
  },

  load: function(path, callback) {
    try {
      fs.readFile(path, 'utf8', callback);
    } catch(e) {
      callback(e, null);
    }
  }
}
