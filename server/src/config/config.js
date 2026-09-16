require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,

  siteUrl: process.env.SITE_URL || 'http://localhost:5000',
  publicUrl: process.env.PUBLIC_URL || 'http://localhost:5000',

  jwt: {
    secret: process.env.JWT_SECRET || 'dev_secret_change_me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  cookie: {
    name: process.env.COOKIE_NAME || 'ah_portfolio_token',
    secure: process.env.COOKIE_SECURE === 'true',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },

  rateLimit: {
    login: parseInt(process.env.RATE_LIMIT_LOGIN, 10) || 50,
    contact: parseInt(process.env.RATE_LIMIT_CONTACT, 10) || 20,
  },

  uploads: {
    maxSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 5,
    directory: require('path').join(__dirname, '..', 'uploads'),
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'application/pdf',
    ],
  },

  database: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    name: process.env.DB_NAME || 'portfolio_db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    url: process.env.DATABASE_URL || null,
  },
};