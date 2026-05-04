const onboardingService = require('../services/onboardingService');
const User = require('../../auth/models/User');

jest.mock('../../auth/models/User');

describe('OnboardingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should complete onboarding and return the updated user', async () => {
    const updatedUser = {
      _id: 'userId',
      onboardingCompleted: true,
      selectedStack: { name: 'JavaScript' },
      selectedSkill: { name: 'JavaScript Fundamentals' },
      selectedDifficulty: { name: 'beginner' },
      confidenceLevel: 'beginner',
      experience: 'I am just getting started'
    };

    User.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockResolvedValue(updatedUser)
    });

    const result = await onboardingService.completeOnboarding('userId', {
      stackId: 'stack1',
      skillId: 'skill1',
      difficultyId: 'diff1',
      confidenceLevel: 'beginner',
      experience: 'I am just getting started'
    });

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      'userId',
      {
        selectedStack: 'stack1',
        selectedSkill: 'skill1',
        selectedDifficulty: 'diff1',
        confidenceLevel: 'beginner',
        experience: 'I am just getting started',
        onboardingCompleted: true
      },
      { new: true }
    );
    expect(result).toBe(updatedUser);
  });

  it('should throw an error when the user is not found for onboarding update', async () => {
    User.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null)
    });

    await expect(
      onboardingService.completeOnboarding('missingUser', {
        stackId: 'stack1',
        skillId: 'skill1',
        difficultyId: 'diff1',
        confidenceLevel: 'confused',
        experience: 'I am unsure'
      })
    ).rejects.toThrow('User not found');
  });

  it('should return onboarding status data for a completed user', async () => {
    const user = {
      onboardingCompleted: true,
      selectedStack: { name: 'JavaScript' },
      selectedSkill: { name: 'JavaScript Fundamentals' },
      selectedDifficulty: { name: 'beginner' },
      confidenceLevel: 'beginner',
      experience: 'I have some exposure'
    };

    User.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(user)
      })
    });

    const result = await onboardingService.getOnboardingStatus('userId');

    expect(User.findById).toHaveBeenCalledWith('userId');
    expect(result.completed).toBe(true);
    expect(result.data.stack.name).toBe('JavaScript');
  });

  it('should throw an error when the user for onboarding status is not found', async () => {
    User.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      })
    });

    await expect(onboardingService.getOnboardingStatus('missingUser')).rejects.toThrow('User not found');
  });
});
