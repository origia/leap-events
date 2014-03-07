/**
 * Utility class to detect gestures from frames
**/

"use strict";

var _              = require('underscore')
  , CircularBuffer = require('./circular-buffer')


  , defaults = { bufferSize: 300
               , stateChangeThreshold: 10
               }

var GestureDetector = function (overrides) {
  this.options = _.extend({}, defaults, overrides)
  this.buffer = new CircularBuffer({
    capacity: this.options.bufferSize
  })
}

_.extend(GestureDetector.prototype, {
  _currentState: { fingersNumber: 0
                 , fingers: []
                 }

, processFrame: function (frame) {
    var state = this._getState(frame)
    this._updateCurrentState(frame, state)
  }

, _getState: function (frame) {
    var fingers = frame.fingers
    return { fingersNumber: fingers.length
           , fingers: fingers
           }
  }

, _updateCurrentState: function (frame, nextState) {

    this._currentState = nextState
    this.buffer.append({ frame: frame
                       , state: this._currentState
                       })
  }
})

module.exports = GestureDetector
