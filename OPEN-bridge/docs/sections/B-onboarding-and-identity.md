# B - Onboarding and Identity

## Purpose

Implement user identity management and guided onboarding to capture user preferences for tech stack, skill domain, and difficulty level. This establishes the foundation for personalized learning paths.

## Exact Scope

- User authentication (signup, login, JWT sessions)
- Password hashing and secure storage
- Role-based access control
- Guided onboarding flow for stack/skill/difficulty selection
- User profile persistence and retrieval
- Beginner-friendly UI without clutter or jargon

## Module(s) Created or Changed

### Backend Modules
- auth: Full implementation of authentication services
- users: User profile management
- onboarding: Onboarding data handling

### Frontend Modules
- auth: Login/signup UI
- onboarding: Guided onboarding flow UI
- user-profile: Profile display and editing

## Data Models Created or Changed

### User Model
- Fields: _id, email, passwordHash, role (ref to Role), onboardingCompleted (boolean), selectedStack (ref), selectedSkill (ref), selectedDifficulty (ref), createdAt, updatedAt

### Role Model
- Fields: _id, name (normal, verified_contributor, admin), permissions (array)

### Onboarding Data
- Embedded in User model or separate collection if complex

## API Routes Created or Changed

### Authentication Routes
- POST /api/auth/signup
  - Request: { email, password, confirmPassword }
  - Response: { user, token }
  - Validation: Email format, password strength, uniqueness
- POST /api/auth/login
  - Request: { email, password }
  - Response: { user, token }
  - Validation: Credentials check
- POST /api/auth/refresh
  - Request: { token }
  - Response: { token }
- POST /api/auth/logout
  - Request: { token }
  - Response: { success: true }

### User Routes
- GET /api/users/profile
  - Auth: Required
  - Response: User profile data
- PUT /api/users/profile
  - Auth: Required
  - Request: Profile updates
  - Response: Updated user

### Onboarding Routes
- POST /api/onboarding
  - Auth: Required
  - Request: { stackId, skillId, difficultyId, confidenceLevel, experience }
  - Response: { success: true, user }
- GET /api/onboarding/status
  - Auth: Required
  - Response: { completed: boolean, data }

## UI Surfaces Created or Changed

### Auth Pages
- Login page: Email/password form, signup link
- Signup page: Registration form with validation
- Password requirements display

### Onboarding Flow
- Welcome screen with beginner-friendly messaging
- Tech stack selection (guided, not overwhelming)
- Skill/domain selection based on stack
- Difficulty selection (beginner-focused)
- Confidence self-assessment
- Progress indicators

### Profile Page
- Display user info and selections
- Edit capabilities for non-onboarding data

## Security Considerations

- Password hashing with bcrypt (12 rounds)
- JWT tokens with 7-day expiration
- Rate limiting on auth endpoints (100 requests/15min)
- Input sanitization and validation
- No password in responses
- Secure token storage (httpOnly cookies recommended)

## Edge Cases

- Duplicate email registration
- Invalid JWT tokens
- Incomplete onboarding data
- Role permission checks
- Password reset (future consideration)

## Testing Done

- Auth service unit tests
- API route integration tests
- Frontend component tests
- End-to-end onboarding flow test

## Blockers / Risks

- JWT secret management
- Password strength requirements
- Onboarding UI complexity for beginners

## Change Log

- Implemented auth module with JWT and bcrypt
- Created user and role models
- Built auth API routes with validation
- Developed onboarding backend logic
- Created auth and onboarding UI components
- Added user profile management

## What the Next Section Must Read

Section C (Learning Path and Documentation Engine) must read:
- This document for user identity and onboarding implementation
- /docs/00-product-truth.md for learning journey requirements
- /docs/01-system-map.md for module dependencies
- ADR 004 for progression rules
- API contracts for stacks, skills, paths, docs routes
- Domain models for TechStack, SkillDomain, DifficultyLevel, LearningPath, LearningNode

Completion Note:
- User can sign up and log in: ✅
- Onboarding data persists: ✅
- Profile is retrievable: ✅
- Docs and changelog updated: ✅