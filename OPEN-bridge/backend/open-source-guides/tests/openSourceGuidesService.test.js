const openSourceGuidesService = require('../service');
const RepositoryGuide = require('../model');

// Mock the model
jest.mock('../model');

const mockQuery = {
  sort: jest.fn().mockReturnThis()
};

RepositoryGuide.find = jest.fn().mockReturnValue(mockQuery);
RepositoryGuide.findById = jest.fn();
RepositoryGuide.findByIdAndUpdate = jest.fn();

describe('OpenSourceGuidesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createGuide', () => {
    it('should create a new repository guide', async () => {
      const guideData = {
        name: 'Test Guide',
        description: 'A test repository guide',
        repositoryUrl: 'https://github.com/test/repo',
        language: 'JavaScript',
        difficulty: 'Beginner',
        contributionGuide: 'How to contribute',
        gettingStartedSteps: [{ step: '1', description: 'Clone repo' }],
        projectOverview: 'A test project'
      };

      const mockGuide = { ...guideData, _id: '123', save: jest.fn().mockResolvedValue(guideData) };
      RepositoryGuide.mockImplementation(() => mockGuide);

      const result = await openSourceGuidesService.createGuide(guideData);

      expect(RepositoryGuide).toHaveBeenCalledWith(guideData);
      expect(mockGuide.save).toHaveBeenCalled();
      expect(result).toEqual(guideData);
    });
  });

  describe('getAllGuides', () => {
    it('should return all active guides without filters', async () => {
      const mockGuides = [{ name: 'Guide 1' }, { name: 'Guide 2' }];
      mockQuery.sort.mockResolvedValue(mockGuides);

      const result = await openSourceGuidesService.getAllGuides();

      expect(RepositoryGuide.find).toHaveBeenCalledWith({ isActive: true });
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockGuides);
    });

    it('should apply language filter', async () => {
      const mockGuides = [{ name: 'JS Guide' }];
      mockQuery.sort.mockResolvedValue(mockGuides);

      const result = await openSourceGuidesService.getAllGuides({ language: 'JavaScript' });

      expect(RepositoryGuide.find).toHaveBeenCalledWith({
        isActive: true,
        language: 'JavaScript'
      });
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockGuides);
    });

    it('should apply tags filter', async () => {
      const mockGuides = [{ name: 'Tagged Guide' }];
      mockQuery.sort.mockResolvedValue(mockGuides);

      const result = await openSourceGuidesService.getAllGuides({ tags: ['web', 'frontend'] });

      expect(RepositoryGuide.find).toHaveBeenCalledWith({
        isActive: true,
        tags: { $in: ['web', 'frontend'] }
      });
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockGuides);
    });
  });

  describe('getGuideById', () => {
    it('should return a guide by ID', async () => {
      const mockGuide = { _id: '123', name: 'Test Guide' };
      RepositoryGuide.findById.mockResolvedValue(mockGuide);

      const result = await openSourceGuidesService.getGuideById('123');

      expect(RepositoryGuide.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockGuide);
    });
  });

  describe('updateGuide', () => {
    it('should update a guide', async () => {
      const updateData = { name: 'Updated Guide' };
      const mockUpdatedGuide = { _id: '123', name: 'Updated Guide' };
      RepositoryGuide.findByIdAndUpdate.mockResolvedValue(mockUpdatedGuide);

      const result = await openSourceGuidesService.updateGuide('123', updateData);

      expect(RepositoryGuide.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        updateData,
        { new: true, runValidators: true }
      );
      expect(result).toEqual(mockUpdatedGuide);
    });
  });

  describe('deleteGuide', () => {
    it('should deactivate a guide', async () => {
      const mockDeactivatedGuide = { _id: '123', isActive: false };
      RepositoryGuide.findByIdAndUpdate.mockResolvedValue(mockDeactivatedGuide);

      const result = await openSourceGuidesService.deleteGuide('123');

      expect(RepositoryGuide.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { isActive: false },
        { new: true }
      );
      expect(result).toEqual(mockDeactivatedGuide);
    });
  });

  describe('getGuidesByLanguage', () => {
    it('should return guides filtered by language', async () => {
      const mockGuides = [{ name: 'JS Guide', language: 'JavaScript' }];
      mockQuery.sort.mockResolvedValue(mockGuides);

      const result = await openSourceGuidesService.getGuidesByLanguage('JavaScript');

      expect(RepositoryGuide.find).toHaveBeenCalledWith({
        language: 'JavaScript',
        isActive: true
      });
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockGuides);
    });
  });

  describe('getGuidesByDifficulty', () => {
    it('should return guides filtered by difficulty', async () => {
      const mockGuides = [{ name: 'Beginner Guide', difficulty: 'Beginner' }];
      mockQuery.sort.mockResolvedValue(mockGuides);

      const result = await openSourceGuidesService.getGuidesByDifficulty('Beginner');

      expect(RepositoryGuide.find).toHaveBeenCalledWith({
        difficulty: 'Beginner',
        isActive: true
      });
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockGuides);
    });
  });

  describe('getGuidesByTags', () => {
    it('should return guides filtered by tags', async () => {
      const mockGuides = [{ name: 'Tagged Guide', tags: ['web'] }];
      mockQuery.sort.mockResolvedValue(mockGuides);

      const result = await openSourceGuidesService.getGuidesByTags(['web', 'frontend']);

      expect(RepositoryGuide.find).toHaveBeenCalledWith({
        tags: { $in: ['web', 'frontend'] },
        isActive: true
      });
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockGuides);
    });
  });
});