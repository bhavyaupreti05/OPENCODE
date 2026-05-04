const ContributionProof = require('./models/ContributionProof');
const contributionProofService = require('./services/contributionProofService');
const contributionProofController = require('./controllers/contributionProofController');
const contributionProofRoutes = require('./routes/contributionProof');

module.exports = {
  ContributionProof,
  contributionProofService,
  contributionProofController,
  routes: contributionProofRoutes
};