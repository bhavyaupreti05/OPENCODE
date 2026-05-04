const progressService = require('../services/progressService');

class ProgressController {
  async getUserProgress(req, res) {
    try {
      const progress = await progressService.getUserProgress(req.user.id);
      res.json({
        success: true,
        data: progress
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getPathProgress(req, res) {
    try {
      const { pathId } = req.params;
      const progress = await progressService.getPathProgress(req.user.id, pathId);
      res.json({
        success: true,
        data: progress
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async startNode(req, res) {
    try {
      const { pathId, nodeId } = req.params;

      // Check if user can access this node
      const canAccess = await progressService.canAccessNode(req.user.id, nodeId);
      if (!canAccess) {
        return res.status(403).json({
          success: false,
          error: 'Prerequisites not met'
        });
      }

      const progress = await progressService.startNode(req.user.id, pathId, nodeId);
      res.json({
        success: true,
        data: progress
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async completeNode(req, res) {
    try {
      const { pathId, nodeId } = req.params;
      const { score, timeSpent, notes } = req.body;

      const progress = await progressService.completeNode(req.user.id, pathId, nodeId, {
        score,
        timeSpent,
        notes
      });

      res.json({
        success: true,
        data: progress
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getNextNode(req, res) {
    try {
      const { pathId } = req.params;
      const nextNode = await progressService.getNextNode(req.user.id, pathId);

      res.json({
        success: true,
        data: nextNode
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getPathCompletion(req, res) {
    try {
      const { pathId } = req.params;
      const percentage = await progressService.getPathCompletionPercentage(req.user.id, pathId);

      res.json({
        success: true,
        data: { completionPercentage: percentage }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async resetNodeProgress(req, res) {
    try {
      const { pathId, nodeId } = req.params;

      const progress = await progressService.resetNodeProgress(req.user.id, pathId, nodeId);
      res.json({
        success: true,
        data: progress
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new ProgressController();