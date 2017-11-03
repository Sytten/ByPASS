module.exports = function invalidTransaction(message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = `Invalid Transcation: ${message}`;
  this.status = 404;
};

require('util').inherits(module.exports, Error);
