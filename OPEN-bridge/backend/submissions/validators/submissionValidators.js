const Joi = require('joi');

const createSubmissionSchema = Joi.object({
  problemId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid problem ID format',
      'any.required': 'Problem ID is required'
    }),

  code: Joi.string()
    .min(1)
    .max(50000) // 50KB limit
    .required()
    .messages({
      'string.min': 'Code cannot be empty',
      'string.max': 'Code is too long (max 50KB)',
      'any.required': 'Code is required'
    }),

  language: Joi.string()
    .valid('javascript', 'python', 'java', 'cpp', 'c', 'go', 'rust', 'typescript')
    .default('javascript')
    .messages({
      'any.only': 'Invalid programming language'
    })
});

const getSubmissionsQuerySchema = Joi.object({
  problemId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid problem ID format'
    }),

  status: Joi.string()
    .valid('pending', 'running', 'passed', 'failed', 'error')
    .messages({
      'any.only': 'Invalid status value'
    }),

  language: Joi.string()
    .valid('javascript', 'python', 'java', 'cpp', 'c', 'go', 'rust', 'typescript')
    .messages({
      'any.only': 'Invalid programming language'
    }),

  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.min': 'Page must be at least 1'
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .messages({
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    })
});

const getProblemSubmissionsQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(50)
});

const problemSubmissionSchema = Joi.object({
  code: Joi.string()
    .min(1)
    .max(50000)
    .required()
    .messages({
      'string.min': 'Code cannot be empty',
      'string.max': 'Code is too long (max 50KB)',
      'any.required': 'Code is required'
    }),

  language: Joi.string()
    .valid('javascript', 'python', 'java', 'cpp', 'c', 'go', 'rust', 'typescript')
    .default('javascript')
    .messages({
      'any.only': 'Invalid programming language'
    })
});

const problemIdParamSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid problem ID format',
      'any.required': 'Problem ID is required'
    })
});

const getRecentSubmissionsQuerySchema = Joi.object({
  limit: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .default(20)
    .messages({
      'number.max': 'Limit cannot exceed 50 for recent submissions'
    })
});

const validateCreateSubmission = (req, res, next) => {
  const { error } = createSubmissionSchema.validate(req.body, { abortEarly: false });

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

const validateGetSubmissionsQuery = (req, res, next) => {
  const { error } = getSubmissionsQuerySchema.validate(req.query, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Query validation failed',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  next();
};

const validateGetProblemSubmissionsQuery = (req, res, next) => {
  const { error } = getProblemSubmissionsQuerySchema.validate(req.query, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Query validation failed',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  next();
};

const validateGetRecentSubmissionsQuery = (req, res, next) => {
  const { error } = getRecentSubmissionsQuerySchema.validate(req.query, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Query validation failed',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  next();
};

const validateProblemSubmission = (req, res, next) => {
  const { error } = problemSubmissionSchema.validate(req.body, { abortEarly: false });

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

const validateProblemIdParam = (req, res, next) => {
  const { error } = problemIdParamSchema.validate(req.params, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Invalid problem ID',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  next();
};

module.exports = {
  validateCreateSubmission,
  validateGetSubmissionsQuery,
  validateGetProblemSubmissionsQuery,
  validateGetRecentSubmissionsQuery,
  validateProblemSubmission,
  validateProblemIdParam
};