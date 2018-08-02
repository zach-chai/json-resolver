'use strict';

const jsonLoader  = require('./json-loader'),
      constants   = require('./constants/constants'),
      RefNode     = require('./refNode'),
      Uri         = require('./uri'),
      path        = require('path'),
      util        = require('./util');

let rootNode = {},
    callback = null,
    callbackCalled = false,
    fileNodes = {},
    runningCallbacks = 0;

module.exports = {
  resolve: function(arg, cb) {
    let entryPath;
    if (arg === Object(arg)) {
      rootNode = arg;
      entryPath = process.cwd();
    } else  {
      entryPath = arg;
      rootNode = {};
      rootNode[constants.REF_KEY_NAME] = path.basename(entryPath);
    }
    callback = cb;
    resolveNode(rootNode, entryPath, constants.ROOT_PATH_IDENTIFIER + constants.PATH_SEPARATOR);
  }
}

function resolveNode(currentNode, filePath, nodePath) {
  runningCallbacks++;
  for(let index in currentNode) {
    if(!currentNode.hasOwnProperty(index)) continue;
    if(index === constants.REF_KEY_NAME) {
      const uriRef = new Uri(currentNode[index], filePath);
      const refNode = new RefNode(currentNode, uriRef, nodePath);
      if(fileNodes[uriRef.getFilePath()]) {
        // fetch cached file and resolve reference
        const node = refNode.findRefTarget(fileNodes, callbackWrapper);
        if(detectCircularRef(uriRef, nodePath, node)) return;
        util.reassignObject(currentNode, node);
        resolveNode(currentNode, uriRef.getFilePath(), nodePath);
      } else {
        // load and cache external file
        loadFileForResolving(currentNode, uriRef, filePath, nodePath);
      }
    } else if(typeof(currentNode[index]) === 'object') {
      resolveNode(currentNode[index], filePath, util.joinNodePaths(nodePath, index));
    }
  }
  runningCallbacks--;
  if(runningCallbacks === 0) {
    callbackWrapper(null, rootNode);
  }
}

// Load file and cache for resolving
function loadFileForResolving(currentNode, uriRef, filePath, nodePath) {
  runningCallbacks++;
  jsonLoader.load(uriRef.getFilePath(), function(err, node) {
    if(err) {
      callbackWrapper(err);
    } else {
      convertInternalRefs(node, uriRef.getFilePath());
      fileNodes[uriRef.getFilePath()] = node;
      runningCallbacks--;
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

function detectCircularRef(ref, nodePath, targetNode) {
  let fragSegs = ref.getFragmentSegments();
  let pathSegs = nodePath.split('/');
  for(let i in fragSegs) {
    if (pathSegs.includes(fragSegs[i])) {
      let index = pathSegs.indexOf(fragSegs[i]);
      let pathFromRoot = pathSegs.slice(1, index + 1)
      if (targetNode === util.getChildNode(rootNode, pathFromRoot)) {
        callbackWrapper(new Error('Cicular reference detected at ' + nodePath));
        return true;
      }
    }
  }
  return false;
}

function callbackWrapper(...args){
  if(!callbackCalled) {
    callbackCalled = true;
    return callback(...args);
  }
  return null;
}
