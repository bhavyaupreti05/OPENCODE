const onboardingService = require('../services/onboardingService');
const { onboardingSchema } = require('../validators/onboardingValidators');

class OnboardingController {
  async submitOnboarding(req, res) {
    try {
      // Validate input
      const { error, value } = onboardingSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }

      const userId = req.user._id;
      const onboardingData = value;

      // Complete onboarding
      const user = await onboardingService.completeOnboarding(userId, onboardingData);

      res.json({
        success: true,
        message: 'Onboarding completed successfully',
        data: {
          user
        }
      });
    } catch (error) {
      console.error('Onboarding error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getOnboardingStatus(req, res) {
    try {
      const userId = req.user._id;
      const status = await onboardingService.getOnboardingStatus(userId);

      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      console.error('Get onboarding status error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new OnboardingController();