const express = require('express');
const router = express.Router();
const events = require('../controllers/eventsController');

router.get('/', events.listAll);
router.get('/:id', events.getOne);

module.exports = router;