var Accounts = require('../models').Accounts
var InvalidAccount = require('../exceptions/invalidAccount')
var UserExist = require('../exceptions/userExist')
var verify = require('../helpers/parameters');

module.exports = {
  create: function(req, res, next) {
    verify.verifyParameter(req.body.name, 'name');
    verify.verifyAccountTypeParameter(req.body.type, 'type');

    Accounts.count({ where: {name: req.body.name} })
      .then(count => {
        if (count != 0) {
          throw new UserExist('Username:'+req.body.name+' alreay exist');
        }else{
         return Accounts
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
  
  login: function(req, res, next){
    var username = req.body.username,
      password = req.body.password;

      Accounts.findOne({ where: { username: username } }).then(function (user) {
      if (!user) {
        res.redirect('/login');
      }else if(!user.validPassword(password)) {
        res.redirect('/login');
      }else{
        req.session.user = user.dataValues;
        res.redirect('/dashboard');
      }
    });
  },
  
  list: function(req, res, next) {
    return Accounts
    .findAll({})
    .then(accounts => res.status(200).json(accounts))
    .catch(function (err) {
      next(err);
    });
  },

  getById: function(req, res, next) {
    return Accounts
    .findById(req.params.id, {rejectOnEmpty: true})
    .then(account => res.status(200).json(account))
    .catch(() => next(new InvalidAccount(req.params.id)));
  }
};
