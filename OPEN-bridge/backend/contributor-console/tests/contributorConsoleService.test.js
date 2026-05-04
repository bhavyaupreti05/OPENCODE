const contributorConsoleService = require('../service');

// Mock the models
jest.mock('../../open-source-guides/model');
jest.mock('../../contribution-proof/models/ContributionProof');
jest.mock('../../auth/models/User');

const RepositoryGuide = require('../../open-source-guides/model');
const ContributionProof = require('../../contribution-proof/models/ContributionProof');
const User = require('../../auth/models/User');

const mockQuery = {
  sort: jest.fn().mockReturnThis(),
  populate: jest.fn().mockReturnThis(),
  limit: jest.fn().mockResolvedValue([])
};

RepositoryGuide.find = jest.fn().mockReturnValue(mockQuery);
RepositoryGuide.countDocuments = jest.fn();
RepositoryGuide.aggregate = jest.fn();
RepositoryGuide.create = jest.fn();
RepositoryGuide.findByIdAndUpdate = jest.fn();

ContributionProof.find = jest.fn().mockReturnValue(mockQuery);
ContributionProof.countDocuments = jest.fn();
ContributionProof.aggregate = jest.fn();
ContributionProof.findByIdAndUpdate = jest.fn().mockReturnValue(mockQuery);

User.find = jest.fn().mockReturnValue(mockQuery);
User.countDocuments = jest.fn();
User.aggregate = jest.fn();

describe('ContributorConsoleService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAnalytics', () => {
    it('should return comprehensive analytics data', async () => {
      // Mock data for guides
      RepositoryGuide.countDocuments.mockResolvedValue(5);
      RepositoryGuide.aggregate
        .mockResolvedValueOnce([{ _id: 'JavaScript', count: 3 }])
        .mockResolvedValueOnce([{ _id: 'Beginner', count: 4 }]);

      // Mock data for proofs
      ContributionProof.countDocuments.mockResolvedValue(10);
      ContributionProof.aggregate.mockResolvedValue([{ _id: 'pending', count: 7 }]);
      ContributionProof.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([])
      });

      // Mock data for users
      User.countDocuments.mockResolvedValue(25);
      User.aggregate.mockResolvedValue([{ _id: 'user', count: 20 }]);
      User.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([])
      });

      const result = await contributorConsoleService.getAnalytics();

      expect(result).toHaveProperty('guides');
      expect(result).toHaveProperty('proofs');
      expect(result).toHaveProperty('users');
      expect(result).toHaveProperty('generatedAt');
      expect(result.guides.total).toBe(5);
      expect(result.proofs.total).toBe(10);
      expect(result.users.total).toBe(25);
    });
  });

  describe('manageGuide', () => {
    it('should create a new guide', async () => {
      const guideData = { name: 'Test Guide' };
      const mockGuide = { ...guideData, _id: '123' };
      RepositoryGuide.create.mockResolvedValue(mockGuide);

      const result = await contributorConsoleService.manageGuide('create', guideData);

      expect(RepositoryGuide.create).toHaveBeenCalledWith(guideData);
      expect(result).toEqual(mockGuide);
    });

    it('should update a guide', async () => {
      const guideData = { id: '123', name: 'Updated Guide' };
      const mockUpdatedGuide = { _id: '123', name: 'Updated Guide' };
      RepositoryGuide.findByIdAndUpdate.mockResolvedValue(mockUpdatedGuide);

      const result = await contributorConsoleService.manageGuide('update', guideData);

      expect(RepositoryGuide.findByIdAndUpdate).toHaveBeenCalledWith('123', { name: 'Updated Guide' }, { new: true });
      expect(result).toEqual(mockUpdatedGuide);
    });

    it('should delete a guide', async () => {
      const guideData = { id: '123' };
      const mockDeletedGuide = { _id: '123', isActive: false };
      RepositoryGuide.findByIdAndUpdate.mockResolvedValue(mockDeletedGuide);

      const result = await contributorConsoleService.manageGuide('delete', guideData);

      expect(RepositoryGuide.findByIdAndUpdate).toHaveBeenCalledWith('123', { isActive: false }, { new: true });
      expect(result).toEqual(mockDeletedGuide);
    });

    it('should throw error for invalid action', async () => {
      await expect(contributorConsoleService.manageGuide('invalid', {})).rejects.toThrow('Invalid action');
    });
  });

  describe('verifyProof', () => {
    it('should verify a contribution proof', async () => {
      const proofId = '123';
      const verificationData = {
        status: 'verified',
        notes: 'Great work!',
        verifiedBy: '456'
      };
      const mockVerifiedProof = {
        _id: '123',
        status: 'verified',
        notes: 'Great work!',
        verifiedAt: expect.any(Date),
        verifiedBy: '456'
      };

      ContributionProof.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockVerifiedProof)
      });

      const result = await contributorConsoleService.verifyProof(proofId, verificationData);

      expect(ContributionProof.findByIdAndUpdate).toHaveBeenCalledWith(
        proofId,
        expect.objectContaining({
          status: 'verified',
          notes: 'Great work!',
          verifiedBy: '456',
          verifiedAt: expect.any(Date)
        }),
        { new: true }
      );
      expect(result).toEqual(mockVerifiedProof);
    });
  });

  describe('getAllGuides', () => {
    it('should return all active guides', async () => {
      const mockGuides = [{ name: 'Guide 1' }, { name: 'Guide 2' }];
      mockQuery.sort.mockResolvedValue(mockGuides);

      const result = await contributorConsoleService.getAllGuides();

      expect(RepositoryGuide.find).toHaveBeenCalledWith({ isActive: true });
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockGuides);
    });
  });

  describe('getAllProofs', () => {
    it('should return all proofs with populated data', async () => {
      const mockProofs = [{ _id: '1', status: 'pending' }];
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockProofs)
      };
      ContributionProof.find.mockReturnValue(mockQuery);

      const result = await contributorConsoleService.getAllProofs();

      expect(ContributionProof.find).toHaveBeenCalled();
      expect(mockQuery.populate).toHaveBeenCalledWith('userId', 'email');
      expect(mockQuery.populate).toHaveBeenCalledWith('verifiedBy', 'email');
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockProofs);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users with populated roles', async () => {
      const mockUsers = [{ email: 'user@example.com' }];
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockUsers)
      };
      User.find.mockReturnValue(mockQuery);

      const result = await contributorConsoleService.getAllUsers();

      expect(User.find).toHaveBeenCalled();
      expect(mockQuery.populate).toHaveBeenCalledWith('role', 'name');
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockUsers);
    });
  });
});