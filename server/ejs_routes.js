var express = require('express');
var router = express.Router();

// index page 
router.get('/', function(req, res) {
    res.render('login');
});

// login page 
router.get('/login', function(req, res) {
    res.render('login');
});


// student transactions page 
router.post('/student', function(req, res) {
	var user_id = req.body.id
    res.render('student/transactions', {
    	user_id: user_id
    });
});

// merchant products page 
router.get('/merchant/products', function(req, res) { // TODO change to a post
	var merchant_id = req.body.id
    res.render('merchant/products', {
    	merchant_id: merchant_id
    });
});


// merchant sales page 
router.get('/merchant/sales', function(req, res) { // TODO change to a post
	var merchant_id = req.body.id
    res.render('merchant/sales', {
    	merchant_id: merchant_id
    });
});

module.exports = router;
