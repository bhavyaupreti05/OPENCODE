const Submission = require('./models/Submission');
const submissionsService = require('./services/submissionsService');
const submissionsController = require('./controllers/submissionsController');
const submissionsRoutes = require('./routes/submissions');
const submissionValidators = require('./validators/submissionValidators');

module.exports = {
  // Models
  Submission,

  // Services
  submissionsService,

  // Controllers
  submissionsController,

  // Routes
  routes: submissionsRoutes,

  // Validators
  submissionValidators
};