
module.exports = {
	transactions: function(req, res) {
		var user_id = req.body.id
	    res.render('student/transactions', {
	    	user_id: user_id
	    });
	},
}