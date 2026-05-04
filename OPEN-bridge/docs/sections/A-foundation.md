# A - Foundation

## Purpose

Establish the foundational architecture, documentation discipline, and core contracts for OPEN-bridge. This section sets up the modular system structure, defines domain models and API contracts, and configures development tooling without implementing business logic.

## Exact Scope

- Project structure with MERN stack compliance
- Modular frontend and backend organization
- Documentation framework and protocols
- Core domain model definitions
- Public API contract documentation
- Development tooling setup (linting, formatting, testing)
- Architecture Decision Records (ADRs)
- Module README templates

## Module(s) Created or Changed

### Frontend Modules (Structure Only)
- app-shell
- auth
- onboarding
- user-profile
- stack-selection
- skill-path
- docs-library
- problem-catalog
- practice-workspace
- simulation-workspace
- progress
- recommendation
- open-source-bridge
- contribution-proof
- contributor-console
- feedback-help

### Backend Modules (Structure Only)
- auth
- users
- onboarding
- stacks
- skills
- docs
- problems
- simulations
- submissions
- evaluation-runner
- progress
- recommendations
- open-source-guides
- contribution-proof
- contributors
- feedback
- audit

## Data Models Created or Changed

### Core Domain Models

- **User**: Represents platform users with authentication and profile data
  - Fields: _id, email, passwordHash, role, createdAt, updatedAt
  - Relations: onboarding, progress, submissions

- **Role**: User roles (normal, verified_contributor, admin)
  - Fields: _id, name, permissions

- **TechStack**: Available technology stacks
  - Fields: _id, name, description, supported (boolean), executionSupported (boolean)

- **SkillDomain**: Skill areas within stacks
  - Fields: _id, name, description, stackId

- **DifficultyLevel**: Difficulty tiers (beginner, intermediate, advanced)
  - Fields: _id, name, description

- **LearningPath**: Structured learning sequences
  - Fields: _id, stackId, skillId, difficultyId, nodes (array of nodeIds)

- **LearningNode**: Individual learning steps
  - Fields: _id, pathId, title, type (learn/docs, practice, simulation), contentId, prerequisites (array), unlocked (boolean)

- **Problem**: Practice problems
  - Fields: _id, title, description, starterCode, tests (visible/hidden), stackId, skillId, difficultyId

- **Simulation**: Bug simulation scenarios
  - Fields: _id, title, description, buggyCode, expectedBehavior, hints, tests, stackId, skillId, difficultyId

- **Submission**: User code submissions
  - Fields: _id, userId, problemId/simulationId, code, status (pending, passed, failed), results, submittedAt

- **Progress**: User learning progress
  - Fields: _id, userId, pathId, completedNodes (array), currentLevel, xp, streak

- **Streak**: Daily activity streaks
  - Fields: _id, userId, currentStreak, longestStreak, lastActivityDate

- **XPEvent**: Experience point events
  - Fields: _id, userId, eventType, xpGained, timestamp

- **RepoGuide**: Curated repository guides
  - Fields: _id, repoName, stackId, difficultyId, purpose, folderWalkthrough, prerequisites, issueTypes, prChecklist, readingOrder

- **ContributionProof**: User contribution proofs
  - Fields: _id, userId, url, status (pending, verified, rejected), verifiedBy, verifiedAt

- **ContributorProfile**: Verified contributor profiles
  - Fields: _id, userId, expertise (array of stack/skill tags), reviewCount, approvalCount

- **Feedback**: User feedback on content
  - Fields: _id, userId, contentType, contentId, rating (helpful/confusing), comment

## API Routes Created or Changed

### Authentication Routes
- POST /api/auth/signup - User registration
- POST /api/auth/login - User login
- POST /api/auth/refresh - Token refresh
- POST /api/auth/logout - User logout

### User Management Routes
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile

### Onboarding Routes
- POST /api/onboarding - Submit onboarding data
- GET /api/onboarding - Get user onboarding status

### Stack and Skill Routes
- GET /api/stacks - List available stacks
- GET /api/skills - List available skills
- GET /api/stacks/:id/skills - Get skills for stack

### Learning Path Routes
- GET /api/paths - Get user's learning paths
- GET /api/paths/:id - Get specific path details
- GET /api/paths/:id/nodes - Get path nodes

### Documentation Routes
- GET /api/docs - List docs for user context
- GET /api/docs/:id - Get specific doc content

### Problem Routes
- GET /api/problems - List practice problems
- GET /api/problems/:id - Get problem details

### Simulation Routes
- GET /api/simulations - List simulation problems
- GET /api/simulations/:id - Get simulation details

### Submission Routes
- POST /api/submissions - Submit code for evaluation
- GET /api/submissions - Get user's submission history
- GET /api/submissions/:id - Get submission details

### Progress Routes
- GET /api/progress - Get user progress
- GET /api/progress/streak - Get current streak

### Recommendation Routes
- GET /api/recommendations/next - Get next recommended action

### Open Source Routes
- GET /api/open-source/guides - List repository guides
- GET /api/open-source/guides/:id - Get guide details

### Contribution Proof Routes
- POST /api/contribution-proof - Submit contribution proof
- GET /api/contribution-proof - Get user's proofs
- PUT /api/contribution-proof/:id/verify - Verify proof (contributor/admin only)

### Contributor Routes
- GET /api/contributors - List verified contributors
- GET /api/contributors/:id - Get contributor profile

### Feedback Routes
- POST /api/feedback - Submit feedback

## UI Surfaces Created or Changed

None - Foundation section focuses on backend structure and contracts.

## Security Considerations

- All routes require proper authentication guards
- Passwords stored as bcrypt hashes
- JWT tokens with expiration
- Input validation on all endpoints
- Rate limiting on auth and submission endpoints
- RBAC for role-based access
- Audit logging for sensitive operations

## Edge Cases

- Unsupported stacks marked as docs-only
- Users cannot access advanced content without prerequisites
- Code execution limited to supported stacks (initially JavaScript only)
- Contribution verification requires manual review

## Testing Done

- Structure validation: Directory structure created correctly
- Documentation completeness: All required docs created
- Contract validation: API routes documented with request/response shapes

## Blockers / Risks

- MERN stack compliance: No non-MERN dependencies introduced
- Modular isolation: Modules designed with clear boundaries
- Runner isolation: Evaluation-runner module designed for sandboxed execution

## Change Log

- Initial project structure created
- Frontend and backend modules scaffolded
- Documentation framework established
- Domain models defined
- API contracts documented
- Development tooling configured
- ADRs created for key decisions

## What the Next Section Must Read

Section B (Onboarding and Identity) must read:
- This foundation document for overall architecture
- /docs/00-product-truth.md for core product constraints
- /docs/01-system-map.md for module relationships
- ADR on modular architecture and progression rules
- API contracts for auth and onboarding routes
- Domain models for User, Role, TechStack, SkillDomain, DifficultyLevel

Completion Note:
- Structure exists: ✅
- Docs exist: ✅
- Contracts exist: ✅
- Section document updated: ✅
- Changelog updated: ✅