'use strict';

const constants = require('./constants'),
      util      = require('./util'),
      path      = require('path');

class Ref {
  constructor(fullPath, originFile) {
    const paths = fullPath.split(constants.ROOT_PATH_IDENTIFIER);
    this._filePath = paths[0] || '';
    this._nodePath = paths[1] || '';
    if(this._filePath != '' && originFile != null) {
      this._absFilePath = util.buildAbsFilePath(this._filePath, path.dirname(originFile)) || '';
    } else {
      this._absFilePath = util.buildAbsFilePath(this._filePath) || '';
    }
  }

  isInternal() {
    return !this.isExternal();
  }
  isExternal() {
    return this.getFilePath() != null;
  }
  isAbs() {
    return this.getAbsFilePath != null;
  }
  getAbsRefPath() {
    if(this.isAbs()) {
      return this.getAbsFilePath() + this.getNodePath();
    }
    return null;
  }
  getAbsFilePath() {
    if(this.isAbs()) {
      return this._absFilePath;
    }
    return null;
  }
  getFilePath() {
    if(this._filePath === '') return null;
    return this._filePath;
  }
  getNodePath() {
    if(this._nodePath === '') return null;
    return constants.ROOT_PATH_IDENTIFIER + this._nodePath;
  }
}

module.exports = Ref;
