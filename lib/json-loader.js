'use strict';

const yaml = require('./parsers/yaml'),
      json = require('./parsers/json'),
      ejs = require('./parsers/ejs'),
      file = require('./loaders/file');

module.exports = {
  parsers: [yaml, json, ejs],
  loaders: [file],

  load: function(uri, callback) {
    let usableLoader = null;
    let usableParsers = [];

    // select loader
    for (let loader of this.loaders) {
      if (loader.canLoad(uri)) {
        usableLoader = loader;
        break;
      }
    }
    // select parsers
    const resourceTypes = usableLoader.resourceTypes(uri);
    for (let resourceType of resourceTypes) {
      for (let parser of this.parsers) {
        if (parser.canParse(resourceType)) {
          usableParsers.push(parser);
          break;
        }
      }
    }

    // return error if couldn't find a valid loader
    if (usableLoader === null) {
      callback(loaderError(uri));
      return;
    }

    // return error if couldn't find a valid parsers
    if (usableParsers.length < resourceTypes.length) {
      callback(parserError(uri));
      return;
    }

    usableLoader.load(uri, function(loadError, resource) {
      if (loadError) {
        callback(loaderError(uri, loadError));
        return;
      }
      usableParsers[0].parse(resource, function(parseError, data) {
        if (parseError) {
          callback(parserError(uri, parseError));
          return;
        }
        if (usableParsers.length === 1) {
          callback(null, data);
        } else {
          usableParsers[1].parse(data, function(parseError, result) {
            if (parseError) {
              callback(parserError(uri, parseError));
              return;
            }
            callback(null, result);
          });
        }
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
