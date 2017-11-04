'use strict';
module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define('Item', {
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
  });

  return Item;
};
