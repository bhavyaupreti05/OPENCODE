const express = require('express');
const onboardingController = require('../controllers/onboardingController');
const authController = require('../../auth/controllers/authController');

const router = express.Router();

// All onboarding routes require authentication
router.use(authController.authenticate);

// Routes
router.post('/', onboardingController.submitOnboarding);
router.get('/status', onboardingController.getOnboardingStatus);

module.exports = router;