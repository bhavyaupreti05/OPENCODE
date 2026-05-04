// Mock dependencies
jest.mock('../models/LearningPath');
jest.mock('../models/LearningNode');
jest.mock('../../docs/models/DocsEntry');
jest.mock('../../stacks/models/TechStack');
jest.mock('../../skills/models/SkillDomain');
jest.mock('../../difficulties/models/DifficultyLevel');

const pathService = require('../services/pathService');
const LearningPath = require('../models/LearningPath');
const LearningNode = require('../models/LearningNode');
const DocsEntry = require('../../docs/models/DocsEntry');
const TechStack = require('../../stacks/models/TechStack');
const SkillDomain = require('../../skills/models/SkillDomain');
const DifficultyLevel = require('../../difficulties/models/DifficultyLevel');

describe('PathService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateLearningPath', () => {
    it('should return existing active path if one exists', async () => {
      const mockExistingPath = { _id: 'existingPathId', isActive: true };
      LearningPath.findOne.mockResolvedValue(mockExistingPath);

      const result = await pathService.generateLearningPath('userId', 'stackId', 'skillId', 'difficultyId');

      expect(LearningPath.findOne).toHaveBeenCalledWith({
        userId: 'userId',
        stackId: 'stackId',
        skillId: 'skillId',
        difficultyId: 'difficultyId',
        isActive: true
      });
      expect(result).toBe(mockExistingPath);
    });

    it('should create new path when no existing active path', async () => {
      const mockPath = {
        _id: 'newPathId',
        nodes: [],
        save: jest.fn().mockResolvedValue()
      };
      const mockNodes = [{ _id: 'node1' }, { _id: 'node2' }];

      LearningPath.findOne.mockResolvedValue(null);
      pathService.createLearningPath = jest.fn().mockResolvedValue(mockPath);
      pathService.generatePathNodes = jest.fn().mockResolvedValue(mockNodes);

      const result = await pathService.generateLearningPath('userId', 'stackId', 'skillId', 'difficultyId');

      expect(pathService.createLearningPath).toHaveBeenCalledWith('userId', 'stackId', 'skillId', 'difficultyId');
      expect(pathService.generatePathNodes).toHaveBeenCalledWith('newPathId', 'stackId', 'skillId', 'difficultyId');
      expect(mockPath.save).toHaveBeenCalled();
      expect(result).toBe(mockPath);
    });
  });

  describe('createLearningPath', () => {
    it('should create and return a new learning path', async () => {
      const mockStack = { _id: 'stackId', name: 'JavaScript' };
      const mockSkill = { _id: 'skillId', name: 'Fundamentals' };
      const mockDifficulty = { _id: 'difficultyId', name: 'beginner' };
      const mockPath = {
        _id: 'pathId',
        save: jest.fn().mockResolvedValue()
      };

      TechStack.findById.mockResolvedValue(mockStack);
      SkillDomain.findById.mockResolvedValue(mockSkill);
      DifficultyLevel.findById.mockResolvedValue(mockDifficulty);
      LearningPath.mockImplementation(() => mockPath);

      const result = await pathService.createLearningPath('userId', 'stackId', 'skillId', 'difficultyId');

      expect(TechStack.findById).toHaveBeenCalledWith('stackId');
      expect(SkillDomain.findById).toHaveBeenCalledWith('skillId');
      expect(DifficultyLevel.findById).toHaveBeenCalledWith('difficultyId');
      expect(LearningPath).toHaveBeenCalledWith({
        userId: 'userId',
        stackId: 'stackId',
        skillId: 'skillId',
        difficultyId: 'difficultyId',
        title: 'JavaScript Fundamentals - Beginner Path',
        description: 'Structured learning path for JavaScript focusing on Fundamentals at beginner level',
        estimatedDuration: 240,
        nodes: []
      });
      expect(result).toBe(mockPath);
    });
  });

  describe('generatePathNodes', () => {
    it('should generate nodes from documentation entries', async () => {
      const mockDocs = [
        {
          _id: 'doc1',
          title: 'Introduction to JS',
          summary: 'Learn the basics',
          difficultyId: 'difficultyId',
          estimatedReadTime: 30,
          tags: ['javascript', 'basics'],
          order: 1
        },
        {
          _id: 'doc2',
          title: 'Variables and Types',
          summary: 'Understanding data types',
          difficultyId: 'difficultyId',
          estimatedReadTime: 45,
          tags: ['javascript', 'variables'],
          order: 2
        }
      ];

      const mockNode1 = { _id: 'node1', save: jest.fn().mockResolvedValue() };
      const mockNode2 = { _id: 'node2', save: jest.fn().mockResolvedValue() };

      DocsEntry.find.mockResolvedValue(mockDocs);
      LearningNode.mockImplementationOnce(() => mockNode1).mockImplementationOnce(() => mockNode2);

      const result = await pathService.generatePathNodes('pathId', 'stackId', 'skillId', 'difficultyId');

      expect(DocsEntry.find).toHaveBeenCalledWith({
        stackId: 'stackId',
        skillId: 'skillId',
        difficultyId: 'difficultyId',
        isPublished: true
      });
      expect(result).toEqual([mockNode1, mockNode2]);
    });
  });

  describe('calculateEstimatedDuration', () => {
    it('should return correct duration for each difficulty level', () => {
      expect(pathService.calculateEstimatedDuration('beginner')).toBe(240);
      expect(pathService.calculateEstimatedDuration('intermediate')).toBe(360);
      expect(pathService.calculateEstimatedDuration('advanced')).toBe(480);
      expect(pathService.calculateEstimatedDuration('unknown')).toBe(240);
    });
  });

  describe('getUserPaths', () => {
    it('should return user paths with populated fields', async () => {
      const mockPaths = [{ _id: 'path1', title: 'Path 1' }];
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockPaths)
      };

      LearningPath.find.mockReturnValue(mockQuery);

      const result = await pathService.getUserPaths('userId');

      expect(LearningPath.find).toHaveBeenCalledWith({ userId: 'userId', isActive: true });
      expect(mockQuery.populate).toHaveBeenCalledTimes(3);
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toBe(mockPaths);
    });
  });

  describe('getPathWithNodes', () => {
    it('should return path with populated nodes', async () => {
      const mockPath = { _id: 'pathId', title: 'Test Path' };
      const mockQuery = {
        populate: jest.fn().mockReturnThis()
      };
      mockQuery.populate.mockReturnValue(mockQuery); // Chain populate calls
      LearningPath.findById.mockReturnValue(mockQuery);

      const result = await pathService.getPathWithNodes('pathId');

      expect(LearningPath.findById).toHaveBeenCalledWith('pathId');
      expect(result).toBe(mockQuery);
    });
  });
});