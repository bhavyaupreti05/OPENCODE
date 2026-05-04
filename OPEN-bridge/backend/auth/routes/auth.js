const express = require('express');
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to auth routes
router.use('/signup', authLimiter);
router.use('/login', authLimiter);

// Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

module.exports = router;