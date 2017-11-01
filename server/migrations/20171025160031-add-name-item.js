'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'Items',
        'name',
        {
          type: Sequelize.STRING
        }
      )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Items', 'name')
  }
};
