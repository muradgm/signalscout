# SYSTEM OVERVIEW

## Purpose

SignalScout uses a semi-autonomous operating system to improve execution quality inside a narrow, truth-bounded product wedge.

The system exists to increase speed and quality **without** increasing drift, fake completion, or hallucinated progress.

## Control stack

1. Human
2. PM
3. QA gate
4. Specialist agent
5. Runtime ledger

## Why this structure exists

The main risk is not lack of ideas or lack of agents.
The main risk is accepting output that sounds convincing before it is validated against truth, scope, and benchmark evidence.

## Non-negotiables

1. No meaningful task starts without an assignment packet.
2. No meaningful task is accepted without QA review.
3. No scope expansion without human approval.
4. No benchmark claim without a recorded benchmark result.
5. No task is "done" until runtime is updated.
6. No agent writes outside the files allowed by its packet.
7. Any operator-visible change needs rollback notes.

## Mandatory read order

- `01_OPERATING_MODEL.md`
- `02_TASK_LIFECYCLE.md`
- `03_ASSIGNMENT_PACKET.md`
- `04_QA_GATE.md
- `05_OPERATING_PRINCIPLES.md`
- `06_RUNTIME_RULES.md``
- then governance and truth files relevant to the task
