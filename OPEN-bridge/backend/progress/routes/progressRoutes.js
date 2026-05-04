const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { validateCompleteNode } = require('../validators/progressValidators');
const authController = require('../../auth/controllers/authController');

// All routes require authentication
router.use(authController.authenticate);

// GET /api/progress - Get user's overall progress
router.get('/', progressController.getUserProgress);

// GET /api/progress/paths/:pathId - Get progress for specific path
router.get('/paths/:pathId', progressController.getPathProgress);

// GET /api/progress/paths/:pathId/completion - Get path completion percentage
router.get('/paths/:pathId/completion', progressController.getPathCompletion);

// GET /api/progress/paths/:pathId/next - Get next accessible node
router.get('/paths/:pathId/next', progressController.getNextNode);

// POST /api/progress/paths/:pathId/nodes/:nodeId/start - Start working on a node
router.post('/paths/:pathId/nodes/:nodeId/start', progressController.startNode);

// POST /api/progress/paths/:pathId/nodes/:nodeId/complete - Complete a node
router.post('/paths/:pathId/nodes/:nodeId/complete', (req, res, next) => {
  const { error } = validateCompleteNode(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  next();
}, progressController.completeNode);

// POST /api/progress/paths/:pathId/nodes/:nodeId/reset - Reset node progress
router.post('/paths/:pathId/nodes/:nodeId/reset', progressController.resetNodeProgress);

module.exports = router;