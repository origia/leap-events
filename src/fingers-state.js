/**
 * Model for leap motion fingers state
**/

"use strict";

var _      = require('underscore')
  , logger = require('./logger')

var FingersState = function (fingers) {
  this.fingers = fingers || []
}

_.extend(FingersState.prototype, {
  equals: function (other) {
    if (this.fingersCount() != other.fingersCount()) {
      return false
    }
    return _.isEmpty(_.difference(this.fingerIds(), other.fingerIds()))
  }

, fingersCount: function () {
    return this.fingers.length
  }

, fingerIds: function () {
    return _.pluck(this.fingers, 'id')
  }
})

module.exports = FingersState
