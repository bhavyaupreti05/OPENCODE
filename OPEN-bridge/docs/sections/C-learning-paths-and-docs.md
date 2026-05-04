# C - Learning Path and Documentation Engine

## Purpose

Implement the core learning path generation and documentation content management system. This creates personalized learning journeys based on user onboarding selections and provides structured documentation content for guided learning.

## Exact Scope

- Learning path generation based on stack/skill/difficulty
- Documentation content storage and retrieval
- Learning node progression tracking
- Prerequisite system enforcement
- Beginner-friendly content organization

## Module(s) Created or Changed

### Backend Modules
- paths: Learning path generation and management
- docs: Documentation content management
- progress: Progress tracking for learning nodes

### Frontend Modules
- skill-path: Learning path display and navigation
- docs-library: Documentation viewing interface

## Data Models Created or Changed

### LearningPath Model
- Fields: _id, userId (ref), stackId (ref), skillId (ref), difficultyId (ref), nodes (array of node refs), createdAt, updatedAt

### LearningNode Model
- Fields: _id, pathId (ref), title, description, contentType (doc/practice/simulation), contentId (ref), prerequisites (array of node refs), order, estimatedTime, createdAt

### DocsEntry Model
- Fields: _id, title, content, stackId (ref), skillId (ref), difficultyId (ref), contentType (guide/tutorial/reference), tags (array), createdAt, updatedAt

## API Routes Created or Changed

### Learning Path Routes
- GET /api/paths
  - Auth: Required
  - Response: User's learning paths
- POST /api/paths/generate
  - Auth: Required
  - Request: { stackId, skillId, difficultyId }
  - Response: Generated learning path
- GET /api/paths/:id
  - Auth: Required
  - Response: Learning path with nodes

### Documentation Routes
- GET /api/docs
  - Query: stackId, skillId, difficultyId, contentType
  - Response: Filtered documentation entries
- GET /api/docs/:id
  - Response: Documentation content
- POST /api/docs
  - Auth: Admin required
  - Request: Documentation data
  - Response: Created doc entry

### Progress Routes
- GET /api/progress
  - Auth: Required
  - Response: User progress data
- POST /api/progress/:nodeId/complete
  - Auth: Required
  - Response: Updated progress

## UI Surfaces Created or Changed

### Learning Path Display
- Path overview with node progression
- Current node highlighting
- Prerequisite visualization
- Estimated time indicators

### Documentation Viewer
- Content display with navigation
- Related content suggestions
- Progress integration
- Beginner-friendly formatting

## Security Considerations

- Content access based on user permissions
- Progress manipulation prevention
- Admin-only content creation

## Edge Cases

- Path regeneration for changed preferences
- Incomplete prerequisite chains
- Content availability for stack/skill combinations
- Progress rollback scenarios

## Testing Done

- Path generation unit tests
- Content retrieval integration tests
- Progress tracking tests
- Frontend path display tests

## Blockers / Risks

- Content creation complexity
- Path personalization accuracy
- Performance with large content sets

## Change Log

- Implemented learning path generation
- Created documentation content management
- Added progress tracking system
- Built path display UI
- Integrated documentation viewer

## What the Next Section Must Read

Section D must read:
- This document for learning path implementation
- /docs/00-product-truth.md for learning journey requirements
- /docs/01-system-map.md for module dependencies
- ADR 004 for progression rules
- API contracts for paths, docs, progress routes
- Domain models for LearningPath, LearningNode, DocsEntry

Completion Note:
- Learning paths generated: ✅ (Backend models, services, controllers, routes implemented)
- Documentation content available: ✅ (Backend docs management system complete)
- Progress tracking works: ✅ (Backend progress tracking implemented)
- Docs and changelog updated: ✅