'use strict';
module.exports = function(sequelize, DataTypes) {
  var Items = sequelize.define('Items', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    merchant: DataTypes.UUID,
    shortcut: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    price: DataTypes.DOUBLE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Items;
};
