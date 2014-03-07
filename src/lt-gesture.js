"use strict";

var fs          = require('fs')
  , LeapTrainer = require('./leaptrainer')
  , logger      = require('./logger')

var trainer = new LeapTrainer.Controller()

var musicFile = __dirname + '/../gesture/music.json'
var buyFile   = __dirname + '/../gesture/buy.json'
var zoomFile   = __dirname + '/../gesture/zoom.json'

fs.readFile(buyFile, 'utf8', function (err, text) {
    trainer.fromJSON(text)
    trainer.on('BUY', function () {
      logger.debug('BUY motion.')
    })
})
