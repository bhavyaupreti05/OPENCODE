const progressService = require('../services/progressService');
const Progress = require('../models/Progress');
const LearningNode = require('../../paths/models/LearningNode');
const LearningPath = require('../../paths/models/LearningPath');

// Mock dependencies
jest.mock('../models/Progress');
jest.mock('../../paths/models/LearningNode');
jest.mock('../../paths/models/LearningPath');

describe('ProgressService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserProgress', () => {
    it('should return user progress with populated fields', async () => {
      const mockProgress = [{ _id: 'progress1', status: 'completed' }];
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockProgress)
      };

      Progress.find.mockReturnValue(mockQuery);

      const result = await progressService.getUserProgress('userId');

      expect(Progress.find).toHaveBeenCalledWith({ userId: 'userId' });
      expect(result).toBe(mockProgress);
    });
  });

  describe('getPathProgress', () => {
    it('should return progress for specific path', async () => {
      const mockProgress = [{ _id: 'progress1', nodeId: 'node1' }];
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockProgress)
      };

      Progress.find.mockReturnValue(mockQuery);

      const result = await progressService.getPathProgress('userId', 'pathId');

      expect(Progress.find).toHaveBeenCalledWith({ userId: 'userId', pathId: 'pathId' });
      expect(result).toBe(mockProgress);
    });
  });

  describe('startNode', () => {
    it('should create new progress record if none exists', async () => {
      const mockSavedProgress = {
        userId: 'userId',
        pathId: 'pathId',
        nodeId: 'nodeId',
        status: 'in_progress',
        startedAt: expect.any(Date)
      };
      const mockProgress = {
        save: jest.fn().mockResolvedValue(mockSavedProgress)
      };

      Progress.findOne.mockResolvedValue(null);
      Progress.mockImplementation(() => mockProgress);

      const result = await progressService.startNode('userId', 'pathId', 'nodeId');

      expect(Progress.findOne).toHaveBeenCalledWith({ userId: 'userId', pathId: 'pathId', nodeId: 'nodeId' });
      expect(Progress).toHaveBeenCalledWith({
        userId: 'userId',
        pathId: 'pathId',
        nodeId: 'nodeId',
        status: 'in_progress',
        startedAt: expect.any(Date)
      });
      expect(result).toBe(mockSavedProgress);
    });

    it('should update existing progress from not_started to in_progress', async () => {
      const mockSavedProgress = {
        status: 'in_progress',
        startedAt: expect.any(Date)
      };
      const mockProgress = {
        status: 'not_started',
        save: jest.fn().mockResolvedValue(mockSavedProgress)
      };

      Progress.findOne.mockResolvedValue(mockProgress);

      const result = await progressService.startNode('userId', 'pathId', 'nodeId');

      expect(mockProgress.status).toBe('in_progress');
      expect(mockProgress.startedAt).toEqual(expect.any(Date));
      expect(mockProgress.save).toHaveBeenCalled();
      expect(result).toBe(mockSavedProgress);
    });
  });

  describe('completeNode', () => {
    it('should throw error if progress record not found', async () => {
      Progress.findOne.mockResolvedValue(null);

      await expect(progressService.completeNode('userId', 'pathId', 'nodeId'))
        .rejects.toThrow('Progress record not found');
    });

    it('should complete node with all data', async () => {
      const mockSavedProgress = {
        status: 'completed',
        completedAt: expect.any(Date),
        attempts: 1,
        score: 85,
        timeSpent: 120,
        notes: 'Good progress'
      };
      const mockProgress = {
        status: 'in_progress',
        attempts: 0,
        save: jest.fn().mockResolvedValue(mockSavedProgress)
      };
      const completionData = {
        score: 85,
        timeSpent: 120,
        notes: 'Good progress'
      };

      Progress.findOne.mockResolvedValue(mockProgress);

      const result = await progressService.completeNode('userId', 'pathId', 'nodeId', completionData);

      expect(mockProgress.status).toBe('completed');
      expect(mockProgress.completedAt).toEqual(expect.any(Date));
      expect(mockProgress.attempts).toBe(1);
      expect(mockProgress.score).toBe(85);
      expect(mockProgress.timeSpent).toBe(120);
      expect(mockProgress.notes).toBe('Good progress');
      expect(mockProgress.save).toHaveBeenCalled();
      expect(result).toBe(mockSavedProgress);
    });
  });

  describe('canAccessNode', () => {
    it('should return true if node has no prerequisites', async () => {
      const mockNode = { prerequisites: [] };
      const mockQuery = {
        populate: jest.fn().mockResolvedValue(mockNode)
      };
      LearningNode.findById.mockReturnValue(mockQuery);

      const result = await progressService.canAccessNode('userId', 'nodeId');

      expect(result).toBe(true);
    });

    it('should return true if all prerequisites are completed', async () => {
      const mockNode = { prerequisites: ['prereq1', 'prereq2'] };
      const mockProgress = [{ nodeId: 'prereq1' }, { nodeId: 'prereq2' }];
      const mockQuery = {
        populate: jest.fn().mockResolvedValue(mockNode)
      };

      LearningNode.findById.mockReturnValue(mockQuery);
      Progress.find.mockResolvedValue(mockProgress);

      const result = await progressService.canAccessNode('userId', 'nodeId');

      expect(Progress.find).toHaveBeenCalledWith({
        userId: 'userId',
        nodeId: { $in: ['prereq1', 'prereq2'] },
        status: 'completed'
      });
      expect(result).toBe(true);
    });

    it('should return false if not all prerequisites are completed', async () => {
      const mockNode = { prerequisites: ['prereq1', 'prereq2'] };
      const mockProgress = [{ nodeId: 'prereq1' }]; // Only one completed
      const mockQuery = {
        populate: jest.fn().mockResolvedValue(mockNode)
      };

      LearningNode.findById.mockReturnValue(mockQuery);
      Progress.find.mockResolvedValue(mockProgress);

      const result = await progressService.canAccessNode('userId', 'nodeId');

      expect(result).toBe(false);
    });
  });

  describe('getNextNode', () => {
    it('should return next accessible node', async () => {
      // Mock the require call inside the method
      const mockPath = {
        nodes: [
          { _id: 'node1', title: 'Node 1' },
          { _id: 'node2', title: 'Node 2' }
        ]
      };
      const mockProgress = [{ nodeId: 'node1' }]; // node1 completed

      // Mock the require inside the method
      jest.doMock('../../paths/models/LearningPath', () => ({
        findById: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockPath)
        })
      }));

      Progress.find.mockResolvedValue(mockProgress);
      progressService.canAccessNode = jest.fn().mockResolvedValue(true);

      const result = await progressService.getNextNode('userId', 'pathId');

      expect(result).toBe(mockPath.nodes[1]);
    });
  });

  describe('getPathCompletionPercentage', () => {
    it('should return 0 if path not found or has no nodes', async () => {
      LearningPath.findById.mockResolvedValue(null);

      const result = await progressService.getPathCompletionPercentage('userId', 'pathId');

      expect(result).toBe(0);
    });

    it('should calculate completion percentage correctly', async () => {
      const mockPath = { nodes: ['node1', 'node2', 'node3', 'node4'] };
      LearningPath.findById.mockResolvedValue(mockPath);
      Progress.countDocuments.mockResolvedValue(3); // 3 out of 4 completed

      const result = await progressService.getPathCompletionPercentage('userId', 'pathId');

      expect(result).toBe(75); // 3/4 * 100 = 75
    });
  });

  describe('resetNodeProgress', () => {
    it('should reset progress to initial state', async () => {
      const mockSavedProgress = {
        status: 'not_started',
        startedAt: null,
        completedAt: null,
        timeSpent: 0,
        attempts: 0,
        score: null
      };
      const mockProgress = {
        status: 'completed',
        startedAt: new Date(),
        completedAt: new Date(),
        timeSpent: 100,
        attempts: 2,
        score: 80,
        save: jest.fn().mockResolvedValue(mockSavedProgress)
      };

      Progress.findOne.mockResolvedValue(mockProgress);

      const result = await progressService.resetNodeProgress('userId', 'pathId', 'nodeId');

      expect(mockProgress.status).toBe('not_started');
      expect(mockProgress.startedAt).toBe(null);
      expect(mockProgress.completedAt).toBe(null);
      expect(mockProgress.timeSpent).toBe(0);
      expect(mockProgress.attempts).toBe(0);
      expect(mockProgress.score).toBe(null);
      expect(mockProgress.save).toHaveBeenCalled();
      expect(result).toBe(mockSavedProgress);
    });

    it('should return null if progress not found', async () => {
      Progress.findOne.mockResolvedValue(null);

      const result = await progressService.resetNodeProgress('userId', 'pathId', 'nodeId');

      expect(result).toBe(null);
    });
  });
});