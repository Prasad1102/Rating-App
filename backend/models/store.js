'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    static associate(models) {
      Store.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner' });
      Store.hasMany(models.Rating, { foreignKey: 'storeId', as: 'ratings' });
    }
  }
  Store.init({
    name: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: false
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'Users', key: 'id' }
    }
  }, {
    sequelize,
    modelName: 'Store',
    tableName: 'Stores'
  });
  return Store;
};
