var Accounts = require('../../models').Accounts
var InvalidAccount = require('../../exceptions/invalidAccount')
var Transactions = require('../../models').Transactions

module.exports = {
	transactions: function(req, res) {
	    res.render('student/transactions');
	},

	transactions_table: function(req, res) {
		Transactions.findAll({ 
			where: { 
				client: req.body.id
          	}
        }).then(transactions => {
        	var student_transactions = []
        	transactions.forEach(transaction => {
        		var itemId = transaction.item;
        		var merchartId = transaction.merchant;
        		var date = transaction.createdAt;
        		var price = transaction.price;

        		// add student transaction to his array of transaction
        		var student_transaction = {article: itemId, montant: price, destinataire: merchartId, date: date};
        		student_transactions.push(student_transaction);
        	}); 
      		res.render('student/parts/transactions_table', {
				transactions: student_transactions
			});
      	}).catch(() => next(new InvalidAccount(req.body.id)));
	},

	total: function(req, res) {
		Accounts.findById(req.body.id, {rejectOnEmpty: true}).then(account => {
			res.status(201).json({total: account.amount});
		})
		.catch(() => next(new InvalidAccount(req.body.id)));
	},
}