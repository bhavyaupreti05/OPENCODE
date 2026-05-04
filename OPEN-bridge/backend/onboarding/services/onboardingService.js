const User = require('../../auth/models/User');

class OnboardingService {
  async completeOnboarding(userId, onboardingData) {
    const { stackId, skillId, difficultyId, confidenceLevel, experience } = onboardingData;

    // Update user with onboarding data
    const user = await User.findByIdAndUpdate(
      userId,
      {
        selectedStack: stackId,
        selectedSkill: skillId,
        selectedDifficulty: difficultyId,
        confidenceLevel,
        experience,
        onboardingCompleted: true
      },
      { new: true }
    ).populate(['selectedStack', 'selectedSkill', 'selectedDifficulty', 'role']);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async getOnboardingStatus(userId) {
    const user = await User.findById(userId)
      .populate(['selectedStack', 'selectedSkill', 'selectedDifficulty'])
      .select('onboardingCompleted selectedStack selectedSkill selectedDifficulty confidenceLevel experience');

    if (!user) {
      throw new Error('User not found');
    }

    return {
      completed: user.onboardingCompleted,
      data: user.onboardingCompleted ? {
        stack: user.selectedStack,
        skill: user.selectedSkill,
        difficulty: user.selectedDifficulty,
        confidenceLevel: user.confidenceLevel,
        experience: user.experience
      } : null
    };
  }
}

module.exports = new OnboardingService();