/**
 * Utility class to analyze gestures from frames
**/

"use strict";

var _      = require('underscore')
  , mathjs = require('mathjs')
  , math   = mathjs()

module.exports = {
  distance: function (p1, p2) {
    var xDiff = p1[0] - p2[0]
    var yDiff = p1[1] - p2[1]
    return math.sqrt(xDiff * xDiff + yDiff * yDiff)
  }

, squareDistance: function (p1, p2) {
    var xDiff = p1[0] - p2[0]
    var yDiff = p1[1] - p2[1]
    return xDiff * xDiff + yDiff * yDiff
  }
}
