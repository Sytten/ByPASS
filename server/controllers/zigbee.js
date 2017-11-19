var Account = require('../models').Account
var Item = require('../models').Item
var Transaction = require('../models').Transaction
var LineItem = require('../models').LineItem

module.exports = {
  bridge: function(req, res, next) {

  	// METHOD 1
  	if(req.body.method == 1) {
  		var client_card = req.body.clientId;
  		var merchant_pin = req.body.merchantId;
  		var items_shortcuts = req.body.items;
  		var qty = req.body.qty;

      if (items_shortcuts.length != qty.length) {
        return res.status(200).json({id: req.body.id, status: false, solde: -1})
      }

  		// Merchant Exist?
    	Account.find({ where: {pin: merchant_pin} })
      .then(function(merchant){
        if(!merchant){
          return res.status(200).json({id: req.body.id, status: false, solde: -1})
        }

       // Client Exist?
        Account.find({ where: {card: client_card} })
        .then(function(client){
          if(!client){
            return res.status(200).json({id: req.body.id, status: false, solde: -1})
          }

          Item.findAll({ 
            where: {
              shortcut: items_shortcuts
            }
          }).then((items) => {
            if (items_shortcuts.length != items.length) {
              return res.status(200).json({id: req.body.id, status: false, solde: -1})
            }

            var amount = 0;
            for(i = 0; i < items.length; i++) {
              amount += items[i].price * qty[i];
            }

            // TODO subtract the amount from the account

            // create line items for the transaction
            var lineItems = [];
            for(i = 0; i < items.length; i++) {
              lineItems.push({
                itemId: items[i].id,
                quantity: qty[i]
              })
            }

            Transaction.create({
              merchant:  merchant.id,
              client:    client.id,
              lineItems: lineItems,
            }, {
              include: [ {model: LineItem, as: "lineItems"} ]
            })
            .then(transaction => {
              // calculate the amount of the transaction

              res.status(200).json({id: req.body.id, status: true, solde: amount})
            })
            .catch(function (err) {
              next(err);
            });
          }).catch(function (err) { next(err); });
        }).catch(function (err) { next(err); });
      }).catch(function (err) { next(err); });
  	}


    // METHOD 2
  	else if (req.body.method == 2) {
  		var client_card = req.body.clientId;
  		Account.findOne({
  			where: {
  				card: client_card
  			}
  		}).then((client) => {
  			if(client) {
  				res.status(200).json({id: req.body.id, solde: client.amount});
  			}
  			else {
  				res.status(400).json({ error: 20 });
  			}
  		}).catch(function (err) {
            next(err);
		});
  	}


    // METHOD NOT HANDLED
  	else {
  		return res.status(400).json({ error: 0 });
  	}
  }
};
