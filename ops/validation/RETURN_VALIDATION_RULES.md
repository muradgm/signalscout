# RETURN VALIDATION RULES - V4

An agent return is invalid if:
- changed files exceed packet scope
- benchmark result is missing
- benchmark files referenced are missing on a benchmark-sensitive task
- evidence trace status is missing on an audit-lane task
- reviewability status is missing on an audit-lane task
- known risks are empty on a non-trivial task
- confidence note is assertive without evidence
- output says "done" but runtime-impacting follow-through is absent
