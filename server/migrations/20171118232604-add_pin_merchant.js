'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
   	return queryInterface.addColumn('Accounts', 'pin', { type: Sequelize.INTEGER });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Accounts', 'pin')
  }
};
