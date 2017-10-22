var Enum = require('enum');
var status = new Enum(['OPENED', 'REVIEWING', 'REJECTED', 'CLOSED']);
module.exports = status;