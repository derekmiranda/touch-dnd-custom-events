var expect = require('expect.js')

import DataTransfer from '../src/DataTransfer'

describe('DataTransfer', function() {
  var store
  var format = "Text"
  var dataTransfer

  beforeEach(function () {
    // default test values
    store = { mode: "readwrite" }
    dataTransfer = new DataTransfer(store)
  })

  describe('#setDragImage', function () {
    xit('does something important', function () {
      // ??????
    })
  })

  describe('#getData', function () {
    context('when store mode is "protected"', function () {
      store = { mode: "protected" }

      it('returns blank string', function () {
        expect(dataTransfer.getData(format)).to.equal('')
      })
    })

    context('when format is unrecognized', function () {
      format = "not recognized"

      it('returns blank string', function () {
        expect(dataTransfer.getData(format)).to.equal('')
      })
    })

    context('when given format is text', function () {
      var format = "Text"

      it('returns stored data', function () {
        dataTransfer.typeTable = {'text/plain': 'some data'}
        expect(dataTransfer.getData(format)).to.equal('some data')
      })
    })

    context('when given format is url', function () {
      var format = "Url"

      it('returns a blank string by default', function () {
        expect(dataTransfer.getData(format)).to.equal('')
      })

      it('returns the first uncommented line of any stored data', function () {
        dataTransfer.typeTable = {'text/uri-list': '# commentedout\nsome data\rsome more data\r\nand even more\n'}
        expect(dataTransfer.getData(format)).to.equal('some data')
      })
    })
  })

  describe('#setData', function () {
    var data = 'this data\nis very important'

    context('when there is NO store', function () {
      it('does NOT store the data', function () {
        dataTransfer = new DataTransfer(undefined)
        dataTransfer.setData(format, data)
        expect(dataTransfer.typeTable).to.be.empty()
      })
    })

    context('when store mode is NOT "readwrite"', function () {
      it('does NOT store the data', function () {
        store = { mode: "notreadwrite" }
        dataTransfer = new DataTransfer(store)
        dataTransfer.setData(format, data)
        expect(dataTransfer.typeTable).to.be.empty()
      })
    })

    context('when given format is text', function () {
      it('stores the given data under the key "text/plain"', function () {
        format = "Text"
        dataTransfer.setData(format, data)
        expect(dataTransfer.typeTable['text/plain']).to.equal(data)
      })

      it('updates the list of stored types', function () {
        format = "Text"
        dataTransfer.setData(format, data)
        expect(dataTransfer.types).to.contain('text/plain')
      })
    })

    context('when given format is url', function () {

      it('stores the given data under the key "text/uri-list"', function () {
        format = "Url"
        dataTransfer.setData(format, data)
        expect(dataTransfer.typeTable['text/uri-list']).to.equal(data)
      })

      it('updates the list of stored types', function () {
        format = "Url"
        dataTransfer.setData(format, data)
        expect(dataTransfer.types).to.contain('text/uri-list')
      })
    })
  })

  describe('#clearData', function () {
    beforeEach(function () {
      store = { 'mode': 'readwrite'}
      dataTransfer = new DataTransfer(store)
      dataTransfer.typeTable = {
        'Files': 'some file data',
        'text/plain': 'text data',
        'text/uri-list': 'url data'
      }
      dataTransfer.types = ['Files', 'text/plain', 'text/uri-list']
    })

    context('when there is NO store', function () {
      it('does NOT clear the data', function () {
        store = undefined
        dataTransfer = new DataTransfer(store)
        dataTransfer.typeTable = {
          'text/plain': 'text data',
          'text/uri-list': 'url data'
        }
        dataTransfer.clearData('Text')
        expect(dataTransfer.typeTable['text/plain']).to.equal('text data')
      })
    })

    context('when store mode is NOT "readwrite"', function () {
      it('does NOT clear the data', function () {
        store = { 'mode': 'notreadwrite'}
        dataTransfer = new DataTransfer(store)
        dataTransfer.typeTable = {
          'text/plain': 'text data',
          'text/uri-list': 'url data'
        }
        dataTransfer.clearData('Text')
        expect(dataTransfer.typeTable['text/plain']).to.equal('text data')
      })
    })

    context('when given format is text', function () {
      it('clears data stored under the key "text/plain"', function () {
        expect(dataTransfer.typeTable['text/plain']).not.to.equal(undefined)
        expect(dataTransfer.typeTable['text/uri-list']).not.to.equal(undefined)
        dataTransfer.clearData("Text")
        expect(dataTransfer.typeTable['text/plain']).to.equal(undefined)
        expect(dataTransfer.typeTable['text/uri-list']).not.to.equal(undefined)
      })

      it('updates the list of stored types', function () {
        dataTransfer.types = ['text/plain', 'text/uri-list']
        expect(dataTransfer.types).to.contain('text/plain')
        dataTransfer.clearData("Text")
        expect(dataTransfer.types).not.to.contain('text/plain')
      })
    })

    context('when given format is url', function () {
      it('clears data stored under the key "text/uri-list"', function () {
        expect(dataTransfer.typeTable['text/plain']).not.to.equal(undefined)
        expect(dataTransfer.typeTable['text/uri-list']).not.to.equal(undefined)
        dataTransfer.clearData("Url")
        expect(dataTransfer.typeTable['text/plain']).not.to.equal(undefined)
        expect(dataTransfer.typeTable['text/uri-list']).to.equal(undefined)
      })

      it('updates the list of stored types', function () {
        dataTransfer.types = ['text/plain', 'text/uri-list']
        expect(dataTransfer.types).to.contain('text/uri-list')
        dataTransfer.clearData("Url")
        expect(dataTransfer.types).not.to.contain('text/uri-list')
      })
    })

    context('when given format is "undefined"', function () {
      it('clears data stored under the key "text/uri-list"', function () {
        expect(dataTransfer.typeTable['text/plain']).not.to.equal(undefined)
        expect(dataTransfer.typeTable['text/uri-list']).not.to.equal(undefined)
        expect(dataTransfer.typeTable['Files']).not.to.equal(undefined)
        dataTransfer.clearData(undefined)
        expect(dataTransfer.typeTable['text/plain']).to.equal(undefined)
        expect(dataTransfer.typeTable['text/uri-list']).to.equal(undefined)
        expect(dataTransfer.typeTable['Files']).not.to.equal(undefined)
      })

      it('updates the list of stored types', function () {
        expect(dataTransfer.types).to.contain('text/uri-list')
        expect(dataTransfer.types).to.contain('text/plain')
        expect(dataTransfer.types).to.contain('Files')
        dataTransfer.clearData(undefined)
        expect(dataTransfer.types).not.to.contain('text/uri-list')
        expect(dataTransfer.types).not.to.contain('text/plain')
        expect(dataTransfer.types).to.contain('Files')
      })
    })
  })

})
