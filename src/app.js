"use strict";

var LeapManager = require('./leap-manager')

var manager = new LeapManager()
manager.on('twoFingersMove', function (state) {
  // console.log("move: " + i++)
})

manager.on('surround', function (states) {
  console.log("suround")
})

manager.on('music', function () {
  console.log('music')
})

manager.on('pause', function () {
  console.log('pause')
})

manager.on('buy', function () {
  console.log('buy')
})

manager.on('zoomIn', function () {
  console.log('zoomIn')
})

manager.on('zoomOut', function () {
  console.log('zoomOut')
})

manager.on('swipeLeft', function () {
  console.log('swipeLeft')
})

manager.on('swipeRight', function () {
  console.log('swipeRight')
})

manager.start()

module.exports = { LeapManager: require('./leap-manager')
                 , FrameState: require('./frame-state')
                 }

module.exports = { LeapManager: require('./leap-manager')
                 , FrameState: require('./frame-state')
                 }
