# Section E — Simulation Engine

## Goal
Build the backend support for simulation problems that mirror real-world debugging and bug-fixing tasks. This section enables learners to move from isolated practice problems into a more realistic contribution-style challenge.

## What was implemented
- Added a dedicated `simulations` backend module.
- Created a `Simulation` model with fields for:
  - `title`, `description`, `difficultyId`, `stackId`, `skillId`
  - scenario context, bug description, reproduction steps, expected outcomes, and fix hints
  - starter code, hidden/public test cases, solution, tags, and published state
- Implemented service methods for:
  - listing published simulations with optional filters
  - retrieving a single simulation by ID with hidden test-case filtering
  - creating, updating, deleting, and searching simulation problems
- Added Express API routes under `/api/simulations`:
  - `GET /api/simulations`
  - `GET /api/simulations/search?q=...`
  - `GET /api/simulations/:id`
  - `GET /api/simulations/stack/:stackId`
  - `GET /api/simulations/skill/:skillId`
  - `GET /api/simulations/difficulty/:difficultyId`
  - `POST /api/simulations`
  - `PUT /api/simulations/:id`
  - `DELETE /api/simulations/:id`
- Seeded an initial simulation example in `backend/scripts/seed.js`.

## Notes
- The simulation API is currently open, but admin-only actions are scaffolded and can be gated behind auth when the auth middleware is wired.
- The route `/api/simulations/:id` strips hidden test cases and removes the solution before returning data to the client.
- Frontend integration remains to be built in the next phase.
