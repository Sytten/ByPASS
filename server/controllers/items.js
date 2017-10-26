var Items = require('../models').Items
var verify = require('../helpers/parameters');

module.exports = {
  list: function(req, res, next) {
    return Items.
      findAll({
        where: {
          merchant: req.params.id
        }
      })
      .then(items => res.status(200).json(items))
      .catch(function (err) {
        next(err);
      });
  },

  create: function(req, res, next) {
    verify.verifyParameter(req.body.merchant, 'merchant');
    verify.verifyParameter(req.body.shortcut, 'shortcut');
    verify.verifyParameter(req.body.description, 'description');
    verify.verifyParameter(req.body.price, 'price');

    return Items
      .create({
        merchant: req.body.merchant,
        shortcut: req.body.shortcut,
        description: req.body.description,
        price: req.body.price
      })
      .then(item => res.status(201).json(item))
      .catch(function (err) {
        next(err);
      });
  }

};
