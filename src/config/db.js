const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

console.log("🚨 DATABASE_URL at runtime:", process.env.DATABASE_URL);

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // for self-signed certs; adjust as needed
        },
      },
      logging: false,
    })
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: false,
    });

module.exports = { sequelize };
