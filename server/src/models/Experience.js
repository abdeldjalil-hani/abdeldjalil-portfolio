const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Experience = sequelize.define(
  'Experience',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    position: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    organization: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(255),
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
    technologies: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
      get() {
        const raw = this.getDataValue('technologies');
        if (!raw) return [];
        try {
          return JSON.parse(raw);
        } catch {
          return raw.split(',').map((t) => t.trim()).filter(Boolean);
        }
      },
      set(value) {
        this.setDataValue('technologies', JSON.stringify(value || []));
      },
    },
    type: {
      type: DataTypes.ENUM('research', 'teaching', 'internship', 'professional', 'volunteer', 'other'),
      allowNull: false,
      defaultValue: 'professional',
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
    tableName: 'experiences',
    timestamps: true,
  }
);

module.exports = Experience;