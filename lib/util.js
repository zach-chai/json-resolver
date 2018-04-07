'use strict';

const constants = require('./constants'),
      path      = require('path');

module.exports = {
  // returns a normalized absolute path
  // builds one from a relative path and context path if necessary
  buildAbsFilePath: function(refFilePath, currentFilePath) {
    if(typeof(refFilePath) !== 'string' || refFilePath.length < 1) return null;
    let absPath;
    if(path.isAbsolute(refFilePath)) {
      absPath =  path.normalize(refFilePath);
    } else if(currentFilePath != null) {
      absPath =  path.join(currentFilePath, refFilePath);
    }
    return absPath;
  },

  // joins node paths then normalizes
  joinNodePaths: function(...paths) {
    if(paths.length === 1 && Array.isArray(paths[0])) {
      paths = paths[0];
    }
    return path.join('#', path.join(...paths).replace(/#/g, ''));
  }
}
