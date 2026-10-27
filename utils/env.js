require('dotenv').config();

// Centralized env access. Never log these values.
module.exports = {
  BASE_URL: process.env.BASE_URL,
  LOGIN_EMAIL: process.env.LOGIN_EMAIL,
  LOGIN_PASSWORD: process.env.LOGIN_PASSWORD,
};
