// https://w3c.github.io/FileAPI/#filelist-section
// NOTE: This implementation can represent only empty FileList.
function FileList() {
  this.length = 0
}

FileList.prototype.item = function (index) {
  return null
}

export default FileList
