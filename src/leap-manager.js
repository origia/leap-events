var Leap = require('leapjs');
var _ = require('underscore');

var started = false;
var controller = new Leap.Controller();

var events = {};

var options = {
  host: '127.0.0.1',
  port: 6437,
  enableGestures: true,
  frameEventName: 'deviceFrame',
  useAllplugins: false
};

var LeapManager = function(overrides) {
  _.extend(options, overrides);
};

_.extend(LeapManager.prototype, {
  start: function() {
    if (started) {
      return;
    }
    controller.connect();
    started = true;
  },

  stop: function() {
    if (!started) {
      return;
    }
    controller.disconnect();
    started = false;
  },

  on: function(eventName, callback) {
    events[eventName] = callback;
  },

  off: function(eventName) {
    if (eventName) {
      delete events[eventName];
    } else {
      // remove all events when called without arguments
      events = {};
    }
  },

  trigger: function(eventName) {
    var callback = events[eventName];
    if (!callback) {
      return;
    }
    var args = Array.prototype.slice.call(arguments, 1);
    callback(args);
  }
};

module.exports = LeapManager;
