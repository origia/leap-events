/**
 * Utility class to analyze gestures from frames
**/

"use strict";

var _        = require('underscore')
  , jStat    = require('jStat').jStat
  , geometry = require('./geometry')
  , logger   = require('./logger')

  , defaults = { gestureMinFrameNumber: 10
               , surroundMinFrame: 30
               , surroundDistanceThreshold: 50
               , musicValueThreshold: 50
               , pauseDistanceThreshold: 30
               , buyDistanceThreshold: 50
               , buyTimeThreshold: 100 * 1000 * 1000
               , fingerDistanceThreshold: 50
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
    if (previousState.fingersCount() === 5) {
      return this.analyzeFiveFingers(beforePrevState.frameId(),
       previousState.frameId(), buffer)
    }
  }

, getStates: function (startId, endId, buffer) {
    return buffer.skipAndTakeWhile(function (state) {
      return state.frameId() !== endId
    }, function (state) { return state.frameId() !== startId })
  }

, analyzeTwoFingers: function (startId, endId, buffer) {
    var states = this.getStates(startId, endId, buffer)
      , evt
    logger.debug("two fingers frames number: %d", states.length)
    if (states.length < this.options.gestureMinFrameNumber) return {}
    var xDiff = Math.abs(states[0].getX() - states[0].fingers[1].tipPosition[0])
    if (states[0].handsCount() >= 2 || xDiff > this.options.fingerDistanceThreshold) {
      return this.checkBuy(states)
    }
    if (states.length >= this.options.surroundMinFrame) {
      evt = this.checkForSurround(states)
      if (evt) return evt
    }
    evt = this.checkMusic(states)
    if (evt) return evt
    return {}
  }

, analyzeFiveFingers: function (startId, endId, buffer) {
    var states = this.getStates(startId, endId, buffer)
      , evt
    logger.debug("five fingers frames number: %d", states.length)
    if (states.length < this.options.gestureMinFrameNumber) return {}
    evt = this.checkPause(states)
    if (evt) return evt
    return {}
  }

, checkPause: function (states) {
    var totalZDiff = 0
    for (var i = 1; i < states.length; i++) {
      if (states[i].getHand() && states[i - 1].getHand()) {
        totalZDiff += states[i].getHand().palmPosition[2] - states[i - 1].getHand().palmPosition[2]
      }
    }
    if (totalZDiff > this.options.pauseDistanceThreshold) return { pause: null }
  }

, checkBuy: function (states) {
    logger.debug('checkBuy')
    var startY   = states[0].getY()
      , starTime = states[0].getTime()

    for (var i = 0; i < states.length; i++) {
      if (startY - states[i].getY() > this.options.buyDistanceThreshold) {
        if (starTime - states[i].getTime() < this.options.buyTimeThreshold)
          return { 'buy': null }
        else break
      }
    }
    return {}
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
      return { surround: states.slice(0, minIndex) }
    }
  }

, checkMusic: function (states) {
    var baseY  = states[0].getY()
      , threshold = this.options.musicValueThreshold
      , i = 0
    for (; i < states.length && states[i].getY() - baseY < threshold; i++) ;
    if (i >= states.length) return
    for (; i < states.length && states[i].getY() >= baseY; i++) baseY = states[i].getY()
    for (; i < states.length && baseY - states[i].getY() < threshold; i++) ;
    if (i >= states.length) return
    for (; i < states.length && states[i].getY() <= baseY; i++) baseY = states[i].getY()
    for (; i < states.length && states[i].getY() - baseY < threshold; i++) ;
    if (i >= states.length) return
    for (; i < states.length && states[i].getY() >= baseY; i++) baseY = states[i].getY()
    for (; i < states.length && baseY - states[i].getY() < threshold; i++) ;
    if (i >= states.length || baseY - states[i].getY() < threshold) return
    return { music: null }
  }
})


module.exports = GestureAnalyzer
