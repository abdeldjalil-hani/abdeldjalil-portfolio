const express = require('express');
const router = express.Router();
const settings = require('../controllers/settingsController');

router.get('/', settings.getPublicSettings);

module.exports = router;