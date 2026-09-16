const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SocialLink = sequelize.define(
  'SocialLink',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    platform: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        isUrl(value) {
          if (!/^(https?:\/\/|mailto:)/i.test(String(value || ''))) {
            throw new Error('Please enter a valid http(s) or mailto URL.');
          }
        },
      },
    },
    username: {
      type: DataTypes.STRING(150),
      allowNull: true,
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
    isPublished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_published',
    },
  },
  {
    tableName: 'social_links',
    timestamps: true,
  }
);

module.exports = SocialLink;