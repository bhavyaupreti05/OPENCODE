const problemsService = require('../services/problemsService');
const Problem = require('../models/Problem');

// Mock dependencies
jest.mock('../models/Problem');

describe('ProblemsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProblems', () => {
    it('should return problems with default filters', async () => {
      const mockProblems = [{ _id: 'prob1', title: 'Test Problem' }];
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockProblems)
      };

      Problem.find.mockReturnValue(mockQuery);

      const result = await problemsService.getProblems();

      expect(Problem.find).toHaveBeenCalledWith({ isPublished: true });
      expect(result).toBe(mockProblems);
    });

    it('should apply all filters correctly', async () => {
      const filters = {
        stackId: 'stack1',
        skillId: 'skill1',
        difficultyId: 'diff1',
        problemType: 'practice',
        tags: ['tag1', 'tag2']
      };
      const mockProblems = [{ _id: 'prob1' }];
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockProblems)
      };

      Problem.find.mockReturnValue(mockQuery);

      const result = await problemsService.getProblems(filters);

      expect(Problem.find).toHaveBeenCalledWith({
        isPublished: true,
        stackId: 'stack1',
        skillId: 'skill1',
        difficultyId: 'diff1',
        problemType: 'practice',
        tags: { $in: ['tag1', 'tag2'] }
      });
      expect(result).toBe(mockProblems);
    });
  });

  describe('getProblemById', () => {
    it('should return problem with hidden test cases and solution removed', async () => {
      const mockProblem = {
        _id: 'prob1',
        title: 'Test Problem',
        testCases: [
          { input: '1', expectedOutput: '1', isHidden: false },
          { input: '2', expectedOutput: '2', isHidden: true }
        ],
        solution: 'secret solution',
        toObject: jest.fn().mockReturnValue({
          _id: 'prob1',
          title: 'Test Problem',
          testCases: [
            { input: '1', expectedOutput: '1', isHidden: false },
            { input: '2', expectedOutput: '2', isHidden: true }
          ],
          solution: 'secret solution'
        })
      };

      // Create a chainable mock query
      const createMockQuery = (finalResult) => {
        const mockQuery = {};
        let callCount = 0;
        const populate = jest.fn(() => {
          callCount++;
          if (callCount >= 3) { // After 3 populate calls, resolve
            return Promise.resolve(finalResult);
          }
          return mockQuery;
        });
        mockQuery.populate = populate;
        return mockQuery;
      };

      const mockQuery = createMockQuery(mockProblem);
      Problem.findById.mockReturnValue(mockQuery);

      const result = await problemsService.getProblemById('prob1');

      expect(Problem.findById).toHaveBeenCalledWith('prob1');
      expect(result.testCases).toHaveLength(1); // Only non-hidden test case
      expect(result.testCases[0].isHidden).toBe(false);
      expect(result.solution).toBeUndefined();
    });

    it('should throw error if problem not found', async () => {
      const createMockQuery = (finalResult) => {
        const mockQuery = {};
        let callCount = 0;
        const populate = jest.fn(() => {
          callCount++;
          if (callCount >= 3) { // After 3 populate calls, resolve
            return Promise.resolve(finalResult);
          }
          return mockQuery;
        });
        mockQuery.populate = populate;
        return mockQuery;
      };

      const mockQuery = createMockQuery(null);
      Problem.findById.mockReturnValue(mockQuery);

      await expect(problemsService.getProblemById('nonexistent'))
        .rejects.toThrow('Problem not found');
    });
  });

  describe('createProblem', () => {
    it('should create and save a new problem', async () => {
      const problemData = { title: 'New Problem', description: 'Test desc' };
      const mockSavedProblem = { ...problemData, _id: 'newId' };
      const mockProblem = {
        ...problemData,
        save: jest.fn().mockResolvedValue(mockSavedProblem)
      };

      Problem.mockImplementation(() => mockProblem);

      const result = await problemsService.createProblem(problemData);

      expect(Problem).toHaveBeenCalledWith(problemData);
      expect(mockProblem.save).toHaveBeenCalled();
      expect(result).toBe(mockSavedProblem);
    });
  });

  describe('updateProblem', () => {
    it('should update problem and return updated version', async () => {
      const updateData = { title: 'Updated Title' };
      const mockUpdatedProblem = { _id: 'prob1', ...updateData };

      Problem.findByIdAndUpdate.mockResolvedValue(mockUpdatedProblem);

      const result = await problemsService.updateProblem('prob1', updateData);

      expect(Problem.findByIdAndUpdate).toHaveBeenCalledWith('prob1', updateData, { new: true });
      expect(result).toBe(mockUpdatedProblem);
    });
  });

  describe('deleteProblem', () => {
    it('should delete problem by id', async () => {
      const mockDeletedProblem = { _id: 'prob1', title: 'Deleted Problem' };

      Problem.findByIdAndDelete.mockResolvedValue(mockDeletedProblem);

      const result = await problemsService.deleteProblem('prob1');

      expect(Problem.findByIdAndDelete).toHaveBeenCalledWith('prob1');
      expect(result).toBe(mockDeletedProblem);
    });
  });

  describe('getProblemsByStack', () => {
    it('should return problems for specific stack', async () => {
      const mockProblems = [{ _id: 'prob1', stackId: 'stack1' }];
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockProblems)
      };

      Problem.find.mockReturnValue(mockQuery);

      const result = await problemsService.getProblemsByStack('stack1');

      expect(Problem.find).toHaveBeenCalledWith({ stackId: 'stack1', isPublished: true });
      expect(result).toBe(mockProblems);
    });
  });

  describe('searchProblems', () => {
    it('should search problems with regex patterns', async () => {
      const mockProblems = [{ _id: 'prob1', title: 'JavaScript Basics' }];
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockProblems)
      };

      Problem.find.mockReturnValue(mockQuery);

      const result = await problemsService.searchProblems('javascript');

      const expectedQuery = {
        isPublished: true,
        $or: [
          { title: { $regex: 'javascript', $options: 'i' } },
          { description: { $regex: 'javascript', $options: 'i' } },
          { tags: { $in: [/javascript/i] } }
        ]
      };
      expect(Problem.find).toHaveBeenCalledWith(expectedQuery);
      expect(result).toBe(mockProblems);
    });
  });

  describe('getPracticeProblems', () => {
    it('should return only practice problems', async () => {
      const mockProblems = [{ _id: 'prob1', problemType: 'practice' }];
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockProblems)
      };

      Problem.find.mockReturnValue(mockQuery);

      const result = await problemsService.getPracticeProblems({ stackId: 'stack1' });

      expect(Problem.find).toHaveBeenCalledWith({
        isPublished: true,
        stackId: 'stack1',
        problemType: 'practice'
      });
      expect(result).toBe(mockProblems);
    });
  });
});