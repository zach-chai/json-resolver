'use strict';

const constants = require('./constants/constants'),
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
    return path.join(constants.ROOT_PATH_IDENTIFIER,
                     path.join(...paths).replace(/#/g, ''));
  },

  mergeCharExp: function(...exps) {
    if (exps.length > 1) {
      exps[0] = exps[0].slice(0, -1);
      const l1 = exps.length - 1;
      for (let x = 1; x < l1; ++x) {
        exps[x] = exps[x].slice(1, -1);
      }
      exps[l1] = exps[l1].slice(1);
      return exps.join('');
    } else {
      return exps[0];
    }
  },

  buildFinalRegex: function(exp) {
    return '^(' + exp + ')+$';
  },

  reassignObject: function(obj, newProps) {
    var props = Object.keys(obj);
    for (var i = 0; i < props.length; i++) {
      delete obj[props[i]];
    }
    Object.assign(obj, newProps);
  }
}
