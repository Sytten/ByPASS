module.exports = function InvalidTransaction(account, error) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = `Error with transaction : [client = ${account}]\nCause : ` + error.message;
  this.status = 404;
};

require('util').inherits(module.exports, Error);
