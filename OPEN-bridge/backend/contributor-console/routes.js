const express = require('express');
const router = express.Router();
const contributorConsoleController = require('./controller');

// All routes require admin/contributor authentication (middleware to be added later)
router.get('/analytics', contributorConsoleController.getAnalytics);
router.post('/guides', contributorConsoleController.manageGuide);
router.put('/guides', contributorConsoleController.manageGuide);
router.delete('/guides', contributorConsoleController.manageGuide);
router.get('/guides', contributorConsoleController.getAllGuides);
router.put('/proofs/:proofId/verify', contributorConsoleController.verifyProof);
router.get('/proofs', contributorConsoleController.getAllProofs);
router.get('/users', contributorConsoleController.getAllUsers);

module.exports = router;