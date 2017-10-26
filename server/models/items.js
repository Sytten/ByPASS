'use strict';
module.exports = function(sequelize, DataTypes) {
  var Items = sequelize.define('Items', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    merchant:    DataTypes.UUID,
    shortcut:    DataTypes.INTEGER,
    name:        DataTypes.STRING,
    description: DataTypes.TEXT,
    price:       DataTypes.DOUBLE.UNSIGNED
  },{
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Items;
};
