const mongoose = require('mongoose');

const contributionProofSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

contributionProofSchema.index({ userId: 1 });
contributionProofSchema.index({ status: 1 });

module.exports = mongoose.model('ContributionProof', contributionProofSchema);