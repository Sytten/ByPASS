var Accounts = require('../../models').Accounts
var InvalidAccount = require('../../exceptions/invalidAccount')

module.exports = {
	transactions: function(req, res) {
	    res.render('student/transactions');
	},

	transactions_table: function(req, res) {
		res.render('student/parts/transactions_table');
	},

	total: function(req, res) {
		Accounts.findById(req.body.id, {rejectOnEmpty: true}).then(account => {
			res.status(201).json({total: account.amount});
		})
		.catch(() => next(new InvalidAccount(req.body.id)));
	},
}