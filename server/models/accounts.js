'use strict';
var bcrypt = require('bcrypt');
module.exports = function(sequelize, DataTypes) {
  var Accounts = sequelize.define('Accounts', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name:   DataTypes.STRING,
      amount: DataTypes.DECIMAL,
      type:   DataTypes.STRING,
      card:   DataTypes.UUID
    },{
      hooks: {
        beforeCreate: (account) => {
          const salt = bcrypt.genSaltSync();
          account.password = bcrypt.hashSync(account.password, salt);
        }
      },
      createdAt: false,
      updatedAt: false,

      classMethods: {
        associate: function(models) {
          // associations can be defined here
        }
      }
    }
  );
  Accounts.prototype.validPassword= function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  return Accounts;
};
