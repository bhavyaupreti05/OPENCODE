const difficultyRoutes = require('./routes/difficulties');
const difficultyController = require('./controllers/difficultyController');

module.exports = {
  routes: difficultyRoutes,
  controller: difficultyController
};
