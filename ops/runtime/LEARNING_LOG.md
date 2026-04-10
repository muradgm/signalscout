# LEARNING LOG

Every returned task, critical failure, or important accepted improvement must create an entry.

---

## ENTRY TEMPLATE

### L-XXX
Date:
Task ID:
Agent:
Outcome:
- accepted
- partial
- returned
- blocked

Failure Type:
- prompt weakness
- benchmark gap
- schema mismatch
- truth mismatch
- scope ambiguity
- reasoning weakness
- validation weakness
- implementation defect

What happened:

Root cause:

What changed:
- agent contract change
- prompt pack change
- benchmark expansion
- PM rule change
- validation rule change
- tracklist reprioritization

Recurrence risk:
- low
- medium
- high

Next prevention step:

---

## INITIAL EXAMPLE

### L-001
Date: 2026-04-05
Task ID: AI-P0-001
Agent: AI
Outcome: returned

Failure Type:
- reasoning weakness

What happened:
Audit output improved slightly but still used generic statements without enough evidence linkage.

Root cause:
Agent contract was too loose and benchmark coverage was too narrow.

What changed:
- AI contract upgraded
- schema tightened
- benchmark pack expanded
- PM review checklist strengthened

Recurrence risk:
- medium

Next prevention step:
Require claim-to-evidence mapping in every audit output.
