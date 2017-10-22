var controller = require('../controllers/users');
var express = require('express');
var router = express.Router();

router.get('/users', controller.get_users);
module.exports = router;
