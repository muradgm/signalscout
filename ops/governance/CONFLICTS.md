# CONFLICTS

This file records conflicts between:
- code reality
- product definition
- runtime assumptions
- agent proposals

Each conflict must end with one disposition:
- keep
- freeze
- hide
- remove
- escalate

---

## ACTIVE CONFLICTS

### C-001 — Secondary dashboard breadth overstates product reality
Type:
- product-shell conflict

Reality:
- core wedge is lead review and outreach execution

Conflict:
- extra dashboard pages imply broader product completeness than current repo truth supports

Risk:
- false product expectations
- wasted review attention
- PM/agent confusion

Owner:
- PM + FS + UX

Required decision:
- hide / remove / freeze each page explicitly

Gate:
- C if product implication is unclear
- B if only implementation cleanup is needed

Status:
- open

---

### C-002 — Reply visibility exists but reply workflow maturity is still limited
Type:
- maturity conflict

Reality:
- reply persistence and surfaces exist

Conflict:
- visibility may imply a broader validated reply workflow than current evidence supports

Risk:
- overclaiming product maturity

Owner:
- PM + DATA + UX

Required decision:
- define reply workflow promise boundary

Status:
- open

---

### C-003 — Discovery concept exists as future direction, not current product truth
Type:
- roadmap/truth conflict

Reality:
- territory-based lead generation concept exists as a future note

Conflict:
- it must not be treated as active scope

Risk:
- scope drift
- agent misassignment
- product narrative dilution

Owner:
- PM + GTM + Human

Required decision:
- keep as future concept only

Status:
- constrained / not active

---

## RESOLUTION RULE

No active task may silently assume a conflict is already resolved.
If a task touches an active conflict:
- PM must reference the conflict ID
- gate must be checked
