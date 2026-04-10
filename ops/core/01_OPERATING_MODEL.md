# OPERATING MODEL

## Modes

### Human-directed mode
Use when:
- product truth is changing
- a task crosses lanes or files with high blast radius
- a decision changes product messaging, workflow promise, or architecture direction

### PM-routed mode
Use when:
- the task is bounded
- relevant truth is stable enough
- the lane benchmark exists
- rollback is obvious

### Agent-executed mode
Use when:
- the packet is explicit
- allowed files are narrow
- outputs are contractable or reviewable
- benchmark and validation are named in advance

## Autonomy gates

### Gate A — advisory
Agent may analyze and propose, but not modify canonical truth.

### Gate B — bounded execution
Agent may execute inside the named files and return evidence.

### Gate C — repeatable lane execution
Reserved for well-benchmarked repetitive work with low blast radius.

## Acceptance path

assignment packet -> specialist execution -> QA review -> PM decision -> runtime update
