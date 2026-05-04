# ADR 004: User Progression Rules

## Status
Accepted

## Context
Users must follow structured learning journey: Learn → Practice → Simulate → Contribute. Cannot jump to advanced content prematurely.

## Decision
- Implement prerequisite system in learning paths
- Lock advanced simulations until practice completion
- Require minimum progress thresholds for unlocks
- Track completion in progress module
- Enforce rules at API level

## Consequences
- Positive: Maintains structured learning
- Positive: Builds confidence gradually
- Negative: May frustrate advanced users
- Negative: Requires careful rule design

## Alternatives Considered
- Free progression: Rejected - loses core value
- Optional structure: Rejected - not guided bridge

## Compliance
Preserves beginner-confidence-building angle and prevents reducing to generic platform.