var MissingParameter = require('../exceptions/missingParameter')

module.exports = {
  verifyParameter: function(param, name) {
    if(!param) {
      throw new MissingParameter('Missing parameter: ' + name);
    }
  }
}