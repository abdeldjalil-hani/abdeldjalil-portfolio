const express = require('express');
const router = express.Router();
const publications = require('../controllers/publicationsController');

router.get('/', publications.listAll);
router.get('/:id', publications.getOne);

module.exports = router;