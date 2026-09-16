const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const config = require('../config/config');

const uploadBase = path.resolve(config.uploads.directory);

function ensureUploadDir(subdir) {
  const dir = path.join(uploadBase, subdir);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const subdir = req.params.subdir || req.body.subdir || 'misc';
    cb(null, ensureUploadDir(subdir));
  },
  filename(req, file, cb) {
    const original = path.extname(file.originalname).toLowerCase().slice(0, 8);
    const ext = original.startsWith('.') ? original : '';
    const name = `${Date.now()}_${crypto.randomBytes(6).toString('hex')}${ext}`;
    cb(null, name);
  },
});

function fileFilter(req, file, cb) {
  const allowed = config.uploads.allowedTypes;
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('File type not allowed.'));
  }
  if (['.js', '.sh', '.exe', '.php', '.cgi', '.pl', '.py', '.rb', '.bat', '.cmd', '.bin', '.dll', '.so'].includes(ext)) {
    return cb(new Error('File extension not allowed.'));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.uploads.maxSizeMb * 1024 * 1024,
    files: 1,
  },
});

/**
 * Express error handler for multer / upload errors.
 */
function uploadErrorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  if (err) {
    const message = err.message || 'Upload failed.';
    if (message.includes('File too large')) {
      return res.status(413).json({ message: `File too large. Maximum size is ${config.uploads.maxSizeMb} MB.` });
    }
    return res.status(400).json({ message });
  }
  next();
}

module.exports = { upload, uploadErrorHandler, uploadBase, ensureUploadDir };