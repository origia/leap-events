/**
 * Utility class to detect gestures from frames
**/

"use strict";

var _              = require('underscore')
  , CircularBuffer = require('./circular-buffer')
  , FingersState   = require('./fingers-state')
  , logger         = require('./logger')


  , defaults = { bufferSize: 300
                 // increases stability but slows down latency
               , stateChangeThreshold: 30
               }

  , fingerEvents = { 1: 'oneFingerMove'
                   , 2: 'twoFingersMove'
                   , 3: 'threeFingersMove'
                   , 4: 'fourFingersMove'
                   , 5: 'fiveFingersMove'
                   }

var GestureDetector = function (overrides) {
  this.options = _.extend({}, defaults, overrides)
  this.buffer = new CircularBuffer({
    capacity: this.options.bufferSize
  })
}

_.extend(GestureDetector.prototype, {
  _previousState: null
, _currentState: new FingersState()
, _onEvent: null

, processFrame: function (frame) {
    var state = this._getState(frame)
    var hasChanged = this._updateCurrentState(state)
    this._triggerEvents(hasChanged)
    this.buffer.append(state)
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
    this._previousState = this._currentState
    this._currentState = newState
  }

, setOnEventListener: function (listener) {
    this._onEvent = listener
  }

, _needsStateChange: function (newState) {
    var previousStates = this.buffer.take(this.options.stateChangeThreshold)
    return _(previousStates).all(function (state) {
      return state.equals(newState)
    })
  }

, _triggerEvents: function (hasChanged) {
    var state = this._currentState
    var fingersNum = state.fingersCount()
    if (fingersNum > 0) {
      this._onEvent('fingerMove', state.fingers)
      if (fingersNum in fingerEvents) {
        this._onEvent(fingerEvents[fingersNum], state.fingers)
      }
    }
    if (hasChanged && this._previousState.fingersCount() === 5) {
      this._triggerPause()
    }
  }

, _triggerPause: function () {
    var states = this.buffer.skipAndTakeWhile(function (state) {
      return state.fingersCount() !== 5
    })
    if (states.length === 0) return
  }

, _updateCurrentState: function (newState) {
    var isSame = this._currentState.equals(newState)
    if (isSame || this._needsStateChange(newState)) {
      this._setCurrentState(newState)
      return !isSame
    }
    return false
  }
})

module.exports = GestureDetector
