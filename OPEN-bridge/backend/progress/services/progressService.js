const Progress = require('../models/Progress');
const LearningNode = require('../../paths/models/LearningNode');

class ProgressService {
  async getUserProgress(userId) {
    return await Progress.find({ userId })
      .populate('pathId', 'title')
      .populate('nodeId', 'title contentType')
      .sort({ updatedAt: -1 });
  }

  async getPathProgress(userId, pathId) {
    return await Progress.find({ userId, pathId })
      .populate('nodeId', 'title order prerequisites')
      .sort({ 'nodeId.order': 1 });
  }

  async startNode(userId, pathId, nodeId) {
    let progress = await Progress.findOne({ userId, pathId, nodeId });

    if (!progress) {
      progress = new Progress({
        userId,
        pathId,
        nodeId,
        status: 'in_progress',
        startedAt: new Date()
      });
    } else if (progress.status === 'not_started') {
      progress.status = 'in_progress';
      progress.startedAt = new Date();
    }

    return await progress.save();
  }

  async completeNode(userId, pathId, nodeId, data = {}) {
    const progress = await Progress.findOne({ userId, pathId, nodeId });

    if (!progress) {
      throw new Error('Progress record not found');
    }

    progress.status = 'completed';
    progress.completedAt = new Date();
    progress.attempts += 1;

    if (data.score !== undefined) {
      progress.score = data.score;
    }

    if (data.timeSpent) {
      progress.timeSpent = data.timeSpent;
    }

    if (data.notes) {
      progress.notes = data.notes;
    }

    return await progress.save();
  }

  async canAccessNode(userId, nodeId) {
    const node = await LearningNode.findById(nodeId).populate('prerequisites');

    if (!node.prerequisites || node.prerequisites.length === 0) {
      return true; // No prerequisites
    }

    // Check if all prerequisites are completed
    const prerequisiteProgress = await Progress.find({
      userId,
      nodeId: { $in: node.prerequisites },
      status: 'completed'
    });

    return prerequisiteProgress.length === node.prerequisites.length;
  }

  async getNextNode(userId, pathId) {
    // Get all nodes in the path
    const path = await require('../../paths/models/LearningPath').findById(pathId).populate('nodes');
    if (!path) {
      throw new Error('Path not found');
    }

    // Get user's progress for this path
    const progressRecords = await Progress.find({
      userId,
      pathId,
      status: 'completed'
    });

    const completedNodeIds = progressRecords.map(p => p.nodeId.toString());

    // Find the next incomplete node that meets prerequisites
    for (const node of path.nodes) {
      if (!completedNodeIds.includes(node._id.toString())) {
        const canAccess = await this.canAccessNode(userId, node._id);
        if (canAccess) {
          return node;
        }
      }
    }

    return null; // All nodes completed or no accessible nodes
  }

  async getPathCompletionPercentage(userId, pathId) {
    const path = await require('../../paths/models/LearningPath').findById(pathId);
    if (!path || path.nodes.length === 0) {
      return 0;
    }

    const completedCount = await Progress.countDocuments({
      userId,
      pathId,
      status: 'completed'
    });

    return Math.round((completedCount / path.nodes.length) * 100);
  }

  async resetNodeProgress(userId, pathId, nodeId) {
    const progress = await Progress.findOne({ userId, pathId, nodeId });

    if (progress) {
      progress.status = 'not_started';
      progress.startedAt = null;
      progress.completedAt = null;
      progress.timeSpent = 0;
      progress.attempts = 0;
      progress.score = null;
      return await progress.save();
    }

    return null;
  }
}

module.exports = new ProgressService();