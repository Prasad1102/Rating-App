'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // userId: 3, storeId: 1
    await queryInterface.bulkInsert('Ratings', [
      {
        userId: 3,
        storeId: 1,
        rating: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Ratings', null, {});
  }
};
