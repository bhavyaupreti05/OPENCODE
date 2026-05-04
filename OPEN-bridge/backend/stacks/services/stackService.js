const TechStack = require('../models/TechStack');
const SkillDomain = require('../../skills/models/SkillDomain');

class StackService {
  async getStacks() {
    return TechStack.find({}).sort('name');
  }

  async getStackSkills(stackId) {
    return SkillDomain.find({ stackId }).sort('name');
  }
}

module.exports = new StackService();
