const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Publication = sequelize.define(
  'Publication',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    authors: {
      type: DataTypes.STRING(700),
      allowNull: false,
    },
    venue: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 1900, max: 2100 },
    },
    abstract: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    doi: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    pdfUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'pdf_url',
    },
    externalUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'external_url',
    },
    status: {
      type: DataTypes.ENUM('published', 'in_review', 'preprint', 'submitted'),
      allowNull: false,
      defaultValue: 'published',
    },
    tags: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
      get() {
        const raw = this.getDataValue('tags');
        if (!raw) return [];
        try {
          return JSON.parse(raw);
        } catch {
          return raw.split(',').map((t) => t.trim()).filter(Boolean);
        }
      },
      set(value) {
        this.setDataValue('tags', JSON.stringify(value || []));
      },
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
    tableName: 'publications',
    timestamps: true,
  }
);

module.exports = Publication;