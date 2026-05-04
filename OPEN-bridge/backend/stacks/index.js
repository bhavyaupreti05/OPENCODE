const stackRoutes = require('./routes/stacks');
const stackController = require('./controllers/stackController');

module.exports = {
  routes: stackRoutes,
  controller: stackController
};
