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
    if(currentNode.hasOwnProperty(index)) {
      if(index === constants.REF_KEY_NAME) {
        const refPath = new Uri(currentNode[index], filePath);
        if(refPath.isExternal()) {
          // resolve external reference
          const refNode = new RefNode(currentNode, refPath, nodePath);
          if(fileNodes[refPath.getFilePath()]) {
            refNode.findAndReassign(fileNodes, callback);
            resolveNode(currentNode, refPath.getFilePath(), nodePath);
          } else {
            count++;
            fileParser.parse(refPath.getFilePath(), function(err, node) {
              if(err) {
                callback(err);
              } else {
                convertInternalRefs(node, refPath.getFilePath());
                fileNodes[refPath.getFilePath()] = node;
                refNode.findAndReassign(fileNodes, callback);
                count--;
                resolveNode(currentNode, refPath.getFilePath(), nodePath);
              }
            });
          }
        }
      } else if(typeof(currentNode[index]) === 'object') {
        resolveNode(currentNode[index], filePath, util.joinNodePaths(nodePath, index));
      }
    }
  }
  count--;
  if(count === 0) {
    callback(null, rootNode);
  }
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
