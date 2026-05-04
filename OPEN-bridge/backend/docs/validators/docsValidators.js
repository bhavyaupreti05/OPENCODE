const Joi = require('joi');

const createDocSchema = Joi.object({
  title: Joi.string().min(3).max(200).required().messages({
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title cannot exceed 200 characters',
    'any.required': 'Title is required'
  }),
  content: Joi.string().min(10).required().messages({
    'string.min': 'Content must be at least 10 characters long',
    'any.required': 'Content is required'
  }),
  summary: Joi.string().min(10).max(500).required().messages({
    'string.min': 'Summary must be at least 10 characters long',
    'string.max': 'Summary cannot exceed 500 characters',
    'any.required': 'Summary is required'
  }),
  stackId: Joi.string().required().messages({
    'any.required': 'Tech stack is required'
  }),
  skillId: Joi.string().optional(),
  difficultyId: Joi.string().required().messages({
    'any.required': 'Difficulty level is required'
  }),
  contentType: Joi.string().valid('guide', 'tutorial', 'reference', 'concept').required().messages({
    'any.only': 'Content type must be one of: guide, tutorial, reference, concept',
    'any.required': 'Content type is required'
  }),
  tags: Joi.array().items(Joi.string()).optional(),
  order: Joi.number().min(0).optional(),
  estimatedReadTime: Joi.number().min(1).max(300).required().messages({
    'number.min': 'Estimated read time must be at least 1 minute',
    'number.max': 'Estimated read time cannot exceed 300 minutes',
    'any.required': 'Estimated read time is required'
  })
});

const updateDocSchema = Joi.object({
  title: Joi.string().min(3).max(200).optional(),
  content: Joi.string().min(10).optional(),
  summary: Joi.string().min(10).max(500).optional(),
  stackId: Joi.string().optional(),
  skillId: Joi.string().optional(),
  difficultyId: Joi.string().optional(),
  contentType: Joi.string().valid('guide', 'tutorial', 'reference', 'concept').optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  order: Joi.number().min(0).optional(),
  estimatedReadTime: Joi.number().min(1).max(300).optional(),
  isPublished: Joi.boolean().optional()
});

const validateCreateDoc = (data) => {
  return createDocSchema.validate(data, { abortEarly: false });
};

const validateUpdateDoc = (data) => {
  return updateDocSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateCreateDoc,
  validateUpdateDoc
};