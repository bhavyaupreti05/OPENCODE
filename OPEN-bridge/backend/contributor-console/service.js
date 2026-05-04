const RepositoryGuide = require('../open-source-guides/model');
const ContributionProof = require('../contribution-proof/models/ContributionProof');
const User = require('../auth/models/User');

class ContributorConsoleService {
  async getGuidesOverview() {
    const total = await RepositoryGuide.countDocuments({ isActive: true });
    const byLanguage = await RepositoryGuide.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$language', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const byDifficulty = await RepositoryGuide.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return {
      total,
      byLanguage,
      byDifficulty
    };
  }

  async getProofsOverview() {
    const total = await ContributionProof.countDocuments();
    const byStatus = await ContributionProof.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const recent = await ContributionProof.find()
      .populate('userId', 'email')
      .sort({ createdAt: -1 })
      .limit(10);

    return {
      total,
      byStatus,
      recent
    };
  }

  async getUsersOverview() {
    const total = await User.countDocuments();
    const byRole = await User.aggregate([
      { $lookup: { from: 'roles', localField: 'role', foreignField: '_id', as: 'roleInfo' } },
      { $unwind: '$roleInfo' },
      { $group: { _id: '$roleInfo.name', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const recent = await User.find()
      .populate('role', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    return {
      total,
      byRole,
      recent
    };
  }

  async getAnalytics() {
    const guidesOverview = await this.getGuidesOverview();
    const proofsOverview = await this.getProofsOverview();
    const usersOverview = await this.getUsersOverview();

    return {
      guides: guidesOverview,
      proofs: proofsOverview,
      users: usersOverview,
      generatedAt: new Date()
    };
  }

  async manageGuide(action, guideData) {
    switch (action) {
      case 'create':
        return await RepositoryGuide.create(guideData);
      case 'update':
        const { id, ...updateData } = guideData;
        return await RepositoryGuide.findByIdAndUpdate(id, updateData, { new: true });
      case 'delete':
        return await RepositoryGuide.findByIdAndUpdate(guideData.id, { isActive: false }, { new: true });
      default:
        throw new Error('Invalid action');
    }
  }

  async verifyProof(proofId, verificationData) {
    const { status, notes } = verificationData;
    return await ContributionProof.findByIdAndUpdate(
      proofId,
      {
        status,
        notes,
        verifiedAt: new Date(),
        verifiedBy: verificationData.verifiedBy
      },
      { new: true }
    ).populate('userId', 'email');
  }

  async getAllGuides() {
    return await RepositoryGuide.find({ isActive: true }).sort({ createdAt: -1 });
  }

  async getAllProofs() {
    return await ContributionProof.find()
      .populate('userId', 'email')
      .populate('verifiedBy', 'email')
      .sort({ createdAt: -1 });
  }

  async getAllUsers() {
    return await User.find()
      .populate('role', 'name')
      .sort({ createdAt: -1 });
  }
}

module.exports = new ContributorConsoleService();