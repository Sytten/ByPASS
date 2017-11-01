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
router.post('/student', studentController.transactions);

// merchant products page 
router.get('/merchant/products', merchantController.products);

// merchant sales page 
router.get('/merchant/sales', merchantController.sales);

module.exports = router;
