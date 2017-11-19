'use strict';
/*
>> "db:seed --seed lineItems.js"
OR 
>> "db:seed:all"
*/

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('LineItems', [
        {
          id: "01000000-a308-41ac-870a-e2e7b44a59c9",
          itemId: "AA2b20bd-a308-41ac-870a-e2e7b44a59c9",
          quantity: 3,
          TransactionId: "00FFFFFF-a308-41ac-870a-e2e7b44a59c9",
          createdAt: new Date(),
          updatedAt: new Date()
        }

      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('LineItems', null, {});
  }
};
