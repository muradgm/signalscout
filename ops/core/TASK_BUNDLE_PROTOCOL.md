# Task Bundle Protocol

## Standard Task Folder
Every task should use this flat structure unless an assignment packet explicitly overrides it:

ops/runtime/tasks/TASK_ID/
- assignment.md
- return.md
- qa.md
- decision.md

## Purpose of Each File

### assignment.md
The active assignment packet.
Defines:
- task id
- owner lane
- objective
- scope
- allowed paths
- required output
- validation
- evidence requirements
- escalation condition

### return.md
The owner lane’s actual deliverable and structured return.
Must contain:
- files read
- files changed if any
- actual work performed
- validation evidence
- unresolved issues
- risks
- completion status

### qa.md
Independent QA review of the assignment and return artifacts.
Must contain:
- review scope
- artifacts reviewed
- findings
- verdict
- pass/fail reasoning
- corrective requirements if applicable

### decision.md
PM decision after reviewing assignment, return, and QA findings.
Must contain:
- verdict
- accepted / accepted with notes / rejected / escalated
- required follow-up
- runtime state recommendation

## Default Handoff Commands

### Owner lane
Read:
`ops/runtime/tasks/TASK_ID/assignment.md`

Write:
`ops/runtime/tasks/TASK_ID/return.md`

### QA lane
Review:
- `ops/runtime/tasks/TASK_ID/assignment.md`
- `ops/runtime/tasks/TASK_ID/return.md`

Write:
`ops/runtime/tasks/TASK_ID/qa.md`

### PM lane
Review:
- `ops/runtime/tasks/TASK_ID/assignment.md`
- `ops/runtime/tasks/TASK_ID/return.md`
- `ops/runtime/tasks/TASK_ID/qa.md`

Write:
`ops/runtime/tasks/TASK_ID/decision.md`

## Readiness Rule
No task should be treated as ready for acceptance unless the required task-bundle artifact exists and contains the real deliverable, not just a narrative summary.

## Review Rule
QA and PM must review the files themselves, not rely only on what the lane claims in chat.

## Learning Rule
After important accepted tasks, log lessons learned in:
`ops/runtime/LEARNING_LOG.md`

## Canonical Artifact Rule

For active tasks, the canonical files are:

- assignment.md
- return.md
- qa.md
- decision.md

Nested artifacts such as:
- packets/TASK_ID.md
- returns/TASK_ID.md
- qa/TASK_ID.md
- decisions/TASK_ID.md

are considered legacy compatibility artifacts only unless a task explicitly overrides this rule.

When both flat and nested versions exist, the flat root-level files are the source of truth.