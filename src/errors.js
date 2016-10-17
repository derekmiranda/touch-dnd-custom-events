var __extends = (this && this.__extends) || function (d, b) {
  for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]
  function __() { this.constructor = d }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __())
}

var InvalidStateError = (function (_super) {
  __extends(InvalidStateError, _super)

  function InvalidStateError(message) {
    _super.call(this, message)
    this.message = message
    this.name = "InvalidStateError"
  }

  InvalidStateError.createByDefaultMessage = function () {
    return new InvalidStateError("The object is in an invalid state")
  }

  return InvalidStateError
}(Error))


var NotSupportedError = (function (_super) {
  __extends(NotSupportedError, _super)

  function NotSupportedError(message) {
    _super.call(this, message)
    this.message = message
    this.name = "NotSupportedError"
  }

  NotSupportedError.createByDefaultMessage = function () {
    return new InvalidStateError("The operation is not supported")
  }

  return NotSupportedError
}(Error))

export default {
  InvalidStateError,
  NotSupportedError
}
