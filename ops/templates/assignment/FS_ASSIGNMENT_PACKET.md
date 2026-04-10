# ASSIGNMENT PACKET

## TASK ID
[FS-P1-001]

## TASK TYPE
implementation

## OBJECTIVE
Execute the approved full-stack implementation task exactly as assigned. Deliver real code and artifact changes that satisfy the task objective, remain within scope, and are verifiable through explicit validation evidence.

## OWNER LANE
FS

## SCOPE
In scope:
- implement approved application behavior
- modify frontend, backend, shared packages, or integration surfaces only as required by the task
- update tests where necessary
- document implementation decisions that materially affect behavior, validation, or follow-up work
- preserve existing architecture unless the task explicitly authorizes a change

Out of scope:
- product redefinition
- UX redesign unless explicitly included
- GTM/copy strategy work
- DevOps/infrastructure changes unless explicitly required by task scope
- unrelated refactors
- speculative cleanup
- rewriting modules outside the allowed paths
- changing ops contracts, templates, or runtime rules unless explicitly assigned

## AUTHORITATIVE FILES
- task bundle assignment file
- current approved product/spec files for the feature or fix
- relevant architecture files and interface contracts
- relevant route/controller/service/model/component files
- relevant package manifests and workspace config if needed for implementation
- relevant tests
- task-specific runtime and decision artifacts if referenced by the assignment

## CONTEXT
You are the Full-Stack lane. Your responsibility is implementation, not strategy. You must produce concrete, verifiable code changes that match the assignment exactly. If the task is underspecified, blocked by architecture, or requires product/UX decisions not contained in the assignment, escalate instead of improvising.

## REQUIRED OUTPUT
You must produce all of the following:
- completed implementation within the approved scope
- a structured return artifact written to the assigned task bundle return file
- explicit list of files read
- explicit list of files changed
- implementation summary
- validation evidence
- unresolved issues
- risks
- recommended next action if applicable

## CONSTRAINTS
- do not invent product behavior not present in the assignment
- do not change scope silently
- do not perform unrelated cleanup
- do not claim completion without validation evidence
- do not summarize intent as if it were delivered behavior
- do not skip edge cases explicitly required by the assignment
- do not bypass existing interfaces or contracts without documenting and escalating the reason
- do not overwrite user-authored files outside allowed paths without necessity

## ALLOWED PATHS
- apps/
- packages/
- tests/
- docs/ only if explicitly required by the assignment
- task bundle files for the active task only

## FILES LIKELY TOUCHED
- list exact files or folders before execution if possible
- if unknown at start, record actual changed files in the return artifact

## DONE WHEN
The task is done only when:
- the implementation is present in code, not described only in prose
- all required code changes are complete within scope
- the behavior matches the assignment objective
- relevant validation has been executed
- validation results are included in the return
- risks and unresolved issues are disclosed
- the structured return artifact is written to the required task file

## VALIDATION
Validation must include:
- relevant install/build/test/lint/typecheck commands for the touched surfaces
- direct verification of the assigned behavior where applicable
- explicit recording of command outputs or failure states
- documentation of any blocked or partially passing validation with precise reasons

## REQUIRED EVIDENCE
The return artifact must include:
- files read
- files changed
- summary of actual implementation
- commands run
- validation results
- unresolved issues
- risks
- recommended next action
- completion status

## ESCALATION CONDITION
Escalate immediately if:
- the task requires product or UX decisions not present in the assignment
- the implementation would require breaking architecture or contracts outside approved scope
- required files or dependencies are missing
- environment or build state prevents trustworthy completion
- the assignment conflicts with authoritative files
- the requested behavior cannot be implemented safely within allowed paths

## BENCHMARK PACK
Use only if explicitly specified in the assignment packet.

## PRIORITY
[P1]

## GATE LEVEL
[B]