'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Transactions','price');
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Transactions', 'price')
  }
};
