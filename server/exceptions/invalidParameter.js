module.exports = function InvalidParameter(message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.status = 400;
};

require('util').inherits(module.exports, Error);
