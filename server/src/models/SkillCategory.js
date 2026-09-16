const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SkillCategory = sequelize.define(
  'SkillCategory',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    icon: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'sort_order',
    },
  },
  {
    tableName: 'skill_categories',
    timestamps: true,
  }
);

module.exports = SkillCategory;