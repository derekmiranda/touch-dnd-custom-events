var expect = require('expect.js')

import DataTransferItemList from '../src/DataTransferItemList'

describe('DataTransferItemList', function() {

  describe('#length', function() {
    it('should be 0 after initialization', function() {
      var itemList = new DataTransferItemList()
      expect(itemList.length).to.be(0)
    })
  })


  describe('#add', function() {
    context('when associated drag data store is read/write mode', function() {
      var dragDataStoreStub = {mode: 'readwrite'}

      context('when given 2 arguments)', function() {
        context('when data is NOT a "string"', function () {
          it('adds the data items', function() {
            var itemList = new DataTransferItemList(dragDataStoreStub)
            itemList.add('text/x-plain-1', 'TEXT_1')
            expect(itemList.length).to.be(1)

            itemList.add('text/x-plain-2', 'TEXT_2')
            expect(itemList.length).to.be(2)
          })
        })

        context('when data is "string"', function () {
          context('when type has already been added', function () {
            it('throws', function () {
              var itemList = new DataTransferItemList(dragDataStoreStub)
              itemList.add('string', 'TEXT_1')
              expect(itemList.add).withArgs('string', 'TEXT_1').to.throwException()
            })
          })

          context('when type has NOT already been added', function () {
            it('adds the data item', function () {
              var itemList = new DataTransferItemList(dragDataStoreStub)
              itemList.add('string', 'TEXT_1')
              expect(itemList.length).to.be(1)
            })
          })
        })
      })
    })


    context('when drag data store is NOT read/write mode', function() {
      var dragDataStoreStub = {mode: 'NOTreadwrite'}

      it('returns null', function () {
        var itemList = new DataTransferItemList(dragDataStoreStub)
        expect(itemList.add('text/x-plain-1', 'TEXT_1')).to.be(null)
      })

      it('does NOT add the data item', function () {
        var itemList = new DataTransferItemList(dragDataStoreStub)
        itemList.add('string', 'TEXT_1')
        expect(itemList.length).to.be(0)
      })
    })
  })


  describe('#remove', function() {
    context('when associated drag data store is read/write mode', function() {
      var dragDataStoreStub = {mode: 'readwrite'}

      context('when the given type is not included', function() {
        it('should not change #length', function() {
          var itemList = new DataTransferItemList(dragDataStoreStub)
          itemList.add('text/x-plain-1', 'TEXT_1')
          itemList.remove(999)
          expect(itemList.length).to.be(1)
        })
      })

      context('when the given type is included', function() {
        it('should decrease #length', function() {
          var itemList = new DataTransferItemList(dragDataStoreStub)
          itemList.add('text/x-plain-1', 'TEXT_1')
          itemList.remove(0)
          expect(itemList.length).to.be(0)
        })
      })
    })

    context('when drag data store is NOT read/write mode', function() {
      var dragDataStoreStub = {mode: 'NOTreadwrite'}

      it('throws', function () {
        var itemList = new DataTransferItemList(dragDataStoreStub)
        itemList.add('text/x-plain-1', 'TEXT_1')
        expect(itemList.remove).withArgs(0).to.throwException()
      })
    })
  })


  describe('#clear', function() {
    context('when associated drag data store is read/write mode', function() {
      var dragDataStoreStub = {mode: 'readwrite'}

      context('when the list is empty', function() {
        it('should not change #length', function() {
          var itemList = new DataTransferItemList(dragDataStoreStub)
          itemList.clear()
          expect(itemList.length).to.be(0)
        })
      })

      context('when the given type is included', function() {
        it('should decrease #length', function() {
          var itemList = new DataTransferItemList(dragDataStoreStub)
          itemList.add('text/x-plain-1', 'TEXT_1')
          itemList.add('text/x-plain-2', 'TEXT_2')
          itemList.clear()
          expect(itemList.length).to.be(0)
        })
      })
    })

    context('when drag data store is NOT read/write mode', function() {
      var dragDataStoreStub = {mode: 'NOTreadwrite'}

      it('throws', function () {
        var itemList = new DataTransferItemList(dragDataStoreStub)
        itemList.add('text/x-plain-1', 'TEXT_1')
        expect(itemList.clear).to.throwException()
      })
    })
  })

  describe('#syncInternal', function() {
    var dragDataStoreStub = {mode: 'readwrite'}

    it('should sync the internal list with the itemList', function () {
      var itemList = new DataTransferItemList(dragDataStoreStub)
      itemList.add('text/x-plain-1', 'TEXT_1')
      expect(itemList.items[0]).to.equal(itemList[0])

      itemList.items.pop() // remove from items but not from itemList
      expect(itemList.items.length).to.equal(0)
      expect(itemList.length).to.equal(1)

      itemList.syncInternal()

      // synchronized again
      expect(itemList.items[0]).to.equal(itemList[0])
    })
  })
})
