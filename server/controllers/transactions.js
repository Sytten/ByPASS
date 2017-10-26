var Transactions = require('../models').Transactions
var verify = require('../helpers/parameters');

module.exports = {
  list: function(req, res, next) {
    return Transactions.
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

    //TODO: Change to accomodate multiple items and test the balance before

    return Transactions
      .create({
        merchant: req.body.merchant,
        client: req.body.client,
        item: req.body.item,
        quantity: req.body.quantity,
        price: req.body.price
      })
      .then(transaction => res.status(201).json(transaction))
      .catch(function (err) {
        next(err);
      });
  }

};
