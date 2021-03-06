// models
var Account = require('../models').Account

// verifiers
var verify = require('../helpers/parameters');

// exceptions
var InvalidAccount = require('../exceptions/invalidAccount')
var UserExist = require('../exceptions/userExist')

module.exports = {
  create: function(req, res, next) {
    verify.verifyParameter(req.body.name, 'name');
    verify.verifyAccountTypeParameter(req.body.type, 'type');

    Account.count({ where: {name: req.body.name} })
      .then(count => {
        if (count != 0) {
          throw new UserExist('Username:'+req.body.name+' alreay exist');
        }else{
         return Account
             .create({
             name: req.body.name,
             type: req.body.type,
             amount: req.body.amount || 0.00,
             card: req.body.card || null
          })
          .then(account => res.status(201).json(account))
          .catch(function (err) {
            next(err);
          });
        }
      }).catch(function (err) {
      next(err);
    });
  },
  login: function(req, res, next) {
    return Account
      .findOne({where: {name: req.body.username}})
      .then(account => res.status(200).json({id: account.id}))
      .catch(() => next(new InvalidAccount(req.body.username)));
  },
  
  refill: function(req, res, next) {
    return Account
      .findById(req.body.id, {rejectOnEmpty: true})
      .then(account => {
        var toAdd = req.body.amount;
        account.addAmmount(toAdd);
        var newValue =  account.getamount()
    
        // Enough found ?
        if(newValue < 0){
          account.addAmmount(toAdd*-1);
          res.status(201).json({status: "Not enough money in the bank",
                                ammount: account.amount
                               });
        }else if (account) {
          account.updateAttributes({
            amount: newValue
          })
          res.status(201).json({status: "Succes",
                                ammount: account.amount
                               });
        }
      })
      .catch(() => next(new InvalidAccount(req.body.id)));
   },

  list: function(req, res, next) {
    return Account
    .findAll({})
    .then(accounts => res.status(200).json(accounts))
    .catch(function (err) {
      next(err);
    });
  },

  login: function(req, res, next) {
    return Account
      .findOne({where: {name: req.body.name}})
      .then(account => res.status(200).json({id: account.id, type: account.type}))
      .catch(() => next(new InvalidAccount(req.body.name)));
  },

  getById: function(req, res, next) {
    return Account
    .findById(req.params.id, {rejectOnEmpty: true})
    .then(account => res.status(200).json(account))
    .catch(() => next(new InvalidAccount(req.params.id)));
  }
};
