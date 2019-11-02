const express = require('express');
const router = express.Router();

const projectController = require('../controllers/projectController');

router.get('/', projectController.index);
router.post('/', projectController.create);
router.get('/:id', projectController.show);
router.delete('/:id', projectController.delete);
router.put('/:id', projectController.update);

module.exports = router;
