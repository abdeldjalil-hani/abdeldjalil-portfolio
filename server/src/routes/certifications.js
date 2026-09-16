const express = require('express');
const router = express.Router();
const certifications = require('../controllers/certificationsController');

router.get('/', certifications.listAll);

module.exports = router;