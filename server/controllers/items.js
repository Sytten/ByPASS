// models
var Item = require('../models').Item
var Account = require('../models').Account
var LineItem = require('../models').LineItem

var verify = require('../helpers/parameters');
var AddItemException = require('../exceptions/addItemException')

module.exports = {
  list: function(req, res, next) {
    return Item.
      findAll({
        where: {
          merchant: req.params.id
        }
      })
      .then(items => res.status(200).json(items))
      .catch(function(err){
        next(err);
      });
  },



  delete: function(req, res, next) {
    // Verify if one tranasaction is contains in lineItem
    verify.verifyParameter(req.params.id, 'Items id');
    LineItem.findOne({where: {name: req.body.name}})
    .then(count => {

      // No transaction for this item
      if (count == 0) {
        return Item.destroy({
          where: {
            id: req.params.id
          }
        }).then(affected => {
          res.redirect('/app/merchant/products')
        }).catch(error => {
          next(error)
        })

      // Transaction finded only merchant will be set off
      }else{
        Item.find({ where: {id: req.params.id} })
        .then(function(item) {
          item.updateAttributes({
            merchant: "undefined"
          })
        }).then(result => res.status(201).json(result))
        .catch(function (err) {
          next(err);
        });
      }
    }).catch(function (err) {
      next(err);
    });
  },

  create: function(req, res, next) {
    verify.verifyParameter(req.body.name, 'name');
    verify.verifyParameter(req.body.merchant, 'merchant');
    verify.verifyParameter(req.body.shortcut, 'shortcut');
    verify.verifyParameter(req.body.description, 'description');
    verify.verifyParameter(req.body.price, 'price');
    verify.verifyPrice(req.body.price);

    Account.find({ where: {id: req.body.merchant} })
      .then(function(user) {
        if (!user) {
          throw new AddItemException('Merchant:'+req.body.merchant+' do not exist');
        }else if(user.type != "MERCHANT"){
          throw new AddItemException('User:'+req.body.merchant+' is not a merchant');
        }else{
          return Item
            .create({
              merchant:    req.body.merchant,
              shortcut:    req.body.shortcut,
              name:        req.body.name,
              description: req.body.description,
              price:       req.body.price
            })
            .then(item => res.status(201).json(item))
            .catch(function(err){
              next(err);
            });
        }
      }).catch(function(err){
        next(err);
      });
  }
};
