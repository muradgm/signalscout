# QA GATE

## Purpose
The QA gate prevents the system from accepting work based on polish, confidence, or narrative alone.

Every meaningful task that changes files, updates product behavior, modifies operator-visible output, or produces artifacts used by another lane must pass QA before it can be marked **COMPLETE**.

## Why the gate exists
SignalScout’s highest system risk is false completion:
- work sounds correct but is not validated
- output is directionally good but not assignment-complete
- files changed outside the allowed scope
- quality claims are made without evidence
- hidden regressions are introduced by broad changes

The QA gate creates independent friction between execution and acceptance.

## When QA is mandatory
QA review is required when any of the following is true:
1. files were created, edited, renamed, or deleted
2. product behavior, prompts, contracts, or benchmarks changed
3. operator-facing copy, UX flow, or audit/outreach output changed
4. a task is marked `READY FOR QA`
5. PM explicitly sets the gate to `review-required`

## Inputs required before QA starts
The executing lane must provide:
- the active assignment packet
- a structured agent return
- a list of files read
- a list of files changed
- validation evidence and benchmark results
- known risks, assumptions, and unresolved issues

If any of the above are missing, QA must reject the review as incomplete.

## What QA must verify
QA must independently check:
1. **assignment alignment** — the result matches the stated objective, in-scope work, deliverables, and done-when conditions
2. **path discipline** — no blocked files were changed and no out-of-scope directories were touched
3. **validation quality** — required tests, checks, or benchmark steps were actually performed and the evidence is credible
4. **truth alignment** — the work does not conflict with current truth docs, active decisions, or explicit product boundaries
5. **blast radius** — the change set is appropriately small for the task and rollback is realistic
6. **return quality** — the final output is in the required format and does not hide uncertainty or gaps

## QA outcomes
QA may return one of four outcomes:

### PASS
Use when:
- all required deliverables are present
- validation passed
- no material scope drift exists
- risks are documented and acceptable

### PASS WITH NOTES
Use when:
- the task meets acceptance criteria
- only minor follow-up or documentation cleanup remains
- the notes do not block the current release gate

### FAIL — RETURN TO LANE
Use when:
- required deliverables are missing
- validation is weak or absent
- the lane exceeded allowed scope
- truth conflicts were introduced
- the output contract was not respected

### FAIL — ESCALATE TO PM/HUMAN
Use when:
- the assignment packet is contradictory or unsafe
- truth docs conflict materially
- the change implies a wedge expansion or policy decision
- rollback is unclear for a risky operator-visible change

## Rejection rules
QA must reject work if any of the following is true:
- benchmark claims are asserted without evidence
- task completion is claimed without matching the `done_when` criteria
- files outside the allowed paths were modified
- required rollback notes are missing for an operator-visible change
- the lane relied on unstated assumptions instead of surfacing them
- the result solves a different problem than the packet defined

## QA output format
QA responses must include:
1. verdict: PASS / PASS WITH NOTES / FAIL — RETURN / FAIL — ESCALATE
2. summary of what was checked
3. reasons for the verdict
4. required fixes, if any
5. residual risks
6. confidence level
7. next owner

## Acceptance rule
A task can only become **COMPLETE** after:
- QA returns `PASS` or `PASS WITH NOTES`
- PM records the decision
- runtime ledgers are updated

Until then, the task remains incomplete regardless of how strong the narrative sounds.
