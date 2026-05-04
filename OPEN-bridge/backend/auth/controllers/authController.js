const authService = require('../services/authService');
const { signupSchema, loginSchema, refreshTokenSchema } = require('../validators/authValidators');

class AuthController {
  async signup(req, res) {
    try {
      // Validate input
      const { error, value } = signupSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }

      const { email, password } = value;

      // Create user
      const user = await authService.createUser({ email, password });

      // Generate token
      const token = authService.generateToken(user);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          user,
          token
        }
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async login(req, res) {
    try {
      // Validate input
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }

      const { email, password } = value;

      // Authenticate user
      const user = await authService.authenticateUser(email, password);

      // Generate token
      const token = authService.generateToken(user);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user,
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async refreshToken(req, res) {
    try {
      // Validate input
      const { error, value } = refreshTokenSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }

      const { token: oldToken } = value;

      // Verify old token and get user
      const user = await authService.getUserFromToken(oldToken);

      // Generate new token
      const newToken = authService.generateToken(user);

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          token: newToken
        }
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  }

  async logout(req, res) {
    // For stateless JWT, logout is handled client-side by removing token
    // In a production system, you might want to implement token blacklisting
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  }

  // Middleware to authenticate requests
  async authenticate(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Authorization token required'
        });
      }

      const token = authHeader.substring(7);
      const user = await authService.getUserFromToken(token);

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  }

  // Middleware to check roles
  authorize(roles) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!roles.includes(req.user.role.name)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }

      next();
    };
  }
}

module.exports = new AuthController();