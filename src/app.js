"use strict";

var LeapManager = require('./leap-manager')

var manager = new LeapManager()
manager.on('oneFingerMove', function (state) {
  console.log(state.screenPosition())
})
manager.start()
