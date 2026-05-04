const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pathId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LearningPath',
    required: true
  },
  nodeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LearningNode',
    required: true
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0
  },
  attempts: {
    type: Number,
    default: 0
  },
  score: {
    type: Number, // for practice/simulation nodes
    min: 0,
    max: 100
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
progressSchema.index({ userId: 1, pathId: 1, nodeId: 1 }, { unique: true });
progressSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Progress', progressSchema);