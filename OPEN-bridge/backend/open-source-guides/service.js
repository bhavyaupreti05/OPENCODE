const RepositoryGuide = require('./model');

class OpenSourceGuidesService {
  async createGuide(guideData) {
    const guide = new RepositoryGuide(guideData);
    return await guide.save();
  }

  async getAllGuides(filters = {}) {
    const query = { isActive: true };

    if (filters.language) {
      query.language = filters.language;
    }

    if (filters.difficulty) {
      query.difficulty = filters.difficulty;
    }

    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    return await RepositoryGuide.find(query).sort({ createdAt: -1 });
  }

  async getGuideById(id) {
    return await RepositoryGuide.findById(id);
  }

  async updateGuide(id, updateData) {
    return await RepositoryGuide.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
  }

  async deleteGuide(id) {
    return await RepositoryGuide.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
  }

  async getGuidesByLanguage(language) {
    return await RepositoryGuide.find({
      language,
      isActive: true
    }).sort({ createdAt: -1 });
  }

  async getGuidesByDifficulty(difficulty) {
    return await RepositoryGuide.find({
      difficulty,
      isActive: true
    }).sort({ createdAt: -1 });
  }

  async getGuidesByTags(tags) {
    return await RepositoryGuide.find({
      tags: { $in: tags },
      isActive: true
    }).sort({ createdAt: -1 });
  }
}

module.exports = new OpenSourceGuidesService();