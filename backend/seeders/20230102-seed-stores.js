'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Owner id is 2 (from previous seeder)
    await queryInterface.bulkInsert('Stores', [
      {
        name: 'FreshMart Supermarket Store',
        email: 'freshmart@example.com',
        address: '123 Market Street',
        ownerId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Stores', null, {});
  }
};
