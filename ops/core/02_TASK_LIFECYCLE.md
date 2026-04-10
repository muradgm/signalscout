# TASK LIFECYCLE — V3

Every meaningful task must move through these states:

1. `identified`
2. `packeted`
3. `in_progress`
4. `agent_returned`
5. `qa_review`
6. `pm_decision`
7. `accepted | returned | blocked | escalated`
8. `runtime_logged`

## Rules

- no work starts before `packeted`
- no acceptance before `qa_review`
- no new adjacent task until `runtime_logged`
- if returned twice, PM must either narrow the task or escalate
- if blocked due to truth conflict, create / update active decision entry before reassigning
