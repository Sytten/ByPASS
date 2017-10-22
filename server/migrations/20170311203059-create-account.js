'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Account', {
      UUID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.STRING
      },
      Name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      Amount: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      Type: {
        allowNull: false,
        type: Sequelize.STRING
      },
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Account');
  }
};
