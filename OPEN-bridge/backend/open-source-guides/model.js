const mongoose = require('mongoose');

const repositoryGuideSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  repositoryUrl: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(v);
      },
      message: 'Repository URL must be a valid GitHub URL'
    }
  },
  language: {
    type: String,
    required: true,
    trim: true,
    enum: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Other']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  contributionGuide: {
    type: String,
    required: true,
    trim: true
  },
  gettingStartedSteps: [{
    step: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    }
  }],
  projectOverview: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
repositoryGuideSchema.index({ language: 1, difficulty: 1, tags: 1, isActive: 1 });

const RepositoryGuide = mongoose.model('RepositoryGuide', repositoryGuideSchema);

module.exports = RepositoryGuide;