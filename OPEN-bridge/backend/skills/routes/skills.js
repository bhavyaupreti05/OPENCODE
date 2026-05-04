const express = require('express');
const skillController = require('../controllers/skillController');

const router = express.Router();

router.get('/', skillController.listSkills);
router.get('/stack/:stackId', skillController.listSkillsByStack);

module.exports = router;
