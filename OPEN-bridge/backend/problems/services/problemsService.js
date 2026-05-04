const Problem = require('../models/Problem');

class ProblemsService {
  async getProblems(filters = {}) {
    const query = { isPublished: true };

    if (filters.stackId) query.stackId = filters.stackId;
    if (filters.skillId) query.skillId = filters.skillId;
    if (filters.difficultyId) query.difficultyId = filters.difficultyId;
    if (filters.problemType) query.problemType = filters.problemType;
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    return await Problem.find(query)
      .populate('stackId', 'name')
      .populate('skillId', 'name')
      .populate('difficultyId', 'name')
      .sort({ createdAt: -1 });
  }

  async getProblemById(id) {
    const problem = await Problem.findById(id)
      .populate('stackId', 'name')
      .populate('skillId', 'name')
      .populate('difficultyId', 'name');

    if (!problem) {
      throw new Error('Problem not found');
    }

    // Remove hidden test cases and solution for public access
    const publicProblem = problem.toObject();
    publicProblem.testCases = publicProblem.testCases.filter(tc => !tc.isHidden);
    delete publicProblem.solution;

    return publicProblem;
  }

  async getProblemWithSolution(id) {
    // This method is for admin/internal use only
    const problem = await Problem.findById(id)
      .populate('stackId', 'name')
      .populate('skillId', 'name')
      .populate('difficultyId', 'name');

    if (!problem) {
      throw new Error('Problem not found');
    }

    return problem;
  }

  async createProblem(problemData) {
    const problem = new Problem(problemData);
    return await problem.save();
  }

  async updateProblem(id, updateData) {
    return await Problem.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteProblem(id) {
    return await Problem.findByIdAndDelete(id);
  }

  async getProblemsByStack(stackId) {
    return await Problem.find({ stackId, isPublished: true })
      .populate('skillId', 'name')
      .populate('difficultyId', 'name')
      .sort({ difficultyId: 1, createdAt: -1 });
  }

  async getProblemsBySkill(skillId) {
    return await Problem.find({ skillId, isPublished: true })
      .populate('stackId', 'name')
      .populate('difficultyId', 'name')
      .sort({ difficultyId: 1, createdAt: -1 });
  }

  async getProblemsByDifficulty(difficultyId) {
    return await Problem.find({ difficultyId, isPublished: true })
      .populate('stackId', 'name')
      .populate('skillId', 'name')
      .sort({ createdAt: -1 });
  }

  async searchProblems(searchTerm, filters = {}) {
    const query = {
      isPublished: true,
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { tags: { $in: [new RegExp(searchTerm, 'i')] } }
      ]
    };

    // Apply additional filters
    if (filters.stackId) query.stackId = filters.stackId;
    if (filters.skillId) query.skillId = filters.skillId;
    if (filters.difficultyId) query.difficultyId = filters.difficultyId;
    if (filters.problemType) query.problemType = filters.problemType;

    return await Problem.find(query)
      .populate('stackId', 'name')
      .populate('skillId', 'name')
      .populate('difficultyId', 'name')
      .sort({ createdAt: -1 });
  }

  async getPracticeProblems(filters = {}) {
    return await this.getProblems({ ...filters, problemType: 'practice' });
  }

  async getSimulationProblems(filters = {}) {
    return await this.getProblems({ ...filters, problemType: 'simulation' });
  }
}

module.exports = new ProblemsService();