module.exports = function InvalidAccount(account) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = `Account ${account} doesn't exists`;
  this.status = 404;
};

require('util').inherits(module.exports, Error);
