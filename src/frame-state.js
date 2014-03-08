/**
 * Model for leap motion fingers state
**/

"use strict";

var _      = require('underscore')
  , logger = require('./logger')


var FrameState = function (frame) {
  this.frame = frame || {}
  this.fingers = this.frame.fingers || []
}

_.extend(FrameState, {
  screenSize: { width: 1024
              , height: 768
              }
, leapFrameSize: { width: 400
                 , height: 400
                 }
, yMinValue: 40
})

_.extend(FrameState.prototype, {
  equals: function (other) {
    if (this.fingersCount() != other.fingersCount()) {
      return false
    }
    return _.isEmpty(_.difference(this.fingerIds(), other.fingerIds()))
  }

, frameId: function () {
    return this.frame.id
  }

, fingersCount: function () {
    return this.fingers.length
  }

, fingerIds: function () {
    return _.pluck(this.fingers, 'id')
  }

, position2D: function () {
    if (this.fingersCount() ===  0) {
      return null
    }
    var position = _(this.fingers).first().tipPosition
    return [position[0], position[1]]
  }

, screenPosition: function () {
    var position = this.position2D()
    if (position === null) {
      return null
    }
    var x = position[0]
      , y = position[1]

    x += FrameState.leapFrameSize.width / 2
    y -= FrameState.yMinValue
    x = x / FrameState.leapFrameSize.width * FrameState.screenSize.width
    y = y / FrameState.leapFrameSize.height * FrameState.screenSize.height
    return { x: x
           , y: FrameState.screenSize.height - y
           }
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

module.exports = FrameState
