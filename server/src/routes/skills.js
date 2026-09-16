const express = require('express');
const router = express.Router();
const skills = require('../controllers/skillsController');

router.get('/', skills.listAll);

module.exports = router;