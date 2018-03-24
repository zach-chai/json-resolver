'use strict';

const file = require('../loaders/file'),
      yaml = require('js-yaml');

module.exports = {
  canParse: ['.yaml', '.yml'],

  canParseFile: function(path) {
    return file.canLoad(path) && this.canParse.includes(file.extension(path));
  },

  parseFile: function(path, callback) {
    file.load(path, function(err, data) {
      try {
        callback(null, yaml.safeLoad(data));
      } catch(e) {
        callback(e, null);
      }
    });
  }
}
