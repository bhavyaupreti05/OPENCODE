const submissionsService = require('../services/submissionsService');

class SubmissionsController {
  async createSubmission(req, res) {
    try {
      const { problemId, code, language } = req.body;
      const userId = req.user.id; // Assuming auth middleware sets req.user

      const submissionData = {
        userId,
        problemId,
        code,
        language: language || 'javascript'
      };

      const submission = await submissionsService.createSubmission(submissionData);

      // Start evaluation process
      submissionsService.evaluateSubmission(submission._id);

      res.status(201).json({
        success: true,
        data: {
          submission: {
            id: submission._id,
            status: submission.status,
            submittedAt: submission.submittedAt
          }
        },
        message: 'Submission created and evaluation started'
      });
    } catch (error) {
      console.error('Create submission error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getSubmission(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const submission = await submissionsService.getSubmissionById(id);

      // Check if user owns this submission or is admin
      if (submission.userId._id.toString() !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      res.json({
        success: true,
        data: { submission }
      });
    } catch (error) {
      console.error('Get submission error:', error);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  async getUserSubmissions(req, res) {
    try {
      const userId = req.user.id;
      const { problemId, status, language, page, limit } = req.query;

      const filters = {};
      if (problemId) filters.problemId = problemId;
      if (status) filters.status = status;
      if (language) filters.language = language;

      const result = await submissionsService.getUserSubmissions(
        userId,
        filters,
        parseInt(page) || 1,
        parseInt(limit) || 20
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get user submissions error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch submissions'
      });
    }
  }

  async getUserSubmissionsForProblem(req, res) {
    try {
      const userId = req.user.id;
      const { problemId } = req.params;
      const { limit } = req.query;

      const submissions = await submissionsService.getUserSubmissionsForProblem(
        userId,
        problemId,
        parseInt(limit) || 10
      );

      res.json({
        success: true,
        data: { submissions }
      });
    } catch (error) {
      console.error('Get user submissions for problem error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch submissions'
      });
    }
  }

  async getUserRecentSubmissions(req, res) {
    try {
      const userId = req.user.id;
      const { limit } = req.query;

      const submissions = await submissionsService.getUserRecentSubmissions(
        userId,
        parseInt(limit) || 20
      );

      res.json({
        success: true,
        data: { submissions }
      });
    } catch (error) {
      console.error('Get user recent submissions error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch recent submissions'
      });
    }
  }

  async getSubmissionStats(req, res) {
    try {
      const userId = req.user.id;

      const stats = await submissionsService.getSubmissionStats(userId);

      res.json({
        success: true,
        data: { stats }
      });
    } catch (error) {
      console.error('Get submission stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch submission stats'
      });
    }
  }

  async getProblemSubmissions(req, res) {
    try {
      const { problemId } = req.params;
      const { page, limit } = req.query;

      // Check if user has permission to view problem submissions
      // For now, allow all authenticated users

      const result = await submissionsService.getProblemSubmissions(
        problemId,
        parseInt(page) || 1,
        parseInt(limit) || 50
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get problem submissions error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch problem submissions'
      });
    }
  }

  async deleteSubmission(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await submissionsService.deleteSubmission(id, userId);

      res.json({
        success: true,
        message: 'Submission deleted successfully'
      });
    } catch (error) {
      console.error('Delete submission error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // Admin endpoints
  async getAllSubmissions(req, res) {
    try {
      // This would be for admin use to see all submissions
      const { page, limit, status, problemId } = req.query;

      const query = {};
      if (status) query.status = status;
      if (problemId) query.problemId = problemId;

      const skip = (parseInt(page) - 1 || 0) * (parseInt(limit) || 50);

      const submissions = await require('../models/Submission').find(query)
        .populate('userId', 'username email')
        .populate('problemId', 'title')
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit) || 50);

      const total = await require('../models/Submission').countDocuments(query);

      res.json({
        success: true,
        data: {
          submissions,
          pagination: {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 50,
            total,
            pages: Math.ceil(total / (parseInt(limit) || 50))
          }
        }
      });
    } catch (error) {
      console.error('Get all submissions error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch submissions'
      });
    }
  }
}

module.exports = new SubmissionsController();