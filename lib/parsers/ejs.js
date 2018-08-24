'use strict';

const file = require('../loaders/file'),
      ejs = require('ejs');

module.exports = {
  types: ['.ejs'],

  canParse: function(type) {
    return this.types.includes(type);
  },

  parse: function(resource, callback) {
    try {
      callback(null, ejs.render(resource));
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
        callback(null, ejs.render(data));
      } catch (e) {
        callback(e, null);
      }
    });
  }
};
