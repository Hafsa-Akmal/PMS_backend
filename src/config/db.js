const { Sequelize } = require('sequelize');

// Load env only locally
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

console.log("🚨 DATABASE_URL at runtime:", process.env.DATABASE_URL);

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
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
