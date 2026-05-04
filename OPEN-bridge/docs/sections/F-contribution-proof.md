# Section F — Contribution Proof

## Goal
Build the backend support for submission and verification of real-world contribution proof. This section helps learners move from simulation into actual open-source confidence by letting them submit links to contributions and receive verification.

## What was implemented
- Added a dedicated `contribution-proof` backend module.
- Created a `ContributionProof` model with fields for:
  - `userId`, `url`, `description`
  - `status` (`pending`, `verified`, `rejected`)
  - `verifiedBy`, `verifiedAt`, `notes`
- Implemented service methods for:
  - creating a contribution proof submission
  - listing proofs for a user with optional status filtering
  - verifying a proof submission
  - listing all proofs for admin review
- Added Express API routes under `/api/contribution-proof`:
  - `POST /api/contribution-proof`
  - `GET /api/contribution-proof`
  - `PUT /api/contribution-proof/:id/verify`
  - `GET /api/contribution-proof/admin/all`
- Added validation middleware for proof payloads, verification payloads, and proof IDs.

## Frontend Implementation
- Added `ContributionProofSubmit` component for submitting new proofs
- Added `ContributionProofList` component for viewing user's submitted proofs
- Added routes:
  - `/contribution-proof/submit`
  - `/contribution-proof`
- Updated Dashboard with "Submit Contribution" button
- Added CSS styles for form and list components

## Notes
- The current controller scaffolds authentication-aware user lookup. Auth middleware can be connected later to enforce ownership and verification roles.
- Verification actions are marked as admin/contributor-only in comments and should be gated once role middleware is available.
- This module is the next step after simulations for learners who are ready to submit real contribution evidence.
