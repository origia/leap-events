"use strict";

var fs          = require('fs')
  , LeapTrainer = require('./leaptrainer')
  , logger      = require('./logger')

var trainer = new LeapTrainer.Controller()
var trainer2 = new LeapTrainer.TemplateMatcher()

var musicFile = __dirname + '/../gesture/music.json'
var buyFile   = __dirname + '/../gesture/buy.json'
var zoomFile   = __dirname + '/../gesture/zoom.json'

fs.readFile(buyFile, 'utf8', function (err, text) {
    var trainingData = trainer.fromJSON(text)
    trainer.on('BUY', function () {
      logger.debug('BUY motion.')
    })
    logger.debug(trainer.distribute(trainingData.data))
})

fs.readFile(zoomFile, 'utf8', function (err, text) {
    trainer.fromJSON(text)
    trainer.on('ZOOM', function () {
      logger.debug('ZOOM motion.')
    })
    trainer.on('gesture-recognized', function(hit, gestureName, allHits) {
      logger.debug('hit %s',hit)
      logger.debug('gestureName %s',gestureName)
      logger.debug('allHits %s',allHits)
    });
})

fs.readFile(musicFile, 'utf8', function (err, text) {
    trainer.fromJSON(text)
    trainer.on('MUSIC', function () {
      logger.debug('MUSIC motion.')
    })
})
