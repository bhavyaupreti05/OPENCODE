const difficultyService = require('../services/difficultyService');

class DifficultyController {
  async listDifficulties(req, res) {
    try {
      const difficulties = await difficultyService.getDifficulties();
      res.json({ success: true, data: difficulties });
    } catch (error) {
      console.error('List difficulties error:', error);
      res.status(500).json({ success: false, message: 'Unable to list difficulty levels' });
    }
  }
}

module.exports = new DifficultyController();
