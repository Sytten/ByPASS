'use strict';
/*
>> "db:seed --seed accounts.js"
OR 
>> "db:seed:all"
*/

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Accounts', [
        {
          id: "7a2b20bd-a308-41ac-870a-e2e7b44a59c9",
          name: "girp2705",
          amount: 1200,
          type: "CUSTOMER",
          card: "0123456789"
        },

        {
          id: "aaaa20bd-a308-41ac-870a-e2e7b44a59c9",
          name: "fuge2701",
          amount: 1200,
          type: "CUSTOMER",
          card: "1919af35"
        },

        {
          id: "1a2b20bd-a308-41ac-870a-e2e7b44a59c9",
          name: "merc2020",
          amount: 0,
          type: "MERCHANT",
          pin: 6969
        },

        {
          id: "2a2b20bd-a308-41ac-870a-e2e7b44a59c9",
          name: "mcdo1010",
          amount: 0,
          type: "MERCHANT",
          pin: 4411
        }

      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Accounts', null, {});
  }
};
