const express = require('express');
const router = express.Router();
const submissionsController = require('../controllers/submissionsController');
const {
  validateCreateSubmission,
  validateGetSubmissionsQuery,
  validateGetProblemSubmissionsQuery,
  validateGetRecentSubmissionsQuery
} = require('../validators/submissionValidators');

// All routes require authentication
// router.use(auth); // Temporarily commented out for testing

// Create a new submission
router.post('/', validateCreateSubmission, submissionsController.createSubmission);

// Get user's submissions with optional filters
router.get('/', validateGetSubmissionsQuery, submissionsController.getUserSubmissions);

// Get user's recent submissions
router.get('/recent', validateGetRecentSubmissionsQuery, submissionsController.getUserRecentSubmissions);

// Get user's submissions for a specific problem
router.get('/problem/:problemId', submissionsController.getUserSubmissionsForProblem);

// Get user's submission statistics
router.get('/stats', submissionsController.getSubmissionStats);

// Get all submissions for a problem (for leaderboard/contribution view)
router.get('/problem/:problemId/all', validateGetProblemSubmissionsQuery, submissionsController.getProblemSubmissions);

// Get a specific submission
router.get('/:id', submissionsController.getSubmission);

// Delete a submission (user can only delete their own)
router.delete('/:id', submissionsController.deleteSubmission);

// Admin routes (would need admin middleware)
// router.get('/admin/all', submissionsController.getAllSubmissions);

module.exports = router;