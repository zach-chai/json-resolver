'use strict';

const file = require('../loaders/file');

module.exports = {
  types: ['.json'],

  canParse: function(type) {
    return this.types.includes(type);
  },

  parse: function(resource, callback) {
    try {
      callback(null, JSON.parse(resource));
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
        callback(null, JSON.parse(data));
      } catch (e) {
        callback(e, null);
      }
    });
  }
};
