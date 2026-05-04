const Joi = require('joi');

const createGuideSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Guide name is required',
      'string.max': 'Guide name must be less than 100 characters'
    }),

  description: Joi.string()
    .min(1)
    .max(500)
    .required()
    .messages({
      'string.empty': 'Description is required',
      'string.max': 'Description must be less than 500 characters'
    }),

  repositoryUrl: Joi.string()
    .pattern(/^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+\/?$/)
    .required()
    .messages({
      'string.pattern.base': 'Repository URL must be a valid GitHub URL'
    }),

  language: Joi.string()
    .valid('JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Other')
    .required()
    .messages({
      'any.only': 'Language must be one of: JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, PHP, Ruby, Other'
    }),

  difficulty: Joi.string()
    .valid('Beginner', 'Intermediate', 'Advanced')
    .default('Beginner')
    .messages({
      'any.only': 'Difficulty must be one of: Beginner, Intermediate, Advanced'
    }),

  contributionGuide: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.empty': 'Contribution guide is required'
    }),

  gettingStartedSteps: Joi.array()
    .items(
      Joi.object({
        step: Joi.string().min(1).required(),
        description: Joi.string().min(1).required()
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one getting started step is required'
    }),

  projectOverview: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.empty': 'Project overview is required'
    }),

  tags: Joi.array()
    .items(Joi.string().trim().lowercase())
    .default([])
});

const updateGuideSchema = Joi.object({
  name: Joi.string().min(1).max(100),
  description: Joi.string().min(1).max(500),
  repositoryUrl: Joi.string().pattern(/^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+\/?$/),
  language: Joi.string().valid('JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Other'),
  difficulty: Joi.string().valid('Beginner', 'Intermediate', 'Advanced'),
  contributionGuide: Joi.string().min(1),
  gettingStartedSteps: Joi.array().items(
    Joi.object({
      step: Joi.string().min(1).required(),
      description: Joi.string().min(1).required()
    })
  ).min(1),
  projectOverview: Joi.string().min(1),
  tags: Joi.array().items(Joi.string().trim().lowercase()),
  isActive: Joi.boolean()
});

const guideIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid guide ID format'
    })
});

const filtersSchema = Joi.object({
  language: Joi.string().valid('JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Other'),
  difficulty: Joi.string().valid('Beginner', 'Intermediate', 'Advanced'),
  tags: Joi.array().items(Joi.string().trim().lowercase())
});

module.exports = {
  createGuideSchema,
  updateGuideSchema,
  guideIdSchema,
  filtersSchema
};