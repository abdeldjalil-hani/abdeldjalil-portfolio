const express = require('express');
const router = express.Router();
const education = require('../controllers/educationController');

router.get('/', education.listAll);

module.exports = router;