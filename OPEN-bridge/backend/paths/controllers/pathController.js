const pathService = require('../services/pathService');

class PathController {
  async getUserPaths(req, res) {
    try {
      const paths = await pathService.getUserPaths(req.user.id);
      res.json({
        success: true,
        data: paths
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async generatePath(req, res) {
    try {
      const { stackId, skillId, difficultyId } = req.body;

      if (!stackId || !skillId || !difficultyId) {
        return res.status(400).json({
          success: false,
          error: 'stackId, skillId, and difficultyId are required'
        });
      }

      const path = await pathService.generateLearningPath(
        req.user.id,
        stackId,
        skillId,
        difficultyId
      );

      res.json({
        success: true,
        data: path
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getPath(req, res) {
    try {
      const { id } = req.params;
      const path = await pathService.getPathWithNodes(id);

      if (!path) {
        return res.status(404).json({
          success: false,
          error: 'Path not found'
        });
      }

      // Check if user owns this path
      if (path.userId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      res.json({
        success: true,
        data: path
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new PathController();