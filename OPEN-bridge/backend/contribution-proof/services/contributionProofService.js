const ContributionProof = require('../models/ContributionProof');

class ContributionProofService {
  async createProof(userId, proofData) {
    const proof = new ContributionProof({
      userId,
      url: proofData.url,
      description: proofData.description,
      notes: proofData.notes
    });

    return await proof.save();
  }

  async getProofsByUser(userId, filters = {}) {
    const query = { userId };
    if (filters.status) {
      query.status = filters.status;
    }

    return await ContributionProof.find(query).sort({ createdAt: -1 });
  }

  async getProofById(id) {
    const proof = await ContributionProof.findById(id);
    if (!proof) {
      throw new Error('Contribution proof not found');
    }
    return proof;
  }

  async verifyProof(id, verifierId, verificationData) {
    const proof = await ContributionProof.findById(id);
    if (!proof) {
      throw new Error('Contribution proof not found');
    }

    proof.status = verificationData.status;
    proof.verifiedBy = verifierId;
    proof.verifiedAt = new Date();
    proof.notes = verificationData.notes || proof.notes;

    return await proof.save();
  }

  async getAllProofs(filters = {}) {
    const query = {};
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.userId) {
      query.userId = filters.userId;
    }

    return await ContributionProof.find(query)
      .sort({ createdAt: -1 });
  }
}

module.exports = new ContributionProofService();