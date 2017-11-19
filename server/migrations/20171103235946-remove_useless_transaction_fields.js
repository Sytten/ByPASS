'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return [
    queryInterface.removeColumn('Transactions', 'item'),
    queryInterface.removeColumn('Transactions', 'quantity'),
    queryInterface.removeColumn('Transactions', 'price')
    ]
  },

  down: function(queryInterface, Sequelize) {
    return [
    queryInterface.addColumn('Transactions', 'item', {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "Items",
          keys: "id"
        }
    }),
    queryInterface.addColumn('Transactions', 'quantity', {
        allowNull: false,
        type: Sequelize.INTEGER
    }),
    queryInterface.addColumn('Transactions', 'price', {
        allowNull: false,
        type: Sequelize.DOUBLE
    })
    ]
  }
};
