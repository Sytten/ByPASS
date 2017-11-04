'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.renameColumn('LineItems', 'transactionId', 'TransactionId')
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.renameColumn('LineItems', 'TransactionId', 'transactionId')
  }
};
