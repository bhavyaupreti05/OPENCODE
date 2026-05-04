const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  code: {
    type: String,
    required: true,
    trim: true
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'java', 'cpp', 'c', 'go', 'rust', 'typescript'],
    default: 'javascript'
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'passed', 'failed', 'error'],
    default: 'pending'
  },
  results: [{
    testCaseId: String,
    input: String,
    expectedOutput: String,
    actualOutput: String,
    passed: Boolean,
    executionTime: Number, // in milliseconds
    memoryUsed: Number, // in KB
    error: String
  }],
  overallResult: {
    passed: { type: Boolean, default: false },
    totalTests: { type: Number, default: 0 },
    passedTests: { type: Number, default: 0 },
    failedTests: { type: Number, default: 0 },
    executionTime: { type: Number, default: 0 }, // total execution time
    memoryUsed: { type: Number, default: 0 } // peak memory usage
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for performance
submissionSchema.index({ userId: 1, problemId: 1 });
submissionSchema.index({ problemId: 1, status: 1 });
submissionSchema.index({ userId: 1, submittedAt: -1 });

// Virtual for execution time
submissionSchema.virtual('executionTime').get(function() {
  if (this.completedAt && this.submittedAt) {
    return this.completedAt - this.submittedAt;
  }
  return null;
});

// Instance method to check if submission passed
submissionSchema.methods.isPassed = function() {
  return this.status === 'passed';
};

// Static method to get user's submissions for a problem
submissionSchema.statics.getUserSubmissionsForProblem = function(userId, problemId, limit = 10) {
  return this.find({ userId, problemId })
    .sort({ submittedAt: -1 })
    .limit(limit);
};

// Static method to get user's recent submissions
submissionSchema.statics.getUserRecentSubmissions = function(userId, limit = 20) {
  return this.find({ userId })
    .populate('problemId', 'title difficultyId')
    .sort({ submittedAt: -1 })
    .limit(limit);
};

module.exports = mongoose.model('Submission', submissionSchema);