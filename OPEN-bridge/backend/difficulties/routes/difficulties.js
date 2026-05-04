const express = require('express');
const difficultyController = require('../controllers/difficultyController');

const router = express.Router();

router.get('/', difficultyController.listDifficulties);

module.exports = router;
