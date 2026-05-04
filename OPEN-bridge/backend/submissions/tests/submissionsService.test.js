const submissionsService = require('../services/submissionsService');
const Submission = require('../models/Submission');
const Problem = require('../../problems/models/Problem');

// Mock dependencies
jest.mock('../models/Submission');
jest.mock('../../problems/models/Problem');

describe('SubmissionsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSubmission', () => {
    it('should create and save a new submission', async () => {
      const submissionData = {
        userId: 'user1',
        problemId: 'prob1',
        code: 'console.log("hello");',
        language: 'javascript'
      };

      const mockProblem = { _id: 'prob1', isPublished: true };
      const mockSubmission = {
        ...submissionData,
        status: 'pending',
        save: jest.fn().mockResolvedValue({
          _id: 'sub1',
          ...submissionData,
          status: 'pending'
        })
      };

      Problem.findById.mockResolvedValue(mockProblem);
      Submission.mockImplementation(() => mockSubmission);

      const result = await submissionsService.createSubmission(submissionData);

      expect(Problem.findById).toHaveBeenCalledWith('prob1');
      expect(Submission).toHaveBeenCalledWith({
        ...submissionData,
        status: 'pending'
      });
      expect(mockSubmission.save).toHaveBeenCalled();
      expect(result._id).toBe('sub1');
    });

    it('should throw error if problem not found', async () => {
      Problem.findById.mockResolvedValue(null);

      await expect(submissionsService.createSubmission({
        userId: 'user1',
        problemId: 'nonexistent',
        code: 'test'
      })).rejects.toThrow('Problem not found');
    });

    it('should throw error if problem is not published', async () => {
      const mockProblem = { _id: 'prob1', isPublished: false };
      Problem.findById.mockResolvedValue(mockProblem);

      await expect(submissionsService.createSubmission({
        userId: 'user1',
        problemId: 'prob1',
        code: 'test'
      })).rejects.toThrow('Problem is not available for submission');
    });
  });

  describe('getSubmissionById', () => {
    it('should return submission with populated fields', async () => {
      const mockSubmission = {
        _id: 'sub1',
        userId: { _id: 'user1', username: 'testuser' },
        problemId: { _id: 'prob1', title: 'Test Problem' }
      };

      // Create a chainable mock query
      const createMockQuery = (finalResult) => {
        const mockQuery = {};
        let callCount = 0;
        const populate = jest.fn(() => {
          callCount++;
          if (callCount >= 2) { // After 2 populate calls, resolve
            return Promise.resolve(finalResult);
          }
          return mockQuery;
        });
        mockQuery.populate = populate;
        return mockQuery;
      };

      const mockQuery = createMockQuery(mockSubmission);
      Submission.findById.mockReturnValue(mockQuery);

      const result = await submissionsService.getSubmissionById('sub1');

      expect(Submission.findById).toHaveBeenCalledWith('sub1');
      expect(result).toBe(mockSubmission);
    });

    it('should throw error if submission not found', async () => {
      const createMockQuery = (finalResult) => {
        const mockQuery = {};
        let callCount = 0;
        const populate = jest.fn(() => {
          callCount++;
          if (callCount >= 2) { // After 2 populate calls, resolve
            return Promise.resolve(finalResult);
          }
          return mockQuery;
        });
        mockQuery.populate = populate;
        return mockQuery;
      };

      const mockQuery = createMockQuery(null);
      Submission.findById.mockReturnValue(mockQuery);

      await expect(submissionsService.getSubmissionById('nonexistent'))
        .rejects.toThrow('Submission not found');
    });
  });

  describe('getUserSubmissions', () => {
    it('should return user submissions with pagination', async () => {
      const mockSubmissions = [
        { _id: 'sub1', status: 'passed' },
        { _id: 'sub2', status: 'failed' }
      ];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockSubmissions)
      };

      Submission.find.mockReturnValue(mockQuery);
      Submission.countDocuments.mockResolvedValue(2);

      const result = await submissionsService.getUserSubmissions('user1', {}, 1, 10);

      expect(Submission.find).toHaveBeenCalledWith({ userId: 'user1' });
      expect(result.submissions).toBe(mockSubmissions);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.pages).toBe(1);
    });

    it('should apply filters correctly', async () => {
      const filters = {
        problemId: 'prob1',
        status: 'passed',
        language: 'javascript'
      };

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([])
      };

      Submission.find.mockReturnValue(mockQuery);
      Submission.countDocuments.mockResolvedValue(0);

      await submissionsService.getUserSubmissions('user1', filters, 1, 10);

      expect(Submission.find).toHaveBeenCalledWith({
        userId: 'user1',
        problemId: 'prob1',
        status: 'passed',
        language: 'javascript'
      });
    });
  });

  describe('updateSubmissionStatus', () => {
    it('should update submission status and results', async () => {
      const results = [{ testCaseId: 'test1', passed: true }];
      const mockUpdatedSubmission = {
        _id: 'sub1',
        status: 'passed',
        results,
        overallResult: {
          passed: true,
          totalTests: 1,
          passedTests: 1,
          failedTests: 0
        }
      };

      Submission.findByIdAndUpdate.mockResolvedValue(mockUpdatedSubmission);

      const result = await submissionsService.updateSubmissionStatus('sub1', 'passed', results);

      expect(Submission.findByIdAndUpdate).toHaveBeenCalledWith('sub1', {
        status: 'passed',
        completedAt: expect.any(Date),
        results,
        overallResult: expect.objectContaining({
          passed: true,
          totalTests: 1,
          passedTests: 1
        })
      }, { new: true });
      expect(result).toBe(mockUpdatedSubmission);
    });

    it('should throw error if submission not found', async () => {
      Submission.findByIdAndUpdate.mockResolvedValue(null);

      await expect(submissionsService.updateSubmissionStatus('nonexistent', 'passed'))
        .rejects.toThrow('Submission not found');
    });
  });

  describe('calculateOverallResult', () => {
    it('should calculate overall result correctly', () => {
      const results = [
        { passed: true, executionTime: 10, memoryUsed: 100 },
        { passed: false, executionTime: 20, memoryUsed: 200 },
        { passed: true, executionTime: 15, memoryUsed: 150 }
      ];

      const result = submissionsService.calculateOverallResult(results);

      expect(result.passed).toBe(false);
      expect(result.totalTests).toBe(3);
      expect(result.passedTests).toBe(2);
      expect(result.failedTests).toBe(1);
      expect(result.executionTime).toBe(20); // max execution time
      expect(result.memoryUsed).toBe(200); // max memory used
    });

    it('should handle empty results', () => {
      const result = submissionsService.calculateOverallResult([]);

      expect(result.passed).toBe(false);
      expect(result.totalTests).toBe(0);
      expect(result.passedTests).toBe(0);
      expect(result.failedTests).toBe(0);
    });
  });

  describe('getSubmissionStats', () => {
    it('should return user submission statistics', async () => {
      const mockStats = [{
        _id: null,
        totalSubmissions: 10,
        passedSubmissions: 7,
        failedSubmissions: 3,
        languages: ['javascript', 'python']
      }];

      Submission.aggregate.mockResolvedValue(mockStats);

      const result = await submissionsService.getSubmissionStats('507f1f77bcf86cd799439011');

      expect(Submission.aggregate).toHaveBeenCalled();
      expect(result.totalSubmissions).toBe(10);
      expect(result.passedSubmissions).toBe(7);
      expect(result.failedSubmissions).toBe(3);
      expect(result.languages).toEqual(['javascript', 'python']);
      expect(result.successRate).toBe(70);
    });

    it('should return zero stats for user with no submissions', async () => {
      Submission.aggregate.mockResolvedValue([]);

      const result = await submissionsService.getSubmissionStats('507f1f77bcf86cd799439011');

      expect(result.totalSubmissions).toBe(0);
      expect(result.successRate).toBe(0);
    });
  });

  describe('deleteSubmission', () => {
    it('should delete user\'s own submission', async () => {
      const mockDeletedSubmission = { _id: 'sub1', userId: 'user1' };

      Submission.findOneAndDelete.mockResolvedValue(mockDeletedSubmission);

      const result = await submissionsService.deleteSubmission('sub1', 'user1');

      expect(Submission.findOneAndDelete).toHaveBeenCalledWith({
        _id: 'sub1',
        userId: 'user1'
      });
      expect(result).toBe(mockDeletedSubmission);
    });

    it('should throw error if submission not found or access denied', async () => {
      Submission.findOneAndDelete.mockResolvedValue(null);

      await expect(submissionsService.deleteSubmission('sub1', 'user1'))
        .rejects.toThrow('Submission not found or access denied');
    });
  });
});