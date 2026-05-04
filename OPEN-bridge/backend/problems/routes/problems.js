const express = require('express');
const router = express.Router();
const problemsController = require('../controllers/problemsController');
const {
  validateProblemSubmission,
  validateProblemIdParam
} = require('../../submissions/validators/submissionValidators');
// const auth = require('../../auth/middleware/auth');

// All routes require authentication
// router.use(auth);

// Get all problems with optional filters
router.get('/', problemsController.getProblems);

// Get practice problems specifically
router.get('/practice', problemsController.getPracticeProblems);

// Get simulation problems specifically
router.get('/simulations', problemsController.getSimulationProblems);

// Search problems
router.get('/search', problemsController.searchProblems);

// Get problems by stack
router.get('/stack/:stackId', problemsController.getProblemsByStack);

// Get problems by skill
router.get('/skill/:skillId', problemsController.getProblemsBySkill);

// Get problems by difficulty
router.get('/difficulty/:difficultyId', problemsController.getProblemsByDifficulty);

// Get specific problem (public version without solution)
router.get('/:id', problemsController.getProblem);

// Submit solution for a problem
router.post('/:id/submit', validateProblemIdParam, validateProblemSubmission, problemsController.submitProblem);

// Get problem with solution (admin only - should add admin middleware)
router.get('/:id/solution', problemsController.getProblemWithSolution);

// Create problem (admin only)
router.post('/', problemsController.createProblem);

// Update problem (admin only)
router.put('/:id', problemsController.updateProblem);

// Delete problem (admin only)
router.delete('/:id', problemsController.deleteProblem);

module.exports = router;