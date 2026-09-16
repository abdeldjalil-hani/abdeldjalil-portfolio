const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContactMessage = sequelize.define(
  'ContactMessage',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(190),
      allowNull: false,
      validate: { isEmail: true },
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_read',
    },
    ipAddress: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'ip_address',
    },
  },
  {
    tableName: 'contact_messages',
    timestamps: true,
  }
);

module.exports = ContactMessage;