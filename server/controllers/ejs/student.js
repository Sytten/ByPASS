var Account = require('../../models').Account
var dateFormat = require('dateformat');
var transaction_helper = require('../../helpers/transaction_helper')
var InvalidTransaction = require('../../exceptions/invalidTransaction')

module.exports = {
  transactions: function(req, res, next) {
    res.render('student/transactions');
  },

  transactions_table: function(req, res, next) {
    transaction_helper.flatTransactionsById(req.body.id).then(transactions => {
      // format transactions
      var formatted_transactions = transactions.map(function (transaction) {
        return {
          article: transaction['lineItems.item.name'],
          montant: transaction['lineItems.quantity'] * transaction['lineItems.item.price'],
          destinataire: transaction['marchand.name'],
          date: dateFormat(transaction.createdAt, "yyyy/mm/dd"),
        };
      });

      // render transaction table of a student
      res.render('student/parts/transactions_table', {
        transactions: formatted_transactions
      });
    })
    .catch((error) => next(new InvalidTransaction(req.body.id, error)));
  },

  total: function(req, res, next) {
    Account.findById(req.body.id, {rejectOnEmpty: true}).then(account => {
      res.status(201).json({total: account.amount});
    })
    .catch(() => next(new InvalidAccount(req.body.id)));
  },
}
