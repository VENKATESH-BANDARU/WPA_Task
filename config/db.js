const { Sequelize } = require('sequelize');
const config = require('./config'); // Assuming config is correctly defined

// Custom logging function
const customLogger = (msg) => {
  // Implement custom logging logic here, e.g., writing to a file
  console.log(`[Sequelize Query] ${msg}`);
};

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: config.development.dialect,
    logging: customLogger,
  }
);
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
