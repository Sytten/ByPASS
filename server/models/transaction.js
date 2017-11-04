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
  });

  Transaction.associate = function (models) {
    Transaction.hasMany(models.LineItem, { as: "lineItems"})
    Transaction.belongsTo(models.Account, {foreignKey: "merchant", targetKey: "id", as: "marchand"})
  }
  return Transaction;
};
