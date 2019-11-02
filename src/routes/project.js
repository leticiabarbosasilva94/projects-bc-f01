const express = require('express');
const router = express.Router();

const projectController = require('../controllers/projectController');

router.get('/', projectController.index);
router.post('/', projectController.create);
router.get('/:id', projectController.show);

module.exports = router;
