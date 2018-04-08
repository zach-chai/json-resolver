'use strict';

const fileParser  = require('./file-parser'),
      constants   = require('./constants'),
      RefNode     = require('./refNode'),
      Ref         = require('./ref'),
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
        const refPath = new Ref(currentNode[index], filePath);
        if(refPath.isExternal()) {
          // resolve external reference
          if(fileNodes[refPath.getAbsFilePath()]) {
            const refNode = new RefNode(currentNode, refPath, nodePath);
            refNode.findAndReassign(fileNodes, callback);
            resolveNode(currentNode, refPath.getAbsFilePath(), nodePath);
          } else {
            count++;
            if(refPath.getAbsFilePath() == '') debugger;
            fileParser.parse(refPath.getAbsFilePath(), function(err, node) {
              if(err) {
                callback(err);
              } else {
                convertInternalRefs(node, refPath.getAbsFilePath());
                fileNodes[refPath.getAbsFilePath()] = node;
                const refNode = new RefNode(currentNode, refPath, nodePath);
                refNode.findAndReassign(fileNodes, callback);
                count--;
                resolveNode(currentNode, refPath.getAbsFilePath(), nodePath);
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
        const refPath = new Ref(currentNode[index]);
        if(refPath.isInternal()) {
          currentNode[index] = filePath + refPath.getNodePath();
        }
      } else if (typeof(currentNode[index]) === 'object') {
        convertInternalRefs(currentNode[index], filePath);
      }
    }
  }
}
