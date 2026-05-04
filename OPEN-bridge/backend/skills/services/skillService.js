const SkillDomain = require('../models/SkillDomain');

class SkillService {
  async getSkills() {
    return SkillDomain.find({}).populate('stackId').sort('name');
  }

  async getSkillsByStack(stackId) {
    return SkillDomain.find({ stackId }).sort('name');
  }
}

module.exports = new SkillService();
