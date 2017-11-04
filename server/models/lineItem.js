'use strict';
module.exports = function(sequelize, DataTypes) {
  var LineItem = sequelize.define('LineItem', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    itemId:        DataTypes.UUID,
    quantity:      DataTypes.DOUBLE,
    TransactionId: DataTypes.UUID,
  });

  LineItem.associate = function (models) {
    LineItem.belongsTo(models.Item, { as: "item"})
  }

  return LineItem;
};
