var expect = require('expect.js')
var sinon = require('sinon')

import simulateEvent from '../src/simulateEvent'

global.Event = function(){}

describe('simulateEvent', function() {
  var dataTransfer = {}
  var dispatchSpy = sinon.spy()

  var target = {
    offsetLeft: 20,
    offsetTop: 30,
    dispatchEvent: dispatchSpy
  }

  var touchEvent = {
    altkey: true,
    ctrlKey: true,
    changedTouches: [
      {
        clientX: 14,
        clientY: 15,
        pageX: 16,
        pageY: 17,
        screenX: 18,
        screenY: 19
      }
    ],
    relatedTarget: {},
    returnValue: 1,
    shiftKey: true,
    sourceCapabilities: {},
    view: {}
  }

  var type = "touchdragstart"

  context('when any of the parameters are NOT present', function () {
    it('throws an error', function () {
      expect(simulateEvent)
        .withArgs(undefined, touchEvent, dataTransfer, target)
        .to.throwError()

      expect(simulateEvent)
        .withArgs(type, undefined, dataTransfer, target)
        .to.throwError()

      expect(simulateEvent)
        .withArgs(type, touchEvent, undefined, target)
        .to.throwError()

      expect(simulateEvent)
        .withArgs(type, touchEvent, dataTransfer, undefined)
        .to.throwError()
    })
  })

  context('when the given type is unrecognized', function () {
    it('throws an error', function () {
      expect(simulateEvent)
        .withArgs('notrecognized', touchEvent, dataTransfer, target)
        .to.throwError()
    })
  })

  context('when event is recognized', function () {
    it('dispatches an event', function () {
      simulateEvent(type, touchEvent, dataTransfer, target)
      expect(dispatchSpy.called).to.equal(true)
    })
  })
})
