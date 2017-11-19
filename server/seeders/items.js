'use strict';
/*
>> "db:seed --seed items.js"
OR 
>> "db:seed:all"
*/

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Items', [
        {
            id: "AA2b20bd-a308-41ac-870a-e2e7b44a59c9",
            merchant: "1a2b20bd-a308-41ac-870a-e2e7b44a59c9",
            shortcut: 11,
            name: "Beer",
            description: "Awesome",
            price: 10.05,
            createdAt: new Date(),
            updatedAt: new Date()
        },


        {
            id: "AB2b20bd-a308-41ac-870a-e2e7b44a59c9",
            merchant: "1a2b20bd-a308-41ac-870a-e2e7b44a59c9",
            shortcut: 12,
            name: "Chicken",
            description: "Awesome",
            price: 7.99,
            createdAt: new Date(),
            updatedAt: new Date()
        },

        {
            id: "AC2b20bd-a308-41ac-870a-e2e7b44a59c9",
            merchant: "1a2b20bd-a308-41ac-870a-e2e7b44a59c9",
            shortcut: 14,
            name: "Nuggets",
            description: "Awesome",
            price: 8.05,
            createdAt: new Date(),
            updatedAt: new Date()
        },


        {
            id: "AD2b20bd-a308-41ac-870a-e2e7b44a59c9",
            merchant: "2a2b20bd-a308-41ac-870a-e2e7b44a59c9",
            shortcut: 20,
            name: "McNuggets",
            description: "Delicious",
            price: 6.99,
            createdAt: new Date(),
            updatedAt: new Date()
        }

      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Items', null, {});
  }
};
