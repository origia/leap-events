/**
 * Wrapper class around Leap.this.Controller
**/

var Leap = require('leapjs');
var _ = require('underscore');

var defaults = {
  host: '127.0.0.1',
  port: 6437,
  enableGestures: true,
  frameEventName: 'deviceFrame',
  useAllplugins: false
};

var LeapManager = function(overrides) {
  this.options = _.extend({}, defaults, overrides);
  this.controller = new Leap.Controller(this.options);
};

_.extend(LeapManager.prototype, {
  events: {},
  started: false,

  start: function() {
    if (this.started) {
      return;
    }
    this.controller.connect();
    this.controller.on('frame', this.handleFrame);
    this.started = true;
  },

  stop: function() {
    if (!this.started) {
      return;
    }
    this.controller.disconnect();
    this.started = false;
  },

  isRunning: function() {
    return this.started;
  },

  on: function(eventName, callback) {
    this.events[eventName] = callback;
  },

  off: function(eventName) {
    if (eventName) {
      delete this.events[eventName];
    } else {
      // remove all events when called without arguments
      this.events = {};
    }
  },

  trigger: function(eventName) {
    var callback = this.events[eventName];
    if (!callback) {
      return;
    }
    var args = Array.prototype.slice.call(arguments, 1);
    callback(args);
  },

  handleFrame: function(frame) {
    console.log(frame);
  }
});


module.exports = LeapManager;
