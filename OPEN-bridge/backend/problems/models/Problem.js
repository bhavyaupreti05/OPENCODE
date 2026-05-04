const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DifficultyLevel',
    required: true
  },
  stackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TechStack',
    required: true
  },
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SkillDomain',
    required: true
  },
  problemType: {
    type: String,
    enum: ['practice', 'simulation'],
    default: 'practice',
    required: true
  },
  testCases: [{
    input: {
      type: String,
      required: true
    },
    expectedOutput: {
      type: String,
      required: true
    },
    isHidden: {
      type: Boolean,
      default: false
    },
    explanation: String
  }],
  starterCode: {
    type: String,
    default: ''
  },
  solution: {
    type: String,
    required: true
  },
  hints: [{
    text: String,
    order: Number
  }],
  tags: [{
    type: String,
    trim: true
  }],
  timeLimit: {
    type: Number,
    default: 5000 // 5 seconds in milliseconds
  },
  memoryLimit: {
    type: Number,
    default: 256 // 256 MB
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  estimatedSolveTime: {
    type: Number, // in minutes
    default: 30
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
problemSchema.index({ stackId: 1, skillId: 1, difficultyId: 1 });
problemSchema.index({ problemType: 1, isPublished: 1 });
problemSchema.index({ tags: 1 });

module.exports = mongoose.model('Problem', problemSchema);