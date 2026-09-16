const express = require('express');
const router = express.Router();
const teaching = require('../controllers/teachingController');

router.get('/', teaching.listAll);

module.exports = router;