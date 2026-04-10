# DECISION FLAGS

This file tracks issues that require human decision.

These are not implementation questions.
These are decision-boundary questions.

---

## OPEN FLAGS

### D-001 — What should happen to empty or misleading secondary dashboard pages?
Why decision is needed:
- this changes visible product scope
- implementation cleanup alone may still send wrong signals

Options:
- remove completely
- hide from nav
- mark as internal/future and freeze
- build one selected page if justified

Recommendation:
- prefer hide or remove unless a page supports current wedge directly

Touched files/areas:
- dashboard shell / nav / page routes

---

### D-002 — How strong is the product claim around reply workflow today?
Why decision is needed:
- current surfaces may imply stronger operational depth than validated

Options:
- keep minimal reply visibility only
- define reply workflow as experimental/internal
- expand and validate later

Recommendation:
- define as visibility-only unless deeper validation is completed

---

### D-003 — When can the system move from Cautious Build to Stabilized Scale?
Why decision is needed:
- autonomy and prioritization depend on it

Proposed threshold:
- benchmark pass rate >= 90%
- no critical failures in 10 accepted tasks
- active conflicts reduced
- at least one task family promoted to Gate A

Recommendation:
- accept threshold unless human wants stricter gating

---

## FLAG RULE

Agents may identify a decision flag.
Only PM may log it.
Only human may close it unless explicit authority is granted.
