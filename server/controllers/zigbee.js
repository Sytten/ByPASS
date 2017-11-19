var Account = require('../models').Account
var Item = require('../models').Item
var transaction_helper = require('../helpers/transaction_helper')

module.exports = {
  bridge: function(req, res, next) {
    try {
    	// METHOD 1
    	if(req.body.method == 1) {
    		var client_card = req.body.clientId;
    		var merchant_pin = req.body.merchantId;
    		var items_shortcuts = req.body.items;
    		var qty = req.body.qty;

        transaction_helper.create_zigbee_transaction(client_card, merchant_pin, items_shortcuts, qty)
        .then(function(client) {
          return res.status(200).json({id: req.body.id, status: true, solde: client.amount})
        }).catch(function (err) {
          console.log("ERROR : " + err.message)
          return res.status(200).json({id: req.body.id, status: false, solde: -1})
        });
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
    				return res.status(200).json({id: req.body.id, solde: client.amount});
    			}
    			else {
    				return res.status(400).json({ error: 20 });
    			}
    		}).catch(function (err) { next(err); });
    	}


      // METHOD 4 

      else if (req.body.method == 4) {

        var merchant_pin = req.body.merchantId
        var items_shortcuts = req.body.items
        var qty = req.body.qty

        return Account.findOne({where: {pin: merchant_pin}}).then(function(merchant) {
          if (!merchant) {
            console.log('Merchant does not exists');
            return res.status(400).json({ error: 20 });
          }

          return Item.findAll({
            where: {
              $and : {
                shortcut: items_shortcuts,
                merchant: merchant.id
              }
              
            }
          })
          .then((items) => {
            if (items_shortcuts.length != qty.length) {
              console.log('Items length does not match qty length');
              return res.status(400).json({ error: 20 });
            }

            if (items_shortcuts.length != items.length) {
              console.log('Some items shortcuts does not exists in the DB');
              return res.status(400).json({ error: 20 });
            }

            // calculate amount
            var amount = 0;
            for(i = 0; i < items.length; i++) {
              amount += items[i].price * qty[i];
            }

            return res.status(200).json({ id: req.body.id, total: amount });

         })
        }).catch(function (err) { next(err); });
      }



      // METHOD NOT HANDLED
    	else {
        console.log("ERROR method not found")
    		return res.status(400).json({ error: 0 });
    	}
    }
    catch(err) {
      console.log("ERROR in processing zigbee request")
      return res.status(400).json({ error: 0 });
    }
  }
};
