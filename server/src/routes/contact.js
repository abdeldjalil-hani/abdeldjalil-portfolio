const express = require('express');
const router = express.Router();
const contact = require('../controllers/contactController');
const { contactLimiter } = require('../middleware/rateLimit');

router.post('/', contactLimiter, contact.create);

module.exports = router;