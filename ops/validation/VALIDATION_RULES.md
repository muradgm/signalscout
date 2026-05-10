# VALIDATION RULES

## Global Rules

All agent outputs must be:

- grounded
- non-generic
- schema-valid
- traceable to allowed inputs
- truthful about uncertainty

---

## Invalid Output Patterns

Outputs are invalid if they:

1. claim evidence that was not provided
2. make broad product claims unsupported by truth files
3. use generic filler instead of case-specific analysis
4. omit required schema fields
5. silently cross scope boundaries
6. hide low confidence under assertive wording

---

## Acceptance Rule

An output may be accepted only when:
- schema-valid
- benchmark-reviewed
- consistent with project truth
- usable in downstream workflow

For audit-lane work, acceptance also requires:
- explicit evidence trace for each material claim
- explicit benchmark reference or explicit benchmark-gap note
- explicit uncertainty where evidence is weak
- output that remains reviewable without relying on polished narrative

If one of these fails:
- partial or return
