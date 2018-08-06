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
    const rootFragmentPath = constants.ROOT_PATH_IDENTIFIER + constants.PATH_SEPARATOR
    const staticRootPath = new Uri(entryPath + rootFragmentPath)
    resolveNode(rootNode, staticRootPath, rootFragmentPath);
  }
}

function resolveNode(currentNode, staticPath, dynamicPath) {
  runningCallbacks++;
  for(let index in currentNode) {
    if(!currentNode.hasOwnProperty(index)) continue;
    if(index === constants.REF_KEY_NAME) {
      const uriRef = new Uri(currentNode[constants.REF_KEY_NAME], staticPath.getFilePath());
      const refNode = new RefNode(currentNode, uriRef, dynamicPath);
      if(fileNodes[uriRef.getFilePath()]) {
        // fetch cached file and resolve reference
        const node = refNode.findRefTarget(fileNodes, callbackWrapper);
        if(detectCircularRef(uriRef, staticPath, node)) return;
        util.reassignObject(currentNode, node);
        resolveNode(currentNode, uriRef, dynamicPath);
      } else {
        // load and cache external file
        loadFileForResolving(uriRef, currentNode, staticPath, dynamicPath);
      }
    } else if(typeof(currentNode[index]) === 'object') {
      const newNodePath = util.joinNodePaths(dynamicPath, index);
      const path = staticPath.getFilePath() + util.joinNodePaths(staticPath.getFragment(), index);
      const newStaticPath = new Uri(path, null, {skipValidate: true});
      resolveNode(currentNode[index], newStaticPath, newNodePath);
    }
  }
  runningCallbacks--;
  if(runningCallbacks === 0) {
    callbackWrapper(null, rootNode);
  }
}

// Load file and cache for resolving
function loadFileForResolving(uriRef, ...args) {
  runningCallbacks++;
  jsonLoader.load(uriRef.getFilePath(), function(err, node) {
    if(err) {
      callbackWrapper(err);
    } else {
      convertInternalRefs(node, uriRef.getFilePath());
      fileNodes[uriRef.getFilePath()] = node;
      runningCallbacks--;
      resolveNode(...args);
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

function detectCircularRef(ref, staticPath, targetNode) {
  let fragSegs = ref.getFragmentSegments();
  let pathSegs = staticPath.getFragment().split('/');
  for(let i in fragSegs) {
    if (pathSegs.includes(fragSegs[i])) {
      let index = pathSegs.indexOf(fragSegs[i]);
      let pathFromRoot = pathSegs.slice(1, index + 1)
      if (targetNode === RefNode.getChildNode(fileNodes[staticPath.getFilePath()], pathFromRoot)) {
        callbackWrapper(new Error('Cicular reference detected at ' + staticPath.getFragment()));
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
