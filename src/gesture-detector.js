/**
 * Utility class to detect gestures from frames
**/

"use strict";

var _              = require('underscore')
  , CircularBuffer = require('./circular-buffer')
  , FingersState   = require('./fingers-state')
  , logger         = require('./logger')


  , defaults = { bufferSize: 300
               , stateChangeThreshold: 30
               }

var GestureDetector = function (overrides) {
  this.options = _.extend({}, defaults, overrides)
  this.buffer = new CircularBuffer({
    capacity: this.options.bufferSize
  })
}

_.extend(GestureDetector.prototype, {
  _currentState: new FingersState()

, processFrame: function (frame) {
    var state = this._getState(frame)
    this._updateCurrentState(state)
    this.buffer.append({ frame: frame
                       , state: state
                       })
  }

, _getState: function (frame) {
    var fingers = frame.fingers
    return new FingersState(fingers)
  }

, _logStateChange: function (previous, next) {
    logger.debug('state changed from %d to %d fingers',
      previous.fingersCount(), next.fingersCount())
  }

, _setCurrentState: function (newState) {
    if (!this._currentState.equals(newState)) {
      this._logStateChange(this._currentState, newState)
    }
    this._currentState = newState
  }

, _needsStateChange: function (newState) {
    var previousData = this.buffer.take(this.options.stateChangeThreshold)
      , previousStates = _(previousData).pluck('state')
    return _(previousStates).all(function (state) {
      return state.equals(newState)
    })
  }

, _updateCurrentState: function (newState) {
    if (this._currentState.equals(newState) ||
        this._needsStateChange(newState)) {
      this._setCurrentState(newState)
    }
  }
})

module.exports = GestureDetector
