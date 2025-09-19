'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate(models) {
      Rating.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Rating.belongsTo(models.Store, { foreignKey: 'storeId', as: 'store' });
    }
  }
  Rating.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' }
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Stores', key: 'id' }
    },
    rating: {
      type: DataTypes.SMALLINT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Rating',
    tableName: 'Ratings'
  });
  return Rating;
};
