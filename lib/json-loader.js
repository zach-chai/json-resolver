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
    for(let loader of this.loaders) {
      if(loader.canLoad(uri)) {
        usableLoader = loader;
        break;
      }
    }

    // select parser
    const resourceType = usableLoader.resourceType(uri)
    for(let parser of this.parsers) {
      if(parser.canParse(resourceType)) {
        usableParser = parser;
        break;
      }
    }

    if(usableLoader === null) {
      callback(this._loaderError(uri));
      return;
    }
    if(usableParser === null) {
      callback(this._parserError(uri));
      return;
    }

    usableLoader.load(uri, function(loadError, resource) {
      if(loadError) {
        callback(this._loaderError(uri, loadError));
        return;
      }
      usableParser.parse(resource, function(parseError, data) {
        if(parseError) {
          callback(this._loaderError(uri, loadError));
          return;
        }
        callback(null, data);
      });
    });
  },

  _loaderError: function(uri, err) {
    if(err) {
      return new Error('Error loading resource at "' + uri + '". Exception: ' + err);
    }
    return new Error('URI could not be loaded: ' + uri);
  },
  _parserError: function(err) {
    if(err) {
      return new Error('Error parsing resource at "' + uri + '". Exception: ' + err);
    }
    return new Error('resource could not be parsed: ' + uri);
  }
}
