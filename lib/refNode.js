'use strict';

const constants = require('./constants/constants');

class RefNode {
  constructor(parentNode, ref, nodePath) {
    this.parentNode = parentNode;
    this.ref = ref;
    this.nodePath = nodePath; // for debugging
  }

  // traverse the tree until the target node is found or another ref
  findRefTarget(fileNodes, callback) {
    if (!this.isRefNode()) return;
    let node = fileNodes[this.ref.getFilePath()];
    if (this.ref.getFragment().length > 0) {
      node = RefNode.getChildNode(node, this.ref.getFragmentSegments());
      if (!node) {
        callback(new Error('Invalid reference path at ' + this.parentNode[constants.REF_KEY_NAME]));
      }
    }
    return node;
  }

  isRefNode() {
    return this.parentNode[constants.REF_KEY_NAME] != null;
  }

  static getChildNode(node, pathSegments) {
      if(node == null) return;
      let currentNode = node,
          parentNode;
      while(pathSegments.length > 0) {
        parentNode = currentNode;
        currentNode = currentNode[pathSegments[0]];
        if(currentNode == null) {
          break;
        }
        pathSegments.shift();
      }
      if(currentNode == null && parentNode.hasOwnProperty(constants.REF_KEY_NAME)) {
        // full path cannot be resolved because a ref was found
        // so we build a new ref that points to the target
        const refPath = new Uri(parentNode[constants.REF_KEY_NAME]);
        pathSegments.unshift(refPath.getFragment());
        let newNodePath = this.joinNodePaths(pathSegments);

        currentNode = {};
        currentNode[constants.REF_KEY_NAME] = refPath.getFilePath() + newNodePath;
      }
      return currentNode;
    }
}

module.exports = RefNode;
