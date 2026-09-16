const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Education = sequelize.define(
  'Education',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    degree: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    institution: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    field: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    startDate: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'end_date',
    },
    isCurrent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_current',
    },
    description: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'sort_order',
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_published',
    },
  },
  {
    tableName: 'education',
    timestamps: true,
  }
);

module.exports = Education;