var Users = require('../models').Users
var InvalidParameter = require('../exceptions/invalidParameter');

module.exports = {

  coordinates: function(username, callback) {
    return Users.find({
      where: {
          name: username
        }
      })
      .then(coordinates => {
        callback(null, coordinates);
      })
      .catch(function (err) {
        callback(new InvalidParameter('Invalid city : ' + username));
      })
  },

  get_users: function(req, res, next) {
    return Users.findAll({
      attributes: ['name']
    })
    .then(names => {
      var names_array = names.map(name => {
        return name.name;
      });
      res.status(200).json(names_array)
    })
    .catch(function (err) {
      next(err);
    });
  }
};
