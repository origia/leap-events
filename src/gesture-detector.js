/**
 * Utility class to detect gestures from frames
**/

"use strict";

var _ = require('underscore');

var defaults = {
  bufferSize: 300
};

var GestureDetector = function (overrides) {
  this.options = _.extend({}, defaults, overrides);
};

_.extend(GestureDetector.prototype, {

});
