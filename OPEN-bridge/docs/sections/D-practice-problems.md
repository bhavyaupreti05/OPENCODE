# D - Practice Problems Engine

## Purpose

Implement the practice problem solving system that provides structured coding challenges to build confidence and skills before moving to real-world simulations. This creates the "Practice" phase of the learning journey.

## Exact Scope

- Practice problem catalog management
- Problem display and solving interface
- Code submission and evaluation
- Basic automated testing for practice problems
- Progress tracking for practice completion

## Module(s) Created or Changed

### Backend Modules
- problems: Practice problem management and catalog
- submissions: Code submission handling for practice problems
- evaluation-runner: Basic code execution for practice problems

### Frontend Modules
- problem-catalog: Browse and select practice problems
- practice-workspace: Code editor and submission interface

## Data Models Created or Changed

### Problem Model (Enhanced)
- Fields: _id, title, description, difficultyId (ref), stackId (ref), skillId (ref), problemType (practice), testCases (array), starterCode, solution, hints, tags, createdAt, updatedAt

### Submission Model (Enhanced)
- Fields: _id, userId (ref), problemId (ref), code, language, status (pending/passed/failed), results, submittedAt

## API Routes Created or Changed

### Practice Problem Routes
- GET /api/problems
  - Auth: Required
  - Query: stackId, skillId, difficultyId
  - Response: Filtered practice problems
- GET /api/problems/:id
  - Auth: Required
  - Response: Problem details with test cases hidden
- POST /api/problems/:id/submit
  - Auth: Required
  - Request: { code, language }
  - Response: Submission result

### Submission Routes
- GET /api/submissions
  - Auth: Required
  - Response: User's practice submissions
- GET /api/submissions/:id
  - Auth: Required
  - Response: Submission details

## User Experience

### Problem Catalog
- Browse problems by stack, skill, difficulty
- See problem title, description preview, difficulty
- Filter and search functionality

### Practice Workspace
- Code editor with syntax highlighting
- Problem description and constraints
- Test case examples (not full test suite)
- Submit button with immediate feedback
- Basic automated testing results

## Security Considerations

- Code execution isolation for practice problems
- Submission rate limiting
- Solution code protection
- User code sandboxing

## Edge Cases

- Code execution timeouts
- Infinite loops in user code
- Large input/output handling
- Multiple language support
- Memory limit enforcement

## Testing Done

- Problem retrieval and filtering tests
- Submission processing tests
- Basic code evaluation tests
- Frontend problem display tests

## Blockers / Risks

- Code execution environment setup
- Test case design complexity
- Performance with concurrent submissions
- Language runtime availability

## Change Log

- ✅ Implemented problems module with MVC structure (models, services, controllers, routes, validators)
- ✅ Created Problem model with test cases, solution, hints, and filtering capabilities
- ✅ Built problemsService with CRUD operations, filtering, and search functionality
- ✅ Added problemsController with API handlers for all problem operations
- ✅ Created problems routes with proper validation and error handling
- ✅ Implemented comprehensive unit tests for problems service (10/10 tests passing)
- ✅ Updated seed script with sample practice problems (Two Sum, Reverse String)
- ✅ Integrated problems module into server.js with route registration
- ✅ **Implemented submissions module with full MVC structure**
- ✅ **Created Submission model with results tracking and status management**
- ✅ **Built submissionsService with evaluation, stats, and CRUD operations**
- ✅ **Added submissionsController with API handlers for submission management**
- ✅ **Created submissions routes with validation and user access control**
- ✅ **Implemented comprehensive unit tests for submissions service (15/15 tests passing)**
- ✅ **Integrated submissions module into server.js with route registration**
- ✅ Code evaluation and execution environment implemented for JavaScript submissions
- ⏳ Practice workspace UI (pending)

## What the Next Section Must Read

Section E must read:
- This document for practice problem implementation
- /docs/00-product-truth.md for practice phase requirements
- /docs/01-system-map.md for module dependencies
- ADR 003 for runner isolation requirements
- API contracts for problems routes
- API contracts for submissions routes
- Domain models for Problem and Submission
- problemsService API for problem retrieval and filtering
- submissionsService API for submission management and evaluation

Completion Note:
- ✅ Practice problem backend module: Complete
- ✅ Problem catalog API: Complete
- ✅ Unit tests: Complete
- ✅ **Submission system backend: Complete**
- ✅ **Submission API: Complete**
- ✅ Code evaluation environment: Implemented for JavaScript
- ⏳ Practice workspace UI: Pending
- ✅ Docs and changelog updated: Complete