'use strict';
module.exports = function(sequelize, DataTypes) {
  var Transactions = sequelize.define('Transactions', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    client:   DataTypes.UUID,
    merchant: DataTypes.UUID,
    item:     DataTypes.UUID,
    quantity: DataTypes.INTEGER.UNSIGNED,
    price:    DataTypes.DOUBLE.UNSIGNED
  }, {
    updatedAt: false,

    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Transactions;
};
