'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
   	queryInterface.addColumn('Accounts', 'pin', { type: Sequelize.INTEGER });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Accounts', 'pin')
  }
};
