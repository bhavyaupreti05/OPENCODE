const problemsRoutes = require('./routes/problems');
const problemsController = require('./controllers/problemsController');

module.exports = {
  routes: problemsRoutes,
  controller: problemsController
};