const authService = require('../services/authService');
const User = require('../models/User');
const Role = require('../models/Role');

// Mock dependencies
jest.mock('../models/User');
jest.mock('../models/Role');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const mockUser = {
        _id: 'userId',
        email: 'test@example.com',
        role: 'roleId',
        save: jest.fn().mockResolvedValue(),
        populate: jest.fn().mockImplementation(function(field) {
          this.role = { name: 'normal' };
          return this;
        })
      };

      const mockRole = { _id: 'roleId', name: 'normal' };

      User.findOne.mockResolvedValue(null);
      Role.findOne.mockResolvedValue(mockRole);
      User.mockImplementation(() => mockUser);

      const result = await authService.createUser({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(result.role.name).toBe('normal');
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockUser.populate).toHaveBeenCalledWith('role');
    });

    it('should throw error if user already exists', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com' });

      await expect(authService.createUser({
        email: 'test@example.com',
        password: 'password123'
      })).rejects.toThrow('User with this email already exists');
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate user with valid credentials', async () => {
      const mockUser = {
        email: 'test@example.com',
        comparePassword: jest.fn().mockResolvedValue(true),
        populate: jest.fn().mockResolvedValue({
          email: 'test@example.com',
          role: { name: 'normal' }
        })
      };

      User.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUser)
      });

      const result = await authService.authenticateUser('test@example.com', 'password123');

      expect(result.email).toBe('test@example.com');
      expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
    });

    it('should throw error for invalid credentials', async () => {
      User.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await expect(authService.authenticateUser('test@example.com', 'wrongpassword'))
        .rejects.toThrow('Invalid credentials');
    });
  });
});