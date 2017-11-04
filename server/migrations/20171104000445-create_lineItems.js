'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('LineItems', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      itemId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "Items",
          keys: "id"
        }
      },
      quantity: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      transactionId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "Transactions",
          keys: "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('LineItems');
  }
};
