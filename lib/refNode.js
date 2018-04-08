'use strict';

const constants = require('./constants'),
      Ref       = require('./ref'),
      util      = require('./util');

class RefNode {
  constructor(parentNode, ref, nodePath) {
    this.parentNode = parentNode;
    this.ref = ref;
    this.nodePath = nodePath; // for debugging
  }

  findAndReassign(fileNodes, callback) {
    if(!this.isRefNode()) return;
    let node = fileNodes[this.ref.getAbsFilePath()];
    if(this.ref.getNodePath()) {
      node = this.getChildNode(node, this.ref.getNodePath().substr(1));
      if(!node) {
        callback(new Error('Invalid reference path at ' + this.parentNode[constants.REF_KEY_NAME]));
      }
    }
    this.reassignRefNode(this.parentNode, node);
  }

  isRefNode() {
    return this.parentNode[constants.REF_KEY_NAME] != null;
  }

  // TODO make this static
  getChildNode(node, nodePath) {
    if(node == null) return;
    const keys = nodePath.split(constants.PATH_SEPARATOR)
                         .filter(key => key !== '');
    let currentNode = node,
        parentNode;
    while(keys.length > 0) {
      parentNode = currentNode;
      currentNode = currentNode[keys[0]];
      if(currentNode == null) {
        break;
      }
      keys.shift();
    }
    if(currentNode == null && parentNode.hasOwnProperty(constants.REF_KEY_NAME)) {
      // full path cannot be resolved so return a new ref
      const refPath = new Ref(parentNode[constants.REF_KEY_NAME]);
      if(refPath.getNodePath() != null) {
        keys.unshift(refPath.getNodePath());
      }
      let newNodePath = util.joinNodePaths(keys);

      currentNode = {};
      currentNode[constants.REF_KEY_NAME] = refPath.getFilePath() + newNodePath;
    }
    return currentNode;
  }

  // TODO make this static
  reassignRefNode(refNode, nodeProps) {
    delete refNode[constants.REF_KEY_NAME]
    Object.assign(refNode, nodeProps);
  }
}

module.exports = RefNode;
