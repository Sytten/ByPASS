var db = require('../models/index.js')
var Accounts = require('../models').Accounts
var Items = require('../models').Items
var Transactions = require('../models').Transactions
var verify = require('../helpers/parameters');
var InvalidTransaction = require('../exceptions/invalidTransaction')
const uuidv4 = require('uuid/v4');

var itemExist;
var returnMessage;

async function isItemExist(id_) {
  return new Promise(resolve => {
   setTimeout(() => {
     Items.count({ where: {id: id_} })
     .then(count => {
       if (count == 0) {
         resolve(false);
       }else{
         resolve(true);
       }
     });
   }, 1);
 });
}

async function checkAllItems(items_){
  for(let i=0; i< items_.length ; i++){
    let result = await isItemExist(items_[i]);
    if(!result){
        console.log("Item not exist result")
        resolve(false);
    }
  }
  resolve(true);
}

module.exports = {
  list: function(req, res, next) {
    return Transactions.
      findAll({
        where: {
          $or: {
            merchant: req.params.id,
            client:   req.params.id
          }
        }
      })
      .then(transactions => res.status(200).json(transactions))
      .catch(function (err) {
        next(err);
      });
  },

  create:async function(req, res, next) {
    var merchant_  = req.body.merchant;
    var client_    =req.body.client;
    var items_     =req.body.items;
    var quantities_= req.body.quantities
    verify.verifyParameter(merchant_,   'merchant');
    verify.verifyParameter(client_,     'client');
    verify.verifyParameter(items_,      'item');
    verify.verifyParameter(quantities_, 'quantities');

    itemExist     = true;
    returnMessage = "Success";

    if(items_.length == quantities_.length){

      // Merchant Exist?
         await Accounts.find({ where: {id: merchant_} })
        .then(async function(merchant){
           if(!merchant){
             returnMessage = 'Client:'+ merchant_+' do not exist';
             throw new InvalidTransaction(returnMessage);
           }

           // Client Exist?
            await Accounts.find({ where: {id: client_} })
              .then(async function(client){
                if(!client){
                  returnMessage = 'Client:'+client_+' do not exist';
                  throw new InvalidTransaction(returnMessage);
                }

                for(let i=0; i< items_.length ; i++){
                  let result = await isItemExist(items_[i]);
                  if(!result){
                      returnMessage = 'Items:'+items_[i]+' do not exist';
                      throw new InvalidTransaction(returnMessage);
                  }
                }

                // All look fine... add it to DB
                var uuidbackup = uuidv4();
                for(var i=0; i< items_.length ; i++){
                  Transactions
                  .create({
                    id:       uuidbackup,
                    merchant: merchant_,
                    client:   client_,
                    item:     items_[i],
                    quantity: quantities_[i]
                  }).catch(function(err){
                    returnMessage = err;
                    res.status(201).json({itemExist:itemExist, message:returnMessage});
                     //next(err);
                  })
                }
              })
              .then(transaction => res.status(201).json({itemExist:itemExist, message:returnMessage}))
              .catch(function(err){
                next(err);
              })
         }).catch(function(err){
              next(err);
        })
    }else{
       throw new InvalidTransaction('Items array length != Quantities array length');
    }
  }
};
