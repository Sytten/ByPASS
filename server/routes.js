var accounts = require('./controllers/accounts');
var zigbee = require('./controllers/zigbee');
var items = require('./controllers/items');
var transactions = require('./controllers/transactions')
var express = require('express');
var router = express.Router();

// Accounts
router.post('/accounts', accounts.create);
router.post('/accounts/login', accounts.login);
router.get('/accounts/:id', accounts.getById);
router.get('/accounts', accounts.list);
router.post('/accounts/refill', accounts.refill);

// Items
router.post('/items', items.create);
router.get('/items/:id', items.list); // To do
router.get('/items', items.listAll);

// Transactions
router.post('/transactions', transactions.create)
router.get('/accounts/transactions/:id', transactions.list)

// Zigbee
router.post('/zigbee/bridge', zigbee.bridge);

module.exports = router;
