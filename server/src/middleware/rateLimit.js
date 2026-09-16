const rateLimit = require('express-rate-limit');
const config = require('../config/config');

function createLimiter({ windowMs, max, message, skipFailedRequests = false }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests,
    message: { message: message || 'Too many requests, please try again later.' },
  });
}

const loginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: config.rateLimit.login,
  message: 'Too many login attempts. Please try again in 15 minutes.',
});

const contactLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: config.rateLimit.contact,
  message: 'You have reached the message limit. Please try again later.',
});

module.exports = { loginLimiter, contactLimiter, createLimiter };