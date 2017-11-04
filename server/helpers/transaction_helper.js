// models
var Account = require('../models').Account
var Transaction = require('../models').Transaction
var LineItem = require('../models').LineItem
var Item = require('../models').Item

// returns all transactions containing the id_ in the client or merchant field and makes the correct joins to constructs line Items and items associated with the transaction
module.exports = {
  flatTransactionsById: function(id_) {
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
}
