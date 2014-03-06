var LeapManager = require('./leap-manager');

var manager = new LeapManager();
manager.on('frame', function(frame) {
  console.log(frame);
});
manager.start();

