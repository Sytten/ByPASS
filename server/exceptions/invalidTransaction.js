module.exports = function InvalidTransaction(account) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = `Transaction with client = ${account} doesn't exists`;
  this.status = 404;
};

require('util').inherits(module.exports, Error);
