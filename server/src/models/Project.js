const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define(
  'Project',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(210),
      allowNull: false,
      unique: true,
    },
    shortDescription: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'short_description',
    },
    description: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    images: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
      get() {
        const raw = this.getDataValue('images');
        if (!raw) return [];
        try {
          return JSON.parse(raw);
        } catch {
          return raw ? raw.split(',').map((u) => u.trim()).filter(Boolean) : [];
        }
      },
      set(value) {
        this.setDataValue('images', JSON.stringify(value || []));
      },
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
    githubUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'github_url',
    },
    demoUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'demo_url',
    },
    publicationUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'publication_url',
    },
    category: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    categories: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
      get() {
        const raw = this.getDataValue('categories');
        if (!raw) return [];
        try {
          return JSON.parse(raw);
        } catch {
          return raw.split(',').map((c) => c.trim()).filter(Boolean);
        }
      },
      set(value) {
        this.setDataValue('categories', JSON.stringify(value || []));
      },
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_published',
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_featured',
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'sort_order',
    },
  },
  {
    tableName: 'projects',
    timestamps: true,
  }
);

module.exports = Project;