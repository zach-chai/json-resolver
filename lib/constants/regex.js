'use strict';

const util = require('../util');

const ALPHA           = '[A-Za-z]',
      DIGIT           = '[0-9]',
      SUB_DELIMS      = '[\!\$\&\'\(\)\*\+\,\,\=]',
      HEX_DIGIT       = util.mergeCharExp(DIGIT, '[A-Fa-f]'),
      PCT_ENCODED     = '%' + HEX_DIGIT + HEX_DIGIT,
      UNRESERVED      = util.mergeCharExp(ALPHA, DIGIT, '[\-\.\_\~]'),
      NO_ENCODINGS    = util.mergeCharExp(UNRESERVED, SUB_DELIMS, '[\:\@]'),
      PCHAR           = PCT_ENCODED + '|' + NO_ENCODINGS;

module.exports = Object.freeze({
  ALPHA:          ALPHA,
  DIGIT:          DIGIT,
  SUB_DELIMS:     SUB_DELIMS,
  HEX_DIGIT:      HEX_DIGIT,
  PCT_ENCODED:    PCT_ENCODED,
  UNRESERVED:     UNRESERVED,
  NO_ENCODINGS:   NO_ENCODINGS,
  PCHAR:          PCHAR
});
