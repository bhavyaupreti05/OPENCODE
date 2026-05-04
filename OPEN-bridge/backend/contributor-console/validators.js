const Joi = require('joi');

const guideActionSchema = Joi.object({
  action: Joi.string().valid('create', 'update', 'delete').required(),
  guideData: Joi.when('action', {
    is: 'create',
    then: Joi.object({
      name: Joi.string().min(1).max(100).required(),
      description: Joi.string().min(1).max(500).required(),
      repositoryUrl: Joi.string().pattern(/^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+\/?$/).required(),
      language: Joi.string().valid('JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Other').required(),
      difficulty: Joi.string().valid('Beginner', 'Intermediate', 'Advanced').required(),
      contributionGuide: Joi.string().min(1).required(),
      gettingStartedSteps: Joi.array().items(
        Joi.object({
          step: Joi.string().min(1).required(),
          description: Joi.string().min(1).required()
        })
      ).min(1).required(),
      projectOverview: Joi.string().min(1).required(),
      tags: Joi.array().items(Joi.string().trim().lowercase()).default([])
    }),
    otherwise: Joi.when('action', {
      is: 'update',
      then: Joi.object({
        id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
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
      }),
      otherwise: Joi.object({
        id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
      })
    })
  })
});

const proofVerificationSchema = Joi.object({
  status: Joi.string().valid('verified', 'rejected').required(),
  notes: Joi.string().allow('').optional(),
  verifiedBy: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
});

const proofIdSchema = Joi.object({
  proofId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
});

module.exports = {
  guideActionSchema,
  proofVerificationSchema,
  proofIdSchema
};