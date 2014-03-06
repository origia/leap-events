/**
 * Utility class to detect gestures from frames
**/

"use strict";

var _              = require('underscore')
  , CircularBuffer = require('./circular-buffer')


  , defaults = { bufferSize: 300
               }

var GestureDetector = function (overrides) {
  this.options = _.extend({}, defaults, overrides)
  this.buffer = new CircularBuffer({
    capacity: this.options.bufferSize
  })
}

_.extend(GestureDetector.prototype, {
  processFrame: function (frame) {
    this.buffer.append(frame)
  }
})

module.exports = GestureDetector
