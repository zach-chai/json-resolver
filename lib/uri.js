'use strict';

const constants = require('./constants/constants'),
      util      = require('./util'),
      Path      = require('./uri/path'),
      Fragment  = require('./uri/fragment'),
      path      = require('path');

class Uri {
  constructor(fullPath, originFile = null, opts = {}) {
    const uri = Uri.parse(fullPath);
    if (uri.path.length > 0 && originFile != null) {
      this.path = new Path(util.buildAbsFilePath(uri.path, path.dirname(originFile)));
    } else {
      this.path = new Path(uri.path);
    }
    this.fragment = new Fragment(uri.fragment, opts);
  }

  isInternal() {
    return !this.isExternal();
  }
  isExternal() {
    return this.getFilePath().length > 0;
  }
  isAbs() {
    return this.path.isAbs();
  }
  toString() {
    return this.getFilePath() + this.getFragment();
  }
  getFilePath() {
    return this.path.toString();
  }
  getFragmentSegments() {
    return this.fragment.segments();
  }
  getFragment() {
    return this.fragment.toString();
  }

  // Only supports path and fragment currently
  // TODO support parsing; scheme, authority, and query
  static parse(uri) {
    let path, fragment;
    [path, fragment] = uri.split(constants.ROOT_PATH_IDENTIFIER);
    if (fragment != null) {
      fragment = constants.ROOT_PATH_IDENTIFIER + fragment;
    } else {
      fragment = '';
    }
    return {path: path, fragment: fragment};
  }
}

module.exports = Uri;
