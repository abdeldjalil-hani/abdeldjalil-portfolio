const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Skill = sequelize.define(
  'Skill',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'category_id',
      references: { model: 'skill_categories', key: 'id' },
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    // 0 = unspecified, 1..5 = proficiency level
    level: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 1, max: 5 },
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
    tableName: 'skills',
    timestamps: true,
  }
);

module.exports = Skill;