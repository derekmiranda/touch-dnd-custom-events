/* eslint-env mocha */
import expect from 'expect.js';
import simulateEvent from '../src/simulateEvent';
import sinon from 'sinon';

global.Event = sinon.spy();

describe('simulateEvent', function() {
  const dataTransfer = {};
  const dispatchSpy = sinon.spy();

  const target = {
    'dispatchEvent': dispatchSpy,
    'offsetLeft': 20,
    'offsetTop': 30
  };

  const touchEvent = {
    'altkey': true,
    'changedTouches': [
      {
        'clientX': 14,
        'clientY': 15,
        'pageX': 16,
        'pageY': 17,
        'screenX': 18,
        'screenY': 19
      }
    ],
    'ctrlKey': true,
    'relatedTarget': {},
    'returnValue': 1,
    'shiftKey': true,
    'sourceCapabilities': {},
    'view': {}
  };

  const type = 'touchdragstart';

  context('when any of the parameters are NOT present', function () {
    it('throws an error', function () {
      expect(simulateEvent)
        .withArgs(null, touchEvent, dataTransfer, target)
        .to.throwError();

      expect(simulateEvent)
        .withArgs(type, null, dataTransfer, target)
        .to.throwError();

      expect(simulateEvent)
        .withArgs(type, touchEvent, null, target)
        .to.throwError();

      expect(simulateEvent)
        .withArgs(type, touchEvent, dataTransfer, null)
        .to.throwError();
    });
  });

  context('when the given type is unrecognized', function () {
    it('throws an error', function () {
      expect(simulateEvent)
        .withArgs('notrecognized', touchEvent, dataTransfer, target)
        .to.throwError();
    });
  });

  context('when event is recognized', function () {
    it('dispatches an event', function () {
      simulateEvent(type, touchEvent, dataTransfer, target);
      expect(dispatchSpy.called).to.equal(true);
    });
  });
});
