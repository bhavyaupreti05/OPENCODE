const docsService = require('../services/docsService');

class DocsController {
  async getDocs(req, res) {
    try {
      const filters = {
        stackId: req.query.stackId,
        skillId: req.query.skillId,
        difficultyId: req.query.difficultyId,
        contentType: req.query.contentType,
        tags: req.query.tags ? req.query.tags.split(',') : null
      };

      const docs = await docsService.getDocs(filters);
      res.json({
        success: true,
        data: docs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getDoc(req, res) {
    try {
      const { id } = req.params;
      const doc = await docsService.getDocById(id);

      if (!doc) {
        return res.status(404).json({
          success: false,
          error: 'Documentation not found'
        });
      }

      res.json({
        success: true,
        data: doc
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async createDoc(req, res) {
    try {
      // TODO: Add admin role check
      const docData = {
        ...req.body,
        authorId: req.user.id
      };

      const doc = await docsService.createDoc(docData);
      res.status(201).json({
        success: true,
        data: doc
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateDoc(req, res) {
    try {
      const { id } = req.params;
      // TODO: Add admin role check or author check

      const doc = await docsService.updateDoc(id, req.body);
      if (!doc) {
        return res.status(404).json({
          success: false,
          error: 'Documentation not found'
        });
      }

      res.json({
        success: true,
        data: doc
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteDoc(req, res) {
    try {
      const { id } = req.params;
      // TODO: Add admin role check

      const doc = await docsService.deleteDoc(id);
      if (!doc) {
        return res.status(404).json({
          success: false,
          error: 'Documentation not found'
        });
      }

      res.json({
        success: true,
        message: 'Documentation deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async searchDocs(req, res) {
    try {
      const { q: searchTerm } = req.query;
      const filters = {
        stackId: req.query.stackId,
        skillId: req.query.skillId,
        difficultyId: req.query.difficultyId
      };

      if (!searchTerm) {
        return res.status(400).json({
          success: false,
          error: 'Search term is required'
        });
      }

      const docs = await docsService.searchDocs(searchTerm, filters);
      res.json({
        success: true,
        data: docs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new DocsController();