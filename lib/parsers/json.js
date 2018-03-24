'use strict';

const file = require('../loaders/file');

module.exports = {
  canParse: ['.json'],

  canParseFile: function(path) {
    return file.canLoad(path) && this.canParse.includes(file.extension(path));
  },

  parseFile: function(path, callback) {
    file.load(path, function(err, data) {
      try {
        callback(null, JSON.parse(data));
      } catch(e) {
        callback(e, null);
      }
    });
  }
}
