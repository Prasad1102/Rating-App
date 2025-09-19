'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Ratings', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      storeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Stores', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      rating: { type: Sequelize.SMALLINT, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') }
    });
    await queryInterface.addConstraint('Ratings', {
      fields: ['userId', 'storeId'],
      type: 'unique',
      name: 'unique_user_store_rating'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Ratings');
  }
};
