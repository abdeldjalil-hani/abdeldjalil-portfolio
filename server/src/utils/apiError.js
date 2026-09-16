const config = require('../config/config');

function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error.';

  if (status >= 500) {
    console.error('[error]', err);
  }

  if (res.headersSent) return next(err);
  res.status(status).json({ message });
}

function apiError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

/** Prefix a stored relative path with the public URL, used to build
 * absolute URLs for <img> and links from the client. */
function publicFileUrl(relativePath) {
  if (!relativePath) return null;
  if (/^https?:\/\//.test(relativePath)) return relativePath;
  if (relativePath.startsWith('/uploads/')) {
    return `${config.publicUrl}${relativePath}`;
  }
  return relativePath;
}

module.exports = { notFound, errorHandler, apiError, publicFileUrl };