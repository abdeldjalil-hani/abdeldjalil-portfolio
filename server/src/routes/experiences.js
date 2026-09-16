const express = require('express');
const router = express.Router();
const experiences = require('../controllers/experiencesController');

router.get('/', experiences.listAll);

module.exports = router;