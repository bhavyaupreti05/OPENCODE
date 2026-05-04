# ADR 003: Code Execution Runner Isolation

## Status
Accepted

## Context
User code execution must be isolated from the main API server for security. Arbitrary code execution in the main process is dangerous.

## Decision
- Create dedicated evaluation-runner module
- Runner executes code in isolated environment/container
- No code execution in main API server process
- Strict resource limits (CPU, memory, time)
- Network and filesystem restrictions

## Consequences
- Positive: Security isolation
- Positive: Prevents server compromise
- Negative: Complexity of isolated execution
- Negative: Performance overhead

## Alternatives Considered
- In-process execution: Rejected - security risk
- External service: Considered but kept in-module for simplicity

## Compliance
Ensures safe execution of user-submitted code without compromising server integrity.