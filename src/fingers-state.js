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

, averagePosition: function () {
    var start = [0, 0, 0]

    if (this.fingersCount() === 0) {
      return start
    }

    var total = _.reduce(this.fingers, function (current, finger) {
      return [ current[0] + finger.stabilizedTipPosition[0]
             , current[1] + finger.stabilizedTipPosition[1]
             , current[2] + finger.stabilizedTipPosition[2]
             ]
    }, start)

    return { x: total[0] / this.fingersCount()
           , y: total[1] / this.fingersCount()
           , z: total[2] / this.fingersCount()
           }
  }
})

module.exports = FingersState
