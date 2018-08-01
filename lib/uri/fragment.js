'use strict';

const constants     = require('../constants/constants'),
      regexConsts   = require('../constants/regex'),
      util          = require('../util'),
      path          = require('path');

class Fragment {
  constructor(inputFGMT, opts = {}) {
    let normalizedFGMT;
    if (typeof(inputFGMT) == 'string') {
      // full fragment as string
      if (inputFGMT.length === 0) {
        normalizedFGMT = '';
      } else {
        normalizedFGMT = path.normalize(inputFGMT);
      }
    } else if (Array.isArray(inputFGMT)) {
      // full fragment as array of segments
      normalizedFGMT = path.join(inputFGMT);
    } else {
      throw new Error('URI/Fragment does not support: ' + inputFGMT);
    }
    this.root = '';
    if(normalizedFGMT.charAt(0) === constants.ROOT_PATH_IDENTIFIER) {
      this.root = constants.ROOT_PATH_IDENTIFIER;
      normalizedFGMT = normalizedFGMT.slice(1);
    }
    this.path = normalizedFGMT;
    if (!opts['skipValidate'] && !this.isValid()) {
      throw new Error('URI/Fragment is invalid: ' + inputFGMT);
    }
  }

  isValid() {
    if (this.toString().length < 1) {
      return true;
    }
    if (this.root !== constants.ROOT_PATH_IDENTIFIER) {
      return false;
    }
    const regex = new RegExp(util.buildFinalRegex(regexConsts.PCHAR + '|[/?]'));
    return regex.test(this.path);
  }

  segments() {
    const segs = this.toString().split('/');
    return segs.slice(1);
  }

  toString() {
    if (this.root === '' && this.path === '') {
      return '';
    }
    return path.join(this.root, this.path);
  }
}

module.exports = Fragment;
