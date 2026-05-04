const mongoose = require('mongoose');

const learningPathSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  difficultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DifficultyLevel',
    required: true
  },
  nodes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LearningNode'
  }],
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  estimatedDuration: {
    type: Number, // in minutes
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
learningPathSchema.index({ userId: 1, isActive: 1 });
learningPathSchema.index({ stackId: 1, skillId: 1, difficultyId: 1 });

module.exports = mongoose.model('LearningPath', learningPathSchema);