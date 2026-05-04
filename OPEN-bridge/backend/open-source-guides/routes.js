const express = require('express');
const router = express.Router();
const openSourceGuidesController = require('./controller');

// Public routes
router.get('/', openSourceGuidesController.getAllGuides);
router.get('/:id', openSourceGuidesController.getGuideById);
router.get('/language/:language', openSourceGuidesController.getGuidesByLanguage);
router.get('/difficulty/:difficulty', openSourceGuidesController.getGuidesByDifficulty);

// Admin routes (would be protected by auth middleware)
router.post('/', openSourceGuidesController.createGuide);
router.put('/:id', openSourceGuidesController.updateGuide);
router.delete('/:id', openSourceGuidesController.deleteGuide);

module.exports = router;