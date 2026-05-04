const Joi = require('joi');

const onboardingSchema = Joi.object({
  stackId: Joi.string()
    .required()
    .messages({
      'any.required': 'Tech stack selection is required'
    }),
  skillId: Joi.string()
    .required()
    .messages({
      'any.required': 'Skill domain selection is required'
    }),
  difficultyId: Joi.string()
    .required()
    .messages({
      'any.required': 'Difficulty level selection is required'
    }),
  confidenceLevel: Joi.string()
    .valid('beginner', 'confused', 'some_experience')
    .required()
    .messages({
      'any.only': 'Invalid confidence level',
      'any.required': 'Confidence level is required'
    }),
  experience: Joi.string()
    .max(500)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Experience description must be less than 500 characters'
    })
});

module.exports = {
  onboardingSchema
};