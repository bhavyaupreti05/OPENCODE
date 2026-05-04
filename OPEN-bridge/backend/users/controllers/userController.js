const userService = require('../services/userService');
const { updateProfileSchema } = require('../validators/userValidators');

class UserController {
  async getProfile(req, res) {
    try {
      const userId = req.user._id;
      const user = await userService.getUserProfile(userId);

      res.json({
        success: true,
        data: {
          user
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateProfile(req, res) {
    try {
      // Validate input
      const { error, value } = updateProfileSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }

      const userId = req.user._id;
      const updateData = value;

      const user = await userService.updateUserProfile(userId, updateData);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new UserController();