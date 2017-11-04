// models
var Account = require('../../models').Account
var Transaction = require('../../models').Transaction

// exceptions
var InvalidTransaction = require('../../exceptions/invalidTransaction')


module.exports = {
	transactions: function(req, res, next) {
	    res.render('student/transactions');
	},

	transactions_table: function(req, res, next) {
		Transaction.findAll({ 
			where: { 
				client: req.body.id
          	}
        }).then(transactions => {
        	var student_transactions = []
        	transactions.forEach(transaction => {
        		//var itemId = transaction.item;
        		//var merchartId = transaction.merchant;
        		//var date = transaction.createdAt;

        		// add student transaction to his array of transaction
        		var student_transaction = {article: "itemId", montant: 0, destinataire: "merchartId", date: "date"};
        		student_transactions.push(student_transaction);
        	}); 
      		res.render('student/parts/transactions_table', {
				transactions: student_transactions
			});
      	}).catch(() => next(new InvalidTransaction(req.body.id)));
	},

	total: function(req, res, next) {
		/*
		Account.findById(req.body.id, {rejectOnEmpty: true}).then(account => {
			res.status(201).json({total: account.amount});
		})

		.catch(() => next(new InvalidAccount(req.body.id)));
		*/
		res.status(201).json({total: 100});
	},
}