const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }

  async createUser(userData) {
    const { email, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Get default role (normal)
    const defaultRole = await Role.findOne({ name: 'normal' });
    if (!defaultRole) {
      throw new Error('Default role not found. Please seed the database.');
    }

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      passwordHash: password, // Will be hashed by pre-save hook
      role: defaultRole._id
    });

    await user.save();
    await user.populate('role');

    return user;
  }

  async authenticateUser(email, password) {
    const user = await User.findOne({ email: email.toLowerCase() }).populate('role');
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    return user;
  }

  generateToken(user) {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role.name
    };

    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async getUserFromToken(token) {
    const decoded = this.verifyToken(token);
    const user = await User.findById(decoded.userId).populate('role');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = new AuthService();