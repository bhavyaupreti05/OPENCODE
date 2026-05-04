const Submission = require('../models/Submission');
const Problem = require('../../problems/models/Problem');
const mongoose = require('mongoose');
const runnerService = require('../../evaluation-runner/services/runnerService');

class SubmissionsService {
  async createSubmission(submissionData) {
    // Validate that the problem exists and is published
    const problem = await Problem.findById(submissionData.problemId);
    if (!problem) {
      throw new Error('Problem not found');
    }
    if (!problem.isPublished) {
      throw new Error('Problem is not available for submission');
    }

    const submission = new Submission({
      ...submissionData,
      status: 'pending'
    });

    return await submission.save();
  }

  async getSubmissionById(id) {
    const submission = await Submission.findById(id)
      .populate('userId', 'username email')
      .populate('problemId', 'title description difficultyId stackId skillId');

    if (!submission) {
      throw new Error('Submission not found');
    }

    return submission;
  }

  async getUserSubmissions(userId, filters = {}, page = 1, limit = 20) {
    const query = { userId };

    // Apply filters
    if (filters.problemId) {
      query.problemId = filters.problemId;
    }
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.language) {
      query.language = filters.language;
    }

    const skip = (page - 1) * limit;

    const submissions = await Submission.find(query)
      .populate('problemId', 'title difficultyId stackId skillId')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Submission.countDocuments(query);

    return {
      submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getUserSubmissionsForProblem(userId, problemId, limit = 10) {
    return await Submission.getUserSubmissionsForProblem(userId, problemId, limit);
  }

  async getUserRecentSubmissions(userId, limit = 20) {
    return await Submission.getUserRecentSubmissions(userId, limit);
  }

  async updateSubmissionStatus(id, status, results = null) {
    const updateData = { status };

    if (status === 'passed' || status === 'failed' || status === 'error') {
      updateData.completedAt = new Date();
    }

    if (results) {
      updateData.results = results;
      updateData.overallResult = this.calculateOverallResult(results);
    }

    const submission = await Submission.findByIdAndUpdate(id, updateData, { new: true });

    if (!submission) {
      throw new Error('Submission not found');
    }

    return submission;
  }

  async getProblemSubmissions(problemId, page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const submissions = await Submission.find({ problemId })
      .populate('userId', 'username')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Submission.countDocuments({ problemId });

    return {
      submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getSubmissionStats(userId) {
    const stats = await Submission.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalSubmissions: { $sum: 1 },
          passedSubmissions: {
            $sum: { $cond: [{ $eq: ['$status', 'passed'] }, 1, 0] }
          },
          failedSubmissions: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
          },
          languages: { $addToSet: '$language' }
        }
      }
    ]);

    if (stats.length === 0) {
      return {
        totalSubmissions: 0,
        passedSubmissions: 0,
        failedSubmissions: 0,
        languages: [],
        successRate: 0
      };
    }

    const stat = stats[0];
    const successRate = stat.totalSubmissions > 0
      ? (stat.passedSubmissions / stat.totalSubmissions) * 100
      : 0;

    return {
      totalSubmissions: stat.totalSubmissions,
      passedSubmissions: stat.passedSubmissions,
      failedSubmissions: stat.failedSubmissions,
      languages: stat.languages,
      successRate: Math.round(successRate * 100) / 100
    };
  }

  async deleteSubmission(id, userId) {
    // Only allow users to delete their own submissions
    const submission = await Submission.findOneAndDelete({
      _id: id,
      userId
    });

    if (!submission) {
      throw new Error('Submission not found or access denied');
    }

    return submission;
  }

  // Helper method to calculate overall result from test results
  calculateOverallResult(results) {
    if (!results || results.length === 0) {
      return {
        passed: false,
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        executionTime: 0,
        memoryUsed: 0
      };
    }

    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;

    const executionTime = Math.max(...results.map(r => r.executionTime || 0));
    const memoryUsed = Math.max(...results.map(r => r.memoryUsed || 0));

    return {
      passed: failedTests === 0,
      totalTests,
      passedTests,
      failedTests,
      executionTime,
      memoryUsed
    };
  }

  async evaluateSubmission(submissionId) {
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }

    const problem = await Problem.findById(submission.problemId);
    if (!problem) {
      throw new Error('Problem not found');
    }

    await this.updateSubmissionStatus(submissionId, 'running');

    let results;
    try {
      results = await runnerService.evaluate({
        code: submission.code,
        language: submission.language,
        testCases: problem.testCases,
        timeLimit: problem.timeLimit,
        memoryLimit: problem.memoryLimit
      });
    } catch (error) {
      const failedResult = [{
        testCaseId: null,
        input: null,
        expectedOutput: null,
        actualOutput: error.message,
        passed: false,
        executionTime: 0,
        memoryUsed: null,
        error: error.message
      }];

      return await this.updateSubmissionStatus(submissionId, 'error', failedResult);
    }

    const status = results.every(result => result.passed) ? 'passed' : 'failed';
    return await this.updateSubmissionStatus(submissionId, status, results);
  }
}

module.exports = new SubmissionsService();