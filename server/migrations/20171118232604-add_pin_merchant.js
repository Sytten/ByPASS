'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   	queryInterface.addColumn('Accounts', 'pin', { type: Sequelize.INTEGER });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Accounts', 'pin')
  }
};
