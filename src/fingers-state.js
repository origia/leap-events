/**
 * Model for leap motion fingers state
**/

"use strict";

var _ = require('underscore')

var FingersState = function (fingers) {
  this.fingers = fingers || []
}

_.extend(FingersState.prototype, {
  equals: function (other) {
    if (this.count() != other.count) {
      return false
    }
    return _.isEmpty(_(this.fingersIds()).difference(other.fingersIds()))
  }

, count: function () {
    return this.fingers.length
  }

, fingerIds: function () {
    return _.pluck(this.fingers, 'id')
  }
})

module.exports = FingersState
