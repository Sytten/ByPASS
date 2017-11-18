'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.changeColumn('Accounts', 'card', { 
      type: Sequelize.STRING,
      allowNull: true 
    });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.changeColumn('Accounts', 'card', { 
      type: Sequelize.UUID,
      allowNull: true 
    });
  }
};
