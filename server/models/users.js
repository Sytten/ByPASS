'use strict';
module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define('Account', {
      UUID:   DataTypes.UUID,
      Name:   DataTypes.STRING,
      Amount: DataTypes.DECIMAL,
      Type:   DataTypes.STRING,
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
  
  console.log("USER Ok:",Users);
  return Users;
};