const mongoose = require('mongoose');

const docsEntrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  stackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TechStack',
    required: true
  },
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SkillDomain'
  },
  difficultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DifficultyLevel',
    required: true
  },
  contentType: {
    type: String,
    enum: ['guide', 'tutorial', 'reference', 'concept'],
    required: true
  },
  tags: [{
    type: String
  }],
  order: {
    type: Number,
    default: 0
  },
  estimatedReadTime: {
    type: Number, // in minutes
    required: true
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for efficient queries
docsEntrySchema.index({ stackId: 1, skillId: 1, difficultyId: 1, contentType: 1 });
docsEntrySchema.index({ tags: 1 });
docsEntrySchema.index({ isPublished: 1 });

module.exports = mongoose.model('DocsEntry', docsEntrySchema);