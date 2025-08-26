const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, )
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: false,
    });

module.exports = { sequelize };
