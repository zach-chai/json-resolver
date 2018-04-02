'use strict';

const constants = require('./constants'),
      path      = require('path');

module.exports = {
  normalizeFilePath: function(currentFilePath, refFilePath) {
    let absolutePath;
    if(refFilePath.indexOf(constants.PATH_SEPARATOR) === 0) {
      absolutePath =  refFilePath;
    } else {
      absolutePath =  currentFilePath + constants.PATH_SEPARATOR + refFilePath;
    }
    return path.normalize(absolutePath);
  },

  normalizeNodePath: function(...paths) {
    return path.normalize('#' + paths.join('').replace(/#/g, ''));
  }
}
