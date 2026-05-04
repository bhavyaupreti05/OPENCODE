const mongoose = require('mongoose');

const techStackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  supported: {
    type: Boolean,
    default: true
  },
  executionSupported: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TechStack', techStackSchema);
