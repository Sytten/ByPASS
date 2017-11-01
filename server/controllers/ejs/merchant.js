
module.exports = {
	products: function(req, res) {
		var merchant_id = req.body.id
	    res.render('merchant/products', {
	       merchant_id: merchant_id
	    });
	},

	sales: function(req, res) {
		var merchant_id = req.body.id
	    res.render('merchant/sales', {
	       merchant_id: merchant_id
	    });
	},
}
