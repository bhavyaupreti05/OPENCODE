const express = require('express');
const router = express.Router();
const contributionProofController = require('../controllers/contributionProofController');
const {
  validateContributionProofPayload,
  validateVerifyProofPayload,
  validateProofIdParam
} = require('../validators/contributionProofValidators');

// All routes require authentication
// router.use(auth); // Placeholder until auth middleware is available

router.post('/', validateContributionProofPayload, contributionProofController.submitProof);
router.get('/', contributionProofController.getUserProofs);
router.put('/:id/verify', validateProofIdParam, validateVerifyProofPayload, contributionProofController.verifyProof);
router.get('/admin/all', contributionProofController.getAllProofs); // admin-only view

module.exports = router;