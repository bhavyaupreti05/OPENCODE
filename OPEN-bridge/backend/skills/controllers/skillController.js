const skillService = require('../services/skillService');

class SkillController {
  async listSkills(req, res) {
    try {
      const skills = await skillService.getSkills();
      res.json({ success: true, data: skills });
    } catch (error) {
      console.error('List skills error:', error);
      res.status(500).json({ success: false, message: 'Unable to list skills' });
    }
  }

  async listSkillsByStack(req, res) {
    try {
      const { stackId } = req.params;
      const skills = await skillService.getSkillsByStack(stackId);
      res.json({ success: true, data: skills });
    } catch (error) {
      console.error('List skills by stack error:', error);
      res.status(500).json({ success: false, message: 'Unable to list skills for the selected stack' });
    }
  }
}

module.exports = new SkillController();
