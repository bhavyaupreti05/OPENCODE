const problemsService = require('../services/problemsService');
const submissionsService = require('../../submissions/services/submissionsService');

class ProblemsController {
  async getProblems(req, res) {
    try {
      const filters = {
        stackId: req.query.stackId,
        skillId: req.query.skillId,
        difficultyId: req.query.difficultyId,
        problemType: req.query.problemType,
        tags: req.query.tags ? req.query.tags.split(',') : undefined
      };

      const problems = await problemsService.getProblems(filters);
      res.json(problems);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProblem(req, res) {
    try {
      const problem = await problemsService.getProblemById(req.params.id);
      res.json(problem);
    } catch (error) {
      if (error.message === 'Problem not found') {
        return res.status(404).json({ error: 'Problem not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getProblemWithSolution(req, res) {
    try {
      // This endpoint should be admin-only
      const problem = await problemsService.getProblemWithSolution(req.params.id);
      res.json(problem);
    } catch (error) {
      if (error.message === 'Problem not found') {
        return res.status(404).json({ error: 'Problem not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async createProblem(req, res) {
    try {
      const problem = await problemsService.createProblem(req.body);
      res.status(201).json(problem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProblem(req, res) {
    try {
      const problem = await problemsService.updateProblem(req.params.id, req.body);
      if (!problem) {
        return res.status(404).json({ error: 'Problem not found' });
      }
      res.json(problem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteProblem(req, res) {
    try {
      const problem = await problemsService.deleteProblem(req.params.id);
      if (!problem) {
        return res.status(404).json({ error: 'Problem not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProblemsByStack(req, res) {
    try {
      const problems = await problemsService.getProblemsByStack(req.params.stackId);
      res.json(problems);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProblemsBySkill(req, res) {
    try {
      const problems = await problemsService.getProblemsBySkill(req.params.skillId);
      res.json(problems);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProblemsByDifficulty(req, res) {
    try {
      const problems = await problemsService.getProblemsByDifficulty(req.params.difficultyId);
      res.json(problems);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async searchProblems(req, res) {
    try {
      const { q: searchTerm, ...filters } = req.query;
      if (!searchTerm) {
        return res.status(400).json({ error: 'Search term is required' });
      }

      const problems = await problemsService.searchProblems(searchTerm, filters);
      res.json(problems);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPracticeProblems(req, res) {
    try {
      const filters = {
        stackId: req.query.stackId,
        skillId: req.query.skillId,
        difficultyId: req.query.difficultyId,
        tags: req.query.tags ? req.query.tags.split(',') : undefined
      };

      const problems = await problemsService.getPracticeProblems(filters);
      res.json(problems);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getSimulationProblems(req, res) {
    try {
      const filters = {
        stackId: req.query.stackId,
        skillId: req.query.skillId,
        difficultyId: req.query.difficultyId,
        tags: req.query.tags ? req.query.tags.split(',') : undefined
      };

      const problems = await problemsService.getSimulationProblems(filters);
      res.json(problems);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async submitProblem(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const submissionData = {
        userId: req.user.id,
        problemId: req.params.id,
        code: req.body.code,
        language: req.body.language || 'javascript'
      };

      const submission = await submissionsService.createSubmission(submissionData);
      const evaluatedSubmission = await submissionsService.evaluateSubmission(submission._id);

      res.status(201).json({
        success: true,
        data: { submission: evaluatedSubmission }
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ProblemsController();