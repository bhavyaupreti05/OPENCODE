const express = require('express');
const stackController = require('../controllers/stackController');

const router = express.Router();

router.get('/', stackController.listStacks);
router.get('/:id/skills', stackController.listStackSkills);

module.exports = router;
