'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Transactions', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      client: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "Accounts",
          keys: "id"
        }
      },
      merchant: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "Accounts",
          keys: "id"
        }
      },
      item: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "Items",
          keys: "id"
        }
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      price: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Transactions');
  }
};
