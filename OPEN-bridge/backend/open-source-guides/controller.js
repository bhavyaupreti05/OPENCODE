const openSourceGuidesService = require('./service');
const { createGuideSchema, updateGuideSchema, guideIdSchema, filtersSchema } = require('./validators');

class OpenSourceGuidesController {
  async createGuide(req, res, next) {
    try {
      const { error, value } = createGuideSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.details[0].message
        });
      }

      const guide = await openSourceGuidesService.createGuide(value);
      res.status(201).json({
        message: 'Repository guide created successfully',
        guide
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllGuides(req, res, next) {
    try {
      const { error, value } = filtersSchema.validate(req.query);
      if (error) {
        return res.status(400).json({
          error: 'Invalid filter parameters',
          details: error.details[0].message
        });
      }

      const guides = await openSourceGuidesService.getAllGuides(value);
      res.json({
        guides,
        count: guides.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getGuideById(req, res, next) {
    try {
      const { error } = guideIdSchema.validate({ id: req.params.id });
      if (error) {
        return res.status(400).json({
          error: 'Invalid guide ID',
          details: error.details[0].message
        });
      }

      const guide = await openSourceGuidesService.getGuideById(req.params.id);
      if (!guide) {
        return res.status(404).json({
          error: 'Repository guide not found'
        });
      }

      res.json({ guide });
    } catch (error) {
      next(error);
    }
  }

  async updateGuide(req, res, next) {
    try {
      const { error: idError } = guideIdSchema.validate({ id: req.params.id });
      if (idError) {
        return res.status(400).json({
          error: 'Invalid guide ID',
          details: idError.details[0].message
        });
      }

      const { error: updateError, value } = updateGuideSchema.validate(req.body);
      if (updateError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: updateError.details[0].message
        });
      }

      const guide = await openSourceGuidesService.updateGuide(req.params.id, value);
      if (!guide) {
        return res.status(404).json({
          error: 'Repository guide not found'
        });
      }

      res.json({
        message: 'Repository guide updated successfully',
        guide
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteGuide(req, res, next) {
    try {
      const { error } = guideIdSchema.validate({ id: req.params.id });
      if (error) {
        return res.status(400).json({
          error: 'Invalid guide ID',
          details: error.details[0].message
        });
      }

      const guide = await openSourceGuidesService.deleteGuide(req.params.id);
      if (!guide) {
        return res.status(404).json({
          error: 'Repository guide not found'
        });
      }

      res.json({
        message: 'Repository guide deactivated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async getGuidesByLanguage(req, res, next) {
    try {
      const language = req.params.language;
      const validLanguages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Other'];

      if (!validLanguages.includes(language)) {
        return res.status(400).json({
          error: 'Invalid language parameter'
        });
      }

      const guides = await openSourceGuidesService.getGuidesByLanguage(language);
      res.json({
        guides,
        count: guides.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getGuidesByDifficulty(req, res, next) {
    try {
      const difficulty = req.params.difficulty;
      const validDifficulties = ['Beginner', 'Intermediate', 'Advanced'];

      if (!validDifficulties.includes(difficulty)) {
        return res.status(400).json({
          error: 'Invalid difficulty parameter'
        });
      }

      const guides = await openSourceGuidesService.getGuidesByDifficulty(difficulty);
      res.json({
        guides,
        count: guides.length
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OpenSourceGuidesController();