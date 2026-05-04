const mongoose = require('mongoose');

const learningNodeSchema = new mongoose.Schema({
  pathId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LearningPath',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    enum: ['doc', 'practice', 'simulation'],
    required: true
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // Can reference DocsEntry, Problem, or Simulation depending on contentType
    refPath: 'contentTypeModel'
  },
  contentTypeModel: {
    type: String,
    enum: ['DocsEntry', 'Problem', 'Simulation'],
    required: true
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LearningNode'
  }],
  order: {
    type: Number,
    required: true
  },
  estimatedTime: {
    type: Number, // in minutes
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Index for efficient queries
learningNodeSchema.index({ pathId: 1, order: 1 });
learningNodeSchema.index({ contentId: 1, contentType: 1 });

module.exports = mongoose.model('LearningNode', learningNodeSchema);