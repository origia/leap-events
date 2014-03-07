/**
 * Wrapper class around Leap.this.Controller
**/

"use strict";

var _               = require('underscore')
  , Leap            = require('leapjs')
  , GestureDetector = require('./gesture-detector')


  , defaults = { host: '127.0.0.1'
               , port: 6437
               , enableGestures: true
               , frameEventName: 'deviceFrame'
               , useAllplugins: false
               }

  , baseEvents = [ 'blur'
                 , 'connect'
                 , 'deviceConnected'
                 , 'deviceDisconnected'
                 , 'disconnect'
                 , 'focus'
                 , 'gesture'
                 , 'protocol'
                 ]

var LeapManager = function (overrides) {
  _.bindAll(this, 'trigger', 'handleFrame')
  this.options = _.extend({}, defaults, overrides)
  this.controller = new Leap.Controller(this.options)
  this.gestureDetector =  new GestureDetector()
  this.gestureDetector.setOnEventListener(this.trigger)
  this._initBaseEvents()
}

_.extend(LeapManager.prototype, {
  events: {}
, started: false

, _initBaseEvents: function () {
    var self = this

    var makeTrigger = function (eventName) {
      return function (args) {
        self.trigger.apply(self, Array.prototype.concat([eventName], args))
      }
    }

    _.each(baseEvents, function (eventName) {
      self.controller.on(eventName, makeTrigger(eventName))
    })
  }

, start: function () {
    if (this.started) {
      return
    }
    var self = this
    this.controller.connect()
    this.controller.on('frame', this.handleFrame)
    this.started = true
  }

, stop: function () {
    if (!this.started) {
      return
    }
    this.controller.disconnect()
    this.started = false
  }

, isRunning: function () {
    return this.started
  }

, on: function (eventName, callback) {
    this.events[eventName] = callback
  }

, off: function (eventName) {
    if (eventName) {
      delete this.events[eventName]
    } else {
      // remove all events when called without arguments
      this.events = {}
    }
  }

, trigger: function (eventName) {
    var callback = this.events[eventName]
    if (!callback) {
      return
    }
    callback.apply(this, Array.prototype.slice.call(arguments, 1))
  }

, handleFrame: function (frame) {
    this.trigger('frame', frame)
    this.gestureDetector.processFrame(frame)
  }
})


module.exports = LeapManager
