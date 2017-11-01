'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'Accounts',
        'password',
        {
          type: Sequelize.STRING
        }
      )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Accounts', 'password')
  }
};
