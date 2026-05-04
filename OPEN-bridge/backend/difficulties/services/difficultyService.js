const DifficultyLevel = require('../models/DifficultyLevel');

class DifficultyService {
  async getDifficulties() {
    return DifficultyLevel.find({}).sort('name');
  }
}

module.exports = new DifficultyService();
