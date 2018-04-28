'use strict';

const fileParser  = require('./file-parser'),
      constants   = require('./constants/constants'),
      util        = require('./util');

let callback;

module.exports = {
  resolve: function(entryPath, callback) {
    fileParser.parse(entryPath, function(err, schema) {
      if (err) {
        callback(err);
      } else {
        resolveNode(schema)
        callback(null, schema);
      }
    });
  }
}

function resolveNode(currentNode) {
  for (let key in currentNode) {
    if (!currentNode.hasOwnProperty(key)) continue;

    if (key === constants.ALLOF_KEY_NAME) {
      if (!Array.isArray(currentNode[key])) {
        callback(new Error('allOf is not an array'));
        break;
      }
      let resultSchema;
      if (currentNode[key].length === 1) {
        // allof with 1 sub-schema
        resultSchema = currentNode[key][0];
      } else {
        // merge sub-schemas 1 at a time
        resultSchema = currentNode[key][0];
        for (let i = 1; i < currentNode[key].length; i++) {
          resultSchema = deepMergeSchemas(resultSchema, currentNode[key][i]);
        }
      }
      util.reassignObject(currentNode, resultSchema);
      resolveNode(currentNode);
    } else if (typeof(currentNode[key]) === 'object') {
      resolveNode(currentNode[key]);
    }
  }
}

function deepMergeSchemas(schema1, schema2) {
  const resultSchema = {};
  mergeSchemas(schema1, schema2, resultSchema);
  return resultSchema;
}

function mergeSchemas(schema1, schema2, resultSchema) {
  util.reassignObject(resultSchema, schema1);
  for (let key in schema2) {
    if (!resultSchema.hasOwnProperty(key)) {
      resultSchema[key] = schema2[key];
    } else {
      // peforms a dumb merge
      // TODO improve merge
      if (Array.isArray(resultSchema[key])) {
        // TODO remove duplicate objects
        resultSchema[key].concat(schema2[key]);
        resultSchema[key] = [...new Set(resultSchema[key])];
      } else if (typeof(resultSchema[key]) === 'object') {
        resultSchema[key] = {};
        mergeSchemas(schema1[key], schema2[key], resultSchema[key]);
      } else {
        resultSchema[key] = schema2[key];
      }
    }
  }
}
