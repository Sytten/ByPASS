
module.exports = {
	transactions: function(req, res) {
	    res.render('student/transactions');
	},

	transactions_table: function(req, res) {
		res.render('student/parts/transactions_table');
	},
}