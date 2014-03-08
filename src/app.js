"use strict";

var LeapManager = require('./leap-manager')

var manager = new LeapManager()
manager.on('surround', function (states) {
  console.log(states)
})
manager.start()

module.exports = { LeapManager: require('./leap-manager')
                 , FrameState: require('./frame-state')
                 }

module.exports = { LeapManager: require('./leap-manager')
                 , FrameState: require('./frame-state')
                 }
