var Account = require('../../models').Account
var Item = require('../../models').Item
var dateFormat = require('dateformat');
var transaction_helper = require('../../helpers/transaction_helper')
var InvalidTransaction = require('../../exceptions/invalidTransaction')

module.exports = {
  products: function(req, res, next) {
    var merchant_id = req.body.id
    res.render('merchant/products', {
       merchant_id: merchant_id
    });
  },

  products_table: function(req, res, next) {
    Item.findAll({where : { $and: { merchant: req.body.id, display: 1 } }, raw: true}).then(items => {
      res.render('merchant/parts/products_table', {items: items});
    })
  },

  sales: function(req, res, next) {
    var merchant_id = req.body.id
    res.render('merchant/sales', {
       merchant_id: merchant_id
    });
  },

  sales_transactions: function(req, res, next) {
    transaction_helper.flatTransactionsById(req.body.id).then(transactions => {
      // format transactions
      var formatted_transactions = transactions.map(function (transaction) {
        return {
          article: transaction['lineItems.item.name'],
          units: transaction['lineItems.quantity'],
          somme: transaction['lineItems.quantity'] * transaction['lineItems.item.price'],
          client: transaction['client_t.name'],
          date: dateFormat(transaction.createdAt, "yyyy/mm/dd"),
        };
      });

      // render transaction table of a merchant
      res.render('merchant/parts/sales_table', {
        transactions: formatted_transactions
      });
    })
    .catch((error) => next(new InvalidTransaction(req.body.id, error))); 
  },

  sales_total: function(req, res, next) {
    transaction_helper.flatTransactionsById(req.body.id).then(transactions => {
      // compute sum of transactions
      var sum = transactions.reduce((current_sum, transaction) => current_sum + transaction['lineItems.quantity'] * transaction['lineItems.item.price'], 0);

      res.status(201).json({total: sum});
    })
    .catch((error) => next(new InvalidTransaction(req.body.id, error)));
  },
}
