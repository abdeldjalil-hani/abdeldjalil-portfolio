const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Teaching = sequelize.define(
  'Teaching',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    organization: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    audience: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    externalUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'external_url',
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_published',
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'sort_order',
    },
  },
  {
    tableName: 'teaching',
    timestamps: true,
  }
);

module.exports = Teaching;