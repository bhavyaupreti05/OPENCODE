const Joi = require('joi');

const contributionProofSchema = Joi.object({
  url: Joi.string().uri().required(),
  description: Joi.string().allow('').optional(),
  notes: Joi.string().allow('').optional(),
  userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional()
});

const verifyProofSchema = Joi.object({
  status: Joi.string().valid('verified', 'rejected').required(),
  notes: Joi.string().allow('').optional(),
  verifierId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional()
});

const idParamSchema = Joi.object({
  id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Invalid contribution proof ID format',
    'any.required': 'Contribution proof ID is required'
  })
});

const validateContributionProofPayload = (req, res, next) => {
  const { error } = contributionProofSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  next();
};

const validateVerifyProofPayload = (req, res, next) => {
  const { error } = verifyProofSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  next();
};

const validateProofIdParam = (req, res, next) => {
  const { error } = idParamSchema.validate(req.params, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Invalid contribution proof ID',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  next();
};

module.exports = {
  validateContributionProofPayload,
  validateVerifyProofPayload,
  validateProofIdParam
};