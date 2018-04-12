'use strict';

const refResolver = require('./refResolver');

module.exports = {
  resolve: function(filePath, callback) {
    refResolver.resolve(filePath, callback);
  }
}
