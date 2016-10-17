var expect = require('expect.js')

import FileList from '../src/FileList'

describe('FileList', function() {
  describe('#item', function() {
    it('should always return null', function() {
      var fileList = new FileList()
      expect(fileList.item(0)).to.be(null)
    })
  })

  describe('#length', function() {
    it('should always be 0', function() {
      var fileList = new FileList()
      expect(fileList.length).to.be(0)
    })
  })
})
