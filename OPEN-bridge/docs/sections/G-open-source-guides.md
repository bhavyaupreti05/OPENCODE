# Section G — Open-Source Guides

## Goal
Build the backend support for repository guides and contribution guidance. This section provides learners with structured information about open-source projects, including contribution guidelines, project overviews, and step-by-step guides for contributing to specific repositories.

## What was implemented
- Added a dedicated `open-source-guides` backend module.
- Created a `RepositoryGuide` model with fields for:
  - `name`, `description`, `repositoryUrl`, `language`, `difficulty`
  - `contributionGuide`, `gettingStartedSteps`, `projectOverview`
  - `tags`, `isActive`
- Implemented service methods for:
  - creating and managing repository guides
  - listing guides with filtering by language, difficulty, tags
  - getting guide details
  - updating guide information
- Added Express API routes under `/api/open-source-guides`:
  - `GET /api/open-source-guides`
  - `GET /api/open-source-guides/:id`
  - `POST /api/open-source-guides` (admin)
  - `PUT /api/open-source-guides/:id` (admin)
  - `DELETE /api/open-source-guides/:id` (admin)
  - `GET /api/open-source-guides/language/:language`
  - `GET /api/open-source-guides/difficulty/:difficulty`
- Added validation middleware for guide payloads and guide IDs.

## Frontend Implementation
- Added `OpenSourceGuidesList` component for browsing and filtering guides
- Added `OpenSourceGuideDetail` component for viewing detailed guide information
- Added routes:
  - `/open-source-guides`
  - `/open-source-guides/:id`
- Updated Dashboard with "Browse Guides" button
- Added comprehensive filtering by language, difficulty, and tags
- Added CSS styles for guide cards, filters, and detail views
- Integrated with contribution proof submission flow

## Notes
- This module provides the foundation for learners to discover and learn about real open-source projects.
- Guides can be curated by maintainers and include detailed contribution instructions.
- Integration with contribution proof system will allow learners to reference these guides when submitting proofs.