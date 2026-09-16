const express = require('express');
const router = express.Router();
const projects = require('../controllers/projectsController');

router.get('/', projects.listAll);
router.get('/:id', projects.getOne);

module.exports = router;