'use strict';

const file = require('../loaders/file'),
      yaml = require('js-yaml');

module.exports = {
  types: ['.yaml', '.yml'],

  canParse: function(type) {
    return this.types.includes(type);
  },

  parse: function(resource, callback) {
    try {
      callback(null, yaml.safeLoad(resource));
    } catch (e) {
      callback(e, null);
    }
  },

  canParseFile: function(path) {
    return file.canLoad(path) && this.types.includes(file.resourceType(path));
  },

  parseFile: function(path, callback) {
    file.load(path, function(err, data) {
      try {
        callback(null, yaml.safeLoad(data));
      } catch (e) {
        callback(e, null);
      }
    });
  }
};
