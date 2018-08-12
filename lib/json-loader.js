'use strict';

const yaml = require('./parsers/yaml'),
      json = require('./parsers/json'),
      file = require('./loaders/file');

module.exports = {
  parsers: [yaml, json],
  loaders: [file],

  load: function(uri, callback) {
    let usableLoader = null;
    let usableParser = null;

    // select loader
    for (let loader of this.loaders) {
      if (loader.canLoad(uri)) {
        usableLoader = loader;
        break;
      }
    }

    // select parser
    const resourceType = usableLoader.resourceType(uri);
    for (let parser of this.parsers) {
      if (parser.canParse(resourceType)) {
        usableParser = parser;
        break;
      }
    }

    if (usableLoader === null) {
      callback(loaderError(uri));
      return;
    }
    if (usableParser === null) {
      callback(parserError(uri));
      return;
    }

    usableLoader.load(uri, function(loadError, resource) {
      if (loadError) {
        callback(loaderError(uri, loadError));
        return;
      }
      usableParser.parse(resource, function(parseError, data) {
        if (parseError) {
          callback(parserError(uri, parseError));
          return;
        }
        callback(null, data);
      });
    });
  }
};

function loaderError(uri, err) {
  if (err) {
    return new Error('Error loading resource at "' + uri + '". Exception: ' + err);
  }
  return new Error('URI could not be loaded: ' + uri);
}
function parserError(uri, err) {
  if (err) {
    return new Error('Error parsing resource at "' + uri + '". Exception: ' + err);
  }
  return new Error('resource could not be parsed: ' + uri);
}
