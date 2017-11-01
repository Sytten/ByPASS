var accounts = require('./controllers/accounts');
var items = require('./controllers/items');
var transactions = require('./controllers/transactions')
var express = require('express');
var router = express.Router();

// Accounts
router.post('/accounts/login', accounts.login);
router.get('/accounts/:id', accounts.getById);
router.get('/accounts', accounts.list);
router.post('/accounts', accounts.create);

// Items
router.post('/items', items.create);
router.get('/accounts/:id/items', items.list);

// Transactions
router.post('/transactions', transactions.create)
router.get('/accounts/:id/transactions', transactions.list)

module.exports = router;
