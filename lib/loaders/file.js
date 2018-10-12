'use strict';

const path = require('path'),
      fs   = require('fs');

module.exports = {
  resourceType: function(filePath) {
    try {
      return path.extname(path.basename(filePath));
    } catch (e) {
      throw e;
    }
  },

  resourceTypes: function(filePath) {
    let resourceTypes = [];
    try {
      while (path.extname(path.basename(filePath)) !== '') {
        resourceTypes.push(path.extname(path.basename(filePath)));
        filePath = filePath.replace(new RegExp(`${resourceTypes.slice(-1)[0]}$`), '');
      }
      return resourceTypes;
    } catch (e) {
      throw e;
    }
  },

  canLoad: function(path) {
    try {
      return fs.lstatSync(path).isFile();
    } catch (e) {
      throw e;
    }
  },

  load: function(path, callback) {
    try {
      fs.readFile(path, 'utf8', callback);
    } catch (e) {
      callback(e, null);
    }
  }
};
