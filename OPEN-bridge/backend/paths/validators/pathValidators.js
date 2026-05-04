const Joi = require('joi');

const generatePathSchema = Joi.object({
  stackId: Joi.string().required().messages({
    'any.required': 'Tech stack selection is required'
  }),
  skillId: Joi.string().required().messages({
    'any.required': 'Skill domain selection is required'
  }),
  difficultyId: Joi.string().required().messages({
    'any.required': 'Difficulty level selection is required'
  })
});

const validateGeneratePath = (data) => {
  return generatePathSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateGeneratePath
};