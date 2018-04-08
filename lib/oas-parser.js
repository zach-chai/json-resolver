'use strict';

const resolver = require('./resolver');

module.exports = {
  resolve: function(filePath, callback) {
    resolver.resolve(filePath, callback);
  }
}
