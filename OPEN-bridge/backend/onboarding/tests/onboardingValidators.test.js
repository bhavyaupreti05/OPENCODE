const { onboardingSchema } = require('../validators/onboardingValidators');

describe('Onboarding validation', () => {
  test('valid onboarding request passes validation', () => {
    const { error } = onboardingSchema.validate({
      stackId: 'stack1',
      skillId: 'skill1',
      difficultyId: 'diff1',
      confidenceLevel: 'beginner',
      experience: 'I have read a few tutorials.'
    });

    expect(error).toBeUndefined();
  });

  test('onboarding validation fails when required fields are missing', () => {
    const { error } = onboardingSchema.validate({
      stackId: 'stack1',
      skillId: 'skill1'
    });

    expect(error).toBeDefined();
    expect(error.details[0].message).toContain('Difficulty level selection is required');
  });

  test('onboarding validation fails for invalid confidence level', () => {
    const { error } = onboardingSchema.validate({
      stackId: 'stack1',
      skillId: 'skill1',
      difficultyId: 'diff1',
      confidenceLevel: 'expert'
    });

    expect(error).toBeDefined();
    expect(error.details[0].message).toContain('Invalid confidence level');
  });
});
