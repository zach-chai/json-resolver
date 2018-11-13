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
    if (key === constants.ALLOF_KEY_NAME) {
      const result = resolveAllOf(currentNode);

      // replace allOf with resolved schema
      util.reassignObject(currentNode, result);
      resolveNode(currentNode);
    } else if (typeof(currentNode[key]) === 'object') {
      resolveNode(currentNode[key]);
    }
  }
}

function resolveAllOf(parentNode) {
  if (!Array.isArray(parentNode[constants.ALLOF_KEY_NAME])) {
    const err = new Error('allOf is not an array');
    callback(err);
    throw err;
  }

  let resultSchema = parentNode[constants.ALLOF_KEY_NAME][0];

  // handle nested allOf
  if (resultSchema[constants.ALLOF_KEY_NAME] != null) {
    resultSchema = resolveAllOf(resultSchema);
  }

  // merge sub-schemas 1 at a time
  for (let i = 1; i < parentNode[constants.ALLOF_KEY_NAME].length; i++) {
    resultSchema = deepMergeSchemas(resultSchema, parentNode[constants.ALLOF_KEY_NAME][i]);
  }
  return resultSchema;
}

function deepMergeSchemas(schema1, schema2) {
  const resultSchema = {};
  mergeSchemas(schema1, schema2, resultSchema);
  return resultSchema;
}

function mergeSchemas(schema1, schema2, resultSchema) {
  util.reassignObject(resultSchema, schema1);
  // handle nested allOf
  if (schema2[constants.ALLOF_KEY_NAME] != null) {
    schema2 = resolveAllOf(schema2);
  }
  // merge schemas
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
