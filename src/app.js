"use strict";

var LeapManager = require('./leap-manager')

var manager = new LeapManager()
manager.on('fiveFingersMove', function (fingers) {
  // console.log(fingers)
})
manager.start()
