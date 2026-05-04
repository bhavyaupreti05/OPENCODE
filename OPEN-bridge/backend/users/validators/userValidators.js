const Joi = require('joi');

const updateProfileSchema = Joi.object({
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),
  experience: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Experience description must be less than 500 characters'
    })
  // Add other profile fields as needed
});

module.exports = {
  updateProfileSchema
};