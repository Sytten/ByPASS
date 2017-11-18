var Account = require('../models').Account

module.exports = {
  bridge: function(req, res, next) {
  	if (req.body.method == 2) {
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
  				res.status(400).json({ error: 2 });
  			}
  		}).catch(function (err) {
            next(err);
		});
  	}
    

    res.status(400);
  }
};
