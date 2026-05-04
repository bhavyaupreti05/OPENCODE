const contributionProofService = require('../services/contributionProofService');

class ContributionProofController {
  async submitProof(req, res) {
    try {
      const userId = req.user?._id || req.body.userId; // placeholder until auth is wired
      const proof = await contributionProofService.createProof(userId, req.body);
      res.status(201).json(proof);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUserProofs(req, res) {
    try {
      const userId = req.user?._id || req.query.userId;
      const proofs = await contributionProofService.getProofsByUser(userId, {
        status: req.query.status
      });
      res.json(proofs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async verifyProof(req, res) {
    try {
      const verifierId = req.user?._id || req.body.verifierId;
      const proof = await contributionProofService.verifyProof(req.params.id, verifierId, req.body);
      res.json(proof);
    } catch (error) {
      if (error.message === 'Contribution proof not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  async getAllProofs(req, res) {
    try {
      const proofs = await contributionProofService.getAllProofs({
        status: req.query.status,
        userId: req.query.userId
      });
      res.json(proofs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ContributionProofController();