const skillRoutes = require('./routes/skills');
const skillController = require('./controllers/skillController');

module.exports = {
  routes: skillRoutes,
  controller: skillController
};
