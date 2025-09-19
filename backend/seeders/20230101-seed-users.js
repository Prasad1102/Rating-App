'use strict';
const bcrypt = require('bcrypt');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hash = async (pw) => await bcrypt.hash(pw, 10);
    await queryInterface.bulkInsert('Users', [
      {
        name: 'System Administrator User Name',
        email: 'admin@example.com',
        password: await hash('Admin@123'),
        address: 'Admin Address',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Store Owner User Name Here',
        email: 'owner@example.com',
        password: await hash('Owner@123'),
        address: 'Owner Address',
        role: 'OWNER',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Normal User Name For Testing',
        email: 'user@example.com',
        password: await hash('User@123'),
        address: 'User Address',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
