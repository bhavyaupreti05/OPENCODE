const contributorConsoleService = require('./service');
const { guideActionSchema, proofVerificationSchema, proofIdSchema } = require('./validators');

class ContributorConsoleController {
  async getAnalytics(req, res, next) {
    try {
      const analytics = await contributorConsoleService.getAnalytics();
      res.json(analytics);
    } catch (error) {
      next(error);
    }
  }

  async manageGuide(req, res, next) {
    try {
      const { error, value } = guideActionSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.details[0].message
        });
      }

      const result = await contributorConsoleService.manageGuide(value.action, value.guideData);

      let message;
      switch (value.action) {
        case 'create':
          message = 'Repository guide created successfully';
          break;
        case 'update':
          message = 'Repository guide updated successfully';
          break;
        case 'delete':
          message = 'Repository guide deactivated successfully';
          break;
      }

      res.json({
        message,
        guide: result
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyProof(req, res, next) {
    try {
      const { error: idError } = proofIdSchema.validate({ proofId: req.params.proofId });
      if (idError) {
        return res.status(400).json({
          error: 'Invalid proof ID',
          details: idError.details[0].message
        });
      }

      const { error: verificationError, value } = proofVerificationSchema.validate(req.body);
      if (verificationError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: verificationError.details[0].message
        });
      }

      const proof = await contributorConsoleService.verifyProof(req.params.proofId, value);
      if (!proof) {
        return res.status(404).json({
          error: 'Contribution proof not found'
        });
      }

      res.json({
        message: `Proof ${value.status} successfully`,
        proof
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllGuides(req, res, next) {
    try {
      const guides = await contributorConsoleService.getAllGuides();
      res.json({
        guides,
        count: guides.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllProofs(req, res, next) {
    try {
      const proofs = await contributorConsoleService.getAllProofs();
      res.json({
        proofs,
        count: proofs.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await contributorConsoleService.getAllUsers();
      res.json({
        users,
        count: users.length
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ContributorConsoleController();