var Accounts = require('../models').Accounts
var InvalidAccount = require('../exceptions/invalidAccount')
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
      .then(account => res.status(201).json(account))
      .catch(function (err) {
        next(err);
      });
  },

  list: function(req, res, next) {
    return Accounts
    .findAll({})
    .then(accounts => res.status(200).json(accounts))
    .catch(function (err) {
      next(err);
    });
  },

  login: function(req, res, next) {
    return Accounts
      .findOne({where: {name: req.body.username}})
      .then(account => res.status(200).json({id: account.id}))
      .catch(() => next(new InvalidAccount(req.body.username)));
  },

  getById: function(req, res, next) {
    return Accounts
    .findById(req.params.id, {rejectOnEmpty: true})
    .then(account => res.status(200).json(account))
    .catch(() => next(new InvalidAccount(req.params.id)));
  }
};
