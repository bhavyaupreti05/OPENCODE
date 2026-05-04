const LearningPath = require('../models/LearningPath');
const LearningNode = require('../models/LearningNode');
const DocsEntry = require('../../docs/models/DocsEntry');
const TechStack = require('../../stacks/models/TechStack');
const SkillDomain = require('../../skills/models/SkillDomain');
const DifficultyLevel = require('../../difficulties/models/DifficultyLevel');

class PathService {
  async generateLearningPath(userId, stackId, skillId, difficultyId) {
    // Check if user already has an active path for this combination
    const existingPath = await LearningPath.findOne({
      userId,
      stackId,
      skillId,
      difficultyId,
      isActive: true
    });

    if (existingPath) {
      // If path exists but has no nodes, populate it
      if (existingPath.nodes.length === 0) {
        const nodes = await this.generatePathNodes(existingPath._id, stackId, skillId, difficultyId);
        existingPath.nodes = nodes.map(node => node._id);
        await existingPath.save();
      }
      return existingPath;
    }

    // Generate new path
    const path = await this.createLearningPath(userId, stackId, skillId, difficultyId);
    const nodes = await this.generatePathNodes(path._id, stackId, skillId, difficultyId);

    // Update path with nodes
    path.nodes = nodes.map(node => node._id);
    await path.save();

    return path;
  }

  async createLearningPath(userId, stackId, skillId, difficultyId) {
    // Get stack and skill info for title generation
    const stack = await TechStack.findById(stackId);
    const skill = await SkillDomain.findById(skillId);
    const difficulty = await DifficultyLevel.findById(difficultyId);

    const title = `${stack.name} ${skill.name} - ${difficulty.name.charAt(0).toUpperCase() + difficulty.name.slice(1)} Path`;
    const description = `Structured learning path for ${stack.name} focusing on ${skill.name} at ${difficulty.name} level`;

    const path = new LearningPath({
      userId,
      stackId,
      skillId,
      difficultyId,
      title,
      description,
      estimatedDuration: this.calculateEstimatedDuration(difficulty.name),
      nodes: []
    });

    return await path.save();
  }

  async generatePathNodes(pathId, stackId, skillId, difficultyId) {
    const nodes = [];
    let order = 1;

    // Get relevant documentation
    const docs = await DocsEntry.find({
      stackId,
      skillId,
      difficultyId,
      isPublished: true
    }).sort({ order: 1 });

    // Create doc nodes
    for (const doc of docs) {
      const node = new LearningNode({
        pathId,
        title: doc.title,
        description: doc.summary,
        contentType: 'doc',
        contentId: doc._id,
        contentTypeModel: 'DocsEntry',
        prerequisites: order > 1 ? [nodes[nodes.length - 1]._id] : [],
        order: order++,
        estimatedTime: doc.estimatedReadTime,
        difficulty: doc.difficultyId.toString() === difficultyId.toString() ? 'beginner' : 'intermediate',
        tags: doc.tags
      });
      nodes.push(await node.save());
    }

    // TODO: Add practice and simulation nodes when those modules are implemented
    // For now, just return doc nodes

    return nodes;
  }

  calculateEstimatedDuration(difficulty) {
    const baseDurations = {
      'beginner': 240, // 4 hours
      'intermediate': 360, // 6 hours
      'advanced': 480 // 8 hours
    };
    return baseDurations[difficulty] || 240;
  }

  async getUserPaths(userId) {
    return await LearningPath.find({ userId, isActive: true })
      .populate('stackId', 'name')
      .populate('skillId', 'name')
      .populate('difficultyId', 'name')
      .sort({ createdAt: -1 });
  }

  async getPathWithNodes(pathId) {
    return await LearningPath.findById(pathId)
      .populate('stackId', 'name')
      .populate('skillId', 'name')
      .populate('difficultyId', 'name')
      .populate({
        path: 'nodes',
        populate: {
          path: 'contentId',
          select: 'title summary'
        }
      });
  }
}

module.exports = new PathService();