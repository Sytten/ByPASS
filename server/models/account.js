'use strict';
module.exports = function(sequelize, DataTypes) {
  var Account = sequelize.define('Account', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      name:   DataTypes.STRING,
      amount: DataTypes.DECIMAL,
      type:   DataTypes.STRING,
      card:   DataTypes.STRING,
      pin:   DataTypes.INTEGER
    },{
      createdAt: false,
      updatedAt: false,
    }
  );
  Account.prototype.getamount = function() {
    return this.amount;
  };
  Account.prototype.addAmmount= function(toAdd) {
    this.amount = this.amount + toAdd;
  };
  return Account;
};
