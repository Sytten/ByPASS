'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.renameColumn('LineItems', 'transactionId', 'TransactionId')
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.renameColumn('LineItems', 'TransactionId', 'transactionId')
  }
};
