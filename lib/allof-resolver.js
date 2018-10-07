'use strict';

const jsonLoader  = require('./json-loader'),
      constants   = require('./constants/constants'),
      util        = require('./util');

let callback;

module.exports = {
  resolve: function(arg, callback) {
    if (arg === Object(arg)) {
      resolveNode(arg);
      callback(null, arg);
    } else {
      jsonLoader.load(arg, function(err, schema) {
        if (err) {
          callback(err);
        } else {
          resolveNode(schema);
          callback(null, schema);
        }
      });
    }
  }
};

function resolveNode(currentNode) {
  for (let key in currentNode) {
    if (typeof(currentNode[key]) === 'object') {
      resolveNode(currentNode[key]);
    } else if (key === constants.ALLOF_KEY_NAME) {
      if (!Array.isArray(currentNode[key])) {
        callback(new Error('allOf is not an array'));
        break;
      }

      let resultSchema = currentNode[key][0];
      // merge sub-schemas 1 at a time
      for (let i = 1; i < currentNode[key].length; i++) {
        resultSchema = deepMergeSchemas(resultSchema, currentNode[key][i]);
      }

      // replace allOf with resolved schema
      util.reassignObject(currentNode, resultSchema);
      resolveNode(currentNode);
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
      // source schema doesn't have the field so add it
      resultSchema[key] = schema2[key];
    } else {
      // Key exists in both schemas so peform a dumb merge
      if (Array.isArray(resultSchema[key]) && Array.isArray(schema2[key])) {
        resultSchema[key] = resultSchema[key].concat(schema2[key]);
        resultSchema[key] = [...new Set(resultSchema[key])];
      } else if (typeof(resultSchema[key]) === 'object' && typeof(schema2[key]) === 'object') {
        resultSchema[key] = {};
        mergeSchemas(schema1[key], schema2[key], resultSchema[key]);
      } else {
        resultSchema[key] = schema2[key];
      }
    }
  }
}
