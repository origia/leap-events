/**
 * Utility class to analyze gestures from frames
**/

"use strict";

var _        = require('underscore')
  , jStat    = require('jStat').jStat
  , geometry = require('./geometry')
  , logger          = require('./logger')

  , defaults = { gestureMinFrameNumber: 10
               , surroundMinFrame: 20
               , surroundDistanceThreshold: 50
               }


var GestureAnalyzer = function (overrides) {
  this.options = _.extend({}, defaults, overrides)
  this.options.surroundSquareDistanceThreshold =
    this.options.surroundDistanceThreshold * this.options.surroundDistanceThreshold
}

_.extend(GestureAnalyzer.prototype, {
  analyzeFrames: function (beforePrevState, previousState,
    currentState, buffer) {
    if (previousState.fingersCount() === 2) {
      return this.analyzeTwoFingers(beforePrevState.frameId(),
       previousState.frameId(), buffer)
    }
  }

, analyzeTwoFingers: function (startId, endId, buffer) {
    var states = buffer.skipAndTakeWhile(function (state) {
      return state.frameId() !== endId
    }, function (state) { return state.frameId() !== startId })
    logger.debug("length: " + states.length)
    if (states.length < this.options.gestureMinFrameNumber) return {}
    if (states.length >= this.options.surroundMinFrame) {
      var evt = this.checkForSurround(states)
      if (evt) return evt
    }
  }

, checkForSurround: function (states) {
    var statesToCheck = states.slice(this.options.surroundMinFrame)
      , startPoint = states[0].position2D()
      , minDistance = 100000
      , minIndex = 0

    for (var i = 0; i < statesToCheck.length; i++) {
      var point = statesToCheck[i].position2D()
      if (point === null) continue
      var distance = geometry.squareDistance(startPoint, point)
      if (distance < minDistance) {
        minDistance = distance
        minIndex = i
      }
    }
    if (minDistance < this.options.surroundSquareDistanceThreshold) {
      return { 'surround': states.slice(0, minIndex) }
    }
  }
})


module.exports = GestureAnalyzer
