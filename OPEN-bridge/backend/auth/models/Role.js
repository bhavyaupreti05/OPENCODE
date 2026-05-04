const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['normal', 'verified_contributor', 'admin']
  },
  permissions: [{
    type: String,
    enum: ['read', 'write', 'delete', 'admin', 'contribute', 'review']
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Role', roleSchema);