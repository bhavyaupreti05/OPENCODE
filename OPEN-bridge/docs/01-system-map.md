# System Map

## Overview

OPEN-bridge is a MERN stack application designed to guide beginners from confusion to confident open-source contribution through structured learning, practice, simulation, and guided exposure.

## Architecture

The system is built with a modular architecture, separating frontend and backend into independent modules with clear responsibilities.

### Frontend Modules

- **app-shell**: Main application shell and routing
- **auth**: Authentication UI (login, signup)
- **onboarding**: User onboarding flow
- **user-profile**: User profile management
- **stack-selection**: Tech stack selection interface
- **skill-path**: Skill/domain selection and path display
- **docs-library**: Documentation viewing interface
- **problem-catalog**: Browse practice and simulation problems
- **practice-workspace**: Practice problem solving interface
- **simulation-workspace**: Simulation bug-fixing interface
- **progress**: Progress dashboard and tracking
- **recommendation**: Recommendation display
- **open-source-bridge**: Open-source guidance interface
- **contribution-proof**: Contribution proof submission
- **contributor-console**: Contributor management console
- **feedback-help**: Feedback and help surfaces

### Backend Modules

- **auth**: Authentication services (JWT, password hashing)
- **users**: User management
- **onboarding**: Onboarding data handling
- **stacks**: Tech stack catalog
- **skills**: Skill/domain catalog
- **docs**: Documentation content management
- **problems**: Practice problem management
- **simulations**: Simulation problem management
- **submissions**: Code submission handling
- **evaluation-runner**: Isolated code execution and evaluation
- **progress**: Progress tracking
- **recommendations**: Recommendation engine
- **open-source-guides**: Repository guides
- **contribution-proof**: Contribution proof verification
- **contributors**: Contributor profile management
- **feedback**: Feedback collection
- **audit**: Audit logging

### Data Model

Core collections in MongoDB:

- users
- contributorProfiles
- techStacks
- skillDomains
- learningPaths
- learningNodes
- docsEntries
- problems
- simulations
- submissions
- progress
- streaks
- xpEvents
- repoGuides
- contributionProofs
- feedback
- auditLogs

### API Structure

Routes grouped by module:

- /api/auth/*
- /api/users/*
- /api/onboarding/*
- /api/stacks/*
- /api/skills/*
- /api/paths/*
- /api/docs/*
- /api/problems/*
- /api/simulations/*
- /api/submissions/*
- /api/progress/*
- /api/recommendations/*
- /api/open-source/*
- /api/contribution-proof/*
- /api/contributors/*
- /api/feedback/*