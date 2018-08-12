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
