/**
 * Utility class to detect gestures from frames
**/

"use strict";

var _               = require('underscore')
  , CircularBuffer  = require('./circular-buffer')
  , FrameState      = require('./frame-state')
  , logger          = require('./logger')
  , GestureAnalyzer =  require('./gesture-analyzer')


  , defaults = { bufferSize: 1000
                 // increases stability but slows down latency
               , stateChangeThreshold: 30
               , pauseMinFrameNumber: 5
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
  this.analyzer = new GestureAnalyzer()
}

_.extend(GestureDetector.prototype, {
  _beforePrevState: null
, _previousState: null
, _currentState: new FrameState()
, _listener: null

, processFrame: function (frame) {
    var state = new FrameState(frame)
    var hasChanged = this._updateCurrentState(state)
    this._triggerEvents(hasChanged)
    this.buffer.append(state)
  }

, _logStateChange: function (previous, next) {
    logger.debug('state changed from %d to %d fingers',
      previous.fingersCount(), next.fingersCount())
  }

, _setCurrentState: function (newState) {
    if (!this._currentState.equals(newState)) {
      this._logStateChange(this._currentState, newState)
      this._beforePrevState = this._previousState
      this._previousState = this._currentState
    }
    this._currentState = newState
  }

, setOnEventListener: function (listener) {
    this._listener = listener
  }

, _callListener: function () {
    if (this._listener) {
      this._listener.apply(this._listener, arguments)
    }
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
      this._callListener('fingerMove', state)
      if (fingersNum in fingerEvents) {
        this._callListener(fingerEvents[fingersNum], state)
      }
    }
    if (hasChanged) {
      var events = this.analyzer.analyzeFrames(this._beforePrevState,
        this._previousState, state, this.buffer)
      for (var eventName in events) {
        if (events.hasOwnProperty(eventName)) {
          this._callListener(eventName, events[eventName])
        }
      }
    }
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
