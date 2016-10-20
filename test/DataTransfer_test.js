/* eslint-env mocha */
import DataTransfer from '../src/DataTransfer';
import expect from 'expect.js';

describe('DataTransfer', function() {
  var format = 'Text';
  var store = {'mode': 'readwrite'};
  var dataTransfer = new DataTransfer(store);

  beforeEach(function () {
    store = {'mode': 'readwrite'};
    dataTransfer = new DataTransfer(store);
  });

  describe('#setDragImage', function () {
    var clonedDragImageElement = {
      'clientHeight': 67,
      'clientWidth': 32
    };

    var dragImageElement = {
      'clientHeight': 67,
      'clientWidth': 32,
      cloneNode() { return clonedDragImageElement; }
    };

    var x = 10;
    var y = 21;

    context('when there is NO store', function () {
      it('does NOT store the preview element', function () {
        dataTransfer = new DataTransfer();
        dataTransfer.setDragImage(dragImageElement, x, y);
        expect(typeof store.dragPreviewElement).to.equal('undefined');
      });
    });

    context('when store mode is NOT "readwrite"', function () {
      it('does NOT store the preview element', function () {
        store = {'mode': 'notreadwrite'};
        dataTransfer = new DataTransfer(store);
        dataTransfer.setDragImage(dragImageElement, x, y);
        expect(typeof store.dragPreviewElement).to.equal('undefined');
      });
    });

    context('when store mode is "readwrite"', function () {
      it('stores a clone of the preview element', function () {
        dataTransfer.setDragImage(dragImageElement, x, y);
        expect(store.dragPreviewElement).to.equal(clonedDragImageElement);
      });

      describe('the cloned dragPreviewElement', function () {
        it("knows its offset from the touch point", function () {
          dataTransfer.setDragImage(dragImageElement, x, y);
          expect(clonedDragImageElement.dragPointOffsetX).to.equal(-x);
          expect(clonedDragImageElement.dragPointOffsetY).to.equal(-y);
        });

        it("knows its dimensions", function () {
          dataTransfer.setDragImage(dragImageElement, x, y);
          expect(clonedDragImageElement.width).to.equal(32);
          expect(clonedDragImageElement.height).to.equal(67);
        });
      });
    });
  });

  describe('#getData', function () {
    context('when store mode is "protected"', function () {

      it('returns blank string', function () {
        store = {'mode': 'protected'};
        expect(dataTransfer.getData(format)).to.equal('');
      });
    });

    context('when format is unrecognized', function () {
      it('returns blank string', function () {
        expect(dataTransfer.getData('not recognized')).to.equal('');
      });
    });

    context('when given format is text', function () {
      it('returns stored data', function () {
        dataTransfer.typeTable = {'text/plain': 'some data'};
        expect(dataTransfer.getData('Text')).to.equal('some data');
      });
    });

    context('when given format is url', function () {
      it('returns a blank string by default', function () {
        expect(dataTransfer.getData('Url')).to.equal('');
      });

      it('returns the first uncommented line of any stored data', function () {
        dataTransfer.typeTable = {
          'text/uri-list': '# commentedout\nsome data' +
            '\r;some more data\r\nand even more\n'
        };
        expect(dataTransfer.getData('Url')).to.equal('some data');
      });
    });
  });

  describe('#setData', function () {
    var data = 'this data\nis very important';

    context('when there is NO store', function () {
      it('does NOT store the data', function () {
        dataTransfer = new DataTransfer();
        dataTransfer.setData(format, data);
        expect(dataTransfer.typeTable).to.be.empty();
      });
    });

    context('when store mode is NOT "readwrite"', function () {
      it('does NOT store the data', function () {
        store = {'mode': 'notreadwrite'};
        dataTransfer = new DataTransfer(store);
        dataTransfer.setData(format, data);
        expect(dataTransfer.typeTable).to.be.empty();
      });
    });

    context('when given format is text', function () {
      it('stores the given data under the key "text/plain"', function () {
        format = 'Text';
        dataTransfer.setData(format, data);
        expect(dataTransfer.typeTable['text/plain']).to.equal(data);
      });

      it('updates the list of stored types', function () {
        format = 'Text';
        dataTransfer.setData(format, data);
        expect(dataTransfer.types).to.contain('text/plain');
      });
    });

    context('when given format is url', function () {

      it('stores the given data under the key "text/uri-list"', function () {
        format = 'Url';
        dataTransfer.setData(format, data);
        expect(dataTransfer.typeTable['text/uri-list']).to.equal(data);
      });

      it('updates the list of stored types', function () {
        format = 'Url';
        dataTransfer.setData(format, data);
        expect(dataTransfer.types).to.contain('text/uri-list');
      });
    });
  });

  describe('#clearData', function () {
    beforeEach(function () {
      store = {'mode': 'readwrite'};
      dataTransfer = new DataTransfer(store);
      dataTransfer.typeTable = {
        'Files': 'some file data',
        'text/plain': 'text data',
        'text/uri-list': 'url data'
      };
      dataTransfer.types = ['Files', 'text/plain', 'text/uri-list'];
    });

    context('when there is NO store', function () {
      it('does NOT clear the data', function () {
        dataTransfer = new DataTransfer(null);
        dataTransfer.typeTable = {
          'text/plain': 'text data',
          'text/uri-list': 'url data'
        };
        dataTransfer.clearData('Text');
        expect(dataTransfer.typeTable['text/plain']).to.equal('text data');
      });
    });

    context('when store mode is NOT "readwrite"', function () {
      it('does NOT clear the data', function () {
        store = {'mode': 'notreadwrite'};
        dataTransfer = new DataTransfer(store);
        dataTransfer.typeTable = {
          'text/plain': 'text data',
          'text/uri-list': 'url data'
        };
        dataTransfer.clearData('Text');
        expect(dataTransfer.typeTable['text/plain']).to.equal('text data');
      });
    });

    context('when given format is text', function () {
      it('clears data stored under the key "text/plain"', function () {
        expect(typeof dataTransfer.typeTable['text/plain'])
          .not.to.equal('undefined');
        expect(typeof dataTransfer.typeTable['text/uri-list'])
          .not.to.equal('undefined');
        dataTransfer.clearData('Text');
        expect(typeof dataTransfer.typeTable['text/plain'])
          .to.equal('undefined');
        expect(typeof dataTransfer.typeTable['text/uri-list'])
          .not.to.equal('undefined');
      });

      it('updates the list of stored types', function () {
        dataTransfer.types = ['text/plain', 'text/uri-list'];
        expect(dataTransfer.types).to.contain('text/plain');
        dataTransfer.clearData('Text');
        expect(dataTransfer.types).not.to.contain('text/plain');
      });
    });

    context('when given format is url', function () {
      it('clears data stored under the key "text/uri-list"', function () {
        expect(typeof dataTransfer.typeTable['text/plain'])
          .not.to.equal('undefined');
        expect(typeof dataTransfer.typeTable['text/uri-list'])
          .not.to.equal('undefined');
        dataTransfer.clearData('Url');
        expect(typeof dataTransfer.typeTable['text/plain'])
          .not.to.equal('undefined');
        expect(typeof dataTransfer.typeTable['text/uri-list'])
          .to.equal('undefined');
      });

      it('updates the list of stored types', function () {
        dataTransfer.types = ['text/plain', 'text/uri-list'];
        expect(dataTransfer.types).to.contain('text/uri-list');
        dataTransfer.clearData('Url');
        expect(dataTransfer.types).not.to.contain('text/uri-list');
      });
    });

    context('when given format is "undefined"', function () {
      it('clears data stored under the key "text/uri-list"', function () {
        expect(typeof dataTransfer.typeTable['text/plain'])
          .not.to.equal('undefined');
        expect(typeof dataTransfer.typeTable['text/uri-list'])
          .not.to.equal('undefined');
        expect(typeof dataTransfer.typeTable.Files)
          .not.to.equal('undefined');
        dataTransfer.clearData();
        expect(typeof dataTransfer.typeTable['text/plain'])
          .to.equal('undefined');
        expect(typeof dataTransfer.typeTable['text/uri-list'])
          .to.equal('undefined');
        expect(typeof dataTransfer.typeTable.Files)
          .not.to.equal('undefined');
      });

      it('updates the list of stored types', function () {
        expect(dataTransfer.types).to.contain('text/uri-list');
        expect(dataTransfer.types).to.contain('text/plain');
        expect(dataTransfer.types).to.contain('Files');
        dataTransfer.clearData();
        expect(dataTransfer.types).not.to.contain('text/uri-list');
        expect(dataTransfer.types).not.to.contain('text/plain');
        expect(dataTransfer.types).to.contain('Files');
      });
    });
  });

});

