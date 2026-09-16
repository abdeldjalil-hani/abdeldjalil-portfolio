const { Sequelize } = require('sequelize');
const config = require('./config');

const dbConfig = config.database;

const sequelize = dbConfig.url
  ? new Sequelize(dbConfig.url, {
      dialect: 'mysql',
      logging: config.env === 'development' ? console.log : false,
      define: {
        underscored: true,
        freezeTableName: false,
      },
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    })
  : new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: 'mysql',
      logging: config.env === 'development' ? console.log : false,
      define: {
        underscored: true,
        freezeTableName: false,
      },
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });

module.exports = sequelize;