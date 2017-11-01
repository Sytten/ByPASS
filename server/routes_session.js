var accounts = require('./controllers/accounts');
var items = require('./controllers/items');
var transactions = require('./controllers/transactions')
var express = require('express');
var router = express.Router();

// middleware function to check for logged-in accounts
var sessionChecker = (req, res, next) => {
    if (req.session.account && req.cookies.account_sid) {
        res.redirect('/dashboard');
    }else{
        next();
    }
};

router.post('/signup', accounts.create);
router.post('/login', accounts.login);

router.route('/signup')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/signup.html');
    });


// route for account Login
router.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/login.html');
    });


// route for account's dashboard
router.get('/dashboard', (req, res) => {
    console.log(req);
    if (req.session.account && req.cookies.account_sid) {
        res.sendFile(__dirname + '/public/dashboard.html');
    } else {
        res.redirect('/login');
    }
});


// route for account logout
router.get('/logout', (req, res) => {
    if (req.session.account && req.cookies.account_sid) {
        res.clearCookie('account_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});
module.exports = router;
