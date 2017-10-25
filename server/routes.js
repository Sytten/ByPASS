var accounts = require('./controllers/accounts');
var express = require('express');
var router = express.Router();

// Accounts
router.get('/accounts/:id', accounts.getById)
router.get('/accounts', accounts.list);
router.post('/accounts', accounts.create);

module.exports = router;
