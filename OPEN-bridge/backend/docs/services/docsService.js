const DocsEntry = require('../models/DocsEntry');

class DocsService {
  async getDocs(filters = {}) {
    const query = { isPublished: true };

    if (filters.stackId) query.stackId = filters.stackId;
    if (filters.skillId) query.skillId = filters.skillId;
    if (filters.difficultyId) query.difficultyId = filters.difficultyId;
    if (filters.contentType) query.contentType = filters.contentType;
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    return await DocsEntry.find(query)
      .populate('stackId', 'name')
      .populate('skillId', 'name')
      .populate('difficultyId', 'name')
      .sort({ order: 1, createdAt: -1 });
  }

  async getDocById(id) {
    return await DocsEntry.findById(id)
      .populate('stackId', 'name')
      .populate('skillId', 'name')
      .populate('difficultyId', 'name')
      .populate('authorId', 'email');
  }

  async createDoc(docData) {
    const doc = new DocsEntry(docData);
    return await doc.save();
  }

  async updateDoc(id, updateData) {
    return await DocsEntry.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteDoc(id) {
    return await DocsEntry.findByIdAndDelete(id);
  }

  async getDocsByStack(stackId) {
    return await DocsEntry.find({ stackId, isPublished: true })
      .populate('skillId', 'name')
      .populate('difficultyId', 'name')
      .sort({ order: 1 });
  }

  async getDocsBySkill(skillId) {
    return await DocsEntry.find({ skillId, isPublished: true })
      .populate('stackId', 'name')
      .populate('difficultyId', 'name')
      .sort({ order: 1 });
  }

  async searchDocs(searchTerm, filters = {}) {
    const query = {
      isPublished: true,
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { content: { $regex: searchTerm, $options: 'i' } },
        { summary: { $regex: searchTerm, $options: 'i' } },
        { tags: { $in: [new RegExp(searchTerm, 'i')] } }
      ]
    };

    // Apply additional filters
    if (filters.stackId) query.stackId = filters.stackId;
    if (filters.skillId) query.skillId = filters.skillId;
    if (filters.difficultyId) query.difficultyId = filters.difficultyId;

    return await DocsEntry.find(query)
      .populate('stackId', 'name')
      .populate('skillId', 'name')
      .populate('difficultyId', 'name')
      .sort({ createdAt: -1 });
  }
}

module.exports = new DocsService();