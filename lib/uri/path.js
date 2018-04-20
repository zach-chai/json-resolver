'use strict';

const constants     = require('../constants/constants'),
      regexConsts   = require('../constants/regex'),
      util          = require('../util'),
      path          = require('path');

class Path {
  constructor(inputPath) {
    let normalizedPath;
    if (typeof(inputPath) == 'string') {
      // full path as string
      if (inputPath.length === 0) {
        normalizedPath = '';
      } else {
        normalizedPath = path.normalize(inputPath);
      }
    } else if (Array.isArray(inputPath)) {
      // full path as array of segments
      normalizedPath = path.join(inputPath);
    } else {
      throw new Error('URI/Path does not support: ' + inputPath);
    }
    Object.assign(this, path.parse(normalizedPath));
    if (!this.isValid()) {
      throw new Error('URI/Path is invalid: ' + inputPath);
    }
  }

  isValid() {
    let segs = this.segments();
    if (this.toString().length === 0) {
      return true;
    } else if (this.isAbs() || !segs[0].includes(':')) {
      return Path.validSegments(segs);
    }
    return false;
  }

  segments() {
    const segs = this.toString().split('/');
    if (this.isAbs()) {
      return segs.slice(1);
    }
    return segs;
  }

  isAbs() {
    return this.root === '/';
  }

  toString() {
    return path.format(this.toObject());
  }

  toObject() {
    return {root: this.root, dir: this.dir, base: this.base}
  }

  static validSegments(segs) {
    for(let i in segs) {
      if (!this.validSegment(segs[i])) {
        return false;
      }
    }
    return true;
  }

  static validSegment(seg) {
    const regex = new RegExp(util.buildFinalRegex(regexConsts.PCHAR), 'g');
    return regex.test(seg);
  }
}

module.exports = Path;
