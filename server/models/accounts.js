'use strict';
module.exports = function(sequelize, DataTypes) {
  var Accounts = sequelize.define('Accounts', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      name:   DataTypes.STRING,
      amount: DataTypes.DECIMAL,
      type:   DataTypes.STRING,
      card:   DataTypes.UUID
    },{
      createdAt: false,
      updatedAt: false,

      classMethods: {
        associate: function(models) {
          // associations can be defined here
        }
      }
    }
  );
  Accounts.prototype.getamount= function() {
    return this.amount;
  };
  Accounts.prototype.addAmmount= function(toAdd) {
    this.amount = this.amount+toAdd;
  };
  return Accounts;
};
