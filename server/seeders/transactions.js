'use strict';
/*
>> "db:seed --seed transactions.js"
OR 
>> "db:seed:all"
*/

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Transactions', [
        {
          id: "00FFFFFF-a308-41ac-870a-e2e7b44a59c9",
          client: "7a2b20bd-a308-41ac-870a-e2e7b44a59c9",
          merchant: "1a2b20bd-a308-41ac-870a-e2e7b44a59c9",
          createdAt: new Date()
        }

      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Transactions', null, {});
  }
};
