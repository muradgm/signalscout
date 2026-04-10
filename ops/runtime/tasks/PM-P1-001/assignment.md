# ASSIGNMENT PACKET

## TASK ID
PM-P1-001

## TASK TYPE
planning

## OBJECTIVE
Review the current repository and ops system state, then produce the smallest valid execution plan for the next wave of work. Your job is not to execute specialist work. Your job is to convert the current state into assignment-packet-ready tasks for the correct lanes.

## OWNER LANE
PM

## SCOPE
In scope:
- inspect current ops runtime state
- inspect task queue state
- inspect active/bootstrap/runtime coordination files
- identify highest-leverage next tasks
- define task sequencing
- prepare assignment-packet-ready tasks for specialist lanes
- define done-when criteria, validation, and evidence requirements for each proposed task

Out of scope:
- performing specialist implementation
- editing product code
- acting as QA
- inventing work disconnected from current repo/runtime reality

## AUTHORITATIVE FILES
- ops/README.md
- ops/core/01_SYSTEM_OVERVIEW.md
- ops/core/02_TRUTH_HIERARCHY.md
- ops/core/03_TEAM_TOPOLOGY.md
- ops/core/04_ASSIGNMENT_FLOW.md
- ops/core/05_QA_SYSTEM.md
- ops/core/06_RUNTIME_RULES.md
- ops/runtime/PM_REVIEW_QUEUE.md
- ops/runtime/tasks/
- ops/runtime/bootstrap/PM_BOOT.md

## CONTEXT
The current goal is to strengthen and operationalize the semi-autonomous agent system so that future work is evidence-first, contract-driven, and difficult to fake through narrative completion. Recent updates improved templates, queue states, gates, and runtime task bundle structure. PM must now turn the current state into a disciplined next-task plan.

## REQUIRED OUTPUT
Produce all of the following:

1. Current-state assessment
- concise judgment of current ops maturity
- top weaknesses still blocking stronger autonomy
- top strengths worth preserving

2. Proposed next-task set
For each task include:
- task id
- title
- owner lane
- task family
- priority
- why now
- dependencies
- allowed paths
- files likely touched
- done-when
- validation required
- evidence required
- escalation condition
- benchmark pack if applicable
- recommended gate level

3. Sequencing
- order tasks from highest leverage to lowest
- identify which tasks can run in parallel and which cannot

4. Assignment-packet-ready output
- provide the next 3 highest-value tasks in packet-ready format so they can be handed directly to specialist lanes

## CONSTRAINTS
- do not execute specialist work
- do not write vague roadmap prose
- do not propose oversized tasks
- do not assign tasks without clear validation and evidence expectations
- prefer smallest viable tasks that improve operating reliability
- ground all recommendations in the current repo and runtime structure

## DONE WHEN
Done when PM has produced:
- a grounded assessment
- a prioritized and sequenced task set
- 3 packet-ready specialist tasks
- explicit validation/evidence expectations for each task

## VALIDATION
Your output will be accepted only if:
- tasks are specific enough to assign immediately
- each task has clear ownership
- each task has measurable completion criteria
- sequencing is realistic
- no specialist execution is mixed into PM planning

## REQUIRED EVIDENCE
- explicit references to the files/rules used in reasoning
- task definitions detailed enough for direct handoff
- no ambiguous “someone should improve X” statements

## ESCALATION CONDITION
Escalate if authoritative files conflict, runtime state is too incomplete to plan reliably, or task ownership cannot be assigned cleanly.

## PRIORITY
P1