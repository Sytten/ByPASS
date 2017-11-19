'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'Accounts',
        'card',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Accounts', 'card')
  }
};
