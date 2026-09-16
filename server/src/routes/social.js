const express = require('express');
const router = express.Router();
const social = require('../controllers/socialLinksController');

router.get('/', social.listAll);

module.exports = router;