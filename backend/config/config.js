// backend/config/config.js
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || process.env.USER || 'postgres',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || (process.env.USER || 'postgres'),
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    dialect: 'postgres',
    logging: false
  },
  test: {
    username: process.env.DB_USER || process.env.USER || 'postgres',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME ? `${process.env.DB_NAME}_test` : `${process.env.USER || 'postgres'}_test`,
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    dialect: 'postgres',
    logging: false
  }
};
