const mongoose = require('mongoose');

const skillDomainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  stackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TechStack',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SkillDomain', skillDomainSchema);
