// models
var Account = require('../models').Account
var Transaction = require('../models').Transaction
var LineItem = require('../models').LineItem
var Item = require('../models').Item
var db = require('../models/index')

// returns all transactions containing the id_ in the client or merchant field and makes the correct joins to constructs line Items and items associated with the transaction

flatTransactionsById = function(id_) {
  return Transaction.findAll({ 
    where: { 
      $or: {
        merchant: id_,
        client: id_
      }
    },

    include: [{
      model: LineItem,
      as: "lineItems",
      include: [{
        model: Item,
        as: "item",
      }]
    },
    {
      model: Account,
      as: "marchand"
    },
    {
      model: Account,
      as: "client_t"
    }],

    raw: true,
    
    });
}

create_transaction = function(merchant_id, client_id, lineItems, amount) {

  // make sure to return all the premises
  return db.sequelize.transaction(function (t) {

    // create transaction
    return Transaction.create({
      merchant:  merchant_id,
      client:    client_id,
      lineItems: lineItems,
    }, {
      include: [ {model: LineItem, as: "lineItems"} ],
      transaction: t
    })
    .then(function(transaction) {

      // debit transaction amount from client account
      return Account.findById(client_id, {transaction: t}).then(function (client) {
        if (client.amount < amount) {
          throw new Error('Not enough money');
        }
        else {
          client.amount = client.amount - amount;
          return client.save({transaction: t}).then(function() {
            return Account.findById(merchant_id, {transaction: t}).then(function (merchant) {

              merchant.amount = +merchant.amount + +amount;
              return merchant.save().then(() => {
                // javascript c'est un gros hack donc je retourne client ici. À fix un jour.
                return client; // it is important to return client at the end of create_transaction
              });
            });
          });
        }
      })

    });

  }).then(function (result) {
    // Transaction has been committed
    return result
  })

}

create_zigbee_transaction = function(client_card, merchant_pin, items_shortcuts, qty) {
  
  

  // Merchant Exist?
  return Account.find({ where: {pin: merchant_pin} })
  .then(function(merchant){
    if(!merchant){
      throw new Error('Merchant does not exists');
    }

    // Client Exist?
    return Account.find({ where: {card: client_card} })
    .then(function(client){
      if(!client){
        throw new Error('Client does not exists');
      }

      return Item.findAll({ 
        where: {
          shortcut: items_shortcuts
        }
      }).then((items) => {
        if (items_shortcuts.length != qty.length) {
          throw new Error('Items length does not match qty length');
        }

        if (items_shortcuts.length != items.length) {
          throw new Error('Some items shortcuts does not exists in the DB');
        }

        // calculate amount
        var amount = 0;
        for(i = 0; i < items.length; i++) {
          amount += items[i].price * qty[i];
        }

        // create line items for the transaction
        var lineItems = [];
        for(i = 0; i < items.length; i++) {
          lineItems.push({
            itemId: items[i].id,
            quantity: qty[i]
          })
        }

        return create_transaction(merchant.id, client.id, lineItems, amount)
      });
    });
  });

}

module.exports = {
  flatTransactionsById: flatTransactionsById,
  create_zigbee_transaction: create_zigbee_transaction,
  create_transaction: create_transaction
}

