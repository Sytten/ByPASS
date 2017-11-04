'use strict';
module.exports = function(sequelize, DataTypes) {
  var Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    client:   DataTypes.UUID,
    merchant: DataTypes.UUID
  }, {
    updatedAt: false,

    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Transaction.hasMany(models.LineItem)
      }
    }
  });
  
  return Transaction;
};
