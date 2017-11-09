// models
var Transaction = require('../models').Transaction
var LineItem = require('../models').LineItem
var verify = require('../helpers/parameters');

module.exports = {
  list: function(req, res, next) {
    return Transaction.findAll({
      where: {
        $or: {
          merchant: req.params.id,
          client: req.params.id
        }
      }
    })
    .then(transactions => res.status(200).json(transactions))
    .catch(function (err) {
      next(err);
    });
  },

  create: function(req, res, next) {
    var merchant_  =req.body.merchant;
    var client_    =req.body.client;
    var lineItems_ =req.body.lineItems;
    verify.verifyParameter(merchant_,   'merchant');
    verify.verifyParameter(client_,     'client');
    verify.verifyParameter(LineItem,    'lineItems');

      // Merchant Exist?
    Accounts.find({ where: {id: merchant_} })
    .then(function(merchant){
       if(!merchant){
         returnMessage = 'Client:'+ merchant_+' do not exist';
         throw new InvalidTransaction(returnMessage);
        }

       // Client Exist?
       Accounts.find({ where: {id: client_} })
       .then(function(client){
       if(!client){
          returnMessage = 'Client:'+client_+' do not exist';
          throw new InvalidTransaction(returnMessage);
        }

       // All look fine... add it to DB
       return Transaction.create({
          merchant:  merchant_,
          client:    client_,
          lineItems: lineItems_,
        }, {
          include: [ {model: LineItem, as: "lineItems"} ]
        })
        .then(transaction => res.status(201).json(transaction))
        .catch(function (err) {
          next(err);
        });
      }).catch(function(err){
        next(err);
      })
    })
    .then(transaction => res.status(201).json({itemExist:itemExist, message:returnMessage}))
    .catch(function(err){
      next(err);
    })
  }
};
