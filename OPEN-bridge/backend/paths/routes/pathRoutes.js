const express = require('express');
const router = express.Router();
const pathController = require('../controllers/pathController');
const { validateGeneratePath } = require('../validators/pathValidators');
const authController = require('../../auth/controllers/authController');

// All routes require authentication
router.use(authController.authenticate);

// GET /api/paths - Get user's learning paths
router.get('/', pathController.getUserPaths);

// POST /api/paths/generate - Generate new learning path
router.post('/generate', (req, res, next) => {
  const { error } = validateGeneratePath(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  next();
}, pathController.generatePath);

// GET /api/paths/:id - Get specific learning path with nodes
router.get('/:id', pathController.getPath);

module.exports = router;