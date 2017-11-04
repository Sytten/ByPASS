// models
var Account = require('../../models').Account
var Transaction = require('../../models').Transaction
var LineItem = require('../../models').LineItem
var Item = require('../../models').Item
// exceptions
var InvalidTransaction = require('../../exceptions/invalidTransaction')

// extensions
var dateFormat = require('dateformat');


module.exports = {
	transactions: function(req, res, next) {
	    res.render('student/transactions');
	},

	transactions_table: function(req, res, next) {
		Transaction.findAll({ 
			where: { 
				client: req.body.id
          	},
          	include: [{
          		model: LineItem,
          		as: "lineItems",
          		include: [{
          			model: Item,
          			as: "item",
          		}]
          	},
          	{
          		model: Account,
          		as: "marchand"
          	}
          	],
          	raw: true,
        }).then(transactions => {
        	var student_transactions = []

        	transactions.forEach(transaction => {
    			console.log(transaction)
    			var name = transaction['lineItems.item.name'];
    			var montant = transaction['lineItems.quantity'] * transaction['lineItems.item.price'];
    			var destinataire = transaction['marchand.name'];
    			var date = transaction.createdAt;

				var formatedDate = dateFormat(date, "yyyy/mm/dd");

    			var student_transaction = {article: name, montant: montant, destinataire: destinataire, date: formatedDate};
    			student_transactions.push(student_transaction);
        	});

    		res.render('student/parts/transactions_table', {
				transactions: student_transactions
			});
      	})
	},

	total: function(req, res, next) {
		Account.findById(req.body.id, {rejectOnEmpty: true}).then(account => {
			res.status(201).json({total: account.amount});
		})
		.catch(() => next(new InvalidAccount(req.body.id)));
	},
}