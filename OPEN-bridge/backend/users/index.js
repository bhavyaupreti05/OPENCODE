const userRoutes = require('./routes/users');
const userController = require('./controllers/userController');

module.exports = {
  routes: userRoutes,
  controller: userController
};