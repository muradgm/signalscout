# RETURN VALIDATION RULES — V3

An agent return is invalid if:
- changed files exceed packet scope
- benchmark result is missing
- known risks are empty on a non-trivial task
- confidence note is assertive without evidence
- output says “done” but runtime-impacting follow-through is absent
