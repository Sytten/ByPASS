var Accounts = require('../models').Accounts
var verify = require('../helpers/parameters');

module.exports = {
  create: function(req, res, next) {
    verify.verifyParameter(req.body.name, 'name');
    verify.verifyAccountTypeParameter(req.body.type, 'type');

    return Accounts
      .create({
        name: req.body.name,
        type: req.body.type,
        amount: req.body.amount || 0.00,
        card: req.body.card || null
      })
      .then(account => res.status(201).send(account))
      .catch(function (err) {
        next(err);
      });
  },

  get_accounts: function(req, res, next) {
    return Accounts
    .findAll({})
    .then(accounts => res.status(200).json(accounts))
    .catch(function (err) {
      next(err);
    });
  }
};
