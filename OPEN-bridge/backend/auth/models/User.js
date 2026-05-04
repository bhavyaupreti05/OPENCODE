const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    default: null // Will be set to 'normal' role
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  selectedStack: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TechStack',
    default: null
  },
  selectedSkill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SkillDomain',
    default: null
  },
  selectedDifficulty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DifficultyLevel',
    default: null
  },
  confidenceLevel: {
    type: String,
    default: null,
    required: false
  },
  experience: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Remove password hash from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.passwordHash;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);