const Joi = require('joi');

const completeNodeSchema = Joi.object({
  score: Joi.number().min(0).max(100).optional().messages({
    'number.min': 'Score must be between 0 and 100',
    'number.max': 'Score must be between 0 and 100'
  }),
  timeSpent: Joi.number().min(0).optional().messages({
    'number.min': 'Time spent must be positive'
  }),
  notes: Joi.string().max(1000).optional().messages({
    'string.max': 'Notes cannot exceed 1000 characters'
  })
});

const validateCompleteNode = (data) => {
  return completeNodeSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateCompleteNode
};