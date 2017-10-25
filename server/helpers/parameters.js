var MissingParameter = require('../exceptions/missingParameter')
var InvalidParameter = require('../exceptions/invalidParameter');
var accountType = require('./accountType')

module.exports = {
  verifyParameter: function(param, name) {
    if(!param) {
      throw new MissingParameter('Missing parameter: ' + name);
    }
  },

  verifyAccountTypeParameter: function(param, name) {
    module.exports.verifyParameter(param, name);

    if(!accountType.get(param)) {
        throw new InvalidParameter('Invalid account type : ' + param);
    }
  }
}
