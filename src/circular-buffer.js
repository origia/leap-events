/**
 * Circular buffer class
 * Supports O(1) append/access operations
**/

"use strict";

var _ = require('underscore')
  , logger = require('./logger')


  , defaults = { capacity: 200
               }

var CircularBuffer = function (overrides) {
  this.options = _.extend({}, defaults, overrides)
  this._container = []
  // preallocate space
  this._container.length = this.options.capacity
}

_.extend(CircularBuffer.prototype, {
  _currentLength: 0
, _currentIndex:  -1

, _nextIndex: function (i) {
    return i + 1 < this.capacity() ? i + 1 : 0
  }

, _prevIndex: function (i) {
    return i > 0 ? i - 1 : this.capacity() - 1
  }

, _incrementCounters: function () {
    this._currentIndex = this._nextIndex(this._currentIndex)
    if (this._currentLength < this.capacity()) {
      this._currentLength++
    }
  }

, append: function (item) {
    this._incrementCounters()
    this._container[this._currentIndex] = item
  }

, size: function () {
    return this._currentLength
  }

, capacity: function () {
    return this.options.capacity
  }

, _indexFromEnd: function (n) {
    var index = this._currentIndex - n
    if (index < 0) {
      index += this.capacity()
    }
    return index
  }

  // O(1)
, last: function (n) {
    n = n || 0
    if (n < 0) {
      throw new RangeError("argument should be positive")
    }
    return this._container[this._indexFromEnd(n)]
  }

  // case O(n)
, take: function (n) {
    if (_.isUndefined(n) ||  n < 0) {
      throw new RangeError("argument should be defined and positive")
    }

    var start = this._indexFromEnd(n - 1)
    var retArray
    if (n >= this._currentLength) {
      retArray = this._container.slice(0, this._currentLength)
    } else if (this._currentIndex + 1 < start) {
      var firstPart = this._container.slice(start, this.capacity())
      var secondPart = this._container.slice(0, this._currentIndex + 1)
      retArray = firstPart.concat(secondPart)
    } else {
      retArray = this._container.slice(start, this._currentIndex + 1)
    }
    return retArray.reverse()
  }

, container: function () {
    return this._container
  }

, each: function (callback) {
    for (var i = this._currentIndex, j = 0; j < this._currentLength;
      i = this._prevIndex(i), j++) {
      callback(this._container[i])
    }
  }

  // worst case O(N)
, takeWhile: function (predicate, fromLast) {
    var retArray = []
      , index = this._currentIndex
    if (_.isUndefined(fromLast)) {
      fromLast = true
    }

    while (this._container[index] && predicate(this._container[index])) {
      retArray.push(this._container[index])
      index = this._prevIndex(index)
    }

    return fromLast ? retArray : retArray.reverse()
  }

, skipAndTakeWhile: function (skipPredicate, takePredicate) {
    var retArray = []
      , index = this._currentIndex

    takePredicate = takePredicate || function (elem) {
      return !skipPredicate(elem)
    }

    while (this._container[index] && skipPredicate(this._container[index])) {
      index = this._prevIndex(index)
    }

    while (this._container[index] && takePredicate(this._container[index])) {
      retArray.push(this._container[index])
      index = this._prevIndex(index)
    }

    return retArray
  }
})


module.exports = CircularBuffer
