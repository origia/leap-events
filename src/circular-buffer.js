/**
 * Circular buffer class
 * Supports O(1) append/access operations
**/

"use strict";

var _ = require('underscore');

var defaults = {
  size: 200
};

var CircularBuffer = function (overrides) {
  this.options = _.extend({}, defaults, overrides);
};
