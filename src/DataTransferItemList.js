import DataTransferItem from './DataTransferItem'
import { InvalidStateError, NotSupportedError } from './errors'

// Each DataTransfer object is associated with a DataTransferItemList object.
// https://html.spec.whatwg.org/multipage/interaction.html#datatransferitemlist
function DataTransferItemList(store) {
  this.store = store
  this.items = []
  this.typeTable = {}
  this.length = 0
}

DataTransferItemList.prototype.remove = function (index) {
  if (this.store.mode !== "readwrite") {
    throw InvalidStateError.createByDefaultMessage()
  }

  // Remove the ith item from the drag data store.
  var removed = this.items.splice(index, 1)[0]
  this.syncInternal()
  if (removed) { delete this.typeTable[removed.type] }
}

DataTransferItemList.prototype.clear = function () {
  if (this.store.mode !== "readwrite") {
    throw InvalidStateError.createByDefaultMessage()
  }

  this.items = []
  this.syncInternal()
}

DataTransferItemList.prototype.add = function (data, type) {
  if (this.store.mode !== "readwrite") { return null }

  if (typeof data === "string") {
    // If there is already an item in the drag data store item list whose
    // kind is Plain Unicode string and whose type string is equal to the
    // value of the method's second argument, converted to ASCII lowercase,
    // then throw a NotSupportedError exception and abort these steps.
    var typeLowerCase = type.toLowerCase()
    if (this.typeTable[typeLowerCase]) {
      throw NotSupportedError.createByDefaultMessage()
    }

    // Otherwise, add an item to the drag data store item list whose kind is
    // Plain Unicode string, whose type string is equal to the value of the
    // method's second argument, converted to ASCII lowercase, and whose
    // data is the string given by the method's first argument.
    var stringItem = DataTransferItem.createForString(
      data, typeLowerCase, this.store
    )

    this.items.push(stringItem)
    this.typeTable[typeLowerCase] = true
  }
  else {
    // Add an item to the drag data store item list whose kind is File,
    // whose type string is the type of the File, converted to ASCII
    // lowercase, and whose data is the same as the File's data.
    var fileItem = DataTransferItem.createForFile(data, this.store)
    this.items.push(fileItem)
  }
  this.syncInternal()
}

DataTransferItemList.prototype.syncInternal = function () {
  var self = this
  for (var i = 0; i < this.length; i++) {
    delete this[i]
  }

  this.items.forEach(function (item, j) {
    self[j] = item
  })

  this.length = this.items.length
}

export default DataTransferItemList
