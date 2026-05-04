# ADR 002: MERN-Only Stack Compliance

## Status
Accepted

## Context
The product specification requires strict MERN stack: MongoDB, Express.js, React.js, Node.js. No substitutes allowed.

## Decision
- Backend: Node.js + Express.js + MongoDB only
- Frontend: React.js only (no Next.js unless as React shell)
- Database: MongoDB only (no PostgreSQL, Prisma, etc.)
- Authentication: JWT with bcrypt (no Firebase, Auth0)
- No additional frameworks or ORMs beyond core MERN

## Consequences
- Positive: Stays true to specification
- Positive: Simpler dependency management
- Negative: May require more custom implementation
- Negative: Limited to MERN ecosystem capabilities

## Alternatives Considered
- Adding NestJS: Rejected - not MERN
- Using Prisma: Rejected - not MERN
- Firebase: Rejected - not MERN

## Compliance
Strict adherence prevents stack drift and maintains product integrity.