var accounts = require('./controllers/accounts');
var express = require('express');
var router = express.Router();

// Accounts
router.get('/accounts', accounts.get_accounts);
router.post('/accounts', accounts.create);

module.exports = router;
