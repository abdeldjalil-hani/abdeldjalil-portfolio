const { apiError, publicFileUrl } = require('../utils/apiError');
const config = require('../config/config');

/**
 * Handles single-file uploads. Route must be authenticated.
 * Expects a field named `file`. Success returns URL + relative path.
 */
function uploadFile(req, res, next) {
  try {
    if (!req.file) throw apiError(400, 'No file uploaded.');
    const file = req.file;
    const relativePath = `/uploads/${req.params.subdir}/${file.filename}`;
    res.status(201).json({
      url: publicFileUrl(relativePath),
      path: relativePath,
      mimetype: file.mimetype,
      size: file.size,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete an uploaded file. Body: { path } (relative path under /uploads/...)
 */
function deleteFile(req, res, next) {
  try {
    const fs = require('fs');
    const path = require('path');
    const { path: filePath } = req.body || {};
    if (!filePath || typeof filePath !== 'string') throw apiError(400, 'path is required.');
    if (!filePath.startsWith('/uploads/')) throw apiError(400, 'Invalid path.');

    const abs = path.join(config.uploads.directory, filePath.replace('/uploads/', ''));
    const base = path.resolve(config.uploads.directory);
    const resolved = path.resolve(abs);
    if (!resolved.startsWith(base)) throw apiError(400, 'Invalid path.');

    if (fs.existsSync(resolved)) {
      fs.unlinkSync(resolved);
    }
    res.json({ message: 'File deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadFile, deleteFile };