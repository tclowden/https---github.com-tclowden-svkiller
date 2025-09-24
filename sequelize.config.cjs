// sequelize.config.cjs
require('dotenv').config({ path: '.env.local' }); // <-- loads DATABASE_URL, etc.

/** @type {import('sequelize').Options} */
const common = {
  dialect: 'postgres',
  dialectOptions: {},
  logging: false,
};

module.exports = {
  development: {
    ...common,
    url: process.env.DATABASE_URL,
  },
  production: {
    ...common,
    url: process.env.DATABASE_URL,
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  },
};
