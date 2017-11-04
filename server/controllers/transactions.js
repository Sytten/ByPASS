// models
var Transaction = require('../models').Transaction
var LineItem = require('../models').LineItem

// verifiers
var verify = require('../helpers/parameters');

module.exports = {
  list: function(req, res, next) {
    return Transaction.
      findAll({
        where: {
          $or: {
            merchant: req.params.id,
            client: req.params.id
          }
        }
      })
      .then(transactions => res.status(200).json(transactions))
      .catch(function (err) {
        next(err);
      });
  },

  create: function(req, res, next) {
    verify.verifyParameter(req.body.merchant, 'merchant');
    verify.verifyParameter(req.body.client, 'client');

    // TODO handle when lineItem.itemId does not exists

    return Transaction
      .create({
        merchant: req.body.merchant,
        client: req.body.client,
        lineItems: req.body.lineItems,
      }, {
        include: [ {model: LineItem, as: "lineItems"} ]
      })
      .then(transaction => res.status(201).json(transaction))
      .catch(function (err) {
        next(err);
      });
  }

};
