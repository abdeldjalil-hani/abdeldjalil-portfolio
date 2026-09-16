const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Certification = sequelize.define(
  'Certification',
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
    credentialUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'credential_url',
    },
    description: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
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
    tableName: 'certifications',
    timestamps: true,
  }
);

module.exports = Certification;