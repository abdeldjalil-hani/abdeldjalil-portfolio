const express = require('express');
const router = express.Router();
const { login, logout, me } = require('../controllers/authController');
const requireAuth = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimit');

router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

module.exports = router;