var expect = require('expect.js')
var sinon = require('sinon')

import DataTransferItem from '../src/DataTransferItem'

describe('DataTransferItem', function() {
  describe('#getAsString', function () {
    var data = { mydata: 'blah' }
    var type = 'something'
    var kind = "string"
    var store = { mode: "protected" }
    var callback = sinon.spy()

    beforeEach(function () {
      this.clock = sinon.useFakeTimers();
    })

    afterEach(function() {
      this.clock.restore()
      callback.reset()
    })

    context('when store mode is readwrite AND kind is string', function () {
      kind = "string"
      store = { mode: "readwrite" }
      var item = new DataTransferItem(data, kind, type, store)

      it('asynchronously calls given callback with the data', function () {
        item.getAsString(callback)
        this.clock.tick(1)
        expect(callback.called).to.equal(true)
      })
    })

    context('when store mode is NOT readwrite', function () {
      store = { mode: "protected" }
      var item = new DataTransferItem(data, kind, type, store)

      it('returns undefined', function () {
        expect(item.getAsString(callback)).to.equal(undefined)
      })

      it('does not call the callback', function () {
        item.getAsString(callback)
        this.clock.tick(1)
        expect(callback.called).to.equal(false)
      })
    })

    context('when kind is NOT "string"', function () {
      kind = "string"
      var item = new DataTransferItem(data, kind, type, store)
      callback = sinon.spy()

      it('returns undefined', function () {
        expect(item.getAsString(callback)).to.equal(undefined)
      })

      it('does not call the callback', function () {
        item.getAsString(callback)
        this.clock.tick(1)
        expect(callback.called).to.equal(false)
      })
    })
  })


  describe('#getAsFile', function () {
    var data = { mydata: 'blah' }
    var type = 'something'
    var kind = "string"
    var store = { mode: "protected" }

    context('when store mode is readwrite AND kind is string', function () {
      kind = "string"
      store = { mode: "readwrite" }
      var item = new DataTransferItem(data, kind, type, store)

      it('returns the data', function () {
        expect(item.getAsFile()).to.equal(data)
      })
    })

    context('when store mode is NOT readwrite', function () {
      store = { mode: "protected" }
      var item = new DataTransferItem(data, kind, type, store)

      it('returns null', function () {
        expect(item.getAsFile()).to.equal(null)
      })
    })

    context('when kind is NOT "string"', function () {
      kind = "file"
      var item = new DataTransferItem(data, kind, type, store)

      it('returns null', function () {
        expect(item.getAsFile()).to.equal(null)
      })
    })
  })


  describe('.createForString', function () {
    it('returns a DataTransferItem with a "string" kind', function () {
      var item = DataTransferItem.createForString()
      expect(item).to.be.a(DataTransferItem)
      expect(item.kind).to.equal('string')
    })
  })


  describe('.createForFile', function () {
    it('returns DataTransferItem with a "file" kind & null type', function () {
      var item = DataTransferItem.createForFile()
      expect(item).to.be.a(DataTransferItem)
      expect(item.kind).to.equal('file')
      expect(item.type).to.equal(null)
    })
  })
})
