# ASSIGNMENT PACKET

## TASK ID
[UX-P1-001]

## TASK TYPE
ux_specification

## OBJECTIVE
Produce implementation-ready UX decisions for the assigned flow, screen, or interaction problem. The deliverable must reduce ambiguity, improve usability, and give downstream implementation lanes clear behavior, states, and edge-case handling.

## OWNER LANE
UX

## SCOPE
In scope:
- flow definition
- screen structure
- interaction logic
- state behavior
- edge-case handling
- information hierarchy
- usability improvements
- microcopy direction if directly needed for the UX task
- handoff-ready UX specification

Out of scope:
- frontend implementation
- backend implementation
- broad product redefinition
- GTM messaging
- visual design theater disconnected from usability
- unsupported feature invention
- architecture changes outside what the task explicitly permits

## AUTHORITATIVE FILES
- task bundle assignment file
- current product/spec files for the affected flow or feature
- relevant UI files or screen references
- relevant architecture or API constraints if they affect the UX behavior
- current design docs, flow docs, or decision records if referenced by the assignment
- task-specific decision artifacts if referenced

## CONTEXT
You are the UX lane. Your responsibility is to make interaction behavior clear and buildable. You are not here to decorate screens or invent features to patch unclear requirements. If the requested UX solution depends on undefined product or system behavior, escalate instead of guessing.

## REQUIRED OUTPUT
You must produce all of the following:
- implementation-ready UX deliverable for the assigned problem
- structured flow and state logic
- key interaction rules
- edge cases and failure states
- handoff notes for implementation lanes where applicable
- a structured return artifact written to the assigned task bundle return file

## CONSTRAINTS
- do not invent new features unless explicitly assigned
- do not provide vague design prose
- do not ignore technical or product constraints in authoritative files
- do not optimize aesthetics over clarity
- do not describe outcomes without specifying the user flow and state logic that produce them
- do not hand off ambiguous behavior to implementation lanes

## ALLOWED PATHS
- docs/
- design/
- ops/
- task bundle files for the active task only
- app UI files only if explicitly allowed by the assignment

## FILES LIKELY TOUCHED
- list exact docs/spec files to produce or update if applicable
- if no product files are changed, record the UX artifact location in the return

## DONE WHEN
The task is done only when:
- the target flow or screen behavior is clearly defined
- states and transitions are explicit
- edge cases are covered
- downstream implementation can proceed without guessing core behavior
- the structured return artifact is written to the required task file

## VALIDATION
Validation must include:
- review against the user goal and completion path
- explicit state coverage including loading, empty, success, and failure conditions where relevant
- check for ambiguity, unnecessary steps, and missing decision points
- check alignment with authoritative product and technical constraints

## REQUIRED EVIDENCE
The return artifact must include:
- files read
- files changed if any
- final UX deliverable summary
- flow/state coverage
- edge cases covered
- unresolved issues
- risks
- recommended next action
- completion status

## ESCALATION CONDITION
Escalate immediately if:
- product behavior required for the UX decision is undefined
- technical constraints block the requested UX solution
- authoritative files conflict materially
- the task expects implementation rather than UX specification
- the requested UX outcome cannot be made buildable within current scope

## BENCHMARK PACK
Use only if explicitly specified in the assignment packet.

## PRIORITY
[P1]

## GATE LEVEL
[A]