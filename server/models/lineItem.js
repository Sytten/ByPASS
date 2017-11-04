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
    transactionId: DataTypes.UUID,
  },{
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        LineItem.hasOne(models.Item)
      }
    }
  });

  return LineItem;
};
