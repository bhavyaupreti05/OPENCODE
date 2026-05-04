const Joi = require('joi');

const testCaseSchema = Joi.object({
  input: Joi.string().required(),
  expectedOutput: Joi.string().required(),
  isHidden: Joi.boolean().default(false),
  explanation: Joi.string().allow('')
});

const hintSchema = Joi.object({
  text: Joi.string().required(),
  order: Joi.number().integer().min(1)
});

const createProblemSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required(),
  description: Joi.string().min(10).required(),
  difficultyId: Joi.string().hex().length(24).required(),
  stackId: Joi.string().hex().length(24).required(),
  skillId: Joi.string().hex().length(24).required(),
  problemType: Joi.string().valid('practice', 'simulation').default('practice'),
  testCases: Joi.array().items(testCaseSchema).min(1).required(),
  starterCode: Joi.string().default(''),
  solution: Joi.string().min(1).required(),
  hints: Joi.array().items(hintSchema),
  tags: Joi.array().items(Joi.string().trim().min(1)),
  timeLimit: Joi.number().integer().min(1000).max(30000).default(5000),
  memoryLimit: Joi.number().integer().min(64).max(1024).default(256),
  isPublished: Joi.boolean().default(false),
  estimatedSolveTime: Joi.number().integer().min(5).max(300).default(30)
});

const updateProblemSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200),
  description: Joi.string().min(10),
  difficultyId: Joi.string().hex().length(24),
  stackId: Joi.string().hex().length(24),
  skillId: Joi.string().hex().length(24),
  problemType: Joi.string().valid('practice', 'simulation'),
  testCases: Joi.array().items(testCaseSchema).min(1),
  starterCode: Joi.string(),
  solution: Joi.string().min(1),
  hints: Joi.array().items(hintSchema),
  tags: Joi.array().items(Joi.string().trim().min(1)),
  timeLimit: Joi.number().integer().min(1000).max(30000),
  memoryLimit: Joi.number().integer().min(64).max(1024),
  isPublished: Joi.boolean(),
  estimatedSolveTime: Joi.number().integer().min(5).max(300)
}).min(1);

const problemFiltersSchema = Joi.object({
  stackId: Joi.string().hex().length(24),
  skillId: Joi.string().hex().length(24),
  difficultyId: Joi.string().hex().length(24),
  problemType: Joi.string().valid('practice', 'simulation'),
  tags: Joi.string() // comma-separated list
});

const searchSchema = Joi.object({
  q: Joi.string().min(1).max(100).required(),
  stackId: Joi.string().hex().length(24),
  skillId: Joi.string().hex().length(24),
  difficultyId: Joi.string().hex().length(24),
  problemType: Joi.string().valid('practice', 'simulation')
});

module.exports = {
  createProblemSchema,
  updateProblemSchema,
  problemFiltersSchema,
  searchSchema
};