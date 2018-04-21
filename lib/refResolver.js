'use strict';

const fileParser  = require('./file-parser'),
      constants   = require('./constants/constants'),
      RefNode     = require('./refNode'),
      Uri         = require('./uri'),
      path        = require('path'),
      util        = require('./util');

let rootNode  = {},
    callback  = null,
    fileNodes = {},
    count     = 0;

module.exports = {
  resolve: function(entryPath, cb) {
    rootNode = {};
    rootNode[constants.REF_KEY_NAME] = path.basename(entryPath);
    callback = cb;
    resolveNode(rootNode, entryPath, constants.ROOT_PATH_IDENTIFIER + constants.PATH_SEPARATOR);
  }
}

function resolveNode(currentNode, filePath, nodePath) {
  count++;
  for(let index in currentNode) {
    if(!currentNode.hasOwnProperty(index)) {
      continue;
    }
    if(index === constants.REF_KEY_NAME) {
      const uriRef = new Uri(currentNode[index], filePath);
      const refNode = new RefNode(currentNode, uriRef, nodePath);
      if(fileNodes[uriRef.getFilePath()]) {
        // fetch cached file and resolve reference
        refNode.findAndReassign(fileNodes, callback);
        resolveNode(currentNode, uriRef.getFilePath(), nodePath);
      } else {
        // load and cache external file
        loadFileForResolving(currentNode, uriRef, filePath, nodePath);
      }
    } else if(typeof(currentNode[index]) === 'object') {
      resolveNode(currentNode[index], filePath, util.joinNodePaths(nodePath, index));
    }
  }
  count--;
  if(count === 0) {
    callback(null, rootNode);
  }
}

// Load file and cache for resolving
function loadFileForResolving(currentNode, uriRef, filePath, nodePath) {
  count++;
  fileParser.parse(uriRef.getFilePath(), function(err, node) {
    if(err) {
      callback(err);
    } else {
      convertInternalRefs(node, uriRef.getFilePath());
      fileNodes[uriRef.getFilePath()] = node;
      count--;
      resolveNode(currentNode, filePath, nodePath);
    }
  });
}

// convert internal refs to external
function convertInternalRefs(currentNode, filePath) {
  for(let index in currentNode) {
    if(currentNode.hasOwnProperty(index)) {
      if(index === constants.REF_KEY_NAME) {
        const refPath = new Uri(currentNode[index]);
        if(refPath.isInternal()) {
          currentNode[index] = filePath + refPath.getFragment();
        }
      } else if (typeof(currentNode[index]) === 'object') {
        convertInternalRefs(currentNode[index], filePath);
      }
    }
  }
}
