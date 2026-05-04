const User = require('../../auth/models/User');

class UserService {
  async getUserProfile(userId) {
    const user = await User.findById(userId)
      .populate(['role', 'selectedStack', 'selectedSkill', 'selectedDifficulty'])
      .select('-passwordHash');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateUserProfile(userId, updateData) {
    // Prevent updating sensitive fields
    const allowedFields = ['experience'];
    const filteredData = {};

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      userId,
      filteredData,
      { new: true }
    ).populate(['role', 'selectedStack', 'selectedSkill', 'selectedDifficulty']);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

module.exports = new UserService();