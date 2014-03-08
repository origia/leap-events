"use strict";

var LeapManager = require('./leap-manager')

var i = 0
var manager = new LeapManager()
manager.on('twoFingersMove', function (state) {
  console.log("move: " + i++)
})
manager.on('surround', function (states) {
  console.log("suround: " + i++)
})
manager.start()

module.exports = { LeapManager: require('./leap-manager')
                 , FrameState: require('./frame-state')
                 }

module.exports = { LeapManager: require('./leap-manager')
                 , FrameState: require('./frame-state')
                 }
