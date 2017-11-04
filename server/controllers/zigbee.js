var Account = require('../models').Account

module.exports = {
  bridge: function(req, res, next) {
      console.log(req.body);
      res.status(200).json({balance: 500});
  }
};
