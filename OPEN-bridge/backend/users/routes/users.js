const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../../auth/controllers/authController');

const router = express.Router();

// All user routes require authentication
router.use(authController.authenticate);

// Routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

module.exports = router;