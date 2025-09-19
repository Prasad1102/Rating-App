'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Store, { foreignKey: 'ownerId', as: 'stores' });
      User.hasMany(models.Rating, { foreignKey: 'userId', as: 'ratings' });
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'USER', 'OWNER'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  });
  return User;
};
