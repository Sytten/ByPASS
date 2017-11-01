module.exports = function AddItemException(message) {
      Error.captureStackTrace(this, this.constructor);
      this.name = this.constructor.name;
      this.message = message;
      this.status = 400;
  }
require('util').inherits(module.exports, Error);
