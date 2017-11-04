var express = require('express');
var router = express.Router();
var loginController = require('./controllers/ejs/login')
var studentController = require('./controllers/ejs/student')
var merchantController = require('./controllers/ejs/merchant')

// index page 
router.get('/', function(req, res) {
    res.redirect('/app/login')
});

// login page 
router.get('/login', loginController.login);

// student transactions page 
router.get('/student', studentController.transactions);
	// student parts
	router.post('/student/transactions_table', studentController.transactions_table);
	router.post('/student/total', studentController.total);

// merchant products page 
router.get('/merchant/products', merchantController.products);

// merchant sales page 
router.get('/merchant/sales', merchantController.sales);
	// merchant sales parts
	router.post('/merchant/sales/transactions', merchantController.sales_transactions);
	router.post('/merchant/sales/total', merchantController.sales_total);

module.exports = router;
