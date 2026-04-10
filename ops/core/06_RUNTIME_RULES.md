# RUNTIME RULES

## Purpose
Runtime files are the single source of execution status for the system.

Agents may explain work, but they do not define status. Status is recorded in runtime ledgers.

## Core runtime principle
If a task, benchmark result, failure, or decision is not reflected in the proper runtime file, the system should treat it as incomplete or untracked.

## Runtime files and their jobs
- `ops/runtime/PM_REVIEW_QUEUE.md` — tasks waiting for PM review, routing, or acceptance
- `ops/runtime/AGENT_SCOREBOARD.md` — lane-level quality and reliability trends
- `ops/runtime/RUNTIME_METRICS.md` — aggregate metrics such as throughput, pass rate, and rework rate
- `ops/runtime/FAILURE_PATTERNS.md` — repeated execution failures and drift patterns
- `ops/runtime/LEARNING_LOG.md` — lessons converted into durable process updates
- `ops/runtime/BENCHMARK_REGISTRY.md` — benchmark packs, status, and ownership
- `ops/runtime/bootstrap/` — lane boot files used to initialize dedicated agent chats

## Runtime update requirements
A runtime update is required when:
1. a new meaningful task enters execution
2. a task changes status
3. a benchmark pack is added, changed, passed, or failed
4. a QA outcome is recorded
5. a repeated failure pattern is identified
6. a process lesson becomes durable guidance

## Minimum status states
Use only explicit states:
- NOT STARTED
- IN PROGRESS
- READY FOR QA
- PASS WITH NOTES
- COMPLETE
- BLOCKED
- ESCALATED

Avoid narrative-only states such as “almost done” or “basically complete.”

## Ownership rules
- PM owns routing and status discipline
- QA owns review verdicts
- specialist lanes own accurate execution returns
- humans own wedge changes, priority overrides, and policy decisions

## Ledger discipline
Every meaningful task must have a traceable path:
1. assignment packet created
2. lane executes inside allowed scope
3. lane returns structured result
4. QA records verdict
5. PM records acceptance or return
6. runtime files are updated

## Anti-drift rules
- Do not infer status from confidence or tone
- Do not skip runtime updates because a task is “small” if it materially changes product behavior or repo truth
- Do not overwrite prior failures; append and learn from them
- Do not move a task to COMPLETE before QA and PM acceptance are both recorded when the gate requires review

## Future upgrade rule
As the system grows, add runtime files only when they reduce ambiguity. Do not create ledgers that nobody will maintain.
