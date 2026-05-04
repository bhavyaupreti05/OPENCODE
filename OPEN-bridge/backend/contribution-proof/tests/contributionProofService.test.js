const contributionProofService = require('../services/contributionProofService');
const ContributionProof = require('../models/ContributionProof');

jest.mock('../models/ContributionProof');

describe('ContributionProofService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProof', () => {
    it('should create and save a proof for the user', async () => {
      const payload = { url: 'https://github.com/example/pr', description: 'Fix bug', notes: 'PR submitted' };
      const mockProof = { ...payload, save: jest.fn().mockResolvedValue(payload) };
      ContributionProof.mockImplementation(() => mockProof);

      const result = await contributionProofService.createProof('user1', payload);

      expect(ContributionProof).toHaveBeenCalledWith({
        userId: 'user1',
        url: payload.url,
        description: payload.description,
        notes: payload.notes
      });
      expect(mockProof.save).toHaveBeenCalled();
      expect(result).toBe(payload);
    });
  });

  describe('getProofsByUser', () => {
    it('should return proofs filtered by user and status', async () => {
      const mockProofs = [{ _id: 'proof1' }];
      const mockQuery = {
        sort: jest.fn().mockResolvedValue(mockProofs)
      };
      ContributionProof.find.mockReturnValue(mockQuery);

      const result = await contributionProofService.getProofsByUser('user1', { status: 'pending' });

      expect(ContributionProof.find).toHaveBeenCalledWith({ userId: 'user1', status: 'pending' });
      expect(result).toBe(mockProofs);
    });
  });

  describe('getProofById', () => {
    it('should return proof when found', async () => {
      ContributionProof.findById.mockResolvedValue({ _id: 'proof1' });

      const result = await contributionProofService.getProofById('proof1');

      expect(ContributionProof.findById).toHaveBeenCalledWith('proof1');
      expect(result).toEqual({ _id: 'proof1' });
    });

    it('should throw when proof not found', async () => {
      ContributionProof.findById.mockResolvedValue(null);

      await expect(contributionProofService.getProofById('bad')).rejects.toThrow('Contribution proof not found');
    });
  });

  describe('verifyProof', () => {
    it('should verify and save a proof when found', async () => {
      const existingProof = { status: 'pending', save: jest.fn().mockResolvedValue(true) };
      ContributionProof.findById.mockResolvedValue(existingProof);

      const result = await contributionProofService.verifyProof('proof1', 'verifier1', { status: 'verified', notes: 'Looks good' });

      expect(ContributionProof.findById).toHaveBeenCalledWith('proof1');
      expect(existingProof.status).toBe('verified');
      expect(existingProof.verifiedBy).toBe('verifier1');
      expect(existingProof.notes).toBe('Looks good');
      expect(existingProof.save).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should throw when proof not found', async () => {
      ContributionProof.findById.mockResolvedValue(null);

      await expect(contributionProofService.verifyProof('bad', 'verifier1', { status: 'verified' })).rejects.toThrow('Contribution proof not found');
    });
  });
});