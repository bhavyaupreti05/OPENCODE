const authRoutes = require('./routes/auth');
const authController = require('./controllers/authController');

module.exports = {
  routes: authRoutes,
  controller: authController
};