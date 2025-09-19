'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { type: Sequelize.STRING(60), allowNull: false },
      email: { type: Sequelize.STRING(120), allowNull: false, unique: true },
      password: { type: Sequelize.STRING(100), allowNull: false },
      address: { type: Sequelize.STRING(400), allowNull: false },
      role: { type: Sequelize.ENUM('ADMIN', 'USER', 'OWNER'), allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};
