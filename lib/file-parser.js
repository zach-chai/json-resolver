'use strict';

const yaml = require('./parsers/yaml'),
      json = require('./parsers/json');

module.exports = {
  parsers: [yaml, json],

  parse: function(path, callback) {
    let usableParser = null;

    for(let index in this.parsers) {
      const parser = this.parsers[index];
      if(parser.canParseFile(path)) {
        usableParser = parser;
      }
    }

    if(usableParser) {
      usableParser.parseFile(path, callback);
    } else {
      callback(new Error('Cannot parse file at ' + path), null);
    }
  }
}
