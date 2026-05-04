const stackService = require('../services/stackService');

class StackController {
  async listStacks(req, res) {
    try {
      const stacks = await stackService.getStacks();
      res.json({ success: true, data: stacks });
    } catch (error) {
      console.error('List stacks error:', error);
      res.status(500).json({ success: false, message: 'Unable to list stacks' });
    }
  }

  async listStackSkills(req, res) {
    try {
      const { id: stackId } = req.params;
      const skills = await stackService.getStackSkills(stackId);
      res.json({ success: true, data: skills });
    } catch (error) {
      console.error('List stack skills error:', error);
      res.status(500).json({ success: false, message: 'Unable to list skills for stack' });
    }
  }
}

module.exports = new StackController();
