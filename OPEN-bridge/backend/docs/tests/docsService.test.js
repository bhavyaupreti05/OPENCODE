const docsService = require('../services/docsService');
const DocsEntry = require('../models/DocsEntry');

// Mock dependencies
jest.mock('../models/DocsEntry');

describe('DocsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDocs', () => {
    it('should return docs with default filters', async () => {
      const mockDocs = [{ _id: 'doc1', title: 'Test Doc' }];
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockDocs)
      };

      DocsEntry.find.mockReturnValue(mockQuery);

      const result = await docsService.getDocs();

      expect(DocsEntry.find).toHaveBeenCalledWith({ isPublished: true });
      expect(result).toBe(mockDocs);
    });

    it('should apply all filters correctly', async () => {
      const filters = {
        stackId: 'stack1',
        skillId: 'skill1',
        difficultyId: 'diff1',
        contentType: 'article',
        tags: ['tag1', 'tag2']
      };
      const mockDocs = [{ _id: 'doc1' }];
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockDocs)
      };

      DocsEntry.find.mockReturnValue(mockQuery);

      const result = await docsService.getDocs(filters);

      expect(DocsEntry.find).toHaveBeenCalledWith({
        isPublished: true,
        stackId: 'stack1',
        skillId: 'skill1',
        difficultyId: 'diff1',
        contentType: 'article',
        tags: { $in: ['tag1', 'tag2'] }
      });
      expect(result).toBe(mockDocs);
    });
  });

  describe('getDocById', () => {
    it('should return doc with populated fields', async () => {
      const mockDoc = { _id: 'doc1', title: 'Test Doc' };
      const mockQuery = {
        populate: jest.fn().mockReturnThis()
      };
      mockQuery.populate.mockReturnValue(mockQuery); // Chain populate calls
      DocsEntry.findById.mockReturnValue(mockQuery);

      const result = await docsService.getDocById('doc1');

      expect(DocsEntry.findById).toHaveBeenCalledWith('doc1');
      expect(result).toBe(mockQuery);
    });
  });

  describe('createDoc', () => {
    it('should create and save a new doc', async () => {
      const docData = { title: 'New Doc', content: 'Content' };
      const mockSavedDoc = { _id: 'doc1', ...docData };
      const mockDoc = {
        ...docData,
        save: jest.fn().mockResolvedValue(mockSavedDoc)
      };

      DocsEntry.mockImplementation(() => mockDoc);

      const result = await docsService.createDoc(docData);

      expect(DocsEntry).toHaveBeenCalledWith(docData);
      expect(mockDoc.save).toHaveBeenCalled();
      expect(result).toBe(mockSavedDoc);
    });
  });

  describe('updateDoc', () => {
    it('should update doc and return updated version', async () => {
      const updateData = { title: 'Updated Title' };
      const mockUpdatedDoc = { _id: 'doc1', ...updateData };

      DocsEntry.findByIdAndUpdate.mockResolvedValue(mockUpdatedDoc);

      const result = await docsService.updateDoc('doc1', updateData);

      expect(DocsEntry.findByIdAndUpdate).toHaveBeenCalledWith('doc1', updateData, { new: true });
      expect(result).toBe(mockUpdatedDoc);
    });
  });

  describe('deleteDoc', () => {
    it('should delete doc by id', async () => {
      const mockDeletedDoc = { _id: 'doc1', title: 'Deleted Doc' };

      DocsEntry.findByIdAndDelete.mockResolvedValue(mockDeletedDoc);

      const result = await docsService.deleteDoc('doc1');

      expect(DocsEntry.findByIdAndDelete).toHaveBeenCalledWith('doc1');
      expect(result).toBe(mockDeletedDoc);
    });
  });

  describe('getDocsByStack', () => {
    it('should return docs for specific stack', async () => {
      const mockDocs = [{ _id: 'doc1', stackId: 'stack1' }];
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockDocs)
      };

      DocsEntry.find.mockReturnValue(mockQuery);

      const result = await docsService.getDocsByStack('stack1');

      expect(DocsEntry.find).toHaveBeenCalledWith({ stackId: 'stack1', isPublished: true });
      expect(result).toBe(mockDocs);
    });
  });

  describe('getDocsBySkill', () => {
    it('should return docs for specific skill', async () => {
      const mockDocs = [{ _id: 'doc1', skillId: 'skill1' }];
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockDocs)
      };

      DocsEntry.find.mockReturnValue(mockQuery);

      const result = await docsService.getDocsBySkill('skill1');

      expect(DocsEntry.find).toHaveBeenCalledWith({ skillId: 'skill1', isPublished: true });
      expect(result).toBe(mockDocs);
    });
  });

  describe('searchDocs', () => {
    it('should search docs with regex patterns', async () => {
      const mockDocs = [{ _id: 'doc1', title: 'JavaScript Basics' }];
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockDocs)
      };

      DocsEntry.find.mockReturnValue(mockQuery);

      const result = await docsService.searchDocs('javascript');

      expect(DocsEntry.find).toHaveBeenCalledWith({
        isPublished: true,
        $or: [
          { title: { $regex: 'javascript', $options: 'i' } },
          { content: { $regex: 'javascript', $options: 'i' } },
          { summary: { $regex: 'javascript', $options: 'i' } },
          { tags: { $in: [/javascript/i] } }
        ]
      });
      expect(result).toBe(mockDocs);
    });

    it('should apply additional filters during search', async () => {
      const filters = { stackId: 'stack1', skillId: 'skill1' };
      const mockDocs = [{ _id: 'doc1' }];
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockDocs)
      };

      DocsEntry.find.mockReturnValue(mockQuery);

      const result = await docsService.searchDocs('test', filters);

      const expectedQuery = {
        isPublished: true,
        stackId: 'stack1',
        skillId: 'skill1',
        $or: [
          { title: { $regex: 'test', $options: 'i' } },
          { content: { $regex: 'test', $options: 'i' } },
          { summary: { $regex: 'test', $options: 'i' } },
          { tags: { $in: [/test/i] } }
        ]
      };
      expect(DocsEntry.find).toHaveBeenCalledWith(expectedQuery);
      expect(result).toBe(mockDocs);
    });
  });
});