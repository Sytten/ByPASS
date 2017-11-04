'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Transactions', 'item')
    queryInterface.removeColumn('Transactions', 'quantity')
    queryInterface.removeColumn('Transactions', 'price')
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Transactions', 'item')
    queryInterface.addColumn('Transactions', 'quantity')
    queryInterface.addColumn('Transactions', 'price')
  }
};
