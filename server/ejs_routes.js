var express = require('express');
var router = express.Router();

// index page 
router.get('/', function(req, res) {
    res.render('index');
});

// login page 
router.get('/login', function(req, res) {
    res.render('login');
});


// student transactions page 
router.get('/student', function(req, res) {
    res.render('student/transactions');
});

module.exports = router;
