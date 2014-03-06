var Leap = require('leapjs');
var controller = new Leap.Controller();

controller.on('frame', function(frame) {
  console.log(frame);
});

controller.connect();
