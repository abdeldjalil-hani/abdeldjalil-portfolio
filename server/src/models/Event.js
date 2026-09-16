const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define(
  'Event',
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
    eventDate: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'event_date',
    },
    endDate: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'end_date',
    },
    location: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    fullDescription: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
      field: 'full_description',
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
    eventType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'event_type',
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_featured',
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
    tableName: 'events',
    timestamps: true,
  }
);

module.exports = Event;