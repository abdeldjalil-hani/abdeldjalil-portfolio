const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SiteSetting = sequelize.define(
  'SiteSetting',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(190),
      allowNull: false,
      unique: true,
      validate: { is: /^[a-z][a-z0-9_]*$/i },
    },
    value: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
  },
  {
    tableName: 'site_settings',
    timestamps: true,
  }
);

module.exports = SiteSetting;