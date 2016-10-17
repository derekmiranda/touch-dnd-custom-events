// https://html.spec.whatwg.org/multipage/interaction.html#datatransferitem
function DataTransferItem(data, kind, typeLowerCase, store) {
  this.data = data
  this.store = store
  this.type = typeLowerCase
  this.kind = kind
}

DataTransferItem.prototype.getAsString = function (callback) {
  if (!callback) { return }
  if (this.store.mode !== "readwrite") { return }
  if (this.kind !== "string") { return }

  var self = this
  setTimeout(function () { callback(self.data) }, 0)
}

// Return a new File object representing the actual data of the item
// represented by the DataTransferItem object.
DataTransferItem.prototype.getAsFile = function () {
  if (this.store.mode !== "readwrite") { return null }
  if (this.kind !== "string") { return null }
  return this.data
}

DataTransferItem.createForString = function (data, type, store) {
  return new DataTransferItem(data, "string", type, store)
}

DataTransferItem.createForFile = function (data, store) {
  return new DataTransferItem(data, "file", null, store)
}

export default DataTransferItem
